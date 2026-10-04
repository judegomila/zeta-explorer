import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

/*
 * Engine Room — live "are we working?" ops view.
 *
 * Fetches public/fleet-status.json (written locally by scripts/fleet-status-writer.mjs,
 * committed when a ticket completes) and auto-refreshes. Shows two things the user
 * wants to SEE: (1) we are checking into GitHub, (2) we are at maximum capacity.
 *
 * Editorial (warm) re-theme: full-width dashboard, identical structure/data/logic.
 * Color mapping from the dark-theme accents (kept consistent with other editorial
 * ports, e.g. TwinLadderPage.jsx / ThetaBasinClosurePage.jsx):
 *   #22c55e green   -> var(--green)   / literal #4c7a4a
 *   #3b82f6 blue    -> var(--blue)    / literal #3f6b86
 *   #06b6d4 cyan    -> var(--blue)    / literal #3f6b86
 *   #f59e0b amber   -> var(--brass-dk)/ literal #b58a2e
 *   #eab308 yellow  -> var(--brass-dk)/ literal #b58a2e
 *   #a855f7 violet  -> var(--brass)   / literal #8c6a1d
 *   #8b5cf6 purple  -> var(--terra)   / literal #d9502e
 *   #ec4899 pink    -> var(--terra)   / literal #d9502e
 *   #ef4444 red     -> var(--terra-dk)/ literal #c23a1c
 *   #e2e8f0/#94a3b8/#64748b/#475569 slate text -> var(--ink) / var(--ink-soft) / var(--faint)
 * CAT_COLOR stays literal hex (not var()) because it is concatenated with an
 * alpha suffix ("...+ '22'") below to make the badge background.
 */

const CAT_COLOR = {
  proof: ED.brass, accuracy: ED.brassDeco, content: ED.series3, ux: ED.series1,
  numerical: ED.series1, meta: ED.accentDeco, bug: ED.series2, performance: ED.brassDeco, visual: ED.accentDeco,
};

function ago(iso) {
  if (!iso) return '—';
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (isNaN(d)) return '—';
  if (d < 60) return `${Math.max(0, Math.round(d))}s ago`;
  if (d < 3600) return `${Math.round(d / 60)}m ago`;
  if (d < 86400) return `${Math.round(d / 3600)}h ago`;
  return `${Math.round(d / 86400)}d ago`;
}

