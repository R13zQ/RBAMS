import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RiskRegister from './components/RiskRegister';
import AnnualAuditPlan from './components/AnnualAuditPlan';
import DigitalKKA from './components/DigitalKKA';
import FollowUpTracker from './components/FollowUpTracker';
import AICopilot from './components/AICopilot';
import FileParserModal from './components/FileParserModal';
import ExportCenterModal from './components/ExportCenterModal';
import { INITIAL_RISKS, COMPANY_INFO } from './data/riskData';
import { calculateDepartmentStats, formatRp } from './utils/helpers';
import { Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [risks, setRisks] = useState(INITIAL_RISKS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDept, setSelectedDept] = useState('Finance');
  const [currentKKAEngagement, setCurrentKKAEngagement] = useState(null);

  // Modals state
  const [isFileParserOpen, setIsFileParserOpen] = useState(false);
  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);
  const [exportCenterTab, setExportCenterTab] = useState('pdf');
  const [globalNotification, setGlobalNotification] = useState(null);

  // AI Copilot state
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  // Recalculate Department Statistics dynamically whenever risks change
  const departmentStats = useMemo(() => {
    return calculateDepartmentStats(risks);
  }, [risks]);

  // Handlers for Risk CRUD
  const handleUpdateRisk = (updated) => {
    setRisks(risks.map((r) => (r.id === updated.id ? updated : r)));
    showGlobalNotification(`Risiko ${updated.id} berhasil diperbarui.`);
  };

  const handleAddRisk = (newRisk) => {
    setRisks([newRisk, ...risks]);
    showGlobalNotification(`Risiko baru ${newRisk.id} ditambahkan ke Universe.`);
  };

  const handleDeleteRisk = (id) => {
    setRisks(risks.filter((r) => r.id !== id));
    showGlobalNotification(`Risiko ${id} telah dihapus.`);
  };

  // Smart Data Migration (Year-End Rollover simulation: PRD Section 4)
  const handleRolloverYear = () => {
    const rolledOver = risks.map((r) => {
      return {
        ...r,
        inherent_prob: r.residual_prob,
        inherent_impact: r.residual_impact,
        inherent_level: r.residual_level,
        inherent_value: r.residual_value,
        residual_value: Math.round(r.residual_value * 0.7)
      };
    });
    setRisks(rolledOver);
    showGlobalNotification(
      'Smart Data Migration: Seluruh risiko belum termitigasi berhasil di-rollover ke siklus berikutnya!'
    );
  };

  // AI Risk Scoring auto-calibration simulation (PRD Section 4)
  const handleAICalibrate = () => {
    const calibrated = risks.map((r) => {
      if (r.inherent_level === 'Extreme' && r.control_effectiveness === 'Tidak Efektif') {
        return {
          ...r,
          inherent_value: Math.round(r.inherent_value * 1.08)
        };
      }
      return r;
    });
    setRisks(calibrated);
    showGlobalNotification(
      'AI Risk Engine: Likelihood & Dampak dikalibrasi ulang berdasarkan tren KRI historis 2025-2026!'
    );
  };

  // Handlers for File Parser
  const handleImportParsedRisks = (newRisks) => {
    setRisks(newRisks);
    showGlobalNotification(`Berhasil mengimpor ${newRisks.length} item risiko dari Excel!`);
  };

  const handleResetOriginal = () => {
    setRisks(INITIAL_RISKS);
    showGlobalNotification('Dataset di-reset ke data asli Risk_Register_FMCG_Dummy 2026.xlsx.');
  };

  const showGlobalNotification = (msg) => {
    setGlobalNotification(msg);
    setTimeout(() => setGlobalNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 cyber-grid flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Toast Alert */}
      {globalNotification && (
        <div className="fixed top-14 right-6 z-50 p-3.5 rounded-xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 font-mono-tech">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{globalNotification}</span>
        </div>
      )}

      {/* Main App Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenFileParser={() => setIsFileParserOpen(true)}
        onOpenExportCenter={() => {
          setExportCenterTab('pdf');
          setIsExportCenterOpen(true);
        }}
        onToggleAICopilot={() => setIsAICopilotOpen(!isAICopilotOpen)}
        isAIOpen={isAICopilotOpen}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            risks={risks}
            departmentStats={departmentStats}
            selectedDept={selectedDept}
            onSelectDept={setSelectedDept}
            onNavigateTab={setActiveTab}
            onFilterRiskRegister={(dept) => {
              setSelectedDept(dept);
              setActiveTab('register');
            }}
          />
        )}

        {activeTab === 'register' && (
          <RiskRegister
            risks={risks}
            onUpdateRisk={handleUpdateRisk}
            onAddRisk={handleAddRisk}
            onDeleteRisk={handleDeleteRisk}
            onRolloverYear={handleRolloverYear}
            onAICalibrate={handleAICalibrate}
          />
        )}

        {activeTab === 'aap' && (
          <AnnualAuditPlan
            risks={risks}
            onOpenKKA={(eng) => {
              setCurrentKKAEngagement(eng);
              setActiveTab('kka');
            }}
            onSendApprovalEmail={() => {
              setExportCenterTab('email');
              setIsExportCenterOpen(true);
            }}
          />
        )}

        {activeTab === 'kka' && (
          <DigitalKKA
            currentEngagement={currentKKAEngagement}
            onSaveKKA={(saved) => {
              showGlobalNotification(`KKA ${saved.id} berhasil disimpan di Database Spanner.`);
            }}
          />
        )}

        {activeTab === 'followup' && (
          <FollowUpTracker
            onOpenReminderEmail={(plan) => {
              setExportCenterTab('email');
              setIsExportCenterOpen(true);
            }}
          />
        )}
      </main>

      {/* Persistent Floating AI Copilot (Always on TOP, Movable & Draggable) */}
      <AICopilot
        risks={risks}
        departmentStats={departmentStats}
        isOpen={isAICopilotOpen}
        onToggle={setIsAICopilotOpen}
      />

      {/* Smart File Parser Modal */}
      <FileParserModal
        isOpen={isFileParserOpen}
        onClose={() => setIsFileParserOpen(false)}
        onImportParsedRisks={handleImportParsedRisks}
        onResetOriginal={handleResetOriginal}
      />

      {/* Export & Connectivity Modal */}
      <ExportCenterModal
        isOpen={isExportCenterOpen}
        onClose={() => setIsExportCenterOpen(false)}
        risks={risks}
        departmentStats={departmentStats}
        initialTab={exportCenterTab}
      />

      {/* Futuristic Enterprise Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-[#070b16]/90 py-6 px-4 text-xs font-mono-tech text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1 px-1.5 rounded-lg bg-white/[0.12] border border-cyan-400/50 flex items-center shadow-[0_0_10px_rgba(0,243,255,0.25)]">
              <img
                src="/logo-apn.png"
                alt="Logo PT. Agung Putra Nirantara"
                className="h-5 w-auto object-contain filter contrast-150 brightness-115"
              />
            </div>
            <span className="text-white font-bold font-tech text-sm">
              {COMPANY_INFO.name}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{COMPANY_INFO.systemName} &copy; 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">
              CAE: <strong className="text-slate-300">{COMPANY_INFO.chiefAuditExecutive}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              Internal Audit Manager: <strong className="text-cyan-400">{COMPANY_INFO.auditCommitteeChair}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">Audit Standard: IIA IPPF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
