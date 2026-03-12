import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  ladderRungs,
  weightedLadderRungs,
  deformedZScan,
  frozenLadderComparison,
  slackIndex,
  collapseAnimation,
  phaseDiagram,
} from '../math/twin-ladder.js';
import { getPrimes } from '../math/primes.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { InlineMath } from './KaTeXMath.jsx';

function ZeroSnap({ tValue, setTValue }) {
  let bestIdx = 0, bestDist = Math.abs(tValue - ZETA_ZEROS[0]);
  for (let i = 1; i < ZETA_ZEROS.length; i++) {
    const d = Math.abs(tValue - ZETA_ZEROS[i]);
    if (d < bestDist) { bestDist = d; bestIdx = i; }
    if (ZETA_ZEROS[i] > tValue + 2) break;
  }
  if (bestDist >= 1) return null;
  return (
    <span
      style={{
        marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
        color: bestDist < 0.3 ? '#10b981' : '#64748b',
        cursor: 'pointer', borderBottom: '1px dashed currentColor',
      }}
      title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(3)}`}
      onClick={() => setTValue(+ZETA_ZEROS[bestIdx].toFixed(1))}
    >
      {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
    </span>
  );
}

const TABS = [
  { id: 'anatomy', label: 'Ladder Anatomy' },
  { id: 'pressure', label: 'Pressure & Temperature' },
  { id: 'freezing', label: 'Ladder Freezing' },
  { id: 'collapse', label: 'Ground-State Collapse' },
  { id: 'phase', label: 'Phase Diagram' },
];

const SELECTABLE_PRIMES = [2, 3, 5, 7, 11, 13];

export default function TwinLadderViz() {
  const [activeTab, setActiveTab] = useState('anatomy');

  return (
    <div>
      <div className="filter-bar">
        {TABS.map(tab => (
          <button key={tab.id}
            className={`filter-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {activeTab === 'anatomy' && <LadderAnatomyTab />}
        {activeTab === 'pressure' && <PressureTemperatureTab />}
        {activeTab === 'freezing' && <LadderFreezingTab />}
        {activeTab === 'collapse' && <CollapseTab />}
        {activeTab === 'phase' && <PhaseDiagramTab />}
      </div>
    </div>
  );
}

// ─── Tab 1: Ladder Anatomy ──────────────────────────────────────────────────

