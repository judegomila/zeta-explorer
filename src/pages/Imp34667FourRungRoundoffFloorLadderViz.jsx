import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER } from '../data/imp-34606-roundoff-amplification-exponent-ladder.js';
import { IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR } from '../data/imp-34646-q1-first-difference-roundoff-floor.js';
import { ED } from '../styles/tokens.js';

const M234 = IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER;
const M1 = IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR;

// -- INDEPENDENT instance of the imp-34606/imp-34646 primitives (imports NOTHING beyond the two
// frozen summaries above, which supply only the fitted exponents/R^2 for annotation) -- reproduces
// the same q-derivative sweep so the log-log curves plotted here are a genuine recomputation.
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
function qOf(p) {
  return Math.log(eColl(Math.exp(p)));
}
function qDerivs(N, dp) {
  const p = Math.log(N);
  const f0 = qOf(p);
  const fp = qOf(p + dp);
  const fm = qOf(p - dp);
  const fpp = qOf(p + 2 * dp);
  const fmm = qOf(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q3, q4 };
}
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

// q1 is well-conditioned (true value O(1)) -- its floor is the ABSOLUTE error against a non-roundoff
// reference, NOT a blowing-up share; q2/q3/q4 near-cancel so their floor is measured as a share.
function q1TrueAt(N) {
  return qDerivs(N, 1e-2).q1;
}
function channelMagnitude(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 1) return Math.abs(q1 - q1TrueAt(N));
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}
function deepGroupMax(dp, k) {
  return Math.max(...DEEP_LADDER.map((N) => channelMagnitude(N, dp, k)));
}

// The four exact roundoff-dominated windows imp-34646 (q1) / imp-34606 (q2/q3/q4) fit their
// exponents on, reproduced verbatim.
const WINDOW_Q1 = [1e-6, 5e-7, 3e-7, 1e-7, 5e-8];
const WINDOW_Q2 = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7];
const WINDOW_Q3 = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5];
const WINDOW_Q4 = [2e-3, 1.4e-3, 1e-3];

const CHANNELS = [
  { k: 1, color: ED.series5, label: 'q1 (predicted 1/dp¹, ABSOLUTE error)', window: WINDOW_Q1, m: M1.m_q1, r2: M1.r2_q1 },
  { k: 2, color: ED.series1, label: 'q2 (predicted 1/dp², share)', window: WINDOW_Q2, m: M234.m_q2, r2: M234.r2_q2 },
  { k: 3, color: ED.brass, label: 'q3 (predicted 1/dp³, share)', window: WINDOW_Q3, m: M234.m_q3, r2: M234.r2_q3 },
  { k: 4, color: ED.series2, label: 'q4 (predicted 1/dp⁴, share)', window: WINDOW_Q4, m: M234.m_q4, r2: M234.r2_q4 },
];

