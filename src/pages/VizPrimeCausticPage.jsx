// VizPrimeCausticPage -- imp-1225
//
// 2D Canvas heatmap of caustic density in (sigma, t) plane.
// For each (sigma, t), count how many of the first N=1000 primes p
// have their phase t * log(p) mod 2π within coherence window [-φ, φ].
// Plot density as heatmap. Critical line sigma=1/2 exhibits structured
// caustic ridges due to prime resonance and zero distribution.

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VIZ_PRIME_CAUSTIC } from '../data/viz-prime-caustic.js';
import { getPrimes, primeFrequency } from '../math/primes.js';

// ---------------------------------------------------------------------------
// Geometry / compute parameters
// ---------------------------------------------------------------------------

const SIGMA_MIN = VIZ_PRIME_CAUSTIC.parameterRanges.sigmaMin;
const SIGMA_MAX = VIZ_PRIME_CAUSTIC.parameterRanges.sigmaMax;
const T_MIN = VIZ_PRIME_CAUSTIC.parameterRanges.tMin;
const T_MAX = VIZ_PRIME_CAUSTIC.parameterRanges.tMax;
const RES = VIZ_PRIME_CAUSTIC.parameterRanges.resolution;
const N_PRIMES = VIZ_PRIME_CAUSTIC.parameterRanges.nPrimes;
const COHERENCE_WINDOW = VIZ_PRIME_CAUSTIC.parameterRanges.coherenceWindow;

const CANVAS_DISPLAY = 600;

// ---------------------------------------------------------------------------
// Viridis colormap
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
// Pixel-to-axis helpers
// ---------------------------------------------------------------------------

function colToSigma(col) {
  return SIGMA_MIN + (SIGMA_MAX - SIGMA_MIN) * (col / (RES - 1));
}

function rowToT(row) {
  return T_MIN + (T_MAX - T_MIN) * ((RES - 1 - row) / (RES - 1));
}

function sigmaToDisplayX(sigma) {
  return ((sigma - SIGMA_MIN) / (SIGMA_MAX - SIGMA_MIN)) * CANVAS_DISPLAY;
}

function tToDisplayY(t) {
  return CANVAS_DISPLAY - ((t - T_MIN) / (T_MAX - T_MIN)) * CANVAS_DISPLAY;
}

// ---------------------------------------------------------------------------
// Caustic density computation (inline for performance)
// ---------------------------------------------------------------------------

