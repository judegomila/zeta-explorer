import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import ProofPlannerViz from '../components/ProofPlannerViz.jsx';
import { PROOF_SECTIONS } from '../math/formal-proof.js';

const STATUS_COLORS = {
  proven:      '#10b981',
  conditional: '#f59e0b',
  gap:         '#f97316',
  open:        '#ef4444',
};

const STATUS_LABELS = {
  proven:      'Proven',
  conditional: 'Conditional',
  gap:         'Gap',
  open:        'Open',
};

// Tractability ranking with reasoning
const TRACTABILITY_RANKING = [
  {
    id: 'S6', score: 60,
    reason: 'Strong numerical evidence for Hamiltonian minimum at sigma=1/2. Needs an analytic proof that d^2T/dsigma^2 > 0. Convexity arguments from spectral theory could close this.',
  },
  {
    id: 'S4', score: 55,
    reason: 'Regularised Euler products are well-studied (Deninger, Connes). The gap is defining a physically meaningful cascade in the critical strip. Connes\' adelic framework may provide the right language.',
  },
  {
    id: 'S9', score: 50,
    reason: 'Information-theoretic optimality at sigma=1/2 is numerically clear. Needs a rigorous channel model. Connes\' 2026 Weil form result supports the rate-distortion perspective.',
  },
  {
    id: 'S7', score: 30,
    reason: 'Darlington path requires extending the synthesis theorem to infinite analytically-continued networks. Youla (1961) partially addressed infinite networks. Novel but constrained problem.',
  },
  {
    id: 'S5', score: 25,
    reason: 'Hilbert-Polya conjecture. Berry-Keating H=xp candidate exists but spectrum is not proven to match zeta zeros. Connes\' 2026 result (5 primes approximate 50 zeros) is encouraging but not a construction.',
  },
  {
    id: 'S8', score: 10,
    reason: 'The Riemann Hypothesis itself. Requires completing either Path A (S5) or Path B (S7). No shortcut known.',
  },
  {
    id: 'S10', score: 8,
    reason: 'Equivalent to RH in contrapositive form. Current best: 41.72% of zeros on critical line (Pratt et al. 2020). Enormous gap to 100%.',
  },
];

// What would close each gap
const GAP_CLOSERS = [
  {
    id: 'S4',
    title: 'Analytic Continuation of the Cascade',
    result: 'A regularisation scheme for the infinite Euler product that preserves the transfer-function interpretation in the critical strip, or a proof that impedance-matching and Hamiltonian minimisation properties persist under analytic continuation.',
  },
  {
    id: 'S5',
    title: 'Self-Adjoint Operator Construction',
    result: 'Construct a Hilbert space H (e.g. L^2 of an adelic space), define a densely-defined operator A on H, prove A is self-adjoint (not just symmetric), and show Spec(A) = {gamma_n : zeta(1/2+i*gamma_n)=0}. Any one of the four steps would be a major advance.',
  },
  {
    id: 'S6',
    title: 'Hamiltonian Energy Minimum',
    result: 'An analytic proof that the second derivative d^2 H/d sigma^2 evaluated at sigma=1/2 is strictly positive for all t. This reduces to bounding sums of |H_p\'(s)|^2 over primes. A Tauberian theorem or saddle-point argument could work.',
  },
  {
    id: 'S7',
    title: 'Darlington Synthesis Extension',
    result: 'Extend Darlington\'s theorem to countably infinite lossless 2-port networks defined by analytic continuation. Must address: (a) convergence of scattering parameters, (b) exact (not approximate) losslessness of the full network, (c) applicability of Youla\'s infinite-network framework to the ZPO topology.',
  },
  {
    id: 'S8',
    title: 'Spectral Confinement (RH)',
    result: 'Complete either proof path. Path A: close S5 (operator construction). Path B: close S7 (Darlington extension). Either yields Re(rho) = 1/2 for all nontrivial zeros.',
  },
  {
    id: 'S9',
    title: 'Information-Theoretic Optimality',
    result: 'Formalise the twin-ladder as a standard Shannon channel (complex-in, complex-out), or prove a theorem relating zeros of analytic functions to extrema of associated information-theoretic functionals. Connes\' Weil positivity condition is a candidate bridge.',
  },
  {
    id: 'S10',
    title: 'No Off-Line Zeros',
    result: 'Improve the proportion of zeros on the critical line from 41.72% to 100%, or prove a zero-free region extending to sigma = 1/2 (not just sigma > 1 - c/log t). Alternatively, prove the energy-exclusion argument from S6+S5.',
  },
];

