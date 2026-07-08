"use client";

import React, { useState } from "react";
import { ChevronDown, Code2, Cpu, Mic, Workflow, MessageSquare, Database, Server, Wrench, Briefcase } from "lucide-react";

export const MobileSkillsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(0);

  const skillCategories = [
    {
      title: "Prompt Engineering",
      icon: <MessageSquare size={16} className="text-purple-600" />,
      skills: ["System Prompts", "Dialogue Flow", "Context Handling", "JSON Schema", "Slot-filling", "Red-teaming", "Injection Defense", "Hallucination Mitigation"]
    },
    {
      title: "Voice AI",
      icon: <Mic size={16} className="text-blue-600" />,
      skills: ["Vapi AI (STT/TTS)", "Twilio", "Call-flow Design", "Tanglish & Vernacular", "Latency-aware Turn-taking"]
    },
    {
      title: "LLM Tooling",
      icon: <Cpu size={16} className="text-emerald-600" />,
      skills: ["GPT-4o-mini", "Llama-3.1 (Groq)", "LangChain", "RAG", "RAGAS Evaluation", "FAISS/BM25", "Context Windows"]
    },
    {
      title: "Automation & Integration",
      icon: <Workflow size={16} className="text-orange-600" />,
      skills: ["Make.com", "Webhooks", "Google Sheets pipelines", "REST APIs", "Error-handling Routes", "Low-code Workflows"]
    },
    {
      title: "Frontend Development",
      icon: <Code2 size={16} className="text-sky-600" />,
      skills: ["React.js", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Redux", "HTML5", "CSS3"]
    },
    {
      title: "Backend & Cloud",
      icon: <Server size={16} className="text-red-600" />,
      skills: ["Node.js", "Express.js", "FastAPI", "Python", "Nginx", "Linux VPS", "REST APIs", "JWT"]
    },
    {
      title: "Database & Storage",
      icon: <Database size={16} className="text-indigo-600" />,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "FAISS", "Vector DBs"]
    },
    {
      title: "Tools & DevOps",
      icon: <Wrench size={16} className="text-amber-600" />,
      skills: ["Git", "GitHub", "Docker", "Postman", "Vercel", "Figma"]
    },
    {
      title: "Engineering & Client-Facing",
      icon: <Briefcase size={16} className="text-gray-600" />,
      skills: ["Python", "JavaScript", "SQL", "FastAPI", "React.js", "Git", "Requirement Gathering", "Client Demos", "UAT"]
    }
  ];

  return (
    <div className="flex flex-col h-full w-full px-6 overflow-hidden pt-4">
      <div className="mb-4 shrink-0">
         <h4 className="text-2xl font-black text-gray-900 tracking-tight">Technical Competence</h4>
         <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1">Core tools I leverage to architect scalable web apps and secure AI workflows.</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 hide-scrollbar">
        <div className="flex flex-col gap-3">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)] overflow-hidden">
              <button 
                onClick={() => setActiveCategory(activeCategory === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">{cat.icon}</div>
                  <span className="font-extrabold text-gray-900">{cat.title}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${activeCategory === idx ? "rotate-180" : ""}`} />
              </button>
              
              <div className={`transition-all duration-300 overflow-hidden ${activeCategory === idx ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-4 flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
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
