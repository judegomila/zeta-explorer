import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SESSIONS } from '../data/sessions.js';
import FreshnessBanner from '../components/FreshnessBanner.jsx';
import { LAMBDA_INTERCEPT_UNCONDITIONAL } from '../data/lambda-intercept-unconditional.js';
import { RANKED_OPPORTUNITIES } from '../data/full-route-map-2026-06-19.js';
// imp-1013: improvement-queue.js (~1.8 MB) and improvements.js (~3.3 MB) are
// dynamic-imported below so opening this page does not block on a 5 MB chunk
// download. Both files are also dynamic-imported by their primary pages
// (ImprovementQueuePage, ImprovementsPage), so no static import remains.

// Meta Acceleration — engine status dashboard + Λ attack progress snapshot.
// This page is the read interface over:
//   - src/data/improvement-queue.js  (live task list)
//   - src/data/improvements.js       (per-commit log)
//   - src/data/sessions.js           (coarse session narratives)
//   - src/data/lambda-intercept-unconditional.js (capstone assembly)
//
// Data is snapshotted at build time. The engine's actual running state
// (PID, live run count, rate-limit sentinel) is not accessible to a static
// Vite build; operators should check ./scripts/auto-improve.sh status from
// the shell for that.

// ── Aggregate the queue ────────────────────────────────────────────────────

function summarizeQueue(queue) {
  const byStatus = { pending: 0, completed: 0, superseded: 0, done: 0 };
  const byPriorityPending = { critical: 0, high: 0, medium: 0, low: 0 };
  const critPendingIds = [];
  for (const item of queue) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    if (item.status === 'pending') {
      const p = item.priority || 'medium';
      byPriorityPending[p] = (byPriorityPending[p] || 0) + 1;
      if (p === 'critical') critPendingIds.push(item.id);
    }
  }
  return { byStatus, byPriorityPending, critPendingIds, total: queue.length };
}

function recentProofImprovements(improvements, limit = 10) {
  return [...improvements]
    .reverse()
    .filter((i) =>
      typeof i.summary === 'string' && /imp-3[0-9]{2}|proof/.test(i.summary),
    )
    .slice(0, limit);
}

function metaTickets(queue) {
  // Return all meta-category tickets, reverse-chronological (newest id first),
  // completed → pending → superseded for each bucket.
  const metas = queue.filter((it) => it.category === 'meta');
  const parseId = (id) => {
    const m = /imp-(\d+)/.exec(id || '');
    return m ? parseInt(m[1], 10) : 0;
  };
  metas.sort((a, b) => parseId(b.id) - parseId(a.id));
  return metas;
}

// ── Static config: phase narrative of the Λ attack ─────────────────────────

const PHASES = [
  {
    id: 'phase-5',
    title: 'Phase 5 — Tighten Λ error bar + Λ→RH bridge',
    ids: ['imp-314', 'imp-315', 'imp-316', 'imp-317'],
    result:
      'Shipped: Λ error-budget audit, Dyson ladder to N=5000, Λ→RH bridge theorem, Guth-Maynard tail certification.',
  },
  {
    id: 'phase-6',
    title: 'Phase 6 — B2 enumeration + main-line identification',
    ids: ['imp-318', 'imp-319', 'imp-320', 'imp-321', 'imp-322'],
    result:
      'Shipped: verified-computing Dyson, B1-B4 blocker enumeration, Λ cross-validation, push to PT-scale, B(t) backward monotonicity.',
  },
  {
    id: 'phase-7',
    title: 'Phase 7 — Attack B1-B4',
    ids: ['imp-323', 'imp-324', 'imp-325', 'imp-326', 'imp-327'],
    result:
      'B2(a) statistical angle exhausted (â ≈ 0.0029 but 95% UCL > 0). imp-327 height-mapping theorem + N ↔ T* table shipped.',
  },
  {
    id: 'phase-8',
    title: 'Phase 8 — Five parallel B2 closure angles',
    ids: ['imp-328', 'imp-329', 'imp-330', 'imp-331', 'imp-332'],
    result:
      'imp-328 delivered interim conditional a ≤ 0.0086 under monotonicity (M). imp-329/330/331/332 closed the B2(a) statistical angle from four directions; none individually tipped UCL below 0.',
  },
  {
    id: 'phase-9',
    title: 'Phase 9 — Beyond B2(a)',
    ids: ['imp-333', 'imp-334', 'imp-335'],
    result:
      'Pooled Bayesian posterior + 1/N² curvature test + Research Journal infrastructure.',
  },
  {
    id: 'phase-10',
    title: 'Phase 10 — Close imp-328 openWork',
    ids: ['imp-336', 'imp-337', 'imp-338', 'imp-339', 'imp-340'],
    result:
      'imp-336 empirically unfalsified monotonicity. imp-337 density-squeeze landing (G3/G4 open). imp-338 Dyson-Burgers continuum τ_shock = 0 (G5 open). imp-339 Montgomery-Dyson heuristic fails decay test — negative result. imp-340 ladder application.',
  },
  {
    id: 'phase-11',
    title: 'Phase 11 — Close gaps G3-G5, assemble capstone',
    ids: ['imp-341', 'imp-342', 'imp-343', 'imp-344'],
    result:
      'imp-341 closed G5_burgers via Koksma-Hlawka uniformity — a := lim sup_N |t_c(N)| = 0 UNCONDITIONALLY along N-particle Dyson flow. imp-343 closed G4_argmin_drift. imp-342 G3_density still open. imp-344 CAPSTONE shipped: three-route assembly, NEW gap G6_polymath15_bridge surfaced, coordinated G5 tripwire flip.',
  },
];

