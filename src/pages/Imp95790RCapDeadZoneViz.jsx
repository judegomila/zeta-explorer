import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95790_CURVE_POINTS,
  IMP95790_LANDMARKS,
  IMP95790_CAVEAT_BANNER,
} from '../data/imp-95790-rcap-deadzone-viz-data.js';
import { IMP95801_ORDINATE_SOURCE_REACH_AUDIT } from '../data/imp-95801-ordinate-source-reach-audit.js';
import { IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE } from '../data/imp-95783-rtrue-vs-rcap-gap-deadzone.js';
import { IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY } from '../data/imp-95805-slack-exclude-c0-artifact-monotonicity.js';
import { ED, alpha } from '../styles/tokens.js';

const LANDMARK_COLOR = {
  ceiling: ED.series1,
  crossover: ED.series4,
  window_bottom: ED.series5,
};

// r_cap(T) vs log10 T: the seven measured envelope points, the three named
// dead-zone landmarks, the GUE asymptote r=1, and the (1 - r_cap) margin
// shaded between the curve and that asymptote.
function RCapChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const measuredRows = IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE.measuredRows;
  const ceilingLog10T = IMP95790_CURVE_POINTS[0].log10T;
  const xMin = Math.min(measuredRows[0].log10Tc, ceilingLog10T);
  const xMax = IMP95790_CURVE_POINTS[IMP95790_CURVE_POINTS.length - 1].log10T;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 1.05;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  // imp-95814: overlay the imp-95783 sub-ceiling measured-regime slack band
  // s(T) = rTrue/rCap so the chart visually distinguishes the measurable
  // regime (below the ceiling) from the dead zone above it.
  const rCapSubPath = measuredRows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.log10Tc)} ${yOf(r.rCap)}`)
    .join(' ');
  const rTrueSubPath = measuredRows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.log10Tc)} ${yOf(r.rTrue)}`)
    .join(' ');
  const slackBandPath =
    rCapSubPath +
    ' ' +
    measuredRows
      .slice()
      .reverse()
      .map((r) => `L ${xOf(r.log10Tc)} ${yOf(r.rTrue)}`)
      .join(' ') +
    ' Z';

  const curvePath = IMP95790_CURVE_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T)} ${yOf(p.rCap)}`,
  ).join(' ');

  // margin-below-1 band: along the curve, then back along r=1.
  const bandPath =
    curvePath +
    ` L ${xOf(xMax)} ${yOf(1)} L ${xOf(xMin)} ${yOf(1)} Z`;

  const gueY = yOf(1);
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* measurable regime (below ceiling, imp-95783) vs dead zone (above ceiling, imp-95766) */}
      <rect x={xOf(xMin)} y={padT} width={xOf(ceilingLog10T) - xOf(xMin)} height={plotH} fill={alpha(ED.series3, 0.05)} />
      <rect x={xOf(ceilingLog10T)} y={padT} width={xOf(xMax) - xOf(ceilingLog10T)} height={plotH} fill={alpha(ED.series2, 0.04)} />
      <text x={xOf(xMin) + 4} y={padT - 6} textAnchor="start" fill={ED.series3} fontSize={9}>
        measurable regime (imp-95783)
      </text>
      <text x={xOf(xMax) - 4} y={padT - 6} textAnchor="end" fill={ED.series2} fontSize={9}>
        dead zone (imp-95766)
      </text>

      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      {/* (1 - r_cap) margin-below-one band */}
      <path d={bandPath} fill={alpha(ED.series1, 0.1)} />

      {/* imp-95783 sub-ceiling slack band s(T) = rTrue/rCap between the true ratio and the envelope */}
      <path d={slackBandPath} fill={alpha(ED.series3, 0.18)} />
      <path d={rCapSubPath} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="2 3" />
      <path d={rTrueSubPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {measuredRows.map((r) => (
        <circle key={`rtrue-${r.Tc}`} cx={xOf(r.log10Tc)} cy={yOf(r.rTrue)} r={2.5} fill={ED.series3} />
      ))}

      {/* GUE / margin-top asymptote r_cap = 1 */}
      <line x1={padL} y1={gueY} x2={padL + plotW} y2={gueY} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={gueY - 5} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        conservatism ceiling r_cap=1
      </text>

      {IMP95790_LANDMARKS.map((m) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        return (
          <g key={m.name}>
            <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x} cy={yOf(m.rCap)} r={4} fill={color} />
          </g>
        );
      })}

      <path d={curvePath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP95790_CURVE_POINTS.map((p) => (
        <circle key={p.T} cx={xOf(p.log10T)} cy={yOf(p.rCap)} r={2.5} fill={ED.series1} />
      ))}

      {IMP95790_LANDMARKS.map((m, i) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        const anchor = i === 0 ? 'start' : i === IMP95790_LANDMARKS.length - 1 ? 'end' : 'middle';
        return (
          <text key={`lbl-${m.name}`} x={x} y={padT + 12 + i * 11} textAnchor={anchor} fill={color} fontSize={9}>
            {`${m.label}: r_cap=${m.rCap.toFixed(4)}`}
          </text>
        );
      })}

      {IMP95790_CURVE_POINTS.map((p) => (
        <text key={`tx${p.T}`} x={xOf(p.log10T)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {p.log10T.toFixed(1)}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(1)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 T
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        r_cap(T)
      </text>
    </svg>
  );
}

export default function Imp95790RCapDeadZoneViz() {
  const ceiling = IMP95790_LANDMARKS[0];
  const crossover = IMP95790_LANDMARKS[1];
  const windowBottom = IMP95790_LANDMARKS[2];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Number-Variance Cap r_cap(T) Dead-Zone Descent (imp-95766 / imp-95790)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95790_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95766 measured the imp-95722 derived envelope r_cap(T) across the ~3.28-decade
        dead zone that the imp-95750 direct sd(C&minus;E) measurement cannot reach: it falls
        monotonically from {ceiling.rCap.toFixed(4)} at the direct-measurement ceiling
        gamma_1e6&nbsp;=&nbsp;{ceiling.T.toExponential(3)}, through {crossover.rCap.toFixed(4)} at
        the imp-95729 crossover T0&nbsp;&asymp;&nbsp;{crossover.T.toExponential(2)}, down to{' '}
        {windowBottom.rCap.toFixed(4)} at the imp-95519 window bottom
        T&nbsp;=&nbsp;{windowBottom.T.toExponential(1)}. The shaded band is the margin
        (1&nbsp;&minus;&nbsp;r_cap) between the envelope and the conservatism ceiling r_cap&nbsp;=&nbsp;1:
        it only WIDENS with height across the dead zone.
      </p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Verified-ordinate reach ceiling (imp-95801 audit):</strong>{' '}
        the top verified Odlyzko ordinate anywhere in the repo is{' '}
        gamma_1e6&nbsp;=&nbsp;{IMP95801_ORDINATE_SOURCE_REACH_AUDIT.reachCeiling.value.toExponential(6)}{' '}
        ({IMP95801_ORDINATE_SOURCE_REACH_AUDIT.reachCeiling.source}). No other in-repo ordinate
        source or repo-wide sweep reaches higher, so 0% of the dead zone above this ceiling is
        closeable from in-repo data: all{' '}
        {IMP95801_ORDINATE_SOURCE_REACH_AUDIT.deadZoneClosure.remainingToCrossoverDecades.toFixed(2)}{' '}
        decades to the imp-95729 crossover and all{' '}
        {IMP95801_ORDINATE_SOURCE_REACH_AUDIT.deadZoneClosure.remainingToWindowBottomDecades.toFixed(2)}{' '}
        decades to the imp-95519 window bottom stay unreached by verified ordinates. Audit only;
        changes no bound; NO QED.
      </div>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 5%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Honest status (imp-95805):</strong> the sixth
        measured-regime slack point above, T&nbsp;=&nbsp;1.5e5, sits at s&nbsp;=&nbsp;1.0000
        only because it is the anchor pinning the imp-95766 offset C0 &mdash; a known artifact.
        Excluding that anchor point does NOT restore monotonicity in the remaining five heights:
        the sequence still steps down, down, UP, down (a U-shape, minimum at
        T&nbsp;=&nbsp;7e4, reversal upward at T&nbsp;=&nbsp;3e5, both far below the imp-95750
        ceiling gamma_1e6&nbsp;=&nbsp;{IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY.residualUShape.ceilingGamma1e6.toExponential(3)}).
        So no height-indexed lower proxy r_lo(T) can be extracted, and no two-sided bracket
        r_lo(T)&nbsp;&le;&nbsp;r(T)&nbsp;&le;&nbsp;r_cap(T) forms even below the ceiling: the
        one-sided bound r(T)&nbsp;&isin;&nbsp;(0, r_cap(T)] stands unchanged. Assessment only;
        changes no bound; NO QED.
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        r_cap(T) vs height (log scale), margin-below-one shaded
      </h3>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Green shading (below the ceiling) overlays the imp-95783 measured-regime slack band:
        the solid green line is the true ratio r(T), the dashed blue line the envelope r_cap(T)
        recomputed at the same six heights, and the gap between them is the slack s(T) = r/r_cap
        &isin; [0.7244, 1.0000]. Red shading (above the ceiling) is the imp-95766 dead zone, where
        no verified ordinates exist to measure that gap.
      </p>
      <RCapChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>log10 T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r_cap(T)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>margin (1&minus;r_cap)</th>
          </tr>
        </thead>
        <tbody>
          {IMP95790_CURVE_POINTS.map((p) => (
            <tr key={p.T} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{p.T.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>{p.log10T.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{p.rCap.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{p.marginBelowOne.toFixed(4)}</td>
            </tr>
          ))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        imp-95766 dead-zone measurement (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
