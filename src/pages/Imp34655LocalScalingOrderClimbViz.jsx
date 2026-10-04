import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER } from '../data/imp-34630-plateau-drift-large-dp-scaling-order.js';
import { ED } from '../styles/tokens.js';

const M = IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER;
const ROWS = M.order_rows;

// Local scaling-order estimate per geometric sub-bracket: 2nd-order stencil climbs toward the
// predicted O(dp^2) exponent while the 4th-order stencil stays flat/noisy (no O(dp^4) signature).
function OrderClimbChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xAt = (i) => padL + (ROWS.length === 1 ? cW / 2 : (i / (ROWS.length - 1)) * cW);
  const yMin = -6;
  const yMax = 4.5;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const order2Points = ROWS.map((r, i) => [i, r.order_2nd]).filter(([, v]) => v !== null);
  const order4Points = ROWS.map((r, i) => [i, r.order_4th]).filter(([, v]) => v !== null);
  const path2nd = order2Points.map(([i, v], k) => `${k === 0 ? 'M' : 'L'}${xAt(i)},${yAt(v)}`).join(' ');
  const path4th = order4Points.map(([i, v], k) => `${k === 0 ? 'M' : 'L'}${xAt(i)},${yAt(v)}`).join(' ');

  const predicted2Y = yAt(M.order_2nd_predicted);
  const predicted4Y = yAt(M.order_4th_predicted);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={predicted2Y} x2={padL + cW} y2={predicted2Y} stroke={ED.series1} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={predicted2Y - 5} textAnchor="end" fill={ED.series1} fontSize={9}>
        predicted O(dp^2) = {M.order_2nd_predicted}
      </text>

      <line x1={padL} y1={predicted4Y} x2={padL + cW} y2={predicted4Y} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={predicted4Y - 5} textAnchor="end" fill={ED.brass} fontSize={9}>
        predicted O(dp^4) = {M.order_4th_predicted}
      </text>

      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={path2nd} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={path4th} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="4,3" />

      {order2Points.map(([i, v]) => (
        <circle key={`o2-${i}`} cx={xAt(i)} cy={yAt(v)} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      ))}
      {order4Points.map(([i, v]) => (
        <circle key={`o4-${i}`} cx={xAt(i)} cy={yAt(v)} r={3} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}
      {ROWS.map((r, i) => (
        <text
          key={`lbl-${i}`}
          x={xAt(i)}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={8.5}
          fontFamily="monospace"
        >
          {r.triple}
        </text>
      ))}

      <text x={padL} y={16} fill={ED.series1} fontSize={10}>
        2nd-order (5-point) local order -- climbs toward 2
      </text>
      <text x={padL + 260} y={16} fill={ED.brass} fontSize={10}>
        4th-order (7-point) local order -- flat/noise
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        geometric sub-bracket triple (dp, 2dp, 4dp)
      </text>
    </svg>
  );
}

export default function Imp34655LocalScalingOrderClimbViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Local Scaling-Order Climb: 2nd-Order Resolves O(dp^2), 4th-Order Flat (imp-34655 / imp-34630)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34630 fit the D<sub>&infin;</sub>-free local scaling exponent of the imp-34611 large-dp
        drift arm across geometric sub-brackets of dp. The 2nd-order (5-point) stencil&apos;s local
        order climbs from &sim;{M.order_2nd_large_dp_arm_a} to &sim;{M.order_2nd_large_dp_arm_b}
        &nbsp;toward the predicted O(dp<sup>2</sup>) exponent of {M.order_2nd_predicted}, a real
        resolved truncation drift. The 4th-order (7-point) stencil shows no such signature: its
        order estimates are sign-indefinite noise (NaN or &sim;{M.order_4th_large_dp_arm_b}), far
        from the predicted O(dp<sup>4</sup>) exponent of {M.order_4th_predicted} &mdash; that
        truncation term lies below the double-precision noise floor over this range.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fitted local order vs geometric sub-bracket, with predicted O(dp^2) / O(dp^4) reference lines
      </p>
      <OrderClimbChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp sub-bracket triple</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local order (2nd-order stencil)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local order (4th-order stencil)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.triple} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.triple}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.order_2nd === null ? 'NaN (noise)' : r.order_2nd}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.order_4th === null ? 'NaN (noise)' : r.order_4th}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1rem' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>2nd-order flat-tail spread (dp &ge; 3e-2)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.flat_tail_spread_2nd_order}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>4th-order flat-tail spread (dp &ge; 3e-2)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.flat_tail_spread_4th_order}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>imp-34611 full-tail 4th-order spread (reproduced)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.imp34611_full_tail_spread_4th}</td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, reusing the
        imp-34630 measurement literals verbatim (order rows, predicted exponents, flat-tail
        spreads). Distinct from the imp-34611/imp-34639 spread viz &mdash; this plots the fitted
        local scaling ORDER, not the raw drift spread. q1,q2,q3 are inherited central differences,
        NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime
        (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2 asymptote
        and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no
        bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
