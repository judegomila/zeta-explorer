import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT } from '../data/imp-34329-crossover-surplus-fartail-composite-limit.js';
import { ED } from '../styles/tokens.js';

// Merge the shallow-window ladder (descent to the minimum) with the deep-tail probe
// (the reversal and climb toward 3), tagging each point with its -log10(thr) endpoint.
const { localExponents, deepProbe } = IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT;
const DESCENT = localExponents.slice(0, 4).map((row) => ({
  window: row.window,
  negLogThr: -Math.log10(Number(row.window.split('->')[1])),
  composite: row.composite,
  r_exponent: row.r_exponent,
}));
const CLIMB = deepProbe.map((row) => ({
  window: row.window,
  negLogThr: -Math.log10(Number(row.window.split('->')[1])),
  composite: row.composite,
  r_exponent: row.r_exponent,
}));
const SERIES = [...DESCENT, ...CLIMB];
const MIN_INDEX = SERIES.reduce(
  (best, row, i) => (row.composite < SERIES[best].composite ? i : best),
  0
);

// Composite (and r-) exponent vs -log10(thr), the shallow minimum marked, and the
// thr^3 (composite = 3) asymptote drawn as a reference line the climb approaches but never reaches.
function ExponentTurnAndClimb() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0;
  const xMax = 12.5;
  const yMin = 1.5;
  const yMax = 3.3;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const compositePts = SERIES.map((row) => `${xAt(row.negLogThr)},${yAt(row.composite)}`).join(' ');
  const rPts = SERIES.map((row) => `${xAt(row.negLogThr)},${yAt(row.r_exponent)}`).join(' ');
  const minRow = SERIES[MIN_INDEX];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[1.5, 2, 2.5, 3].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10, 12].map((v) => (
        <text key={'x' + v} x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      {/* thr^3 asymptote: composite -> 3, approached but never reached */}
      <line
        x1={padL}
        y1={yAt(3)}
        x2={padL + cW}
        y2={yAt(3)}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yAt(3) - 5} textAnchor="end" fill={ED.brass} fontSize={9.5}>
        thr&sup3; asymptote (composite&nbsp;&rarr;&nbsp;3)
      </text>

      <polyline points={compositePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      <polyline points={rPts} fill="none" stroke={ED.series7} strokeWidth={2} />

      {SERIES.map((row, i) => (
        <g key={row.window}>
          <circle cx={xAt(row.negLogThr)} cy={yAt(row.composite)} r={i === MIN_INDEX ? 5 : 3} fill={ED.series1} />
          <circle cx={xAt(row.negLogThr)} cy={yAt(row.r_exponent)} r={3} fill={ED.series7} />
        </g>
      ))}

      {/* the turn: shallow minimum marker */}
      <line
        x1={xAt(minRow.negLogThr)}
        y1={padT}
        x2={xAt(minRow.negLogThr)}
        y2={padT + cH}
        stroke={ED.series3}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xAt(minRow.negLogThr)} y={padT - 6} textAnchor="middle" fill={ED.series3} fontSize={9.5}>
        turn: min&nbsp;{minRow.composite.toFixed(4)}
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        local exponent
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        &minus;log10(thr) (window right endpoint)
      </text>

      <g>
        <rect x={padL + 8} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + 22} y={padT + 9} fill={ED.inkSoft} fontSize={10}>
          composite (surplus)
        </text>
        <rect x={padL + 8} y={padT + 16} width={10} height={10} fill={ED.series7} />
        <text x={padL + 22} y={padT + 25} fill={ED.inkSoft} fontSize={10}>
          r-exponent
        </text>
      </g>
    </svg>
  );
}

export default function Imp34416CrossoverSurplusFartailCompositeLimitViz() {
  const { finding, limitingCompositeExponent, deepProbe: dp } = IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT;
  const last = dp[dp.length - 1];
  const minComposite = SERIES[MIN_INDEX].composite.toFixed(4);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Surplus Composite Exponent: Turn and Climb Toward 3 (imp-34416 / imp-34329)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34248 factorised the crossover surplus into a linear prefactor and a log-softened
        E_flow ratio r(thr), giving an apparent super-linear composite collapse ~thr<sup>2.88</sup>{' '}
        that looked like a stable sub-3 plateau. imp-34329 extended the ladder deep into the tail
        (thr down to 1e-12) and found the local composite exponent instead reaches a shallow
        minimum ~{minComposite} and then reverses, climbing back toward the naive{' '}
        thr<sup>{limitingCompositeExponent}</sup> as thr&nbsp;&rarr;&nbsp;0.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        local composite and r-exponent vs &minus;log10(thr): the shallow minimum (turn) and the thr&sup3; asymptote
      </p>
      <ExponentTurnAndClimb />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>logT0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r-exponent</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>composite</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>correction c = (2&minus;r_exp)&middot;logT0</th>
          </tr>
        </thead>
        <tbody>
          {dp.map((row) => (
            <tr key={row.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.window}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.logT0}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.r_exponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.composite.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.correction_c.toFixed(3)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the correction:</strong> {finding.F3_limit_is_cubic} At the
        deepest probe (logT0&nbsp;=&nbsp;{last.logT0}), r-exponent&nbsp;=&nbsp;{last.r_exponent.toFixed(4)} and
        composite&nbsp;=&nbsp;{last.composite.toFixed(4)}, both still short of the 2/3 limit &mdash; the
        correction ~c/logT0 decays slowly, so the approach is logarithmic, not fast.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Measurement/fit only within the inherited
        imp-34248/imp-34174/imp-33743 extrapolation component model, which is NOT a rigorous asymptotic. E_flow
        is the benign mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent
        C_Lip collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C
        1/8 ansatz (imp-2642/imp-2643) is untouched; imp-3066 K_a&ge;0 untouched; changes no bound; NO QED.
      </div>
    </div>
  );
}
