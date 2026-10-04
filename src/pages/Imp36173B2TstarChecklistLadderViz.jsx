import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36173_B2_TSTAR_CHECKLIST_LADDER } from '../data/imp-36173-b2-tstar-checklist-ladder.js';
import { ED } from '../styles/tokens.js';

function TstarLadderChart() {
  const svgW = 700;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const rows = IMP36173_B2_TSTAR_CHECKLIST_LADDER.ladder;
  const log10PT = Math.log10(IMP36173_B2_TSTAR_CHECKLIST_LADDER.ptHeight);

  const xMin = Math.log10(rows[0].N);
  const xMax = Math.log10(rows[rows.length - 1].N) + 0.15;
  const yMin = 3; // log10(T_star) floor, just under the N=2458 rung
  const yMax = log10PT + 0.4;

  const xS = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * cW;
  const yS = (log10T) => padT + cH * (1 - (log10T - yMin) / (yMax - yMin));

  const path = rows
    .map((r, i) => (i === 0 ? 'M' : 'L') + xS(Math.log10(r.N)).toFixed(1) + ',' + yS(r.log10_T_star).toFixed(2))
    .join(' ');

  const xTicks = [4, 6, 8, 10, 12, 13.09];
  const yTicks = [4, 6, 8, 10, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}

      {/* Platt-Trudgian verified-height crossover, imp-327 / bridge-lambda-rh */}
      <line
        x1={padL}
        y1={yS(log10PT)}
        x2={padL + cW}
        y2={yS(log10PT)}
        stroke={ED.brassDeco}
        strokeWidth={1.4}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yS(log10PT) - 5} fill={ED.brass} fontSize={8.5}>
        Platt-Trudgian verified height 3e12
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2.2} />

      {rows.map((r) => (
        <g key={r.N}>
          <circle
            cx={xS(Math.log10(r.N))}
            cy={yS(r.log10_T_star)}
            r={r.belowPT ? 3.2 : 4.4}
            fill={r.belowPT ? ED.series1 : ED.brassDeco}
          />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xS(t)} y1={padT + cH} x2={xS(t)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t === 13.09 ? '13.09*' : t}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N (imp-36173 ladder, * = PT-scale rung)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        log10 T_star(N)
      </text>
    </svg>
  );
}

function LadderTable() {
  const rows = IMP36173_B2_TSTAR_CHECKLIST_LADDER.ladder;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '4px 8px' }}>N</th>
          <th style={{ padding: '4px 8px' }}>T_star(N)</th>
          <th style={{ padding: '4px 8px' }}>decades vs PT (3e12)</th>
          <th style={{ padding: '4px 8px' }}>label</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '4px 8px' }}>{r.N.toExponential(3)}</td>
            <td style={{ padding: '4px 8px' }}>{r.T_star.toExponential(3)}</td>
            <td style={{ padding: '4px 8px' }}>{r.decades_vs_PT_height.toFixed(2)}</td>
            <td style={{ padding: '4px 8px', color: r.belowPT ? 'var(--ink-faint)' : 'var(--brass)' }}>
              RH-up-to-height {r.T_star.toExponential(2)} {r.belowPT ? '(below PT)' : '(reaches PT)'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp36173B2TstarChecklistLadderViz() {
  const data = IMP36173_B2_TSTAR_CHECKLIST_LADDER;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="B2 Effective-Height T_star(N) Finite-N Ladder (imp-36173)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-327 Riemann-von Mangoldt inverse T_star(N) = effectiveHeightForN(N), swept across the
        twelve-rung finite-N ladder from N = 2458 (the declared bridge-lambda-rh rung) up to the
        PT-scale N &asymp; 1.236e13, the point at which T_star(N) first reaches the Platt-Trudgian
        verified height 3e12 (dashed yellow line). Every rung is a FINITE-height statement,
        &quot;RH up to height T_star(N)&quot; &mdash; never unconditional RH.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        T_star(N) rising across the ladder against the Platt-Trudgian 3e12 crossover
      </p>
      <TstarLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        every rung labelled RH-up-to-height
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> T_star(N) climbs from
        ~{data.ladder[0].T_star.toExponential(2)} at N = 2458 to the Platt-Trudgian ceiling only at
        the PT-scale rung N &asymp; {data.ptScaleRow.N.toExponential(3)} (marked with a filled yellow
        point). Below that rung (blue points) every finite-height statement is strictly weaker than
        the already-verified 3e12 height, so it is not new.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {data.verdict}
      </div>
    </div>
  );
}
