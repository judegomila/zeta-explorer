import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION } from '../data/imp-33858-widening-fit-residual-localization.js';
import { ED } from '../styles/tokens.js';

const { perRungResidual, trough, farTailPeak, lag1Autocorr, signFlips, whiteNoiseExpectedFlips, aggregateRmse } =
  IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION;

function ResidualShapeChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 11;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const rMax = Math.max(...perRungResidual.map((r) => Math.abs(r.resid))) * 1.15;
  const yZero = padT + cH / 2;
  const yS = (resid) => yZero - (resid / rMax) * (cH / 2);

  const barW = (cW / (perRungResidual.length - 1)) * 0.6;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke={ED.rule} strokeWidth={1.5} />

      {[rMax, rMax / 2, 0, -rMax / 2, -rMax].map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {[6, 7, 8, 9, 10, 11].map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (ladder rung, N = 10^k)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        signed residual e_k (ln-ratio units)
      </text>

      {perRungResidual.map((r) => {
        const isTrough = r.k === trough.k;
        const isPeak = r.k === farTailPeak.k;
        const fill = isTrough ? ED.series2 : isPeak ? ED.series3 : r.resid >= 0 ? ED.series1 : ED.series5;
        const y0 = yS(0);
        const y1 = yS(r.resid);
        return (
          <rect
            key={'bar' + r.k}
            x={xS(r.k) - barW / 2}
            y={Math.min(y0, y1)}
            width={barW}
            height={Math.max(1, Math.abs(y1 - y0))}
            fill={fill}
            stroke={ED.paper}
            strokeWidth={0.5}
          />
        );
      })}
    </svg>
  );
}

export default function Imp33894ResidualShapeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-33843 Log-Linear Fit: Signed Residual Shape (imp-33858 / imp-33894)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33843 fit the imp-33810 eflow_attr/resid_exp widening to a log-linear surrogate and
        reported only the aggregate residual (RMSE &sim;{aggregateRmse}). imp-33858 tabulated the
        signed residual at each of the 21 rungs and found it is NOT uniform noise: it flips sign
        only {signFlips} times (vs &sim;{whiteNoiseExpectedFlips} expected for white noise) and
        carries a lag-1 autocorrelation of &sim;{lag1Autocorr}. This page is the first visual
        surface of that shape -- a head dip, a mid-ladder positive hump, a broad negative trough
        centered at k={trough.k} (highlighted red, e&sim;{trough.resid}), and a strong positive
        far-tail excursion at k={farTailPeak.k} (highlighted green, e&sim;{farTailPeak.resid}, the
        largest single residual).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Signed per-rung residual e_k of the imp-33843 log-linear fit, k = 6.00 .. 11.00
      </p>
      <ResidualShapeChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual e_k</th>
          </tr>
        </thead>
        <tbody>
          {perRungResidual.map((r) => (
            <tr key={r.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k.toFixed(2)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.k === trough.k ? 'var(--series-2)' : r.k === farTailPeak.k ? 'var(--series-3)' : 'var(--ink)',
                }}
              >
                {r.resid}
              </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization only
        -- the curvature shown here is real (a coherent low-frequency structure, not scatter) but
        stays small (&sim;12% multiplicative, within &sim;0.12 ln-ratio units) and does NOT overturn
        the imp-33843 log-linear-over-power-law form selection (R^2 &sim;0.99715 unchanged). The
        component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
        the OLS surrogate is descriptive, not derived. No bound changes; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Cohort note:</strong> the residual series plotted above
        is the SAME 21-rung series that imp-33886, imp-33920, imp-33921, imp-33963 (Dickey-Fuller
        unit-root test), imp-33964 (Ljung-Box portmanteau test), and imp-33965 (exact Durbin-Watson
        permutation bound) each run a different formal serial-dependence test against. All six tests
        calibrate this one inherited residual -- none of them changes the RMSE (&sim;{aggregateRmse}),
        reopens the imp-33843 log-linear-vs-power-law form selection, or touches any bound.
        "Significant" throughout that cohort means "not white noise", never "large": the residual
        stays the same small &sim;12% multiplicative effect shown here at every rung.
      </div>
    </div>
  );
}
