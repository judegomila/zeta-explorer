import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION } from '../data/imp-34551-bignum-resid-argmax-extended-precision.js';
import { IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR } from '../data/imp-34524-continuum-margin-below-ulp-floor.js';
import { ED } from '../styles/tokens.js';

const {
  kStarDd,
  residUlp,
  rungs,
  argmaxNeverLocks,
} = IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION;

// The imp-34524 f-independent curvature-bound margin (e=24,25,26 only), converted to the same
// resid_exp storage-ULP units as the imp-34551 dd-measured margin, for a side-by-side comparison.
const NATIVE_BOUND_ULPS = Object.fromEntries(
  Object.entries(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.rungMaxMargin).map(([key, abs]) => [
    Number(key.slice(1)),
    abs / residUlp,
  ])
);

function ArgmaxJitterChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 32;
  const padT = 30;
  const padB = 48;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const exponents = rungs.map((r) => r.exponent);
  const xMin = Math.min(...exponents) - 0.5;
  const xMax = Math.max(...exponents) + 0.5;

  const logDdMargins = rungs.map((r) => Math.log10(r.marginUlps));
  const logNativeMargins = Object.values(NATIVE_BOUND_ULPS).map((v) => Math.log10(v));
  const yMin = Math.min(...logDdMargins, ...logNativeMargins, 0) - 0.3;
  const yMax = Math.max(...logDdMargins, ...logNativeMargins, 0) + 0.3;

  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const linePts = rungs.map((r) => `${xS(r.exponent)},${yS(Math.log10(r.marginUlps))}`).join(' ');

  const yTicks = [yMin, 0, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t, ti) => (
        <g key={'yt' + ti}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {Math.pow(10, t).toPrecision(2)}
          </text>
        </g>
      ))}
      {exponents.map((e, i) => (
        <text key={'xt' + i} x={xS(e)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          e={e}
        </text>
      ))}

      {/* one storage ULP -- the native-double resolvability floor */}
      <line
        x1={padL}
        y1={yS(0)}
        x2={padL + cW}
        y2={yS(0)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />
      <text x={padL + 6} y={yS(0) - 6} fill={ED.series2} fontSize={9}>
        1 storage ULP (native-double resolvability floor)
      </text>

      {/* dd-measured top-two margin across rungs */}
      <polyline points={linePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      {rungs.map((r, i) => {
        const belowFloor = r.marginUlps < 1;
        return (
          <g key={'dd' + i}>
            <circle
              cx={xS(r.exponent)}
              cy={yS(Math.log10(r.marginUlps))}
              r={4.5}
              fill={belowFloor ? ED.series2 : ED.series1}
            />
            <text
              x={xS(r.exponent)}
              y={yS(Math.log10(r.marginUlps)) - 10}
              textAnchor="middle"
              fill={belowFloor ? ED.series2 : ED.series1}
              fontSize={9}
            >
              {r.marginUlps.toFixed(3)}
            </text>
          </g>
        );
      })}

      {/* imp-34524 native curvature-bound margin estimate, for comparison (e=24,25,26 only) */}
      {Object.entries(NATIVE_BOUND_ULPS).map(([e, v], i) => (
        <rect
          key={'nb' + i}
          x={xS(Number(e)) - 4}
          y={yS(Math.log10(v)) - 4}
          width={8}
          height={8}
          fill="none"
          stroke={ED.rule}
          strokeWidth={1.5}
          transform={`rotate(45 ${xS(Number(e))} ${yS(Math.log10(v))})`}
        />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        refinement rung e (dyadic step 2^-e)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        top-two resid_exp margin (storage ULPs, log scale)
      </text>
    </svg>
  );
}

export default function Imp34551DeepRungArgmaxJitterViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deep-Rung Argmax Jitter, dd-Resolved (imp-34551)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34551 recomputed the resid_exp(k) doubling-map argmax in double-double (106-bit) arithmetic
        at rungs e=23..27, resolving the top-two dyadic-node margin (blue) well below the native-double
        storage floor of one ULP (red dashed line). At e=25/26/27 the dd-measured margin sits at 0.480,
        0.049 and 0.048 ULP -- native double genuinely cannot tell those nodes apart. The grey diamonds
        mark the imp-34524 curvature-bound margin ESTIMATE for comparison, which crosses the same floor
        one rung later (between e=25 and e=26). The winning dyadic node never locks
        (converging to the non-dyadic k*_dd = {kStarDd.toFixed(10)}
        {argmaxNeverLocks ? ', confirmed never settling on a fixed value' : ''}).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        top-two resid_exp margin vs rung e -- dd-measured (blue) vs curvature-bound estimate (grey), 1 ULP floor
      </p>
      <ArgmaxJitterChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>rung e</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dd argmax</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dd margin (ULPs)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>native bound (ULPs)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>native-resolvable?</th>
          </tr>
        </thead>
        <tbody>
          {rungs.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.exponent}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ddArgmax.toFixed(12)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.marginUlps < 1 ? 'var(--series-2)' : 'var(--series-3)',
                }}
              >
                {r.marginUlps.toFixed(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {NATIVE_BOUND_ULPS[r.exponent] !== undefined ? NATIVE_BOUND_ULPS[r.exponent].toFixed(3) : '—'}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', color: r.marginUlps < 1 ? 'var(--series-2)' : 'var(--series-3)' }}>
                {r.marginUlps < 1 ? 'no' : 'yes'}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> extended-precision measurement/
        cross-check only -- answers SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated by observing the
        deep-rung argmax jitter in double-double (106-bit) arithmetic that native double cannot resolve.
        The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
        the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is
        UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a &ge; 0 remains
        untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
