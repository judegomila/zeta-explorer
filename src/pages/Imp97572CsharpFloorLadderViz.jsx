import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97572_FLOOR_LADDER,
  IMP97572_RESIDUAL_SHARES,
} from '../data/imp-97572-csharp-floor-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97572: charts the imp-97492 c_sharp floor-sharpening ladder as a single
// horizontal sequence (worst certified floor -> best rigorous floor ->
// measured realizable floor -> measured c_sharp), with the two named
// residual shares (realizability, discarded far field) drawn as the segments
// that close the gap between the rigorous floor and the measured value.

function LadderPanel() {
  const svgW = 680;
  const svgH = 170;
  const padL = 24;
  const padR = 24;
  const padT = 30;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const values = IMP97572_FLOOR_LADDER.map((r) => r.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo;
  const xOf = (v) => padL + ((v - lo) / span) * plotW;
  const y = padT + plotH / 2;

  const colors = [ED.series2, ED.series4, ED.series5, ED.series1, ED.series3];

  return (
    <div style={{ marginBottom: '1rem' }}>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke={ED.rule} strokeWidth={1} />

        {/* residual-share segments between rungs 2, 3, 4 */}
        {IMP97572_RESIDUAL_SHARES.map((s, i) => (
          <line
            key={s.key}
            x1={xOf(s.fromValue)}
            y1={y}
            x2={xOf(s.toValue)}
            y2={y}
            stroke={ED.rule}
            strokeWidth={4}
            opacity={0.35}
          />
        ))}

        {IMP97572_FLOOR_LADDER.map((r, i) => (
          <g key={r.key}>
            <circle cx={xOf(r.value)} cy={y} r={6} fill={colors[i]} />
            <text
              x={xOf(r.value)}
              y={i % 2 === 0 ? y - 14 : y + 26}
              textAnchor="middle"
              fill={ED.ink}
              fontSize={9.5}
              fontWeight="bold"
            >
              {r.value.toFixed(3)}
            </text>
            <text
              x={xOf(r.value)}
              y={i % 2 === 0 ? y - 26 : y + 38}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8}
            >
              {r.label}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ paddingLeft: padL, fontSize: '0.72rem', color: 'var(--ink-faint)' }}>
        Gray bands: the two named residual shares (realizability, discarded far field) that carry
        the value from the best rigorous floor to the measured c_sharp. Axis is linear in c_sharp,
        not to log scale, since the ladder spans a single sign change rather than orders of magnitude.
      </div>
    </div>
  );
}

function ResidualTable() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.78rem', marginBottom: '1rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '4px 8px' }}>residual share</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>from</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>to</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>amount</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>% of gap</th>
        </tr>
      </thead>
      <tbody>
        {IMP97572_RESIDUAL_SHARES.map((s) => (
          <tr key={s.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ textAlign: 'left', padding: '4px 8px' }}>{s.label}</td>
            <td style={{ textAlign: 'right', padding: '4px 8px' }}>{s.fromValue.toFixed(3)}</td>
            <td style={{ textAlign: 'right', padding: '4px 8px' }}>{s.toValue.toFixed(3)}</td>
            <td style={{ textAlign: 'right', padding: '4px 8px', color: 'var(--series-3)' }}>+{s.amount.toFixed(3)}</td>
            <td style={{ textAlign: 'right', padding: '4px 8px' }}>{s.pct.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp97572CsharpFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97492: The c_sharp Floor-Sharpening Ladder, Residual Shares Made Explicit" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement
        only, reusing the imp-97492 cohort-index literals verbatim (no
        re-derivation). No rigorous positive lower bound on c_sharp exists;
        interval-rigorous certified reach stays 2a&le;0.96; Platt-Trudgian
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-97492 cohort index sharpens the best finite floor on c_sharp =
        lambda_min(P_a M_sigma2 P_a) at 2a=ln3 across eight tickets: the best
        certified rho precondition (-4336.198), the reproducing-kernel floor
        (-3200.029), the best RIGOROUS joint-bathtub floor (-3065.435), the
        measured (not interval-certified) realizable floor (-1343.796), and
        finally the measured c_sharp itself (~0.581059). This page charts that
        ladder on one axis and makes explicit the two named residual shares
        that close the gap between the rigorous floor and the measured value:
        the bathtub realizability gap (+1721.639, 56.2%) and the discarded t^4
        positive far field (+1344.378, 43.8%).
      </p>

      <LadderPanel />
      <ResidualTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the ladder:</strong> every
        scalar floor derived so far stays negative; the two residual shares
        are exactly what is DISCARDED by those scalar arguments (an
        unrealizable envelope share and a positive far-field share), and
        together they sum to the full +3066.017 gap with no unnamed residue
        left over. Neither share is itself a rigorous lower bound on c_sharp
        &mdash; both are measured (IEEE-double), not interval-certified.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-97492 cohort index verbatim; no re-solve. Establishes
        no operator positivity; changes no bound; PT Lambda&le;0.2 remains
        SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
