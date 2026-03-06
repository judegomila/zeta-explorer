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
  'circuit-theory': 'tag-orange',
  'trace-formula': 'tag-purple',
  'spectral': 'tag-red',
  'quantum-info': 'tag-pink',
  'analysis': 'tag-green',
  'number-theory': 'tag-blue',
  'thermodynamics': 'tag-orange',
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

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, color: '#e2e8f0', fontSize: 16 }}>How to Navigate the Explorations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13, color: '#94a3b8' }}>
          <div>
            <h4 style={{ margin: '0 0 6px', color: '#8b5cf6', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categories</h4>
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
              <li><strong style={{ color: '#60a5fa' }}>foundation</strong> — core identities (Euler product, functional equation)</li>
              <li><strong style={{ color: '#22d3ee' }}>oscillator-model</strong> — prime ladder construction and LC resonators</li>
              <li><strong style={{ color: '#a78bfa' }}>duality</strong> — direct/dual ladder symmetry and the functional equation</li>
              <li><strong style={{ color: '#4ade80' }}>hamiltonian</strong> — energy landscape and σ-minimization</li>
              <li><strong style={{ color: '#fb923c' }}>control-theory</strong> — Nyquist stability and feedback loop analysis</li>
              <li><strong style={{ color: '#f472b6' }}>signal-processing</strong> — scattering, impedance, wave propagation</li>
              <li><strong style={{ color: '#f87171' }}>statistical</strong> — GUE statistics, pair correlation, random matrix theory</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 6px', color: '#06b6d4', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Depth Scale</h4>
            <p style={{ margin: '0 0 8px' }}>
              Each entry has a <strong style={{ color: '#e2e8f0' }}>Depth 1–6</strong> rating indicating how deep into the ZPO model it reaches:
            </p>
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
              <li><strong style={{ color: '#e2e8f0' }}>1–2</strong> — Setup: Euler product reinterpretation, single-prime resonators</li>
              <li><strong style={{ color: '#e2e8f0' }}>3–4</strong> — Core theory: bridge coupling, Hamiltonian, scattering matrix</li>
              <li><strong style={{ color: '#e2e8f0' }}>5–6</strong> — Advanced: GUE universality, primon gas, zero-free regions</li>
            </ul>
            <p style={{ margin: '8px 0 0' }}>
              Click any entry to expand its full analysis with key equations, insights, and literature references. Follow the <strong style={{ color: '#3b82f6' }}>Leads to</strong> links to trace the chain of reasoning.
            </p>
          </div>
        </div>
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
                {exp.date || (exp.timestamp ? new Date(exp.timestamp).toLocaleDateString() : '')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-block', fontSize: 14, color: '#64748b',
                transition: 'transform 0.2s ease',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}>&#9654;</span>
              <h2 style={{ margin: 0 }}>{exp.title}</h2>
            </div>

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

                {exp.mathContent && exp.mathContent.length > 0 && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)' }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ZPO Correspondence
                    </h4>
                    {exp.mathContent.map((tex, i) => (
                      <div key={i} style={{ marginBottom: 4 }}>
                        <BlockMath tex={tex} />
                      </div>
                    ))}
                  </div>
                )}

                {exp.insights && exp.insights.length > 0 && (
                  <div className="exploration-insights">
                    <h4>Key Insights</h4>
                    <ul>
                      {exp.insights.map((ins, i) => (
                        <li key={i}><MathText>{ins}</MathText></li>
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
                {exp.summary || exp.content.slice(0, 180).replace(/\$[^$]*\$/g, '[math]') + '...'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
