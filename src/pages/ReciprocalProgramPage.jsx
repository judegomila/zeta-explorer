import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { RECIPROCAL_PROGRAM_SECTION } from '../data/reciprocal-program-section.js';
import DownstreamVerdictCallout from '../components/DownstreamVerdictCallout.jsx';
import { ED } from '../styles/tokens.js';

/**
 * ReciprocalProgramPage — renders the audited Apps B–G record. The corrected
 * Schoenberg variable is 1/X(is), while finite Möbius, Schur-lift, and SOC
 * computations are compact diagnostics rather than a global proof target.
 * Editorial (warm) re-theme: full-width shell, identical structure/data.
 */
const S = RECIPROCAL_PROGRAM_SECTION;

function Card({ children, accent = 'var(--hairline)' }) {
  return (
    <div className="card" style={{
      background: 'var(--paper2)',
      border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 8,
      padding: '18px 22px',
      margin: '16px 0',
    }}>{children}</div>
  );
}

function Claim({ id, color, children }) {
  return (
    <div style={{
      padding: 12,
      background: 'var(--paper)',
      border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${color}`,
      borderRadius: 6,
      marginTop: 10,
    }}>
      <div style={{ color, fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6, letterSpacing: 0.5 }}>
        {id}
      </div>
      <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ChainDiagram() {
  const steps = [
    { id: 'a-fail',     label: 'Kernel audit',          sub: 'negative PF₅ minor; no PF-∞ route',     color: 'var(--faint)' },
    { id: 'b2-imposs',  label: 'App B.2 — direct PF-∞', sub: 'IMPOSSIBLE',                            color: 'var(--terra-dk)' },
    { id: 'b3-recip',   label: 'App B.3 — reciprocal',  sub: 'rotation: 1/X(is), not 1/X(s)',         color: 'var(--brass-dk)' },
    { id: 'c-closure',  label: 'App C — Möbius ladders', sub: 'global closure claim RETRACTED',        color: 'var(--brass)' },
    { id: 'd-nb',       label: 'App D — Nyman–Beurling', sub: 'RH-equivalent Hilbert criterion',       color: 'var(--blue)' },
    { id: 'e-schur',    label: 'App E — Schur lift',     sub: 'conditional local template',            color: 'var(--terra)' },
    { id: 'f-nfl',      label: 'App F — no-free-lunch',  sub: 'unrestricted fitting gives no shortcut', color: 'var(--terra-dk)' },
    { id: 'g-soc',      label: 'App G — restricted SOC', sub: 'COMPACT DIAGNOSTICS ONLY',              color: 'var(--green)' },
  ];

  return (
    <svg width="100%" viewBox="0 0 700 560" style={{ background: 'var(--paper)', borderRadius: 8 }}>
      {steps.map((step, i) => {
        const y = 40 + i * 65;
        return (
          <g key={step.id}>
            <rect x="100" y={y - 22} width="500" height="44" rx="6" fill={step.color} fillOpacity="0.14" stroke={step.color} strokeWidth="1.5" />
            <text x="350" y={y - 4} fill={step.color} textAnchor="middle" fontSize="14" fontWeight="700">{step.label}</text>
            <text x="350" y={y + 14} fill={ED.inkSoft} textAnchor="middle" fontSize="11" fontFamily="monospace">{step.sub}</text>
            {i < steps.length - 1 && (
              <g>
                <line x1="350" y1={y + 22} x2="350" y2={y + 43} stroke={ED.rule} strokeWidth="1.5" />
                <polygon points={`345,${y + 38} 350,${y + 45} 355,${y + 38}`} fill="#877b67" />
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{
          fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
        }}>
          /reciprocal-program · paper {S.paperSections} · pp. {S.paperPageRange}
        </div>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>{S.title}</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: '8px 0 20px 0', lineHeight: 1.6, maxWidth: 760 }}>
          {S.oneLine}
        </p>

        <DownstreamVerdictCallout />

        {/* Synthesis diagram up top */}
        <Card accent={ED.brass}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>The corrected target chain</h2>
          <ChainDiagram />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
            The direct PF-<InlineMath math="\infty" /> route is excluded, and the
            reciprocal variable must be rotated to <InlineMath math="1/X(is)" />.
            The finite restricted programs that survive the local no-go tests are
            useful experiments, but universal exhaustion remains RH-equivalent.
            They are not a replacement for the exact global Twin Ladder residual.
          </p>
        </Card>

        {/* App B */}
        <Card accent={ED.brassDeco}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>{S.reciprocalTotalPositivity.sectionId} — {S.reciprocalTotalPositivity.title}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalTotalPositivity.whyDirectFails}</p>
          <BlockMath math="\text{PF}_\infty\text{ kernel} \;\Longleftrightarrow\; \frac{1}{g(s)} = e^{a s^2 + b s}\prod_k (1 + \delta_k s)\,e^{-\delta_k s},\quad \delta_k > 0" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalTotalPositivity.correctReciprocalObject}</p>
          <Claim id="Claim B.2 — direct PF-∞ impossibility" color={ED.accent}>{S.reciprocalTotalPositivity.keyClaimB2}</Claim>
          <Claim id="Claim B.3 — reciprocal Schoenberg object" color={ED.brass}>{S.reciprocalTotalPositivity.keyClaimB3}</Claim>
          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalTotalPositivity.verdict}</p>
        </Card>

        {/* App C */}
        <Card accent={ED.brass}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>{S.reciprocalMobiusLadders.sectionId} — {S.reciprocalMobiusLadders.title}</h2>
          <BlockMath math="\frac{1}{\zeta(s)} = \sum_{n\ge 1} \frac{\mu(n)}{n^{s}},\qquad M_X(s) = \sum_{n \le X} \frac{\mu(n)}{n^{s}}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMobiusLadders.mobiusBridge}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMobiusLadders.safeRegionTails}</p>
          <Claim id="Claim C — global closure retracted" color={ED.brass}>{S.reciprocalMobiusLadders.keyClaimC}</Claim>
          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalMobiusLadders.verdict}</p>
        </Card>

        {/* App D */}
        <Card accent={ED.series1}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>{S.reciprocalMollifierNymanBeurling.sectionId} — {S.reciprocalMollifierNymanBeurling.title}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMollifierNymanBeurling.exactFiniteDefect}</p>
          <BlockMath math="d_X^2 = \inf_{c_1,\dots,c_X} \left\| \mathbf{1}_{(0,1]}(x) - \sum_{n \le X} c_n\,\rho\!\left(\tfrac{1}{nx}\right) \right\|_{L^2(0,\infty)}^2,\qquad \text{RH} \iff d_X \to 0" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalMollifierNymanBeurling.nymanBeurlingFit}</p>
          <Claim id="Claim D — Nyman–Beurling Hilbert closure" color={ED.series1}>{S.reciprocalMollifierNymanBeurling.keyClaimD}</Claim>
          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalMollifierNymanBeurling.verdict}</p>
        </Card>

        {/* App E */}
        <Card accent={ED.accentDeco}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>{S.reciprocalSchurLifts.sectionId} — {S.reciprocalSchurLifts.title}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalSchurLifts.reciprocalModelDefect}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.reciprocalSchurLifts.nonCircularResidualMargin}</p>
          <BlockMath math="\|R\|_{\mathcal{S}} = \mathrm{dist}\big(\text{recip. object},\ \mathcal{S}\big) + \underbrace{m_{\mathrm{nc}}}_{\text{non-circular margin}},\qquad m_{\mathrm{nc}} \ge 0 \Rightarrow \text{no-ghost}" />
          <Claim id="Claim E — two-step no-ghost certificate" color={ED.accentDeco}>{S.reciprocalSchurLifts.keyClaimE}</Claim>
          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.reciprocalSchurLifts.verdict}</p>
        </Card>

        {/* App F */}
        <Card accent={ED.series2}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>{S.hardyCoronaExtremals.sectionId} — {S.hardyCoronaExtremals.title}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.hardyCoronaExtremals.extremalGeometry}</p>
          <Claim id="Claim F — no-free-lunch (unrestricted lift impossible)" color={ED.accent}>{S.hardyCoronaExtremals.noFreeLunchTheorem}</Claim>
          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>{S.hardyCoronaExtremals.verdict}</p>
        </Card>

        {/* App G */}
        <Card accent={ED.series3}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>{S.restrictedPassiveLifts.sectionId} — {S.restrictedPassiveLifts.title}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.restrictedPassiveLifts.secondOrderConeCertificate}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.restrictedPassiveLifts.constrainedExtremalNumber}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{S.restrictedPassiveLifts.dualObstruction}</p>
          <Claim id="Claim G — finite restricted-lift diagnostic" color={ED.series3}>{S.restrictedPassiveLifts.keyClaimG}</Claim>
          <div style={{ marginTop: 14, padding: 12, background: 'var(--paper)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--green)', borderRadius: 6 }}>
            <div style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>COMPACT DIAGNOSTIC</div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{S.restrictedPassiveLifts.verdict}</p>
          </div>
        </Card>

        {/* Implications */}
        <Card accent={ED.brass}>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 12 }}>Implications for the wider proof program</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(S.implicationsForRH).map(([k, v]) => (
              <div key={k} style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
                <div style={{ color: 'var(--brass)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{k}</div>
                <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Related pages:</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/hidden-square-program" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/hidden-square-program (§25–27)</Link>
            <Link to="/closure-routes" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/closure-routes (§16 four routes)</Link>
            <Link to="/kyp-bounded-real" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/kyp-bounded-real (Apps M–O)</Link>
            <Link to="/twin-ladder-paper-roadmap" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>/twin-ladder-paper-roadmap</Link>
            <Link to="/" style={{ color: 'var(--brass)', fontSize: 13 }}>← the atlas</Link>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Source: {S.paperSourcePath} {S.paperSections} (pp. {S.paperPageRange})
          </div>
        </footer>
      </div>
    </div>
  );
}
