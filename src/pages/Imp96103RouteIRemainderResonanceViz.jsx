import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96103_CURVE,
  IMP96103_SPIKE_POINTS,
  IMP96103_REGULAR_POINT,
  IMP96103_SPIKE_LAW,
  IMP96103_HONEST_BANNER,
} from '../data/imp-96103-route-i-remainder-resonance-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// line chart of delta_S(rho) over rho in [0.8, 9.2], with the four near-dyadic spikes
// (rho = 2^k + eps, eps = 1e-7) and the regular rho = 3 point marked.
function RemainderPanel() {
  const rows = IMP96103_CURVE;
  const svgW = 700;
  const padL = 46;
  const padR = 16;
  const svgH = 300;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minRho = rows[0].rho;
  const maxRho = rows[rows.length - 1].rho;
  const minY = 0;
  const maxY = 14;
  const xOf = (rho) => padL + ((rho - minRho) / (maxRho - minRho)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [0, 2, 4, 6, 8, 10, 12, 14];

  return (
    <AxisFrame svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB} xLabel="rho" yLabel="delta_S(rho)">
      {[1, 2, 4, 8].map((rho) => (
        <rect key={rho} x={xOf(rho) - 3} y={padT} width={6} height={plotH} fill={ED.series1} opacity={0.14} />
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.rho)},${yOf(Math.min(maxY, r.value))}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.5}
      />
      <circle cx={xOf(IMP96103_REGULAR_POINT.rho)} cy={yOf(IMP96103_REGULAR_POINT.value)} r={4} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
      <text x={xOf(IMP96103_REGULAR_POINT.rho) + 6} y={yOf(IMP96103_REGULAR_POINT.value) - 6} fill={ED.series3} fontSize={9}>
        rho=3: {IMP96103_REGULAR_POINT.value.toFixed(3)}
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rho) => (
        <text key={rho} x={xOf(rho)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {rho}
        </text>
      ))}
    </AxisFrame>
  );
}

// bar chart of the four baked near-dyadic spike values vs the regular rho=3 value.
function SpikeBarPanel() {
  const bars = [
    ...IMP96103_SPIKE_POINTS.map((p) => ({ label: `2^${p.k}`, value: p.value, color: ED.series1 })),
    { label: '3', value: IMP96103_REGULAR_POINT.value, color: ED.series3 },
  ];
  const svgW = 420;
  const padL = 46;
  const padR = 16;
  const svgH = 240;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 35;
  const barW = plotW / bars.length - 12;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB} xLabel="rho" yLabel="delta_S(rho)">
      {[0, 10, 20, 30].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {bars.map((b, i) => {
        const x = padL + i * (plotW / bars.length) + 6;
        const h = plotH - (yOf(b.value) - padT);
        return (
          <g key={b.label}>
            <rect x={x} y={yOf(b.value)} width={barW} height={h} fill={b.color} opacity={0.85} />
            <text x={x + barW / 2} y={yOf(b.value) - 5} textAnchor="middle" fill={ED.ink} fontSize={8.5}>
              {b.value.toFixed(2)}
            </text>
            <text x={x + barW / 2} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {b.label}
            </text>
          </g>
        );
      })}
    </AxisFrame>
  );
}

export default function Imp96103RouteIRemainderResonanceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I: Remainder delta_S(rho) Resonance Structure" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96103_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route I semilocal S = {'{'}&infin;, 2{'}'} trace remainder delta_S(rho) has a log
        spike at every near-dyadic rho = 2<sup>k</sup> + &epsilon; ({IMP96103_SPIKE_LAW}), shaded
        blue below, versus a regular value at the non-dyadic rho = 3 (shaded green) &mdash; the
        first spike (k = 0, {IMP96103_SPIKE_POINTS[0].value.toFixed(3)}) is already over 32x the
        regular value ({IMP96103_REGULAR_POINT.value.toFixed(3)}), and the spike grows further
        with k.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        delta_S(rho) over rho in [0.8, 9.2]: near-dyadic spikes vs regular rho = 3
      </h3>
      <RemainderPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Baked near-dyadic spikes (&epsilon; = 1e-7) vs the regular rho = 3 value
      </h3>
      <SpikeBarPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the continuous curve
        (clamped at 14 for legibility) rises toward each near-dyadic rho and dips back down
        away from them, reaching only ~0.4 near the non-dyadic rho = 3. The four baked
        spike points ({IMP96103_SPIKE_POINTS.map((p) => p.value.toFixed(2)).join(' / ')}) are
        sampled at a fixed offset &epsilon; = 1e-7 past each 2<sup>k</sup> and grow with k
        because the resonance is a p = 2 phenomenon: every power of 2 contributes its own
        log(1/&epsilon;) singularity, scaled by 2<sup>k/2</sup>/2.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96103 baked viz-data (delta_S(rho) evaluated directly from the source module&rsquo;s
        exact closed-form deltaS function; the spike and regular points cross-checked against
        ROUTE_I_LITERALS.deltaS). {IMP96103_HONEST_BANNER}
      </div>
    </div>
  );
}
