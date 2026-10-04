import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96298_PREF_SERIES,
  IMP96298_ANCHORS,
  IMP96298_HONEST_BANNER,
} from '../data/imp-96298-route-m-pref-at-rayleigh-viz-data.js';
import { ED } from '../styles/tokens.js';

function PrefAtRayleighChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = -1.5;
  const xMax = 1.5;
  const yMin = 0.3;
  const yMax = 1.0;

  const xOf = (logRho) => padL + ((logRho - xMin) / (xMax - xMin)) * plotW;
  const yOf = (pref) => padT + plotH - ((pref - yMin) / (yMax - yMin)) * plotH;

  const sorted = [...IMP96298_PREF_SERIES].sort((a, b) => a.logRho - b.logRho);
  const pathD = sorted
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.logRho).toFixed(2)} ${yOf(p.prefAtRayleigh).toFixed(2)}`)
    .join(' ');

  const xTicks = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
  const yTicks = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  const thresholdY = yOf(IMP96298_ANCHORS.confidentThreshold);
  const peakX = xOf(0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v.toFixed(1)}
        </text>
      ))}

      {/* AICc > 90% confident-separation threshold */}
      <line x1={padL} y1={thresholdY} x2={padL + plotW} y2={thresholdY} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={padL + plotW - 4} y={thresholdY - 4} textAnchor="end" fill={ED.brass} fontSize={8}>
        90% confident threshold
      </text>

      {/* equal-amplitude peak marker (rho = 1, log rho = 0) */}
      <line x1={peakX} y1={padT} x2={peakX} y2={padT + plotH} stroke={ED.series3} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={peakX + 4} y={padT + 12} fill={ED.series3} fontSize={8}>
        rho=1 (peak {IMP96298_ANCHORS.peakPref.toFixed(3)})
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />
      {sorted.map((p) => (
        <circle
          key={`d-${p.rho}`}
          cx={xOf(p.logRho)}
          cy={yOf(p.prefAtRayleigh)}
          r={p.isEqualAmplitude ? 4 : 2.6}
          fill={p.isEqualAmplitude ? ED.series3 : ED.series1}
        />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log(rho), rho = A4 / A5 (amplitude ratio)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>AICc two-tone preference at Rayleigh span L=10 (peaks at rho=1)</text>
      </g>
    </svg>
  );
}

export default function Imp96298PrefAtRayleighViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96264: Route M Two-Tone AICc Preference at the Rayleigh Span" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96298_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96248 measured the synthetic q4 + q5 two-tone AICc model-selection preference under the
        equal-amplitude assumption A4 = A5, finding confident (&gt;90%) separation at the Rayleigh
        span L = 10.0. imp-96264 tested whether that conclusion depends on the amplitude split by
        sweeping the ratio rho = A4/A5 at fixed total power, and measured the AICc two-tone
        preference exactly at the Rayleigh span for each ratio: prefAtRayleigh peaks at rho = 1
        (0.944) and falls off symmetrically with imbalance, dropping below the 90% confident
        threshold once |log rho| exceeds about ln(1.4).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        prefAtRayleigh vs log(rho) (peak at equal amplitude)
      </h3>
      <PrefAtRayleighChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the equal-amplitude point
        (rho = 1, green) is the only ratio that clears the 90% confident-separation threshold with
        the widest margin; the two extreme ratios (rho = 0.25 and rho = 4, a 4:1 amplitude
        imbalance) fall to roughly 0.45, far below confident separation at the Rayleigh span. This
        is the same conclusion as the imp-96264 sub-gap stated a different way: equal amplitudes is
        the most favorable case, so the imp-96248 Rayleigh-span requirement is a lower bound on
        what a real, possibly-imbalanced conductor pair would need.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96264
        baked ratio table verbatim (only the log(rho) axis reshaping is computed here). Route M
        off-lattice arithmetic per imp-96189, NOT a zero-tone measurement. Changes no bound,
        establishes no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
