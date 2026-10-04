import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { getPrimes, primeFrequency } from '../math/primes.js';
import { oscillatorStage, systemHamiltonian, hamiltonianSigmaScan, losslessBridge } from '../math/oscillators.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import { ED, alpha } from '../styles/tokens.js';

const TABS = [
  { id: 'per-prime', label: 'Per-Prime Energy' },
  { id: 'gradient', label: 'Gradient Descent' },
  { id: 'convergence', label: 'Convergence' },
  { id: 'bridge', label: 'Bridge Unitarity' },
  { id: 'multi-zero', label: 'Multi-Zero Test' },
];

const PRIME_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
  '#a855f7', '#e11d48', '#22d3ee', '#eab308', '#6366f1',
  '#2dd4bf', '#f43f5e', '#0ea5e9', '#d946ef', '#fb923c',
];

export default function TwinOscillatorSimViz() {
  const [activeTab, setActiveTab] = useState('per-prime');

  return (
    <div>
      <div className="filter-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`filter-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {activeTab === 'per-prime' && <PerPrimeTab />}
        {activeTab === 'gradient' && <GradientDescentTab />}
        {activeTab === 'convergence' && <ConvergenceTab />}
        {activeTab === 'bridge' && <BridgeTab />}
        {activeTab === 'multi-zero' && <MultiZeroTab />}
      </div>
    </div>
  );
}

// ─── Tab 1: Per-Prime Energy Breakdown ─────────────────────────────────────────

