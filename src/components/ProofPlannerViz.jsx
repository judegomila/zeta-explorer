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

// Map status to glow category: proven→green, conditional/gap→yellow, open→red
const STATUS_GLOW = {
  proven:      { color: [16, 185, 129], pulse: true },   // green
  conditional: { color: [245, 158, 11],  pulse: true },   // yellow
  gap:         { color: [249, 115, 22],  pulse: true },   // orange-yellow
  open:        { color: [239, 68, 68],   pulse: true },   // red
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

// ── Helpers for animated edges ─────────────────────────────────────────────

// Compute the "proof progress depth" for each node: proven nodes get 1.0,
// nodes whose all dependencies are proven get partial credit, etc.
function computeProgressDepth() {
  const depth = {};
  for (const sec of PROOF_SECTIONS) {
    if (sec.status === 'proven') {
      depth[sec.id] = 1.0;
    } else if (sec.status === 'conditional') {
      depth[sec.id] = 0.5;
    } else if (sec.status === 'gap') {
      depth[sec.id] = 0.3;
    } else {
      depth[sec.id] = 0.0;
    }
  }
  return depth;
}

// ── Canvas Component ─────────────────────────────────────────────────────────

export default function ProofPlannerViz({ onNodeClick }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const edges = useRef(buildEdges()).current;
  const bestStep = useRef(nextBestStep()).current;
  const progressDepth = useRef(computeProgressDepth()).current;

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
    const t0 = performance.now();

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

      // ── Draw animated edges ──────────────────────────────────────────
      for (const edge of edges) {
        const from = getCanvasPos(edge.from, w, h);
        const to = getCanvasPos(edge.to, w, h);
        const onCP = edgeOnCriticalPath(edge.from, edge.to);
        const fromSec = PROOF_SECTIONS.find(s => s.id === edge.from);
        const toSec = PROOF_SECTIONS.find(s => s.id === edge.to);

        // Determine edge color based on source/target status
        const fromProven = fromSec.status === 'proven';
        const toProven = toSec.status === 'proven';
        let edgeColor, edgeAlpha;
        if (fromProven && toProven) {
          edgeColor = '16,185,129';  // green — both proven
          edgeAlpha = 0.6;
        } else if (fromProven) {
          edgeColor = '245,158,11';  // yellow — progress flowing
          edgeAlpha = 0.5;
        } else {
          edgeColor = onCP ? '99,102,241' : '71,85,105';  // indigo or gray
          edgeAlpha = onCP ? 0.7 : 0.4;
        }

        // Animated flowing dashes — direction of logical dependency
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const dashLen = onCP ? 8 : 5;
        const gapLen = onCP ? 6 : 5;
        const speed = fromProven ? 40 : 20; // faster for proven→next edges
        const dashOffset = -(elapsed * speed) % (dashLen + gapLen);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(${edgeColor},${edgeAlpha})`;
        ctx.lineWidth = onCP ? 2.5 : 1.2;
        ctx.setLineDash([dashLen, gapLen]);
        ctx.lineDashOffset = dashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // Progress wave particles along proven→non-proven edges
        if (fromProven && !toProven) {
          const numParticles = 3;
          for (let i = 0; i < numParticles; i++) {
            const phase = ((elapsed * 0.5) + i / numParticles) % 1.0;
            const px = from.x + dx * phase;
            const py = from.y + dy * phase;
            const particleAlpha = Math.sin(phase * Math.PI) * 0.8;
            const particleR = onCP ? 3 : 2;

            ctx.beginPath();
            ctx.arc(px, py, particleR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,158,11,${particleAlpha})`;
            ctx.fill();
          }
        }

        // Green ripple along fully proven edges
        if (fromProven && toProven) {
          const ripplePhase = ((elapsed * 0.3) % 1.0);
          const rpx = from.x + dx * ripplePhase;
          const rpy = from.y + dy * ripplePhase;
          const rippleAlpha = Math.sin(ripplePhase * Math.PI) * 0.5;

          ctx.beginPath();
          ctx.arc(rpx, rpy, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16,185,129,${rippleAlpha})`;
          ctx.fill();
        }

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
        ctx.fillStyle = `rgba(${edgeColor},${edgeAlpha + 0.1})`;
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

      // ── Draw nodes with status-based glow ─────────────────────────────
      for (const sec of PROOF_SECTIONS) {
        const pos = getCanvasPos(sec.id, w, h);
        const r = nodeRadius(sec.id, w);
        const color = STATUS_COLORS[sec.status];
        const isHovered = hovered === sec.id;
        const isBest = bestStep === sec.id;
        const glowInfo = STATUS_GLOW[sec.status];
        const [gr, gg, gb] = glowInfo.color;

        // Status-based outer glow (pulsing)
        const glowPulse = 0.15 + 0.12 * Math.sin(elapsed * 1.8 + TRACTABILITY[sec.id] * 5);
        const glowRadius = r + 8 + 3 * Math.sin(elapsed * 1.5 + TRACTABILITY[sec.id] * 3);

        // Outer glow ring
        const glowGrad = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, glowRadius + 6);
        glowGrad.addColorStop(0, `rgba(${gr},${gg},${gb},${glowPulse})`);
        glowGrad.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius + 6, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Progress wave ripple — emanates outward from proven nodes
        if (sec.status === 'proven') {
          const wavePhase = (elapsed * 0.6 + TRACTABILITY[sec.id] * 2) % 2.0;
          if (wavePhase < 1.5) {
            const waveR = r + wavePhase * 25;
            const waveAlpha = Math.max(0, 0.3 * (1 - wavePhase / 1.5));
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, waveR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(16,185,129,${waveAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Animated "next best step" indicator — spinning ring + pulsing glow
        if (isBest) {
          // Pulsing outer ring
          const pulseR = r + 8 + 5 * Math.sin(elapsed * 2.5);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99,102,241,${0.3 + 0.2 * Math.sin(elapsed * 2.5)})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Spinning arc indicator
          const spinAngle = elapsed * 3;
          const arcLen = Math.PI * 0.6;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR + 4, spinAngle, spinAngle + arcLen);
          ctx.strokeStyle = `rgba(129,140,248,${0.6 + 0.3 * Math.sin(elapsed * 4)})`;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.lineCap = 'butt';

          // Second spinning arc (opposite side)
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR + 4, spinAngle + Math.PI, spinAngle + Math.PI + arcLen);
          ctx.strokeStyle = `rgba(129,140,248,${0.4 + 0.2 * Math.sin(elapsed * 4 + 1)})`;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.lineCap = 'butt';

          // Small diamond marker at top of spin
          const dmX = pos.x + Math.cos(spinAngle) * (pulseR + 4);
          const dmY = pos.y + Math.sin(spinAngle) * (pulseR + 4);
          ctx.beginPath();
          ctx.moveTo(dmX, dmY - 3);
          ctx.lineTo(dmX + 3, dmY);
          ctx.lineTo(dmX, dmY + 3);
          ctx.lineTo(dmX - 3, dmY);
          ctx.closePath();
          ctx.fillStyle = 'rgba(165,180,252,0.9)';
          ctx.fill();
        }

        // Critical path glow
        if (isOnCriticalPath(sec.id) && !isBest) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(99,102,241,0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node fill with smooth status-based gradient
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, 0, pos.x, pos.y, r);
        // Pulsing brightness for non-proven nodes
        const brightPulse = sec.status === 'proven' ? 'cc' :
          (Math.sin(elapsed * 2 + TRACTABILITY[sec.id] * 4) > 0 ? 'bb' : '99');
        grad.addColorStop(0, color + brightPulse);
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
      let lx = 12, ly = h - 76;
      for (const [status, color] of Object.entries(STATUS_COLORS)) {
        // Pulsing legend dots to match node glow
        const legendPulse = 0.7 + 0.3 * Math.sin(elapsed * 1.8);
        ctx.beginPath();
        ctx.arc(lx + 6, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        // Mini glow on legend dot
        const lgGrad = ctx.createRadialGradient(lx + 6, ly, 3, lx + 6, ly, 8);
        lgGrad.addColorStop(0, color + '44');
        lgGrad.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.arc(lx + 6, ly, 8, 0, Math.PI * 2);
        ctx.fillStyle = lgGrad;
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(STATUS_LABELS[status], lx + 16, ly);
        ly += 16;
      }
      // Extra legend entries for animations
      ly += 4;
      ctx.fillStyle = 'rgba(245,158,11,0.7)';
      ctx.fillText('\u2192 flowing = proof progress', lx + 4, ly);
      ly += 14;
      ctx.fillStyle = 'rgba(129,140,248,0.7)';
      ctx.fillText('\u25C7 spinning = next best step', lx + 4, ly);

      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [hovered, edges, bestStep, progressDepth, getCanvasPos, nodeRadius]);

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
