import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33845_CREN_GAP_ONSET_RATE } from '../data/imp-33845-cren-gap-onset-rate.js';

const { ladder, predictedOnsetRate, predictedAmplitude, tailGapExponent, tailAmplitude } =
  IMP33845_CREN_GAP_ONSET_RATE;
const RUNGS = ladder.filter((r) => r.gapExp !== null);

function ExponentChart() {
  const svgW = 720;
  const padL = 54;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 280;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logEps = RUNGS.map((r) => Math.log10(r.y_N_sharp));
  const xMin = Math.min(...logEps);
  const xMax = Math.max(...logEps);
  const xS = (eps) => padL + ((Math.log10(eps) - xMin) / (xMax - xMin)) * cW;

  const yMin = 1.47;
  const yMax = 1.505;
  const yS = (p) => padT + cH - ((p - yMin) / (yMax - yMin)) * cH;

  const yTicks = [1.47, 1.48, 1.49, 1.5];
  const points = RUNGS.map((r) => `${xS(r.y_N_sharp)},${yS(r.gapExp)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(predictedOnsetRate)}
        x2={padL + cW}
        y2={yS(predictedOnsetRate)}
        stroke="#f59e0b"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(predictedOnsetRate) - 6} fill="#f59e0b" fontSize={9}>
        fixed onset rate p = 3/2
      </text>

      {RUNGS.map((r) => (
        <g key={'xt' + r.N}>
          <line x1={xS(r.y_N_sharp)} y1={padT + cH - 4} x2={xS(r.y_N_sharp)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
        </g>
      ))}
      <text x={padL + cW - 4} y={padT + cH + 18} textAnchor="end" fill="#64748b" fontSize={9}>
        eps small (N large)
      </text>
      <text x={padL + 4} y={padT + cH + 18} textAnchor="start" fill="#64748b" fontSize={9}>
        eps large (N small)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        eps = y_N_sharp (log scale, decreasing left to right as N grows)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        p(eps) = d log gap / d log eps
      </text>

      <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth={1.75} />
      {RUNGS.map((r) => (
        <circle
          key={'pt' + r.N}
          cx={xS(r.y_N_sharp)}
          cy={yS(r.gapExp)}
          r={2.75}
          fill="#7dd3fc"
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

function GapVsReferenceChart() {
  const svgW = 720;
  const padL = 54;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 280;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logEps = ladder.map((r) => Math.log10(r.y_N_sharp));
  const xMin = Math.min(...logEps);
  const xMax = Math.max(...logEps);
  const xS = (eps) => padL + ((Math.log10(eps) - xMin) / (xMax - xMin)) * cW;

  const logGaps = [
    ...ladder.map((r) => Math.log10(r.gap)),
    ...ladder.map((r) => Math.log10(predictedAmplitude * Math.pow(r.y_N_sharp, 1.5))),
  ];
  const yMin = Math.floor(Math.min(...logGaps));
  const yMax = Math.ceil(Math.max(...logGaps));
  const yS = (g) => padT + cH - ((Math.log10(g) - yMin) / (yMax - yMin)) * cH;

  const yTicks = [];
  for (let e = yMin; e <= yMax; e++) yTicks.push(Math.pow(10, e));

  const measuredPath = ladder.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.y_N_sharp).toFixed(1) + ',' + yS(r.gap).toFixed(2)).join(' ');
  const refPath = ladder
    .map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.y_N_sharp).toFixed(1) + ',' + yS(predictedAmplitude * Math.pow(r.y_N_sharp, 1.5)).toFixed(2))
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={refPath} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2.5" />
      <path d={measuredPath} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {ladder.map((r) => (
        <circle key={'pt' + r.N} cx={xS(r.y_N_sharp)} cy={yS(r.gap)} r={2.6} fill="#7dd3fc" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        eps = y_N_sharp (log scale)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        gap = C_ren - C_PS (log scale)
      </text>
    </svg>
  );
}

export default function Imp33864CrenGapOnsetLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C_ren - C_PS Gap-Onset Rate Ladder (imp-33845 / imp-33864)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33845 measured the local exponent p(eps) = d log(C_ren - C_PS) / d log eps of the gap
        between the renormalized fold-reading amplitude C_ren and the Privalov-Sokhotski constant
        C_PS = pi/sqrt(2), on a 3-rungs-per-decade eps = y_N_sharp ladder over N in [1e3, 1e7]. This
        page is the first consumer of that module: the exponent tightens monotone from{' '}
        {RUNGS[0].gapExp.toFixed(5)} at the head to {tailGapExponent.toFixed(5)} at the tail, settling
        to the fixed onset rate 3/2 rather than drifting.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p(eps) vs eps: the local gap exponent settling to the fixed onset rate 3/2
      </p>
      <ExponentChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        gap = C_ren - C_PS vs eps: measured ladder against the (4/3) eps^(3/2) reference curve
      </p>
      <GapVsReferenceChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#38bdf8' }}>&#9644;</span> measured gap C_ren - C_PS</span>
        <span><span style={{ color: '#f59e0b' }}>&#9644;</span> reference curve A eps^(3/2), A = 4/3 &asymp; {predictedAmplitude.toFixed(5)}</span>
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement only. The fitted
        onset exponent settles to {tailGapExponent.toFixed(5)} (fixed rate 3/2) and the fitted
        amplitude A = gap/eps^(3/2) settles to {tailAmplitude.toFixed(6)} (predicted 4/3), confirming
        the imp-33794 onset-not-drift reading on a finer ladder. This does NOT discharge H4 -- the
        uniform bound needs the analytic tracking of C_ren through the fold-modulus back-conversion,
        not a fitted onset rate at finite N -- and says nothing about the coupled H3 curvature rung.
        G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066 K_a &ge; 0 UNTOUCHED. NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
