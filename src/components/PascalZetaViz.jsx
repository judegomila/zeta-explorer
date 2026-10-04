import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  binomial, pascalRow, pascalTriangle,
  brothersEConvergence, piFromPascal, piArcsinSeries,
  hasseZeta, pascalZetaScan, pascalRowConvergence, rowWeightedDirichlet,
} from '../math/pascal.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { ED, alpha } from '../styles/tokens.js';

function ZeroSnap({ tValue, setTValue }) {
  let bestIdx = 0, bestDist = Math.abs(tValue - ZETA_ZEROS[0]);
  for (let i = 1; i < ZETA_ZEROS.length; i++) {
    const d = Math.abs(tValue - ZETA_ZEROS[i]);
    if (d < bestDist) { bestDist = d; bestIdx = i; }
    if (ZETA_ZEROS[i] > tValue + 2) break;
  }
  if (bestDist >= 1) return null;
  return (
    <span
      style={{
        marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
        color: bestDist < 0.3 ? 'var(--series-3)' : 'var(--ink-faint)',
        cursor: 'pointer', borderBottom: '1px dashed currentColor',
      }}
      title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(6)}`}
      onClick={() => setTValue(ZETA_ZEROS[bestIdx])}
    >
      {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
    </span>
  );
}

const TABS = [
  { id: 'triangle', label: "Pascal's Triangle" },
  { id: 'constants', label: 'e, π, i from Pascal' },
  { id: 'hasse', label: 'Hasse–Sondow ζ(s)' },
  { id: 'decorated', label: 'Decorated Zeta' },
  { id: 'modp', label: 'Pascal mod p' },
];

// ─── Tab 1: Pascal's Triangle Visual ─────────────────────────────────────────

function TriangleTab() {
  const [numRows, setNumRows] = useState(10);
  const svgRef = useRef();

  const rows = useMemo(() => pascalTriangle(numRows), [numRows]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 700;
    const cellSize = Math.min(48, (width - 40) / (numRows + 1));
    const height = numRows * cellSize + 60;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, 30)`);

    // Color scale: log of value
    const maxVal = Math.max(...rows.flat());
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, Math.log(maxVal + 1)]);

    rows.forEach((row, n) => {
      const y = n * cellSize;
      row.forEach((val, k) => {
        const x = (k - n / 2) * cellSize;
        const isCentral = k === Math.floor(n / 2) && n % 2 === 0;

        g.append('rect')
          .attr('x', x - cellSize / 2 + 2)
          .attr('y', y - cellSize / 2 + 2)
          .attr('width', cellSize - 4)
          .attr('height', cellSize - 4)
          .attr('rx', 4)
          .attr('fill', colorScale(Math.log(val + 1)))
          .attr('stroke', isCentral ? ED.brassDeco : 'none')
          .attr('stroke-width', isCentral ? 2 : 0)
          .attr('opacity', 0.85);

        if (cellSize > 20) {
          g.append('text')
            .attr('x', x)
            .attr('y', y + 1)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            // Match the colorScale's log domain — a linear threshold against maxVal
            // leaves yellow-green cells (mid-to-upper viridis) with light text on light fill.
            .attr('fill', Math.log(val + 1) > Math.log(maxVal + 1) * 0.55 ? '#0f172a' : '#e2e8f0')
            .attr('font-size', Math.min(11, cellSize * 0.35))
            .attr('font-family', 'var(--font-mono)')
            .text(val > 99999 ? val.toExponential(0) : val);
        }
      });
    });

    // Legend
    g.append('text')
      .attr('x', 0).attr('y', -14)
      .attr('text-anchor', 'middle')
      .attr('fill', ED.inkSoft).attr('font-size', 11)
      .text(`${numRows} rows — central binomials highlighted in gold`);

    // Colorbar for the Viridis heatmap scale
    const barW = 14;
    const barH = Math.min(120, height * 0.4);
    const barX = width / 2 + (numRows / 2 + 1) * cellSize;
    const barY0 = 30;
    const defs = svg.append('defs');
    const gradId = 'pascal-viridis-grad';
    const grad = defs.append('linearGradient')
      .attr('id', gradId).attr('x1', 0).attr('y1', 1).attr('x2', 0).attr('y2', 0);
    const barSteps = 10;
    for (let i = 0; i <= barSteps; i++) {
      const t = i / barSteps;
      grad.append('stop')
        .attr('offset', `${t * 100}%`)
        .attr('stop-color', d3.interpolateViridis(t));
    }
    svg.append('rect')
      .attr('x', barX).attr('y', barY0)
      .attr('width', barW).attr('height', barH)
      .attr('rx', 3).attr('fill', `url(#${gradId})`)
      .attr('stroke', ED.rule).attr('stroke-width', 0.5);
    svg.append('text')
      .attr('x', barX + barW / 2).attr('y', barY0 - 5)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 9)
      .text(maxVal > 99999 ? maxVal.toExponential(1) : maxVal);
    svg.append('text')
      .attr('x', barX + barW / 2).attr('y', barY0 + barH + 12)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 9)
      .text('1');
    svg.append('text')
      .attr('x', barX + barW + 4).attr('y', barY0 + barH / 2 + 3)
      .attr('fill', ED.inkFaint).attr('font-size', 9)
      .text('Value');
  }, [rows, numRows]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        Pascal's triangle visualized as a heatmap with log-scaled coloring. Central binomial
        coefficients <InlineMath tex={"\\binom{2n}{n}"} /> are highlighted in gold — these connect to{' '}
        <InlineMath tex={"\\pi"} /> and appear as the spine of the triangle.
        <strong> Look for:</strong> the gold-outlined entries growing much faster than their neighbors.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Rows</label>
          <input type="range" min="3" max="20" step="1" value={numRows}
            onChange={e => setNumRows(+e.target.value)} />
          <span className="control-value">{numRows}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 'auto', minHeight: 200 }} />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13 }}>
        <p style={{ color: 'var(--ink-soft)' }}>
          Each entry <InlineMath tex={"C(n,k) = \\binom{n}{k}"} /> is the binomial coefficient.
          Central binomials <InlineMath tex={"C(2n,n)"} /> (gold outlines) connect to <InlineMath tex={"\\pi"} /> and
          row products connect to <InlineMath tex={"e"} /> via:
        </p>
        <BlockMath tex={"\\pi = \\lim_{n\\to\\infty} \\frac{4^{2n}}{n\\,C(2n,n)^2}"} />
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
          Stirling's approximation gives <InlineMath tex={"C(2n,n) \\sim 4^{n}/\\sqrt{\\pi n}"} />,
          so <InlineMath tex={"4^{2n}/(n\\,C(2n,n)^2) \\to \\pi"} /> as <InlineMath tex={"n\\to\\infty"} />.
          The convergence is slow (<InlineMath tex={"O(1/n)"} />), so even <InlineMath tex={"n=100"} /> only gives <InlineMath tex={"\\pi"} /> to about 3 decimals.
        </p>
      </div>
    </div>
  );
}

