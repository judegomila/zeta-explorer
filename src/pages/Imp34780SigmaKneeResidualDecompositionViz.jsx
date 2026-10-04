import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION } from '../data/imp-34710-sigma-exponent-knee-residual-decomposition.js';
import { IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION } from '../data/imp-34756-sigma-knee-second-order-v-expansion.js';
import { ED } from '../styles/tokens.js';

const R = IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION;
const E = IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION;

const SECOND_ORDER_TIGHTENING = Math.abs(E.residualBudget.firstOrderSelfConsistentToExactFLog10)
  - Math.abs(E.residualBudget.secondOrderSelfConsistentToExactFLog10);
const FD_FLOOR = Math.abs(E.residualBudget.thirdSourceFiniteDifferenceLog10);
const EFLOW_PART = Math.abs(R.residualBudget.droppedEflowPartLog10);

// -- three-way residual budget: the dropped E_flow term (~99% of the ~7.4e-3 dex gap) dwarfs both the
// second-order v-expansion tightening and the finite-difference floor that remain inside the ~1% balance. --
function ResidualBudgetChart() {
  const rows = [
    { label: 'Dropped E_flow term (imp-34710 F1)', value: EFLOW_PART, color: ED.series2 },
    { label: '2nd-order v-expansion tightening (imp-34756 F2)', value: SECOND_ORDER_TIGHTENING, color: ED.series1 },
    { label: 'Finite-difference floor (imp-34756 F3)', value: FD_FLOOR, color: ED.series5 },
  ];
  const svgW = 660;
  const padL = 260;
  const padR = 60;
  const barH = 22;
  const rowGap = 20;
  const svgH = rows.length * (barH + rowGap) + 20;
  const cW = svgW - padL - padR;

  const logs = rows.map((r) => Math.log10(r.value));
  const scaleMin = Math.min(...logs) - 0.4;
  const scaleMax = Math.max(...logs) + 0.4;
  const xOf = (v) => ((Math.log10(v) - scaleMin) / (scaleMax - scaleMin)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const y = 10 + i * (barH + rowGap);
        return (
          <g key={r.label}>
            <text x={padL - 10} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {r.label}
            </text>
            <rect x={padL} y={y} width={cW} height={barH} fill="none" stroke={ED.rule} strokeWidth={1} />
            <rect x={padL} y={y} width={Math.max(xOf(r.value), 2)} height={barH} fill={r.color} />
            <text x={padL + xOf(r.value) + 8} y={y + barH / 2 + 4} fill={r.color} fontSize={11}>
              {r.value.toExponential(2)} dex
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// -- knee ladder: as expansion order and self-consistency are added, the no-E_flow analytic knee
// converges toward the direct no-E_flow root-find, but the TRUE (E_flow-kept) knee sits far below all
// of them -- the residual lives in the omitted term, not the expansion order. --
function KneeLadderChart() {
  const points = [
    { label: 'crossover u=0', value: E.kneeLadder.log10Ncross, color: ED.inkFaint },
    { label: 'TRUE knee (E_flow kept)', value: R.directRootFind.log10NstarWithEflow, color: ED.series2 },
    { label: '1st-order @ crossover', value: E.kneeLadder.log10Nstar1stOrderAtCross, color: ED.inkSoft },
    { label: '2nd-order @ crossover', value: E.kneeLadder.log10Nstar2ndOrderAtCross, color: ED.inkSoft },
    { label: '1st-order self-consistent', value: E.kneeLadder.log10Nstar1stOrderSelfConsistent, color: ED.brass },
    { label: 'exact-F (all orders)', value: E.kneeLadder.log10NstarExactF, color: ED.series5 },
    { label: '2nd-order self-consistent', value: E.kneeLadder.log10Nstar2ndOrderSelfConsistent, color: ED.series1 },
    { label: 'direct no-E_flow root-find', value: E.kneeLadder.log10NstarDirectNoEflow, color: ED.series3 },
  ];
  const svgW = 660;
  const padL = 20;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const rowH = 26;
  const svgH = points.length * rowH + padT + padB;

  const values = points.map((p) => p.value);
  const vMin = Math.min(...values) - 0.003;
  const vMax = Math.max(...values) + 0.003;
  const xOf = (v) => padL + ((v - vMin) / (vMax - vMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={padL + plotW} y1={svgH - padB} y2={svgH - padB} stroke={ED.rule} strokeWidth={1} />
      {points.map((p, i) => {
        const y = padT + i * rowH + rowH / 2;
        const x = xOf(p.value);
        return (
          <g key={p.label}>
            <line x1={padL} x2={padL + plotW} y1={y} y2={y} stroke={ED.ruleSoft} strokeWidth={1} />
            <circle cx={x} cy={y} r={5} fill={p.color} />
            <text x={padL} y={y - 8} fill={ED.inkSoft} fontSize={10}>
              {p.label}
            </text>
            <text x={x} y={y + 18} textAnchor="middle" fill={p.color} fontSize={10}>
              {p.value.toFixed(6)}
            </text>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N* (knee location)
      </text>
    </svg>
  );
}

export default function Imp34780SigmaKneeResidualDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma Exponent-Knee Residual Decomposition (imp-34780 / imp-34710 / imp-34756)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34694 left a ~7.4e-3 dex gap between the DIRECT root-find of the sigma(N) decay-exponent knee
        (E_flow kept, log10 N* = {R.directRootFind.log10NstarWithEflow}) and an ANALYTIC first-correction
        closed form (E_flow dropped). imp-34710 found the gap is ~{R.residualBudget.eflowSharePercent}%
        the dropped E_flow term, and imp-34756 restored a second slowly-varying-v order to show the
        remaining ~1% balance is dominated by finite-difference discretization rather than a missing
        expansion order.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Residual budget (log10 dex, log scale)
      </p>
      <ResidualBudgetChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Knee-location ladder: convergence of the no-E_flow analytic route vs the true (E_flow-kept) knee
      </p>
      <KneeLadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>component</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value (dex)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>share of ~7.4e-3 gap</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>Dropped E_flow term</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{EFLOW_PART.toExponential(3)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>~{R.residualBudget.eflowSharePercent}%</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>2nd-order v-expansion tightening</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{SECOND_ORDER_TIGHTENING.toExponential(3)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&lt;1%</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>Finite-difference floor</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{FD_FLOOR.toExponential(3)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&lt;1%</td>
          </tr>
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
        The dropped E_flow term accounts for ~{R.residualBudget.eflowSharePercent}% of the ~7.4e-3 dex gap;
        the remaining ~1% balance is split between a genuine (but tiny) second-order v-expansion tightening
        and a finite-difference discretization floor of comparable size, so no further expansion order
        would close it (imp-34756 F3).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34710
        and imp-34756 literals verbatim (no new computation). This is a conditional-share diagnostic on the
        INHERITED imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic, and NOT an RH bound. The C_mb
        GUE-conditional share per imp-486 is UNTOUCHED; far-tail exponent stays 1/2 (imp-3463); no operator
        positivity established; no RH verdict, NO QED.
      </div>
    </div>
  );
}
