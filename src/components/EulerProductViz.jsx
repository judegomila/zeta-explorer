import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { partialEulerProduct, cAbs, zetaCriticalStrip, ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

export default function EulerProductViz() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [maxPrimes, setMaxPrimes] = useState(30);

  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  // Memoize expensive Euler product and true zeta computations so they don't rerun on resize
  const eulerData = useMemo(() => {
    const { stages } = partialEulerProduct([sigma, t], maxPrimes);
    return stages.slice(1); // skip initial [1,0]
  }, [sigma, t, maxPrimes]);

  const trueZetaMag = useMemo(() => cAbs(zetaCriticalStrip([sigma, t])), [sigma, t]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 360;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 55, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const data = eulerData;

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

    // Horizontal gridlines for magnitude axis
    const gridG = g.append('g')
      .call(d3.axisLeft(yMag).ticks(6).tickSize(-w).tickFormat(''));
    gridG.select('.domain').remove();
    gridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

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
      const barH = Math.abs(yMag(1) - yMag(factorMag));
      const isAmplifying = factorMag > 1;

      const cumMag = cAbs(d.cumulative);
      const phase = Math.atan2(d.cumulative[1], d.cumulative[0]);

      g.append('rect')
        .attr('x', x(i) - barW / 2)
        .attr('y', isAmplifying ? yMag(factorMag) : yMag(1))
        .attr('width', barW)
        .attr('height', Math.max(1, barH))
        .attr('rx', 1)
        .attr('fill', isAmplifying ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)')
        .style('cursor', 'crosshair')
        .append('title').text(`p=${d.prime}: |1−p⁻ˢ|⁻¹ = ${factorMag.toFixed(4)}, cumulative |ζ| = ${cumMag.toFixed(4)}`);

      // Dot on the magnitude curve
      g.append('circle')
        .attr('cx', x(i))
        .attr('cy', yMag(cumMag))
        .attr('r', 3)
        .attr('fill', '#3b82f6')
        .attr('stroke', '#0a0e1a')
        .attr('stroke-width', 1)
        .style('cursor', 'crosshair')
        .append('title').text(`p=${d.prime}: cumulative |ζ| = ${cumMag.toFixed(4)}, phase = ${(phase * 180 / Math.PI).toFixed(1)}°`);
    });

    // Reference line at magnitude = 1 (boundary between amplifying and attenuating factors)
    g.append('line')
      .attr('x1', 0).attr('y1', yMag(1)).attr('x2', w).attr('y2', yMag(1))
      .attr('stroke', '#64748b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

    g.append('text')
      .attr('x', w - 4).attr('y', yMag(1) - 6)
      .attr('text-anchor', 'end').attr('fill', '#64748b').attr('font-size', 10)
      .text('|factor| = 1');

    // Phase plot (secondary axis)
    // Break path at ±π wrap discontinuities to avoid false vertical lines
    const yPhase = d3.scaleLinear().domain([-Math.PI, Math.PI]).range([h, 0]);
    const phases = data.map(d => d.cumulative ? Math.atan2(d.cumulative[1], d.cumulative[0]) : 0);
    const phaseSegments = [];
    let seg = [{ i: 0, phase: phases[0] }];
    for (let i = 1; i < phases.length; i++) {
      if (Math.abs(phases[i] - phases[i - 1]) > Math.PI) {
        phaseSegments.push(seg);
        seg = [];
      }
      seg.push({ i, phase: phases[i] });
    }
    if (seg.length > 0) phaseSegments.push(seg);

    for (const segment of phaseSegments) {
      if (segment.length < 2) continue;
      g.append('path')
        .datum(segment)
        .attr('d', d3.line().x(d => x(d.i)).y(d => yPhase(d.phase)).curve(d3.curveLinear))
        .attr('fill', 'none')
        .attr('stroke', '#8b5cf6')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7);
    }

    // Right y-axis for phase
    const phaseAxis = d3.axisRight(yPhase)
      .tickValues([-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI])
      .tickFormat(v => {
        if (Math.abs(v) < 0.01) return '0';
        if (Math.abs(v - Math.PI) < 0.01) return 'π';
        if (Math.abs(v + Math.PI) < 0.01) return '−π';
        if (Math.abs(v - Math.PI / 2) < 0.01) return 'π/2';
        return '−π/2';
      });
    // Hold a direct reference to the phase-axis g; the previous `g.select('g:last-child')`
    // pattern actually resolved (via querySelector preorder) to the last `<g.tick>` of the
    // X-axis, so the purple stroke styling never reached the phase axis it was meant for.
    const phaseAxisG = g.append('g')
      .attr('transform', `translate(${w},0)`)
      .call(phaseAxis);
    phaseAxisG.selectAll('text').attr('fill', '#8b5cf6').attr('font-size', 10);
    phaseAxisG.selectAll('.domain, .tick line').attr('stroke', '#8b5cf640');

    // Labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Prime (increasing)');

    svg.append('text')
      .attr('x', margin.left - 8).attr('y', 14)
      .attr('fill', '#3b82f6').attr('font-size', 11).attr('font-weight', 600)
      .text('← Cumulative |ζ|');

    svg.append('text')
      .attr('x', width - margin.right).attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('fill', '#8b5cf6').attr('font-size', 11).attr('font-weight', 600)
      .text('Phase arg(ζ) →');

    // True zeta value (Borwein-accelerated) as reference line
    const trueZeta = trueZetaMag;
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

    // Legend box
    const legend = svg.append('g').attr('transform', `translate(${margin.left + 10}, ${margin.top + 8})`);
    const legendItems = [
      { label: 'Cumulative |ζ|', color: '#3b82f6', type: 'line' },
      { label: 'arg(ζ) phase', color: '#8b5cf6', type: 'line' },
      { label: 'True |ζ| (Borwein)', color: '#10b981', type: 'dash' },
      { label: '|factor| > 1', color: 'rgba(59,130,246,0.4)', type: 'rect' },
      { label: '|factor| < 1', color: 'rgba(245,158,11,0.4)', type: 'rect' },
    ];
    legend.append('rect')
      .attr('x', -6).attr('y', -10).attr('width', 150).attr('height', legendItems.length * 18 + 8)
      .attr('rx', 4).attr('fill', 'rgba(13,17,23,0.85)').attr('stroke', '#1e293b');
    legendItems.forEach(({ label, color, type }, i) => {
      const ly = i * 18;
      if (type === 'line') {
        legend.append('line').attr('x1', 0).attr('y1', ly).attr('x2', 16).attr('y2', ly)
          .attr('stroke', color).attr('stroke-width', 2);
      } else if (type === 'dash') {
        legend.append('line').attr('x1', 0).attr('y1', ly).attr('x2', 16).attr('y2', ly)
          .attr('stroke', color).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
      } else {
        legend.append('rect').attr('x', 2).attr('y', ly - 5).attr('width', 12).attr('height', 10)
          .attr('rx', 1).attr('fill', color);
      }
      legend.append('text').attr('x', 22).attr('y', ly + 4)
        .attr('fill', '#94a3b8').attr('font-size', 10).text(label);
    });

    // Final value
    const finalMag = data.length > 0 ? cAbs(data[data.length - 1].cumulative) : 0;
    svg.append('text')
      .attr('x', width - margin.right).attr('y', 30)
      .attr('text-anchor', 'end')
      .attr('fill', '#06b6d4').attr('font-size', 12).attr('font-family', 'var(--font-mono)')
      .text(`|ζ(${sigma.toFixed(2)}+${t.toFixed(1)}i)| ≈ ${finalMag.toFixed(4)}`);

  }, [sigma, t, eulerData, trueZetaMag]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        <p style={{ margin: '0 0 8px' }}>
          The partial Euler product builds up the zeta function prime-by-prime:
        </p>
        <BlockMath tex={"\\zeta_N(s) = \\prod_{p \\leq p_N} \\frac{1}{1-p^{-s}}"} />
        <p style={{ margin: '8px 0' }}>
          Each factor has magnitude <InlineMath tex={"|1-p^{-s}|^{-1}"} /> and
          phase <InlineMath tex={"-\\arg(1-p^{-s})"} />.
          For <InlineMath tex={"\\sigma > 1"} />, the product converges to <InlineMath tex={"\\zeta(s)"} />.
          In the critical strip (<InlineMath tex={"0 < \\sigma \\leq 1"} />), it <strong>diverges</strong> &mdash;
          partial products oscillate without settling. The green reference shows the
          true <InlineMath tex={"|\\zeta(s)|"} /> via analytic continuation.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Look for:</strong> the blue magnitude stabilizing as more primes are added (for <InlineMath tex={"\\sigma > 1"} />); divergent oscillations in the critical strip.
        </p>
      </div>
      <div className="controls">
        <div className="control-group">
          <label style={{ color: sigmaColor, fontWeight: 600 }}>
            <InlineMath tex={"\\sigma = \\operatorname{Re}(s)"} />
          </label>
          <input type="range" min="0.1" max="2" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
          <span style={{ fontSize: 10, color: sigma > 1 ? '#60a5fa' : sigmaColor, opacity: 0.8, marginLeft: 4, fontFamily: 'var(--font-mono)' }}
            title={sigma > 1 ? 'Euler product ∏(1−p⁻ˢ)⁻¹ converges absolutely for σ > 1'
              : Math.abs(sigma - 0.5) < 0.03 ? 'Critical line Re(s) = ½ — Euler product diverges, use analytic continuation'
              : 'Critical strip 0 < σ < 1 — Euler product diverges, partial products oscillate'}
          >{sigma > 1 ? 'convergent' : Math.abs(sigma - 0.5) < 0.03 ? 'critical line' : 'critical strip'}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="0.5" max="60" step="0.1" value={t}
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
                title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(6)}`}
                onClick={() => setT(ZETA_ZEROS[bestIdx])}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Max Primes</label>
          <input type="range" min="5" max="100" step="1" value={maxPrimes}
            onChange={e => setMaxPrimes(+e.target.value)} />
          <span className="control-value">{maxPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(maxPrimes)[maxPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 360 }} />
      </div>
    </div>
  );
}
