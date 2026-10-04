import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35772_LANDMARK_GRID,
  IMP35772_PREFACTOR_RATIO,
  IMP35772_SLOPE_STD,
  IMP35772_SLOPE_CC,
} from '../data/imp-35772-collision-scale-prefactor-propagation-viz-data.js';
import { ED } from '../styles/tokens.js';

const STD_COLOR = ED.series7;
const CC_COLOR = ED.series1;

function LandmarkChart({ rows }) {
  const w = 720;
  const h = 260;
  const padL = 64;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const logX = (N) => Math.log10(N);
  const logY = (s) => Math.log10(s);
  const xMin = logX(rows[0].N) - 0.3;
  const xMax = logX(rows[rows.length - 1].N) + 0.3;
  const allS = rows.flatMap((r) => [r.sMinStd, r.sMinCC]);
  const yMin = Math.min(...allS.map(logY)) - 0.2;
  const yMax = Math.max(...allS.map(logY)) + 0.2;
  const xPix = (N) => padL + ((logX(N) - xMin) / (xMax - xMin)) * plotW;
  const yPix = (s) => padT + plotH - ((logY(s) - yMin) / (yMax - yMin)) * plotH;

  const stdPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.N)},${yPix(r.sMinStd)}`).join(' ');
  const ccPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.N)},${yPix(r.sMinCC)}`).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={ED.paper} rx={2} />

      <path d={ccPath} fill="none" stroke={CC_COLOR} strokeWidth={2} />
      <path d={stdPath} fill="none" stroke={STD_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <g key={r.label}>
          <line x1={xPix(r.N)} x2={xPix(r.N)} y1={yPix(r.sMinCC)} y2={yPix(r.sMinStd)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
          <circle cx={xPix(r.N)} cy={yPix(r.sMinCC)} r={3.5} fill={CC_COLOR} />
          <circle cx={xPix(r.N)} cy={yPix(r.sMinStd)} r={3.5} fill={STD_COLOR} />
          <text x={xPix(r.N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {r.label} ({r.N.toExponential(2)})
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + plotH / 2})`}>
        s_min (log scale)
      </text>
      <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>
    </svg>
  );
}

function LandmarkTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>s_min (std, c=&pi;&sup2;/3)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>s_min (C_C)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>ratio</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(3)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: STD_COLOR }}>
              {r.sMinStd.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: CC_COLOR }}>
              {r.sMinCC.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {(r.sMinCC / r.sMinStd).toFixed(4)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35772CollisionScalePrefactorPropagationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Collision-Scale Prefactor Propagation Onto Sigma-Landmarks (imp-35772 / imp-35724)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35724 propagated the imp-35696 cube-root collision-scale prefactor
        ((&pi;&sup2;/3)/C_C)<sup>1/3</sup> &asymp; {IMP35772_PREFACTOR_RATIO.toFixed(4)} onto
        the two imp-35337 sigma-landmark heights: N_peak (the interior flat-cap
        sigma peak) and N_cross (the E_coll = E_trunc crossover, imp-35304). At
        both landmarks, reading C_C = (1/8)&radic;(3&pi;) in place of the standard
        &pi;&sup2;/3 lifts the smallest-gap scale s_min by the SAME O(1) factor
        &asymp;{IMP35772_PREFACTOR_RATIO.toFixed(4)}, while leaving the -1/3 log-log
        slope of s_min against N untouched.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        s_min(N) under the standard coefficient vs C_C, at both landmarks
      </h3>
      <LandmarkChart rows={IMP35772_LANDMARK_GRID} />

      <div style={{ marginTop: '1.5rem' }}>
        <LandmarkTable rows={IMP35772_LANDMARK_GRID} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The two-landmark log-log slope of s_min against N is {IMP35772_SLOPE_STD.toFixed(4)} for
        the standard reading and {IMP35772_SLOPE_CC.toFixed(4)} for the C_C reading &mdash;
        both reproducing the Ben Arous&ndash;Bourgade s_min &sim; M<sup>-1/3</sup> exponent.
        The coefficient choice is a pure amplitude shift (N cancels in the ratio);
        the exponent is unaffected.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of
        the already-derived imp-35724 propagation measurement (no new derivation, no
        heavy data-module import); C_mb GUE-conditional (imp-486) UNTOUCHED; changes no
        bound, establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
