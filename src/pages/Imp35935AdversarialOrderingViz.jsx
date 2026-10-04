import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35935_ORDERINGS,
  IMP35935_CEILINGS,
  IMP35935_SUMMARY,
} from '../data/imp-35935-adversarial-ordering-viz-data.js';
import { ED } from '../styles/tokens.js';

const NAIVE_COLOR = ED.series2;
const PAIRWISE_COLOR = ED.series1;
const KAHAN_COLOR = ED.series3;

function OrderingBarChart() {
  const w = 680;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 50;
  const plotW = w - padL - padR;
  const plotH = 300;
  const h = padT + plotH + padB;

  const log10 = Math.log10;
  const yMin = -20; // log10(normalized error), lower bound
  const yMax = -9; // log10(normalized error), upper bound (above the naive coherent ceiling)
  const yOf = (v) => padT + plotH - ((log10(v) - yMin) / (yMax - yMin)) * plotH;

  const groupW = plotW / IMP35935_ORDERINGS.length;
  const barW = 12;
  const xOfGroup = (i) => padL + groupW * i + groupW / 2;

  const yTicks = [-9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        normalized summation error by worst-case ordering (log scale)
      </text>

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(10 ** v)} x2={padL + plotW} y2={yOf(10 ** v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yOf(10 ** v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}

      {/* ceiling reference lines */}
      <line
        x1={padL}
        y1={yOf(IMP35935_CEILINGS.naiveCoherentLinear)}
        x2={padL + plotW}
        y2={yOf(IMP35935_CEILINGS.naiveCoherentLinear)}
        stroke={NAIVE_COLOR}
        strokeDasharray="4 3"
        strokeWidth={1.25}
      />
      <line
        x1={padL}
        y1={yOf(IMP35935_CEILINGS.pairwise)}
        x2={padL + plotW}
        y2={yOf(IMP35935_CEILINGS.pairwise)}
        stroke={PAIRWISE_COLOR}
        strokeDasharray="4 3"
        strokeWidth={1.25}
      />

      {IMP35935_ORDERINGS.map((r, i) => {
        const cx = xOfGroup(i);
        return (
          <g key={r.ordering}>
            <rect x={cx - barW * 1.5 - 4} y={yOf(r.naiveNormErr)} width={barW} height={padT + plotH - yOf(r.naiveNormErr)} fill={NAIVE_COLOR} opacity={0.9} />
            <rect x={cx - barW / 2} y={yOf(r.pairwiseNormErr)} width={barW} height={padT + plotH - yOf(r.pairwiseNormErr)} fill={PAIRWISE_COLOR} opacity={0.9} />
            <rect x={cx + barW * 0.5 + 4} y={yOf(r.kahanNormErr)} width={barW} height={padT + plotH - yOf(r.kahanNormErr)} fill={KAHAN_COLOR} opacity={0.9} />
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
              {r.ordering}
            </text>
            {r.label && (
              <text x={cx} y={padT + plotH + 28} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
                ({r.label})
              </text>
            )}
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <g>
        <rect x={padL + 4} y={padT + 2} width={9} height={9} fill={NAIVE_COLOR} />
        <text x={padL + 17} y={padT + 10} fill={NAIVE_COLOR} fontSize={8.5}>
          naive (-- N*eps ceiling)
        </text>
        <rect x={padL + 150} y={padT + 2} width={9} height={9} fill={PAIRWISE_COLOR} />
        <text x={padL + 163} y={padT + 10} fill={PAIRWISE_COLOR} fontSize={8.5}>
          pairwise (-- log2(N)*eps ceiling)
        </text>
        <rect x={padL + 350} y={padT + 2} width={9} height={9} fill={KAHAN_COLOR} />
        <text x={padL + 363} y={padT + 10} fill={KAHAN_COLOR} fontSize={8.5}>
          Kahan-Babuska
        </text>
      </g>
    </svg>
  );
}

function OrderingTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>ordering</th>
          <th style={{ padding: '0.4rem 0.6rem', color: NAIVE_COLOR }}>naive norm err</th>
          <th style={{ padding: '0.4rem 0.6rem', color: PAIRWISE_COLOR }}>pairwise norm err</th>
          <th style={{ padding: '0.4rem 0.6rem', color: KAHAN_COLOR }}>Kahan norm err</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>naive orders below ceiling</th>
        </tr>
      </thead>
      <tbody>
        {IMP35935_ORDERINGS.map((r) => (
          <tr key={r.ordering} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {r.ordering}
              {r.label ? ` (${r.label})` : ''}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: NAIVE_COLOR }}>{r.naiveNormErr.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: PAIRWISE_COLOR }}>{r.pairwiseNormErr.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: KAHAN_COLOR }}>{r.kahanNormErr.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.naiveOrdersBelowCoherentCeiling.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35935AdversarialOrderingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Summation-Scheme Error Under Worst-case Orderings (imp-35935 / imp-35852)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35852 re-summed the imp-35812 fixed N&nbsp;~&nbsp;4.886e5-term oscillatory sum under
        five term orderings (original, signed-ascending, magnitude-ascending, magnitude-descending,
        clustered same-sign runs) at T_PT&nbsp;=&nbsp;3e12, measuring naive recursive, pairwise
        divide-and-conquer, and Kahan-Babuska compensated normalized error against the same exact
        BigInt reference (permutation-invariant, computed once).
      </p>

      <OrderingBarChart />

      <div style={{ marginTop: '1.5rem' }}>
        <OrderingTable />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The worst worst-case ordering ({IMP35935_SUMMARY.worstOrdering}, two long same-sign runs)
        raises the naive error ~{IMP35935_SUMMARY.naiveWorstOverOriginal.toFixed(0)}x above the
        oscillatory baseline -- yet it still stays &gt;1e4x
        (~{IMP35935_SUMMARY.naiveWorstOrdersBelowCoherentCeiling.toFixed(1)}&nbsp;orders) BELOW the
        coherent N&nbsp;*&nbsp;eps ceiling: full sign-coherence of the rounding errors is not
        realizable on this data. Pairwise and Kahan-Babuska stay ordering-robust, each remaining
        below its own ceiling at every ordering.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of the
        already-derived imp-35852 exact-BigInt-referenced adversarial-ordering measurement (no new
        derivation, no heavy data-module import, no re-running the summation schemes at page load);
        measurement only; certifies no W1 bound; evaluates no true H&#8320;; instantiates no
        interval; verifies no inequality; establishes no positivity; the W1 A&nbsp;+&nbsp;B&nbsp;-
        &nbsp;C certificate at T_PT stays GREENFIELD (imp-35681 Part A). NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35934-kappa-sweep-ladder', label: 'Summation-Scheme Error vs Condition Number kappa' },
          { to: '/viz-imp35865-summation-scheme-ladder', label: 'Summation-Scheme Error Ladder (N-axis)' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
