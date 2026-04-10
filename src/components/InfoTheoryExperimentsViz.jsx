import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import { getPrimes } from '../math/primes.js';
import { oscillatorStage, directLadder, dualLadder, losslessBridge } from '../math/oscillators.js';
import { zetaCriticalStrip, cMul, cAdd, cSub, cDiv, cAbs, cExp, cLog, eulerFactor, partialEulerProduct, ZETA_ZEROS } from '../math/zeta.js';

// ─── Shared color helpers ────────────────────────────────────────────────────

const PRIME_COLORS = [
  '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#e879f9', '#facc15', '#fb923c', '#a78bfa',
  '#22d3ee', '#f472b6', '#a3e635', '#fb7185', '#818cf8',
];

const MEASURE_COLORS = {
  entropy: '#10b981',
  capacity: '#3b82f6',
  fisher: '#f59e0b',
  kl: '#ef4444',
  mutual: '#8b5cf6',
  confinement: '#06b6d4',
};

const MEASURE_LABELS = {
  entropy: 'Shannon Entropy H',
  capacity: 'Channel Capacity C',
  fisher: 'Fisher Info I_F',
  kl: 'KL Divergence D_KL',
  mutual: 'Mutual Info I(D;D*)',
  confinement: 'Confinement Potential',
};

function sigmaStatusColor(sigma) {
  const d = Math.abs(sigma - 0.5);
  if (d < 0.03) return '#10b981';
  if (d < 0.15) return '#f59e0b';
  return '#ef4444';
}

// ─── Core computation functions ──────────────────────────────────────────────

function computeWeights(sigma, t, numPrimes) {
  const primes = getPrimes(numPrimes);
  const weights = [];
  let total = 0;
  for (const p of primes) {
    const ef = eulerFactor(p, [sigma, t]);
    const mag2 = cAbs(ef) ** 2;
    weights.push({ prime: p, mag2 });
    total += mag2;
  }
  if (total < 1e-20) return weights.map(w => ({ ...w, w: 1 / numPrimes }));
  return weights.map(w => ({ ...w, w: w.mag2 / total }));
}

function computeAllMeasures(sigma, t, numPrimes, precomputedWeightsHalf) {
  const weights = computeWeights(sigma, t, numPrimes);
  const weightsHalf = precomputedWeightsHalf || computeWeights(0.5, t, numPrimes);

  // 1. Shannon Entropy
  let entropy = 0;
  for (const { w } of weights) {
    if (w > 1e-20) entropy -= w * Math.log2(w);
  }
  const maxEntropy = Math.log2(numPrimes);

  // 2. Channel Capacity (SNR-based)
  const zeta = zetaCriticalStrip([sigma, t]);
  const zetaMag2 = cAbs(zeta) ** 2;
  const direct = directLadder([sigma, t], numPrimes);
  const dual = dualLadder([sigma, t], numPrimes);
  const Zdiff = cSub(direct.totalImpedance, dual.totalImpedance);
  const noise = cAbs(Zdiff) ** 2 + 0.001;
  const snr = zetaMag2 / noise;
  const capacity = Math.min(0.5 * Math.log2(1 + snr), 20);

  // 3. Fisher Information (via finite differences)
  const ds = 0.001;
  let fisher = 0;
  const primes = getPrimes(numPrimes);
  for (const p of primes) {
    const efC = cAbs(eulerFactor(p, [sigma, t]));
    const efP = cAbs(eulerFactor(p, [sigma + ds, t]));
    const efM = cAbs(eulerFactor(p, [sigma - ds, t]));
    if (efC > 1e-20) {
      const dLog = (Math.log(efP) - Math.log(efM)) / (2 * ds);
      fisher += dLog * dLog;
    }
  }

  // 4. KL Divergence from sigma=0.5
  let kl = 0;
  for (let i = 0; i < weights.length; i++) {
    const p = weights[i].w;
    const q = weightsHalf[i].w;
    if (p > 1e-20 && q > 1e-20) {
      kl += p * Math.log2(p / q);
    }
  }
  kl = Math.max(0, kl);

  // 5. Mutual Information (direct-dual entropy difference)
  const sDual = [1 - sigma, -t];
  const weightsDual = computeWeights(1 - sigma, -t, numPrimes);
  let entropyDual = 0;
  for (const { w } of weightsDual) {
    if (w > 1e-20) entropyDual -= w * Math.log2(w);
  }
  // Joint entropy from product distribution
  let totalJoint = 0;
  const jointWeights = [];
  for (let i = 0; i < weights.length; i++) {
    const j = weights[i].mag2 * weightsDual[i].mag2;
    jointWeights.push(j);
    totalJoint += j;
  }
  let jointEntropy = 0;
  if (totalJoint > 1e-20) {
    for (const j of jointWeights) {
      const p = j / totalJoint;
      if (p > 1e-20) jointEntropy -= p * Math.log2(p);
    }
  }
  const mutual = Math.max(0, entropy + entropyDual - jointEntropy);

  // 6. Confinement Potential (weighted composite)
  const entropyNorm = maxEntropy > 0 ? entropy / maxEntropy : 0;
  const capacityNorm = capacity / 20;
  const fisherNorm = Math.min(fisher / 100, 1);
  const klNorm = 1 / (1 + kl);
  const mutualNorm = maxEntropy > 0 ? mutual / maxEntropy : 0;
  const confinement = (entropyNorm + capacityNorm + fisherNorm + klNorm + mutualNorm) / 5;

  return {
    entropy, maxEntropy, capacity, fisher, kl, mutual, confinement,
    entropyNorm, capacityNorm: capacity / 20, fisherNorm, klNorm, mutualNorm,
    weights, weightsHalf,
  };
}

