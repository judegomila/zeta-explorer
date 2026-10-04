import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96058_FEJER_CEILING_LADDER,
  IMP96058_FEJER_LIMIT,
  IMP96058_CLASSICAL_341,
  IMP96058_MOSSINGHOFF_TRUDGIAN_2015,
  IMP96058_MT_GAP_BELOW_FEJER_FLOOR,
  IMP96058_MT_GAP_PCT,
} from '../data/imp-96058-fejer-ceiling-floor-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const LADDER_COLOR = ED.series1;
const LIMIT_COLOR = ED.series4;
const CLASSICAL_COLOR = ED.series5;
const MT_COLOR = ED.series3;

function FejerFloorChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  // degree n on a log scale (2 .. 100), R on a linear scale (0 .. 38, room for classical 34.82)
  const nMin = 2;
  const nMax = 100;
  const rMin = 0;
  const rMax = 38;

  const xS = (n) => padL + ((Math.log(n) - Math.log(nMin)) / (Math.log(nMax) - Math.log(nMin))) * cW;
  const yS = (r) => padT + cH * (1 - (r - rMin) / (rMax - rMin));

  const linePath = IMP96058_FEJER_CEILING_LADDER
    .map((row, i) => (i === 0 ? 'M' : 'L') + xS(row.n).toFixed(1) + ',' + yS(row.rFloor).toFixed(1))
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 5, 10, 15, 20, 25, 30, 35].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* pure-scheme Fejer limit asymptote R = 5.8284 */}
      <line
        x1={padL}
        y1={yS(IMP96058_FEJER_LIMIT.R)}
        x2={padL + cW}
        y2={yS(IMP96058_FEJER_LIMIT.R)}
        stroke={LIMIT_COLOR}
        strokeWidth={1}
        strokeDasharray="2,2"
      />
      <text x={padL + 4} y={yS(IMP96058_FEJER_LIMIT.R) - 6} fill={LIMIT_COLOR} fontSize={9}>
        pure-scheme limit R = {IMP96058_FEJER_LIMIT.R}
      </text>

      {/* classical 3-4-1 point (n = 2, R = 34.821) */}
      <circle cx={xS(2)} cy={yS(IMP96058_CLASSICAL_341.R)} r={4.5} fill={CLASSICAL_COLOR} stroke="#241a3d" strokeWidth={1} />
      <text x={xS(2) + 8} y={yS(IMP96058_CLASSICAL_341.R) + 3} fill={CLASSICAL_COLOR} fontSize={9}>
        classical 3-4-1, R = {IMP96058_CLASSICAL_341.R}
      </text>

      {/* Mossinghoff-Trudgian marker, below the pure-scheme floor */}
      <line
        x1={padL}
        y1={yS(IMP96058_MOSSINGHOFF_TRUDGIAN_2015)}
        x2={padL + cW}
        y2={yS(IMP96058_MOSSINGHOFF_TRUDGIAN_2015)}
        stroke={MT_COLOR}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yS(IMP96058_MOSSINGHOFF_TRUDGIAN_2015) + 13} fill={MT_COLOR} fontSize={9}>
        Mossinghoff-Trudgian (2015), R = {IMP96058_MOSSINGHOFF_TRUDGIAN_2015}
      </text>

      <path d={linePath} fill="none" stroke={LADDER_COLOR} strokeWidth={2} />
      {IMP96058_FEJER_CEILING_LADDER.map((row) => (
        <circle key={row.n} cx={xS(row.n)} cy={yS(row.rFloor)} r={4} fill={LADDER_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[2, 4, 8, 16, 40, 100].map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        trig-polynomial degree n (log scale)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        R_floor(n) = 1/c_ceil(n)
      </text>
    </svg>
  );
}

function LadderTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>degree n</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>max a_1/a_0</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>c_ceil</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>R_floor</th>
        </tr>
      </thead>
      <tbody>
        {IMP96058_FEJER_CEILING_LADDER.map((row) => (
          <tr key={row.n} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{row.n}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{row.a1a0.toFixed(6)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{row.cCeil.toFixed(6)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: LADDER_COLOR }}>{row.rFloor.toFixed(4)}</td>
          </tr>
        ))}
        <tr>
          <td style={{ padding: '0.35rem 0.5rem' }}>&#8734;</td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>&#8730;2</td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{IMP96058_FEJER_LIMIT.c}</td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: LIMIT_COLOR }}>{IMP96058_FEJER_LIMIT.R}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Imp96058FejerCeilingFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Route J Fejer Zero-Free-Region Floor Ladder (imp-96058)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Route J engine (ii) bounds the Landau-pole zero-free region beta &le; 1 - c/log t via a
        nonnegative trigonometric polynomial P(theta) = sum a_k cos(k theta) &ge; 0 of degree n.
        Fejer's inequality caps a_1/a_0 &le; 2cos(pi/(n+2)), which caps c &le; c_ceil(n) and floors
        R = 1/c_ceil(n). As n grows the floor descends MONOTONICALLY toward the pure-scheme limit
        R = {IMP96058_FEJER_LIMIT.R} (c = {IMP96058_FEJER_LIMIT.c} = 2(1-1/&#8730;2)&sup2;). The
        classical de la Vallee Poussin 3-4-1 polynomial (degree n = 2) reproduces R =
        {' '}{IMP96058_CLASSICAL_341.R}; Mossinghoff-Trudgian (2015) reaches R =
        {' '}{IMP96058_MOSSINGHOFF_TRUDGIAN_2015}, which is {IMP96058_MT_GAP_PCT}% (
        {IMP96058_MT_GAP_BELOW_FEJER_FLOOR.toFixed(6)}) BELOW the pure-scheme floor via a different
        (Stechkin/Heath-Brown) weighting scheme, not a larger-degree Fejer polynomial.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_floor(n) descending to the 5.8284 pure-scheme limit, with the classical 3-4-1 and
        Mossinghoff-Trudgian markers
      </p>
      <FejerFloorChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Ladder values (verbatim from ROUTE_J.fejerCeiling)
      </p>
      <LadderTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only -- charts
        the ROUTE_J Fejer ceiling ladder already baked in
        rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js. Changes no bound;
        the classical c/log t FORM (Landau pole) is the invariant across every weighting
        scheme, including Mossinghoff-Trudgian's tighter constant. RH open; NO QED.
      </div>
    </div>
  );
}
