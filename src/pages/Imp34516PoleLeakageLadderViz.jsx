import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34516_LADDER, IMP34516_CONSTANTS } from '../data/imp-34516-pole-leakage-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Bar chart: the three degradation-ladder rungs {18.106, 18.497, 19.034} climbing toward the pole k*.
function LadderChart() {
  const svgW = 640;
  const svgH = 280;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 17.5;
  const xMax = 21.6;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;

  const rows = [
    { label: '1%', k: IMP34516_LADDER[0].k, color: ED.series1 },
    { label: '3%', k: IMP34516_LADDER[1].k, color: ED.series5 },
    { label: '8%', k: IMP34516_LADDER[2].k, color: ED.brass },
  ];
  const rowH = cH / (rows.length + 1);

  const xTicks = [17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={'x' + v}>
          <line x1={xAt(v)} y1={padT} x2={xAt(v)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        k (decade index)
      </text>

      {/* pole line k* ~ 21.28095 */}
      <line
        x1={xAt(IMP34516_CONSTANTS.poleLocation)}
        y1={padT}
        x2={xAt(IMP34516_CONSTANTS.poleLocation)}
        y2={padT + cH}
        stroke={ED.series7}
        strokeWidth={1.5}
        strokeDasharray="5,4"
        opacity={0.85}
      />
      <text x={xAt(IMP34516_CONSTANTS.poleLocation) - 6} y={padT + 12} textAnchor="end" fill={ED.series7} fontSize={9}>
        k* = {IMP34516_CONSTANTS.poleLocation.toFixed(5)}
      </text>

      {rows.map((r, i) => {
        const y = padT + (i + 1) * rowH;
        return (
          <g key={r.label}>
            <line x1={padL} y1={y} x2={xAt(r.k)} y2={y} stroke={r.color} strokeWidth={6} opacity={0.55} />
            <circle cx={xAt(r.k)} cy={y} r={5.5} fill={r.color} stroke={ED.paper} strokeWidth={1} />
            <text x={padL - 8} y={y + 3} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {r.label}
            </text>
            <text x={xAt(r.k) + 10} y={y + 3} fill={ED.ink} fontSize={9.5} fontFamily="monospace">
              k={r.k.toFixed(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34516PoleLeakageLadderViz() {
  const [onePct, threePct, eightPct] = IMP34516_LADDER;
  const { poleLocation, plateau, leakAtK19, spacing1to3, spacing3to8, decadesBelowPole8pct } = IMP34516_CONSTANTS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pole-Leakage 1%/3%/8% Degradation Ladder (imp-34468)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34468 bisected the imp-34247 pole-leakage metric leak(k) = 100 |dy/dk(k) &minus; P| / |P|
        (P = dy/dk(k=14) &asymp; {plateau}) at the 3% and 8% thresholds, completing the ladder above the
        imp-34413 1% crossing k &asymp; {onePct.k.toFixed(3)}. The 3% crossing lands at
        k &asymp; {threePct.k.toFixed(3)}, and the 8% crossing at k &asymp; {eightPct.k.toFixed(3)}
        {' '}&mdash; just ABOVE k=19 (leak(19) &asymp; {leakAtK19}%, still below 8%). All three rungs sit
        below the imp-34023 pole k* &asymp; {poleLocation.toFixed(5)}, and the inter-threshold spacings
        widen as the branch steepens toward it (1%&rarr;3% spans {spacing1to3.toFixed(3)} decades,
        3%&rarr;8% spans {spacing3to8.toFixed(3)}).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        the 1%/3%/8% ladder climbing toward the pole k*
      </p>
      <LadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>threshold</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>crossing k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>decades below k*</th>
          </tr>
        </thead>
        <tbody>
          {IMP34516_LADDER.map((row) => (
            <tr key={row.threshold} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.threshold}%</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.k.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{(poleLocation - row.k).toFixed(3)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the 1%/3%/8% ladder {'{'}
        {onePct.k.toFixed(3)}, {threePct.k.toFixed(3)}, {eightPct.k.toFixed(3)}{'}'} strictly increases
        and widens toward the pole (decadesBelowPole8pct &asymp; {decadesBelowPole8pct.toFixed(3)}),
        confirming the branch is still in its gentle pre-pole regime between these milestones, with only
        mild 1/(k*&minus;k) steepening so far.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34468 measurement; no new derivation, no bound changed. Component model is
        the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional
        per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
