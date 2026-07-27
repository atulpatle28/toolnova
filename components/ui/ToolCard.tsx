"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ToolItem } from "@/lib/tools-registry";
import { ArrowUpRight, Sparkles } from "lucide-react";

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
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative h-full flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200"
    >
      <div className="space-y-4">
        {/* Header Badges & Icon */}
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl border ${tool.gradient}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isNew && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                New
              </span>
            )}
            {tool.isPopular && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Popular
              </span>
            )}
            {tool.badge && !tool.isNew && !tool.isPopular && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
            <span>{tool.name}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-600 dark:text-blue-400" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
        <span className="capitalize">{tool.category} Utility</span>
        <span className="text-[11px] font-semibold tracking-tight text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Launch Tool →
        </span>
      </div>

      <Link href={tool.href} className="absolute inset-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950" aria-label={`Open ${tool.name}`}>
        <span className="sr-only">Open {tool.name}</span>
      </Link>
    </motion.div>
  );
}