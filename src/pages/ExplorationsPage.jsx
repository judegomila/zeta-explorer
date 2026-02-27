import React, { useState } from 'react';
import { getAllExplorations, getExplorationCategories } from '../data/explorations.js';
import { getById } from '../data/literature.js';
import { MathText, BlockMath } from '../components/KaTeXMath.jsx';

const categoryColors = {
  'foundation': 'tag-blue',
  'oscillator-model': 'tag-cyan',
  'duality': 'tag-purple',
  'hamiltonian': 'tag-green',
  'control-theory': 'tag-orange',
  'signal-processing': 'tag-pink',
  'statistical': 'tag-red',
  'physics': 'tag-blue',
  'geometry': 'tag-cyan',
};

const statusLabels = {
  'complete': { label: 'Complete', cls: 'status-complete' },
  'in-progress': { label: 'In Progress', cls: 'status-in-progress' },
  'queued': { label: 'Queued', cls: 'status-queued' },
};

export default function ExplorationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const categories = getExplorationCategories();
  const allExplorations = getAllExplorations();
  const explorations = selectedCategory === 'all'
    ? allExplorations
    : allExplorations.filter(e => e.category === selectedCategory);

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI Exploration Journal</h1>
        <p>
          Continuous deep investigation into the zeta function through the prime oscillator lens.
          Each entry explores a mathematical connection, with full LaTeX rendering, insights, and literature references.
          The AI explores the space systematically, building a graph of interconnected discoveries.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 8, color: '#64748b', fontSize: 13 }}>
        <span>{allExplorations.length} explorations</span>
        <span>|</span>
        <span>{allExplorations.filter(e => e.status === 'complete').length} complete</span>
        <span>{allExplorations.filter(e => e.status === 'in-progress').length} in progress</span>
        <span>{allExplorations.filter(e => e.status === 'queued').length} queued</span>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({allExplorations.length})
        </button>
        {categories.map(c => (
          <button
            key={c.name}
            className={`filter-btn ${selectedCategory === c.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c.name)}
          >
            {c.name} ({c.count})
          </button>
        ))}
      </div>

      {explorations.map(exp => {
        const isExpanded = expandedId === exp.id;
        const statusInfo = statusLabels[exp.status] || statusLabels['queued'];

        return (
          <div
            key={exp.id}
            className="exploration-entry"
            onClick={() => setExpandedId(isExpanded ? null : exp.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="exploration-meta">
              <span className={`tag ${categoryColors[exp.category] || 'tag-blue'}`}>{exp.category}</span>
              <span className="tag tag-blue">Depth {exp.depth}</span>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#94a3b8' }}>
                <span className={`status-dot ${statusInfo.cls}`} />
                {statusInfo.label}
              </span>
              <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {new Date(exp.timestamp).toLocaleString()}
              </span>
            </div>
            <h2>{exp.title}</h2>

            {isExpanded && (
              <div style={{ marginTop: 16 }}>
                <div className="exploration-content">
                  <MathText>{exp.content}</MathText>
                </div>

                {exp.latex && exp.latex.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Key Equations
                    </h4>
                    {exp.latex.map((tex, i) => (
                      <BlockMath key={i} tex={tex} />
                    ))}
                  </div>
                )}

                {exp.insights && exp.insights.length > 0 && (
                  <div className="exploration-insights">
                    <h4>Key Insights</h4>
                    <ul>
                      {exp.insights.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.references && exp.references.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: '#06b6d4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      References
                    </h4>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {exp.references.map(refId => {
                        const ref = getById(refId);
                        return ref ? (
                          <span key={refId} className="tag tag-cyan" title={ref.title}>
                            {ref.authors[0].split(' ').pop()} {ref.year}
                          </span>
                        ) : (
                          <span key={refId} className="tag tag-blue">{refId}</span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {exp.nextSteps && exp.nextSteps.length > 0 && (
                  <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
                    Leads to: {exp.nextSteps.map(ns => {
                      const next = allExplorations.find(e => e.id === ns);
                      return next ? (
                        <span
                          key={ns}
                          style={{ color: '#3b82f6', cursor: 'pointer', marginRight: 8 }}
                          onClick={e => { e.stopPropagation(); setExpandedId(ns); }}
                        >
                          {next.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            {!isExpanded && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
                {exp.content.slice(0, 180).replace(/\$[^$]*\$/g, '[math]')}...
                <span style={{ color: '#3b82f6', marginLeft: 8 }}>Click to expand</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
