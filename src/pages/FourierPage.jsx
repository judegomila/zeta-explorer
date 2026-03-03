import React from 'react';
import FourierDomainViz from '../components/FourierDomainViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

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

      <BlockMath tex="\\psi(x) = x - \\sum_{\\rho}\\frac{x^\\rho}{\\rho} \\quad\\Longleftrightarrow\\quad \\hat{\\Lambda}(\\omega) = \\sum_n \\Lambda(n)\\, e^{-i\\omega\\log n}" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="H(\\sigma + i\\omega) = \\prod_p \\frac{1}{1-p^{-\\sigma-i\\omega}} \\;\\text{ is the ladder's transfer function in the frequency domain}" />
      </div>

      <div style={{ marginTop: 32 }}>
        <FourierDomainViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>What to Explore in Each Tab</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#3b82f6' }}>Von Mangoldt Spectrum:</strong> the DFT
            of <InlineMath tex="\Lambda(n)" /> reveals sharp peaks at the zeta
            zero heights <InlineMath tex="\gamma_n" />. Increase maxN to see
            the peaks sharpen — this is the spectral resolution improving as
            more prime-power data is included.
          </li>
          <li>
            <strong style={{ color: '#10b981' }}>Frequency Response:</strong> the ladder
            transfer function <InlineMath tex="|H(\sigma+i\omega)|" /> plotted
            against frequency. At <InlineMath tex="\sigma = 0.5" /> the gain
            curve is symmetric about the critical line; move <InlineMath tex="\sigma" /> away
            to see the response tilt and resonances shift.
          </li>
          <li>
            <strong style={{ color: '#8b5cf6' }}>Spectral Energy:</strong> shows how
            energy <InlineMath tex="|H|^2" /> is distributed across frequencies.
            Adding more primes concentrates energy near the zeta-zero
            frequencies, illustrating how the Euler product builds up the
            full spectral structure one prime at a time.
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>Prime Harmonics:</strong> decomposes the
            contribution of each prime <InlineMath tex="p" /> as a separate
            harmonic at frequency <InlineMath tex="\log p" />. Watch how
            small primes dominate the low-frequency structure while large
            primes add high-frequency detail.
          </li>
        </ul>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Primes as Signal, Zeros as Spectrum</h3>
          <p style={{ marginTop: 8 }}>
            The von Mangoldt function <InlineMath tex="\\Lambda(n)" /> is the "time-domain signal" of the primes. Its Fourier
            transform peaks at the zeta zero locations <InlineMath tex="\\gamma_n" />, revealing the "frequencies" hidden in
            prime distribution. More primes in the sum sharpen the spectral peaks.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Multiresolution Decomposition</h3>
          <p style={{ marginTop: 8 }}>
            Each prime <InlineMath tex="p" /> contributes a "wavelet" at scale <InlineMath tex="\\log(p)" />. Small primes (<InlineMath tex="p=2,3,5" />) capture
            coarse structure; large primes add fine detail. The Euler product cascade is a natural
            multiresolution filter bank, with each stage refining the approximation to <InlineMath tex="\\zeta(s)" />.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>Fourier Duality and the Functional Equation</h3>
        <BlockMath tex="\\xi(s) = \\xi(1-s) \\;\\Longleftrightarrow\\; \\text{The ladder is its own Fourier dual}" />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The functional equation says the system looks the same whether analyzed from the "direct"
          or "dual" side. In Fourier terms, the completed zeta function is self-dual under the Mellin
          transform (the multiplicative analogue of the Fourier transform). The critical line <InlineMath tex="\sigma = 1/2" />
          is where this self-duality is exact.
        </p>
      </div>
    </div>
  );
}
