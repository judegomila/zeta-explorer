import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT } from '../data/imp-35243-reentry-band-surrogate-fidelity-assessment.js';
import { ED, alpha } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35243 data module; no new
// computation is performed here (viz/UX only).
const REQUIREMENTS = IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.fidelity_certificate_requirements;

function requirementColor(status) {
  if (/BINDING/.test(status)) return { fill: alpha(ED.series2, 0.12), stroke: ED.series2, text: ED.series2 };
  return { fill: alpha(ED.series4, 0.1), stroke: ED.brassDeco, text: ED.brass };
}

function CertificateDiagram() {
  const cardW = 250;
  const gap = 16;
  const svgW = REQUIREMENTS.length * cardW + (REQUIREMENTS.length - 1) * gap;
  const svgH = 210;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }}>
      {REQUIREMENTS.map((r, i) => {
        const x = i * (cardW + gap);
        const c = requirementColor(r.status);
        const binding = /BINDING/.test(r.status);
        return (
          <g key={r.id} transform={`translate(${x}, 0)`}>
            <rect x={0} y={0} width={cardW} height={svgH} rx={8} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
            <text x={cardW / 2} y={26} textAnchor="middle" fill={c.text} fontSize={16} fontWeight={700} fontFamily="monospace">
              {r.id}
            </text>
            <text x={cardW / 2} y={46} textAnchor="middle" fill={ED.inkSoft} fontSize={11} fontWeight={700}>
              {r.name}
            </text>
            <foreignObject x={12} y={56} width={cardW - 24} height={100}>
              <div style={{ color: 'var(--ink-faint)', fontSize: '10.5px', lineHeight: 1.4 }}>{r.need}</div>
            </foreignObject>
            <rect x={12} y={svgH - 46} width={cardW - 24} height={32} rx={5} fill={alpha(ED.inkSoft, 0.04)} stroke={c.stroke} strokeWidth={1} />
            <text x={cardW / 2} y={svgH - 29} textAnchor="middle" fill={c.text} fontSize={10.5} fontWeight={700}>
              {binding ? 'BINDING' : 'OPEN'}
            </text>
            <text x={cardW / 2} y={svgH - 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {binding ? 'presently unreachable' : 'not binding'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RequirementsTable() {
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>req</th>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>name</th>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>what a certificate needs</th>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>status</th>
        </tr>
      </thead>
      <tbody>
        {REQUIREMENTS.map((r) => {
          const binding = /BINDING/.test(r.status);
          return (
            <tr key={r.id}>
              <td style={{ fontWeight: 700, color: binding ? 'var(--series-2)' : 'var(--brass)' }}>{r.id}</td>
              <td>{r.name}</td>
              <td style={{ fontFamily: 'inherit' }}>{r.need}</td>
              <td style={{ color: binding ? 'var(--series-2)' : 'var(--ink-soft)' }}>{r.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Imp35314FidelityCertificateDiagramViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="Surrogate-Fidelity Certificate: R1-R4 Structural Diagram (imp-35314)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        imp-35243 enumerated four requirements (R1&ndash;R4) a proof that the imp-34997/imp-35111
        iters-to-floor REENTRY band is real in the true collapse dynamic &mdash; not merely an artifact
        of the analytic surrogate &mdash; would need to discharge. imp-35277 recorded the checklist as a
        glossary headword; this page renders it as a compact structural diagram, marking R1 and R4 as
        the two BINDING requirements (both presently unreachable) and R2/R3 as OPEN but not binding.
      </p>

      <h2>Requirement diagram</h2>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Red cards are the binding requirements; amber cards are open but not binding. Text is quoted
        verbatim from the imp-35243 <code>fidelity_certificate_requirements</code> literals.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <CertificateDiagram />
      </div>

      <h2>Requirement checklist</h2>
      <RequirementsTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the imp-35243
        fidelity_certificate_requirements literals verbatim (no new computation). A certificate needs all
        four of R1&ndash;R4 discharged together; none are discharged here. The reentry band remains NOT
        established as a feature of the true collapse dynamic (imp-35243); changes no bound; establishes
        no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
