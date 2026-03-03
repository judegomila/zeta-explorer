import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { InlineMath } from './KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';

// Precompute reference curves at module level — these are mathematical constants
// that never change, avoiding ~750 trig/exp evaluations per draw call.
const REF_MAX_S = 6; // generous upper bound for spacing curves
const REF_GUE_CURVE = [];
const REF_POISSON_CURVE = [];
const REF_GOE_CURVE = [];
for (let s = 0; s <= REF_MAX_S; s += 0.02) {
  REF_GUE_CURVE.push({ s, p: (32 / (Math.PI * Math.PI)) * s * s * Math.exp(-4 * s * s / Math.PI) });
  REF_POISSON_CURVE.push({ s, p: Math.exp(-s) });
  REF_GOE_CURVE.push({ s, p: (Math.PI / 2) * s * Math.exp(-Math.PI * s * s / 4) });
}
const REF_R2_CURVE = [{ r: 0, p: 0 }];
for (let r = 0.02; r <= 4; r += 0.02) {
  const sinc = Math.sin(Math.PI * r) / (Math.PI * r);
  REF_R2_CURVE.push({ r, p: 1 - sinc * sinc });
}
const GAMMA_E = 0.5772;
const REF_NUMVAR_GUE = [];
for (let L = 0.3; L <= 6; L += 0.05) {
  const s2 = (2 / (Math.PI * Math.PI)) * (Math.log(2 * Math.PI * L) + 1 + GAMMA_E - Math.PI * Math.PI / 8);
  REF_NUMVAR_GUE.push({ L, s2: Math.max(0, s2) });
}

/**
 * Compare the spacing distribution of zeta zeros with GUE predictions.
 * Shows histogram of normalized spacings vs the GUE Wigner surmise.
 */
