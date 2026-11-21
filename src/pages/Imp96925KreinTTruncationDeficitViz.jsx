import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96814_NS,
  IMP96814_DEFICIT_REL_PCT,
  IMP96814_VERDICT,
} from '../data/imp-96814-krein-t-truncation-deficit-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-96925: the imp-96814 leaf was named "-viz-data" but had no confirmed consumer
// (no .jsx page imported it). This is the first consumer: a line chart of the
// per-2a relative t-truncation deficit (T=800 vs T=3200 Krein floor) across the
// shared N=52..124 ladder, showing the deficit is SMALLEST at the binding 2a=ln3
// rung and grows super-linearly with N at every rung.
const COLOR_BY_KEY = Object.freeze({
  '2a=1.00': ED.series1,
  '2a=1.05': ED.series4,
  '2a=ln3': ED.series3,
});

function DeficitTrendPanel() {
  const ns = IMP96814_NS;
  const svgW = 720;
  const padL = 44;
  const padR = 20;
  const svgH = 320;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...ns);
  const maxX = Math.max(...ns);
  const allVals = Object.values(IMP96814_DEFICIT_REL_PCT).flat();
  const minY = 0;
  const maxY = Math.max(...allVals) * 1.1;

  const xOf = (n) => padL + ((n - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, maxY / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(1)}%
          </text>
        </g>
      ))}
      {ns.map((n) => (
        <text key={`x${n}`} x={xOf(n)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {n}
        </text>
      ))}
      {Object.entries(IMP96814_DEFICIT_REL_PCT).map(([key, values]) => (
        <g key={key}>
          <polyline
            points={ns.map((n, i) => `${xOf(n)},${yOf(values[i])}`).join(' ')}
            fill="none"
            stroke={COLOR_BY_KEY[key]}
            strokeWidth={1.9}
          />
          {ns.map((n, i) => (
            <circle key={`${key}${n}`} cx={xOf(n)} cy={yOf(values[i])} r={2.4} fill={COLOR_BY_KEY[key]} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (shared T=800 / T=3200 rungs: 52, 76, 100, 124)
      </text>
    </svg>
  );
}

export default function Imp96925KreinTTruncationDeficitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Floor: Fixed-T=800 vs T=3200 t-Truncation Deficit" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement only. The
        deficit is a LOWER bound on the true t-truncation gap (T=3200 may still slightly
        under-resolve near ln3). No operator positivity established; interval-rigorous
        certificate reach stays 2a&le;{IMP96814_VERDICT.intervalRigorousReachUnchanged}; RH
        open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96768 measured the Route I Krein Rayleigh floor lambda_min(T_a[sigma_2]) at a fixed
        t-tail (T=800) and again at a best-resolved tail (T=3200), both at N in {'{52, 76, 100, 124}'}.
        imp-96814 sized the relative deficit (T=3200 minus T=800, as a percent of the T=3200 floor)
        per 2a rung. Contrary to the scouted worry that the deficit might grow toward the binding
        2a=ln3 rung, it is the SMALLEST there at every N, and largest at 2a=1.00.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Relative t-truncation deficit vs N, by 2a rung
      </h3>
      <DeficitTrendPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        {Object.keys(IMP96814_DEFICIT_REL_PCT).map((key) => (
          <span key={key} style={{ color: COLOR_BY_KEY[key] }}>
            &#9632; {key}
          </span>
        ))}
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> {IMP96814_VERDICT.answer}
        &nbsp;At N=100 the 2a=ln3 deficit is {IMP96814_VERDICT.ln3DeficitAtN100RelPct}% of the
        T=3200 floor, versus a much larger share at 2a=1.00 and 2a=1.05 &mdash; the modest ln3
        deficit strengthens (does not weaken) the imp-96768 t-converged positive-plateau reading
        near the binding rung.
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
        imp-96814 viz-data leaf (every deficit value reused verbatim from imp-96768). Changes no
        bound, establishes no operator positivity; RH
        open; NO QED.
      </div>
    </div>
  );
}
