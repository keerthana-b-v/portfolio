"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Home, User, Briefcase, FolderGit2, FlaskConical, Code2, Phone, Rss, FileText } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HOME: <Home size={20} />,
  ABOUT: <User size={20} />,
  EXPERIENCE: <Briefcase size={20} />,
  PROJECTS: <FolderGit2 size={20} />,
  RESEARCH: <FlaskConical size={20} />,
  SKILLS: <Code2 size={20} />,
  CONTACT: <Phone size={20} />,
  RESUME: <FileText size={20} />,
  BLOG: <Rss size={20} />,
};

export const MobileNav = ({ navLinks, activeTab }: { navLinks: NavLink[], activeTab: string }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden">
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      <div className="flex items-center justify-start gap-2 overflow-x-auto px-4 pt-3 pb-2 [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full" style={{ transform: "rotateX(180deg)" }}>
        {navLinks.map((link) => {
          const isActive = activeTab === link.label;
          return (
            <button
              key={link.label}
              onClick={(e) => {
                if (link.onClick) link.onClick();
              }}
              className={cn(
                "flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-colors shrink-0",
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-black hover:bg-gray-50"
              )}
              style={{ transform: "rotateX(180deg)" }}
            >
              <div className="mb-1">{iconMap[link.label] || <FolderGit2 size={20} />}</div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
