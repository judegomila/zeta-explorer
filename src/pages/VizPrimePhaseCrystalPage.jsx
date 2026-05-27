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

  const t0 = D.zeros[zeroIdx];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const start = performance.now();
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Compute the crystal directly into a Float32 buffer at the canvas
    // resolution.  Each pixel is a sum of N_PRIMES cosines -- the inner loop
    // hits ~50,000,000 ops for 500x500x200 so we hoist log p outside.
    const N = D.logPrimes.length;
    const logP = D.logPrimes;
    const buf = new Float32Array(W * H);
    let maxV = 0;
    let sumV = 0;
    const jMax = D.bbox.jMax;
    const kMax = D.bbox.kMax;
    for (let py = 0; py < H; py++) {
      const k = (py / (H - 1)) * kMax;
      const ktt = k * t0;
      for (let px = 0; px < W; px++) {
        const j = (px / (W - 1)) * jMax;
        let s = 0;
        for (let i = 0; i < N; i++) {
          s += Math.cos(j * logP[i] + ktt);
        }
        const v = Math.abs(s);
        buf[py * W + px] = v;
        if (v > maxV) maxV = v;
        sumV += v;
      }
    }
    const meanV = sumV / (W * H);
    const dc    = buf[0];

    // Render into ImageData.  Use sqrt scaling for visual punch.
    const imgData = ctx.createImageData(W, H);
    const data    = imgData.data;
    const invMax  = maxV > 0 ? 1 / maxV : 0;
    for (let i = 0; i < W * H; i++) {
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

    // Axis labels.
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('j = 0', 4, H - 6);
    ctx.fillText('k = 0', 4, 14);
    ctx.textAlign = 'right';
    ctx.fillText('j = ' + jMax, W - 4, H - 6);
    ctx.textAlign = 'left';
    ctx.fillText('k = ' + kMax, 4, H - 22);

    setRenderInfo({
      ms: +(performance.now() - start).toFixed(1),
      dc: +dc.toFixed(4),
      max: +maxV.toFixed(4),
      mean: +meanV.toFixed(4),
    });
  }, [t0]);

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
      </div>

      <div style={{ marginTop: 16, background: 'var(--bg-panel)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef}
                style={{ width: '100%', maxWidth: W, height: 'auto',
                         border: '1px solid #1e293b', borderRadius: 4,
                         imageRendering: 'pixelated' }} />
      </div>

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
