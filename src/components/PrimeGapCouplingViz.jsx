import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { InlineMath } from './KaTeXMath.jsx';
import { getPrimes, primeFrequency } from '../math/primes.js';

/**
 * Visualize the coupling strength between adjacent oscillator stages.
 * Coupling ∝ 1/(log p_{n+1} - log p_n) = 1/log(p_{n+1}/p_n)
 * Twin primes → strongest coupling. Large gaps → weak coupling.
 */
export default function PrimeGapCouplingViz() {
  const svgRef = useRef();
  const [numPrimes, setNumPrimes] = useState(60);
  const [mode, setMode] = useState('coupling');

  // Memoize prime data so it's not recomputed on mode switch or window resize
  const { primes, data } = useMemo(() => {
    const primes = getPrimes(numPrimes);
    const data = [];
    for (let i = 0; i < primes.length - 1; i++) {
      const p1 = primes[i];
      const p2 = primes[i + 1];
      const gap = p2 - p1;
      const freqGap = primeFrequency(p2) - primeFrequency(p1);
      const coupling = 1 / freqGap;
      const isTwin = gap === 2;
      data.push({ index: i, p1, p2, gap, freqGap, coupling, isTwin, midPrime: (p1 + p2) / 2 });
    }
    return { primes, data };
  }, [numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 400;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);


    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, w]);

    if (mode === 'coupling') {
      const yMax = d3.max(data, d => d.coupling) * 1.1;
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(Math.min(20, data.length)).tickFormat(i => data[i]?.p1 || ''))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 8)
        .attr('transform', 'rotate(-45)').attr('text-anchor', 'end');
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const gridG1 = g.append('g').call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''));
      gridG1.select('.domain').remove();
      gridG1.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

      // Coupling bars
      const barW = Math.max(2, w / data.length - 1);
      data.forEach((d, i) => {
        g.append('rect')
          .attr('x', x(i) - barW / 2).attr('y', y(d.coupling))
          .attr('width', barW).attr('height', h - y(d.coupling))
          .attr('rx', 1)
          .attr('fill', d.isTwin ? '#ef4444' : `hsl(${210 + d.coupling * 20}, 70%, 55%)`)
          .attr('opacity', d.isTwin ? 0.9 : 0.6)
          .style('cursor', 'crosshair')
          .append('title').text(`p=${d.p1}→${d.p2} | gap=${d.gap}${d.isTwin ? ' (twin)' : ''} | Y=${d.coupling.toFixed(2)}`);
      });

      // Coupling line
      const line = d3.line().x((d, i) => x(i)).y(d => y(d.coupling)).curve(d3.curveMonotoneX);
      g.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 1.5);

      // Mark twin primes
      data.filter(d => d.isTwin).forEach(d => {
        g.append('circle')
          .attr('cx', x(d.index)).attr('cy', y(d.coupling)).attr('r', 4)
          .attr('fill', '#ef4444').attr('stroke', '#0a0e1a').attr('stroke-width', 1.5)
          .style('cursor', 'crosshair')
          .append('title').text(`Twin: p=${d.p1},${d.p2} | Y=${d.coupling.toFixed(2)}`);
      });

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Inter-Stage Coupling Strength Y_{n,n+1} = 1/(log p_{n+1} − log p_n)');

      // Y-axis label
      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Coupling Y');

      // Legend
      const legend = g.append('g').attr('transform', `translate(${w - 175}, 10)`);
      legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 16).attr('y2', 0)
        .attr('stroke', '#06b6d4').attr('stroke-width', 1.5);
      legend.append('text').attr('x', 22).attr('y', 4).attr('fill', '#06b6d4').attr('font-size', 11)
        .text('Coupling trend');
      legend.append('circle').attr('cx', 8).attr('cy', 18).attr('r', 4).attr('fill', '#ef4444');
      legend.append('text').attr('x', 22).attr('y', 22).attr('fill', '#ef4444').attr('font-size', 11)
        .text('Twin primes (gap=2)');

    } else if (mode === 'gap') {
      const yMax = d3.max(data, d => d.gap) * 1.1;
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(Math.min(20, data.length)).tickFormat(i => data[i]?.p1 || ''))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 8)
        .attr('transform', 'rotate(-45)').attr('text-anchor', 'end');
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const gridG2 = g.append('g').call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''));
      gridG2.select('.domain').remove();
      gridG2.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

      // Gap bars
      const barW = Math.max(2, w / data.length - 1);
      data.forEach((d, i) => {
        const color = d.gap === 2 ? '#ef4444' :
                      d.gap === 4 ? '#f59e0b' :
                      d.gap === 6 ? '#3b82f6' : '#8b5cf6';
        g.append('rect')
          .attr('x', x(i) - barW / 2).attr('y', y(d.gap))
          .attr('width', barW).attr('height', h - y(d.gap))
          .attr('rx', 1)
          .attr('fill', color).attr('opacity', 0.7)
          .style('cursor', 'crosshair')
          .append('title').text(`p=${d.p1}→${d.p2} | gap=${d.gap}${d.isTwin ? ' (twin)' : ''}`);
      });

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Prime Gaps (p_{n+1} − p_n)');

      // Y-axis label
      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Gap size');

      const legend = g.append('g').attr('transform', `translate(${w - 120}, 10)`);
      [
        { label: 'gap=2', color: '#ef4444' },
        { label: 'gap=4', color: '#f59e0b' },
        { label: 'gap=6', color: '#3b82f6' },
        { label: 'other', color: '#8b5cf6' },
      ].forEach(({ label, color }, i) => {
        legend.append('rect').attr('x', 0).attr('y', i * 18 - 6).attr('width', 12).attr('height', 12)
          .attr('rx', 2).attr('fill', color).attr('opacity', 0.7);
        legend.append('text').attr('x', 18).attr('y', i * 18 + 4).attr('fill', '#94a3b8').attr('font-size', 10)
          .text(label);
      });

    } else {
      // Frequency spectrum of oscillators — fix x domain for primes.length points (not data.length)
      x.domain([0, primes.length - 1]);
      const y = d3.scaleLinear().domain([0, primeFrequency(primes[primes.length - 1]) * 1.1]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(Math.min(20, primes.length)).tickFormat(i => primes[i] || ''))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 8)
        .attr('transform', 'rotate(-45)').attr('text-anchor', 'end');
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const gridG3 = g.append('g').call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''));
      gridG3.select('.domain').remove();
      gridG3.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

      // Frequency points
      primes.forEach((p, i) => {
        const freq = primeFrequency(p);
        g.append('circle')
          .attr('cx', x(i)).attr('cy', y(freq)).attr('r', 4)
          .attr('fill', `hsl(${210 + freq * 15}, 70%, 55%)`)
          .attr('stroke', '#0a0e1a').attr('stroke-width', 1)
          .style('cursor', 'crosshair')
          .append('title').text(`p=${p} | Z₀=log(${p})=${freq.toFixed(4)}`);
      });

      // Connect with line
      const line = d3.line().x((d, i) => x(i)).y(d => y(primeFrequency(d))).curve(d3.curveMonotoneX);
      g.append('path').datum(primes).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 1.5).attr('opacity', 0.6);

      // log(x) reference curve
      const refCurve = d3.range(0, primes.length).map(i => ({ i, y: Math.log(2 + i * (primes[primes.length-1] - 2) / primes.length) }));
      g.append('path').datum(refCurve)
        .attr('d', d3.line().x(d => x(d.i)).y(d => y(d.y)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-dasharray', '4,4').attr('stroke-width', 1);

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Euler Factor Phase Rates log(p)  (LC resonance ω₀ = 1)');

      // Y-axis label
      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Phase rate log(p)');

      // Legend
      const legend = g.append('g').attr('transform', `translate(${w - 160}, 10)`);
      legend.append('circle').attr('cx', 6).attr('cy', 0).attr('r', 4)
        .attr('fill', 'hsl(225, 70%, 55%)').attr('stroke', '#0a0e1a').attr('stroke-width', 1);
      legend.append('text').attr('x', 18).attr('y', 4).attr('fill', '#94a3b8').attr('font-size', 10)
        .text('log(p) phase rate');
      legend.append('line').attr('x1', 0).attr('y1', 18).attr('x2', 12).attr('y2', 18)
        .attr('stroke', '#64748b').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
      legend.append('text').attr('x', 18).attr('y', 22).attr('fill', '#94a3b8').attr('font-size', 10)
        .text('log(x) reference');
    }

    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Prime pₙ');

  }, [primes, data, mode]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      {mode === 'coupling' && (
        <div className="tab-explainer accent-red">
          Adjacent oscillator stages are coupled with strength{' '}
          <InlineMath tex="Y_{n,n+1} \\propto 1/\\log(p_{n+1}/p_n)" />. Small prime gaps (especially twin primes, gap = 2)
          produce <strong>strong coupling</strong> &mdash; energy flows easily between those stages, creating resonant cavities.
          Large gaps weaken the coupling. The twin prime conjecture implies infinitely many strongly-coupled pairs.
          <strong> Look for:</strong> red spikes at twin primes (3-5, 5-7, 11-13, ...); coupling dropping at large gaps.
        </div>
      )}
      {mode === 'gap' && (
        <div className="tab-explainer accent-orange">
          Prime gaps <InlineMath tex="g_n = p_{n+1} - p_n" /> determine the physical "distance" between oscillator stages.
          By the prime number theorem, the average gap near <InlineMath tex="p" /> is <InlineMath tex="\\sim \\log p" />.
          The distribution of gaps encodes the fine structure of primes &mdash; and directly sets
          the inter-stage impedance of the ladder network.
          <strong> Look for:</strong> gaps growing on average (PNT) with occasional twin prime dips to 2.
        </div>
      )}
      {mode === 'frequency' && (
        <div className="tab-explainer accent-cyan">
          Each prime <InlineMath tex="p" /> has Euler factor phase rotation rate <InlineMath tex="\\omega_p = \\log p" /> (the
          frequency at which <InlineMath tex="p^{-it}" /> oscillates as <InlineMath tex="t" /> varies). Note: the LC circuit resonant
          frequency is <InlineMath tex="\\omega_0 = 1/\\sqrt{L_p C_p} = 1" /> for all primes; <InlineMath tex="\\log p" /> is the characteristic
          dispersion rate, not the resonance. This grows as <InlineMath tex="\\log(n\\log n)" /> for the <InlineMath tex="n" />-th prime,
          with mode spacing decreasing at higher frequencies — matching the increasing density of zeta
          zeros <InlineMath tex="N(T) \\sim (T/2\\pi)\\log(T/2\\pi e)" />.
          <strong> Look for:</strong> the logarithmic staircase of frequencies.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label>View</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="coupling">Coupling Strength</option>
            <option value="gap">Prime Gaps</option>
            <option value="frequency">Phase Rates</option>
          </select>
        </div>
        <div className="control-group">
          <label>Number of primes</label>
          <input type="range" min="10" max="200" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={primes[primes.length - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 400 }} />
      </div>
    </div>
  );
}
