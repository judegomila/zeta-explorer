import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { HIDDEN_SQUARE_PROGRAM_SECTION } from '../data/hidden-square-program-section.js';

/**
 * HiddenSquareProgramPage — renders §25 + §26 + §27 of the v52 paper as a
 * single chain of three reductions: commutator → measure domination →
 * endpoint-Hankel Volterra contraction. The actual computational program
 * underneath the no-ghost theorem.
 */
const S = HIDDEN_SQUARE_PROGRAM_SECTION;

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

function Conjecture({ id, color, children }) {
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
  // Vertical chain showing each reduction step.
  const steps = [
    { id: 'no-ghost',    label: 'No-ghost theorem', sub: 'K_a ⪰ 0 ∀ a > 0',                 color: '#dc2626' },
    { id: 'commutator',  label: 'Commutator (§25)', sub: 'K_a = K_a^diag + shear',         color: '#f59e0b' },
    { id: 'hidden-sq',   label: 'Hidden-square (Conj 25.2)', sub: 'K_a = ∫ Ψ Ψ̄ dν via Φ', color: '#a855f7' },
    { id: 'measure-dom', label: 'Measure dom (§26)', sub: 'µ_{a,Φ}^pass ≥ ν_{a,Φ}',         color: '#ec4899' },
    { id: 'block-pos',   label: 'Block positivity (§27)', sub: '‖V_{a,Φ}‖ ≤ 1 in L²',       color: '#10b981' },
    { id: 'compute',     label: 'Numerical certificate', sub: 'truncated V_{a,Φ,U} norm',   color: '#06b6d4' },
  ];

  return (
    <svg width="100%" viewBox="0 0 700 440" style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
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

export default function HiddenSquareProgramPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', letterSpacing: 1 }}>
          /hidden-square-program · paper {S.paperSections} · pp. {S.paperPageRange}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', margin: '8px 0 4px 0' }}>{S.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>{S.oneLine}</p>
      </header>

      {/* Synthesis diagram up top */}
      <Card accent="#7c3aed">
        <h3 style={{ color: '#a78bfa', fontSize: 18, margin: '0 0 12px 0' }}>The chain of reductions</h3>
        <ChainDiagram />
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
          Six lines collapse the no-ghost theorem of §17 to a single operator-norm bound on a
          Volterra-Hankel operator built from the completed Riemann kernel <InlineMath math="\Phi" />.
          Each arrow is a paper section; the bottom row is the concrete numerical test.
        </p>
      </Card>

      {/* §25 Commutator */}
      <Card>
        <h3 style={{ color: '#fbbf24', fontSize: 18, margin: '0 0 12px 0' }}>{S.commutator.sectionId} {S.commutator.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>Setup (in the centered variable <InlineMath math="w" />):</p>
        <BlockMath math="X(w) := \xi\!\left(\tfrac{1}{2} + w\right),\quad E_a(z) := X(a - iz),\quad E_a^{\#}(z) := X(-a - iz)" />
        <BlockMath math="K_a(w, z) = \frac{E_a(z)\,\overline{E_a(w)} - E_a^{\#}(z)\,\overline{E_a^{\#}(w)}}{2\pi i\,(\bar{w} - z)}" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          Using the completed-kernel representation <InlineMath math="X(w) = \int_0^\infty \Phi(u)\cosh(wu)\,du" />,
          decompose <InlineMath math="E_a(z) = A_a(z) - i B_a(z)" /> with
        </p>
        <BlockMath math="A_a(z) = \int_0^\infty \Phi(u)\cosh(au)\cos(zu)\,du,\quad B_a(z) = \int_0^\infty \Phi(u)\sinh(au)\sin(zu)\,du" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          The Wronskian form makes the diagonal-vs-shear split explicit:
        </p>
        <BlockMath math="K_a(w, z) = \frac{A_a(z) B_a(\bar w) - B_a(z) A_a(\bar w)}{\pi(\bar w - z)}" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          Expanding the channel integrals into the double integral <InlineMath math="\int_0^\infty\int_0^\infty \Phi(u)\Phi(v) C_a(w, z; u, v) du\,dv" /> exposes the off-diagonal commutator <InlineMath math="C_a(w, z; u, v)" /> as the exact obstruction.
          The <strong style={{ color: '#86efac' }}>diagonal passive channel</strong> (<InlineMath math="u = v" />) is positive by construction. The
          <strong style={{ color: '#fca5a5' }}> off-diagonal shear</strong> (<InlineMath math="u \ne v" />) is what must be absorbed.
        </p>

        <Conjecture id="Conj 25.2 — Off-diagonal absorption / hidden square" color="#a855f7">
          {S.commutator.keyConjecture25_2}
        </Conjecture>
        <Conjecture id="Conj 25.3 — Triangular commutator absorption" color="#a855f7">
          <BlockMath math="K_a = T_a^*\,K_a^{\rm diag}\,T_a + L_a^* L_a,\quad T_a\text{ Volterra/triangular, built from }\Phi" />
          {S.commutator.keyConjecture25_3}
        </Conjecture>

        <div style={{ marginTop: 14, padding: 10, background: 'rgba(15,23,42,0.5)', borderRadius: 6 }}>
          <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', marginBottom: 6 }}>§25.7 FINITE-WINDOW CERTIFICATE</div>
          <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Pick a test set <InlineMath math="Z = \{z_1, \dots, z_N\} \subset \mathbb{C}^+" /> and build
            <InlineMath math="G_a(Z) = (K_a(z_j, z_k))_{j,k}" />. With a frozen passive comparison <InlineMath math="G_{a,U}^{\rm pass}(Z) \succeq 0" />, a sufficient certificate is
            <InlineMath math="\lambda_{\min}(G_{a,U}^{\rm pass}(Z)) > \|G_a(Z) - G_{a,U}^{\rm pass}(Z)\|_2" />.
            This is the computational version of the hidden-square program.
          </p>
        </div>
      </Card>

      {/* §26 Measure Domination */}
      <Card>
        <h3 style={{ color: '#ec4899', fontSize: 18, margin: '0 0 12px 0' }}>{S.measureDomination.sectionId} {S.measureDomination.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          The diagonal channel admits a scalar Stieltjes representation. With <InlineMath math="P_{Z,c}(t) = \tfrac{1}{2}(|F_+|^2 + |F_-|^2)" />:
        </p>
        <BlockMath math="\langle c, K_a^{\rm diag}(Z)\,c\rangle = \int_0^\infty P_{Z,c}(\tau)\,d\mu_{a,\Phi}^{\rm diag}(\tau)" />
        <BlockMath math="\frac{d\mu_{a,\Phi}^{\rm diag}}{d\tau} = \frac{1}{2\pi}\int_\tau^\infty \Phi(u)^2 \sinh(2au)\,du" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          The 2D operator-positivity question is reduced to a <strong style={{ color: '#ec4899' }}>1D scalar measure domination</strong>.
        </p>

        <Conjecture id="Conj 26.3 — Scalar bridge-domination" color="#ec4899">
          {S.measureDomination.keyConjecture26_3}
          <div style={{ marginTop: 6 }}>
            <BlockMath math="\mu_{a,\Phi}^{\rm pass} \geq \nu_{a,\Phi}\quad\Rightarrow\quad K_a \succeq 0\ \forall a > 0" />
          </div>
        </Conjecture>

        <Conjecture id="Conj 26.4 — Volterra absorption" color="#ec4899">
          {S.measureDomination.keyConjecture26_4}
        </Conjecture>

        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>
          {S.measureDomination.verdict}
        </p>
      </Card>

      {/* §27 Endpoint-Hankel */}
      <Card accent="#10b981">
        <h3 style={{ color: '#86efac', fontSize: 18, margin: '0 0 12px 0' }}>{S.endpointHankel.sectionId} {S.endpointHankel.title}</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          The shear measure density is exact:
        </p>
        <BlockMath math="\int \varphi(\tau)\,d\nu_{a,\Phi}(\tau) = \frac{1}{2\pi}\!\int_{0 \le u \le v} \Phi(u)\Phi(v)\sinh(a(v - u)) \int_u^v \varphi(\tau)\,d\tau\,du\,dv" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          So <InlineMath math="\nu_{a,\Phi}" /> is the pushforward of <InlineMath math="\Phi(u)\Phi(v)\sinh(a(v-u))\mathbf{1}_{u \le \tau \le v}" />
          through intervals <InlineMath math="[u, v]" />. A <strong style={{ color: '#86efac' }}>Volterra-Hankel</strong> object: past endpoint <InlineMath math="[0, \tau]" />, future tail <InlineMath math="[\tau, \infty)" />.
        </p>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          {S.endpointHankel.whyRawDiagonalCannotDominate} The hidden-square problem is equivalent to a block positivity:
        </p>
        <BlockMath math="\begin{pmatrix} I & V_{a,\Phi} \\ V_{a,\Phi}^* & I \end{pmatrix} \succeq 0\quad\iff\quad \|V_{a,\Phi}\| \le 1" />

        <Conjecture id="Conj 27.2 — Endpoint-Hankel Volterra contraction" color="#10b981">
          {S.endpointHankel.keyConjecture27_2}
        </Conjecture>

        <div style={{ marginTop: 14, padding: 12, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 6 }}>
          <div style={{ color: '#86efac', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', marginBottom: 6 }}>CONCRETE TARGET</div>
          <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            {S.endpointHankel.finiteWindowDiagnostic}
          </p>
        </div>

        {/* §27 verdict: refuted-as-reduction / RH-equivalent surviving target */}
        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          <div style={{ padding: 12, background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.4)', borderLeft: '3px solid #dc2626', borderRadius: 6 }}>
            <div style={{ color: '#fca5a5', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', marginBottom: 6 }}>§27 VERDICT: REFUTED AS A REDUCTION</div>
            <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              The claimed biconditional <InlineMath math="\|V_{a,\Phi}\| \le 1 \iff K_a \succeq 0" /> is{' '}
              <strong style={{ color: '#fca5a5' }}>FALSE</strong> at the genuine Riemann <InlineMath math="\Phi" />:
              the two positivity conditions provably decouple and the bare biconditional cannot be revived
              by any scalar normalization. So <InlineMath math="\|V\| \le 1" /> is not the entire content of no-ghost = RH.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.4)', borderLeft: '3px solid #10b981', borderRadius: 6 }}>
            <div style={{ color: '#86efac', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', marginBottom: 6 }}>SURVIVING TARGET: RH-EQUIVALENT</div>
            <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              The degree-0 scale-invariant relative bound{' '}
              <InlineMath math="\|R\| \le 1 \iff K_a \succeq 0" /> for{' '}
              <InlineMath math="R = G_{\rm pass}^{-1/2} G_{\rm shear} G_{\rm pass}^{-1/2}" /> is
              RH-equivalent: a faithful, information-preserving restatement of <InlineMath math="K_a \succeq 0" />,
              not a reduction to something cheaper. Platt{'–'}Trudgian{' '}
              <InlineMath math="\Lambda \le 0.2" /> remains the rigorous SOTA.
            </p>
          </div>
        </div>
      </Card>

      {/* Implications */}
      <Card accent="#dc2626">
        <h3 style={{ color: '#fca5a5', fontSize: 18, margin: '0 0 12px 0' }}>Implications for the wider proof program</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(S.implicationsForRH).map(([k, v]) => (
            <div key={k} style={{ padding: 10, background: 'rgba(15,23,42,0.5)', borderRadius: 6 }}>
              <div style={{ color: '#fca5a5', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>{k}</div>
              <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>Related pages:</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/closure-routes" style={{ color: '#60a5fa', fontSize: 13 }}>/closure-routes (§16 four routes)</Link>
          <Link to="/blaschke-ghosts" style={{ color: '#60a5fa', fontSize: 13 }}>/blaschke-ghosts (§17 no-ghost)</Link>
          <Link to="/three-attacks" style={{ color: '#60a5fa', fontSize: 13 }}>/three-attacks (§18 attacks)</Link>
          <Link to="/freezing-bridge" style={{ color: '#60a5fa', fontSize: 13 }}>/freezing-bridge (§23 freezing)</Link>
          <Link to="/kyp-bounded-real" style={{ color: '#60a5fa', fontSize: 13 }}>/kyp-bounded-real (Apps M-O KYP)</Link>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono, monospace)' }}>
          Source: {S.paperSourcePath} {S.paperSections} (pp. {S.paperPageRange})
        </div>
      </footer>
    </main>
  );
}
