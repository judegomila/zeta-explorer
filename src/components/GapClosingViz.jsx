import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import {
  regularizedEulerProduct, cascadeContinuation, convergenceAnalysis,
  hilbertPolyaMatrix, spectralConvergence,
  darlingtonSMatrix, darlingtonScan, darlingtonRealizability,
  confinementScan, gapClosingReport,
} from '../math/gap-closing.js';
import { ZETA_ZEROS } from '../math/zeta.js';

const TABS = ['Regularization', 'Hilbert-Polya', 'Darlington', 'Confinement'];

// ─── Tab 1: Regularization ──────────────────────────────────────────────────

function RegularizationTab({ numPrimes, t }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => cascadeContinuation(t, [0.1, 2.0], 60, numPrimes),
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

    const margin = { left: 56, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Compute log magnitudes for each curve
    const eulerLog = data.map(d => {
      const mag = Math.sqrt(d.eulerProduct[0] ** 2 + d.eulerProduct[1] ** 2);
      return mag > 1e-20 ? Math.log10(mag) : -20;
    });
    const regLog = data.map(d => {
      const mag = Math.sqrt(d.regularized[0] ** 2 + d.regularized[1] ** 2);
      return mag > 1e-20 ? Math.log10(mag) : -20;
    });
    const trueLog = data.map(d => {
      const mag = Math.sqrt(d.zetaTrue[0] ** 2 + d.zetaTrue[1] ** 2);
      return mag > 1e-20 ? Math.log10(mag) : -20;
    });

    const allVals = [...eulerLog, ...regLog, ...trueLog].filter(v => v > -15);
    const yMin = Math.min(...allVals, -2);
    const yMax = Math.max(...allVals, 2);
    const yRange = yMax - yMin || 1;

    const sigmaMin = data[0].sigma;
    const sigmaMax = data[data.length - 1].sigma;
    const sigmaRange = sigmaMax - sigmaMin;

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

  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        The raw Euler product <InlineMath tex="\prod_p (1-p^{-s})^{-1}" /> diverges for{' '}
        <InlineMath tex="\sigma \leq 1" />. The regularized product uses the eta relation{' '}
        <InlineMath tex="\zeta(s) = \eta(s)/(1-2^{1-s})" /> to extend analytically into the
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

    // Gather all eigenvalues and zeros across K values
    const allEigs = data.flatMap(d => d.eigenvalues);
    const allZeros = data.flatMap(d => d.targetZeros);
    const yMin = Math.min(...allEigs, ...allZeros) - 2;
    const yMax = Math.max(...allEigs, ...allZeros) + 2;
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

    // Legend (top)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(w - margin.right - 130, margin.top + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('Eigenvalues', w - margin.right - 124, margin.top + 11);

    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(w - margin.right - 134, margin.top + 24);
    ctx.lineTo(w - margin.right - 122, margin.top + 24);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Target zeros', w - margin.right - 118, margin.top + 27);

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

    // X-axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Matrix size K', w / 2, h - 4);

  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        The Hilbert-Polya matrix <InlineMath tex={"M_{jk} = \\sum_p \\frac{\\log p}{p} \\cos((\\gamma_j - \\gamma_k)\\log p)"} />{' '}
        couples prime oscillators. If a self-adjoint operator exists with{' '}
        <InlineMath tex={"\\text{Spec}(\\mathcal{A}) = \\{\\gamma_n\\}"} />, RH follows immediately.
        Blue dots show computed eigenvalues; red lines show target zeros.
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

    const margin = { left: 56, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const sigmaMin = data[0].sigma;
    const sigmaMax = data[data.length - 1].sigma;
    const sigmaRange = sigmaMax - sigmaMin;

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
        <InlineMath tex="|S^\dagger S - I|" /> (should be near zero at{' '}
        <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />).
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 300, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}
      />
    </div>
  );
}

// ─── Tab 4: Confinement ─────────────────────────────────────────────────────

function ConfinementTab({ numPrimes, t }) {
  const canvasRef = useRef();

  const data = useMemo(
    () => confinementScan(t, [0.1, 0.9], 60, numPrimes),
    [t, numPrimes],
  );

  const report = useMemo(
    () => gapClosingReport(numPrimes, 10),
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

    const margin = { left: 56, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const sigmaMin = data[0].sigma;
    const sigmaMax = data[data.length - 1].sigma;
    const sigmaRange = sigmaMax - sigmaMin;

    // Gather all potential values and component values
    const potentials = data.map(d => d.potential);
    const klVals = data.map(d => d.components.klTerm);
    const twistorVals = data.map(d => d.components.twistorTerm);
    const bridgeVals = data.map(d => d.components.bridgeTerm);
    const hamiltonianVals = data.map(d => d.components.hamiltonianTerm);

    const allVals = [...potentials, ...klVals, ...twistorVals, ...bridgeVals, ...hamiltonianVals];
    const yMax = Math.max(...allVals.filter(v => isFinite(v)), 1) * 1.1;

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
    const drawCurve = (values, color, lineWidth) => {
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = toX(d.sigma);
        const y = toY(values[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    drawCurve(klVals, '#10b981', 1);       // KL: green
    drawCurve(twistorVals, '#3b82f6', 1);  // twistor: blue
    drawCurve(bridgeVals, '#f59e0b', 1);   // bridge: yellow/orange
    drawCurve(hamiltonianVals, '#f97316', 1); // Hamiltonian: orange

    // Total confinement potential (thick purple)
    drawCurve(potentials, '#8b5cf6', 3);

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

    // Legend
    const legendItems = [
      { color: '#8b5cf6', label: 'Total \u03A6(\u03C3)', width: 3 },
      { color: '#10b981', label: 'KL divergence', width: 1 },
      { color: '#3b82f6', label: 'Twistor', width: 1 },
      { color: '#f59e0b', label: 'Bridge', width: 1 },
      { color: '#f97316', label: 'Hamiltonian', width: 1 },
    ];
    legendItems.forEach((item, i) => {
      const lx = w - margin.right - 140;
      const ly = margin.top + 8 + i * 14;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 14, ly);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.width;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 18, ly + 3);
    });

  }, [data]);

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
        The confinement potential <InlineMath tex={"\\Phi(\\sigma) = \\alpha D_{KL} + \\beta |Z^*W|^2 + \\gamma(1-|\\chi|)^2 + \\delta \\Delta H"} />{' '}
        should be minimized at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, confining all zeros
        to the critical line. The thick purple curve shows the total; thin lines show individual components.
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
          <span className="control-value">{numPrimes}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
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
      {tab === 3 && <ConfinementTab numPrimes={numPrimes} t={tValue} />}

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
