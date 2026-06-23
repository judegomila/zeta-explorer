// VizEulerProductPage.jsx -- imp-2718
// True-vs-Perturbed Euler product comparison.
//
// Shows log|Π_{p<=P_N} (1-p^{-s})^{-1}| on the critical line s=1/2+it alongside
// a perturbed product where each log p is shifted by a small epsilon_p. The
// true product has near-zeros near the known zeta zeros; perturbing the log p
// values smears/destroys them -- arithmetic rigidity of primes locks the zeros.

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

const mono = 'var(--font-mono)';
const T_MIN = 10;
const T_MAX = 100;
const N_STEPS = 720;
const CW = 720;
const CH = 300;

// First 10 known zeta zero heights (Imaginary parts, accurate to 2 d.p.).
const KNOWN_ZEROS = [14.13, 21.02, 25.01, 30.42, 32.93, 37.59, 40.92, 43.33, 48.00, 49.77];

function sieve(limit) {
  const s = new Uint8Array(limit + 1);
  const out = [];
  for (let i = 2; i <= limit; i++) {
    if (!s[i]) { out.push(i); for (let j = i * i; j <= limit; j += i) s[j] = 1; }
  }
  return out;
}

const ALL_PRIMES = sieve(5000);
const ALL_LOG_P  = ALL_PRIMES.map(p => Math.log(p));

// Compute log|Π_{k<N} (1-exp(-s*lp_k))^{-1}| for s=sigma+it.
// logPrimes[k] replaces log(p_k) so perturbed versions are easy.
function logMag(logPrimes, sigma, t) {
  let sum = 0;
  for (let k = 0; k < logPrimes.length; k++) {
    const lp = logPrimes[k];
    const pw = Math.exp(-sigma * lp); // |p|^{-sigma}
    const re = 1 - pw * Math.cos(t * lp);
    const im =     pw * Math.sin(t * lp);
    // avoid log(0) at exact cancellation
    const mag2 = re * re + im * im;
    if (mag2 > 1e-30) sum -= 0.5 * Math.log(mag2);
  }
  return sum; // log|Z|
}

// Linear congruential PRNG seeded by integer seed.
function seededRand(n, eps, seed) {
  const out = new Float64Array(n);
  let s = (seed ^ 0xcafebabe) & 0x7fffffff;
  for (let i = 0; i < n; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) & 0x7fffffff;
    out[i] = (s / 0x7fffffff - 0.5) * 2 * eps;
  }
  return out;
}

function buildCurve(logPrimes) {
  const vals = new Float64Array(N_STEPS);
  for (let i = 0; i < N_STEPS; i++) {
    const t = T_MIN + (i / (N_STEPS - 1)) * (T_MAX - T_MIN);
    vals[i] = logMag(logPrimes, 0.5, t);
  }
  return vals;
}

