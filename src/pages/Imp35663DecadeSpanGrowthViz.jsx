import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35663_SPAN_LADDER,
  IMP35663_SUMMARY,
} from '../data/imp-35663-eflow-fartail-decade-span-growth-viz-data.js';
import { ED } from '../styles/tokens.js';

function SpanBarChart({ rows }) {
  const w = 720;
  const h = 220;
  const padL = 64;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const bars = rows.filter((r) => r.span !== null);
  const maxSpan = Math.max(...bars.map((r) => r.span));
  const barW = plotW / bars.length;

  const yPix = (v) => padT + plotH - (v / maxSpan) * plotH;

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, maxSpan / 2, maxSpan].map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={yPix(t)} y2={yPix(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yPix(t) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {t.toFixed(0)}
          </text>
        </g>
      ))}
      <line x1={padL} x2={w - padR} y1={padT + plotH} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {bars.map((r, i) => {
        const x = padL + i * barW + barW * 0.15;
        const bw = barW * 0.7;
        const y = yPix(r.span);
        return (
          <g key={r.threshold}>
            <rect x={x} y={y} width={bw} height={padT + plotH - y} fill={ED.series1} />
            <text x={x + bw / 2} y={y - 6} textAnchor="middle" fill={ED.ink} fontSize={10}>
              {r.span.toFixed(1)}
            </text>
            <text x={x + bw / 2} y={h - 12} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
              {r.threshold}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp35663DecadeSpanGrowthViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Remnant Decade-Span-Growth Ladder (imp-35663 / imp-35553)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35553 fit and directly measured how many decades of N it takes to shed each further
        factor of ten from the E_flow far-tail fd-vs-analytic remnant, on the closed surrogate
        height map. The span to shed each decade GROWS -- 83.57, then 300.86, then 1057.69 decades
        -- but the growth is SUB-geometric: the span ratio declines (3.6001&nbsp;&rarr;&nbsp;3.5156)
        toward the sqrt(10)&nbsp;&asymp;&nbsp;3.1623 asymptote fixed by the remnant&apos;s
        2&nbsp;loglog&nbsp;N&nbsp;/&nbsp;(log&nbsp;N)&sup2; leading form (imp-35552).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Decade span to shed each further factor of ten
      </h3>
      <SpanBarChart rows={IMP35663_SPAN_LADDER} />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>threshold</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>crossing log10 N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>span</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio</th>
          </tr>
        </thead>
        <tbody>
          {IMP35663_SPAN_LADDER.map((row) => (
            <tr key={row.threshold} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.threshold}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.crossingLog10N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.span === null ? '--' : row.span}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.ratio === null ? '--' : row.ratio}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The constant-ratio (geometric) projection from the first two spans places the sub-1e-6
        crossing at 10^{IMP35663_SUMMARY.projectedSub1e6.toFixed(2)}, while a DIRECT bisection on
        the identical channel puts it at 10^{IMP35663_SUMMARY.directSub1e6.toFixed(4)} -- the
        geometric fit overshoots by {IMP35663_SUMMARY.overshootDecades.toFixed(2)} decades
        (~{IMP35663_SUMMARY.overshootPercent.toFixed(2)}%) because the span ratio is not constant,
        declining toward sqrt(10)&nbsp;&asymp;&nbsp;{IMP35663_SUMMARY.sqrt10.toFixed(4)}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35553 span ladder verbatim; no new derivation, no bound changed. Measurement only
        on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 UNTOUCHED;
        changes no bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>

      <RelatedLinks
        links={[
          {
            to: '/viz-imp35664-fartail-crossing-height-map-sensitivity',
            label: 'imp-35664 Far-Tail-Crossing Height-Map Sensitivity',
          },
          {
            to: '/viz-imp35665-pinsker-common-functional-bridge',
            label: 'imp-35665 Pinsker Common-Functional Bridge',
          },
          {
            to: '/viz-imp35561-peak-height-map-sensitivity',
            label: 'imp-35561 Peak Height-Map Sensitivity',
          },
        ]}
      />
    </div>
  );
}
