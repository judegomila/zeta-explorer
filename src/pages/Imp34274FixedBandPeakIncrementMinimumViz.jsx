import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34274_FIXED_BAND_PEAK_ROWS,
  IMP34274_FIXED_BAND_INCREMENTS,
  IMP34274_INCREMENT_MINIMUM,
  IMP34274_INCREMENT_MINIMUM_STEP_KEND,
  IMP34274_COARSE_MINIMUM_STEP_KEND,
  IMP34274_COARSE_MINIMUM_INCREMENT,
  IMP34274_INFLECTION_KEND,
  IMP34274_REACCEL_BRANCH,
} from '../data/imp-34274-fixed-band-peak-increment-minimum-viz-data.js';
import { ED } from '../styles/tokens.js';

// Panel 1: the fixed-band (k<=10) peak over the 11 refined 0.25-step windows,
// climbing monotonically from +0.648552 (kEnd=17.0) to +0.824645 (kEnd=19.5).
function PeakChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 17.0;
  const maxX = 19.5;
  const minY = 0.63;
  const maxY = 0.84;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34274_FIXED_BAND_PEAK_ROWS.map((r) => `${xAt(r.kEnd)},${yAt(r.peak)}`).join(' ');
  const xTicks = [17.0, 17.5, 18.0, 18.5, 19.0, 19.5];
  const yTicks = [0.65, 0.7, 0.75, 0.8];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (window right edge)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        fixed-band (k&le;10) peak
      </text>

      <polyline points={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP34274_FIXED_BAND_PEAK_ROWS.map((r) => (
        <circle key={'pt' + r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.peak)} r={3.5} fill="#c4b5fd" stroke={ED.paper} strokeWidth={0.75} />
      ))}
    </svg>
  );
}

// Panel 2: the 10 increments, dipping to a minimum at the kEnd 18.50 -> 18.75 step
// then re-increasing, with the parabolic inflection kEnd* ~ 18.6447 marked.
function IncrementMinimumChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kEndsRight = IMP34274_FIXED_BAND_PEAK_ROWS.slice(1).map((r) => r.kEnd); // right endpoint of each increment step
  const minX = 17.15;
  const maxX = 19.6;
  const minY = 0.0155;
  const maxY = 0.019;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = kEndsRight.map((k, i) => `${xAt(k)},${yAt(IMP34274_FIXED_BAND_INCREMENTS[i])}`).join(' ');
  const xTicks = [17.25, 17.75, 18.25, 18.75, 19.25];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT} x2={xAt(k)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (right endpoint of each increment step)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        fixed-band peak increment
      </text>

      <line
        x1={xAt(IMP34274_INFLECTION_KEND)}
        y1={padT}
        x2={xAt(IMP34274_INFLECTION_KEND)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={xAt(IMP34274_INFLECTION_KEND) + 4} y={padT + 12} fill={ED.series2} fontSize={9}>
        kEnd* &asymp; {IMP34274_INFLECTION_KEND.toFixed(4)} (inflection)
      </text>

      <polyline points={path} fill="none" stroke={ED.series3} strokeWidth={1.75} />
      {kEndsRight.map((k, i) => (
        <circle
          key={'pt' + k}
          cx={xAt(k)}
          cy={yAt(IMP34274_FIXED_BAND_INCREMENTS[i])}
          r={3}
          fill={k === IMP34274_INCREMENT_MINIMUM_STEP_KEND ? ED.series2 : ED.series3}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp34274FixedBandPeakIncrementMinimumViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Peak Increment Minimum & Sub-Window Inflection (imp-34274 / imp-34196)" />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-faint)' }}>
          &larr; back to the M2-ceiling cohort index
        </Link>
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34196 refined the imp-34109 fixed-band (k&le;10) peak sweep to a 0.25 kEnd grid
        (the imp-33810 ladder rung spacing) over kEnd = 17.0 .. 19.5. The peak climbs
        monotonically {IMP34274_FIXED_BAND_PEAK_ROWS[0].peak.toFixed(6)} &rarr;{' '}
        {IMP34274_FIXED_BAND_PEAK_ROWS[IMP34274_FIXED_BAND_PEAK_ROWS.length - 1].peak.toFixed(6)},
        and its 10 increments dip to a MINIMUM {IMP34274_INCREMENT_MINIMUM.toFixed(6)} at the
        kEnd {IMP34274_COARSE_MINIMUM_STEP_KEND.toFixed(2)} &rarr; {IMP34274_INCREMENT_MINIMUM_STEP_KEND.toFixed(2)} step
        before re-increasing -- half a window LATER than the imp-34109 coarse 0.5-grid read
        (minimum {IMP34274_COARSE_MINIMUM_INCREMENT.toFixed(5)} at the same 18.0 &rarr; 18.5 step).
        A 3-point parabolic vertex places the deceleration-to-re-acceleration inflection at
        kEnd* &asymp; {IMP34274_INFLECTION_KEND.toFixed(4)}, and the post-minimum branch is
        CONVEX (increment slope +{IMP34274_REACCEL_BRANCH.slope.toFixed(6)}, R&sup2; &asymp;{' '}
        {IMP34274_REACCEL_BRANCH.r2.toFixed(4)}), refuting delayed saturation.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fixed-band (k&le;10) peak over the 11 refined 0.25-step windows -- climbing monotonically
      </p>
      <PeakChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        peak increments dipping to a minimum then re-increasing -- the sub-window inflection
      </p>
      <IncrementMinimumChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>fixed-band peak</th>
          </tr>
        </thead>
        <tbody>
          {IMP34274_FIXED_BAND_PEAK_ROWS.map((r) => (
            <tr key={r.kEnd} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEnd.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.peak.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34196 measurement; no new derivation, no bound changed.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Same fixed-band-peak cohort:</strong> this page's
        kEnd = 17.0 .. 19.5 refinement sits below the canonical kEnd* &asymp; 21.281 point where
        the imp-34023 M2 sub-leading residual bisects to zero -- the fixed-band peak keeps
        climbing all the way to that pole edge (imp-34237 covers the last three computable
        windows immediately before it). Cross-linked here for context only; no bound or claim
        on this page changes. See the{' '}
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-soft)' }}>
          full M2-ceiling cohort index
        </Link>{' '}
        for the other viz surfaces sharing this ceiling.
      </div>
    </div>
  );
}
