import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT } from '../data/imp-34648-plateau-drift-large-dp-truncation-sweet-spot.js';
import { ED, alpha } from '../styles/tokens.js';

const M = IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT;

// Climb points reproduced verbatim from the imp-34648/imp-34630 exported literals:
// the 2nd-order local order estimate at three dp anchors, approaching the predicted 2.
const CLIMB_POINTS = [
  { dp: 6e-2, order: M.order_at_6e2_imp34630, label: 'imp-34630' },
  { dp: M.sweet_spot_anchor_dp, order: M.sweet_spot_resolved_order, label: 'sweet spot' },
  { dp: 7.5e-2, order: M.order_at_7p5e2_imp34630, label: 'imp-34630' },
];

// Local scaling order (D_inf-free triple-ratio) vs geometric dp anchor: a broad plateau at the
// predicted order 2 emerges near dp ~ 7e-2, bounded below by the roundoff valley, sitting ~23x
// above the imp-34587 Richardson node -- a distinct, coarser optimum on a different dp scale.
function SweetSpotChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = Math.log10(2e-3);
  const xMax = Math.log10(1.3e-1);
  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;

  const yMin = 1.5;
  const yMax = 2.3;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const valleyX1 = padL;
  const valleyX2 = xAt(M.roundoff_valley_below_dp);
  const plateauX1 = xAt(6.8e-2);
  const plateauX2 = xAt(1.02e-1);
  const richardsonX = xAt(M.imp34587_richardson_node_dp);

  const climbPath = CLIMB_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.dp)},${yAt(p.order)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* roundoff valley: order estimate is noise below ~3.4e-2 */}
      <rect x={valleyX1} y={padT} width={valleyX2 - valleyX1} height={cH} fill={alpha(ED.series2, 0.08)} />
      <text x={(valleyX1 + valleyX2) / 2} y={padT + 14} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        roundoff valley (noise)
      </text>

      {/* plateau band: order stays within [plateau_order_min, plateau_order_max] near dp ~ 7e-2..1e-1 */}
      <rect
        x={plateauX1}
        y={yAt(M.plateau_order_max)}
        width={plateauX2 - plateauX1}
        height={yAt(M.plateau_order_min) - yAt(M.plateau_order_max)}
        fill={alpha(ED.series1, 0.12)}
      />
      <text x={(plateauX1 + plateauX2) / 2} y={yAt(M.plateau_order_max) - 6} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
        broad plateau ({M.plateau_order_min}..{M.plateau_order_max})
      </text>

      {/* predicted order = 2 reference line */}
      <line x1={padL} y1={yAt(M.predicted_order)} x2={padL + cW} y2={yAt(M.predicted_order)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW} y={yAt(M.predicted_order) - 5} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        predicted order = {M.predicted_order}
      </text>

      {/* imp-34587 Richardson node marker */}
      <line x1={richardsonX} y1={padT} x2={richardsonX} y2={padT + cH} stroke={ED.series5} strokeWidth={1.5} strokeDasharray="3,3" />
      <text x={richardsonX} y={padT + cH + 14} textAnchor="middle" fill={ED.series5} fontSize={8.5}>
        imp-34587 node (dp&sim;{M.imp34587_richardson_node_dp})
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={climbPath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {CLIMB_POINTS.map((p) => (
        <circle
          key={p.dp}
          cx={xAt(p.dp)}
          cy={yAt(p.order)}
          r={p.label === 'sweet spot' ? 5 : 3.5}
          fill={p.label === 'sweet spot' ? ED.series3 : ED.series1}
          stroke={ED.paper}
          strokeWidth={1}
        />
      ))}

      <text x={padL} y={16} fill={ED.series1} fontSize={10}>
        local order (2nd-order stencil) vs dp anchor
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        dp anchor (log scale, geometric triple {'{'}dp, 2dp, 4dp{'}'})
      </text>
    </svg>
  );
}

export default function Imp34671TruncationSweetSpotPlateauViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Large-dp Truncation Sweet Spot: A Broad Plateau at 2, Not the Richardson Node (imp-34671 / imp-34648)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34648 swept the D<sub>&infin;</sub>-free local scaling exponent of the imp-34630
        2nd-order large-dp drift arm across a fine geometric dp grid. The resolved exponent climbs
        from &sim;{M.order_at_6e2_imp34630} to &sim;{M.order_at_7p5e2_imp34630} and lands
        essentially exactly on the predicted {M.predicted_order} (&sim;{M.sweet_spot_resolved_order})
        at an anchor dp&nbsp;&sim;&nbsp;{M.sweet_spot_anchor_dp}. This is a BROAD plateau
        (order&nbsp;&sim;&nbsp;{M.plateau_order_min}..{M.plateau_order_max}, no upturn toward 4)
        rather than a sharp interior peak, bounded below by the roundoff valley
        (dp&nbsp;&lt;&nbsp;&sim;{M.roundoff_valley_below_dp}). It sits
        &sim;{M.sweet_spot_vs_imp34587_node_ratio}x above the unrelated imp-34587 Richardson node
        (dp&nbsp;&sim;{M.imp34587_richardson_node_dp}) &mdash; a distinct, coarser optimum on a
        different dp scale, not the same tuning.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        local order vs dp anchor, with roundoff valley, plateau band, and Richardson-node offset
      </p>
      <SweetSpotChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>sweet-spot dp anchor / resolved order</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.sweet_spot_anchor_dp} / {M.sweet_spot_resolved_order}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>plateau order range (dp &sim; 6.8e-2..1.02e-1)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.plateau_order_min} .. {M.plateau_order_max}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>roundoff valley boundary (order is noise below)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.roundoff_valley_below_dp}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>imp-34587 Richardson node dp</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.imp34587_richardson_node_dp}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>sweet spot / Richardson-node ratio</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.sweet_spot_vs_imp34587_node_ratio}x
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>imp-34630 coarse brackets (6e-2 / 7.5e-2)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.order_at_6e2_imp34630} / {M.order_at_7p5e2_imp34630}
            </td>
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
        imp-34648/imp-34630 measurement literals verbatim (climb points, plateau range, valley
        boundary, Richardson-node dp); no zeros bundle imported. Measurement only &mdash; this
        re-aggregates the already-certified imp-34611/imp-34630 decomposition through a finer local
        scaling-exponent grid and changes NO bound. q1,q2,q3 are inherited central differences, NOT
        fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime
        (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2 asymptote
        and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
