# RBAMS (Risk-Based Audit Management System)

Sistem Manajemen Audit Internal Berbasis Risiko (*Risk-Based Internal Audit* - RBIA) interaktif modern untuk analisis profil risiko, matriks 5x5, Digital KKA, perencanaan audit tahunan (PKPT), dan pemantauan tindak lanjut.

---

## 🚀 Fitur Utama

- **Executive & Departmental Dashboard**: Ringkasan metrik risiko, distribusi tingkat risiko (Extreme, High, Medium, Low), serta matriks interaktif 5x5.
- **Risk Register**: Tabel komprehensif profil risiko lengkap dengan parameter Likelihood, Impact, Risk Score, dan mitigasi.
- **Digital KKA (Kertas Kerja Audit)**: Lembar kerja pengujian audit terintegrasi berbasis risiko.
- **Risk Flow Network & 3D Globe**: Visualisasi grafis jejaring interkoneksi risiko antar departemen.
- **AI Audit Copilot**: Asisten cerdas untuk analisis temuan dan rekomendasi mitigasi risiko.
- **Annual Audit Plan (PKPT) & Follow-up Tracker**: Manajemen siklus audit tahunan dan pemantauan status rekomendasi.
- **Export Center & File Parser**: Dukungan ekspor laporan serta parsing dokumen data risiko.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Data & Processing**: Python, OpenPyXL / Pandas (Risk Register FMCG)

---

## 📦 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
Pastikan sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [Git](https://git-scm.com/)

### 2. Jalankan Frontend
```bash
# Masuk ke direktori UI
cd rbams-ui

# Install dependencies
npm install

# Jalankan server development
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

---

## 📄 Lisensi
Hak Cipta © 2026 RBAMS. Seluruh hak cipta dilindungi.
