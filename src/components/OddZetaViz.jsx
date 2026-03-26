import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  oddZetaValue, aperySequence, oddZetaAsTransferFunction,
  linearIndependenceTest, irrationalityMeasure, oddZetaDecay,
  eulerProductTrace, transferFunctionDecayComparison,
} from '../math/odd-zeta.js';
import { getPrimes } from '../math/primes.js';

const TABS = ['Values & Convergence', 'Apery Sequences', 'Transfer Function', 'Linear Independence', 'Irrationality Measure'];
const TAB_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

// ─── Shared canvas drawing helpers ──────────────────────────────────────────

function initCanvas(canvasRef) {
  const canvas = canvasRef.current;
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function drawAxes(ctx, margin, w, h) {
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, h - margin.bottom);
  ctx.lineTo(w - margin.right, h - margin.bottom);
  ctx.stroke();
}

function drawGridLines(ctx, margin, plotW, plotH, yMin, yMax, numTicks, formatFn, w, h) {
  ctx.fillStyle = '#64748b';
  ctx.font = '9px var(--font-mono)';
  ctx.textAlign = 'right';
  for (let i = 0; i <= numTicks; i++) {
    const val = yMin + (i / numTicks) * (yMax - yMin);
    const y = h - margin.bottom - (i / numTicks) * plotH;
    ctx.beginPath();
    ctx.setLineDash([2, 3]);
    ctx.moveTo(margin.left, y);
    ctx.lineTo(w - margin.right, y);
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(formatFn ? formatFn(val) : val.toFixed(2), margin.left - 6, y + 3);
  }
}

// ─── Tab 1: Values & Convergence ────────────────────────────────────────────

