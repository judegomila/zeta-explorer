import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY } from '../data/imp-33942-hump-argmax-gap-step-proportionality.js';

const { rungs, continuumArgmax, finding } = IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY;

// Log-log chart: measured gap vs step, against the step/2 envelope and the sawtooth prediction.
function GapVsStepChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const log10 = (v) => Math.log(v) / Math.LN10;
  const xs = rungs.map((r) => log10(r.step));
  const gapYs = rungs.map((r) => log10(r.gap));
  const envelopeYs = rungs.map((r) => log10(r.step / 2));
  const sawtoothYs = rungs.map((r) => log10(r.sawtoothPredicted));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const allYs = [...gapYs, ...envelopeYs, ...sawtoothYs];
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const gapPoints = rungs.map((r, i) => `${xAt(xs[i])},${yAt(gapYs[i])}`).join(' ');
  const envelopePoints = rungs.map((r, i) => `${xAt(xs[i])},${yAt(envelopeYs[i])}`).join(' ');
  const sawtoothPoints = rungs.map((r, i) => `${xAt(xs[i])},${yAt(sawtoothYs[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={envelopePoints} fill="none" stroke="#facc15" strokeWidth={1.5} strokeDasharray="6,3" />
      <polyline points={sawtoothPoints} fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="2,3" />
      <polyline points={gapPoints} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {rungs.map((r, i) => (
        <circle key={`pt-${r.step}`} cx={xAt(xs[i])} cy={yAt(gapYs[i])} r={3.5} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {rungs.map((r, i) => (
        <text key={`xt-${r.step}`} x={xAt(xs[i])} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {r.step < 0.01 ? r.step.toExponential(2) : r.step}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        step (log10 scale, grid steps 0.25..1/128)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(distance)
      </text>
      <text x={padL + 4} y={padT + 12} fill="#38bdf8" fontSize={9.5}>
        measured gap |argmaxK - k*|
      </text>
      <text x={padL + 4} y={padT + 26} fill="#facc15" fontSize={9.5}>
        step/2 envelope
      </text>
      <text x={padL + 4} y={padT + 40} fill="#a78bfa" fontSize={9.5}>
        sawtooth prediction min(frac,1-frac)*step
      </text>
    </svg>
  );
}

export default function Imp33994SawtoothGapVsStepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Hump-Argmax Sawtooth Gap vs Grid Step (imp-33942 / imp-33994)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33942 tested whether the imp-33878 hump-argmax grid-vs-continuum gap
        |argmaxK - k*| (k* = {continuumArgmax}) shrinks proportionally to the grid step,
        finding instead that it is a sawtooth residue: bounded by step/2 at every rung but not
        proportional to the step, since a step-halving can leave the gap unchanged whenever the
        same argmax grid point survives the refinement. The chart below plots the measured gap
        against both the step/2 envelope (yellow, dashed) and the closed-form sawtooth prediction
        min(frac,1-frac)*step (purple, dotted) on a log-log axis across the six-rung ladder
        (step 0.25 down to 1/128).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(gap) vs log10(step) -- measured gap, step/2 envelope, sawtooth prediction
      </p>
      <GapVsStepChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/reconciliation
        only, no proof, no fresh derivation. {finding.P1_gap_bounded_by_half_step}{' '}
        {finding.P2_gap_not_proportional_to_step} The sawtooth prediction reproduces the measured
        gap at every rung to less than 1e-3. imp-33878/imp-33905 untouched; C_mb GUE-conditional
        per imp-486 untouched; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
