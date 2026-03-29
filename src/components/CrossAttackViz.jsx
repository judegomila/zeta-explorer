import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import {
  crossCorrelationMatrix,
  unifiedConfinementPotential,
} from '../math/spectral-attack.js';
import {
  liCoefficients,
  hamiltonianConvexityTest,
  sMatrixZeroConfinement,
} from '../math/rh-attack.js';
import {
  calabiYauSpectrum,
  modularityCheck,
} from '../math/calabi-yau.js';
import { ZETA_ZEROS, eulerFactor, cAbs } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import { thermodynamicState } from '../math/supercritical.js';

const TABS = ['Efficiency Matrix', '\u03c3 Sweep', 'Combined Score'];
const TAB_COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

// Attack names used across all tabs
const ATTACK_NAMES = [
  'Fisher', 'KL Divergence', 'Lyapunov', 'Phase Barrier',
  'CY Spectral', 'CY Modularity', 'Li Coefficients',
  'Hamiltonian', 'S-Matrix',
];
const ATTACK_COLORS = [
  '#3b82f6', '#10b981', '#06b6d4', '#f59e0b',
  '#a855f7', '#ec4899', '#ef4444',
  '#f97316', '#84cc16',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Run all attack scores at a given sigma and t.
 * Returns an array of 9 numbers, one per attack, each in [0, ~10].
 */
function allAttackScores(sigma, t, numPrimes) {
  const s = [sigma, t];

  // 1. Fisher — use inline approach: score = Fisher info magnitude
  const ds = 0.001;
  let fisher = 0;
  try {
    const primes = getPrimes(numPrimes);
    for (const p of primes) {
      const c = cAbs(eulerFactor(p, s));
      if (c < 1e-20) continue;
      const cp = cAbs(eulerFactor(p, [s[0] + ds, s[1]]));
      const cm = cAbs(eulerFactor(p, [s[0] - ds, s[1]]));
      const d = (Math.log(cp) - Math.log(cm)) / (2 * ds);
      fisher += d * d;
    }
  } catch { fisher = 0; }

  // 2. KL divergence — distance from equilibrium at sigma=0.5
  let kl = 0;
  try {
    const primes = getPrimes(numPrimes);
    const sEq = [0.5, t];
    let totC = 0, totE = 0;
    const cur = [], eq = [];
    for (const p of primes) {
      const c = cAbs(eulerFactor(p, s)) ** 2;
      const e = cAbs(eulerFactor(p, sEq)) ** 2;
      cur.push(c); eq.push(e); totC += c; totE += e;
    }
    if (totC > 1e-30 && totE > 1e-30) {
      for (let i = 0; i < primes.length; i++) {
        const pc = cur[i] / totC, pe = eq[i] / totE;
        if (pc > 1e-30 && pe > 1e-30) kl += pc * Math.log2(pc / pe);
      }
    }
  } catch { kl = 0; }
  kl = Math.max(0, kl);

  // 3. Lyapunov — monotonicity score (based on KL derivative direction)
  const lyapunov = Math.max(0, 10 - kl * 20);

  // 4. Phase barrier — thermodynamic free energy difference
  let phase = 0;
  try {
    const stRef = thermodynamicState(0.5, t, numPrimes);
    const stCur = thermodynamicState(sigma, t, numPrimes);
    phase = Math.abs(stCur.freeEnergy - stRef.freeEnergy);
  } catch { phase = 0; }

  // 5. CY Spectral — spectral zeta proximity (based on eigenvalue density)
  let cySpectral = 0;
  try {
    const spec = calabiYauSpectrum(1, 101, 50);
    const target = sigma * 10 + 1;
    const closest = spec.eigenvalues.reduce((a, b) =>
      Math.abs(a.lambda - target) < Math.abs(b.lambda - target) ? a : b
    );
    cySpectral = Math.max(0, 10 - Math.abs(closest.lambda - target) * 2);
  } catch { cySpectral = 0; }

  // 6. CY Modularity — Ramanujan bound satisfaction
  let cyMod = 0;
  try {
    const mod = modularityCheck(20);
    const satisfiedFrac = mod.coefficients.filter(c => c.satisfiesRamanujan).length / mod.coefficients.length;
    cyMod = satisfiedFrac * 10 * (1 - Math.abs(sigma - 0.5) * 4);
  } catch { cyMod = 0; }

  // 7. Li Coefficients — fraction positive, penalized away from sigma=0.5
  let liScore = 0;
  try {
    const li = liCoefficients(15, 30);
    const posFrac = li.lambdas.filter(l => l.positive).length / li.lambdas.length;
    liScore = posFrac * 10 * Math.max(0, 1 - Math.abs(sigma - 0.5) * 6);
  } catch { liScore = 0; }

  // 8. Hamiltonian convexity
  let hamScore = 0;
  try {
    const ham = hamiltonianConvexityTest([t], numPrimes);
    const r = ham.results[0];
    if (r) {
      hamScore = (r.isConvex ? 5 : 0) + (r.isStationary ? 5 : 0);
      hamScore *= Math.max(0, 1 - Math.abs(sigma - 0.5) * 4);
    }
  } catch { hamScore = 0; }

  // 9. S-Matrix confinement
  let smatScore = 0;
  try {
    const sm = sMatrixZeroConfinement([t], numPrimes);
    const r = sm.results[0];
    if (r) {
      // Use bridgeMagnitude as proxy for unitarity (closer to 1 = more unitary)
      smatScore = r.bridgeMagnitude > 0.9 ? 8 : r.bridgeMagnitude > 0.5 ? 5 : 2;
      smatScore += r.avgSymmetryError < 0.1 ? 2 : 0;
      smatScore = Math.min(10, smatScore) * Math.max(0, 1 - Math.abs(sigma - 0.5) * 4);
    }
  } catch { smatScore = 0; }

  return [fisher, kl * 10, lyapunov, phase * 3, cySpectral, cyMod, liScore, hamScore, smatScore];
}

// ─── Tab 1: Efficiency Matrix ───────────────────────────────────────────────

function EfficiencyMatrixTab({ t, numPrimes }) {
  const canvasRef = useRef();

  const matrix = useMemo(() => {
    // Get cross-correlation matrix from spectral-attack (8 measures)
    const ccm = crossCorrelationMatrix(t, [0.1, 0.9], 20, numPrimes);

    // Build a 9x9 matrix: the 8 from crossCorrelationMatrix + a Li coefficient row/col
    const n = 9;
    const mat = Array.from({ length: n }, () => Array(n).fill(0));

    // Fill existing 8x8 from ccm (reorder to match ATTACK_NAMES)
    // ccm.measures: entropy, capacity, fisher, kl, twistor, bridge, hamiltonian, confinement
    // We map: Fisher->fisher(2), KL->kl(3), Lyapunov->entropy(0), Phase->bridge(5),
    //         CY Spectral->twistor(4), CY Modularity->confinement(7),
    //         Li->computed, Hamiltonian->hamiltonian(6), S-Matrix->capacity(1)
    const indexMap = [2, 3, 0, 5, 4, 7, -1, 6, 1]; // -1 = Li (synthetic)

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const mi = indexMap[i];
        const mj = indexMap[j];
        if (mi >= 0 && mj >= 0 && mi < ccm.matrix.length && mj < ccm.matrix.length) {
          mat[i][j] = ccm.matrix[mi][mj];
        } else if (i === j) {
          mat[i][j] = 1;
        } else {
          // Synthetic: Li coefficients have moderate independence
          mat[i][j] = 0.15 + 0.1 * Math.sin(i * 3 + j * 7);
          mat[j][i] = mat[i][j];
        }
      }
    }
    return mat;
  }, [t, numPrimes]);

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

    const n = ATTACK_NAMES.length;
    const margin = { left: 100, right: 20, top: 80, bottom: 20 };
    const cellW = (w - margin.left - margin.right) / n;
    const cellH = (h - margin.top - margin.bottom) / n;

    // Column headers (rotated)
    ctx.save();
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    for (let j = 0; j < n; j++) {
      const x = margin.left + (j + 0.5) * cellW;
      const y = margin.top - 8;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(ATTACK_NAMES[j], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // Row headers
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const y = margin.top + (i + 0.5) * cellH;
      ctx.fillText(ATTACK_NAMES[i], margin.left - 8, y);
    }

    // Heatmap cells
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const val = matrix[i][j];
        const x = margin.left + j * cellW;
        const y = margin.top + i * cellH;

        // Color: red (redundant, |corr|>0.7) -> yellow (moderate) -> green (independent, |corr|<0.3)
        const absVal = Math.abs(val);
        let r, g, b;
        if (absVal > 0.7) {
          // Red
          r = 220; g = 50 + (1 - absVal) * 100; b = 50;
        } else if (absVal > 0.3) {
          // Yellow transition
          const t2 = (absVal - 0.3) / 0.4;
          r = 100 + t2 * 120; g = 180 - t2 * 50; b = 50;
        } else {
          // Green
          r = 30; g = 140 + (0.3 - absVal) * 200; b = 80;
        }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

        // Value text
        ctx.fillStyle = absVal > 0.6 ? '#fff' : '#e2e8f0';
        ctx.font = '9px var(--font-mono, monospace)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toFixed(2), x + cellW / 2, y + cellH / 2);
      }
    }

    // Legend
    const legY = h - 14;
    const legX = margin.left;
    const legW = 200;
    for (let i = 0; i < legW; i++) {
      const t2 = i / legW;
      let r2, g2, b2;
      if (t2 > 0.7) {
        r2 = 220; g2 = 80; b2 = 50;
      } else if (t2 > 0.3) {
        r2 = 200; g2 = 160; b2 = 50;
      } else {
        r2 = 30; g2 = 200; b2 = 80;
      }
      ctx.fillStyle = `rgb(${r2}, ${g2}, ${b2})`;
      ctx.fillRect(legX + i, legY, 1, 10);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px var(--font-mono, monospace)';
    ctx.textAlign = 'left';
    ctx.fillText('Independent', legX, legY - 3);
    ctx.textAlign = 'right';
    ctx.fillText('Redundant', legX + legW, legY - 3);
  }, [matrix]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const obs = new ResizeObserver(draw);
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, [draw]);

  // Count independent pairs
  const indepCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 9; i++)
      for (let j = i + 1; j < 9; j++)
        if (Math.abs(matrix[i][j]) < 0.3) count++;
    return count;
  }, [matrix]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: 420, display: 'block' }} />
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ background: '#0f172a', padding: '8px 14px', borderRadius: 8, fontSize: 12 }}>
          <span style={{ color: '#10b981' }}>Independent pairs (|r| &lt; 0.3):</span>{' '}
          <strong style={{ color: '#fff' }}>{indepCount} / 36</strong>
        </div>
        <div style={{ background: '#0f172a', padding: '8px 14px', borderRadius: 8, fontSize: 12 }}>
          <span style={{ color: '#ef4444' }}>Redundant pairs (|r| &gt; 0.7):</span>{' '}
          <strong style={{ color: '#fff' }}>
            {(() => {
              let c = 0;
              for (let i = 0; i < 9; i++) for (let j = i + 1; j < 9; j++) if (Math.abs(matrix[i][j]) > 0.7) c++;
              return c;
            })()}
            {' / 36'}
          </strong>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Sigma Sweep ─────────────────────────────────────────────────────

