import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import {
  fisherTwistorCorrelation, klLyapunovAnalysis, phaseBarrierAnalysis,
  fourierInfoSynthesis, unifiedConfinementPotential, confinementLandscape,
  evaluateAttackStrategies, crossCorrelationMatrix,
} from '../math/spectral-attack.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

const TABS = ['Fisher-Twistor', 'Lyapunov', 'Phase Barriers', 'Correlation Matrix', 'Strategy Scores'];
const TAB_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// ─── Tab 1: Fisher-Twistor ──────────────────────────────────────────────────

function FisherTwistorTab({ t, numPrimes }) {
  const canvasRef = useRef();
  const data = useMemo(
    () => fisherTwistorCorrelation(t, [0.1, 0.9], 60, numPrimes),
    [t, numPrimes],
  );

  const scales = useMemo(() => {
    const pts = data.points;
    if (pts.length === 0) return null;
    const sigmas = pts.map(p => p.sigma);
    const minS = Math.min(...sigmas);
    const maxS = Math.max(...sigmas);
    const maxF = Math.max(...pts.map(p => p.fisher), 1);
    const maxI = Math.max(...pts.map(p => p.incidence), 0.01);
    return { minS, maxS, maxF, maxI };
  }, [data]);

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

    const margin = { left: 55, right: 55, top: 30, bottom: 40 };
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
    // Right axis
    ctx.beginPath();
    ctx.moveTo(w - margin.right, margin.top);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    const pts = data.points;
    if (!scales) return;

    const { minS, maxS, maxF, maxI } = scales;

    // Horizontal gridlines
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = h - margin.bottom - (i / 4) * plotH * 0.9;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // sigma = 0.5 dashed line
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
    ctx.fillText('\u03C3 = \u00BD', halfX, margin.top - 6);

    // Fisher info curve (blue, left axis)
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = margin.left + ((p.sigma - minS) / (maxS - minS)) * plotW;
      const y = h - margin.bottom - (p.fisher / maxF) * plotH * 0.9;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill under Fisher
    ctx.lineTo(margin.left + plotW, h - margin.bottom);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.closePath();
    ctx.fillStyle = '#3b82f610';
    ctx.fill();

    // Twistor incidence curve (gold, right axis)
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = margin.left + ((p.sigma - minS) / (maxS - minS)) * plotW;
      const y = h - margin.bottom - (p.incidence / maxI) * plotH * 0.9;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    // Step 0.2 from 0.1 so 0.5 (the critical-line tick) is included alongside 0.3, 0.7, etc.
    for (let s = 0.1; s <= 0.9; s += 0.2) {
      const x = margin.left + ((s - minS) / (maxS - minS)) * plotW;
      ctx.fillText(s.toFixed(1), x, h - margin.bottom + 14);
    }
    ctx.fillText('\u03C3', w / 2, h - 4);

    // Left Y-axis label (Fisher)
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fisher Info', 0, 0);
    ctx.restore();

    // Right Y-axis label (Twistor)
    ctx.save();
    ctx.translate(w - 8, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#eab308';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Twistor |Z\u00B7W|', 0, 0);
    ctx.restore();

    // Y-axis tick labels (left)
    ctx.fillStyle = '#3b82f6';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4) * maxF;
      const y = h - margin.bottom - (i / 4) * plotH * 0.9;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
    }

    // Y-axis tick labels (right)
    ctx.fillStyle = '#eab308';
    ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4) * maxI;
      const y = h - margin.bottom - (i / 4) * plotH * 0.9;
      ctx.fillText(val.toFixed(2), w - margin.right + 6, y + 3);
    }

    // Legend
    const legendItems = [
      { color: '#3b82f6', label: 'Fisher Info (left axis)' },
      { color: '#eab308', label: 'Twistor |Z\u00B7W| (right axis)' },
    ];
    const legBoxX = margin.left + 4;
    const legBoxY = margin.top + 0;
    const legBoxW = 170;
    const legBoxH = legendItems.length * 14 + 8;
    ctx.fillStyle = 'rgba(10,14,26,0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legBoxX, legBoxY, legBoxW, legBoxH, 4);
    ctx.fill();
    ctx.stroke();
    legendItems.forEach((item, i) => {
      const iy = legBoxY + 10 + i * 14;
      ctx.beginPath();
      ctx.moveTo(legBoxX + 6, iy);
      ctx.lineTo(legBoxX + 22, iy);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legBoxX + 26, iy + 3);
    });

    // Correlation coefficient in corner
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px var(--font-mono)';
    ctx.textAlign = 'right';
    ctx.fillText(`r = ${data.correlation.toFixed(3)}`, w - margin.right - 8, margin.top + 14);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.fillText('Pearson correlation', w - margin.right - 8, margin.top + 26);
  }, [data, scales]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        Fisher information <InlineMath tex={"I_F(\\sigma)"} /> measures parameter sensitivity of the Euler factor
        distribution, while the twistor incidence <InlineMath tex={"|Z \\cdot W|"} /> measures how close the direct/dual
        twistor pair is to the null condition. Their anti-correlation (Pearson <InlineMath tex="r" />) quantifies how
        strongly both diagnostics point to the same critical line.
        <strong> Look for:</strong> Fisher info peaking and twistor incidence dipping together near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: data.correlation < -0.3 ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
        border: `1px solid ${data.correlation < -0.3 ? '#10b981' : '#f59e0b'}40`,
        fontSize: 12,
      }}>
        <strong style={{ color: data.correlation < -0.3 ? '#10b981' : '#f59e0b' }}>
          {data.verdict}
        </strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11 }}>
          Peak Fisher/Incidence ratio at <InlineMath tex={"\\sigma = " + data.peakSigma.toFixed(3)} />.
          Fisher info spikes where twistor incidence vanishes -- both point to the critical line.
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Lyapunov ────────────────────────────────────────────────────────

