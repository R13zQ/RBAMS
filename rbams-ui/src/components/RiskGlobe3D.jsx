import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Layers, Eye, RefreshCw, ZoomIn, ZoomOut, Compass, Sparkles } from 'lucide-react';

export default function RiskGlobe3D({ departmentStats, activeDept, onSelectDept, currentYear = 2026 }) {
  const mountRef = useRef(null);
  const [viewMode, setViewMode] = useState('globe'); // 'globe' or 'terrain'
  const [isRotating, setIsRotating] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [yearMode, setYearMode] = useState(currentYear); // 2025 vs 2026
  
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);
  const terrainGroupRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 360;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x05070e, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 26);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x00f3ff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f3ff, 1.2);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf000ff, 1.0);
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);

    // 4. Build Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Inner wireframe sphere
    const sphereRadius = yearMode === 2025 ? 7.6 : 6.8;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: yearMode === 2025 ? 0xff0055 : 0x003366,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Outer faint glow shell
    const glowGeo = new THREE.SphereGeometry(sphereRadius * 1.05, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: yearMode === 2025 ? 0xff2266 : 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // Equator & Orbital Rings
    const ringGeo = new THREE.RingGeometry(sphereRadius * 1.25, sphereRadius * 1.28, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    globeGroup.add(ringMesh);

    const ringGeo2 = new THREE.RingGeometry(sphereRadius * 1.4, sphereRadius * 1.42, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf000ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 3;
    ringMesh2.rotation.y = Math.PI / 6;
    globeGroup.add(ringMesh2);

    // Department Hotspot Nodes on Globe
    const deptKeys = Object.keys(departmentStats || {});
    const nodeCount = Math.max(deptKeys.length, 10);
    const nodes = [];

    deptKeys.forEach((deptName, i) => {
      const stats = departmentStats[deptName];
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const r = sphereRadius * 1.02;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      // Node color by Extreme/High severity
      let nodeColor = 0x00f3ff;
      if (stats.levels.Extreme > 2) nodeColor = 0xef4444;
      else if (stats.levels.Extreme > 0 || stats.levels.High > 4) nodeColor = 0xf000ff;
      else if (stats.levels.High > 2) nodeColor = 0xf59e0b;

      // Glow beacon
      const beaconGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.9,
        roughness: 0.2
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(x, y, z);
      beaconMesh.userData = { department: deptName, stats };
      globeGroup.add(beaconMesh);
      nodes.push(beaconMesh);

      // Light beam pointing outward
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 1.8, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.7
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(x * 1.15, y * 1.15, z * 1.15);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y, z).normalize());
      globeGroup.add(beam);
    });

    // 5. Build Terrain Topography Group (Hidden initially unless toggled)
    const terrainGroup = new THREE.Group();
    terrainGroupRef.current = terrainGroup;
    scene.add(terrainGroup);

    const terrainWidth = 24;
    const terrainHeight = 24;
    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainHeight, 32, 32);
    terrainGeo.rotateX(-Math.PI / 2);

    // Displace vertices to create risk topography terrain
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const dist = Math.sqrt(vx * vx + vz * vz);
      // Sinusoidal height with risk peaks
      const heightVal = Math.sin(vx * 0.4) * Math.cos(vz * 0.4) * 2.2 + Math.sin(dist * 0.8) * 1.2;
      pos.setY(i, heightVal);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x05162e,
      wireframe: true,
      emissive: 0x00f3ff,
      emissiveIntensity: 0.25,
      roughness: 0.4
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainGroup.add(terrainMesh);
    terrainGroup.visible = (viewMode === 'terrain');

    // 6. Interactive Raycasting for Hover & Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        setSelectedNode(hit.userData);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handlePointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.department && onSelectDept) {
          onSelectDept(hit.userData.department);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('click', handlePointerDown);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating) {
        if (globeGroup.visible) {
          globeGroup.rotation.y += 0.005;
          globeGroup.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.12;
        }
        if (terrainGroup.visible) {
          terrainGroup.rotation.y += 0.003;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('click', handlePointerDown);
      }
      renderer.dispose();
    };
  }, [departmentStats, isRotating, yearMode]);

  // Handle View Mode switch
  useEffect(() => {
    if (globeGroupRef.current) globeGroupRef.current.visible = (viewMode === 'globe');
    if (terrainGroupRef.current) terrainGroupRef.current.visible = (viewMode === 'terrain');
  }, [viewMode]);

  return (
    <div className="relative w-full h-[380px] rounded-xl overflow-hidden glass-panel border border-cyan-500/20 laser-border-cyan group">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Globe className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 font-tech tracking-wider uppercase">
              {viewMode === 'globe' ? '3D Risk Heatmap Globe' : '3D Topografi Risiko Enterprise'}
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-[10px] text-cyan-300/70 font-mono-tech">
              PT. Agung Putra Nirantara • WebGL Real-time Engine
            </div>
          </div>
        </div>

        {/* View Controls & Year Switch */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Year Switcher (PRD: compare 2025 vs 2026) */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-0.5 flex text-[11px] font-mono-tech">
            <button
              onClick={() => setYearMode(2025)}
              className={`px-2 py-0.5 rounded transition ${
                yearMode === 2025
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Siklus Baseline 2025"
            >
              2025 Baseline
            </button>
            <button
              onClick={() => setYearMode(2026)}
              className={`px-2 py-0.5 rounded transition ${
                yearMode === 2026
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Siklus Audit Berjalan 2026"
            >
              2026 Current
            </button>
          </div>

          {/* Mode Switch (Globe vs Topography) */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-0.5 flex text-[11px]">
            <button
              onClick={() => setViewMode('globe')}
              className={`p-1.5 rounded transition ${
                viewMode === 'globe' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mode Globe 3D"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('terrain')}
              className={`p-1.5 rounded transition ${
                viewMode === 'terrain' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mode Topografi Risiko"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border text-[11px] transition ${
              isRotating
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="Auto Rotate"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Floating Hover Information Box */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md text-xs z-10 max-w-[260px] shadow-2xl animate-in fade-in zoom-in-95 pointer-events-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-cyan-300 font-tech uppercase tracking-wide">
              {selectedNode.department}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-400 font-mono-tech">
              {selectedNode.stats.count} Risiko
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 mt-2">
            <div>
              <span className="text-slate-400 block text-[9px]">Inherent Exposure:</span>
              <span className="text-amber-300 font-mono-tech font-semibold">
                Rp {(selectedNode.stats.inherentTotal / 1_000_000_000).toFixed(1)} M
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Residual Exposure:</span>
              <span className="text-cyan-300 font-mono-tech font-semibold">
                Rp {(selectedNode.stats.residualTotal / 1_000_000_000).toFixed(1)} M
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-800 text-[10px]">
            <span className="text-red-400">Extreme: {selectedNode.stats.levels.Extreme}</span>
            <span className="text-amber-400">High: {selectedNode.stats.levels.High}</span>
            <span className="text-emerald-400">Reduksi: {selectedNode.stats.reductionPct}%</span>
          </div>
          <button
            onClick={() => onSelectDept(selectedNode.department)}
            className="w-full mt-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/40 rounded text-cyan-300 text-[10px] font-semibold transition"
          >
            Buka Infografis Departemen &rarr;
          </button>
        </div>
      )}

      {/* Legend & Status Overlay */}
      <div className="absolute bottom-3 right-4 flex items-center gap-3 text-[10px] text-slate-400 font-mono-tech pointer-events-none bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Extreme
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-fuchsia-500" /> High
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Low
        </span>
      </div>
    </div>
  );
}
