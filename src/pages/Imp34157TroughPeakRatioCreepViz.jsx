import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SurrogateDiagnosticCohortNote from '../components/SurrogateDiagnosticCohortNote.jsx';
import { IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE } from '../data/imp-34085-trough-peak-ratio-convergence.js';

const {
  ratioSequence: RATIO,
  ratioStepIncrements: RATIO_STEPS,
  argmaxSequence: PEAK,
  argminSequence: TROUGH,
  finding: FINDING,
} = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE;

// Primary chart: the |trough|/|peak| amplitude ratio across the five windows, annotated with the
// GROWING per-window-step increment (the signature that the ratio is not converging).
function RatioChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minRatio = 0.58;
  const maxRatio = 0.75;

  const xAt = (i) => padL + (i / (RATIO.length - 1)) * cW;
  const yAt = (r) => padT + cH - ((r - minRatio) / (maxRatio - minRatio)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={RATIO.map((w, i) => `${xAt(i)},${yAt(w.ratio)}`).join(' ')}
        fill="none"
        stroke="#f472b6"
        strokeWidth={1.75}
      />
      {RATIO.map((w, i) => (
        <circle key={w.window} cx={xAt(i)} cy={yAt(w.ratio)} r={4} fill="#f472b6" stroke="#0a0f1a" strokeWidth={1} />
      ))}
      {RATIO.map((w, i) => (
        <text key={`lbl-${w.window}`} x={xAt(i)} y={yAt(w.ratio) - 10} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
          {w.ratio.toFixed(4)}
        </text>
      ))}
      {RATIO_STEPS.map((step, i) => (
        <text
          key={`step-${i}`}
          x={(xAt(i) + xAt(i + 1)) / 2}
          y={(yAt(RATIO[i].ratio) + yAt(RATIO[i + 1].ratio)) / 2 - 10}
          textAnchor="middle"
          fill="#38bdf8"
          fontSize={9}
        >
          +{step.toFixed(4)}
        </text>
      ))}
      {RATIO.map((w, i) => (
        <text key={`win-${w.window}`} x={xAt(i)} y={svgH - padB + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
          {w.window}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        ladder window (fit boundary receding BASE k=11 .. EXT13 k=13)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        |trough| / |peak| amplitude ratio
      </text>
    </svg>
  );
}

// Secondary chart: the diverging peak (+) and trough (-) amplitude trajectories that drive the
// non-convergence -- peak growth decelerating while trough deepening stays near-steady.
function AmplitudeChart() {
  const svgW = 640;
  const svgH = 280;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minY = -0.4;
  const maxY = 0.5;

  const xAt = (i) => padL + (i / (PEAK.length - 1)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;
  const yZero = yAt(0);

  const series = [
    { data: PEAK, key: 'resid', color: '#facc15', label: 'endpoint peak (+), growth decelerating' },
    { data: TROUGH, key: 'resid', color: '#38bdf8', label: 'interior trough (-), deepening near-steady' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />
      {series.map((s) => (
        <polyline
          key={s.label}
          points={s.data.map((w, i) => `${xAt(i)},${yAt(w[s.key])}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={1.75}
        />
      ))}
      {series.map((s) =>
        s.data.map((w, i) => (
          <circle key={`${s.label}-${w.window}`} cx={xAt(i)} cy={yAt(w[s.key])} r={3.5} fill={s.color} />
        ))
      )}
      {PEAK.map((w, i) => (
        <text key={`win-${w.window}`} x={xAt(i)} y={svgH - padB + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
          {w.window}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        ladder window (fit boundary receding BASE k=11 .. EXT13 k=13)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        residual (signed)
      </text>
      {series.map((s, i) => (
        <text key={`legend-${s.label}`} x={padL + 4} y={padT + 12 + i * 14} fill={s.color} fontSize={9.5}>
          {s.label}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34157TroughPeakRatioCreepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Trough/Peak Amplitude-Ratio Non-Convergence Creep (imp-34085 / imp-34157)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34022 found the endpoint-peak / negative-trough amplitude ratio |trough|/|peak| of the
        imp-33843 log-linear re-fit near-constant (~0.6151 → 0.6293 → 0.6492) across the three imp-33810
        ladder windows BASE/EXT115/EXT12, only ~5.5% drift. imp-34085 extended the ladder two further
        quarter-decade steps (EXT125 k=6..12.5, EXT13 k=6..13) with the identical inherited sub-terms and
        found the ratio keeps rising to {RATIO[3].ratio.toFixed(4)} then {RATIO[4].ratio.toFixed(4)} — a
        ~17.1% total drift — with the per-window-step increment GROWING rather than shrinking, refuting
        the imp-34022 near-constant reading as a short-window artifact.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        amplitude ratio across the five windows, with per-step increments annotated
      </p>
      <RatioChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        the mechanism: endpoint-locked peak decelerates while the interior trough deepens near-steadily
      </p>
      <AmplitudeChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> {FINDING.R1_ratio_keeps_creeping_no_limit_visible}{' '}
        {FINDING.R2_mechanism_peak_decelerates_trough_near_steady} On an extended inherited ladder.{' '}
        <SurrogateDiagnosticCohortNote />
      </div>
    </div>
  );
}
