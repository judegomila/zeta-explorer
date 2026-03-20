import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import { systemHamiltonian, hamiltonianSigmaScan, losslessBridge, directLadder, dualLadder } from '../math/oscillators.js';
import { cAbs, cSub, zetaCriticalStrip, ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

/**
 * RHRigorViz — Numerical stress tests of ZPO model claims.
 *
 * Three diagnostic panels:
 * 1. Hamiltonian minimization: does H actually minimize at σ=0.5 for all t?
 * 2. Bridge unitarity: how does |χ(s)| deviate from 1 off the critical line?
 * 3. Impedance mismatch vs actual zeros: does mismatch predict zero locations?
 */
export default function RHRigorViz() {
  const [activeTest, setActiveTest] = useState('hamiltonian');
  const canvasRef = useRef();
  const [numPrimes, setNumPrimes] = useState(15);
  const [tRange, setTRange] = useState([10, 50]);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // ─── Test 1: Hamiltonian minimization scan ───
  const hamiltonianTestData = useMemo(() => {
    if (activeTest !== 'hamiltonian') return null;
    const results = [];
    const tStep = (tRange[1] - tRange[0]) / 40;
    for (let t = tRange[0]; t <= tRange[1]; t += tStep) {
      const scan = hamiltonianSigmaScan(t, [0.1, 0.9], 30, numPrimes);
      let minSigma = 0.5, minH = Infinity;
      scan.forEach(pt => {
        if (pt.total < minH) { minH = pt.total; minSigma = pt.sigma; }
      });
      // Check if ζ has a zero near this t
      let nearestZero = null, nearestDist = Infinity;
      for (const g of ZETA_ZEROS) {
        const d = Math.abs(g - t);
        if (d < nearestDist) { nearestDist = d; nearestZero = g; }
        if (g > t + 5) break;
      }
      results.push({
        t,
        minSigma,
        minH,
        deviationFromHalf: Math.abs(minSigma - 0.5),
        nearZero: nearestDist < 0.5,
        nearestZeroDist: nearestDist,
        profile: scan,
      });
    }
    return results;
  }, [activeTest, numPrimes, tRange]);

  // ─── Test 2: Bridge unitarity scan ───
  const bridgeTestData = useMemo(() => {
    if (activeTest !== 'bridge') return null;
    const results = [];
    const sigmaSteps = 40;
    const tSteps = 40;
    for (let si = 0; si <= sigmaSteps; si++) {
      const sigma = 0.05 + (si / sigmaSteps) * 0.9;
      for (let ti = 0; ti <= tSteps; ti++) {
        const t = tRange[0] + (ti / tSteps) * (tRange[1] - tRange[0]);
        const bridge = losslessBridge([sigma, t]);
        results.push({
          sigma, t,
          chiMag: bridge.magnitude,
          deviation: Math.abs(bridge.magnitude - 1),
          isUnitary: bridge.isUnitary,
        });
      }
    }
    return results;
  }, [activeTest, tRange]);

  // ─── Test 3: Mismatch vs zero correlation ───
  const mismatchTestData = useMemo(() => {
    if (activeTest !== 'mismatch') return null;
    const results = [];
    const tStep = (tRange[1] - tRange[0]) / 60;
    for (let t = tRange[0]; t <= tRange[1]; t += tStep) {
      // Compute at σ = 0.5 (critical line)
      const s = [0.5, t];
      const dir = directLadder(s, numPrimes);
      const dual = dualLadder(s, numPrimes);
      const mismatch = cAbs(cSub(dir.totalImpedance, dual.totalImpedance));
      const zetaMag = cAbs(zetaCriticalStrip(s));

      // Also check at σ = 0.6 (off-line)
      const sOff = [0.6, t];
      const dirOff = directLadder(sOff, numPrimes);
      const dualOff = dualLadder(sOff, numPrimes);
      const mismatchOff = cAbs(cSub(dirOff.totalImpedance, dualOff.totalImpedance));
      const zetaMagOff = cAbs(zetaCriticalStrip(sOff));

      let nearestZero = null, nearestDist = Infinity;
      for (const g of ZETA_ZEROS) {
        const d = Math.abs(g - t);
        if (d < nearestDist) { nearestDist = d; nearestZero = g; }
        if (g > t + 5) break;
      }

      results.push({
        t, mismatch, zetaMag, mismatchOff, zetaMagOff,
        nearZero: nearestDist < 0.3,
        nearestZeroDist: nearestDist,
      });
    }
    return results;
  }, [activeTest, numPrimes, tRange]);

  // ─── Derived statistics for Hamiltonian test (avoid recomputing on resize) ───
  const hamiltonianStats = useMemo(() => {
    if (!hamiltonianTestData) return null;
    const data = hamiltonianTestData;
    const maxDev = Math.max(...data.map(d => d.deviationFromHalf));
    const avgDev = data.reduce((s, d) => s + d.deviationFromHalf, 0) / data.length;
    return { maxDev, avgDev };
  }, [hamiltonianTestData]);

  // ─── Derived statistics for mismatch test (avoid recomputing on resize) ───
  const mismatchStats = useMemo(() => {
    if (!mismatchTestData) return null;
    const data = mismatchTestData;
    const n = data.length;
    const maxMismatch = Math.max(...data.map(d => d.mismatch), 0.001);
    const maxZeta = Math.max(...data.map(d => d.zetaMag), 0.001);
    const maxMismatchOff = Math.max(...data.map(d => d.mismatchOff), 0.001);
    const maxMismatchBoth = Math.max(maxMismatch, maxMismatchOff);
    let correlation = 0;
    if (n > 2) {
      const meanM = data.reduce((s, d) => s + d.mismatch, 0) / n;
      const meanZ = data.reduce((s, d) => s + d.zetaMag, 0) / n;
      let num = 0, denM = 0, denZ = 0;
      data.forEach(d => {
        const dm = d.mismatch - meanM;
        const dz = d.zetaMag - meanZ;
        num += dm * dz;
        denM += dm * dm;
        denZ += dz * dz;
      });
      correlation = denM > 0 && denZ > 0 ? num / Math.sqrt(denM * denZ) : 0;
    }
    return { maxMismatchBoth, maxZeta, correlation };
  }, [mismatchTestData]);

  // ─── Drawing ───
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width * dpr;
    const H = 400 * dpr;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = 400;

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, w, h);

    const margin = { top: 40, right: 60, bottom: 50, left: 65 };
    const pw = w - margin.left - margin.right;
    const ph = h - margin.top - margin.bottom;

    ctx.save();
    ctx.translate(margin.left, margin.top);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * ph;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * pw;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ph); ctx.stroke();
    }

    if (activeTest === 'hamiltonian' && hamiltonianTestData && hamiltonianStats) {
      drawHamiltonianTest(ctx, hamiltonianTestData, pw, ph, hamiltonianStats);
    } else if (activeTest === 'bridge' && bridgeTestData) {
      drawBridgeTest(ctx, bridgeTestData, pw, ph, w, h, margin);
    } else if (activeTest === 'mismatch' && mismatchTestData && mismatchStats) {
      drawMismatchTest(ctx, mismatchTestData, pw, ph, mismatchStats);
    }

    ctx.restore();

    // Axes labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    if (activeTest === 'hamiltonian') {
      ctx.fillText(`t (imaginary part), range [${tRange[0]}, ${tRange[1]}]`, w / 2, h - 8);
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('σ at H minimum', 0, 0);
      ctx.restore();
    } else if (activeTest === 'bridge') {
      ctx.fillText('σ (real part)', w / 2, h - 8);
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('t (imaginary part)', 0, 0);
      ctx.restore();
    } else if (activeTest === 'mismatch') {
      ctx.fillText(`t (imaginary part), range [${tRange[0]}, ${tRange[1]}]`, w / 2, h - 8);
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Normalized magnitude', 0, 0);
      ctx.restore();
    }
  }, [activeTest, hamiltonianTestData, hamiltonianStats, bridgeTestData, mismatchTestData, mismatchStats, tRange]);

  function drawHamiltonianTest(ctx, data, pw, ph, stats) {
    // Plot: for each t, where does H minimize? Should be σ=0.5 if model is correct
    const xScale = (t) => ((t - tRange[0]) / (tRange[1] - tRange[0])) * pw;
    const yScale = (sigma) => ph - ((sigma - 0.1) / 0.8) * ph;

    // Reference line at σ = 0.5
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, yScale(0.5));
    ctx.lineTo(pw, yScale(0.5));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('σ = 0.5 (RH prediction)', pw - 4, yScale(0.5) - 8);

    // Mark zeta zeros as vertical bands
    for (const g of ZETA_ZEROS) {
      if (g < tRange[0] || g > tRange[1]) continue;
      const x = xScale(g);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(x - 3, 0, 6, ph);
    }

    // Plot deviation points
    data.forEach(pt => {
      const x = xScale(pt.t);
      const y = yScale(pt.minSigma);
      const dev = pt.deviationFromHalf;

      // Color by deviation
      const r = Math.min(255, Math.floor(dev * 1000));
      const g = Math.max(0, 255 - Math.floor(dev * 1000));
      ctx.fillStyle = `rgb(${r}, ${g}, 100)`;
      ctx.beginPath();
      ctx.arc(x, y, pt.nearZero ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Outline near-zero points
      if (pt.nearZero) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Connect with line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = xScale(pt.t);
      const y = yScale(pt.minSigma);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Axis ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let t = Math.ceil(tRange[0]); t <= tRange[1]; t += Math.ceil((tRange[1] - tRange[0]) / 8)) {
      ctx.fillText(t.toString(), xScale(t), ph + 16);
    }
    ctx.textAlign = 'right';
    for (let s = 0.1; s <= 0.9; s += 0.2) {
      ctx.fillText(s.toFixed(1), -6, yScale(s) + 4);
    }

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Test: Does H(σ,t) minimize at σ = 0.5 for all t?', 4, -14);

    // Verdict (stats pre-computed via useMemo)
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = stats.maxDev < 0.05 ? '#10b981' : stats.maxDev < 0.15 ? '#f59e0b' : '#ef4444';
    ctx.textAlign = 'right';
    ctx.fillText(`Max deviation: ${stats.maxDev.toFixed(4)} | Avg: ${stats.avgDev.toFixed(4)}`, pw, -14);

    // Legend
    const lx = pw - 170, ly = ph - 90;
    ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(lx, ly, 170, 88, 4);
    ctx.fill();
    ctx.stroke();

    const items = [
      { type: 'dash', color: '#10b981', label: 'σ = ½ (RH prediction)' },
      { type: 'line', color: '#3b82f6', label: 'σ* trajectory' },
      { type: 'dot',  color: 'rgb(0, 255, 100)', label: 'Low deviation' },
      { type: 'dot',  color: 'rgb(255, 0, 100)', label: 'High deviation' },
      { type: 'band', color: 'rgba(16, 185, 129, 0.08)', label: 'ζ zero location' },
    ];
    items.forEach((item, i) => {
      const iy = ly + 12 + i * 15;
      if (item.type === 'dash') {
        ctx.strokeStyle = item.color; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(lx + 6, iy); ctx.lineTo(lx + 22, iy); ctx.stroke();
        ctx.setLineDash([]);
      } else if (item.type === 'line') {
        ctx.strokeStyle = item.color; ctx.lineWidth = 1.5; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(lx + 6, iy); ctx.lineTo(lx + 22, iy); ctx.stroke();
      } else if (item.type === 'dot') {
        ctx.fillStyle = item.color;
        ctx.beginPath(); ctx.arc(lx + 14, iy, 4, 0, Math.PI * 2); ctx.fill();
      } else if (item.type === 'band') {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fillRect(lx + 6, iy - 6, 16, 12);
      }
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 28, iy + 4);
    });
  }

  function drawBridgeTest(ctx, data, pw, ph, w, h, margin) {
    // Heatmap: |χ(σ+it)| across the (σ, t) plane
    const sigmaSteps = 40;
    const tSteps = 40;
    const cellW = pw / (sigmaSteps + 1);
    const cellH = ph / (tSteps + 1);

    let maxDev = 0;
    data.forEach(d => { if (d.deviation > maxDev) maxDev = d.deviation; });

    data.forEach((d, idx) => {
      const si = idx % (tSteps + 1);
      const sj = Math.floor(idx / (tSteps + 1));
      const x = sj * cellW;
      const y = ph - si * cellH - cellH;

      // Color: green = unitary (|χ|≈1), red = deviant
      const norm = Math.min(1, d.deviation / Math.max(maxDev, 0.01));
      const r = Math.floor(50 + norm * 200);
      const g = Math.floor(200 - norm * 180);
      const b = Math.floor(100 - norm * 60);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, cellW + 1, cellH + 1);
    });

    // Critical line marker at σ = 0.5
    const critX = ((0.5 - 0.05) / 0.9) * pw;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(critX, 0);
    ctx.lineTo(critX, ph);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('σ = ½', critX, -6);

    // Axis ticks
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let s = 0.1; s <= 0.9; s += 0.2) {
      const x = ((s - 0.05) / 0.9) * pw;
      ctx.fillText(s.toFixed(1), x, ph + 16);
    }
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const t = tRange[0] + (i / 4) * (tRange[1] - tRange[0]);
      const y = ph - (i / 4) * ph;
      ctx.fillText(t.toFixed(0), -6, y + 4);
    }

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Test: |χ(s)| deviation from 1 (green = unitary)', 4, -14);

    // Color bar
    const barX = pw + 10;
    const barW = 14;
    for (let i = 0; i <= ph; i++) {
      const norm = i / ph;
      const r = Math.floor(50 + norm * 200);
      const g = Math.floor(200 - norm * 180);
      const b = Math.floor(100 - norm * 60);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(barX, i, barW, 1);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('|χ|=1', barX + barW + 4, 10);
    ctx.fillText(`dev=${maxDev.toFixed(1)}`, barX + barW + 4, ph);
  }

  function drawMismatchTest(ctx, data, pw, ph, stats) {
    // Plot |Z_dir - Z_dual| and |ζ(s)| together to test correlation
    const xScale = (t) => ((t - tRange[0]) / (tRange[1] - tRange[0])) * pw;

    const { maxMismatchBoth, maxZeta, correlation } = stats;

    const yMismatch = (v) => ph - (v / maxMismatchBoth) * ph * 0.9;
    const yZeta = (v) => ph - (v / maxZeta) * ph * 0.9;

    // Mark zeta zeros
    for (const g of ZETA_ZEROS) {
      if (g < tRange[0] || g > tRange[1]) continue;
      const x = xScale(g);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(x - 2, 0, 4, ph);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ph);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // |ζ(½+it)| line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = xScale(pt.t);
      const y = yZeta(pt.zetaMag);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Impedance mismatch at σ = 0.5
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = xScale(pt.t);
      const y = yMismatch(pt.mismatch);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Impedance mismatch at σ = 0.6 (off-line)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    const yMismatchOff = (v) => ph - (v / maxMismatchBoth) * ph * 0.9;
    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = xScale(pt.t);
      const y = yMismatchOff(pt.mismatchOff);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend with background box
    const legendItems = [
      { color: '#3b82f6', label: '|ζ(½+it)| (true zeta)', dash: false },
      { color: '#f59e0b', label: '|Z_dir - Z_dual| at σ=0.5', dash: true },
      { color: '#ef4444', label: '|Z_dir - Z_dual| at σ=0.6', dash: true },
      { color: '#10b981', label: 'Known zeros', dash: [2, 3] },
    ];
    const lx = pw - 230, legendY = 4;
    const legendW = 230, legendH = legendItems.length * 16 + 10;
    ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(lx, legendY, legendW, legendH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '11px Inter, sans-serif';
    legendItems.forEach((item, i) => {
      const ix = lx + 8;
      const ly = legendY + 12 + i * 16;
      ctx.strokeStyle = item.color;
      ctx.fillStyle = item.color;
      ctx.lineWidth = 2;
      if (Array.isArray(item.dash)) ctx.setLineDash(item.dash);
      else if (item.dash) ctx.setLineDash([4, 2]);
      else ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(ix, ly); ctx.lineTo(ix + 20, ly); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, ix + 24, ly + 4);
    });

    // Axis ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let t = Math.ceil(tRange[0]); t <= tRange[1]; t += Math.ceil((tRange[1] - tRange[0]) / 8)) {
      ctx.fillText(t.toString(), xScale(t), ph + 16);
    }
    // Y-axis ticks (normalized 0–1 scale)
    ctx.textAlign = 'right';
    for (let frac = 0; frac <= 1.0; frac += 0.25) {
      const y = ph - frac * ph * 0.9;
      ctx.fillText(frac.toFixed(2), -6, y + 4);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(4, y); ctx.stroke();
    }

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Test: Does impedance mismatch correlate with |ζ| zeros?', 4, -14);

    // Correlation display (computed in memoized mismatchStats)
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = Math.abs(correlation) > 0.5 ? '#10b981' : '#f59e0b';
    ctx.textAlign = 'right';
    ctx.fillText(`Pearson r = ${correlation.toFixed(3)}`, pw, -14);
  }

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      {/* Test selector tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'hamiltonian', label: 'H Minimization' },
          { key: 'bridge', label: 'Bridge |χ|' },
          { key: 'mismatch', label: 'Mismatch vs Zeros' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTest(tab.key)}
            className={`filter-btn ${activeTest === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab explainers */}
      {activeTest === 'hamiltonian' && (
        <div className="tab-explainer accent-orange">
          <strong>The test:</strong> For each <InlineMath tex="t" /> value, scan <InlineMath tex={"\\sigma \\in [0.1, 0.9]"} /> to find
          where <InlineMath tex={"H(\\sigma, t)"} /> is minimized. The ZPO model claims the minimum always occurs
          at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> (the critical line). Each dot shows the minimizing <InlineMath tex={"\\sigma"} /> for
          one <InlineMath tex="t" /> value; the green dashed line marks <InlineMath tex={"\\sigma = 0.5"} />.
          <strong> Look for:</strong> how tightly dots cluster around the green line as you increase the number of primes.
        </div>
      )}
      {activeTest === 'bridge' && (
        <div className="tab-explainer accent-purple">
          <strong>The test:</strong> Heatmap of <InlineMath tex={"|\\,|\\chi(\\sigma+it)| - 1\\,|"} /> across
          the <InlineMath tex={"(\\sigma, t)"} /> plane. The functional equation guarantees <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} />,
          so a green band should appear at <InlineMath tex={"\\sigma = 0.5"} />. This is a known identity, not a prediction — it
          tests that the bridge construction correctly reproduces the functional equation prefactor.
          <strong> Look for:</strong> the sharp green vertical stripe at <InlineMath tex={"\\sigma = 0.5"} /> and how deviation grows away from it.
        </div>
      )}
      {activeTest === 'mismatch' && (
        <div className="tab-explainer accent-cyan">
          <strong>The test:</strong> Compare impedance mismatch <InlineMath tex={"|Z_{\\rm dir} - Z_{\\rm dual}|"} /> (from
          truncated Euler products) against <InlineMath tex={"|\\zeta(\\tfrac{1}{2}+it)|"} /> along the critical line.
          If mismatch predicted zeros, both curves would dip to zero at the same <InlineMath tex="t" /> values.
          The Pearson <InlineMath tex="r" /> quantifies correlation.
          <strong> Look for:</strong> whether mismatch dips align with <InlineMath tex={"\\zeta"} /> zeros, and how <InlineMath tex="r" /> changes with the number of primes.
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="control-group" style={{ opacity: activeTest === 'bridge' ? 0.4 : 1 }}>
          <label>Primes</label>
          <input type="range" min="5" max="40" step="1" value={numPrimes}
            disabled={activeTest === 'bridge'}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>
            {activeTest === 'bridge' ? '(not used by bridge test)' : `(up to p=${getPrimes(numPrimes)[numPrimes - 1]})`}
          </span></span>
        </div>
        <div className="control-group">
          <label><InlineMath tex={"t_{\\min}"} /></label>
          <input type="range" min="1" max="40" step="1" value={tRange[0]}
            onChange={e => setTRange([+e.target.value, Math.max(+e.target.value + 10, tRange[1])])} />
          <span className="control-value">{tRange[0]}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex={"t_{\\max}"} /></label>
          <input type="range" min="20" max="80" step="1" value={tRange[1]}
            onChange={e => setTRange([tRange[0], Math.max(tRange[0] + 10, +e.target.value)])} />
          <span className="control-value">{tRange[1]}</span>
        </div>
        <div className="control-group">
          <span style={{ color: '#64748b', fontSize: 11 }}>
            ({ZETA_ZEROS.filter(g => g >= tRange[0] && g <= tRange[1]).length} zeros in range)
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 400 }} />
      </div>

      {/* Test-specific interpretation */}
      <div className="card" style={{ marginTop: 16 }}>
        {activeTest === 'hamiltonian' && (
          <>
            <h4 style={{ color: '#f59e0b', margin: '0 0 8px' }}>Interpretation: Hamiltonian Minimization Test</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
              For each value of <InlineMath tex="t" />, we scan <InlineMath tex={"\\sigma \\in [0.1, 0.9]"} /> and find
              where <InlineMath tex={"H(\\sigma, t)"} /> is minimized. <strong style={{ color: '#e2e8f0' }}>If the ZPO model's claim
              is correct</strong>, all points should lie exactly on the green dashed
              line at <InlineMath tex={"\\sigma = 0.5"} />.
            </p>
            <p style={{ color: '#ef4444', fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>
              <strong>Criticism (crit-001):</strong> The Hamiltonian is <em>constructed</em> to be symmetric
              about <InlineMath tex={"\\sigma = 0.5"} /> — the bridge term <InlineMath tex={"100(1-|\\chi|)^2"} /> dominates
              and is minimized there by design. This is a tautology, not a prediction. The deviations visible
              with few primes are due to the kinetic energy term breaking exact symmetry.
            </p>
          </>
        )}
        {activeTest === 'bridge' && (
          <>
            <h4 style={{ color: '#8b5cf6', margin: '0 0 8px' }}>Interpretation: Bridge Unitarity Heatmap</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
              The heatmap shows <InlineMath tex={"||\\chi(\\sigma+it)| - 1|"} /> across the <InlineMath tex={"(\\sigma, t)"} /> plane.
              The green vertical band at <InlineMath tex={"\\sigma = 0.5"} /> confirms that <InlineMath tex={"|\\chi| = 1"} /> on the
              critical line.
            </p>
            <p style={{ color: '#ef4444', fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>
              <strong>Criticism (crit-003):</strong> This is just the functional equation —
              a proven identity, not new information. The fact that <InlineMath tex={"|\\chi(1/2+it)| = 1"} /> was known
              to Riemann in 1859. It tells us about the symmetry of <InlineMath tex={"\\zeta"} />, not about where
              its zeros are.
            </p>
          </>
        )}
        {activeTest === 'mismatch' && (
          <>
            <h4 style={{ color: '#06b6d4', margin: '0 0 8px' }}>Interpretation: Mismatch vs Zero Correlation</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
              We plot <InlineMath tex={"|\\zeta(1/2+it)|"} /> (blue) against the impedance
              mismatch <InlineMath tex={"|Z_{\\rm dir} - Z_{\\rm dual}|"} /> (orange/red). If the mismatch predicted
              zeros, the orange curve would dip to zero at the same places as the blue curve.
            </p>
            <p style={{ color: '#ef4444', fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>
              <strong>Criticism (crit-005):</strong> The mismatch is computed from a <em>divergent</em> Euler
              product truncation (crit-002). Its behavior with {numPrimes} primes does not reliably
              predict the true <InlineMath tex={"\\zeta"} /> zeros. The Pearson correlation shown is between
              two unrelated quantities — mismatch measures matching, zeros measure cancellation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
