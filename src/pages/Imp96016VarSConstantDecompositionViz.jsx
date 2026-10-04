import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95984_FUJII_VARS_CONSTANT_LITERATURE_LOCATE } from '../data/imp-95984-fujii-varS-constant-literature-locate.js';
import { ED } from '../styles/tokens.js';

// horizontal range-bar panel: fixed arithmetic core vs the wide I_F RH bracket, plus the
// conjectural I_F = 1 point, stacked so both rows read on the same b = I_F + bDiag axis.
function ConstantStackPanel({ data }) {
  const { decomposition, unavailableTerm, bValues } = data;
  const svgW = 640;
  const svgH = 190;
  const padL = 190;
  const padR = 30;
  const padT = 24;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 0;
  const maxX = 2.6;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;

  const rowH = 34;
  const row1Y = padT + 12;
  const row2Y = row1Y + rowH + 22;

  const [ifLower, ifUpper] = unavailableTerm.rigorousBracketRH;
  const ifConj = unavailableTerm.conjecturalValue;
  const bDiag = decomposition.bDiag;
  const [bLower, bUpper] = bValues.rigorousRange;
  const bConj = bValues.conjectural;

  const xTicks = [0, 0.5, 1, 1.5, 2, 2.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line
            x1={xOf(v)}
            y1={padT + plotH}
            x2={xOf(v)}
            y2={padT + plotH + 4}
            stroke={ED.rule}
            strokeWidth={1}
          />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        value
      </text>

      {/* row 1: fixed arithmetic core b_diag = M + P2, pinned to O(1e-12) */}
      <text x={padL - 8} y={row1Y + 10} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
        arithmetic core
      </text>
      <text x={padL - 8} y={row1Y + 21} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        b_diag = M + P2 (fixed)
      </text>
      <rect x={xOf(0)} y={row1Y} width={xOf(bDiag) - xOf(0)} height={16} fill={ED.series1} />
      <text x={xOf(bDiag) + 4} y={row1Y + 12} fill={ED.series1} fontSize={9}>
        {bDiag.toFixed(6)}
      </text>

      {/* row 2: I_F rigorous RH bracket (2/3-eps, 2), wide, plus conjectural point at 1 */}
      <text x={padL - 8} y={row2Y + 10} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
        I_F (pair-correlation)
      </text>
      <text x={padL - 8} y={row2Y + 21} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        rigorous RH bracket
      </text>
      <rect
        x={xOf(ifLower)}
        y={row2Y}
        width={xOf(ifUpper) - xOf(ifLower)}
        height={16}
        fill={ED.series2}
        opacity={0.35}
        stroke={ED.series2}
        strokeWidth={1}
      />
      <line
        x1={xOf(ifConj)}
        y1={row2Y - 6}
        x2={xOf(ifConj)}
        y2={row2Y + 22}
        stroke={ED.brassDeco}
        strokeWidth={2}
        strokeDasharray="3 2"
      />
      <text x={xOf(ifConj)} y={row2Y - 9} textAnchor="middle" fill={ED.brass} fontSize={9}>
        I_F=1 (conjectural)
      </text>
      <text x={xOf(ifLower)} y={row2Y + 28} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        {ifLower.toFixed(3)}
      </text>
      <text x={xOf(ifUpper)} y={row2Y + 28} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        {ifUpper.toFixed(3)}
      </text>

      {/* resulting b = I_F + b_diag range, drawn as a thin marker row under the axis label */}
      <text x={padL - 8} y={padT - 8} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        b = I_F + b_diag range: [{bLower.toFixed(4)}, {bUpper.toFixed(4)}], conj. {bConj.toFixed(4)}
      </text>
    </svg>
  );
}

// number-line panel comparing the induced a_0 at the conjectural I_F=1 pin against the
// imp-95940 empirical mean from six accessible heights.
function A0RangePanel({ data }) {
  const { bValues } = data;
  const svgW = 640;
  const svgH = 110;
  const padL = 40;
  const padR = 40;
  const padT = 30;
  const padB = 34;
  const plotW = svgW - padL - padR;

  const a0Conj = bValues.a0Conjectural;
  const a0Emp = bValues.a0EmpiricalMean;
  const minX = Math.min(a0Conj, a0Emp) - 0.02;
  const maxX = Math.max(a0Conj, a0Emp) + 0.02;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const axisY = padT + 20;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + plotW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />
      <circle cx={xOf(a0Conj)} cy={axisY} r={5} fill={ED.brassDeco} />
      <text x={xOf(a0Conj)} y={axisY - 12} textAnchor="middle" fill={ED.brass} fontSize={9.5}>
        a_0 = {a0Conj.toFixed(6)} (published, I_F=1)
      </text>
      <circle cx={xOf(a0Emp)} cy={axisY} r={5} fill={ED.series5} />
      <text x={xOf(a0Emp)} y={axisY + 24} textAnchor="middle" fill={ED.series5} fontSize={9.5}>
        a_0 = {a0Emp.toFixed(3)} (imp-95940 empirical mean)
      </text>
    </svg>
  );
}

export default function Imp96016VarSConstantDecompositionViz() {
  const data = IMP95984_FUJII_VARS_CONSTANT_LITERATURE_LOCATE;
  const { decomposition, unavailableTerm } = data;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-95984: Var S(T) Constant Stack b = I_F + M + P2" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a presentation-only plot of
        the imp-95984 literature-located decomposition. It changes no Lambda bound and establishes
        no operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art.
        Catalan G irrationality stays OPEN; Sun arXiv:2609.04176 is single-author and unrefereed.
        RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Chan (arXiv:math/0305339, Thm 1.1, refining Goldston 1987 via Montgomery pair correlation)
        gives the Var S(T) additive constant as b = I_F + M + P2. The arithmetic core b_diag = M + P2
        = {decomposition.bDiag.toFixed(6)} is pinned to O(1e&minus;12); the only unpinned term is the
        pair-correlation integral I_F, rigorously bracketed only in (
        {unavailableTerm.rigorousBracketRH[0].toFixed(3)}, {unavailableTerm.rigorousBracketRH[1]}) under
        RH &mdash; a spread of {unavailableTerm.toleranceMultiple.toFixed(0)}&times; the O(0.01)
        tolerance the imp-95940 crossing-height range would need.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Constant stack: fixed arithmetic core vs the I_F RH bracket
      </h3>
      <ConstantStackPanel data={data} />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Induced a_0 = b &minus; &gamma; &minus; 1: published vs empirical
      </h3>
      <A0RangePanel data={data} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top bar is thin and
        fixed (the arithmetic core is pinned exactly); the bottom bar is wide (the I_F pair-
        correlation integral is only bracketed under RH). The conjectural I_F = 1 point (Montgomery
        pair correlation, F(&alpha;)&rarr;1) sits inside that bracket but is not rigorous. The
        induced published a_0 at I_F = 1 differs from the imp-95940 six-height empirical mean by
        about {Math.abs(data.bValues.a0Conjectural - data.bValues.a0EmpiricalMean).toFixed(3)},
        consistent with the imp-95940 crossing range not collapsing.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-95984
        baked literature-located literals verbatim (no re-derivation). Changes no bound,
        establishes no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
