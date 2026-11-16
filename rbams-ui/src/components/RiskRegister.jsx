import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Plus, Download, Edit3, Trash2, Eye,
  RefreshCw, Sparkles, ArrowUpDown, ChevronLeft, ChevronRight,
  ShieldCheck, AlertTriangle, FileSpreadsheet, Check
} from 'lucide-react';
import { formatRp, getRiskLevelColor, getControlEffectivenessColor } from '../utils/helpers';
import * as XLSX from 'xlsx';

export default function RiskRegister({
  risks,
  onUpdateRisk,
  onAddRisk,
  onDeleteRisk,
  onRolloverYear,
  onAICalibrate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterEff, setFilterEff] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Modal states
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit', 'add'
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);

  // Unique departments for filter
  const departments = useMemo(() => {
    const s = new Set(risks.map((r) => r.department));
    return Array.from(s).sort();
  }, [risks]);

  // Filtered risks
  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      const matchSearch =
        searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.risk_event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.root_cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.process.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = filterDept === 'ALL' || r.department === filterDept;
      const matchLevel = filterLevel === 'ALL' || r.inherent_level === filterLevel;
      const matchEff = filterEff === 'ALL' || r.control_effectiveness === filterEff;

      return matchSearch && matchDept && matchLevel && matchEff;
    });
  }, [risks, searchTerm, filterDept, filterLevel, filterEff]);

  // Pagination
  const totalPages = Math.ceil(filteredRisks.length / pageSize) || 1;
  const paginatedRisks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRisks.slice(start, start + pageSize);
  }, [filteredRisks, currentPage, pageSize]);

  // Handlers
  const handleOpenModal = (mode, risk = null) => {
    setModalMode(mode);
    setSelectedRisk(risk);
    if (risk) {
      setFormData({ ...risk });
    } else {
      setFormData({
        id: `RSK-${risks.length + 1}`,
        department: departments[0] || 'Finance',
        process: '',
        risk_event: '',
        root_cause: '',
        existing_control: '',
        control_effectiveness: 'Kurang Efektif',
        inherent_prob: 3,
        inherent_impact: 3,
        inherent_level: 'High',
        inherent_value: 2000000000,
        mitigation_plan: '',
        reduction_pct: '50%',
        reduction_value: 1000000000,
        residual_target_pct: '50%',
        residual_prob: 2,
        residual_impact: 2,
        residual_level: 'Medium',
        residual_value: 1000000000
      });
    }
  };

  const handleSaveRisk = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      onAddRisk(formData);
      showNotification('Risiko baru berhasil ditambahkan ke Risk Universe!');
    } else if (modalMode === 'edit') {
      onUpdateRisk(formData);
      showNotification('Perubahan profil risiko berhasil disimpan!');
    }
    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Hapus risiko ${id} dari Risk Universe?`)) {
      onDeleteRisk(id);
      showNotification(`Risiko ${id} telah dihapus.`);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRisks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Risk_Register_2026');
    XLSX.writeFile(wb, 'RBAMS_PT_Agung_Putra_Nirantara_Risk_Register.xlsx');
    showNotification('Ekspor Excel berhasil diunduh!');
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Control Bar: Search & Action Buttons */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 laser-border-cyan flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari proses, peristiwa risiko, akar masalah, kode..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono-tech"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
          {/* Department Filter */}
          <select
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">Semua Departemen ({risks.length})</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => {
              setFilterLevel(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">Semua Tingkat Inherent</option>
            <option value="Extreme">Extreme</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Effectiveness Filter */}
          <select
            value={filterEff}
            onChange={(e) => {
              setFilterEff(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">Semua Efektivitas</option>
            <option value="Efektif">Efektif</option>
            <option value="Kurang Efektif">Kurang Efektif</option>
            <option value="Tidak Efektif">Tidak Efektif</option>
          </select>
        </div>

        {/* Action Buttons: Add, AI Score, Rollover, Export */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            onClick={() => handleOpenModal('add')}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Risiko
          </button>

          <button
            onClick={onAICalibrate}
            className="px-3 py-1.5 bg-fuchsia-950/60 hover:bg-fuchsia-900/80 border border-fuchsia-500/50 text-fuchsia-300 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition"
            title="AI Risk Scoring: Mengkalibrasi ulang Likelihood & Impact berdasarkan KRI"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            AI Calibrate
          </button>

          <button
            onClick={onRolloverYear}
            className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/50 text-amber-300 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition"
            title="Year-End Rollover: Memigrasikan risiko yang belum termitigasi ke siklus berikutnya"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Rollover
          </button>

          <button
            onClick={handleExportExcel}
            className="p-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white transition"
            title="Ekspor ke Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Kode & Dept</th>
                <th className="py-3 px-3 min-w-[200px]">Peristiwa Risiko & Aktivitas</th>
                <th className="py-3 px-3 min-w-[180px]">Mitigasi Berjalan</th>
                <th className="py-3 px-2 text-center">Inherent P×D</th>
                <th className="py-3 px-3 text-right">Inherent (Rp)</th>
                <th className="py-3 px-3 min-w-[180px]">Rencana Tambahan</th>
                <th className="py-3 px-2 text-center">Residual P×D</th>
                <th className="py-3 px-3 text-right">Residual (Rp)</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedRisks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    Tidak ada risiko yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                paginatedRisks.map((r) => {
                  const levelC = getRiskLevelColor(r.inherent_level);
                  const effC = getControlEffectivenessColor(r.control_effectiveness);
                  const resC = getRiskLevelColor(r.residual_level);

                  return (
                    <tr key={r.id} className="hover:bg-slate-900/60 transition group">
                      {/* Code & Dept */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <span className="font-bold text-cyan-400 block">{r.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-tech">
                          {r.department}
                        </span>
                      </td>

                      {/* Event & Process */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-semibold text-white leading-snug">{r.risk_event}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Proses: <span className="text-slate-300">{r.process}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1" title={r.root_cause}>
                          Sebab: {r.root_cause}
                        </div>
                      </td>

                      {/* Existing Control */}
                      <td className="py-3 px-3 align-top">
                        <div className="text-slate-300 text-[11px]">{r.existing_control}</div>
                        <span
                          className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded border font-semibold ${effC.bg} ${effC.text} ${effC.border}`}
                        >
                          {r.control_effectiveness}
                        </span>
                      </td>

                      {/* Inherent Score */}
                      <td className="py-3 px-2 align-top text-center whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold border ${levelC.bg} ${levelC.text} ${levelC.border}`}
                        >
                          {r.inherent_level}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono-tech">
                          {r.inherent_prob} × {r.inherent_impact}
                        </div>
                      </td>

                      {/* Inherent Rp */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <div className="font-bold text-amber-300 font-mono-tech">
                          {formatRp(r.inherent_value)}
                        </div>
                      </td>

                      {/* Mitigation Plan */}
                      <td className="py-3 px-3 align-top">
                        <div className="text-[11px] text-cyan-200 line-clamp-2" title={r.mitigation_plan}>
                          {r.mitigation_plan}
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-0.5 font-mono-tech">
                          Reduksi: {r.reduction_pct} ({formatRp(r.reduction_value)})
                        </div>
                      </td>

                      {/* Residual Score */}
                      <td className="py-3 px-2 align-top text-center whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold border ${resC.bg} ${resC.text} ${resC.border}`}
                        >
                          {r.residual_level}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono-tech">
                          {r.residual_prob} × {r.residual_impact}
                        </div>
                      </td>

                      {/* Residual Rp */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <div className="font-bold text-emerald-400 font-mono-tech">
                          {formatRp(r.residual_value)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenModal('view', r)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Detail Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', r)}
                            className="p-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="text-slate-400">
            Menampilkan <span className="text-cyan-400 font-bold">{filteredRisks.length}</span> dari{' '}
            <span className="text-white">{risks.length}</span> total item risiko
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300">
              Halaman <span className="text-cyan-400 font-bold">{currentPage}</span> dari {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: VIEW / EDIT / ADD */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 laser-border-cyan my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-tech uppercase tracking-wide">
                  {modalMode === 'add'
                    ? 'Tambah Profil Risiko Baru'
                    : modalMode === 'edit'
                    ? `Edit Risiko: ${formData.id}`
                    : `Detail Profil Risiko: ${formData.id}`}
                </h3>
                <span className="text-xs text-cyan-400 font-mono-tech">
                  PT. Agung Putra Nirantara • ERM Universe
                </span>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white text-lg font-mono-tech"
              >
                &times;
              </button>
            </div>

            {modalMode === 'view' ? (
              /* VIEW MODE */
              <div className="space-y-4 text-xs font-mono-tech text-slate-300 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Departemen:</span>
                    <span className="text-cyan-300 font-bold font-tech text-sm">{formData.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Proses & Aktivitas:</span>
                    <span className="text-white font-semibold">{formData.process}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block mb-1">Peristiwa Risiko (Risk Event):</span>
                  <p className="text-white font-medium text-sm leading-relaxed">{formData.risk_event}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block mb-1">Akar Penyebab (Root Cause):</span>
                  <p className="text-slate-300 leading-relaxed">{formData.root_cause}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Mitigasi Berjalan:</span>
                    <p className="text-slate-200">{formData.existing_control}</p>
                    <div className="mt-2 text-cyan-400">
                      Efektivitas: <span className="font-bold">{formData.control_effectiveness}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Rencana Mitigasi Tambahan:</span>
                    <p className="text-cyan-300">{formData.mitigation_plan}</p>
                    <div className="mt-2 text-emerald-400">
                      Target Reduksi: <span className="font-bold">{formData.reduction_pct}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <span className="text-rose-400 block font-bold">Inherent Risk:</span>
                    <div className="text-white mt-1">
                      Level: <span className="font-bold text-rose-300">{formData.inherent_level}</span> (Prob:{' '}
                      {formData.inherent_prob}, Dampak: {formData.inherent_impact})
                    </div>
                    <div className="text-amber-300 font-bold mt-1">
                      Nilai: {formatRp(formData.inherent_value)}
                    </div>
                  </div>
                  <div>
                    <span className="text-emerald-400 block font-bold">Residual Target:</span>
                    <div className="text-white mt-1">
                      Level: <span className="font-bold text-emerald-300">{formData.residual_level}</span> (Prob:{' '}
                      {formData.residual_prob}, Dampak: {formData.residual_impact})
                    </div>
                    <div className="text-cyan-300 font-bold mt-1">
                      Nilai: {formatRp(formData.residual_value)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => setModalMode('edit')}
                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 rounded-xl transition"
                  >
                    Buka Editor &rarr;
                  </button>
                </div>
              </div>
            ) : (
              /* EDIT / ADD FORM */
              <form onSubmit={handleSaveRisk} className="space-y-3 text-xs font-mono-tech max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Departemen</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      required
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Proses & Aktivitas</label>
                    <input
                      type="text"
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Peristiwa Risiko (Risk Event)</label>
                  <textarea
                    rows={2}
                    value={formData.risk_event}
                    onChange={(e) => setFormData({ ...formData, risk_event: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Akar Penyebab (Root Cause)</label>
                  <textarea
                    rows={2}
                    value={formData.root_cause}
                    onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Mitigasi Berjalan (Existing Control)</label>
                    <input
                      type="text"
                      value={formData.existing_control}
                      onChange={(e) => setFormData({ ...formData, existing_control: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Efektivitas Mitigasi</label>
                    <select
                      value={formData.control_effectiveness}
                      onChange={(e) => setFormData({ ...formData, control_effectiveness: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="Efektif">Efektif</option>
                      <option value="Kurang Efektif">Kurang Efektif</option>
                      <option value="Tidak Efektif">Tidak Efektif</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="text-rose-400 font-bold">Inherent Risk Scoring</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-400 text-[10px] block">Probabilitas (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.inherent_prob}
                        onChange={(e) => setFormData({ ...formData, inherent_prob: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[10px] block">Dampak (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.inherent_impact}
                        onChange={(e) => setFormData({ ...formData, inherent_impact: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[10px] block">Tingkat Inherent</label>
                      <select
                        value={formData.inherent_level}
                        onChange={(e) => setFormData({ ...formData, inherent_level: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      >
                        <option value="Extreme">Extreme</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block">Nilai Risiko Inherent (Rp)</label>
                    <input
                      type="number"
                      value={formData.inherent_value}
                      onChange={(e) => setFormData({ ...formData, inherent_value: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-amber-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Rencana Mitigasi Tambahan</label>
                  <textarea
                    rows={2}
                    value={formData.mitigation_plan}
                    onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold"
                  >
                    {modalMode === 'add' ? 'Simpan Risiko Baru' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
