import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  katoTempleUpperTwoLevel,
  IMP_96188_LAM_SECOND_SIGNED,
  IMP_96188_LAM_BOTTOM,
  IMP_96188_LITERALS,
  IMP_96188_ASSESSMENT,
} from '../data/imp-96188-route-i-kato-temple-real-spectrum-recalibration.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
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

// panel 1: near-threshold zoom, eps in [0, 0.015] -- both certify-thresholds fall inside this window
function ThresholdZoomPanel() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const epsMax = 0.015;
  const steps = 150;
  const adj = [];
  const bot = [];
  for (let i = 0; i <= steps; i++) {
    const eps = (epsMax * i) / steps;
    adj.push({ eps, U: katoTempleUpperTwoLevel(eps, IMP_96188_LAM_SECOND_SIGNED).U });
    bot.push({ eps, U: katoTempleUpperTwoLevel(eps, IMP_96188_LAM_BOTTOM).U });
  }
  const minY = 0.999;
  const maxY = 1.006;
  const xOf = (eps) => padL + (eps / epsMax) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [1.0, 1.002, 1.004, 1.006];
  const xTicks = [0, 0.005, 0.01, 0.015];

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="eps (single-mode leak overlap)"
      yLabel="U(eps) Kato-Temple upper bound"
    >
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <text x={padL + 4} y={yOf(1) - 5} fill={ED.series2} fontSize={9}>
        U = 1 (certify boundary)
      </text>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(3)}
        </text>
      ))}
      <line
        x1={xOf(IMP_96188_LITERALS.bottomTwinThresholdEps)}
        y1={padT}
        x2={xOf(IMP_96188_LITERALS.bottomTwinThresholdEps)}
        y2={padT + plotH}
        stroke={ED.series4}
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.7}
      />
      <text x={xOf(IMP_96188_LITERALS.bottomTwinThresholdEps) + 3} y={padT + 10} fill={ED.series4} fontSize={8.5}>
        bottom-twin thr 1.19e-3
      </text>
      <line
        x1={xOf(IMP_96188_LITERALS.adjacentThresholdEps)}
        y1={padT}
        x2={xOf(IMP_96188_LITERALS.adjacentThresholdEps)}
        y2={padT + plotH}
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.7}
      />
      <text x={xOf(IMP_96188_LITERALS.adjacentThresholdEps) + 3} y={padT + 22} fill={ED.series1} fontSize={8.5}>
        adjacent thr 8.42e-3
      </text>
      <polyline
        points={adj.map((p) => `${xOf(p.eps)},${yOf(p.U)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.9}
      />
      <polyline
        points={bot.map((p) => `${xOf(p.eps)},${yOf(p.U)}`).join(' ')}
        fill="none"
        stroke={ED.series4}
        strokeWidth={2}
        opacity={0.9}
      />
    </AxisFrame>
  );
}

// panel 2: full range up to the Kato-Temple validity boundary -- shows the bottom-twin
// leak's U(eps) blowing up (R -> alpha) while the adjacent-state leak stays near U~1.
function ValidityBoundaryPanel() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const epsMax = 0.33;
  const cap = 5;
  const steps = 200;
  const adj = [];
  const bot = [];
  for (let i = 0; i <= steps; i++) {
    const eps = (epsMax * i) / steps;
    adj.push({ eps, U: katoTempleUpperTwoLevel(eps, IMP_96188_LAM_SECOND_SIGNED).U });
    const { U, valid } = katoTempleUpperTwoLevel(eps, IMP_96188_LAM_BOTTOM);
    if (valid && U <= cap) bot.push({ eps, U });
  }
  const minY = 0.9;
  const maxY = cap;
  const xOf = (eps) => padL + (eps / epsMax) * plotW;
  const yOf = (v) => padT + plotH - ((Math.min(v, cap) - minY) / (maxY - minY)) * plotH;
  const yTicks = [1, 2, 3, 4, 5];
  const xTicks = [0, 0.1, 0.2, 0.3];
  const boundaryEps = IMP_96188_LITERALS.ktValidityBoundaryEps;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="eps (single-mode leak overlap)"
      yLabel="U(eps), capped at 5"
    >
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}
      <line
        x1={xOf(boundaryEps)}
        y1={padT}
        x2={xOf(boundaryEps)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
        opacity={0.8}
      />
      <text x={xOf(boundaryEps) - 4} y={padT + 12} textAnchor="end" fill={ED.series2} fontSize={8.5}>
        R = alpha: KT invalid beyond eps~0.3245
      </text>
      <polyline
        points={adj.map((p) => `${xOf(p.eps)},${yOf(p.U)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.9}
      />
      <polyline
        points={bot.map((p) => `${xOf(p.eps)},${yOf(p.U)}`).join(' ')}
        fill="none"
        stroke={ED.series4}
        strokeWidth={2}
        opacity={0.9}
      />
      <text x={xOf(bot[bot.length - 1].eps) - 4} y={yOf(bot[bot.length - 1].U) - 6} textAnchor="end" fill={ED.series4} fontSize={8.5}>
        U diverges as eps to 0.3245
      </text>
    </AxisFrame>
  );
}

export default function Imp96214KatoTempleUepsViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I: Kato-Temple U(eps) on the Real Semilocal {oo,2} Spectrum" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP_96188_ASSESSMENT.honestLimits}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Kato-Temple upper bound U(eps) = R(eps) + &sigma;&sup2;(eps) / (R(eps) - &alpha;) on the top
        eigenvalue of the real measured semilocal {'{'}&infin;,2{'}'} prolate spectrum was recalibrated
        (imp-96188) from a stylized 5-level toy to the actual FFT-Mellin spectrum. Two single-mode leaks
        are compared: an <span style={{ color: 'var(--series-1)' }}>adjacent-state leak</span> into the second-largest
        signed eigenvalue lam_2 = 0.6202012, and a <span style={{ color: 'var(--series-4)' }}>bottom-twin leak</span>{' '}
        into the second near-modulus-1 eigenvalue lam_S(1) = -0.9927022 (absent from the toy model).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Near-threshold zoom: where each leak stops certifying U &lt; 1
      </h3>
      <ThresholdZoomPanel />
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the bottom-twin curve (orange)
        crosses U = 1 at eps ~ {IMP_96188_LITERALS.bottomTwinThresholdEps.toExponential(2)}, about 7x
        tighter than the adjacent-state curve's (blue) crossing at eps ~{' '}
        {IMP_96188_LITERALS.adjacentThresholdEps.toExponential(2)} &mdash; imperfect capture of the fractal
        top eigenfunction is punished far harder if it leaks into the bottom twin.
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        Full range: the bottom-twin leak blows up approaching the validity boundary
      </h3>
      <ValidityBoundaryPanel />
      <div
        style={{
          marginTop: '1.25rem',
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the adjacent-state curve (blue)
        stays close to 1 across the whole displayed range, while the bottom-twin curve (orange) rises
        past U = 5 well before the Kato-Temple validity boundary eps ~ 0.3245, where R falls to the
        anchor &alpha; and the bound stops being valid at all &mdash; a hard ceiling with no analog in
        the stylized toy.
      </div>

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
        <strong style={{ color: 'var(--series-2)' }}>Verdict:</strong> {IMP_96188_LITERALS.verdict}
      </div>
    </div>
  );
}
