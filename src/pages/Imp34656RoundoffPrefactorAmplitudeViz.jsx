import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH } from '../data/imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js';
import { ED } from '../styles/tokens.js';

const M = IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH;

// -- INDEPENDENT instance of the imp-34606/imp-34633 primitives (imports NOTHING beyond the frozen
// summary above, which supplies only the fitted amplitude ratios/slopes for annotation) -- reproduces
// the same q-derivative sweep so the log-log floor lines plotted here are a genuine recomputation,
// not a re-display of baked numbers.
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

// The three exact roundoff-dominated windows imp-34606/imp-34633 fit on, reproduced verbatim.
const WINDOW_Q2 = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7];
const WINDOW_Q3 = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5];
const WINDOW_Q4 = [2e-3, 1.4e-3, 1e-3];

const CHANNELS = [
  { k: 2, color: ED.series1, label: 'q2 (2nd diff / dp²)', window: WINDOW_Q2, m: M.m_q2, ratio: M.ratio_q2, Bmeas: M.B2_measured, Bpred: M.B2_predicted },
  { k: 3, color: ED.brass, label: 'q3 (3rd diff / (2 dp³))', window: WINDOW_Q3, m: M.m_q3, ratio: M.ratio_q3, Bmeas: M.B3_measured, Bpred: M.B3_predicted },
  { k: 4, color: ED.series2, label: 'q4 (4th diff / dp⁴)', window: WINDOW_Q4, m: M.m_q4, ratio: M.ratio_q4, Bmeas: M.B4_measured, Bpred: M.B4_predicted },
];

// Measured floor line = the genuinely recomputed deep-group-max share at each window anchor. The
// predicted floor line is that same measured value divided by the fitted ratio (measured/predicted),
// so the vertical gap between the two lines is exactly the imp-34633 amplitude-mismatch ratio.
const SERIES = CHANNELS.map((c) => {
  const points = c.window
    .map((dp) => ({ dp, measured: deepGroupMaxShare(dp, c.k) }))
    .sort((a, b) => a.dp - b.dp)
    .map((p) => ({ ...p, predicted: p.measured / c.ratio }));
  return { ...c, points };
});

function AmplitudeChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 62;
  const padR = 24;
  const padT = 40;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allDp = SERIES.flatMap((s) => s.points.map((p) => p.dp));
  const allY = SERIES.flatMap((s) => s.points.flatMap((p) => [p.measured, p.predicted]));
  const xMin = Math.log10(Math.min(...allDp)) - 0.3;
  const xMax = Math.log10(Math.max(...allDp)) + 0.3;
  const yMin = Math.log10(Math.min(...allY)) - 0.4;
  const yMax = Math.log10(Math.max(...allY)) + 0.4;

  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {SERIES.map((s) => {
        const measPath = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.dp)},${yAt(p.measured)}`).join(' ');
        const predPath = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.dp)},${yAt(p.predicted)}`).join(' ');
        return (
          <g key={s.k}>
            <path d={predPath} fill="none" stroke={s.color} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6} />
            <path d={measPath} fill="none" stroke={s.color} strokeWidth={2} />
            {s.points.map((p) => (
              <circle key={`m-${p.dp}`} cx={xAt(p.dp)} cy={yAt(p.measured)} r={3.5} fill={s.color} stroke={ED.paper} strokeWidth={1} />
            ))}
          </g>
        );
      })}

      {SERIES.map((s, i) => (
        <text key={s.k} x={padL} y={16 + i * 13} fill={s.color} fontSize={10}>
          {s.label}: B_measured {s.Bmeas.toExponential(2)} vs B_predicted {s.Bpred.toExponential(2)} (ratio {s.ratio.toFixed(2)})
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        q-derivative step dp (log scale) -- solid = measured floor, dashed = eps_mach*|q| prediction
      </text>
    </svg>
  );
}

export default function Imp34656RoundoffPrefactorAmplitudeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="q2/q3/q4 Roundoff-Floor Amplitude vs eps_mach Prediction (imp-34656 / imp-34633)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34633 fit the INTERCEPT prefactor of each imp-34606 deep-tail q2/q3/q4 log-log
        roundoff line and compared it to a parameter-free double-precision prediction
        (~eps_mach&nbsp;&times;&nbsp;|q|). This tab plots the three deep-group-max apparent-share
        floor lines (recomputed independently over their published roundoff-dominated dp windows)
        together with the machine-epsilon amplitude prediction for each channel, so the fitted
        intercept and its predicted counterpart are visible as a single vertical gap per line.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deep-group max apparent channel share vs dp (log-log): measured floor (solid) vs eps_mach*|q|
        prediction (dashed), one pair per channel
      </p>
      <AmplitudeChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>B measured</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>B predicted</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio meas/pred</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>stencil norm</th>
          </tr>
        </thead>
        <tbody>
          {M.amplitude_rows.map((r) => (
            <tr key={r.channel} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.channel}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.B_measured}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.B_predicted}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ratio_meas_over_pred}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.stencil_norm}</td>
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
        All three channels land within a factor of &sim;3.5 of the parameter-free eps_mach
        prediction: <strong>{M.all_amplitudes_match_epsmach ? 'yes' : 'no'}</strong>. q3 is the
        loosest channel (ratio {M.ratio_q3}) &mdash; its dp&nbsp;=&nbsp;1e-4&nbsp;..&nbsp;1e-5
        window sits least deep in the roundoff floor of the three, so a residual truncation
        contribution biases both its fitted slope below 3 (m3&nbsp;&asymp;&nbsp;{M.m_q3}) and its
        intercept amplitude above the pure-roundoff prediction, visible here as the widest gap
        between its solid and dashed lines.
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
        imp-34606/imp-34633 q-derivative sweep independently over the published roundoff-dominated
        windows; the predicted-amplitude lines and ratio annotations are the imp-34633 baked values.
        This is a conditioning diagnostic on the finite-difference measurement, not a rehabilitation
        of the surrogate. q1..q4 are inherited central differences, NOT fresh analytic closed forms,
        so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime (imp-3220/imp-3406 component model least
        trustworthy) is inherited as-is. The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi)
        (imp-2714) ansatz are UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
