"use client";

import { useEffect, useReducer, useRef, useCallback } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking";

type VoiceErrorType = "permission" | "no-mic" | "network" | "generic" | null;

interface VoiceState {
  status: VoiceStatus;
  isSupported: boolean; // SpeechRecognition constructor exists in this browser
  transcript: string; // live/final text of the user's current turn
  responseText: string; // assistant text accumulated so far, for live captions
  error: string | null;
  errorType: VoiceErrorType;
}

type Action =
  | { type: "SET_SUPPORTED"; supported: boolean }
  | { type: "START_LISTENING" }
  | { type: "INTERIM_TRANSCRIPT"; text: string }
  | { type: "FINAL_TRANSCRIPT"; text: string }
  | { type: "START_SPEAKING" }
  | { type: "APPEND_RESPONSE"; text: string }
  // Every path back to "idle" (success, error, manual stop) funnels through
  // this single action (edge case #14: explicit state machine instead of a
  // pile of booleans — there is exactly one way to reach "idle").
  | { type: "END_SESSION"; error?: { message: string; errorType: VoiceErrorType } };

const initialState: VoiceState = {
  status: "idle",
  isSupported: false,
  transcript: "",
  responseText: "",
  error: null,
  errorType: null,
};

function reducer(state: VoiceState, action: Action): VoiceState {
  switch (action.type) {
    case "SET_SUPPORTED":
      return { ...state, isSupported: action.supported };
    case "START_LISTENING":
      return { ...state, status: "listening", transcript: "", responseText: "", error: null, errorType: null };
    case "INTERIM_TRANSCRIPT":
      return { ...state, transcript: action.text };
    case "FINAL_TRANSCRIPT":
      return { ...state, status: "processing", transcript: action.text };
    case "START_SPEAKING":
      return state.status === "speaking" ? state : { ...state, status: "speaking" };
    case "APPEND_RESPONSE":
      return { ...state, responseText: action.text };
    case "END_SESSION":
      return {
        ...state,
        status: "idle",
        error: action.error?.message ?? null,
        errorType: action.error?.errorType ?? null,
      };
    default:
      return state;
  }
}

export interface VoiceExchange {
  user: string;
  assistant: string;
}

export interface UseVoiceChatOptions {
  /** Called once a full turn (user utterance + assistant reply) completes, so a
   * parent component (e.g. ChatWidget) can log it into its own message list
   * instead of this hook keeping a separate, disconnected conversation. */
  onExchange?: (exchange: VoiceExchange) => void;
  /** Override for the /api/chat URL. Defaults to the same local/prod
   * resolution ChatWidget.tsx already uses, so voice mode hits the identical
   * endpoint rather than a second copy of the pipeline. */
  endpoint?: string;
  /** External gate (e.g. the existing 6-exchange cap, or "text mode is
   * already sending") — when true, start() is a no-op. */
  disabled?: boolean;
}

export interface UseVoiceChatResult extends VoiceState {
  start: () => void;
  stop: () => void;
}

// -----------------------------------------------------------------------------
// Sentence splitting for low-latency TTS (edge case #11)
// -----------------------------------------------------------------------------

