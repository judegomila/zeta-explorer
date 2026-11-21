import React, { useState } from 'react';
import { SnapshotBanner } from '../components/ProgramStatus.jsx';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import {
  HEADLINE as LEGACY_HEADLINE,
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
import { NEWMAN_LAMBDA_01787854_CANDIDATE } from '../data/newman-lambda-01787854-candidate.js';
import { ED } from '../styles/tokens.js';

// Editorial (warm) re-theme: same structure/data/logic as the original dark
// dashboard, just re-skinned. Every claim/number/status/caveat kept verbatim.

// Color mapping — dark-theme hex accents to warm editorial equivalents.
const GREEN = 'var(--green)';    // was #10b981 / #86efac
const RED = 'var(--terra-dk)';   // was #ef4444
const RED_LIGHT = 'var(--terra)'; // was #fca5a5 / #f87171
const AMBER = 'var(--brass-dk)'; // was #f59e0b / #fbbf24 / #fcd34d
const ORANGE = 'var(--brass)';   // was #f97316 (distinct analytical+numeric tier)
const BLUE = 'var(--blue)';      // was #06b6d4 / #22d3ee / #67e8f9
const PURPLE = 'var(--terra)';   // was #a78bfa (editorial palette has no purple)
const ROSE = 'var(--terra)';     // was #f43f5e (editorial palette has no rose)

// rgba() literals matching the vars above — CSS custom properties can't be fed
// into rgba() directly, so translucent backgrounds/borders use the resolved RGB.
const GREEN_A = (a) => `rgba(76,122,74,${a})`;
const RED_A = (a) => `rgba(194,58,28,${a})`;
const AMBER_A = (a) => `rgba(181,138,46,${a})`;
const ORANGE_A = (a) => `rgba(140,106,29,${a})`;
const BLUE_A = (a) => `rgba(63,107,134,${a})`;
const PURPLE_A = (a) => `rgba(217,80,46,${a})`;
const ROSE_A = PURPLE_A;

// Literal hex twins of GREEN/RED/AMBER/ORANGE — needed anywhere the code
// appends an alpha-hex suffix (e.g. `${color}40`), which only works with a
// real hex string, not a CSS var() reference.
const GREEN_HEX = ED.series3;
const RED_HEX = ED.series2;
const AMBER_HEX = ED.brassDeco;
const ORANGE_HEX = ED.brass;

const MONO = 'var(--ed-mono, var(--font-mono))';

const pillLink = {
  color: 'var(--brass-dk)',
  fontFamily: MONO,
  fontSize: 12,
  textDecoration: 'none',
  padding: '4px 10px',
  border: '1px solid var(--hairline)',
  borderRadius: 6,
};

// ── Assertion freshness stamp (imp-2999) ─────────────────────────────────────
function FreshnessStamp() {
  const { timestamp, passed, failed } = ASSERTION_FRESHNESS;
  const ok = failed === 0;
  const color = ok ? GREEN_HEX : RED_HEX;
  const label = ok ? 'PASS' : 'FAIL';
  // Format: "2026-06-26 02:08 UTC"
  const dt = timestamp.replace('T', ' ').replace('Z', '').slice(0, 16) + ' UTC';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: ok ? GREEN_A(0.07) : RED_A(0.07),
      border: `1px solid ${color}40`,
      borderRadius: 6, padding: '4px 10px',
      marginBottom: 20,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, fontFamily: MONO,
        color, background: `${color}20`, borderRadius: 3,
        padding: '1px 5px',
      }}>
        {label}
      </span>
      <span style={{ fontSize: 12, color: 'var(--faint)', fontFamily: MONO }}>
        Assertions last verified: {dt}
      </span>
      <span style={{ fontSize: 11, color: 'var(--faint)', fontFamily: MONO }}>
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
    border: GREEN_HEX,
    bg: GREEN_A(0.08),
    badge: GREEN_HEX,
    label: 'Unconditional',
  },
  yellow: {
    border: AMBER_HEX,
    bg: AMBER_A(0.07),
    badge: AMBER_HEX,
    label: 'Conditional',
  },
  orange: {
    border: ORANGE_HEX,
    bg: ORANGE_A(0.07),
    badge: ORANGE_HEX,
    label: 'Analytical + Numerical',
  },
  red: {
    border: RED_HEX,
    bg: RED_A(0.07),
    badge: RED_HEX,
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
          <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontFamily: MONO }}>
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
          fontSize: 13, fontWeight: 700, color: 'var(--paper)',
          flexShrink: 0, fontFamily: MONO,
        }}>
          {step.step}
        </div>
        {/* Ticket tag */}
        <span style={{
          fontSize: 11, fontFamily: MONO, color: meta.badge,
          background: `${meta.badge}20`, borderRadius: 4,
          padding: '2px 6px', flexShrink: 0,
        }}>
          {step.ticket}
        </span>
        {/* Status badge */}
        <span style={{
          fontSize: 11, fontFamily: MONO,
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
          <path d="M2 4l5 5 5-5" stroke={ED.rule} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Status line (always visible) */}
      <div style={{
        padding: '0 16px 8px 60px',
        fontSize: 12, color: 'var(--faint)', fontFamily: MONO,
      }}>
        {step.status}
      </div>
      {/* Expanded claim */}
      {expanded && (
        <div style={{
          padding: '10px 16px 14px 60px',
          borderTop: `1px solid ${meta.border}40`,
          fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6,
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
  const borderColor = isOpen ? 'var(--terra-dk)' : isConditional ? 'var(--brass-dk)' : 'var(--green)';
  const bgColor = isOpen
    ? RED_A(0.07)
    : isConditional
    ? AMBER_A(0.07)
    : GREEN_A(0.08);

  return (
    <div style={{
      border: `1px solid ${borderColor}`,
      borderRadius: 8, background: bgColor,
      padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 6 }}>
        {route.name}
      </div>
      <div style={{
        fontSize: 11, fontFamily: MONO, color: borderColor,
        marginBottom: 8,
      }}>
        {route.status}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 6 }}>
        {route.summary}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
        <span style={{ color: 'var(--faint)' }}>Closes if: </span>
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
          fontSize: 12, fontWeight: 700, fontFamily: MONO,
          color: meta.badge,
        }}>
          {cond.id}
        </span>
        {cond.ticket && (
          <span style={{
            fontSize: 11, color: 'var(--faint)', fontFamily: MONO,
            marginLeft: 'auto',
          }}>
            {cond.ticket}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, marginLeft: 17 }}>
        {cond.description}
      </div>
      {cond.condition && (
        <div style={{ fontSize: 11, color: 'var(--faint)', marginLeft: 17, marginTop: 4 }}>
          Requires: {cond.condition}
        </div>
      )}
      {cond.wouldClose && (
        <div style={{ fontSize: 11, color: 'var(--faint)', marginLeft: 17, marginTop: 4 }}>
          Would close: {cond.wouldClose}
        </div>
      )}
    </div>
  );
}


