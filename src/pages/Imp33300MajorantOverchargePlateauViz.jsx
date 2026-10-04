import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33300_PLATEAUS,
  IMP33300_ENDPOINT_PLATEAU_INDEX,
  IMP33300_OC_FRACTION_RANGE,
} from '../data/imp-33300-majorant-overcharge-plateau-viz-data.js';
import { ED } from '../styles/tokens.js';

const GENUINE_COLOR = ED.series1;
const OVERCHARGE_COLOR = ED.series7;
const FOC_COLOR = ED.series4;
const ENDPOINT_COLOR = ED.series3;

function OverchargeStackChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 48;
  const padT = 28;
  const padB = 52;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const n = IMP33300_PLATEAUS.length;
  const rMajMax = Math.max(...IMP33300_PLATEAUS.map((p) => p.rMaj));
  const yMax = Math.ceil(rMajMax) + 1;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const yFrac = (f) => padT + cH * (1 - f); // f in [0,1], shares the plot height with the bars

  const slot = cW / n;
  const barW = slot * 0.56;

  const linePoints = IMP33300_PLATEAUS.map((p, i) => {
    const x = padL + i * slot + slot / 2;
    const y = yFrac(p.overChargeFraction);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {Array.from({ length: yMax + 1 }, (_, v) => v).filter((v) => v % 2 === 0).map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((f) => (
        <text key={f} x={padL + cW + 6} y={yFrac(f) + 3.5} textAnchor="start" fill={ED.brass} fontSize={9}>
          {Math.round(f * 100)}%
        </text>
      ))}

      {IMP33300_PLATEAUS.map((p, i) => {
        const x = padL + i * slot + (slot - barW) / 2;
        const yGenuineTop = yS(p.genuineRMaj);
        const yTotalTop = yS(p.rMaj);
        const isEndpoint = p.plateauIndex === IMP33300_ENDPOINT_PLATEAU_INDEX;
        return (
          <g key={p.plateauIndex}>
            <rect
              x={x}
              y={yGenuineTop}
              width={barW}
              height={padT + cH - yGenuineTop}
              fill={GENUINE_COLOR}
            />
            <rect
              x={x}
              y={yTotalTop}
              width={barW}
              height={yGenuineTop - yTotalTop}
              fill={OVERCHARGE_COLOR}
            />
            {isEndpoint && (
              <rect
                x={x - 3}
                y={yTotalTop - 3}
                width={barW + 6}
                height={padT + cH - yTotalTop + 6}
                fill="none"
                stroke={ENDPOINT_COLOR}
                strokeWidth={1.75}
                rx={2}
              />
            )}
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              p{p.plateauIndex}
            </text>
            {isEndpoint && (
              <text x={x + barW / 2} y={yTotalTop - 8} textAnchor="middle" fill={ENDPOINT_COLOR} fontSize={9} fontWeight={700}>
                6.82
              </text>
            )}
          </g>
        );
      })}

      <polyline points={linePoints} fill="none" stroke={FOC_COLOR} strokeWidth={1.75} strokeDasharray="4,2" />
      {IMP33300_PLATEAUS.map((p, i) => {
        const x = padL + i * slot + slot / 2;
        const y = yFrac(p.overChargeFraction);
        const isEndpoint = p.plateauIndex === IMP33300_ENDPOINT_PLATEAU_INDEX;
        return (
          <circle
            key={p.plateauIndex}
            cx={x}
            cy={y}
            r={isEndpoint ? 4 : 2.5}
            fill={FOC_COLOR}
            stroke={isEndpoint ? ENDPOINT_COLOR : 'none'}
            strokeWidth={isEndpoint ? 1.5 : 0}
          />
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        R_maj (stacked)
      </text>
      <text x={svgW - 12} y={padT + cH / 2} textAnchor="middle" fill={ED.brass} fontSize={10} transform={`rotate(-90,${svgW - 12},${padT + cH / 2})`}>
        f_oc (over-charge fraction)
      </text>
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        imp-3725 plateau index (10 plateaus, N = 1.9e4 .. 1e6)
      </text>
    </svg>
  );
}

export default function Imp33300MajorantOverchargePlateauViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Per-Plateau Majorant Over-Charge Split: R_maj = K_real + Over-Charge (imp-33273)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33273 split the certified majorant ratio R_maj into a genuine realised-tail part
        (K_real, flat O(1)) and a far-term majorant over-charge part, on all 10 imp-3725
        plateaus. The stacked bars below show genuine K_real (bottom, blue) plus over-charge
        (top, pink) summing to R_maj; the dashed gold line overlays the over-charge fraction
        f_oc = 1 - realised/M on the right-hand percent axis. The largest-N endpoint plateau 9
        (R_maj = 6.82, f_oc = 84.7%) is outlined in green.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_maj stacked split and over-charge fraction, all 10 plateaus
      </p>
      <OverchargeStackChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue genuine
        segment (K_real) stays O(1), in [0.80, 1.60], on every plateau -- it never grows with N.
        Almost all of the bar-height variation across plateaus is the pink over-charge segment,
        and the gold f_oc line tracks it, ranging over{' '}
        {(IMP33300_OC_FRACTION_RANGE[0] * 100).toFixed(1)}%&ndash;
        {(IMP33300_OC_FRACTION_RANGE[1] * 100).toFixed(1)}%. At the outlined endpoint plateau 9,
        R_maj = 6.82 is 84.7% over-charge and only 15.3% (K_real = 1.044) genuine realised tail.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation of the imp-33273
        exact reframing only -- a finite 10-plateau [1e4, 1e6] measurement, not a certified
        N-uniform statement. Adds no new Lambda bound, does not tighten imp-3910's certified
        C &le; 54.56, and does not touch imp-3066's K_a &ge; 0 positivity. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
