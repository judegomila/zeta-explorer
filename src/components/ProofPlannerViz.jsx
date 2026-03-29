import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PROOF_SECTIONS } from '../math/formal-proof.js';

// ── Node layout & data ──────────────────────────────────────────────────────

const STATUS_COLORS = {
  proven:      '#10b981',
  conditional: '#f59e0b',
  gap:         '#f97316',
  open:        '#ef4444',
};

const STATUS_LABELS = {
  proven:      'Proven',
  conditional: 'Conditional',
  gap:         'Gap',
  open:        'Open',
};

// Tractability: higher = closer to resolution (0-1)
const TRACTABILITY = {
  S1:  1.0,   // fully proven
  S2:  1.0,   // fully proven
  S3:  1.0,   // fully proven
  S4:  0.55,  // conditional, plausible path via regularized products
  S5:  0.25,  // critical gap, Hilbert-Polya conjecture
  S6:  0.60,  // conditional, numerical evidence strong
  S7:  0.30,  // critical gap, Darlington extension needed
  S8:  0.10,  // open, the RH itself
  S9:  0.50,  // conditional, supporting evidence
  S10: 0.08,  // open, equivalent to RH
};

const KEY_OBSTACLES = {
  S1:  'None — standard systems theory identification.',
  S2:  'None for sigma>1. Euler product diverges in critical strip.',
  S3:  'None — Riemann\'s 1859 result.',
  S4:  'Defining a meaningful "cascade" via analytic continuation in the critical strip.',
  S5:  'No self-adjoint operator with Spec = {zeta zeros} has been constructed.',
  S6:  'Analytical proof that d^2T/dsigma^2 > 0 for all t is missing.',
  S7:  'Darlington theorem must be extended to infinite analytically-continued networks.',
  S8:  'This IS the Riemann Hypothesis. Requires closing S5 or S7.',
  S9:  'Information-theoretic quantities are defined by analogy, not standard Shannon.',
  S10: 'Equivalent to RH. Best result: 41.72% of zeros on critical line.',
};

// Positions for the DAG layout (normalised 0-1, will be scaled to canvas)
const NODE_POSITIONS = {
  S1:  { x: 0.10, y: 0.20 },
  S2:  { x: 0.25, y: 0.20 },
  S3:  { x: 0.10, y: 0.60 },
  S4:  { x: 0.38, y: 0.40 },
  S5:  { x: 0.52, y: 0.22 },
  S6:  { x: 0.52, y: 0.58 },
  S7:  { x: 0.52, y: 0.80 },
  S8:  { x: 0.72, y: 0.45 },
  S9:  { x: 0.72, y: 0.70 },
  S10: { x: 0.88, y: 0.45 },
};

// Edges derived from PROOF_SECTIONS.dependencies
function buildEdges() {
  const edges = [];
  for (const sec of PROOF_SECTIONS) {
    for (const dep of sec.dependencies) {
      edges.push({ from: dep, to: sec.id });
    }
  }
  return edges;
}

// Critical paths to S8 (RH)
const CRITICAL_PATH_A = ['S1', 'S2', 'S4', 'S5', 'S8']; // Hilbert-Polya path
const CRITICAL_PATH_B = ['S2', 'S3', 'S4', 'S7', 'S8']; // Darlington path

function isOnCriticalPath(nodeId) {
  return CRITICAL_PATH_A.includes(nodeId) || CRITICAL_PATH_B.includes(nodeId);
}

function edgeOnCriticalPath(from, to) {
  const inA = CRITICAL_PATH_A.includes(from) && CRITICAL_PATH_A.includes(to) &&
    CRITICAL_PATH_A.indexOf(to) === CRITICAL_PATH_A.indexOf(from) + 1;
  const inB = CRITICAL_PATH_B.includes(from) && CRITICAL_PATH_B.includes(to) &&
    CRITICAL_PATH_B.indexOf(to) === CRITICAL_PATH_B.indexOf(from) + 1;
  return inA || inB;
}

// "Next best step" — the highest-tractability non-proven section on a critical path
function nextBestStep() {
  const candidates = [...new Set([...CRITICAL_PATH_A, ...CRITICAL_PATH_B])];
  let best = null;
  let bestScore = -1;
  for (const id of candidates) {
    const sec = PROOF_SECTIONS.find(s => s.id === id);
    if (sec.status === 'proven') continue;
    const t = TRACTABILITY[id];
    if (t > bestScore) { bestScore = t; best = id; }
  }
  return best;
}

// ── Canvas Component ─────────────────────────────────────────────────────────

