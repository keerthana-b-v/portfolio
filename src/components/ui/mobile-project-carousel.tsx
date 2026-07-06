"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { SiPython, SiReact, SiMongodb, SiPytorch, SiHuggingface, SiJavascript, SiWebgl, SiLangchain, SiStreamlit } from "react-icons/si";
import { FaDatabase, FaBrain, FaGithub, FaRobot } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  role: string;
  description: string[];
  stats: { label: string; value: string }[];
  link?: string;
  image: string;
  icons: { icon: React.ReactNode; label: string }[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "AI Voice Agent",
    role: "Voice AI Automation",
    description: [
      "Deployed a multilingual conversational voice agent (English/Tanglish) using Vapi AI and OpenAI GPT-4o-Mini to automate customer order intake and L1 FAQs.",
      "Built a serverless pipeline in Make.com using custom webhooks to automatically extract structured call data and log it directly as new rows in Google Sheets.",
      "Integrated Twilio API to instantly send UPI payment links via SMS upon call ending, adding custom error-handling."
    ],
    stats: [
      { value: "GPT-4o", label: "Model" },
      { value: "Sheets", label: "DB" },
      { value: "Twilio", label: "SMS" }
    ],
    image: "/voice-bot.png",
    icons: [
      { icon: <FaRobot size={16} />, label: "Vapi AI" },
      { icon: <FaDatabase size={16} />, label: "Google Sheets" },
      { icon: <FaBrain size={16} />, label: "GPT-4o-Mini" }
    ],
  },
  {
    id: 2,
    title: "AI Legal Doc Intelligence",
    role: "Applied NLP & Fine-Tuning",
    description: [
      "Fine-tuned Legal-BERT using LoRA for parameter-efficient training, achieving 84.9% F1-score and 84.7% accuracy on the 510-contract CUAD benchmark in ~3 hours.",
      "Engineered a data pipeline using Pandas and Hugging Face Datasets to parse character-span annotations across long-form contracts.",
      "Tracked precision, recall, and confusion matrix analysis to address class imbalance, surfacing this in a live React dashboard."
    ],
    stats: [
      { value: "84.9%", label: "F1" },
      { value: "510", label: "Docs" },
      { value: "Live", label: "Status" }
    ],
    link: "https://github.com/keerthana-b-v/AI-Powered-Legal-Document-Analysis-with-an-Integrated-Trust-and-Safety-Framework-",
    image: "/ai_legal_document.png",
    icons: [
      { icon: <SiPytorch size={16} />, label: "PyTorch" },
      { icon: <SiHuggingface size={16} />, label: "Hugging Face" },
      { icon: <SiReact size={16} />, label: "React" }
    ],
  },
  {
    id: 3,
    title: "E-Com Support Agent",
    role: "RAG & Agent Workflows",
    description: [
      "Built a production-grade AI Agent with FastAPI and React; implemented a RAG pipeline utilizing FAISS vector search and recursive chunking.",
      "Validated retrieval accuracy and system safety through a structured manual evaluation suite covering in-scope queries and boundary edge cases.",
      "Developed simulated enterprise features including CRM context injection into the LLM prompt and an automated ticketing system for human escalation."
    ],
    stats: [
      { value: "FAISS", label: "Vector" },
      { value: "RAG", label: "Pipe" },
      { value: "Auto", label: "Hand" }
    ],
    image: "/ai_ecommerce_agent.png",
    icons: [
      { icon: <SiPython size={16} />, label: "Python" },
      { icon: <SiLangchain size={16} />, label: "LangChain" },
      { icon: <FaDatabase size={16} />, label: "FAISS" }
    ],
  },
];

export const MobileProjectCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const currentProject = projects[currentIndex];

  return (
    <div className="flex flex-col items-center justify-start w-full h-full relative px-2 bg-white overflow-hidden pb-4 pt-2">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          display: block;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #94a3b8 #f1f5f9;
        }
      `}} />
      
      <div className="w-full flex flex-col items-center flex-1 min-h-0 max-h-[580px] my-auto">
        {/* UIverse Inspired Card Mobile */}
        <div className="w-full max-w-[320px] flex-1 min-h-0 flex flex-col bg-slate-50 border border-slate-300 rounded-[2rem] p-3 shadow-2xl relative">
        {/* Top Image Folder Tab Area */}
        <div 
          className="w-full h-[150px] shrink-0 rounded-[1.5rem] rounded-tr-[4rem] p-5 flex flex-col justify-between relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${currentProject.image})` }}
        >
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="flex justify-between items-start z-10">
            <div className="font-black text-2xl text-white tracking-widest border-b-2 border-white pb-1">UI</div>
            <div className="flex gap-3 text-white">
              {currentProject.link && (
                <a href={currentProject.link} target="_blank" rel="noopener noreferrer" className="active:scale-95 transition-transform"><FaGithub size={20}/></a>
              )}
            </div>
          </div>
          
          <div className="z-10 mt-auto">
             <div className="flex gap-2 text-white">
                {currentProject.icons.map((item, idx) => (
                  <div key={idx} className="p-2 bg-white/30 backdrop-blur-md rounded-xl" title={item.label}>
                     {item.icon}
                  </div>
                ))}
             </div>
          </div>

          <div className="absolute -top-12 -right-12 w-24 h-24 bg-slate-50 rounded-full blur-xl opacity-40 pointer-events-none z-10" />
        </div>

        {/* Bottom Light Area */}
        <div className="px-4 pt-4 pb-4 flex flex-col items-center flex-1 overflow-hidden">
          <h3 className="text-gray-900 font-extrabold text-lg mb-1 text-center tracking-wide leading-snug shrink-0">
            {currentProject.title.toUpperCase()}
          </h3>
          <p className="text-blue-600 text-[10px] font-bold mb-4 text-center tracking-widest uppercase shrink-0">
            {currentProject.role}
          </p>

          <div className="flex-1 overflow-y-scroll w-full mb-4 min-h-0 relative pr-2 custom-scrollbar">
            <ul className="text-gray-700 text-[11px] text-left leading-relaxed font-medium list-disc pl-4 space-y-2 pr-2">
              {currentProject.description.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Stats Columns */}
          <div className="flex justify-between w-full border-t border-gray-200 pt-4 px-1 shrink-0">
            {currentProject.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 border-r border-gray-200 last:border-0 pr-3 last:pr-0 pl-3 first:pl-0 w-1/3">
                <p className="text-blue-600 font-black text-lg tracking-tight leading-none">{stat.value}</p>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest text-center mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Controls (Moved to bottom) */}
      <div className="flex gap-6 mt-4 z-20">
        <button onClick={handlePrev} className="p-3 bg-white rounded-full border border-gray-200 shadow-md active:scale-95 transition-transform hover:bg-gray-50">
          <ChevronLeft size={20} className="text-gray-800"/>
        </button>
        <button onClick={handleNext} className="p-3 bg-white rounded-full border border-gray-200 shadow-md active:scale-95 transition-transform hover:bg-gray-50">
          <ChevronRight size={20} className="text-gray-800"/>
        </button>
      </div>

      </div>

    </div>
  );
};
