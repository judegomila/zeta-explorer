import React from 'react';
import { Link } from 'react-router-dom';
import CalabiYauViz from '../components/CalabiYauViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function CalabiYauPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Calabi-Yau Manifold Attack</h1>
        <p>
          Attacking the Riemann Hypothesis from the geometry of 6-dimensional Calabi-Yau manifolds.
          The Weil conjectures — proved by Deligne for varieties over finite fields — are the
          closest existing analog of RH. This page explores whether the same cohomological
          machinery can be lifted to ζ(s) over ℚ.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>The Core Idea</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Deligne proved RH for varieties over finite fields using étale cohomology and the Lefschetz
          trace formula. For a Calabi-Yau 3-fold X over <InlineMath tex="\mathbb{F}_p" />, the local zeta
          function satisfies <InlineMath tex="|\alpha| = p^{k/2}" /> — this <em>is</em> the Riemann
          Hypothesis in that setting. The question: can we find a "variety" whose L-function <em>is</em>{' '}
          <InlineMath tex="\zeta(s)" />, then apply Deligne's theorem?
        </p>
      </div>

      <BlockMath tex="\text{Weil RH}: \; Z(X/\mathbb{F}_p,\, T) = \prod_k P_k(T)^{(-1)^{k+1}}, \quad \text{roots of } P_k \text{ have } |\alpha| = p^{k/2}" />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6', fontSize: 14 }}>Five Calabi-Yau Strategies</h3>
          <ol style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: '#8b5cf6' }}>Hodge Structure</strong> — The Hodge diamond of
              a CY3 constrains the form of its L-function. Mirror symmetry{' '}
              <InlineMath tex="h^{1,1} \leftrightarrow h^{2,1}" /> dualizes the arithmetic data.
            </li>
            <li>
              <strong style={{ color: '#3b82f6' }}>Period Integrals</strong> — Picard-Fuchs equations
              govern how periods <InlineMath tex="\omega_k(z)" /> vary. Their monodromy encodes
              Galois representations that build the L-function.
            </li>
            <li>
              <strong style={{ color: '#10b981' }}>Mirror Prepotential</strong> — Gromov-Witten invariants
              <InlineMath tex="n_d" /> count rational curves and appear as instanton corrections to{' '}
              <InlineMath tex="F(t)" />. These are the enumerative data behind point counts.
            </li>
            <li>
              <strong style={{ color: '#f59e0b' }}>Local Zeta / Modularity</strong> — For rigid CY3s,
              the L-function equals that of a weight-4 modular form. The Ramanujan conjecture{' '}
              <InlineMath tex="|a_p| \leq 2p^{3/2}" /> is the CY version of RH.
            </li>
            <li>
              <strong style={{ color: '#ef4444' }}>Spectral Universality</strong> — Laplacian eigenvalues
              on CY manifolds share GUE statistics with ζ-zeros, suggesting the same symmetry class
              (unitary) governs both spectra.
            </li>
          </ol>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b', fontSize: 14 }}>The Arithmetic-Geometric Bridge</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
            The deep insight is that <strong>geometry constrains arithmetic</strong>:
          </p>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
            <li>Hodge numbers fix the degrees of the local zeta polynomials P_k(T)</li>
            <li>Mirror symmetry exchanges Kähler ↔ complex structure, giving functional equations</li>
            <li>The Ricci-flat condition (CY defining property) forces a₁ = 0 in the heat kernel</li>
            <li>Modularity (Serre, Fontaine-Mazur) promotes local data to a global L-function</li>
          </ul>
          <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12, fontWeight: 600 }}>
            Gap: We have RH for L-functions of CY varieties over <InlineMath tex="\mathbb{F}_p" />{' '}
            (Deligne). The missing step: prove that the Riemann ζ(s) arises as the L-function
            of a "motive" to which these methods apply. This is the{' '}
            <strong>Langlands program</strong> in its most ambitious form.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <CalabiYauViz />
      </div>

      {/* Detailed mathematical sections */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 12 }}>
          1. Hodge Theory & Cohomological Constraints
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          A Calabi-Yau 3-fold has trivial canonical bundle <InlineMath tex="K_X \cong \mathcal{O}_X" />,
          which forces the Hodge diamond to be symmetric with <InlineMath tex="h^{p,0} = 0" /> for{' '}
          <InlineMath tex="0 < p < 3" />. The key invariants are:
        </p>
        <BlockMath tex="h^{1,1}(X) = \dim H^1(X, \Omega^1_X), \quad h^{2,1}(X) = \dim H^1(X, \Omega^2_X)" />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          The Euler characteristic <InlineMath tex="\chi = 2(h^{1,1} - h^{2,1})" /> determines the
          topological complexity. For the Fermat quintic in <InlineMath tex="\mathbb{P}^4" />,{' '}
          <InlineMath tex="h^{1,1}=1, h^{2,1}=101, \chi = -200" />. The 204-dimensional middle
          cohomology <InlineMath tex="H^3(X)" /> carries the Galois representation whose L-function
          we compare to ζ(s).
        </p>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 12 }}>
          2. Picard-Fuchs & the Mirror Map
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The fundamental period of the quintic mirror satisfies the Picard-Fuchs ODE:
        </p>
        <BlockMath tex="\left[\theta^4 - 5z(5\theta+1)(5\theta+2)(5\theta+3)(5\theta+4)\right] \omega_0 = 0, \quad \theta = z\frac{d}{dz}" />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          The monodromy of this equation around the singular points z = 0, 1/3125, ∞ generates
          a subgroup of <InlineMath tex="\mathrm{Sp}(4, \mathbb{Z})" />. This monodromy representation
          is a shadow of the Galois representation on <InlineMath tex="H^3(X)" />, connecting
          geometry directly to arithmetic.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 12 }}>
          3. Weil Conjectures as the Finite-Field RH
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Deligne's theorem (1974) proves that for a smooth projective variety X over{' '}
          <InlineMath tex="\mathbb{F}_q" />, the eigenvalues of Frobenius acting on{' '}
          <InlineMath tex="H^k_{\text{ét}}(X, \mathbb{Q}_\ell)" /> have absolute value{' '}
          <InlineMath tex="q^{k/2}" />. For a CY3:
        </p>
        <BlockMath tex="\det(1 - \mathrm{Frob}_p \cdot T \mid H^3_{\text{ét}}) = P_3(T), \quad \text{all roots } |\alpha| = p^{3/2}" />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          This is <strong>exactly</strong> the Riemann Hypothesis for the local zeta function.
          The proof uses: (i) Lefschetz trace formula, (ii) hard Lefschetz theorem,
          (iii) purity of ℓ-adic sheaves. The hope is that analogous structures exist
          for ζ(s) over ℚ — this is the program of <strong>arithmetic geometry</strong>.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 12 }}>
          4. Modularity & the Langlands Connection
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          For <strong>rigid</strong> CY3-folds (<InlineMath tex="h^{2,1} = 0" />), the Galois
          representation on <InlineMath tex="H^3" /> is 2-dimensional and corresponds to a
          weight-4 modular form by modularity lifting theorems. The Ramanujan-Petersson
          conjecture for these forms states:
        </p>
        <BlockMath tex="|a_p| \leq 2p^{3/2} \quad \text{for all primes } p" />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          This is proved (Deligne, 1974) and is the CY analog of RH. For non-rigid CY3s
          (<InlineMath tex="h^{2,1} > 0" />), the Galois representation has higher dimension
          and the story becomes the full <strong>Langlands program</strong> — relating
          automorphic representations to motives.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #06b6d4' }}>
        <h3 style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>
          5. Spectral Geometry & GUE Universality
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The spectrum of the scalar Laplacian on a CY3 with its Ricci-flat Kähler metric
          connects to ζ(s) through two channels:
        </p>
        <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          <li>
            <strong>Spectral zeta function:</strong>{' '}
            <InlineMath tex="\zeta_\Delta(s) = \sum_n \lambda_n^{-s}" /> has a meromorphic
            continuation whose poles and residues encode geometric invariants (Euler char, volume, curvature).
          </li>
          <li>
            <strong>GUE universality:</strong> For "generic" CY metrics, the eigenvalue spacings
            follow GUE statistics — the <em>same</em> distribution seen in ζ-zero spacings
            (Montgomery-Odlyzko). This suggests both spectra belong to the unitary symmetry class.
          </li>
          <li>
            <strong>Selberg trace formula:</strong> On locally symmetric spaces, the eigenvalue
            spectrum and closed geodesics are dual — mirroring the explicit formula relating
            primes to ζ-zeros.
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #f43f5e' }}>
        <h3 style={{ color: '#f43f5e', fontSize: 14, marginBottom: 12 }}>
          6. The Threefold Lift Strategy
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The most direct route from Deligne to classical RH would be: find a Calabi-Yau 3-fold{' '}
          <InlineMath tex="X / \mathbb{Q}" /> whose L-function of middle cohomology <em>equals</em> the
          Riemann zeta function:
        </p>
        <BlockMath tex="L\bigl(H^3_{\text{\'{e}t}}(X),\, s\bigr) = \zeta(s)" />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          If such an <InlineMath tex="X" /> existed, Deligne{"'"}s theorem would immediately yield: the
          eigenvalues of <InlineMath tex="\mathrm{Frob}_p" /> on <InlineMath tex="H^3" /> have absolute
          value <InlineMath tex="p^{3/2}" />, and the zeros of <InlineMath tex="\zeta(s)" /> would be
          forced onto the critical line. This is the <strong>threefold lift</strong> strategy.
        </p>

        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8,
                      background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <strong style={{ color: '#fb7185', fontSize: 13 }}>Why This Fails (Three Fundamental Obstructions)</strong>
          <ol style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, lineHeight: 2, marginTop: 8 }}>
            <li>
              <strong style={{ color: '#fbbf24' }}>Euler factor degree mismatch.</strong>{' '}
              <InlineMath tex="\zeta(s)" /> has Euler factors <InlineMath tex="(1 - p^{-s})^{-1}" /> of
              degree 1. A CY3 L-function has local factors{' '}
              <InlineMath tex="P_3(p^{-s})^{-1}" /> of degree{' '}
              <InlineMath tex="\deg P_3 = b_3 = 2 + 2h^{2,1}" />, which is at least 2 (for rigid CY3s
              with <InlineMath tex="h^{2,1} = 0" />, <InlineMath tex="\deg P_3 = 2" />). There is no
              variety whose <InlineMath tex="P_3" /> has degree 1.
            </li>
            <li>
              <strong style={{ color: '#fbbf24' }}>Weight mismatch.</strong>{' '}
              Deligne{"'"}s purity theorem gives Frobenius eigenvalues of absolute value{' '}
              <InlineMath tex="p^{3/2}" /> (weight 3) on <InlineMath tex="H^3" />. But{' '}
              <InlineMath tex="\zeta(s)" /> zeros correspond to weight 0 (eigenvalue{' '}
              <InlineMath tex="p^{1/2}" /> at the critical point). No Tate twist or motivic operation
              can bridge a weight gap of 3.
            </li>
            <li>
              <strong style={{ color: '#fbbf24' }}>Infinite vs. finite.</strong>{' '}
              <InlineMath tex="\zeta(s)" /> has infinitely many nontrivial zeros, so any "motivic"
              realization would require infinite-dimensional cohomology. All algebraic varieties
              produce finite-dimensional <InlineMath tex="H^k" />. This is the deepest
              obstruction, pointing toward Deninger{"'"}s infinite-dimensional foliated spaces
              or Connes{"'"} noncommutative geometry as potential frameworks.
            </li>
          </ol>
        </div>

        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8,
                      background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <strong style={{ color: '#93c5fd', fontSize: 13 }}>Partial Results & Analogies</strong>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
            <li>
              <strong>Function field analog:</strong> For <InlineMath tex="\zeta_C(s)" /> of a curve{' '}
              <InlineMath tex="C / \mathbb{F}_q" />, the threefold lift <em>does</em> work: the
              zeta function is a rational function with finitely many zeros, all on{' '}
              <InlineMath tex="\mathrm{Re}(s) = 1/2" /> (Weil, 1948).
            </li>
            <li>
              <strong>Deninger{"'"}s program:</strong> Seeks an infinite-dimensional "arithmetic site"{' '}
              <InlineMath tex="\mathcal{S}" /> with a foliation whose leaf-wise Laplacian has
              spectrum equal to the Riemann zeros. The "regularized determinant" of this operator
              would equal <InlineMath tex="\zeta(s)" />.
            </li>
            <li>
              <strong>Connes{"'"} approach:</strong> The adele class space{' '}
              <InlineMath tex="\mathbb{A}_{\mathbb{Q}} / \mathbb{Q}^*" /> carries a natural flow
              whose Lefschetz trace formula reproduces the explicit formula for{' '}
              <InlineMath tex="\zeta(s)" />. This is the closest noncommutative analog of the
              threefold lift.
            </li>
            <li>
              <strong>Families of CY3s:</strong> While no single CY3 suffices, families of CY3s
              parameterized by moduli spaces produce L-functions that collectively encode rich
              arithmetic data. The Langlands program connects these to automorphic forms.
            </li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #06b6d4' }}>
        <h3 style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>
          7. The Fisher Efficiency Bridge
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          A striking connection between the CY spectral zeta and the Riemann zeta emerges through
          <strong> Fisher information</strong>. For any spectral zeta function{' '}
          <InlineMath tex="\zeta_\Delta(s) = \sum_n \lambda_n^{-s}" />, we can define a probability
          distribution over eigenvalues parametrized by <InlineMath tex="\sigma = \mathrm{Re}(s)" />:
        </p>
        <BlockMath tex="p_n(\sigma) = \frac{\lambda_n^{-\sigma}}{\zeta_\Delta(\sigma)}, \qquad F(\sigma) = \sum_n p_n(\sigma)\!\left(\log\lambda_n - \langle\log\lambda\rangle_\sigma\right)^2" />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          This Fisher information <InlineMath tex="F(\sigma)" /> measures how sensitively the spectral
          density responds to shifts in <InlineMath tex="\sigma" />. The key observation: <strong>both</strong> the
          Riemann zeta (via its Euler product) and the CY spectral zeta exhibit a Fisher information
          peak at their respective critical points — <InlineMath tex="\sigma = 1/2" /> for{' '}
          <InlineMath tex="\zeta(s)" /> and <InlineMath tex="\sigma_c" /> for{' '}
          <InlineMath tex="\zeta_\Delta(s)" />.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          When we normalize both profiles to the rescaled coordinate{' '}
          <InlineMath tex="\tilde\sigma = \sigma/\sigma_c" />, the Fisher curves align. This
          <strong> universality of the Fisher peak</strong> suggests that the critical line is not a
          coincidence specific to <InlineMath tex="\zeta(s)" />, but an information-theoretic
          necessity: it is the point of maximal statistical distinguishability in the spectral
          parameter, the point where the "spectral density" is most efficiently estimated.
        </p>
        <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          <li>
            <strong>Riemann zeta:</strong> The Euler product weights{' '}
            <InlineMath tex="|1 - p^{-s}|^{-2}" /> define a prime-indexed distribution whose
            Fisher information diverges as <InlineMath tex="\sigma \to 1/2" /> — the zeros
            concentrate statistical sensitivity onto the critical line.
          </li>
          <li>
            <strong>CY spectral zeta:</strong> The Laplacian eigenvalue weights{' '}
            <InlineMath tex="\lambda_n^{-\sigma}" /> define a spectral distribution whose Fisher
            information peaks at a critical <InlineMath tex="\sigma_c" /> determined by Weyl
            asymptotics. For a 6-dimensional CY3, this is governed by the{' '}
            <InlineMath tex="n^{1/3}" /> growth rate of eigenvalues.
          </li>
          <li>
            <strong>Cross-check:</strong> We validate this bridge by comparing three independent
            measures — GUE spacing statistics, Fisher profile correlation, and the Montgomery
            pair correlation function <InlineMath tex="R_2" /> — between the CY spectrum and
            Riemann zeros. High agreement across all three channels provides evidence for a
            shared information-geometric structure.
          </li>
        </ul>
        <p style={{ color: '#06b6d4', fontSize: 13, lineHeight: 1.8, marginTop: 12, fontWeight: 600 }}>
          Implication: If the Fisher peak universality can be made rigorous — showing that
          any "well-behaved" spectral zeta function must have its Fisher information concentrated
          at the critical point — this would provide a new information-theoretic route to
          understanding why zeros cluster on the critical line.
        </p>
      </div>

      {/* Gap analysis */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 14, marginBottom: 12 }}>
          Proof Gap Analysis
        </h3>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Step</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Weil conjectures for CY/F_p', '✅ Proved (Deligne 1974)', 'Done'],
                ['Modularity for rigid CY3s', '✅ Proved (various, 2000s)', 'Done'],
                ['Ramanujan conjecture for weight-4 forms', '✅ Proved (Deligne)', 'Done'],
                ['Langlands for higher-dim Galois reps', '🟡 Partial (automorphy lifting)', 'Very Hard'],
                ['Motivic interpretation of ζ(s)', '🔴 Open (requires new ideas)', 'Millennium'],
                ['GUE universality ⟹ RH', '🔴 Heuristic only', 'Unknown'],
                ['Spectral geometry ⟹ zero location', '🔴 No rigorous connection', 'Fundamental'],
              ].map(([step, status, diff], i) => (
                <tr key={i} style={{ color: '#94a3b8', borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '8px 12px' }}>{step}</td>
                  <td style={{ padding: '8px 12px' }}>{status}</td>
                  <td style={{ padding: '8px 12px', color: diff === 'Done' ? '#10b981' :
                    diff === 'Very Hard' ? '#f59e0b' : '#ef4444' }}>{diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related pages */}
      <div className="card" style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['/rh-attack', 'RH Attack Strategies'],
            ['/spectral-attack', 'Spectral Attack'],
            ['/twistor', 'Twistor Geometry'],
            ['/statistics', 'GUE Statistics'],
            ['/formal-proof', 'Formal Proof'],
            ['/zeta', 'Zeta Function'],
          ].map(([to, label]) => (
            <Link key={to} to={to} style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 13,
              background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd',
              textDecoration: 'none', border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>{label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
