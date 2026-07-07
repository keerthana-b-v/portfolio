"use client";

import { Mic, MicOff, Square, Loader2 } from "lucide-react";
import { useVoiceChat, VoiceExchange } from "@/hooks/useVoiceChat";

interface VoiceChatProps {
  /** Bubbled up to the parent (ChatWidget) so a completed voice turn lands in
   * the SAME message list/transcript as typed messages — this is voice mode
   * for the existing widget, not a separate bot. */
  onExchange?: (exchange: VoiceExchange) => void;
  /** External gate — e.g. ChatWidget's 6-exchange cap or its own isSending
   * flag — so voice and text turns can't both be in flight at once. */
  disabled?: boolean;
  /** Optional endpoint override, otherwise resolves the same /api/chat URL
   * ChatWidget already uses. */
  endpoint?: string;
}

const STATUS_LABEL: Record<string, string> = {
  idle: "Tap to talk",
  listening: "Listening…",
  processing: "Thinking…",
  speaking: "Speaking — tap mic to interrupt",
};

export default function VoiceChat({ onExchange, disabled, endpoint }: VoiceChatProps) {
  const { status, isSupported, error, transcript, start, stop } = useVoiceChat({
    onExchange,
    disabled,
    endpoint,
  });

  // Edge case #1 + #17: SpeechRecognition missing (e.g. Firefox) — render a
  // visibly disabled mic instead of hiding voice mode without explanation,
  // and critically, render nothing that blocks the existing text input.
  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input isn't supported in this browser. Try Chrome, Edge, or Safari — text chat still works."
        className="p-2 rounded-full bg-gray-100 text-gray-300 cursor-not-allowed flex-shrink-0"
      >
        <MicOff size={16} />
      </button>
    );
  }

  const isActive = status !== "idle";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={start}
        disabled={disabled && status === "idle"}
        // Edge case #15: color + icon + label all change with status so the
        // user is never left guessing whether the mic is live.
        className={`p-2 rounded-full flex-shrink-0 transition-colors ${
          status === "listening"
            ? "bg-red-500 text-white animate-pulse"
            : status === "speaking"
              ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer animate-pulse"
              : status === "processing"
                ? "bg-gray-300 text-gray-600"
                : "bg-black text-white hover:bg-gray-800"
        } disabled:opacity-40`}
        title={STATUS_LABEL[status]}
      >
        {status === "processing" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Mic size={16} />
        )}
      </button>

      {/* Edge case #16: a manual stop that works from any non-idle state. */}
      {isActive && (
        <button
          type="button"
          onClick={stop}
          title="Stop voice mode"
          className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <Square size={14} />
        </button>
      )}

      {isActive && (
        <span className="text-xs text-gray-500 truncate max-w-[180px]">
          {status === "listening" && transcript ? transcript : STATUS_LABEL[status]}
        </span>
      )}

      {error && <span className="text-xs text-red-600 truncate max-w-[160px]">{error}</span>}
    </div>
  );
}
