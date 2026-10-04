import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97553_STACK_POINTS,
  IMP97553_ANCHORS,
} from '../data/imp-97553-route-m-kappa-decomposition-viz-data.js';
import { KAPPA_ARITH, KAPPA_COT_LIMIT, KAPPA_LIMIT } from '../data/imp-97541-route-m-kappa-cot-extended-measurement.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97553: visualizes the imp-97541 kappa decomposition kappa(b) =
// kappa_arith + kappa_cot(b) as a stacked area across the 11-point
// b-ladder: a constant kappa_arith base plus a climbing kappa_cot(b) top
// layer, with the combined kappa(b) approaching ~0.6955 (~ memory ~0.696).

function StackPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const sorted = [...IMP97553_STACK_POINTS].sort((a, b) => a.logB - b.logB);
  const logBs = sorted.map((p) => p.logB);
  const xMin = Math.min(...logBs);
  const xMax = Math.max(...logBs);
  const yMin = 0;
  const yMax = Math.max(...sorted.map((p) => p.kappa)) * 1.08;

  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const arithPath = sorted.map((p) => `${xOf(p.logB)},${yOf(p.kappaArith)}`).join(' ');
  const kappaPath = sorted.map((p) => `${xOf(p.logB)},${yOf(p.kappa)}`).join(' ');

  // filled band between kappaArith (base) and kappa (top) -- the kappa_cot contribution.
  const bandPoints =
    sorted.map((p) => `${xOf(p.logB)},${yOf(p.kappa)}`).join(' ') +
    ' ' +
    [...sorted].reverse().map((p) => `${xOf(p.logB)},${yOf(p.kappaArith)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* kappa_cot(b) contribution band, between kappa_arith base and kappa(b) top */}
      <polygon points={bandPoints} fill={alpha(ED.series1, 0.18)} stroke="none" />

      {/* KAPPA_LIMIT reference line */}
      <line
        x1={padL}
        y1={yOf(KAPPA_LIMIT)}
        x2={padL + plotW}
        y2={yOf(KAPPA_LIMIT)}
        stroke={ED.series2}
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(KAPPA_LIMIT) - 4} textAnchor="end" fill={ED.series2} fontSize={8}>
        kappa limit ~ {KAPPA_LIMIT.toFixed(4)}
      </text>

      {/* kappa_arith constant base */}
      <polyline points={arithPath} fill="none" stroke={ED.series5} strokeWidth={1.6} strokeDasharray="2 2" />

      {/* combined kappa(b) top curve */}
      <polyline points={kappaPath} fill="none" stroke={ED.series3} strokeWidth={1.8} />

      {sorted.map((p) => (
        <circle key={`pt-${p.b}`} cx={xOf(p.logB)} cy={yOf(p.kappa)} r={3.2} fill={ED.series3} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {sorted.map((p) => (
        <text key={`x${p.b}`} x={xOf(p.logB)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {p.b}
        </text>
      ))}
      {[yMax, yMax / 2, 0].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(2)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        b (log scale); purple dashed: kappa_arith=0.5705 (constant); green: kappa(b)=kappa_arith+kappa_cot(b); blue band: kappa_cot(b) contribution
      </text>
    </svg>
  );
}

export default function Imp97553KappaDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97541: kappa = kappa_arith + kappa_cot(b) Decomposition" />

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
        chart reuses the imp-97541 11-point tabulation verbatim (stacked
        decomposition only, no new measurement). Presentation only;
        establishes no operator positivity; changes no bound; kappa stays
        MEASURED, not proved; PT Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route M first-moment coefficient kappa(b) decomposes exactly as
        kappa(b) = kappa_arith + kappa_cot(b), with kappa_arith ={' '}
        {KAPPA_ARITH.toFixed(10)} (exact, imp-97096) constant across b, and
        kappa_cot(b) climbing from {IMP97553_ANCHORS.first.kappaCot.toFixed(4)}{' '}
        at b={IMP97553_ANCHORS.first.b} toward its conjectural limit{' '}
        {KAPPA_COT_LIMIT} = 1/8 (imp-97541). The combined kappa(b) reaches{' '}
        {IMP97553_ANCHORS.last.kappa.toFixed(6)} at b={IMP97553_ANCHORS.last.b}
        , approaching the KAPPA_LIMIT ~{KAPPA_LIMIT.toFixed(4)} that matches
        the memory route_m_lower_companion figure ~0.696. The cotangent
        contribution never comes close to cancelling the dominant arithmetic
        part.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        stacked decomposition: kappa_arith (base) + kappa_cot(b) (band) = kappa(b)
      </h3>
      <StackPanel />

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
        only, consuming the imp-97541 ladder verbatim. Establishes no
        operator positivity; changes no bound; the varying-modulus
        Bettin-Conrey mean-value limit stays the separate open sub-gap; PT
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
