import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33246_CROSSVAL_ROWS,
  IMP33246_SIGN_CHANGE_N,
  IMP33246_MAX_PAIRWISE_DELTA,
} from '../data/imp-33246-eps-crossval-viz-data.js';
import { ED } from '../styles/tokens.js';

const SIMPSON_COLOR = ED.series7;
const GL_COLOR = ED.series1;
const CC_COLOR = ED.series5;

function EpsCrossvalChart() {
  const svgW = 680;
  const padL = 76;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const xMin = 85;
  const xMax = 315;
  const yMin = -6e-4;
  const yMax = 1.1e-3;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const pts = (key) => IMP33246_CROSSVAL_ROWS.map((row) => `${xS(row.n)},${yS(row[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 6} y={yS(0) - 4} fill={ED.series1} fontSize={8.5}>
        eps_n = 0
      </text>

      <line
        x1={xS(IMP33246_SIGN_CHANGE_N)}
        y1={padT}
        x2={xS(IMP33246_SIGN_CHANGE_N)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2,3"
        opacity={0.6}
      />
      <text x={xS(IMP33246_SIGN_CHANGE_N) + 4} y={padT + 12} fill={ED.brass} fontSize={8.5}>
        n = {IMP33246_SIGN_CHANGE_N} (sign-change, all three solvers)
      </text>

      <polyline points={pts('simpson')} fill="none" stroke={SIMPSON_COLOR} strokeWidth={1.5} opacity={0.8} />
      <polyline points={pts('gl')} fill="none" stroke={GL_COLOR} strokeWidth={1.5} opacity={0.8} />
      <polyline points={pts('cc')} fill="none" stroke={CC_COLOR} strokeWidth={1.5} opacity={0.9} strokeDasharray="4,2" />

      {IMP33246_CROSSVAL_ROWS.map((row) => (
        <g key={'eps' + row.n}>
          <circle cx={xS(row.n)} cy={yS(row.simpson)} r={5} fill={SIMPSON_COLOR} />
          <circle cx={xS(row.n)} cy={yS(row.gl)} r={4} fill={GL_COLOR} />
          <circle cx={xS(row.n)} cy={yS(row.cc)} r={2.5} fill={CC_COLOR} />
          <text x={xS(row.n)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            n={row.n}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        rung n
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        eps_n = Q_n/tau*(n)^2 - 1
      </text>

      <g>
        <circle cx={padL + 8} cy={padT - 6} r={4} fill={SIMPSON_COLOR} />
        <text x={padL + 16} y={padT - 2} fill={ED.inkSoft} fontSize={9}>
          composite Simpson (imp-3849)
        </text>
        <circle cx={padL + 8} cy={padT + 10} r={4} fill={GL_COLOR} />
        <text x={padL + 16} y={padT + 14} fill={ED.inkSoft} fontSize={9}>
          5-point Gauss-Legendre (imp-3868)
        </text>
        <circle cx={padL + 8} cy={padT + 26} r={4} fill={CC_COLOR} />
        <text x={padL + 16} y={padT + 30} fill={ED.inkSoft} fontSize={9}>
          Clenshaw-Curtis (imp-3895)
        </text>
      </g>
    </svg>
  );
}

function CrossvalTable() {
  const th = { textAlign: 'right', padding: '0.35rem 0.6rem', color: ED.inkSoft, fontWeight: 600, borderBottom: '1px solid var(--rule)' };
  const td = { textAlign: 'right', padding: '0.3rem 0.6rem', color: ED.ink, fontVariantNumeric: 'tabular-nums' };
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', width: '100%', maxWidth: 700 }}>
      <thead>
        <tr>
          <th style={{ ...th, textAlign: 'left' }}>n</th>
          <th style={th}>eps_n (Simpson)</th>
          <th style={th}>eps_n (GL)</th>
          <th style={th}>eps_n (CC)</th>
          <th style={th}>|Simpson-GL|</th>
          <th style={th}>|Simpson-CC|</th>
          <th style={th}>|GL-CC|</th>
        </tr>
      </thead>
      <tbody>
        {IMP33246_CROSSVAL_ROWS.map((row) => (
          <tr key={row.n} style={row.n === IMP33246_SIGN_CHANGE_N ? { background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)' } : undefined}>
            <td style={{ ...td, textAlign: 'left', color: 'var(--ink-soft)' }}>{row.n}</td>
            <td style={td}>{row.simpson.toExponential(3)}</td>
            <td style={td}>{row.gl.toExponential(3)}</td>
            <td style={td}>{row.cc.toExponential(3)}</td>
            <td style={td}>{row.deltaSimpsonGl.toExponential(2)}</td>
            <td style={td}>{row.deltaSimpsonCc.toExponential(2)}</td>
            <td style={td}>{row.deltaGlCc.toExponential(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33246EpsCrossvalViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="eps_n Three-Solver Cross-Validation: Simpson, Gauss-Legendre and Clenshaw-Curtis Agree to ~1e-6 (imp-3918/imp-33246)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3918 assembled the imp-3849 (composite Simpson), imp-3868 (5-point Gauss-Legendre) and
        imp-3895 (Clenshaw-Curtis) measurements of the moment-ratio correction
        eps_n = Q_n/tau*(n)^2 - 1 around its sign-change near n = 149 into one machine-checkable
        cross-validation table. This page renders that table side-by-side: eps_n for all three
        quadrature rules at n in {'{100, 148, 149, 200, 300}'}, with every pairwise inter-solver
        |delta|.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        eps_n overlay, all three solvers -- sign-change at n = {IMP33246_SIGN_CHANGE_N}
      </p>
      <EpsCrossvalChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        cross-validation table: eps_n and pairwise |delta| per solver pair
      </p>
      <CrossvalTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart and table:</strong> all three solvers
        put eps_148 above 0 and eps_149 below 0, so the sign-change lands at n = 149 for Simpson,
        Gauss-Legendre and Clenshaw-Curtis alike. The largest pairwise inter-solver |delta| across
        the whole table is {IMP33246_MAX_PAIRWISE_DELTA.toExponential(2)} (at n = 300) -- far below
        the eps_n magnitude at every tabulated n -- so the three structurally-distinct quadrature
        families agree to roughly 1e-6, and the n = 149 sign-change is quadrature-rule-family-independent.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> provenance / cross-validation
        assembly only, at the RH-equivalent scale class; all three solvers share the finite NPHI=10
        kernel truncation, so the agreement pins the sign-change to that truncated-kernel model, not
        to a certified error bound. Mass-feasibility is necessary-but-not-sufficient; operator
        positivity (imp-3066 off-diagonal endpoint-Hankel K_a &ge; 0) is UNTOUCHED. NO QED; imp-3849/imp-3868/imp-3895/imp-3918
        assertions left intact.
      </div>
    </div>
  );
}
