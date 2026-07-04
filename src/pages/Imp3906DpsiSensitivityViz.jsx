import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3906_ROWS,
  IMP3906_MIN_SLACK,
  IMP3906_MAX_SLACK,
} from '../data/imp-3906-dpsi-sensitivity-viz-data.js';

const ACTUAL_COLOR = '#38bdf8';
const CEILING_COLOR = '#f472b6';

function SensitivityVsCeilingChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMin = 1;
  const yMax = 1e6;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));
  const yTicks = [1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6];

  const groupW = cW / IMP3906_ROWS.length;
  const barW = 22;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3906_ROWS.map((r, i) => {
        const cx = padL + (i + 0.5) * groupW;
        const ceilTop = yS(r.rigorousCeilBase);
        const actualTop = yS(r.logSensBase);
        const bottom = padT + cH;
        return (
          <g key={r.plateauIndex}>
            <rect
              x={cx - barW - 3}
              y={ceilTop}
              width={barW}
              height={Math.max(bottom - ceilTop, 0)}
              fill={CEILING_COLOR}
              opacity={0.85}
              rx={2}
            />
            <rect
              x={cx + 3}
              y={actualTop}
              width={barW}
              height={Math.max(bottom - actualTop, 0)}
              fill={ACTUAL_COLOR}
              opacity={0.9}
              rx={2}
            />
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3906_ROWS.map((r, i) => (
        <text
          key={'x' + r.plateauIndex}
          x={padL + (i + 0.5) * groupW}
          y={padT + cH + 17}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9}
        >
          plateau {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        verified plateau (log axis)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        (dPsi/dT)/Psi
      </text>

      <rect x={padL + cW - 160} y={padT + 4} width={9} height={9} fill={ACTUAL_COLOR} />
      <text x={padL + cW - 147} y={padT + 12} fill="#94a3b8" fontSize={9}>
        actual log-sensitivity
      </text>
      <rect x={padL + cW - 160} y={padT + 18} width={9} height={9} fill={CEILING_COLOR} />
      <text x={padL + cW - 147} y={padT + 26} fill="#94a3b8" fontSize={9}>
        rigorous 8/smin^2 ceiling
      </text>
    </svg>
  );
}

function SlackFactorChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const yMin = 1e3;
  const yMax = 4e4;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));
  const yTicks = [1e3, 1e4, 3e4];

  const xS = (i) => padL + ((i + 0.5) / IMP3906_ROWS.length) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3906_ROWS.map((r, i) => {
        const barTop = yS(r.slack);
        const barBottom = padT + cH;
        const isMin = r.slack === IMP3906_MIN_SLACK;
        const isMax = r.slack === IMP3906_MAX_SLACK;
        return (
          <rect
            key={r.plateauIndex}
            x={xS(i) - 16}
            y={barTop}
            width={32}
            height={Math.max(barBottom - barTop, 0)}
            fill={isMin || isMax ? '#fbcfe8' : '#a78bfa'}
            opacity={isMin || isMax ? 1 : 0.75}
            rx={2}
          />
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3906_ROWS.map((r, i) => (
        <text key={'x' + r.plateauIndex} x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
          plateau {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        verified plateau (log axis)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        ceiling / actual slack
      </text>
    </svg>
  );
}

export default function Imp3906DpsiSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="imp-3874 LEMMA-3854 Sensitivity Verification: Actual Log-Sensitivity 8-17 vs Rigorous Ceiling 1.8e4-5.9e5 (2279x-34007x Slack)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3874 verified the imp-3854 LEMMA-3854 bound 0 &le; dPsi_N/dT &le; (8/smin&sup2;) Psi_N
        by direct finite difference against the exact analytic derivative, on 3 representative
        [1e4, 1e6] plateaus (0, 4, 9) swept across the feasible thetaBar window. The inequality
        holds at every one of the 15 sampled points, but the rigorous ceiling is loose: the
        realised log-sensitivity (dPsi_N/dT)/Psi_N sits at ~8-17 while the (8/smin&sup2;) ceiling
        it is measured against runs ~1.8e4 to 5.9e5 &mdash; a 2279x (plateau 0) to 34007x
        (plateau 9) over-bound, consistent with imp-3870&rsquo;s finding that the global-smin
        constant is valid but vacuous.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        actual log-sensitivity vs rigorous ceiling per plateau, log axis
      </p>
      <SensitivityVsCeilingChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        ceiling / actual slack factor per plateau, log axis -- labelled bars mark the overall min and max
      </p>
      <SlackFactorChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart pairs each
        verified plateau&rsquo;s actual (dPsi_N/dT)/Psi_N (blue) against the rigorous 8/smin&sup2;
        ceiling it is bounded by (pink) &mdash; the blue bar never exceeds the pink one (LEMMA-3854
        holds), but the gap between them spans 3-4 orders of magnitude. The bottom chart plots
        that gap directly as a ceiling/actual slack factor, ranging from{' '}
        {IMP3906_MIN_SLACK.toFixed(0)}x (plateau 0) to {IMP3906_MAX_SLACK.toFixed(0)}x (plateau 9).
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> this presents an imp-3874
        VERIFICATION of an existing lemma (imp-3854), not a new bound &mdash; LEMMA-3854 is
        CONFIRMED at every sampled point and stays a valid (loose) over-bound. Only 3 of the 10
        imp-3725 plateaus are verified here (imp-3874-sub-all-plateaus stays open); no new Lambda
        bound; imp-3066 K_a &ge; 0 positivity untouched; Platt-Trudgian &Lambda; &le; 0.2 remains
        the rigorous SOTA. NO QED.
      </div>
    </div>
  );
}
