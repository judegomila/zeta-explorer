import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96646_ANCHORS,
  IMP96646_EPS_FIT,
  IMP96646_L1_FIT,
  IMP96646_WALL_BAND,
  IMP96646_LANDMARKS,
} from '../data/imp-96646-krein-certificate-margin-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// paired chart: certified eps margin (left axis, blue) and log10(l1) tail norm
// (right axis, orange) vs support 2a, over the narrow window [0.86, 1.06]
// that actually holds baked data (the three verified rungs plus both fits
// projected to the double-precision LP wall).
function MarginAndNormPanel() {
  const svgW = 720;
  const padL = 54;
  const padR = 54;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0.86;
  const xMax = 1.06;
  const xOf = (twoA) => padL + ((twoA - xMin) / (xMax - xMin)) * plotW;

  const epsMin = 0;
  const epsMax = 22;
  const yEpsOf = (eps) => padT + plotH - ((eps - epsMin) / (epsMax - epsMin)) * plotH;

  const logMin = 1.5;
  const logMax = 8.5;
  const yLogOf = (log10L1) => padT + plotH - ((log10L1 - logMin) / (logMax - logMin)) * plotH;

  const epsFitPath = `M ${xOf(xMin)} ${yEpsOf(Math.max(epsMin, IMP96646_EPS_FIT.slope * xMin + IMP96646_EPS_FIT.intercept))} L ${xOf(
    IMP96646_EPS_FIT.zeroTwoA,
  )} ${yEpsOf(0)}`;

  const l1FitPoints = [];
  for (let x = xMin; x <= xMax + 1e-9; x += (xMax - xMin) / 40) {
    l1FitPoints.push([x, IMP96646_L1_FIT.slope * x + IMP96646_L1_FIT.intercept]);
  }
  const l1FitPath = l1FitPoints
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xOf(x)} ${yLogOf(Math.min(logMax, y))}`)
    .join(' ');

  const epsTicks = [0, 5, 10, 15, 20];
  const logTicks = [2, 4, 6, 8];
  const xTicks = [0.9, 0.94, 0.96, 1.0, 1.04];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* double-precision LP wall band */}
      <rect
        x={xOf(IMP96646_WALL_BAND.loTwoA)}
        y={padT}
        width={xOf(IMP96646_WALL_BAND.hiTwoA) - xOf(IMP96646_WALL_BAND.loTwoA)}
        height={plotH}
        fill={alpha(ED.series2, 0.1)}
      />
      <text x={xOf((IMP96646_WALL_BAND.loTwoA + IMP96646_WALL_BAND.hiTwoA) / 2)} y={padT + 12} textAnchor="middle" fill={ED.series2} fontSize={8}>
        LP wall
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL + plotW} y1={padT} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {epsTicks.map((v) => (
        <g key={`e${v}`}>
          <line x1={padL} y1={yEpsOf(v)} x2={padL + plotW} y2={yEpsOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yEpsOf(v) + 3} textAnchor="end" fill={ED.series1} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {logTicks.map((v) => (
        <text key={`l${v}`} x={padL + plotW + 8} y={yLogOf(v) + 3} textAnchor="start" fill={ED.series4} fontSize={8.5}>
          1e{v}
        </text>
      ))}
      {xTicks.map((x) => (
        <g key={`x${x}`}>
          <line x1={xOf(x)} y1={padT} x2={xOf(x)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(x)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {x}
          </text>
        </g>
      ))}

      {/* eps linear fit, projected to zero at 2a = 1.0 */}
      <path d={epsFitPath} fill="none" stroke={ED.series1} strokeWidth={1.3} strokeDasharray="5 3" />
      {/* l1 log-linear fit */}
      <path d={l1FitPath} fill="none" stroke={ED.series4} strokeWidth={1.3} strokeDasharray="5 3" />

      {IMP96646_ANCHORS.map((r) => (
        <g key={`a${r.twoA}`}>
          <circle cx={xOf(r.twoA)} cy={yEpsOf(r.eps)} r={4} fill={ED.series1} />
          <circle cx={xOf(r.twoA)} cy={yLogOf(r.log10L1)} r={4} fill={ED.series4} />
        </g>
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        support 2a
      </text>
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.series1} fontSize={9} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        certified eps margin
      </text>
      <text
        x={svgW - 10}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.series4}
        fontSize={9}
        transform={`rotate(-90 ${svgW - 10} ${padT + plotH / 2})`}
      >
        tail l1-norm
      </text>
    </svg>
  );
}

// horizontal reach diagram: 2a from 0 to ln3, four segments (classical /
// interval-rigorous / LP wall / open), with ln2, 0.96, wall band and ln3 marked.
function ReachDiagram() {
  const svgW = 720;
  const svgH = 92;
  const padL = 20;
  const padR = 20;
  const barY = 40;
  const barH = 22;
  const xMax = 1.15;
  const plotW = svgW - padL - padR;
  const xOf = (twoA) => padL + (twoA / xMax) * plotW;

  const { ln2, interceptRigorousReach, wallLoTwoA, wallHiTwoA, ln3 } = IMP96646_LANDMARKS;

  const segments = [
    { from: 0, to: ln2, color: ED.inkFaint, label: 'classical (Yoshida / CC)' },
    { from: ln2, to: interceptRigorousReach, color: ED.series3, label: 'interval-rigorous (this work)' },
    { from: interceptRigorousReach, to: wallHiTwoA, color: ED.series2, label: 'LP wall' },
    { from: wallHiTwoA, to: ln3, color: ED.inkSoft, label: 'open (0.96 < 2a < ln3)' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {segments.map((s) => (
        <rect key={s.label} x={xOf(s.from)} y={barY} width={Math.max(0, xOf(s.to) - xOf(s.from))} height={barH} fill={s.color} />
      ))}
      <rect x={xOf(wallLoTwoA)} y={barY} width={xOf(wallHiTwoA) - xOf(wallLoTwoA)} height={barH} fill={ED.series2} opacity={0.55} />

      {[
        { at: ln2, label: 'ln2=0.693' },
        { at: interceptRigorousReach, label: '0.96' },
        { at: ln3, label: 'ln3=1.099' },
      ].map((m) => (
        <g key={m.label}>
          <line x1={xOf(m.at)} y1={barY - 6} x2={xOf(m.at)} y2={barY + barH + 6} stroke={ED.inkSoft} strokeWidth={1.2} />
          <text x={xOf(m.at)} y={barY - 10} textAnchor="middle" fill={ED.ink} fontSize={9}>
            {m.label}
          </text>
        </g>
      ))}
      <text x={xOf(interceptRigorousReach)} y={barY + barH + 20} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
        2a
      </text>
    </svg>
  );
}

export default function Imp96646KreinCertificateMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krein sigma2 Certificate Margin: Verified Rungs, eps -> 0 Wall, ln2 / ln3" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three interval-verified sigma_2 certificate rungs (2a = 0.90, 0.94, 0.96) have a certified
        margin eps(2a) = {IMP96646_EPS_FIT.slope}*(2a) + {IMP96646_EPS_FIT.intercept} (exactly
        linear, R^2 = {IMP96646_EPS_FIT.r2.toFixed(5)}) and a tail l1-norm growing log-linearly at
        slope {IMP96646_L1_FIT.slope.toFixed(2)} per unit 2a. The eps fit projects to zero at 2a ={' '}
        {IMP96646_EPS_FIT.zeroTwoA.toFixed(2)} (a = {IMP96646_EPS_FIT.zeroA.toFixed(2)}), coinciding
        with the observed double-precision LP conditioning wall.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Certified margin eps (blue) and tail l1-norm (orange) vs support 2a
      </h3>
      <MarginAndNormPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Reach diagram: 2a = 0 .. ln 3
      </h3>
      <ReachDiagram />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the dashed blue line is the
        linear fit through the three verified eps anchors, hitting zero exactly at 2a = 1.0; the
        dashed orange line is the log-linear fit through the same three anchors’ tail l1-norms
        (53.8 &rarr; 3.16e4 &rarr; 1.47e6), both independently pointing at the same double-precision
        LP conditioning wall (shaded red band, 2a in [1.00, 1.04]). The reach diagram below shows the
        interval-rigorous range (green) sits strictly past ln 2 = 0.693 but stops at 0.96, short of
        ln 3 = 1.099.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96646
        viz-data (every number reused verbatim from the Route I Krein certificate literals). The
        double-precision LP wall is a conditioning symptom, not a positivity failure: lambda_min(T_a[sigma_2])
        stays positive well past 2a = 1.0. Changes no bound, establishes no operator positivity, no RH
        claim. RH open. NO QED.
      </div>
    </div>
  );
}
