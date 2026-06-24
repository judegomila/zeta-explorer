import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HEADLINE,
  PROOF_CHAIN,
  ROUTE_STATUS,
  CONDITIONS,
} from '../data/proof-chain-snapshot-2026-06-23.js';
import ConstantDischargeTracker from '../components/ConstantDischargeTracker.jsx';

// ── Rigor color-coding ──────────────────────────────────────────────────────
// GREEN  = unconditional analytical proof
// YELLOW = conditional on stated hypothesis (GUE etc.)
// ORANGE = leading-order analytical + numerical verification
// RED    = open / unresolved

function rigorColor(status) {
  const s = status.toLowerCase();
  if (s.includes('open') || s.includes('pending') || s.includes('diagnostic closed')) {
    return 'red';
  }
  if (
    s.includes('conditional') ||
    s.includes('modulo gue') ||
    s.includes('modulo g6a') ||
    s.includes('modulo named')
  ) {
    return 'yellow';
  }
  if (
    s.includes('established') ||
    s.includes('closed (symbolic') ||
    s.includes('closed: l_pt')
  ) {
    return 'orange';
  }
  // "CLOSED unconditionally" and variants
  return 'green';
}

const COLOR_META = {
  green: {
    border: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    badge: '#10b981',
    label: 'Unconditional',
  },
  yellow: {
    border: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
    badge: '#f59e0b',
    label: 'Conditional',
  },
  orange: {
    border: '#f97316',
    bg: 'rgba(249,115,22,0.07)',
    badge: '#f97316',
    label: 'Analytical + Numerical',
  },
  red: {
    border: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    badge: '#ef4444',
    label: 'Open / Unresolved',
  },
};

function Legend() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10,
      marginBottom: 24,
    }}>
      {Object.entries(COLOR_META).map(([key, meta]) => (
        <div
          key={key}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: meta.bg,
            border: `1px solid ${meta.border}`,
            borderRadius: 6, padding: '5px 12px',
          }}
        >
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: meta.badge, flexShrink: 0,
          }} />
          <span style={{ fontSize: 13, color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
            {meta.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StepCard({ step, expanded, onToggle }) {
  const color = rigorColor(step.status);
  const meta = COLOR_META[color];
  return (
    <div
      style={{
        border: `1px solid ${meta.border}`,
        borderRadius: 8,
        background: meta.bg,
        marginBottom: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        boxShadow: expanded ? `0 0 0 2px ${meta.border}40` : 'none',
      }}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onToggle()}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 16px',
      }}>
        {/* Step number */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: meta.badge,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#0f172a',
          flexShrink: 0, fontFamily: 'var(--font-mono)',
        }}>
          {step.step}
        </div>
        {/* Ticket tag */}
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', color: meta.badge,
          background: `${meta.badge}20`, borderRadius: 4,
          padding: '2px 6px', flexShrink: 0,
        }}>
          {step.ticket}
        </span>
        {/* Status badge */}
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: meta.badge,
          marginLeft: 'auto', flexShrink: 0,
          padding: '2px 8px',
          border: `1px solid ${meta.badge}80`,
          borderRadius: 4,
        }}>
          {meta.label.toUpperCase()}
        </span>
        {/* Expand chevron */}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.15s', flexShrink: 0 }}
        >
          <path d="M2 4l5 5 5-5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Status line (always visible) */}
      <div style={{
        padding: '0 16px 8px 60px',
        fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)',
      }}>
        {step.status}
      </div>
      {/* Expanded claim */}
      {expanded && (
        <div style={{
          padding: '10px 16px 14px 60px',
          borderTop: `1px solid ${meta.border}40`,
          fontSize: 13, color: '#cbd5e1', lineHeight: 1.6,
        }}>
          {step.claim}
        </div>
      )}
    </div>
  );
}