// Splits on ./!/? followed by whitespace-or-end. Network chunks rarely align
// with sentence boundaries, so this is run against a running buffer and
// returns whatever complete sentences it found plus the unconsumed remainder.
//
// Decimal numbers (e.g. "94.4%") need special handling: Groq streams
// token-by-token, so the buffer can momentarily be "...validated at 94."
// with the "4%" not having arrived yet. Naively treating that trailing
// period as a sentence end (matched via the regex's end-of-buffer branch)
// queues "94." for TTS immediately, then "4%" as a separate utterance —
// audible as "ninety-four... four percent". Two guards fix this: (1) mask
// any digit.digit period so it's never treated as a boundary once both
// digits are present, (2) if the buffer currently ends in "<digit>." with
// nothing after yet, hold that trailing period back in `rest` instead of
// resolving it, since more digits may still be streaming in.
function extractSentences(buffer: string): { sentences: string[]; rest: string } {
  const DECIMAL_PLACEHOLDER = "\u0000";
  const masked = buffer.replace(/(\d)\.(\d)/g, `$1${DECIMAL_PLACEHOLDER}$2`);

  const ambiguousTrailingDecimal = /\d\.$/;
  const heldBack = ambiguousTrailingDecimal.test(masked) ? masked.slice(-1) : "";
  const safeMasked = heldBack ? masked.slice(0, -1) : masked;

  const sentenceRegex = /[^.!?]*[.!?]+(?:\s+|$)/g;
  const sentences: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = sentenceRegex.exec(safeMasked)) !== null) {
    const sentence = match[0].trim();
    if (sentence) sentences.push(sentence.replace(new RegExp(DECIMAL_PLACEHOLDER, "g"), "."));
    lastIndex = sentenceRegex.lastIndex;
  }
  const rest = (safeMasked.slice(lastIndex) + heldBack).replace(new RegExp(DECIMAL_PLACEHOLDER, "g"), ".");
  return { sentences, rest };
}

// Ranked by how natural/professional they sound, best first. Availability
// depends entirely on OS + browser — voice lists can't be hardcoded, only
// preferred among whatever the runtime actually reports via getVoices().
// Edge on Windows exposes free neural "Online (Natural)" voices through this
// same API and sounds noticeably more human than Chrome's default; Safari's
// "Samantha" is the macOS equivalent.
const PREFERRED_VOICE_NAMES = [
  "Microsoft Ava Online (Natural) - English (United States)",
  "Microsoft Emma Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Google UK English Female",
  "Google US English",
  "Samantha",
  "Microsoft Zira - English (United States)",
];

function selectPreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  for (const name of PREFERRED_VOICE_NAMES) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  // Fall back to any English voice whose name suggests a female voice, so an
  // untested browser/OS combo still gets a reasonable pick instead of
  // whatever the platform's default (often male) voice is.
  const femaleGuess = voices.find((v) => v.lang.startsWith("en") && /female|zira|aria|jenny|emma|ava|samantha|susan|karen/i.test(v.name));
  return femaleGuess ?? undefined;
}

// The Web Speech API's SpeechSynthesisUtterance only accepts plain text — no
// SSML/IPA phoneme hints — so uncommon proper nouns get mangled by whatever
// grapheme-to-phoneme guesses the engine's dictionary makes. This swaps in a
// phonetic respelling *only* for what gets spoken; captions/messages still
// show the correctly-spelled original text untouched.
// Starting guess at a respelling that reads closer to "KEER-tha-na" — I can't
// hear the actual TTS output, so tune this by ear: open the widget, trigger
// a reply that says the name, and adjust the replacement string until it
// sounds right. Hyphens generally nudge most engines toward syllable breaks.
const PRONUNCIATION_OVERRIDES: [RegExp, string][] = [[/\bKeerthana\b/gi, "Keer-tha-na"]];

function applyPronunciationOverrides(text: string): string {
  let out = text;
  for (const [pattern, replacement] of PRONUNCIATION_OVERRIDES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

// The LLM's replies can contain markdown (bold, headings, bullets, and —
// since project-link CTAs use markdown link syntax — "[label](url)").
// SpeechSynthesisUtterance has no markdown awareness, so left unstripped
// these get read literally ("asterisk asterisk", "hash nav colon projects").
// Links are spoken as just their label text; the URL is meaningless aloud.
function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[*+-]\s+/gm, "");
}

