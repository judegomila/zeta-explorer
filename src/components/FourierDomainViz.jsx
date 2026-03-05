import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import {
  ladderFrequencyResponse,
  spectralEnergyDensity,
  primeHarmonicDecomposition,
  vonMangoldtSpectrum,
} from '../math/supercritical.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import { InlineMath } from './KaTeXMath.jsx';

const TABS = [
  { id: 'spectrum', label: 'Von Mangoldt Spectrum' },
  { id: 'frequency', label: 'Frequency Response' },
  { id: 'energy', label: 'Spectral Energy' },
  { id: 'harmonics', label: 'Prime Harmonics' },
];

export default function FourierDomainViz() {
  const [activeTab, setActiveTab] = useState('spectrum');

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
        {activeTab === 'spectrum' && <VonMangoldtSpectrumTab />}
        {activeTab === 'frequency' && <FrequencyResponseTab />}
        {activeTab === 'energy' && <SpectralEnergyTab />}
        {activeTab === 'harmonics' && <PrimeHarmonicsTab />}
      </div>
    </div>
  );
}

// ─── Tab 1: Von Mangoldt Spectrum ──────────────────────────────────────────────

function VonMangoldtSpectrumTab() {
  const svgRef = useRef();
  const [maxN, setMaxN] = useState(300);

  // Memoize spectrum data so window resize only re-renders D3 without recomputing
  // 300 frequency points × ~80 non-zero Λ(n) entries = ~24,000 trig calls
  const spectrum = useMemo(() => vonMangoldtSpectrum(maxN, 300, [0, 50]), [maxN]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 400;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 65 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, 50]).range([0, w]);
    const yMax = d3.max(spectrum, d => d.magnitude) * 1.1;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(0)))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Horizontal gridlines
    const gridG = g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(''));
    gridG.select('.domain').remove();
    gridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

    // Fill under curve
    g.append('path').datum(spectrum)
      .attr('d', d3.area().x(d => x(d.frequency)).y0(h).y1(d => y(d.magnitude)).curve(d3.curveBasis))
      .attr('fill', 'rgba(59, 130, 246, 0.15)');

    // Spectrum line
    g.append('path').datum(spectrum)
      .attr('d', d3.line().x(d => x(d.frequency)).y(d => y(d.magnitude)).curve(d3.curveBasis))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);

    // Mark known zeta zeros
    const zeros = ZETA_ZEROS.filter(z => z <= 50);
    zeros.forEach((gamma, i) => {
      g.append('line')
        .attr('x1', x(gamma)).attr('y1', 0).attr('x2', x(gamma)).attr('y2', h)
        .attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('opacity', 0.5);
      if (i < 12) {
        g.append('text').attr('x', x(gamma)).attr('y', -4)
          .attr('text-anchor', 'middle').attr('fill', '#ef4444').attr('font-size', 8)
          .text(`γ${i + 1}`);
      }
    });

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w - 140}, 4)`);
    // Spectrum entry: filled rect + line
    legend.append('rect').attr('x', 0).attr('y', -5).attr('width', 16).attr('height', 10)
      .attr('fill', 'rgba(59, 130, 246, 0.15)').attr('stroke', '#3b82f6').attr('stroke-width', 1.5);
    legend.append('text').attr('x', 22).attr('y', 4)
      .attr('fill', '#3b82f6').attr('font-size', 10).text('|Λ̂(ω)| spectrum');
    // Zeta zeros entry: dashed line
    legend.append('line').attr('x1', 0).attr('y1', 18).attr('x2', 16).attr('y2', 18)
      .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3').attr('opacity', 0.7);
    legend.append('text').attr('x', 22).attr('y', 22)
      .attr('fill', '#ef4444').attr('font-size', 10).text('Zeta zeros γₙ');

    // Labels
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Frequency ω');
    svg.append('text').attr('transform', `translate(16, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('|F(ω)|');

  }, [spectrum]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer">
        The von Mangoldt function <InlineMath tex="\\Lambda(n) = \\log p" /> when{' '}
        <InlineMath tex="n = p^k" />, and zero otherwise, encodes prime locations as a "signal." Its discrete Fourier
        transform <InlineMath tex="\\hat{\\Lambda}(\\omega) = \\sum_n \\Lambda(n)\\,e^{-i\\omega\\log n}" /> has peaks at
        each zeta zero imaginary part <InlineMath tex="\\gamma_n" />. This is the explicit formula in action:
        primes live in "position space," zeta zeros in "frequency space." More terms sharpen the spectral peaks.
        <strong> Look for:</strong> vertical red dashed lines (known zeros) aligning with the spectral peaks of the blue DFT curve.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Max N</label>
          <input type="range" min="100" max="800" step="50" value={maxN}
            onChange={e => setMaxN(+e.target.value)} />
          <span className="control-value">{maxN} <span style={{ color: '#64748b', fontSize: 11 }}>({getPrimes(200).filter(p => p <= maxN).length} primes ≤ N)</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 400 }} />
      </div>
    </div>
  );
}

