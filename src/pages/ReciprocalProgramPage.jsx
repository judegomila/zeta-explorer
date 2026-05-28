import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { RECIPROCAL_PROGRAM_SECTION } from '../data/reciprocal-program-section.js';

/**
 * ReciprocalProgramPage — renders Apps B–G of the v52 paper as the CORRECTED
 * proof target: after the naive direct PF-∞ kernel is proven impossible (B.2),
 * the right Schoenberg/Schur objects are all reciprocal. The chain ends at the
 * App G restricted passive second-order-cone certificate (the live target).
 */
const S = RECIPROCAL_PROGRAM_SECTION;

function Card({ children, accent = '#1e293b' }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      border: `1px solid ${accent}`,
      borderRadius: 10,
      padding: '20px 24px',
      margin: '16px 0',
    }}>{children}</div>
  );
}

function Claim({ id, color, children }) {
  return (
    <div style={{
      padding: 12,
      background: `${color}1a`,
      border: `1px solid ${color}66`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 6,
      marginTop: 10,
    }}>
      <div style={{ color, fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', marginBottom: 6, letterSpacing: 0.5 }}>
        {id}
      </div>
      <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ChainDiagram() {
  const steps = [
    { id: 'a-fail',     label: 'App A — direct kernel', sub: 'fails log-concavity audit',            color: '#64748b' },
    { id: 'b2-imposs',  label: 'App B.2 — direct PF-∞', sub: 'IMPOSSIBLE',                            color: '#dc2626' },
    { id: 'b3-recip',   label: 'App B.3 — reciprocal',  sub: 'correct Schoenberg object',             color: '#f59e0b' },
    { id: 'c-closure',  label: 'App C — Möbius ladders', sub: 'uniform mollifier closure',            color: '#eab308' },
    { id: 'd-nb',       label: 'App D — Nyman–Beurling', sub: 'Hilbert-space closure',                color: '#a855f7' },
    { id: 'e-schur',    label: 'App E — Schur lift',     sub: 'defect + non-circular margin',         color: '#ec4899' },
    { id: 'f-nfl',      label: 'App F — no-free-lunch',  sub: 'unrestricted lift IMPOSSIBLE',          color: '#dc2626' },
    { id: 'g-soc',      label: 'App G — restricted SOC', sub: 'exhaustion certificate (live target)',  color: '#10b981' },
  ];

  return (
    <svg width="100%" viewBox="0 0 700 560" style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
      {steps.map((step, i) => {
        const y = 40 + i * 65;
        return (
          <g key={step.id}>
            <rect x="100" y={y - 22} width="500" height="44" rx="6" fill={step.color} fillOpacity="0.15" stroke={step.color} strokeWidth="1.5" />
            <text x="350" y={y - 4} fill={step.color} textAnchor="middle" fontSize="14" fontWeight="700">{step.label}</text>
            <text x="350" y={y + 14} fill="#cbd5e1" textAnchor="middle" fontSize="11" fontFamily="monospace">{step.sub}</text>
            {i < steps.length - 1 && (
              <g>
                <line x1="350" y1={y + 22} x2="350" y2={y + 43} stroke="#475569" strokeWidth="1.5" />
                <polygon points={`345,${y + 38} 350,${y + 45} 355,${y + 38}`} fill="#475569" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function ReciprocalProgramPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', letterSpacing: 1 }}>
          /reciprocal-program · paper {S.paperSections} · pp. {S.paperPageRange}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', margin: '8px 0 4px 0' }}>{S.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>{S.oneLine}</p>
      </header>

      {/* Synthesis diagram up top */}
      <Card accent="#7c3aed">
        <h3 style={{ color: '#a78bfa', fontSize: 18, margin: '0 0 12px 0' }}>The corrected target chain</h3>
        <ChainDiagram />
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
          The same shape appears <strong style={{ color: '#fca5a5' }}>twice</strong>: a naive target is
          proven impossible and replaced by a restricted reciprocal object. First the direct
          PF-<InlineMath math="\infty" /> kernel dies (B.2); then the <em>unrestricted</em> Schur lift dies
          (F, no-free-lunch). What survives is the App G restricted passive second-order-cone certificate.
        </p>
      </Card>

      {/* App B */}
      <Card accent="#f59e0b">
        <h3 style={{ color: '#fbbf24', fontSize: 18, margin: '0 0 12px 0' }}>{S.reciprocalTotalPositivity.sectionId} — {S.reciprocalTotalPositivity.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalTotalPositivity.whyDirectFails}</p>
        <BlockMath math="\text{PF}_\infty\text{ kernel} \;\Longleftrightarrow\; \frac{1}{g(s)} = e^{a s^2 + b s}\prod_k (1 + \delta_k s)\,e^{-\delta_k s},\quad \delta_k > 0" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalTotalPositivity.correctReciprocalObject}</p>
        <Claim id="Claim B.2 — direct PF-∞ impossibility" color="#dc2626">{S.reciprocalTotalPositivity.keyClaimB2}</Claim>
        <Claim id="Claim B.3 — reciprocal Schoenberg object" color="#f59e0b">{S.reciprocalTotalPositivity.keyClaimB3}</Claim>
        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalTotalPositivity.verdict}</p>
      </Card>

      {/* App C */}
      <Card accent="#eab308">
        <h3 style={{ color: '#facc15', fontSize: 18, margin: '0 0 12px 0' }}>{S.reciprocalMobiusLadders.sectionId} — {S.reciprocalMobiusLadders.title}</h3>
        <BlockMath math="\frac{1}{\zeta(s)} = \sum_{n\ge 1} \frac{\mu(n)}{n^{s}},\qquad M_X(s) = \sum_{n \le X} \frac{\mu(n)}{n^{s}}" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMobiusLadders.mobiusBridge}</p>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMobiusLadders.safeRegionTails}</p>
        <Claim id="Claim C — uniform mollifier closure" color="#eab308">{S.reciprocalMobiusLadders.keyClaimC}</Claim>
        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalMobiusLadders.verdict}</p>
      </Card>

      {/* App D */}
      <Card accent="#a855f7">
        <h3 style={{ color: '#c084fc', fontSize: 18, margin: '0 0 12px 0' }}>{S.reciprocalMollifierNymanBeurling.sectionId} — {S.reciprocalMollifierNymanBeurling.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMollifierNymanBeurling.exactFiniteDefect}</p>
        <BlockMath math="d_X^2 = \inf_{c_1,\dots,c_X} \left\| \mathbf{1}_{(0,1)} - \sum_{n \le X} c_n\,\rho\!\left(\tfrac{\theta}{n}\right) \right\|_{L^2}^2,\qquad \text{RH} \iff d_X \to 0" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMollifierNymanBeurling.nymanBeurlingFit}</p>
        <Claim id="Claim D — Nyman–Beurling Hilbert closure" color="#a855f7">{S.reciprocalMollifierNymanBeurling.keyClaimD}</Claim>
        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalMollifierNymanBeurling.verdict}</p>
      </Card>

      {/* App E */}
      <Card accent="#ec4899">
        <h3 style={{ color: '#f472b6', fontSize: 18, margin: '0 0 12px 0' }}>{S.reciprocalSchurLifts.sectionId} — {S.reciprocalSchurLifts.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalSchurLifts.reciprocalModelDefect}</p>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalSchurLifts.nonCircularResidualMargin}</p>
        <BlockMath math="\|R\|_{\mathcal{S}} = \mathrm{dist}\big(\text{recip. object},\ \mathcal{S}\big) + \underbrace{m_{\mathrm{nc}}}_{\text{non-circular margin}},\qquad m_{\mathrm{nc}} \ge 0 \Rightarrow \text{no-ghost}" />
        <Claim id="Claim E — two-step no-ghost certificate" color="#ec4899">{S.reciprocalSchurLifts.keyClaimE}</Claim>
        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalSchurLifts.verdict}</p>
      </Card>

      {/* App F */}
      <Card accent="#dc2626">
        <h3 style={{ color: '#fca5a5', fontSize: 18, margin: '0 0 12px 0' }}>{S.hardyCoronaExtremals.sectionId} — {S.hardyCoronaExtremals.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.hardyCoronaExtremals.extremalGeometry}</p>
        <Claim id="Claim F — no-free-lunch (unrestricted lift impossible)" color="#dc2626">{S.hardyCoronaExtremals.noFreeLunchTheorem}</Claim>
        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.hardyCoronaExtremals.verdict}</p>
      </Card>

      {/* App G */}
      <Card accent="#10b981">
        <h3 style={{ color: '#86efac', fontSize: 18, margin: '0 0 12px 0' }}>{S.restrictedPassiveLifts.sectionId} — {S.restrictedPassiveLifts.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.restrictedPassiveLifts.secondOrderConeCertificate}</p>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.restrictedPassiveLifts.constrainedExtremalNumber}</p>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{S.restrictedPassiveLifts.dualObstruction}</p>
        <Claim id="Claim G — restricted-lift exhaustion certificate" color="#10b981">{S.restrictedPassiveLifts.keyClaimG}</Claim>
        <div style={{ marginTop: 14, padding: 12, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 6 }}>
          <div style={{ color: '#86efac', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', marginBottom: 6 }}>LIVE TARGET</div>
          <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{S.restrictedPassiveLifts.verdict}</p>
        </div>
      </Card>

      {/* Implications */}
      <Card accent="#7c3aed">
        <h3 style={{ color: '#a78bfa', fontSize: 18, margin: '0 0 12px 0' }}>Implications for the wider proof program</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(S.implicationsForRH).map(([k, v]) => (
            <div key={k} style={{ padding: 10, background: 'rgba(15,23,42,0.5)', borderRadius: 6 }}>
              <div style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>{k}</div>
              <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>Related pages:</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/hidden-square-program" style={{ color: '#60a5fa', fontSize: 13 }}>/hidden-square-program (§25–27)</Link>
          <Link to="/closure-routes" style={{ color: '#60a5fa', fontSize: 13 }}>/closure-routes (§16 four routes)</Link>
          <Link to="/kyp-bounded-real" style={{ color: '#60a5fa', fontSize: 13 }}>/kyp-bounded-real (Apps M–O)</Link>
          <Link to="/twin-ladder-paper-roadmap" style={{ color: '#60a5fa', fontSize: 13 }}>/twin-ladder-paper-roadmap</Link>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono, monospace)' }}>
          Source: {S.paperSourcePath} {S.paperSections} (pp. {S.paperPageRange})
        </div>
      </footer>
    </main>
  );
}
