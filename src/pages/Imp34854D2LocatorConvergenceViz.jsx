import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR } from '../data/imp-34820-sigmoid-inflection-d2-closed-form-locator.js';
import { ED } from '../styles/tokens.js';

const D = IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR;

// -- log-log panel: D2-identity relResid vs step h, with an O(h^2) reference slope. --
function LogLogResidualPanel({ table, meanHalvingRatio }) {
  const svgW = 660;
  const padL = 64;
  const padR = 30;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = plotH + padT + padB;

  const logH = table.map((r) => Math.log10(r.h));
  const logR = table.map((r) => Math.log10(r.relResid));
  const minLogH = Math.min(...logH);
  const maxLogH = Math.max(...logH);
  const minLogR = Math.min(...logR);
  const maxLogR = Math.max(...logR);

  const xOf = (lh) => padL + ((lh - minLogH) / (maxLogH - minLogH || 1)) * plotW;
  const yOf = (lr) => padT + ((maxLogR - lr) / (maxLogR - minLogR || 1)) * plotH;

  const points = table.map((r, i) => `${xOf(logH[i])},${yOf(logR[i])}`).join(' ');

  // O(h^2) reference line anchored at the first point, slope = 2 in log-log space.
  const refX0 = logH[0];
  const refY0 = logR[0];
  const refPoints = table
    .map((r, i) => {
      const dLogH = logH[i] - refX0;
      const refLogR = refY0 + 2 * dLogH;
      return `${xOf(logH[i])},${yOf(refLogR)}`;
    })
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={svgW - padR} y1={padT + plotH} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <polyline points={refPoints} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5,4" />
      <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={2.25} />
      {table.map((r, i) => (
        <g key={r.h}>
          <circle cx={xOf(logH[i])} cy={yOf(logR[i])} r={4.5} fill={ED.series1} />
          <text
            x={xOf(logH[i])}
            y={yOf(logR[i]) - 10}
            textAnchor="middle"
            fill={ED.series1}
            fontSize={10}
            fontFamily="monospace"
          >
            {r.relResid.toExponential(2)}
          </text>
          <text
            x={xOf(logH[i])}
            y={padT + plotH + 16}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={11}
            fontFamily="monospace"
          >
            h={r.h.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        D2-identity relative residual vs step h, log-log -- dashed line is the O(h^2) reference slope (mean
        halving ratio {meanHalvingRatio.toFixed(2)})
      </text>
    </svg>
  );
}

// -- landmark strip: sigmoid inflection and sigma-KNEE on a shared log10 N* axis. --
function LandmarkStrip({ inflection, knee, gapDex }) {
  const svgW = 660;
  const padL = 40;
  const padR = 40;
  const svgH = 120;
  const y = 60;
  const plotW = svgW - padL - padR;

  const lo = inflection.log10Nstar - 0.006;
  const hi = knee.log10Nstar + 0.006;
  const xOf = (v) => padL + ((v - lo) / (hi - lo)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={svgW - padR} y1={y} y2={y} stroke={ED.rule} strokeWidth={1.5} />
      <circle cx={xOf(inflection.log10Nstar)} cy={y} r={6} fill={ED.series5} />
      <text x={xOf(inflection.log10Nstar)} y={y - 14} textAnchor="middle" fill={ED.series5} fontSize={11} fontFamily="monospace">
        sigmoid inflection
      </text>
      <text x={xOf(inflection.log10Nstar)} y={y + 24} textAnchor="middle" fill={ED.series5} fontSize={10} fontFamily="monospace">
        log10 N* = {inflection.log10Nstar.toFixed(5)}
      </text>
      <circle cx={xOf(knee.log10Nstar)} cy={y} r={6} fill={ED.series1} />
      <text x={xOf(knee.log10Nstar)} y={y - 14} textAnchor="middle" fill={ED.series1} fontSize={11} fontFamily="monospace">
        sigma-KNEE
      </text>
      <text x={xOf(knee.log10Nstar)} y={y + 24} textAnchor="middle" fill={ED.series1} fontSize={10} fontFamily="monospace">
        log10 N* = {knee.log10Nstar.toFixed(5)}
      </text>
      <line
        x1={xOf(inflection.log10Nstar)}
        x2={xOf(knee.log10Nstar)}
        y1={y + 40}
        y2={y + 40}
        stroke={ED.rule}
        strokeWidth={1}
      />
      <text x={(xOf(inflection.log10Nstar) + xOf(knee.log10Nstar)) / 2} y={y + 54} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ~{gapDex.toExponential(2)} dex separation -- distinct landmarks
      </text>
    </svg>
  );
}

export default function Imp34854D2LocatorConvergenceViz() {
  const { landmarks, scaling, pointwiseIdentity } = D;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sibling Second-Order D2-Locator Convergence (imp-34854 / imp-34820)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34820 found that the closed-form sigmoid-inflection condition (1-2S) u_prime^2 + u_secondDeriv = 0
        matches the independent finite-difference sigma_secondDeriv against the identity
        S(1-S)[(1-2S) u_prime^2 + u_secondDeriv] to {pointwiseIdentity.maxRelResid.toExponential(2)} relative at
        h = {pointwiseIdentity.stepH.toExponential(0)}, and that halving h quarters the residual -- clean O(h^2)
        with no h-independent floor, confirming exact algebra rather than a fortuitous match.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        D2-identity residual vs step h (log-log)
      </p>
      <LogLogResidualPanel table={scaling.table} meanHalvingRatio={scaling.meanHalvingRatio} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Landmark separation: sigmoid inflection vs sigma-KNEE
      </p>
      <LandmarkStrip
        inflection={landmarks.sigmoidInflection}
        knee={landmarks.sigmaKnee}
        gapDex={landmarks.kneeMinusInflectionDex}
      />

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
        The closed-form D2 root lands on the independent finite-difference sigmoid inflection to{' '}
        {landmarks.closedFormVsFiniteDifferenceSep.toExponential(2)} -- removing the finite-difference floor --
        while staying a distinct landmark from the imp-34796 third-order sigma-KNEE identity, whose root sits{' '}
        {landmarks.kneeMinusInflectionDex.toExponential(2)} dex above it.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34820
        literals verbatim (no new computation). Component model is the inherited imp-3220/imp-3406 surrogate
        crossover map, NOT a rigorous asymptotic; the imp-34796/imp-34820 E_flow-reinstatement sub-gap REMAINS
        OPEN. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