// ─── Tab 2: Frequency Response ─────────────────────────────────────────────────

function FrequencyResponseTab() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [numPrimes, setNumPrimes] = useState(12);

  // Memoize frequency response data to avoid recomputing 201×numPrimes Euler factor evaluations on resize
  const response = useMemo(() => ladderFrequencyResponse(sigma, [0.5, 60], 200, numPrimes), [sigma, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 500;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 25, right: 30, bottom: 35, left: 65 };
    const w = width - margin.left - margin.right;
    const chartH = 190;
    const gap = 30;

    // ── Top: Magnitude (dB) ──
    {
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const x = d3.scaleLinear().domain([0.5, 60]).range([0, w]);
      const yExtent = d3.extent(response, d => d.magnitudeDb);
      const y = d3.scaleLinear().domain([Math.min(yExtent[0], -10), Math.max(yExtent[1], 30)]).range([chartH, 0]);

      g.append('g').attr('transform', `translate(0,${chartH})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => `${d.toFixed(0)} dB`))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const magGrid = g.append('g')
        .call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(''));
      magGrid.select('.domain').remove();
      magGrid.selectAll('.tick line')
        .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

      // 0 dB reference (stronger than gridlines)
      g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
        .attr('stroke', '#64748b').attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

      // Magnitude curve
      g.append('path').datum(response)
        .attr('d', d3.line().x(d => x(d.omega)).y(d => y(d.magnitudeDb)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#10b981').attr('stroke-width', 2);

      // Mark zero locations
      ZETA_ZEROS.filter(z => z <= 60).forEach(gamma => {
        g.append('line').attr('x1', x(gamma)).attr('y1', 0).attr('x2', x(gamma)).attr('y2', chartH)
          .attr('stroke', '#ef4444').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,2').attr('opacity', 0.4);
      });

      // Legend for magnitude panel
      const magLegend = g.append('g').attr('transform', `translate(${w - 180}, 6)`);
      magLegend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 16).attr('y2', 0)
        .attr('stroke', '#10b981').attr('stroke-width', 2);
      magLegend.append('text').attr('x', 22).attr('y', 4)
        .attr('fill', '#10b981').attr('font-size', 10).text('|H(σ+iω)| (dB)');
      magLegend.append('line').attr('x1', 0).attr('y1', 16).attr('x2', 16).attr('y2', 16)
        .attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '2,2').attr('opacity', 0.7);
      magLegend.append('text').attr('x', 22).attr('y', 20)
        .attr('fill', '#ef4444').attr('font-size', 10).text('Zeta zeros γₙ');

      svg.append('text').attr('x', margin.left).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
        .text('Magnitude Response |H(σ+iω)| (dB)');
    }

    // ── Bottom: Phase ──
    {
      const yOff = chartH + margin.top + margin.bottom + gap;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff})`);
      const x = d3.scaleLinear().domain([0.5, 60]).range([0, w]);
      const y = d3.scaleLinear().domain([-Math.PI, Math.PI]).range([chartH, 0]);

      g.append('g').attr('transform', `translate(0,${chartH})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d / Math.PI).toFixed(1)}\u03C0`))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const phaseGrid = g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''));
      phaseGrid.select('.domain').remove();
      phaseGrid.selectAll('.tick line')
        .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

      // Phase curve — use curveLinear to avoid curveBasis smoothing across
      // ±π atan2 wrap discontinuities, which would draw fake arcs through 0
      g.append('path').datum(response)
        .attr('d', d3.line().x(d => x(d.omega)).y(d => y(d.phase)).curve(d3.curveLinear))
        .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 2);

      // Legend for phase panel
      const phaseLegend = g.append('g').attr('transform', `translate(${w - 160}, 6)`);
      phaseLegend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 16).attr('y2', 0)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 2);
      phaseLegend.append('text').attr('x', 22).attr('y', 4)
        .attr('fill', '#8b5cf6').attr('font-size', 10).text('∠H(σ+iω)');

      svg.append('text').attr('x', margin.left).attr('y', yOff - 8)
        .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
        .text('Phase Response \u2220H(σ+iω)');
    }

    svg.append('text').attr('x', width / 2).attr('y', height - 4)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 11).text('ω (frequency)');

  }, [response]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="tab-explainer accent-green">
        The Euler product{' '}
        <InlineMath tex="H(\\sigma+i\\omega) = \\prod_p (1-p^{-\\sigma-i\\omega})^{-1}" /> is the transfer function of the
        prime oscillator ladder network, plotted as a standard Bode diagram. The magnitude (top, in dB) shows the gain
        at each frequency; the phase (bottom) shows the accumulated delay. Near zeta zero frequencies, the partial product
        shows resonance peaks from constructive phase alignment, even though the Euler product only converges for{' '}
        <InlineMath tex="\\sigma > 1" />. Since <InlineMath tex="Q = 1/(2\\sigma)" />, lower <InlineMath tex="\\sigma" /> gives
        sharper resonances (<InlineMath tex="Q \\to \\infty" /> as <InlineMath tex="\\sigma \\to 0" />), while higher{' '}
        <InlineMath tex="\\sigma" /> damps them. At <InlineMath tex="\\sigma = 0.5" />,{' '}
        <InlineMath tex="Q = 1" /> for all primes &mdash; the critical line is where direct and dual ladders balance,
        not where resonance is sharpest.
        <strong> Look for:</strong> resonance spikes at zeta zero frequencies; peaks sharpening as <InlineMath tex="\\sigma \\to 0" />.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="\\sigma" /></label>
          <input type="range" min="0.1" max="2" step="0.05" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="100" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 500 }} />
      </div>
    </div>
  );
}

