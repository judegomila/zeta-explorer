import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95375_THETA_RANGE_GEOMETRY_IMAGE } from '../data/imp-95375-theta-range-geometry-image.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95375_THETA_RANGE_GEOMETRY_IMAGE;
const THETA_ALT = DATA.constants.thetaAlt;
const B_OVER_A = DATA.constants.bOverA;

const ROWS = Object.keys(THETA_ALT).map((key) => {
  const [p, D] = key.split(',').map(Number);
  return {
    key,
    pD: p * D,
    theta: THETA_ALT[key],
    boverA: B_OVER_A[key],
  };
});

// Dual-axis line chart: x = log10(pD), left axis = log10(theta_alt)
// descending toward theta_floor, right axis = log10(B/A) climbing as the
// ported centers overlap more heavily. The two curves tell one causal
// story -- heavier overlap (right axis, rising) drives deeper alternating-
// witness cancellation (left axis, falling).
function DescentOverlapChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 60;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xVals = ROWS.map((r) => Math.log10(r.pD));
  const xMin = Math.min(...xVals) - 0.15;
  const xMax = Math.max(...xVals) + 0.15;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const thetaLog = ROWS.map((r) => Math.log10(r.theta));
  const leftTop = Math.max(...thetaLog) + 0.4;
  const leftBot = Math.min(...thetaLog) - 0.4;
  const leftYOf = (v) => padT + ((leftTop - v) / (leftTop - leftBot)) * plotH;

  const boverALog = ROWS.map((r) => Math.log10(r.boverA));
  const rightTop = Math.max(...boverALog) + 0.3;
  const rightBot = Math.min(...boverALog) - 0.3;
  const rightYOf = (v) => padT + ((rightTop - v) / (rightTop - rightBot)) * plotH;

  const thetaPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(xVals[i])} ${leftYOf(thetaLog[i])}`).join(' ');
  const boverAPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(xVals[i])} ${rightYOf(boverALog[i])}`).join(' ');

  const leftTicks = [-1, -2, -3, -4];
  const rightTicks = [0, 1, 2, 3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {leftTicks.map((v) => (
        <line
          key={`gl${v}`}
          x1={padL}
          y1={leftYOf(v)}
          x2={padL + plotW}
          y2={leftYOf(v)}
          stroke={ED.ruleSoft}
          strokeWidth={1}
        />
      ))}
      <path d={thetaPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={boverAPath} fill="none" stroke={ED.series4} strokeWidth={2} strokeDasharray="6 3" />
      {ROWS.map((r, i) => (
        <g key={r.key}>
          <circle cx={xOf(xVals[i])} cy={leftYOf(thetaLog[i])} r={4} fill={ED.series1} />
          <circle cx={xOf(xVals[i])} cy={rightYOf(boverALog[i])} r={4} fill={ED.series4} />
          <text x={xOf(xVals[i])} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {r.pD}
          </text>
        </g>
      ))}
      {leftTicks.map((v) => (
        <text key={`lt${v}`} x={padL - 8} y={leftYOf(v) + 3} textAnchor="end" fill={ED.series1} fontSize={9}>
          {v}
        </text>
      ))}
      {rightTicks.map((v) => (
        <text key={`rt${v}`} x={padL + plotW + 8} y={rightYOf(v) + 3} textAnchor="start" fill={ED.series4} fontSize={9}>
          {v}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        window size pD (log scale)
      </text>
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.series1} fontSize={9.5} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        log10(theta_alt)
      </text>
      <text x={svgW - 10} y={padT + plotH / 2} textAnchor="middle" fill={ED.series4} fontSize={9.5} transform={`rotate(90 ${svgW - 10} ${padT + plotH / 2})`}>
        log10(B/A)
      </text>
    </svg>
  );
}

export default function Imp95434ThetaRangeDescentOverlapGrowthViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Theta Sign-Pattern Range: Alternating-Witness Descent vs Overlap Growth (imp-95375)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only
        page tabulating the imp-95375 geometry-image result. It refines the imp-95255
        LEG 2 classification and changes no bound. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        With transcribed packets f_n = e^(-mu_n |s-u_n|) and sign vector sigma in
        {' '}{'{+-1}'}^N, theta(sigma) = (sigma^T G sigma) / (1^T G 1) exactly, where G is
        the packet Gram. imp-95375 shows the geometry images the achievable RANGE
        {' '}[theta_floor, 1], not just the trivial point theta(all +1) = 1. The
        alternating witness sigma_n = (-1)^n is a cheap achievable point of that range,
        and it drives theta toward 0 as the window pD grows, exactly as the ported
        centers cluster and the off-/on-diagonal Gram mass ratio B/A climbs.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        theta(alternating) descent (blue, left axis) vs B/A overlap growth (orange, right axis)
      </h3>
      <DescentOverlapChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>pD</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>theta(alternating)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>B/A</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.key} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.pD}</td>
              <td style={{ textAlign: 'right' }}>{r.theta.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.boverA.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> theta(alternating)
        falls from 0.1115 at pD=8 to 2.4e-5 at pD=704 while B/A climbs from 1.79 to
        542.73 over the same five ported grids -- the ported centers u(d) = v/d cluster
        near 0 as d grows, packets overlap more heavily, and a signed combination
        nearly annihilates its modulus envelope. Greedy sign-flip descent finds nothing
        below the alternating witness on any grid, so it is a local minimizer of the
        imaged range, not merely an arbitrary sample.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Update (imp-95442):</strong> "local minimizer"
        above means greedy 1-flip-stable, not the true combinatorial argmin. A follow-up
        structured search (alternating bulk + randomized tail perturbation, then O(N)
        cached 1-flip descent) found an explicit sign vector strictly below the
        alternating witness at every ported grid N &ge; 16 -- relative gaps 2.32%, 1.71%,
        1.38%, 0.96% at N = 16, 64, 192, 640. The N = 16 witness reproduces the imp-95423
        certified exact floor; N = 64, 192, 640 were left OPEN by imp-95423 and are now
        decided negative (alternating is NOT the argmin) by construction. The exact
        combinatorial floor theta_floor for N &ge; 64 remains UNCOMPUTED (2^N enumeration
        infeasible). Changes no bound; NO QED.
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
        frozen imp-95375 record (exact closed-form Gram, no quadrature). This does not
        determine the actual seam sign pattern (imp-95397, still open); changes no
        bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
