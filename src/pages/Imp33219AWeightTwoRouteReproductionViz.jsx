import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33219_NPHI_SWEEP,
  IMP33219_CINF_DIRECT,
  IMP33219_CINF_FACTORED,
  IMP33219_CINF_EXTRAPOLATED_IMP3730,
  IMP33219_B_CLOSED,
  IMP33219_B_LADDER,
  IMP33219_B_FINITE_DIFF,
} from '../data/imp-33219-a-weight-two-route-reproduction-viz-data.js';
import { ED } from '../styles/tokens.js';

function NphiConvergenceChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const rows = IMP33219_NPHI_SWEEP.filter((r) => r.deltaFromNphi10 > 0);
  const yMin = -10;
  const yMax = -2.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));
  const barW = (cW / rows.length) * 0.5;

  const yTicks = [1e-3, 1e-5, 1e-7, 1e-9];

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

      {rows.map((r, i) => (
        <rect
          key={r.N}
          x={xS(i) - barW / 2}
          y={yS(r.deltaFromNphi10)}
          width={barW}
          height={padT + cH - yS(r.deltaFromNphi10)}
          fill={ED.series1}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => (
        <g key={'x' + r.N}>
          <line x1={xS(i)} y1={padT + cH} x2={xS(i)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            N={r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        NPHI truncation N
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        |Phi0(N) - Phi0(N=10)| (log)
      </text>
    </svg>
  );
}

function BLadderChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const tauMin = 2.5;
  const tauMax = 6.5;
  const yMin = 0.4765;
  const yMax = 0.4795;

  const xS = (tau) => padL + ((tau - tauMin) / (tauMax - tauMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP33219_B_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.tau).toFixed(1) + ',' + yS(r.bEmp).toFixed(2),
  ).join(' ');

  const yTicks = [0.477, 0.478, 0.4785, 0.479];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(4)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33219_B_CLOSED)}
        x2={padL + cW}
        y2={yS(IMP33219_B_CLOSED)}
        stroke={ED.series7}
        strokeWidth={1.2}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33219_B_CLOSED) - 5} textAnchor="end" fill={ED.series7} fontSize={8.5}>
        B = 3/(2 pi) = {IMP33219_B_CLOSED.toFixed(6)}
      </text>

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2.4} />
      {IMP33219_B_LADDER.map((r) => (
        <circle key={r.tau} cx={xS(r.tau)} cy={yS(r.bEmp)} r={4} fill={ED.series3} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP33219_B_LADDER.map((r) => (
        <g key={'x' + r.tau}>
          <line x1={xS(r.tau)} y1={padT + cH} x2={xS(r.tau)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.tau)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.tau}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        tau
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        bEmp(tau) = (c(tau)-c_inf)/e^-2tau
      </text>
    </svg>
  );
}

export default function Imp33219AWeightTwoRouteReproductionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="A-Weight Closed-Form Two-Route Reproduction (imp-3867 / imp-33219)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3844 derived closed forms for the A-weight subleading correction limit
        c_inf = -ln((pi/2) Phi(0)) = {IMP33219_CINF_FACTORED.toFixed(11)} and the approach
        coefficient B = 3/(2 pi) &asymp; {IMP33219_B_CLOSED.toFixed(6)}, both via a single
        factored-log evaluation path. imp-3867 re-derived both constants through two
        structurally distinct routes: (1) a direct completed-Riemann kernel series where each
        term keeps its own e<sup>-pi n^2</sup> weight (no common factor extracted), and (2) a
        Gauss-Laguerre collapsed-Laplace quadrature (vs the imp-3844 graded Gauss-Legendre-in-s
        rule). Both routes land on the same constants, confirming they are not single-path
        numerical artifacts.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Route (1): direct-series Phi(0) truncation error |Phi0(N) - Phi0(N=10)|, converged by N=3
      </p>
      <NphiConvergenceChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Route (2): Gauss-Laguerre approach coefficient bEmp(tau) converging monotonically to the
        closed-form B = 3/(2 pi) (dashed)
      </p>
      <BLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the top chart shows the
        direct completed-Riemann series' truncation error collapsing to machine zero by N=3 (only
        N=1,2 are visible on the log axis), so c_inf = -ln((pi/2) Phi(0)) &asymp;{' '}
        {IMP33219_CINF_DIRECT.toFixed(11)} from this route does not depend on the NPHI=10 choice,
        and agrees with the imp-3844 factored-acc0 route to &lt; 1e-14 and the imp-3730
        extrapolation {IMP33219_CINF_EXTRAPOLATED_IMP3730} to 1.3e-6. The bottom chart shows the
        single-point coefficient bEmp(tau) = (c(tau)-c_inf)/e<sup>-2 tau</sup>, measured from a
        Gauss-Laguerre quadrature sharing none of the imp-3844 Gauss-Legendre machinery, closing
        in on B = 3/(2 pi) monotonically from above as tau grows from 3 to 6; the [6,7] finite
        difference independently recovers B &asymp; {IMP33219_B_FINITE_DIFF.toFixed(6)}, within
        5e-6 of the closed form.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> reproduction/cross-check
        only -- no proof, no reduction below RH. Route (2) still relies on the imp-3844 analytic
        collapse (the n=1-tail approximation and the t = e<sup>4s</sup>-1 substitution) and does
        NOT bound the O(e<sup>-4 tau</sup>) Watson tail (sg-3844-watson-tail); this establishes no
        operator positivity, mass-feasibility is necessary-but-not-sufficient, and the
        operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched.
      </div>
    </div>
  );
}
