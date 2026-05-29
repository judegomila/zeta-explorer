import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath } from '../components/KaTeXMath.jsx';

// Status Badge
function StatusBadge({ status, label }) {
  const colors = {
    active:      { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    conditional: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    blocked:     { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
    research:    { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6' },
  };
  const c = colors[status] || colors.research;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
      letterSpacing: '0.03em', verticalAlign: 'middle', marginLeft: 8,
    }}>
      {label}
    </span>
  );
}

// Path Card
function PathCard({ path, title, status, statusLabel, description, progress, blockedBy, links }) {
  const [expanded, setExpanded] = useState(false);
  const pathColors = {
    A: '#8b5cf6', // Hilbert-Pólya (purple)
    B: '#3b82f6', // Darlington (blue)
    C: '#10b981', // Weil Positivity (green)
    D: '#f59e0b', // Nyman-Beurling (amber)
    E: '#ec4899', // Li Criterion (pink)
  };
  const color = pathColors[path] || '#64748b';

  return (
    <div style={{
      marginBottom: 16, borderRadius: 8, background: 'rgba(15,23,42,0.5)',
      border: `1px solid ${color}44`, overflow: 'hidden',
    }}>
      <button
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', gap: 12, width: '100%', padding: '12px 16px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
            background: `${color}22`, color, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)',
          }}>
            {path}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{title}</span>
              <StatusBadge status={status} label={statusLabel} />
            </div>
            {blockedBy && blockedBy.length > 0 && (
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                Blocked by: {blockedBy.join(', ')}
              </div>
            )}
          </div>
        </div>
        <span style={{
          flexShrink: 0, color: '#475569', fontSize: 12, fontFamily: 'var(--font-mono)',
          userSelect: 'none',
        }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ padding: '12px 16px 16px 60px' }}>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
            {description}
          </div>
          {progress && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Progress</div>
              <div style={{
                height: 6, background: 'rgba(148,163,184,0.1)', borderRadius: 3,
                overflow: 'hidden', marginBottom: 4,
              }}>
                <div style={{
                  height: '100%', width: `${progress}%`, background: color,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{progress}% complete</div>
            </div>
          )}
          {links && links.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {links.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    fontSize: 12, color: '#38bdf8', textDecoration: 'none',
                    padding: '4px 8px', background: 'rgba(56,189,248,0.1)',
                    borderRadius: 4, border: '1px solid #38bdf844',
                  }}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Section wrapper
function Section({ title, children, borderColor = '#334155' }) {
  return (
    <div className="card" style={{ marginBottom: 24, borderLeft: `3px solid ${borderColor}` }}>
      <h2 style={{ color: '#f8fafc', fontSize: 18, marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function RHProofStateDashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>RH Proof State Dashboard</h1>
        <p>
          Current status of all attack vectors and proof strategies. This is a single-page summary
          of the Riemann Hypothesis proof landscape after May 2026, tracking progress on five
          fundamental approaches.
        </p>
      </div>

      {/* Headline metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>PROOF PATHS</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>5</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Active attack vectors</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>CRITICAL DEPENDENCY</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>Montgomery PCC</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Required for unconditional proof</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>MAIN BOTTLENECK</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>‖V_{'{a,Φ}'}‖ ≤ 1</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>§15-27 collapse target</div>
        </div>
      </div>

      {/* Proof Paths Section */}
      <Section title="Five Attack Paths" borderColor="#8b5cf6">
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          Five fundamentally different strategies for proving RH, each with distinct proof gaps,
          progress, and dependencies. Click each to expand details and see related pages.
        </p>

        <PathCard
          path="A"
          title="Hilbert-Pólya"
          status="research"
          statusLabel="FOUNDATIONAL"
          description="The ZPO oscillator framework connects zeta zeros to resonances of a Hamiltonian operator. Physical intuition is strong but the rigorous connection between zeta zeros and Hamiltonian eigenvalues remains unproven. This framework motivates all downstream work."
          progress={35}
          blockedBy={['S5']}
          links={[{ label: 'ZPO Framework', to: '/zeta' }]}
        />

        <PathCard
          path="B"
          title="Darlington Synthesis"
          status="conditional"
          statusLabel="BLOCKED ON PCC"
          description="Uses classical network synthesis theory: transmission zeros of lossless reciprocal networks lie on the imaginary axis. The ZPO network should be lossless at σ=1/2, but requires Montgomery PCC at 2-point to guarantee the cascade converges."
          progress={25}
          blockedBy={['S4', 'S7']}
          links={[{ label: 'Attack Strategies', to: '/rh-attack' }]}
        />

        <PathCard
          path="C"
          title="Weil Positivity"
          status="active"
          statusLabel="IN DEVELOPMENT"
          description="The de Branges-Romanov formalism reduces RH to positivity of a kernel operator on L². The §15-27 hidden-square program focuses on proving ‖V_{'{a,Φ}'}‖ ≤ 1, which implies the kernel is non-negative. Empirical support is ~5000× from saturation."
          progress={45}
          blockedBy={['S4']}
          links={[{ label: 'Hidden Square Program', to: '/hidden-square-program' }, { label: 'Closure Routes', to: '/closure-routes' }]}
        />

        <PathCard
          path="D"
          title="Nyman-Beurling"
          status="research"
          statusLabel="NOVEL ANGLE"
          description="Density criterion reformulation (1955): complete span of Dirichlet approximants in L² is equivalent to RH. Recently rediscovered as a parallel approach. Strong theoretical foundation but computationally unexplored in this context."
          progress={20}
          blockedBy={[]}
          links={[{ label: 'RH Equivalents', to: '/rh-equivalents' }]}
        />

        <PathCard
          path="E"
          title="Li Criterion"
          status="conditional"
          statusLabel="CONDITIONAL"
          description="Positivity of the logarithmic derivative coefficients λ_n > 0 ∀n ⟺ RH. Computationally elegant and widely studied, but depends on numerical verification of coefficients to a given height. Not a path to unconditional proof without density results."
          progress={40}
          blockedBy={[]}
          links={[{ label: 'Statistics Dashboard', to: '/statistics' }]}
        />
      </Section>

      {/* PCC Route Exhaustion */}
      <Section title="Montgomery Pair Correlation Conjecture (PCC) Routes" borderColor="#3b82f6">
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          Five distinct analytical routes toward proving Montgomery PCC at 2-point, which is
          required for paths B and (conditionally) C. Recent work shows these 5 routes may
          be related via a hidden symmetry.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { name: 'Hilbert-Schmidt Sufficient Condition', status: 'active', id: 'imp-1267' },
            { name: 'Mellin Diagonalization Route', status: 'research', id: 'imp-1266' },
            { name: 'Koksma-Hlawka 2nd Moment', status: 'blocked', id: 'imp-1315' },
            { name: 'GUE-free Deep Regime', status: 'research', id: 'imp-1185' },
            { name: 'Bui-Soundararajan Density Attack', status: 'active', id: 'imp-1261' },
          ].map((route) => (
            <div key={route.id} style={{
              padding: 12, borderRadius: 8, background: 'rgba(15,23,42,0.5)',
              border: `1px solid #${route.status === 'active' ? '10b98144' : '64748b44'}`,
            }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                {route.status === 'active' && '✓ '}
                {route.status === 'blocked' && '✗ '}
                {route.status === 'research' && '◇ '}
              </div>
              <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 4 }}>{route.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{route.id}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* V-norm Collapse */}
      <Section title="§15-27 Hidden Square Program" borderColor="#f59e0b">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>The Collapse</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
              7+ named paper conjectures (16.4, 16.6, 17.3, 18.1, 25.2/25.3, 26.3/26.4, 27.2)
              all reduce to a single statement:
            </p>
            <div style={{
              padding: 12, background: 'rgba(245,158,11,0.1)', borderRadius: 8,
              border: '1px solid #f59e0b44', marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, color: '#f59e0b', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
                ‖V_{'{a,Φ}'}‖_{'{L²}'}([0,∞)) ≤ 1<br />
                for every a &gt; 0
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>
              This operator-norm bound is both necessary and sufficient for the full §15-27
              closure via de Branges-Romanov positivity.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>Empirical Support</h3>
            <div style={{
              padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 8,
              border: '1px solid #10b98144', marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>
                ‖V‖ ≤ 1.86×10⁻⁴
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                60+ grid points, U ≤ 100, N ≤ 10100
              </div>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
              <strong>Distance to saturation:</strong> ~5000×. The empirical bound is
              extraordinarily tight with no sign of growth, suggesting an unconditional proof
              may be within reach.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/hidden-square-program" style={{
            display: 'inline-block', padding: '8px 12px', background: 'rgba(245,158,11,0.15)',
            border: '1px solid #f59e0b44', borderRadius: 4, color: '#f59e0b',
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>
            Full Hidden Square Program →
          </Link>
        </div>
      </Section>

      {/* Recommended Reading */}
      <Section title="Navigate the Proof Landscape" borderColor="#64748b">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div style={{ padding: 12, background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>PROOF FRAMEWORKS</div>
            <Link to="/proof-overview" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>
              Proof Overview →
            </Link>
          </div>
          <div style={{ padding: 12, background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>ATTACK STRATEGIES</div>
            <Link to="/rh-attack" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>
              RH Attack Strategies →
            </Link>
          </div>
          <div style={{ padding: 12, background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>VISUALIZATIONS</div>
            <Link to="/visualizations" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>
              Viz Index →
            </Link>
          </div>
          <div style={{ padding: 12, background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>CURRENT PAPER</div>
            <Link to="/papers" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>
              v52 Paper Details →
            </Link>
          </div>
          <div style={{ padding: 12, background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>PCC EXHAUSTION</div>
            <Link to="/pcc-route-exhaustion" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>
              5 Routes Summary →
            </Link>
          </div>
          <div style={{ padding: 12, background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>IMPROVEMENTS LOG</div>
            <Link to="/improvements" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>
              All Sessions →
            </Link>
          </div>
        </div>
      </Section>

      {/* Footer note */}
      <div style={{
        marginTop: 32, padding: 16, background: 'rgba(30,41,59,0.6)', borderRadius: 8,
        border: '1px solid #334155',
      }}>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
          This dashboard reflects the state as of <strong>2026-05-28</strong>. The five proof paths
          represent the full landscape of approaches being pursued. Updates to this dashboard are
          logged via the improvements engine. For the latest session activity, see the{' '}
          <Link to="/improvements" style={{ color: '#38bdf8', textDecoration: 'none' }}>improvements log</Link>.
        </p>
      </div>
    </div>
  );
}
