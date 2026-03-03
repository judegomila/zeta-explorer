import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import {
  zetaMagnitudeScan,
  thermodynamicScan,
  heatFlowZeros,
  heatFlowScan,
  eulerProductPhaseAnalysis,
} from '../math/supercritical.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import { InlineMath } from './KaTeXMath.jsx';

const TABS = [
  { id: 'landscape', label: 'Extended Landscape' },
  { id: 'thermo', label: 'Thermodynamics' },
  { id: 'heat', label: 'Heat Flow' },
  { id: 'euler-phase', label: 'Euler Product Phase' },
];

export default function SupercriticalViz() {
  const [activeTab, setActiveTab] = useState('landscape');

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
        {activeTab === 'landscape' && <ExtendedLandscapeTab />}
        {activeTab === 'thermo' && <ThermodynamicsTab />}
        {activeTab === 'heat' && <HeatFlowTab />}
        {activeTab === 'euler-phase' && <EulerPhaseTab />}
      </div>
    </div>
  );
}

// ─── Tab 1: Extended Zeta Landscape ────────────────────────────────────────────

function ExtendedLandscapeTab() {
  const canvasRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [sigmaMin, setSigmaMin] = useState(-3);
  const [sigmaMax, setSigmaMax] = useState(5);

  const scan = useMemo(() => zetaMagnitudeScan(tValue, [sigmaMin, sigmaMax], 300), [tValue, sigmaMin, sigmaMax]);

  const draw = useCallback(() => {
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

    const pad = { l: 65, r: 30, t: 30, b: 50 };
    const chartW = W - pad.l - pad.r;
    const topH = H * 0.5 - pad.t;
    const botH = H * 0.4;
    const botY = H * 0.55;

    // ── Top: |ζ(σ+it)| scan ──
    const xScale = s => pad.l + (s - sigmaMin) / (sigmaMax - sigmaMin) * chartW;
    const logMags = scan.map(d => d.logMagnitude);
    const yMin = Math.max(d3.min(logMags), -5);
    const yMax = Math.min(d3.max(logMags), 10);
    const yScale = v => pad.t + topH - (v - yMin) / (yMax - yMin) * topH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let s = Math.ceil(sigmaMin); s <= sigmaMax; s++) {
      ctx.beginPath(); ctx.moveTo(xScale(s), pad.t); ctx.lineTo(xScale(s), pad.t + topH); ctx.stroke();
    }

    // Phase regions
    // Sub-zero: σ < 0 (blue tint)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.fillRect(xScale(sigmaMin), pad.t, xScale(0) - xScale(sigmaMin), topH);
    // Critical strip: 0 < σ < 1 (purple tint)
    ctx.fillStyle = 'rgba(139, 92, 246, 0.08)';
    if (sigmaMin < 1 && sigmaMax > 0) {
      ctx.fillRect(xScale(Math.max(0, sigmaMin)), pad.t,
        xScale(Math.min(1, sigmaMax)) - xScale(Math.max(0, sigmaMin)), topH);
    }
    // Supercritical: σ > 1 (green tint)
    if (sigmaMax > 1) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fillRect(xScale(Math.max(1, sigmaMin)), pad.t,
        xScale(sigmaMax) - xScale(Math.max(1, sigmaMin)), topH);
    }

    // Phase boundary at σ=1
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    if (sigmaMin < 1 && sigmaMax > 1) {
      ctx.beginPath(); ctx.moveTo(xScale(1), pad.t); ctx.lineTo(xScale(1), pad.t + topH); ctx.stroke();
    }

    // Critical line at σ=0.5
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    if (sigmaMin < 0.5 && sigmaMax > 0.5) {
      ctx.beginPath(); ctx.moveTo(xScale(0.5), pad.t); ctx.lineTo(xScale(0.5), pad.t + topH); ctx.stroke();
    }
    ctx.setLineDash([]);

    // log|ζ| curve
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    scan.forEach((d, i) => {
      const px = xScale(d.sigma);
      const py = yScale(Math.max(yMin, Math.min(yMax, d.logMagnitude)));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // 0 reference
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(pad.l, yScale(0)); ctx.lineTo(pad.l + chartW, yScale(0)); ctx.stroke();
    ctx.setLineDash([]);

    // Trivial zeros markers
    for (let n = -2; n >= sigmaMin; n -= 2) {
      if (n < sigmaMin) break;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(xScale(n), yScale(yMin), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`s=${n}`, xScale(n), yScale(yMin) + 14);
    }

    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('log\u2081\u2080|ζ(σ+it)|', pad.l + chartW / 2, 18);

    // Region labels
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
    if (sigmaMin < -1) ctx.fillText('Reflected Region', xScale((sigmaMin + Math.min(0, sigmaMax)) / 2), pad.t + 16);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
    if (sigmaMin < 1 && sigmaMax > 0) ctx.fillText('Critical Strip', xScale(0.5), pad.t + 16);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
    if (sigmaMax > 1.5) ctx.fillText('Supercritical', xScale(Math.max(1.5, (1 + sigmaMax) / 2)), pad.t + 16);

    // Axis ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let s = Math.ceil(sigmaMin); s <= sigmaMax; s++) {
      ctx.fillText(s.toString(), xScale(s), pad.t + topH + 15);
    }

    // ── Bottom: Phase (argument) ──
    const phaseScale = v => botY + botH / 2 - (v / Math.PI) * (botH / 2);

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    scan.forEach((d, i) => {
      const px = xScale(d.sigma);
      const py = phaseScale(d.phase);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Phase zero line
    ctx.strokeStyle = '#2a3050';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(pad.l, phaseScale(0)); ctx.lineTo(pad.l + chartW, phaseScale(0)); ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('arg ζ(σ+it)', pad.l + chartW / 2, botY - 8);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('σ = Re(s)', W / 2, H - 8);

  }, [scan, sigmaMin, sigmaMax]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer">
        <strong>The math:</strong> The Riemann zeta function <InlineMath tex="\\zeta(s) = \\sum n^{-s}" /> converges only for{' '}
        <InlineMath tex="\\sigma > 1" /> (the "supercritical" or gas phase). We extend it everywhere via analytic continuation:
        in the critical strip <InlineMath tex="0 < \\sigma < 1" /> using the Dirichlet eta function{' '}
        <InlineMath tex="\\eta(s) = (1-2^{1-s})\\zeta(s)" />, and for <InlineMath tex="\\sigma < 0" /> via the functional equation{' '}
        <InlineMath tex="\\zeta(s) = \\chi(s)\\zeta(1-s)" />. The top panel shows <InlineMath tex="\\log|\\zeta|" /> as a 1D slice;
        the bottom shows <InlineMath tex="\\arg\\zeta" /> — the phase (argument) — across the same <InlineMath tex="\\sigma" /> range.
        <strong> Look for:</strong> the Bost-Connes boundary at <InlineMath tex="\\sigma = 1" /> where the Euler product transitions from convergent to divergent,
        and the trivial zeros at negative even integers.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
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
                color: bestDist < 0.3 ? '#10b981' : '#64748b',
              }}>
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label><InlineMath tex="\sigma" /> min</label>
          <input type="range" min="-8" max="0" step="0.5" value={sigmaMin}
            onChange={e => setSigmaMin(+e.target.value)} />
          <span className="control-value">{sigmaMin}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="\sigma" /> max</label>
          <input type="range" min="2" max="10" step="0.5" value={sigmaMax}
            onChange={e => setSigmaMax(+e.target.value)} />
          <span className="control-value">{sigmaMax}</span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 480 }} />
      </div>
    </div>
  );
}

