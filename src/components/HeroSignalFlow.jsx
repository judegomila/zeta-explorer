import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Animated signal flow through the twin ladder system.
 * Fixed-size layout — controls don't cause reflow.
 *
 * Shows: primes → direct ladder → bridge χ(s) → dual ladder
 * with signals propagating and reflecting at σ = ½.
 */

const PRIMES = [2, 3, 5, 7, 11, 13];
const PRIME_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

export default function HeroSignalFlow() {
  const canvasRef = useRef();
  const animRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [numPrimes, setNumPrimes] = useState(4);
  const [speed, setSpeed] = useState(1);
  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  const draw = useCallback((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const needW = w * dpr;
    const needH = h * dpr;
    // Only reallocate canvas buffer when dimensions actually change —
    // setting width/height every frame forces expensive GPU reallocation
    if (canvas.width !== needW || canvas.height !== needH) {
      canvas.width = needW;
      canvas.height = needH;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const t = time * 0.001 * speed;

    // Background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);

    // Layout constants — all relative to canvas size, never shift
    const margin = 24;
    const ladderY1 = 50;      // direct ladder center
    const ladderY2 = h - 50;  // dual ladder center
    const bridgeX = w - 120;  // bridge position (fixed)
    const ladderStartX = margin + 60;
    const ladderEndX = bridgeX - 40;
    const bridgeCY = h / 2;
    const stageW = Math.min(60, (ladderEndX - ladderStartX) / numPrimes - 8);
    const stageGap = ((ladderEndX - ladderStartX) - numPrimes * stageW) / Math.max(numPrimes - 1, 1);

    // ─── Grid lines (subtle) ───
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let x = margin; x < w - margin; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 20);
      ctx.stroke();
    }

    // ─── Critical line (σ = ½) vertical reference ───
    const critX = bridgeX;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(critX, 10);
    ctx.lineTo(critX, h - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('σ = ½', critX, 14);

    // ─── Labels ───
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('DIRECT  ζ(s)', margin, ladderY1 - 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('DUAL  ζ(1−s)', margin, ladderY2 - 20);

    // ─── Draw prime stages (DIRECT ladder) ───
    const primes = PRIMES.slice(0, numPrimes);

    // Top wire
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ladderStartX, ladderY1);
    ctx.lineTo(ladderEndX, ladderY1);
    ctx.stroke();

    // Bottom wire
    ctx.beginPath();
    ctx.moveTo(ladderStartX, ladderY2);
    ctx.lineTo(ladderEndX, ladderY2);
    ctx.stroke();

    primes.forEach((p, i) => {
      const x = ladderStartX + i * (stageW + stageGap);
      const col = PRIME_COLORS[i];

      // ── Direct ladder stage ──
      drawStage(ctx, x, ladderY1, stageW, p, col, t, sigma, 'direct');

      // ── Dual ladder stage ──
      drawStage(ctx, x, ladderY2, stageW, p, col, t, sigma, 'dual');

      // ── Coupling line between direct and dual ──
      const cx = x + stageW / 2;
      const couplingAlpha = 0.15 + 0.15 * Math.sin(t * 2 + i);
      ctx.strokeStyle = `rgba(16, 185, 129, ${couplingAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, ladderY1 + 22);
      ctx.lineTo(cx, ladderY2 - 22);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // ─── Signal particles (direct ladder) ───
    drawSignalParticles(ctx, ladderStartX, ladderEndX, ladderY1, t, primes, sigma, '#3b82f6');

    // ─── Signal particles (dual ladder) ───
    drawSignalParticles(ctx, ladderStartX, ladderEndX, ladderY2, t + 1.5, primes, sigma, '#f59e0b');

    // ─── Bridge ───
    drawBridge(ctx, bridgeX - 20, bridgeCY, 80, ladderY2 - ladderY1 - 40, t, sigma);

    // ─── Connection lines from ladders to bridge ───
    ctx.strokeStyle = '#3b82f680';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ladderEndX, ladderY1);
    ctx.lineTo(bridgeX - 20, bridgeCY - 40);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b80';
    ctx.beginPath();
    ctx.moveTo(ladderEndX, ladderY2);
    ctx.lineTo(bridgeX - 20, bridgeCY + 40);
    ctx.stroke();

    // ─── Output ───
    const outX = bridgeX + 65;
    ctx.fillStyle = '#10b981';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    // Pulsing output indicator
    const pulse = 0.6 + 0.4 * Math.sin(t * 3);
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(outX + 4, bridgeCY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#6ee7b7';
    ctx.fillText('ζ zeros', outX + 14, bridgeCY - 6);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('on σ = ½', outX + 14, bridgeCY + 10);

    // ─── Equilibrium state indicator (fixed position, no layout shift) ───
    const eqText = sigma === 0.5 ? 'EQUILIBRIUM' :
                   sigma < 0.5 ? 'SUB-CRITICAL' : 'SUPER-CRITICAL';
    const eqColor = sigma === 0.5 ? '#10b981' :
                    Math.abs(sigma - 0.5) < 0.1 ? '#f59e0b' : '#ef4444';

    // Fixed-width box so text changes don't reflow
    const eqBoxW = 140;
    const eqBoxX = w / 2 - eqBoxW / 2;
    ctx.fillStyle = eqColor + '15';
    ctx.strokeStyle = eqColor + '40';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(eqBoxX, h / 2 - 12, eqBoxW, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = eqColor;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(eqText, w / 2, h / 2 + 3);

    // σ value (fixed position below box)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`σ = ${sigma.toFixed(2)}`, w / 2, h / 2 + 22);

    animRef.current = requestAnimationFrame(draw);
  }, [sigma, numPrimes, speed]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 260,
          borderRadius: 12,
          border: '1px solid #1e293b',
        }}
      />
      {/* Controls: fixed height, no layout shift */}
      <div style={{
        display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap',
        minHeight: 36, alignItems: 'center',
      }}>
        <div className="control-group" style={{ flex: '1 1 120px' }}>
          <label style={{ color: sigmaColor, fontWeight: 600 }}>σ = Re(s)</label>
          <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ flex: 1, accentColor: sigmaColor }} />
          <span className="control-value" style={{ minWidth: 32, color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group" style={{ flex: '1 1 100px' }}>
          <label>Primes</label>
          <input type="range" min="2" max="6" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value" style={{ minWidth: 16 }}>{numPrimes}</span>
        </div>
        <div className="control-group" style={{ flex: '1 1 100px' }}>
          <label>Speed</label>
          <input type="range" min="0.2" max="3" step="0.1" value={speed}
            onChange={e => setSpeed(+e.target.value)} />
          <span className="control-value" style={{ minWidth: 24 }}>{speed.toFixed(1)}×</span>
        </div>
      </div>
    </div>
  );
}


// ─── Helper drawing functions ────────────────────────────────────────────────

function drawStage(ctx, x, y, w, prime, color, t, sigma, type) {
  const h = 36;

  // Stage background
  ctx.fillStyle = color + '0a';
  ctx.strokeStyle = color + '40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y - h / 2, w, h, 5);
  ctx.fill();
  ctx.stroke();

  // Mini inductor squiggle
  const squigY = y - 4;
  ctx.strokeStyle = color + '80';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const sx = x + 6 + i * 10;
    ctx.moveTo(sx, squigY);
    ctx.quadraticCurveTo(sx + 3, squigY - 7, sx + 5, squigY);
    ctx.quadraticCurveTo(sx + 7, squigY + 7, sx + 10, squigY);
  }
  ctx.stroke();

  // Capacitor plates
  const capX = x + w - 14;
  ctx.strokeStyle = type === 'direct' ? '#3b82f660' : '#f59e0b60';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(capX, y - 6);
  ctx.lineTo(capX, y + 6);
  ctx.moveTo(capX + 4, y - 6);
  ctx.lineTo(capX + 4, y + 6);
  ctx.stroke();

  // Prime number
  ctx.fillStyle = color;
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(prime.toString(), x + w / 2, y + h / 2 + 14);

  // Amplitude indicator (responds to sigma)
  const amp = type === 'direct'
    ? 1 / (1 + Math.pow(prime, -sigma))
    : 1 / (1 + Math.pow(prime, -(1 - sigma)));
  const barW = (w - 8) * amp;
  ctx.fillStyle = color + '30';
  ctx.fillRect(x + 4, y + h / 2 - 5, barW, 3);
}

function drawSignalParticles(ctx, startX, endX, y, t, primes, sigma, color) {
  const range = endX - startX;

  for (let i = 0; i < 8; i++) {
    const phase = (t * 0.5 + i * 0.125) % 1;
    const x = startX + phase * range;

    // Particle amplitude depends on sigma and position
    const stageIdx = Math.floor(phase * primes.length);
    const p = primes[Math.min(stageIdx, primes.length - 1)];
    const amp = Math.exp(-Math.abs(sigma - 0.5) * Math.log(p));

    const radius = 2 + amp * 3;
    const alpha = 0.3 + amp * 0.5;

    // Glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
    grad.addColorStop(0, color.slice(0, 7) + Math.round(alpha * 255).toString(16).padStart(2, '0'));
    grad.addColorStop(1, color.slice(0, 7) + '00');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawBridge(ctx, x, cy, w, h, t, sigma) {
  // Unitarity: |χ| = 1 at σ = ½
  const unitarity = 1 - 2 * Math.abs(sigma - 0.5);
  const bridgeColor = unitarity > 0.9 ? '#10b981' :
                      unitarity > 0.5 ? '#f59e0b' : '#ef4444';

  // Bridge box
  ctx.fillStyle = bridgeColor + '0c';
  ctx.strokeStyle = bridgeColor + '60';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, cy - h / 2, w, h, 10);
  ctx.fill();
  ctx.stroke();

  // Pulsing glow when near equilibrium
  if (unitarity > 0.8) {
    const glowAlpha = (0.05 + 0.05 * Math.sin(t * 4)) * unitarity;
    ctx.fillStyle = `rgba(16, 185, 129, ${glowAlpha})`;
    ctx.beginPath();
    ctx.roundRect(x - 4, cy - h / 2 - 4, w + 8, h + 8, 14);
    ctx.fill();
  }

  // Coupling symbol — two interleaved curves
  const cx = x + w / 2;
  ctx.strokeStyle = '#3b82f680';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy - 20);
  ctx.bezierCurveTo(cx - 15, cy - 20, cx, cy - 5, cx, cy);
  ctx.bezierCurveTo(cx, cy + 5, cx - 15, cy + 20, cx - 15, cy + 20);
  ctx.moveTo(cx + 15, cy - 20);
  ctx.bezierCurveTo(cx + 15, cy - 20, cx, cy - 5, cx, cy);
  ctx.bezierCurveTo(cx, cy + 5, cx + 15, cy + 20, cx + 15, cy + 20);
  ctx.stroke();

  // Labels
  ctx.fillStyle = bridgeColor;
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('χ(s)', cx, cy - h / 2 + 16);

  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText(`|χ| = ${unitarity.toFixed(2)}`, cx, cy + h / 2 - 8);

  // "BRIDGE" label
  ctx.fillStyle = bridgeColor + '80';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillText('BRIDGE', cx, cy - h / 2 - 6);
}
