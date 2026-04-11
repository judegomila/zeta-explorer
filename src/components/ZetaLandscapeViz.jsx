import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import { riemannSiegelZ, ZETA_ZEROS, zetaCriticalStrip, cAbs } from '../math/zeta.js';

// Binary search for nearest value in sorted ZETA_ZEROS array — O(log n) instead of O(n)
function nearestZetaZero(target) {
  let lo = 0, hi = ZETA_ZEROS.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (ZETA_ZEROS[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  // Check lo and lo-1 to find the closest
  let best = lo;
  if (lo > 0 && Math.abs(ZETA_ZEROS[lo - 1] - target) < Math.abs(ZETA_ZEROS[lo] - target)) {
    best = lo - 1;
  }
  return { zero: ZETA_ZEROS[best], dist: Math.abs(ZETA_ZEROS[best] - target) };
}

// Count zeros in [a, b] using binary search on sorted ZETA_ZEROS — O(log n) instead of O(n) filter
function countZerosInRange(a, b) {
  let lo = 0, hi = ZETA_ZEROS.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (ZETA_ZEROS[m] < a) lo = m + 1; else hi = m; }
  const start = lo;
  lo = 0; hi = ZETA_ZEROS.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (ZETA_ZEROS[m] <= b) lo = m + 1; else hi = m; }
  return lo - start;
}

// Pre-compute critical-line stroke color palettes (32 levels each) to avoid per-segment string interpolation
const CL_PALETTE_SIZE = 32;
const clPalettePos = new Array(CL_PALETTE_SIZE);
const clPaletteNeg = new Array(CL_PALETTE_SIZE);
for (let i = 0; i < CL_PALETTE_SIZE; i++) {
  const alpha = (0.4 + (i / (CL_PALETTE_SIZE - 1)) * 0.6).toFixed(2);
  clPalettePos[i] = `rgba(59,130,246,${alpha})`;
  clPaletteNeg[i] = `rgba(245,158,11,${alpha})`;
}

// Pre-compute 256-entry RGB colormap as flat Uint8 array for ImageData-based rendering
const PALETTE_SIZE = 256;
const heatmapPaletteRGB = new Uint8Array(PALETTE_SIZE * 3);
const heatmapPalette = new Array(PALETTE_SIZE); // string version for colorbar
for (let i = 0; i < PALETTE_SIZE; i++) {
  const normalized = i / (PALETTE_SIZE - 1);
  let r, g, b;
  if (normalized < 0.25) {
    const t2 = normalized / 0.25;
    r = 10; g = 10 + t2 * 80; b = 60 + t2 * 140;
  } else if (normalized < 0.5) {
    const t2 = (normalized - 0.25) / 0.25;
    r = 10 + t2 * 50; g = 90 + t2 * 120; b = 200 - t2 * 40;
  } else if (normalized < 0.75) {
    const t2 = (normalized - 0.5) / 0.25;
    r = 60 + t2 * 190; g = 210 - t2 * 60; b = 160 - t2 * 130;
  } else {
    const t2 = (normalized - 0.75) / 0.25;
    r = 250; g = 150 - t2 * 100; b = 30 - t2 * 20;
  }
  heatmapPaletteRGB[i * 3] = r | 0;
  heatmapPaletteRGB[i * 3 + 1] = g | 0;
  heatmapPaletteRGB[i * 3 + 2] = b | 0;
  heatmapPalette[i] = `rgb(${r|0},${g|0},${b|0})`;
}

