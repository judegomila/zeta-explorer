// KypBoundedRealPage.jsx -- imp-1201
// Companion page for Apps M-O of research-inputs/twin_ladder_consolidated_v52.pdf
// (pages 97-110). Renders the KYP state-space LMI, bounded-real delay, and
// delay-Gram positivity frameworks as a control-theoretic bridge to the
// no-ghost / bridge-losslessness problem.
//
// Structure:
//   1. Header + setup (bridge ratio, Schur condition, prime-delay representation).
//   2. Parallel-delay realization diagram (inline SVG, no D3).
//   3. Per-App cards (M / N / O): statement + LaTeX + status + blocker + principle.
//   4. Conjectures M.1 and O.1.
//   5. Numerical certificates table.
//   6. Open sub-problems list.
//   7. Related-pages footer.
//
// Structural facts come from src/data/kyp-bounded-real-section.js (imp-1201).

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { KYP_BOUNDED_REAL } from '../data/kyp-bounded-real-section.js';

const K = KYP_BOUNDED_REAL;
const mono = 'var(--font-mono)';

// Color theme per App
const APP_COLORS = {
  'App M': { fg: '#06b6d4', bg: 'rgba(6,182,212,0.10)',  border: '#06b6d4' }, // cyan
  'App N': { fg: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: '#a855f7' }, // violet
  'App O': { fg: '#10b981', bg: 'rgba(16,185,129,0.10)', border: '#10b981' }, // emerald
};

// ── Parallel-delay realization diagram (inline SVG) ───────────────────────────
function ParallelDelayDiagram() {
  const primes = K.parallelDelayDiagram.primes.slice(0, 8);
  const W = 680;
  const H = 340;
  const inputX = 60;
  const inputY = H / 2;
  const outputX = W - 60;
  const summingX = W - 120;
  const laneH = (H - 60) / primes.length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 680, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Parallel-delay realization of the prime-delay system: input feeds delay lines at tau_p = log p for each prime p"
    >
      {/* Input node */}
      <circle cx={inputX} cy={inputY} r={18} fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="2" />
      <text x={inputX} y={inputY + 5} textAnchor="middle" fontFamily={mono} fontSize="13" fill="#06b6d4">u</text>

      {/* Summing junction */}
      <circle cx={summingX} cy={inputY} r={18} fill="rgba(248,113,113,0.12)" stroke="#f87171" strokeWidth="2" />
      <text x={summingX} y={inputY - 4} textAnchor="middle" fontFamily={mono} fontSize="16" fontWeight="700" fill="#f87171">+</text>
      <text x={summingX} y={inputY + 12} textAnchor="middle" fontFamily={mono} fontSize="10" fill="#94a3b8">sum</text>

      {/* Output arrow */}
      <line x1={summingX + 18} y1={inputY} x2={outputX - 10} y2={inputY} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={outputX + 4} y={inputY + 5} fontFamily={mono} fontSize="13" fill="#a855f7">y</text>

      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
      </defs>

      {/* Per-prime delay lanes */}
      {primes.map((p, i) => {
        const laneY = 30 + i * laneH + laneH / 2;
        const delayX = 260;
        const delayW = 120;
        const delayH2 = 28;
        const hue = `hsl(${180 + i * 22}, 70%, 60%)`;
        return (
          <g key={p}>
            {/* Fan-out from input */}
            <line x1={inputX + 18} y1={inputY} x2={inputX + 50} y2={inputY} stroke="#475569" strokeWidth="1" />
            <line x1={inputX + 50} y1={inputY} x2={inputX + 50} y2={laneY} stroke="#475569" strokeWidth="1" />
            <line x1={inputX + 50} y1={laneY} x2={delayX - 4} y2={laneY} stroke="#475569" strokeWidth="1" markerEnd="url(#arr)" />

            {/* Delay block */}
            <rect
              x={delayX} y={laneY - delayH2 / 2}
              width={delayW} height={delayH2}
              rx="5" ry="5"
              fill="rgba(15,23,42,0.7)" stroke={hue} strokeWidth="1.5"
            />
            <text x={delayX + delayW / 2} y={laneY - 2} textAnchor="middle" fontFamily={mono} fontSize="11" fill={hue}>
              {`e^{-${p === 2 ? '\\log 2' : p === 3 ? '\\log 3' : `\\log ${p}`} z}`}
            </text>
            <text x={delayX + delayW / 2} y={laneY + 12} textAnchor="middle" fontFamily={mono} fontSize="10" fill="#94a3b8">
              {`p=${p}, tau=${Math.log(p).toFixed(3)}`}
            </text>

            {/* Fan-in to summing junction */}
            <line x1={delayX + delayW + 4} y1={laneY} x2={summingX - 20} y2={laneY} stroke="#475569" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1={summingX - 20} y1={laneY} x2={summingX - 20} y2={inputY} stroke="#475569" strokeWidth="1" />
            <line x1={summingX - 20} y1={inputY} x2={summingX - 18} y2={inputY} stroke="#475569" strokeWidth="1" />
          </g>
        );
      })}

      {/* Label */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontFamily={mono} fontSize="11" fill="#64748b">
        Parallel prime-delay realization of Sigma_a (first 8 primes shown)
      </text>
    </svg>
  );
}

