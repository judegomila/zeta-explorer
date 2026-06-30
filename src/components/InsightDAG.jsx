import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  INSIGHT_NODES,
  INSIGHT_EDGES,
  STATUS_COLORS,
  CATEGORY_COLORS,
} from '../data/insight-dag.js';

/* ─── Layout constants ──────────────────────────────────────────────────── */

const LAYER_Y = [0, 180, 370, 560, 720, 900, 1080];
const SVG_WIDTH = 1280;
const NODE_W = 110;
const NODE_H = 42;
const NODE_RX = 8;
const PADDING_X = 60;
const PADDING_TOP = 30;
const PADDING_BOTTOM = 100;
const STAGGER_Y = 58;     // vertical offset for odd nodes in crowded layers
const STAGGER_THRESHOLD = 6; // layers with more nodes than this are staggered

/* ─── Compute positioned nodes ──────────────────────────────────────────── */
//
// Each node carries its own `layer` (0-4) in the data, so the renderer no
// longer drops nodes missing from a hardcoded id->layer map (the previous
// LAYER_MAP silently hid every node it didn't list). Crowded layers are
// staggered into two rows so 110px labels don't collide.

function computeNodePositions() {
  const layers = [[], [], [], [], [], [], []];
  INSIGHT_NODES.forEach((n) => {
    const layer = typeof n.layer === 'number' ? n.layer : 2;
    if (layer >= 0 && layer < layers.length) layers[layer].push(n);
  });

  const positioned = {};
  layers.forEach((nodesInLayer, layerIdx) => {
    const count = nodesInLayer.length;
    const availableW = SVG_WIDTH - PADDING_X * 2;
    const spacing = count > 1 ? availableW / (count - 1) : 0;
    const startX = count > 1 ? PADDING_X : SVG_WIDTH / 2;
    const stagger = count > STAGGER_THRESHOLD;

    nodesInLayer.forEach((node, i) => {
      const cx = count > 1 ? startX + i * spacing : startX;
      const cy = PADDING_TOP + LAYER_Y[layerIdx] + (stagger ? (i % 2) * STAGGER_Y : 0);
      positioned[node.id] = {
        ...node,
        cx,
        cy,
        x: cx - NODE_W / 2,
        y: cy - NODE_H / 2,
      };
    });
  });

  return positioned;
}

/* ─── Edge style config ─────────────────────────────────────────────────── */

