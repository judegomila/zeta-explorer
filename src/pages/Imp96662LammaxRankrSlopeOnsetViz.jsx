import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96662_MEASURED_POINTS,
  IMP96662_LOGISTIC_CURVE,
  IMP96662_EXP_CURVE,
  IMP96662_MARKERS,
} from '../data/imp-96662-lammax-rankr-slope-onset-viz-data.js';
import { ED } from '../styles/tokens.js';

function CurvePanel() {
  const svgW = 720;
  const padL = 48;
  const padR = 16;
  const svgH = 320;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rMax = 11;
  const bMax = 0.4;
  const xOf = (r) => padL + (r / rMax) * plotW;
  const yOf = (b) => padT + plotH - (b / bMax) * plotH;

  const pathFor = (curve) => curve.map(([r, b], i) => `${i === 0 ? 'M' : 'L'} ${xOf(r)} ${yOf(b)}`).join(' ');

  const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const yTicks = [0, 0.1, 0.2, 0.3, 0.4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((r) => (
        <g key={`x${r}`}>
          <line x1={xOf(r)} y1={padT} x2={xOf(r)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(r)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {r}
          </text>
        </g>
      ))}

      {/* target asymptote L = 0.3526 */}
      <line
        x1={padL}
        y1={yOf(IMP96662_MARKERS.targetSlope)}
        x2={padL + plotW}
        y2={yOf(IMP96662_MARKERS.targetSlope)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(IMP96662_MARKERS.targetSlope) - 4} textAnchor="end" fill={ED.inkSoft} fontSize={8}>
        L = 0.3526 (asymptote)
      </text>

      {/* exponential fit -- requested, poor / S-shaped */}
      <path d={pathFor(IMP96662_EXP_CURVE)} fill="none" stroke={ED.series2} strokeWidth={1.3} strokeDasharray="5 3" />

      {/* logistic fit -- honest summary */}
      <path d={pathFor(IMP96662_LOGISTIC_CURVE)} fill="none" stroke={ED.series1} strokeWidth={1.6} />

      {/* measured discrete points */}
      {IMP96662_MEASURED_POINTS.map(([r, b]) => (
        <circle key={`m${r}`} cx={xOf(r)} cy={yOf(b)} r={3.2} fill={ED.brassDeco} stroke={ED.ruleSoft} strokeWidth={0.5} />
      ))}

      {/* logistic half-saturation marker */}
      <circle
        cx={xOf(IMP96662_MARKERS.logistic.r0)}
        cy={yOf(IMP96662_MARKERS.logistic.halfSaturationB)}
        r={4.5}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.5}
      />
      <text
        x={xOf(IMP96662_MARKERS.logistic.r0)}
        y={yOf(IMP96662_MARKERS.logistic.halfSaturationB) - 10}
        textAnchor="middle"
        fill={ED.series1}
        fontSize={8.5}
      >
        r0 = {IMP96662_MARKERS.logistic.r0.toFixed(2)}
      </text>

      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        rank r
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        b_r (Rayleigh log-slope)
      </text>
    </svg>
  );
}

export default function Imp96662LammaxRankrSlopeOnsetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M lam_max Rank-r Slope Accumulation: b_r vs r" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96612 rank-r power-iteration Rayleigh log-slopes b_r (yellow points) converge to
        the imp-96443 measured leading log-coefficient L = {IMP96662_MARKERS.targetSlope.toFixed(4)}{' '}
        as r &rarr; &infin;. The imp-96636 fit shows the accumulation is a sigmoid, not an
        exponential saturation: the logistic b_r = L / (1 + e^-((r-r0)/k)) (blue, R&sup2; ={' '}
        {IMP96662_MARKERS.logistic.r2.toFixed(3)}) fits the delayed onset well, with half-saturation
        (inflection) rank r0 = {IMP96662_MARKERS.logistic.r0.toFixed(2)}; the requested
        fixed-amplitude single exponential (red dashed, R&sup2; ={' '}
        {IMP96662_MARKERS.expFixed.r2.toFixed(3)}) systematically misses the S-shaped onset.
      </p>

      <CurvePanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the exponential curve rises
        fastest at r = 0, but the measured points barely move there (b_1 / L ={' '}
        {(IMP96662_MEASURED_POINTS[1][1] / IMP96662_MARKERS.targetSlope * 100).toFixed(1)}%) --
        a rank-one surrogate captures almost none of the coefficient. The logistic instead delays
        its rise until around rank r &asymp; {Math.round(IMP96662_MARKERS.logistic.r0)}, matching
        the observed onset, and reaches 90% of L by rank 6.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page. All curve samples are
        baked literals computed offline from the closed-form fits already reported in
        imp-96636-route-m-lammax-slope-saturation-fit.js (scipy curve_fit); the imp-96636 module
        is not imported at runtime. Presentation only; establishes no new bound or operator
        positivity; the underlying fit is a measurement of a surrogate that converges to lam_max by
        construction, not a closed-form derivation of the 0.3526 coefficient. RH open. NO QED.
      </div>
    </div>
  );
}
