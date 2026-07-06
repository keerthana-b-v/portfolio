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

        {/* Core Headline & Subhead (Visible by Default) */}
        <div className="text-center max-w-2xl px-6 flex flex-col items-center select-none">
          <h1 className="text-3xl md:text-6xl font-black tracking-tight text-gray-900 mb-6 flex flex-col md:flex-row items-center gap-1 md:gap-3 leading-none">
            <span>AI Agent Developer</span>
            <span className="hidden md:inline text-gray-300 font-light">|</span>
            <span className="text-gray-600 md:text-gray-900 font-bold">Full-Stack Engineer</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-500 max-w-xl leading-relaxed font-medium mb-10">
            I build LLM agents and RAG systems — from a Legal-BERT model scoring 84.9% F1 to production chatbots — plus the full-stack apps that ship them.
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('PROJECTS')}
          className="px-8 py-4 bg-black text-white text-sm font-bold tracking-widest uppercase rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)] transition-all cursor-pointer border border-transparent hover:bg-gray-900"
        >
          View My Work →
        </motion.button>
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
