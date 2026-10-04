import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35865_SUMMATION_LADDER,
  IMP35865_ORDERS_BELOW_CEILING,
  IMP35865_BARRIER_MARGIN_HEADROOM,
} from '../data/imp-35865-summation-scheme-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const NAIVE_COLOR = ED.series2;
const PAIRWISE_COLOR = ED.series1;
const KAHAN_COLOR = ED.series3;
const CEIL_COLOR = ED.series8;

function SummationLadderChart() {
  const w = 680;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = w - padL - padR;
  const plotH = 300;
  const h = padT + plotH + padB;

  const log10 = Math.log10;
  const nMin = log10(1000);
  const nMax = log10(488602);
  const yMin = -21; // log10(error), lower bound
  const yMax = -9; // log10(error), upper bound (leaves room for naive ceiling line)
  const xOf = (N) => padL + ((log10(N) - nMin) / (nMax - nMin)) * plotW;
  const yOf = (v) => padT + plotH - ((log10(v) - yMin) / (yMax - yMin)) * plotH;

  const linePath = (key) =>
    IMP35865_SUMMATION_LADDER.map(
      (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.N)} ${yOf(p[key])}`
    ).join(' ');

  const yTicks = [-9, -11, -13, -15, -17, -19, -21];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        normalized summation error vs N (log-log)
      </text>

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(10 ** v)} x2={padL + plotW} y2={yOf(10 ** v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yOf(10 ** v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}

      <path d={linePath('naiveCeil')} fill="none" stroke={CEIL_COLOR} strokeWidth={1.25} strokeDasharray="3 3" />
      <path d={linePath('pairwiseCeil')} fill="none" stroke={CEIL_COLOR} strokeWidth={1.25} strokeDasharray="1 3" />

      <path d={linePath('naive')} fill="none" stroke={NAIVE_COLOR} strokeWidth={2.25} />
      <path d={linePath('pairwise')} fill="none" stroke={PAIRWISE_COLOR} strokeWidth={2.25} />
      <path d={linePath('kahan')} fill="none" stroke={KAHAN_COLOR} strokeWidth={2.25} />

      {IMP35865_SUMMATION_LADDER.map((p) => (
        <g key={p.N}>
          <circle cx={xOf(p.N)} cy={yOf(p.naive)} r={3} fill={NAIVE_COLOR} />
          <circle cx={xOf(p.N)} cy={yOf(p.pairwise)} r={3} fill={PAIRWISE_COLOR} />
          <circle cx={xOf(p.N)} cy={yOf(p.kahan)} r={3} fill={KAHAN_COLOR} />
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={h - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N -- 1e3 .. N at T_PT (~4.886e5)
      </text>

      <g>
        <circle cx={padL + 4} cy={padT + 8} r={3} fill={NAIVE_COLOR} />
        <text x={padL + 12} y={padT + 11} fill={NAIVE_COLOR} fontSize={8.5}>
          naive
        </text>
        <circle cx={padL + 70} cy={padT + 8} r={3} fill={PAIRWISE_COLOR} />
        <text x={padL + 78} y={padT + 11} fill={PAIRWISE_COLOR} fontSize={8.5}>
          pairwise
        </text>
        <circle cx={padL + 150} cy={padT + 8} r={3} fill={KAHAN_COLOR} />
        <text x={padL + 158} y={padT + 11} fill={KAHAN_COLOR} fontSize={8.5}>
          Kahan-Babuska
        </text>
        <line x1={padL + 250} y1={padT + 8} x2={padL + 270} y2={padT + 8} stroke={CEIL_COLOR} strokeWidth={1.25} strokeDasharray="3 3" />
        <text x={padL + 275} y={padT + 11} fill={CEIL_COLOR} fontSize={8.5}>
          imp-35761 ceilings
        </text>
      </g>
    </svg>
  );
}

function LadderTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
          <th style={{ padding: '0.4rem 0.6rem', color: NAIVE_COLOR }}>naive</th>
          <th style={{ padding: '0.4rem 0.6rem', color: PAIRWISE_COLOR }}>pairwise</th>
          <th style={{ padding: '0.4rem 0.6rem', color: KAHAN_COLOR }}>Kahan</th>
          <th style={{ padding: '0.4rem 0.6rem', color: CEIL_COLOR }}>naive ceiling (N.eps)</th>
        </tr>
      </thead>
      <tbody>
        {IMP35865_SUMMATION_LADDER.map((p) => (
          <tr key={p.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {p.N.toLocaleString()}
              {p.label ? ` (${p.label})` : ''}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: NAIVE_COLOR }}>{p.naive.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: PAIRWISE_COLOR }}>{p.pairwise.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: KAHAN_COLOR }}>{p.kahan.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: CEIL_COLOR }}>{p.naiveCeil.toExponential(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35865SummationSchemeLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Summation-Scheme Error Ladder (imp-35865 / imp-35812)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35812 ran naive recursive, pairwise divide-and-conquer, and Kahan-Babuska compensated
        summation on a representative N&nbsp;~&nbsp;4.886e5-term oscillatory sum (mimicking the
        Polymath15 A_t&nbsp;+&nbsp;B_t&nbsp;-&nbsp;C_t structure at T_PT&nbsp;=&nbsp;3e12), measuring
        each scheme error against an EXACT BigInt reference. Across the ladder N&nbsp;=&nbsp;1e3&nbsp;..&nbsp;4.886e5,
        the naive error tracks O(&radic;N&nbsp;.&nbsp;u) (random-walk accumulation), NOT the imp-35761
        pessimistic coherent O(N&nbsp;.&nbsp;u) ceiling -- sitting&nbsp;~
        {IMP35865_ORDERS_BELOW_CEILING.naiveVsCeilingOrders.toFixed(1)}&nbsp;orders below it at N_at_T_PT.
      </p>

      <SummationLadderChart />

      <div style={{ marginTop: '1.5rem' }}>
        <LadderTable />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Pairwise tracks O(log2(N)&nbsp;.&nbsp;u), sitting&nbsp;~
        {IMP35865_ORDERS_BELOW_CEILING.pairwiseVsCeilingOrders.toFixed(1)}&nbsp;orders below its own
        ceiling; Kahan-Babuska is flat at the unit-roundoff floor with no measurable growth in N,
        ~{IMP35865_ORDERS_BELOW_CEILING.kahanVsCeilingOrders.toFixed(1)}&nbsp;orders below the naive
        ceiling. {IMP35865_BARRIER_MARGIN_HEADROOM.note}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status (measurement only):</strong> presentation
        only of the already-derived imp-35812 exact-BigInt-referenced measurement (no new derivation,
        no heavy data-module import, no re-running the summation schemes at page load). All three
        schemes -- naive, pairwise, Kahan-Babuska -- certify NO W1 bound and, together with their
        pessimistic imp-35761 ceilings, sit&nbsp;&ge;10 orders below the imp-35760 O(1) barrier margin
        |A_t&nbsp;+&nbsp;B_t|&nbsp;-&nbsp;|C_t|; evaluates no true H&#8320;; instantiates no interval;
        verifies no inequality; establishes no positivity; the W1 A&nbsp;+&nbsp;B&nbsp;-&nbsp;C
        certificate at T_PT stays GREENFIELD (imp-35681 Part A). NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35864-debruijn-digit-ladder', label: 'Exact de Bruijn Working-Digit Ladder D*(x)' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
