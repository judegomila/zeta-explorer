import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
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

  // Memoize expensive data computations (O(numZeros × maxN)) to avoid recomputing on resize
  const computedData = useMemo(() => {
    const zeros = ZETA_ZEROS.slice(0, numZeros);

    if (mode === 'li' || mode === 'keiper-li') {
      const polarBases = zeros.map(gamma => {
        const rhoNormSq = 0.25 + gamma * gamma;
        const baseReal = 1 - 0.5 / rhoNormSq;
        const baseImag = gamma / rhoNormSq;
        return { r: Math.sqrt(baseReal * baseReal + baseImag * baseImag), theta: Math.atan2(baseImag, baseReal) };
      });

      // Use incremental recurrence instead of Math.pow/Math.cos per (n, zero) pair.
      // For each zero, maintain running r^n via multiplication and cos(n·θ)/sin(n·θ)
      // via the angle-addition identity: cos((n+1)θ) = cos(nθ)·cos(θ) − sin(nθ)·sin(θ).
      const lambdas = [];
      const numBases = polarBases.length;
      // Precompute cos(θ), sin(θ), and initialize running powers for n=1
      const cosTheta = new Float64Array(numBases);
      const sinTheta = new Float64Array(numBases);
      const rn = new Float64Array(numBases);       // r^n, starts at r^1
      const cosN = new Float64Array(numBases);     // cos(n·θ), starts at cos(θ)
      const sinN = new Float64Array(numBases);     // sin(n·θ), starts at sin(θ)
      for (let j = 0; j < numBases; j++) {
        const { r, theta } = polarBases[j];
        cosTheta[j] = Math.cos(theta);
        sinTheta[j] = Math.sin(theta);
        rn[j] = r;
        cosN[j] = cosTheta[j];
        sinN[j] = sinTheta[j];
      }
      for (let n = 1; n <= maxN; n++) {
        let lambda = 0;
        for (let j = 0; j < numBases; j++) {
          lambda += 2 * (1 - rn[j] * cosN[j]);
          // Advance to n+1: r^(n+1) = r^n · r
          rn[j] *= polarBases[j].r;
          // cos((n+1)θ) = cos(nθ)cos(θ) − sin(nθ)sin(θ)
          const nextCos = cosN[j] * cosTheta[j] - sinN[j] * sinTheta[j];
          sinN[j] = sinN[j] * cosTheta[j] + cosN[j] * sinTheta[j];
          cosN[j] = nextCos;
        }
        lambdas.push({ n, lambda, perN: lambda / n });
      }
      return { zeros, lambdas };
    } else {
      // Only one non-negative τ entry (τ=0, the Rodgers-Tao boundary). Earlier the list
      // also held τ ∈ {0.05, 0.1, 0.2, 0.5}, all of which produce zero perturbation below
      // and therefore overdraw at exactly σ=½ — only the last-drawn color (purple) was
      // ever visible, while the other 4 legend entries silently rendered nothing.
      const taus = [-0.5, -0.2, -0.1, 0];
      const colors = ['#3b82f6', '#06b6d4', '#10b981', '#e2e8f0'];
      const scatterPoints = taus.map((tau, ti) =>
        zeros.map((gamma, zi) => {
          const perturbation = tau < 0
            ? tau * Math.sin(gamma * 3.7 + zi * 1.3) / (1 + gamma * 0.05)
            : 0;
          return { gamma, sigma: Math.max(0, Math.min(1, 0.5 + perturbation)), tau, color: colors[ti] };
        })
      );
      return { zeros, scatterPoints, taus, colors };
    }
  }, [numZeros, maxN, mode]);

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
      const { lambdas } = computedData;

      const x = d3.scaleBand().domain(d3.range(1, maxN + 1)).range([0, w]).padding(0.3);
      const yMin = Math.min(0, d3.min(lambdas, d => d.lambda) * 1.2);
      const yMax = d3.max(lambdas, d => d.lambda) * 1.2;
      const y = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]);

      // Horizontal gridlines
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''))
        .selectAll('line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3');
      g.select('.grid .domain').remove();

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
          .attr('stroke-width', 1)
          .style('cursor', 'crosshair')
          .append('title').text(`λ${n} = ${lambda.toFixed(4)} (${numZeros} zeros used)`);

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

      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('λₙ');

    } else if (mode === 'keiper-li') {
      // Keiper-Li: plot λ_n / n vs n (should → (1/2)log(n/(2πe)) + ...)
      const { lambdas: data } = computedData;

      const x = d3.scaleLinear().domain([1, maxN]).range([0, w]);
      const yMax = d3.max(data, d => d.perN) * 1.2;
      const yMin = Math.min(0, d3.min(data, d => d.perN) * 1.2);
      const y = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]);

      // Horizontal gridlines
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(8).tickSize(-w).tickFormat(''))
        .selectAll('line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3');
      g.select('.grid .domain').remove();

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Reference curve: (1/2)(log(n/(2π)) + γ − 1) (Keiper-Li asymptotic, Bombieri-Lagarias 1999 Thm 2 / Coffey 2005)
      const EULER_GAMMA = 0.5772156649015329;
      const refCurve = [];
      for (let n = 1; n <= maxN; n += 0.5) {
        refCurve.push({ n, y: 0.5 * (Math.log(n / (2 * Math.PI)) + EULER_GAMMA - 1) });
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
          .attr('fill', '#8b5cf6').attr('stroke', '#0a0e1a').attr('stroke-width', 1)
          .style('cursor', 'crosshair')
          .append('title').text(`n = ${d.n}, λₙ = ${d.lambda.toFixed(4)}, λₙ/n = ${d.perN.toFixed(4)}`);
      });

      svg.append('text').attr('x', margin.left + 4).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
        .text('Keiper-Li: λₙ/n vs n (should approach ½(log(n/2π) + γ − 1))');

      const legend = g.append('g').attr('transform', `translate(${w - 200}, ${h - 50})`);
      legend.append('rect')
        .attr('x', -6).attr('y', -10).attr('width', 196).attr('height', 42)
        .attr('rx', 4).attr('fill', 'rgba(13,17,23,0.85)').attr('stroke', '#1e293b');
      legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 22).attr('y2', 0)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 2);
      legend.append('circle').attr('cx', 11).attr('cy', 0).attr('r', 3)
        .attr('fill', '#8b5cf6').attr('stroke', '#0a0e1a').attr('stroke-width', 1);
      legend.append('text').attr('x', 28).attr('y', 4).attr('fill', '#94a3b8').attr('font-size', 11)
        .text('λₙ/n (data)');
      legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 22).attr('y2', 20)
        .attr('stroke', '#64748b').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,4');
      legend.append('text').attr('x', 28).attr('y', 24).attr('fill', '#94a3b8').attr('font-size', 11)
        .text('½(log(n/2π) + γ − 1)');

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('n');

      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('λₙ/n');

    } else {
      // De Bruijn-Newman: show what happens when we "heat" the zeros
      const { zeros, scatterPoints, taus, colors } = computedData;

      const maxGamma = zeros.length > 0 ? zeros[zeros.length - 1] * 1.05 : 100;
      const x = d3.scaleLinear().domain([0, maxGamma]).range([0, w]);
      const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

      // Horizontal gridlines
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''))
        .selectAll('line').attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3');
      g.select('.grid .domain').remove();

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

      // Render precomputed scatter points — radius scales with displacement from critical line
      scatterPoints.forEach((tauPoints) => {
        tauPoints.forEach(({ gamma, sigma, tau, color }) => {
          const dist = Math.abs(sigma - 0.5);
          const r = 2 + dist * 12; // 2px on the line → up to 8px at σ=0 or σ=1
          g.append('circle')
            .attr('cx', x(gamma)).attr('cy', y(sigma)).attr('r', r)
            .attr('fill', color).attr('opacity', 0.7)
            .attr('stroke', dist > 0.01 ? '#fff' : 'none').attr('stroke-width', 0.5)
            .style('cursor', 'crosshair')
            .append('title').text(`τ = ${tau}, γ = ${gamma.toFixed(2)}, σ = ${sigma.toFixed(4)}, |σ−½| = ${dist.toFixed(4)}`);
        });
      });

      // Legend
      const legend = g.append('g').attr('transform', `translate(10, 10)`);
      const legendH = taus.length * 16 + 8;
      legend.append('rect')
        .attr('x', -6).attr('y', -10).attr('width', 80).attr('height', legendH)
        .attr('rx', 4).attr('fill', 'rgba(13,17,23,0.85)').attr('stroke', '#1e293b');
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
        .text('Λ ≥ 0 (Rodgers-Tao): backward heat (τ<0) always creates non-real zeros');

      svg.append('text').attr('x', width / 2).attr('y', height - 6)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('Im(ρ) = γ');

      svg.append('text')
        .attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
        .text('σ = Re(ρ)');
    }

  }, [maxN, numZeros, mode, computedData]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="filter-bar">
        <button className={`filter-btn ${mode === 'li' ? 'active' : ''}`}
          onClick={() => setMode('li')}>Li Coefficients λₙ</button>
        <button className={`filter-btn ${mode === 'keiper-li' ? 'active' : ''}`}
          onClick={() => setMode('keiper-li')}>Keiper-Li: λₙ/n</button>
        <button className={`filter-btn ${mode === 'debruijn' ? 'active' : ''}`}
          onClick={() => setMode('debruijn')}>de Bruijn-Newman Heat Flow</button>
      </div>
      {mode === 'li' && (
        <div className="tab-explainer accent-green">
          <p style={{ margin: '0 0 8px' }}>
            The Li coefficients are sums over all nontrivial zeros:
          </p>
          <BlockMath tex={"\\lambda_n = \\sum_{\\rho} \\left[1 - \\left(1-\\frac{1}{\\rho}\\right)^{\\!n}\\right]"} />
          <p style={{ margin: '8px 0' }}>
            Li's criterion (1997): <strong>RH is true iff <InlineMath tex={"\\lambda_n \\geq 0"} /> for
            all <InlineMath tex={"n"} /></strong>. In our model, this means the bridge scattering matrix
            is passive (contractive) at every angular mode.
          </p>
          <p style={{ margin: '4px 0 0' }}>
            <strong>Look for:</strong> all bars positive (green), confirming passivity.
          </p>
        </div>
      )}
      {mode === 'keiper-li' && (
        <div className="tab-explainer accent-orange">
          <p style={{ margin: '0 0 8px' }}>
            The normalized ratio <InlineMath tex={"\\lambda_n/n"} /> should approach the Keiper-Li asymptotic:
          </p>
          <BlockMath tex={"\\frac{\\lambda_n}{n} \\to \\frac{1}{2}\\bigl(\\log(n/2\\pi) + \\gamma - 1\\bigr)"} />
          <p style={{ margin: '8px 0' }}>
            where <InlineMath tex={"\\gamma \\approx 0.577"} /> is the Euler-Mascheroni constant.
            This logarithmic growth matches the zero
            density <InlineMath tex={"N(T) \\sim (T/2\\pi)\\log(T/2\\pi e)"} />.
            Deviations from this curve would signal a zero off the critical line.
          </p>
          <p style={{ margin: '4px 0 0' }}>
            <strong>Look for:</strong> data points tracking the smooth asymptotic curve.
          </p>
        </div>
      )}
      {mode === 'debruijn' && (
        <div className="tab-explainer accent-purple">
          <p style={{ margin: '0 0 8px' }}>
            Under the heat equation with parameter <InlineMath tex={"\\tau"} />, zeros of the Xi function
            evolve continuously. At <InlineMath tex={"\\tau = 0"} />, they sit on the critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> (assuming RH). Heating
            (<InlineMath tex={"\\tau > 0"} />) keeps them on the line; inverse diffusion (<InlineMath tex={"\\tau < 0"} />) scatters them off.
            The de Bruijn-Newman constant <InlineMath tex={"\\Lambda \\geq 0"} /> (proved by Rodgers-Tao) is the critical
            temperature: the system is already at the coldest point compatible with real zeros.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 11, color: '#f59e0b' }}>
            <strong>Note:</strong> the scatter below is a <em>schematic illustration</em>, not a true
            solution of the backward heat equation. For <InlineMath tex={"\\tau < 0"} /> the displacement
            uses a deterministic <InlineMath tex={"\\sin"} />-based pattern
            <InlineMath tex={"\\,\\tau \\sin(3.7\\gamma + 1.3 j)/(1 + 0.05\\gamma)"} /> purely to convey
            that negative <InlineMath tex={"\\tau"} /> creates non-real zeros &mdash; the magnitudes,
            signs, and ordering are not physically accurate.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <strong>Look for:</strong> zeros staying on <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for <InlineMath tex={"\\tau \\geq 0"} /> and scattering off for <InlineMath tex={"\\tau < 0"} /> (backward heat).
          </p>
        </div>
      )}
      <div className="controls">
        {mode !== 'debruijn' && (
          <div className="control-group">
            <label title="Maximum index n for Li coefficient computation — higher values test RH at finer resolution but require more zeros">Max n</label>
            <input type="range" min="5" max="40" step="1" value={maxN}
              onChange={e => setMaxN(+e.target.value)}
              title="Number of Li coefficients to compute (λ₁ through λₙ)" />
            <span className="control-value">{maxN}</span>
          </div>
        )}
        <div className="control-group">
          <label title="Number of nontrivial zeta zeros used in the Li coefficient sum — more zeros give more accurate coefficients">Zeros used</label>
          <input type="range" min="10" max="200" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)}
            title="More zeros = more accurate Li coefficients and heat flow trajectories" />
          <span className="control-value">{numZeros}</span>
          <span style={{ color: '#64748b', fontSize: '0.85em', marginLeft: 4 }}>
            (γ<sub>max</sub> ≈ {ZETA_ZEROS[numZeros - 1]?.toFixed(1)})
          </span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 420 }} />
      </div>
    </div>
  );
}
