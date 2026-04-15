import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import FourierDomainViz from '../components/FourierDomainViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';

// Returns the von Mangoldt function value for integer n >= 2.
// Lambda(n) = log(p) if n = p^k for some prime p, else 0.
function vonMangoldtDirect(n) {
  if (n < 2) return 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) {
      let m = n;
      while (m % p === 0) m = Math.floor(m / p);
      return m === 1 ? Math.log(p) : 0;
    }
  }
  return Math.log(n); // n is prime
}

// Interactive explicit formula calculator: shows how summing N zero contributions
// approximates psi(x) = x - sum_{rho} x^rho/rho - log(2pi) - ...
function ExplicitFormulaCalculator() {
  const [xVal, setXVal] = useState(50);
  const [numZeros, setNumZeros] = useState(10);

  const psiTrue = useMemo(() => {
    let sum = 0;
    const xFloor = Math.floor(xVal);
    for (let n = 2; n <= xFloor; n++) sum += vonMangoldtDirect(n);
    return sum;
  }, [xVal]);

  const { approx, contributions } = useMemo(() => {
    const lx = Math.log(xVal);
    const sqx = Math.sqrt(xVal);
    // Main term x minus the two trivial corrections (constant and log terms)
    let running = xVal - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - 1 / (xVal * xVal));
    const contributions = [];
    for (let k = 0; k < numZeros && k < ZETA_ZEROS.length; k++) {
      const gamma = ZETA_ZEROS[k];
      const rho2 = 0.25 + gamma * gamma; // |rho|^2 = (1/2)^2 + gamma^2
      // Conjugate pair contribution: x^rho/rho + x^{rho-bar}/rho-bar
      //   = 2 * sqrt(x) * (cos(gamma*lx)/2 + gamma*sin(gamma*lx)) / |rho|^2
      // The explicit formula subtracts this sum, so term is negative on average
      const term = -sqx * (Math.cos(gamma * lx) + 2 * gamma * Math.sin(gamma * lx)) / rho2;
      running += term;
      contributions.push({ gamma, term, running });
    }
    return { approx: running, contributions };
  }, [xVal, numZeros]);

  const error = approx - psiTrue;

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #22d3ee' }}>
      <h3 style={{ color: '#22d3ee' }}>Interactive: Explicit Formula Reconstruction</h3>
      <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
        Drag the sliders to see how <InlineMath tex={"\\psi_N(x) = x - \\log(2\\pi) - \\sum_{n=1}^{N} \\frac{x^{1/2}(\\cos \\gamma_n \\log x + 2\\gamma_n \\sin \\gamma_n \\log x)}{\\tfrac{1}{4}+\\gamma_n^2}"} /> converges to the exact{' '}
        <InlineMath tex={"\\psi(x) = \\sum_{n \\leq x} \\Lambda(n)"} /> as more zeros are included.
        Each row in the table shows one conjugate-pair contribution.
      </p>
      <div className="controls" style={{ marginTop: 12 }}>
        <div className="control-group">
          <label>x</label>
          <input type="range" min="5" max="100" step="1" value={xVal}
            onChange={e => setXVal(+e.target.value)} />
          <span className="control-value">{xVal}</span>
        </div>
        <div className="control-group">
          <label>Zeros N</label>
          <input type="range" min="1" max="30" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, background: '#0a0e1a', borderRadius: 6, textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>
            <InlineMath tex={"\\psi_{\\text{true}}(x)"} />
          </div>
          <div style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)', fontSize: 15 }}>
            {psiTrue.toFixed(4)}
          </div>
        </div>
        <div style={{ padding: 12, background: '#0a0e1a', borderRadius: 6, textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>
            <InlineMath tex={"\\psi_N(x)"} /> ({numZeros} zero{numZeros !== 1 ? 's' : ''})
          </div>
          <div style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: 15 }}>
            {approx.toFixed(4)}
          </div>
        </div>
        <div style={{ padding: 12, background: '#0a0e1a', borderRadius: 6, textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Error</div>
          <div style={{ color: Math.abs(error) < 1 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)', fontSize: 15 }}>
            {error > 0 ? '+' : ''}{error.toFixed(4)}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, maxHeight: 200, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid #1e293b' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>n</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>
                <InlineMath tex={"\\gamma_n"} />
              </th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>Contribution</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>Running sum</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '3px 8px', color: '#64748b' }}>{i + 1}</td>
                <td style={{ padding: '3px 8px', color: '#94a3b8' }}>{c.gamma.toFixed(4)}</td>
                <td style={{ textAlign: 'right', padding: '3px 8px', color: c.term < 0 ? '#f87171' : '#4ade80' }}>
                  {c.term > 0 ? '+' : ''}{c.term.toFixed(4)}
                </td>
                <td style={{ textAlign: 'right', padding: '3px 8px', color: '#94a3b8' }}>
                  {c.running.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 8, color: '#475569', fontSize: 11, lineHeight: 1.6 }}>
        The explicit formula converges conditionally (in symmetric pairs). With 30 zeros the error
        is typically <InlineMath tex={"O(x^{1/2})"} /> — adding more zeros narrows it. The alternating
        signs of the contributions reflect the oscillatory nature of the spectral decomposition.
      </p>
    </div>
  );
}