export default function GUEStatisticsViz() {
  const svgRef = useRef();
  const [numZeros, setNumZeros] = useState(50);
  const [mode, setMode] = useState('spacing');

  // Memoize all statistical data so resize events don't recompute O(n²) pair-correlation
  // and O(n² × 23) number-variance loops (~60,000 iterations at 50 zeros)
  const statsData = useMemo(() => {
    const zeros = ZETA_ZEROS.slice(0, numZeros);
    const TWO_PI = 2 * Math.PI;

    // Spacing histogram
    const spacings = [];
    for (let i = 0; i < zeros.length - 1; i++) {
      const gap = zeros[i + 1] - zeros[i];
      const dens = Math.log(zeros[i] / TWO_PI) / TWO_PI;
      spacings.push(gap * dens);
    }
    const sMaxS = Math.max(3, d3.max(spacings) * 1.1);
    const sBinW = sMaxS / 20;
    const sHist = new Array(20).fill(0);
    for (const s of spacings) {
      sHist[Math.min(19, Math.floor(s / sBinW))]++;
    }
    const sDensity = sHist.map(c => c / (spacings.length * sBinW));

    // Unfolded zeros (shared by pair-correlation and number-variance)
    const unfolded = zeros.map(g => (g / TWO_PI) * Math.log(g / TWO_PI) - g / TWO_PI + 7 / 8);

    // Pair correlation histogram
    const pairDists = [];
    for (let i = 0; i < zeros.length; i++) {
      for (let j = i + 1; j < zeros.length; j++) {
        pairDists.push(unfolded[j] - unfolded[i]);
      }
    }
    const pBinW = 4 / 30;
    const pHist = new Array(30).fill(0);
    for (const p of pairDists) {
      if (p < 4) pHist[Math.floor(p / pBinW)]++;
    }
    const pDensity = pHist.map(c => 2 * c / (zeros.length * pBinW));

    // Number variance
    const nvLs = [];
    const nvVars = [];
    for (let L = 0.5; L <= 6; L += 0.25) {
      let sumSq = 0, count = 0;
      for (let start = 0; start < unfolded.length; start++) {
        let n = 0;
        for (let j = start; j < unfolded.length; j++) {
          if (unfolded[j] - unfolded[start] <= L) n++;
          else break;
        }
        sumSq += (n - L) * (n - L);
        count++;
      }
      nvLs.push(L);
      nvVars.push(sumSq / count);
    }

    return {
      spacing: { density: sDensity, maxS: sMaxS, binWidth: sBinW },
      pair: { density: pDensity, binW: pBinW },
      numVar: { Ls: nvLs, vars: nvVars },
    };
  }, [numZeros]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 420;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (mode === 'spacing') {
      const { density, maxS, binWidth } = statsData.spacing;
      const bins = 20;

      const x = d3.scaleLinear().domain([0, maxS]).range([0, w]);
      const yMax = Math.max(d3.max(density) * 1.2, 1.2);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(6))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Histogram bars
      for (let i = 0; i < bins; i++) {
        g.append('rect')
          .attr('x', x(i * binWidth)).attr('y', y(density[i]))
          .attr('width', x(binWidth) - x(0) - 1).attr('height', h - y(density[i]))
          .attr('fill', 'rgba(59,130,246,0.4)').attr('stroke', '#3b82f6').attr('stroke-width', 0.5);
      }

      // GUE Wigner surmise: P(s) = (32/pi^2) * s^2 * exp(-4s^2/pi)
      g.append('path')
        .datum(REF_GUE_CURVE)
        .attr('d', d3.line().x(d => x(d.s)).y(d => y(d.p)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2.5);

      // Poisson (uncorrelated) for comparison: P(s) = exp(-s)
      g.append('path')
        .datum(REF_POISSON_CURVE)
        .attr('d', d3.line().x(d => x(d.s)).y(d => y(d.p)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6,4');

      // GOE: P(s) = (pi/2) * s * exp(-pi*s^2/4)
      g.append('path')
        .datum(REF_GOE_CURVE)
        .attr('d', d3.line().x(d => x(d.s)).y(d => y(d.p)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      // Legend
      const legend = g.append('g').attr('transform', `translate(${w - 200}, 10)`);
      // Zeta zeros: filled rect swatch matching histogram bars
      legend.append('rect').attr('x', 2).attr('y', -6).attr('width', 18).attr('height', 12)
        .attr('rx', 1).attr('fill', 'rgba(59,130,246,0.4)').attr('stroke', '#3b82f6').attr('stroke-width', 0.5);
      legend.append('text').attr('x', 28).attr('y', 4)
        .attr('fill', '#94a3b8').attr('font-size', 11).text(`Zeta zeros (n=${numZeros})`);
      // Curve entries: line swatches
      [
        { label: 'GUE (Wigner surmise)', color: '#ef4444', dash: '' },
        { label: 'GOE', color: '#f59e0b', dash: '3,3' },
        { label: 'Poisson (uncorrelated)', color: '#64748b', dash: '6,4' },
      ].forEach(({ label, color, dash }, i) => {
        const row = (i + 1) * 20;
        legend.append('line').attr('x1', 0).attr('y1', row).attr('x2', 22).attr('y2', row)
          .attr('stroke', color).attr('stroke-width', 2).attr('stroke-dasharray', dash);
        legend.append('text').attr('x', 28).attr('y', row + 4)
          .attr('fill', '#94a3b8').attr('font-size', 11).text(label);
      });

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Normalized spacing s');
      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('P(s)');
      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Nearest-Neighbor Spacing Distribution');

    } else if (mode === 'pair-correlation') {
      const { density, binW } = statsData.pair;
      const maxR = 4;
      const bins = 30;

      const x = d3.scaleLinear().domain([0, maxR]).range([0, w]);
      const yMax = Math.max(1.5, d3.max(density) * 1.2);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(6))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      for (let i = 0; i < bins; i++) {
        g.append('rect')
          .attr('x', x(i * binW)).attr('y', y(density[i]))
          .attr('width', x(binW) - x(0) - 1).attr('height', h - y(density[i]))
          .attr('fill', 'rgba(139,92,246,0.4)').attr('stroke', '#8b5cf6').attr('stroke-width', 0.5);
      }

      // GUE pair correlation: R_2(x) = 1 - (sin(πx)/(πx))^2
      g.append('path')
        .datum(REF_R2_CURVE)
        .attr('d', d3.line().x(d => x(d.r)).y(d => y(d.p)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2.5);

      // R_2 = 1 reference (uncorrelated / Poisson baseline)
      g.append('line')
        .attr('x1', 0).attr('y1', y(1)).attr('x2', w).attr('y2', y(1))
        .attr('stroke', '#64748b').attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);
      g.append('text')
        .attr('x', w - 4).attr('y', y(1) - 5)
        .attr('text-anchor', 'end').attr('fill', '#64748b').attr('font-size', 10)
        .text('R₂ = 1 (uncorrelated)');

      const legend = g.append('g').attr('transform', `translate(${w - 220}, 10)`);
      legend.append('rect').attr('x', 2).attr('y', -6).attr('width', 18).attr('height', 12)
        .attr('rx', 1).attr('fill', 'rgba(139,92,246,0.4)').attr('stroke', '#8b5cf6').attr('stroke-width', 0.5);
      legend.append('text').attr('x', 28).attr('y', 4)
        .attr('fill', '#94a3b8').attr('font-size', 11).text('Zeta zeros (data)');
      legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 22).attr('y2', 20)
        .attr('stroke', '#ef4444').attr('stroke-width', 2);
      legend.append('text').attr('x', 28).attr('y', 24)
        .attr('fill', '#94a3b8').attr('font-size', 11).text('GUE: 1 − (sin πx / πx)²');
      legend.append('line').attr('x1', 0).attr('y1', 40).attr('x2', 22).attr('y2', 40)
        .attr('stroke', '#64748b').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
      legend.append('text').attr('x', 28).attr('y', 44)
        .attr('fill', '#94a3b8').attr('font-size', 11).text('R₂ = 1 (Poisson limit)');

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Normalized distance x');
      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('R₂(x)');
      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Pair Correlation Function R₂(x)');

    } else {
      const { Ls, vars } = statsData.numVar;

      const x = d3.scaleLinear().domain([0, 6]).range([0, w]);
      const yMax = Math.max(1, d3.max(vars) * 1.2);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(6))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Data points
      const dataLine = d3.line()
        .x((d, i) => x(Ls[i])).y(d => y(d)).curve(d3.curveMonotoneX);
      g.append('path').datum(vars).attr('d', dataLine)
        .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);
      vars.forEach((v, i) => {
        g.append('circle').attr('cx', x(Ls[i])).attr('cy', y(v)).attr('r', 3)
          .attr('fill', '#3b82f6').attr('stroke', '#0a0e1a').attr('stroke-width', 1);
      });

      // GUE prediction: Sigma^2(L) ~ (2/pi^2)(log(2*pi*L) + 1 + gamma_E - pi^2/8)
      g.append('path').datum(REF_NUMVAR_GUE)
        .attr('d', d3.line().x(d => x(d.L)).y(d => y(d.s2)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2.5);

      // Poisson: Sigma^2 = L (slope = 1 in data coords)
      // End the line where Σ²=L exits the chart (at L=yMax if yMax < 6)
      const poissonEnd = Math.min(6, yMax);
      g.append('line')
        .attr('x1', x(0)).attr('y1', y(0)).attr('x2', x(poissonEnd)).attr('y2', y(poissonEnd))
        .attr('stroke', '#64748b').attr('stroke-dasharray', '6,4').attr('stroke-width', 1.5);

      const legend = g.append('g').attr('transform', `translate(20, 10)`);
      [
        { label: 'Zeta zeros', color: '#3b82f6', dash: '', dots: true },
        { label: 'GUE prediction', color: '#ef4444', dash: '', dots: false },
        { label: 'Poisson (Σ²=L)', color: '#64748b', dash: '6,4', dots: false },
      ].forEach(({ label, color, dash, dots }, i) => {
        legend.append('line').attr('x1', 0).attr('y1', i * 20).attr('x2', 22).attr('y2', i * 20)
          .attr('stroke', color).attr('stroke-width', 2).attr('stroke-dasharray', dash);
        if (dots) {
          legend.append('circle').attr('cx', 5).attr('cy', i * 20).attr('r', 2.5)
            .attr('fill', color).attr('stroke', '#0a0e1a').attr('stroke-width', 1);
          legend.append('circle').attr('cx', 17).attr('cy', i * 20).attr('r', 2.5)
            .attr('fill', color).attr('stroke', '#0a0e1a').attr('stroke-width', 1);
        }
        legend.append('text').attr('x', 28).attr('y', i * 20 + 4)
          .attr('fill', '#94a3b8').attr('font-size', 11).text(label);
      });

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Interval length L');
      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Σ²(L)');
      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Number Variance Σ²(L)');
    }

  }, [statsData, mode, numZeros]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      {mode === 'spacing' && (
        <div className="tab-explainer accent-red">
          <strong>The math:</strong> The nearest-neighbor spacing distribution <InlineMath tex="P(s)" /> measures the probability
          that consecutive normalized zero gaps have size <InlineMath tex="s" />. For random matrices from the GUE (Gaussian
          Unitary Ensemble), the Wigner surmise gives <InlineMath tex="P_{\text{GUE}}(s) = (32/\pi^2)s^2 e^{-4s^2/\pi}" />.
          The key feature is <strong>level repulsion</strong>: <InlineMath tex="P(0) = 0" />, meaning zeros never collide.
          Poisson (random) would give <InlineMath tex="P(s) = e^{-s}" /> with clustering at zero.
          <strong> Look for:</strong> the zeta zero histogram matching GUE (red), not Poisson (gray).
        </div>
      )}
      {mode === 'pair-correlation' && (
        <div className="tab-explainer accent-purple">
          <strong>The math:</strong> The pair correlation <InlineMath tex="R_2(x) = 1 - (\sin\pi x / \pi x)^2" /> (Montgomery 1973)
          measures the density of pairs of zeros at separation <InlineMath tex="x" />. The dip at <InlineMath tex="x = 0" /> confirms
          level repulsion; the oscillations reflect the determinantal structure of GUE eigenvalues.
          This is the "two-point function" of the zero process.
          <strong> Look for:</strong> the measured correlation matching the GUE sine-kernel curve.
        </div>
      )}
      {mode === 'number-variance' && (
        <div className="tab-explainer accent-cyan">
          <strong>The math:</strong> The number variance <InlineMath tex="\Sigma^2(L)" /> measures fluctuations in the count of zeros
          in intervals of length <InlineMath tex="L" />. For GUE, <InlineMath tex="\Sigma^2(L) = \tfrac{2}{\pi^2}\bigl(\log(2\pi L) + 1 + \gamma_E - \tfrac{\pi^2}{8}\bigr)" /> (logarithmic
          growth) &mdash; much slower than Poisson where <InlineMath tex="\Sigma^2 = L" />. This logarithmic suppression means zeros
          are <strong>rigidly</strong> spaced &mdash; far more regular than random.
          <strong> Look for:</strong> the data following the GUE log curve, not the linear Poisson line.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label>Statistic</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="spacing">Nearest-Neighbor Spacing</option>
            <option value="pair-correlation">Pair Correlation R₂</option>
            <option value="number-variance">Number Variance Σ²</option>
          </select>
        </div>
        <div className="control-group">
          <label>Zeros used</label>
          <input type="range" min="10" max="300" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
          <span style={{ marginLeft: 6, fontSize: 11, color: '#64748b' }}>
            (γ_max ≈ {ZETA_ZEROS[Math.min(numZeros, ZETA_ZEROS.length) - 1]?.toFixed(1) ?? '?'})
          </span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
      </div>
    </div>
  );
}
