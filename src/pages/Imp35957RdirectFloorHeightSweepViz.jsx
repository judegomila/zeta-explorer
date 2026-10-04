import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35957_PLATEAU_ROWS,
  IMP35957_MAX_DEPART_ULP,
  IMP35957_THRESHOLD,
  IMP35957_LAST_FINITE_LOG10_N,
  IMP35957_LAST_FINITE_N,
  IMP35957_LAST_FINITE_A,
  IMP35957_OVERFLOW_PROBE_LOG10_N,
  IMP35957_MAX_DOUBLE,
} from '../data/imp-35957-rdirect-floor-height-sweep-viz-data.js';
import { ED } from '../styles/tokens.js';

const PLATEAU_COLOR = ED.series1;
const CLIFF_COLOR = ED.series2;

function PlateauCliffChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xMin = 10;
  const xMax = 312;
  const yMin = -0.5;
  const yMax = 2.2;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <line x1={padL} y1={yS(2)} x2={padL + cW} y2={yS(2)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(2) - 4} textAnchor="end" fill={ED.series1} fontSize={8.5}>
        {'<= 2 ULP ceiling'}
      </text>

      <line
        x1={xS(IMP35957_LAST_FINITE_LOG10_N)}
        y1={padT}
        x2={xS(IMP35957_LAST_FINITE_LOG10_N)}
        y2={padT + cH}
        stroke={CLIFF_COLOR}
        strokeWidth={1.5}
        strokeDasharray="2,3"
        opacity={0.7}
      />
      <text x={xS(IMP35957_LAST_FINITE_LOG10_N) - 4} y={padT + 12} textAnchor="end" fill={CLIFF_COLOR} fontSize={8.5}>
        NaN cliff, log10 N = {IMP35957_LAST_FINITE_LOG10_N.toFixed(2)}
      </text>

      <polyline
        points={IMP35957_PLATEAU_ROWS.map((row) => `${xS(row.log10N)},${yS(row.departUlp)}`).join(' ')}
        fill="none"
        stroke={PLATEAU_COLOR}
        strokeWidth={1.5}
        opacity={0.8}
      />
      {IMP35957_PLATEAU_ROWS.map((row) => (
        <circle key={'p' + row.log10N} cx={xS(row.log10N)} cy={yS(row.departUlp)} r={4} fill={PLATEAU_COLOR} />
      ))}

      <circle cx={xS(IMP35957_OVERFLOW_PROBE_LOG10_N)} cy={yS(2)} r={5} fill={CLIFF_COLOR} />
      <text x={xS(IMP35957_OVERFLOW_PROBE_LOG10_N)} y={padT + cH + 17} textAnchor="middle" fill={CLIFF_COLOR} fontSize={9}>
        NaN
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        R_direct departure from R_clean (ULP)
      </text>
    </svg>
  );
}

export default function Imp35957RdirectFloorHeightSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="R_direct Floor-vs-Height Sweep: a <= 2 ULP Plateau Then a HARD NaN Cliff at N ~ 10^307.46 (imp-35892/imp-35957)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Status -- TWIN cliffs, not one:</strong> imp-35972/imp-36021
        resolved this NaN cliff into TWO distinct, sub-decade-adjacent IEEE-754 boundaries: cliff B (a
        {' → '}0 via the T{'·'}u denominator overflow, plotted here at log10 N {'≈'} 307.4559, and cliff A
        (the effectiveHeightForN Newton-seed numerator 2{'π'}N overflow) {'≈'}6.2e-4 decade above it at
        log10 N {'≈'} 307.4565. Cliff B binds FIRST. Both locations are constant-robust (imp-36021: invariant
        under +/-4 orders of K and the full delta/S_inf provenance range). Any T_star(N) readout at or above
        log10 N {'≈'} 307.4559 is IEEE-754-invalid -- not a physical or RH-relevant bound, just a double-precision
        representability wall of this surrogate.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35892 extended the imp-35855 de-cancelled surplus-split ratio R_direct = -S_inf . a/(2-a)
        sweep far past its N ~ 1e21 stopping point, out to the last representable finite height. The
        fixed 1e-{Math.round(-Math.log10(IMP35957_THRESHOLD))} departure threshold is never crossed: R_direct tracks its
        independent cancellation-free reference R_clean to {'<='}{IMP35957_MAX_DEPART_ULP.toFixed(2)} ULP
        across the entire finite range N = 1e13 .. {IMP35957_LAST_FINITE_N.toExponential(3)}. The form
        does not fail through a soft conditioning ramp -- it fails abruptly once the effectiveHeightForN
        RvM height inverse overflows past Number.MAX_VALUE ({IMP35957_MAX_DOUBLE.toExponential(3)}).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_direct departure from R_clean (ULP) vs log10 N -- plateau, then the hard cliff
      </p>
      <PlateauCliffChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue trace sits pinned at
        {' '}{'<='}1 ULP for every finite N sampled from 1e13 up to the last finite point at log10 N ~
        {IMP35957_LAST_FINITE_LOG10_N.toFixed(3)} (a ~ {IMP35957_LAST_FINITE_A.toExponential(2)}, still a
        NORMAL double -- underflow is not the binding limit). One decade later, the {IMP35957_OVERFLOW_PROBE_LOG10_N}
        {' '}probe returns NaN: the Newton seed T ~ 2{'π'}N/log N for the height inverse has overflowed
        to +Infinity, forcing a {'→'} 0 and R_direct {'→'} NaN.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/diagnostic only, double
        precision; instantiates no interval, ports no operator, changes no bound. imp-34714a REMAINS
        OPEN. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED. NO QED.
      </div>
    </div>
  );
}
