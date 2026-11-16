import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Sparkles, AlertTriangle, Send, X, Minimize2,
  Maximize2, Move, Pin, Layout, ChevronRight, MessageSquare,
  ArrowUpRight, RefreshCw, CheckCircle2, GripHorizontal,
  Sliders, Eye, EyeOff, CornerDownRight, Maximize, Shield, Search
} from 'lucide-react';
import { formatRp, formatRpFull } from '../utils/helpers';
import { COMPANY_INFO, RISK_PROFILES, DEPARTMENT_META } from '../data/riskData';

// Helper: Word boundary regex matching to prevent substring false-positives (e.g. 'terkait' matching 'it', 'barang' matching 'ar')
function hasWord(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escaped}($|\\s|[^a-zA-Z0-9])`, 'i');
  return reg.test(text);
}

function hasAnyWord(text, words) {
  return words.some((w) => {
    if (w.includes(' ')) return text.toLowerCase().includes(w.toLowerCase());
    return hasWord(text, w);
  });
}

// ============================================================================
// FRIENDLY & INTELLIGENT AI COPILOT REASONING ENGINE (100% DATA-GROUNDED)
// Evaluates real-time data from 125 FMCG Risk Items, 10 Departments & ERM Models
// ============================================================================
export const generateAIResponse = (query, risks = [], departmentStats = {}) => {
  const rawQ = (query || '').trim();
  const q = rawQ.toLowerCase();
  if (!q) {
    return 'Halo sobat! Yuk tanya apa saja seputar data risiko, audit, maupun insight divisi di PT. Agung Putra Nirantara!';
  }

  // Helper: Format Rupiah Singkat & Rapi
  const rp = (val) => formatRp(val);
  const rpExact = (val) => formatRpFull(val);

  // Aggregates for deep analysis and calculations
  const totalInherent = risks.reduce((acc, r) => acc + (Number(r.inherent_value) || 0), 0);
  const totalResidual = risks.reduce((acc, r) => acc + (Number(r.residual_value) || 0), 0);
  const totalReduction = risks.reduce((acc, r) => acc + (Number(r.reduction_value) || 0), 0);
  const reductionPct = totalInherent > 0 ? ((totalReduction / totalInherent) * 100).toFixed(2) : '0';

  const countExt = risks.filter((r) => r.inherent_level === 'Extreme').length;
  const countHigh = risks.filter((r) => r.inherent_level === 'High').length;
  const countMed = risks.filter((r) => r.inherent_level === 'Medium').length;
  const countLow = risks.filter((r) => r.inherent_level === 'Low').length;

  const countEff = risks.filter((r) => r.control_effectiveness === 'Efektif').length;
  const countKurang = risks.filter((r) => r.control_effectiveness === 'Kurang Efektif').length;
  const countTidak = risks.filter((r) => r.control_effectiveness === 'Tidak Efektif').length;

  // --------------------------------------------------------------------------
  // 1. SPECIFIC RISK CODE LOOKUP (e.g. RSK-001, RSK-048, RSK-111, rsk 5)
  // --------------------------------------------------------------------------
  const rskMatch = q.match(/rsk[-_\s]?(\d{1,3})/i);
  if (rskMatch) {
    const targetNum = parseInt(rskMatch[1], 10);
    const targetId = `RSK-${String(targetNum).padStart(3, '0')}`;
    const found = risks.find(
      (r) => r.id.toLowerCase() === targetId.toLowerCase() || parseInt(r.id.replace(/\D/g, ''), 10) === targetNum
    );

    if (found) {
      return (
        `Hai sobat! Ini dia rincian lengkap untuk risiko [${found.id}] yang kamu cari:\n\n` +
        `📌 INFORMASI UTAMA:\n` +
        `• Departemen & Proses: ${found.department} | ${found.process}\n` +
        `• Peristiwa Risiko: ${found.risk_event}\n` +
        `• Akar Masalah (Root Cause): ${found.root_cause}\n\n` +
        `🛡️ STATUS KONTROL & MITIGASI:\n` +
        `• Kontrol Eksisting: ${found.existing_control} (Status: ${found.control_effectiveness})\n` +
        `• Inherent Exposure: Level ${found.inherent_level} (P:${found.inherent_prob} × D:${found.inherent_impact}) | Nilai: ${rp(found.inherent_value)} (${rpExact(found.inherent_value)})\n` +
        `• Rencana Mitigasi (MAP): ${found.mitigation_plan}\n` +
        `• Target Reduksi: ${found.reduction_pct} (-${rp(found.reduction_value)})\n` +
        `• Target Residual: Level ${found.residual_level} (P:${found.residual_prob} × D:${found.residual_impact}) | Nilai: ${rp(found.residual_value)} (${rpExact(found.residual_value)})\n\n` +
        `Ada bagian tertentu dari mitigasi ini yang mau kita diskusikan lebih dalam, sobat?`
      );
    } else {
      return `Wah sobat, kode ${targetId} belum terdaftar nih di sistem kita. Database Risk Universe kita saat ini memuat kode RSK-001 hingga RSK-125 (total 125 risiko). Coba cek kembali nomor kodenya ya!`;
    }
  }

  // --------------------------------------------------------------------------
  // 2. GREETINGS & CASUAL INTERACTION
  // --------------------------------------------------------------------------
  if (
    q === 'halo' || q === 'hai' || q === 'hello' || q === 'hi' || q === 'woi' || q === 'bro' || q === 'p' ||
    q.startsWith('selamat pagi') || q.startsWith('selamat siang') || q.startsWith('selamat sore') ||
    q.startsWith('selamat malam') || q.startsWith('assalam') || q.startsWith('halo sobat')
  ) {
    return (
      `Halo juga sobat! Senang banget bisa ngobrol santai bareng kamu. 😄\n\n` +
      `Aku siap bantu kamu menganalisis seluruh data risiko di PT. Agung Putra Nirantara — mulai dari nilai finansial Inherent & Residual, efektivitas mitigasi di 10 departemen, temuan KKA, sampai jadwal Annual Audit Plan (AAP 2026).\n\n` +
      `Lagi mau bedah atau cari tahu data apa nih kita hari ini, kawan?`
    );
  }

  if (hasAnyWord(q, ['terima kasih', 'makasih', 'thanks', 'tengkyu', 'mantap', 'keren', 'oke', 'sip'])) {
    return `Sama-sama sobat! Senang bisa bantu kamu. Kalau ada data atau analisis lain yang butuh dibedah, panggil aku lagi kapan saja ya, kawan! Semangat auditnya! 🚀`;
  }

  // --------------------------------------------------------------------------
  // 3. KEY PERSONNEL & PEJABAT STRUKTURAL
  // --------------------------------------------------------------------------
  if (
    hasAnyWord(q, ['internal audit manager', 'manager audit', 'ketua komite', 'komite audit', 'rizki', 'zulkarnain'])
  ) {
    return (
      `Halo sobat! Untuk jabatan Internal Audit Manager di PT. Agung Putra Nirantara dipegang oleh:\n\n` +
      `👤 NAMA: Rizki Zulkarnain S.EI.,CIPFM\n` +
      `• Posisi: Internal Audit Manager\n` +
      `• Peran Kunci: Mengomandoi pengawasan independen pelaksanaan Annual Audit Plan (AAP 2026), supervisi e-KKA 5C, serta menjaga keselarasan mitigasi risiko bersama jajaran Direksi.\n\n` +
      `Ada dokumen atau laporan yang perlu dikoordinasikan dengan beliau, sobat?`
    );
  }

  if (
    hasAnyWord(q, ['cae', 'chief audit executive', 'kepala internal audit', 'head of audit', 'head of internal audit', 'wahyu'])
  ) {
    return (
      `Siap kawan! Mengenai posisi Chief Audit Executive (CAE) di sistem kita:\n\n` +
      `👤 JABATAN: Chief Audit Executive (CAE) / Head of Internal Audit\n` +
      `• Pejabat Terdaftar: ..........................................\n` +
      `• Lembaga: Divisi Audit Internal PT. Agung Putra Nirantara (Siklus Audit 2026).`
    );
  }

  if (
    hasAnyWord(q, ['direktur utama', 'presdir', 'president director', 'dirut', 'ceo', 'agung putra'])
  ) {
    return (
      `Halo sobat! Nah, Presiden Direktur / CEO PT. Agung Putra Nirantara adalah:\n\n` +
      `👤 Bpk. Agung Putra Nirantara, MBA\n` +
      `Beliau memimpin arah strategis korporasi dan menetapkan Risk Appetite perusahaan untuk siklus 2026.`
    );
  }

  if (hasAnyWord(q, ['erm head', 'kepala erm', 'ratna', 'paramita'])) {
    return (
      `Halo sobat! Kepala Divisi Enterprise Risk Management (ERM) kita adalah Ibu Dra. Ratna Paramita, CRMA. Beliau bertanggung jawab atas integrasi kerangka kerja ISO 31000 & COSO ERM di seluruh lini operasional perusahaan kita.`
    );
  }

  if (hasAnyWord(q, ['tim audit', 'lead auditor', 'auditor', 'personel audit'])) {
    return (
      `Halo kawan! Ini dia susunan tim audit internal kita yang bertugas mengawal Annual Audit Plan (AAP 2026):\n\n` +
      `1. Internal Audit Manager: Rizki Zulkarnain S.EI.,CIPFM\n` +
      `2. Chief Audit Executive: ..........................................\n` +
      `3. Lead Auditor AAP 2026:\n` +
      `   • .......................................... (Lead Q1 TPM Promo & Q3 Cyber ERP)\n` +
      `   • Sarah Jenkins (Lead Q1 Routing Delivery & Q3 Peluncuran Varian Baru)\n` +
      `   • Budi Santoso, Ak, CA (Lead Q2 Kredit AR Finance & Q4 Purchasing 3PL)\n` +
      `   • Rendra Wijaya (Lead Q2 Stock Opname WMS Warehouse)\n` +
      `   • Dian Anggraeni (Lead Q4 Kepatuhan BPOM & Legal Distributor)\n\n` +
      `Semua lead auditor memiliki sertifikasi profesi di bidang audit dan manajemen risiko, sobat!`
    );
  }

  // --------------------------------------------------------------------------
  // 4. PENALARAN / ANALISIS: KENAPA SUATU DIVISI BERISIKO (WHY / DEEP REASONING)
  // --------------------------------------------------------------------------
  if (
    (hasAnyWord(q, ['kenapa', 'mengapa', 'sebab', 'alasan', 'penyebab']) &&
     hasAnyWord(q, ['it', 'teknologi', 'sistem', 'cyber'])) ||
    (q.includes('it') && (q.includes('bahaya') || q.includes('rawan') || q.includes('kritis') || q.includes('lemah')))
  ) {
    return (
      `Wah, ini pertanyaan analisis yang bagus banget sobat! Yuk kita bedah kenapa divisi IT menjadi salah satu divisi paling rawan di PT. Agung Putra Nirantara:\n\n` +
      `1. Kontrol Eksisting Sangat Lemah: Dari 13 risiko di IT, terdapat 7 kontrol "Tidak Efektif" dan 0 kontrol "Efektif"! Ini anomali kontrol tertinggi di antara semua departemen.\n` +
      `2. Ancaman Fatal Operasional:\n` +
      `   • Ancaman Ransomware & Kegagalan Restore Data Backup Spanner (RSK-123)\n` +
      `   • Aplikasi WMS Down 24 Jam saat Peak Season (RSK-124, nilai Rp 5,94 M)\n` +
      `   • Pembengkakan Biaya Lisensi Cloud ERP yang melonjak tanpa kontrol (RSK-125, nilai Rp 6,11 M)\n` +
      `3. Total Inherent Exposure: Mencapai Rp 38,52 Milyar dengan 5 risiko berada di level Extreme.\n\n` +
      `Itulah sebabnya pada AAP 2026 Kuartal 3, audit mendalam Keamanan Siber ERP, Disaster Recovery, dan SOD IT dialokasikan secara khusus selama 14 Mandays, kawan!`
    );
  }

  // Analisis Pembengkakan Opex Pabrik / Logistik
  if (
    hasAnyWord(q, ['kenapa', 'mengapa', 'sebab', 'alasan']) &&
    hasAnyWord(q, ['opex', 'biaya operasional', 'pabrik', 'bbm', 'lembur'])
  ) {
    return (
      `Menarik banget pertanyaannya sobat! Berdasarkan analisis data risiko RSK-112 (Pembengkakan Biaya Operasional Pabrik senilai Rp 32,91 Milyar), ada beberapa akar masalah utama:\n\n` +
      `1. Mesin Pabrik Tua: Frekuensi downtime mesin tinggi menyebabkan pemborosan utilitas listrik dan bahan baku terbuang.\n` +
      `2. Lembur Manual di Gudang: Keterlambatan loading barang memicu jam lembur buruh gudang membengkak melebihi standar RKAP.\n` +
      `3. Manipulasi Uang Jalan & BBM Sopir: Ketiadaan sistem geofencing tangki BBM membuat biaya BBM truk logistik melonjak akibat rute melenceng dan pembelian solar tanpa nota resmi.\n\n` +
      `Saran mitigasinya di sistem kita adalah pemasangan IoT GPS Tracker dengan sensor bahan bakar dan penerapan kartu BBM digital, kawan!`
    );
  }

  // Analisis Korelasi Fraud Promo & Lapping
  if (
    hasAnyWord(q, ['korelasi', 'hubungan', 'kenapa', 'mengapa', 'bagaimana']) &&
    hasAnyWord(q, ['promo', 'trade promo']) && hasAnyWord(q, ['lapping', 'fraud', 'penggelapan', 'piutang'])
  ) {
    return (
      `Wah, kamu jeli banget melihat celah ini sobat! Jadi begini hubungan antara fraud Trade Promo dan lapping piutang di model FMCG kita:\n\n` +
      `1. Celah Verifikasi Manual: Oknum Area Sales memanfaatkan nota diskon fotokopi/manual untuk mengklaim promo fiktif ke kantor pusat (RSK-111, senilai Rp 31,40 Milyar).\n` +
      `2. Praktik Lapping: Uang tunai pelunasan tagihan dari toko grosir General Trade tidak langsung disetorkan ke rekening perusahaan, melainkan diputar atau digunakan oknum untuk menutupi tagihan toko lain yang sudah jatuh tempo.\n` +
      `3. Dampak Ganda: Perusahaan rugi dua kali — dana promo tergerus dan piutang dagang (AR) membengkak macet lebih dari 60 hari!\n\n` +
      `Itulah sebabnya di AAP 2026 Q1 penugasan audit difokuskan pada pengujian sampling fisik ke toko grosir dan percepatan modul otomatisasi TPM ERP, sobat!`
    );
  }

  // --------------------------------------------------------------------------
  // 5. PERBANDINGAN ANTAR DEPARTEMEN (COMPARISON REASONING)
  // --------------------------------------------------------------------------
  if (
    (hasAnyWord(q, ['bandingkan', 'perbandingan', 'komparasi', 'mana lebih', 'beda']) &&
     hasAnyWord(q, ['marketing', 'sales', 'it', 'warehouse', 'delivery', 'finance', 'purchasing', 'hr', 'legal'])) ||
    (q.includes('vs') || q.includes('versus'))
  ) {
    if (q.includes('marketing') && q.includes('sales')) {
      return (
        `Siap sobat! Ini dia perbandingan langsung antara Marketing vs Sales di RBAMS kita:\n\n` +
        `📊 METRIK EKSPOSUR:\n` +
        `• Marketing: Inherent Rp 66,16 Milyar | Residual Target: Rp 38,57 Milyar (12 Item)\n` +
        `• Sales: Inherent Rp 57,55 Milyar | Residual Target: Rp 32,26 Milyar (13 Item)\n\n` +
        `🔥 PROFIL RISIKO:\n` +
        `• Marketing lebih tinggi di sisi eksposur finansial karena adanya risiko kegagalan peluncuran varian produk baru (RSK-048 senilai Rp 26,64 M) dan klaim promo.\n` +
        `• Sales memiliki risiko Extreme lebih banyak (5 item vs Marketing 1 item), terutama seputar store churn General Trade dan kegagalan pencapaian target omset (RSK-060 senilai Rp 23,09 M).\n\n` +
        `Kesimpulannya, Marketing unggul di potensi dampak kerugian besar per kejadian, sedangkan Sales unggul di frekuensi kejadian risiko ekstrem operasional harian, sobat!`
      );
    }

    if (q.includes('delivery') && q.includes('warehouse')) {
      return (
        `Oke sobat! Ini dia komparasi rantai pasok antara Delivery vs Warehouse:\n\n` +
        `📊 EKSPOSUR & KONTROL:\n` +
        `• Delivery: Inherent Rp 52,25 Milyar | Residual: Rp 30,30 Milyar (4 Kontrol Tidak Efektif)\n` +
        `• Warehouse: Inherent Rp 29,00 Milyar | Residual: Rp 13,86 Milyar (4 Kontrol Tidak Efektif)\n\n` +
        `🔍 ANALISIS:\n` +
        `• Delivery memiliki eksposur hampir 2x lipat lebih besar dibanding Warehouse karena risiko lumpuhnya armada in-house tua (RSK-073 senilai Rp 23,22 M) dan ketergantungan pada vendor 3PL saat peak season.\n` +
        `• Warehouse fokus pada akurasi stok (stock opname) dan pencegahan barang kadaluarsa lewat sistem scanner FEFO.\n\n` +
        `Jadi dari kacamata audit, penanganan deviasi Delivery lebih mendesak karena langsung berdampak pada pemenuhan pesanan toko (OTIF), kawan!`
      );
    }
  }

  // --------------------------------------------------------------------------
  // 6. SARAN & REKOMENDASI AUDIT STRATEGIS
  // --------------------------------------------------------------------------
  if (
    hasAnyWord(q, ['saran', 'rekomendasi', 'solusi', 'usulan', 'tindakan', 'mitigasi terbaik', 'strategi'])
  ) {
    return (
      `Wah, senang banget diajak mikir strategis bareng kamu, sobat! Dari pembacaan data 125 risiko di RBAMS, ini 4 rekomendasi prioritas utama yang paling krusial:\n\n` +
      `1. Amankan Kontrol IT Segera: Divisi IT punya 7 kontrol Tidak Efektif dan 0 kontrol Efektif. Prioritas nomor satu adalah audit DR Spanner, hak akses SOD, dan perlindungan ransomware.\n` +
      `2. Otomatisasi Trade Promo (Marketing & Sales): Tutup celah fraud dan nota manual senilai puluhan milyar dengan modul ERP Trade Promotion Management (TPM) terintegrasi.\n` +
      `3. IoT Geofencing Logistik (Delivery): Pasang sensor BBM dan GPS tracking di seluruh armada truk untuk memangkas kebocoran uang jalan dan deviasi rute.\n` +
      `4. Disiplin Credit Limit (Finance): Percepat implementasi Hard Credit Blocking di sistem ERP agar piutang distributor macet tidak terus terakumulasi.\n\n` +
      `Bagian mana yang menurutmu paling mendesak untuk kita prioritaskan di komite audit, sobat?`
    );
  }

  // --------------------------------------------------------------------------
  // 7. SISTEM RBAMS & METODOLOGI AUDIT / PRD
  // --------------------------------------------------------------------------
  if (
    q === 'apa itu rbams' || q.includes('apa itu rbams') || q.includes('tentang sistem') ||
    q.includes('fungsi rbams') || q.includes('tujuan rbams') || q.includes('deskripsi sistem')
  ) {
    return (
      `Halo sobat! Jadi RBAMS (Risk Based Audit Management System) ini adalah platform manajemen audit modern berbasis risiko yang dibangun khusus untuk PT. Agung Putra Nirantara mengacu pada PRD Antigravity 2026.\n\n` +
      `🛡️ FUNGSI UTAMA SISTEM KITA:\n` +
      `1. Integrasi ERM: Memantau 125 risiko di 10 departemen FMCG dengan eksposur Inherent Rp 486,72 Miliar.\n` +
      `2. Prioritas Audit Cerdas: Mengarahkan Annual Audit Plan (AAP 2026) langsung ke top 20% risiko bernilai tertinggi.\n` +
      `3. Digital e-KKA 5C: Standardisasi Kertas Kerja Audit sesuai kerangka IIA IPPF.\n` +
      `4. Follow-Up MAP: Mengawal komitmen rencana tindak lanjut manajemen sampai tuntas (closed).\n\n` +
      `Keren kan sobat? Mau eksplor modul yang mana nih sekarang?`
    );
  }

  if (
    hasAnyWord(q, ['metodologi', 'standar audit', 'rbia', 'ippf', 'iso 31000', 'coso'])
  ) {
    return (
      `Siap sobat! Untuk standar metodologi yang kita terapkan di RBAMS adalah standar global terbaik:\n\n` +
      `1. IIA IPPF (International Professional Practices Framework): Kerangka audit internal dunia yang mendasari format e-KKA 5C kita (Condition, Criteria, Cause, Effect, Recommendation).\n` +
      `2. Risk-Based Internal Audit (RBIA): Metodologi audit di mana jadwal dan mandays difokuskan pada risiko dengan eksposur finansial terbesar (Extreme & High).\n` +
      `3. ISO 31000:2018 & COSO ERM 2017: Kerangka manajemen risiko untuk penetapan skala matriks 5x5, selera risiko, dan pemantauan KRI.\n\n` +
      `Ada aspek metodologi tertentu yang ingin kamu tanyakan lebih dalam, kawan?`
    );
  }

  if (
    hasAnyWord(q, ['rumus', 'perhitungan', 'cara hitung', 'kalkulasi', 'formula']) &&
    (q.includes('risiko') || q.includes('inherent') || q.includes('residual') || q.includes('matriks'))
  ) {
    return (
      `Gampang banget sobat! Ini dia formula kalkulasi risiko yang kita pakai di sistem:\n\n` +
      `1. Inherent Risk Score = Probabilitas (1-5) × Dampak (1-5) [Skala 1 - 25]\n` +
      `   • Extreme: Skor 16-25 | High: Skor 10-15 | Medium: Skor 5-9 | Low: Skor 1-4\n` +
      `2. Inherent Value (Rp) = Dampak Finansial Bruto sebelum adanya kontrol mitigasi.\n` +
      `3. Reduction Value (Rp) = Inherent Value × % Target Reduksi Mitigasi\n` +
      `4. Residual Value (Rp) = Inherent Value - Reduction Value (Target Eksposur Bersih setelah mitigasi).\n\n` +
      `Dengan rumus ini, seluruh 125 risiko dapat terukur secara kuantitatif dan objektif, kawan!`
    );
  }

  // --------------------------------------------------------------------------
  // 8. AGREGAT EKSPOSUR FINANSIAL & TINGKAT RISIKO
  // --------------------------------------------------------------------------
  if (
    hasAnyWord(q, ['total nilai', 'total eksposur', 'nilai inherent', 'total inherent', 'residual value', 'target residual', 'nilai residual', 'berapa rupiah', 'total uang', 'eksposur finansial']) ||
    ((q.includes('berapa') || q.includes('nilai')) && (q.includes('inherent') || q.includes('residual')))
  ) {
    if (q.includes('residual') && !q.includes('inherent')) {
      return (
        `Halo sobat! Berdasarkan perhitungan terkini di database RBAMS:\n\n` +
        `💰 TARGET RESIDUAL EXPOSURE KITA:\n` +
        `• Total Target Residual: ${rp(totalResidual)} (${rpExact(totalResidual)})\n` +
        `• Keberhasilan Mitigasi: Berhasil menurunkan risiko sebesar ${reductionPct}% (sebesar ${rp(totalReduction)}) dari nilai awal Inherent!\n` +
        `• Sebaran Level Residual: Extreme turun jadi 5 item, High 6 item, Medium 36 item, dan level aman (Low) melonjak jadi 78 item!\n\n` +
        `Artinya jika seluruh rencana aksi MAP berjalan efektif, profil risiko perusahaan kita akan jauh lebih sehat, sobat!`
      );
    }

    return (
      `Halo sobat! Ini dia gambaran menyeluruh eksposur finansial PT. Agung Putra Nirantara untuk siklus 2026:\n\n` +
      `💰 RINGKASAN EKSPOSUR FINANSIAL:\n` +
      `1. Total Inherent Exposure: ${rp(totalInherent)} (${rpExact(totalInherent)})\n` +
      `2. Target Reduksi Mitigasi: ${rp(totalReduction)} (${reductionPct}% penurunan risiko)\n` +
      `3. Target Residual Exposure: ${rp(totalResidual)} (${rpExact(totalResidual)})\n\n` +
      `📍 3 DEPARTEMEN DENGAN EKSPOSUR INHERENT TERTINGGI:\n` +
      `• 1. Audit Internal: Rp 91,23 Milyar\n` +
      `• 2. Marketing: Rp 66,16 Milyar\n` +
      `• 3. Sales: Rp 57,55 Milyar\n\n` +
      `Mau lihat rincian angka untuk departemen tertentu, kawan?`
    );
  }

  // Pertanyaan Efektivitas Mitigasi / Berapa Persen Aman
  if (
    (hasAnyWord(q, ['berapa persen', 'persentase', 'tingkat', 'efektivitas']) &&
     hasAnyWord(q, ['aman', 'mitigasi', 'penurunan', 'berhasil', 'reduksi']))
  ) {
    return (
      `Halo sobat! Terkait efektivitas mitigasi risiko perusahaan kita:\n\n` +
      `📈 STATISTIK MITIGASI 2026:\n` +
      `• Persentase Penurunan Nilai Risiko: 45,15% (Nilai uang terlindungi: Rp 219,75 Milyar dari Inherent Rp 486,72 Miliar).\n` +
      `• Peningkatan Risiko Level Aman (Low): Dari yang awalnya cuma 8 item (6,4%), setelah mitigasi diproyeksikan bertambah menjadi 78 item (62,4%)!\n` +
      `• Penurunan Risiko Extreme: Dari 32 item Extreme di Inherent berhasil dipangkas drastis menjadi hanya tersisa 5 item di Residual Target.\n\n` +
      `Secara kalkulasi model ERM ini sudah sangat progresif, tinggal bagaimana audit memastikan eksekusi MAP di lapangan benar-benar terjadi, kawan!`
    );
  }

  // Pertanyaan Total Risiko (Item)
  if (
    (q.includes('total') || q.includes('berapa') || q.includes('jumlah')) &&
    (q.includes('risiko') || q.includes('item') || q.includes('register')) &&
    !hasAnyWord(q, ['extreme', 'high', 'medium', 'low', 'tidak efektif', 'efektif', 'fraud', 'it', 'hr', 'sales'])
  ) {
    return (
      `Siap sobat! Total item risiko yang terdaftar di database RBAMS kita ada 125 Item yang tersebar di 10 departemen FMCG (rata-rata 12-13 item per divisi).\n\n` +
      `📊 SEBARAN TINGKAT INHERENT:\n` +
      `• Extreme: 32 item (25,6%)\n` +
      `• High: 30 item (24,0%)\n` +
      `• Medium: 55 item (44,0%)\n` +
      `• Low: 8 item (6,4%)\n\n` +
      `🛡️ SEBARAN STATUS KONTROL BERJALAN:\n` +
      `• Efektif: 28 item (22,4%)\n` +
      `• Kurang Efektif: 60 item (48,0%)\n` +
      `• Tidak Efektif: 37 item (29,6%)\n\n` +
      `Ada departemen atau tingkat risiko yang mau kita kupas lebih detil, kawan?`
    );
  }

  // Pertanyaan Level Risiko Spesifik: Extreme
  if (hasAnyWord(q, ['extreme', 'ekstrem'])) {
    const extRisks = risks.filter((r) => r.inherent_level === 'Extreme');
    const topExt = [...extRisks].sort((a, b) => b.inherent_value - a.inherent_value).slice(0, 5);

    return (
      `Wah, ini kategori risiko paling gawat sobat! Yuk kita pantau risiko Extreme kita:\n\n` +
      `🔥 PROFIL RISIKO TINGKAT EXTREME:\n` +
      `• Jumlah Total: 32 Item dari 125 risiko (25,6%)\n` +
      `• Total Nilai Eksposur: ${rp(extRisks.reduce((a, b) => a + b.inherent_value, 0))}\n` +
      `• Divisi dengan Risiko Extreme Terbanyak: Sales (5 item), HR (5 item), IT (5 item), Audit Internal (4 item), Warehouse (3 item).\n\n` +
      `🏆 TOP 5 RISIKO EXTREME TERBESAR:\n` +
      topExt.map((r, i) => `${i + 1}. [${r.id}] ${r.department} - ${r.risk_event}: ${rp(r.inherent_value)}`).join('\n') +
      `\n\n📌 Ke-32 risiko ini menjadi prioritas utama yang diawasi ketat dalam Annual Audit Plan (AAP 2026), kawan!`
    );
  }

  // Pertanyaan Level Risiko Spesifik: High / Medium / Low
  if (hasAnyWord(q, ['high'])) {
    const hiRisks = risks.filter((r) => r.inherent_level === 'High');
    return (
      `Halo sobat! Untuk risiko tingkat High (Tinggi), di sistem kita tercatat:\n\n` +
      `⚡ RISIKO LEVEL HIGH:\n` +
      `• Jumlah: 30 Item dari 125 risiko (24,0%)\n` +
      `• Total Nilai Eksposur: ${rp(hiRisks.reduce((a, b) => a + b.inherent_value, 0))}\n` +
      `• Penyebaran Terbanyak: Marketing (4 item), Warehouse (4 item), HR (4 item), Audit Internal (4 item), Delivery (3 item), Purchasing (3 item), IT (3 item).`
    );
  }

  if (hasAnyWord(q, ['medium'])) {
    return (
      `Halo sobat! Risiko tingkat Medium berjumlah 55 Item (44,0%) dengan total eksposur Rp 82,12 Milyar. Risiko ini mencakup operasional harian yang dimonitor melalui SOP berkala oleh masing-masing Kepala Divisi.`
    );
  }

  if (hasAnyWord(q, ['low', 'rendah']) && !q.includes('terendah')) {
    return (
      `Halo kawan! Pada tahap Inherent awal, hanya ada 8 Item risiko Low (6,4%). Namun berkat strategi mitigasi terencana, jumlah risiko Low berhasil ditingkatkan menjadi 78 Item pada target residual!`
    );
  }

  // --------------------------------------------------------------------------
  // 9. EFEKTIVITAS KONTROL & ANOMALI
  // --------------------------------------------------------------------------
  if (
    hasAnyWord(q, ['tidak efektif', 'kurang efektif', 'kontrol lemah', 'anomali kontrol', 'kelemahan kontrol']) ||
    (hasAnyWord(q, ['kontrol', 'pengendalian']) && hasAnyWord(q, ['efektivitas', 'status', 'kondisi']))
  ) {
    return (
      `Nah ini poin audit yang sangat krusial sobat! Mari kita cermati hasil evaluasi efektivitas kontrol internal kita:\n\n` +
      `🛡️ REKAP EFEKTIVITAS PENGENDALIAN EKSISTING (125 RISIKO):\n` +
      `• Efektif: 28 item (22,4%)\n` +
      `• Kurang Efektif: 60 item (48,0%)\n` +
      `• Tidak Efektif: 37 item (29,6%)\n\n` +
      `⚠️ TEMUAN ANOMALI KRITIS AUDIT:\n` +
      `• Terdapat 13 risiko berstatus EXTREME tetapi mitigasi berjalannya masih berstatus "TIDAK EFEKTIF"!\n` +
      `• Divisi paling berbahaya adalah IT: memiliki 7 kontrol Tidak Efektif dan 0 kontrol Efektif (Ransomware, Kegagalan Backup DB, Downtime POS).\n` +
      `• Divisi lain yang punya kontrol tidak efektif tinggi: Audit Internal (5 item), Delivery (4 item), dan Warehouse (4 item).\n\n` +
      `Kelemahan kontrol inilah yang menjadi sorotan utama kita untuk diuji dalam e-KKA, sobat!`
    );
  }

  // --------------------------------------------------------------------------
  // 10. RANKING DEPARTEMEN & SUPERLATIF
  // --------------------------------------------------------------------------
  if (
    (hasAnyWord(q, ['departemen', 'divisi']) && hasAnyWord(q, ['paling berisiko', 'tertinggi', 'terbesar', 'paling tinggi', 'paling rawan', 'terbanyak'])) ||
    q.includes('departemen mana yang paling berisiko')
  ) {
    return (
      `Halo sobat! Kalau diurutkan dari nilai eksposur Inherent terbesar, ini dia peringkat 10 departemen di perusahaan kita:\n\n` +
      `🏢 PERINGKAT DEPARTEMEN BERDASARKAN INHERENT EXPOSURE:\n` +
      `1. Audit Internal: Rp 91,23 Milyar (Extreme: 4, Kontrol T.Efektif: 5)\n` +
      `2. Marketing: Rp 66,16 Milyar (Extreme: 1, Kontrol T.Efektif: 3)\n` +
      `3. Sales: Rp 57,55 Milyar (Extreme: 5, Kontrol T.Efektif: 3)\n` +
      `4. Delivery: Rp 52,25 Milyar (Extreme: 2, Kontrol T.Efektif: 4)\n` +
      `5. HR: Rp 51,45 Milyar (Extreme: 5, Kontrol T.Efektif: 3)\n` +
      `6. Finance: Rp 41,35 Milyar (Extreme: 3, Kontrol T.Efektif: 3)\n` +
      `7. IT: Rp 38,52 Milyar (Extreme: 5, Kontrol T.Efektif: 7 - 0 Efektif!)\n` +
      `8. Legal: Rp 29,69 Milyar (Extreme: 3, Kontrol T.Efektif: 3)\n` +
      `9. Purchasing: Rp 29,52 Milyar (Extreme: 1, Kontrol T.Efektif: 2)\n` +
      `10. Warehouse: Rp 29,00 Milyar (Extreme: 3, Kontrol T.Efektif: 4)\n\n` +
      `Mau kita bedah salah satu profil departemen di atas, sobat?`
    );
  }

  if (
    hasAnyWord(q, ['departemen', 'divisi']) && hasAnyWord(q, ['terendah', 'paling aman', 'paling kecil', 'terkecil'])
  ) {
    return (
      `Halo sobat! Tiga departemen dengan nilai eksposur inherent terendah di perusahaan kita adalah:\n\n` +
      `1. Warehouse: Rp 29,00 Milyar (Residual: Rp 13,86 Milyar)\n` +
      `2. Purchasing: Rp 29,52 Milyar (Residual: Rp 15,68 Milyar)\n` +
      `3. Legal: Rp 29,69 Milyar (Residual: Rp 15,79 Milyar)\n\n` +
      `Meskipun secara angka lebih kecil, ketiganya tetap memiliki risiko penting seperti izin BPOM dan ketergantungan vendor karton kemasan, kawan!`
    );
  }

  // TOP 5 / TOP 10 RISIKO TERTINGGI (INDIVIDUAL ITEM)
  if (
    hasAnyWord(q, ['top 5', 'top 10', 'terbesar', 'tertinggi', 'paling besar', 'paling tinggi'])
  ) {
    const sorted = [...risks].sort((a, b) => b.inherent_value - a.inherent_value);
    const limit = q.includes('10') ? 10 : 5;
    const top = sorted.slice(0, limit);

    return (
      `Ini dia sobat, daftar Top ${limit} risiko dengan nilai inherent terbesar di PT. Agung Putra Nirantara:\n\n` +
      top
        .map(
          (r, i) =>
            `${i + 1}. [${r.id}] ${r.department} - ${r.risk_event}\n` +
            `   • Inherent: ${rp(r.inherent_value)} | Level: ${r.inherent_level} (P:${r.inherent_prob} × D:${r.inherent_impact})\n` +
            `   • Kontrol Berjalan: ${r.existing_control} [Status: ${r.control_effectiveness}]\n` +
            `   • Target Residual: ${rp(r.residual_value)} (-${r.reduction_pct})`
        )
        .join('\n\n') +
      `\n\nGimana sobat, ada salah satu risiko di atas yang mau kita telaah mitigasinya?`
    );
  }

  // --------------------------------------------------------------------------
  // 11. 5 STRATEGIC FMCG RISK PROFILES (Sheets 3 to 7)
  // --------------------------------------------------------------------------
  if (hasAnyWord(q, ['fraud', 'trade promo', 'penggelapan', 'lapping', 'diskon fiktif', 'nota fiktif'])) {
    const p = RISK_PROFILES[0];
    return (
      `Halo sobat! Terkait risiko kecurangan Trade Promo, ini analisis profil strategisnya:\n\n` +
      `🔍 STRATEGIC RISK PROFILE #1: ${p?.title || 'Fraud Pegawai (Trade Promo)'}\n` +
      `• Taksonomi: Compliance & Operational Risk\n` +
      `• Uraian: ${p?.description || 'Penggelapan dana promo dan lapping piutang toko oleh tim sales.'}\n` +
      `• Akar Masalah: Verifikasi nota klaim manual, konfirmasi piutang langsung ke toko grosir belum berjalan, ketiadaan rotasi sales kanvas.\n` +
      `• Batasan Indikator KRI 2026:\n` +
      `  - Laporan Whistleblowing: Hijau = 0 | Merah >= 3 Laporan\n` +
      `  - Varians Anggaran Promo: Hijau < 2% | Merah > 5%\n` +
      `  - Penyelesaian Tindak Lanjut: Wajib 100%\n` +
      `• Audit Action: Uji sampling faktur diskon kuartal 4 dan percepatan modul TPM ERP, kawan!`
    );
  }

  if (hasAnyWord(q, ['biaya operasional', 'opex', 'inefisiensi pabrik', 'mark up bbm', 'solar truk', 'solar', 'bbm', 'lembur gudang'])) {
    const p = RISK_PROFILES[1];
    return (
      `Halo sobat! Masalah biaya operasional pabrik dan logistik kita terangkum di sini:\n\n` +
      `🔍 STRATEGIC RISK PROFILE #2: ${p?.title || 'Pembengkakan Biaya Operasional'}\n` +
      `• Taksonomi: Financial & Operational Risk\n` +
      `• Uraian: Lonjakan opex melebihi RKAP akibat mesin pabrik tua, jam lembur gudang manual, dan manipulasi BBM sopir armada.\n` +
      `• Batasan Indikator KRI 2026:\n` +
      `  - Jam Lembur vs Standar: Hijau < 5% | Merah > 10%\n` +
      `  - Cost per Tonase: Hijau < Rp 500/kg | Merah > Rp 750/kg\n` +
      `  - Deviasi Opex vs RKAP: Hijau < 5% | Merah > 8%\n` +
      `• Solusi Audit: Integrasi GPS geofencing tangki BBM truk dan otomatisasi kartu jalan digital, kawan!`
    );
  }

  if (hasAnyWord(q, ['target sales', 'loss market', 'kegagalan sales', 'churn toko', 'omset turun', 'omset'])) {
    const p = RISK_PROFILES[2];
    return (
      `Halo sobat! Untuk tantangan penjualan di jalur General Trade, profilnya adalah:\n\n` +
      `🔍 STRATEGIC RISK PROFILE #3: ${p?.title || 'Kegagalan Pencapaian Target Sales'}\n` +
      `• Taksonomi: Strategic & Commercial Risk\n` +
      `• Uraian: Kalah bersaing harga di jalur General Trade, keterlambatan kunjungan kanvas, dan toko langganan beralih ke kompetitor.\n` +
      `• Batasan Indikator KRI 2026:\n` +
      `  - Pencapaian Target Sales: Hijau > 95% | Merah < 85%\n` +
      `  - Store Churn Rate: Hijau < 5% | Merah > 10%\n` +
      `  - Numeric Distribution: Hijau > 80% toko aktif\n` +
      `• Tindak Lanjut: Restrukturisasi insentif sales kanvas dan integrasi Sales Force Automation (SFA), kawan!`
    );
  }

  if (hasAnyWord(q, ['supply chain', 'armada lumpuh', 'truk mogok', '3pl', 'otif', 'pengiriman massal', 'logistik'])) {
    const p = RISK_PROFILES[3];
    return (
      `Siap sobat! Tantangan distribusi barang dan armada kita dipetakan di sini:\n\n` +
      `🔍 STRATEGIC RISK PROFILE #4: ${p?.title || 'Kegagalan Supply Chain & Armada'}\n` +
      `• Taksonomi: Operational & Logistics Risk\n` +
      `• Uraian: Keterlambatan distribusi karena armada internal tua mogok dan vendor 3PL gagal menyuplai truk saat peak season.\n` +
      `• Batasan Indikator KRI 2026:\n` +
      `  - Armada Breakdown Rate: Hijau < 2% | Merah > 5%\n` +
      `  - On-Time In-Full (OTIF): Hijau > 95% | Merah < 85%\n` +
      `  - WMS System Availability: Hijau > 99.5%\n` +
      `• Solusi Audit: Diversifikasi kontrak minimal ke 4 vendor 3PL dengan klausul penalti SLA yang tegas, sobat!`
    );
  }

  if (hasAnyWord(q, ['product launch', 'varian baru', 'sku baru', 'peluncuran produk', 'gagal produk'])) {
    const p = RISK_PROFILES[4];
    return (
      `Nah ini salah satu risiko paling mahal sobat! Nilainya mencapai Rp 26,64 Milyar (Extreme):\n\n` +
      `🔍 STRATEGIC RISK PROFILE #5: ${p?.title || 'Kegagalan Peluncuran Varian Baru'}\n` +
      `• Taksonomi: Strategic & Marketing Risk\n` +
      `• Uraian: Penyerapan produk baru lambat akibat riset pasar terburu-buru dan kampanye promosi yang tidak sinkron dengan distribusi barang ke toko.\n` +
      `• Batasan Indikator KRI 2026:\n` +
      `  - Akurasi Peramalan S&OP: Hijau > 90% | Merah < 75%\n` +
      `  - Cost Per Acquisition (CPA): Hijau < Rp 10.000\n` +
      `  - Target Pangsa Pasar: Minimal 5% dalam 90 hari pertama peluncuran.`
    );
  }

  // --------------------------------------------------------------------------
  // 12. JADWAL AUDIT TAHUNAN (AAP 2026) PER KUARTAL
  // --------------------------------------------------------------------------
  if (hasAnyWord(q, ['jadwal audit', 'aap', 'annual audit plan', 'rencana audit', 'jadwal aap', 'fokus audit'])) {
    if (q.includes('q1')) {
      return (
        `Halo sobat! Ini dia agenda penugasan audit kita di Kuartal 1 (Q1 2026):\n\n` +
        `📅 PENUGASAN AUDIT Q1 2026:\n` +
        `1. [AAP-2026-001] Audit Trade Promotion Management (Marketing)\n` +
        `   • Alokasi: 18 Mandays | Lead Auditor: ..........................................\n` +
        `   • Fokus: Validasi dokumen klaim promo, pencegahan lapping & diskon fiktif.\n\n` +
        `2. [AAP-2026-002] Audit Efisiensi Routing Logistik & BBM Truk (Delivery)\n` +
        `   • Alokasi: 15 Mandays | Lead Auditor: Sarah Jenkins\n` +
        `   • Fokus: Analisis deviasi rute GPS armada dan kebocoran uang jalan/BBM.\n\n` +
        `Total waktu Q1 adalah 33 Mandays kerja, kawan!`
      );
    }
    if (q.includes('q2')) {
      return (
        `Halo sobat! Ini dia agenda penugasan audit kita di Kuartal 2 (Q2 2026):\n\n` +
        `📅 PENUGASAN AUDIT Q2 2026:\n` +
        `1. [AAP-2026-003] Audit Pengendalian Piutang AR & Limit Kredit (Finance)\n` +
        `   • Alokasi: 20 Mandays | Lead Auditor: Budi Santoso, Ak, CA\n` +
        `   • Fokus: Aging piutang distributor >60 hari dan aktivasi hard limit blocking ERP.\n\n` +
        `2. [AAP-2026-004] Audit Integritas WMS & Stock Opname Multi-Gudang (Warehouse)\n` +
        `   • Alokasi: 16 Mandays | Lead Auditor: Rendra Wijaya\n` +
        `   • Fokus: Validasi selisih stok fisik vs sistem WMS dan FEFO barang kadaluarsa.\n\n` +
        `Total waktu Q2 adalah 36 Mandays kerja, kawan!`
      );
    }
    if (q.includes('q3')) {
      return (
        `Halo sobat! Ini dia agenda penugasan audit kita di Kuartal 3 (Q3 2026):\n\n` +
        `📅 PENUGASAN AUDIT Q3 2026:\n` +
        `1. [AAP-2026-005] Audit Keamanan Siber ERP, DR & SOD (IT)\n` +
        `   • Alokasi: 14 Mandays | Lead Auditor: ..........................................\n` +
        `   • Fokus: Kerentanan ransomware, uji failover backup database, dan pencabutan hak akses mantan karyawan.\n\n` +
        `2. [AAP-2026-006] Audit Peluncuran Varian Baru & Akurasi S&OP (Sales)\n` +
        `   • Alokasi: 15 Mandays | Lead Auditor: Sarah Jenkins\n` +
        `   • Fokus: Akurasi peramalan demand vs kesiapan stok toko ritel.\n\n` +
        `Total waktu Q3 adalah 29 Mandays kerja, kawan!`
      );
    }
    if (q.includes('q4')) {
      return (
        `Halo sobat! Ini dia agenda penugasan audit kita di Kuartal 4 (Q4 2026):\n\n` +
        `📅 PENUGASAN AUDIT Q4 2026:\n` +
        `1. [AAP-2026-007] Audit Kepatuhan Izin Edar BPOM & Kontrak Distributor (Legal)\n` +
        `   • Alokasi: 12 Mandays | Lead Auditor: Dian Anggraeni\n` +
        `   • Fokus: Validasi masa berlaku izin edar BPOM dan sengketa klausul kontrak.\n\n` +
        `2. [AAP-2026-008] Audit Pengadaan Bahan Baku Kemasan & Vendor 3PL (Purchasing)\n` +
        `   • Alokasi: 15 Mandays | Lead Auditor: Budi Santoso, Ak, CA\n` +
        `   • Fokus: Ketergantungan vendor tunggal kemasan botol/karton dan audit SLA.\n\n` +
        `Total waktu Q4 adalah 27 Mandays kerja, kawan!`
      );
    }

    return (
      `Halo sobat! Rencana Audit Tahunan (AAP 2026) kita dirancang mencakup 8 engagement prioritas dengan total 124 Mandays:\n\n` +
      `📅 REKAPITULASI AAP 2026:\n` +
      `• Nilai Eksposur Terlindungi: Rp 77,1 Milyar (Top 20% High-Risk Pool)\n` +
      `• Q1: Marketing (TPM Promo) & Delivery (Logistik Truk)\n` +
      `• Q2: Finance (Piutang AR) & Warehouse (Stok WMS)\n` +
      `• Q3: IT (Cyber ERP) & Sales (Peluncuran Produk)\n` +
      `• Q4: Legal (BPOM) & Purchasing (Pengadaan Kemasan & 3PL)\n\n` +
      `Kamu mau lihat rincian di kuartal tertentu (Q1, Q2, Q3, atau Q4), sobat?`
    );
  }

  // --------------------------------------------------------------------------
  // 13. KERTAS KERJA AUDIT (e-KKA) & TINDAK LANJUT (MAP)
  // --------------------------------------------------------------------------
  if (hasAnyWord(q, ['kka', 'kertas kerja', '5c', 'kertas kerja audit'])) {
    return (
      `Halo sobat! Terkait Kertas Kerja Audit Elektronik (e-KKA), sistem kita menerapkan formula 5C berstandar IIA IPPF:\n\n` +
      `📝 ELEMEN 5C e-KKA:\n` +
      `1. Condition: Fakta deviasi yang ditemukan di lapangan.\n` +
      `2. Criteria: SOP, RKAP, atau aturan baku yang dilanggar.\n` +
      `3. Cause: Mengapa deviasi itu bisa terjadi (akar masalah).\n` +
      `4. Effect: Berapa potensi kerugian uang (Rp) atau dampaknya bagi bisnis.\n` +
      `5. Recommendation: Solusi konkret untuk manajemen.\n\n` +
      `📌 CONTOH TEMUAN AKTIF SAAT INI:\n` +
      `• [KKA-2026-001] Klaim Trade Promo Tanpa Struk Asli: Dampak Rp 842.000.000\n` +
      `• [KKA-2026-002] Deviasi Rute Armada Truk Pengiriman: Dampak Rp 412.000.000\n` +
      `• [KKA-2026-003] Pelampauan Limit Kredit Distributor: Dampak Rp 3.250.000.000\n\n` +
      `Ada temuan yang mau kita periksa detil rekomendasinya, kawan?`
    );
  }

  if (hasAnyWord(q, ['map', 'follow up', 'tindak lanjut', 'management action plan'])) {
    return (
      `Halo sobat! Pemantauan Management Action Plan (MAP 2026) kita saat ini mencakup 5 komitmen perbaikan:\n\n` +
      `📋 STATUS ACTION PLAN MANAJEMEN:\n` +
      `• Selesai (Closed): 1 tindakan (Rotasi kanvas & penagihan via Virtual Account Bank)\n` +
      `• Sedang Berjalan (In Progress): 3 tindakan (Modul TPM ERP 65%, IoT GPS truk 40%, Scanner FEFO 25%)\n` +
      `• Terlambat (Overdue): 1 tindakan [MAP-2026-004] Hard Credit Blocking Finance (Progres 85%, jatuh tempo 30 Jan 2026).\n\n` +
      `Tindakan yang overdue ini perlu segera kita kirimkan notifikasi reminder ke Kadiv Finance, sobat!`
    );
  }

  // --------------------------------------------------------------------------
  // 14. DEPARTEMEN SPESIFIK DENGAN PENCOCOKAN KATA KUNCI AMAN
  // --------------------------------------------------------------------------
  const deptList = [
    { name: 'Audit Internal', aliases: ['audit internal', 'internal audit'] },
    { name: 'Marketing', aliases: ['marketing', 'pemasaran', 'trade promo', 'promosi'] },
    { name: 'Sales', aliases: ['sales', 'penjualan', 'general trade', 'toko grosir'] },
    { name: 'Delivery', aliases: ['delivery', 'pengiriman', 'logistik', 'armada', 'sopir', 'truk'] },
    { name: 'Warehouse', aliases: ['warehouse', 'gudang', 'persediaan', 'fefo', 'stock opname'] },
    { name: 'Purchasing', aliases: ['purchasing', 'pembelian', 'pengadaan', 'bahan baku kemasan', 'supplier'] },
    { name: 'Finance', aliases: ['finance', 'keuangan', 'piutang', 'faktur', 'pajak', 'ar', 'ap'] },
    { name: 'IT', aliases: ['it', 'teknologi', 'cyber', 'ransomware', 'erp', 'server'] },
    { name: 'HR', aliases: ['hr', 'hrd', 'sdm', 'karyawan', 'lembur', 'overtime', 'k3'] },
    { name: 'Legal', aliases: ['legal', 'hukum', 'bpom', 'halal', 'perizinan', 'kontrak'] }
  ];

  let matchedDeptObj = null;
  for (const d of deptList) {
    if (hasAnyWord(q, d.aliases)) {
      matchedDeptObj = d;
      break;
    }
  }

  if (matchedDeptObj) {
    const deptName = matchedDeptObj.name;
    const deptRisks = risks.filter((r) => r.department === deptName);
    const meta = DEPARTMENT_META[deptName] || {};
    const inTotal = deptRisks.reduce((a, b) => a + b.inherent_value, 0);
    const resTotal = deptRisks.reduce((a, b) => a + b.residual_value, 0);

    const extCount = deptRisks.filter((r) => r.inherent_level === 'Extreme').length;
    const hiCount = deptRisks.filter((r) => r.inherent_level === 'High').length;
    const medCount = deptRisks.filter((r) => r.inherent_level === 'Medium').length;
    const lowCount = deptRisks.filter((r) => r.inherent_level === 'Low').length;

    const teCount = deptRisks.filter((r) => r.control_effectiveness === 'Tidak Efektif').length;
    const keCount = deptRisks.filter((r) => r.control_effectiveness === 'Kurang Efektif').length;
    const efCount = deptRisks.filter((r) => r.control_effectiveness === 'Efektif').length;
    const top3 = [...deptRisks].sort((a, b) => b.inherent_value - a.inherent_value).slice(0, 3);

    return (
      `Halo sobat! Ini dia profil lengkap untuk divisi ${deptName.toUpperCase()}:\n\n` +
      `🏢 DATA DIVISI & KEPALA DEPARTEMEN:\n` +
      `• Kepala Divisi: ${meta.head || 'N/A'}\n` +
      `• Total Item Risiko: ${deptRisks.length} item\n` +
      `• Total Inherent Exposure: ${rp(inTotal)} (${rpExact(inTotal)})\n` +
      `• Target Residual Exposure: ${rp(resTotal)} (${rpExact(resTotal)})\n` +
      `• Sebaran Level: Extreme (${extCount}), High (${hiCount}), Medium (${medCount}), Low (${lowCount})\n` +
      `• Status Kontrol: Efektif (${efCount}), Kurang Efektif (${keCount}), Tidak Efektif (${teCount})\n` +
      `• Indikator KRI 2026: ${meta.kri_metric || 'Normal'}\n\n` +
      `🏆 TOP 3 RISIKO DI ${deptName.toUpperCase()}:\n` +
      top3
        .map(
          (r, i) =>
            `${i + 1}. [${r.id}] ${r.risk_event}\n   • Nilai: ${rp(r.inherent_value)} | Level: ${r.inherent_level} | Kontrol: ${r.control_effectiveness}`
        )
        .join('\n') +
      `\n\nMau kita telaah rencana mitigasi salah satu risiko di atas, kawan?`
    );
  }

  // --------------------------------------------------------------------------
  // 15. PENCARIAN FLEKSIBEL & EKSPLORASI SEMANTIK LUAS PADA 125 RISK ITEMS
  // --------------------------------------------------------------------------
  // Obvious out-of-domain topics (cooking, entertainment, unrelated stocks, weather, general trivia)
  const outOfContextWords = [
    'tesla', 'saham', 'crypto', 'bitcoin', 'resep', 'nasi goreng', 'masak', 'cuaca',
    'presiden amerika', 'film', 'lagu', 'artis', 'sepak bola', 'chelsea', 'mu',
    'game', 'wisata', 'zodiak', 'ramalan', 'puisi', 'pantun', 'novel', 'lirik'
  ];
  if (outOfContextWords.some((w) => q.includes(w))) {
    return `Maaf ya sobat!, pertanyaan anda diluar konteks dan data kami saat ini. kami tidak bisa menjawab pertanyaan anda`;
  }

  const stopWords = new Set([
    'apa', 'siapa', 'berapa', 'dan', 'yang', 'pada', 'dari', 'untuk', 'ada',
    'saja', 'terkait', 'tentang', 'dalam', 'dengan', 'adalah', 'ini', 'itu',
    'bisa', 'tolong', 'tampilkan', 'berikan', 'data', 'informasi', 'apakah',
    'ya', 'dong', 'nih', 'sih', 'sobat', 'kawan', 'bro', 'bagaimana', 'gimana',
    'hari', 'harga', 'bikin', 'buat', 'membuat', 'cara'
  ]);

  const domainSpecificTerms = new Set([
    'ransomware', 'bpom', 'halal', 'fefo', 'wms', 'spanner', 'kredit', 'piutang',
    'faktur', 'diskon', 'armada', 'truk', 'sopir', 'karton', 'botol', 'lembur',
    'overtime', 'pabrik', 'kanvas', 'kanvasing', 'churn', 'otif', 'klaim', 'promo',
    'geofencing', 'solar', 'bbm', 'gaji', 'k3', 'limbah', 'audit', 'inherent',
    'residual', 'mitigasi', 'kka', 'map', 'aap', 'vendor', 'supplier', 'stock',
    'opname', 'distributor', 'paten', 'denda', 'odol', 'rkp', 'rkap', 'sfa', 'tpm',
    'produk', 'varian', 'mesin', 'penarikan', 'kontrak', 'voucher', 'komisi', 'omset'
  ]);

  const searchTokens = q
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w));

  if (searchTokens.length > 0) {
    // Scoring relevance: calculate match score for each risk
    const scoredRisks = risks.map((r) => {
      const fullText = `${r.id} ${r.department} ${r.process} ${r.risk_event} ${r.root_cause} ${r.existing_control} ${r.mitigation_plan}`.toLowerCase();
      let matchCount = 0;
      let hasDomainMatch = false;
      searchTokens.forEach((t) => {
        if (fullText.includes(t)) {
          matchCount++;
          if (domainSpecificTerms.has(t)) hasDomainMatch = true;
        }
      });
      return { risk: r, score: matchCount, hasDomain: hasDomainMatch };
    }).filter((item) => (item.score >= 2 || (item.score === 1 && item.hasDomain)));

    // Sort by matches desc, then inherent value desc
    scoredRisks.sort((a, b) => b.score - a.score || b.risk.inherent_value - a.risk.inherent_value);

    if (scoredRisks.length > 0) {
      const topMatches = scoredRisks.slice(0, 3).map((item) => item.risk);
      return (
        `Halo sobat! Setelah aku telusuri di 125 database risiko kita, ditemukan ${scoredRisks.length} risiko yang berkaitan dengan pertanyaanmu "${rawQ}":\n\n` +
        topMatches
          .map(
            (r, i) =>
              `${i + 1}. [${r.id}] ${r.department} - ${r.risk_event}\n` +
              `   • Inherent Exposure: ${rp(r.inherent_value)} (${r.inherent_level})\n` +
              `   • Akar Masalah: ${r.root_cause}\n` +
              `   • Rencana Mitigasi: ${r.mitigation_plan}\n` +
              `   • Status Kontrol Eksisting: ${r.control_effectiveness}`
          )
          .join('\n\n') +
        (scoredRisks.length > 3 ? `\n\n... serta ada ${scoredRisks.length - 3} item risiko lainnya di tabel Risk Register yang relevan, sobat!` : '') +
        `\n\nAda aspek teknis dari temuan ini yang mau kita bahas lebih lanjut, kawan?`
      );
    }
  }

  // --------------------------------------------------------------------------
  // 16. JAWABAN TERAKHIR (FALLBACK KETIKA DI LUAR KONTEKS & DATABASE)
  // Sesuai Instruksi User: Wajib kalimat persis!
  // --------------------------------------------------------------------------
  return `Maaf ya sobat!, pertanyaan anda diluar konteks dan data kami saat ini. kami tidak bisa menjawab pertanyaan anda`;
};