function LadderAnatomyTab() {
  const canvasRef = useRef();
  const [prime, setPrime] = useState(2);
  const [M, setM] = useState(12);
  const [T, setT] = useState(14.13);

  const rungs = useMemo(() => ladderRungs(prime, M, T), [prime, M, T]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 50, r: 20, t: 30, b: 40 };
    // Left: phasor diagram, Right: amplitude bars
    const phasorW = (W - pad.l - pad.r) * 0.55;
    const barsX = pad.l + phasorW + 40;
    const barsW = W - barsX - pad.r;
    const chartH = H - pad.t - pad.b;

    // ── Phasor diagram (complex plane) ──
    const cx = pad.l + phasorW / 2;
    const cy = pad.t + chartH / 2;
    const radius = Math.min(phasorW, chartH) / 2 - 10;

    // Find max extent for scaling
    let sumRe = 0, sumIm = 0;
    let maxExtent = 0;
    for (const r of rungs) {
      maxExtent = Math.max(maxExtent, Math.abs(sumRe + r.re), Math.abs(sumIm + r.im));
      sumRe += r.re;
      sumIm += r.im;
    }
    maxExtent = Math.max(maxExtent, Math.abs(sumRe), Math.abs(sumIm), 0.5);
    const scale = radius / (maxExtent * 1.2);

    // Grid circle
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#2a3050';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Re', cx + radius + 12, cy + 3);
    ctx.fillText('Im', cx, cy - radius - 6);

    // Draw phasor chain
    let px = cx, py = cy;
    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
                     '#3b82f6', '#14b8a6', '#f97316', '#a855f7', '#6366f1', '#22c55e'];

    for (let i = 0; i < rungs.length; i++) {
      const r = rungs[i];
      const nx = px + r.re * scale;
      const ny = py - r.im * scale; // canvas y flipped
      const color = colors[i % colors.length];

      // Arrow line
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, 2.5 - i * 0.15);
      ctx.globalAlpha = Math.max(0.3, 1 - i * 0.05);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      // Arrowhead
      const dx = nx - px, dy = ny - py;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 4) {
        const angle = Math.atan2(dy, dx);
        const headLen = Math.min(6, len * 0.3);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx - headLen * Math.cos(angle - 0.4), ny - headLen * Math.sin(angle - 0.4));
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx - headLen * Math.cos(angle + 0.4), ny - headLen * Math.sin(angle + 0.4));
        ctx.stroke();
      }

      // Rung label for first few
      if (i < 6 && len > 8) {
        ctx.fillStyle = color;
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`m=${i}`, nx + 4, ny - 4);
      }

      ctx.globalAlpha = 1;
      px = nx;
      py = ny;
    }

    // Sum vector (origin to tip)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sum dot
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    // Sum label
    const totalRe = rungs.reduce((s, r) => s + r.re, 0);
    const totalIm = rungs.reduce((s, r) => s + r.im, 0);
    const totalAbs = Math.sqrt(totalRe * totalRe + totalIm * totalIm);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`\u03A3 = ${totalRe.toFixed(3)} ${totalIm >= 0 ? '+' : '\u2212'} ${Math.abs(totalIm).toFixed(3)}i`, px + 8, py - 6);
    ctx.fillText(`|\u03A3| = ${totalAbs.toFixed(4)}`, px + 8, py + 8);

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Phasor Chain (p = ${prime})`, cx, 18);

    // ── Amplitude bars ──
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Rung Amplitudes', barsX + barsW / 2, 18);

    const barH = Math.min(20, (chartH - 10) / (M + 1));
    const maxAmp = rungs[0].amp; // m=0 has max amplitude

    for (let i = 0; i < rungs.length; i++) {
      const r = rungs[i];
      const y = pad.t + i * barH;
      const barLen = (r.amp / maxAmp) * barsW * 0.85;
      const color = colors[i % colors.length];

      // Bar
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(barsX, y + 2, barLen, barH - 4);
      ctx.globalAlpha = 1;

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      if (barH >= 10) {
        ctx.fillText(`${i}`, barsX - 4, y + barH / 2 + 3);
      }

      // Value
      if (barLen > 30 && barH >= 10) {
        ctx.fillStyle = '#0a0e1a';
        ctx.textAlign = 'left';
        ctx.fillText(`${r.amp.toFixed(3)}`, barsX + 4, y + barH / 2 + 3);
      }
    }

    // X-axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('m (rung index)', barsX + barsW / 2, H - 8);

  }, [rungs, prime, M]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        Each prime <InlineMath tex="p" /> generates a <strong>ladder</strong> of rungs{' '}
        <InlineMath tex="m = 0, 1, 2, \\ldots" /> with amplitude <InlineMath tex="p^{-m/2}" /> and
        phase <InlineMath tex="m \\cdot T \\cdot \\log p" />. The phasor diagram shows each rung as a
        rotating vector in the complex plane. The sum vector (dashed) is the total ladder contribution
        for this prime. Adjust <InlineMath tex="T" /> to watch the phase spiral.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Prime <InlineMath tex="p" /></label>
          <div style={{ display: 'flex', gap: 4 }}>
            {SELECTABLE_PRIMES.map(p => (
              <button key={p}
                style={{
                  padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: prime === p ? '#06b6d4' : '#1e293b',
                  color: prime === p ? '#0a0e1a' : '#94a3b8',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: prime === p ? 700 : 400,
                }}
                onClick={() => setPrime(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label>Rungs <InlineMath tex="M" /></label>
          <input type="range" min="1" max="30" step="1" value={M}
            onChange={e => setM(+e.target.value)} />
          <span className="control-value">{M}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="T" /> (spectral)</label>
          <input type="range" min="0" max="50" step="0.1" value={T}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{T.toFixed(1)}<ZeroSnap tValue={T} setTValue={setT} /></span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 480 }} />
      </div>
    </div>
  );
}

// ─── Tab 2: Pressure & Temperature ──────────────────────────────────────────

function PressureTemperatureTab() {
  const canvasRef = useRef();
  const [prime, setPrime] = useState(2);
  const [beta, setBeta] = useState(1);
  const [P, setP] = useState(0);
  const [M, setM] = useState(10);

  const primesList = useMemo(() => getPrimes(6), []);

  const unweightedRungs = useMemo(() => ladderRungs(prime, M, 14.13), [prime, M]);
  const weightedRungs = useMemo(() => weightedLadderRungs(prime, M, 14.13, beta, P), [prime, M, beta, P]);
  const scanData = useMemo(
    () => deformedZScan([0, 50], beta, P, primesList, M, 200),
    [beta, P, primesList, M]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 55, r: 20, t: 30, b: 40 };
    const topH = (H - pad.t - pad.b - 30) * 0.4;
    const botH = (H - pad.t - pad.b - 30) * 0.55;
    const botY = pad.t + topH + 30;

    // ── Top: side-by-side bar comparison ──
    const halfW = (W - pad.l - pad.r - 20) / 2;
    const maxAmp = Math.max(
      ...unweightedRungs.map(r => r.amp),
      ...weightedRungs.map(r => r.weightedAmp),
      0.01
    );

    // Unweighted bars
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Unweighted', pad.l + halfW / 2, pad.t - 8);

    const barH = Math.min(18, topH / (M + 1));
    for (let i = 0; i < unweightedRungs.length; i++) {
      const r = unweightedRungs[i];
      const y = pad.t + i * barH;
      const len = (r.amp / maxAmp) * halfW * 0.9;
      ctx.fillStyle = '#3b82f6';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(pad.l, y + 1, len, barH - 2);
      ctx.globalAlpha = 1;
      if (barH >= 10) {
        ctx.fillStyle = '#64748b';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${i}`, pad.l - 3, y + barH / 2 + 3);
      }
    }

    // Weighted bars
    const wX = pad.l + halfW + 20;
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Weighted (\u03B2=${beta.toFixed(1)}, P=${P.toFixed(1)})`, wX + halfW / 2, pad.t - 8);

    for (let i = 0; i < weightedRungs.length; i++) {
      const r = weightedRungs[i];
      const y = pad.t + i * barH;
      const len = (r.weightedAmp / maxAmp) * halfW * 0.9;
      ctx.fillStyle = '#10b981';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(wX, y + 1, Math.max(0, len), barH - 2);
      ctx.globalAlpha = 1;
    }

    // ── Bottom: |Z_TL| scan ──
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|Z_TL(\u00BD+iT; \u03B2, P)| along critical line', W / 2, botY - 8);

    const chartW = W - pad.l - pad.r;
    const xScale = t => pad.l + (t / 50) * chartW;
    const maxZ = Math.max(...scanData.map(d => d.abs), 0.01);
    const yScale = v => botY + botH - (v / maxZ) * botH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let t = 0; t <= 50; t += 10) {
      ctx.beginPath(); ctx.moveTo(xScale(t), botY); ctx.lineTo(xScale(t), botY + botH); ctx.stroke();
    }

    // Y gridlines
    for (let i = 0; i <= 4; i++) {
      const v = (maxZ * i) / 4;
      const y = yScale(v);
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + chartW, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748b';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(1), pad.l - 4, y + 3);
    }

    // Scan curve
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    scanData.forEach((d, i) => {
      const x = xScale(d.t);
      const y = yScale(Math.min(d.abs, maxZ));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under curve
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.beginPath();
    ctx.moveTo(xScale(0), botY + botH);
    scanData.forEach(d => {
      ctx.lineTo(xScale(d.t), yScale(Math.min(d.abs, maxZ)));
    });
    ctx.lineTo(xScale(50), botY + botH);
    ctx.closePath();
    ctx.fill();

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 50; t += 10) {
      ctx.fillText(t.toString(), xScale(t), botY + botH + 14);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('T = Im(s)', W / 2, H - 6);

    // Y-axis label for bottom chart
    ctx.save();
    ctx.translate(14, botY + botH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|Z_TL|', 0, 0);
    ctx.restore();

  }, [unweightedRungs, weightedRungs, scanData, prime, M, beta, P]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        Apply thermodynamic weights <InlineMath tex="e^{-\\beta m\\log p - P\\psi(m\\log p)}" /> to each rung.
        Increasing <InlineMath tex="\\beta" /> (inverse temperature) suppresses higher rungs exponentially.
        Increasing <InlineMath tex="P" /> (pressure) adds a quadratic penalty. The bottom plot shows how{' '}
        <InlineMath tex="|Z_{TL}|" /> changes along the critical line as you deform.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Prime <InlineMath tex="p" /></label>
          <div style={{ display: 'flex', gap: 4 }}>
            {SELECTABLE_PRIMES.map(p => (
              <button key={p}
                style={{
                  padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: prime === p ? '#10b981' : '#1e293b',
                  color: prime === p ? '#0a0e1a' : '#94a3b8',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: prime === p ? 700 : 400,
                }}
                onClick={() => setPrime(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label><InlineMath tex="\\beta" /> (inv. temp)</label>
          <input type="range" min="0" max="20" step="0.1" value={beta}
            onChange={e => setBeta(+e.target.value)} />
          <span className="control-value">{beta.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="P" /> (pressure)</label>
          <input type="range" min="0" max="10" step="0.1" value={P}
            onChange={e => setP(+e.target.value)} />
          <span className="control-value">{P.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Rungs <InlineMath tex="M" /></label>
          <input type="range" min="2" max="20" step="1" value={M}
            onChange={e => setM(+e.target.value)} />
          <span className="control-value">{M}</span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 520 }} />
      </div>
    </div>
  );
}

// ─── Tab 3: Ladder Freezing ─────────────────────────────────────────────────

function LadderFreezingTab() {
  const canvasRef = useRef();
  const [prime, setPrime] = useState(2);
  const [M, setM] = useState(15);
  const [alpha, setAlpha] = useState(2);
  const [T, setT] = useState(14.13);
  const epsilon = 0.01;
  const U = 10;

  const comparisonData = useMemo(() => {
    const data = [];
    const logP = Math.log(prime);
    for (let t = 0.5; t <= 50; t += 0.5) {
      const comp = frozenLadderComparison(prime, M, t, alpha);
      data.push({ t, exact: comp.exact.abs, proxy: Math.abs(comp.proxy), error: comp.error });
    }
    return data;
  }, [prime, M, alpha]);

  const slack = useMemo(() => slackIndex(alpha, T, epsilon, U), [alpha, T]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 55, r: 20, t: 30, b: 40 };
    const topH = (H - pad.t - pad.b - 50) * 0.45;
    const botH = (H - pad.t - pad.b - 50) * 0.45;
    const botY = pad.t + topH + 50;
    const chartW = W - pad.l - pad.r;

    // ── Top: Exact vs Proxy ──
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Exact Ladder vs Gaussian Proxy', W / 2, pad.t - 8);

    const maxVal = Math.max(...comparisonData.map(d => Math.max(d.exact, d.proxy)), 0.01);
    const xScale = t => pad.l + ((t - 0.5) / 49.5) * chartW;
    const yScale = v => pad.t + topH - (v / maxVal) * topH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let t = 0; t <= 50; t += 10) {
      ctx.beginPath(); ctx.moveTo(xScale(t), pad.t); ctx.lineTo(xScale(t), pad.t + topH); ctx.stroke();
    }

    // Exact curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    comparisonData.forEach((d, i) => {
      const x = xScale(d.t);
      const y = yScale(Math.min(d.exact, maxVal));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Proxy curve
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    comparisonData.forEach((d, i) => {
      const x = xScale(d.t);
      const y = yScale(Math.min(d.proxy, maxVal));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(pad.l + 10, pad.t + 6, 14, 3);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Exact', pad.l + 28, pad.t + 12);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(pad.l + 80, pad.t + 6, 14, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Gaussian Proxy', pad.l + 98, pad.t + 12);

    // X-axis
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 50; t += 10) {
      ctx.fillText(t.toString(), xScale(t), pad.t + topH + 14);
    }

    // ── Bottom: Error plot ──
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|Exact - Proxy| Error', W / 2, botY - 8);

    const maxErr = Math.max(...comparisonData.map(d => d.error), 0.001);
    const yScaleErr = v => botY + botH - (v / maxErr) * botH;

    // Grid
    for (let t = 0; t <= 50; t += 10) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(xScale(t), botY); ctx.lineTo(xScale(t), botY + botH); ctx.stroke();
    }

    // Error fill
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.beginPath();
    ctx.moveTo(xScale(0.5), botY + botH);
    comparisonData.forEach(d => {
      ctx.lineTo(xScale(d.t), yScaleErr(Math.min(d.error, maxErr)));
    });
    ctx.lineTo(xScale(50), botY + botH);
    ctx.closePath();
    ctx.fill();

    // Error curve
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    comparisonData.forEach((d, i) => {
      const x = xScale(d.t);
      const y = yScaleErr(Math.min(d.error, maxErr));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 50; t += 10) {
      ctx.fillText(t.toString(), xScale(t), botY + botH + 14);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('T', W / 2, H - 6);

    // Slack index readout
    const slackColor = slack > 5 ? '#10b981' : slack > 0 ? '#f59e0b' : '#ef4444';
    const slackLabel = slack > 5 ? 'SAFE' : slack > 0 ? 'MODERATE' : 'TIGHT';
    ctx.fillStyle = slackColor;
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`\u03A0_slack = ${slack.toFixed(2)} [${slackLabel}]`, W - pad.r, botY + botH + 14);

  }, [comparisonData, slack]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        <strong>Ladder freezing</strong> replaces exact rung sums with a smooth Gaussian proxy{' '}
        <InlineMath tex="\\Phi_{\\text{fr}}(u) = e^{-\\alpha u^2}\\sum c_{2k}u^{2k}" />.
        The <strong>slack index</strong> <InlineMath tex="\\Pi_{\\text{slack}} = (\\alpha - t - \\varepsilon)U^2" /> measures
        how much room remains before the approximation degrades. Green = safe margin; red = tight.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Prime <InlineMath tex="p" /></label>
          <div style={{ display: 'flex', gap: 4 }}>
            {SELECTABLE_PRIMES.map(p => (
              <button key={p}
                style={{
                  padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: prime === p ? '#f59e0b' : '#1e293b',
                  color: prime === p ? '#0a0e1a' : '#94a3b8',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: prime === p ? 700 : 400,
                }}
                onClick={() => setPrime(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label><InlineMath tex="\\alpha" /> (Gaussian width)</label>
          <input type="range" min="0.5" max="5" step="0.1" value={alpha}
            onChange={e => setAlpha(+e.target.value)} />
          <span className="control-value">{alpha.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Rungs <InlineMath tex="M" /></label>
          <input type="range" min="3" max="30" step="1" value={M}
            onChange={e => setM(+e.target.value)} />
          <span className="control-value">{M}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="T" /></label>
          <input type="range" min="1" max="50" step="0.5" value={T}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{T.toFixed(1)}<ZeroSnap tValue={T} setTValue={setT} /></span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 520 }} />
      </div>
    </div>
  );
}

// ─── Tab 4: Ground-State Collapse ───────────────────────────────────────────

function CollapseTab() {
  const canvasRef = useRef();
  const [prime, setPrime] = useState(2);
  const [M, setM] = useState(10);
  const [T, setT] = useState(14.13);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [betaIdx, setBetaIdx] = useState(0);

  const betaSteps = useMemo(() => {
    const steps = [];
    for (let b = 0; b <= 50; b += 0.5) steps.push(b);
    return steps;
  }, []);

  const animData = useMemo(
    () => collapseAnimation(prime, M, T, betaSteps),
    [prime, M, T, betaSteps]
  );

  // Animation loop
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const betaIdxRef = useRef(betaIdx);
  playingRef.current = playing;
  speedRef.current = speed;
  betaIdxRef.current = betaIdx;

  useEffect(() => {
    if (!playing) return;
    let frame;
    let lastTime = 0;
    const tick = (time) => {
      if (!playingRef.current) return;
      if (time - lastTime > 60 / speedRef.current) {
        lastTime = time;
        setBetaIdx(prev => {
          if (prev >= betaSteps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, betaSteps.length]);

  const currentFrame = animData[betaIdx] || animData[0];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 55, r: 20, t: 50, b: 40 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;

    if (!currentFrame) return;
    const { beta, rungs } = currentFrame;

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Ground-State Collapse (p = ${prime}, \u03B2 = ${beta.toFixed(1)})`, W / 2, 22);

    // Description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(
      beta < 1 ? 'All rungs active \u2014 delocalized' :
      beta < 5 ? 'Higher rungs suppressing...' :
      beta < 20 ? 'Approaching ground state' :
      'Ground state: only m=0 survives',
      W / 2, 38
    );

    const barW = Math.min(40, (chartW - 20) / (M + 1));
    const maxAmp = rungs[0]?.amp || 1;

    for (let i = 0; i < rungs.length; i++) {
      const r = rungs[i];
      const x = pad.l + i * barW + 5;
      const fullH = (r.amp / maxAmp) * chartH * 0.85;
      const weightedH = (r.weightedAmp / maxAmp) * chartH * 0.85;

      // Ghost bar (full unweighted amplitude)
      ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
      ctx.fillRect(x, pad.t + chartH - fullH, barW - 4, fullH);

      // Weighted bar
      const hue = r.weight > 0.5 ? '#10b981' : r.weight > 0.1 ? '#f59e0b' : '#ef4444';
      ctx.fillStyle = hue;
      ctx.globalAlpha = Math.max(0.15, r.weight);
      ctx.fillRect(x, pad.t + chartH - weightedH, barW - 4, weightedH);
      ctx.globalAlpha = 1;

      // Rung label
      if (barW >= 14) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${i}`, x + (barW - 4) / 2, pad.t + chartH + 12);
      }

      // Weight annotation for first few
      if (i < 8 && barW >= 14) {
        ctx.fillStyle = hue;
        ctx.font = '7px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const wStr = r.weight > 0.01 ? r.weight.toFixed(2) : r.weight.toExponential(0);
        ctx.fillText(wStr, x + (barW - 4) / 2, pad.t + chartH - weightedH - 4);
      }
    }

    // X axis
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Rung index m', W / 2, H - 8);

    // Y axis label
    ctx.save();
    ctx.translate(14, pad.t + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Weighted amplitude', 0, 0);
    ctx.restore();

  }, [currentFrame, prime, M]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-red">
        As <InlineMath tex="\\beta \\to \\infty" />, the thermodynamic weight{' '}
        <InlineMath tex="e^{-\\beta m\\log p}" /> kills every rung except <InlineMath tex="m = 0" />.
        This is <strong>ground-state collapse</strong>: the entire ladder collapses to its trivial
        (identity) contribution. Play the animation to watch higher rungs fade away.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Prime <InlineMath tex="p" /></label>
          <div style={{ display: 'flex', gap: 4 }}>
            {SELECTABLE_PRIMES.map(p => (
              <button key={p}
                style={{
                  padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: prime === p ? '#ef4444' : '#1e293b',
                  color: prime === p ? '#fff' : '#94a3b8',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: prime === p ? 700 : 400,
                }}
                onClick={() => { setPrime(p); setBetaIdx(0); }}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <button
            style={{
              padding: '6px 16px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: playing ? '#ef4444' : '#10b981', color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
            }}
            onClick={() => {
              if (!playing && betaIdx >= betaSteps.length - 1) setBetaIdx(0);
              setPlaying(!playing);
            }}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            style={{
              padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: '#1e293b', color: '#94a3b8',
              fontFamily: 'var(--font-mono)', fontSize: 12, marginLeft: 4,
            }}
            onClick={() => { setPlaying(false); setBetaIdx(0); }}>
            Reset
          </button>
        </div>
        <div className="control-group">
          <label>Speed</label>
          <input type="range" min="0.5" max="4" step="0.5" value={speed}
            onChange={e => setSpeed(+e.target.value)} />
          <span className="control-value">{speed}x</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="\\beta" /></label>
          <input type="range" min="0" max={betaSteps.length - 1} step="1" value={betaIdx}
            onChange={e => { setBetaIdx(+e.target.value); setPlaying(false); }} />
          <span className="control-value" style={{
            color: currentFrame?.beta < 1 ? '#10b981' : currentFrame?.beta < 10 ? '#f59e0b' : '#ef4444'
          }}>{currentFrame?.beta.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Rungs <InlineMath tex="M" /></label>
          <input type="range" min="3" max="20" step="1" value={M}
            onChange={e => { setM(+e.target.value); setBetaIdx(0); }} />
          <span className="control-value">{M}</span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 480 }} />
      </div>
    </div>
  );
}

// ─── Tab 5: Phase Diagram ───────────────────────────────────────────────────

function PhaseDiagramTab() {
  const canvasRef = useRef();
  const [T, setT] = useState(14.13);
  const [M, setM] = useState(6);
  const [clickPoint, setClickPoint] = useState(null);

  const primesList = useMemo(() => getPrimes(6), []);

  const diagram = useMemo(
    () => phaseDiagram([0, 15], [0, 8], primesList, M, T, 35),
    [primesList, M, T]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 60, r: 80, t: 40, b: 50 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;
    const { grid, resolution, maxVal } = diagram;

    const cellW = chartW / (resolution + 1);
    const cellH = chartH / (resolution + 1);

    // Heatmap
    for (const pt of grid) {
      const x = pad.l + ((pt.beta - 0) / 15) * chartW;
      const y = pad.t + chartH - ((pt.P - 0) / 8) * chartH;
      const norm = maxVal > 0 ? pt.abs / maxVal : 0;

      // Color: dark blue → cyan → yellow → white
      let r, g, b;
      if (norm < 0.25) {
        const t = norm / 0.25;
        r = Math.round(10 + t * 0); g = Math.round(14 + t * 70); b = Math.round(26 + t * 130);
      } else if (norm < 0.5) {
        const t = (norm - 0.25) / 0.25;
        r = Math.round(10 + t * 6); g = Math.round(84 + t * 98); b = Math.round(156 + t * 56);
      } else if (norm < 0.75) {
        const t = (norm - 0.5) / 0.25;
        r = Math.round(16 + t * 229); g = Math.round(182 + t * 64); b = Math.round(212 - t * 180);
      } else {
        const t = (norm - 0.75) / 0.25;
        r = Math.round(245 + t * 10); g = Math.round(246 - t * 88); b = Math.round(32 + t * 200);
      }

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x - cellW / 2, y - cellH / 2, cellW + 1, cellH + 1);
    }

    // Axis labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Phase Diagram: |Z_TL| at T = ${T.toFixed(1)}`, W / 2, 22);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('\u03B2 (inverse temperature)', pad.l + chartW / 2, H - 8);

    ctx.save();
    ctx.translate(14, pad.t + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('P (pressure)', 0, 0);
    ctx.restore();

    // X ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let b = 0; b <= 15; b += 3) {
      const x = pad.l + (b / 15) * chartW;
      ctx.fillText(b.toString(), x, pad.t + chartH + 14);
      ctx.strokeStyle = '#ffffff20';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + chartH); ctx.stroke();
    }

    // Y ticks
    ctx.textAlign = 'right';
    for (let p = 0; p <= 8; p += 2) {
      const y = pad.t + chartH - (p / 8) * chartH;
      ctx.fillText(p.toString(), pad.l - 6, y + 3);
      ctx.strokeStyle = '#ffffff20';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + chartW, y); ctx.stroke();
    }

    // Color bar
    const barX = W - pad.r + 15;
    const barW = 16;
    const barH = chartH;
    for (let i = 0; i <= barH; i++) {
      const norm = 1 - i / barH;
      let r, g, b;
      if (norm < 0.25) {
        const t = norm / 0.25;
        r = Math.round(10 + t * 0); g = Math.round(14 + t * 70); b = Math.round(26 + t * 130);
      } else if (norm < 0.5) {
        const t = (norm - 0.25) / 0.25;
        r = Math.round(10 + t * 6); g = Math.round(84 + t * 98); b = Math.round(156 + t * 56);
      } else if (norm < 0.75) {
        const t = (norm - 0.5) / 0.25;
        r = Math.round(16 + t * 229); g = Math.round(182 + t * 64); b = Math.round(212 - t * 180);
      } else {
        const t = (norm - 0.75) / 0.25;
        r = Math.round(245 + t * 10); g = Math.round(246 - t * 88); b = Math.round(32 + t * 200);
      }
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(barX, pad.t + i, barW, 1);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(maxVal.toFixed(1), barX + barW + 4, pad.t + 8);
    ctx.fillText('0', barX + barW + 4, pad.t + chartH);
    ctx.fillText('|Z|', barX + 2, pad.t - 6);

    // Click point marker
    if (clickPoint) {
      const cpx = pad.l + (clickPoint.beta / 15) * chartW;
      const cpy = pad.t + chartH - (clickPoint.P / 8) * chartH;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cpx, cpy, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `\u03B2=${clickPoint.beta.toFixed(1)} P=${clickPoint.P.toFixed(1)} |Z|=${clickPoint.abs.toFixed(3)}`,
        cpx + 12, cpy - 4
      );
    }

  }, [diagram, T, clickPoint]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  // Click handler
  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pad = { l: 60, r: 80, t: 40, b: 50 };
    const chartW = rect.width - pad.l - pad.r;
    const chartH = rect.height - pad.t - pad.b;

    if (x < pad.l || x > pad.l + chartW || y < pad.t || y > pad.t + chartH) return;

    const beta = ((x - pad.l) / chartW) * 15;
    const P = ((pad.t + chartH - y) / chartH) * 8;

    // Find closest grid point
    const { grid, resolution } = diagram;
    let best = grid[0], bestDist = Infinity;
    for (const pt of grid) {
      const d = (pt.beta - beta) ** 2 + (pt.P - P) ** 2;
      if (d < bestDist) { bestDist = d; best = pt; }
    }

    setClickPoint(best);
  }, [diagram]);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        The 2D phase diagram shows <InlineMath tex="|Z_{TL}|" /> as a heatmap over{' '}
        <InlineMath tex="\\beta" /> (inverse temperature) and <InlineMath tex="P" /> (pressure).
        Bright regions correspond to large <InlineMath tex="|Z_{TL}|" />; dark regions are
        near-zeros. Adjust <InlineMath tex="T" /> to scan different heights on the critical line.
        Click the heatmap to inspect the ladder state at any <InlineMath tex="(\\beta, P)" /> point.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="T" /> (spectral height)</label>
          <input type="range" min="1" max="50" step="0.5" value={T}
            onChange={e => { setT(+e.target.value); setClickPoint(null); }} />
          <span className="control-value">{T.toFixed(1)}<ZeroSnap tValue={T} setTValue={(v) => { setT(v); setClickPoint(null); }} /></span>
        </div>
        <div className="control-group">
          <label>Rungs <InlineMath tex="M" /></label>
          <input type="range" min="3" max="12" step="1" value={M}
            onChange={e => { setM(+e.target.value); setClickPoint(null); }} />
          <span className="control-value">{M}</span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 500, cursor: 'crosshair' }}
          onClick={handleCanvasClick} />
      </div>
    </div>
  );
}
