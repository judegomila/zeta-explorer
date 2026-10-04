import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { w1 } from '../data/rh-route-i-toeplitz-krein-certificate-2026-09-24.js';
import { IMP97336_W1_SIGN_PROFILE, IMP97336_BANNER } from '../data/imp-97336-w1-residual-sign-profile-near-ln3.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97368: first consumer of the imp-97336 w_1 residual sign profile. Panel 1 traces
// w_1(t) over [0, 12] showing the three zero crossings and the deeply negative leading
// well through the band edge t = ln3. Panel 2 shows the negMass/posMass ratio rising
// as 2a grows past ln3 (4.541x -> 6.730x), i.e. the pointwise margin worsening.
const LN3 = IMP97336_W1_SIGN_PROFILE.bindingBandEdge2a;

function CurvePanel() {
  const svgW = 720;
  const svgH = 300;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMax = 12;
  const n = 480;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * tMax;
    pts.push([t, w1(t)]);
  }
  const vals = pts.map((p) => p[1]);
  const minY = Math.min(...vals) - 0.3;
  const maxY = Math.max(...vals) + 0.3;

  const xOf = (t) => padL + (t / tMax) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={alpha(ED.series2, 0.03)} />
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      <line
        x1={xOf(LN3)}
        y1={padT}
        x2={xOf(LN3)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <text x={xOf(LN3) + 4} y={padT + 12} fill={ED.brass} fontSize={9}>
        t = ln3
      </text>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, 0, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10, 12].map((t) => (
        <text key={`x${t}`} x={xOf(t)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {t}
        </text>
      ))}
      <polyline
        points={pts.map(([t, v]) => `${xOf(t)},${yOf(v)}`).join(' ')}
        fill="none"
        stroke={ED.series2}
        strokeWidth={1.8}
      />
      {IMP97336_W1_SIGN_PROFILE.zeroCrossings.map((z) => (
        <circle key={z.t} cx={xOf(z.t)} cy={yOf(0)} r={3.2} fill={ED.series1} stroke="#0c4a6e" strokeWidth={1} />
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        t (dots = the three zero crossings 3.305 / 6.945 / 10.531)
      </text>
    </svg>
  );
}

function RatioLadderPanel() {
  const svgW = 720;
  const svgH = 240;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = IMP97336_W1_SIGN_PROFILE.resolutionWindowMass;
  const minX = Math.min(...rows.map((r) => r.twoA));
  const maxX = Math.max(...rows.map((r) => r.twoA));
  const minY = Math.min(...rows.map((r) => r.ratio)) - 0.3;
  const maxY = Math.max(...rows.map((r) => r.ratio)) + 0.3;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}x
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <text key={`x${r.twoA}`} x={xOf(r.twoA)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {r.twoA === LN3 ? 'ln3' : r.twoA.toFixed(2)}
        </text>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.twoA)},${yOf(r.ratio)}`).join(' ')}
        fill="none"
        stroke={ED.series3}
        strokeWidth={1.9}
      />
      {rows.map((r) => (
        <circle
          key={r.twoA}
          cx={xOf(r.twoA)}
          cy={yOf(r.ratio)}
          r={3.6}
          fill={r.twoA === LN3 ? ED.brassDeco : ED.series3}
          stroke="#166534"
          strokeWidth={1}
        />
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        2a (band edge, gold dot marks ln3 = 1.0986)
      </text>
    </svg>
  );
}

export default function Imp97368W1SignProfileViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Toeplitz-Krein: the w1 Residual Sign Profile Near ln3" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement only. No bound
        on Lambda moves; no operator positivity established; interval-rigorous reach stays
        2a&le;{IMP97336_W1_SIGN_PROFILE.intervalRigorousReach2a}; Platt-Trudgian Lambda&le;0.2
        remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        w1(t) = 2&theta;&prime;(t) &minus; &radic;2 ln2 cos(t ln2) is the bare residual left after
        peeling both prefactor squares off the pole-free symbol &sigma;2 = (t&sup2;+&frac14;)&sup2;w1.
        It has exactly three sign changes on [0,60] and is deeply negative on the whole leading
        interval [0, 3.305) &mdash; including at the band edge t = ln3 itself, where w1(ln3) ={' '}
        {IMP97336_W1_SIGN_PROFILE.w1AtLn3.toFixed(4)}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        w1(t) on [0, 12]: three zero crossings, negative through the band edge
      </h3>
      <CurvePanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        negMass/posMass ratio over the resolution window [0, &pi;/a], as 2a grows past ln3
      </h3>
      <RatioLadderPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the fixed negative
        mass in the leading well (7.2641, independent of a) dominates the shrinking positive
        band mass as the resolution window [0, &pi;/a] narrows with growing a &mdash; the ratio
        rises from {IMP97336_W1_SIGN_PROFILE.resolutionWindowMass[0].ratio.toFixed(3)}x at the
        verified reach 2a=0.96 to {IMP97336_W1_SIGN_PROFILE.resolutionWindowMass[4].ratio.toFixed(3)}x
        at 2a=1.16, passing {IMP97336_W1_SIGN_PROFILE.resolutionWindowMass[2].ratio.toFixed(3)}x at
        2a=ln3. This is a truncation-window effect, not a change in w1 itself; it shows the bare
        residual offers no pointwise margin that improves past ln3.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97336 committed measurement verbatim (no re-solve, no new numerics). {IMP97336_BANNER}
      </div>
    </div>
  );
}
