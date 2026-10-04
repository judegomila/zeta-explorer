import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import {
  LAMBDA_ROADMAP,
  LAMBDA_BOUNDS,
  LAMBDA_CHAIN_STEPS,
  VERIFICATION_EFFORTS,
  OPEN_GAPS,
} from '../data/lambda-roadmap.js';
import { IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE } from '../data/imp-33828-sigma-decay-landmark-ladder-reference.js';
import { ED, alpha } from '../styles/tokens.js';

// Lambda Bounds & RH Roadmap — the plan, the status, the verification.
// Read interface for src/data/lambda-roadmap.js.
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

// ── Style helpers ──────────────────────────────────────────────────────────

const chip = (bg, fg, border) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: 10,
  fontSize: 10,
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  background: bg,
  color: fg,
  border: `1px solid ${border}`,
});

const CHIPS = {
  rigorous: chip(alpha(ED.series3, 0.14), 'var(--green)', alpha(ED.series3, 0.4)),
  'cross-verified': chip(alpha(ED.series1, 0.14), 'var(--blue)', alpha(ED.series1, 0.4)),
  numerical: chip(alpha(ED.brassDeco, 0.16), 'var(--brass-dk)', alpha(ED.brassDeco, 0.45)),
  unverified: chip(alpha(ED.series2, 0.14), 'var(--terra-dk)', alpha(ED.series2, 0.4)),
  closed: chip(alpha(ED.series3, 0.14), 'var(--green)', alpha(ED.series3, 0.4)),
  open: chip(alpha(ED.series2, 0.14), 'var(--terra-dk)', alpha(ED.series2, 0.4)),
  partial: chip(alpha(ED.brassDeco, 0.16), 'var(--brass-dk)', alpha(ED.brassDeco, 0.45)),
  'public-preprint-review-open': chip(alpha(ED.series1, 0.16), 'var(--blue)', alpha(ED.series1, 0.45)),
  'unreviewed-proof-candidate': chip(alpha(ED.series1, 0.16), 'var(--blue)', alpha(ED.series1, 0.45)),
  'conditional-g6a-open': chip(alpha(ED.series2, 0.14), 'var(--terra-dk)', alpha(ED.series2, 0.4)),
  'estimate-c-h-open': chip(alpha(ED.brassDeco, 0.16), 'var(--brass-dk)', alpha(ED.brassDeco, 0.45)),
  critical: chip(alpha(ED.series2, 0.2), 'var(--terra-dk)', alpha(ED.series2, 0.55)),
  high: chip(alpha(ED.brassDeco, 0.16), 'var(--brass-dk)', alpha(ED.brassDeco, 0.45)),
};

function statusChip(status) {
  return CHIPS[status] || CHIPS.unverified;
}

function gapSeverityChip(severity) {
  return CHIPS[severity] || CHIPS.open;
}

// ── Render-site copy pass (2026-08-28 currency audit) ──────────────────────
// The data module (lambda-roadmap.js) is pinned by build assertions and is not
// edited. Two display adjustments happen here instead:
//   1. The Platt-Trudgian Λ ≤ 0.2 benchmark is stated once on this page, on the
//      peer-reviewed-benchmark card itself; the repeated "remains …benchmark /
//      SOTA" tag-lines on the other cards are suppressed.
//   2. The 0.1787854 candidate carries its current review status: reviewed by
//      Dan Romik, publicly posted (judegomila.com/posts/riemann-lambda-0.1787854), unrefereed.

const PT_REFRAIN_AFTER_SEMICOLON = /;\s*(?:Platt[–-]Trudgian\s+)?Λ ≤ 0\.2 remains[^.]*\./g;
const PT_REFRAIN_SENTENCE = /\s*(?:Platt[–-]Trudgian\s+)?Λ ≤ 0\.2 remains[^.]*\./g;

