import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT } from '../data/imp-34530-pole-leakage-spacing-compression-fit.js';
import { ED } from '../styles/tokens.js';

const {
  poleLocation,
  spacingPoints,
  fitExponent,
  fitCoefficient,
  fitR2,
  twentyFivePctRungExtrap,
  thirtyPctRungExtrap,
  twentyFivePctRungMeasured,
  thirtyPctRungMeasured,
  extrapError25,
  extrapError30,
} = IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT;

function LogLogFitChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const lx = spacingPoints.map((p) => Math.log10(p.poleDist));
  const ly = spacingPoints.map((p) => Math.log10(p.perPp));
  const xMin = Math.min(...lx) - 0.05;
  const xMax = Math.max(...lx) + 0.05;
  const yMin = Math.min(...ly) - 0.1;
  const yMax = Math.max(...ly) + 0.1;

  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const lnA = Math.log(fitCoefficient);
  const fitLine = [xMin, xMax].map((lxv) => {
    const dist = Math.pow(10, lxv);
    const lyv = (lnA + fitExponent * Math.log(dist)) / Math.LN10;
    return `${xS(lxv)},${yS(lyv)}`;
  }).join(' ');

  const xTicks = [xMin, (xMin + xMax) / 2, xMax];
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t, ti) => (
        <g key={'yt' + ti}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((t, ti) => (
        <text key={'xt' + ti} x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      <polyline points={fitLine} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="5 3" />

      {spacingPoints.map((p, i) => (
        <g key={'pt' + i}>
          <circle cx={xS(Math.log10(p.poleDist))} cy={yS(Math.log10(p.perPp))} r={4} fill={ED.series1} />
          <text
            x={xS(Math.log10(p.poleDist))}
            y={yS(Math.log10(p.perPp)) - 8}
            textAnchor="middle"
            fill={ED.series1}
            fontSize={8.5}
          >
            {p.perPp.toFixed(4)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(k* - k) -- pole distance
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(s) -- per-pp spacing
      </text>

      <rect x={padL + cW - 190} y={padT} width={10} height={10} fill={ED.series1} />
      <text x={padL + cW - 176} y={padT + 9} fill={ED.inkSoft} fontSize={9}>
        interval-midpoint spacing
      </text>
      <rect x={padL + cW - 190} y={padT + 14} width={16} height={2} fill={ED.brassDeco} />
      <text x={padL + cW - 170} y={padT + 18} fill={ED.inkSoft} fontSize={9}>
        fit s = A(k*-k)^{fitExponent.toFixed(3)}, R^2={fitR2.toFixed(3)}
      </text>
    </svg>
  );
}

function RungAxisChart() {
  const svgW = 720;
  const padL = 40;
  const padR = 40;
  const padT = 40;
  const padB = 50;
  const svgH = 180;
  const cW = svgW - padL - padR;

  const kMin = Math.min(twentyFivePctRungExtrap, twentyFivePctRungMeasured) - 0.15;
  const kMax = poleLocation + 0.15;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const rungs = [
    { label: '25% fit', k: twentyFivePctRungExtrap, y: padT + 20, color: ED.brass },
    { label: '25% bisect', k: twentyFivePctRungMeasured, y: padT + 20, color: ED.series3 },
    { label: '30% fit', k: thirtyPctRungExtrap, y: padT + 70, color: ED.brass },
    { label: '30% bisect', k: thirtyPctRungMeasured, y: padT + 70, color: ED.series3 },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + 95} x2={padL + cW} y2={padT + 95} stroke={ED.rule} strokeWidth={1.5} />

      <line
        x1={xS(poleLocation)}
        y1={padT - 20}
        x2={xS(poleLocation)}
        y2={padT + 95}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={xS(poleLocation)} y={padT - 26} textAnchor="middle" fill={ED.series2} fontSize={9}>
        k* = {poleLocation.toFixed(3)}
      </text>

      {rungs.map((r, i) => (
        <g key={'rung' + i}>
          <line x1={xS(r.k)} y1={r.y - 10} x2={xS(r.k)} y2={padT + 95} stroke={r.color} strokeWidth={1} />
          <circle cx={xS(r.k)} cy={r.y} r={4} fill={r.color} />
          <text x={xS(r.k)} y={r.y - 14} textAnchor="middle" fill={r.color} fontSize={8.5}>
            {r.label}
          </text>
          <text x={xS(r.k)} y={padT + 108} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.k.toFixed(3)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k axis (leak-percentage crossings vs the imp-34023 pole)
      </text>
    </svg>
  );
}

export default function Imp34530PoleLeakageSpacingCompressionFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pole-Leakage Per-pp Spacing: Near-Cubic Fit &amp; Extrapolation (imp-34530)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34530 fit the imp-34512 pole-leakage per-pp spacing compression to a power law
        s = A(k* - k)^p in the pole distance, recovering a near-CUBIC law (p ~ {fitExponent.toFixed(3)},
        A ~ {fitCoefficient.toExponential(2)}, R^2 ~ {fitR2.toFixed(3)}) against the four
        interval-midpoint spacing points, then integrated it forward to extrapolate the 25% and 30%
        leak-percentage rungs and validated against the directly-bisected crossings near the imp-34023
        pole k* ~ {poleLocation.toFixed(5)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log s vs log(k* - k) -- the four fitted interval-midpoint spacing points
      </p>
      <LogLogFitChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        fitted (25%/30%) rungs vs directly-bisected crossings -- a slight undershoot
      </p>
      <RungAxisChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>rung</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>fitted (extrap) k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bisected (measured) k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>error (decades)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>25%</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{twentyFivePctRungExtrap}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{twentyFivePctRungMeasured}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-2)' }}>{extrapError25}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>30%</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{thirtyPctRungExtrap}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{thirtyPctRungMeasured}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-2)' }}>{extrapError30}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / fit + threshold
        extrapolation only -- reuses the imp-34247 metric, imp-34188 y(k) surrogate, and imp-34023 pole
        verbatim; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
        operator positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