function TransparencyLedger() {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 className="ed-h2" style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 8 }}>
        Corrections Log
      </h2>
      <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 16, lineHeight: 1.6 }}>
        Internal record of claims that overreached the evidence during development and were later
        corrected. Format: claim made &rarr; how caught &rarr; correction &rarr; current status.
      </p>
      {CAUGHT_OVERCLAIMS.map((entry, i) => (
        <div
          key={entry.id}
          style={{
            border: `1px solid ${RED_A(0.25)}`,
            borderRadius: 8,
            background: RED_A(0.04),
            padding: '14px 16px',
            marginBottom: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{
              fontSize: 11, fontFamily: MONO,
              color: RED,
              background: RED_A(0.12),
              border: `1px solid ${RED_A(0.3)}`,
              borderRadius: 4, padding: '2px 7px',
              flexShrink: 0,
            }}>
              {'OVERCLAIM #' + (i + 1)}
            </span>
            <span style={{ fontSize: 11, color: 'var(--faint)', fontFamily: MONO }}>
              {entry.id}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 12px', fontSize: 12 }}>
            <span style={{ color: 'var(--faint)', fontFamily: MONO, paddingTop: 2, fontWeight: 600 }}>CLAIM</span>
            <span style={{ color: 'var(--ink-soft)', lineHeight: 1.5 }}>{entry.claim}</span>
            <span style={{ color: 'var(--faint)', fontFamily: MONO, paddingTop: 2, fontWeight: 600 }}>CAUGHT BY</span>
            <span style={{ color: 'var(--ink-soft)', lineHeight: 1.5 }}>{entry.caughtBy}</span>
            <span style={{ color: 'var(--faint)', fontFamily: MONO, paddingTop: 2, fontWeight: 600 }}>CORRECTION</span>
            <span style={{ color: 'var(--ink-soft)', lineHeight: 1.5 }}>{entry.correction}</span>
            <span style={{ color: 'var(--faint)', fontFamily: MONO, paddingTop: 2, fontWeight: 600 }}>STATUS</span>
            <span style={{ color: AMBER, lineHeight: 1.5, fontWeight: 600 }}>{entry.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── SOTA banner (imp-2670) ────────────────────────────────────────────
const SOTA_TIERS = [
  {
    key: 'rigorous',
    label: 'BOUND EVIDENCE GRADES',
    color: GREEN,
    bg: GREEN_A(0.08),
    items: [
      'Rodgers–Tao (2020): Λ ≥ 0 — unconditional.',
      'Platt–Trudgian (2021): Λ ≤ 0.2 — peer-reviewed upper-bound benchmark.',
      'Public 2026 package claim: Λ ≤ 0.1875 — listed and locally repaired, but unrefereed.',
      'standalone repository: Λ ≤ 0.1787854 — computer-assisted candidate for an unconditional proof; reviewed by Dan Romik; unrefereed; bound not established; not RH.',
      <React.Fragment key="c-01758354">
        <Link to="/lambda-01758354-candidate" style={{ color: 'inherit' }}>Λ ≤ 0.1758354</Link>
        {' '}— sharper computer-assisted candidate; four Arb interval gates plus a Lean-checked
        reduction; unrefereed; bound not established; not RH.
      </React.Fragment>,
    ],
  },
  {
    key: 'contract',
    label: 'COMPLETION CONTRACT — NOT A BOUND',
    color: ORANGE,
    bg: ORANGE_A(0.07),
    items: [
      <React.Fragment key="contract-014">
        <Link to="/permutation-architecture" style={{ color: 'inherit' }}>Λ ≤ 0.14 completion
        contract</Link>{' '}— a conditional contract, NOT a bound: Λ ≤ 0.14 would follow if its
        zero-free statements hold. ONE open family remains — |C_E,17| &lt; 0.2796881955526147 on
        690988 ≤ N ≤ 54799999 — with the [B_v,Π_p] weld as the decisive object.
      </React.Fragment>,
    ],
  },
  {
    key: 'estimate',
    label: 'ESTIMATE — NOT RIGOROUS',
    color: AMBER,
    bg: AMBER_A(0.08),
    items: [
      'Finite-N* = 1e4 self-consistent estimate Λ ≈ 0.013.',
      'Gated by the undischargeable constant C_H (imp-2640 NEGATIVE); a heuristic target, NOT a proof.',
    ],
  },
  {
    key: 'refuted',
    label: 'REFUTED / DEAD ROUTES',
    color: RED,
    bg: RED_A(0.07),
    items: [
      CAUGHT_OVERCLAIMS.length + ' claims overreached the evidence and were corrected (see Corrections Log below).',
      'No legacy Dyson/Volterra overclaim beats its stated benchmark; the thin-strip framing is structurally dead (imp-2630). The separate Λ ≤ 0.1787854 package uses a different fixed-height route, but remains a computer-assisted candidate whose bound is not established.',
    ],
  },
];

function HonestSOTABanner() {
  return (
    <div style={{
      border: '1px solid var(--hairline)', borderRadius: 10,
      background: 'var(--paper2)', padding: '14px 18px', marginBottom: 24,
    }}>
      <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: MONO, marginBottom: 12, letterSpacing: 0.5 }}>
        RIGOR HIERARCHY &mdash; WHAT IS PROVED vs ESTIMATED vs REFUTED
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
              fontSize: 12, fontWeight: 700, fontFamily: MONO,
              color: tier.color, marginBottom: 8,
            }}>
              {tier.label}
            </div>
            {tier.items.map((text, i) => (
              <div key={i} style={{
                fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5,
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
      border: '1px solid var(--hairline)', borderRadius: 10,
      background: 'var(--paper2)', padding: '14px 18px', marginBottom: 24,
    }}>
      <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: MONO, marginBottom: 6, letterSpacing: 0.5 }}>
        LAMBDA CROSS-VALIDATION &mdash; THREE INDEPENDENT ESTIMATORS (imp-2991)
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
        {t.subtitle}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 12,
      }}>
        {t.estimators.map(e => (
          <div key={e.key} style={{
            border: `1px solid ${AMBER}`, borderRadius: 8,
            background: AMBER_A(0.07), padding: '11px 13px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{e.label}</span>
              <span style={{ fontSize: 10, color: 'var(--faint)', fontFamily: MONO, marginLeft: 'auto' }}>
                {e.ticket}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: AMBER, fontFamily: MONO, marginBottom: 4 }}>
              {'Λ ' + e.representativeLambda}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 6 }}>
              {e.scope}
            </div>
            <span style={{
              display: 'inline-block', fontSize: 10, fontFamily: MONO,
              color: AMBER, border: `1px solid ${AMBER_A(0.5)}`, borderRadius: 4,
              padding: '1px 6px', marginBottom: 8,
            }}>
              {e.status + ' · ' + e.kind}
            </span>
            {e.key === 'kernel-hack' && (
              <span style={{
                display: 'inline-block', fontSize: 10, fontFamily: MONO,
                color: RED_LIGHT, border: `1px solid ${PURPLE_A(0.5)}`, borderRadius: 4,
                padding: '1px 6px', marginBottom: 8, marginLeft: 6,
              }}>
                DIFFERENT SCALE — scope-matched only
              </span>
            )}
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {e.honestLimit}
            </div>
            <div style={{ fontSize: 10, color: 'var(--faint)', fontFamily: MONO, marginTop: 6 }}>
              {e.ownerModule}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 12 }}>
        {t.crossValidation}
      </div>
      <div style={{ fontSize: 11, color: AMBER, lineHeight: 1.6, marginTop: 8, fontFamily: MONO }}>
        {t.honestCeiling}
      </div>
    </div>
  );
}

