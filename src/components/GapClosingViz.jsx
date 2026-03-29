import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  regularizedEulerProduct, cascadeContinuation, convergenceAnalysis,
  hilbertPolyaMatrix, spectralConvergence,
  darlingtonSMatrix, darlingtonScan, darlingtonRealizability,
  confinementScan, gapClosingReport,
} from '../math/gap-closing.js';
import {
  darlingtonConvergenceRate, infiniteProductUnitarityBound, darlingtonRealizabilityTest,
  explicitFormulaResidue, offLineZeroSweep,
} from '../math/rh-attack.js';
import { getPrimes } from '../math/primes.js';
import { ZETA_ZEROS } from '../math/zeta.js';

const TABS = ['Regularization', 'Hilbert-Polya', 'Darlington', 'S7 Convergence', 'Off-Line Contradiction', 'Confinement'];

// ─── Tab 1: Regularization ──────────────────────────────────────────────────

function RegularizationTab({ numPrimes, t }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => cascadeContinuation(t, [0.1, 2.0], 60, numPrimes),
    [t, numPrimes],
  );

  // Pre-compute log magnitudes outside draw callback — depends only on data, not canvas size
  const logMags = useMemo(() => {
    const computeLog = (re, im) => {
      const mag = Math.sqrt(re * re + im * im);
      return mag > 1e-20 ? Math.log10(mag) : -20;
    };
    const eulerLog = data.map(d => computeLog(d.eulerProduct[0], d.eulerProduct[1]));
    const regLog = data.map(d => computeLog(d.regularized[0], d.regularized[1]));
    const trueLog = data.map(d => computeLog(d.zetaTrue[0], d.zetaTrue[1]));

    let yMin = -2, yMax = 2;
    for (let i = 0; i < eulerLog.length; i++) {
      if (eulerLog[i] > -15) { if (eulerLog[i] < yMin) yMin = eulerLog[i]; if (eulerLog[i] > yMax) yMax = eulerLog[i]; }
      if (regLog[i] > -15) { if (regLog[i] < yMin) yMin = regLog[i]; if (regLog[i] > yMax) yMax = regLog[i]; }
      if (trueLog[i] > -15) { if (trueLog[i] < yMin) yMin = trueLog[i]; if (trueLog[i] > yMax) yMax = trueLog[i]; }
    }
    return { eulerLog, regLog, trueLog, yMin, yMax };
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

    const margin = { left: 56, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const { eulerLog, regLog, trueLog, yMin, yMax } = logMags;
    const yRange = yMax - yMin || 1;

    const sigmaMin = data[0].sigma;
    const sigmaMax = data[data.length - 1].sigma;
    const sigmaRange = sigmaMax - sigmaMin || 1;

    const toX = (sigma) => margin.left + ((sigma - sigmaMin) / sigmaRange) * plotW;
    const toY = (logVal) => margin.top + plotH - ((logVal - yMin) / yRange) * plotH;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Gridlines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    const yTicks = 6;
    for (let i = 0; i <= yTicks; i++) {
      const val = yMin + (i / yTicks) * yRange;
      const y = toY(val);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Vertical dashed lines at sigma=0.5 and sigma=1
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.2;
    // sigma = 0.5
    ctx.strokeStyle = '#ef444480';
    ctx.beginPath();
    ctx.moveTo(toX(0.5), margin.top);
    ctx.lineTo(toX(0.5), h - margin.bottom);
    ctx.stroke();
    // sigma = 1
    ctx.strokeStyle = '#f59e0b80';
    ctx.beginPath();
    ctx.moveTo(toX(1.0), margin.top);
    ctx.lineTo(toX(1.0), h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Phase boundary labels
    ctx.font = '9px var(--font-mono)';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = \u00BD', toX(0.5), margin.top - 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('\u03C3 = 1', toX(1.0), margin.top - 4);

    // Draw raw Euler product (red)
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = toX(d.sigma);
      const y = toY(Math.max(eulerLog[i], yMin));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw regularized product (green)
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = toX(d.sigma);
      const y = toY(Math.max(regLog[i], yMin));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw true zeta (blue dashed)
    ctx.beginPath();
    ctx.setLineDash([6, 3]);
    data.forEach((d, i) => {
      const x = toX(d.sigma);
      const y = toY(Math.max(trueLog[i], yMin));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Convergence region label
    ctx.fillStyle = '#10b98180';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('Convergence region (\u03C3 > 1)', toX(1.05), margin.top + 16);

    ctx.fillStyle = '#ef444480';
    ctx.textAlign = 'right';
    ctx.fillText('Critical strip', toX(0.95), margin.top + 16);

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= yTicks; i++) {
      const val = yMin + (i / yTicks) * yRange;
      const y = toY(val);
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const sigTicks = [0.2, 0.5, 0.8, 1.0, 1.2, 1.5, 1.8];
    for (const s of sigTicks) {
      if (s >= sigmaMin && s <= sigmaMax) {
        ctx.fillText(s.toFixed(1), toX(s), h - margin.bottom + 14);
      }
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = Re(s)', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('log\u2081\u2080|value|', 0, 0);
    ctx.restore();

    // Legend with background box
    const legendItems = [
      { color: '#ef4444', label: 'Raw Euler product', dash: false },
      { color: '#10b981', label: 'Regularized (eta)', dash: false },
      { color: '#3b82f6', label: 'True \u03B6(s)', dash: true },
    ];
    const legendX = w - margin.right - 168;
    const legendY0 = margin.top + 2;
    const legendW = 164;
    const legendH = legendItems.length * 16 + 6;
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
      ctx.beginPath();
      if (item.dash) ctx.setLineDash([4, 2]);
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 16, ly);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 20, ly + 3);
    });

  }, [data, logMags]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        The raw Euler product <InlineMath tex={"\\prod_p (1-p^{-s})^{-1}"} /> diverges for{' '}
        <InlineMath tex={"\\sigma \\leq 1"} />. The regularized product uses the eta relation{' '}
        <InlineMath tex={"\\zeta(s) = \\eta(s)/(1-2^{1-s})"} /> to extend analytically into the
        critical strip. Compare the red (raw, diverging) vs green (regularized, converging) curves.
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}
      />
    </div>
  );
}

