// Helper utility functions for RBAMS

export const formatRp = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
  const num = Number(val);
  if (num >= 1_000_000_000_000) {
    return `Rp ${(num / 1_000_000_000_000).toFixed(2)} Triliun`;
  }
  if (num >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toFixed(2)} Milyar`;
  }
  if (num >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toFixed(1)} Juta`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

export const formatRpFull = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export const getRiskLevelColor = (level) => {
  const l = (level || '').toLowerCase();
  switch (l) {
    case 'extreme':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/40',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.35)]',
        hex: '#ef4444',
        name: 'Extreme'
      };
    case 'high':
      return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.35)]',
        hex: '#f59e0b',
        name: 'High'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        glow: 'shadow-[0_0_12px_rgba(234,179,8,0.35)]',
        hex: '#eab308',
        name: 'Medium'
      };
    case 'low':
      return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
        hex: '#10b981',
        name: 'Low'
      };
    default:
      return {
        bg: 'bg-slate-500/20',
        text: 'text-slate-400',
        border: 'border-slate-500/40',
        glow: '',
        hex: '#94a3b8',
        name: level || 'N/A'
      };
  }
};

export const getControlEffectivenessColor = (eff) => {
  const e = (eff || '').toLowerCase();
  if (e.includes('efektif') && !e.includes('kurang') && !e.includes('tidak')) {
    return {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      label: 'Efektif'
    };
  }
  if (e.includes('kurang')) {
    return {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      label: 'Kurang Efektif'
    };
  }
  return {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'Tidak Efektif'
  };
};

export const calculateDepartmentStats = (risks) => {
  const depts = {};
  
  risks.forEach((r) => {
    const d = r.department;
    if (!depts[d]) {
      depts[d] = {
        name: d,
        count: 0,
        inherentTotal: 0,
        residualTotal: 0,
        reductionTotal: 0,
        levels: { Extreme: 0, High: 0, Medium: 0, Low: 0 },
        residualLevels: { Extreme: 0, High: 0, Medium: 0, Low: 0 },
        effectiveness: { 'Efektif': 0, 'Kurang Efektif': 0, 'Tidak Efektif': 0 },
        items: []
      };
    }
    
    depts[d].count += 1;
    depts[d].inherentTotal += Number(r.inherent_value || 0);
    depts[d].residualTotal += Number(r.residual_value || 0);
    depts[d].reductionTotal += Number(r.reduction_value || 0);
    
    if (depts[d].levels[r.inherent_level] !== undefined) {
      depts[d].levels[r.inherent_level] += 1;
    }
    if (depts[d].residualLevels[r.residual_level] !== undefined) {
      depts[d].residualLevels[r.residual_level] += 1;
    }
    
    const eff = r.control_effectiveness;
    if (eff === 'Efektif') depts[d].effectiveness['Efektif'] += 1;
    else if (eff === 'Kurang Efektif') depts[d].effectiveness['Kurang Efektif'] += 1;
    else depts[d].effectiveness['Tidak Efektif'] += 1;
    
    depts[d].items.push(r);
  });

  // Calculate composite Audit Priority Score for each department
  Object.values(depts).forEach(d => {
    // Formula: (Extreme*4 + High*2.5 + Medium*1) + (TidakEfektif*3 + KurangEfektif*1.5) + (InherentValue/10M)
    const riskScore = (d.levels.Extreme * 4) + (d.levels.High * 2.5) + (d.levels.Medium * 1);
    const controlScore = (d.effectiveness['Tidak Efektif'] * 3) + (d.effectiveness['Kurang Efektif'] * 1.5);
    const valueWeight = d.inherentTotal / 10_000_000_000;
    d.priorityScore = Math.round(riskScore + controlScore + valueWeight);
    d.reductionPct = d.inherentTotal > 0 ? ((d.reductionTotal / d.inherentTotal) * 100).toFixed(1) : '0';
  });

  return depts;
};
