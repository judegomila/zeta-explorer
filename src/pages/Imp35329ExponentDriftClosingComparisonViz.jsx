import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE } from '../data/imp-35242-ecoll-exponent-residual-0005-tolerance-locate.js';
import { IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION } from '../data/imp-35198-eflow-fartail-exponent-logn-correction.js';
import { IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA } from '../data/imp-35183-sigma-fartail-exponent-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const ECOLL = IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE;
const EFLOW = IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION;
const SIGMA = IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA;

// Each source ladder's own closing law already carries a known constant factor (1/2, 3, 1/2).
// Dividing/multiplying that constant back out is arithmetic, not re-derivation, and collapses
// all three residuals onto the same 1/ln(argument) shape for direct visual comparison.
const ECOLL_POINTS = ECOLL.ladder.map((r) => ({
  lnArg: r.logT0,
  normResidual: r.residual_to_minus_half * 2, // undoes the 1/2 in 1/(2 log T0)
}));
const EFLOW_POINTS = EFLOW.ladder.map((r) => ({
  lnArg: r.logN,
  normResidual: (r.fullSurrogateExponent + 1) / 3, // undoes the 3 in 3/log N
}));
const SIGMA_POINTS = SIGMA.ladder.map((r) => ({
  lnArg: Math.log(Math.pow(10, r.k + 0.5)),
  normResidual: r.residualGap * 2, // undoes the 1/2 in 1/(2 ln N)
}));

const SERIES = [
  { name: 'E_coll -> -1/2', law: '1/(2 log T0)', factor: '×2', color: ED.series1, points: ECOLL_POINTS },
  { name: 'E_flow -> -1', law: '3/log N', factor: '÷3', color: ED.series7, points: EFLOW_POINTS },
  { name: 'sigma-share -> +1/2', law: '1/(2 ln N)', factor: '×2', color: ED.series5, points: SIGMA_POINTS },
];

function ClosingComparisonChart() {
  const svgW = 680;
  const svgH = 380;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allLnArg = SERIES.flatMap((s) => s.points.map((p) => p.lnArg));
  const allLogY = SERIES.flatMap((s) => s.points.map((p) => Math.log10(p.normResidual)));
  const xMin = Math.min(...allLnArg) * 0.95;
  const xMax = Math.max(...allLnArg) * 1.05;
  const yMin = Math.min(...allLogY) - 0.1;
  const yMax = Math.max(...allLogY) + 0.1;

  const xOf = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yOf = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const seriesPaths = SERIES.map((s) =>
    s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.lnArg)},${yOf(Math.log10(p.normResidual))}`).join(' '),
  );

  const REF_SAMPLES = 40;
  const refPath = Array.from({ length: REF_SAMPLES }, (_, i) => {
    const x = xMin + ((xMax - xMin) * i) / (REF_SAMPLES - 1);
    const y = -Math.log10(x);
    return `${i === 0 ? 'M' : 'L'}${xOf(x)},${yOf(y)}`;
  }).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={refPath} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5 4" />

      {seriesPaths.map((d, si) => (
        <path key={`s-${si}`} d={d} fill="none" stroke={SERIES[si].color} strokeWidth={2} />
      ))}
      {SERIES.map((s, si) =>
        s.points.map((p, i) => (
          <circle
            key={`s${si}-p${i}`}
            cx={xOf(p.lnArg)}
            cy={yOf(Math.log10(p.normResidual))}
            r={3.5}
            fill={s.color}
            stroke={ED.paper}
            strokeWidth={1}
          />
        )),
      )}

      {SERIES.map((s, si) => (
        <text key={`lbl-${si}`} x={padL} y={16 + si * 14} fill={s.color} fontSize={10}>
          {s.name} ({s.law}, rescale {s.factor})
        </text>
      ))}
      <text x={padL} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={10}>
        dashed grey: shared 1/ln(argument) reference envelope
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ln(argument): log T0(N) for E_coll, log N for E_flow, log N_mid for sigma-share
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        log10(rescaled residual)
      </text>
    </svg>
  );
}

export default function Imp35329ExponentDriftClosingComparisonViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three Logarithmically-Closing Exponent-Drift Ladders: Shared 1/log Envelope (imp-35329)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three unrelated frontier-direction ladders each measure a local-decay-exponent residual
        closing toward a different asymptote -- E_coll toward -1/2 (imp-35274/imp-35242), E_flow
        toward -1 (imp-35231/imp-35198), and the GUE-conditional share sigma toward +1/2
        (imp-35183) -- and each already has its own closing law with a known constant factor:
        1/(2 log T0), 3/log N, and 1/(2 ln N) respectively. Dividing out that constant collapses
        all three onto the same 1/ln(argument) shape, making the shared logarithmic closing rate
        visible on one chart instead of three separate single-series pages.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(rescaled residual) vs ln(argument): E_coll (blue), E_flow (pink), sigma-share
        (violet) vs the shared 1/ln(argument) reference (grey dashed)
      </p>
      <ClosingComparisonChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>series</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>closing law</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rescale</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ln(argument) range</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rescaled residual range</th>
          </tr>
        </thead>
        <tbody>
          {SERIES.map((s) => {
            const lnMin = Math.min(...s.points.map((p) => p.lnArg));
            const lnMax = Math.max(...s.points.map((p) => p.lnArg));
            const rMin = Math.min(...s.points.map((p) => p.normResidual));
            const rMax = Math.max(...s.points.map((p) => p.normResidual));
            return (
              <tr key={s.name} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
                <td style={{ padding: '0.4rem 0.6rem' }}>{s.name}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.law}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.factor}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                  [{lnMin.toFixed(1)}, {lnMax.toFixed(1)}]
                </td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                  [{rMin.toExponential(2)}, {rMax.toExponential(2)}]
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        All three residuals are already-established closing laws from their own tickets
        (imp-35242/imp-34130, imp-35198/imp-35135, imp-35036/imp-33582); this page performs no
        re-derivation, only a per-series rescale by the constant already present in each law
        ({SERIES.map((s) => s.factor).join(', ')}) so all three land on the same
        1/ln(argument) envelope for direct visual comparison. The three arguments differ slightly
        (log T0 vs log N vs log N_mid), reflecting each ticket's own inherited component model,
        not a claim that the three quantities are literally the same variable.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only consolidation of
        three already-certified conditional-share diagnostics on the inherited imp-3220/imp-3406
        component model; establishes no new numerical claim, no re-derivation, no operator
        positivity. C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; no RH verdict,
        NO QED.
      </div>
    </div>
  );
}
