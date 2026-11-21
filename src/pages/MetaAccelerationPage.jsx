import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SESSIONS } from '../data/sessions.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { LAMBDA_INTERCEPT_UNCONDITIONAL } from '../data/lambda-intercept-unconditional.js';
import { RANKED_OPPORTUNITIES } from '../data/full-route-map-2026-06-19.js';
import { ED, alpha } from '../styles/tokens.js';
// imp-1013: improvement-queue.js (~1.8 MB) and improvements.js (~3.3 MB) are
// dynamic-imported below so opening this page does not block on a 5 MB chunk
// download. Both files are also dynamic-imported by their primary pages
// (ImprovementQueuePage, ImprovementsPage), so no static import remains.

// Meta Acceleration — engine status dashboard + Λ approach progress snapshot.
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
//
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.
// Dark-hex -> editorial var mapping (consistent with other editorial ports,
// e.g. LambdaBoundsPage.jsx / TwinLadderPage.jsx):
//   #a855f7 purple -> var(--brass)     #facc15 / #f59e0b amber -> var(--brass-dk)
//   #ef4444 / #fca5a5 red -> var(--terra-dk)   #06b6d4 / #3b82f6 blue -> var(--blue)
//   #22c55e / #10b981 / #86efac green -> var(--green)  #94a3b8 / #cbd5e1 slate -> var(--faint)

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
      i && typeof i.summary === 'string' && /imp-3[0-9]{2}|proof/.test(i.summary),
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

// ── Static config: phase narrative of the Λ approach ─────────────────────────

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
    title: 'Phase 7 — Approach B1-B4',
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
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  background: bg,
  color: fg,
  border: `1px solid ${border}`,
});