// ─── Tab 2: Thermodynamics ─────────────────────────────────────────────────────

function ThermodynamicsTab() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(12);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const totalHeight = 800;
    svg.attr('viewBox', `0 0 ${width} ${totalHeight}`);

    const data = thermodynamicScan(tValue, [-1, 3], 120, numPrimes);

    const margin = { top: 22, right: 30, bottom: 30, left: 65 };
    const chartH = 130;
    const gap = 22;

    const quantities = [
      { key: 'freeEnergy', label: 'Free Energy F = -T\u00B7log|ζ|', color: '#3b82f6' },
      { key: 'entropy', label: 'Entropy S = -\u2202F/\u2202T', color: '#10b981' },
      { key: 'pressure', label: 'Pressure P (Euler product density)', color: '#f59e0b' },
      { key: 'specificHeat', label: 'Specific Heat C_v', color: '#ef4444' },
    ];

    quantities.forEach((q, qi) => {
      const yOff = qi * (chartH + margin.top + margin.bottom + gap);
      const w = width - margin.left - margin.right;
      const h = chartH;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff + margin.top})`);

      const x = d3.scaleLinear().domain([-1, 3]).range([0, w]);
      const vals = data.map(d => d[q.key]).filter(v => isFinite(v) && Math.abs(v) < 1e6);
      if (vals.length === 0) return;
      const yExtent = d3.extent(vals);
      const padding = (yExtent[1] - yExtent[0]) * 0.15 || 1;
      const y = d3.scaleLinear().domain([yExtent[0] - padding, yExtent[1] + padding]).range([h, 0]);

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(8).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 8);
      g.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(d => {
        if (Math.abs(d) > 1000) return d.toExponential(0);
        return d.toFixed(1);
      })).selectAll('text').attr('fill', '#64748b').attr('font-size', 8);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Horizontal gridlines
      const gridG = g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''));
      gridG.selectAll('.tick line').attr('stroke', '#1e293b').attr('stroke-dasharray', '4,4');
      gridG.select('.domain').remove();

      // Phase regions
      g.append('rect').attr('x', x(-1)).attr('y', 0)
        .attr('width', x(0) - x(-1)).attr('height', h).attr('fill', 'rgba(59,130,246,0.03)');
      g.append('rect').attr('x', x(0)).attr('y', 0)
        .attr('width', x(1) - x(0)).attr('height', h).attr('fill', 'rgba(139,92,246,0.05)');
      g.append('rect').attr('x', x(1)).attr('y', 0)
        .attr('width', x(3) - x(1)).attr('height', h).attr('fill', 'rgba(16,185,129,0.03)');

      // Critical line
      g.append('line').attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', h)
        .attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.5);
      // Phase boundary at σ=1
      g.append('line').attr('x1', x(1)).attr('y1', 0).attr('x2', x(1)).attr('y2', h)
        .attr('stroke', '#f59e0b').attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

      // Plot curve
      const filtered = data.filter(d => isFinite(d[q.key]) && Math.abs(d[q.key]) < 1e6);
      g.append('path').datum(filtered)
        .attr('d', d3.line()
          .x(d => x(d.sigma))
          .y(d => y(Math.max(yExtent[0] - padding, Math.min(yExtent[1] + padding, d[q.key]))))
          .curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', q.color).attr('stroke-width', 2);

      // Title
      svg.append('text').attr('x', margin.left).attr('y', yOff + 14)
        .attr('fill', q.color).attr('font-size', 11).attr('font-weight', 600).text(q.label);
    });

  }, [tValue, numPrimes]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        <strong>The math:</strong> In the primon gas (Julia 1990), each prime <InlineMath tex="p" /> is a quantum with energy{' '}
        <InlineMath tex="\\log p" />, and <InlineMath tex="\\sigma" /> acts as inverse temperature <InlineMath tex="\\beta" />.
        The partition function is <InlineMath tex="Z(\\beta) = \\zeta(\\beta)" />, giving free energy{' '}
        <InlineMath tex="F = -T\\log\\zeta(\\beta)" />, entropy <InlineMath tex="S = -\\partial F/\\partial T" />, and pressure{' '}
        <InlineMath tex="P = \\tfrac{1}{N}\\sum_p \\log|1/(1-p^{-s})|" /> (average log-contribution per prime oscillator).
        At <InlineMath tex="\\sigma = 1" /> (Bost-Connes transition), the partition function diverges &mdash; a phase transition from
        the ordered "condensed" phase to the disordered "gas" phase.
        <strong> Look for:</strong> divergences at <InlineMath tex="\\sigma = 1" />; entropy changing sign; specific heat peak at the transition.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
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
                color: bestDist < 0.3 ? '#10b981' : '#64748b',
              }}>
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="5" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 800 }} />
      </div>
    </div>
  );
}

// ─── Tab 3: Heat Flow (de Bruijn-Newman) ───────────────────────────────────────

function HeatFlowTab() {
  const svgRef = useRef();
  const [tau, setTau] = useState(0);
  const [numZeros, setNumZeros] = useState(25);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 500;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 65 };
    const w = width - margin.left - margin.right;
    const topH = 200;
    const botH = 200;
    const gap = 40;

    // ── Top: Zero positions under heat flow ──
    {
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const evolved = heatFlowZeros(tau, numZeros);

      const xMax = evolved.length > 0 ? Math.max(155, d3.max(evolved, d => d.gamma) * 1.1) : 155;
      const x = d3.scaleLinear().domain([0, xMax]).range([0, w]);
      const y = d3.scaleLinear().domain([0.3, 0.7]).range([topH, 0]);

      g.append('g').attr('transform', `translate(0,${topH})`).call(d3.axisBottom(x).ticks(10))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(2)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Critical line
      g.append('line').attr('x1', 0).attr('y1', y(0.5)).attr('x2', w).attr('y2', y(0.5))
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4').attr('opacity', 0.7);

      // Draw original positions (faded)
      evolved.forEach(z => {
        g.append('circle')
          .attr('cx', x(z.gamma0)).attr('cy', y(0.5)).attr('r', 3)
          .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-width', 1).attr('opacity', 0.3);
      });

      // Draw evolved positions
      evolved.forEach(z => {
        const clampedSigma = Math.max(0.3, Math.min(0.7, z.sigma));
        const clampedGamma = Math.max(0, Math.min(xMax, z.gamma));
        g.append('circle')
          .attr('cx', x(clampedGamma)).attr('cy', y(clampedSigma)).attr('r', 5)
          .attr('fill', tau === 0 ? '#10b981' : tau < 0 ? '#f59e0b' : '#3b82f6')
          .attr('stroke', '#0a0e1a').attr('stroke-width', 1.5);

        // Arrows from original to evolved
        if (Math.abs(tau) > 0.01) {
          g.append('line')
            .attr('x1', x(z.gamma0)).attr('y1', y(0.5))
            .attr('x2', x(clampedGamma)).attr('y2', y(clampedSigma))
            .attr('stroke', tau < 0 ? '#f59e0b' : '#3b82f6')
            .attr('stroke-width', 0.8).attr('opacity', 0.4);
        }
      });

      svg.append('text').attr('x', margin.left).attr('y', 18)
        .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
        .text(`Zero Positions under Heat Flow (τ = ${tau.toFixed(2)})`);

      svg.append('text').attr('x', width / 2).attr('y', margin.top + topH + 35)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 11).text('γ (imaginary part)');

      svg.append('text')
        .attr('transform', `translate(18, ${margin.top + topH / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 11)
        .text('σ = Re(ρ)');
    }

    // ── Bottom: |H_τ(t)| ──
    {
      const yOff = margin.top + topH + gap + 15;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff})`);

      const scanData = heatFlowScan(tau, [10, 50], 100);
      const x = d3.scaleLinear().domain([10, 50]).range([0, w]);
      const yMax = d3.max(scanData, d => Math.abs(d.value)) * 1.1 || 1;
      const y = d3.scaleLinear().domain([-yMax, yMax]).range([botH, 0]);

      g.append('g').attr('transform', `translate(0,${botH})`).call(d3.axisBottom(x).ticks(8))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Zero baseline
      g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
        .attr('stroke', '#475569').attr('stroke-width', 0.5).attr('stroke-dasharray', '4,3');

      // Fill
      g.append('path').datum(scanData)
        .attr('d', d3.area().x(d => x(d.t)).y0(y(0)).y1(d => y(d.value)).curve(d3.curveBasis))
        .attr('fill', tau === 0 ? 'rgba(16,185,129,0.1)' : tau < 0 ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)');

      // Curve
      g.append('path').datum(scanData)
        .attr('d', d3.line().x(d => x(d.t)).y(d => y(d.value)).curve(d3.curveBasis))
        .attr('fill', 'none')
        .attr('stroke', tau === 0 ? '#10b981' : tau < 0 ? '#f59e0b' : '#3b82f6')
        .attr('stroke-width', 2);

      // Zero locations
      ZETA_ZEROS.filter(z => z >= 10 && z <= 50).forEach(gamma => {
        g.append('line').attr('x1', x(gamma)).attr('y1', 0).attr('x2', x(gamma)).attr('y2', botH)
          .attr('stroke', '#ef4444').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,2').attr('opacity', 0.4);
      });

      svg.append('text').attr('x', margin.left).attr('y', yOff - 8)
        .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
        .text('Heat-Evolved Xi: Hτ(t)');

      svg.append('text').attr('x', width / 2).attr('y', yOff + botH + 35)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 11).text('t');

      svg.append('text')
        .attr('transform', `translate(18, ${yOff + botH / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 11)
        .text('Hτ(t)');
    }

  }, [tau, numZeros]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        <strong>The math:</strong> The Xi function <InlineMath tex="\\Xi(t)" /> satisfies the heat equation{' '}
        <InlineMath tex="\\partial H_\\tau/\\partial\\tau = \\partial^2 H_\\tau/\\partial t^2" />.
        Forward heat flow (<InlineMath tex="\\tau > 0" />) smooths the function, keeping all zeros real.
        Backward flow (<InlineMath tex="\\tau < 0" />) is inverse diffusion &mdash; zeros scatter off the real axis.
        The de Bruijn-Newman constant <InlineMath tex="\\Lambda" /> is the infimum of{' '}
        <InlineMath tex="\\tau" /> such that <InlineMath tex="H_\\tau" /> has only real zeros.
        Rodgers-Tao (2020) proved <InlineMath tex="\\Lambda \\geq 0" />: the zeros are exactly at the threshold &mdash; any
        backward flow (<InlineMath tex="\\tau < 0" />) can destroy RH, while forward flow preserves it.
        <strong> Look for:</strong> zeros aligned at <InlineMath tex="\\tau = 0" /> then scattering as <InlineMath tex="\\tau" /> goes negative.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="\tau" /> (heat parameter)</label>
          <input type="range" min="-0.5" max="0.5" step="0.01" value={tau}
            onChange={e => setTau(+e.target.value)} />
          <span className="control-value" style={{
            color: tau === 0 ? '#10b981' : tau < 0 ? '#f59e0b' : '#3b82f6'
          }}>{tau.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Zeros</label>
          <input type="range" min="10" max="200" step="1" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
          <span style={{ marginLeft: 6, fontSize: 11, color: '#64748b' }}>
            (γ_max ≈ {ZETA_ZEROS[Math.min(numZeros, ZETA_ZEROS.length) - 1]?.toFixed(1) ?? '?'})
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: tau < 0 ? '#f59e0b' : '#64748b' }}>Scatter</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#64748b' }}>|</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: tau === 0 ? '#10b981' : '#64748b' }}>RH</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#64748b' }}>|</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: tau > 0 ? '#3b82f6' : '#64748b' }}>Smooth</span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 500 }} />
      </div>
    </div>
  );
}

