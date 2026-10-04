import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION } from '../data/imp-34712-second-footing-collapse-ladder-crossvalidation.js';
import { ED } from '../styles/tokens.js';

const M = IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION;

const LABELS = ['q2', 'q3', 'q4'];
const K_VALS = [2, 3, 4];
const R_FOOTING_1 = M.imp34689_r_k_footing1;
const R_FOOTING_2 = [
  M.matched_collapse_q2_footing2,
  M.matched_collapse_q3_footing2,
  M.matched_collapse_q4_footing2,
];
const PREDICTED = M.predicted_collapse_2_pow_k;
const SIGN_FLIPS = [false, M.q3_deviation_sign_flips, M.q4_deviation_sign_flips];

function CollapseLadderChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 1.5;
  const xMax = 4.5;
  const allLn = [
    ...R_FOOTING_1.map((v) => Math.log(v)),
    ...R_FOOTING_2.map((v) => Math.log(v)),
    ...PREDICTED.map((v) => Math.log(v)),
  ];
  const yMin = Math.min(...allLn) - 0.15;
  const yMax = Math.max(...allLn) + 0.15;

  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const predPath = K_VALS.map((k, i) => `${i === 0 ? 'M' : 'L'}${xAt(k)},${yAt(Math.log(PREDICTED[i]))}`).join(' ');
  const f1Path = K_VALS.map((k, i) => `${i === 0 ? 'M' : 'L'}${xAt(k)},${yAt(Math.log(R_FOOTING_1[i]))}`).join(' ');
  const f2Path = K_VALS.map((k, i) => `${i === 0 ? 'M' : 'L'}${xAt(k)},${yAt(Math.log(R_FOOTING_2[i]))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={predPath} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5 4" />
      <path d={f1Path} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={f2Path} fill="none" stroke={ED.series7} strokeWidth={2} />

      {K_VALS.map((k, i) => (
        <circle key={`pred-${k}`} cx={xAt(k)} cy={yAt(Math.log(PREDICTED[i]))} r={4} fill="none" stroke={ED.rule} strokeWidth={1.5} />
      ))}
      {K_VALS.map((k, i) => (
        <circle key={`f1-${k}`} cx={xAt(k)} cy={yAt(Math.log(R_FOOTING_1[i]))} r={5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      ))}
      {K_VALS.map((k, i) => (
        <circle
          key={`f2-${k}`}
          cx={xAt(k)}
          cy={yAt(Math.log(R_FOOTING_2[i]))}
          r={5}
          fill={ED.series7}
          stroke={SIGN_FLIPS[i] ? ED.brassDeco : ED.paper}
          strokeWidth={SIGN_FLIPS[i] ? 2.5 : 1}
        />
      ))}
      {K_VALS.map((k, i) => (
        <text key={`lbl-${k}`} x={xAt(k) + 8} y={yAt(Math.log(PREDICTED[i])) - 8} fill={ED.ink} fontSize={10}>
          {LABELS[i]}
          {SIGN_FLIPS[i] ? ' (sign flip)' : ''}
        </text>
      ))}

      <text x={padL} y={16} fill={ED.series1} fontSize={10}>
        footing 1 (imp-34689): r_k &asymp; {R_FOOTING_1.map((r) => r.toFixed(2)).join(', ')}
      </text>
      <text x={padL} y={30} fill={ED.series7} fontSize={10}>
        footing 2 (imp-34712): r_k &asymp; {R_FOOTING_2.map((r) => r.toFixed(2)).join(', ')}
      </text>
      <text x={padL} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={10}>
        predicted 2&#7509; line (grey dashed): {PREDICTED.join(', ')} -- gold-ringed markers show the F3 sign-flip rungs
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        finite-difference order k (q2=2, q3=3, q4=4)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        ln(collapse_k)
      </text>
    </svg>
  );
}

export default function Imp34747SecondFootingCollapseLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Second-Footing Collapse Ladder: Sign-Flip Cross-Validation (imp-34747 / imp-34712)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34689 recovered a resolution-matched collapse ladder r_k &asymp;{' '}
        {'{'}{R_FOOTING_1.map((r) => r.toFixed(2)).join(', ')}{'}'} landing on the predicted 2&#7509;
        ladder {'{'}{PREDICTED.join(', ')}{'}'}, but its q3/q4 rungs sat slightly off the exact line.
        imp-34712 recomputed the entire ladder on a SECOND, independent deep-group footing: r_k &asymp;{' '}
        {'{'}{R_FOOTING_2.map((r) => r.toFixed(2)).join(', ')}{'}'}. The integer exponents m_k stayed
        pinned to {'{2, 3, 4}'} on both footings, but the q3 and q4 deviations from 2&#7509; both{' '}
        <strong>flipped sign</strong> between footings -- a genuine fractional exponent would keep the
        same deviation sign on every footing, so a sign flip is only possible for stochastic scatter about
        the exact {'{4, 8, 16}'} line.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        ln(collapse_k) vs k: footing 1 (blue) vs footing 2 (pink) vs predicted 2&#7509; (grey dashed);
        gold-ringed markers flag the sign-flip rungs
      </p>
      <CollapseLadderChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>predicted 2^k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r_k footing 1</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r_k footing 2</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dev footing 1</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dev footing 2</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sign flip?</th>
          </tr>
        </thead>
        <tbody>
          {LABELS.map((label, i) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{PREDICTED[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{R_FOOTING_1[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{R_FOOTING_2[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.dev_from_2pow_k_footing1[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.dev_from_2pow_k_footing2[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: SIGN_FLIPS[i] ? 'var(--brass)' : 'var(--ink-faint)' }}>
                {SIGN_FLIPS[i] ? 'YES' : 'n/a (pinned)'}
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
        Per-channel log-log slopes m_k round to exactly {'{'}
        {M.per_channel_loglog_slope_rounded_footing2.join(', ')}{'}'} on the second footing, identical to
        footing 1 -- the integer 1/dp^k = 2&#7509; exponent structure is footing-INVARIANT. The r_k values
        themselves and their deviation sign are footing-DEPENDENT: q3 moves from ~12.5% below 8 to ~14.7%
        above 8, and q4 from ~11.9% above 16 to ~0.1% below 16. Both signs flip, which confirms the imp-34689
        F3 residual is imp-34647 per-rung ULP-stochastic scatter about the exact 2&#7509; line, not a genuine
        fractional exponent.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, plotting the
        already-certified imp-34712 second-footing cross-validation against the imp-34689 first footing and
        the imp-34606/imp-34633 1/dp&#7509; prediction; establishes no new numerical claim. q1..q4 are
        inherited central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1
        deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2
        asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
