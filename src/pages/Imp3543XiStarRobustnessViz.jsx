import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3543_PEAK_SLOPE,
  IMP3543_ONE_PERCENT_PEAK,
  IMP3543_XI_MAX,
  IMP3543_REFINED,
  IMP3543_COARSE_ALIAS,
  IMP3543_TAIL_BAND_EDGES,
  IMP3543_REFINED_TAIL_BANDMAX,
  IMP3543_COARSE_TAIL_BANDMAX,
} from '../data/imp-3543-xistar-robustness-viz-data.js';
import { ED } from '../styles/tokens.js';

const XI_MIN = 1;

function RootMapChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const logXi = (xi) => Math.log10(xi);
  const xMinL = logXi(XI_MIN);
  const xMaxL = logXi(IMP3543_XI_MAX);
  const xS = (xi) => padL + ((logXi(xi) - xMinL) / (xMaxL - xMinL)) * cW;

  // Two lanes: refined (co-refined, single root) on top, coarse (aliased) below.
  const yRefined = padT + cH * 0.3;
  const yCoarse = padT + cH * 0.75;

  const xNyqCoarse = xS(IMP3543_COARSE_ALIAS.xiNyq);

  const xTicks = [1, 10, 40, 100, 200, 400];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {/* coarse-grid Nyquist boundary */}
      <line x1={xNyqCoarse} y1={padT} x2={xNyqCoarse} y2={padT + cH} stroke={ED.series2} strokeWidth={1} strokeDasharray="4,3" />
      <text x={xNyqCoarse + 4} y={padT + 12} fill={ED.series2} fontSize={8.5}>
        coarse xi_Nyq ~ {IMP3543_COARSE_ALIAS.xiNyq.toFixed(1)}
      </text>

      <line x1={padL} y1={yRefined} x2={padL + cW} y2={yRefined} stroke={ED.ruleSoft} strokeWidth={0.7} />
      <line x1={padL} y1={yCoarse} x2={padL + cW} y2={yCoarse} stroke={ED.ruleSoft} strokeWidth={0.7} />

      <text x={padL - 4} y={yRefined - 8} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        co-refined (N={IMP3543_REFINED.N})
      </text>
      <text x={padL - 4} y={yCoarse - 8} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        coarse (N={IMP3543_COARSE_ALIAS.N})
      </text>

      {IMP3543_REFINED.roots.map((xi) => (
        <circle key={'r' + xi} cx={xS(xi)} cy={yRefined} r={5} fill={ED.series3} />
      ))}
      <text x={xS(IMP3543_REFINED.roots[0])} y={yRefined - 14} textAnchor="middle" fill={ED.series3} fontSize={8.5}>
        xi* ~ {IMP3543_REFINED.roots[0].toFixed(3)} (unique)
      </text>

      {IMP3543_COARSE_ALIAS.roots.map((r, i) => (
        <circle
          key={'c' + i}
          cx={xS(r.xi)}
          cy={yCoarse}
          r={5}
          fill={r.label === 'real peak' ? ED.brassDeco : ED.series2}
        />
      ))}
      <text x={xS(IMP3543_COARSE_ALIAS.roots[1].xi)} y={yCoarse + 20} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        aliased replicas ~365, ~389
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((xi) => (
        <g key={'x' + xi}>
          <line x1={xS(xi)} y1={padT + cH} x2={xS(xi)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(xi)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {xi}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        xi (log scale)
      </text>
    </svg>
  );
}

function TailBandChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const edges = IMP3543_TAIL_BAND_EDGES;
  const logE = (e) => Math.log10(e);
  const xMinL = logE(edges[0]);
  const xMaxL = logE(edges[edges.length - 1]);
  const xS = (e) => padL + ((logE(e) - xMinL) / (xMaxL - xMinL)) * cW;

  const yMin = -9;
  const yMax = -3.5;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const refinedPath = edges
    .map((e, i) => (i === 0 ? 'M' : 'L') + xS(e).toFixed(1) + ',' + yS(IMP3543_REFINED_TAIL_BANDMAX[i]).toFixed(2))
    .join(' ');
  const coarsePath = edges
    .map((e, i) => (i === 0 ? 'M' : 'L') + xS(e).toFixed(1) + ',' + yS(IMP3543_COARSE_TAIL_BANDMAX[i]).toFixed(2))
    .join(' ');

  const yTicks = [1e-9, 1e-7, 1e-5, 1e-3];
  const oneThresholdY = yS(IMP3543_ONE_PERCENT_PEAK);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={oneThresholdY} x2={padL + cW} y2={oneThresholdY} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW - 4} y={oneThresholdY - 4} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
        1% of peak
      </text>

      <path d={coarsePath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="5,3" />
      {edges.map((e, i) => (
        <circle key={'cc' + e} cx={xS(e)} cy={yS(IMP3543_COARSE_TAIL_BANDMAX[i])} r={3.5} fill={ED.series2} />
      ))}

      <path d={refinedPath} fill="none" stroke={ED.series3} strokeWidth={2.4} />
      {edges.map((e, i) => (
        <circle key={'rc' + e} cx={xS(e)} cy={yS(IMP3543_REFINED_TAIL_BANDMAX[i])} r={4} fill={ED.series3} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {edges.map((e) => (
        <g key={'x' + e}>
          <line x1={xS(e)} y1={padT + cH} x2={xS(e)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(e)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {e}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        band right edge, xi (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        band-max |P1(xi)|
      </text>
    </svg>
  );
}

export default function Imp3543XiStarRobustnessViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="xi* Range/Grid Robustness: Single Root vs. Aliasing Artifact (imp-3511 / imp-3543)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3511 re-enumerated the P2(xi) = 0 stationary points of the PSD peak slope
        |P1(xi)| over a 3.3x wider domain [0, 400] than imp-3483&apos;s [0, 120]. At the
        CO-REFINED grid (N = 1200, xi_Nyq &sim; 628, comfortably above 400) there is still
        EXACTLY ONE root, at xi* &sim; {IMP3543_REFINED.roots[0].toFixed(4)}. Re-running the
        SAME wide scan at the coarse imp-3483 grid (N = 360, xi_Nyq &sim;{' '}
        {IMP3543_COARSE_ALIAS.xiNyq.toFixed(1)}) manufactures a SPURIOUS aliased pair near
        xi &sim; 365 and xi &sim; 389 -- both past 2&times;xi_Nyq -- showing the co-refinement is
        necessary, not optional.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        P2 = 0 roots on [0, 400]: co-refined (unique) vs. coarse (aliased pair)
      </p>
      <RootMapChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Decade-band max of |P1(xi)| beyond xi*: monotone decay (co-refined) vs. aliasing spike (coarse)
      </p>
      <TailBandChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. The co-refined scan certifies the imp-3483
        global-maximizer count is range- and grid-robust (peak &sim;
        {IMP3543_PEAK_SLOPE.toExponential(3)}, far-tail max ratio &lt; 1%); the coarse-grid
        panel is an aliasing artifact shown deliberately to document why the grid must be
        co-refined, not a competing finding. Neither panel constructs the missing K_a &ge; 0
        sign-positivity residual (imp-3066), which remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3540-power-iteration-budget" style={{ color: 'var(--series-5)' }}>
          Power-Iteration Budget Growth (imp-3540)
        </Link>
      </div>
    </div>
  );
}
