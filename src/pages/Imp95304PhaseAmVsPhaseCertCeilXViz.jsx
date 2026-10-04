import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95304_BOUNDS_VS_THETA,
  IMP95304_NOGO_CEILING,
  IMP95304_CERT_THRESHOLD,
  IMP95304_AM_THRESHOLD,
  IMP95304_CEILX_WITNESS,
} from '../data/imp-95304-phaseam-vs-phasecert-ceilx-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// log10(bound) vs log10(theta) for both PHASE-AM and PHASE-CERT, with the
// DC-NOGO 1/2 ceiling, both vacuity thresholds, and the CEIL-X witness
// (actual R, plotted below both curves at the same theta) marked.
function PhaseAmVsCertPanel() {
  const points = IMP95304_BOUNDS_VS_THETA;
  const svgW = 680;
  const padL = 56;
  const padR = 24;
  const svgH = 320;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = -1.75;
  const maxX = 0.22;
  const minY = -0.65;
  const maxY = 1.35;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const certLine = points.map((p) => `${xOf(p.logTheta)},${yOf(p.logCert)}`).join(' ');
  const amLine = points.map((p) => `${xOf(p.logTheta)},${yOf(p.logAM)}`).join(' ');
  const ceilingLog = Math.log10(IMP95304_NOGO_CEILING);
  const certThreshLog = Math.log10(IMP95304_CERT_THRESHOLD);
  const amThreshLog = Math.log10(IMP95304_AM_THRESHOLD);
  const ceilxLog = {
    x: Math.log10(IMP95304_CEILX_WITNESS.theta),
    yR: Math.log10(IMP95304_CEILX_WITNESS.actualR),
    yAM: Math.log10(IMP95304_CEILX_WITNESS.phaseAM),
    yCert: Math.log10(IMP95304_CEILX_WITNESS.phaseCert),
  };

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[-1.5, -1, -0.5, 0]}
      yTicks={[-0.5, 0, 0.5, 1]}
      xOf={xOf}
      yOf={yOf}
      xLabel="log10 theta (phase-alignment ratio)"
      yLabel="log10 bound, y_min = 1/4"
    >
      {/* DC-NOGO 1/2 ceiling */}
      <line x1={padL} y1={yOf(ceilingLog)} x2={padL + plotW} y2={yOf(ceilingLog)} stroke={ED.series2} strokeWidth={1.25} strokeDasharray="5 4" />
      <text x={padL + 6} y={yOf(ceilingLog) - 6} fill={ED.series2} fontSize={8.5}>
        DC-NOGO ceiling R = 1/2
      </text>
      {/* PHASE-CERT vacuity threshold */}
      <line x1={xOf(certThreshLog)} y1={padT} x2={xOf(certThreshLog)} y2={padT + plotH} stroke={ED.brassDeco} strokeWidth={1.25} strokeDasharray="5 4" />
      <text x={xOf(certThreshLog) + 6} y={padT + 12} fill={ED.brass} fontSize={8.5}>
        theta_0(cert) = {IMP95304_CERT_THRESHOLD.toFixed(4)}
      </text>
      {/* PHASE-AM vacuity threshold, strictly to the left of the CERT threshold */}
      <line x1={xOf(amThreshLog)} y1={padT} x2={xOf(amThreshLog)} y2={padT + plotH} stroke={ED.series5} strokeWidth={1.25} strokeDasharray="5 4" />
      <text x={xOf(amThreshLog) + 6} y={padT + 26} fill={ED.series5} fontSize={8.5}>
        theta_0'(AM) = {IMP95304_AM_THRESHOLD.toFixed(4)}
      </text>
      {/* PHASE-CERT curve */}
      <polyline points={certLine} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.85} />
      {/* PHASE-AM curve */}
      <polyline points={amLine} fill="none" stroke={ED.series3} strokeWidth={2.25} opacity={0.9} />
      {points.map((p) => (
        <circle key={`c${p.theta}`} cx={xOf(p.logTheta)} cy={yOf(p.logCert)} r={2} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {points.map((p) => (
        <circle key={`a${p.theta}`} cx={xOf(p.logTheta)} cy={yOf(p.logAM)} r={2} fill={ED.series3} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {/* CEIL-X witness: actual R sits above the ceiling but below both curves at the same theta */}
      <line x1={xOf(ceilxLog.x)} y1={yOf(ceilxLog.yR)} x2={xOf(ceilxLog.x)} y2={yOf(ceilxLog.yCert)} stroke={ED.series4} strokeWidth={1} strokeDasharray="2 3" opacity={0.7} />
      <circle cx={xOf(ceilxLog.x)} cy={yOf(ceilxLog.yR)} r={5} fill={ED.series4} stroke={ED.paper} strokeWidth={1.25} />
      <text x={xOf(ceilxLog.x) - 8} y={yOf(ceilxLog.yR) + 16} textAnchor="end" fill={ED.series4} fontSize={8.5}>
        CEIL-X actual R = 0.6962
      </text>
      <circle cx={xOf(ceilxLog.x)} cy={yOf(ceilxLog.yAM)} r={3.5} fill="none" stroke={ED.series4} strokeWidth={1.25} />
      <circle cx={xOf(ceilxLog.x)} cy={yOf(ceilxLog.yCert)} r={3.5} fill="none" stroke={ED.series4} strokeWidth={1.25} />
    </AxisFrame>
  );
}

export default function Imp95304PhaseAmVsPhaseCertCeilXViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="PHASE-AM Bound vs PHASE-CERT Bound and the CEIL-X Exceedance Point (imp-95254 / imp-95304)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a model-family numeric
        illustration, not a new theorem. It changes no Lambda bound and establishes no operator
        positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH does not
        follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95254 THEOREM PHASE-AM gives R(f) &le; (e^(-y_min)/4)(1 + 1/theta), strictly
        dominating the imp-95233 COROLLARY PHASE-CERT bound R(f) &le; e^(-y_min)/(2 theta) by
        the exact factor (1 + theta)/2 at every theta. At the fixed depth y_min = 1/4 (the
        imp-95254 PROP CEIL-X witness depth), the panel below plots both curves on a log-log
        scale, alongside the imp-95224 DC-NOGO 1/2 ceiling and the two vacuity thresholds
        where each curve crosses it &mdash; PHASE-AM's threshold sits strictly to the left of
        PHASE-CERT's, the entire content of imp-95254 property (iii). The orange marker plots
        the PROP CEIL-X witness: its actual ratio R = 0.6961749688026323 exceeds the 1/2
        ceiling even though its theta lies below both thresholds, while the two open circles
        directly above it show both certificate bounds still correctly majorize R there
        (PHASE-AM &asymp; 1.9663, PHASE-CERT &asymp; 3.5433).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        PHASE-AM (green) vs PHASE-CERT (blue) bound vs phase-alignment ratio theta
      </h3>
      <PhaseAmVsCertPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the green PHASE-AM
        curve sits strictly below the blue PHASE-CERT curve at every theta, with the gap
        narrowing to zero as theta &rarr; 1 (ratio (1+theta)/2 &rarr; 1, both reduce to the
        imp-95222 FA-2 sharp case) and widening toward a factor of 1/2 as theta &rarr; 0
        (PHASE-AM halves PHASE-CERT's loss in the deep-cancellation regime). The amber CEIL-X
        witness sits well to the left of both vacuity thresholds (theta = 0.1099 &lt;
        theta_0' = 0.6377 &lt; theta_0 = 0.7788): in that region both certificates exceed 1/2
        and are non-informative as sub-1/2 certificates, yet they still correctly
        bound the actual R = 0.6962 from above &mdash; there is no contradiction, only a region
        where phase currency alone cannot certify below the DC-NOGO ceiling.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-95304 baked viz-data (both curves recomputed independently from the imp-95254 /
        imp-95233 documented closed forms; the CEIL-X witness marker uses the exact literals
        from imp-95254's own assertions). Changes no bound, establishes no operator positivity,
        no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
