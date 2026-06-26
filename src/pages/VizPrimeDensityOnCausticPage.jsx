// VizPrimeDensityOnCausticPage.jsx -- imp-2717
// "Prime-Density-on-Caustics" overlay: at each height t, which primes (by
// index / prime-counting rank) contribute to the caustic?
//
// Axes:
//   X  -- t in [T_MIN, T_MAX]  (imaginary part of s)
//   Y  -- prime index k in [0, N-1], scaled 0..1 (top = p_1 = 2, bottom = p_N)
//
// Color: a pixel at (t, k) is bright when prime p_k satisfies
//   |(t * log p_k) mod 2pi| < eps.
// The sigma-weighted amplitude is blended as a brightness channel.
//
// Profile chart: per-column "coherent fraction" vs the PNT baseline eps/pi,
// with an orange excess curve showing (profile - baseline) above zero.
//
// Zoom + pan: mouse-wheel to zoom around the cursor; drag to pan.

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPrimes } from '../math/primes.js';

const TWO_PI = 2 * Math.PI;
const mono = 'var(--font-mono)';

const N_PRIMES = 500;
const T_MIN = 10;
const T_MAX = 200;
const GRID_W = 360;
const GRID_H = 300;

// Viridis-like colormap for the caustic density heatmap.
const COLORMAP = (() => {
  const out = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    out[i * 3 + 0] = Math.round(255 * Math.max(0, Math.min(1, -0.20 + 1.50 * x)));
    out[i * 3 + 1] = Math.round(255 * Math.max(0, Math.min(1,  0.10 + 1.05 * x - 0.20 * x * x)));
    out[i * 3 + 2] = Math.round(255 * Math.max(0, Math.min(1,  0.40 + 0.40 * x - 0.90 * x * x)));
  }
  return out;
})();

// Wrap phase to (-pi, pi].
function wrap(x) {
  let r = x - TWO_PI * Math.round(x / TWO_PI);
  if (r >  Math.PI) r -= TWO_PI;
  if (r < -Math.PI) r += TWO_PI;
  return r;
}

// Pre-compute primes once.
const PRIMES = getPrimes(N_PRIMES);
const LOG_PRIMES = PRIMES.map(p => Math.log(p));

