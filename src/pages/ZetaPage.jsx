import React from 'react';
import ZetaLandscapeViz from '../components/ZetaLandscapeViz.jsx';
import { BlockMath } from '../components/KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';

export default function ZetaPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Zeta Function Landscape</h1>
        <p>
          Explore the Riemann zeta function across the critical strip. The Riemann-Siegel Z(t)
          function shows zeta on the critical line, while the heatmap reveals the full 2D structure.
        </p>
      </div>

      <BlockMath tex="Z(t) = e^{i\\theta(t)} \\zeta(1/2 + it), \\quad Z(t) \\in \\mathbb{R}" />

      <ZetaLandscapeViz />

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3>Known Nontrivial Zeros</h3>
          <p style={{ marginBottom: 12 }}>First {ZETA_ZEROS.length} imaginary parts γ_n of zeros ρ = ½ + iγ_n</p>
          <div style={{
            maxHeight: 360,
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 2,
          }}>
            {ZETA_ZEROS.map((z, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', borderBottom: '1px solid rgba(42,48,80,0.3)' }}>
                <span style={{ color: '#64748b' }}>γ_{(i + 1).toString().padStart(2, '0')}</span>
                <span style={{ color: '#06b6d4' }}>{z.toFixed(6)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Zeta Zero Statistics</h3>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>Mean spacing (first 50 zeros)</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#3b82f6', marginTop: 4 }}>
                {((ZETA_ZEROS[49] - ZETA_ZEROS[0]) / 49).toFixed(4)}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>First zero</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#f59e0b', marginTop: 4 }}>
                γ₁ = {ZETA_ZEROS[0].toFixed(6)}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>50th zero</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#8b5cf6', marginTop: 4 }}>
                γ₅₀ = {ZETA_ZEROS[49].toFixed(6)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <BlockMath tex="N(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}" />
            <p style={{ fontSize: 13, marginTop: 8 }}>
              The zero counting function N(T) counts zeros with 0 &lt; γ &lt; T. The average spacing
              decreases as 2π/log(T/2π), reflecting the increasing density of oscillator modes.
            </p>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#10b981' }}>
              <strong>Circuit interpretation:</strong> The zero density is the mode density of the
              oscillator chain. As frequency increases, modes pack more tightly — the density of
              states grows logarithmically, exactly matching a 1D system with logarithmic dispersion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