function edgeStyle(type) {
  switch (type) {
    case 'derives':
      return { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: 'none' };
    case 'composes':
      return { stroke: '#8b5cf6', strokeWidth: 2.5, strokeDasharray: 'none' };
    case 'inspires':
      return { stroke: '#06b6d4', strokeWidth: 1.2, strokeDasharray: '6,4' };
    case 'analogous':
      return { stroke: '#ec4899', strokeWidth: 1.2, strokeDasharray: '2,3' };
    case 'requires':
      return { stroke: '#f97316', strokeWidth: 1.5, strokeDasharray: 'none', marker: true };
    case 'proves':
      return { stroke: '#10b981', strokeWidth: 3, strokeDasharray: 'none', marker: true };
    case 'equivalent':
      return { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: 'none', double: true };
    case 'supports':
      return { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4,3' };
    case 'extends':
      return { stroke: '#a78bfa', strokeWidth: 1.2, strokeDasharray: 'none' };
    case 'refutes':
      return { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,4', marker: true };
    case 'reformulates':
      return { stroke: '#fbbf24', strokeWidth: 1.6, strokeDasharray: '1,5' };
    case 'illustrates':
      return { stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '2,4' };
    case 'characterizes':
      return { stroke: '#fbbf24', strokeWidth: 1.4, strokeDasharray: '4,3', marker: true };
    default:
      return { stroke: '#475569', strokeWidth: 1, strokeDasharray: 'none' };
  }
}

/* ─── SVG arrow marker definitions ──────────────────────────────────────── */

function MarkerDefs() {
  return (
    <defs>
      <marker id="dag-arrow-requires" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#f97316" />
      </marker>
      <marker id="dag-arrow-proves" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <path d="M0,0 L10,3.5 L0,7 Z" fill="#10b981" />
      </marker>
      <marker id="dag-arrow-refutes" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
      </marker>
      <filter id="dag-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/* ─── Bezier edge path ──────────────────────────────────────────────────── */

function bezierPath(x1, y1, x2, y2) {
  const dy = y2 - y1;
  const cpOffset = Math.max(40, Math.abs(dy) * 0.45);
  return `M${x1},${y1} C${x1},${y1 + cpOffset} ${x2},${y2 - cpOffset} ${x2},${y2}`;
}

/* ─── Edge component ────────────────────────────────────────────────────── */

function EdgePath({ edge, nodes, dimmed }) {
  const from = nodes[edge.from];
  const to = nodes[edge.to];
  if (!from || !to) return null;

  const style = edgeStyle(edge.type);
  const x1 = from.cx;
  const y1 = from.cy + NODE_H / 2;
  const x2 = to.cx;
  const y2 = to.cy - NODE_H / 2;

  const markerEnd = style.marker
    ? `url(#dag-arrow-${edge.type})`
    : undefined;

  const opacity = dimmed ? 0.08 : 0.7;

  if (style.double) {
    // Double line for "equivalent"
    return (
      <g>
        <path
          d={bezierPath(x1 - 2, y1, x2 - 2, y2)}
          fill="none"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth * 0.6}
          opacity={opacity}
        />
        <path
          d={bezierPath(x1 + 2, y1, x2 + 2, y2)}
          fill="none"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth * 0.6}
          opacity={opacity}
        />
      </g>
    );
  }

  return (
    <path
      d={bezierPath(x1, y1, x2, y2)}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeDasharray={style.strokeDasharray !== 'none' ? style.strokeDasharray : undefined}
      markerEnd={markerEnd}
      opacity={opacity}
    />
  );
}

/* ─── Node component ────────────────────────────────────────────────────── */

function NodeRect({ node, dimmed, hovered, onHover, onLeave, onClick }) {
  const statusColor = STATUS_COLORS[node.status] || '#64748b';
  const opacity = dimmed ? 0.15 : 1;

  return (
    <g
      style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
      opacity={opacity}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(node)}
    >
      {/* Background rect */}
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={NODE_RX}
        fill={statusColor + '18'}
        stroke={statusColor}
        strokeWidth={hovered ? 2.5 : 1.5}
        filter={hovered ? 'url(#dag-glow)' : undefined}
      />
      {/* Label */}
      <text
        x={node.cx}
        y={node.cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#e2e8f0"
        fontSize={node.id === 'rh' ? 11 : 9.5}
        fontWeight={node.id === 'rh' ? 700 : 600}
        fontFamily="var(--font-mono)"
        style={{ pointerEvents: 'none' }}
      >
        {node.label}
      </text>
      {/* Status dot */}
      <circle
        cx={node.x + NODE_W - 8}
        cy={node.y + 8}
        r={3.5}
        fill={statusColor}
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
}

/* ─── Tooltip ───────────────────────────────────────────────────────────── */

function Tooltip({ node, svgRef }) {
  if (!node) return null;
  const statusColor = STATUS_COLORS[node.status] || '#64748b';

  // Position tooltip above the node by default. For top-row (FOUNDATION) nodes
  // the default `node.y - 58` lands at negative y, outside the SVG viewBox, so
  // hovering over euler-product / functional-eq / analytic-cont rendered an
  // invisible tooltip. Flip below the node when there's not enough room above.
  const tx = node.cx;
  const tooltipH = 44;
  const gap = 10;
  const aboveY = node.y - gap - tooltipH;
  const flipBelow = aboveY < 0;
  const rectY = flipBelow ? node.y + NODE_H + gap : aboveY;
  const titleY = rectY + 16;
  const descY = rectY + 32;

  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={tx - 140}
        y={rectY}
        width={280}
        height={tooltipH}
        rx={6}
        fill="#0f172a"
        stroke={statusColor + '80'}
        strokeWidth={1}
        opacity={0.95}
      />
      <text
        x={tx}
        y={titleY}
        textAnchor="middle"
        fill={statusColor}
        fontSize={10}
        fontWeight={700}
        fontFamily="var(--font-mono)"
      >
        {node.label} ({node.status})
      </text>
      <text
        x={tx}
        y={descY}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={8.5}
        fontFamily="var(--font-mono)"
      >
        {node.description.length > 55
          ? node.description.slice(0, 55) + '...'
          : node.description}
      </text>
    </g>
  );
}

/* ─── Legend ─────────────────────────────────────────────────────────────── */

function Legend() {
  const statusItems = [
    { label: 'Proven', color: STATUS_COLORS.proven },
    { label: 'Conditional', color: STATUS_COLORS.conditional },
    { label: 'Estimate', color: STATUS_COLORS.estimate },
    { label: 'Gap', color: STATUS_COLORS.gap },
    { label: 'Open', color: STATUS_COLORS.open },
    { label: 'RH-equiv', color: STATUS_COLORS['rh-equivalent'] },
    { label: 'Refuted', color: STATUS_COLORS.refuted },
  ];

  const edgeItems = [
    { label: 'Derives', stroke: '#64748b', dash: '' },
    { label: 'Composes', stroke: '#8b5cf6', dash: '', thick: true },
    { label: 'Requires', stroke: '#f97316', dash: '', arrow: true },
    { label: 'Proves', stroke: '#10b981', dash: '', thick: true },
    { label: 'Equivalent', stroke: '#ef4444', dash: '', double: true },
    { label: 'Reformulates', stroke: '#fbbf24', dash: '1,5' },
    { label: 'Refutes', stroke: '#ef4444', dash: '5,4', arrow: true },
    { label: 'Supports', stroke: '#94a3b8', dash: '4,3' },
    { label: 'Extends', stroke: '#a78bfa', dash: '' },
    { label: 'Inspires', stroke: '#06b6d4', dash: '6,4' },
    { label: 'Analogous', stroke: '#ec4899', dash: '2,3' },
  ];

  const baseY = PADDING_TOP + LAYER_Y[6] + NODE_H / 2 + 30;

  return (
    <g>
      {/* Status legend */}
      <text x={PADDING_X} y={baseY} fill="#64748b" fontSize={9} fontWeight={600} fontFamily="var(--font-mono)">
        STATUS:
      </text>
      {statusItems.map((item, i) => (
        <g key={item.label}>
          <circle cx={PADDING_X + 55 + i * 90} cy={baseY - 3} r={4} fill={item.color} />
          <text x={PADDING_X + 63 + i * 90} y={baseY} fill="#94a3b8" fontSize={8.5} fontFamily="var(--font-mono)">
            {item.label}
          </text>
        </g>
      ))}

      {/* Edge legend */}
      <text x={PADDING_X} y={baseY + 20} fill="#64748b" fontSize={9} fontWeight={600} fontFamily="var(--font-mono)">
        EDGES:
      </text>
      {edgeItems.map((item, i) => {
        const lx = PADDING_X + 50 + i * 104;
        return (
          <g key={item.label}>
            {item.double ? (
              <>
                <line x1={lx} y1={baseY + 15} x2={lx + 24} y2={baseY + 15} stroke={item.stroke} strokeWidth={1.2} />
                <line x1={lx} y1={baseY + 19} x2={lx + 24} y2={baseY + 19} stroke={item.stroke} strokeWidth={1.2} />
              </>
            ) : (
              <line
                x1={lx}
                y1={baseY + 17}
                x2={lx + 24}
                y2={baseY + 17}
                stroke={item.stroke}
                strokeWidth={item.thick ? 2.5 : 1.2}
                strokeDasharray={item.dash || undefined}
              />
            )}
            {item.arrow && (
              <polygon
                points={`${lx + 20},${baseY + 14} ${lx + 26},${baseY + 17} ${lx + 20},${baseY + 20}`}
                fill={item.stroke}
              />
            )}
            <text x={lx + 28} y={baseY + 20} fill="#94a3b8" fontSize={8.5} fontFamily="var(--font-mono)">
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ─── Layer labels ──────────────────────────────────────────────────────── */

function LayerLabels() {
  const labels = [
    { label: 'FOUNDATION', y: LAYER_Y[0], color: CATEGORY_COLORS.foundation },
    { label: 'MODEL', y: LAYER_Y[1], color: CATEGORY_COLORS.model },
    { label: 'ANALYSIS', y: LAYER_Y[2], color: CATEGORY_COLORS.analysis },
    { label: 'GAPS', y: LAYER_Y[3], color: CATEGORY_COLORS.gap },
    { label: 'TARGET', y: LAYER_Y[4], color: CATEGORY_COLORS.target },
    { label: 'OBSERVATIONS', y: LAYER_Y[5], color: CATEGORY_COLORS.viz },
    { label: 'FINDINGS', y: LAYER_Y[6], color: CATEGORY_COLORS.finding },
  ];

  return (
    <>
      {labels.map(({ label, y, color }) => (
        <text
          key={label}
          x={14}
          y={PADDING_TOP + y + 4}
          fill={color}
          fontSize={8}
          fontWeight={700}
          fontFamily="var(--font-mono)"
          opacity={0.5}
          style={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          {label}
        </text>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main InsightDAG component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function InsightDAG() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Compute positions once
  const nodes = useMemo(() => computeNodePositions(), []);

  // Connections for highlight: set of node ids connected to hovered
  const connectedIds = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set([hoveredId]);
    INSIGHT_EDGES.forEach((e) => {
      if (e.from === hoveredId) ids.add(e.to);
      if (e.to === hoveredId) ids.add(e.from);
    });
    return ids;
  }, [hoveredId]);

  const connectedEdges = useMemo(() => {
    if (!hoveredId) return null;
    return new Set(
      INSIGHT_EDGES
        .filter((e) => e.from === hoveredId || e.to === hoveredId)
        .map((e) => `${e.from}->${e.to}`)
    );
  }, [hoveredId]);

  const handleHover = useCallback((id) => setHoveredId(id), []);
  const handleLeave = useCallback(() => setHoveredId(null), []);
  const handleClick = useCallback(
    (node) => {
      if (node.page) navigate(node.page);
    },
    [navigate]
  );

  const svgHeight = PADDING_TOP + LAYER_Y[6] + NODE_H / 2 + STAGGER_Y + PADDING_BOTTOM;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        style={{
          width: '100%',
          height: 'auto',
          minHeight: 400,
          display: 'block',
          background: 'rgba(15,23,42,0.3)',
          borderRadius: 12,
          border: '1px solid rgba(100,116,139,0.15)',
        }}
      >
        <MarkerDefs />
        <LayerLabels />

        {/* Render edges */}
        {INSIGHT_EDGES.map((edge, i) => {
          const edgeKey = `${edge.from}->${edge.to}`;
          const dimmed = connectedEdges ? !connectedEdges.has(edgeKey) : false;
          return <EdgePath key={i} edge={edge} nodes={nodes} dimmed={dimmed} />;
        })}

        {/* Render nodes */}
        {INSIGHT_NODES.map((n) => {
          const pos = nodes[n.id];
          if (!pos) return null;
          const dimmed = connectedIds ? !connectedIds.has(n.id) : false;
          const hovered = hoveredId === n.id;
          return (
            <NodeRect
              key={n.id}
              node={pos}
              dimmed={dimmed}
              hovered={hovered}
              onHover={handleHover}
              onLeave={handleLeave}
              onClick={handleClick}
            />
          );
        })}

        {/* Tooltip */}
        {hoveredId && nodes[hoveredId] && <Tooltip node={nodes[hoveredId]} svgRef={svgRef} />}

        {/* Legend */}
        <Legend />
      </svg>
    </div>
  );
}
