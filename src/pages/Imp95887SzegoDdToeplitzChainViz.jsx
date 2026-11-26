import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95887_SZEGO_FIT_ROWS,
  IMP95887_DELTA_COMPARISON_ROWS,
  IMP95887_FINDING_A_NOTE,
  IMP95887_CAVEAT_BANNER,
} from '../data/imp-95887-szego-dd-toeplitz-chain-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAR_COLORS = { pred: ED.series8, dd: ED.series1, float64: ED.series2 };

// grouped bar chart: predicted C(delta) vs DD fit vs float64 fit, per delta row
function SzegoFitBarChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const maxVal = Math.max(...IMP95887_SZEGO_FIT_ROWS.map((r) => Math.max(r.cPred, r.ddCFit, r.float64CFit)));
  const yMax = Math.ceil(maxVal / 100) * 100;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  const groupW = plotW / IMP95887_SZEGO_FIT_ROWS.length;
  const barW = groupW / 5;

  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      {IMP95887_SZEGO_FIT_ROWS.map((row, i) => {
        const gx = padL + i * groupW + groupW / 2;
        const bars = [
          { key: 'pred', val: row.cPred, color: BAR_COLORS.pred },
          { key: 'dd', val: row.ddCFit, color: BAR_COLORS.dd },
          { key: 'float64', val: row.float64CFit, color: BAR_COLORS.float64 },
        ];
        return (
          <g key={row.label}>
            {bars.map((b, j) => {
              const x = gx - (1.5 - j) * barW;
              const h = plotH - (yOf(b.val) - padT);
              return (
                <rect
                  key={b.key}
                  x={x}
                  y={yOf(b.val)}
                  width={barW * 0.85}
                  height={Math.max(h, 1)}
                  fill={b.color}
                  opacity={b.key === 'float64' && row.float64Broken ? 0.55 : 0.9}
                />
              );
            })}
            <text x={gx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
              {row.label}
            </text>
            {row.float64Broken && (
              <text x={gx} y={padT + plotH + 30} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
                float64 broken (+{row.float64RelErrPct.toFixed(0)}%)
              </text>
            )}
          </g>
        );
      })}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(0)}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        C(delta)
      </text>
      <g transform={`translate(${padL}, 8)`}>
        {['pred', 'dd', 'float64'].map((k, i) => (
          <g key={k} transform={`translate(${i * 130}, 0)`}>
            <rect width={10} height={10} fill={BAR_COLORS[k]} />
            <text x={14} y={9} fill={ED.inkSoft} fontSize={9.5}>
              {k === 'pred' ? 'predicted pi^2/(2d^2)' : k === 'dd' ? 'double-double fit' : 'float64 fit'}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// log-x scatter: reach (x) vs u_fit_rel% (y, log) per delta, illustrating Finding A
function ReachVsUFitChart() {
  const rows = IMP95887_DELTA_COMPARISON_ROWS.filter((r) => r.hasUFitInterval);
  const svgW = 560;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 200;
  const svgH = padT + plotH + padB;

  const xMin = 0;
  const xMax = Math.max(...rows.map((r) => r.reachLatest)) * 1.15;
  const xOf = (v) => padL + (v / xMax) * plotW;

  const yMin = 0;
  const yMax = Math.max(...rows.map((r) => r.uFitRelPct)) * 1.25;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  const COLORS = { 'ln1.2': ED.series1, 'ln1.3': ED.series5 };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={padL}
          y1={padT + f * plotH}
          x2={padL + plotW}
          y2={padT + f * plotH}
          stroke={ED.ruleSoft}
          strokeWidth={1}
        />
      ))}
      {rows.map((r) => (
        <g key={r.label}>
          <circle cx={xOf(r.reachLatest)} cy={yOf(r.uFitRelPct)} r={6} fill={COLORS[r.label]} />
          <text x={xOf(r.reachLatest) + 10} y={yOf(r.uFitRelPct) - 8} fill={COLORS[r.label]} fontSize={9.5}>
            {`${r.label}: reach ${r.reachLatest.toFixed(0)}, u_fit ${r.uFitRelPct.toFixed(2)}%, cond ~${r.condApprox.toExponential(1)}`}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        reach R = delta (N+1)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        u_fit_rel (%)
      </text>
    </svg>
  );
}

export default function Imp95887SzegoDdToeplitzChainViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Szego / DD-Toeplitz Chain: C(delta) Crosscheck and Per-Delta Reach (imp-95743 / imp-95885 / imp-95887)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95887_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95778 orphan/consumer audit found the imp-95743 Szego-coefficient / DD-Toeplitz
        research chain assertion-reachable but not yet rendered on any page. This page surfaces the
        chain&rsquo;s two key held results: the imp-95743 double-double eigensolver cross-check of
        the Szego edge coefficient C(delta)&nbsp;=&nbsp;pi&sup2;/(2&nbsp;delta&sup2;), and the
        imp-95885 per-delta reach / conditioning comparison across ln&nbsp;1.2, ln&nbsp;1.25 and
        ln&nbsp;1.3.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Szego coefficient fit: predicted vs double-double vs float64
      </h3>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        At delta&nbsp;=&nbsp;ln&nbsp;1.3 (the imp-95677 float64 cancellation floor) the float64 fit
        C&nbsp;=&nbsp;951 is meaningless (+1227%); the double-double fit C&nbsp;=&nbsp;66.68 tracks
        the predicted 71.69 to within &minus;7.0%. At delta&nbsp;=&nbsp;ln&nbsp;1.5 (the
        dual-vs-direct overlap region) both methods agree.
      </p>
      <SzegoFitBarChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>C predicted</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>C (DD fit)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>DD rel err</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>C (float64 fit)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>float64 rel err</th>
          </tr>
        </thead>
        <tbody>
          {IMP95887_SZEGO_FIT_ROWS.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.cPred.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{r.ddCFit.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{r.ddRelErrPct.toFixed(2)}%</td>
              <td style={{ textAlign: 'right', color: r.float64Broken ? 'var(--series-2)' : 'var(--ink)' }}>{r.float64CFit.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: r.float64Broken ? 'var(--series-2)' : 'var(--ink)' }}>
                {r.float64RelErrPct > 0 ? '+' : ''}
                {r.float64RelErrPct.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        Per-delta reach vs u_fit_rel: reach does not order the intervals
      </h3>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        {IMP95887_FINDING_A_NOTE}
      </p>
      <ReachVsUFitChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>conditioning</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>reach R</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>u_fit_rel</th>
          </tr>
        </thead>
        <tbody>
          {IMP95887_DELTA_COMPARISON_ROWS.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.condApprox.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{r.reachLatest.toFixed(0)}</td>
              <td style={{ textAlign: 'right' }}>{r.hasUFitInterval ? `${r.uFitRelPct.toFixed(2)}%` : 'N/A (crossing thread only)'}</td>
            </tr>
          ))}
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
        imp-95743 and imp-95885 modules verbatim (no re-derivation). Supplies no new bound,
        establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
