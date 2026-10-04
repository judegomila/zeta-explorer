import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34689_RESOLUTION_MATCHED_COLLAPSE_2POW_K_RECOVERY } from '../data/imp-34689-resolution-matched-collapse-2pow-k-recovery.js';
import { IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION } from '../data/imp-34712-second-footing-collapse-ladder-crossvalidation.js';
import { IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION } from '../data/imp-34730-third-footing-collapse-ladder-crossvalidation.js';
import { ED } from '../styles/tokens.js';

const F1 = IMP34689_RESOLUTION_MATCHED_COLLAPSE_2POW_K_RECOVERY;
const F2 = IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION;
const F3 = IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION;

const LABELS = ['q2', 'q3', 'q4'];
const K_VALS = [2, 3, 4];
const PREDICTED = F3.predicted_collapse_2_pow_k;

const R_K = [
  [F1.matched_collapse_q2, F1.matched_collapse_q3, F1.matched_collapse_q4],
  F3.imp34712_r_k_footing2,
  [F3.matched_collapse_q2_footing3, F3.matched_collapse_q3_footing3, F3.matched_collapse_q4_footing3],
];
const M_K = [F1.per_channel_loglog_slope_m, F2.per_channel_loglog_slope_m_footing2, F3.per_channel_loglog_slope_m_footing3];
const DEV = [F3.dev_from_2pow_k_footing1, F3.dev_from_2pow_k_footing2, F3.dev_from_2pow_k_footing3];
const FOOTING_COLORS = [ED.series1, ED.series7, ED.series5];
const FOOTING_LABELS = ['footing 1 (imp-34689)', 'footing 2 (imp-34712)', 'footing 3 (imp-34730)'];

const Q3_SIGN_PATTERN = F3.q3_three_footing_sign_pattern;
const Q4_SIGN_PATTERN = F3.q4_three_footing_sign_pattern;
const SIGN_ALTERNATES = [false, Q3_SIGN_PATTERN, Q4_SIGN_PATTERN];

function CollapseLadderChart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 1.5;
  const xMax = 4.5;
  const allLn = [...R_K.flat().map((v) => Math.log(v)), ...PREDICTED.map((v) => Math.log(v))];
  const yMin = Math.min(...allLn) - 0.15;
  const yMax = Math.max(...allLn) + 0.15;

  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const predPath = K_VALS.map((k, i) => `${i === 0 ? 'M' : 'L'}${xAt(k)},${yAt(Math.log(PREDICTED[i]))}`).join(' ');
  const footingPaths = R_K.map((rk) =>
    K_VALS.map((k, i) => `${i === 0 ? 'M' : 'L'}${xAt(k)},${yAt(Math.log(rk[i]))}`).join(' '),
  );

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={predPath} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5 4" />
      {footingPaths.map((d, fi) => (
        <path key={`path-${fi}`} d={d} fill="none" stroke={FOOTING_COLORS[fi]} strokeWidth={2} />
      ))}

      {K_VALS.map((k, i) => (
        <circle key={`pred-${k}`} cx={xAt(k)} cy={yAt(Math.log(PREDICTED[i]))} r={4} fill="none" stroke={ED.rule} strokeWidth={1.5} />
      ))}
      {R_K.map((rk, fi) =>
        K_VALS.map((k, i) => (
          <circle
            key={`f${fi}-${k}`}
            cx={xAt(k)}
            cy={yAt(Math.log(rk[i]))}
            r={5}
            fill={FOOTING_COLORS[fi]}
            stroke={i > 0 && SIGN_ALTERNATES[i][fi] !== SIGN_ALTERNATES[i][fi === 0 ? 0 : fi - 1] ? ED.brassDeco : ED.paper}
            strokeWidth={1}
          />
        )),
      )}
      {K_VALS.map((k, i) => (
        <text key={`lbl-${k}`} x={xAt(k) + 8} y={yAt(Math.log(PREDICTED[i])) - 8} fill={ED.ink} fontSize={10}>
          {LABELS[i]}
          {i > 0 ? ' (sign-flipping)' : ' (pinned)'}
        </text>
      ))}

      {FOOTING_LABELS.map((lbl, fi) => (
        <text key={`ftlbl-${fi}`} x={padL} y={16 + fi * 14} fill={FOOTING_COLORS[fi]} fontSize={10}>
          {lbl}: r_k &asymp; {R_K[fi].map((r) => r.toFixed(2)).join(', ')}
        </text>
      ))}
      <text x={padL} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={10}>
        predicted 2&#7509; line (grey dashed): {PREDICTED.join(', ')} -- q3/q4 alternate sign about it across all three footings
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

function signGlyph(s) {
  return s > 0 ? '+' : s < 0 ? '−' : '0';
}

export default function Imp34761ThreeFootingCollapseLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three-Footing Collapse Ladder: Mean-Zero ULP Scatter (imp-34761 / imp-34730 / imp-34712)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The resolution-matched collapse ladder r_k lands near the predicted 2&#7509; ladder{' '}
        {'{'}{PREDICTED.join(', ')}{'}'} on three independent deep-group footings, while the per-channel
        log-log slope m_k stays pinned to {'{2, 3, 4}'} on all three. The q3 and q4 rungs of r_k, however,
        alternate sign around the exact 2&#7509; line at every footing transition -- {'{'}
        {Q3_SIGN_PATTERN.map(signGlyph).join(', ')}{'}'} for q3 and {'{'}
        {Q4_SIGN_PATTERN.map(signGlyph).join(', ')}{'}'} for q4 -- which is only possible for mean-zero
        ULP-stochastic scatter about the line, not a genuine fixed fractional exponent.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        ln(collapse_k) vs k: footing 1 (blue), footing 2 (pink), footing 3 (violet) vs predicted 2&#7509;
        (grey dashed); gold-ringed markers flag rungs where the sign flipped from the prior footing
      </p>
      <CollapseLadderChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>predicted 2^k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r_k f1</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r_k f2</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r_k f3</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>m_k f1</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>m_k f2</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>m_k f3</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dev sign pattern</th>
          </tr>
        </thead>
        <tbody>
          {LABELS.map((label, i) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{PREDICTED[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{R_K[0][i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{R_K[1][i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{R_K[2][i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M_K[0][i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M_K[1][i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M_K[2][i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: i > 0 ? 'var(--brass)' : 'var(--ink-faint)' }}>
                {i === 0 ? 'n/a (pinned at 4.00)' : `{${DEV.map((d) => signGlyph(Math.sign(d[i]))).join(', ')}}`}
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
        {F3.per_channel_loglog_slope_rounded_footing3.join(', ')}{'}'} on all three footings -- the integer
        1/dp^k = 2&#7509; exponent structure is footing-INVARIANT. The r_k values and their deviation from
        2&#7509; are footing-DEPENDENT: q3 goes {'{'}-12.5%, +14.7%, -20.6%{'}'} and q4 goes {'{'}
        +11.9%, -0.1%, +22.5%{'}'} across footings 1/2/3 -- an alternating pattern impossible for a fixed
        fractional exponent, which would keep the same sign on every footing. This upgrades the imp-34712
        two-footing "variance" reading to the imp-34730 three-footing "mean-zero scatter" reading.
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
        already-certified imp-34689/imp-34712/imp-34730 three-footing cross-validation against the
        imp-34606/imp-34633 1/dp&#7509; prediction; establishes no new numerical claim. q1..q4 are inherited
        central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime
        (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2 asymptote and
        C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
