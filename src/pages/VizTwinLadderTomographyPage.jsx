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
import FreshnessStamp from '../components/FreshnessStamp.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED as TK_ED, alpha } from '../styles/tokens.js';

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
// Editorial (warm) chrome styles -- literal hex, no var(). The canvas /
// overlay drawing code above (viridis table, zero-dot colors, crosshair)
// is left EXACTLY as-is; only the surrounding page chrome is re-themed.
// ---------------------------------------------------------------------------

const ED = {
  subtitle: { color: TK_ED.inkFaint, fontSize: 14, marginBottom: 4, lineHeight: 1.6 },
  code: { color: TK_ED.brass },
  panel: {
    marginTop: 18, padding: 14,
    background: TK_ED.paper2, border: '1px solid var(--rule)', borderRadius: 8,
  },
  label: { fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, color: TK_ED.inkSoft, marginBottom: 6 },
  btn: (sel) => ({
    padding: '6px 14px',
    borderRadius: 6,
    fontFamily: 'var(--ed-mono, var(--font-mono))',
    fontSize: 12,
    cursor: 'pointer',
    background: sel ? alpha(TK_ED.brass, 0.14) : alpha(TK_ED.ink, 0.03),
    color: sel ? TK_ED.brass : TK_ED.inkSoft,
    border: '1px solid ' + (sel ? TK_ED.brass : TK_ED.rule),
  }),
  checkboxLabel: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: TK_ED.inkSoft, cursor: 'pointer',
  },
  statusMono: { fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, color: TK_ED.inkFaint },
  axisLabel: { fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 10, color: TK_ED.inkFaint },
  cardTitleA: { color: TK_ED.brass },
  cardTitleB: { color: TK_ED.series1 },
  cardBody: { fontSize: 13, color: TK_ED.inkSoft, lineHeight: 1.6 },
};

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
      ctx.fillStyle = TK_ED.series2;
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
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz &middot; twin-ladder tomography</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1">{VIZ_TWIN_LADDER_TOMOGRAPHY.title} <FreshnessStamp date="2026-06-25" /></h1>
        <p style={ED.subtitle}>
          A 2D Canvas heatmap of the twin-ladder product{' '}
          <code style={ED.code}>P(sigma, t) = |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)|</code>{' '}
          over <code style={ED.code}>(sigma, t) in [{SIGMA_MIN}, {SIGMA_MAX}] x [{T_MIN}, {tMax}]</code>{' '}
          at <code style={ED.code}>{RES}x{RES}</code> resolution. The functional equation
          {' '}<code style={ED.code}>zeta(s) = chi(s) zeta(1 - s)</code>{' '}
          with <code style={ED.code}>|chi(1/2 + i t)| = 1</code> makes the two factors
          complex-conjugate partners on the critical line <code style={ED.code}>sigma = 1/2</code>,
          which then collapses to <code style={ED.code}>P(1/2, t) = |zeta(1/2 + i t)|^2</code>{' '}
          -- a horizontal interference minimum, punctuated by pinpoint nulls at every nontrivial
          Riemann zero <code style={ED.code}>gamma_n</code>.
        </p>

      {/* Controls. */}
      <div style={{ ...ED.panel, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
        <div>
          <div style={ED.label}>
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
                    ...ED.btn(sel),
                    cursor: (progress > 0 && progress < 1) ? 'wait' : 'pointer',
                    opacity: (progress > 0 && progress < 1) ? 0.5 : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <label style={ED.checkboxLabel}>
          <input
            type="checkbox"
            checked={showZerosOverlay}
            onChange={(e) => setShowZerosOverlay(e.target.checked)}
          />
          Overlay first 25 known zeros on sigma=1/2 (red dots)
        </label>

        <div style={{ marginLeft: 'auto', ...ED.statusMono }}>
          {progress < 1 ? (
            <span>computing... {Math.round(progress * 100)}%</span>
          ) : hoverInfo ? (
            <span>
              <strong style={{ color: 'var(--brass)' }}>sigma</strong> = {hoverInfo.sigma.toFixed(3)}
              {' '}&middot; <strong style={{ color: 'var(--brass)' }}>t</strong> = {hoverInfo.t.toFixed(3)}
              {' '}&middot; <strong style={{ color: 'var(--brass)' }}>P</strong> = {hoverInfo.p.toExponential(3)}
            </span>
          ) : (
            <span>
              compute: <strong style={{ color: 'var(--series-3)' }}>{computeMs != null ? (computeMs / 1000).toFixed(1) : '-'} s</strong>
              {' '}&middot; min P = <strong style={{ color: 'var(--series-3)' }}>{vMin != null ? vMin.toExponential(2) : '-'}</strong>
              {' '}&middot; max P = <strong style={{ color: 'var(--series-3)' }}>{vMax != null ? vMax.toFixed(2) : '-'}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Heatmap with overlay. */}
      <div style={{ ...ED.panel, padding: 12, display: 'flex', gap: 16 }}>
        {/* Y-axis (t). */}
        <div style={{
          width: 44, position: 'relative', height: CANVAS_DISPLAY,
          ...ED.axisLabel,
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
              background: 'var(--paper-2)',
              border: '1px solid var(--rule)',
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
              + '#1f9e89, var(--series-3), #6ece58, #b5de2b, #fde725)',
            border: '1px solid var(--rule)',
          }} />
          <div style={{ marginTop: 8, ...ED.axisLabel }}>
            log(1 + P)
          </div>
          <div style={{ marginTop: 4, fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 9, color: 'var(--ink-faint)' }}>
            (viridis)
          </div>
        </div>
      </div>

      {/* X-axis (sigma). */}
      <div style={{
        marginLeft: 60, width: CANVAS_DISPLAY, position: 'relative', height: 24,
        ...ED.axisLabel,
      }}>
        {sigmaTicks.map((sv) => {
          const x = sigmaToDisplayX(sv);
          return (
            <div key={'xt-' + sv} style={{
              position: 'absolute',
              left: x - 18, top: 4, width: 36, textAlign: 'center',
              color: Math.abs(sv - 0.5) < 1e-9 ? 'var(--accent)' : 'var(--ink-faint)',
              fontWeight: Math.abs(sv - 0.5) < 1e-9 ? 700 : 400,
            }}>
              {Math.abs(sv - 0.5) < 1e-9 ? 'sigma=1/2' : 'sigma=' + sv}
            </div>
          );
        })}
      </div>

      {/* Headline sample table. */}
      <div style={ED.panel}>
        <div style={{ ...ED.label, marginBottom: 8 }}>
          Headline samples (pre-computed at module load, used by build-time tripwires)
        </div>
        <table style={{
          width: '100%', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11,
          color: 'var(--ink-soft)', borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--rule)' }}>
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
              <tr key={'hs-' + i} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 50%, transparent)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--brass)' }}>{r.label}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.sigma.toFixed(3)}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.t.toFixed(4)}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.absZetaSigma.toExponential(3)}</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.absZeta1MinusSigma.toExponential(3)}</td>
                <td style={{
                  padding: '6px 8px', textAlign: 'right',
                  color: r.product < 1e-6 ? 'var(--series-3)' : 'var(--ink-soft)',
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
          <h3 style={ED.cardTitleA}>Math: why sigma = 1/2 reads as an interference minimum</h3>
          <p style={ED.cardBody}>
            The completed zeta function satisfies the functional equation{' '}
            <code style={ED.code}>zeta(s) = chi(s) zeta(1 - s)</code>{' '}
            where the phase factor <code style={ED.code}>chi(s)</code> has
            unit modulus exactly on the critical line:{' '}
            <code style={ED.code}>|chi(1/2 + i t)| = 1</code> for real t.
            Substituting s = 1/2 + i t gives{' '}
            <code style={ED.code}>|zeta(1/2 + i t)| = |zeta(1/2 - i t)|</code>,
            and since zeta(s_bar) = zeta(s)_bar this is the same as{' '}
            <code style={ED.code}>|zeta(1/2 + i t)|</code> itself.
            So along sigma = 1/2 the two factors COLLAPSE to a single magnitude squared:{' '}
            <code style={ED.code}>P(1/2, t) = |zeta(1/2 + i t)|^2</code>.
            Off the critical line the two factors fluctuate INDEPENDENTLY of one
            another (there is no chi-symmetry to lock them together), and their
            product is generically larger. Hence the horizontal trough at sigma = 1/2,
            and the pinpoint nulls at every (1/2, gamma_n).
          </p>
        </div>
        <div className="card">
          <h3 style={ED.cardTitleB}>How to read the heatmap</h3>
          <ul style={{ ...ED.cardBody, lineHeight: 1.7, paddingLeft: 20 }}>
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
      <div style={ED.panel}>
        <div style={{ ...ED.label, marginBottom: 8 }}>
          References
        </div>
        <ul style={{
          margin: 0, paddingLeft: 18,
          fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 10, color: 'var(--ink-faint)', lineHeight: 1.7,
        }}>
          {VIZ_TWIN_LADDER_TOMOGRAPHY.references.map((r) => (
            <li key={r.key}>{r.citation}</li>
          ))}
        </ul>
        <div style={{
          marginTop: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 10,
          color: 'var(--ink-faint)', lineHeight: 1.6,
        }}>
          Scope: this page is a visualization scaffold, not a proof.
          The interference-minimum reading is a qualitative consequence of the
          functional equation and is not a new result.
          The zeta evaluator is {VIZ_TWIN_LADDER_TOMOGRAPHY.zetaEvaluator}.
        </div>
      </div>

      {/* Footer. */}
      <div className="card" style={{ ...ED.panel, marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
            &larr; the atlas
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
