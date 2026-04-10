import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  entropySigmaScan, capacitySigmaScan, mutualInfoSigmaScan,
  fisherSigmaScan, klDivergenceScan, rateDistortion, criticalLineOptimality,
  eulerProductEntropy, channelCapacity, mutualInformation, fisherInformation,
  klDivergenceFromEquilibrium,
} from '../math/information-theory.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

const TABS = ['Entropy', 'Channel Capacity', 'Mutual Info', 'Fisher Info', 'Rate-Distortion', 'KL Divergence'];
const TAB_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ef4444'];

function drawScanPlot(ctx, w, h, scan, yKey, color, label, sigmaRef, yLabel, logScale = false) {
  const margin = { left: 55, right: 20, top: 30, bottom: 40 };
  const plotW = w - margin.left - margin.right;
  const plotH = h - margin.top - margin.bottom;

  // Axes
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, h - margin.bottom);
  ctx.lineTo(w - margin.right, h - margin.bottom);
  ctx.stroke();

  const values = scan.map(d => logScale ? Math.log10(Math.max(d[yKey], 1e-20)) : d[yKey]);
  const sigmas = scan.map(d => d.sigma);
  const minS = Math.min(...sigmas);
  const maxS = Math.max(...sigmas);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const vRange = maxV - minV || 1;

  // σ = 0.5 line
  const halfX = margin.left + ((0.5 - minS) / (maxS - minS)) * plotW;
  ctx.beginPath();
  ctx.setLineDash([4, 3]);
  ctx.moveTo(halfX, margin.top);
  ctx.lineTo(halfX, h - margin.bottom);
  ctx.strokeStyle = '#10b98180';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  ctx.font = '9px var(--font-mono)';
  ctx.textAlign = 'center';
  ctx.fillText('σ = ½', halfX, margin.top - 6);

  // Current σ
  if (sigmaRef !== undefined) {
    const refX = margin.left + ((sigmaRef - minS) / (maxS - minS)) * plotW;
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(refX, margin.top);
    ctx.lineTo(refX, h - margin.bottom);
    ctx.strokeStyle = '#e2e8f080';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Plot curve
  ctx.beginPath();
  scan.forEach((d, i) => {
    const x = margin.left + ((d.sigma - minS) / (maxS - minS)) * plotW;
    const y = h - margin.bottom - ((values[i] - minV) / vRange) * plotH * 0.85;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill under curve
  ctx.lineTo(margin.left + plotW, h - margin.bottom);
  ctx.lineTo(margin.left, h - margin.bottom);
  ctx.closePath();
  ctx.fillStyle = color + '10';
  ctx.fill();

  // X-axis labels
  ctx.fillStyle = '#64748b';
  ctx.font = '10px var(--font-mono)';
  ctx.textAlign = 'center';
  for (let s = Math.ceil(minS * 5) / 5; s <= maxS; s += 0.2) {
    const x = margin.left + ((s - minS) / (maxS - minS)) * plotW;
    ctx.fillText(s.toFixed(1), x, h - margin.bottom + 14);
  }
  ctx.fillText('σ', w - margin.right + 10, h - margin.bottom + 14);

  // Y-axis tick labels
  ctx.fillStyle = '#64748b';
  ctx.font = '9px var(--font-mono)';
  ctx.textAlign = 'right';
  const numYTicks = 5;
  for (let i = 0; i <= numYTicks; i++) {
    const frac = i / numYTicks;
    const val = minV + frac * vRange;
    const y = h - margin.bottom - frac * plotH * 0.85;
    const label_text = logScale ? Math.pow(10, val).toExponential(0) :
      Math.abs(val) >= 100 ? val.toFixed(0) : val.toFixed(2);
    ctx.fillText(label_text, margin.left - 6, y + 3);
    // Horizontal gridline
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(margin.left + plotW, y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Y-axis label
  ctx.save();
  ctx.translate(12, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = color;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(yLabel || label, 0, 0);
  ctx.restore();

  // Title
  ctx.fillStyle = color;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, margin.left + 8, margin.top + 14);
}

// ─── Entropy Tab ─────────────────────────────────────────────────────────────
function EntropyTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const scan = useMemo(() => entropySigmaScan(t, [0.1, 2.0], 100, numPrimes), [t, numPrimes]);
  const current = useMemo(() => eulerProductEntropy([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    drawScanPlot(ctx, w, h, scan, 'efficiency', '#10b981', 'Entropy Efficiency', sigma, 'H / H_max');
  }, [scan, sigma]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 260, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'H (bits)', value: current.entropy.toFixed(3), color: '#10b981' },
          { label: 'H_max', value: current.maxEntropy.toFixed(3), color: '#3b82f6' },
          { label: 'Efficiency', value: (current.efficiency * 100).toFixed(1) + '%', color: current.efficiency > 0.9 ? '#10b981' : '#f59e0b' },
          { label: 'Total E', value: current.totalEnergy.toFixed(2), color: '#64748b' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        At <strong style={{ color: '#10b981' }}>σ = ½</strong>, the direct and dual ladder weight distributions
        coincide via the functional equation, maximizing entropy efficiency. Small primes still dominate
        (the distribution is not uniform), but the symmetry between ladders is exact. Moving σ away breaks this
        symmetry and reduces the entropy ratio H/H_max.
      </div>
    </div>
  );
}

// ─── Channel Capacity Tab ────────────────────────────────────────────────────
function CapacityTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const scan = useMemo(() => capacitySigmaScan(t, [0.1, 2.0], 100, numPrimes), [t, numPrimes]);
  const current = useMemo(() => channelCapacity([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    drawScanPlot(ctx, w, h, scan, 'capacity', '#3b82f6', 'Channel Capacity (bits)', sigma, 'C (bits)');
  }, [scan, sigma]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 260, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Capacity', value: current.capacity.toFixed(2) + ' bits', color: '#3b82f6' },
          { label: 'SNR', value: current.snrDB.toFixed(1) + ' dB', color: '#10b981' },
          { label: 'Signal P', value: current.signalPower.toFixed(3), color: '#f59e0b' },
          { label: 'Bridge Loss', value: current.bridgeLoss.toFixed(4), color: current.bridgeLoss < 0.01 ? '#10b981' : '#ef4444' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        The twin-ladder acts as a Gaussian channel: <InlineMath tex={"C = \\tfrac{1}{2}\\log_2(1 + \\text{SNR})"} />.
        At <strong style={{ color: '#3b82f6' }}>σ = ½</strong>, the bridge is unitary (|χ| = 1) and impedances are
        conjugate-matched (Z<sub>dual</sub> = Z̄<sub>dir</sub>), minimizing mismatch noise and maximizing capacity.
        SNR peaks especially near zeta zeros where signal power spikes.
      </div>
    </div>
  );
}

// ─── Mutual Information Tab ──────────────────────────────────────────────────
function MutualInfoTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const scan = useMemo(() => mutualInfoSigmaScan(t, [0.1, 2.0], 100, numPrimes), [t, numPrimes]);
  const current = useMemo(() => mutualInformation([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    drawScanPlot(ctx, w, h, scan, 'normalizedMI', '#8b5cf6', 'Normalized Mutual Information', sigma, 'I(D;D*) / max');
  }, [scan, sigma]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 260, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'I(D;D*)', value: current.mutualInfo.toFixed(3) + ' bits', color: '#8b5cf6' },
          { label: 'Normalized', value: (current.normalizedMI * 100).toFixed(1) + '%', color: current.normalizedMI > 0.8 ? '#10b981' : '#f59e0b' },
          { label: 'H(Direct)', value: current.directEntropy.toFixed(3), color: '#10b981' },
          { label: '|χ|', value: current.bridgeMagnitude.toFixed(4), color: current.bridgeUnitary ? '#10b981' : '#ef4444' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        Mutual information <InlineMath tex={"I(\\text{Direct};\\text{Dual})"} /> measures the coupling between
        the direct and dual ladders. At <strong style={{ color: '#8b5cf6' }}>σ = ½</strong>, the bridge
        is unitary (<InlineMath tex={"|\\chi|=1"} />) and the ladders are maximally coupled.
        The functional equation <em>is</em> the channel that carries information between them.
      </div>
    </div>
  );
}

// ─── Fisher Information Tab ──────────────────────────────────────────────────
function FisherTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const scan = useMemo(() => fisherSigmaScan(t, [0.1, 0.9], 120, numPrimes), [t, numPrimes]);
  const current = useMemo(() => fisherInformation([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    drawScanPlot(ctx, w, h, scan, 'logFisher', '#f59e0b', 'log₁₀(Fisher Information)', sigma, 'log₁₀ I_F');
  }, [scan, sigma]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 260, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'I_F (Euler)', value: current.fisher.toFixed(2), color: '#f59e0b' },
          { label: 'I_F (ζ)', value: current.zetaFisher.toFixed(2), color: '#ef4444' },
          { label: 'Cramér-Rao', value: current.cramerRao < 1e8 ? current.cramerRao.toExponential(2) : '∞', color: '#3b82f6' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        Fisher information measures how precisely σ can be estimated from the ladder output.
        Near zeros of ζ, <InlineMath tex={"I_F \\to \\infty"} /> — the system "knows" it's at{' '}
        <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> with infinite precision. The Cramér-Rao bound{' '}
        <InlineMath tex={"\\text{Var}(\\hat\\sigma) \\geq 1/I_F"} /> says σ is pinned exactly.
      </div>
    </div>
  );
}

// ─── Rate-Distortion Tab ─────────────────────────────────────────────────────
function RateDistortionTab({ sigma, t }) {
  const canvasRef = useRef();
  const rd = useMemo(() => rateDistortion([sigma, t], 25), [sigma, t]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 55, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const curve = rd.curve;
    const maxDist = Math.max(...curve.map(c => c.relativeDistortion), 0.01);

    // Y-axis tick labels and gridlines
    ctx.font = '9px var(--font-mono)';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    for (let frac = 0; frac <= 1; frac += 0.25) {
      const y = h - margin.bottom - frac * plotH * 0.85;
      ctx.fillText(frac.toFixed(2), margin.left - 6, y + 3);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Plot relative distortion vs number of primes
    ctx.beginPath();
    curve.forEach((c, i) => {
      const x = margin.left + (i / (curve.length - 1)) * plotW;
      const y = h - margin.bottom - (1 - c.relativeDistortion / maxDist) * plotH * 0.85;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots at each prime
    curve.forEach((c, i) => {
      const x = margin.left + (i / (curve.length - 1)) * plotW;
      const y = h - margin.bottom - (1 - c.relativeDistortion / maxDist) * plotH * 0.85;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
    });

    // X-axis labels (primes)
    ctx.fillStyle = '#64748b';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'center';
    curve.forEach((c, i) => {
      if (i % 3 === 0) {
        const x = margin.left + (i / (curve.length - 1)) * plotW;
        ctx.fillText(`${c.prime}`, x, h - margin.bottom + 12);
      }
    });
    ctx.font = '10px var(--font-mono)';
    ctx.fillText('primes', w / 2, h - 4);

    // Y label
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1 − D/D_max (accuracy)', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Rate-Distortion: Primes needed for accuracy', margin.left + 8, margin.top + 14);
  }, [rd]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  const last = rd.curve[rd.curve.length - 1];

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 260, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Primes used', value: rd.curve.length, color: '#06b6d4' },
          { label: 'Final distortion', value: last ? last.relativeDistortion.toExponential(2) : '-', color: '#10b981' },
          { label: 'bits/prime', value: last ? last.bitsPerPrime.toFixed(2) : '-', color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        Each prime adds information about ζ(s). The rate-distortion curve shows how quickly the
        partial Euler product converges. Small primes (2, 3, 5) provide the most information per bit;
        large primes provide diminishing returns. This is the information-theoretic content of the
        fundamental theorem of arithmetic.
      </div>
    </div>
  );
}

// ─── KL Divergence Tab ───────────────────────────────────────────────────────
function KLDivergenceTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const scan = useMemo(() => klDivergenceScan(t, [0.1, 2.0], 100, numPrimes), [t, numPrimes]);
  const current = useMemo(() => klDivergenceFromEquilibrium([sigma, t], numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    drawScanPlot(ctx, w, h, scan, 'kl', '#ef4444', 'KL Divergence from Equilibrium (σ = ½)', sigma, 'D_KL (bits)');
  }, [scan, sigma]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 260, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'D_KL', value: current.kl.toFixed(4), color: current.isEquilibrium ? '#10b981' : '#ef4444' },
          { label: 'Jensen-Shannon', value: current.jensenShannon.toFixed(4), color: '#8b5cf6' },
          { label: 'Status', value: current.isEquilibrium ? 'Equilibrium' : 'Non-equilibrium', color: current.isEquilibrium ? '#10b981' : '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        KL divergence <InlineMath tex={"D_{KL}(P_{\\sigma} \\| P_{1/2})"} /> measures how many extra bits
        are needed to describe the system at σ compared to equilibrium at σ = ½.
        At <strong style={{ color: '#10b981' }}>σ = ½</strong>: D<sub>KL</sub> = 0 (no extra cost — system is at equilibrium).
        This connects to the thermodynamic interpretation: D<sub>KL</sub> is proportional to the free energy
        above equilibrium.
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InformationTheoryViz() {
  const [tab, setTab] = useState(0);
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(12);

  const sigmaColor = Math.abs(sigma - 0.5) < 0.02 ? '#10b981'
    : Math.abs(sigma - 0.5) < 0.15 ? '#f59e0b' : '#ef4444';

  const nearestZero = useMemo(() => {
    let bestIdx = -1, bestDist = Infinity;
    for (let i = 0; i < ZETA_ZEROS.length; i++) {
      const d = Math.abs(t - ZETA_ZEROS[i]);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    return bestDist < 1.0 ? { idx: bestIdx, dist: bestDist, gamma: ZETA_ZEROS[bestIdx] } : null;
  }, [t]);

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"\\sigma"} /></label>
          <input type="range" min="0.05" max="1.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t" /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
          {nearestZero && (
            <span
              style={{
                marginLeft: 6, fontSize: 11,
                color: nearestZero.dist < 0.3 ? '#10b981' : '#f59e0b',
                cursor: 'pointer', borderBottom: '1px dashed currentColor',
              }}
              title={`Click to snap t to γ${nearestZero.idx + 1} = ${nearestZero.gamma.toFixed(3)}`}
              onClick={() => setT(+nearestZero.gamma.toFixed(1))}
            >
              ≈ γ<sub>{nearestZero.idx + 1}</sub>={nearestZero.gamma.toFixed(1)}
            </span>
          )}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>

      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {TABS.map((label, i) => (
          <button key={label}
            className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
            style={{ borderColor: tab === i ? TAB_COLORS[i] : undefined }}
          >{label}</button>
        ))}
      </div>

      {tab === 0 && (
        <>
          <div className="tab-explainer accent-green">
            Shannon entropy <InlineMath tex={"H(\\sigma) = -\\sum_k p_k \\log_2 p_k"} /> of the Euler factor weight
            distribution measures how evenly energy is spread across primes. At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
            the functional equation makes direct and dual weight distributions coincide, giving the most balanced
            (though not uniform) weighting.
            <strong> Look for:</strong> entropy peaking near <InlineMath tex={"\\sigma = 0.5"} /> and dropping symmetrically on both sides.
          </div>
          <EntropyTab sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 1 && (
        <>
          <div className="tab-explainer accent-blue">
            Channel capacity <InlineMath tex={"C(\\sigma) = \\tfrac{1}{2}\\log_2(1 + \\text{SNR})"} /> measures the maximum rate at which
            the oscillator chain can transmit information (Shannon-Hartley). The critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> maximizes
            capacity because the conjugate-matched direct/dual ladders minimize (but do not eliminate) impedance mismatch noise, maximizing SNR.
            <strong> Look for:</strong> capacity peaking sharply at <InlineMath tex={"\\sigma = 0.5"} />, especially near zeta zeros where SNR diverges.
          </div>
          <CapacityTab sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 2 && (
        <>
          <div className="tab-explainer accent-purple">
            Mutual information <InlineMath tex={"I(\\sigma) = H_{\\text{dir}} + H_{\\text{dual}} - H_{\\text{joint}}"} /> quantifies
            how much the direct ladder tells you about the dual ladder. At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the
            functional equation symmetry maximizes this coupling.
            <strong> Look for:</strong> mutual information peaking at the critical line, confirming maximum direct-dual correlation.
          </div>
          <MutualInfoTab sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 3 && (
        <>
          <div className="tab-explainer accent-orange">
            Fisher information <InlineMath tex={"I_F(\\sigma) = \\sum_k (\\partial_{\\sigma} \\log |H_k|)^2"} /> measures
            sensitivity of the prime weight distribution to <InlineMath tex={"\\sigma"} /> perturbations. It diverges at
            zeta zeros, creating information-theoretic &ldquo;walls&rdquo; that confine zeros to a sharp locus.
            <strong> Look for:</strong> sharp spikes near zeta zeros and a characteristic saddle shape around <InlineMath tex={"\\sigma = 0.5"} />.
          </div>
          <FisherTab sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 4 && (
        <>
          <div className="tab-explainer accent-cyan">
            Rate-distortion theory asks: how many bits are needed to approximate the zeta function to a given
            accuracy? The rate-distortion curve <InlineMath tex="R(D)" /> shows the fundamental tradeoff between
            compression rate and reconstruction error for the oscillator chain.
            <strong> Look for:</strong> the curve dropping steeply at first (easy gains) then flattening (diminishing returns from more primes).
          </div>
          <RateDistortionTab sigma={sigma} t={t} />
        </>
      )}
      {tab === 5 && (
        <>
          <div className="tab-explainer accent-red">
            <p style={{ margin: '0 0 8px' }}>
              KL divergence measures how far the prime weight distribution at <InlineMath tex={"\\sigma"} /> is from the critical-line reference:
            </p>
            <BlockMath tex={"D_{KL}(P_\\sigma \\| P_{1/2}) = \\sum_k p_k(\\sigma) \\log \\frac{p_k(\\sigma)}{p_k(1/2)}"} />
            <p style={{ margin: '8px 0' }}>
              It acts as a Lyapunov function: non-negative everywhere, zero only at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            </p>
            <p style={{ margin: '4px 0 0' }}>
              <strong>Look for:</strong> a smooth bowl centered at <InlineMath tex={"\\sigma = 0.5"} /> with <InlineMath tex={"D_{KL} = 0"} /> at the minimum.
            </p>
          </div>
          <KLDivergenceTab sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
    </div>
  );
}