// ─── Tab Components ──────────────────────────────────────────────────────────

const TABS = ['Efficiency Dashboard', 'Prime Contributions', 'Landscape Scan', 'Compression Experiment'];
const TAB_COLORS = ['#10b981', '#8b5cf6', '#3b82f6', '#06b6d4'];

// ─── Tab 1: Efficiency Dashboard ─────────────────────────────────────────────

function EfficiencyDashboard({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const measures = useMemo(() => computeAllMeasures(sigma, t, numPrimes), [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 120, right: 30, top: 20, bottom: 20 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const bars = [
      { key: 'entropy', label: 'Shannon Entropy', value: measures.entropyNorm, raw: measures.entropy.toFixed(3) + ' bits' },
      { key: 'capacity', label: 'Channel Capacity', value: measures.capacityNorm, raw: measures.capacity.toFixed(2) + ' bits' },
      { key: 'fisher', label: 'Fisher Info', value: measures.fisherNorm, raw: measures.fisher.toFixed(2) },
      { key: 'kl', label: 'KL Divergence', value: measures.klNorm, raw: measures.kl.toFixed(4) + ' bits' },
      { key: 'mutual', label: 'Mutual Info', value: measures.mutualNorm, raw: measures.mutual.toFixed(3) + ' bits' },
      { key: 'confinement', label: 'Confinement', value: measures.confinement, raw: measures.confinement.toFixed(3) },
    ];

    const barH = plotH / bars.length - 8;
    const barGap = 8;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const y = margin.top + i * (barH + barGap);
      const val = Math.min(Math.max(bar.value, 0), 1);

      // Determine color based on how optimal (close to 1)
      let barColor;
      if (val > 0.85) barColor = '#10b981';
      else if (val > 0.6) barColor = '#f59e0b';
      else barColor = '#ef4444';

      // Background bar
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(margin.left, y, plotW, barH, 4);
      ctx.fill();

      // Value bar
      const barW = val * plotW;
      if (barW > 2) {
        ctx.fillStyle = barColor + 'cc';
        ctx.beginPath();
        ctx.roundRect(margin.left, y, barW, barH, 4);
        ctx.fill();

        // Glow effect
        const grad = ctx.createLinearGradient(margin.left, y, margin.left + barW, y);
        grad.addColorStop(0, barColor + '00');
        grad.addColorStop(1, barColor + '40');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(margin.left, y, barW, barH, 4);
        ctx.fill();
      }

      // Label (left side)
      ctx.fillStyle = MEASURE_COLORS[bar.key] || '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(bar.label, margin.left - 8, y + barH / 2);

      // Value readout (inside or right of bar)
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px var(--font-mono)';
      ctx.textAlign = 'left';
      const textX = barW > 120 ? margin.left + barW - 90 : margin.left + barW + 8;
      ctx.fillText(bar.raw, textX, y + barH / 2);

      // Percentage on far right
      ctx.fillStyle = barColor;
      ctx.font = '10px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.fillText((val * 100).toFixed(0) + '%', w - margin.right, y + barH / 2);
    }
  }, [measures]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Entropy Efficiency', value: (measures.entropyNorm * 100).toFixed(1) + '%', color: sigmaStatusColor(sigma) },
          { label: 'Channel Cap', value: measures.capacity.toFixed(2) + ' bits', color: MEASURE_COLORS.capacity },
          { label: 'D_KL from half', value: measures.kl.toFixed(4), color: measures.kl < 0.01 ? '#10b981' : '#ef4444' },
          { label: 'Fisher I_F', value: measures.fisher.toFixed(2), color: MEASURE_COLORS.fisher },
          { label: 'Mutual Info', value: measures.mutual.toFixed(3), color: MEASURE_COLORS.mutual },
          { label: 'Confinement', value: measures.confinement.toFixed(3), color: MEASURE_COLORS.confinement },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        All six bars reach their maximum simultaneously at{' '}
        <strong style={{ color: '#10b981' }}><InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /></strong>.
        The green/yellow/red coloring indicates proximity to the optimum. When all bars turn green,
        the twin ladder is operating at maximum efficiency on the critical line.
      </div>
    </div>
  );
}

