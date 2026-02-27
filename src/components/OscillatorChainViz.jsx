import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { getPrimes, primeFrequency } from '../math/primes.js';
import { directLadder, dualLadder, losslessBridge } from '../math/oscillators.js';

export default function OscillatorChainViz() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(12);
  const [selectedStage, setSelectedStage] = useState(null);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 900;
    const height = 480;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const s = [sigma, t];
    const direct = directLadder(s, numPrimes);
    const dual = dualLadder(s, numPrimes);
    const bridge = losslessBridge(s);
    const primes = getPrimes(numPrimes);

    const yDirect = 140;
    const yDual = 340;
    const yBridge = 240;
    const xStart = 60;
    const xEnd = width - 60;
    const xSpacing = (xEnd - xStart) / (numPrimes + 1);

    // Background grid
    const g = svg.append('g');
    for (let x = xStart; x <= xEnd; x += 40) {
      g.append('line')
        .attr('x1', x).attr('y1', 40).attr('x2', x).attr('y2', height - 40)
        .attr('stroke', '#1a1f36').attr('stroke-width', 0.5);
    }

    // Labels
    svg.append('text').attr('x', 16).attr('y', yDirect + 4)
      .attr('fill', '#3b82f6').attr('font-size', 12).attr('font-weight', 600)
      .text('DIRECT');
    svg.append('text').attr('x', 16).attr('y', yDual + 4)
      .attr('fill', '#f59e0b').attr('font-size', 12).attr('font-weight', 600)
      .text('DUAL');

    // Bridge label
    svg.append('text').attr('x', width / 2).attr('y', yBridge - 30)
      .attr('text-anchor', 'middle').attr('fill', '#8b5cf6')
      .attr('font-size', 11).attr('font-weight', 600)
      .text(`LOSSLESS BRIDGE  |χ| = ${bridge.magnitude.toFixed(3)}`);

    // Draw connections (wires)
    const directLine = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveMonotoneX);

    // Direct ladder wire
    const directPoints = primes.map((p, i) => ({
      x: xStart + (i + 1) * xSpacing,
      y: yDirect,
    }));
    svg.append('path')
      .datum([{ x: xStart, y: yDirect }, ...directPoints, { x: xEnd, y: yDirect }])
      .attr('d', directLine)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 1.5)
      .attr('opacity', 0.4);

    // Dual ladder wire
    const dualPoints = primes.map((p, i) => ({
      x: xStart + (i + 1) * xSpacing,
      y: yDual,
    }));
    svg.append('path')
      .datum([{ x: xStart, y: yDual }, ...dualPoints, { x: xEnd, y: yDual }])
      .attr('d', directLine)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
      .attr('opacity', 0.4);

    // Bridge connections (vertical lines from each stage to bridge)
    primes.forEach((p, i) => {
      const x = xStart + (i + 1) * xSpacing;
      // Direct to bridge
      svg.append('line')
        .attr('x1', x).attr('y1', yDirect + 22).attr('x2', x).attr('y2', yBridge - 12)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 0.8)
        .attr('opacity', 0.2).attr('stroke-dasharray', '3,3');
      // Bridge to dual
      svg.append('line')
        .attr('x1', x).attr('y1', yBridge + 12).attr('x2', x).attr('y2', yDual - 22)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 0.8)
        .attr('opacity', 0.2).attr('stroke-dasharray', '3,3');
    });

    // Bridge bar
    svg.append('rect')
      .attr('x', xStart).attr('y', yBridge - 10)
      .attr('width', xEnd - xStart).attr('height', 20)
      .attr('rx', 10)
      .attr('fill', bridge.isUnitary ? 'rgba(139,92,246,0.15)' : 'rgba(239,68,68,0.15)')
      .attr('stroke', bridge.isUnitary ? '#8b5cf6' : '#ef4444')
      .attr('stroke-width', 1.5);

    // Oscillator nodes - Direct ladder
    direct.stages.forEach((stage, i) => {
      const x = xStart + (i + 1) * xSpacing;
      const mag = stage.cumulativeMagnitude;
      const radius = Math.min(22, 8 + Math.log(1 + mag) * 4);
      const hue = 210 + stage.phase * 30;

      const group = svg.append('g')
        .attr('cursor', 'pointer')
        .on('click', () => setSelectedStage({ ...stage, ladder: 'direct', index: i }));

      // Glow
      group.append('circle')
        .attr('cx', x).attr('cy', yDirect).attr('r', radius + 4)
        .attr('fill', `hsla(${hue}, 80%, 60%, ${0.1 + stage.magnitude * 0.05})`);

      // Main circle
      group.append('circle')
        .attr('cx', x).attr('cy', yDirect).attr('r', radius)
        .attr('fill', `hsla(${hue}, 70%, 20%, 0.9)`)
        .attr('stroke', `hsla(${hue}, 80%, 60%, 0.8)`)
        .attr('stroke-width', selectedStage?.prime === stage.prime && selectedStage?.ladder === 'direct' ? 3 : 1.5);

      // Prime label
      group.append('text')
        .attr('x', x).attr('y', yDirect + 1)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', `hsla(${hue}, 80%, 75%, 1)`)
        .attr('font-size', radius > 14 ? 12 : 10).attr('font-weight', 700)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(stage.prime);

      // Frequency label below
      group.append('text')
        .attr('x', x).attr('y', yDirect + radius + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b').attr('font-size', 9)
        .text(`ω=${primeFrequency(stage.prime).toFixed(2)}`);

      // Magnitude bar above
      const barH = Math.min(40, stage.magnitude * 5);
      group.append('rect')
        .attr('x', x - 2).attr('y', yDirect - radius - 8 - barH)
        .attr('width', 4).attr('height', barH)
        .attr('rx', 2).attr('fill', `hsla(${hue}, 70%, 55%, 0.6)`);
    });

    // Oscillator nodes - Dual ladder
    dual.stages.forEach((stage, i) => {
      const x = xStart + (i + 1) * xSpacing;
      const mag = stage.cumulativeMagnitude;
      const radius = Math.min(22, 8 + Math.log(1 + mag) * 4);
      const hue = 35 + stage.phase * 20;

      const group = svg.append('g')
        .attr('cursor', 'pointer')
        .on('click', () => setSelectedStage({ ...stage, ladder: 'dual', index: i }));

      group.append('circle')
        .attr('cx', x).attr('cy', yDual).attr('r', radius + 4)
        .attr('fill', `hsla(${hue}, 80%, 60%, ${0.1 + stage.magnitude * 0.05})`);

      group.append('circle')
        .attr('cx', x).attr('cy', yDual).attr('r', radius)
        .attr('fill', `hsla(${hue}, 70%, 20%, 0.9)`)
        .attr('stroke', `hsla(${hue}, 80%, 60%, 0.8)`)
        .attr('stroke-width', selectedStage?.prime === stage.prime && selectedStage?.ladder === 'dual' ? 3 : 1.5);

      group.append('text')
        .attr('x', x).attr('y', yDual + 1)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', `hsla(${hue}, 80%, 75%, 1)`)
        .attr('font-size', radius > 14 ? 12 : 10).attr('font-weight', 700)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(stage.prime);

      group.append('text')
        .attr('x', x).attr('y', yDual + radius + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b').attr('font-size', 9)
        .text(`ω=${primeFrequency(stage.prime).toFixed(2)}`);

      const barH = Math.min(40, stage.magnitude * 5);
      group.append('rect')
        .attr('x', x - 2).attr('y', yDual + radius + 24)
        .attr('width', 4).attr('height', barH)
        .attr('rx', 2).attr('fill', `hsla(${hue}, 70%, 55%, 0.6)`);
    });

    // Summary text
    svg.append('text')
      .attr('x', width - 16).attr('y', 24)
      .attr('text-anchor', 'end').attr('fill', '#64748b').attr('font-size', 11)
      .text(`s = ${sigma.toFixed(2)} + ${t.toFixed(2)}i`);

    svg.append('text')
      .attr('x', width - 16).attr('y', 40)
      .attr('text-anchor', 'end').attr('fill', '#3b82f6').attr('font-size', 11)
      .text(`|ζ(s)| ≈ ${direct.totalMagnitude.toFixed(4)}`);

    svg.append('text')
      .attr('x', width - 16).attr('y', 56)
      .attr('text-anchor', 'end')
      .attr('fill', bridge.isUnitary ? '#10b981' : '#ef4444')
      .attr('font-size', 11)
      .text(`Bridge: ${bridge.isUnitary ? 'LOSSLESS' : 'LOSSY'} (|χ|=${bridge.magnitude.toFixed(3)})`);

  }, [sigma, t, numPrimes, selectedStage]);

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
          <label>σ (Re s)</label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} />
          <span className="control-value">{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>t (Im s)</label>
          <input type="range" min="1" max="60" step="0.1" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 480 }} />
      </div>
      {selectedStage && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>
            {selectedStage.ladder === 'direct' ? 'Direct' : 'Dual'} Ladder — Prime {selectedStage.prime}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Frequency ω</span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{selectedStage.frequency.toFixed(4)}</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>|H(s)|</span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{selectedStage.magnitude.toFixed(4)}</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Phase</span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{(selectedStage.phase * 180 / Math.PI).toFixed(1)}°</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Q Factor</span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{selectedStage.Q.toFixed(2)}</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Energy</span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{selectedStage.energy.toFixed(4)}</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Cumulative |H|</span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{selectedStage.cumulativeMagnitude.toFixed(4)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
