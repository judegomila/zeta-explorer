import { InlineMath } from './KaTeXMath.jsx';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes, primeFrequency } from '../math/primes.js';

/**
 * Animated visualization of oscillator modes.
 * Shows the time evolution of each prime oscillator at a zeta zero frequency,
 * demonstrating how the modes superpose to create the explicit formula.
 */
export default function AnimatedModesViz() {
  const canvasRef = useRef();
  const animRef = useRef();
  const [numPrimes, setNumPrimes] = useState(12);
  const [zeroIndex, setZeroIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const draw = useCallback((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = 2;
    const dw = canvas.clientWidth;
    const dh = 500;
    canvas.width = dw * dpr;
    canvas.height = dh * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, dw, dh);

    const gamma = ZETA_ZEROS[zeroIndex]; // zero frequency
    const primes = getPrimes(numPrimes);
    const t = time * speed * 0.001;

    const rowH = (dh - 100) / (numPrimes + 2);
    const xPad = 80;
    const waveW = dw - xPad - 20;

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 14px sans-serif';
    ctx.fillText(`Oscillator Modes at Zeta Zero γ₍${zeroIndex + 1}₎ = ${gamma.toFixed(3)}`, 12, 22);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('Each row: one prime oscillator. Right: superposition of all modes.', 12, 40);

    // Draw each prime's oscillation
    let superposition = new Float64Array(200);
    const xSteps = 200;

    primes.forEach((p, idx) => {
      const omega = primeFrequency(p);
      const yCenter = 60 + idx * rowH;
      const amplitude = 1 / Math.sqrt(p); // amplitude decays with prime

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '11px monospace';
      ctx.fillText(`p=${p}`, 6, yCenter + 4);
      ctx.fillStyle = '#3b82f6';
      ctx.font = '9px monospace';
      ctx.fillText(`ω=${omega.toFixed(2)}`, 6, yCenter + 16);

      // Draw waveform: cos(gamma * ln(x) - omega * t)
      const halfRow = rowH * 0.38;
      ctx.beginPath();
      for (let i = 0; i < xSteps; i++) {
        const frac = i / xSteps;
        const x = xPad + frac * waveW;
        const logX = 1 + frac * 5; // log-space x from e^1 to e^6
        const val = amplitude * Math.cos(gamma * logX - omega * t) * Math.exp(-0.05 * frac);
        const y = yCenter - val * halfRow;

        superposition[i] += val;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const hue = 210 + omega * 15;
      ctx.strokeStyle = `hsla(${hue}, 70%, 55%, 0.7)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center line
      ctx.strokeStyle = '#1a1f36';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(xPad, yCenter);
      ctx.lineTo(xPad + waveW, yCenter);
      ctx.stroke();

      // Pulsing dot at start
      const phase = (gamma * 1 - omega * t) % (2 * Math.PI);
      const dotY = yCenter - amplitude * Math.cos(phase) * halfRow;
      ctx.beginPath();
      ctx.arc(xPad, dotY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
      ctx.fill();
    });

    // Superposition at bottom
    const superY = 60 + numPrimes * rowH + 10;
    const superH = dh - superY - 20;
    const superMid = superY + superH / 2;

    ctx.strokeStyle = '#2a3050';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(xPad, superMid);
    ctx.lineTo(xPad + waveW, superMid);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = '600 12px sans-serif';
    ctx.fillText('Σ all modes', 6, superMid + 4);

    const maxSuper = Math.max(0.01, ...superposition.map(Math.abs));
    const scale = (superH * 0.4) / maxSuper;

    ctx.beginPath();
    for (let i = 0; i < xSteps; i++) {
      const x = xPad + (i / xSteps) * waveW;
      const y = superMid - superposition[i] * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill
    ctx.beginPath();
    ctx.moveTo(xPad, superMid);
    for (let i = 0; i < xSteps; i++) {
      const x = xPad + (i / xSteps) * waveW;
      const y = superMid - superposition[i] * scale;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(xPad + waveW, superMid);
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

  }, [numPrimes, zeroIndex, speed]);

  useEffect(() => {
    let startTime = performance.now();
    const animate = (time) => {
      draw(time - startTime);
      if (isPlaying) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    if (isPlaying) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw(0);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw, isPlaying]);

  return (
    <div>
      <div className="tab-explainer accent-pink">
        <strong>The math:</strong> At zeta zero frequency <InlineMath tex="\\gamma_n" />, each prime oscillator vibrates with
        amplitude <InlineMath tex="\\propto \\text{Re}(p^{-1/2-i\\gamma_n})" /> and phase set by <InlineMath tex="\\gamma_n \\log p" />.
        The bottom row superposes all prime contributions: this is the <InlineMath tex="\\rho" />-th term in the explicit formula.
        Different zeros excite different patterns across the prime oscillators, but the frequencies{' '}
        <InlineMath tex="\\omega_p = \\log p" /> are fixed &mdash; only the driving frequency <InlineMath tex="\\gamma_n" /> changes.
        <strong> Look for:</strong> small primes making large, slow oscillations; larger primes vibrating faster with smaller amplitude.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Zeta Zero</label>
          <select value={zeroIndex} onChange={e => setZeroIndex(+e.target.value)}>
            {ZETA_ZEROS.slice(0, 100).map((z, i) => (
              <option key={i} value={i}>γ_{i + 1} = {z.toFixed(3)}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes}</span>
        </div>
        <div className="control-group">
          <label>Speed</label>
          <input type="range" min="0.1" max="5" step="0.1" value={speed}
            onChange={e => setSpeed(+e.target.value)} />
          <span className="control-value">{speed.toFixed(1)}x</span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border)',
            background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
            color: isPlaying ? '#ef4444' : '#10b981', cursor: 'pointer', fontSize: 13,
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 500 }} />
      </div>
    </div>
  );
}
