"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Bot, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

export default function ChatbotCaseStudy() {
  return (
    <div className="min-h-screen bg-slate-200 py-12 px-4 font-sans text-slate-900 flex justify-center selection:bg-orange-200">
      
      <div className="w-full max-w-[1000px] bg-white shadow-2xl rounded-2xl overflow-hidden relative">
        
        {/* Back Button */}
        <Link 
          href="/#projects" 
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 hover:text-slate-800 uppercase transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Top Half (White Background) */}
        <div className="px-12 md:px-20 pt-24 pb-16 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="md:w-1/2">
            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-6">
              E-Commerce Flagship Project<br/>
              <span className="font-medium text-slate-400">Bengaluru, India</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-4 uppercase" style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.1)', transformOrigin: 'left' }}>
              <span className="block text-slate-400">AI Support</span>
              <span className="block">Case</span>
              <span className="block">Study</span>
            </h1>
          </div>

          {/* Abstract Illustration Representation */}
          <div className="md:w-1/2 relative h-64 w-full flex items-center justify-center">
            <div className="absolute w-48 h-48 bg-orange-500 rounded-full mix-blend-multiply opacity-80 animate-blob"></div>
            <div className="absolute w-48 h-48 bg-teal-500 rounded-full mix-blend-multiply opacity-80 animate-blob animation-delay-2000 left-20"></div>
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center gap-4 rotate-3">
              <Bot size={48} className="text-slate-800" />
              <Zap size={32} className="text-orange-500" />
              <MessageSquare size={40} className="text-teal-600" />
            </div>
            {/* Small floating elements */}
            <div className="absolute top-10 left-10 bg-white p-2 rounded-lg shadow-md rotate-[-10deg]"><ShieldCheck size={20} className="text-green-500"/></div>
            <div className="absolute bottom-10 right-10 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-slate-700">94.4% F1</div>
          </div>
        </div>

        {/* Bottom Half (Light Gray Background) */}
        <div className="bg-slate-100 px-12 md:px-20 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-slate-200">
          
          {/* Left Column */}
          <div className="md:col-span-7 space-y-12">
            
            {/* Overview */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Project Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium text-justify">
                An intelligent conversational support agent designed to guide users through shipping, returns, and warranty policies. The platform decouples a fast FastAPI backend from a sleek, glassmorphic React client, utilizing server-sent events (SSE) to stream answers in real-time.
              </p>
            </section>

            {/* Engineering Decisions (Fieldset Style) */}
            <fieldset className="border-t-2 border-orange-500 pt-6 mt-8 relative">
              <legend className="text-orange-500 font-black uppercase tracking-widest text-sm px-2 -ml-2 bg-slate-100 absolute -top-3">
                Engineering Decisions
              </legend>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">The 512MB RAM Constraint</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    Hosting RAG systems using local embeddings regularly triggered Out-Of-Memory crashes. 
                    <span className="block mt-1 font-semibold text-slate-800">Result: Transitioned to an offline BM25 retrieval index, reducing RAM utilization by 90% (to ~65MB) while running in &lt;1ms.</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">The Punctuation Miss</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    Naive whitespace tokenization caused query misses on punctuated text.
                    <span className="block mt-1 font-semibold text-slate-800">Result: Designed a custom regex tokenizer, boosting Context Precision by 23%.</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">False Escalations</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    Simple keyword routing initiated tickets too aggressively on casual negative words.
                    <span className="block mt-1 font-semibold text-slate-800">Result: Integrated stateful SQLite logging. Escalation only triggers after 2 consecutive frustrated turns.</span>
                  </p>
                </div>
              </div>
            </fieldset>

            {/* Approach / Tech Stack */}
            <section>
              <h3 className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wide">Technology Stack</h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 font-medium">
                <li><span className="font-bold text-slate-800">Frontend:</span> React (Vite), SSE Streaming</li>
                <li><span className="font-bold text-slate-800">Backend:</span> FastAPI, LangChain, ChatGroq, SQLite</li>
                <li><span className="font-bold text-slate-800">Security:</span> Rate Limiter, Prompt Injection Defense</li>
                <li><span className="font-bold text-slate-800">Evaluation:</span> LLM-as-a-judge RAGAS-style test runner</li>
              </ul>
            </section>
            
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            
            <div className="space-y-8">
              {/* Results (Fieldset Style) */}
              <fieldset className="border-t-2 border-orange-500 pt-6 relative bg-white p-6 rounded-b-xl shadow-sm">
                <legend className="text-orange-500 font-black uppercase tracking-widest text-sm px-2 -ml-2 bg-slate-100 absolute -top-3">
                  Quantifiable Results
                </legend>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">94.44% Faithfulness</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">No Hallucinations</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">97.78% Answer Relevancy</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Directness</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">85.56% Context Precision</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Retrieval Focus</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">100% Accuracy & Security</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Router & Prompt Injection Defense</p>
                  </div>
                </div>
              </fieldset>

              {/* Conclusion */}
              <fieldset className="border-t-2 border-orange-500 pt-6 relative">
                <legend className="text-orange-500 font-black uppercase tracking-widest text-sm px-2 -ml-2 bg-slate-100 absolute -top-3">
                  Conclusion
                </legend>
                <p className="text-xs text-slate-600 leading-relaxed text-justify font-medium">
                  By abandoning heavy generic frameworks in favor of a lean, custom-engineered RAG pipeline, this agent achieved 100% security against prompt injection and top-tier relevancy metrics, all while running safely within strict 512MB memory constraints.
                </p>
              </fieldset>
            </div>

            {/* Contact Card */}
            <div className="mt-12 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
              <ul className="space-y-3 text-[11px] font-bold text-slate-700">
                <li className="flex items-center gap-3"><Phone size={14} className="text-orange-500"/> +91 9901724479</li>
                <li className="flex items-center gap-3"><Mail size={14} className="text-orange-500"/> keerthana.b.v.codes@gmail.com</li>
                <li className="flex items-center gap-3"><MapPin size={14} className="text-orange-500"/> Bengaluru, Karnataka</li>
              </ul>
            </div>
            
          </div>
          
        </div>

      </div>
    </div>
  );
}