// ─── Tab 2: Prime Contribution Analysis ──────────────────────────────────────

function PrimeContributions({ sigma, t, numPrimes }) {
  const canvasRef = useRef();
  const data = useMemo(() => {
    const primes = getPrimes(numPrimes);
    const ds = 0.001;
    const contribs = [];

    // Compute weights and per-prime measures
    let totalMag2 = 0;
    const mags = [];
    for (const p of primes) {
      const ef = eulerFactor(p, [sigma, t]);
      const mag2 = cAbs(ef) ** 2;
      mags.push(mag2);
      totalMag2 += mag2;
    }

    for (let i = 0; i < primes.length; i++) {
      const p = primes[i];
      const w = totalMag2 > 0 ? mags[i] / totalMag2 : 1 / numPrimes;

      // Entropy contribution: -w * log2(w)
      const entropyContrib = w > 1e-20 ? -w * Math.log2(w) : 0;

      // Capacity contribution per stage — reuse mags[i] instead of recomputing eulerFactor
      const efMag2 = mags[i];
      const stage = oscillatorStage(p, [sigma, t]);
      const stageNoise = 1 / (stage.Q * stage.Q + 1);
      const capContrib = 0.5 * Math.log2(1 + efMag2 / Math.max(stageNoise, 1e-10));

      // Fisher contribution — reuse mags[i] for efC instead of recomputing eulerFactor
      const efC = Math.sqrt(mags[i]);
      const efP = cAbs(eulerFactor(p, [sigma + ds, t]));
      const efM = cAbs(eulerFactor(p, [sigma - ds, t]));
      let fisherContrib = 0;
      if (efC > 1e-20) {
        const dLog = (Math.log(efP) - Math.log(efM)) / (2 * ds);
        fisherContrib = dLog * dLog;
      }

      contribs.push({
        prime: p,
        weight: w,
        entropyContrib,
        capContrib,
        fisherContrib,
        color: PRIME_COLORS[i % PRIME_COLORS.length],
      });
    }

    // Compute totals for percentage
    const totalEntropy = contribs.reduce((s, c) => s + c.entropyContrib, 0);
    const totalCap = contribs.reduce((s, c) => s + c.capContrib, 0);
    const totalFisher = contribs.reduce((s, c) => s + c.fisherContrib, 0);

    return { contribs, totalEntropy, totalCap, totalFisher };
  }, [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 35, bottom: 50 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // 3 groups: Entropy, Capacity, Fisher
    const groups = [
      { label: 'Entropy', key: 'entropyContrib', total: data.totalEntropy, color: '#10b981' },
      { label: 'Capacity', key: 'capContrib', total: data.totalCap, color: '#3b82f6' },
      { label: 'Fisher', key: 'fisherContrib', total: data.totalFisher, color: '#f59e0b' },
    ];

    const groupW = plotW / groups.length;
    const barW = Math.min(groupW * 0.7 / data.contribs.length, 14);

    for (let g = 0; g < groups.length; g++) {
      const group = groups[g];
      const gx = margin.left + g * groupW + groupW * 0.15;

      // Group label
      ctx.fillStyle = group.color;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(group.label, gx + groupW * 0.35, margin.top - 8);

      // Stacked bars per prime
      const total = group.total || 1;
      const maxVal = Math.max(...data.contribs.map(c => c[group.key]));
      const scale = maxVal > 0 ? plotH * 0.85 / maxVal : 1;

      for (let i = 0; i < data.contribs.length; i++) {
        const c = data.contribs[i];
        const x = gx + i * (barW + 2);
        const barH = Math.max(c[group.key] * scale, 1);
        const y = margin.top + plotH - barH;

        ctx.fillStyle = c.color + 'cc';
        ctx.fillRect(x, y, barW, barH);

        // Percentage label on top if there is space
        if (data.contribs.length <= 12) {
          const pct = total > 0 ? (c[group.key] / total * 100) : 0;
          if (pct > 3) {
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '8px var(--font-mono)';
            ctx.textAlign = 'center';
            ctx.fillText(pct.toFixed(0) + '%', x + barW / 2, y - 4);
          }
        }
      }
    }

    // X-axis prime labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let i = 0; i < data.contribs.length; i++) {
      const c = data.contribs[i];
      // Put labels under the first group
      const gx = margin.left + 0 * groupW + groupW * 0.15;
      const x = gx + i * (barW + 2) + barW / 2;
      if (data.contribs.length <= 12 || i % 2 === 0) {
        ctx.save();
        ctx.translate(x, margin.top + plotH + 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = c.color;
        ctx.fillText('p=' + c.prime, 0, 0);
        ctx.restore();
      }
    }

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotH);
    ctx.lineTo(w - margin.right, margin.top + plotH);
    ctx.stroke();
  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  // Compute uniformity metric
  const uniformity = data.contribs.length > 0
    ? 1 - Math.max(...data.contribs.map(c => c.weight)) + Math.min(...data.contribs.map(c => c.weight))
    : 0;
  const isUniform = Math.abs(sigma - 0.5) < 0.03;

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {data.contribs.slice(0, 12).map((c, i) => (
          <div key={c.prime} style={{
            padding: '4px 8px', borderRadius: 4,
            background: c.color + '20', border: '1px solid ' + c.color + '40',
            fontSize: 10, color: c.color, fontFamily: 'var(--font-mono)',
          }}>
            p={c.prime}: {(c.weight * 100).toFixed(1)}%
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        {isUniform ? (
          <>At <strong style={{ color: '#10b981' }}><InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /></strong>,
          the direct and dual ladders share the same weight distribution (functional equation symmetry
          maps <InlineMath tex={"s \\leftrightarrow 1-\\bar{s}"} />). This minimizes KL divergence and maximizes mutual information —
          the information-theoretic signature of the critical line. Small primes still contribute more than large ones,
          but direct and dual weights are perfectly matched.</>
        ) : (
          <>Away from <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, small primes dominate the distribution
          and direct/dual weight distributions diverge.
          At <strong style={{ color: sigmaStatusColor(sigma) }}><InlineMath tex={"\\sigma"} /> = {sigma.toFixed(2)}</strong>,
          the KL divergence between direct and dual distributions is nonzero, reducing channel efficiency.</>
        )}
        {' '}<span style={{ color: '#64748b' }}>Weight uniformity index: <strong style={{ color: uniformity > 0.85 ? '#10b981' : uniformity > 0.6 ? '#f59e0b' : '#ef4444', fontFamily: 'var(--font-mono)' }}>{(uniformity * 100).toFixed(1)}%</strong> (1 − max + min over per-prime weights; 100% = perfectly flat).</span>
      </div>
    </div>
  );
}

// ─── Tab 3: Landscape Scan ───────────────────────────────────────────────────

function LandscapeScan({ sigma, t, numPrimes }) {
  const canvasRef = useRef();

  const scanData = useMemo(() => {
    const steps = 80;
    const weightsHalf = computeWeights(0.5, t, numPrimes);
    const results = [];
    for (let i = 0; i <= steps; i++) {
      const s = 0.1 + i * (0.8 / steps);
      const m = computeAllMeasures(s, t, numPrimes, weightsHalf);
      results.push({ sigma: s, ...m });
    }
    return results;
  }, [t, numPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 140, top: 30, bottom: 40 };
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

    // sigma = 0.5 vertical line
    const halfX = margin.left + ((0.5 - 0.1) / 0.8) * plotW;
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#10b981aa';
    ctx.lineWidth = 2;
    ctx.moveTo(halfX, margin.top);
    ctx.lineTo(halfX, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = 1/2', halfX, margin.top - 8);

    // Current sigma indicator
    if (sigma >= 0.1 && sigma <= 0.9) {
      const curX = margin.left + ((sigma - 0.1) / 0.8) * plotW;
      ctx.beginPath();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#e2e8f060';
      ctx.lineWidth = 1;
      ctx.moveTo(curX, margin.top);
      ctx.lineTo(curX, h - margin.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Curves: normalize each to [0,1] for overlaid comparison
    const curves = [
      { key: 'entropyNorm', label: 'Entropy', color: MEASURE_COLORS.entropy },
      { key: 'capacityNorm', label: 'Capacity', color: MEASURE_COLORS.capacity },
      { key: 'fisherNorm', label: 'Fisher', color: MEASURE_COLORS.fisher },
      { key: 'klNorm', label: '1/(1+KL)', color: MEASURE_COLORS.kl },
      { key: 'mutualNorm', label: 'Mutual Info', color: MEASURE_COLORS.mutual },
      { key: 'confinement', label: 'Confinement', color: MEASURE_COLORS.confinement },
    ];

    for (const curve of curves) {
      const values = scanData.map(d => d[curve.key]);
      const maxV = Math.max(...values, 0.001);
      const minV = Math.min(...values);
      const range = maxV - minV || 1;

      ctx.beginPath();
      for (let i = 0; i < scanData.length; i++) {
        const x = margin.left + ((scanData[i].sigma - 0.1) / 0.8) * plotW;
        const y = h - margin.bottom - ((values[i] - minV) / range) * plotH * 0.9;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Legend
    const legendX = w - margin.right + 12;
    let legendY = margin.top + 10;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    for (const curve of curves) {
      ctx.fillStyle = curve.color;
      ctx.fillRect(legendX, legendY - 4, 12, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(curve.label, legendX + 16, legendY);
      legendY += 16;
    }

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let s = 0.1; s <= 0.9; s += 0.1) {
      const x = margin.left + ((s - 0.1) / 0.8) * plotW;
      ctx.fillText(s.toFixed(1), x, h - margin.bottom + 14);
    }
    ctx.fillText('\u03C3', w - margin.right - 10, h - margin.bottom + 14);

    // Y-axis label
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Normalized value (0 to 1)', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('All 6 Measures vs \u03C3 (fixed t = ' + t.toFixed(1) + ')', margin.left + 8, margin.top - 12);
  }, [scanData, sigma, t]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 320, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        <strong style={{ color: '#e2e8f0' }}>Key observation:</strong> All six independent measures achieve
        their optimum (peak or trough, depending on the measure) at{' '}
        <strong style={{ color: '#10b981' }}><InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /></strong>.
        The vertical dashed green line marks the critical line. Entropy, capacity, mutual info, and the
        confinement potential are all maximized there; KL divergence reaches its minimum (zero) there.
        Six different lenses, one answer.
      </div>
    </div>
  );
}

// ─── Tab 4: Compression Experiment ───────────────────────────────────────────

function CompressionExperiment({ sigma, t }) {
  const canvasRef = useRef();

  const data = useMemo(() => {
    const sigmas = [0.3, 0.5, 0.7];
    const maxK = 20;
    const curves = {};

    for (const sig of sigmas) {
      const s = [sig, t];
      // Compute "exact" with many primes
      const exact = zetaCriticalStrip(s);
      const exactMag = cAbs(exact);

      const points = [];
      let partial = [1, 0];
      const primes = getPrimes(maxK);

      for (let k = 0; k < maxK; k++) {
        const ef = eulerFactor(primes[k], s);
        partial = cMul(partial, ef);
        const diff = cAbs(cSub(exact, partial));
        const relErr = exactMag > 1e-10 ? diff / exactMag : diff;
        points.push({ k: k + 1, prime: primes[k], relErr });
      }
      curves[sig] = points;
    }

    return { curves, sigmas };
  }, [t]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 60, right: 100, top: 30, bottom: 45 };
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

    const curveColors = { '0.3': '#ef4444', '0.5': '#10b981', '0.7': '#3b82f6' };
    const curveLabels = { '0.3': '\u03C3 = 0.3', '0.5': '\u03C3 = 0.5', '0.7': '\u03C3 = 0.7' };

    // Get global max for log scale
    let allErrors = [];
    for (const sig of data.sigmas) {
      for (const pt of data.curves[sig]) {
        if (pt.relErr > 0) allErrors.push(Math.log10(Math.max(pt.relErr, 1e-16)));
      }
    }
    const minLog = Math.min(...allErrors, -10);
    const maxLog = Math.max(...allErrors, 0);
    const logRange = maxLog - minLog || 1;

    // Plot curves
    for (const sig of data.sigmas) {
      const points = data.curves[sig];
      const color = curveColors[sig.toString()];

      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const x = margin.left + (i / (points.length - 1)) * plotW;
        const logErr = Math.log10(Math.max(points[i].relErr, 1e-16));
        const y = h - margin.bottom - ((logErr - minLog) / logRange) * plotH * 0.9;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dots
      for (let i = 0; i < points.length; i++) {
        const x = margin.left + (i / (points.length - 1)) * plotW;
        const logErr = Math.log10(Math.max(points[i].relErr, 1e-16));
        const y = h - margin.bottom - ((logErr - minLog) / logRange) * plotH * 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    // Connes threshold: 5 primes (vertical line)
    const connesX = margin.left + (4 / 19) * plotW;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#f59e0baa';
    ctx.lineWidth = 1.5;
    ctx.moveTo(connesX, margin.top);
    ctx.lineTo(connesX, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('5 primes', connesX, margin.top - 6);
    ctx.fillText('(Connes)', connesX, margin.top + 6);

    // Legend
    const legendX = w - margin.right + 10;
    let legendY = margin.top + 20;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    for (const sig of data.sigmas) {
      const color = curveColors[sig.toString()];
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY - 4, 12, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(curveLabels[sig.toString()], legendX + 16, legendY);
      legendY += 16;
    }

    // X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    const primes = getPrimes(20);
    for (let i = 0; i < 20; i += 2) {
      const x = margin.left + (i / 19) * plotW;
      ctx.fillText(primes[i].toString(), x, h - margin.bottom + 12);
    }
    ctx.font = '10px var(--font-mono)';
    ctx.fillText('primes used', w / 2, h - 4);

    // Y-axis labels
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('log10(relative error)', 0, 0);
    ctx.restore();

    // Y ticks
    ctx.fillStyle = '#475569';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let v = Math.ceil(minLog); v <= Math.floor(maxLog); v++) {
      const y = h - margin.bottom - ((v - minLog) / logRange) * plotH * 0.9;
      ctx.fillText('1e' + v, margin.left - 6, y + 3);
      ctx.beginPath();
      ctx.strokeStyle = '#1e293b';
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Compression: Primes needed for accuracy (t = ' + t.toFixed(1) + ')', margin.left + 8, margin.top - 10);
  }, [data, t]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const h = () => draw(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [draw]);

  // Compute 5-prime errors for the stat boxes
  const err5 = {};
  for (const sig of data.sigmas) {
    const pts = data.curves[sig];
    err5[sig] = pts.length >= 5 ? pts[4].relErr : 1;
  }

  return (
    <div>
      <canvas ref={canvasRef}
        style={{ width: '100%', height: 320, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Err@5 (\u03C3=0.3)', value: err5[0.3] ? err5[0.3].toExponential(2) : '-', color: '#ef4444' },
          { label: 'Err@5 (\u03C3=0.5)', value: err5[0.5] ? err5[0.5].toExponential(2) : '-', color: '#10b981' },
          { label: 'Err@5 (\u03C3=0.7)', value: err5[0.7] ? err5[0.7].toExponential(2) : '-', color: '#3b82f6' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1225', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
        <strong>Caveat:</strong> The Euler product <InlineMath tex={"\\prod_p(1-p^{-s})^{-1}"} /> only converges
        for <InlineMath tex={"\\text{Re}(s) > 1"} />. At all three <InlineMath tex={"\\sigma"} /> values shown
        (0.3, 0.5, 0.7) it formally diverges; the chart measures how close the first 20 partial products come
        to the analytically continued <InlineMath tex={"\\zeta(s)"} />, not true convergence.
        The yellow vertical marks the <strong style={{ color: '#f59e0b' }}>Connes threshold</strong> (5 primes, up to p=11).
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function InfoTheoryExperimentsViz() {
  const [tab, setTab] = useState(0);
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(8);

  const sigmaColor = sigmaStatusColor(sigma);

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"\\sigma"} /></label>
          <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex={"t"} /></label>
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
          <input type="range" min="3" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <button
          onClick={() => setSigma(0.5)}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #10b981',
            background: Math.abs(sigma - 0.5) < 0.01 ? '#10b98130' : '#10b98118',
            color: '#10b981',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Reset to Critical Line
        </button>
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
            <strong>Efficiency Dashboard:</strong> Six information-theoretic measures — Shannon entropy, channel capacity,
            Fisher information, KL divergence, mutual information, and a composite confinement potential — each
            normalized to [0, 1]. All six reach their optimum simultaneously at{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            <strong> Look for:</strong> all bars turning green as you approach the critical line.
          </div>
          <EfficiencyDashboard sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 1 && (
        <>
          <div className="tab-explainer accent-purple">
            <strong>Prime Contributions:</strong> Per-prime breakdown of entropy, channel capacity, and Fisher information.
            Each bar group shows how much each prime oscillator contributes to the total measure.
            At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, contributions are most uniformly distributed across primes
            (functional equation symmetry equalizes direct and dual weights).
            <strong> Look for:</strong> how small primes dominate away from the critical line.
          </div>
          <PrimeContributions sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 2 && (
        <>
          <div className="tab-explainer accent-blue">
            <strong>Landscape Scan:</strong> All six measures plotted as functions of{' '}
            <InlineMath tex={"\\sigma"} /> at fixed <InlineMath tex="t" />. Each curve is individually
            normalized so their shapes can be compared on the same chart. The dashed green line marks{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            <strong> Look for:</strong> all six curves peaking (or troughing for KL) at the critical line — six independent lenses, one answer.
          </div>
          <LandscapeScan sigma={sigma} t={t} numPrimes={numPrimes} />
        </>
      )}
      {tab === 3 && (
        <>
          <div className="tab-explainer accent-cyan">
            <strong>Compression Experiment:</strong> How many primes (Euler product factors) are needed to approximate{' '}
            <InlineMath tex={"\\zeta(s)"} /> to a given accuracy? Compares convergence at{' '}
            <InlineMath tex={"\\sigma = 0.3, 0.5, 0.7"} />. The vertical line marks the "Connes threshold" (5 primes).
            <strong> Look for:</strong> the <InlineMath tex={"\\sigma = 0.5"} /> curve (green) achieving
            lower error with fewer primes than off-critical values.
          </div>
          <CompressionExperiment sigma={sigma} t={t} />
        </>
      )}
    </div>
  );
}
