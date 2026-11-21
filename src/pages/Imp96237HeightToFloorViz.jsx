import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96237_THRESHOLD_POINTS,
  IMP96237_LAW_CURVE,
  IMP96237_BASELINE_MARKER,
  IMP96237_ANCHORS,
  IMP96237_HONEST_BANNER,
} from '../data/imp-96237-height-to-floor-viz-data.js';
import { ED } from '../styles/tokens.js';

function HeightFloorChart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logEs = [...IMP96237_LAW_CURVE.map((p) => p.logE), IMP96237_BASELINE_MARKER.logFrozenFloor];
  const logHs = [...IMP96237_LAW_CURVE.map((p) => p.logH), IMP96237_BASELINE_MARKER.logT_PT];
  const logEmin = Math.min(...logEs);
  const logEmax = Math.max(...logEs);
  const logHmin = Math.min(...logHs);
  const logHmax = Math.max(...logHs);

  const xOf = (logE) => padL + ((logE - logEmin) / (logEmax - logEmin)) * plotW;
  const yOf = (logH) => padT + plotH - ((logH - logHmin) / (logHmax - logHmin)) * plotH;

  const xTicks = [-7, -6, -5];
  const yTicks = [13, 14, 15, 16, 17, 18, 19];

  const linePath = IMP96237_LAW_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.logE).toFixed(2)} ${yOf(p.logH).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={1.5} opacity={0.9} />

      {/* frozen Platt-Trudgian baseline / floor contrast marker */}
      <circle
        cx={xOf(IMP96237_BASELINE_MARKER.logFrozenFloor)}
        cy={yOf(IMP96237_BASELINE_MARKER.logT_PT)}
        r={3.2}
        fill={ED.series2}
      />
      <text
        x={xOf(IMP96237_BASELINE_MARKER.logFrozenFloor) + 6}
        y={yOf(IMP96237_BASELINE_MARKER.logT_PT) - 6}
        fill={ED.series2}
        fontSize={8.5}
      >
        frozen floor 3.06e-5 @ T_PT=3e12
      </text>

      {IMP96237_THRESHOLD_POINTS.map((p) => (
        <circle key={p.targetFloor} cx={xOf(p.logE)} cy={yOf(p.logH)} r={2.8} fill={ED.series3} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        target floor E (log scale)
      </text>
      <text x={16} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        required height H (log scale)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={8} y2={0} stroke={ED.series1} strokeWidth={1.5} />
        <text x={12} y={3} fill={ED.inkSoft} fontSize={8.5}>{`H_required(E), slope -${IMP96237_ANCHORS.heightDecadesPerFloorDecade}`}</text>
        <circle cx={4} cy={13} r={2.8} fill={ED.series3} />
        <text x={12} y={16} fill={ED.inkSoft} fontSize={8.5}>tabulated thresholds (1e-5/1e-6/1e-7)</text>
        <circle cx={4} cy={26} r={3.2} fill={ED.series2} />
        <text x={12} y={29} fill={ED.inkSoft} fontSize={8.5}>frozen T_PT baseline (3e12, 3.06e-5)</text>
      </g>
    </svg>
  );
}

export default function Imp96237HeightToFloorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96207: Verified-Height-to-Floor Law H_required(E) = (prefactor/E)^(1/κ*)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96237_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        For a fixed certified exponent κ* = {IMP96237_ANCHORS.kappaStar} (prefactor {IMP96237_ANCHORS.prefactor.toFixed(1)}),
        the certified strip height required to reach a target truncation floor E follows
        H_required(E) = (prefactor/E)^(1/κ*) &mdash; a straight line in log-log space with slope
        &minus;{IMP96237_ANCHORS.heightDecadesPerFloorDecade} (green dots: the three imp-96207 tabulated
        thresholds 1e-5/1e-6/1e-7). The red marker is the frozen Platt&ndash;Trudgian branch-A
        contrast: at the actually-certified height T_PT = 3e12 the honest floor is 3.06e-5, just
        above the 1e-5 threshold.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log H_required vs log E (2.5 height-decades per floor-decade, ~{Math.round(IMP96237_ANCHORS.perFloorDecadeHeightFactor)}&times; per decade)
      </h3>
      <HeightFloorChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the line has exactly the
        same slope everywhere &mdash; there is no floor-dependent leverage, only the constant
        1/κ* = {-IMP96237_ANCHORS.inverseSensitivityExponent} decades-of-height per decade-of-floor. Driving the target floor E
        all the way to zero pushes the required height H off to infinity along this same line,
        under either named imp-96166 route (T_PT &rarr; infinity, or an N-decaying fixed-strip
        tail): the imp-96190 collapse made visual.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96207
        baked anchors/table/sensitivity verbatim (only the plotted log-log line samples are
        computed here, by evaluating the already-derived law). Changes no bound, establishes no
        operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