function RouteCard({ route }) {
  const isOpen = route.status.toLowerCase().includes('open') || route.status.toLowerCase().includes('partial');
  const isConditional = route.status.toLowerCase().includes('conditional') || route.status.toLowerCase().includes('modulo');
  const borderColor = isOpen ? '#ef4444' : isConditional ? '#f59e0b' : '#10b981';
  const bgColor = isOpen
    ? 'rgba(239,68,68,0.07)'
    : isConditional
    ? 'rgba(245,158,11,0.07)'
    : 'rgba(16,185,129,0.08)';

  return (
    <div style={{
      border: `1px solid ${borderColor}`,
      borderRadius: 8, background: bgColor,
      padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 6 }}>
        {route.name}
      </div>
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)', color: borderColor,
        marginBottom: 8,
      }}>
        {route.status}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 6 }}>
        {route.summary}
      </div>
      <div style={{ fontSize: 12, color: '#64748b' }}>
        <span style={{ color: '#475569' }}>Closes if: </span>
        {route.closesIf}
      </div>
    </div>
  );
}

function ConditionBadge({ cond, color }) {
  const meta = COLOR_META[color];
  return (
    <div style={{
      border: `1px solid ${meta.border}`,
      borderRadius: 7, background: meta.bg,
      padding: '10px 14px', marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: meta.badge, flexShrink: 0,
        }} />
        <span style={{
          fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: meta.badge,
        }}>
          {cond.id}
        </span>
        {cond.ticket && (
          <span style={{
            fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)',
            marginLeft: 'auto',
          }}>
            {cond.ticket}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginLeft: 17 }}>
        {cond.description}
      </div>
      {cond.condition && (
        <div style={{ fontSize: 11, color: '#64748b', marginLeft: 17, marginTop: 4 }}>
          Requires: {cond.condition}
        </div>
      )}
      {cond.wouldClose && (
        <div style={{ fontSize: 11, color: '#64748b', marginLeft: 17, marginTop: 4 }}>
          Would close: {cond.wouldClose}
        </div>
      )}
    </div>
  );
}

const OVERCLAIMS = [
  {
    id: 'imp-2630',
    claim: 'Lambda in [0.099, 0.137] < 0.2 at height gamma = 1e13 (imp-2622 headline)',
    caughtBy: '4-route adversarial fanout (etrunc-kappa-pinning workflow), 2026-06-14, unanimous',
    correction: 'kappa_T frozen at T0=3000 (0.182) but multiplied against T0=1e13; height-consistent kappa_T=0.046 gives E_trunc=7.65 >> 0.2; thin-strip route grows with height, never drops below 0.2 at scale',
    status: 'WITHDRAWN — headline retracted; recomposition (E_pp drops out) survives; thin-strip route is structurally dead',
  },
  {
    id: 'imp-2625 / imp-2633',
    claim: 'kappa_T pinned to exact 0.182 is valid at all instantiation heights; E_coll RIGOROUSLY PINNED (imp-2633)',
    caughtBy: 'Height-mismatch audit (imp-2622-height-mismatch-refutation.js) + imp-2640 NEGATIVE verdict on C_H',
    correction: '0.182 is only valid at T0=3000; kappa_T = (4/3)/log T0 -> 0 as T0 -> infinity; C_H undischargeable because gap-Lipschitz C_Lip is only Gronwall-bounded and the integral diverges at the collision scale',
    status: 'CORRECTED — kappa_T formula stands but rate degrades with height; E_coll NOT rigorously pinned (imp-2640 NEGATIVE)',
  },
  {
    id: 'imp-2621',
    claim: 'sup Im m_inf(x+iy) >= pi * rho_inf / y_N_sharp ~ sqrt(N) * log gamma_N (1/y continuum amplification)',
    caughtBy: 'E_pp fanout referee T1, 2026-06-12',
    correction: 'For bounded density, Im m_inf <= pi * sup rho uniformly in y — no 1/y blow-up for the continuum transform; true divergence is the atomic self-term sqrt(N/2pi) with no 1/log gain',
    status: 'REGRADED — a=0 survives via atomic term; rate loses the 1/L enhancement (tau_c <= 1/(2 sqrt(N/2pi)) -> 0)',
  },
  {
    id: 'imp-2660',
    claim: '||K_a|| <= 1/a (Wiener-Hopf bound) closes Conj 27.2 for every a >= 0.1996 (imp-1287)',
    caughtBy: 'Adversarial Volterra workflow, 2026-06-17; measured ||K_{0.5}|| = 3.0 / 9.5 / 27 / 74 at T=4/6/8/10',
    correction: 'Causal sinh-convolution is non-Toeplitz; Laplace symbol a/(z^2-a^2) has a pole at z=a in Re(z)>0; ||K_a|| ~ e^{aT} (unbounded); claimed 1/a bound is 37x wrong at T=10',
    status: 'RETRACTED — imp-1287 isProof/all-a flags set false; HS bound is the rigorous Volterra route on the physical band (a <= ~35)',
  },
];

