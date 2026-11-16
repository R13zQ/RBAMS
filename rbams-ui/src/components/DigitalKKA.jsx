import React, { useState } from 'react';
import {
  FileText, CheckCircle2, Clock, Users, Printer,
  Save, AlertTriangle, Sparkles, Send, ShieldCheck, ChevronRight
} from 'lucide-react';
import { formatRp } from '../utils/helpers';

export default function DigitalKKA({ currentEngagement, onSaveKKA }) {
  // Pre-populated realistic FMCG Audit Findings in 5C Format
  const initialKKAList = [
    {
      id: 'KKA-2026-001',
      auditTitle: 'Audit Trade Promotion Management & Klaim Diskon Distributor',
      department: 'Marketing',
      riskId: 'RSK-001',
      findingTitle: 'Pencairan Klaim Trade Promo Tanpa Validasi Dokumen Faktur Asli & Potensi Lapping',
      auditor: '..........................................',
      reviewer: 'Sarah Jenkins',
      status: 'Reviewed & Final',
      condition:
        'Ditemukan 14 klaim diskon promosi distributor kuartal 4 senilai Rp 842.000.000 yang disetujui hanya berdasarkan fotokopi nota manual tanpa lampiran cetakan struk kasir atau data Sell-Out POS toko retail. Terdapat indikasi pergeseran tanggal setoran tunai (Lapping) oleh 2 Area Sales Coordinator selama rata-rata 12 hari kalender.',
      criteria:
        'SOP-MKT-08 pasal 4.2: Setiap klaim promosi distributor di atas Rp 25.000.000 wajib divalidasi dengan struk Sell-Out barcode sistem ERP toko dan berita acara rekonsiliasi yang ditandatangani Branch Manager. Kebijakan Anti-Fraud Perusahaan SK Dir-012/2024 mensyaratkan toleransi nol terhadap pergeseran setoran kas.',
      cause:
        '1. Lemahnya segregasi fungsi (SOD) di mana Area Sales merangkap sebagai verifikator klaim dan penagih kasir.\n2. Ketiadaan modul Trade Promotion Management (TPM) terintegrasi pada sistem ERP.\n3. Kurangnya rotasi penugasan kanvasing area selama lebih dari 3 tahun berturut-turut.',
      effect:
        '1. Kerugian finansial langsung estimasi Rp 318.500.000 akibat diskon ganda fiktif.\n2. Gangguan likuiditas kas operasional cabang.\n3. Rusaknya disparitas harga jual produk di pasar General Trade karena diskon promosi tidak dinikmati konsumen akhir.',
      recommendation:
        '1. Manajemen wajib segera menerapkan modul digital e-Promo dengan validasi barcode dan approval berjenjang otomatis.\n2. Pisahkan secara tegas fungsi penerimaan uang kas (Kolektor) dengan fungsi sales promotion.\n3. Lakukan audit investigasi forensik terhadap seluruh faktur distributor area terkait dan berlakukan sanksi tegas sesuai Kode Etik Perusahaan.',
      financialExposureRp: 842000000,
      riskLevel: 'Extreme'
    },
    {
      id: 'KKA-2026-002',
      auditTitle: 'Audit Efisiensi Armada Logistik & Pengendalian Biaya Bahan Bakar',
      department: 'Delivery',
      riskId: 'RSK-015',
      findingTitle: 'Penyimpangan Routing Distribusi Armada Truk & Tingginya Jam Lembur Manual Sopir',
      auditor: 'Sarah Jenkins',
      reviewer: '..........................................',
      status: 'In Review',
      condition:
        'Rata-rata deviasi rute perjalanan armada logistik mencapai 28% di luar rute standar RKAP. Pembayaran uang jalan BBM dan tol masih menggunakan kuitansi kertas tanpa validasi GPS geofencing, mengakibatkan pembengkakan Opex pengiriman sebesar Rp 412.000.000 dalam 3 bulan terakhir.',
      criteria:
        'Pedoman Operasional Logistik POL-DLV-03 menetapkan standar konsumsi BBM per tonase maksimal Rp 500/kg dengan deviasi rute yang diizinkan maksimal 5% untuk kondisi darurat jalan raya.',
      cause:
        '1. Belum terpasangnya sistem Telematika / Transportation Management System (TMS) otomatis pada seluruh unit armada in-house.\n2. Verifikasi rute dan uang jalan dilakukan secara retrospektif bulanan tanpa kontrol real-time.',
      effect:
        '1. Pembengkakan biaya bahan bakar dan tol sebesar Rp 412.000.000 per kuartal.\n2. Tingkat keterlambatan pengiriman ke toko retail (OTIF) turun menjadi 88.4% (target > 95%).',
      recommendation:
        '1. Implementasikan integrasi GPS Fleet Management & E-Fuel Card yang terkunci pada SPBU rekanan.\n2. Terapkan algoritma dynamic route planning untuk memaksimalkan kapasitas muatan truk dan menekan jam lembur.',
      financialExposureRp: 412000000,
      riskLevel: 'High'
    },
    {
      id: 'KKA-2026-003',
      auditTitle: 'Audit Penagihan Piutang (AR) & Penetapan Limit Kredit Distributor',
      department: 'Finance',
      riskId: 'RSK-002',
      findingTitle: 'Pelampauan Limit Kredit Distributor Tanpa Otorisasi Direksi & Aging Piutang Macet',
      auditor: 'Budi Santoso, Ak, CA',
      reviewer: '..........................................',
      status: 'Drafting',
      condition:
        'Terdapat 5 distributor besar di wilayah Jawa Timur yang tetap diberikan suplai barang baru meskipun piutang outstanding melebihi plafon kredit rata-rata 45% dan telah menunggak melebihi 60 hari kalender. Total saldo macet mencapai Rp 3.250.000.000.',
      criteria:
        'Credit Policy Manual FIN-CPM-02 pasal 6: Pasokan barang wajib diblokir otomatis oleh sistem ERP apabila customer memiliki invoice jatuh tempo > 30 hari atau saldo melampaui limit kredit, kecuali mendapat dispensasi tertulis dari Direktur Keuangan.',
      cause:
        '1. Parameter "Hard Credit Limit Blocking" di modul ERP dinonaktifkan oleh tim finance cabang untuk mengejar target sales bulanan.\n2. Evaluasi kesehatan finansial distributor tidak diperbarui secara tahunan.',
      effect:
        '1. Risiko kredit macet tak tertagih (Bad Debt Provision) membengkak Rp 3.250.000.000.\n2. Tekanan likuiditas kas operasional PT. Agung Putra Nirantara.',
      recommendation:
        '1. Aktifkan kembali secara permanen fitur Hard Blocking di sistem ERP dengan penguncian hak akses IT.\n2. Lakukan restrukturisasi jadwal pembayaran piutang dan sita jaminan bank garansi distributor penunggak.',
      financialExposureRp: 3250000000,
      riskLevel: 'Extreme'
    }
  ];

  const [kkaList, setKkaList] = useState(initialKKAList);
  const [selectedKKAIdx, setSelectedKKAIdx] = useState(0);
  const activeKKA = kkaList[selectedKKAIdx] || kkaList[0];
  const [formData, setFormData] = useState({ ...activeKKA });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSelect = (idx) => {
    setSelectedKKAIdx(idx);
    setFormData({ ...kkaList[idx] });
    setIsEditing(false);
  };

  const handleSave = () => {
    const updated = [...kkaList];
    updated[selectedKKAIdx] = { ...formData };
    setKkaList(updated);
    setIsEditing(false);
    setNotification('Kertas Kerja Audit (e-KKA) berhasil diperbarui dan tersimpan aman di Database Spanner!');
    setTimeout(() => setNotification(null), 3500);
    if (onSaveKKA) onSaveKKA(formData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Header e-KKA with Live Collaboration Badge */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 laser-border-cyan flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-tech tracking-wide uppercase">
              Digital Kertas Kerja Audit (e-KKA 5C Editor)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-tech">
              Standar IIA IPPF & ISO 19011
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Format terstruktur Condition, Criteria, Cause, Effect, Recommendation dengan sinkronisasi real-time antar auditor.
          </p>
        </div>

        {/* Live Collaboration Status & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-mono-tech">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Sync: 2 Auditor Aktif</span>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition"
            title="Cetak KKA ke PDF / Printer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            Print / PDF
          </button>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 transition shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Revisi
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold rounded-lg text-xs font-tech flex items-center gap-1.5 transition"
            >
              Edit KKA 5C
            </button>
          )}
        </div>
      </div>

      {/* KKA Navigation & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: KKA Findings List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-400 font-tech uppercase tracking-wider px-1">
            Daftar Temuan e-KKA Berjalan
          </div>

          {kkaList.map((k, idx) => {
            const isCur = idx === selectedKKAIdx;
            return (
              <button
                key={k.id}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isCur
                    ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-400 font-mono-tech">{k.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-tech">
                    {k.department}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {k.findingTitle}
                </h5>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono-tech">
                  <span className="text-amber-300">{formatRp(k.financialExposureRp)}</span>
                  <span className="text-slate-500">{k.status}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: 5C Document Structured Editor (8 cols) */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            {/* Meta Header */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 font-mono-tech">{formData.id}</span>
                <h3 className="text-base font-bold text-white font-tech leading-snug mt-0.5">
                  {formData.auditTitle}
                </h3>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-mono-tech">
                  <span>Auditor: <strong className="text-slate-200">{formData.auditor}</strong></span>
                  <span>Reviewer: <strong className="text-cyan-300">{formData.reviewer}</strong></span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-mono-tech">Eksposur Finansial</span>
                <span className="text-lg font-bold font-mono-tech text-amber-300">
                  {formatRp(formData.financialExposureRp)}
                </span>
              </div>
            </div>

            {/* Finding Title */}
            <div>
              <label className="text-xs font-bold text-slate-300 font-tech uppercase tracking-wider block mb-1">
                Judul Temuan Pemeriksaan
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.findingTitle}
                  onChange={(e) => setFormData({ ...formData, findingTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              ) : (
                <div className="text-sm font-bold text-white p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                  {formData.findingTitle}
                </div>
              )}
            </div>

            {/* 5C Sections */}
            <div className="space-y-3 text-xs">
              {/* 1. Condition */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-cyan-400 font-tech uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] font-mono-tech">1</span>
                    Condition (Kondisi Nyata / Fakta Lapangan)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">What is found</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono-tech"
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed font-mono-tech">{formData.condition}</p>
                )}
              </div>

              {/* 2. Criteria */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-blue-400 font-tech uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-blue-950 text-blue-400 flex items-center justify-center text-[10px] font-mono-tech">2</span>
                    Criteria (Kriteria / SOP / Regulasi Acuan)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">What should be</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.criteria}
                    onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono-tech"
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed font-mono-tech">{formData.criteria}</p>
                )}
              </div>

              {/* 3. Cause */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-400 font-tech uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-amber-950 text-amber-400 flex items-center justify-center text-[10px] font-mono-tech">3</span>
                    Cause (Akar Masalah / Root Cause)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">Why it happened</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono-tech"
                  />
                ) : (
                  <pre className="text-slate-300 font-mono-tech whitespace-pre-wrap leading-relaxed">{formData.cause}</pre>
                )}
              </div>

              {/* 4. Effect */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-rose-400 font-tech uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-rose-950 text-rose-400 flex items-center justify-center text-[10px] font-mono-tech">4</span>
                    Effect (Dampak Finansial & Operasional)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">The impact & consequence</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.effect}
                    onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono-tech"
                  />
                ) : (
                  <pre className="text-slate-300 font-mono-tech whitespace-pre-wrap leading-relaxed">{formData.effect}</pre>
                )}
              </div>

              {/* 5. Recommendation */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-emerald-400 font-tech uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px] font-mono-tech">5</span>
                    Recommendation (Rekomendasi Konstruktif)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">Management action solution</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.recommendation}
                    onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono-tech"
                  />
                ) : (
                  <pre className="text-slate-300 font-mono-tech whitespace-pre-wrap leading-relaxed">{formData.recommendation}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