// Draw a line curve on a canvas given Float64Array vals and a y range.
function drawCurve(ctx, vals, yMin, yMax, color, lineW) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineW;
  for (let i = 0; i < vals.length; i++) {
    const x = (i / (vals.length - 1)) * CW;
    const y = CH - ((vals[i] - yMin) / (yMax - yMin)) * CH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

export default function VizEulerProductPage() {
  const canvasRef = useRef(null);
  const [nPrimes, setNPrimes] = useState(80);
  const [epsVal, setEpsVal] = useState(0.3);
  const [seed, setSeed] = useState(42);
  const [renderMs, setRenderMs] = useState(0);

  const logPrimes = useMemo(() => ALL_LOG_P.slice(0, nPrimes), [nPrimes]);

  const pertLogPrimes = useMemo(() => {
    const epsilons = seededRand(nPrimes, epsVal, seed);
    return logPrimes.map((lp, k) => lp + epsilons[k]);
  }, [logPrimes, nPrimes, epsVal, seed]);

  const trueVals = useMemo(() => buildCurve(logPrimes), [logPrimes]);
  const pertVals = useMemo(() => buildCurve(pertLogPrimes), [pertLogPrimes]);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const t0 = performance.now();
    cv.width = CW; cv.height = CH;
    const ctx = cv.getContext('2d');

    ctx.fillStyle = '#07080f';
    ctx.fillRect(0, 0, CW, CH);

    // Compute shared y range.
    let yMin = Infinity, yMax = -Infinity;
    for (let i = 0; i < N_STEPS; i++) {
      yMin = Math.min(yMin, trueVals[i], pertVals[i]);
      yMax = Math.max(yMax, trueVals[i], pertVals[i]);
    }
    const pad = (yMax - yMin) * 0.08;
    yMin -= pad; yMax += pad;

    // Zero-line.
    const zeroY = CH - ((0 - yMin) / (yMax - yMin)) * CH;
    ctx.strokeStyle = 'rgba(148,163,184,0.2)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, zeroY); ctx.lineTo(CW, zeroY); ctx.stroke();
    ctx.setLineDash([]);

    // Known zero vertical markers.
    ctx.strokeStyle = 'rgba(250,200,50,0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(250,200,50,0.55)';
    for (const z of KNOWN_ZEROS) {
      if (z < T_MIN || z > T_MAX) continue;
      const x = ((z - T_MIN) / (T_MAX - T_MIN)) * CW;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
      ctx.fillText(z.toFixed(0), x + 2, 12);
    }
    ctx.setLineDash([]);

    // Perturbed curve (red, drawn first so true overlaps it).
    drawCurve(ctx, pertVals, yMin, yMax, 'rgba(239,68,68,0.75)', 1.2);
    // True curve (blue).
    drawCurve(ctx, trueVals, yMin, yMax, 'rgba(99,179,237,1)', 1.6);

    // Axis labels.
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('t=' + T_MIN, 3, CH - 4);
    ctx.textAlign = 'right';
    ctx.fillText('t=' + T_MAX, CW - 3, CH - 4);
    ctx.textAlign = 'left';
    ctx.fillText('log|Z|', 3, 20);

    setRenderMs(+(performance.now() - t0).toFixed(1));
  }, [trueVals, pertVals]);

  useEffect(() => { draw(); }, [draw]);

  const pMax = ALL_PRIMES[nPrimes - 1] || 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>True vs Perturbed Euler Product</h1>
        <p className="page-subtitle">
          Blue: log|&Pi;<sub>p&le;P_N</sub>&thinsp;(1&minus;p<sup>&minus;s</sup>)<sup>&minus;1</sup>|
          on the critical line s=&frac12;+it.{' '}
          Red: same product with each log&thinsp;p shifted by a random &epsilon;<sub>p</sub>&thinsp;
          &isin;&thinsp;[&minus;&epsilon;, +&epsilon;]. Yellow dashed lines mark the
          first 10 known &zeta; zeros. The true product dips near each zero; the
          perturbed product misses them&thinsp;&mdash;&thinsp;the ARITHMETIC
          log-spectrum of primes is what locks zero positions.
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/visual-geometries" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            &larr; Visual Geometries
          </Link>
          <Link to="/prime-rigidity" style={{ color: '#ef4444', fontFamily: mono, fontSize: 12 }}>
            Prime Rigidity (caustic view)
          </Link>
          <Link to="/viz-euler-transport-flow" style={{ color: '#eab308', fontFamily: mono, fontSize: 12 }}>
            Euler Transport Flow
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10,
      }}>
        <Stat label="N primes" value={String(nPrimes)} />
        <Stat label="P_N" value={String(pMax)} />
        <Stat label="epsilon" value={epsVal.toFixed(2)} />
        <Stat label="seed" value={String(seed)} />
        <Stat label="render (ms)" value={String(renderMs)} />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>N primes</label>
          <input type="range" min="20" max={Math.min(200, ALL_PRIMES.length)} step="10" value={nPrimes}
                 onChange={e => setNPrimes(+e.target.value)} />
          <span className="control-value">{nPrimes}</span>
        </div>
        <div className="control-group">
          <label>epsilon</label>
          <input type="range" min="0.05" max="1.0" step="0.05" value={epsVal}
                 onChange={e => setEpsVal(+e.target.value)} />
          <span className="control-value">{epsVal.toFixed(2)}</span>
        </div>
        <div className="control-group" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label>perturbation seed</label>
          <button
            style={{ fontFamily: mono, fontSize: 12, padding: '4px 12px',
                     background: 'var(--bg-panel)', border: '1px solid var(--border)',
                     color: '#e2e8f0', borderRadius: 4, cursor: 'pointer' }}
            onClick={() => setSeed(s => (s + 1) % 9999)}>
            reseed ({seed})
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14, background: 'var(--bg-panel)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 6, fontFamily: mono }}>
          log|Z(1/2 + it)| &mdash; blue = true primes, red = perturbed, yellow = known &zeta; zeros
        </div>
        <canvas ref={canvasRef}
                style={{ width: '100%', maxWidth: CW, height: 'auto', display: 'block',
                         border: '1px solid #1e293b', borderRadius: 4,
                         imageRendering: 'auto' }} />
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: '#cbd5e1' }}>What you see.</strong>{' '}
        The blue curve is a TRUNCATED Euler product, not the full &zeta;(s), so it only
        approximates the zeta zeros for the primes included (convergence on the
        critical line is very slow). The dips align with known zero heights
        qualitatively. When you increase &epsilon; the red curve lifts away from
        those dips&thinsp;&mdash;&thinsp;perturbed &ldquo;fake primes&rdquo; do not
        create the same resonance pattern.
        <br /><br />
        <strong style={{ color: '#94a3b8' }}>Honest scope:</strong> this is
        pedagogical visualization. The truncated product is not &zeta;(s). Per the{' '}
        <Link to="/route-map" style={{ color: '#64748b' }}>route map</Link> the
        arithmetic rigidity of prime logarithms does not yet give a rigorous
        Lambda bound; it motivates the geometry but the proof remains open.
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
