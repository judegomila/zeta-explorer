import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96040_A0_ROWS,
  IMP96040_MEAN_SE,
  IMP96040_CONJECTURAL,
  IMP96040_CAVEAT_BANNER,
} from '../data/imp-96040-a0-reconcile-panel-viz-data.js';
import { ED } from '../styles/tokens.js';

// scatter of a_0(T) across the six accessible heights, with the sample mean,
// a +/-SE band, and the imp-95984 published conjectural line overlaid.
function A0ScatterChart() {
  const svgW = 560;
  const svgH = 280;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const { mean, seMean } = IMP96040_MEAN_SE;
  const { value: conjectural } = IMP96040_CONJECTURAL;
  const a0Vals = IMP96040_A0_ROWS.map((r) => r.a0);
  const logTs = IMP96040_A0_ROWS.map((r) => Math.log10(r.Tc));
  const minLogT = Math.min(...logTs);
  const maxLogT = Math.max(...logTs);

  const allVals = [...a0Vals, mean - seMean, mean + seMean, conjectural];
  const minV = Math.min(...allVals) - 0.06;
  const maxV = Math.max(...allVals) + 0.06;

  const xOf = (logT) => padL + ((logT - minLogT) / (maxLogT - minLogT)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      <text x={4} y={padT + 4} fill={ED.inkSoft} fontSize={10}>
        a_0(T)
      </text>
      <text x={padL + plotW - 40} y={svgH - 4} fill={ED.inkSoft} fontSize={10}>
        log10 T &#8594;
      </text>

      {/* +/- SE band around the sample mean */}
      <rect
        x={padL}
        y={yOf(mean + seMean)}
        width={plotW}
        height={yOf(mean - seMean) - yOf(mean + seMean)}
        fill={ED.series1}
        opacity={0.12}
      />
      <line
        x1={padL}
        y1={yOf(mean)}
        x2={padL + plotW}
        y2={yOf(mean)}
        stroke={ED.series1}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + plotW - 4} y={yOf(mean) - 4} fill={ED.series1} fontSize={9} textAnchor="end">
        mean {mean.toFixed(5)} &plusmn; SE {seMean.toFixed(5)}
      </text>

      {/* conjectural a_0 = -0.176248 line (imp-95984, I_F = 1) */}
      <line
        x1={padL}
        y1={yOf(conjectural)}
        x2={padL + plotW}
        y2={yOf(conjectural)}
        stroke={ED.series2}
        strokeWidth={1.5}
      />
      <text x={padL + 4} y={yOf(conjectural) - 4} fill={ED.series2} fontSize={9} textAnchor="start">
        conjectural (I_F=1) {conjectural.toFixed(6)}
      </text>

      {IMP96040_A0_ROWS.map((row) => {
        const x = xOf(Math.log10(row.Tc));
        const y = yOf(row.a0);
        return (
          <g key={row.Tc}>
            <circle cx={x} cy={y} r={3.5} fill={ED.brassDeco} />
            <text x={x} y={y - 8} fill={ED.brass} fontSize={9} textAnchor="middle">
              {row.a0.toFixed(3)}
            </text>
            <text x={x} y={svgH - padB + 14} fill={ED.inkFaint} fontSize={9} textAnchor="middle">
              {row.Tc.toExponential(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp96040A0ReconcilePanelViz() {
  const { zScore, pTwoSided } = IMP96040_CONJECTURAL;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Six-Height a_0 Scatter vs Conjectural Line (imp-96005 / imp-96040)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96040_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96005 reconciliation backed a_0(T) out of the six accessible heights
        (T = 1e4..5e5, yellow points), computed the sample mean and standard error (blue
        band), and compared it against the imp-95984 published conjectural value under
        Montgomery-conjectural I_F = 1 (red line). This panel renders that comparison,
        annotated with z = {zScore.toFixed(3)} / p &#8776; {pTwoSided.toFixed(3)}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        a_0(T) across the six accessible heights
      </h3>
      <A0ScatterChart />

      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: 'var(--ink)',
          borderCollapse: 'collapse',
          marginTop: '1.25rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>sample mean a_0 (n=6)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>
              {IMP96040_MEAN_SE.mean.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>standard error of the mean</td>
            <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>
              {IMP96040_MEAN_SE.seMean.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>conjectural a_0 (I_F = 1, imp-95984)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>
              {IMP96040_CONJECTURAL.value.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>gap in standard errors (z)</td>
            <td style={{ textAlign: 'right' }}>{zScore.toFixed(4)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>two-sided p</td>
            <td style={{ textAlign: 'right' }}>{pTwoSided.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        imp-96005 six-height a_0 scatter, mean, SE band and conjectural line verbatim (no
        re-derivation). The gap is 0.337 SE (p &#8776; 0.736) -- fully noise-consistent, not a
        resolved discrepancy. Supplies no new bound, establishes no operator positivity, no RH
        claim. NO QED.
      </div>
    </div>
  );
}
