import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION } from '../data/imp-34694-sigma-exponent-knee-closed-form-location.js';
import { ED } from '../styles/tokens.js';

const M = IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION;
const log10 = (x) => Math.log(x) / Math.LN10;

// -- Independent re-derivation of the imp-34694 exponent-ramp curve, for plotting only ----------
// Mirrors the data module's inline Riemann-von Mangoldt inverse-height solver and the sigma(N)
// component model (NOT imported) so this page can draw the continuous p, p', p'' curves; the
// module itself only exports the knee/crossover/halving summary literals.
const TWO_PI = 2 * Math.PI;
function inverseHeight(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI);

function lnSigmaFull(x) {
  const N = Math.exp(x);
  const T0 = inverseHeight(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return Math.log(E_coll / (E_TRUNC_PT + E_flow + E_coll));
}

const H_STEP = 1e-3; // reference rung (matches the module's own X_STAR estimator)
function pLocal(x, h) {
  return -(lnSigmaFull(x + h) - lnSigmaFull(x - h)) / (2 * h);
}
function pSecond(x, h) {
  return (pLocal(x + h, h) - 2 * pLocal(x, h) + pLocal(x - h, h)) / (h * h);
}
function pVelocity(x, h) {
  return (pLocal(x + h, h) - pLocal(x - h, h)) / (2 * h);
}

const GRID_POINTS = 160;
function buildRampCurve() {
  const lo = 9;
  const hi = 11;
  const pts = [];
  for (let i = 0; i <= GRID_POINTS; i++) {
    const log10N = lo + ((hi - lo) * i) / GRID_POINTS;
    const x = log10N * Math.LN10;
    pts.push({
      log10N,
      p: pLocal(x, H_STEP),
      pPrime: pVelocity(x, H_STEP),
      pSecond: pSecond(x, H_STEP),
    });
  }
  return pts;
}

function RampChart({ points, field, yLabel, color, markerLog10, markerLabel, zeroLine }) {
  const svgW = 660;
  const svgH = 220;
  const padL = 66;
  const padR = 24;
  const padT = 18;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = points[0].log10N;
  const xMax = points[points.length - 1].log10N;
  const yVals = points.map((p) => p[field]);
  const yPad = (Math.max(...yVals) - Math.min(...yVals)) * 0.15 || 1e-6;
  const yMin = Math.min(...yVals) - yPad;
  const yMax = Math.max(...yVals) + yPad;

  const xAt = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.log10N)},${yAt(p[field])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {zeroLine && yMin < 0 && yMax > 0 && (
        <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="1 3" />
      )}

      <line
        x1={xAt(markerLog10)}
        y1={padT}
        x2={xAt(markerLog10)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={xAt(markerLog10) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        {markerLabel}
      </text>

      <path d={linePath} fill="none" stroke={color} strokeWidth={1.75} />

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 12, ${padT + cH / 2})`}
      >
        {yLabel}
      </text>
    </svg>
  );
}

export default function Imp34719SigmaExponentRampKneeViz() {
  const points = useMemo(() => buildRampCurve(), []);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma Exponent-Ramp Knee (imp-34719 / imp-34694)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34694 sharpened the imp-33701 post-peak sigma(N) decay-exponent knee &mdash; the single
        convex&rarr;concave sign change of the ramp acceleration p&Prime;(ln N) &mdash; from a coarse
        whole-decade [1e10, 1e11] bracket to a direct continuous root-find: log10 N* ={' '}
        {M.directRootFind.log10Nstar} (N* &asymp; {M.directRootFind.Nstar}, sigma &asymp;{' '}
        {M.directRootFind.sigmaAtKnee}), matching the imp-34111 tight-grid value{' '}
        {M.directRootFind.matchesImp34111Log10} to &asymp; {M.directRootFind.errorLog10FromStepRefine}.
        The three panels below plot the local decay exponent p(ln N), its ramp velocity p&prime;(ln N),
        and its ramp acceleration p&Prime;(ln N) across log10 N &isin; [9, 11], each marking the single
        knee.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Local decay exponent p(ln N) = &minus;d ln&nbsp;sigma / d ln&nbsp;N
      </p>
      <RampChart
        points={points}
        field="p"
        yLabel="p(ln N)"
        color={ED.series1}
        markerLog10={M.directRootFind.log10Nstar}
        markerLabel={`knee ${M.directRootFind.log10Nstar}`}
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Ramp velocity p&prime;(ln N)
      </p>
      <RampChart
        points={points}
        field="pPrime"
        yLabel="p'(ln N)"
        color={ED.series5}
        markerLog10={M.directRootFind.log10Nstar}
        markerLabel={`knee ${M.directRootFind.log10Nstar}`}
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Ramp acceleration p&Prime;(ln N) &mdash; the convex&rarr;concave knee is its single zero
      </p>
      <RampChart
        points={points}
        field="pSecond"
        yLabel="p''(ln N)"
        color={ED.series2}
        markerLog10={M.directRootFind.log10Nstar}
        markerLabel={`p'' = 0 at ${M.directRootFind.log10Nstar}`}
        zeroLine
      />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 N</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>halving (sigma = 1/2, full model)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.crossoverAndHalving.log10Nhalf}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>crossover (E_coll = E_trunc)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.crossoverAndHalving.log10Ncross}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>knee (p'' = 0, direct root-find)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.directRootFind.log10Nstar}</td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        The knee sits {M.crossoverAndHalving.kneeOffsetAboveCrossoverLog10} above the crossover in
        log10 N ({M.crossoverAndHalving.kneeOffsetAboveCrossoverPct}%), consistent with the analytic
        leading-order coincidence S = 1/2 (imp-33723 crossover, imp-33582 halving) displaced by the
        first-order slowly-varying-v correction delta = {M.analyticClosedForm.delta}.
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page, recomputing the
        imp-34694 exponent-ramp curve (inline Riemann&ndash;von Mangoldt inverse-height solver, re-typed
        and independent of the source solver) purely for plotting; establishes no new numerical claim.
        Measurement/derivation on the inherited imp-3220/imp-3406 extrapolation; far-tail exponent stays
        1/2 (imp-3463); C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2642/imp-2643) and C_mb GUE-conditional
        (imp-486) untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
