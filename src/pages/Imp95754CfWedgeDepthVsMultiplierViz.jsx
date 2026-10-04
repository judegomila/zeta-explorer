import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95754_DEEPEN_FACTORS,
  IMP95754_WEDGE_CORNER,
  IMP95754_CAVEAT_BANNER,
} from '../data/imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js';
import { ED } from '../styles/tokens.js';

const SOURCE_COLOR = {
  'imp-95617': ED.series1,
  'imp-95691': ED.series4,
  'imp-95721': ED.series2,
  'imp-95747': ED.series5,
};

function WedgeDepthCurve() {
  const svgW = 640;
  const svgH = 320;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const pts = IMP95754_DEEPEN_FACTORS;
  const cfLo = Math.log10(0.9);
  const cfHi = Math.log10(10);
  const gapLo = -0.19;
  const gapHi = 0;

  const xOf = (cf) => padL + ((Math.log10(cf) - cfLo) / (cfHi - cfLo)) * cW;
  const yOf = (gap) => padT + ((gap - gapHi) / (gapLo - gapHi)) * cH;

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.cf).toFixed(2)} ${yOf(p.minGap).toFixed(2)}`).join(' ');

  const xTicks = [1, 2, 5, 10];
  const yTicks = [0, -0.05, -0.1, -0.15, -0.18];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((g) => (
        <g key={`yt-${g}`}>
          <line x1={padL} y1={yOf(g)} x2={padL + cW} y2={yOf(g)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(g) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {g.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((cf) => (
        <g key={`xt-${cf}`}>
          <line x1={xOf(cf)} y1={padT} x2={xOf(cf)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(cf)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {`${cf}x`}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={ED.rule} strokeWidth={1.5} />

      {pts.map((p) => (
        <circle key={p.cf} cx={xOf(p.cf)} cy={yOf(p.minGap)} r={5} fill={SOURCE_COLOR[p.source]} stroke={ED.paper} strokeWidth={1} />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        C_F multiplier cf (log scale)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        box-min gap
      </text>
    </svg>
  );
}

export default function Imp95754CfWedgeDepthVsMultiplierViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Transition-Before-Knee Wedge Depth vs the C_F Multiplier (imp-95617/95691/95721/95747/95754)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95617 found the imp-95582 transition-before-knee ordering inverts inside the nominal
        +/-50% (C_C, E_trunc) box, with a box-min gap of -0.004682 at the nominal C_F multiplier
        cf=1. imp-95691 pinned the honest upper C_F provenance edge to a geometric mean cf=1.29615,
        deepening the gap to -0.013188. imp-95721 then derived a density-weighted physical-cutoff
        band cf in [6.1, 8.6]x, deepening the gap further to -0.171451. imp-95747 regularized that
        band with GUE level repulsion and found it saturates at a cutoff-independent cf=9.5831x,
        deepening the gap to -0.184642 -- ~39.4x the nominal depth. The chart below plots this
        single monotone-deepening curve; the wedge corner stays fixed at
        (C_C {IMP95754_WEDGE_CORNER.cC_mult}x, E_trunc {IMP95754_WEDGE_CORNER.eTrunc_mult}x)
        throughout.
      </p>

      <WedgeDepthCurve />

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
        {Object.entries(SOURCE_COLOR).map(([source, color]) => (
          <span key={source} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {source}
          </span>
        ))}
      </div>

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>cf</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>label</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>minGap</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>deepen factor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP95754_DEEPEN_FACTORS.map((p) => (
            <tr key={p.cf} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.cf}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{p.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.minGap}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{`${p.deepenFactor}x`}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: SOURCE_COLOR[p.source] }}>{p.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95754_CAVEAT_BANNER}
      </div>
    </div>
  );
}
