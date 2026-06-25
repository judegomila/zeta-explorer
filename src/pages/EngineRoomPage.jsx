import React, { useState, useEffect, useCallback } from 'react';

/*
 * Engine Room — live "are we working?" ops view.
 *
 * Fetches public/fleet-status.json (written locally by scripts/fleet-status-writer.mjs,
 * committed when a ticket completes) and auto-refreshes. Shows two things the user
 * wants to SEE: (1) we are checking into GitHub, (2) we are at maximum capacity.
 */

const CAT_COLOR = {
  proof: '#a855f7', accuracy: '#f59e0b', content: '#22c55e', ux: '#06b6d4',
  numerical: '#3b82f6', meta: '#8b5cf6', bug: '#ef4444', performance: '#eab308', visual: '#ec4899',
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
      <div style={{ fontSize: 32, fontWeight: 800, color: color || '#e2e8f0', fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{sub}</div>}
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
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ margin: 0 }}>Engine Room</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: live ? '#22c55e' : '#64748b', boxShadow: live ? '0 0 8px #22c55e' : 'none', display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: live ? '#22c55e' : '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            {live ? 'LIVE — engines working' : 'IDLE / no recent check-in'}
          </span>
        </div>
      </div>
      <p className="page-subtitle">
        Live ops view of the autonomous engine fleet attacking the improvement queue.
        Refreshes every 25s; the snapshot is committed whenever a ticket completes.
      </p>

      {err && <div className="card" style={{ borderLeft: '3px solid #f59e0b', fontSize: 12 }}>
        Status feed not loaded yet ({err}). It appears after the first ticket completes and deploys.
      </div>}

      {data && (
        <>
          {/* 1. CHECKING INTO GITHUB */}
          <h2 style={{ fontSize: 16, marginTop: 18, marginBottom: 10 }}>① Checking into GitHub</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <Stat label="commits / hour" value={g.commitsLastHour ?? '—'} color="#22c55e" />
            <Stat label="commits / 24h" value={g.commits24h ?? '—'} color="#22c55e" />
            <Stat label="origin sync" value={g.synced ? '✓' : (g.unpushed ? `+${g.unpushed}` : '—')} sub={g.synced ? 'in sync' : 'push pending'} color={g.synced ? '#22c55e' : '#f59e0b'} />
            <Stat label="last check-in" value={ago(g.lastCommitAt)} color="#e2e8f0" />
          </div>
          <div className="card" style={{ fontSize: 12.5 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>Latest commit</div>
            <code style={{ color: '#22c55e' }}>{g.lastSha}</code> — {g.lastMessage}
            <div style={{ marginTop: 8 }}>
              <a href={g.repoCommitsUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: 12 }}>View all commits on GitHub →</a>
            </div>
          </div>

          {/* 2. MAXIMUM CAPACITY */}
          <h2 style={{ fontSize: 16, marginTop: 22, marginBottom: 10 }}>② Working at maximum capacity</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <Stat label="active workers" value={f.totalWorkers ?? '—'} sub="across channels" color="#06b6d4" />
            <Stat label="live agents now" value={f.liveAgentsNow ?? '—'} color="#06b6d4" />
            <Stat label="queue pending" value={q.pending ?? '—'} sub="tickets left" color="#a855f7" />
            <Stat label="done / 24h" value={q.completed24h ?? '—'} color="#22c55e" />
          </div>
          <div className="card">
            <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', marginBottom: 8 }}>Engine fleet (separate quota channels)</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {(f.engines || []).map((e) => (
                <div key={e.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 10, alignItems: 'center', padding: '6px 8px', borderRadius: 6, background: 'rgba(15,23,42,0.5)', opacity: e.on ? 1 : 0.45 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.on ? '#22c55e' : '#475569', display: 'inline-block' }} />
                    <strong style={{ fontSize: 13 }}>{e.name}</strong>
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{e.model}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{e.channel}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: e.on ? '#06b6d4' : '#475569', fontFamily: 'var(--font-mono)' }}>{e.workers}w</span>
                </div>
              ))}
            </div>
            {q.byModel && Object.keys(q.byModel).length > 0 && (
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
                queue by channel: {Object.entries(q.byModel).map(([k, v]) => `${k}:${v}`).join('  ·  ')}
              </div>
            )}
          </div>

          {/* RECENT COMPLETIONS FEED */}
          <h2 style={{ fontSize: 16, marginTop: 22, marginBottom: 10 }}>Recent completions</h2>
          <div className="card" style={{ padding: 0 }}>
            {recent.length === 0 && <div style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>(feed populates as tickets land)</div>}
            {recent.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '8px 12px', borderTop: i ? '1px solid #1e293b' : 'none' }}>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: (CAT_COLOR[r.category] || '#64748b') + '22', color: CAT_COLOR[r.category] || '#94a3b8', whiteSpace: 'nowrap' }}>{r.category}</span>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', flex: 1, lineHeight: 1.4 }}>{r.summary}</span>
                <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{ago(r.at)}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, color: '#475569', marginTop: 10, fontFamily: 'var(--font-mono)' }}>
            snapshot {ago(data.generatedAt)} · auto-refresh 25s{fetchedAt ? ` · last fetch ${ago(new Date(fetchedAt).toISOString())}` : ''}
            <br />live when run locally (regenerated per request, zero commits) · deployed shows the last snapshot
          </div>
        </>
      )}
    </div>
  );
}