// ─── Tab 3: Spectral Energy Density ────────────────────────────────────────────

function SpectralEnergyTab() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [numPrimes, setNumPrimes] = useState(10);

  const data = useMemo(() => spectralEnergyDensity(sigma, [0.5, 60], 120, numPrimes), [sigma, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 400;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 140, bottom: 50, left: 65 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0.5, 60]).range([0, w]);
    const yMax = d3.max(data, d => d.totalEnergy) * 1.1;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(1)))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Horizontal gridlines
    const gridG = g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(''));
    gridG.select('.domain').remove();
    gridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

    // Area fills
    g.append('path').datum(data)
      .attr('d', d3.area().x(d => x(d.omega)).y0(h).y1(d => y(d.directEnergy)).curve(d3.curveBasis))
      .attr('fill', 'rgba(59, 130, 246, 0.15)');
    g.append('path').datum(data)
      .attr('d', d3.area().x(d => x(d.omega)).y0(h).y1(d => y(d.dualEnergy)).curve(d3.curveBasis))
      .attr('fill', 'rgba(245, 158, 11, 0.1)');

    // Lines
    g.append('path').datum(data)
      .attr('d', d3.line().x(d => x(d.omega)).y(d => y(d.directEnergy)).curve(d3.curveBasis))
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 1.5);
    g.append('path').datum(data)
      .attr('d', d3.line().x(d => x(d.omega)).y(d => y(d.dualEnergy)).curve(d3.curveBasis))
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5);
    g.append('path').datum(data)
      .attr('d', d3.line().x(d => x(d.omega)).y(d => y(d.totalEnergy)).curve(d3.curveBasis))
      .attr('fill', 'none').attr('stroke', '#10b981').attr('stroke-width', 2.5);

    // Mismatch on secondary axis
    const y2Max = d3.max(data, d => d.mismatch) * 1.2 || 1;
    const y2 = d3.scaleLinear().domain([0, y2Max]).range([h, 0]);
    g.append('path').datum(data)
      .attr('d', d3.line().x(d => x(d.omega)).y(d => y2(d.mismatch)).curve(d3.curveBasis))
      .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');

    // Right-side axis for mismatch scale
    const rightAxis = g.append('g').attr('transform', `translate(${w},0)`)
      .call(d3.axisRight(y2).ticks(5).tickFormat(d => d.toFixed(1)));
    rightAxis.selectAll('text').attr('fill', '#ef4444').attr('font-size', 10);
    rightAxis.selectAll('.domain, .tick line').attr('stroke', '#ef4444').attr('opacity', 0.4);
    svg.append('text').attr('transform', `translate(${width - 12}, ${height / 2}) rotate(90)`)
      .attr('text-anchor', 'middle').attr('fill', '#ef4444').attr('font-size', 11).text('Mismatch |Z_dir \u2212 Z_dual|');

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 130}, ${margin.top + 10})`);
    [
      { label: 'Total', color: '#10b981' },
      { label: 'Direct', color: '#3b82f6' },
      { label: 'Dual', color: '#f59e0b' },
      { label: 'Mismatch', color: '#ef4444', dash: true },
    ].forEach(({ label, color, dash }, i) => {
      const l = legend.append('line').attr('x1', 0).attr('y1', i * 18).attr('x2', 16).attr('y2', i * 18)
        .attr('stroke', color).attr('stroke-width', 2);
      if (dash) l.attr('stroke-dasharray', '4,3');
      legend.append('text').attr('x', 22).attr('y', i * 18 + 4)
        .attr('fill', color).attr('font-size', 10).text(label);
    });

    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12).text('ω');
    svg.append('text').attr('transform', `translate(16, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12).text('Energy');

  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="tab-explainer accent-purple">
        The spectral energy density <InlineMath tex="\\mathcal{E}(\\omega)" /> measures how
        oscillator energy is distributed across frequencies. The direct ladder gives{' '}
        <InlineMath tex="\\mathcal{E}_{\\text{dir}}(\\omega) = \\sum_p \\tfrac{1}{2}\\log p\\,|H_p(\\sigma{+}i\\omega)|^2" /> and the dual ladder{' '}
        <InlineMath tex="\\mathcal{E}_{\\text{dual}}(\\omega) = \\sum_p \\tfrac{1}{2}\\log p\\,|H_p(1{-}\\sigma{+}i\\omega)|^2" />, where each prime's
        contribution is weighted by its characteristic impedance <InlineMath tex="\\log p" />. At{' '}
        <InlineMath tex="\\sigma = \\tfrac{1}{2}" />, conjugate symmetry of the Euler factors gives equal magnitudes &mdash;
        the spectral energy is perfectly balanced between direct and dual. The red mismatch curve shows the impedance
        difference <InlineMath tex="|Z_{\\text{dir}} - Z_{\\text{dual}}|" />, which measures the imaginary-part asymmetry
        (at <InlineMath tex="\\sigma = \\tfrac{1}{2}" />, the impedances are conjugate-matched, so the mismatch equals{' '}
        <InlineMath tex="2|\\text{Im}\\,Z|" />, not zero).
        <strong> Look for:</strong> blue and orange energy curves overlapping exactly at <InlineMath tex="\\sigma = 0.5" />; mismatch (red) minimized but not zero.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="\\sigma" /></label>
          <input type="range" min="0.1" max="1.5" step="0.05" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 400 }} />
      </div>
    </div>
  );
}

