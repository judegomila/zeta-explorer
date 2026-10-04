// AngularSpacingStatsPage.jsx -- imp-2678
// Poster panel 8: Local Angular-Spacing Statistics.
//
// At a fixed spectral height t, each prime p maps to a log-phase angle
// theta = t*log(p) mod 2pi. Sorting those angles around the circle and taking
// consecutive gaps Delta_k = theta_{k+1} - theta_k (with wraparound) gives a
// LOCAL spacing statistic. We histogram the normalized spacings s = Delta/<Delta>
// for three populations and overlay the exponential e^{-s} (the Poisson / fully
// random reference):
//   (a) true primes        -- theta = t*log(p)
//   (b) random phases       -- uniform on [0,2pi)
//   (c) perturbed Euler      -- theta = t*log(p) + eps*noise
// True primes deviate from the exponential (level repulsion / rigidity); the
// random set hugs e^{-s}; the perturbed product interpolates between them.
//
// Ceiling: descriptive/exploratory spacing histogram. NO claim about
// Lambda, NO proof of RH, does NOT beat Platt-Trudgian Lambda <= 0.2.
//
// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// canvas histogram logic and numbers (draw() untouched, literal viz hex
// preserved), warm chrome (var(--paper2)/var(--hairline)/etc.) around it.

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPrimes } from '../math/primes.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

const TWO_PI = 2 * Math.PI;
const mono = 'var(--font-mono)';

const CANVAS_W = 640;
const CANVAS_H = 320;

const ALL_PRIMES = getPrimes(400);
const ALL_LOG_P  = ALL_PRIMES.map(p => Math.log(p));

// Deterministic LCG so the random/perturbed populations are reproducible
// across renders (no Math.random hydration flicker).
function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return function next() {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Sorted consecutive angular spacings on the circle, normalized so mean = 1.
function normalizedSpacings(phases) {
  const sorted = phases.slice().sort((a, b) => a - b);
  const n = sorted.length;
  if (n < 2) return [];
  const gaps = new Array(n);
  for (let i = 0; i < n - 1; i++) gaps[i] = sorted[i + 1] - sorted[i];
  // wraparound gap closes the circle
  gaps[n - 1] = TWO_PI - sorted[n - 1] + sorted[0];
  const mean = TWO_PI / n; // gaps always sum to 2pi
  return gaps.map(g => g / mean);
}

// Histogram normalized spacings into [0, sMax] using `bins` buckets, returning
// a probability DENSITY (area sums to ~1) so it overlays the exponential pdf.
function densityHistogram(spacings, bins, sMax) {
  const counts = new Array(bins).fill(0);
  const dw = sMax / bins;
  let kept = 0;
  for (const s of spacings) {
    if (s >= sMax) continue;
    counts[Math.min(bins - 1, Math.floor(s / dw))]++;
    kept++;
  }
  if (kept === 0) return counts;
  return counts.map(c => c / (kept * dw));
}

function phasesForMode(mode, logSlice, t, eps, rng) {
  const out = new Array(logSlice.length);
  for (let i = 0; i < logSlice.length; i++) {
    let theta;
    if (mode === 'random') {
      theta = rng() * TWO_PI;
    } else if (mode === 'perturbed') {
      const noise = (rng() - 0.5) * 2; // [-1,1]
      theta = t * logSlice[i] + eps * noise;
    } else {
      theta = t * logSlice[i];
    }
    theta = theta % TWO_PI;
    if (theta < 0) theta += TWO_PI;
    out[i] = theta;
  }
  return out;
}

const SERIES = [
  { key: 'primes',    label: 'true primes',     color: ED.series5 },
  { key: 'random',    label: 'random phases',   color: ED.series1 },
  { key: 'perturbed', label: 'perturbed Euler', color: ED.brass },
];

function draw(ctx, densities, bins, sMax) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const padL = 44, padR = 12, padT = 16, padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // y-scale: cover the tallest bar and the exponential peak (1.0 at s=0).
  let yMax = 1.05;
  for (const d of Object.values(densities)) {
    for (const v of d) if (v > yMax) yMax = v;
  }
  yMax *= 1.08;

  const xOf = s => padL + (s / sMax) * plotW;
  const yOf = v => padT + plotH - (v / yMax) * plotH;

  // grid + axes
  ctx.strokeStyle = alpha(ED.rule, 0.35);
  ctx.lineWidth = 1;
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = alpha(ED.series8, 0.85);
  for (let gx = 0; gx <= sMax; gx++) {
    const x = xOf(gx);
    ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(String(gx), x, H - padB + 14);
  }
  for (let gy = 0; gy <= yMax + 1e-9; gy += 0.25) {
    const y = yOf(gy);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(gy.toFixed(2), padL - 6, y + 3);
  }
  ctx.textAlign = 'center';
  ctx.fillText('s = Delta / <Delta>  (normalized angular spacing)', padL + plotW / 2, H - 6);

  // exponential reference e^{-s} (Poisson / fully random spacing pdf)
  ctx.strokeStyle = alpha(ED.rule, 0.7);
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let px = 0; px <= plotW; px++) {
    const s = (px / plotW) * sMax;
    const v = Math.exp(-s);
    const x = padL + px, y = yOf(v);
    if (px === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // histogram step curves
  const dw = sMax / bins;
  for (const ser of SERIES) {
    const d = densities[ser.key];
    if (!d) continue;
    ctx.strokeStyle = ser.color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let b = 0; b < bins; b++) {
      const x0 = xOf(b * dw), x1 = xOf((b + 1) * dw), y = yOf(d[b]);
      if (b === 0) ctx.moveTo(x0, y); else ctx.lineTo(x0, y);
      ctx.lineTo(x1, y);
    }
    ctx.stroke();
  }
}

