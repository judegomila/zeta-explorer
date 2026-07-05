import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST } from '../data/imp-33877-widening-fit-tail-endpoint-artifact-test.js';

const { base: BASE, ext115: EXT115, ext12: EXT12, endpointPeakSequence: PEAK_SEQ } =
  IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST;

// Three signed per-rung residual curves (BASE k<=11, EXT115 k<=11.5, EXT12 k<=12) on one axis --
// the largest positive residual sits at whichever rung is the CURRENT endpoint and its value grows
// as the fit window recedes (+0.2479 -> +0.3218 -> +0.3830), the imp-33877 endpoint-artifact signature.
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
    { rows: BASE.series, color: '#38bdf8', label: 'BASE k=6..11 (endpoint peak +0.2479)' },
    { rows: EXT115.series, color: '#a78bfa', label: 'EXT115 k=6..11.5 (endpoint peak +0.3218)' },
    { rows: EXT12.series, color: '#f472b6', label: 'EXT12 k=6..12 (endpoint peak +0.3830)' },
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
      {series.map((s) => {
        const last = s.rows[s.rows.length - 1];
        return (
          <circle
            key={`endpoint-${s.label}`}
            cx={xAt(last.k)}
            cy={yAt(last.resid)}
            r={4.5}
            fill={s.color}
            stroke="#0a0f1a"
            strokeWidth={1}
          />
        );
      })}
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
          {s.label}
        </text>
      ))}
    </svg>
  );
}

export default function Imp33915EndpointArtifactResidualMigrationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Endpoint-Artifact Residual Migration (imp-33877 / imp-33915)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33858 flagged the largest signed residual of the imp-33843 log-linear widening fit as a
        positive far-tail excursion at k=11 (+0.2479), the END rung of the imp-33810 ladder. imp-33877
        tested whether that excursion is a physical feature or a finite-ladder truncation artifact by
        extending the fit window to k=11.5 and k=12 and re-running the same OLS. The chart below plots
        the signed per-rung residual for all three fit windows on one axis: the largest positive
        residual does not stay at k=11 -- it migrates to whichever rung is the current endpoint, and its
        value GROWS as the boundary recedes ({PEAK_SEQ[0]} &rarr; {PEAK_SEQ[1]} &rarr; {PEAK_SEQ[2]}).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        signed residual vs k -- BASE / EXT115 / EXT12 fit windows (endpoint marked)
      </p>
      <ResidualMigrationChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/endpoint-artifact test
        only, no proof, no fresh derivation. {IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.finding.R2_largest_residual_migrates_to_and_grows_at_the_new_endpoint}{' '}
        The component model is the inherited imp-3220/imp-3406 extrapolation; the OLS surrogate is
        descriptive, not derived; C_mb GUE-conditional per imp-486 untouched; NO QED; Platt-Trudgian
        Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