// ─── Tab 4: Prime Harmonics ────────────────────────────────────────────────────

function PrimeHarmonicsTab() {
  const svgRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [numPrimes, setNumPrimes] = useState(10);

  const harmonics = useMemo(() => primeHarmonicDecomposition(sigma, numPrimes), [sigma, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 420;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 65 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Collect all harmonic points
    const allPoints = [];
    harmonics.forEach((p, pi) => {
      p.harmonics.forEach(harm => {
        allPoints.push({ ...harm, primeIdx: pi, prime: p.prime, fundamentalFreq: p.fundamentalFreq });
      });
    });

    const x = d3.scaleLinear().domain([0, d3.max(allPoints, d => d.frequency) * 1.05]).range([0, w]);
    const yMax = d3.max(allPoints, d => d.magnitude) * 1.1;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(1)))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Horizontal gridlines (matching other tabs in this component)
    const gridG = g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(''));
    gridG.select('.domain').remove();
    gridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

    const primeColors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
    ];

    // Draw harmonic bars for each prime
    harmonics.forEach((p, pi) => {
      const color = primeColors[pi % primeColors.length];
      const barWidth = Math.max(2, w / (allPoints.length * 1.5));

      p.harmonics.forEach(harm => {
        // Fundamental bars are taller/wider
        const isFundamental = harm.k === 1;
        g.append('rect')
          .attr('x', x(harm.frequency) - barWidth / 2)
          .attr('y', y(harm.magnitude))
          .attr('width', barWidth)
          .attr('height', h - y(harm.magnitude))
          .attr('fill', color)
          .attr('opacity', isFundamental ? 0.8 : 0.4);

        // Label fundamental frequencies
        if (isFundamental) {
          g.append('text')
            .attr('x', x(harm.frequency)).attr('y', y(harm.magnitude) - 6)
            .attr('text-anchor', 'middle').attr('fill', color).attr('font-size', 9).attr('font-weight', 600)
            .text(`p=${p.prime}`);
        }
      });
    });

    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12).text('Frequency ω = k\u00B7log(p)');
    svg.append('text').attr('transform', `translate(16, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12).text('|H_p(σ+iω)|');

  }, [harmonics]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        Each prime <InlineMath tex="p" /> contributes a fundamental oscillation at frequency{' '}
        <InlineMath tex="\\omega_p = \\log p" /> plus overtones at <InlineMath tex="k\\log p" /> (from the geometric series{' '}
        <InlineMath tex="(1-p^{-s})^{-1} = \\sum_k p^{-ks}" />). The quality factor{' '}
        <InlineMath tex="Q_p = 1/(2\\sigma)" /> controls resonance sharpness: at <InlineMath tex="\\sigma = 0.5" />,{' '}
        <InlineMath tex="Q = 1" /> for all primes (critical coupling). Higher <InlineMath tex="Q" /> means sharper, more selective
        resonances; lower <InlineMath tex="Q" /> means broader, more damped responses. This is why <InlineMath tex="\\sigma = 0.5" /> is
        the balance point &mdash; every oscillator is critically coupled simultaneously.
        <strong> Look for:</strong> <InlineMath tex="Q = 1.00" /> for all primes at <InlineMath tex="\\sigma = 0.5" />; harmonics weakening at higher overtones.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="\\sigma" /></label>
          <input type="range" min="0.1" max="2" step="0.05" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="3" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginTop: 16 }}>
        {harmonics.slice(0, 8).map((p, i) => {
          const color = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#84cc16'][i];
          return (
            <div key={p.prime} className="stat-box" style={{ borderColor: color }}>
              <div style={{ color, fontWeight: 700, fontSize: 13 }}>p = {p.prime}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 4 }}>
                <InlineMath tex={"\\omega_0 = " + p.fundamentalFreq.toFixed(3)} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#64748b' }}>
                <InlineMath tex={"Q = " + p.Q.toFixed(2)} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#64748b' }}>
                <InlineMath tex={"\\text{BW} = " + p.bandwidth.toFixed(3)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
