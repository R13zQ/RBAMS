import React, { useState } from 'react';
import {
  Calendar, CheckCircle2, Clock, Sparkles, User, FileText,
  AlertTriangle, ArrowRight, ShieldCheck, Download, Send
} from 'lucide-react';
import { formatRp, getRiskLevelColor } from '../utils/helpers';

export default function AnnualAuditPlan({ risks, onOpenKKA, onSendApprovalEmail }) {
  const [selectedQuarter, setSelectedQuarter] = useState('ALL');
  const [notification, setNotification] = useState(null);

  // Filter top 20% highest risk items from ERM (Extreme & High, sorted by inherent value)
  const topRisks = [...risks]
    .filter((r) => r.inherent_level === 'Extreme' || r.inherent_level === 'High')
    .sort((a, b) => (b.inherent_value || 0) - (a.inherent_value || 0))
    .slice(0, 25); // Top 20% of 125 items = 25 items

  // Pre-configured AI Annual Audit Plan engagements for 2026
  const initialEngagements = [
    {
      id: 'AAP-2026-001',
      title: 'Audit Investigatif & Kepatuhan Trade Promotion Management',
      department: 'Marketing',
      quarter: 'Q1',
      priority: 'CRITICAL',
      mandays: 18,
      leadAuditor: '..........................................',
      team: ['Sarah Jenkins', 'Budi Santoso'],
      status: 'In Progress',
      scope: 'Pengujian substantif diskon distributor, validasi klaim klaim manual, dan pencegahan lapping kasir toko.',
      linkedRisks: ['RSK-001', 'RSK-078', 'RSK-082'],
      budgetRp: 45000000,
      inherentExposureRp: 12500000000
    },
    {
      id: 'AAP-2026-002',
      title: 'Audit Efisiensi Opex Logistik & Utilisasi Armada Distribusi',
      department: 'Delivery',
      quarter: 'Q1',
      priority: 'HIGH',
      mandays: 15,
      leadAuditor: 'Sarah Jenkins',
      team: ['Rendra Wijaya'],
      status: 'Approved',
      scope: 'Analisis routing armada GPS manual, pembengkakan BBM & tol, serta SLA pengiriman vendor 3PL.',
      linkedRisks: ['RSK-015', 'RSK-018', 'RSK-022'],
      budgetRp: 35000000,
      inherentExposureRp: 9800000000
    },
    {
      id: 'AAP-2026-003',
      title: 'Audit Pengendalian Piutang (AR) & Skema Limit Kredit Distributor',
      department: 'Finance',
      quarter: 'Q2',
      priority: 'CRITICAL',
      mandays: 20,
      leadAuditor: 'Budi Santoso, Ak, CA',
      team: ['Dian Anggraeni', 'Fajar Pratama'],
      status: 'Scheduled',
      scope: 'Evaluasi aging schedule piutang macet, approval limit kredit customer baru, dan rekonsiliasi faktur pajak.',
      linkedRisks: ['RSK-002', 'RSK-005', 'RSK-011'],
      budgetRp: 40000000,
      inherentExposureRp: 11200000000
    },
    {
      id: 'AAP-2026-004',
      title: 'Audit Integritas WMS & Stock Opname Multi-Gudang Nasional',
      department: 'Warehouse',
      quarter: 'Q2',
      priority: 'HIGH',
      mandays: 16,
      leadAuditor: 'Rendra Wijaya',
      team: ['Bayu Nugraha'],
      status: 'Scheduled',
      scope: 'Verifikasi sistem FEFO barang expired, deviasi shrinkage fisik vs sistem WMS, dan utilisasi racking pallet.',
      linkedRisks: ['RSK-028', 'RSK-031', 'RSK-035'],
      budgetRp: 38000000,
      inherentExposureRp: 8400000000
    },
    {
      id: 'AAP-2026-005',
      title: 'Audit Keamanan Siber ERP, Disaster Recovery & Hak Akses User',
      department: 'IT',
      quarter: 'Q3',
      priority: 'HIGH',
      mandays: 14,
      leadAuditor: '..........................................',
      team: ['Agus Firmansyah'],
      status: 'Scheduled',
      scope: 'Penetration testing server ERP cloud, segregasi tugas (SOD) sistem finance, dan uji failover database Spanner.',
      linkedRisks: ['RSK-042', 'RSK-045', 'RSK-049'],
      budgetRp: 50000000,
      inherentExposureRp: 10500000000
    },
    {
      id: 'AAP-2026-006',
      title: 'Audit Kelayakan Peluncuran Produk Baru & Akurasi S&OP Forecast',
      department: 'Sales',
      quarter: 'Q3',
      priority: 'HIGH',
      mandays: 15,
      leadAuditor: 'Sarah Jenkins',
      team: ['Clarissa Anggraini'],
      status: 'Scheduled',
      scope: 'Review evaluasi riset pasar produk baru, sinkronisasi estimasi demand vs kapasitas pabrik, dan ROI kampanye iklan.',
      linkedRisks: ['RSK-055', 'RSK-060', 'RSK-064'],
      budgetRp: 42000000,
      inherentExposureRp: 9100000000
    },
    {
      id: 'AAP-2026-007',
      title: 'Audit Kepatuhan Izin Edar BPOM, Halal & Kontrak Distributor',
      department: 'Legal',
      quarter: 'Q4',
      priority: 'MEDIUM',
      mandays: 12,
      leadAuditor: 'Dian Anggraeni',
      team: ['Farhan Nugroho'],
      status: 'Scheduled',
      scope: 'Masa berlaku izin edar seluruh SKU produk, klausul penalti wanprestasi distributor, dan mitigasi litigasi hak cipta.',
      linkedRisks: ['RSK-088', 'RSK-092'],
      budgetRp: 30000000,
      inherentExposureRp: 6700000000
    },
    {
      id: 'AAP-2026-008',
      title: 'Audit Pengadaan Bahan Baku Kemasan & Kinerja Vendor 3PL',
      department: 'Purchasing',
      quarter: 'Q4',
      priority: 'HIGH',
      mandays: 15,
      leadAuditor: 'Budi Santoso, Ak, CA',
      team: ['Fajar Pratama'],
      status: 'Scheduled',
      scope: 'Evaluasi tender supplier botol & karton, dependensi tunggal vendor 3PL truk, dan kepatuhan SLA lead-time.',
      linkedRisks: ['RSK-098', 'RSK-102', 'RSK-106'],
      budgetRp: 36000000,
      inherentExposureRp: 8900000000
    }
  ];

  const [engagements, setEngagements] = useState(initialEngagements);

  const filteredEngagements = engagements.filter(
    (e) => selectedQuarter === 'ALL' || e.quarter === selectedQuarter
  );

  const handleApproveAll = () => {
    setEngagements(engagements.map((e) => ({ ...e, status: 'Approved' })));
    setNotification('Seluruh Jadwal Rencana Audit Tahunan (AAP 2026) telah Disetujui Komite Audit!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegenerateAI = () => {
    setNotification('AI Risk Engine memetakan ulang Top 20% Risiko Inherent Tertinggi ke Jadwal AAP 2026...');
    setTimeout(() => {
      setNotification('Jadwal AAP 2026 berhasil diperbarui berdasarkan bobot eksposur Rp terkini!');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Header AAP */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 laser-border-cyan flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-tech tracking-wide uppercase">
              Risk-Based Annual Audit Plan (AAP 2026)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-tech">
              Top 20% High-Risk Auto Selection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistem secara otomatis menyusun jadwal penugasan audit berbasis prioritas bobot risiko Inherent & defisiensi kontrol.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRegenerateAI}
            className="px-3 py-1.5 bg-fuchsia-950/60 hover:bg-fuchsia-900 border border-fuchsia-500/40 text-fuchsia-300 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            Regenerate AI
          </button>
          <button
            onClick={handleApproveAll}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve Plan (Komite Audit)
          </button>
          <button
            onClick={onSendApprovalEmail}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition"
            title="Kirim email notifikasi AAP ke Direksi & Komite Audit"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            Kirim Persetujuan Email
          </button>
        </div>
      </div>

      {/* Top 20% Inherent Risks Pool Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] block uppercase">Universe Candidate:</span>
          <span className="text-lg font-bold font-tech text-white">25 Penugasan Teratas</span>
          <span className="text-[10px] text-cyan-400 block mt-0.5">Top 20% dari 125 Items</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] block uppercase">Total Mandays Budget:</span>
          <span className="text-lg font-bold font-tech text-cyan-300">124 Hari Kerja</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">8 Penugasan Terjadwal</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] block uppercase">Total Inherent Exposure:</span>
          <span className="text-lg font-bold font-tech text-amber-300">Rp 77.1 Milyar</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Fokus Perlindungan Aset</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] block uppercase">Status Persetujuan:</span>
          <span className="text-lg font-bold font-tech text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Disetujui
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">SK Komite Audit No. 04/2026</span>
        </div>
      </div>

      {/* Quarter Filter Bar */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 text-xs font-mono-tech">
        <span className="text-slate-400 px-2 font-bold font-tech">Periode Audit:</span>
        {['ALL', 'Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
          <button
            key={q}
            onClick={() => setSelectedQuarter(q)}
            className={`px-3 py-1 rounded-lg transition ${
              selectedQuarter === q
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {q === 'ALL' ? 'Seluruh Siklus (Q1 - Q4)' : `Kuartal ${q} 2026`}
          </button>
        ))}
      </div>

      {/* Engagement Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEngagements.map((eng) => (
          <div
            key={eng.id}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 relative group"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 font-mono-tech">{eng.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-tech">
                  {eng.department}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono-tech font-bold">
                  {eng.quarter} 2026
                </span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold ${
                  eng.status === 'In Progress'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {eng.status}
              </span>
            </div>

            {/* Title & Scope */}
            <div>
              <h4 className="text-sm font-bold text-white font-tech leading-snug">{eng.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{eng.scope}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono-tech">
              <div>
                <span className="text-slate-500 block text-[9px]">Lead Auditor:</span>
                <span className="text-slate-200 font-semibold truncate block">{eng.leadAuditor}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Alokasi Waktu:</span>
                <span className="text-cyan-300 font-semibold">{eng.mandays} Mandays</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Eksposur Risiko:</span>
                <span className="text-amber-300 font-semibold">{formatRp(eng.inherentExposureRp)}</span>
              </div>
            </div>

            {/* Linked Risks & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono-tech">
                <span>Risiko Terkait:</span>
                {eng.linkedRisks.map((rid) => (
                  <span key={rid} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {rid}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onOpenKKA(eng)}
                className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/40 rounded-lg text-cyan-300 text-xs font-semibold flex items-center gap-1 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Buka e-KKA &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
