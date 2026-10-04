import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97388_ROWS,
  IMP97388_S0,
  IMP97388_QCROSS_OVER_B,
  IMP97388_HONEST_BANNER,
} from '../data/imp-97388-route-m-interior-second-moment-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

// Full-width stacked bar per b: Qhat (green, ~99.6%) dwarfing Qcross (yellow) and Qrr (red).
function DominancePanel() {
  const rows = IMP97388_ROWS;
  const svgW = 720;
  const padL = 70;
  const padR = 70;
  const barH = 26;
  const rowH = 44;
  const svgH = rows.length * rowH + 16;
  const plotW = svgW - padL - padR;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((row, i) => {
        const y = 8 + i * rowH;
        const qhatW = row.qhatFrac * plotW;
        const qcrossW = row.qcrossFrac * plotW;
        const qrrW = row.qrrFrac * plotW;
        return (
          <g key={row.b}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              b = {row.b}
            </text>
            <rect x={padL} y={y} width={qhatW} height={barH} fill={ED.series3} opacity={0.85} />
            <rect x={padL + qhatW} y={y} width={qcrossW} height={barH} fill={ED.brassDeco} opacity={0.95} />
            <rect x={padL + qhatW + qcrossW} y={y} width={qrrW} height={barH} fill={ED.series2} opacity={0.95} />
            <text x={padL + plotW + 8} y={y + barH / 2 + 4} fill={ED.ink} fontSize={10}>
              {(row.qhatFrac * 100).toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Zoomed comparison of the two tiny arithmetic slivers (Qcross vs Qrr, % of Q(b)), showing
// Qcross consistently larger than Qrr and both roughly constant across b (linear-in-b feeds).
function ZoomedSliverPanel() {
  const rows = IMP97388_ROWS;
  const svgW = 720;
  const padL = 90;
  const padR = 60;
  const barH = 12;
  const rowGap = 8;
  const groupH = 2 * barH + rowGap;
  const rowSpacing = 14;
  const svgH = rows.length * (groupH + rowSpacing) + 16;
  const plotW = svgW - padL - padR;
  const maxFrac = Math.max(...rows.map((r) => r.qcrossFrac)) * 1.15;
  const xOf = (v) => (v / maxFrac) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((row, i) => {
        const y = 8 + i * (groupH + rowSpacing);
        return (
          <g key={row.b}>
            <text x={padL - 8} y={y + groupH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              b = {row.b}
            </text>
            <rect x={padL} y={y} width={xOf(row.qcrossFrac)} height={barH} fill={ED.brassDeco} opacity={0.95} />
            <text x={padL + xOf(row.qcrossFrac) + 6} y={y + barH - 2} fill={ED.ink} fontSize={9}>
              Qcross {(row.qcrossFrac * 100).toFixed(3)}%
            </text>
            <rect
              x={padL}
              y={y + barH + rowGap}
              width={xOf(row.qrrFrac)}
              height={barH}
              fill={ED.series2}
              opacity={0.95}
            />
            <text x={padL + xOf(row.qrrFrac) + 6} y={y + 2 * barH + rowGap - 2} fill={ED.ink} fontSize={9}>
              Qrr {(row.qrrFrac * 100).toFixed(3)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97388SecondMomentDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Interior Second-Moment Decomposition Q(b) = Qhat + Qcross + Qrr" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP97388_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97349 splits the exact Vasyunin coefficient I(a,b) into the elementary diagonal
        skeleton Ihat(a,b) = (a/2)log(b/a) + a(C+1/2) plus an arithmetic cotangent residual
        r(a,b) = I - Ihat, giving the interior second moment Q(b) = Qhat(b) + Qcross(b) + Qrr(b)
        (Qhat = &sum;Ihat&sup2;/a&sup2;, Qcross = &sum;2 Ihat r/a&sup2;, Qrr = &sum;r&sup2;/a&sup2;,
        coprime a). Qhat carries ~99.6% of Q(b) at every measured b and is a log-polynomial with
        NO b&#189; term, while the arithmetic pieces Qcross and Qrr are LINEAR in b -- measured
        Qcross(b)/b &asymp; {IMP97388_QCROSS_OVER_B.toFixed(4)}, Qrr(b)/b stable at &asymp; 0.0003,
        against the leading slope s0 &asymp; {IMP97388_S0.toFixed(3)}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Qhat dominance per b (green = Qhat, yellow = Qcross, red = Qrr)
      </h3>
      <DominancePanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        the two arithmetic slivers, zoomed (% of Q(b))
      </h3>
      <ZoomedSliverPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top panel is
        visually all-green at every b because Qhat genuinely carries ~99.6% of the total -- the
        zoomed panel below rescales just the Qcross/Qrr slivers so their relative size (Qcross
        consistently larger than Qrr) and their near-constant fraction across b (both feed the
        same leading-order slope, not a sub-leading term) are visible. The qcrossFrac/qrrFrac
        values are an approximation (measured per-b ratio divided by the baked leading slope s0),
        reused from imp-97349; no new bound, no new derivation.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97388 viz-data (figures reused verbatim from imp-97349). {IMP97388_HONEST_BANNER}
      </div>
    </div>
  );
}
