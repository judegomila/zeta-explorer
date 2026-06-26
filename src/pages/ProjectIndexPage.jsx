import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { waves, keyResults, withdrawn, projectStats } from '../data/wave-index.js';

/**
 * Project Index page: navigable summary of all project improvements.
 * The count is sourced live from projectStats.totalImprovements (wave-index.js);
 * never inline a frozen literal here so the header cannot drift from the data.
 */
export default function ProjectIndexPage() {
  const [expandedWave, setExpandedWave] = useState(null);

  const statusColors = {
    'PROVEN': '#10b981',
    'PROVEN (exact)': '#10b981',
    'VERIFIED': '#3b82f6',
    'OPEN (~80%)': '#f59e0b',
    'UNIFICATION (7 frameworks)': '#8b5cf6',
  };

  const impactColors = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
  };

  return (
    <div className="page" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <h1>Project Index</h1>
        <p>
          Navigable summary of all {projectStats.totalImprovements} improvements across
          {' '}{projectStats.wavesCompleted} waves, organized by topic and outcome.
        </p>
      </div>

      {/* Project Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Improvements', value: projectStats.totalImprovements, color: '#3b82f6' },
          { label: 'Math Modules', value: projectStats.mathModules, color: '#8b5cf6' },
          { label: 'Waves', value: projectStats.wavesCompleted, color: '#10b981' },
          { label: 'Self-corrections', value: projectStats.selfCorrections, color: '#f59e0b' },
          { label: 'Withdrawn', value: projectStats.withdrawnClaims, color: '#ef4444' },
          { label: 'LP Confidence', value: projectStats.bayesianConfidence, color: '#06b6d4' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '12px 16px', borderRadius: 8, background: `${s.color}10`,
            border: `1px solid ${s.color}20`, textAlign: 'center',
          }}>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Current Research Status */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 15, marginBottom: 12 }}>Current Research Status</h3>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ color: '#cbd5e1', fontSize: 12 }}>Bayesian confidence (Lax-Phillips path)</span>
            <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>~80%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(139,92,246,0.15)', overflow: 'hidden' }}>
            <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 6, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ color: '#fbbf24', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Single Remaining Open Gap</div>
          <div style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.6 }}>
            Prove the Lax-Phillips scattering operator for the ZPO Hamiltonian satisfies the LP contraction semigroup axioms.
            If confirmed, poles of S&#x2082;&#x2081; are confined to &#x3c3;=&#xbd;, closing the proof.
          </div>
        </div>
        <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.7 }}>
          <strong style={{ color: '#94a3b8' }}>What is RH?</strong>{' '}
          The Riemann Hypothesis asks whether all non-trivial zeros of &#x3b6;(s) lie on Re(s)=&#xbd;.
          The ZPO approach encodes this via an S-matrix: &#x3b6;-zeros are poles of S&#x2082;&#x2081; = &#x3b6;(2s)/&#x3b6;(s),
          and Lax-Phillips operator theory bounds where those poles can live.
        </div>
      </div>

      {/* Key Results */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 15, marginBottom: 12 }}>Key Results</h3>
        {keyResults.map(r => (
          <div key={r.id} style={{
            marginBottom: 10, padding: '10px 14px', borderRadius: 6,
            background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                color: '#94a3b8', padding: '2px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 4,
              }}>{r.id}</span>
              <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, flex: 1 }}>
                {r.name}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: `${statusColors[r.status] || '#64748b'}20`,
                color: statusColors[r.status] || '#94a3b8',
              }}>{r.status}</span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: `${impactColors[r.impact]}15`,
                color: impactColors[r.impact],
              }}>{r.impact.toUpperCase()}</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
              {r.description}
            </div>
          </div>
        ))}
      </div>

      {/* Waves Timeline */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 15, marginBottom: 12 }}>Waves Timeline</h3>
        {waves.map(w => (
          <div key={w.number} style={{
            marginBottom: 8, padding: '10px 14px', borderRadius: 6,
            background: 'rgba(15,23,42,0.4)',
            border: `1px solid ${w.breakthrough ? 'rgba(16,185,129,0.3)' : w.critical ? 'rgba(245,158,11,0.3)' : 'rgba(148,163,184,0.1)'}`,
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          aria-expanded={expandedWave === w.number}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedWave(expandedWave === w.number ? null : w.number); }}}
          onClick={() => setExpandedWave(expandedWave === w.number ? null : w.number)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(59,130,246,0.15)', color: '#93c5fd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{w.number}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{w.title}</div>
                <div style={{ color: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{w.range}</div>
              </div>
              {w.breakthrough && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>★ BREAKTHROUGH</span>}
              {w.critical && <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>⚠ CRITICAL</span>}
              <span style={{ color: '#475569' }}>{expandedWave === w.number ? '▾' : '▸'}</span>
            </div>
            {expandedWave === w.number && (
              <div style={{ marginTop: 10, paddingLeft: 40, color: '#cbd5e1', fontSize: 12, lineHeight: 1.7 }}>
                <p style={{ marginBottom: 8 }}>{w.summary}</p>
                <div style={{ color: '#94a3b8', fontSize: 11 }}>
                  Key results:{' '}
                  {w.keyResults.map((k, i) => (
                    <span key={k}>
                      <span style={{ color: '#38bdf8' }}>{k}</span>
                      {i < w.keyResults.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
                {w.breakthrough && (
                  <div style={{ marginTop: 6, color: '#10b981', fontSize: 11 }}>
                    Breakthrough: {w.breakthrough}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Withdrawn Claims */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 15, marginBottom: 12 }}>Withdrawn Claims (Honest Self-Correction)</h3>
        {withdrawn.map(w => (
          <div key={w.id} style={{
            marginBottom: 10, padding: '10px 14px', borderRadius: 6,
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 600, flex: 1 }}>
                {w.name}
              </span>
              <span style={{
                fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-mono)',
              }}>found by {w.foundBy}</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6 }}>
              {w.reason}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="card" style={{ borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Explore Further</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
          <Link to="/proof-explorer" style={{ color: '#38bdf8' }}>Proof Explorer</Link>
          <Link to="/wiki" style={{ color: '#38bdf8' }}>Wiki</Link>
          <Link to="/dashboard" style={{ color: '#38bdf8' }}>Dashboard</Link>
          <Link to="/blog" style={{ color: '#38bdf8' }}>Blog</Link>
          <Link to="/literature" style={{ color: '#38bdf8' }}>Literature</Link>
          <Link to="/improvements" style={{ color: '#38bdf8' }}>All Improvements</Link>
        </div>
      </div>
    </div>
  );
}
