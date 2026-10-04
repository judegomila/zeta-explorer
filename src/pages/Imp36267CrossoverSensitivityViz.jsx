import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY } from '../data/imp-36139-etrunc-coll-crossover-sensitivity.js';
import { ED } from '../styles/tokens.js';

const {
  grid,
  dlogNcross_dlogEtrunc_OLS,
  slope_R2,
  localSlope_halfFloorEdge,
  localSlope_doubleFloorEdge,
  closedFormExponent,
  N_cross_baseline,
  N_cross_halfFloor,
  N_cross_doubleFloor,
  N_cross_swing_x,
  decadeSpan_log10N,
  sigma_at_cross_invariant,
  E_trunc_baseline,
} = IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY;

const POINTS = grid.map((r) => ({
  ...r,
  log10_E_trunc: Math.log10(r.E_trunc),
}));

function CrossoverSensitivityChart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = POINTS.map((p) => p.log10_E_trunc);
  const ys = POINTS.map((p) => p.log10_N_cross);

  const xMin = Math.min(...xs) - 0.05;
  const xMax = Math.max(...xs) + 0.05;
  const yMin = Math.min(...ys) - 0.1;
  const yMax = Math.max(...ys) + 0.1;

  const px = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const py = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathD = POINTS.map((p, i) => {
    const x = px(p.log10_E_trunc);
    const y = py(p.log10_N_cross);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const baselineIdx = POINTS.findIndex((p) => p.ratio === 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />

      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} />
      {POINTS.map((p, i) => (
        <circle
          key={p.ratio}
          cx={px(p.log10_E_trunc)}
          cy={py(p.log10_N_cross)}
          r={i === baselineIdx ? 5.5 : 4}
          fill={i === baselineIdx ? ED.series7 : ED.series1}
        />
      ))}

      {baselineIdx >= 0 && (
        <text
          x={px(POINTS[baselineIdx].log10_E_trunc) + 8}
          y={py(POINTS[baselineIdx].log10_N_cross) - 8}
          fill={ED.series7}
          fontSize={9}
        >
          1.0x nominal (imp-35968)
        </text>
      )}

      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        log&#8321;&#8320; E_trunc
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        log&#8321;&#8320; N_cross
      </text>
    </svg>
  );
}

export default function Imp36267CrossoverSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_trunc = E_coll Crossover Height Power Law (imp-36267 / imp-36139)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-36139 swept the pinned E_trunc = 3.06e-5 (imp-2631) fixed-strip floor over a 9-point
        half-to-double grid and re-located the imp-35968 E_trunc = E_coll crossover N_cross at each
        rung. The crossover height obeys a clean log-log power law N_cross &sim; E_trunc
        <sup>{dlogNcross_dlogEtrunc_OLS.toFixed(3)}</sup> (OLS R&sup2; &asymp;{' '}
        {slope_R2.toFixed(6)}), fractionally steeper than the imp-33723 closed-form exponent{' '}
        {closedFormExponent}, and swings &asymp;{N_cross_swing_x.toFixed(1)}x ({decadeSpan_log10N.toFixed(2)}{' '}
        decades) across the 4x floor uncertainty range.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log&#8321;&#8320; N_cross vs log&#8321;&#8320; E_trunc across the imp-36139 9-point floor grid
      </p>
      <CrossoverSensitivityChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>floor ratio</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>E_trunc</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N_cross</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log&#8321;&#8320; N_cross</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>&sigma; at crossover</th>
          </tr>
        </thead>
        <tbody>
          {POINTS.map((p) => (
            <tr key={p.ratio} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.ratio.toFixed(3)}x</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.E_trunc}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.N_cross}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.log10_N_cross}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.sigma_at_cross}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The local endpoint slopes ({localSlope_halfFloorEdge.toFixed(3)} at the half-floor edge,{' '}
        {localSlope_doubleFloorEdge.toFixed(3)} at the double-floor edge) bracket the OLS mean
        slope tightly, confirming the near-perfect power law. sigma at the crossover stays &asymp;{' '}
        {sigma_at_cross_invariant.toFixed(4)} (just below 1/2) at every rung, so the imp-35337
        sigma = 1/2 landmark itself does not shift &mdash; only its N-location does. The baseline
        rung (E_trunc = {E_trunc_baseline}) reproduces the imp-35968 crossover N_cross &asymp;{' '}
        {N_cross_baseline}, ranging from &asymp;{N_cross_halfFloor} at the half floor down to
        &asymp;{N_cross_doubleFloor} at the double floor.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only, reusing the
        imp-36139 sensitivity sweep and the imp-35968 crossover bisector unchanged (only E_trunc is
        varied). The imp-35968 quote N_cross &asymp; 3.28e9 is a floor-sensitivity readout of the
        specific imp-2631 value, not an intrinsic landmark. C_C = (1/8) sqrt(3&nbsp;pi)
        (imp-2642 / imp-2643) and the C_mb GUE-conditional caveat (imp-486) are UNTOUCHED; imp-35337a
        stays OPEN; changes no bound, establishes no operator positivity, no RH verdict; NO QED.
      </div>
    </div>
  );
}
