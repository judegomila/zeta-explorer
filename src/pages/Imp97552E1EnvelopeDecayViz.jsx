import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP97552_LOG_POINTS, IMP97552_ANCHORS } from '../data/imp-97552-e1-envelope-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97552: visualizes the imp-97539 tabulation of ratio(b) = |E1(b)|/(phi(b) b)
// (the imp-97516 STEP 3 sub-leading L1 remainder decay) against the analytic
// envelope env(b) = log b log log b / b, on a log-log scale across the
// 12-point b-ladder. ratio(b) sits under env(b) at every point.

const FAMILY_COLOR = {
  primorial: ED.series1,
  prime: ED.series4,
  squarefree: ED.series5,
};

function DecayPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logBs = IMP97552_LOG_POINTS.map((p) => p.logB);
  const logRatios = IMP97552_LOG_POINTS.map((p) => p.logRatio);
  const logEnvs = IMP97552_LOG_POINTS.map((p) => p.logEnv);

  const xMin = Math.min(...logBs);
  const xMax = Math.max(...logBs);
  const yMin = Math.min(...logRatios, ...logEnvs);
  const yMax = Math.max(...logRatios, ...logEnvs);
  const yPad = (yMax - yMin) * 0.08;

  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - (yMin - yPad)) / (yMax + yPad - (yMin - yPad))) * plotH;

  const sorted = [...IMP97552_LOG_POINTS].sort((a, b) => a.logB - b.logB);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* env(b) envelope curve */}
      <polyline
        points={sorted.map((p) => `${xOf(p.logB)},${yOf(p.logEnv)}`).join(' ')}
        fill="none"
        stroke={ED.series2}
        strokeWidth={1.8}
        strokeDasharray="5 3"
      />

      {/* ratio(b) measured curve */}
      <polyline
        points={sorted.map((p) => `${xOf(p.logB)},${yOf(p.logRatio)}`).join(' ')}
        fill="none"
        stroke={ED.series3}
        strokeWidth={1.6}
      />

      {/* measured points, colored by family */}
      {IMP97552_LOG_POINTS.map((p) => (
        <circle
          key={`pt-${p.b}`}
          cx={xOf(p.logB)}
          cy={yOf(p.logRatio)}
          r={3.4}
          fill={FAMILY_COLOR[p.family] || '#94a3b8'}
        />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {sorted.map((p) => (
        <text key={`x${p.b}`} x={xOf(p.logB)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {p.b}
        </text>
      ))}
      {[yMax, (yMax + yMin) / 2, yMin].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(1)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        log10(b) &mdash; green: log10 ratio(b)=|E1|/(phi b); red dashed: log10 env(b)=log b log log b / b; dots: primorial / prime / squarefree families
      </text>
    </svg>
  );
}

export default function Imp97552E1EnvelopeDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97539: E1(b)/(phi(b) b) Decay vs the Analytic Envelope" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-3) 6%, transparent)',
          borderLeft: '3px solid var(--series-3)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-3)' }}>Honest status:</strong> this
        chart reuses the imp-97539 12-point tabulation verbatim (log-log
        transform only, no new measurement). Presentation only; establishes
        no operator positivity; changes no bound; kappa_arith =
        0.5704960511 unchanged; PT Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        E1(b) = L1(b) &minus; phi(b) b((1/2) log b &minus; 1/4) is the
        sub-leading remainder of the coprime sum L1(b) (imp-97290). The
        ratio(b) = |E1(b)| / (phi(b) b) decays from{' '}
        {IMP97552_ANCHORS.b211Ratio.toExponential(2)} at b=211 to{' '}
        {IMP97552_ANCHORS.b30011Ratio.toExponential(2)} at b=30011 (a ~141x
        drop over a ~142x b growth, i.e. ~1/b), and sits under the analytic
        envelope env(b) = log b log log b / b (from the Landau minimal order
        phi(b)/b &ge; c/log log b) at every ladder point, confirming
        |E1(b)| = o(phi(b) b) quantitatively.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log-log: ratio(b) vs env(b)
      </h3>
      <DecayPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97539 ladder verbatim. Establishes no
        operator positivity; changes no bound; cotangent first moment
        (imp-97097) stays the separate open leaf; PT Lambda&le;0.2 remains
        SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