// ─── Tab 2: Hilbert-Polya ───────────────────────────────────────────────────

function HilbertPolyaTab({ numPrimes }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => spectralConvergence(Math.min(numPrimes, 20)),
    [numPrimes],
  );

  // Pre-compute y-axis bounds from eigenvalues/zeros (avoid flatMap + spread in draw)
  const yBounds = useMemo(() => {
    if (data.length === 0) return { yMin: 0, yMax: 1 };
    let lo = Infinity, hi = -Infinity;
    for (const d of data) {
      for (const v of d.eigenvalues) { if (v < lo) lo = v; if (v > hi) hi = v; }
      for (const v of d.targetZeros) { if (v < lo) lo = v; if (v > hi) hi = v; }
    }
    return { yMin: lo - 2, yMax: hi + 2 };
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

    if (data.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data (increase numPrimes)', w / 2, h / 2);
      return;
    }

    // Upper panel: eigenvalues vs target zeros
    const topH = h * 0.6;
    const botH = h - topH;
    const margin = { left: 56, right: 20, top: 24, bottom: 10 };
    const marginBot = { left: 56, right: 20, top: 6, bottom: 36 };
    const plotW = w - margin.left - margin.right;
    const plotTopH = topH - margin.top - margin.bottom;
    const plotBotH = botH - marginBot.top - marginBot.bottom;

    const { yMin, yMax } = yBounds;
    const yRange = yMax - yMin || 1;

    const kMin = data[0].K;
    const kMax = data[data.length - 1].K;
    const kRange = kMax - kMin || 1;

    const toX = (K) => margin.left + ((K - kMin) / kRange) * plotW;
    const toY = (val) => margin.top + plotTopH - ((val - yMin) / yRange) * plotTopH;

    // Top: Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, topH - margin.bottom);
    ctx.lineTo(w - margin.right, topH - margin.bottom);
    ctx.stroke();

    // Target zeros as red horizontal lines (use last entry's targetZeros which has the most)
    const lastTargets = data[data.length - 1].targetZeros;
    ctx.strokeStyle = '#ef444440';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    lastTargets.forEach(z => {
      const y = toY(z);
      if (y >= margin.top && y <= topH - margin.bottom) {
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(w - margin.right, y);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);

    // Eigenvalues as blue dots at each K
    data.forEach(d => {
      const x = toX(d.K);
      d.eigenvalues.forEach(eig => {
        const y = toY(eig);
        if (y >= margin.top && y <= topH - margin.bottom) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
        }
      });
    });

    // Y-axis labels (top)
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 6;
    for (let i = 0; i <= yTicks; i++) {
      const val = yMin + (i / yTicks) * yRange;
      const y = toY(val);
      ctx.fillText(val.toFixed(0), margin.left - 6, y + 3);
    }

    // Legend (top) with background box
    const legendX = w - margin.right - 140;
    const legendY0 = margin.top + 2;
    const legendW = 136;
    const legendH = 2 * 16 + 6;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY0, legendW, legendH, 4);
    ctx.fill();
    ctx.stroke();

    // Eigenvalues entry (dot marker)
    const lx = legendX + 8;
    const ly1 = legendY0 + 14;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(lx + 7, ly1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('Eigenvalues', lx + 18, ly1 + 3);

    // Target zeros entry (dashed line marker)
    const ly2 = legendY0 + 14 + 16;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(lx, ly2);
    ctx.lineTo(lx + 14, ly2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Target zeros', lx + 18, ly2 + 3);

    // Bottom panel: spectral error convergence
    const errMax = Math.max(...data.map(d => d.avgError), 0.01);

    const toBotX = (K) => marginBot.left + ((K - kMin) / kRange) * plotW;
    const toBotY = (err) => topH + marginBot.top + plotBotH - (err / errMax) * plotBotH;

    // Bottom axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginBot.left, topH + marginBot.top);
    ctx.lineTo(marginBot.left, h - marginBot.bottom);
    ctx.lineTo(w - marginBot.right, h - marginBot.bottom);
    ctx.stroke();

    // Error curve
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = toBotX(d.K);
      const y = toBotY(d.avgError);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Error dots
    data.forEach(d => {
      const x = toBotX(d.K);
      const y = toBotY(d.avgError);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = d.converging ? '#10b981' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#0a0e1a';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // X-axis labels for both panels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    data.forEach(d => {
      ctx.fillText(`K=${d.K}`, toBotX(d.K), h - marginBot.bottom + 14);
    });

    // Bottom Y labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 3; i++) {
      const val = (i / 3) * errMax;
      const y = toBotY(val);
      ctx.fillText(val.toFixed(1), marginBot.left - 6, y + 3);
    }

    // Bottom label
    ctx.fillStyle = '#f59e0b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('Avg spectral error', marginBot.left + 4, topH + marginBot.top + 12);

    // Bottom legend: convergence status of dots
    const botLegendX = w - marginBot.right - 148;
    const botLegendY = topH + marginBot.top + 2;
    const botLegendW = 144;
    const botLegendH = 2 * 16 + 6;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(botLegendX, botLegendY, botLegendW, botLegendH, 4);
    ctx.fill();
    ctx.stroke();
    // Converging entry
    const blx = botLegendX + 8;
    const bly1 = botLegendY + 14;
    ctx.beginPath();
    ctx.arc(blx + 4, bly1, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('Converging', blx + 14, bly1 + 3);
    // Not converging entry
    const bly2 = botLegendY + 14 + 16;
    ctx.beginPath();
    ctx.arc(blx + 4, bly2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Not converging', blx + 14, bly2 + 3);

    // X-axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Matrix size K', w / 2, h - 4);

    // Y-axis labels (rotated)
    ctx.save();
    ctx.translate(12, topH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Eigenvalue / Zero', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(12, topH + botH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Avg Error', 0, 0);
    ctx.restore();

  }, [data, yBounds]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        <p style={{ margin: '0 0 8px' }}>
          The Hilbert-Polya matrix couples prime oscillators:
        </p>
        <BlockMath tex={"M_{jj} = \\gamma_j, \\qquad M_{jk} = \\sum_p \\frac{\\log p}{p} \\cos\\bigl((\\gamma_j - \\gamma_k)\\log p\\bigr) \\;\\; (j \\neq k)"} />
        <p style={{ margin: '8px 0 0' }}>
          Diagonal entries are the known zeta zeros; off-diagonal entries couple them via primes.
          If a self-adjoint operator exists with <InlineMath tex={"\\text{Spec}(\\mathcal{A}) = \\{\\gamma_n\\}"} />,
          RH follows immediately. Blue dots show computed eigenvalues; red lines show target zeros.
        </p>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}
      />
    </div>
  );
}

// ─── Tab 3: Darlington ──────────────────────────────────────────────────────

function DarlingtonTab({ numPrimes, t }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => darlingtonScan(t, [0.1, 0.9], 60, numPrimes),
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

    const margin = { left: 56, right: 50, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const sigmaMin = data[0].sigma;
    const sigmaMax = data[data.length - 1].sigma;
    const sigmaRange = sigmaMax - sigmaMin || 1;

    // Determine y range for S11, S21
    const allMags = data.flatMap(d => [d.S11mag, d.S21mag]);
    const magMax = Math.min(Math.max(...allMags, 1.2), 5);
    const errMax = Math.max(...data.map(d => d.unitarityError), 0.1);

    const toX = (sigma) => margin.left + ((sigma - sigmaMin) / sigmaRange) * plotW;
    const toY = (val) => margin.top + plotH - (val / magMax) * plotH;
    const toYErr = (val) => margin.top + plotH - (val / errMax) * plotH * 0.3;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Horizontal dashed line at 1.0 (unitarity reference)
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, toY(1.0));
    ctx.lineTo(w - margin.right, toY(1.0));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('1.0', margin.left + 4, toY(1.0) - 4);

    // Vertical line at sigma=0.5
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#ef444480';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(toX(0.5), margin.top);
    ctx.lineTo(toX(0.5), h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = \u00BD', toX(0.5), margin.top - 4);

    // Draw |S11| (reflection, orange)
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = toX(d.sigma);
      const y = toY(Math.min(d.S11mag, magMax));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw |S21| (transmission, cyan)
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = toX(d.sigma);
      const y = toY(Math.min(d.S21mag, magMax));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw unitarity error (red, thin)
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = toX(d.sigma);
      const y = toYErr(Math.min(d.unitarityError, errMax));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (i / yTicks) * magMax;
      const y = toY(val);
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const sigTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    for (const s of sigTicks) {
      if (s >= sigmaMin && s <= sigmaMax) {
        ctx.fillText(s.toFixed(1), toX(s), h - margin.bottom + 14);
      }
    }

    // Right-side y-axis for unitarity error (red scale)
    ctx.strokeStyle = '#ef444460';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w - margin.right, margin.top);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    const errTicks = 3;
    for (let i = 0; i <= errTicks; i++) {
      const val = (i / errTicks) * errMax;
      const y = toYErr(val);
      ctx.beginPath();
      ctx.moveTo(w - margin.right, y);
      ctx.lineTo(w - margin.right + 4, y);
      ctx.strokeStyle = '#ef444460';
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText(val < 0.01 ? val.toExponential(0) : val.toFixed(2), w - margin.right + 6, y + 3);
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = Re(s)', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Magnitude', 0, 0);
    ctx.restore();

    // Right y-axis label (unitarity error)
    ctx.save();
    ctx.translate(w - 4, margin.top + plotH * 0.15);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Unitarity Error', 0, 0);
    ctx.restore();

    // Legend with background box
    const legendItems = [
      { color: '#f59e0b', label: '|S\u2081\u2081| (reflection)' },
      { color: '#06b6d4', label: '|S\u2082\u2081| (transmission)' },
      { color: '#ef4444', label: '|S\u2020S - I| (unitarity err)' },
    ];
    const legendX = w - margin.right - 184;
    const legendY0 = margin.top + 2;
    const legendW = 180;
    const legendH = legendItems.length * 16 + 6;
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
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 16, ly);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 20, ly + 3);
    });

  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        The Darlington synthesis requires exact unitarity{' '}
        <InlineMath tex="|S_{11}|^2 + |S_{21}|^2 = 1" /> on the critical line.
        Orange shows reflection <InlineMath tex="|S_{11}|" />, cyan shows transmission{' '}
        <InlineMath tex="|S_{21}|" />, and the red curve shows the unitarity error{' '}
        <InlineMath tex={"|S^\\dagger S - I|"} /> (should be near zero at{' '}
        <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />).
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}
      />
    </div>
  );
}