// ─── Tab 2: Constants e, π, i ────────────────────────────────────────────────

function ConstantsTab() {
  const [maxN, setMaxN] = useState(25);
  const svgRef = useRef();

  const data = useMemo(() => ({
    eData: brothersEConvergence(maxN),
    piData: piFromPascal(Math.min(maxN, 40)),
    piArcsin: piArcsinSeries(maxN),
  }), [maxN]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 700;
    const totalHeight = 520;
    svg.attr('viewBox', `0 0 ${width} ${totalHeight}`);

    const margin = { top: 24, right: 20, bottom: 36, left: 56 };
    const w = width - margin.left - margin.right;
    const chartH = 140;

    // ─ Chart 1: Brothers' e ─
    const g1 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x1 = d3.scaleLinear().domain([2, maxN]).range([0, w]);
    const y1 = d3.scaleLinear()
      .domain([d3.min(data.eData, d => d.ratio) * 0.998, Math.E * 1.002])
      .range([chartH, 0]);

    // Grid
    g1.append('g').attr('transform', `translate(0,${chartH})`)
      .call(d3.axisBottom(x1).ticks(8).tickSize(0))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g1.append('g').call(d3.axisLeft(y1).ticks(5).tickSize(-w).tickFormat(d3.format('.4f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);

    // e reference line
    g1.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', y1(Math.E)).attr('y2', y1(Math.E))
      .attr('stroke', ED.series3).attr('stroke-dasharray', '6,3').attr('opacity', 0.7);
    g1.append('text').attr('x', w - 4).attr('y', y1(Math.E) - 6)
      .attr('text-anchor', 'end').attr('fill', ED.series3).attr('font-size', 11)
      .text('e = 2.7183...');

    // Brothers' ratio
    g1.append('path')
      .datum(data.eData)
      .attr('d', d3.line().x(d => x1(d.n)).y(d => y1(d.ratio)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series1).attr('stroke-width', 2);
    data.eData.forEach(d => {
      g1.append('circle').attr('cx', x1(d.n)).attr('cy', y1(d.ratio))
        .attr('r', 2.5).attr('fill', ED.series1);
    });

    // Classic (1+1/n)^n
    g1.append('path')
      .datum(data.eData)
      .attr('d', d3.line().x(d => x1(d.n)).y(d => y1(d.classic)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series5).attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3');

    g1.append('text').attr('x', 4).attr('y', -6)
      .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
      .text("Brothers' e from Pascal row products");

    // Axis labels
    g1.append('text')
      .attr('x', w / 2).attr('y', chartH + 30)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
      .text('n');
    g1.append('text')
      .attr('transform', `translate(-42, ${chartH / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
      .text('Ratio');

    // Legend
    const leg1 = g1.append('g').attr('transform', `translate(${w - 180}, 10)`);
    leg1.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 0).attr('y2', 0)
      .attr('stroke', ED.series1).attr('stroke-width', 2);
    leg1.append('text').attr('x', 20).attr('y', 4).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('sₙ₋₁·sₙ₊₁/sₙ²');
    leg1.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 16).attr('y2', 16)
      .attr('stroke', ED.series5).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
    leg1.append('text').attr('x', 20).attr('y', 20).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('(1+1/n)ⁿ');

    // ─ Chart 2: Pi from central binomials ─
    const y2Off = margin.top + chartH + 56;
    const g2 = svg.append('g').attr('transform', `translate(${margin.left},${y2Off})`);
    const x2 = d3.scaleLinear().domain([1, data.piData.length]).range([0, w]);
    const allPiVals = [
      ...data.piData.map(d => d.piApprox),
      ...data.piArcsin.map(d => d.piApprox),
    ];
    const y2 = d3.scaleLinear()
      .domain([d3.min(allPiVals) * 0.99, d3.max(allPiVals) * 1.01])
      .range([chartH, 0]);

    g2.append('g').attr('transform', `translate(0,${chartH})`)
      .call(d3.axisBottom(x2).ticks(8).tickSize(0))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g2.append('g').call(d3.axisLeft(y2).ticks(5).tickSize(-w).tickFormat(d3.format('.5f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);

    // π reference
    g2.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', y2(Math.PI)).attr('y2', y2(Math.PI))
      .attr('stroke', ED.brassDeco).attr('stroke-dasharray', '6,3').attr('opacity', 0.7);
    g2.append('text').attr('x', w - 4).attr('y', y2(Math.PI) - 6)
      .attr('text-anchor', 'end').attr('fill', ED.brass).attr('font-size', 11)
      .text('π = 3.14159...');

    g2.append('path')
      .datum(data.piData)
      .attr('d', d3.line().x(d => x2(d.n)).y(d => y2(d.piApprox)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.brassDeco).attr('stroke-width', 2);
    data.piData.forEach(d => {
      g2.append('circle').attr('cx', x2(d.n)).attr('cy', y2(d.piApprox))
        .attr('r', 2.5).attr('fill', ED.brassDeco);
    });

    // Arcsin series
    g2.append('path')
      .datum(data.piArcsin)
      .attr('d', d3.line().x(d => x2(d.n + 1)).y(d => y2(d.piApprox)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series7).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');

    g2.append('text').attr('x', 4).attr('y', -6)
      .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
      .text('π from Central Binomial Coefficients');

    // Axis labels
    g2.append('text')
      .attr('x', w / 2).attr('y', chartH + 30)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
      .text('n');
    g2.append('text')
      .attr('transform', `translate(-42, ${chartH / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
      .text('π approx');

    const leg2 = g2.append('g').attr('transform', `translate(${w - 200}, 10)`);
    leg2.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 0).attr('y2', 0)
      .attr('stroke', ED.brassDeco).attr('stroke-width', 2);
    leg2.append('text').attr('x', 20).attr('y', 4).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('4²ⁿ / (n·C(2n,n)²)');
    leg2.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 16).attr('y2', 16)
      .attr('stroke', ED.series7).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
    leg2.append('text').attr('x', 20).attr('y', 20).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('arcsin series');

    // ─ Chart 3: Error convergence (log scale) ─
    const y3Off = y2Off + chartH + 56;
    const g3 = svg.append('g').attr('transform', `translate(${margin.left},${y3Off})`);
    const x3 = d3.scaleLinear().domain([1, maxN]).range([0, w]);
    const allErrors = [
      ...data.eData.map(d => d.error),
      ...data.piData.map(d => d.error),
      ...data.piArcsin.map(d => d.error),
    ].filter(e => e > 0);
    const y3 = d3.scaleLog()
      .domain([d3.min(allErrors) * 0.1, d3.max(allErrors) * 2])
      .range([chartH, 0]);

    g3.append('g').attr('transform', `translate(0,${chartH})`)
      .call(d3.axisBottom(x3).ticks(8).tickSize(0))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g3.append('g').call(d3.axisLeft(y3).ticks(5, '.0e').tickSize(-w))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);

    // e errors
    const eErrors = data.eData.filter(d => d.error > 0);
    g3.append('path')
      .datum(eErrors)
      .attr('d', d3.line().x(d => x3(d.n)).y(d => y3(d.error)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series1).attr('stroke-width', 2);
    eErrors.forEach(d => {
      g3.append('circle').attr('cx', x3(d.n)).attr('cy', y3(d.error))
        .attr('r', 2.5).attr('fill', ED.series1);
    });

    // pi errors
    const piErrors = data.piData.filter(d => d.error > 0);
    g3.append('path')
      .datum(piErrors)
      .attr('d', d3.line().x(d => x3(d.n)).y(d => y3(d.error)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.brassDeco).attr('stroke-width', 2);
    piErrors.forEach(d => {
      g3.append('circle').attr('cx', x3(d.n)).attr('cy', y3(d.error))
        .attr('r', 2.5).attr('fill', ED.brassDeco);
    });

    // arcsin pi errors
    const arcsinErrors = data.piArcsin.filter(d => d.error > 0);
    g3.append('path')
      .datum(arcsinErrors)
      .attr('d', d3.line().x(d => x3(d.n + 1)).y(d => y3(d.error)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series7).attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3');
    arcsinErrors.forEach(d => {
      g3.append('circle').attr('cx', x3(d.n + 1)).attr('cy', y3(d.error))
        .attr('r', 2).attr('fill', ED.series7);
    });

    g3.append('text').attr('x', 4).attr('y', -6)
      .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
      .text('Convergence Error (log scale)');

    // Axis labels
    g3.append('text')
      .attr('x', w / 2).attr('y', chartH + 30)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
      .text('n');
    g3.append('text')
      .attr('transform', `translate(-42, ${chartH / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
      .text('|Error|');

    const leg3 = g3.append('g').attr('transform', `translate(${w - 150}, 10)`);
    leg3.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 0).attr('y2', 0)
      .attr('stroke', ED.series1).attr('stroke-width', 2);
    leg3.append('circle').attr('cx', 8).attr('cy', 0).attr('r', 2.5).attr('fill', ED.series1);
    leg3.append('text').attr('x', 22).attr('y', 4).attr('fill', ED.inkSoft).attr('font-size', 10).text('|e − approx|');
    leg3.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 16).attr('y2', 16)
      .attr('stroke', ED.brassDeco).attr('stroke-width', 2);
    leg3.append('circle').attr('cx', 8).attr('cy', 16).attr('r', 2.5).attr('fill', ED.brassDeco);
    leg3.append('text').attr('x', 22).attr('y', 20).attr('fill', ED.inkSoft).attr('font-size', 10).text('|π − 4²ⁿ/(n·C²)|');
    leg3.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 32).attr('y2', 32)
      .attr('stroke', ED.series7).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
    leg3.append('circle').attr('cx', 8).attr('cy', 32).attr('r', 2).attr('fill', ED.series7);
    leg3.append('text').attr('x', 22).attr('y', 36).attr('fill', ED.inkSoft).attr('font-size', 10).text('|π − arcsin|');

  }, [data, maxN]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        Three fundamental constants extracted from Pascal's triangle:{' '}
        <InlineMath tex="e" /> via Brothers' row-product ratios,{' '}
        <InlineMath tex={"\\pi"} /> via central binomials, and{' '}
        <InlineMath tex="i" /> via Euler's identity. The bottom chart shows convergence errors on a log scale.
        <strong> Look for:</strong> Brothers' formula (blue) converging faster than the classical{' '}
        <InlineMath tex="(1+1/n)^n" /> (purple dashed).
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Max n</label>
          <input type="range" min="8" max="40" step="1" value={maxN}
            onChange={e => setMaxN(+e.target.value)} />
          <span className="control-value">{maxN}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 520 }} />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13 }}>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 4 }}>
          <strong style={{ color: 'var(--series-1)' }}>Euler's number</strong> from Brothers' result,
          where <InlineMath tex={"s_n = \\prod_{k=0}^{n} \\binom{n}{k}"} />:
        </p>
        <BlockMath tex={"e = \\lim_{n\\to\\infty} \\frac{s_{n-1}\\cdot s_{n+1}}{s_n^2}"} />
        <p style={{ color: 'var(--ink-soft)', marginBottom: 4 }}>
          <strong style={{ color: 'var(--brass)' }}>Pi</strong> from central binomials:
        </p>
        <BlockMath tex={"\\pi = \\lim_{n\\to\\infty} \\frac{4^{2n}}{n\\,\\binom{2n}{n}^2}"} />
        <p style={{ color: 'var(--ink-soft)' }}>
          <strong style={{ color: 'var(--series-7)' }}>Euler's identity</strong>{' '}
          <InlineMath tex={"e^{i\\pi} + 1 = 0"} /> unites all three: having extracted{' '}
          <InlineMath tex="e" /> and <InlineMath tex={"\\pi"} /> from Pascal's triangle, we obtain{' '}
          <InlineMath tex={"i = \\frac{\\log(-1)}{\\pi}"} /> — the imaginary unit lives implicitly
          in every row of the triangle.
        </p>
      </div>
    </div>
  );
}

// ─── Tab 3: Hasse-Sondow Formula ────────────────────────────────────────────

function HasseTab() {
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [maxRows, setMaxRows] = useState(30);
  const svgRef = useRef();

  const convergence = useMemo(() => pascalRowConvergence([sigma, t], maxRows), [sigma, t, maxRows]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 700;
    const height = 420;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 20, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, maxRows]).range([0, w]);

    // Main chart: |ζ(s)| convergence
    const yMax = d3.max(convergence, d => d.zetaMag) * 1.1;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(d3.format('.3f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);

    // Contribution bars
    const barW = Math.max(2, w / maxRows * 0.6);
    convergence.forEach(d => {
      const barH = Math.min(h, Math.max(1, (d.contributionMag / yMax) * h * 5));
      g.append('rect')
        .attr('x', x(d.row) - barW / 2)
        .attr('y', h - barH)
        .attr('width', barW)
        .attr('height', barH)
        .attr('fill', ED.series5)
        .attr('opacity', 0.3);
    });

    // ζ magnitude line
    g.append('path')
      .datum(convergence)
      .attr('d', d3.line().x(d => x(d.row)).y(d => y(d.zetaMag)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series1).attr('stroke-width', 2.5);

    convergence.forEach(d => {
      g.append('circle').attr('cx', x(d.row)).attr('cy', y(d.zetaMag))
        .attr('r', 2).attr('fill', ED.series1);
    });

    // Final value annotation
    const final = convergence[convergence.length - 1];
    g.append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', y(final.zetaMag)).attr('y2', y(final.zetaMag))
      .attr('stroke', ED.series3).attr('stroke-dasharray', '6,3').attr('opacity', 0.6);
    g.append('text')
      .attr('x', w - 4).attr('y', y(final.zetaMag) - 8)
      .attr('text-anchor', 'end').attr('fill', ED.series3).attr('font-size', 11)
      .text(`|ζ| ≈ ${final.zetaMag.toFixed(4)}`);

    // Labels
    g.append('text').attr('x', w / 2).attr('y', h + 38)
      .attr('text-anchor', 'middle').attr('fill', ED.inkFaint).attr('font-size', 11)
      .text('Pascal row n');
    g.append('text')
      .attr('transform', `translate(-44,${h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkFaint).attr('font-size', 11)
      .text('|ζ(s)|');

    g.append('text').attr('x', 4).attr('y', -10)
      .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
      .text(`Hasse–Sondow convergence at s = ${sigma.toFixed(2)} + ${t.toFixed(2)}i`);

    // Legend
    const leg = g.append('g').attr('transform', `translate(${w - 200}, 10)`);
    const legBg = leg.append('rect')
      .attr('x', -6).attr('y', -8).attr('width', 200).attr('height', 50).attr('rx', 4)
      .attr('fill', alpha(ED.paper, 0.85)).attr('stroke', ED.ruleSoft);
    leg.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 0).attr('y2', 0)
      .attr('stroke', ED.series1).attr('stroke-width', 2.5);
    leg.append('circle').attr('cx', 8).attr('cy', 0).attr('r', 2).attr('fill', ED.series1);
    leg.append('text').attr('x', 22).attr('y', 4).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('|ζ(s)| partial sum');
    leg.append('rect').attr('x', 0).attr('y', 12).attr('width', 16).attr('height', 8)
      .attr('fill', ED.series5).attr('opacity', 0.3);
    leg.append('text').attr('x', 22).attr('y', 20).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('Row contribution (5× scale)');
    leg.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 30).attr('y2', 30)
      .attr('stroke', ED.series3).attr('stroke-dasharray', '6,3').attr('opacity', 0.6);
    leg.append('text').attr('x', 22).attr('y', 34).attr('fill', ED.inkSoft).attr('font-size', 10)
      .text('Converged value');

  }, [convergence, maxRows, sigma, t]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const sigmaColor = Math.abs(sigma - 0.5) < 0.02 ? ED.series3
    : Math.abs(sigma - 0.5) < 0.15 ? ED.series4 : ED.series2;

  return (
    <div>
      <div className="tab-explainer accent-purple">
        The Hasse–Sondow formula computes <InlineMath tex={"\\zeta(s)"} /> entirely from Pascal triangle
        rows: each row <InlineMath tex="n" /> contributes a weighted forward difference of <InlineMath tex="(k+1)^{-s}" />.
        Purple bars show per-row contribution magnitude; the blue curve is the running partial sum.
        <strong> Look for:</strong> rapid convergence when <InlineMath tex="t" /> is snapped to a zeta zero
        (green indicator appears), where <InlineMath tex={"|\\zeta(s)| \\to 0"} />.
      </div>
      <div className="controls">
        <div className="control-group">
          <label title="Real part of s — controls convergence region"><InlineMath tex={"\\sigma = \\operatorname{Re}(s)"} /></label>
          <input type="range" min="0.1" max="2" step="0.05" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            title={sigma > 1 ? 'Convergent region (σ > 1)' : Math.abs(sigma - 0.5) < 0.03 ? 'Critical line (σ = ½)' : 'Critical strip (0 < σ < 1)'}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
          <span style={{ fontSize: 10, color: sigmaColor, opacity: 0.8, marginLeft: 4, fontFamily: 'var(--font-mono)' }}
            title={sigma > 1 ? 'Convergent region — Euler product converges absolutely'
              : Math.abs(sigma - 0.5) < 0.03 ? 'Critical line Re(s) = ½'
              : 'Critical strip — analytic continuation required'}
          >{sigma > 1 ? 'convergent' : Math.abs(sigma - 0.5) < 0.03 ? 'critical line' : 'critical strip'}</span>
        </div>
        <div className="control-group">
          <label title="Imaginary part of s — zeta zeros occur at specific t values"><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)}
            title="Imaginary part of s — snap to a zeta zero using the indicator" />
          <span className="control-value">{t.toFixed(1)}</span>
          <ZeroSnap tValue={t} setTValue={setT} />
        </div>
        <div className="control-group">
          <label title="Number of Pascal triangle rows used in the Hasse–Sondow series — more rows give better convergence">Rows</label>
          <input type="range" min="5" max="50" step="1" value={maxRows}
            onChange={e => setMaxRows(+e.target.value)}
            title="More rows = better convergence of the Hasse–Sondow series" />
          <span className="control-value">{maxRows}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13, color: 'var(--ink-soft)' }}>
        <p style={{ margin: '0 0 8px' }}>
          Each bar shows the magnitude of row <InlineMath tex={"n"} />'s contribution. The blue curve is the running
          approximation <InlineMath tex={"|\\zeta(s)|"} /> as more Pascal triangle rows are included:
        </p>
        <BlockMath tex={"\\text{Row } n: \\quad \\frac{1}{2^{n+1}} \\sum_{k=0}^{n}(-1)^k\\binom{n}{k}(k+1)^{-s}"} />
      </div>
    </div>
  );
}

// ─── Tab 4: Decorated Zeta ───────────────────────────────────────────────────

function DecoratedTab() {
  const [t, setT] = useState(14.13);
  const [selectedRow, setSelectedRow] = useState(5);
  const [maxTerms, setMaxTerms] = useState(25);
  const svgRef = useRef();

  const scan = useMemo(() => pascalZetaScan(t, [0.05, 2.5], 80, maxTerms), [t, maxTerms]);
  const rowDirichlet = useMemo(() => rowWeightedDirichlet(selectedRow, [0.05, 2.5], t, 80), [selectedRow, t]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 700;
    const height = 460;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 20, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h1 = 180; // top chart
    const h2 = 140; // bottom chart
    const gap = 56;

    // ─ Top: Hasse |ζ(s)| scan across σ ─
    const g1 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0.05, 2.5]).range([0, w]);
    const y1Max = d3.max(scan, d => d.zetaMag) * 1.1;
    const y1 = d3.scaleLinear().domain([0, Math.min(y1Max, 10)]).range([h1, 0]);

    g1.append('g').attr('transform', `translate(0,${h1})`)
      .call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g1.append('g').call(d3.axisLeft(y1).ticks(5).tickSize(-w).tickFormat(d3.format('.2f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);

    // σ = 0.5 line
    g1.append('line')
      .attr('x1', x(0.5)).attr('x2', x(0.5)).attr('y1', 0).attr('y2', h1)
      .attr('stroke', ED.series3).attr('stroke-dasharray', '4,4').attr('opacity', 0.6);
    g1.append('text').attr('x', x(0.5) + 4).attr('y', 14)
      .attr('fill', ED.series3).attr('font-size', 10).text('σ = ½');

    // σ = 1 line
    g1.append('line')
      .attr('x1', x(1)).attr('x2', x(1)).attr('y1', 0).attr('y2', h1)
      .attr('stroke', ED.series2).attr('stroke-dasharray', '4,4').attr('opacity', 0.4);
    g1.append('text').attr('x', x(1) + 4).attr('y', 14)
      .attr('fill', ED.series2).attr('font-size', 10).text('σ = 1');

    // Fill area
    g1.append('path')
      .datum(scan.filter(d => d.zetaMag < y1Max))
      .attr('d', d3.area()
        .x(d => x(d.sigma))
        .y0(h1)
        .y1(d => y1(Math.min(d.zetaMag, y1Max)))
        .curve(d3.curveMonotoneX))
      .attr('fill', alpha(ED.series1, 0.15));

    g1.append('path')
      .datum(scan.filter(d => d.zetaMag < y1Max))
      .attr('d', d3.line().x(d => x(d.sigma)).y(d => y1(Math.min(d.zetaMag, y1Max))).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series1).attr('stroke-width', 2);

    g1.append('text').attr('x', 4).attr('y', -10)
      .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
      .text(`|ζ(σ + ${t.toFixed(1)}i)| via Hasse–Sondow (${maxTerms} Pascal rows)`);
    g1.append('text').attr('x', w / 2).attr('y', h1 + 34)
      .attr('text-anchor', 'middle').attr('fill', ED.inkFaint).attr('font-size', 11).text('σ');
    g1.append('text')
      .attr('transform', `translate(-44,${h1 / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkFaint).attr('font-size', 11)
      .text('|ζ(s)|');

    // ─ Bottom: Row-weighted Dirichlet polynomial ─
    const g2 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top + h1 + gap})`);
    const y2Max = d3.max(rowDirichlet.points, d => d.logMag) * 1.1;
    const y2Min = d3.min(rowDirichlet.points, d => d.logMag);
    const y2 = d3.scaleLinear().domain([y2Min, y2Max]).range([h2, 0]);

    g2.append('g').attr('transform', `translate(0,${h2})`)
      .call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g2.append('g').call(d3.axisLeft(y2).ticks(5).tickSize(-w).tickFormat(d3.format('.1f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);

    // σ = 0.5 line
    g2.append('line')
      .attr('x1', x(0.5)).attr('x2', x(0.5)).attr('y1', 0).attr('y2', h2)
      .attr('stroke', ED.series3).attr('stroke-dasharray', '4,4').attr('opacity', 0.6);

    g2.append('path')
      .datum(rowDirichlet.points)
      .attr('d', d3.area()
        .x(d => x(d.sigma))
        .y0(h2)
        .y1(d => y2(d.logMag))
        .curve(d3.curveMonotoneX))
      .attr('fill', alpha(ED.series5, 0.15));

    g2.append('path')
      .datum(rowDirichlet.points)
      .attr('d', d3.line().x(d => x(d.sigma)).y(d => y2(d.logMag)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', ED.series5).attr('stroke-width', 2);

    g2.append('text').attr('x', 4).attr('y', -10)
      .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
      .text(`Row ${selectedRow} Dirichlet polynomial: log₁₀|Z_N(σ + ${t.toFixed(1)}i)|`);
    g2.append('text').attr('x', w / 2).attr('y', h2 + 34)
      .attr('text-anchor', 'middle').attr('fill', ED.inkFaint).attr('font-size', 11).text('σ');
    g2.append('text')
      .attr('transform', `translate(-44,${h2 / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkFaint).attr('font-size', 11)
      .text('log₁₀|Z_N(s)|');

  }, [scan, rowDirichlet, t, selectedRow, maxTerms]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        The "decorated" zeta scans <InlineMath tex={"|\\zeta(\\sigma + it)|"} /> across <InlineMath tex={"\\sigma"} /> using the
        full Hasse–Sondow series (top), while the bottom shows a single Pascal row's Dirichlet
        polynomial <InlineMath tex={"Z_N(s) = \\sum_{k=0}^N (-1)^k\\binom{N}{k}(k+1)^{-s}"} />.
        <strong> Look for:</strong> the dip near <InlineMath tex={"\\sigma = 0.5"} /> when <InlineMath tex="t" /> is
        close to a zeta zero, and higher rows growing exponentially for small <InlineMath tex={"\\sigma"} />.
      </div>
      <div className="controls">
        <div className="control-group">
          <label title="Imaginary part of s — snap to a zeta zero using the indicator"><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)}
            title="Imaginary part of s — snap to a zeta zero using the indicator" />
          <span className="control-value">{t.toFixed(1)}</span>
          <ZeroSnap tValue={t} setTValue={setT} />
        </div>
        <div className="control-group">
          <label title="Which row of Pascal's triangle to show as a Dirichlet polynomial in the lower chart">Pascal Row N</label>
          <input type="range" min="1" max="15" step="1" value={selectedRow}
            onChange={e => setSelectedRow(+e.target.value)}
            title="Row N of Pascal's triangle used for the Dirichlet polynomial Z_N(s)" />
          <span className="control-value">{selectedRow}</span>
        </div>
        <div className="control-group">
          <label title="Number of terms in the Hasse–Sondow series for the upper chart">Hasse Terms</label>
          <input type="range" min="5" max="50" step="1" value={maxTerms}
            onChange={e => setMaxTerms(+e.target.value)}
            title="More terms = more accurate ζ(s) approximation in the upper chart" />
          <span className="control-value">{maxTerms}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 460 }} />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13, color: 'var(--ink-soft)' }}>
        <p style={{ marginBottom: 8 }}>
          <strong style={{ color: 'var(--series-1)' }}>Top:</strong> The full "decorated" zeta —{' '}
          <InlineMath tex={"|\\zeta(\\sigma+it)|"} /> computed entirely from Pascal triangle rows via the Hasse–Sondow formula.
        </p>
        <p>
          <strong style={{ color: 'var(--series-5)' }}>Bottom:</strong> A single row's Dirichlet polynomial —
          the "shape" of row <InlineMath tex={"N"} />'s contribution:
        </p>
        <BlockMath tex={"Z_N(s) = \\sum_{k=0}^{N} (-1)^k\\binom{N}{k}(k+1)^{-s}"} />
        <p style={{ margin: 0 }}>
          Higher rows grow exponentially for small <InlineMath tex={"\\sigma"} />.
        </p>
      </div>
    </div>
  );
}

// ─── Tab 5: Pascal mod p Fractal ─────────────────────────────────────────────

const MOD_PRIMES = [2, 3, 5, 7, 11, 13];

function ModPTab() {
  const [numRows, setNumRows] = useState(32);
  const [modP, setModP] = useState(2);
  const canvasRef = useRef();

  // Palette: 0 = dark (silent), 1..p-1 use rainbow
  const palette = useMemo(() => (
    Array.from({ length: modP }, (_, i) =>
      i === 0 ? '#0f172a' : d3.interpolateRainbow(i / modP)
    )
  ), [modP]);

  // Pascal mod p via additive recurrence — no overflow
  const rows = useMemo(() => {
    const result = [[1 % modP]];
    for (let n = 1; n < numRows; n++) {
      const row = new Array(n + 1).fill(0);
      row[0] = 1 % modP;
      row[n] = 1 % modP;
      for (let k = 1; k < n; k++) {
        row[k] = (result[n - 1][k - 1] + result[n - 1][k]) % modP;
      }
      result.push(row);
    }
    return result;
  }, [numRows, modP]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const containerWidth = canvas.parentElement?.clientWidth || 700;
    const cellSize = Math.max(3, Math.floor((containerWidth - 20) / numRows));
    const cw = cellSize * numRows + 10;
    const ch = cellSize * numRows + 10;
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, cw, ch);

    rows.forEach((row, n) => {
      const y = n * cellSize + 5;
      const offset = ((numRows - 1 - n) / 2) * cellSize + 5;
      row.forEach((val, k) => {
        ctx.fillStyle = palette[val];
        ctx.fillRect(
          Math.round(offset + k * cellSize),
          Math.round(y),
          cellSize - 1,
          cellSize - 1
        );
      });
    });
  }, [rows, palette, numRows]);

  const fractalDim = (Math.log(modP * (modP + 1) / 2) / Math.log(modP)).toFixed(3);
  const nonzeroCount = Math.round(modP * (modP + 1) / 2);

  return (
    <div>
      <div className="tab-explainer accent-pink">
        Reducing Pascal's triangle modulo prime <InlineMath tex={"p"} /> reveals a{' '}
        <strong>generalized Sierpinski fractal</strong> with self-similarity ratio{' '}
        <InlineMath tex={"p"} />. Dark cells are positions where{' '}
        <InlineMath tex={"p \\mid \\binom{n}{k}"} /> — the prime oscillator is "silent" in
        the Hasse–Sondow formula at that entry.{' '}
        <strong>Try p = 2</strong> for the classic Sierpinski triangle; higher primes
        give richer multi-color patterns with more fractal sub-structure.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Modulus p</label>
          {MOD_PRIMES.map(p => (
            <button
              key={p}
              className={`filter-btn ${modP === p ? 'active' : ''}`}
              style={{ padding: '3px 10px', fontSize: 12, marginLeft: 4 }}
              onClick={() => setModP(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="control-group">
          <label>Rows</label>
          <input type="range" min="8" max="128" step="1" value={numRows}
            onChange={e => setNumRows(+e.target.value)} />
          <span className="control-value">{numRows}</span>
        </div>
      </div>
      <div className="viz-container" style={{ textAlign: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{ imageRendering: 'pixelated', maxWidth: '100%', display: 'block', margin: '0 auto' }}
        />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13 }}>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>
          <strong style={{ color: 'var(--series-7)' }}>Lucas' theorem:</strong>{' '}
          <InlineMath tex={"\\binom{n}{k} \\equiv \\prod_i \\binom{n_i}{k_i} \\pmod{p}"} />{' '}
          where <InlineMath tex={"n = \\sum n_i p^i"} /> is the base-<InlineMath tex={"p"} /> expansion.
          An entry is 0 (dark) iff some base-<InlineMath tex={"p"} /> digit of{' '}
          <InlineMath tex={"k"} /> exceeds the corresponding digit of <InlineMath tex={"n"} />.
          The nonzero entries in a <InlineMath tex={"p \\times p"} /> block number{' '}
          <InlineMath tex={`\\binom{${modP}+1}{2} = ${nonzeroCount}`} />, giving Hausdorff dimension:
        </p>
        <BlockMath tex={`d_H(${modP}) = \\frac{\\log ${nonzeroCount}}{\\log ${modP}} \\approx ${fractalDim}`} />
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
          For p = 2 this is <InlineMath tex={"\\log 3 / \\log 2 \\approx 1.585"} />, the classical
          Sierpinski dimension. In the Twin-Ladder Bridge model, <InlineMath tex={"d_H(p)"} /> encodes the
          "harmonic complexity" of the p-oscillator's contribution to the Hasse–Sondow representation.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PascalZetaViz() {
  const [activeTab, setActiveTab] = useState('triangle');

  return (
    <div>
      <div className="filter-bar">
        {TABS.map(tab => (
          <button key={tab.id}
            className={`filter-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {activeTab === 'triangle' && <TriangleTab />}
        {activeTab === 'constants' && <ConstantsTab />}
        {activeTab === 'hasse' && <HasseTab />}
        {activeTab === 'decorated' && <DecoratedTab />}
        {activeTab === 'modp' && <ModPTab />}
      </div>
    </div>
  );
}
