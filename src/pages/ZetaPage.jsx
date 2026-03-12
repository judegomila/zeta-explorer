import React from 'react';
import { Link } from 'react-router-dom';
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
            shrinks as <InlineMath tex="2\\pi/\\log(t/2\\pi)" />. Red dots mark sign changes (zeros); compare their
            positions to the <InlineMath tex="\\gamma_n" /> table below.
          </li>
          <li>
            <strong style={{ color: '#f59e0b' }}>Heatmap mode:</strong> switch to the <InlineMath tex="|\\zeta(\\sigma+it)|" /> landscape
            and look for dark valleys pinching inward to the center line <InlineMath tex="\\sigma = 1/2" />. RH
            asserts every valley bottom sits exactly on that line. Drag the t-range to higher values
            to see zeros pack more tightly.
          </li>
          <li>
            <strong style={{ color: '#10b981' }}>Colorbar &amp; scale:</strong> in heatmap mode, the colorbar maps brightness
            to <InlineMath tex="|\\zeta|" />. Near a zero the magnitude plunges to near 0 (black); away from the
            critical strip it grows rapidly due to the pole at <InlineMath tex="s = 1" /> and the trivial zeros.
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h3 style={{ color: '#8b5cf6' }}>Computing <InlineMath tex="Z(t)" />: The Riemann-Siegel Formula</h3>
        <p style={{ marginTop: 8 }}>
          Evaluating <InlineMath tex="\\zeta(1/2 + it)" /> directly would require summing a slowly-converging Dirichlet series.
          The Riemann-Siegel formula exploits the functional equation to give a rapidly convergent approximation
          using only <InlineMath tex="N = \\lfloor\\sqrt{t/2\\pi}\\rfloor" /> terms — a dramatic speedup for large <InlineMath tex="t" />.
        </p>
        <BlockMath tex="Z(t) \\;\\approx\\; 2\\sum_{n=1}^{N} \\frac{\\cos\\bigl(\\theta(t) - t\\log n\\bigr)}{\\sqrt{n}} \\;+\\; (-1)^{N-1}\\!\\left(\\frac{t}{2\\pi}\\right)^{\\!-1/4}\\! C_0(p)" />
        <div className="two-col" style={{ marginTop: 12, gap: 16 }}>
          <div>
            <p style={{ fontSize: 13 }}>
              <strong style={{ color: '#06b6d4' }}>Main sum</strong> — Each term is a cosine oscillation at
              frequency <InlineMath tex="\\log n" />, damped by <InlineMath tex="1/\\sqrt{n}" />, and phase-shifted
              by the Riemann-Siegel theta function <InlineMath tex="\\theta(t)" />. In the oscillator model,
              these are the natural modes of the chain at integer frequencies.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13 }}>
              <strong style={{ color: '#f59e0b' }}>Correction term</strong> — The <InlineMath tex="C_0(p)" /> term
              (where <InlineMath tex="p = \\sqrt{t/2\\pi} - N" /> is the fractional part) accounts for the
              truncation of the sum at <InlineMath tex="N" />, improving accuracy
              from <InlineMath tex="O(t^{-1/4})" /> to <InlineMath tex="O(t^{-3/4})" />.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#a78bfa' }}>
            <strong>The theta function:</strong> <InlineMath tex="\\theta(t) \\approx \\tfrac{t}{2}\\log\\!\\tfrac{t}{2\\pi} - \\tfrac{t}{2} - \\tfrac{\\pi}{8}" /> is
            the phase accumulator that "unwinds" the complex phase of <InlineMath tex="\\zeta(1/2 + it)" />, making <InlineMath tex="Z(t)" /> real-valued.
            The local density of zeros is <InlineMath tex="\\theta'(t)/\\pi \\approx \\tfrac{1}{2\\pi}\\log(t/2\\pi)" /> (the Weyl law), not <InlineMath tex="\\theta'(t)" /> itself.
          </p>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Why <InlineMath tex="Z(t)" />? Real-Valued Zero Detection</h3>
          <p style={{ marginTop: 8 }}>
            The raw zeta function <InlineMath tex="\\zeta(1/2 + it)" /> is complex-valued, so its zeros are hard to see on a
            plot — you'd need both real and imaginary parts to vanish simultaneously. The Riemann-Siegel
            <InlineMath tex="Z" /> function multiplies by a phase factor <InlineMath tex="e^{i\\theta(t)}" /> that "straightens" zeta into
            a real-valued function. Now zeros appear as simple sign changes, making them easy to locate
            and count by watching <InlineMath tex="Z(t)" /> cross through zero.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Reading the Heatmap</h3>
          <p style={{ marginTop: 8 }}>
            The 2D landscape plots <InlineMath tex="|\\zeta(\\sigma + it)|" /> across the critical strip <InlineMath tex="0 < \\sigma < 1" />.
            Dark regions mark where <InlineMath tex="|\\zeta|" /> is small; the deepest valleys at <InlineMath tex="\\sigma = 1/2" /> are
            the nontrivial zeros. The vertical center line is the critical line. Notice how <InlineMath tex="|\\zeta|" /> grows
            as <InlineMath tex="\\sigma \\to 0" /> or <InlineMath tex="\\sigma \\to 1" />, with the zero valleys pinching inward — RH asserts they
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

      {/* The Riemann-Siegel Formula: How We Compute zeta(s) */}
      <div className="card" style={{ marginTop: 32, borderColor: '#3b82f6' }}>
        <h3 style={{ color: '#3b82f6' }}>The Riemann-Siegel Formula: How We Compute <InlineMath tex={"\\zeta(s)"} /></h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The <InlineMath tex={"Z(t)"} /> function shown in the visualization above is computed via the
          Riemann-Siegel formula, which is the workhorse behind all large-scale zero computations:
        </p>
        <BlockMath tex={"Z(t) = 2\\sum_{n \\leq \\sqrt{t/2\\pi}} n^{-1/2} \\cos\\bigl(\\theta(t) - t \\cdot \\log n\\bigr) + O(t^{-1/4})"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Here <InlineMath tex={"\\theta(t)"} /> is the Riemann-Siegel theta function, which serves as the
          global phase accumulator. The key property is that <InlineMath tex={"Z(t)"} /> is <strong>real-valued</strong> and
          vanishes exactly at the nontrivial zeta zeros on the critical line. Each zero of <InlineMath tex={"Z(t)"} /> corresponds
          to a sign change that can be detected numerically.
        </p>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(59,130,246,0.08)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#60a5fa' }}>
            <strong>Connection to the oscillator model:</strong> This formula <em>is</em> the oscillator sum.
            Each integer <InlineMath tex={"n"} /> in the main sum contributes a single cosine oscillation at
            frequency <InlineMath tex={"\\log n"} />, with amplitude <InlineMath tex={"n^{-1/2}"} /> and a
            phase shift from <InlineMath tex={"\\theta(t)"} />. The zeros of <InlineMath tex={"Z(t)"} /> are
            precisely the destructive interference points where all oscillator modes cancel simultaneously.
          </p>
        </div>
      </div>

      {/* Zeros and the Twin Ladder */}
      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>Zeros and the Twin Ladder</h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          At a zeta zero <InlineMath tex={"\\rho = \\tfrac{1}{2} + i\\gamma"} />, we
          have <InlineMath tex={"\\zeta(\\rho) = 0"} />, meaning the direct ladder output vanishes completely.
          The functional equation then forces:
        </p>
        <BlockMath tex={"\\zeta(1 - \\rho) = \\zeta(\\tfrac{1}{2} - i\\gamma) = 0"} />
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Both ladders go to zero simultaneously -- the direct ladder
          at <InlineMath tex={"\\rho"} /> and the dual ladder at <InlineMath tex={"1 - \\rho"} />. This
          "twin vanishing" is a hallmark of the functional equation symmetry.
        </p>
        <div className="two-col" style={{ marginTop: 12, gap: 16 }}>
          <div style={{ padding: 12, background: 'rgba(245,158,11,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#fbbf24' }}>
              <strong>Circuit interpretation:</strong> A zeta zero is a <em>transmission zero</em> -- a
              frequency at which no signal passes through the network. The transfer
              function <InlineMath tex={"H(s) = \\zeta(s)"} /> drops to zero, and 100% of the input energy
              is reflected back.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#a78bfa' }}>
              <strong>Unitarity at the critical line:</strong> The bridge connecting direct and dual ladders
              is unitary at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, so energy is perfectly reflected
              at each zero. No energy is lost or created -- the scattering matrix satisfies <InlineMath tex={"S^\\dagger S = I"} /> exactly
              on the critical line.
            </p>
          </div>
        </div>
      </div>

      {/* Lehmer Phenomenon */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #f97316' }}>
        <h3 style={{ color: '#f97316' }}>The Lehmer Phenomenon: When Zeros Nearly Collide</h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Occasionally, <InlineMath tex={"Z(t)"} /> dips very close to zero without actually changing sign,
          then quickly crosses zero twice in rapid succession. This is the <strong>Lehmer phenomenon</strong>,
          named after D.H. Lehmer who first observed it near <InlineMath tex={"t \\approx 7005"} />.
        </p>
        <BlockMath tex={"Z(7005.06) \\approx -0.0053 \\quad \\text{(barely negative — nearly misses a sign change)}"} />
        <div className="two-col" style={{ marginTop: 16, gap: 16 }}>
          <div style={{ padding: 12, background: 'rgba(249,115,22,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#fb923c' }}>
              <strong>What{"'"}s happening:</strong> Two nearby zeros <InlineMath tex={"\\gamma_n"} /> and{' '}
              <InlineMath tex={"\\gamma_{n+1}"} /> are so close together that <InlineMath tex={"Z(t)"} />{' '}
              barely dips to the opposite sign between them. The function grazes the axis rather than
              making a clean crossing. If it failed to cross entirely, the zero count would be off —
              but this has never been observed.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#a78bfa' }}>
              <strong>GUE connection:</strong> In random matrix theory, nearby eigenvalues experience
              {' '}<em>level repulsion</em> — the probability of two eigenvalues being within distance{' '}
              <InlineMath tex={"s"} /> vanishes as <InlineMath tex={"s^2"} /> for GUE. Lehmer-type
              events correspond to rare fluctuations where this repulsion is nearly overcome, but
              the GUE statistics correctly predict their extreme rarity.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
          Try setting the t-range to include <InlineMath tex={"t \\approx 7005"} /> in the Critical
          Line chart above to see a Lehmer event: <InlineMath tex={"Z(t)"} /> will show two closely
          spaced zeros with an unusually shallow dip between them.
        </p>
      </div>

      {/* The Eta Relation and Regularization */}
      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>The Eta Relation and Regularization</h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The <strong>Dirichlet eta function</strong> is the alternating version of the zeta series:
        </p>
        <BlockMath tex={"\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} = 1 - \\frac{1}{2^s} + \\frac{1}{3^s} - \\frac{1}{4^s} + \\cdots"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The key identity connecting eta and zeta is:
        </p>
        <BlockMath tex={"\\eta(s) = \\left(1 - 2^{1-s}\\right) \\zeta(s)"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          While the Dirichlet series <InlineMath tex={"\\zeta(s) = \\sum n^{-s}"} /> converges only
          for <InlineMath tex={"\\mathrm{Re}(s) > 1"} />, the alternating
          series <InlineMath tex={"\\eta(s)"} /> converges for <InlineMath tex={"\\mathrm{Re}(s) > 0"} />,
          extending our reach into the critical strip. This is how the app computes zeta inside the
          critical strip:
        </p>
        <BlockMath tex={"\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The singularity at <InlineMath tex={"s = 1"} /> appears naturally: the
          denominator <InlineMath tex={"1 - 2^{1-1} = 1 - 2^0 = 0"} />, reflecting the pole
          of <InlineMath tex={"\\zeta(s)"} /> at <InlineMath tex={"s = 1"} />.
        </p>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#34d399' }}>
            <strong>ZPO interpretation:</strong> The eta relation is a "regularization" of the ladder
            cascade — it subtracts alternating copies of the signal to make the series converge in the
            critical strip. Where the raw cascade <InlineMath tex={"\\sum n^{-s}"} /> diverges
            for <InlineMath tex={"\\mathrm{Re}(s) \\leq 1"} />, the alternating subtraction damps the
            partial sums enough to produce a finite answer for <InlineMath tex={"\\mathrm{Re}(s) > 0"} />.
          </p>
        </div>
      </div>

      {/* Critical Strip Geography */}
      <div className="card" style={{ marginTop: 32, borderColor: '#e879f9' }}>
        <h3 style={{ color: '#e879f9' }}>Critical Strip Geography</h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The complex plane splits into distinct regions for <InlineMath tex={"\\zeta(s)"} />,
          where <InlineMath tex={"s = \\sigma + it"} /> and <InlineMath tex={"\\sigma = \\mathrm{Re}(s)"} />:
        </p>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 12, background: 'rgba(59,130,246,0.08)', borderRadius: 8, borderLeft: '3px solid #3b82f6' }}>
            <p style={{ fontSize: 13, color: '#60a5fa', marginBottom: 4 }}>
              <strong><InlineMath tex={"\\sigma > 1"} /> — Convergence region</strong>
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              The Euler product converges absolutely: <InlineMath tex={"\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}"} />.
              All oscillators are active and the cascade sums without issue. No zeros exist here.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(245,158,11,0.08)', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
            <p style={{ fontSize: 13, color: '#fbbf24', marginBottom: 4 }}>
              <strong><InlineMath tex={"0 < \\sigma < 1"} /> — Critical strip</strong>
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              The Dirichlet series diverges, but analytic continuation works (via the eta relation or
              Riemann-Siegel). This is where all nontrivial zeros live. The cascade itself diverges,
              but regularized sums extract finite values.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(239,68,68,0.08)', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
            <p style={{ fontSize: 13, color: '#f87171', marginBottom: 4 }}>
              <strong><InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> — Critical line</strong>
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              The conjectured home of <em>all</em> nontrivial zeros (the Riemann Hypothesis). The
              functional equation is unitary here, and the scattering matrix satisfies <InlineMath tex={"S^\\dagger S = I"} />.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8, borderLeft: '3px solid #8b5cf6' }}>
            <p style={{ fontSize: 13, color: '#a78bfa', marginBottom: 4 }}>
              <strong><InlineMath tex={"\\sigma = 0"} /> — Boundary &amp; trivial zeros</strong>
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              The trivial zeros sit at <InlineMath tex={"s = -2, -4, -6, \\ldots"} /> (on the negative
              real axis, where <InlineMath tex={"\\sigma < 0"} />). These arise from poles of the gamma
              factor <InlineMath tex={"\\Gamma(s/2)"} /> in the functional equation.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(100,116,139,0.08)', borderRadius: 8, borderLeft: '3px solid #64748b' }}>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
              <strong style={{ color: '#cbd5e1' }}><InlineMath tex={"\\sigma < 0"} /> — Reflected region</strong>
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              The functional equation maps <InlineMath tex={"\\zeta(s) \\leftrightarrow \\zeta(1-s)"} />,
              so this region is entirely determined by <InlineMath tex={"\\sigma > 1"} />. No new
              information lives here.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
            <strong style={{ color: '#e879f9' }}>The zero-free region:</strong> The best known result
            (Vinogradov-Korobov) establishes that <InlineMath tex={"\\zeta(s) \\neq 0"} /> in the region:
          </p>
          <BlockMath tex={"\\sigma > 1 - \\frac{c}{(\\log |t|)^{2/3} (\\log \\log |t|)^{1/3}}"} />
          <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
            for a constant <InlineMath tex={"c > 0"} /> and <InlineMath tex={"|t|"} /> sufficiently large.
            This narrows the zero-free corridor as <InlineMath tex={"|t| \\to \\infty"} />, but falls
            short of reaching <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          </p>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(232,121,249,0.08)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#e879f9' }}>
            <strong>Summary of <InlineMath tex={"\\sigma"} />-boundaries:</strong> The critical strip
            is <InlineMath tex={"0 < \\sigma < 1"} />, the critical line
            is <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the Euler product converges
            for <InlineMath tex={"\\sigma > 1"} />, and the functional equation
            reflects <InlineMath tex={"\\sigma \\leftrightarrow 1 - \\sigma"} />. All the action — zeros,
            analytic continuation, and the deepest questions — happens inside the strip.
          </p>
        </div>
      </div>

      {/* Functional Equation */}
      <div className="card" style={{ marginTop: 32, borderColor: '#ec4899' }}>
        <h3 style={{ color: '#ec4899' }}>The Functional Equation</h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The functional equation is the deepest symmetry of <InlineMath tex={"\\zeta(s)"} />, relating its
          values at <InlineMath tex={"s"} /> and <InlineMath tex={"1-s"} />. In its symmetric form, define the
          <strong style={{ color: '#e2e8f0' }}> completed zeta function</strong>:
        </p>
        <BlockMath tex={"\\xi(s) = \\tfrac{1}{2}s(s-1)\\,\\pi^{-s/2}\\,\\Gamma(s/2)\\,\\zeta(s)"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Then <InlineMath tex={"\\xi(s)"} /> is entire (no poles) and satisfies the reflection symmetry:
        </p>
        <BlockMath tex={"\\xi(s) = \\xi(1-s)"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The asymmetric form, which isolates the <strong style={{ color: '#e2e8f0' }}>bridge
          factor</strong> <InlineMath tex={"\\chi(s)"} />, is:
        </p>
        <BlockMath tex={"\\zeta(s) = \\chi(s)\\,\\zeta(1-s), \\qquad \\chi(s) = 2^s\\,\\pi^{s-1}\\sin\\!\\left(\\frac{\\pi s}{2}\\right)\\Gamma(1-s)"} />
        <div className="two-col" style={{ marginTop: 16, gap: 16 }}>
          <div style={{ padding: 12, background: 'rgba(236,72,153,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#f472b6' }}>
              <strong>Key property:</strong> On the critical
              line, <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> for all <InlineMath tex={"t"} />. This
              means <InlineMath tex={"\\chi"} /> is a pure phase rotation — it preserves magnitudes. In the ZPO
              model, this is the lossless bridge connecting direct and dual ladders: no energy is gained or
              lost when crossing from <InlineMath tex={"\\zeta(s)"} /> to <InlineMath tex={"\\zeta(1-s)"} />.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#a78bfa' }}>
              <strong>Why it matters for RH:</strong> The functional equation forces zeros to come in
              pairs: if <InlineMath tex={"\\zeta(\\rho)=0"} />,
              then <InlineMath tex={"\\zeta(1-\\rho)=0"} /> as well. RH is the conjecture that these
              pairs collapse — every zero satisfies <InlineMath tex={"\\rho = 1-\\rho"} /> (up to conjugation),
              i.e., <InlineMath tex={"\\mathrm{Re}(\\rho)=\\tfrac{1}{2}"} />.
            </p>
          </div>
        </div>
      </div>

      {/* Hadamard Product Formula */}
      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>Hadamard Product: Factoring <InlineMath tex={"\\zeta"} /> Over Its Zeros</h3>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Just as a polynomial factors as a product over its roots, Hadamard (1893) showed that the
          completed zeta function <InlineMath tex={"\\xi(s)"} /> factors as an infinite product over the nontrivial zeros:
        </p>
        <BlockMath tex={"\\xi(s) = \\tfrac{1}{2} s(s-1) \\pi^{-s/2} \\Gamma(s/2)\\, \\zeta(s) = \\xi(0) \\prod_{\\rho} \\left(1 - \\frac{s}{\\rho}\\right)"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          where the product runs over all nontrivial zeros <InlineMath tex={"\\rho"} /> (paired
          as <InlineMath tex={"\\rho"} /> and <InlineMath tex={"1-\\rho"} /> to ensure convergence).
          This is a <strong>spectral determinant</strong>: each zero contributes one factor, and
          the entire function is determined by its zero set — exactly as a quantum system's
          partition function is determined by its energy spectrum.
        </p>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(6,182,212,0.08)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#22d3ee' }}>
            <strong>ZPO interpretation:</strong> The Hadamard product is the transfer function of the
            oscillator chain written as a cascade of resonance notches — one notch filter per zero. Each
            zero <InlineMath tex={"\\rho = \\tfrac{1}{2} + i\\gamma"} /> contributes a transmission null at
            frequency <InlineMath tex={"\\gamma"} />, and the complete chain response is the product of all notch filters.
          </p>
        </div>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/oscillators" style={{ color: '#3b82f6', fontSize: 13 }}>Prime Oscillators</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/hamiltonian" style={{ color: '#8b5cf6', fontSize: 13 }}>Hamiltonian</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/waves" style={{ color: '#06b6d4', fontSize: 13 }}>Waves</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/control" style={{ color: '#f59e0b', fontSize: 13 }}>Control Theory</Link>
        </div>
      </div>
    </div>
  );
}
