import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Animated signal flow through the twin ladder system.
 * Fixed-size layout — controls don't cause reflow.
 *
 * Topology: direct and dual ladders run in parallel, coupled at EVERY prime
 * through a bridge node χ_p. Energy flows vertically between ladders through
 * the bridge at each stage. The animation uses a normalized linear coupling
 * score c_σ = max(0, 1 - 2|σ - 1/2|), maximal at σ=1/2. This is a visual
 * control parameter, not an evaluation of the functional-equation factor χ(s).
 */

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const PRIME_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc',
  '#d8b4fe', '#ec4899', '#f472b6', '#fb7185', '#f59e0b',
  '#fbbf24', '#10b981', '#34d399', '#06b6d4', '#22d3ee',
];

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

// Precomputed per-prime RGB triples — avoids hex parsing per packet per frame
const PRIME_RGB = PRIME_COLORS.map(c => [
  parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16),
]);

// ─── Cached radial glow sprites ──────────────────────────────────────────────
// Built once on first use, then drawn with scaled drawImage — a real radial
// gradient falloff with zero per-frame allocation. Combined with 'lighter'
// compositing this gives additive bloom where energies overlap (the bridge).
const _glowSprites = {};
function glowSprite(key, r, g, b) {
  let s = _glowSprites[key];
  if (!s) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g2 = c.getContext('2d');
    const grad = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
    grad.addColorStop(0.35, `rgba(${r},${g},${b},0.32)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    g2.fillStyle = grad;
    g2.fillRect(0, 0, 64, 64);
    _glowSprites[key] = s = c;
  }
  return s;
}

// Background gradients — rebuilt only when the canvas CSS size changes
const _bgCache = { key: '', grad: null, vignette: null };

// Deliberately a display-only score. It has no t-dependence and therefore must
// never be presented as the actual modulus of the functional-equation factor.
export function visualCouplingScore(sigma) {
  return Math.max(0, 1 - 2 * Math.abs(sigma - 0.5));
}

export default function HeroSignalFlow() {
  const canvasRef = useRef();
  const animRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  // Thermodynamic-analog controls:
  //   T (temperature) — drives animation speed AND particle agitation amplitude
  //                     (higher T → hotter, faster, more wobble)
  //   P (pressure)    — drives bridge coupling intensity and bus density
  //                     (higher P → tighter coupling visible in the bridge glow)
  const [temperature, setTemperature] = useState(1.0);
  const [pressure, setPressure] = useState(1.0);
  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  // Store frequently-changing values in refs so the draw callback stays stable
  // and the rAF loop isn't cancelled/restarted on every slider tick.
  const stateRef = useRef({ sigma: 0.5, temperature: 1.0, pressure: 1.0 });
  stateRef.current.sigma = sigma;
  stateRef.current.temperature = temperature;
  stateRef.current.pressure = pressure;

  // Accumulated animation time — caps per-frame delta to prevent jumps on tab switch
  const timeRef = useRef({ lastRAF: 0, accumulated: 0 });
  const runningRef = useRef(true);

  const draw = useCallback((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { sigma: sig, temperature: temp, pressure: pres } = stateRef.current;

    // Compute capped delta to avoid teleporting after tab switch
    const tr = timeRef.current;
    const rawDelta = tr.lastRAF === 0 ? 16 : time - tr.lastRAF;
    const cappedDelta = Math.min(rawDelta, 100); // max ~100ms = 6 frames
    tr.lastRAF = time;
    // Higher temperature → faster evolution (thermal-kinetic analogue)
    tr.accumulated += cappedDelta * 0.001 * temp;
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
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Background — cached vertical gradient + corner vignette for depth
    const bgKey = w + ':' + h;
    if (_bgCache.key !== bgKey) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#04060d');
      grad.addColorStop(0.5, '#0a1222');
      grad.addColorStop(1, '#04060d');
      const vig = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.35,
        w / 2, h / 2, Math.max(w, h) * 0.72
      );
      vig.addColorStop(0, 'rgba(2, 4, 10, 0)');
      vig.addColorStop(1, 'rgba(2, 4, 10, 0.5)');
      _bgCache.key = bgKey;
      _bgCache.grad = grad;
      _bgCache.vignette = vig;
    }
    ctx.fillStyle = _bgCache.grad;
    ctx.fillRect(0, 0, w, h);

    // Layout: two horizontal ladders with bridge coupling between them at each prime
    const margin = 16;
    const dirY = 58;           // direct ladder y-center
    const dualY = h - 58;      // dual ladder y-center
    const midY = h / 2;        // bridge coupling zone
    const ladderStartX = margin + 44;
    const ladderEndX = w - margin - 16;
    const sigma = sig;
    // Prime count is now fixed at the full set — the prime-count slider was
    // removed in favour of thermodynamic controls (T, P).
    const numPrimes = PRIMES.length;
    const sigmaDeviation = Math.abs(sigma - 0.5);
    // Dynamic gap — tight packing when many primes so labels don't crush.
    const gap = numPrimes > 10 ? 5 : numPrimes > 6 ? 8 : 12;
    const stageW = Math.min(70, (ladderEndX - ladderStartX) / numPrimes - gap);
    const totalLadderW = numPrimes * stageW + (numPrimes - 1) * gap;
    const offsetX = ladderStartX + ((ladderEndX - ladderStartX) - totalLadderW) / 2;

    // Normalized visual coupling at the current sigma (not |χ(s)|).
    const couplingScore = visualCouplingScore(sigma);

    // ─── Subtle grid (single batched path) ───
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let gx = margin; gx < w - margin; gx += 50) {
      ctx.moveTo(gx, 20);
      ctx.lineTo(gx, h - 20);
    }
    ctx.stroke();

    // Vignette — darkens corners, pulls the eye to the bridge axis
    ctx.fillStyle = _bgCache.vignette;
    ctx.fillRect(0, 0, w, h);

    // ─── Luminous field along the bridge axis ───
    // Radiant at σ=½ (the display score saturates the whole bridge), fading
    // smoothly as σ moves off-critical — the single strongest visual cue that
    // the critical line is the special state.
    const bridgeFieldSprite = glowSprite('bridge', 16, 185, 129);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = (0.04 + 0.20 * couplingScore * couplingScore) * Math.min(1.6, pres);
    ctx.drawImage(bridgeFieldSprite, offsetX - 40, midY - 36, totalLadderW + 80, 72);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // ─── Ladder labels ───
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('DIRECT  ζ(s)', margin, dirY - 22);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('DUAL  ζ(1−s)', margin, dualY + 32);

    // ─── Horizontal wires — glow with signal energy ───
    // Base wire in dark gray, then overlay a colored glow proportional to the display score
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(offsetX - 10, dirY);
    ctx.lineTo(offsetX + totalLadderW + 10, dirY);
    ctx.moveTo(offsetX - 10, dualY);
    ctx.lineTo(offsetX + totalLadderW + 10, dualY);
    ctx.stroke();
    // Signal energy overlay — blue for direct, gold for dual.
    // Off-critical the coupling can't drain the "hotter" ladder, so energy
    // piles up on one side: σ>½ → direct wire brightens, σ<½ → dual wire.
    // At σ=½ the two wires glow identically (perfect balance).
    const hotBoost = 0.22 * sigmaDeviation * 2;
    const dirWireGlow = 0.05 + 0.12 * couplingScore + (sigma > 0.5 ? hotBoost : 0);
    const dualWireGlow = 0.05 + 0.12 * couplingScore + (sigma < 0.5 ? hotBoost : 0);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(59, 130, 246, ${dirWireGlow})`;
    ctx.beginPath();
    ctx.moveTo(offsetX - 10, dirY);
    ctx.lineTo(offsetX + totalLadderW + 10, dirY);
    ctx.stroke();
    ctx.strokeStyle = `rgba(245, 158, 11, ${dualWireGlow})`;
    ctx.beginPath();
    ctx.moveTo(offsetX - 10, dualY);
    ctx.lineTo(offsetX + totalLadderW + 10, dualY);
    ctx.stroke();

    // ─── Input signal arrows (left end of each ladder) ───
    const arrowX = offsetX - 16;
    const arrowPulse = 0.4 + 0.3 * couplingScore + 0.15 * Math.sin(t * 2.5);
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
    //   σ = ½ → no net flow, dashes stationary (balanced visual state)
    const bridgeR = 14;
    const bridgeAlpha = 0.5 + 0.3 * couplingScore;
    // Precompute bridge color strings reused for every prime
    const bridgeStroke = `rgba(16, 185, 129, ${bridgeAlpha})`;
    const bridgeFill = `rgba(16, 185, 129, ${(0.04 + 0.10 * couplingScore).toFixed(3)})`;
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
      const cx = offsetX + i * (stageW + gap) + stageW / 2;
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
      const x = offsetX + i * (stageW + gap);
      const cx = x + stageW / 2;
      const col = PRIME_COLORS[i];
      const logP = PRIME_LOG[i];

      // === Direct stage (top) ===
      drawLCStage(ctx, x, dirY, stageW, p, col, 'direct', t, sigma, logP);

      // === Dual stage (bottom) ===
      drawLCStage(ctx, x, dualY, stageW, p, col, 'dual', t, sigma, logP);

      // === Dirichlet energy packets (k = 1..4) for this prime ===
      // Physically-accurate: the k-th excitation carries weight p^{-k·σ}.
      // Moving the σ dial directly alters each packet's size/brightness.
      drawEnergyPackets(ctx, cx, dirY, dualY, stageW, t, p, logP, col, sigma, i, pres, temp);

      // === Bridge coupling node χ_p (center) ===
      // Bridge node circle — smooth glow and breathing that scale with the display score
      const breathe = Math.sin(t * 2.5 + i * 1.2);  // subtle oscillation per prime
      const breatheR = bridgeR + 1.5 * couplingScore * breathe; // ±1.5px at full visual coupling
      // Pressure scales the bridge glow intensity (higher P → tighter, brighter coupling)
      const glowPulse = Math.min(0.55, (0.03 + couplingScore * (0.12 + 0.08 * breathe)) * pres);
      // Additive radial bloom — soft real-gradient falloff via cached sprite
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = glowPulse;
      const nodeGlowSize = (breatheR + 4) * 2.8;
      ctx.drawImage(bridgeFieldSprite, cx - nodeGlowSize / 2, midY - nodeGlowSize / 2, nodeGlowSize, nodeGlowSize);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      ctx.fillStyle = bridgeFill;
      ctx.strokeStyle = bridgeStroke;
      ctx.lineWidth = 1.2 + 0.6 * couplingScore; // thicker stroke when visually coupled
      ctx.beginPath();
      ctx.arc(cx, midY, breatheR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mismatch ring — a red arc that fills as the visual coupling score falls.
      // At σ=½ it vanishes; at the ends of the display range it closes into a
      // complete ring. It is an animation gauge, not a computed scattering loss.
      const nodeReflection = 1 - couplingScore;
      if (nodeReflection > 0.03) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.22 + 0.45 * nodeReflection})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, midY, breatheR + 3.5, -Math.PI / 2, -Math.PI / 2 + nodeReflection * Math.PI * 2);
        ctx.stroke();
      }

      // χ_p label — scale font down and offset alternating rows when many primes
      // so the subscripted labels don't run into each other.
      const bridgeFontPx = numPrimes > 10 ? 8 : numPrimes > 6 ? 9 : 10;
      ctx.fillStyle = bridgeStroke; // same color as bridge outline
      ctx.font = `${bridgeFontPx}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      const bridgeLabelY = numPrimes > 10 && (i % 2 === 1)
        ? midY + 15  // offset odd-indexed labels below to avoid horizontal collision
        : midY + 4;
      ctx.fillText(BRIDGE_LABELS[i], cx, bridgeLabelY);

      // === Energy particles flowing through bridge ===
      drawBridgeEnergy(ctx, cx, dirY + 20, dualY - 20, midY, t, i, p, sigma, couplingScore, logP, pres);
    }

    // ─── Horizontal coupling bus (connecting all χ_p) ───
    // Animated dashes propagate left-to-right, speed ∝ the visual coupling score:
    // at equilibrium the animation is fully active; off-critical it weakens.
    if (numPrimes > 1) {
      const busX1 = offsetX + stageW / 2;
      const busX2 = offsetX + (numPrimes - 1) * (stageW + gap) + stageW / 2;
      // Pressure scales the horizontal coupling bus brightness/thickness.
      ctx.strokeStyle = `rgba(16, 185, 129, ${Math.min(0.85, (0.12 + 0.15 * couplingScore) * pres)})`;
      ctx.lineWidth = (0.8 + 0.6 * couplingScore) * Math.sqrt(pres);
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -(t * 20 * couplingScore) % 7;
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
    const eqText = sigmaDeviation < 0.02 ? 'EQUILIBRIUM — MAX VISUAL COUPLING' :
                   sigma < 0.5 ? 'SUB-CRITICAL — VISUAL MISMATCH' : 'SUPER-CRITICAL — VISUAL MISMATCH';
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

    // ─── Display-only coupling score — color matches equilibrium indicator ───
    ctx.fillStyle = `rgba(${eqR | 0}, ${eqG | 0}, ${eqB | 0}, 0.6)`;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`visual cσ = ${couplingScore.toFixed(2)}   σ = ${sigma.toFixed(2)}`, w / 2, eqBoxY + 34);

    // ─── Signal particles along ladders (horizontal propagation) ───
    drawLadderSignals(ctx, offsetX, totalLadderW, dirY, t, numPrimes, sigma, '#3b82f6', 'direct', temp);
    drawLadderSignals(ctx, offsetX, totalLadderW, dualY, t, numPrimes, sigma, '#f59e0b', 'dual', temp);

    if (runningRef.current) {
      animRef.current = requestAnimationFrame(draw);
    }
  }, []); // stable — reads state from stateRef, no deps to trigger recreation

  // Respect prefers-reduced-motion: render a single static frame instead of
  // looping (redrawn on control changes by the effect below).
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    reducedRef.current = !!(mq && mq.matches);
    runningRef.current = !reducedRef.current; // false → draw won't self-schedule
    animRef.current = requestAnimationFrame(draw);
    return () => {
      runningRef.current = false; // prevents draw from self-scheduling after cleanup
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  // Under reduced motion, repaint one frame whenever a control changes
  useEffect(() => {
    if (reducedRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(draw);
    }
  }, [sigma, temperature, pressure, draw]);

  // Pause the rAF loop while the canvas is scrolled offscreen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      if (reducedRef.current) return;
      if (entry.isIntersecting) {
        if (!runningRef.current) {
          runningRef.current = true;
          timeRef.current.lastRAF = 0; // fresh delta — no time jump on resume
          cancelAnimationFrame(animRef.current);
          animRef.current = requestAnimationFrame(draw);
        }
      } else {
        runningRef.current = false;
        cancelAnimationFrame(animRef.current);
      }
    });
    io.observe(canvas);
    return () => io.disconnect();
  }, [draw]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Twin ladder signal flow animation: ${PRIMES.length} prime oscillators coupled through bridge nodes. σ = ${sigma.toFixed(2)}, visual coupling score = ${visualCouplingScore(sigma).toFixed(2)} (not the modulus of χ(s)), T = ${temperature.toFixed(2)}, P = ${pressure.toFixed(2)}. Double-click to reset σ to equilibrium.`}
        onDoubleClick={() => setSigma(0.5)}
        title="Double-click to reset σ to ½"
        style={{
          width: '100%',
          height: 340,
          borderRadius: 12,
          border: '1px solid var(--rule-soft)',
          cursor: 'pointer',
          background: 'var(--paper)',
          boxShadow: '0 0 48px color-mix(in srgb, var(--series-3) 5%, transparent), 0 8px 32px rgba(0, 0, 0, 0.4)',
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
        <div className="control-group" style={{ flex: '1 1 120px' }}>
          <label title="Thermodynamic analogue: drives animation kinetics + particle agitation">T (temperature)</label>
          <input type="range" min="0.2" max="2.5" step="0.05" value={temperature}
            onChange={e => setTemperature(+e.target.value)} />
          <span className="control-value" style={{ minWidth: 32 }}>{temperature.toFixed(2)}</span>
        </div>
        <div className="control-group" style={{ flex: '1 1 120px' }}>
          <label title="Thermodynamic analogue: drives bridge coupling density and packet flux">P (pressure)</label>
          <input type="range" min="0.2" max="3" step="0.05" value={pressure}
            onChange={e => setPressure(+e.target.value)} />
          <span className="control-value" style={{ minWidth: 32 }}>{pressure.toFixed(2)}</span>
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

  // Prime label — font shrinks when stages are narrow so adjacent labels don't touch
  const narrow = w < 45;
  ctx.fillStyle = color;
  ctx.font = `bold ${narrow ? 9 : 11}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  const labelY = type === 'direct' ? y + h / 2 + 13 : y - h / 2 - 5;
  ctx.fillText(prime.toString(), x + w / 2, labelY);
}


// ─── Bridge energy particles (vertical flow between ladders) ─────────────────

function drawBridgeEnergy(ctx, cx, topY, botY, midY, t, stageIdx, prime, sigma, couplingScore, logP, pressure = 1) {
  // At σ=½, the animation sends energy freely in both directions.
  // Away from ½, the display depicts increasing reflection at the bridge node.
  const transmission = couplingScore;
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
    ctx.beginPath();
    const omega = 2 * Math.PI / logP; // natural frequency — unique per prime
    const spatialK = 1 + logP * 0.6;  // wavenumber — more nodes for larger primes
    const temporal = Math.cos(t * omega + primePhase); // loop-invariant
    // Higher pressure → stronger standing-wave antinode displacement
    const waveScale = temporal * 5 * transmission * pressure;
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
    // Two-pass stroke on the same path: wide faint halo + bright core.
    // Additive blending makes waves at neighbouring primes bloom where dense.
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(16, 185, 129, ${Math.min(0.28, 0.05 * transmission * pressure)})`;
    ctx.lineWidth = 3.2 * Math.sqrt(pressure);
    ctx.stroke();
    ctx.strokeStyle = `rgba(52, 211, 153, ${Math.min(0.8, (0.10 + 0.16 * transmission) * pressure)})`;
    ctx.lineWidth = 1 * Math.sqrt(pressure);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
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
      // Alpha decays with distance; eased at both path ends (no pop-in)
      const fade = Math.min(1, phase * 8, (1 - phase) * 4);
      const alpha = reflection * (0.2 + 0.3 * (1 - phase)) * fade;
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
      const fade = Math.min(1, phase * 8, (1 - phase) * 4);
      const alpha = reflection * (0.2 + 0.3 * (1 - phase)) * fade;
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

  // Eased endpoints — particles condense out of / dissolve into the ladders
  // instead of popping in and out at the path wrap.
  const fade = Math.min(1, phase * 5, (1 - phase) * 5);

  // Smooth alpha and radius: peaks at bridge, proportional to transmission
  const alpha = (0.12 + 0.25 * transmission + 0.4 * bridgeProximity * transmission) * fade;
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

  // Additive sprite bloom — crossfades source→bridge→destination tint along
  // the path, brightest at the bridge crossing. Overlapping packets from
  // neighbouring primes sum into genuine bloom at the coupling axis.
  if (transmission > 0.15) {
    const srcSprite = glowSprite(isDown ? 'blue' : 'gold', srcR, srcG, srcB);
    const dstSprite = glowSprite(isDown ? 'gold' : 'blue', dstR, dstG, dstB);
    const bridgeSprite = glowSprite('bridge', midR, midG, midB);
    let sA, sB, f;
    if (pathFrac < 0.5) { sA = srcSprite; sB = bridgeSprite; f = pathFrac * 2; }
    else { sA = bridgeSprite; sB = dstSprite; f = (pathFrac - 0.5) * 2; }
    const gAlpha = (0.06 + 0.30 * bridgeProximity) * transmission * fade;
    const gSize = radius * 6;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = gAlpha * (1 - f);
    ctx.drawImage(sA, cx - gSize / 2, py - gSize / 2, gSize, gSize);
    ctx.globalAlpha = gAlpha * f;
    ctx.drawImage(sB, cx - gSize / 2, py - gSize / 2, gSize, gSize);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
}


// ─── Ladder signal particles (horizontal) ────────────────────────────────────

function drawLadderSignals(ctx, startX, totalW, y, t, numPrimes, sigma, color, type, temperature = 1) {
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
  ctx.beginPath();
  for (let j = 0; j <= tracePoints; j++) {
    const frac = j / tracePoints;
    const px = startX + frac * totalW;
    const sIdx = Math.min(Math.floor(frac * numPrimes), numPrimes - 1);
    // Temperature scales the wave amplitude (hotter → more vertical agitation)
    const amp = 4 * cumulativeGain[sIdx] * temperature;
    const py = y + amp * Math.sin(t * PRIME_FREQ[sIdx] + frac * 12);
    j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  // Two-pass stroke on the same path: soft halo + crisp core
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.05;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.globalAlpha = 0.14;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;

  const sprite = type === 'direct'
    ? glowSprite('blue', 59, 130, 246)
    : glowSprite('gold', 245, 158, 11);

  for (let i = 0; i < numParticles; i++) {
    const phase = ((t * 0.4 + i / numParticles) % 1);
    const x = startX + phase * totalW;

    const stageIdx = Math.min(Math.floor(phase * numPrimes), numPrimes - 1);
    const attenuation = cumulativeGain[stageIdx];

    // AC waveform: vertical displacement at the local prime's resonant frequency
    // ω_p = 2π/log(p); amplitude decays with attenuation (signal weakens through ladder).
    // Temperature multiplies the wobble amplitude (thermal agitation).
    const waveAmp = 4 * attenuation * temperature;
    const waveFreq = PRIME_FREQ[stageIdx];
    const yOsc = y + waveAmp * Math.sin(t * waveFreq + phase * 12);

    // Eased entry/exit at the ladder ends — no hard pop at the wrap point
    const fade = Math.min(1, phase * 6, (1 - phase) * 6);
    const alpha = (0.15 + 0.5 * attenuation) * fade;
    const radius = 1.5 + 2 * attenuation;

    // Soft additive bloom via cached radial sprite
    const gSize = radius * 6.5;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = alpha * 0.35;
    ctx.drawImage(sprite, x - gSize / 2, yOsc - gSize / 2, gSize, gSize);
    ctx.globalCompositeOperation = 'source-over';

    // Core
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, yOsc, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}


// ─── Dirichlet energy packets (per-prime k-excitations) ─────────────────────
//
// Each prime oscillator p has Dirichlet-series energy levels indexed by
// k = 0, 1, 2, ... with term weight p^{-kσ}. Moving the σ dial is the
// physical act of reweighting these packets:
//
// For each fixed prime, the k-series is geometric and converges for every
// σ > 0. Higher-k packets shrink faster as σ increases. The sum/product over
// all primes is absolutely convergent only for σ > 1; σ = 1/2 is the
// functional-equation symmetry line, not a convergence boundary. The tint
// below visualizes departure from that symmetry line only.
//
// The packets orbit the stage center at the prime's natural frequency
// ω = 2π/log(p) so each prime has its own rhythm. Pressure slightly
// boosts the glow; temperature modulates orbit amplitude (thermal agitation).
//
// Critical invariant — the drawn radius/alpha must be an exact monotone
// function of p^{-kσ}, so adjusting the σ slider visibly alters each packet
// in real time rather than just changing a meta-label.
function drawEnergyPackets(ctx, cx, dirY, dualY, stageW, t, prime, logP, color, sigma, stageIdx, pressure, temperature) {
  const K_MAX = 4; // k = 1..4 (k = 0 is the identity "1" term, not worth drawing)
  const omega = 2 * Math.PI / logP;
  const primePhase = stageIdx * 0.618; // golden-ratio phase offset so primes desync

  // Symmetry-imbalance tint — when σ is far from ½, the geometric weight
  // p^{-σ} differs from its reflected critical-line value. This is not a
  // convergence test for the Euler product.
  const sigmaDev = sigma - 0.5;
  const imbalance = Math.min(1, Math.abs(sigmaDev) * 2.2); // 0 at ½
  const lowerSigmaSide = sigmaDev < 0;

  // Orbit envelope: packets travel around the stage box along an elliptical
  // trajectory — x wobble is bounded by stage width; y is stacked by k above
  // the direct ladder so higher-k packets appear further from the wire.
  const orbitRx = Math.max(6, stageW * 0.28);

  // Color: prime color at the symmetry line, red-shift on the lower-σ side
  // to make the two directions visually distinct. It does not denote divergence.
  // (Constant across k and side — hoisted out of the loops.)
  const [pr, pg, pb] = PRIME_RGB[stageIdx];
  let r = pr, g = pg, b = pb;
  if (lowerSigmaSide && imbalance > 0.05) {
    r = Math.round(pr + (239 - pr) * imbalance);
    g = Math.round(pg + (68 - pg) * imbalance);
    b = Math.round(pb + (68 - pb) * imbalance);
  }

  // Draw direct-side packets (σ), then dual-side packets (1-σ)
  for (let side = 0; side < 2; side++) {
    const isDirect = side === 0;
    const localSigma = isDirect ? sigma : 1 - sigma;
    const yAnchor = isDirect ? dirY - 28 : dualY + 28; // above direct, below dual
    const yStep = isDirect ? -6 : 6;                    // stack direction

    for (let k = 1; k <= K_MAX; k++) {
      // PHYSICAL AMPLITUDE of the k-th packet — this is THE quantity that
      // responds to the σ dial.
      const weight = Math.pow(prime, -k * localSigma);

      // Radius: visible band [1.2 .. 6.5 px], monotone in weight.
      // We squash through sqrt so the decay is visible without tiny packets
      // disappearing below a pixel.
      const radius = Math.max(0.8, Math.min(6.5, 1.2 + 5.3 * Math.sqrt(weight)));
      // Alpha: linear in weight, with a small floor so k=4 packets are still
      // faintly visible at σ=0.9 (where p^{-4·0.9} ≈ 0.0087 for p=2).
      const alpha = Math.max(0.08, Math.min(0.95, 0.10 + 0.85 * weight));

      // Orbit position — each k has a different phase so they don't overlap.
      // Temperature scales the orbit amplitude (thermal kinetic expansion).
      const theta = t * omega * (1 + 0.15 * k) + primePhase + k * 0.9;
      const orbitAmpX = orbitRx * (0.55 + 0.25 * temperature);
      const px = cx + Math.cos(theta) * orbitAmpX;
      const py = yAnchor + (k - 1) * yStep
                 + Math.sin(theta * 1.3) * 2.2 * temperature;

      // Outer glow — additive, scaled by pressure so P affects luminosity.
      const glowAlpha = Math.min(0.45, alpha * 0.28 * pressure);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${glowAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, radius * 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Core packet dot
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
