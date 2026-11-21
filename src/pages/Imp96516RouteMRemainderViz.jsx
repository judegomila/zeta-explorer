import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96516_LADDER_POINTS,
  IMP96516_FITTED_CURVE,
  IMP96516_PLATEAU_LINE,
  IMP96516_RMS_BARS,
  IMP96516_HONEST_BANNER,
} from '../data/imp-96516-route-m-remainder-viz-data.js';
import { ED } from '../styles/tokens.js';

function LadderChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 200;
  const xMax = 11000;
  const xTicks = [250, 1000, 3000, 10000];
  const yMin = 0.95;
  const yMax = 1.02;
  const yTicks = [0.96, 0.98, 1.0, 1.02];

  const xOf = (N) => padL + ((Math.log10(N) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin))) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const fitD = IMP96516_FITTED_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.N).toFixed(2)} ${yOf(p.ratio).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* RH asymptote line at ratio = 1 */}
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.series3} strokeWidth={1.25} strokeDasharray="4 3" opacity={0.85} />
      <text x={padL + plotW - 4} y={yOf(1) - 4} textAnchor="end" fill={ED.series3} fontSize={8.5}>RH asymptote (ratio -&gt; 1)</text>

      {/* fitted plateau centerline */}
      <line x1={padL} y1={yOf(IMP96516_PLATEAU_LINE.c0)} x2={padL + plotW} y2={yOf(IMP96516_PLATEAU_LINE.c0)} stroke={ED.series4} strokeWidth={1.25} strokeDasharray="2 2" opacity={0.85} />
      <text x={padL + 4} y={yOf(IMP96516_PLATEAU_LINE.c0) + 12} fill={ED.series4} fontSize={8.5}>fitted plateau c0~{IMP96516_PLATEAU_LINE.c0.toFixed(4)}</text>

      {/* smooth decaying-oscillation fit */}
      <path d={fitD} fill="none" stroke={ED.series5} strokeWidth={1.25} opacity={0.8} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96516_LADDER_POINTS.map((p) => (
        <circle key={`pt-${p.N}`} cx={xOf(p.N)} cy={yOf(p.ratio)} r={3.2} fill={ED.series1} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        N (log scale, 250 .. 10000)
      </text>
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 14 ${padT + plotH / 2})`}>
        ratio(N)
      </text>
    </svg>
  );
}

function RmsBarChart() {
  const svgW = 480;
  const svgH = 240;
  const padL = 50;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMax = 0.02;
  const yTicks = [0, 0.005, 0.01, 0.015, 0.02];
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  const groupW = plotW / IMP96516_RMS_BARS.length;
  const barW = groupW * 0.32;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>{v.toFixed(3)}</text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96516_RMS_BARS.map((b, i) => {
        const cx = padL + (i + 0.5) * groupW;
        const freeH = plotH - (yOf(b.rmsFreeC0) - padT);
        const forcedH = plotH - (yOf(b.rmsForcedOne) - padT);
        return (
          <g key={`p${b.p}`}>
            <rect x={cx - barW - 2} y={yOf(b.rmsFreeC0)} width={barW} height={freeH} fill={ED.series1} />
            <rect x={cx + 2} y={yOf(b.rmsForcedOne)} width={barW} height={forcedH} fill={ED.series2} />
            <text x={cx} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>p={b.p}</text>
            <text x={cx} y={padT + plotH + 26} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>{b.rmsRatio.toFixed(2)}x</text>
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        decay exponent p (label: forced/free rms ratio)
      </text>
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        rms
      </text>
    </svg>
  );
}

export default function Imp96516RouteMRemainderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96487: Route M Remainder Model" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96516_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96487 fit a 21-rung Route M Burnol-ratio ladder (N=250..10000) to a
        decaying-oscillation remainder model. The best fit (purple curve) extrapolates
        a plateau centerline c0~0.9846 (orange dashed line), sitting below the RH
        asymptote ratio -&gt; 1 (green dashed line). Forcing the fit to converge to 1
        instead roughly doubles the rms across every decay exponent tried, shown in
        the bar chart below.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        21-rung ratio(N) ladder with fitted plateau (log-N x-axis)
      </h3>
      <LadderChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        rms: free plateau vs forced ratio-&gt;1, per decay exponent p
      </h3>
      <RmsBarChart />
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
        <span><span style={{ display: 'inline-block', width: 9, height: 9, background: 'var(--series-1)', marginRight: 6 }} />free plateau (best fit)</span>
        <span><span style={{ display: 'inline-block', width: 9, height: 9, background: 'var(--series-2)', marginRight: 6 }} />forced c0 = 1 (RH asymptote)</span>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top panel
        shows the 21 measured rungs (blue points) tracking the fitted decaying-oscillation
        curve closely, oscillating about the plateau rather than drifting toward the
        RH line. The bottom panel shows that at every decay exponent p in {'{0,1,2}'}
        tried, forcing the model to converge to 1 (red bars) roughly doubles the rms
        versus letting the plateau float free (blue bars) -- the accessible N &lt;= 1e4
        data prefer the plateau reading.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming
        the imp-96487 baked ladder and fitted-model objects verbatim (the only new step
        is sampling the fixed fitted curve at a dense grid for a smooth plot line). The
        3.689-wide log-N window (~2.26 oscillation periods) leaves the true asymptote
        undecided -- this does not resolve whether ratio(N) -&gt; 1 beyond N=1e4.
        Measurement/fit-visualization only; changes no bound; establishes no operator
        positivity; RH open; NO QED.
      </div>
    </div>
  );
}
