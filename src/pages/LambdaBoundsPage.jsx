import React from 'react';
import { Link } from 'react-router-dom';
import {
  LAMBDA_ROADMAP,
  LAMBDA_BOUNDS,
  LAMBDA_CHAIN_STEPS,
  VERIFICATION_EFFORTS,
  OPEN_GAPS,
} from '../data/lambda-roadmap.js';
import { PAPER_PUBLICATION_META as PAPER_PUBLICATION } from '../data/paper-publication-meta.js';

// Lambda Bounds & RH Roadmap — the plan, the status, the verification.
// Read interface for src/data/lambda-roadmap.js.

// ── Style helpers ──────────────────────────────────────────────────────────

const chip = (bg, fg, border) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: 10,
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  background: bg,
  color: fg,
  border: `1px solid ${border}`,
});

const CHIPS = {
  rigorous: chip('rgba(34,197,94,0.12)', '#86efac', 'rgba(34,197,94,0.35)'),
  'cross-verified': chip('rgba(6,182,212,0.12)', '#67e8f9', 'rgba(6,182,212,0.35)'),
  numerical: chip('rgba(234,179,8,0.12)', '#facc15', 'rgba(234,179,8,0.35)'),
  unverified: chip('rgba(239,68,68,0.12)', '#fca5a5', 'rgba(239,68,68,0.35)'),
  closed: chip('rgba(34,197,94,0.12)', '#86efac', 'rgba(34,197,94,0.35)'),
  open: chip('rgba(239,68,68,0.12)', '#fca5a5', 'rgba(239,68,68,0.35)'),
  partial: chip('rgba(234,179,8,0.12)', '#facc15', 'rgba(234,179,8,0.35)'),
  critical: chip('rgba(239,68,68,0.18)', '#fca5a5', 'rgba(239,68,68,0.5)'),
  high: chip('rgba(234,179,8,0.12)', '#facc15', 'rgba(234,179,8,0.35)'),
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
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 4,
        background: 'var(--bg-primary)',
        color: '#a855f7',
        border: '1px solid var(--border)',
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
  color: 'var(--text-muted)',
  marginBottom: 6,
};

function cardBaseLeft(color) {
  return { borderLeftWidth: 3, borderLeftColor: color };
}

// ── The page ───────────────────────────────────────────────────────────────

