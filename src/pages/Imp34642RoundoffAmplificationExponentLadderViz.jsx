import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER } from '../data/imp-34606-roundoff-amplification-exponent-ladder.js';
import { ED } from '../styles/tokens.js';

const M = IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER;

// -- INDEPENDENT instance of the imp-34606 primitives (imports NOTHING beyond the frozen summary
// above, which supplies only the fitted exponents/R^2 for annotation) -- reproduces the same
// q-derivative sweep so the log-log curves plotted here are a genuine recomputation, not a
// re-display of baked numbers.
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI);
const DEEP_TAIL_N = 4.624385e13;

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
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp = q(p + dp);
  const fm = q(p - dp);
  const fpp = q(p + 2 * dp);
  const fmm = q(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q3, q4 };
}
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}
function deepGroupMaxShare(dp, k) {
  return Math.max(...DEEP_LADDER.map((N) => channelShare(N, dp, k)));
}

// The three exact roundoff-dominated windows imp-34606 fit its exponents on, reproduced verbatim.
const WINDOW_Q2 = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7];
const WINDOW_Q3 = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5];
const WINDOW_Q4 = [2e-3, 1.4e-3, 1e-3];

const CHANNELS = [
  { k: 2, color: ED.series1, label: 'q2 (predicted 1/dp²)', window: WINDOW_Q2, m: M.m_q2, r2: M.r2_q2 },
  { k: 3, color: ED.brass, label: 'q3 (predicted 1/dp³)', window: WINDOW_Q3, m: M.m_q3, r2: M.r2_q3 },
  { k: 4, color: ED.series2, label: 'q4 (predicted 1/dp⁴)', window: WINDOW_Q4, m: M.m_q4, r2: M.r2_q4 },
];

const SERIES = CHANNELS.map((c) => ({
  ...c,
  points: c.window.map((dp) => ({ dp, share: deepGroupMaxShare(dp, c.k) })).sort((a, b) => a.dp - b.dp),
}));

function LadderChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 62;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allDp = SERIES.flatMap((s) => s.points.map((p) => p.dp));
  const allShare = SERIES.flatMap((s) => s.points.map((p) => p.share));
  const xMin = Math.log10(Math.min(...allDp)) - 0.3;
  const xMax = Math.log10(Math.max(...allDp)) + 0.3;
  const yMin = Math.log10(Math.min(...allShare)) - 0.4;
  const yMax = Math.log10(Math.max(...allShare)) + 0.4;

  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {SERIES.map((s) => {
        const path = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.dp)},${yAt(p.share)}`).join(' ');
        return (
          <g key={s.k}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={2} />
            {s.points.map((p) => (
              <circle key={p.dp} cx={xAt(p.dp)} cy={yAt(p.share)} r={3.5} fill={s.color} stroke={ED.paper} strokeWidth={1} />
            ))}
          </g>
        );
      })}

      {SERIES.map((s, i) => (
        <text key={s.k} x={padL} y={16 + i * 13} fill={s.color} fontSize={10}>
          {s.label}: m_measured = {s.m.toFixed(3)} (R&sup2; = {s.r2.toFixed(3)})
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        q-derivative step dp (log scale) -- per-channel roundoff-dominated window
      </text>
    </svg>
  );
}

export default function Imp34642RoundoffAmplificationExponentLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="q2/q3/q4 Roundoff-Amplification Exponent Ladder vs dp (imp-34642 / imp-34606)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34606 measured, on one common deep-tail footing (N &ge; N* &asymp;{' '}
        {M.deep_tail_boundary_N.toExponential(2)}), the log-log growth exponent of each of the q2 /
        q3 / q4 finite-difference channel shares against the q-derivative step dp, unifying the
        previously-isolated imp-34592 (q4) and imp-34593 (q3) rungs and adding the never-measured
        q2 rung. No viz existed for this three-channel ladder. This tab plots the deep-tail
        apparent-share growth for all three channels together over their respective
        roundoff-dominated dp windows, recomputed independently from the inherited q-derivative
        primitives.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deep-group max apparent channel share vs dp (log-log): three roundoff-amplification lines,
        one per channel
      </p>
      <LadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>predicted k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measured m</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>R&sup2;</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>window (dp)</th>
          </tr>
        </thead>
        <tbody>
          {M.ladder_rows.map((r) => (
            <tr key={r.channel} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.channel}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k_predicted}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.m_measured}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.r2}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.window_hi.toExponential(1)} .. {r.window_lo.toExponential(1)}
              </td>
            </tr>
          ))}
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
        Ladder clean and strictly increasing (m2 &lt; m3 &lt; m4, all rounding to the predicted
        {' '}{M.predicted_ladder.join('/')}): <strong>{M.ladder_is_clean ? 'yes' : 'no'}</strong>.
        The roundoff onset dp scales inversely with k -- the steeper 1/dp&#7509; amplification for
        larger k hits its floor at a larger step, so q4 saturates by dp &sim; 1e-3, q3 only by dp
        &sim; 1e-4, and q2 only below dp &sim; 1e-6.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, recomputing the
        imp-34606 q-derivative sweep independently over its published roundoff-dominated windows;
        the fitted m/R&sup2; annotations are the imp-34606 baked values. q1..q4 are inherited
        central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1
        deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is --
        this diagnoses finite-difference conditioning, it does not rehabilitate the model. The -2
        asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no
        bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
