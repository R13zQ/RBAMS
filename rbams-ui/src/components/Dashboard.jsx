import React from 'react';
import {
  ShieldAlert, TrendingDown, Target, Activity, FileSpreadsheet,
  CheckCircle2, Flame, ArrowUpRight, ArrowDownRight, Layers,
  Compass, PieChart, BarChart3, AlertTriangle, ShieldCheck
} from 'lucide-react';
import RiskFlowNetwork from './RiskFlowNetwork';
import DepartmentInfographics from './DepartmentInfographics';
import RiskMatrix5x5 from './RiskMatrix5x5';
import StrategicRiskProfiles from './StrategicRiskProfiles';
import { COMPANY_INFO } from '../data/riskData';
import { formatRp } from '../utils/helpers';

export default function Dashboard({
  risks,
  departmentStats,
  selectedDept,
  onSelectDept,
  onNavigateTab,
  onFilterRiskRegister
}) {
  // Aggregate Top-Level KPIs
  const totalInherentVal = risks.reduce((acc, r) => acc + (Number(r.inherent_value) || 0), 0);
  const totalResidualVal = risks.reduce((acc, r) => acc + (Number(r.residual_value) || 0), 0);
  const totalReductionVal = risks.reduce((acc, r) => acc + (Number(r.reduction_value) || 0), 0);
  const reductionPct = totalInherentVal > 0 ? ((totalReductionVal / totalInherentVal) * 100).toFixed(1) : 0;

  const countExtreme = risks.filter((r) => r.inherent_level === 'Extreme').length;
  const countHigh = risks.filter((r) => r.inherent_level === 'High').length;
  const countMedium = risks.filter((r) => r.inherent_level === 'Medium').length;
  const countLow = risks.filter((r) => r.inherent_level === 'Low').length;

  const countEff = risks.filter((r) => r.control_effectiveness === 'Efektif').length;
  const countKurangEff = risks.filter((r) => r.control_effectiveness === 'Kurang Efektif').length;
  const countTidakEff = risks.filter((r) => r.control_effectiveness === 'Tidak Efektif').length;

  return (
    <div className="space-y-6">
      {/* Executive Corporate Identity Banner with Compact Precision Logo */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/30 laser-border-cyan flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Precision Logo Badge (Perkecil & Presisi Sesuai Permintaan User) */}
          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,243,255,0.2)] backdrop-blur-md flex items-center justify-center shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}logo-apn-clean.png`}
              alt="Logo PT. Agung Putra Nirantara"
              className="h-6 sm:h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]"
            />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-mono-tech text-cyan-300 tracking-wider uppercase flex items-center gap-1.5">
              <span>Enterprise Risk-Based Internal Audit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Siklus Tahunan 2026</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white font-tech tracking-wide uppercase mt-0.5">
              {COMPANY_INFO.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Fast Moving Consumer Goods (FMCG) Manufacturing & Distribution Command Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 text-xs font-mono-tech justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Chief Audit Executive</span>
            <span className="font-semibold text-slate-200">{COMPANY_INFO.chiefAuditExecutive}</span>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Internal Audit Manager</span>
            <span className="font-semibold text-cyan-300">{COMPANY_INFO.auditCommitteeChair}</span>
          </div>
        </div>
      </div>

      {/* Top Executive Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Inherent Exposure */}
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 laser-border-magenta relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
            <span className="text-rose-400 font-semibold tracking-wider uppercase">Total Inherent Exposure</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-tech text-white tracking-wide">
            {formatRp(totalInherentVal)}
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800 font-mono-tech">
            <span className="text-rose-400 font-bold">{countExtreme} Extreme • {countHigh} High</span>
            <span className="text-slate-500">125 Total Items</span>
          </div>
        </div>

        {/* KPI 2: Mitigated Reduction */}
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 laser-border-cyan relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
            <span className="text-cyan-400 font-semibold tracking-wider uppercase">Nilai Reduksi Mitigasi</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-tech text-cyan-300 tracking-wide">
            {formatRp(totalReductionVal)}
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800 font-mono-tech">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              {reductionPct}% Efisiensi Risiko
            </span>
            <span className="text-slate-500">Target RKAP 2026</span>
          </div>
        </div>

        {/* KPI 3: Residual Exposure */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
            <span className="text-emerald-400 font-semibold tracking-wider uppercase">Target Residual Exposure</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-tech text-emerald-300 tracking-wide">
            {formatRp(totalResidualVal)}
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800 font-mono-tech">
            <span className="text-slate-400">Sisa Risiko Terkendali</span>
            <span className="text-cyan-400 font-bold">Aman Toleransi Direksi</span>
          </div>
        </div>

        {/* KPI 4: Audit Universe Readiness */}
        <div className="glass-panel p-4 rounded-2xl border border-fuchsia-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
            <span className="text-fuchsia-400 font-semibold tracking-wider uppercase">Kandidat Audit AAP 2026</span>
            <span className="p-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-tech text-fuchsia-300 tracking-wide">
            25 Penugasan Prioritas
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800 font-mono-tech">
            <span className="text-slate-400">Top 20% High-Risk Pool</span>
            <button
              onClick={() => onNavigateTab('aap')}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-0.5"
            >
              Jadwal AAP &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Dynamic Value Chain Risk Flow Animation (Left 7 cols) & 5x5 Matrix (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <RiskFlowNetwork
            departmentStats={departmentStats}
            activeDept={selectedDept}
            onSelectDept={onSelectDept}
          />
        </div>
        <div className="lg:col-span-5">
          <RiskMatrix5x5
            risks={risks}
            onCellClick={(items, p, i) => {
              if (onFilterRiskRegister) onFilterRiskRegister('ALL');
            }}
          />
        </div>
      </div>

      {/* Row 3: DEPARTMENT INFOGRAPHICS (THE USER REQUESTED CORE PIECE) */}
      <div className="pt-2">
        <DepartmentInfographics
          departmentStats={departmentStats}
          selectedDept={selectedDept}
          onSelectDept={onSelectDept}
          onFilterRiskRegister={onFilterRiskRegister}
        />
      </div>

      {/* Row 4: Top 5 FMCG Strategic Risk Profiles (KRIs & Sasaran RKAP) */}
      <div className="pt-2">
        <StrategicRiskProfiles />
      </div>

      {/* Row 5: Financial Exposure Distribution by Department Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-tech uppercase tracking-wide">
                Distribusi Eksposur Finansial 10 Departemen (Inherent vs Residual)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Perbandingan nominal potensi kerugian awal (Inherent) dengan target pengendalian (Residual) per unit bisnis.
            </p>
          </div>
          <span className="text-[11px] font-mono-tech text-cyan-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Total Inherent: {formatRp(totalInherentVal)}
          </span>
        </div>

        {/* Visual Bar Comparison per Department */}
        <div className="space-y-3 font-mono-tech text-xs">
          {Object.keys(departmentStats).map((d) => {
            const s = departmentStats[d];
            const maxVal = 60_000_000_000; // max scale 60M
            const inPct = Math.min((s.inherentTotal / maxVal) * 100, 100);
            const resPct = Math.min((s.residualTotal / maxVal) * 100, 100);

            return (
              <div key={d} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-tech text-sm">{d}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {s.count} Risiko
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] flex-wrap">
                    <span className="text-amber-400 font-semibold">Inherent: {formatRp(s.inherentTotal)}</span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-cyan-400 font-semibold">Residual: {formatRp(s.residualTotal)}</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 text-[10px]">
                      -{s.reductionPct}%
                    </span>
                  </div>
                </div>

                {/* Dual Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${inPct}%` }}
                      title={`Inherent Exposure: ${formatRp(s.inherentTotal)}`}
                    />
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${resPct}%` }}
                      title={`Residual Exposure: ${formatRp(s.residualTotal)}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
