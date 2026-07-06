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
        className="max-w-6xl w-full h-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Content Area */}
        <div className="flex-[3] p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="flex items-center gap-2 text-yellow-600 font-bold text-sm tracking-widest uppercase mb-4 bg-yellow-50 w-fit px-3 py-1 rounded-full border border-yellow-100">
            <Trophy size={16} />
            Best Paper Presentation — NCRIE-2025
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            AI Legal Document Analyser
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            Fine-tuned a BERT transformer on 510 CUAD legal contracts to automate clause extraction and risk classification. Integrated a Trust & Safety module with automated PII redaction, live fairness auditing, and privacy analysis — making AI-driven legal review accurate, transparent, and responsible. Full-stack application, not just a paper.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="https://github.com/keerthana-b-v/AI-Powered-Legal-Document-Analysis-with-an-Integrated-Trust-and-Safety-Framework-" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              <FaGithub size={18} />
              View on GitHub
            </a>
            <a href="https://drive.google.com/file/d/1nPK1FBLpzKAEEKXouHAY0RT9Fjy8UlK3/view" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 text-gray-800 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              <FileBadge2 size={18} />
              Certificate
            </a>
            <a href="https://scholar.google.com/citations?view_op=list_works&hl=id&user=-gac19IAAAAJ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 text-gray-800 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              <FaGraduationCap size={18} />
              Scholar
            </a>
          </div>
          
          <div className="text-sm font-medium text-gray-500 border-t border-gray-100 pt-6">
            Published at: <span className="text-gray-900">NCRIE-2025 · Best Paper Award · KSIT, Bengaluru</span>
          </div>
        </div>

        {/* Right Metrics Area */}
        <div className="w-full md:w-[350px] bg-gradient-to-br from-gray-900 to-black p-10 text-white flex flex-col justify-center">
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
