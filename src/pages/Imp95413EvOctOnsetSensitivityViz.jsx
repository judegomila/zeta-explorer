import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95258_EVOCT_ONSET_SENSITIVITY } from '../data/imp-95258-evoct-onset-sensitivity.js';
import { ED } from '../styles/tokens.js';

function SweepChart({ data, xKey, xLabel, xTicks, color, extraLine, logX }) {
  const svgW = 640;
  const svgH = 260;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = data.map((p) => p[xKey]);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const xPos = (v) =>
    logX
      ? (Math.log10(v) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin))
      : (v - xMin) / (xMax - xMin);
  const xOf = (v) => padL + xPos(v) * cW;

  const ys = data.map((p) => p.xStar);
  const yMin = Math.min(...ys, extraLine ? extraLine.y : Infinity) - 0.4;
  const yMax = Math.max(...ys, extraLine ? extraLine.y : -Infinity) + 0.4;
  const yOf = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const path = data
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p[xKey])},${yOf(p.xStar)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} stroke={ED.ruleSoft} />

      {extraLine && (
        <>
          <line
            x1={padL}
            y1={yOf(extraLine.y)}
            x2={padL + cW}
            y2={yOf(extraLine.y)}
            stroke={extraLine.color || ED.brassDeco}
            strokeWidth={1.5}
            strokeDasharray="4,3"
          />
          <text x={padL + 4} y={yOf(extraLine.y) - 4} fill={extraLine.color || ED.brass} fontSize={9.5}>
            {extraLine.label}
          </text>
        </>
      )}

      <path d={path} fill="none" stroke={color} strokeWidth={2} />
      {data.map((p, i) => (
        <circle key={`pt-${i}`} cx={xOf(p[xKey])} cy={yOf(p.xStar)} r={4} fill={color} />
      ))}

      {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
        <g key={`gy-${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + cW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={0.5} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`xt-${v}`} x={xOf(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {v}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        {xLabel}
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        xStar (onset)
      </text>
    </svg>
  );
}

export default function Imp95413EvOctOnsetSensitivityViz() {
  const rec = IMP95258_EVOCT_ONSET_SENSITIVITY;
  const { sensitivityM, sensitivityRho, sensitivityR } = rec;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="EV-OCT Firing-Onset Sensitivity: Octave Count m, Lattice Ratio rho, Intra-Pair Ratio r (imp-95258)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measures the
        closed-form COROLLARY EV-OCT certificate only (the same object imp-95250
        bisected), not the exact pencil Lambda; changes no bound. RH does not follow from anything
        on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        The imp-95250 every-octave onset xStarEvOct = 11.31664319 was measured at a
        single point: m = 6 octaves, dyadic spacing rho = 2, coalescent ratio r &rarr; 1.
        The three sweeps below vary each parameter in turn to show whether that point
        is representative of the wider family.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        (A) vs octave count m &mdash; {sensitivityM.fixed}: monotone, saturates at{' '}
        {sensitivityM.saturation}. For contrast, the crude m-and-r-uniform threshold
        xStarUnif = 27.04 sits far above the saturated onset (off-chart, not drawn to
        scale) &mdash; quantifying how loose that uniform bound is.
      </p>
      <SweepChart
        data={sensitivityM.grid}
        xKey="m"
        xLabel="m (octave count)"
        xTicks={[2, 3, 4, 6, 8, 10, 24]}
        color={ED.series1}
        extraLine={{ y: sensitivityM.saturation, label: `saturation ${sensitivityM.saturation}`, color: ED.brass }}
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        (B) vs lattice ratio rho &mdash; {sensitivityRho.fixed}: dominant, steeply decreasing
      </p>
      <SweepChart
        data={sensitivityRho.grid}
        xKey="rho"
        xLabel="rho (octave spacing)"
        xTicks={[1.5, 1.8, 2, 2.5, 3, 4]}
        color={ED.series2}
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        (C) vs intra-pair ratio r &mdash; {sensitivityR.fixed}: weak, spread {'<'} 0.27
      </p>
      <SweepChart
        data={sensitivityR.grid}
        xKey="r"
        xLabel="r (intra-pair ratio, log scale)"
        xTicks={[1.001, 1.01, 1.05, 1.1, 1.2, 1.3]}
        color={ED.series3}
        logX
      />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>axis</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>fixed</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>finding</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['m', sensitivityM.fixed, sensitivityM.finding],
            ['rho', sensitivityRho.fixed, sensitivityRho.finding],
            ['r', sensitivityR.fixed, sensitivityR.finding],
          ].map(([axis, fixed, finding], i) => (
            <tr key={axis} style={{ borderBottom: i < 2 ? '1px solid var(--rule-soft)' : 'none', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{axis}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{fixed}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{finding}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {rec.summary}
      </div>
    </div>
  );
}