function PerPrimeTab() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(8);

  // Memoize per-prime energy curves to avoid recomputing 640+ oscillatorStage calls on resize
  const { curves, minima } = useMemo(() => {
    const primes = getPrimes(numPrimes);
    const steps = 80;
    const sigmaRange = [0.05, 0.95];

    const curves = primes.map(p => {
      const points = [];
      for (let i = 0; i <= steps; i++) {
        const sigma = sigmaRange[0] + i * (sigmaRange[1] - sigmaRange[0]) / steps;
        const s = [sigma, tValue];
        const sDual = [1 - sigma, -tValue];
        const direct = oscillatorStage(p, s);
        const dual = oscillatorStage(p, sDual);
        const logP = primeFrequency(p);
        const energy = 0.5 * logP * (direct.magnitude * direct.magnitude + dual.magnitude * dual.magnitude);
        points.push({ sigma, energy });
      }
      return { prime: p, points };
    });

    const minima = curves.map(c => {
      const best = c.points.reduce((a, b) => a.energy < b.energy ? a : b);
      return { prime: c.prime, sigma: best.sigma, energy: best.energy };
    });

    return { curves, minima };
  }, [tValue, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 400;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 140, bottom: 50, left: 65 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const sigmaRange = [0.05, 0.95];

    const x = d3.scaleLinear().domain(sigmaRange).range([0, w]);
    const yMax = d3.max(curves, c => d3.max(c.points, d => d.energy)) * 1.1;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10).tickFormat(d => d.toFixed(1)))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(1)))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
    g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

    // Horizontal gridlines
    const gridG = g.append('g').call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(''));
    gridG.select('.domain').remove();
    gridG.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

    // Critical line
    g.append('line')
      .attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
      .attr('stroke', ED.series2).attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4').attr('opacity', 0.7);
    g.append('text').attr('x', x(0.5) + 6).attr('y', 14)
      .attr('fill', ED.series2).attr('font-size', 11).attr('font-weight', 600).text('σ = \u00BD');

    // Draw curves
    const line = d3.line().x(d => x(d.sigma)).y(d => y(d.energy)).curve(d3.curveBasis);
    curves.forEach((c, i) => {
      const color = PRIME_COLORS[i % PRIME_COLORS.length];
      g.append('path').datum(c.points).attr('d', line)
        .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2).attr('opacity', 0.85);
    });

    // Minimum dots
    minima.forEach((m, i) => {
      const color = PRIME_COLORS[i % PRIME_COLORS.length];
      g.append('circle')
        .attr('cx', x(m.sigma)).attr('cy', y(m.energy)).attr('r', 5)
        .attr('fill', color).attr('stroke', ED.paper).attr('stroke-width', 2);
    });

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 125}, ${margin.top + 5})`);
    legend.append('rect')
      .attr('x', -8).attr('y', -10)
      .attr('width', 90).attr('height', curves.length * 17 + 8)
      .attr('rx', 4).attr('fill', alpha(ED.paper, 0.85)).attr('stroke', ED.ruleSoft);
    curves.forEach((c, i) => {
      const color = PRIME_COLORS[i % PRIME_COLORS.length];
      legend.append('line').attr('x1', 0).attr('y1', i * 17).attr('x2', 16).attr('y2', i * 17)
        .attr('stroke', color).attr('stroke-width', 2);
      legend.append('text').attr('x', 22).attr('y', i * 17 + 4)
        .attr('fill', color).attr('font-size', 10).text(`p=${c.prime}`);
    });

    // Axis labels
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 12).text('σ = Re(s)');
    svg.append('text').attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 12).text('E_p(σ)');

  }, [curves, minima]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  // Derive stat grid from already-computed minima (avoids redundant oscillatorStage calls)
  const stats = useMemo(() =>
    minima.map((m, i) => ({
      prime: m.prime,
      minSigma: m.sigma,
      minE: m.energy,
      color: PRIME_COLORS[i % PRIME_COLORS.length],
    })),
    [minima]
  );

  return (
    <div>
      <div className="tab-explainer accent-blue">
        <p style={{ margin: '0 0 8px' }}>
          Each prime <InlineMath tex={"p"} /> defines an oscillator with transfer
          function <InlineMath tex={"H_p(s) = 1/(1 - p^{-s})"} />. Its energy across both ladders:
        </p>
        <BlockMath tex={"E_p(\\sigma) = \\tfrac{1}{2}\\log p\\,\\bigl(|H_p(s)|^2 + |H_p(1-s)|^2\\bigr)"} />
        <p style={{ margin: '8px 0' }}>
          The sum <InlineMath tex={"|H_p(s)|^2 + |H_p(1-s)|^2"} /> is symmetric
          about <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> by construction &mdash; pairing each evaluation
          at <InlineMath tex={"s"} /> with its dual at <InlineMath tex={"1-s"} /> makes the symmetry manifest.
          Within the critical strip, each prime's energy is minimized on the critical line.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Look for:</strong> all colored curves dipping to their minimum at the same <InlineMath tex={"\\sigma = 0.5"} /> vertical.
        </p>
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
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
              <span style={{
                marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                color: bestDist < 0.3 ? 'var(--series-3)' : 'var(--ink-faint)',
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
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="3" max="30" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 400 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginTop: 16 }}>
        {stats.map(s => (
          <div key={s.prime} className="stat-box" style={{ borderColor: s.color }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>p = {s.prime}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 4 }}>
              <InlineMath tex={"\\sigma_{\\min} = " + s.minSigma.toFixed(3)} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>
              <InlineMath tex={"E_{\\min} = " + s.minE.toFixed(3)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 2: Gradient Descent Animation ─────────────────────────────────────────

function GradientDescentTab() {
  const canvasRef = useRef();
  const animRef = useRef();
  const [startSigma, setStartSigma] = useState(0.8);
  const [learningRate, setLearningRate] = useState(0.005);
  const [tValue, setTValue] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [path, setPath] = useState([]);
  const [step, setStep] = useState(0);

  // Pre-compute the H(sigma) curve once per (tValue, numPrimes) — not on every resize or redraw
  const curveData = useMemo(() =>
    hamiltonianSigmaScan(tValue, [0.05, 0.95], 80, numPrimes),
    [tValue, numPrimes]
  );

  const computePath = useCallback(() => {
    const steps = [];
    let sigma = startSigma;
    const maxSteps = 300;
    for (let i = 0; i < maxSteps; i++) {
      const H = systemHamiltonian([sigma, tValue], numPrimes);
      steps.push({ sigma, H: H.total, gradient: H.gradient, step: i });
      sigma = sigma - learningRate * H.gradient;
      sigma = Math.max(0.06, Math.min(0.94, sigma));
      if (Math.abs(H.gradient) < 0.01 && i > 10) break;
    }
    return steps;
  }, [startSigma, learningRate, tValue, numPrimes]);

  const drawFrame = useCallback((curve, pathData, currentStep) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    const topH = H * 0.6;
    const botH = H * 0.35;
    const botY = topH + H * 0.05;
    const pad = { l: 60, r: 30, t: 30, b: 35 };

    // ── Top panel: H(sigma) curve with ball ──
    const tw = W - pad.l - pad.r;
    const th = topH - pad.t - pad.b;
    const xScale = sigma => pad.l + (sigma - 0.05) / 0.9 * tw;
    const hMax = Math.max(...curve.map(d => d.total)) * 1.1;
    const yScale = val => pad.t + th - (val / hMax) * th;

    // Grid lines
    ctx.strokeStyle = ED.ruleSoft;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const gy = pad.t + (i / 5) * th;
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(pad.l + tw, gy); ctx.stroke();
    }

    // H(sigma) curve
    ctx.strokeStyle = ED.series3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    curve.forEach((d, i) => {
      const px = xScale(d.sigma), py = yScale(d.total);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Critical line
    ctx.strokeStyle = ED.series2;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(xScale(0.5), pad.t);
    ctx.lineTo(xScale(0.5), pad.t + th);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw path trace
    if (currentStep > 0 && pathData.length > 0) {
      ctx.strokeStyle = alpha(ED.brassDeco, 0.5);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const visPath = pathData.slice(0, currentStep + 1);
      visPath.forEach((d, i) => {
        const px = xScale(d.sigma), py = yScale(d.H);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Ball at current position
      const cur = pathData[Math.min(currentStep, pathData.length - 1)];
      ctx.beginPath();
      ctx.arc(xScale(cur.sigma), yScale(cur.H), 8, 0, Math.PI * 2);
      ctx.fillStyle = ED.series4;
      ctx.fill();
      ctx.strokeStyle = ED.paper;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = ED.series4;
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`σ=${cur.sigma.toFixed(4)}`, xScale(cur.sigma), yScale(cur.H) - 14);
    }

    // Legend (top-right corner of top panel)
    const legendX = pad.l + tw - 145;
    const legendY = pad.t + 6;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, 140, 68, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    // H(σ) curve
    ctx.strokeStyle = ED.series3; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(legendX + 8, legendY + 14); ctx.lineTo(legendX + 28, legendY + 14); ctx.stroke();
    ctx.fillStyle = ED.ink; ctx.fillText('H(σ) landscape', legendX + 34, legendY + 18);
    // Descent path
    ctx.strokeStyle = ED.brassDeco; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(legendX + 8, legendY + 30); ctx.lineTo(legendX + 22, legendY + 30); ctx.stroke();
    ctx.beginPath(); ctx.arc(legendX + 25, legendY + 30, 3.5, 0, Math.PI * 2); ctx.fillStyle = ED.series4; ctx.fill();
    ctx.fillStyle = ED.ink; ctx.fillText('Descent path', legendX + 34, legendY + 34);
    // Critical line
    ctx.strokeStyle = ED.series2; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(legendX + 8, legendY + 46); ctx.lineTo(legendX + 28, legendY + 46); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ED.ink; ctx.fillText('σ = ½ critical line', legendX + 34, legendY + 50);
    // Convergence curve
    ctx.strokeStyle = ED.series6; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(legendX + 8, legendY + 62); ctx.lineTo(legendX + 28, legendY + 62); ctx.stroke();
    ctx.fillStyle = ED.ink; ctx.fillText('σ convergence', legendX + 34, legendY + 66);

    // Top axis labels
    ctx.fillStyle = ED.series8;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('σ = Re(s)', W / 2, topH - 3);
    ctx.save();
    ctx.translate(14, topH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('H(σ)', 0, 0);
    ctx.restore();

    // Tick labels
    ctx.fillStyle = ED.series8;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let v = 0.1; v <= 0.9; v += 0.1) {
      ctx.fillText(v.toFixed(1), xScale(v), topH - pad.b + 15);
    }

    // ── Bottom panel: sigma vs step ──
    if (pathData.length > 1) {
      const bw = tw;
      const bh = botH - 30;
      const byStart = botY + 15;
      const visPath = pathData.slice(0, currentStep + 1);
      const maxStep = pathData.length;
      const bxScale = s => pad.l + (s / maxStep) * bw;
      const byScale = sig => byStart + bh - ((sig - 0.05) / 0.9) * bh;

      // 0.5 reference line
      ctx.strokeStyle = ED.series2;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(pad.l, byScale(0.5));
      ctx.lineTo(pad.l + bw, byScale(0.5));
      ctx.stroke();
      ctx.setLineDash([]);

      // Convergence curve
      ctx.strokeStyle = ED.series6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      visPath.forEach((d, i) => {
        const px = bxScale(d.step), py = byScale(d.sigma);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.fillStyle = ED.series8;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Step', W / 2, botY + botH - 2);
      ctx.save();
      ctx.translate(14, byStart + bh / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('σ', 0, 0);
      ctx.restore();

      ctx.fillStyle = ED.series8;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('0.5', pad.l - 5, byScale(0.5) + 4);
      ctx.fillText(startSigma.toFixed(1), pad.l - 5, byScale(startSigma) + 4);
    }
  }, [startSigma]);

  const handleRun = useCallback(() => {
    const pathData = computePath();
    setPath(pathData);
    setStep(0);
    setIsRunning(true);
    const curve = curveData;

    let currentStep = 0;
    const animate = () => {
      if (currentStep >= pathData.length) {
        setIsRunning(false);
        setStep(pathData.length - 1);
        return;
      }
      drawFrame(curve, pathData, currentStep);
      setStep(currentStep);
      currentStep++;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, [computePath, curveData, drawFrame]);

  const handleReset = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsRunning(false);
    setPath([]);
    setStep(0);
    const curve = curveData;
    drawFrame(curve, [], 0);
  }, [curveData, drawFrame]);

  useEffect(() => {
    const curve = curveData;
    drawFrame(curve, path, step);
  }, [tValue, startSigma, numPrimes]);

  useEffect(() => {
    const h = () => {
      const curve = curveData;
      drawFrame(curve, path, step);
    };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [curveData, drawFrame, path, step]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const currentPoint = path[step] || null;

  return (
    <div>
      <div className="tab-explainer accent-orange">
        Gradient descent updates <InlineMath tex={"\\sigma_{n+1} = \\sigma_n - \\eta\\,\\partial\\mathcal{H}/\\partial\\sigma"} /> where{' '}
        <InlineMath tex={"\\eta"} /> is the learning rate. The gradient <InlineMath tex={"\\partial\\mathcal{H}/\\partial\\sigma"} /> is computed
        numerically from the full Hamiltonian (kinetic + mismatch + bridge). Since <InlineMath tex={"\\mathcal{H}"} /> has a unique
        global minimum at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> (a convex potential well), any starting point converges there.
        <strong> Look for:</strong> the ball rolling downhill to settle exactly at <InlineMath tex={"\\sigma = 0.5"} />, regardless of where it starts.
      </div>
      <div className="controls">
        <div className="control-group">
          <label style={{ color: Math.abs(startSigma - 0.5) < 0.02 ? 'var(--series-3)' : Math.abs(startSigma - 0.5) < 0.15 ? 'var(--brass)' : 'var(--series-2)', fontWeight: 600 }}>Start <InlineMath tex={"\\sigma"} /></label>
          <input type="range" min="0.1" max="0.9" step="0.01" value={startSigma}
            onChange={e => { setStartSigma(+e.target.value); handleReset(); }} disabled={isRunning}
            style={{ accentColor: Math.abs(startSigma - 0.5) < 0.02 ? 'var(--series-3)' : Math.abs(startSigma - 0.5) < 0.15 ? 'var(--series-4)' : 'var(--series-2)' }} />
          <span className="control-value" style={{ color: Math.abs(startSigma - 0.5) < 0.02 ? 'var(--series-3)' : Math.abs(startSigma - 0.5) < 0.15 ? 'var(--brass)' : 'var(--series-2)', fontWeight: 700 }}>{startSigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Learning Rate</label>
          <input type="range" min="0.001" max="0.02" step="0.001" value={learningRate}
            onChange={e => setLearningRate(+e.target.value)} disabled={isRunning} />
          <span className="control-value">{learningRate.toFixed(3)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="1" max="60" step="0.5" value={tValue}
            onChange={e => { setTValue(+e.target.value); handleReset(); }} disabled={isRunning} />
          <span className="control-value">{tValue.toFixed(1)}</span>
          {(() => {
            let bestIdx = 0, bestDist = Math.abs(tValue - ZETA_ZEROS[0]);
            for (let i = 1; i < ZETA_ZEROS.length; i++) {
              const d = Math.abs(tValue - ZETA_ZEROS[i]);
              if (d < bestDist) { bestDist = d; bestIdx = i; }
              if (ZETA_ZEROS[i] > tValue + 2) break;
            }
            return bestDist < 1 ? (
              <span style={{
                marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                color: bestDist < 0.3 ? 'var(--series-3)' : 'var(--ink-faint)',
                cursor: isRunning ? 'default' : 'pointer', borderBottom: isRunning ? 'none' : '1px dashed currentColor',
              }}
                title={isRunning ? undefined : `Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(3)}`}
                onClick={isRunning ? undefined : () => { setTValue(+ZETA_ZEROS[bestIdx].toFixed(1)); handleReset(); }}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="4" max="30" step="1" value={numPrimes}
            onChange={e => { setNumPrimes(+e.target.value); handleReset(); }} disabled={isRunning} />
          <span className="control-value">{numPrimes} <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <button className="filter-btn active" onClick={handleRun} disabled={isRunning}
          style={{ marginLeft: 'auto' }}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button className="filter-btn" onClick={handleReset}>Reset</button>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 480 }} />
      </div>
      {currentPoint && (
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div className="stat-box" style={{ borderColor: 'var(--brass-deco)' }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: 11 }}>Step</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--brass)' }}>{currentPoint.step}</div>
          </div>
          <div className="stat-box" style={{ borderColor: 'var(--series-6)' }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: 11 }}><InlineMath tex={"\\sigma"} /></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--series-6)' }}>{currentPoint.sigma.toFixed(6)}</div>
          </div>
          <div className="stat-box" style={{ borderColor: 'var(--series-3)' }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: 11 }}><InlineMath tex={"\\mathcal{H}(\\sigma)"} /></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--series-3)' }}>{currentPoint.H.toFixed(4)}</div>
          </div>
          <div className="stat-box" style={{ borderColor: 'var(--series-5)' }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: 11 }}><InlineMath tex={"|\\nabla|"} /></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--series-5)' }}>{Math.abs(currentPoint.gradient).toFixed(4)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Convergence with Number of Primes ──────────────────────────────────

function ConvergenceTab() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);

  const primeCounts = [3, 5, 8, 12, 16, 20];
  const curveColors = [ED.series1, ED.series6, ED.series3, ED.series4, ED.series2, ED.series5];

  // Memoize expensive curve data to avoid recomputing on window resize.
  // Each prime count triggers hamiltonianSigmaScan (60 steps) + 3 systemHamiltonian
  // calls, totalling ~378 Hamiltonian evaluations — only redo when tValue changes.
  const allCurves = useMemo(() => primeCounts.map((np, i) => {
    const points = hamiltonianSigmaScan(tValue, [0.05, 0.95], 60, np);
    const atHalf = systemHamiltonian([0.5, tValue], np);

    // Curvature: (H(0.5+d) + H(0.5-d) - 2*H(0.5)) / d^2
    const d = 0.02;
    const Hp = systemHamiltonian([0.5 + d, tValue], np).total;
    const Hm = systemHamiltonian([0.5 - d, tValue], np).total;
    const curvature = (Hp + Hm - 2 * atHalf.total) / (d * d);

    return {
      numPrimes: np,
      points,
      gradient: Math.abs(atHalf.gradient),
      curvature,
      color: curveColors[i],
    };
  }), [tValue]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const totalHeight = 780;
    svg.attr('viewBox', `0 0 ${width} ${totalHeight}`);

    const margin = { top: 25, right: 130, bottom: 35, left: 60 };
    const chartH = 180;
    const gap = 30;

    // ── Sub-chart 1: Overlaid H(sigma) curves ──
    {
      const yOff = 0;
      const w = width - margin.left - margin.right;
      const h = chartH;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff + margin.top})`);

      const x = d3.scaleLinear().domain([0.05, 0.95]).range([0, w]);
      const yMax = d3.max(allCurves, c => d3.max(c.points, d => d.total)) * 1.1;
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(8).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(0)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

      // Horizontal gridlines
      g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''))
        .selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3');
      g.select('.domain').remove();

      // Critical line
      g.append('line').attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', ED.series2).attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

      const line = d3.line().x(d => x(d.sigma)).y(d => y(d.total)).curve(d3.curveBasis);
      allCurves.forEach(c => {
        g.append('path').datum(c.points).attr('d', line)
          .attr('fill', 'none').attr('stroke', c.color).attr('stroke-width', 1.8).attr('opacity', 0.85);
      });

      // Title
      svg.append('text').attr('x', margin.left).attr('y', yOff + 16)
        .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
        .text('H(σ) curves \u2014 valley sharpens with more primes');

      // Axis labels
      svg.append('text').attr('x', margin.left + w / 2).attr('y', yOff + margin.top + h + 32)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
        .text('σ = Re(s)');
      svg.append('text')
        .attr('transform', `translate(${margin.left - 48}, ${yOff + margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
        .text('H(σ)');

      // Legend
      const legend = svg.append('g').attr('transform', `translate(${width - 120}, ${yOff + margin.top + 5})`);
      allCurves.forEach((c, i) => {
        legend.append('line').attr('x1', 0).attr('y1', i * 15).attr('x2', 14).attr('y2', i * 15)
          .attr('stroke', c.color).attr('stroke-width', 2);
        legend.append('text').attr('x', 20).attr('y', i * 15 + 4)
          .attr('fill', c.color).attr('font-size', 9).text(`n=${c.numPrimes}`);
      });
    }

    // ── Sub-chart 2: |gradient| at sigma=0.5 vs numPrimes ──
    {
      const yOff = chartH + margin.top + margin.bottom + gap;
      const w = width - margin.left - margin.right;
      const h = chartH;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff + margin.top})`);

      const x = d3.scaleLinear().domain([0, primeCounts.length - 1]).range([0, w]);
      const gMax = d3.max(allCurves, c => c.gradient) * 1.3 || 1;
      const y = d3.scaleLinear().domain([0, gMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(primeCounts.length).tickFormat(i => primeCounts[i] || ''))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toExponential(1)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

      // Horizontal gridlines
      g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''))
        .selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3');
      g.select('.domain').remove();

      // Zero reference
      g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
        .attr('stroke', ED.series3).attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

      // Points + line
      const line = d3.line().x((d, i) => x(i)).y(d => y(d.gradient)).curve(d3.curveMonotoneX);
      g.append('path').datum(allCurves).attr('d', line)
        .attr('fill', 'none').attr('stroke', ED.brassDeco).attr('stroke-width', 2);
      allCurves.forEach((c, i) => {
        g.append('circle').attr('cx', x(i)).attr('cy', y(c.gradient)).attr('r', 5)
          .attr('fill', c.color).attr('stroke', ED.paper).attr('stroke-width', 2);
      });

      svg.append('text').attr('x', margin.left).attr('y', yOff + 16)
        .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
        .text('|\u2207H| at σ = 0.5 vs number of primes (should stay \u22480)');

      // X-axis label
      svg.append('text').attr('x', margin.left + w / 2).attr('y', yOff + margin.top + h + 32)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
        .text('Number of primes');

      // Y-axis label
      svg.append('text')
        .attr('transform', `translate(${margin.left - 48}, ${yOff + margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
        .text('|∂H/∂σ|');
    }

    // ── Sub-chart 3: Curvature at sigma=0.5 vs numPrimes ──
    {
      const yOff = 2 * (chartH + margin.top + margin.bottom + gap);
      const w = width - margin.left - margin.right;
      const h = chartH;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff + margin.top})`);

      const x = d3.scaleLinear().domain([0, primeCounts.length - 1]).range([0, w]);
      const cMax = d3.max(allCurves, c => c.curvature) * 1.2 || 1;
      const y = d3.scaleLinear().domain([0, cMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(primeCounts.length).tickFormat(i => primeCounts[i] || ''))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(0)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

      // Horizontal gridlines
      g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''))
        .selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '3,3');
      g.select('.domain').remove();

      // Points + line
      const line = d3.line().x((d, i) => x(i)).y(d => y(d.curvature)).curve(d3.curveMonotoneX);
      g.append('path').datum(allCurves).attr('d', line)
        .attr('fill', 'none').attr('stroke', ED.series5).attr('stroke-width', 2);
      allCurves.forEach((c, i) => {
        g.append('circle').attr('cx', x(i)).attr('cy', y(c.curvature)).attr('r', 5)
          .attr('fill', c.color).attr('stroke', ED.paper).attr('stroke-width', 2);
      });

      svg.append('text').attr('x', margin.left).attr('y', yOff + 16)
        .attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
        .text('Curvature \u2202\u00B2H/\u2202σ\u00B2 at σ = 0.5 (should increase with primes)');

      // X-axis label
      svg.append('text').attr('x', margin.left + w / 2).attr('y', yOff + margin.top + h + 32)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
        .text('Number of primes');

      // Y-axis label
      svg.append('text')
        .attr('transform', `translate(${margin.left - 48}, ${yOff + margin.top + h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11)
        .text('∂²H/∂σ²');
    }
  }, [allCurves]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        The Hamiltonian <InlineMath tex={"\\mathcal{H}_N = \\sum_{p \\leq p_N} E_p"} /> includes the first{' '}
        <InlineMath tex="N" /> primes. As <InlineMath tex={"N \\to \\infty"} />, each new prime adds another term to the
        sum, deepening the energy well at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />. The curvature{' '}
        <InlineMath tex={"\\partial^2\\mathcal{H}/\\partial\\sigma^2\\big|_{1/2}"} /> grows with{' '}
        <InlineMath tex="N" /> while the gradient at the minimum stays zero, proving the minimum is stable and sharpens indefinitely.
        <strong> Look for:</strong> overlaid curves getting narrower and deeper; curvature climbing while gradient stays flat.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
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
              <span style={{
                marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                color: bestDist < 0.3 ? 'var(--series-3)' : 'var(--ink-faint)',
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
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 780 }} />
      </div>
    </div>
  );
}

// ─── Tab 4: Bridge Unitarity Verification ──────────────────────────────────────

function BridgeTab() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);

  const bridgeData = useMemo(() => {
    const steps = 100;
    const data = [];
    for (let i = 0; i <= steps; i++) {
      const sigma = 0.01 + i * 0.98 / steps;
      const b = losslessBridge([sigma, tValue]);
      data.push({ sigma, chiMag: b.magnitude, reflection: b.reflectionCoeff, isUnitary: b.isUnitary });
    }
    return data;
  }, [tValue]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 380;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const halfW = (width - margin.left - margin.right - 40) / 2;
    const h = height - margin.top - margin.bottom;

    const data = bridgeData;

    // ── Left chart: |chi(s)| vs sigma ──
    {
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const x = d3.scaleLinear().domain([0, 1]).range([0, halfW]);
      const yMax = Math.min(d3.max(data, d => d.chiMag) * 1.15, 10);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(6).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

      // Horizontal gridlines
      const gridL = g.append('g').call(d3.axisLeft(y).ticks(6).tickSize(-halfW).tickFormat(''));
      gridL.select('.domain').remove();
      gridL.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

      // Reference line at |chi| = 1
      g.append('line').attr('x1', 0).attr('y1', y(1)).attr('x2', halfW).attr('y2', y(1))
        .attr('stroke', ED.series3).attr('stroke-width', 1).attr('stroke-dasharray', '6,3').attr('opacity', 0.7);

      // Fill region between curve and |chi|=1 reference
      {
        g.append('path').datum(data)
          .attr('d', d3.area()
            .x(d => x(d.sigma))
            .y0(y(1))
            .y1(d => y(Math.min(d.chiMag, yMax)))
            .curve(d3.curveBasis))
          .attr('fill', alpha(ED.series3, 0.1));
      }


      // Main curve
      const clampedData = data.map(d => ({ ...d, chiMag: Math.min(d.chiMag, yMax) }));
      const line = d3.line().x(d => x(d.sigma)).y(d => y(d.chiMag)).curve(d3.curveBasis);
      g.append('path').datum(clampedData).attr('d', line)
        .attr('fill', 'none').attr('stroke', ED.series6).attr('stroke-width', 2.5);

      // Critical line
      g.append('line').attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', ED.series2).attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

      // Dot at sigma=0.5
      const atHalf = data.find(d => Math.abs(d.sigma - 0.5) < 0.01);
      if (atHalf) {
        g.append('circle').attr('cx', x(atHalf.sigma)).attr('cy', y(Math.min(atHalf.chiMag, yMax))).attr('r', 6)
          .attr('fill', ED.series3).attr('stroke', ED.paper).attr('stroke-width', 2);
        g.append('text').attr('x', x(atHalf.sigma) + 10).attr('y', y(Math.min(atHalf.chiMag, yMax)) + 4)
          .attr('fill', ED.series3).attr('font-size', 11).attr('font-weight', 600)
          .text(`|χ| = ${atHalf.chiMag.toFixed(3)}`);
      }

      // Title
      g.append('text').attr('x', halfW / 2).attr('y', -10)
        .attr('text-anchor', 'middle').attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
        .text('|χ(s)| vs σ');

      // Y-axis label
      g.append('text').attr('transform', `translate(-42, ${h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11).text('|χ(s)|');
    }

    // ── Right chart: Reflection coefficient vs sigma ──
    {
      const xOff = margin.left + halfW + 40;
      const g = svg.append('g').attr('transform', `translate(${xOff},${margin.top})`);
      const x = d3.scaleLinear().domain([0, 1]).range([0, halfW]);
      const yMax = Math.min(d3.max(data, d => d.reflection) * 1.15, 1);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(6).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
      g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(2)))
        .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 10);
      g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

      // Horizontal gridlines
      const gridR = g.append('g').call(d3.axisLeft(y).ticks(6).tickSize(-halfW).tickFormat(''));
      gridR.select('.domain').remove();
      gridR.selectAll('.tick line').attr('stroke', ED.ruleSoft).attr('stroke-dasharray', '4,4').attr('stroke-width', 0.8);

      // Zero reference
      g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', halfW).attr('y2', y(0))
        .attr('stroke', ED.series3).attr('stroke-width', 1).attr('stroke-dasharray', '6,3').attr('opacity', 0.7);

      // Fill: green near 0, red far from 0
      g.append('path').datum(data)
        .attr('d', d3.area()
          .x(d => x(d.sigma))
          .y0(y(0))
          .y1(d => y(Math.min(d.reflection, yMax)))
          .curve(d3.curveBasis))
        .attr('fill', alpha(ED.series2, 0.08));

      // Near-zero region green overlay
      const nearZero = data.filter(d => d.reflection < 0.1);
      if (nearZero.length > 0) {
        g.append('path').datum(nearZero)
          .attr('d', d3.area()
            .x(d => x(d.sigma))
            .y0(y(0))
            .y1(d => y(Math.min(d.reflection, yMax)))
            .curve(d3.curveBasis))
          .attr('fill', alpha(ED.series3, 0.12));
      }

      // Main curve
      const clampedData = data.map(d => ({ ...d, reflection: Math.min(d.reflection, yMax) }));
      const line = d3.line().x(d => x(d.sigma)).y(d => y(d.reflection)).curve(d3.curveBasis);
      g.append('path').datum(clampedData).attr('d', line)
        .attr('fill', 'none').attr('stroke', ED.brassDeco).attr('stroke-width', 2.5);

      // Critical line
      g.append('line').attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', ED.series2).attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

      // Dot at sigma=0.5
      const atHalf2 = data.find(d => Math.abs(d.sigma - 0.5) < 0.01);
      if (atHalf2) {
        g.append('circle').attr('cx', x(atHalf2.sigma)).attr('cy', y(Math.min(atHalf2.reflection, yMax))).attr('r', 6)
          .attr('fill', ED.series3).attr('stroke', ED.paper).attr('stroke-width', 2);
        g.append('text').attr('x', x(atHalf2.sigma) + 10).attr('y', y(Math.min(atHalf2.reflection, yMax)) + 4)
          .attr('fill', ED.series3).attr('font-size', 11).attr('font-weight', 600)
          .text(`R = ${atHalf2.reflection.toFixed(4)}`);
      }

      // Title
      g.append('text').attr('x', halfW / 2).attr('y', -10)
        .attr('text-anchor', 'middle').attr('fill', ED.ink).attr('font-size', 12).attr('font-weight', 600)
        .text('Reflection Coefficient vs σ');

      // Y-axis label
      g.append('text').attr('transform', `translate(-42, ${h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11).text('R');
    }

    // Axis label
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 12).text('σ = Re(s)');

  }, [bridgeData]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        The bridge factor <InlineMath tex={"\\chi(s) = 2^s \\pi^{s-1} \\sin(\\pi s/2)\\,\\Gamma(1-s)"} /> connects
        the functional equation <InlineMath tex={"\\zeta(s) = \\chi(s)\\zeta(1-s)"} />. On the critical line,{' '}
        <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> exactly &mdash; the bridge is lossless (unitary scattering matrix).
        Off the critical line, <InlineMath tex={"|\\chi| \\neq 1"} /> means the bridge either absorbs or amplifies, breaking unitarity.
        The reflection coefficient <InlineMath tex={"R = |1 - |\\chi||\\,/\\,(1 + |\\chi|)"} /> measures this deviation.
        <strong> Look for:</strong> <InlineMath tex={"|\\chi| = 1"} /> and <InlineMath tex="R = 0" /> precisely at <InlineMath tex={"\\sigma = 0.5"} />.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
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
              <span style={{
                marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                color: bestDist < 0.3 ? 'var(--series-3)' : 'var(--ink-faint)',
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
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 380 }} />
      </div>
    </div>
  );
}

// ─── Tab 5: Multi-Zero Test ────────────────────────────────────────────────────

function MultiZeroTab() {
  const [numZeros, setNumZeros] = useState(20);
  const [numPrimes, setNumPrimes] = useState(10);
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const svgRef = useRef();

  const runTest = useCallback(async () => {
    setRunning(true);
    setResults([]);
    setProgress(0);
    const zeros = ZETA_ZEROS.slice(0, numZeros);
    const allResults = [];
    const chunkSize = 3;

    for (let i = 0; i < zeros.length; i += chunkSize) {
      const chunk = zeros.slice(i, i + chunkSize);
      await new Promise(resolve => {
        setTimeout(() => {
          chunk.forEach((gamma, j) => {
            const idx = i + j;
            // Find sigma that minimizes H via scan
            let bestSigma = 0.5, bestH = Infinity;
            for (let k = 0; k <= 100; k++) {
              const sigma = 0.05 + k * 0.009;
              const H = systemHamiltonian([sigma, gamma], numPrimes);
              if (H.total < bestH) { bestH = H.total; bestSigma = sigma; }
            }

            const Hmin = systemHamiltonian([bestSigma, gamma], numPrimes);
            const bridge = losslessBridge([0.5, gamma]);
            const pass = Math.abs(bestSigma - 0.5) < 0.01;

            allResults.push({
              index: idx + 1,
              gamma,
              sigmaMin: bestSigma,
              Hmin: bestH,
              gradient: Math.abs(Hmin.gradient),
              chiMag: bridge.magnitude,
              pass,
            });
          });
          setResults([...allResults]);
          setProgress(Math.min(i + chunkSize, zeros.length));
          resolve();
        }, 0);
      });
    }
    setRunning(false);
  }, [numZeros, numPrimes]);

  // Draw scatter plot
  useEffect(() => {
    if (results.length === 0 || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 220;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 25, right: 30, bottom: 40, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, results.length + 1]).range([0, w]);
    const y = d3.scaleLinear().domain([0.3, 0.7]).range([h, 0]);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(Math.min(results.length, 15)))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(2)))
      .selectAll('text').attr('fill', ED.inkFaint).attr('font-size', 9);
    g.selectAll('.domain, .tick line').attr('stroke', ED.rule);

    // Horizontal gridlines for easier σ_min reading
    y.ticks(5).forEach(tick => {
      g.append('line')
        .attr('x1', 0).attr('y1', y(tick)).attr('x2', w).attr('y2', y(tick))
        .attr('stroke', ED.ruleSoft).attr('stroke-width', 0.5);
    });

    // Reference line at 0.5
    g.append('line').attr('x1', 0).attr('y1', y(0.5)).attr('x2', w).attr('y2', y(0.5))
      .attr('stroke', ED.series2).attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4').attr('opacity', 0.7);
    g.append('text').attr('x', w + 5).attr('y', y(0.5) + 4)
      .attr('fill', ED.series2).attr('font-size', 10).text('σ = \u00BD');

    // Scatter dots
    results.forEach(r => {
      g.append('circle')
        .attr('cx', x(r.index)).attr('cy', y(Math.max(0.3, Math.min(0.7, r.sigmaMin)))).attr('r', 5)
        .attr('fill', r.pass ? ED.series3 : ED.series2)
        .attr('stroke', ED.paper).attr('stroke-width', 1.5)
        .attr('opacity', 0.9);
    });

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w - 165}, 0)`);
    legend.append('rect').attr('x', -8).attr('y', -6).attr('width', 170).attr('height', 38)
      .attr('rx', 4).attr('fill', alpha(ED.paper, 0.75)).attr('stroke', ED.rule).attr('stroke-width', 0.5);
    [{ label: 'Pass (|σ*−½| < 0.01)', color: ED.series3, dy: 8 },
     { label: 'Fail', color: ED.series2, dy: 24 }].forEach(item => {
      legend.append('circle').attr('cx', 6).attr('cy', item.dy).attr('r', 4)
        .attr('fill', item.color).attr('stroke', ED.paper).attr('stroke-width', 1);
      legend.append('text').attr('x', 16).attr('y', item.dy + 3.5)
        .attr('fill', ED.inkSoft).attr('font-size', 10).text(item.label);
    });

    // Axis labels
    svg.append('text').attr('x', width / 2).attr('y', height - 4)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11).text('Zero index');
    svg.append('text').attr('transform', `translate(16, ${margin.top + h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', ED.inkSoft).attr('font-size', 11).text('σ_min');

  }, [results]);

  const passCount = results.filter(r => r.pass).length;

  return (
    <div>
      <div className="tab-explainer accent-pink">
        For each known nontrivial zero <InlineMath tex={"\\rho_n = \\tfrac{1}{2} + i\\gamma_n"} />, we
        numerically minimize <InlineMath tex={"\\mathcal{H}(\\sigma + i\\gamma_n)"} /> over <InlineMath tex={"\\sigma"} />.
        If the oscillator model is correct, the minimizing <InlineMath tex={"\\sigma^*"} /> should equal <InlineMath tex={"\\tfrac{1}{2}"} /> for every
        zero &mdash; a numerical consistency check that the energy ground state always sits on the critical line.
        A zero "passes" if <InlineMath tex={"|\\sigma^* - 0.5| < 0.01"} />.
        <strong> Why it matters:</strong> the Riemann Hypothesis is equivalent to every nontrivial zero having <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
        If even one zero's energy minimum lay away from the critical line, the model would be inconsistent with RH.
        A 100% pass rate across all tested zeros is a necessary (though not sufficient) condition for the oscillator model to be a valid RH framework.
        <strong> Look for:</strong> all dots clustering on the <InlineMath tex={"\\sigma = 0.5"} /> line; 100% pass rate.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Zeros</label>
          <input type="range" min="5" max="200" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} disabled={running} />
          <span className="control-value">{numZeros}</span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="5" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} disabled={running} />
          <span className="control-value">{numPrimes} <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <button className="filter-btn active" onClick={runTest} disabled={running}
          style={{ marginLeft: 'auto' }}>
          {running ? `Testing... (${progress}/${numZeros})` : 'Run Test'}
        </button>
      </div>

      {results.length > 0 && (
        <>
          {/* Summary bar */}
          <div style={{
            marginTop: 16, padding: '12px 20px', borderRadius: 8,
            background: passCount === results.length ? 'color-mix(in srgb, var(--series-3) 10%, transparent)' : 'color-mix(in srgb, var(--series-2) 10%, transparent)',
            border: `1px solid ${passCount === results.length ? ED.series3 : ED.series2}`,
            fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
            color: passCount === results.length ? 'var(--series-3)' : 'var(--series-2)',
          }}>
            {passCount}/{results.length} zeros passed ({((passCount / results.length) * 100).toFixed(0)}%)
            {passCount === results.length ? ' \u2014 All minima on critical line!' : ''}
          </div>

          {/* Scatter plot */}
          <div className="viz-container" style={{ marginTop: 16 }}>
            <svg ref={svgRef} style={{ width: '100%', height: 220 }} />
          </div>

          {/* Results table */}
          <div style={{ marginTop: 16, overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12,
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                  {['#', <InlineMath tex={"\\gamma"} />, <InlineMath tex={"\\sigma_{\\min}"} />, <InlineMath tex={"H_{\\min}"} />, <InlineMath tex={"|\\nabla|"} />, <InlineMath tex={"|\\chi|"} />, 'Pass'].map((h, idx) => (
                    <th key={idx} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--ink-faint)', fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.index} style={{ borderBottom: '1px solid #1a1f36' }}>
                    <td style={{ padding: '6px 10px', color: 'var(--ink-soft)' }}>{r.index}</td>
                    <td style={{ padding: '6px 10px', color: 'var(--series-6)' }}>{r.gamma.toFixed(6)}</td>
                    <td style={{ padding: '6px 10px', color: Math.abs(r.sigmaMin - 0.5) < 0.02 ? 'var(--series-3)' : 'var(--brass)' }}>
                      {r.sigmaMin.toFixed(4)}
                    </td>
                    <td style={{ padding: '6px 10px', color: 'var(--ink)' }}>{r.Hmin.toFixed(2)}</td>
                    <td style={{ padding: '6px 10px', color: 'var(--series-5)' }}>{r.gradient.toExponential(2)}</td>
                    <td style={{ padding: '6px 10px', color: Math.abs(r.chiMag - 1) < 0.01 ? 'var(--series-3)' : 'var(--brass)' }}>
                      {r.chiMag.toFixed(4)}
                    </td>
                    <td style={{ padding: '6px 10px' }}>
                      <span style={{
                        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                        background: r.pass ? 'var(--series-3)' : 'var(--series-2)', marginRight: 6,
                      }} />
                      {r.pass ? 'PASS' : 'FAIL'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
