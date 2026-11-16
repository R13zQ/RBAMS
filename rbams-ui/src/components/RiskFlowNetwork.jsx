import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, Play, Pause, RefreshCw, Zap, ShieldCheck,
  TrendingDown, Info, Eye, Layers, Compass, HelpCircle,
  CheckCircle2, ArrowRight, Share2, Sparkles
} from 'lucide-react';
import { DEPARTMENT_META } from '../data/riskData';
import { formatRp } from '../utils/helpers';

export default function RiskFlowNetwork({
  departmentStats = {},
  activeDept,
  onSelectDept
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // States
  const [viewMode, setViewMode] = useState('flow'); // 'flow' (Value Chain Network) or 'radar' (Risk Radar)
  const [stage, setStage] = useState('inherent'); // 'inherent' vs 'residual'
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);

  // Define FMCG Process Flow coordinates for all 10 departments
  // Arranged logically in two tiers: Core Supply Chain & Sales (Top/Middle) and Enablers (Bottom)
  const nodeLayout = {
    'Purchasing': { xPct: 0.12, yPct: 0.38, tier: 'core' },
    'Warehouse': { xPct: 0.28, yPct: 0.24, tier: 'core' },
    'Delivery': { xPct: 0.46, yPct: 0.24, tier: 'core' },
    'Sales': { xPct: 0.64, yPct: 0.38, tier: 'core' },
    'Marketing': { xPct: 0.50, yPct: 0.52, tier: 'core' },
    'Finance': { xPct: 0.82, yPct: 0.44, tier: 'core' },
    'IT': { xPct: 0.22, yPct: 0.74, tier: 'enabler' },
    'HR': { xPct: 0.40, yPct: 0.78, tier: 'enabler' },
    'Legal': { xPct: 0.60, yPct: 0.78, tier: 'enabler' },
    'Audit Internal': { xPct: 0.78, yPct: 0.74, tier: 'enabler' }
  };

  // Interconnected Value-Chain dependencies (FMCG Risk Contagion Paths)
  const connections = [
    { from: 'Purchasing', to: 'Warehouse', label: 'Pasokan Bahan Baku' },
    { from: 'Warehouse', to: 'Delivery', label: 'Fulfillment & Staging' },
    { from: 'Delivery', to: 'Sales', label: 'Drop Point Toko Retail' },
    { from: 'Marketing', to: 'Sales', label: 'Trade Promo & Demand' },
    { from: 'Sales', to: 'Finance', label: 'Penagihan Piutang AR' },
    { from: 'Purchasing', to: 'Finance', label: 'Hutang Dagang AP' },
    { from: 'IT', to: 'Warehouse', label: 'WMS Cloud System' },
    { from: 'IT', to: 'Finance', label: 'ERP Transaction Core' },
    { from: 'HR', to: 'Delivery', label: 'Produktivitas Driver' },
    { from: 'Legal', to: 'Sales', label: 'Kontrak Distributor' },
    { from: 'Audit Internal', to: 'Finance', label: 'Audit Kepatuhan & Fraud' },
    { from: 'Audit Internal', to: 'Marketing', label: 'Audit Klaim Diskon' }
  ];

  // Particle stream state for animation
  const particlesRef = useRef([]);

  useEffect(() => {
    // Initialize moving particles along connections
    const particles = [];
    connections.forEach((conn, idx) => {
      for (let p = 0; p < 3; p++) {
        particles.push({
          connIndex: idx,
          progress: (p / 3) + Math.random() * 0.1,
          speed: 0.003 + Math.random() * 0.002
        });
      }
    });
    particlesRef.current = particles;
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = (rect.height || 420) * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let tick = 0;

    const render = () => {
      tick++;
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 420;

      // Clear with dark cyber fade
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Calculate node positions in pixels
      const nodePositions = {};
      const depts = Object.keys(departmentStats);

      if (viewMode === 'flow') {
        // Mode 1: Value Chain Process Flow Network
        depts.forEach((d) => {
          const layout = nodeLayout[d] || { xPct: 0.5, yPct: 0.5 };
          nodePositions[d] = {
            x: layout.xPct * width,
            y: layout.yPct * height
          };
        });
      } else {
        // Mode 2: Multi-Ring Risk Radar (Concentric Circles)
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.38;

        // Draw concentric radar rings
        [0.35, 0.65, 1.0].forEach((ringFactor, i) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * ringFactor, 0, Math.PI * 2);
          ctx.strokeStyle = i === 2 ? 'rgba(0, 243, 255, 0.25)' : 'rgba(0, 243, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Rotating radar beam
        const angle = (tick * 0.02) % (Math.PI * 2);
        const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(0, 243, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + 0.5);
        ctx.closePath();
        ctx.fill();

        depts.forEach((d, i) => {
          const theta = (i / depts.length) * Math.PI * 2 - Math.PI / 2;
          const s = departmentStats[d] || {};
          // Higher severity = positioned closer to center or outer perimeter
          const distMultiplier = stage === 'inherent' ? 0.75 + (s.levels?.Extreme || 0) * 0.06 : 0.55;
          nodePositions[d] = {
            x: centerX + Math.cos(theta) * radius * Math.min(distMultiplier, 0.95),
            y: centerY + Math.sin(theta) * radius * Math.min(distMultiplier, 0.95)
          };
        });
      }

      // Draw Connections & Moving Particles
      connections.forEach((conn, cIdx) => {
        const fromPos = nodePositions[conn.from];
        const toPos = nodePositions[conn.to];
        if (!fromPos || !toPos) return;

        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = stage === 'inherent' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(0, 243, 255, 0.22)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw subtle connecting wave pulse
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
      });

      // Update & Draw Flowing Particles
      if (isPlaying) {
        particlesRef.current.forEach((p) => {
          p.progress += p.speed;
          if (p.progress >= 1) p.progress = 0;

          const conn = connections[p.connIndex];
          if (!conn) return;
          const p1 = nodePositions[conn.from];
          const p2 = nodePositions[conn.to];
          if (!p1 || !p2) return;

          const px = p1.x + (p2.x - p1.x) * p.progress;
          const py = p1.y + (p2.y - p1.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = stage === 'inherent' ? '#f43f5e' : '#00f3ff';
          ctx.shadowColor = stage === 'inherent' ? 'rgba(244, 63, 94, 0.8)' : 'rgba(0, 243, 255, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw Department Nodes
      depts.forEach((d) => {
        const pos = nodePositions[d];
        if (!pos) return;
        const s = departmentStats[d] || { inherentTotal: 0, residualTotal: 0, levels: {} };
        const meta = DEPARTMENT_META[d] || {};
        const isHovered = hoveredDept === d;
        const isSelected = activeDept === d;

        // Calculate dynamic radius based on exposure value
        const exposureVal = stage === 'inherent' ? (s.inherentTotal || 20_000_000_000) : (s.residualTotal || 10_000_000_000);
        // Base radius between 16px and 28px
        const baseRadius = 14 + (exposureVal / 60_000_000_000) * 16;
        const radius = isHovered || isSelected ? baseRadius * 1.25 : baseRadius;

        // Node Color Determination
        let nodeColor = '#00f3ff';
        let glowColor = 'rgba(0, 243, 255, 0.4)';
        if (stage === 'inherent') {
          if ((s.levels?.Extreme || 0) > 1) {
            nodeColor = '#ef4444'; // Red
            glowColor = 'rgba(239, 68, 68, 0.5)';
          } else if ((s.levels?.Extreme || 0) > 0 || (s.levels?.High || 0) > 4) {
            nodeColor = '#f000ff'; // Magenta / Purple
            glowColor = 'rgba(240, 0, 255, 0.4)';
          } else if ((s.levels?.High || 0) > 2) {
            nodeColor = '#f59e0b'; // Amber
            glowColor = 'rgba(245, 158, 11, 0.4)';
          }
        } else {
          // Residual Mode: Calmed down to Cyan/Emerald
          nodeColor = '#10b981';
          glowColor = 'rgba(16, 185, 129, 0.4)';
        }

        // Draw Pulsating Outer Corona for Extreme Nodes
        if ((s.levels?.Extreme || 0) > 0 && stage === 'inherent') {
          const pulseR = radius + (Math.sin(tick * 0.08 + depts.indexOf(d)) + 1) * 6;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node Fill Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0a1020';
        ctx.fill();

        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isHovered || isSelected ? 18 : 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node Center Core Dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Department Label Text
        ctx.font = 'bold 11px Rajdhani, sans-serif';
        ctx.fillStyle = isSelected ? '#00f3ff' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(d, pos.x, pos.y - radius - 6);

        // Value / Code Subtitle
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = stage === 'inherent' ? '#f59e0b' : '#34d399';
        const formattedVal = `Rp ${(exposureVal / 1_000_000_000).toFixed(1)}M`;
        ctx.fillText(formattedVal, pos.x, pos.y + radius + 12);
      });

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [departmentStats, viewMode, stage, isPlaying, hoveredDept, activeDept]);

  // Handle Canvas Mouse Move (Tooltip & Hover Detection)
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const depts = Object.keys(departmentStats);

    let found = null;
    depts.forEach((d) => {
      let nodeX, nodeY;
      if (viewMode === 'flow') {
        const layout = nodeLayout[d] || { xPct: 0.5, yPct: 0.5 };
        nodeX = layout.xPct * width;
        nodeY = layout.yPct * height;
      } else {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.38;
        const i = depts.indexOf(d);
        const theta = (i / depts.length) * Math.PI * 2 - Math.PI / 2;
        const s = departmentStats[d] || {};
        const distMultiplier = stage === 'inherent' ? 0.75 + (s.levels?.Extreme || 0) * 0.06 : 0.55;
        nodeX = centerX + Math.cos(theta) * radius * Math.min(distMultiplier, 0.95);
        nodeY = centerY + Math.sin(theta) * radius * Math.min(distMultiplier, 0.95);
      }

      const dist = Math.hypot(mouseX - nodeX, mouseY - nodeY);
      if (dist <= 30) {
        found = d;
      }
    });

    setHoveredDept(found);
    canvas.style.cursor = found ? 'pointer' : 'default';
  };

  const handleCanvasClick = () => {
    if (hoveredDept && onSelectDept) {
      onSelectDept(hoveredDept);
    }
  };

  const hoveredStats = hoveredDept ? departmentStats[hoveredDept] : null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 laser-border-cyan space-y-0 group">
      {/* Top Interactive Header */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
              <span>{viewMode === 'flow' ? 'Simulasi Aliran Risiko & Rantai Nilai FMCG' : 'Radar Topografi & Kecepatan Risiko'}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono-tech">
              Interkoneksi 10 Departemen • Pemetaan Penularan Risiko (*Risk Contagion*)
            </div>
          </div>
        </div>

        {/* Control Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Simulation Stage Toggle (Inherent vs Residual) */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-0.5 flex text-[11px] font-mono-tech">
            <button
              onClick={() => setStage('inherent')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                stage === 'inherent'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pra-Mitigasi: Potensi Kerugian Awal"
            >
              <Zap className="w-3 h-3 text-rose-400" />
              Inherent Baseline
            </button>
            <button
              onClick={() => setStage('residual')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                stage === 'residual'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pasca-Mitigasi: Target Risiko Terkendali (-50.9%)"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Residual Target
            </button>
          </div>

          {/* View Mode Toggle (Flow Network vs Radar) */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-0.5 flex text-[11px] font-mono-tech">
            <button
              onClick={() => setViewMode('flow')}
              className={`px-2 py-1 rounded transition flex items-center gap-1 ${
                viewMode === 'flow' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Aliran Proses Bisnis Rantai Pasok"
            >
              <Share2 className="w-3 h-3" />
              Aliran Nilai
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-2 py-1 rounded transition flex items-center gap-1 ${
                viewMode === 'radar' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Radar Multi-Cincin"
            >
              <Compass className="w-3 h-3" />
              Radar
            </button>
          </div>

          {/* Toggle Animation Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
            title={isPlaying ? 'Jeda Animasi' : 'Putar Animasi'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Toggle Guide Button */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`p-1.5 rounded-lg border text-[11px] font-mono-tech flex items-center gap-1 transition ${
              showExplanation
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Tampilkan / Sembunyikan Panduan Membaca Animasi"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panduan</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div ref={containerRef} className="relative w-full h-[360px] sm:h-[390px] bg-[#050914] overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Hover Tooltip Card */}
        {hoveredDept && hoveredStats && (
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/95 border border-cyan-500/50 backdrop-blur-md text-xs z-20 max-w-[270px] shadow-2xl animate-in fade-in pointer-events-none">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-cyan-300 font-tech uppercase text-sm">
                Departemen {hoveredDept}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono-tech">
                {hoveredStats.count} Item Risiko
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-tech mt-2">
              <div>
                <span className="text-slate-400 block text-[9px]">Inherent Exposure:</span>
                <span className="text-amber-300 font-bold">{formatRp(hoveredStats.inherentTotal)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Residual Target:</span>
                <span className="text-emerald-400 font-bold">{formatRp(hoveredStats.residualTotal)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono-tech mt-2 pt-1.5 border-t border-slate-800">
              <span className="text-red-400">Extreme: {hoveredStats.levels?.Extreme || 0}</span>
              <span className="text-amber-400">High: {hoveredStats.levels?.High || 0}</span>
              <span className="text-emerald-400">Reduksi: {hoveredStats.reductionPct}%</span>
            </div>
            <div className="text-[9px] text-cyan-300/80 mt-1.5 text-center font-tech">
              Klik simpul untuk membuka infografis lengkap &rarr;
            </div>
          </div>
        )}

        {/* Legend Overlay at Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3 text-[10px] text-slate-400 font-mono-tech bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/90 backdrop-blur-sm pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> Extreme
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" /> High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Residual Low
          </span>
        </div>
      </div>

      {/* EXPLANATORY GUIDE PANEL (PRD & User Requirement: Jelas & Clear) */}
      {showExplanation && (
        <div className="p-4 bg-slate-950/90 border-t border-cyan-500/20 text-xs font-mono-tech space-y-2.5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-tech font-bold uppercase tracking-wider">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Panduan Membaca Visualisasi Animasi Aliran Risiko:</span>
            </div>
            <span className="text-[10px] text-slate-500">PT. Agung Putra Nirantara • FMCG Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-slate-300">
            {/* Guide Item 1 */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">1. Ukuran Lingkaran (Node Size):</span>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                Menggambarkan <strong>besaran nilai finansial (Rp)</strong> risiko pada departemen tersebut. Semakin besar lingkaran, semakin tinggi eksposur potensi kerugian jika risiko terjadi.
              </p>
            </div>

            {/* Guide Item 2 */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-rose-400 font-bold block mb-1">2. Warna & Denyut Corona:</span>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                Warna mencerminkan tingkat keparahan risiko. <strong>Lingkaran merah berdenyut</strong> menandakan departemen memiliki risiko level <em>Extreme</em> yang memerlukan audit prioritas tinggi.
              </p>
            </div>

            {/* Guide Item 3 */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">3. Arus Partikel Bergerak:</span>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                Menggambarkan <strong>aliran ketergantungan proses bisnis (*Risk Contagion*)</strong>. Contoh: Kegagalan vendor di <em>Purchasing</em> mengalir memicu kemacetan di <em>Warehouse</em>, <em>Delivery</em>, hingga <em>Finance</em>.
              </p>
            </div>

            {/* Guide Item 4 */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">4. Tombol Inherent vs Residual:</span>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                Klik <em>Residual Target</em> untuk melihat simulasi <strong>penurunan risiko sebesar 50.9%</strong>. Lingkaran akan menyusut dan partikel berubah hijau stabil pasca-mitigasi audit internal.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
