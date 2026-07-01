import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HEADLINE,
  PROOF_CHAIN,
  ROUTE_STATUS,
  CONDITIONS,
} from '../data/proof-chain-snapshot-2026-06-23.js';
import ConstantDischargeTracker from '../components/ConstantDischargeTracker.jsx';
import { CAUGHT_OVERCLAIMS } from '../data/overclaim-ledger.js';
import ProofTierSummary from '../components/ProofTierSummary.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { RANKED_OPPORTUNITIES } from '../data/full-route-map-2026-06-19.js';
import { ASSERTION_FRESHNESS } from '../data/assertion-freshness.js';
import { LAMBDA_ESTIMATOR_TRIPTYCH_IMP2991 } from '../data/lambda-estimator-triptych-imp2991.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { CH_LIP_THREE_PROOFS } from '../data/ch-lip-three-proofs-table-2026-06-30.js';
import { CH_LIP_BASIN_CONDITIONAL, CH_LIP_DIVERGENCE_DECOMPOSITION } from '../data/ch-lip-basin-conditional-2026-06-30.js';
import { IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP } from '../data/imp-3110-section26-gram-vs-monomial-gap.js';

// ── Assertion freshness stamp (imp-2999) ─────────────────────────────────────
function FreshnessStamp() {
  const { timestamp, passed, failed } = ASSERTION_FRESHNESS;
  const ok = failed === 0;
  const color = ok ? '#10b981' : '#ef4444';
  const label = ok ? 'PASS' : 'FAIL';
  // Format: "2026-06-26 02:08 UTC"
  const dt = timestamp.replace('T', ' ').replace('Z', '').slice(0, 16) + ' UTC';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: ok ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
      border: `1px solid ${color}40`,
      borderRadius: 6, padding: '4px 10px',
      marginBottom: 20,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
        color, background: `${color}20`, borderRadius: 3,
        padding: '1px 5px',
      }}>
        {label}
      </span>
      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
        Assertions last verified: {dt}
      </span>
      <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>
        ({passed} passed)
      </span>
    </div>
  );
}

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
      {CAUGHT_OVERCLAIMS.map((entry, i) => (
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
      CAUGHT_OVERCLAIMS.length + ' overclaims withdrawn/corrected by adversarial verification (see Transparency Ledger below).',
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

function EstimatorTriptych() {
  const t = LAMBDA_ESTIMATOR_TRIPTYCH_IMP2991;
  return (
    <div style={{
      border: '1px solid #334155', borderRadius: 10,
      background: 'rgba(15,23,42,0.6)', padding: '14px 18px', marginBottom: 24,
    }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: 0.5 }}>
        LAMBDA CROSS-VALIDATION &mdash; THREE INDEPENDENT ESTIMATORS (imp-2991)
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
        {t.subtitle}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 12,
      }}>
        {t.estimators.map(e => (
          <div key={e.key} style={{
            border: '1px solid #f59e0b', borderRadius: 8,
            background: 'rgba(245,158,11,0.07)', padding: '11px 13px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{e.label}</span>
              <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
                {e.ticket}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              {'Λ ' + e.representativeLambda}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>
              {e.scope}
            </div>
            <span style={{
              display: 'inline-block', fontSize: 10, fontFamily: 'var(--font-mono)',
              color: '#f59e0b', border: '1px solid #f59e0b80', borderRadius: 4,
              padding: '1px 6px', marginBottom: 8,
            }}>
              {e.status + ' · ' + e.kind}
            </span>
            {e.key === 'kernel-hack' && (
              <span style={{
                display: 'inline-block', fontSize: 10, fontFamily: 'var(--font-mono)',
                color: '#f87171', border: '1px solid #f8717180', borderRadius: 4,
                padding: '1px 6px', marginBottom: 8, marginLeft: 6,
              }}>
                DIFFERENT SCALE — scope-matched only
              </span>
            )}
            <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>
              {e.honestLimit}
            </div>
            <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
              {e.ownerModule}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginTop: 12 }}>
        {t.crossValidation}
      </div>
      <div style={{ fontSize: 11, color: '#f59e0b', lineHeight: 1.6, marginTop: 8, fontFamily: 'var(--font-mono)' }}>
        {t.honestCeiling}
      </div>
    </div>
  );
}

function CHWallCallout() {
  const opp = RANKED_OPPORTUNITIES[0];
  return (
    <div style={{
      border: '2px solid #ef4444',
      borderRadius: 10,
      background: 'rgba(239,68,68,0.06)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
      }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#ef4444', background: 'rgba(239,68,68,0.14)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 4, padding: '2px 8px', flexShrink: 0,
        }}>
          {'#' + opp.rank + ' OPPORTUNITY — LOAD-BEARING WALL'}
        </span>
        <Link to="/route-map" style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', color: '#94a3b8',
          textDecoration: 'none', marginLeft: 'auto',
        }}>
          Route Map →
        </Link>
        <Link to="/rh-dag" style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', color: '#94a3b8',
          textDecoration: 'none',
        }}>
          DAG →
        </Link>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
        {opp.target}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
        {opp.why}
      </div>
    </div>
  );
}

