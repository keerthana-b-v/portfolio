"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Trophy, Briefcase, FileBadge2, Mail, Rss } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const AboutShowcase = () => {
  return (
    <div className="flex h-full w-full flex-col max-w-7xl mx-auto px-6 md:px-10 overflow-y-auto pb-8 justify-center">
      <div className="block lg:hidden mb-6 mt-4 text-center">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">About Me</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center mt-2 lg:mt-4">
        
        {/* Left: Bio & Details */}
        <div className="flex-[1.5] flex flex-col gap-8 order-3 lg:order-1">
          <div className="text-gray-700 leading-relaxed font-medium text-base lg:text-lg xl:text-xl space-y-4 lg:space-y-6">
            <h2 className="text-3xl lg:text-3xl xl:text-4xl font-black text-gray-900 tracking-tight mb-4 lg:mb-6 hidden lg:block">AI Agent Developer | Full-Stack Engineer</h2>
            <p>
              I'm a <span className="font-bold text-gray-900">Full Stack Developer</span> based in Bengaluru. My work sits at the intersection of modern web engineering and <span className="font-bold text-gray-900">applied AI</span> — I design schemas, integrate models, configure servers, and ship UIs that real people use.
            </p>
            <p>
              I served as a Full Stack Developer at <span className="font-bold text-gray-900">ASPL Tech Solutions</span>, where I took ownership of production repositories and client deliveries from day one.
            </p>
            <p>
              My research on AI-powered legal document analysis won <span className="font-bold text-gray-900 bg-yellow-100 px-1 rounded">Best Paper at NCRIE-2025</span>. That work wasn't an academic exercise — it's a deployed, full-stack application backed by a <span className="font-bold text-gray-900">fine-tuned BERT model</span> trained on 510 real contracts.
            </p>
            <p>
              I hold an <span className="font-bold text-gray-900">MCA from RV Institute</span> of Technology and Management (CGPA: 8.2). I'm actively looking for a role where I can keep building things that matter.
            </p>
          </div>
        </div>

        {/* Right: Profile Image */}
        <div className="flex-1 flex flex-col gap-10 w-full max-w-lg order-2 lg:order-2">
          {/* Profile Image */}
          <div className="w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            <img 
              src="/photo.jpeg" 
              alt="Keerthana B V" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-black tracking-tight">Keerthana B V</h3>
              <p className="font-medium opacity-90 flex items-center gap-2 text-sm mt-1">
                <MapPin size={14} /> Bengaluru, Karnataka
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