function ValuesTab({ selectedN, numPrimes }) {
  const canvasRef = useRef();

  const decayData = useMemo(() => oddZetaDecay(21, numPrimes), [numPrimes]);
  const trace = useMemo(() => eulerProductTrace(selectedN, numPrimes), [selectedN, numPrimes]);
  const currentValue = useMemo(() => oddZetaValue(selectedN, numPrimes), [selectedN, numPrimes]);

  const draw = useCallback(() => {
    const c = initCanvas(canvasRef);
    if (!c) return;
    const { ctx, w, h } = c;

    const margin = { left: 55, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const halfH = (h - margin.top - margin.bottom - 40) / 2;

    // ─── Top: Bar chart of ζ(n) values ───
    const g1Top = margin.top;

    drawAxes(ctx, { ...margin, bottom: h - g1Top - halfH }, w, g1Top + halfH);

    const bars = decayData;
    const maxVal = Math.max(...bars.map(b => b.value));
    const barWidth = Math.min(plotW / bars.length * 0.7, 40);

    bars.forEach((bar, i) => {
      const x = margin.left + (i + 0.5) / bars.length * plotW;
      const barH = (bar.value / maxVal) * halfH * 0.85;
      const isSelected = bar.n === selectedN;

      ctx.fillStyle = isSelected ? '#10b981' : '#10b98160';
      ctx.fillRect(x - barWidth / 2, g1Top + halfH - barH, barWidth, barH);

      if (isSelected) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - barWidth / 2, g1Top + halfH - barH, barWidth, barH);
      }

      // Label
      ctx.fillStyle = isSelected ? '#e2e8f0' : '#64748b';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(`${bar.n}`, x, g1Top + halfH + 14);

      // Value on top of bar
      if (barWidth > 20 || isSelected) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px var(--font-mono)';
        ctx.fillText(bar.value.toFixed(4), x, g1Top + halfH - barH - 4);
      }
    });

    // Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Odd Zeta Values: \u03B6(3), \u03B6(5), ..., \u03B6(21)', margin.left + 4, g1Top + 14);

    // X-axis label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('n (odd)', w / 2, g1Top + halfH + 30);

    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(14, g1Top + halfH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u03B6(n)', 0, 0);
    ctx.restore();

    // ─── Bottom: Euler product convergence for selected n ───
    const g2Top = g1Top + halfH + 44;
    const g2H = halfH;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, g2Top);
    ctx.lineTo(margin.left, g2Top + g2H);
    ctx.lineTo(w - margin.right, g2Top + g2H);
    ctx.stroke();

    if (trace.length > 0) {
      const target = currentValue.value;
      const maxErr = Math.max(...trace.map(t => t.error));
      const minErr = Math.min(...trace.filter(t => t.error > 0).map(t => t.error));
      const useLog = maxErr / (minErr || 1e-20) > 100;

      // Reference line at target value
      ctx.beginPath();
      ctx.setLineDash([5, 3]);
      ctx.moveTo(margin.left, g2Top + g2H * 0.1);
      ctx.lineTo(w - margin.right, g2Top + g2H * 0.1);
      ctx.strokeStyle = '#3b82f680';
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#3b82f6';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(`\u03B6(${selectedN}) = ${target.toFixed(10)}`, margin.left + 8, g2Top + g2H * 0.1 - 6);

      // Plot convergence curve (cumulative product)
      const prodMin = Math.min(...trace.map(t => t.cumulativeProduct));
      const prodMax = Math.max(...trace.map(t => t.cumulativeProduct));
      const prodRange = prodMax - prodMin || 1e-10;

      ctx.beginPath();
      trace.forEach((pt, i) => {
        const x = margin.left + (trace.length > 1 ? i / (trace.length - 1) : 0.5) * plotW;
        const y = g2Top + g2H - ((pt.cumulativeProduct - prodMin) / prodRange) * g2H * 0.8 - g2H * 0.1;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots
      trace.forEach((pt, i) => {
        if (i % Math.max(1, Math.floor(trace.length / 25)) === 0 || i === trace.length - 1) {
          const x = margin.left + (trace.length > 1 ? i / (trace.length - 1) : 0.5) * plotW;
          const y = g2Top + g2H - ((pt.cumulativeProduct - prodMin) / prodRange) * g2H * 0.8 - g2H * 0.1;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
        }
      });

      // Target line
      const targetY = g2Top + g2H - ((target - prodMin) / prodRange) * g2H * 0.8 - g2H * 0.1;
      ctx.beginPath();
      ctx.setLineDash([6, 3]);
      ctx.moveTo(margin.left, targetY);
      ctx.lineTo(w - margin.right, targetY);
      ctx.strokeStyle = '#10b98180';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Title
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Euler Product Convergence for \u03B6(${selectedN})`, margin.left + 4, g2Top - 4);

    // X-axis label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Number of primes', w / 2, g2Top + g2H + 14);

    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(14, g2Top + g2H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u220F 1/(1\u2212p\u207B\u207F)', 0, 0);
    ctx.restore();

  }, [decayData, trace, currentValue, selectedN]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 420, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: `\u03B6(${selectedN})`, value: currentValue.value?.toFixed(10) || 'N/A', color: '#10b981' },
          { label: 'Euler Product', value: currentValue.eulerProductValue?.toFixed(10) || 'N/A', color: '#3b82f6' },
          { label: 'Rel. Error', value: currentValue.relativeError?.toExponential(2) || 'N/A', color: '#f59e0b' },
          { label: 'Conv. Rate', value: currentValue.convergenceRate?.toExponential(2) || 'N/A', color: '#8b5cf6' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 2: Apery Sequences ─────────────────────────────────────────────────

function AperyTab() {
  const [maxTerms, setMaxTerms] = useState(18);
  const canvasRef = useRef();

  const data = useMemo(() => aperySequence(maxTerms), [maxTerms]);

  const draw = useCallback(() => {
    const c = initCanvas(canvasRef);
    if (!c) return;
    const { ctx, w, h } = c;

    const margin = { left: 60, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const halfH = (h - margin.top - margin.bottom - 44) / 2;

    // ─── Top: Convergents approaching ζ(3) ───
    const convs = data.convergents.filter(c => isFinite(c.value) && Math.abs(c.value) < 10);
    if (convs.length === 0) return;

    const minVal = Math.min(...convs.map(c => c.value));
    const maxVal = Math.max(...convs.map(c => c.value));
    const valRange = maxVal - minVal || 0.1;
    const yLo = minVal - valRange * 0.1;
    const yHi = maxVal + valRange * 0.1;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + halfH);
    ctx.lineTo(w - margin.right, margin.top + halfH);
    ctx.stroke();

    // ζ(3) reference line
    const zetaY = margin.top + halfH - ((data.aperyConstant - yLo) / (yHi - yLo)) * halfH;
    ctx.beginPath();
    ctx.setLineDash([6, 3]);
    ctx.moveTo(margin.left, zetaY);
    ctx.lineTo(w - margin.right, zetaY);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'right';
    ctx.fillText(`\u03B6(3) = ${data.aperyConstant.toFixed(6)}`, w - margin.right - 4, zetaY - 6);

    // Plot convergents
    ctx.beginPath();
    convs.forEach((conv, i) => {
      const x = margin.left + (conv.n / maxTerms) * plotW;
      const y = margin.top + halfH - ((conv.value - yLo) / (yHi - yLo)) * halfH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    convs.forEach((conv, i) => {
      const x = margin.left + (conv.n / maxTerms) * plotW;
      const y = margin.top + halfH - ((conv.value - yLo) / (yHi - yLo)) * halfH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    });

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = yLo + (i / 4) * (yHi - yLo);
      const y = margin.top + halfH - (i / 4) * halfH;
      ctx.fillText(val.toFixed(4), margin.left - 6, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= Math.min(maxTerms, 10); i += Math.max(1, Math.floor(maxTerms / 8))) {
      const x = margin.left + (i / maxTerms) * plotW;
      ctx.fillText(`${i}`, x, margin.top + halfH + 14);
    }

    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(14, margin.top + halfH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('a\u2099/b\u2099', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("Apery convergents a_n/b_n approaching \u03B6(3)", margin.left + 4, margin.top + 14);

    // ─── Bottom: Error convergence (log scale) ───
    const g2Top = margin.top + halfH + 44;
    const g2H = halfH;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, g2Top);
    ctx.lineTo(margin.left, g2Top + g2H);
    ctx.lineTo(w - margin.right, g2Top + g2H);
    ctx.stroke();

    const errors = convs.filter(c => c.error > 0);
    if (errors.length > 0) {
      const logErrors = errors.map(e => Math.log10(e.error));
      const minLogE = Math.min(...logErrors);
      const maxLogE = Math.max(...logErrors);
      const logRange = maxLogE - minLogE || 1;

      // Plot error on log scale
      ctx.beginPath();
      errors.forEach((pt, i) => {
        const x = margin.left + (pt.n / maxTerms) * plotW;
        const y = g2Top + g2H - ((Math.log10(pt.error) - minLogE) / logRange) * g2H * 0.85 - g2H * 0.05;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      errors.forEach((pt, i) => {
        const x = margin.left + (pt.n / maxTerms) * plotW;
        const y = g2Top + g2H - ((Math.log10(pt.error) - minLogE) / logRange) * g2H * 0.85 - g2H * 0.05;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      });

      // Y-axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const val = minLogE + (i / 4) * logRange;
        const y = g2Top + g2H - (i / 4) * g2H * 0.85 - g2H * 0.05;
        ctx.fillText(`10^${val.toFixed(0)}`, margin.left - 6, y + 3);
      }

      // Reference: geometric convergence rate ~(1+sqrt(2))^{-4n}
      const C = Math.pow(1 + Math.sqrt(2), 4); // ~33.97
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      errors.forEach((pt, i) => {
        const x = margin.left + (pt.n / maxTerms) * plotW;
        const theoretical = -pt.n * Math.log10(C);
        const y = g2Top + g2H - ((theoretical - minLogE) / logRange) * g2H * 0.85 - g2H * 0.05;
        const clampedY = Math.max(g2Top, Math.min(g2Top + g2H, y));
        if (i === 0) ctx.moveTo(x, clampedY); else ctx.lineTo(x, clampedY);
      });
      ctx.strokeStyle = '#f59e0b80';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(14, g2Top + g2H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('log\u2081\u2080|error|', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Convergence Error (log scale)', margin.left + 4, g2Top + 14);

    // Legend
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Actual error', w - margin.right - 4, g2Top + 14);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Theoretical ~C^{-n}', w - margin.right - 4, g2Top + 26);

    // X-axis label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Term n', w / 2, g2Top + g2H + 14);

  }, [data, maxTerms]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="control-group">
          <label>Max Terms</label>
          <input type="range" min="5" max="25" step="1" value={maxTerms}
            title="Number of terms in Apéry's recurrence — more terms give faster convergence to ζ(3) but may lose precision due to large intermediate values"
            onChange={e => setMaxTerms(+e.target.value)} />
          <span className="control-value">{maxTerms}</span>
        </div>
      </div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 420, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: "Apery's Constant", value: data.aperyConstant?.toFixed(10) || 'N/A', color: '#10b981' },
          { label: 'Best Convergent', value: data.convergents[data.convergents.length - 1]?.value?.toFixed(10) || 'N/A', color: '#3b82f6' },
          { label: 'Final Error', value: data.convergents[data.convergents.length - 1]?.error?.toExponential(2) || 'N/A', color: '#ef4444' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        Apery proved <InlineMath tex={"\\zeta(3)"} /> is irrational using the recurrence{' '}
        <InlineMath tex="(n+1)^3 a_{n+1} = (2n+1)(17n^2+17n+5)a_n - n^3 a_{n-1}" />.{' '}
        The convergents <InlineMath tex="a_n/b_n" /> approach <InlineMath tex={"\\zeta(3)"} /> at a geometric rate{' '}
        <InlineMath tex={"\\sim (1+\\sqrt{2})^{-4n}"} />, which is too fast for <InlineMath tex={"\\zeta(3)"} /> to be rational.
      </div>
    </div>
  );
}

// ─── Tab 3: Transfer Function ───────────────────────────────────────────────

function TransferTab({ selectedN, numPrimes }) {
  const canvasRef = useRef();

  const compareNs = useMemo(() => {
    const ns = [3, 5, 7];
    if (!ns.includes(selectedN) && selectedN >= 3 && selectedN <= 21) {
      ns.push(selectedN);
      ns.sort((a, b) => a - b);
    }
    return ns;
  }, [selectedN]);

  const comparisonData = useMemo(
    () => transferFunctionDecayComparison(compareNs, Math.min(numPrimes, 30)),
    [compareNs, numPrimes]
  );

  const tfData = useMemo(
    () => oddZetaAsTransferFunction(selectedN, numPrimes),
    [selectedN, numPrimes]
  );

  const draw = useCallback(() => {
    const c = initCanvas(canvasRef);
    if (!c) return;
    const { ctx, w, h } = c;

    const margin = { left: 55, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const halfH = (h - margin.top - margin.bottom - 44) / 2;

    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

    // ─── Top: |H_p(n)| - 1 for each prime (decay comparison) ───
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + halfH);
    ctx.lineTo(w - margin.right, margin.top + halfH);
    ctx.stroke();

    const profiles = comparisonData.profiles;
    const primes = comparisonData.primes;
    const maxPrimeIdx = Math.min(primes.length, 25);

    // Find global range for the excess (factor - 1)
    let maxExcess = 0;
    profiles.forEach(p => {
      p.factors.slice(0, maxPrimeIdx).forEach(f => {
        maxExcess = Math.max(maxExcess, f.factor - 1);
      });
    });

    // Y-axis tick labels for excess chart
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4) * maxExcess;
      const y = margin.top + halfH - (val / maxExcess) * halfH * 0.85 - halfH * 0.02;
      ctx.beginPath();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = '#1e293b';
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748b';
      ctx.fillText(val < 0.01 ? val.toExponential(1) : val.toFixed(3), margin.left - 6, y + 3);
    }

    profiles.forEach((profile, pi) => {
      const color = colors[pi % colors.length];
      ctx.beginPath();
      profile.factors.slice(0, maxPrimeIdx).forEach((f, i) => {
        const x = margin.left + ((i + 0.5) / maxPrimeIdx) * plotW;
        const excess = f.factor - 1;
        const y = margin.top + halfH - (excess / maxExcess) * halfH * 0.85 - halfH * 0.02;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = profile.n === selectedN ? 2.5 : 1.5;
      ctx.stroke();
    });

    // X-axis labels (prime numbers)
    ctx.fillStyle = '#64748b';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let i = 0; i < maxPrimeIdx; i += Math.max(1, Math.floor(maxPrimeIdx / 10))) {
      const x = margin.left + ((i + 0.5) / maxPrimeIdx) * plotW;
      ctx.fillText(`${primes[i]}`, x, margin.top + halfH + 12);
    }

    // Legend
    const legX = w - margin.right - 10;
    profiles.forEach((profile, pi) => {
      ctx.fillStyle = colors[pi % colors.length];
      ctx.font = profile.n === selectedN ? 'bold 10px var(--font-mono)' : '10px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.fillText(`\u03B6(${profile.n})`, legX, margin.top + 16 + pi * 14);
    });

    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Transfer Factor Excess |H_p(n)| - 1 by Prime', margin.left + 4, margin.top + 14);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Prime p', w / 2, margin.top + halfH + 28);

    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(14, margin.top + halfH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|H_p(n)| \u2212 1', 0, 0);
    ctx.restore();

    // ─── Bottom: Impedance profile for selected n ───
    const g2Top = margin.top + halfH + 44;
    const g2H = halfH;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, g2Top);
    ctx.lineTo(margin.left, g2Top + g2H);
    ctx.lineTo(w - margin.right, g2Top + g2H);
    ctx.stroke();

    const stages = tfData.stages.slice(0, maxPrimeIdx);
    if (stages.length > 0) {
      const maxImp = Math.max(...stages.map(s => s.impedance));
      const barW = Math.min(plotW / stages.length * 0.6, 20);

      // Y-axis tick labels for impedance chart
      ctx.fillStyle = '#64748b';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const val = (i / 4) * maxImp;
        const y = g2Top + g2H - (val / maxImp) * g2H * 0.85;
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = '#1e293b';
        ctx.moveTo(margin.left, y);
        ctx.lineTo(w - margin.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#64748b';
        ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
      }

      stages.forEach((stage, i) => {
        const x = margin.left + ((i + 0.5) / stages.length) * plotW;
        const barH = (stage.impedance / maxImp) * g2H * 0.85;

        // Gradient from yellow (low impedance) to red (high impedance)
        const t = stage.impedance / maxImp;
        const r = Math.round(245 * t + 59 * (1 - t));
        const g = Math.round(158 * (1 - t) + 130 * t);
        const b = Math.round(11 * (1 - t) + 246 * t);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.fillRect(x - barW / 2, g2Top + g2H - barH, barW, barH);

        if (i % Math.max(1, Math.floor(stages.length / 10)) === 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '8px var(--font-mono)';
          ctx.textAlign = 'center';
          ctx.fillText(`${stage.prime}`, x, g2Top + g2H + 12);
        }
      });
    }

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Impedance Profile at s = ${selectedN} (Real Axis)`, margin.left + 4, g2Top + 14);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Prime p', w / 2, g2Top + g2H + 28);

    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(14, g2Top + g2H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Impedance Z_p', 0, 0);
    ctx.restore();

  }, [comparisonData, tfData, selectedN]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 420, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: `\u03B6(${selectedN}) Total Transfer`, value: tfData.totalTransfer?.toFixed(8) || 'N/A', color: '#8b5cf6' },
          { label: 'Stages', value: `${tfData.stages?.length || 0} primes`, color: '#3b82f6' },
          { label: 'Leading Decay', value: tfData.stages?.[0] ? `2^{-${selectedN}} = ${tfData.stages[0].decay.toExponential(3)}` : 'N/A', color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        <strong style={{ color: '#8b5cf6' }}>Top:</strong> Each prime's Euler factor excess{' '}
        <InlineMath tex="|H_p(n)| - 1 = p^{-n}/(1 - p^{-n})" /> decays as <InlineMath tex="p^{-n}" />.
        Higher <InlineMath tex="n" /> means faster decay: fewer primes contribute significantly.{' '}
        <strong style={{ color: '#f59e0b' }}>Bottom:</strong> Impedance <InlineMath tex={"Z_p(n) = n\\log p + \\log p / n"} /> grows with the prime.
      </div>
    </div>
  );
}

// ─── Tab 4: Linear Independence ─────────────────────────────────────────────

function LinearIndependenceTab({ maxOdd, numPrimes }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => linearIndependenceTest(maxOdd, numPrimes),
    [maxOdd, numPrimes]
  );

  const draw = useCallback(() => {
    const c = initCanvas(canvasRef);
    if (!c) return;
    const { ctx, w, h } = c;

    const margin = { left: 60, right: 20, top: 30, bottom: 50 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const gram = data.gramMatrix;
    const dim = gram.length;
    if (dim === 0) return;
    const labels = data.indices.map(k => k === 1 ? '1' : `\u03B6(${k})`);

    // Find range for color mapping
    let maxAbs = 0;
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        maxAbs = Math.max(maxAbs, Math.abs(gram[i][j]));
      }
    }
    if (maxAbs === 0) maxAbs = 1; // Prevent division by zero when all entries are zero

    const cellW = Math.min(plotW / dim, plotH / dim);
    const totalW = cellW * dim;
    const totalH = cellW * dim;
    const offsetX = margin.left + (plotW - totalW) / 2;
    const offsetY = margin.top + (plotH - totalH) / 2;

    // Draw heatmap
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        const val = gram[i][j];
        const normalized = val / maxAbs;

        // Color: blue for negative, green for positive, brightness by magnitude
        let r, g, b;
        if (normalized >= 0) {
          r = Math.round(16 + 0 * normalized);
          g = Math.round(30 + 155 * normalized);
          b = Math.round(40 + 89 * normalized);
        } else {
          r = Math.round(16 + 43 * (-normalized));
          g = Math.round(30 + 100 * (-normalized));
          b = Math.round(40 + 206 * (-normalized));
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(offsetX + j * cellW, offsetY + i * cellW, cellW - 1, cellW - 1);

        // Value text in cells (if cells are large enough)
        if (cellW > 35) {
          ctx.fillStyle = Math.abs(normalized) > 0.5 ? '#0f172a' : '#e2e8f0';
          ctx.font = `${Math.min(10, cellW * 0.25)}px var(--font-mono)`;
          ctx.textAlign = 'center';
          ctx.fillText(
            val.toExponential(1),
            offsetX + j * cellW + cellW / 2,
            offsetY + i * cellW + cellW / 2 + 3
          );
        }
      }
    }

    // Row/column labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px var(--font-mono)';
    for (let i = 0; i < dim; i++) {
      // Row labels (left)
      ctx.textAlign = 'right';
      ctx.fillText(labels[i], offsetX - 6, offsetY + i * cellW + cellW / 2 + 3);
      // Column labels (bottom)
      ctx.save();
      ctx.translate(offsetX + i * cellW + cellW / 2, offsetY + totalH + 6);
      ctx.rotate(Math.PI / 4);
      ctx.textAlign = 'left';
      ctx.fillText(labels[i], 0, 0);
      ctx.restore();
    }

    // Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Gram Matrix Heatmap', margin.left + 4, margin.top + 14);

    // Determinant info
    const detStr = data.determinant !== 0
      ? `det = ${data.determinant.toExponential(3)}`
      : 'det = 0 (DEPENDENT)';
    const detColor = data.determinant !== 0 ? '#10b981' : '#ef4444';
    ctx.fillStyle = detColor;
    ctx.font = 'bold 10px var(--font-mono)';
    ctx.textAlign = 'right';
    ctx.fillText(detStr, w - margin.right - 4, margin.top + 14);

    // Color bar legend
    const barW = 12;
    const barH = Math.min(totalH * 0.6, 120);
    const barX = offsetX + totalW + 16;
    const barY = offsetY + (totalH - barH) / 2;
    const barSteps = 40;
    for (let s = 0; s < barSteps; s++) {
      const frac = s / (barSteps - 1); // 0 = bottom (negative) to 1 = top (positive)
      const normalized = frac * 2 - 1; // -1 to +1
      let cr, cg, cb;
      if (normalized >= 0) {
        cr = Math.round(16 + 0 * normalized);
        cg = Math.round(30 + 155 * normalized);
        cb = Math.round(40 + 89 * normalized);
      } else {
        cr = Math.round(16 + 43 * (-normalized));
        cg = Math.round(30 + 100 * (-normalized));
        cb = Math.round(40 + 206 * (-normalized));
      }
      ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
      ctx.fillRect(barX, barY + barH - (s + 1) * (barH / barSteps), barW, barH / barSteps + 0.5);
    }
    // Color bar border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
    // Color bar labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText(`+${maxAbs.toExponential(1)}`, barX + barW + 4, barY + 4);
    ctx.fillText('0', barX + barW + 4, barY + barH / 2 + 3);
    ctx.fillText(`\u2212${maxAbs.toExponential(1)}`, barX + barW + 4, barY + barH + 2);

  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 380, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Dimension', value: `${data.dimension}`, color: '#f59e0b' },
          { label: 'log10(det)', value: isFinite(data.logDeterminant) ? data.logDeterminant.toFixed(2) : '-\u221E', color: data.determinant !== 0 ? '#10b981' : '#ef4444' },
          { label: 'Near Dependencies', value: `${data.nearDependencies.length}`, color: data.nearDependencies.length > 0 ? '#ef4444' : '#10b981' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        <p style={{ margin: '0 0 6px' }}>The Gram matrix uses the inner product:</p>
        <BlockMath tex={"\\langle \\zeta(m), \\zeta(n) \\rangle = \\sum_p \\frac{\\log p}{(p^m-1)(p^n-1)}"} />
        <p style={{ margin: '6px 0 0' }}>
          A nonzero determinant supports linear independence of{' '}
          <InlineMath tex={"\\{1, \\zeta(3), \\zeta(5), \\ldots, \\zeta(" + maxOdd + ")\\}"} />.
          Ball-Rivoal proved <InlineMath tex={"\\dim \\geq c \\cdot \\log s"} />.
        </p>
      </div>
    </div>
  );
}