function CHWallFrontierPanel() {
  const v = CH_WALL_FRONTIER;
  const rows = [
    { label: 'VERDICT', value: v.verdict, color: '#ef4444' },
    { label: 'LIPSCHITZ ROUTE', value: v.lipschitzRouteClosed, color: '#f97316' },
    { label: 'NORM-MISMATCH', value: v.sharpestDiagnosis, color: '#f59e0b' },
    { label: 'h=g² RECON', value: v.reconditioning, color: '#a78bfa' },
    { label: 'C_THETA STATUS', value: v.cThetaStatus, color: '#f59e0b' },
    { label: 'DETERMINISTIC RESIDUAL', value: v.residual, color: '#10b981' },
    { label: 'FORECLOSED', value: v.foreclosed, color: '#ef4444' },
    { label: 'SOTA', value: v.sota, color: '#94a3b8' },
  ];
  return (
    <div style={{
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: 10,
      background: 'rgba(15,23,42,0.7)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#ef4444', background: 'rgba(239,68,68,0.14)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 4, padding: '2px 8px',
        }}>
          C_H FRONTIER VERDICT &mdash; {v.date}
        </span>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#ef4444', marginLeft: 'auto',
        }}>
          {v.verdict}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '7px 12px' }}>
        {rows.map(({ label, value, color }) => (
          <React.Fragment key={label}>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', color: '#475569',
              fontWeight: 600, paddingTop: 2, letterSpacing: 0.3,
            }}>
              {label}
            </span>
            <span style={{ fontSize: 12, color, lineHeight: 1.55 }}>
              {value}
            </span>
          </React.Fragment>
        ))}
      </div>
      {/* imp-3019 — wire the C_H frontier verdict to its two other appearances so the story is traceable */}
      <div style={{
        marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(148,163,184,0.15)',
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
        fontSize: 11, fontFamily: 'var(--font-mono)', color: '#475569',
      }}>
        <span>SAME VERDICT APPEARS IN:</span>
        <Link to="/route-map" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Route Map (Frontier Assault) →
        </Link>
        <Link to="/what-we-know" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          What We Know (C_H Wall) →
        </Link>
      </div>
    </div>
  );
}

function CHLipThreeProofsPanel() {
  const t = CH_LIP_THREE_PROOFS;
  return (
    <div style={{
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: 10,
      background: 'rgba(15,23,42,0.7)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#ef4444', background: 'rgba(239,68,68,0.14)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 4, padding: '2px 8px',
        }}>
          C_H LIPSCHITZ ROUTE &mdash; CLOSED THREE WAYS &mdash; imp-3010
        </span>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#ef4444', marginLeft: 'auto',
        }}>
          {t.verdict}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
        {t.claim}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        {t.proofs.map((p) => (
          <div key={p.key} style={{
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 7, background: 'rgba(239,68,68,0.05)',
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fca5a5', marginBottom: 6 }}>
              {p.n}. {p.name}
            </div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#f59e0b', marginBottom: 6, letterSpacing: 0.2 }}>
              {p.rigor.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 6 }}>
              {p.mechanism}
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 6 }}>
              &rarr; {p.result}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginBottom: 4 }}>
              {p.witness}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>
              Escape: {p.escape}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: 6, background: 'rgba(16,185,129,0.06)',
        padding: '8px 12px', fontSize: 11, color: '#86efac', lineHeight: 1.6,
        marginBottom: 8,
      }}>
        DETERMINISTIC RESIDUAL: {t.deterministicResidual}
      </div>
      <div style={{
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 6, background: 'rgba(239,68,68,0.06)',
        padding: '8px 12px', fontSize: 11, color: '#fca5a5', lineHeight: 1.6,
        fontFamily: 'var(--font-mono)',
      }}>
        HONEST: {t.honest}
      </div>
    </div>
  );
}

