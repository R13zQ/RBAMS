import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Megaphone, Truck, Navigation,
  Warehouse, ShoppingBag, Cpu, Users, ShieldAlert,
  CheckCircle2, AlertTriangle, ArrowRight, Activity,
  PieChart, BarChart3, Target, ShieldCheck, Flame, Info
} from 'lucide-react';
import { DEPARTMENT_META } from '../data/riskData';
import { formatRp, getRiskLevelColor, getControlEffectivenessColor } from '../utils/helpers';

// Map icon string names to actual Lucide components
const ICON_MAP = {
  DollarSign,
  TrendingUp,
  Megaphone,
  Truck,
  Navigation,
  Warehouse,
  ShoppingBag,
  Cpu,
  Users,
  ShieldAlert,
  CheckCircle2
};

export default function DepartmentInfographics({
  departmentStats,
  selectedDept,
  onSelectDept,
  onFilterRiskRegister
}) {
  const [displayMode, setDisplayMode] = useState('spotlight'); // 'spotlight' or 'grid' or 'comparison'
  const depts = Object.keys(departmentStats || {});
  const currentDept = selectedDept || depts[0] || 'Finance';
  const currentStats = departmentStats[currentDept] || {
    inherentTotal: 0,
    residualTotal: 0,
    reductionTotal: 0,
    reductionPct: '0',
    count: 0,
    levels: { Extreme: 0, High: 0, Medium: 0, Low: 0 },
    effectiveness: { 'Efektif': 0, 'Kurang Efektif': 0, 'Tidak Efektif': 0 },
    items: [],
    priorityScore: 0
  };

  const meta = DEPARTMENT_META[currentDept] || {
    code: currentDept.substring(0, 3).toUpperCase(),
    head: 'Department Lead',
    color: '#00f3ff',
    icon: 'Activity',
    objective: 'Operasional dan mitigasi risiko bisnis FMCG.',
    kri_metric: 'KRI Normal dalam ambang batas toleransi'
  };

  const IconComponent = ICON_MAP[meta.icon] || Activity;

  // Top 3 risks by inherent value for current department
  const topRisks = [...(currentStats.items || [])]
    .sort((a, b) => (b.inherent_value || 0) - (a.inherent_value || 0))
    .slice(0, 3);

  return (
    <div className="w-full space-y-4">
      {/* Header Infographic Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white font-tech tracking-wide uppercase">
              Infografis Profil Risiko Per Departemen
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-tech">
              10 Divisi FMCG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Eksplorasi mendalam metrik Inherent vs Residual Risk, KRI, dan efektivitas pengendalian per unit kerja.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono-tech self-start sm:self-auto">
          <button
            onClick={() => setDisplayMode('spotlight')}
            className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
              displayMode === 'spotlight'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Spotlight Detail
          </button>
          <button
            onClick={() => setDisplayMode('grid')}
            className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
              displayMode === 'grid'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Grid 10 Divisi
          </button>
          <button
            onClick={() => setDisplayMode('comparison')}
            className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
              displayMode === 'comparison'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Komparasi Matriks
          </button>
        </div>
      </div>

      {/* Horizontal Department Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {depts.map((d) => {
          const s = departmentStats[d];
          const m = DEPARTMENT_META[d] || {};
          const IconComp = ICON_MAP[m.icon] || Activity;
          const isSelected = d === currentDept;
          const hasExtreme = s.levels.Extreme > 0;

          return (
            <button
              key={d}
              onClick={() => onSelectDept(d)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `${m.color || '#00f3ff'}20`,
                  color: m.color || '#00f3ff',
                  border: `1px solid ${m.color || '#00f3ff'}40`
                }}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-semibold leading-tight font-tech text-[13px]">{d}</div>
                <div className="text-[10px] text-slate-500 font-mono-tech flex items-center gap-1">
                  <span>{s.count} Risks</span>
                  {hasExtreme && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Memiliki Risiko Extreme" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODE 1: SPOTLIGHT DETAILED INFOGRAPHIC */}
      {displayMode === 'spotlight' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-300">
          {/* Main Hero Card for Selected Department (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 laser-border-cyan relative overflow-hidden">
              {/* Background Glow accent */}
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ backgroundColor: meta.color || '#00f3ff' }}
              />

              {/* Department Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border"
                    style={{
                      backgroundColor: `${meta.color || '#00f3ff'}15`,
                      color: meta.color || '#00f3ff',
                      borderColor: `${meta.color || '#00f3ff'}40`
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white font-tech tracking-wide">
                        Departemen {currentDept}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono-tech text-cyan-400 font-semibold">
                        {meta.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Kepala Divisi: <span className="text-slate-200 font-medium">{meta.head}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-mono-tech">
                      Audit Priority Index
                    </span>
                    <span className="text-lg font-bold font-tech text-cyan-400">
                      Score: {currentStats.priorityScore}
                    </span>
                  </div>
                  <button
                    onClick={() => onFilterRiskRegister && onFilterRiskRegister(currentDept)}
                    className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/40 rounded-lg text-xs font-semibold text-cyan-300 transition flex items-center gap-1.5"
                  >
                    Lihat 125 Register &rarr;
                  </button>
                </div>
              </div>

              {/* Department Scope / Focus */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-cyan-300 font-medium">Mandat & Fokus Audit: </span>
                  {meta.objective}
                </div>
              </div>

              {/* Infographic Visual: Inherent Exposure vs Residual Exposure Waterfall */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Inherent Box */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-rose-400 font-mono-tech mb-1">
                    <span>INHERENT RISK</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-tech text-white">
                    {formatRp(currentStats.inherentTotal)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono-tech">
                    <span>Baseline Potensi Kerugian</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-tech">
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      {currentStats.levels.Extreme} Extreme
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {currentStats.levels.High} High
                    </span>
                  </div>
                </div>

                {/* Mitigated Reduction Box */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-mono-tech mb-1">
                    <span>REDUKSI MITIGASI</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-tech text-cyan-300">
                    {formatRp(currentStats.reductionTotal)}
                  </div>
                  <div className="text-[11px] text-cyan-400/80 mt-1 flex items-center gap-1 font-mono-tech font-semibold">
                    <span>Reduksi Nilai: {currentStats.reductionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(Number(currentStats.reductionPct) || 0, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Residual Target Box */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-mono-tech mb-1">
                    <span>RESIDUAL RISK TARGET</span>
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-tech text-emerald-300">
                    {formatRp(currentStats.residualTotal)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono-tech">
                    <span>Sisa Eksposur Terkendali</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-tech">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {currentStats.residualLevels.Low} Low
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800">
                      {currentStats.residualLevels.Medium} Medium
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown: Risk Levels & Control Effectiveness */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                {/* Level Distribution Bar */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between font-tech">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-400" />
                      Komposisi Tingkat Risiko Inherent
                    </span>
                    <span className="text-[11px] font-mono-tech text-slate-400">Total {currentStats.count} Item</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono-tech">
                    {['Extreme', 'High', 'Medium', 'Low'].map((lvl) => {
                      const count = currentStats.levels[lvl] || 0;
                      const pct = currentStats.count > 0 ? ((count / currentStats.count) * 100).toFixed(0) : 0;
                      const c = getRiskLevelColor(lvl);

                      return (
                        <div key={lvl} className="flex items-center justify-between gap-2">
                          <span className="w-16 text-[11px] text-slate-400">{lvl}</span>
                          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: c.hex }}
                            />
                          </div>
                          <span className="w-12 text-right font-semibold text-[11px]" style={{ color: c.hex }}>
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Control Effectiveness Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between font-tech">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Evaluasi Efektivitas Mitigasi Berjalan
                    </span>
                    <span className="text-[11px] font-mono-tech text-cyan-400">Existing Control</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono-tech">
                    {['Efektif', 'Kurang Efektif', 'Tidak Efektif'].map((eff) => {
                      const count = currentStats.effectiveness[eff] || 0;
                      const pct = currentStats.count > 0 ? ((count / currentStats.count) * 100).toFixed(0) : 0;
                      const c = getControlEffectivenessColor(eff);

                      return (
                        <div key={eff} className="flex items-center justify-between gap-2">
                          <span className="w-24 text-[11px] text-slate-400 truncate">{eff}</span>
                          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                eff === 'Efektif'
                                  ? 'bg-emerald-400'
                                  : eff === 'Kurang Efektif'
                                  ? 'bg-amber-400'
                                  : 'bg-red-400'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`w-12 text-right font-semibold text-[11px] ${c.text}`}>
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Critical Risk Events in Selected Department */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white font-tech uppercase tracking-wider">
                    Top Peristiwa Risiko Kritis (Prioritas Audit)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono-tech">
                  Urutan Nilai Inherent Tertinggi
                </span>
              </div>

              <div className="space-y-2.5">
                {topRisks.map((r, idx) => {
                  const levelC = getRiskLevelColor(r.inherent_level);
                  const effC = getControlEffectivenessColor(r.control_effectiveness);

                  return (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 font-mono-tech text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-white">{r.risk_event}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono-tech font-semibold ${levelC.bg} ${levelC.text} border ${levelC.border}`}
                            >
                              {r.inherent_level} (P:{r.inherent_prob} x D:{r.inherent_impact})
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono-tech ${effC.bg} ${effC.text} border ${effC.border}`}
                            >
                              {r.control_effectiveness}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            <span className="text-slate-500">Akar Masalah: </span>
                            {r.root_cause}
                          </div>
                          <div className="text-[11px] text-cyan-300/80 mt-0.5">
                            <span className="text-slate-500">Mitigasi: </span>
                            {r.mitigation_plan}
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-xs font-bold text-amber-300 font-mono-tech">
                          {formatRp(r.inherent_value)}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono-tech">
                          Target Residual: {formatRp(r.residual_value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: KRI Metric & Strategic Radar Widget (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Key Risk Indicator (KRI) Live Card */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 laser-border-magenta">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-fuchsia-400 font-tech uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Key Risk Indicator (KRI 2026)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1 font-mono-tech">Indikator Terpantau:</div>
                <div className="text-sm font-semibold text-white leading-snug">
                  {meta.kri_metric}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono-tech pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Frekuensi: Real-time</span>
                  <span className="text-cyan-400">Ambang: Terkalibrasi AI</span>
                </div>
              </div>

              {/* Audit Recommendation Callout */}
              <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="text-xs font-semibold text-cyan-300 font-tech flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Rekomendasi Rencana Audit AI
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Berdasarkan profil risiko {currentDept} dengan rasio efektivitas kontrol{' '}
                  <span className="text-amber-300 font-semibold font-mono-tech">
                    {currentStats.effectiveness['Kurang Efektif'] + currentStats.effectiveness['Tidak Efektif']} catatan
                  </span>
                  , direkomendasikan audit kepatuhan substantif dengan fokus pada verifikasi otorisasi bertingkat.
                </p>
              </div>
            </div>

            {/* Quick Department Ranking Comparison */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white font-tech uppercase tracking-wider">
                  Ranking Eksposur 10 Divisi
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono-tech">Total Inherent Rp</span>
              </div>

              <div className="space-y-2">
                {[...depts]
                  .sort((a, b) => (departmentStats[b].inherentTotal || 0) - (departmentStats[a].inherentTotal || 0))
                  .map((d, index) => {
                    const s = departmentStats[d];
                    const isCur = d === currentDept;
                    return (
                      <button
                        key={d}
                        onClick={() => onSelectDept(d)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition ${
                          isCur
                            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                            : 'bg-slate-900/50 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 text-[10px] text-slate-500 font-mono-tech">#{index + 1}</span>
                          <span className="font-medium">{d}</span>
                        </div>
                        <span className="font-mono-tech font-semibold text-slate-300">
                          {formatRp(s.inherentTotal)}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: GRID VIEW ACROSS ALL 10 DEPARTMENTS */}
      {displayMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 animate-in fade-in duration-300">
          {depts.map((d) => {
            const s = departmentStats[d];
            const m = DEPARTMENT_META[d] || {};
            const IconC = ICON_MAP[m.icon] || Activity;
            const isCur = d === currentDept;

            return (
              <div
                key={d}
                onClick={() => {
                  onSelectDept(d);
                  setDisplayMode('spotlight');
                }}
                className={`glass-panel p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] border ${
                  isCur
                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                    : 'border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: `${m.color || '#00f3ff'}20`,
                        color: m.color || '#00f3ff'
                      }}
                    >
                      <IconC className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-tech leading-tight">{d}</h4>
                      <span className="text-[10px] text-slate-500 font-mono-tech">{m.code}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono-tech">
                    {s.count} Risks
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] mt-3 pt-2 border-t border-slate-800 font-mono-tech">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Inherent:</span>
                    <span className="text-amber-400 font-semibold">{formatRp(s.inherentTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Residual:</span>
                    <span className="text-emerald-400 font-semibold">{formatRp(s.residualTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Reduksi:</span>
                    <span className="text-cyan-400">{s.reductionPct}%</span>
                  </div>
                </div>

                {/* Level badges */}
                <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-800/60 text-[9px] font-mono-tech">
                  <span className="px-1 py-0.5 rounded bg-red-950 text-red-300">E:{s.levels.Extreme}</span>
                  <span className="px-1 py-0.5 rounded bg-amber-950 text-amber-300">H:{s.levels.High}</span>
                  <span className="px-1 py-0.5 rounded bg-yellow-950 text-yellow-300">M:{s.levels.Medium}</span>
                  <span className="px-1 py-0.5 rounded bg-emerald-950 text-emerald-300">L:{s.levels.Low}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 3: COMPARISON MATRIX TABLE */}
      {displayMode === 'comparison' && (
        <div className="glass-panel p-4 rounded-xl border border-slate-800 overflow-x-auto animate-in fade-in duration-300">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Departemen</th>
                <th className="py-2.5 px-3">Kepala Divisi</th>
                <th className="py-2.5 px-3">Total Risiko</th>
                <th className="py-2.5 px-3 text-red-400">Extreme</th>
                <th className="py-2.5 px-3 text-amber-400">High</th>
                <th className="py-2.5 px-3">Inherent Exposure</th>
                <th className="py-2.5 px-3">Residual Exposure</th>
                <th className="py-2.5 px-3 text-emerald-400">Reduksi %</th>
                <th className="py-2.5 px-3">Audit Score</th>
                <th className="py-2.5 px-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {depts.map((d) => {
                const s = departmentStats[d];
                const m = DEPARTMENT_META[d] || {};
                return (
                  <tr key={d} className="hover:bg-slate-900/60 transition">
                    <td className="py-2.5 px-3 font-semibold text-white font-tech text-sm">{d}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{m.head}</td>
                    <td className="py-2.5 px-3">{s.count}</td>
                    <td className="py-2.5 px-3 text-red-400 font-bold">{s.levels.Extreme}</td>
                    <td className="py-2.5 px-3 text-amber-400">{s.levels.High}</td>
                    <td className="py-2.5 px-3 text-amber-300 font-semibold">{formatRp(s.inherentTotal)}</td>
                    <td className="py-2.5 px-3 text-cyan-300">{formatRp(s.residualTotal)}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{s.reductionPct}%</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{s.priorityScore}</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => {
                          onSelectDept(d);
                          setDisplayMode('spotlight');
                        }}
                        className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[10px] transition"
                      >
                        Detail &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
