import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, X, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function FileParserModal({ isOpen, onClose, onImportParsedRisks, onResetOriginal }) {
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        // Find primary risk register sheet
        let sheetName = wb.SheetNames.find((s) => s.toLowerCase().includes('risk register')) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (rawJson.length < 2) {
          throw new Error('File tidak memiliki data baris yang cukup.');
        }

        const headers = rawJson[0];
        const rows = rawJson.slice(1);

        // Map columns
        const mappedRisks = [];
        rows.forEach((row, idx) => {
          if (!row[0]) return; // Skip empty rows
          mappedRisks.append ? null : null;
          mappedRisks.push({
            id: `RSK-${idx + 1}`,
            department: String(row[0] || '').trim(),
            process: String(row[1] || '').trim(),
            risk_event: String(row[2] || '').trim(),
            root_cause: String(row[3] || '').trim(),
            existing_control: String(row[4] || '').trim(),
            control_effectiveness: String(row[5] || 'Kurang Efektif').trim(),
            inherent_prob: Number(row[6]) || 1,
            inherent_impact: Number(row[7]) || 1,
            inherent_level: String(row[8] || 'Low').trim(),
            inherent_value: Number(row[9]) || 0,
            mitigation_plan: String(row[10] || '').trim(),
            reduction_pct: String(row[11] || '0%').trim(),
            reduction_value: Number(row[12]) || 0,
            residual_target_pct: String(row[13] || '0%').trim(),
            residual_prob: Number(row[14]) || 1,
            residual_impact: Number(row[15]) || 1,
            residual_level: String(row[16] || 'Low').trim(),
            residual_value: Number(row[17]) || 0
          });
        });

        setParsedData(mappedRisks);
        setIsProcessing(false);
      } catch (err) {
        setErrorMsg('Gagal membaca file Excel: ' + err.message);
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleApply = () => {
    if (parsedData && parsedData.length > 0) {
      onImportParsedRisks(parsedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 laser-border-cyan">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-tech uppercase tracking-wide flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              Smart File Upload & AI Parser
            </h3>
            <span className="text-xs text-cyan-300/70 font-mono-tech">
              SheetJS • Ekstraksi Kolom Otomatis ke Database Spanner
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-mono-tech">
            &times;
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-950/40 relative group">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <FileSpreadsheet className="w-12 h-12 text-cyan-400 mb-2 group-hover:scale-110 transition" />
            <div className="text-sm font-semibold text-white font-tech">
              Drag & Drop File Excel Risk Register (.xlsx)
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono-tech">
              Atau klik di sini untuk memilih file dari komputer Anda
            </p>
            <span className="text-[10px] mt-2 px-2 py-0.5 rounded bg-slate-900 text-slate-500 font-mono-tech">
              Format yang didukung: Risk_Register_FMCG_Dummy 2026.xlsx
            </span>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="p-3 rounded-xl bg-slate-900 text-cyan-300 text-xs font-mono-tech flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AI Parser sedang memproses dan memetakan struktur kolom spreadsheet...</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-mono-tech flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Result Preview */}
        {parsedData && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono-tech space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Berhasil Memetakan File: {fileName}
              </span>
              <span className="text-white">{parsedData.length} Baris Risiko</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Kolom terdeteksi: Departemen, Proses, Peristiwa Risiko, Inherent & Residual Scoring, Mitigasi, dan Nilai Finansial Rp.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onResetOriginal();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-tech transition"
          >
            Reset ke Dummy 2026 Asli
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-tech"
            >
              Tutup
            </button>
            {parsedData && (
              <button
                onClick={handleApply}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs font-tech flex items-center gap-1.5 shadow-lg"
              >
                Impor ke Risk Universe &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
