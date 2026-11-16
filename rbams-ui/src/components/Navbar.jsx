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
      <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            RBAMS-CORE v2.6 Active
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

        <div className="flex items-center gap-3">
          <span className="text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            {timeStr}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px]">
            Siklus: 2026
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Branding Area: Enlarged RBAMS ( Risk Based Audit Management System ) */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,243,255,0.45)] shrink-0">
            <Shield className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide font-tech uppercase leading-none">
                RBAMS
              </h1>
              <span className="text-xs sm:text-sm font-semibold text-cyan-300 font-tech tracking-wide">
                ( Risk Based Audit Management System )
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-tech font-bold">
                PRO v2.6
              </span>
            </div>

            <div className="text-xs text-slate-300 font-tech tracking-wider uppercase font-semibold mt-1 flex items-center gap-2">
              <span className="text-slate-400">Enterprise Audit Platform:</span>
              <span className="text-white font-bold">{COMPANY_INFO.name}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold font-tech tracking-wide transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Global Action Shortcuts */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {/* AI Copilot Top Launcher Button */}
          <button
            onClick={onToggleAICopilot}
            className={`px-3 py-1.5 rounded-xl border text-xs font-tech font-bold flex items-center gap-1.5 transition ${
              isAIOpen
                ? 'bg-fuchsia-500/30 border-fuchsia-400 text-fuchsia-200 shadow-[0_0_15px_rgba(240,0,255,0.4)]'
                : 'bg-gradient-to-r from-fuchsia-950 to-slate-900 border-fuchsia-500/40 text-fuchsia-300 hover:border-fuchsia-400 hover:text-white'
            }`}
            title="Buka / Tutup Panel AI Copilot di Bagian Atas Layar"
          >
            <Bot className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={onOpenFileParser}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 text-xs font-mono-tech flex items-center gap-1.5 transition"
            title="Smart File Upload (SheetJS)"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Upload Excel</span>
          </button>

          <button
            onClick={onOpenExportCenter}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-tech font-bold flex items-center gap-1.5 transition"
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