function displayNote(b) {
  let note = b.note || '';
  if (b.kind !== 'upper-peer-reviewed-benchmark') {
    note = note
      .replace(PT_REFRAIN_AFTER_SEMICOLON, '.')
      .replace(PT_REFRAIN_SENTENCE, '');
  }
  if (b.id === 'local-fixed-height-candidate-01787854') {
    note = note.replace(
      'the claim is private, unpublished, unpeer-reviewed, not accepted, and does not prove RH.',
      'the claim is a computer-assisted candidate that has been reviewed by Dan Romik and is ' +
      'publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); it is unrefereed, not accepted, and does not prove RH.',
    );
  }
  return note.trim();
}

function displayLabel(b) {
  if (b.id === 'local-fixed-height-candidate-01787854') {
    return 'Proof candidate (Romik-reviewed, unrefereed): Λ ≤ 0.1787854';
  }
  if (b.id === 'local-sharper-candidate-01758354') {
    return 'Sharper candidate (unrefereed): Λ ≤ 0.1758354';
  }
  return b.label;
}

function displayStatus(status) {
  return status === 'unreviewed-proof-candidate' ? 'unrefereed-proof-candidate' : status;
}

function displayTLDR(tldr) {
  return (tldr || '')
    .replace(
      'Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed upper-bound benchmark.',
      'Platt-Trudgian Lambda <= 0.2 is the peer-reviewed upper-bound benchmark.',
    )
    .replace(
      'A separate private v3 package proposes Lambda <= 0.1787854 as an unreviewed ' +
      'computer-assisted proof candidate for an unconditional bound; it is not established, ' +
      'published, peer-reviewed, or accepted, and RH still requires Lambda <= 0.',
      'A separate private v3 package proposes Lambda <= 0.1787854 as a computer-assisted proof ' +
      'candidate for an unconditional bound — reviewed by Dan Romik and being prepared for public ' +
      'release, but unrefereed and not established. A sharper four-gate candidate reaches ' +
      'Lambda <= 0.1758354 (four Arb-checked gates, Lean-checked y-transfer reduction and Lemma B3; unrefereed, not ' +
      'established). The strict Lambda <= 0.14 statement is a conditional completion contract ' +
      'reduced to one open family, not a bound. RH still requires Lambda <= 0.',
    );
}

// Chain-step caveats repeat the PT tag-line in ASCII form; same suppression.
const ASCII_PT_REFRAIN =
  'Platt-Trudgian Lambda <= 0\\.2 (?:remains|stays) (?:the peer-reviewed benchmark|SOTA)';
function displayCaveat(text) {
  return (text || '')
    .replace(new RegExp(`;\\s*${ASCII_PT_REFRAIN}\\.`, 'g'), '.')
    .replace(new RegExp(`;\\s*${ASCII_PT_REFRAIN};\\s*`, 'g'), '; ')
    .replace(new RegExp(`\\s*${ASCII_PT_REFRAIN};\\s*`, 'g'), ' ')
    .trim();
}

function displayCurrentStatus(status) {
  return (status || '')
    .replace(
      'STATUS RECONCILED 2026-07-28: Platt-Trudgian Lambda <= 0.2 remains the accepted peer-reviewed benchmark.',
      'STATUS RECONCILED 2026-07-28: Platt-Trudgian Lambda <= 0.2 is the accepted peer-reviewed benchmark.',
    )
    .replace(
      'is an unreviewed computer-assisted proof candidate for an unconditional 0.1787854 bound.',
      'is a computer-assisted proof candidate for an unconditional 0.1787854 bound, reviewed by Dan Romik and unrefereed.',
    )
    .replace(
      'The candidate is unpublished, unpeer-reviewed, unaccepted, and it does not prove RH.',
      'The candidate is publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); it is unrefereed, unaccepted, and it does not prove RH.',
    );
}

