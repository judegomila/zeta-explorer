import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3564_MEASURED_RUNGS,
  IMP3564_EXTRAPOLATION,
  IMP3564_GAP_EXPONENT_Q,
  IMP3564_PREFACTOR_C,
  IMP3564_MAX_FIT_RATIO_DEV,
  closedFormBudget,
  closedFormGapDecay,
} from '../data/imp-3564-power-iteration-closed-form-viz-data.js';
import { STATUS, ED } from '../styles/tokens.js';

const COLORS = { measured: STATUS.measured.fg, fit: ED.series4, extrap: ED.series5 };

function BudgetClosedFormChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const N_MIN = 160;
  const N_MAX = 1200;
  const logN = (N) => Math.log10(N);
  const logNMin = logN(N_MIN);
  const logNMax = logN(N_MAX);
  const yMin = Math.log10(400);
  const yMax = Math.log10(20000);

  const xS = (N) => padL + ((logN(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const fitPoints = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const N = Math.pow(10, logNMin + ((logNMax - logNMin) * i) / steps);
    fitPoints.push({ N, budget: closedFormBudget(N) });
  }
  const fitPath = fitPoints
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.N).toFixed(1) + ',' + yS(p.budget).toFixed(2))
    .join(' ');

  const yTicks = [500, 1000, 2000, 4000, 8000, 16000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <path d={fitPath} fill="none" stroke={COLORS.fit} strokeWidth={2} strokeDasharray="5,3" />

      {IMP3564_MEASURED_RUNGS.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.budgetMeasured)} r={4.5} fill={COLORS.measured} />
      ))}

      {IMP3564_EXTRAPOLATION.map((e) => (
        <circle key={'e' + e.N} cx={xS(e.N)} cy={yS(e.budgetPredicted)} r={4.5} fill={COLORS.extrap} stroke={ED.paper} strokeWidth={1} />
      ))}
      {IMP3564_EXTRAPOLATION.map((e) => (
        <text key={'el' + e.N} x={xS(e.N)} y={yS(e.budgetPredicted) - 9} textAnchor="middle" fill={ED.series5} fontSize={8.5}>
          {Math.round(e.budgetPredicted)}
        </text>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[160, 240, 320, 400, 480, 640, 800, 1000, 1200].map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        section size N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        budget to reach 1e-9 gap
      </text>

      <g fontSize={9}>
        <circle cx={padL + 6} cy={padT + 12} r={4} fill={COLORS.measured} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>measured ladder (imp-3505)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.fit} strokeWidth={2} strokeDasharray="5,3" />
        <text x={padL + 14} y={padT + 29} fill={ED.brass}>closed form K&middot;N^{(-IMP3564_GAP_EXPONENT_Q).toFixed(2)} (imp-3530)</text>
        <circle cx={padL + 6} cy={padT + 40} r={4} fill={COLORS.extrap} />
        <text x={padL + 14} y={padT + 43} fill={ED.series5}>a-priori extrapolation N=1000,1200</text>
      </g>
    </svg>
  );
}

function GapDecayChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const N_MIN = 160;
  const N_MAX = 800;
  const logN = (N) => Math.log10(N);
  const logNMin = logN(N_MIN);
  const logNMax = logN(N_MAX);
  const yMin = -3.5;
  const yMax = -1.3;

  const xS = (N) => padL + ((logN(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const fitPoints = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const N = Math.pow(10, logNMin + ((logNMax - logNMin) * i) / steps);
    fitPoints.push({ N, rate: closedFormGapDecay(N) });
  }
  const fitPath = fitPoints
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.N).toFixed(1) + ',' + yS(p.rate).toFixed(2))
    .join(' ');

  const yTicks = [1e-3, 1e-2, 1e-1];

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

      <path d={fitPath} fill="none" stroke={COLORS.fit} strokeWidth={2} strokeDasharray="5,3" />

      {IMP3564_MEASURED_RUNGS.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.logInvRho)} r={4.5} fill={COLORS.measured} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3564_MEASURED_RUNGS.map((r) => (
        <g key={'x' + r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        section size N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        -log rho(N) (log scale)
      </text>

      <g fontSize={9}>
        <circle cx={padL + 6} cy={padT + 12} r={4} fill={COLORS.measured} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>measured -log rho(N) = -log(lambda_3/lambda_1)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.fit} strokeWidth={2} strokeDasharray="5,3" />
        <text x={padL + 14} y={padT + 29} fill={ED.brass}>power-law fit A&middot;N^{IMP3564_GAP_EXPONENT_Q.toFixed(2)}</text>
      </g>
    </svg>
  );
}

export default function Imp3564PowerIterationClosedFormViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Power-Iteration Budget Closed-Form Fit (imp-3530 / imp-3564)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3540 plotted the raw imp-3505 budget-to-1e-9 ladder. imp-3530 went further: it
        identified that the skew-Toeplitz Gram top eigenvalue pair is DEGENERATE, so the
        power-iteration rate is set by the ratio to the next distinct eigenvalue,
        rho(N) = lambda_3/lambda_1, and fit budget(N) = C&middot;log(1/eps)/(-log rho(N))
        with a single prefactor C &sim; {IMP3564_PREFACTOR_C.toFixed(3)}. The gap decay itself
        closes as a power law -log rho(N) = A&middot;N^q with q &sim; {IMP3564_GAP_EXPONENT_Q.toFixed(3)}
        (near the -2 skew-Toeplitz heuristic), giving the fully-closed predictor budget(N) &sim; K&middot;N^2.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Measured ladder vs. the closed-form K&middot;N^2 fit, with a-priori extrapolated N=1000/1200 budgets
      </p>
      <BudgetClosedFormChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Underlying gap decay -log rho(N) = A&middot;N^q that drives the closed form
      </p>
      <GapDecayChart />

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
        only -- no proof, no reduction below RH. The closed-form predictor reproduces the
        imp-3505 ladder within a factor of {IMP3564_MAX_FIT_RATIO_DEV.toFixed(2)} at every measured
        rung, with the prefactor C a single least-squares fit (not derived from first principles)
        and the N=1000/1200 extrapolations untested against a re-swept reference. It does not
        construct the missing imp-3066 K_a &ge; 0 sign-positivity residual, which remains
        untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3540-power-iteration-budget" style={{ color: 'var(--series-5)' }}>
          Raw Budget Ladder (imp-3540)
        </Link>
      </div>
    </div>
  );
}
