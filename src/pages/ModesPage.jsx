import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedModesViz from '../components/AnimatedModesViz.jsx';
import PrimeGapCouplingViz from '../components/PrimeGapCouplingViz.jsx';
import EnergyLandscapeViz from '../components/EnergyLandscapeViz.jsx';
import ExplorationGraphViz from '../components/ExplorationGraphViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

const FIRST_50_PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
];

function curvatureProxy(count) {
  return FIRST_50_PRIMES.slice(0, count).reduce((sum, prime) => {
    const logPrime = Math.log(prime);
    return sum + (logPrime * logPrime) / prime;
  }, 0);
}

function Caveat({ children }) {
  return (
    <div
      style={{
        padding: '12px 15px',
        border: '1px solid rgba(245,158,11,0.35)',
        borderRadius: 8,
        color: '#fcd34d',
        background: 'rgba(245,158,11,0.06)',
        fontSize: 12.5,
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  );
}

export default function ModesPage() {
  const rows = [5, 10, 25, 50].map((count) => ({
    count,
    lastPrime: FIRST_50_PRIMES[count - 1],
    value: curvatureProxy(count),
  }));

  return (
    <div className="page">
      <div className="page-header">
        <h1>Zeros as Log-Space Modes</h1>
        <p>
          A visualization of the classical explicit formula and finite prime-delay proxies, with
          the physical-oscillator analogy kept separate from theorem.
        </p>
      </div>

      <div className="card" style={{ borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#60a5fa', marginTop: 0 }}>The exact analytic starting point</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
          Write each nontrivial zero as <InlineMath tex="\rho=\beta+i\gamma" />. Its term in the
          explicit formula has the log-space decomposition
        </p>
        <BlockMath tex="\frac{x^\rho}{\rho}=\frac{x^\beta}{|\rho|}e^{\,i(\gamma\log x-\arg\rho)}." />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
          Thus <InlineMath tex="\gamma" /> is a log-frequency and <InlineMath tex="x^\beta" /> is
          the envelope. The statement <InlineMath tex="\beta=1/2" /> is the conclusion of RH, not
          an input to this visualization.
        </p>
        <BlockMath tex="\psi_0(x)=x-\lim_{T\to\infty}\sum_{|\Im\rho|\le T}\frac{x^\rho}{\rho}-\log(2\pi)-\frac12\log(1-x^{-2})." />
        <Caveat>
          The zero sum uses the standard symmetric limiting convention, and
          <InlineMath tex="\psi_0" /> uses half-weight at discontinuities. Calling these terms
          “modes” is a visualization of the explicit formula, not a construction of physical
          resonators.
        </Caveat>
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="viz-title">Animated Zero-Mode Superposition</div>
        <div className="viz-subtitle">
          Finite truncation of the zero contribution. The animation illustrates phase addition; it
          is not a proof of convergence or of RH.
        </div>
        <AnimatedModesViz />
      </div>

      <div style={{ marginTop: 44 }}>
        <div className="viz-title">Prime-Delay Coupling</div>
        <div className="viz-subtitle">
          The exact arithmetic delays are m log p. Finite charts reveal their geometry without
          claiming a passive circuit realization.
        </div>
        <PrimeGapCouplingViz />
      </div>

      <div
        className="card"
        style={{ marginTop: 26, borderLeft: '3px solid #8b5cf6', padding: 17 }}
      >
        <h3 style={{ color: '#a78bfa', marginTop: 0 }}>Why the delays are arithmetic</h3>
        <BlockMath tex="\log\zeta(s)=\sum_p\sum_{m\ge1}\frac{p^{-ms}}m,\qquad -\frac{\zeta'}{\zeta}(s)=\sum_p\sum_{m\ge1}(\log p)p^{-ms},\quad\Re s>1." />
        <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.75 }}>
          The prime logarithms are linearly independent over the rationals by unique
          factorization. Prime-power rungs intentionally contain multiples
          <InlineMath tex="m\log p" />. The double series is absolutely convergent only in the
          Euler half-plane; critical-strip displays require truncation, smoothing, or analytic
          continuation.
        </p>
      </div>

      <div style={{ marginTop: 44 }}>
        <div className="viz-title">Finite Energy-Landscape Proxy</div>
        <div className="viz-subtitle">
          A model diagnostic assembled from finitely many primes. Its symmetry and minima do not
          establish a Hamiltonian theorem for ξ.
        </div>
        <EnergyLandscapeViz />
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', marginTop: 0 }}>Finite curvature diagnostic</h3>
        <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.7 }}>
          The app tracks the finite proxy
          <InlineMath tex="\;C_N=\sum_{p\le p_N}(\log p)^2/p" />. It increases with
          <InlineMath tex="N" /> because every summand is positive. This arithmetic fact does not
          prove that an infinite physical energy exists or has a unique minimum.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <thead>
              <tr style={{ color: '#64748b' }}>
                <th style={{ textAlign: 'right', padding: 7 }}>N</th>
                <th style={{ textAlign: 'right', padding: 7 }}>pN</th>
                <th style={{ textAlign: 'right', padding: 7 }}>finite C_N</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.count} style={{ borderTop: '1px solid #1e293b' }}>
                  <td style={{ textAlign: 'right', padding: 7, color: '#e2e8f0' }}>{row.count}</td>
                  <td style={{ textAlign: 'right', padding: 7, color: '#94a3b8' }}>{row.lastPrime}</td>
                  <td style={{ textAlign: 'right', padding: 7, color: '#fbbf24' }}>{row.value.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="card"
        style={{ marginTop: 24, borderLeft: '3px solid #ef4444', padding: 17 }}
      >
        <h3 style={{ color: '#fca5a5', marginTop: 0 }}>No topological pinning follows</h3>
        <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.75 }}>
          A contour integral of <InlineMath tex="\zeta'/\zeta" /> counts zeros minus poles inside
          the contour. The phase of the gamma factor <InlineMath tex="\chi" /> alone does not count
          nontrivial zeta zeros, and an integer total count does not keep individual symmetric zero
          pairs on the critical line. Off-line motion can preserve the contour count.
        </p>
        <BlockMath tex="N_Z-N_P=\frac1{2\pi i}\oint_C\frac{\zeta'(s)}{\zeta(s)}\,ds." />
      </div>

      <div style={{ marginTop: 44 }}>
        <div className="viz-title">Exploration Dependency Graph</div>
        <div className="viz-subtitle">
          A map of experiments and conjectural connections. Edges are research provenance, not
          logical implication unless a page explicitly supplies a theorem.
        </div>
        <ExplorationGraphViz />
      </div>

      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13 }}>
          <Link to="/zeta" style={{ color: '#3b82f6' }}>Zeta function</Link>
          <Link to="/fourier" style={{ color: '#8b5cf6' }}>Fourier view</Link>
          <Link to="/control" style={{ color: '#f59e0b' }}>Corrected control model</Link>
          <Link to="/full-story" style={{ color: '#10b981' }}>Evidence-graded story</Link>
        </div>
      </div>
    </div>
  );
}