export default function ProofPlannerViz({ onNodeClick }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animRef = useRef(0);
  const edges = useRef(buildEdges()).current;
  const bestStep = useRef(nextBestStep()).current;

  const nodeRadius = useCallback((id, w) => {
    const base = Math.min(w * 0.035, 32);
    return base * (0.6 + 0.5 * TRACTABILITY[id]);
  }, []);

  const getCanvasPos = useCallback((id, w, h) => {
    const p = NODE_POSITIONS[id];
    return { x: p.x * w, y: p.y * h };
  }, []);

  // Hit-test
  const hitTest = useCallback((mx, my, w, h) => {
    for (const sec of PROOF_SECTIONS) {
      const pos = getCanvasPos(sec.id, w, h);
      const r = nodeRadius(sec.id, w);
      const dx = mx - pos.x, dy = my - pos.y;
      if (dx * dx + dy * dy <= r * r) return sec.id;
    }
    return null;
  }, [getCanvasPos, nodeRadius]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let t0 = performance.now();

    function draw(now) {
      const elapsed = (now - t0) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Draw edges
      for (const edge of edges) {
        const from = getCanvasPos(edge.from, w, h);
        const to = getCanvasPos(edge.to, w, h);
        const onCP = edgeOnCriticalPath(edge.from, edge.to);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = onCP ? 'rgba(99,102,241,0.7)' : 'rgba(71,85,105,0.4)';
        ctx.lineWidth = onCP ? 2.5 : 1.2;
        if (onCP) ctx.setLineDash([]);
        else ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrowhead
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const rTo = nodeRadius(edge.to, w);
        const ax = to.x - Math.cos(angle) * rTo;
        const ay = to.y - Math.sin(angle) * rTo;
        const aLen = onCP ? 10 : 7;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - aLen * Math.cos(angle - 0.35), ay - aLen * Math.sin(angle - 0.35));
        ctx.lineTo(ax - aLen * Math.cos(angle + 0.35), ay - aLen * Math.sin(angle + 0.35));
        ctx.closePath();
        ctx.fillStyle = onCP ? 'rgba(99,102,241,0.8)' : 'rgba(71,85,105,0.5)';
        ctx.fill();
      }

      // Draw path labels
      ctx.font = '11px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(99,102,241,0.6)';
      ctx.textAlign = 'center';
      const pathAMid = getCanvasPos('S5', w, h);
      ctx.fillText('Path A (Spectral)', pathAMid.x, pathAMid.y - nodeRadius('S5', w) - 10);
      const pathBMid = getCanvasPos('S7', w, h);
      ctx.fillText('Path B (Circuit)', pathBMid.x, pathBMid.y + nodeRadius('S7', w) + 16);

      // Draw nodes
      for (const sec of PROOF_SECTIONS) {
        const pos = getCanvasPos(sec.id, w, h);
        const r = nodeRadius(sec.id, w);
        const color = STATUS_COLORS[sec.status];
        const isHovered = hovered === sec.id;
        const isBest = bestStep === sec.id;

        // Pulse for best step
        let pulseR = 0;
        if (isBest) {
          pulseR = r + 6 + 4 * Math.sin(elapsed * 2.5);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99,102,241,${0.3 + 0.2 * Math.sin(elapsed * 2.5)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Critical path glow
        if (isOnCriticalPath(sec.id)) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(99,102,241,0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, 0, pos.x, pos.y, r);
        grad.addColorStop(0, color + 'cc');
        grad.addColorStop(1, color + '66');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#fff' : color;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(11, r * 0.55)}px var(--font-mono, monospace)`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sec.id, pos.x, pos.y - 2);

        // Tractability score
        ctx.font = `${Math.max(8, r * 0.35)}px var(--font-mono, monospace)`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(`${Math.round(TRACTABILITY[sec.id] * 100)}%`, pos.x, pos.y + r * 0.4);
      }

      // Legend
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '11px var(--font-mono, monospace)';
      let lx = 12, ly = h - 60;
      for (const [status, color] of Object.entries(STATUS_COLORS)) {
        ctx.beginPath();
        ctx.arc(lx + 6, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(STATUS_LABELS[status], lx + 16, ly);
        ly += 16;
      }

      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [hovered, edges, bestStep, getCanvasPos, nodeRadius]);

  // Mouse events
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });
    const hit = hitTest(mx, my, rect.width, rect.height);
    setHovered(hit);
    canvas.style.cursor = hit ? 'pointer' : 'default';
  }, [hitTest]);

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = hitTest(mx, my, rect.width, rect.height);
    if (hit && onNodeClick) onNodeClick(hit);
  }, [hitTest, onNodeClick]);

  // Build tooltip data
  const hoveredSection = hovered ? PROOF_SECTIONS.find(s => s.id === hovered) : null;

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 480, borderRadius: 8, display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        onClick={handleClick}
      />
      {hoveredSection && (
        <div style={{
          position: 'fixed',
          left: mousePos.x + 16,
          top: mousePos.y - 10,
          background: '#1e293b',
          border: '1px solid ' + STATUS_COLORS[hoveredSection.status],
          borderRadius: 8,
          padding: '10px 14px',
          maxWidth: 320,
          zIndex: 1000,
          pointerEvents: 'none',
          fontSize: 12,
          fontFamily: 'var(--font-mono, monospace)',
          color: '#e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: STATUS_COLORS[hoveredSection.status] }}>
            {hoveredSection.id}: {hoveredSection.title}
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ color: '#64748b' }}>Status: </span>
            <span style={{ color: STATUS_COLORS[hoveredSection.status] }}>{STATUS_LABELS[hoveredSection.status]}</span>
            <span style={{ color: '#64748b' }}> | Tractability: </span>
            <span style={{ color: '#93c5fd' }}>{Math.round(TRACTABILITY[hoveredSection.id] * 100)}%</span>
          </div>
          <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>
            {KEY_OBSTACLES[hoveredSection.id]}
          </div>
          {bestStep === hoveredSection.id && (
            <div style={{ marginTop: 6, color: '#818cf8', fontWeight: 600 }}>
              Recommended next step
            </div>
          )}
        </div>
      )}
    </div>
  );
}
