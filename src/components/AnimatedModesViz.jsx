import { InlineMath } from './KaTeXMath.jsx';
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
        amplitude: Math.cos(gamma * logP) / Math.sqrt(p),
        hue: 210 + omega * 15,
      };
    });
  }, [numPrimes, zeroIndex]);

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

    // xPos depends on canvas width, so compute per-frame (cheap: just add+multiply)
    const xPos = new Float64Array(xSteps);
    for (let i = 0; i < xSteps; i++) {
      xPos[i] = xPad + ANIM_X_FRAC[i] * waveW;
    }

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

      // Draw waveform: cos(gamma * ln(x) - omega * t)
      const halfRow = rowH * 0.38;
      const phaseOffset = omega * t;
      ctx.beginPath();
      for (let i = 0; i < xSteps; i++) {
        const val = amplitude * Math.cos(gamma * ANIM_LOG_X[i] - phaseOffset) * ANIM_ENVELOPE[i];
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

  }, [primeData, zeroIndex, speed, canvasHeight]);

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
        At zeta zero frequency <InlineMath tex="\\gamma_n" />, each prime oscillator vibrates with
        amplitude <InlineMath tex="\\propto \\text{Re}(p^{-1/2-i\\gamma_n})" /> and phase set by <InlineMath tex="\\gamma_n \\log p" />.
        The bottom row superposes all prime contributions at this driving frequency &mdash; the collective oscillator chain
        response to the zero mode <InlineMath tex="\\gamma_n" />. (Note: the explicit formula's per-zero term is{' '}
        <InlineMath tex="-x^\\rho/\\rho" />, a single oscillation with no per-prime decomposition.)
        Different zeros excite different patterns across the prime oscillators, but the frequencies{' '}
        <InlineMath tex="\\omega_p = \\log p" /> are fixed &mdash; only the driving frequency <InlineMath tex="\\gamma_n" /> changes.
        <strong> Look for:</strong> small primes making large, slow oscillations; larger primes vibrating faster with smaller amplitude.
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