// ─── Tab 4: S7 Convergence ──────────────────────────────────────────────────

function S7ConvergenceTab({ numPrimes, t }) {
  const canvasRef = useRef();

  const convergenceData = useMemo(
    () => darlingtonConvergenceRate(Math.max(numPrimes, 50), [t, ZETA_ZEROS[1], ZETA_ZEROS[2]]),
    [numPrimes, t],
  );

  const tailBound = useMemo(
    () => infiniteProductUnitarityBound(Math.max(numPrimes, 20), 4),
    [numPrimes],
  );

  const realizability = useMemo(
    () => darlingtonRealizabilityTest(numPrimes),
    [numPrimes],
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

    const margin = { left: 60, right: 30, top: 30, bottom: 44 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Collect all points for axis range
    const allPts = convergenceData.curves.flatMap(c => c.points);
    const logNMin = Math.min(...allPts.map(p => p.logPrimes));
    const logNMax = Math.max(...allPts.map(p => p.logPrimes));
    const validDeficits = allPts.filter(p => p.logDeficit > -18);
    const logDMin = validDeficits.length > 0 ? Math.min(...validDeficits.map(p => p.logDeficit)) - 0.5 : -8;
    const logDMax = validDeficits.length > 0 ? Math.max(...validDeficits.map(p => p.logDeficit)) + 0.5 : 1;
    const xRange = (logNMax - logNMin) || 1;
    const yRange = (logDMax - logDMin) || 1;

    const toX = (logN) => margin.left + ((logN - logNMin) / xRange) * plotW;
    const toY = (logD) => margin.top + plotH - ((logD - logDMin) / yRange) * plotH;

    // Background grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    for (let i = 0; i <= 5; i++) {
      const val = logDMin + (i / 5) * yRange;
      const y = toY(val);
      ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(w - margin.right, y); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const val = logNMin + (i / 4) * xRange;
      const x = toX(val);
      ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, h - margin.bottom); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Draw curves for each t value
    const colors = ['#06b6d4', '#f59e0b', '#a855f7'];
    convergenceData.curves.forEach((curve, ci) => {
      const color = colors[ci % colors.length];
      const pts = curve.points.filter(p => p.logDeficit > -18);

      // Line
      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = toX(p.logPrimes);
        const y = toY(p.logDeficit);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Points
      pts.forEach((p) => {
        const x = toX(p.logPrimes);
        const y = toY(p.logDeficit);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      });
    });

    // Draw fitted power law line for first curve
    if (convergenceData.fittedExponents.length > 0) {
      const fit = convergenceData.fittedExponents[0];
      if (Math.abs(fit.exponent) > 0.01) {
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        const x1 = logNMin;
        const x2 = logNMax;
        const y1 = (fit.exponent * Math.log(Math.pow(10, x1)) + fit.intercept) / Math.LN10;
        const y2 = (fit.exponent * Math.log(Math.pow(10, x2)) + fit.intercept) / Math.LN10;
        ctx.moveTo(toX(x1), toY(Math.max(Math.min(y1, logDMax), logDMin)));
        ctx.lineTo(toX(x2), toY(Math.max(Math.min(y2, logDMax), logDMin)));
        ctx.strokeStyle = '#ef444480';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Tail bound indicator
    if (tailBound.tailEstimate > 0) {
      const tailLogD = Math.log10(tailBound.tailEstimate);
      if (tailLogD >= logDMin && tailLogD <= logDMax) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#10b98180';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin.left, toY(tailLogD));
        ctx.lineTo(w - margin.right, toY(tailLogD));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#10b981';
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'left';
        ctx.fillText(`Tail bound: ${tailBound.tailEstimate.toExponential(1)}`, margin.left + 4, toY(tailLogD) - 4);
      }
    }

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const val = logDMin + (i / 5) * yRange;
      ctx.fillText(val.toFixed(1), margin.left - 6, toY(val) + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const val = logNMin + (i / 4) * xRange;
      ctx.fillText(`10^${val.toFixed(1)}`, toX(val), h - margin.bottom + 14);
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Number of primes (log scale)', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('log\u2081\u2080(unitarity deficit)', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('S7 Convergence: Unitarity Deficit vs. Prime Count', margin.left, margin.top - 12);

    // Legend
    const legendX = w - margin.right - 190;
    const legendY0 = margin.top + 2;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY0, 186, convergenceData.curves.length * 16 + 22, 4);
    ctx.fill(); ctx.stroke();

    convergenceData.curves.forEach((curve, ci) => {
      const lx = legendX + 8;
      const ly = legendY0 + 14 + ci * 16;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 16, ly);
      ctx.strokeStyle = colors[ci % colors.length]; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px var(--font-mono)'; ctx.textAlign = 'left';
      ctx.fillText(`t = ${curve.t.toFixed(2)}`, lx + 20, ly + 3);
    });
    // Fit line legend entry
    const fitLy = legendY0 + 14 + convergenceData.curves.length * 16;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(legendX + 8, fitLy); ctx.lineTo(legendX + 24, fitLy);
    ctx.strokeStyle = '#ef444480'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px var(--font-mono)'; ctx.textAlign = 'left';
    const avgExp = convergenceData.averageExponent;
    ctx.fillText(`Fit: N^{${avgExp.toFixed(2)}}`, legendX + 28, fitLy + 3);

  }, [convergenceData, tailBound]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        S7 Convergence: How the unitarity deficit{' '}
        <InlineMath tex={"|S_{11}|^2 + |S_{21}|^2 - 1"} /> shrinks as more primes are included.
        A negative slope on this log-log plot confirms power-law convergence to exact losslessness.
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 320, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}
      />

      {/* Fitted exponent and tail bound */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Fitted Power Law Exponent</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>
            N<sup style={{ fontSize: 12 }}>{convergenceData.averageExponent.toFixed(3)}</sup>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            {convergenceData.averageExponent < -0.5
              ? 'Strong convergence (faster than 1/sqrt(N))'
              : convergenceData.averageExponent < -0.1
                ? 'Moderate convergence detected'
                : 'Convergence rate is slow or inconclusive'}
          </div>
        </div>
        <div style={{ padding: 12, background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>PNT Tail Bound</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            {tailBound.tailEstimate.toExponential(3)}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            {tailBound.theoreticalRate}
          </div>
        </div>
      </div>

      {/* Darlington conditions checkboxes */}
      <div style={{ marginTop: 16, padding: 14, background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>
          Darlington Realization Conditions
        </div>
        {[
          {
            label: '(1) Symmetry: S\u2081\u2082 = S\u2082\u2081 (reciprocity)',
            pass: realizability.symmetry.pass,
            detail: realizability.symmetry.description,
          },
          {
            label: '(2) Unitarity: S\u2020S = I on \u03C3 = \u00BD',
            pass: realizability.unitarity.pass,
            detail: realizability.unitarity.description,
          },
          {
            label: '(3) Analyticity: bounded in \u03C3 > \u00BD',
            pass: realizability.analyticity.pass,
            detail: realizability.analyticity.description,
          },
        ].map((cond, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8,
            padding: '6px 8px', borderRadius: 6,
            background: cond.pass ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: cond.pass ? '#10b981' : '#ef4444',
              color: '#fff', fontSize: 12, fontWeight: 700,
            }}>
              {cond.pass ? '\u2713' : '\u2717'}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: cond.pass ? '#10b981' : '#ef4444' }}>
                {cond.label}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                {cond.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* S7 Gap Score */}
      <div style={{
        marginTop: 16, padding: 16, borderRadius: 8,
        background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(6,182,212,0.08))',
        border: '1px solid rgba(249,115,22,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 36, fontWeight: 800,
              color: realizability.score >= 80 ? '#10b981' : realizability.score >= 50 ? '#f59e0b' : '#ef4444',
            }}>
              {realizability.score}%
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>S7 GAP SCORE</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginBottom: 6 }}>
              Gap S7 Resolution Status
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
              {realizability.verdict}
              {' '}Convergence rate: <span style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>
                N<sup>{convergenceData.averageExponent.toFixed(2)}</sup>
              </span>.
              {' '}Tail bound: <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                {tailBound.tailEstimate.toExponential(2)}
              </span>.
            </div>
            {/* Progress bar */}
            <div style={{
              marginTop: 8, height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${realizability.score}%`, height: '100%', borderRadius: 3,
                background: realizability.score >= 80
                  ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                  : realizability.score >= 50
                    ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                    : 'linear-gradient(90deg, #ef4444, #f97316)',
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Off-Line Zero Contradiction ─────────────────────────────────────

function OffLineContradictionTab() {
  const [sigmaOff, setSigmaOff] = useState(0.6);
  const [tOff, setTOff] = useState(14.13);
  const canvasRef = useRef();

  const xValues = useMemo(() => {
    const xs = [];
    for (let exp = 1; exp <= 18; exp += 0.5) xs.push(Math.pow(10, exp));
    return xs;
  }, []);

  const data = useMemo(() => explicitFormulaResidue(sigmaOff, tOff, xValues), [sigmaOff, tOff, xValues]);
  const sweep = useMemo(() => offLineZeroSweep(20, tOff), [tOff]);

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

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    const margin = { top: 30, right: 20, bottom: 45, left: 65 };
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

    const valid = data.results.filter(r => r.totalDistortion > 0 && r.schoenfeldBound > 0);
    if (valid.length < 2) return;

    // Log-log plot: x-axis = log10(x), y-axis = log10(value)
    const minLogX = Math.log10(valid[0].x);
    const maxLogX = Math.log10(valid[valid.length - 1].x);
    const allVals = valid.flatMap(r => [r.totalDistortion, r.schoenfeldBound]);
    const minLogY = Math.floor(Math.log10(Math.max(Math.min(...allVals), 1e-30)));
    const maxLogY = Math.ceil(Math.log10(Math.max(...allVals)));
    const rangeLogX = maxLogX - minLogX || 1;
    const rangeLogY = maxLogY - minLogY || 1;

    const toX = logx => margin.left + ((logx - minLogX) / rangeLogX) * plotW;
    const toY = logy => h - margin.bottom - ((logy - minLogY) / rangeLogY) * plotH;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let ly = minLogY; ly <= maxLogY; ly += 2) {
      const y = toY(ly);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }

    // Schoenfeld bound (green line — the allowed region)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    valid.forEach((r, i) => {
      const x = toX(Math.log10(r.x));
      const y = toY(Math.log10(Math.max(r.schoenfeldBound, 1e-30)));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Off-line zero distortion (red line — the violation)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    valid.forEach((r, i) => {
      const x = toX(Math.log10(r.x));
      const y = toY(Math.log10(Math.max(r.totalDistortion, 1e-30)));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Contradiction zone (shade where red > green)
    const crossIdx = valid.findIndex(r => r.contradicts);
    if (crossIdx >= 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.beginPath();
      ctx.moveTo(toX(Math.log10(valid[crossIdx].x)), h - margin.bottom);
      ctx.lineTo(toX(Math.log10(valid[crossIdx].x)), margin.top);
      ctx.lineTo(w - margin.right, margin.top);
      ctx.lineTo(w - margin.right, h - margin.bottom);
      ctx.closePath();
      ctx.fill();

      // Contradiction label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CONTRADICTION', (toX(Math.log10(valid[crossIdx].x)) + w - margin.right) / 2, margin.top + 16);
    }

    // Legend
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`Off-line zero distortion (σ₀=${sigmaOff})`, margin.left + 8, margin.top + 14);
    ctx.fillStyle = '#10b981';
    ctx.fillText('Schoenfeld bound (RH-consistent)', margin.left + 8, margin.top + 30);

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('log₁₀(x)', w / 2, h - 6);
    ctx.save();
    ctx.translate(14, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('log₁₀(contribution)', 0, 0);
    ctx.restore();

    // X axis ticks
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let lx = Math.ceil(minLogX); lx <= maxLogX; lx += 2) {
      const x = toX(lx);
      ctx.fillStyle = '#475569';
      ctx.fillText(`10^${lx}`, x, h - margin.bottom + 14);
    }
  }, [data, sigmaOff]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-red">
        <p>
          <strong>Off-line zero contradiction:</strong> If a hypothetical zero existed at{' '}
          <InlineMath tex={`\\rho_0 = ${sigmaOff} + ${tOff}i`} />, its contribution to the
          explicit formula for <InlineMath tex="\\psi(x)" /> would grow as{' '}
          <InlineMath tex={`x^{${sigmaOff}}`} />, eventually exceeding the Schoenfeld bound{' '}
          <InlineMath tex="\\sqrt{x} \\log^2(x) / (8\\pi)" /> which assumes RH.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>σ₀ (off-line)</label>
          <input type="range" min="0.51" max="0.9" step="0.01" value={sigmaOff}
            onChange={e => setSigmaOff(+e.target.value)} />
          <span className="control-value">{sigmaOff.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>t₀ (imaginary part)</label>
          <input type="range" min="5" max="100" step="0.5" value={tOff}
            onChange={e => setTOff(+e.target.value)} />
          <span className="control-value">{tOff.toFixed(1)}</span>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a',
                 border: '1px solid #1e293b' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: data.firstContradiction ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                    border: `1px solid ${data.firstContradiction ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
        <strong style={{ color: data.firstContradiction ? '#ef4444' : '#f59e0b' }}>
          {data.verdict}
        </strong>
      </div>

      {/* Sigma sweep summary */}
      <div style={{ marginTop: 16, maxHeight: 200, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
              <th style={{ textAlign: 'left', padding: 4 }}>σ₀</th>
              <th style={{ textAlign: 'right', padding: 4 }}>Crossover x</th>
              <th style={{ textAlign: 'right', padding: 4 }}>Max ratio</th>
              <th style={{ textAlign: 'left', padding: 4 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sweep.sweep.map(({ sigma, crossoverX, crossoverLog10, maxRatio }) => (
              <tr key={sigma} style={{ color: '#94a3b8', borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: 4, fontFamily: 'var(--font-mono)' }}>{sigma.toFixed(2)}</td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {crossoverX ? `10^${crossoverLog10.toFixed(0)}` : '> 10^30'}
                </td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--font-mono)',
                             color: maxRatio > 1 ? '#ef4444' : '#f59e0b' }}>
                  {maxRatio.toFixed(1)}×
                </td>
                <td style={{ padding: 4, color: maxRatio > 1 ? '#ef4444' : '#f59e0b' }}>
                  {maxRatio > 1 ? '✗ Contradicts' : '⚠ Grows'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 6: Confinement ─────────────────────────────────────────────────────

function ConfinementTab({ numPrimes, t, report }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => confinementScan(t, [0.1, 0.9], 60, numPrimes),
    [t, numPrimes],
  );

  const { potentials, klVals, twistorVals, bridgeVals, hamiltonianVals, yMax } = useMemo(() => {
    const pots = data.map(d => d.potential);
    const kl = data.map(d => d.components.klTerm);
    const tw = data.map(d => d.components.twistorTerm);
    const br = data.map(d => d.components.bridgeTerm);
    const ham = data.map(d => d.components.hamiltonianTerm);
    let max = 1;
    for (let i = 0; i < data.length; i++) {
      for (const v of [pots[i], kl[i], tw[i], br[i], ham[i]]) {
        if (isFinite(v) && v > max) max = v;
      }
    }
    return { potentials: pots, klVals: kl, twistorVals: tw, bridgeVals: br, hamiltonianVals: ham, yMax: max * 1.1 };
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

    const margin = { left: 56, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const sigmaMin = data[0].sigma;
    const sigmaMax = data[data.length - 1].sigma;
    const sigmaRange = sigmaMax - sigmaMin || 1;

    const toX = (sigma) => margin.left + ((sigma - sigmaMin) / sigmaRange) * plotW;
    const toY = (val) => margin.top + plotH - (Math.min(val, yMax) / yMax) * plotH;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Gridlines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (i / yTicks) * yMax;
      const y = toY(val);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Vertical dashed line at sigma=0.5
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#ef444480';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(toX(0.5), margin.top);
    ctx.lineTo(toX(0.5), h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw component curves (thin lines)
    const drawCurve = (values, color, lineWidth, dash) => {
      ctx.beginPath();
      if (dash) ctx.setLineDash(dash);
      data.forEach((d, i) => {
        const x = toX(d.sigma);
        const y = toY(values[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      if (dash) ctx.setLineDash([]);
    };

    drawCurve(klVals, '#10b981', 1.2, []);            // KL: green, solid
    drawCurve(twistorVals, '#3b82f6', 1.2, [6, 3]);   // twistor: blue, dashed
    drawCurve(bridgeVals, '#f59e0b', 1.2, [2, 3]);    // bridge: yellow, dotted
    drawCurve(hamiltonianVals, '#ec4899', 1.2, [8, 3, 2, 3]); // Hamiltonian: pink, dash-dot

    // Total confinement potential (thick purple)
    drawCurve(potentials, '#8b5cf6', 3, []);

    // Mark minimum
    let minIdx = 0;
    for (let i = 1; i < potentials.length; i++) {
      if (potentials[i] < potentials[minIdx]) minIdx = i;
    }
    const minX = toX(data[minIdx].sigma);
    const minY = toY(potentials[minIdx]);
    ctx.beginPath();
    ctx.arc(minX, minY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#0a0e1a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#8b5cf6';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText(`min at \u03C3=${data[minIdx].sigma.toFixed(2)}`, minX + 8, minY - 4);

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= yTicks; i++) {
      const val = (i / yTicks) * yMax;
      const y = toY(val);
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const sigTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    for (const s of sigTicks) {
      if (s >= sigmaMin && s <= sigmaMax) {
        ctx.fillText(s.toFixed(1), toX(s), h - margin.bottom + 14);
      }
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = Re(s)', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('\u03A6(\u03C3) potential', 0, 0);
    ctx.restore();

    // Legend with background box
    const legendItems = [
      { color: '#8b5cf6', label: 'Total \u03A6(\u03C3)', width: 3, dash: [] },
      { color: '#10b981', label: 'KL divergence', width: 1.2, dash: [] },
      { color: '#3b82f6', label: 'Twistor', width: 1.2, dash: [6, 3] },
      { color: '#f59e0b', label: 'Bridge', width: 1.2, dash: [2, 3] },
      { color: '#ec4899', label: 'Hamiltonian', width: 1.2, dash: [8, 3, 2, 3] },
    ];
    const legendX = w - margin.right - 148;
    const legendY0 = margin.top + 2;
    const legendW = 144;
    const legendH = legendItems.length * 14 + 6;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY0, legendW, legendH, 4);
    ctx.fill();
    ctx.stroke();
    legendItems.forEach((item, i) => {
      const lx = legendX + 8;
      const ly = legendY0 + 12 + i * 14;
      ctx.beginPath();
      if (item.dash && item.dash.length) ctx.setLineDash(item.dash);
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 14, ly);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.width;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 18, ly + 3);
    });

  }, [data, potentials, klVals, twistorVals, bridgeVals, hamiltonianVals, yMax]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const statusColor = (status) =>
    status === 'partially-closed' ? '#10b981' : status === 'open' ? '#ef4444' : '#f59e0b';

  return (
    <div>
      <div className="tab-explainer accent-purple">
        <p style={{ margin: '0 0 8px' }}>
          The confinement potential should be minimized at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, confining all zeros to the critical line:
        </p>
        <BlockMath tex={"\\Phi(\\sigma) = \\alpha\\, D_{KL} + \\beta\\, |Z^*W|^2 + \\gamma\\,(1-|\\chi|)^2 + \\delta\\, \\Delta H"} />
        <p style={{ margin: '8px 0 0' }}>
          The thick purple curve shows the total; thin lines show individual components.
        </p>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}
      />
      {/* Gap closing status badges */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {[
          { key: 's4', label: 'S4: Analytic Continuation', data: report.s4 },
          { key: 's5', label: 'S5: Hilbert-Polya', data: report.s5 },
          { key: 's7', label: 'S7: Darlington', data: report.s7 },
        ].map(({ key, label, data: gapData }) => (
          <div key={key} style={{
            padding: '6px 12px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
            background: statusColor(gapData.status) + '15',
            border: `1px solid ${statusColor(gapData.status)}40`,
            color: statusColor(gapData.status),
          }}>
            <strong>{label}</strong>: {gapData.status}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function GapClosingViz() {
  const [tab, setTab] = useState(0);
  const [numPrimes, setNumPrimes] = useState(12);
  const [tIdx, setTIdx] = useState(0);

  const tValue = ZETA_ZEROS[tIdx];

  const report = useMemo(
    () => gapClosingReport(numPrimes, 10),
    [numPrimes],
  );

  const statusColor = (status) =>
    status === 'partially-closed' ? '#10b981' : status === 'open' ? '#ef4444' : '#f59e0b';

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
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="0" max="9" step="1" value={tIdx}
            onChange={e => setTIdx(+e.target.value)} />
          <span className="control-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {'\u03B3'}{String(tIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')} = {tValue.toFixed(3)}
          </span>
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

      {tab === 0 && <RegularizationTab numPrimes={numPrimes} t={tValue} />}
      {tab === 1 && <HilbertPolyaTab numPrimes={numPrimes} />}
      {tab === 2 && <DarlingtonTab numPrimes={numPrimes} t={tValue} />}
      {tab === 3 && <S7ConvergenceTab numPrimes={numPrimes} t={tValue} />}
      {tab === 4 && <OffLineContradictionTab />}
      {tab === 5 && <ConfinementTab numPrimes={numPrimes} t={tValue} report={report} />}

      {/* Summary panel */}
      <div style={{
        marginTop: 20, padding: '14px 18px', borderRadius: 8,
        background: '#0f172a', border: '1px solid #1e293b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <h4 style={{ color: '#e2e8f0', fontSize: 13, margin: 0 }}>Gap Closing Summary</h4>
          <span style={{
            fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px',
            borderRadius: 4, background: '#3b82f620', color: '#3b82f6',
          }}>{report.overallProgress}</span>
        </div>

        {[
          { key: 's4', label: 'S4 -- Analytic Continuation', data: report.s4 },
          { key: 's5', label: 'S5 -- Hilbert-Polya Operator', data: report.s5 },
          { key: 's7', label: 'S7 -- Darlington Synthesis', data: report.s7 },
        ].map(({ key, label, data: gapData }) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 0', borderBottom: '1px solid #1e293b',
          }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
              minWidth: 90, textAlign: 'center', textTransform: 'uppercase',
              background: statusColor(gapData.status) + '20',
              color: statusColor(gapData.status),
            }}>{gapData.status}</span>
            <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600, minWidth: 200 }}>{label}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', flex: 1 }}>{gapData.gapRemaining}</span>
          </div>
        ))}

        <div style={{ marginTop: 10, fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
          {report.criticalNext}
        </div>
      </div>
    </div>
  );
}
