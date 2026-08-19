import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import {
  LAMBDA_ROADMAP,
  LAMBDA_BOUNDS,
  LAMBDA_CHAIN_STEPS,
  VERIFICATION_EFFORTS,
  OPEN_GAPS,
} from '../data/lambda-roadmap.js';

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
  rigorous: chip('rgba(76,122,74,0.14)', 'var(--green)', 'rgba(76,122,74,0.40)'),
  'cross-verified': chip('rgba(63,107,134,0.14)', 'var(--blue)', 'rgba(63,107,134,0.40)'),
  numerical: chip('rgba(181,138,46,0.16)', 'var(--brass-dk)', 'rgba(181,138,46,0.45)'),
  unverified: chip('rgba(194,58,28,0.14)', 'var(--terra-dk)', 'rgba(194,58,28,0.40)'),
  closed: chip('rgba(76,122,74,0.14)', 'var(--green)', 'rgba(76,122,74,0.40)'),
  open: chip('rgba(194,58,28,0.14)', 'var(--terra-dk)', 'rgba(194,58,28,0.40)'),
  partial: chip('rgba(181,138,46,0.16)', 'var(--brass-dk)', 'rgba(181,138,46,0.45)'),
  'public-preprint-review-open': chip('rgba(63,107,134,0.16)', 'var(--blue)', 'rgba(63,107,134,0.45)'),
  'unreviewed-proof-candidate': chip('rgba(63,107,134,0.16)', 'var(--blue)', 'rgba(63,107,134,0.45)'),
  'conditional-g6a-open': chip('rgba(194,58,28,0.14)', 'var(--terra-dk)', 'rgba(194,58,28,0.40)'),
  'estimate-c-h-open': chip('rgba(181,138,46,0.16)', 'var(--brass-dk)', 'rgba(181,138,46,0.45)'),
  critical: chip('rgba(194,58,28,0.20)', 'var(--terra-dk)', 'rgba(194,58,28,0.55)'),
  high: chip('rgba(181,138,46,0.16)', 'var(--brass-dk)', 'rgba(181,138,46,0.45)'),
};

function statusChip(status) {
  return CHIPS[status] || CHIPS.unverified;
}

function gapSeverityChip(severity) {
  return CHIPS[severity] || CHIPS.open;
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
      <EditorialHeader ticker={<span>Λ bounds ledger · PT Λ ≤ 0.2 SOTA</span>} />
      <div className="ed-full" style={{ padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Λ Bounds &amp; RH Roadmap</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            The de Bruijn-Newman constant Λ is the load-bearing bridge between
            a numerical Λ upper bound and the Riemann Hypothesis itself.
            RH ⟺ Λ = 0 (de Bruijn 1950 + Rodgers-Tao 2020). This page is the
            plan, the status, and the verification efforts of our attack.
          </p>
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
              border: '1px solid rgba(194,58,28,0.45)',
              borderRadius: 6,
              background: 'rgba(194,58,28,0.08)',
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
                {b.label}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={statusChip(b.status)}>{b.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
                {b.source}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                {b.note}
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
        </div>

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
              {LAMBDA_ROADMAP.currentStatusTLDR}
            </div>
          )}
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {LAMBDA_ROADMAP.currentStatus}
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
                    background: 'rgba(181,138,46,0.08)',
                    border: '1px solid rgba(181,138,46,0.30)',
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
                  <div style={{ fontStyle: 'italic' }}>{s.rigorousUpgradeGap.caveat}</div>
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
