import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION } from '../data/imp-35220-ncrit-corridor-endpoint-tabulation.js';
import { ED, alpha } from '../styles/tokens.js';

const D = IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION;
const BASELINE = D.triples[0];

// Log-log chart: the rising accumulation floor y_floor(N) (sqrt(N), a straight line on log-log axes)
// against the flat near-front ceiling y_ceil, marking N_crit where the corridor empties. The seven
// N_SWEEP points already tabulated in imp-35220 are exact on this scale (log y_floor is exactly
// linear in log N), so no new computation is needed to draw the curve.
function CorridorChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 34;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = Math.log10(1);
  const xMax = Math.log10(1e6);
  const yMin = Math.log10(1);
  const yMax = Math.log10(1e4);
  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const floorPath = BASELINE.rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.y_floor)}`)
    .join(' ');
  const nCrit = BASELINE.N_crit;
  const xTicks = [1, 10, 100, 1e3, 1e4, 1e5, 1e6];
  const yTicks = [1, 10, 100, 1e3, 1e4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        y_floor(N) vs. flat y_ceil ({BASELINE.label}), log-log axes
      </text>

      {/* corridor: the non-empty feasible region N <= N_crit, y <= y_ceil */}
      <rect
        x={xOf(BASELINE.rows[0].N)}
        y={yOf(BASELINE.y_ceil)}
        width={xOf(nCrit) - xOf(BASELINE.rows[0].N)}
        height={padT + plotH - yOf(BASELINE.y_ceil)}
        fill={alpha(ED.series3, 0.08)}
      />

      {/* empty-corridor region N > N_crit: y_floor has risen past y_ceil, corridor is EMPTY here */}
      <rect
        x={xOf(nCrit)}
        y={padT}
        width={padL + plotW - xOf(nCrit)}
        height={plotH}
        fill={alpha(ED.series2, 0.06)}
      />
      <text x={xOf(nCrit) + 8} y={padT + plotH - 10} fill={ED.series2} fontSize={9}>
        corridor empty (N &gt; N_crit)
      </text>

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((t) => (
        <text key={t} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t.toExponential(0)}
        </text>
      ))}

      {/* flat y_ceil ceiling */}
      <line
        x1={padL}
        y1={yOf(BASELINE.y_ceil)}
        x2={padL + plotW}
        y2={yOf(BASELINE.y_ceil)}
        stroke={ED.series2}
        strokeWidth={1.75}
        strokeDasharray="5 3"
      />
      <text x={padL + plotW - 150} y={yOf(BASELINE.y_ceil) - 6} fill={ED.series2} fontSize={9}>
        y_ceil = {BASELINE.y_ceil} (flat)
      </text>

      {/* rising y_floor accumulation floor */}
      <path d={floorPath} fill="none" stroke={ED.series1} strokeWidth={2.25} />
      {BASELINE.rows.map((r) => (
        <circle key={r.N} cx={xOf(r.N)} cy={yOf(r.y_floor)} r={2.75} fill={ED.series1} />
      ))}

      {/* N_crit crossing marker */}
      <line
        x1={xOf(nCrit)}
        y1={padT}
        x2={xOf(nCrit)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="3 3"
      />
      <text x={xOf(nCrit) + 5} y={padT + 12} fill={ED.brass} fontSize={9.5} fontWeight={700}>
        N_crit &asymp; {nCrit.toFixed(2)}
      </text>

      <text x={padL + 10} y={padT + plotH - 10} fill={ED.series3} fontSize={9}>
        corridor (feasible)
      </text>
    </svg>
  );
}

export default function Imp35232ScheduleCorridorCollapseViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="I3 Schedule-Corridor Collapse (imp-35232 / imp-35220)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.endpoints.accumulationFloor}. {D.endpoints.nearFrontCeiling}. {D.endpoints.crossover} This
        page plots both endpoints for the baseline ({BASELINE.label}) triple across the imp-35220
        N-sweep, marking the crossing N_crit where the strip corridor y_floor(N)&nbsp;&le;&nbsp;y_star(N)
        &le;&nbsp;y_ceil empties.
      </p>

      <CorridorChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>y_floor(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>y_ceil</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>corridor feasible?</th>
          </tr>
        </thead>
        <tbody>
          {BASELINE.rows.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.y_floor}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.y_ceil}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: r.feasible ? 'var(--series-3)' : 'var(--series-2)' }}>
                {r.feasible ? 'yes' : 'no'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Robustness: N_crit stays a modest O(1)-to-O(100) number across every plausible (S, E_acc, y_ceil)
        triple (range [{D.nCritSpread.min}, {D.nCritSpread.max}]), far below the roadmap flow anchors
        N&nbsp;&sim;&nbsp;1e6 and beyond.
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.35rem 0.6rem' }}>triple</th>
            <th style={{ padding: '0.35rem 0.6rem' }}>N_crit</th>
          </tr>
        </thead>
        <tbody>
          {D.triples.map((t) => (
            <tr key={t.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.35rem 0.6rem' }}>{t.label}</td>
              <td style={{ padding: '0.35rem 0.6rem', fontFamily: 'monospace' }}>{t.N_crit}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35220 tabulation literals verbatim (no new computation). Measurement on the inherited
        imp-3220/imp-3406 surrogate; imp-35127 I3 field-Lipschitz requirement stays OPEN (localized to
        the N poles at y=0, per imp-35196); C_mb GUE-conditional per imp-486 untouched; changes no
        bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
