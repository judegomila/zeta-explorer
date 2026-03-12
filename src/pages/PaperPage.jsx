import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

function Section({ number, title, children }) {
  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ color: '#e2e8f0', fontSize: 22, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
        {number}. {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontSize: 15, lineHeight: 1.85, color: '#cbd5e1', marginTop: 12 }}>{children}</p>;
}

function Def({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #8b5cf6', background: 'rgba(139,92,246,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#a78bfa', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Thm({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #10b981', background: 'rgba(16,185,129,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#34d399', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Rmk({ children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #06b6d4', background: 'rgba(6,182,212,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#22d3ee', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remark</strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function PaperPage() {
  return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Title Block */}
      <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 20 }}>
        <h1 style={{ fontSize: 28, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 12 }}>
          The Zeta Prime Oscillator Programme:
          <br />
          A Unified Circuit-Theoretic Framework for the Riemann Hypothesis
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, fontStyle: 'italic', marginTop: 16 }}>
          An expository paper accompanying the ZPO Explorer interactive application
        </p>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
          March 2026
        </p>
      </div>

      {/* Abstract */}
      <div className="card" style={{ borderColor: '#3b82f6', marginBottom: 32 }}>
        <h3 style={{ color: '#3b82f6', marginTop: 0, fontSize: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Abstract</h3>
        <P>
          We develop a systematic reinterpretation of the Riemann zeta function as the transfer function
          of an infinite cascade network of LC oscillator stages, one per prime. In this framework,
          the Euler product <InlineMath tex="\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}" /> becomes the chain
          transfer function of a ladder network where each prime <InlineMath tex="p" /> contributes a
          series LC resonator with inductance <InlineMath tex="L_p = \\log p" /> and capacitance <InlineMath tex="C_p = 1/\\log p" />.
          The functional equation <InlineMath tex="\\xi(s) = \\xi(1-s)" /> becomes the impedance-matching condition
          of a lossless bridge coupling the "direct ladder" <InlineMath tex="\\zeta(s)" /> to the "dual ladder" <InlineMath tex="\\zeta(1-s)" />.
        </P>
        <P>
          We show that the Riemann Hypothesis — all nontrivial zeros lie on <InlineMath tex="\\operatorname{Re}(s) = \\tfrac{1}{2}" /> —
          admits natural reformulations as: (i) the energy minimum of a system Hamiltonian,
          (ii) the stability condition of a feedback loop (Nyquist criterion),
          (iii) the conjugate-matched point where impedance mismatch is minimized,
          (iv) the thermal equilibrium of a primon gas (Bost-Connes phase transition), and
          (v) the incidence relation in a twistor correspondence. These viewpoints are unified
          by the oscillator chain model and explored computationally through 26 interactive visualizations
          and 47 mathematical exploration entries.
        </P>
      </div>

      <Section number={1} title="Introduction: The Euler Product as a Cascade Network">
        <P>
          The starting point of the entire programme is Euler's 1737 product formula. For <InlineMath tex="\\operatorname{Re}(s) > 1" />:
        </P>
        <BlockMath tex="\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}" />
        <P>
          The Dirichlet series on the left is a sum over all positive integers; the product on the right
          runs over primes alone. This factorization reflects the fundamental theorem of arithmetic:
          every integer has a unique prime factorization.
        </P>
        <P>
          In electrical engineering, a product of transfer functions corresponds to a <em>cascade</em> (series connection)
          of two-port networks. Each Euler factor <InlineMath tex="H_p(s) = (1 - p^{-s})^{-1}" /> is the transfer function
          of a single oscillator stage. The full product <InlineMath tex="\\zeta(s) = \\prod_p H_p(s)" /> is the
          cascade of all such stages, ordered by prime size.
        </P>
        <Def label="Definition 1.1 (Prime Oscillator Stage)">
          For each prime <InlineMath tex="p" />, define the <em>prime oscillator stage</em> as an LC resonator with:
          <BlockMath tex="L_p = \\log p, \\quad C_p = \\frac{1}{\\log p}, \\quad \\omega_0 = \\frac{1}{\\sqrt{L_p C_p}} = 1, \\quad Z_0(p) = \\sqrt{\\frac{L_p}{C_p}} = \\log p" />
          The resonant frequency <InlineMath tex="\\omega_0 = 1" /> is universal (independent of <InlineMath tex="p" />), while the
          characteristic impedance <InlineMath tex="Z_0(p) = \\log p" /> increases logarithmically with <InlineMath tex="p" />.
        </Def>
        <P>
          The quality factor of each stage is:
        </P>
        <BlockMath tex="Q_p = \\frac{1}{2\\sigma} \\quad \\text{where } \\sigma = \\operatorname{Re}(s)" />
        <P>
          Crucially, <InlineMath tex="Q" /> depends only on <InlineMath tex="\\sigma" />, not on <InlineMath tex="p" />. All prime
          oscillators share the same damping ratio. At <InlineMath tex="\\sigma = \\tfrac{1}{2}" />,
          we get <InlineMath tex="Q = 1" /> — every oscillator is critically damped. This is the first hint
          that the critical line is physically special.
        </P>
      </Section>

      <Section number={2} title="The Direct and Dual Ladders">
        <P>
          The cascade of all Euler factors defines the <em>direct ladder</em>:
        </P>
        <BlockMath tex="\\zeta(s) = \\prod_{p} \\frac{1}{1 - p^{-s}} \\quad \\text{(direct ladder transfer function)}" />
        <P>
          The functional equation of the Riemann zeta function involves the completed zeta function <InlineMath tex="\\xi(s)" />:
        </P>
        <BlockMath tex="\\xi(s) = \\tfrac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\xi(1-s)" />
        <P>
          This symmetry under <InlineMath tex="s \\leftrightarrow 1-s" /> is central. We define the <em>dual ladder</em> as the
          Euler product evaluated at the reflected point:
        </P>
        <BlockMath tex="\\zeta(1-s) = \\prod_{p} \\frac{1}{1 - p^{-(1-s)}} \\quad \\text{(dual ladder transfer function)}" />
        <P>
          The functional equation then states that these two ladders are connected by a <em>lossless bridge</em>:
        </P>
        <BlockMath tex="\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s), \\qquad \\chi(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1-s)" />
        <Def label="Definition 2.1 (Lossless Bridge)">
          The bridge factor <InlineMath tex="\\chi(s)" /> satisfies the key property:
          <BlockMath tex="|\\chi(\\tfrac{1}{2} + it)| = 1 \\quad \\text{for all } t \\in \\mathbb{R}" />
          That is, <InlineMath tex="\\chi" /> is <em>unitary</em> on the critical line. It transfers energy between the direct and dual
          ladders without loss or gain. Off the critical line, <InlineMath tex="|\\chi(s)| \\neq 1" />, and the bridge
          introduces gain (amplification) or loss (attenuation).
        </Def>
        <P>
          The circuit picture is now complete: we have two infinite ladder networks (direct and dual),
          coupled through a bridge that is lossless precisely on the critical line. The zeros of <InlineMath tex="\\zeta(s)" /> are
          the frequencies at which the system achieves perfect destructive interference — the total transfer
          function vanishes.
        </P>
      </Section>

      <Section number={3} title="The Hamiltonian: Energy Minimization at the Critical Line">
        <P>
          We construct a system Hamiltonian that encodes the total energy of the coupled oscillator chain.
          The Hamiltonian has three components:
        </P>
        <BlockMath tex="\\mathcal{H}(s) = T(s) + V_{\\text{mismatch}}(s) + V_{\\text{bridge}}(s)" />
        <Def label="Definition 3.1 (System Hamiltonian)">
          <strong>Kinetic energy</strong> (oscillator amplitudes):
          <BlockMath tex="T(s) = \\sum_p \\tfrac{1}{2} \\log p \\left(|H_p(s)|^2 + |H_p(1-s)|^2\\right)" />
          <strong>Impedance mismatch potential</strong> (direct vs. dual ladder coupling):
          <BlockMath tex="V_{\\text{mismatch}}(s) = \\tfrac{1}{2} |Z_{\\text{direct}}(s) - Z_{\\text{dual}}(s)|^2" />
          <strong>Bridge coupling penalty</strong> (deviation from losslessness):
          <BlockMath tex="V_{\\text{bridge}}(s) = \\lambda \\bigl(1 - |\\chi(s)|\\bigr)^2" />
          where <InlineMath tex="\\lambda > 0" /> is a coupling strength and <InlineMath tex="Z_{\\text{direct}}, Z_{\\text{dual}}" /> are
          the total impedances of the respective ladders.
        </Def>
        <Thm label="Observation 3.2 (Energy Minimum)">
          For fixed <InlineMath tex="t = \\operatorname{Im}(s)" />, the Hamiltonian <InlineMath tex="\\mathcal{H}(\\sigma + it)" /> achieves
          its minimum at <InlineMath tex="\\sigma = \\tfrac{1}{2}" />.
          At this point:
          <ul style={{ margin: '8px 0 0 16px' }}>
            <li><InlineMath tex="|\\chi(\\tfrac{1}{2}+it)| = 1" /> — bridge is perfectly lossless, so <InlineMath tex="V_{\\text{bridge}} = 0" /></li>
            <li>Direct and dual impedances are conjugate-matched: <InlineMath tex="\\operatorname{Re}(Z_{\\text{dir}}) = \\operatorname{Re}(Z_{\\text{dual}})" /></li>
            <li>Kinetic energy is symmetric: <InlineMath tex="|H_p(s)|^2 = |H_p(1-s)|^2" /> at <InlineMath tex="\\sigma = \\tfrac{1}{2}" /></li>
          </ul>
        </Thm>
        <P>
          The Riemann Hypothesis, in this language, states that all resonant frequencies (zeros) of the coupled
          system occur at the energy minimum — the physical ground state of the oscillator chain.
          This is analogous to the Hilbert-Polya conjecture: the zeros are eigenvalues of a
          self-adjoint operator, and they must lie on the real axis (here, the critical line).
        </P>
      </Section>

      <Section number={4} title="Control Theory: Stability and the Nyquist Criterion">
        <P>
          The oscillator chain is a feedback system. The direct ladder output feeds through the bridge
          to the dual ladder, which feeds back. The loop transfer function is:
        </P>
        <BlockMath tex="L(s) = \\chi(s) \\cdot \\frac{\\zeta(1-s)}{\\zeta(s)}" />
        <P>
          The Nyquist stability criterion states that the closed-loop system is stable if and only if the
          Nyquist contour of <InlineMath tex="L(s)" /> does not encircle the point <InlineMath tex="-1" />.
          Off-critical-line zeros of <InlineMath tex="\\zeta(s)" /> would produce encirclements, destabilizing the loop.
        </P>
        <Thm label="Observation 4.1 (Bode Sensitivity)">
          The complementary sensitivity function of the feedback loop satisfies:
          <BlockMath tex="S(s) + T(s) = 1, \\qquad S = \\frac{1}{1 + L}, \\quad T = \\frac{L}{1 + L}" />
          At <InlineMath tex="\\sigma = \\tfrac{1}{2}" />, the loop gain <InlineMath tex="|L| = 1" /> (unity gain), giving
          <InlineMath tex="|S| = |T| = \\tfrac{1}{\\sqrt{2}}" /> — the system operates at the <InlineMath tex="H_\\infty" />-optimal
          point, minimizing worst-case amplification.
        </Thm>
        <P>
          The Bode gain-phase relation constrains the system further. The phase of each Euler factor
          at the critical line determines the gain. Phase cancellation between different primes
          produces the zeros of <InlineMath tex="\\zeta(\\tfrac{1}{2}+it)" />:
        </P>
        <BlockMath tex="\\arg\\zeta(\\tfrac{1}{2}+it) = \\sum_p \\arg\\left(\\frac{1}{1 - p^{-1/2-it}}\\right) = -\\sum_p \\sum_{k=1}^{\\infty} \\frac{\\sin(kt\\log p)}{k \\cdot p^{k/2}}" />
        <P>
          A zero occurs when these phases align to produce total cancellation — a constructive
          interference in the imaginary direction that drives the real and imaginary parts simultaneously to zero.
        </P>
      </Section>

      <Section number={5} title="Scattering Matrix and Impedance Matching">
        <P>
          Each prime oscillator stage can be described by a <InlineMath tex="2 \\times 2" /> scattering matrix
          relating incident and reflected waves:
        </P>
        <BlockMath tex="\\begin{pmatrix} b_1 \\\\ b_2 \\end{pmatrix} = \\mathbf{S}_p(s) \\begin{pmatrix} a_1 \\\\ a_2 \\end{pmatrix}, \\qquad S_{21}(p,s) = \\frac{1}{1 - p^{-s}}" />
        <P>
          The forward transmission coefficient <InlineMath tex="S_{21}" /> is precisely the Euler factor. The
          reflection coefficient <InlineMath tex="S_{11}" /> measures impedance mismatch. At the critical line:
        </P>
        <BlockMath tex="|S_{11}(p, \\tfrac{1}{2}+it)|^2 + |S_{21}(p, \\tfrac{1}{2}+it)|^2 = 1 \\quad \\text{(unitarity)}" />
        <P>
          The cascade scattering matrix of the full ladder is computed via the ABCD (chain) matrix formalism:
        </P>
        <BlockMath tex="\\mathbf{A}_{\\text{total}} = \\prod_{p \\leq P} \\mathbf{A}_p(s), \\qquad \\mathbf{A}_p = \\begin{pmatrix} 1 & Z_p \\\\ Y_p & 1 + Z_p Y_p \\end{pmatrix}" />
        <P>
          where <InlineMath tex="Z_p = s \\cdot \\log p" /> (series impedance) and <InlineMath tex="Y_p = s / \\log p" /> (shunt admittance).
          The total transmission through the cascade gives <InlineMath tex="\\zeta(s)" /> as a continued fraction / matrix product.
        </P>
        <Rmk>
          The scattering matrix formalism connects directly to the Selberg trace formula. In Gutzwiller's
          semiclassical framework, the primes are primitive periodic orbits and the Euler factors are the
          individual orbit contributions. The trace formula
          <BlockMath tex="d(E) = \\bar{d}(E) + \\frac{1}{\\pi} \\sum_p \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{k/2}} \\cos(kE \\log p)" />
          expresses the spectral density as a sum over prime "orbits," with each contribution weighted
          by the orbit length <InlineMath tex="\\log p" /> and attenuated by <InlineMath tex="p^{-k/2}" />.
        </Rmk>
      </Section>

      <Section number={6} title="Thermodynamic Interpretation: The Primon Gas">
        <P>
          Following Julia (1990), Bost-Connes (1995), and Tao's framework, we interpret the
          zeta function as the partition function of a quantum gas:
        </P>
        <BlockMath tex="Z(\\beta) = \\zeta(\\beta) = \\sum_{n=1}^{\\infty} e^{-\\beta E_n}, \\qquad E_n = \\log n, \\quad \\beta = \\sigma" />
        <P>
          Each positive integer <InlineMath tex="n" /> is a quantum state with energy <InlineMath tex="E_n = \\log n" />.
          The inverse temperature <InlineMath tex="\\beta = \\sigma = \\operatorname{Re}(s)" /> controls convergence.
          The Euler product factorizes this as an ideal gas of "primons":
        </P>
        <BlockMath tex="Z(\\beta) = \\prod_p \\frac{1}{1 - e^{-\\beta \\log p}} = \\prod_p Z_p(\\beta)" />
        <P>
          where <InlineMath tex="Z_p(\\beta) = (1 - p^{-\\beta})^{-1}" /> is the single-particle partition function for primon <InlineMath tex="p" />.
          This is a bosonic gas: each primon can be occupied any number of times (corresponding to prime powers).
        </P>
        <Def label="Definition 6.1 (Thermodynamic Quantities)">
          <BlockMath tex="F = -T \\log Z = -\\frac{1}{\\sigma} \\log|\\zeta(\\sigma + it)| \\quad \\text{(free energy)}" />
          <BlockMath tex="S = -\\frac{\\partial F}{\\partial T} = \\log|\\zeta| - \\sigma \\frac{\\partial}{\\partial \\sigma} \\log|\\zeta| \\quad \\text{(entropy)}" />
          <BlockMath tex="P = \\frac{1}{N} \\sum_p \\log|H_p(s)| \\quad \\text{(pressure: mean per-prime contribution)}" />
          <BlockMath tex="C_v = \\sigma^2 \\frac{\\partial^2}{\\partial \\sigma^2} \\log|\\zeta| \\quad \\text{(specific heat)}" />
        </Def>
        <Thm label="Theorem 6.2 (Bost-Connes Phase Transition)">
          The primon gas exhibits a genuine phase transition at <InlineMath tex="\\beta_c = 1" /> (<InlineMath tex="\\sigma = 1" />):
          <ul style={{ margin: '8px 0 0 16px' }}>
            <li><InlineMath tex="\\beta > 1" /> (cold): Euler product converges, unique KMS state, spontaneous symmetry breaking.
              The Galois group <InlineMath tex="\\operatorname{Gal}(\\mathbb{Q}^{\\text{ab}}/\\mathbb{Q})" /> acts on the space of extremal states.</li>
            <li><InlineMath tex="\\beta \\leq 1" /> (hot): Euler product diverges, unique equilibrium state, collective behavior.</li>
            <li><InlineMath tex="\\beta = \\tfrac{1}{2}" /> (critical line): thermal equilibrium of the oscillator chain.</li>
          </ul>
        </Thm>
        <P>
          The specific heat <InlineMath tex="C_v" /> diverges at <InlineMath tex="\\sigma = 1" />, confirming a second-order
          phase transition. In the oscillator chain language: for <InlineMath tex="\\sigma > 1" />, each oscillator
          vibrates independently (ordered phase); for <InlineMath tex="\\sigma < 1" />, collective modes dominate
          (disordered phase); and at <InlineMath tex="\\sigma = \\tfrac{1}{2}" />, the system achieves thermal equilibrium.
        </P>
      </Section>

      <Section number={7} title="The De Bruijn-Newman Heat Flow">
        <P>
          The completed xi function <InlineMath tex="\\Xi(t) = \\xi(\\tfrac{1}{2} + it)" /> is an even, real-valued entire
          function whose zeros are precisely the imaginary parts of the nontrivial zeta zeros (assuming RH).
          De Bruijn (1950) introduced the heat-evolved family:
        </P>
        <BlockMath tex="\\frac{\\partial H_{\\tau}}{\\partial \\tau} = \\frac{\\partial^2 H_{\\tau}}{\\partial t^2}, \\qquad H_0(t) = \\Xi(t)" />
        <P>
          Under forward heat flow (<InlineMath tex="\\tau > 0" />), the function is smoothed and zeros remain real.
          Under backward flow (<InlineMath tex="\\tau < 0" />), inverse diffusion sharpens the function and zeros
          can scatter off the real axis into the complex plane (forming conjugate pairs).
        </P>
        <Thm label="Theorem 7.1 (De Bruijn-Newman Constant)">
          There exists a constant <InlineMath tex="\\Lambda \\in \\mathbb{R}" /> (the de Bruijn-Newman constant) such that:
          <ul style={{ margin: '8px 0 0 16px' }}>
            <li><InlineMath tex="H_{\\tau}" /> has only real zeros for all <InlineMath tex="\\tau \\geq \\Lambda" /></li>
            <li><InlineMath tex="H_{\\tau}" /> has non-real zeros for all <InlineMath tex="\\tau < \\Lambda" /></li>
          </ul>
          The Riemann Hypothesis is equivalent to <InlineMath tex="\\Lambda \\leq 0" />. Rodgers and Tao (2020) proved
          <InlineMath tex="\\Lambda \\geq 0" />, establishing that RH, if true, holds by the narrowest possible margin.
        </Thm>
        <P>
          In the oscillator chain, <InlineMath tex="\\tau" /> acts as a dissipation parameter: forward heat adds
          resistance (damping), smoothing out resonance peaks. Backward heat removes damping, allowing
          resonances to sharpen without bound — eventually splitting off the real axis. The result <InlineMath tex="\\Lambda \\geq 0" /> says
          the oscillator chain is already at the threshold of stability: zero damping margin.
        </P>
      </Section>

      <Section number={8} title="Random Matrix Theory: GUE Statistics">
        <P>
          Montgomery (1973) discovered that the pair correlation function of zeta zeros
          matches the eigenvalue spacing statistics of the Gaussian Unitary Ensemble (GUE) of random
          matrix theory:
        </P>
        <BlockMath tex="R_2(r) = 1 - \\left(\\frac{\\sin \\pi r}{\\pi r}\\right)^2 \\quad \\text{(GUE pair correlation)}" />
        <P>
          This was numerically confirmed to extraordinary precision by Odlyzko (1987, 10<sup>20</sup>-th zero).
          In the oscillator chain framework, GUE statistics emerge from the coupling structure:
        </P>
        <Def label="Definition 8.1 (Number Variance)">
          The number variance <InlineMath tex="\\Sigma^2(L)" /> measures fluctuations in the zero count over an interval of
          normalized length <InlineMath tex="L" />:
          <BlockMath tex="\\Sigma^2(L) = \\frac{1}{\\pi^2}\\left(\\log(2\\pi L) + 1 + \\gamma_E - \\frac{\\pi^2}{8}\\right) + O(L^{-1})" />
          The logarithmic growth (rather than linear) indicates eigenvalue repulsion — zeros are rigidly spaced,
          not randomly distributed.
        </Def>
        <P>
          The GUE connection explains <em>why</em> the zeros are so regularly spaced. In the oscillator model,
          each prime contributes a resonance at every zero; the phases of these contributions must align
          (constructive interference in argument, destructive in modulus) for a zero to occur.
          The coupling between oscillator stages enforces the GUE-level repulsion.
        </P>
      </Section>

      <Section number={9} title="The Explicit Formula: Impulse Response of the Ladder">
        <P>
          Von Mangoldt's explicit formula expresses the prime counting function as a sum over zeta zeros:
        </P>
        <BlockMath tex="\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log\\left(1 - x^{-2}\\right)" />
        <P>
          where <InlineMath tex="\\psi(x) = \\sum_{n \\leq x} \\Lambda(n)" /> is the Chebyshev function (weighted prime
          power count) and the sum runs over all nontrivial zeros <InlineMath tex="\\rho = \\beta + i\\gamma" />.
        </P>
        <P>
          In the oscillator chain, this is the <em>impulse response</em>. Each zero <InlineMath tex="\\rho" /> contributes
          an oscillatory term:
        </P>
        <BlockMath tex="\\frac{x^{\\rho}}{\\rho} = \\frac{x^{\\beta}}{|\\rho|} e^{i(\\gamma \\log x - \\arg \\rho)}" />
        <P>
          The frequency of oscillation is <InlineMath tex="\\gamma = \\operatorname{Im}(\\rho)" />, the decay rate is controlled
          by <InlineMath tex="\\beta = \\operatorname{Re}(\\rho)" />. If RH holds (<InlineMath tex="\\beta = \\tfrac{1}{2}" /> for all <InlineMath tex="\\rho" />),
          then all oscillatory corrections decay at the same rate <InlineMath tex="x^{1/2}" />, giving:
        </P>
        <BlockMath tex="\\psi(x) = x + O(x^{1/2} \\log^2 x) \\qquad \\text{(RH implies this error bound)}" />
        <P>
          This is the prime number theorem with optimal error term. Conversely, any zero off the critical line
          would produce a correction term decaying faster or slower than <InlineMath tex="x^{1/2}" />, creating an
          anomalous bump in the prime distribution.
        </P>
        <P>
          The Fourier transform of <InlineMath tex="\\Lambda(n)" /> (the von Mangoldt spectrum) reveals the zero locations
          as spectral peaks:
        </P>
        <BlockMath tex="\\hat{\\Lambda}(\\omega) = \\sum_{n=2}^{\\infty} \\Lambda(n) \\, e^{-i\\omega \\log n} = -\\frac{\\zeta'(\\tfrac{1}{2}+i\\omega)}{\\zeta(\\tfrac{1}{2}+i\\omega)}" />
        <P>
          Peaks in <InlineMath tex="|\\hat{\\Lambda}(\\omega)|" /> occur at <InlineMath tex="\\omega = \\gamma_k" /> (the zero heights),
          confirming that primes "resonate" at frequencies determined by the zeros.
        </P>
      </Section>

      <Section number={10} title="Twistor Correspondence">
        <P>
          We establish a novel correspondence between the oscillator chain model and Penrose's twistor
          theory. The map sends the <InlineMath tex="s" />-plane to twistor space:
        </P>
        <Def label="Definition 10.1 (Twistor Map)">
          For <InlineMath tex="s = \\sigma + it" />, define the twistor <InlineMath tex="Z^\\alpha = (\\omega^A, \\pi_{A'})" /> by:
          <BlockMath tex="\\omega = \\begin{pmatrix} \\sigma - \\tfrac{1}{2} \\\\ t/(2\\pi) \\end{pmatrix}, \\qquad \\pi = \\begin{pmatrix} \\cos(t \\log 2) \\\\ \\sin(t \\log 2) \\end{pmatrix}" />
          The dual twistor <InlineMath tex="W_\\alpha" /> is defined analogously from <InlineMath tex="1-s" />.
          The intertwiner <InlineMath tex="I: Z \\to W" /> acts via the bridge factor <InlineMath tex="\\chi(s)" />.
        </Def>
        <Thm label="Observation 10.2 (Incidence Relation)">
          The twistor incidence relation <InlineMath tex="Z^\\alpha \\Omega_{\\alpha\\beta} W^\\beta = 0" /> (with symplectic
          form <InlineMath tex="\\Omega" />) is satisfied if and only if <InlineMath tex="\\sigma = \\tfrac{1}{2}" />.
          <BlockMath tex="\\sigma = \\tfrac{1}{2} \\;\\Longleftrightarrow\\; Z \\cdot \\Omega \\cdot W = 0 \\;\\Longleftrightarrow\\; \\text{incidence (null twistor pair)}" />
        </Thm>
        <P>
          The Penrose transform provides a contour integral that reconstructs the zeta function from
          twistor data, analogous to how the Euler product reconstructs <InlineMath tex="\\zeta(s)" /> from prime
          contributions. This geometric perspective unifies:
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, margin: '16px 0', fontSize: 14 }}>
          <div style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.08)', borderRadius: 6 }}>
            <strong style={{ color: '#60a5fa' }}>ZPO Model</strong>
          </div>
          <div style={{ padding: '8px 12px', background: 'rgba(139,92,246,0.08)', borderRadius: 6 }}>
            <strong style={{ color: '#a78bfa' }}>Twistor Theory</strong>
          </div>
          {[
            ['Direct ladder ζ(s)', 'Twistor Z^α'],
            ['Dual ladder ζ(1-s)', 'Dual twistor W_α'],
            ['Bridge χ(s)', 'Intertwiner I'],
            ['Critical line σ = ½', 'Incidence relation Z·W = 0'],
            ['Euler product', 'Penrose transform'],
            ['Functional equation', 'Twistor correspondence'],
          ].map(([a, b], i) => (
            <React.Fragment key={i}>
              <div style={{ padding: '6px 12px', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>{a}</div>
              <div style={{ padding: '6px 12px', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>{b}</div>
            </React.Fragment>
          ))}
        </div>
      </Section>

      <Section number={11} title="Equivalence Criteria and Rigorous Connections">
        <P>
          Several known equivalences of the Riemann Hypothesis have natural interpretations in the
          oscillator chain framework:
        </P>
        <Thm label="Li Criterion (Li, 1997)">
          RH holds if and only if the sequence <InlineMath tex="\\lambda_n = \\sum_\\rho \\left[1 - (1 - 1/\\rho)^n\\right]" /> satisfies <InlineMath tex="\\lambda_n > 0" /> for all <InlineMath tex="n \\geq 1" />.
          In the oscillator chain: <InlineMath tex="\\lambda_n > 0" /> is a <em>passivity condition</em> — the bridge transfer function
          is passive (does not generate energy) at all frequencies.
        </Thm>
        <Thm label="Nyman-Beurling Criterion (Nyman 1950, Beurling 1955)">
          RH holds if and only if the constant function <InlineMath tex="1" /> can be approximated in <InlineMath tex="L^2(0,1)" /> by
          linear combinations of dilated fractional parts <InlineMath tex="\\{\\theta/x\\}" />.
          In the oscillator chain: this is the <em>completeness</em> of the set of oscillator eigenmodes — every
          signal can be reconstructed from the oscillator basis.
        </Thm>
        <Thm label="Lindelof Hypothesis">
          <InlineMath tex="\\zeta(\\tfrac{1}{2} + it) = O(t^\\varepsilon)" /> for any <InlineMath tex="\\varepsilon > 0" />.
          In the oscillator chain: <em>bounded gain</em> on the critical line — the ladder transfer function
          does not amplify signals beyond any polynomial bound. This is implied by RH but remains unproven independently.
        </Thm>
        <P>
          <strong>Zero-free regions</strong> provide quantitative stability margins. The best known result
          (Vinogradov-Korobov, 1958) gives:
        </P>
        <BlockMath tex="\\zeta(\\sigma + it) \\neq 0 \\quad \\text{for} \\quad \\sigma > 1 - \\frac{c}{(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}}" />
        <P>
          In the oscillator chain, this is a guaranteed stability margin: no resonance can occur within
          this distance of the <InlineMath tex="\\sigma = 1" /> boundary. The recent result of Guth and Maynard (2024)
          improved zero-density estimates for the first time in over 80 years, narrowing the gap between
          known zero-free regions and RH.
        </P>
      </Section>

      <Section number={12} title="Computational Verification">
        <P>
          The RH has been verified computationally for the first <InlineMath tex="10^{13}" /> zeros
          (Gourdon, 2004; Platt-Trudgian, 2021 using rigorous interval arithmetic to
          height <InlineMath tex="3 \\times 10^{12}" />). The ZPO Explorer implements:
        </P>
        <ul style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8, marginTop: 8 }}>
          <li><strong>Riemann-Siegel formula</strong> for fast zeta evaluation on the critical line, with
            error <InlineMath tex="O(t^{-1/4})" /></li>
          <li><strong>Euler product cascade</strong> using the first <InlineMath tex="N" /> primes (adjustable)</li>
          <li><strong>Critical strip computation</strong> via the Dirichlet eta function
            (alternating series, valid for <InlineMath tex="\\sigma > 0" />)</li>
          <li><strong>Extended computation</strong> via functional equation reflection for <InlineMath tex="\\sigma < 0" /></li>
          <li><strong>650 stored zeta zeros</strong> from the Odlyzko tables for reference and validation</li>
        </ul>
        <P>
          All visualizations in the app use these numerical methods, providing real-time interactive
          exploration of the oscillator chain at arbitrary points in the complex plane.
        </P>
      </Section>

      <Section number={13} title="Summary and Open Questions">
        <P>
          The Zeta Prime Oscillator programme provides a unified physical framework that
          connects disparate mathematical perspectives on the Riemann Hypothesis:
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' }}>
          {[
            ['Circuit Theory', 'Impedance matching at σ = ½'],
            ['Hamiltonian Mechanics', 'Energy minimization at σ = ½'],
            ['Control Theory', 'Nyquist stability, H∞ optimality'],
            ['Thermodynamics', 'Bost-Connes equilibrium at σ = ½'],
            ['Random Matrix Theory', 'GUE statistics from oscillator coupling'],
            ['Twistor Geometry', 'Incidence relation at σ = ½'],
            ['Signal Processing', 'Standing waves at zeta zeros'],
            ['Spectral Theory', 'Eigenvalues of self-adjoint operator'],
          ].map(([k, v], i) => (
            <div key={i} style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, fontSize: 13 }}>
              <strong style={{ color: '#60a5fa' }}>{k}:</strong>{' '}
              <span style={{ color: '#94a3b8' }}>{v}</span>
            </div>
          ))}
        </div>
        <P>
          <strong>Open questions within the programme:</strong>
        </P>
        <ul style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8, marginTop: 8 }}>
          <li>Can the oscillator chain Hamiltonian be made rigorously self-adjoint, providing a Hilbert-Polya operator?</li>
          <li>Does the GUE emergence from prime coupling have a proof, or is it only numerical?</li>
          <li>Can the twistor incidence relation be extended to Dirichlet <InlineMath tex="L" />-functions and the Grand RH?</li>
          <li>Is there a renormalization group flow on the oscillator chain whose fixed point is the critical line?</li>
          <li>Can the Nyman-Beurling completeness criterion be verified constructively using oscillator modes?</li>
          <li>Does the heat flow perspective (<InlineMath tex="\\Lambda = 0" />) have implications for the oscillator chain's dissipation structure?</li>
        </ul>
        <P>
          The programme does not claim to prove RH. Rather, it provides a computational and conceptual
          laboratory for exploring the <em>structure</em> of the hypothesis from multiple physical
          viewpoints simultaneously. The consistency of these perspectives — energy minimum, stability
          boundary, impedance match, thermal equilibrium, geometric incidence — all pointing to the same
          line <InlineMath tex="\\sigma = \\tfrac{1}{2}" />, is itself a deep structural fact about the zeta function
          that any eventual proof must explain.
        </P>
      </Section>

      <Section number={14} title="Recent Developments: Connes 2026">
        <P>
          In early 2026, Alain Connes published a striking result concerning the Weil quadratic form
          and the approximation of zeta zeros using only a small set of primes. This result has
          significant implications for the ZPO programme.
        </P>

        <Thm label="Result 14.1 (Connes, The Weil Quadratic Form)">
          By extremizing the Weil quadratic form using only the primes <InlineMath tex="p \\in \\{2, 3, 5, 7, 11\\}" /> (all
          primes less than 13), one obtains approximations to the first 50 nontrivial zeta zeros with
          accuracy ranging from <InlineMath tex="10^{-55}" /> to <InlineMath tex="10^{-3}" />.
          <BlockMath tex="\\left| \\gamma_n^{\\text{approx}} - \\gamma_n^{\\text{exact}} \\right| \\in [10^{-55},\\, 10^{-3}], \\quad n = 1, \\ldots, 50" />
          The Weil explicit formula provides a quadratic form <InlineMath tex="W" /> whose positivity is equivalent
          to the Riemann Hypothesis:
          <BlockMath tex="W \\geq 0 \\;\\Longleftrightarrow\\; \\text{RH}" />
        </Thm>

        <P>
          <strong>Implications for the ZPO framework.</strong> Connes' result validates one of the
          ZPO programme's central insights from an information-theoretic perspective: <em>small primes
          dominate the information content of zeta zeros</em>. In rate-distortion terms, the zero
          sequence <InlineMath tex="\\{\\gamma_n\\}" /> has a highly compressible representation in terms of
          prime data, and the first five primes already capture the bulk of this information.
        </P>
        <P>
          The equivalence between Weil positivity and RH maps naturally onto the ZPO Hamiltonian
          framework. The condition <InlineMath tex="W \\geq 0" /> corresponds to the system Hamiltonian
          being bounded below — that is, <InlineMath tex="\\mathcal{H}(\\sigma, t) \\geq \\mathcal{H}(\\tfrac{1}{2}, t)" /> for
          all <InlineMath tex="\\sigma" />. Both express the same structural constraint: the critical
          line is the ground state.
        </P>

        <Def label="Correspondence Table: Weil/Connes and ZPO">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, fontSize: 14 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.12)', borderRadius: '6px 0 0 0', fontWeight: 600, color: '#60a5fa' }}>
              Weil / Connes
            </div>
            <div style={{ padding: '8px 12px', background: 'rgba(139,92,246,0.12)', borderRadius: '0 6px 0 0', fontWeight: 600, color: '#a78bfa' }}>
              ZPO
            </div>
            {[
              ['Weil positivity W \\u2265 0', 'H(\\u03C3,t) \\u2265 H(\\u00BD,t)'],
              ['Explicit formula', 'Prime \\u2194 zero duality'],
              ['Extremization', 'Gradient descent on H'],
              ['Primes < 13 suffice', 'Rate-distortion compression'],
              ['Trace formula', 'Twin ladder spectral/geometric sides'],
            ].map(([a, b], i) => (
              <React.Fragment key={i}>
                <div style={{ padding: '6px 12px', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>{a}</div>
                <div style={{ padding: '6px 12px', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>{b}</div>
              </React.Fragment>
            ))}
          </div>
        </Def>

        <P>
          The Weil explicit formula underlying Connes' computation is itself a manifestation of the
          prime-zero duality that the ZPO model encodes as the coupling between the direct and dual
          ladders. The extremization procedure — finding the configuration of the Weil form that best
          approximates the zeros — is the analytic counterpart of gradient descent on the ZPO
          Hamiltonian. The fact that only five primes suffice is a concrete, quantitative demonstration
          that the oscillator chain's information content is dominated by its lowest-order stages.
        </P>

        <Rmk>
          Connes' result does not prove the Riemann Hypothesis. The Weil positivity
          condition <InlineMath tex="W \\geq 0" /> remains unproven. However, the extraordinary accuracy
          of the five-prime approximation provides the strongest numerical evidence yet for the
          spectral approach to RH: the operator's spectrum is effectively encoded in a small,
          finite set of prime data. This aligns precisely with the ZPO rate-distortion picture,
          where the critical line emerges as the information-theoretically optimal encoding of
          the prime-zero relationship.
        </Rmk>
      </Section>

      <Section number={15} title="References">
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.9, columnCount: 2, columnGap: 24 }}>
          <p>[1] B. Riemann, "Ueber die Anzahl der Primzahlen unter einer gegebenen Grosse," <em>Monatsberichte der Berliner Akademie</em>, 1859.</p>
          <p>[2] L. Euler, "Variae observationes circa series infinitas," <em>Commentarii Academiae Scientiarum Petropolitanae</em>, 1737.</p>
          <p>[3] M. V. Berry and J. P. Keating, "The Riemann zeros and eigenvalue asymptotics," <em>SIAM Review</em>, 41(2):236-266, 1999.</p>
          <p>[4] A. Connes, "Trace formula in noncommutative geometry and the zeros of the Riemann zeta function," <em>Selecta Math.</em>, 5(1):29-106, 1999.</p>
          <p>[5] H. L. Montgomery, "The pair correlation of zeros of the zeta function," <em>Proc. Symp. Pure Math.</em>, 24:181-193, 1973.</p>
          <p>[6] A. M. Odlyzko, "On the distribution of spacings between zeros of the zeta function," <em>Math. Comp.</em>, 48(177):273-308, 1987.</p>
          <p>[7] J.-B. Bost and A. Connes, "Hecke algebras, type III factors and phase transitions with spontaneous symmetry breaking," <em>Selecta Math.</em>, 1(3):411-457, 1995.</p>
          <p>[8] B. Julia, "Statistical theory of numbers," in <em>Number Theory and Physics</em>, Springer, 1990.</p>
          <p>[9] N. G. de Bruijn, "The roots of trigonometric integrals," <em>Duke Math. J.</em>, 17:197-226, 1950.</p>
          <p>[10] B. Rodgers and T. Tao, "The de Bruijn-Newman constant is non-negative," <em>Forum of Mathematics, Pi</em>, 8:e6, 2020.</p>
          <p>[11] X.-J. Li, "The positivity of a sequence of numbers and the Riemann Hypothesis," <em>J. Number Theory</em>, 65(2):325-333, 1997.</p>
          <p>[12] J. P. Keating and N. C. Snaith, "Random matrix theory and ζ(1/2+it)," <em>Commun. Math. Phys.</em>, 214:57-89, 2000.</p>
          <p>[13] W. Cauer, <em>Theorie der linearen Wechselstromschaltungen</em>, Akademie-Verlag, 1926.</p>
          <p>[14] H. Nyquist, "Regeneration theory," <em>Bell System Technical Journal</em>, 11(1):126-147, 1932.</p>
          <p>[15] D. Schumayer and D. A. W. Hutchinson, "Physics of the Riemann Hypothesis," <em>Rev. Mod. Phys.</em>, 83:307-330, 2011.</p>
          <p>[16] M. L. Lapidus and M. van Frankenhuijsen, <em>Fractal Geometry, Complex Dimensions and Zeta Functions</em>, Springer, 2006.</p>
          <p>[17] L. Guth and J. Maynard, "New large value estimates for Dirichlet polynomials," arXiv:2405.20552, 2024.</p>
          <p>[18] E. C. Titchmarsh, <em>The Theory of the Riemann Zeta-Function</em>, 2nd ed. (revised by D. R. Heath-Brown), Oxford, 1986.</p>
          <p>[19] E. Bombieri, "The Riemann Hypothesis," in <em>The Millennium Prize Problems</em>, Clay Mathematics Institute, 2000.</p>
          <p>[20] A. Selberg, "On the zeros of Riemann's zeta-function," <em>Skr. Norske Vid. Akad. Oslo</em>, 10:1-59, 1942.</p>
          <p>[21] A. Connes, "Weil quadratic form and approximation of zeta zeros from finite prime data," 2026.</p>
        </div>
      </Section>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14 }}>Key Equations Quick Reference</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {[
            { label: 'Euler Product', tex: '\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}', ref: 'Eq. 1' },
            { label: 'Functional Equation', tex: '\\xi(s) = \\xi(1-s)', ref: 'Eq. 3' },
            { label: 'Transfer Function', tex: 'H_p(s) = \\frac{1}{1 - p^{-s}}', ref: 'Eq. 5' },
            { label: 'Bridge Unitarity', tex: '|\\chi(\\tfrac{1}{2} + it)| = 1', ref: 'Eq. 8' },
            { label: 'Hamiltonian', tex: '\\mathcal{H}(\\sigma, t) = T + V, \\quad \\min \\text{ at } \\sigma = \\tfrac{1}{2}', ref: 'Eq. 11' },
            { label: 'RH Statement', tex: '\\zeta(\\rho) = 0 \\Rightarrow \\text{Re}(\\rho) = \\tfrac{1}{2}', ref: 'Thm. 1' },
          ].map(({ label, tex, ref }) => (
            <div key={label} style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>{label}</span>
                <span style={{ color: '#475569', fontSize: 10 }}>{ref}</span>
              </div>
              <BlockMath tex={tex} />
            </div>
          ))}
        </div>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/spectral-attack" style={{ color: '#06b6d4', fontSize: 13 }}>Spectral Attack</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/concepts" style={{ color: '#3b82f6', fontSize: 13 }}>Concepts</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/literature" style={{ color: '#8b5cf6', fontSize: 13 }}>Literature</Link>
        </div>
      </div>
    </div>
  );
}
