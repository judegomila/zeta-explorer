import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT } from '../data/imp-34043-endpoint-peak-saturating-model-tournament.js';
import { ED } from '../styles/tokens.js';

const { linearFit: LIN, logFit: LOG, powerLawFit: POW, saturatingFit: SAT, selection: SEL, reconciliation: REC } =
  IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT;

const MODELS = [
  { key: 'lin', label: 'linear', color: ED.inkFaint, fit: LIN, weight: SEL.akaikeWeights.lin },
  { key: 'log', label: 'log (imp-33982 winner)', color: ED.brass, fit: LOG, weight: SEL.akaikeWeights.log },
  { key: 'pow', label: 'power law (last)', color: ED.series2, fit: POW, weight: SEL.akaikeWeights.pow },
  { key: 'sat', label: 'saturating (new winner)', color: ED.series3, fit: SAT, weight: SEL.akaikeWeights.sat },
];

// Two paired bar rows: AIC (lower is better) and Akaike weight (higher is better) for the
// four-way linear / concave-log / power-law / saturating tournament on the imp-33917 endpoint peaks.
function ModelTournamentBars() {
  const svgW = 640;
  const svgH = 380;
  const padL = 132;
  const padR = 56;
  const rowH = 56;
  const barH = 26;

  const aics = MODELS.map((m) => m.fit.aic);
  const minAic = Math.min(...aics);
  const maxAic = Math.max(...aics);
  const aicSpan = maxAic - minAic || 1;
  const aicW = svgW - padL - padR;

  const weightW = svgW - padL - padR;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={16} fill={ED.inkSoft} fontSize={10.5} fontWeight={700}>
        AIC (lower wins)
      </text>
      {MODELS.map((m, i) => {
        const y = 26 + i * rowH;
        const w = Math.max(4, ((m.fit.aic - minAic + aicSpan * 0.06) / (aicSpan * 1.12)) * aicW);
        return (
          <g key={`aic-${m.key}`}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {m.label}
            </text>
            <rect x={padL} y={y} width={w} height={barH} fill={m.color} opacity={0.85} rx={3} />
            <text x={padL + w + 6} y={y + barH / 2 + 4} fill={ED.ink} fontSize={10}>
              {m.fit.aic.toFixed(2)}
            </text>
          </g>
        );
      })}

      <text x={padL} y={26 + 4 * rowH + 16} fill={ED.inkSoft} fontSize={10.5} fontWeight={700}>
        four-way Akaike weight (higher wins, sums to 1)
      </text>
      {MODELS.map((m, i) => {
        const y = 26 + 4 * rowH + 26 + i * rowH;
        const w = Math.max(3, m.weight * weightW);
        return (
          <g key={`w-${m.key}`}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {m.label}
            </text>
            <rect x={padL} y={y} width={w} height={barH} fill={m.color} opacity={0.85} rx={3} />
            <text x={padL + w + 6} y={y + barH / 2 + 4} fill={ED.ink} fontSize={10}>
              w = {m.weight.toFixed(3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34120EndpointPeakSaturatingTournamentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Endpoint-Peak Four-Way Model Tournament, Saturating Form Admitted (imp-34043)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33982 scored linear / concave-log / power-law forms on the 9 imp-33917 endpoint peaks and
        the concave log form won (w~{LOG.akaikeWeight.toFixed(3)}), but imp-33917 read the peak as NOT
        saturating -- so a bounded/saturating family approaching a cap was never admitted. imp-34043
        adds a fourth candidate, peak = a - b/kEnd, and re-scores all four on the identical 9 peaks:
        the saturating form WINS (w~{SAT.akaikeWeight.toFixed(3)}) and dethrones the log form into
        second, but only by a positive-not-decisive margin ({'Δ'}AIC={SEL.deltaAIC_log_minus_sat}),
        and its fitted cap ({REC.fittedCap}) sits ~{REC.capOverMaxPeak}x above the largest observed peak
        ({REC.maxObservedPeak}) -- so the win reflects concavity-matching, not confirmed saturation.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        AIC and Akaike-weight bars -- linear vs concave-log vs power-law vs saturating fits of the 9 imp-33917 peaks
      </p>
      <ModelTournamentBars />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / model-selection
        only, no proof, no fresh derivation. {REC.note} The component model is the inherited
        imp-3220/imp-3406 extrapolation; the imp-33843 log-linear-vs-power-law FORM verdict is
        untouched; imp-3066 K_a&gt;=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED.
      </div>
    </div>
  );
}