export default function FourierPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Fourier Domain Explorer</h1>
        <p>
          The explicit formula decomposes the prime counting function into oscillatory modes,
          one per zeta zero. This is a Fourier-type duality: primes live in "position space" while
          zeta zeros live in "frequency space." Here we explore the ladder network's frequency response
          and the spectral content of prime distributions.
        </p>
      </div>

      <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho}\\frac{x^\\rho}{\\rho} \\quad\\Longleftrightarrow\\quad \\hat{\\Lambda}(\\omega) = \\sum_n \\Lambda(n)\\, e^{-i\\omega\\log n}"} />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex={"H(\\sigma + i\\omega) = \\prod_p \\frac{1}{1 - p^{-\\sigma - i\\omega}} \\quad \\text{(ladder transfer function in frequency domain)}"} />
      </div>

      <div style={{ marginTop: 32 }}>
        <FourierDomainViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>What to Explore in Each Tab</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#3b82f6' }}>Von Mangoldt Spectrum:</strong> the DFT
            of <InlineMath tex={"\\Lambda(n)"} /> reveals sharp peaks at the zeta
            zero heights <InlineMath tex={"\\gamma_n"} />. Increase maxN to see
            the peaks sharpen — this is the spectral resolution improving as
            more prime-power data is included.
          </li>
          <li>
            <strong style={{ color: '#10b981' }}>Frequency Response:</strong> the ladder
            transfer function <InlineMath tex={"|H(\\sigma+i\\omega)|"} /> plotted
            against frequency. At <InlineMath tex={"\\sigma = 0.5"} /> the gain
            curve is symmetric about the critical line; move <InlineMath tex={"\\sigma"} /> away
            to see the response tilt and resonances shift.
          </li>
          <li>
            <strong style={{ color: '#8b5cf6' }}>Spectral Energy:</strong> shows how
            energy <InlineMath tex={"|H|^2"} /> is distributed across frequencies.
            Adding more primes concentrates energy near the zeta-zero
            frequencies, illustrating how the Euler product builds up the
            full spectral structure one prime at a time.
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>Prime Harmonics:</strong> decomposes the
            contribution of each prime <InlineMath tex={"p"} /> as a separate
            harmonic at frequency <InlineMath tex={"\\log p"} />. Watch how
            small primes dominate the low-frequency structure while large
            primes add high-frequency detail.
          </li>
        </ul>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Primes as Signal, Zeros as Spectrum</h3>
          <p style={{ marginTop: 8 }}>
            The von Mangoldt function <InlineMath tex={"\\Lambda(n)"} /> is the "time-domain signal" of the primes. Its Fourier
            transform peaks at the zeta zero locations <InlineMath tex={"\\gamma_n"} />, revealing the "frequencies" hidden in
            prime distribution. More primes in the sum sharpen the spectral peaks.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Multiresolution Decomposition</h3>
          <p style={{ marginTop: 8 }}>
            Each prime <InlineMath tex={"p"} /> contributes a "wavelet" at scale <InlineMath tex={"\\log(p)"} />. Small primes (<InlineMath tex={"p=2,3,5"} />) capture
            coarse structure; large primes add fine detail. The Euler product cascade is a natural
            multiresolution filter bank, with each stage refining the approximation to <InlineMath tex={"\\zeta(s)"} />.
          </p>
        </div>
      </div>

      {/* ─── Fourier Analysis of Zeta and the Von Mangoldt Function ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>Fourier Analysis of Zeta and the Von Mangoldt Function</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The deep connection between Fourier analysis and the Riemann zeta function is mediated by
          the von Mangoldt function <InlineMath tex={"\\Lambda(n)"} />. This arithmetic function, defined as{' '}
          <InlineMath tex={"\\Lambda(n) = \\log p"} /> when <InlineMath tex={"n = p^k"} /> for some prime{' '}
          <InlineMath tex={"p"} /> and integer <InlineMath tex={"k \\geq 1"} />, and{' '}
          <InlineMath tex={"\\Lambda(n) = 0"} /> otherwise, serves as the bridge between the multiplicative
          structure of primes and the additive structure of Fourier analysis.
        </p>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The Chebyshev function <InlineMath tex={"\\psi(x) = \\sum_{n \\leq x} \\Lambda(n)"} /> accumulates
          these prime-power weights. The explicit formula expresses it as a sum over zeta zeros:
        </p>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log\\left(1 - \\frac{1}{x^2}\\right)"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Each zero <InlineMath tex={"\\rho = \\frac{1}{2} + i\\gamma"} /> (assuming RH) contributes a term{' '}
          <InlineMath tex={"x^{\\rho}/\\rho = x^{1/2} e^{i\\gamma \\log x} / \\rho"} />, which is an oscillation
          at frequency <InlineMath tex={"\\gamma"} /> in the variable <InlineMath tex={"\\log x"} />. This is
          precisely a Fourier decomposition: the "signal" <InlineMath tex={"\\psi(x) - x"} /> (the error in the
          prime number theorem) is a superposition of sinusoidal modes indexed by zeta zeros.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#3b82f6', fontSize: 13, marginBottom: 8 }}>The Multiplicative Fourier Transform</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              On the multiplicative group <InlineMath tex={"\\mathbb{R}_{>0}"} />, the natural "Fourier transform"
              is the Mellin transform. For <InlineMath tex={"\\Lambda"} />, this gives exactly the logarithmic
              derivative of zeta:
            </p>
            <BlockMath tex={"\\mathcal{M}[\\Lambda](s) = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s} = -\\frac{\\zeta'(s)}{\\zeta(s)}"} />
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              The poles of <InlineMath tex={"-\\zeta'/\\zeta"} /> at the zeros of <InlineMath tex={"\\zeta(s)"} /> become
              the spectral peaks in the Fourier domain. This is the precise mechanism by which
              the distribution of primes encodes the location of zeta zeros.
            </p>
          </div>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#10b981', fontSize: 13, marginBottom: 8 }}>Weil's Explicit Formula</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              Andre Weil generalized the explicit formula to a duality between primes and zeros:
              for any suitable test function <InlineMath tex={"h"} />,
            </p>
            <BlockMath tex={"\\sum_{\\rho} h(\\gamma_{\\rho}) = h\\!\\left(\\tfrac{i}{2}\\right) + h\\!\\left(-\\tfrac{i}{2}\\right) - \\sum_{p} \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{k/2}} \\hat{h}(k \\log p) + \\cdots"} />
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              This is a trace formula: the left side sums over the "spectrum" (zeros), the right side
              sums over the "geometry" (primes). It is the number-theoretic analogue of the
              Selberg trace formula and underpins the spectral interpretation of the ZPO model.
            </p>
          </div>
        </div>

        <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The pair correlation of zeta zeros, famously connected to random matrix theory by
          Montgomery-Dyson, can also be expressed as a Fourier transform of the two-point
          function of <InlineMath tex={"\\Lambda(n)"} />:
        </p>
        <BlockMath tex={"F(\\alpha) = \\lim_{T \\to \\infty} \\frac{1}{N(T)} \\sum_{0 < \\gamma, \\gamma' \\leq T} T^{i\\alpha(\\gamma - \\gamma')} = \\min(|\\alpha|,\\, 1) + \\delta(\\alpha)"} />
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, fontStyle: 'italic' }}>
          This is the GUE form factor: for <InlineMath tex={"|\\alpha| \\leq 1"} />,{' '}
          <InlineMath tex={"F(\\alpha) = |\\alpha|"} /> (Montgomery's theorem under RH), and for{' '}
          <InlineMath tex={"|\\alpha| > 1"} />, <InlineMath tex={"F(\\alpha) = 1"} /> (conjectured).
          The linear growth for small <InlineMath tex={"\\alpha"} /> reflects spectral rigidity —
          zeros repel like GUE eigenvalues, and their statistics mirror the prime distribution's
          autocorrelation function.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#ef4444' }}>
        <h3 style={{ color: '#ef4444' }}>Why Λ(n), Not π(x)?</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The prime-counting function <InlineMath tex={"\\pi(x)"} /> seems like the obvious signal to analyze, but
          it has an awkward Dirichlet series. The von Mangoldt function <InlineMath tex={"\\Lambda(n)"} /> (which
          equals <InlineMath tex={"\\log p"} /> when <InlineMath tex={"n = p^k"} /> and 0 otherwise) is preferred because
          its generating function is the logarithmic derivative of zeta:
        </p>
        <BlockMath tex={"-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}"} />
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          This identity makes <InlineMath tex={"\\Lambda(n)"} /> the natural "impulse response" of the prime
          distribution: its poles are exactly the zeta zeros, and its Fourier transform produces clean
          spectral peaks at each <InlineMath tex={"\\gamma_n"} /> without the staircase artifacts that <InlineMath tex={"\\pi(x)"} /> would introduce.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>Fourier Duality and the Functional Equation</h3>
        <BlockMath tex={"\\xi(s) = \\xi(1-s) \\;\\Longleftrightarrow\\; \\text{The ladder is its own Fourier dual}"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The functional equation says the system looks the same whether analyzed from the "direct"
          or "dual" side. In Fourier terms, the completed zeta function is self-dual under the Mellin
          transform (the multiplicative analogue of the Fourier transform). The critical line <InlineMath tex={"\\sigma = 1/2"} />
          is where this self-duality is exact.
        </p>
      </div>

      {/* ─── Parseval's Theorem ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #14b8a6' }}>
        <h3 style={{ color: '#14b8a6' }}>Parseval's Theorem: Energy Conservation Across Domains</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Parseval's theorem states that the total energy of a signal is the same whether
          measured in the time domain or the frequency domain. For the Mellin transform on
          the critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, this becomes:
        </p>
        <BlockMath tex={"\\sum_{n=1}^{\\infty} \\frac{|a_n|^2}{n} = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} \\left|\\sum_{n=1}^{\\infty} \\frac{a_n}{n^{1/2+it}}\\right|^2 dt"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          In the ZPO model, this is the statement that <strong>total oscillator energy is
          conserved</strong> between the prime-indexed "position" basis and the zero-indexed
          "frequency" basis. The critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is
          special because it is the unique line where the Mellin-Parseval identity holds with
          equal weighting — the <InlineMath tex={"n^{-1}"} /> weight on the left matches the
          natural <InlineMath tex={"L^2"} /> norm on the right.
        </p>
        <div className="two-col" style={{ marginTop: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#14b8a6', fontSize: 13, marginBottom: 8 }}>Connection to Unitarity</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              The bridge scattering matrix satisfies <InlineMath tex={"S^\\dagger S = I"} /> on{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> — this is exactly Parseval's theorem
              applied to the cascade transfer function. Energy entering the ladder equals energy
              leaving it: no amplification, no absorption.
            </p>
          </div>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#14b8a6', fontSize: 13, marginBottom: 8 }}>Why Only at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />?</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              Off the critical line, the Parseval weights become{' '}
              <InlineMath tex={"n^{-2\\sigma}"} /> instead of <InlineMath tex={"n^{-1}"} />,
              breaking the symmetry between large and small <InlineMath tex={"n"} />.
              For <InlineMath tex={"\\sigma > \\tfrac{1}{2}"} /> the high-frequency modes are
              over-damped; for <InlineMath tex={"\\sigma < \\tfrac{1}{2}"} /> they are
              under-damped. Only at the critical line is the energy budget balanced.
            </p>
          </div>
        </div>
      </div>

      {/* ─── The Mellin Transform ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f97316' }}>
        <h3 style={{ color: '#f97316' }}>The Mellin Transform: Fourier's Cousin for Multiplicative Problems</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          While the Fourier transform decomposes functions along additive characters{' '}
          <InlineMath tex={"e^{i\\omega t}"} />, the <strong>Mellin transform</strong> decomposes them along
          multiplicative characters <InlineMath tex={"x^{s-1}"} />:
        </p>
        <BlockMath tex={"\\hat{f}(s) = \\int_0^{\\infty} f(x)\\, x^{s-1}\\, dx"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          This is the "multiplicative Fourier transform" — it diagonalizes multiplication instead of
          addition. Where Fourier converts convolution to pointwise multiplication, Mellin converts{' '}
          <em>multiplicative convolution</em> (Dirichlet series) to pointwise products.
        </p>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The Riemann zeta function itself is a Mellin transform of the fractional part of the floor
          function:
        </p>
        <BlockMath tex={"\\zeta(s) = \\frac{s}{s-1} - s \\int_1^{\\infty} \\frac{\\{x\\}}{x^{s+1}}\\, dx \\qquad (\\operatorname{Re}(s) > 0)"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The inverse Mellin transform recovers the prime counting function from the zeta zeros. The
          Chebyshev function is recovered via:
        </p>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\cdots"} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#f97316', fontSize: 13, marginBottom: 8 }}>ZPO Interpretation</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              In ZPO terms, the Mellin transform converts between the "time domain" (prime counting
              functions like <InlineMath tex={"\\psi(x)"} /> and <InlineMath tex={"\\pi(x)"} />) and the
              "frequency domain" (the zeta zeros <InlineMath tex={"\\rho"} />). Primes are the
              time-domain impulses; zeros are the spectral peaks.
            </p>
          </div>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#f97316', fontSize: 13, marginBottom: 8 }}>Explicit Formula as Inverse Mellin</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              The explicit formula can be written directly as an inverse Mellin transform of the
              logarithmic derivative of zeta:
            </p>
            <BlockMath tex={"\\psi_0(x) = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} \\left(-\\frac{\\zeta'}{\\zeta}\\right)(s)\\, \\frac{x^s}{s}\\, ds"} />
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              Shifting the contour left picks up residues at each pole — one at{' '}
              <InlineMath tex={"s = 1"} /> (giving the main term <InlineMath tex={"x"} />) and one at each
              zero <InlineMath tex={"\\rho"} /> (giving <InlineMath tex={"-x^{\\rho}/\\rho"} />).
            </p>
          </div>
        </div>
      </div>

      {/* ─── Spectral Interpretation of the Explicit Formula ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #a855f7' }}>
        <h3 style={{ color: '#a855f7' }}>Spectral Interpretation of the Explicit Formula</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The von Mangoldt explicit formula gives a complete spectral decomposition of the prime
          counting function:
        </p>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log\\!\\left(1 - x^{-2}\\right)"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Each zero <InlineMath tex={"\\rho = \\tfrac{1}{2} + i\\gamma"} /> contributes an oscillatory term
          that can be decomposed as:
        </p>
        <BlockMath tex={"\\frac{x^{\\rho}}{\\rho} = \\frac{x^{1/2}\\, e^{i\\gamma \\log x}}{\\rho}"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          These are "harmonics" with frequency <InlineMath tex={"\\gamma / (2\\pi)"} /> on a logarithmic
          scale. The prime distribution is a superposition of these spectral components:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#22c55e', fontSize: 13, marginBottom: 8 }}>DC Component (The Fundamental)</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              The leading term <InlineMath tex={"\\psi(x) \\approx x"} /> is the DC component — the
              "average" behavior predicted by the prime number theorem. It says primes have a constant
              density of <InlineMath tex={"1/\\log x"} /> on average.
            </p>
            <BlockMath tex={"\\text{DC: } \\psi(x) \\approx x \\quad \\Longleftrightarrow \\quad \\pi(x) \\sim \\frac{x}{\\log x}"} />
          </div>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>AC Components (The Oscillations)</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              The sum <InlineMath tex={"\\sum x^{1/2 + i\\gamma}"} /> gives the AC components — waves
              riding on the smooth trend. Each zeta zero contributes one oscillatory mode to the
              "music of the primes."
            </p>
            <BlockMath tex={"\\text{AC: } -\\sum_{\\rho} \\frac{x^{1/2 + i\\gamma}}{\\rho} = \\text{oscillations around } x"} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid rgba(34,197,94,0.3)' }}>
            <h4 style={{ color: '#22c55e', fontSize: 13, marginBottom: 8 }}>If RH Is True</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              All AC components decay as <InlineMath tex={"x^{1/2}"} /> — square root cancellation.
              Every oscillatory mode has the same amplitude envelope, producing the optimal error
              bound:
            </p>
            <BlockMath tex={"\\psi(x) - x = O\\!\\left(x^{1/2} \\log^2 x\\right)"} />
          </div>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)' }}>
            <h4 style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>If RH Is False</h4>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              Some component would grow as <InlineMath tex={"x^{\\sigma}"} /> with{' '}
              <InlineMath tex={"\\sigma > 1/2"} /> — "louder than expected." A single off-line zero
              would produce an anomalously large oscillation that dominates the error term:
            </p>
            <BlockMath tex={"\\exists\\, \\rho = \\sigma + i\\gamma,\\; \\sigma > \\tfrac{1}{2} \\;\\Longrightarrow\\; \\psi(x) - x = \\Omega\\!\\left(x^{\\sigma}\\right)"} />
          </div>
        </div>
      </div>

      <ExplicitFormulaCalculator />

      <div className="card" style={{ marginTop: 32, borderColor: '#64748b' }}>
        <h3 style={{ color: '#94a3b8' }}>Related Pages</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          This analysis connects to:{' '}
          <Link to="/control" style={{ color: '#10b981' }}>Control Theory</Link>{' '}
          (frequency response and Bode plots),{' '}
          <Link to="/waves" style={{ color: '#3b82f6' }}>Wave Simulator</Link>{' '}
          (spectral decomposition of signals),{' '}
          <Link to="/spectral-attack" style={{ color: '#8b5cf6' }}>Spectral Attack</Link>{' '}
          (Fourier-information synthesis),{' '}
          <Link to="/odd-zeta" style={{ color: '#f59e0b' }}>Odd Zeta Values</Link>{' '}
          (irrationality via explicit formula and spectral methods),{' '}
          <Link to="/info-theory" style={{ color: '#06b6d4' }}>Information Theory</Link>{' '}
          (Kolmogorov complexity of zeta values).
        </p>
      </div>
    </div>
  );
}
