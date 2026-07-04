import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33548_WINDOW_LO,
  IMP33548_WINDOW_HI,
  IMP33548_STRICT_BAND_ULP,
  IMP33548_DEEP_BAND_ULP,
  IMP33548_SPIKE_N,
  IMP33548_NEIGHBOUR_LO_N,
  IMP33548_NEIGHBOUR_HI_N,
  IMP33548_PLATEAU_NODES,
  IMP33548_UNIFORM_LADDER_NODES,
  IMP33548_PLATEAU_SAVING,
  IMP33548_N300_COMPARISON,
  IMP33548_SCAN,
} from '../data/imp-33548-graded-plateau-deep-tail-viz-data.js';

const PLATEAU_COLOR = '#38bdf8';
const BAND_COLOR = '#f472b6';
const STRICT_COLOR = '#a78bfa';
const SPIKE_COLOR = '#f59e0b';
const NEIGHBOUR_COLOR = '#4ade80';

function RungUlpChart() {
  const svgW = 720;
  const padL = 44;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMax = 56;
  const xS = (n) => padL + ((n - IMP33548_WINDOW_LO) / (IMP33548_WINDOW_HI - IMP33548_WINDOW_LO)) * cW;
  const yS = (v) => padT + cH * (1 - Math.min(v, yMax) / yMax);

  const spike = IMP33548_SCAN.find((r) => r.n === IMP33548_SPIKE_N);
  const neighbourLo = IMP33548_SCAN.find((r) => r.n === IMP33548_NEIGHBOUR_LO_N);
  const neighbourHi = IMP33548_SCAN.find((r) => r.n === IMP33548_NEIGHBOUR_HI_N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 10, 20, 30, 40, 50].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* imp-33295 strict floor band */}
      <line
        x1={padL}
        y1={yS(IMP33548_STRICT_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33548_STRICT_BAND_ULP)}
        stroke={STRICT_COLOR}
        strokeWidth={1.2}
        strokeDasharray="3,3"
      />
      <text x={padL + 4} y={yS(IMP33548_STRICT_BAND_ULP) - 5} fill={STRICT_COLOR} fontSize={9}>
        strict bar ({IMP33548_STRICT_BAND_ULP} ULP)
      </text>

      {/* imp-33316 widened deep-tail band -- drawn at the chart top since 64 &gt; yMax=56 */}
      <text x={padL + cW - 4} y={padT + 12} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        deep band ({IMP33548_DEEP_BAND_ULP} ULP, above chart top)
      </text>

      {/* raw per-rung plateau ULP scan */}
      <polyline
        points={IMP33548_SCAN.map((r) => `${xS(r.n)},${yS(r.ulp)}`).join(' ')}
        fill="none"
        stroke={PLATEAU_COLOR}
        strokeWidth={1.4}
        opacity={0.9}
      />
      {IMP33548_SCAN.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.ulp)} r={1.6} fill={PLATEAU_COLOR} opacity={0.7} />
      ))}

      {/* the n=300 lattice spike */}
      {spike && (
        <>
          <circle cx={xS(spike.n)} cy={yS(spike.ulp)} r={4.5} fill={SPIKE_COLOR} />
          <text x={xS(spike.n)} y={yS(spike.ulp) - 8} textAnchor="middle" fill={SPIKE_COLOR} fontSize={9}>
            n=300 (~{spike.ulp.toFixed(1)} ULP)
          </text>
        </>
      )}

      {/* the fine n=295/n=305 neighbours sitting deep inside the band */}
      {neighbourLo && (
        <circle cx={xS(neighbourLo.n)} cy={yS(neighbourLo.ulp)} r={3.5} fill={NEIGHBOUR_COLOR} stroke="#0a0f1a" strokeWidth={1} />
      )}
      {neighbourHi && (
        <circle cx={xS(neighbourHi.n)} cy={yS(neighbourHi.ulp)} r={3.5} fill={NEIGHBOUR_COLOR} stroke="#0a0f1a" strokeWidth={1} />
      )}

      {[285, 290, 295, 300, 305, 310, 315].map((n) => (
        <text key={n} x={xS(n)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        depth rung n (tau* = saddleTau(n))
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        plateau residual (ULP)
      </text>
    </svg>
  );
}

export default function Imp33548GradedPlateauDeepTailNodeBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Graded-Plateau Deep-Tail Node Budget (imp-33316)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33316 carried the imp-33295 CONSERVATIVE fixed graded-GL plateau rule (grade 4, 400
        panels = {IMP33548_PLATEAU_NODES} inner Gauss-Legendre nodes) into the deep saddle tail
        n in {'{'}90..500{'}'} and found it PLATEAU-HOLDS the imp-33275 A_log double-precision floor
        band everywhere, while the {IMP33548_UNIFORM_LADDER_NODES}-node uniform Simpson Richardson
        ladder UNIFORM-FAILS, diverging catastrophically as the saddle peak sharpens. The chart
        below plots the dense integer scan of the plateau residual across the reference window
        n in [{IMP33548_WINDOW_LO}, {IMP33548_WINDOW_HI}] around the one rung, n=
        {IMP33548_SPIKE_N}, where the plateau exceeds the strict {IMP33548_STRICT_BAND_ULP}-ULP bar.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        graded-plateau residual (ULP) over n in [{IMP33548_WINDOW_LO}, {IMP33548_WINDOW_HI}]
      </p>
      <RungUlpChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The n={IMP33548_SPIKE_N} spike (amber marker, ~{IMP33548_N300_COMPARISON.gradedPlateauUlp.toFixed(1)}{' '}
        ULP) is a jittery arithmetic-floor lattice event, not a systematic breakdown: its fine
        neighbours n={IMP33548_NEIGHBOUR_LO_N} and n={IMP33548_NEIGHBOUR_HI_N} (green markers) sit
        deep inside the strict band. At that same n={IMP33548_SPIKE_N} rung, the
        {IMP33548_UNIFORM_LADDER_NODES}-node uniform Richardson ladder reads ~
        {IMP33548_N300_COMPARISON.uniformExtrapUlp.toFixed(0)} ULP -- roughly{' '}
        {IMP33548_N300_COMPARISON.plateauVsUniformCloseness.toFixed(0)}x further from the target than
        the graded plateau, at {IMP33548_PLATEAU_SAVING.toFixed(2)}x more inner-node cost.
      </p>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the blue line is the raw,
        per-integer-rung graded-plateau residual against the imp-33213 independent log-domain
        A_log target. The violet dashed line is the imp-33295 strict 30-ULP floor bar; the widened
        imp-33316 64-ULP deep-tail band sits above the visible chart top. Only n=300 (amber) crosses
        the strict bar in this window -- the surrounding rungs, including the fine neighbours
        n=295 and n=305 (green), stay comfortably inside it. A later dense scan (imp-33537) found
        this reference window already carries a short run of above-bar rungs, not a lone spike, and
        that the exceedance frequency intensifies at deeper windows (n~495, n~595) -- see that
        module for the fuller depth-growing envelope picture this chart does not extend to.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design
        measurement only, of an already-verified scan (imp-33316/imp-33537). It changes no bound and
        patches no literal. Mass-feasibility is necessary-but-not-sufficient; the operator-level
        positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
