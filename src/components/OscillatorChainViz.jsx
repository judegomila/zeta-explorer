import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { getPrimes, primeFrequency } from '../math/primes.js';
import { directLadder, dualLadder, losslessBridge } from '../math/oscillators.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import ThermoBar from './ThermoBar.jsx';

export default function OscillatorChainViz() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(12);
  const [selectedStage, setSelectedStage] = useState(null);

  const svgHeight = Math.max(500, 80 + numPrimes * 38);

  // Color the sigma slider based on distance from critical line
  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  // Memoize ladder/bridge data so resize and selectedStage clicks skip recomputation
  const chainData = useMemo(() => {
    const s = [sigma, t];
    return {
      direct: directLadder(s, numPrimes),
      dual: dualLadder(s, numPrimes),
      bridge: losslessBridge(s),
      primes: getPrimes(numPrimes),
    };
  }, [sigma, t, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 900;
    const height = svgHeight;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const { direct, dual, bridge, primes } = chainData;

    // Vertical layout: three columns
    const xDirect = width * 0.18;
    const xBridge = width * 0.5;
    const xDual = width * 0.82;
    const yStart = 60;
    const yEnd = height - 30;
    const ySpacing = (yEnd - yStart) / (numPrimes + 1);

    // Background grid (horizontal lines)
    const g = svg.append('g');
    for (let y = yStart; y <= yEnd; y += 40) {
      g.append('line')
        .attr('x1', 40).attr('y1', y).attr('x2', width - 40).attr('y2', y)
        .attr('stroke', '#1a1f36').attr('stroke-width', 0.5);
    }

    // Column labels at top
    svg.append('text').attr('x', xDirect).attr('y', 24)
      .attr('text-anchor', 'middle').attr('fill', '#3b82f6')
      .attr('font-size', 12).attr('font-weight', 600)
      .text('DIRECT ζ(s)');
    svg.append('text').attr('x', xDual).attr('y', 24)
      .attr('text-anchor', 'middle').attr('fill', '#f59e0b')
      .attr('font-size', 12).attr('font-weight', 600)
      .text('DUAL ζ(1−s)');
    svg.append('text').attr('x', xBridge).attr('y', 24)
      .attr('text-anchor', 'middle').attr('fill', '#8b5cf6')
      .attr('font-size', 11).attr('font-weight', 600)
      .text(`BRIDGE χ(s)  |χ|=${bridge.magnitude.toFixed(3)}`);

    // Status indicator below bridge label
    svg.append('text').attr('x', xBridge).attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', bridge.isUnitary ? '#10b981' : '#ef4444')
      .attr('font-size', 10).attr('font-weight', 600)
      .text(bridge.isUnitary ? 'LOSSLESS' : 'LOSSY');

    // Draw vertical wires
    const vertLine = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveMonotoneY);

    // Direct ladder wire (vertical)
    const directPoints = primes.map((p, i) => ({
      x: xDirect,
      y: yStart + (i + 1) * ySpacing,
    }));
    svg.append('path')
      .datum([{ x: xDirect, y: yStart }, ...directPoints, { x: xDirect, y: yEnd }])
      .attr('d', vertLine)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 1.5)
      .attr('opacity', 0.4);

    // Dual ladder wire (vertical)
    const dualPoints = primes.map((p, i) => ({
      x: xDual,
      y: yStart + (i + 1) * ySpacing,
    }));
    svg.append('path')
      .datum([{ x: xDual, y: yStart }, ...dualPoints, { x: xDual, y: yEnd }])
      .attr('d', vertLine)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
      .attr('opacity', 0.4);

    // Bridge column (vertical rectangle)
    const bridgeWidth = 24;
    svg.append('rect')
      .attr('x', xBridge - bridgeWidth / 2).attr('y', yStart)
      .attr('width', bridgeWidth).attr('height', yEnd - yStart)
      .attr('rx', 12)
      .attr('fill', bridge.isUnitary ? 'rgba(139,92,246,0.1)' : 'rgba(239,68,68,0.1)')
      .attr('stroke', bridge.isUnitary ? '#8b5cf6' : '#ef4444')
      .attr('stroke-width', 1.5);

    // Horizontal connectors and nodes for each prime
    // Scale connector opacity and width by per-stage magnitude
    const maxMag = Math.max(...direct.stages.map(s => s.magnitude), ...dual.stages.map(s => s.magnitude), 1);
    primes.forEach((p, i) => {
      const y = yStart + (i + 1) * ySpacing;
      const directMag = direct.stages[i]?.magnitude || 1;
      const dualMag = dual.stages[i]?.magnitude || 1;
      const directStrength = directMag / maxMag;
      const dualStrength = dualMag / maxMag;

      // Direct to bridge connector — opacity/width scales with stage magnitude
      svg.append('line')
        .attr('x1', xDirect + 22).attr('y1', y)
        .attr('x2', xBridge - bridgeWidth / 2 - 2).attr('y2', y)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 0.6 + directStrength * 1.4)
        .attr('opacity', 0.12 + directStrength * 0.38).attr('stroke-dasharray', '3,3');

      // Bridge to dual connector — opacity/width scales with stage magnitude
      svg.append('line')
        .attr('x1', xBridge + bridgeWidth / 2 + 2).attr('y1', y)
        .attr('x2', xDual - 22).attr('y2', y)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 0.6 + dualStrength * 1.4)
        .attr('opacity', 0.12 + dualStrength * 0.38).attr('stroke-dasharray', '3,3');

      // Small bridge node at center
      const bridgeNodeR = 4;
      svg.append('circle')
        .attr('cx', xBridge).attr('cy', y).attr('r', bridgeNodeR)
        .attr('fill', bridge.isUnitary ? '#8b5cf6' : '#ef4444')
        .attr('opacity', 0.5);
    });

    // Oscillator nodes - Direct ladder
    direct.stages.forEach((stage, i) => {
      const y = yStart + (i + 1) * ySpacing;
      const mag = stage.cumulativeMagnitude;
      const radius = Math.min(20, 8 + Math.log(1 + mag) * 3.5);
      const hue = 210 + stage.phase * 30;

      const group = svg.append('g')
        .attr('cursor', 'pointer')
        .on('click', () => setSelectedStage({ ...stage, ladder: 'direct', index: i }));

      // Glow
      group.append('circle')
        .attr('cx', xDirect).attr('cy', y).attr('r', radius + 4)
        .attr('fill', `hsla(${hue}, 80%, 60%, ${0.1 + stage.magnitude * 0.05})`);

      // Main circle
      group.append('circle')
        .attr('cx', xDirect).attr('cy', y).attr('r', radius)
        .attr('fill', `hsla(${hue}, 70%, 20%, 0.9)`)
        .attr('stroke', `hsla(${hue}, 80%, 60%, 0.8)`)
        .attr('stroke-width', selectedStage?.prime === stage.prime && selectedStage?.ladder === 'direct' ? 3 : 1.5);

      // Prime label
      group.append('text')
        .attr('x', xDirect).attr('y', y + 1)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', `hsla(${hue}, 80%, 75%, 1)`)
        .attr('font-size', radius > 14 ? 11 : 9).attr('font-weight', 700)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(stage.prime);

      // Characteristic impedance label to the left
      group.append('text')
        .attr('x', xDirect - radius - 8).attr('y', y + 1)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
        .attr('fill', '#64748b').attr('font-size', 8)
        .text(`Z₀=${primeFrequency(stage.prime).toFixed(2)}`);

      // Magnitude bar extending left
      const barW = Math.min(40, stage.magnitude * 5);
      group.append('rect')
        .attr('x', xDirect - radius - 8 - barW).attr('y', y - 2)
        .attr('width', barW).attr('height', 4)
        .attr('rx', 2).attr('fill', `hsla(${hue}, 70%, 55%, 0.5)`);
    });

    // Oscillator nodes - Dual ladder
    dual.stages.forEach((stage, i) => {
      const y = yStart + (i + 1) * ySpacing;
      const mag = stage.cumulativeMagnitude;
      const radius = Math.min(20, 8 + Math.log(1 + mag) * 3.5);
      const hue = 35 + stage.phase * 20;

      const group = svg.append('g')
        .attr('cursor', 'pointer')
        .on('click', () => setSelectedStage({ ...stage, ladder: 'dual', index: i }));

      group.append('circle')
        .attr('cx', xDual).attr('cy', y).attr('r', radius + 4)
        .attr('fill', `hsla(${hue}, 80%, 60%, ${0.1 + stage.magnitude * 0.05})`);

      group.append('circle')
        .attr('cx', xDual).attr('cy', y).attr('r', radius)
        .attr('fill', `hsla(${hue}, 70%, 20%, 0.9)`)
        .attr('stroke', `hsla(${hue}, 80%, 60%, 0.8)`)
        .attr('stroke-width', selectedStage?.prime === stage.prime && selectedStage?.ladder === 'dual' ? 3 : 1.5);

      group.append('text')
        .attr('x', xDual).attr('y', y + 1)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', `hsla(${hue}, 80%, 75%, 1)`)
        .attr('font-size', radius > 14 ? 11 : 9).attr('font-weight', 700)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(stage.prime);

      // Characteristic impedance label to the right
      group.append('text')
        .attr('x', xDual + radius + 8).attr('y', y + 1)
        .attr('text-anchor', 'start').attr('dominant-baseline', 'middle')
        .attr('fill', '#64748b').attr('font-size', 8)
        .text(`Z₀=${primeFrequency(stage.prime).toFixed(2)}`);

      // Magnitude bar extending right, offset past Z₀ label to avoid overlap
      const barW = Math.min(40, stage.magnitude * 5);
      group.append('rect')
        .attr('x', xDual + radius + 56).attr('y', y - 2)
        .attr('width', barW).attr('height', 4)
        .attr('rx', 2).attr('fill', `hsla(${hue}, 70%, 55%, 0.5)`);
    });

    // Summary text (top-right) — with background panel for readability
    const infoG = svg.append('g').attr('transform', `translate(${width - 16}, 52)`);
    infoG.append('rect')
      .attr('x', -200).attr('y', -8).attr('width', 208).attr('height', 4 * 20 + 4)
      .attr('rx', 6).attr('fill', 'rgba(13,17,23,0.85)').attr('stroke', '#1e293b');
    [
      { text: `s = ${sigma.toFixed(2)} + ${t.toFixed(2)}i`, color: '#94a3b8' },
      { text: `|ζ(s)| ≈ ${direct.totalMagnitude.toFixed(4)}`, color: '#3b82f6' },
      { text: `|ζ(1−s)| ≈ ${dual.totalMagnitude.toFixed(4)}`, color: '#f59e0b' },
      { text: `|χ| = ${bridge.magnitude.toFixed(3)},  Γ = ${bridge.reflectionCoeff.toFixed(3)}`, color: bridge.isUnitary ? '#10b981' : '#ef4444' },
    ].forEach(({ text, color }, i) => {
      infoG.append('text')
        .attr('x', 0).attr('y', i * 20)
        .attr('text-anchor', 'end').attr('fill', color)
        .attr('font-size', 11).attr('font-family', 'var(--font-mono)')
        .text(text);
    });

  }, [chainData, selectedStage, svgHeight]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        <p style={{ margin: '0 0 8px' }}>
          The Euler product is realized as a cascade of oscillator stages:
        </p>
        <BlockMath tex={"\\zeta(s) = \\prod_p \\frac{1}{1-p^{-s}}, \\qquad L_p = \\log p,\\; C_p = \\frac{1}{\\log p},\\; \\omega_0 = \\frac{1}{\\sqrt{L_p C_p}} = 1"} />
        <p style={{ margin: '8px 0' }}>
          Each prime <InlineMath tex={"p"} /> contributes an LC stage
          (from <InlineMath tex={"p^{-s} = e^{-s\\log p}"} />), all with resonant
          frequency <InlineMath tex={"\\omega_0 = 1"} />.
          The blue <strong>direct ladder</strong> computes <InlineMath tex={"\\zeta(s)"} />;
          the gold <strong>dual ladder</strong> computes <InlineMath tex={"\\zeta(1-s)"} />.
          The purple <strong>bridge</strong> implements the functional equation:
        </p>
        <BlockMath tex={"\\zeta(s) = \\chi(s)\\,\\zeta(1-s)"} />
        <p style={{ margin: '8px 0' }}>
          At <InlineMath tex={"\\sigma = 0.5"} />, direct and dual are <em>conjugate-matched</em> (since <InlineMath tex={"1-s = \\bar{s}"} /> and <InlineMath tex={"\\zeta(\\bar{s}) = \\overline{\\zeta(s)}"} />) and the bridge is
          lossless (<InlineMath tex={"|\\chi|=1"} />).
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Try:</strong> drag <InlineMath tex={"\\sigma"} /> away from 0.5 and watch the bridge turn lossy.
        </p>
      </div>
      <div className="controls">
        <div className="control-group">
          <label style={{ color: sigmaColor, fontWeight: 600 }}>
            <InlineMath tex="\\sigma = \\operatorname{Re}(s)" />
          </label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
          <span style={{ fontSize: 10, color: sigmaColor, opacity: 0.8, marginLeft: 4, fontFamily: 'var(--font-mono)' }}
            title={sigmaDeviation < 0.02 ? 'σ ≈ ½ — on the critical line where direct/dual ladders are conjugate-matched'
              : sigmaDeviation < 0.15 ? 'Near the critical line — small impedance mismatch'
              : 'Far from critical line — large impedance mismatch between ladders'}
          >{sigmaDeviation < 0.02 ? 'critical line' : sigmaDeviation < 0.15 ? 'near critical' : 'off-axis'}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t = \\operatorname{Im}(s)" /></label>
          <input type="range" min="1" max="60" step="0.1" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
          {(() => {
            let bestIdx = 0, bestDist = Math.abs(t - ZETA_ZEROS[0]);
            for (let i = 1; i < ZETA_ZEROS.length; i++) {
              const d = Math.abs(t - ZETA_ZEROS[i]);
              if (d < bestDist) { bestDist = d; bestIdx = i; }
              if (ZETA_ZEROS[i] > t + 2) break;
            }
            return bestDist < 1 ? (
              <span
                style={{
                  marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: bestDist < 0.3 ? '#10b981' : '#64748b',
                  cursor: 'pointer', borderBottom: '1px dashed currentColor',
                }}
                title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(3)}`}
                onClick={() => setT(+ZETA_ZEROS[bestIdx].toFixed(1))}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={chainData.primes[numPrimes - 1]})</span></span>
        </div>
      </div>
      <ThermoBar sigma={sigma} t={t} numPrimes={numPrimes} />
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: svgHeight }} />
      </div>
      {selectedStage && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>
            {selectedStage.ladder === 'direct' ? 'Direct' : 'Dual'} Ladder — Prime {selectedStage.prime}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Inductance <InlineMath tex="L_p = \\log p" /></span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{selectedStage.frequency.toFixed(4)}</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Capacitance <InlineMath tex="C_p = 1/\\log p" /></span><br/>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{(1 / selectedStage.frequency).toFixed(4)}</span></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>Impedance <InlineMath tex="Z_0 = \\log p" /></span><br/>
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
