import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP3276_E1_E2_MARGIN_QUANTIFICATION } from '../data/imp-3276-e1-e2-margin-quantification.js';

const RHO_COLOR = '#38bdf8';
const TAU_COLOR = '#f59e0b';
const REF_COLOR = '#64748b';

const PER_DECADE = IMP3276_E1_E2_MARGIN_QUANTIFICATION.perDecadeRecordMargin;

function decadeLabel(d) {
  const fmt = (v) => (v >= 1000 ? v.toExponential(0).replace('+', '') : String(v));
  return `[${fmt(d.N_lo)},${fmt(d.N_hi)})`;
}

function RecordMarginChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 28;
  const padB = 48;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const n = PER_DECADE.length;
  const yMin = -6.2;
  const yMax = 0.4;

  const xS = (i) => padL + (i / (n - 1)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const rhoPath = PER_DECADE.map((d, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(d.minRhoJump).toFixed(1)).join(' ');
  const tauPath = PER_DECADE.map((d, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(d.minTauDrop).toFixed(1)).join(' ');

  const gridExponents = [0, -1, -2, -3, -4, -5, -6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {gridExponents.map((e) => (
        <g key={e}>
          <line x1={padL} y1={yS(Math.pow(10, e))} x2={padL + cW} y2={yS(Math.pow(10, e))} stroke="#1e293b" strokeWidth={0.6} />
          <text x={padL - 8} y={yS(Math.pow(10, e)) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            1e{e}
          </text>
        </g>
      ))}

      {PER_DECADE.map((d, i) => (
        <line key={i} x1={xS(i)} y1={padT} x2={xS(i)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.6} />
      ))}

      <path d={tauPath} fill="none" stroke={TAU_COLOR} strokeWidth={1.75} />
      <path d={rhoPath} fill="none" stroke={RHO_COLOR} strokeWidth={1.75} />

      {PER_DECADE.map((d, i) => (
        <g key={`pts-${i}`}>
          <circle cx={xS(i)} cy={yS(d.minRhoJump)} r={3.5} fill={RHO_COLOR} stroke="#052e3f" strokeWidth={1} />
          <circle cx={xS(i)} cy={yS(d.minTauDrop)} r={3.5} fill={TAU_COLOR} stroke="#3f2905" strokeWidth={1} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {PER_DECADE.map((d, i) => (
        <text key={`lbl-${i}`} x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {decadeLabel(d)}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        decade of N (record-step count shown per bin)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        smallest strict record-step jump (log scale)
      </text>

      <circle cx={padL + 10} cy={padT + 14} r={3.5} fill={RHO_COLOR} />
      <text x={padL + 18} y={padT + 17} fill={RHO_COLOR} fontSize={9}>
        E1 min rho jump (robust floor)
      </text>
      <circle cx={padL + 10} cy={padT + 28} r={3.5} fill={TAU_COLOR} />
      <text x={padL + 18} y={padT + 31} fill={TAU_COLOR} fontSize={9}>
        E2 min tau_c drop (decaying, stays positive)
      </text>
    </svg>
  );
}

function RecordTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>decade N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>records</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>min E1 rho jump</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>min E2 tau_c drop</th>
        </tr>
      </thead>
      <tbody>
        {PER_DECADE.map((d) => (
          <tr key={decadeLabel(d)} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{decadeLabel(d)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{d.records}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: RHO_COLOR }}>{d.minRhoJump.toExponential(3)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: TAU_COLOR }}>{d.minTauDrop.toExponential(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3380PathOneRecordStepMarginViz() {
  const topDecade = PER_DECADE[PER_DECADE.length - 1];
  const firstDecade = PER_DECADE[0];
  const totalRecords = IMP3276_E1_E2_MARGIN_QUANTIFICATION.sweep.recordBreakingSteps;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="PATH-1 Record-Step Safety Margin (imp-3276)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3276 upgraded the roadmap PATH-1 (imp-833/imp-858) "zero violations" binary into a signed margin.
        Over the full N in {'{2,...,10^6}'} Odlyzko sweep, the prefix-min argmin jStar(N) moves only at{' '}
        {totalRecords} record-breaking steps; between records the naive per-step margin is an exact
        structural tie at 0. The informative signal is the STRICT jump measured only at those {totalRecords}{' '}
        record steps, binned per decade of N.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Smallest per-decade record-step jump: E1 rho (robust floor) vs E2 tau_c drop (decaying but positive)
      </p>
      <RecordMarginChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured per-decade rungs
      </p>
      <RecordTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the E1 rho-jump floor (blue) stays
        bounded away from 0 in every decade -- smallest {firstDecade.minRhoJump.toExponential(2)} near N~10,
        still {topDecade.minRhoJump.toExponential(2)} in the top decade N in [1e5,1e6) -- a ROBUST floor that
        does not drift toward 0 as N grows. The E2 tau_c-drop (orange) shrinks by roughly six decades across
        the sweep ({firstDecade.minTauDrop.toExponential(2)} down to {topDecade.minTauDrop.toExponential(2)})
        but is always strictly positive; since E2 is implied by E1 plus UMon (H_N non-increasing), the
        shrinking record-drop does not threaten the predicate.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> visualization only -- measurement, not
        proof, and no positivity claim is attempted. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous
        SOTA; PATH-1's leading-order predicates stay GUE-conditional at the analytic-bridge step
        (imp-486/imp-583).
      </div>
    </div>
  );
}
