import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3880_RUNGS,
  IMP3880_CROSSING_N_STAR,
  IMP3880_UNDERSHOOT_MIN_N,
  IMP3880_UNDERSHOOT_MIN_R,
  IMP3880_ARTIFACT_RUNGS,
  IMP3880_ARTIFACT_CROSSING_N_STAR,
  IMP3880_ARTIFACT_UNDERSHOOT_MIN_N,
  IMP3880_ARTIFACT_UNDERSHOOT_MIN_R,
} from '../data/imp-3880-saddle-ratio-inner-converged-viz-data.js';

const APPROACH_MIN = 3;
const APPROACH_MAX = 208;
const APPROACH_RUNGS = IMP3880_RUNGS.filter((r) => r.n >= APPROACH_MIN && r.n <= APPROACH_MAX && r.r > 0);

function ApproachChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const yMin = -5;
  const yMax = 0.5;

  const xS = (n) => padL + ((Math.log(n) - Math.log(APPROACH_MIN)) / (Math.log(APPROACH_MAX) - Math.log(APPROACH_MIN))) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = APPROACH_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.r).toFixed(2),
  ).join(' ');

  const yTicks = [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5];
  const xTicks = [3, 8, 20, 50, 120, 208];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2.2} />
      {APPROACH_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.r)} r={2.2} fill="#38bdf8" />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n (log scale)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        r_n (log scale)
      </text>
    </svg>
  );
}

const ZOOM_MIN = 150;
const ZOOM_MAX = 624;

function CrossingWellChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = -0.00068;
  const yMax = 0.00115;

  const xS = (n) => padL + ((n - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const convergedRungs = IMP3880_RUNGS.filter((r) => r.n >= ZOOM_MIN);
  const convergedPath = convergedRungs.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.r).toFixed(2),
  ).join(' ');
  const artifactPath = IMP3880_ARTIFACT_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.r).toFixed(2),
  ).join(' ');

  const yTicks = [-0.0006, -0.0004, -0.0002, 0, 0.0004, 0.0008];
  const xTicks = [150, 225, 300, 400, 500, 624];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      {/* zero line: R_n = 1 */}
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke="#f472b6" strokeWidth={1.2} strokeDasharray="4,3" />

      {/* imp-3731 coarse-inner artifact crossing n* ~ 225.54 */}
      <line
        x1={xS(IMP3880_ARTIFACT_CROSSING_N_STAR)}
        y1={padT}
        x2={xS(IMP3880_ARTIFACT_CROSSING_N_STAR)}
        y2={padT + cH}
        stroke="#f87171"
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      {/* converged crossing n* = 215.231 */}
      <line
        x1={xS(IMP3880_CROSSING_N_STAR)}
        y1={padT}
        x2={xS(IMP3880_CROSSING_N_STAR)}
        y2={padT + cH}
        stroke="#facc15"
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xS(IMP3880_CROSSING_N_STAR) + 4} y={padT + 12} fill="#fde68a" fontSize={8.5}>
        converged n*={IMP3880_CROSSING_N_STAR.toFixed(1)}
      </text>
      <text x={xS(IMP3880_ARTIFACT_CROSSING_N_STAR) + 4} y={padT + 24} fill="#fca5a5" fontSize={8.5}>
        imp-3731 (artifact) n*={IMP3880_ARTIFACT_CROSSING_N_STAR.toFixed(1)}
      </text>

      {/* imp-3731 coarse-inner artifact curve, for contrast */}
      <path d={artifactPath} fill="none" stroke="#f87171" strokeWidth={1.6} strokeDasharray="5,3" />
      {/* imp-3849 inner-converged curve */}
      <path d={convergedPath} fill="none" stroke="#38bdf8" strokeWidth={2.4} />
      {convergedRungs.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.r)} r={2.2} fill="#38bdf8" />
      ))}

      {/* converged undershoot minimum marker at n=500 */}
      <circle cx={xS(IMP3880_UNDERSHOOT_MIN_N)} cy={yS(IMP3880_UNDERSHOOT_MIN_R)} r={4.5} fill="none" stroke="#38bdf8" strokeWidth={1.6} />
      {/* imp-3731 artifact undershoot minimum marker at n=276 */}
      <circle
        cx={xS(IMP3880_ARTIFACT_UNDERSHOOT_MIN_N)}
        cy={yS(IMP3880_ARTIFACT_UNDERSHOOT_MIN_R)}
        r={4.5}
        fill="none"
        stroke="#f87171"
        strokeWidth={1.6}
      />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        r_n = R_n - 1
      </text>
    </svg>
  );
}

export default function Imp3880SaddleRatioInnerConvergedViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Inner-Converged Exact-Saddle Ratio R_n, n=3..624 (imp-3849 / imp-3880)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3849 re-measured the exact-saddle ratio r_n = R_n - 1 = |D_n|/|D_n<sup>saddle</sup>| - 1
        after CONVERGING the inner A(tau) autocorrelation quadrature that imp-3731 left fixed at a
        coarse resolution. The top panel shows the approach from a large positive ratio at small n
        (r_3 = 2.644, r_40 = 0.0244) down toward unity on a log-log scale. The bottom panel zooms
        into n=150..624 on a linear scale: the converged unity crossing lands at n* = 215.2 (yellow
        dashed line), roughly 10 rungs below the imp-3731 coarse-inner artifact crossing at
        n* = 225.54 (red dashed line, curve overlaid for contrast), and the converged well is about
        5x deeper (r_min = -5.845e-4 near n~500, blue ring) than the imp-3731 artifact well
        (r_min = -1.129e-4 at n=276, red ring) before both curves recover slowly toward zero.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        r_n vs n, n=3..208 (log-log): the approach toward unity from above
      </p>
      <ApproachChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        r_n vs n, n=150..624 (linear, zoomed): converged crossing/well (blue) vs the imp-3731
        coarse-inner artifact (red, dashed) overlaid for contrast
      </p>
      <CrossingWellChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> converging the inner
        A(tau) quadrature (imp-3735 lesson) does not just shift the crossing slightly -- it moves
        it down ~10 rungs and roughly quintuples the sub-unity well depth, revealing a broad basin
        (r_490 &asymp; r_500 &asymp; r_510) rather than a sharp minimum. Past the well, R_n recovers
        toward 1 from below out to n=624 (r_500 = -5.845e-4 &rarr; r_620 = -5.686e-4), consistent
        with the imp-3735 eps_n Laplace tail vanishing at large n.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This pins the CONVERGED shape of a
        moment-ratio convergence diagnostic; mass-feasibility is necessary-but-not-sufficient and
        the operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched. The
        imp-3731 assertions are left intact -- the red curve above is a correctly-reproduced,
        coarse-inner-resolution artifact, not an error in imp-3731's own code. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
