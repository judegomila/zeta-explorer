import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96742_DSIG_TABLE,
  IMP96742_SAFE_FROM_L,
  IMP96742_HONEST_BANNER,
} from '../data/imp-96742-safe-direction-sign-per-rung-viz-data.js';
import { ED } from '../styles/tokens.js';

// bar chart: d_sig(L) per calibration rung (log x-axis, L=30..960), colored by
// sign -- red bars above the zero line mark rungs where the safe-direction
// claim fails, green bars below it mark rungs where it holds.
function DSigBarPanel() {
  const rows = IMP96742_DSIG_TABLE;
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logL = (L) => Math.log10(L);
  const minLogL = logL(rows[0].L);
  const maxLogL = logL(rows[rows.length - 1].L);
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.dSig))) * 1.15;

  const xOf = (L) => padL + ((logL(L) - minLogL) / (maxLogL - minLogL)) * plotW;
  const yOf = (v) => padT + plotH / 2 - (v / maxAbs) * (plotH / 2);
  const zeroY = yOf(0);
  const barW = 34;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1.5} />
      {rows.map((r) => {
        const x = xOf(r.L) - barW / 2;
        const y = r.dSig >= 0 ? zeroY : yOf(r.dSig);
        const h = Math.abs(yOf(r.dSig) - zeroY);
        const color = r.safe ? ED.series3 : ED.series2;
        return (
          <g key={`bar${r.L}`}>
            <rect x={x} y={y} width={barW} height={Math.max(h, 1)} fill={color} opacity={0.85} />
            <text
              x={xOf(r.L)}
              y={r.dSig >= 0 ? y - 6 : y + h + 12}
              textAnchor="middle"
              fill={color}
              fontSize={8.5}
            >
              {r.dSig >= 0 ? '+' : ''}
              {r.dSig.toFixed(4)}
            </text>
            <text x={xOf(r.L)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
              {r.L}
            </text>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        L (log scale)
      </text>
      <text x={padL + 4} y={padT + 10} fill={ED.series2} fontSize={9}>
        d_sig &gt; 0: claim fails
      </text>
      <text x={padL + 4} y={padT + plotH - 6} fill={ED.series3} fontSize={9}>
        d_sig &lt; 0: claim safe
      </text>
    </svg>
  );
}

export default function Imp96742SafeDirectionSignPerRungViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Basis-C: Per-Rung Safe-Direction Sign d_sig(L)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96742_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96714 checked whether the imp-96695 safe-direction claim
        (|rho_emp(L) + 1/2| &lt; |rho_GUE(L) + 1/2|, i.e. d_sig(L) &lt; 0) holds at every rung in
        the imp-96430 calibration window, not just at L = 960 where it was first exhibited. It
        does not: d_sig(L) is positive (claim fails) at the two smallest rungs L = 30 and L = 60,
        where the empirical number variance has not yet saturated to the rigidity limit -1/2, and
        negative (claim holds) at every rung L &ge; {IMP96742_SAFE_FROM_L}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        d_sig(L), L = 30..960
      </h3>
      <DSigBarPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96742
        viz-data (values reused verbatim from imp-96714). {IMP96742_HONEST_BANNER}
      </div>
    </div>
  );
}
