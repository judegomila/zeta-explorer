import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST } from '../data/imp-33877-widening-fit-tail-endpoint-artifact-test.js';
import { IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY } from '../data/imp-34022-argmin-argmax-migration-symmetry.js';

const { base: BASE, ext115: EXT115, ext12: EXT12 } = IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST;
const { argmaxSequence: PEAK_SEQ, argminSequence: TROUGH_SEQ, magnitudeMigration } = IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY;

// Same three signed per-rung residual curves as imp-33915, but here both the endpoint-locked positive
// peak AND the interior negative trough are marked, so the imp-34022 rate asymmetry (peak +0.50/step vs
// trough +0.25/step) is visible directly on the curve rather than only in the argmax/argmin table.
function ResidualMigrationChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const series = [
    { rows: BASE.series, color: '#38bdf8', label: 'BASE k=6..11', peak: PEAK_SEQ[0], trough: TROUGH_SEQ[0] },
    { rows: EXT115.series, color: '#a78bfa', label: 'EXT115 k=6..11.5', peak: PEAK_SEQ[1], trough: TROUGH_SEQ[1] },
    { rows: EXT12.series, color: '#f472b6', label: 'EXT12 k=6..12', peak: PEAK_SEQ[2], trough: TROUGH_SEQ[2] },
  ];

  const allXs = series.flatMap((s) => s.rows.map((r) => r.k));
  const allYs = series.flatMap((s) => s.rows.map((r) => r.resid));
  const minX = Math.min(...allXs);
  const maxX = Math.max(...allXs);
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);
  const padY = (maxY - minY) * 0.08;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY - padY) / (maxY - minY + 2 * padY)) * cH;
  const yZero = yAt(0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />
      {series.map((s) => (
        <polyline
          key={s.label}
          points={s.rows.map((r) => `${xAt(r.k)},${yAt(r.resid)}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={1.75}
        />
      ))}
      {series.map((s) => (
        <circle
          key={`peak-${s.label}`}
          cx={xAt(s.peak.k)}
          cy={yAt(s.peak.resid)}
          r={4.5}
          fill={s.color}
          stroke="#0a0f1a"
          strokeWidth={1}
        />
      ))}
      {series.map((s) => (
        <circle
          key={`trough-${s.label}`}
          cx={xAt(s.trough.k)}
          cy={yAt(s.trough.resid)}
          r={4.5}
          fill="#0a0f1a"
          stroke={s.color}
          strokeWidth={2}
        />
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        k (quarter-decade rung)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        signed residual e_k = y_k - (a + b k)
      </text>
      {series.map((s, i) => (
        <text key={`legend-${s.label}`} x={padL + 4} y={padT + 12 + i * 14} fill={s.color} fontSize={9.5}>
          {s.label} (filled = peak, ringed = trough)
        </text>
      ))}
    </svg>
  );
}

// Secondary readout: |trough|/|peak| ratio per window -- near-constant relative amplification even
// though the peak migrates 2x faster in location and ~1.3-1.5x faster in absolute magnitude.
function RatioStrip() {
  const ratios = magnitudeMigration.troughOverPeakRatio;
  const w = 520;
  const h = 70;
  const padL = 90;
  const padR = 16;
  const cW = w - padL - padR;
  const minR = 0.55;
  const maxR = 0.7;
  const xAt = (r) => padL + ((r - minR) / (maxR - minR)) * cW;

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={h / 2} x2={padL + cW} y2={h / 2} stroke="#334155" strokeWidth={1} />
      {ratios.map((r, i) => (
        <g key={r.window}>
          <circle cx={xAt(r.ratio)} cy={h / 2} r={5} fill={['#38bdf8', '#a78bfa', '#f472b6'][i]} />
          <text x={xAt(r.ratio)} y={h / 2 - 10} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
            {r.ratio}
          </text>
          <text x={0} y={h - 4} fill="#64748b" fontSize={9} textAnchor="start" style={{ display: i === 0 ? 'block' : 'none' }}>
            |trough|/|peak|
          </text>
        </g>
      ))}
      <text x={padL} y={h - 4} fill="#64748b" fontSize={9}>
        {minR.toFixed(2)}
      </text>
      <text x={padL + cW} y={h - 4} fill="#64748b" fontSize={9} textAnchor="end">
        {maxR.toFixed(2)}
      </text>
    </svg>
  );
}

export default function Imp34098EndpointTroughMigrationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Endpoint Peak / Interior Trough Migration Contrast (imp-34022 / imp-34098)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33877 showed the imp-33843 log-linear fit's largest positive residual migrates to and grows
        at the receding endpoint ({PEAK_SEQ[0].resid} &rarr; {PEAK_SEQ[1].resid} &rarr; {PEAK_SEQ[2].resid})
        across the BASE (k=6..11), EXT115 (k=6..11.5) and EXT12 (k=6..12) fit windows. imp-34022 measured
        the negative trough alongside it ({TROUGH_SEQ[0].resid} &rarr; {TROUGH_SEQ[1].resid} &rarr;{' '}
        {TROUGH_SEQ[2].resid}) and found the two migrations are co-directional but NOT symmetric: the peak
        sits on the endpoint and moves +0.50 per window-step, while the trough trails inside and moves
        only +0.25 per step -- a 2.0x location-rate gap.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        signed residual vs k -- filled marker = endpoint-locked peak, ringed marker = interior trough
      </p>
      <ResidualMigrationChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        secondary readout: |trough|/|peak| ratio per window (near-constant despite the rate asymmetry)
      </p>
      <RatioStrip />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/migration-contrast only,
        no proof, no fresh derivation -- reuses the imp-33877 base/ext115/ext12 fits verbatim.{' '}
        {IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.finding.R2_asymmetric_absolute_magnitude_near_symmetric_relative_amplification}{' '}
        The component model is the inherited imp-3220/imp-3406 extrapolation; the OLS surrogate is
        descriptive, not derived; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&gt;=0 untouched;
        NO QED; Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
