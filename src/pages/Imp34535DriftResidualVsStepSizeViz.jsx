import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34513_DRIFT_RESIDUAL } from '../data/imp-34513-slowlog-drift-residual-crosscheck.js';
import { ED } from '../styles/tokens.js';

const { landmark_N, richardson_collapse_factor, max_richardson_residual } =
  IMP34513_DRIFT_RESIDUAL;

// -- Self-contained reproduction of the imp-34513 primitives (imports NOTHING -- no zeros
// -- bundle), sweeping the central-difference step h at the N* landmark to show the raw
// -- residual's O(h^2) slope on a log-log plot, per imp-34535.
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

function analyticExponent(N) {
  const T0 = heightForN(N);
  const L = Math.log(T0);
  const logU = Math.log(T0 / TWO_PI);
  const g = (1 - 1 / logU) / L;
  const x = (-2 * g) / (1 - g);
  return -2 + x;
}

function measuredExponent(N, h) {
  const Np = N * (1 + h);
  const Nm = N * (1 - h);
  return (Math.log(Np) - Math.log(Nm)) / (Math.log(eColl(Np)) - Math.log(eColl(Nm)));
}

const H_SWEEP = [2e-2, 1e-2, 5e-3, 2e-3, 1e-3, 5e-4, 2e-4];
const ANALYTIC_AT_STAR = analyticExponent(landmark_N);
const SWEEP_POINTS = H_SWEEP.map((h) => {
  const residual = Math.abs(ANALYTIC_AT_STAR - measuredExponent(landmark_N, h));
  return { h, residual };
});

// Local log-log slope between consecutive points -- should sit near 2 for an O(h^2) floor.
const SWEEP_SLOPES = SWEEP_POINTS.slice(1).map((p, i) => {
  const prev = SWEEP_POINTS[i];
  const slope =
    (Math.log10(p.residual) - Math.log10(prev.residual)) / (Math.log10(p.h) - Math.log10(prev.h));
  return slope;
});

function ResidualLogLogChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logHs = SWEEP_POINTS.map((p) => Math.log10(p.h));
  const logRs = SWEEP_POINTS.map((p) => Math.log10(p.residual));
  const floorLog = Math.log10(max_richardson_residual);

  const xMin = Math.min(...logHs) - 0.25;
  const xMax = Math.max(...logHs) + 0.25;
  const yMin = Math.min(floorLog, ...logRs) - 0.6;
  const yMax = Math.max(...logRs) + 0.6;

  const px = (logH) => padL + ((logH - xMin) / (xMax - xMin)) * plotW;
  const py = (logR) => padT + plotH - ((logR - yMin) / (yMax - yMin)) * plotH;

  // Slope-2 reference line anchored through the first sweep point.
  const refX0 = xMin;
  const refY0 = logRs[0] + 2 * (refX0 - logHs[0]);
  const refX1 = xMax;
  const refY1 = logRs[0] + 2 * (refX1 - logHs[0]);

  const pathD = SWEEP_POINTS.map((p, i) => {
    const x = px(Math.log10(p.h));
    const y = py(Math.log10(p.residual));
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />

      {/* slope-2 (O(h^2)) reference line */}
      <line
        x1={px(refX0)}
        y1={py(refY0)}
        x2={px(refX1)}
        y2={py(refY1)}
        stroke={ED.series7}
        strokeWidth={1.25}
        strokeDasharray="5,4"
        opacity={0.75}
      />
      <text x={px(refX1) - 4} y={py(refY1) + 14} textAnchor="end" fill={ED.series7} fontSize={9}>
        slope 2 (O(h&sup2;) reference)
      </text>

      {/* Richardson floor (max over the ladder, per imp-34513) */}
      <line
        x1={padL}
        y1={py(floorLog)}
        x2={padL + plotW}
        y2={py(floorLog)}
        stroke={ED.series3}
        strokeWidth={1.25}
        strokeDasharray="3,3"
        opacity={0.75}
      />
      <text x={padL + 4} y={py(floorLog) - 6} fill={ED.series3} fontSize={9}>
        Richardson floor &asymp; {max_richardson_residual.toExponential(1)} (max over ladder)
      </text>

      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} />
      {SWEEP_POINTS.map((p) => (
        <circle
          key={p.h}
          cx={px(Math.log10(p.h))}
          cy={py(Math.log10(p.residual))}
          r={4}
          fill={ED.series1}
        />
      ))}

      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        step size h (log scale)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        |analytic &minus; measured| (log scale)
      </text>
    </svg>
  );
}

export default function Imp34535DriftResidualVsStepSizeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Slow-Log Drift Residual vs Step Size h (imp-34535)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34513 cross-checked the imp-34486 closed-form slow-log drift exponent against the
        imp-34446 central-difference measurement at the deep-tail landmark N* &asymp;{' '}
        {landmark_N.toExponential(4)}. The raw residual |analytic &minus; measured(h)| is a
        finite-difference artifact, not a derivation gap: sweeping the step h shows it tracks the
        slope-2 reference line on a log-log plot &mdash; the signature of an O(h&sup2;) truncation
        floor &mdash; and Richardson extrapolation collapses the ladder-wide residual{' '}
        {richardson_collapse_factor.toFixed(1)}&times; down to the double-precision floor{' '}
        &asymp; {max_richardson_residual.toExponential(1)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        raw residual vs step size h at N*, log-log, against the O(h&sup2;) slope-2 reference
      </p>
      <ResidualLogLogChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>step h</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>raw residual at N*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local log-log slope</th>
          </tr>
        </thead>
        <tbody>
          {SWEEP_POINTS.map((p, i) => (
            <tr key={p.h} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.h.toExponential(1)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.residual.toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {i === 0 ? '—' : SWEEP_SLOPES[i - 1].toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The local slope sits at &asymp; 2.00 across the sweep (imp-34513 F2), confirming the raw
        residual is an O(h&sup2;) central-difference truncation floor. The green Richardson-floor
        line is the imp-34513 ladder-wide maximum after extrapolation ({richardson_collapse_factor.toFixed(0)}
        &times; below the raw curve at the finest measured step), certifying the closed form matches
        the measurement to double precision once the finite-difference artifact is removed.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / finite-difference
        diagnostic only, reproducing the imp-34513 cross-check. The component model is the inherited
        imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the -2 asymptote and C_C =
        (1/8)sqrt(3 pi) (imp-2714) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is
        UNTOUCHED; imp-3066 K_a &ge; 0 untouched; changes no bound; no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
