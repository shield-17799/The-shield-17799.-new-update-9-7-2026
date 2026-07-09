import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  FolderOpen,
  Users,
  GraduationCap,
  Activity,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  Lock,
  Compass,
  Briefcase,
  Cpu
} from "lucide-react";

// Components
import CaseManager from "./components/CaseManager";
import SuspectProfiler from "./components/SuspectProfiler";
import KnowledgeBase from "./components/KnowledgeBase";
import AmdHackathonHub from "./components/AmdHackathonHub";

export default function App() {
  const [activeTab, setActiveTab] = useState<"cases" | "suspects" | "knowledge" | "amd_defense">("cases");

  return (
    <div className="min-h-screen bg-[#050505] text-[#f1f5f9] flex flex-col font-sans" id="app-workspace">
      {/* Black & Gold Premium Header */}
      <header className="border-b border-amber-500/10 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3.5 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Majestic Golden Logo based on the user's high-end image */}
            <div className="relative shrink-0 select-none">
              <svg className="w-14 h-14 filter drop-shadow-[0_0_8px_rgba(197,168,80,0.25)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="gold-glow-header" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="gold-grad-header" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c5a850" />
                    <stop offset="30%" stopColor="#f5d061" />
                    <stop offset="70%" stopColor="#e6c65e" />
                    <stop offset="100%" stopColor="#9a7c2c" />
                  </linearGradient>
                </defs>

                {/* Ornate Laurel Leaves/Flame decoration on the sides */}
                <path d="M 23 55 C 18 45, 20 30, 30 24 C 32 26, 31 34, 28 42 C 24 53, 29 66, 40 74 C 31 71, 24 64, 23 55 Z" fill="url(#gold-grad-header)" opacity="0.7"/>
                <path d="M 77 55 C 82 45, 80 30, 70 24 C 68 26, 69 34, 72 42 C 76 53, 71 66, 60 74 C 69 71, 76 64, 77 55 Z" fill="url(#gold-grad-header)" opacity="0.7"/>

                {/* Majestic Golden Shield Base */}
                <path d="M 50 15 C 64 15, 80 20, 82 32 C 84 55, 72 78, 50 88 C 28 78, 16 55, 18 32 C 20 20, 36 15, 50 15 Z" fill="#060606" stroke="url(#gold-grad-header)" strokeWidth="3" filter="url(#gold-glow-header)" />
                <path d="M 50 19 C 61 19, 74 23, 76 33 C 78 51, 67 72, 50 81 C 33 72, 22 51, 24 33 C 26 23, 39 19, 50 19 Z" fill="none" stroke="url(#gold-grad-header)" strokeWidth="0.8" opacity="0.6" />

                {/* Royal Stylized 'M' inside the shield */}
                <path d="M 34 60 C 34 42, 37 34, 42 34 C 45 34, 47 42, 49 50 C 51 42, 53 34, 56 34 C 61 34, 64 42, 64 60 C 64 63, 65 65, 68 65 C 66 65, 61 65, 61 60 C 61 46, 59 39, 56 39 C 53 39, 51 45, 49 56 C 47 45, 45 39, 42 39 C 39 39, 37 46, 37 60 C 37 65, 32 65, 29 65 C 32 65, 34 63, 34 60 Z" fill="url(#gold-grad-header)" />
              </svg>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-white flex items-baseline">
                  <span className="text-[#e6c65e] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">THE SHIELD</span>
                  <span className="text-slate-400 font-mono text-sm ml-2 font-medium tracking-normal">17799</span>
                </h1>
                <span className="text-[9px] font-mono bg-amber-500/10 text-[#e6c65e] px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wide">
                  Pre-Attack Intelligence
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans">
                Prevent Before Harm • Elite Child Safeguarding & Behavioral Threat Radar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {/* Status indicators in margins */}
            <div className="flex items-center gap-2 bg-[#0d0d0d] px-3 py-1.5 rounded-lg border border-amber-500/10 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-[#94a3b8] font-medium">Cognitive Neural Core:</span>
              <span className="text-[#e6c65e] font-mono font-bold">READY</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 md:px-8 flex flex-col gap-6" id="workspace-main">
        
        {/* The Shield-17799 Philosophy & Origin Story Section */}
        <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-2xl p-6 relative overflow-hidden shadow-xl" id="platform-intro">
          {/* Subtle gold design flourish */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a850]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c5a850]">
                <ShieldCheck className="w-4.5 h-4.5 text-[#e6c65e]" />
                Prevent Before Harm — Behavioral Investigative Methodology
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                Most AI systems analyze language. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a850] to-[#f59e0b]">The Shield-17799 analyzes criminal behavior.</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Designed using the investigative methodology of a founder with <strong className="text-[#e6c65e]">9 years of criminal investigation experience</strong>, and enhanced with AI to provide semantic reasoning and structured risk assessments. 
                Instead of sending raw chats directly to an LLM, the platform screens for behavioral indicators—such as secrecy requests, manipulation, coercion, gift offers, and isolation attempts—producing transparent, explainable forensic evaluations.
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1.5 text-[11px] text-slate-400 border-t border-amber-500/5 mt-2.5">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#c5a850]" />
                  9-Year Police Veteran Design
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#c5a850]" />
                  Secure Server-Side Anonymization
                </span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#c5a850]" />
                  Explainable Risk Mitigation Protocol
                </span>
              </div>
            </div>

            <div className="lg:w-80 shrink-0 bg-[#000000] p-4 rounded-xl border border-amber-500/10 text-xs text-slate-300 leading-relaxed space-y-2.5 shadow-inner">
              <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px] tracking-wider text-[#c5a850]">
                <AlertCircle className="w-4 h-4 text-[#e6c65e]" />
                The Prevention Mandate
              </div>
              <p className="text-[11px] text-slate-400">
                "Why do we always arrive after the crime? investigations often begin only after irreversible harm occurs. This platform identifies early behavioral warning signs to enable protective intervention beforehand."
              </p>
              <div className="text-[10px] font-mono text-[#e6c65e] text-right font-medium">— Dedicated Prototype Vision</div>
            </div>
          </div>
        </div>

        {/* Black & Gold Tab Navigation Menu */}
        <div className="flex border-b border-amber-500/15 gap-1.5" id="workspace-tabs-bar">
          <button
            id="tab-cases"
            onClick={() => setActiveTab("cases")}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === "cases"
                ? "text-[#e6c65e] bg-[#0c0c0c] border-t border-x border-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Active Case Scans
            {activeTab === "cases" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a850]"
              />
            )}
          </button>

          <button
            id="tab-suspects"
            onClick={() => setActiveTab("suspects")}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === "suspects"
                ? "text-[#e6c65e] bg-[#0c0c0c] border-t border-x border-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Suspect Directory
            {activeTab === "suspects" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a850]"
              />
            )}
          </button>

          <button
            id="tab-knowledge"
            onClick={() => setActiveTab("knowledge")}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === "knowledge"
                ? "text-[#e6c65e] bg-[#0c0c0c] border-t border-x border-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Grooming Matrix Guide
            {activeTab === "knowledge" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a850]"
              />
            )}
          </button>

          <button
            id="tab-amd-defense"
            onClick={() => setActiveTab("amd_defense")}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === "amd_defense"
                ? "text-[#e6c65e] bg-[#0c0c0c] border-t border-x border-amber-500/20 border-b-0"
                : "text-slate-400 hover:text-[#e6c65e]/80"
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-500/80 animate-pulse" />
            AMD Hackathon Hub
            {activeTab === "amd_defense" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a850]"
              />
            )}
          </button>
        </div>

        {/* Workspace Tab Content View */}
        <div className="flex-1" id="workspace-content-pane">
          {activeTab === "cases" && <CaseManager />}
          {activeTab === "suspects" && <SuspectProfiler />}
          {activeTab === "knowledge" && <KnowledgeBase />}
          {activeTab === "amd_defense" && <AmdHackathonHub />}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-amber-500/5 bg-[#030303] py-5 px-4 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        <div>
          The Shield-17799 © 2026 childprotection.net. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#94a3b8]">
            <Shield className="w-3.5 h-3.5 text-[#c5a850]" /> Pre-Attack Child Safeguarding Suite
          </span>
          <span className="text-slate-800">|</span>
          <span className="flex items-center gap-1.5 text-[#94a3b8]">
            <Activity className="w-3.5 h-3.5 text-[#c5a850]" /> Active Prevention Sweeping
          </span>
        </div>
      </footer>
    </div>
  );
}
