import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96239_GRID,
  IMP96239_SUMMARY,
  IMP96239_CAVEAT_BANNER,
} from '../data/imp-96239-ushape-slope-drift-viz-data.js';
import { ED } from '../styles/tokens.js';

// a(N) and b(N) local log-slopes across the [N_peak, N_flow] decade, x-axis = fraction of the
// ln(N) span so both endpoints line up regardless of the absolute N_peak/N_flow scale.
function SlopeDriftChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allVals = IMP96239_GRID.flatMap((r) => [r.a, r.b]);
  const minV = Math.min(...allVals) * 0.98;
  const maxV = Math.max(...allVals) * 1.02;
  const xOf = (frac) => padL + frac * plotW;
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
        slope
      </text>
      <text x={padL + plotW - 90} y={svgH - 4} fill={ED.inkSoft} fontSize={10}>
        N_peak &#8594; N_flow (ln N)
      </text>

      <polyline
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.75}
        points={IMP96239_GRID.map((r) => `${xOf(r.frac)},${yOf(r.a)}`).join(' ')}
      />
      <text x={padL + 6} y={yOf(IMP96239_GRID[0].a) - 8} fill={ED.series1} fontSize={9}>
        a(N) (nearly flat)
      </text>

      <polyline
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.75}
        points={IMP96239_GRID.map((r) => `${xOf(r.frac)},${yOf(r.b)}`).join(' ')}
      />
      <text x={padL + 6} y={yOf(IMP96239_GRID[0].b) + 14} fill={ED.brass} fontSize={9}>
        b(N) (~6.6x more drift)
      </text>

      {[IMP96239_GRID[0], IMP96239_GRID[IMP96239_GRID.length - 1]].map((r) => (
        <g key={r.frac}>
          <circle cx={xOf(r.frac)} cy={yOf(r.a)} r={3} fill={ED.series1} />
          <circle cx={xOf(r.frac)} cy={yOf(r.b)} r={3} fill={ED.brassDeco} />
        </g>
      ))}
      <text x={xOf(0)} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={9} textAnchor="start">
        N_peak
      </text>
      <text x={xOf(1)} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={9} textAnchor="end">
        N_flow
      </text>
    </svg>
  );
}

export default function Imp96239UshapeSlopeDriftViz() {
  const s = IMP96239_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="U-Shape a(N)/b(N) Slope Drift and the Drift-Integrated Location Law (imp-96210 / imp-96239)" />
      <p className="ed-lbl">Related: <Link to="/viz-imp96257-ushape-slope-drift">later run (imp-96257)</Link></p>

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96239_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Across the [N_peak, N_flow] decade of the E(N)-share U-shape, a(N) (blue) stays nearly flat
        while b(N) (yellow) rises about 6.6x more, so the decade-averaged slope sum &lt;a+b&gt;
        exceeds its peak value. Feeding &lt;a+b&gt; into N_peak/N_flow = (b/a)^(1/&lt;a+b&gt;)
        tightens the imp-96187 constant-slope residual 20x.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        a(N), b(N) across the peak-to-N_flow decade
      </h3>
      <SlopeDriftChart />

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
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>at N_peak</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>at N_flow</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>a(N)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{s.a_peak.toFixed(6)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{s.a_at_N_flow.toFixed(6)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>b(N)</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{s.b_peak.toFixed(6)}</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{s.b_at_N_flow.toFixed(6)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>a+b</td>
            <td style={{ textAlign: 'right' }}>{s.sum_at_peak.toFixed(6)}</td>
            <td style={{ textAlign: 'right' }}>&lt;a+b&gt; = {s.avg_sum_decade.toFixed(6)}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        constant-slope vs drift-integrated location law
      </h3>
      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: 'var(--ink)',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>formula</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>N_peak/N_flow</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>rel. err vs measured</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>measured</td>
            <td style={{ textAlign: 'right' }}>{s.peak_over_N_flow_measured.toFixed(6)}</td>
            <td style={{ textAlign: 'right' }}>&mdash;</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>constant-slope (imp-96187 P2)</td>
            <td style={{ textAlign: 'right' }}>{s.const_slope_formula.toFixed(6)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>
              {s.const_slope_rel_err.toExponential(2)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>drift-integrated (imp-96210 D2)</td>
            <td style={{ textAlign: 'right' }}>{s.drift_integrated_formula.toFixed(6)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-3)' }}>
              {s.drift_integrated_rel_err.toExponential(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
        Drift-integrated residual is {s.residual_tightening_x.toFixed(1)}x tighter than the
        constant-slope residual.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page recomputing the
        imp-96210 a(N), b(N) grid from the identical inherited component model to expose it for
        charting (no new derivation). Measurement/derivation display only; the C_mb GUE-conditional
        share (imp-486) stays untouched; establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
