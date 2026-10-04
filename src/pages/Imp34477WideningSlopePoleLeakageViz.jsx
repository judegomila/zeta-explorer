import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING } from '../data/imp-34413-widening-slope-pole-leakage-one-percent-crossing.js';
import { ED } from '../styles/tokens.js';

const {
  poleLocation,
  leakMinK,
  leakMinPct,
  onePctCrossingK,
  leakLadder,
  decadesBelowK19,
  decadesBelowPole,
  verdict,
} = IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING;

// leak(k) on a log scale: the deep minimum near k~17.80, the 1% crossing, and the rise toward the pole.
function LeakChart() {
  const svgW = 680;
  const svgH = 280;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = leakLadder.map((r) => r.k);
  const xMin = 14;
  const xMax = poleLocation;
  const logYs = leakLadder.map((r) => Math.log10(Math.max(r.leakPct, 1e-4)));
  const yMin = Math.min(...logYs) - 0.3;
  const yMax = Math.log10(10); // headroom past the 8% rung
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(Math.max(v, 1e-4)) - yMin) / (yMax - yMin)) * cH;

  const linePts = leakLadder.map((r) => `${xAt(r.k)},${yAt(r.leakPct)}`).join(' ');
  const xMinK = xAt(leakMinK);
  const yMinK = yAt(leakMinPct);
  const xCross = xAt(onePctCrossingK);
  const yCross = yAt(1.0);
  const xPole = xAt(poleLocation);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[0.01, 0.1, 1, 8].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}%
          </text>
        </g>
      ))}
      {[14, 15, 16, 17, 18, 19, 20, 21].map((k) => (
        <text key={'x' + k} x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {k}
        </text>
      ))}

      <line
        x1={xPole}
        y1={padT}
        x2={xPole}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={xPole - 6} y={padT + 10} textAnchor="end" fill={ED.series2} fontSize={9}>
        pole k* &asymp; {poleLocation.toFixed(3)}
      </text>

      <line
        x1={padL}
        y1={yCross}
        x2={padL + cW}
        y2={yCross}
        stroke={ED.series3}
        strokeWidth={1}
        strokeDasharray="5,3"
      />
      <text x={padL + 6} y={yCross - 6} fill={ED.series3} fontSize={9.5}>
        1% crossing (k &asymp; {onePctCrossingK.toFixed(3)})
      </text>

      <polyline points={linePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      {leakLadder.map((r) => (
        <circle key={r.k} cx={xAt(r.k)} cy={yAt(r.leakPct)} r={2.75} fill={ED.series1} />
      ))}

      <circle cx={xMinK} cy={yMinK} r={4} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} />
      <text x={xMinK} y={yMinK - 10} textAnchor="middle" fill={ED.brass} fontSize={9}>
        min ({leakMinK.toFixed(2)}, {leakMinPct}%)
      </text>

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        leak(k) (log scale)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        decade index k
      </text>
    </svg>
  );
}

export default function Imp34477WideningSlopePoleLeakageViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Widening-Slope Pole-Leakage Metric leak(k) (imp-34477 / imp-34413)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34413 bisects the imp-34247 pole-leakage metric leak(k) &mdash; the deviation of the
        widening-slope local estimate dy/dk from its clean far-field plateau &mdash; across k = 14..21.
        The metric bottoms at a deep {leakMinPct}% minimum at k &asymp; {leakMinK.toFixed(2)}, then rises
        monotonically through the exact 1% crossing at k &asymp; {onePctCrossingK.toFixed(3)}
        {' '}({decadesBelowK19} decades below the k&nbsp;&ge;&nbsp;19 break flagged elsewhere) toward the
        simple pole k* &asymp; {poleLocation.toFixed(3)} ({decadesBelowPole} decades further out).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        leak(k) vs decade index k: minimum, 1% crossing, and the approach to the pole
      </p>
      <LeakChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>leak(k)</th>
          </tr>
        </thead>
        <tbody>
          {leakLadder.map((row) => (
            <tr key={row.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {row.k === onePctCrossingK ? row.k.toFixed(5) + ' (1% crossing)' : row.k}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.leakPct.toFixed(4)}%</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {verdict}
      </div>
    </div>
  );
}
