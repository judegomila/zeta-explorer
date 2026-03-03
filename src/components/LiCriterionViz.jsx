import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { InlineMath } from './KaTeXMath.jsx';
import { ZETA_ZEROS, cAdd, cSub, cMul, cDiv, cAbs, cLog, cPow, cExp } from '../math/zeta.js';

/**
 * Li's criterion: RH ⟺ λ_n ≥ 0 for all n ≥ 1
 * where λ_n = sum_ρ [1 - (1 - 1/ρ)^n]
 *
 * Also visualize the de Bruijn-Newman constant connection.
 */
export default function LiCriterionViz() {
  const svgRef = useRef();
  const [maxN, setMaxN] = useState(20);
  const [numZeros, setNumZeros] = useState(50);
  const [mode, setMode] = useState('li');

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 420;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (mode === 'li') {
      // Compute Li coefficients λ_n using first numZeros zeros
      const zeros = ZETA_ZEROS.slice(0, numZeros);
      const lambdas = [];

      for (let n = 1; n <= maxN; n++) {
        let lambda = 0;
        for (const gamma of zeros) {
          // ρ = 1/2 + iγ
          // 1 - (1 - 1/ρ)^n
          // 1/ρ = (1/2 - iγ) / (1/4 + γ²)
          const rhoReal = 0.5;
          const rhoImag = gamma;
          const rhoNormSq = rhoReal * rhoReal + rhoImag * rhoImag;
          const invRhoReal = rhoReal / rhoNormSq;
          const invRhoImag = -rhoImag / rhoNormSq;

          const baseReal = 1 - invRhoReal;
          const baseImag = -invRhoImag;

          // (base)^n via repeated multiplication
          let powReal = 1, powImag = 0;
          for (let k = 0; k < n; k++) {
            const newReal = powReal * baseReal - powImag * baseImag;
            const newImag = powReal * baseImag + powImag * baseReal;
            powReal = newReal;
            powImag = newImag;
          }

          // Contribution: 1 - (base)^n, take real part (sum over conjugate pair gives 2*Re)
          lambda += 2 * (1 - powReal);
        }
        lambdas.push({ n, lambda });
      }

      const x = d3.scaleBand().domain(d3.range(1, maxN + 1)).range([0, w]).padding(0.3);
      const yMin = Math.min(0, d3.min(lambdas, d => d.lambda) * 1.2);
      const yMax = d3.max(lambdas, d => d.lambda) * 1.2;
      const y = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).tickFormat(d => d))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Zero reference
      g.append('line')
        .attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');
      g.append('text').attr('x', w - 4).attr('y', y(0) - 6)
        .attr('text-anchor', 'end').attr('fill', '#ef4444').attr('font-size', 10)
        .text('λ = 0 (RH boundary)');

      // Bars
      lambdas.forEach(({ n, lambda }) => {
        const isPositive = lambda >= 0;
        g.append('rect')
          .attr('x', x(n))
          .attr('y', isPositive ? y(lambda) : y(0))
          .attr('width', x.bandwidth())
          .attr('height', Math.abs(y(lambda) - y(0)))
          .attr('rx', 3)
          .attr('fill', isPositive ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)')
          .attr('stroke', isPositive ? '#10b981' : '#ef4444')
          .attr('stroke-width', 1);

        // Value label
        g.append('text')
          .attr('x', x(n) + x.bandwidth() / 2)
          .attr('y', isPositive ? y(lambda) - 4 : y(lambda) + 14)
          .attr('text-anchor', 'middle')
          .attr('fill', isPositive ? '#10b981' : '#ef4444')
          .attr('font-size', Math.min(10, x.bandwidth() / 3))
          .attr('font-family', 'var(--font-mono)')
          .text(lambda.toFixed(2));
      });

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text(`Li Coefficients λₙ — RH ⟺ all λₙ ≥ 0`);
      svg.append('text').attr('x', margin.left + 4).attr('y', 32)
        .attr('fill', '#64748b').attr('font-size', 11)
        .text(`Computed using ${numZeros} zeros. All positive → consistent with RH.`);

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('n');

    } else if (mode === 'keiper-li') {
      // Keiper-Li: plot λ_n / n vs n (should → (1/2)log(n/(2πe)) + ...)
      const zeros = ZETA_ZEROS.slice(0, numZeros);
      const data = [];

      for (let n = 1; n <= maxN; n++) {
        let lambda = 0;
        for (const gamma of zeros) {
          const rhoNormSq = 0.25 + gamma * gamma;
          const invRhoReal = 0.5 / rhoNormSq;
          const invRhoImag = -gamma / rhoNormSq;
          const baseReal = 1 - invRhoReal;
          const baseImag = -invRhoImag;
          let powReal = 1, powImag = 0;
          for (let k = 0; k < n; k++) {
            const newR = powReal * baseReal - powImag * baseImag;
            const newI = powReal * baseImag + powImag * baseReal;
            powReal = newR; powImag = newI;
          }
          lambda += 2 * (1 - powReal);
        }
        data.push({ n, lambda, perN: lambda / n });
      }

      const x = d3.scaleLinear().domain([1, maxN]).range([0, w]);
      const yMax = d3.max(data, d => d.perN) * 1.2;
      const yMin = Math.min(0, d3.min(data, d => d.perN) * 1.2);
      const y = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Reference curve: (1/2)log(n/(2πe)) + 1/2 (Keiper-Li asymptotic)
      const refCurve = [];
      for (let n = 1; n <= maxN; n += 0.5) {
        refCurve.push({ n, y: 0.5 * Math.log(n / (2 * Math.PI * Math.E)) + 0.5 });
      }
      g.append('path').datum(refCurve)
        .attr('d', d3.line().x(d => x(d.n)).y(d => y(d.y)).curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-dasharray', '4,4').attr('stroke-width', 1.5);

      // Data
      const line = d3.line().x(d => x(d.n)).y(d => y(d.perN)).curve(d3.curveMonotoneX);
      g.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 2.5);

      data.forEach(d => {
        g.append('circle').attr('cx', x(d.n)).attr('cy', y(d.perN)).attr('r', 3)
          .attr('fill', '#8b5cf6').attr('stroke', '#0a0e1a').attr('stroke-width', 1);
      });

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Keiper-Li: λₙ/n vs n (should approach ½log(n/2πe) + ½)');

      const legend = g.append('g').attr('transform', `translate(${w - 200}, ${h - 50})`);
      legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 22).attr('y2', 0)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 2);
      legend.append('text').attr('x', 28).attr('y', 4).attr('fill', '#94a3b8').attr('font-size', 11)
        .text('λₙ/n (data)');
      legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 22).attr('y2', 20)
        .attr('stroke', '#64748b').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,4');
      legend.append('text').attr('x', 28).attr('y', 24).attr('fill', '#94a3b8').attr('font-size', 11)
        .text('½log(n/2πe) + ½');

    } else {
      // De Bruijn-Newman: show what happens when we "heat" the zeros
      // Ξ_τ has zeros at σ = 1/2 for τ ≤ 0 (if RH), wander off for τ > 0
      // Λ ≥ 0 (Rodgers-Tao): zeros are just barely on the line
      const zeros = ZETA_ZEROS.slice(0, numZeros);
      const taus = [-0.5, -0.2, -0.1, 0, 0.05, 0.1, 0.2, 0.5];
      const colors = ['#3b82f6', '#06b6d4', '#10b981', '#e2e8f0', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

      const maxGamma = zeros.length > 0 ? zeros[zeros.length - 1] * 1.05 : 100;
      const x = d3.scaleLinear().domain([0, maxGamma]).range([0, w]);
      const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // σ = 0.5 reference
      g.append('line')
        .attr('x1', 0).attr('y1', y(0.5)).attr('x2', w).attr('y2', y(0.5))
        .attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '6,4');
      g.append('text').attr('x', w - 4).attr('y', y(0.5) - 6)
        .attr('text-anchor', 'end').attr('fill', '#ef4444').attr('font-size', 10)
        .text('σ = ½');

      // For each τ, show the real parts of zeros under heat flow
      // Approximate: as τ increases from 0, zeros drift off the line
      // σ(τ) ≈ 1/2 + c * τ / γ for each zero γ
      taus.forEach((tau, ti) => {
        zeros.forEach((gamma, zi) => {
          // Simple model: σ = 1/2 + tau * (random-like perturbation based on gamma)
          const perturbation = tau > 0
            ? tau * Math.sin(gamma * 3.7 + zi * 1.3) / (1 + gamma * 0.05)
            : 0; // for τ ≤ 0, zeros stay on line (if RH)
          const sigma = 0.5 + perturbation;
          const clampedSigma = Math.max(0, Math.min(1, sigma));

          g.append('circle')
            .attr('cx', x(gamma)).attr('cy', y(clampedSigma)).attr('r', 2.5)
            .attr('fill', colors[ti]).attr('opacity', 0.7);
        });
      });

      // Legend
      const legend = g.append('g').attr('transform', `translate(10, 10)`);
      taus.forEach((tau, i) => {
        legend.append('circle').attr('cx', 6).attr('cy', i * 16).attr('r', 3).attr('fill', colors[i]);
        legend.append('text').attr('x', 14).attr('y', i * 16 + 4)
          .attr('fill', colors[i]).attr('font-size', 10)
          .text(`τ = ${tau}`);
      });

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('de Bruijn-Newman: Zero Drift Under Heat Flow');
      svg.append('text').attr('x', margin.left + 4).attr('y', 32)
        .attr('fill', '#64748b').attr('font-size', 11)
        .text('Λ ≥ 0 (Rodgers-Tao): zeros at τ=0 are exactly on the critical line');

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Im(ρ) = γ');
    }

  }, [maxN, numZeros, mode]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      {mode === 'li' && (
        <div className="tab-explainer accent-green">
          <strong>The math:</strong> The Li coefficients <InlineMath tex="\lambda_n = \sum_\rho [1 - (1-1/\rho)^n]" /> are sums over
          all nontrivial zeros. Li's criterion (1997): <strong>RH is true if and only if <InlineMath tex="\lambda_n \geq 0" /> for
          all <InlineMath tex="n" /></strong>. In our model, <InlineMath tex="\lambda_n \geq 0" /> means the bridge scattering matrix
          is passive (contractive) at every angular mode &mdash; it never amplifies.
          <strong> Look for:</strong> all bars positive (green), confirming passivity.
        </div>
      )}
      {mode === 'keiper-li' && (
        <div className="tab-explainer accent-orange">
          <strong>The math:</strong> The normalized ratio <InlineMath tex="\lambda_n/n" /> should approach{' '}
          <InlineMath tex="\tfrac{1}{2}\log(n/2\pi e) + \tfrac{1}{2}" /> asymptotically (Keiper-Li formula).
          This logarithmic growth rate matches the zero density <InlineMath tex="N(T) \sim (T/2\pi)\log(T/2\pi e)" />.
          Deviations from this curve would signal a zero off the critical line.
          <strong> Look for:</strong> data points tracking the smooth asymptotic curve.
        </div>
      )}
      {mode === 'debruijn' && (
        <div className="tab-explainer accent-purple">
          <strong>The math:</strong> Under the heat equation with parameter <InlineMath tex="\tau" />, zeros of the Xi function
          evolve continuously. At <InlineMath tex="\tau = 0" />, they sit on the real axis (assuming RH). Heating
          (<InlineMath tex="\tau > 0" />) pushes them off; cooling (<InlineMath tex="\tau < 0" />) pulls them on.
          The de Bruijn-Newman constant <InlineMath tex="\Lambda \geq 0" /> (proved by Rodgers-Tao) is the critical
          temperature: the system is already at the coldest point compatible with real zeros.
          <strong> Look for:</strong> zeros migrating off the real axis as <InlineMath tex="\tau" /> increases from 0.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label>View</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="li">Li Coefficients λₙ</option>
            <option value="keiper-li">Keiper-Li: λₙ/n</option>
            <option value="debruijn">de Bruijn-Newman Heat Flow</option>
          </select>
        </div>
        {mode !== 'debruijn' && (
          <div className="control-group">
            <label>Max n</label>
            <input type="range" min="5" max="40" step="1" value={maxN}
              onChange={e => setMaxN(+e.target.value)} />
            <span className="control-value">{maxN}</span>
          </div>
        )}
        <div className="control-group">
          <label>Zeros used</label>
          <input type="range" min="10" max="200" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
      </div>
    </div>
  );
}