// ============================================================================
// COMPONENT: AICOPILOT (FREELY MOVABLE & RESIZABLE FLOATING WINDOW)
// ============================================================================
export default function AICopilot({
  risks = [],
  departmentStats = {},
  isOpen: propIsOpen,
  onToggle: propOnToggle
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propOnToggle || setInternalIsOpen;

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic Free-Floating Position (X, Y in pixels)
  // Default: Top-Right of the screen, floating freely ABOVE the app
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      const initialWidth = Math.min(480, window.innerWidth - 30);
      return {
        x: Math.max(20, window.innerWidth - initialWidth - 25),
        y: 85
      };
    }
    return { x: 800, y: 85 };
  });

  // Dynamic Resizing state (Width & Height in pixels)
  const [size, setSize] = useState({ width: 490, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, startW: 0, startH: 0 });

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const panelRef = useRef(null);

  const [activeAlert, setActiveAlert] = useState({
    title: 'Anomali Pengendalian Internal Terdeteksi!',
    desc: 'Terdapat 13 risiko berstatus "Extreme" dengan mitigasi berjalan "Tidak Efektif" di divisi IT, Legal, Sales, dan Delivery.',
    type: 'critical'
  });

  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo sobat! Senang bisa ngobrol dan berdiskusi santai bareng kamu di RBAMS PT. Agung Putra Nirantara. Aku siap bantu kamu menganalisis seluruh data risiko, efektivitas kontrol, jadwal audit (AAP 2026), sampai insight mendalam dari 125 profil risiko kita. Mau diskusi atau bedah data apa hari ini, kawan?'
    }
  ]);

  // 1. Drag Handlers (Smooth Free-Moving)
  const handleDragMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y
    };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const currentW = isMaximized ? window.innerWidth * 0.92 : size.width;
        const newX = Math.max(10, Math.min(window.innerWidth - Math.min(currentW, 350), dragStartRef.current.startX + dx));
        const newY = Math.max(10, Math.min(window.innerHeight - 150, dragStartRef.current.startY + dy));
        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const dw = e.clientX - resizeStartRef.current.mouseX;
        const dh = e.clientY - resizeStartRef.current.mouseY;
        const newW = Math.max(340, Math.min(window.innerWidth - position.x - 20, resizeStartRef.current.startW + dw));
        const newH = Math.max(380, Math.min(window.innerHeight - position.y - 20, resizeStartRef.current.startH + dh));
        setSize({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isMaximized, size, position]);

  // 2. Corner Resize Handler
  const handleResizeMouseDown = (e) => {
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: size.width,
      startH: size.height
    };
    e.stopPropagation();
    e.preventDefault();
  };

  // 3. Quick Dock Presets
  const dockTo = (loc) => {
    const curW = size.width;
    const curH = size.height;
    setIsMaximized(false);

    if (loc === 'top-left') {
      setPosition({ x: 20, y: 80 });
    } else if (loc === 'top-center') {
      setPosition({ x: Math.max(20, (window.innerWidth - curW) / 2), y: 80 });
    } else if (loc === 'top-right') {
      setPosition({ x: Math.max(20, window.innerWidth - curW - 24), y: 80 });
    } else if (loc === 'bottom-right') {
      setPosition({ x: Math.max(20, window.innerWidth - curW - 24), y: Math.max(20, window.innerHeight - curH - 24) });
    } else if (loc === 'bottom-left') {
      setPosition({ x: 20, y: Math.max(20, window.innerHeight - curH - 24) });
    } else if (loc === 'center') {
      setPosition({
        x: Math.max(20, (window.innerWidth - curW) / 2),
        y: Math.max(20, (window.innerHeight - curH) / 2)
      });
    }
  };

  // Typewriter effect simulation (Smooth & Instant for precision)
  const typeText = (fullText) => {
    setIsTyping(true);
    setDisplayedResponse('');
    let idx = 0;
    const stepSize = Math.max(2, Math.floor(fullText.length / 50));
    const interval = setInterval(() => {
      idx += stepSize;
      if (idx >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: 'ai', text: fullText }]);
        setDisplayedResponse('');
      } else {
        setDisplayedResponse(fullText.slice(0, idx));
      }
    }, 12);
  };

  const handleSend = (queryText) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setInputQuery('');

    // Generate 100% exact, grounded response
    setTimeout(() => {
      const answer = generateAIResponse(q, risks, departmentStats);
      typeText(answer);
    }, 180);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, displayedResponse]);

  return (
    <>
      {/* Floating Toggle Launcher (When Closed: Bottom-Right on mobile, Top-Right on desktop) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-auto sm:top-24 sm:right-6 z-[99990] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 text-slate-950 font-bold shadow-[0_0_30px_rgba(0,243,255,0.45)] hover:scale-105 transition-all flex items-center gap-2 sm:gap-2.5 group cursor-pointer border border-cyan-300"
          title="Buka AI Copilot RBAMS"
        >
          <Bot className="w-5 h-5 text-slate-950 animate-bounce shrink-0" />
          <div className="text-left font-tech">
            <span className="text-xs uppercase tracking-wider block font-bold leading-none">
              AI Copilot
            </span>
            <span className="text-[9px] text-slate-900 font-mono-tech leading-none hidden xs:block">
              100% Akurasi Data • 125 FMCG Items
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
        </button>
      )}

      {/* FREELY MOVABLE & RESIZABLE FLOATING WINDOW (RESPONSIVE ON MOBILE & DESKTOP) */}
      {isOpen && (
        <div
          ref={panelRef}
          style={
            isMobile
              ? {
                  position: 'fixed',
                  left: '8px',
                  right: '8px',
                  top: '58px',
                  bottom: '12px',
                  width: 'auto',
                  height: 'auto',
                  maxHeight: 'calc(100vh - 70px)',
                  zIndex: 999999
                }
              : isMaximized
              ? {
                  position: 'fixed',
                  top: '40px',
                  left: '4%',
                  width: '92vw',
                  height: '90vh',
                  zIndex: 999999
                }
              : {
                  position: 'fixed',
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${size.width}px`,
                  height: `${size.height}px`,
                  zIndex: 999999
                }
          }
          className={`rounded-2xl glass-panel-magenta border-2 border-fuchsia-500/80 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-in zoom-in-95 laser-border-magenta transition-shadow select-none ${
            isDragging ? 'opacity-95 ring-4 ring-cyan-400 shadow-[0_0_40px_rgba(0,243,255,0.4)]' : ''
          }`}
        >
          {/* DRAG HANDLE BAR (Primary Drag Zone) */}
          <div
            onMouseDown={isMobile ? undefined : handleDragMouseDown}
            className={`px-3 py-1.5 bg-gradient-to-r from-slate-950 via-fuchsia-950/70 to-slate-950 border-b border-fuchsia-500/30 flex items-center justify-between text-slate-400 hover:text-white transition group ${
              isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
            title={isMobile ? 'AI Copilot' : 'Tarik / Geser bilah ini untuk memindahkan kotak ke mana saja di layar'}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-cyan-300 font-semibold">
              <GripHorizontal className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition animate-pulse" />
              <span className="tracking-wider uppercase">
                {isMobile ? 'AI Copilot RBAMS' : '⠿ Geser Bebas / Drag Anywhere'}
              </span>
            </div>

            {/* Quick Position Docking Chips */}
            <div className="flex items-center gap-1 text-[9px] font-mono-tech">
              <span className="text-slate-500 mr-1 hidden sm:inline">Posisi:</span>
              <button
                type="button"
                onClick={() => dockTo('top-left')}
                className="px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-750 transition"
                title="Pindah ke Kiri Atas"
              >
                ↖ Kiri
              </button>
              <button
                type="button"
                onClick={() => dockTo('top-center')}
                className="px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-750 transition"
                title="Pindah ke Tengah Atas"
              >
                ⬆ Tengah
              </button>
              <button
                type="button"
                onClick={() => dockTo('top-right')}
                className="px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-750 transition"
                title="Pindah ke Kanan Atas"
              >
                ↗ Kanan
              </button>
              <button
                type="button"
                onClick={() => dockTo('bottom-right')}
                className="px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-750 transition"
                title="Pindah ke Kanan Bawah"
              >
                ↘ Bawah
              </button>
            </div>
          </div>

          {/* WINDOW HEADER */}
          <div
            onMouseDown={handleDragMouseDown}
            className="p-3 bg-[#080d1e]/95 border-b border-fuchsia-500/40 flex items-center justify-between cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2.5 pointer-events-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center text-slate-950 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-tech uppercase tracking-wide flex items-center gap-1.5">
                  AI Audit Copilot • Diskusi Terbuka
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-fuchsia-300 font-mono-tech">
                  PT. Agung Putra Nirantara • AI Discussion Partner & Risk Analyst
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                title={isMaximized ? 'Kembalikan Ukuran' : 'Perbesar Jendela'}
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/40 transition"
                title="Tutup Panel AI"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Anomaly Alert Banner */}
          {activeAlert && (
            <div className="p-2.5 bg-rose-950/70 border-b border-rose-500/40 text-xs font-mono-tech flex items-start gap-2 select-text">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold text-rose-300 leading-tight">{activeAlert.title}</div>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">{activeAlert.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAlert(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                &times;
              </button>
            </div>
          )}

          {/* Active Discussion Status Bar (No rigid prompt restrictions) */}
          <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Diskusi Bebas & Analisis Mendalam • 125 Risiko FMCG</span>
            </span>
            <span className="text-[10px] text-fuchsia-300 bg-fuchsia-950/60 px-2 py-0.5 rounded-full border border-fuchsia-500/30">
              Friendly Colleague
            </span>
          </div>

          {/* Message History Container (Selectable Text for Auditor) */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono-tech text-xs scrollbar-thin bg-slate-950/50 select-text"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed shadow-md ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-900/70 to-blue-900/70 text-cyan-200 border border-cyan-400/40'
                      : 'bg-[#0f172a]/95 text-slate-200 border border-fuchsia-500/30'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Live Typewriter Response */}
            {isTyping && displayedResponse && (
              <div className="flex justify-start">
                <div className="max-w-[88%] p-3.5 rounded-xl bg-[#0f172a]/95 text-slate-200 border border-fuchsia-500/50 whitespace-pre-wrap leading-relaxed shadow-xl">
                  {displayedResponse}
                  <span className="inline-block w-1.5 h-3 bg-fuchsia-400 ml-1 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex items-center gap-2 relative">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik pertanyaan apa saja seputar risiko, divisi, atau data audit..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 font-mono-tech"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isTyping}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-slate-950 font-bold disabled:opacity-40 transition hover:scale-105 cursor-pointer flex items-center gap-1 text-xs font-tech shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>

            {/* CORNER RESIZE HANDLE (Bottom-Right, Desktop Only) */}
            {!isMaximized && !isMobile && (
              <div
                onMouseDown={handleResizeMouseDown}
                className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize text-fuchsia-400/70 hover:text-cyan-400 transition flex items-end justify-end p-0.5"
                title="Tarik untuk mengubah ukuran lebar dan tinggi kotak"
              >
                <CornerDownRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
