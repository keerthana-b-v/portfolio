# Interview Preparation: E-Commerce AI Support Agent (RAG)
**Role Context**: Junior/Intermediate AI Engineer | Systems-Aware Backend Developer

---

## 1. Technical Deep-Dive

This project is a Retrieval-Augmented Generation (RAG) support agent built with **FastAPI**, **LangChain**, and **Llama-3.1-8b-instant** (via the Groq API). It is deployed live on a single-container **Render** instance (backend) and **Vercel** (frontend). 

Below is the technical defense of the core architectural decisions, tailored for a senior engineering audience.

### Decision A: Lexical BM25 Retrieval over Dense Vector Embeddings (FAISS/Pinecone)
* **What it does**: Indexes static policy documents (`returns`, `shipping`, `warranty`) using word frequencies and retrieves context based on exact keyword matching rather than high-dimensional vectors.
* **Why it was the right call**: 
  * *Resource Constraint*: We had a strict **512MB RAM budget** on Render free tier. Loading a local dense embedding model (e.g., PyTorch + `sentence-transformers/all-MiniLM-L6-v2`) instantly consumes 500MB+ RAM, causing immediate Out-of-Memory (OOM) container crashes (Exit code 137). 
  * *Scale Fit*: Our policy document base is small (3 files, ~6,000 words total). A hosted vector DB (like Pinecone) introduces unnecessary network latency, API costs, and setup complexity for a simple static lookup.
  * *Search Fit*: Customer support queries on policies are highly keyword-focused (e.g., "refund," "warranty," "14 days"). BM25 runs entirely in-memory, uses **<10MB of RAM**, retrieves in **under 1ms**, and matches exact terms perfectly.
* **The tradeoff accepted**: Synonyms are missed. If a user asks for "damaged gear" and the document only mentions "defective equipment," BM25 score fails. We mitigated this by injecting a lexical expansion instruction in the system prompt to guide the LLM's query reformulations.
* **Next step at 10x scale**: If documents grow to millions of words or cover multiple domains, we would decouple the database by migrating to a hosted serverless vector store (like **Supabase pgvector** or **Pinecone serverless**) to keep our application container completely stateless and memory-light.

### Decision B: Custom Alphanumeric Regex Tokenizer
* **What it does**: Splits policy documents and user queries strictly on alphanumeric word boundaries using regex `re.findall(r'\w+', text.lower())`, discarding trailing colons, commas, or quotes.
* **Why it was the right call**: 
  * *Formatting issue*: The policy document headers look like `"WARRANTY:"` or `"RETURNS:"`. Out-of-the-box tokenizers in python split strictly on spaces, meaning `"warranty:"` and `"warranty"` are indexed as different tokens. A user searching for "warranty" would miss the crucial section heading chunk because of the trailing colon.
  * *The result*: Writing a custom tokenizer normalized punctuation and raised our **Context Precision metric by 23%**.
