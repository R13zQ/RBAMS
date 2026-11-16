import React, { useState } from 'react';
import {
  CheckSquare, Clock, AlertTriangle, Send, User,
  CheckCircle2, AlertCircle, Calendar, RefreshCw, Mail
} from 'lucide-react';
import { formatRp } from '../utils/helpers';

export default function FollowUpTracker({ onOpenReminderEmail }) {
  const initialActionPlans = [
    {
      id: 'MAP-2026-001',
      findingId: 'KKA-2026-001',
      title: 'Implementasi Modul Trade Promotion Management (TPM) di ERP',
      department: 'Marketing & IT',
      pic: 'Clarissa Anggraini (Mkt) & Agus Firmansyah (IT)',
      deadline: '2026-03-31',
      progress: 65,
      status: 'In Progress',
      priority: 'HIGH',
      actionDetail:
        'Konfigurasi barcode scanning klaim promo, approval berjenjang digital oleh Branch Manager, dan segregasi user kasir.',
      lastUpdate: '2026-02-28'
    },
    {
      id: 'MAP-2026-002',
      findingId: 'KKA-2026-001',
      title: 'Pemisahan Fungsi Kolektor Kas dan Rotasi Sales Area',
      department: 'Marketing & HR',
      pic: 'Sri Wahyuni (HR) & Rian Pratama (Sales)',
      deadline: '2026-02-15',
      progress: 100,
      status: 'Verified Closed',
      priority: 'CRITICAL',
      actionDetail:
        'Penerbitan SK Direksi tentang penarikan uang tunai wajib via Virtual Account bank dan rotasi berkala 6 bulan tim kanvas.',
      lastUpdate: '2026-02-14'
    },
    {
      id: 'MAP-2026-003',
      findingId: 'KKA-2026-002',
      title: 'Instalasi GPS Geofencing Fleet Management & E-Fuel Card',
      department: 'Delivery',
      pic: 'Suryadi Hartono (Delivery Lead)',
      deadline: '2026-04-15',
      progress: 40,
      status: 'In Progress',
      priority: 'HIGH',
      actionDetail:
        'Pemasangan perangkat GPS IoT pada 45 truk in-house dan kontrak kerja sama kartu BBM digital Pertamina untuk mencegah kebocoran uang jalan.',
      lastUpdate: '2026-03-01'
    },
    {
      id: 'MAP-2026-004',
      findingId: 'KKA-2026-003',
      title: 'Aktivasi Hard Credit Blocking & Restrukturisasi Piutang Distributor',
      department: 'Finance',
      pic: 'Hendrawan Kusuma, SE, Ak, CA',
      deadline: '2026-01-30',
      progress: 85,
      status: 'Overdue / Pending Review',
      priority: 'CRITICAL',
      actionDetail:
        'Penguncian order baru jika faktur macet > 30 hari dan penagihan jaminan bank garansi senilai Rp 2 Milyar ke 3 distributor Jatim.',
      lastUpdate: '2026-02-20'
    },
    {
      id: 'MAP-2026-005',
      findingId: 'KKA-2026-004',
      title: 'Penerapan Sistem Barcode FEFO & Kalibrasi Timbangan Warehouse',
      department: 'Warehouse',
      pic: 'Dedi Mulyanto',
      deadline: '2026-05-30',
      progress: 25,
      status: 'Open',
      priority: 'MEDIUM',
      actionDetail:
        'Integrasi handheld scanner pallet di 3 depo regional untuk melacak expired date SKU dan mengurangi shrinkage stok.',
      lastUpdate: '2026-02-10'
    }
  ];

  const [actionPlans, setActionPlans] = useState(initialActionPlans);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [notification, setNotification] = useState(null);

  const filteredPlans = actionPlans.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  const handleUpdateProgress = (id, newProgress) => {
    setActionPlans(
      actionPlans.map((a) => {
        if (a.id === id) {
          const status = newProgress >= 100 ? 'Verified Closed' : 'In Progress';
          return { ...a, progress: newProgress, status, lastUpdate: '2026-11-13' };
        }
        return a;
      })
    );
    setNotification(`Status progres ${id} diperbarui menjadi ${newProgress}%!`);
    setTimeout(() => setNotification(null), 3000);
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

      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 laser-border-cyan flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckSquare className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-tech tracking-wide uppercase">
              Follow-Up Tracker (Management Action Plan - MAP)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-tech">
              Automated Reminders Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring penyelesaian komitmen perbaikan oleh auditee dengan eskalasi keterlambatan otomatis ke Direksi.
          </p>
        </div>

        {/* Filter and Trigger Email */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenReminderEmail && onOpenReminderEmail(actionPlans[3])}
            className="px-3 py-1.5 bg-fuchsia-950/60 hover:bg-fuchsia-900 border border-fuchsia-500/40 text-fuchsia-300 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition"
            title="Kirim email peringatan otomatis kepada PIC yang overdue"
          >
            <Mail className="w-3.5 h-3.5 text-fuchsia-400" />
            Kirim Reminder PIC Overdue
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] block uppercase">Total Action Plan:</span>
          <span className="text-xl font-bold font-tech text-white">{actionPlans.length} Komitmen</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Dari 4 Penugasan Audit</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/30">
          <span className="text-emerald-400 text-[10px] block uppercase">Selesai (Verified Closed):</span>
          <span className="text-xl font-bold font-tech text-emerald-300">
            {actionPlans.filter((a) => a.status === 'Verified Closed').length} Tindak Lanjut
          </span>
          <span className="text-[10px] text-emerald-400/80 block mt-0.5">Tervalidasi Tim Audit</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/30">
          <span className="text-cyan-400 text-[10px] block uppercase">Sedang Dikerjakan:</span>
          <span className="text-xl font-bold font-tech text-cyan-300">
            {actionPlans.filter((a) => a.status === 'In Progress' || a.status === 'Open').length} On Track
          </span>
          <span className="text-[10px] text-cyan-400/80 block mt-0.5">Sesuai Timeline RKAP</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-rose-500/30">
          <span className="text-rose-400 text-[10px] block uppercase">Perlu Perhatian (Overdue):</span>
          <span className="text-xl font-bold font-tech text-rose-300">
            {actionPlans.filter((a) => a.status.includes('Overdue')).length} Pending Review
          </span>
          <span className="text-[10px] text-rose-400/80 block mt-0.5">Eskalasi ke Komite Audit</span>
        </div>
      </div>

      {/* Action Plans Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Kode & Temuan</th>
                <th className="py-3 px-3 min-w-[220px]">Rencana Tindak Lanjut Manajemen</th>
                <th className="py-3 px-3">PIC & Departemen</th>
                <th className="py-3 px-3">Tenggat Waktu</th>
                <th className="py-3 px-3 min-w-[140px]">Progres Penyelesaian</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Update Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-900/60 transition">
                  <td className="py-3 px-3 align-top whitespace-nowrap">
                    <span className="font-bold text-cyan-400 block">{plan.id}</span>
                    <span className="text-[10px] text-slate-500 font-mono-tech">{plan.findingId}</span>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <div className="font-semibold text-white leading-snug">{plan.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{plan.actionDetail}</div>
                  </td>

                  <td className="py-3 px-3 align-top whitespace-nowrap">
                    <div className="text-slate-200 font-semibold">{plan.pic}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-tech mt-0.5 inline-block">
                      {plan.department}
                    </span>
                  </td>

                  <td className="py-3 px-3 align-top whitespace-nowrap">
                    <div className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {plan.deadline}
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-cyan-400">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          plan.progress >= 100
                            ? 'bg-emerald-400'
                            : plan.status.includes('Overdue')
                            ? 'bg-rose-400'
                            : 'bg-cyan-400'
                        }`}
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold border ${
                        plan.status === 'Verified Closed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : plan.status.includes('Overdue')
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleUpdateProgress(plan.id, Math.min(100, plan.progress + 25))}
                        className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] transition"
                        title="Tambah 25%"
                      >
                        +25%
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(plan.id, 100)}
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] transition"
                        title="Verifikasi Selesai 100%"
                      >
                        Selesai
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