function CHWallCallout() {
  const opp = RANKED_OPPORTUNITIES[0];
  return (
    <div style={{
      border: `2px solid ${RED}`,
      borderRadius: 10,
      background: RED_A(0.06),
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
      }}>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: RED, background: RED_A(0.14),
          border: `1px solid ${RED_A(0.4)}`,
          borderRadius: 4, padding: '2px 8px', flexShrink: 0,
        }}>
          {'#' + opp.rank + ' OPPORTUNITY — CRITICAL WALL'}
        </span>
        <Link to="/route-map" style={{
          fontSize: 11, fontFamily: MONO, color: 'var(--faint)',
          textDecoration: 'none', marginLeft: 'auto',
        }}>
          Route Map →
        </Link>
        <Link to="/rh-dag" style={{
          fontSize: 11, fontFamily: MONO, color: 'var(--faint)',
          textDecoration: 'none',
        }}>
          DAG →
        </Link>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
        {opp.target}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        {opp.why}
      </div>
    </div>
  );
}

function CHWallFrontierPanel() {
  const v = CH_WALL_FRONTIER;
  const rows = [
    { label: 'VERDICT', value: v.verdict, color: RED },
    { label: 'LIPSCHITZ ROUTE', value: v.lipschitzRouteClosed, color: ORANGE },
    { label: 'NORM-MISMATCH', value: v.sharpestDiagnosis, color: AMBER },
    { label: 'h=g² RECON', value: v.reconditioning, color: PURPLE },
    { label: 'C_THETA STATUS', value: v.cThetaStatus, color: AMBER },
    { label: 'DETERMINISTIC RESIDUAL', value: v.residual, color: GREEN },
    { label: 'FORECLOSED', value: v.foreclosed, color: RED },
    // v.sota ("remains the rigorous SOTA" refrain) intentionally not rendered;
    // PT Λ ≤ 0.2 is stated once, in the banner above.
  ];
  return (
    <div style={{
      border: `1px solid ${RED_A(0.4)}`,
      borderRadius: 10,
      background: 'var(--paper2)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: RED, background: RED_A(0.14),
          border: `1px solid ${RED_A(0.4)}`,
          borderRadius: 4, padding: '2px 8px',
        }}>
          C_H FRONTIER VERDICT &mdash; {v.date}
        </span>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: RED, marginLeft: 'auto',
        }}>
          {v.verdict}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '7px 12px' }}>
        {rows.map(({ label, value, color }) => (
          <React.Fragment key={label}>
            <span style={{
              fontSize: 11, fontFamily: MONO, color: 'var(--faint)',
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
        marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--hairline)',
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
        fontSize: 11, fontFamily: MONO, color: 'var(--faint)',
      }}>
        <span>SAME VERDICT APPEARS IN:</span>
        <Link to="/route-map" style={{ color: 'var(--faint)', textDecoration: 'none' }}>
          Route Map (Frontier Push) →
        </Link>
        <Link to="/what-we-know" style={{ color: 'var(--faint)', textDecoration: 'none' }}>
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
      border: `1px solid ${RED_A(0.4)}`,
      borderRadius: 10,
      background: 'var(--paper2)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: RED, background: RED_A(0.14),
          border: `1px solid ${RED_A(0.4)}`,
          borderRadius: 4, padding: '2px 8px',
        }}>
          C_H LIPSCHITZ ROUTE &mdash; CLOSED THREE WAYS &mdash; imp-3010
        </span>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: RED, marginLeft: 'auto',
        }}>
          {t.verdict}
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
        {t.claim}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        {t.proofs.map((p) => (
          <div key={p.key} style={{
            border: `1px solid ${RED_A(0.35)}`,
            borderRadius: 7, background: RED_A(0.05),
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: RED_LIGHT, marginBottom: 6 }}>
              {p.n}. {p.name}
            </div>
            <div style={{ fontSize: 10, fontFamily: MONO, color: AMBER, marginBottom: 6, letterSpacing: 0.2 }}>
              {p.rigor.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 6 }}>
              {p.mechanism}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 6 }}>
              &rarr; {p.result}
            </div>
            <div style={{ fontSize: 10, color: 'var(--faint)', lineHeight: 1.5, marginBottom: 4 }}>
              {p.witness}
            </div>
            <div style={{ fontSize: 10, color: 'var(--faint)', lineHeight: 1.5 }}>
              Escape: {p.escape}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        border: `1px solid ${GREEN_A(0.3)}`,
        borderRadius: 6, background: GREEN_A(0.06),
        padding: '8px 12px', fontSize: 11, color: GREEN, lineHeight: 1.6,
        marginBottom: 8,
      }}>
        DETERMINISTIC RESIDUAL: {t.deterministicResidual}
      </div>
      <div style={{
        border: `1px solid ${RED_A(0.3)}`,
        borderRadius: 6, background: RED_A(0.06),
        padding: '8px 12px', fontSize: 11, color: RED_LIGHT, lineHeight: 1.6,
        fontFamily: MONO,
      }}>
        {/* Strip the appended "remains the rigorous SOTA" refrain; PT is stated once in the banner. */}
        CAVEAT: {t.honest.replace(CH_WALL_FRONTIER.sota, '').trim()}
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
      border: `1px solid ${RED_A(0.45)}`,
      borderRadius: 10,
      background: 'var(--paper2)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: RED, background: RED_A(0.12),
          border: `1px solid ${RED_A(0.4)}`,
          borderRadius: 4, padding: '2px 8px',
        }}>
          C_Lip DIVERGENCE SCOPE &mdash; imp-3063 &mdash; {d.date}
        </span>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: 'var(--faint)', marginLeft: 'auto',
        }}>
          O(N) SURVIVES
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
        Formula: <span style={{ fontFamily: MONO, color: 'var(--ink)' }}>{d.formula}</span>
        <br />
        The basin reconditioning decomposes the two independent divergence sources and removes exactly one.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{
          border: `1px solid ${GREEN_A(0.4)}`,
          borderRadius: 7, background: GREEN_A(0.06),
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: GREEN, marginBottom: 6 }}>
            THETA CHANNEL &mdash; REMOVED
          </div>
          <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--ink)', marginBottom: 4 }}>
            {tc.factor}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 6 }}>
            {tc.mechanism}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '3px 8px', fontSize: 11 }}>
            <span style={{ color: 'var(--faint)', fontFamily: MONO }}>ON-BASIN</span>
            <span style={{ color: GREEN, fontFamily: MONO }}>
              {tc.basinNominal.toFixed(1)} (Theta=0) &ndash; {tc.basinCeiling.toFixed(4)} (Theta=1/4 trap)
            </span>
            <span style={{ color: 'var(--faint)', fontFamily: MONO }}>OFF-BASIN</span>
            <span style={{ color: RED, fontFamily: MONO }}>
              {tc.offBasinBlowup[0]} &ndash; {tc.offBasinBlowup[1]} (dTheta/W_1 ~ 1/g0)
            </span>
          </div>
        </div>
        <div style={{
          border: `1px solid ${RED_A(0.4)}`,
          borderRadius: 7, background: RED_A(0.06),
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: RED, marginBottom: 6 }}>
            LINEAR-N CHANNEL &mdash; UNTOUCHED
          </div>
          <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--ink)', marginBottom: 4 }}>
            {nc.factor} &nbsp; (at N*=1e4: value = {nc.valueAtNAst.toExponential(0)})
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {nc.mechanism}
          </div>
        </div>
      </div>
      <div style={{
        border: `1px solid ${RED_A(0.3)}`,
        borderRadius: 6, background: RED_A(0.06),
        padding: '8px 12px', fontSize: 11, color: RED_LIGHT, lineHeight: 1.6,
        fontFamily: MONO,
      }}>
        CAVEAT: {d.honest}
      </div>
    </div>
  );
}

