import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING } from '../data/imp-34676-crossover-contraction-right-widening.js';

const DATA = IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING;
const TABLE = DATA.rightWideningTable;
const N_CROSS = DATA.structure.N_cross;
const L = DATA.invariants.L_at_left_endpoint;

const svgW = 640;
const svgH = 220;
const padL = 60;
const padR = 24;
const padT = 20;
const padB = 40;
const cW = svgW - padL - padR;
const cH = svgH - padT - padB;

const minLogB = Math.log10(TABLE[0].b) - 0.3;
const maxLogB = Math.log10(TABLE[TABLE.length - 1].b) + 0.3;
const xAt = (b) => padL + ((Math.log10(b) - minLogB) / (maxLogB - minLogB)) * cW;

function LInvarianceChart() {
  const minY = 0;
  const maxY = 1;
  const yAt = () => padT + cH - ((L - minY) / (maxY - minY)) * cH;
  const y = yAt();
  const contractionBoundaryY = padT + cH - ((1 - minY) / (maxY - minY)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={contractionBoundaryY} x2={padL + cW} y2={contractionBoundaryY} stroke="#f472b6" strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 4} y={contractionBoundaryY - 6} fill="#f472b6" fontSize={9.5}>
        L = 1 (contraction boundary)
      </text>
      <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke="#38bdf8" strokeWidth={1.5} />
      {TABLE.map((r) => (
        <circle key={r.b} cx={xAt(r.b)} cy={y} r={4} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      <text x={padL + 4} y={y - 8} fill="#94a3b8" fontSize={9.5}>
        L = g_prime(a) &asymp; {L} for every b
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        L
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        right endpoint b (log scale, 1e10 &hellip; 1e300)
      </text>
    </svg>
  );
}

function MarginGrowthChart() {
  const logVals = TABLE.map((r) => Math.log10(r.self_map_margin));
  const minY = Math.min(...logVals) - 1;
  const maxY = Math.max(...logVals) + 1;
  const yAt = (logv) => padT + cH - ((logv - minY) / (maxY - minY)) * cH;
  const linePoints = TABLE.map((r) => `${xAt(r.b)},${yAt(Math.log10(r.self_map_margin))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth={1.5} />
      {TABLE.map((r) => (
        <circle key={r.b} cx={xAt(r.b)} cy={yAt(Math.log10(r.self_map_margin))} r={4} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        log10 margin b &minus; g(b)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        right endpoint b (log scale) &mdash; margin grows linearly in b, unboundedly
      </text>
    </svg>
  );
}

function APrioriDegradeChart() {
  const logVals = TABLE.map((r) => Math.log10(r.a_priori_k5_rel_from_far_seed_b));
  const minY = Math.min(...logVals) - 1;
  const maxY = Math.max(...logVals) + 1;
  const yAt = (logv) => padT + cH - ((logv - minY) / (maxY - minY)) * cH;
  const zeroLineY = yAt(0);
  const linePoints = TABLE.map((r) => `${xAt(r.b)},${yAt(Math.log10(r.a_priori_k5_rel_from_far_seed_b))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={zeroLineY} x2={padL + cW} y2={zeroLineY} stroke="#f472b6" strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 4} y={zeroLineY - 6} fill="#f472b6" fontSize={9.5}>
        bound = 1 (a-priori certificate stops being useful)
      </text>
      <polyline points={linePoints} fill="none" stroke="#facc15" strokeWidth={1.5} />
      {TABLE.map((r) => (
        <circle key={r.b} cx={xAt(r.b)} cy={yAt(Math.log10(r.a_priori_k5_rel_from_far_seed_b))} r={4} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        log10 a-priori k=5 rel bound (seed b)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        right endpoint b (log scale) &mdash; bound from the far seed degrades linearly in b
      </text>
    </svg>
  );
}

export default function Imp34696RightWideningBanachCertificateViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Right-Widening the Banach Crossover Certificate (imp-34676)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34676 widened the imp-34650 Banach L-contraction certificate for the crossover map
        g(N) = K log T0(N) arbitrarily far to the RIGHT, holding the left endpoint a = 1e9 fixed.
        Sweeping the right endpoint b from 1e10 to 1e300 (imp-34676 literals reused verbatim): L is
        INVARIANT (the sup of g_prime is always attained at the fixed left endpoint), the self-map
        margin m(b) = b &minus; g(b) grows without bound, and the only honest cost is the a-priori
        Picard bound from the far seed N_0 = b, which degrades linearly in b.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        L = g_prime(a) is invariant as b widens (sup always at the fixed left endpoint a = 1e9)
      </p>
      <LInvarianceChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Self-map margin m(b) = b &minus; g(b), growing without bound as b widens
      </p>
      <MarginGrowthChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        A-priori Picard bound (k=5, relative) from the far seed N_0 = b, degrading as b widens
      </p>
      <APrioriDegradeChart />

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
        <strong style={{ color: '#94a3b8' }}>Finding:</strong> widening the certificate to the right
        is FREE for the contraction constant and the self-map (both hold for every swept b out to
        1e300, with margin growing unboundedly), but the a-priori bound from the far seed b is only
        useful (bound &lt; 1) when b is seeded near N_cross &asymp; {N_CROSS.toExponential(4)} &mdash;
        far endpoints stay valid self-maps but their a-priori certificate degrades, while the
        per-iterate Picard rate (fixed by L) is unaffected.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> visualization of an existing
        measurement, isRigorous false. Endpoint evaluations g(b), g_prime(a) are IEEE-754 double
        precision, not interval-arithmetic enclosures (imp-34676a sub-gap open: g(N) &lt; N above
        N_cross is sampled, not proved). Certifies a property of the inherited imp-3220/imp-3406
        surrogate crossover map; C_C 1/8 ansatz untouched; C_mb GUE-conditional per imp-486 untouched;
        changes no bound; no operator positivity; no RH verdict, NO QED. Platt-Trudgian
        Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
