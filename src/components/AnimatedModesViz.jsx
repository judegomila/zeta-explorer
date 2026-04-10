import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes, primeFrequency } from '../math/primes.js';

// Precompute x-step constants at module level — these depend only on the
// hardcoded xSteps=200 and never change, saving 200 Math.exp calls + 3
// Float64Array allocations per animation frame (~60fps = 12,000 exp/s).
const ANIM_X_STEPS = 200;
const ANIM_X_FRAC = new Float64Array(ANIM_X_STEPS);
const ANIM_LOG_X = new Float64Array(ANIM_X_STEPS);
const ANIM_ENVELOPE = new Float64Array(ANIM_X_STEPS);
for (let i = 0; i < ANIM_X_STEPS; i++) {
  const frac = i / (ANIM_X_STEPS - 1);
  ANIM_X_FRAC[i] = frac;
  ANIM_LOG_X[i] = 1 + frac * 5;       // log-space x from e^1 to e^6
  ANIM_ENVELOPE[i] = Math.exp(-0.05 * frac);
}

/**
 * Animated visualization of oscillator modes.
 * Shows the time evolution of each prime oscillator at a zeta zero frequency,
 * demonstrating how the modes superpose to create the explicit formula.
 */
export default function AnimatedModesViz() {
  const canvasRef = useRef();
  const animRef = useRef();
  const elapsedRef = useRef(0);
  const superpositionRef = useRef(new Float64Array(200));
  const xPosRef = useRef(new Float64Array(ANIM_X_STEPS));
  const lastWaveWRef = useRef(-1);
  const [numPrimes, setNumPrimes] = useState(12);
  const [zeroIndex, setZeroIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Precompute per-prime constants that only change with numPrimes/zeroIndex, not time
  const primeData = useMemo(() => {
    const gamma = ZETA_ZEROS[zeroIndex];
    const primes = getPrimes(numPrimes);
    return primes.map(p => {
      const omega = primeFrequency(p);
      const logP = Math.log(p);
      return {
        p,
        omega,
        logP,
        amplitude: logP * Math.cos(gamma * logP) / Math.sqrt(p),
        hue: 210 + omega * 15,
      };
    });
  }, [numPrimes, zeroIndex]);

  // Precompute cos(γ·log x[i]) and sin(γ·log x[i]) once per γ (zeroIndex), not
  // per-frame. The inner waveform loop computes cos(γ·log x[i] − ω·t) for every
  // (prime, x) pair; using cos(a−b) = cos a·cos b + sin a·sin b lets us factor
  // out the γ·log x part (constant in time) and reduces the per-frame trig cost
  // from numPrimes·xSteps cosine evaluations (up to 50·200 = 10,000 at 60 fps
  // → 600k/s) to just 2·numPrimes cos/sin evaluations for the cos(ω·t)/sin(ω·t)
  // factors. The γ·log x tables themselves are recomputed only when zeroIndex
  // changes (rare user interaction), pre-multiplied by ANIM_ENVELOPE[i] so the
  // envelope fold is also free in the hot loop.
  const gammaWaveTables = useMemo(() => {
    const gamma = ZETA_ZEROS[zeroIndex];
    const cosTable = new Float64Array(ANIM_X_STEPS);
    const sinTable = new Float64Array(ANIM_X_STEPS);
    for (let i = 0; i < ANIM_X_STEPS; i++) {
      const theta = gamma * ANIM_LOG_X[i];
      const env = ANIM_ENVELOPE[i];
      cosTable[i] = Math.cos(theta) * env;
      sinTable[i] = Math.sin(theta) * env;
    }
    return { cosTable, sinTable };
  }, [zeroIndex]);

  // Scale canvas height so each prime row stays readable (min 24px per row)
  const canvasHeight = Math.max(500, 100 + numPrimes * 28);

  const draw = useCallback((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const dw = canvas.clientWidth;
    const dh = canvasHeight;
    const targetW = dw * dpr;
    const targetH = dh * dpr;
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, dw, dh);

    const gamma = ZETA_ZEROS[zeroIndex]; // zero frequency
    const t = time * speed * 0.001;

    const rowH = (dh - 100) / (primeData.length + 2);
    const xPad = 80;
    const waveW = dw - xPad - 20;

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 14px sans-serif';
    const subIdx = String(zeroIndex + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('');
    ctx.fillText(`Oscillator Modes at Zeta Zero γ${subIdx} = ${gamma.toFixed(3)}`, 12, 22);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('Each row: one prime oscillator. Right: superposition of all modes.', 12, 40);

    // Draw each prime's oscillation — reuse buffer to avoid per-frame allocation
    const superposition = superpositionRef.current;
    superposition.fill(0);
    const xSteps = ANIM_X_STEPS;

    // xPos depends on canvas width — reuse buffer, only recompute when waveW changes
    const xPos = xPosRef.current;
    if (lastWaveWRef.current !== waveW) {
      for (let i = 0; i < xSteps; i++) {
        xPos[i] = xPad + ANIM_X_FRAC[i] * waveW;
      }
      lastWaveWRef.current = waveW;
    }

    const { cosTable, sinTable } = gammaWaveTables;
    primeData.forEach((pd, idx) => {
      const { p, omega, amplitude, hue } = pd;
      const yCenter = 60 + idx * rowH;

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '11px monospace';
      ctx.fillText(`p=${p}`, 6, yCenter + 4);
      ctx.fillStyle = '#3b82f6';
      ctx.font = '9px monospace';
      ctx.fillText(`ω=${omega.toFixed(2)}`, 6, yCenter + 16);

      // Draw waveform: amplitude · cos(γ·ln x − ω·t) · envelope(x)
      // Expand via cos(a−b) = cos a·cos b + sin a·sin b, where cosTable/sinTable
      // already carry cos(γ·ln x[i])·envelope(i) and sin(γ·ln x[i])·envelope(i),
      // so the only per-(prime,frame) trig is one cos(ω·t) + one sin(ω·t).
      const halfRow = rowH * 0.38;
      const phaseOffset = omega * t;
      const cosPhase = Math.cos(phaseOffset);
      const sinPhase = Math.sin(phaseOffset);
      ctx.beginPath();
      for (let i = 0; i < xSteps; i++) {
        const val = amplitude * (cosTable[i] * cosPhase + sinTable[i] * sinPhase);
        const y = yCenter - val * halfRow;

        superposition[i] += val;

        if (i === 0) ctx.moveTo(xPos[i], y);
        else ctx.lineTo(xPos[i], y);
      }

      ctx.strokeStyle = `hsla(${hue}, 70%, 55%, 0.7)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(xPad, yCenter);
      ctx.lineTo(xPad + waveW, yCenter);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pulsing dot at start
      const phase = (gamma * 1 - omega * t) % (2 * Math.PI);
      const dotY = yCenter - amplitude * Math.cos(phase) * halfRow;
      ctx.beginPath();
      ctx.arc(xPad, dotY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
      ctx.fill();
    });

    // Superposition at bottom
    const superY = 60 + primeData.length * rowH + 10;
    const superH = dh - superY - 20;
    const superMid = superY + superH / 2;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(xPad, superMid);
    ctx.lineTo(xPad + waveW, superMid);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.font = '600 12px sans-serif';
    ctx.fillText('Σ all modes', 6, superMid + 4);

    let maxSuper = 0.01;
    for (let i = 0; i < xSteps; i++) {
      const abs = Math.abs(superposition[i]);
      if (abs > maxSuper) maxSuper = abs;
    }
    const scale = (superH * 0.4) / maxSuper;

    ctx.beginPath();
    for (let i = 0; i < xSteps; i++) {
      const y = superMid - superposition[i] * scale;
      if (i === 0) ctx.moveTo(xPos[i], y);
      else ctx.lineTo(xPos[i], y);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill
    ctx.beginPath();
    ctx.moveTo(xPos[0], superMid);
    for (let i = 0; i < xSteps; i++) {
      const y = superMid - superposition[i] * scale;
      ctx.lineTo(xPos[i], y);
    }
    ctx.lineTo(xPos[xSteps - 1], superMid);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fill();

    // X-axis with tick marks and labels
    const axisY = superY + superH;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xPad, axisY);
    ctx.lineTo(xPad + waveW, axisY);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '10px monospace';
    for (let logVal = 1; logVal <= 6; logVal++) {
      const tickX = xPad + ((logVal - 1) / 5) * waveW;
      ctx.beginPath();
      ctx.moveTo(tickX, axisY);
      ctx.lineTo(tickX, axisY + 4);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.fillText(logVal.toString(), tickX, axisY + 14);
    }

    // Y-axis for superposition panel
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xPad, superY);
    ctx.lineTo(xPad, axisY);
    ctx.stroke();

    // Y-axis tick marks at ±maxSuper (the dynamic peak amplitude of the
    // superposition this frame) and zero. The top/bottom ticks land at 10%/90%
    // of the panel height because scale = 0.4·superH/maxSuper, so val=maxSuper
    // maps to a 0.4·superH pixel offset from the centerline.
    const peakLabel = maxSuper.toFixed(maxSuper >= 10 ? 1 : 2);
    const yTicks = [
      { y: superMid, label: '0' },
      { y: superY + superH * 0.1, label: `+${peakLabel}` },
      { y: superY + superH * 0.9, label: `\u2212${peakLabel}` },
    ];
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    for (const tick of yTicks) {
      ctx.beginPath();
      ctx.moveTo(xPad - 3, tick.y);
      ctx.lineTo(xPad, tick.y);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.fillText(tick.label, xPad - 5, tick.y + 3);
    }

    // Rotated y-axis label for superposition
    ctx.save();
    ctx.translate(xPad - 18, superMid);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#475569';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Amplitude', 0, 0);
    ctx.restore();

    // Axis label
    ctx.fillStyle = '#475569';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('log x', xPad - 6, axisY + 14);
    ctx.textAlign = 'left';

    // Time indicator (top-right)
    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`t = ${t.toFixed(2)}`, dw - 8, 22);
    ctx.textAlign = 'left';

    // Legend showing first few prime colors + superposition
    const legendX = dw - 170;
    const legendY = 32;
    const legendItems = Math.min(primeData.length, 5);
    const legendH = (legendItems + 1) * 16 + 10;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX - 8, legendY - 4, 168, legendH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '10px sans-serif';
    for (let li = 0; li < legendItems; li++) {
      const pd = primeData[li];
      const ly = legendY + 10 + li * 16;
      ctx.strokeStyle = `hsla(${pd.hue}, 70%, 55%, 0.9)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(legendX, ly);
      ctx.lineTo(legendX + 20, ly);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`p = ${pd.p}  (ω = ${pd.omega.toFixed(2)})`, legendX + 26, ly + 3);
    }
    // Superposition entry
    const superLegY = legendY + 10 + legendItems * 16;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(legendX, superLegY);
    ctx.lineTo(legendX + 20, superLegY);
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.fillText('Σ all modes', legendX + 26, superLegY + 3);
    if (primeData.length > 5) {
      ctx.fillStyle = '#64748b';
      ctx.font = '9px sans-serif';
      ctx.fillText(`… + ${primeData.length - 5} more primes`, legendX + 26, superLegY + 16);
    }

  }, [primeData, gammaWaveTables, zeroIndex, speed, canvasHeight]);

  // Spacebar keyboard shortcut for play/pause
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    let startTime = performance.now() - elapsedRef.current;
    const animate = (time) => {
      const elapsed = time - startTime;
      elapsedRef.current = elapsed;
      draw(elapsed);
      if (isPlaying) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    if (isPlaying) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw(elapsedRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw, isPlaying]);

  // Redraw on window resize when paused (animation loop handles it when playing)
  useEffect(() => {
    if (isPlaying) return;
    const onResize = () => draw(elapsedRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw, isPlaying]);

  return (
    <div>
      <div className="tab-explainer accent-pink">
        <p style={{ margin: '0 0 8px' }}>
          At zeta zero frequency <InlineMath tex={"\\gamma_n"} />, each prime oscillator vibrates with amplitude
          and phase determined by:
        </p>
        <BlockMath tex={"A_p \\propto \\log(p) \\cdot \\text{Re}\\bigl(p^{-1/2 - i\\gamma_n}\\bigr), \\qquad \\phi_p = \\gamma_n \\log p"} />
        <p style={{ margin: '8px 0' }}>
          The <InlineMath tex={"\\log(p)"} /> weighting comes from the oscillator inductance <InlineMath tex={"L_p = \\log(p)"} />.
          The bottom row superposes all prime contributions &mdash; the collective chain response to
          mode <InlineMath tex={"\\gamma_n"} />. Different zeros excite different patterns, but the
          frequencies <InlineMath tex={"\\omega_p = \\log p"} /> are fixed.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Look for:</strong> small primes making large, slow oscillations; larger primes vibrating faster with smaller amplitude.
        </p>
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Zeta Zero</label>
          <select value={zeroIndex} onChange={e => setZeroIndex(+e.target.value)}>
            {ZETA_ZEROS.slice(0, 100).map((z, i) => (
              <option key={i} value={i}>γ{String(i + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')} = {z.toFixed(3)}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <div className="control-group">
          <label>Speed</label>
          <input type="range" min="0.1" max="5" step="0.1" value={speed}
            onChange={e => setSpeed(+e.target.value)} />
          <span className="control-value">{speed.toFixed(1)}x</span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title="Toggle animation (Space)"
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border)',
            background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
            color: isPlaying ? '#ef4444' : '#10b981', cursor: 'pointer', fontSize: 13,
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => { elapsedRef.current = 0; if (!isPlaying) draw(0); }}
          title="Reset animation to t = 0"
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'rgba(100,116,139,0.15)',
            color: '#94a3b8', cursor: 'pointer', fontSize: 13, marginLeft: 4,
          }}
        >
          Reset
        </button>
        <span style={{ color: '#475569', fontSize: 10, marginLeft: 6, fontFamily: 'var(--font-mono)' }}>
          <kbd style={{ padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', background: '#1e293b', fontSize: 10 }}>Space</kbd>
        </span>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: canvasHeight }} />
      </div>
    </div>
  );
}
