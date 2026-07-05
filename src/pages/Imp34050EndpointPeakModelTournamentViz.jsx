import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION } from '../data/imp-33982-endpoint-peak-power-law-model-selection.js';

const { linearFit: LIN, logFit: LOG, powerLawFit: POW, selection: SEL } =
  IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION;

const MODELS = [
  { key: 'lin', label: 'linear', color: '#64748b', fit: LIN, weight: SEL.akaikeWeights.lin },
  { key: 'log', label: 'log (winner)', color: '#facc15', fit: LOG, weight: SEL.akaikeWeights.log },
  { key: 'pow', label: 'power law (last)', color: '#f87171', fit: POW, weight: SEL.akaikeWeights.pow },
];

// Two paired bar rows: AIC (lower is better) and Akaike weight (higher is better) for the
// three-way linear / concave-log / power-law tournament scored on the imp-33917 endpoint peaks.
function ModelTournamentBars() {
  const svgW = 640;
  const svgH = 300;
  const padL = 96;
  const padR = 56;
  const rowH = 64;
  const gapY = 30;
  const barH = 30;

  const aics = MODELS.map((m) => m.fit.aic);
  const minAic = Math.min(...aics);
  const maxAic = Math.max(...aics);
  const aicSpan = maxAic - minAic || 1;
  const aicW = svgW - padL - padR;

  const weightW = svgW - padL - padR;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={16} fill="#94a3b8" fontSize={10.5} fontWeight={700}>
        AIC (lower wins)
      </text>
      {MODELS.map((m, i) => {
        const y = 26 + i * rowH;
        const w = Math.max(4, ((m.fit.aic - minAic + aicSpan * 0.06) / (aicSpan * 1.12)) * aicW);
        return (
          <g key={`aic-${m.key}`}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {m.label}
            </text>
            <rect x={padL} y={y} width={w} height={barH} fill={m.color} opacity={0.85} rx={3} />
            <text x={padL + w + 6} y={y + barH / 2 + 4} fill="#cbd5e1" fontSize={10}>
              {m.fit.aic.toFixed(2)}
            </text>
          </g>
        );
      })}

      <text x={padL} y={26 + 3 * rowH + 16} fill="#94a3b8" fontSize={10.5} fontWeight={700}>
        three-way Akaike weight (higher wins, sums to 1)
      </text>
      {MODELS.map((m, i) => {
        const y = 26 + 3 * rowH + 26 + i * rowH;
        const w = Math.max(3, m.weight * weightW);
        return (
          <g key={`w-${m.key}`}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {m.label}
            </text>
            <rect x={padL} y={y} width={w} height={barH} fill={m.color} opacity={0.85} rx={3} />
            <text x={padL + w + 6} y={y + barH / 2 + 4} fill="#cbd5e1" fontSize={10}>
              w = {m.weight.toFixed(3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34050EndpointPeakModelTournamentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Endpoint-Peak Three-Way Model Tournament (imp-33982)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33941 selected the concave log form over a straight line for the imp-33917 endpoint
        peak by AIC/BIC/AICc, but scored only those two forms. imp-33982 admits a third, genuinely
        curved candidate -- the power law peak = a*kEnd^b -- and re-scores all three on the
        identical 9 endpoint peaks. The bars below show the AIC of each form (lower wins) and the
        resulting three-way Akaike weight: the log form keeps the lowest AIC and the top weight
        (w~{LOG.akaikeWeight.toFixed(3)}), while the power law lands last (w~{POW.akaikeWeight.toFixed(3)}),
        worse than even the straight line.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        AIC and Akaike-weight bars -- linear vs concave-log vs power-law fits of the 9 imp-33917 peaks
      </p>
      <ModelTournamentBars />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement / model-selection
        only, no proof, no fresh derivation. {IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.finding.R3_verdict_and_caveat}{' '}
        The component model is the inherited imp-3220/imp-3406 extrapolation; the power law is fit
        by log-log OLS (a log-space, not response-space, optimum); C_mb GUE-conditional per imp-486
        untouched; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