// ── Open gaps summary ──────────────────────────────────────────────────────

const OPEN_GAPS = [
  {
    id: 'G1',
    label: 'argmin interiority',
    status: 'open — empirical witness only',
    ticket: 'imp-336',
    blocks: 'Route (A) monotonicity conjecture (M)',
  },
  {
    id: 'G2',
    label: 'argmin jumps across N',
    status: 'open — no attempt',
    ticket: 'imp-336',
    blocks: 'Route (A) monotonicity conjecture (M)',
  },
  {
    id: 'G3',
    label: 'density c(N) Weyl-law derivation',
    status: 'open — ansatz, κ unfixed',
    ticket: 'imp-342',
    blocks: 'Route (C) density squeeze',
  },
  {
    id: 'G4',
    label: 'argmin drift k*(t) stability',
    status: 'CLOSED (imp-343)',
    ticket: 'imp-343',
    blocks: 'Route (C) density squeeze',
    closed: true,
  },
  {
    id: 'G5',
    label: 'Burgers uniformity of m_N → m_∞',
    status: 'CLOSED (imp-341 + imp-344)',
    ticket: 'imp-341',
    blocks: 'Route (B) Burgers shock',
    closed: true,
  },
  {
    id: 'G6',
    label: 'Polymath15 bridge t_c(N) ↔ Λ',
    status: 'OPEN — surfaced by imp-344',
    ticket: 'imp-344',
    blocks: 'All routes → final RH statement',
    newlySurfaced: true,
  },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const statusChip = (bg, fg, border) => ({
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

const openChip = statusChip('rgba(239,68,68,0.12)', '#fca5a5', 'rgba(239,68,68,0.35)');
const closedChip = statusChip('rgba(34,197,94,0.12)', '#86efac', 'rgba(34,197,94,0.35)');
const newChip = statusChip('rgba(234,179,8,0.12)', '#facc15', 'rgba(234,179,8,0.35)');

// ── The page ───────────────────────────────────────────────────────────────

export default function MetaAccelerationPage() {
  const [improvementQueue, setImprovementQueue] = useState(null);
  const [improvementsList, setImprovementsList] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import('../data/improvement-queue.js'),
      import('../data/improvements.js'),
    ]).then(([qMod, iMod]) => {
      if (cancelled) return;
      setImprovementQueue(qMod.IMPROVEMENT_QUEUE);
      setImprovementsList(iMod.improvements);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dataReady = improvementQueue !== null && improvementsList !== null;
  const qSummary = dataReady
    ? summarizeQueue(improvementQueue)
    : { byStatus: {}, byPriorityPending: {}, critPendingIds: [], total: 0 };
  const recentProof = dataReady ? recentProofImprovements(improvementsList, 8) : [];
  const metas = dataReady ? metaTickets(improvementQueue) : [];
  const improvementsCount = dataReady ? improvementsList.length : 0;
  const latestSession = SESSIONS[SESSIONS.length - 1];
  const routes = LAMBDA_INTERCEPT_UNCONDITIONAL.routes;
  const strongestClaim = LAMBDA_INTERCEPT_UNCONDITIONAL.currentStrongestUnconditional;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Meta Acceleration</h1>
        <p className="page-subtitle">
          Status dashboard for the auto-improvement engine, the Λ attack
          progress, and open gaps between the current unconditional claim and
          a finite-height Riemann Hypothesis statement.
        </p>
      </div>

      <FreshnessBanner date={latestSession.date} note="latest research session; queue loaded dynamically" />

      {/* ── Headline Λ claim ──────────────────────────────────────────── */}
      <div
        className="card"
        style={{ ...cardBaseLeft('#facc15'), marginBottom: 24 }}
      >
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
          Current strongest unconditional claim (imp-344 capstone)
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 18,
            fontWeight: 700,
            color: '#facc15',
            marginBottom: 8,
          }}
        >
          {strongestClaim.statement}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
          via <em>{strongestClaim.via}</em> — {strongestClaim.scope}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'var(--bg-primary)',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
          }}
        >
          <strong style={{ color: '#fca5a5' }}>Not a statement about:</strong>{' '}
          {strongestClaim.notAStatementAbout}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'var(--bg-primary)',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            marginTop: 8,
          }}
        >
          <strong style={{ color: '#fca5a5' }}>Finite-height RH corollary:</strong>{' '}
          {strongestClaim.finiteHeightCorollaryRH}
        </div>
      </div>

      {/* ── Queue + engine snapshot ─────────────────────────────────── */}
      <div className="card-grid" style={{ marginBottom: 24 }}>
        <div className="card" style={cardBaseLeft('#a855f7')}>
          <div style={cardLabel}>Queue</div>
          <div style={cardBig}>{qSummary.total}</div>
          <div style={cardSub}>total tickets</div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
            <div>✓ completed: <strong>{qSummary.byStatus.completed || 0}</strong></div>
            <div>… pending: <strong>{qSummary.byStatus.pending || 0}</strong></div>
            {qSummary.byStatus.superseded > 0 && (
              <div>⊘ superseded: <strong>{qSummary.byStatus.superseded}</strong></div>
            )}
          </div>
        </div>

        <div className="card" style={cardBaseLeft('#ef4444')}>
          <div style={cardLabel}>Pending critical</div>
          <div style={cardBig}>{qSummary.byPriorityPending.critical || 0}</div>
          <div style={cardSub}>next-frontier RH tickets</div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {qSummary.critPendingIds.length > 0
              ? qSummary.critPendingIds.join(', ')
              : '(queue drained — seed more)'}
          </div>
        </div>

        <div className="card" style={cardBaseLeft('#06b6d4')}>
          <div style={cardLabel}>Improvements shipped</div>
          <div style={cardBig}>{dataReady ? improvementsCount : '…'}</div>
          <div style={cardSub}>commits via auto-improve engine</div>
          <Link
            to="/improvements"
            style={{
              display: 'inline-block',
              marginTop: 8,
              fontSize: 11,
              color: '#06b6d4',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
            }}
          >
            → /improvements
          </Link>
        </div>

        <div className="card" style={cardBaseLeft('#22c55e')}>
          <div style={cardLabel}>Sessions journaled</div>
          <div style={cardBig}>{SESSIONS.length}</div>
          <div style={cardSub}>coarse session narratives</div>
          <Link
            to="/research-journal"
            style={{
              display: 'inline-block',
              marginTop: 8,
              fontSize: 11,
              color: '#22c55e',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
            }}
          >
            → /research-journal
          </Link>
        </div>
      </div>

      {/* ── Engine runtime note ─────────────────────────────────────── */}
      <div
        className="card"
        style={{ ...cardBaseLeft('#94a3b8'), marginBottom: 24 }}
      >
        <div style={cardLabel}>Engine runtime state</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
          The engine's live PID, run counter, and rate-limit sentinel are
          filesystem state, not visible to a static Vite build. Check from the
          shell:
        </div>
        <pre
          style={{
            fontSize: 11,
            background: 'var(--bg-primary)',
            padding: 10,
            borderRadius: 6,
            border: '1px solid var(--border)',
            marginTop: 10,
            color: 'var(--accent-cyan)',
          }}
        >
{`./scripts/auto-improve.sh status         # running? run count?
cat  scripts/.rate-limit-backoff-state   # rate-limit sentinel (if present)
ls -t scripts/logs/run_*.log | head -3   # 3 most recent run logs
git log --oneline -10                    # engine commits`}
        </pre>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          The engine writes a sentinel <code>.rate-limit-backoff-state</code>{' '}
          file when it detects a 429 / ConnectionRefused / quota-exceeded
          error. The file names the current backoff interval (exponential,
          capped at 30 min), the triggering log, and the run number. A
          subsequent clean run deletes the sentinel. In-flight tickets remain{' '}
          <code>status: 'pending'</code> in <code>improvement-queue.js</code>{' '}
          because the engine's prompt only flips pending → completed after a
          successful commit — so mid-run failures are automatically re-queued.
        </div>
      </div>

      {/* ── Three routes toward a finite-height RH statement ─────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>Three routes to a finite-height RH statement</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        {Object.entries(routes).map(([key, route]) => (
          <div key={key} className="card" style={cardBaseLeft(routeColor(key))}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              Route ({key})
            </div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{route.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>
              {route.claim}
            </div>
            <div style={{ fontSize: 11, marginBottom: 6 }}>
              <span style={routeStatusChip(route.routeStatus)}>{route.routeStatus}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              <strong>Closes:</strong> {route.closes}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              <strong>Buys us:</strong> {route.buysUs}
            </div>
          </div>
        ))}
      </div>

      {/* ── Open gaps ─────────────────────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>Open gaps</h2>
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          {OPEN_GAPS.map((g) => (
            <div
              key={g.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'var(--bg-primary)',
                borderRadius: 6,
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
                  {g.id}: {g.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  blocks {g.blocks} • ticket {g.ticket}
                </div>
              </div>
              <div>
                <span
                  style={
                    g.closed ? closedChip : g.newlySurfaced ? newChip : openChip
                  }
                >
                  {g.closed ? 'closed' : g.newlySurfaced ? 'new — open' : 'open'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Genuine remaining opportunities ──────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>Genuine remaining opportunities</h2>
      <div className="card" style={{ marginBottom: 24, borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
        <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 10 }}>
          Ranked by actionability. None of these routes bypasses RH — the honest ceiling is Platt-Trudgian
          Lambda &le; 0.2. All entries below are NON-refuted and NOT RH-reformulations.
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {RANKED_OPPORTUNITIES.map((opp) => (
            <div
              key={opp.rank}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                borderRadius: 6,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 4,
                    background: 'rgba(245,158,11,0.12)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  #{opp.rank}
                </span>
                <span style={{ fontWeight: 600, fontSize: 12 }}>{opp.target}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {opp.why}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Phases timeline ───────────────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>Phase timeline</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        {PHASES.map((phase) => (
          <div key={phase.id} className="card" style={cardBaseLeft('#a855f7')}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{phase.title}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {phase.ids.map((id) => (
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
                  }}
                >
                  {id}
                </Link>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{phase.result}</div>
          </div>
        ))}
      </div>

      {/* ── Meta improvements ─────────────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>
        Meta improvements
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 12, fontWeight: 400 }}>
          {metas.filter((m) => m.status === 'completed').length} shipped,{' '}
          {metas.filter((m) => m.status === 'pending').length} pending
        </span>
      </h2>
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            marginBottom: 10,
            padding: '8px 12px',
            background: 'var(--bg-primary)',
            borderRadius: 6,
            border: '1px solid var(--border)',
          }}
        >
          Meta improvements are engine- or workflow-level changes that make the
          proof work sustainable — not proof steps themselves. The engine ships
          proof work; meta work ships the ability of the engine to ship proof
          work. Ordered newest id first.
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {metas.map((m) => (
            <div
              key={m.id}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                borderRadius: 6,
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${metaStatusColor(m.status)}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
                  {m.id}
                </div>
                <span style={metaStatusChip(m.status)}>{m.status}</span>
              </div>
              <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-primary)' }}>
                {m.title.replace(/^META:\s*/, '')}
              </div>
              {m.completedAt && (
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    marginTop: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  completed {m.completedAt}
                </div>
              )}
              {m.description && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {m.description.length > 260
                    ? m.description.slice(0, 260) + '…'
                    : m.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Harness & Meta-Harness Pipeline ───────────────────────── */}
      <h2 style={{ marginTop: 32, marginBottom: 12 }}>Accelerating with Claude — Harness Pipeline</h2>
      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
          The auto-improvement engine is a self-improving pipeline. Each layer improves the layer below it.
          The meta-harness improves the harness, which improves the proof work.
        </p>

        {/* Pipeline visualization */}
        <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          {[
            {
              layer: 'L0 — Proof Engine',
              color: '#3b82f6',
              desc: 'Opus-tier auto-improve.sh runs claude --print on each ticket. Makes one atomic change per run, commits, pushes.',
              features: [
                { name: 'Priority queue', status: 'active', detail: 'critical > high > medium > low' },
                { name: 'Category routing', status: 'active', detail: 'Opus: proof/feature/content/meta; Haiku: bug/ux/visual' },
                { name: 'Token budget discipline', status: 'active', detail: 'queue-index.json cache (4KB) avoids 280KB improvements.js reads' },
                { name: 'Build verification', status: 'active', detail: 'npm run build after every change; rollback on failure' },
                { name: 'Git commit + auto-push', status: 'active', detail: 'Every 5 runs pushes to origin/main (imp-442)' },
              ],
            },
            {
              layer: 'L1 — Self-Monitoring',
              color: '#a855f7',
              desc: 'The engine monitors its own health and detects failures without human intervention.',
              features: [
                { name: 'Heartbeat stall detection', status: 'active', detail: 'Kills wedged claude --print after 120s (imp-420)' },
                { name: 'Status-flip verification', status: 'active', detail: 'Post-commit check that queue status was actually flipped (imp-419)' },
                { name: 'Rate-limit backoff', status: 'active', detail: 'Sentinel file + exponential backoff on 429 errors' },
                { name: 'Dev server health check', status: 'active', detail: 'HTTP 200 check on localhost:3002 each run (imp-313)' },
                { name: 'Idle detection', status: 'active', detail: 'Auto-stop after 10 consecutive empty-queue runs (imp-518)' },
              ],
            },
            {
              layer: 'L2 — Self-Seeding',
              color: '#f59e0b',
              desc: 'When the queue drains, the engine scans the codebase for new work and seeds tickets automatically.',
              features: [
                { name: 'Gap scanner', status: 'active', detail: 'Scans for TODO, sorry, partial statuses, open sub-gaps' },
                { name: 'Repetition detection', status: 'active', detail: 'History-based dedup prevents re-seeding closed investigations' },
                { name: 'False-positive suppression', status: 'active', detail: 'Exclusion filters for known-blocked files (imp-662..665)' },
                { name: 'Assertion cooldown', status: 'active', detail: '24h cooldown on assertion re-verification tickets' },
                { name: 'Queue-index staleness check', status: 'active', detail: 'Rebuilds cache when improvement-queue.js is newer (imp-519)' },
              ],
            },
            {
              layer: 'L3 — Self-Improvement',
              color: '#10b981',
              desc: 'The engine improves its own infrastructure — scanner filters, parser bugs, prompt engineering.',
              features: [
                { name: 'Scanner self-patching', status: 'active', detail: 'Engine adds exclusion filters to autofill scanner (imp-663..669)' },
                { name: 'Parser bug fixes', status: 'shipped', detail: 'Fixed balanced-brace parser for string literals (66 hidden tickets recovered)' },
                { name: 'Prompt refinement', status: 'active', detail: 'Token budget discipline, syntax gotchas, category routing rules' },
                { name: 'Ticket-id collision prevention', status: 'shipped', detail: 'Claim protocol for concurrent agents (imp-446)' },
                { name: 'Adversarial review loop', status: 'shipped', detail: '7 reviews, FATAL trajectory 2->0->0->0->0->0->TBD' },
              ],
            },
            {
              layer: 'L4 — Rigor Audit',
              color: '#ef4444',
              desc: 'External audit loop catches overclaiming and forces honest reframing of results.',
              features: [
                { name: 'Honesty pass', status: 'shipped', detail: 'Replaced false UNCONDITIONAL labels with GUE-CONDITIONAL (imp-583)' },
                { name: 'NoSwap gap acknowledged', status: 'shipped', detail: 'Honest partial closure — initial superiority fails (imp-584)' },
                { name: 'Route B separation', status: 'shipped', detail: 'Standalone unconditional paper for genuinely proved result (imp-585)' },
                { name: 'Paper reframing', status: 'shipped', detail: 'Conditional computational verification framing (imp-590)' },
                { name: 'Selberg rescue path', status: 'shipped', detail: 'Unconditional C_mb = O(log T) closes at finite N_0* (imp-586)' },
              ],
            },
          ].map((layer) => (
            <div
              key={layer.layer}
              style={{
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                borderRadius: 8,
                borderLeft: `3px solid ${layer.color}`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: layer.color, marginBottom: 4 }}>
                {layer.layer}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {layer.desc}
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                {layer.features.map((f) => (
                  <div
                    key={f.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: f.status === 'active' ? '#22c55e' : f.status === 'shipped' ? '#3b82f6' : '#f59e0b',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, minWidth: 160 }}>
                      {f.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{f.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline ideas — things that could be built */}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
          <strong>Future pipeline stages:</strong> L5 (cross-project learning — transfer proof strategies to other conjectures),
          L6 (collaborative multi-agent with role specialization — prover, reviewer, documenter),
          L7 (formal verification integration — auto-generated Lean proofs from JS closures),
          L8 (publication automation — auto-compile LaTeX, submit to arXiv, respond to referee reports).
        </div>
      </div>

      {/* ── Recent proof improvements ─────────────────────────────── */}
      <h2 style={{ marginTop: 24, marginBottom: 12 }}>Recent proof improvements</h2>
      <div className="card" style={{ marginBottom: 24 }}>
        {recentProof.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            No recent proof-category improvements found.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {recentProof.map((imp) => (
              <div
                key={imp.id}
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-primary)',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  #{imp.id} • {imp.timestamp}
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>{imp.summary.slice(0, 200)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Latest session teaser ─────────────────────────────────── */}
      {latestSession && (
        <>
          <h2 style={{ marginTop: 24, marginBottom: 12 }}>Latest research session</h2>
          <div className="card" style={{ ...cardBaseLeft('#22c55e'), marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {latestSession.date} — {latestSession.title}
            </div>
            {latestSession.lambdaHeadline && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  marginTop: 8,
                  padding: '6px 10px',
                  background: 'var(--bg-primary)',
                  borderRadius: 4,
                }}
              >
                Λ headline at session end:{' '}
                <strong style={{ color: '#facc15' }}>
                  {latestSession.lambdaHeadline.end}
                </strong>
              </div>
            )}
            {latestSession.mainLineBlocker && (
              // Bug fix: sessions.js stores mainLineBlocker as an object
              // { label, description, ticket }, not a plain string. Rendering
              // the raw object crashed React with "Objects are not valid as
              // a React child", which took out the whole MetaAcceleration
              // tab. Normalize to a string (with a string fallback) before
              // interpolating into JSX.
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                <strong>Main-line blocker at session end:</strong>{' '}
                {typeof latestSession.mainLineBlocker === 'string'
                  ? latestSession.mainLineBlocker
                  : `${latestSession.mainLineBlocker.label || ''}${
                      latestSession.mainLineBlocker.ticket
                        ? ` (${latestSession.mainLineBlocker.ticket})`
                        : ''
                    }${
                      latestSession.mainLineBlocker.description
                        ? ` — ${latestSession.mainLineBlocker.description}`
                        : ''
                    }`}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <Link
                to="/research-journal"
                style={{
                  fontSize: 11,
                  color: '#22c55e',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                }}
              >
                → full session narrative on /research-journal
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Local style helpers ────────────────────────────────────────────────────

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--text-muted)',
  marginBottom: 6,
};

const cardBig = {
  fontSize: 32,
  fontWeight: 700,
  fontFamily: 'var(--font-mono)',
  lineHeight: 1,
};

const cardSub = {
  fontSize: 11,
  color: 'var(--text-muted)',
  marginTop: 4,
};

function cardBaseLeft(color) {
  return { borderLeftWidth: 3, borderLeftColor: color };
}

function routeColor(key) {
  if (key === 'A') return '#a855f7';
  if (key === 'B') return '#facc15';
  if (key === 'C') return '#06b6d4';
  return '#94a3b8';
}

function routeStatusChip(status) {
  if (/UNCONDITIONAL/i.test(status)) {
    return closedChip;
  }
  if (/unfalsified|G4 closed/i.test(status)) {
    return newChip;
  }
  return openChip;
}

function metaStatusColor(status) {
  if (status === 'completed') return '#22c55e';
  if (status === 'pending') return '#facc15';
  if (status === 'superseded') return '#94a3b8';
  return '#ef4444';
}

function metaStatusChip(status) {
  if (status === 'completed') return closedChip;
  if (status === 'pending') return newChip;
  if (status === 'superseded') return statusChip('rgba(148,163,184,0.12)', '#cbd5e1', 'rgba(148,163,184,0.35)');
  return openChip;
}