export default function VizPrimeDensityOnCausticPage() {
  const canvasRef   = useRef(null);
  const profileRef  = useRef(null);

  const [eps, setEps]         = useState(0.25);
  const [sigma, setSigma]     = useState(0.5);
  const [nPrimes, setNPrimes] = useState(300);
  const [renderMs, setRenderMs] = useState(0);
  const [tViewMin, setTViewMin] = useState(T_MIN);
  const [tViewMax, setTViewMax] = useState(T_MAX);

  // Keep a ref with the current view range so the wheel listener (non-React closure)
  // can always read the latest values without being stale.
  const viewRef = useRef({ tMin: T_MIN, tMax: T_MAX });
  useEffect(() => { viewRef.current = { tMin: tViewMin, tMax: tViewMax }; }, [tViewMin, tViewMax]);

  // Wheel zoom: zoom around the horizontal cursor position on the t-axis.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const { tMin, tMax } = viewRef.current;
      const tFocus = tMin + frac * (tMax - tMin);
      const factor = e.deltaY > 0 ? 1.3 : 0.77;
      const span = Math.max(5, (tMax - tMin) * factor);
      let newMin = tFocus - frac * span;
      let newMax = tFocus + (1 - frac) * span;
      if (newMin < T_MIN) { newMax += (T_MIN - newMin); newMin = T_MIN; }
      if (newMax > T_MAX) { newMin -= (newMax - T_MAX); newMax = T_MAX; }
      setTViewMin(Math.max(T_MIN, newMin));
      setTViewMax(Math.min(T_MAX, newMax));
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  // Drag-pan state stored in a ref to avoid stale closures in mousemove.
  const dragRef = useRef({ active: false, startX: 0, tMinAtStart: 0, tMaxAtStart: 0 });

  const handleMouseDown = useCallback((e) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      tMinAtStart: viewRef.current.tMin,
      tMaxAtStart: viewRef.current.tMax,
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startX) / rect.width;
    const span = dragRef.current.tMaxAtStart - dragRef.current.tMinAtStart;
    const shift = -dx * span;
    let newMin = dragRef.current.tMinAtStart + shift;
    let newMax = dragRef.current.tMaxAtStart + shift;
    if (newMin < T_MIN) { newMax += (T_MIN - newMin); newMin = T_MIN; }
    if (newMax > T_MAX) { newMin -= (newMax - T_MAX); newMax = T_MAX; }
    setTViewMin(Math.max(T_MIN, newMin));
    setTViewMax(Math.min(T_MAX, newMax));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  // Build per-column coherent-fraction profile for the current t-view.
  const profile = useMemo(() => {
    const N = Math.min(nPrimes, PRIMES.length);
    const out = new Float64Array(GRID_W);
    for (let px = 0; px < GRID_W; px++) {
      const t = tViewMin + (px / (GRID_W - 1)) * (tViewMax - tViewMin);
      let count = 0;
      for (let k = 0; k < N; k++) {
        if (Math.abs(wrap(t * LOG_PRIMES[k])) < eps) count++;
      }
      out[px] = count / N;
    }
    return out;
  }, [eps, nPrimes, tViewMin, tViewMax]);

  const pntBaseline = (eps / Math.PI);  // expected fraction under uniform distribution

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t0 = performance.now();

    const N = Math.min(nPrimes, PRIMES.length);
    canvas.width  = GRID_W;
    canvas.height = GRID_H;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(GRID_W, GRID_H);
    const data = imgData.data;

    // For each (px, py): px -> t (within current view), py -> prime index k.
    for (let px = 0; px < GRID_W; px++) {
      const t = tViewMin + (px / (GRID_W - 1)) * (tViewMax - tViewMin);

      // Total amplitude sum for normalization within this column.
      let ampSum = 0;
      let coherentCount = 0;
      for (let k = 0; k < N; k++) {
        if (Math.abs(wrap(t * LOG_PRIMES[k])) < eps) {
          ampSum += Math.exp(-sigma * LOG_PRIMES[k]);
          coherentCount++;
        }
      }

      for (let py = 0; py < GRID_H; py++) {
        // Map py -> prime index k (top of canvas = index 0 = smallest prime).
        const k = Math.min(N - 1, Math.floor((py / (GRID_H - 1)) * (N - 1)));
        const inCaustic = Math.abs(wrap(t * LOG_PRIMES[k])) < eps;

        let r = 0, g = 0, b = 0;
        if (inCaustic) {
          const amp = Math.exp(-sigma * LOG_PRIMES[k]);
          const norm = ampSum > 0 ? Math.min(1, amp / (ampSum / Math.max(1, coherentCount))) : 0.5;
          const idx256 = Math.min(255, Math.floor(Math.sqrt(norm) * 255));
          r = COLORMAP[idx256 * 3 + 0];
          g = COLORMAP[idx256 * 3 + 1];
          b = COLORMAP[idx256 * 3 + 2];
        } else {
          // Background: very dark navy.
          r = 5; g = 7; b = 18;
        }

        const pos = (py * GRID_W + px) * 4;
        data[pos]     = r;
        data[pos + 1] = g;
        data[pos + 2] = b;
        data[pos + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw horizontal grid lines at every 100th prime.
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 4]);
    for (let k = 0; k < N; k += 100) {
      const py = Math.round((k / (N - 1)) * (GRID_H - 1));
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(GRID_W, py);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('p_' + (k + 1) + '=' + PRIMES[k], 3, py - 2);
      ctx.setLineDash([2, 4]);
    }
    ctx.setLineDash([]);

    // Axis labels showing current t-view range.
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText('t=' + tViewMin.toFixed(1), 3, GRID_H - 4);
    ctx.textAlign = 'right';
    ctx.fillText('t=' + tViewMax.toFixed(1), GRID_W - 3, GRID_H - 4);

    setRenderMs(+(performance.now() - t0).toFixed(1));
  }, [eps, sigma, nPrimes, tViewMin, tViewMax]);

  // Draw coherent-fraction profile chart with PNT difference curve overlay.
  const drawProfile = useCallback(() => {
    const canvas = profileRef.current;
    if (!canvas || !profile) return;
    canvas.width  = GRID_W;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, GRID_W, 80);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, GRID_W, 80);

    const maxFrac = Math.max(...profile, pntBaseline * 2);

    // Baseline (PNT expected fraction).
    const baseY = 80 - Math.min(79, Math.round(pntBaseline * 3 * 80));
    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, baseY); ctx.lineTo(GRID_W, baseY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PNT baseline', 3, baseY - 2);

    // Profile bars (purple).
    ctx.fillStyle = '#a855f7';
    for (let px = 0; px < GRID_W; px++) {
      const h = Math.round((profile[px] / maxFrac) * 78);
      if (h > 0) ctx.fillRect(px, 80 - h, 1, h);
    }

    // PNT difference curve: clamp(profile[px] - pntBaseline, 0, inf) as orange polyline.
    // y=79 = zero excess; excess rises proportionally to maxFrac over 78 pixels.
    const diffScale = maxFrac > 0 ? 78 / maxFrac : 0;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px < GRID_W; px++) {
      const diff = Math.max(0, profile[px] - pntBaseline);
      const y = 79 - Math.round(diff * diffScale);
      if (px === 0) ctx.moveTo(px + 0.5, y); else ctx.lineTo(px + 0.5, y);
    }
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.font = '9px monospace';
    ctx.fillStyle = '#f97316';
    ctx.textAlign = 'right';
    ctx.fillText('excess (orange)', GRID_W - 3, 78);
    ctx.textAlign = 'left';
  }, [profile, pntBaseline]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { drawProfile(); }, [drawProfile]);

  const aboveBaseline = profile
    ? Array.from(profile).filter(v => v > pntBaseline).length
    : 0;

  const isZoomed = tViewMin > T_MIN + 0.5 || tViewMax < T_MAX - 0.5;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Prime Density on Caustics (imp-2717)</h1>
        <p className="page-subtitle">
          Each pixel (t, k) is bright when prime p_k lies inside the caustic
          window at height t: |t&thinsp;log&thinsp;p_k mod 2pi| &lt; eps.
          X-axis: t in [{tViewMin.toFixed(1)}, {tViewMax.toFixed(1)}]; Y-axis: prime index
          from p_1 = 2 (top) to p_N (bottom). Brightness encodes
          sigma-weighted amplitude p_k^(-sigma). Lower chart: coherent fraction
          per t-column (purple bars) vs PNT baseline (grey dashed) and excess
          above baseline (orange curve).{' '}
          <strong style={{ color: '#94a3b8' }}>Scroll to zoom, drag to pan.</strong>
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/visual-geometries" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            &larr; Visual Geometries
          </Link>
          <Link to="/viz-prime-caustic" style={{ color: '#f59e0b', fontFamily: mono, fontSize: 12 }}>
            Prime Caustic (sigma x t heatmap)
          </Link>
          <Link to="/viz-prime-phase-crystal" style={{ color: '#22c55e', fontFamily: mono, fontSize: 12 }}>
            Prime Phase Crystal
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(152px, 1fr))',
        gap: 10,
      }}>
        <Stat label="N primes"         value={String(Math.min(nPrimes, PRIMES.length))} />
        <Stat label="eps (rad)"        value={eps.toFixed(2)} />
        <Stat label="sigma"            value={sigma.toFixed(2)} />
        <Stat label="PNT baseline"     value={(pntBaseline * 100).toFixed(1) + '%'} accent="#94a3b8" />
        <Stat label="cols > baseline"  value={String(aboveBaseline) + ' / ' + GRID_W} accent="#a855f7" />
        <Stat label="render (ms)"      value={String(renderMs)} />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="control-group">
          <label>N primes</label>
          <input type="range" min="50" max={PRIMES.length} step="50" value={nPrimes}
                 onChange={e => setNPrimes(+e.target.value)} />
          <span className="control-value">{nPrimes}</span>
        </div>
        <div className="control-group">
          <label>eps (rad)</label>
          <input type="range" min="0.05" max="0.6" step="0.05" value={eps}
                 onChange={e => setEps(+e.target.value)} />
          <span className="control-value">{eps.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>sigma</label>
          <input type="range" min="0.1" max="0.9" step="0.05" value={sigma}
                 onChange={e => setSigma(+e.target.value)} />
          <span className="control-value">{sigma.toFixed(2)}</span>
        </div>
        {isZoomed && (
          <button
            onClick={() => { setTViewMin(T_MIN); setTViewMax(T_MAX); }}
            style={{
              padding: '4px 10px', fontSize: 11, cursor: 'pointer',
              background: 'var(--bg-panel)', border: '1px solid var(--border)',
              borderRadius: 6, color: '#94a3b8', fontFamily: mono,
            }}>
            Reset zoom
          </button>
        )}
      </div>

      <div style={{ marginTop: 14, background: 'var(--bg-panel)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 6, fontFamily: mono }}>
          Prime index (Y) vs t (X) &mdash; bright = in caustic window
          {isZoomed && (
            <span style={{ color: '#f97316', marginLeft: 8 }}>
              t=[{tViewMin.toFixed(1)}, {tViewMax.toFixed(1)}]
            </span>
          )}
        </div>
        <canvas ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ width: '100%', maxWidth: GRID_W, height: 'auto', display: 'block',
                         border: '1px solid #1e293b', borderRadius: 4,
                         imageRendering: 'pixelated', cursor: 'grab' }} />
      </div>

      <div style={{ marginTop: 10, background: 'var(--bg-panel)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 6, fontFamily: mono }}>
          Coherent prime fraction per t-column: purple bars, PNT baseline (grey dashed), excess (orange)
        </div>
        <canvas ref={profileRef}
                style={{ width: '100%', maxWidth: GRID_W, height: 'auto', display: 'block',
                         border: '1px solid #1e293b', borderRadius: 4,
                         imageRendering: 'pixelated' }} />
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.65 }}>
        <strong style={{ color: '#cbd5e1' }}>Reading the map.</strong>{' '}
        Vertical streaks indicate heights t where many primes align simultaneously
        (caustic bands). Horizontal structure shows which primes (small vs large)
        are most resonant: the top rows (small primes, large log p) have wider
        resonance windows at any t; the bottom rows (large primes) form thinner
        arcs because their log p values are more uniformly spread. The lower
        profile chart compares the fraction of primes inside the caustic window
        to the PNT baseline eps/pi; peaks above the dashed line mark genuine
        multiplicative resonances (log(p_i/p_j) = 2pi*k/t for small k). The
        orange difference curve isolates the excess above the PNT baseline.
        Use the mouse wheel to zoom into any interesting band; drag to pan.
        <br /><br />
        <strong style={{ color: '#94a3b8' }}>Honest scope:</strong> this is an
        exploratory geometric visualization. The caustic structure is real and
        arithmetic, but per the{' '}
        <Link to="/route-map" style={{ color: '#64748b' }}>route map</Link>{' '}
        it does not provide a rigorous bound on Lambda beyond the known &Lambda; &ge; 0.
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 16, fontFamily: mono, color: accent || '#e2e8f0' }}>
        {value}
      </div>
    </div>
  );
}
