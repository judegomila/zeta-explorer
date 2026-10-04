import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY } from '../data/imp-35194-background-field-sup-n-uniformity.js';
import { IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP } from '../data/imp-35218-real-ordinate-background-field-sup.js';
import { ED } from '../styles/tokens.js';

const UNIT = IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY;
const REAL = IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP;
const N_KEYS = ['N50', 'N100', 'N200'];
const N_COLORS = { N50: ED.series1, N100: ED.series5, N200: ED.series7 };

// Unit-spacing fractionTable rows carry a single scalar beta per N (imp-35194 schema);
// real-ordinate rows carry a beta object keyed by N (imp-35218 schema). Normalize both
// to { fraction, N50, N100, N200 } so the overlay chart can read one shape.
const unitRows = UNIT.fractionTable.map((r) => ({ fraction: r.fraction, ...r.beta }));
const realRows = REAL.fractionTable.map((r) => ({ fraction: r.fraction, ...r.beta }));

// Chart: beta(N) vs. min-gap fraction, log-log, unit-spacing (solid, near-overlapping)
// vs. real-ordinate (dashed, fanning out) for the same N = 50, 100, 200.
function OverlayChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 40;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = Math.log10(0.04);
  const xMax = Math.log10(0.6);
  const yMin = Math.log10(2);
  const yMax = Math.log10(30);
  const xOf = (frac) => padL + ((Math.log10(frac) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [0.05, 0.1, 0.25, 0.5];
  const yTicks = [2, 5, 10, 20, 30];

  const pathFor = (rows, key) =>
    rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.fraction)} ${yOf(r[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 20} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        beta(N) vs. min-gap fraction: unit-spacing (solid) vs. real ordinates (dashed)
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
          {t}
        </text>
      ))}

      {N_KEYS.map((key) => (
        <path key={`unit-${key}`} d={pathFor(unitRows, key)} fill="none" stroke={N_COLORS[key]} strokeWidth={2} opacity={0.9} />
      ))}
      {N_KEYS.map((key) => (
        <path
          key={`real-${key}`}
          d={pathFor(realRows, key)}
          fill="none"
          stroke={N_COLORS[key]}
          strokeWidth={2}
          strokeDasharray="5,4"
          opacity={0.9}
        />
      ))}
      {N_KEYS.map((key) =>
        realRows.map((r) => (
          <circle key={`real-dot-${key}-${r.fraction}`} cx={xOf(r.fraction)} cy={yOf(r[key])} r={2.5} fill={N_COLORS[key]} />
        )),
      )}

      {N_KEYS.map((key, i) => (
        <text key={key} x={padL + plotW - 96} y={padT + 12 + i * 13} fill={N_COLORS[key]} fontSize={9.5} fontWeight={700}>
          {key.replace('N', 'N=')}
        </text>
      ))}
      <text x={padL + plotW - 96} y={padT + 12 + 3 * 13 + 6} fill={ED.inkSoft} fontSize={9}>
        solid = unit spacing, dashed = real ordinates
      </text>
    </svg>
  );
}

// Chart: relative spread across N at each matched min-gap fraction, unit vs. real (log-scale bars).
function SpreadChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 34;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 180;
  const svgH = padT + plotH + padB;

  const fractions = UNIT.fractionTable.map((r) => r.fraction);
  const groupW = plotW / fractions.length;
  const barW = groupW * 0.28;

  const yMax = Math.log10(2); // ~100% relative spread ceiling for the log axis
  const yMin = Math.log10(0.001);
  const yOf = (v) => padT + plotH - ((Math.log10(Math.max(v, 0.001)) - yMin) / (yMax - yMin)) * plotH;
  const yTicks = [0.001, 0.01, 0.1, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        relative spread of beta(N) across N=50,100,200 (log scale): unit vs. real ordinates
      </text>

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {(t * 100).toFixed(1)}%
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {fractions.map((frac, i) => {
        const cx = padL + groupW * i + groupW / 2;
        const unitSpread = UNIT.fractionTable[i].relSpreadAcrossN;
        const realSpread = REAL.fractionTable[i].relSpreadAcrossN;
        return (
          <g key={frac}>
            <rect x={cx - barW - 2} y={yOf(unitSpread)} width={barW} height={padT + plotH - yOf(unitSpread)} fill={ED.series1} opacity={0.85} />
            <rect x={cx + 2} y={yOf(realSpread)} width={barW} height={padT + plotH - yOf(realSpread)} fill={ED.series7} opacity={0.85} />
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {frac}
            </text>
          </g>
        );
      })}

      <text x={padL + 10} y={padT + 14} fill={ED.series1} fontSize={9.5} fontWeight={700}>
        unit spacing (&lt; 1.5%)
      </text>
      <text x={padL + 10} y={padT + 28} fill={ED.series7} fontSize={9.5} fontWeight={700}>
        real ordinates (&gt; 100%)
      </text>
    </svg>
  );
}

export default function Imp35252RealVsUnitBackgroundFieldSupContrastViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Background-Field Sup: Real Ordinates vs. Unit Spacing (imp-35252 / imp-35218 / imp-35194)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Restarting the imp-35194 running-sup beta(N) measurement from the first N REAL Riemann zero
        ordinates (imp-35218) instead of unit spacing REFUTES the unit-spacing N-uniformity: at each
        matched min-gap fraction beta(N) grows strongly with N on real data (relative spread ~
        {(REAL.minRelSpreadAcrossN * 100).toFixed(0)}&ndash;{(REAL.maxRelSpreadAcrossN * 100).toFixed(0)}%)
        versus &lt; {(UNIT.maxRelSpreadAcrossN * 100).toFixed(1)}% for unit spacing, because real
        spacings shrink with height and a larger N drags in tighter zeros that lower the local scale
        setting beta. The beta&nbsp;~&nbsp;1/g_min front law survives on both (beta&nbsp;*&nbsp;g_min
        stays O(1) and decreases toward the front) but its constant is not N-uniform on real ordinates.
      </p>

      <OverlayChart />
      <div style={{ height: '1.25rem' }} />
      <SpreadChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>min-gap fraction</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>unit beta(50/100/200)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>unit spread</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>real beta(50/100/200)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>real spread</th>
          </tr>
        </thead>
        <tbody>
          {UNIT.fractionTable.map((u, i) => {
            const r = REAL.fractionTable[i];
            return (
              <tr key={u.fraction} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{u.fraction}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                  {u.beta.N50} / {u.beta.N100} / {u.beta.N200}
                </td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{(u.relSpreadAcrossN * 100).toFixed(2)}%</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                  {r.beta.N50} / {r.beta.N100} / {r.beta.N200}
                </td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{(r.relSpreadAcrossN * 100).toFixed(2)}%</td>
              </tr>
            );
          })}
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
        imp-35194 and imp-35218 measured fraction tables verbatim (no new computation). MEASUREMENT
        ONLY, frontier-diagnostic probe of the imp-35167 M2 background-field-sup obstruction under the
        M3 initial-gap regime; does NOT certify N-uniformity over the full trajectory (the sup diverges
        as g_min&nbsp;&rarr;&nbsp;0); M5 horizon-front mismatch stays OPEN; imp-2563 sandwich untouched
        (valid CONDITIONAL bracket); C_mb GUE-conditional per imp-486 untouched; changes no bound,
        establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
