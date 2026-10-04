import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35864_DIGIT_LADDER,
  IMP35864_DIGIT_LAW,
  IMP35864_PRECISION_THRESHOLDS,
  IMP35864_TPT_EXTRAPOLATION,
} from '../data/imp-35864-debruijn-digit-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const MEASURED_COLOR = ED.series1;
const LAW_COLOR = ED.series4;
const DOUBLE_COLOR = ED.series8;
const QUAD_COLOR = ED.series7;

function DigitLadderChart() {
  const w = 680;
  const padL = 48;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = w - padL - padR;
  const plotH = 300;
  const h = padT + plotH + padB;

  const xMin = 104;
  const xMax = 1000;
  const yMin = 0;
  const yMax = 185;
  const xOf = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yOf = (d) => padT + plotH - ((d - yMin) / (yMax - yMin)) * plotH;

  const measuredPath = IMP35864_DIGIT_LADDER.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.x)} ${yOf(p.Dstar)}`
  ).join(' ');
  const lawPath = IMP35864_DIGIT_LADDER.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.x)} ${yOf(p.law)}`
  ).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        working digits D*(x) vs x (measured, BigInt)
      </text>

      {[0, 40, 80, 120, 160].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* double precision (~15.95 digit) band */}
      <line
        x1={padL}
        y1={yOf(IMP35864_PRECISION_THRESHOLDS.doubleDigits)}
        x2={padL + plotW}
        y2={yOf(IMP35864_PRECISION_THRESHOLDS.doubleDigits)}
        stroke={DOUBLE_COLOR}
        strokeWidth={1.25}
        strokeDasharray="3 3"
      />
      <text
        x={padL + plotW - 4}
        y={yOf(IMP35864_PRECISION_THRESHOLDS.doubleDigits) - 4}
        textAnchor="end"
        fill={DOUBLE_COLOR}
        fontSize={9}
      >
        double (~{IMP35864_PRECISION_THRESHOLDS.doubleDigits.toFixed(2)} digits)
      </text>

      {/* quad precision (~33.9 digit) band */}
      <line
        x1={padL}
        y1={yOf(IMP35864_PRECISION_THRESHOLDS.quadDigits)}
        x2={padL + plotW}
        y2={yOf(IMP35864_PRECISION_THRESHOLDS.quadDigits)}
        stroke={QUAD_COLOR}
        strokeWidth={1.25}
        strokeDasharray="3 3"
      />
      <text
        x={padL + plotW - 4}
        y={yOf(IMP35864_PRECISION_THRESHOLDS.quadDigits) - 4}
        textAnchor="end"
        fill={QUAD_COLOR}
        fontSize={9}
      >
        quad (~{IMP35864_PRECISION_THRESHOLDS.quadDigits.toFixed(1)} digits)
      </text>

      {/* quad reach x marker */}
      <line
        x1={xOf(IMP35864_PRECISION_THRESHOLDS.quadReachX)}
        y1={padT}
        x2={xOf(IMP35864_PRECISION_THRESHOLDS.quadReachX)}
        y2={padT + plotH}
        stroke={QUAD_COLOR}
        strokeWidth={1}
        strokeDasharray="2 4"
        opacity={0.6}
      />

      <path d={lawPath} fill="none" stroke={LAW_COLOR} strokeWidth={1.5} strokeDasharray="6 3" />
      <path d={measuredPath} fill="none" stroke={MEASURED_COLOR} strokeWidth={2.25} />

      {IMP35864_DIGIT_LADDER.map((p) => (
        <g key={p.x}>
          <circle cx={xOf(p.x)} cy={yOf(p.Dstar)} r={3} fill={MEASURED_COLOR} />
          {p.label && (
            <text
              x={xOf(p.x)}
              y={yOf(p.Dstar) - 8}
              textAnchor="middle"
              fill={ED.ink}
              fontSize={9}
              fontWeight={700}
            >
              {p.label}
            </text>
          )}
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={h - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        x -- double edge (104) .. quad reach (~{IMP35864_PRECISION_THRESHOLDS.quadReachX.toFixed(0)}) .. 1000
      </text>

      <g>
        <circle cx={padL + 4} cy={padT + 8} r={3} fill={MEASURED_COLOR} />
        <text x={padL + 12} y={padT + 11} fill={MEASURED_COLOR} fontSize={8.5}>
          measured D*(x)
        </text>
        <line x1={padL + 110} y1={padT + 8} x2={padL + 130} y2={padT + 8} stroke={LAW_COLOR} strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={padL + 135} y={padT + 11} fill={LAW_COLOR} fontSize={8.5}>
          pi/(8 ln10).x law
        </text>
      </g>
    </svg>
  );
}

function LadderTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>x</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>gamma = x/2</th>
          <th style={{ padding: '0.4rem 0.6rem', color: MEASURED_COLOR }}>D*(x) measured</th>
          <th style={{ padding: '0.4rem 0.6rem', color: LAW_COLOR }}>law = pi/(8 ln10).x</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
        </tr>
      </thead>
      <tbody>
        {IMP35864_DIGIT_LADDER.map((p) => (
          <tr key={p.x} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.x}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.gamma}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: MEASURED_COLOR }}>{p.Dstar}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: LAW_COLOR }}>{p.law.toFixed(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem' }}>{p.label || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35864DebruijnDigitLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Exact de Bruijn Working-Digit Ladder D*(x) (imp-35864 / imp-35811)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35811 ran genuine ~520-digit BigInt arithmetic (Machin-series pi, range-reduced
        repeated-squaring exp) to MEASURE the minimum working-digit count D*(x) the exact de Bruijn
        evaluator needs to keep the exponentially-small signal |H&#8320;(x)|&nbsp;~&nbsp;exp(-&pi;x/8)
        resolvable to 3 significant figures off the O(1) integrand accumulator K&nbsp;~&nbsp;6.214e-2,
        at a ladder of x above the double-precision ceiling (x&nbsp;~&lt;&nbsp;104, &gamma;&nbsp;~&lt;&nbsp;52).
        The measured ladder rises LINEARLY at slope&nbsp;~&nbsp;{IMP35864_DIGIT_LAW.slopeMeasured.toFixed(4)}
        &nbsp;digits per unit x, matching the pi/(8&nbsp;ln10)&nbsp;~&nbsp;{IMP35864_DIGIT_LAW.digitsPerX.toFixed(5)}
        &nbsp;law with a small +{IMP35864_DIGIT_LAW.guardOffset.toFixed(2)} guard offset.
      </p>

      <DigitLadderChart />

      <div style={{ marginTop: '1.5rem' }}>
        <LadderTable />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Quad precision (IEEE binary128, ~{IMP35864_PRECISION_THRESHOLDS.quadDigits.toFixed(1)} decimal
        digits) is exhausted at x&nbsp;~&nbsp;{IMP35864_PRECISION_THRESHOLDS.quadReachX.toFixed(1)}
        &nbsp;(~doubling the double-precision reach). Extrapolating the MEASURED slope to the
        Platt-Trudgian target x&nbsp;=&nbsp;2.T_PT&nbsp;=&nbsp;{IMP35864_TPT_EXTRAPOLATION.xTPT.toExponential(0)}
        &nbsp;needs&nbsp;~{IMP35864_TPT_EXTRAPOLATION.digitsTPTMeasured.toExponential(2)}&nbsp;decimal
        digits (~{IMP35864_TPT_EXTRAPOLATION.gigabytesTPT.toFixed(0)}&nbsp;GB of mantissa per evaluated
        value) -- a categorical wall far outside the plotted x&nbsp;in&nbsp;[104,1000] range, confirmed
        here by actual high-precision arithmetic rather than an assumed slope.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of the
        already-derived imp-35811 BigInt measurement (no new derivation, no heavy data-module import,
        no ~520-digit recomputation at page load); measures ONLY the exp(-&pi;x/8) underflow-driven
        mantissa-digit requirement off the imp-35781-measured accumulator scale K; evaluates no true
        H&#8320; at high precision, extends no evaluator, certifies no value at any height, changes no
        bound. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35863-krawczyk-split-inversion', label: 'Krawczyk Surplus-Split Height-Axis Inversion' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
