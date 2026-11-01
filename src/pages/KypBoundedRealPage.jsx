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
//   5. Unverified historical numerical reports.
//   6. Open sub-problems list.
//   7. Related-pages footer.
//
// Structural facts come from src/data/kyp-bounded-real-section.js (imp-1201).
// Editorial (warm) re-theme: full-width shell, identical structure/data (imp-1201 port).

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { KYP_BOUNDED_REAL } from '../data/kyp-bounded-real-section.js';

const K = KYP_BOUNDED_REAL;
const mono = 'var(--ed-mono, var(--font-mono))';

// Color theme per App (warm accents: blue / brass / green)
const APP_COLORS = {
  'App M': { fg: 'var(--blue)', bg: 'rgba(63,107,134,0.08)', border: 'var(--blue)' },
  'App N': { fg: 'var(--brass)', bg: 'rgba(140,106,29,0.08)', border: 'var(--brass)' },
  'App O': { fg: 'var(--green)', bg: 'rgba(76,122,74,0.08)', border: 'var(--green)' },
};

// Warm rotation for the per-prime delay lanes in the SVG diagram.
function laneHue(i) {
  return `hsl(${25 + i * 30}, 55%, 38%)`;
}

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
      aria-label="Proposed parallel-delay schematic, not a verified arithmetic realization: first eight prime delays"
    >
      {/* Input node */}
      <circle cx={inputX} cy={inputY} r={18} fill="rgba(63,107,134,0.12)" stroke="#3f6b86" strokeWidth="2" />
      <text x={inputX} y={inputY + 5} textAnchor="middle" fontFamily={mono} fontSize="13" fill="#3f6b86">u</text>

      {/* Summing junction */}
      <circle cx={summingX} cy={inputY} r={18} fill="rgba(194,58,28,0.10)" stroke="#c23a1c" strokeWidth="2" />
      <text x={summingX} y={inputY - 4} textAnchor="middle" fontFamily={mono} fontSize="16" fontWeight="700" fill="#c23a1c">+</text>
      <text x={summingX} y={inputY + 12} textAnchor="middle" fontFamily={mono} fontSize="10" fill="#877b67">sum</text>

      {/* Output arrow */}
      <line x1={summingX + 18} y1={inputY} x2={outputX - 10} y2={inputY} stroke="#4a4238" strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={outputX + 4} y={inputY + 5} fontFamily={mono} fontSize="13" fill="#8c6a1d">y</text>

      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a4238" />
        </marker>
      </defs>

      {/* Per-prime delay lanes */}
      {primes.map((p, i) => {
        const laneY = 30 + i * laneH + laneH / 2;
        const delayX = 260;
        const delayW = 120;
        const delayH2 = 28;
        const hue = laneHue(i);
        return (
          <g key={p}>
            {/* Fan-out from input */}
            <line x1={inputX + 18} y1={inputY} x2={inputX + 50} y2={inputY} stroke="#4a4238" strokeWidth="1" />
            <line x1={inputX + 50} y1={inputY} x2={inputX + 50} y2={laneY} stroke="#4a4238" strokeWidth="1" />
            <line x1={inputX + 50} y1={laneY} x2={delayX - 4} y2={laneY} stroke="#4a4238" strokeWidth="1" markerEnd="url(#arr)" />

            {/* Delay block */}
            <rect
              x={delayX} y={laneY - delayH2 / 2}
              width={delayW} height={delayH2}
              rx="5" ry="5"
              fill="#f6f1e7" stroke={hue} strokeWidth="1.5"
            />
            <text x={delayX + delayW / 2} y={laneY - 2} textAnchor="middle" fontFamily={mono} fontSize="11" fill={hue}>
              {`e^{-${p === 2 ? '\\log 2' : p === 3 ? '\\log 3' : `\\log ${p}`} z}`}
            </text>
            <text x={delayX + delayW / 2} y={laneY + 12} textAnchor="middle" fontFamily={mono} fontSize="10" fill="#877b67">
              {`p=${p}, tau=${Math.log(p).toFixed(3)}`}
            </text>

            {/* Fan-in to summing junction */}
            <line x1={delayX + delayW + 4} y1={laneY} x2={summingX - 20} y2={laneY} stroke="#4a4238" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1={summingX - 20} y1={laneY} x2={summingX - 20} y2={inputY} stroke="#4a4238" strokeWidth="1" />
            <line x1={summingX - 20} y1={inputY} x2={summingX - 18} y2={inputY} stroke="#4a4238" strokeWidth="1" />
          </g>
        );
      })}

      {/* Label */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontFamily={mono} fontSize="11" fill="#877b67">
        Proposed prime-delay schematic (first 8 primes; not a verified realization)
      </text>
    </svg>
  );
}

