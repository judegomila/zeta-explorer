import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { InlineMath } from './KaTeXMath.jsx';
import { losslessBridge } from '../math/oscillators.js';
import { cAbs, cMul, cAdd, cSub, cDiv, ZETA_ZEROS } from '../math/zeta.js';

/**
 * Visualize the scattering matrix of the lossless bridge:
 * - |χ(s)| magnitude as a function of σ and t
 * - Reflection coefficient Γ
 * - Unitarity measure |S†S - I|
 */
export default function ScatteringMatrixViz() {
  const svgRef = useRef();
  const canvasRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [mode, setMode] = useState('magnitude');

  const drawMagnitude = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 380;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Sweep σ, show |χ(σ + it)|, reflection coefficient, and unitarity deviation
    const steps = 100;
    const data = [];
    for (let i = 0; i <= steps; i++) {
      const sigma = 0.01 + (i / steps) * 0.98;
      const bridge = losslessBridge([sigma, tValue]);
      data.push({
        sigma,
        chiMag: bridge.magnitude,
        chiPhase: bridge.phase,
        reflection: bridge.reflectionCoeff,
        isUnitary: bridge.isUnitary,
        unitarityDev: Math.abs(bridge.magnitude - 1),
      });
    }

    const x = d3.scaleLinear().domain([0, 1]).range([0, w]);

    if (mode === 'magnitude') {
      const yMax = Math.min(10, d3.max(data, d => d.chiMag) * 1.2);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // |χ| = 1 reference line
      g.append('line')
        .attr('x1', 0).attr('y1', y(1)).attr('x2', w).attr('y2', y(1))
        .attr('stroke', '#10b981').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');
      g.append('text').attr('x', w - 4).attr('y', y(1) - 6)
        .attr('text-anchor', 'end').attr('fill', '#10b981').attr('font-size', 10)
        .text('|χ| = 1 (lossless)');

      // σ = 0.5 line
      g.append('line')
        .attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');

      // |χ(s)| curve
      const line = d3.line().x(d => x(d.sigma)).y(d => y(Math.min(yMax, d.chiMag))).curve(d3.curveBasis);

      // Fill areas: green where |χ|<1 (absorptive), red where |χ|>1 (amplifying)
      const area1 = d3.area()
        .x(d => x(d.sigma))
        .y0(y(1))
        .y1(d => y(Math.min(yMax, Math.max(1, d.chiMag))))
        .curve(d3.curveBasis);
      g.append('path').datum(data).attr('d', area1)
        .attr('fill', 'rgba(239,68,68,0.1)');

      const area2 = d3.area()
        .x(d => x(d.sigma))
        .y0(y(1))
        .y1(d => y(Math.min(1, d.chiMag)))
        .curve(d3.curveBasis);
      g.append('path').datum(data).attr('d', area2)
        .attr('fill', 'rgba(59,130,246,0.1)');

      g.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 2.5);

      // Mark σ = 0.5 point
      const halfPoint = data.find(d => Math.abs(d.sigma - 0.5) < 0.01);
      if (halfPoint) {
        g.append('circle')
          .attr('cx', x(0.5)).attr('cy', y(Math.min(yMax, halfPoint.chiMag))).attr('r', 5)
          .attr('fill', '#10b981').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
        g.append('text')
          .attr('x', x(0.5) + 8).attr('y', y(Math.min(yMax, halfPoint.chiMag)) - 8)
          .attr('fill', '#10b981').attr('font-size', 11).attr('font-weight', 600)
          .text(`|χ(½+${tValue.toFixed(1)}i)| = ${halfPoint.chiMag.toFixed(4)}`);
      }

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text(`Bridge Transfer Magnitude |χ(σ + ${tValue.toFixed(1)}i)|`);

      svg.append('text')
        .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('|χ(s)|');

      // Annotations
      g.append('text').attr('x', x(0.25)).attr('y', 20)
        .attr('text-anchor', 'middle').attr('fill', '#3b82f6').attr('font-size', 10)
        .text('|χ| < 1: absorptive');
      g.append('text').attr('x', x(0.75)).attr('y', 20)
        .attr('text-anchor', 'middle').attr('fill', '#ef4444').attr('font-size', 10)
        .text('|χ| > 1: amplifying');

    } else if (mode === 'reflection') {
      const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      g.append('line')
        .attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');

      const line = d3.line().x(d => x(d.sigma)).y(d => y(Math.min(1, d.reflection))).curve(d3.curveBasis);

      g.append('path')
        .datum(data)
        .attr('d', d3.area()
          .x(d => x(d.sigma))
          .y0(h)
          .y1(d => y(Math.min(1, d.reflection)))
          .curve(d3.curveBasis))
        .attr('fill', 'rgba(245,158,11,0.15)');

      g.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2.5);

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text(`Bridge Reflection Coefficient Γ(σ + ${tValue.toFixed(1)}i) — zero at σ = ½`);

      svg.append('text')
        .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Γ');

    } else {
      // Phase
      const y = d3.scaleLinear().domain([-180, 180]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8).tickFormat(d => d + '°'))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      g.append('line')
        .attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');

      const line = d3.line()
        .x(d => x(d.sigma))
        .y(d => y(d.chiPhase * 180 / Math.PI))
        .curve(d3.curveBasis);

      g.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 2.5);

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text(`Bridge Phase arg(χ(σ + ${tValue.toFixed(1)}i))`);

      svg.append('text')
        .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('arg(χ) (degrees)');
    }

    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('σ = Re(s)');

  }, [tValue, mode]);

  useEffect(() => { drawMagnitude(); }, [drawMagnitude]);
  useEffect(() => {
    const onResize = () => drawMagnitude();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawMagnitude]);

  return (
    <div>
      {mode === 'magnitude' && (
        <div className="tab-explainer accent-purple">
          <strong>The math:</strong> The bridge factor magnitude <InlineMath tex="|\chi(\sigma+it)|" /> measures whether the connection between
          direct and dual ladders amplifies or attenuates. On the critical line <InlineMath tex="\sigma = \tfrac{1}{2}" />,{' '}
          <InlineMath tex="|\chi| = 1" /> exactly (lossless/unitary). For <InlineMath tex="\sigma > \tfrac{1}{2}" />,{' '}
          <InlineMath tex="|\chi| < 1" /> (attenuating); for <InlineMath tex="\sigma < \tfrac{1}{2}" />,{' '}
          <InlineMath tex="|\chi| > 1" /> (amplifying). The product <InlineMath tex="|\chi(s)\chi(1-s)| = 1" /> always.
          <strong> Look for:</strong> the curve crossing 1.0 exactly at <InlineMath tex="\sigma = 0.5" />.
        </div>
      )}
      {mode === 'reflection' && (
        <div className="tab-explainer accent-green">
          <strong>The math:</strong> The reflection coefficient <InlineMath tex="\Gamma = |1 - |\chi(s)||" /> measures how
          much energy is reflected back rather than transmitted through the bridge. At <InlineMath tex="\sigma = \tfrac{1}{2}" />,{' '}
          <InlineMath tex="\Gamma = 0" /> (perfect transmission, impedance match). This is the scattering-matrix condition for
          lossless two-port networks: <InlineMath tex="S^\dagger S = I" />.
          <strong> Look for:</strong> <InlineMath tex="\Gamma" /> touching zero at <InlineMath tex="\sigma = 0.5" />.
        </div>
      )}
      {mode === 'phase' && (
        <div className="tab-explainer accent-orange">
          <strong>The math:</strong> The phase <InlineMath tex="\arg\chi(s)" /> is related to the Riemann-Siegel theta function{' '}
          <InlineMath tex="\theta(t) = \text{Im}\,\log\Gamma(\tfrac{1}{4}+\tfrac{it}{2}) - \tfrac{t}{2}\log\pi" />.
          Phase changes of <InlineMath tex="\pi" /> between consecutive zeros correspond to sign changes of the Z function.
          The total phase accumulation up to height <InlineMath tex="t" /> determines the zero counting function{' '}
          <InlineMath tex="N(T) \sim \theta(T)/\pi" />.
          <strong> Look for:</strong> monotonically increasing phase with kinks at each zeta zero.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label>Property</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="magnitude">|χ(s)| Magnitude</option>
            <option value="reflection">Reflection Coefficient Γ</option>
            <option value="phase">Phase arg(χ)</option>
          </select>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
          <input type="range" min="1" max="60" step="0.5" value={tValue}
            onChange={e => setTValue(+e.target.value)} />
          <span className="control-value">{tValue.toFixed(1)}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}
