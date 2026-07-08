"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Briefcase, Server, ShieldCheck, Users } from "lucide-react";

export const ExperienceShowcase = () => {
  return (
    <div className="flex h-full w-full flex-col max-w-7xl mx-auto px-6 md:px-10 overflow-hidden md:overflow-y-auto hide-scrollbar pb-8 justify-center">
      <div className="flex flex-col lg:flex-row gap-16 mt-4">
        
        {/* Left: Timeline & Role */}
        <div className="flex-1">
          {/* ASPL Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">ASPL Tech Solutions Pvt. Ltd.</h3>
            </div>
            
            <p className="text-base font-bold text-blue-600 mb-1">Full Stack Developer</p>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Oct 2025 – Mar 2026</p>

            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-full h-fit"><Users size={16} /></div>
                <p className="text-gray-700 leading-relaxed font-medium text-sm">Collaborated directly with 5+ clients to gather requirements, run project updates, and align deliverables with business needs — hands-on experience translating customer goals into working software.</p>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-emerald-50 text-emerald-600 rounded-full h-fit"><Server size={16} /></div>
                <p className="text-gray-700 leading-relaxed font-medium text-sm">Developed client-facing web applications (React.js, Node.js) for healthcare and retail; built an automated HRMS onboarding module and implemented RBAC + JWT authentication.</p>
              </li>
            </ul>
          </div>

          {/* Dyashin Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-purple-600" />
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dyashin Technosoft Pvt. Ltd.</h3>
            </div>
            
            <p className="text-base font-bold text-purple-600 mb-1">MERN Stack Developer Intern</p>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Nov 2024 – Jan 2025</p>

            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="mt-1 p-2 bg-purple-50 text-purple-600 rounded-full h-fit"><Briefcase size={16} /></div>
                <p className="text-gray-700 leading-relaxed font-medium text-sm">Built a full-stack MERN e-commerce platform (JWT auth, 15+ documented REST endpoints); resolved 15+ critical UAT bugs, cutting post-launch defects by 40%.</p>
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
