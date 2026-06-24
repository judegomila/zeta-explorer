// ThreeAttacksPage.jsx -- imp-1199
// Para 18 of the twin-ladder consolidated v52 paper.
// Three independent closure routes toward RH inside the twin-ladder framework:
//   I.  Kernel-passivity attack
//   II. Prime-delay domination attack
//   III.Weil-Pontryagin duality attack

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';

const mono = 'var(--font-mono)';

const ATTACKS = [
  {
    id: 'kernel-passivity',
    label: 'I. Kernel-Passivity',
    color: '#06b6d4',
    status: 'conditional',
    statusLabel: 'conditional',
    headline: 'Passivity of the twin-ladder transfer kernel forces all zeros onto the critical line.',
    summary: [
      'The twin-ladder sum defines a reproducing kernel K(s, s\') via the Dirichlet series ' +
      'pairing over prime powers. If K is shown to be a positive-definite (passive) kernel in ' +
      'the strip 0 < Re(s) < 1, then by a Bochner-type argument no zero can have Re(s) != 1/2.',
      'Passivity here is the L2-operator analog of a lossless network in control theory: the ' +
      'quadratic form <f, Kf> >= 0 for all test functions f in the Hardy space H^2(strip). ' +
      'This mirrors the KYP lemma: passivity is equivalent to a half-plane condition on the ' +
      'associated transfer function, which is precisely the statement that poles (zeros of zeta) ' +
      'must lie on the imaginary axis of the shifted plane Re(s) = 1/2.',
      'The conditional status reflects that establishing passivity of K requires bounding a ' +
      'remainder term coming from the off-diagonal couplings between distinct primes. The ' +
      'diagonal contribution is positive by construction; the off-diagonal part is the open gap.',
    ],
    formulas: [
      {
        label: 'Twin-ladder kernel',
        tex: "K(s,s') \\;=\\; \\sum_{p}\\,\\sum_{m,n \\geq 0} \\frac{\\Lambda(p^m)\\,\\Lambda(p^n)}{(p^m)^s\\,(p^n)^{\\overline{s'}}}",
      },
      {
        label: 'Passivity condition',
        tex: '\\langle f,\\, K f \\rangle_{H^2} \\;\\geq\\; 0 \\quad \\forall\\, f \\in H^2(\\tfrac{1}{2}+i\\mathbb{R})',
      },
      {
        label: 'KYP transfer matrix bound',
        tex: '\\bigl\\| T(\\tfrac{1}{2}+i\\xi) \\bigr\\|_{\\mathrm{op}} \\;\\leq\\; 1 \\quad \\Longrightarrow \\quad \\text{Re}(\\rho) = \\tfrac{1}{2}\\; \\forall \\rho',
      },
    ],
    openGap: 'Off-diagonal prime couplings in K must be bounded by an O(log p) remainder.',
    refs: [
      'Gomila (2026), twin_ladder_consolidated_v52.pdf, para 18.1',
      'Yakubovich (1962), Solution of certain matrix inequalities',
      'Popov (1973), Hyperstability of control systems',
    ],
  },
  {
    id: 'prime-delay',
    label: 'II. Prime-Delay Domination',
    color: '#10b981',
    status: 'estimate',
    statusLabel: 'ESTIMATE',
    headline: 'Arithmetic spacing of prime-power log-delays dominates any hypothetical off-critical zero.',
    summary: [
      'Each prime p contributes a ladder of delays {log p, 2 log p, 3 log p, ...} to the twin-ladder ' +
      'sum. The prime-delay domination conjecture (v52 Conjecture 18.2) asserts that for any would-be ' +
      'zero rho = sigma + iT with sigma > 1/2, the aggregate phase interference from all prime-power ' +
      'delays eventually outweighs the real-part gain, forcing a sign contradiction in the ladder sum.',
      'The mechanism is combinatorial: the set {k log p : p prime, k >= 1} is linearly independent ' +
      'over Q (Baker\'s theorem on logarithms of algebraic numbers). This independence means that ' +
      'no finite collection of prime delays can conspire to cancel all contributions in the error ' +
      'term uniformly in T -- the phases eventually become equidistributed (Weyl equidistribution). ' +
      'An off-critical zero would require a persistent coherent cancellation that Baker independence forbids.',
      'A finite-N numerical pilot at N = 10^4 primes (imp-1086 / imp-1203) confirms the domination ' +
      'inequality holds with a comfortable margin; the full unconditional proof requires a quantitative ' +
      'Baker bound on the minimal linear-form value for the prime-log set up to height T.',
    ],
    formulas: [
      {
        label: 'Prime-delay sum',
        tex: 'D(\\sigma, T) \\;=\\; \\sum_{p \\leq N}\\,\\sum_{k=1}^{K}\\, p^{-k\\sigma}\\,e^{ik T \\log p}',
      },
      {
        label: 'Domination inequality (Conjecture 18.2)',
        tex: '\\bigl|\\, D(\\sigma, T)\\bigr|^2 \\;<\\; D(\\tfrac{1}{2}, T)^2 \\quad \\text{for all } \\sigma > \\tfrac{1}{2},\\; T \\geq T_0',
      },
      {
        label: 'Baker bound ingredient',
        tex: '\\bigl|\\,b_1 \\log p_1 + \\cdots + b_n \\log p_n\\bigr| \\;>\\; \\exp\\!\\bigl(-C(n,H)\\bigr) \\quad (b_i \\in \\mathbb{Z},\\; |b_i| \\leq H)',
      },
    ],
    openGap: 'Quantitative Baker bound must be made effective enough to close the T-range from T_0 to infinity.',
    refs: [
      'Gomila (2026), twin_ladder_consolidated_v52.pdf, para 18.2 -- Conjecture 18.2',
      'Baker (1966), Linear forms in the logarithms of algebraic numbers',
      'Weyl (1916), Uber die Gleichverteilung von Zahlen',
      'imp-1086 numerical pilot; imp-1203 extension to N = 10^4',
    ],
  },
  {
    id: 'weil-pontryagin',
    label: 'III. Weil-Pontryagin Duality',
    color: '#a855f7',
    status: 'open',
    statusLabel: 'open',
    headline: 'Pontryagin duality on the adele ring converts zero-positivity into a kernel-positivity statement solvable by Fourier analysis.',
    summary: [
      'Weil\'s explicit formula expresses a sum over zeros of zeta as a sum over prime powers via ' +
      'the Fourier transform of a test function on the adele ring A_Q. Pontryagin duality -- the ' +
      'self-duality of A_Q as a locally compact abelian group -- implies that positivity of the ' +
      'distribution W = sum_rho h(rho) is equivalent to positivity of the Fourier-dual expression ' +
      'sum_p W_p(h), provided the test function h is a Schwartz-class positive-type function.',
      'In the twin-ladder language the prime-side contribution W_p(h) is exactly the ladder sum ' +
      'evaluated at the test function h. If h is chosen as the heat-flowed Gaussian g_t (as in the ' +
      'Connes adelic framework, imp-1109), passivity of the ladder kernel (Attack I) implies W_p(h) >= 0, ' +
      'and by Pontryagin duality W >= 0, i.e., Lambda <= 0. Combined with Rodgers-Tao Lambda >= 0, RH follows.',
      'This attack unifies the other two routes: kernel-passivity (Attack I) provides the prime-side ' +
      'positivity, and Pontryagin duality converts it to zero-side positivity. The prime-delay attack ' +
      '(Attack II) provides an independent route to the same prime-side bound via arithmetic means. ' +
      'The Weil-Pontryagin route is the conceptually cleanest closure but requires full passivity of K.',
    ],
    formulas: [
      {
        label: 'Weil explicit formula',
        tex: '\\sum_{\\rho}\\, h(\\rho) \\;=\\; h(\\tfrac{i}{2}) + h(-\\tfrac{i}{2}) + W_{\\infty}(h) + \\sum_{p}\\, W_p(h)',
      },
      {
        label: 'Pontryagin self-duality of adeles',
        tex: '\\widehat{\\mathbb{A}_\\mathbb{Q}} \\;\\cong\\; \\mathbb{A}_\\mathbb{Q} \\quad (\\text{as locally compact abelian groups})',
      },
      {
        label: 'Positivity equivalence via duality',
        tex: 'W_p(g_t) \\geq 0\\; \\forall p \\quad\\Longleftrightarrow\\quad \\sum_{\\rho} h_t(\\rho) \\geq 0 \\quad\\Longleftrightarrow\\quad \\Lambda \\leq 0',
      },
    ],
    openGap: 'Full passivity of K (Attack I) is the remaining prerequisite; archimedean correction W_inf must also be controlled.',
    refs: [
      'Gomila (2026), twin_ladder_consolidated_v52.pdf, para 18.3',
      'Weil (1952), Sur les "formules explicites" de la theorie des nombres premiers',
      'Connes (1999), Trace formula in noncommutative geometry',
      'Rodgers-Tao (2020), The de Bruijn-Newman constant is nonnegative',
      'imp-1109 (Connes adelic numerical check)',
    ],
  },
];

