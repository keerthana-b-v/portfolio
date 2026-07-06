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
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3 text-center">AI Implemented Developer</h2>
          <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
            I'm a <span className="font-bold text-gray-900">Full Stack Developer</span> based in Bengaluru. My work sits at the intersection of modern web engineering and <span className="font-bold text-gray-900">applied AI</span> — I design schemas, integrate models, configure servers, and ship UIs that real people use.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
            I served as a Full Stack Developer at <span className="font-bold text-gray-900">ASPL Tech Solutions</span>, where I took ownership of production repositories and client deliveries from day one.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
            My research on AI-powered legal document analysis won <span className="font-bold text-gray-900 bg-yellow-100 px-1 rounded">Best Paper at NCRIE-2025</span>. That work wasn't an academic exercise — it's a deployed, full-stack application backed by a <span className="font-bold text-gray-900">fine-tuned BERT model</span> trained on 510 real contracts.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            I hold an <span className="font-bold text-gray-900">MCA from RV Institute</span> of Technology and Management (CGPA: 8.2). I'm actively looking for a role where I can keep building things that matter.
          </p>
        </div>
      </div>
    </div>
  );
};
