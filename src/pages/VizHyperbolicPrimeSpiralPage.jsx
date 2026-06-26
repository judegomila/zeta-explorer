import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sieveOfEratosthenes } from '../math/primes.js';
import { VIZ_HYPERBOLIC_PRIME_SPIRAL } from '../data/viz-hyperbolic-prime-spiral.js';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

/**
 * VizHyperbolicPrimeSpiralPage — primes embedded in the Poincaré disk via
 *   r(p) = log(p) / log(p_max)
 *   θ(p) = φ_0 · log(p)   mod 2π
 *
 * Colored by p mod 4 (1 mod 4 blue, 3 mod 4 red, 2 orange).
 * Pure SVG render (no Canvas dependency).
 */

const S = VIZ_HYPERBOLIC_PRIME_SPIRAL;

function colorForPrime(p) {
  if (p === 2) return '#f59e0b';       // amber
  if (p % 4 === 1) return '#3b82f6';   // blue
  return '#ef4444';                    // red (3 mod 4)
}

function PrimeDisk({ maxPrime, phase, amplitude, showGeodesic }) {
  const SIZE = 700;
  const R = 320;                       // disk radius in pixels
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  const points = useMemo(() => {
    const primes = sieveOfEratosthenes(maxPrime);
    const logMax = Math.log(maxPrime);
    return primes.map((p) => {
      const r = Math.pow(Math.log(p) / logMax, amplitude);  // radial exponent spreads or compresses distribution
      const theta = (phase * Math.log(p)) % (2 * Math.PI);
      const x = CX + R * r * Math.cos(theta);
      const y = CY + R * r * Math.sin(theta);
      return { p, x, y, color: colorForPrime(p) };
    });
  }, [maxPrime, phase, amplitude]);

  return (
    <svg width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ background: 'rgba(15,23,42,0.7)', borderRadius: 8 }}>
      {/* Unit disk boundary */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#475569" strokeWidth="1" />

      {/* Concentric reference rings at log(p)/log(p_max) for p = 10, 100, 1000 */}
      {[10, 100, 1000, 10000].filter((p) => p <= maxPrime).map((p) => {
        const r = (Math.log(p) / Math.log(maxPrime)) * R;
        return (
          <g key={p}>
            <circle cx={CX} cy={CY} r={r} fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" />
            <text x={CX + r + 4} y={CY - 2} fill="#64748b" fontSize="10" fontFamily="monospace">p={p}</text>
          </g>
        );
      })}

      {/* Optional critical-line geodesic: the unit-circle-orthogonal arc through the points
          (φ=0, r=0) and (φ=π, r=0), which is just the horizontal diameter.
          For the actual critical-line lift we use a circle of radius R/√2 centered at (CX-R/√2, CY)
          orthogonal to the boundary. */}
      {showGeodesic && (
        <g>
          <circle
            cx={CX - R / Math.sqrt(2)}
            cy={CY}
            r={R / Math.sqrt(2)}
            fill="none"
            stroke="#10b981"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x={CX} y={CY + R + 24} fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle">
            critical-line geodesic (σ=1/2 lift)
          </text>
        </g>
      )}

      {/* Prime dots */}
      {points.map((pt) => (
        <circle key={pt.p} cx={pt.x} cy={pt.y} r="1.6" fill={pt.color} fillOpacity="0.85" />
      ))}

      {/* Legend */}
      <g transform="translate(20, 20)">
        <circle cx="6" cy="6" r="3" fill="#3b82f6" /><text x="14" y="10" fill="#cbd5e1" fontSize="11" fontFamily="monospace">p ≡ 1 (mod 4)</text>
        <circle cx="6" cy="26" r="3" fill="#ef4444" /><text x="14" y="30" fill="#cbd5e1" fontSize="11" fontFamily="monospace">p ≡ 3 (mod 4)</text>
        <circle cx="6" cy="46" r="3" fill="#f59e0b" /><text x="14" y="50" fill="#cbd5e1" fontSize="11" fontFamily="monospace">p = 2</text>
      </g>

      {/* Counter */}
      <text x={SIZE - 20} y={SIZE - 12} fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="end">
        {points.length} primes, p ≤ {maxPrime}
      </text>
    </svg>
  );
}

