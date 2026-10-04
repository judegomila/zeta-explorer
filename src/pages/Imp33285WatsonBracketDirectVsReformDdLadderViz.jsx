import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33285_K0,
  IMP33285_K_LEAD,
  IMP33285_CROSS_CHECK,
  IMP33285_LADDER,
  IMP33285_ALL_TAU,
} from '../data/imp-33285-watson-bracket-direct-vs-reform-dd-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const DIRECT_COLOR = ED.series2;
const REFORM_COLOR = ED.series1;
const MODEL_COLOR = ED.series7;

function log10Abs(v) { return Math.log10(Math.abs(v)); }

function scaleY(v, min, max, cH) {
  return cH * (1 - (v - min) / (max - min));
}

function DivergenceChart() {
  const svgW = 620;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const min = 0;
  const max = 7;
  const points = IMP33285_ALL_TAU;
  const n = points.length;
  const step = cW / (n - 1);
  const xAt = (i) => padL + i * step;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => {
        const y = padT + scaleY(v, min, max, cH);
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke={ED.ruleSoft} strokeWidth={0.7} />
            <text x={padL - 6} y={y + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              1e{v}
            </text>
          </g>
        );
      })}

      {/* K0 = 3.46 gate */}
      <line
        x1={padL}
        y1={padT + scaleY(log10Abs(IMP33285_K0), min, max, cH)}
        x2={padL + cW}
        y2={padT + scaleY(log10Abs(IMP33285_K0), min, max, cH)}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <text x={padL + cW - 4} y={padT + scaleY(log10Abs(IMP33285_K0), min, max, cH) - 6} textAnchor="end" fill={ED.brass} fontSize={9}>
        K0 = 3.46
      </text>

      {/* direct route: diverges */}
      <polyline
        points={points.map((p, i) => `${xAt(i)},${padT + scaleY(log10Abs(p.direct), min, max, cH)}`).join(' ')}
        fill="none"
        stroke={DIRECT_COLOR}
        strokeWidth={2}
      />
      {points.map((p, i) => (
        <circle key={`direct-${p.tau}`} cx={xAt(i)} cy={padT + scaleY(log10Abs(p.direct), min, max, cH)} r={3.5} fill={DIRECT_COLOR} />
      ))}

      {/* reform+DD route: recovered, tracks model */}
      <polyline
        points={points.map((p, i) => {
          const v = p.reformDD !== undefined ? p.reformDD : p.direct;
          return `${xAt(i)},${padT + scaleY(log10Abs(v), min, max, cH)}`;
        }).join(' ')}
        fill="none"
        stroke={REFORM_COLOR}
        strokeWidth={2}
      />
      {points.map((p, i) => {
        const v = p.reformDD !== undefined ? p.reformDD : p.direct;
        return <circle key={`reform-${p.tau}`} cx={xAt(i)} cy={padT + scaleY(log10Abs(v), min, max, cH)} r={3.5} fill={REFORM_COLOR} />;
      })}

      {/* closed model: only defined on the ladder rows */}
      <polyline
        points={IMP33285_LADDER.map((p) => {
          const i = points.indexOf(p);
          return `${xAt(i)},${padT + scaleY(log10Abs(p.model), min, max, cH)}`;
        }).join(' ')}
        fill="none"
        stroke={MODEL_COLOR}
        strokeWidth={1.5}
        strokeDasharray="3,3"
      />

      {points.map((p, i) => (
        <text key={`label-${p.tau}`} x={xAt(i)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          tau={p.tau}
        </text>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        log10 |rhoRatio(tau)|
      </text>
    </svg>
  );
}

function LadderTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>tau</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>direct (route A)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>reform + DD (route B)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>closed model</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>|B - model|</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
          <td style={{ padding: '0.35rem 0.5rem' }}>{IMP33285_CROSS_CHECK.tau}</td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: DIRECT_COLOR }}>
            {IMP33285_CROSS_CHECK.direct.toPrecision(7)}
          </td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: REFORM_COLOR }}>
            {IMP33285_CROSS_CHECK.reformDD.toPrecision(7)}
          </td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: 'var(--ink-faint)' }}>--</td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: 'var(--ink-faint)' }}>reliable-window cross-check</td>
        </tr>
        {IMP33285_LADDER.map((p) => (
          <tr key={p.tau} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{p.tau}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: DIRECT_COLOR }}>
              {p.direct.toExponential(3)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: REFORM_COLOR }}>
              {p.reformDD.toPrecision(7)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: MODEL_COLOR }}>
              {p.model.toPrecision(7)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.diffModel.toExponential(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33285WatsonBracketDirectVsReformDdLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Watson-Bracket Direct-vs-Reform+DD Ladder (imp-33248)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33248 ran the imp-33208 Watson-majorant bracket reconstruction in
        two arithmetics at tau in {'{'}4, 5, 6{'}'} (plus a tau=3
        reliable-window cross-check). The DIRECT single-double route
        (bracket = exp(lnAn1 + T - ln(Phi0/4))) suffers catastrophic
        cancellation of two magnitudes ~pi e^4tau and diverges past the
        imp-3730 floor. The CANCELLATION-FREE reformulation -- folding the -T
        subtraction analytically per quadrature node, then accumulating in
        double-double (u_dd = 2^-106) -- recovers a genuine signal that tracks
        the imp-3892 closed two-term model K_lead + K6 e^-2tau to
        ~5.9e-8 / ~5.0e-6 / ~1.0e-4.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10 |rhoRatio(tau)| -- direct route (red, diverging) vs reform+DD
        route (blue, recovered) vs closed model (dashed pink)
      </p>
      <DivergenceChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured ladder
      </p>
      <LadderTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> at
        tau=3 (reliable window) both routes agree. Past tau ~ 3.5 the direct
        route (red) climbs off the chart -- -3.53, -389, -2.31e6 at
        tau=4,5,6, the known imp-3730 cancellation floor -- while the
        reform+DD route (blue) stays flat and on top of the closed model
        (dashed pink), converging onto K_lead = {IMP33285_K_LEAD.toFixed(4)}.
        The K0 = 3.46 gate (amber, dashed) is a floor reference only; the
        recovered route never approaches it in log-magnitude terms. imp-33248
        additionally found the reform route is BIT-IDENTICAL between plain
        double and double-double at tau in {'{'}4, 5{'}'} (ddMinusPlain = 0),
        so the analytic reformulation -- not extended precision -- does the
        recovery; double-double adds only a ~7.06e-5 tail correction at
        tau=6.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, of an already-verified table (imp-33248). Measurement/
        reconstruction only, not a proof; mass-feasibility is
        necessary-but-not-sufficient; operator positivity (imp-3066 K_a &ge; 0)
        is UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
