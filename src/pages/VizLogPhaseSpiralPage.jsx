// VizLogPhaseSpiralPage.jsx -- imp-1222 (WAVE 13)
//
// Polar visualization of the complex phase of zeta(1/2 + it) for
// t in [0, T_max]. The radial coordinate r = log(t + e) packs the
// long critical line into a finite disk; the angular coordinate
// theta = arg(zeta(1/2 + it)) winds around as zeta traverses the
// complex plane. Nontrivial zeros of zeta on the critical line
// appear as caustic / cusp points where the spiral undergoes a
// pi phase jump.
//
// Computation: zeta(1/2 + it) is evaluated via Borwein-accelerated
// Dirichlet eta (zetaCriticalStrip in src/math/zeta.js) at N = 2000
// equally-spaced t values on page mount and cached in state. The
// spiral is drawn to an 800x800 canvas as a sequence of small line
// segments colored by log10|zeta| using a viridis-style ramp.
//
// Companion data + tripwires: src/data/viz-log-phase-spiral.js.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { VIZ_LOG_PHASE_SPIRAL } from '../data/viz-log-phase-spiral.js';
import { zetaCriticalStrip, cAbs } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

// ── Viridis-style color ramp ─────────────────────────────────────────────
// Five canonical viridis stops (Smith / Matplotlib). We sample by linearly
// interpolating between adjacent stops.
const VIRIDIS_STOPS = [
  { t: 0.0, r:  68, g:   1, b:  84 }, // deep purple
  { t: 0.25, r:  59, g:  82, b: 139 }, // blue
  { t: 0.5, r:  33, g: 145, b: 140 }, // teal
  { t: 0.75, r:  94, g: 201, b:  98 }, // green
  { t: 1.0, r: 253, g: 231, b:  37 }, // yellow
];

function viridis(u) {
  // Clamp u to [0, 1].
  const x = u < 0 ? 0 : u > 1 ? 1 : u;
  for (let i = 1; i < VIRIDIS_STOPS.length; i++) {
    if (x <= VIRIDIS_STOPS[i].t) {
      const a = VIRIDIS_STOPS[i - 1];
      const b = VIRIDIS_STOPS[i];
      const w = (x - a.t) / (b.t - a.t);
      const r = Math.round(a.r + (b.r - a.r) * w);
      const g = Math.round(a.g + (b.g - a.g) * w);
      const blue = Math.round(a.b + (b.b - a.b) * w);
      return 'rgb(' + r + ',' + g + ',' + blue + ')';
    }
  }
  const last = VIRIDIS_STOPS[VIRIDIS_STOPS.length - 1];
  return 'rgb(' + last.r + ',' + last.g + ',' + last.b + ')';
}

// ── Sampler: one-shot evaluation of zeta(1/2 + it) on a uniform grid ───
function sampleSpiral(tMax, N) {
  const tGrid = new Float64Array(N);
  const reArr = new Float64Array(N);
  const imArr = new Float64Array(N);
  const magArr = new Float64Array(N);
  const argArr = new Float64Array(N);
  const dt = tMax / (N - 1);
  for (let i = 0; i < N; i++) {
    const t = i * dt;
    tGrid[i] = t;
    // zetaCriticalStrip is well-defined at t = 0 (zeta(1/2) ≈ -1.4603545).
    const z = zetaCriticalStrip([0.5, t], 50);
    reArr[i] = z[0];
    imArr[i] = z[1];
    magArr[i] = cAbs(z);
    // arg in (-pi, pi]. atan2(0,0) returns 0 by spec.
    argArr[i] = Math.atan2(z[1], z[0]);
  }
  return { tGrid, reArr, imArr, magArr, argArr };
}

// ── Resonance-condition overlay helpers ──────────────────────────────────
// Returns spiral t-values satisfying log(p_j/p_i) = 2*pi*k/t.
const _TWO_PI = 2 * Math.PI;
const _RES_PRIMES = getPrimes(8);
const _RES_LOG_PRIMES = _RES_PRIMES.map(p => Math.log(p));

