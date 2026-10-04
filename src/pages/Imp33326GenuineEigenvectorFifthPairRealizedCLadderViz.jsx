import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33326_LADDER,
  IMP33326_WILKINSON_ENVELOPE,
  IMP33326_SURROGATE_RANGE,
  IMP33326_ABOVE_ENVELOPE_NS,
  IMP33326_C_MIN,
  IMP33326_C_MAX,
} from '../data/imp-33326-genuine-eigenvector-fifth-pair-realized-c-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAR_COLOR = ED.series1;
const POKE_COLOR = ED.series4;
const ENVELOPE_COLOR = ED.series7;
const SURROGATE_COLOR = ED.series5;

function RealizedCLadderChart() {
  const svgW = 600;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMax = IMP33326_C_MAX + 0.2;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const barW = cW / IMP33326_LADDER.length - 12;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <rect
        x={padL}
        y={yS(IMP33326_SURROGATE_RANGE.max)}
        width={cW}
        height={yS(IMP33326_SURROGATE_RANGE.min) - yS(IMP33326_SURROGATE_RANGE.max)}
        fill={SURROGATE_COLOR}
        opacity={0.12}
      />
      <text x={padL + 6} y={yS(IMP33326_SURROGATE_RANGE.max) + 12} fill={SURROGATE_COLOR} fontSize={9}>
        imp-33272 surrogate range [{IMP33326_SURROGATE_RANGE.min}, {IMP33326_SURROGATE_RANGE.max}]
      </text>

      {[0, 0.5, 1, 1.5].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33326_WILKINSON_ENVELOPE)}
        x2={padL + cW}
        y2={yS(IMP33326_WILKINSON_ENVELOPE)}
        stroke={ENVELOPE_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33326_WILKINSON_ENVELOPE) - 6} textAnchor="end" fill={ENVELOPE_COLOR} fontSize={9}>
        c &le; 1 Wilkinson envelope
      </text>

      {IMP33326_LADDER.map((r, i) => {
        const x = padL + i * (cW / IMP33326_LADDER.length) + 6;
        const y = yS(r.cRealized);
        const h = padT + cH - y;
        const isPoke = IMP33326_ABOVE_ENVELOPE_NS.includes(r.N);
        return (
          <g key={r.N}>
            <rect x={x} y={y} width={barW} height={h} fill={isPoke ? POKE_COLOR : BAR_COLOR} rx={2} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.cRealized.toFixed(3)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              N={r.N}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        c = worstPairSpread / (n &middot; kappa_pair &middot; u)
      </text>
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        genuine-eigenvector rung N
      </text>
    </svg>
  );
}

function LadderTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>sigma_4</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>kappa_pair</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>c_realized</th>
        </tr>
      </thead>
      <tbody>
        {IMP33326_LADDER.map((r) => (
          <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.N}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.sigma4.toFixed(6)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.kappaPair.toFixed(6)}</td>
            <td
              style={{
                textAlign: 'right',
                padding: '0.35rem 0.5rem',
                color: IMP33326_ABOVE_ENVELOPE_NS.includes(r.N) ? POKE_COLOR : 'var(--series-7)',
              }}
            >
              {r.cRealized.toFixed(6)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33326GenuineEigenvectorFifthPairRealizedCLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Genuine-Eigenvector Fifth-Pair Realized-c Ladder (imp-33289)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33289 measured the fifth-pair realized backward-error constant
        c = worstPairSpread / (n &middot; kappa_pair &middot; u) using the ACTUAL Gram
        eigenvectors of a genuine small-N skew-Toeplitz Gram, replacing the imp-33272
        integer-Householder surrogate rotation. Across N in {'{'}160..400{'}'} the realized c
        stays O(1) in [{IMP33326_C_MIN.toFixed(3)}, {IMP33326_C_MAX.toFixed(3)}], overlapping
        the imp-33272 surrogate range [{IMP33326_SURROGATE_RANGE.min}, {IMP33326_SURROGATE_RANGE.max}]
        (5 of 7 rungs strictly inside); two rungs (N=320, N=360) poke modestly above the
        c &le; 1 Wilkinson worst-case envelope.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Realized c per rung, against the c &le; 1 envelope and the surrogate range
      </p>
      <RealizedCLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Fifth-pair amplitude sigma_4, condition number, and realized c per rung
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar is the
        realized backward-error constant c at a dense rung, embedding the exactly-degenerate
        fifth pair via the double-double-orthonormalized ACTUAL Gram eigenvector orientation
        (not a surrogate). The two orange bars (N=320: 1.42, N=360: 1.06) sit modestly above
        the dashed c &le; 1 Wilkinson envelope, consistent with imp-33253's finding that the
        per-rung c is empirical QL-convergence quality, not a hard first-principles bound.
        Solving the identical reconstructed matrix in double-double collapses the fifth-pair
        spread to exactly zero on every rung, confirming genuine backward error and not a
        real pair gap.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / cross-check
        only. The rungs N in {'{'}160..400{'}'} are the small-N regime where the genuine fifth
        pair is not yet degenerate (sigma_4 = 0.83..0.97, a real gap); the exactly-degenerate
        premise is imposed to isolate the backward error of the actual eigenvector orientation.
        Confirms the imp-33272 surrogate order carries to the true eigenvectors but does NOT
        derive the per-rung value from first principles, does NOT re-certify the pairing
        (imp-3668), and adds NO new Lambda bound. imp-3066 K_a &ge; 0 UNTOUCHED. RH-equivalent,
        NO QED.
      </div>
    </div>
  );
}
