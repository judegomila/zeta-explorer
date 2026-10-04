import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34378_WS,
  IMP34378_RATIOS,
  IMP34378_PEAK_IS_ENDPOINT,
  IMP34378_AMPLITUDE_RATIO_CEILING,
  IMP34378_MAX_RATIO,
  IMP34378_MAX_RATIO_W,
  IMP34378_CROSSOVER_W,
  IMP34378_CROSSOVER_PEAK_K,
  IMP34378_LAST_ROW_RATIO,
} from '../data/imp-34378-trough-peak-ratio-ceiling-viz-data.js';
import { ED } from '../styles/tokens.js';

// |trough|/|peak| ratio vs. window width w -- rises to ~0.907 at w=9.25 (endpoint-locked regime,
// gold points), then recedes to ~0.618 by w=14 once the argmax migrates to the near-left rung
// (violet points, w >= 9.5). The dashed line marks the amplitude ceiling of 1 the ratio never reaches.
function RatioVsWidthChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 6.7;
  const maxX = 14.3;
  const minY = 0.55;
  const maxY = 1.02;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34378_WS.map((w, i) => `${xAt(w)},${yAt(IMP34378_RATIOS[i])}`).join(' ');
  const xTicks = [7, 8, 9, 10, 11, 12, 13, 14];
  const yTicks = [0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {xTicks.map((w) => (
        <g key={'x' + w}>
          <line x1={xAt(w)} y1={padT + cH - 4} x2={xAt(w)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(w)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {w}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        window width w = kEnd - 6
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        |trough| / |peak| ratio
      </text>

      <line
        x1={padL}
        y1={yAt(IMP34378_AMPLITUDE_RATIO_CEILING)}
        x2={padL + cW}
        y2={yAt(IMP34378_AMPLITUDE_RATIO_CEILING)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="6,3"
      />
      <text x={padL + cW - 4} y={yAt(IMP34378_AMPLITUDE_RATIO_CEILING) - 6} textAnchor="end" fill={ED.series2} fontSize={9}>
        amplitude ceiling = 1 (never reached)
      </text>

      <line
        x1={xAt(IMP34378_CROSSOVER_W)}
        y1={padT}
        x2={xAt(IMP34378_CROSSOVER_W)}
        y2={padT + cH}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(IMP34378_CROSSOVER_W) + 4} y={padT + 12} fill={ED.inkSoft} fontSize={9}>
        w={IMP34378_CROSSOVER_W} argmax jumps to k={IMP34378_CROSSOVER_PEAK_K}
      </text>

      <polyline points={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP34378_WS.map((w, i) => (
        <circle
          key={'pt' + w}
          cx={xAt(w)}
          cy={yAt(IMP34378_RATIOS[i])}
          r={w === IMP34378_MAX_RATIO_W ? 4.5 : 3}
          fill={w === IMP34378_MAX_RATIO_W ? ED.brassDeco : IMP34378_PEAK_IS_ENDPOINT[i] ? '#c4b5fd' : ED.series5}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp34378TroughPeakRatioCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Trough/Peak Ratio Ceiling: Rise, Cap, and Regime-Change Recede (imp-34378 / imp-34288)" />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-faint)' }}>
          &larr; back to the M2-ceiling cohort index
        </Link>
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 740 }}>
        imp-34214 refuted convergence of the imp-34085 |trough|/|peak| amplitude ratio: across
        window width w = 5.0 .. 7.0 it crept with GROWING increments and both saturating fit forms
        pinned to non-physical limits r_inf &sim; 6.0 / 3.8, far above the ceiling of 1 a literal
        amplitude ratio cannot exceed. imp-34288 extended the grid past w = 7 and found the ratio
        keeps climbing to a maximum &sim;{IMP34378_MAX_RATIO.toFixed(4)} at w =
        {' '}{IMP34378_MAX_RATIO_W}, SATURATES below the ceiling of 1 (no overshoot), then turns back
        down to &sim;{IMP34378_LAST_ROW_RATIO.toFixed(4)} by w = 14. The turnaround is a REGIME
        CHANGE, not a physical bound: the argmax peak stays locked to the receding right endpoint
        through the maximum, then at w = {IMP34378_CROSSOVER_W} jumps to the near-left rung k
        {' '}&asymp; {IMP34378_CROSSOVER_PEAK_K} and stays there, after which the left-endpoint peak
        grows quickly while the interior trough saturates, pulling the ratio back down.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |trough|/|peak| ratio vs. window width w -- endpoint-locked climb (violet) peaks at w=
        {IMP34378_MAX_RATIO_W} (gold), then recedes once the argmax relocates (w &ge;{' '}
        {IMP34378_CROSSOVER_W})
      </p>
      <RatioVsWidthChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34288 measurement; no new derivation, no bound changed.
        Descriptive OLS surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Same fixed-band-peak cohort:</strong> the argmax
        relocation seen here (to the near-left rung k &asymp; 6.5) is the same regime change
        characterized in the imp-34369 peak-relocation ticket. Cross-linked here for context
        only; no bound or claim on this page changes. See the{' '}
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-soft)' }}>
          full M2-ceiling cohort index
        </Link>{' '}
        for the other viz surfaces sharing this ceiling.
      </div>
    </div>
  );
}