function LyapunovTab({ t, numPrimes }) {
  const canvasRef = useRef();
  const data = useMemo(() => klLyapunovAnalysis(t, numPrimes), [t, numPrimes]);

  const scales = useMemo(() => {
    const pts = data.points;
    if (pts.length === 0) return null;
    const sigmas = pts.map(p => p.sigma);
    const minS = Math.min(...sigmas);
    const maxS = Math.max(...sigmas);
    const maxKL = Math.max(...pts.map(p => p.kl), 0.01);
    const maxDKL = Math.max(...pts.map(p => Math.abs(p.dkl)), 0.01);
    return { minS, maxS, maxKL, maxDKL };
  }, [data]);

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

    const pts = data.points;
    if (!scales) return;

    const { minS, maxS, maxKL, maxDKL } = scales;

    // Upper half: D_KL (green V-shape)
    const splitY = margin.top + plotH * 0.55;

    // sigma = 0.5 dashed line
    const halfX = margin.left + ((0.5 - minS) / (maxS - minS)) * plotW;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(halfX, margin.top);
    ctx.lineTo(halfX, h - margin.bottom);
    ctx.strokeStyle = '#10b98180';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // D_KL curve (upper region)
    const upperH = splitY - margin.top - 10;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = margin.left + ((p.sigma - minS) / (maxS - minS)) * plotW;
      const y = splitY - (p.kl / maxKL) * upperH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill under D_KL
    ctx.lineTo(margin.left + plotW, splitY);
    ctx.lineTo(margin.left, splitY);
    ctx.closePath();
    ctx.fillStyle = '#10b98110';
    ctx.fill();

    // Separator line
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(margin.left, splitY + 5);
    ctx.lineTo(w - margin.right, splitY + 5);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Lower half: dD_KL/dsigma (red/blue split at zero crossing)
    const lowerH = h - margin.bottom - splitY - 15;
    const lowerMidY = splitY + 10 + lowerH / 2;

    // Zero line for derivative
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(margin.left, lowerMidY);
    ctx.lineTo(w - margin.right, lowerMidY);
    ctx.strokeStyle = '#47556980';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw derivative segments colored by sign
    for (let i = 1; i < pts.length; i++) {
      const x0 = margin.left + ((pts[i - 1].sigma - minS) / (maxS - minS)) * plotW;
      const y0 = lowerMidY - (pts[i - 1].dkl / maxDKL) * lowerH * 0.45;
      const x1 = margin.left + ((pts[i].sigma - minS) / (maxS - minS)) * plotW;
      const y1 = lowerMidY - (pts[i].dkl / maxDKL) * lowerH * 0.45;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      // negative derivative (σ < 0.5) -> red; positive (σ > 0.5) -> blue
      ctx.strokeStyle = pts[i].dkl < 0 ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let s = 0.1; s <= 0.9; s += 0.2) {
      const x = margin.left + ((s - minS) / (maxS - minS)) * plotW;
      ctx.fillText(s.toFixed(1), x, h - margin.bottom + 14);
    }
    ctx.fillText('\u03C3', w / 2, h - 4);

    // Labels
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('D_KL(\u03C3)', margin.left + 8, margin.top + 14);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('dD_KL/d\u03C3', margin.left + 8, splitY + 18);

    // Y-axis label
    ctx.save();
    ctx.translate(12, margin.top + upperH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#10b981';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('D_KL (bits)', 0, 0);
    ctx.restore();

    // Legend for derivative colors (lower section)
    const legX = w - margin.right - 140;
    const legY = splitY + 14;
    ctx.fillStyle = 'rgba(10,14,26,0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillRect(legX, legY, 140, 34);
    ctx.strokeRect(legX, legY, 140, 34);
    [
      { color: '#ef4444', label: 'dD_KL/d\u03C3 < 0 (\u03C3 < \u00BD)' },
      { color: '#3b82f6', label: 'dD_KL/d\u03C3 > 0 (\u03C3 > \u00BD)' },
    ].forEach((item, i) => {
      const iy = legY + 10 + i * 14;
      ctx.beginPath();
      ctx.moveTo(legX + 6, iy);
      ctx.lineTo(legX + 22, iy);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legX + 26, iy + 3);
    });
  }, [data, scales]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        The KL divergence <InlineMath tex={"D_{KL}(\\sigma \\| \\tfrac{1}{2})"} /> measures how far the Euler factor
        weight distribution at <InlineMath tex={"\\sigma"} /> is from the critical-line distribution. If it forms a
        valid Lyapunov function (positive, zero at equilibrium, monotonically decreasing toward <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />),
        the critical line is a stable attractor. The lower panel shows the derivative <InlineMath tex={"dD_{KL}/d\\sigma"} />,
        colored by sign.
        <strong> Look for:</strong> the V-shape in <InlineMath tex="D_{KL}" /> with minimum at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
        and a clean sign change in the derivative.
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Monotone Left', ok: data.monotoneLeft },
          { label: 'Zero at \u00BD', ok: data.zeroAtHalf },
          { label: 'Monotone Right', ok: data.monotoneRight },
        ].map(b => (
          <div key={b.label} style={{
            padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: b.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${b.ok ? '#10b981' : '#ef4444'}40`,
            color: b.ok ? '#10b981' : '#ef4444',
          }}>
            {b.label} {b.ok ? '\u2713' : '\u2717'}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: data.isLyapunov ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
        border: `1px solid ${data.isLyapunov ? '#10b981' : '#f59e0b'}40`,
        fontSize: 12,
      }}>
        <strong style={{ color: data.isLyapunov ? '#10b981' : '#f59e0b' }}>
          {data.verdict}
        </strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11 }}>
          A valid Lyapunov function must be positive, zero at equilibrium, and monotonically
          decreasing toward that equilibrium. If D_KL satisfies all three, <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is
          a stable fixed point.
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Phase Barriers ──────────────────────────────────────────────────

function PhaseBarriersTab({ t, numPrimes }) {
  const canvasRef = useRef();
  const data = useMemo(() => phaseBarrierAnalysis(t, numPrimes), [t, numPrimes]);

  const scales = useMemo(() => {
    const barriers = data.barriers;
    if (barriers.length === 0) return null;
    const sigmas = barriers.map(b => b.sigma);
    const minS = Math.min(...sigmas);
    const maxS = Math.max(...sigmas);
    const maxDeltaF = Math.max(...barriers.map(b => Math.abs(b.deltaF)), 0.01);
    const maxCv = Math.max(...barriers.map(b => Math.abs(b.specificHeat)), 0.01);
    return { minS, maxS, maxDeltaF, maxCv };
  }, [data]);

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

    const margin = { left: 55, right: 55, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const barriers = data.barriers;
    if (!scales) return;

    const { minS, maxS, maxDeltaF, maxCv } = scales;

    // Color-code background regions
    const regionColors = [
      { from: 0.0, to: 0.15, color: '#ef444410', label: 'Vaporized' },
      { from: 0.15, to: 0.4, color: '#f59e0b08', label: 'Strip' },
      { from: 0.4, to: 0.6, color: '#10b98110', label: 'Equilibrium' },
      { from: 0.6, to: 0.85, color: '#f59e0b08', label: 'Strip' },
      { from: 0.85, to: 1.0, color: '#3b82f610', label: 'Frozen' },
    ];
    regionColors.forEach(r => {
      const x0 = margin.left + Math.max(0, ((r.from - minS) / (maxS - minS))) * plotW;
      const x1 = margin.left + Math.min(1, ((r.to - minS) / (maxS - minS))) * plotW;
      if (x1 > x0) {
        ctx.fillStyle = r.color;
        ctx.fillRect(x0, margin.top, x1 - x0, plotH);
      }
    });

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();
    // Right axis
    ctx.beginPath();
    ctx.moveTo(w - margin.right, margin.top);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Delta-F (left axis)
    ctx.beginPath();
    barriers.forEach((b, i) => {
      const x = margin.left + ((b.sigma - minS) / (maxS - minS)) * plotW;
      const y = h - margin.bottom - ((b.deltaF + maxDeltaF) / (2 * maxDeltaF)) * plotH * 0.9;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Specific heat (right axis)
    ctx.beginPath();
    barriers.forEach((b, i) => {
      const x = margin.left + ((b.sigma - minS) / (maxS - minS)) * plotW;
      const y = h - margin.bottom - (Math.abs(b.specificHeat) / maxCv) * plotH * 0.9;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // sigma = 0.5 line
    const halfX = margin.left + ((0.5 - minS) / (maxS - minS)) * plotW;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(halfX, margin.top);
    ctx.lineTo(halfX, h - margin.bottom);
    ctx.strokeStyle = '#10b98180';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Zero line for delta-F
    const zeroY = h - margin.bottom - (maxDeltaF / (2 * maxDeltaF)) * plotH * 0.9;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(w - margin.right, zeroY);
    ctx.strokeStyle = '#47556960';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#475569';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('\u0394F = 0', margin.left + 4, zeroY - 4);

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let s = 0.1; s <= 0.9; s += 0.2) {
      const x = margin.left + ((s - minS) / (maxS - minS)) * plotW;
      ctx.fillText(s.toFixed(1), x, h - margin.bottom + 14);
    }
    ctx.fillText('\u03C3', w / 2, h - 4);

    // Left Y-axis label
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u0394F (free energy)', 0, 0);
    ctx.restore();

    // Right Y-axis label
    ctx.save();
    ctx.translate(w - 8, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('C_v (specific heat)', 0, 0);
    ctx.restore();

    // Region labels at top
    const regionLabels = [
      { sigma: 0.08, label: 'Vaporized', color: '#ef4444' },
      { sigma: 0.3, label: 'Strip', color: '#f59e0b' },
      { sigma: 0.5, label: 'Equil.', color: '#10b981' },
      { sigma: 0.7, label: 'Strip', color: '#f59e0b' },
      { sigma: 0.92, label: 'Frozen', color: '#3b82f6' },
    ];
    regionLabels.forEach(r => {
      if (r.sigma >= minS && r.sigma <= maxS) {
        const x = margin.left + ((r.sigma - minS) / (maxS - minS)) * plotW;
        ctx.fillStyle = r.color;
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(r.label, x, margin.top + 12);
      }
    });

    // Legend
    const legendItems = [
      { color: '#f59e0b', label: '\u0394F (left axis)' },
      { color: '#ef4444', label: 'C_v (right axis)' },
    ];
    legendItems.forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(w - margin.right - 130, margin.top + 4 + i * 14, 12, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, w - margin.right - 114, margin.top + 8 + i * 14);
    });
  }, [data, scales]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        Treating the oscillator chain as a thermodynamic system with <InlineMath tex={"\\beta = \\sigma"} />, the free
        energy difference <InlineMath tex={"\\Delta F(\\sigma)"} /> (gold) and specific heat <InlineMath tex="C_v" /> (red)
        reveal phase transitions. Background shading marks thermodynamic regimes: vaporized
        (<InlineMath tex={"\\sigma \\approx 0"} />), the critical strip, the equilibrium zone near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
        and the frozen regime (<InlineMath tex={"\\sigma \\approx 1"} />).
        <strong> Look for:</strong> free energy barriers trapping the system near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
        and specific heat spikes at phase boundaries.
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Barrier Height', value: data.barrierHeight.toFixed(3), color: '#f59e0b' },
          { label: 'Confinement', value: data.confinementStrength.toFixed(3), color: '#10b981' },
          { label: 'Phase Boundaries', value: data.phaseBoundaries.length, color: '#ef4444' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid #f59e0b40',
        fontSize: 12,
      }}>
        <strong style={{ color: '#f59e0b' }}>Thermodynamic Confinement</strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11 }}>
          Free energy barriers trap zeros near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          Specific heat spikes at the critical strip boundaries: the Euler product convergence boundary at <InlineMath tex={"\\sigma = 1"} /> (where <InlineMath tex={"\\zeta"} /> has a pole)
          and its functional equation mirror at <InlineMath tex={"\\sigma = 0"} />. The functional equation reflects across <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, not <InlineMath tex={"\\sigma = 0"} />.
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Correlation Matrix ──────────────────────────────────────────────

function CorrelationMatrixTab({ t, numPrimes }) {
  const canvasRef = useRef();
  const data = useMemo(
    () => crossCorrelationMatrix(t, [0.1, 0.9], 40, numPrimes),
    [t, numPrimes],
  );

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

    const measures = data.measures;
    const matrix = data.matrix;
    const n = measures.length;

    const margin = { left: 80, right: 30, top: 80, bottom: 20 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;
    const cellW = plotW / n;
    const cellH = plotH / n;

    // Draw heatmap cells
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const val = matrix[i][j];
        const x = margin.left + j * cellW;
        const y = margin.top + i * cellH;

        // Color: red for positive, blue for negative, dark neutral for 0
        // Dark-friendly diverging scale centered on #1e293b
        let r, g, b;
        if (val >= 0) {
          r = Math.round(30 + 225 * val);
          g = Math.round(41 * (1 - val));
          b = Math.round(59 * (1 - val));
        } else {
          const a = -val;
          r = Math.round(30 * (1 - a));
          g = Math.round(41 * (1 - a));
          b = Math.round(59 + 196 * a);
        }
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

        // Strong correlation highlight border
        if (Math.abs(val) > 0.7 && i !== j) {
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
        }

        // Value text
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `${Math.abs(val) > 0.7 ? 'bold ' : ''}${cellW > 30 ? 9 : 7}px var(--font-mono)`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toFixed(2), x + cellW / 2, y + cellH / 2);
      }
    }

    // Row labels (left)
    const shortNames = ['Entropy', 'Capacity', 'Fisher', 'KL', 'Twistor', 'Bridge', 'Hamilt.', 'Confine.'];
    ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const y = margin.top + i * cellH + cellH / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.fillText(shortNames[i] || measures[i], margin.left - 6, y);
    }

    // Column labels (top, rotated)
    for (let j = 0; j < n; j++) {
      const x = margin.left + j * cellW + cellW / 2;
      ctx.save();
      ctx.translate(x, margin.top - 6);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(shortNames[j] || measures[j], 0, 0);
      ctx.restore();
    }

    // Color scale legend
    const legendX = w - margin.right - 18;
    const legendH = plotH * 0.6;
    const legendY = margin.top + (plotH - legendH) / 2;
    for (let i = 0; i < legendH; i++) {
      const val = 1 - 2 * i / legendH; // +1 at top, -1 at bottom
      let lr, lg, lb;
      if (val >= 0) {
        lr = Math.round(30 + 225 * val); lg = Math.round(41 * (1 - val)); lb = Math.round(59 * (1 - val));
      } else {
        const a = -val;
        lr = Math.round(30 * (1 - a)); lg = Math.round(41 * (1 - a)); lb = Math.round(59 + 196 * a);
      }
      ctx.fillStyle = `rgb(${lr},${lg},${lb})`;
      ctx.fillRect(legendX, legendY + i, 12, 1);
    }
    ctx.fillStyle = '#64748b';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('+1', legendX + 14, legendY);
    ctx.textBaseline = 'middle';
    ctx.fillText(' 0', legendX + 14, legendY + legendH / 2);
    ctx.textBaseline = 'bottom';
    ctx.fillText('-1', legendX + 14, legendY + legendH);
  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        Cross-correlation matrix of eight diagnostic measures evaluated across the critical strip.
        Red cells indicate positive correlation, blue negative. Strong correlations
        (<InlineMath tex="|r| > 0.7" />, white borders) reveal which measures carry redundant information about
        zero confinement, while independent measures provide genuinely distinct evidence for the critical line.
        <strong> Look for:</strong> clusters of correlated measures and the count of independent diagnostics.
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <div className="stat-box" style={{ padding: '8px 10px' }}>
          <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {data.independentMeasures}
          </div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>Independent measures</div>
        </div>
        <div className="stat-box" style={{ padding: '8px 10px' }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {data.strongCorrelations.length}
          </div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>Strong correlations (|r| {'>'} 0.7)</div>
        </div>
      </div>
      {data.strongCorrelations.length > 0 && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 6,
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid #8b5cf640',
          fontSize: 12,
        }}>
          <strong style={{ color: '#8b5cf6' }}>Strongly correlated pairs:</strong>
          <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11, lineHeight: 1.8 }}>
            {data.strongCorrelations.map((sc, i) => (
              <span key={i}>
                {sc.m1} / {sc.m2}: <span style={{ color: sc.corr > 0 ? '#ef4444' : '#3b82f6', fontWeight: 600 }}>
                  {sc.corr.toFixed(3)}
                </span>
                {i < data.strongCorrelations.length - 1 ? ' | ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 5: Strategy Scores ─────────────────────────────────────────────────

function StrategyScoresTab({ t, numPrimes }) {
  const canvasRef = useRef();
  const data = useMemo(() => evaluateAttackStrategies(t, numPrimes), [t, numPrimes]);

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

    const margin = { left: 160, right: 30, top: 30, bottom: 30 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;
    const strategies = data.strategies;
    const barH = Math.min(plotH / strategies.length * 0.7, 28);
    const gap = plotH / strategies.length;

    // Grid lines
    for (let v = 0; v <= 10; v += 2) {
      const x = margin.left + (v / 10) * plotW;
      ctx.beginPath();
      ctx.setLineDash([2, 3]);
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, h - margin.bottom);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#475569';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(v.toString(), x, h - margin.bottom + 14);
    }

    // Horizontal bars
    strategies.forEach((s, i) => {
      const y = margin.top + i * gap + (gap - barH) / 2;
      const barWidth = (s.score / 10) * plotW;

      // Bar color by score
      let barColor;
      if (s.score >= 8) barColor = '#10b981';
      else if (s.score >= 5) barColor = '#f59e0b';
      else barColor = '#ef4444';

      // Bar fill (semi-transparent)
      ctx.fillStyle = barColor;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(margin.left, y, barWidth, barH);
      ctx.globalAlpha = 1;

      // Bar border
      ctx.strokeStyle = barColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(margin.left, y, barWidth, barH);

      // Score text inside bar
      if (barWidth > 30) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px var(--font-mono)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.score.toFixed(0), margin.left + barWidth - 6, y + barH / 2);
      }

      // Strategy name on the left
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.name, margin.left - 8, y + barH / 2);
    });

    // Overall score badge
    const overallColor = data.overallScore >= 7 ? '#10b981' : data.overallScore >= 4 ? '#f59e0b' : '#ef4444';
    ctx.fillStyle = overallColor + '20';
    const badgeW = 100;
    const badgeH = 36;
    const badgeX = w - margin.right - badgeW;
    const badgeY = margin.top - 4;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.strokeStyle = overallColor + '60';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = overallColor;
    ctx.font = 'bold 16px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(data.overallScore.toFixed(1), badgeX + badgeW / 2, badgeY + 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px sans-serif';
    ctx.fillText('Overall /10', badgeX + badgeW / 2, badgeY + 24);
  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-red">
        Each "attack strategy" combines multiple confinement diagnostics into a single score (0–10) reflecting
        how strongly that approach constrains zeros to the critical line. Bars are colored green ({'\u2265'}8),
        yellow ({'\u2265'}5), or red ({'<'}5). The overall score aggregates all strategies.
        <strong> Look for:</strong> which strategies score highest and whether weaknesses reveal potential gaps
        in the confinement argument.
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      {/* Strategy details below */}
      <div style={{ marginTop: 12 }}>
        {data.strategies.map((s, i) => {
          const statusColor = s.status === 'strong' ? '#10b981' : s.status === 'moderate' ? '#f59e0b' : '#ef4444';
          return (
            <div key={i} style={{
              padding: '8px 12px', marginBottom: 6, borderRadius: 6,
              background: '#0f1225', borderLeft: `3px solid ${statusColor}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.evidence}</div>
                {s.weakness !== 'None' && (
                  <div style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>Weakness: {s.weakness}</div>
                )}
              </div>
              <div style={{
                minWidth: 40, textAlign: 'center', fontSize: 14, fontWeight: 700,
                fontFamily: 'var(--font-mono)', color: statusColor,
              }}>
                {s.score}/10
              </div>
            </div>
          );
        })}
      </div>
      {data.nextSteps.length > 0 && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 6,
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid #8b5cf640',
          fontSize: 12,
        }}>
          <strong style={{ color: '#8b5cf6' }}>Next Steps</strong>
          <ul style={{ margin: '6px 0 0 16px', color: '#94a3b8', fontSize: 11, lineHeight: 1.8 }}>
            {data.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SpectralAttackViz() {
  const [tab, setTab] = useState(0);
  const [numPrimes, setNumPrimes] = useState(12);
  const [tIdx, setTIdx] = useState(0);

  const tOptions = useMemo(() => ZETA_ZEROS.slice(0, 10), []);
  const t = tOptions[tIdx];

  return (
    <div>
      {/* Shared controls */}
      <div className="controls" style={{ marginBottom: 16 }}>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t" /> (zero)</label>
          <select
            value={tIdx}
            onChange={e => setTIdx(+e.target.value)}
            style={{
              background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
              borderRadius: 4, padding: '4px 8px', fontSize: 12, fontFamily: 'var(--font-mono)',
            }}
          >
            {tOptions.map((z, i) => (
              <option key={i} value={i}>γ{String(i + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')} = {z.toFixed(3)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {TABS.map((label, i) => (
          <button key={label}
            className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
            style={{ borderColor: tab === i ? TAB_COLORS[i] : undefined }}
          >{label}</button>
        ))}
      </div>

      {tab === 0 && <FisherTwistorTab t={t} numPrimes={numPrimes} />}
      {tab === 1 && <LyapunovTab t={t} numPrimes={numPrimes} />}
      {tab === 2 && <PhaseBarriersTab t={t} numPrimes={numPrimes} />}
      {tab === 3 && <CorrelationMatrixTab t={t} numPrimes={numPrimes} />}
      {tab === 4 && <StrategyScoresTab t={t} numPrimes={numPrimes} />}
    </div>
  );
}