export default function ProofPlannerPage() {
  const navigate = useNavigate();

  const handleNodeClick = (sectionId) => {
    // Navigate to formal proof page with section anchor
    navigate(`/formal-proof#${sectionId}`);
  };

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <h1>Proof Strategy Planner</h1>
        <p>
          An interactive dependency graph of the 10 proof sections in the Twin-Ladder Bridge framework for the
          Riemann Hypothesis. Visualise the critical paths, assess tractability, and identify
          where effort should be concentrated.
        </p>
      </div>

      {/* ── Dependency Graph ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Dependency Graph</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>
          Node size reflects tractability (how close to resolution). Coloured edges show the
          two critical paths to S8 (RH). Hover for details; click to jump to the section.
          The pulsing node is the recommended next step.
        </p>
        <ProofPlannerViz onNodeClick={handleNodeClick} />
      </div>

      {/* ── Critical Path Analysis ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Critical Path Analysis</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          Two independent paths lead from established results to S8 (the Riemann Hypothesis).
          Both share S4 (analytic continuation of the cascade) as a bottleneck.
          The <strong style={{ color: '#818cf8' }}>critical path</strong> determines the minimum
          number of breakthroughs required.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#1e293b', borderRadius: 8, padding: 16 }}>
            <h4 style={{ color: '#818cf8', marginBottom: 8 }}>Path A: Spectral / Operator</h4>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#e2e8f0', marginBottom: 8 }}>
              S1 <span style={{ color: '#10b981' }}>&#10003;</span>
              {' \u2192 '}S2 <span style={{ color: '#10b981' }}>&#10003;</span>
              {' \u2192 '}S4 <span style={{ color: '#f59e0b' }}>?</span>
              {' \u2192 '}S5 <span style={{ color: '#f97316' }}>!</span>
              {' \u2192 '}S8 <span style={{ color: '#ef4444' }}>\u2717</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
              Requires constructing a self-adjoint operator whose spectrum matches the zeta zeros
              (Hilbert-Polya conjecture). <strong>Bottleneck:</strong> S5 is the hardest single step,
              with tractability at 25%.
            </p>
          </div>
          <div style={{ background: '#1e293b', borderRadius: 8, padding: 16 }}>
            <h4 style={{ color: '#818cf8', marginBottom: 8 }}>Path B: Circuit / Network</h4>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#e2e8f0', marginBottom: 8 }}>
              S2 <span style={{ color: '#10b981' }}>&#10003;</span>
              {' + '}S3 <span style={{ color: '#10b981' }}>&#10003;</span>
              {' \u2192 '}S4 <span style={{ color: '#f59e0b' }}>?</span>
              {' \u2192 '}S7 <span style={{ color: '#f97316' }}>!</span>
              {' \u2192 '}S8 <span style={{ color: '#ef4444' }}>\u2717</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
              Requires extending Darlington's synthesis theorem to infinite analytically-continued
              networks. <strong>Bottleneck:</strong> S7 at 30% tractability -- slightly more tractable
              than S5 because the problem is more constrained (network theory vs. general spectral theory).
            </p>
          </div>
        </div>

        <div style={{ marginTop: 16, background: '#1e293b', borderRadius: 8, padding: 16, borderLeft: '3px solid #818cf8' }}>
          <h4 style={{ color: '#818cf8', marginBottom: 6 }}>Shared Bottleneck: S4</h4>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
            Both paths require S4 (analytic continuation of the cascade). At 55% tractability, this is
            the <em>highest-leverage target</em>: closing S4 unblocks both paths simultaneously.
            Connes' adelic framework and Deninger's dynamical systems analogy are the most promising
            approaches.
          </p>
        </div>
      </div>

      {/* ── Path Comparison ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Path Comparison</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b' }}>Criterion</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#818cf8' }}>Path A (Spectral)</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#818cf8' }}>Path B (Circuit)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Key Section', 'S5: Self-Adjoint Operator', 'S7: Darlington Synthesis'],
              ['Tractability', '25%', '30%'],
              ['Math Domain', 'Spectral theory, functional analysis', 'Network synthesis, circuit theory'],
              ['Historical Basis', 'Hilbert-Polya (1914), Berry-Keating (1999)', 'Darlington (1939), Youla (1961)'],
              ['Strengths',
                'Deep connections to physics (quantum chaos). Connes\' 2026 result validates spectral encoding.',
                'Constrained problem domain. Darlington theorem is constructive, not existential.'],
              ['Weaknesses',
                'Requires constructing an operator on an unknown Hilbert space. Very general problem.',
                'Theorem must be extended to infinite networks with analytic continuation. Novel territory.'],
              ['Recent Progress',
                'Connes (2026): 5 primes encode 50 zeros. Bender-Brody-Mueller PT-symmetric operator.',
                'Twin-ladder model provides explicit candidate network. ZX-calculus connection.'],
              ['Verdict', 'Harder but more rewarded', 'More constrained, slightly more tractable'],
            ].map(([label, a, b], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', color: '#94a3b8', fontWeight: 600 }}>{label}</td>
                <td style={{ padding: '8px 12px', color: '#cbd5e1', lineHeight: 1.6 }}>{a}</td>
                <td style={{ padding: '8px 12px', color: '#cbd5e1', lineHeight: 1.6 }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Tractability Ranking ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Tractability Ranking</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Non-proven sections ordered by tractability score (higher = closer to resolution).
          Proven sections (S1, S2, S3) are omitted.
        </p>
        {TRACTABILITY_RANKING.map((item, i) => {
          const sec = PROOF_SECTIONS.find(s => s.id === item.id);
          return (
            <div key={item.id}
              onClick={() => handleNodeClick(item.id)}
              title={`Go to ${item.id} in the formal proof`}
              style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 0', borderBottom: i < TRACTABILITY_RANKING.length - 1 ? '1px solid #1e293b' : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                minWidth: 44, textAlign: 'center', fontFamily: 'var(--font-mono)',
                fontWeight: 700, fontSize: 18, color: STATUS_COLORS[sec.status],
              }}>
                #{i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{sec.id}: {sec.title}</span>
                  <span style={{
                    fontSize: 11, padding: '1px 6px', borderRadius: 4,
                    background: STATUS_COLORS[sec.status] + '22',
                    color: STATUS_COLORS[sec.status],
                  }}>
                    {STATUS_LABELS[sec.status]}
                  </span>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <div style={{
                    height: 6, borderRadius: 3, background: '#1e293b', width: '100%', position: 'relative',
                  }}>
                    <div style={{
                      height: 6, borderRadius: 3, width: `${item.score}%`,
                      background: `linear-gradient(90deg, ${STATUS_COLORS[sec.status]}, ${STATUS_COLORS[sec.status]}88)`,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                    {item.score}% tractability
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  {item.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── What Would Close Each Gap ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>What Would Close Each Gap</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Specific mathematical results needed to resolve each non-proven section.
        </p>
        {GAP_CLOSERS.map((item) => {
          const sec = PROOF_SECTIONS.find(s => s.id === item.id);
          return (
            <div key={item.id} style={{
              background: '#1e293b', borderRadius: 8, padding: 14, marginBottom: 12,
              borderLeft: `3px solid ${STATUS_COLORS[sec.status]}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontWeight: 700, color: STATUS_COLORS[sec.status],
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                }}>
                  {sec.id}
                </span>
                <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13 }}>
                  {item.title}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, margin: 0 }}>
                {item.result}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Related Pages ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { to: '/formal-proof', label: 'Formal Proof', desc: 'Full proof sections with verification' },
            { to: '/proof-checker', label: 'Proof Checker', desc: 'Automated validation of each step' },
            { to: '/gap-closing', label: 'Gap Closing', desc: 'Strategies for closing identified gaps' },
            { to: '/rh-attack', label: 'RH Attack', desc: 'Multi-angle attack on the Riemann Hypothesis' },
            { to: '/spectral-attack', label: 'Spectral Attack', desc: 'Spectral theory approach (Path A)' },
            { to: '/twin-ladder', label: 'Twin Ladder', desc: 'Network model underlying Path B' },
            { to: '/rigor', label: 'Rigor', desc: 'Rigorous assessment of all claims' },
            { to: '/cross-attack', label: 'Cross-Attack', desc: 'Cross-cutting attack strategies' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              background: '#1e293b', borderRadius: 8, padding: '10px 14px',
              textDecoration: 'none', flex: '1 1 220px', minWidth: 200,
              border: '1px solid #334155', transition: 'border-color 0.2s',
            }}>
              <div style={{ fontWeight: 600, color: '#818cf8', fontSize: 13, marginBottom: 2 }}>
                {link.label}
              </div>
              <div style={{ color: '#64748b', fontSize: 11 }}>
                {link.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
