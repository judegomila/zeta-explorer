// VizTwinLadderTomographyPage -- imp-1223
//
// 2D Canvas heatmap of P(sigma, t) = |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)|
// over (sigma, t) in [0.05, 0.95] x [0, T_MAX]. Resolution 400x400. The critical
// line sigma = 1/2 stands out as a horizontal interference minimum trough because
// the functional equation makes the two factors complex-conjugate partners there
// (so the product collapses to |zeta(1/2 + i t)|^2 -- including exact zeros at
// every nontrivial gamma_n).
//
// COMPUTE BUDGET
//   400 x 400 = 160k pixels. Each pixel requires 2 zetaCriticalStrip calls (one
//   for sigma, one for 1-sigma). On a modern laptop this is ~20-40 s. We compute
//   in chunks via setTimeout so the page stays responsive and shows progress.
//
// RENDER
//   Off-screen Uint8ClampedArray + ImageData + a single putImageData per chunk
//   completion. Viridis colormap on log(1 + P) for dynamic range.
//
// CONTROLS
//   - t_max selector: 10 / 50 / 100 (triggers a fresh compute).
//   - Overlay toggle: first 25 known zeros as red dots on sigma = 1/2.
//
// All sigma and t axes are linear.

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VIZ_TWIN_LADDER_TOMOGRAPHY } from '../data/viz-twin-ladder-tomography.js';
import { zetaCriticalStrip } from '../math/zeta.js';

// ---------------------------------------------------------------------------
// Geometry / compute parameters (must match the data-module record).
// ---------------------------------------------------------------------------

const SIGMA_MIN = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.sigmaMin;
const SIGMA_MAX = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.sigmaMax;
const T_MIN     = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.tMin;
const RES       = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.resolution;
const BORWEIN_N = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.zetaBorweinN;
const T_MAX_OPTIONS = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.tMaxOptions;
const T_MAX_DEFAULT = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges.tMaxDefault;

const CANVAS_DISPLAY = 600; // CSS pixels (canvas internal stays at RES x RES)

// ---------------------------------------------------------------------------
// Viridis colormap (256 stops; standard matplotlib-style approximation).
// We precompute once as a Uint8 RGB table for fast pixel writes.
// ---------------------------------------------------------------------------

const VIRIDIS_STOPS = [
  [0.0,   68,   1,  84],
  [0.125, 72,  35, 116],
  [0.25,  64,  67, 135],
  [0.375, 52,  94, 141],
  [0.5,   41, 121, 142],
  [0.625, 32, 144, 140],
  [0.75,  34, 167, 132],
  [0.875, 94, 201, 97],
  [1.0,  253, 231, 36],
];

function buildViridis() {
  const table = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const u = i / 255;
    // find bracketing stops
    let lo = 0;
    for (let k = 1; k < VIRIDIS_STOPS.length; k++) {
      if (VIRIDIS_STOPS[k][0] >= u) { lo = k - 1; break; }
      if (k === VIRIDIS_STOPS.length - 1) lo = k - 1;
    }
    const [u0, r0, g0, b0] = VIRIDIS_STOPS[lo];
    const [u1, r1, g1, b1] = VIRIDIS_STOPS[lo + 1];
    const f = u1 === u0 ? 0 : (u - u0) / (u1 - u0);
    table[i * 3 + 0] = Math.round(r0 + (r1 - r0) * f);
    table[i * 3 + 1] = Math.round(g0 + (g1 - g0) * f);
    table[i * 3 + 2] = Math.round(b0 + (b1 - b0) * f);
  }
  return table;
}

const VIRIDIS_TABLE = buildViridis();

// ---------------------------------------------------------------------------
// Pixel-to-axis helpers.
//
// Canvas convention: row 0 is at the TOP. We map t (vertical) so that t = T_MIN
// is at the bottom (row RES-1) and t = T_MAX is at the top (row 0), which is
// the standard "time runs upward" convention for zeta-strip heatmaps.
// ---------------------------------------------------------------------------

function colToSigma(col) {
  return SIGMA_MIN + (SIGMA_MAX - SIGMA_MIN) * (col / (RES - 1));
}

function rowToT(row, tMax) {
  return T_MIN + (tMax - T_MIN) * ((RES - 1 - row) / (RES - 1));
}

function sigmaToDisplayX(sigma) {
  return ((sigma - SIGMA_MIN) / (SIGMA_MAX - SIGMA_MIN)) * CANVAS_DISPLAY;
}