// ── Per-App card ──────────────────────────────────────────────────────────────
function AppCard({ app }) {
  const col = APP_COLORS[app.label] || { fg: '#e2e8f0', bg: 'rgba(0,0,0,0)', border: '#475569' };
  return (
    <div
      className="card"
      style={{ marginTop: 16, borderLeft: `4px solid ${col.border}`, background: col.bg }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ color: col.fg, margin: 0, fontSize: 20 }}>
          {app.label}: {app.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: '#64748b' }}>
          {app.sectionRef}
        </span>
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <BlockMath tex={app.latexFormula} />
      </div>

      <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        <strong style={{ color: col.fg }}>Statement. </strong>
        {app.statement}
      </p>

      <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        <strong style={{ color: '#fbbf24' }}>Current status. </strong>
        {app.currentStatus}
      </p>

      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          borderLeft: '2px solid #ef4444',
          background: 'rgba(15,23,42,0.5)',
        }}
      >
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7 }}>
          <strong style={{ color: '#f87171' }}>Blocker. </strong>
          {app.blocker}
        </p>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: '#94a3b8' }}>
        <em>{app.principle}</em>
      </p>
    </div>
  );
}

// ── Conjecture card ───────────────────────────────────────────────────────────
function ConjectureCard({ conj }) {
  return (
    <div
      className="card"
      style={{ marginTop: 16, borderLeft: '4px solid #a855f7', background: 'rgba(168,85,247,0.04)' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ color: '#a855f7', margin: 0, fontSize: 18 }}>
          {conj.label}: {conj.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: '#64748b' }}>
          {conj.sectionRef}
        </span>
        {conj.impliesRH && (
          <span
            style={{
              fontFamily: mono, fontSize: 11, padding: '2px 8px',
              borderRadius: 4, color: '#10b981',
              background: 'rgba(16,185,129,0.10)', border: '1px solid #10b981',
            }}
          >
            implies RH
          </span>
        )}
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <BlockMath tex={conj.latexFormula} />
      </div>

      <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        {conj.statement}
      </p>

      <p style={{ marginTop: 10, color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
        <em>{conj.note}</em>
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function KypBoundedRealPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>KYP Bounded-Real (Apps M-O)</h1>
        <p className="page-subtitle" style={{ fontFamily: mono, color: 'var(--text-secondary)' }}>
          {K.title} &mdash; {K.paperRef}
        </p>
      </div>

      {/* ─── Intro ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>Control-theoretic bridge to no-ghost</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          Appendices M, N, and O translate the bridge-kernel positivity condition
          <InlineMath tex={'\\;K_a \\succeq 0\\;'} />
          (equivalent to RH by para 16, Theorem 16.1) into three control-theoretic
          languages. The central object is the shifted bridge ratio
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={K.setup.bridgeRatioLaTeX} />
        </div>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          whose Schur condition is the same as RH:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={K.setup.schurConditionLaTeX} />
        </div>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          Because <InlineMath tex="\Theta_a" /> is the transfer function of the
          prime-delay system <InlineMath tex="\Sigma_a" />, standard tools from
          robust control theory apply: the KYP lemma (App M), the bounded-real
          Lyapunov-Krasovskii approach (App N), and the Gram-matrix Cholesky
          pilot (App O). All three route certification of losslessness to the
          same shared bottleneck as Routes A-D in para 16.
        </p>
        <p style={{ marginTop: 10, color: '#94a3b8', fontSize: 12, lineHeight: 1.7, fontFamily: mono }}>
          {K.subtitle}
        </p>
      </div>

      {/* ─── Setup: prime-delay representation ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>Prime-delay representation</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          The completed zeta function has the cosh-representation
          <InlineMath tex={'\\; X(w) = \\int_0^\\infty \\Phi(u)\\cosh(wu)\\,du'} />.
          In the bridge ratio this produces an infinite sum of exponential delays:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={K.setup.primeDelayLaTeX} />
        </div>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          Each prime <InlineMath tex="p" /> contributes delay lines at integer
          multiples of <InlineMath tex="\log p" />. By Baker{String.fromCharCode(8217)}s theorem (1966) the
          delays <InlineMath tex="\{\log p\}_p" /> are linearly independent over
          <InlineMath tex="\mathbb{Q}" />, making the prime-delay ladder infinite-dimensional
          and ruling out a finite-dimensional state-space realization.
        </p>
      </div>

      {/* ─── Parallel-delay diagram ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#a855f7', marginBottom: 8 }}>Parallel-delay realization of {String.fromCharCode(931)}<sub>a</sub></h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          The prime-delay system <InlineMath tex="\Sigma_a" /> has a parallel realization:
          input <InlineMath tex="u(t)" /> fans out to independent delay channels at
          <InlineMath tex="\tau_p = \log p" /> for each prime <InlineMath tex="p" />,
          then sums with bridge weights <InlineMath tex="c_{p,m}(a)" /> to form
          <InlineMath tex="y(t)" />. The KYP certificate is a block-diagonal operator
          <InlineMath tex="P = \mathrm{diag}(P_{p,m})" /> on <InlineMath tex="\ell^2" />.
        </p>
        <ParallelDelayDiagram />
      </div>

      {/* ─── Per-app cards ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        The three appendices
      </h2>
      {K.apps.map((app) => (
        <AppCard key={app.label} app={app} />
      ))}

      {/* ─── Conjectures ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Concrete next targets
      </h2>
      {K.conjectures.map((conj) => (
        <ConjectureCard key={conj.label} conj={conj} />
      ))}

      {/* ─── Numerical certificates table ─── */}
      <div className="card" style={{ marginTop: 28 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 12 }}>Numerical certificates at a glance</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>App</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>Method</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>a</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>N</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              { app: 'App M', method: 'KYP LMI (SDP)', a: '0.50', n: '20', result: 'P_{20} > 0, lambda_min ~ 0.013' },
              { app: 'App M', method: 'KYP LMI (SDP)', a: '0.25', n: '50', result: 'P_{50} > 0, lambda_min ~ 2.4e-4' },
              { app: 'App N', method: 'Delay-LMI', a: '0.10', n: '10', result: 'passivity margin ~ 0.008' },
              { app: 'App N', method: 'Delay-LMI', a: '0.10', n: '20', result: 'passivity margin ~ 0.003' },
              { app: 'App O', method: 'Cholesky pilot', a: '0.025', n: '50', result: 'lambda_min ~ 1.4e-4, clean' },
              { app: 'App O', method: 'Cholesky pilot', a: '0.010', n: '20', result: 'lambda_min ~ 3.8e-5, clean' },
              { app: 'App O', method: 'Cholesky pilot', a: '0.005', n: '10', result: 'lambda_min ~ 1.1e-5, clean' },
            ].map((row, i) => {
              const col = APP_COLORS[row.app] || { fg: '#e2e8f0' };
              return (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px 6px', color: col.fg, fontFamily: mono, fontWeight: 700 }}>{row.app}</td>
                  <td style={{ padding: '10px 6px', color: '#cbd5e1' }}>{row.method}</td>
                  <td style={{ padding: '10px 6px', color: '#94a3b8', fontFamily: mono }}>{row.a}</td>
                  <td style={{ padding: '10px 6px', color: '#94a3b8', fontFamily: mono }}>{row.n}</td>
                  <td style={{ padding: '10px 6px', color: '#64748b', fontFamily: mono, fontSize: 12 }}>{row.result}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: '#475569', fontSize: 12, fontFamily: mono }}>
          All pilots confirm positivity; no off-critical zero detected in any tested parameter range.
        </p>
      </div>

      {/* ─── Open sub-problems ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '4px solid #f43f5e', background: 'rgba(244,63,94,0.04)' }}>
        <h3 style={{ color: '#f43f5e', marginBottom: 10 }}>Open sub-problems (shared bottleneck)</h3>
        <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
          {K.landscape.openSubproblems.map((p, i) => (
            <li key={i} style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
              {p}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 14, color: '#94a3b8', fontSize: 12, lineHeight: 1.7, fontFamily: mono }}>
          {K.landscape.controlTheoreticEquivalence}
        </p>
      </div>

      {/* ─── Related pages ─── */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/closure-routes" style={{ color: '#06b6d4', fontSize: 13 }}>
            Four Closure Routes
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/twin-ladder" style={{ color: '#a855f7', fontSize: 13 }}>
            Twin Ladder
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/blaschke-ghosts" style={{ color: '#ec4899', fontSize: 13 }}>
            Blaschke Ghosts
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/three-attacks" style={{ color: '#ef4444', fontSize: 13 }}>
            Three Attacks
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rh-attack" style={{ color: '#fbbf24', fontSize: 13 }}>
            RH Attack
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/proof-overview" style={{ color: '#10b981', fontSize: 13 }}>
            Proof Overview
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/lambda-bounds" style={{ color: '#3b82f6', fontSize: 13 }}>
            Λ Bounds
          </Link>
        </div>
      </div>
    </div>
  );
}
