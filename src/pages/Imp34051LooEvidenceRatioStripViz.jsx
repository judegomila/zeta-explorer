import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33985_LOO_MODEL_SELECTION_SENSITIVITY } from '../data/imp-33985-loo-model-selection-sensitivity.js';
import { ED } from '../styles/tokens.js';

const { folds: FOLDS, summary: SUM, fullSample: FULL } = IMP33985_LOO_MODEL_SELECTION_SENSITIVITY;

const MOST_INFLUENTIAL = FOLDS.find((f) => f.droppedKEnd === SUM.mostInfluentialDroppedKEnd);
const LEAST_INFLUENTIAL = FOLDS.find((f) => f.droppedKEnd === SUM.leastInfluentialDroppedKEnd);

// A lollipop strip across the 9 leave-one-out folds: x = dropped kEnd rung, y = Akaike evidence
// ratio (log form over linear) recomputed on the remaining 8 points. The dashed line marks the
// full-sample (all 9 points) ratio ~5.43 that every fold sits below.
function EvidenceRatioStrip() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const kEnds = FOLDS.map((f) => f.droppedKEnd);
  const minK = Math.min(...kEnds);
  const maxK = Math.max(...kEnds);

  const ratios = FOLDS.map((f) => f.evidenceRatio);
  const yMin = Math.min(...ratios, FULL.evidenceRatio) - 0.3;
  const yMax = Math.max(...ratios, FULL.evidenceRatio) + 0.3;

  const xOf = (k) => padL + ((k - minK) / (maxK - minK)) * plotW;
  const yOf = (r) => padT + plotH - ((r - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [4.0, 4.5, 5.0, 5.5].filter((t) => t >= yMin && t <= yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={`grid-${t}`}>
          <line x1={padL} y1={yOf(t)} x2={svgW - padR} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yOf(FULL.evidenceRatio)}
        x2={svgW - padR}
        y2={yOf(FULL.evidenceRatio)}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="5,4"
      />
      <text x={svgW - padR} y={yOf(FULL.evidenceRatio) - 6} textAnchor="end" fill={ED.brass} fontSize={9.5}>
        full-sample {FULL.evidenceRatio.toFixed(2)} : 1
      </text>

      {FOLDS.map((f) => {
        const x = xOf(f.droppedKEnd);
        const yTop = yOf(f.evidenceRatio);
        const yBase = yOf(yMin);
        const isMost = f.droppedKEnd === MOST_INFLUENTIAL.droppedKEnd;
        const isLeast = f.droppedKEnd === LEAST_INFLUENTIAL.droppedKEnd;
        const color = isMost ? ED.series2 : isLeast ? ED.series3 : ED.inkSoft;
        return (
          <g key={`fold-${f.droppedKEnd}`}>
            <line x1={x} y1={yBase} x2={x} y2={yTop} stroke={color} strokeWidth={1.5} opacity={0.65} />
            <circle cx={x} cy={yTop} r={isMost || isLeast ? 5 : 3.5} fill={color} />
            {(isMost || isLeast) && (
              <text x={x} y={yTop - 10} textAnchor="middle" fill={color} fontSize={9.5} fontWeight={700}>
                {f.evidenceRatio.toFixed(2)} : 1
              </text>
            )}
            <text x={x} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {f.droppedKEnd.toFixed(2)}
            </text>
          </g>
        );
      })}

      <text x={padL} y={svgH - 6} fill={ED.inkFaint} fontSize={9.5}>
        dropped kEnd (leave-one-out fold)
      </text>
    </svg>
  );
}

export default function Imp34051LooEvidenceRatioStripViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Leave-One-Out Evidence-Ratio Strip (imp-33985)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33941 favored the concave log form over the line for the imp-33917 endpoint peak by an
        Akaike evidence ratio of {FULL.evidenceRatio.toFixed(2)} : 1 on all 9 boundary windows. imp-33985
        re-scores that contrast in 9 leave-one-out folds -- dropping each window in turn and refitting
        both forms on the remaining 8 -- to test whether any single rung carries the decision. Every fold
        keeps the log form favored; the ratio never leaves the [{SUM.minEvidenceRatio.toFixed(2)},{' '}
        {SUM.maxEvidenceRatio.toFixed(2)}] : 1 band. Dropping the LOW boundary rung kEnd ={' '}
        {MOST_INFLUENTIAL.droppedKEnd} is the worst case ({MOST_INFLUENTIAL.evidenceRatio.toFixed(2)} : 1,
        red); dropping the HIGH boundary rung kEnd = {LEAST_INFLUENTIAL.droppedKEnd} barely moves it (
        {LEAST_INFLUENTIAL.evidenceRatio.toFixed(2)} : 1, green).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Akaike evidence ratio (log over linear) per leave-one-out fold, vs the full-sample {FULL.evidenceRatio.toFixed(2)} : 1 line
      </p>
      <EvidenceRatioStrip />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> leave-one-out sensitivity measurement
        only, no proof, no fresh derivation. {IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.finding.R3_low_boundary_rung_most_influential}{' '}
        Both forms are descriptive, not derived; the imp-33843 log-linear-vs-power-law FORM verdict is
        UNTOUCHED; C_mb GUE-conditional per imp-486 untouched; NO QED.
      </div>
    </div>
  );
}
