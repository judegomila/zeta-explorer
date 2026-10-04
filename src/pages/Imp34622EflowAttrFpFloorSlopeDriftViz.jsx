import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34586_LOCAL_SLOPES,
  IMP34586_SECOND_DIFFERENCES,
  IMP34586_SLOPE_DRIFT,
} from '../data/imp-34586-eflow-attr-fp-floor-far-side-ladder.js';
import { IMP34589_EFLOW_ANALYTIC_SLOPE_PER_K as ANALYTIC_SLOPE } from '../data/imp-34589-eflow-attr-far-side-power-law-slope-continuity.js';
import { ED } from '../styles/tokens.js';

const HANDOFF_SLOPE_2160 = -2.160976; // imp-34572 endpoint slope, the rung this ladder continues from

// Chart 1: local per-k log-slope drift vs k, monotone steepening toward the analytic reference.
function SlopeDriftChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 66;
  const padR = 24;
  const padT = 22;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 21.58;
  const kMax = 22.02;
  const yMin = -2.1645;
  const yMax = -2.1595;

  const xAt = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;
  const yAt = (s) => padT + cH - ((s - yMin) / (yMax - yMin)) * cH;

  const linePath = IMP34586_LOCAL_SLOPES.map(
    (r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.k)},${yAt(r.slopePerK)}`,
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {/* analytic E_flow slope reference */}
      <line
        x1={padL}
        y1={yAt(ANALYTIC_SLOPE)}
        x2={padL + cW}
        y2={yAt(ANALYTIC_SLOPE)}
        stroke={ED.series5}
        strokeWidth={1.5}
        strokeDasharray="6,3"
      />
      <text x={padL + cW - 210} y={yAt(ANALYTIC_SLOPE) - 6} fill={ED.series5} fontSize={10}>
        analytic E_flow slope {ANALYTIC_SLOPE}
      </text>

      {/* imp-34572 handoff rung k=21.60, for continuity context */}
      <circle cx={xAt(21.6)} cy={yAt(HANDOFF_SLOPE_2160)} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(21.6) - 40} y={yAt(HANDOFF_SLOPE_2160) + 16} fill={ED.series1} fontSize={9}>
        imp-34572 handoff
      </text>

      {/* the deep far-side ladder, k=21.70..22.00 */}
      <path d={linePath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {IMP34586_LOCAL_SLOPES.map((r) => (
        <circle key={r.k} cx={xAt(r.k)} cy={yAt(r.slopePerK)} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (log10 N = k+1)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        fill={ED.inkFaint}
        fontSize={10}
        textAnchor="middle"
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        d ln(eflow_attr) / dk
      </text>
    </svg>
  );
}

// Chart 2: second differences (convexity) vs k -- strictly positive, shrinking magnitude.
function ConvexityChart() {
  const svgW = 680;
  const svgH = 200;
  const padL = 76;
  const padR = 24;
  const padT = 18;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 21.72;
  const kMax = 21.98;
  const d2Vals = IMP34586_SECOND_DIFFERENCES.map((d) => d.d2);
  const yMin = 0;
  const yMax = Math.max(...d2Vals) * 1.15;

  const xAt = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const linePath = IMP34586_SECOND_DIFFERENCES.map(
    (d, i) => `${i === 0 ? 'M' : 'L'}${xAt(d.k)},${yAt(d.d2)}`,
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW - 90} y={yAt(0) - 6} fill={ED.inkFaint} fontSize={9}>
        d2 = 0 (convex above)
      </text>

      <path d={linePath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {IMP34586_SECOND_DIFFERENCES.map((d) => (
        <circle key={d.k} cx={xAt(d.k)} cy={yAt(d.d2)} r={3.5} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (log10 N = k+1)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        fill={ED.inkFaint}
        fontSize={10}
        textAnchor="middle"
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        d2(eflow_attr)/dk2
      </text>
    </svg>
  );
}

export default function Imp34622EflowAttrFpFloorSlopeDriftViz() {
  const first = IMP34586_LOCAL_SLOPES[0];
  const last = IMP34586_LOCAL_SLOPES[IMP34586_LOCAL_SLOPES.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="eflow_attr Far-Side Ladder to the fp Floor: Slope Drift & Convexity (imp-34622 / imp-34586)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34586 extended the imp-34572 far-side eflow_attr ladder past its top rung k = 21.60
        toward the double-precision floor, k = 21.70 .. 22.00. The local per-k log-slope drifts
        monotonically from {first.slopePerK} at k = {first.k} to {last.slopePerK} at k = {last.k}
        (total drift {IMP34586_SLOPE_DRIFT}), steepening smoothly toward the analytic E_flow
        slope {ANALYTIC_SLOPE} with no kink or acceleration. The second difference stays strictly
        positive over the same window, so the ladder's convexity is preserved all the way to the
        fp floor.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-k log-slope drift vs k: monotone steepening toward the analytic E_flow reference
      </p>
      <SlopeDriftChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        second difference vs k: strictly positive (convex), shrinking magnitude toward k = 22.00
      </p>
      <ConvexityChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>slope at k = {first.k} (top of window)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{first.slopePerK}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>slope at k = {last.k} (deepest rung)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{last.slopePerK}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>analytic E_flow per-k slope</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ANALYTIC_SLOPE}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>total slope drift across the window</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP34586_SLOPE_DRIFT}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>second-difference sign across window</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              all &gt; 0 ({IMP34586_SECOND_DIFFERENCES[0].d2} &rarr;{' '}
              {IMP34586_SECOND_DIFFERENCES[IMP34586_SECOND_DIFFERENCES.length - 1].d2})
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
        imp-34586 far-side ladder and imp-34589 analytic reference literals verbatim. eflow_attr
        is an inherited surrogate numerator, NOT a rigorous asymptotic; the component model is the
        inherited imp-3220/imp-3406 extrapolation; C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
