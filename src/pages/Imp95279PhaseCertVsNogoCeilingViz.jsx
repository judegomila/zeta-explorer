import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95279_BOUND_VS_THETA,
  IMP95279_E_NEG_YMIN,
  IMP95279_NOGO_CEILING,
  IMP95279_VACUITY_THETA,
  IMP95279_SIGNED_WITNESS,
  IMP95279_POSCONE_WITNESS,
} from '../data/imp-95279-phasecert-vs-nogo-ceiling-viz-data.js';
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

// log10(bound) vs log10(theta), with the DC-NOGO 1/2 ceiling and the
// theta = e^(-y_min) vacuity threshold marked, plus the two imp-95233
// exact witnesses (signed, poscone) that sit on the curve.
function PhaseCertPanel() {
  const points = IMP95279_BOUND_VS_THETA;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = -1.75;
  const maxX = 0.2;
  const minY = -1.15;
  const maxY = 0.85;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const line = points.map((p) => `${xOf(p.logTheta)},${yOf(p.logBound)}`).join(' ');
  const ceilingLog = Math.log10(IMP95279_NOGO_CEILING);
  const thresholdLog = Math.log10(IMP95279_VACUITY_THETA);
  const signedLog = { x: Math.log10(IMP95279_SIGNED_WITNESS.theta), y: Math.log10(IMP95279_SIGNED_WITNESS.bound) };
  const posconeLog = { x: Math.log10(IMP95279_POSCONE_WITNESS.theta), y: Math.log10(IMP95279_POSCONE_WITNESS.bound) };

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[-1.5, -1, -0.5, 0]}
      yTicks={[-1, -0.5, 0, 0.5]}
      xOf={xOf}
      yOf={yOf}
      xLabel="log10 theta (phase-alignment ratio)"
      yLabel="log10 bound = log10[e^(-y_min)/(2 theta)]"
    >
      {/* DC-NOGO 1/2 ceiling */}
      <line
        x1={padL}
        y1={yOf(ceilingLog)}
        x2={padL + plotW}
        y2={yOf(ceilingLog)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="5 4"
      />
      <text x={padL + 6} y={yOf(ceilingLog) - 6} fill={ED.series2} fontSize={8.5}>
        DC-NOGO ceiling R = 1/2
      </text>
      {/* PHASE-CERT vacuity threshold theta_0 = e^(-y_min) */}
      <line
        x1={xOf(thresholdLog)}
        y1={padT}
        x2={xOf(thresholdLog)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="5 4"
      />
      <text
        x={xOf(thresholdLog) + 6}
        y={padT + 12}
        fill={ED.brass}
        fontSize={8.5}
      >
        theta_0 = e^(-y_min) = {IMP95279_VACUITY_THETA.toFixed(4)}
      </text>
      <polyline points={line} fill="none" stroke={ED.series1} strokeWidth={2.25} opacity={0.9} />
      {points.map((p) => (
        <circle key={p.theta} cx={xOf(p.logTheta)} cy={yOf(p.logBound)} r={2.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      ))}
      {/* witness markers */}
      <circle cx={xOf(signedLog.x)} cy={yOf(signedLog.y)} r={5} fill={ED.series4} stroke={ED.paper} strokeWidth={1.25} />
      <text x={xOf(signedLog.x) + 8} y={yOf(signedLog.y) - 6} fill={ED.series4} fontSize={8.5}>
        signed witness (3,-4): theta=1/33, bound=4.125
      </text>
      <circle cx={xOf(posconeLog.x)} cy={yOf(posconeLog.y)} r={5} fill={ED.series3} stroke={ED.paper} strokeWidth={1.25} />
      <text x={xOf(posconeLog.x) - 6} y={yOf(posconeLog.y) + 16} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        poscone (3,4) = FA-2: theta=1, bound=0.125
      </text>
    </AxisFrame>
  );
}

export default function Imp95279PhaseCertVsNogoCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="PHASE-CERT Bound vs DC-NOGO Ceiling and Vacuity Threshold (imp-95233 / imp-95279)" />

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
        imp-95233 COROLLARY PHASE-CERT gives a phase-priced signed seam certificate
        R(f) &le; e^(-y_min)/(2 theta), where theta is the phase-alignment ratio and
        y_min the depth. At the fixed depth y_min = 2 ln 2 (e^(-y_min) = 1/4), the panel
        below plots this bound against theta on a log-log scale, alongside the imp-95224
        COROLLARY DC-NOGO symmetry ceiling R = 1/2 (the fixed bound that co-centered
        signed families saturate at any depth) and the PHASE-CERT vacuity threshold
        theta_0 = e^(-y_min), the exact theta at which the curve crosses the ceiling.
        Below theta_0 the bound sits above 1/2 (vacuous); above theta_0 it drops below
        1/2, escaping the depth-only no-go.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        PHASE-CERT bound vs phase-alignment ratio theta
      </h3>
      <PhaseCertPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the imp-95233 exact
        signed witness c = (3,-4) (theta = 1/33 &asymp; 0.0303, below the amber threshold
        theta_0 = 0.25) sits far above the red 1/2 ceiling at bound = 4.125 -- the crude,
        vacuous regime flagged by imp-95233's HONEST LIMITS. The positive-cone envelope
        c = (3,4) (theta = 1, above the threshold) sits at bound = 0.125, well below the
        ceiling, where PHASE-CERT reduces to imp-95222 FA-2 with no slack. The crossing
        point itself is exact and depth-independent in form: bound(theta_0) =
        e^(-y_min)/(2 e^(-y_min)) = 1/2 for any y_min, so the threshold theta_0 = e^(-y_min)
        always marks precisely where phase currency starts to beat the depth-only ceiling.
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
        imp-95279 baked viz-data (the curve recomputed independently from the imp-95233
        documented closed form bound = e^(-y_min)/(2 theta); the two witness markers are the
        exact literals from imp-95233's own assertions). Changes no bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
        NO QED.
      </div>
    </div>
  );
}
