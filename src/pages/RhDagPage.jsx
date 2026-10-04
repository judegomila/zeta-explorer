import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { RH_DAG, RH_DAG_NODES } from '../data/rh-dag.js';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

// RH Dependency DAG — visual planner for the Λ-attack.
//
// Nodes = improvement tickets (imp-NNN). Edges = dependsOn (A --> B means
// A must be closed before B can start). Status coloring: completed = green,
// partial = brass, pending & unblocked/blocked = terra, deferred = blue.
// Critical path to imp-356 highlighted with thicker edges.
// Editorial (warm) re-theme: full-width layout, identical structure/data.

// Hex mirrors of the warm CSS vars, needed because the DAG composites alpha
// suffixes onto these colors (e.g. `${color}1f`) for fills — that trick only
// works on literal hex strings, not on var(...) references.
const STATUS_COLORS = {
  completed: ED.series3, // var(--green)
  partial: ED.brassDeco, // var(--brass-dk)
  pending: ED.series2, // var(--terra-dk)
  deferred: ED.series1, // var(--blue)
};
const EDGE_COLOR = ED.rule; // var(--hairline)
const EDGE_CRIT_COLOR = ED.brass; // var(--brass)

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
  const color = STATUS_COLORS[status] || ED.accent;
  return {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 9,
    fontFamily: 'var(--ed-mono, var(--font-mono))',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    background: `${color}22`,
    color,
    border: `1px solid ${color}66`,
  };
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
    <div style={{ width: '100%', overflowX: 'auto', background: 'var(--paper2)', borderRadius: 10, border: '1px solid var(--hairline)' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: width, height: 'auto', display: 'block' }}>
        <defs>
          <marker id="rhdag-arrow" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill={EDGE_COLOR} />
          </marker>
          <marker id="rhdag-arrow-crit" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={EDGE_CRIT_COLOR} />
          </marker>
        </defs>
        {/* column headers */}
        {layerKeys.map((k, ci) => (
          <text key={k} x={PAD_X + ci * COL_W + NODE_W / 2} y={16} textAnchor="middle" fill={ED.inkFaint} fontSize={10} fontWeight={700} fontFamily="var(--ed-mono, var(--font-mono))">
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
              stroke={crit ? EDGE_CRIT_COLOR : EDGE_COLOR}
              strokeWidth={crit ? 2 : 1.1}
              opacity={dim ? 0.08 : crit ? 0.9 : 0.55}
              markerEnd={crit ? 'url(#rhdag-arrow-crit)' : 'url(#rhdag-arrow)'}
            />
          );
        })}
        {/* nodes */}
        {nodes.map((n) => {
          const p = positioned[n.id];
          if (!p) return null;
          const c = STATUS_COLORS[n.status] || ED.series2;
          const dim = connected ? !connected.has(n.id) : false;
          const crit = critSet.has(n.id);
          const front = frontierSet.has(n.id);
          return (
            <g key={n.id} style={{ cursor: 'pointer', transition: 'opacity 0.15s' }} opacity={dim ? 0.16 : 1}
               onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
              <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx={6}
                    fill={c + '1f'} stroke={crit ? EDGE_CRIT_COLOR : c} strokeWidth={hover === n.id ? 2.5 : crit ? 2 : 1.3} />
              <text x={p.x + 8} y={p.cy + 1} dominantBaseline="central" fill={ED.ink} fontSize={10.5}
                    fontWeight={700} fontFamily="var(--ed-mono, var(--font-mono))" style={{ pointerEvents: 'none' }}>
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
          const hc = STATUS_COLORS[hoverNode.status] || ED.series2;
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty} width={tw} height={th} rx={6} fill={ED.paper} stroke={hc + '99'} />
              <text x={tx + 8} y={ty + 16} fill={hc} fontSize={10} fontWeight={700} fontFamily="var(--ed-mono, var(--font-mono))">
                {hoverNode.id} · {hoverNode.status}
              </text>
              <text x={tx + 8} y={ty + 33} fill={ED.inkSoft} fontSize={9} fontFamily="var(--ed-mono, var(--font-mono))">
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
  const [targetId, setTargetId] = useState(() => {
    const first = nodes.find((n) => n.status !== 'completed');
    return first ? first.id : nodes[0]?.id || 'imp-356';
  });
  const layer = useMemo(() => topoLayers(nodes), [nodes]);
  const frontier = useMemo(() => RH_DAG.unblockedFrontier(), []);
  const critPath = useMemo(() => RH_DAG.criticalPathTo(targetId), [targetId]);
  const schedule = useMemo(
    () => RH_DAG.frontierSchedule(targetId, 10),
    [targetId],
  );

  const availableTargets = useMemo(
    () => nodes.filter((n) => n.status !== 'completed').sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })),
    [nodes],
  );

  const targetNode = useMemo(() => nodes.find((n) => n.id === targetId), [nodes, targetId]);
  const targetDone = targetNode && (targetNode.status === 'completed' || targetNode.status === 'partial');

  const critSet = new Set(critPath);
  const frontierSet = new Set(frontier.map((n) => n.id));

  // Load-bearing-framing caveat (imp-2969), carried verbatim on the
  // capstone nodes so it stays attached to the DAG rather than a page-only
  // paraphrase. imp-375 states the WITHDRAWN-overclaim / C_H-undischarged
  // framing; imp-356 (the page's default critical-path target) restates it
  // for the cross-checked SOTA assembly.
  const capstoneParent = nodes.find((n) => n.id === 'imp-375');
  const capstone = nodes.find((n) => n.id === 'imp-356');

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>RH Dependency DAG — historical planner (frozen at the imp-356 era)</h1>
          <div
            className="card"
            style={{
              borderLeft: '4px solid var(--terra-dk)',
              padding: '10px 14px',
              marginBottom: 14,
              maxWidth: 760,
            }}
          >
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
              This is a historical planning artifact: its capstone and critical
              path target <code>imp-356</code>, from an earlier phase of the
              program (live tickets are now in the imp-95xxx range). It is kept
              as a record of how that phase was planned. The live frontier is{' '}
              <Link to="/frontier-dag"><strong>/frontier-dag</strong></Link>{' '}
              (asOf-stamped, one node per open object).
            </p>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Every ticket that mattered for the Λ-attack in that era, wired up by
            dependency. The DAG was the plan: each layer is a set of tickets that
            could run in parallel, the critical path to <code>imp-356</code> is the
            minimum sequence that had to happen in order. Use{' '}
            <Link to="/improvement-queue">/improvement-queue</Link> for the live
            status table, and <Link to="/lambda-bounds">/lambda-bounds</Link> for
            the bounds ledger.
          </p>
        </div>

        {/* ── Framing (imp-2969) — verbatim from the capstone nodes ── */}
        {(capstoneParent || capstone) && (
          <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 24 }}>
            <div style={cardLabel}>Framing — imp-356 capstone caveat (imp-2969)</div>
            {capstoneParent && (
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: capstone ? 10 : 0 }}>
                <strong style={{ color: 'var(--terra-dk)' }}>{capstoneParent.id} claim:</strong> {capstoneParent.claim}
                <br />
                <strong style={{ color: 'var(--terra-dk)' }}>{capstoneParent.id} notes:</strong> {capstoneParent.notes}
              </div>
            )}
            {capstone && (
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--terra-dk)' }}>{capstone.id} claim:</strong> {capstone.claim}
                <br />
                <strong style={{ color: 'var(--terra-dk)' }}>{capstone.id} notes:</strong> {capstone.notes}
              </div>
            )}
          </div>
        )}

        {/* ── Top summary ─────────────────────────────────────────────── */}
        <div className="card-grid" style={{ marginBottom: 24 }}>
          <div className="card" style={cardBaseLeft('var(--green)')}>
            <div style={cardLabel}>
              Closed (completed + partial)
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>
              {RH_DAG.closedCount}
            </div>
            <div style={{ fontSize: 11, color: 'var(--faint)' }}>
              of {RH_DAG.nodeCount} total
            </div>
          </div>
          <div className="card" style={cardBaseLeft('var(--blue)')}>
            <div style={cardLabel}>
              Unblocked frontier
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>
              {frontier.length}
            </div>
            <div style={{ fontSize: 11, color: 'var(--faint)' }}>
              can start right now in parallel
            </div>
            <div style={{ fontSize: 10, marginTop: 6, color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              {frontier.map((n) => n.id).join(', ') || '(none)'}
            </div>
          </div>
          <div className="card" style={cardBaseLeft(targetDone ? 'var(--green)' : 'var(--brass)')}>
            <div style={cardLabel}>
              Critical path to {targetId}
            </div>
            {targetDone ? (
              <>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--green)' }}>
                  ✓ DONE
                </div>
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>
                  {targetId} is already {targetNode.status} — no remaining steps
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>
                  {critPath.length}
                </div>
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>
                  sequential steps to target
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Target selector ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'var(--paper2)', borderRadius: 8, border: '1px solid var(--hairline)' }}>
          <label htmlFor="dag-target-select" style={{ fontSize: 11, fontWeight: 700, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 }}>
            Critical-path target
          </label>
          <select
            id="dag-target-select"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            style={{
              fontFamily: 'var(--ed-mono, var(--font-mono))',
              fontSize: 12,
              padding: '4px 8px',
              borderRadius: 5,
              border: '1px solid var(--hairline)',
              background: 'var(--paper)',
              color: 'var(--ink)',
              cursor: 'pointer',
              flex: '0 1 220px',
            }}
          >
            {availableTargets.map((n) => (
              <option key={n.id} value={n.id}>{n.id}</option>
            ))}
          </select>
          {targetNode && (
            <span style={{ fontSize: 11, color: 'var(--faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(targetNode.title || '').slice(0, 80)}
            </span>
          )}
        </div>

        {/* ── Completed-target warning ──────────────────────────────── */}
        {targetNode?.status === 'completed' && (
          <div style={{ marginBottom: 16, padding: '8px 14px', background: 'color-mix(in srgb, var(--series-3) 10%, transparent)', borderRadius: 6, border: '1px solid color-mix(in srgb, var(--series-3) 40%, transparent)', fontSize: 11, color: 'var(--green)' }}>
            {targetId} is already completed. Switch the target above to a live pending node, or view{' '}
            <Link to="/improvement-queue" style={{ color: 'var(--green)' }}>all frontier tickets</Link>.
          </div>
        )}

        {/* ── Frontier schedule (future fanout rounds) ──────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Parallel schedule to {targetId}</h2>
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
          Each round lists tickets that become unblocked simultaneously after the
          prior round closes. Run <code>/fanout N</code> with the first round
          now, then the second round after the first commits, and so on.
        </div>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          {schedule.length === 0 ? (
            <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), fontSize: 12, color: 'var(--faint)' }}>
              {targetDone
                ? `${targetId} is already completed — no further rounds needed.`
                : `No rounds — target ${targetId} is fully blocked (check for missing dependency nodes).`}
            </div>
          ) : (
            schedule.map((roundIds, idx) => (
              <div key={idx} className="card" style={cardBaseLeft('var(--brass)')}>
                <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
                  Round {idx + 1} ({roundIds.length} parallel)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {roundIds.map((id) => (
                    <Link
                      key={id}
                      to="/improvement-queue"
                      style={{
                        fontFamily: 'var(--ed-mono, var(--font-mono))',
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 4,
                        background: critSet.has(id) ? 'color-mix(in srgb, var(--brass) 14%, transparent)' : 'var(--paper)',
                        color: critSet.has(id) ? 'var(--brass)' : 'var(--blue)',
                        border: `1px solid ${critSet.has(id) ? TK_ALPHA(ED.brass, 0.45) : 'var(--hairline)'}`,
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
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Dependency DAG</h2>
        <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 12, padding: '8px 12px', background: 'var(--paper)', borderRadius: 6, border: '1px solid var(--hairline)' }}>
          A true node-link DAG: columns are dependency depth (layer 0 has no
          dependencies), and each arrow points from a prerequisite ticket to the one
          that needs it (drawn from <code>dependsOn</code>). Hover any node to trace
          its dependencies and dependents. <strong style={{ color: 'var(--brass)' }}>★</strong>{' '}
          marks the critical path to <code>{targetId}</code>;{' '}
          <strong style={{ color: 'var(--blue)' }}>⬤</strong> marks the unblocked frontier.
        </div>
        <DagGraph nodes={nodes} layer={layer} critSet={critSet} frontierSet={frontierSet} />

        {/* ── Legend ──────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginTop: 24 }}>
          <div style={{ ...cardLabel, marginBottom: 8 }}>
            Legend
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span><span style={statusChipStyle('completed')}>completed</span> fully closed</span>
            <span><span style={statusChipStyle('partial')}>partial</span> partial with named sub-gap</span>
            <span><span style={statusChipStyle('pending')}>pending</span> not started</span>
            <span><strong style={{ color: 'var(--brass)' }}>★</strong> on critical path to {targetId}</span>
            <span><strong style={{ color: 'var(--blue)' }}>⬤</strong> in unblocked frontier</span>
          </div>
        </div>

        {/* ── Cross links ─────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link
              to="/lambda-bounds"
              style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}
            >
              → Λ Bounds &amp; RH Roadmap
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
              to="/"
              style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}
            >
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
