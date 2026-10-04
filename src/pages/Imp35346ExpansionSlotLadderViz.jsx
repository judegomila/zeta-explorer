import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Import-light: literals baked verbatim from the imp-35322 rho(eps) expansion
// cohort roll-up (imp-35216/imp-35240 eps^{3/2}; imp-35244 eps^{5/2} empty,
// eps^{7/2} correction). No data-module import, no recomputation.
const SLOTS = [
  {
    power: 'eps^{3/2}',
    status: 'filled',
    coefficient: 8 * Math.sqrt(2) / (9 * Math.PI),
    label: 'K = 8√2/(9π) = 0.40014',
    ticket: 'imp-35216 / imp-35240',
    note: 'Closed-form leading coefficient, independently confirmed to ~3.3e-7 on a finer-grid ladder.',
  },
  {
    power: 'eps^{5/2}',
    status: 'empty',
    coefficient: null,
    label: 'EMPTY (falsified: -32√2/(45π) = -0.32011)',
    ticket: 'imp-35244',
    note: 'The eps^{5/2} coefficient implied by the imp-35216 tail is falsified by measurement; this slot is skipped.',
  },
  {
    power: 'eps^{7/2}',
    status: 'filled',
    coefficient: -8 * Math.sqrt(2) / (3 * Math.PI),
    label: 'K_{7/2} = -8√2/(3π) = -1.20042',
    ticket: 'imp-35244',
    note: 'True next-order term after the skipped eps^{5/2} slot, closed-form and grid-confirmed.',
  },
];

function SlotLadderChart() {
  const svgW = 680;
  const rowH = 74;
  const padT = 30;
  const padL = 90;
  const svgH = padT + SLOTS.length * rowH + 20;
  const boxW = 130;
  const boxH = 46;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        rho(eps) = 2/3 + K eps^1.5 + K_5/2 eps^2.5 + K_7/2 eps^3.5 + ...
      </text>
      {SLOTS.map((s, i) => {
        const y = padT + i * rowH;
        const filled = s.status === 'filled';
        return (
          <g key={s.power}>
            <text x={0} y={y + boxH / 2 + 4} fill={ED.ink} fontSize={13} fontFamily="monospace">
              {s.power}
            </text>
            <rect
              x={padL}
              y={y}
              width={boxW}
              height={boxH}
              rx={6}
              fill={filled ? alpha(ED.series5, 0.12) : alpha(ED.inkFaint, 0.06)}
              stroke={filled ? ED.series5 : ED.rule}
              strokeWidth={filled ? 2 : 1.5}
              strokeDasharray={filled ? undefined : '5 4'}
            />
            <text
              x={padL + boxW / 2}
              y={y + boxH / 2 + 5}
              textAnchor="middle"
              fill={filled ? ED.ink : ED.inkFaint}
              fontSize={12}
              fontWeight={700}
            >
              {filled ? s.coefficient.toFixed(5) : 'SKIPPED'}
            </text>
            <text x={padL + boxW + 16} y={y + boxH / 2 - 4} fill={filled ? ED.ink : ED.inkSoft} fontSize={11}>
              {s.label}
            </text>
            <text x={padL + boxW + 16} y={y + boxH / 2 + 12} fill={ED.inkFaint} fontSize={9.5}>
              {s.ticket}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp35346ExpansionSlotLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="rho(eps) Expansion-Slot Ladder: eps^(5/2) Skipped (imp-35346 / imp-35322)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35322 provenance roll-up catalogues three resolved coefficient slots in the model-cusp
        rho(eps) expansion. Rendered term-by-term, the ladder makes visible that the eps^(5/2) slot the
        imp-35216 tail implied is empty &mdash; imp-35244 falsified that candidate coefficient by
        measurement &mdash; so the expansion jumps directly from eps^(3/2) to eps^(7/2).
      </p>

      <SlotLadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>slot</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>status</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>coefficient</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((s) => (
            <tr key={s.power} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.power}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{s.status === 'filled' ? 'resolved' : 'EMPTY'}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {s.status === 'filled' ? s.coefficient.toFixed(5) : '—'}
              </td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{s.ticket}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        {SLOTS.map((s) => (
          <p key={s.power} style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', margin: '0.25rem 0' }}>
            <strong style={{ color: 'var(--ink-soft)', fontFamily: 'monospace' }}>{s.power}:</strong> {s.note}
          </p>
        ))}
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35322
        roll-up literals verbatim (no new computation, no data-module import). Displaying which expansion
        slots are filled versus skipped is descriptive only on the inherited imp-3220/imp-3406/imp-33646
        model-cusp surrogate; does NOT certify a uniform modulus, does not discharge O3 or
        G6a_shock_lipschitz (both stay OPEN); establishes no operator positivity; imp-3066 off-diagonal
        endpoint-Hankel K_a&nbsp;&ge;&nbsp;0 UNTOUCHED; C_mb GUE-conditional per imp-486; changes no bound,
        no RH claim, NO QED.
      </div>
    </div>
  );
}