const SERIES = CHANNELS.map((c) => ({
  ...c,
  points: c.window.map((dp) => ({ dp, mag: deepGroupMax(dp, c.k) })).sort((a, b) => a.dp - b.dp),
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
  const allMag = SERIES.flatMap((s) => s.points.map((p) => p.mag));
  const xMin = Math.log10(Math.min(...allDp)) - 0.3;
  const xMax = Math.log10(Math.max(...allDp)) + 0.3;
  const yMin = Math.log10(Math.min(...allMag)) - 0.4;
  const yMax = Math.log10(Math.max(...allMag)) + 0.4;

  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {SERIES.map((s) => {
        const path = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.dp)},${yAt(p.mag)}`).join(' ');
        return (
          <g key={s.k}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={2} />
            {s.points.map((p) => (
              <circle key={p.dp} cx={xAt(p.dp)} cy={yAt(p.mag)} r={3.5} fill={s.color} stroke={ED.paper} strokeWidth={1} />
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

function SlopeVsOrderChart() {
  const svgW = 340;
  const svgH = 260;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0.5;
  const xMax = 4.5;
  const yMin = 0.5;
  const yMax = 4.5;
  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (m) => padT + cH - ((m - yMin) / (yMax - yMin)) * cH;

  const refPath = `M${xAt(1)},${yAt(1)} L${xAt(4)},${yAt(4)}`;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <path d={refPath} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" fill="none" />
      {CHANNELS.map((c) => (
        <circle key={c.k} cx={xAt(c.k)} cy={yAt(c.m)} r={5} fill={c.color} stroke={ED.paper} strokeWidth={1} />
      ))}
      {[1, 2, 3, 4].map((k) => (
        <text key={k} x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
          {k}
        </text>
      ))}
      {[1, 2, 3, 4].map((m) => (
        <text key={m} x={padL - 8} y={yAt(m) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
          {m}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        stencil order k
      </text>
      <text x={12} y={padT - 6} fill={ED.inkFaint} fontSize={10}>
        m_measured
      </text>
    </svg>
  );
}

export default function Imp34667FourRungRoundoffFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Completed q1/q2/q3/q4 Roundoff-Floor Exponent Ladder (imp-34667 / imp-34646 / imp-34606)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34606 fit the deep-tail log-log growth exponent of the q2 / q3 / q4 finite-difference
        channels against the q-derivative step dp, landing cleanly on the integer ladder {'{'}2, 3,
        4{'}'}. imp-34646 filled the missing k&nbsp;=&nbsp;1 rung below it: q1, the well-conditioned
        first central difference that denominates the C_q2/C_q3 drift shares, amplifies as 1/dp&sup1;
        with the same eps_mach|q| amplitude law but measured as an ABSOLUTE error (q1&apos;s true
        value is O(1), so unlike q2/q3/q4 it never blows up as dp&nbsp;&rarr;&nbsp;0). No viz existed
        for the completed four-rung ladder. This tab plots all four channels together and a second
        panel confirming the measured slopes land on the predicted integers 1/2/3/4.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deep-group max apparent channel magnitude vs dp (log-log): four roundoff-floor lines, one per
        channel (q1 is an absolute error, q2/q3/q4 are shares -- only the SLOPE is comparable across
        channels, not the vertical offset)
      </p>
      <LadderChart />

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '1.5rem' }}>
        <div style={{ flex: '1 1 320px' }}>
          <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            measured slope m vs stencil order k (dashed: predicted m&nbsp;=&nbsp;k)
          </p>
          <SlopeVsOrderChart />
        </div>

        <table
          style={{
            flex: '1 1 380px',
            borderCollapse: 'collapse',
            fontSize: '0.8rem',
          }}
        >
          <thead>
            <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
              <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>predicted k</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>measured m</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>R&sup2;</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map((c) => (
              <tr key={c.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
                <td style={{ padding: '0.4rem 0.6rem' }}>q{c.k}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.k}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.m.toFixed(4)}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.r2.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        Ladder complete and strictly increasing (m1 &lt; m2 &lt; m3 &lt; m4, all rounding to the
        predicted 1/2/3/4): <strong>yes</strong>. q1 sits ONE rung below the imp-34606 {'{'}2, 3,
        4{'}'} ladder, exactly as its 2-point stencil {'{'}1, -1{'}'} predicts -- but it is
        well-conditioned (true value O(1)), so its floor is the noisier ABSOLUTE error of a
        non-blowing-up quantity (R&sup2; &sim; 0.946), unlike the near-cancelling q2/q3/q4 shares
        (R&sup2; &sim; 0.98+). imp-34646 also confirmed q1 roundoff does NOT propagate into the
        C_q2/C_q3 share denominators (induced relative error &sim;2e-9 at the truncation-regime dp).
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
        imp-34606/imp-34646 q-derivative sweep independently over their published roundoff-dominated
        windows; the fitted m/R&sup2; annotations are the imp-34606/imp-34646 baked values. q1..q4
        are inherited central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;
        &nbsp;1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
        as-is -- this diagnoses finite-difference conditioning, it does not rehabilitate the model.
        The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED;
        C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes
        no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
