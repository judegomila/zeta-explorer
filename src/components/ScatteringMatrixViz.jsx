import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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
  const [hoverPoint, setHoverPoint] = useState(null);

  // Memoize expensive bridge data: 101 losslessBridge calls depend only on tValue,
  // not on mode or viewport size, so avoid recomputing on mode switch or window resize
  const data = useMemo(() => {
    const steps = 100;
    const result = [];
    for (let i = 0; i <= steps; i++) {
      const sigma = 0.01 + (i / steps) * 0.98;
      const bridge = losslessBridge([sigma, tValue]);
      result.push({
        sigma,
        chiMag: bridge.magnitude,
        chiPhase: bridge.phase,
        reflection: bridge.reflectionCoeff,
        isUnitary: bridge.isUnitary,
        unitarityDev: Math.abs(bridge.magnitude - 1),
      });
    }
    return result;
  }, [tValue]);

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

    const x = d3.scaleLinear().domain([0, 1]).range([0, w]);

    if (mode === 'magnitude') {
      const yMax = Math.min(10, d3.max(data, d => d.chiMag) * 1.2);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const gridMag = g.append('g').call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''));
      gridMag.select('.domain').remove();
      gridMag.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

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
        .attr('text-anchor', 'middle').attr('fill', '#ef4444').attr('font-size', 10)
        .text('|χ| > 1: amplifying');
      g.append('text').attr('x', x(0.75)).attr('y', 20)
        .attr('text-anchor', 'middle').attr('fill', '#3b82f6').attr('font-size', 10)
        .text('|χ| < 1: attenuating');

    } else if (mode === 'reflection') {
      const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const gridRef = g.append('g').call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''));
      gridRef.select('.domain').remove();
      gridRef.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

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

      // Mark σ = 0.5 point
      const halfPoint = data.find(d => Math.abs(d.sigma - 0.5) < 0.01);
      if (halfPoint) {
        g.append('circle')
          .attr('cx', x(0.5)).attr('cy', y(Math.min(1, halfPoint.reflection))).attr('r', 5)
          .attr('fill', '#10b981').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
        g.append('text')
          .attr('x', x(0.5) + 8).attr('y', y(Math.min(1, halfPoint.reflection)) - 8)
          .attr('fill', '#10b981').attr('font-size', 11).attr('font-weight', 600)
          .text(`Γ(½+${tValue.toFixed(1)}i) = ${halfPoint.reflection.toFixed(4)}`);
      }

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

      // Horizontal gridlines
      const gridPhase = g.append('g').call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''));
      gridPhase.select('.domain').remove();
      gridPhase.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

      g.append('line')
        .attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');

      const line = d3.line()
        .x(d => x(d.sigma))
        .y(d => y(d.chiPhase * 180 / Math.PI))
        .curve(d3.curveLinear);

      g.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 2.5);

      // Mark σ = 0.5 point
      const halfPoint = data.find(d => Math.abs(d.sigma - 0.5) < 0.01);
      if (halfPoint) {
        const phaseDeg = halfPoint.chiPhase * 180 / Math.PI;
        g.append('circle')
          .attr('cx', x(0.5)).attr('cy', y(phaseDeg)).attr('r', 5)
          .attr('fill', '#10b981').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
        g.append('text')
          .attr('x', x(0.5) + 8).attr('y', y(phaseDeg) - 8)
          .attr('fill', '#10b981').attr('font-size', 11).attr('font-weight', 600)
          .text(`arg(χ(½+${tValue.toFixed(1)}i)) = ${phaseDeg.toFixed(1)}°`);
      }

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

    // Hover crosshair interaction (works for all modes)
    const hoverOverlay = g.append('rect')
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

    // Build y-scale and accessor matching current mode
    let yScale, yAccessor;
    if (mode === 'magnitude') {
      const yMax = Math.min(10, d3.max(data, d => d.chiMag) * 1.2);
      yScale = d3.scaleLinear().domain([0, yMax]).range([h, 0]);
      yAccessor = d => Math.min(yMax, d.chiMag);
    } else if (mode === 'reflection') {
      yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);
      yAccessor = d => Math.min(1, d.reflection);
    } else {
      yScale = d3.scaleLinear().domain([-180, 180]).range([h, 0]);
      yAccessor = d => d.chiPhase * 180 / Math.PI;
    }

    const setHP = setHoverPoint;
    hoverOverlay.on('mousemove', (event) => {
      const [mx] = d3.pointer(event);
      const sigma = x.invert(mx);
      const closest = data.reduce((best, p) =>
        Math.abs(p.sigma - sigma) < Math.abs(best.sigma - sigma) ? p : best
      , data[0]);

      hoverLine.attr('x1', x(closest.sigma)).attr('x2', x(closest.sigma)).attr('opacity', 0.3);
      hoverDot.attr('cx', x(closest.sigma)).attr('cy', yScale(yAccessor(closest))).attr('opacity', 1);
      setHP(closest);
    }).on('mouseleave', () => {
      hoverLine.attr('opacity', 0);
      hoverDot.attr('opacity', 0);
      setHP(null);
    });

  }, [data, tValue, mode]);

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
          <strong>The math:</strong> The reflection coefficient <InlineMath tex="\Gamma = |1 - |\chi(s)||\,/\,(1 + |\chi(s)|)" /> measures how
          much energy is reflected back rather than transmitted through the bridge. At <InlineMath tex="\sigma = \tfrac{1}{2}" />,{' '}
          <InlineMath tex="\Gamma = 0" /> (perfect transmission, impedance match). This is the scattering-matrix condition for
          lossless two-port networks: <InlineMath tex="S^\dagger S = I" />.
          <strong> Look for:</strong> <InlineMath tex="\Gamma" /> touching zero at <InlineMath tex="\sigma = 0.5" />.
        </div>
      )}
      {mode === 'phase' && (
        <div className="tab-explainer accent-orange">
          <strong>The math:</strong> The bridge phase <InlineMath tex="\arg\chi(\sigma+it)" /> shows the angular rotation of the
          functional equation prefactor as <InlineMath tex="\sigma" /> varies for fixed <InlineMath tex="t" />.
          At <InlineMath tex="\sigma = \tfrac{1}{2}" />, where <InlineMath tex="|\chi|=1" />, the phase
          equals <InlineMath tex="-2\theta(t)" /> where{' '}
          <InlineMath tex="\theta(t) = \text{Im}\,\log\Gamma(\tfrac{1}{4}+\tfrac{it}{2}) - \tfrac{t}{2}\log\pi" />{' '}
          is the Riemann-Siegel theta function. Away from the critical line, the phase combines
          contributions from <InlineMath tex="\Gamma(1-s)" />, <InlineMath tex="2^s\pi^{s-1}" />,
          and <InlineMath tex="\sin(\pi s/2)" />.
          <strong> Look for:</strong> the phase value at <InlineMath tex="\sigma = 0.5" /> and how the curve steepens as you increase <InlineMath tex="t" />.
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
                title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(3)}`}
                onClick={() => setTValue(+ZETA_ZEROS[bestIdx].toFixed(1))}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        {hoverPoint ? (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            σ={hoverPoint.sigma.toFixed(3)} |
            {mode === 'magnitude' && <> |χ|={hoverPoint.chiMag.toFixed(4)} | Γ={hoverPoint.reflection.toFixed(4)}</>}
            {mode === 'reflection' && <> Γ={hoverPoint.reflection.toFixed(4)} | |χ|={hoverPoint.chiMag.toFixed(4)}</>}
            {mode === 'phase' && <> arg(χ)={(hoverPoint.chiPhase * 180 / Math.PI).toFixed(1)}°</>}
          </div>
        ) : (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#475569', fontStyle: 'italic' }}>
            Hover over chart to inspect values
          </div>
        )}
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}
