import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33217_LADDER,
  IMP33217_ULP_FLOOR,
  IMP33217_LOCAL_EXPONENTS,
  IMP33217_EXPONENT_RATIO,
} from '../data/imp-33217-fifth-pair-spread-ulp-floor-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAR_COLOR = ED.series1;
const FLOOR_COLOR = ED.series7;

function UlpFloorLadderChart() {
  const svgW = 560;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMax = IMP33217_ULP_FLOOR + 2;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const barW = cW / IMP33217_LADDER.length - 12;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 2, 4, 6, 8, 10].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP33217_ULP_FLOOR)} x2={padL + cW} y2={yS(IMP33217_ULP_FLOOR)} stroke={FLOOR_COLOR} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={padL + cW - 4} y={yS(IMP33217_ULP_FLOOR) - 6} textAnchor="end" fill={FLOOR_COLOR} fontSize={9}>
        10-ULP backward-error floor
      </text>

      {IMP33217_LADDER.map((r, i) => {
        const x = padL + i * (cW / IMP33217_LADDER.length) + 6;
        const y = yS(r.ulps);
        const h = padT + cH - y;
        return (
          <g key={r.N}>
            <rect x={x} y={y} width={barW} height={h} fill={BAR_COLOR} rx={2} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.ulps.toFixed(2)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              N={r.N}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        worstPairSpread (ULP)
      </text>
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        dense full-spectrum rung N
      </text>
    </svg>
  );
}

function ExponentTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>rung pair</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>local exponent p</th>
        </tr>
      </thead>
      <tbody>
        {IMP33217_LOCAL_EXPONENTS.map((e) => (
          <tr key={e.fromN + '-' + e.toN} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>N={e.fromN} &rarr; N={e.toN}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: 'var(--series-7)' }}>{e.exponent.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33217FifthPairSpreadUlpFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Fifth-Pair Gram-Degeneracy Spread ULP-Floor Ladder (imp-3851)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3851 resolved a THIRD nonzero rung (N=2200) of the imp-3733/imp-3668 fifth-pair
        Gram degeneracy spread worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9,
        turning two nonzero points into three: 0, 0, 0.885, 6.195, 8.848 ULP across
        N in {'{'}1200, 1600, 1800, 2000, 2200{'}'}. All three nonzero rungs sit below the
        conservative 10-ULP backward-error floor, and the successive LOCAL power-law
        exponents forced through them are wildly inconsistent -- ruling out a coherent
        growth law spread ~ N^p.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        worstPairSpread(N) in ULP, against the 10-ULP floor line
      </p>
      <UlpFloorLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Successive local power-law exponents (inconsistent by ~{IMP33217_EXPONENT_RATIO.toFixed(2)}x)
      </p>
      <ExponentTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the bars show
        worstPairSpread(N) in ULP at each dense-solved rung -- the first two rungs are
        exactly zero to all printed digits, and the three resolved nonzero rungs
        (N=1800, 2000, 2200) all sit below the dashed 10-ULP floor line. A genuine power
        law spread ~ N^p would force the SAME local exponent p between any pair of
        nonzero rungs; instead p(1800&rarr;2000)=18.47 and p(2000&rarr;2200)=3.74, a
        factor ~4.9 apart -- the signature of discrete last-digit ULP jitter between
        floor-level values, not a resolved growth law.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only --
        adds one resolved nonzero rung to a still-floor-level three-nonzero-point sample.
        Rules out a coherent power law but does NOT pin a resolved growth exponent, does
        NOT re-certify the pairing (imp-3668), does NOT establish the fifth-pair amplitude
        law, and does NOT attempt the imp-3066 K_a &ge; 0 positivity. RH-equivalent, NO
        QED.
      </div>
    </div>
  );
}
