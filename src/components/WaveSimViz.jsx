import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { getPrimes, primeFrequency } from '../math/primes.js';
import { oscillatorStage, directLadder, dualLadder, losslessBridge, systemHamiltonian } from '../math/oscillators.js';
import { cAbs, ZETA_ZEROS } from '../math/zeta.js';

const TABS = [
  { id: 'signal', label: 'Signal Flow' },
  { id: 'perPrime', label: 'Per-Prime Waves' },
  { id: 'interference', label: 'Wave Interference' },
  { id: 'delay', label: 'Phase & Delay' },
  { id: 'circuit', label: 'Component Diagram' },
];

// ─── Tab 1: Signal Flow (Canvas) ───────────────────────────────────────
function SignalFlowTab({ sigma, t, numPrimes, playing }) {
  const canvasRef = useRef();
  const animRef = useRef();
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const s = [sigma, t];
    const bridge = losslessBridge(s);
    const direct = directLadder(s, numPrimes);
    const dual = dualLadder(s, numPrimes);
    const primes = getPrimes(numPrimes);
    const time = timeRef.current;

    const xDir = W * 0.2;
    const xBridge = W * 0.5;
    const xDual = W * 0.8;
    const yTop = 50;
    const yBot = H - 30;
    const ySpacing = (yBot - yTop) / (numPrimes + 1);

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Column labels
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('DIRECT ζ(s)', xDir, 20);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('BRIDGE χ(s)', xBridge, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('DUAL ζ(1−s)', xDual, 20);

    // Bridge status
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = bridge.isUnitary ? '#10b981' : '#ef4444';
    ctx.fillText(bridge.isUnitary ? 'LOSSLESS' : `LOSSY |χ|=${bridge.magnitude.toFixed(3)}`, xBridge, 35);

    // Reflection coefficient (amplitude ratio); power = Γ²
    const reflCoeff = bridge.reflectionCoeff;
    const transCoeff = Math.sqrt(1 - reflCoeff * reflCoeff);

    // Draw vertical wires
    ctx.strokeStyle = 'rgba(59,130,246,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xDir, yTop);
    ctx.lineTo(xDir, yBot);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(245,158,11,0.3)';
    ctx.beginPath();
    ctx.moveTo(xDual, yTop);
    ctx.lineTo(xDual, yBot);
    ctx.stroke();

    // Bridge column
    ctx.strokeStyle = bridge.isUnitary ? 'rgba(139,92,246,0.3)' : 'rgba(239,68,68,0.3)';
    ctx.fillStyle = bridge.isUnitary ? 'rgba(139,92,246,0.05)' : 'rgba(239,68,68,0.05)';
    ctx.lineWidth = 1.5;
    const bw = 30;
    ctx.beginPath();
    ctx.roundRect(xBridge - bw / 2, yTop, bw, yBot - yTop, 12);
    ctx.fill();
    ctx.stroke();

    // Animate signal flow through each prime stage
    primes.forEach((p, i) => {
      const y = yTop + (i + 1) * ySpacing;
      const stageD = direct.stages[i];
      const stageU = dual.stages[i];

      // Phase of signal at this stage
      const phase = time * primeFrequency(p) * 0.5;
      const pulseD = 0.5 + 0.5 * Math.sin(phase);
      const pulseU = 0.5 + 0.5 * Math.sin(phase + stageU.phase - stageD.phase);

      // Direct node
      const rD = 6 + pulseD * 4;
      ctx.beginPath();
      ctx.arc(xDir, y, rD, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(210, 80%, ${40 + pulseD * 30}%, ${0.6 + pulseD * 0.4})`;
      ctx.fill();

      // Dual node
      const rU = 6 + pulseU * 4;
      ctx.beginPath();
      ctx.arc(xDual, y, rU, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(35, 80%, ${40 + pulseU * 30}%, ${0.6 + pulseU * 0.4})`;
      ctx.fill();

      // Transmitted signal: direct → bridge → dual
      const waveX = xDir + (xBridge - xDir) * ((phase % (Math.PI * 2)) / (Math.PI * 2));
      const txAlpha = transCoeff * (0.3 + 0.5 * pulseD);

      // Forward arrow (transmitted)
      ctx.strokeStyle = `rgba(16, 185, 129, ${txAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xDir + rD + 2, y);
      ctx.lineTo(xBridge - bw / 2 - 2, y);
      ctx.stroke();

      // Draw moving pulse dot on the connector
      const dotProgress = (phase % (Math.PI * 2)) / (Math.PI * 2);
      const dotX1 = xDir + rD + 2 + dotProgress * (xBridge - bw / 2 - xDir - rD - 4);
      ctx.beginPath();
      ctx.arc(dotX1, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${0.5 + transCoeff * 0.5})`;
      ctx.fill();

      // Bridge → Dual arrow
      ctx.strokeStyle = `rgba(16, 185, 129, ${txAlpha})`;
      ctx.beginPath();
      ctx.moveTo(xBridge + bw / 2 + 2, y);
      ctx.lineTo(xDual - rU - 2, y);
      ctx.stroke();

      const dotX2 = xBridge + bw / 2 + 2 + dotProgress * (xDual - rU - xBridge - bw / 2 - 4);
      ctx.beginPath();
      ctx.arc(dotX2, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${0.5 + transCoeff * 0.5})`;
      ctx.fill();

      // Reflected signal (only visible when bridge is lossy)
      if (reflCoeff > 0.02) {
        const refAlpha = reflCoeff * (0.3 + 0.5 * pulseD);
        const refProgress = 1 - dotProgress;
        const refDotX = xDir + rD + 2 + refProgress * (xBridge - bw / 2 - xDir - rD - 4);

        ctx.beginPath();
        ctx.arc(refDotX, y - 4, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${refAlpha + 0.3})`;
        ctx.fill();
      }

      // Prime label
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`p=${p}`, xDir, y + rD + 12);
    });

    // Energy flow legend (power fractions: P_t = 1-Γ², P_r = Γ²)
    const reflPower = reflCoeff * reflCoeff;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Transmitted: ${((1 - reflPower) * 100).toFixed(1)}%`, 12, H - 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`Reflected: ${(reflPower * 100).toFixed(1)}%`, 160, H - 10);

  }, [sigma, t, numPrimes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = Math.max(400, 80 + numPrimes * 34);

    if (playing) {
      const animate = () => {
        timeRef.current += 0.08;
        draw();
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw();
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw, playing, numPrimes]);

  return <canvas ref={canvasRef} style={{ width: '100%', borderRadius: 8 }} />;
}

// ─── Tab 2: Per-Prime Waves (SVG) ──────────────────────────────────────
function PerPrimeWavesTab({ sigma, t, numPrimes }) {
  const svgRef = useRef();

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 900;
    const rowH = 48;
    const height = 60 + numPrimes * rowH;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const s = [sigma, t];
    const sDual = [1 - sigma, -t];
    const primes = getPrimes(numPrimes);
    const bridge = losslessBridge(s);

    const colLeft = 80;
    const colMid = width / 2;
    const colRight = width - 80;
    const waveW = (colMid - colLeft - 40) / 2;

    // Header
    svg.append('text').attr('x', (colLeft + colMid) / 2 - 20).attr('y', 20)
      .attr('text-anchor', 'middle').attr('fill', '#3b82f6').attr('font-size', 11).attr('font-weight', 600)
      .text('Direct Wave');
    svg.append('text').attr('x', colMid).attr('y', 20)
      .attr('text-anchor', 'middle').attr('fill', '#8b5cf6').attr('font-size', 11).attr('font-weight', 600)
      .text('Match');
    svg.append('text').attr('x', (colMid + colRight) / 2 + 20).attr('y', 20)
      .attr('text-anchor', 'middle').attr('fill', '#f59e0b').attr('font-size', 11).attr('font-weight', 600)
      .text('Dual Wave');

    primes.forEach((p, i) => {
      const yCenter = 50 + i * rowH + rowH / 2;
      const stageD = oscillatorStage(p, s);
      const stageU = oscillatorStage(p, sDual);

      // Prime label
      svg.append('text').attr('x', 16).attr('y', yCenter + 4)
        .attr('fill', '#94a3b8').attr('font-size', 10).attr('font-weight', 600)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(`p=${p}`);

      // Separator line
      svg.append('line')
        .attr('x1', colLeft - 10).attr('y1', 50 + i * rowH)
        .attr('x2', colRight + 10).attr('y2', 50 + i * rowH)
        .attr('stroke', '#1a1f36').attr('stroke-width', 0.5);

      // Direct wave
      const wavePoints = 60;
      const directWave = d3.range(wavePoints).map(j => {
        const x = colLeft + (j / wavePoints) * (colMid - colLeft - 30);
        const phase = (j / wavePoints) * Math.PI * 4;
        const amp = stageD.magnitude * Math.sin(phase + stageD.phase);
        return { x, y: yCenter - amp * (rowH * 0.35) };
      });

      svg.append('path')
        .datum(directWave)
        .attr('d', d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 1.5)
        .attr('opacity', 0.8);

      // Dual wave
      const dualWave = d3.range(wavePoints).map(j => {
        const x = colMid + 30 + (j / wavePoints) * (colRight - colMid - 30);
        const phase = (j / wavePoints) * Math.PI * 4;
        const amp = stageU.magnitude * Math.sin(phase + stageU.phase);
        return { x, y: yCenter - amp * (rowH * 0.35) };
      });

      svg.append('path')
        .datum(dualWave)
        .attr('d', d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
        .attr('opacity', 0.8);

      // Impedance match indicator in center
      const matchRatio = Math.min(stageD.magnitude, stageU.magnitude) / Math.max(stageD.magnitude, stageU.magnitude, 0.001);
      const matchColor = d3.interpolateRgb('#ef4444', '#10b981')(matchRatio);
      const barH = matchRatio * (rowH * 0.6);

      svg.append('rect')
        .attr('x', colMid - 6).attr('y', yCenter - barH / 2)
        .attr('width', 12).attr('height', barH)
        .attr('rx', 3).attr('fill', matchColor).attr('opacity', 0.7);

      // Amplitude labels
      svg.append('text').attr('x', colLeft).attr('y', yCenter + rowH / 2 - 4)
        .attr('fill', '#3b82f6').attr('font-size', 8).attr('font-family', 'JetBrains Mono, monospace')
        .text(`A=${stageD.magnitude.toFixed(2)}`);

      svg.append('text').attr('x', colRight).attr('y', yCenter + rowH / 2 - 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#f59e0b').attr('font-size', 8).attr('font-family', 'JetBrains Mono, monospace')
        .text(`A=${stageU.magnitude.toFixed(2)}`);
    });

  }, [sigma, t, numPrimes]);

  useEffect(() => { draw(); }, [draw]);

  const svgH = 60 + numPrimes * 48;
  return <svg ref={svgRef} style={{ width: '100%', height: svgH }} />;
}

// ─── Tab 3: Wave Interference (Canvas) ─────────────────────────────────
function WaveInterferenceTab({ sigma, t, numPrimes, playing }) {
  const canvasRef = useRef();
  const animRef = useRef();
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const s = [sigma, t];
    const sDual = [1 - sigma, -t];
    const primes = getPrimes(numPrimes);
    const time = timeRef.current;

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    const panelH = (H - 80) / 3;
    const margin = 40;

    // Three panels: Direct, Dual, Difference
    const panels = [
      { label: 'Direct Ladder Superposition', color: '#3b82f6', y: 20 },
      { label: 'Dual Ladder Superposition', color: '#f59e0b', y: 20 + panelH + 10 },
      { label: '|Direct − Dual| Difference', color: '#10b981', y: 20 + (panelH + 10) * 2 },
    ];

    const xPoints = 400;
    const directWave = new Float64Array(xPoints);
    const dualWave = new Float64Array(xPoints);

    // Precompute per-prime stage data once (independent of x-position)
    const stageData = primes.map(p => {
      const stD = oscillatorStage(p, s);
      const stU = oscillatorStage(p, sDual);
      const omega = primeFrequency(p);
      return { magD: stD.magnitude, phD: stD.phase, magU: stU.magnitude, phU: stU.phase, omega };
    });

    // Compute superposition waves
    for (let j = 0; j < xPoints; j++) {
      const phase = (j / xPoints) * Math.PI * 8;
      let dSum = 0, uSum = 0;
      stageData.forEach(({ magD, phD, magU, phU, omega }) => {
        dSum += magD * Math.sin(omega * phase + phD + time * omega * 0.3);
        uSum += magU * Math.sin(omega * phase + phU + time * omega * 0.3);
      });
      directWave[j] = dSum / numPrimes;
      dualWave[j] = uSum / numPrimes;
    }

    // Find max for normalization
    let maxVal = 0.001;
    for (let j = 0; j < xPoints; j++) {
      maxVal = Math.max(maxVal, Math.abs(directWave[j]), Math.abs(dualWave[j]));
    }

    panels.forEach((panel, pi) => {
      const py = panel.y;
      const mid = py + panelH / 2;

      // Panel background
      ctx.fillStyle = 'rgba(26,31,54,0.4)';
      ctx.fillRect(margin, py, W - margin * 2, panelH);

      // Zero line
      ctx.strokeStyle = 'rgba(100,116,139,0.3)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(margin, mid);
      ctx.lineTo(W - margin, mid);
      ctx.stroke();

      // Label
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = panel.color;
      ctx.textAlign = 'left';
      ctx.fillText(panel.label, margin + 8, py + 16);

      // Draw wave
      ctx.strokeStyle = panel.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let j = 0; j < xPoints; j++) {
        const x = margin + (j / xPoints) * (W - margin * 2);
        let val;
        if (pi === 0) val = directWave[j];
        else if (pi === 1) val = dualWave[j];
        else val = Math.abs(directWave[j] - dualWave[j]);
        const y = mid - (val / maxVal) * (panelH * 0.4);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // For difference panel, fill area
      if (pi === 2) {
        ctx.fillStyle = 'rgba(16,185,129,0.1)';
        ctx.beginPath();
        ctx.moveTo(margin, mid);
        for (let j = 0; j < xPoints; j++) {
          const x = margin + (j / xPoints) * (W - margin * 2);
          const val = Math.abs(directWave[j] - dualWave[j]);
          ctx.lineTo(x, mid - (val / maxVal) * (panelH * 0.4));
        }
        ctx.lineTo(W - margin, mid);
        ctx.closePath();
        ctx.fill();

        // RMS difference
        let rms = 0;
        for (let j = 0; j < xPoints; j++) rms += (directWave[j] - dualWave[j]) ** 2;
        rms = Math.sqrt(rms / xPoints);
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillStyle = rms < 0.01 ? '#10b981' : '#ef4444';
        ctx.textAlign = 'right';
        ctx.fillText(`RMS diff: ${rms.toFixed(4)}`, W - margin - 8, py + 16);
      }
    });

  }, [sigma, t, numPrimes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 500;

    if (playing) {
      const animate = () => {
        timeRef.current += 0.06;
        draw();
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw();
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw, playing]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 500, borderRadius: 8 }} />;
}

// ─── Tab 4: Phase & Delay (SVG) ────────────────────────────────────────
function PhaseDelayTab({ sigma, t, numPrimes }) {
  const svgRef = useRef();

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 900;
    const height = 420;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const s = [sigma, t];
    const sDual = [1 - sigma, -t];
    const primes = getPrimes(numPrimes);

    // Compute group delays numerically
    // Phase unwrap helper: atan2 jumps by ±2π at the ±π boundary, which
    // would produce a ~2π/2δ ≈ 3141 error in the finite-difference derivative.
    const unwrapDiff = (a, b) => {
      let d = a - b;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      return d;
    };
    const delta = 0.001;
    const delays = primes.map(p => {
      const stDp = oscillatorStage(p, [sigma, t + delta]);
      const stDm = oscillatorStage(p, [sigma, t - delta]);
      const delayD = -unwrapDiff(stDp.phase, stDm.phase) / (2 * delta);

      const stUp = oscillatorStage(p, [1 - sigma, -(t + delta)]);
      const stUm = oscillatorStage(p, [1 - sigma, -(t - delta)]);
      const delayU = -unwrapDiff(stUp.phase, stUm.phase) / (2 * delta);

      return { prime: p, delayDirect: Math.abs(delayD), delayDual: Math.abs(delayU) };
    });

    const maxDelay = Math.max(0.01, d3.max(delays, d => Math.max(d.delayDirect, d.delayDual)));

    const margin = { top: 40, right: 60, bottom: 50, left: 60 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(primes.map(String)).range([0, chartW]).padding(0.3);
    const y = d3.scaleLinear().domain([0, maxDelay * 1.15]).range([chartH, 0]);

    // Axes
    g.append('g').attr('transform', `translate(0,${chartH})`)
      .call(d3.axisBottom(x).tickFormat(d => `p=${d}`))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format('.3f')))
      .selectAll('text').attr('fill', '#64748b');

    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Y-axis label
    svg.append('text').attr('x', 14).attr('y', height / 2)
      .attr('text-anchor', 'middle').attr('transform', `rotate(-90,14,${height / 2})`)
      .attr('fill', '#64748b').attr('font-size', 10)
      .text('Group Delay τ (s)');

    // Bar width
    const barW = x.bandwidth() / 2 - 1;

    // Direct delay bars (left half)
    delays.forEach(d => {
      const bx = x(String(d.prime));
      g.append('rect')
        .attr('x', bx).attr('y', y(d.delayDirect))
        .attr('width', barW).attr('height', chartH - y(d.delayDirect))
        .attr('rx', 2).attr('fill', '#3b82f6').attr('opacity', 0.8);
    });

    // Dual delay bars (right half)
    delays.forEach(d => {
      const bx = x(String(d.prime)) + barW + 2;
      g.append('rect')
        .attr('x', bx).attr('y', y(d.delayDual))
        .attr('width', barW).attr('height', chartH - y(d.delayDual))
        .attr('rx', 2).attr('fill', '#f59e0b').attr('opacity', 0.8);
    });

    // Cumulative delay lines
    let cumD = 0, cumU = 0;
    const cumDirectPts = [];
    const cumDualPts = [];
    delays.forEach(d => {
      cumD += d.delayDirect;
      cumU += d.delayDual;
      const bx = x(String(d.prime)) + x.bandwidth() / 2;
      cumDirectPts.push({ x: bx, y: cumD });
      cumDualPts.push({ x: bx, y: cumU });
    });

    const maxCum = Math.max(cumD, cumU, 0.01);
    const yCum = d3.scaleLinear().domain([0, maxCum * 1.15]).range([chartH, 0]);

    // Cumulative delay lines with right y-axis
    const lineGen = d3.line().x(d => d.x).y(d => yCum(d.y)).curve(d3.curveMonotoneX);

    g.append('path').datum(cumDirectPts)
      .attr('d', lineGen)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3');

    g.append('path').datum(cumDualPts)
      .attr('d', lineGen)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3');

    // Right y-axis for cumulative delay
    const rightAxis = g.append('g').attr('transform', `translate(${chartW},0)`)
      .call(d3.axisRight(yCum).ticks(5).tickFormat(d3.format('.2f')));
    rightAxis.selectAll('text').attr('fill', '#94a3b8').attr('font-size', 9);
    rightAxis.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    svg.append('text').attr('x', width - 10).attr('y', height / 2)
      .attr('text-anchor', 'middle').attr('transform', `rotate(90,${width - 10},${height / 2})`)
      .attr('fill', '#94a3b8').attr('font-size', 10)
      .text('Cumulative Delay (dashed)');

    // Legend
    const lgX = width - margin.right - 220;
    // Bar swatches for per-prime delays
    [[0, '#3b82f6', 'Direct (per-prime)'], [1, '#f59e0b', 'Dual (per-prime)']].forEach(([i, c, l]) => {
      svg.append('rect').attr('x', lgX).attr('y', 12 + i * 16).attr('width', 12).attr('height', 10)
        .attr('rx', 2).attr('fill', c).attr('opacity', 0.8);
      svg.append('text').attr('x', lgX + 18).attr('y', 20 + i * 16)
        .attr('fill', '#94a3b8').attr('font-size', 10).text(l);
    });
    // Dashed line swatches for cumulative delays
    [[2, '#3b82f6', 'Direct (cumulative)'], [3, '#f59e0b', 'Dual (cumulative)']].forEach(([i, c, l]) => {
      svg.append('line').attr('x1', lgX).attr('y1', 17 + i * 16).attr('x2', lgX + 12).attr('y2', 17 + i * 16)
        .attr('stroke', c).attr('stroke-width', 2).attr('stroke-dasharray', '4,3');
      svg.append('text').attr('x', lgX + 18).attr('y', 20 + i * 16)
        .attr('fill', '#94a3b8').attr('font-size', 10).text(l);
    });

    // Symmetry indicator
    const asymmetry = Math.abs(cumD - cumU) / Math.max(cumD, cumU, 0.001);
    svg.append('text').attr('x', width / 2).attr('y', height - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', asymmetry < 0.05 ? '#10b981' : '#ef4444')
      .attr('font-size', 11).attr('font-weight', 600)
      .text(`Delay asymmetry: ${(asymmetry * 100).toFixed(1)}% ${asymmetry < 0.05 ? '(symmetric at σ=½)' : '(asymmetric — σ≠½)'}`);

  }, [sigma, t, numPrimes]);

  useEffect(() => { draw(); }, [draw]);

  return <svg ref={svgRef} style={{ width: '100%', height: 420 }} />;
}

// ─── Tab 5: Component Diagram (SVG) ────────────────────────────────────
function ComponentDiagramTab({ sigma, t, numPrimes }) {
  const svgRef = useRef();
  const [zoomLevel, setZoomLevel] = useState('full'); // 'single', 'ladder', 'full'

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 900;
    const height = 420;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const s = [sigma, t];
    const primes = getPrimes(numPrimes);
    const bridge = losslessBridge(s);

    if (zoomLevel === 'single') {
      // Single LC resonator for prime p=2
      const p = primes[0];
      const stage = oscillatorStage(p, s);
      const cx = width / 2;
      const cy = height / 2;

      // Title
      svg.append('text').attr('x', cx).attr('y', 30)
        .attr('text-anchor', 'middle').attr('fill', '#e2e8f0')
        .attr('font-size', 14).attr('font-weight', 600)
        .text(`Single Prime Oscillator: p = ${p}`);

      // Input terminal
      svg.append('line').attr('x1', cx - 200).attr('y1', cy).attr('x2', cx - 120).attr('y2', cy)
        .attr('stroke', '#3b82f6').attr('stroke-width', 2);
      svg.append('text').attr('x', cx - 210).attr('y', cy + 4)
        .attr('text-anchor', 'end').attr('fill', '#3b82f6').attr('font-size', 11).text('IN');

      // Inductor (coil symbol)
      const coilY = cy;
      const coilX = cx - 60;
      svg.append('path')
        .attr('d', `M${cx - 120},${coilY} Q${cx - 110},${coilY - 20} ${cx - 100},${coilY} Q${cx - 90},${coilY + 20} ${cx - 80},${coilY} Q${cx - 70},${coilY - 20} ${cx - 60},${coilY}`)
        .attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 2);

      svg.append('text').attr('x', cx - 90).attr('y', cy - 28)
        .attr('text-anchor', 'middle').attr('fill', '#06b6d4').attr('font-size', 11)
        .text(`L = log(${p}) = ${stage.inductance.toFixed(3)}`);

      // Wire between L and C
      svg.append('line').attr('x1', cx - 60).attr('y1', cy).attr('x2', cx + 60).attr('y2', cy)
        .attr('stroke', '#64748b').attr('stroke-width', 1);

      // Capacitor (two parallel lines)
      svg.append('line').attr('x1', cx + 60).attr('y1', cy).attr('x2', cx + 60).attr('y2', cy - 30)
        .attr('stroke', '#64748b').attr('stroke-width', 1);
      svg.append('line').attr('x1', cx + 48).attr('y1', cy - 30).attr('x2', cx + 72).attr('y2', cy - 30)
        .attr('stroke', '#f59e0b').attr('stroke-width', 3);
      svg.append('line').attr('x1', cx + 48).attr('y1', cy - 38).attr('x2', cx + 72).attr('y2', cy - 38)
        .attr('stroke', '#f59e0b').attr('stroke-width', 3);
      svg.append('line').attr('x1', cx + 60).attr('y1', cy - 38).attr('x2', cx + 60).attr('y2', cy - 60)
        .attr('stroke', '#64748b').attr('stroke-width', 1);

      svg.append('text').attr('x', cx + 85).attr('y', cy - 32)
        .attr('fill', '#f59e0b').attr('font-size', 11)
        .text(`C = 1/log(${p}) = ${stage.capacitance.toFixed(3)}`);

      // Ground
      svg.append('line').attr('x1', cx + 50).attr('y1', cy - 60).attr('x2', cx + 70).attr('y2', cy - 60)
        .attr('stroke', '#64748b').attr('stroke-width', 2);
      svg.append('line').attr('x1', cx + 54).attr('y1', cy - 64).attr('x2', cx + 66).attr('y2', cy - 64)
        .attr('stroke', '#64748b').attr('stroke-width', 1.5);
      svg.append('line').attr('x1', cx + 57).attr('y1', cy - 68).attr('x2', cx + 63).attr('y2', cy - 68)
        .attr('stroke', '#64748b').attr('stroke-width', 1);

      // Output terminal
      svg.append('line').attr('x1', cx + 120).attr('y1', cy).attr('x2', cx + 200).attr('y2', cy)
        .attr('stroke', '#3b82f6').attr('stroke-width', 2);
      // continue wire from capacitor node
      svg.append('line').attr('x1', cx + 60).attr('y1', cy).attr('x2', cx + 120).attr('y2', cy)
        .attr('stroke', '#64748b').attr('stroke-width', 1);
      svg.append('text').attr('x', cx + 210).attr('y', cy + 4)
        .attr('fill', '#3b82f6').attr('font-size', 11).text('OUT');

      // Stats box
      const stats = [
        `ω = log(${p}) = ${stage.frequency.toFixed(4)}`,
        `|H(s)| = ${stage.magnitude.toFixed(4)}`,
        `Q = ${stage.Q.toFixed(2)}`,
        `Z = ${cAbs(stage.impedance).toFixed(3)}`,
        `φ = ${(stage.phase * 180 / Math.PI).toFixed(1)}°`,
      ];
      stats.forEach((txt, j) => {
        svg.append('text').attr('x', cx - 160).attr('y', cy + 80 + j * 18)
          .attr('fill', '#94a3b8').attr('font-size', 11)
          .attr('font-family', 'JetBrains Mono, monospace')
          .text(txt);
      });

    } else if (zoomLevel === 'ladder') {
      // Single ladder: series cascade of LC stages
      const direct = directLadder(s, Math.min(numPrimes, 8));
      const stageW = Math.min(90, (width - 120) / Math.min(numPrimes, 8));

      svg.append('text').attr('x', width / 2).attr('y', 24)
        .attr('text-anchor', 'middle').attr('fill', '#e2e8f0')
        .attr('font-size', 14).attr('font-weight', 600)
        .text('Direct Ladder: Series LC Cascade');

      const cy = height / 2;
      const xStart = 50;

      // Input
      svg.append('text').attr('x', xStart - 10).attr('y', cy + 4)
        .attr('text-anchor', 'end').attr('fill', '#3b82f6').attr('font-size', 11).text('IN');

      direct.stages.slice(0, 8).forEach((stage, i) => {
        const bx = xStart + i * stageW;
        const bw = stageW * 0.7;

        // Stage box
        svg.append('rect')
          .attr('x', bx + 5).attr('y', cy - 35).attr('width', bw).attr('height', 70)
          .attr('rx', 6)
          .attr('fill', 'rgba(59,130,246,0.08)')
          .attr('stroke', '#3b82f6').attr('stroke-width', 1);

        // Prime label
        svg.append('text').attr('x', bx + 5 + bw / 2).attr('y', cy - 18)
          .attr('text-anchor', 'middle').attr('fill', '#3b82f6')
          .attr('font-size', 12).attr('font-weight', 700)
          .text(`p=${stage.prime}`);

        // Wire connecting stages
        if (i > 0) {
          svg.append('line')
            .attr('x1', bx).attr('y1', cy)
            .attr('x2', bx + 5).attr('y2', cy)
            .attr('stroke', '#3b82f6').attr('stroke-width', 1.5);
        } else {
          svg.append('line')
            .attr('x1', xStart - 5).attr('y1', cy)
            .attr('x2', bx + 5).attr('y2', cy)
            .attr('stroke', '#3b82f6').attr('stroke-width', 1.5);
        }

        // Values inside box
        svg.append('text').attr('x', bx + 5 + bw / 2).attr('y', cy)
          .attr('text-anchor', 'middle').attr('fill', '#06b6d4').attr('font-size', 8)
          .attr('font-family', 'JetBrains Mono, monospace')
          .text(`L=${stage.inductance.toFixed(2)}`);
        svg.append('text').attr('x', bx + 5 + bw / 2).attr('y', cy + 14)
          .attr('text-anchor', 'middle').attr('fill', '#f59e0b').attr('font-size', 8)
          .attr('font-family', 'JetBrains Mono, monospace')
          .text(`C=${stage.capacitance.toFixed(2)}`);

        // Magnitude below
        svg.append('text').attr('x', bx + 5 + bw / 2).attr('y', cy + 52)
          .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 8)
          .text(`|H|=${stage.cumulativeMagnitude.toFixed(2)}`);
      });

      // Output
      const lastX = xStart + Math.min(numPrimes, 8) * stageW;
      svg.append('line')
        .attr('x1', lastX - stageW * 0.3 + 5).attr('y1', cy)
        .attr('x2', lastX + 20).attr('y2', cy)
        .attr('stroke', '#3b82f6').attr('stroke-width', 1.5);
      svg.append('text').attr('x', lastX + 30).attr('y', cy + 4)
        .attr('fill', '#3b82f6').attr('font-size', 11).text('OUT');

      // Total magnitude
      svg.append('text').attr('x', width / 2).attr('y', height - 20)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text(`Total |ζ(s)| = ${direct.totalMagnitude.toFixed(4)} (${Math.min(numPrimes, 8)} primes)`);

    } else {
      // Full system: twin ladders + bridge
      svg.append('text').attr('x', width / 2).attr('y', 24)
        .attr('text-anchor', 'middle').attr('fill', '#e2e8f0')
        .attr('font-size', 14).attr('font-weight', 600)
        .text('Full System: Twin Ladders + Bridge');

      const cy = height / 2;
      const ladderW = width * 0.32;
      const bridgeW = width * 0.16;
      const xL = 40;
      const xB = width / 2 - bridgeW / 2;
      const xR = width - 40 - ladderW;

      // Direct ladder box
      svg.append('rect')
        .attr('x', xL).attr('y', cy - 50).attr('width', ladderW).attr('height', 100)
        .attr('rx', 8)
        .attr('fill', 'rgba(59,130,246,0.08)')
        .attr('stroke', '#3b82f6').attr('stroke-width', 2);
      svg.append('text').attr('x', xL + ladderW / 2).attr('y', cy - 20)
        .attr('text-anchor', 'middle').attr('fill', '#3b82f6')
        .attr('font-size', 13).attr('font-weight', 700)
        .text('DIRECT LADDER');
      svg.append('text').attr('x', xL + ladderW / 2).attr('y', cy + 2)
        .attr('text-anchor', 'middle').attr('fill', '#3b82f6')
        .attr('font-size', 11)
        .text('ζ(s) = ∏ₚ (1−p⁻ˢ)⁻¹');
      svg.append('text').attr('x', xL + ladderW / 2).attr('y', cy + 22)
        .attr('text-anchor', 'middle').attr('fill', '#64748b')
        .attr('font-size', 10).attr('font-family', 'JetBrains Mono, monospace')
        .text(`${numPrimes} prime stages`);

      // Bridge box
      const bridgeColor = bridge.isUnitary ? '#8b5cf6' : '#ef4444';
      svg.append('rect')
        .attr('x', xB).attr('y', cy - 50).attr('width', bridgeW).attr('height', 100)
        .attr('rx', 8)
        .attr('fill', bridge.isUnitary ? 'rgba(139,92,246,0.1)' : 'rgba(239,68,68,0.1)')
        .attr('stroke', bridgeColor).attr('stroke-width', 2);
      svg.append('text').attr('x', xB + bridgeW / 2).attr('y', cy - 20)
        .attr('text-anchor', 'middle').attr('fill', bridgeColor)
        .attr('font-size', 12).attr('font-weight', 700)
        .text('BRIDGE');
      svg.append('text').attr('x', xB + bridgeW / 2).attr('y', cy)
        .attr('text-anchor', 'middle').attr('fill', bridgeColor)
        .attr('font-size', 11)
        .text('χ(s)');
      svg.append('text').attr('x', xB + bridgeW / 2).attr('y', cy + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', bridge.isUnitary ? '#10b981' : '#ef4444')
        .attr('font-size', 10).attr('font-weight', 600)
        .text(bridge.isUnitary ? 'LOSSLESS' : `LOSSY`);
      svg.append('text').attr('x', xB + bridgeW / 2).attr('y', cy + 35)
        .attr('text-anchor', 'middle').attr('fill', '#64748b')
        .attr('font-size', 9).attr('font-family', 'JetBrains Mono, monospace')
        .text(`|χ|=${bridge.magnitude.toFixed(3)}, Γ=${bridge.reflectionCoeff.toFixed(3)}`);

      // Dual ladder box
      svg.append('rect')
        .attr('x', xR).attr('y', cy - 50).attr('width', ladderW).attr('height', 100)
        .attr('rx', 8)
        .attr('fill', 'rgba(245,158,11,0.08)')
        .attr('stroke', '#f59e0b').attr('stroke-width', 2);
      svg.append('text').attr('x', xR + ladderW / 2).attr('y', cy - 20)
        .attr('text-anchor', 'middle').attr('fill', '#f59e0b')
        .attr('font-size', 13).attr('font-weight', 700)
        .text('DUAL LADDER');
      svg.append('text').attr('x', xR + ladderW / 2).attr('y', cy + 2)
        .attr('text-anchor', 'middle').attr('fill', '#f59e0b')
        .attr('font-size', 11)
        .text('ζ(1−s) = ∏ₚ (1−p^(s−1))⁻¹');
      svg.append('text').attr('x', xR + ladderW / 2).attr('y', cy + 22)
        .attr('text-anchor', 'middle').attr('fill', '#64748b')
        .attr('font-size', 10).attr('font-family', 'JetBrains Mono, monospace')
        .text(`${numPrimes} prime stages`);

      // Connecting arrows
      const arrowY = cy;
      // Direct → Bridge
      svg.append('line')
        .attr('x1', xL + ladderW).attr('y1', arrowY)
        .attr('x2', xB).attr('y2', arrowY)
        .attr('stroke', '#3b82f6').attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowBlue)');

      // Bridge → Dual
      svg.append('line')
        .attr('x1', xB + bridgeW).attr('y1', arrowY)
        .attr('x2', xR).attr('y2', arrowY)
        .attr('stroke', '#f59e0b').attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowGold)');

      // Arrow markers
      const defs = svg.append('defs');
      [['arrowBlue', '#3b82f6'], ['arrowGold', '#f59e0b']].forEach(([id, color]) => {
        defs.append('marker').attr('id', id)
          .attr('viewBox', '0 0 10 6').attr('refX', 10).attr('refY', 3)
          .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
          .append('path').attr('d', 'M0,0 L10,3 L0,6 Z').attr('fill', color);
      });

      // Impedance mismatch indicator
      const ham = systemHamiltonian(s, numPrimes);
      const mismatchColor = ham.bridgeCoupling < 1 ? '#10b981' : '#ef4444';
      svg.append('text').attr('x', width / 2).attr('y', cy + 80)
        .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11)
        .text(`Hamiltonian: H = ${ham.total.toFixed(4)}`);
      svg.append('text').attr('x', width / 2).attr('y', cy + 96)
        .attr('text-anchor', 'middle').attr('fill', mismatchColor).attr('font-size', 10)
        .text(`Kinetic: ${ham.kinetic.toFixed(3)} | Mismatch: ${ham.potential.toFixed(3)} | Bridge: ${ham.bridgeCoupling.toFixed(3)}`);

      // Functional equation
      svg.append('text').attr('x', width / 2).attr('y', height - 20)
        .attr('text-anchor', 'middle').attr('fill', '#8b5cf6').attr('font-size', 12)
        .text('ζ(s) = χ(s) · ζ(1−s)');
    }

  }, [sigma, t, numPrimes, zoomLevel]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[['single', 'Single Prime'], ['ladder', 'Ladder Chain'], ['full', 'Full System']].map(([id, label]) => (
          <button key={id}
            className={`tab-btn ${zoomLevel === id ? 'tab-active' : ''}`}
            onClick={() => setZoomLevel(id)}
          >{label}</button>
        ))}
      </div>
      <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
    </div>
  );
}

// ─── Main WaveSimViz Component ─────────────────────────────────────────
export default function WaveSimViz() {
  const [tab, setTab] = useState('signal');
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(8);
  const [playing, setPlaying] = useState(true);

  // Color the sigma slider based on distance from 0.5
  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      {/* Shared controls */}
      <div className="controls">
        <div className="control-group">
          <label style={{ color: sigmaColor, fontWeight: 600 }}>
            <InlineMath tex="\sigma = \operatorname{Re}(s)" />
          </label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
          <input type="range" min="1" max="60" step="0.1" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
          {(() => {
            let bestIdx = 0, bestDist = Math.abs(t - ZETA_ZEROS[0]);
            for (let i = 1; i < ZETA_ZEROS.length; i++) {
              const d = Math.abs(t - ZETA_ZEROS[i]);
              if (d < bestDist) { bestDist = d; bestIdx = i; }
              if (ZETA_ZEROS[i] > t + 2) break;
            }
            return bestDist < 1 ? (
              <span style={{
                marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                color: bestDist < 0.3 ? '#10b981' : '#64748b',
              }}>
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="3" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        {(tab === 'signal' || tab === 'interference') && (
          <div className="control-group">
            <button
              className={`tab-btn ${playing ? 'tab-active' : ''}`}
              onClick={() => setPlaying(p => !p)}
              style={{ minWidth: 70 }}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>
        )}
      </div>

      {/* Sigma status indicator */}
      <div style={{
        padding: '6px 14px', marginBottom: 12, borderRadius: 8,
        background: sigmaDeviation < 0.02 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${sigmaColor}33`,
        fontSize: 12, color: sigmaColor, fontWeight: 500,
        textAlign: 'center',
      }}>
        {sigmaDeviation < 0.02
          ? 'σ ≈ 0.5 — Critical line: bridge is lossless, ladders are impedance-matched'
          : `σ = ${sigma.toFixed(2)} — Off critical line: bridge pressure P = ${((1 - losslessBridge([sigma, t]).magnitude) ** 2).toFixed(4)}, reflection Γ = ${losslessBridge([sigma, t]).reflectionCoeff.toFixed(3)}`
        }
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {TABS.map(tb => (
          <button key={tb.id}
            className={`tab-btn ${tab === tb.id ? 'tab-active' : ''}`}
            onClick={() => setTab(tb.id)}
          >{tb.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="viz-container" style={{ marginTop: 12 }}>
        {tab === 'signal' && (
          <>
            <div className="tab-explainer">
              <strong>Signal Flow:</strong> Watch energy pulses travel through the direct ladder, across the bridge, and into the dual ladder.
              At <InlineMath tex="\sigma = 0.5" />, signals pass through the bridge perfectly (green dots). Move <InlineMath tex="\sigma" /> away
              and red reflected dots appear — energy bouncing back from the impedance mismatch.
            </div>
            <SignalFlowTab sigma={sigma} t={t} numPrimes={numPrimes} playing={playing} />
          </>
        )}
        {tab === 'perPrime' && (
          <>
            <div className="tab-explainer">
              <strong>Per-Prime Waves:</strong> Each row shows the waveform through one prime's oscillator stage, for both
              direct (blue, left) and dual (gold, right) ladders. The center bar shows impedance match quality.
              At <InlineMath tex="\sigma = 0.5" />, amplitudes match perfectly; away from it, they diverge.
            </div>
            <PerPrimeWavesTab sigma={sigma} t={t} numPrimes={numPrimes} />
          </>
        )}
        {tab === 'interference' && (
          <>
            <div className="tab-explainer">
              <strong>Wave Interference:</strong> The superposition of all prime oscillators in each ladder. Top: direct ladder wave.
              Middle: dual ladder wave. Bottom: the absolute difference — at <InlineMath tex="\sigma = 0.5" /> this should be near zero
              (matched amplitudes from direct/dual symmetry).
            </div>
            <WaveInterferenceTab sigma={sigma} t={t} numPrimes={numPrimes} playing={playing} />
          </>
        )}
        {tab === 'delay' && (
          <>
            <div className="tab-explainer">
              <strong>Phase & Delay:</strong> Group delay <InlineMath tex="\tau_p = -\partial\phi/\partial\omega" /> for each prime stage.
              Blue bars = direct ladder, gold = dual. At <InlineMath tex="\sigma = 0.5" />, delays are symmetric.
              Dashed lines show cumulative delay building through the cascade.
            </div>
            <PhaseDelayTab sigma={sigma} t={t} numPrimes={numPrimes} />
          </>
        )}
        {tab === 'circuit' && (
          <>
            <div className="tab-explainer">
              <strong>Component Diagram:</strong> The literal circuit schematic at three zoom levels.
              <strong> Single Prime:</strong> one LC resonator. <strong> Ladder:</strong> series cascade of stages.
              <strong> Full System:</strong> twin ladders connected by the bridge two-port network.
              Values update live as you change <InlineMath tex="\sigma" />.
            </div>
            <ComponentDiagramTab sigma={sigma} t={t} numPrimes={numPrimes} />
          </>
        )}
      </div>
    </div>
  );
}
