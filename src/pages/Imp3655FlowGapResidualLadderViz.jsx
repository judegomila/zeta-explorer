import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3655_RESIDUAL_LADDER,
  IMP3655_EXACT_IDENTITY_FLOOR,
  IMP3655_MIN_SHRINK_VS_IMP3599,
} from '../data/imp-3655-flow-gap-residual-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const SERIES = [
  { key: 'resid_imp3599', label: 'imp-3599 crude O(eps^2) model', color: ED.series2, dash: '1 3' },
  { key: 'resid_lead', label: 'imp-3617 resummed leading -d1 eps', color: ED.brass, dash: '4 2.5' },
  { key: 'resid_order2', label: 'imp-3617 self-consistent O(eps^2)', color: ED.series5, dash: '2 2' },
  { key: 'resid_order3', label: 'imp-3617 self-consistent O(eps^3)', color: ED.series3, dash: 'none' },
];

export default function Imp3655FlowGapResidualLadderViz() {
  const w = 720;
  const padL = 68;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = w - padL - padR;
  const cH = 340;
  const h = padT + cH + padB;

  const factors = IMP3655_RESIDUAL_LADDER.map((r) => r.factor);
  const allVals = IMP3655_RESIDUAL_LADDER.flatMap((r) =>
    SERIES.map((s) => r[s.key]),
  ).concat([IMP3655_EXACT_IDENTITY_FLOOR]);
  const logMin = Math.floor(Math.log10(Math.min(...allVals)));
  const logMax = Math.ceil(Math.log10(Math.max(...allVals)));

  const xMin = Math.log10(factors[0]);
  const xMax = Math.log10(factors[factors.length - 1]);
  const xS = (f) => padL + ((Math.log10(f) - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logMin) / (logMax - logMin));

  const yTicks = [];
  for (let e = logMin; e <= logMax; e += 2) yTicks.push(Math.pow(10, e));

  const pathFor = (key) =>
    IMP3655_RESIDUAL_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r[key]).toFixed(2)).join(' ');

  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Self-Consistent Flow-Gap Residual Ladder Across the E_trunc Floor Grid (imp-3617)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3599 wrote the EXACT flow-gap identity gap = 1 - (L<sub>half</sub>/L<sub>x</sub>)/(1+&eta;)<sup>2</sup>
        {' '}and a crude O(eps<sup>2</sup>) truncation whose residual left a ~5% tail. imp-3617 pushed the same
        identity to a self-consistent closed expansion in eps = E<sub>flow</sub>(N<sub>x</sub>)/E<sub>trunc</sub>,
        adding the slope-curvature s and E<sub>flow</sub> log-curvature &nu; at O(eps<sup>2</sup>) and the
        third log-N derivative t at O(eps<sup>3</sup>). The chart below plots, on a log axis, the residual
        between the root-solved gap and each successive approximation across the imp-3443 half-to-double
        E<sub>trunc</sub> floor grid f &isin; {'{'}0.5, 0.75, 1.0, 1.5, 2.0{'}'} &mdash; each added order drops
        the residual by ~2-3 further orders of magnitude, toward the ~1e-13 exact-identity floor.
      </p>

      <div
        style={{
          padding: '1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 3%, transparent)',
          borderRadius: 6,
        }}
      >
        <svg width={w} height={h} style={{ display: 'block', margin: '0 auto' }}>
          <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

          {yTicks.map((v) => (
            <g key={v}>
              <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.6} />
              <text x={padL - 6} y={yS(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
                {v.toExponential(0)}
              </text>
            </g>
          ))}

          <line
            x1={padL}
            y1={yS(IMP3655_EXACT_IDENTITY_FLOOR)}
            x2={padL + cW}
            y2={yS(IMP3655_EXACT_IDENTITY_FLOOR)}
            stroke={ED.rule}
            strokeWidth={1}
            strokeDasharray="5 3"
          />
          <text
            x={padL + cW - 4}
            y={yS(IMP3655_EXACT_IDENTITY_FLOOR) - 5}
            textAnchor="end"
            fill={ED.inkFaint}
            fontSize={9}
          >
            ~1e-13 exact-identity floor
          </text>

          {SERIES.map((s) => (
            <path key={s.key} d={pathFor(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
          ))}

          {IMP3655_RESIDUAL_LADDER.map((r) =>
            SERIES.map((s) => (
              <circle key={s.key + r.factor} cx={xS(r.factor)} cy={yS(r[s.key])} r={2.6} fill={s.color} />
            )),
          )}

          <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

          {factors.map((f) => (
            <text key={f} x={xS(f)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              f={f}
            </text>
          ))}
          <text x={padL + cW / 2} y={h - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            E_trunc floor factor f (E_trunc = f &times; 3.06e-5)
          </text>
        </svg>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--ink-faint)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {SERIES.map((s) => (
          <span key={s.key}>
            <span style={{ color: s.color }}>&#9644;</span> {s.label}
          </span>
        ))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> derivation/measurement only &mdash;
        no proof, no bridge closure, no RH claim, NO QED. Each added expansion order (leading &rarr;
        O(eps<sup>2</sup>) &rarr; O(eps<sup>3</sup>)) shrinks the residual geometrically, with the
        O(eps<sup>3</sup>) truncation beating the imp-3599 crude model by &ge;{' '}
        {IMP3655_MIN_SHRINK_VS_IMP3599.toExponential(2)}&times; at the worst floor &mdash; but per the
        imp-3617 sub-gap imp-3617-fourthorder-fd-floor, it does NOT reach the ~1e-13 exact-identity
        floor; a plateau survives from the neglected O(eps<sup>4</sup>) term and the finite-difference
        curvature evaluation. The imp-3066 off-diagonal endpoint-Hankel K<sub>a</sub> &ge; 0 positivity
        obstruction remains untouched.
      </div>
    </div>
  );
}