function Stat({ label, value, sub, color }) {
  return (
    <div className="card" style={{ flex: '1 1 150px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: color || 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{value}</div>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function EngineRoomPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/fleet-status.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('status ' + r.status);
      setData(await r.json());
      setErr(null);
      setFetchedAt(Date.now());
    } catch (e) { setErr(e.message); }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 25000);
    return () => clearInterval(id);
  }, [load]);

  const g = data?.git || {};
  const f = data?.fleet || {};
  const q = data?.queue || {};
  const recent = data?.recent || [];
  const lastCommitMin = g.lastCommitAt ? (Date.now() - new Date(g.lastCommitAt).getTime()) / 60000 : Infinity;
  const live = lastCommitMin < 15 && (f.totalWorkers || 0) > 0;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <h1 className="ed-h1" style={{ margin: 0 }}>Engine Room</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: live ? 'var(--green)' : 'var(--faint)', boxShadow: live ? '0 0 8px var(--series-3)' : 'none', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: live ? 'var(--green)' : 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              {live ? 'LIVE — engines working' : 'IDLE / no recent check-in'}
            </span>
          </div>
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760, marginTop: 10, marginBottom: 20 }}>
          Live ops view of the autonomous engine fleet approaching the improvement queue.
          Refreshes every 25s; the snapshot is committed whenever a ticket completes.
        </p>

        {err && (
          <div className="card" style={{ borderLeft: `3px solid ${err.includes('404') ? 'var(--blue)' : 'var(--brass-dk)'}`, fontSize: 12, marginBottom: 20 }}>
            {err.includes('404')
              ? <><strong>Live data only available locally.</strong> The deployed site has no local engine writer — run the dev server locally to see live fleet activity. The snapshot below populates after the first ticket completes and is committed.</>
              : <>Status feed unavailable ({err}). Retrying every 25 s.</>}
          </div>
        )}

        {data && (
          <>
            {/* 1. CHECKING INTO GITHUB */}
            <h2 className="ed-h2" style={{ fontSize: 16, marginTop: 18, marginBottom: 10 }}>① Checking into GitHub</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <Stat label="commits / hour" value={g.commitsLastHour ?? '—'} color={ED.series3} />
              <Stat label="commits / 24h" value={g.commits24h ?? '—'} color={ED.series3} />
              <Stat label="origin sync" value={g.synced ? '✓' : (g.unpushed ? `+${g.unpushed}` : '—')} sub={g.synced ? 'in sync' : 'push pending'} color={g.synced ? 'var(--green)' : 'var(--brass-dk)'} />
              <Stat label="last check-in" value={ago(g.lastCommitAt)} color={ED.ink} />
            </div>
            <div className="card" style={{ fontSize: 12.5 }}>
              <div style={{ color: 'var(--faint)', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>Latest commit</div>
              <code style={{ color: 'var(--green)' }}>{g.lastSha}</code> — {g.lastMessage}
              <div style={{ marginTop: 8 }}>
                <a href={g.repoCommitsUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', fontSize: 12 }}>View all commits on GitHub →</a>
              </div>
            </div>

            {/* 2. MAXIMUM CAPACITY */}
            <h2 className="ed-h2" style={{ fontSize: 16, marginTop: 22, marginBottom: 10 }}>② Working at maximum capacity</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <Stat label="active workers" value={f.totalWorkers ?? '—'} sub="across channels" color={ED.series1} />
              <Stat label="live agents now" value={f.liveAgentsNow ?? '—'} color={ED.series1} />
              <Stat label="queue pending" value={q.pending ?? '—'} sub="tickets left" color={ED.brass} />
              <Stat label="done / 24h" value={q.completed24h ?? '—'} color={ED.series3} />
            </div>
            <div className="card">
              <div style={{ color: 'var(--faint)', fontSize: 10, textTransform: 'uppercase', marginBottom: 8 }}>Engine fleet (separate quota channels)</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {(f.engines || []).map((e) => (
                  <div key={e.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 10, alignItems: 'center', padding: '6px 8px', borderRadius: 6, background: 'var(--paper2)', opacity: e.on ? 1 : 0.45 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.on ? 'var(--green)' : 'var(--faint)', display: 'inline-block' }} />
                      <strong style={{ fontSize: 13 }}>{e.name}</strong>
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{e.model}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{e.channel}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: e.on ? 'var(--blue)' : 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{e.workers}w</span>
                  </div>
                ))}
              </div>
              {q.byModel && Object.keys(q.byModel).length > 0 && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-soft)' }}>
                  queue by channel: {Object.entries(q.byModel).map(([k, v]) => `${k}:${v}`).join('  ·  ')}
                </div>
              )}
            </div>

            {/* RECENT COMPLETIONS FEED */}
            <h2 className="ed-h2" style={{ fontSize: 16, marginTop: 22, marginBottom: 10 }}>Recent completions</h2>
            <div className="card" style={{ padding: 0 }}>
              {recent.length === 0 && <div style={{ padding: 12, fontSize: 12, color: 'var(--faint)' }}>(feed populates as tickets land)</div>}
              {recent.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '8px 12px', borderTop: i ? '1px solid var(--hairline)' : 'none' }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: (CAT_COLOR[r.category] || '#877b67') + '22', color: CAT_COLOR[r.category] || 'var(--ink-faint)', whiteSpace: 'nowrap' }}>{r.category}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', flex: 1, lineHeight: 1.4 }}>{r.summary}</span>
                  <span style={{ fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', whiteSpace: 'nowrap' }}>{ago(r.at)}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              snapshot {ago(data.generatedAt)} · auto-refresh 25s{fetchedAt ? ` · last fetch ${ago(new Date(fetchedAt).toISOString())}` : ''}
              <br />live when run locally (regenerated per request, zero commits) · deployed shows the last snapshot
            </div>
          </>
        )}

        {/* ── Framing ──────────────────────────────────────────── */}
        <div
          className="card"
          style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--terra-dk)', borderRadius: 8, padding: '16px 18px', marginTop: 24 }}
        >
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>What this dashboard is (and isn't)</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            This is an ops view of throughput, not a scoreboard of results. The fleet
            produces candidates and no-gos at scale — it does not produce proofs.
            Every commit landing here still has to clear referees and the no-false-QED
            gate before a claim on the site changes; a busy engine room says the
            pipeline is running, not that the mathematics has moved.
          </div>
        </div>

        {/* ── Related pages ───────────────────────────────────────────── */}
        <div
          className="card"
          style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--brass)', borderRadius: 8, padding: '16px 18px', marginTop: 16 }}
        >
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/autonomous-fleet" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → The autonomous fleet (how the machine works)
            </Link>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Λ bounds ledger
            </Link>
            <Link to="/improvement-queue" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Live improvement queue
            </Link>
            <Link to="/improvements" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
              → Per-commit improvements log
            </Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
