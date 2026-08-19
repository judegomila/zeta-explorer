import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT } from '../data/imp-35243-reentry-band-surrogate-fidelity-assessment.js';

// Baked literals imported verbatim from the imp-35243 data module; no new
// computation is performed here (viz/UX only).
const REQUIREMENTS = IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.fidelity_certificate_requirements;

function requirementColor(status) {
  if (/BINDING/.test(status)) return { fill: 'rgba(248,113,113,0.12)', stroke: '#f87171', text: '#f87171' };
  return { fill: 'rgba(250,204,21,0.10)', stroke: '#facc15', text: '#facc15' };
}

function CertificateDiagram() {
  const cardW = 210;
  const gap = 14;
  const svgW = REQUIREMENTS.length * cardW + (REQUIREMENTS.length - 1) * gap;
  const svgH = 200;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {REQUIREMENTS.map((r, i) => {
        const x = i * (cardW + gap);
        const c = requirementColor(r.status);
        const binding = /BINDING/.test(r.status);
        return (
          <g key={r.id} transform={`translate(${x}, 0)`}>
            <rect x={0} y={0} width={cardW} height={svgH} rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
            <text x={cardW / 2} y={24} textAnchor="middle" fill={c.text} fontSize={16} fontWeight={700} fontFamily="monospace">
              {r.id}
            </text>
            <text x={cardW / 2} y={46} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={700}>
              {r.name}
            </text>
            <foreignObject x={8} y={56} width={cardW - 16} height={96}>
              <div style={{ color: '#64748b', fontSize: '9.5px', lineHeight: 1.35 }}>{r.need}</div>
            </foreignObject>
            <rect x={8} y={svgH - 42} width={cardW - 16} height={30} rx={4} fill="rgba(15,23,42,0.5)" stroke={c.stroke} strokeWidth={1} />
            <text x={cardW / 2} y={svgH - 27} textAnchor="middle" fill={c.text} fontSize={10} fontWeight={700}>
              {binding ? 'BINDING' : 'OPEN'}
            </text>
            <text x={cardW / 2} y={svgH - 15} textAnchor="middle" fill="#64748b" fontSize={8}>
              {binding ? 'presently unreachable' : 'not binding'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp35314FidelityCertificateDiagramViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="Surrogate-Fidelity Certificate: R1-R4 Structural Diagram (imp-35314)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35243 enumerated four requirements (R1&ndash;R4) a proof that the imp-34997/imp-35111
        iters-to-floor REENTRY band is real in the true collapse dynamic &mdash; not merely an artifact
        of the analytic surrogate &mdash; would need to discharge. imp-35277 recorded the checklist as a
        glossary headword; this page renders it as a compact structural diagram, marking R1 and R4 as
        the two BINDING requirements (both presently unreachable) and R2/R3 as OPEN but not binding.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <CertificateDiagram />
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-only page reusing the imp-35243
        fidelity_certificate_requirements literals verbatim (no new computation). A certificate needs all
        four of R1&ndash;R4 discharged together; none are discharged here. The reentry band remains NOT
        established as a feature of the true collapse dynamic (imp-35243); changes no bound; establishes
        no operator positivity; no RH verdict, NO QED. Platt-Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains
        SOTA.
      </div>
    </div>
  );
}
