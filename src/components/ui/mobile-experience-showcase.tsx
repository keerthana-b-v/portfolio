"use client";

import React, { useState } from "react";
import { ExternalLink, Briefcase, Server, ShieldCheck, Users } from "lucide-react";

export const MobileExperienceShowcase = () => {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <div className="flex flex-col h-full w-full px-6 overflow-hidden pt-4">
      <div className="flex justify-center mb-6 shrink-0">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1">
          <button 
            onClick={() => setShowProjects(false)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${!showProjects ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            Role Details
          </button>
          <button 
            onClick={() => setShowProjects(true)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${showProjects ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            Deployed Projects
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 hide-scrollbar">
        {!showProjects ? (
          <div className="flex flex-col gap-4">
            {/* ASPL Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1 mt-1">ASPL Tech Solutions</h3>
              <p className="text-sm font-bold text-blue-600 mb-1">Full Stack Developer</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Oct 2025 – Mar 2026</p>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 p-1.5 bg-blue-50 text-blue-600 rounded-full h-fit"><Users size={14} /></div>
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">Collaborated directly with 5+ clients to gather requirements, run project updates, and align deliverables with business needs.</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 p-1.5 bg-emerald-50 text-emerald-600 rounded-full h-fit"><Server size={14} /></div>
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">Developed client-facing web applications (React.js, Node.js); built automated HRMS onboarding and implemented RBAC + JWT.</p>
                </li>
              </ul>
            </div>

            {/* Dyashin Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-600" />
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1 mt-1">Dyashin Technosoft</h3>
              <p className="text-sm font-bold text-purple-600 mb-1">MERN Stack Developer Intern</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Nov 2024 – Jan 2025</p>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 p-1.5 bg-purple-50 text-purple-600 rounded-full h-fit"><Briefcase size={14} /></div>
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">Built a full-stack MERN e-commerce platform (JWT auth, 15+ endpoints); resolved 15+ UAT bugs, cutting defects by 40%.</p>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Card 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                <img src="/researchvisions-mobile%20.png" alt="Research Vision" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h5 className="text-base font-extrabold text-gray-900 mb-1">Research Vision</h5>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed line-clamp-2">Corporate technology services website.</p>
                <a href="https://researchvisions.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">Live Site <ExternalLink size={12} /></a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                <img src="/bluemindsurf-mobile.png" alt="Surf School Asia" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h5 className="text-base font-extrabold text-gray-900 mb-1">Surf School Asia</h5>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed line-clamp-2">Surf academy landing page and booking.</p>
                <a href="https://surfschool.asia/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">Live Site <ExternalLink size={12} /></a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                <img src="/suraksha-mobile.png" alt="Suraksha Hospital" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h5 className="text-base font-extrabold text-gray-900 mb-1">Suraksha Hospital</h5>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed line-clamp-2">Healthcare facility landing page.</p>
                <a href="http://surakshahosp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">Live Site <ExternalLink size={12} /></a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