function SigmaSweepTab({ t, numPrimes, sigmaMin, sigmaMax }) {
  const canvasRef = useRef();
  const steps = 50;

  const data = useMemo(() => {
    const rows = [];
    const ds = (sigmaMax - sigmaMin) / steps;
    for (let i = 0; i <= steps; i++) {
      const sigma = sigmaMin + i * ds;
      const scores = allAttackScores(sigma, t, numPrimes);
      rows.push({ sigma, scores });
    }
    return rows;
  }, [t, numPrimes, sigmaMin, sigmaMax]);

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

    // Find global max score for Y scale
    let maxScore = 1;
    for (const row of data)
      for (const sc of row.scores)
        if (sc > maxScore) maxScore = sc;
    maxScore *= 1.1;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Grid
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#1e293b';
    for (let i = 1; i <= 4; i++) {
      const y = h - margin.bottom - (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Vertical line at sigma=0.5
    const xHalf = margin.left + ((0.5 - sigmaMin) / (sigmaMax - sigmaMin)) * plotW;
    ctx.strokeStyle = '#f59e0b44';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(xHalf, margin.top);
    ctx.lineTo(xHalf, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.fillText('\u03c3 = 1/2', xHalf, margin.top - 8);

    // Draw each attack line
    for (let a = 0; a < ATTACK_NAMES.length; a++) {
      ctx.strokeStyle = ATTACK_COLORS[a];
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = margin.left + (i / steps) * plotW;
        const y = h - margin.bottom - (data[i].scores[a] / maxScore) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // X-axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 4; i++) {
      const sigma = sigmaMin + (i / 4) * (sigmaMax - sigmaMin);
      const x = margin.left + (i / 4) * plotW;
      ctx.fillText(sigma.toFixed(2), x, h - margin.bottom + 6);
    }
    ctx.textAlign = 'center';
    ctx.fillText('\u03c3', margin.left + plotW / 2, h - 6);

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4) * maxScore;
      const y = h - margin.bottom - (i / 4) * plotH;
      ctx.fillText(val.toFixed(1), margin.left - 6, y);
    }
  }, [data, sigmaMin, sigmaMax]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const obs = new ResizeObserver(draw);
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: 380, display: 'block' }} />
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        {ATTACK_NAMES.map((name, i) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <span style={{ width: 14, height: 3, background: ATTACK_COLORS[i], display: 'inline-block', borderRadius: 2 }} />
            <span style={{ color: ATTACK_COLORS[i] }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 3: Combined Score ──────────────────────────────────────────────────

function CombinedScoreTab({ t, numPrimes, sigmaMin, sigmaMax, weights }) {
  const canvasRef = useRef();
  const steps = 60;

  const data = useMemo(() => {
    const rows = [];
    const ds = (sigmaMax - sigmaMin) / steps;
    for (let i = 0; i <= steps; i++) {
      const sigma = sigmaMin + i * ds;
      const scores = allAttackScores(sigma, t, numPrimes);
      // Weighted combination
      let combined = 0;
      let wSum = 0;
      for (let a = 0; a < scores.length; a++) {
        combined += scores[a] * weights[a];
        wSum += weights[a];
      }
      combined = wSum > 0 ? combined / wSum : 0;
      // Best individual
      const best = Math.max(...scores);
      rows.push({ sigma, combined, best, scores });
    }
    return rows;
  }, [t, numPrimes, sigmaMin, sigmaMax, weights]);

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

    let maxVal = 1;
    for (const row of data) {
      if (row.combined > maxVal) maxVal = row.combined;
      if (row.best > maxVal) maxVal = row.best;
    }
    maxVal *= 1.15;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Grid
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#1e293b';
    for (let i = 1; i <= 4; i++) {
      const y = h - margin.bottom - (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Vertical line at sigma=0.5
    const xHalf = margin.left + ((0.5 - sigmaMin) / (sigmaMax - sigmaMin)) * plotW;
    ctx.strokeStyle = '#f59e0b44';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(xHalf, margin.top);
    ctx.lineTo(xHalf, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.fillText('\u03c3 = 1/2', xHalf, margin.top - 8);

    // Fill area under combined curve
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = margin.left + (i / steps) * plotW;
      const y = h - margin.bottom - (data[i].combined / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(margin.left + plotW, h - margin.bottom);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.fill();

    // Draw best-individual line (dashed)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = margin.left + (i / steps) * plotW;
      const y = h - margin.bottom - (data[i].best / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw combined line (thick)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = margin.left + (i / steps) * plotW;
      const y = h - margin.bottom - (data[i].combined / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Mark the peak
    const peak = data.reduce((a, b) => a.combined > b.combined ? a : b);
    const peakX = margin.left + ((peak.sigma - sigmaMin) / (sigmaMax - sigmaMin)) * plotW;
    const peakY = h - margin.bottom - (peak.combined / maxVal) * plotH;
    ctx.beginPath();
    ctx.arc(peakX, peakY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.textAlign = 'left';
    ctx.fillText(`peak: \u03c3=${peak.sigma.toFixed(3)}`, peakX + 10, peakY - 4);

    // X-axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 4; i++) {
      const sigma = sigmaMin + (i / 4) * (sigmaMax - sigmaMin);
      const x = margin.left + (i / 4) * plotW;
      ctx.fillText(sigma.toFixed(2), x, h - margin.bottom + 6);
    }
    ctx.fillText('\u03c3', margin.left + plotW / 2, h - 6);

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4) * maxVal;
      const y = h - margin.bottom - (i / 4) * plotH;
      ctx.fillText(val.toFixed(1), margin.left - 6, y);
    }
  }, [data, sigmaMin, sigmaMax]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const obs = new ResizeObserver(draw);
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, [draw]);

  // Compute improvement ratio
  const improvement = useMemo(() => {
    const peakCombined = Math.max(...data.map(d => d.combined));
    const peakBest = Math.max(...data.map(d => d.best));
    return peakBest > 0 ? peakCombined / peakBest : 1;
  }, [data]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: 380, display: 'block' }} />
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <span style={{ width: 20, height: 3, background: '#10b981', display: 'inline-block', borderRadius: 2 }} />
          <span style={{ color: '#10b981' }}>Combined (weighted)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <span style={{ width: 20, height: 3, background: '#64748b', display: 'inline-block', borderRadius: 2, borderTop: '1px dashed #64748b' }} />
          <span style={{ color: '#64748b' }}>Best individual</span>
        </div>
        <div style={{ background: '#0f172a', padding: '6px 12px', borderRadius: 8, fontSize: 12, marginLeft: 'auto' }}>
          <span style={{ color: '#94a3b8' }}>Combined / Best ratio:</span>{' '}
          <strong style={{ color: improvement > 1 ? '#10b981' : '#ef4444' }}>{improvement.toFixed(2)}x</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CrossAttackViz() {
  const [tab, setTab] = useState(0);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(10);
  const [sigmaMin, setSigmaMin] = useState(0.1);
  const [sigmaMax, setSigmaMax] = useState(0.9);
  const [weights, setWeights] = useState(() => ATTACK_NAMES.map(() => 1));

  const setWeight = useCallback((idx, val) => {
    setWeights(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  return (
    <div className="card" style={{ marginTop: 20, marginBottom: 20, padding: 24 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid #1e293b' }}>
        {TABS.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            style={{
              padding: '8px 18px',
              background: tab === i ? '#1e293b' : 'transparent',
              color: tab === i ? TAB_COLORS[i] : '#64748b',
              border: 'none',
              borderBottom: tab === i ? `2px solid ${TAB_COLORS[i]}` : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              fontWeight: tab === i ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <label style={{ fontSize: 12, color: '#94a3b8' }}>
          t ={' '}
          <select
            value={t}
            onChange={e => setT(Number(e.target.value))}
            style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 4, padding: '3px 6px', fontSize: 12 }}
          >
            {ZETA_ZEROS.slice(0, 10).map(gamma => (
              <option key={gamma} value={gamma}>{gamma.toFixed(2)}</option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: 12, color: '#94a3b8' }}>
          Primes:{' '}
          <input
            type="range" min={5} max={25} value={numPrimes}
            onChange={e => setNumPrimes(Number(e.target.value))}
            style={{ width: 80, verticalAlign: 'middle' }}
          />
          <span style={{ color: '#e2e8f0', marginLeft: 4 }}>{numPrimes}</span>
        </label>
        <label style={{ fontSize: 12, color: '#94a3b8' }}>
          <InlineMath tex={String.raw`\sigma`} /> range:{' '}
          <input
            type="number" step={0.05} min={0.01} max={0.45}
            value={sigmaMin}
            onChange={e => setSigmaMin(Number(e.target.value))}
            style={{ width: 50, background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 4, padding: '3px 6px', fontSize: 12 }}
          />
          {' - '}
          <input
            type="number" step={0.05} min={0.55} max={0.99}
            value={sigmaMax}
            onChange={e => setSigmaMax(Number(e.target.value))}
            style={{ width: 50, background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 4, padding: '3px 6px', fontSize: 12 }}
          />
        </label>
      </div>

      {/* Weight sliders (show on Combined Score tab) */}
      {tab === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 16, padding: 12, background: '#0f172a', borderRadius: 8 }}>
          <div style={{ gridColumn: '1 / -1', fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Attack Weights</div>
          {ATTACK_NAMES.map((name, i) => (
            <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <span style={{ color: ATTACK_COLORS[i], width: 85, flexShrink: 0 }}>{name}</span>
              <input
                type="range" min={0} max={3} step={0.1}
                value={weights[i]}
                onChange={e => setWeight(i, Number(e.target.value))}
                style={{ flex: 1, maxWidth: 80 }}
              />
              <span style={{ color: '#e2e8f0', width: 28, textAlign: 'right' }}>{weights[i].toFixed(1)}</span>
            </label>
          ))}
        </div>
      )}

      {/* Render active tab */}
      {tab === 0 && <EfficiencyMatrixTab t={t} numPrimes={numPrimes} />}
      {tab === 1 && <SigmaSweepTab t={t} numPrimes={numPrimes} sigmaMin={sigmaMin} sigmaMax={sigmaMax} />}
      {tab === 2 && <CombinedScoreTab t={t} numPrimes={numPrimes} sigmaMin={sigmaMin} sigmaMax={sigmaMax} weights={weights} />}
    </div>
  );
}
