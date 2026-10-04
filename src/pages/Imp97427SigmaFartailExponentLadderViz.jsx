import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97427_DECADE_LADDER,
  IMP97427_POINTWISE,
  IMP97427_FAR_TAIL_EXPONENT,
} from '../data/imp-97427-sigma-fartail-exponent-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97427: line chart of the imp-97404 extended sigma(N) per-decade local
// decay exponent p_local (windows [1e11,1e12] .. [1e14,1e15]) climbing toward
// the imp-3463 far-tail 1/2 asymptote, with the pointwise p(N) ladder overlaid.

function ExponentLadderChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const decadeRows = IMP97427_DECADE_LADDER;
  const pointwiseRows = IMP97427_POINTWISE;
  const minVal = 0.42;
  const maxVal = IMP97427_FAR_TAIL_EXPONENT * 1.02;
  const yOf = (v) => padT + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;
  const barW = plotW / decadeRows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0.42, 0.44, 0.46, 0.48, 0.5].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(IMP97427_FAR_TAIL_EXPONENT)}
        x2={padL + plotW}
        y2={yOf(IMP97427_FAR_TAIL_EXPONENT)}
        stroke={ED.series3}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97427_FAR_TAIL_EXPONENT) - 5} textAnchor="end" fill={ED.series3} fontSize={9}>
        far-tail asymptote 1/2
      </text>
      {decadeRows.map((r, i) => {
        const x = padL + i * barW + barW * 0.18;
        const w = barW * 0.64;
        const y = yOf(r.p_local);
        const h = padT + plotH - y;
        return (
          <g key={r.decade}>
            <rect x={x} y={y} width={w} height={h} fill={ED.series1} opacity={0.85} rx={2} />
            <text x={x + w / 2} y={y - 6} textAnchor="middle" fill={ED.series1} fontSize={9.5} fontWeight={600}>
              {r.p_local.toFixed(4)}
            </text>
            <text x={x + w / 2} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.decade}
            </text>
          </g>
        );
      })}
      {(() => {
        const n = pointwiseRows.length;
        const points = pointwiseRows.map((r, i) => {
          const x = padL + (i / (n - 1)) * plotW;
          const y = yOf(r.p);
          return `${x},${y}`;
        });
        return (
          <g>
            <polyline points={points.join(' ')} fill="none" stroke={ED.series7} strokeWidth={1.75} />
            {pointwiseRows.map((r, i) => {
              const x = padL + (i / (n - 1)) * plotW;
              const y = yOf(r.p);
              return (
                <circle key={r.N} cx={x} cy={y} r={2.75} fill={ED.series7} />
              );
            })}
          </g>
        );
      })()}
    </svg>
  );
}

export default function Imp97427SigmaFartailExponentLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="sigma(N) Far-Tail Decay-Exponent Ladder Past 1e12" />
      <p className="ed-lbl">Related: <Link to="/viz-imp35183-sigma-fartail-exponent-ladder">earlier run (imp-35183)</Link></p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> measurement/fit
        diagnostic reused verbatim from imp-97404, itself extending the imp-33582
        per-decade ladder. NOT an RH bound &mdash; conditional-share diagnostic
        only; no operator positivity established; PT Lambda&le;0.2 remains SOTA;
        RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The blue bars are the per-decade local exponent p_local = -slope of
        OLS(ln sigma vs ln N) over each window [10^k, 10^(k+1)] for k=11..14,
        extending the imp-33582 ladder past its 1e12 endpoint. The pink line is
        the pointwise local exponent p(N) sampled at N=1e12..1e15. Both climb
        monotonely toward the imp-3463 far-tail asymptote 1/2 (green dashed
        line), never reaching it at any finite N.
      </p>

      <ExponentLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the
        [1e12,1e13] rung (0.4646) matches the independent imp-96151 two-term
        closed-form value to 4 dp. The decade OLS R^2 (not plotted) climbs
        toward 1 alongside the exponent, from ~0.999701 at [1e11,1e12] to
        ~0.999999 at [1e14,1e15] &mdash; the power law is settling in, not a
        curved-window artifact.
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
        consuming the imp-97404 extendedLadder/pointwise arrays verbatim; no
        re-derivation. Establishes no new bound; RH open; NO QED.
      </div>
    </div>
  );
}
