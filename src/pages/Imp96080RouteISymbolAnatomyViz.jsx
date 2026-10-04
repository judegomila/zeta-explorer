import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96080_SYMBOL_CURVE,
  IMP96080_ARCH_WINDOW,
  IMP96080_RESONANCE_WINDOWS,
  IMP96080_MU_MAX_CURVE,
  IMP96080_CROSSING,
  IMP96080_HONEST_BANNER,
} from '../data/imp-96080-route-i-symbol-anatomy-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// line chart of the Toeplitz symbol w(t) = 2theta'(t) - m_2(t), shaded over the
// archimedean negative window [0, 3.597) and the six p=2 resonance windows.
function SymbolPanel() {
  const rows = IMP96080_SYMBOL_CURVE;
  const svgW = 700;
  const padL = 46;
  const padR = 16;
  const svgH = 300;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minT = rows[0].t;
  const maxT = rows[rows.length - 1].t;
  const minY = -9.5;
  const maxY = 6;
  const xOf = (t) => padL + ((t - minT) / (maxT - minT)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [-9, -6, -3, 0, 3, 6];

  return (
    <AxisFrame svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB} xLabel="t" yLabel="w(t)">
      <rect x={xOf(0)} y={padT} width={xOf(IMP96080_ARCH_WINDOW.hi) - xOf(0)} height={plotH} fill={ED.series2} opacity={0.12} />
      {IMP96080_RESONANCE_WINDOWS.map((r) => (
        <rect key={r.k} x={xOf(r.lo)} y={padT} width={xOf(r.hi) - xOf(r.lo)} height={plotH} fill={ED.series1} opacity={0.14} />
      ))}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.t)},${yOf(Math.max(minY, Math.min(maxY, r.w)))}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.5}
      />
      {[0, 10, 20, 30, 40, 50, 60].map((t) => (
        <text key={t} x={xOf(t)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {t}
        </text>
      ))}
    </AxisFrame>
  );
}

// line chart of mu_max(a; k=0) across the baked N=128 grid, with the (ln3)/2
// boundary and the a* = 0.56578 crossing marked.
function MuMaxPanel() {
  const rows = IMP96080_MU_MAX_CURVE;
  const svgW = 560;
  const padL = 50;
  const padR = 16;
  const svgH = 260;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minA = rows[0].a;
  const maxA = rows[rows.length - 1].a;
  const minY = 0;
  const maxY = 1.15;
  const xOf = (a) => padL + ((a - minA) / (maxA - minA)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <AxisFrame svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB} xLabel="a" yLabel="mu_max(a; k=0)">
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <line x1={xOf(IMP96080_CROSSING.ln3Half)} y1={padT} x2={xOf(IMP96080_CROSSING.ln3Half)} y2={padT + plotH} stroke={ED.series5} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <text x={xOf(IMP96080_CROSSING.ln3Half)} y={padT - 4} textAnchor="middle" fill={ED.series5} fontSize={8.5}>
        (ln3)/2
      </text>
      {[0, 0.25, 0.5, 0.75, 1]
        .concat([1.0])
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((v) => (
          <g key={`y${v}`}>
            <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
            <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
              {v}
            </text>
          </g>
        ))}
      <polyline
        points={rows.map((r) => `${xOf(r.a)},${yOf(r.muMax)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {rows.map((r) => (
        <circle key={r.a} cx={xOf(r.a)} cy={yOf(Math.min(maxY, r.muMax))} r={2.3} fill={ED.series1} />
      ))}
      <circle cx={xOf(IMP96080_CROSSING.aStar)} cy={yOf(1)} r={4} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
      <text x={xOf(IMP96080_CROSSING.aStar) + 6} y={yOf(1) - 6} fill={ED.series2} fontSize={9}>
        a*={IMP96080_CROSSING.aStar.toFixed(5)}
      </text>
    </AxisFrame>
  );
}

export default function Imp96080RouteISymbolAnatomyViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I: Toeplitz Symbol Anatomy and the mu_max(a) Crossing" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96080_HONEST_BANNER}
      </div>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Saturation status:</strong> on the pole-free Weil minimizer the
        remainder D_S is already 96.7% of the semilocal trace L_S at a = 0.5, rising to 99.71% at a = (ln3)/2 &mdash;
        the pencil eigenvalue mu_max(a) stays below 1 only by this shrinking margin. No unconditional Weil
        positivity past g-support ln 2 is obtained; D_S &le; L_S is an inequality between two explicit
        RH-free functionals saturated to 3 digits at (ln3)/2, not a gap-free identity.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route I semilocal S = {'{'}&infin;, 2{'}'} pencil D_S c = &mu; L_S c has Toeplitz symbol
        w(t) = 2&theta;&prime;(t) &minus; m<sub>2</sub>(t) (the symbol of Arch &minus; P<sub>2</sub> = L_S &minus; D_S).
        w is negative on the archimedean window [0, {IMP96080_ARCH_WINDOW.hi.toFixed(3)}) (shaded red, min{' '}
        {IMP96080_ARCH_WINDOW.minW.toFixed(3)}) and on six shrinking p = 2 resonance windows (shaded blue,
        widths {IMP96080_RESONANCE_WINDOWS[0].width.toFixed(3)} &rarr; {IMP96080_RESONANCE_WINDOWS[5].width.toFixed(3)}),
        where the pencil symbol &delta;&#770;<sub>S</sub>/L&#770;<sub>S</sub> exceeds 1.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Symbol w(t): archimedean window plus six p = 2 resonance windows
      </h3>
      <SymbolPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        mu_max(a; k = 0): no crossing below (ln3)/2, crosses 1 at a* = {IMP96080_CROSSING.aStar.toFixed(5)}
      </h3>
      <MuMaxPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> mu_max(a; k=0) rises monotonically
        and stays below 1 through a = (ln3)/2 (margin {IMP96080_CROSSING.marginAtLn3Half.toFixed(4)}), then
        crosses 1 at a* = {IMP96080_CROSSING.aStar.toFixed(5)} (2a* = {IMP96080_CROSSING.twoAStar.toFixed(4)},
        which is ln3 + 0.033) through an odd-parity vector that the true Weil form still keeps positive via
        the p = 3 term. The crossing vector&rsquo;s energy peaks inside the first p = 2 resonance window &mdash;
        the same window where w(t) is most negative &mdash; not near t = 0.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96080 baked
        viz-data (w(t) evaluated directly from the source module&rsquo;s exact closed-form weilSymbol; the
        resonance windows and mu_max(a) grid copied verbatim). {IMP96080_HONEST_BANNER}
      </div>
    </div>
  );
}
