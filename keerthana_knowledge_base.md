# Master Knowledge Base: Keerthana B V
**Source of Truth Document for RAG Chatbot Retrieval**

This document contains the complete and structured biographical, professional, technical, and project details for **Keerthana B V**. It serves as the primary context resource for the Retrieval-Augmented Generation (RAG) chatbot on her portfolio site.

---

## 1. Personal & Contact Profile
* **Full Name**: Keerthana B V
* **Current Title**: AI Solutions Engineer | Voice AI, Prompt Engineering & LLM Agents
* **Location**: Bengaluru, Karnataka, India
* **Email**: keerthana.b.v.codes@gmail.com
* **Phone**: +91-9901724479
* **Online Profiles**:
  * **LinkedIn**: [Keerthana B V on LinkedIn](https://www.linkedin.com/in/keerthanabv)
  * **GitHub**: [keerthana-b-v on GitHub](https://github.com/keerthana-b-v)
  * **Research**: Google Scholar Profile containing peer-reviewed work.
  * **Portfolio Website**: Live site showcasing real-time text and voice chat assistants.

---

## 2. Professional Summary
Voice AI and LLM developer who has designed, prompted, and shipped production conversational agents end to end. Notable deployments include:
* A real-time, multilingual (English/Tanglish) **Vapi voice agent** for customer order intake.
* A secure **e-commerce support RAG agent** featuring a 94.4% RAGAS Faithfulness score and a 100% prompt-injection block rate verified via systematic adversarial testing.
* Experienced in translating client goals into technical requirements and delivering functional software, having collaborated directly with **5+ customers** on production projects.

---

## 3. Core Skills & Technical Competencies

### Category 1: Prompt Engineering
* **Skills**: System prompt design, dialogue flow architecture, multi-turn context tracking, structured output generation (JSON Schema), slot-filling, hallucination mitigation, red-teaming, and prompt-injection defense.

### Category 2: Voice AI
* **Skills**: Vapi AI integration (streaming Speech-to-Text and Text-to-Speech), Twilio call automation, conversation/call-flow design, vernacular and code-switched speech handling (English/Tanglish), and latency-aware turn-taking.

### Category 3: LLM Tooling & RAG
* **Skills**: OpenAI API (GPT-4o-mini), Llama-3.1 (via Groq API), LangChain, RAG pipeline design, RAGAS answer-quality evaluation, keyword/lexical retrieval (rank-bm25), and context window optimization.

### Category 4: Automation & Integration
* **Skills**: Make.com workflows, custom webhooks, Google Sheets data pipelines, REST APIs, and error-handling routing.

### Category 5: Frontend Development
* **Skills**: React.js (Vite), Next.js, TypeScript, Tailwind CSS, Framer Motion, Redux, HTML5, and CSS3.

### Category 6: Backend & Cloud
* **Skills**: FastAPI, Node.js, Express.js, Python, Nginx, Linux VPS deployment, REST API development, and JWT authentication.

### Category 7: Database & Storage
* **Skills**: MongoDB, PostgreSQL (with pgvector), SQLite, Redis caching, FAISS (vector search), and BM25 lexical indices.

### Category 8: Tools & DevOps
* **Skills**: Git, GitHub, Docker, Postman, Vercel hosting, Render deployment, and Figma UI design.

### Category 9: Professional & Client-Facing
* **Skills**: Requirement gathering, client progress updates, User Acceptance Testing (UAT), technical documentation writing, and Agile workflows.

---

## 4. Key Projects

### Project 1: Real-Time Conversational Voice AI Agent
* **Tech Stack**: Vapi AI, GPT-4o-mini, Twilio, Make.com, Google Sheets API.
* **Role**: AI Integration Engineer
* **Objective**: Automate customer order intake and L1 FAQ support via live voice phone calls.
* **Key Achievements**:
  * Designed and deployed a real-time, multilingual (English/Tanglish code-switched speech) voice agent using Vapi's streaming STT/TTS pipeline, achieving low-latency turn-taking.
  * Authored system prompts and conversational guardrails using JSON Schema slot-filling to capture entities (name, order details, phone number) with high reliability across accented speech.
  * Engineered a fault-tolerant backend automation pipeline: Make.com webhooks log call parameters to Google Sheets, and the Twilio API instantly sends UPI payment links via SMS upon call completion. 
  * Implemented fallback routes so downstream database or API failures never drop or interrupt a live customer phone call.

### Project 2: AI Customer Support Conversational Agent (RAG)
* **Tech Stack**: FastAPI, LangChain, Llama-3.1-8b-instant (via Groq), React (Vite), SQLite, rank-bm25.
* **Role**: AI Developer / Systems Engineer
* **Objective**: Build an ultra-lean, secure support chatbot answering warranty and shipping queries.
* **Key Achievements**:
  * Deployed a full-stack, stateful RAG agent streaming text responses in real time over Server-Sent Events (SSE) with sub-second perceived latency, hosted live on Render (backend) and Vercel (frontend).
  * Resolved container OOM issues under the 512MB RAM free-tier limit by swapping vector search (FAISS + local sentence-transformers) for a lightweight, in-memory BM25 lexical index (averaging ~65MB RAM).
  * Wrote a custom alphanumeric tokenizer regex (`re.findall(r'\w+', text.lower())`) to strip trailing punctuation, which improved context retrieval and boosted Context Precision by 23%.
  * Engineered a double-layer prompt-injection defense: a low-cost, instant heuristic regex filter followed by an LLM-based query classifier. This achieved a 100% block rate against adversarial attacks.
  * Formulated a stateful SQLite logging router tracking customer sentiment over multiple turns, automatically generating an escalation ticket and triggering human handoff when frustration is detected for 2 consecutive turns.
  * Validated answer quality using a custom RAGAS test runner on 18 golden Q&A pairs: achieved **94.4% Faithfulness**, **97.7% Answer Relevancy**, and **85.5% Context Precision**.

### Project 3: AI Legal Document Intelligence Agent
* **Tech Stack**: Legal-BERT, LoRA, PyTorch, Hugging Face, React.js, MongoDB.
* **Role**: Lead Full Stack AI Engineer
* **Objective**: Automate the identification and extraction of critical clauses from real-world business contracts.
* **Key Achievements**:
  * Fine-tuned a domain-specific BERT model (`Legal-BERT`) using Low-Rank Adaptation (LoRA) on the 510-contract CUAD (Contract Understanding Atticus Dataset) benchmark.
  * Completed training in ~3 hours on a single, cost-effective T4 GPU, achieving an **84.9% F1 score** for contract clause classification.
  * Deployed the fine-tuned weights as a full-stack web application with a React dashboard, allowing users to upload contracts and review model predictions.
  * Awarded **Best Paper Distinction at the NCRIE-2025 conference** for the research paper documenting this model's trust, safety, and evidence-driven evaluation frameworks.

---

## 5. Work Experience

### Job 1: Full Stack Developer | ASPL Tech Solutions Pvt. Ltd., Bengaluru
* **Duration**: Oct 2025 – Mar 2026
* **Key Activities**:
  * Collaborated directly with **5+ corporate clients** to gather requirements, host sprint updates, run UAT, and translate client goals into production code.
  * Built client-facing web applications in React.js and Node.js for healthcare and retail industries.
  * Designed and shipped an automated Human Resource Management System (HRMS) onboarding module.
  * Implemented system-wide security architectures including Role-Based Access Control (RBAC) and JWT authentication.

### Job 2: MERN Stack Developer Intern | Dyashin Technosoft Pvt. Ltd., Bengaluru
* **Duration**: Nov 2024 – Jan 2025
* **Key Activities**:
  * Built an e-commerce platform using the MERN stack (MongoDB, Express.js, React, Node.js).
  * Documented and tested **15+ REST API endpoints** using Postman.
  * Debugged and resolved **15+ critical UAT issues**, resulting in a **40% reduction in post-launch defect rates**.

---

## 6. Education

### Degree 1: Master of Computer Applications (MCA)
* **Institution**: RV Institute of Technology and Management, Bengaluru
* **CGPA**: 8.2 / 10
* **Graduation Date**: August 2025

### Degree 2: Bachelor of Computer Applications (BCA)
* **Institution**: Community Institute of Commerce and Management, Bengaluru
* **CGPA**: 8.4 / 10
* **Graduation Date**: 2023

---

## 7. Languages
* **English**: Professional proficiency (fluent)
* **Kannada**: Native/bilingual proficiency
* **Telugu**: Native/bilingual proficiency

---

## 8. Chatbot Persona & RAG Instructions
When acting as an LLM responder using chunks retrieved from this document, the chatbot adheres to the following rules:
1. **Never break character**: Respond as Keerthana's personal AI Assistant. Do not mention "context," "retrieved text," or "my knowledge base database."
2. **Conciseness**: Give direct, clear answers. Avoid formatting lists unless asked, preferring paragraphs of 2-3 sentences.
3. **Accuracy**: Only state information that exists in this document. If asked a question that cannot be answered using these facts, fall back to: *"I don't have specific details on that in my records. You can email Keerthana directly at keerthana.b.v.codes@gmail.com."*
4. **Call to Action**: If the user asks for contact information, output the `[CTA_CONTACT]` marker.