function BasinConditionalLipschitzPanel() {
  const v = CH_LIP_BASIN_CONDITIONAL;
  const rows = [
    { label: 'STATUS', value: v.status, color: PURPLE },
    { label: 'c* CLOSED FORM', value: `sqrt(2+sqrt(3))-1 ≈ ${v.cStarClosedForm.toFixed(5)} (imp-3005, exact)`, color: GREEN },
    { label: 'BASIN SEPARATION', value: `basin rho=0.72 < asym bracket inf 0.927 (margin ${v.basinSafetyMargin.toFixed(3)}); d(rho)/ds<0 certified independent of open global constant`, color: GREEN },
    { label: 'GAP CHANNEL', value: `g_min/4 ≈ ${v.gapChannelNominal.toExponential(2)} (nominal) – g_min/3 ≈ ${v.gapChannelTrappedCeiling.toExponential(3)} (Theta=1/4 ceiling); dominant on basin`, color: AMBER },
    { label: 'C_THETA', value: v.cThetaStatus, color: 'var(--faint)' },
    { label: 'GLOBAL CONSTANT', value: v.globalConstantStatus, color: ORANGE },
    { label: 'CAVEAT', value: v.honest, color: RED },
  ];
  return (
    <div style={{
      border: `1px solid ${PURPLE_A(0.4)}`,
      borderRadius: 10,
      background: 'var(--paper2)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: PURPLE, background: PURPLE_A(0.14),
          border: `1px solid ${PURPLE_A(0.4)}`,
          borderRadius: 4, padding: '2px 8px',
        }}>
          BASIN-CONDITIONAL LIPSCHITZ &mdash; imp-3006 &mdash; {v.date}
        </span>
        <span style={{
          fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: PURPLE, marginLeft: 'auto',
        }}>
          C_Lip FINITE ON BASIN
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '7px 12px' }}>
        {rows.map(({ label, value, color }) => (
          <React.Fragment key={label}>
            <span style={{
              fontSize: 11, fontFamily: MONO, color: 'var(--faint)',
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
  return (
    <div style={{ marginTop: 24, marginBottom: 8, padding: '14px 18px', borderRadius: 8, borderLeft: `4px solid ${ROSE}`, background: ROSE_A(0.05) }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ROSE, letterSpacing: '0.06em', marginBottom: 6, fontFamily: MONO }}>
        RIGOR GAP — MONOMIAL TOY vs. GENUINE §26 GRAM (imp-3110)
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, margin: '0 0 10px' }}>
        Operator measurements in imp-3066/3084/3085/3086 carry the caveat
        &ldquo;representative monomial truncation — NOT the actual §26 Gram.&rdquo; Four concrete axes
        separate the toy from the genuine object; none carry an RH verdict until the genuine §26 Gram
        is computed with the completed Riemann kernel Phi.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--faint)', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px', fontFamily: MONO, width: '9%' }}>Axis</th>
              <th style={{ padding: '6px 8px', color: AMBER, width: '38%' }}>Toy (imp-3066 et seq.)</th>
              <th style={{ padding: '6px 8px', color: BLUE, width: '53%' }}>Genuine §26 object</th>
            </tr>
          </thead>
          <tbody>
            {diffRows.map((row) => (
              <tr key={row.key} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '7px 8px', color: ROSE, fontFamily: MONO, fontWeight: 700, verticalAlign: 'top' }}>{row.label}</td>
                <td style={{ padding: '7px 8px', color: AMBER, lineHeight: 1.55, verticalAlign: 'top' }}>{row.toy}</td>
                <td style={{ padding: '7px 8px', color: BLUE, lineHeight: 1.55, verticalAlign: 'top' }}>{row.genuine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div style={{ padding: '8px 10px', borderRadius: 5, background: GREEN_A(0.07), border: `1px solid ${GREEN_A(0.3)}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 5 }}>SURVIVES THE SWAP (structural)</div>
          {S.survives.map((s, i) => (
            <p key={i} style={{ margin: i > 0 ? '5px 0 0' : 0, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.55 }}>{s}</p>
          ))}
        </div>
        <div style={{ padding: '8px 10px', borderRadius: 5, background: RED_A(0.07), border: `1px solid ${RED_A(0.3)}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: RED_LIGHT, marginBottom: 5 }}>TRUNCATION ARTIFACTS (do not carry over)</div>
          {S.artifacts.map((a, i) => (
            <p key={i} style={{ margin: i > 0 ? '5px 0 0' : 0, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.55 }}>{a}</p>
          ))}
        </div>
      </div>
      <p style={{ margin: 0, color: 'var(--faint)', fontSize: 11, fontFamily: MONO }}>
        Source: imp-3110-section26-gram-vs-monomial-gap.js
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner variant="PROOF-CANDIDATE" />
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Rigor Dashboard</h1>
          <SnapshotBanner date="2026-10-04">The proof-chain and route data on this page are dated 2026-06-19 to 2026-06-30.</SnapshotBanner>
          <FreshnessStamp />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Interactive proof-chain visualization with rigor-level coloring.
            Every step is either unconditionally proved (green), conditional on a named
            hypothesis (yellow), analytic+numeric (orange), or still open (red).
            Click any step to expand the full claim.
            The proof-chain data is a <strong>snapshot (2026-06-23)</strong>; the live graded
            ledger is <Link to="/results" style={{ color: 'var(--brass-dk)' }}>/results</Link>.
          </p>
        </div>

        {/* Shared evidence-grade tier panel for the 0.1787854 candidate package */}
        <ProofTierSummary />

        {/* SOTA banner (imp-2670) */}
        <HonestSOTABanner />

        {/* Three Lambda cross-validation estimators side by side (imp-2991) */}
        <EstimatorTriptych />

        {/* Candidate + contract frontier; the older chain panels below retain their dated snapshot. */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12, marginBottom: 24,
        }}>
          <div style={{
            background: BLUE_A(0.06), border: `1px solid ${BLUE_A(0.4)}`,
            borderRadius: 10, padding: '14px 18px',
          }}>
            <div style={{ fontSize: 11, color: BLUE, fontFamily: MONO, marginBottom: 6 }}>
              CANDIDATE — reviewed package (one of two candidates)
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              <Link to="/newman-lambda-01787854-candidate" style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${BLUE_A(0.4)}` }}>
                Λ ≤ {NEWMAN_LAMBDA_01787854_CANDIDATE.exactTarget.decimal}
              </Link>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
              {NEWMAN_LAMBDA_01787854_CANDIDATE.finiteEvidence.rowCount.toLocaleString()}-row material replay
              &nbsp;|&nbsp; candidate commit {NEWMAN_LAMBDA_01787854_CANDIDATE.identity.packageCommit.slice(0, 12)}
            </div>
            <div style={{ fontSize: 12, color: AMBER, fontFamily: MONO }}>
              UNREFEREED — REVIEWED BY DAN ROMIK; BEING PREPARED FOR PUBLIC RELEASE · COMPUTER-ASSISTED CANDIDATE FOR AN UNCONDITIONAL PROOF · BOUND NOT ESTABLISHED · NOT RH
            </div>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4 }}>
              The package supplies claimed compact-slab, final-time-half-strip, finite/tail,
              and exact-criterion interfaces for review. A seal and green replay do not by
              themselves establish the bound. RH remains open and requires Λ ≤ 0.
            </div>
          </div>
          <div style={{
            background: BLUE_A(0.06), border: `1px solid ${BLUE_A(0.4)}`,
            borderRadius: 10, padding: '14px 18px',
          }}>
            <div style={{ fontSize: 11, color: BLUE, fontFamily: MONO, marginBottom: 6 }}>
              CANDIDATE — sharper package
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              <Link to="/lambda-01758354-candidate" style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${BLUE_A(0.4)}` }}>
                Λ ≤ 0.1758354
              </Link>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
              Revised mollifier + extended finite lane; four independent gates machine-checked in
              Arb interval arithmetic; y-transfer reduction and Lemma B3 Lean-checked.
            </div>
            <div style={{ fontSize: 12, color: AMBER, fontFamily: MONO }}>
              UNREFEREED COMPUTER-ASSISTED CANDIDATE · BOUND NOT ESTABLISHED · NOT RH
            </div>
          </div>
          <div style={{
            background: ORANGE_A(0.06), border: `1px solid ${ORANGE_A(0.4)}`,
            borderRadius: 10, padding: '14px 18px',
          }}>
            <div style={{ fontSize: 11, color: ORANGE, fontFamily: MONO, marginBottom: 6 }}>
              Λ ≤ 0.14 COMPLETION CONTRACT — A CONTRACT, NOT A BOUND
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              <Link to="/permutation-architecture" style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${ORANGE_A(0.4)}` }}>
                Contract: Λ ≤ 0.14
              </Link>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
              Conditional: Λ ≤ 0.14 would follow if its zero-free statements hold. ONE open family
              remains — |C_E,17| &lt; 0.2796881955526147 on 690988 ≤ N ≤ 54799999 — with the
              [B_v,Π_p] weld as the decisive object.
            </div>
            <div style={{ fontSize: 12, color: AMBER, fontFamily: MONO }}>
              NOT A BOUND · NOT PROMOTED · ONE OPEN FAMILY
            </div>
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
            { label: 'Unconditional', count: greenCount, color: GREEN },
            { label: 'Conditional', count: yellowCount, color: AMBER },
            { label: 'Analytic+Num', count: orangeCount, color: ORANGE },
            { label: 'Open', count: redCount, color: RED },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="card"
              style={{ textAlign: 'center', padding: '12px 8px' }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: MONO }}>
                {count}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <Legend />

        {/* Proof chain */}
        <h2 className="ed-h2" style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>
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
        <h2 className="ed-h2" style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>
          Route Status
        </h2>
        <div style={{ marginBottom: 32 }}>
          {Object.values(ROUTE_STATUS).map(route => (
            <RouteCard key={route.name} route={route} />
          ))}
        </div>

        {/* Conditions */}
        <h2 className="ed-h2" style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>
          Proof Conditions
        </h2>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 8, fontFamily: MONO }}>
            ESTABLISHED UNCONDITIONALLY
          </div>
          {CONDITIONS.established.map(c => (
            <ConditionBadge key={c.id} cond={c} color="green" />
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 8, fontFamily: MONO }}>
            ESTABLISHED CONDITIONAL
          </div>
          {CONDITIONS.establishedConditional.map(c => (
            <ConditionBadge key={c.id} cond={c} color="yellow" />
          ))}
        </div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 8, fontFamily: MONO }}>
            OPEN CONDITIONS
          </div>
          {CONDITIONS.open.map(c => (
            <ConditionBadge key={c.id} cond={c} color="red" />
          ))}
        </div>

        {/* Transparency ledger */}
        <TransparencyLedger />

        {/* Related pages + provenance footer */}
        <footer style={{ marginTop: 8, borderTop: '1px solid var(--hairline)', paddingTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: MONO, marginBottom: 10 }}>
            Related pages:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Link to="/rigor" style={pillLink}>RH Rigor Check</Link>
            <Link to="/rh-dag" style={pillLink}>Dependency DAG</Link>
            <Link to="/route-map" style={pillLink}>Route Map</Link>
            <Link to="/proof-overview" style={pillLink}>Proof Overview</Link>
            <Link to="/lambda-bounds" style={pillLink}>Lambda Bounds</Link>
          </div>

          {/* Data provenance footer */}
          <div style={{ fontSize: 11, color: 'var(--faint)', textAlign: 'center', marginTop: 24, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            Legacy chain panels retain <code style={{ color: 'var(--faint)' }}>proof-chain-snapshot-2026-06-23.js</code>
            {' '}· snapshot date {LEGACY_HEADLINE.snapshotDate}. Current Λ status is sourced from the candidate registry.
          </div>

          <div style={{ marginTop: 12 }}>
            <Link to="/">← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
