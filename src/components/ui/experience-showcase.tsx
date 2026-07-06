"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Briefcase, Server, ShieldCheck, Users } from "lucide-react";

export const ExperienceShowcase = () => {
  return (
    <div className="flex h-full w-full flex-col max-w-7xl mx-auto px-6 md:px-10 overflow-y-auto hide-scrollbar pb-8 justify-center">
      <div className="flex flex-col lg:flex-row gap-16 mt-4">
        
        {/* Left: Timeline & Role */}
        <div className="flex-1">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">ASPL Tech Solutions Pvt. Ltd.</h3>
            </div>
            
            <p className="text-lg font-bold text-blue-600 mb-1">Full Stack Developer · Product Delivery Focus</p>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Oct 23, 2025 – Mar 23, 2026</p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-full h-fit"><Briefcase size={18} /></div>
                <p className="text-gray-700 leading-relaxed font-medium">Executed the full-cycle delivery of <strong>8+ production applications</strong> within a high-intensity delivery sprint, managing the complete roadmap from architectural design to cloud deployment.</p>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-emerald-50 text-emerald-600 rounded-full h-fit"><Users size={18} /></div>
                <p className="text-gray-700 leading-relaxed font-medium">Built a full-stack HRMS platform digitizing onboarding for 4 departments, reducing administrative processing time by <strong>35%</strong>.</p>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-purple-50 text-purple-600 rounded-full h-fit"><ShieldCheck size={18} /></div>
                <p className="text-gray-700 leading-relaxed font-medium">Implemented secure RBAC with JWT/bcrypt and optimized RESTful APIs for real-time Recharts dashboards, improving client satisfaction scores by <strong>15%</strong>.</p>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-orange-50 text-orange-600 rounded-full h-fit"><Server size={18} /></div>
                <p className="text-gray-700 leading-relaxed font-medium">Configured and managed <strong>3+ live production sites</strong> on Linux VPS using Nginx, handling full SDLC orchestration including SSL/TLS and domain management.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Deployed Projects Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <h4 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Live Deployed Websites</h4>
          
          {/* Card 1 */}
          <motion.div whileHover={{ scale: 1.02 }} className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start cursor-pointer hover:bg-white hover:shadow-xl transition-all">
            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden relative">
              <img src="/researchvision-desktop.png" alt="Research Vision" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h5 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Research Vision</h5>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">Corporate technology services website with modular product and services storytelling.</p>
              <a href="https://researchvisions.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">Live Site <ExternalLink size={14} /></a>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ scale: 1.02 }} className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start cursor-pointer hover:bg-white hover:shadow-xl transition-all">
            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden relative">
              <img src="/bluemindsurf-desktop.png" alt="Surf School Asia" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h5 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Surf School Asia</h5>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">Surf academy landing page with hero messaging and lesson booking emphasis.</p>
              <a href="https://surfschool.asia/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">Live Site <ExternalLink size={14} /></a>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ scale: 1.02 }} className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start cursor-pointer hover:bg-white hover:shadow-xl transition-all">
            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden relative">
              <img src="/suraksha-desktop.png" alt="Suraksha Hospital" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h5 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Suraksha Hospital</h5>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">Healthcare facility landing page built with HTML, CSS, JS, and Bootstrap.</p>
              <a href="http://surakshahosp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">Live Site <ExternalLink size={14} /></a>
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};
