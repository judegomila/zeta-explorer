import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3884_ROWS,
  IMP3884_PREDICTION_RATIO_RANGE,
  IMP3884_MAX_MEASURED_REL_K_CHANGE,
  IMP3884_CARRYFORWARD_MARGIN,
} from '../data/imp-3884-thetabar-elasticity-viz-data.js';

const PREDICTED_COLOR = '#38bdf8';
const MEASURED_COLOR = '#facc15';

function ElasticityBandChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nMin = 1e4;
  const nMax = 1e6;
  const logNMin = Math.log10(nMin);
  const logNMax = Math.log10(nMax);
  const yMin = 5e-7;
  const yMax = 2e-5;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);

  const xS = (n) => padL + ((Math.log10(n) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const yTicks = [1e-6, 3e-6, 1e-5, 2e-5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3884_ROWS.map((r) => {
        const xMid = xS(Math.sqrt(r.startN * r.endN));
        const yPred = yS(r.predictedRelKChange);
        const yMeas = yS(r.measuredRelKChange);
        return (
          <g key={r.plateauIndex}>
            <line x1={xMid} y1={yPred} x2={xMid} y2={yMeas} stroke="#475569" strokeWidth={1} />
            <circle cx={xMid} cy={yPred} r={3.4} fill={PREDICTED_COLOR} />
            <circle cx={xMid} cy={yMeas} r={3.4} fill="none" stroke={MEASURED_COLOR} strokeWidth={1.8} />
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[1e4, 1e5, 1e6].map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            N={n.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale, plateau midpoint)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        relative K_paper shift (log scale)
      </text>

      <g fontSize={9}>
        <circle cx={padL + 8} cy={padT + 12} r={3.4} fill={PREDICTED_COLOR} />
        <text x={padL + 16} y={padT + 15} fill="#7dd3fc">
          predicted: O((H/Dmin)^2) elasticity &times; feasible-window width
        </text>
        <circle cx={padL + 8} cy={padT + 26} r={3.4} fill="none" stroke={MEASURED_COLOR} strokeWidth={1.8} />
        <text x={padL + 16} y={padT + 29} fill="#fde68a">
          measured: imp-3728 improveFactor - 1
        </text>
      </g>
    </svg>
  );
}

function PredictionRatioChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const barGap = 6;
  const barW = (cW - barGap * (IMP3884_ROWS.length - 1)) / IMP3884_ROWS.length;
  const yMin = 0;
  const yMax = 1.8;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const yTicks = [0, 0.5, 1, 1.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke="#f472b6" strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(1) - 5} textAnchor="end" fill="#f9a8d4" fontSize={8.5}>
        ratio = 1 (exact match)
      </text>

      {IMP3884_ROWS.map((r, i) => {
        const x = padL + i * (barW + barGap);
        const y = yS(r.predictionRatio);
        const barTop = Math.min(y, yS(1));
        const barH = Math.abs(y - yS(1));
        return (
          <g key={r.plateauIndex}>
            <rect
              x={x}
              y={barTop}
              width={barW}
              height={barH}
              fill={r.predictionRatio >= 1 ? '#34d399' : '#f87171'}
              opacity={0.75}
            />
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
              {r.plateauIndex}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        plateau index (0..9, tiling N in [1e4, 1e6])
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        measured / predicted
      </text>
    </svg>
  );
}

export default function Imp3884ThetabarElasticityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="thetaBar-Elasticity of the Certified K_paper: Predicted vs Measured (imp-3854)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3854 derives a closed-form bound on how much the imp-3725 certified K_paper enclosure can
        move as the free frozen-horizon knob thetaBar ranges over its feasible window [0.99, thetaBar*]:
        the elasticity |d ln K_paper/d thetaBar| &asymp; (H/smin)<sup>2</sup>/thetaBar<sup>2</sup>, a
        product of two independently small O((H/Dmin)<sup>2</sup>) factors (the near-degeneracy ratio and
        the retardation deficit 1-theta_N). The chart below confronts that analytic prediction against
        the imp-3728 measured relative K_paper change on each of the 10 H_raw-plateaus: the two track each
        other within a factor in [{IMP3884_PREDICTION_RATIO_RANGE[0].toFixed(2)},{' '}
        {IMP3884_PREDICTION_RATIO_RANGE[1].toFixed(2)}], and the largest shift anywhere in the feasible
        range is {IMP3884_MAX_MEASURED_REL_K_CHANGE.toExponential(2)} -- so the {IMP3884_CARRYFORWARD_MARGIN.toExponential(2)}x
        carryforward margin is thetaBar-robust, not a lucky choice of thetaBar = 0.99.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Predicted O((H/Dmin)^2) elasticity band (blue) vs measured relative K_paper shift (gold ring), per plateau
      </p>
      <ElasticityBandChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        predictionRatio = measured / predicted, per plateau -- double-inertness confirmed within [0.5, 2]
      </p>
      <PredictionRatioChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart's connecting line
        on each plateau is short -- both markers sit within roughly a factor of 1.5 of each other on a
        log axis spanning more than an order of magnitude, and every predicted/measured pair is below
        2e-5. The bottom chart shows the same comparison as a ratio: bars above the ratio=1 line (green)
        indicate the analytic bound is a slight underestimate (the smin &lt; Dmin slack imp-3854 flags),
        bars below (red) indicate a slight overestimate (endpoint-concavity slack) -- neither exceeds the
        [0.5, 2] guard the imp-3854 build-time assertions enforce.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> visualization of an existing
        derivation on the imp-3725 true-flow lemma; the (H/Dmin)<sup>2</sup> magnitude is an empirical
        smin &asymp; Dmin refinement confirmed to a factor of ~1.6, not a QED-grade equality. Tunes the
        F_mb factor only; does not close cond-CH or any conditional leg; Platt-Trudgian &Lambda; &le; 0.2
        remains SOTA; imp-3066 K_a &ge; 0 positivity untouched. NO QED.
      </div>
    </div>
  );
}