const STATUS_STYLE = {
  conditional: { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.35)' },
  estimate: { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.35)' },
  numerical: { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.35)' },
  open: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.35)' },
};

const STATUS_LEGEND = [
  { key: 'CONDITIONAL', color: '#f59e0b', desc: 'Rigorous modulo a named unproven input — gap is identified' },
  { key: 'ESTIMATE', color: '#3b82f6', desc: 'Numerical pilot only — not a rigorous bound; cross-check evidence' },
  { key: 'RESEARCH-OPEN', color: '#ef4444', desc: 'No reduction known; proof strategy not yet fully scoped' },
];

function StatusLegend() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10,
      padding: '10px 14px',
      background: 'rgba(15,23,42,0.6)',
      border: '1px solid var(--border, #1e293b)',
      borderRadius: 8,
      marginTop: 16,
    }}>
      <span style={{ fontFamily: mono, fontSize: 11, color: '#64748b', alignSelf: 'center', marginRight: 4 }}>
        STATUS LEGEND:
      </span>
      {STATUS_LEGEND.map(item => (
        <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: mono, fontSize: 11, fontWeight: 700, color: item.color,
            padding: '1px 8px', borderRadius: 99,
            background: item.color + '1a',
            border: '1px solid ' + item.color + '55',
          }}>{item.key}</span>
          <span style={{ fontSize: 11, color: '#64748b' }}>{item.desc}</span>
        </span>
      ))}
    </div>
  );
}

