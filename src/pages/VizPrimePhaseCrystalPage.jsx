// VizPrimePhaseCrystalPage.jsx -- imp-1227
// Diffraction-style 2D pattern of |sum_p cos(j log p + k t_0)| over
// (j, k) in [0, J_MAX] x [0, K_MAX].  Renders 500 x 500 pixels via a single
// putImageData call.  Slider lets the user pick any of the first 50 Riemann
// zeros gamma_n as t_0; gamma_1 = 14.134725 is the default.
//
// The DC term at (0, 0) is exactly N_PRIMES (= 200).  Bragg-like peaks appear
// at integer harmonics of 2*pi / log p for each prime; when several primes
// resonate together the magnitude is locally large.

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VIZ_PRIME_PHASE_CRYSTAL } from '../data/viz-prime-phase-crystal.js';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

const D = VIZ_PRIME_PHASE_CRYSTAL;
const mono = 'var(--font-mono)';
const W = 500;
const H = 500;

// 256-entry "hot" colormap: black -> red -> yellow -> white.
const COLORMAP = (() => {
  const out = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    let r, g, b;
    if (x < 0.375) {
      r = Math.round(255 * (x / 0.375));
      g = 0; b = 0;
    } else if (x < 0.75) {
      r = 255;
      g = Math.round(255 * ((x - 0.375) / 0.375));
      b = 0;
    } else {
      r = 255; g = 255;
      b = Math.round(255 * ((x - 0.75) / 0.25));
    }
    out[i * 3 + 0] = r;
    out[i * 3 + 1] = g;
    out[i * 3 + 2] = b;
  }
  return out;
})();