* **The tradeoff accepted**: We lose special characters or hyphenated tokens (e.g., product model numbers like "A-100" are split into "A" and "100").
* **Next step at 10x scale**: We would transition to a production-grade tokenization library (like Hugging Face's `Tokenizers` library) and maintain a vocabulary map to handle compound nouns and symbols correctly.

### Decision C: Chunk Size of 1000 Characters with 200 Overlap
* **What it does**: Segments text into 1000-character blocks, with a 200-character sliding overlap between adjacent chunks.
* **Why it was the right call**: 
  * *Context integrity*: Smaller chunks (e.g., 500 characters) cut off tabular lists and split section headers away from the policy guidelines they described. The 1000-char chunk size ensures that headers and full policy conditions remain in the same chunk.
* **The tradeoff accepted**: Larger chunks send more tokens to the LLM context, which slightly increases token costs and latency.
* **Next step at 10x scale**: Implement **Parent-Child Retrieval** (indexing small sentences for high-precision retrieval, but returning the larger parent section to the LLM) to balance retrieval precision and context retention.

### Decision D: Double-Layer Prompt Injection Defense
* **What it does**: Screens incoming queries using a low-cost, immediate local regex scan (checking for keywords like "system prompt," "ignore instructions"). If it passes, it runs a fast classification LLM call to verify if the query attempts jailbreaking.
* **Why it was the right call**: 
  * *Latency & Cost*: Running an LLM check on every single user input is slow and expensive. The local regex layer catches 80% of standard attacks in under 1ms for zero token cost. The second LLM classifier layer catches the remaining 20% of semantic jailbreaks.
* **The tradeoff accepted**: A small false-positive rate (e.g., a customer asking, "How do I ignore the shipping fee?" gets flagged by the regex block).
* **Next step at 10x scale**: We would replace the classification LLM with a dedicated, lightweight open-source guardrail model (like **Llama Guard** or **NeMo Guardrails**) running on a shared inference cluster.

### Decision E: Stateful SQLite Ticket Escalation (2-Turn Frustration)
* **What it does**: Logs conversations in a local SQLite database. An intent router checks if the user expresses frustration (e.g. angry queries). If frustration is detected across two *consecutive* turns, the bot automatically flags the session for human ticket escalation.
* **Why it was the right call**: 
  * *Noise reduction*: Stateless bots check each message in isolation and trigger human handoff too early on a single angry keyword. Tracking history across turns prevents false positives. SQLite is a lightweight, zero-latency option for local session tracking.
* **The tradeoff accepted**: Local SQLite is ephemeral. If the Render container restarts or spins down, the session history is lost.
* **Next step at 10x scale**: We would externalize the session state to a distributed cache like **Redis** (e.g. Upstash Redis) to allow scaling to multiple stateless backend containers.

### Decision F: Streaming via FastAPI Server-Sent Events (SSE)
* **What it does**: Streams chunks of the response from the LLM to the client character-by-character as they are generated.
* **Why it was the right call**: 
  * *Perceived Latency*: Users hate waiting 3-4 seconds for a complete answer. SSE displays text within 200ms of generating the first token, improving perceived latency.
* **The tradeoff accepted**: Handling SSE connections requires keeping HTTP sockets open, which can exhaust container thread pools under high concurrent traffic.
* **Next step at 10x scale**: We would decouple streaming connections using a specialized Gateway or WebSocket server to handle concurrent open sockets.

---

## 2. Business POV (Value Translation)

| Technical Feature | Business Metric | Impact & Explanation |
| :--- | :--- | :--- |
| **BM25 Lexical Retrieval** | **Infrastructure Cost Reduction** | Swapping out a hosted vector database (like Pinecone) saves **~$70/month per environment** in base DB costs, and uses **$0/month** in embedding model API costs (free local tokenization). |
| **Double-Layer Defense** | **Risk Mitigation / Brand Safety** | Prevents prompt-injection attacks from hijacking the LLM (e.g., jailbreaking the bot to agree to sell products for $1). The local regex pre-filter catches attacks at **zero token cost**, protecting corporate reputation. |
| **SSE Streaming** | **Customer Satisfaction (CSAT)** | Reduces perceived wait times from ~4 seconds to under **200 milliseconds** (Time-To-First-Token). Fast responses are directly correlated with lower user drop-off. |
| **2-Turn Frustration Routing** | **Churn Prevention** | Tracks sentiment across turns. Instead of trapped customers repeatedly getting stuck with generic bot answers, they are automatically escalated to a human handoff after 2 turns, saving customer trust. |
| **Automated Containment** | **Operational Metrics** | Resolves over **70% of standard FAQs** automatically. A human customer support agent in India costs ~$3.00/hour (~$0.50 per ticket). Our LLM RAG agent costs **under $0.005 per conversation** (Groq Llama 3.1 8B tokens are extremely cheap, costing $0.05 per 1M input tokens). This is a 100x cost reduction per ticket. |

---

## 3. Cost Optimization Playbook

| Technique | Estimated Saving | Quality Risk | Mitigation & Verification | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **1. Prompt Trimming** | **~15% token reduction** | System instructions drift, losing tone. | Re-run the **Answer Relevancy** and routing accuracy tests. | Low (1-2 hours) |
| **2. Groq Prompt Caching** | **Up to 50% token cost reduction** | None. | Groq automatically caches static prefix tokens (system prompts and policy documents). We format our API calls to keep system prompts static. | Low (1 hour) |
| **3. Local Semantic Cache** | **100% token saving for duplicate FAQs** | Serving outdated answers if policies change. | Store exact user queries and direct RAG answers in SQLite. Set a TTL (Time-To-Live) of 24 hours. Re-run **Faithfulness** on a randomized sample of cached answers. | Medium (1 day) |
| **4. Max Output Token Limits** | **~20-30% token reduction** | Answers might get cut off mid-sentence if the policy is complex. | Restrict LLM response to a maximum of 250 tokens in API parameters. Re-run **Answer Relevancy** to verify conciseness. | Low (10 mins) |
| **5. Model Cascading** | **~10-15% of queries bypassed** | Misclassifying greetings. | Use a fast heuristic check to detect greetings (e.g. "hi," "hello"). Return a hardcoded string rather than querying the Llama model. | Low (2 hours) |

---

## 4. Failure Modes & Fixes ("War Stories")

### War Story 1: The Out-Of-Memory (OOM) Crash
* **What failed**: During local testing, we set up a dense vector search using PyTorch and FAISS. When deployed to Render, the container instantly crashed with exit code 137 (OOM) on startup because PyTorch allocated over 800MB of RAM—exceeding the free-tier 512MB limit.
* **Detection**: Render dashboard status logs showing `Exit code 137: Out of Memory`.
* **The Fix**: Swapped dense vector search for a local BM25 keyword retriever (`rank-bm25`). Memory footprint dropped to **~65MB**, and the container has remained stable ever since.

### War Story 2: The "Punctuation Heading" Miss
* **What failed**: Users asking about "warranty" were getting generic answers. We found that the section header in the policy document was `"WARRANTY:"`. Because the default parser split on spaces, the index stored `"warranty:"` (with a colon). A query for `"warranty"` failed to match.
* **Detection**: Our custom RAGAS test runner showed a drop in Context Precision to **62%**.
* **The Fix**: Implemented a custom alphanumeric tokenizer regex to strip all punctuation during indexing and query parsing, restoring Context Precision to **85.5%**.

### War Story 3: False Positive Guardrail Block
* **What failed**: A customer asked, *"How do I ignore the warranty card and return the item?"* Our naive regex guardrail caught the word `"ignore"` and blocked the user, accusing them of a prompt injection attack.
* **Detection**: User session logs flagged as `Blocked - Security Guardrail`.
* **The Fix**: Refined the regex rules to require multi-word matches (e.g. `"ignore instructions"` or `"system prompt"`) rather than single verbs like `"ignore"`.

### War Story 4: Groq API Rate Limiting (429)
* **What failed**: During stress testing, multiple concurrent chats hit Groq's free-tier rate limits, throwing `429 Too Many Requests` and leaving users with empty screens.
* **Detection**: API error logs displaying HTTP 429 status code.
* **The Fix**: Implemented a fallback pipeline that catches 429 errors and retries with exponential backoff using `tenacity`, and displays a polite *"System busy, please wait"* message rather than crashing.

### War Story 5: Session Data Loss on Container Restart
* **What failed**: Because Render free-tier containers spin down on inactivity or restart during redeployment, our local SQLite database tracking session state was wiped out, resetting customer frustration history.
* **Detection**: Customers complaining they were frustrated but never got escalated because their turn count reset.
* **The Fix**: Changed session persistence to save session ID in the client's `sessionStorage` and send it with each request, and added a roadmap ticket to externalize state to Upstash Redis.

---

## 5. One-Liners

* **Recruiter elevator pitch (30s)**: 
  > "I built a production-grade e-commerce support RAG agent using FastAPI, LangChain, and Llama 3.1 that handles real-time customer chats under a strict 512MB RAM memory constraint. It features a custom regex-tokenized keyword retriever that beats standard embeddings in cost and memory, a stateful sqlite-based human escalation system, and verified prompt injection defenses."
* **Engineer technical walkthrough (2 mins)**: 
  > "My backend uses FastAPI to stream LLM responses via Server-Sent Events. To meet a tight 512MB memory limit on Render, I avoided loading heavy local embedding models and instead implemented a rank-bm25 keyword retriever. I tuned retrieval using a custom regex tokenizer that strips punctuation, which raised Context Precision to 85.5%. For safety, I engineered a double-layer prompt injection defense (heuristic regex pre-filter + LLM classifier) and verified the RAG pipeline using a custom RAGAS-style test runner on 18 golden Q&A pairs, achieving 94.4% faithfulness."
* **Voice-AI business value statement**: 
  > "This architecture translates directly to a Voice AI support agent, where reducing database lookup times to under 1ms and implementing stateful, multi-turn escalation is critical to keeping callers engaged and preventing frustrating containment loops."
