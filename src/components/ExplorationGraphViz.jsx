import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { getExplorationGraph } from '../data/explorations.js';

const categoryColors = {
  'foundation': '#3b82f6',
  'oscillator-model': '#06b6d4',
  'duality': '#8b5cf6',
  'hamiltonian': '#10b981',
  'control-theory': '#f59e0b',
  'signal-processing': '#ec4899',
  'statistical': '#ef4444',
  'physics': '#3b82f6',
  'geometry': '#06b6d4',
};

/**
 * Force-directed graph of the exploration dependency network.
 * Nodes = explorations, edges = next-steps.
 */
export default function ExplorationGraphViz() {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 500;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const { nodes, edges } = getExplorationGraph();

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(100).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(40))
      .force('y', d3.forceY().y(d => 60 + d.depth * 80).strength(0.3));

    // Defs for arrow markers
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#4a5568');

    // Draw edges
    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', '#2a3050')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)');

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }))
      .on('click', (event, d) => setSelectedNode(d));

    // Node circles
    node.append('circle')
      .attr('r', d => 14 + d.depth * 2)
      .attr('fill', d => {
        const color = categoryColors[d.category] || '#3b82f6';
        return color + '30'; // with alpha
      })
      .attr('stroke', d => categoryColors[d.category] || '#3b82f6')
      .attr('stroke-width', 2);

    // Status indicator
    node.append('circle')
      .attr('r', 4)
      .attr('cx', d => 10 + d.depth * 2)
      .attr('cy', d => -(10 + d.depth * 2))
      .attr('fill', d => d.status === 'complete' ? '#10b981' : d.status === 'in-progress' ? '#f59e0b' : '#64748b');

    // Node labels
    node.append('text')
      .attr('y', d => 24 + d.depth * 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', 9)
      .attr('font-weight', 500)
      .text(d => d.title.length > 25 ? d.title.slice(0, 25) + '...' : d.title);

    // Depth labels inside nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', d => categoryColors[d.category] || '#3b82f6')
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(d => d.depth);

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Title
    svg.append('text').attr('x', 12).attr('y', 20)
      .attr('fill', '#e2e8f0').attr('font-size', 14).attr('font-weight', 600)
      .text('Exploration Dependency Graph');
    svg.append('text').attr('x', 12).attr('y', 36)
      .attr('fill', '#64748b').attr('font-size', 11)
      .text('Drag nodes to rearrange. Click for details. Numbers = exploration depth.');

    // Category color legend (top right)
    const legendCategories = [
      { label: 'Foundation', color: '#3b82f6' },
      { label: 'Oscillator Model', color: '#06b6d4' },
      { label: 'Duality', color: '#8b5cf6' },
      { label: 'Hamiltonian', color: '#10b981' },
      { label: 'Control Theory', color: '#f59e0b' },
      { label: 'Signal Proc.', color: '#ec4899' },
      { label: 'Statistical', color: '#ef4444' },
    ];
    const legend = svg.append('g').attr('transform', `translate(${width - 130}, 8)`);
    legendCategories.forEach((cat, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 15})`);
      row.append('circle').attr('r', 4.5).attr('cx', 5).attr('cy', 5)
        .attr('fill', cat.color + '30').attr('stroke', cat.color).attr('stroke-width', 1.5);
      row.append('text').attr('x', 14).attr('y', 8.5)
        .attr('fill', '#94a3b8').attr('font-size', 9).text(cat.label);
    });

  }, []);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div>
      <div className="viz-container" style={{ minHeight: 500 }}>
        <svg ref={svgRef} style={{ width: '100%', height: 500 }} />
      </div>
      {selectedNode && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ color: categoryColors[selectedNode.category] || '#3b82f6' }}>
            {selectedNode.title}
          </h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span className="tag tag-blue">Depth {selectedNode.depth}</span>
            <span className={`tag ${selectedNode.status === 'complete' ? 'tag-green' : 'tag-orange'}`}>
              {selectedNode.status}
            </span>
            <span className="tag tag-purple">{selectedNode.category}</span>
          </div>
        </div>
      )}
    </div>
  );
}
