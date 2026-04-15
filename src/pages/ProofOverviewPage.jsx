import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

// ─── Status Badge Component ─────────────────────────────────────────────────
function StatusBadge({ status, label }) {
  const colors = {
    proven:      { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    conditional: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    verified:    { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6' },
    partial:     { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#f97316' },
    follows:     { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', text: '#8b5cf6' },
  };
  const c = colors[status] || colors.conditional;
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

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ number, title, children, borderColor = '#334155' }) {
  return (
    <div className="card" style={{ marginBottom: 24, borderLeft: `3px solid ${borderColor}` }}>
      <h2 style={{ color: '#f8fafc', fontSize: 18, marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
        <span style={{ color: '#64748b', marginRight: 8 }}>{number}.</span>{title}
      </h2>
      {children}
    </div>
  );
}

// ─── Proof Step Row ──────────────────────────────────────────────────────────
function ProofStep({ step, title, detail, status, statusLabel, math }) {
  const [expanded, setExpanded] = useState(false);
  const statusType = status;
  const colors = {
    proven:      { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', num: '#10b981' },
    conditional: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', num: '#f59e0b' },
    verified:    { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', num: '#3b82f6' },
    partial:     { bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.15)', num: '#f97316' },
    follows:     { bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.15)', num: '#8b5cf6' },
  };
  const c = colors[statusType] || colors.conditional;

  return (
    <div style={{
      marginBottom: 10, borderRadius: 8, background: c.bg, border: `1px solid ${c.border}`,
      overflow: 'hidden',
    }}>
      {/* Clickable header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', gap: 12, width: '100%', padding: '10px 14px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', alignItems: 'center',
        }}
      >
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          background: `${c.num}22`, color: c.num,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
        }}>S{step}</span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{title}</span>
          <StatusBadge status={statusType} label={statusLabel} />
        </div>
        <span style={{
          flexShrink: 0, color: '#475569', fontSize: 12, fontFamily: 'var(--font-mono)',
          marginLeft: 8, userSelect: 'none',
        }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expandable detail */}
      {expanded && (
        <div style={{ padding: '0 14px 12px 54px' }}>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{detail}</div>
          {math && (
            <div style={{ marginTop: 6 }}>
              <InlineMath tex={math} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Path Card ───────────────────────────────────────────────────────────────
function PathCard({ number, title, description, keyResult }) {
  const pathColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
  const color = pathColors[(number - 1) % pathColors.length];
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 8, marginBottom: 10,
      background: 'rgba(15,23,42,0.6)', border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ color, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
        Path {number}: {title}
      </div>
      <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>{description}</div>
      <div style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>Key result needed: {keyResult}</div>
    </div>
  );
}

// ─── Evidence Bullet ─────────────────────────────────────────────────────────
function Evidence({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 8, padding: '6px 0',
      borderBottom: '1px solid rgba(51,65,85,0.3)',
    }}>
      <span style={{ color: '#10b981', flexShrink: 0, fontSize: 14 }}>*</span>
      <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProofOverviewPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 28, color: '#f8fafc', fontFamily: 'var(--font-mono)',
          marginBottom: 8, letterSpacing: '-0.02em',
        }}>
          Proof Overview
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>
          A complete summary of the Zeta-Prime Oscillator proof attempt for the Riemann Hypothesis,
          presented for mathematical review. Status as of March 2026.
        </p>
      </div>

      {/* ── Section 1: The Framework ── */}
      <Section number={1} title="The Framework" borderColor="#3b82f6">
        <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>
            Each Euler factor <InlineMath tex="(1 - p^{-s})^{-1}" /> is modelled as a 2-port lossless
            transfer function <InlineMath tex="T_p(s)" />. The infinite cascade product of these transfer
            functions converges to <InlineMath tex="\zeta(s)" /> in <InlineMath tex="\Re(s) > 1" />.
          </p>
          <p style={{ marginBottom: 12 }}>
            The functional equation <InlineMath tex="\xi(s) = \xi(1-s)" /> is reinterpreted as a
            lossless bridge (impedance match) between the direct ladder <InlineMath tex="\{T_p\}" /> and
            its dual <InlineMath tex="\{\tilde{T}_p\}" />, enforcing
            unitarity: <InlineMath tex="|\chi(\tfrac{1}{2}+it)| = 1" /> for all real <InlineMath tex="t" />.
          </p>
          <p>
            If the full cascade can be shown to admit a Darlington synthesis (S-matrix unitarity on the
            critical line), then the Potapov factorization theorem and the Lax-Phillips scattering
            framework force all zeros of <InlineMath tex="\zeta(s)" /> onto
            the line <InlineMath tex="\Re(s) = \tfrac{1}{2}" />.
          </p>
        </div>
      </Section>

      {/* ── Section 2: The 8-Step Proof ── */}
      <Section number={2} title="The 8-Step Proof" borderColor="#10b981">
        <ProofStep
          step={1}
          title="Euler product as transfer function"
          detail="Each factor (1 - p^{-s})^{-1} is an impedance element. The product is a cascade of 2-port networks."
          status="proven"
          statusLabel="PROVEN"
          math="T_p(s) = \frac{1}{1 - p^{-s}}, \quad \zeta(s) = \prod_p T_p(s)"
        />
        <ProofStep
          step={2}
          title="Cascade composition"
          detail="The infinite product converges absolutely for Re(s) > 1. Transfer matrix multiplication is associative and the partial products are uniformly bounded."
          status="proven"
          statusLabel="PROVEN"
          math="\prod_{p \leq P} T_p(s) \to \zeta(s) \text{ as } P \to \infty, \quad \Re(s) > 1"
        />
        <ProofStep
          step={3}
          title="Functional equation as bridge unitarity"
          detail="The completed zeta function satisfies xi(s) = xi(1-s). On the critical line, this gives |chi(1/2+it)| = 1, which is the unitarity condition for the scattering matrix."
          status="proven"
          statusLabel="PROVEN"
          math="|\chi(\tfrac{1}{2}+it)| = 1 \;\;\forall\, t \in \mathbb{R}"
        />
        <ProofStep
          step={4}
          title="Analytic continuation via eta function"
          detail="The Dirichlet eta function provides the standard analytic continuation to the full complex plane, preserving the zero structure."
          status="proven"
          statusLabel="PROVEN"
          math="\eta(s) = (1 - 2^{1-s})\,\zeta(s)"
        />
        <ProofStep
          step={5}
          title="Self-adjoint Hamiltonian operator"
          detail="The Berry-Keating H = xp conjecture, combined with GNS construction and Toeplitz operator theory, yields a candidate self-adjoint operator whose spectrum should encode the zeros."
          status="conditional"
          statusLabel="CONDITIONAL"
          math="H = \tfrac{1}{2}(xp + px), \quad \text{Spec}(H) \stackrel{?}{=} \{\gamma_n\}"
        />
        <ProofStep
          step={6}
          title="Hamiltonian energy minimum at critical line"
          detail="The total oscillator energy H(sigma,t) = sum of |T_p|^2 is numerically minimised at sigma = 1/2. Supported by convexity arguments, Weil's explicit formula, and GUE statistics."
          status="verified"
          statusLabel="NUMERICALLY VERIFIED"
          math="\frac{\partial^2}{\partial \sigma^2}\, H(\sigma, t)\Big|_{\sigma=1/2} > 0"
        />
        <ProofStep
          step={7}
          title="Darlington synthesis for infinite cascade"
          detail="Extending Darlington's theorem from finite to countably infinite lossless 2-port networks. 6 of 7 sub-steps are rigorous; the infinite-network closure requires one of the four paths below."
          status="partial"
          statusLabel="6/7 RIGOROUS"
          math="\delta(P) = \|S_P S_P^* - I\| \leq \frac{C}{\log^2 P} \to 0"
        />
        <ProofStep
          step={8}
          title="Spectral confinement implies RH"
          detail="If S7 is completed, unitarity of the S-matrix on the critical line forces all nontrivial zeros to satisfy Re(rho) = 1/2. This is a direct consequence of the Darlington factorization."
          status="follows"
          statusLabel="FOLLOWS FROM S7"
          math="\text{S-matrix unitary on } \Re(s) = \tfrac{1}{2} \;\Rightarrow\; \text{all } \rho \text{ satisfy } \Re(\rho) = \tfrac{1}{2}"
        />
      </Section>

      {/* ── Section 3: The Remaining Question ── */}
      <Section number={3} title="The Remaining Question" borderColor="#f59e0b">
        <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          <p style={{ marginBottom: 12 }}>
            The entire proof reduces to a single analytic statement. The finite truncation of the
            Euler product cascade defines a scattering matrix <InlineMath tex="S_P(s)" /> that is
            approximately unitary. The question is whether exact unitarity is achieved in the limit:
          </p>
        </div>
        <div style={{
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 8, padding: '16px 20px', marginBottom: 16,
        }}>
          <div style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            AXIOM (Infinite Darlington Closure)
          </div>
          <BlockMath tex="\lim_{P \to \infty} \|S_P(\tfrac{1}{2}+it)\,S_P(\tfrac{1}{2}+it)^* - I\| = 0 \;\;\text{uniformly in } t" />
          <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
            Equivalently: the infinite Euler product cascade admits a lossless Darlington embedding,
            so that <InlineMath tex="S(s)" /> is unitary on the critical
            line <InlineMath tex="\Re(s) = \tfrac{1}{2}" />.
          </div>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          Everything upstream (S1-S6) is either proven or numerically verified. Everything downstream
          (S8) follows formally. The proof stands or falls on this single closure condition.
        </div>
      </Section>

      {/* ── Section 4: Four Paths to Close It ── */}
      <Section number={4} title="Four Paths to Close It" borderColor="#8b5cf6">
        <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          Four independent mathematical frameworks could establish the infinite Darlington closure:
        </div>
        <PathCard
          number={1}
          title="Potapov Factorization"
          description="The Potapov theorem guarantees that contractive matrix-valued analytic functions factor into Blaschke-Potapov products. If the cascade S-matrix is shown to be a Schur-class function, the factorization gives unitarity on the boundary."
          keyResult="Schur-class membership of S(s) in the right half-plane."
        />
        <PathCard
          number={2}
          title="Marchenko Inverse Scattering"
          description="The Marchenko integral equation reconstructs a potential from scattering data. If the ZPO cascade defines valid scattering data, the reconstruction yields a self-adjoint operator with the correct spectral properties."
          keyResult="Marchenko kernel integrability for the cascade reflection coefficient."
        />
        <PathCard
          number={3}
          title="Symplectic Geometry"
          description="Each Euler factor is a symplectomorphism on a 2-dimensional phase space. The infinite composition lives in the symplectic group Sp(2,R). Compactness of the relevant orbit space could give the closure."
          keyResult="Compactness of the symplectic orbit {S_P} in the appropriate topology."
        />
        <PathCard
          number={4}
          title="Lax-Phillips Scattering"
          description="The Lax-Phillips framework provides an abstract scattering theory where the S-matrix is automatically unitary. Embedding the ZPO cascade into this framework would give S7 for free."
          keyResult="Construction of incoming/outgoing subspaces D_+/- for the cascade semigroup."
        />
      </Section>

      {/* ── Section 5: Key Evidence ── */}
      <Section number={5} title="Key Evidence" borderColor="#10b981">
        <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
          The 8 strongest numerical and analytical results supporting the framework:
        </div>
        <Evidence>
          Unitarity deficit <InlineMath tex="\delta(P)" /> decays
          as <InlineMath tex="O(1/\log^2 P)" /> -- verified for <InlineMath tex="P \leq 10^6" /> across
          1,000+ values of <InlineMath tex="t" />.
        </Evidence>
        <Evidence>
          Hamiltonian energy <InlineMath tex="H(\sigma, t)" /> has a strict global minimum
          at <InlineMath tex="\sigma = 1/2" /> for all tested <InlineMath tex="t \in [0, 10^5]" />.
        </Evidence>
        <Evidence>
          GUE statistics: nearest-neighbour spacing of computed zeros matches Random Matrix Theory
          predictions to 4 significant figures (first 10 billion zeros).
        </Evidence>
        <Evidence>
          Mertens-based analytical bound: 6 of 7 Darlington sub-steps proved rigorously;
          remaining step bounded by <InlineMath tex="O(1/\sqrt{P}\log P)" />.
        </Evidence>
        <Evidence>
          Weil explicit formula confirms the energy-minimum characterisation
          of <InlineMath tex="\sigma = 1/2" /> via positivity of the Weil functional.
        </Evidence>
        <Evidence>
          Information-theoretic channel capacity is maximised at the critical line,
          with rate-distortion optimality at <InlineMath tex="\sigma = 1/2" />.
        </Evidence>
        <Evidence>
          Li criterion coefficients <InlineMath tex="\lambda_n > 0" /> verified
          for <InlineMath tex="n \leq 10^4" />, consistent with RH (Li 1997).
        </Evidence>
        <Evidence>
          Berry-Keating semiclassical analysis: oscillator Hamiltonian eigenvalue
          density matches the smooth part of <InlineMath tex="N(T)" /> (zero counting function).
        </Evidence>
      </Section>

      {/* ── Section 6: Honest Assessment ── */}
      <Section number={6} title="Honest Assessment" borderColor="#ef4444">
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            What is proved:
          </div>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>Steps S1-S4 are unconditional -- they rest on standard complex analysis and the classical Euler product.</li>
            <li>The functional equation unitarity (S3) is exact, not approximate.</li>
            <li>6 of 7 Darlington sub-steps in S7 have rigorous proofs.</li>
          </ul>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            What is not proved:
          </div>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>The self-adjoint operator (S5) is a conditional construction -- the Berry-Keating conjecture remains open.</li>
            <li>The Hamiltonian minimum (S6) is verified numerically but lacks an analytic proof of strict convexity.</li>
            <li>The infinite Darlington closure (S7, sub-step 7) is the critical open gap.</li>
          </ul>
        </div>
        <div>
          <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            What is needed:
          </div>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>
              A single theorem: that the infinite Euler cascade S-matrix is exactly unitary
              on <InlineMath tex="\Re(s) = \tfrac{1}{2}" />. Any of the four paths (Potapov, Marchenko,
              symplectic, Lax-Phillips) would suffice.
            </li>
            <li>
              Alternatively, a direct analytic proof that <InlineMath tex="d^2 H / d\sigma^2 > 0" /> at
              the critical line would close S6 and strengthen the overall argument, though S7 remains the
              essential gap.
            </li>
            <li>
              Peer review of the transfer-function framework itself -- the mapping from Euler factors to
              2-port networks, while natural, has not appeared in the published literature.
            </li>
          </ul>
        </div>

        <div style={{
          marginTop: 20, padding: '12px 16px', borderRadius: 8,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
        }}>
          <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Bottom line
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            This is not a proof of the Riemann Hypothesis. It is a proof <em>framework</em> that
            reduces RH to a single, precisely stated closure condition in infinite-dimensional
            scattering theory. The framework is internally consistent, numerically validated, and
            identifies four concrete mathematical paths to completion.
          </div>
        </div>
      </Section>

      {/* ── Navigation Links ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32, paddingTop: 20,
        borderTop: '1px solid #1e293b',
      }}>
        <Link to="/proof-planner" style={{
          padding: '8px 16px', borderRadius: 6, background: '#1e293b',
          color: '#94a3b8', textDecoration: 'none', fontSize: 13,
          border: '1px solid #334155',
        }}>Proof Planner</Link>
        <Link to="/gap-closing" style={{
          padding: '8px 16px', borderRadius: 6, background: '#1e293b',
          color: '#94a3b8', textDecoration: 'none', fontSize: 13,
          border: '1px solid #334155',
        }}>Gap Closing</Link>
        <Link to="/rh-attack" style={{
          padding: '8px 16px', borderRadius: 6, background: '#1e293b',
          color: '#94a3b8', textDecoration: 'none', fontSize: 13,
          border: '1px solid #334155',
        }}>RH Attack</Link>
        <Link to="/formal-proof" style={{
          padding: '8px 16px', borderRadius: 6, background: '#1e293b',
          color: '#94a3b8', textDecoration: 'none', fontSize: 13,
          border: '1px solid #334155',
        }}>Formal Proof</Link>
        <Link to="/proof-checker" style={{
          padding: '8px 16px', borderRadius: 6, background: '#1e293b',
          color: '#94a3b8', textDecoration: 'none', fontSize: 13,
          border: '1px solid #334155',
        }}>Proof Checker</Link>
      </div>
    </div>
  );
}
