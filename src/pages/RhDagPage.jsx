import React, { useMemo, useState } from 'react';
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

/* ─── Layered node-link DAG (Sugiyama-style: columns = dependency depth) ──── */

function DagGraph({ nodes, layer, critSet, frontierSet }) {
  const [hover, setHover] = useState(null);
  const COL_W = 172, NODE_W = 138, NODE_H = 32, V_GAP = 13, PAD_X = 24, PAD_TOP = 34, PAD_BOTTOM = 16;

  const { positioned, edges, width, height, layerKeys } = useMemo(() => {
    const layerMap = {};
    nodes.forEach((n) => {
      const k = layer[n.id] || 0;
      (layerMap[k] = layerMap[k] || []).push(n);
    });
    const keys = Object.keys(layerMap).map(Number).sort((a, b) => a - b);
    const pos = {};
    let maxRows = 0;
    keys.forEach((k, ci) => {
      const col = layerMap[k];
      maxRows = Math.max(maxRows, col.length);
      col.forEach((n, ri) => {
        const x = PAD_X + ci * COL_W;
        const y = PAD_TOP + ri * (NODE_H + V_GAP);
        pos[n.id] = { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 };
      });
    });
    const es = [];
    nodes.forEach((n) =>
      (n.dependsOn || []).forEach((d) => {
        if (pos[d] && pos[n.id]) es.push({ from: d, to: n.id });
      })
    );
    return {
      positioned: pos,
      edges: es,
      layerKeys: keys,
      width: PAD_X * 2 + (keys.length - 1) * COL_W + NODE_W,
      height: PAD_TOP + maxRows * (NODE_H + V_GAP) + PAD_BOTTOM,
    };
  }, [nodes, layer]);

  const connected = useMemo(() => {
    if (!hover) return null;
    const ids = new Set([hover]);
    edges.forEach((e) => {
      if (e.from === hover) ids.add(e.to);
      if (e.to === hover) ids.add(e.from);
    });
    return ids;
  }, [hover, edges]);

  const edgePath = (a, b) => {
    const x1 = a.cx + NODE_W / 2, y1 = a.cy, x2 = b.cx - NODE_W / 2, y2 = b.cy;
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  };
  const hoverNode = hover && positioned[hover] ? nodes.find((n) => n.id === hover) : null;

  return (
    <div style={{ width: '100%', overflowX: 'auto', background: 'rgba(15,23,42,0.35)', borderRadius: 10, border: '1px solid var(--border)' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: width, height: 'auto', display: 'block' }}>
        <defs>
          <marker id="rhdag-arrow" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#64748b" />
          </marker>
          <marker id="rhdag-arrow-crit" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#facc15" />
          </marker>
        </defs>
        {/* column headers */}
        {layerKeys.map((k, ci) => (
          <text key={k} x={PAD_X + ci * COL_W + NODE_W / 2} y={16} textAnchor="middle" fill="#475569" fontSize={10} fontWeight={700} fontFamily="var(--font-mono)">
            LAYER {k}
          </text>
        ))}
        {/* edges */}
        {edges.map((e, i) => {
          const a = positioned[e.from], b = positioned[e.to];
          const crit = critSet.has(e.from) && critSet.has(e.to);
          const dim = connected ? !(connected.has(e.from) && connected.has(e.to)) : false;
          return (
            <path
              key={i}
              d={edgePath(a, b)}
              fill="none"
              stroke={crit ? '#facc15' : '#64748b'}
              strokeWidth={crit ? 2 : 1.1}
              opacity={dim ? 0.05 : crit ? 0.85 : 0.32}
              markerEnd={crit ? 'url(#rhdag-arrow-crit)' : 'url(#rhdag-arrow)'}
            />
          );
        })}
        {/* nodes */}
        {nodes.map((n) => {
          const p = positioned[n.id];
          if (!p) return null;
          const c = STATUS_COLORS[n.status] || '#ef4444';
          const dim = connected ? !connected.has(n.id) : false;
          const crit = critSet.has(n.id);
          const front = frontierSet.has(n.id);
          return (
            <g key={n.id} style={{ cursor: 'pointer', transition: 'opacity 0.15s' }} opacity={dim ? 0.16 : 1}
               onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
              <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx={6}
                    fill={c + '1f'} stroke={crit ? '#facc15' : c} strokeWidth={hover === n.id ? 2.5 : crit ? 2 : 1.3} />
              <text x={p.x + 8} y={p.cy + 1} dominantBaseline="central" fill="#e2e8f0" fontSize={10.5}
                    fontWeight={700} fontFamily="var(--font-mono)" style={{ pointerEvents: 'none' }}>
                {n.id}{crit ? ' ★' : ''}{front ? ' ⬤' : ''}
              </text>
              <circle cx={p.x + NODE_W - 8} cy={p.y + 7} r={3} fill={c} style={{ pointerEvents: 'none' }} />
            </g>
          );
        })}
        {/* tooltip */}
        {hoverNode && (() => {
          const p = positioned[hover];
          const tw = 250, th = 46;
          const tx = Math.min(Math.max(p.cx - tw / 2, 4), width - tw - 4);
          const below = p.y - th - 8 < 0;
          const ty = below ? p.y + NODE_H + 8 : p.y - th - 8;
          const title = (hoverNode.title || '').slice(0, 64);
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty} width={tw} height={th} rx={6} fill="#0f172a" stroke={(STATUS_COLORS[hoverNode.status] || '#ef4444') + '99'} />
              <text x={tx + 8} y={ty + 16} fill={STATUS_COLORS[hoverNode.status] || '#ef4444'} fontSize={10} fontWeight={700} fontFamily="var(--font-mono)">
                {hoverNode.id} · {hoverNode.status}
              </text>
              <text x={tx + 8} y={ty + 33} fill="#cbd5e1" fontSize={9} fontFamily="var(--font-mono)">
                {title}{(hoverNode.title || '').length > 64 ? '…' : ''}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
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

  const targetNode = useMemo(() => nodes.find((n) => n.id === 'imp-356'), [nodes]);
  const targetDone = targetNode && (targetNode.status === 'completed' || targetNode.status === 'partial');

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
        <div className="card" style={{ borderLeftWidth: 3, borderLeftColor: targetDone ? '#22c55e' : '#facc15' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Critical path to imp-356
          </div>
          {targetDone ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#22c55e' }}>
                ✓ DONE
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                imp-356 is already {targetNode.status} — no remaining steps
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {critPath.length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                sequential steps to the SOTA capstone
              </div>
            </>
          )}
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
            {targetDone
              ? 'imp-356 is already completed — no further rounds needed.'
              : 'No rounds — target imp-356 is fully blocked (check for missing dependency nodes).'}
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
      <h2 style={{ marginBottom: 12 }}>Dependency DAG</h2>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border)' }}>
        A true node-link DAG: columns are dependency depth (layer 0 has no
        dependencies), and each arrow points from a prerequisite ticket to the one
        that needs it (drawn from <code>dependsOn</code>). Hover any node to trace
        its dependencies and dependents. <strong style={{ color: '#facc15' }}>★</strong>{' '}
        marks the critical path to <code>imp-356</code>;{' '}
        <strong style={{ color: '#06b6d4' }}>⬤</strong> marks the unblocked frontier.
      </div>
      <DagGraph nodes={nodes} layer={layer} critSet={critSet} frontierSet={frontierSet} />

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
