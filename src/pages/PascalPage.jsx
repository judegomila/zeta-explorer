import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PascalZetaViz from '../components/PascalZetaViz.jsx';

export default function PascalPage() {
  return (
    <div className="page">
      <h1>Pascal's Triangle &amp; the Zeta Function</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 720, marginBottom: 32 }}>
        Pascal's triangle encodes <InlineMath tex={"e"} />, <InlineMath tex={"\\pi"} />, and — through
        Euler's identity — the imaginary unit <InlineMath tex={"i"} />. Via the Hasse–Sondow formula,
        it also computes the Riemann zeta function <InlineMath tex={"\\zeta(s)"} /> directly from
        binomial coefficients.
      </p>

      <div className="card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>The Three Constants</h2>

        <h3 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          Euler's Number from Row Products (Brothers, 2012)
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          Let <InlineMath tex={"s_n = \\prod_{k=0}^{n} \\binom{n}{k}"} /> be the product of all entries in row <InlineMath tex={"n"} />.
          Then the ratio of adjacent row products converges to <InlineMath tex={"e"} />:
        </p>
        <BlockMath tex={"\\lim_{n\\to\\infty} \\frac{s_{n-1}\\cdot s_{n+1}}{s_n^2} = e"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          This is equivalent to <InlineMath tex={"(1 + 1/n)^n \\to e"} /> but expressed entirely through
          the multiplicative structure of Pascal's triangle.
        </p>

        <h3 style={{ color: '#f59e0b', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          Pi from Central Binomial Coefficients
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          The central binomials <InlineMath tex={"\\binom{2n}{n}"} /> — the middle entry of each even row — encode <InlineMath tex={"\\pi"} />:
        </p>
        <BlockMath tex={"\\pi = \\lim_{n\\to\\infty} \\frac{4^{2n}}{n\\,\\binom{2n}{n}^2}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          This follows from Stirling's approximation of the central binomial. An alternative series representation uses{' '}
          <InlineMath tex={"\\arcsin"} />:
        </p>
        <BlockMath tex={"\\frac{\\pi}{2} = \\sum_{n=0}^{\\infty} \\frac{\\binom{2n}{n}}{4^n(2n+1)}"} />

        <h3 style={{ color: '#ec4899', fontSize: 15, fontWeight: 600, marginBottom: 8, marginTop: 20 }}>
          The Imaginary Unit via Euler's Identity
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          Having extracted <InlineMath tex={"e"} /> and <InlineMath tex={"\\pi"} /> from Pascal's triangle,
          Euler's identity immediately yields <InlineMath tex={"i"} />:
        </p>
        <BlockMath tex={"e^{i\\pi} = -1 \\quad\\Longrightarrow\\quad i = \\frac{\\log(-1)}{\\pi}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          All three fundamental constants — <InlineMath tex={"e"} />,{' '}
          <InlineMath tex={"\\pi"} />, <InlineMath tex={"i"} /> — are therefore encoded in the binomial
          coefficients of Pascal's triangle.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          The Hasse–Sondow Formula: &#950;(s) from Pascal's Triangle
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Helmut Hasse (1930) discovered that the Riemann zeta function can be computed as a
          doubly-weighted sum over Pascal's triangle. Jonathan Sondow later refined and popularized
          this representation:
        </p>
        <BlockMath tex={"\\zeta(s) = \\frac{1}{1-2^{1-s}} \\sum_{n=0}^{\\infty} \\frac{1}{2^{n+1}} \\sum_{k=0}^{n} (-1)^k \\binom{n}{k} (k+1)^{-s}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          The inner sum is the <InlineMath tex={"n"} />-th forward difference of{' '}
          <InlineMath tex={"f(k) = (k+1)^{-s}"} />, weighted by row <InlineMath tex={"n"} /> of
          Pascal's triangle with alternating signs. The outer sum applies geometric damping{' '}
          <InlineMath tex={"2^{-(n+1)}"} /> to each row's contribution.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8 }}>
          Why This Matters for the ZPO Model
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          In the oscillator chain framework, each Pascal row acts as a "decorating filter" — row <InlineMath tex={"n"} />'s
          binomial coefficients weight the Dirichlet terms <InlineMath tex={"(k+1)^{-s}"} />, creating a
          row-weighted Dirichlet polynomial:
        </p>
        <BlockMath tex={"Z_N(s) = \\sum_{k=0}^{N} \\binom{N}{k}(k+1)^{-s}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Each <InlineMath tex={"Z_N"} /> is a partial "decoration" of the zeta function. As <InlineMath tex={"N \\to \\infty"} />,
          the alternating, damped sum of these decorations converges to <InlineMath tex={"\\zeta(s)"} /> everywhere
          in the complex plane (except at the pole <InlineMath tex={"s = 1"} />).
        </p>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Correspondence Table</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Pascal's Triangle</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Zeta / ZPO Model</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Row products sₙ', "Brothers' convergence to e"],
                ['Central binomials C(2n,n)', 'Pi via Wallis-type formula'],
                ['e and π together', 'Euler identity gives i = log(−1)/π'],
                ['Alternating row sums', 'Forward differences of (k+1)⁻ˢ'],
                ['Binomial coefficients C(n,k)', 'Hasse–Sondow weights for ζ(s)'],
                ['Geometric damping 2⁻⁽ⁿ⁺¹⁾', 'Row-by-row convergence acceleration'],
                ['Row-weighted Dirichlet Z_N(s)', 'Single-row "decoration" of zeta'],
                ['Full Hasse sum', 'Analytic continuation of ζ(s)'],
              ].map(([pascal, zeta], i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(42,48,80,0.5)' }}>
                  <td style={{ padding: '8px 12px', color: '#f59e0b', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{pascal}</td>
                  <td style={{ padding: '8px 12px', color: '#3b82f6', fontSize: 13 }}>{zeta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PascalZetaViz />

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#06b6d4' }}>
          Pascal's Triangle and Prime Oscillator Coupling
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          The binomial structure of Pascal's triangle appears naturally in the ZPO framework
          when expanding the explicit formula and connecting to the Li coefficients. Here we trace
          three threads linking Pascal's triangle to the oscillator chain.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6', marginBottom: 8 }}>
          Binomial Coefficients in the Explicit Formula
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The explicit formula for the prime counting function involves a sum over zeta zeros.
          When expanding <InlineMath tex={"x^\\rho / \\rho"} /> in powers
          of <InlineMath tex={"\\log x"} />, binomial coefficients appear as the combinatorial weights
          in the Taylor expansion:
        </p>
        <BlockMath tex={"\\frac{x^\\rho}{\\rho} = \\frac{e^{\\rho \\log x}}{\\rho} = \\frac{1}{\\rho} \\sum_{k=0}^{\\infty} \\frac{(\\rho \\log x)^k}{k!} = \\frac{1}{\\rho} \\sum_{k=0}^{\\infty} \\binom{k+m-1}{m-1} \\cdot (\\text{oscillator modes})"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
          The binomial weights determine how strongly each oscillator mode couples to the prime
          counting function at different scales.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', marginBottom: 8 }}>
          Pascal Row Sums and the Moment Generating Function
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The row sums of Pascal's triangle are <InlineMath tex={"\\sum_k \\binom{n}{k} = 2^n"} />.
          In the Hasse-Sondow formula, each row contributes a "moment" of the zeta function.
          The generating function for these moments is the moment generating function (MGF) of zeta,
          which encodes the statistical distribution of prime oscillator frequencies:
        </p>
        <BlockMath tex={"M_\\zeta(t) = \\sum_{n=0}^{\\infty} \\frac{t^n}{2^{n+1}} \\sum_{k=0}^{n} (-1)^k \\binom{n}{k} (k+1)^{-s} = \\frac{(1-2^{1-s})\\,\\zeta(s)}{1}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
          The Pascal row sum <InlineMath tex={"2^n"} /> controls the rate at which higher-order moments
          grow, creating the geometric damping that ensures convergence of the Hasse representation.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8 }}>
          Connection to Li Coefficients
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The Li coefficients <InlineMath tex={"\\lambda_n"} />, which are non-negative if and only
          if RH holds, connect to Pascal's triangle through the zero-sum representation.
          Expanding <InlineMath tex={"(1-1/\\rho)^n"} /> via the binomial theorem:
        </p>
        <BlockMath tex={"\\lambda_n = \\sum_{\\rho} \\left[1 - \\left(1 - \\frac{1}{\\rho}\\right)^{\\!n}\\right] = \\sum_{k=1}^{n} \\binom{n}{k} (-1)^{k+1} \\sum_{\\rho} \\rho^{-k}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          The binomial coefficients <InlineMath tex={"\\binom{n}{k}"} /> from row <InlineMath tex={"n"} /> of
          Pascal's triangle weight the power sums <InlineMath tex={"\\sum_\\rho \\rho^{-k}"} /> over zeta
          zeros — each power sum probing a different "angular momentum mode" of the oscillator chain.
          This binomial structure ensures that the Li criterion tests passivity across
          all modes simultaneously, weighted by the universal combinatorial coefficients
          of Pascal's triangle.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#10b981' }}>
          Pascal's Triangle mod p and Per-Prime Oscillator Harmonics
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          When Pascal's triangle is reduced modulo a prime <InlineMath tex={"p"} />, it reveals a
          striking self-similar fractal structure governed by Lucas' theorem. This fractal pattern
          connects directly to the harmonic structure of the per-prime oscillators in the ZPO
          twin-ladder model.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#10b981', marginBottom: 8 }}>
          Lucas' Theorem and Base-p Digit Structure
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          Lucas' theorem states that the binomial coefficient modulo <InlineMath tex={"p"} /> factors
          according to the base-<InlineMath tex={"p"} /> digits of the row and column indices:
        </p>
        <BlockMath tex={"\\binom{n}{k} \\equiv \\prod_{i=0}^{m} \\binom{n_i}{k_i} \\pmod{p}, \\quad \\text{where } n = \\sum n_i p^i,\\; k = \\sum k_i p^i"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          A binomial coefficient <InlineMath tex={"\\binom{n}{k}"} /> is nonzero mod <InlineMath tex={"p"} /> if and only
          if every base-<InlineMath tex={"p"} /> digit of <InlineMath tex={"k"} /> is less than or equal to
          the corresponding digit of <InlineMath tex={"n"} />. This creates the fractal pattern visible
          when coloring nonzero entries.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#10b981', marginBottom: 8, marginTop: 16 }}>
          Per-Prime Harmonic Frequencies
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          In the ZPO model, each prime <InlineMath tex={"p"} /> contributes an oscillator with
          fundamental frequency <InlineMath tex={"\\omega_p = \\log p"} />. The harmonics of this
          oscillator occur at integer multiples <InlineMath tex={"k \\cdot \\log p = \\log(p^k)"} />,
          corresponding to the powers of <InlineMath tex={"p"} />. The Euler factor expansion makes
          this explicit:
        </p>
        <BlockMath tex={"\\frac{1}{1 - p^{-s}} = \\sum_{k=0}^{\\infty} p^{-ks} = \\sum_{k=0}^{\\infty} e^{-ks\\log p}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The <InlineMath tex={"k"} />-th harmonic of the <InlineMath tex={"p"} />-oscillator has
          amplitude <InlineMath tex={"p^{-k\\sigma}"} /> and phase <InlineMath tex={"e^{-ikt\\log p}"} />.
          Pascal's triangle mod <InlineMath tex={"p"} /> encodes the combinatorial structure of
          how these harmonics interact: the nonzero entries in row <InlineMath tex={"n"} /> mod <InlineMath tex={"p"} /> tell us
          which combinations of <InlineMath tex={"p"} />-adic digits are "active" at scale <InlineMath tex={"n"} />.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#10b981', marginBottom: 8, marginTop: 16 }}>
          Self-Similarity and the Oscillator Cascade
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The fractal in Pascal mod <InlineMath tex={"p"} /> has a self-similarity ratio
          of <InlineMath tex={"p"} />: zooming in by a factor of <InlineMath tex={"p"} /> reveals an identical
          copy of the full pattern. This mirrors the ZPO oscillator cascade: the <InlineMath tex={"p"} />-oscillator's
          contribution repeats at scales <InlineMath tex={"p, p^2, p^3, \\ldots"} />, each level a
          geometrically attenuated copy of the fundamental. The density of nonzero entries in Pascal
          mod <InlineMath tex={"p"} /> through row <InlineMath tex={"p^m - 1"} /> is:
        </p>
        <BlockMath tex={"d_p(m) = \\left(\\frac{p+1}{2p}\\right)^m \\xrightarrow{m \\to \\infty} 0"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The rate of density decay is governed by <InlineMath tex={"(p+1)/(2p)"} />, which is closer
          to <InlineMath tex={"1"} /> for large primes and equals <InlineMath tex={"3/4"} /> for <InlineMath tex={"p = 2"} />.
          In the ZPO framework, this corresponds to the fact that higher primes contribute more
          slowly decaying harmonics (their oscillators are "less damped"), while <InlineMath tex={"p = 2"} /> — the
          most aggressive fractal — produces the strongest harmonic attenuation.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#10b981', marginBottom: 8, marginTop: 16 }}>
          Multi-Prime Interference and the Full Zeta Function
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          The full zeta function arises from the simultaneous action of all per-prime oscillators.
          In Pascal's triangle, the binomial coefficients can be decomposed via the Chinese Remainder
          Theorem into their residues modulo each prime. The Hasse-Sondow formula then decomposes
          as a product of per-prime contributions, each shaped by the fractal structure of Pascal
          mod <InlineMath tex={"p"} />:
        </p>
        <BlockMath tex={"\\binom{n}{k} = 0 \\pmod{p} \\;\\Longleftrightarrow\\; \\text{some digit of } k \\text{ exceeds the corresponding digit of } n \\text{ in base } p"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          The zeros in Pascal mod <InlineMath tex={"p"} /> represent positions where the <InlineMath tex={"p"} />-oscillator
          is "silent" — its harmonic does not contribute to the Hasse weight at that position.
          The interference pattern of these silences across all primes simultaneously determines
          which terms in the Dirichlet series survive and shapes the analytic structure
          of <InlineMath tex={"\\zeta(s)"} />.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#8b5cf6' }}>
          Sierpinski Pattern in Pascal mod 2 and Binary Euler Factors
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          The most familiar fractal in Pascal's triangle is the <strong>Sierpinski triangle</strong>,
          obtained by coloring odd entries. This binary pattern — where <InlineMath tex={"\\binom{n}{k}"} /> is
          odd if and only if the binary digits of <InlineMath tex={"k"} /> are "contained in" those
          of <InlineMath tex={"n"} /> — has a deep connection to the binary (base-2) structure of the
          Euler product for the Riemann zeta function.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8 }}>
          Kummer's Theorem and Carry-Free Addition
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          Kummer's theorem states that the highest power of <InlineMath tex={"p"} /> dividing <InlineMath tex={"\\binom{n}{k}"} /> equals
          the number of carries when adding <InlineMath tex={"k"} /> and <InlineMath tex={"n - k"} /> in base <InlineMath tex={"p"} />.
          For <InlineMath tex={"p = 2"} />:
        </p>
        <BlockMath tex={"\\binom{n}{k} \\text{ is odd} \\;\\Longleftrightarrow\\; k \\,\\texttt{AND}\\, (n-k) = 0 \\;\\Longleftrightarrow\\; k \\,\\texttt{OR}\\, (n-k) = n \\;\\;\\text{(no binary carries)}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The Sierpinski pattern emerges because carry-free addition in binary is equivalent to
          independent bit selection, giving the pattern its multiplicative (fractal) structure.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8, marginTop: 16 }}>
          The 2-Euler Factor and Binary Decomposition
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The Euler factor for <InlineMath tex={"p = 2"} /> is the "first rung" of the ZPO ladder and has
          the simplest harmonic structure:
        </p>
        <BlockMath tex={"\\frac{1}{1 - 2^{-s}} = 1 + 2^{-s} + 4^{-s} + 8^{-s} + \\cdots = \\sum_{k=0}^{\\infty} 2^{-ks}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          Every positive integer <InlineMath tex={"n"} /> has a unique binary representation
          <InlineMath tex={"n = \\sum_{j} 2^{a_j}"} />. The Euler product's multiplicative structure means
          that <InlineMath tex={"n^{-s}"} /> in the Dirichlet series arises from selecting one term from
          each prime's geometric series. The binary digits of <InlineMath tex={"n"} /> determine
          which terms are selected from the 2-factor:
        </p>
        <BlockMath tex={"n^{-s} = \\prod_{p \\text{ prime}} p^{-v_p(n) s}, \\quad v_2(n) = \\text{(power of 2 dividing } n\\text{)}"} />

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8, marginTop: 16 }}>
          Sierpinski as Binary Selection Map
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The Sierpinski triangle in Pascal mod 2 can be interpreted as a <em>selection map</em> for
          the binary Euler factor. Each row <InlineMath tex={"n"} /> of Pascal's triangle, reduced mod 2,
          indicates which of the <InlineMath tex={"n + 1"} /> Dirichlet terms <InlineMath tex={"(k+1)^{-s}"} /> in the
          Hasse formula receive nonzero binomial weight from the 2-adic perspective:
        </p>
        <BlockMath tex={"\\binom{n}{k} \\not\\equiv 0 \\pmod{2} \\;\\Longleftrightarrow\\; \\text{term } (k+1)^{-s} \\text{ is 2-adically active in row } n"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The number of active terms in row <InlineMath tex={"n"} /> is <InlineMath tex={"2^{s_2(n)}"} />, where <InlineMath tex={"s_2(n)"} /> is
          the number of 1-bits in the binary expansion of <InlineMath tex={"n"} />. Rows whose index is
          a power of 2 (<InlineMath tex={"n = 2^m"} />) have exactly two active entries (the first and last),
          corresponding to the minimal "binary skeleton" of that Hasse-Sondow layer.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8, marginTop: 16 }}>
          Connection to the ZPO Twin Ladder
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          In the ZPO twin-ladder model, the 2-oscillator sits at the top of the cascade (lowest
          prime, highest frequency <InlineMath tex={"\\omega_2 = \\log 2"} />). The Sierpinski structure
          shows that this oscillator's contribution to the Hasse representation has a fundamentally
          binary, self-similar organization. Each "level" of the Sierpinski triangle corresponds to
          a power-of-2 scale in the oscillator cascade:
        </p>
        <BlockMath tex={"\\text{Level } m: \\;\\; \\text{rows } 2^m \\leq n < 2^{m+1}, \\quad \\text{2-oscillator harmonic scale } \\sim 2^{-ms}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
          The self-similarity ratio of the Sierpinski triangle is 2, matching the base of the
          2-Euler factor. For the dual ladder, the same fractal structure appears under the
          substitution <InlineMath tex={"s \\to 1 - s"} />, reflecting the functional equation. At the
          critical line <InlineMath tex={"\\sigma = 1/2"} />, the direct and dual Sierpinski patterns
          are perfectly "balanced" — each nonzero entry in Pascal mod 2 contributes equally to
          both ladders, consistent with the unitarity of the bridge at <InlineMath tex={"\\sigma = 1/2"} />.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8, marginTop: 16 }}>
          Generalization: Sierpinski-type Fractals for All Primes
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Reducing Pascal's triangle modulo any prime <InlineMath tex={"p"} /> yields a generalized
          Sierpinski fractal with self-similarity ratio <InlineMath tex={"p"} />. The Hausdorff dimension of
          the nonzero entries is:
        </p>
        <BlockMath tex={"d_H(p) = \\frac{\\log\\!\\binom{p+1}{2}}{\\log p} = \\frac{\\log\\bigl(p(p+1)/2\\bigr)}{\\log p}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          For <InlineMath tex={"p = 2"} />, this gives <InlineMath tex={"d_H = \\log 3 / \\log 2 \\approx 1.585"} />,
          the classical Sierpinski dimension. Each prime's fractal dimension encodes the "complexity"
          of that oscillator's harmonic contribution to the Hasse-Sondow representation. The full
          Euler product <InlineMath tex={"\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}"} /> emerges from the
          simultaneous overlay of all these per-prime fractal patterns, each operating at its own
          characteristic scale and self-similarity ratio.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Key Insights</h2>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            Pascal's triangle is a <strong style={{ color: '#e2e8f0' }}>universal encoder</strong> of
            the constants <InlineMath tex={"e"} />, <InlineMath tex={"\\pi"} />, and <InlineMath tex={"i"} /> — the
            three pillars of Euler's identity <InlineMath tex={"e^{i\\pi}+1=0"} />.
          </li>
          <li>
            The Hasse–Sondow formula shows that <InlineMath tex={"\\zeta(s)"} /> is literally a{' '}
            <strong style={{ color: '#e2e8f0' }}>weighted sum over Pascal's triangle</strong> — each
            row contributes a forward-difference approximation that improves convergence.
          </li>
          <li>
            Row-weighted Dirichlet polynomials <InlineMath tex={"Z_N(s)"} /> grow exponentially for
            small <InlineMath tex={"\\sigma"} />, reflecting the pole at <InlineMath tex={"s=1"} /> and
            the need for alternating signs to achieve cancellation.
          </li>
          <li>
            In the ZPO ladder model, the Hasse formula provides an alternative to the Euler product —
            instead of one factor per prime, we get one factor per Pascal row, with binomial
            "decorations" replacing prime frequencies.
          </li>
          <li>
            The connection to <InlineMath tex={"i"} /> via Euler's identity means the imaginary axis of
            the critical strip — where zeta zeros live — is itself encoded in Pascal's triangle
            through <InlineMath tex={"i = \\log(-1)/\\pi"} />.
          </li>
          <li>
            Pascal's triangle mod <InlineMath tex={"p"} /> reveals a <strong style={{ color: '#e2e8f0' }}>per-prime fractal</strong> whose
            self-similarity ratio <InlineMath tex={"p"} /> matches the base of the corresponding Euler
            factor, linking the combinatorial structure of binomials to the harmonic structure of
            each ZPO oscillator.
          </li>
          <li>
            The <strong style={{ color: '#e2e8f0' }}>Sierpinski triangle</strong> (Pascal mod 2) acts as a binary
            selection map for the 2-Euler factor, with its carry-free addition rule mirroring the
            multiplicative independence of Euler factors in the Dirichlet series.
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 24, background: 'rgba(245,158,11,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/zx-calculus" style={{ color: '#f59e0b', fontSize: 13 }}>ZX-Calculus</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/oscillators" style={{ color: '#f59e0b', fontSize: 13 }}>Prime Resonators</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/fourier" style={{ color: '#f59e0b', fontSize: 13 }}>Frequency Domain</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/odd-zeta" style={{ color: '#f59e0b', fontSize: 13 }}>Odd Zeta Values</Link>
        </div>
      </div>
    </div>
  );
}
