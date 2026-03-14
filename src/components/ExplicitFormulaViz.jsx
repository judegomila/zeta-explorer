import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { vonMangoldt, explicitFormulaTerms } from '../math/primes.js';
import { ZETA_ZEROS } from '../math/zeta.js';

export default function ExplicitFormulaViz() {
  const svgRef = useRef();
  const [maxX, setMaxX] = useState(100);
  const [numZeros, setNumZeros] = useState(20);
  const [hoverPoint, setHoverPoint] = useState(null);

  // Memoize data arrays so resize events only re-render D3 without recomputing
  // the psiTable (O(maxX) vonMangoldt calls) and explicitFormulaTerms (O(steps × numZeros))
  const { actualData, approxData, rmsError } = useMemo(() => {
    const zeros = ZETA_ZEROS.slice(0, numZeros);
    const steps = Math.min(maxX, 200);
    const dx = maxX / steps;

    const maxFloorX = Math.floor(2 + steps * dx);
    const psiTable = new Float64Array(maxFloorX + 1);
    for (let n = 2; n <= maxFloorX; n++) {
      psiTable[n] = psiTable[n - 1] + vonMangoldt(n);
    }

    const actualData = [];
    const approxData = [];

    for (let i = 1; i <= steps; i++) {
      const x = 2 + i * dx;
      const psi = psiTable[Math.floor(x)];
      const correction = explicitFormulaTerms(x, zeros);
      const approx = x - correction;

      actualData.push({ x, y: psi });
      approxData.push({ x, y: approx });
    }

    // RMS error between explicit formula approximation and actual ψ(x)
    let sumSqErr = 0;
    for (let i = 0; i < actualData.length; i++) {
      const diff = actualData[i].y - approxData[i].y;
      sumSqErr += diff * diff;
    }
    const rmsError = Math.sqrt(sumSqErr / actualData.length);

    return { actualData, approxData, rmsError };
  }, [maxX, numZeros]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 380;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

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
      .attr('fill', 'rgba(245, 158, 11, 0.15)');

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
    legend.append('rect')
      .attr('x', -8).attr('y', -10).attr('width', 240).attr('height', 78)
      .attr('rx', 6).attr('fill', 'rgba(13,17,23,0.85)').attr('stroke', '#1e293b');

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

    // Zero correction shaded area
    legend.append('rect').attr('x', 0).attr('y', 48).attr('width', 20).attr('height', 10)
      .attr('fill', 'rgba(245, 158, 11, 0.15)').attr('stroke', '#f59e0b').attr('stroke-width', 0.5);
    legend.append('text').attr('x', 26).attr('y', 58)
      .attr('fill', '#94a3b8').attr('font-size', 11).text('Zero correction (x − spectral)');

    // Axis labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('x');

    svg.append('text')
      .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('ψ(x)');

    // Hover interaction
    const overlay = g.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    const hoverLine = g.append('line')
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', '#e2e8f0').attr('stroke-width', 0.5)
      .attr('opacity', 0);

    const hoverDotActual = g.append('circle')
      .attr('r', 4).attr('fill', '#3b82f6').attr('stroke', '#0a0e1a').attr('stroke-width', 2)
      .attr('opacity', 0);
    const hoverDotApprox = g.append('circle')
      .attr('r', 4).attr('fill', '#f59e0b').attr('stroke', '#0a0e1a').attr('stroke-width', 2)
      .attr('opacity', 0);

    const dx = maxX / Math.min(maxX, 200);
    overlay.on('mousemove', (event) => {
      const [mx] = d3.pointer(event);
      const xVal = xScale.invert(mx);
      const idx = Math.max(0, Math.min(actualData.length - 1, Math.round((xVal - 2) / dx - 1)));
      const closest = actualData[idx];
      const approxPt = approxData[idx];

      hoverLine.attr('x1', xScale(closest.x)).attr('x2', xScale(closest.x)).attr('opacity', 0.3);
      hoverDotActual.attr('cx', xScale(closest.x)).attr('cy', yScale(closest.y)).attr('opacity', 1);
      hoverDotApprox.attr('cx', xScale(approxPt.x)).attr('cy', yScale(approxPt.y)).attr('opacity', 1);
      setHoverPoint({ x: closest.x, psi: closest.y, approx: approxPt.y, pnt: closest.x });
    }).on('mouseleave', () => {
      hoverLine.attr('opacity', 0);
      hoverDotActual.attr('opacity', 0);
      hoverDotApprox.attr('opacity', 0);
      setHoverPoint(null);
    });

  }, [maxX, numZeros, actualData, approxData]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        <p style={{ margin: '0 0 8px' }}>
          Von Mangoldt's explicit formula decomposes the Chebyshev function
          <InlineMath tex={"\\psi(x) = \\sum_{n \\le x} \\Lambda(n)"} /> into zeta-zero oscillations:
        </p>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log 2\\pi - \\tfrac{1}{2}\\log(1 - x^{-2})"} />
        <p style={{ margin: '8px 0' }}>
          Each zero pair <InlineMath tex={"\\rho, \\bar{\\rho}"} /> with <InlineMath tex={"\\rho = \\tfrac{1}{2}+i\\gamma"} /> contributes
          an oscillation that, for large <InlineMath tex={"\\gamma"} />, simplifies to:
        </p>
        <BlockMath tex={"\\approx -\\frac{2x^{1/2}}{\\gamma}\\sin(\\gamma\\log x)"} />
        <p style={{ margin: '8px 0' }}>
          Adding more zeros sharpens the reconstruction of the prime staircase.
          The error between <InlineMath tex={"\\psi(x)"} /> and <InlineMath tex={"x"} /> (the PNT)
          is controlled by how far zeros can deviate from <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Look for:</strong> gold reconstruction converging to the blue staircase as you add more zeros.
        </p>
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
          <span style={{ marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#64748b' }}>
            (γ_max ≈ {ZETA_ZEROS[Math.min(numZeros, ZETA_ZEROS.length) - 1]?.toFixed(1) ?? '?'})
          </span>
        </div>
        {hoverPoint ? (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            x={hoverPoint.x.toFixed(1)} | <span style={{ color: '#3b82f6' }}>ψ={hoverPoint.psi.toFixed(1)}</span> | <span style={{ color: '#f59e0b' }}>approx={hoverPoint.approx.toFixed(1)}</span> | <span style={{ color: Math.abs(hoverPoint.psi - hoverPoint.approx) < 1 ? '#10b981' : Math.abs(hoverPoint.psi - hoverPoint.approx) < 5 ? '#f59e0b' : '#ef4444' }}>err={Math.abs(hoverPoint.psi - hoverPoint.approx).toFixed(2)}</span>
          </div>
        ) : (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: rmsError < 1 ? '#10b981' : rmsError < 5 ? '#f59e0b' : '#ef4444' }}>
            RMS error: {rmsError.toFixed(2)} <span style={{ color: '#475569', fontSize: 11, fontStyle: 'italic', marginLeft: 8 }}>Hover to inspect</span>
          </div>
        )}
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}