function CLipDivergenceDecompositionPanel() {
  const d = CH_LIP_DIVERGENCE_DECOMPOSITION;
  const tc = d.thetaChannel;
  const nc = d.linearNChannel;
  return (
    <div style={{
      border: '1px solid rgba(239,68,68,0.45)',
      borderRadius: 10,
      background: 'rgba(15,23,42,0.7)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#ef4444', background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 4, padding: '2px 8px',
        }}>
          C_Lip DIVERGENCE SCOPE &mdash; imp-3063 &mdash; {d.date}
        </span>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#94a3b8', marginLeft: 'auto',
        }}>
          O(N) SURVIVES
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
        Formula: <span style={{ fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>{d.formula}</span>
        <br />
        The basin reconditioning decomposes the two independent divergence sources and removes exactly one.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{
          border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: 7, background: 'rgba(16,185,129,0.06)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981', marginBottom: 6 }}>
            THETA CHANNEL &mdash; REMOVED
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#cbd5e1', marginBottom: 4 }}>
            {tc.factor}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 6 }}>
            {tc.mechanism}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '3px 8px', fontSize: 11 }}>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>ON-BASIN</span>
            <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              {tc.basinNominal.toFixed(1)} (Theta=0) &ndash; {tc.basinCeiling.toFixed(4)} (Theta=1/4 trap)
            </span>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>OFF-BASIN</span>
            <span style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
              {tc.offBasinBlowup[0]} &ndash; {tc.offBasinBlowup[1]} (dTheta/W_1 ~ 1/g0)
            </span>
          </div>
        </div>
        <div style={{
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 7, background: 'rgba(239,68,68,0.06)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>
            LINEAR-N CHANNEL &mdash; UNTOUCHED
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#cbd5e1', marginBottom: 4 }}>
            {nc.factor} &nbsp; (at N*=1e4: value = {nc.valueAtNAst.toExponential(0)})
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
            {nc.mechanism}
          </div>
        </div>
      </div>
      <div style={{
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 6, background: 'rgba(239,68,68,0.06)',
        padding: '8px 12px', fontSize: 11, color: '#fca5a5', lineHeight: 1.6,
        fontFamily: 'var(--font-mono)',
      }}>
        HONEST: {d.honest}
      </div>
    </div>
  );
}