export default function VizPrimePhaseCrystalPage() {
  const canvasRef = useRef(null);
  const [zeroIdx, setZeroIdx] = useState(0);   // index into D.zeros
  const [renderInfo, setRenderInfo] = useState({ ms: 0, dc: 0, max: 0, mean: 0 });
  const [resolution, setResolution] = useState(300);

  const t0 = D.zeros[zeroIdx];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const start = performance.now();
    const res = resolution;
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');

    // Compute the crystal directly into a Float32 buffer at the canvas
    // resolution.  Each pixel is a sum of N_PRIMES cosines -- inner loop is
    // O(res*res*N); lower resolution trades quality for speed.
    const N = D.logPrimes.length;
    const logP = D.logPrimes;
    const buf = new Float32Array(res * res);
    let maxV = 0;
    let sumV = 0;
    const jMax = D.bbox.jMax;
    const kMax = D.bbox.kMax;
    for (let py = 0; py < res; py++) {
      const k = (py / (res - 1)) * kMax;
      const ktt = k * t0;
      for (let px = 0; px < res; px++) {
        const j = (px / (res - 1)) * jMax;
        let s = 0;
        for (let i = 0; i < N; i++) {
          s += Math.cos(j * logP[i] + ktt);
        }
        const v = Math.abs(s);
        buf[py * res + px] = v;
        if (v > maxV) maxV = v;
        sumV += v;
      }
    }
    const meanV = sumV / (res * res);
    const dc    = buf[0];

    // Render into ImageData.  Use sqrt scaling for visual punch.
    const imgData = ctx.createImageData(res, res);
    const data    = imgData.data;
    const invMax  = maxV > 0 ? 1 / maxV : 0;
    for (let i = 0; i < res * res; i++) {
      const norm = Math.min(1, buf[i] * invMax);
      const idx256 = Math.min(255, Math.floor(Math.sqrt(norm) * 255));
      const cmIdx = idx256 * 3;
      const pos = i * 4;
      data[pos]     = COLORMAP[cmIdx];
      data[pos + 1] = COLORMAP[cmIdx + 1];
      data[pos + 2] = COLORMAP[cmIdx + 2];
      data[pos + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Axis labels with units and tick marks within canvas bounds.
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(220, 220, 220, 0.95)';
    ctx.textAlign = 'left';
    ctx.fillText('j=' + 0, 6, 14);
    ctx.fillText('k=' + 0, 6, res - 6);
    ctx.textAlign = 'right';
    ctx.fillText('j=' + jMax.toFixed(1), res - 6, 14);
    ctx.textAlign = 'left';
    ctx.fillText('k=' + kMax.toFixed(0), 6, res - 22);

    // Axis tick marks (4 evenly-spaced ticks per axis, excluding edges).
    ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const x = (i / 4) * res;
      ctx.beginPath();
      ctx.moveTo(x, res - 3);
      ctx.lineTo(x, res);
      ctx.stroke();
    }
    for (let i = 1; i < 4; i++) {
      const y = (i / 4) * res;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(3, y);
      ctx.stroke();
    }

    // Legend text overlay (bottom-right corner).
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(120, 120, 120, 0.85)';
    ctx.textAlign = 'right';
    ctx.fillText('F = |sum_p cos(j*log p + k*t_0)| (magnitude)', res - 4, res - 9);

    setRenderInfo({
      ms: +(performance.now() - start).toFixed(1),
      dc: +dc.toFixed(4),
      max: +maxV.toFixed(4),
      mean: +meanV.toFixed(4),
    });
  }, [t0, resolution]);

  // Re-render whenever t0 changes.  Heavy compute is ~150ms-300ms in dev so
  // we defer via requestAnimationFrame to keep slider interactions snappy.
  useEffect(() => {
    let raf = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Prime Phase Crystal (imp-1227)</h1>
        <p className="page-subtitle">
          2D diffraction pattern F(j, k) = | sum_{'{'}p in first {D.bbox.nPrimes} primes{'}'} cos(j * log p + k * t_0) |
          on (j, k) in [0, {D.bbox.jMax}] x [0, {D.bbox.kMax}], with t_0 a tunable
          Riemann zero.  The Bragg-like peaks arise where several primes resonate
          together.  Reference data + tripwires live in
          <code> src/data/viz-prime-phase-crystal.js</code>; the renderer here computes
          a {W} x {H} buffer and blits it via a single putImageData.
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/explorations" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            &larr; Explorations
          </Link>
          <Link to="/viz-prime-caustic" style={{ color: '#a855f7', fontFamily: mono, fontSize: 12 }}>
            &larr; Prime Caustic (imp-1225)
          </Link>
          <Link to="/zeta" style={{ color: '#0891b2', fontFamily: mono, fontSize: 12 }}>
            Zeta visualisation
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
        gap: 12,
      }}>
        <Stat label="N primes"           value={String(D.bbox.nPrimes)} />
        <Stat label="t_0 (zero #)"       value={'gamma_' + (zeroIdx + 1)} accent="#c4b5fd" />
        <Stat label="t_0 value"          value={t0.toFixed(4)} />
        <Stat label="DC value (= N)"     value={renderInfo.dc.toFixed(2)} />
        <Stat label="max rendered"       value={renderInfo.max.toFixed(2)} />
        <Stat label="mean rendered"      value={renderInfo.mean.toFixed(2)} />
        <Stat label="render time (ms)"   value={renderInfo.ms.toString()} />
        <Stat label="secondary peaks"    value={String(D.secondaryPeakCount)} />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <div className="control-group" style={{ minWidth: 360 }}>
          <label>Riemann zero t_0 = gamma_{zeroIdx + 1}</label>
          <input type="range" min="0" max={D.zeros.length - 1} step="1" value={zeroIdx}
                 onChange={e => setZeroIdx(+e.target.value)} />
          <span className="control-value">{t0.toFixed(4)}</span>
        </div>
        <div className="control-group" style={{ minWidth: 280 }}>
          <label>Resolution: {resolution} x {resolution} px ({((resolution * resolution * D.logPrimes.length) / 1e6).toFixed(1)}M ops)</label>
          <input type="range" min="100" max="500" step="50" value={resolution}
                 onChange={e => setResolution(+e.target.value)} />
          <span className="control-value">{renderInfo.ms} ms</span>
        </div>
      </div>

      <div style={{ marginTop: 16, background: 'var(--bg-panel)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 12, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <canvas ref={canvasRef}
                  style={{ width: '100%', maxWidth: W, height: 'auto',
                           border: '1px solid #1e293b', borderRadius: 4,
                           imageRendering: 'pixelated', display: 'block' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 80 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.4 }}>
            magnitude
          </div>
          <div style={{
            width: 24, height: W, background: 'linear-gradient(to top, '
              + '#000000, #330000, #660000, #990000, #cc0000, #ff0000, #ff3300, #ff6600, #ff9900, #ffcc00, #ffff00, #ffffff)',
            border: '1px solid #1e293b', borderRadius: 2,
          }} />
          <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 4 }}>
            <div style={{ fontSize: 8, color: '#cbd5e1' }}>max</div>
            <div style={{ fontSize: 8, color: '#cbd5e1', marginTop: 4 }}>{renderInfo.max}</div>
            <div style={{ fontSize: 8, color: '#64748b', marginTop: 12 }}>0</div>
          </div>
          <div style={{ fontSize: 8, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>
            hot colormap sqrt(norm)
          </div>
        </div>
      </div>

      {/* Live numerical self-check: the rendered (0,0) DC term must equal
          N_PRIMES exactly (every cosine is 1 at the origin).  Read back the
          measured value and assert PASS/FAIL within float tolerance. */}
      {(() => {
        const N = D.bbox.nPrimes;
        const dcErr = Math.abs(renderInfo.dc - N);
        const pass = dcErr < 1e-6;
        return (
          <div style={{
            marginTop: 10,
            fontFamily: mono,
            fontSize: 11,
            padding: '7px 10px',
            borderRadius: 6,
            border: '1px solid ' + (pass ? '#15803d' : '#b91c1c'),
            background: pass ? 'rgba(22, 101, 52, 0.14)' : 'rgba(185, 28, 28, 0.14)',
            color: pass ? '#86efac' : '#fca5a5',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <strong>{pass ? 'PASS' : 'FAIL'}</strong>
            <span>DC F(0,0) = {renderInfo.dc.toFixed(6)} vs N_PRIMES = {N} (|err| = {dcErr.toExponential(2)}, tol 1e-6)</span>
            <span style={{ color: 'var(--text-muted)' }}>max = {renderInfo.max.toFixed(4)}</span>
            <span style={{ color: 'var(--text-muted)' }}>mean = {renderInfo.mean.toFixed(4)}</span>
          </div>
        );
      })()}

      <div className="card" style={{ marginTop: 14, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 8 }}>
          j = 0 column closed-form check (reference grid)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'right', padding: 6 }}>k</th>
                <th style={{ textAlign: 'right', padding: 6 }}>observed</th>
                <th style={{ textAlign: 'right', padding: 6 }}>predicted N * |cos(k t_0)|</th>
                <th style={{ textAlign: 'right', padding: 6 }}>|err|</th>
              </tr>
            </thead>
            <tbody>
              {D.j0ColumnCheck.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, textAlign: 'right', color: '#a855f7' }}>{r.k.toFixed(3)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.observed.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#86efac' }}>{r.predicted.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#fbbf24' }}>
                    {Math.abs(r.observed - r.predicted).toExponential(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-muted)' }}>
            Tripwire lock: max |err| over the column = {D.j0ColumnMaxErr.toExponential(2)} (must be &lt; 1e-8).
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 8 }}>
          DC invariance across the first 5 zeros
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'right', padding: 6 }}>gamma_n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>DC = F(0, 0)</th>
                <th style={{ textAlign: 'right', padding: 6 }}>matches N = {D.bbox.nPrimes}?</th>
              </tr>
            </thead>
            <tbody>
              {D.dcAcrossZeros.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, textAlign: 'right', color: '#a855f7' }}>{r.t0.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.dc.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right',
                               color: Math.abs(r.dc - D.bbox.nPrimes) < 1e-9 ? '#86efac' : '#fca5a5' }}>
                    {Math.abs(r.dc - D.bbox.nPrimes) < 1e-9 ? 'yes' : 'NO'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <strong style={{ color: '#cbd5e1' }}>Reading the pattern.</strong> The bright
        corner at (0, 0) is the DC term: every cosine equals 1, summing to N = {D.bbox.nPrimes}.
        Bragg-like peaks appear at integer harmonics of 2*pi / log p for each prime;
        when several primes resonate simultaneously the peak is brighter. Sliding t_0
        across the Riemann zeros translates the pattern along k, because k * t_0 is
        the same affine phase term added to every cosine.  Render cost is dominated
        by the inner sum: O(W * H * N) = O(500 * 500 * 200) = ~50M cosines per redraw,
        held to ~100-300 ms in dev via a tight hoisted loop.
      </div>

      <VizCeilingNote
        as="div"
        claim="the Bragg-like peaks re-derive the Δn ≈ (2π/t)·n diffraction lattice of prime phases"
      />
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
      <div style={{ marginTop: 4, fontSize: 18, fontFamily: mono, color: accent || '#e2e8f0' }}>
        {value}
      </div>
    </div>
  );
}
