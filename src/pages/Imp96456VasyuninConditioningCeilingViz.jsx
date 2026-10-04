import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96456_LAMMIN_MEASURED_POINTS,
  IMP96456_LAMMIN_EXTRAP_POINTS,
  IMP96456_LAMMIN_FIT_CURVE,
  IMP96456_COND_CURVES,
  IMP96456_PROXY_LABELS,
  IMP96456_LANDMARKS,
  IMP96456_HONEST_BANNER,
} from '../data/imp-96456-vasyunin-conditioning-ceiling-viz-data.js';
import { ED } from '../styles/tokens.js';

function LamMinChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 2, xMax = 6.1;
  const yMin = -13, yMax = -4;

  const xOf = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yOf = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [2, 3, 4, 5, 6];
  const yTicks = [-4, -6, -8, -10, -12];

  const fitD = IMP96456_LAMMIN_FIT_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10LamMin).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {`1e${v}`}
        </text>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={fitD} fill="none" stroke={ED.series5} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.9} />

      {IMP96456_LAMMIN_MEASURED_POINTS.map((p) => (
        <circle key={`m-${p.N}`} cx={xOf(p.log10N)} cy={yOf(p.log10LamMin)} r={2.8} fill={ED.series1} />
      ))}
      {IMP96456_LAMMIN_EXTRAP_POINTS.map((p) => (
        <circle key={`e-${p.N}`} cx={xOf(p.log10N)} cy={yOf(p.log10LamMin)} r={2.4} fill="none" stroke={ED.series1} strokeWidth={1.2} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        N
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={4} cy={0} r={2.8} fill={ED.series1} />
        <text x={12} y={3} fill={ED.inkSoft} fontSize={8.5}>measured lam_min (imp-96105 / imp-96325)</text>
        <circle cx={4} cy={14} r={2.4} fill="none" stroke={ED.series1} strokeWidth={1.2} />
        <text x={12} y={17} fill={ED.inkSoft} fontSize={8.5}>extrapolated lam_min (fit, N &gt; 1e4)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.series5} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>power-law fit: 0.8187 * N^-1.918 (R^2=0.99998)</text>
      </g>
    </svg>
  );
}

function CondChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 2, xMax = 9;
  const yMin = 0, yMax = 17;

  const xOf = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yOf = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [2, 3, 4, 5, 6, 7, 8, 9];
  const yTicks = [0, 4, 8, 12, 16];

  const pathFor = (curve, key) =>
    curve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10Cond).toFixed(2)}`).join(' ');

  const colors = { linear: ED.series4, trace: ED.series1, constOne: ED.series3 };
  const breakdownY = yOf(IMP96456_LANDMARKS.log10Breakdown);
  const computeX = xOf(IMP96456_LANDMARKS.log10ComputeCeilingN);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {`1e${v}`}
        </text>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {/* 1/eps breakdown line */}
      <line x1={padL} y1={breakdownY} x2={padL + plotW} y2={breakdownY} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <text x={padL + 4} y={breakdownY - 4} fill={ED.series2} fontSize={8}>
        1/eps breakdown (cond# = 4.5e15)
      </text>

      {/* compute ceiling vertical line, imp-96352 */}
      <line x1={computeX} y1={padT} x2={computeX} y2={padT + plotH} stroke={ED.inkSoft} strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
      <text x={computeX + 3} y={padT + 10} fill={ED.ink} fontSize={8}>
        compute ceiling N~9916
      </text>

      <path d={pathFor(IMP96456_COND_CURVES.linear)} fill="none" stroke={colors.linear} strokeWidth={1.5} opacity={0.95} />
      <path d={pathFor(IMP96456_COND_CURVES.trace)} fill="none" stroke={colors.trace} strokeWidth={2} opacity={0.95} />
      <path d={pathFor(IMP96456_COND_CURVES.constOne)} fill="none" stroke={colors.constOne} strokeWidth={1.5} opacity={0.95} />

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        N
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 24})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={colors.linear} strokeWidth={1.5} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>{IMP96456_PROXY_LABELS.linear}, ceiling N~2.16e5</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={colors.trace} strokeWidth={2} />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>{IMP96456_PROXY_LABELS.trace}, ceiling N~9.3e6</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={colors.constOne} strokeWidth={1.5} />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>{IMP96456_PROXY_LABELS.constOne}, ceiling N~1.31e8</text>
      </g>
    </svg>
  );
}

export default function Imp96456VasyuninConditioningCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96428: Route M Vasyunin Conditioning Ceiling" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96456_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96428 fit the SPD Vasyunin Gram lam_min(N) over the imp-96105/imp-96325 measured
        rungs to a clean near-N^-2 power law, then asked at what N the condition number
        cond#(N) = lam_max/lam_min reaches the double-precision Cholesky-breakdown scale
        1/eps, under three lam_max proxies. All three ceilings sit far beyond the imp-96352
        compute ceiling N~9916, so conditioning does not cap the reachable range -- compute
        binds first.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        lam_min(N): 12 measured rungs, power-law fit, extrapolation
      </h3>
      <LamMinChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        cond#(N) under the three lam_max proxies vs the 1/eps breakdown line
      </h3>
      <CondChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the top panel shows
        the lam_min(N) decay is a clean power law (open circles are the fit extrapolated past
        the already-run N=1e4). The bottom panel traces cond#(N) under each proxy; all three
        curves cross the red 1/eps breakdown line far to the right of the white compute-ceiling
        line at N~9916 -- the pessimistic linear proxy crosses first, at N~2.16e5 (still 22x
        past the compute ceiling), and the rigorous trace proxy and optimistic constant proxy
        cross even later.
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
        imp-96428 baked fit, rungs, and ceilings verbatim; the cond#(N) curves are traced from
        the exact lam_max(N) proxy formulas imp-96428's prose names (N, 10 log N, 1), each
        checked to reproduce the published ceiling-N and target cond# values. Measurement /
        extrapolation only: no Gram was rebuilt, no bound changed, no operator positivity
        established. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. RH open. NO QED.
      </div>
    </div>
  );
}
