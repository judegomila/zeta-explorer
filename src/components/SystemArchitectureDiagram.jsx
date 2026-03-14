import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { InlineMath } from './KaTeXMath.jsx';

/**
 * PhD-review quality system architecture diagram showing:
 * Layer 1: Number Theory Foundations
 * Layer 2: Analytic Continuation & Functional Equation
 * Layer 3: Physical Model (Oscillator Chain)
 * Layer 4: Analysis Frameworks (Control, Statistics, Thermodynamics)
 * Layer 5: Computational Implementation
 *
 * With data flow arrows, mathematical annotations, and module mapping.
 */

const LAYERS = [
  {
    id: 'foundations',
    label: 'Number-Theoretic Foundations',
    color: '#3b82f6',
    y: 0,
    nodes: [
      { id: 'primes', label: 'Primes p', tex: 'p \\in \\mathbb{P}', x: 0.12 },
      { id: 'vonmangoldt', label: 'von Mangoldt Λ(n)', tex: '\\Lambda(n) = \\log p \\text{ if } n=p^k', x: 0.35 },
      { id: 'euler-prod', label: 'Euler Product', tex: '\\zeta(s)=\\prod_p(1-p^{-s})^{-1}', x: 0.62 },
      { id: 'dirichlet', label: 'Dirichlet Series', tex: '\\zeta(s)=\\sum n^{-s}', x: 0.88 },
    ],
  },
  {
    id: 'analytic',
    label: 'Analytic Structure',
    color: '#8b5cf6',
    y: 1,
    nodes: [
      { id: 'func-eq', label: 'Functional Equation', tex: '\\xi(s)=\\xi(1-s)', x: 0.15 },
      { id: 'chi', label: 'Bridge Factor χ(s)', tex: '\\chi(s)=2^s\\pi^{s-1}\\sin(\\pi s/2)\\,\\Gamma(1-s)', x: 0.42 },
      { id: 'analytic-cont', label: 'Analytic Continuation', tex: '\\zeta(s) \\text{ for all } s \\neq 1', x: 0.72 },
      { id: 'zeros', label: 'Nontrivial Zeros', tex: '\\zeta(\\rho)=0,\\; \\rho=\\tfrac{1}{2}+i\\gamma', x: 0.92 },
    ],
  },
  {
    id: 'physical',
    label: 'Physical Model (ZPO)',
    color: '#10b981',
    y: 2,
    nodes: [
      { id: 'lc-stage', label: 'LC Oscillator Stage', tex: 'L_p=\\log p,\\; C_p=1/\\log p', x: 0.08 },
      { id: 'direct-ladder', label: 'Direct Ladder ζ(s)', tex: 'H(s)=\\prod_p H_p(s)', x: 0.28 },
      { id: 'bridge', label: 'Lossless Bridge', tex: 'S^\\dagger S=I \\text{ at } \\sigma=\\tfrac{1}{2}', x: 0.5 },
      { id: 'dual-ladder', label: 'Dual Ladder ζ(1−s)', tex: 'H(1{-}s)=\\prod_p H_p(1{-}s)', x: 0.72 },
      { id: 'hamiltonian', label: 'Hamiltonian ℋ', tex: '\\min_\\sigma \\mathcal{H} \\text{ at } \\sigma=\\tfrac{1}{2}', x: 0.92 },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis Frameworks',
    color: '#f59e0b',
    y: 3,
    nodes: [
      { id: 'control', label: 'Control Theory', tex: '\\text{Nyquist, Bode, } H_\\infty', x: 0.08 },
      { id: 'scattering', label: 'Scattering Matrix', tex: 'S(s),\\; \\Gamma,\\; \\tau', x: 0.25 },
      { id: 'thermo', label: 'Thermodynamics', tex: 'F=-T\\ln Z,\\; T=1/\\sigma', x: 0.42 },
      { id: 'rmt', label: 'Random Matrix (GUE)', tex: 'P(s) \\sim s^2 e^{-4s^2/\\pi}', x: 0.6 },
      { id: 'heat-flow', label: 'De Bruijn–Newman', tex: '\\partial_\\tau H_\\tau = \\partial_t^2 H_\\tau', x: 0.78 },
      { id: 'twistor', label: 'Twistor Duality', tex: 'Z^{\\alpha} W_{\\alpha} = 0', x: 0.93 },
    ],
  },
  {
    id: 'computation',
    label: 'Computational Layer',
    color: '#ef4444',
    y: 4,
    nodes: [
      { id: 'mod-zeta', label: 'zeta.js', tex: '\\text{R-S } Z(t),\\; \\text{Borwein}', x: 0.08 },
      { id: 'mod-osc', label: 'oscillators.js', tex: '\\text{Stages, ladders, } \\mathcal{H}', x: 0.23 },
      { id: 'mod-primes', label: 'primes.js', tex: '\\text{Sieve, } \\Lambda, \\psi(x)', x: 0.38 },
      { id: 'mod-super', label: 'supercritical.js', tex: '\\text{Thermo, heat, spectra}', x: 0.53 },
      { id: 'mod-twistor', label: 'twistor.js', tex: '\\text{Incidence, Penrose}', x: 0.68 },
      { id: 'mod-pascal', label: 'pascal.js', tex: '\\text{Hasse–Sondow}', x: 0.82 },
    ],
  },
];

const EDGES = [
  // Foundations → Analytic
  { from: 'primes', to: 'euler-prod', label: 'product over p' },
  { from: 'euler-prod', to: 'func-eq', label: 'continuation' },
  { from: 'dirichlet', to: 'analytic-cont', label: 'Borwein accel.' },
  { from: 'func-eq', to: 'chi', label: '' },
  { from: 'analytic-cont', to: 'zeros', label: 'root finding' },
  // Analytic → Physical
  { from: 'euler-prod', to: 'direct-ladder', label: 'cascade interp.' },
  { from: 'chi', to: 'bridge', label: 'scattering' },
  { from: 'func-eq', to: 'dual-ladder', label: 's → 1−s' },
  { from: 'zeros', to: 'hamiltonian', label: 'resonances' },
  // Physical internal
  { from: 'lc-stage', to: 'direct-ladder', label: '' },
  { from: 'direct-ladder', to: 'bridge', label: '' },
  { from: 'bridge', to: 'dual-ladder', label: '' },
  { from: 'bridge', to: 'hamiltonian', label: 'min energy' },
  // Physical → Analysis
  { from: 'direct-ladder', to: 'control', label: 'transfer fn' },
  { from: 'bridge', to: 'scattering', label: 'S-params' },
  { from: 'hamiltonian', to: 'thermo', label: 'partition fn' },
  { from: 'zeros', to: 'rmt', label: 'spacing stats' },
  { from: 'thermo', to: 'heat-flow', label: 'τ evolution' },
  { from: 'bridge', to: 'twistor', label: 'intertwiner' },
  // Analysis → Computation
  { from: 'control', to: 'mod-osc', label: '' },
  { from: 'scattering', to: 'mod-osc', label: '' },
  { from: 'thermo', to: 'mod-super', label: '' },
  { from: 'rmt', to: 'mod-zeta', label: '' },
  { from: 'heat-flow', to: 'mod-super', label: '' },
  { from: 'twistor', to: 'mod-twistor', label: '' },
  { from: 'vonmangoldt', to: 'mod-primes', label: '' },
];

export default function SystemArchitectureDiagram() {
  const svgRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 900;
    const layerH = 90;
    const margin = { top: 40, right: 30, bottom: 30, left: 30 };
    const height = margin.top + LAYERS.length * layerH + margin.bottom;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g');

    // Build node position lookup
    const nodePos = {};
    LAYERS.forEach(layer => {
      const ly = margin.top + layer.y * layerH + layerH / 2;
      layer.nodes.forEach(node => {
        const nx = margin.left + node.x * (width - margin.left - margin.right);
        nodePos[node.id] = { x: nx, y: ly, color: layer.color, label: node.label, tex: node.tex };
      });
    });

    // Draw layer backgrounds
    LAYERS.forEach(layer => {
      const ly = margin.top + layer.y * layerH;
      g.append('rect')
        .attr('x', margin.left - 10)
        .attr('y', ly + 4)
        .attr('width', width - margin.left - margin.right + 20)
        .attr('height', layerH - 8)
        .attr('rx', 8)
        .attr('fill', layer.color)
        .attr('opacity', 0.04)
        .attr('stroke', layer.color)
        .attr('stroke-opacity', 0.15)
        .attr('stroke-width', 1);

      // Layer label
      g.append('text')
        .attr('x', margin.left - 4)
        .attr('y', ly + 16)
        .attr('fill', layer.color)
        .attr('font-size', 10)
        .attr('font-weight', 600)
        .attr('opacity', 0.7)
        .text(layer.label);
    });

    // Draw edges
    EDGES.forEach(edge => {
      const from = nodePos[edge.from];
      const to = nodePos[edge.to];
      if (!from || !to) return;

      const isHighlighted = hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode);
      const opacity = hoveredNode ? (isHighlighted ? 0.7 : 0.08) : 0.2;

      // Curved path
      const midY = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const controlOffset = Math.abs(dx) < 50 ? 20 : 0;

      g.append('path')
        .attr('d', `M${from.x},${from.y} C${from.x},${midY + controlOffset} ${to.x},${midY - controlOffset} ${to.x},${to.y}`)
        .attr('fill', 'none')
        .attr('stroke', isHighlighted ? '#e2e8f0' : '#475569')
        .attr('stroke-width', isHighlighted ? 1.5 : 0.8)
        .attr('opacity', opacity)
        .attr('marker-end', 'url(#arrowhead)');

      // Edge label
      if (edge.label && isHighlighted) {
        g.append('text')
          .attr('x', (from.x + to.x) / 2)
          .attr('y', midY - 4)
          .attr('text-anchor', 'middle')
          .attr('fill', '#94a3b8')
          .attr('font-size', 8)
          .attr('font-style', 'italic')
          .text(edge.label);
      }
    });

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 6 6')
      .attr('refX', 5).attr('refY', 3)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L6,3 L0,6 Z')
      .attr('fill', '#475569');

    // Draw nodes
    LAYERS.forEach(layer => {
      layer.nodes.forEach(node => {
        const pos = nodePos[node.id];
        const isHovered = hoveredNode === node.id;
        const dimmed = hoveredNode && !isHovered &&
          !EDGES.some(e => (e.from === hoveredNode && e.to === node.id) || (e.to === hoveredNode && e.from === node.id));

        const nodeG = g.append('g')
          .attr('transform', `translate(${pos.x},${pos.y})`)
          .style('cursor', 'pointer')
          .on('mouseenter', () => {
            setHoveredNode(node.id);
            setTooltip({ x: pos.x, y: pos.y, tex: node.tex, label: node.label });
          })
          .on('mouseleave', () => {
            setHoveredNode(null);
            setTooltip(null);
          });

        // Node circle
        nodeG.append('circle')
          .attr('r', isHovered ? 22 : 18)
          .attr('fill', isHovered ? layer.color : 'rgba(15,18,37,0.9)')
          .attr('stroke', layer.color)
          .attr('stroke-width', isHovered ? 2.5 : 1.5)
          .attr('opacity', dimmed ? 0.2 : 1)
          .attr('filter', isHovered ? 'url(#glow)' : null);

        // Node label
        nodeG.append('text')
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('fill', dimmed ? '#334155' : '#cbd5e1')
          .attr('font-size', 9)
          .attr('font-weight', 500)
          .text(node.label);

        // Short ID inside circle
        const shortLabel = node.id.length <= 5 ? node.id :
          node.label.split(' ').map(w => w[0]).join('').substring(0, 3);
        nodeG.append('text')
          .attr('y', 3)
          .attr('text-anchor', 'middle')
          .attr('fill', isHovered ? '#fff' : layer.color)
          .attr('font-size', 8)
          .attr('font-weight', 700)
          .attr('font-family', 'var(--font-mono)')
          .attr('opacity', dimmed ? 0.2 : 0.9)
          .text(shortLabel.toUpperCase());
      });
    });

    // Glow filter
    const defs = svg.select('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

  }, [hoveredNode]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto', minHeight: 480 }} />
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: Math.min(tooltip.x, (svgRef.current?.clientWidth || 800) - 200),
          top: tooltip.y - 60,
          background: 'rgba(15, 18, 37, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 8,
          padding: '8px 14px',
          zIndex: 10,
          pointerEvents: 'none',
          maxWidth: 280,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{tooltip.label}</div>
          <div style={{ fontSize: 12 }}>
            <InlineMath tex={tooltip.tex} />
          </div>
        </div>
      )}
    </div>
  );
}
