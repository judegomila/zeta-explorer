import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33628_LADDER,
  IMP33628_E_TRUNC_FLOOR,
  IMP33628_CROSSOVER,
} from '../data/imp-33628-etrunc-ecoll-crossover-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { trunc: ED.series5, coll: ED.series3, crossover: ED.series7 };

function EtruncEcollCrossoverChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 64;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const logNMin = 6;
  const logNMax = 12;
  const yMin = Math.log10(1e-6);
  const yMax = Math.log10(2e-3);

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const truncPath = IMP33628_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.E_trunc).toFixed(2)
  ).join(' ');
  const collPath = IMP33628_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.E_coll).toFixed(2)
  ).join(' ');

  const yTicks = [1e-6, 1e-5, 1e-4, 1e-3];
  const xTickNs = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <line
        x1={xS(IMP33628_CROSSOVER.N)}
        y1={padT}
        x2={xS(IMP33628_CROSSOVER.N)}
        y2={padT + cH}
        stroke={COLORS.crossover}
        strokeWidth={1.2}
        strokeDasharray="4,2"
      />

      <path d={truncPath} fill="none" stroke={COLORS.trunc} strokeWidth={2} strokeDasharray="6,3" />
      <path d={collPath} fill="none" stroke={COLORS.coll} strokeWidth={2} />

      {IMP33628_LADDER.map((r) => (
        <circle key={'t' + r.N} cx={xS(r.N)} cy={yS(r.E_trunc)} r={2.5} fill={COLORS.trunc} />
      ))}
      {IMP33628_LADDER.map((r) => (
        <circle key={'c' + r.N} cx={xS(r.N)} cy={yS(r.E_coll)} r={3.5} fill={COLORS.coll} />
      ))}

      {IMP33628_LADDER.map((r) => (
        <text
          key={'sig' + r.N}
          x={xS(r.N)}
          y={yS(r.E_coll) - 8}
          textAnchor="middle"
          fill={ED.inkSoft}
          fontSize={7.5}
        >
          {'σ=' + r.sigma.toFixed(3)}
        </text>
      ))}

      <circle
        cx={xS(IMP33628_CROSSOVER.N)}
        cy={yS(IMP33628_CROSSOVER.E)}
        r={6}
        fill="none"
        stroke={COLORS.crossover}
        strokeWidth={2}
      />
      <text x={xS(IMP33628_CROSSOVER.N) + 6} y={yS(IMP33628_CROSSOVER.E) + 16} fill={ED.series7} fontSize={9}>
        imp-3444 crossover (N~3.28e9)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTickNs.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {N.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        error term (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.trunc} strokeWidth={2} strokeDasharray="6,3" />
        <text x={padL + 14} y={padT + 15} fill={ED.series5}>E_trunc (flat floor, 3.06e-5)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.coll} strokeWidth={2} />
        <text x={padL + 14} y={padT + 29} fill={ED.series3}>E_coll ~ sqrt(log T0 / N)</text>
      </g>
    </svg>
  );
}

export default function Imp33628EtruncEcollCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_trunc / E_coll Post-Peak Crossover Ladder (imp-33602 / imp-33628)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33602 separates the imp-33582 sigma(N) = E_coll/E post-peak ratio into its two
        components across the seven decades N &isin; {'{'}1e6 .. 1e12{'}'}: the N-independent
        fixed-strip floor E_trunc (imp-2631, exactly 3.06e-5 on every rung) and the decaying,
        GUE-conditional E_coll(N) &sim; sqrt(log T0 / N). E_coll falls through the flat E_trunc
        floor in the [1e9, 1e10] bracket, at N &sim; 3.28e9 (the imp-3444 crossover) -- and sigma
        drops from &sim;0.637 to &sim;0.370 across exactly that bracket, confirming the crossover
        (not E_coll alone) drives the sigma halving.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        E_trunc (flat) vs E_coll (decaying) across N = 1e6 .. 1e12, sigma annotated per rung
      </p>
      <EtruncEcollCrossoverChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the dashed line is the
        exactly flat E_trunc floor ({IMP33628_E_TRUNC_FLOOR.toExponential(2)} on all seven
        decades); the solid line is E_coll, decaying roughly as N^(-1/2) with a slow log T0(N)
        offset. The two lines cross at N &sim; 3.28e9 (imp-3444, marked), inside the [1e9, 1e10]
        bracket where sigma halves -- the visual signature of the imp-33602 finding that the
        sigma decay is a crossover, not a property of E_coll alone.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization only
        -- the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic. The E_trunc route is GUE-conditional-free but the C_mb GUE-conditional share
        per imp-486 is untouched; changes no bound; establishes no operator positivity; imp-3066
        K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33607-sigma-postpeak-decay" style={{ color: 'var(--series-5)' }}>
          Sigma(N) Post-Peak Decay (imp-33582 / imp-33607)
        </Link>
        {' | '}
        <Link to="/viz-imp35121-ecoll-etrunc-eflow-decomposition" style={{ color: 'var(--series-5)' }}>
          E_coll / E_trunc / E_flow Component Decomposition (imp-33601 / imp-35121)
        </Link>
      </div>
    </div>
  );
}