function StatusChip({ status, label }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.open;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      fontSize: 11,
      fontWeight: 700,
      fontFamily: mono,
      color: s.color,
      background: s.bg,
      border: '1px solid ' + s.border,
      borderRadius: 99,
    }}>{label}</span>
  );
}

function AttackCard({ attack, open, onToggle }) {
  return (
    <div
      className="card"
      style={{
        borderColor: open ? attack.color : undefined,
        marginBottom: 0,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <div style={{ flex: 1 }}>
          <span style={{ color: attack.color, fontFamily: mono, fontSize: 14, fontWeight: 700 }}>
            {attack.label}
          </span>
          <span style={{ marginLeft: 12 }}>
            <StatusChip status={attack.status} label={attack.statusLabel} />
          </span>
          <p style={{
            margin: '6px 0 0 0',
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.6,
          }}>
            {attack.headline}
          </p>
        </div>
        <svg
          width={16} height={16} viewBox="0 0 16 16"
          fill="none" stroke={attack.color} strokeWidth={2}
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          {attack.summary.map((para, i) => (
            <p key={i} style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75, margin: i === 0 ? 0 : '10px 0 0 0' }}>
              {para}
            </p>
          ))}

          <div style={{ marginTop: 16, borderTop: '1px solid var(--border, #1e293b)', paddingTop: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 12, color: attack.color, marginBottom: 10, fontWeight: 600 }}>
              Key formulas
            </div>
            {attack.formulas.map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {f.label}
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <BlockMath tex={f.tex} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.07)', borderRadius: 6, borderLeft: '3px solid #ef4444' }}>
            <span style={{ fontFamily: mono, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>OPEN GAP: </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{attack.openGap}</span>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#64748b', marginBottom: 6 }}>References</div>
            <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>
              {attack.refs.map((r, i) => (
                <li key={i} style={{ fontSize: 12, fontFamily: mono, color: '#94a3b8', lineHeight: 1.6 }}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThreeAttacksPage() {
  const [openId, setOpenId] = useState('kernel-passivity');

  function toggle(id) {
    setOpenId(prev => prev === id ? null : id);
  }

  return (
    <div className="page">
      <div style={{ marginBottom: 12 }}>
        <Link to="/" style={{ color: '#60a5fa', fontSize: 12, fontFamily: mono }}>
          &larr; home
        </Link>
      </div>

      <div className="page-header">
        <h1>Three Attacks on RH</h1>
        <p className="page-subtitle" style={{ fontFamily: mono, color: 'var(--text-secondary)' }}>
          Para 18 -- twin-ladder v52: kernel-passivity, prime-delay domination, Weil-Pontryagin (imp-1199)
        </p>
      </div>

      <StatusLegend />

      {/* ─── Overview card ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>Overview</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
          Paragraph 18 of the twin-ladder consolidated paper (v52) identifies three independent
          closure routes inside the twin-ladder framework, any one of which would unconditionally
          establish{' '}
          <InlineMath tex="\Lambda \leq 0" />, and hence RH, once its open gap is resolved. The
          three attacks are logically independent but mutually reinforcing: the Weil-Pontryagin
          route explicitly relies on kernel-passivity from Attack I, while the prime-delay route
          provides an arithmetic route to the same prime-side bound that does not require operator
          theory. All three target the same key quantity:{' '}
          <InlineMath tex="W_p(g_t) \geq 0" /> for all primes{' '}
          <InlineMath tex="p" /> and test time{' '}
          <InlineMath tex="t \geq 0" />.
        </p>
        <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {ATTACKS.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 12, color: a.color }}>{a.label}</span>
              <StatusChip status={a.status} label={a.statusLabel} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Common target equation ─── */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ color: '#94a3b8', marginBottom: 8 }}>Common target</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          Every attack reduces to establishing positivity of the prime-side Weil-Connes trace.
          Via Rodgers-Tao{' '}
          <InlineMath tex="\Lambda \geq 0" /> (2020), the target{' '}
          <InlineMath tex="\Lambda \leq 0" /> would then pin{' '}
          <InlineMath tex="\Lambda = 0" />, equivalent to RH:
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={'W_p(g_t) \\;\\geq\\; 0 \\quad \\forall p \\text{ prime},\\; t \\geq 0 \\quad\\Longrightarrow\\quad \\Lambda \\leq 0 \\quad\\Longrightarrow\\quad \\text{RH}'} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>
          Here{' '}<InlineMath tex="g_t(u) = g(u)\,\exp(-t\,u^2)" /> is the heat-flowed test
          function at de Bruijn-Newman time{' '}<InlineMath tex="t" />, and{' '}
          <InlineMath tex="W_p(g_t) = \log p \sum_{k \geq 1} p^{-k/2}\bigl[g_t(k\log p) + g_t(-k\log p)\bigr]" />{' '}
          is the prime-side local term of the Weil explicit formula (Connes 1999).
        </p>
      </div>

      {/* ─── Attack cards (accordion) ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
        {ATTACKS.map(a => (
          <AttackCard
            key={a.id}
            attack={a}
            open={openId === a.id}
            onToggle={() => toggle(a.id)}
          />
        ))}
      </div>

      {/* ─── Dependency / convergence diagram ─── */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ color: '#94a3b8', marginBottom: 12 }}>Route convergence diagram</h3>
        <div style={{ overflowX: 'auto' }}>
          <svg width={660} height={180} viewBox="0 0 660 180" style={{ display: 'block', maxWidth: '100%' }}>
            <defs>
              <marker id="arr" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
            </defs>
            {/* Three attack nodes */}
            {[
              { x: 30, y: 60, label: 'I. Kernel', sub: 'Passivity', color: '#06b6d4' },
              { x: 30, y: 110, label: 'II. Prime-', sub: 'Delay', color: '#10b981' },
              { x: 30, y: 160, label: 'III. Weil-', sub: 'Pontryagin', color: '#a855f7' },
            ].map((n, i) => (
              <g key={i}>
                <rect x={n.x} y={n.y - 22} width={108} height={38} rx={6}
                  fill="rgba(15,23,42,0.8)" stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + 54} y={n.y - 6} textAnchor="middle" fontSize={11} fill={n.color}
                  fontFamily="var(--font-mono)">{n.label}</text>
                <text x={n.x + 54} y={n.y + 9} textAnchor="middle" fontSize={11} fill={n.color}
                  fontFamily="var(--font-mono)">{n.sub}</text>
              </g>
            ))}

            {/* Arrow lines to "W_p(g_t) >= 0" */}
            <line x1={138} y1={60} x2={240} y2={95} stroke="#475569" strokeWidth={1} markerEnd="url(#arr)" />
            <line x1={138} y1={110} x2={240} y2={105} stroke="#475569" strokeWidth={1} markerEnd="url(#arr)" />
            <line x1={138} y1={155} x2={240} y2={115} stroke="#475569" strokeWidth={1} markerEnd="url(#arr)" />

            {/* W_p >= 0 node */}
            <rect x={240} y={76} width={140} height={38} rx={6}
              fill="rgba(15,23,42,0.8)" stroke="#f59e0b" strokeWidth={1.5} />
            <text x={310} y={92} textAnchor="middle" fontSize={11} fill="#f59e0b"
              fontFamily="var(--font-mono)">W_p(g_t) ≥ 0</text>
            <text x={310} y={107} textAnchor="middle" fontSize={10} fill="#94a3b8"
              fontFamily="var(--font-mono)">prime-side target</text>

            {/* Arrow to Lambda <= 0 */}
            <line x1={380} y1={95} x2={440} y2={95} stroke="#475569" strokeWidth={1} markerEnd="url(#arr)" />

            {/* Lambda <= 0 node */}
            <rect x={440} y={76} width={90} height={38} rx={6}
              fill="rgba(15,23,42,0.8)" stroke="#10b981" strokeWidth={1.5} />
            <text x={485} y={92} textAnchor="middle" fontSize={12} fill="#10b981"
              fontFamily="var(--font-mono)">Λ ≤ 0</text>
            <text x={485} y={107} textAnchor="middle" fontSize={10} fill="#a7f3d0"
              fontFamily="var(--font-mono)">Rodgers-Tao</text>

            {/* Arrow to RH */}
            <line x1={530} y1={95} x2={580} y2={95} stroke="#475569" strokeWidth={1} markerEnd="url(#arr)" />

            {/* RH node */}
            <rect x={580} y={76} width={66} height={38} rx={6}
              fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth={2} />
            <text x={613} y={97} textAnchor="middle" fontSize={13} fill="#10b981"
              fontFamily="var(--font-mono)" fontWeight="bold">RH</text>

            {/* Rodgers-Tao Lambda >= 0 note */}
            <text x={485} y={145} textAnchor="middle" fontSize={10} fill="#64748b"
              fontFamily="var(--font-mono)">(+ Λ ≥ 0)</text>
          </svg>
        </div>
      </div>

      {/* ─── Related pages ─── */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ color: '#94a3b8', marginBottom: 10 }}>Related pages</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
            { to: '/rh-attack', label: 'RH Attack' },
            { to: '/lambda-bounds', label: 'Lambda Bounds' },
            { to: '/control', label: 'Control Theory (KYP)' },
          ].map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                fontFamily: mono,
                fontSize: 12,
                color: '#60a5fa',
                padding: '4px 12px',
                border: '1px solid rgba(96,165,250,0.3)',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
