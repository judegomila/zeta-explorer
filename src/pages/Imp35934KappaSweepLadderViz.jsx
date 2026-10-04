import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35934_KAPPA_SWEEP,
  IMP35934_KAPPA_RANGE,
  IMP35934_NAIVE_REL_GROWTH,
} from '../data/imp-35934-kappa-sweep-viz-data.js';
import { ED } from '../styles/tokens.js';

const NAIVE_COLOR = ED.series2;
const PAIRWISE_COLOR = ED.series1;
const KAHAN_COLOR = ED.series3;

function KappaSweepChart() {
  const w = 680;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = w - padL - padR;
  const plotH = 300;
  const h = padT + plotH + padB;

  const log10 = Math.log10;
  const kMin = log10(IMP35934_KAPPA_RANGE.min);
  const kMax = log10(IMP35934_KAPPA_RANGE.max);
  const yMin = -18; // log10(relative error), lower bound
  const yMax = -11; // log10(relative error), upper bound
  const xOf = (kappa) => padL + ((log10(kappa) - kMin) / (kMax - kMin)) * plotW;
  const yOf = (v) => padT + plotH - ((log10(v) - yMin) / (yMax - yMin)) * plotH;

  const linePath = (key) =>
    IMP35934_KAPPA_SWEEP.map(
      (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.kappa)} ${yOf(p[key])}`
    ).join(' ');

  const yTicks = [-11, -12, -13, -14, -15, -16, -17, -18];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        relative summation error vs kappa (log-log)
      </text>

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(10 ** v)} x2={padL + plotW} y2={yOf(10 ** v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yOf(10 ** v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}

      <path d={linePath('naiveRel')} fill="none" stroke={NAIVE_COLOR} strokeWidth={2.25} />
      <path d={linePath('pairwiseRel')} fill="none" stroke={PAIRWISE_COLOR} strokeWidth={2.25} />
      <path d={linePath('kahanRel')} fill="none" stroke={KAHAN_COLOR} strokeWidth={2.25} />

      {IMP35934_KAPPA_SWEEP.map((p) => (
        <g key={p.kappa}>
          <circle cx={xOf(p.kappa)} cy={yOf(p.naiveRel)} r={3} fill={NAIVE_COLOR} />
          <circle cx={xOf(p.kappa)} cy={yOf(p.pairwiseRel)} r={3} fill={PAIRWISE_COLOR} />
          <circle cx={xOf(p.kappa)} cy={yOf(p.kahanRel)} r={3} fill={KAHAN_COLOR} />
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={h - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        kappa -- ~1 .. ~2e5 (Sum|t_k| / |Sum t_k|), N fixed at N_at_T_PT
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
      </g>
    </svg>
  );
}

function SweepTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>kappa</th>
          <th style={{ padding: '0.4rem 0.6rem', color: NAIVE_COLOR }}>naive rel</th>
          <th style={{ padding: '0.4rem 0.6rem', color: PAIRWISE_COLOR }}>pairwise rel</th>
          <th style={{ padding: '0.4rem 0.6rem', color: KAHAN_COLOR }}>Kahan rel</th>
        </tr>
      </thead>
      <tbody>
        {IMP35934_KAPPA_SWEEP.map((p) => (
          <tr key={p.kappa} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {p.kappa.toExponential(2)}
              {p.label ? ` (${p.label})` : ''}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: NAIVE_COLOR }}>{p.naiveRel.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: PAIRWISE_COLOR }}>{p.pairwiseRel.toExponential(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: KAHAN_COLOR }}>{p.kahanRel.toExponential(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35934KappaSweepLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Summation-Scheme Error vs Condition Number kappa (imp-35934 / imp-35854)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35854 swept the imp-35812 oscillatory-sum constants (alpha,&nbsp;beta) so the measured
        condition number kappa&nbsp;=&nbsp;Sum|t_k|&nbsp;/&nbsp;|Sum&nbsp;t_k| ladders across
        ~{IMP35934_KAPPA_RANGE.decades.toFixed(1)}&nbsp;decades (kappa&nbsp;~&nbsp;1&nbsp;to&nbsp;~2e5)
        on the SAME N&nbsp;~&nbsp;4.886e5-term sum at T_PT&nbsp;=&nbsp;3e12, measuring naive
        recursive, pairwise divide-and-conquer, and Kahan-Babuska compensated relative error against
        an exact BigInt reference at each rung.
      </p>

      <KappaSweepChart />

      <div style={{ marginTop: '1.5rem' }}>
        <SweepTable />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The naive relative error grows with kappa but FAR SUBLINEARLY -- only
        ~{IMP35934_NAIVE_REL_GROWTH.decades.toFixed(1)}&nbsp;decades of relative-error growth across
        ~{IMP35934_NAIVE_REL_GROWTH.kappaDecades.toFixed(1)}&nbsp;decades of kappa -- REFINING (not
        confirming) the pessimistic sqrt(N).u.kappa random-walk model, which remains a valid ceiling
        at every rung but is not tracked. Pairwise and Kahan-Babuska stay kappa-robust on the
        normalized scale, with the hierarchy Kahan&nbsp;&lt;&nbsp;pairwise&nbsp;&lt;&nbsp;naive
        preserved at every measured kappa.
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
        already-derived imp-35854 exact-BigInt-referenced kappa-sweep measurement (no new
        derivation, no heavy data-module import, no re-running the summation schemes at page load);
        measurement only; certifies no W1 bound; evaluates no true H&#8320;; instantiates no
        interval; verifies no inequality; establishes no positivity; the W1 A&nbsp;+&nbsp;B&nbsp;-
        &nbsp;C certificate at T_PT stays GREENFIELD (imp-35681 Part A). NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35865-summation-scheme-ladder', label: 'Summation-Scheme Error Ladder (N-axis)' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
