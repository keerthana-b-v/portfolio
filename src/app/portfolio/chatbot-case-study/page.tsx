"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu, Database, LayoutTemplate, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatbotCaseStudy() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="w-full px-8 py-8 absolute top-0 left-0 z-50">
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-gray-500 hover:text-black uppercase transition-colors bg-white/50 backdrop-blur-md px-6 py-3 rounded-full shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-20 px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="inline-block px-6 py-2 rounded-full bg-blue-100 text-blue-700 font-black text-sm uppercase tracking-widest mb-8 shadow-sm">
            Flagship Case Study
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]">
            AI Customer Support <br />
            <span className="text-blue-600">Conversational Agent</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-4xl mx-auto leading-relaxed">
            An ultra-lean, production-grade Retrieval-Augmented Generation (RAG) agent engineered with strict resource, latency, and security guardrails.
          </p>
        </motion.div>
      </section>

      {/* Metrics Bar (Full Width) */}
      <section className="w-full bg-slate-900 text-white py-16 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[8rem] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">94.4%</div>
            <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Faithfulness</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">97.8%</div>
            <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Answer Relevancy</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">85.5%</div>
            <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Context Precision</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">100%</div>
            <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Router Accuracy</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">100%</div>
            <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Injection Block Rate</div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="w-full max-w-7xl mx-auto px-8 py-24 space-y-32">
        
        {/* Project Overview */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row gap-16 items-center"
        >
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-black tracking-tight mb-4 flex items-center gap-4">
              <LayoutTemplate className="text-blue-500 w-10 h-10" />
              Overview
            </h2>
            <p className="text-lg text-slate-500 font-medium">The decoupling of speed and aesthetics.</p>
          </div>
          <div className="lg:w-2/3 bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
            <p className="text-2xl text-slate-700 leading-relaxed font-medium">
              An intelligent conversational support agent designed to guide users through shipping, returns, and warranty policies. The platform decouples a fast <span className="font-bold text-black">FastAPI backend</span> from a sleek, glassmorphic <span className="font-bold text-black">React client</span>, utilizing <span className="font-bold text-black">server-sent events (SSE)</span> to stream answers in real-time.
            </p>
          </div>
        </motion.section>

        {/* The Challenges & Solutions */}
        <section className="space-y-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight inline-flex items-center gap-4">
              <Cpu className="text-blue-500 w-12 h-12" />
              Engineering Decisions
            </h2>
          </div>

          {/* Challenge 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/20 rounded-full blur-[4rem]"></div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-red-400 mb-4">The Challenge</h3>
              <h4 className="text-3xl md:text-4xl font-black mb-6 leading-tight">The 512MB RAM Constraint</h4>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Hosting RAG systems using local embeddings (e.g. PyTorch and FAISS) regularly triggers Out-Of-Memory (OOM) crashes on standard free-tier containers. External HuggingFace calls were unstable due to DNS constraints.
              </p>
            </div>
            <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-center">
              <h3 className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2"><CheckCircle2 size={18}/> The Solution</h3>
              <p className="text-2xl text-slate-800 leading-relaxed font-bold">
                Transitioned to a localized, offline BM25 retrieval index. This reduced RAM utilization by 90% (to ~65MB) while running indices in &lt;1ms.
              </p>
            </div>
          </motion.div>

          {/* Challenge 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center lg:order-2">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[4rem]"></div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-orange-400 mb-4">The Challenge</h3>
              <h4 className="text-3xl md:text-4xl font-black mb-6 leading-tight">The Punctuation Retrieval Miss</h4>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Naive whitespace tokenization in BM25 caused query misses on punctuated text like "Appliances:".
              </p>
            </div>
            <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-center lg:order-1">
              <h3 className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2"><CheckCircle2 size={18}/> The Solution</h3>
              <p className="text-2xl text-slate-800 leading-relaxed font-bold">
                Designed a custom alphanumeric regex tokenizer <code className="bg-slate-100 px-2 py-1 rounded-lg text-blue-600 text-xl font-mono">re.findall(r'\w+', text)</code> and increased chunk size to 1,000 characters, boosting Context Precision by 23%.
              </p>
            </div>
          </motion.div>

          {/* Challenge 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-1/2 -translate-y-1/2 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[4rem]"></div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-purple-400 mb-4">The Challenge</h3>
              <h4 className="text-3xl md:text-4xl font-black mb-6 leading-tight">False Positive Ticket Escalations</h4>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Simple keyword match routing initiates tickets too aggressively on casual negative words.
              </p>
            </div>
            <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-center">
              <h3 className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2"><CheckCircle2 size={18}/> The Solution</h3>
              <p className="text-2xl text-slate-800 leading-relaxed font-bold">
                Integrated stateful conversation logging in SQLite. The intent router checks history and only logs an escalation ticket when frustration persists for 2 consecutive turns.
              </p>
            </div>
          </motion.div>

        </section>

        {/* Technology Stack Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="pt-10"
        >
          <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
            <h2 className="text-4xl font-black tracking-tight mb-16 text-center flex items-center justify-center gap-4">
              <Database className="text-blue-500 w-10 h-10" />
              Technology Stack
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Frontend</h4>
                <p className="text-slate-500 font-medium leading-relaxed">React (Vite), SSE Streaming, SessionStorage Persistence, Custom CSS System</p>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Backend</h4>
                <p className="text-slate-500 font-medium leading-relaxed">FastAPI, LangChain, ChatGroq (Llama-3.1-8b-instant), rank-bm25, SQLite</p>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Security</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Sliding-Window Rate Limiter, Heuristic Prompt Injection Defense, Pydantic</p>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Evaluation</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Custom LLM-as-a-judge RAGAS-style test runner, 8-turn routing test suite</p>
              </div>
            </div>
          </div>
        </motion.section>

      </main>
      
    </div>
  );
}