// ── Per-App card ──────────────────────────────────────────────────────────────
function AppCard({ app }) {
  const col = APP_COLORS[app.label] || { fg: 'var(--ink)', bg: 'rgba(0,0,0,0)', border: 'var(--hairline)' };
  return (
    <div
      className="card"
      style={{ marginTop: 16, borderLeft: `4px solid ${col.border}`, background: col.bg }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ color: col.fg, margin: 0, fontSize: 20 }}>
          {app.label}: {app.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: 'var(--faint)' }}>
          {app.sectionRef}
        </span>
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <BlockMath tex={app.latexFormula} />
      </div>

      <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
        <strong style={{ color: col.fg }}>Statement. </strong>
        {app.statement}
      </p>

      {app.derivationLaTeX && (
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={app.derivationLaTeX} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{app.derivation}</p>
        </div>
      )}

      <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
        <strong style={{ color: 'var(--brass-dk)' }}>Current status. </strong>
        {app.currentStatus}
      </p>

      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          borderLeft: '2px solid var(--terra-dk)',
          background: 'var(--paper)',
        }}
      >
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--terra-dk)' }}>Blocker. </strong>
          {app.blocker}
        </p>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: 'var(--faint)' }}>
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
      style={{ marginTop: 16, borderLeft: '4px solid var(--brass)', background: 'rgba(140,106,29,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ color: 'var(--brass)', margin: 0, fontSize: 18 }}>
          {conj.label}: {conj.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: 'var(--faint)' }}>
          {conj.sectionRef}
        </span>
        {conj.impliesRH && (
          <span
            style={{
              fontFamily: mono, fontSize: 11, padding: '2px 8px',
              borderRadius: 4, color: 'var(--green)',
              background: 'rgba(76,122,74,0.10)', border: '1px solid var(--green)',
            }}
          >
            implies RH
          </span>
        )}
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <BlockMath tex={conj.latexFormula} />
      </div>

      <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
        {conj.statement}
      </p>

      <p style={{ marginTop: 10, color: 'var(--faint)', fontSize: 12, lineHeight: 1.7 }}>
        <em>{conj.note}</em>
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function KypBoundedRealPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>twin-ladder · KYP / bounded-real</span>} />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>KYP Bounded-Real (Apps M&ndash;O)</h1>
        <p style={{ fontFamily: mono, color: 'var(--ink-soft)', fontSize: 14, marginBottom: 8 }}>
          {K.title} &mdash; {K.paperRef}
        </p>

        {/* ─── Verdict banner (imp-2785) ─── */}
        <div
          className="card"
          style={{
            marginTop: 12,
            borderLeft: '4px solid var(--brass-dk)',
            background: 'rgba(181,138,46,0.08)',
          }}
          role="note"
          aria-label="Verdict: proposed realizations and unverified reports, not a proof"
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: mono, fontSize: 11, padding: '2px 8px', borderRadius: 4,
                color: 'var(--brass-dk)', background: 'rgba(181,138,46,0.14)', border: '1px solid var(--brass-dk)',
              }}
            >
              VERDICT: PROPOSED REALIZATIONS; REPORTS UNVERIFIED
            </span>
          </div>
          <p style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            Stable analytic Schur contractivity of the bridge ratio is the RH-strength
            target. A finite-dimensional bounded-real condition is valid only for an
            actual model satisfying its hypotheses; an infinite-delay realization and
            its identification with the arithmetic bridge remain separate obligations.
            The seven numbers below are <strong>unverified historical reports, not
            replayed certificates</strong>. They establish neither positivity of a
            supplied truncation nor absence of off-critical zeros. This is
            <strong> not a near-complete proof step</strong>; see the
            {' '}<Link to="/closure-routes" style={{ color: 'var(--blue)' }}>four closure routes</Link>.
          </p>
        </div>

        <div className="card" style={{ marginTop: 16 }} role="note">
          <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>Positivity is not coercivity</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{K.positivityLimitNote}</p>
        </div>

        {/* ─── Intro ─── */}
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>Control-theoretic bridge to no-ghost</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.75 }}>
            Appendices M, N, and O propose control-theoretic routes to the bridge-kernel positivity condition
            <InlineMath tex={'\\;K_a \\succeq 0\\;'} />
            (equivalent to RH by para 16, Theorem 16.1) using three control-theoretic
            languages. The central object is the shifted bridge ratio
          </p>
          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <BlockMath tex={K.setup.bridgeRatioLaTeX} />
          </div>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.75 }}>
            whose Schur condition is the same as RH:
          </p>
          <div style={{ marginTop: 8, overflowX: 'auto' }}>
            <BlockMath tex={K.setup.schurConditionLaTeX} />
          </div>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.75 }}>
            If a well-posed stable model is separately shown to have the bridge ratio
            as its transfer function (with the correct half-plane change of variable),
            control-theoretic tools may apply. The finite-dimensional sufficient KYP
            condition (App M), conditional storage inequality (App N), and finite Gram
            diagnostic (App O) do not supply that identification themselves.
          </p>
          <p style={{ marginTop: 10, color: 'var(--faint)', fontSize: 12, lineHeight: 1.7, fontFamily: mono }}>
            {K.subtitle}
          </p>
        </div>

        {/* ─── Setup: prime-delay representation ─── */}
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>Proposed prime-delay representation</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
            The completed zeta function has the cosh-representation
            <InlineMath tex={'\\; X(w) = \\int_0^\\infty \\Phi(u)\\cosh(wu)\\,du'} />.
            The proposed delay description uses a formal Euler expansion, restricted below to its absolute-convergence region; it is not a global realization proof:
          </p>
          <div style={{ marginTop: 8, overflowX: 'auto' }}>
            <BlockMath tex={K.setup.primeDelayLaTeX} />
          </div>
          <p style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
            Each prime <InlineMath tex="p" /> supplies proposed delay labels at multiples
            of <InlineMath tex="\log p" />. These labels alone establish neither a
            state-space realization nor its transfer identity. Infinite sums, operator
            domains and continuation beyond the convergence region need separate justification.
          </p>
        </div>

        {/* ─── Parallel-delay diagram ─── */}
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ color: 'var(--brass)', marginBottom: 8 }}>Proposed parallel-delay schematic for {String.fromCharCode(931)}<sub>a</sub></h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            {K.parallelDelayDiagram.description}
          </p>
          <ParallelDelayDiagram />
        </div>

        {/* ─── Per-app cards ─── */}
        <h2 className="ed-h2" style={{ marginTop: 28, marginBottom: 4 }}>
          The three appendices
        </h2>
        {K.apps.map((app) => (
          <AppCard key={app.label} app={app} />
        ))}

        {/* ─── Conjectures ─── */}
        <h2 className="ed-h2" style={{ marginTop: 28, marginBottom: 4 }}>
          Concrete next targets
        </h2>
        {K.conjectures.map((conj) => (
          <ConjectureCard key={conj.label} conj={conj} />
        ))}

        {/* ─── Unverified historical reports ─── */}
        <div className="card" style={{ marginTop: 28 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: 12 }}>Historical numerical reports — unverified</h3>
          <p id="kyp-report-status" style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>{K.evidenceStatus}</p>
          <div style={{ overflowX: 'auto' }}>
          <table aria-describedby="kyp-report-status" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--faint)', textAlign: 'left' }}>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>App</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Method</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>a</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>N</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Reported result (unverified)</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {K.historicalReports.map((row, i) => {
                const col = APP_COLORS[row.app] || { fg: 'var(--ink)' };
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <td style={{ padding: '10px 6px', color: col.fg, fontFamily: mono, fontWeight: 700 }}>{row.app}</td>
                    <td style={{ padding: '10px 6px', color: 'var(--ink-soft)' }}>{row.method}</td>
                    <td style={{ padding: '10px 6px', color: 'var(--faint)', fontFamily: mono }}>{row.a}</td>
                    <td style={{ padding: '10px 6px', color: 'var(--faint)', fontFamily: mono }}>{row.n}</td>
                    <td style={{ padding: '10px 6px', color: 'var(--faint)', fontFamily: mono, fontSize: 12 }}>{row.result}</td>
                    <td style={{ padding: '10px 6px', color: 'var(--brass-dk)', fontSize: 12 }}>Unverified; not replayed; no witness supplied</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          <p style={{ marginTop: 10, color: 'var(--faint)', fontSize: 12, fontFamily: mono }}>
            Historical wording such as “clean” is preserved in the reported values, not endorsed. These rows do not certify positivity or a zero-free region.
          </p>
        </div>

        {/* ─── Open sub-problems ─── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '4px solid var(--terra-dk)', background: 'rgba(194,58,28,0.05)' }}>
          <h3 style={{ color: 'var(--terra-dk)', marginBottom: 10 }}>Open sub-problems (shared bottleneck)</h3>
          <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
            {K.landscape.openSubproblems.map((p, i) => (
              <li key={i} style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
                {p}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 14, color: 'var(--faint)', fontSize: 12, lineHeight: 1.7, fontFamily: mono }}>
            {K.landscape.controlTheoreticEquivalence}
          </p>
        </div>

        {/* ─── Related pages ─── */}
        <div className="card" style={{ marginTop: 24, borderColor: 'var(--hairline)', padding: 16 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13 }}>
            <Link to="/closure-routes" style={{ color: 'var(--blue)' }}>
              Four Closure Routes
            </Link>
            <Link to="/twin-ladder" style={{ color: 'var(--brass)' }}>
              Twin Ladder
            </Link>
            <Link to="/blaschke-ghosts" style={{ color: 'var(--terra-dk)' }}>
              Blaschke Ghosts
            </Link>
            <Link to="/three-attacks" style={{ color: 'var(--terra-dk)' }}>
              Three Attacks
            </Link>
            <Link to="/rh-attack" style={{ color: 'var(--brass-dk)' }}>
              RH Attack
            </Link>
            <Link to="/proof-overview" style={{ color: 'var(--green)' }}>
              Proof Overview
            </Link>
            <Link to="/lambda-bounds" style={{ color: 'var(--blue)' }}>
              Λ Bounds
            </Link>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
