// VizPrimePhaseCrystalPage.jsx -- imp-1227
// Diffraction-style 2D pattern of |sum_p cos(j log p + k t_0)| over
// (j, k) in [0, J_MAX] x [0, K_MAX].  Renders 500 x 500 pixels via a single
// putImageData call.  Slider lets the user pick any of the first 50 Riemann
// zeros gamma_n as t_0; gamma_1 = 14.134725 is the default.
//
// The DC term at (0, 0) is exactly N_PRIMES (= 200).  Bragg-like peaks appear
// at integer harmonics of 2*pi / log p for each prime; when several primes
// resonate together the magnitude is locally large.
//
// Editorial (warm) re-theme: chrome only. Canvas render logic/math untouched;
// the canvas is drawn onto a literal warm background and axis/legend text is
// recolored to literal warm hex. Claims/caveats verbatim.

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VIZ_PRIME_PHASE_CRYSTAL } from '../data/viz-prime-phase-crystal.js';
import VizCeilingNote from '../components/VizCeilingNote.jsx';
import ZeroStepper from '../components/ZeroStepper.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

const D = VIZ_PRIME_PHASE_CRYSTAL;
const mono = 'var(--ed-mono)';
const W = 500;
const H = 500;

// Fixed per-prime random shifts in [-1, 1] for the rigidity perturbation demo.
// Seeded deterministically so the smearing is reproducible across renders.
const PERTURB_SHIFTS = (() => {
  const N = D.logPrimes.length;
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    out[i] = ((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1 * 2 - 1;
  }
  return out;
})();

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
  const [perturbEnabled, setPerturbEnabled] = useState(false);
  const [perturbEps, setPerturbEps] = useState(0.02);

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
    // When perturbed, replace log(p_i) with log(p_i) + eps * shift_i so that
    // Bragg peaks smear: arithmetic structure is broken and incoherent sums dominate.
    const logP = perturbEnabled && perturbEps > 0
      ? Float32Array.from(D.logPrimes, (lp, i) => lp + perturbEps * PERTURB_SHIFTS[i])
      : D.logPrimes;
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
    ctx.fillStyle = alpha(ED.paper2, 0.95);
    ctx.textAlign = 'left';
    ctx.fillText('j=' + 0, 6, 14);
    ctx.fillText('k=' + 0, 6, res - 6);
    ctx.textAlign = 'right';
    ctx.fillText('j=' + jMax.toFixed(1), res - 6, 14);
    ctx.textAlign = 'left';
    ctx.fillText('k=' + kMax.toFixed(0), 6, res - 22);

    // Axis tick marks (4 evenly-spaced ticks per axis, excluding edges).
    ctx.strokeStyle = alpha(ED.paper2, 0.5);
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
    ctx.fillStyle = alpha(ED.paper2, 0.85);
    ctx.textAlign = 'right';
    ctx.fillText(perturbEnabled ? ('F perturbed eps=' + perturbEps.toFixed(3)) : 'F = |sum_p cos(j*log p + k*t_0)|', res - 4, res - 9);

    setRenderInfo({
      ms: +(performance.now() - start).toFixed(1),
      dc: +dc.toFixed(4),
      max: +maxV.toFixed(4),
      mean: +meanV.toFixed(4),
    });
  }, [t0, resolution, perturbEnabled, perturbEps]);

  // Re-render whenever t0 changes.  Heavy compute is ~150ms-300ms in dev so
  // we defer via requestAnimationFrame to keep slider interactions snappy.
  useEffect(() => {
    let raf = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz &middot; prime phase crystal</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div className="ed-lbl">/viz-prime-phase-crystal &middot; visualizations</div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>Prime Phase Crystal (imp-1227)</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
            2D diffraction pattern F(j, k) = | sum_{'{'}p in first {D.bbox.nPrimes} primes{'}'} cos(j * log p + k * t_0) |
            on (j, k) in [0, {D.bbox.jMax}] x [0, {D.bbox.kMax}], with t_0 a tunable
            Riemann zero.  The Bragg-like peaks arise where several primes resonate
            together.  Reference data + tripwires live in
            <code> src/data/viz-prime-phase-crystal.js</code>; the renderer here computes
            a {W} x {H} buffer and blits it via a single putImageData.
          </p>
          <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/explorations" style={{ color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>
              &larr; Explorations
            </Link>
            <Link to="/viz-prime-caustic" style={{ color: 'var(--terra-dk)', fontFamily: mono, fontSize: 12 }}>
              &larr; Prime Caustic (imp-1225)
            </Link>
            <Link to="/zeta" style={{ color: 'var(--blue)', fontFamily: mono, fontSize: 12 }}>
              Zeta visualisation
            </Link>
          </div>
        </header>

        <div style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
          gap: 12,
        }}>
          <Stat label="N primes"           value={String(D.bbox.nPrimes)} />
          <Stat label="t_0 (zero #)"       value={'gamma_' + (zeroIdx + 1)} accent="var(--brass)" />
          <Stat label="t_0 value"          value={t0.toFixed(4)} />
          <Stat label="DC value (= N)"     value={renderInfo.dc.toFixed(2)} />
          <Stat label="max rendered"       value={renderInfo.max.toFixed(2)} />
          <Stat label="mean rendered"      value={renderInfo.mean.toFixed(2)} />
          <Stat label="render time (ms)"   value={renderInfo.ms.toString()} />
          <Stat label="secondary peaks"    value={String(D.secondaryPeakCount)} />
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <div className="card" style={{ padding: 12, minWidth: 360 }}>
            <label style={{ color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>Riemann zero t_0</label>
            <div style={{ marginTop: 6 }}>
              <ZeroStepper gammas={D.zeros} idx={zeroIdx} onChange={setZeroIdx} />
            </div>
          </div>
          <div className="card" style={{ padding: 12, minWidth: 280 }}>
            <label style={{ color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>
              Resolution: {resolution} x {resolution} px ({((resolution * resolution * D.logPrimes.length) / 1e6).toFixed(1)}M ops)
            </label>
            <input type="range" min="100" max="500" step="50" value={resolution}
                   onChange={e => setResolution(+e.target.value)}
                   style={{ width: '100%', marginTop: 6 }} />
            <span style={{ color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>{renderInfo.ms} ms</span>
          </div>
          <div className="card" style={{
            padding: 12, minWidth: 340,
            borderLeft: '2px solid ' + (perturbEnabled ? 'var(--terra-dk)' : 'var(--hairline)'),
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>
              <input type="checkbox" checked={perturbEnabled} onChange={e => setPerturbEnabled(e.target.checked)} />
              <span style={{ color: perturbEnabled ? 'var(--terra-dk)' : 'var(--ink-soft)' }}>
                Rigidity toggle: perturb primes p &rarr; p&middot;(1+&epsilon;&middot;&xi;)
              </span>
            </label>
            <input type="range" min="0" max="0.1" step="0.001" value={perturbEps}
                   disabled={!perturbEnabled}
                   onChange={e => setPerturbEps(+e.target.value)}
                   style={{ width: '100%', marginTop: 6 }} />
            <span style={{ fontFamily: mono, fontSize: 12, color: perturbEnabled ? 'var(--terra-dk)' : 'var(--ink-soft)' }}>
              &epsilon; = {perturbEps.toFixed(3)} {perturbEnabled ? '(peaks smearing)' : '(disabled)'}
            </span>
          </div>
        </div>

        <div className="card" style={{
          marginTop: 16, padding: 12, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-start',
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <canvas ref={canvasRef}
                    style={{ width: '100%', maxWidth: W, height: 'auto',
                             border: '1px solid var(--rule)', borderRadius: 4,
                             imageRendering: 'pixelated', display: 'block' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 80 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.4, fontFamily: mono }}>
              magnitude
            </div>
            <div style={{
              width: 24, height: W, background: 'linear-gradient(to top, '
                + '#000000, #330000, #660000, #990000, #cc0000, #ff0000, #ff3300, var(--series-4), #ff9900, var(--series-4), #ffff00, #ffffff)',
              border: '1px solid var(--rule)', borderRadius: 2,
            }} />
            <div style={{ fontSize: 9, color: 'var(--ink-soft)', textAlign: 'center', paddingTop: 4, fontFamily: mono }}>
              <div style={{ fontSize: 8, color: 'var(--ink)' }}>max</div>
              <div style={{ fontSize: 8, color: 'var(--ink)', marginTop: 4 }}>{renderInfo.max}</div>
              <div style={{ fontSize: 8, color: 'var(--faint)', marginTop: 12 }}>0</div>
            </div>
            <div style={{ fontSize: 8, color: 'var(--faint)', textAlign: 'center', marginTop: 8, lineHeight: 1.4, fontFamily: mono }}>
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
              border: '1px solid ' + (pass ? 'var(--green)' : 'var(--terra-dk)'),
              background: pass ? 'color-mix(in srgb, var(--series-3) 12%, transparent)' : 'color-mix(in srgb, var(--series-2) 12%, transparent)',
              color: pass ? 'var(--green)' : 'var(--terra-dk)',
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <strong>{pass ? 'PASS' : 'FAIL'}</strong>
              <span>DC F(0,0) = {renderInfo.dc.toFixed(6)} vs N_PRIMES = {N} (|err| = {dcErr.toExponential(2)}, tol 1e-6)</span>
              <span style={{ color: 'var(--ink-soft)' }}>max = {renderInfo.max.toFixed(4)}</span>
              <span style={{ color: 'var(--ink-soft)' }}>mean = {renderInfo.mean.toFixed(4)}</span>
            </div>
          );
        })()}

        <div className="card" style={{ marginTop: 14, padding: 14 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--faint)',
                        letterSpacing: 0.5, marginBottom: 8, fontFamily: mono }}>
            j = 0 column closed-form check (reference grid)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
              <thead>
                <tr style={{ background: 'var(--paper2)' }}>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>k</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>observed</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>predicted N * |cos(k t_0)|</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>|err|</th>
                </tr>
              </thead>
              <tbody>
                {D.j0ColumnCheck.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--hairline)' }}>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--brass)' }}>{r.k.toFixed(3)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.observed.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--green)' }}>{r.predicted.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--brass-dk)' }}>
                      {Math.abs(r.observed - r.predicted).toExponential(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 6, fontSize: 10, color: 'var(--faint)', fontFamily: mono }}>
              Tripwire lock: max |err| over the column = {D.j0ColumnMaxErr.toExponential(2)} (must be &lt; 1e-8).
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14, padding: 14 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--faint)',
                        letterSpacing: 0.5, marginBottom: 8, fontFamily: mono }}>
            DC invariance across the first 5 zeros
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
              <thead>
                <tr style={{ background: 'var(--paper2)' }}>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>gamma_n</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>DC = F(0, 0)</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>matches N = {D.bbox.nPrimes}?</th>
                </tr>
              </thead>
              <tbody>
                {D.dcAcrossZeros.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--hairline)' }}>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--brass)' }}>{r.t0.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.dc.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'right',
                                 color: Math.abs(r.dc - D.bbox.nPrimes) < 1e-9 ? 'var(--green)' : 'var(--terra-dk)' }}>
                      {Math.abs(r.dc - D.bbox.nPrimes) < 1e-9 ? 'yes' : 'NO'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ink)' }}>Reading the pattern.</strong> The bright
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

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: mono }}>Sibling visualizations:</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/viz-prime-caustic" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/viz-prime-caustic</Link>
            <Link to="/viz-hyperbolic-prime-spiral" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/viz-hyperbolic-prime-spiral</Link>
            <Link to="/zeta" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/zeta</Link>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13 }}>&larr; the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="card" style={{ padding: 10 }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, fontFamily: mono }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 18, fontFamily: mono, color: accent || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
