import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimatedModesViz from '../components/AnimatedModesViz.jsx';
import PrimeGapCouplingViz from '../components/PrimeGapCouplingViz.jsx';
import EnergyLandscapeViz from '../components/EnergyLandscapeViz.jsx';
import ExplorationGraphViz from '../components/ExplorationGraphViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

// Zeros as Log-Space Modes — editorial (warm) re-theme.
// The four visualizations are preserved exactly; only chrome is re-themed.

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

// ── Style helpers ──────────────────────────────────────────────────────────

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '18px 20px',
    marginTop: 24,
  };
}

const bodyText = {
  color: 'var(--ink-soft)',
  fontSize: 14,
  lineHeight: 1.75,
};

const cardHeading = (color) => ({
  color,
  marginTop: 0,
  marginBottom: 10,
  fontSize: 16,
});

const vizTitle = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--ink)',
  letterSpacing: 0.2,
  marginBottom: 4,
};

const vizSubtitle = {
  fontSize: 12.5,
  color: 'var(--faint)',
  lineHeight: 1.6,
  marginBottom: 14,
  maxWidth: 760,
};

function Caveat({ children }) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: '12px 15px',
        border: '1px solid color-mix(in srgb, var(--brass-deco) 40%, transparent)',
        borderLeft: '3px solid var(--brass)',
        borderRadius: 8,
        color: 'var(--brass-dk)',
        background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
        fontSize: 12.5,
        lineHeight: 1.65,
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontWeight: 700,
          color: 'var(--brass-dk)',
          marginBottom: 4,
        }}
      >
        Caveat
      </span>
      {children}
    </div>
  );
}

// ── The page ───────────────────────────────────────────────────────────────

export default function ModesPage() {
  const rows = [5, 10, 25, 50].map((count) => ({
    count,
    lastPrime: FIRST_50_PRIMES[count - 1],
    value: curvatureProxy(count),
  }));

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>Explicit formula · zeros as log-space modes</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Zeros as Log-Space Modes</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            A visualization of the classical explicit formula and finite prime-delay proxies, with
            the physical-oscillator analogy kept separate from theorem. Read each panel as a picture
            of arithmetic, not as a claim about physical resonators.
          </p>
        </div>

        {/* ── Exact starting point ───────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--blue)')}>
          <h3 style={cardHeading('var(--blue)')}>The exact analytic starting point</h3>
          <p style={bodyText}>
            Write each nontrivial zero as <InlineMath tex="\rho=\beta+i\gamma" />. Its term in the
            explicit formula has the log-space decomposition
          </p>
          <BlockMath tex="\frac{x^\rho}{\rho}=\frac{x^\beta}{|\rho|}e^{\,i(\gamma\log x-\arg\rho)}." />
          <p style={bodyText}>
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

        {/* ── Viz 1 ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 36 }}>
          <div style={vizTitle}>Animated Zero-Mode Superposition</div>
          <div style={vizSubtitle}>
            Finite truncation of the zero contribution. The animation illustrates phase addition; it
            is not a proof of convergence or of RH.
          </div>
          <AnimatedModesViz />
        </div>

        {/* ── Viz 2 ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 44 }}>
          <div style={vizTitle}>Prime-Delay Coupling</div>
          <div style={vizSubtitle}>
            The exact arithmetic delays are m log p. Finite charts reveal their geometry without
            claiming a passive circuit realization.
          </div>
          <PrimeGapCouplingViz />
        </div>

        {/* ── Why delays are arithmetic ──────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--terra-dk)')}>
          <h3 style={cardHeading('var(--terra-dk)')}>Why the delays are arithmetic</h3>
          <BlockMath tex="\log\zeta(s)=\sum_p\sum_{m\ge1}\frac{p^{-ms}}m,\qquad -\frac{\zeta'}{\zeta}(s)=\sum_p\sum_{m\ge1}(\log p)p^{-ms},\quad\Re s>1." />
          <p style={{ ...bodyText, fontSize: 13.5 }}>
            The prime logarithms are linearly independent over the rationals by unique
            factorization. Prime-power rungs intentionally contain multiples
            <InlineMath tex="m\log p" />. The double series is absolutely convergent only in the
            Euler half-plane; critical-strip displays require truncation, smoothing, or analytic
            continuation.
          </p>
        </div>

        {/* ── Viz 3 ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 44 }}>
          <div style={vizTitle}>Finite Energy-Landscape Proxy</div>
          <div style={vizSubtitle}>
            A model diagnostic assembled from finitely many primes. Its symmetry and minima do not
            establish a Hamiltonian theorem for ξ.
          </div>
          <EnergyLandscapeViz />
        </div>

        {/* ── Curvature diagnostic ───────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <h3 style={cardHeading('var(--brass-dk)')}>Finite curvature diagnostic</h3>
          <p style={{ ...bodyText, fontSize: 13.5 }}>
            The app tracks the finite proxy
            <InlineMath tex="\;C_N=\sum_{p\le p_N}(\log p)^2/p" />. It increases with
            <InlineMath tex="N" /> because every summand is positive. This arithmetic fact does not
            prove that an infinite physical energy exists or has a unique minimum.
          </p>
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ color: 'var(--faint)' }}>
                  <th style={{ textAlign: 'right', padding: 7 }}>N</th>
                  <th style={{ textAlign: 'right', padding: 7 }}>pN</th>
                  <th style={{ textAlign: 'right', padding: 7 }}>finite C_N</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.count} style={{ borderTop: '1px solid var(--hairline)' }}>
                    <td style={{ textAlign: 'right', padding: 7, color: 'var(--ink)' }}>{row.count}</td>
                    <td style={{ textAlign: 'right', padding: 7, color: 'var(--ink-soft)' }}>{row.lastPrime}</td>
                    <td style={{ textAlign: 'right', padding: 7, color: 'var(--brass-dk)' }}>{row.value.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── No topological pinning ─────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--terra-dk)')}>
          <h3 style={cardHeading('var(--terra-dk)')}>No topological pinning follows</h3>
          <p style={{ ...bodyText, fontSize: 13.5 }}>
            A contour integral of <InlineMath tex="\zeta'/\zeta" /> counts zeros minus poles inside
            the contour. The phase of the gamma factor <InlineMath tex="\chi" /> alone does not count
            nontrivial zeta zeros, and an integer total count does not keep individual symmetric zero
            pairs on the critical line. Off-line motion can preserve the contour count.
          </p>
          <BlockMath tex="N_Z-N_P=\frac1{2\pi i}\oint_C\frac{\zeta'(s)}{\zeta(s)}\,ds." />
        </div>

        {/* ── Viz 4 ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 44 }}>
          <div style={vizTitle}>Exploration Dependency Graph</div>
          <div style={vizSubtitle}>
            A map of experiments and conjectural connections. Edges are research provenance, not
            logical implication unless a page explicitly supplies a theorem.
          </div>
          <ExplorationGraphViz />
        </div>

        {/* ── Related pages ──────────────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <h3
            style={{
              color: 'var(--faint)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginTop: 0,
              marginBottom: 10,
            }}
          >
            Related pages
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13 }}>
            <Link to="/zeta" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Zeta function</Link>
            <Link to="/fourier" style={{ color: 'var(--terra-dk)', textDecoration: 'none' }}>Fourier view</Link>
            <Link to="/control" style={{ color: 'var(--brass-dk)', textDecoration: 'none' }}>Corrected control model</Link>
            <Link to="/full-story" style={{ color: 'var(--green)', textDecoration: 'none' }}>Evidence-graded story</Link>
            <Link to="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