export default function AngularSpacingStatsPage() {
  const canvasRef = useRef(null);

  const [nPrimes, setNPrimes] = useState(200);
  const [t,       setT]       = useState(50);
  const [eps,     setEps]     = useState(0.15);
  const [bins,    setBins]    = useState(24);
  const sMax = 4;

  const N = Math.min(nPrimes, ALL_PRIMES.length);
  const logSlice = useMemo(() => ALL_LOG_P.slice(0, N), [N]);

  const densities = useMemo(() => {
    const out = {};
    for (const ser of SERIES) {
      // distinct seeds per series so random/perturbed are independent draws
      const rng = makeRng(0x9e3779b9 ^ (ser.key.length * 2654435761) ^ (N * 40503));
      const phases = phasesForMode(ser.key, logSlice, t, eps, rng);
      out[ser.key] = densityHistogram(normalizedSpacings(phases), bins, sMax);
    }
    return out;
  }, [logSlice, N, t, eps, bins]);

  // Kullback-Leibler-ish deviation from exponential, as a single rigidity number.
  const deviations = useMemo(() => {
    const dw = sMax / bins;
    const out = {};
    for (const ser of SERIES) {
      const d = densities[ser.key];
      let l1 = 0;
      for (let b = 0; b < bins; b++) {
        const sMid = (b + 0.5) * dw;
        l1 += Math.abs(d[b] - Math.exp(-sMid)) * dw;
      }
      out[ser.key] = l1;
    }
    return out;
  }, [densities, bins]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    draw(canvas.getContext('2d'), densities, bins, sMax);
  }, [densities, bins]);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', textTransform: 'uppercase', letterSpacing: 1 }}>
            /angular-spacing-stats · imp-2678 · viz
          </div>
          <h1 className="ed-h1" style={{ fontSize: 30, margin: '8px 0 4px 0' }}>
            Local Angular-Spacing Statistics
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
            At a fixed spectral height t, each prime p maps to a log-phase angle
            theta = t&thinsp;&middot;&thinsp;log(p) mod 2&pi;. The sorted consecutive
            gaps Delta<sub>k</sub> = theta<sub>k+1</sub> &minus; theta<sub>k</sub>
            (around the circle) are the <strong>local angular spacings</strong>. We
            histogram the normalized spacing s = Delta&thinsp;/&thinsp;&langle;Delta&rangle;
            for three populations and overlay the exponential e<sup>&minus;s</sup>
            (the fully-random / Poisson reference). The <strong>true primes</strong>
            deviate from the exponential &mdash; a spacing-statistics fingerprint of
            rigidity &mdash; while the random set hugs it.
          </p>
          <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/prime-rigidity" style={{ color: 'var(--terra-dk)', fontFamily: mono, fontSize: 12 }}>
              Prime Rigidity &rarr;
            </Link>
            <Link to="/gue-comparison" style={{ color: 'var(--faint)', fontFamily: mono, fontSize: 12 }}>
              GUE vs Zeros
            </Link>
            <Link to="/visualizations" style={{ color: 'var(--faint)', fontFamily: mono, fontSize: 12 }}>
              All Visualizations
            </Link>
          </div>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
          marginBottom: 18,
        }}>
          <Stat label="primes used" value={String(N)} />
          <Stat label="spectral height t" value={t.toFixed(0)} />
          <Stat label="perturbation eps" value={eps.toFixed(2)} accent="var(--brass-dk)" />
          <Stat label="bins" value={String(bins)} />
        </div>

        <Card>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 14 }}>
            <label style={{ color: 'var(--ink-soft)', fontSize: 13, fontFamily: mono, display: 'flex', flexDirection: 'column', gap: 6 }}>
              N primes: {nPrimes}
              <input type="range" min="40" max="400" step="20"
                     value={nPrimes} onChange={e => setNPrimes(+e.target.value)} style={{ width: 160 }} />
            </label>
            <label style={{ color: 'var(--ink-soft)', fontSize: 13, fontFamily: mono, display: 'flex', flexDirection: 'column', gap: 6 }}>
              spectral height t: {t}
              <input type="range" min="10" max="200" step="5"
                     value={t} onChange={e => setT(+e.target.value)} style={{ width: 160 }} />
            </label>
            <label style={{ color: 'var(--ink-soft)', fontSize: 13, fontFamily: mono, display: 'flex', flexDirection: 'column', gap: 6 }}>
              perturbation eps (rad): {eps.toFixed(2)}
              <input type="range" min="0" max="1" step="0.05"
                     value={eps} onChange={e => setEps(+e.target.value)} style={{ width: 160 }} />
            </label>
            <label style={{ color: 'var(--ink-soft)', fontSize: 13, fontFamily: mono, display: 'flex', flexDirection: 'column', gap: 6 }}>
              histogram bins: {bins}
              <input type="range" min="12" max="40" step="2"
                     value={bins} onChange={e => setBins(+e.target.value)} style={{ width: 160 }} />
            </label>
          </div>

          <div style={{
            background: 'var(--paper3)',
            border: '1px solid var(--hair2)',
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%', maxWidth: CANVAS_W, height: 'auto',
                border: '1px solid var(--rule-soft)', borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            {SERIES.map(ser => (
              <span key={ser.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-soft)', fontFamily: mono }}>
                <span style={{ width: 18, height: 3, background: ser.color, display: 'inline-block', borderRadius: 2 }} />
                {ser.label} &mdash; L1 dev e^-s = {deviations[ser.key].toFixed(3)}
              </span>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--faint)', fontFamily: mono }}>
              <span style={{ width: 18, height: 0, borderTop: '2px dashed color-mix(in srgb, var(--rule) 60%, transparent)', display: 'inline-block' }} />
              e^-s reference
            </span>
          </div>

          <div style={{ marginTop: 14, fontSize: 11, color: 'var(--faint)', lineHeight: 1.85 }}>
            <strong style={{ color: 'var(--ink-soft)' }}>Reading the panel.</strong>{' '}
            The dashed curve is the exponential e<sup>&minus;s</sup> &mdash; the spacing
            density of a fully random (Poisson) set of points on the circle. The
            <span style={{ color: 'var(--series-1)' }}> random-phase</span> histogram tracks it
            closely, as it should. The <span style={{ color: 'var(--series-5)' }}>true-prime</span>
            histogram is suppressed at small s (level repulsion: primes avoid clustering
            their phases) and shows excess weight at intermediate s &mdash; the
            rigidity fingerprint. The <span style={{ color: 'var(--brass)' }}>perturbed Euler</span>
            population, with phases jittered by eps, relaxes toward the random curve as
            eps grows; the L1-deviation numbers above quantify how far each population
            sits from e<sup>&minus;s</sup>.
          </div>
        </Card>

        <Card accent="var(--brass)">
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)',
                        letterSpacing: 0.5, marginBottom: 6 }}>
            Ceiling
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            This is a descriptive spacing histogram of the log-phase field. It is
            exploratory and pedagogical. It does NOT produce a new bound on Lambda,
            does NOT prove RH, and does NOT beat the Platt-Trudgian Lambda &le; 0.2
            result. The deviation of the prime spacings from the exponential is an
            observed statistical pattern, not a theorem.
          </div>
        </Card>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: mono }}>
            Related pages:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/prime-rigidity" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/prime-rigidity</Link>
            <Link to="/gue-comparison" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/gue-comparison</Link>
            <Link to="/visualizations" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/visualizations</Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>&larr; the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Card({ children, accent = 'var(--hairline)' }) {
  return (
    <div className="card" style={{
      background: 'var(--paper2)',
      border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 10,
      padding: '18px 22px',
      margin: '0 0 20px 0',
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--paper2)',
      border: '1px solid var(--hairline)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 16, fontFamily: mono, color: accent || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
