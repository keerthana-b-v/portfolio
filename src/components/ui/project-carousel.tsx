"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
    role: "AI Integration Engineer",
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
    title: "AI Customer Support Conversational Agent",
    role: "AI Developer",
    description: [
      "Architected and deployed a full-stack e-commerce support RAG agent streaming real-time responses via SSE at sub-second latency; live on Render + Vercel.",
      "Red-teamed the agent with adversarial inputs and built double-layer prompt-injection defenses, achieving a 100% block rate on the attack test suite.",
      "Validated answer quality with a custom RAGAS evaluation runner — 94.4% faithfulness and 85.5% context precision.",
      "Engineered stateful intent routing with multi-turn sentiment tracking that auto-escalates frustrated customers to ticketed human handoff."
    ],
    image: "/chatbot.png",
    link: "https://ai-customer-support-conversational.vercel.app/",
    icons: [
      { icon: <SiFastapi size={24} />, label: "FastAPI" },
      { icon: <SiReact size={24} />, label: "React" },
      { icon: <SiLangchain size={24} />, label: "LangChain" },
      { icon: <FaDatabase size={24} />, label: "SQLite" }
    ],
  },
  {
    id: 3,
    title: "AI Legal Document Intelligence (Best Paper, NCRIE 2025)",
    role: "Lead Full Stack AI Engineer",
    description: [
      "Fine-tuned a domain-specific BERT model with LoRA to 84.9% F1 on the 510-contract CUAD benchmark in ~3 hours on a single T4 GPU; published with Best Paper Distinction.",
      "Applied evidence-driven evaluation (precision, recall, confusion-matrix analysis) — the same measurement mindset used to judge where agents fail and fix them."
    ],
    image: "/legal.png",
    link: "https://github.com/keerthana-b-v/AI-Powered-Legal-Document-Analysis-with-an-Integrated-Trust-and-Safety-Framework-",
    icons: [
      { icon: <SiPytorch size={24} />, label: "PyTorch" },
      { icon: <SiHuggingface size={24} />, label: "Hugging Face" },
      { icon: <SiReact size={24} />, label: "React.js" },
      { icon: <SiMongodb size={24} />, label: "MongoDB" }
    ],
  },
];

export const ProjectCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    setIsLightboxOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    setIsLightboxOpen(false);
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
            onClick={() => setIsLightboxOpen(true)}
            className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 top-0 h-[450px] w-[95%] md:w-[55%] lg:w-[62%] xl:w-[68%] rounded-[2.5rem] bg-cover bg-left shadow-2xl cursor-zoom-in hover:scale-[1.01] transition-transform duration-350"
            style={{ backgroundImage: `url(${currentProject.image})` }}
          />

          {/* Overlapping White Profile Card */}
          <div className="absolute right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 top-1/2 -translate-y-1/2 w-[90%] md:w-[50%] lg:w-[45%] xl:w-[42%] rounded-[2rem] bg-white/95 md:bg-white p-6 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col justify-between min-h-[400px] backdrop-blur-sm md:backdrop-blur-none">
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            >
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-colors shadow-md hover:scale-105"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
