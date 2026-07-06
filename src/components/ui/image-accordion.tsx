"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  stack: string;
  image: string;
}

const projects: AccordionItem[] = [
  {
    id: "p1",
    title: "AI Conversational Voice Bot",
    description: "Deployed a multilingual conversational voice agent using Vapi AI and OpenAI GPT-4o-Mini with Make.com Google Sheets integration.",
    stack: "Vapi AI, Twilio, Make.com, GPT-4o-Mini",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "p2",
    title: "Legal Document Intelligence Agent",
    description: "Fine-tuned Legal-BERT using LoRA achieving 84.9% F1-score on the CUAD benchmark. Engineered complete data pipeline.",
    stack: "Legal-BERT, PyTorch, Hugging Face, React",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "p3",
    title: "E-Commerce Customer Support Agent",
    description: "Production-grade RAG AI Agent using FastAPI and Llama-3.1 via Groq. Features FAISS vector search and CRM context injection.",
    stack: "Python, FastAPI, LangChain, Llama-3.1",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  },
];

export const ImageAccordion = () => {
  const [active, setActive] = useState<string>("p1");

  return (
    <div className="flex h-[500px] w-full max-w-5xl gap-4 mx-auto pt-24 pb-32">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          className={cn(
            "relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-out",
            active === project.id ? "flex-[4]" : "flex-[1]"
          )}
          onMouseEnter={() => setActive(project.id)}
          layout
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-105"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 hover:bg-black/30" />

          {/* Content */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-white bg-gradient-to-t from-black/80 to-transparent"
            initial={false}
            animate={{
              opacity: active === project.id ? 1 : 0,
              y: active === project.id ? 0 : 20,
            }}
            transition={{ duration: 0.3, delay: active === project.id ? 0.2 : 0 }}
          >
            <h3 className="text-3xl font-bold mb-2 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{project.title}</h3>
            <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-xl">{project.description}</p>
            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 w-fit">
              {project.stack}
            </div>
          </motion.div>

          {/* Collapsed Vertical Title */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={false}
            animate={{
              opacity: active === project.id ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-white font-bold text-xl tracking-widest uppercase -rotate-90 whitespace-nowrap">
              {project.title.split(" ")[0]}
            </h3>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