function tToDisplayY(t, tMax) {
  return CANVAS_DISPLAY - ((t - T_MIN) / (tMax - T_MIN)) * CANVAS_DISPLAY;
}

// ---------------------------------------------------------------------------
// Component.
// ---------------------------------------------------------------------------

export default function VizTwinLadderTomographyPage() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [tMax, setTMax] = useState(T_MAX_DEFAULT);
  const [showZerosOverlay, setShowZerosOverlay] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1
  const [computeMs, setComputeMs] = useState(null);
  const [vMin, setVMin] = useState(null);
  const [vMax, setVMax] = useState(null);
  const abortRef = useRef(0); // bump to cancel an in-flight compute
  const pBufRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // -------------------------------------------------------------------------
  // Compute the full RES x RES P-array on mount / when tMax changes.
  //
  // The product P(sigma, t) = |zeta(sigma+it)| * |zeta((1-sigma)+it)| is
  // symmetric under sigma -> 1-sigma by construction (the two factors swap),
  // so the heatmap is mirror-symmetric about the sigma=1/2 line. The
  // INDIVIDUAL factors |zeta(.,t)| are NOT symmetric, however, so we still
  // need one zeta evaluation per (sigma, t) pixel; the symmetry only buys
  // us "one product op per pixel instead of two zeta ops". Inside a row we
  // cache |zeta(sigma, t)| for every column once, then form the product
  // P[c] = absCache[c] * absCache[RES-1-c]. Total: ~RES^2 zeta evals.
  // -------------------------------------------------------------------------

  const startCompute = useCallback(() => {
    abortRef.current += 1;
    const myAbort = abortRef.current;
    const t0 = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = RES;
    canvas.height = RES;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(RES, RES);

    // Storage for raw P values (so we can re-color if we ever add a scale toggle).
    const pBuf = new Float32Array(RES * RES);
    let gMin = Infinity;
    let gMax = -Infinity;

    // Process rows in chunks so the UI stays responsive.
    const ROWS_PER_TICK = 8;
    let rowCursor = 0;

    function processChunk() {
      if (abortRef.current !== myAbort) return; // a newer compute superseded us

      const endRow = Math.min(rowCursor + ROWS_PER_TICK, RES);
      for (let row = rowCursor; row < endRow; row++) {
        const t = rowToT(row, tMax);

        // Cache |zeta(sigma, t)| for every sigma column ONCE.
        // Note: |zeta(sigma+it)| != |zeta((1-sigma)+it)| off the critical
        // line, so we evaluate BOTH halves independently. The sigma <-> 1-sigma
        // symmetry only collapses the PRODUCT, not the individual factors.
        const absCache = new Float64Array(RES);
        for (let c = 0; c < RES; c++) {
          const sigma = colToSigma(c);
          const z = zetaCriticalStrip([sigma, t], BORWEIN_N);
          absCache[c] = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
        }

        // Form P = |zeta(sigma, t)| * |zeta((1-sigma), t)| for every column.
        for (let c = 0; c < RES; c++) {
          const partner = RES - 1 - c;
          const p = absCache[c] * absCache[partner];
          pBuf[row * RES + c] = p;
          if (p < gMin) gMin = p;
          if (p > gMax) gMax = p;
        }
      }

      rowCursor = endRow;
      if (abortRef.current !== myAbort) return;
      setProgress(rowCursor / RES);

      if (rowCursor < RES) {
        // Yield to the event loop.
        setTimeout(processChunk, 0);
      } else {
        // All rows done. Build the ImageData using a viridis ramp on log(1 + P).
        // Use log scale to compress the very large dynamic range
        // (P ranges from ~0 at zeros to ~tens off-critical for large t).
        const lo = Math.log1p(Math.max(gMin, 0));
        const hi = Math.log1p(gMax);
        const span = hi - lo;
        const safeSpan = span > 1e-12 ? span : 1;
        const data = imgData.data;
        for (let row = 0; row < RES; row++) {
          for (let c = 0; c < RES; c++) {
            const p = pBuf[row * RES + c];
            const u = (Math.log1p(p) - lo) / safeSpan;
            const ci = Math.max(0, Math.min(255, Math.round(u * 255)));
            const off = (row * RES + c) * 4;
            data[off + 0] = VIRIDIS_TABLE[ci * 3 + 0];
            data[off + 1] = VIRIDIS_TABLE[ci * 3 + 1];
            data[off + 2] = VIRIDIS_TABLE[ci * 3 + 2];
            data[off + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        pBufRef.current = pBuf;
        setProgress(1);
        setComputeMs(performance.now() - t0);
        setVMin(gMin);
        setVMax(gMax);
      }
    }

    setProgress(0);
    setComputeMs(null);
    setVMin(null);
    setVMax(null);

    // Clear canvas first.
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, RES, RES);

    setTimeout(processChunk, 0);
  }, [tMax]);

  useEffect(() => {
    startCompute();
    return () => { abortRef.current += 1; };
  }, [startCompute]);

  // -------------------------------------------------------------------------
  // Overlay canvas: red dots for first 25 known zeros on sigma=1/2 line.
  // Re-drawn whenever toggle, tMax, or progress (so we redraw after compute).
  // -------------------------------------------------------------------------

  useEffect(() => {
    const c = overlayRef.current;
    if (!c) return;
    c.width = CANVAS_DISPLAY;
    c.height = CANVAS_DISPLAY;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_DISPLAY, CANVAS_DISPLAY);

    // Always draw the sigma=1/2 reference line (faint white) so users
    // can see where the critical line is even without the zeros overlay.
    const xMid = sigmaToDisplayX(0.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xMid, 0);
    ctx.lineTo(xMid, CANVAS_DISPLAY);
    ctx.stroke();

    if (showZerosOverlay) {
      const zeros = VIZ_TWIN_LADDER_TOMOGRAPHY.knownZerosOverlay.values;
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 0.75;
      for (const gamma of zeros) {
        if (gamma < T_MIN || gamma > tMax) continue;
        const px = sigmaToDisplayX(0.5);
        const py = tToDisplayY(gamma, tMax);
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }

    if (hoverInfo) {
      ctx.strokeStyle = 'rgba(255, 255, 100, 0.65)';
      ctx.lineWidth = 0.75;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(hoverInfo.px, 0);
      ctx.lineTo(hoverInfo.px, CANVAS_DISPLAY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, hoverInfo.py);
      ctx.lineTo(CANVAS_DISPLAY, hoverInfo.py);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [showZerosOverlay, tMax, progress, hoverInfo]);

  // -------------------------------------------------------------------------
  // Static derived display values.
  // -------------------------------------------------------------------------

  const tTicks = useMemo(() => {
    // 5 ticks
    const out = [];
    for (let i = 0; i <= 5; i++) {
      const t = T_MIN + (tMax - T_MIN) * i / 5;
      out.push(t);
    }
    return out;
  }, [tMax]);

  const sigmaTicks = [0.1, 0.25, 0.5, 0.75, 0.9];

  const handleCanvasMouseMove = useCallback((e) => {
    if (!pBufRef.current || progress < 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (mx < 0 || my < 0 || mx > CANVAS_DISPLAY || my > CANVAS_DISPLAY) {
      setHoverInfo(null);
      return;
    }
    const col = Math.min(RES - 1, Math.max(0, Math.floor(mx / CANVAS_DISPLAY * RES)));
    const row = Math.min(RES - 1, Math.max(0, Math.floor(my / CANVAS_DISPLAY * RES)));
    setHoverInfo({
      sigma: colToSigma(col),
      t: rowToT(row, tMax),
      p: pBufRef.current[row * RES + col],
      px: mx,
      py: my,
    });
  }, [progress, tMax]);

  const handleCanvasMouseLeave = useCallback(() => setHoverInfo(null), []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{VIZ_TWIN_LADDER_TOMOGRAPHY.title}</h1>
        <p className="page-subtitle">
          A 2D Canvas heatmap of the twin-ladder product{' '}
          <code style={{ color: '#a5b4fc' }}>P(sigma, t) = |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)|</code>{' '}
          over <code style={{ color: '#a5b4fc' }}>(sigma, t) in [{SIGMA_MIN}, {SIGMA_MAX}] x [{T_MIN}, {tMax}]</code>{' '}
          at <code style={{ color: '#a5b4fc' }}>{RES}x{RES}</code> resolution. The functional equation
          {' '}<code style={{ color: '#a5b4fc' }}>zeta(s) = chi(s) zeta(1 - s)</code>{' '}
          with <code style={{ color: '#a5b4fc' }}>|chi(1/2 + i t)| = 1</code> makes the two factors
          complex-conjugate partners on the critical line <code style={{ color: '#a5b4fc' }}>sigma = 1/2</code>,
          which then collapses to <code style={{ color: '#a5b4fc' }}>P(1/2, t) = |zeta(1/2 + i t)|^2</code>{' '}
          -- a horizontal interference minimum, punctuated by pinpoint nulls at every nontrivial
          Riemann zero <code style={{ color: '#a5b4fc' }}>gamma_n</code>.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            &larr; back to home
          </Link>
        </div>
      </div>

      {/* Controls. */}
      <div style={{
        marginTop: 18, padding: 14,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 6 }}>
            t_max window
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {T_MAX_OPTIONS.map((opt) => {
              const sel = opt === tMax;
              return (
                <button
                  key={opt}
                  onClick={() => setTMax(opt)}
                  disabled={progress > 0 && progress < 1}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    cursor: (progress > 0 && progress < 1) ? 'wait' : 'pointer',
                    opacity: (progress > 0 && progress < 1) ? 0.5 : 1,
                    background: sel ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
                    color: sel ? '#e9d5ff' : '#cbd5e1',
                    border: '1px solid ' + (sel ? '#a855f7' : 'var(--border)'),
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#cbd5e1', cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={showZerosOverlay}
            onChange={(e) => setShowZerosOverlay(e.target.checked)}
          />
          Overlay first 25 known zeros on sigma=1/2 (red dots)
        </label>

        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#94a3b8' }}>
          {progress < 1 ? (
            <span>computing... {Math.round(progress * 100)}%</span>
          ) : hoverInfo ? (
            <span>
              <strong style={{ color: '#fef08a' }}>sigma</strong> = {hoverInfo.sigma.toFixed(3)}
              {' '}&middot; <strong style={{ color: '#fef08a' }}>t</strong> = {hoverInfo.t.toFixed(3)}
              {' '}&middot; <strong style={{ color: '#fef08a' }}>P</strong> = {hoverInfo.p.toExponential(3)}
            </span>
          ) : (
            <span>
              compute: <strong style={{ color: '#86efac' }}>{computeMs != null ? (computeMs / 1000).toFixed(1) : '-'} s</strong>
              {' '}&middot; min P = <strong style={{ color: '#86efac' }}>{vMin != null ? vMin.toExponential(2) : '-'}</strong>
              {' '}&middot; max P = <strong style={{ color: '#86efac' }}>{vMax != null ? vMax.toFixed(2) : '-'}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Heatmap with overlay. */}
      <div style={{
        marginTop: 18, padding: 12,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
        display: 'flex', gap: 16,
      }}>
        {/* Y-axis (t). */}
        <div style={{
          width: 44, position: 'relative', height: CANVAS_DISPLAY,
          fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8',
        }}>
          {tTicks.map((tv) => {
            const y = tToDisplayY(tv, tMax);
            return (
              <div key={'yt-' + tv} style={{
                position: 'absolute', right: 4, top: y - 6, textAlign: 'right',
              }}>
                t={tv.toFixed(tMax >= 50 ? 0 : 1)}
              </div>
            );
          })}
        </div>

        <div
          style={{ position: 'relative', width: CANVAS_DISPLAY, height: CANVAS_DISPLAY }}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
        >
          <canvas
            ref={canvasRef}
            width={RES}
            height={RES}
            style={{
              width: CANVAS_DISPLAY,
              height: CANVAS_DISPLAY,
              imageRendering: 'pixelated',
              display: 'block',
              background: '#0f172a',
              border: '1px solid #334155',
            }}
          />
          <canvas
            ref={overlayRef}
            width={CANVAS_DISPLAY}
            height={CANVAS_DISPLAY}
            style={{
              position: 'absolute', left: 0, top: 0,
              width: CANVAS_DISPLAY, height: CANVAS_DISPLAY,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Right-side colorbar with viridis ramp. */}
        <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            width: 18, height: CANVAS_DISPLAY,
            background: 'linear-gradient(to top, '
              + '#440154, #482878, #3e4989, #31688e, #26828e, '
              + '#1f9e89, #35b779, #6ece58, #b5de2b, #fde725)',
            border: '1px solid #334155',
          }} />
          <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8' }}>
            log(1 + P)
          </div>
          <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#64748b' }}>
            (viridis)
          </div>
        </div>
      </div>

      {/* X-axis (sigma). */}
      <div style={{
        marginLeft: 60, width: CANVAS_DISPLAY, position: 'relative', height: 24,
        fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8',
      }}>
        {sigmaTicks.map((sv) => {
          const x = sigmaToDisplayX(sv);
          return (
            <div key={'xt-' + sv} style={{
              position: 'absolute',
              left: x - 18, top: 4, width: 36, textAlign: 'center',
              color: Math.abs(sv - 0.5) < 1e-9 ? '#fca5a5' : '#94a3b8',
              fontWeight: Math.abs(sv - 0.5) < 1e-9 ? 700 : 400,
            }}>
              {Math.abs(sv - 0.5) < 1e-9 ? 'sigma=1/2' : 'sigma=' + sv}
            </div>
          );
        })}
      </div>

      {/* Headline sample table. */}
      <div style={{
        marginTop: 18, padding: 12,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 8,
        }}>
          Headline samples (pre-computed at module load, used by build-time tripwires)
        </div>
        <table style={{
          width: '100%', fontFamily: 'var(--font-mono)', fontSize: 11,
          color: '#cbd5e1', borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left',  padding: '6px 8px' }}>sample</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>sigma</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>t</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>|zeta(sigma+it)|</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>|zeta((1-sigma)+it)|</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>P = product</th>
            </tr>
          </thead>
          <tbody>
            {VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples.map((r, i) => (
              <tr key={'hs-' + i} style={{ borderBottom: '1px solid rgba(71,85,105,0.3)' }}>
                <td style={{ padding: '6px 8px', color: '#e9d5ff' }}>{r.label}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.sigma.toFixed(3)}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.t.toFixed(4)}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.absZetaSigma.toExponential(3)}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.absZeta1MinusSigma.toExponential(3)}</td>
                <td style={{
                  padding: '6px 8px', textAlign: 'right',
                  color: r.product < 1e-6 ? '#86efac' : '#cbd5e1',
                  fontWeight: r.product < 1e-6 ? 700 : 400,
                }}>{r.product.toExponential(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Math + references panel. */}
      <div className="two-col" style={{ marginTop: 18 }}>
        <div className="card">
          <h3 style={{ color: '#a855f7' }}>Math: why sigma = 1/2 reads as an interference minimum</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The completed zeta function satisfies the functional equation{' '}
            <code style={{ color: '#a5b4fc' }}>zeta(s) = chi(s) zeta(1 - s)</code>{' '}
            where the phase factor <code style={{ color: '#a5b4fc' }}>chi(s)</code> has
            unit modulus exactly on the critical line:{' '}
            <code style={{ color: '#a5b4fc' }}>|chi(1/2 + i t)| = 1</code> for real t.
            Substituting s = 1/2 + i t gives{' '}
            <code style={{ color: '#a5b4fc' }}>|zeta(1/2 + i t)| = |zeta(1/2 - i t)|</code>,
            and since zeta(s_bar) = zeta(s)_bar this is the same as{' '}
            <code style={{ color: '#a5b4fc' }}>|zeta(1/2 + i t)|</code> itself.
            So along sigma = 1/2 the two factors COLLAPSE to a single magnitude squared:{' '}
            <code style={{ color: '#a5b4fc' }}>P(1/2, t) = |zeta(1/2 + i t)|^2</code>.
            Off the critical line the two factors fluctuate INDEPENDENTLY of one
            another (there is no chi-symmetry to lock them together), and their
            product is generically larger. Hence the horizontal trough at sigma = 1/2,
            and the pinpoint nulls at every (1/2, gamma_n).
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>How to read the heatmap</h3>
          <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 20 }}>
            <li>Color = <code>log(1 + P)</code> on a viridis ramp (purple = small, yellow = large).</li>
            <li>The vertical faint-white line marks sigma = 1/2.</li>
            <li>Red dots (when toggled) mark the first 25 Riemann zeros at (1/2, gamma_n).</li>
            <li>Look for the horizontal dark trough hugging sigma = 1/2 across the whole t range.</li>
            <li>Reflect the heatmap about sigma = 1/2: it must be EXACTLY symmetric (sigma -&gt; 1-sigma swap is identity on P).</li>
            <li>Off-critical bright bands appear where one of the two factors blows up while the other stays moderate.</li>
          </ul>
        </div>
      </div>

      {/* References. */}
      <div style={{
        marginTop: 18, padding: 12,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 8,
        }}>
          References
        </div>
        <ul style={{
          margin: 0, paddingLeft: 18,
          fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8', lineHeight: 1.7,
        }}>
          {VIZ_TWIN_LADDER_TOMOGRAPHY.references.map((r) => (
            <li key={r.key}>{r.citation}</li>
          ))}
        </ul>
        <div style={{
          marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10,
          color: '#94a3b8', lineHeight: 1.6,
        }}>
          Honest scope: this page is a visualization scaffold, not a proof.
          The interference-minimum reading is a qualitative consequence of the
          functional equation and is not a new result.
          The zeta evaluator is {VIZ_TWIN_LADDER_TOMOGRAPHY.zetaEvaluator}.
        </div>
      </div>
    </div>
  );
}
