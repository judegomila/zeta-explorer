import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { InlineMath } from './KaTeXMath.jsx';
import { directLadder, losslessBridge } from '../math/oscillators.js';
import { cMul, cDiv, cAdd, cSub, cAbs, cExp, cPow, zetaCriticalStrip } from '../math/zeta.js';

/**
 * Nyquist plot: trace the loop transfer function L(jω) = χ(s)·ζ(1-s)/ζ(s)
 * around the Nyquist contour. Encirclements of -1 ↔ zeros off critical line.
 */
export default function NyquistBodeViz() {
  const nyquistRef = useRef();
  const bodeRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [tRange, setTRange] = useState([1, 60]);
  const [numPrimes, setNumPrimes] = useState(15);
  const [mode, setMode] = useState('nyquist');

  const computeLoopGain = useCallback((s, nPrimes) => {
    // L(s) = χ(s) * ζ(1-s) / ζ(s)
    // Use Borwein-accelerated zeta for accuracy in the critical strip
    const zetaS = zetaCriticalStrip(s);
    const zeta1mS = zetaCriticalStrip([1 - s[0], -s[1]]);
    const bridge = losslessBridge(s);
    const ratio = cDiv(zeta1mS, zetaS);
    return cMul(bridge.chi, ratio);
  }, []);

  const drawNyquist = useCallback(() => {
    const svg = d3.select(nyquistRef.current);
    svg.selectAll('*').remove();
    const width = nyquistRef.current.clientWidth || 800;
    const height = 520;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Compute Nyquist contour points
    const points = [];
    const steps = 300;
    const dt = (tRange[1] - tRange[0]) / steps;
    for (let i = 0; i <= steps; i++) {
      const t = tRange[0] + i * dt;
      const L = computeLoopGain([sigma, t], numPrimes);
      points.push({ t, re: L[0], im: L[1], mag: cAbs(L) });
    }
    // Negative frequency (mirror)
    const negPoints = [];
    for (let i = 0; i <= steps; i++) {
      const t = -(tRange[0] + i * dt);
      const L = computeLoopGain([sigma, t], numPrimes);
      negPoints.push({ t, re: L[0], im: L[1] });
    }

    const allRe = [...points.map(p => p.re), ...negPoints.map(p => p.re)];
    const allIm = [...points.map(p => p.im), ...negPoints.map(p => p.im)];
    const rBound = Math.max(3, d3.max(allRe.map(Math.abs)) * 1.1);
    const iBound = Math.max(3, d3.max(allIm.map(Math.abs)) * 1.1);
    const bound = Math.min(20, Math.max(rBound, iBound));

    const x = d3.scaleLinear().domain([-bound, bound]).range([0, w]);
    const y = d3.scaleLinear().domain([-bound, bound]).range([h, 0]);

    // Grid
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    g.append('g').call(d3.axisLeft(y).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Axes through origin
    g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
      .attr('stroke', '#2a3050').attr('stroke-width', 1);
    g.append('line').attr('x1', x(0)).attr('y1', 0).attr('x2', x(0)).attr('y2', h)
      .attr('stroke', '#2a3050').attr('stroke-width', 1);

    // Critical point at (-1, 0)
    g.append('circle')
      .attr('cx', x(-1)).attr('cy', y(0)).attr('r', 6)
      .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2);
    g.append('text')
      .attr('x', x(-1)).attr('y', y(0) - 12)
      .attr('text-anchor', 'middle').attr('fill', '#ef4444').attr('font-size', 11).attr('font-weight', 600)
      .text('−1');

    // Unit circle reference
    const circlePoints = d3.range(0, 2 * Math.PI + 0.01, 0.02).map(a => [x(Math.cos(a)), y(Math.sin(a))]);
    g.append('path')
      .datum(circlePoints)
      .attr('d', d3.line())
      .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3');
    g.append('text')
      .attr('x', x(1)).attr('y', y(1) - 6)
      .attr('text-anchor', 'start').attr('fill', '#64748b').attr('font-size', 9)
      .text('|L|=1');

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w - 150}, 6)`);
    const legendBg = legend.append('rect')
      .attr('x', -8).attr('y', -6).attr('width', 156).attr('height', 72).attr('rx', 4)
      .attr('fill', '#0f1729').attr('fill-opacity', 0.85).attr('stroke', '#2a3050');
    const items = [
      { color: 'hsl(240, 80%, 55%)', label: 'Positive freq (ω > 0)', dash: null },
      { color: 'hsl(35, 80%, 55%)', label: 'Negative freq (ω < 0)', dash: null },
      { color: '#64748b', label: 'Unit circle |L|=1', dash: '4,3' },
      { color: '#ef4444', label: 'Critical point −1', dash: null },
    ];
    items.forEach((item, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 16 + 4})`);
      if (item.dash) {
        row.append('line').attr('x1', 0).attr('y1', 4).attr('x2', 16).attr('y2', 4)
          .attr('stroke', item.color).attr('stroke-width', 1.5).attr('stroke-dasharray', item.dash);
      } else if (item.color === '#ef4444') {
        row.append('circle').attr('cx', 8).attr('cy', 4).attr('r', 4)
          .attr('fill', 'none').attr('stroke', item.color).attr('stroke-width', 1.5);
      } else {
        row.append('line').attr('x1', 0).attr('y1', 4).attr('x2', 16).attr('y2', 4)
          .attr('stroke', item.color).attr('stroke-width', 2);
      }
      row.append('text').attr('x', 22).attr('y', 8)
        .attr('fill', '#94a3b8').attr('font-size', 10).text(item.label);
    });

    // Positive frequency contour (blue → cyan gradient)
    const posLine = d3.line().x(d => x(d.re)).y(d => y(d.im)).curve(d3.curveBasis);

    // Draw segments with color gradient based on t
    for (let i = 1; i < points.length; i++) {
      const frac = i / points.length;
      const hue = 210 + frac * 60; // blue to cyan
      g.append('line')
        .attr('x1', x(points[i-1].re)).attr('y1', y(points[i-1].im))
        .attr('x2', x(points[i].re)).attr('y2', y(points[i].im))
        .attr('stroke', `hsl(${hue}, 80%, 55%)`)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);
    }

    // Negative frequency contour (orange)
    for (let i = 1; i < negPoints.length; i++) {
      const frac = i / negPoints.length;
      g.append('line')
        .attr('x1', x(negPoints[i-1].re)).attr('y1', y(negPoints[i-1].im))
        .attr('x2', x(negPoints[i].re)).attr('y2', y(negPoints[i].im))
        .attr('stroke', `hsl(35, 80%, 55%)`)
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    }

    // Start/end markers
    if (points.length > 0) {
      g.append('circle')
        .attr('cx', x(points[0].re)).attr('cy', y(points[0].im)).attr('r', 4)
        .attr('fill', '#3b82f6').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
      g.append('circle')
        .attr('cx', x(points[points.length-1].re)).attr('cy', y(points[points.length-1].im)).attr('r', 4)
        .attr('fill', '#06b6d4').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
    }

    // Labels
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Re[L(s)]');
    svg.append('text')
      .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Im[L(s)]');

    svg.append('text').attr('x', margin.left + 4).attr('y', margin.top + 14)
      .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
      .text('Nyquist Plot of Loop Transfer Function L(s) = χ(s)·ζ(1−s)/ζ(s)');

    svg.append('text').attr('x', margin.left + 4).attr('y', margin.top + 30)
      .attr('fill', sigma === 0.5 ? '#10b981' : '#ef4444').attr('font-size', 11)
      .text(`σ = ${sigma.toFixed(2)} — ${sigma === 0.5 ? 'Critical line: expect 0 encirclements' : 'Off critical line'}`);

  }, [sigma, tRange, numPrimes, computeLoopGain]);

  const drawBode = useCallback(() => {
    const svg = d3.select(bodeRef.current);
    svg.selectAll('*').remove();
    const width = bodeRef.current.clientWidth || 800;
    const height = 520;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const w = width - margin.left - margin.right;
    const halfH = (height - margin.top - margin.bottom - 30) / 2;

    // Compute frequency response
    const points = [];
    const steps = 250;
    const logTMin = Math.log10(Math.max(0.5, tRange[0]));
    const logTMax = Math.log10(tRange[1]);
    const dLogT = (logTMax - logTMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const t = Math.pow(10, logTMin + i * dLogT);
      const L = computeLoopGain([sigma, t], numPrimes);
      const mag = cAbs(L);
      const phase = Math.atan2(L[1], L[0]);
      points.push({ t, magdB: 20 * Math.log10(Math.max(1e-10, mag)), phase: phase * 180 / Math.PI, mag });
    }

    // Magnitude plot
    const gMag = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const xLog = d3.scaleLog().domain([Math.max(0.5, tRange[0]), tRange[1]]).range([0, w]);
    const yMagMax = d3.max(points, d => d.magdB) + 5;
    const yMagMin = d3.min(points, d => d.magdB) - 5;
    const yMag = d3.scaleLinear().domain([yMagMin, yMagMax]).range([halfH, 0]);

    gMag.append('g').attr('transform', `translate(0,${halfH})`)
      .call(d3.axisBottom(xLog).ticks(8, '~s'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gMag.append('g')
      .call(d3.axisLeft(yMag).ticks(6))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gMag.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // 0 dB line
    if (yMagMin < 0 && yMagMax > 0) {
      gMag.append('line')
        .attr('x1', 0).attr('y1', yMag(0)).attr('x2', w).attr('y2', yMag(0))
        .attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '4,4').attr('opacity', 0.5);
      gMag.append('text').attr('x', w - 4).attr('y', yMag(0) - 4)
        .attr('text-anchor', 'end').attr('fill', '#ef4444').attr('font-size', 10).text('0 dB');
    }

    const magLine = d3.line().x(d => xLog(d.t)).y(d => yMag(d.magdB)).curve(d3.curveBasis);
    gMag.append('path').datum(points).attr('d', magLine)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);

    gMag.append('text').attr('x', 0).attr('y', -8)
      .attr('fill', '#3b82f6').attr('font-size', 12).attr('font-weight', 600)
      .text('Magnitude (dB)');

    // Phase plot
    const gPhase = svg.append('g').attr('transform', `translate(${margin.left},${margin.top + halfH + 30})`);
    const yPhase = d3.scaleLinear().domain([-180, 180]).range([halfH, 0]);

    gPhase.append('g').attr('transform', `translate(0,${halfH})`)
      .call(d3.axisBottom(xLog).ticks(8, '~s'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gPhase.append('g')
      .call(d3.axisLeft(yPhase).ticks(6).tickFormat(d => d + '°'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gPhase.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // -180° line
    gPhase.append('line')
      .attr('x1', 0).attr('y1', yPhase(-180)).attr('x2', w).attr('y2', yPhase(-180))
      .attr('stroke', '#ef4444').attr('stroke-width', 0.8).attr('stroke-dasharray', '4,4').attr('opacity', 0.4);

    const phaseLine = d3.line().x(d => xLog(d.t)).y(d => yPhase(d.phase)).curve(d3.curveBasis);
    gPhase.append('path').datum(points).attr('d', phaseLine)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2);

    gPhase.append('text').attr('x', 0).attr('y', -8)
      .attr('fill', '#f59e0b').attr('font-size', 12).attr('font-weight', 600)
      .text('Phase (degrees)');

    // Title
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Frequency t (log scale)');

    svg.append('text').attr('x', margin.left + 4).attr('y', 16)
      .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
      .text(`Bode Plot — σ = ${sigma.toFixed(2)}, ${numPrimes} primes`);

  }, [sigma, tRange, numPrimes, computeLoopGain]);

  useEffect(() => {
    if (mode === 'nyquist') drawNyquist();
    else drawBode();
  }, [mode, drawNyquist, drawBode]);

  useEffect(() => {
    const onResize = () => mode === 'nyquist' ? drawNyquist() : drawBode();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mode, drawNyquist, drawBode]);

  return (
    <div>
      {mode === 'nyquist' && (
        <div className="tab-explainer">
          <strong>The math:</strong> The Nyquist plot traces the loop transfer function{' '}
          <InlineMath tex="L(s) = \chi(s)\zeta(1-s)/\zeta(s)" /> in the complex plane as <InlineMath tex="t" /> varies.
          By the Nyquist stability criterion, the number of clockwise encirclements of <InlineMath tex="-1" /> equals{' '}
          <InlineMath tex="Z - P" /> (zeros minus poles in the right half-plane). RH says: on the critical line{' '}
          (<InlineMath tex="\sigma = \tfrac{1}{2}" />), there are <strong>zero encirclements</strong> &mdash; the system
          is marginally stable. Moving <InlineMath tex="\sigma" /> off the critical line changes the winding number.
          <strong> Look for:</strong> the curve not encircling <InlineMath tex="-1" /> at <InlineMath tex="\sigma = 0.5" />.
        </div>
      )}
      {mode === 'bode' && (
        <div className="tab-explainer accent-orange">
          <strong>The math:</strong> The Bode diagram shows the loop gain <InlineMath tex="|L(j\omega)|" /> in dB (top) and
          phase <InlineMath tex="\angle L(j\omega)" /> in degrees (bottom) vs. frequency. Gain crossings (0 dB) correspond
          to potential instabilities; the <strong>gain margin</strong> measures how much amplification the loop can tolerate.
          The <strong>phase margin</strong> measures how much phase lag can be added. On the critical line, the system has
          infinite gain margin &mdash; the oscillator chain can never become unstable.
          <strong> Look for:</strong> gain peaks at zeta zero frequencies; adequate margins at <InlineMath tex="\sigma = 0.5" />.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label>View</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="nyquist">Nyquist Plot</option>
            <option value="bode">Bode Diagram</option>
          </select>
        </div>
        <div className="control-group">
          <label><InlineMath tex="\sigma = \operatorname{Re}(s)" /></label>
          <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} />
          <span className="control-value">{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>t max</label>
          <input type="range" min="10" max="100" step="1" value={tRange[1]}
            onChange={e => setTRange([tRange[0], +e.target.value])} />
          <span className="control-value">{tRange[1]}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes}</span>
        </div>
      </div>
      <div className="viz-container">
        {mode === 'nyquist'
          ? <svg ref={nyquistRef} style={{ width: '100%', height: 520 }} />
          : <svg ref={bodeRef} style={{ width: '100%', height: 520 }} />
        }
      </div>
    </div>
  );
}
