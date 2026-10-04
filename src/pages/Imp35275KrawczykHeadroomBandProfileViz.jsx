import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE } from '../data/imp-35241-krawczyk-headroom-band-profile.js';
import { ED } from '../styles/tokens.js';

const D = IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE;
const M = D.measurement;
const C = D.constants;

// Rebuild the 200-point S(N) band profile from the recorded band endpoints and monotone-descent
// finding: S(N) descends linearly-in-appearance (imp-34929 closed-form dS/dN < 0) from the
// band-bottom value through N_cross to the band-top value. We only have the three anchor points
// recorded on the data module (band-bottom, N_cross, band-top), so the chart interpolates a
// piecewise-monotone curve through those three anchors rather than re-running the 200-point scan.
const ANCHORS = [
  { N: C.band_bottom_N, S: M.S_band_bottom, label: 'band-bottom' },
  { N: C.N_cross, S: M.S_N_cross, label: 'N_cross' },
  { N: C.band_top_N, S: M.S_band_top, label: 'band-top' },
];

function BandProfileChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 44;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = C.band_bottom_N;
  const xMax = C.band_top_N;
  const sInf = C.S_inf_floor;
  const safetyLine = C.safety_factor * 25.6; // local reference band (100x factor is far below, shown separately)
  const yMax = M.band_max_headroom_S + 5;
  const yMin = sInf - 10;

  const xOf = (N) => padL + ((N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (s) => padT + plotH - ((s - yMin) / (yMax - yMin)) * plotH;

  const path = ANCHORS.map((a, i) => `${i === 0 ? 'M' : 'L'} ${xOf(a.N)} ${yOf(a.S)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        S(N) = G/((1+G) &delta; FP_LO) across the imp-34693 admissible seed band
      </text>
      <line
        x1={padL}
        y1={yOf(sInf)}
        x2={padL + plotW}
        y2={yOf(sInf)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + 4} y={yOf(sInf) - 6} fill={ED.series2} fontSize={9}>
        S_inf floor = {sInf}
      </text>
      <path d={path} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      {ANCHORS.map((a) => (
        <circle key={a.label} cx={xOf(a.N)} cy={yOf(a.S)} r={4} fill={ED.brassDeco} />
      ))}
      {ANCHORS.map((a) => (
        <text
          key={`${a.label}-lbl`}
          x={xOf(a.N)}
          y={yOf(a.S) - 10}
          textAnchor={a.label === 'band-bottom' ? 'start' : a.label === 'band-top' ? 'end' : 'middle'}
          fill={ED.ink}
          fontSize={9}
        >
          {a.label}: {a.S.toFixed(2)}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N across the admissible band [{C.band_bottom_N.toExponential(3)}, {C.band_top_N.toExponential(3)}]
      </text>
      {[yMin, sInf, M.band_min_headroom_S, M.band_max_headroom_S, yMax].map((v) => (
        <text key={v} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(1)}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 12} r={3} fill={ED.brassDeco} />
        <text x={padL + 12} y={padT - 8} fill={ED.brass} fontSize={8.5}>
          measured anchor points (band-bottom / N_cross / band-top)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35275KrawczykHeadroomBandProfileViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Contraction-Validity Headroom Band Profile (imp-35275 / imp-35241)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35241 tabulated the Krawczyk contraction-validity headroom S(N)&nbsp;=&nbsp;G/((1+G)&nbsp;&delta;&nbsp;FP_LO)
        across the imp-34693 admissible seed band on a 200-point grid. S(N) descends monotonically
        from&nbsp;{M.S_band_bottom.toFixed(2)}&nbsp;at the band-bottom through&nbsp;{M.S_N_cross.toFixed(2)}&nbsp;at
        N_cross to&nbsp;{M.S_band_top.toFixed(2)}&nbsp;at the band-top, never touching the closed-form floor
        S_inf&nbsp;=&nbsp;{C.S_inf_floor}, clearing the {C.safety_factor}x safety factor by&nbsp;
        {M.band_top_safety_multiple.toFixed(2)}x even at the band-top worst case.
      </p>

      <BandProfileChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>anchor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>S(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap above floor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>x safety factor ({C.safety_factor}x)</th>
          </tr>
        </thead>
        <tbody>
          {ANCHORS.map((a) => (
            <tr key={a.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{a.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.N.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.S.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{(a.S - C.S_inf_floor).toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(a.S / C.safety_factor).toFixed(2)}x
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The closest approach to the S_inf&nbsp;=&nbsp;{C.S_inf_floor} floor within the band is at the
        band-top: S&nbsp;=&nbsp;{M.band_min_headroom_S.toFixed(2)} ({M.band_top_safety_multiple.toFixed(2)}x the
        {' '}{C.safety_factor}x factor), a residual&nbsp;{M.closest_approach_gap_above_floor.toFixed(2)}&nbsp;above
        the floor &mdash; the floor is approached strictly from above and never touched in-band.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35241
        measurement literals verbatim (no new computation). Measurement only on the inherited imp-3220/imp-3406
        surrogate; the imp-34714a machine certificate REMAINS OPEN and F(m)&nbsp;=&nbsp;0 stays a
        double-precision artifact; C_C&nbsp;1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486
        UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
