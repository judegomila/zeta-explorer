import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { getExplorationGraph } from '../data/explorations.js';
import { ED } from '../styles/tokens.js';

const categoryColors = {
  'foundation': ED.series1,
  'oscillator-model': ED.series6,
  'duality': ED.series5,
  'hamiltonian': ED.series3,
  'control-theory': ED.series4,
  'signal-processing': ED.series7,
  'statistical': ED.series2,
  'physics': ED.series1,
  'geometry': ED.series6,
};

/**
 * Force-directed graph of the exploration dependency network.
 * Nodes = explorations, edges = next-steps.
 */
export default function ExplorationGraphViz() {
  const svgRef = useRef();
  const simRef = useRef(null);
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
      .force('y', d3.forceY().y(d => 60 + (Number.isFinite(d?.depth) ? d.depth : 0) * 80).strength(0.3));

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
      .attr('stroke', ED.rule)
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

    // Node circles. NOTE: d.depth can be undefined if a recently-added
    // exploration entry in src/data/explorations.js forgot to set the field
    // — that produced 17,821 SVG `<circle> r: "NaN"` console errors per
    // page load (imp-382 health check finding). Coerce to 0 here as a
    // belt-and-braces defense AND backfill the source data separately.
    const safeDepth = (d) => (Number.isFinite(d?.depth) ? d.depth : 0);
    node.append('circle')
      .attr('r', d => 14 + safeDepth(d) * 2)
      .attr('fill', d => {
        const color = categoryColors[d.category] || ED.series1;
        return color + '30'; // with alpha
      })
      .attr('stroke', d => categoryColors[d.category] || ED.series1)
      .attr('stroke-width', 2);

    // Status indicator
    node.append('circle')
      .attr('r', 4)
      .attr('cx', d => 10 + safeDepth(d) * 2)
      .attr('cy', d => -(10 + safeDepth(d) * 2))
      .attr('fill', d => d.status === 'complete' ? ED.series3 : d.status === 'in-progress' ? ED.series4 : ED.series8);

    // Node labels
    node.append('text')
      .attr('y', d => 24 + safeDepth(d) * 2)
      .attr('text-anchor', 'middle')
      .attr('fill', ED.inkSoft)
      .attr('font-size', 9)
      .attr('font-weight', 500)
      .text(d => d.title.length > 25 ? d.title.slice(0, 25) + '...' : d.title);

    // Depth labels inside nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', d => categoryColors[d.category] || ED.series1)
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(d => d.depth);

    // Store simulation ref for cleanup on unmount
    simRef.current = simulation;

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
      .attr('fill', ED.ink).attr('font-size', 14).attr('font-weight', 600)
      .text('Exploration Dependency Graph');
    svg.append('text').attr('x', 12).attr('y', 36)
      .attr('fill', ED.inkFaint).attr('font-size', 11)
      .text('Drag nodes to rearrange. Click for details. Numbers = exploration depth.');

    // Category color legend (top right)
    const legendCategories = [
      { label: 'Foundation', color: ED.series1 },
      { label: 'Oscillator Model', color: ED.series6 },
      { label: 'Duality', color: ED.series5 },
      { label: 'Hamiltonian', color: ED.series3 },
      { label: 'Control Theory', color: ED.brass },
      { label: 'Signal Proc.', color: ED.series7 },
      { label: 'Statistical', color: ED.series2 },
    ];
    const legend = svg.append('g').attr('transform', `translate(${width - 130}, 8)`);
    legendCategories.forEach((cat, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 15})`);
      row.append('circle').attr('r', 4.5).attr('cx', 5).attr('cy', 5)
        .attr('fill', cat.color + '30').attr('stroke', cat.color).attr('stroke-width', 1.5);
      row.append('text').attr('x', 14).attr('y', 8.5)
        .attr('fill', ED.inkSoft).attr('font-size', 9).text(cat.label);
    });

  }, []);

  useEffect(() => {
    draw();
    return () => { if (simRef.current) simRef.current.stop(); };
  }, [draw]);

  return (
    <div>
      <div className="viz-container" style={{ minHeight: 500 }}>
        <svg ref={svgRef} style={{ width: '100%', height: 500 }} />
      </div>
      {selectedNode && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ color: categoryColors[selectedNode.category] || 'var(--series-1)' }}>
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
