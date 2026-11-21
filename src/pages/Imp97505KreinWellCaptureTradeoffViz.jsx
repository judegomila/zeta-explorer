import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97505_CURVE,
  IMP97505_OPTIMUM,
  IMP97505_CSHARP_UPPER_BRACKET,
} from '../data/imp-97505-krein-well-capture-tradeoff-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97505: visualizes the imp-97483 U-shaped well-capture vs
// far-field-cost trade-off curve for the band-limited Krein minimiser at
// 2a=ln3 -- captured negative, incurred positive, and total vs confinement
// radius R, with the single interior minimum at R*=3.35 compared against
// the measured c_sharp upper bracket.

const COLOR_NEG = ED.series1;
const COLOR_POS = ED.series4;
const COLOR_TOT = ED.series5;
const COLOR_OPT = ED.series3;

function TradeoffPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 70;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rMin = 0;
  const rMax = 14;
  // log-scale on y since pos/tot span ~-500 to ~40000
  const yMin = -520;
  const yMax = 40000;

  const xOf = (R) => padL + ((R - rMin) / (rMax - rMin)) * plotW;
  // symlog-ish: linear near zero band, compressed for large magnitudes via sqrt scaling
  const scale = (v) => Math.sign(v) * Math.sqrt(Math.abs(v));
  const sMin = scale(yMin);
  const sMax = scale(yMax);
  const yOf = (v) => padT + plotH - ((scale(v) - sMin) / (sMax - sMin)) * plotH;

  const line = (key) =>
    IMP97505_CURVE.map((p) => `${xOf(p.R)},${yOf(p[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" />

      <polyline points={line('neg')} fill="none" stroke={COLOR_NEG} strokeWidth={1.8} />
      <polyline points={line('pos')} fill="none" stroke={COLOR_POS} strokeWidth={1.8} />
      <polyline points={line('tot')} fill="none" stroke={COLOR_TOT} strokeWidth={2.2} />

      {IMP97505_CURVE.map((p) => (
        <React.Fragment key={`pts${p.R}`}>
          <circle cx={xOf(p.R)} cy={yOf(p.neg)} r={3} fill={COLOR_NEG} />
          <circle cx={xOf(p.R)} cy={yOf(p.pos)} r={3} fill={COLOR_POS} />
          <circle cx={xOf(p.R)} cy={yOf(p.tot)} r={3.5} fill={COLOR_TOT} stroke={ED.paper} strokeWidth={1} />
        </React.Fragment>
      ))}

      <circle cx={xOf(IMP97505_OPTIMUM.Rstar)} cy={yOf(IMP97505_OPTIMUM.total)} r={6} fill="none" stroke={COLOR_OPT} strokeWidth={2} />
      <text x={xOf(IMP97505_OPTIMUM.Rstar) + 10} y={yOf(IMP97505_OPTIMUM.total) - 8} fill={COLOR_OPT} fontSize={9}>
        R*=3.35, total=6.83 (min)
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 2, 4, 6, 8, 10, 12, 14].map((r) => (
        <text key={`xr${r}`} x={xOf(r)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {r}
        </text>
      ))}
      {[-400, -100, 0, 100, 1000, 10000, 40000].map((v) => (
        <text key={`yv${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        confinement radius R (sqrt-compressed y-axis) &mdash;{' '}
        <tspan fill={COLOR_NEG}>captured negative</tspan>,{' '}
        <tspan fill={COLOR_POS}>incurred positive</tspan>,{' '}
        <tspan fill={COLOR_TOT}>total</tspan>
      </text>
    </svg>
  );
}

export default function Imp97505KreinWellCaptureTradeoffViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97483: The Well-Capture vs Far-Field-Cost Trade-off" />

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
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> every
        point below is reused verbatim from imp-97483. Measurement only
        &mdash; no operator positivity, no coercivity constant, no bound
        moves; interval-rigorous reach stays 2a&le;0.96; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For the pole-free symbol sigma_2(t) at 2a=ln3, a band-limited
        confinement family psi_R indexed by radius R trades off captured
        negative well depth against incurred positive far-field cost. Small
        R under-fills the wells; large R captures more depth but pays a
        ballooning t^4 far-field cost. The two curves cross to a single
        interior minimum of the total at R*=3.35.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        captured negative / incurred positive / total vs confinement radius R
      </h3>
      <TradeoffPanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        Measured c_sharp upper bracket: {IMP97505_CSHARP_UPPER_BRACKET}
        &mdash; the optimum total ({IMP97505_OPTIMUM.total}, converging to
        ~7.3) is still {IMP97505_OPTIMUM.ratioToCsharp}x above it. No choice
        of confinement radius closes the gap: the true minimiser reaches
        c_sharp by cardinal-series cancellation, not radius tuning.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97483 measured trade-off curve and optimum
        verbatim. Establishes no operator positivity; changes no bound; RH open; NO QED.
      </div>
    </div>
  );
}
