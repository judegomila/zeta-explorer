import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35195_HORIZON_FRONT_MISMATCH_RATIO } from '../data/imp-35195-horizon-front-mismatch-ratio.js';
import { ED } from '../styles/tokens.js';

const D = IMP35195_HORIZON_FRONT_MISMATCH_RATIO;
const ROWS = D.ladder;
const ANCHOR = D.asymptoticAnchor;
const TOP = D.crossover.topRung;

// log-log chart of T_minus(g,beta) (certified non-collision window) against t_c(N) (the
// O(1) collision-front fit), across the accessible ladder N=5..870 plus the imp-2762
// verified g_min(1e4) asymptotic anchor, showing the window sitting O(1)-comparable to the
// front at small N and only beginning to fall away as N grows toward the anchor.
function HorizonFrontChart() {
  const svgW = 680;
  const padL = 54;
  const padR = 20;
  const padT = 54;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = Math.log10(5);
  const xMax = Math.log10(ANCHOR.N);
  const yMin = Math.log10(1e-4);
  const yMax = Math.log10(1.2);
  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const tMinusPoints = [...ROWS.map((r) => ({ N: r.N, v: r.Tminus })), { N: ANCHOR.N, v: ANCHOR.tMinusLeading }];
  const tcPoints = [...ROWS.map((r) => ({ N: r.N, v: r.tcFit })), { N: ANCHOR.N, v: ANCHOR.tcFit }];
  const tMinusPath = tMinusPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.N)} ${yOf(p.v)}`).join(' ');
  const tcPath = tcPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.N)} ${yOf(p.v)}`).join(' ');

  const yTicks = [1e-4, 1e-3, 1e-2, 1e-1, 1];
  const xTicks = [5, 10, 100, 870, 10000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 38} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        T_minus(g,beta) certified window vs. t_c(N) collision front, log-log (imp-35195 / imp-35167 M5)
      </text>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      {/* crossover onset marker (top accessible rung, N=870) */}
      <line
        x1={xOf(TOP.N)}
        y1={padT}
        x2={xOf(TOP.N)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="2 3"
      />
      <text x={xOf(TOP.N) + 4} y={padT + 10} fill={ED.series2} fontSize={8.5}>
        N=870 (ratio first &lt; 1/2)
      </text>
      {/* asymptotic anchor marker (imp-2762 verified g_min(1e4)) */}
      <line
        x1={xOf(ANCHOR.N)}
        y1={padT}
        x2={xOf(ANCHOR.N)}
        y2={padT + plotH}
        stroke={ED.series1}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={xOf(ANCHOR.N) - 4} y={padT + 22} textAnchor="end" fill={ED.series1} fontSize={8.5}>
        N=1e4 anchor (ratio ~{ANCHOR.ratio.toFixed(3)})
      </text>
      <path d={tcPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6 3" />
      <path d={tMinusPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          N={N}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 10} r={3} fill={ED.series5} />
        <text x={padL + 12} y={padT - 6} fill={ED.series5} fontSize={8.5}>
          T_minus(g,beta) &asymp; g_min(0,N)^2/8
        </text>
        <circle cx={padL + 220} cy={padT - 10} r={3} fill={ED.brassDeco} />
        <text x={padL + 228} y={padT - 6} fill={ED.brass} fontSize={8.5}>
          t_c(N) &asymp; 0.0066 + 4.91/N
        </text>
      </g>
    </svg>
  );
}

export default function Imp35206HorizonFrontMismatchViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Horizon-Front Mismatch: T_minus(g,beta) vs. t_c(N) (imp-35206 / imp-35195 / imp-35167 M5)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35167 identified M5 (horizon-reaches-front) as the structural binding obstruction to a
        certified non-collision g_min(t)&nbsp;&gt;&nbsp;0 along the whole backward Dyson trajectory:
        the certified non-collision window T_minus(g,beta) collapses toward the O(1) collision front
        t_c(N) only asymptotically. imp-35195 measured both quantities on real inputs (the actual
        initial min-gap g_min(0,N) of the first N Riemann zero ordinates, an empirical RvM
        height-density beta(N), and the established OLS front fit t_c(N)) across N&nbsp;=&nbsp;5..870,
        plus the verified g_min(1e4)&nbsp;=&nbsp;0.0376985 (imp-2762) anchor. This page plots that
        measurement.
      </p>

      <HorizonFrontChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>g_min(0,N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>T_minus</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.gMin}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.Tminus}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.tcFit}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ratio}</td>
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--series-1)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ANCHOR.N} (anchor)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ANCHOR.gMin1e4}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ANCHOR.tMinusLeading}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ANCHOR.tcFit}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ANCHOR.ratio}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Across the accessible zero range the ratio T_minus/t_c stays O(1) (&asymp;&nbsp;
        {D.accessibleRange.ratioMin.toFixed(3)}..{D.accessibleRange.ratioMax.toFixed(3)}), even
        crossing 1 near N&nbsp;=&nbsp;100. The collapse only becomes visible once g_min drops below
        the crossover g&nbsp;&asymp;&nbsp;{D.crossover.gCrossover.toFixed(4)}: at the verified
        g_min(1e4)&nbsp;=&nbsp;{ANCHOR.gMin1e4} the ratio has fallen to
        &asymp;&nbsp;{ANCHOR.ratio.toExponential(3)}, a &asymp;&nbsp;
        {ANCHOR.dropFromAccessiblePlateau.toFixed(0)}&times; drop from the small-N O(1) plateau,
        entirely from g_min shrinking against the fixed 0.0066 front floor while t_c(N) stays O(1).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35195 T_minus/t_c literals verbatim (no new computation). T_minus uses the imp-2563
        certified window AS-IS; beta(N) is the RvM density MODEL, not a certified sup over the true
        backward flow; t_c(N) is an empirical OLS fit. Confirms the imp-35167 M5 mismatch is real but
        ASYMPTOTIC (not visible across the accessible zero range); I2/M5 stay OPEN; the sandwich
        remains a valid CONDITIONAL bracket; C_mb GUE-conditional per imp-486 untouched; changes no
        bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