function ticketLink(id) {
  return (
    <Link
      key={id}
      to="/improvement-queue"
      style={{
        fontFamily: 'var(--ed-mono, var(--font-mono))',
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 4,
        background: 'var(--paper)',
        color: 'var(--brass)',
        border: '1px solid var(--hairline)',
        textDecoration: 'none',
        marginRight: 4,
        marginBottom: 4,
        display: 'inline-block',
      }}
    >
      {id}
    </Link>
  );
}

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

// ── The page ───────────────────────────────────────────────────────────────

export default function LambdaBoundsPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>Λ bounds ledger</span>} />
      <div className="ed-full" style={{ padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Λ Bounds &amp; RH Roadmap</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            The de Bruijn-Newman constant Λ is the essential bridge between
            a numerical Λ upper bound and the Riemann Hypothesis itself.
            RH ⟺ Λ = 0 (de Bruijn 1950 + Rodgers-Tao 2020). This page is the
            plan, the status, and the verification efforts of our approach.
          </p>
          <div style={{ maxWidth: 460, border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', margin: '14px 0 4px', background: 'var(--paper)' }}>
            <WireframeAnim kind="de-bruijn-track" />
          </div>
      <AnimationEmbed id="lambda-history" />

          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link
              to="/lambda-timeline"
              style={{
                color: 'var(--brass)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                border: '1px solid var(--brass)',
                borderRadius: 6,
              }}
            >
              Λ Timeline →
            </Link>
            <span style={{
              color: 'var(--terra-dk)',
              fontFamily: 'var(--ed-mono, var(--font-mono))',
              fontSize: 11,
              padding: '4px 10px',
              border: '1px solid color-mix(in srgb, var(--accent) 45%, transparent)',
              borderRadius: 6,
              background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
            }}>
              The internal finite-height “beat” draft was never published: C_H is undischarged, so it stays an estimate
            </span>
          </div>
        </div>

        {/* ── Top banner: current bounds ─────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Bounds, estimates, and evidence grades</h2>
        <div className="card-grid" style={{ marginBottom: 24 }}>
          {LAMBDA_BOUNDS.map((b) => (
            <div
              key={b.id}
              className="card"
              style={cardBaseLeft(
                b.kind === 'lower'
                  ? 'var(--green)'
                  : b.kind === 'upper-peer-reviewed-benchmark'
                  ? 'var(--terra-dk)'
                  : b.kind === 'upper-public-preprint'
                  ? 'var(--blue)'
                  : b.kind === 'upper-private-proof-candidate'
                  ? 'var(--brass)'
                  : b.kind === 'our-numerical'
                  ? 'var(--brass-dk)'
                  : 'var(--blue)',
              )}
            >
              <div style={cardLabel}>{b.kind.replace(/-/g, ' ')}</div>
              <div
                style={{
                  fontFamily: 'var(--ed-mono, var(--font-mono))',
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 8,
                  color:
                    b.kind === 'lower'
                      ? 'var(--green)'
                      : b.kind === 'upper-peer-reviewed-benchmark'
                      ? 'var(--terra-dk)'
                      : b.kind === 'upper-public-preprint'
                      ? 'var(--blue)'
                      : b.kind === 'upper-private-proof-candidate'
                      ? 'var(--brass)'
                      : b.kind === 'our-numerical'
                      ? 'var(--brass-dk)'
                      : 'var(--blue)',
                }}
              >
                {displayLabel(b)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={statusChip(b.status)}>{displayStatus(b.status)}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
                {b.source}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                {displayNote(b)}
              </div>
              {b.route && (
                <Link
                  to={b.route}
                  style={{
                    display: 'inline-block',
                    marginTop: 10,
                    color: b.kind === 'upper-private-proof-candidate' ? 'var(--brass)' : 'var(--brass-dk)',
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                    fontSize: 11,
                    textDecoration: 'none',
                  }}
                >
                  {b.kind === 'upper-private-proof-candidate'
                    ? 'Open candidate audit →'
                    : 'Open claim audit →'}
                </Link>
              )}
              {b.href && (
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: 10,
                    color: 'var(--brass-dk)',
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                    fontSize: 11,
                    textDecoration: 'none',
                  }}
                >
                  Open public certificate package ↗
                </a>
              )}
            </div>
          ))}
          {/* y-thaw package card (2026-09 currency pass; rendered here — the
              pinned data module lambda-roadmap.js is not edited). */}
          <div className="card" style={cardBaseLeft('var(--brass)')}>
            <div style={cardLabel}>upper package candidate</div>
            <div
              style={{
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
                color: 'var(--brass)',
              }}
            >
              y-thaw package: Λ ≤ 0.17759432
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={statusChip('unverified')}>candidate-unrefereed</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
              this program (y-thaw stages 1+2, 2026-09)
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
              4/8 obligations closed; O1 at Aristotle; a package value, not a bound.
              Status per obligation on the frontier DAG and the y-thaw research thread.
            </div>
            <Link
              to="/frontier-dag"
              style={{
                display: 'inline-block',
                marginTop: 10,
                color: 'var(--brass)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 11,
                textDecoration: 'none',
              }}
            >
              Open frontier DAG →
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: -12, marginBottom: 24, maxWidth: 760 }}>
          Route VII reachable-floor analysis: the program-derived compute floor is
          U ≈ 0.145–0.150; going below it requires arithmetic input. Detail:{' '}
          <Link to="/frontier-dag" style={{ color: 'var(--brass-dk)' }}>/frontier-dag</Link>.
        </p>

        {/* ── Strategy summary ─────────────────────────────────────────── */}
        <div
          className="card"
          style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 24 }}
        >
          <div style={cardLabel}>Current status / strategy</div>
          {LAMBDA_ROADMAP.currentStatusTLDR && (
            <div
              style={{
                fontSize: 13,
                color: 'var(--ink)',
                lineHeight: 1.5,
                marginBottom: 10,
                padding: '8px 12px',
                background: 'var(--paper)',
                borderRadius: 6,
                border: '1px solid var(--brass-dk)',
              }}
            >
              <strong style={{ color: 'var(--brass-dk)' }}>TL;DR:</strong>{' '}
              {displayTLDR(LAMBDA_ROADMAP.currentStatusTLDR)}
            </div>
          )}
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {displayCurrentStatus(LAMBDA_ROADMAP.currentStatus)}
          </div>

          {/* sigma(N)-decay landmark reference table (imp-96415): the currentStatus prose
              above cites these N-locations inline; this table collects them once, in
              N-order, sourced from the imp-33828 reference module (no re-derivation). */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 6 }}>
              sigma(N) decay landmarks ({IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE.quantity})
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
              <thead>
                <tr style={{ color: 'var(--faint)', textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
                  <th style={{ padding: '4px 8px', fontWeight: 600 }}>N</th>
                  <th style={{ padding: '4px 8px', fontWeight: 600 }}>Landmark</th>
                  <th style={{ padding: '4px 8px', fontWeight: 600 }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE.ladder.map((entry) => (
                  <tr key={entry.name} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <td style={{ padding: '4px 8px', fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>
                      {entry.N.toExponential(2)}
                    </td>
                    <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>{entry.label}</td>
                    <td style={{ padding: '4px 8px', color: 'var(--brass-dk)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                      {entry.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>
              Reference only (imp-33828); full plot at{' '}
              <Link to="/viz-imp33830-sigma-decay-landmark-ladder" style={{ color: 'var(--brass-dk)' }}>
                /viz-imp33830-sigma-decay-landmark-ladder
              </Link>
              . No new value derived; imp-3066 K_a ≥ 0 untouched; NO QED; Platt-Trudgian Lambda ≤ 0.2 remains SOTA.
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: '8px 12px',
              background: 'var(--paper)',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
              fontSize: 11,
              color: 'var(--faint)',
            }}
          >
            <strong style={{ color: 'var(--brass-dk)' }}>Target:</strong>{' '}
            {LAMBDA_ROADMAP.targetSOTA}
          </div>
        </div>

        {/* ── Proof progress snapshot ──────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 24 }}>
          <div style={cardLabel}>Proof progress snapshot</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              marginTop: 10,
            }}
          >
            {/* 5-step chain breakdown */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--ink-soft)',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                5-step chain
              </div>
              <div
                style={{
                  display: 'flex',
                  height: 10,
                  borderRadius: 5,
                  overflow: 'hidden',
                  gap: 2,
                  marginBottom: 10,
                }}
              >
                {LAMBDA_CHAIN_STEPS.map((s) => (
                  <div
                    key={s.step}
                    style={{ flex: 1, background: stepColor(s.verification), opacity: 0.85 }}
                    title={`Step ${s.step}: ${s.verification}`}
                  />
                ))}
              </div>
              {['rigorous', 'numerical', 'unverified'].map((v) => {
                const count = LAMBDA_CHAIN_STEPS.filter((s) => s.verification === v).length;
                return (
                  <div
                    key={v}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: stepColor(v),
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 10, color: 'var(--faint)', flex: 1 }}>{v}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--ed-mono, var(--font-mono))',
                        color: 'var(--ink-soft)',
                      }}
                    >
                      {count}/5
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Closure routes A/B/C */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--ink-soft)',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Closure routes A / B / C
              </div>
              <div
                style={{
                  display: 'flex',
                  height: 10,
                  borderRadius: 5,
                  overflow: 'hidden',
                  gap: 2,
                  marginBottom: 10,
                }}
              >
                {VERIFICATION_EFFORTS.filter((v) => v.id.startsWith('route-')).map((v) => (
                  <div
                    key={v.id}
                    style={{ flex: 1, background: stepColor(v.status), opacity: 0.85 }}
                    title={`${v.label}: ${v.status}`}
                  />
                ))}
              </div>
              {['rigorous', 'numerical', 'unverified'].map((v) => {
                const routes = VERIFICATION_EFFORTS.filter((ve) => ve.id.startsWith('route-'));
                const count = routes.filter((r) => r.status === v).length;
                return (
                  <div
                    key={v}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: stepColor(v),
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 10, color: 'var(--faint)', flex: 1 }}>{v}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--ed-mono, var(--font-mono))',
                        color: 'var(--ink-soft)',
                      }}
                    >
                      {count}/3
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              paddingTop: 8,
              borderTop: '1px solid var(--hairline)',
              fontSize: 10,
              color: 'var(--faint)',
              fontStyle: 'italic',
            }}
          >
            Any ONE closed route + G6_polymath15_bridge proves Λ ≤ 0, which with
            Rodgers-Tao (Λ ≥ 0) gives RH.
          </div>
        </div>

        {/* ── The 5-step chain ─────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>The 5-step chain to RH</h2>
        {/* Status note (imp-3077): make the per-step grading explicit so
            readers see that the chain is NOT a closed unconditional proof. */}
        <div
          className="card"
          style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 16 }}
        >
          <div style={cardLabel}>Status — the chain does not yet close</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            Per the grades below:{' '}
            {['rigorous', 'numerical', 'unverified'].map((v, i) => {
              const steps = LAMBDA_CHAIN_STEPS.filter((s) => s.verification === v);
              if (steps.length === 0) return null;
              return (
                <span key={v}>
                  {i > 0 ? '; ' : ''}
                  <strong style={{ color: stepColor(v) }}>{v}</strong>
                  {' — Step'}
                  {steps.length > 1 ? 's ' : ' '}
                  {steps.map((s) => s.step).join(', ')}
                </span>
              );
            })}
            . Step 5 (the final RH combination) is{' '}
            <strong style={{ color: stepColor('unverified') }}>UNVERIFIED</strong>, and
            Steps 2 and 4 are only numerical, so{' '}
            <strong>RH does NOT yet follow unconditionally</strong> from this chain.
            The grades are stated, not assumed away. Even if Step 5 closed, the
            assembled claim would still carry the C_mb GUE-universality caveat
            (imp-486): every known route to bounding the many-body correction
            term is equivalent to or weaker than assuming GUE universality for
            the Riemann zero process, so the best achievable endpoint here is
            RH-modulo-GUE-universality, not unconditional RH.
          </div>
        </div>
        <div style={{ display: 'grid', gap: 14, marginBottom: 24 }}>
          {LAMBDA_CHAIN_STEPS.map((s) => (
            <div key={s.step} className="card" style={cardBaseLeft(stepColor(s.verification))}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--paper)',
                      border: `2px solid ${stepColor(s.verification)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--ed-mono, var(--font-mono))',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {s.step}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                </div>
                <span style={statusChip(s.verification)}>{s.verification}</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}
              >
                <strong>What:</strong> {s.what}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--faint)',
                  marginBottom: 6,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--green)' }}>Have:</strong> {s.have}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--faint)',
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--brass-dk)' }}>Need:</strong> {s.need}
              </div>
              {s.notes && (
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--faint)',
                    marginBottom: 10,
                    fontStyle: 'italic',
                  }}
                >
                  {s.notes}
                </div>
              )}
              {s.rigorousUpgradeGap && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--faint)',
                    marginBottom: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)',
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <strong style={{ color: 'var(--brass-dk)' }}>
                      {s.rigorousUpgradeGap.grade} &rarr; {s.rigorousUpgradeGap.wouldRequire} upgrade gap:
                    </strong>{' '}
                    {s.rigorousUpgradeGap.status}
                  </div>
                  <ul style={{ margin: '0 0 6px 18px', padding: 0, lineHeight: 1.5 }}>
                    {s.rigorousUpgradeGap.obligations.map((o) => (
                      <li key={o.key}>
                        <span style={statusChip(o.closed ? 'closed' : 'open')}>
                          {o.closed ? 'CLOSED' : 'OPEN'}
                        </span>{' '}
                        <strong>{o.label}:</strong> {o.need}
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontStyle: 'italic' }}>{displayCaveat(s.rigorousUpgradeGap.caveat)}</div>
                </div>
              )}
              {s.conditionalBookkeeping && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--faint)',
                    marginBottom: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'color-mix(in srgb, var(--status-refuted) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--status-refuted) 25%, transparent)',
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <strong style={{ color: 'var(--red, #b52e2e)' }}>
                      Conditional bookkeeping (B1-B3):
                    </strong>{' '}
                    {s.conditionalBookkeeping.framing}
                  </div>
                  <ul style={{ margin: '0 0 6px 18px', padding: 0, lineHeight: 1.5 }}>
                    {s.conditionalBookkeeping.items.map((it) => (
                      <li key={it.key}>
                        <span style={statusChip(it.closed ? 'closed' : 'open')}>
                          {it.closed ? 'CLOSED' : 'BLOCKED'}
                        </span>{' '}
                        <strong>{it.label}:</strong> {it.need}
                        {it.blockedOn && (
                          <div style={{ fontStyle: 'italic', marginTop: 2 }}>
                            Blocked on: {it.blockedOn}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontStyle: 'italic' }}>{displayCaveat(s.conditionalBookkeeping.caveat)}</div>
                </div>
              )}
              <div>
                {s.tickets.map((t) => ticketLink(t))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Verification efforts ────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Verification efforts</h2>
        <div
          style={{
            fontSize: 11,
            color: 'var(--faint)',
            marginBottom: 12,
            padding: '8px 12px',
            background: 'var(--paper)',
            borderRadius: 6,
            border: '1px solid var(--hairline)',
          }}
        >
          Three parallel closure routes (A / B / C) plus three independent
          cross-validation methods. Any ONE closed route + G6_polymath15_bridge
          = unconditional Λ ≤ 0 = RH at the controlled height.
        </div>
        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
          {VERIFICATION_EFFORTS.map((v) => (
            <div key={v.id} className="card" style={cardBaseLeft(routeColor(v.id))}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 700 }}>{v.label}</div>
                <span style={statusChip(v.status)}>{v.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 8, lineHeight: 1.5 }}>
                <strong>Claim:</strong> {v.claim}
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 8, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--brass-dk)' }}>Progress:</strong> {v.progress}
              </div>
              <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 8 }}>
                <strong>Closes if:</strong> {v.closesIf}
              </div>
              {v.closesIfResolution && (
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--faint)',
                    marginBottom: 8,
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: resolutionBg(v.closesIfResolution.status),
                    border: `1px solid ${resolutionColor(v.closesIfResolution.status)}`,
                  }}
                >
                  <strong style={{ color: resolutionColor(v.closesIfResolution.status) }}>
                    Resolution ({v.closesIfResolution.status}
                    {v.closesIfResolution.resolvedBy ? `, ${v.closesIfResolution.resolvedBy}` : ''}):
                  </strong>{' '}
                  {v.closesIfResolution.reason}
                </div>
              )}
              <div>
                {v.tickets.map((t) => ticketLink(t))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Open gaps ──────────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>
          Open gaps
          <span style={{ fontSize: 11, color: 'var(--faint)', marginLeft: 12, fontWeight: 400 }}>
            {OPEN_GAPS.filter((g) => g.severity === 'closed').length} closed,{' '}
            {OPEN_GAPS.filter((g) => g.severity !== 'closed').length} open
          </span>
        </h2>
        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {OPEN_GAPS.map((g) => (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '10px 14px',
                  background: 'var(--paper)',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
                  borderLeft: `3px solid ${
                    g.severity === 'closed'
                      ? 'var(--green)'
                      : g.severity === 'critical'
                      ? 'var(--terra-dk)'
                      : 'var(--brass-dk)'
                  }`,
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--ed-mono, var(--font-mono))',
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {g.id} — {g.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 4 }}>
                    {g.status}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>
                    owner: {g.owner}
                    {g.blocks && ` • blocks ${g.blocks}`}
                  </div>
                  {g.nextTickets.length > 0 && (
                    <div>
                      {g.nextTickets.map((t) => ticketLink(t))}
                    </div>
                  )}
                </div>
                <div>
                  <span style={gapSeverityChip(g.severity)}>{g.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cross links ─────────────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link
              to="/meta-acceleration"
              style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}
            >
              → Meta Acceleration
            </Link>
            <Link
              to="/improvement-queue"
              style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}
            >
              → Live improvement queue
            </Link>
            <Link
              to="/improvements"
              style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}
            >
              → Per-commit improvements log
            </Link>
            <Link
              to="/research-journal"
              style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}
            >
              → Research Journal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function stepColor(verification) {
  if (verification === 'rigorous') return 'var(--green)';
  if (verification === 'cross-verified') return 'var(--blue)';
  if (verification === 'numerical') return 'var(--brass-dk)';
  return 'var(--terra-dk)';
}

function routeColor(id) {
  if (id.includes('route-A')) return 'var(--brass)';
  if (id.includes('route-B')) return 'var(--brass-dk)';
  if (id.includes('route-C')) return 'var(--blue)';
  return 'var(--faint)';
}

// A closesIfResolution records the harvested-closure verdict for a
// VERIFICATION_EFFORTS entry (imp-2614/2615/2616/2617). "not-met-conditional-negative"
// (e.g. Route A) must render distinctly from the "met-*-positive" verdicts so a
// conditional route never reads as rigorous/closed in the UI.
function resolutionColor(status) {
  if (status === 'not-met-conditional-negative') return 'var(--terra-dk)';
  if (status === 'met-partial-positive') return 'var(--brass-dk)';
  return 'var(--green)';
}

function resolutionBg(status) {
  if (status === 'not-met-conditional-negative') return alpha(ED.series2, 0.08);
  if (status === 'met-partial-positive') return alpha(ED.brassDeco, 0.08);
  return alpha(ED.series3, 0.08);
}
