import React from 'react';
import ZetaLandscapeViz from '../components/ZetaLandscapeViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';

export default function ZetaPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Zeta Function Landscape</h1>
        <p>
          Explore the Riemann zeta function across the critical strip. The Riemann-Siegel <InlineMath tex="Z(t)" />
          function shows zeta on the critical line, while the heatmap reveals the full 2D structure.
        </p>
      </div>

      <BlockMath tex="Z(t) = e^{i\\theta(t)} \\zeta(1/2 + it), \\quad Z(t) \\in \\mathbb{R}" />

      <ZetaLandscapeViz />

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>What to Explore</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#3b82f6' }}>Critical Line mode:</strong> watch <InlineMath tex="Z(t)" /> oscillate
            with increasing "frequency" as <InlineMath tex="t" /> grows — the local wavelength
            shrinks as <InlineMath tex="2\pi/\log(t/2\pi)" />. Red dots mark sign changes (zeros); compare their
            positions to the <InlineMath tex="\gamma_n" /> table below.
          </li>
          <li>
            <strong style={{ color: '#f59e0b' }}>Heatmap mode:</strong> switch to the <InlineMath tex="|\zeta(\sigma+it)|" /> landscape
            and look for dark valleys pinching inward to the center line <InlineMath tex="\sigma = 1/2" />. RH
            asserts every valley bottom sits exactly on that line. Drag the t-range to higher values
            to see zeros pack more tightly.
          </li>
          <li>
            <strong style={{ color: '#10b981' }}>Colorbar &amp; scale:</strong> in heatmap mode, the colorbar maps brightness
            to <InlineMath tex="|\zeta|" />. Near a zero the magnitude plunges to near 0 (black); away from the
            critical strip it grows rapidly due to the pole at <InlineMath tex="s = 1" /> and the trivial zeros.
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h3 style={{ color: '#8b5cf6' }}>Computing <InlineMath tex="Z(t)" />: The Riemann-Siegel Formula</h3>
        <p style={{ marginTop: 8 }}>
          Evaluating <InlineMath tex="\zeta(1/2 + it)" /> directly would require summing a slowly-converging Dirichlet series.
          The Riemann-Siegel formula exploits the functional equation to give a rapidly convergent approximation
          using only <InlineMath tex="N = \lfloor\sqrt{t/2\pi}\rfloor" /> terms — a dramatic speedup for large <InlineMath tex="t" />.
        </p>
        <BlockMath tex="Z(t) \;\approx\; 2\sum_{n=1}^{N} \frac{\cos\bigl(\theta(t) - t\log n\bigr)}{\sqrt{n}} \;+\; (-1)^{N-1}\!\left(\frac{t}{2\pi}\right)^{\!-1/4}\! C_0(p)" />
        <div className="two-col" style={{ marginTop: 12, gap: 16 }}>
          <div>
            <p style={{ fontSize: 13 }}>
              <strong style={{ color: '#06b6d4' }}>Main sum</strong> — Each term is a cosine oscillation at
              frequency <InlineMath tex="\log n" />, damped by <InlineMath tex="1/\sqrt{n}" />, and phase-shifted
              by the Riemann-Siegel theta function <InlineMath tex="\theta(t)" />. In the oscillator model,
              these are the natural modes of the chain at integer frequencies.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13 }}>
              <strong style={{ color: '#f59e0b' }}>Correction term</strong> — The <InlineMath tex="C_0(p)" /> term
              (where <InlineMath tex="p = \sqrt{t/2\pi} - N" /> is the fractional part) accounts for the
              truncation of the sum at <InlineMath tex="N" />, improving accuracy
              from <InlineMath tex="O(t^{-1/4})" /> to <InlineMath tex="O(t^{-3/4})" />.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#a78bfa' }}>
            <strong>The theta function:</strong> <InlineMath tex="\theta(t) \approx \tfrac{t}{2}\log\!\tfrac{t}{2\pi} - \tfrac{t}{2} - \tfrac{\pi}{8}" /> is
            the phase accumulator that "unwinds" the complex phase of <InlineMath tex="\zeta(1/2 + it)" />, making <InlineMath tex="Z(t)" /> real-valued.
            Its derivative <InlineMath tex="\theta'(t) \approx \tfrac{1}{2}\log(t/2\pi)" /> gives the local density of zeros via the Weyl law.
          </p>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Why <InlineMath tex="Z(t)" />? Real-Valued Zero Detection</h3>
          <p style={{ marginTop: 8 }}>
            The raw zeta function <InlineMath tex="\zeta(1/2 + it)" /> is complex-valued, so its zeros are hard to see on a
            plot — you'd need both real and imaginary parts to vanish simultaneously. The Riemann-Siegel
            <InlineMath tex="Z" /> function multiplies by a phase factor <InlineMath tex="e^{i\theta(t)}" /> that "straightens" zeta into
            a real-valued function. Now zeros appear as simple sign changes, making them easy to locate
            and count by watching <InlineMath tex="Z(t)" /> cross through zero.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Reading the Heatmap</h3>
          <p style={{ marginTop: 8 }}>
            The 2D landscape plots <InlineMath tex="|\zeta(\sigma + it)|" /> across the critical strip <InlineMath tex="0 < \sigma < 1" />.
            Dark regions mark where <InlineMath tex="|\zeta|" /> is small; the deepest valleys at <InlineMath tex="\sigma = 1/2" /> are
            the nontrivial zeros. The vertical center line is the critical line. Notice how <InlineMath tex="|\zeta|" /> grows
            as <InlineMath tex="\sigma \to 0" /> or <InlineMath tex="\sigma \to 1" />, with the zero valleys pinching inward — RH asserts they
            all sit exactly on the center line.
          </p>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3>Known Nontrivial Zeros</h3>
          <p style={{ marginBottom: 12 }}>First {ZETA_ZEROS.length} imaginary parts <InlineMath tex="\\gamma_n" /> of zeros <InlineMath tex="\\rho = \\tfrac{1}{2} + i\\gamma_n" /></p>
          <div style={{
            maxHeight: 360,
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 2,
          }}>
            {ZETA_ZEROS.map((z, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', borderBottom: '1px solid rgba(42,48,80,0.3)' }}>
                <span style={{ color: '#64748b' }}><InlineMath tex={`\\gamma_{${(i + 1).toString().padStart(2, '0')}}`} /></span>
                <span style={{ color: '#06b6d4' }}>{z.toFixed(6)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Zeta Zero Statistics</h3>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>Mean spacing (all {ZETA_ZEROS.length} zeros)</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#3b82f6', marginTop: 4 }}>
                {((ZETA_ZEROS[ZETA_ZEROS.length - 1] - ZETA_ZEROS[0]) / (ZETA_ZEROS.length - 1)).toFixed(4)}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>First zero</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#f59e0b', marginTop: 4 }}>
                <InlineMath tex="\\gamma_1" /> = {ZETA_ZEROS[0].toFixed(6)}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>{ZETA_ZEROS.length}th zero</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#8b5cf6', marginTop: 4 }}>
                <InlineMath tex={`\\gamma_{${ZETA_ZEROS.length}}`} /> = {ZETA_ZEROS[ZETA_ZEROS.length - 1].toFixed(6)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <BlockMath tex="N(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}" />
            <p style={{ fontSize: 13, marginTop: 8 }}>
              The zero counting function <InlineMath tex="N(T)" /> counts zeros with <InlineMath tex="0 < \\gamma < T" />. The average spacing
              decreases as <InlineMath tex="2\\pi/\\log(T/2\\pi)" />, reflecting the increasing density of oscillator modes.
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
