import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { hamiltonianSigmaScan, systemHamiltonian } from '../math/oscillators.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import ThermoBar from './ThermoBar.jsx';

export default function HamiltonianViz() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(10);
  const [hoverPoint, setHoverPoint] = useState(null);

  const points = useMemo(() => hamiltonianSigmaScan(tValue, [0.05, 0.95], 60, numPrimes), [tValue, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 380;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

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

    // Horizontal gridlines
    const gridG = g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(''));
    gridG.select('.domain').remove();
    gridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

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
    const legend = svg.append('g').attr('transform', `translate(${width - 160}, ${margin.top + 8})`);
    // Semi-transparent background for legend
    legend.append('rect')
      .attr('x', -8).attr('y', -10).attr('width', 120).attr('height', 4 * 22 + 8)
      .attr('rx', 6).attr('fill', 'rgba(13,17,23,0.85)').attr('stroke', '#1e293b');
    [
      { label: 'ℋ total', color: '#10b981' },
      { label: 'T kinetic', color: '#3b82f6' },
      { label: 'V mismatch', color: '#f59e0b' },
      { label: 'V bridge', color: '#8b5cf6' },
    ].forEach(({ label, color }, i) => {
      legend.append('line').attr('x1', 0).attr('y1', i * 22).attr('x2', 20).attr('y2', i * 22)
        .attr('stroke', color).attr('stroke-width', 2);
      legend.append('text').attr('x', 26).attr('y', i * 22 + 4)
        .attr('fill', color).attr('font-size', 11).text(label);
    });

    // Axis labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('σ = Re(s)');

    svg.append('text')
      .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
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
    const hoverDotKinetic = g.append('circle')
      .attr('r', 3).attr('fill', '#3b82f6').attr('stroke', '#0a0e1a').attr('stroke-width', 1.5)
      .attr('opacity', 0);
    const hoverDotPotential = g.append('circle')
      .attr('r', 3).attr('fill', '#f59e0b').attr('stroke', '#0a0e1a').attr('stroke-width', 1.5)
      .attr('opacity', 0);
    const hoverDotBridge = g.append('circle')
      .attr('r', 3).attr('fill', '#8b5cf6').attr('stroke', '#0a0e1a').attr('stroke-width', 1.5)
      .attr('opacity', 0);

    // points are produced by hamiltonianSigmaScan as a uniform grid over [0.05, 0.95],
    // so we can hit-test in O(1) by computing the index directly instead of doing the
    // O(n) reduce + 2N Math.abs that fired on every mousemove.
    const sigmaMin = 0.05;
    const sigmaSpan = 0.9;
    overlay.on('mousemove', (event) => {
      const [mx] = d3.pointer(event);
      const sigma = x.invert(mx);
      const lastIdx = points.length - 1;
      const idx = Math.max(0, Math.min(lastIdx, Math.round(((sigma - sigmaMin) / sigmaSpan) * lastIdx)));
      const closest = points[idx];

      const cx = x(closest.sigma);
      hoverLine.attr('x1', cx).attr('x2', cx).attr('opacity', 0.3);
      hoverDot.attr('cx', cx).attr('cy', y(closest.total)).attr('opacity', 1);
      hoverDotKinetic.attr('cx', cx).attr('cy', y(closest.kinetic)).attr('opacity', 1);
      hoverDotPotential.attr('cx', cx).attr('cy', y(closest.potential)).attr('opacity', 1);
      hoverDotBridge.attr('cx', cx).attr('cy', y(closest.bridgeCoupling)).attr('opacity', 1);
      setHoverPoint(closest);
    }).on('mouseleave', () => {
      hoverLine.attr('opacity', 0);
      hoverDot.attr('opacity', 0);
      hoverDotKinetic.attr('opacity', 0);
      hoverDotPotential.attr('opacity', 0);
      hoverDotBridge.attr('opacity', 0);
      setHoverPoint(null);
    });

  }, [points]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        <p style={{ margin: '0 0 8px' }}>
          The system Hamiltonian sums three terms:
        </p>
        <BlockMath tex={"\\mathcal{H} = \\underbrace{\\sum_p \\tfrac{1}{2}\\log p\\,(|H_p|^2 + |H_p'|^2)}_{T\\text{ (kinetic)}} + \\underbrace{\\tfrac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2}_{V\\text{ (mismatch)}} + \\underbrace{100(1-|\\chi|)^2}_{V_b\\text{ (bridge)}}"} />
        <p style={{ margin: '8px 0' }}>
          At <InlineMath tex={"\\sigma = 0.5"} />, the bridge is lossless (<InlineMath tex={"|\\chi|=1"} />) and the
          direct/dual impedances are conjugate-matched, minimizing the total Hamiltonian.
          The mismatch retains a nonzero imaginary-part residual.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Look for:</strong> the green total curve reaching its minimum at <InlineMath tex={"\\sigma = 0.5"} /> for any <InlineMath tex={"t"} />.
        </p>
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="1" max="60" step="0.5" value={tValue}
            title="Imaginary part of s — controls height on the critical strip. Near zeta zeros the Hamiltonian minimum deepens."
            onChange={e => setTValue(+e.target.value)} />
          <span className="control-value">{tValue.toFixed(1)}</span>
          {(() => {
            let bestIdx = 0, bestDist = Math.abs(tValue - ZETA_ZEROS[0]);
            for (let i = 1; i < ZETA_ZEROS.length; i++) {
              const d = Math.abs(tValue - ZETA_ZEROS[i]);
              if (d < bestDist) { bestDist = d; bestIdx = i; }
              if (ZETA_ZEROS[i] > tValue + 2) break;
            }
            return bestDist < 1 ? (
              <span
                style={{
                  marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: bestDist < 0.3 ? '#10b981' : '#64748b',
                  cursor: 'pointer', borderBottom: '1px dashed currentColor',
                }}
                title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(6)}`}
                onClick={() => setTValue(ZETA_ZEROS[bestIdx])}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="50" step="1" value={numPrimes}
            title="Number of prime oscillators in the chain — more primes give a finer-grained energy landscape."
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <div className="control-group" style={{ flexWrap: 'wrap', gap: 4 }}>
          <label style={{ marginRight: 4 }}>Jump to zero:</label>
          {ZETA_ZEROS.slice(0, 5).map((z, i) => (
            <button
              key={i}
              onClick={() => setTValue(z)}
              title={`Set t = γ${i + 1} = ${z.toFixed(6)}`}
              style={{
                padding: '2px 8px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                background: Math.abs(tValue - z) < 0.01 ? '#10b981' : 'rgba(16,185,129,0.12)',
                color: Math.abs(tValue - z) < 0.01 ? '#0a0e1a' : '#10b981',
                border: '1px solid #10b981',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {'\u03B3'}{String(i + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={z.toFixed(1)}
            </button>
          ))}
        </div>
        {hoverPoint ? (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            <InlineMath tex={"\\sigma"} />={hoverPoint.sigma.toFixed(3)} | <InlineMath tex={"\\mathcal{H}"} />={hoverPoint.total.toFixed(3)} | <InlineMath tex="T" />={hoverPoint.kinetic.toFixed(3)} | <InlineMath tex="V" />={hoverPoint.potential.toFixed(3)} | <span style={{ color: '#8b5cf6' }}><InlineMath tex="V_b" />={hoverPoint.bridgeCoupling.toFixed(3)}</span>
          </div>
        ) : (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#475569', fontStyle: 'italic' }}>
            Hover over chart to inspect values
          </div>
        )}
      </div>
      <ThermoBar sigma={0.5} t={tValue} numPrimes={numPrimes} />
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}
