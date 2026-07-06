"use client";

import React, { useState } from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { AnimatePresence, motion } from 'framer-motion';
import ChatWidget from '@/components/ChatWidget';
import { AnimatedDock } from '@/components/ui/animated-dock';
import { ProjectCarousel } from '@/components/ui/project-carousel';
import { ResearchShowcase } from '@/components/ui/research-showcase';
import { SkillsShowcase } from '@/components/ui/skills-showcase';
import { ExperienceShowcase } from '@/components/ui/experience-showcase';
import { AboutShowcase } from '@/components/ui/about-showcase';
import { ContactShowcase } from '@/components/ui/contact-showcase';
import { MobileNav } from '@/components/ui/mobile-nav';
import { MobileAboutShowcase } from '@/components/ui/mobile-about-showcase';
import { MobileExperienceShowcase } from '@/components/ui/mobile-experience-showcase';
import { MobileProjectCarousel } from '@/components/ui/mobile-project-carousel';
import { MobileResearchShowcase } from '@/components/ui/mobile-research-showcase';
import { MobileSkillsShowcase } from '@/components/ui/mobile-skills-showcase';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState('HOME');

  const navLinks = [
    { label: 'HOME', href: '#', onClick: () => setActiveTab('HOME') },
    { label: 'ABOUT', href: '#', onClick: () => setActiveTab('ABOUT') },
    { label: 'EXPERIENCE', href: '#', onClick: () => setActiveTab('EXPERIENCE') },
    { label: 'PROJECTS', href: '#', onClick: () => setActiveTab('PROJECTS') },
    { label: 'RESEARCH', href: '#', onClick: () => setActiveTab('RESEARCH') },
    { label: 'SKILLS', href: '#', onClick: () => setActiveTab('SKILLS') },
    { label: 'CONTACT', href: '#', onClick: () => setActiveTab('CONTACT') },
    { label: 'RESUME', href: '/resume.pdf', onClick: () => window.open('/resume.pdf', '_blank') },
    { label: 'BLOG', href: 'https://blog.keerthanabv.in', onClick: () => window.open('https://blog.keerthanabv.in', '_blank') }
  ];

  const tabs: Record<string, React.ReactNode> = {
    HOME: (
      <div className="flex h-[100dvh] w-full flex-col bg-white overflow-hidden items-center justify-center relative">
        {/* Desktop Header for Home */}
        <header className="absolute top-0 z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <style>{`
          .uiverse-btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 18px;
            background-image: linear-gradient(#facc15, #eab308);
            color: #1a202c;
            border: solid 2px #ca8a04;
            height: 60px;
            padding: 0px 24px;
            border-radius: 8px;
            font-weight: 800;
            transform: scale(0.85); /* Smaller on mobile to prevent overlap */
            position: relative;
            transition: all 0.2s ease;
            font-family: inherit;
          }
          
          @media (min-width: 768px) {
            .uiverse-btn {
              transform: scale(1.6); /* Much larger on desktop */
            }
          }

          .uiverse-btn:not(:hover) .u-hide,
          .uiverse-btn:not(:hover) .u-icon::before,
          .uiverse-btn:not(:hover) .u-icon::after {
            opacity: 0;
            visibility: hidden;
            transform: scale(1.4);
          }
          .u-hide {
            transition: all 0.4s ease;
          }
          .uiverse-btn:active {
            background-image: linear-gradient(#eab308, #facc15);
            border-color: #ca8a04;
          }
          .u-icon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .u-icon::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 6px;
            height: 6px;
            transform: translate(-50%, -50%);
            background-color: #000;
            border-radius: 100%;
          }
          .u-icon::after {
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            transform: translate(-19%, -60%);
            width: 100px;
            height: 33px;
            background-color: transparent;
            border-radius: 12px 22px 2px 2px;
            border-right: solid 2px #000;
            border-top: solid 2px transparent;
          }
          .u-icon .u-text-icon {
            color: #000;
            position: absolute;
            font-size: 13px;
            font-weight: 900;
            left: -70px;
            top: -42px;
            white-space: nowrap;
          }
          .u-icon svg {
            width: 24px;
            height: 24px;
            border: solid 2px transparent;
            display: flex;
          }
          .uiverse-btn:hover .u-icon svg {
            border: solid 2px rgba(0, 0, 0, 0.4);
            border-radius: 4px;
          }
          .u-padding-left {
            position: absolute;
            width: 20px;
            height: 2px;
            background-color: #000;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          .u-padding-left:before, .u-padding-left:after {
            content: "";
            width: 2px;
            height: 10px;
            background-color: #000;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
          .u-padding-left:before { left: 0; }
          .u-padding-left:after { right: 0; }
          .u-padding-left-line {
            position: absolute;
            width: 40px;
            height: 2px;
            background-color: #000;
            left: -34px;
            top: 15px;
            transform: rotate(-50deg);
          }
          .u-padding-left-line::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 6px;
            height: 6px;
            transform: translate(-50%, -50%);
            background-color: #000;
            border-radius: 100%;
          }
          .u-padding-left-text {
            color: #000;
            font-size: 13px;
            font-weight: 900;
            position: absolute;
            white-space: nowrap;
            transform: rotate(50deg);
            bottom: 30px;
            left: -75px;
          }
          .u-padding-right {
            position: absolute;
            width: 20px;
            height: 2px;
            background-color: #000;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          .u-padding-right:before, .u-padding-right:after {
            content: "";
            width: 2px;
            height: 10px;
            background-color: #000;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
          .u-padding-right:before { left: 0; }
          .u-padding-right:after { right: 0; }
          .u-padding-right-line {
            position: absolute;
            width: 40px;
            height: 2px;
            background-color: #000;
            right: -34px;
            top: 15px;
            transform: rotate(50deg);
          }
          .u-padding-right-line::before {
            content: "";
            position: absolute;
            left: 40px;
            top: 0;
            width: 6px;
            height: 6px;
            transform: translate(-50%, -50%);
            background-color: #000;
            border-radius: 100%;
          }
          .u-padding-right-text {
            color: #000;
            font-size: 13px;
            font-weight: 900;
            position: absolute;
            white-space: nowrap;
            transform: rotate(-50deg);
            bottom: 33px;
            left: 20px;
          }
          .u-background {
            position: absolute;
          }
          .u-background::before {
            content: "";
            position: absolute;
            right: 27px;
            bottom: -90px;
            width: 100px;
            height: 65px;
            background-color: transparent;
            border-radius: 0px 0px 22px 22px;
            border-right: solid 2px #000;
            border-bottom: solid 2px transparent;
          }
          .u-background::after {
            content: "";
            position: absolute;
            right: 25px;
            bottom: -25px;
            width: 6px;
            height: 6px;
            background-color: #000;
            border-radius: 100%;
          }
          .u-background-text {
            position: absolute;
            color: #000;
            font-size: 13px;
            font-weight: 900;
            bottom: -110px;
            left: -130px;
            white-space: nowrap;
          }
          .u-border {
            position: absolute;
            right: 0;
            top: 0;
          }
          .u-border:before {
            content: "";
            width: 15px;
            height: 15px;
            border: solid 2px #000;
            position: absolute;
            right: 0%;
            top: 0;
            transform: translate(50%, -50%);
            border-radius: 100%;
          }
          .u-border:after {
            content: "";
            width: 2px;
            height: 35px;
            background-color: #000;
            position: absolute;
            right: -15px;
            top: -25px;
            transform: translate(50%, -50%) rotate(60deg);
          }
          .u-border .u-border-text {
            position: absolute;
            color: #000;
            font-size: 13px;
            font-weight: 900;
            right: -45px;
            top: -45px;
            white-space: nowrap;
          }
        `}</style>
        {/* Core Headline & Subhead (Visible by Default) */}
        <div className="text-center mb-10 md:mb-16 max-w-2xl px-6 flex flex-col items-center select-none">
          <h1 className="text-2xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 flex flex-col md:flex-row items-center gap-1 md:gap-3 leading-none">
            <span>AI Agent Developer</span>
            <span className="hidden md:inline text-gray-300 font-light">|</span>
            <span className="text-gray-600 md:text-gray-900 font-bold">Full-Stack Engineer</span>
          </h1>
          <p className="text-xs md:text-base text-gray-500 max-w-lg leading-relaxed font-medium">
            I build LLM agents and RAG systems — from a Legal-BERT model scoring 84.9% F1 to production chatbots — plus the full-stack apps that ship them.
          </p>
        </div>

        <button className="uiverse-btn">
          <div className="u-icon">
            <span className="u-text-icon u-hide">Keerthana</span>
            <svg
              className="css-i6dzq1"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </div>
          <span className="title ml-1">It's me</span>
          <div className="u-padding-left u-hide">
            <div className="u-padding-left-line">
              <span className="u-padding-left-text">Full-Stack</span>
            </div>
          </div>
          <div className="u-padding-right u-hide">
            <div className="u-padding-right-line">
              <span className="u-padding-right-text">Agent Dev</span>
            </div>
          </div>
          <div className="u-background u-hide">
            <span className="u-background-text">Building LLM agents that ship</span>
          </div>
          <div className="u-border u-hide">
            <span className="u-border-text">MCA</span>
          </div>
        </button>
      </div>
    ),
    ABOUT: (
      <div className="flex h-[100dvh] w-full flex-col bg-white overflow-hidden">
        <header className="z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col w-full h-full overflow-hidden pb-24 md:pb-32">
          <div className="hidden md:flex flex-1 w-full h-full items-center justify-center overflow-hidden">
            <AboutShowcase />
          </div>
          <div className="flex md:hidden flex-1 w-full h-full overflow-hidden">
            <MobileAboutShowcase />
          </div>
        </div>
      </div>
    ),
    EXPERIENCE: (
      <div className="flex h-[100dvh] w-full flex-col bg-white overflow-hidden">
        <header className="z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col w-full h-full overflow-hidden pb-24 md:pb-32">
          <div className="hidden md:flex flex-1 w-full h-full items-center justify-center overflow-hidden">
            <ExperienceShowcase />
          </div>
          <div className="flex md:hidden flex-1 w-full h-full overflow-hidden">
            <MobileExperienceShowcase />
          </div>
        </div>
      </div>
    ),
    PROJECTS: (
      <div className="flex h-[100dvh] w-full flex-col bg-background overflow-hidden">
        <header className="z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col w-full h-full overflow-hidden pb-24 md:pb-32">
          <div className="hidden md:flex flex-1 w-full h-full items-center justify-center overflow-hidden">
            <ProjectCarousel />
          </div>
          <div className="flex md:hidden flex-1 w-full h-full overflow-hidden">
            <MobileProjectCarousel />
          </div>
        </div>
      </div>
    ),
    RESEARCH: (
      <div className="flex h-[100dvh] w-full flex-col bg-white overflow-hidden">
        <header className="z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col w-full h-full overflow-hidden pb-24 md:pb-32">
          <div className="hidden md:flex flex-1 w-full h-full items-center justify-center overflow-hidden">
            <ResearchShowcase />
          </div>
          <div className="flex md:hidden flex-1 w-full h-full overflow-hidden">
            <MobileResearchShowcase />
          </div>
        </div>
      </div>
    ),
    SKILLS: (
      <div className="flex h-[100dvh] w-full flex-col bg-white overflow-hidden">
        <header className="z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col w-full h-full overflow-hidden pb-24 md:pb-32">
          <div className="hidden md:flex flex-1 w-full h-full items-center justify-center overflow-hidden">
            <SkillsShowcase />
          </div>
          <div className="flex md:hidden flex-1 w-full h-full overflow-hidden">
            <MobileSkillsShowcase />
          </div>
        </div>
      </div>
    ),
    CONTACT: (
      <div className="flex h-[100dvh] w-full flex-col bg-white overflow-hidden">
        <header className="z-30 flex w-full max-w-7xl items-center justify-between p-8 md:p-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-wider"
          >
            Keerthana
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.filter(l => l.label !== 'CONTACT').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); if (link.onClick) link.onClick(); }}
                className={cn(
                  "text-sm tracking-widest transition-colors cursor-pointer pb-1",
                  activeTab === link.label ? "font-bold text-foreground border-b-2 border-foreground" : "font-medium text-foreground/60 hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center pb-24 md:pb-32">
          <ContactShowcase />
        </div>
      </div>
    ),
    BLOG: (
      <MinimalistHero
        activeTab={activeTab}
        logoText="Keerthana"
        navLinks={navLinks}
        mainText="Coming soon. Technical writing, AI experiments, and web development insights."
        imageSrc="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop"
        imageAlt="Notebook and coffee"
        overlayText={{ part1: 'Tech', part2: 'Blog.' }}
        socialLinks={[]}
        locationText=""
        accentColor="bg-emerald-400/90"
      />
    ),
  };

  return (
    <main className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-white origin-top md:scale-[1.02]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full"
        >
          {tabs[activeTab]}
        </motion.div>
      </AnimatePresence>
      <div className="hidden md:block">
        <AnimatedDock />
      </div>
      <MobileNav navLinks={navLinks} activeTab={activeTab} />
      <ChatWidget />
    </main>
  );
}
