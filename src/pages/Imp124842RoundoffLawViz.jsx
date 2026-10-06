import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP124842_ROUNDOFF_LAW_ROWS, IMP124842_SUMMARY } from '../data/imp-124842-pairratio-reldiff-ecf-roundoff-law-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-124811 round-off law verbatim (no new computation): the log-log scatter of
// |reldiff| vs |E_CF| (slope ~ -1) and the flat invariant product P = |reldiff|*|E_CF| that
// discriminates pure precision loss from a genuine identity drift.

const log10 = (v) => Math.log10(v);

function LogLogScatterChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const rows = IMP124842_ROUNDOFF_LAW_ROWS;
  const xs = rows.map((r) => log10(r.absE_CF));
  const ys = rows.map((r) => log10(r.absReldiff));
  const xMin = Math.floor(Math.min(...xs)) - 0.5;
  const xMax = Math.ceil(Math.max(...xs)) + 0.5;
  const yMin = Math.floor(Math.min(...ys)) - 0.5;
  const yMax = Math.ceil(Math.max(...ys)) + 0.5;

  const xS = (xv) => padL + ((xv - xMin) / (xMax - xMin)) * cW;
  const yS = (yv) => padT + cH * (1 - (yv - yMin) / (yMax - yMin));

  // Slope -1 reference line through the first point, for visual comparison with the fit.
  const refY0 = ys[0] + -1 * (xMin - xs[0]);
  const refY1 = ys[0] + -1 * (xMax - xs[0]);

  const xTicks = [];
  for (let t = Math.ceil(xMin); t <= Math.floor(xMax); t++) xTicks.push(t);
  const yTicks = [];
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={'y' + t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(t) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <line key={'x' + t} x1={xS(t)} y1={padT} x2={xS(t)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={0.7} />
      ))}

      <line
        x1={xS(xMin)}
        y1={yS(refY0)}
        x2={xS(xMax)}
        y2={yS(refY1)}
        stroke={ED.brass}
        strokeWidth={2}
        strokeDasharray="5 4"
        strokeOpacity={0.7}
      />

      {rows.map((r, i) => (
        <g key={r.key}>
          <circle cx={xS(xs[i])} cy={yS(ys[i])} r={4} fill={ED.series1} />
          <text x={xS(xs[i]) + 7} y={yS(ys[i]) - 6} fill={ED.inkSoft} fontSize={9}>
            {r.key}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |E_CF| (log scale, collapsing L2 -&gt; L7)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        |reldiff| (log scale)
      </text>
    </svg>
  );
}

function InvariantProductChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const rows = IMP124842_ROUNDOFF_LAW_ROWS;
  const logP = rows.map((r) => log10(r.product));
  const yMin = Math.floor(Math.min(...logP)) - 0.5;
  const yMax = Math.ceil(Math.max(...logP)) + 0.5;
  const barW = (cW / rows.length) * 0.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (logV) => padT + cH * (1 - (logV - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <rect
          key={r.key}
          x={xS(i) - barW / 2}
          y={yS(logP[i])}
          width={barW}
          height={padT + cH - yS(logP[i])}
          fill={ED.series2}
        />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {rows.map((r, i) => (
        <g key={'x' + r.key}>
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.key}
          </text>
          <text x={xS(i)} y={yS(logP[i]) - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
            {r.product.toExponential(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        P = |reldiff| * |E_CF|, flat not decreasing (log scale)
      </text>
    </svg>
  );
}

export default function Imp124842RoundoffLawViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Pair-Ratio |reldiff|-vs-|E_CF| Round-Off Law (imp-124811)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-124770 noted that the direct cross-check of the imp-97665 EXACT pair-ratio identity
        E_CF/E_ET = E_flow/E_trunc has |reldiff| growing monotonically down the landmark ladder,
        and attributed the growth to the collapse of |E_CF| into the landmark-bisection round-off
        floor. imp-124811 fits that relationship as a law: a log-log regression of |reldiff|
        against |E_CF| over landmarks L2..L7 has slope close to the predicted -1 (the dashed
        reference line below), and the invariant product P = |reldiff| * |E_CF| stays flat rather
        than decreasing toward the deep tail -- the discriminator for pure precision loss against a
        genuine identity drift.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log-log: |reldiff| vs |E_CF| across L2..L7 (dashed: predicted slope -1)
      </p>
      <LogLogScatterChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        invariant product P = |reldiff| * |E_CF|, the round-off floor R
      </p>
      <InvariantProductChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124842_SUMMARY.verdict}
      </div>
    </div>
  );
}