export default function VizHyperbolicPrimeSpiralPage() {
  const [maxPrime, setMaxPrime] = useState(5000);
  const [phase, setPhase] = useState(1.0);
  const [amplitude, setAmplitude] = useState(1.0);
  const [showGeodesic, setShowGeodesic] = useState(true);

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', letterSpacing: 1 }}>
          /viz-hyperbolic-prime-spiral · visualizations
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', margin: '8px 0 4px 0' }}>{S.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>{S.oneLine}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {/* Controls + diagram */}
        <div style={{
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid #1e293b',
          borderRadius: 10,
          padding: 20,
        }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }}>
              max prime: {maxPrime}
              <input type="range" min="100" max="50000" step="100" value={maxPrime}
                onChange={(e) => setMaxPrime(parseInt(e.target.value, 10))}
                style={{ width: '100%', marginTop: 6 }} />
            </label>
            <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }}>
              phase φ₀: {phase.toFixed(3)}
              <input type="range" min={-Math.PI.toFixed(3)} max={Math.PI.toFixed(3)} step="0.01" value={phase}
                onChange={(e) => setPhase(parseFloat(e.target.value))}
                style={{ width: '100%', marginTop: 6 }} />
            </label>
            <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }}>
              radial exponent α: {amplitude.toFixed(2)}
              <input type="range" min="0.2" max="3.0" step="0.05" value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                style={{ width: '100%', marginTop: 6 }} />
            </label>
            <label style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'var(--font-mono, monospace)', alignSelf: 'end' }}>
              <input type="checkbox" checked={showGeodesic}
                onChange={(e) => setShowGeodesic(e.target.checked)} style={{ marginRight: 8 }} />
              show critical-line geodesic
            </label>
          </div>
          <PrimeDisk maxPrime={maxPrime} phase={phase} amplitude={amplitude} showGeodesic={showGeodesic} />
        </div>

        {/* Math + interpretation */}
        <div style={{
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid #1e293b',
          borderRadius: 10,
          padding: '20px 24px',
        }}>
          <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>Embedding</h3>
          <pre style={{
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid #1e293b',
            borderRadius: 6,
            padding: 12,
            color: '#cbd5e1',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            overflow: 'auto',
          }}>{S.math.embedding}</pre>
          <div style={{ marginTop: 10, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            {S.math.discMetric}<br/>{S.math.defaultPhase}<br/>{S.math.pModFourColors}
          </div>
        </div>

        <div style={{
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid #1e293b',
          borderRadius: 10,
          padding: '20px 24px',
        }}>
          <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>What to look for</h3>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, paddingLeft: 22, margin: 0 }}>
            {S.visualizationNotes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>

        <div style={{
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid #1e293b',
          borderRadius: 10,
          padding: '20px 24px',
        }}>
          <h3 style={{ color: '#60a5fa', fontSize: 18, margin: '0 0 12px 0' }}>RH interpretation</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {Object.entries(S.interpretationForRH).map(([k, v]) => (
              <div key={k} style={{ padding: 10, background: 'rgba(15,23,42,0.5)', borderRadius: 6 }}>
                <div style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>{k}</div>
                <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>Sibling visualizations:</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/viz-log-phase-spiral" style={{ color: '#60a5fa', fontSize: 13 }}>/viz-log-phase-spiral</Link>
          <Link to="/viz-twin-ladder-tomography" style={{ color: '#60a5fa', fontSize: 13 }}>/viz-twin-ladder-tomography</Link>
          <Link to="/viz-euler-transport-flow" style={{ color: '#60a5fa', fontSize: 13 }}>/viz-euler-transport-flow</Link>
          <Link to="/viz-prime-caustic" style={{ color: '#60a5fa', fontSize: 13 }}>/viz-prime-caustic</Link>
          <Link to="/viz-prime-phase-crystal" style={{ color: '#60a5fa', fontSize: 13 }}>/viz-prime-phase-crystal</Link>
        </div>
      </footer>

      <VizCeilingNote
        as="div"
        claim="prime positions on a log-spiral re-derive the multiplicative resonance angle θ = t·log p"
      />
    </main>
  );
}
