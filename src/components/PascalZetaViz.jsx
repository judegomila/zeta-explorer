import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  binomial, pascalRow, pascalTriangle,
  brothersEConvergence, piFromPascal, piArcsinSeries,
  hasseZeta, pascalZetaScan, pascalRowConvergence, rowWeightedDirichlet,
} from '../math/pascal.js';

const TABS = [
  { id: 'triangle', label: "Pascal's Triangle" },
  { id: 'constants', label: 'e, π, i from Pascal' },
  { id: 'hasse', label: 'Hasse–Sondow ζ(s)' },
  { id: 'decorated', label: 'Decorated Zeta' },
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
          .attr('stroke', isCentral ? '#f59e0b' : 'none')
          .attr('stroke-width', isCentral ? 2 : 0)
          .attr('opacity', 0.85);

        if (cellSize > 20) {
          g.append('text')
            .attr('x', x)
            .attr('y', y + 1)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', val > maxVal * 0.3 ? '#0f172a' : '#e2e8f0')
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
      .attr('fill', '#94a3b8').attr('font-size', 11)
      .text(`${numRows} rows — central binomials highlighted in gold`);
  }, [rows, numRows]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
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
        <p style={{ color: '#94a3b8' }}>
          Each entry <InlineMath tex="C(n,k) = \\binom{n}{k}" /> is the binomial coefficient.
          Central binomials <InlineMath tex="C(2n,n)" /> (gold outlines) connect to <InlineMath tex="\\pi" /> via{' '}
          <InlineMath tex="\\pi = \\lim_{n\\to\\infty} \\frac{4^{2n}}{n\\,C(2n,n)^2}" />.
          Row products connect to <InlineMath tex="e" /> via Brothers' formula.
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
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g1.append('g').call(d3.axisLeft(y1).ticks(5).tickSize(-w).tickFormat(d3.format('.4f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);

    // e reference line
    g1.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', y1(Math.E)).attr('y2', y1(Math.E))
      .attr('stroke', '#10b981').attr('stroke-dasharray', '6,3').attr('opacity', 0.7);
    g1.append('text').attr('x', w - 4).attr('y', y1(Math.E) - 6)
      .attr('text-anchor', 'end').attr('fill', '#10b981').attr('font-size', 11)
      .text('e = 2.7183...');

    // Brothers' ratio
    g1.append('path')
      .datum(data.eData)
      .attr('d', d3.line().x(d => x1(d.n)).y(d => y1(d.ratio)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);
    data.eData.forEach(d => {
      g1.append('circle').attr('cx', x1(d.n)).attr('cy', y1(d.ratio))
        .attr('r', 2.5).attr('fill', '#3b82f6');
    });

    // Classic (1+1/n)^n
    g1.append('path')
      .datum(data.eData)
      .attr('d', d3.line().x(d => x1(d.n)).y(d => y1(d.classic)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3');

    g1.append('text').attr('x', 4).attr('y', -6)
      .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
      .text("Brothers' e from Pascal row products");

    // Legend
    const leg1 = g1.append('g').attr('transform', `translate(${w - 180}, 10)`);
    leg1.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 0).attr('y2', 0)
      .attr('stroke', '#3b82f6').attr('stroke-width', 2);
    leg1.append('text').attr('x', 20).attr('y', 4).attr('fill', '#94a3b8').attr('font-size', 10)
      .text('sₙ₋₁·sₙ₊₁/sₙ²');
    leg1.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 16).attr('y2', 16)
      .attr('stroke', '#8b5cf6').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
    leg1.append('text').attr('x', 20).attr('y', 20).attr('fill', '#94a3b8').attr('font-size', 10)
      .text('(1+1/n)ⁿ');

    // ─ Chart 2: Pi from central binomials ─
    const y2Off = margin.top + chartH + 56;
    const g2 = svg.append('g').attr('transform', `translate(${margin.left},${y2Off})`);
    const x2 = d3.scaleLinear().domain([1, data.piData.length]).range([0, w]);
    const piVals = data.piData.map(d => d.piApprox);
    const y2 = d3.scaleLinear()
      .domain([d3.min(piVals) * 0.99, d3.max(piVals) * 1.01])
      .range([chartH, 0]);

    g2.append('g').attr('transform', `translate(0,${chartH})`)
      .call(d3.axisBottom(x2).ticks(8).tickSize(0))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g2.append('g').call(d3.axisLeft(y2).ticks(5).tickSize(-w).tickFormat(d3.format('.5f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);

    // π reference
    g2.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', y2(Math.PI)).attr('y2', y2(Math.PI))
      .attr('stroke', '#f59e0b').attr('stroke-dasharray', '6,3').attr('opacity', 0.7);
    g2.append('text').attr('x', w - 4).attr('y', y2(Math.PI) - 6)
      .attr('text-anchor', 'end').attr('fill', '#f59e0b').attr('font-size', 11)
      .text('π = 3.14159...');

    g2.append('path')
      .datum(data.piData)
      .attr('d', d3.line().x(d => x2(d.n)).y(d => y2(d.piApprox)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2);
    data.piData.forEach(d => {
      g2.append('circle').attr('cx', x2(d.n)).attr('cy', y2(d.piApprox))
        .attr('r', 2.5).attr('fill', '#f59e0b');
    });

    // Arcsin series
    g2.append('path')
      .datum(data.piArcsin)
      .attr('d', d3.line().x(d => x2(d.n + 1)).y(d => y2(d.piApprox)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#ec4899').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');

    g2.append('text').attr('x', 4).attr('y', -6)
      .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
      .text('π from Central Binomial Coefficients');

    const leg2 = g2.append('g').attr('transform', `translate(${w - 200}, 10)`);
    leg2.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 0).attr('y2', 0)
      .attr('stroke', '#f59e0b').attr('stroke-width', 2);
    leg2.append('text').attr('x', 20).attr('y', 4).attr('fill', '#94a3b8').attr('font-size', 10)
      .text('4²ⁿ / (n·C(2n,n)²)');
    leg2.append('line').attr('x1', 0).attr('x2', 16).attr('y1', 16).attr('y2', 16)
      .attr('stroke', '#ec4899').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
    leg2.append('text').attr('x', 20).attr('y', 20).attr('fill', '#94a3b8').attr('font-size', 10)
      .text('arcsin series');

    // ─ Chart 3: Error convergence (log scale) ─
    const y3Off = y2Off + chartH + 56;
    const g3 = svg.append('g').attr('transform', `translate(${margin.left},${y3Off})`);
    const x3 = d3.scaleLinear().domain([2, maxN]).range([0, w]);
    const allErrors = [
      ...data.eData.map(d => d.error),
      ...data.piData.map(d => d.error),
    ].filter(e => e > 0);
    const y3 = d3.scaleLog()
      .domain([d3.min(allErrors) * 0.1, d3.max(allErrors) * 2])
      .range([chartH, 0]);

    g3.append('g').attr('transform', `translate(0,${chartH})`)
      .call(d3.axisBottom(x3).ticks(8).tickSize(0))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g3.append('g').call(d3.axisLeft(y3).ticks(5, '.0e').tickSize(-w))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);

    // e errors
    const eErrors = data.eData.filter(d => d.error > 0);
    g3.append('path')
      .datum(eErrors)
      .attr('d', d3.line().x(d => x3(d.n)).y(d => y3(d.error)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);

    // pi errors
    const piErrors = data.piData.filter(d => d.error > 0);
    g3.append('path')
      .datum(piErrors)
      .attr('d', d3.line().x(d => x3(d.n)).y(d => y3(d.error)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2);

    g3.append('text').attr('x', 4).attr('y', -6)
      .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
      .text('Convergence Error (log scale)');

    const leg3 = g3.append('g').attr('transform', `translate(${w - 120}, 10)`);
    leg3.append('circle').attr('cx', 6).attr('cy', 0).attr('r', 4).attr('fill', '#3b82f6');
    leg3.append('text').attr('x', 14).attr('y', 4).attr('fill', '#94a3b8').attr('font-size', 10).text('|e − approx|');
    leg3.append('circle').attr('cx', 6).attr('cy', 16).attr('r', 4).attr('fill', '#f59e0b');
    leg3.append('text').attr('x', 14).attr('y', 20).attr('fill', '#94a3b8').attr('font-size', 10).text('|π − approx|');

  }, [data, maxN]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
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
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <strong style={{ color: '#3b82f6' }}>Euler's number</strong> from Brothers' result:{' '}
          <InlineMath tex="e = \\lim_{n\\to\\infty} \\frac{s_{n-1}\\cdot s_{n+1}}{s_n^2}" /> where{' '}
          <InlineMath tex="s_n = \\prod_{k=0}^{n} \\binom{n}{k}" />.
        </p>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <strong style={{ color: '#f59e0b' }}>Pi</strong> from central binomials:{' '}
          <InlineMath tex="\\pi = \\lim_{n\\to\\infty} \\frac{4^{2n}}{n\\,\\binom{2n}{n}^2}" />.
        </p>
        <p style={{ color: '#94a3b8' }}>
          <strong style={{ color: '#ec4899' }}>Euler's identity</strong>{' '}
          <InlineMath tex="e^{i\\pi} + 1 = 0" /> unites all three: having extracted{' '}
          <InlineMath tex="e" /> and <InlineMath tex="\\pi" /> from Pascal's triangle, we obtain{' '}
          <InlineMath tex="i = \\frac{\\log(-1)}{\\pi}" /> — the imaginary unit lives implicitly
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
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(d3.format('.3f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);

    // Contribution bars
    const barW = Math.max(2, w / maxRows * 0.6);
    convergence.forEach(d => {
      const barH = Math.min(h, Math.max(1, (d.contributionMag / yMax) * h * 5));
      g.append('rect')
        .attr('x', x(d.row) - barW / 2)
        .attr('y', h - barH)
        .attr('width', barW)
        .attr('height', barH)
        .attr('fill', '#8b5cf6')
        .attr('opacity', 0.3);
    });

    // ζ magnitude line
    g.append('path')
      .datum(convergence)
      .attr('d', d3.line().x(d => x(d.row)).y(d => y(d.zetaMag)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2.5);

    convergence.forEach(d => {
      g.append('circle').attr('cx', x(d.row)).attr('cy', y(d.zetaMag))
        .attr('r', 2).attr('fill', '#3b82f6');
    });

    // Final value annotation
    const final = convergence[convergence.length - 1];
    g.append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', y(final.zetaMag)).attr('y2', y(final.zetaMag))
      .attr('stroke', '#10b981').attr('stroke-dasharray', '6,3').attr('opacity', 0.6);
    g.append('text')
      .attr('x', w - 4).attr('y', y(final.zetaMag) - 8)
      .attr('text-anchor', 'end').attr('fill', '#10b981').attr('font-size', 11)
      .text(`|ζ| ≈ ${final.zetaMag.toFixed(4)}`);

    // Labels
    g.append('text').attr('x', w / 2).attr('y', h + 38)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11)
      .text('Pascal row n');
    g.append('text')
      .attr('transform', `translate(-44,${h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11)
      .text('|ζ(s)|');

    g.append('text').attr('x', 4).attr('y', -10)
      .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
      .text(`Hasse–Sondow convergence at s = ${sigma.toFixed(2)} + ${t.toFixed(2)}i`);

  }, [convergence, maxRows, sigma, t]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const sigmaColor = Math.abs(sigma - 0.5) < 0.02 ? '#10b981'
    : Math.abs(sigma - 0.5) < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="\\sigma" /></label>
          <input type="range" min="0.1" max="2" step="0.05" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t" /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Rows</label>
          <input type="range" min="5" max="50" step="1" value={maxRows}
            onChange={e => setMaxRows(+e.target.value)} />
          <span className="control-value">{maxRows}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13, color: '#94a3b8' }}>
        <p>
          Each bar shows the magnitude of row <InlineMath tex="n" />'s contribution. The blue curve is the running
          approximation <InlineMath tex="|\\zeta(s)|" /> as more Pascal triangle rows are included.
          Purple bars = <InlineMath tex="\\frac{1}{2^{n+1}} \\sum_{k=0}^{n}(-1)^k\\binom{n}{k}(k+1)^{-s}" />.
        </p>
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

  const data = useMemo(() => {
    const scan = pascalZetaScan(t, [0.05, 2.5], 80, maxTerms);
    const rowDirichlet = rowWeightedDirichlet(selectedRow, [0.05, 2.5], t, 80);
    return { scan, rowDirichlet };
  }, [t, selectedRow, maxTerms]);

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
    const y1Max = d3.max(data.scan, d => d.zetaMag) * 1.1;
    const y1 = d3.scaleLinear().domain([0, Math.min(y1Max, 10)]).range([h1, 0]);

    g1.append('g').attr('transform', `translate(0,${h1})`)
      .call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g1.append('g').call(d3.axisLeft(y1).ticks(5).tickSize(-w).tickFormat(d3.format('.2f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);

    // σ = 0.5 line
    g1.append('line')
      .attr('x1', x(0.5)).attr('x2', x(0.5)).attr('y1', 0).attr('y2', h1)
      .attr('stroke', '#10b981').attr('stroke-dasharray', '4,4').attr('opacity', 0.6);
    g1.append('text').attr('x', x(0.5) + 4).attr('y', 14)
      .attr('fill', '#10b981').attr('font-size', 10).text('σ = ½');

    // σ = 1 line
    g1.append('line')
      .attr('x1', x(1)).attr('x2', x(1)).attr('y1', 0).attr('y2', h1)
      .attr('stroke', '#ef4444').attr('stroke-dasharray', '4,4').attr('opacity', 0.4);
    g1.append('text').attr('x', x(1) + 4).attr('y', 14)
      .attr('fill', '#ef4444').attr('font-size', 10).text('σ = 1');

    // Fill area
    g1.append('path')
      .datum(data.scan.filter(d => d.zetaMag < y1Max))
      .attr('d', d3.area()
        .x(d => x(d.sigma))
        .y0(h1)
        .y1(d => y1(Math.min(d.zetaMag, y1Max)))
        .curve(d3.curveMonotoneX))
      .attr('fill', 'rgba(59,130,246,0.15)');

    g1.append('path')
      .datum(data.scan.filter(d => d.zetaMag < y1Max))
      .attr('d', d3.line().x(d => x(d.sigma)).y(d => y1(Math.min(d.zetaMag, y1Max))).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);

    g1.append('text').attr('x', 4).attr('y', -10)
      .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
      .text(`|ζ(σ + ${t.toFixed(1)}i)| via Hasse–Sondow (${maxTerms} Pascal rows)`);
    g1.append('text').attr('x', w / 2).attr('y', h1 + 34)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11).text('σ');
    g1.append('text')
      .attr('transform', `translate(-44,${h1 / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11)
      .text('|ζ(s)|');

    // ─ Bottom: Row-weighted Dirichlet polynomial ─
    const g2 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top + h1 + gap})`);
    const y2Max = d3.max(data.rowDirichlet.points, d => d.logMag) * 1.1;
    const y2Min = d3.min(data.rowDirichlet.points, d => d.logMag);
    const y2 = d3.scaleLinear().domain([y2Min, y2Max]).range([h2, 0]);

    g2.append('g').attr('transform', `translate(0,${h2})`)
      .call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g2.append('g').call(d3.axisLeft(y2).ticks(5).tickSize(-w).tickFormat(d3.format('.1f')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);

    // σ = 0.5 line
    g2.append('line')
      .attr('x1', x(0.5)).attr('x2', x(0.5)).attr('y1', 0).attr('y2', h2)
      .attr('stroke', '#10b981').attr('stroke-dasharray', '4,4').attr('opacity', 0.6);

    g2.append('path')
      .datum(data.rowDirichlet.points)
      .attr('d', d3.area()
        .x(d => x(d.sigma))
        .y0(h2)
        .y1(d => y2(d.logMag))
        .curve(d3.curveMonotoneX))
      .attr('fill', 'rgba(139,92,246,0.15)');

    g2.append('path')
      .datum(data.rowDirichlet.points)
      .attr('d', d3.line().x(d => x(d.sigma)).y(d => y2(d.logMag)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 2);

    g2.append('text').attr('x', 4).attr('y', -10)
      .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
      .text(`Row ${selectedRow} Dirichlet polynomial: log₁₀|Z_N(σ + ${t.toFixed(1)}i)|`);
    g2.append('text').attr('x', w / 2).attr('y', h2 + 34)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11).text('σ');
    g2.append('text')
      .attr('transform', `translate(-44,${h2 / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', 11)
      .text('log₁₀|Z_N(s)|');

  }, [data, t, selectedRow, maxTerms]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="t" /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Pascal Row N</label>
          <input type="range" min="1" max="15" step="1" value={selectedRow}
            onChange={e => setSelectedRow(+e.target.value)} />
          <span className="control-value">{selectedRow}</span>
        </div>
        <div className="control-group">
          <label>Hasse Terms</label>
          <input type="range" min="5" max="50" step="1" value={maxTerms}
            onChange={e => setMaxTerms(+e.target.value)} />
          <span className="control-value">{maxTerms}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 460 }} />
      </div>
      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13, color: '#94a3b8' }}>
        <p style={{ marginBottom: 8 }}>
          <strong style={{ color: '#3b82f6' }}>Top:</strong> The full "decorated" zeta —{' '}
          <InlineMath tex="|\\zeta(\\sigma+it)|" /> computed entirely from Pascal triangle rows via the Hasse–Sondow formula.
        </p>
        <p>
          <strong style={{ color: '#8b5cf6' }}>Bottom:</strong> A single row's Dirichlet polynomial{' '}
          <InlineMath tex="Z_N(s) = \\sum_{k=0}^{N} \\binom{N}{k}(k+1)^{-s}" /> — the "shape" of row{' '}
          <InlineMath tex="N" />'s contribution. Higher rows grow exponentially for small <InlineMath tex="\\sigma" />.
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
      </div>
    </div>
  );
}