const CTA_MARKER = "[CTA_CONTACT]";
const CTA_TEXT = "You can contact Keerthana directly at keerthana.b.v.codes@gmail.com";
function applyCtaMarker(text: string): string {
  return text.includes(CTA_MARKER) ? text.replace(CTA_MARKER, CTA_TEXT) : text;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useVoiceChat(options: UseVoiceChatOptions = {}): UseVoiceChatResult {
  const { onExchange, endpoint, disabled } = options;
  const [state, dispatch] = useReducer(reducer, initialState);

  // --- Refs for imperative, cross-callback state -----------------------------
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const ttsSupportedRef = useRef(false);
  const mountedRef = useRef(true);

  // True from the moment recognition.start() succeeds until onend/onerror
  // fires. Exists solely to guard edge case #5 (no overlapping instances).
  const isRecognitionActiveRef = useRef(false);
  // Set immediately before *we* call recognition.abort()/.stop(), so the
  // resulting onerror('aborted')/onend firings can tell "we did this on
  // purpose" apart from a browser-initiated stop (edge case #7).
  const intentionalStopRef = useRef(false);
  // True for the whole "conversation", from the user's first mic tap until
  // they hit Stop (or a fatal error ends it). Drives whether the mic should
  // auto re-arm after the bot finishes speaking.
  const sessionActiveRef = useRef(false);
  // Records whether onerror already handled the current recognition
  // session, so the onend that follows doesn't double-handle it.
  const lastErrorHandledRef = useRef(false);

  // TTS queue: sentences waiting to be spoken, plus whether the network
  // stream for the current turn has finished producing more of them.
  const speechQueueRef = useRef<string[]>([]);
  const streamFinishedRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // getVoices() is often empty until the browser fires 'voiceschanged'
  // asynchronously, so this is populated both immediately and on that event.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // The three recognition event handlers are attached exactly once (mount
  // effect). Everything else in this hook is redefined every render so it
  // always closes over the latest `state`/props — these refs are the bridge
  // that lets the long-lived recognition instance always call the *current*
  // render's logic instead of whatever was captured at mount time.
  const onResultRef = useRef<(e: SpeechRecognitionEvent) => void>(() => {});
  const onErrorRef = useRef<(e: SpeechRecognitionErrorEvent) => void>(() => {});
  const onEndRef = useRef<() => void>(() => {});
  const startRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  // --- Session-ending helper ---------------------------------------------
  function endSession(error?: { message: string; errorType: VoiceErrorType }) {
    sessionActiveRef.current = false;
    dispatch({ type: "END_SESSION", error });
  }

  // --- TTS playback ---------------------------------------------------------

  function speakNext() {
    if (!mountedRef.current) return;
    if (speechQueueRef.current.length === 0) {
      if (streamFinishedRef.current) finishSpeakingTurn();
      return; // queue empty but more chunks may still be streaming in
    }
    const sentence = speechQueueRef.current.shift()!;
    const utterance = new SpeechSynthesisUtterance(applyPronunciationOverrides(sentence));
    const voice = selectPreferredVoice(voicesRef.current);
    if (voice) utterance.voice = voice;
    // Slightly slower + a touch higher than default reads as calmer/more
    // professional than the flat 1.0/1.0 browser default. A small random
    // jitter per sentence (rather than identical values every time) avoids
    // the dead-flat cadence that makes back-to-back sentences sound most
    // robotic — the Web Speech API has no SSML/prosody control, so this is
    // a mitigation, not a real fix for expressive delivery.
    utterance.rate = 0.98 + (Math.random() * 0.06 - 0.03);
    utterance.pitch = 1.03 + (Math.random() * 0.08 - 0.04);
    currentUtteranceRef.current = utterance;
    utterance.onend = () => {
      currentUtteranceRef.current = null;
      speakNext();
    };
    utterance.onerror = () => {
      currentUtteranceRef.current = null;
      speakNext();
    };
    dispatch({ type: "START_SPEAKING" });
    window.speechSynthesis.speak(utterance);
  }

  function finishSpeakingTurn() {
    streamFinishedRef.current = false;
    if (sessionActiveRef.current) {
      // Edge case #9: only re-arm the mic here, after the utterance's onend
      // has actually fired — arming any earlier would let the mic capture
      // the tail of the bot's own voice and feed it back in as "user input".
      beginListening();
    } else {
      endSession();
    }
  }

  function enqueueSentence(sentence: string) {
    const trimmed = applyCtaMarker(sentence).trim();
    if (!trimmed) return;
    if (!ttsSupportedRef.current) return; // no speechSynthesis: stay text-only, no crash
    speechQueueRef.current.push(trimmed);
    if (!currentUtteranceRef.current) speakNext();
  }

  // --- Recognition lifecycle -------------------------------------------------

  function beginListening() {
    if (!recognitionRef.current) return;
    if (isRecognitionActiveRef.current) return; // edge case #5: never double-start
    dispatch({ type: "START_LISTENING" });
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Some browsers throw a synchronous InvalidStateError if start() races
      // with an in-flight session; the guard above should prevent it, but
      // don't let a stray throw crash the component.
      console.warn("SpeechRecognition.start() failed:", e);
    }
  }

  // --- Sending the recognized text to the existing /api/chat pipeline --------

  async function sendToChat(userText: string) {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Same local/prod URL resolution ChatWidget.tsx uses — voice mode calls
    // the identical route, not a second copy of the RAG pipeline (edge case:
    // "do not rebuild the RAG pipeline").
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const url = endpoint || (isLocal ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/chat" : "/api/chat");

    let fullAnswer = "";
    let sentenceBuffer = "";
    streamFinishedRef.current = false;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, source: "voice" }),
        signal: controller.signal,
      });

      // Edge case #12 (rate limit half): the limiter returns a plain JSON
      // 429, not an SSE stream. Voice mode must still *say* this out loud
      // instead of only logging it to the console.
      if (response.status === 429) {
        const body = await response.json().catch(() => ({ error: "Too many requests. Please try again later." }));
        const message: string = body.error || "Too many requests. Please try again later.";
        fullAnswer = message;
        dispatch({ type: "APPEND_RESPONSE", text: message });
        streamFinishedRef.current = true;
        enqueueSentence(message);
        onExchange?.({ user: userText, assistant: message });
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Chat service is currently offline.");
      }

      // Identical SSE parsing to ChatWidget.handleSend: `data: {"content":"..."}\n\n`
      // frames, no `event:` name, stream just closes (no [DONE] sentinel).
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const evt of events) {
          if (!evt.startsWith("data:")) continue;
          const raw = evt.slice(5).trim();
          if (!raw || raw === "[DONE]") continue;

          let payload: { content?: string };
          try {
            payload = JSON.parse(raw);
          } catch {
            continue;
          }

          const chunkText = payload.content || "";
          fullAnswer = applyCtaMarker(fullAnswer + chunkText);
          sentenceBuffer += chunkText;
          dispatch({ type: "APPEND_RESPONSE", text: fullAnswer });

          // Edge case #11: speak whole sentences as soon as they're formed
          // instead of waiting for the entire response, so voice output
          // latency stays low. This also transparently covers edge case
          // #12's other half (RAG-empty / embedding-failure / Groq-failure
          // fallbacks) — they arrive as ordinary SSE `data:` events, so they
          // flow through this exact same sentence-splitting path.
          const { sentences, rest } = extractSentences(sentenceBuffer);
          sentenceBuffer = rest;
          for (const sentence of sentences) enqueueSentence(sentence);
        }
      }

      // Flush a trailing clause that never hit a sentence terminator.
      if (sentenceBuffer.trim()) enqueueSentence(sentenceBuffer);
      streamFinishedRef.current = true;
      // If the response was empty (or TTS is unsupported so nothing was ever
      // queued), speakNext() never runs again to notice the stream ended —
      // nudge the state machine forward here instead of hanging.
      if (speechQueueRef.current.length === 0 && !currentUtteranceRef.current) {
        finishSpeakingTurn();
      }

      onExchange?.({ user: userText, assistant: fullAnswer });
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error.name === "AbortError") {
        // Either the user hit Stop or the component unmounted — stop()/the
        // unmount cleanup already reset state, so there's nothing to do
        // here (edge case #8, #16).
        return;
      }
      console.error("Voice chat request failed:", err);
      // Edge case #13: recover to a clean, listenable state instead of a
      // stuck "processing" spinner. Speaking the fallback (when TTS is
      // available) drives that recovery through the normal
      // finishSpeakingTurn() path once the utterance ends; if TTS isn't
      // available we drive it directly.
      streamFinishedRef.current = true;
      if (ttsSupportedRef.current) {
        dispatch({ type: "APPEND_RESPONSE", text: "Something went wrong reaching the assistant. Please try again." });
        enqueueSentence("Something went wrong reaching the assistant. Please try again.");
      } else {
        endSession({ message: "Something went wrong reaching the assistant. Please try again.", errorType: "network" });
      }
    }
  }

  function handleUserUtterance(text: string) {
    dispatch({ type: "FINAL_TRANSCRIPT", text });
    void sendToChat(text);
  }

  // --- Recognition event handlers (redefined each render; see refs above) ----

  const handleResult = (event: SpeechRecognitionEvent) => {
    let interimText = "";
    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0]?.transcript ?? "";
      if (result.isFinal) finalText += text;
      else interimText += text;
    }
    if (finalText.trim()) {
      handleUserUtterance(finalText.trim());
    } else if (interimText.trim()) {
      dispatch({ type: "INTERIM_TRANSCRIPT", text: interimText });
    }
  };

  const handleError = (event: SpeechRecognitionErrorEvent) => {
    lastErrorHandledRef.current = true;
    switch (event.error) {
      case "no-speech":
        // Edge case #4: mic was open but nothing was said. End the turn
        // instead of leaving the UI stuck listening forever.
        endSession();
        break;
      case "aborted":
        // Fires from our own .abort() calls (manual stop, barge-in) too. If
        // we triggered it (intentionalStopRef), the caller already updated
        // state — nothing more to do. Otherwise treat it as a quiet end.
        if (!intentionalStopRef.current) endSession();
        break;
      case "network":
        // Edge case #6: a real connectivity failure, distinct from
        // no-speech/aborted — surface it instead of failing silently.
        endSession({
          message: "Network error during speech recognition. Check your connection and try again.",
          errorType: "network",
        });
        break;
      case "not-allowed":
      case "service-not-allowed":
        // Edge case #2: the user denied the mic permission prompt. Show a
        // clear message and stop; do NOT auto-retry, since the browser will
        // just silently deny it again and that would look like a hang.
        endSession({
          message: "Microphone access was denied. Enable microphone permission for this site in your browser settings to use voice mode.",
          errorType: "permission",
        });
        break;
      case "audio-capture":
        // Edge case #3: permission was granted, but no physical microphone
        // is available.
        endSession({
          message: "No microphone was found. Connect a microphone to use voice mode.",
          errorType: "no-mic",
        });
        break;
      default:
        endSession({ message: `Speech recognition error: ${event.error}`, errorType: "generic" });
    }
  };

  const handleEnd = () => {
    isRecognitionActiveRef.current = false;
    const wasIntentional = intentionalStopRef.current;
    intentionalStopRef.current = false;
    const errorAlreadyHandled = lastErrorHandledRef.current;
    lastErrorHandledRef.current = false;

    if (wasIntentional || errorAlreadyHandled) return;

    // Edge case #7: recognition ended with no error and without us calling
    // stop/abort — this is mobile Safari auto-stopping after a pause. Only
    // treat it as an unexpected end if we're still "listening" (no final
    // result ever arrived); if we're already "processing"/"speaking", this
    // onend is just the ordinary tail of a successful recognition.
    if (state.status === "listening") endSession();
  };

  // --- Public start/stop, redefined each render (see startRef/stopRef) -------

  const start = () => {
    if (disabled || !state.isSupported) return;
    if (state.status === "listening" || state.status === "processing") {
      return; // edge case #5: ignore a repeat tap while already active
    }
    if (state.status === "speaking") {
      // Edge case #10 (manual barge-in): the mic can't stay hot while TTS
      // plays back (edge case #9 — feedback loop), so the free-tier-safe way
      // to support "talk over the bot" is to treat a fresh mic tap as an
      // explicit interrupt: cancel the utterance/queue, then start listening
      // immediately, rather than queuing behind it.
      window.speechSynthesis.cancel();
      speechQueueRef.current = [];
      streamFinishedRef.current = false;
      currentUtteranceRef.current = null;
      // Defensive reset: isRecognitionActiveRef only clears in the
      // recognizer's onend handler. If that event ever fails to fire (a
      // known browser quirk), the ref stays stuck "true" forever and
      // beginListening() below would silently no-op — the mic would look
      // tappable but do nothing, with zero visible error. Force it clear
      // here so a barge-in tap can never be silently swallowed.
      if (isRecognitionActiveRef.current) {
        intentionalStopRef.current = true;
        try {
          recognitionRef.current?.abort();
        } catch {
          // already stopped; nothing to clean up
        }
        isRecognitionActiveRef.current = false;
      }
      sessionActiveRef.current = true;
      // speechSynthesis.cancel() requests silence but isn't guaranteed
      // instantaneous — there can be a brief acoustic tail while the audio
      // hardware actually stops. Arming the mic in the same tick risks it
      // picking up that tail as the user's own voice, producing a garbled
      // 1-2-word "final" result before the user has actually said anything,
      // which then gets sent to the model as if it were the real question.
      // A short delay lets playback genuinely stop first.
      window.setTimeout(() => {
        if (!mountedRef.current || !sessionActiveRef.current) return;
        beginListening();
      }, 250);
      return;
    }
    sessionActiveRef.current = true;
    beginListening();
  };

  const stop = () => {
    // Edge case #16: works from any state — cancels recognition, the
    // in-flight fetch, and TTS, unconditionally.
    intentionalStopRef.current = true;
    sessionActiveRef.current = false;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (isRecognitionActiveRef.current) recognitionRef.current?.abort();
    speechQueueRef.current = [];
    streamFinishedRef.current = false;
    currentUtteranceRef.current = null;
    if (ttsSupportedRef.current) window.speechSynthesis.cancel();
    dispatch({ type: "END_SESSION" });
  };

  // Keep the indirection refs pointed at this render's closures.
  onResultRef.current = handleResult;
  onErrorRef.current = handleError;
  onEndRef.current = handleEnd;
  startRef.current = start;
  stopRef.current = stop;

  // --- Mount: detect support, create the recognizer once ---------------------

  useEffect(() => {
    mountedRef.current = true;
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognitionCtor;
    // Edge case #1: detect support on mount so the caller can hide/disable
    // the mic button instead of crashing when .start() doesn't exist.
    dispatch({ type: "SET_SUPPORTED", supported });
    ttsSupportedRef.current = typeof window !== "undefined" && "speechSynthesis" in window;

    let handleVoicesChanged: (() => void) | null = null;
    if (ttsSupportedRef.current) {
      voicesRef.current = window.speechSynthesis.getVoices();
      handleVoicesChanged = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    }

    if (!supported || !SpeechRecognitionCtor) {
      return () => {
        if (handleVoicesChanged) window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = typeof navigator !== "undefined" ? navigator.language || "en-US" : "en-US";

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
    };
    recognition.onresult = (e) => onResultRef.current(e);
    recognition.onerror = (e) => onErrorRef.current(e);
    recognition.onend = () => onEndRef.current();

    recognitionRef.current = recognition;

    return () => {
      // Edge case #8: unmounting mid-session must not leave the mic
      // listening or the bot still talking after the widget is gone.
      mountedRef.current = false;
      intentionalStopRef.current = true;
      abortControllerRef.current?.abort();
      try {
        recognition.abort();
      } catch {
        // already stopped; nothing to clean up
      }
      if (ttsSupportedRef.current) window.speechSynthesis.cancel();
      if (handleVoicesChanged) window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  return {
    ...state,
    start: useCallback(() => startRef.current(), []),
    stop: useCallback(() => stopRef.current(), []),
  };
}
