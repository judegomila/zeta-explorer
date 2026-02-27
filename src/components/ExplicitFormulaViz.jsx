import React, { useRef, useEffect, useState, useCallback } from 'react';
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

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(8))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

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
    [
      { label: 'ψ(x) actual (staircase)', color: '#3b82f6' },
      { label: `Explicit formula (${numZeros} zeros)`, color: '#f59e0b' },
      { label: 'x (PNT approximation)', color: '#64748b' },
    ].forEach(({ label, color }, i) => {
      legend.append('line').attr('x1', 0).attr('y1', i * 18).attr('x2', 20).attr('y2', i * 18)
        .attr('stroke', color).attr('stroke-width', 2);
      legend.append('text').attr('x', 26).attr('y', i * 18 + 4)
        .attr('fill', '#94a3b8').attr('font-size', 11).text(label);
    });

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
      <div className="controls">
        <div className="control-group">
          <label>Range (max x)</label>
          <input type="range" min="20" max="500" step="10" value={maxX}
            onChange={e => setMaxX(+e.target.value)} />
          <span className="control-value">{maxX}</span>
        </div>
        <div className="control-group">
          <label>Zeta Zeros Used</label>
          <input type="range" min="1" max="50" step="1" value={numZeros}
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
