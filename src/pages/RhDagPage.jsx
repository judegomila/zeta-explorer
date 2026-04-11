import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RH_DAG, RH_DAG_NODES } from '../data/rh-dag.js';

// RH Dependency DAG — visual planner for the Λ-attack.
//
// Nodes = improvement tickets (imp-NNN). Edges = dependsOn (A --> B means
// A must be closed before B can start). Status coloring: completed = green,
// partial = yellow, pending & unblocked = cyan, pending & blocked = red.
// Critical path to imp-356 highlighted with thicker edges.

const STATUS_COLORS = {
  completed: '#22c55e',
  partial: '#facc15',
  pending: '#ef4444',
  deferred: '#94a3b8',
};

function topoLayers(nodes) {
  // Layered topological layout: layer 0 = no-dep nodes, layer k+1 = nodes
  // whose dependencies are all in layers ≤ k. Gives a left-to-right flow.
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const layer = {};
  function lay(id, seen = new Set()) {
    if (layer[id] !== undefined) return layer[id];
    if (seen.has(id)) return 0;
    seen.add(id);
    const node = byId[id];
    if (!node) return 0;
    const deps = (node.dependsOn || []).filter((d) => byId[d]);
    if (deps.length === 0) {
      layer[id] = 0;
      return 0;
    }
    const maxDep = Math.max(...deps.map((d) => lay(d, seen)));
    layer[id] = maxDep + 1;
    return layer[id];
  }
  for (const n of nodes) lay(n.id);
  return layer;
}

function statusChipStyle(status) {
  const color = STATUS_COLORS[status] || '#ef4444';
  return {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 9,
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    background: `${color}22`,
    color,
    border: `1px solid ${color}66`,
  };
}

export default function RhDagPage() {
  const nodes = RH_DAG_NODES;
  const layer = useMemo(() => topoLayers(nodes), [nodes]);
  const frontier = useMemo(() => RH_DAG.unblockedFrontier(), []);
  const critPath = useMemo(() => RH_DAG.criticalPathTo('imp-356'), []);
  const schedule = useMemo(
    () => RH_DAG.frontierSchedule('imp-356', 10),
    [],
  );

  const layerMap = {};
  for (const n of nodes) {
    const k = layer[n.id] || 0;
    if (!layerMap[k]) layerMap[k] = [];
    layerMap[k].push(n);
  }
  const layerKeys = Object.keys(layerMap).map(Number).sort((a, b) => a - b);

  const critSet = new Set(critPath);
  const frontierSet = new Set(frontier.map((n) => n.id));

  return (
    <div className="page">
      <div className="page-header">
        <h1>RH Dependency DAG</h1>
        <p className="page-subtitle">
          Every ticket that matters for the Λ-attack, wired up by dependency.
          The DAG is the plan: each layer is a set of tickets that can run in
          parallel, the critical path to <code>imp-356</code> is the minimum
          sequence that has to happen in order. Use{' '}
          <Link to="/improvement-queue">/improvement-queue</Link> for the live
          status table, and <Link to="/lambda-bounds">/lambda-bounds</Link> for
          the 5-step chain overview.
        </p>
      </div>

      {/* ── Top summary ─────────────────────────────────────────────── */}
      <div className="card-grid" style={{ marginBottom: 24 }}>
        <div className="card" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Closed (completed + partial)
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {RH_DAG.closedCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            of {RH_DAG.nodeCount} total
          </div>
        </div>
        <div className="card" style={{ borderLeftWidth: 3, borderLeftColor: '#06b6d4' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Unblocked frontier
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {frontier.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            can start right now in parallel
          </div>
          <div style={{ fontSize: 10, marginTop: 6, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {frontier.map((n) => n.id).join(', ') || '(none)'}
          </div>
        </div>
        <div className="card" style={{ borderLeftWidth: 3, borderLeftColor: '#facc15' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Critical path to imp-356
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {critPath.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            sequential steps to the SOTA capstone
          </div>
        </div>
      </div>

      {/* ── Frontier schedule (future fanout rounds) ──────────────── */}
      <h2 style={{ marginBottom: 12 }}>Parallel schedule to imp-356</h2>
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
        Each round lists tickets that become unblocked simultaneously after the
        prior round closes. Run <code>/fanout N</code> with the first round
        now, then the second round after the first commits, and so on.
      </div>
      <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
        {schedule.length === 0 ? (
          <div className="card" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            No rounds — target imp-356 is either reachable already or fully blocked.
          </div>
        ) : (
          schedule.map((roundIds, idx) => (
            <div key={idx} className="card">
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                Round {idx + 1} ({roundIds.length} parallel)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {roundIds.map((id) => (
                  <Link
                    key={id}
                    to="/improvement-queue"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 4,
                      background: critSet.has(id) ? '#facc1522' : 'var(--bg-primary)',
                      color: critSet.has(id) ? '#facc15' : '#a855f7',
                      border: `1px solid ${critSet.has(id) ? '#facc1566' : 'var(--border)'}`,
                      textDecoration: 'none',
                      fontWeight: critSet.has(id) ? 700 : 400,
                    }}
                  >
                    {id}
                    {critSet.has(id) && ' ★'}
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Layered DAG ──────────────────────────────────────────── */}
      <h2 style={{ marginBottom: 12 }}>Dependency layers</h2>
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
        Left-to-right topological layers. Layer 0 has no dependencies; each
        subsequent layer can start only after all its dependencies are
        closed. A ★ indicates the ticket is on the critical path to imp-356.
        A ⬤ indicates it is in the current unblocked frontier.
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 24 }}>
        {layerKeys.map((k) => (
          <div
            key={k}
            style={{
              minWidth: 260,
              background: 'var(--bg-primary)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              padding: 10,
            }}
          >
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Layer {k}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {layerMap[k].map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 6,
                    border: `1px solid ${STATUS_COLORS[n.status] || '#ef4444'}33`,
                    borderLeft: `3px solid ${STATUS_COLORS[n.status] || '#ef4444'}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {n.id}
                      {critSet.has(n.id) && ' ★'}
                      {frontierSet.has(n.id) && ' ⬤'}
                    </div>
                    <span style={statusChipStyle(n.status)}>{n.status}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {n.title}
                  </div>
                  {n.dependsOn && n.dependsOn.length > 0 && (
                    <div
                      style={{
                        fontSize: 9,
                        color: 'var(--text-muted)',
                        marginTop: 4,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      ← {n.dependsOn.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Legend ──────────────────────────────────────────────── */}
      <div className="card" style={{ borderLeftWidth: 3, borderLeftColor: '#94a3b8' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
          Legend
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11 }}>
          <span><span style={statusChipStyle('completed')}>completed</span> fully closed</span>
          <span><span style={statusChipStyle('partial')}>partial</span> partial with named sub-gap</span>
          <span><span style={statusChipStyle('pending')}>pending</span> not started</span>
          <span><strong style={{ color: '#facc15' }}>★</strong> on critical path to imp-356</span>
          <span><strong style={{ color: '#06b6d4' }}>⬤</strong> in unblocked frontier</span>
        </div>
      </div>
    </div>
  );
}
