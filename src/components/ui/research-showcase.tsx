"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, FileBadge2 } from "lucide-react";
import { FaGithub, FaGraduationCap } from "react-icons/fa";

export const ResearchShowcase = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full h-auto bg-cover bg-center rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-800 flex flex-col md:flex-row overflow-hidden relative"
        style={{ backgroundImage: `url('/legal-research.png')` }}
      >
        {/* Full Card Dark Overlay */}
        <div className="absolute inset-0 bg-black/85 z-0" />

        {/* Left Content Area */}
        <div className="flex-[3] p-8 md:p-12 flex flex-col justify-center overflow-y-auto relative z-10">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm tracking-widest uppercase mb-4 bg-yellow-950/40 w-fit px-3 py-1 rounded-full border border-yellow-800/40">
            <Trophy size={16} />
            Best Paper Presentation — NCRIE-2025
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            AI Legal Document Analyser
          </h2>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            Fine-tuned a BERT transformer on 510 CUAD legal contracts to automate clause extraction and risk classification. Integrated a Trust & Safety module with automated PII redaction, live fairness auditing, and privacy analysis — making AI-driven legal review accurate, transparent, and responsible. Full-stack application, not just a paper.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="https://github.com/keerthana-b-v/AI-Powered-Legal-Document-Analysis-with-an-Integrated-Trust-and-Safety-Framework-" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              <FaGithub size={18} />
              View on GitHub
            </a>
            <a href="https://drive.google.com/file/d/1nPK1FBLpzKAEEKXouHAY0RT9Fjy8UlK3/view" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              <FileBadge2 size={18} />
              Certificate
            </a>
            <a href="https://scholar.google.com/citations?view_op=list_works&hl=id&user=-gac19IAAAAJ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              <FaGraduationCap size={18} />
              Scholar
            </a>
          </div>
          
          <div className="text-sm font-medium text-gray-400 border-t border-white/10 pt-6">
            Published at: <span className="text-white">NCRIE-2025 · Best Paper Award · KSIT, Bengaluru</span>
          </div>
        </div>

        {/* Right Metrics Area */}
        <div className="w-full md:w-[350px] p-10 text-white flex flex-col justify-center relative z-10 border-l border-white/10 bg-black/25">
          <h3 className="text-xl font-bold mb-8 text-gray-200">Model Performance</h3>
          
          <div className="grid grid-cols-2 gap-y-10 gap-x-6">
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-1">84.9%</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">F1-Score</div>
            </div>
            
            <div>
              <div className="text-4xl font-black text-blue-400 mb-1">84.7%</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Accuracy</div>
            </div>
            
            <div>
              <div className="text-4xl font-black text-purple-400 mb-1">510</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Contracts</div>
            </div>
            
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-1">CUAD</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Benchmark</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
