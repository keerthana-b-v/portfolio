"use client";

import React, { useState } from "react";
import { ChevronDown, Code2, Cpu, Mic, Workflow, MessageSquare } from "lucide-react";

export const SkillsShowcase = () => {
  const [activeCategories, setActiveCategories] = useState<number[]>([0, 1, 2, 3, 4]);

  const skillCategories = [
    {
      title: "Prompt Engineering",
      icon: <MessageSquare size={24} className="text-purple-600" />,
      skills: ["System Prompts", "Dialogue Flow", "Context Handling", "JSON Schema", "Slot-filling", "Red-teaming", "Injection Defense", "Hallucination Mitigation"]
    },
    {
      title: "Voice AI",
      icon: <Mic size={24} className="text-blue-600" />,
      skills: ["Vapi AI (STT/TTS)", "Twilio", "Call-flow Design", "Tanglish & Vernacular", "Latency-aware Turn-taking"]
    },
    {
      title: "LLM Tooling",
      icon: <Cpu size={24} className="text-emerald-600" />,
      skills: ["GPT-4o-mini", "Llama-3.1 (Groq)", "LangChain", "RAG", "RAGAS Evaluation", "FAISS/BM25", "Context Windows"]
    },
    {
      title: "Automation & Integration",
      icon: <Workflow size={24} className="text-orange-600" />,
      skills: ["Make.com", "Webhooks", "Google Sheets pipelines", "REST APIs", "Error-handling Routes", "Low-code Workflows"]
    },
    {
      title: "Engineering & Client-Facing",
      icon: <Code2 size={24} className="text-gray-600" />,
      skills: ["Python", "JavaScript", "SQL", "FastAPI", "React.js", "Git", "Requirement Gathering", "Client Demos", "UAT"]
    }
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-6 md:px-10 overflow-hidden pt-8 pb-12">
      <div className="mb-8 shrink-0 text-center md:text-left">
         <h4 className="text-4xl font-black text-gray-900 tracking-tight">Technical Competence</h4>
         <p className="text-lg text-gray-500 font-medium leading-relaxed mt-2">Core tools I leverage to architect scalable web apps and secure AI workflows.</p>
      </div>

      <div className="flex-1 overflow-y-scroll pb-8 pr-2">
        <div className="flex flex-col gap-4">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)] overflow-hidden">
              <button 
                onClick={() => setActiveCategories(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])}
                className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">{cat.icon}</div>
                  <span className="text-xl font-extrabold text-gray-900">{cat.title}</span>
                </div>
                <ChevronDown size={24} className={`text-gray-400 transition-transform ${activeCategories.includes(idx) ? "rotate-180" : ""}`} />
              </button>
              
              <div className={`transition-all duration-300 overflow-hidden ${activeCategories.includes(idx) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-6 flex flex-wrap gap-3">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm hover:border-gray-300 transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
