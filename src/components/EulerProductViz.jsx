import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { partialEulerProduct, cAbs, zetaCriticalStrip } from '../math/zeta.js';

export default function EulerProductViz() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [maxPrimes, setMaxPrimes] = useState(30);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 360;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const { stages } = partialEulerProduct([sigma, t], maxPrimes);
    const data = stages.slice(1); // skip initial [1,0]

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, w]);
    const yMag = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.cumulative ? cAbs(d.cumulative) : 1) * 1.2])
      .range([h, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(Math.min(data.length, 15)).tickFormat(i => data[i]?.prime || ''))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    g.append('g')
      .call(d3.axisLeft(yMag).ticks(6))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Cumulative magnitude curve
    const magLine = d3.line()
      .x((d, i) => x(i))
      .y(d => yMag(cAbs(d.cumulative)))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('d', magLine)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Individual factor magnitudes as bars
    const barW = Math.max(2, w / data.length - 2);
    data.forEach((d, i) => {
      const factorMag = cAbs(d.factor);
      const barH = Math.min(h - 5, Math.abs(factorMag - 1) * h * 2);
      const isAmplifying = factorMag > 1;

      g.append('rect')
        .attr('x', x(i) - barW / 2)
        .attr('y', isAmplifying ? yMag(factorMag) : yMag(1))
        .attr('width', barW)
        .attr('height', Math.max(1, barH))
        .attr('rx', 1)
        .attr('fill', isAmplifying ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)');

      // Dot on the magnitude curve
      g.append('circle')
        .attr('cx', x(i))
        .attr('cy', yMag(cAbs(d.cumulative)))
        .attr('r', 3)
        .attr('fill', '#3b82f6')
        .attr('stroke', '#0a0e1a')
        .attr('stroke-width', 1);
    });

    // Reference line at |H| = 1
    g.append('line')
      .attr('x1', 0).attr('y1', yMag(1)).attr('x2', w).attr('y2', yMag(1))
      .attr('stroke', '#64748b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

    g.append('text')
      .attr('x', w - 4).attr('y', yMag(1) - 6)
      .attr('text-anchor', 'end').attr('fill', '#64748b').attr('font-size', 10)
      .text('|H| = 1');

    // Phase plot (secondary axis)
    const yPhase = d3.scaleLinear().domain([-Math.PI, Math.PI]).range([h, 0]);
    const phaseLine = d3.line()
      .x((d, i) => x(i))
      .y(d => yPhase(d.cumulative ? Math.atan2(d.cumulative[1], d.cumulative[0]) : 0))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('d', phaseLine)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6);

    // Labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Prime (increasing)');

    svg.append('text')
      .attr('x', margin.left - 8).attr('y', 14)
      .attr('fill', '#3b82f6').attr('font-size', 11).attr('font-weight', 600)
      .text('Cumulative |ζ| (blue)');

    svg.append('text')
      .attr('x', width - margin.right).attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('fill', '#8b5cf6').attr('font-size', 11).attr('font-weight', 600)
      .text('Phase (purple)');

    // True zeta value (Borwein-accelerated) as reference line
    const trueZeta = cAbs(zetaCriticalStrip([sigma, t]));
    const trueY = yMag(trueZeta);
    if (trueY >= 0 && trueY <= h) {
      g.append('line')
        .attr('x1', 0).attr('y1', trueY).attr('x2', w).attr('y2', trueY)
        .attr('stroke', '#10b981').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,3');
      g.append('text')
        .attr('x', w - 4).attr('y', trueY - 6)
        .attr('text-anchor', 'end').attr('fill', '#10b981').attr('font-size', 10)
        .text(`True |ζ| = ${trueZeta.toFixed(4)}`);
    }

    // Final value
    const finalMag = data.length > 0 ? cAbs(data[data.length - 1].cumulative) : 0;
    svg.append('text')
      .attr('x', width - margin.right).attr('y', 30)
      .attr('text-anchor', 'end')
      .attr('fill', '#06b6d4').attr('font-size', 12).attr('font-family', 'var(--font-mono)')
      .text(`|ζ(${sigma.toFixed(2)}+${t.toFixed(1)}i)| ≈ ${finalMag.toFixed(4)}`);

  }, [sigma, t, maxPrimes]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        <strong>The math:</strong> The partial Euler product <InlineMath tex="\\zeta_N(s) = \\prod_{p \\leq p_N} (1-p^{-s})^{-1}" /> builds
        up the zeta function prime-by-prime. Each factor has magnitude <InlineMath tex="|1-p^{-s}|^{-1}" /> and phase{' '}
        <InlineMath tex="\\arg(1-p^{-s})^{-1}" />. The cumulative product converges (for <InlineMath tex="\\sigma > 1" />) to{' '}
        <InlineMath tex="\\zeta(s)" />. In the critical strip (<InlineMath tex="0 < \sigma \leq 1" />), the Euler product <strong>diverges</strong> &mdash;
        partial products oscillate without settling. The green reference line shows the true <InlineMath tex="|\zeta(s)|" /> computed via
        analytic continuation (Borwein acceleration), not the Euler product.
        <strong> Look for:</strong> the blue magnitude line stabilizing as more primes are added (for <InlineMath tex="\sigma > 1" />); divergent oscillations in the critical strip.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="\sigma = \operatorname{Re}(s)" /></label>
          <input type="range" min="0.1" max="2" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} />
          <span className="control-value">{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
          <input type="range" min="0.5" max="60" step="0.1" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Max Primes</label>
          <input type="range" min="5" max="100" step="1" value={maxPrimes}
            onChange={e => setMaxPrimes(+e.target.value)} />
          <span className="control-value">{maxPrimes}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 360 }} />
      </div>
    </div>
  );
}