function buildResonanceTicks(kMax, tMax) {
  const ticks = [];
  for (let j = 1; j < _RES_PRIMES.length; j++) {
    for (let i = 0; i < j; i++) {
      const logRatio = _RES_LOG_PRIMES[j] - _RES_LOG_PRIMES[i];
      for (let k = 1; k <= kMax; k++) {
        const t = (_TWO_PI * k) / logRatio;
        if (t > 0.1 && t <= tMax) {
          ticks.push({ t, pi: _RES_PRIMES[i], pj: _RES_PRIMES[j], k });
        }
      }
    }
  }
  return ticks;
}

// ── Page component ─────────────────────────────────────────────────────
export default function VizLogPhaseSpiralPage() {
  const V = VIZ_LOG_PHASE_SPIRAL;
  const N = V.parameterRanges.defaultSamples;
  const canvasRef = useRef(null);

  // UI state.
  const [tMax, setTMax] = useState(V.parameterRanges.defaultTMaxPreset);
  const [showZeros, setShowZeros] = useState(true);
  const [showResonance, setShowResonance] = useState(false);
  const [view, setView] = useState({ zoom: 1, panX: 0, panY: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef(null);

  // Sampling state — one shot per tMax change. We sample at the LARGEST
  // requested tMax (the spec says 50/100/200); since recomputation costs
  // ~2000 zeta evals (well under a second), we recompute on tMax change.
  const [samples, setSamples] = useState(null);
  const [sampleStatus, setSampleStatus] = useState('idle'); // idle|computing|done|error

  useEffect(() => {
    let cancelled = false;
    setSampleStatus('computing');
    // Defer the compute to the next tick so the "computing" status renders
    // before the synchronous loop blocks the UI thread.
    const handle = setTimeout(() => {
      try {
        const s = sampleSpiral(tMax, N);
        if (!cancelled) {
          setSamples(s);
          setSampleStatus('done');
        }
      } catch (e) {
        if (!cancelled) setSampleStatus('error');
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [tMax, N]);

  // Wheel zoom — non-passive so preventDefault blocks page scroll.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = V.canvasSize.width;
    const H = V.canvasSize.height;
    const onWheel = (e) => {
      e.preventDefault();
      setView(prev => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (W / rect.width);
        const my = (e.clientY - rect.top) * (H / rect.height);
        const cxW = W / 2;
        const cyH = H / 2;
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        const newZoom = Math.max(0.2, Math.min(20, prev.zoom * factor));
        return {
          zoom: newZoom,
          panX: mx - cxW - (mx - cxW - prev.panX) * (newZoom / prev.zoom),
          panY: my - cyH - (my - cyH - prev.panY) * (newZoom / prev.zoom),
        };
      });
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [V.canvasSize.width, V.canvasSize.height]);

  // Resonance ticks — recomputed only when tMax changes.
  const resonanceTicks = useMemo(() => buildResonanceTicks(3, tMax), [tMax]);

  // log10|zeta| range — used for color normalisation.
  const colorRange = useMemo(() => {
    if (!samples) return { lo: -1, hi: 1 };
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < samples.magArr.length; i++) {
      const v = Math.log10(Math.max(1e-6, samples.magArr[i]));
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi - lo < 1e-9) {
      return { lo: -1, hi: 1 };
    }
    return { lo, hi };
  }, [samples]);

  // Canvas draw — replays whenever samples / showZeros / colorRange change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !samples) return;
    const W = V.canvasSize.width;
    const H = V.canvasSize.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background.
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    // Geometry — disk centred in canvas, padded.
    const cx = W / 2;
    const cy = H / 2;
    const rMax = Math.log(tMax + Math.E); // r at the largest t shown
    const padPx = 40;
    const scale = (Math.min(W, H) / 2 - padPx) / rMax;

    // Zoom + pan transform — wraps all geometry; footer label stays in screen space.
    ctx.save();
    ctx.translate(cx + view.panX, cy + view.panY);
    ctx.scale(view.zoom, view.zoom);
    ctx.translate(-cx, -cy);

    // Radial reference circles (every integer log(t+e)).
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (let k = 1; k <= Math.floor(rMax); k++) {
      const px = k * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, px, 0, Math.PI * 2);
      ctx.stroke();
      // Annotate the t value at the right edge of the disk
      // (so the user can read the r=log(t+e) → t mapping back).
      const tAtR = Math.exp(k) - Math.E;
      if (tAtR > 0.5) {
        ctx.fillText('t≈' + tAtR.toFixed(0), cx + px + 4, cy - 6);
      }
    }

    // Centre cross (theta = 0 axis = positive x).
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(cx - (Math.min(W, H) / 2 - padPx), cy);
    ctx.lineTo(cx + (Math.min(W, H) / 2 - padPx), cy);
    ctx.moveTo(cx, cy - (Math.min(W, H) / 2 - padPx));
    ctx.lineTo(cx, cy + (Math.min(W, H) / 2 - padPx));
    ctx.stroke();

    // Spiral curve — draw as colored short segments.
    const { tGrid, magArr, argArr } = samples;
    const { lo, hi } = colorRange;
    let prevX = null, prevY = null;
    for (let i = 0; i < tGrid.length; i++) {
      const t = tGrid[i];
      const r = Math.log(t + Math.E) * scale;
      const theta = argArr[i];
      const x = cx + r * Math.cos(theta);
      const y = cy - r * Math.sin(theta); // canvas-y inverted so +y is up
      if (prevX != null) {
        const u = (Math.log10(Math.max(1e-6, magArr[i])) - lo) / (hi - lo);
        ctx.strokeStyle = viridis(u);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      prevX = x;
      prevY = y;
    }

    // Zero markers — first 25 Odlyzko ordinates. For each gamma_n with
    // gamma_n <= tMax, draw a red circle at the spiral's position and
    // label it.
    if (showZeros) {
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (let n = 0; n < V.zeros.length; n++) {
        const gamma = V.zeros[n];
        if (gamma > tMax) continue;
        // Interpolate arg(zeta) at gamma from the sampled grid.
        const idxFloat = (gamma / tMax) * (tGrid.length - 1);
        const i0 = Math.floor(idxFloat);
        const i1 = Math.min(tGrid.length - 1, i0 + 1);
        const w = idxFloat - i0;
        // Linear interpolation in (cos, sin) avoids the wraparound
        // discontinuity that a naive arg interpolation would suffer.
        const cos0 = Math.cos(argArr[i0]);
        const sin0 = Math.sin(argArr[i0]);
        const cos1 = Math.cos(argArr[i1]);
        const sin1 = Math.sin(argArr[i1]);
        const cosI = cos0 * (1 - w) + cos1 * w;
        const sinI = sin0 * (1 - w) + sin1 * w;
        const norm = Math.hypot(cosI, sinI) || 1;
        const thetaG = Math.atan2(sinI / norm, cosI / norm);
        const rG = Math.log(gamma + Math.E) * scale;
        const x = cx + rG * Math.cos(thetaG);
        const y = cy - rG * Math.sin(thetaG);
        // Outer halo + inner solid dot.
        ctx.fillStyle = 'rgba(239,68,68,0.18)';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('γ' + (n + 1), x + 8, y);
      }
    }

    // Resonance markers — spiral positions where log(p_j/p_i) = 2*pi*k/t.
    if (showResonance) {
      for (let ri = 0; ri < resonanceTicks.length; ri++) {
        const tRes = resonanceTicks[ri].t;
        if (tRes > tMax) continue;
        const idxFloat = (tRes / tMax) * (tGrid.length - 1);
        const i0 = Math.floor(idxFloat);
        const i1 = Math.min(tGrid.length - 1, i0 + 1);
        const wt = idxFloat - i0;
        const cos0 = Math.cos(argArr[i0]);
        const sin0 = Math.sin(argArr[i0]);
        const cos1 = Math.cos(argArr[i1]);
        const sin1 = Math.sin(argArr[i1]);
        const cosI = cos0 * (1 - wt) + cos1 * wt;
        const sinI = sin0 * (1 - wt) + sin1 * wt;
        const norm = Math.hypot(cosI, sinI) || 1;
        const thetaR = Math.atan2(sinI / norm, cosI / norm);
        const rR = Math.log(tRes + Math.E) * scale;
        const xR = cx + rR * Math.cos(thetaR);
        const yR = cy - rR * Math.sin(thetaR);
        ctx.fillStyle = 'rgba(20,184,166,0.55)';
        ctx.beginPath();
        ctx.arc(xR, yR, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // Footer label — drawn in screen space, outside zoom+pan transform.
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('r = log(t+e) · θ = arg ζ(½+it)', 12, H - 12);
    ctx.textAlign = 'right';
    ctx.fillText('t ∈ [0, ' + tMax + '] · N = ' + N, W - 12, H - 12);
  }, [samples, showZeros, showResonance, resonanceTicks, colorRange, tMax, N, V.canvasSize.width, V.canvasSize.height, V.zeros, view]);

  // How many zeros are visible at the current tMax (purely informational).
  const visibleZeroCount = V.zeros.filter((g) => g <= tMax).length;

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, panX: view.panX, panY: view.panY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !dragStart.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = V.canvasSize.width / rect.width;
    const sy = V.canvasSize.height / rect.height;
    const dx = (e.clientX - dragStart.current.x) * sx;
    const dy = (e.clientY - dragStart.current.y) * sy;
    setView(prev => ({ ...prev, panX: dragStart.current.panX + dx, panY: dragStart.current.panY + dy }));
  };

  const handleMouseUp = () => { isDragging.current = false; };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{V.title}</h1>
        <p className="page-subtitle">
          {V.description}
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link
            to="/explorations"
            style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}
          >
            &larr; back to Explorations
          </Link>
          <Link
            to="/visualizations"
            style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: 12 }}
          >
            &larr; Visualizations gallery
          </Link>
          <Link
            to="/route-map"
            style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: 12 }}
          >
            &larr; Route Map
          </Link>
        </div>
      </div>

      {/* Formula card */}
      <div
        className="card"
        style={{ marginTop: 18, padding: 14, borderLeft: '3px solid #a855f7' }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#a855f7',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 10,
          }}
        >
          parametric spiral
        </div>
        <div style={{ overflowX: 'auto' }}>
          <BlockMath tex={V.mathFormula.spiral} />
          <BlockMath tex={V.mathFormula.radius} />
          <BlockMath tex={V.mathFormula.angle} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          The curve color encodes <InlineMath tex={'\\log_{10} ' + V.mathFormula.amplitude} />{' '}
          via a viridis ramp (deep purple = small, yellow = large). Nontrivial
          zeros of <InlineMath tex={'\\zeta(\\tfrac{1}{2} + i t)'} /> on the
          critical line cause a phase jump:
        </p>
        <div style={{ overflowX: 'auto', marginTop: 6 }}>
          <BlockMath tex={V.mathFormula.caustic} />
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 18,
        }}
      >
        <label
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          t window upper bound:&nbsp;
          {V.parameterRanges.tMaxPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setTMax(preset)}
              style={{
                marginLeft: 4,
                padding: '4px 10px',
                background: tMax === preset ? '#a855f7' : '#1e293b',
                color: tMax === preset ? '#0f172a' : '#cbd5e1',
                border: '1px solid #334155',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {preset}
            </button>
          ))}
        </label>
        <label
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          <input
            type="checkbox"
            checked={showZeros}
            onChange={(e) => setShowZeros(e.target.checked)}
            style={{ verticalAlign: 'middle', marginRight: 6 }}
          />
          show first 25 Odlyzko zero markers ({visibleZeroCount} visible at t≤{tMax})
        </label>
        <label
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          <input
            type="checkbox"
            checked={showResonance}
            onChange={(e) => setShowResonance(e.target.checked)}
            style={{ verticalAlign: 'middle', marginRight: 6 }}
          />
          resonance overlay log(p_j/p_i)=2πk/t, k≤3
        </label>
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color:
              sampleStatus === 'done'
                ? '#86efac'
                : sampleStatus === 'computing'
                  ? '#facc15'
                  : sampleStatus === 'error'
                    ? '#fca5a5'
                    : '#64748b',
          }}
        >
          status: {sampleStatus} ({N} samples)
        </span>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#64748b' }}>
          zoom: {view.zoom.toFixed(2)}×
        </span>
        <button
          onClick={() => setView({ zoom: 1, panX: 0, panY: 0 })}
          style={{
            padding: '4px 10px',
            background: '#1e293b',
            color: '#cbd5e1',
            border: '1px solid #334155',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          reset view
        </button>
      </div>

      {/* Canvas */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          width={V.canvasSize.width}
          height={V.canvasSize.height}
          style={{
            width: V.canvasSize.width,
            height: V.canvasSize.height,
            maxWidth: '100%',
            display: 'block',
            background: '#0a0e1a',
            borderRadius: 6,
            cursor: 'grab',
            touchAction: 'none',
          }}
          aria-label="Log-phase interference spiral of zeta(1/2 + it)"
          role="img"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <span>
          <span style={{ color: '#a855f7' }}>—</span> spiral colored by log<sub>10</sub>|ζ|
        </span>
        <span>
          <span style={{ color: '#ef4444' }}>●</span> γ<sub>n</sub> = nontrivial zero ordinate
        </span>
        {showResonance && (
          <span>
            <span style={{ color: '#14b8a6' }}>●</span> resonance tick t = 2πk/log(p_j/p_i)
          </span>
        )}
        <span>{V.colorScaleNote}</span>
      </div>

      {/* Honest scope */}
      <div
        className="card"
        style={{ marginTop: 24, padding: 14, borderLeft: '3px solid #06b6d4' }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#06b6d4',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          honest scope &amp; method
        </div>
        <ul
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.7,
            paddingLeft: 18,
          }}
        >
          <li>
            <strong>Evaluator.</strong> {V.evaluatorNote}
          </li>
          <li>
            <strong>Sampling.</strong> N = {N} uniformly spaced t values in
            [0, {tMax}] (≈ {(tMax / (N - 1)).toFixed(3)} per step). Sampling
            runs once per tMax change on the main thread and finishes in
            well under a second for N=2000.
          </li>
          <li>
            <strong>Caustic interpretation.</strong> Each marked γ<sub>n</sub>{' '}
            corresponds to a sign-change of Hardy's Z(t) and therefore a
            sudden π-jump of arg ζ on the critical line. Because of the
            uniform grid, the rendered cusp position is interpolated; it
            visually identifies the caustic, but is not an independent
            zero-locator (use the Riemann-Siegel page or the dedicated
            zero-finder for that).
          </li>
          <li>
            <strong>Visible zeros.</strong> {visibleZeroCount} of the 25
            stored ordinates fall within t ≤ {tMax}. The full 25-zero set
            (γ<sub>1</sub>=14.13 through γ<sub>25</sub>=88.81) is captured
            for the largest preset t<sub>max</sub>=200.
          </li>
        </ul>
      </div>

      {/* References */}
      <div
        className="card"
        style={{ marginTop: 20, padding: 14, borderLeft: '3px solid #f59e0b' }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#f59e0b',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          references
        </div>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, paddingLeft: 18 }}>
          {V.references.map((r, idx) => (
            <li key={'ref-' + idx}>
              <strong>{r.label}.</strong> {r.note}
              {r.url && !r.url.startsWith('internal:') ? (
                <>
                  {' '}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                  >
                    {r.url}
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* Sibling pages strip (post imp-1228 will activate routes) */}
      <div
        className="card"
        style={{ marginTop: 20, padding: 14, borderLeft: '3px solid #ec4899' }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#ec4899',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          sibling visualizations (WAVE 13)
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          This page is part of the WAVE 13 visualization suite. The other
          five viz pages (
          {V.relatedSections.map((s, idx) => (
            <span key={s.ticket}>
              {idx > 0 ? ', ' : ''}
              <code style={{ color: '#94a3b8' }}>{s.label}</code> ({s.ticket})
            </span>
          ))}
          ) are pending — once imp-1228 ships, a Visualizations nav group will
          link them all.
        </div>
      </div>

      {/* Source footer */}
      <div
        style={{
          marginTop: 20,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
        }}
      >
        source: src/data/viz-log-phase-spiral.js · evaluator:
        src/math/zeta.js#zetaCriticalStrip · zeros:{' '}
        {V.zeroSource}
      </div>
    </div>
  );
}
