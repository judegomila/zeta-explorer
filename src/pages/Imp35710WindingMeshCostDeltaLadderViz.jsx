import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35710_DELTA_LADDER_ROWS,
  IMP35710_SUMMARY,
} from '../data/imp-35710-winding-mesh-cost-delta-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const ASYMPTOTE_COLOR = ED.series7;
const CURVE_COLOR = ED.series1;

function BoundaryEvalsPerZeroChart({ rows, asymptote }) {
  const w = 720;
  const h = 260;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const logX = (delta) => Math.log10(delta);
  const xMin = logX(rows[0].delta);
  const xMax = logX(rows[rows.length - 1].delta);
  const xPix = (delta) => padL + ((logX(delta) - xMin) / (xMax - xMin)) * plotW;

  const yMax = Math.max(...rows.map((r) => r.boundaryEvalsPerZero)) + 1;
  const yMin = asymptote - 1;
  const yPix = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const path = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.delta)},${yPix(r.boundaryEvalsPerZero)}`).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={ED.paper} rx={2} />

      {[6, 9, 12, 15, 18].map((v) => (
        <g key={v}>
          <line x1={padL} x2={padL + plotW} y1={yPix(v)} y2={yPix(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 8} y={yPix(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        x2={padL + plotW}
        y1={yPix(asymptote)}
        y2={yPix(asymptote)}
        stroke={ASYMPTOTE_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + plotW - 4} y={yPix(asymptote) - 6} textAnchor="end" fill={ASYMPTOTE_COLOR} fontSize={10}>
        horizontal asymptote = {asymptote}
      </text>

      <path d={path} fill="none" stroke={CURVE_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <g key={r.delta}>
          <circle cx={xPix(r.delta)} cy={yPix(r.boundaryEvalsPerZero)} r={3.5} fill={CURVE_COLOR} />
          <text x={xPix(r.delta)} y={yPix(r.boundaryEvalsPerZero) - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
            {r.boundaryEvalsPerZero}
          </text>
          <text x={xPix(r.delta)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
            {r.delta}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + plotH / 2})`}>
        boundary evals / enclosed zero
      </text>
      <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        transition width &Delta; (log scale)
      </text>
    </svg>
  );
}

function DeltaLadderTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>&Delta;</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>enclosed zeros</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>total boundary evals</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>evals / enclosed zero</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.delta} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.delta}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.enclosedZeros}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.totalEvals}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.boundaryEvalsPerZero}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35710WindingMeshCostDeltaLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Winding-Barrier Mesh-Cost Delta-Ladder (imp-35710 / imp-35675)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35675 measured the finite winding-barrier (B1) mesh cost at T_PT = 3&times;10<sup>12</sup>:
        boundary evaluations per enclosed zero across a transition-width &Delta; ladder
        {' '}{'{'}1, 2, 5, 10, 20, 50, 100{'}'}. No page rendered this Delta-ladder table before this
        ticket. The local zero density at T_PT is &asymp;{IMP35710_SUMMARY.localDensityAtTPT.toFixed(2)}{' '}
        zeros/unit-height and the mesh resolution is &asymp;{IMP35710_SUMMARY.meshPerUnit.toFixed(2)}{' '}
        panels/unit-height (imp-35653 Part C).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Boundary evaluations per enclosed zero vs transition width &Delta;
      </h3>
      <BoundaryEvalsPerZeroChart
        rows={IMP35710_DELTA_LADDER_ROWS}
        asymptote={IMP35710_SUMMARY.horizontalEvalsPerEnclosedZeroAsymptote}
      />

      <div style={{ marginTop: '1.5rem' }}>
        <DeltaLadderTable rows={IMP35710_DELTA_LADDER_ROWS} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Cost is linear in &Delta;: total evals &asymp; {IMP35710_SUMMARY.slopePerUnitDelta.toFixed(2)}&nbsp;&Delta;{' '}
        + {IMP35710_SUMMARY.verticalIntercept.toFixed(2)}, while enclosed zeros scale as{' '}
        {IMP35710_SUMMARY.localDensityAtTPT.toFixed(2)}&nbsp;&Delta;. The ratio therefore decays
        monotonically from 18 evals/zero at &Delta;=1 toward the exact horizontal asymptote of{' '}
        {IMP35710_SUMMARY.horizontalEvalsPerEnclosedZeroAsymptote} as &Delta; grows -- the fixed
        oversample-{IMP35710_SUMMARY.oversample} boundary-tracing overhead per contour amortizes
        away over a wider enclosed window.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of an
        already-measured cost curve (imp-35675); adds no new Lambda bound and does not discharge
        the non-finite argument-principle tail lemma (imp-35653 Part D, work-item W3). NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard (imp-35653 porting scope)' },
          { to: '/viz-imp35663-decade-span-growth', label: 'imp-35663 E_flow Far-Tail Decade-Span-Growth Ladder' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
