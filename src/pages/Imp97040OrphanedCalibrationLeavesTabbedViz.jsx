import React, { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96959_FLOOR_LADDER,
  IMP96959_MARGIN_CONTRAST,
  IMP96959_HONEST_BANNER,
} from '../data/imp-96959-krein-floor-margin-viz-data.js';
import {
  IMP96960_LADDER_SERIES,
  IMP96960_HONEST_BANNER,
} from '../data/imp-96960-etrunc-cc-elasticity-ladder-viz-data.js';
import {
  IMP96961_ONSET_TAIL_SERIES,
  IMP96961_HONEST_BANNER,
} from '../data/imp-96961-bessel-onset-mass-tail-residual-viz-data.js';
import {
  IMP97038_NS,
  IMP97038_ROWS,
  IMP97038_GROWTH,
  IMP97038_VERDICT,
} from '../data/imp-97038-bessel-onset-mass-extended-N-viz-data.js';
import {
  IMP97002_FACTOR_SERIES,
  IMP97002_LOG10_FACTOR_SERIES,
  IMP97002_HONEST_BANNER,
} from '../data/imp-97002-krein-vacuity-factorisation-viz-data.js';
import {
  IMP96974_NS,
  IMP96974_ROWS,
  IMP96974_JOINED_GAP_LADDER,
  IMP96974_VERDICT,
} from '../data/imp-96974-bessel-onset-crossover-viz-data.js';
import {
  IMP97039_LADDER,
  IMP97039_GAP_DECOMPOSITION,
  IMP97039_HONEST_BANNER,
} from '../data/imp-97039-vif-reconciliation-ladder.js';
import {
  IMP96985_ONSET_LADDER_SERIES,
  IMP96985_GROWTH_SERIES,
  IMP96985_T3200,
  IMP96985_P_GLOBAL,
  IMP96985_PROJECTED_ONSET_CROSSOVER_N,
  IMP96985_HONEST_BANNER,
} from '../data/imp-96985-bessel-onset-finer-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97040: imp-96959/imp-96960/imp-96961 were each "-viz-data" leaves with no confirmed
// consumer (no .jsx page imported them -- see imp-96925 for the same trap on an earlier leaf).
// This is the first consumer: a single tabbed page giving all three orphaned calibration
// tables a chart-ready home instead of shipping three near-duplicate single-purpose pages.

