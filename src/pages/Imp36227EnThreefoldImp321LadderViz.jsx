import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP36227_EN_THREEFOLD_LADDER,
  IMP36227_E_TRUNC_FLOOR,
  IMP36227_CROSSOVER,
  IMP36227_EN_THREEFOLD_VIZ_DATA,
} from '../data/imp-36227-en-threefold-imp321-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function EThreefoldChart() {
  const svgW = 680;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const rows = IMP36227_EN_THREEFOLD_LADDER;
  const xMin = Math.log10(rows[0].N);
  const xMax = IMP36227_CROSSOVER.log10_N_cross + 0.35; // leave room for the crossover marker
  const yMin = -6; // log10(E), down to ~1e-6
  const yMax = -1; // up to ~1e-1

  const xS = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const pathFor = (key, color) => {
    const d = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(Math.log10(r.N)).toFixed(1) + ',' + yS(r[key]).toFixed(2)).join(' ');
    return <path key={key} d={d} fill="none" stroke={color} strokeWidth={2.2} />;
  };

  const yTicks = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
  const xTicks = [3, 4, 5, 6, 7, 8, 9, 9.5159];

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

      {/* E_trunc fixed floor, imp-2631/imp-35164 */}
      <line
        x1={padL}
        y1={yS(IMP36227_E_TRUNC_FLOOR)}
        x2={padL + cW}
        y2={yS(IMP36227_E_TRUNC_FLOOR)}
        stroke={ED.series7}
        strokeWidth={1.4}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yS(IMP36227_E_TRUNC_FLOOR) - 5} fill={ED.series7} fontSize={8.5}>
        E_trunc floor = {IMP36227_E_TRUNC_FLOOR.toExponential(2)} (imp-2631)
      </text>

      {/* E_trunc = E_coll crossover, imp-35968, beyond the ladder top */}
      <line
        x1={xS(IMP36227_CROSSOVER.log10_N_cross)}
        y1={padT}
        x2={xS(IMP36227_CROSSOVER.log10_N_cross)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1.2}
        strokeDasharray="2,3"
      />
      <text
        x={xS(IMP36227_CROSSOVER.log10_N_cross) - 4}
        y={padT + 12}
        textAnchor="end"
        fill={ED.brass}
        fontSize={8.5}
      >
        N_cross ~ 3.28e9 (imp-35968)
      </text>

      {pathFor('E_coll', ED.series1)}
      {pathFor('E_flow', ED.series3)}

      {rows.map((r) => (
        <g key={r.N}>
          <circle cx={xS(Math.log10(r.N))} cy={yS(r.E_coll)} r={3.2} fill={ED.series1} />
          <circle cx={xS(Math.log10(r.N))} cy={yS(r.E_flow)} r={3.2} fill={ED.series3} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xS(t)} y1={padT + cH} x2={xS(t)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t === 9.5159 ? '9.52*' : t}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N (imp-321 ladder, * = crossover)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        E(N) terms (log)
      </text>
    </svg>
  );
}

function ShareTruncChart() {
  const svgW = 680;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const rows = IMP36227_EN_THREEFOLD_LADDER;
  const xMin = Math.log10(rows[0].N);
  const xMax = Math.log10(rows[rows.length - 1].N);
  const yMin = 0;
  const yMax = 0.18;

  const xS = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = rows
    .map((r, i) => (i === 0 ? 'M' : 'L') + xS(Math.log10(r.N)).toFixed(1) + ',' + yS(r.shareTrunc).toFixed(2))
    .join(' ');

  const yTicks = [0, 0.05, 0.1, 0.15];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {(v * 100).toFixed(0)}%
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={ED.series7} strokeWidth={2.2} />
      {rows.map((r) => (
        <circle key={r.N} cx={xS(Math.log10(r.N))} cy={yS(r.shareTrunc)} r={3.2} fill={ED.series7} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {rows.map((r) => (
        <g key={'x' + r.N}>
          <line x1={xS(Math.log10(r.N))} y1={padT + cH} x2={xS(Math.log10(r.N))} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(Math.log10(r.N))} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            N={r.N >= 1e6 ? r.N.toExponential(0) : r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        imp-321 ladder N
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        shareTrunc = E_trunc / E(N)
      </text>
    </svg>
  );
}

export default function Imp36227EnThreefoldImp321LadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="E(N) Threefold Across the imp-321 Ladder (imp-36227)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The pinned-constants surrogate E(N) = E_trunc + E_flow + E_coll (imp-35889 / imp-35968 sub-terms)
        evaluated at the seven imp-321 ladder rungs (N = 2458 through N = 1e8). E_trunc = 3.06e-5
        (imp-2631, imp-35164) is a fixed floor that never moves; E_coll and E_flow both shrink with N.
        The imp-35968 E_trunc = E_coll crossover sits at N_cross &asymp; 3.28e9, about 1.52 decades
        above the ladder's top rung.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        E_coll and E_flow decaying across the ladder, against the fixed E_trunc floor and the crossover
      </p>
      <EThreefoldChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        shareTrunc = E_trunc / E(N) rising across the ladder as the floor's relative weight grows
      </p>
      <ShareTruncChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> E_coll (blue) dominates
        E(N) at every imp-321 ladder rung -- its share never drops below ~0.84 -- but it decays
        with N faster than E_flow decays, and both decay against a floor (E_trunc, dashed pink)
        that is completely flat. The bottom chart makes that floor's rising relative weight
        explicit: shareTrunc grows monotonically from 0.12% at N = 2458 to 15.9% at N = 1e8. The
        E_trunc = E_coll crossover (imp-35968, yellow dashed line at log10 N &asymp; 9.52) sits
        beyond the ladder's own top rung, so no row on the current imp-321 ladder actually reaches
        the point where the floor takes over -- but the trend visibly points there.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP36227_EN_THREEFOLD_VIZ_DATA.honest}
      </div>
    </div>
  );
}
