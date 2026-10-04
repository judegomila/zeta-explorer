import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP3881_EPS_RUNGS, IMP3881_SIGN_CHANGE_N } from '../data/imp-3881-eps-sign-change-viz-data.js';
import { ED } from '../styles/tokens.js';

const SHRINK_MIN = 3;
const SHRINK_MAX = 148;
const SHRINK_RUNGS = IMP3881_EPS_RUNGS.filter((r) => r.n >= SHRINK_MIN && r.n <= SHRINK_MAX && r.eps > 0);

function ShrinkChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const yMin = -7;
  const yMax = 0.5;

  const xS = (n) => padL + ((Math.log(n) - Math.log(SHRINK_MIN)) / (Math.log(SHRINK_MAX) - Math.log(SHRINK_MIN))) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = SHRINK_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.eps).toFixed(2),
  ).join(' ');

  const yTicks = [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
  const xTicks = [3, 8, 20, 48, 80, 148];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2.2} />
      {SHRINK_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.eps)} r={2.2} fill={ED.series3} />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n (log scale)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        eps_n (log scale)
      </text>
    </svg>
  );
}

const CROSS_MIN = 88;
const CROSS_MAX = 300;
const CROSS_RUNGS = IMP3881_EPS_RUNGS.filter((r) => r.n >= CROSS_MIN);

function CrossingChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = -0.00058;
  const yMax = 0.0017;

  const xS = (n) => padL + ((n - CROSS_MIN) / (CROSS_MAX - CROSS_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = CROSS_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.eps).toFixed(2),
  ).join(' ');

  const yTicks = [-0.0004, -0.0002, 0, 0.0004, 0.0008, 0.0012, 0.0016];
  const xTicks = [88, 149, 200, 250, 300];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      {/* zero line: eps_n = 0 */}
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.series7} strokeWidth={1.2} strokeDasharray="4,3" />

      {/* sign-change marker at n = 149 */}
      <line
        x1={xS(IMP3881_SIGN_CHANGE_N)}
        y1={padT}
        x2={xS(IMP3881_SIGN_CHANGE_N)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xS(IMP3881_SIGN_CHANGE_N) + 4} y={padT + 12} fill={ED.brass} fontSize={8.5}>
        sign change n={IMP3881_SIGN_CHANGE_N}
      </text>

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2.4} />
      {CROSS_RUNGS.map((r) => (
        <circle
          key={r.n}
          cx={xS(r.n)}
          cy={yS(r.eps)}
          r={r.n === 148 || r.n === 149 ? 3.5 : 2.2}
          fill={r.eps >= 0 ? ED.series3 : ED.series1}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        eps_n
      </text>
    </svg>
  );
}

export default function Imp3881EpsSignChangeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Moment-Ratio Correction eps_n Sign-Change Ladder, n=3..300 (imp-3849 / imp-3881)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        eps_n = Q_n/tau*(n)<sup>2</sup> - 1 measures how far the moment ratio Q_n departs from its
        Laplace-saddle estimate tau*(n)<sup>2</sup>. The top panel shows eps_n shrinking from a
        large positive value at small n (eps_3 = 0.538, eps_40 = 9.99e-3) down through the imp-3735
        regime (eps_80 = 2.10e-3) on a log-log scale. The bottom panel zooms into n=88..300 on a
        linear scale: eps_n keeps shrinking, crosses zero between n=148 (eps_148 = +7.60e-6, green)
        and n=149 (eps_149 = -3.46e-6, blue), then goes negative and deepens out to n=300
        (eps_300 = -5.05e-4).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        eps_n vs n, n=3..148 (log-log): the shrinking positive regime
      </p>
      <ShrinkChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        eps_n vs n, n=88..300 (linear, zoomed): the sign-change at n=149 and the negative tail
      </p>
      <CrossingChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> imp-3735 measured eps_n
        positive and shrinking out to n = 80. Continuing the imp-3849 inner-converged ladder shows
        eps_n keeps shrinking past n = 80, crosses zero at n = 149 (green-to-blue transition), then
        goes negative and its magnitude grows before slowly flattening (eps_200 = -3.43e-4,
        eps_300 = -5.05e-4): at large n the moment ratio Q_n dips below its Laplace-saddle estimate.
        This sign-change is what drives the deeper sub-unity R_n well documented in imp-3880.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This pins the CONVERGED shape of a moment-ratio
        correction diagnostic; mass-feasibility is necessary-but-not-sufficient and the
        operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched. The
        sign-change at n=149 is independently cross-checked across three quadrature families in
        imp-3918.
      </div>
    </div>
  );
}
