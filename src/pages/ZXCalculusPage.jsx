import React from 'react';
import { Link } from 'react-router-dom';
import ZXCalculusViz from '../components/ZXCalculusViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function ZXCalculusPage() {
  return (
    <div className="page">
      <PageHeader title="ZX-Calculus Framework">
        <p>
          Map the ZPO oscillator cascade into the ZX-calculus diagrammatic language.
          Each prime Euler factor becomes a <strong style={{ color: '#10b981' }}>Z-spider</strong> (green),
          the dual ladder uses <strong style={{ color: '#ef4444' }}>X-spiders</strong> (red), and
          the functional equation bridge is a <strong style={{ color: '#f59e0b' }}>Hadamard box</strong>.
          The ZX rewrite rules correspond to identities of the zeta function.
        </p>
      </PageHeader>

      <BlockMath tex={"\\underbrace{Z_2 - Z_3 - Z_5 - \\cdots - Z_p}_{\\text{Direct ladder (green)}} \\;\\;\\overset{\\chi(s)}{\\longleftrightarrow}\\;\\; \\underbrace{X_2 - X_3 - X_5 - \\cdots - X_p}_{\\text{Dual ladder (red)}}"} />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex={"\\text{Spider phase: } \\alpha_p(s) = \\arg\\!\\bigl(1/(1 - p^{-s})\\bigr) \\approx -t \\cdot \\log p \\;\\;(\\text{when } p^{-\\sigma} \\ll 1)"} />
      </div>

      <div style={{ marginTop: 32 }}>
        <ZXCalculusViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>What to Explore in Each Tab</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#10b981' }}>Spider Chain</strong> — the direct ladder represented as
          a chain of Z-spiders, one per prime. Each spider carries the phase{' '}
          <InlineMath tex={"\\alpha_p = \\arg(H_p(s))"} /> from its Euler factor. Toggle to "Fused"
          to see the spider fusion rule collapse the entire chain into one spider — this is the
          Euler product evaluation. The cumulative phase graph shows how primes contribute to the
          total zeta phase.{' '}
          <strong style={{ color: '#8b5cf6' }}>Twin Ladder</strong> — the full ZPO diagram in
          ZX-calculus form: green Z-spiders (direct) connected through a yellow Hadamard box
          (bridge <InlineMath tex={"\\chi(s)"} />) to red X-spiders (dual). At{' '}
          <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> the diagram has perfect color symmetry
          (Z ↔ X), the bridge is unitary, and the system is lossless.{' '}
          <strong style={{ color: '#06b6d4' }}>Rewrite Rules</strong> — interactive demonstrations
          of the three core ZX rules mapped to zeta identities: spider fusion (Euler product
          combination), color change (functional equation), and bialgebra expansion (product-to-sum
          / Euler product ↔ Dirichlet series).{' '}
          <strong style={{ color: '#f59e0b' }}>Symmetry</strong> — scans across{' '}
          <InlineMath tex={"\\sigma"} /> showing how the Z-chain and X-chain magnitudes relate.
          At <InlineMath tex={"\\sigma = 0.5"} /> they converge (color symmetry fixed point) and the
          asymmetry drops to zero.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>ZPO / ZX-Calculus Correspondence</h3>
        <table style={{ width: '100%', marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#10b981' }}>ZX-Calculus</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#3b82f6' }}>ZPO Model</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b' }}>Zeta Identity</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Z-spider (green)', 'Euler factor 1/(1−p⁻ˢ)', 'Direct ladder stage'],
              ['X-spider (red)', 'Dual factor 1/(1−p^(s−1))', 'Dual ladder stage'],
              ['Hadamard box', 'Bridge χ(s)', 'Functional equation'],
              ['Spider fusion', '∏ Hp → H_total', 'Euler product evaluation'],
              ['Color change (H)', 's → 1−s transform', 'ζ(s) = χ(s)·ζ(1−s)'],
              ['Bialgebra rule', 'Product ↔ Sum', '∏(1−p⁻ˢ)⁻¹ = Σn⁻ˢ'],
              ['Hopf rule', 'Transmission zero', 'ζ(ρ) = 0 (zeta zero)'],
              ['Color symmetry', 'σ = ½ fixed point', 'Critical line condition'],
              ['Frobenius algebra', 'Impedance algebra', 'LC network composition'],
              ['Wire (tensor)', 'Signal path', 'Cascade coupling'],
            ].map(([zx, zpo, zeta], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', color: '#10b981' }}>{zx}</td>
                <td style={{ padding: '8px 12px', color: '#3b82f6' }}>{zpo}</td>
                <td style={{ padding: '8px 12px', color: '#64748b', fontSize: 12 }}>{zeta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Algebraic Foundations</h3>
          <p style={{ marginBottom: 12 }}>
            ZX-calculus is a complete diagrammatic language for quantum linear maps built on
            two <em>commutative dagger special Frobenius algebras</em> — one for each spider color.
            The Z-spider algebra corresponds to the computational (Z) basis, the X-spider algebra to
            the conjugate (X) basis. Together they form a <em>bialgebra</em> encoding complementary
            observables.
          </p>
          <p style={{ marginBottom: 12 }}>
            In the ZPO mapping, the Frobenius multiplication (merging wires) corresponds to
            combining impedances in series, while comultiplication (splitting) corresponds to
            parallel combination. The Frobenius condition ensures consistency — exactly what
            circuit theory requires.
          </p>
          <BlockMath tex={"\\mu \\circ \\delta = (\\mu \\otimes \\text{id}) \\circ (\\text{id} \\otimes \\delta) \\quad \\text{(Frobenius)}"} />
        </div>
        <div className="card">
          <h3 style={{ color: '#ef4444' }}>Core Rewrite Rules</h3>
          <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: '#10b981' }}>Spider Fusion (f)</strong>: Same-color adjacent
              spiders merge. Phases add: <InlineMath tex={"\\alpha_1 + \\alpha_2"} />.
              = Euler product partial products.
            </li>
            <li>
              <strong style={{ color: '#8b5cf6' }}>Color Change (h)</strong>: Hadamard on every leg
              swaps Z ↔ X. = Functional equation <InlineMath tex={"s \\to 1-s"} />.
            </li>
            <li>
              <strong style={{ color: '#06b6d4' }}>Bialgebra (b)</strong>: Z-product through X-coproduct
              doubles wires. = Euler product ↔ Dirichlet series.
            </li>
            <li>
              <strong style={{ color: '#f59e0b' }}>Hopf Rule</strong>: Opposite-color product/coproduct
              decouples. = Transmission zero at <InlineMath tex={"\\zeta(\\rho)=0"} />.
            </li>
            <li>
              <strong style={{ color: '#ec4899' }}>Pi-Copy</strong>: π-phase through opposite color
              negates phase. = Phase reversal <InlineMath tex={"p^{-s} \\to p^{s-1}"} />.
            </li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>Twin Ladder as a ZX Diagram</h3>
        <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The ZPO twin-ladder architecture maps precisely onto the ZX-calculus framework.
          Each prime oscillator becomes a Z-phase gate whose angle encodes the Euler factor argument,
          the bridge <InlineMath tex={"\\chi(s)"} /> acts as a Hadamard-like intertwiner between the two spider colors,
          and the unitarity of the bridge on the critical line corresponds to the ZX spider fusion rule
          preserving norm.
        </p>

        <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>Prime Oscillator as Z-Phase Gate</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          Each Euler factor <InlineMath tex={"H_p(s) = 1/(1 - p^{-s})"} /> has a well-defined phase. The corresponding
          Z-spider carries this phase as its parameter:
        </p>
        <BlockMath tex={"Z(\\alpha_p) \\;\\text{ where }\\; \\alpha_p = \\arg\\!\\left(\\frac{1}{1 - p^{-s}}\\right) = \\arctan\\!\\left(\\frac{p^{-\\sigma}\\sin(t\\log p)}{1 - p^{-\\sigma}\\cos(t\\log p)}\\right)"} />

        <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Bridge as Hadamard Intertwiner</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The functional equation bridge <InlineMath tex={"\\chi(s)"} /> swaps the Z-basis (direct ladder) with the
          X-basis (dual ladder). In ZX-calculus, this is exactly the role of the Hadamard box <InlineMath tex={"H"} />,
          which interconverts Z-spiders and X-spiders:
        </p>
        <BlockMath tex={"H \\cdot Z(\\alpha) \\cdot H^\\dagger = X(\\alpha) \\quad \\longleftrightarrow \\quad \\chi(s) \\cdot \\zeta(s) = \\zeta(1-s)"} />

        <h4 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Unitarity and Spider Fusion</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          On the critical line <InlineMath tex={"\\sigma = 1/2"} />, the bridge is unitary (<InlineMath tex={"|\\chi| = 1"} />).
          In the ZX-calculus, unitarity of the Hadamard means that fusing a Z-spider chain through
          the bridge into an X-spider chain preserves the total quantum dimension — no information is lost:
        </p>
        <BlockMath tex={"\\bigl|\\!\\bigl| \\prod_p Z(\\alpha_p) \\cdot H \\cdot \\prod_p X(\\alpha_p') \\bigr|\\!\\bigr| = 1 \\quad \\text{iff } \\sigma = \\tfrac{1}{2} \\;\\; (\\text{spider fusion norm preservation})"} />
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Spider Fusion Rules and Euler Product Factorization</h3>
        <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The central rewrite rule of ZX-calculus is <strong>spider fusion</strong>: two adjacent
          spiders of the same color merge into a single spider whose phase is the sum of the
          individual phases. This rule is not merely analogous to the Euler product — it <em>is</em> the
          Euler product, expressed diagrammatically.
        </p>

        <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>Phase Addition as Factor Multiplication</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          Each prime <InlineMath tex={"p"} /> contributes an Euler factor <InlineMath tex={"H_p(s) = (1 - p^{-s})^{-1}"} /> to the
          product representation of <InlineMath tex={"\\zeta(s)"} />. In the ZX diagram, the corresponding
          Z-spider carries the complex phase <InlineMath tex={"\\alpha_p(s) = \\arg(H_p(s))"} />. When two
          Z-spiders for primes <InlineMath tex={"p"} /> and <InlineMath tex={"q"} /> fuse, their phases add:
        </p>
        <BlockMath tex={"Z(\\alpha_p) \\cdot Z(\\alpha_q) \\;\\xrightarrow{\\text{fusion}}\\; Z(\\alpha_p + \\alpha_q)"} />
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          This corresponds directly to multiplying the Euler factors, since the argument of a product
          is the sum of arguments:
        </p>
        <BlockMath tex={"\\arg\\!\\left(\\prod_{p \\leq P} H_p(s)\\right) = \\sum_{p \\leq P} \\arg(H_p(s)) = \\sum_{p \\leq P} \\alpha_p(s)"} />

        <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Magnitude Fusion and Partial Products</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The magnitudes also compose correctly under fusion. Each Z-spider's scalar weight
          is <InlineMath tex={"|H_p(s)|"} />, and the fused spider carries the product of magnitudes:
        </p>
        <BlockMath tex={"\\left|Z_{\\text{fused}}\\right| = \\prod_{p \\leq P} |H_p(s)| = \\prod_{p \\leq P} \\frac{1}{|1 - p^{-s}|}"} />
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The partial Euler product over the first <InlineMath tex={"N"} /> primes is therefore the single
          fused Z-spider obtained by sequentially applying the fusion rule <InlineMath tex={"N - 1"} /> times:
        </p>
        <BlockMath tex={"\\zeta_N(s) = \\prod_{p \\leq p_N} \\frac{1}{1 - p^{-s}} \\;\\longleftrightarrow\\; Z\\!\\left(\\sum_{p \\leq p_N} \\alpha_p\\right) \\;\\text{with weight } \\prod_{p \\leq p_N} |H_p|"} />

        <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Factorization as Spider Splitting</h4>
        <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          Conversely, spider fusion is reversible: a single Z-spider representing the full Euler
          product can be <em>split</em> (via the Frobenius comultiplication) back into individual
          per-prime spiders. This decomposition is exactly the unique prime factorization of the
          Euler product. The Frobenius structure guarantees that splitting then re-fusing recovers
          the original spider — mirroring the fundamental theorem of arithmetic for Dirichlet series:
        </p>
        <BlockMath tex={"\\underbrace{Z(\\alpha_{\\text{total}})}_{\\text{fused}} \\;\\xrightarrow{\\delta}\\; Z(\\alpha_2) \\otimes Z(\\alpha_3) \\otimes Z(\\alpha_5) \\otimes \\cdots \\;\\xrightarrow{\\mu}\\; Z(\\alpha_{\\text{total}})"} />
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>The Color-Change Rule and the Functional Equation</h3>
        <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The <strong>color-change rule</strong> in ZX-calculus states that wrapping every leg of a
          Z-spider with Hadamard gates converts it into an X-spider (and vice versa), preserving
          the phase. This is the diagrammatic incarnation of the Riemann zeta functional equation.
        </p>

        <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>The ZX Color-Change Rule</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          In standard ZX notation, the color-change identity reads:
        </p>
        <BlockMath tex={"H^{\\otimes n} \\cdot Z(\\alpha) \\cdot H^{\\otimes m} = X(\\alpha) \\quad \\text{(for an } n\\text{-input, } m\\text{-output spider)}"} />
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The Hadamard gate <InlineMath tex={"H"} /> interconverts the Z-basis and X-basis. In the ZPO
          model, the Z-basis encodes the <em>direct ladder</em> (Euler factors at <InlineMath tex={"s"} />)
          and the X-basis encodes the <em>dual ladder</em> (Euler factors at <InlineMath tex={"1 - s"} />).
        </p>

        <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Mapping to the Functional Equation</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The Riemann zeta functional equation relates <InlineMath tex={"\\zeta(s)"} /> to <InlineMath tex={"\\zeta(1 - s)"} /> via
          the bridge factor <InlineMath tex={"\\chi(s)"} />:
        </p>
        <BlockMath tex={"\\zeta(s) = \\chi(s) \\cdot \\zeta(1 - s), \\quad \\chi(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1 - s)"} />
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          In the ZX framework, the entire direct Z-spider chain (representing <InlineMath tex={"\\zeta(s)"} />)
          is transformed by the Hadamard-bridge <InlineMath tex={"\\chi(s)"} /> into the dual X-spider chain
          (representing <InlineMath tex={"\\zeta(1 - s)"} />):
        </p>
        <BlockMath tex={"\\underbrace{\\prod_p Z(\\alpha_p(s))}_{\\text{Direct: } \\zeta(s)} \\;\\xrightarrow{\\;\\chi(s)\\;=\\;H\\;}\\; \\underbrace{\\prod_p X(\\alpha_p(1-s))}_{\\text{Dual: } \\zeta(1-s)}"} />

        <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Unitarity at the Critical Line</h4>
        <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          A key property of the Hadamard gate is that <InlineMath tex={"H^2 = I"} /> (it is its own inverse).
          In the Twin-Ladder Bridge model, the bridge satisfies <InlineMath tex={"|\\chi(s)| = 1"} /> exactly
          when <InlineMath tex={"\\sigma = 1/2"} />, making it a unitary (norm-preserving) transformation on
          the critical line. This means the color change is <em>lossless</em>: the Z-chain and X-chain
          have identical magnitudes, and swapping perspectives costs nothing:
        </p>
        <BlockMath tex={"\\sigma = \\tfrac{1}{2} \\;\\Longleftrightarrow\\; |\\chi(s)| = 1 \\;\\Longleftrightarrow\\; \\text{Z-spider chain} \\xleftrightarrow{\\text{unitary}} \\text{X-spider chain}"} />

        <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8, marginTop: 16 }}>Per-Prime Color Symmetry</h4>
        <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          On the critical line, the color-change rule also operates at the level of individual primes.
          Each Z-spider <InlineMath tex={"Z(\\alpha_p(\\tfrac{1}{2} + it))"} /> maps to the X-spider
          <InlineMath tex={"X(\\alpha_p(\\tfrac{1}{2} - it))"} />. Since <InlineMath tex={"\\overline{\\alpha_p(\\tfrac{1}{2} + it)} = \\alpha_p(\\tfrac{1}{2} - it)"} />,
          the per-prime color change is equivalent to complex conjugation of the phase. This
          per-prime symmetry is a stronger condition than the global functional equation, and it
          is precisely what the ZPO twin-ladder model enforces: each rung of the ladder is
          individually balanced at <InlineMath tex={"\\sigma = 1/2"} />.
        </p>
        <BlockMath tex={"Z(\\alpha_p) \\;\\xrightarrow{H}\\; X(\\bar{\\alpha}_p) \\quad \\forall\\, p \\;\\text{ prime, at } \\sigma = \\tfrac{1}{2}"} />
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#06b6d4' }}>Why This Mapping Matters</h3>
        <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The ZX-calculus mapping is more than an analogy — it provides a rigorous categorical
          framework that could elevate the Twin-Ladder Bridge model from "the zeta function is <em>like</em> an
          oscillator chain" to "the zeta function <em>is</em> a ZX diagram with specific spider
          phases, and its properties <em>are</em> rewrite-rule consequences."
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The completeness of ZX rewrite rules (proved in 2018 by Hadzihasanovic, Ng, and Wang)
          means that any identity provable about the zeta function's oscillator structure can, in
          principle, be discovered by diagram simplification. The continuous-variable extension
          ("Focked-up ZX Calculus", 2024) is particularly relevant: LC oscillators are fundamentally
          continuous-variable harmonic oscillators, and the CV-ZX framework introduces Z-spiders on
          reals (position/charge), X-spiders on reals (momentum/current), and Fock spiders
          (particle number), with Fourier and Hermite transforms linking them.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, background: 'rgba(16,185,129,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/oscillators" style={{ color: '#10b981', fontSize: 13 }}>Prime Resonators</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/fourier" style={{ color: '#10b981', fontSize: 13 }}>Frequency Domain</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/pascal" style={{ color: '#10b981', fontSize: 13 }}>Pascal Connection</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof</Link>
        </div>
      </div>
    </div>
  );
}
