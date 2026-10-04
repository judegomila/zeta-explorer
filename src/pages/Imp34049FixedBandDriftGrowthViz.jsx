import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT } from '../data/imp-33987-fixed-band-convex-drift-exponent.js';
import { ED } from '../styles/tokens.js';

const {
  fixedBandRows: ROWS,
  powerLawFit: POWER_FIT,
  exponentialFit: EXP_FIT,
  linearFitContrast: LIN_FIT,
} = IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT;

// Fixed-band (k<=10) peak vs kEnd across the 7-window sweep, with the power-law, exponential
// and linear-null overlays evaluated on the same kEnd grid.
function FixedBandDriftChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ROWS.map((r) => r.kEnd);
  const ys = ROWS.map((r) => r.peak);

  const powerYs = xs.map((k) => POWER_FIT.A * Math.pow(k, POWER_FIT.exponent));
  const expYs = xs.map((k) => EXP_FIT.A * Math.exp(EXP_FIT.rate * k));
  const linYs = xs.map((k) => LIN_FIT.b * k + (ys[0] - LIN_FIT.b * xs[0]));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const allYs = [...ys, ...powerYs, ...expYs, ...linYs];
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);
  const padY = (maxY - minY) * 0.08;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY - padY) / (maxY - minY + 2 * padY)) * cH;

  const lineOf = (ys2) => xs.map((x, i) => `${xAt(x)},${yAt(ys2[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={lineOf(linYs)} fill="none" stroke={ED.rule} strokeWidth={1.25} strokeDasharray="2,3" />
      <polyline points={lineOf(expYs)} fill="none" stroke={ED.series5} strokeWidth={1.5} strokeDasharray="6,3" />
      <polyline points={lineOf(powerYs)} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      <polyline points={lineOf(ys)} fill="none" stroke="none" />
      {xs.map((x, i) => (
        <circle key={`pk-${x}`} cx={xAt(x)} cy={yAt(ys[i])} r={4} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-${x}`} x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (OLS fit boundary)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        fixed-band (k&lt;=10) peak residual
      </text>
      <text x={padL + 4} y={padT + 12} fill={ED.brass} fontSize={9.5}>
        measured fixed-band peak (7 windows)
      </text>
      <text x={padL + 4} y={padT + 26} fill={ED.series1} fontSize={9.5}>
        power law A*kEnd^p, p~{POWER_FIT.exponent.toFixed(2)} (R2~{POWER_FIT.r2.toFixed(4)})
      </text>
      <text x={padL + 4} y={padT + 40} fill={ED.series5} fontSize={9.5}>
        exponential A*exp(b*kEnd), b~{EXP_FIT.rate.toFixed(4)} (R2~{EXP_FIT.r2.toFixed(4)})
      </text>
      <text x={padL + 4} y={padT + 54} fill={ED.inkFaint} fontSize={9.5}>
        linear-null (R2~{LIN_FIT.r2.toFixed(4)})
      </text>
    </svg>
  );
}

export default function Imp34049FixedBandDriftGrowthViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Convex Drift Growth Fits (imp-33987)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33940 R2 found the largest residual in a boundary-independent low-k band (k&lt;=10) of the
        imp-33843 log-linear widening fit drifts convexly as the OLS fit boundary kEnd recedes. imp-33987
        extends that sweep a full decade past imp-33940 s kEnd=13, over kEnd=11.0..14.0 (7 windows), and
        fits the resulting 7 fixed-band peaks with a power law, an exponential, and a linear convex-null.
        The chart below plots the measured peaks against all three overlays on one axis: the power law
        (p~{POWER_FIT.exponent.toFixed(2)}) edges the exponential and both crush the linear fit on curvature.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fixed-band (k&lt;=10) peak vs kEnd -- measured points with power-law / exponential / linear overlays
      </p>
      <FixedBandDriftChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / residual-growth fit
        only, no proof, no fresh derivation. {IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.finding.F2_growth_exponent_strongly_super_linear}{' '}
        The component model is the inherited imp-3220/imp-3406 extrapolation; the OLS surrogate and the
        growth-exponent classification are descriptive, not derived; C_mb GUE-conditional per imp-486
        untouched; NO QED.
      </div>
    </div>
  );
}
