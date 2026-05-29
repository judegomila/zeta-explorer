// PCCRouteExhaustionPage.jsx -- imp-1319
// Renders the 5-route PCC closure audit summarized in
// thinking/decisions/2026-05-28-pcc-moment-methods-exhausted.md
//
// Layout:
// 1. Header + aggregate verdict (pcc-genuinely-open-pending-new-input)
// 2. 4 named new-input candidates (Connes-Bost, Berry-Keating, etc.)
// 3. Card grid: each of the 5 routes with verdict and structural reason
// 4. Link to decision document + related pages

import React from 'react';
import { Link } from 'react-router-dom';

const mono = 'var(--font-mono)';

const PCC_ROUTES = [
  {
    id: 'imp-1297',
    name: 'Selberg Trace Formula',
    route: 'Selberg trace formula on SL(2,Z)\\H',
    verdict: 'Equi-difficult to Montgomery',
    reason: 'Sarnak 1995 AQC shows trace approach reduces to PCC itself',
    structural: 'Circular: same Cauchy-Schwarz bottleneck',
    color: { fg: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: '#fbbf24' },
  },
  {
    id: 'imp-1302',
    name: 'Goldston-Gonek 1998',
    route: 'Goldston-Gonek second-moment method',
    verdict: 'Range stops inside Montgomery\'s diagonal',
    reason: 'Second moment gives 2-point in diagonal region only; support > 1 requires off-diagonal',
    structural: 'Incomplete coverage: off-diagonal = new problem',
    color: { fg: '#f97316', bg: 'rgba(249,115,22,0.10)', border: '#f97316' },
  },
  {
    id: 'imp-1303',
    name: 'Heath-Brown 1979',
    route: 'Heath-Brown 4th-moment method',
    verdict: '(log T)^{1/2} gap intrinsic to Cauchy-Schwarz',
    reason: 'Fourth moment gains nothing over second moment at support > 1; Cauchy-Schwarz error is structural',
    structural: 'Intrinsic slack: Cauchy-Schwarz ≤ PCC at support > 1',
    color: { fg: '#eab308', bg: 'rgba(234,179,8,0.10)', border: '#eab308' },
  },
  {
    id: 'imp-1304',
    name: 'Iwaniec-Sarnak 2000',
    route: 'Iwaniec-Sarnak amplifier (family averaging)',
    verdict: 'Bypasses only for tuples; single-zeta transfer = Sarnak 1995 AQC = circular',
    reason: 'Family-averaging (amplifier) closes PCC for families but single-ζ reduction is Sarnak 1995 = circular',
    structural: 'Circular: family result → single-ζ transfer is PCC',
    color: { fg: '#84cc16', bg: 'rgba(132,204,22,0.10)', border: '#84cc16' },
  },
  {
    id: 'imp-1305',
    name: 'Goldston-Yildirim 2003',
    route: 'Goldston-Yildirim absolutization',
    verdict: 'Reduces to same Cauchy-Schwarz layer as others',
    reason: 'Absolutization strategy lands on same arithmetic Cauchy-Schwarz step as all five routes',
    structural: 'Convergence: all 5 routes → single Cauchy-Schwarz bottleneck',
    color: { fg: '#06b6d4', bg: 'rgba(6,182,212,0.10)', border: '#06b6d4' },
  },
];

const NEW_INPUT_CANDIDATES = [
  {
    name: 'Connes-Bost Adelic / Non-Commutative Geometry',
    desc: 'The Λ side of the trace formula on adèles. Stub page exists; never opened as proof attack.',
  },
  {
    name: 'Berry-Keating Quantum-Chaos XP-type Hamiltonian',
    desc: 'Direct spectral interpretation of zeta zeros. Stub page exists; needs quantum corrections.',
  },
  {
    name: 'RMT-Symmetry / Katz-Sarnak Family Classification',
    desc: 'Classify the 2-point statistic via symmetry type rather than PCC explicit formula.',
  },
  {
    name: 'Novel Sieve Theory Beyond Maynard 2024',
    desc: 'Possibly extracted from recent breakthrough work on prime gaps (Maynard 2024).',
  },
];

