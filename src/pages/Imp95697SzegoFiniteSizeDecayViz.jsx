import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95697_ROWS,
  IMP95697_CROSSES_UNITY_NEAR_NPAIRS,
  IMP95697_CAVEAT_BANNER,
} from '../data/imp-95697-szego-finite-size-decay-viz-data.js';
import { IMP95767_DUAL_PRIMAL_AGREEMENT_INTERVAL } from '../data/imp-95767-dual-primal-agreement-interval.js';
import { IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE } from '../data/imp-95825-finite-section-positivity-certificate.js';
import { IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE } from '../data/imp-95823-rho1-szego-direct-dd-eigensolve.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP95697_ROWS;

// Semilog-x (log2 point count), linear-y chart of F/A_opt vs point count, with
// a unity reference line and a shaded float64 cancellation-noise band
// (lmin / (lmax*eps)) so the sub-1 undershoot at the largest section reads as
// numerical noise, not a physical dip below the symbol infimum.
function FiniteSizeDecayChart() {
  const svgW = 620;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  const xMin = ROWS[0].log2NPts;
  const xMax = ROWS[ROWS.length - 1].log2NPts;
  const xOf = (log2NPts) => padL + ((log2NPts - xMin) / (xMax - xMin)) * plotW;

  const yMax = 1.25;
  const yMin = 0.85;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25];

  const unityY = yOf(1.0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={`yt-${t}`}>
          <line
            x1={padL}
            x2={padL + plotW}
            y1={yOf(t)}
            y2={yOf(t)}
            stroke={ED.ruleSoft}
            strokeWidth={1}
          />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {ROWS.map((r) => (
        <text
          key={`xt-${r.nPts}`}
          x={xOf(r.log2NPts)}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          {r.nPts}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        point count nPts (log2 scale)
      </text>

      {/* float64 cancellation-noise band: lmin/(lmax*eps) per section, shaded
          around unity since that ratio is O(1) at every section */}
      {ROWS.map((r) => {
        const bandHalfWidth = Math.abs(r.lminOverFloor - 1) + 0.06;
        const x = xOf(r.log2NPts);
        return (
          <rect
            key={`band-${r.nPts}`}
            x={x - 14}
            y={yOf(1 + bandHalfWidth)}
            width={28}
            height={yOf(1 - bandHalfWidth) - yOf(1 + bandHalfWidth)}
            fill={ED.brassDeco}
            opacity={0.12}
          />
        );
      })}

      {/* unity reference line: the infinite-lattice value F / A_opt -> 1 */}
      <line
        x1={padL}
        x2={padL + plotW}
        y1={unityY}
        y2={unityY}
        stroke={ED.series1}
        strokeWidth={1.5}
        strokeDasharray="4,3"
      />
      <text x={padL + plotW - 4} y={unityY - 6} textAnchor="end" fill={ED.series1} fontSize={9}>
        infinite-lattice limit F/A_opt = 1
      </text>

      <polyline
        fill="none"
        stroke={ED.series5}
        strokeWidth={2}
        points={ROWS.map((r) => `${xOf(r.log2NPts)},${yOf(r.ratio)}`).join(' ')}
      />
      {ROWS.map((r) => (
        <circle key={`pt-${r.nPts}`} cx={xOf(r.log2NPts)} cy={yOf(r.ratio)} r={3.5} fill={ED.series5} />
      ))}
    </svg>
  );
}

export default function Imp95697SzegoFiniteSizeDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Rho=1 Finite-Size Szego Decay: F/A_opt vs Point Count (imp-95677 / imp-95697)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95677 measured the rho = 1 uniform-lattice ratio F&#47;A_opt = lambda_min
        &#47; symbol-infimum across growing section sizes. The ratio falls
        monotonically 1.143 -&gt; 1.101 -&gt; 1.010 -&gt; 0.909 as the point count
        doubles, crossing the infinite-lattice value 1 near nPairs = {IMP95697_CROSSES_UNITY_NEAR_NPAIRS}
        . The shaded band around each point marks the float64 cancellation-noise
        floor lmin&#47;(lmax&#42;eps) &#8776; O(1) at every section, so the apparent
        undershoot below 1 at the largest section is numerical noise, not a
        physical drop below the symbol infimum (a finite section of a positive
        Toeplitz operator cannot go below its symbol infimum).
      </p>

      <FiniteSizeDecayChart />

      <div
        style={{
          margin: '0.75rem 0 1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--brass-deco) 35%, transparent)',
          borderRadius: '4px',
          fontSize: '0.82rem',
          color: 'var(--brass)',
        }}
      >
        <strong>Not a real dip below the symbol infimum:</strong>{' '}
        <span style={{ color: 'var(--brass)' }}>{IMP95697_CAVEAT_BANNER}</span>{' '}
        <span style={{ color: 'var(--brass)' }}>
          Confirmed by the imp-95825 finite-section positivity certificate
          (lambda_min(G_n) &#8805; ess-inf f = A_opt for every section size, a
          standard Grenander-Szego bound) and the imp-95823 direct double-double
          eigensolve, which reproduces this same section in extended precision
          away from the float64 cancellation floor.
        </span>
      </div>

      <div
        style={{
          margin: '0 0 1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--series-1) 22%, transparent)',
          borderRadius: '4px',
          fontSize: '0.82rem',
          color: 'var(--ink)',
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>
          imp-95767 dual-vs-primal consistency interval (delta = ln 1.3):
        </strong>{' '}
        the single-run 1.68e-2% agreement between the DD primal extrapolation
        A_fit and the cancellation-free dual A_opt is certified as a signed
        interval (A_fit&#8722;A_opt)&#47;A_opt &#8712;{' '}
        <span style={{ fontFamily: 'monospace' }}>
          [{IMP95767_DUAL_PRIMAL_AGREEMENT_INTERVAL.rInterval.lo.toExponential(3)},{' '}
          {IMP95767_DUAL_PRIMAL_AGREEMENT_INTERVAL.rInterval.hi.toExponential(3)}]
        </span>
        , i.e. &#124;A_fit&#8722;A_opt&#124;&#47;A_opt &#8804;{' '}
        {(IMP95767_DUAL_PRIMAL_AGREEMENT_INTERVAL.absRMax * 100).toFixed(3)}%. The
        interval <strong>contains zero</strong> -- the two routes are certified
        consistent with exact agreement -- and its half-width is dominated by
        the primal finite-grid extrapolation uncertainty (u_fit&#47;u_opt
        &#126; 1.3e12), so the dual quadrature side contributes nothing.
        imp-95784 measured that the underlying finite-N grid approaches A_opt
        strictly from one side (above) and monotonically, so the remaining
        +1.68e-2% point gap is a one-signed finite-grid remnant: the drive
        tightens onto agreement as N grows, it does not separate the two
        routes. No dual-vs-primal separation is established or claimed.
        Cross-validation tightening only; changes no Lambda bound; NO QED.
      </div>

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>nPairs</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>nPts</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F / A_opt</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>lmin / (lmax&#42;eps)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.nPairs} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.nPairs}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.nPts}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.F.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.ratio.toFixed(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.lminOverFloor.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          margin: '1.5rem 0 0',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-5) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--series-5) 22%, transparent)',
          borderRadius: '4px',
          fontSize: '0.82rem',
          color: 'var(--ink)',
        }}
      >
        <strong style={{ color: 'var(--series-5)' }}>
          Same nPts, cancellation-free route (imp-95823 direct double-double
          eigensolve):
        </strong>{' '}
        recomputing F / A_opt at the same four section sizes in double-double
        precision removes the float64 cancellation floor entirely -- every
        ratio sits <em>strictly above</em> the imp-95825 certified floor{' '}
        {IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE.ratioLowerBound} and
        decays monotonically toward it, with no sub-1 undershoot at nPts = 640.
        <table
          style={{
            width: '100%',
            marginTop: '0.6rem',
            borderCollapse: 'collapse',
            fontSize: '0.78rem',
          }}
        >
          <thead>
            <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
              <th style={{ padding: '0.4rem 0.6rem' }}>nPts</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>float64 F / A_opt</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>direct-DD F / A_opt</th>
            </tr>
          </thead>
          <tbody>
            {IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE.table.map((ddRow) => {
              const float64Row = ROWS.find((r) => r.nPts === ddRow.nPts);
              return (
                <tr key={ddRow.nPts} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
                  <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ddRow.nPts}</td>
                  <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                    {float64Row ? float64Row.ratio.toFixed(6) : '--'}
                  </td>
                  <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-5)' }}>
                    {ddRow.ratio.toFixed(6)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
