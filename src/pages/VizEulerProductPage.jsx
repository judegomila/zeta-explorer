// VizEulerProductPage.jsx -- imp-2718
// True-vs-Perturbed Euler product comparison.
//
// Shows log|Π_{p<=P_N} (1-p^{-s})^{-1}| on the critical line s=1/2+it alongside
// a perturbed product where each log p is shifted by a small epsilon_p. The
// true product has near-zeros near the known zeta zeros; perturbing the log p
// values smears/destroys them -- arithmetic rigidity of primes locks the zeros.
//
// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// curve-building logic and numbers, literal warm-palette hex on the canvas
// in place of the dark slate palette.

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import ZeroStepper from '../components/ZeroStepper.jsx';
import { ED, alpha } from '../styles/tokens.js';

const mono = 'var(--ed-mono, var(--font-mono))';
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

// ── Warm-palette literal hex (canvas fill/stroke can never use var()) ──────
const S = {
  subtitle: { color: ED.inkFaint, fontSize: 14, marginBottom: 20, lineHeight: 1.6 },
  card: {
    background: ED.paper2,
    border: '1px solid var(--rule)',
    borderRadius: 8,
    padding: '14px 16px',
    marginBottom: 16,
  },
  sectionTitle: { color: ED.brass, fontSize: 14, fontWeight: 600, marginBottom: 10 },
  statCard: {
    background: ED.paper,
    border: '1px solid var(--rule)',
    borderRadius: 8,
    padding: 10,
  },
  statLabel: { fontSize: 10, textTransform: 'uppercase', color: ED.inkFaint, letterSpacing: 0.5, fontFamily: mono },
  statValue: { marginTop: 4, fontSize: 16, fontFamily: mono, color: ED.ink },
  controlLabel: { color: ED.inkFaint, fontSize: 12, fontFamily: mono },
  button: {
    fontFamily: mono, fontSize: 12, padding: '4px 12px',
    background: ED.brassDeco, border: '1px solid var(--brass)',
    color: ED.paper, borderRadius: 4, cursor: 'pointer',
  },
};