function TransparencyLedger() {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 8 }}>
        Transparency Ledger
      </h2>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
        Claims withdrawn or corrected by adversarial verification.
        Format: claim made &rarr; how caught &rarr; correction &rarr; current honest status.
        This record is a credibility asset: the verification discipline that catches errors is the same discipline that will confirm any genuine proof.
      </p>
      {OVERCLAIMS.map((entry, i) => (
        <div
          key={entry.id}
          style={{
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.04)',
            padding: '14px 16px',
            marginBottom: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: '#ef4444',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 4, padding: '2px 7px',
              flexShrink: 0,
            }}>
              {'OVERCLAIM #' + (i + 1)}
            </span>
            <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              {entry.id}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 12px', fontSize: 12 }}>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)', paddingTop: 2, fontWeight: 600 }}>CLAIM</span>
            <span style={{ color: '#cbd5e1', lineHeight: 1.5 }}>{entry.claim}</span>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)', paddingTop: 2, fontWeight: 600 }}>CAUGHT BY</span>
            <span style={{ color: '#94a3b8', lineHeight: 1.5 }}>{entry.caughtBy}</span>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)', paddingTop: 2, fontWeight: 600 }}>CORRECTION</span>
            <span style={{ color: '#94a3b8', lineHeight: 1.5 }}>{entry.correction}</span>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)', paddingTop: 2, fontWeight: 600 }}>STATUS</span>
            <span style={{ color: '#fbbf24', lineHeight: 1.5, fontWeight: 600 }}>{entry.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Honest SOTA banner (imp-2670) ────────────────────────────────────────────
// Three-tier hierarchy so no visitor inherits a withdrawn claim. Light: reads
// only the OVERCLAIMS literal above; no module imports.
const SOTA_TIERS = [
  {
    key: 'rigorous',
    label: 'RIGOROUS',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    items: [
      'Rodgers–Tao (2020): Λ ≥ 0 — unconditional.',
      'Platt–Trudgian (2021): Λ ≤ 0.2 — current SOTA upper bound, unconditional.',
    ],
  },
  {
    key: 'estimate',
    label: 'ESTIMATE — NOT RIGOROUS',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    items: [
      'Finite-N* = 1e4 self-consistent estimate Λ ≈ 0.013.',
      'Gated by the undischargeable constant C_H (imp-2640 NEGATIVE); a heuristic target, NOT a proof.',
    ],
  },
  {
    key: 'refuted',
    label: 'REFUTED THIS SESSION',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    items: [
      OVERCLAIMS.length + ' overclaims withdrawn/corrected by adversarial verification (see Transparency Ledger below).',
      'No live claim beats Platt–Trudgian Λ ≤ 0.2; the thin-strip "beats P–T" framing is structurally dead (imp-2630).',
    ],
  },
];

function HonestSOTABanner() {
  return (
    <div style={{
      border: '1px solid #334155', borderRadius: 10,
      background: 'rgba(15,23,42,0.6)', padding: '14px 18px', marginBottom: 24,
    }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: 12, letterSpacing: 0.5 }}>
        HONEST RIGOR HIERARCHY &mdash; WHAT IS PROVED vs ESTIMATED vs REFUTED
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {SOTA_TIERS.map(tier => (
          <div key={tier.key} style={{
            border: `1px solid ${tier.color}`, borderRadius: 8,
            background: tier.bg, padding: '10px 13px',
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: tier.color, marginBottom: 8,
            }}>
              {tier.label}
            </div>
            {tier.items.map((text, i) => (
              <div key={i} style={{
                fontSize: 12, color: '#cbd5e1', lineHeight: 1.5,
                marginBottom: i < tier.items.length - 1 ? 6 : 0,
              }}>
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RigorDashboardPage() {
  const [expandedStep, setExpandedStep] = useState(null);

  const toggleStep = (step) =>
    setExpandedStep(prev => (prev === step ? null : step));

  const greenCount = PROOF_CHAIN.filter(s => rigorColor(s.status) === 'green').length;
  const yellowCount = PROOF_CHAIN.filter(s => rigorColor(s.status) === 'yellow').length;
  const orangeCount = PROOF_CHAIN.filter(s => rigorColor(s.status) === 'orange').length;
  const redCount = PROOF_CHAIN.filter(s => rigorColor(s.status) === 'red').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Rigor Dashboard</h1>
        <p>
          Interactive proof-chain visualization with honest rigor-level coloring.
          Every step is either unconditionally proved (green), conditional on a named
          hypothesis (yellow), analytic+numeric (orange), or still open (red).
          Click any step to expand the full claim.
        </p>
      </div>

      {/* Honest SOTA banner (imp-2670) */}
      <HonestSOTABanner />

      {/* Headline claim */}
      <div style={{
        background: 'rgba(16,185,129,0.06)', border: '1px solid #10b98140',
        borderRadius: 10, padding: '14px 18px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, color: '#10b981', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          HEADLINE CLAIM
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
          {HEADLINE.bound}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
          {HEADLINE.improvement} &nbsp;|&nbsp; {HEADLINE.scale}
        </div>
        <div style={{ fontSize: 12, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
          {HEADLINE.rigorLevel}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
          {HEADLINE.condition}
        </div>
      </div>

      {/* E(N) constant-discharge tracker */}
      <ConstantDischargeTracker />

      {/* Summary counts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 10, marginBottom: 24,
      }}>
        {[
          { label: 'Unconditional', count: greenCount, color: '#10b981' },
          { label: 'Conditional', count: yellowCount, color: '#f59e0b' },
          { label: 'Analytic+Num', count: orangeCount, color: '#f97316' },
          { label: 'Open', count: redCount, color: '#ef4444' },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="card"
            style={{ textAlign: 'center', padding: '12px 8px' }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>
              {count}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <Legend />

      {/* Proof chain */}
      <h2 style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 14 }}>
        Proof Chain ({PROOF_CHAIN.length} steps)
      </h2>
      <div style={{ marginBottom: 32 }}>
        {PROOF_CHAIN.map(step => (
          <StepCard
            key={step.step}
            step={step}
            expanded={expandedStep === step.step}
            onToggle={() => toggleStep(step.step)}
          />
        ))}
      </div>

      {/* Route status */}
      <h2 style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 14 }}>
        Route Status
      </h2>
      <div style={{ marginBottom: 32 }}>
        {Object.values(ROUTE_STATUS).map(route => (
          <RouteCard key={route.name} route={route} />
        ))}
      </div>

      {/* Conditions */}
      <h2 style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 14 }}>
        Proof Conditions
      </h2>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
          ESTABLISHED UNCONDITIONALLY
        </div>
        {CONDITIONS.established.map(c => (
          <ConditionBadge key={c.id} cond={c} color="green" />
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
          ESTABLISHED CONDITIONAL
        </div>
        {CONDITIONS.establishedConditional.map(c => (
          <ConditionBadge key={c.id} cond={c} color="yellow" />
        ))}
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
          OPEN CONDITIONS
        </div>
        {CONDITIONS.open.map(c => (
          <ConditionBadge key={c.id} cond={c} color="red" />
        ))}
      </div>

      {/* Transparency ledger */}
      <TransparencyLedger />

      {/* Links */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10,
        borderTop: '1px solid #1e293b', paddingTop: 20,
      }}>
        <Link to="/rigor" className="button-secondary" style={{ fontSize: 13 }}>
          RH Rigor Check
        </Link>
        <Link to="/rh-dag" className="button-secondary" style={{ fontSize: 13 }}>
          Dependency DAG
        </Link>
        <Link to="/proof-overview" className="button-secondary" style={{ fontSize: 13 }}>
          Proof Overview
        </Link>
        <Link to="/lambda-bounds" className="button-secondary" style={{ fontSize: 13 }}>
          Lambda Bounds
        </Link>
      </div>
    </div>
  );
}
