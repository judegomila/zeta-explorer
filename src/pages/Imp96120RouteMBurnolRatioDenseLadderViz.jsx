import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96120_LADDER,
  IMP96120_BAND,
  IMP96120_VERDICT_SUMMARY,
  IMP96120_HONEST_BANNER,
} from '../data/imp-96120-route-m-burnol-ratio-dense-ladder-viz-data.js';
import {
  IMP96105_EXT_ROWS,
  IMP96105_BANDS,
  IMP96105_VERDICT,
  IMP96105_HONEST_BANNER,
} from '../data/imp-96105-route-m-vasyunin-gram-extend-n6000.js';
import {
  IMP96189_GAMMA1,
  IMP96189_TRANSIENTS,
  IMP96189_CONDUCTOR_TONES,
  IMP96189_FREE_TONE,
  IMP96189_BAND,
  IMP96189_GAMMA1_TONE,
  IMP96189_LAMMIN,
  IMP96189_VERDICT,
  IMP96189_HONEST_BANNER,
} from '../data/imp-96189-route-m-swing-attribution.js';
import { IMP96325_SUBGAP, IMP96325_RUN, IMP96325_HONEST_BANNER } from '../data/imp-96325-route-m-vasyunin-gram-n1e4-run.js';
import {
  IMP96352_BUILD_ONLY_ESTIMATE,
  IMP96352_REACH,
  IMP96352_REACH_MODEL,
  IMP96352_HONEST_BANNER,
} from '../data/imp-96352-route-m-vasyunin-solve-cost-model.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// line + point chart of ratio(N) = d_N^2 log N / C_burnol over the dense
// ladder N=250..2600, against the ratio=1 (RH + simple zeros) target line
// and the [0.964,1.010] band the ladder actually occupies.
function DenseLadderPanel() {
  const rows = IMP96120_LADDER;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minN = rows[0].N;
  const maxN = rows[rows.length - 1].N;
  const minY = 0.955;
  const maxY = 1.015;
  const xOf = (N) => padL + ((N - minN) / (maxN - minN)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [0.96, 0.97, 0.98, 0.99, 1.0, 1.01];

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="N"
      yLabel="ratio(N) = d_N² log N / C_burnol"
    >
      <rect
        x={padL}
        y={yOf(IMP96120_BAND.hi)}
        width={plotW}
        height={yOf(IMP96120_BAND.lo) - yOf(IMP96120_BAND.hi)}
        fill={ED.series1}
        opacity={0.06}
      />
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <text x={padL + plotW - 4} y={yOf(1) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        ratio = 1 (RH + simple zeros)
      </text>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.N)},${yOf(r.ratio)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.9}
      />
      {rows.map((r) => (
        <circle
          key={r.N}
          cx={xOf(r.N)}
          cy={yOf(r.ratio)}
          r={r.N === IMP96120_BAND.loN || r.N === IMP96120_BAND.hiN ? 4 : 2.5}
          fill={r.N === IMP96120_BAND.loN || r.N === IMP96120_BAND.hiN ? ED.brassDeco : ED.series1}
        />
      ))}
      {[250, 1000, 1750, 2600].map((N) => (
        <text key={N} x={xOf(N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {N}
        </text>
      ))}
    </AxisFrame>
  );
}

export default function Imp96120RouteMBurnolRatioDenseLadderViz() {
  const rows = IMP96120_LADDER;
  const first = rows[0];
  const last = rows[rows.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M: Burnol-Ratio Dense Ladder (N=250..2600)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96120_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route M Nyman-Beurling distance ratio(N) = d_N&sup2; log N / &Sigma;_&rho; 1/|&rho;|&sup2;
        (the Burnol-normalized quantity, which RH + simple zeros predicts approaches 1) was measured
        on a dense ten-rung ladder from N={first.N} to N={last.N} against three overlapping coarser
        rungs (imp-96069). Rather than tightening toward the target, the ratio stays inside{' '}
        {IMP96120_VERDICT_SUMMARY.band}, with {IMP96120_VERDICT_SUMMARY.signChangesInDiffs} sign
        changes in the successive differences &mdash; it does not converge monotonically to 1 on the
        accessible range.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        ratio(N) across the dense ladder vs the ratio=1 target
      </h3>
      <DenseLadderPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the shaded band marks the
        ten-rung range [{IMP96120_BAND.lo.toFixed(4)}, {IMP96120_BAND.hi.toFixed(4)}]; the highlighted
        points are the low point at N={IMP96120_BAND.loN} and the high point at N={IMP96120_BAND.hiN}.
        {' '}{IMP96120_VERDICT_SUMMARY.conclusion}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96120
        baked viz-data (every value copied verbatim from imp-96094's own IMP96094_ROWS, no
        re-derivation of the underlying Gram / Cholesky numerics). {IMP96120_HONEST_BANNER}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        Extension ladder N=3000..6000 (imp-96105) and the SPD lam_min descent
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: 700 }}>
        The exact Vasyunin Gram was rebuilt once to N=6000, extending the dense ladder above past
        its N=2600 cap. Every extension rung sits below the N=2600 peak of{' '}
        {IMP96105_BANDS.full.hi.toFixed(4)} and re-crosses below 1, continuing the oscillation
        rather than tightening toward it: worst deviation {IMP96105_BANDS.extOnly.worstDev.toFixed(4)}{' '}
        (N=3500), matching the pre-extension worst in magnitude.
      </p>
      <table style={{ width: '100%', maxWidth: 560, borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>N</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>d_N&sup2;</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>ratio(N)</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>lam_min</th>
          </tr>
        </thead>
        <tbody>
          {IMP96105_EXT_ROWS.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 40%, transparent)' }}>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{r.N}</td>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{r.dN2.toFixed(6)}</td>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{r.ratio.toFixed(4)}</td>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{r.lamMin.toExponential(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
          marginBottom: '0.75rem',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>lam_min descent:</strong> across the full N=250..6000
        ladder (imp-96094 rungs plus this extension) lam_min falls smoothly and monotonically from
        2.06e-5 (N=250) to {IMP96105_EXT_ROWS[IMP96105_EXT_ROWS.length - 1].lamMin.toExponential(2)}{' '}
        (N=6000): the Gram stays symmetric positive-definite throughout, so the ratio(N) oscillation
        is not Cholesky conditioning noise. {IMP96105_VERDICT.conclusion}
      </div>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status (imp-96105):</strong> {IMP96105_HONEST_BANNER}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        w&nbsp;~&nbsp;4.08 swing attribution (imp-96189): variance-explained R&sup2; per candidate
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: 700 }}>
        The imp-96147 residual (ratio(N) with the c0 + c1/logN smooth term removed) carries a
        genuine period-1.5 (w&nbsp;~&nbsp;4.08) swing that imp-96163 showed is not a gamma_1
        aliasing artifact. Four candidate sources were fit by ordinary least squares against the
        17-point residual and scored by variance explained (R&sup2;):
      </p>
      <table style={{ width: '100%', maxWidth: 560, borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>Candidate</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>w</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>R&sup2;</th>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: '1/N transient', w: null, r2: IMP96189_TRANSIENTS.invN_R2, verdict: 'ruled out' },
            { label: '1/logN transient', w: null, r2: IMP96189_TRANSIENTS.invLogN_R2, verdict: 'ruled out' },
            { label: '1/sqrt(N) transient', w: null, r2: IMP96189_TRANSIENTS.invSqrtN_R2, verdict: 'ruled out' },
            ...IMP96189_CONDUCTOR_TONES.map((t) => ({
              label: `conductor q=${t.q}`,
              w: t.w,
              r2: t.R2,
              verdict: t.q === 4 || t.q === 5 ? 'dominant' : '',
            })),
            { label: 'best free tone', w: IMP96189_FREE_TONE.bestW, r2: IMP96189_FREE_TONE.R2, verdict: 'proxies q4+q5 band' },
            { label: 'q4+q5 fixed band', w: null, r2: IMP96189_BAND.q4_q5_R2, verdict: 'matches free tone' },
            { label: 'q3..q6 fixed band', w: null, r2: IMP96189_BAND.q3_q4_q5_q6_R2, verdict: 'captures 89.7%' },
            { label: 'gamma_1 zero-tone (control)', w: IMP96189_GAMMA1, r2: IMP96189_GAMMA1_TONE.R2, verdict: 'negligible' },
          ].map((row) => (
            <tr key={row.label} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 40%, transparent)' }}>
              <td style={{ textAlign: 'left', padding: '0.3rem 0.6rem' }}>{row.label}</td>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{row.w == null ? '—' : row.w.toFixed(3)}</td>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{row.r2.toFixed(4)}</td>
              <td style={{ textAlign: 'left', padding: '0.3rem 0.6rem', color: row.verdict === 'dominant' || row.verdict === 'ruled out' ? 'var(--ink-faint)' : 'var(--ink-soft)' }}>{row.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
          marginBottom: '0.75rem',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>lam_min (not in the table, ruled out as a source):</strong>{' '}
        Pearson r against the residual is {IMP96189_LAMMIN.corrResidLamMin.toFixed(4)} (raw) and{' '}
        {IMP96189_LAMMIN.corrResidLogLamMin.toFixed(4)} (log), but lam_min is strictly monotone-decreasing
        ({IMP96189_LAMMIN.lamMinUpwardSteps} upward steps) over the tail where the residual only changes
        sign {IMP96189_LAMMIN.residSignChangesInTail} time, so it has zero oscillatory content and the
        strong correlation is a short monotone-window artifact, not a causal link.
      </div>
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Verdict (imp-96189):</strong> {IMP96189_VERDICT.conclusion}
        <br />
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96189_HONEST_BANNER}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        Ladder run to N={IMP96325_RUN.NMAX.toLocaleString()} (imp-96325): accessible range only
      </h3>
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status (imp-96325):</strong> the ladder above was
        extended to N={IMP96325_RUN.NMAX.toLocaleString()} as a single dedicated run. That run answers
        Q1 (does ratio(N) approach the Burnol constant?) for the accessible range only: NO, the
        finite-N plateau/oscillation seen above persists to N={IMP96325_RUN.NMAX.toLocaleString()} with
        no tightening. The true asymptotic beyond N={IMP96325_RUN.NMAX.toLocaleString()} and the Q2
        conductor-band-vs-smooth-drift identifiability both stay OPEN &mdash; see {IMP96325_SUBGAP.id}.
        {' '}{IMP96325_HONEST_BANNER}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        Reach cost model reprice (imp-96352): BUILD-only vs the actual N={IMP96325_RUN.NMAX.toLocaleString()} run
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: 700 }}>
        The imp-96230 BUILD-only budget ({IMP96352_BUILD_ONLY_ESTIMATE.totalWallSeconds} s: Gram build,
        one dense eigvalsh, and 25 rung Cholesky factorizations) omitted the per-rung inverse-power
        lam_min solve. The imp-96325 run above actually took {IMP96352_BUILD_ONLY_ESTIMATE.underCountFactor.toFixed(2)}&times;{' '}
        that estimate, so a wall-clock budget reaches a much smaller N than the BUILD-only figure implied:
      </p>
      <table style={{ width: '100%', maxWidth: 700, borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>Budget</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>Reachable N</th>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.6rem', color: 'var(--ink-faint)' }}>Note</th>
          </tr>
        </thead>
        <tbody>
          {IMP96352_REACH.map((row) => (
            <tr key={row.budgetSeconds} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 40%, transparent)' }}>
              <td style={{ textAlign: 'left', padding: '0.3rem 0.6rem' }}>{row.budgetLabel}</td>
              <td style={{ textAlign: 'right', padding: '0.3rem 0.6rem' }}>{row.reachN.toLocaleString()}</td>
              <td style={{ textAlign: 'left', padding: '0.3rem 0.6rem' }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Binding constraint:</strong> {IMP96352_REACH_MODEL.bindingConstraint}
        {' '}Reference only (imp-96352); no new value derived here. {IMP96352_HONEST_BANNER}
      </div>
    </div>
  );
}