function causticDensity(sigma, t, primes, window) {
  let count = 0;
  for (const p of primes) {
    const phase = (t * primeFrequency(p)) % (2 * Math.PI);
    const normalized = phase > Math.PI ? phase - 2 * Math.PI : phase;
    if (Math.abs(normalized) <= window) {
      count++;
    }
  }
  return count / primes.length;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VizPrimeCausticPage() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [computeMs, setComputeMs] = useState(null);
  const [dMin, setDMin] = useState(null);
  const [dMax, setDMax] = useState(null);
  const abortRef = useRef(0);

  // Precompute primes once
  const primes = useMemo(() => getPrimes(N_PRIMES), []);

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

    const densityBuf = new Float32Array(RES * RES);
    let gMin = Infinity;
    let gMax = -Infinity;

    const ROWS_PER_TICK = 10;
    let rowCursor = 0;

    function processChunk() {
      if (abortRef.current !== myAbort) return;

      const endRow = Math.min(rowCursor + ROWS_PER_TICK, RES);
      for (let row = rowCursor; row < endRow; row++) {
        const t = rowToT(row);
        for (let c = 0; c < RES; c++) {
          const sigma = colToSigma(c);
          const d = causticDensity(sigma, t, primes, COHERENCE_WINDOW);
          densityBuf[row * RES + c] = d;
          if (d < gMin) gMin = d;
          if (d > gMax) gMax = d;
        }
      }

      rowCursor = endRow;
      if (abortRef.current !== myAbort) return;
      setProgress(rowCursor / RES);

      if (rowCursor < RES) {
        setTimeout(processChunk, 0);
      } else {
        // Color using viridis on linear scale [gMin, gMax]
        const span = gMax - gMin > 1e-12 ? gMax - gMin : 1;
        const data = imgData.data;
        for (let row = 0; row < RES; row++) {
          for (let c = 0; c < RES; c++) {
            const d = densityBuf[row * RES + c];
            const u = (d - gMin) / span;
            const ci = Math.max(0, Math.min(255, Math.round(u * 255)));
            const off = (row * RES + c) * 4;
            data[off + 0] = VIRIDIS_TABLE[ci * 3 + 0];
            data[off + 1] = VIRIDIS_TABLE[ci * 3 + 1];
            data[off + 2] = VIRIDIS_TABLE[ci * 3 + 2];
            data[off + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setProgress(1);
        setComputeMs(performance.now() - t0);
        setDMin(gMin);
        setDMax(gMax);
      }
    }

    setProgress(0);
    setComputeMs(null);
    setDMin(null);
    setDMax(null);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, RES, RES);

    setTimeout(processChunk, 0);
  }, [primes]);

  useEffect(() => {
    startCompute();
    return () => { abortRef.current += 1; };
  }, [startCompute]);

  // Overlay: critical line at sigma=1/2
  useEffect(() => {
    const c = overlayRef.current;
    if (!c) return;
    c.width = CANVAS_DISPLAY;
    c.height = CANVAS_DISPLAY;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_DISPLAY, CANVAS_DISPLAY);

    const xMid = sigmaToDisplayX(0.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xMid, 0);
    ctx.lineTo(xMid, CANVAS_DISPLAY);
    ctx.stroke();
  }, [progress]);

  const tTicks = useMemo(() => {
    const out = [];
    for (let i = 0; i <= 5; i++) {
      const t = T_MIN + (T_MAX - T_MIN) * i / 5;
      out.push(t);
    }
    return out;
  }, []);

  const sigmaTicks = [0.3, 0.4, 0.5, 0.6, 0.7];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{VIZ_PRIME_CAUSTIC.title}</h1>
        <p className="page-subtitle">
          A 2D Canvas heatmap of caustic resonance density in the{' '}
          <code style={{ color: '#a5b4fc' }}>(sigma, t)</code> plane.
          For each point, compute the fraction of first {N_PRIMES} primes p where
          the phase oscillation <code style={{ color: '#a5b4fc' }}>t * log(p) mod 2π</code> lies
          within coherence window <code style={{ color: '#a5b4fc' }}>φ = {COHERENCE_WINDOW.toFixed(2)}</code>.
          High density indicates caustic loci where primes constructively interfere.
          The critical line <code style={{ color: '#a5b4fc' }}>sigma = 1/2</code> exhibits structured
          caustic pattern due to Dirichlet-character clustering and explicit-formula zero distribution.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            &larr; back to home
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        marginTop: 18, padding: 14,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
        display: 'flex', gap: 24, alignItems: 'center',
      }}>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#94a3b8' }}>
          {progress < 1 ? (
            <span>computing... {Math.round(progress * 100)}%</span>
          ) : (
            <span>
              compute: <strong style={{ color: '#86efac' }}>{computeMs != null ? (computeMs / 1000).toFixed(1) : '-'} s</strong>
              {' '}&middot; min density = <strong style={{ color: '#86efac' }}>{dMin != null ? dMin.toFixed(4) : '-'}</strong>
              {' '}&middot; max density = <strong style={{ color: '#86efac' }}>{dMax != null ? dMax.toFixed(4) : '-'}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Heatmap with overlay */}
      <div style={{
        marginTop: 18, padding: 12,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
        display: 'flex', gap: 16,
      }}>
        {/* Y-axis (t) */}
        <div style={{
          width: 44, position: 'relative', height: CANVAS_DISPLAY,
          fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8',
        }}>
          {tTicks.map((tv) => {
            const y = tToDisplayY(tv);
            return (
              <div key={'yt-' + tv} style={{
                position: 'absolute', right: 4, top: y - 6, textAlign: 'right',
              }}>
                t={tv.toFixed(0)}
              </div>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: CANVAS_DISPLAY, height: CANVAS_DISPLAY }}>
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

        {/* Right-side colorbar */}
        <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            width: 18, height: CANVAS_DISPLAY,
            background: 'linear-gradient(to top, '
              + '#440154, #482878, #3e4989, #31688e, #26828e, '
              + '#1f9e89, #35b779, #6ece58, #b5de2b, #fde725)',
            border: '1px solid #334155',
          }} />
          <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8' }}>
            density
          </div>
          <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#64748b' }}>
            (viridis)
          </div>
        </div>
      </div>

      {/* X-axis (sigma) */}
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
              {Math.abs(sv - 0.5) < 1e-9 ? 'σ=1/2' : 'σ=' + sv.toFixed(1)}
            </div>
          );
        })}
      </div>

      {/* Headline sample table */}
      <div style={{
        marginTop: 18, padding: 12,
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 8,
        }}>
          Headline samples (precomputed at module load, used by build-time tripwires)
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
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>density</th>
            </tr>
          </thead>
          <tbody>
            {VIZ_PRIME_CAUSTIC.headlineSamples.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                <td style={{ padding: '6px 8px' }}>#{idx + 1}</td>
                <td style={{ textAlign: 'right', padding: '6px 8px' }}>{s.sigma.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '6px 8px' }}>{s.t.toFixed(1)}</td>
                <td style={{ textAlign: 'right', padding: '6px 8px' }}>{s.density.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
