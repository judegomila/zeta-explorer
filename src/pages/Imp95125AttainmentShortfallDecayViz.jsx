import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL } from '../data/imp-95090-finite-rate-attainment-shortfall.js';
import { ED } from '../styles/tokens.js';

// Baked ladders imported verbatim from the imp-95090 data module; no new
// computation is performed here (viz/UX only).
const EPS_LADDER = IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.continuousLimitLadder.ladder;
const P_LADDER = IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.gridRefinementLadder.ladder;

const EPS_COLOR = ED.series1;
const P_COLOR = ED.series4;

function LogLogPanel({ points, xKey, xLabel, yLabel, color, title, dipIndex }) {
  const svgW = 320;
  const padL = 46;
  const padR = 16;
  const padT = 30;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xs = points.map((p) => Math.log10(p[xKey]));
  const ys = points.map((p) => Math.log10(p.shortfall));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const xPad = (xMax - xMin) * 0.12 || 0.5;
  const yPad = (yMax - yMin) * 0.12 || 0.5;

  const xS = (v) => padL + ((Math.log10(v) - (xMin - xPad)) / (xMax - xMin + 2 * xPad)) * cW;
  const yS = (v) => padT + cH - ((Math.log10(v) - (yMin - yPad)) / (yMax - yMin + 2 * yPad)) * cH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xS(p[xKey])} ${yS(p.shortfall)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <path d={path} fill="none" stroke={color} strokeWidth={1.5} opacity={0.85} />

      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={xS(p[xKey])}
            cy={yS(p.shortfall)}
            r={i === dipIndex ? 5 : 3.5}
            fill={i === dipIndex ? ED.series2 : color}
          />
          <text x={xS(p[xKey])} y={yS(p.shortfall) - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
            {p.shortfall.toExponential(2)}
          </text>
          <text x={xS(p[xKey])} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {xKey}={p[xKey]}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={padT - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
        {title}
      </text>
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        {xLabel} (log scale)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9}
        transform={`rotate(-90,12,${padT + cH / 2})`}
      >
        {yLabel}
      </text>
    </svg>
  );
}

export default function Imp95125AttainmentShortfallDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Finite-Rate Attainment Shortfall Decay at the Dominant Cell (imp-95125 / imp-95090)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95090 measured the finite-rate attainment shortfall of the exhibited far-bracket
        witness at its dominant cell (0,2): the exhibited p=97 witness realizes only 0.8258 of
        the substituted envelope envE, an unapplied 17.42 pct conservative slack in the ceiling
        for this witness. The two panels below plot the two decay ladders behind that number,
        both on log-log axes.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <LogLogPanel
            points={EPS_LADDER}
            xKey="eps"
            xLabel="corner offset eps"
            yLabel="shortfall (log scale)"
            color={EPS_COLOR}
            title="Continuous corner limit: shortfall vs eps"
          />
        </div>
        <div>
          <LogLogPanel
            points={P_LADDER}
            xKey="p"
            xLabel="alias grid rate p"
            yLabel="shortfall (log scale)"
            color={P_COLOR}
            title="Grid refinement: shortfall vs p"
          />
        </div>
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the left panel (blue)
        traces the continuous corner sequence d1 = 2^-(b+1)(1+eps) at fixed cell (0,2): the
        shortfall falls off at a per-decade ratio of roughly 0.10 as eps shrinks from 1e-1 to
        1e-4, a straight line on log-log axes -- the linear-in-eps decay recovering the imp-95019
        ratio &rarr; 1 in the continuous limit. The right panel (amber) fixes the continuous
        corner and instead refines the alias-grid rate p over {'{'}97, 193, 389, 769{'}'}: the
        shortfall falls off roughly as O(1/p), from 0.1742 at the exhibited p=97 rate down to
        0.0240 at p=769. imp-95090 notes this O(1/p) trend is non-monotone at isolated p where a
        closer grid point happens to alias onto the corner (a dip below the local O(1/p) trend
        line); no such dip lands inside this four-point ladder, so it is not visible as a point
        below its neighbor here.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page reusing the imp-95090
        continuousLimitLadder and gridRefinementLadder literals verbatim (no new computation). The
        shortfall names a conservative, unapplied grid-corner ceiling adjustment; it moves no bound.
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. No QED.
      </div>
    </div>
  );
}