export default function LambdaBoundsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Λ Bounds & RH Roadmap</h1>
        <p className="page-subtitle">
          The de Bruijn-Newman constant Λ is the load-bearing bridge between
          a numerical Λ upper bound and the Riemann Hypothesis itself.
          RH ⟺ Λ = 0 (de Bruijn 1950 + Rodgers-Tao 2020). This page is the
          plan, the status, and the verification efforts of our attack.
        </p>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link
            to="/lambda-timeline"
            style={{
              color: '#a855f7',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              textDecoration: 'none',
              padding: '4px 10px',
              border: '1px solid #a855f7',
              borderRadius: 6,
            }}
          >
            Λ Timeline →
          </Link>
          <a
            href={PAPER_PUBLICATION.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            download="gomila-finite-height-beat-2026-05.pdf"
            title={PAPER_PUBLICATION.title}
            style={{
              color: '#facc15',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              textDecoration: 'none',
              padding: '4px 10px',
              border: '1px solid #facc15',
              borderRadius: 6,
              background: 'rgba(234,179,8,0.08)',
            }}
          >
            ↓ Download paper PDF (draft, {PAPER_PUBLICATION.pageCount} pp,
            {' '}{Math.round(PAPER_PUBLICATION.fileSizeBytes / 1024)} KB)
          </a>
        </div>
      </div>

      {/* ── Top banner: current bounds ─────────────────────────────────── */}
      <h2 style={{ marginTop: 8, marginBottom: 12 }}>Current bounds on Λ</h2>
      <div className="card-grid" style={{ marginBottom: 24 }}>
        {LAMBDA_BOUNDS.map((b) => (
          <div
            key={b.id}
            className="card"
            style={cardBaseLeft(
              b.kind === 'lower'
                ? '#22c55e'
                : b.kind === 'upper-sota'
                ? '#ef4444'
                : b.kind === 'our-numerical'
                ? '#facc15'
                : '#06b6d4',
            )}
          >
            <div style={cardLabel}>{b.kind.replace(/-/g, ' ')}</div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
                color:
                  b.kind === 'lower'
                    ? '#86efac'
                    : b.kind === 'upper-sota'
                    ? '#fca5a5'
                    : b.kind === 'our-numerical'
                    ? '#facc15'
                    : '#67e8f9',
              }}
            >
              {b.label}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={statusChip(b.status)}>{b.status}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
              {b.source}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {b.note}
            </div>
          </div>
        ))}
      </div>

      {/* ── Strategy summary ─────────────────────────────────────────── */}
      <div
        className="card"
        style={{ ...cardBaseLeft('#facc15'), marginBottom: 24 }}
      >
        <div style={cardLabel}>Current status / strategy</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {LAMBDA_ROADMAP.currentStatus}
        </div>
        <div
          style={{
            marginTop: 10,
            padding: '8px 12px',
            background: 'var(--bg-primary)',
            borderRadius: 6,
            border: '1px solid var(--border)',
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <strong style={{ color: '#facc15' }}>Target:</strong>{' '}
          {LAMBDA_ROADMAP.targetSOTA}
        </div>
      </div>

      {/* ── Proof progress snapshot ──────────────────────────────────── */}
      <div className="card" style={{ ...cardBaseLeft('#a855f7'), marginBottom: 24 }}>
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
                color: 'var(--text-secondary)',
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
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', flex: 1 }}>{v}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
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
                color: 'var(--text-secondary)',
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
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', flex: 1 }}>{v}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
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
            borderTop: '1px solid var(--border)',
            fontSize: 10,
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          Any ONE closed route + G6_polymath15_bridge proves Λ ≤ 0, which with
          Rodgers-Tao (Λ ≥ 0) gives RH.
        </div>
      </div>

      {/* ── The 5-step chain ─────────────────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>The 5-step chain to RH</h2>
      {/* Honest-status note (imp-3077): make the per-step grading explicit so
          readers see that the chain is NOT a closed unconditional proof. */}
      <div
        className="card"
        style={{ ...cardBaseLeft('#ef4444'), marginBottom: 16 }}
      >
        <div style={cardLabel}>Honest status — the chain does not yet close</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
          The grades are stated, not assumed away.
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
                    background: 'var(--bg-primary)',
                    border: `2px solid ${stepColor(s.verification)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
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
                color: 'var(--text-secondary)',
                marginBottom: 10,
                lineHeight: 1.5,
              }}
            >
              <strong>What:</strong> {s.what}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginBottom: 6,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#22c55e' }}>Have:</strong> {s.have}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginBottom: 10,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#facc15' }}>Need:</strong> {s.need}
            </div>
            {s.notes && (
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  marginBottom: 10,
                  fontStyle: 'italic',
                }}
              >
                {s.notes}
              </div>
            )}
            <div>
              {s.tickets.map((t) => ticketLink(t))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Verification efforts ────────────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>Verification efforts</h2>
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          marginBottom: 12,
          padding: '8px 12px',
          background: 'var(--bg-primary)',
          borderRadius: 6,
          border: '1px solid var(--border)',
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
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
              <strong>Claim:</strong> {v.claim}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
              <strong style={{ color: '#facc15' }}>Progress:</strong> {v.progress}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
              <strong>Closes if:</strong> {v.closesIf}
            </div>
            <div>
              {v.tickets.map((t) => ticketLink(t))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Open gaps ──────────────────────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>
        Open gaps
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 12, fontWeight: 400 }}>
          {OPEN_GAPS.filter((g) => g.severity === 'closed').length} closed,{' '}
          {OPEN_GAPS.filter((g) => g.severity !== 'closed').length} open
        </span>
      </h2>
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          {OPEN_GAPS.map((g) => (
            <div
              key={g.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                borderRadius: 6,
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${
                  g.severity === 'closed'
                    ? '#22c55e'
                    : g.severity === 'critical'
                    ? '#ef4444'
                    : '#facc15'
                }`,
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {g.id} — {g.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {g.status}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
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
      <div className="card" style={cardBaseLeft('#a855f7')}>
        <div style={cardLabel}>Related pages</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <Link
            to="/meta-acceleration"
            style={{ fontSize: 12, color: '#facc15', textDecoration: 'none' }}
          >
            → Meta Acceleration
          </Link>
          <Link
            to="/improvement-queue"
            style={{ fontSize: 12, color: '#a855f7', textDecoration: 'none' }}
          >
            → Live improvement queue
          </Link>
          <Link
            to="/improvements"
            style={{ fontSize: 12, color: '#06b6d4', textDecoration: 'none' }}
          >
            → Per-commit improvements log
          </Link>
          <Link
            to="/research-journal"
            style={{ fontSize: 12, color: '#22c55e', textDecoration: 'none' }}
          >
            → Research Journal
          </Link>
        </div>
      </div>
    </div>
  );
}

function stepColor(verification) {
  if (verification === 'rigorous') return '#22c55e';
  if (verification === 'cross-verified') return '#06b6d4';
  if (verification === 'numerical') return '#facc15';
  return '#ef4444';
}

function routeColor(id) {
  if (id.includes('route-A')) return '#a855f7';
  if (id.includes('route-B')) return '#facc15';
  if (id.includes('route-C')) return '#06b6d4';
  return '#94a3b8';
}