// ─── Tab 5: Irrationality Measure ───────────────────────────────────────────

function IrrationalityMeasureTab({ selectedN }) {
  const [maxDenom, setMaxDenom] = useState(5000);
  const canvasRef = useRef();

  const data = useMemo(() => irrationalityMeasure(selectedN, maxDenom), [selectedN, maxDenom]);

  const draw = useCallback(() => {
    const c = initCanvas(canvasRef);
    if (!c) return;
    const { ctx, w, h } = c;

    const margin = { left: 60, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    drawAxes(ctx, margin, w, h);

    const approxs = data.bestApproximations.filter(a => a.q > 1 && a.error > 0);
    if (approxs.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Insufficient approximations', w / 2, h / 2);
      return;
    }

    const logQs = approxs.map(a => Math.log(a.q));
    const logErrors = approxs.map(a => Math.log(a.error));

    const minLQ = Math.min(...logQs);
    const maxLQ = Math.max(...logQs);
    const lqRange = maxLQ - minLQ || 1;
    const minLE = Math.min(...logErrors);
    const maxLE = Math.max(...logErrors);
    const leRange = maxLE - minLE || 1;

    // Plot points: log|error| vs log(q)
    approxs.forEach((a, i) => {
      const x = margin.left + ((logQs[i] - minLQ) / lqRange) * plotW;
      const y = margin.top + plotH - ((logErrors[i] - minLE) / leRange) * plotH * 0.85 - plotH * 0.05;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ef444480';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label some points
      if (i === 0 || i === approxs.length - 1 || i % Math.max(1, Math.floor(approxs.length / 5)) === 0) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px var(--font-mono)';
        ctx.textAlign = 'left';
        ctx.fillText(`${a.p}/${a.q}`, x + 6, y - 2);
      }
    });

    // Reference line for irrationality measure μ
    const mu = data.aperyBound || data.measureEstimate;
    if (approxs.length >= 2 && isFinite(mu)) {
      // Line: log|error| = -mu * log(q) + const
      // We draw through the median point
      const midIdx = Math.floor(approxs.length / 2);
      const midLQ = logQs[midIdx];
      const midLE = logErrors[midIdx];

      ctx.beginPath();
      ctx.setLineDash([5, 3]);
      const startLQ = minLQ;
      const endLQ = maxLQ;
      const startLE = midLE - mu * (startLQ - midLQ);
      const endLE = midLE - mu * (endLQ - midLQ);

      const x1 = margin.left;
      const y1 = margin.top + plotH - ((startLE - minLE) / leRange) * plotH * 0.85 - plotH * 0.05;
      const x2 = margin.left + plotW;
      const y2 = margin.top + plotH - ((endLE - minLE) / leRange) * plotH * 0.85 - plotH * 0.05;

      ctx.moveTo(x1, Math.max(margin.top, Math.min(h - margin.bottom, y1)));
      ctx.lineTo(x2, Math.max(margin.top, Math.min(h - margin.bottom, y2)));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px var(--font-mono)';
      ctx.textAlign = 'right';
      const muLabel = data.aperyBound
        ? `\u03BC \u2264 ${mu.toFixed(3)} (known)`
        : `\u03BC \u2248 ${mu.toFixed(2)} (est.)`;
      ctx.fillText(muLabel, w - margin.right - 4, margin.top + 28);
    }

    // Irrationality bound μ = 2 line (all irrationals)
    if (approxs.length >= 2) {
      const midIdx = Math.floor(approxs.length / 2);
      const midLQ = logQs[midIdx];
      const midLE = logErrors[midIdx];

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      const startLQ = minLQ;
      const endLQ = maxLQ;
      const startLE2 = midLE - 2 * (startLQ - midLQ);
      const endLE2 = midLE - 2 * (endLQ - midLQ);

      const x1 = margin.left;
      const y1 = margin.top + plotH - ((startLE2 - minLE) / leRange) * plotH * 0.85 - plotH * 0.05;
      const x2 = margin.left + plotW;
      const y2 = margin.top + plotH - ((endLE2 - minLE) / leRange) * plotH * 0.85 - plotH * 0.05;

      ctx.moveTo(x1, Math.max(margin.top, Math.min(h - margin.bottom, y1)));
      ctx.lineTo(x2, Math.max(margin.top, Math.min(h - margin.bottom, y2)));
      ctx.strokeStyle = '#10b98160';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#10b981';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.fillText('\u03BC = 2 (all irrationals)', w - margin.right - 4, margin.top + 42);
    }

    // Y-axis tick labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const val = minLE + (i / 5) * leRange;
      const y = margin.top + plotH - (i / 5) * plotH * 0.85 - plotH * 0.05;
      ctx.beginPath();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = '#1e293b';
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748b';
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
    }

    // X-axis tick labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const val = minLQ + (i / 5) * lqRange;
      const x = margin.left + (i / 5) * plotW;
      ctx.fillText(val.toFixed(1), x, h - margin.bottom + 14);
    }
    ctx.font = '10px sans-serif';
    ctx.fillText('log(q)', w / 2, h - margin.bottom + 30);

    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('log|\u03B6(n) - p/q|', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Best Rational Approximations to \u03B6(${selectedN})`, margin.left + 4, margin.top + 14);

    // Legend
    const legendItems = [
      { color: '#ef4444', label: 'Best approximations p/q', dash: false, dot: true },
      { color: '#f59e0b', label: `Slope \u03BC ${data.aperyBound ? '\u2264 ' + mu.toFixed(3) + ' (known)' : '\u2248 ' + (mu || 0).toFixed(2) + ' (est.)'}`, dash: true, dot: false },
      { color: '#10b981', label: '\u03BC = 2 (all irrationals)', dash: true, dot: false },
    ];
    const legendX = margin.left + 8;
    const legendY0 = h - margin.bottom - legendItems.length * 16 - 14;
    const legendW = 210;
    const legendH = legendItems.length * 16 + 8;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY0, legendW, legendH, 4);
    ctx.fill();
    ctx.stroke();
    legendItems.forEach((item, i) => {
      const lx = legendX + 8;
      const ly = legendY0 + 14 + i * 16;
      if (item.dot) {
        ctx.beginPath();
        ctx.arc(lx + 4, ly, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
      } else {
        ctx.beginPath();
        if (item.dash) ctx.setLineDash([5, 3]);
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + 14, ly);
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 20, ly + 3);
    });

  }, [data, selectedN]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="control-group">
          <label>Max Denominator</label>
          <input type="range" min="500" max="20000" step="500" value={maxDenom}
            title="Maximum denominator q for continued fraction approximations p/q — larger values probe finer rational approximations and improve the irrationality measure estimate"
            onChange={e => setMaxDenom(+e.target.value)} />
          <span className="control-value">{maxDenom}</span>
        </div>
      </div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 340, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: `\u03B6(${selectedN})`, value: data.value?.toFixed(10) || 'N/A', color: '#ef4444' },
          { label: '\u03BC Estimate', value: data.measureEstimate?.toFixed(2) || 'N/A', color: '#f59e0b' },
          { label: 'Known Bound', value: data.aperyBound ? `\u2264 ${data.aperyBound}` : 'Unknown', color: data.aperyBound ? '#10b981' : '#64748b' },
          { label: 'Irrational?', value: data.isProvenIrrational ? 'PROVEN' : 'Open', color: data.isProvenIrrational ? '#10b981' : '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        The irrationality measure <InlineMath tex={"\\mu"} /> bounds how well <InlineMath tex={"\\zeta(n)"} /> can be
        approximated by rationals: <InlineMath tex={"|\\zeta(n) - p/q| > c/q^{\\mu}"} /> for large <InlineMath tex="q" />.
        {selectedN === 3 && (
          <span> For <InlineMath tex={"\\zeta(3)"} />, Rhin & Viola (2001) proved <InlineMath tex={"\\mu \\leq 5.513891"} />.</span>
        )}
        {selectedN !== 3 && (
          <span> For <InlineMath tex={"\\zeta(" + selectedN + ")"} />, irrationality has not been individually proven (only ζ(3) is known).</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function OddZetaViz() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedN, setSelectedN] = useState(3);
  const [numPrimes, setNumPrimes] = useState(30);
  const [maxOdd, setMaxOdd] = useState(11);

  return (
    <div>
      <div className="filter-bar">
        {TABS.map((tab, i) => (
          <button key={tab}
            className={`filter-btn ${activeTab === i ? 'active' : ''}`}
            style={activeTab === i ? { borderColor: TAB_COLORS[i], color: TAB_COLORS[i] } : {}}
            onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="control-group">
          <label>Selected n</label>
          <select value={selectedN} onChange={e => setSelectedN(+e.target.value)}
            style={{
              background: '#1a1f36', color: '#e2e8f0', border: '1px solid #2a3050',
              borderRadius: 6, padding: '4px 8px', fontSize: 13, fontFamily: 'var(--font-mono)',
            }}>
            {[3, 5, 7, 9, 11, 13, 15, 17, 19, 21].map(n => (
              <option key={n} value={n}>{`\u03B6(${n})`}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="5" max="50" step="1" value={numPrimes}
            title="Number of primes in the Euler product — more primes improve accuracy of ζ(n) but convergence is already rapid for large odd n"
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        {activeTab === 3 && (
          <div className="control-group">
            <label>Max Odd</label>
            <select value={maxOdd} onChange={e => setMaxOdd(+e.target.value)}
              style={{
                background: '#1a1f36', color: '#e2e8f0', border: '1px solid #2a3050',
                borderRadius: 6, padding: '4px 8px', fontSize: 13, fontFamily: 'var(--font-mono)',
              }}>
              {[7, 9, 11, 13, 15, 17, 19, 21].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 0 && (
        <div className="tab-explainer accent-green">
          Odd zeta values <InlineMath tex={"\zeta(3), \zeta(5), \zeta(7), \ldots"} /> are computed via the Euler
          product <InlineMath tex={"\prod_p (1-p^{-n})^{-1}"} />. The top chart shows how values decay toward 1
          as <InlineMath tex="n" /> grows; the bottom traces how adding primes builds up the product.
          <strong> Look for:</strong> rapid convergence for large <InlineMath tex="n" /> (fewer primes needed).
        </div>
      )}
      {activeTab === 1 && (
        <div className="tab-explainer accent-blue">
          Ap&eacute;ry&rsquo;s remarkable recurrence generates rational convergents <InlineMath tex={"a_n/b_n \to \zeta(3)"} /> at
          geometric rate <InlineMath tex={"\sim (1+\sqrt{2})^{-4n}"} />. This speed proves irrationality: no rational
          number can be approximated this fast by other rationals.
          <strong> Look for:</strong> error dropping exponentially (straight line on log scale).
        </div>
      )}
      {activeTab === 2 && (
        <div className="tab-explainer accent-purple">
          At <InlineMath tex="s = n" /> (real axis), each prime contributes a purely real Euler
          factor <InlineMath tex="1/(1-p^{-n})" />. The excess <InlineMath tex={"|H_p(n)| - 1 \approx p^{-n}"} /> decays
          as a power of the prime, with higher <InlineMath tex="n" /> giving faster decay.
          <strong> Look for:</strong> how the factor profile steepens with increasing <InlineMath tex="n" />.
        </div>
      )}
      {activeTab === 3 && (
        <div className="tab-explainer accent-orange">
          The Gram matrix <InlineMath tex={"\langle \zeta(m), \zeta(n) \rangle = \sum_p \log p / (p^m-1)(p^n-1)"} /> tests
          linear independence of <InlineMath tex={"\{1, \zeta(3), \zeta(5), \ldots\}"} /> over <InlineMath tex={"\mathbb{Q}"} />.
          A nonzero determinant implies independence (consistent with Rivoal&rsquo;s theorem).
          <strong> Look for:</strong> positive determinant and low cosine angles between pairs.
        </div>
      )}
      {activeTab === 4 && (
        <div className="tab-explainer accent-red">
          The irrationality measure <InlineMath tex={"\mu"} /> bounds how well <InlineMath tex={"\zeta(n)"} /> can be
          approximated by rationals: <InlineMath tex={"|\zeta(n) - p/q| > c/q^\mu"} />. For <InlineMath tex={"\zeta(3)"} />,
          Rhin &amp; Viola proved <InlineMath tex={"\mu \leq 5.51"} />. We estimate <InlineMath tex={"\mu"} /> from the
          slope of <InlineMath tex={"\log|error|"} /> vs <InlineMath tex={"\log q"} /> in continued fraction convergents.
          <strong> Look for:</strong> the slope of the log-log plot giving the measure estimate.
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        {activeTab === 0 && <ValuesTab selectedN={selectedN} numPrimes={numPrimes} />}
        {activeTab === 1 && <AperyTab />}
        {activeTab === 2 && <TransferTab selectedN={selectedN} numPrimes={numPrimes} />}
        {activeTab === 3 && <LinearIndependenceTab maxOdd={maxOdd} numPrimes={numPrimes} />}
        {activeTab === 4 && <IrrationalityMeasureTab selectedN={selectedN} />}
      </div>
    </div>
  );
}
