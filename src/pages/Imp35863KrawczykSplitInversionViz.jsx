import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35863_HEIGHT_LADDER,
  IMP35863_CROSSOVER,
  IMP35863_BAND_TOP,
  IMP35863_PT_ANCHOR,
} from '../data/imp-35863-krawczyk-split-inversion-viz-data.js';
import { ED } from '../styles/tokens.js';

const SHIFT_COLOR = ED.series1;
const CURVATURE_COLOR = ED.series7;
const CROSSOVER_COLOR = ED.series4;

function SplitInversionChart() {
  const w = 680;
  const padL = 48;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = w - padL - padR;
  const plotH = 300;
  const h = padT + plotH + padB;

  const xMin = IMP35863_BAND_TOP.log10N;
  const xMax = IMP35863_PT_ANCHOR.log10N + 0.9; // include the 1e14 point with margin
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (frac) => padT + plotH - frac * plotH;

  const shiftPath = IMP35863_HEIGHT_LADDER.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N)} ${yOf(p.shiftFraction)}`
  ).join(' ');
  const curvaturePath = IMP35863_HEIGHT_LADDER.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N)} ${yOf(p.curvatureFraction)}`
  ).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        shift_fraction &amp; curvature_fraction vs log10(N)
      </text>

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* 50/50 crossover marker */}
      <line
        x1={xOf(IMP35863_CROSSOVER.log10N)}
        y1={padT}
        x2={xOf(IMP35863_CROSSOVER.log10N)}
        y2={padT + plotH}
        stroke={CROSSOVER_COLOR}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text
        x={xOf(IMP35863_CROSSOVER.log10N) + 4}
        y={padT + 10}
        fill={CROSSOVER_COLOR}
        fontSize={9}
      >
        50/50 crossover (a=4&delta;, N~1.88e11)
      </text>

      <path d={curvaturePath} fill="none" stroke={CURVATURE_COLOR} strokeWidth={2.25} />
      <path d={shiftPath} fill="none" stroke={SHIFT_COLOR} strokeWidth={2.25} />

      {IMP35863_HEIGHT_LADDER.map((p) => (
        <g key={p.log10N}>
          <circle cx={xOf(p.log10N)} cy={yOf(p.shiftFraction)} r={3} fill={SHIFT_COLOR} />
          <circle cx={xOf(p.log10N)} cy={yOf(p.curvatureFraction)} r={3} fill={CURVATURE_COLOR} />
          {p.label && (
            <text
              x={xOf(p.log10N)}
              y={padT + plotH + 16}
              textAnchor="middle"
              fill={ED.ink}
              fontSize={9}
              fontWeight={700}
            >
              {p.label}
            </text>
          )}
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={h - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        log10(N) -- band-top ({IMP35863_BAND_TOP.log10N.toFixed(2)}) .. PT anchor ({IMP35863_PT_ANCHOR.log10N.toFixed(2)}) .. 1e14
      </text>

      <g>
        <circle cx={padL + 4} cy={padT + 8} r={3} fill={CURVATURE_COLOR} />
        <text x={padL + 12} y={padT + 11} fill={CURVATURE_COLOR} fontSize={8.5}>
          curvature_fraction
        </text>
        <circle cx={padL + 130} cy={padT + 8} r={3} fill={SHIFT_COLOR} />
        <text x={padL + 138} y={padT + 11} fill={SHIFT_COLOR} fontSize={8.5}>
          shift_fraction
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
          <th style={{ padding: '0.4rem 0.6rem' }}>log10(N)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>a</th>
          <th style={{ padding: '0.4rem 0.6rem', color: SHIFT_COLOR }}>shift_fraction</th>
          <th style={{ padding: '0.4rem 0.6rem', color: CURVATURE_COLOR }}>curvature_fraction</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
        </tr>
      </thead>
      <tbody>
        {IMP35863_HEIGHT_LADDER.map((p) => (
          <tr key={p.log10N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.N.toExponential(4)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.log10N.toFixed(3)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.a.toExponential(4)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: SHIFT_COLOR }}>
              {(p.shiftFraction * 100).toFixed(2)}%
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: CURVATURE_COLOR }}>
              {(p.curvatureFraction * 100).toFixed(2)}%
            </td>
            <td style={{ padding: '0.4rem 0.6rem' }}>{p.label || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35863KrawczykSplitInversionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Surplus-Split Height-Axis Inversion (imp-35863 / imp-35809)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35762 split the D3 Krawczyk headroom surplus residual into an a-shift piece and an
        O(a&sup2;) curvature piece, and imp-35809 found the ~98/2 curvature-dominant split is flat
        WITHIN the imp-34693 admissible seed band but INVERTS along the height axis: as N climbs
        from the band-top toward the Platt-Trudgian anchor N(T_PT)&nbsp;~&nbsp;1.236e13, the linear
        a-shift piece decays far slower than the quadratic curvature piece, so the shift share rises
        from ~1.9% to ~98.5% while the curvature share collapses from ~98.1% to ~1.5%, crossing 50/50
        at a&nbsp;~&nbsp;4&delta; (N&nbsp;~&nbsp;1.88e11).
      </p>

      <SplitInversionChart />

      <div style={{ marginTop: '1.5rem' }}>
        <LadderTable />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The band-top split ({(IMP35863_BAND_TOP.shiftFraction * 100).toFixed(2)}% shift /{' '}
        {(IMP35863_BAND_TOP.curvatureFraction * 100).toFixed(2)}% curvature) is a near-mirror of the
        PT-anchor split ({(IMP35863_PT_ANCHOR.shiftFraction * 100).toFixed(2)}% shift /{' '}
        {(IMP35863_PT_ANCHOR.curvatureFraction * 100).toFixed(2)}% curvature) -- the ~98/2 split imp-35762
        described is a band-local artifact, not a global invariant.
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
        already-derived imp-35809 measurement (no new derivation, no heavy data-module import);
        measurement on the inherited imp-3220/imp-3406 surrogate; imp-34714a machine certificate
        REMAINS OPEN and F(m)=0 stays a double-precision artifact; C_C 1/8 (imp-2642/2643) and C_mb
        GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity,
        no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35824-surplus-waterfall', label: 'Krawczyk Surplus Waterfall (band anchors)' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
