import React, { useState } from 'react';
import {
  FileText, Download, Share2, Mail, Sheet, CheckCircle2,
  Clock, AlertCircle, Printer, ExternalLink, X, Send
} from 'lucide-react';
import { COMPANY_INFO } from '../data/riskData';
import { formatRp } from '../utils/helpers';
import * as XLSX from 'xlsx';

export default function ExportCenterModal({
  isOpen,
  onClose,
  risks = [],
  departmentStats = {},
  initialTab = 'pdf'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'pdf', 'sheets', 'email'
  const [syncStatus, setSyncStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  if (!isOpen) return null;

  // Handle Excel download
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(risks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RBAMS_Risk_Universe_2026');
    XLSX.writeFile(wb, `RBAMS_PT_Agung_Putra_Nirantara_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Handle PDF Print
  const handlePrintPDF = () => {
    window.print();
  };

  // Simulate Google Sheets Sync
  const handleSyncGoogleSheets = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1400);
  };

  // Simulate Gmail Dispatch
  const handleSendEmailNotification = (decision = 'approve') => {
    setEmailStatus('sending');
    setTimeout(() => {
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 laser-border-cyan my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-tech uppercase tracking-wide flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              Download & Connectivity Center
            </h3>
            <span className="text-xs text-cyan-300/70 font-mono-tech">
              PDF Generator • Google Sheets 2-Way Sync • Gmail API Actionable Alerts
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-mono-tech">
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono-tech">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Laporan Komite Audit (PDF)
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sheet className="w-3.5 h-3.5" />
            Google Sheets 2-Way Sync
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Gmail API Actionable Buttons
          </button>
        </div>

        {/* TAB 1: PDF REPORT PREVIEW */}
        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono-tech space-y-3">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-1 px-2 rounded-lg bg-white/[0.14] border border-cyan-400/60 shadow-[0_0_12px_rgba(0,243,255,0.3)] backdrop-blur-md flex items-center">
                    <img
                      src="/logo-apn.png"
                      alt="Logo PT. Agung Putra Nirantara"
                      className="h-7 w-auto object-contain filter contrast-150 brightness-115"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-tech text-sm uppercase">
                      Laporan Eksekutif Komite Audit Tahunan 2026
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {COMPANY_INFO.name} • {COMPANY_INFO.classification}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Ready to Print
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block">Chief Audit Executive:</span>
                  <span className="text-white font-semibold">{COMPANY_INFO.chiefAuditExecutive}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Internal Audit Manager:</span>
                  <span className="text-cyan-300 font-semibold">{COMPANY_INFO.auditCommitteeChair}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Inherent Exposure:</span>
                  <span className="text-amber-300 font-bold">Rp 486.7 Milyar</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Target Residual Exposure:</span>
                  <span className="text-emerald-300 font-bold">Rp 239.1 Milyar (50.9% Reduksi)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                Laporan mencakup hasil Annual Risk Assessment 10 departemen, 25 usulan penugasan audit berbasis risiko (AAP 2026), serta evaluasi defisiensi kontrol internal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-tech flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Unduh Spreadsheet Excel (.xlsx)
              </button>
              <button
                onClick={handlePrintPDF}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 shadow-lg transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak / Ekspor PDF Resolusi Tinggi
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE SHEETS 2-WAY SYNC */}
        {activeTab === 'sheets' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono-tech space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Sheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Google Sheets Live Connected</div>
                    <div className="text-[10px] text-slate-400">
                      ID: sheets.google.com/d/1X-RBAMS-PT-Agung-Putra-Nirantara-2026
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Status: Terhubung
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                Sinkronisasi 2 arah otomatis memperbarui dashboard presentasi Direksi setiap kali ada perubahan pada modul ERM atau penyelesaian Kertas Kerja Audit (e-KKA).
              </p>

              {syncStatus === 'syncing' && (
                <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Mengunggah 125 baris data dan pivot table ke Google Sheets API...</span>
                </div>
              )}

              {syncStatus === 'success' && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sinkronisasi Google Sheets Berhasil! Waktu: Baru saja.</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSyncGoogleSheets}
                disabled={syncStatus === 'syncing'}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Sinkronkan Data ke Google Sheets Sekarang
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: GMAIL ACTIONABLE EMAIL PREVIEW */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono-tech space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Simulasi Gmail API Actionable Email</span>
                <span className="text-[10px] text-fuchsia-400">Kepada: Direksi & Komite Audit</span>
              </div>

              {/* Simulated Email Envelope */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-fuchsia-500/30 space-y-3 text-slate-200">
                <div className="text-[11px] text-slate-400">
                  <div><strong>Subjek:</strong> [RBAMS URGENT] Permohonan Persetujuan AAP 2026 & Anomali Klaim Promo</div>
                  <div><strong>Dari:</strong> internal.audit@agungputranirantara.co.id</div>
                </div>

                <div className="text-xs leading-relaxed border-t border-slate-800 pt-2">
                  Yth. Direktur Utama & Internal Audit Manager,
                  <br /><br />
                  Sistem RBAMS telah merampungkan jadwal usulan <strong>Annual Audit Plan 2026</strong> berdasarkan top 20% risiko tertinggi. Ditemukan pula indikasi anomali klaim promosi pada Divisi Marketing senilai <strong>Rp 842.000.000</strong>.
                  <br /><br />
                  Mohon memberikan persetujuan formal melalui tombol interaktif di bawah ini:
                </div>

                {/* Actionable Buttons (PRD feature) */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleSendEmailNotification('approve')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 shadow-lg transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Setuju (Approve AAP 2026)
                  </button>
                  <button
                    onClick={() => handleSendEmailNotification('reject')}
                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4" />
                    Tolak / Minta Revisi
                  </button>
                </div>
              </div>

              {emailStatus === 'sent' && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Notifikasi email berhasil dikirim via Gmail API! Keputusan tercatat di log audit.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