export default function ZetaLandscapeViz() {
  const canvasRef = useRef();
  const clValuesRef = useRef([]); // cached Z(t) values for critical-line hover
  const [mode, setMode] = useState('critical-line');
  const [tRange, setTRange] = useState([0, 50]);
  const [sigmaRange] = useState([0.05, 0.95]);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Memoize Z(t) values so resize events skip 600 riemannSiegelZ evaluations
  const CL_STEPS = 600;
  const clData = useMemo(() => {
    const tMin = tRange[0];
    const tMax = tRange[1];
    const dt = (tMax - tMin) / CL_STEPS;
    const values = [];
    let maxAbs = 1;
    for (let i = 0; i <= CL_STEPS; i++) {
      const t = tMin + i * dt;
      const z = t > 2 ? riemannSiegelZ(t) : 0;
      values.push({ t, z });
      const a = Math.abs(z);
      if (a > maxAbs) maxAbs = a;
    }
    return { values, maxAbs };
  }, [tRange]);

  const drawCriticalLine = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width = canvas.clientWidth * dpr;
    const h = canvas.height = 400 * dpr;
    ctx.scale(dpr, dpr);
    const dw = canvas.clientWidth;
    const dh = 400;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, dw, dh);

    const tMin = tRange[0];
    const tMax = tRange[1];
    const { values, maxAbs } = clData;
    const steps = values.length - 1;
    clValuesRef.current = values;
    const xScale = dw / steps;
    const yMid = dh / 2;
    const yScale = (dh / 2 - 20) / maxAbs;

    // Grid
    ctx.strokeStyle = '#1a1f36';
    ctx.lineWidth = 0.5;
    for (let t = Math.ceil(tMin); t <= tMax; t += 5) {
      const x = ((t - tMin) / (tMax - tMin)) * dw;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, dh); ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(`t=${t}`, x + 2, dh - 4);
    }

    // Zero line
    ctx.strokeStyle = '#2a3050';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, yMid); ctx.lineTo(dw, yMid); ctx.stroke();

    // Z(t) curve with gradient coloring
    for (let i = 1; i <= steps; i++) {
      const x0 = (i - 1) * xScale;
      const x1 = i * xScale;
      const y0 = yMid - values[i - 1].z * yScale;
      const y1 = yMid - values[i].z * yScale;

      // Color: blue when positive, orange when negative (palette lookup avoids string alloc)
      const val = values[i].z;
      const intensity = Math.min(1, Math.abs(val) / maxAbs);
      const palIdx = Math.min(CL_PALETTE_SIZE - 1, (intensity * (CL_PALETTE_SIZE - 1)) | 0);
      ctx.strokeStyle = val >= 0 ? clPalettePos[palIdx] : clPaletteNeg[palIdx];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Fill area
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = val >= 0 ? '#3b82f6' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(x0, yMid);
      ctx.lineTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1, yMid);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Y-axis tick marks and labels
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#1e293b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    // Choose a nice tick step based on maxAbs
    const rawStep = maxAbs / 3;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const niceFracs = [1, 2, 5, 10];
    const yTickStep = niceFracs.find(f => f * mag >= rawStep) * mag;
    for (let v = -Math.floor(maxAbs / yTickStep) * yTickStep; v <= maxAbs; v += yTickStep) {
      if (Math.abs(v) < yTickStep * 0.01) continue; // skip zero line (already drawn)
      const y = yMid - v * yScale;
      if (y < 10 || y > dh - 10) continue;
      // Dashed gridline
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(dw, y); ctx.stroke();
      ctx.setLineDash([]);
      // Tick label
      ctx.fillStyle = '#64748b';
      const label = Number.isInteger(v) ? String(v) : v.toFixed(1);
      ctx.fillText(label, 28, y + 3);
    }
    ctx.textAlign = 'start';

    // Y-axis label
    ctx.save();
    ctx.translate(8, yMid);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Z(t)', 0, 0);
    ctx.restore();

    // Mark zeta zeros with index labels
    // Decide label density: show labels when zeros are spaced ≥ 20px apart on average
    const visibleZeros = [];
    for (let zi = 0; zi < ZETA_ZEROS.length; zi++) {
      const gamma = ZETA_ZEROS[zi];
      if (gamma >= tMin && gamma <= tMax) {
        visibleZeros.push({ gamma, index: zi + 1 });
      }
    }
    const avgPixelSpacing = visibleZeros.length > 1
      ? dw / visibleZeros.length : Infinity;
    const showLabels = avgPixelSpacing >= 20;

    for (const { gamma, index } of visibleZeros) {
      const x = ((gamma - tMin) / (tMax - tMin)) * dw;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, yMid - 8); ctx.lineTo(x, yMid + 8); ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, yMid, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Label with γₙ index (alternating above/below to avoid overlap)
      if (showLabels) {
        const subscript = String(index).split('').map(c => String.fromCharCode(0x2080 + +c)).join('');
        ctx.fillStyle = '#ef4444';
        ctx.font = '9px var(--font-mono, monospace)';
        ctx.textAlign = 'center';
        const labelY = index % 2 === 1 ? yMid - 14 : yMid + 20;
        ctx.fillText(`γ${subscript}`, x, labelY);
        ctx.textAlign = 'start';
      }
    }

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('Riemann-Siegel Z(t) on the Critical Line σ = ½', 12, 18);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('Red dots mark nontrivial zeta zeros (Z(t) = 0)', 12, 34);

    // Legend
    const legendX = dw - 170;
    const legendY = 10;
    ctx.fillStyle = 'rgba(17,24,39,0.85)';
    ctx.fillRect(legendX, legendY, 160, 60);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(legendX, legendY, 160, 60);
    ctx.font = '10px sans-serif';
    // Z(t) > 0
    ctx.strokeStyle = 'rgba(59,130,246,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(legendX + 8, legendY + 14); ctx.lineTo(legendX + 28, legendY + 14); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Z(t) > 0', legendX + 34, legendY + 18);
    // Z(t) < 0
    ctx.strokeStyle = 'rgba(245,158,11,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(legendX + 8, legendY + 32); ctx.lineTo(legendX + 28, legendY + 32); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Z(t) < 0', legendX + 34, legendY + 36);
    // Zeta zeros
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(legendX + 18, legendY + 50, 3, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ζ zeros (γₙ)', legendX + 34, legendY + 54);

  }, [tRange, clData]);

  // Memoize the 100×100 heatmap grid (10,000 zetaCriticalStrip evaluations)
  // so resize events only repaint the canvas with cached data
  const RES = 100;
  const heatmapGrid = useMemo(() => {
    const tMin = tRange[0];
    const tMax = tRange[1];
    const sMin = sigmaRange[0];
    const sMax = sigmaRange[1];
    const grid = new Float64Array(RES * RES);
    for (let i = 0; i < RES; i++) {
      for (let j = 0; j < RES; j++) {
        const sigma = sMin + (i / (RES - 1)) * (sMax - sMin);
        const t = tMin + (j / (RES - 1)) * (tMax - tMin);
        const z = zetaCriticalStrip([sigma, t], 50);
        const mag = cAbs(z);
        const logMag = Math.log(1 + mag);
        grid[i * RES + j] = logMag / 4;
      }
    }
    return grid;
  }, [tRange, sigmaRange]);

  const drawHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width = canvas.clientWidth * dpr;
    const h = canvas.height = 400 * dpr;
    ctx.scale(dpr, dpr);
    const dw = canvas.clientWidth;
    const dh = 400;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, dw, dh);

    const tMin = tRange[0];
    const tMax = tRange[1];
    const sMin = sigmaRange[0];
    const sMax = sigmaRange[1];
    // Render heatmap via ImageData (single putImageData replaces 10,000 fillRect calls)
    const imgW = w;  // use full backing-pixel width for crisp rendering
    const imgH = h;
    const imgData = ctx.createImageData(imgW, imgH);
    const pixels = imgData.data;
    for (let py = 0; py < imgH; py++) {
      // Map pixel row to grid j (t-axis, bottom = low j, top = high j)
      const j = Math.min(RES - 1, ((imgH - 1 - py) / (imgH - 1) * (RES - 1)) | 0);
      for (let px = 0; px < imgW; px++) {
        // Map pixel col to grid i (sigma-axis)
        const i = Math.min(RES - 1, (px / (imgW - 1) * (RES - 1)) | 0);
        const normalized = Math.min(1, heatmapGrid[i * RES + j]);
        const palIdx = Math.min(PALETTE_SIZE - 1, (normalized * (PALETTE_SIZE - 1)) | 0);
        const off = (py * imgW + px) * 4;
        pixels[off] = heatmapPaletteRGB[palIdx * 3];
        pixels[off + 1] = heatmapPaletteRGB[palIdx * 3 + 1];
        pixels[off + 2] = heatmapPaletteRGB[palIdx * 3 + 2];
        pixels[off + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Critical line overlay
    const critX = ((0.5 - sMin) / (sMax - sMin)) * dw;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(critX, 0); ctx.lineTo(critX, dh); ctx.stroke();
    ctx.setLineDash([]);

    // Critical line label
    ctx.save();
    ctx.translate(critX + 10, 48);
    ctx.fillStyle = 'rgba(17,24,39,0.7)';
    ctx.fillRect(-2, -10, 36, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '600 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('σ = ½', 0, 0);
    ctx.restore();

    // Mark zeros
    for (const gamma of ZETA_ZEROS) {
      if (gamma >= tMin && gamma <= tMax) {
        const y = dh - ((gamma - tMin) / (tMax - tMin)) * dh;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(critX, y, 4, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // Colorbar
    const cbW = 14, cbH = dh - 80, cbX = dw - 36, cbY = 50;
    // Background
    ctx.fillStyle = 'rgba(17,24,39,0.75)';
    ctx.fillRect(cbX - 6, cbY - 18, cbW + 44, cbH + 34);
    // Gradient strip
    for (let row = 0; row < cbH; row++) {
      const normalized = 1 - row / cbH;
      const palIdx = Math.min(PALETTE_SIZE - 1, (normalized * (PALETTE_SIZE - 1)) | 0);
      ctx.fillStyle = heatmapPalette[palIdx];
      ctx.fillRect(cbX, cbY + row, cbW, 1);
    }
    // Border
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(cbX, cbY, cbW, cbH);
    // Tick labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    for (let v = 0; v <= 4; v++) {
      const yPos = cbY + cbH - (v / 4) * cbH;
      ctx.fillRect(cbX + cbW, yPos - 0.25, 3, 0.5);
      ctx.fillText(String(v), cbX + cbW + 5, yPos + 3);
    }
    // Title
    ctx.save();
    ctx.translate(cbX + cbW + 28, cbY + cbH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('log(1+|ζ|)', 0, 0);
    ctx.restore();
    ctx.textAlign = 'start';

    // Axis tick marks and labels along edges
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.5;
    ctx.font = '9px sans-serif';

    // Bottom edge: σ ticks
    ctx.textAlign = 'center';
    for (let sv = 0.1; sv <= 0.9; sv += 0.1) {
      if (sv >= sMin && sv <= sMax) {
        const xPos = ((sv - sMin) / (sMax - sMin)) * dw;
        ctx.beginPath(); ctx.moveTo(xPos, dh - 4); ctx.lineTo(xPos, dh); ctx.stroke();
        ctx.fillText(sv.toFixed(1), xPos, dh - 6);
      }
    }
    // σ axis label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText('σ', dw / 2, dh - 16);

    // Left edge: t ticks
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    const tStep = (tMax - tMin) > 80 ? 20 : (tMax - tMin) > 40 ? 10 : 5;
    for (let tv = Math.ceil(tMin / tStep) * tStep; tv <= tMax; tv += tStep) {
      const yPos = dh - ((tv - tMin) / (tMax - tMin)) * dh;
      ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(4, yPos); ctx.stroke();
      ctx.fillText(String(tv), 22, yPos + 3);
    }
    // t axis label
    ctx.save();
    ctx.translate(8, dh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('t = Im(s)', 0, 0);
    ctx.restore();
    ctx.textAlign = 'start';

    // Title and info
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('|ζ(σ + it)| Heatmap in the Critical Strip', 30, 18);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('White circles: known zeros on σ=½', 30, 34);
  }, [tRange, sigmaRange, heatmapGrid]);

  const handleHover = useCallback((e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    if (mx < 0 || mx > 1 || my < 0 || my > 1) { setHoverInfo(null); return; }
    if (mode === 'heatmap') {
      const sigma = sigmaRange[0] + mx * (sigmaRange[1] - sigmaRange[0]);
      const tMin = tRange[0];
      const tMax = tRange[1];
      const t = tMin + (1 - my) * (tMax - tMin);
      const gi = Math.min(RES - 1, Math.max(0, Math.round((mx) * (RES - 1))));
      const gj = Math.min(RES - 1, Math.max(0, Math.round((1 - my) * (RES - 1))));
      const logVal = heatmapGrid[gi * RES + gj];
      setHoverInfo({ mode: 'heatmap', sigma: sigma.toFixed(3), t: t.toFixed(2), logMag: (logVal * 4).toFixed(3), mag: (Math.exp(logVal * 4) - 1).toFixed(2) });
    } else {
      const vals = clValuesRef.current;
      if (!vals.length) return;
      const idx = Math.min(vals.length - 1, Math.max(0, Math.round(mx * (vals.length - 1))));
      const { t, z } = vals[idx];
      // Find nearest zeta zero via binary search (O(log n) instead of O(n) linear scan)
      const { zero: nearestZero, dist: nearestDist } = nearestZetaZero(t);
      setHoverInfo({ mode: 'critical-line', t: t.toFixed(2), z: z.toFixed(4), nearestZero: nearestDist < 2 ? nearestZero.toFixed(3) : null });
    }
  }, [mode, tRange, sigmaRange, heatmapGrid]);

  useEffect(() => {
    if (mode === 'critical-line') drawCriticalLine();
    else drawHeatmap();
  }, [mode, drawCriticalLine, drawHeatmap]);

  useEffect(() => {
    const handleResize = () => {
      if (mode === 'critical-line') drawCriticalLine();
      else drawHeatmap();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mode, drawCriticalLine, drawHeatmap]);

  return (
    <div>
      <div className="filter-bar">
        <button className={`filter-btn ${mode === 'critical-line' ? 'active' : ''}`}
          onClick={() => setMode('critical-line')}
          title="Riemann-Siegel Z function along σ=½ — zeros match nontrivial zeros of ζ">Critical Line Z(t)</button>
        <button className={`filter-btn ${mode === 'heatmap' ? 'active' : ''}`}
          onClick={() => setMode('heatmap')}
          title="Full |ζ(σ+it)| heatmap across the critical strip 0<σ<1">|ζ(s)| Heatmap</button>
      </div>
      {mode === 'critical-line' && (
        <div className="tab-explainer">
          <p style={{ margin: '0 0 8px' }}>
            The Riemann-Siegel Z function is <strong>real-valued</strong> on the critical line:
          </p>
          <BlockMath tex={"Z(t) = e^{i\\theta(t)}\\,\\zeta(\\tfrac{1}{2}+it)"} />
          <p style={{ margin: '8px 0 0' }}>
            Its zeros are exactly the nontrivial zeros of <InlineMath tex={"\\zeta"} />.
            The prefactor <InlineMath tex={"e^{i\\theta(t)}"} /> rotates away the phase, exposing the zero crossings directly.
            Between consecutive zeros, <InlineMath tex="Z(t)" /> oscillates with quasi-random amplitude &mdash;
            the "music" generated by the prime oscillator chain.
            <strong> Look for:</strong> zero crossings (red dots) matching the known <InlineMath tex={"\\gamma_n"} /> values.
          </p>
        </div>
      )}
      {mode === 'heatmap' && (
        <div className="tab-explainer accent-purple">
          The heatmap shows <InlineMath tex={"|\\zeta(\\sigma+it)|"} /> across the critical strip{' '}
          <InlineMath tex={"0 < \\sigma < 1"} />. Dark valleys are where <InlineMath tex={"|\\zeta|"} /> is small; bright ridges
          where it is large. The nontrivial zeros appear as deep blue pits along <InlineMath tex={"\\sigma = 0.5"} />.
          The functional equation <InlineMath tex={"\\zeta(s) = \\chi(s)\\zeta(1-s)"} /> creates the left-right symmetry about
          the critical line.
          <strong> Look for:</strong> all zero pits aligning vertically on <InlineMath tex={"\\sigma = 0.5"} />.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label title="Lower bound of the imaginary part t — controls where the visible window starts on the critical line">t range start</label>
          <input type="range" min="0" max="100" step="1" value={tRange[0]}
            title={`Start of visible t range (currently ${tRange[0]}). Increase to scroll up along the critical line.`}
            onChange={e => setTRange([Math.min(+e.target.value, tRange[1] - 5), tRange[1]])} />
          <span className="control-value">{tRange[0]}</span>
        </div>
        <div className="control-group">
          <label title="Upper bound of the imaginary part t — controls where the visible window ends on the critical line">t range end</label>
          <input type="range" min="10" max="150" step="1" value={tRange[1]}
            title={`End of visible t range (currently ${tRange[1]}). Increase to see higher zeta zeros.`}
            onChange={e => setTRange([tRange[0], Math.max(+e.target.value, tRange[0] + 5)])} />
          <span className="control-value">{tRange[1]}{' '}
            <span style={{ color: '#94a3b8', fontSize: '0.85em' }}>
              ({countZerosInRange(tRange[0], tRange[1])} zeros visible)
            </span>
          </span>
        </div>
        {hoverInfo && hoverInfo.mode === 'heatmap' && (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            <InlineMath tex={"\\sigma"} />={hoverInfo.sigma} <InlineMath tex="t" />={hoverInfo.t}
            <span style={{ marginLeft: 8, color: '#f59e0b' }}>
              log(1+|ζ|)={hoverInfo.logMag} &nbsp;|ζ|≈{hoverInfo.mag}
            </span>
          </div>
        )}
        {hoverInfo && hoverInfo.mode === 'critical-line' && (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            <InlineMath tex="t" />={hoverInfo.t}
            <span style={{ marginLeft: 8, color: '#3b82f6' }}>
              Z(t)={hoverInfo.z}
            </span>
            {hoverInfo.nearestZero && (
              <span style={{ marginLeft: 8, color: '#ef4444', fontSize: 11 }}>
                nearest zero: γ≈{hoverInfo.nearestZero}
              </span>
            )}
          </div>
        )}
        {!hoverInfo && (
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
            Hover over chart to inspect values
          </div>
        )}
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 400, cursor: 'crosshair' }}
          onMouseMove={handleHover} onMouseLeave={() => setHoverInfo(null)} />
      </div>
    </div>
  );
}
