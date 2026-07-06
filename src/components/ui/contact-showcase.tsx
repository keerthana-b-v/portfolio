"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaPhone, FaFileAlt, FaBlog } from "react-icons/fa";

export const ContactShowcase = () => {
  const links = [
    { icon: FaGithub, label: "GitHub", href: "https://github.com/keerthana-b-v", color: "bg-gray-900" },
    { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/", color: "bg-blue-600" },
    { icon: FaGraduationCap, label: "Google Scholar", href: "https://scholar.google.com/", color: "bg-blue-500" },
    { icon: FaEnvelope, label: "Email Me", href: "mailto:keerthana.b.v.codes@gmail.com", color: "bg-red-500" },
    { icon: FaPhone, label: "9901724479", href: "tel:+919901724479", color: "bg-emerald-500" },
    { icon: FaFileAlt, label: "Resume", href: "/resume.pdf", color: "bg-purple-500" },
    { icon: FaBlog, label: "Blog", href: "https://blog.keerthanabv.in", color: "bg-orange-500" },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 bg-white overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Get in touch</h2>
        <p className="text-gray-500 text-sm font-medium mb-8">Connect with me on social media or reach out directly.</p>
        
        <div className="flex flex-col gap-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-bold transition-transform active:scale-95 shadow-md ${link.color}`}
            >
              <link.icon size={20} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
