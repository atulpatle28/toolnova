"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export interface ToolItem {
  id?: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category?: string;
  gradient?: string;
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface ToolCardProps {
  tool: ToolItem;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative h-full flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 shadow-md hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-200 backdrop-blur-xs"
    >
      <div className="space-y-4">
        {/* Header: Icon & Badges */}
        <div className="flex items-center justify-between">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              tool.gradient
                ? tool.gradient
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 shadow-xs"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isNew && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                New
              </span>
            )}
            {tool.isPopular && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Popular
              </span>
            )}
            {tool.badge && !tool.isNew && !tool.isPopular && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            <span>{tool.name}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-400" />
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="capitalize flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {tool.category || "Client-Side"}
        </span>
        <span className="text-[11px] font-bold tracking-tight text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Launch Tool →
        </span>
      </div>

      {/* Full-Card Accessible Link Overlay */}
      <Link
        href={tool.href}
        className="absolute inset-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        aria-label={`Launch ${tool.name}`}
      >
        <span className="sr-only">Launch {tool.name}</span>
      </Link>
    </motion.div>
  );
}

export default ToolCard;