import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96334_FAMILY,
  IMP96334_SLOPE_PANEL,
  IMP96334_MAX_SLOPE_SPREAD,
  IMP96334_PREFACTOR,
  IMP96334_HONEST_BANNER,
} from '../data/imp-96334-ecoll-rate-ch-independence-viz-data.js';
import { ED } from '../styles/tokens.js';

const SERIES_COLORS = [ED.series1, ED.series5, ED.series3, ED.series4];

function LogLogFamilyChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 58;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allN = IMP96334_FAMILY[0].points.map((p) => p.N);
  const allValues = IMP96334_FAMILY.flatMap((s) => s.points.map((p) => p.value));

  const lnMin = Math.log(Math.min(...allN));
  const lnMax = Math.log(Math.max(...allN));
  const logVMin = Math.log10(Math.min(...allValues));
  const logVMax = Math.log10(Math.max(...allValues));

  const xOf = (N) => padL + ((Math.log(N) - lnMin) / (lnMax - lnMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - logVMin) / (logVMax - logVMin)) * plotH;

  const xTicks = allN;
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => Math.pow(
    10,
    logVMin + ((logVMax - logVMin) * i) / (yTickCount - 1),
  ));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>{v.toExponential(1)}</text>
        </g>
      ))}
      {xTicks.map((N) => (
        <g key={`x${N}`}>
          <line x1={xOf(N)} y1={padT} x2={xOf(N)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(N)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>{N.toExponential(0)}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96334_FAMILY.map((s, si) => {
        const path = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.N).toFixed(2)} ${yOf(p.value).toFixed(2)}`).join(' ');
        return (
          <g key={s.C_H}>
            <path d={path} fill="none" stroke={SERIES_COLORS[si % SERIES_COLORS.length]} strokeWidth={1.5} opacity={0.9} />
            {s.points.map((p) => (
              <circle key={`${s.C_H}-${p.N}`} cx={xOf(p.N)} cy={yOf(p.value)} r={2.2} fill={SERIES_COLORS[si % SERIES_COLORS.length]} />
            ))}
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>N (log scale)</text>
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        E_coll(N) (log scale)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        {IMP96334_FAMILY.map((s, si) => (
          <g key={s.C_H} transform={`translate(0, ${si * 13})`}>
            <line x1={0} y1={0} x2={8} y2={0} stroke={SERIES_COLORS[si % SERIES_COLORS.length]} strokeWidth={1.5} />
            <text x={12} y={3} fill={ED.inkSoft} fontSize={8.5}>{s.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function SlopePanel() {
  const svgW = 680;
  const svgH = 180;
  const padL = 58;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const slopes = IMP96334_SLOPE_PANEL.map((s) => s.slope);
  const yMin = Math.min(-0.5, ...slopes) - 0.01;
  const yMax = Math.max(...slopes) + 0.01;

  const xOf = (i) => padL + (i / (IMP96334_SLOPE_PANEL.length - 1)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const path = IMP96334_SLOPE_PANEL.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i).toFixed(2)} ${yOf(s.slope).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yOf(-0.5)} x2={padL + plotW} y2={yOf(-0.5)} stroke={ED.series2} strokeDasharray="2 3" strokeWidth={1} opacity={0.6} />
      <text x={padL + plotW - 2} y={yOf(-0.5) - 4} textAnchor="end" fill={ED.series2} fontSize={8.5}>exponent -1/2 (target)</text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {IMP96334_SLOPE_PANEL.map((s, i) => (
        <circle key={s.segment} cx={xOf(i)} cy={yOf(s.slope)} r={2.6} fill={ED.series1} />
      ))}
      {IMP96334_SLOPE_PANEL.map((s, i) => (
        <text key={`${s.segment}-lbl`} x={xOf(i)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {s.segment}
        </text>
      ))}

      {[yMin, -0.5, yMax].map((v) => (
        <text key={`y${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>{v.toFixed(3)}</text>
      ))}
    </svg>
  );
}

export default function Imp96334EcollRateChIndependenceChartViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96311: E_coll Rate-vs-Conclusion C_H-Independence" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96334_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Four parallel log-log lines, one per C_H magnitude ({IMP96334_FAMILY.map((s) => s.label).join(', ')}),
        showing E_coll(N) = C_H &middot; sqrt(C_KH) &middot; (log &gamma;_N / N)^(1/2) across the N ladder from
        1e4 to 1e12. The lines are exactly parallel on this log-log plot because C_H enters only as a
        multiplicative prefactor (cross-column ratio matches C_H_a / C_H_b to within{' '}
        {IMP96334_PREFACTOR.maxDeviation.toExponential(2)}): it shifts the height, never the slope.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        E_coll(N) family across four C_H magnitudes (log-log)
      </h3>
      <LogLogFamilyChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Shared segment slope d(log E_coll)/d(log N), crawling toward -1/2
      </h3>
      <SlopePanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top panel&rsquo;s four
        lines are visually indistinguishable in slope &mdash; only their vertical offset differs,
        confirming C_H is a pure prefactor. The bottom panel plots the single shared slope curve
        (max cross-C_H spread {IMP96334_MAX_SLOPE_SPREAD.toExponential(2)}, a few ULP): it sits above
        -1/2 at every segment and crawls monotonically toward it, the slow positive log correction
        from log &gamma;_N. This confirms the rate is unconditional; only the E(N) &rarr; 0
        conclusion is gated on C_H (hence C_Lip) being finite and N-uniform.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96311
        baked columns and slope profile verbatim (only the plotting shape is computed here).
        Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
