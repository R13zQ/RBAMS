import React, { useState } from 'react';
import { RISK_PROFILES } from '../data/riskData';
import { AlertCircle, ShieldAlert, CheckCircle2, TrendingUp, ChevronRight, Activity, Zap } from 'lucide-react';

export default function StrategicRiskProfiles() {
  const [activeProfileIdx, setActiveProfileIdx] = useState(0);
  const profile = RISK_PROFILES[activeProfileIdx] || RISK_PROFILES[0];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-fuchsia-500/20 laser-border-magenta space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-tech tracking-wide uppercase">
              Top 5 Profil Risiko Strategis FMCG (KRI 2026)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 font-mono-tech">
              Direksi & Komite Audit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis mendalam 5 skenario risiko terbesar PT. Agung Putra Nirantara dengan threshold KRI dan sasaran RKAP.
          </p>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {RISK_PROFILES.map((p, idx) => {
            const isCur = idx === activeProfileIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveProfileIdx(idx)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-tech font-bold transition whitespace-nowrap border ${
                  isCur
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-[0_0_10px_rgba(240,0,255,0.25)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                #{idx + 1} {p.title.split(' ')[1] || `Risiko ${idx+1}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Description & Root Cause (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-fuchsia-400 font-tech uppercase tracking-wide">
                {profile.taxonomy}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-950/70 border border-fuchsia-800 text-fuchsia-300 font-mono-tech">
                Prioritas RKAP 2026
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 leading-snug">
              {profile.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {profile.description}
            </p>
          </div>

          {/* Root Causes Box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs font-bold text-slate-200 font-tech uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Identifikasi Akar Masalah (Root Cause)
            </div>
            <pre className="text-xs text-slate-300 font-mono-tech whitespace-pre-wrap leading-relaxed">
              {profile.causes}
            </pre>
          </div>

          {/* Existing Controls (2025) */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold font-tech">Mitigasi Berjalan (Baseline 2025): </span>
            {profile.existing_mitigations && profile.existing_mitigations.join(' • ')}
          </div>
        </div>

        {/* Right Column: Key Risk Indicators (KRIs) Thresholds (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-300 font-tech uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Indikator KRI & Batas Toleransi
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech">Tahun 2026</span>
            </div>

            <div className="space-y-2.5">
              {profile.kris.map((k, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>{k.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-tech">
                    <div className="bg-emerald-950/40 border border-emerald-800/60 p-1.5 rounded">
                      <span className="text-emerald-400 block text-[9px] uppercase">Zona Aman</span>
                      <span className="text-emerald-300 font-semibold">{k.safe}</span>
                    </div>
                    <div className="bg-amber-950/40 border border-amber-800/60 p-1.5 rounded">
                      <span className="text-amber-400 block text-[9px] uppercase">Batas Waspada</span>
                      <span className="text-amber-300 font-semibold">{k.caution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
