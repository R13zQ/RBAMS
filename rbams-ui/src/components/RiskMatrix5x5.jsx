import React, { useState } from 'react';
import { Grid, Eye, BarChart2, Shield, AlertOctagon } from 'lucide-react';
import { getRiskLevelColor, formatRp } from '../utils/helpers';

export default function RiskMatrix5x5({ risks = [], onCellClick }) {
  const [matrixType, setMatrixType] = useState('inherent'); // 'inherent' or 'residual'
  const [selectedCell, setSelectedCell] = useState(null);

  // Define 5x5 coordinates: Impacts 5 down to 1, Probs 1 to 5
  const impacts = [5, 4, 3, 2, 1];
  const probs = [1, 2, 3, 4, 5];

  // Map each cell to its risk classification according to FMCG ERM taxonomy:
  // Prob x Impact >= 16: Extreme (Red)
  // Prob x Impact 10-15: High (Orange/Amber)
  // Prob x Impact 5-9: Medium (Yellow)
  // Prob x Impact 1-4: Low (Green/Cyan)
  const getCellRiskLevel = (p, i) => {
    const score = p * i;
    if (score >= 16 || (i === 5 && p >= 3) || (p === 5 && i >= 3)) return 'Extreme';
    if (score >= 10 || (i === 4 && p >= 3) || (i === 5 && p === 2)) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  };

  // Group risks by (prob, impact)
  const cellCounts = {};
  const cellRisks = {};

  risks.forEach((r) => {
    const p = matrixType === 'inherent' ? (r.inherent_prob || 1) : (r.residual_prob || 1);
    const i = matrixType === 'inherent' ? (r.inherent_impact || 1) : (r.residual_impact || 1);
    const key = `${p}-${i}`;
    
    cellCounts[key] = (cellCounts[key] || 0) + 1;
    if (!cellRisks[key]) cellRisks[key] = [];
    cellRisks[key].push(r);
  });

  const handleCellSelect = (p, i) => {
    const key = `${p}-${i}`;
    const items = cellRisks[key] || [];
    setSelectedCell({ prob: p, impact: i, items, level: getCellRiskLevel(p, i) });
    if (onCellClick) onCellClick(items, p, i);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 laser-border-cyan space-y-4">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Grid className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-tech tracking-wide uppercase">
              Matriks Peta Risiko 5x5 Interaktif
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sebaran 125 profil risiko FMCG berdasarkan tingkat Kemungkinan (1-5) dan Dampak (1-5).
          </p>
        </div>

        {/* Inherent vs Residual Matrix Switch */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono-tech">
          <button
            onClick={() => {
              setMatrixType('inherent');
              setSelectedCell(null);
            }}
            className={`px-3 py-1 rounded transition ${
              matrixType === 'inherent'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inherent Risk
          </button>
          <button
            onClick={() => {
              setMatrixType('residual');
              setSelectedCell(null);
            }}
            className={`px-3 py-1 rounded transition ${
              matrixType === 'residual'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Residual Target
          </button>
        </div>
      </div>

      {/* 5x5 Grid Layout */}
      <div className="flex gap-4">
        {/* Vertical Axis Title */}
        <div className="flex flex-col items-center justify-center -rotate-90 text-xs font-bold text-slate-400 tracking-wider font-tech uppercase w-6 shrink-0">
          Dampak (1-5)
        </div>

        {/* Matrix Container */}
        <div className="flex-1 space-y-1.5">
          {impacts.map((imp) => (
            <div key={imp} className="flex items-center gap-1.5">
              {/* Row Label */}
              <div className="w-6 text-right text-xs font-bold text-slate-400 font-mono-tech">
                {imp}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-5 gap-1.5 flex-1">
                {probs.map((prb) => {
                  const key = `${prb}-${imp}`;
                  const count = cellCounts[key] || 0;
                  const level = getCellRiskLevel(prb, imp);
                  const isSelected = selectedCell && selectedCell.prob === prb && selectedCell.impact === imp;

                  let cellBg = '';
                  let cellText = '';
                  let cellBorder = '';

                  if (level === 'Extreme') {
                    cellBg = 'bg-rose-950/60 hover:bg-rose-900/80';
                    cellText = 'text-rose-300';
                    cellBorder = 'border-rose-600/40';
                  } else if (level === 'High') {
                    cellBg = 'bg-amber-950/60 hover:bg-amber-900/80';
                    cellText = 'text-amber-300';
                    cellBorder = 'border-amber-600/40';
                  } else if (level === 'Medium') {
                    cellBg = 'bg-yellow-950/40 hover:bg-yellow-900/60';
                    cellText = 'text-yellow-300';
                    cellBorder = 'border-yellow-600/30';
                  } else {
                    cellBg = 'bg-emerald-950/40 hover:bg-emerald-900/60';
                    cellText = 'text-emerald-300';
                    cellBorder = 'border-emerald-600/30';
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleCellSelect(prb, imp)}
                      className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center p-1 border transition-all duration-200 relative group ${cellBg} ${cellBorder} ${
                        isSelected ? 'ring-2 ring-cyan-400 scale-[1.03] z-10' : ''
                      }`}
                    >
                      <span className={`text-sm sm:text-base font-bold font-mono-tech ${cellText}`}>
                        {count}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono-tech">
                        P{prb}×D{imp}
                      </span>
                      {count > 0 && (
                        <div className="hidden group-hover:block absolute bottom-full mb-1 z-30 px-2 py-1 rounded bg-slate-900 border border-cyan-500/50 text-[10px] text-cyan-300 whitespace-nowrap shadow-xl">
                          {count} Risiko ({level})
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Horizontal Axis Probabilities Labels */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-6" />
            <div className="grid grid-cols-5 gap-1.5 flex-1 text-center text-xs font-bold text-slate-400 font-mono-tech">
              <div>1 (Sangat Rendah)</div>
              <div>2 (Rendah)</div>
              <div>3 (Sedang)</div>
              <div>4 (Tinggi)</div>
              <div>5 (Sangat Tinggi)</div>
            </div>
          </div>

          <div className="text-center text-xs font-bold text-slate-400 tracking-wider font-tech uppercase pt-1">
            Probabilitas / Frekuensi Kejadian (1-5)
          </div>
        </div>
      </div>

      {/* Selected Cell Drilldown Drawer */}
      {selectedCell && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white font-tech text-sm">
                Detail Sel: Probabilitas {selectedCell.prob} × Dampak {selectedCell.impact}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold ${
                  selectedCell.level === 'Extreme'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : selectedCell.level === 'High'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : selectedCell.level === 'Medium'
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                Tingkat: {selectedCell.level} ({selectedCell.items.length} Item)
              </span>
            </div>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
            >
              Tutup &times;
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 mt-2 pr-1 scrollbar-thin">
            {selectedCell.items.map((it) => (
              <div
                key={it.id}
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] text-cyan-400 font-bold">{it.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-tech">
                      {it.department}
                    </span>
                    <span className="font-medium text-white">{it.risk_event}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Mitigasi: {it.mitigation_plan}
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono-tech text-amber-300 font-semibold">
                  {formatRp(matrixType === 'inherent' ? it.inherent_value : it.residual_value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
