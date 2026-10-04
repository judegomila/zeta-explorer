import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { HIDDEN_SQUARE_PROGRAM_SECTION } from '../data/hidden-square-program-section.js';
import { ED } from '../styles/tokens.js';

/**
 * HiddenSquareProgramPage — renders §25 + §26 + §27 of the v52 paper as a
 * single chain of three reductions: commutator → measure domination →
 * endpoint-Hankel Volterra contraction. The actual computational program
 * underneath the no-ghost theorem.
 *
 * Editorial (warm) re-theme: full-width shell, identical structure/data.
 */
const S = HIDDEN_SQUARE_PROGRAM_SECTION;

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(accent) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${accent}`,
    borderRadius: 10,
    padding: '20px 24px',
    margin: '16px 0',
  };
}

function Card({ children, accent = 'var(--hairline)' }) {
  return <div className="card" style={cardBaseLeft(accent)}>{children}</div>;
}

// Named warm rgb triples (mirror the CSS custom properties) so conjecture/step
// boxes can build soft translucent fills the same way the chip helpers do
// elsewhere in the editorial theme.
const RGB = {
  terraDk: '194,58,28',
  brassDk: '181,138,46',
  blue: '63,107,134',
  terra: '217,80,46',
  green: '76,122,74',
  brass: '140,106,29',
};

function Conjecture({ id, tone, children }) {
  const rgb = RGB[tone] || RGB.brass;
  const colorVar = `var(--${tone === 'terraDk' ? 'terra-dk' : tone === 'brassDk' ? 'brass-dk' : tone})`;
  return (
    <div style={{
      padding: 12,
      background: `rgba(${rgb},0.10)`,
      border: `1px solid rgba(${rgb},0.40)`,
      borderLeft: `3px solid ${colorVar}`,
      borderRadius: 6,
      marginTop: 10,
    }}>
      <div style={{ color: colorVar, fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6, letterSpacing: 0.5 }}>
        {id}
      </div>
      <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ChainDiagram() {
  // Vertical chain showing each reduction step.
  const steps = [
    { id: 'no-ghost',    label: 'No-ghost theorem', sub: 'K_a ⪰ 0 ∀ a > 0',                 color: 'var(--terra-dk)' },
    { id: 'commutator',  label: 'Commutator (§25)', sub: 'K_a = K_a^diag + shear',         color: 'var(--brass-dk)' },
    { id: 'hidden-sq',   label: 'Hidden-square (Conj 25.2)', sub: 'K_a = ∫ Ψ Ψ̄ dν via Φ', color: 'var(--blue)' },
    { id: 'measure-dom', label: 'Measure dom (§26)', sub: 'µ_{a,Φ}^pass ≥ ν_{a,Φ}',         color: 'var(--terra)' },
    { id: 'block-pos',   label: 'Block positivity (§27)', sub: '‖V_{a,Φ}‖ ≤ 1 in L²',       color: 'var(--green)' },
    { id: 'compute',     label: 'Numerical certificate', sub: 'truncated V_{a,Φ,U} norm',   color: 'var(--brass)' },
  ];

  return (
    <svg width="100%" viewBox="0 0 700 440" style={{ background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8 }}>
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

export default function HiddenSquareProgramPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', textTransform: 'uppercase', letterSpacing: 1 }}>
            /hidden-square-program · paper {S.paperSections} · pp. {S.paperPageRange}
          </div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>{S.title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6, maxWidth: 760 }}>{S.oneLine}</p>
        </header>

        {/* Synthesis diagram up top */}
        <Card accent={ED.series1}>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>The chain of reductions</h3>
          <ChainDiagram />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
            Six lines collapse the no-ghost theorem of §17 to a single operator-norm bound on a
            Volterra-Hankel operator built from the completed Riemann kernel <InlineMath math="\Phi" />.
            Each arrow is a paper section; the bottom row is the concrete numerical test.
          </p>
        </Card>

        {/* §25 Commutator */}
        <Card>
          <h3 style={{ color: 'var(--brass-dk)', fontSize: 18, margin: '0 0 12px 0' }}>{S.commutator.sectionId} {S.commutator.title}</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>Setup (in the centered variable <InlineMath math="w" />):</p>
          <BlockMath math="X(w) := \xi\!\left(\tfrac{1}{2} + w\right),\quad E_a(z) := X(a - iz),\quad E_a^{\#}(z) := X(-a - iz)" />
          <BlockMath math="K_a(w, z) = \frac{E_a(z)\,\overline{E_a(w)} - E_a^{\#}(z)\,\overline{E_a^{\#}(w)}}{2\pi i\,(\bar{w} - z)}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            Using the completed-kernel representation <InlineMath math="X(w) = \int_0^\infty \Phi(u)\cosh(wu)\,du" />,
            decompose <InlineMath math="E_a(z) = A_a(z) - i B_a(z)" /> with
          </p>
          <BlockMath math="A_a(z) = \int_0^\infty \Phi(u)\cosh(au)\cos(zu)\,du,\quad B_a(z) = \int_0^\infty \Phi(u)\sinh(au)\sin(zu)\,du" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The Wronskian form makes the diagonal-vs-shear split explicit:
          </p>
          <BlockMath math="K_a(w, z) = \frac{A_a(z) B_a(\bar w) - B_a(z) A_a(\bar w)}{\pi(\bar w - z)}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            Expanding the channel integrals into the double integral <InlineMath math="\int_0^\infty\int_0^\infty \Phi(u)\Phi(v) C_a(w, z; u, v) du\,dv" /> exposes the off-diagonal commutator <InlineMath math="C_a(w, z; u, v)" /> as the exact obstruction.
            The <strong style={{ color: 'var(--green)' }}>diagonal passive channel</strong> (<InlineMath math="u = v" />) is positive by construction. The
            <strong style={{ color: 'var(--terra-dk)' }}> off-diagonal shear</strong> (<InlineMath math="u \ne v" />) is what must be absorbed.
          </p>

          <Conjecture id="Conj 25.2 — Off-diagonal absorption / hidden square" tone="blue">
            {S.commutator.keyConjecture25_2}
          </Conjecture>
          <Conjecture id="Conj 25.3 — Triangular commutator absorption" tone="blue">
            <BlockMath math="K_a = T_a^*\,K_a^{\rm diag}\,T_a + L_a^* L_a,\quad T_a\text{ Volterra/triangular, built from }\Phi" />
            {S.commutator.keyConjecture25_3}
          </Conjecture>

          <div style={{ marginTop: 14, padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
            <div style={{ color: 'var(--brass-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>§25.7 FINITE-WINDOW CERTIFICATE</div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Pick a test set <InlineMath math="Z = \{z_1, \dots, z_N\} \subset \mathbb{C}^+" /> and build
              <InlineMath math="G_a(Z) = (K_a(z_j, z_k))_{j,k}" />. With a frozen passive comparison <InlineMath math="G_{a,U}^{\rm pass}(Z) \succeq 0" />, a sufficient certificate is
              <InlineMath math="\lambda_{\min}(G_{a,U}^{\rm pass}(Z)) > \|G_a(Z) - G_{a,U}^{\rm pass}(Z)\|_2" />.
              This is the computational version of the hidden-square program.
            </p>
          </div>
        </Card>

        {/* §26 Measure Domination */}
        <Card>
          <h3 style={{ color: 'var(--terra)', fontSize: 18, margin: '0 0 12px 0' }}>{S.measureDomination.sectionId} {S.measureDomination.title}</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The diagonal channel admits a scalar Stieltjes representation. With <InlineMath math="P_{Z,c}(t) = \tfrac{1}{2}(|F_+|^2 + |F_-|^2)" />:
          </p>
          <BlockMath math="\langle c, K_a^{\rm diag}(Z)\,c\rangle = \int_0^\infty P_{Z,c}(\tau)\,d\mu_{a,\Phi}^{\rm diag}(\tau)" />
          <BlockMath math="\frac{d\mu_{a,\Phi}^{\rm diag}}{d\tau} = \frac{1}{2\pi}\int_\tau^\infty \Phi(u)^2 \sinh(2au)\,du" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The 2D operator-positivity question is reduced to a <strong style={{ color: 'var(--terra)' }}>1D scalar measure domination</strong>.
          </p>

          <Conjecture id="Conj 26.3 — Scalar bridge-domination" tone="terra">
            {S.measureDomination.keyConjecture26_3}
            <div style={{ marginTop: 6 }}>
              <BlockMath math="\mu_{a,\Phi}^{\rm pass} \geq \nu_{a,\Phi}\quad\Rightarrow\quad K_a \succeq 0\ \forall a > 0" />
            </div>
          </Conjecture>

          <Conjecture id="Conj 26.4 — Volterra absorption" tone="terra">
            {S.measureDomination.keyConjecture26_4}
          </Conjecture>

          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>
            {S.measureDomination.verdict}
          </p>
        </Card>

        {/* §27 Endpoint-Hankel */}
        <Card accent={ED.series3}>
          <h3 style={{ color: 'var(--green)', fontSize: 18, margin: '0 0 12px 0' }}>{S.endpointHankel.sectionId} {S.endpointHankel.title}</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The shear measure density is exact:
          </p>
          <BlockMath math="\int \varphi(\tau)\,d\nu_{a,\Phi}(\tau) = \frac{1}{2\pi}\!\int_{0 \le u \le v} \Phi(u)\Phi(v)\sinh(a(v - u)) \int_u^v \varphi(\tau)\,d\tau\,du\,dv" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            So <InlineMath math="\nu_{a,\Phi}" /> is the pushforward of <InlineMath math="\Phi(u)\Phi(v)\sinh(a(v-u))\mathbf{1}_{u \le \tau \le v}" />
            through intervals <InlineMath math="[u, v]" />. A <strong style={{ color: 'var(--green)' }}>Volterra-Hankel</strong> object: past endpoint <InlineMath math="[0, \tau]" />, future tail <InlineMath math="[\tau, \infty)" />.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            {S.endpointHankel.whyRawDiagonalCannotDominate} The hidden-square problem is equivalent to a block positivity:
          </p>
          <BlockMath math="\begin{pmatrix} I & V_{a,\Phi} \\ V_{a,\Phi}^* & I \end{pmatrix} \succeq 0\quad\iff\quad \|V_{a,\Phi}\| \le 1" />

          <Conjecture id="Conj 27.2 — Endpoint-Hankel Volterra contraction" tone="green">
            {S.endpointHankel.keyConjecture27_2}
          </Conjecture>

          <div style={{ marginTop: 14, padding: 12, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)', borderRadius: 6 }}>
            <div style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>CONCRETE TARGET</div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              {S.endpointHankel.finiteWindowDiagnostic}
            </p>
          </div>

          {/* §27 verdict: refuted-as-reduction / RH-equivalent surviving target */}
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)', borderLeft: '3px solid var(--terra-dk)', borderRadius: 6 }}>
              <div style={{ color: 'var(--terra-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>§27 VERDICT: REFUTED AS A REDUCTION</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                The claimed biconditional <InlineMath math="\|V_{a,\Phi}\| \le 1 \iff K_a \succeq 0" /> is{' '}
                <strong style={{ color: 'var(--terra-dk)' }}>FALSE</strong> at the genuine Riemann <InlineMath math="\Phi" />:
                the two positivity conditions provably decouple and the bare biconditional cannot be revived
                by any scalar normalization. So <InlineMath math="\|V\| \le 1" /> is not the entire content of no-ghost = RH.
              </p>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 40%, transparent)', borderLeft: '3px solid var(--green)', borderRadius: 6 }}>
              <div style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>SURVIVING TARGET: RH-EQUIVALENT</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                The degree-0 scale-invariant relative bound{' '}
                <InlineMath math="\|R\| \le 1 \iff K_a \succeq 0" /> for{' '}
                <InlineMath math="R = G_{\rm pass}^{-1/2} G_{\rm shear} G_{\rm pass}^{-1/2}" /> is
                RH-equivalent: a faithful, information-preserving restatement of <InlineMath math="K_a \succeq 0" />,
                not a reduction to something cheaper. Platt{'–'}Trudgian{' '}
                <InlineMath math="\Lambda \le 0.2" />.
              </p>
            </div>
          </div>
        </Card>

        {/* Implications */}
        <Card accent={ED.series2}>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 18, margin: '0 0 12px 0' }}>Implications for the wider proof program</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(S.implicationsForRH).map(([k, v]) => (
              <div key={k} style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
                <div style={{ color: 'var(--terra-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{k}</div>
                <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Related pages:</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/closure-routes" style={{ color: 'var(--blue)', fontSize: 13 }}>/closure-routes (§16 four routes)</Link>
            <Link to="/blaschke-ghosts" style={{ color: 'var(--blue)', fontSize: 13 }}>/blaschke-ghosts (§17 no-ghost)</Link>
            <Link to="/three-attacks" style={{ color: 'var(--blue)', fontSize: 13 }}>/three-attacks (§18 approaches)</Link>
            <Link to="/freezing-bridge" style={{ color: 'var(--blue)', fontSize: 13 }}>/freezing-bridge (§23 freezing)</Link>
            <Link to="/kyp-bounded-real" style={{ color: 'var(--blue)', fontSize: 13 }}>/kyp-bounded-real (Apps M-O KYP)</Link>
            <Link to="/collapse-chain" style={{ color: 'var(--blue)', fontSize: 13 }}>/collapse-chain (‖V‖ ≤ 1 collapse)</Link>
            <Link to="/section26-conditioning-artifact" style={{ color: 'var(--blue)', fontSize: 13 }}>/section26-conditioning-artifact (§26)</Link>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Source: {S.paperSourcePath} {S.paperSections} (pp. {S.paperPageRange})
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
