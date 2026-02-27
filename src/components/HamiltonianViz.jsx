import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { hamiltonianSigmaScan, systemHamiltonian } from '../math/oscillators.js';

export default function HamiltonianViz() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(10);
  const [hoverPoint, setHoverPoint] = useState(null);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 380;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const points = hamiltonianSigmaScan(tValue, [0.05, 0.95], 60, numPrimes);

    const x = d3.scaleLinear().domain([0.05, 0.95]).range([0, w]);
    const yMax = d3.max(points, d => d.total) * 1.1;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10).tickFormat(d => d.toFixed(1)))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(1)))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Critical line
    g.append('line')
      .attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
      .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4')
      .attr('opacity', 0.7);

    g.append('text')
      .attr('x', x(0.5) + 6).attr('y', 14)
      .attr('fill', '#ef4444').attr('font-size', 11).attr('font-weight', 600)
      .text('σ = ½');

    // Area fills
    const areaGen = component => d3.area()
      .x(d => x(d.sigma))
      .y0(h)
      .y1(d => y(d[component]))
      .curve(d3.curveBasis);

    g.append('path')
      .datum(points)
      .attr('d', areaGen('kinetic'))
      .attr('fill', 'rgba(59,130,246,0.1)');

    g.append('path')
      .datum(points)
      .attr('d', areaGen('potential'))
      .attr('fill', 'rgba(245,158,11,0.1)');

    // Lines
    const lineGen = component => d3.line()
      .x(d => x(d.sigma))
      .y(d => y(d[component]))
      .curve(d3.curveBasis);

    g.append('path').datum(points).attr('d', lineGen('kinetic'))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 1.5).attr('opacity', 0.7);

    g.append('path').datum(points).attr('d', lineGen('potential'))
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('opacity', 0.7);

    g.append('path').datum(points).attr('d', lineGen('bridgeCoupling'))
      .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 1.5).attr('opacity', 0.7);

    g.append('path').datum(points).attr('d', lineGen('total'))
      .attr('fill', 'none').attr('stroke', '#10b981').attr('stroke-width', 2.5);

    // Minimum marker
    const minPoint = points.reduce((best, p) => p.total < best.total ? p : best, points[0]);
    g.append('circle')
      .attr('cx', x(minPoint.sigma)).attr('cy', y(minPoint.total)).attr('r', 6)
      .attr('fill', '#10b981').attr('stroke', '#0a0e1a').attr('stroke-width', 2);

    g.append('text')
      .attr('x', x(minPoint.sigma)).attr('y', y(minPoint.total) - 12)
      .attr('text-anchor', 'middle').attr('fill', '#10b981').attr('font-size', 11).attr('font-weight', 600)
      .text(`min @ σ=${minPoint.sigma.toFixed(2)}`);

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 180}, ${margin.top + 10})`);
    [
      { label: 'Total H', color: '#10b981' },
      { label: 'Kinetic T', color: '#3b82f6' },
      { label: 'Mismatch V', color: '#f59e0b' },
      { label: 'Bridge V', color: '#8b5cf6' },
    ].forEach(({ label, color }, i) => {
      legend.append('line').attr('x1', 0).attr('y1', i * 18).attr('x2', 20).attr('y2', i * 18)
        .attr('stroke', color).attr('stroke-width', 2);
      legend.append('text').attr('x', 26).attr('y', i * 18 + 4)
        .attr('fill', color).attr('font-size', 11).text(label);
    });

    // Axis labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('σ = Re(s)');

    svg.append('text')
      .attr('transform', `translate(16, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Energy');

    // Hover interaction
    const overlay = g.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    const hoverLine = g.append('line')
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', '#e2e8f0').attr('stroke-width', 0.5)
      .attr('opacity', 0);

    const hoverDot = g.append('circle')
      .attr('r', 4).attr('fill', '#10b981').attr('stroke', '#0a0e1a').attr('stroke-width', 2)
      .attr('opacity', 0);

    overlay.on('mousemove', (event) => {
      const [mx] = d3.pointer(event);
      const sigma = x.invert(mx);
      const closest = points.reduce((best, p) =>
        Math.abs(p.sigma - sigma) < Math.abs(best.sigma - sigma) ? p : best
      , points[0]);

      hoverLine.attr('x1', x(closest.sigma)).attr('x2', x(closest.sigma)).attr('opacity', 0.3);
      hoverDot.attr('cx', x(closest.sigma)).attr('cy', y(closest.total)).attr('opacity', 1);
      setHoverPoint(closest);
    }).on('mouseleave', () => {
      hoverLine.attr('opacity', 0);
      hoverDot.attr('opacity', 0);
      setHoverPoint(null);
    });

  }, [tValue, numPrimes]);

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
          <label>t (Im s)</label>
          <input type="range" min="1" max="60" step="0.5" value={tValue}
            onChange={e => setTValue(+e.target.value)} />
          <span className="control-value">{tValue.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes}</span>
        </div>
        {hoverPoint && (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            σ={hoverPoint.sigma.toFixed(3)} | H={hoverPoint.total.toFixed(3)} | T={hoverPoint.kinetic.toFixed(3)} | V={hoverPoint.potential.toFixed(3)}
          </div>
        )}
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}
