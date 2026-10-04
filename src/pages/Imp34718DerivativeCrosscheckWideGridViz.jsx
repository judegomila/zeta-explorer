import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID } from '../data/imp-34692-derivative-crosscheck-wide-grid.js';
import { ED } from '../styles/tokens.js';

const M = IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID;
const log10 = (x) => Math.log(x) / Math.LN10;

// -- Independent re-derivation of the imp-34692 wide-grid sweep, for plotting only --------------
// Mirrors the data module's inline Riemann-von Mangoldt inverse-height solver (NOT imported) so
// this page can draw the full 201-point curve; the module itself only exports summary statistics.
const TWO_PI = 2 * Math.PI;
function inverseHeight(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}
const dT0dNanalytic = (N) => TWO_PI / Math.log(inverseHeight(N) / TWO_PI);
const dT0dNnumeric = (N, relStep) => {
  const h = N * relStep;
  return (inverseHeight(N + h) - inverseHeight(N - h)) / (2 * h);
};

const N_STAR = M.measured.grid_lo;
const N_TAIL = M.measured.grid_hi;
const N_CROSS = 3.280294e9;
const GRID_POINTS = 200;

function buildGridCurve(relStep) {
  const lo = log10(N_STAR);
  const hi = log10(N_TAIL);
  const pts = [];
  for (let i = 0; i <= GRID_POINTS; i++) {
    const N = 10 ** (lo + ((hi - lo) * i) / GRID_POINTS);
    const a = dT0dNanalytic(N);
    const num = dT0dNnumeric(N, relStep);
    const rel = Math.abs(num / a - 1);
    pts.push({ N, rel: Math.max(rel, 1e-16) });
  }
  return pts;
}

function WideGridChart({ points }) {
  const svgW = 660;
  const svgH = 300;
  const padL = 60;
  const padR = 24;
  const padT = 22;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = log10(N_STAR);
  const xMax = log10(N_TAIL);
  const yVals = points.map((p) => log10(p.rel));
  const yMin = Math.min(...yVals) - 0.5;
  const yMax = Math.max(...yVals) + 0.5;

  const xAt = (N) => padL + ((log10(N) - xMin) / (xMax - xMin)) * cW;
  const yAt = (rel) => padT + cH - ((log10(rel) - yMin) / (yMax - yMin)) * cH;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.N)},${yAt(p.rel)}`).join(' ');
  const worst = points.reduce((m, p) => (p.rel > m.rel ? p : m), points[0]);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <line
        x1={xAt(N_CROSS)}
        y1={padT}
        x2={xAt(N_CROSS)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={xAt(N_CROSS) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        N_cross &asymp; 3.28e9
      </text>

      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={1.75} />

      <circle cx={xAt(worst.N)} cy={yAt(worst.rel)} r={4} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(worst.N) + 6} y={yAt(worst.rel) - 6} fill={ED.series2} fontSize={9}>
        worst &asymp; {worst.rel.toExponential(2)}
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale, {N_STAR.toExponential(2)} &rarr; {N_TAIL.toExponential(2)})
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        log10 |FD/analytic dT0/dN - 1|
      </text>
    </svg>
  );
}

function StepStudyChart() {
  const svgW = 660;
  const svgH = 300;
  const padL = 60;
  const padR = 24;
  const padT = 22;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const pts = M.measured.step_study;
  const xVals = pts.map((p) => log10(p.h_over_N));
  const yVals = pts.map((p) => log10(p.rel_err));
  const xMin = Math.min(...xVals) - 0.4;
  const xMax = Math.max(...xVals) + 0.4;
  const yMin = Math.min(...yVals) - 0.4;
  const yMax = Math.max(...yVals) + 0.4;

  const xAt = (h) => padL + ((log10(h) - xMin) / (xMax - xMin)) * cW;
  const yAt = (e) => padT + cH - ((log10(e) - yMin) / (yMax - yMin)) * cH;

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.h_over_N)},${yAt(p.rel_err)}`).join(' ');
  const bestH = M.measured.best_step_h_over_N;
  const bestErr = M.measured.best_step_rel_err;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <line
        x1={xAt(bestH)}
        y1={padT}
        x2={xAt(bestH)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={xAt(bestH) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        optimum h/N &asymp; {bestH.toExponential(0)}
      </text>

      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {pts.map((p) => (
        <circle key={p.h_over_N} cx={xAt(p.h_over_N)} cy={yAt(p.rel_err)} r={4} fill="#cbd5e1" stroke={ED.paper} strokeWidth={1} />
      ))}

      <circle cx={xAt(bestH)} cy={yAt(bestErr)} r={5} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 relative step h/N (truncation &rarr; roundoff, at N_cross)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        log10 relative error
      </text>
    </svg>
  );
}

export default function Imp34718DerivativeCrosscheckWideGridViz() {
  const gridPoints = useMemo(() => buildGridCurve(1e-6), []);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Wide-Grid Derivative Cross-Check (imp-34718 / imp-34692)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-34650 analytic map derivative gPrime(N) = K&middot;(dT0/dN)/T0, with
        dT0/dN = 2&pi;/log(T0/2&pi;), was checked against a central finite difference at only two
        contraction endpoints (N = 1e9, 1e10). imp-34692 widened that check to a dense 201-point
        log grid spanning the imp-34675 left edge N_star &asymp; {N_STAR.toExponential(3)} to the
        imp-34676 tail N &asymp; {N_TAIL.toExponential(2)}: worst relative error{' '}
        {M.measured.worst_relerr_h1e6} at h/N = 1e-6 (tightening to {M.measured.worst_relerr_h1e5}{' '}
        at the near-optimal h/N = 1e-5), with no sign or reciprocal slip anywhere on the interval.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        FD-vs-analytic relative error of gPrime(N) across the 200-point log grid (h/N = 1e-6)
      </p>
      <WideGridChart points={gridPoints} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Step-size V-curve at N_cross: O(h&sup2;) truncation down to a floor, then roundoff climb
      </p>
      <StepStudyChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>h/N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>relative error</th>
          </tr>
        </thead>
        <tbody>
          {M.measured.step_study.map((s) => (
            <tr key={s.h_over_N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.h_over_N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.rel_err.toExponential(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        Because tuning h drives the residual arbitrarily small (best {M.measured.best_step_rel_err}{' '}
        at h/N = {M.measured.best_step_h_over_N.toExponential(0)}, vs a formula error which would
        leave a non-vanishing floor as h &rarr; 0), the ~1e-10 fixed-step residual is method/roundoff
        -limited, not a defect in gPrime.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page, recomputing the
        imp-34692 sweep (inline Riemann&ndash;von Mangoldt inverse-height solver, re-typed and
        independent of the source solver) purely for plotting; establishes no new numerical claim.
        Cross-validation of an inherited imp-3220/imp-3406 surrogate derivative; does not touch the
        imp-34650a interval-arithmetic upgrade (still OPEN); C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi)
        (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) untouched; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
