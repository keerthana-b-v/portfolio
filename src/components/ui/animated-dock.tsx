"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaGithub, FaLinkedin, FaGraduationCap, FaMapMarkerAlt, FaEnvelope, FaPhone, FaFileAlt, FaBlog } from "react-icons/fa";
import Link from "next/link";

const dockItems = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/keerthana-b-v", colorClass: "text-[#181717]" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/keerthana-b-v/", colorClass: "text-[#0A66C2]" },
  { icon: FaGraduationCap, label: "Scholar", href: "https://scholar.google.com/citations?view_op=list_works&hl=id&user=-gac19IAAAAJ", colorClass: "text-[#4285F4]" },
  { icon: FaEnvelope, label: "Email", href: "mailto:keerthana.b.v.codes@gmail.com", colorClass: "text-[#EA4335]" },
  { icon: FaPhone, label: "Phone", href: "tel:+919901724479", colorClass: "text-[#34A853]" },
  { icon: FaFileAlt, label: "Resume", href: "/Keerthana_BV_.pdf", colorClass: "text-[#FBBC05]" },
  { icon: FaBlog, label: "Blog", href: "https://blog.keerthanabv.in", colorClass: "text-[#FF5722]" },
  { icon: FaMapMarkerAlt, label: "Bengaluru, India", href: "#", colorClass: "text-[#9e9e9e]" },
];

export const AnimatedDock = () => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 rounded-2xl bg-white/80 px-4 pb-3 pt-3 shadow-2xl backdrop-blur-md border border-gray-200"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {dockItems.map((item, i) => (
        <DockIcon key={i} mouseX={mouseX} {...item} />
      ))}
    </motion.div>
  );
};

function DockIcon({
  mouseX,
  icon: Icon,
  label,
  href,
  colorClass,
}: {
  mouseX: any;
  icon: any;
  label: string;
  href: string;
  colorClass: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val: number) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(distance, [-150, 0, 150], [50, 90, 50]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative group flex flex-col items-center justify-end">
      {/* Tooltip */}
      <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:scale-100 shadow-md whitespace-nowrap">
        {label}
      </span>
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <motion.div
          ref={ref}
          style={{ width, height: width }}
          className={`flex items-center justify-center rounded-full bg-gray-100 shadow-sm border border-gray-200 hover:bg-white transition-colors ${colorClass}`}
        >
          <Icon className="w-1/2 h-1/2" />
        </motion.div>
      </Link>
    </div>
  );
}
