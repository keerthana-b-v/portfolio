"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiPython, SiReact, SiMongodb, SiFastapi, SiHuggingface, SiPytorch, SiJavascript, SiWebgl, SiLangchain, SiStreamlit } from "react-icons/si";
import { FaRobot, FaDatabase, FaSms, FaBrain } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  role: string;
  description: string[];
  image: string;
  link?: string;
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
    image: "/voice-bot.png",
    icons: [
      { icon: <FaRobot size={24} />, label: "Vapi AI" },
      { icon: <FaSms size={24} />, label: "Twilio API" },
      { icon: <FaDatabase size={24} />, label: "Google Sheets" },
      { icon: <FaBrain size={24} />, label: "GPT-4o-Mini" }
    ],
  },
  {
    id: 2,
    title: "AI Legal Document Intelligence",
    role: "Applied NLP & Fine-Tuning",
    description: [
      "Fine-tuned Legal-BERT using LoRA for parameter-efficient training, achieving 84.9% F1-score and 84.7% accuracy on the 510-contract CUAD benchmark in ~3 hours.",
      "Engineered a data pipeline using Pandas and Hugging Face Datasets to parse character-span annotations across long-form contracts.",
      "Tracked precision, recall, and confusion matrix analysis to address class imbalance, surfacing this in a live React dashboard."
    ],
    image: "/ai_legal_document.png",
    link: "https://github.com/keerthana-b-v/AI-Powered-Legal-Document-Analysis-with-an-Integrated-Trust-and-Safety-Framework-",
    icons: [
      { icon: <SiPytorch size={24} />, label: "PyTorch" },
      { icon: <SiHuggingface size={24} />, label: "Hugging Face" },
      { icon: <SiReact size={24} />, label: "React.js" },
      { icon: <SiMongodb size={24} />, label: "MongoDB" }
    ],
  },
  {
    id: 3,
    title: "E-Commerce Customer Support Agent",
    role: "RAG & Agent Workflows",
    description: [
      "Built a production-grade AI Agent with FastAPI and React; implemented a RAG pipeline utilizing FAISS vector search and recursive chunking.",
      "Validated retrieval accuracy and system safety through a structured manual evaluation suite covering in-scope queries and boundary edge cases.",
      "Developed simulated enterprise features including CRM context injection into the LLM prompt and an automated ticketing system for human escalation."
    ],
    image: "/ai_ecommerce_agent.png",
    icons: [
      { icon: <SiPython size={24} />, label: "Python" },
      { icon: <SiLangchain size={24} />, label: "LangChain" },
      { icon: <FaDatabase size={24} />, label: "FAISS" },
      { icon: <SiFastapi size={24} />, label: "FastAPI" }
    ],
  },
];

export const ProjectCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const currentProject = projects[currentIndex];

  return (
    <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center p-8 mx-auto overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full max-w-6xl h-[500px] flex items-center justify-center"
        >
          {/* Main Large Image */}
          <div
            className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 top-0 h-[450px] w-[95%] md:w-[70%] rounded-[2.5rem] bg-cover bg-center shadow-2xl"
            style={{ backgroundImage: `url(${currentProject.image})` }}
          />

          {/* Overlapping White Profile Card */}
          <div className="absolute right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 top-1/2 -translate-y-1/2 w-[90%] md:w-[45%] rounded-[2rem] bg-white/95 md:bg-white p-6 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col justify-between min-h-[400px] backdrop-blur-sm md:backdrop-blur-none">
            <div className="flex-1 overflow-y-auto pr-4 hide-scrollbar">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                {currentProject.title}
              </h3>
              <p className="text-sm font-bold text-blue-600 mb-5 tracking-widest uppercase">
                {currentProject.role}
              </p>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-3 list-disc pl-5">
                {currentProject.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Icons with Tooltips */}
            <div className="flex flex-wrap items-center gap-4 mt-8 text-gray-800">
              {currentProject.icons.map((item, idx) => (
                <div key={idx} className="relative group p-3 bg-gray-50 rounded-full border border-gray-200 hover:scale-110 hover:bg-gray-100 hover:text-black transition-all cursor-pointer">
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 transition-all rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white group-hover:scale-100 shadow-md whitespace-nowrap z-10">
                    {item.label}
                  </span>
                  {item.icon}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex gap-4">
              {currentProject.link && (
                <a href={currentProject.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-wider text-black border-b-2 border-black hover:text-blue-600 hover:border-blue-600 transition-colors pb-1 uppercase">View Repository</a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Controls (Left / Right Mid) */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-[60%] -translate-y-1/2 p-4 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:scale-110 transition-all z-20"
      >
        <ChevronLeft size={28} className="text-gray-700" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-[60%] -translate-y-1/2 p-4 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:scale-110 transition-all z-20"
      >
        <ChevronRight size={28} className="text-gray-700" />
      </button>
    </div>
  );
};