function LineChart({ series, xTicks, xLabel, yFormat, useLogY }) {
  const svgW = 680;
  const svgH = 300;
  const padL = 46;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  const allY = series.flatMap((s) => s.points.map((p) => (useLogY ? Math.log10(p.y) : p.y)));
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const spanY = maxY - minY || 1;

  const xOf = (x) => padL + ((x - minX) / (maxX - minX || 1)) * plotW;
  const yOf = (y) => padT + plotH - (((useLogY ? Math.log10(y) : y) - minY) / spanY) * plotH;

  const yTickVals = [0, 0.5, 1].map((f) => minY + f * spanY);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTickVals.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={padT + plotH - ((v - minY) / spanY) * plotH} x2={padL} y2={padT + plotH - ((v - minY) / spanY) * plotH} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={padT + plotH - ((v - minY) / spanY) * plotH + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {yFormat(useLogY ? 10 ** v : v)}
          </text>
        </g>
      ))}
      {xTicks.map((x) => (
        <text key={`x${x}`} x={xOf(x)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {x}
        </text>
      ))}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.points.map((p) => `${xOf(p.x)},${yOf(p.y)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={1.9}
          />
          {s.points.map((p) => (
            <circle key={`${s.label}-${p.x}`} cx={xOf(p.x)} cy={yOf(p.y)} r={2.4} fill={s.color} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        {xLabel}
      </text>
    </svg>
  );
}

function Legend({ series }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
      {series.map((s) => (
        <span key={s.label} style={{ color: s.color }}>
          &#9632; {s.label}
        </span>
      ))}
    </div>
  );
}

function HonestBanner({ text }) {
  return (
    <div
      style={{
        marginTop: '1.25rem',
        padding: '0.75rem 1rem',
        background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
        borderLeft: '3px solid var(--series-2)',
        borderRadius: '0 4px 4px 0',
        fontSize: '0.8rem',
        color: 'var(--ink-soft)',
      }}
    >
      <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {text}
    </div>
  );
}

function KreinFloorMarginPanel() {
  const series = [
    {
      label: '2a=ln3',
      color: ED.series3,
      points: IMP96959_FLOOR_LADDER.map((r) => ({ x: r.Nbig, y: r.floorLn3 })),
    },
    {
      label: '2a=0.96',
      color: ED.series1,
      points: IMP96959_FLOOR_LADDER.map((r) => ({ x: r.Nbig, y: r.floorA096 })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-96959 reshapes the imp-96938 Nbig=24..240 Ritz floor ladder (T=800) at both endpoints
        onto one chart (log y-axis, since the two floors differ by ~25x). Both floors drift the
        same direction with Nbig (down); only the absolute margin differs.
      </p>
      <LineChart
        series={series}
        xTicks={IMP96959_FLOOR_LADDER.map((r) => r.Nbig)}
        xLabel="Nbig"
        yFormat={(v) => v.toFixed(2)}
        useLogY
      />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
        Floor minima: 2a=ln3 &rarr; {IMP96959_MARGIN_CONTRAST.floorMin_ln3.toFixed(6)}; 2a=0.96
        &rarr; {IMP96959_MARGIN_CONTRAST.floorMin_a096.toFixed(6)} (ratio{' '}
        {IMP96959_MARGIN_CONTRAST.ratio.toFixed(2)}x). Drift direction identical at both
        endpoints: {String(IMP96959_MARGIN_CONTRAST.driftDirectionsIdenticalBothEndpoints)}.
      </div>
      <HonestBanner text={IMP96959_HONEST_BANNER} />
    </div>
  );
}

function EtruncCcElasticityPanel() {
  const series = [
    {
      label: 'C_C elasticity',
      color: ED.brass,
      points: IMP96960_LADDER_SERIES.map((r) => ({ x: r.log10N, y: r.elasticityCC })),
    },
    {
      label: 'E_trunc elasticity',
      color: ED.series2,
      points: IMP96960_LADDER_SERIES.map((r) => ({ x: r.log10N, y: r.elasticityEtrunc })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-96960 merges the imp-96936/imp-96950 conjugate ladders across all six measured
        sigma-share decay landmarks (sigma = 0.75 down to 0.01). The two leverages mirror each
        other about the +2 / -2 inverse-square asymptote and their signed sum shrinks
        monotonically deeper into the decay arm.
      </p>
      <LineChart
        series={series}
        xTicks={IMP96960_LADDER_SERIES.map((r) => r.log10N)}
        xLabel="log10(N_cross)"
        yFormat={(v) => v.toFixed(2)}
      />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr>
              {['sigma', 'N_cross', 'elasticity_cc', 'elasticity_etrunc', 'signed sum'].map((h) => (
                <th key={h} style={{ textAlign: 'right', padding: '0.25rem 0.6rem', borderBottom: '1px solid var(--rule)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {IMP96960_LADDER_SERIES.map((r) => (
              <tr key={r.sigma}>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.sigma}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.nCross.toExponential(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.elasticityCC.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.elasticityEtrunc.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.signedSum.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HonestBanner text={IMP96960_HONEST_BANNER} />
    </div>
  );
}

function BesselOnsetTailPanel() {
  const series = [
    {
      label: 'measured residual',
      color: ED.series3,
      points: IMP96961_ONSET_TAIL_SERIES.map((r) => ({ x: r.log10N, y: r.residMeasured })),
    },
    {
      label: 'first-order residual',
      color: ED.series1,
      points: IMP96961_ONSET_TAIL_SERIES.map((r) => ({ x: r.log10N, y: r.residFirstOrder })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-96961 reshapes the imp-96934 per-N (N = 76, 100, 124) Bessel onset-mass vs measured
        beyond-T=3200 tail-residual table at 2a=ln3. The first-order (Rayleigh) tail residual
        reproduces the measured floor lift in sign and order at every N, but the onset sits
        13-22x below the T=3200 cutoff and the literal onset-mass model over-predicts the
        absolute fraction.
      </p>
      <LineChart
        series={series}
        xTicks={IMP96961_ONSET_TAIL_SERIES.map((r) => r.log10N)}
        xLabel="log10(N)"
        yFormat={(v) => v.toExponential(2)}
      />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
        Cutoff T3200 = {IMP96961_T3200}. {IMP96961_ONSET_TAIL_SERIES.length} N-rungs shown
        (onset-over-weighted-fraction ratio ranges{' '}
        {Math.min(...IMP96961_ONSET_TAIL_SERIES.map((r) => r.onsetOverWeightedRatio)).toFixed(2)}x
        &ndash;{' '}
        {Math.max(...IMP96961_ONSET_TAIL_SERIES.map((r) => r.onsetOverWeightedRatio)).toFixed(2)}x).
      </div>
      <HonestBanner text={IMP96961_HONEST_BANNER} />
    </div>
  );
}

function BesselOnsetMassExtendedNPanel() {
  const series = [
    {
      label: 'measured floor lift',
      color: ED.series3,
      points: IMP97038_NS.map((N) => ({ x: N, y: IMP97038_ROWS[N].residMeasured })),
    },
    {
      label: 'onset-mass prediction (unweighted)',
      color: ED.brass,
      points: IMP97038_NS.map((N) => ({ x: N, y: IMP97038_ROWS[N].onsetFracUnweighted })),
    },
  ];
  const steps = ['124->148', '148->172', '172->196'];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-97038 extends the imp-96934 Bessel onset-mass vs measured-tail-residual comparison at
        2a=ln3 three rungs further (N = 148, 172, 196). The robust direct floor lift keeps growing
        but decelerates toward the onset model&apos;s linear-in-k growth rate; the first-order
        absolute-fraction comparison becomes numerically unreliable past N~148 and its apparent
        over-to-under flip is an artifact, not a physical crossover.
      </p>
      <LineChart
        series={series}
        xTicks={IMP97038_NS}
        xLabel="N"
        yFormat={(v) => v.toExponential(2)}
        useLogY
      />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr>
              {['step', 'ratio measured', 'ratio onset-linear', 'ratio of ratios'].map((h) => (
                <th key={h} style={{ textAlign: 'right', padding: '0.25rem 0.6rem', borderBottom: '1px solid var(--rule)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((s) => (
              <tr key={s}>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{s}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{IMP97038_GROWTH[s].ratioMeasured.toFixed(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{IMP97038_GROWTH[s].ratioOnsetLinear.toFixed(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{IMP97038_GROWTH[s].ratioOfRatios.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HonestBanner text={IMP97038_VERDICT.answer} />
    </div>
  );
}

function KreinVacuityFactorisationPanel() {
  const series = [
    {
      label: 'log10(step1: sum-vs-single)',
      color: ED.series3,
      points: IMP97002_LOG10_FACTOR_SERIES.map((r, i) => ({ x: i, y: r.log10Step1 })),
    },
    {
      label: 'log10(step2: spectral gap)',
      color: ED.series2,
      points: IMP97002_LOG10_FACTOR_SERIES.map((r, i) => ({ x: i, y: r.log10Step2 })),
    },
    {
      label: 'log10(step3: trial-vector slack)',
      color: ED.series1,
      points: IMP97002_LOG10_FACTOR_SERIES.map((r, i) => ({ x: i, y: r.log10Step3 })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-97002 reshapes the imp-96973 three-rung Tr(B<sup>-1</sup>R_T)/actual vacuity
        factorisation (sum-vs-single &times; spectral-gap &times; trial-vector-slack) into
        chart-ready rows. The spectral-gap factor carries all ~13-15 orders of magnitude at every
        rung while the other two stay uniformly benign (&lt;2x), so the log10 series is plotted
        here (points indexed 0-2 = the three tabulated (N,2a) rungs, see table below for labels).
      </p>
      <LineChart series={series} xTicks={series[0].points.map((p) => p.x)} xLabel="rung index" yFormat={(v) => v.toFixed(1)} />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr>
              {['rung', 'N', '2a', 'step1', 'step2', 'step3', 'total', 'recomposed'].map((h) => (
                <th key={h} style={{ textAlign: 'right', padding: '0.25rem 0.6rem', borderBottom: '1px solid var(--rule)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {IMP97002_FACTOR_SERIES.map((r) => (
              <tr key={r.rung}>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.rung}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.N}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.twoA.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.step1SumVsSingle.toFixed(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.step2SpectralGap.toExponential(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.step3TrialSlack.toFixed(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.total.toExponential(3)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.recomposed.toExponential(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HonestBanner text={IMP97002_HONEST_BANNER} />
    </div>
  );
}

function BesselOnsetCrossoverPanel() {
  const ladderNs = Object.keys(IMP96974_JOINED_GAP_LADDER).map(Number);
  const series = [
    {
      label: 'onsetGapRatio',
      color: ED.series2,
      points: ladderNs.map((N) => ({ x: N, y: IMP96974_JOINED_GAP_LADDER[N] })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-96974 extends the imp-96957 Bessel onset-mass vs sigma_2-weighted tail-fraction ladder
        to N in {'{136,148,160}'} at 2a=ln3. The literal uniform-onset over-prediction ratio
        (onsetGapRatio) collapses monotonically and crosses 1 between N=136 and N=148 (joined
        seven-rung log-linear fit N_cross={IMP96974_VERDICT.crossoverAllRungsN.toFixed(1)}),
        earlier than the four-rung projection N={IMP96974_VERDICT.crossoverPriorOnlyN.toFixed(1)}.
      </p>
      <LineChart series={series} xTicks={ladderNs} xLabel="N" yFormat={(v) => v.toFixed(2)} useLogY />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr>
              {['N', 'weightedTailFrac', 'onsetFracUnweighted', 'onsetGapRatio'].map((h) => (
                <th key={h} style={{ textAlign: 'right', padding: '0.25rem 0.6rem', borderBottom: '1px solid var(--rule)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {IMP96974_NS.map((N) => (
              <tr key={N}>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{N}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{IMP96974_ROWS[N].weightedTailFrac.toFixed(5)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{IMP96974_ROWS[N].onsetFracUnweighted.toFixed(5)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{IMP96974_ROWS[N].onsetGapRatio.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HonestBanner text={IMP96974_VERDICT.answer} />
    </div>
  );
}

function VifReconciliationLadderPanel() {
  const series = [
    {
      label: 'AR(1) full geometric',
      color: ED.series2,
      points: IMP97039_LADDER.map((r) => ({ x: r.lag, y: r.cumAr1 })),
    },
    {
      label: 'sign-change truncated',
      color: ED.brass,
      points: IMP97039_LADDER.map((r) => ({ x: r.lag, y: r.cumSignChange })),
    },
    {
      label: 'Bartlett b=3',
      color: ED.series1,
      points: IMP97039_LADDER.map((r) => ({ x: r.lag, y: r.cumBartlett })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-97039 walks the imp-96832 drift-VIF reconciliation down all 12 lags of the same
        measured ACF, under three lag treatments. The AR(1) full-geometric extrapolation
        (red) keeps climbing past the point where the empirical ACF (rhoEmp) turns negative at
        lag 3; the sign-change-truncated series (amber) freezes there at the integrated-ACF
        value 2.1356; the Bartlett b=3 block-bootstrap window (blue) down-weights the two
        retained lags further, landing at 1.6726 (imp-96709 measured MBB 1.6996).
      </p>
      <LineChart
        series={series}
        xTicks={IMP97039_LADDER.map((r) => r.lag)}
        xLabel="lag k"
        yFormat={(v) => v.toFixed(3)}
      />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr>
              {['lag', 'rhoEmp', 'ar1Geo', 'cumAr1', 'cumSignChange', 'cumBartlett'].map((h) => (
                <th key={h} style={{ textAlign: 'right', padding: '0.25rem 0.6rem', borderBottom: '1px solid var(--rule)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {IMP97039_LADDER.map((r) => (
              <tr key={r.lag} style={r.isTruncationLag ? { background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)' } : undefined}>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.lag}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.rhoEmp.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.ar1Geo.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.cumAr1.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.cumSignChange.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.cumBartlett.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
        Gap decomposition: {IMP97039_GAP_DECOMPOSITION.ar1Full.toFixed(3)} (AR(1))
        &minus; {Math.abs(IMP97039_GAP_DECOMPOSITION.minusFictitiousGeometricTail).toFixed(3)}{' '}
        (fictitious geometric tail) = {IMP97039_GAP_DECOMPOSITION.signChangeTruncated.toFixed(3)}{' '}
        &minus; {Math.abs(IMP97039_GAP_DECOMPOSITION.minusBartlettDownWeighting).toFixed(3)}{' '}
        (Bartlett down-weighting) = {IMP97039_GAP_DECOMPOSITION.bartlettB3Recon.toFixed(3)}{' '}
        (measured MBB {IMP97039_GAP_DECOMPOSITION.measuredMbb}). Truncation point: lag{' '}
        {IMP97039_GAP_DECOMPOSITION.truncationPointLag} (highlighted row).
      </div>
      <HonestBanner text={IMP97039_HONEST_BANNER} />
    </div>
  );
}

function BesselOnsetFinerLadderPanel() {
  const series = [
    {
      label: 'sigma_2-weighted floor-lift',
      color: ED.series3,
      points: IMP96985_ONSET_LADDER_SERIES.map((r) => ({ x: r.log10N, y: r.residMeasured })),
    },
    {
      label: 'onset/T3200 ratio',
      color: ED.brass,
      points: IMP96985_ONSET_LADDER_SERIES.map((r) => ({ x: r.log10N, y: r.tOnsetOverT3200 })),
    },
  ];
  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        imp-96985 reshapes the imp-96957 finer Bessel onset ladder N in {'{88,100,112,124}'} at
        2a=ln3 into a chart-ready series. The sigma_2-weighted floor-lift keeps growing
        super-cubically (global exponent {IMP96985_P_GLOBAL.toFixed(3)}, no roll-off) while the
        literal-onset over-prediction ratio collapses across the same ladder, projecting an
        unverified crossover near N&asymp;{IMP96985_PROJECTED_ONSET_CROSSOVER_N.toFixed(0)} &mdash;
        past every rung measured here and past the 2a&le;0.96 interval-verified reach.
      </p>
      <LineChart
        series={series}
        xTicks={IMP96985_ONSET_LADDER_SERIES.map((r) => r.log10N)}
        xLabel="log10(N)"
        yFormat={(v) => v.toExponential(2)}
        useLogY
      />
      <Legend series={series} />
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr>
              {['N', 'onsetGapRatio', 'weightedTailFrac', 'onsetFracUnweighted'].map((h) => (
                <th key={h} style={{ textAlign: 'right', padding: '0.25rem 0.6rem', borderBottom: '1px solid var(--rule)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {IMP96985_ONSET_LADDER_SERIES.map((r) => (
              <tr key={r.N}>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.N}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.onsetGapRatio.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.weightedTailFrac.toFixed(5)}</td>
                <td style={{ textAlign: 'right', padding: '0.2rem 0.6rem' }}>{r.onsetFracUnweighted.toFixed(5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
        Cutoff T3200 = {IMP96985_T3200}. Local step exponents:{' '}
        {IMP96985_GROWTH_SERIES.map((g) => g.pLocal.toFixed(2)).join(', ')} (all super-cubic).
      </div>
      <HonestBanner text={IMP96985_HONEST_BANNER} />
    </div>
  );
}

const TABS = [
  { id: 'krein-floor-margin', label: 'imp-96959: Krein floor margin', Panel: KreinFloorMarginPanel },
  { id: 'etrunc-cc-elasticity', label: 'imp-96960: E_trunc vs C_C elasticity', Panel: EtruncCcElasticityPanel },
  { id: 'bessel-onset-tail', label: 'imp-96961: Bessel onset-mass vs tail residual', Panel: BesselOnsetTailPanel },
  { id: 'bessel-onset-mass-extended-N', label: 'imp-97038: Bessel onset-mass extended-N', Panel: BesselOnsetMassExtendedNPanel },
  { id: 'krein-vacuity-factorisation', label: 'imp-97002: Krein vacuity factorisation', Panel: KreinVacuityFactorisationPanel },
  { id: 'bessel-onset-crossover', label: 'imp-96974: Bessel onset/tail crossover', Panel: BesselOnsetCrossoverPanel },
  { id: 'vif-reconciliation-ladder', label: 'imp-97039: VIF reconciliation ladder', Panel: VifReconciliationLadderPanel },
  { id: 'bessel-onset-finer-ladder', label: 'imp-96985: Bessel onset finer ladder', Panel: BesselOnsetFinerLadderPanel },
];

export default function Imp97040OrphanedCalibrationLeavesTabbedViz() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const Active = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Orphaned Route I / Route M Calibration Leaves" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        Viz-data leaves (imp-96959, imp-96960, imp-96961, imp-97038, imp-97002, imp-96974, imp-97039,
        imp-96985) shipped as import-light reshapes of earlier calibration tables but had no
        consuming page.
        This tab set gives each a chart-ready home in one place instead of near-duplicate
        single-purpose pages.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid var(--rule)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.8rem',
              background: 'none',
              border: 'none',
              borderBottom: t.id === activeTab ? '2px solid var(--series-1)' : '2px solid transparent',
              color: t.id === activeTab ? 'var(--ink)' : 'var(--ink-faint)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Active.Panel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming three
        previously-orphaned viz-data leaves verbatim. Changes no bound, establishes no operator
        positivity; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