function BasinConditionalLipschitzPanel() {
  const v = CH_LIP_BASIN_CONDITIONAL;
  const rows = [
    { label: 'STATUS', value: v.status, color: '#a78bfa' },
    { label: 'c* CLOSED FORM', value: `sqrt(2+sqrt(3))-1 ≈ ${v.cStarClosedForm.toFixed(5)} (imp-3005, exact)`, color: '#10b981' },
    { label: 'BASIN SEPARATION', value: `basin rho=0.72 < asym bracket inf 0.927 (margin ${v.basinSafetyMargin.toFixed(3)}); d(rho)/ds<0 certified independent of open global constant`, color: '#10b981' },
    { label: 'GAP CHANNEL', value: `g_min/4 ≈ ${v.gapChannelNominal.toExponential(2)} (nominal) – g_min/3 ≈ ${v.gapChannelTrappedCeiling.toExponential(3)} (Theta=1/4 ceiling); dominant on basin`, color: '#f59e0b' },
    { label: 'C_THETA', value: v.cThetaStatus, color: '#94a3b8' },
    { label: 'GLOBAL CONSTANT', value: v.globalConstantStatus, color: '#f97316' },
    { label: 'HONEST CAVEAT', value: v.honest, color: '#ef4444' },
  ];
  return (
    <div style={{
      border: '1px solid rgba(167,139,250,0.4)',
      borderRadius: 10,
      background: 'rgba(15,23,42,0.7)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#a78bfa', background: 'rgba(167,139,250,0.14)',
          border: '1px solid rgba(167,139,250,0.4)',
          borderRadius: 4, padding: '2px 8px',
        }}>
          BASIN-CONDITIONAL LIPSCHITZ &mdash; imp-3006 &mdash; {v.date}
        </span>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#a78bfa', marginLeft: 'auto',
        }}>
          C_Lip FINITE ON BASIN
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '7px 12px' }}>
        {rows.map(({ label, value, color }) => (
          <React.Fragment key={label}>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', color: '#475569',
              fontWeight: 600, paddingTop: 2, letterSpacing: 0.3,
            }}>
              {label}
            </span>
            <span style={{ fontSize: 12, color, lineHeight: 1.55 }}>
              {value}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── imp-3110 rigor gap notice: monomial toy vs genuine §26 Gram ───────────────
function Section26GramGapNotice() {
  const M = IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP;
  const D = M.differences;
  const S = M.survivesSwap;
  const diffRows = [
    { key: 'D1', label: 'D1 Basis', toy: D.D1_basis.toy, genuine: D.D1_basis.genuine },
    { key: 'D2', label: 'D2 Weight', toy: D.D2_weight.toy, genuine: D.D2_weight.genuine },
    { key: 'D3', label: 'D3 Endpoint', toy: D.D3_endpointStructure.toy, genuine: D.D3_endpointStructure.genuine },
    { key: 'D4', label: 'D4 De-homog', toy: D.D4_deHomogenization.toy, genuine: D.D4_deHomogenization.genuine },
  ];
  const mono = 'var(--font-mono)';
  return (
    <div style={{ marginTop: 24, marginBottom: 8, padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #f43f5e', background: 'rgba(244,63,94,0.05)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#f43f5e', letterSpacing: '0.06em', marginBottom: 6, fontFamily: mono }}>
        RIGOR GAP — MONOMIAL TOY vs. GENUINE §26 GRAM (imp-3110)
      </div>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '0 0 10px' }}>
        Operator measurements in imp-3066/3084/3085/3086 carry the caveat
        &ldquo;representative monomial truncation — NOT the actual §26 Gram.&rdquo; Four concrete axes
        separate the toy from the genuine object; none carry an RH verdict until the genuine §26 Gram
        is computed with the completed Riemann kernel Phi.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px', fontFamily: mono, width: '9%' }}>Axis</th>
              <th style={{ padding: '6px 8px', color: '#f59e0b', width: '38%' }}>Toy (imp-3066 et seq.)</th>
              <th style={{ padding: '6px 8px', color: '#06b6d4', width: '53%' }}>Genuine §26 object</th>
            </tr>
          </thead>
          <tbody>
            {diffRows.map((row) => (
              <tr key={row.key} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '7px 8px', color: '#f43f5e', fontFamily: mono, fontWeight: 700, verticalAlign: 'top' }}>{row.label}</td>
                <td style={{ padding: '7px 8px', color: '#fcd34d', lineHeight: 1.55, verticalAlign: 'top' }}>{row.toy}</td>
                <td style={{ padding: '7px 8px', color: '#67e8f9', lineHeight: 1.55, verticalAlign: 'top' }}>{row.genuine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div style={{ padding: '8px 10px', borderRadius: 5, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 5 }}>SURVIVES THE SWAP (structural)</div>
          {S.survives.map((s, i) => (
            <p key={i} style={{ margin: i > 0 ? '5px 0 0' : 0, color: '#cbd5e1', fontSize: 12, lineHeight: 1.55 }}>{s}</p>
          ))}
        </div>
        <div style={{ padding: '8px 10px', borderRadius: 5, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', marginBottom: 5 }}>TRUNCATION ARTIFACTS (do not carry over)</div>
          {S.artifacts.map((a, i) => (
            <p key={i} style={{ margin: i > 0 ? '5px 0 0' : 0, color: '#cbd5e1', fontSize: 12, lineHeight: 1.55 }}>{a}</p>
          ))}
        </div>
      </div>
      <p style={{ margin: 0, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        {M.honestCaveat.sota}. Source: imp-3110-section26-gram-vs-monomial-gap.js
      </p>
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
      <HonestCeilingBanner variant="ESTIMATE" />
      <div className="page-header">
        <h1>Rigor Dashboard</h1>
        <FreshnessStamp />
        <p>
          Interactive proof-chain visualization with honest rigor-level coloring.
          Every step is either unconditionally proved (green), conditional on a named
          hypothesis (yellow), analytic+numeric (orange), or still open (red).
          Click any step to expand the full claim.
        </p>
      </div>

      {/* Shared two-rigorous-islands + one-estimate tier panel (imp-2791) */}
      <ProofTierSummary />

      {/* Honest SOTA banner (imp-2670) */}
      <HonestSOTABanner />

      {/* Three Lambda cross-validation estimators side by side (imp-2991) */}
      <EstimatorTriptych />

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

      {/* C_H Wall — #1 named opportunity (imp-2980) */}
      <CHWallCallout />

      {/* C_H frontier verdict panel — RH-HARD-CONFIRMED + norm-mismatch diagnosis (imp-3009) */}
      <CHWallFrontierPanel />

      {/* C_H Lipschitz route closed three ways, side by side — impossibility / norm-mismatch / refuted surrogates (imp-3010) */}
      <CHLipThreeProofsPanel />

      {/* Basin-conditional Lipschitz verdict — C_Lip finite on isolated-pair basin (imp-3006/imp-3051) */}
      <BasinConditionalLipschitzPanel />

      {/* C_Lip divergence scope decomposition — basin removes Theta channel only, O(N) survives (imp-3063) */}
      <CLipDivergenceDecompositionPanel />

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

      {/* §26 Gram rigor gap explainer (imp-3110) */}
      <Section26GramGapNotice />

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
        <Link to="/route-map" className="button-secondary" style={{ fontSize: 13 }}>
          Route Map
        </Link>
        <Link to="/proof-overview" className="button-secondary" style={{ fontSize: 13 }}>
          Proof Overview
        </Link>
        <Link to="/lambda-bounds" className="button-secondary" style={{ fontSize: 13 }}>
          Lambda Bounds
        </Link>
      </div>

      {/* Data provenance footer */}
      <div style={{ fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 24, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
        Sourced from <code style={{ color: '#64748b' }}>proof-chain-snapshot-2026-06-23.js</code> · snapshot date {HEADLINE.snapshotDate}
      </div>
    </div>
  );
}
