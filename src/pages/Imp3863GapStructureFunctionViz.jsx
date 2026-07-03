import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3863_S2_RAW_POINTS,
  IMP3863_S2_UNFOLDED_POINTS,
  IMP3863_PLATEAU_RAW,
  IMP3863_PLATEAU_UNFOLDED,
  IMP3863_C_RAW_1,
  IMP3863_C_UNFOLDED_1,
} from '../data/imp-3863-gap-structure-function-s2-viz-data.js';

// log10(r) axis, r = 1 .. 131072; both profiles plotted normalized to their own
// large-r plateau (S_2(r) / plateau) so the raw and unfolded shapes overlay cleanly.
const R_MIN = 1;
const R_MAX = 131072;
const LOG_MIN = Math.log10(R_MIN);
const LOG_MAX = Math.log10(R_MAX);

function GapStructureFunctionChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = 0.95;
  const yMax = 1.4;

  const xS = (r) => padL + ((Math.log10(r) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * cW;
  const yS = (ratio) => padT + cH * (1 - (ratio - yMin) / (yMax - yMin));

  const rawPath = IMP3863_S2_RAW_POINTS.map(
    (p, i) => (i === 0 ? 'M' : 'L') + xS(p.r).toFixed(1) + ',' + yS(p.v / IMP3863_PLATEAU_RAW).toFixed(2),
  ).join(' ');
  const unfPath = IMP3863_S2_UNFOLDED_POINTS.map(
    (p, i) => (i === 0 ? 'M' : 'L') + xS(p.r).toFixed(1) + ',' + yS(p.v / IMP3863_PLATEAU_UNFOLDED).toFixed(2),
  ).join(' ');

  const yTicks = [1.0, 1.1, 1.2, 1.3, 1.4];
  const xTicks = [1, 10, 100, 1000, 10000, 100000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* decorrelation plateau: S_2(r)/plateau -> 1 */}
      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke="#f472b6" strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + 4} y={yS(1) - 5} fill="#f9a8d4" fontSize={8.5}>
        large-r plateau (S<tspan fontSize={6.5} dy={2}>2</tspan><tspan dy={-2}>(r)/plateau = 1)</tspan>
      </text>

      <path d={unfPath} fill="none" stroke="#38bdf8" strokeWidth={2.4} />
      <path d={rawPath} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="1,0" opacity={0.9} />

      {/* r = 1 level-repulsion markers */}
      <circle cx={xS(1)} cy={yS(IMP3863_S2_RAW_POINTS[0].v / IMP3863_PLATEAU_RAW)} r={4} fill="#facc15" />
      <circle cx={xS(1)} cy={yS(IMP3863_S2_UNFOLDED_POINTS[0].v / IMP3863_PLATEAU_UNFOLDED)} r={4} fill="#38bdf8" />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTicks.map((r) => (
        <g key={'x' + r}>
          <line x1={xS(r)} y1={padT + cH} x2={xS(r)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        separation r (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        S_2(r) / plateau
      </text>

      <g>
        <circle cx={padL + cW - 150} cy={padT + 14} r={4} fill="#38bdf8" />
        <text x={padL + cW - 142} y={padT + 17} fill="#94a3b8" fontSize={9}>
          unfolded (C_unf(1) = {IMP3863_C_UNFOLDED_1.toFixed(3)})
        </text>
        <circle cx={padL + cW - 150} cy={padT + 28} r={4} fill="#facc15" />
        <text x={padL + cW - 142} y={padT + 31} fill="#94a3b8" fontSize={9}>
          raw (C_raw(1) = {IMP3863_C_RAW_1.toFixed(3)})
        </text>
      </g>
    </svg>
  );
}

export default function Imp3863GapStructureFunctionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Equal-Time Gap Structure Function S_2(r): Level-Repulsion then Decorrelation (imp-3734 / imp-3863)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3734 measured the imp-3714 candidate-K3 equal-time two-point structure function
        S_2(r) = mean_k (g_{'{'}k+r{'}'} - g_k)^2 on the first 1,000,000 Riemann-zero gaps, for both
        the raw gap field and the drift-removed unfolded field. The chart below normalizes each
        profile by its own large-r plateau so the two curves overlay: both sit well above the
        plateau at r = 1 (a negative lag-1 autocorrelation -- consecutive gaps repel, the GUE-like
        level-repulsion signature), then relax monotonically down to the decorrelation plateau,
        where S_2(r) &asymp; 2*var as r grows.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        S_2(r) / plateau vs r (log scale), r = 1..131072: raw (gold) and unfolded (blue) profiles,
        both peaking at r=1 and relaxing to the plateau at 1.0
      </p>
      <GapStructureFunctionChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> at r = 1 both profiles sit
        roughly 35% above their large-r plateau (raw 0.16218 vs plateau &asymp; 0.11991, unfolded
        0.44580 vs plateau &asymp; 0.33007). Via S_2(r) = 2 var [1 - C(r)] this is a NEGATIVE lag-1
        autocorrelation -- C_raw(1) = -0.258, C_unf(1) = -0.350 -- consecutive gaps repel rather
        than cluster. The relaxation to the plateau is monotone up to sampling noise (small bumps
        near r=16-24 in both curves, likely finite-sample fluctuation). The unfolded plateau matches
        2*var(unfolded) to within 0.13%, the textbook C(r) &rarr; 0 decorrelation signature; the raw
        plateau sits below 2*var(raw) because the raw variance is inflated by residual global
        density drift that finite-r differencing does not sample.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization only
        -- no proof, no reduction below RH. S_2(r) is a purely equal-time statistic: it clears
        REQ-i (a genuine two-point profile) but attaches no backward-flow depth s(y) and so fails
        REQ-ii, confirming the imp-3714 K3 near-miss classification empirically. imp-3066 off-diagonal
        endpoint-Hankel K_a &ge; 0 positivity remains untouched. Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA. G6a_shock_lipschitz stays OPEN.
      </div>
    </div>
  );
}