// ─── Tab 4: Euler Product Phase Analysis ───────────────────────────────────────

function EulerPhaseTab() {
  const svgRef = useRef();
  const [tValue, setTValue] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(15);

  const data = useMemo(() => eulerProductPhaseAnalysis(tValue, [-1, 3], 150, numPrimes), [tValue, numPrimes]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 450;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 25, right: 30, bottom: 50, left: 65 };
    const w = width - margin.left - margin.right;
    const topH = 170;
    const botH = 170;
    const gap = 30;

    // ── Top: Log cumulative magnitude ──
    {
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const x = d3.scaleLinear().domain([-1, 3]).range([0, w]);
      const yExtent = d3.extent(data, d => d.logCumulativeMag);
      const y = d3.scaleLinear().domain([Math.max(yExtent[0], -20), Math.min(yExtent[1], 20)]).range([topH, 0]);

      g.append('g').attr('transform', `translate(0,${topH})`).call(d3.axisBottom(x).ticks(8).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Phase regions
      g.append('rect').attr('x', x(-1)).attr('y', 0).attr('width', x(0) - x(-1)).attr('height', topH)
        .attr('fill', 'rgba(59,130,246,0.04)');
      g.append('rect').attr('x', x(0)).attr('y', 0).attr('width', x(1) - x(0)).attr('height', topH)
        .attr('fill', 'rgba(139,92,246,0.06)');
      g.append('rect').attr('x', x(1)).attr('y', 0).attr('width', x(3) - x(1)).attr('height', topH)
        .attr('fill', 'rgba(16,185,129,0.04)');

      // Phase boundary and critical line
      g.append('line').attr('x1', x(1)).attr('y1', 0).attr('x2', x(1)).attr('y2', topH)
        .attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);
      g.append('line').attr('x1', x(0.5)).attr('y1', 0).attr('x2', x(0.5)).attr('y2', topH)
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

      // Zero reference
      g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
        .attr('stroke', '#64748b').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,3');

      // Curve with color transition
      const converging = data.filter(d => d.isConverging);
      const diverging = data.filter(d => !d.isConverging);

      g.append('path').datum(data)
        .attr('d', d3.line()
          .x(d => x(d.sigma))
          .y(d => y(Math.max(y.domain()[0], Math.min(y.domain()[1], d.logCumulativeMag))))
          .curve(d3.curveBasis))
        .attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 2);

      // Legend for vertical reference lines
      const topLegend = g.append('g').attr('transform', `translate(${w - 200}, 8)`);
      topLegend.append('rect').attr('x', -8).attr('y', -6).attr('width', 206).attr('height', 42)
        .attr('fill', 'rgba(15,23,42,0.85)').attr('rx', 4).attr('stroke', '#2a3050');
      topLegend.append('line').attr('x1', 0).attr('y1', 6).attr('x2', 18).attr('y2', 6)
        .attr('stroke', '#ef4444').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
      topLegend.append('text').attr('x', 24).attr('y', 10)
        .attr('fill', '#ef4444').attr('font-size', 10).text('Critical line (σ = ½)');
      topLegend.append('line').attr('x1', 0).attr('y1', 22).attr('x2', 18).attr('y2', 22)
        .attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3');
      topLegend.append('text').attr('x', 24).attr('y', 26)
        .attr('fill', '#f59e0b').attr('font-size', 10).text('Convergence boundary (σ = 1)');

      svg.append('text').attr('x', margin.left).attr('y', 16)
        .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
        .text('log \u220F|1/(1-p^{-s})| \u2014 Euler product log-magnitude');
    }

    // ── Bottom: Average factor magnitude ──
    {
      const yOff = margin.top + topH + gap;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${yOff})`);
      const x = d3.scaleLinear().domain([-1, 3]).range([0, w]);
      const yMax = Math.min(d3.max(data, d => d.avgFactorMag) * 1.1, 5);
      const y = d3.scaleLinear().domain([0.5, yMax]).range([botH, 0]);

      g.append('g').attr('transform', `translate(0,${botH})`).call(d3.axisBottom(x).ticks(8).tickFormat(d => d.toFixed(1)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(2)))
        .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
      g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

      // Reference at 1.0
      g.append('line').attr('x1', 0).attr('y1', y(1)).attr('x2', w).attr('y2', y(1))
        .attr('stroke', '#10b981').attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

      // Phase regions
      g.append('rect').attr('x', x(0)).attr('y', 0).attr('width', x(1) - x(0)).attr('height', botH)
        .attr('fill', 'rgba(139,92,246,0.06)');

      // Convergence boundary
      g.append('line').attr('x1', x(1)).attr('y1', 0).attr('x2', x(1)).attr('y2', botH)
        .attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

      // Color the line by convergence: green for σ>1 (convergent), red for σ<1 (divergent)
      const clampedData = data.map(d => ({ ...d, avgFactorMag: Math.min(d.avgFactorMag, yMax) }));
      const lineGen = d3.line().x(d => x(d.sigma)).y(d => y(d.avgFactorMag)).curve(d3.curveBasis);
      const convergent = clampedData.filter(d => d.sigma >= 1);
      const divergent = clampedData.filter(d => d.sigma <= 1);
      g.append('path').datum(divergent)
        .attr('d', lineGen)
        .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2);
      g.append('path').datum(convergent)
        .attr('d', lineGen)
        .attr('fill', 'none').attr('stroke', '#10b981').attr('stroke-width', 2);

      // Legend for convergence coloring
      const legend = g.append('g').attr('transform', `translate(${w - 170}, 8)`);
      legend.append('rect').attr('x', -8).attr('y', -6).attr('width', 176).attr('height', 42)
        .attr('fill', 'rgba(15,23,42,0.85)').attr('rx', 4).attr('stroke', '#2a3050');
      // Divergent entry
      legend.append('line').attr('x1', 0).attr('y1', 6).attr('x2', 18).attr('y2', 6)
        .attr('stroke', '#ef4444').attr('stroke-width', 2);
      legend.append('text').attr('x', 24).attr('y', 10)
        .attr('fill', '#ef4444').attr('font-size', 10).text('Divergent (σ < 1)');
      // Convergent entry
      legend.append('line').attr('x1', 0).attr('y1', 22).attr('x2', 18).attr('y2', 22)
        .attr('stroke', '#10b981').attr('stroke-width', 2);
      legend.append('text').attr('x', 24).attr('y', 26)
        .attr('fill', '#10b981').attr('font-size', 10).text('Convergent (σ > 1)');

      svg.append('text').attr('x', margin.left).attr('y', yOff - 6)
        .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-weight', 600)
        .text('Average Euler factor magnitude \u2014 convergence vs divergence boundary');
    }

    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12).text('σ = Re(s)');

  }, [data]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-red">
        <strong>The math:</strong> The Euler product <InlineMath tex="\\zeta(s) = \\prod_p (1-p^{-s})^{-1}" /> is a cascade
        of independent prime oscillator stages. Each factor <InlineMath tex="(1-p^{-s})^{-1}" /> has magnitude{' '}
        <InlineMath tex="> 1" />, so the infinite product converges only when these factors approach 1 fast enough &mdash;
        precisely when <InlineMath tex="\\sigma > 1" />. At <InlineMath tex="\\sigma = 1" />, the product diverges (the harmonic series),
        marking the Bost-Connes phase transition. Above: primes are independent oscillators (gas). Below: they
        interact collectively (condensate). The average factor magnitude measures the "coupling strength."
        <strong> Look for:</strong> the sharp transition from convergent (green) to divergent (red) at <InlineMath tex="\\sigma = 1" />.
      </div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex="t = \operatorname{Im}(s)" /></label>
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
                color: bestDist < 0.3 ? '#10b981' : '#64748b',
              }}>
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="5" max="50" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%', height: 450 }} />
      </div>
    </div>
  );
}
