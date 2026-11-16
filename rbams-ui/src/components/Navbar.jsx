import React, { useState, useEffect } from 'react';
import {
  Shield, Layers, LayoutDashboard, FileSpreadsheet,
  Calendar, FileText, CheckSquare, UploadCloud, Download,
  Radio, Sparkles, Clock, Globe, Bot
} from 'lucide-react';
import { COMPANY_INFO } from '../data/riskData';

export default function Navbar({
  activeTab,
  onTabChange,
  onOpenFileParser,
  onOpenExportCenter,
  onToggleAICopilot,
  isAIOpen
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('id-ID') + ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Master Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Risk Register (ERM)', icon: FileSpreadsheet },
    { id: 'aap', label: 'Annual Audit Plan (AAP)', icon: Calendar },
    { id: 'kka', label: 'Digital e-KKA (5C)', icon: FileText },
    { id: 'followup', label: 'Follow-Up Tracker (MAP)', icon: CheckSquare }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b16]/95 backdrop-blur-md border-b border-cyan-500/20 laser-border-cyan">
      {/* Top Utility Ribbon */}
      <div className="px-3 sm:px-4 py-1 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-tech text-slate-400">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-ping" />
            RBAMS-CORE v2.6
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Enterprise Risk Management & Internal Audit Platform
          </span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-emerald-400">
            Cloud Spanner Relational DB: Synced
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-300 flex items-center gap-1 truncate max-w-[170px] sm:max-w-none">
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{timeStr}</span>
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[9px] sm:text-[10px] whitespace-nowrap">
            Siklus 2026
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* Branding Area: Enlarged RBAMS ( Risk Based Audit Management System ) */}
        <div className="flex items-center justify-between lg:justify-start gap-2.5 sm:gap-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,243,255,0.45)] shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-wide font-tech uppercase leading-none">
                  RBAMS
                </h1>
                <span className="text-[11px] sm:text-sm font-semibold text-cyan-300 font-tech tracking-wide">
                  ( Risk Based Audit Management System )
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-tech font-bold">
                  PRO v2.6
                </span>
              </div>

              <div className="text-[10px] sm:text-xs text-slate-300 font-tech tracking-wider uppercase font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="text-slate-400 hidden xs:inline">Enterprise Audit Platform:</span>
                <span className="text-white font-bold">{COMPANY_INFO.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Smooth Touch Horizontal Scroll on Mobile, Full Width) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none sm:scrollbar-thin w-full lg:w-auto -mx-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold font-tech tracking-wide transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Action Shortcuts */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto justify-between sm:justify-end">
          {/* AI Copilot Top Launcher Button */}
          <button
            onClick={onToggleAICopilot}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-tech font-bold flex items-center justify-center gap-1.5 transition ${
              isAIOpen
                ? 'bg-fuchsia-500/30 border-fuchsia-400 text-fuchsia-200 shadow-[0_0_15px_rgba(240,0,255,0.4)]'
                : 'bg-gradient-to-r from-fuchsia-950 to-slate-900 border-fuchsia-500/40 text-fuchsia-300 hover:border-fuchsia-400 hover:text-white'
            }`}
            title="Buka / Tutup Panel AI Copilot"
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={onOpenFileParser}
            className="flex-1 sm:flex-initial px-2.5 sm:px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 text-[11px] sm:text-xs font-mono-tech flex items-center justify-center gap-1.5 transition"
            title="Smart File Upload (SheetJS)"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload</span>
          </button>

          <button
            onClick={onOpenExportCenter}
            className="flex-1 sm:flex-initial px-2.5 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-tech font-bold flex items-center justify-center gap-1.5 transition"
            title="Download PDF, Excel, & Cloud Sync"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export & Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
}
