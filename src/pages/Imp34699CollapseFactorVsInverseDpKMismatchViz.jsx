import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K } from '../data/imp-34679-share-collapse-ladder-vs-inverse-dp-k-prediction.js';
import { ED } from '../styles/tokens.js';

const M = IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K;

// Observed ln(collapse_k) points (q2, q3, q4 at k = 2, 3, 4), baked from the imp-34679 recomputation.
const K_VALS = [2, 3, 4];
const OBSERVED_COLLAPSE = [M.collapse_q2, M.collapse_q3, M.collapse_q4];
const OBSERVED_LN = OBSERVED_COLLAPSE.map((v) => Math.log(v));
const PREDICTED_LN = M.predicted_collapse_2_pow_k.map((v) => Math.log(v));

// OLS line ln(collapse_k) = intercept + slope * k, using the baked fit slope/R^2.
const K_MEAN = (K_VALS[0] + K_VALS[K_VALS.length - 1]) / 2;
const LN_MEAN = OBSERVED_LN.reduce((a, b) => a + b, 0) / OBSERVED_LN.length;
const OLS_INTERCEPT = LN_MEAN - M.log_linear_slope * K_MEAN;
const olsLineAt = (k) => OLS_INTERCEPT + M.log_linear_slope * k;

// Predicted ln2 geometric line, anchored through the same k=2 predicted point.
const PREDICTED_INTERCEPT = PREDICTED_LN[0] - M.predicted_log_linear_slope * K_VALS[0];
const predictedLineAt = (k) => PREDICTED_INTERCEPT + M.predicted_log_linear_slope * k;

function CollapseChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 1.5;
  const xMax = 4.5;
  const allY = [...OBSERVED_LN, ...PREDICTED_LN, olsLineAt(xMin), olsLineAt(xMax), predictedLineAt(xMin), predictedLineAt(xMax)];
  const yMin = Math.min(...allY) - 0.15;
  const yMax = Math.max(...allY) + 0.15;

  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const olsPath = `M${xAt(xMin)},${yAt(olsLineAt(xMin))} L${xAt(xMax)},${yAt(olsLineAt(xMax))}`;
  const predPath = `M${xAt(xMin)},${yAt(predictedLineAt(xMin))} L${xAt(xMax)},${yAt(predictedLineAt(xMax))}`;

  const labels = ['q2', 'q3', 'q4'];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={predPath} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5 4" />
      <path d={olsPath} fill="none" stroke={ED.series1} strokeWidth={2} />

      {K_VALS.map((k, i) => (
        <circle
          key={`obs-${k}`}
          cx={xAt(k)}
          cy={yAt(OBSERVED_LN[i])}
          r={5}
          fill={i === 1 ? ED.series2 : ED.brassDeco}
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
        observed OLS fit: slope &asymp; {M.log_linear_slope.toFixed(3)} (R&sup2; &asymp; {M.log_linear_r2.toFixed(3)})
      </text>
      <text x={padL} y={30} fill={ED.inkFaint} fontSize={10}>
        predicted 1/dp&#7509; line: slope = ln 2 &asymp; {M.predicted_log_linear_slope.toFixed(4)}
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

export default function Imp34699CollapseFactorVsInverseDpKMismatchViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Collapse-Factor-vs-1/dp^k Mismatch: OLS Fit vs Predicted ln2 Ladder (imp-34699 / imp-34679)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34679 tested whether the imp-34651 F3 share-spread collapse-factor ladder
        (q2 &asymp; {M.collapse_q2}x, q3 &asymp; {M.collapse_q3}x, q4 &asymp; {M.collapse_q4}x) QUANTITATIVELY
        tracks the 1/dp&#7509; roundoff-amplification ratio predicted by the imp-34606/imp-34633 clean
        {' '}{'{2,3,4}'} exponent ladder, or merely preserves the ORDERING. This tab plots
        ln(collapse_k) against the finite-difference order k, overlaying the observed least-squares
        line against the predicted ln&nbsp;2 geometric line -- no viz previously existed for this
        specific mismatch.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        ln(collapse_k) vs k: observed OLS fit (solid) vs predicted ln2 geometric line (dashed)
      </p>
      <CollapseChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>observed collapse_k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>predicted 2^k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>obs/pred ratio</th>
          </tr>
        </thead>
        <tbody>
          {['q2', 'q3', 'q4'].map((label, i) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{K_VALS[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{OBSERVED_COLLAPSE[i]}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.predicted_collapse_2_pow_k[i]}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: label === 'q3' ? 'var(--series-2)' : 'var(--ink)',
                }}
              >
                {M.obs_over_pred_ratios[i]}
                {label === 'q3' ? ' (dips below trend)' : ''}
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
        Observed slope &asymp; {M.log_linear_slope.toFixed(4)} undershoots the predicted ln&nbsp;2
        &asymp; {M.predicted_log_linear_slope.toFixed(4)} by &asymp;{' '}
        {(100 * (1 - M.log_linear_slope / M.predicted_log_linear_slope)).toFixed(1)}%, with
        R&sup2; &asymp; {M.log_linear_r2.toFixed(3)} -- low because the q3 rung (red) sits well
        below the geometric trend line. The ladder is still strictly ordered in k
        (ordered_by_k = {String(M.ordered_by_k)}), but a quantitative 1/dp&#7509; match fails
        (quantitative_1_over_dp_k_match = {String(M.quantitative_1_over_dp_k_match)}).
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
        already-certified imp-34679 collapse-factor and log-linear-fit values against the
        imp-34606/imp-34633 1/dp&#7509; prediction; establishes no new numerical claim. q1..q4 are
        inherited central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1
        deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is.
        The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED;
        C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes
        no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
