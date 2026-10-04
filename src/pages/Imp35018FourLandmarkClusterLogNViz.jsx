import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35018_ORDERED_LOCATORS,
  IMP35018_ADMISSIBLE_BAND,
  IMP35018_PAIRWISE_SPREADS,
  IMP35018_N_MIN,
  IMP35018_N_MAX,
} from '../data/imp-35018-four-landmark-cluster-log-n-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// One shared log-N axis: the three point-landmarks as ticks, plus the imp-34693 admissible
// seed band as a shaded interval underneath, with pairwise relative spreads annotated.
function LandmarkClusterLogAxis() {
  const svgW = 640;
  const svgH = 220;
  const padL = 60;
  const padR = 60;
  const padT = 60;
  const padB = 60;
  const cW = svgW - padL - padR;
  const axisY = padT + (svgH - padT - padB) / 2;

  const log10Min = Math.log10(IMP35018_N_MIN);
  const log10Max = Math.log10(IMP35018_N_MAX);
  const span = log10Max - log10Min;
  const pad = span * 0.25;
  const domainMin = log10Min - pad;
  const domainMax = log10Max + pad;
  const xAt = (n) => padL + ((Math.log10(n) - domainMin) / (domainMax - domainMin)) * cW;

  const xBandLo = xAt(IMP35018_ADMISSIBLE_BAND.lo);
  const xBandHi = xAt(IMP35018_ADMISSIBLE_BAND.hi);

  const points = IMP35018_ORDERED_LOCATORS.map((l, i) => ({
    ...l,
    x: xAt(l.N),
    labelUp: i % 2 === 0,
  }));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* imp-34693 admissible seed band, shaded */}
      <rect
        x={xBandLo}
        y={axisY - 16}
        width={xBandHi - xBandLo}
        height={32}
        fill={alpha(ED.series1, 0.12)}
        stroke={alpha(ED.series1, 0.4)}
        strokeWidth={1}
      />
      <text x={(xBandLo + xBandHi) / 2} y={axisY + 34} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
        imp-34693 admissible seed band
      </text>

      {/* shared axis */}
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />

      {/* locator ticks */}
      {points.map((p) => (
        <g key={p.key}>
          <line x1={p.x} y1={axisY - 6} x2={p.x} y2={axisY + 6} stroke={ED.inkSoft} strokeWidth={1.5} />
          <circle cx={p.x} cy={axisY} r={4} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
          <text
            x={p.x}
            y={p.labelUp ? axisY - 26 : axisY + 46}
            textAnchor="middle"
            fill={ED.ink}
            fontSize={9.5}
            dominantBaseline={p.labelUp ? 'auto' : 'hanging'}
          >
            {p.label}
          </text>
          <text
            x={p.x}
            y={p.labelUp ? axisY - 14 : axisY + 58}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={8}
            dominantBaseline={p.labelUp ? 'auto' : 'hanging'}
          >
            {p.N.toExponential(4)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp35018FourLandmarkClusterLogNViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Four-Landmark 3.3e9 Cluster on One Shared Log-N Axis (imp-35018 / imp-35009)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35009 tabulated four landmarks that cluster near N &asymp; 3.3e9 -- the imp-33723
        Banach fixed point N_cross, the imp-33582 sigma=1/2 halving landmark N_half, the
        imp-33721 sigmoid-inflection knee N_star, and the imp-34693 admissible Picard seed band
        around N_cross -- but never placed them on one shared axis. This viz plots the three
        point-landmarks on a log-N axis with the seed band shaded beneath them.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        shared log-N axis: halving landmark, Banach fixed point, sigmoid knee, admissible seed band
      </p>
      <LandmarkClusterLogAxis />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>locator</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP35018_ORDERED_LOCATORS.map((l) => (
            <tr key={l.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{l.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{l.N.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{l.source}</td>
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>{IMP35018_ADMISSIBLE_BAND.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              [{IMP35018_ADMISSIBLE_BAND.lo.toExponential(4)}, {IMP35018_ADMISSIBLE_BAND.hi.toExponential(4)}]
            </td>
            <td style={{ padding: '0.4rem 0.6rem' }}>{IMP35018_ADMISSIBLE_BAND.source}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Pairwise relative spreads: N_half vs N_cross &asymp;{' '}
        {(IMP35018_PAIRWISE_SPREADS.half_vs_cross_rel * 100).toFixed(2)}%, N_cross vs N_star &asymp;{' '}
        {(IMP35018_PAIRWISE_SPREADS.cross_vs_star_rel * 100).toFixed(2)}%, N_half vs N_star &asymp;{' '}
        {(IMP35018_PAIRWISE_SPREADS.half_vs_star_rel * 100).toFixed(2)}% -- all landmarks sit within the
        shaded admissible seed band.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, every locator
        and band value reused verbatim from imp-33723 / imp-33582 / imp-33721 / imp-34693 (all
        inherited from the imp-3220/imp-3406 surrogate crossover map) -- no recomputation.
        Reader-facing diagnostic, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
        is UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO
        QED.
      </div>
    </div>
  );
}
