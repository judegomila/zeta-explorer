import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import {
  directLadderDiagram, dualLadderDiagram, fullTwinLadderDiagram,
  spiderFusion, colorChange, phaseAccumulation, symmetryScan,
  bialgebraExpansion, transmissionAnalysis, createHadamardBox,
} from '../math/zxcalculus.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

const TABS = ['Spider Chain', 'Twin Ladder', 'Rewrite Rules', 'Symmetry'];

// ─── SVG Spider Drawing ──────────────────────────────────────────────────────

function drawSpider(ctx, x, y, r, type, phase, magnitude, label, highlight) {
  const colors = {
    Z: { fill: '#10b981', stroke: '#34d399', glow: 'rgba(16,185,129,0.3)' },
    X: { fill: '#ef4444', stroke: '#f87171', glow: 'rgba(239,68,68,0.3)' },
    H: { fill: '#f59e0b', stroke: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
  };
  const c = colors[type] || colors.Z;

  // Glow
  if (highlight) {
    ctx.beginPath();
    ctx.arc(x, y, r + 6, 0, Math.PI * 2);
    ctx.fillStyle = c.glow;
    ctx.fill();
  }

  // Body
  ctx.beginPath();
  if (type === 'H') {
    // Hadamard is a square
    ctx.rect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6);
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.fillStyle = highlight ? c.fill : 'rgba(15,18,37,0.9)';
  ctx.fill();
  ctx.strokeStyle = c.stroke;
  ctx.lineWidth = highlight ? 2.5 : 1.5;
  ctx.stroke();

  // Phase arc (for Z/X spiders)
  if (type !== 'H' && phase !== undefined) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r * 0.7, -Math.PI / 2, -Math.PI / 2 + phase);
    ctx.closePath();
    ctx.fillStyle = c.fill + '60';
    ctx.fill();
  }

  // Label
  if (label) {
    ctx.fillStyle = highlight ? '#fff' : c.stroke;
    ctx.font = `bold ${r < 16 ? 8 : 10}px var(--font-mono)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  }
}

function drawWire(ctx, x1, y1, x2, y2, color = '#475569', width = 1, dashed = false) {
  ctx.beginPath();
  if (dashed) ctx.setLineDash([4, 3]);
  ctx.moveTo(x1, y1);
  // Slight curve
  const midY = (y1 + y2) / 2;
  const dx = Math.abs(x2 - x1);
  const curve = dx < 30 ? 15 : 0;
  ctx.bezierCurveTo(x1, midY + curve, x2, midY - curve, x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  if (dashed) ctx.setLineDash([]);

  // Arrow direction along chord from start to end
  const arrowAngle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 6 * Math.cos(arrowAngle - 0.4), y2 - 6 * Math.sin(arrowAngle - 0.4));
  ctx.lineTo(x2 - 6 * Math.cos(arrowAngle + 0.4), y2 - 6 * Math.sin(arrowAngle + 0.4));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// ─── Tab 1: Spider Chain ─────────────────────────────────────────────────────

function SpiderChainTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const [showFused, setShowFused] = useState(false);
  const [hovered, setHovered] = useState(null);

  const data = useMemo(() => {
    const s = [sigma, t];
    return directLadderDiagram(s, numPrimes);
  }, [sigma, t, numPrimes]);

  const phases = useMemo(() => phaseAccumulation([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = 40;
    const spiderR = 20;
    const n = data.spiders.length;

    if (showFused) {
      // Show single fused spider
      const cx = w / 2;
      const cy = h / 2;
      drawSpider(ctx, cx, cy, 36, 'Z', data.fusedSpider.phase, data.fusedSpider.magnitude,
        `∏${n}p`, true);

      // Input/output wires
      drawWire(ctx, margin, cy, cx - 40, cy, '#475569', 1.5);
      drawWire(ctx, cx + 40, cy, w - margin, cy, '#475569', 1.5);

      // Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(`|ζ| = ${data.totalMagnitude.toFixed(4)}`, cx, cy + 55);
      ctx.fillText(`arg = ${data.fusedSpider.phase.toFixed(3)} rad`, cx, cy + 70);
      ctx.fillText('FUSED (spider fusion rule)', cx, cy - 55);
    } else {
      // Draw chain of spiders
      const spacing = (w - 2 * margin) / (n + 1);
      const cy = h * 0.4;

      // Input wire
      drawWire(ctx, margin - 10, cy, margin + spacing - spiderR - 4, cy, '#475569', 1.5);

      for (let i = 0; i < n; i++) {
        const sp = data.spiders[i];
        const cx = margin + spacing * (i + 1);
        const isHov = hovered === i;

        // Wire to next spider
        if (i < n - 1) {
          const nx = margin + spacing * (i + 2);
          drawWire(ctx, cx + spiderR + 2, cy, nx - spiderR - 2, cy, '#334155', 1);
        }

        drawSpider(ctx, cx, cy, spiderR, 'Z', sp.phase, sp.magnitude,
          `p=${sp.prime}`, isHov);

        // Phase label below
        ctx.fillStyle = isHov ? '#e2e8f0' : '#64748b';
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'center';
        ctx.fillText(`α=${sp.phase.toFixed(2)}`, cx, cy + spiderR + 14);
      }

      // Output wire
      const lastX = margin + spacing * n;
      drawWire(ctx, lastX + spiderR + 2, cy, w - margin + 10, cy, '#475569', 1.5);

      // Phase accumulation graph below
      const graphY = h * 0.7;
      const graphH = h * 0.22;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(margin, graphY - graphH / 2, w - 2 * margin, graphH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(margin, graphY - graphH / 2, w - 2 * margin, graphH);

      // Plot cumulative phase
      const maxPhase = Math.max(...phases.map(p => Math.abs(p.cumulativePhase)), 0.1);

      // Zero reference line
      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      ctx.moveTo(margin, graphY);
      ctx.lineTo(w - margin, graphY);
      ctx.strokeStyle = '#47556960';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Y-axis tick labels (±maxPhase)
      ctx.fillStyle = '#64748b';
      ctx.font = '8px var(--font-mono)';
      ctx.textAlign = 'right';
      const topPhaseY = graphY - graphH * 0.4;
      const botPhaseY = graphY + graphH * 0.4;
      ctx.fillText(`+${maxPhase.toFixed(1)}`, margin - 4, topPhaseY + 3);
      ctx.fillText('0', margin - 4, graphY + 3);
      ctx.fillText(`−${maxPhase.toFixed(1)}`, margin - 4, botPhaseY + 3);

      ctx.beginPath();
      for (let i = 0; i < phases.length; i++) {
        const px = margin + spacing * (i + 1);
        const py = graphY - (phases[i].cumulativePhase / maxPhase) * graphH * 0.4;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots on graph
      for (let i = 0; i < phases.length; i++) {
        const px = margin + spacing * (i + 1);
        const py = graphY - (phases[i].cumulativePhase / maxPhase) * graphH * 0.4;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Cumulative phase (rad)', margin + 4, graphY - graphH / 2 - 4);
    }
  }, [data, phases, showFused, hovered]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleMouseMove = useCallback((e) => {
    if (showFused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = canvas.clientWidth;
    const n = data.spiders.length;
    const margin = 40;
    const spacing = (w - 2 * margin) / (n + 1);
    const cy = canvas.clientHeight * 0.4;

    let found = null;
    for (let i = 0; i < n; i++) {
      const cx = margin + spacing * (i + 1);
      if (Math.hypot(mx - cx, my - cy) < 24) { found = i; break; }
    }
    setHovered(found);
  }, [data, showFused]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button
          className={`filter-btn ${!showFused ? 'active' : ''}`}
          onClick={() => setShowFused(false)}
        >Chain</button>
        <button
          className={`filter-btn ${showFused ? 'active' : ''}`}
          onClick={() => setShowFused(true)}
        >Fused</button>
        <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>
          {showFused ? 'Spider fusion: all phases added, factors multiplied' : `${numPrimes} Z-spiders in cascade`}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 320, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      />
      {hovered !== null && (
        <div style={{ marginTop: 8, padding: '8px 12px', background: '#0f1225', borderRadius: 6, border: '1px solid #334155', fontSize: 12 }}>
          <span style={{ color: '#10b981', fontWeight: 700 }}>Z-spider p={data.spiders[hovered].prime}</span>
          <span style={{ color: '#64748b', marginLeft: 12 }}>
            |H<sub>p</sub>| = {data.spiders[hovered].magnitude.toFixed(4)}
          </span>
          <span style={{ color: '#64748b', marginLeft: 12 }}>
            α = {data.spiders[hovered].phase.toFixed(4)} rad
          </span>
          <span style={{ color: '#64748b', marginLeft: 12 }}>
            Z₀ = log({data.spiders[hovered].prime}) = {data.spiders[hovered].frequency.toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Twin Ladder ──────────────────────────────────────────────────────

function TwinLadderTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();

  const diagram = useMemo(() => fullTwinLadderDiagram([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = 50;
    const n = diagram.direct.spiders.length;
    const spacing = (w - 2 * margin) / (n + 2);
    const topY = h * 0.25;
    const botY = h * 0.75;
    const bridgeX = w / 2;
    const bridgeY = h / 2;
    const spiderR = 16;

    // Direct ladder (top, green)
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Direct Ladder ζ(s)', margin, topY - 30);

    for (let i = 0; i < n; i++) {
      const sp = diagram.direct.spiders[i];
      const cx = margin + spacing * (i + 1);

      // Wire
      if (i < n - 1) {
        const nx = margin + spacing * (i + 2);
        drawWire(ctx, cx + spiderR + 2, topY, nx - spiderR - 2, topY, '#1e4035', 1);
      }

      drawSpider(ctx, cx, topY, spiderR, 'Z', sp.phase, sp.magnitude,
        `${sp.prime}`, false);
    }

    // Dual ladder (bottom, red)
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'left';
    ctx.fillText('Dual Ladder ζ(1−s)', margin, botY - 30);

    for (let i = 0; i < n; i++) {
      const sp = diagram.dual.spiders[i];
      const cx = margin + spacing * (i + 1);

      if (i < n - 1) {
        const nx = margin + spacing * (i + 2);
        drawWire(ctx, cx + spiderR + 2, botY, nx - spiderR - 2, botY, '#4c1d1d', 1);
      }

      drawSpider(ctx, cx, botY, spiderR, 'X', sp.phase, sp.magnitude,
        `${sp.prime}`, false);
    }

    // Bridge (Hadamard box in center)
    const lastDirectX = margin + spacing * n;
    const firstDualX = margin + spacing;

    // Bridge connection wires
    drawWire(ctx, lastDirectX + spiderR, topY, bridgeX, bridgeY - 16, '#f59e0b80', 1.5);
    drawWire(ctx, bridgeX, bridgeY + 16, firstDualX - spiderR, botY, '#f59e0b80', 1.5);

    // Hadamard box
    drawSpider(ctx, bridgeX, bridgeY, 22, 'H', null, diagram.bridge.magnitude, 'χ(s)', true);

    // Bridge status
    const bridgeColor = diagram.bridge.isUnitary ? '#10b981' : '#ef4444';
    ctx.fillStyle = bridgeColor;
    ctx.font = 'bold 10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText(diagram.bridge.isUnitary ? '|χ| = 1 (unitary)' : `|χ| = ${diagram.bridge.magnitude.toFixed(3)}`, bridgeX, bridgeY + 36);

    // Symmetry indicator
    if (Math.abs(sigma - 0.5) < 0.03) {
      ctx.fillStyle = 'rgba(16,185,129,0.1)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLOR SYMMETRY: Z ↔ X (σ = ½)', w / 2, h - 16);
    }

    // Labels
    ctx.fillStyle = '#475569';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'right';
    ctx.fillText(`|∏ Z| = ${diagram.direct.totalMagnitude.toFixed(4)}`, w - margin, topY + 30);
    ctx.fillText(`|∏ X| = ${diagram.dual.totalMagnitude.toFixed(4)}`, w - margin, botY + 30);

    // Legend
    const legendX = w - margin - 140;
    const legendY = 12;
    ctx.fillStyle = 'rgba(10,14,26,0.85)';
    ctx.fillRect(legendX - 6, legendY - 4, 148, 52);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 6, legendY - 4, 148, 52);

    const legendItems = [
      { color: '#10b981', shape: 'circle', label: 'Z-spider (direct)' },
      { color: '#ef4444', shape: 'circle', label: 'X-spider (dual)' },
      { color: '#f59e0b', shape: 'square', label: 'H-box (bridge χ)' },
    ];
    legendItems.forEach((item, i) => {
      const ly = legendY + 6 + i * 15;
      if (item.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(legendX + 5, ly, 4, 0, Math.PI * 2);
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(legendX + 1, ly - 4, 8, 8);
      }
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 14, ly + 3);
    });

  }, [diagram, sigma]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 360, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {diagram.direct.totalMagnitude.toFixed(4)}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>|Direct| = |ζ(s)|</div>
        </div>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {diagram.bridge.magnitude.toFixed(4)}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>|χ(s)| bridge</div>
        </div>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {diagram.dual.totalMagnitude.toFixed(4)}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>|Dual| = |ζ(1−s)|</div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Rewrite Rules ────────────────────────────────────────────────────

function RewriteRulesTab({ sigma, t, numPrimes }) {
  const [activeRule, setActiveRule] = useState('fusion');

  const s = useMemo(() => [sigma, t], [sigma, t]);

  const fusionData = useMemo(() => {
    const diagram = directLadderDiagram(s, Math.min(numPrimes, 6));
    if (diagram.spiders.length < 2) return null;
    const fused = spiderFusion(diagram.spiders[0], diagram.spiders[1]);
    return { before: [diagram.spiders[0], diagram.spiders[1]], after: fused, diagram };
  }, [s, numPrimes]);

  const colorChangeData = useMemo(() => {
    const diagram = directLadderDiagram(s, 3);
    const changed = diagram.spiders.map(sp => colorChange(sp, s));
    return { before: diagram.spiders, after: changed };
  }, [s]);

  const bialgebra = useMemo(() => bialgebraExpansion(s, Math.min(numPrimes, 6), 20), [s, numPrimes]);

  const rules = [
    { id: 'fusion', label: 'Spider Fusion', color: '#10b981' },
    { id: 'color', label: 'Color Change', color: '#8b5cf6' },
    { id: 'bialgebra', label: 'Bialgebra', color: '#06b6d4' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {rules.map(r => (
          <button key={r.id}
            className={`filter-btn ${activeRule === r.id ? 'active' : ''}`}
            onClick={() => setActiveRule(r.id)}
            style={{ borderColor: activeRule === r.id ? r.color : undefined }}
          >{r.label}</button>
        ))}
      </div>

      {activeRule === 'fusion' && fusionData && (
        <div className="card" style={{ background: '#0a0e1a' }}>
          <h4 style={{ color: '#10b981', fontSize: 13, marginBottom: 12 }}>
            Spider Fusion: merge adjacent same-color spiders (phases add)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
            {/* Before */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>BEFORE</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', border: '2px solid #10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#0f2922', fontSize: 11, color: '#10b981', fontWeight: 700,
                }}>
                  p={fusionData.before[0].prime}
                </div>
                <span style={{ color: '#334155' }}>—</span>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', border: '2px solid #10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#0f2922', fontSize: 11, color: '#10b981', fontWeight: 700,
                }}>
                  p={fusionData.before[1].prime}
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
                α₁ = {fusionData.before[0].phase.toFixed(3)}, α₂ = {fusionData.before[1].phase.toFixed(3)}
              </div>
            </div>
            {/* Arrow */}
            <div style={{ fontSize: 24, color: '#10b981' }}>→</div>
            {/* After */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>AFTER</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', border: '3px solid #10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#10b981', fontSize: 10, color: '#fff', fontWeight: 700,
                }}>
                  {fusionData.before[0].prime}·{fusionData.before[1].prime}
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#10b981', marginTop: 6 }}>
                α = {fusionData.after.phase.toFixed(3)} (= α₁ + α₂)
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
            <InlineMath tex={"H_{" + fusionData.before[0].prime + "} \\cdot H_{" + fusionData.before[1].prime + "} = H_{\\text{fused}}"} />
            <span style={{ marginLeft: 8 }}>
              |{fusionData.before[0].magnitude.toFixed(3)}| · |{fusionData.before[1].magnitude.toFixed(3)}| = |{fusionData.after.magnitude.toFixed(3)}|
            </span>
          </div>
        </div>
      )}

      {activeRule === 'color' && colorChangeData && (
        <div className="card" style={{ background: '#0a0e1a' }}>
          <h4 style={{ color: '#8b5cf6', fontSize: 13, marginBottom: 12 }}>
            Color Change: Hadamard on every leg converts Z ↔ X (functional equation)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>DIRECT (Z-spiders)</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {colorChangeData.before.map((sp, i) => (
                  <div key={i} style={{
                    width: 40, height: 40, borderRadius: '50%', border: '2px solid #10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#0f2922', fontSize: 10, color: '#10b981', fontWeight: 600,
                  }}>
                    {sp.prime}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 36, height: 36, border: '2px solid #f59e0b', borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#f59e0b20', fontSize: 10, color: '#f59e0b', fontWeight: 700,
                margin: '0 auto',
              }}>H</div>
              <div style={{ fontSize: 9, color: '#f59e0b', marginTop: 4 }}>χ(s)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>DUAL (X-spiders)</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {colorChangeData.after.map((sp, i) => (
                  <div key={i} style={{
                    width: 40, height: 40, borderRadius: '50%', border: '2px solid #ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#2a0f0f', fontSize: 10, color: '#ef4444', fontWeight: 600,
                  }}>
                    {colorChangeData.before[i].prime}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
            At σ = {sigma.toFixed(2)}: |χ(s)| = {createHadamardBox([sigma, t]).magnitude.toFixed(4)}
            {Math.abs(sigma - 0.5) < 0.03 && <span style={{ color: '#10b981', marginLeft: 8 }}>≈ 1 (unitary — lossless color change)</span>}
          </div>
        </div>
      )}

      {activeRule === 'bialgebra' && (
        <div className="card" style={{ background: '#0a0e1a' }}>
          <h4 style={{ color: '#06b6d4', fontSize: 13, marginBottom: 12 }}>
            Bialgebra: Euler product ↔ Dirichlet series expansion
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>
                Product form (Z-spider chain)
              </div>
              {bialgebra.productSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-block', width: 20, height: 20, borderRadius: '50%',
                    border: '1.5px solid #10b981', background: '#0f2922', textAlign: 'center',
                    lineHeight: '20px', fontSize: 8, color: '#10b981', fontWeight: 700,
                  }}>{step.prime}</span>
                  <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}>
                    |∏| = {step.cumulativeMag.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#06b6d4', fontWeight: 600, marginBottom: 8 }}>
                Sum form (expanded terms)
              </div>
              <div style={{ maxHeight: 200, overflow: 'auto' }}>
                {bialgebra.sumTerms.slice(0, 15).map((term, i) => (
                  <div key={i} style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
                    n={term.n}: |n<sup>-s</sup>| = {term.magnitude.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#0f1225', borderRadius: 6, fontSize: 11 }}>
            <span style={{ color: '#10b981' }}>Product: {bialgebra.productMag.toFixed(6)}</span>
            <span style={{ color: '#64748b', margin: '0 8px' }}>vs</span>
            <span style={{ color: '#06b6d4' }}>Sum: {bialgebra.sumMag.toFixed(6)}</span>
            <span style={{ color: '#64748b', margin: '0 8px' }}>|Δ| = {bialgebra.agreement.toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Symmetry Analysis ────────────────────────────────────────────────

function SymmetryTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();

  const scan = useMemo(() => symmetryScan(t, [0.1, 0.9], 80, numPrimes), [t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // σ = 0.5 vertical line
    const halfX = margin.left + ((0.5 - 0.1) / 0.8) * plotW;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(halfX, margin.top);
    ctx.lineTo(halfX, h - margin.bottom);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('σ = ½', halfX, margin.top - 6);

    // Compute max values
    const maxDirect = Math.max(...scan.map(d => d.directMag), 1);
    const maxDual = Math.max(...scan.map(d => d.dualMag), 1);
    const maxMag = Math.max(maxDirect, maxDual);

    // Plot direct magnitude
    ctx.beginPath();
    scan.forEach((d, i) => {
      const x = margin.left + ((d.sigma - 0.1) / 0.8) * plotW;
      const y = h - margin.bottom - (d.directMag / maxMag) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Plot dual magnitude
    ctx.beginPath();
    scan.forEach((d, i) => {
      const x = margin.left + ((d.sigma - 0.1) / 0.8) * plotW;
      const y = h - margin.bottom - (d.dualMag / maxMag) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Plot asymmetry (scaled)
    const maxAsym = Math.max(...scan.map(d => d.asymmetry), 0.01);
    ctx.beginPath();
    scan.forEach((d, i) => {
      const x = margin.left + ((d.sigma - 0.1) / 0.8) * plotW;
      const y = h - margin.bottom - (d.asymmetry / maxAsym) * plotH * 0.5;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Current σ marker
    const curX = margin.left + ((sigma - 0.1) / 0.8) * plotW;
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(curX, margin.top);
    ctx.lineTo(curX, h - margin.bottom);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Y-axis tick labels and gridlines
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (i / yTicks) * maxMag;
      const y = h - margin.bottom - (i / yTicks) * plotH;
      // Gridline
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);
      // Label
      ctx.fillStyle = '#64748b';
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
    }

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let s = 0.1; s <= 0.91; s += 0.1) {
      const x = margin.left + ((s - 0.1) / 0.8) * plotW;
      ctx.fillText(s.toFixed(1), x, h - margin.bottom + 14);
    }
    ctx.fillText('σ', w - margin.right + 10, h - margin.bottom + 14);

    // Y-axis label
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|Euler product|', 0, 0);
    ctx.restore();

    // Legend
    const legendX = margin.left + 8;
    const legendY = margin.top + 10;
    [
      { color: '#10b981', label: '|Direct| (Z-chain)' },
      { color: '#ef4444', label: '|Dual| (X-chain)' },
      { color: '#f59e0b', label: 'Asymmetry' },
    ].forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY + i * 14, 12, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 16, legendY + i * 14 + 4);
    });

  }, [scan, sigma]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Find the point closest to σ=0.5
  const criticalPoint = scan.find(d => Math.abs(d.sigma - 0.5) < 0.008) || scan[Math.floor(scan.length / 2)];

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 320, borderRadius: 8, border: '1px solid #1e293b' }}
      />
      <div className="card" style={{ marginTop: 12, padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>
        <p>
          At <strong style={{ color: '#10b981' }}>σ = ½</strong>, the Z-chain (green) and X-chain (red) magnitudes
          should converge — this is the <strong>color symmetry</strong> fixed point where the diagram has perfect
          Z ↔ X reflection symmetry. The <strong style={{ color: '#f59e0b' }}>asymmetry</strong> (gold) measures
          how far the diagram is from this symmetric state.
        </p>
        {criticalPoint && (
          <p style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            At σ = 0.5: |Z| = {criticalPoint.directMag.toFixed(4)}, |X| = {criticalPoint.dualMag.toFixed(4)},
            asymmetry = {criticalPoint.asymmetry.toFixed(4)}, |χ| = {criticalPoint.bridgeMag.toFixed(4)}
            {criticalPoint.bridgeUnitary && <span style={{ color: '#10b981' }}> (unitary)</span>}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ZXCalculusViz() {
  const [tab, setTab] = useState(0);
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(8);

  const sigmaColor = Math.abs(sigma - 0.5) < 0.02 ? '#10b981'
    : Math.abs(sigma - 0.5) < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"\\sigma"} /></label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t" /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
          {(() => {
            let bestIdx = 0, bestDist = Math.abs(t - ZETA_ZEROS[0]);
            for (let i = 1; i < ZETA_ZEROS.length; i++) {
              const d = Math.abs(t - ZETA_ZEROS[i]);
              if (d < bestDist) { bestDist = d; bestIdx = i; }
              if (ZETA_ZEROS[i] > t + 2) break;
            }
            return bestDist < 1 ? (
              <span
                style={{
                  marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: bestDist < 0.3 ? '#10b981' : '#64748b',
                  cursor: 'pointer', borderBottom: '1px dashed currentColor',
                }}
                title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(6)}`}
                onClick={() => setT(ZETA_ZEROS[bestIdx])}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="3" max="15" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {TABS.map((label, i) => (
          <button key={label}
            className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >{label}</button>
        ))}
      </div>

      {/* Tab explainers */}
      {tab === 0 && (
        <div className="tab-explainer accent-green">
          Each prime <InlineMath tex="p" /> becomes a <strong>Z-spider</strong> with phase <InlineMath tex={"\\alpha_p = -t\\log p"} /> and
          magnitude <InlineMath tex={"p^{-\\sigma}"} />. The cascade product of all spiders gives the Euler product
          for <InlineMath tex={"\\zeta(s)"} />. Toggle <em>Fused</em> to see spider fusion collapse the chain into a single node
          whose phase is the total phase accumulation.
        </div>
      )}
      {tab === 1 && (
        <div className="tab-explainer accent-purple">
          The twin ladder shows the <strong>direct</strong> path (green, <InlineMath tex={"\\zeta(s)"} />) and <strong>dual</strong> path
          (red, <InlineMath tex={"\\zeta(1-s)"} />) connected by the <strong>bridge</strong> <InlineMath tex={"\\chi(s)"} /> (gold).
          At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> the bridge becomes unitary and both ladders have equal magnitude —
          this is the functional equation rendered as a ZX diagram.
        </div>
      )}
      {tab === 2 && (
        <div className="tab-explainer accent-blue">
          Three ZX rewrite rules applied to the zeta diagram: <strong>Spider Fusion</strong> merges adjacent same-color
          spiders (phases add, magnitudes multiply), <strong>Color Change</strong> swaps Z ↔ X spiders via the Hadamard
          box (connecting direct and dual representations), and <strong>Bialgebra</strong> expands the Euler product into
          its Dirichlet series using the copy-multiply interaction.
        </div>
      )}
      {tab === 3 && (
        <div className="tab-explainer accent-yellow">
          Scans <InlineMath tex={"\\sigma"} /> across the critical strip and plots the magnitude of the Z-chain (direct) vs
          X-chain (dual). At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> the two curves cross — the diagram has perfect
          Z ↔ X <strong>color symmetry</strong>. The gold asymmetry curve measures the gap; its zero at the critical line
          is the functional equation's fixed point.
        </div>
      )}

      {/* Tab content */}
      {tab === 0 && <SpiderChainTab sigma={sigma} t={t} numPrimes={numPrimes} />}
      {tab === 1 && <TwinLadderTab sigma={sigma} t={t} numPrimes={numPrimes} />}
      {tab === 2 && <RewriteRulesTab sigma={sigma} t={t} numPrimes={numPrimes} />}
      {tab === 3 && <SymmetryTab sigma={sigma} t={t} numPrimes={numPrimes} />}
    </div>
  );
}
