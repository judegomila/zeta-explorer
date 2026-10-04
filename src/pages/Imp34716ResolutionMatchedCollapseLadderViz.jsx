import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34689_RESOLUTION_MATCHED_COLLAPSE_2POW_K_RECOVERY } from '../data/imp-34689-resolution-matched-collapse-2pow-k-recovery.js';
import { ED } from '../styles/tokens.js';

const M = IMP34689_RESOLUTION_MATCHED_COLLAPSE_2POW_K_RECOVERY;

const K_VALS = [2, 3, 4];
const OBSERVED_R = [M.matched_collapse_q2, M.matched_collapse_q3, M.matched_collapse_q4];
const OBSERVED_LN = OBSERVED_R.map((v) => Math.log(v));
const PREDICTED_LN = M.predicted_collapse_2_pow_k.map((v) => Math.log(v));

// Three reference lines, all anchored through the k=2 observed point so only the SLOPE differs:
// the matched-resolution OLS fit (~0.75), the predicted ln2 geometric ladder (~0.6931), and the
// imp-34679 coarse spread-ratio slope (0.595) quoted for a like-for-like slope comparison.
const ANCHOR_LN = OBSERVED_LN[0];
const olsLineAt = (k) => ANCHOR_LN + M.log_linear_slope * (k - K_VALS[0]);
const predictedLineAt = (k) => ANCHOR_LN + M.predicted_log_linear_slope * (k - K_VALS[0]);
const coarseLineAt = (k) => ANCHOR_LN + M.imp34679_log_linear_slope * (k - K_VALS[0]);

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
  const allY = [
    ...OBSERVED_LN,
    ...PREDICTED_LN,
    olsLineAt(xMin),
    olsLineAt(xMax),
    predictedLineAt(xMin),
    predictedLineAt(xMax),
    coarseLineAt(xMin),
    coarseLineAt(xMax),
  ];
  const yMin = Math.min(...allY) - 0.15;
  const yMax = Math.max(...allY) + 0.15;

  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const olsPath = `M${xAt(xMin)},${yAt(olsLineAt(xMin))} L${xAt(xMax)},${yAt(olsLineAt(xMax))}`;
  const predPath = `M${xAt(xMin)},${yAt(predictedLineAt(xMin))} L${xAt(xMax)},${yAt(predictedLineAt(xMax))}`;
  const coarsePath = `M${xAt(xMin)},${yAt(coarseLineAt(xMin))} L${xAt(xMax)},${yAt(coarseLineAt(xMax))}`;

  const labels = ['q2', 'q3', 'q4'];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={coarsePath} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="2 3" />
      <path d={predPath} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5 4" />
      <path d={olsPath} fill="none" stroke={ED.series1} strokeWidth={2} />

      {K_VALS.map((k, i) => (
        <circle
          key={`pred-${k}`}
          cx={xAt(k)}
          cy={yAt(PREDICTED_LN[i])}
          r={4}
          fill="none"
          stroke={ED.rule}
          strokeWidth={1.5}
        />
      ))}
      {K_VALS.map((k, i) => (
        <circle
          key={`obs-${k}`}
          cx={xAt(k)}
          cy={yAt(OBSERVED_LN[i])}
          r={5}
          fill={ED.brassDeco}
          stroke={ED.paper}
          strokeWidth={1}
        />
      ))}
      {K_VALS.map((k, i) => (
        <text key={`lbl-${k}`} x={xAt(k) + 8} y={yAt(OBSERVED_LN[i]) - 8} fill={ED.ink} fontSize={10}>
          {labels[i]}
        </text>
      ))}

      <text x={padL} y={16} fill={ED.series1} fontSize={10}>
        matched-resolution OLS: slope &asymp; {M.log_linear_slope.toFixed(3)} (R&sup2; &asymp; {M.log_linear_r2.toFixed(3)})
      </text>
      <text x={padL} y={30} fill={ED.inkFaint} fontSize={10}>
        predicted 2&#7509; line: slope = ln 2 &asymp; {M.predicted_log_linear_slope.toFixed(4)}
      </text>
      <text x={padL} y={svgH - padB + 16} fill={ED.series2} fontSize={10}>
        imp-34679 coarse spread-ratio slope &asymp; {M.imp34679_log_linear_slope.toFixed(3)} (reference, anchored for slope comparison only)
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

export default function Imp34716ResolutionMatchedCollapseLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Resolution-Matched Collapse Ladder: r_k -&gt; 2^k Recovery (imp-34716 / imp-34689)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34679's coarse max-minus-min spread-ratio collapse factor ordered the q2/q3/q4
        finite-difference channels but undershot the predicted 2&#7509; ladder (log-linear slope
        &asymp; {M.imp34679_log_linear_slope}, R&sup2; &asymp; 0.897). imp-34689 re-read the same
        factor-2 dp comparison EXACTLY inside each channel roundoff window (geometric-averaged over
        several fixed 2:1 pairs) and recovered the ladder: r_k &asymp;{' '}
        {'{'}{OBSERVED_R.map((r) => r.toFixed(2)).join(', ')}{'}'} land on the predicted{' '}
        {'{'}{M.predicted_collapse_2_pow_k.join(', ')}{'}'}, and the per-channel log-log slopes m_k
        &asymp; {'{'}{M.per_channel_loglog_slope_m.map((m) => m.toFixed(3)).join(', ')}{'}'} round to
        exactly {'{'}{M.per_channel_loglog_slope_rounded.join(', ')}{'}'}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        ln(collapse_k) vs k: matched-resolution OLS fit (solid) vs predicted ln2 line (grey dashed)
        vs the imp-34679 coarse slope (red dotted, anchored for comparison only)
      </p>
      <CollapseLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>matched r_k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>predicted 2^k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slope m_k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>m_k rounded</th>
          </tr>
        </thead>
        <tbody>
          {['q2', 'q3', 'q4'].map((label, i) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{K_VALS[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{OBSERVED_R[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.predicted_collapse_2_pow_k[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.per_channel_loglog_slope_m[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.per_channel_loglog_slope_rounded[i]}</td>
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
        Matching resolution removes &asymp;{(100 * M.contamination_removed_frac).toFixed(0)}% of the
        imp-34679 obs/pred relative spread (0.44 &rarr; {M.obs_over_pred_rel_spread}), and the
        log-linear slope moves from {M.imp34679_log_linear_slope} (14% below ln&nbsp;2) to{' '}
        {M.log_linear_slope} (closer to ln&nbsp;2 &asymp; {M.predicted_log_linear_slope}). The residual
        (r_q3 &asymp; {OBSERVED_R[1]} vs 8, r_q4 &asymp; {OBSERVED_R[2]} vs 16; multiplicative steps
        r3/r2 &asymp; {M.mult_step_r3_over_r2}, r4/r3 &asymp; {M.mult_step_r4_over_r3} instead of the
        constant 2) is attributed to imp-34647 per-rung ULP-stochasticity, not a fractional exponent,
        since the per-channel slopes still round to the clean integers{' '}
        {'{'}{M.per_channel_loglog_slope_rounded.join(', ')}{'}'}.
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
        already-certified imp-34689 matched-resolution collapse ladder and its log-linear fit against
        the imp-34679 coarse baseline and the imp-34606/imp-34633 1/dp&#7509; prediction; establishes
        no new numerical claim. q1..q4 are inherited central differences, NOT fresh analytic closed
        forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime (imp-3220/imp-3406 component model least
        trustworthy) is inherited as-is. The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi)
        (imp-2714) ansatz are UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
