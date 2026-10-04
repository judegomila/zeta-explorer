import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96060_LITTLEWOOD_VS_JENSEN, IMP96060_HEADLINE } from '../data/imp-96060-littlewood-jensen-loss-viz-data.js';
import { ED } from '../styles/tokens.js';

const I_COLOR = ED.series1;
const J1_COLOR = ED.series4;

function LittlewoodJensenChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  // T on a linear scale (50 .. 500); |I(T)| and J_1(T) on a log scale (0.1 .. 500) since J_1 spans
  // two orders of magnitude more than |I|
  const tMin = 50;
  const tMax = 500;
  const vMin = 0.1;
  const vMax = 500;

  const xS = (t) => padL + ((t - tMin) / (tMax - tMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - Math.log10(vMin)) / (Math.log10(vMax) - Math.log10(vMin)));

  const iPath = IMP96060_LITTLEWOOD_VS_JENSEN
    .map((row, i) => (i === 0 ? 'M' : 'L') + xS(row.T).toFixed(1) + ',' + yS(Math.abs(row.I)).toFixed(1))
    .join(' ');
  const jPath = IMP96060_LITTLEWOOD_VS_JENSEN
    .map((row, i) => (i === 0 ? 'M' : 'L') + xS(row.T).toFixed(1) + ',' + yS(row.J1).toFixed(1))
    .join(' ');

  const gridVals = [0.1, 1, 10, 100];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {gridVals.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <path d={jPath} fill="none" stroke={J1_COLOR} strokeWidth={2} />
      {IMP96060_LITTLEWOOD_VS_JENSEN.map((row) => (
        <circle key={'j' + row.T} cx={xS(row.T)} cy={yS(row.J1)} r={4} fill={J1_COLOR} stroke="#3a2a06" strokeWidth={1} />
      ))}

      <path d={iPath} fill="none" stroke={I_COLOR} strokeWidth={2} />
      {IMP96060_LITTLEWOOD_VS_JENSEN.map((row) => (
        <circle key={'i' + row.T} cx={xS(row.T)} cy={yS(Math.abs(row.I))} r={4} fill={I_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <text x={padL + cW - 4} y={yS(IMP96060_LITTLEWOOD_VS_JENSEN[4].J1) - 8} textAnchor="end" fill={J1_COLOR} fontSize={9}>
        Jensen bound J_1(T)
      </text>
      <text x={padL + cW - 4} y={yS(Math.abs(IMP96060_LITTLEWOOD_VS_JENSEN[4].I)) + 14} textAnchor="end" fill={I_COLOR} fontSize={9}>
        |Littlewood I(T)|
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[50, 100, 150, 200, 500].map((t) => (
        <g key={'x' + t}>
          <line x1={xS(t)} y1={padT + cH} x2={xS(t)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(t)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        height T
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        value (log scale)
      </text>
    </svg>
  );
}

function LossTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>T</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>I(T)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>J_1(T)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>loss J_1/|I|</th>
        </tr>
      </thead>
      <tbody>
        {IMP96060_LITTLEWOOD_VS_JENSEN.map((row) => (
          <tr key={row.T} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{row.T}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: I_COLOR }}>{row.I.toFixed(6)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: J1_COLOR }}>{row.J1.toFixed(6)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{row.loss.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96060LittlewoodJensenLossViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Route K Littlewood I(T) vs Jensen-from-Moments Bound (imp-96060)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Littlewood's lemma writes I(T) := integral_0^T log|zeta(1/2+it)| dt as a sum over zeros with
        Re(rho) &gt; 1/2, so RH is equivalent to I(T) = O(log T). The only known moment-to-I(T)
        bridge is Jensen's inequality, I(T) &le; (T/2k) log(M_k(T)/T). At T = {IMP96060_HEADLINE.T},
        |I(T)| = {IMP96060_HEADLINE.absI} while the first-moment Jensen bound J_1(T) =
        {' '}{IMP96060_HEADLINE.J1}, a loss factor of {IMP96060_HEADLINE.loss.toFixed(0)}x. The loss
        widens with T (J_1 grows like (T/2) log log T while |I(T)|/log T shrinks): moments constrain
        zeros only through Littlewood's INTEGRATED lemma, never pointwise.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |I(T)| (flat/shrinking, O(1)) vs the Jensen bound J_1(T) (growing) on a log value axis
      </p>
      <LittlewoodJensenChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Ladder values (verbatim from ROUTE_K.littlewoodVsJensen)
      </p>
      <LossTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only -- charts the
        ROUTE_K Littlewood-vs-Jensen ladder already baked in
        rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js. Changes no bound; the wall is
        Jensen/integration, distinct from Weil positivity; ceiling is Lindelof implies Density
        Hypothesis. RH open; NO QED.
      </div>
    </div>
  );
}