const openChip = statusChip(alpha(ED.series2, 0.14), 'var(--terra-dk)', alpha(ED.series2, 0.4));
const closedChip = statusChip(alpha(ED.series3, 0.14), 'var(--green)', alpha(ED.series3, 0.4));
const newChip = statusChip(alpha(ED.brassDeco, 0.16), 'var(--brass-dk)', alpha(ED.brassDeco, 0.45));

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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Meta Acceleration</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Status dashboard for the auto-improvement engine, plus the archived
            phase record of the early Λ approach (imp-314..344 era). The current
            Λ frontier is summarized in the card below; the live technical
            state is on <Link to="/state-of-program" style={{ color: 'var(--blue)' }}>/state-of-program</Link>{' '}
            and <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>/permutation-architecture</Link>.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            borderRadius: 6,
            marginBottom: 20,
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            fontSize: 11,
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            color: 'var(--faint)',
          }}
        >
          <span style={{ color: 'var(--brass-dk)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Data snapshot
          </span>
          <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{latestSession.date}</span>
          <span style={{ color: 'var(--ink-soft)', opacity: 0.4 }}>·</span>
          <span>latest research session; queue loaded dynamically</span>
        </div>

        {/* ── Current Λ frontier ────────────────────────────────────────── */}
        <div
          className="card"
          style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 24 }}
        >
          <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
            Current Λ frontier
          </div>
          <div
            style={{
              fontFamily: 'var(--ed-mono, var(--font-mono))',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brass-dk)',
              marginBottom: 8,
            }}
          >
            Λ ≤ 0.2 (Platt–Trudgian) — the peer-reviewed benchmark
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 10, lineHeight: 1.55 }}>
            Program candidates below it, both unrefereed:{' '}
            <Link to="/newman-lambda-01787854-candidate" style={{ color: 'var(--blue)' }}>
              Λ ≤ 0.1787854
            </Link>{' '}
            (computer-assisted; reviewed by Dan Romik; publicly posted,
            not refereed) and{' '}
            <Link to="/lambda-01758354-candidate" style={{ color: 'var(--blue)' }}>
              Λ ≤ 0.1758354
            </Link>{' '}
            (four Arb gates, Lean-checked y-transfer reduction and Lemma B3). The{' '}
            <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>
              Λ ≤ 0.14 completion contract
            </Link>{' '}
            is a conditional contract, not a bound: one enclosure family
            remains open, |C_E,17| &lt; 0.2796881955526147 on
            690988 ≤ N ≤ 54799999.
          </div>
        </div>

        {/* ── Historical imp-344 capstone card ─────────────────────────── */}
        <div
          className="card"
          style={{ ...cardBaseLeft('var(--faint)'), marginBottom: 24 }}
        >
          <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
            Historical — imp-344 capstone claim (superseded)
          </div>
          <div
            style={{
              fontFamily: 'var(--ed-mono, var(--font-mono))',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--ink-soft)',
              marginBottom: 8,
            }}
          >
            {strongestClaim.statement}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 10 }}>
            via <em>{strongestClaim.via}</em> — {strongestClaim.scope}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--faint)',
              background: 'var(--paper)',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
              lineHeight: 1.5,
            }}
          >
            This was the claim the imp-344 capstone assembly recorded at the
            time. A later cross-check (ROUTE_MAP_CROSS_CHECK, 2026-06-19)
            reclassified the G6-bridge chain as an <strong>estimate</strong>{' '}
            gated on the undischarged C_H shock modulus, and the C_H wall was
            subsequently closed as a no-go — so this chain does not establish
            any Λ bound. It is kept here as a phase record only. Rodgers–Tao
            proved Λ ≥ 0; Λ = 0 ⟺ RH remains open.
          </div>
        </div>

        {/* ── Queue + engine snapshot ─────────────────────────────────── */}
        <div className="card-grid" style={{ marginBottom: 24 }}>
          <div className="card" style={cardBaseLeft('var(--brass)')}>
            <div style={cardLabel}>Queue</div>
            <div style={cardBig}>{qSummary.total}</div>
            <div style={cardSub}>total tickets</div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-soft)' }}>
              <div>✓ completed: <strong>{qSummary.byStatus.completed || 0}</strong></div>
              <div>… pending: <strong>{qSummary.byStatus.pending || 0}</strong></div>
              {qSummary.byStatus.superseded > 0 && (
                <div>⊘ superseded: <strong>{qSummary.byStatus.superseded}</strong></div>
              )}
            </div>
          </div>

          <div className="card" style={cardBaseLeft('var(--terra-dk)')}>
            <div style={cardLabel}>Pending critical</div>
            <div style={cardBig}>{qSummary.byPriorityPending.critical || 0}</div>
            <div style={cardSub}>next-frontier RH tickets</div>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              {qSummary.critPendingIds.length > 0
                ? qSummary.critPendingIds.join(', ')
                : '(queue drained — seed more)'}
            </div>
          </div>

          <div className="card" style={cardBaseLeft('var(--blue)')}>
            <div style={cardLabel}>Improvements shipped</div>
            <div style={cardBig}>{dataReady ? improvementsCount : '…'}</div>
            <div style={cardSub}>commits via auto-improve engine</div>
            <Link
              to="/improvements"
              style={{
                display: 'inline-block',
                marginTop: 8,
                fontSize: 11,
                color: 'var(--blue)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                textDecoration: 'none',
              }}
            >
              → /improvements
            </Link>
          </div>

          <div className="card" style={cardBaseLeft('var(--green)')}>
            <div style={cardLabel}>Sessions journaled</div>
            <div style={cardBig}>{SESSIONS.length}</div>
            <div style={cardSub}>coarse session narratives</div>
            <Link
              to="/research-journal"
              style={{
                display: 'inline-block',
                marginTop: 8,
                fontSize: 11,
                color: 'var(--green)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
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
          style={{ ...cardBaseLeft('var(--faint)'), marginBottom: 24 }}
        >
          <div style={cardLabel}>Engine runtime state</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6 }}>
            The engine's live PID, run counter, and rate-limit sentinel are
            filesystem state, not visible to a static Vite build. Check from the
            shell:
          </div>
          <pre
            style={{
              fontSize: 11,
              background: 'var(--paper)',
              padding: 10,
              borderRadius: 6,
              border: '1px solid var(--hairline)',
              marginTop: 10,
              color: 'var(--blue)',
            }}
          >
{`./scripts/auto-improve.sh status         # running? run count?
cat  scripts/.rate-limit-backoff-state   # rate-limit sentinel (if present)
ls -t scripts/logs/run_*.log | head -3   # 3 most recent run logs
git log --oneline -10                    # engine commits`}
          </pre>
          <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
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

        {/* ── Three routes (historical, imp-344 era) ─────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Historical phase record — three routes (imp-344 era)</h2>
        <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 12, maxWidth: 760, lineHeight: 1.55 }}>
          The three-route decomposition below was the gap structure of the Λ
          approach as of the imp-344 capstone. It was superseded by the C_H
          reclassification, the candidate bounds, and the one-open-family 0.14
          contract — see <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>/permutation-architecture</Link>.
          Status chips reflect the state at the time, not the current program.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
          {Object.entries(routes).map(([key, route]) => (
            <div key={key} className="card" style={cardBaseLeft(routeColor(key))}>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 4 }}>
                Route ({key})
              </div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{route.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 10 }}>
                {route.claim}
              </div>
              <div style={{ fontSize: 11, marginBottom: 6 }}>
                <span style={routeStatusChip(route.routeStatus)}>{route.routeStatus}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--faint)' }}>
                <strong>Closes:</strong> {route.closes}
              </div>
              <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
                <strong>Buys us:</strong> {route.buysUs}
              </div>
            </div>
          ))}
        </div>

        {/* ── G1–G6 gap list (historical, imp-344 era) ─────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>G1–G6 gap list (historical, imp-344 era)</h2>
        <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 12, maxWidth: 760, lineHeight: 1.55 }}>
          This was the open-gap ledger of the imp-336..344 phase. It is not the
          current gap structure: the chain these gaps blocked was later
          reclassified as an estimate gated on the C_H modulus (a closed
          no-go), and the live open item is the 0.14 contract&apos;s single
          enclosure family.
        </p>
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
                  background: 'var(--paper)',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, fontWeight: 700 }}>
                    {g.id}: {g.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 2 }}>
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

        {/* ── Route-map opportunities (2026-06-19 snapshot) ─────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Route-map opportunities (2026-06-19 snapshot, superseded)</h2>
        <div className="card" style={{ marginBottom: 24, borderLeftWidth: 3, borderLeftColor: 'var(--brass)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 10, lineHeight: 1.5 }}>
            Ranking from the June 2026 route map, kept as a dated snapshot —
            not current strategy. The #1 item (the C_H / G6a shock modulus)
            was subsequently closed as a no-go, and Λ work moved below the 0.2
            benchmark via the candidate bounds and the{' '}
            <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>
              0.14 completion contract
            </Link>{' '}
            (one open enclosure family).
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {RANKED_OPPORTUNITIES.map((opp) => (
              <div
                key={opp.rank}
                style={{
                  padding: '10px 14px',
                  background: 'var(--paper)',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      fontFamily: 'var(--ed-mono, var(--font-mono))',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'color-mix(in srgb, var(--brass) 12%, transparent)',
                      color: 'var(--brass)',
                      border: '1px solid color-mix(in srgb, var(--brass) 30%, transparent)',
                    }}
                  >
                    #{opp.rank}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>{opp.target}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  {opp.why}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phases timeline (historical) ──────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Phase timeline (historical, phases 5–11)</h2>
        <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 12, maxWidth: 760, lineHeight: 1.55 }}>
          What each early phase shipped, recorded in the past tense as the
          program&apos;s phase history. Later phases run through the ticket
          queue and are not tracked in this list.
        </p>
        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
          {PHASES.map((phase) => (
            <div key={phase.id} className="card" style={cardBaseLeft('var(--brass)')}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{phase.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {phase.ids.map((id) => (
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
                    }}
                  >
                    {id}
                  </Link>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{phase.result}</div>
            </div>
          ))}
        </div>

        {/* ── Meta improvements ─────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>
          Meta improvements
          <span style={{ fontSize: 11, color: 'var(--faint)', marginLeft: 12, fontWeight: 400 }}>
            {metas.filter((m) => m.status === 'completed').length} shipped,{' '}
            {metas.filter((m) => m.status === 'pending').length} pending
          </span>
        </h2>
        <div className="card" style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--faint)',
              marginBottom: 10,
              padding: '8px 12px',
              background: 'var(--paper)',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
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
                  background: 'var(--paper)',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
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
                  <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, fontWeight: 700 }}>
                    {m.id}
                  </div>
                  <span style={metaStatusChip(m.status)}>{m.status}</span>
                </div>
                <div style={{ fontSize: 12, marginTop: 6, color: 'var(--ink)' }}>
                  {m.title.replace(/^META:\s*/, '')}
                </div>
                {m.completedAt && (
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--faint)',
                      marginTop: 4,
                      fontFamily: 'var(--ed-mono, var(--font-mono))',
                    }}
                  >
                    completed {m.completedAt}
                  </div>
                )}
                {m.description && (
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-soft)',
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
        <h2 className="ed-h2" style={{ marginTop: 32, marginBottom: 12 }}>Accelerating with Claude — Harness Pipeline</h2>
        <div className="card" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 16 }}>
            The auto-improvement engine is a self-improving pipeline. Each layer improves the layer below it.
            The meta-harness improves the harness, which improves the proof work.
          </p>

          {/* Pipeline visualization */}
          <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
            {[
              {
                layer: 'L0 — Proof Engine',
                color: 'var(--blue)',
                desc: 'Opus-tier auto-improve.sh runs claude --print on each ticket. Makes one atomic change per run, commits, pushes.',
                features: [
                  { name: 'Priority queue', status: 'active', detail: 'critical > high > medium > low' },
                  { name: 'Category routing', status: 'active', detail: 'Opus: proof/feature/content/meta; Sonnet: content/ux; Haiku: bug/ux/visual' },
                  { name: 'Three-channel model pool', status: 'active', detail: 'opus/sonnet/fable tiers via engine-model.json; each tier picks only its byModel bucket from queue-index.json' },
                  { name: 'Token budget discipline', status: 'active', detail: 'queue-index.json cache (4KB) avoids reading 280K-token improvements.js; nextImprovementId, byModel buckets, criticalPending served directly' },
                  { name: 'Build verification', status: 'active', detail: 'npm run build after every change; rollback on failure' },
                  { name: 'Git commit + auto-push', status: 'active', detail: 'Every 5 runs pushes to origin/main (imp-442)' },
                ],
              },
              {
                layer: 'L1 — Self-Monitoring',
                color: 'var(--brass)',
                desc: 'The engine monitors its own health and detects failures without human intervention.',
                features: [
                  { name: 'Heartbeat stall detection', status: 'active', detail: 'Terminates wedged claude --print after 120s (imp-420)' },
                  { name: 'Status-flip verification', status: 'active', detail: 'Post-commit check that queue status was actually flipped (imp-419)' },
                  { name: 'Rate-limit backoff', status: 'active', detail: 'Sentinel file + exponential backoff on 429 errors' },
                  { name: 'Dev server health check', status: 'active', detail: 'HTTP 200 check on localhost:3002 each run (imp-313)' },
                  { name: 'Idle detection', status: 'active', detail: 'Auto-stop after 10 consecutive empty-queue runs (imp-518)' },
                  { name: 'Build-gated assertion sweep', status: 'active', detail: 'npm run build triggers run-assertions.mjs --fast; cross-checks StateOfProgram TRUTHS vs overclaim-ledger; fails build on mismatch (imp-2967)' },
                ],
              },
              {
                layer: 'L2 — Self-Seeding',
                color: 'var(--brass-dk)',
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
                color: 'var(--green)',
                desc: 'The engine improves its own infrastructure — scanner filters, parser bugs, prompt engineering.',
                features: [
                  { name: 'Scanner self-patching', status: 'active', detail: 'Engine adds exclusion filters to autofill scanner (imp-663..669)' },
                  { name: 'Parser bug fixes', status: 'shipped', detail: 'Fixed balanced-brace parser for string literals (66 hidden tickets recovered)' },
                  { name: 'Prompt refinement', status: 'active', detail: 'Token budget discipline, syntax gotchas, category routing rules' },
                  { name: 'Ticket-id collision prevention', status: 'shipped', detail: 'Claim protocol for concurrent agents (imp-446)' },
                  { name: 'Skeptical review loop', status: 'shipped', detail: '7 reviews, FATAL trajectory 2->0->0->0->0->0->TBD' },
                ],
              },
              {
                layer: 'L4 — Rigor Audit',
                color: 'var(--terra-dk)',
                desc: 'An internal verification loop keeps result framing and in line with the evidence.',
                features: [
                  { name: 'clarity pass', status: 'shipped', detail: 'Replaced false UNCONDITIONAL labels with GUE-CONDITIONAL (imp-583)' },
                  { name: 'NoSwap gap acknowledged', status: 'shipped', detail: 'partial closure — initial superiority fails (imp-584)' },
                  { name: 'Route B separation', status: 'shipped', detail: 'Standalone unconditional paper for genuinely proved result (imp-585)' },
                  { name: 'Paper reframing', status: 'shipped', detail: 'Conditional computational verification framing (imp-590)' },
                  { name: 'Selberg rescue path', status: 'shipped', detail: 'Unconditional C_mb = O(log T) closes at finite N_0* (imp-586)' },
                  { name: 'clarity-drift guard', status: 'shipped', detail: 'StateOfProgram TRUTHS are cross-checked against the internal record at build time (imp-2967) so result framing cannot silently drift' },
                ],
              },
            ].map((layer) => (
              <div
                key={layer.layer}
                style={{
                  padding: '12px 16px',
                  background: 'var(--paper)',
                  borderRadius: 8,
                  borderLeft: `3px solid ${layer.color}`,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: layer.color, marginBottom: 4 }}>
                  {layer.layer}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 8 }}>
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
                        fontFamily: 'var(--ed-mono, var(--font-mono))',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: f.status === 'active' ? 'var(--green)' : f.status === 'shipped' ? 'var(--blue)' : 'var(--brass)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: 'var(--ink)', fontWeight: 600, minWidth: 160 }}>
                        {f.name}
                      </span>
                      <span style={{ color: 'var(--faint)' }}>{f.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline ideas — things that could be built */}
          <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 12 }}>
            <strong>Future pipeline stages:</strong> L5 (cross-project learning — transfer proof strategies to other conjectures),
            L6 (collaborative multi-agent with role specialization — prover, reviewer, documenter),
            L7 (formal verification integration — auto-generated Lean proofs from JS closures),
            L8 (publication automation — auto-compile LaTeX, submit to arXiv, respond to referee reports).
          </div>
        </div>

        {/* ── Recent proof improvements ─────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Recent proof improvements</h2>
        <div className="card" style={{ marginBottom: 24 }}>
          {recentProof.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--faint)' }}>
              No recent proof-category improvements found.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {recentProof.map((imp) => (
                <div
                  key={imp.id}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--paper)',
                    borderRadius: 6,
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 10, color: 'var(--faint)' }}>
                    #{imp.id} • {imp.timestamp}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>{(imp.summary || imp.title || '').slice(0, 200)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Latest session teaser ─────────────────────────────────── */}
        {latestSession && (
          <>
            <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Last journaled session (historical)</h2>
            <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginBottom: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {latestSession.date} — {latestSession.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6, lineHeight: 1.5 }}>
                Dated session note: the journal&apos;s last entry is{' '}
                {latestSession.date}, which predates the C_H-wall closure and
                the current candidate/contract frontier. The figures below are
                what that session recorded, not the current state.
              </div>
              {latestSession.lambdaHeadline && (
                <div
                  style={{
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                    fontSize: 11,
                    color: 'var(--ink-soft)',
                    marginTop: 8,
                    padding: '6px 10px',
                    background: 'var(--paper)',
                    borderRadius: 4,
                  }}
                >
                  Λ headline recorded at that session&apos;s end (empirical
                  session-end estimate, not a program bound):{' '}
                  <strong style={{ color: 'var(--brass-dk)' }}>
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
                <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
                  <strong>Main-line blocker recorded at that session&apos;s end (the C_H wall has since been closed as a no-go):</strong>{' '}
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
                    color: 'var(--green)',
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                    textDecoration: 'none',
                  }}
                >
                  → full session narrative on /research-journal
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ── Related pages ─────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Related pages</h2>
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link
              to="/lambda-bounds"
              style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}
            >
              → Λ bounds &amp; RH roadmap
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

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            ← the atlas
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Local style helpers ────────────────────────────────────────────────────

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

const cardBig = {
  fontSize: 32,
  fontWeight: 700,
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  lineHeight: 1,
};

const cardSub = {
  fontSize: 11,
  color: 'var(--faint)',
  marginTop: 4,
};

function cardBaseLeft(color) {
  return { borderLeftWidth: 3, borderLeftColor: color };
}

function routeColor(key) {
  if (key === 'A') return 'var(--brass)';
  if (key === 'B') return 'var(--brass-dk)';
  if (key === 'C') return 'var(--blue)';
  return 'var(--faint)';
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
  if (status === 'completed') return 'var(--green)';
  if (status === 'pending') return 'var(--brass-dk)';
  if (status === 'superseded') return 'var(--faint)';
  return 'var(--terra-dk)';
}

function metaStatusChip(status) {
  if (status === 'completed') return closedChip;
  if (status === 'pending') return newChip;
  if (status === 'superseded') return statusChip(alpha(ED.inkFaint, 0.12), 'var(--faint)', alpha(ED.inkFaint, 0.35));
  return openChip;
}