function AggregateVerdictSection() {
  return (
    <div
      className="card"
      style={{
        marginBottom: 32,
        borderLeft: '4px solid #ef4444',
        background: 'rgba(239,68,68,0.08)',
        padding: '20px 24px',
      }}
    >
      <h2 style={{ margin: '0 0 12px 0', color: '#f87171', fontSize: 24 }}>
        Aggregate Verdict: <span style={{ fontFamily: mono }}>pcc-genuinely-open-pending-new-input</span>
      </h2>
      <p style={{ margin: '12px 0 0 0', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
        All five candidate routes from the standard analytic-NT moment-method / family-averaging / explicit-formula
        toolkit produce the <strong>same negative classification pattern</strong>. None bypass Montgomery PCC for
        single-ζ 2-point statistics in the support &gt; 1 regime needed by the §15-27 ESY-closure.
      </p>
      <p style={{ margin: '12px 0 0 0', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
        <strong style={{ color: '#fca5a5' }}>Structural barrier:</strong> The off-diagonal sum at support &gt; 1
        collapses to a <em>single-zeta arithmetic Cauchy-Schwarz step</em> whose error bound is intrinsically
        (log T)<sup>1/2</sup> slack vs PCC. Family-averaging (IS2000) closes it for tuples but the
        single-zeta transfer <em>is PCC</em>.
      </p>
      <p style={{ margin: '12px 0 0 0', color: '#cbd5e1', fontSize: 13, fontStyle: 'italic' }}>
        Source: <Link to="/" style={{ color: '#60a5fa' }}>thinking/decisions/2026-05-28-pcc-moment-methods-exhausted.md</Link>
      </p>
    </div>
  );
}

function NewInputCandidatesSection() {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ margin: '0 0 16px 0', color: '#60a5fa', fontSize: 20 }}>
        4 Named New-Input Candidates
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {NEW_INPUT_CANDIDATES.map((cand, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              borderLeft: '3px solid #60a5fa',
              background: 'rgba(96,165,250,0.05)',
              padding: '14px 16px',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#60a5fa', fontSize: 14, fontWeight: 600 }}>
              {cand.name}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
              {cand.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteCard({ route }) {
  const col = route.color;
  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${col.border}`,
        background: col.bg,
        padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <h3 style={{ color: col.fg, margin: 0, fontSize: 16, fontWeight: 600 }}>
          {route.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 11, color: '#94a3b8' }}>
          {route.id}
        </span>
      </div>

      <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>
        <strong style={{ color: col.fg }}>Route.</strong> {route.route}
      </p>

      <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>
        <strong style={{ color: col.fg }}>Verdict.</strong> {route.verdict}
      </p>

      <div
        style={{
          marginTop: 10,
          padding: '8px 10px',
          borderLeft: '2px solid #64748b',
          background: 'rgba(15,23,42,0.5)',
        }}
      >
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: 12, lineHeight: 1.6 }}>
          <span style={{ color: '#94a3b8' }}>Reason. </span>
          {route.reason}
        </p>
      </div>

      <p style={{ margin: '8px 0 0 0', fontSize: 12, fontFamily: mono, color: '#64748b', fontStyle: 'italic' }}>
        {route.structural}
      </p>
    </div>
  );
}

export default function PCCRouteExhaustionPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ margin: '0 0 8px 0' }}>PCC Route Exhaustion: 5-Route Audit</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
          Moment-method toolkit analysis: all standard routes reduce to the same structural bottleneck
        </p>
      </div>

      <AggregateVerdictSection />
      <NewInputCandidatesSection />

      <h2 style={{ margin: '24px 0 16px 0', color: '#e2e8f0', fontSize: 20 }}>
        5 Audit Routes
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {PCC_ROUTES.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>

      <div style={{ marginTop: 40, marginBottom: 40 }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#60a5fa', fontSize: 16 }}>Related</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13 }}>
          <Link
            to="/paper-audit-dashboard"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #334155',
              background: 'rgba(96,165,250,0.05)',
            }}
          >
            Paper Audit Dashboard
          </Link>
          <Link
            to="/closure-routes"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #334155',
              background: 'rgba(96,165,250,0.05)',
            }}
          >
            Four Closure Routes (§16)
          </Link>
          <Link
            to="/collapse-chain"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #334155',
              background: 'rgba(96,165,250,0.05)',
            }}
          >
            Collapse Chain: ‖V‖ ≤ 1
          </Link>
        </div>
      </div>
    </div>
  );
}
