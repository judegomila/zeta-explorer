import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Animated signal flow through the twin ladder system.
 * Fixed-size layout — controls don't cause reflow.
 *
 * Topology: direct and dual ladders run in parallel, coupled at EVERY prime
 * through a bridge node χ_p. Energy flows vertically between ladders through
 * the bridge at each stage. At σ=½ the coupling is lossless (|χ|=1);
 * away from ½, energy is partially reflected back.
 */

const PRIMES = [2, 3, 5, 7, 11, 13];
const PRIME_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

// Reusable gain buffer — avoids allocating a new array every drawLadderSignals call
const _gainBuf = new Array(PRIMES.length);

// Precomputed per-prime constants — avoids recomputing transcendentals per frame
const PRIME_LOG = PRIMES.map(p => Math.log(p));
const PRIME_FREQ = PRIME_LOG.map(lp => 2 * Math.PI / lp);

// Precomputed bridge labels — avoids per-frame regex/string work
const BRIDGE_LABELS = PRIMES.map(p => {
  const sub = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉' };
  return 'χ' + String(p).replace(/\d/g, d => sub[d]);
});

export default function HeroSignalFlow() {
  const canvasRef = useRef();
  const animRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [numPrimes, setNumPrimes] = useState(4);
  const [speed, setSpeed] = useState(1);
  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  // Store frequently-changing values in refs so the draw callback stays stable
  // and the rAF loop isn't cancelled/restarted on every slider tick.
  const stateRef = useRef({ sigma: 0.5, numPrimes: 4, speed: 1 });
  stateRef.current.sigma = sigma;
  stateRef.current.numPrimes = numPrimes;
  stateRef.current.speed = speed;

  // Accumulated animation time — caps per-frame delta to prevent jumps on tab switch
  const timeRef = useRef({ lastRAF: 0, accumulated: 0 });
  const runningRef = useRef(true);

  const draw = useCallback((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { sigma: sig, numPrimes: np, speed: spd } = stateRef.current;

    // Compute capped delta to avoid teleporting after tab switch
    const tr = timeRef.current;
    const rawDelta = tr.lastRAF === 0 ? 16 : time - tr.lastRAF;
    const cappedDelta = Math.min(rawDelta, 100); // max ~100ms = 6 frames
    tr.lastRAF = time;
    tr.accumulated += cappedDelta * 0.001 * spd;
    const t = tr.accumulated;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    // Skip frame if canvas hasn't been laid out yet (avoids degenerate math)
    if (w === 0 || h === 0) {
      if (runningRef.current) animRef.current = requestAnimationFrame(draw);
      return;
    }
    const needW = w * dpr;
    const needH = h * dpr;
    if (canvas.width !== needW || canvas.height !== needH) {
      canvas.width = needW;
      canvas.height = needH;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);

    // Layout: two horizontal ladders with bridge coupling between them at each prime
    const margin = 20;
    const dirY = 52;           // direct ladder y-center
    const dualY = h - 52;      // dual ladder y-center
    const midY = h / 2;        // bridge coupling zone
    const ladderStartX = margin + 50;
    const ladderEndX = w - margin - 30;
    const sigma = sig;
    const numPrimes = np;
    const sigmaDeviation = Math.abs(sigma - 0.5);
    const stageW = Math.min(70, (ladderEndX - ladderStartX) / numPrimes - 12);
    const totalLadderW = numPrimes * stageW + (numPrimes - 1) * 12;
    const offsetX = ladderStartX + ((ladderEndX - ladderStartX) - totalLadderW) / 2;

    // Unitarity at current sigma
    const unitarity = Math.max(0, 1 - 2 * sigmaDeviation);

    // ─── Subtle grid (single batched path) ───
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let gx = margin; gx < w - margin; gx += 50) {
      ctx.moveTo(gx, 20);
      ctx.lineTo(gx, h - 20);
    }
    ctx.stroke();

    // ─── Ladder labels ───
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('DIRECT  ζ(s)', margin, dirY - 22);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('DUAL  ζ(1−s)', margin, dualY + 32);

    // ─── Horizontal wires — glow with signal energy ───
    // Base wire in dark gray, then overlay a colored glow proportional to unitarity
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(offsetX - 10, dirY);
    ctx.lineTo(offsetX + totalLadderW + 10, dirY);
    ctx.moveTo(offsetX - 10, dualY);
    ctx.lineTo(offsetX + totalLadderW + 10, dualY);
    ctx.stroke();
    // Signal energy overlay — blue for direct, gold for dual
    const wireGlow = 0.04 + 0.12 * unitarity;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(59, 130, 246, ${wireGlow})`;
    ctx.beginPath();
    ctx.moveTo(offsetX - 10, dirY);
    ctx.lineTo(offsetX + totalLadderW + 10, dirY);
    ctx.stroke();
    ctx.strokeStyle = `rgba(245, 158, 11, ${wireGlow})`;
    ctx.beginPath();
    ctx.moveTo(offsetX - 10, dualY);
    ctx.lineTo(offsetX + totalLadderW + 10, dualY);
    ctx.stroke();

    // ─── Input signal arrows (left end of each ladder) ───
    const arrowX = offsetX - 16;
    const arrowPulse = 0.4 + 0.3 * unitarity + 0.15 * Math.sin(t * 2.5);
    // Direct input arrow (blue)
    ctx.fillStyle = `rgba(59, 130, 246, ${arrowPulse})`;
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, dirY - 4);
    ctx.lineTo(arrowX, dirY);
    ctx.lineTo(arrowX - 6, dirY + 4);
    ctx.fill();
    // Dual input arrow (gold)
    ctx.fillStyle = `rgba(245, 158, 11, ${arrowPulse})`;
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, dualY - 4);
    ctx.lineTo(arrowX, dualY);
    ctx.lineTo(arrowX - 6, dualY + 4);
    ctx.fill();

    // ─── Continuation dots ───
    ctx.fillStyle = '#475569';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('···', offsetX + totalLadderW + 14, dirY + 5);
    ctx.fillText('···', offsetX + totalLadderW + 14, dualY + 5);

    // ─── Coupling lines (batched single path for all primes) ───
    // Dash flow direction encodes net energy transfer:
    //   σ > ½ → direct is "hotter", net flow downward (direct → dual)
    //   σ < ½ → dual is "hotter", net flow upward (dual → direct)
    //   σ = ½ → no net flow, dashes stationary (lossless equilibrium)
    const bridgeR = 14;
    const bridgeAlpha = 0.5 + 0.3 * unitarity;
    // Precompute bridge color strings reused for every prime
    const bridgeStroke = `rgba(16, 185, 129, ${bridgeAlpha})`;
    const bridgeFill = `rgba(16, 185, 129, ${(0.04 + 0.10 * unitarity).toFixed(3)})`;
    const dashLen = 5;
    const dashGap = 4;
    const mismatchSign = sigma > 0.5 ? -1 : 1;
    const mismatchMag = 2 * sigmaDeviation;
    const dashOffset = (t * 30 * mismatchMag * mismatchSign) % (dashLen + dashGap);

    ctx.strokeStyle = `rgba(16, 185, 129, ${bridgeAlpha * 0.6})`;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([dashLen, dashGap]);
    ctx.lineDashOffset = dashOffset;
    ctx.beginPath();
    for (let i = 0; i < numPrimes; i++) {
      const cx = offsetX + i * (stageW + 12) + stageW / 2;
      ctx.moveTo(cx, dirY + 20);
      ctx.lineTo(cx, midY - bridgeR - 2);
      ctx.moveTo(cx, midY + bridgeR + 2);
      ctx.lineTo(cx, dualY - 20);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    // ─── Draw each prime stage + bridge coupling ───
    for (let i = 0; i < numPrimes; i++) {
      const p = PRIMES[i];
      const x = offsetX + i * (stageW + 12);
      const cx = x + stageW / 2;
      const col = PRIME_COLORS[i];
      const logP = PRIME_LOG[i];

      // === Direct stage (top) ===
      drawLCStage(ctx, x, dirY, stageW, p, col, 'direct', t, sigma, logP);

      // === Dual stage (bottom) ===
      drawLCStage(ctx, x, dualY, stageW, p, col, 'dual', t, sigma, logP);

      // === Bridge coupling node χ_p (center) ===
      // Bridge node circle — smooth glow and breathing that scale with unitarity
      const breathe = Math.sin(t * 2.5 + i * 1.2);  // subtle oscillation per prime
      const breatheR = bridgeR + 1.5 * unitarity * breathe; // ±1.5px at full unitarity
      const glowPulse = 0.03 + unitarity * (0.12 + 0.08 * breathe); // smooth 0.03→0.23
      ctx.fillStyle = `rgba(16, 185, 129, ${glowPulse})`;
      ctx.beginPath();
      ctx.arc(cx, midY, breatheR + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bridgeFill;
      ctx.strokeStyle = bridgeStroke;
      ctx.lineWidth = 1.2 + 0.6 * unitarity; // thicker stroke when coupled
      ctx.beginPath();
      ctx.arc(cx, midY, breatheR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // χ_p label
      ctx.fillStyle = bridgeStroke; // same color as bridge outline
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(BRIDGE_LABELS[i], cx, midY + 4);

      // === Energy particles flowing through bridge ===
      drawBridgeEnergy(ctx, cx, dirY + 20, dualY - 20, midY, t, i, p, sigma, unitarity, logP);
    }

    // ─── Horizontal coupling bus (connecting all χ_p) ───
    // Animated dashes propagate left-to-right, speed ∝ unitarity:
    // at equilibrium the coupling is fully active; off-critical it weakens.
    if (numPrimes > 1) {
      const busX1 = offsetX + stageW / 2;
      const busX2 = offsetX + (numPrimes - 1) * (stageW + 12) + stageW / 2;
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 + 0.15 * unitarity})`;
      ctx.lineWidth = 0.8 + 0.6 * unitarity;
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -(t * 20 * unitarity) % 7;
      ctx.beginPath();
      ctx.moveTo(busX1, midY);
      ctx.lineTo(busX2, midY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }

    // ─── Functional equation label ───
    ctx.fillStyle = '#8b5cf680';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ξ(s) = ξ(1−s) — distributed coupling at every prime', w / 2, midY + 28);

    // ─── Equilibrium indicator (fixed-width box) ───
    const eqText = sigmaDeviation < 0.02 ? 'EQUILIBRIUM — LOSSLESS' :
                   sigma < 0.5 ? 'SUB-CRITICAL — ENERGY LEAKS' : 'SUPER-CRITICAL — ENERGY LEAKS';
    // Smooth color interpolation: green(16,185,129) → yellow(245,158,11) → red(239,68,68)
    // based on sigmaDeviation as continuous 0 → 0.4 range
    const devNorm = Math.min(sigmaDeviation / 0.4, 1); // 0 at equilibrium, 1 at extremes
    let eqR, eqG, eqB;
    if (devNorm < 0.5) {
      const f = devNorm * 2; // 0→1 over green→yellow
      eqR = 16 + (245 - 16) * f;
      eqG = 185 + (158 - 185) * f;
      eqB = 129 + (11 - 129) * f;
    } else {
      const f = (devNorm - 0.5) * 2; // 0→1 over yellow→red
      eqR = 245 + (239 - 245) * f;
      eqG = 158 + (68 - 158) * f;
      eqB = 11 + (68 - 11) * f;
    }
    const eqColorStr = `rgb(${eqR | 0}, ${eqG | 0}, ${eqB | 0})`;

    const eqBoxW = 240;
    const eqBoxX = w / 2 - eqBoxW / 2;
    const eqBoxY = midY + 36;
    ctx.fillStyle = `rgba(${eqR | 0}, ${eqG | 0}, ${eqB | 0}, 0.06)`;
    ctx.strokeStyle = `rgba(${eqR | 0}, ${eqG | 0}, ${eqB | 0}, 0.19)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(eqBoxX, eqBoxY, eqBoxW, 22, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = eqColorStr;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(eqText, w / 2, eqBoxY + 15);

    // ─── |χ| value — color matches equilibrium indicator ───
    ctx.fillStyle = `rgba(${eqR | 0}, ${eqG | 0}, ${eqB | 0}, 0.6)`;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`|χ| = ${unitarity.toFixed(2)}   σ = ${sigma.toFixed(2)}`, w / 2, eqBoxY + 34);

    // ─── Signal particles along ladders (horizontal propagation) ───
    drawLadderSignals(ctx, offsetX, totalLadderW, dirY, t, numPrimes, sigma, '#3b82f6', 'direct');
    drawLadderSignals(ctx, offsetX, totalLadderW, dualY, t, numPrimes, sigma, '#f59e0b', 'dual');

    if (runningRef.current) {
      animRef.current = requestAnimationFrame(draw);
    }
  }, []); // stable — reads state from stateRef, no deps to trigger recreation

  useEffect(() => {
    runningRef.current = true;
    animRef.current = requestAnimationFrame(draw);
    return () => {
      runningRef.current = false; // prevents draw from self-scheduling after cleanup
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Twin ladder signal flow animation: ${numPrimes} prime oscillators coupled through bridge nodes. σ = ${sigma.toFixed(2)}, |χ| = ${(Math.max(0, 1 - 2 * Math.abs(sigma - 0.5))).toFixed(2)}. Double-click to reset to equilibrium.`}
        onDoubleClick={() => setSigma(0.5)}
        title="Double-click to reset σ to ½"
        style={{
          width: '100%',
          height: 280,
          borderRadius: 12,
          border: '1px solid #1e293b',
          cursor: 'pointer',
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
            list="sigma-ticks"
            onChange={e => setSigma(+e.target.value)}
            style={{ flex: 1, accentColor: sigmaColor }} />
          <datalist id="sigma-ticks">
            <option value="0.5" label="½" />
          </datalist>
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


// ─── LC Stage drawing ────────────────────────────────────────────────────────

function drawLCStage(ctx, x, y, w, prime, color, type, t, sigma, logP) {
  const h = 34;
  const sig = type === 'direct' ? sigma : 1 - sigma;
  // |H_p(σ)| = 1/|1 - p^{-σ}|  — local transfer function magnitude
  const gain = 1 / Math.max(0.05, Math.abs(1 - Math.pow(prime, -sig)));
  // Normalize to 0–1 range (gain is ~1.4 at σ=½ for p=2, grows near σ=0 or 1)
  const normalizedGain = Math.min(gain / 4, 1);

  // Stage box — background brightness responds to gain
  ctx.fillStyle = color + (normalizedGain > 0.5 ? '12' : '08');
  ctx.strokeStyle = color + '35';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y - h / 2, w, h, 5);
  ctx.fill();
  ctx.stroke();

  // Animated energy bar along the bottom of the stage box
  const barH = 3;
  const barY = y + h / 2 - barH - 2;
  const barMaxW = w - 6;
  // Pulse at a frequency proportional to log(p) — each prime has its own rhythm
  const pulse = 0.85 + 0.15 * Math.sin(t * 2 * logP);
  const barW = barMaxW * normalizedGain * pulse;
  ctx.fillStyle = color + '40';
  ctx.fillRect(x + 3, barY, barMaxW, barH); // background track
  ctx.fillStyle = color + 'a0';
  ctx.beginPath();
  ctx.roundRect(x + 3, barY, barW, barH, 1.5);
  ctx.fill();

  // LC energy oscillation: inductor and capacitor brightness pulse 90° apart
  // at the prime's resonant frequency ω = 2π/log(p)
  const omega = 2 * Math.PI / logP;
  const lcPhase = t * omega;
  const inductorEnergy = 0.5 + 0.5 * Math.sin(lcPhase);       // peaks when B-field max
  const capacitorEnergy = 0.5 + 0.5 * Math.cos(lcPhase);      // 90° ahead (E-field max)

  // Circuit elements: dual ladder swaps L↔C (impedance inversion duality)
  // Direct: inductor(series) left, capacitor(shunt) right
  // Dual:   capacitor(shunt) left, inductor(series) right
  const squigY = y - 5;
  const lBase = type === 'direct' ? '#60a5fa' : '#fbbf24';
  const lAlpha = Math.round(0x40 + 0x50 * inductorEnergy * normalizedGain).toString(16);
  const squigX = type === 'direct' ? x + 5 : x + w - 35;
  ctx.strokeStyle = lBase + lAlpha;
  ctx.lineWidth = 1.0 + 0.4 * inductorEnergy * normalizedGain;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const sx = squigX + i * 10;
    ctx.moveTo(sx, squigY);
    ctx.quadraticCurveTo(sx + 3, squigY - 6, sx + 5, squigY);
    ctx.quadraticCurveTo(sx + 7, squigY + 6, sx + 10, squigY);
  }
  ctx.stroke();

  // Capacitor plates — swapped position for dual
  const capX = type === 'direct' ? x + w - 14 : x + 6;
  const cBase = type === 'direct' ? '#f59e0b' : '#3b82f6';
  const cAlpha = Math.round(0x30 + 0x50 * capacitorEnergy * normalizedGain).toString(16);
  ctx.strokeStyle = cBase + cAlpha;
  ctx.lineWidth = 1.4 + 0.6 * capacitorEnergy * normalizedGain;
  ctx.beginPath();
  ctx.moveTo(capX, y - 7);
  ctx.lineTo(capX, y + 3);
  ctx.moveTo(capX + 4, y - 7);
  ctx.lineTo(capX + 4, y + 3);
  ctx.stroke();

  // Prime label
  ctx.fillStyle = color;
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  const labelY = type === 'direct' ? y + h / 2 + 13 : y - h / 2 - 5;
  ctx.fillText(prime.toString(), x + w / 2, labelY);

  // Impedance value Z₀ = log(p) — hide when stage is too narrow to avoid overlap
  if (w >= 50) {
    ctx.fillStyle = color + '60';
    ctx.font = '7px "JetBrains Mono", monospace';
    const zLabelY = type === 'direct' ? y + h / 2 + 22 : y - h / 2 - 14;
    ctx.fillText(`Z₀=${logP.toFixed(2)}`, x + w / 2, zLabelY);
  }
}


// ─── Bridge energy particles (vertical flow between ladders) ─────────────────

function drawBridgeEnergy(ctx, cx, topY, botY, midY, t, stageIdx, prime, sigma, unitarity, logP) {
  // At σ=½, energy flows freely BOTH ways (lossless bidirectional coupling).
  // Away from ½, partial reflection at the bridge node.
  const transmission = unitarity;
  const reflection = 1 - transmission;

  // Phase offset per prime so particles don't all move in sync
  const primePhase = stageIdx * 0.618; // golden ratio offset

  // ─── Standing wave pattern on coupling lines ───
  // At equilibrium, counter-propagating waves create a standing wave
  // spanning the full topY → botY coupling path (skipping the bridge node gap).
  // Each prime resonates at ω₀ = 2π/log(p): p=2 slowest, larger primes faster.
  // Spatial wavenumber scales with log(p) so larger primes show more nodes.
  const wavePoints = 28;
  const span = botY - topY;
  if (transmission > 0.3) {
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 + 0.12 * transmission})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const omega = 2 * Math.PI / logP; // natural frequency — unique per prime
    const spatialK = 1 + logP * 0.6;  // wavenumber — more nodes for larger primes
    const temporal = Math.cos(t * omega + primePhase); // loop-invariant
    const waveScale = temporal * 5 * transmission;
    const bridgeGap = 16; // half-width of gap around bridge node
    for (let j = 0; j <= wavePoints; j++) {
      const frac = j / wavePoints;
      const py = topY + frac * span;
      // Skip the bridge node gap to avoid overdraw
      if (Math.abs(py - midY) < bridgeGap) {
        if (j > 0) ctx.moveTo(cx, py); // break the path
        continue;
      }
      // Standing wave: sin(k·x)·cos(ω·t) — antinode at bridge center
      const wave = Math.sin(frac * Math.PI * spatialK) * waveScale;
      j === 0 ? ctx.moveTo(cx + wave, py) : ctx.lineTo(cx + wave, py);
    }
    ctx.stroke();
  }

  // ─── Downward particles (direct → bridge → dual) ───
  const halfSpan = (botY - topY) / 2;
  for (let k = 0; k < 3; k++) {
    const phase = ((t * 0.7 + k * 0.33 + primePhase) % 1);
    const py = topY + phase * (botY - topY);
    drawEnergyDot(ctx, cx, py, midY, transmission, phase, 'down', halfSpan);
  }

  // ─── Upward particles (dual → bridge → direct) — bidirectional! ───
  for (let k = 0; k < 3; k++) {
    const phase = ((t * 0.7 + k * 0.33 + primePhase + 0.5) % 1);
    const py = botY - phase * (botY - topY);
    drawEnergyDot(ctx, cx, py, midY, transmission, phase, 'up', halfSpan);
  }

  // ─── Reflected particles — smooth fade-in, scattering spread, distance decay ───
  if (reflection > 0.02) {
    // Reflected from bridge back toward direct (bounced down-going particles)
    for (let k = 0; k < 2; k++) {
      const phase = ((t * 0.5 + k * 0.5 + primePhase + 0.25) % 1);
      const py = midY - phase * (midY - topY);
      // Spread widens with distance from bridge (scattering cone)
      const spread = phase * 6 * reflection;
      // Alpha decays with distance and scales smoothly with reflection
      const alpha = reflection * (0.2 + 0.3 * (1 - phase));
      const radius = 1 + 1.5 * reflection * (1 - phase * 0.5);
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx - spread, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    // Reflected from bridge back toward dual (bounced up-going particles)
    for (let k = 0; k < 2; k++) {
      const phase = ((t * 0.5 + k * 0.5 + primePhase + 0.75) % 1);
      const py = midY + phase * (botY - midY);
      const spread = phase * 6 * reflection;
      const alpha = reflection * (0.2 + 0.3 * (1 - phase));
      const radius = 1 + 1.5 * reflection * (1 - phase * 0.5);
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx + spread, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Draw a single energy dot with smooth color interpolation and glow at bridge */
function drawEnergyDot(ctx, cx, py, midY, transmission, phase, direction, halfSpan) {
  // Normalized position: 0 = source ladder, 0.5 = bridge, 1 = destination ladder
  // Use this for smooth color/size interpolation instead of hard zones
  const distFromBridge = Math.abs(py - midY);
  const bridgeProximity = Math.max(0, 1 - distFromBridge / halfSpan); // 1 at bridge, 0 far away

  // Smooth alpha and radius: peaks at bridge, proportional to transmission
  const alpha = 0.12 + 0.25 * transmission + 0.4 * bridgeProximity * transmission;
  const radius = 1.5 + 1.5 * bridgeProximity * (1 + 2 * transmission);

  // Smooth 3-way color blend: source → green(bridge) → destination
  // source = blue(59,130,246) for down, gold(245,158,11) for up
  // bridge = green(16,185,129)
  // destination = gold for down, blue for up
  const isDown = direction === 'down'; // single comparison for all branches
  const srcR = isDown ? 59 : 245;
  const srcG = isDown ? 130 : 158;
  const srcB = isDown ? 246 : 11;
  const dstR = isDown ? 245 : 59;
  const dstG = isDown ? 158 : 130;
  const dstB = isDown ? 11 : 246;
  const midR = 16, midG = 185, midB = 129; // bridge green

  // Determine blend factor: how far along the path from source to destination
  let pathFrac; // 0 = at source ladder, 0.5 = at bridge, 1 = at destination
  if (isDown) {
    pathFrac = (py - (midY - halfSpan)) / (2 * halfSpan);
  } else {
    pathFrac = ((midY + halfSpan) - py) / (2 * halfSpan);
  }
  pathFrac = Math.max(0, Math.min(1, pathFrac));

  // Two-segment lerp: source→bridge (0→0.5), bridge→destination (0.5→1)
  let r, g, b;
  if (pathFrac < 0.5) {
    const f = pathFrac * 2; // 0→1 over first half
    r = srcR + (midR - srcR) * f;
    g = srcG + (midG - srcG) * f;
    b = srcB + (midB - srcB) * f;
  } else {
    const f = (pathFrac - 0.5) * 2; // 0→1 over second half
    r = midR + (dstR - midR) * f;
    g = midG + (dstG - midG) * f;
    b = midB + (dstB - midB) * f;
  }

  ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
  ctx.beginPath();
  ctx.arc(cx, py, radius, 0, Math.PI * 2);
  ctx.fill();

  // Glow at bridge crossing — concentric circles instead of expensive RadialGradient
  if (bridgeProximity > 0.4 && transmission > 0.25) {
    const glowBase = alpha * 0.3 * bridgeProximity;
    ctx.fillStyle = `rgba(16, 185, 129, ${glowBase * 0.15})`;
    ctx.beginPath();
    ctx.arc(cx, py, radius * 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(16, 185, 129, ${glowBase * 0.4})`;
    ctx.beginPath();
    ctx.arc(cx, py, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}


// ─── Ladder signal particles (horizontal) ────────────────────────────────────

function drawLadderSignals(ctx, startX, totalW, y, t, numPrimes, sigma, color, type) {
  // Particles propagate along the ladder, attenuated by each prime
  const numParticles = 6;
  const sig = type === 'direct' ? sigma : 1 - sigma;

  // Precompute per-stage cumulative gain (σ-dependent; reuses module-level buffer)
  const cumulativeGain = _gainBuf; // no allocation — reused across calls
  let cumProd = 1;
  for (let s = 0; s < numPrimes; s++) {
    cumProd *= 1 / Math.max(0.05, Math.abs(1 - Math.pow(PRIMES[s], -sig)));
    cumulativeGain[s] = Math.min(cumProd, 5) / 5;
  }

  // ─── Continuous waveform trace along the wire ───
  // Shows the propagating AC signal as a faint sine path, amplitude decaying per stage
  const tracePoints = Math.round(totalW / 3); // ~1 point per 3px
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let j = 0; j <= tracePoints; j++) {
    const frac = j / tracePoints;
    const px = startX + frac * totalW;
    const sIdx = Math.min(Math.floor(frac * numPrimes), numPrimes - 1);
    const amp = 4 * cumulativeGain[sIdx];
    const py = y + amp * Math.sin(t * PRIME_FREQ[sIdx] + frac * 12);
    j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  for (let i = 0; i < numParticles; i++) {
    const phase = ((t * 0.4 + i / numParticles) % 1);
    const x = startX + phase * totalW;

    const stageIdx = Math.min(Math.floor(phase * numPrimes), numPrimes - 1);
    const attenuation = cumulativeGain[stageIdx];

    // AC waveform: vertical displacement at the local prime's resonant frequency
    // ω_p = 2π/log(p); amplitude decays with attenuation (signal weakens through ladder)
    const waveAmp = 4 * attenuation;
    const waveFreq = PRIME_FREQ[stageIdx];
    const yOsc = y + waveAmp * Math.sin(t * waveFreq + phase * 12);

    const alpha = 0.15 + 0.5 * attenuation;
    const radius = 1.5 + 2 * attenuation;

    // Soft glow — two concentric circles instead of expensive RadialGradient
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha * 0.12;
    ctx.beginPath();
    ctx.arc(x, yOsc, radius * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(x, yOsc, radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, yOsc, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
