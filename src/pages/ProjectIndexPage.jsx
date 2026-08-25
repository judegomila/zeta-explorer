import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { waves, keyResults, withdrawn, projectStats } from '../data/wave-index.js';

/**
 * Project Index page: navigable summary of all project improvements.
 * The count is sourced live from projectStats.totalImprovements (wave-index.js);
 * never inline a frozen literal here so the header cannot drift from the data.
 *
 * Editorial (warm) re-theme: identical data-driven index list + interactivity.
 * Category accent colors (dark -> warm standard set):
 *   #10b981 green  -> #4c7a4a (var(--green))
 *   #3b82f6 blue   -> #3f6b86 (var(--blue))
 *   #f59e0b amber  -> #b58a2e (var(--brass-dk))
 *   #8b5cf6 purple -> #d9502e (var(--terra))
 *   #ef4444 red    -> #c23a1c (var(--terra-dk))
 *   #06b6d4 cyan   -> #3f6b86 (var(--blue), shares hue w/ blue, per convention)
 */
export default function ProjectIndexPage() {
  const [expandedWave, setExpandedWave] = useState(null);

  const statusColors = {
    'PROVEN': '#4c7a4a',
    'PROVEN (exact)': '#4c7a4a',
    'VERIFIED': '#3f6b86',
    'OPEN (~80%)': '#b58a2e',
    'UNIFICATION (7 frameworks)': '#d9502e',
  };

  const impactColors = {
    critical: '#c23a1c',
    high: '#b58a2e',
    medium: '#3f6b86',
  };

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Project Index</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Navigable summary of all {projectStats.totalImprovements} improvements across
            {' '}{projectStats.wavesCompleted} waves, organized by topic and outcome.
          </p>
        </div>

        {/* Project Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Improvements', value: projectStats.totalImprovements, color: '#3f6b86' },
            { label: 'Math Modules', value: projectStats.mathModules, color: '#d9502e' },
            { label: 'Waves', value: projectStats.wavesCompleted, color: '#4c7a4a' },
            { label: 'Self-corrections', value: projectStats.selfCorrections, color: '#b58a2e' },
            { label: 'Self-corrected', value: projectStats.withdrawnClaims, color: '#c23a1c' },
            { label: 'LP Confidence', value: projectStats.bayesianConfidence, color: '#3f6b86' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '12px 16px', borderRadius: 8, background: `${s.color}10`,
              border: `1px solid ${s.color}30`, textAlign: 'center',
            }}>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: 'var(--faint)', fontSize: 10, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Current Research Status */}
        <div className="card" style={{ marginBottom: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--terra)', borderRadius: 8, padding: '16px 18px' }}>
          <h3 style={{ color: 'var(--terra)', fontSize: 15, marginBottom: 12 }}>Current Research Status</h3>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ color: 'var(--ink-soft)', fontSize: 12 }}>Bayesian confidence (Lax-Phillips path)</span>
              <span style={{ color: 'var(--terra)', fontWeight: 700, fontSize: 14, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>~80%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(217,80,46,0.15)', overflow: 'hidden' }}>
              <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #c23a1c, #d9502e)', borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 6, background: 'rgba(181,138,46,0.06)', border: '1px solid rgba(181,138,46,0.30)' }}>
            <div style={{ color: 'var(--brass-dk)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Single Remaining Open Gap</div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6 }}>
              Prove the Lax-Phillips scattering operator for the Twin-Ladder Bridge Hamiltonian satisfies the LP contraction semigroup axioms.
              If confirmed, poles of S&#x2082;&#x2081; are confined to &#x3c3;=&#xbd;, closing the proof.
            </div>
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 11, lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--ink-soft)' }}>What is RH?</strong>{' '}
            The Riemann Hypothesis asks whether all non-trivial zeros of &#x3b6;(s) lie on Re(s)=&#xbd;.
            The Twin-Ladder Bridge approach encodes this via an S-matrix: &#x3b6;-zeros are poles of S&#x2082;&#x2081; = &#x3b6;(2s)/&#x3b6;(s),
            and Lax-Phillips operator theory bounds where those poles can live.
          </div>
        </div>

        {/* Key Results */}
        <div className="card" style={{ marginBottom: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--green)', borderRadius: 8, padding: '16px 18px' }}>
          <h3 style={{ color: 'var(--green)', fontSize: 15, marginBottom: 12 }}>Key Results</h3>
          {keyResults.map(r => (
            <div key={r.id} style={{
              marginBottom: 10, padding: '10px 14px', borderRadius: 6,
              background: 'var(--paper)', border: '1px solid var(--hairline)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, fontWeight: 600,
                  color: 'var(--faint)', padding: '2px 8px', background: 'var(--paper2)', borderRadius: 4,
                  border: '1px solid var(--hairline)',
                }}>{r.id}</span>
                <span style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600, flex: 1 }}>
                  {r.name}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: `${statusColors[r.status] || '#64748b'}20`,
                  color: statusColors[r.status] || 'var(--faint)',
                }}>{r.status}</span>
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  background: `${impactColors[r.impact]}15`,
                  color: impactColors[r.impact],
                }}>{r.impact.toUpperCase()}</span>
              </div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6 }}>
                {r.description}
              </div>
            </div>
          ))}
        </div>

        {/* Waves Timeline */}
        <div className="card" style={{ marginBottom: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--blue)', borderRadius: 8, padding: '16px 18px' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 15, marginBottom: 12 }}>Waves Timeline</h3>
          {waves.map(w => (
            <div key={w.number} style={{
              marginBottom: 8, padding: '10px 14px', borderRadius: 6,
              background: 'var(--paper)',
              border: `1px solid ${w.breakthrough ? 'rgba(76,122,74,0.35)' : w.critical ? 'rgba(181,138,46,0.35)' : 'var(--hairline)'}`,
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
                  background: 'rgba(63,107,134,0.15)', color: 'var(--blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{w.number}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600 }}>{w.title}</div>
                  <div style={{ color: 'var(--faint)', fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{w.range}</div>
                </div>
                {w.breakthrough && <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>&#9733; BREAKTHROUGH</span>}
                {w.critical && <span style={{ fontSize: 10, color: 'var(--brass-dk)', fontWeight: 700 }}>&#9888; CRITICAL</span>}
                <span style={{ color: 'var(--faint)' }}>{expandedWave === w.number ? '▾' : '▸'}</span>
              </div>
              {expandedWave === w.number && (
                <div style={{ marginTop: 10, paddingLeft: 40, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7 }}>
                  <p style={{ marginBottom: 8 }}>{w.summary}</p>
                  <div style={{ color: 'var(--faint)', fontSize: 11 }}>
                    Key results:{' '}
                    {w.keyResults.map((k, i) => (
                      <span key={k}>
                        <span style={{ color: 'var(--blue)' }}>{k}</span>
                        {i < w.keyResults.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                  {w.breakthrough && (
                    <div style={{ marginTop: 6, color: 'var(--green)', fontSize: 11 }}>
                      Breakthrough: {w.breakthrough}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Withdrawn Claims */}
        <div className="card" style={{ marginBottom: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--terra-dk)', borderRadius: 8, padding: '16px 18px' }}>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 15, marginBottom: 12 }}>Corrected Claims (Self-Correction)</h3>
          {withdrawn.map(w => (
            <div key={w.id} style={{
              marginBottom: 10, padding: '10px 14px', borderRadius: 6,
              background: 'rgba(194,58,28,0.05)', border: '1px solid rgba(194,58,28,0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ color: 'var(--terra-dk)', fontSize: 13, fontWeight: 600, flex: 1 }}>
                  {w.name}
                </span>
                <span style={{
                  fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))',
                }}>found by {w.foundBy}</span>
              </div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.6 }}>
                {w.reason}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="card" style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--blue)', borderRadius: 8, padding: '16px 18px' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>Explore Further</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
            <Link to="/proof-explorer" style={{ color: 'var(--blue)' }}>Proof Explorer</Link>
            <Link to="/wiki" style={{ color: 'var(--blue)' }}>Wiki</Link>
            <Link to="/dashboard" style={{ color: 'var(--blue)' }}>Dashboard</Link>
            <Link to="/blog" style={{ color: 'var(--blue)' }}>Blog</Link>
            <Link to="/literature" style={{ color: 'var(--blue)' }}>Literature</Link>
            <Link to="/improvements" style={{ color: 'var(--blue)' }}>All Improvements</Link>
          </div>
        </div>

        {/* Related */}
        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Related pages:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/proof-explorer" style={{ color: 'var(--blue)', fontSize: 13 }}>/proof-explorer</Link>
            <Link to="/wiki" style={{ color: 'var(--blue)', fontSize: 13 }}>/wiki</Link>
            <Link to="/dashboard" style={{ color: 'var(--blue)', fontSize: 13 }}>/dashboard</Link>
            <Link to="/improvements" style={{ color: 'var(--blue)', fontSize: 13 }}>/improvements</Link>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/">&larr; the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
