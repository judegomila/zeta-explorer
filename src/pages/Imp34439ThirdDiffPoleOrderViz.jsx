import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34346_THIRD_DIFF_ROWS,
  IMP34346_TAIL_FIT,
  IMP34346_LOCAL_POLE_ORDER,
  imp34346WindowGap,
} from '../data/imp-34346-fixed-band-peak-third-diff-pole-order.js';
import { ED } from '../styles/tokens.js';

// log-log series: x = ln(window gap k*-kEnd), y = ln(third_diff), across the 10 fixed-grid nodes.
const LOG_LOG_ROWS = IMP34346_THIRD_DIFF_ROWS.map((r) => ({
  kEnd: r.kEnd,
  thirdDiff: r.thirdDiff,
  lx: Math.log(imp34346WindowGap(r.kEnd)),
  ly: Math.log(r.thirdDiff),
}));
const TAIL_ROWS = LOG_LOG_ROWS.filter((r) => r.kEnd >= 20.0 - 1e-9);

// log-log plot of third_diff vs window gap x = k*-kEnd, with the tail OLS fit line
// (slope = -poleOrder ~ -0.94) overlaid, showing the steeper local slope (~0.67) at the
// last node pair as the effective order falls toward the pole.
function ThirdDiffLogLogChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = -3.7;
  const xMax = 1.0;
  const yMin = -8;
  const yMax = -2.5;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const fitX0 = LOG_LOG_ROWS[0].lx;
  const fitX1 = LOG_LOG_ROWS[LOG_LOG_ROWS.length - 1].lx;
  const fitY0 = IMP34346_TAIL_FIT.intercept + IMP34346_TAIL_FIT.slope * fitX0;
  const fitY1 = IMP34346_TAIL_FIT.intercept + IMP34346_TAIL_FIT.slope * fitX1;

  const lastTwo = LOG_LOG_ROWS.slice(-2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[-8, -7, -6, -5, -4, -3].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {[-3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1].map((v) => (
        <text key={'x' + v} x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      {/* tail OLS fit: ln(third_diff) = intercept + slope * ln(x), slope = -poleOrder ~ -0.94 */}
      <line
        x1={xAt(fitX0)}
        y1={yAt(fitY0)}
        x2={xAt(fitX1)}
        y2={yAt(fitY1)}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={xAt(fitX1) - 4} y={yAt(fitY1) - 8} textAnchor="end" fill={ED.brass} fontSize={9.5}>
        tail OLS: p&nbsp;~&nbsp;{IMP34346_TAIL_FIT.poleOrder.toFixed(2)} (R&sup2;&nbsp;~&nbsp;{IMP34346_TAIL_FIT.r2.toFixed(2)})
      </text>

      <polyline
        points={LOG_LOG_ROWS.map((r) => `${xAt(r.lx)},${yAt(r.ly)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {LOG_LOG_ROWS.map((r) => (
        <circle
          key={r.kEnd}
          cx={xAt(r.lx)}
          cy={yAt(r.ly)}
          r={TAIL_ROWS.some((t) => t.kEnd === r.kEnd) ? 4 : 3}
          fill={TAIL_ROWS.some((t) => t.kEnd === r.kEnd) ? ED.series1 : '#475569'}
        />
      ))}

      {/* local last-pair secant: steeper local slope ~0.67, the effective order at the pole edge */}
      <line
        x1={xAt(lastTwo[0].lx)}
        y1={yAt(lastTwo[0].ly)}
        x2={xAt(lastTwo[1].lx)}
        y2={yAt(lastTwo[1].ly)}
        stroke={ED.series7}
        strokeWidth={2.5}
      />
      <text x={xAt(lastTwo[1].lx) + 4} y={yAt(lastTwo[1].ly) + 12} textAnchor="start" fill={ED.series7} fontSize={9.5}>
        local order&nbsp;~&nbsp;{IMP34346_LOCAL_POLE_ORDER.toFixed(2)}
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        ln(third_diff)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ln(k* &minus; kEnd)
      </text>

      <g>
        <rect x={padL + 8} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + 22} y={padT + 9} fill={ED.inkSoft} fontSize={10}>
          pole-dominated tail nodes (kEnd 20.00..21.25)
        </text>
        <rect x={padL + 8} y={padT + 16} width={10} height={10} fill="#475569" />
        <text x={padL + 22} y={padT + 25} fill={ED.inkSoft} fontSize={10}>
          earlier post-min nodes (kEnd 19.00..19.75)
        </text>
      </g>
    </svg>
  );
}

export default function Imp34439ThirdDiffPoleOrderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Peak Third-Difference Blow-Up: Sub-Unity, Falling Pole Order (imp-34439 / imp-34346)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34268 found the fixed-band (k &le; 10) peak carries strictly positive, growing third
        differences across the whole post-minimum branch, reaching +0.057428 at kEnd = 21.25 --
        the last computable quarter-rung before the resid_exp surrogate pole at k* ~ 21.28095.
        imp-34346 fit this blow-up in log-log space against the window gap x = k* &minus; kEnd: the
        pole-dominated tail (kEnd 20.00..21.25) gives an effective pole order p ~ 0.94
        (R&sup2; ~ 0.95), sub-unity -- weaker than a simple order-1 pole -- and the local slope over
        the last node pair drops further to ~0.67, the signature of a sub-power (logarithmic-family)
        divergence rather than a genuine integer-order pole.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log-log plot: third_diff vs window gap x = k* &minus; kEnd, tail OLS fit vs the steeper local last-pair secant
      </p>
      <ThirdDiffLogLogChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>third diff</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>x = k* &minus; kEnd</th>
          </tr>
        </thead>
        <tbody>
          {IMP34346_THIRD_DIFF_ROWS.map((row) => (
            <tr key={row.kEnd} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.kEnd.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.thirdDiff.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {imp34346WindowGap(row.kEnd).toFixed(5)}
              </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the falling local order:</strong> a genuine
        integer-order pole would hold a constant or rising local slope as x &rarr; 0; here the local
        slope instead DROPS from the tail estimate ~0.94 to ~0.67 over the last node pair, consistent
        with the imp-34253 logarithmic peak (peak ~ &minus;B&nbsp;ln x) whose discrete third difference
        blows up slower than any power.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Measurement / power-law-fit only
        (frontier-direction, NOT rigorous). The pole is a resid_exp surrogate artifact, not a physical
        singularity; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
        rigorous asymptotic; the fixed step h = 0.25 is not small versus x near the pole, so the
        reported order is effective, not a rigorous continuous-limit exponent; the C_mb GUE-conditional
        per imp-486 is UNTOUCHED; imp-3066 K_a&ge;0 untouched; changes no bound; NO QED.
      </div>
    </div>
  );
}
