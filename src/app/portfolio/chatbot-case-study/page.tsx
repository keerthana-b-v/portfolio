import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, Database, LayoutTemplate, Activity } from 'lucide-react';

export default function ChatbotCaseStudy() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* Navigation */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-8">
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-gray-500 hover:text-black uppercase transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </nav>

      {/* Header Section */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6">
          Case Study
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          Flagship AI Customer Support Conversational Agent
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl leading-relaxed">
          An ultra-lean, production-grade Retrieval-Augmented Generation (RAG) agent engineered with strict resource, latency, and security guardrails.
        </p>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Project Overview */}
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-3">
              <LayoutTemplate className="text-blue-500" />
              Project Overview
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              An intelligent conversational support agent designed to guide users through shipping, returns, and warranty policies. The platform decouples a fast FastAPI backend from a sleek, glassmorphic React client, utilizing server-sent events (SSE) to stream answers in real-time.
            </p>
          </section>

          {/* Key Architectural Decisions */}
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-8 flex items-center gap-3">
              <Cpu className="text-blue-500" />
              Key Architectural & Engineering Decisions
            </h2>
            
            <div className="space-y-8">
              {/* Challenge 1 */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">The 512MB RAM Constraint Challenge</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Hosting RAG systems using local embeddings (e.g. PyTorch and FAISS) regularly triggers Out-Of-Memory (OOM) crashes on standard free-tier containers. External HuggingFace Inference calls were unstable due to DNS network constraints.
                </p>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} /> The Solution
                  </h4>
                  <p className="text-blue-900 leading-relaxed font-medium">
                    Transitioned to a localized, offline BM25 retrieval index. This reduced RAM utilization by 90% (to ~65MB) while running indices in &lt;1ms.
                  </p>
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">The Punctuation Retrieval Miss</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Naive whitespace tokenization in BM25 caused query misses on punctuated text like "Appliances:".
                </p>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} /> The Solution
                  </h4>
                  <p className="text-blue-900 leading-relaxed font-medium">
                    Designed a custom alphanumeric regex tokenizer <code>re.findall(r'\w+', text.lower())</code> and increased chunk size to 1,000 characters, boosting Context Precision by 23%.
                  </p>
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Preventing False Positive Ticket Escalations</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Simple keyword match routing initiates tickets too aggressively on casual negative words.
                </p>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} /> The Solution
                  </h4>
                  <p className="text-blue-900 leading-relaxed font-medium">
                    Integrated stateful conversation logging in SQLite. The intent router checks history and only logs an escalation ticket to the database when frustration persists for 2 consecutive turns.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quantifiable Results */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500 rounded-full blur-[3rem] opacity-30"></div>
            
            <h2 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3 relative z-10">
              <Activity className="text-blue-400" />
              Quantifiable Results
            </h2>
            
            <ul className="space-y-6 relative z-10">
              <li className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-300 text-sm font-medium">Faithfulness <br/><span className="text-xs opacity-70">(No Hallucinations)</span></span>
                <span className="text-2xl font-black text-blue-400">94.44%</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-300 text-sm font-medium">Answer Relevancy <br/><span className="text-xs opacity-70">(Directness)</span></span>
                <span className="text-2xl font-black text-blue-400">97.78%</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-300 text-sm font-medium">Context Precision <br/><span className="text-xs opacity-70">(Retrieval Focus)</span></span>
                <span className="text-2xl font-black text-blue-400">85.56%</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-300 text-sm font-medium">Router Classification <br/><span className="text-xs opacity-70">(Accuracy)</span></span>
                <span className="text-2xl font-black text-blue-400">100%</span>
              </li>
              <li className="flex justify-between items-center pb-2">
                <span className="text-slate-300 text-sm font-medium">Prompt Injection <br/><span className="text-xs opacity-70">(Block Rate)</span></span>
                <span className="text-2xl font-black text-blue-400">100%</span>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-3">
              <Database className="text-blue-500" />
              Technology Stack
            </h2>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Frontend</h4>
                <p className="text-slate-800 font-medium text-sm leading-relaxed">React (Vite), SSE Streaming, SessionStorage Persistence, Custom CSS System</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Backend</h4>
                <p className="text-slate-800 font-medium text-sm leading-relaxed">FastAPI, LangChain, ChatGroq (Llama-3.1-8b-instant), rank-bm25, SQLite</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Security & Observability</h4>
                <p className="text-slate-800 font-medium text-sm leading-relaxed">Sliding-Window Rate Limiter, Heuristic Prompt Injection Defense, Pydantic, Langfuse Tracing</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Evaluation</h4>
                <p className="text-slate-800 font-medium text-sm leading-relaxed">Custom LLM-as-a-judge RAGAS-style test runner (18 golden Q&A pairs), 8-turn routing test suite</p>
              </div>
            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}
