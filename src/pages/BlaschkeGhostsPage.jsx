import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { BLASCHKE_GHOSTS_SECTION } from '../data/blaschke-ghosts-section.js';
import DownstreamVerdictCallout from '../components/DownstreamVerdictCallout.jsx';

/**
 * BlaschkeGhostsPage — renders §17 "Attack on the Wall: Inverse Blaschke
 * Ghosts and the Pontryagin Decomposition" from the user's paper at
 * research-inputs/twin_ladder_consolidated_v52.pdf (pages 22-26).
 *
 * Includes an interactive demo: move a hypothetical off-critical zero
 * around in the right half-plane and watch the negative-square count
 * update according to Corollary 17.2.
 */

const S = BLASCHKE_GHOSTS_SECTION;

function Card({ children, accent = '#1e293b' }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      border: `1px solid ${accent}`,
      borderRadius: 10,
      padding: '20px 24px',
      margin: '16px 0',
    }}>{children}</div>
  );
}

function GhostInteractiveDemo() {
  const [delta, setDelta] = useState(0.10);   // horizontal displacement of hypothetical zero
  const [gamma, setGamma] = useState(14.13);  // imaginary part (default near γ_1)
  const [a, setA] = useState(0.05);           // bridge thickness

  const ghostPresent = delta > a;
  const negativeSquareWeight = ghostPresent ? 2 * (delta - a) : 0;

  return (
    <Card accent="#7c3aed">
      <h3 style={{ color: '#a78bfa', fontSize: 18, margin: '0 0 12px 0' }}>
        Interactive: Ghost negative-square witness
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px 0' }}>
        Place a hypothetical off-critical zero <InlineMath math="\rho = 1/2 + \delta + i\gamma" /> and
        choose a bridge thickness <InlineMath math="a > 0" />. The Corollary 17.2 witness fires iff{' '}
        <InlineMath math="\delta > a" />.
      </p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr', marginBottom: 16 }}>
        <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }}>
          δ (horizontal displacement): {delta.toFixed(3)}
          <input
            type="range" min="0" max="0.5" step="0.005"
            value={delta} onChange={(e) => setDelta(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
        </label>
        <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }}>
          γ (imaginary part): {gamma.toFixed(2)}
          <input
            type="range" min="0" max="50" step="0.5"
            value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
        </label>
        <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }}>
          a (bridge thickness): {a.toFixed(3)}
          <input
            type="range" min="0.001" max="0.5" step="0.001"
            value={a} onChange={(e) => setA(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
        </label>
      </div>

      <div style={{
        padding: 12,
        background: ghostPresent ? 'rgba(239,68,68,0.10)' : 'rgba(16,185,129,0.10)',
        border: `1px solid ${ghostPresent ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
        borderRadius: 6,
      }}>
        <div style={{
          color: ghostPresent ? '#fca5a5' : '#86efac',
          fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono, monospace)',
          letterSpacing: 0.5,
        }}>
          {ghostPresent ? 'GHOST PRESENT — POSITIVITY FAILS' : 'NO GHOST — BRIDGE IS SCHUR'}
        </div>
        <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
          {ghostPresent ? (
            <>
              Pole of <InlineMath math="R_a" /> at <InlineMath math={`\\alpha = (${delta.toFixed(3)} - ${a.toFixed(3)}) + i \\cdot ${gamma.toFixed(2)} = ${(delta - a).toFixed(3)} + ${gamma.toFixed(2)} i`} />.
              <br />Negative-square weight: <InlineMath math={`-2(\\delta - a) = -${negativeSquareWeight.toFixed(3)}`} />.
            </>
          ) : (
            <>The zero’s horizontal displacement δ = {delta.toFixed(3)} ≤ a = {a.toFixed(3)}, so no right-half-plane pole appears in <InlineMath math="R_a" />.</>
          )}
        </div>
      </div>
    </Card>
  );
}

function FourRouteDecomposition() {
  // Tiny SVG showing 4 routes converging to a "ghost-absence" shared bottleneck.
  return (
    <svg width="100%" viewBox="0 0 600 240" style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 8 }}>
      {/* Routes */}
      {[
        { x: 80, y: 40,  label: 'Route A', sub: 'Schur', color: '#3b82f6' },
        { x: 80, y: 100, label: 'Route B', sub: 'de Branges', color: '#8b5cf6' },
        { x: 80, y: 160, label: 'Route C', sub: 'Hidden-square', color: '#ec4899' },
        { x: 80, y: 220, label: 'Route D', sub: 'Weil / TL', color: '#f59e0b' },
      ].map((r) => (
        <g key={r.label}>
          <rect x={r.x - 50} y={r.y - 16} width="100" height="32" rx="6" fill={r.color} fillOpacity="0.2" stroke={r.color} strokeWidth="1.5" />
          <text x={r.x} y={r.y - 2} fill={r.color} textAnchor="middle" fontSize="13" fontWeight="700">{r.label}</text>
          <text x={r.x} y={r.y + 12} fill="#cbd5e1" textAnchor="middle" fontSize="10">{r.sub}</text>
          <line x1={r.x + 50} y1={r.y} x2={400} y2={130} stroke={r.color} strokeOpacity="0.6" strokeWidth="1" />
        </g>
      ))}
      {/* Shared bottleneck */}
      <rect x="400" y="110" width="160" height="40" rx="8" fill="#dc2626" fillOpacity="0.15" stroke="#dc2626" strokeWidth="2" />
      <text x="480" y="128" fill="#fca5a5" textAnchor="middle" fontSize="13" fontWeight="700">Ghost-absence</text>
      <text x="480" y="142" fill="#cbd5e1" textAnchor="middle" fontSize="10">B⁺_a ≡ 1 ⇔ RH (a → 0)</text>
    </svg>
  );
}

export default function BlaschkeGhostsPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', letterSpacing: 1 }}>
          /blaschke-ghosts · paper {S.paperSection} · pp. {S.paperPageRange}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', margin: '8px 0 4px 0' }}>
          {S.title}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
          {S.oneLine}
        </p>
      </header>

      <DownstreamVerdictCallout />

      {/* Shifted scattering ratio */}
      <Card>
        <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>§17.1 The shifted scattering ratio</h3>
        <BlockMath math="R_a(w) := \frac{X(w-a)}{X(w+a)}, \quad \mathfrak{R}w > 0,\ a > 0,\quad X(w) := \xi(\tfrac{1}{2} + w)" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          On the boundary <InlineMath math="\mathfrak{R}w = 0" /> the functional equation gives <InlineMath math="|R_a(it)|=1" />.
          If <InlineMath math="X(\lambda)=0" /> with <InlineMath math="\lambda=\delta+i\gamma" />,
          then <InlineMath math="R_a" /> has a right-half-plane pole at <InlineMath math="\alpha=(\delta-a)+i\gamma" /> exactly when <InlineMath math="\delta>a" />.
        </p>
      </Card>

      {/* Blaschke ghost factor + pole-clearing */}
      <Card>
        <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>§17.2 Right-half-plane Blaschke ghosts</h3>
        <BlockMath math="b_\alpha(w) := \frac{w-\alpha}{w+\alpha} \quad (\mathfrak{R}\alpha > 0)" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          <InlineMath math="|b_\alpha(it)|=1" /> on the boundary; <InlineMath math="b_\alpha" /> has a zero at <InlineMath math="w=\alpha" />,
          so multiplying <InlineMath math="R_a" /> by <InlineMath math="b_\alpha" /> removes the pole there.
          The ghost Blaschke product over all off-critical-zero poles:
        </p>
        <BlockMath math="B_a^+(w) := \prod_{\alpha \in P_a} b_\alpha(w), \qquad P_a := \{\lambda - a : X(\lambda)=0,\ \mathfrak{R}\lambda > a\}" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>
          <strong style={{ color: '#fbbf24' }}>Proposition 17.1 (pole-clearing decomposition):</strong>
          <InlineMath math=" R_a = \widetilde{R}_a / B_a^+" />, where <InlineMath math="\widetilde{R}_a" /> is meromorphic-free in the right half-plane.
          If <InlineMath math="B_a^+ \equiv 1" /> the bridge is Schur; otherwise positivity fails by explicit negative-square channels.
        </p>
      </Card>

      {/* The headline §17.3 result */}
      <Card accent="#fbbf24">
        <h3 style={{ color: '#fbbf24', fontSize: 18, margin: '0 0 12px 0' }}>
          §17.3 One ghost = one negative square
        </h3>
        <BlockMath math="K_S(z,w) = \frac{1 - S(z)\overline{S(w)}}{z+\bar{w}}" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          For a single inverse Blaschke factor <InlineMath math="S(w) = 1/b_\alpha(w) = (w+\alpha)/(w-\alpha)" />:
        </p>
        <BlockMath math="K_S(z,w) = -\frac{2\,\mathfrak{R}\alpha}{(z-\alpha)(\bar{w}-\bar{\alpha})} = -k_\alpha(z)\,\overline{k_\alpha(\bar{w})},\quad k_\alpha(z) = \frac{\sqrt{2\,\mathfrak{R}\alpha}}{z-\alpha}" />
        <p style={{ color: '#fbbf24', fontSize: 15, fontWeight: 700, lineHeight: 1.6, marginTop: 12 }}>
          ONE inverse Blaschke ghost contributes EXACTLY ONE rank-one negative square. This is the operator-theoretic
          form of the Gödelian witness principle from §15.
        </p>
      </Card>

      {/* Interactive demo */}
      <GhostInteractiveDemo />

      {/* Generalized Schur */}
      <Card>
        <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>§17.4 Negative-index identity (Krein-Langer)</h3>
        <BlockMath math="\mathrm{ind}_-\!\bigl(K_{R_a}\bigr) = \#\bigl\{\lambda : X(\lambda)=0,\ \mathfrak{R}\lambda > a\bigr\}\quad\text{(with multiplicity)}" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          The number of negative squares in the Schur kernel of <InlineMath math="R_a" /> is EXACTLY the number of off-critical zeros
          whose horizontal displacement exceeds <InlineMath math="a" />. The Riemann Hypothesis is the statement that
          this count is 0 for every <InlineMath math="a > 0" /> (equivalently, in the limit <InlineMath math="a \to 0" />).
        </p>
      </Card>

      {/* Four-route consequences */}
      <Card>
        <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>§17.5 Consequences for the four closure routes</h3>
        <FourRouteDecomposition />
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {S.fourRouteConsequences.map((r) => (
            <div key={r.route} style={{ padding: 10, background: 'rgba(15,23,42,0.5)', borderRadius: 6 }}>
              <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>
                Route {r.route}: {r.name}
              </div>
              <div style={{ marginTop: 6 }}>
                <BlockMath math={r.consequence.replace(/⇔/g, '\\iff').replace(/⪰/g, '\\succeq').replace(/∅/g, '\\emptyset').replace(/Σ/g, '\\sum').replace(/‖/g, '\\|').replace(/⟨/g, '\\langle').replace(/⟩/g, '\\rangle')} />
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>{r.reading}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Conjecture 17.3 */}
      <Card accent="#dc2626">
        <h3 style={{ color: '#fca5a5', fontSize: 18, margin: '0 0 12px 0' }}>§17.6 The sharpened wall</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
          <strong style={{ color: '#fca5a5' }}>Conjecture 17.3 (Ghost-absence theorem).</strong>{' '}
          For every <InlineMath math="a > 0" />, the right-half-plane ghost Blaschke product <InlineMath math="B_a^+(w)" /> is identically 1.
        </p>
        <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, marginTop: 10, paddingLeft: 22 }}>
          {S.sharpenedWall.equivalentReformulations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Card>

      {/* Three attempted closures */}
      <Card>
        <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>§17.7 Attempted non-circular closures</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
          Three programs aim to prove ghost-absence without assuming RH:
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          {S.attemptedClosures.map((a) => (
            <div key={a.id} style={{ padding: 10, background: 'rgba(15,23,42,0.5)', borderRadius: 6, borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>{a.name} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({a.paperSection})</span></div>
              <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>{a.description}</div>
              <div style={{ color: '#fca5a5', fontSize: 11, marginTop: 6, fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}>
                status: {a.status}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <Link to="/three-attacks" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 13 }}>
            → See the dedicated /three-attacks page for §18 detail
          </Link>
        </div>
      </Card>

      {/* Related */}
      <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
          Related pages:
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/shift-bridge-positivity" style={{ color: '#60a5fa', fontSize: 13 }}>/shift-bridge-positivity</Link>
          <Link to="/closure-routes" style={{ color: '#60a5fa', fontSize: 13 }}>/closure-routes</Link>
          <Link to="/three-attacks" style={{ color: '#60a5fa', fontSize: 13 }}>/three-attacks</Link>
          <Link to="/reciprocal-program" style={{ color: '#60a5fa', fontSize: 13 }}>/reciprocal-program</Link>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono, monospace)' }}>
          Source: {S.paperSourcePath} {S.paperSection} (pp. {S.paperPageRange})
        </div>
      </footer>
    </main>
  );
}
