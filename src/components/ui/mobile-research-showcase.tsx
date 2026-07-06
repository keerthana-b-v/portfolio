"use client";

import React from "react";
import { ExternalLink, Trophy, FileText, Database, ShieldCheck, GraduationCap } from "lucide-react";

export const MobileResearchShowcase = () => {
  return (
    <div className="flex flex-col h-full w-full px-6 overflow-hidden pt-4">
      <div className="flex-1 overflow-y-auto pb-8 hide-scrollbar">
        <div 
          className="bg-cover bg-center rounded-3xl shadow-xl border border-blue-100 overflow-hidden relative mb-6"
          style={{ backgroundImage: `url('/legal-research.png')` }}
        >
          <div className="absolute inset-0 bg-white/92 backdrop-blur-[1px] z-0" />
          <div className="relative z-10 p-6 pt-12">
            <div className="absolute top-0 right-0 p-4 bg-yellow-400 text-black font-black text-xs uppercase tracking-widest rounded-bl-3xl flex items-center gap-1 shadow-md">
              <Trophy size={14} /> Best Paper
            </div>
            
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Published Research</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">AI Legal Document Analyser</h3>
            
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-6">
              Fine-tuned a BERT transformer on 510 CUAD legal contracts to automate clause extraction and risk classification. Integrated a Trust & Safety module with automated PII redaction, live fairness auditing, and privacy analysis — making AI-driven legal review accurate, transparent, and responsible.
            </p>
            
            <div className="flex flex-col gap-3">
              <a href="https://github.com/keerthana-b-v/AI-Powered-Legal-Document-Analysis-with-an-Integrated-Trust-and-Safety-Framework-" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-900 border border-blue-100 shadow-sm">
                <FileText size={18} className="text-blue-600"/> View on GitHub
              </a>
              <a href="https://drive.google.com/file/d/1nPK1FBLpzKAEEKXouHAY0RT9Fjy8UlK3/view" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-900 border border-blue-100 shadow-sm">
                <Trophy size={18} className="text-yellow-500"/> Certificate
              </a>
              <a href="https://scholar.google.com/citations?view_op=list_works&hl=id&user=-gac19IAAAAJ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-900 border border-blue-100 shadow-sm">
                <GraduationCap size={18} className="text-blue-500"/> Scholar
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
            <h4 className="text-2xl font-black text-blue-600 tracking-tight">84.9%</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">F1-Score</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
            <h4 className="text-2xl font-black text-blue-600 tracking-tight">510</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Contracts</p>
          </div>
        </div>
      </div>
    </div>
  );
};
