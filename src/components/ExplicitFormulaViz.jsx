import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { chebyshevPsi, explicitFormulaTerms } from '../math/primes.js';
import { ZETA_ZEROS } from '../math/zeta.js';

export default function ExplicitFormulaViz() {
  const svgRef = useRef();
  const [maxX, setMaxX] = useState(100);
  const [numZeros, setNumZeros] = useState(20);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 380;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const zeros = ZETA_ZEROS.slice(0, numZeros);
    const steps = Math.min(maxX, 200);
    const dx = maxX / steps;

    // Compute actual psi(x) and approximation
    const actualData = [];
    const approxData = [];
    const errorData = [];

    for (let i = 1; i <= steps; i++) {
      const x = 2 + i * dx;
      const psi = chebyshevPsi(Math.floor(x));
      const correction = explicitFormulaTerms(x, zeros);
      const approx = x - correction;

      actualData.push({ x, y: psi });
      approxData.push({ x, y: approx });
      errorData.push({ x, y: psi - x }); // Oscillatory error
    }

    const xScale = d3.scaleLinear().domain([2, maxX + 2]).range([0, w]);
    const yMax = d3.max(actualData, d => d.y) * 1.05;
    const yScale = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Horizontal gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(8).tickSize(-w).tickFormat(''))
      .selectAll('line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3');
    g.select('.grid .domain').remove();

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(8))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Shaded area between PNT (y=x) and spectral approximation highlighting zero correction
    g.append('path')
      .datum(approxData)
      .attr('d', d3.area()
        .x(d => xScale(d.x))
        .y0(d => yScale(d.x))
        .y1(d => yScale(d.y))
        .curve(d3.curveBasis))
      .attr('fill', 'rgba(245, 158, 11, 0.08)');

    // x line (trivial approximation)
    g.append('path')
      .datum(actualData)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.x)).curve(d3.curveLinear))
      .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Actual psi(x) - staircase
    const stairLine = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveStepAfter);

    g.append('path')
      .datum(actualData)
      .attr('d', stairLine)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);

    // Spectral approximation
    g.append('path')
      .datum(approxData)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveBasis))
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
      .attr('opacity', 0.8);

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${margin.left + 10}, ${margin.top + 10})`);

    // ψ(x) staircase: draw a small step pattern to match curveStepAfter
    const stairY = 0;
    legend.append('path')
      .attr('d', `M0,${stairY + 3} H7 V${stairY - 3} H14 V${stairY + 1} H20`)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);
    legend.append('text').attr('x', 26).attr('y', stairY + 4)
      .attr('fill', '#94a3b8').attr('font-size', 11).text('ψ(x) actual (staircase)');

    // Explicit formula: solid smooth line
    legend.append('line').attr('x1', 0).attr('y1', 18).attr('x2', 20).attr('y2', 18)
      .attr('stroke', '#f59e0b').attr('stroke-width', 2);
    legend.append('text').attr('x', 26).attr('y', 22)
      .attr('fill', '#94a3b8').attr('font-size', 11).text(`Explicit formula (${numZeros} zeros)`);

    // PNT approximation: dashed line to match stroke-dasharray '4,4' in the plot
    legend.append('line').attr('x1', 0).attr('y1', 36).attr('x2', 20).attr('y2', 36)
      .attr('stroke', '#64748b').attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4');
    legend.append('text').attr('x', 26).attr('y', 40)
      .attr('fill', '#94a3b8').attr('font-size', 11).text('x (PNT approximation)');

    // Axis labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('x');

    svg.append('text')
      .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('ψ(x)');

  }, [maxX, numZeros]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        <strong>The math:</strong> Von Mangoldt's explicit formula{' '}
        <InlineMath tex="\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho - \\log 2\\pi" /> reconstructs the prime counting
        function from zeta zeros. Each zero <InlineMath tex="\\rho = \\tfrac{1}{2}+i\\gamma" /> contributes a damped
        sinusoid <InlineMath tex="x^{1/2}\\cos(\\gamma\\log x)/|\\rho|" />. The sum over zeros is the
        "impulse response" of the oscillator chain &mdash; adding more zeros sharpens the reconstruction of the
        prime staircase. The error between <InlineMath tex="\\psi(x)" /> and <InlineMath tex="x" /> (the PNT) is
        controlled by how far zeros can deviate from <InlineMath tex="\\sigma = \\tfrac{1}{2}" />.
        <strong> Look for:</strong> gold reconstruction converging to the blue staircase as you add more zeros.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Range (max x)</label>
          <input type="range" min="20" max="500" step="10" value={maxX}
            onChange={e => setMaxX(+e.target.value)} />
          <span className="control-value">{maxX}</span>
        </div>
        <div className="control-group">
          <label>Zeta Zeros Used</label>
          <input type="range" min="1" max="200" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}
