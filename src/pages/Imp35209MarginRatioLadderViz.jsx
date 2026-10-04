import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION } from '../data/imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js';
import { ED } from '../styles/tokens.js';

const D = IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION;
const LADDER = D.sharedFoldLadder;
const LIMIT = D.marginRatioClosedForm; // 2/3
const HEAD = LADDER[0]; // smallest N, worst rho ~0.6754

// Log-x chart: rho(eps) at the nine rungs, the 2/3 asymptote, the head-worst point highlighted,
// and shaded bands between consecutive rungs marking the imp-35152 G-a un-sampled continuum gap.
function MarginRatioLadderChart() {
  const svgW = 680;
  const padL = 48;
  const padR = 20;
  const padT = 44;
  const padB = 34;
  const plotH = 260;
  const plotW = svgW - padL - padR;
  const svgH = padT + plotH + padB;

  const logEps = LADDER.map((r) => Math.log10(r.y_N_sharp));
  const xMin = Math.min(...logEps);
  const xMax = Math.max(...logEps);
  const xOf = (le) => padL + ((le - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0.6;
  const yMax = 1.02;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const rhoPath = LADDER.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.y_N_sharp))} ${yOf(r.marginRatio)}`,
  ).join(' ');
  const yTicks = [0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 22} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Margin ratio &rho;(eps) = C_ren / C_curv across the nine eps = y_N&#8593; rungs (imp-35076 / imp-35152)
      </text>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* rho >= 1 excursion floor, the un-ruled-out region between sampled rungs (G-a) */}
      <line
        x1={padL}
        y1={yOf(1)}
        x2={padL + plotW}
        y2={yOf(1)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={padL + plotW - 4} y={yOf(1) - 4} textAnchor="end" fill={ED.series2} fontSize={8.5}>
        rho = 1 (excursion floor, not yet excluded between rungs)
      </text>

      {/* shaded between-rung bands: sampled points are pinned, the continuum between them is G-a unsampled */}
      {LADDER.slice(0, -1).map((r, i) => {
        const xA = xOf(Math.log10(r.y_N_sharp));
        const xB = xOf(Math.log10(LADDER[i + 1].y_N_sharp));
        return (
          <rect
            key={r.N}
            x={xB}
            y={padT}
            width={xA - xB}
            height={plotH}
            fill={ED.series2}
            opacity={0.045}
          />
        );
      })}

      {/* 2/3 closed-form asymptote */}
      <line
        x1={padL}
        y1={yOf(LIMIT)}
        x2={padL + plotW}
        y2={yOf(LIMIT)}
        stroke={ED.brassDeco}
        strokeWidth={2}
        strokeDasharray="6 3"
      />
      <text x={padL + 4} y={yOf(LIMIT) - 6} fill={ED.brass} fontSize={8.5}>
        2/3 = 0.6667 asymptote (A_1 / A_2)
      </text>

      <path d={rhoPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      {LADDER.map((r) => (
        <circle
          key={r.N}
          cx={xOf(Math.log10(r.y_N_sharp))}
          cy={yOf(r.marginRatio)}
          r={r.N === HEAD.N ? 4.5 : 3}
          fill={r.N === HEAD.N ? ED.series2 : ED.series5}
        />
      ))}
      <text
        x={xOf(Math.log10(HEAD.y_N_sharp)) + 6}
        y={yOf(HEAD.marginRatio) - 8}
        fill={ED.series2}
        fontSize={8.5}
      >
        head-worst rho&asymp;{D.maxMarginRatioOverLadder.toFixed(4)} (N={HEAD.N})
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {LADDER.map((r) => (
        <text
          key={r.N}
          x={xOf(Math.log10(r.y_N_sharp))}
          y={padT + plotH + 14}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={7.5}
        >
          {r.N.toExponential(0).replace('+', '')}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 28} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (eps = y_N&#8593; = sqrt(2&pi;/N), decreasing left to right)
      </text>
    </svg>
  );
}

export default function Imp35209MarginRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Margin-Ratio Ladder: &rho;(eps) = C_ren / C_curv (imp-35209 / imp-35076 / imp-35152)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35076 measured the margin ratio &rho;(eps)&nbsp;=&nbsp;C_ren&nbsp;/&nbsp;C_curv between the
        H4 renormalized fold-reading derivative and the H3-derived curvature value on the shared
        quadratic fold, at nine eps&nbsp;=&nbsp;y_N&#8593; rungs (N&nbsp;=&nbsp;10&sup3;..10&#8311;). It
        tightens monotonically toward the closed-form limit 2/3, with the head (smallest N) rung the
        ladder&#39;s worst margin at &rho;&nbsp;&asymp;&nbsp;{D.maxMarginRatioOverLadder.toFixed(4)}.
        imp-35152 flagged gap G-a: the ladder samples only these nine points of the eps continuum, so an
        excursion to &rho;&nbsp;&ge;&nbsp;1 between rungs is not yet ruled out &mdash; the shaded bands
        below mark that un-sampled continuum.
      </p>

      <MarginRatioLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>eps = y_N&#8593;</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>C_ren (H4)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>C_curv (H3)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>&rho; = C_ren / C_curv</th>
          </tr>
        </thead>
        <tbody>
          {LADDER.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.y_N_sharp}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.cRen_H4}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.cCurv_H3}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.marginRatio}
                {r.N === HEAD.N ? ' (worst)' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        &rho; stays strictly below 1 at all nine sampled rungs and tightens toward
        2/3&nbsp;=&nbsp;0.6667 as N grows, confirming the imp-33766 a-fortiori direction on the
        sampled points. But the ladder is nine points on a continuum: gap G-a (imp-35152) notes that
        nothing yet forbids &rho;(eps)&nbsp;&ge;&nbsp;1 for an un-sampled eps strictly between two
        adjacent rungs &mdash; closing that requires obligation O3 (a uniform modulus of convergence),
        not more ladder points.
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
        imp-35076 nine-rung margin-ratio ladder verbatim (no new computation) with the imp-35152 G-a
        between-rung gap shown schematically as shaded bands. Verification only, on the inherited
        model-cusp surrogate; does not discharge H3, H4, or gap G-a; establishes no operator
        positivity; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
