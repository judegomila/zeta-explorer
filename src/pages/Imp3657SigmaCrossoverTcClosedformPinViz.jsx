import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3657_BRACKET,
  IMP3657_CROSSOVER_FACTOR,
  IMP3657_GRID,
  IMP3657_BASELINE,
  IMP3657_SWING_COMPARISON,
} from '../data/imp-3657-sigma-crossover-tc-closedform-pin-viz-data.js';

const PINNED_COLOR = '#38bdf8';
const FROZEN_COLOR = '#f87171';
const BAND_FILL = 'rgba(56,189,248,0.18)';
const BRACKET_SWING_COLOR = '#fbbf24';
const PINNED_SWING_COLOR = '#10b981';

function BracketPositionChart() {
  const svgW = 640;
  const padL = 30;
  const padR = 30;
  const padT = 36;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = 90;
  const svgH = padT + cH + padB;

  const xMin = IMP3657_BRACKET.min;
  const xMax = IMP3657_BRACKET.top;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;

  const bandX0 = xS(IMP3657_CROSSOVER_FACTOR.cg1);
  const bandX1 = xS(IMP3657_CROSSOVER_FACTOR.cg2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <rect x={bandX0} y={padT} width={Math.max(bandX1 - bandX0, 2)} height={cH} fill={BAND_FILL} />

      <line x1={xS(IMP3657_BRACKET.frozen)} y1={padT} x2={xS(IMP3657_BRACKET.frozen)} y2={padT + cH} stroke={FROZEN_COLOR} strokeWidth={2} strokeDasharray="5,3" />

      <line x1={bandX0} y1={padT + cH * 0.5} x2={bandX1} y2={padT + cH * 0.5} stroke={PINNED_COLOR} strokeWidth={3} />
      <circle cx={bandX0} cy={padT + cH * 0.5} r={4.5} fill={PINNED_COLOR} />
      <circle cx={bandX1} cy={padT + cH * 0.5} r={4.5} fill={PINNED_COLOR} />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[IMP3657_BRACKET.min, IMP3657_BRACKET.top].map((v) => (
        <g key={v}>
          <line x1={xS(v)} y1={padT + cH} x2={xS(v)} y2={padT + cH + 6} stroke="#334155" strokeWidth={1} />
          <text x={xS(v)} y={padT + cH + 19} textAnchor="middle" fill="#64748b" fontSize={9}>
            {v.toFixed(6)}
          </text>
        </g>
      ))}

      <text x={xS(IMP3657_BRACKET.frozen)} y={padT - 8} textAnchor="middle" fill="#fca5a5" fontSize={9}>
        frozen imp-3580: {IMP3657_BRACKET.frozen.toFixed(6)} (~50%)
      </text>
      <text x={(bandX0 + bandX1) / 2} y={padT + cH + 36} textAnchor="middle" fill="#7dd3fc" fontSize={9}>
        closed-form pin: {IMP3657_CROSSOVER_FACTOR.cg1.toFixed(7)} .. {IMP3657_CROSSOVER_FACTOR.cg2.toFixed(7)}
        {' '}({(IMP3657_CROSSOVER_FACTOR.bracketFraction_cg1 * 100).toFixed(1)}%..{(IMP3657_CROSSOVER_FACTOR.bracketFraction_cg2 * 100).toFixed(1)}% of bracket)
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={10}>
        imp-3604 bracket [1, 1.000474] for the crossover-scale flow factor exp(C_G t_c(N_x))
      </text>
    </svg>
  );
}

function RatioBandChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const fMin = 0.4;
  const fMax = 2.1;
  const rMin = 0.99;
  const rMax = 1.0;

  const xS = (f) => padL + ((f - fMin) / (fMax - fMin)) * cW;
  const yS = (r) => padT + cH * (1 - (r - rMin) / (rMax - rMin));

  const dPinned = IMP3657_GRID.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r.pinned).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0.99, 0.992, 0.994, 0.996, 0.998, 1.0].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      <path d={dPinned} fill="none" stroke={PINNED_COLOR} strokeWidth={2} />
      {IMP3657_GRID.map((r) => (
        <circle key={r.factor} cx={xS(r.factor)} cy={yS(r.pinned)} r={4} fill={r.factor === 1.0 ? '#10b981' : PINNED_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3657_GRID.map((r) => (
        <g key={'x' + r.factor}>
          <line x1={xS(r.factor)} y1={padT + cH} x2={xS(r.factor)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.factor)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.factor}x
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        E_trunc floor factor f (0.5x .. 2x baseline)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        N_half / N_x ratio (PINNED)
      </text>

      <g fontSize={9}>
        <circle cx={padL + 6} cy={padT + 12} r={3.6} fill="#10b981" />
        <text x={padL + 14} y={padT + 15} fill="#6ee7b7">baseline f=1.0x: pinned ratio {IMP3657_BASELINE.pinned.toFixed(6)} (matches imp-3580/imp-3604)</text>
      </g>
    </svg>
  );
}

function SwingComparisonChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const fMin = 0.4;
  const fMax = 2.1;
  const logMin = Math.log10(1e-7);
  const logMax = Math.log10(5e-6);

  const xS = (f) => padL + ((f - fMin) / (fMax - fMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logMin) / (logMax - logMin));

  const bracketSwings = IMP3657_GRID.map((r) => r.bracketMax - r.bracketMin);
  const maxObservedBracketSwing = Math.max(...bracketSwings, 1e-6);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[1e-7, 1e-6, 1e-5].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3657_GRID.map((r, i) => {
        const barW = 10;
        const bx = xS(r.factor);
        return (
          <g key={r.factor}>
            <rect
              x={bx - barW - 1}
              y={yS(Math.max(bracketSwings[i], 1e-7))}
              width={barW}
              height={padT + cH - yS(Math.max(bracketSwings[i], 1e-7))}
              fill={BRACKET_SWING_COLOR}
            />
            <rect
              x={bx + 1}
              y={yS(r.cgResidualSwing)}
              width={barW}
              height={padT + cH - yS(r.cgResidualSwing)}
              fill={PINNED_SWING_COLOR}
            />
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3657_GRID.map((r) => (
        <g key={'x' + r.factor}>
          <line x1={xS(r.factor)} y1={padT + cH} x2={xS(r.factor)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.factor)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.factor}x
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        E_trunc floor factor f
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        ratio residual spread (log scale)
      </text>

      <g fontSize={9}>
        <rect x={padL + 2} y={padT + 8} width={9} height={9} fill={BRACKET_SWING_COLOR} />
        <text x={padL + 16} y={padT + 16} fill="#fde68a">imp-3604 flat-bracket ratio_swing (max {IMP3657_SWING_COMPARISON.maxBracketSwing.toExponential(0)})</text>
        <rect x={padL + 2} y={padT + 22} width={9} height={9} fill={PINNED_SWING_COLOR} />
        <text x={padL + 16} y={padT + 30} fill="#6ee7b7">imp-3620 closed-form residual C_G spread (max {IMP3657_SWING_COMPARISON.maxPinnedSwing.toExponential(1)})</text>
      </g>
    </svg>
  );
}

export default function Imp3657SigmaCrossoverTcClosedformPinViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Closed-Form Flow-Factor Pin at the Sigma-Crossover (imp-3620 / imp-3657)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3604 bounded the N_half/N_x crossover ratio using the WHOLE rigorous
        Gronwall flow-factor bracket [1, 1.000474], leaving it a bracket rather
        than a pinned value. imp-3620 derives the flow factor at the crossover
        scale N_x &asymp; 3.28e9 from the named imp-398 backward-flow-stability
        law t_c(N) &sim; 1/log &gamma;_N, and measures where inside that bracket
        the true crossover-scale factor lands.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The closed-form factor lands at {(IMP3657_CROSSOVER_FACTOR.bracketFraction_cg1 * 100).toFixed(1)}%..
        {(IMP3657_CROSSOVER_FACTOR.bracketFraction_cg2 * 100).toFixed(1)}% of the imp-3604 bracket, strictly
        below the frozen imp-3580 node
      </p>
      <BracketPositionChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        N_half/N_x is now a single PINNED value per floor (0.997717 .. 0.993128)
      </p>
      <RatioBandChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        The residual spread on the pin ({'<'}1e-6) is far tighter than the imp-3604 flat-bracket spread (~3e-6)
      </p>
      <SwingComparisonChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> the
        top chart plots the imp-3604 bracket [1, 1.000474] as a number line.
        The dashed red line marks the imp-3580 frozen node (held flat at the
        anchor worst case, sitting near the bracket midpoint); the shaded blue
        band marks where the imp-398 closed form t_c(N) &sim; 1/log &gamma;_N
        actually pins the crossover-scale factor once C_G ranges over [1,2] --
        a narrow 22%..44% slice, well below the frozen node (a ~2.27x
        over-statement by the frozen node). The middle chart shows the
        resulting N_half/N_x ratio is now a single pinned curve (not a
        bracket) across the half-to-double E_trunc floor grid, still landing
        in the familiar ~0.996 neighborhood and reproducing imp-3580/imp-3604
        exactly at the baseline node. The bottom chart makes the "pinned, not
        bracketed" claim quantitative: the residual C_G spread left on the
        closed-form ratio (green) is smaller than the imp-3604 flat-bracket
        spread (amber) at every floor.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong>{' '}
        measurement/derivation only -- a conditional-share diagnostic, NOT an
        RH bound. No positivity, no bridge closure, NO QED. The imp-3066
        off-diagonal endpoint-Hankel K_a &ge; 0 positivity remains untouched.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3614-sigma-crossover-floor-invariance" style={{ color: '#7c3aed' }}>
          Sigma-Crossover Floor Invariance (imp-3580 / imp-3614)
        </Link>
      </div>
    </div>
  );
}
