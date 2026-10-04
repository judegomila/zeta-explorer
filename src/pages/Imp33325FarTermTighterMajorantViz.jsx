import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33325_KREAL_BAND,
  IMP33325_RMAJ_RANGE,
  IMP33325_MAXBJ_RANGE,
  IMP33325_PLATEAU_TABLE,
} from '../data/imp-33325-far-term-tighter-majorant-viz-data.js';
import { ED } from '../styles/tokens.js';

const RMAJ_COLOR = ED.series7;
const RTIGHT_COLOR = ED.series3;
const BAND_COLOR = ED.series1;
const MAXBJ_COLOR = ED.series4;

function RatioChart() {
  const svgW = 640;
  const padL = 48;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMax = 12;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = IMP33325_PLATEAU_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  const yTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* K_real band [0.80, 1.60] R_tight collapses onto */}
      <rect
        x={padL}
        y={yS(IMP33325_KREAL_BAND.max)}
        width={cW}
        height={yS(IMP33325_KREAL_BAND.min) - yS(IMP33325_KREAL_BAND.max)}
        fill={BAND_COLOR}
        opacity={0.12}
      />
      <text x={padL + 4} y={yS(IMP33325_KREAL_BAND.max) - 4} fill={BAND_COLOR} fontSize={9}>
        K_real floor band [0.80, 1.60]
      </text>

      <polyline
        points={IMP33325_PLATEAU_TABLE.map((r, i) => `${xS(i)},${yS(r.rMaj)}`).join(' ')}
        fill="none"
        stroke={RMAJ_COLOR}
        strokeWidth={1.5}
      />
      {IMP33325_PLATEAU_TABLE.map((r, i) => (
        <circle key={`rmaj-${r.plateauIndex}`} cx={xS(i)} cy={yS(r.rMaj)} r={3.5} fill={RMAJ_COLOR} />
      ))}
      <text x={padL + 4} y={yS(9.5)} fill={RMAJ_COLOR} fontSize={9}>
        R_maj (certified majorant ratio, [1.81, 11.08])
      </text>

      <polyline
        points={IMP33325_PLATEAU_TABLE.map((r, i) => `${xS(i)},${yS(r.rTight)}`).join(' ')}
        fill="none"
        stroke={RTIGHT_COLOR}
        strokeWidth={1.5}
      />
      {IMP33325_PLATEAU_TABLE.map((r, i) => (
        <circle key={`rtight-${r.plateauIndex}`} cx={xS(i)} cy={yS(r.rTight)} r={3.5} fill={RTIGHT_COLOR} />
      ))}
      <text x={padL + 4} y={yS(0.4)} fill={RTIGHT_COLOR} fontSize={9}>
        R_tight = K_real (tightened ratio, [0.80, 1.60])
      </text>

      {IMP33325_PLATEAU_TABLE.map((r, i) => (
        <text key={r.plateauIndex} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        imp-3725 plateau index (0..9, N in [1e4,1e6])
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        ratio
      </text>
    </svg>
  );
}

function MaxBjChart() {
  const svgW = 640;
  const padL = 48;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const yMax = 7;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = IMP33325_PLATEAU_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <polyline
        points={IMP33325_PLATEAU_TABLE.map((r, i) => `${xS(i)},${yS(r.maxBj)}`).join(' ')}
        fill="none"
        stroke={MAXBJ_COLOR}
        strokeWidth={1.5}
      />
      {IMP33325_PLATEAU_TABLE.map((r, i) => (
        <circle key={`maxbj-${r.plateauIndex}`} cx={xS(i)} cy={yS(r.maxBj)} r={3.5} fill={MAXBJ_COLOR} />
      ))}
      <text x={padL + 4} y={yS(6.9)} fill={MAXBJ_COLOR} fontSize={9}>
        max_j B_j (relocated N-uniformity obstruction, [2.10, 6.45])
      </text>

      {IMP33325_PLATEAU_TABLE.map((r, i) => (
        <text key={r.plateauIndex} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        imp-3725 plateau index (0..9, N in [1e4,1e6])
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        max B_j
      </text>
    </svg>
  );
}

export default function Imp33325FarTermTighterMajorantViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Far-Term Tighter-Majorant Collapse (imp-33290)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33290 found that swapping the certified per-term majorant 8/s_min(j)^2
        for the realised-gap-aware bound 8*B_j (B_j = P_j/D_j, provably still an
        upper bound by AM-HM) collapses the certified over-charge ratio R_maj
        (pink, spanning [1.81, 11.08] across the 10 imp-3725 plateaus of
        [1e4,1e6]) onto the flat imp-33269 K_real floor band (blue shading,
        [0.80, 1.60]) as the tightened ratio R_tight (green). The over-charge is
        arithmetically removable -- but N-uniform certification reduces to
        bounding sup_j B_j, whose measured maximum (amber, second chart) grows
        2.10 -&gt; 6.45 across plateaus, relocating rather than closing the
        imp-33250 residual dg2.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_maj vs R_tight collapse onto the K_real floor band, by plateau
      </p>
      <RatioChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        max_j B_j growth -- the relocated N-uniformity obstruction, by plateau
      </p>
      <MaxBjChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        Collapse magnitude: at the endpoint plateau (N=1e6), R_maj = 6.82 falls to
        R_tight ={' '}
        <strong style={{ color: 'var(--series-3)' }}>1.044</strong> -- an{' '}
        <strong style={{ color: 'var(--series-3)' }}>84.70%</strong> reduction of the
        certified over-charge. Across all 10 plateaus R_maj spans{' '}
        <strong style={{ color: RMAJ_COLOR }}>
          [{IMP33325_RMAJ_RANGE.min.toFixed(2)}, {IMP33325_RMAJ_RANGE.max.toFixed(2)}]
        </strong>{' '}
        while R_tight stays within{' '}
        <strong style={{ color: 'var(--series-3)' }}>
          [{IMP33325_KREAL_BAND.min.toFixed(2)}, {IMP33325_KREAL_BAND.max.toFixed(2)}]
        </strong>
        , and max_j B_j spans{' '}
        <strong style={{ color: MAXBJ_COLOR }}>
          [{IMP33325_MAXBJ_RANGE.min.toFixed(2)}, {IMP33325_MAXBJ_RANGE.max.toFixed(2)}]
        </strong>
        .
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> R_tight
        is identically the imp-33269 baked K_real (rReal) -- the swap 8/s_min(j)^2
        -&gt; 8*B_j is exactly the realised elasticity kernel, so the tightened
        ratio lands on the K_real floor by construction, not by fit. The max_j B_j
        curve is non-monotone (peaking at plateau 5, endN~95248, not at the
        largest-N endpoint), which is why the imp-33250 sup_{'{'}N,j{'}'} B_j
        bound stays open in both directions.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        of an already-verified feasibility assessment (imp-33290). The over-charge
        is removable by a provable tighter bound, but N-uniform certification is
        NOT achieved -- it relocates to the open imp-33250 residual dg2. imp-3066
        K_a &ge; 0 is UNTOUCHED. NO QED.
      </div>
    </div>
  );
}
