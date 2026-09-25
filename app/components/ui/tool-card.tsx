"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { ToolItem } from "@/lib/tools-registry";

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
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            {tool.isNew && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">New</span>
            )}
            {tool.isPopular && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Popular</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            <span>{tool.name}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-emerald-400" />
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Client-Side</span>
        <span className="text-[11px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Launch Tool →</span>
      </div>

      <Link href={tool.href} className="absolute inset-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label={`Launch ${tool.name}`}>
        <span className="sr-only">Launch {tool.name}</span>
      </Link>
    </motion.div>
  );
}

export default ToolCard;