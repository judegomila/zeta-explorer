import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96197_EN_DECAY_EXPONENT_LADDER_VIZ as V } from '../data/imp-96197-en-decay-exponent-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function LadderTable() {
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr>
          {['N', 'p(N)', 'E_coll share'].map((h) => (
            <th
              key={h}
              style={{
                textAlign: 'right',
                padding: '4px 12px',
                borderBottom: '1px solid var(--rule)',
                color: 'var(--ink-faint)',
                fontWeight: 600,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {V.ladder.map((r) => (
          <tr key={r.N}>
            <td style={{ padding: '4px 12px', textAlign: 'right' }}>{r.N.toExponential(0)}</td>
            <td style={{ padding: '4px 12px', textAlign: 'right' }}>
              {r.localDecayExp === null ? '—' : r.localDecayExp.toFixed(4)}
            </td>
            <td style={{ padding: '4px 12px', textAlign: 'right' }}>{r.E_coll_share.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DecayExponentChart() {
  const svgW = 640;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const loK = 2;
  const hiK = 20;
  const xS = (k) => padL + cW * ((k - loK) / (hiK - loK));
  const yS = (p) => padT + cH * (1 - p / 0.5);

  const pts = V.ladder
    .filter((r) => r.localDecayExp !== null)
    .map((r) => `${xS(r.log10N)},${yS(r.localDecayExp)}`);

  const crossK = V.crossover.log10N;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      <polyline points={pts.join(' ')} fill="none" stroke={ED.series1} strokeWidth={2} />
      {V.ladder
        .filter((r) => r.localDecayExp !== null)
        .map((r) => (
          <circle key={r.N} cx={xS(r.log10N)} cy={yS(r.localDecayExp)} r={2.5} fill={ED.series1} />
        ))}
      <line
        x1={xS(crossK)}
        y1={padT}
        x2={xS(crossK)}
        y2={padT + cH}
        stroke={ED.series3}
        strokeWidth={1}
        strokeDasharray="2,2"
        opacity={0.6}
      />
      <text x={xS(crossK)} y={padT + cH + 14} textAnchor="middle" fill={ED.series3} fontSize={9}>
        N_x&asymp;{V.crossover.N.toExponential(2)}
      </text>
      {[2, 5, 8, 11, 14, 17, 20].map((k) => (
        <text key={k} x={xS(k)} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{k}
        </text>
      ))}
      {[0, 0.25, 0.5].map((p) => (
        <text key={p} x={padL - 6} y={yS(p) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {p.toFixed(2)}
        </text>
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={svgW - padR - 4} y={padT + 12} textAnchor="end" fill={ED.series1} fontSize={9}>
        p(N) = -dlogE/dlogN
      </text>
      <text x={padL + cW / 2} y={svgH - padB + 24} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        {V.axisLabel}
      </text>
    </svg>
  );
}

export default function Imp96197EnDecayExponentLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E(N) Decay-Exponent Ladder (imp-96166 / imp-96197)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96166 measured the empirical local decay exponent p(N) = -dlog
        E(N)/dlogN of the assembled Step-4 bridge budget E(N) = E_trunc + E_flow +
        E_coll across a wide N-ladder. Below the crossover N_x it tracks the
        sqrt-law E_coll term; past it, the frozen E_trunc term takes over and the
        exponent collapses toward zero.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Measured decay exponent p(N) vs. log10 N
      </p>
      <DecayExponentChart />

      <p
        style={{
          color: 'var(--ink-faint)',
          fontWeight: 700,
          fontSize: '0.82rem',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
        }}
      >
        Ladder table: exponent and E_coll share of E(N) at each rung
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the curve peaks near{' '}
        {V.regimeExponents.peakDecayExp.toFixed(2)} (the sqrt(log T0 / N) leading order, held
        below 1/2) while E_coll dominates E(N), then falls toward{' '}
        {V.regimeExponents.finalDecayExp.toFixed(2)} past the crossover N_x &asymp;{' '}
        {V.crossover.N.toExponential(2)}, where E_coll drops below the frozen E_trunc floor and
        stops contributing decay.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation/measurement only —
        renders the frozen imp-96166 decay-exponent ladder verbatim (no re-derivation, no fresh
        term). The residual shortfall is the frozen E_trunc floor ({' '}
        {V.residualShortfall.E_floor.toExponential(3)}), not a slower-than-expected decay; the
        one decaying term (E_coll) is simultaneously the sole GUE-conditional term (imp-486).
        Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