export default function VizEulerProductPage() {
  const canvasRef = useRef(null);
  const [nPrimes, setNPrimes] = useState(80);
  const [epsVal, setEpsVal] = useState(0.3);
  const [seed, setSeed] = useState(42);
  const [renderMs, setRenderMs] = useState(0);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [focusedZeroIdx, setFocusedZeroIdx] = useState(0);

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

    ctx.fillStyle = ED.paper;
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
    ctx.strokeStyle = alpha(ED.brass, 0.25);
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, zeroY); ctx.lineTo(CW, zeroY); ctx.stroke();
    ctx.setLineDash([]);

    // Known zero vertical markers; focused zero is rendered brighter.
    ctx.setLineDash([3, 5]);
    ctx.font = '9px monospace';
    KNOWN_ZEROS.forEach((z, i) => {
      if (z < T_MIN || z > T_MAX) return;
      const focused = i === focusedZeroIdx;
      ctx.strokeStyle = focused ? alpha(ED.brassDeco, 0.95) : alpha(ED.brassDeco, 0.4);
      ctx.lineWidth = focused ? 2 : 1;
      ctx.fillStyle = focused ? alpha(ED.brass, 0.95) : alpha(ED.brass, 0.6);
      const x = ((z - T_MIN) / (T_MAX - T_MIN)) * CW;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
      ctx.fillText(z.toFixed(0), x + 2, 12);
    });
    ctx.setLineDash([]);

    // Perturbed curve (red, drawn first so true overlaps it).
    drawCurve(ctx, pertVals, yMin, yMax, alpha(ED.series2, 0.75), 1.2);
    // True curve (blue).
    drawCurve(ctx, trueVals, yMin, yMax, ED.series1, 1.6);

    // Axis labels.
    ctx.font = '10px monospace';
    ctx.fillStyle = alpha(ED.inkFaint, 0.9);
    ctx.textAlign = 'left';
    ctx.fillText('t=' + T_MIN, 3, CH - 4);
    ctx.textAlign = 'right';
    ctx.fillText('t=' + T_MAX, CW - 3, CH - 4);
    ctx.textAlign = 'left';
    ctx.fillText('log|Z|', 3, 20);

    setRenderMs(+(performance.now() - t0).toFixed(1));
  }, [trueVals, pertVals, focusedZeroIdx]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseMove = useCallback((e) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const fracX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = T_MIN + fracX * (T_MAX - T_MIN);
    const idx = Math.max(0, Math.min(N_STEPS - 1, Math.round(fracX * (N_STEPS - 1))));
    const logZ = trueVals[idx];
    let nearestZero = KNOWN_ZEROS[0];
    let minDist = Infinity;
    for (const z of KNOWN_ZEROS) {
      const d = Math.abs(z - t);
      if (d < minDist) { minDist = d; nearestZero = z; }
    }
    setHoverInfo({ t, logZ, nearestZero, dist: minDist });
  }, [trueVals]);

  const pMax = ALL_PRIMES[nPrimes - 1] || 0;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>True vs Perturbed Euler Product</h1>
        <p className="ed-lbl">Related: <Link to="/prime-rigidity">Caustics: true vs perturbed</Link></p>
        <p style={S.subtitle}>
          Blue: log|&Pi;<sub>p&le;P_N</sub>&thinsp;(1&minus;p<sup>&minus;s</sup>)<sup>&minus;1</sup>|
          on the critical line s=&frac12;+it.{' '}
          Red: same product with each log&thinsp;p shifted by a random &epsilon;<sub>p</sub>&thinsp;
          &isin;&thinsp;[&minus;&epsilon;, +&epsilon;]. Gold dashed lines mark the
          first 10 known &zeta; zeros. The true product dips near each zero; the
          perturbed product misses them&thinsp;&mdash;&thinsp;the ARITHMETIC
          log-spectrum of primes is what locks zero positions.
        </p>

        <div style={{ marginTop: 4, marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/visual-geometries" style={{ color: 'var(--ink-faint)', fontFamily: mono, fontSize: 12 }}>
            &larr; Visual Geometries
          </Link>
          <Link to="/prime-rigidity" style={{ color: 'var(--accent)', fontFamily: mono, fontSize: 12 }}>
            Prime Rigidity (caustic view)
          </Link>
          <Link to="/viz-euler-transport-flow" style={{ color: 'var(--brass)', fontFamily: mono, fontSize: 12 }}>
            Euler Transport Flow
          </Link>
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

        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ minWidth: 260, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={S.controlLabel}>Focus zero (&larr; / &rarr; keys)</label>
            <ZeroStepper gammas={KNOWN_ZEROS} idx={focusedZeroIdx} onChange={setFocusedZeroIdx} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={S.controlLabel}>N primes</label>
            <input type="range" min="20" max={Math.min(200, ALL_PRIMES.length)} step="10" value={nPrimes}
                   onChange={e => setNPrimes(+e.target.value)} />
            <span style={S.controlLabel}>{nPrimes}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={S.controlLabel}>epsilon</label>
            <input type="range" min="0.05" max="1.0" step="0.05" value={epsVal}
                   onChange={e => setEpsVal(+e.target.value)} />
            <span style={S.controlLabel}>{epsVal.toFixed(2)}</span>
          </div>
          <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={S.controlLabel}>perturbation seed</label>
            <button
              style={S.button}
              onClick={() => setSeed(s => (s + 1) % 9999)}>
              reseed ({seed})
            </button>
          </div>
        </div>

        <div className="card" style={{ ...S.card, marginTop: 14 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-faint)',
                        letterSpacing: 0.5, marginBottom: 6, fontFamily: mono }}>
            log|Z(1/2 + it)| &mdash; blue = true primes, red = perturbed, gold = known &zeta; zeros
          </div>
          <canvas ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverInfo(null)}
                  style={{ width: '100%', maxWidth: CW, height: 'auto', display: 'block',
                           border: '1px solid var(--rule)', borderRadius: 4,
                           imageRendering: 'auto', cursor: 'crosshair' }} />
          {hoverInfo ? (
            <div style={{ marginTop: 6, fontFamily: mono, fontSize: 11, color: 'var(--ink-faint)',
                          display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--ink)' }}>t = {hoverInfo.t.toFixed(3)}</span>
              <span style={{ color: 'var(--series-1)' }}>log|Z| = {hoverInfo.logZ.toFixed(4)}</span>
              <span style={{ color: 'var(--brass)' }}>nearest zero: {hoverInfo.nearestZero.toFixed(2)} (&Delta;={hoverInfo.dist.toFixed(2)})</span>
            </div>
          ) : (
            <div style={{ marginTop: 6, fontFamily: mono, fontSize: 11, color: 'var(--ink-faint)' }}>
              hover canvas to read t, log|Z|, nearest zero
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-faint)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink-soft)' }}>What you see.</strong>{' '}
          The blue curve is a TRUNCATED Euler product, not the full &zeta;(s), so it only
          approximates the zeta zeros for the primes included (convergence on the
          critical line is very slow). The dips align with known zero heights
          qualitatively. When you increase &epsilon; the red curve lifts away from
          those dips&thinsp;&mdash;&thinsp;perturbed &ldquo;fake primes&rdquo; do not
          create the same resonance pattern.
          <br /><br />
          <strong style={{ color: 'var(--ink-faint)' }}>Scope:</strong> this is
          pedagogical visualization. The truncated product is not &zeta;(s). Per the{' '}
          <Link to="/route-map" style={{ color: 'var(--ink-faint)' }}>route map</Link> the
          arithmetic rigidity of prime logarithms does not yet give a rigorous
          Lambda bound; it motivates the geometry but the proof remains open.
        </div>

        {/* Related pages / footer */}
        <div className="card" style={{ ...S.card, marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--ink-faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/prime-rigidity" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              &rarr; Prime Rigidity (caustic view)
            </Link>
            <Link to="/viz-euler-transport-flow" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              &rarr; Euler Transport Flow
            </Link>
            <Link to="/route-map" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              &rarr; Route map
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
              &larr; the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={S.statCard}>
      <div style={S.statLabel}>{label}</div>
      <div style={S.statValue}>{value}</div>
    </div>
  );
}
