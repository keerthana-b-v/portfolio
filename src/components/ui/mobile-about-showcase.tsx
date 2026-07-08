"use client";

import React from "react";
import { MapPin } from "lucide-react";

export const MobileAboutShowcase = () => {
  return (
    <div className="flex flex-col h-full w-full px-6 overflow-hidden items-center justify-start pt-4">
      {/* Image removed for mobile view to save space as requested */}

      {/* Text Area (Internally scrollable if needed) */}
      <div className="flex-1 overflow-y-auto pb-8 w-full hide-scrollbar">
        <div className="prose prose-sm text-gray-700 leading-relaxed font-medium">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3 text-center">AI Solutions Engineer | Voice AI & LLM Agents</h2>
          <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
            I am a <span className="font-bold text-gray-900">Voice AI and LLM developer</span> based in Bengaluru who has designed, prompted, and shipped production conversational agents end to end. My expertise includes building real-time voice systems with natural, low-latency turn-taking and securing RAG pipelines with verified accuracy scores.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
            Previously, I worked as a Full Stack Developer at <span className="font-bold text-gray-900">ASPL Tech Solutions</span>, where I collaborated directly with 5+ clients to gather requirements, run project updates, and translate business goals into production-ready software.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
            My research on AI-powered legal document analysis won <span className="font-bold text-gray-900 bg-yellow-100 px-1 rounded">Best Paper Distinction at NCRIE-2025</span>. This project involved fine-tuning a domain-specific BERT model with LoRA on a single T4 GPU, achieving an 84.9% F1 score.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            I hold an <span className="font-bold text-gray-900">MCA from RV Institute of Technology and Management</span> (CGPA: 8.2) and a BCA from Community Institute of Commerce and Management (CGPA: 8.4).
          </p>
        </div>
      </div>
    </div>
  );
};
