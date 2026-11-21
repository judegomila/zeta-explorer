import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  BIASN2_ROWS,
  CWIDOM_ASYMPTOTE,
  WELL_CONDITIONED_BAND,
  BEST_FIT_P0,
  IMP95868_VIZ_SUMMARY,
} from '../data/imp-95868-biasn2-widom-fit-viz-data.js';
import { ED } from '../styles/tokens.js';

// Log-N scatter of biasPct*N^2 with the C_Widom asymptote and fit-family band.
function BiasN2Chart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const logN = BIASN2_ROWS.map((r) => Math.log10(r.N));
  const minLogN = Math.min(...logN);
  const maxLogN = Math.max(...logN);
  const maxY = Math.max(...BIASN2_ROWS.map((r) => r.biasN2), CWIDOM_ASYMPTOTE) * 1.05;

  const xScale = (n) => padL + ((Math.log10(n) - minLogN) / (maxLogN - minLogN)) * plotW;
  const yScale = (y) => padT + plotH - (y / maxY) * plotH;

  const bandLo = yScale(WELL_CONDITIONED_BAND[0]);
  const bandHi = yScale(WELL_CONDITIONED_BAND[1]);
  const asymptoteY = yScale(CWIDOM_ASYMPTOTE);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* well-conditioned fit-family band */}
      <rect
        x={padL}
        y={bandHi}
        width={plotW}
        height={bandLo - bandHi}
        fill={ED.brassDeco}
        opacity={0.12}
      />
      {/* C_Widom asymptote */}
      <line
        x1={padL}
        y1={asymptoteY}
        x2={padL + plotW}
        y2={asymptoteY}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <text x={padL + plotW - 4} y={asymptoteY - 6} textAnchor="end" fill={ED.brass} fontSize={10}>
        C_Widom = {CWIDOM_ASYMPTOTE.toFixed(0)}
      </text>

      {/* axes */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {/* ladder points + connecting line */}
      <polyline
        points={BIASN2_ROWS.map((r) => `${xScale(r.N)},${yScale(r.biasN2)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.5}
      />
      {BIASN2_ROWS.map((r) => (
        <g key={r.N}>
          <circle cx={xScale(r.N)} cy={yScale(r.biasN2)} r={3.5} fill={ED.series1} />
          <text x={xScale(r.N)} y={svgH - padB + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.N}
          </text>
        </g>
      ))}

      <text x={16} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        biasPct * N^2
      </text>
      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N
      </text>
    </svg>
  );
}

export default function Imp95868BiasN2WidomFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="biasPct*N^2 Drift Converging to C_Widom (imp-95868 / imp-95845)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-95845 fit (no re-derivation, no new computation). Model seam
        family only. Changes no bound; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP95868_VIZ_SUMMARY.reading}
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        Measured ladder (delta = ln 1.2, rho = 1) vs the C_Widom asymptote and the
        well-conditioned fit-family band:
      </p>
      <BiasN2Chart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>biasPct*N^2</th>
          </tr>
        </thead>
        <tbody>
          {BIASN2_ROWS.map((r) => (
            <tr key={r.N} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.N}</td>
              <td style={{ textAlign: 'right' }}>{r.biasN2.toFixed(1)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 30%, transparent)' }}>
            <td style={{ padding: '3px 0', color: 'var(--brass)' }}>C_Widom (asymptote)</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{CWIDOM_ASYMPTOTE.toFixed(1)}</td>
          </tr>
          <tr>
            <td style={{ padding: '3px 0', color: 'var(--brass)' }}>best fit P0 (N&ge;200)</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{BEST_FIT_P0.toFixed(1)}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95868_VIZ_SUMMARY.verdict}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp95869-two-sided-envelope" style={{ color: 'var(--series-5)' }}>
          Two-Sided Finite-Section Spectral Envelope (imp-95869): the companion deep-corner
          seam result trapping lambda_min/lambda_max of the same sech-Gram Toeplitz family
        </Link>
        {' | '}
        <Link to="/concepts" style={{ color: 'var(--series-5)' }}>
          Sech-Gram Widom Leading Prefactor C_Widom (imp-95839): the closed-form evaluation
          this page&apos;s fit target P0 is checked against
        </Link>
      </div>
    </div>
  );
}
