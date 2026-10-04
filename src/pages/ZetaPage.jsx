import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import ZetaLandscapeViz from '../components/ZetaLandscapeViz.jsx';
import ZetaPhasePortrait from '../components/ZetaPhasePortrait.jsx';
const Zeta3DLandscape = lazy(() => import('../components/Zeta3DLandscape.jsx'));
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Zeta Function Landscape — editorial (warm) re-theme.
// Full-width dashboard chrome; the interactive viz components
// (ZetaLandscapeViz / Zeta3DLandscape / ZetaPhasePortrait) and every
// claim, number, identity and caveat are preserved exactly.

// ── Style helpers (warm palette) ────────────────────────────────────────────
const MONO = 'var(--ed-mono, var(--font-mono))';

const card = {
  background: 'var(--paper2)',
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: '16px 18px',
};
const cardLeft = (c) => ({ ...card, borderLeft: `3px solid ${c}` });
const h3 = (c) => ({ color: c, fontSize: 15, fontWeight: 700, margin: '0 0 8px' });
const body = { color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 };
const eyebrow = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  fontFamily: MONO,
  marginBottom: 6,
};
const inset = (bg) => ({ marginTop: 12, padding: 12, background: bg, borderRadius: 8 });
const twoCol = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 };

// warm accent tints for inset panels
const TINT = {
  brass: alpha(ED.brass, 0.08),
  brassDk: alpha(ED.brassDeco, 0.1),
  blue: alpha(ED.series1, 0.1),
  green: alpha(ED.series3, 0.1),
  terra: alpha(ED.series2, 0.09),
};

export default function ZetaPage() {
  // Normalized spacings for GUE / Montgomery-Odlyzko statistics
  const rawSpacings = ZETA_ZEROS.slice(0, -1).map((z, i) => ZETA_ZEROS[i + 1] - z);
  const meanRawSpacing = rawSpacings.reduce((a, b) => a + b, 0) / rawSpacings.length;
  const normSpacings = rawSpacings.map(s => s / meanRawSpacing);
  const normMean = normSpacings.reduce((a, b) => a + b, 0) / normSpacings.length;
  const normStd = Math.sqrt(normSpacings.reduce((a, s) => a + Math.pow(s - normMean, 2), 0) / normSpacings.length);
  // GUE Wigner surmise (beta=2): std = sqrt(3*pi/8 - 1) ≈ 0.422
  const guePredStd = Math.sqrt(3 * Math.PI / 8 - 1);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>ζ(1/2+it) · Z(t) zero detector · Montgomery–Odlyzko GUE</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        {/* ── Masthead ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Zeta Function Landscape</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Explore the Riemann zeta function across the critical strip. The Riemann-Siegel <InlineMath tex="Z(t)" />
            function shows zeta on the critical line, while the heatmap reveals the full 2D structure.
          </p>
          <p style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.55, maxWidth: 760, marginTop: 8 }}>
            How to read this page: start with the identity below, then use the interactive detector to watch
            zeros appear as sign changes of <InlineMath tex="Z(t)" /> and as valleys in the <InlineMath tex={"|\\zeta|"} /> heatmap.
            The sections that follow explain the computation, the spacing statistics, and the analytic structure — the strip,
            the functional equation, and the Hadamard product.
          </p>
        </div>

        <BlockMath tex={"Z(t) = e^{i\\theta(t)} \\zeta(1/2 + it), \\quad Z(t) \\in \\mathbb{R}"} />

        {/* ── Status caveat ──────────────────────────────────────── */}
        <div style={{ ...cardLeft('var(--terra-dk)'), marginTop: 16, marginBottom: 8, background: TINT.terra }}>
          <h3 style={h3('var(--terra-dk)')}>Status: verified computation, not a proof</h3>
          <p style={{ ...body, margin: 0 }}>
            This page plots <InlineMath tex={"|\\zeta|"} /> and the Hardy <InlineMath tex={"Z(t)"} /> function on and off
            the critical line over a <strong>finite t-window</strong> built from a table of known zeros. Every zero shown
            lying on <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> reflects <strong>verified numerical computation</strong> up
            to a bounded height (e.g. Platt's rigorously verified range) — it is <em>not</em> evidence for the Riemann
            Hypothesis. RH asserts <em>all</em> nontrivial zeros lie on the line, including infinitely many beyond any
            computed window; no finite plot can establish that. For how zeros are rigorously counted and located, see{' '}
            <Link to="/gram-points" style={{ color: 'var(--terra-dk)' }}>Gram points</Link> and{' '}
            <Link to="/hardy-z" style={{ color: 'var(--terra-dk)' }}>Hardy Z</Link> (Turing's method).
          </p>
        </div>

        {/* ── Interactive detector (unchanged viz) ──────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 28, marginBottom: 8 }}>Interactive zero detector</h2>
        <p style={{ ...body, marginTop: 0, marginBottom: 12 }}>
          Toggle between the <InlineMath tex="Z(t)" /> critical-line trace and the <InlineMath tex={"|\\zeta(\\sigma+it)|"} /> heatmap,
          and drag the t-range to move the window.
        </p>
        <ZetaLandscapeViz />

        <div style={{ marginTop: 32 }}>
          <h2 className="ed-h2" style={{ marginBottom: 12 }}>3D Zeta Landscape</h2>
          <p style={{ ...body, marginBottom: 12 }}>
            Interactive 3D height field of <InlineMath tex="|\zeta(\sigma + it)|" /> over the critical strip.
            Zeros appear as valleys touching the floor. Drag to rotate, scroll to zoom.
          </p>
          <Suspense fallback={<div style={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)', background: 'var(--paper2)', borderRadius: 12, border: '1px solid var(--hairline)' }}>Loading 3D...</div>}>
            <Zeta3DLandscape />
          </Suspense>
        </div>

        <div style={{ marginTop: 32 }}>
          <h2 className="ed-h2" style={{ marginBottom: 12 }}>Phase Portrait</h2>
          <ZetaPhasePortrait />
        </div>

        {/* ── What to explore ───────────────────────────────────────────── */}
        <div style={{ ...cardLeft('var(--blue)'), marginTop: 32 }}>
          <div style={eyebrow}>Guide to the detector</div>
          <h3 style={h3('var(--blue)')}>What to Explore</h3>
          <ul style={{ marginLeft: 16, ...body, lineHeight: 2 }}>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Critical Line mode:</strong> watch <InlineMath tex="Z(t)" /> oscillate
              with increasing "frequency" as <InlineMath tex="t" /> grows — the local wavelength
              shrinks as <InlineMath tex={"2\\pi/\\log(t/2\\pi)"} />. Red dots mark sign changes (zeros); compare their
              positions to the <InlineMath tex={"\\gamma_n"} /> table below.
            </li>
            <li>
              <strong style={{ color: 'var(--brass-dk)' }}>Heatmap mode:</strong> switch to the <InlineMath tex={"|\\zeta(\\sigma+it)|"} /> landscape
              and look for dark valleys pinching inward to the center line <InlineMath tex={"\\sigma = 1/2"} />. RH
              asserts every valley bottom sits exactly on that line. Drag the t-range to higher values
              to see zeros pack more tightly.
            </li>
            <li>
              <strong style={{ color: 'var(--green)' }}>Colorbar &amp; scale:</strong> in heatmap mode, the colorbar maps brightness
              to <InlineMath tex={"|\\zeta|"} />. Near a zero the magnitude plunges to near 0 (black); away from the
              critical strip it grows rapidly due to the pole at <InlineMath tex="s = 1" /> and the trivial zeros.
            </li>
          </ul>
        </div>

        {/* ── Riemann-Siegel computation ────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 32, marginBottom: 12 }}>How <InlineMath tex="Z(t)" /> is computed</h2>
        <div style={cardLeft('var(--brass)')}>
          <h3 style={h3('var(--brass)')}>Computing <InlineMath tex="Z(t)" />: The Riemann-Siegel Formula</h3>
          <p style={{ ...body, marginTop: 8 }}>
            Evaluating <InlineMath tex={"\\zeta(1/2 + it)"} /> directly would require summing a slowly-converging Dirichlet series.
            The Riemann-Siegel formula uses the functional equation to give a rapidly convergent approximation
            using only <InlineMath tex={"N = \\lfloor\\sqrt{t/2\\pi}\\rfloor"} /> terms — a dramatic speedup for large <InlineMath tex="t" />.
          </p>
          <BlockMath tex={"Z(t) \\;\\approx\\; 2\\sum_{n=1}^{N} \\frac{\\cos\\bigl(\\theta(t) - t\\log n\\bigr)}{\\sqrt{n}} \\;+\\; (-1)^{N-1}\\!\\left(\\frac{t}{2\\pi}\\right)^{\\!-1/4}\\! C_0(p)"} />
          <div style={twoCol}>
            <div>
              <p style={{ fontSize: 13, ...body }}>
                <strong style={{ color: 'var(--blue)' }}>Main sum</strong> — Each term is a cosine oscillation at
                frequency <InlineMath tex={"\\log n"} />, damped by <InlineMath tex={"1/\\sqrt{n}"} />, and phase-shifted
                by the Riemann-Siegel theta function <InlineMath tex={"\\theta(t)"} />. In the oscillator model,
                these are the natural modes of the chain at integer frequencies.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 13, ...body }}>
                <strong style={{ color: 'var(--brass-dk)' }}>Correction term</strong> — The <InlineMath tex="C_0(p)" /> term
                (where <InlineMath tex={"p = \\sqrt{t/2\\pi} - N"} /> is the fractional part) accounts for the
                truncation of the sum at <InlineMath tex="N" />, improving accuracy
                from <InlineMath tex="O(t^{-1/4})" /> to <InlineMath tex="O(t^{-3/4})" />.
              </p>
            </div>
          </div>
          <div style={inset(TINT.brass)}>
            <p style={{ fontSize: 13, color: 'var(--brass)', margin: '0 0 8px' }}>
              <strong>The theta function</strong> is the phase accumulator that "unwinds" the complex phase
              of <InlineMath tex={"\\zeta(1/2 + it)"} />, making <InlineMath tex={"Z(t)"} /> real-valued:
            </p>
            <BlockMath tex={"\\theta(t) \\approx \\frac{t}{2}\\log\\frac{t}{2\\pi} - \\frac{t}{2} - \\frac{\\pi}{8}"} />
            <p style={{ fontSize: 13, color: 'var(--brass)', margin: '8px 0 0' }}>
              The local density of zeros (the Weyl law) is:
            </p>
            <BlockMath tex={"\\frac{\\theta'(t)}{\\pi} \\approx \\frac{1}{2\\pi}\\log\\frac{t}{2\\pi}"} />
          </div>
        </div>

        <div style={twoCol}>
          <div style={card}>
            <h3 style={h3('var(--blue)')}>Why <InlineMath tex="Z(t)" />? Real-Valued Zero Detection</h3>
            <p style={{ ...body, marginTop: 8 }}>
              The raw zeta function <InlineMath tex={"\\zeta(1/2 + it)"} /> is complex-valued, so its zeros are hard to see on a
              plot — you'd need both real and imaginary parts to vanish simultaneously. The Riemann-Siegel
              <InlineMath tex="Z" /> function multiplies by a phase factor <InlineMath tex={"e^{i\\theta(t)}"} /> that "straightens" zeta into
              a real-valued function. Now zeros appear as simple sign changes, making them easy to locate
              and count by watching <InlineMath tex="Z(t)" /> cross through zero.
            </p>
          </div>
          <div style={card}>
            <h3 style={h3('var(--brass-dk)')}>Reading the Heatmap</h3>
            <p style={{ ...body, marginTop: 8 }}>
              The 2D landscape plots <InlineMath tex={"|\\zeta(\\sigma + it)|"} /> across the critical strip <InlineMath tex={"0 < \\sigma < 1"} />.
              Dark regions mark where <InlineMath tex={"|\\zeta|"} /> is small; the deepest valleys at <InlineMath tex={"\\sigma = 1/2"} /> are
              the nontrivial zeros. The vertical center line is the critical line. Notice how <InlineMath tex={"|\\zeta|"} /> grows
              as <InlineMath tex={"\\sigma \\to 0"} /> or <InlineMath tex={"\\sigma \\to 1"} />, with the zero valleys pinching inward — RH asserts they
              all sit exactly on the center line.
            </p>
          </div>
        </div>

        {/* ── Zeros table + statistics ──────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 32, marginBottom: 12 }}>The zeros and their spacing</h2>
        <div style={twoCol}>
          <div style={card}>
            <h3 style={h3('var(--ink)')}>Known Nontrivial Zeros</h3>
            <p style={{ ...body, marginBottom: 12 }}>First {ZETA_ZEROS.length} imaginary parts <InlineMath tex={"\\gamma_n"} /> of zeros <InlineMath tex={"\\rho = \\tfrac{1}{2} + i\\gamma_n"} /></p>
            <div style={{
              maxHeight: 360,
              overflowY: 'auto',
              fontFamily: MONO,
              fontSize: 12,
              lineHeight: 2,
              border: '1px solid var(--hairline)',
              borderRadius: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'var(--paper2)', borderBottom: '1px solid var(--hairline)', position: 'sticky', top: 0, color: 'var(--faint)', fontSize: 11 }}>
                <span>index</span>
                <span><InlineMath tex={"\\gamma_n"} /></span>
              </div>
              {ZETA_ZEROS.map((z, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', borderBottom: '1px solid var(--hairline)' }}>
                  <span style={{ color: 'var(--faint)' }}><InlineMath tex={"\\gamma_{" + (i + 1).toString().padStart(2, '0') + "}"} /></span>
                  <span style={{ color: 'var(--blue)' }}>{z.toFixed(6)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <h3 style={h3('var(--ink)')}>Zeta Zero Statistics</h3>
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>Mean spacing (all {ZETA_ZEROS.length} zeros)</span>
                <div style={{ fontFamily: MONO, fontSize: 18, color: 'var(--blue)', marginTop: 4 }}>
                  {((ZETA_ZEROS[ZETA_ZEROS.length - 1] - ZETA_ZEROS[0]) / (ZETA_ZEROS.length - 1)).toFixed(4)}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>First zero</span>
                <div style={{ fontFamily: MONO, fontSize: 18, color: 'var(--brass-dk)', marginTop: 4 }}>
                  <InlineMath tex={"\\gamma_1"} /> = {ZETA_ZEROS[0].toFixed(6)}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>{ZETA_ZEROS.length}th zero</span>
                <div style={{ fontFamily: MONO, fontSize: 18, color: 'var(--brass)', marginTop: 4 }}>
                  <InlineMath tex={"\\gamma_{" + ZETA_ZEROS.length + "}"} /> = {ZETA_ZEROS[ZETA_ZEROS.length - 1].toFixed(6)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <BlockMath tex={"N(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}"} />
              <p style={{ fontSize: 13, ...body, marginTop: 8 }}>
                The zero counting function <InlineMath tex="N(T)" /> counts zeros with <InlineMath tex={"0 < \\gamma < T"} />. The average spacing
                decreases as <InlineMath tex={"2\\pi/\\log(T/2\\pi)"} />, reflecting the increasing density of oscillator modes.
              </p>
            </div>
            <div style={inset(TINT.green)}>
              <p style={{ fontSize: 13, color: 'var(--green)' }}>
                <strong>Circuit interpretation:</strong> The zero density is the mode density of the
                oscillator chain. As frequency increases, modes pack more tightly — the density of
                states grows logarithmically, exactly matching a 1D system with logarithmic dispersion.
              </p>
            </div>
          </div>
        </div>

        {/* Montgomery-Odlyzko Law: GUE Zero Spacing Statistics */}
        <div style={{ ...cardLeft('var(--blue)'), marginTop: 32 }}>
          <h3 style={h3('var(--blue)')}>Montgomery-Odlyzko Law: GUE Universality of Zero Spacings</h3>
          <p style={{ ...body, marginTop: 8 }}>
            Montgomery (1973) conjectured, and Odlyzko (1987) verified numerically for millions of zeros,
            that the normalized spacings <InlineMath tex={"\\delta_n = (\\gamma_{n+1}-\\gamma_n)/\\langle s\\rangle"} /> follow
            the GUE (Gaussian Unitary Ensemble) eigenvalue spacing distribution — a profound link between
            the Riemann zeta function and quantum chaos. Explore this further in{' '}
            <Link to="/gue-comparison" style={{ color: 'var(--blue)' }}>GUE Comparison</Link> and{' '}
            <Link to="/pair-correlation" style={{ color: 'var(--brass)' }}>Pair Correlation</Link>.
          </p>
          <BlockMath tex={"p_{\\mathrm{GUE}}(s) = \\frac{32}{\\pi^2}\\,s^2\\,e^{-4s^2/\\pi}, \\qquad \\mathrm{mean}=1,\\; \\mathrm{std} = \\sqrt{\\tfrac{3\\pi}{8}-1}\\approx 0.422"} />
          <div style={twoCol}>
            <div>
              <p style={{ color: 'var(--faint)', fontSize: 12, marginBottom: 8 }}>First 10 normalized spacings</p>
              <div style={{ fontFamily: MONO, fontSize: 12, lineHeight: 2, border: '1px solid var(--hairline)', borderRadius: 6 }}>
                {normSpacings.slice(0, 10).map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--faint)' }}><InlineMath tex={"\\delta_{" + (i + 1) + "}"} /></span>
                    <span style={{ color: s > 1.6 ? 'var(--brass-dk)' : s < 0.4 ? 'var(--terra-dk)' : 'var(--blue)' }}>{s.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: 'var(--faint)', fontSize: 12, marginBottom: 8 }}>Observed vs GUE ({ZETA_ZEROS.length - 1} spacings)</p>
              <div style={{ fontFamily: MONO, fontSize: 13, lineHeight: 2, border: '1px solid var(--hairline)', borderRadius: 6, padding: '4px 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px', borderBottom: '1px solid var(--hairline)' }}>
                  <span style={{ color: 'var(--faint)' }}>mean</span>
                  <span>
                    <span style={{ color: 'var(--blue)' }}>{normMean.toFixed(4)}</span>
                    <span style={{ color: 'var(--faint)', fontSize: 11 }}> vs GUE 1.0000</span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px' }}>
                  <span style={{ color: 'var(--faint)' }}>std dev</span>
                  <span>
                    <span style={{ color: 'var(--blue)' }}>{normStd.toFixed(4)}</span>
                    <span style={{ color: 'var(--faint)', fontSize: 11 }}> vs GUE {guePredStd.toFixed(4)}</span>
                  </span>
                </div>
              </div>
              <div style={inset(TINT.blue)}>
                <p style={{ fontSize: 12, color: 'var(--blue)' }}>
                  <strong>Level repulsion:</strong> GUE predicts <InlineMath tex={"p(s) \\sim s^2"} /> near <InlineMath tex={"s=0"} /> —
                  zeros strongly repel each other. Lehmer events (two zeros unusually close) are rare
                  because the <InlineMath tex={"s^2"} /> factor strongly suppresses small spacings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Riemann-Siegel Formula: How We Compute zeta(s) */}
        <div style={{ ...cardLeft('var(--blue)'), marginTop: 32 }}>
          <h3 style={h3('var(--blue)')}>The Riemann-Siegel Formula: How We Compute <InlineMath tex={"\\zeta(s)"} /></h3>
          <p style={{ ...body, marginTop: 8 }}>
            The <InlineMath tex={"Z(t)"} /> function shown in the visualization above is computed via the
            Riemann-Siegel formula, which is the workhorse behind all large-scale zero computations:
          </p>
          <BlockMath tex={"Z(t) = 2\\sum_{n \\leq \\sqrt{t/2\\pi}} n^{-1/2} \\cos\\bigl(\\theta(t) - t \\cdot \\log n\\bigr) + O(t^{-1/4})"} />
          <p style={{ ...body, marginTop: 12 }}>
            Here <InlineMath tex={"\\theta(t)"} /> is the Riemann-Siegel theta function, which serves as the
            global phase accumulator. The key property is that <InlineMath tex={"Z(t)"} /> is <strong>real-valued</strong> and
            vanishes exactly at the nontrivial zeta zeros on the critical line. Each zero of <InlineMath tex={"Z(t)"} /> corresponds
            to a sign change that can be detected numerically.
          </p>
          <div style={inset(TINT.blue)}>
            <p style={{ fontSize: 13, color: 'var(--blue)' }}>
              <strong>Connection to the oscillator model:</strong> This formula <em>is</em> the oscillator sum.
              Each integer <InlineMath tex={"n"} /> in the main sum contributes a single cosine oscillation at
              frequency <InlineMath tex={"\\log n"} />, with amplitude <InlineMath tex={"n^{-1/2}"} /> and a
              phase shift from <InlineMath tex={"\\theta(t)"} />. The zeros of <InlineMath tex={"Z(t)"} /> are
              precisely the destructive interference points where all oscillator modes cancel simultaneously.
            </p>
          </div>
        </div>

        {/* Zeros and the Twin Ladder */}
        <div style={{ ...cardLeft('var(--brass-dk)'), marginTop: 32 }}>
          <h3 style={h3('var(--brass-dk)')}>Zeros and the Twin Ladder</h3>
          <p style={{ ...body, marginTop: 8 }}>
            At a zeta zero <InlineMath tex={"\\rho = \\tfrac{1}{2} + i\\gamma"} />, we
            have <InlineMath tex={"\\zeta(\\rho) = 0"} />, meaning the direct ladder output vanishes completely.
            The functional equation then forces:
          </p>
          <BlockMath tex={"\\zeta(1 - \\rho) = \\zeta(\\tfrac{1}{2} - i\\gamma) = 0"} />
          <p style={{ ...body, marginTop: 8 }}>
            Both ladders go to zero simultaneously -- the direct ladder
            at <InlineMath tex={"\\rho"} /> and the dual ladder at <InlineMath tex={"1 - \\rho"} />. This
            "twin vanishing" is a hallmark of the functional equation symmetry.
          </p>
          <div style={twoCol}>
            <div style={inset(TINT.brassDk)}>
              <p style={{ fontSize: 13, color: 'var(--brass-dk)' }}>
                <strong>Circuit interpretation:</strong> If one chooses the scalar analogy
                <InlineMath tex={"H(s)=\\zeta(s)"} />, then a zeta zero is a zero of that abstract
                transfer function. It is not a transmission zero of the app&apos;s cascade ratio
                <InlineMath tex={"S_{21}(s)=\\zeta(2s)/\\zeta(s)"} />: absent cancellation, it is a
                pole of that ratio. A claim of complete reflection would additionally require a
                rigorously realized lossless two-port.
              </p>
            </div>
            <div style={inset(TINT.brass)}>
              <p style={{ fontSize: 13, color: 'var(--brass)' }}>
                <strong>What is exact:</strong> The functional equation pairs the direct and dual
                zeros, and its bridge factor has unit modulus at
                <InlineMath tex={"\\sigma=\\tfrac{1}{2}"} />. That boundary identity does not by itself
                prove that the full infinite cascade is a realizable unitary scattering network.
              </p>
            </div>
          </div>
        </div>

        {/* Lehmer Phenomenon */}
        <div style={{ ...cardLeft('var(--terra-dk)'), marginTop: 32 }}>
          <h3 style={h3('var(--terra-dk)')}>The Lehmer Phenomenon: When Zeros Nearly Collide</h3>
          <p style={{ ...body, marginTop: 8 }}>
            Occasionally, <InlineMath tex={"Z(t)"} /> dips very close to zero without actually changing sign,
            then quickly crosses zero twice in rapid succession. This is the <strong>Lehmer phenomenon</strong>,
            named after D.H. Lehmer who first observed it near <InlineMath tex={"t \\approx 7005"} />.
          </p>
          <BlockMath tex={"Z(7005.06) \\approx -0.0053 \\quad \\text{(barely negative — nearly misses a sign change)}"} />
          <div style={twoCol}>
            <div style={inset(TINT.terra)}>
              <p style={{ fontSize: 13, color: 'var(--terra-dk)' }}>
                <strong>What{"'"}s happening:</strong> Two nearby zeros <InlineMath tex={"\\gamma_n"} /> and{' '}
                <InlineMath tex={"\\gamma_{n+1}"} /> are so close together that <InlineMath tex={"Z(t)"} />{' '}
                barely dips to the opposite sign between them. The function grazes the axis rather than
                making a clean crossing. If it failed to cross entirely, the zero count would be off —
                but this has never been observed.
              </p>
            </div>
            <div style={inset(TINT.brass)}>
              <p style={{ fontSize: 13, color: 'var(--brass)' }}>
                <strong>GUE connection:</strong> In random matrix theory, nearby eigenvalues experience
                {' '}<em>level repulsion</em> — the probability of two eigenvalues being within distance{' '}
                <InlineMath tex={"s"} /> vanishes as <InlineMath tex={"s^2"} /> for GUE. Lehmer-type
                events correspond to rare fluctuations where this repulsion is nearly overcome, but
                the GUE statistics correctly predict their extreme rarity.
              </p>
            </div>
          </div>
          <p style={{ ...body, marginTop: 12, fontSize: 12 }}>
            Try setting the t-range to include <InlineMath tex={"t \\approx 7005"} /> in the Critical
            Line chart above to see a Lehmer event: <InlineMath tex={"Z(t)"} /> will show two closely
            spaced zeros with an unusually shallow dip between them.
          </p>
        </div>

        {/* The Eta Relation and Regularization */}
        <div style={{ ...cardLeft('var(--green)'), marginTop: 32 }}>
          <h3 style={h3('var(--green)')}>The Eta Relation and Regularization</h3>
          <p style={{ ...body, marginTop: 8 }}>
            The <strong>Dirichlet eta function</strong> is the alternating version of the zeta series:
          </p>
          <BlockMath tex={"\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} = 1 - \\frac{1}{2^s} + \\frac{1}{3^s} - \\frac{1}{4^s} + \\cdots"} />
          <p style={{ ...body, marginTop: 12 }}>
            The key identity connecting eta and zeta is:
          </p>
          <BlockMath tex={"\\eta(s) = \\left(1 - 2^{1-s}\\right) \\zeta(s)"} />
          <p style={{ ...body, marginTop: 12 }}>
            While the Dirichlet series <InlineMath tex={"\\zeta(s) = \\sum n^{-s}"} /> converges only
            for <InlineMath tex={"\\mathrm{Re}(s) > 1"} />, the alternating
            series <InlineMath tex={"\\eta(s)"} /> converges for <InlineMath tex={"\\mathrm{Re}(s) > 0"} />,
            extending our reach into the critical strip. This is how the app computes zeta inside the
            critical strip:
          </p>
          <BlockMath tex={"\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}"} />
          <p style={{ ...body, marginTop: 12 }}>
            The singularity at <InlineMath tex={"s = 1"} /> appears naturally: the
            denominator <InlineMath tex={"1 - 2^{1-1} = 1 - 2^0 = 0"} />, reflecting the pole
            of <InlineMath tex={"\\zeta(s)"} /> at <InlineMath tex={"s = 1"} />.
          </p>
          <div style={inset(TINT.green)}>
            <p style={{ fontSize: 13, color: 'var(--green)' }}>
              <strong>Twin-Ladder Bridge interpretation:</strong> The eta relation is a "regularization" of the ladder
              cascade — it subtracts alternating copies of the signal to make the series converge in the
              critical strip. Where the raw cascade <InlineMath tex={"\\sum n^{-s}"} /> diverges
              for <InlineMath tex={"\\mathrm{Re}(s) \\leq 1"} />, the alternating subtraction damps the
              partial sums enough to produce a finite answer for <InlineMath tex={"\\mathrm{Re}(s) > 0"} />.
            </p>
          </div>
        </div>

        {/* Critical Strip Geography */}
        <div style={{ ...cardLeft('var(--terra)'), marginTop: 32 }}>
          <h3 style={h3('var(--terra)')}>Critical Strip Geography</h3>
          <p style={{ ...body, marginTop: 8 }}>
            The complex plane splits into distinct regions for <InlineMath tex={"\\zeta(s)"} />,
            where <InlineMath tex={"s = \\sigma + it"} /> and <InlineMath tex={"\\sigma = \\mathrm{Re}(s)"} />:
          </p>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, background: TINT.blue, borderRadius: 8, borderLeft: '3px solid var(--blue)' }}>
              <p style={{ fontSize: 13, color: 'var(--blue)', marginBottom: 4 }}>
                <strong><InlineMath tex={"\\sigma > 1"} /> — Convergence region</strong>
              </p>
              <p style={{ fontSize: 13, ...body }}>
                The Euler product converges absolutely: <InlineMath tex={"\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}"} />.
                All oscillators are active and the cascade sums without issue. No zeros exist here.
              </p>
            </div>
            <div style={{ padding: 12, background: TINT.brassDk, borderRadius: 8, borderLeft: '3px solid var(--brass-dk)' }}>
              <p style={{ fontSize: 13, color: 'var(--brass-dk)', marginBottom: 4 }}>
                <strong><InlineMath tex={"0 < \\sigma < 1"} /> — Critical strip</strong>
              </p>
              <p style={{ fontSize: 13, ...body }}>
                The Dirichlet series diverges, but analytic continuation works (via the eta relation or
                Riemann-Siegel). This is where all nontrivial zeros live. The cascade itself diverges,
                but regularized sums extract finite values.
              </p>
            </div>
            <div style={{ padding: 12, background: TINT.terra, borderRadius: 8, borderLeft: '3px solid var(--terra-dk)' }}>
              <p style={{ fontSize: 13, color: 'var(--terra-dk)', marginBottom: 4 }}>
                <strong><InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> — Critical line</strong>
              </p>
              <p style={{ fontSize: 13, ...body }}>
                The conjectured home of <em>all</em> nontrivial zeros (the Riemann Hypothesis). The
                functional equation is unitary here, and the scattering matrix satisfies <InlineMath tex={"S^\\dagger S = I"} />.
              </p>
            </div>
            <div style={{ padding: 12, background: TINT.brass, borderRadius: 8, borderLeft: '3px solid var(--brass)' }}>
              <p style={{ fontSize: 13, color: 'var(--brass)', marginBottom: 4 }}>
                <strong><InlineMath tex={"\\sigma = 0"} /> — Boundary &amp; trivial zeros</strong>
              </p>
              <p style={{ fontSize: 13, ...body }}>
                The trivial zeros sit at <InlineMath tex={"s = -2, -4, -6, \\ldots"} /> (on the negative
                real axis, where <InlineMath tex={"\\sigma < 0"} />). These arise from poles of the gamma
                factor <InlineMath tex={"\\Gamma(s/2)"} /> in the functional equation.
              </p>
            </div>
            <div style={{ padding: 12, background: 'var(--paper3)', borderRadius: 8, borderLeft: '3px solid var(--faint)' }}>
              <p style={{ fontSize: 13, color: 'var(--faint)', marginBottom: 4 }}>
                <strong style={{ color: 'var(--ink-soft)' }}><InlineMath tex={"\\sigma < 0"} /> — Reflected region</strong>
              </p>
              <p style={{ fontSize: 13, ...body }}>
                The functional equation maps <InlineMath tex={"\\zeta(s) \\leftrightarrow \\zeta(1-s)"} />,
                so this region is entirely determined by <InlineMath tex={"\\sigma > 1"} />. No new
                information lives here.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <p style={{ ...body }}>
              <strong style={{ color: 'var(--terra)' }}>The zero-free region:</strong> The best known result
              (Vinogradov-Korobov) establishes that <InlineMath tex={"\\zeta(s) \\neq 0"} /> in the region:
            </p>
            <BlockMath tex={"\\sigma > 1 - \\frac{c}{(\\log |t|)^{2/3} (\\log \\log |t|)^{1/3}}"} />
            <p style={{ ...body, marginTop: 8 }}>
              for a constant <InlineMath tex={"c > 0"} /> and <InlineMath tex={"|t|"} /> sufficiently large.
              This narrows the zero-free corridor as <InlineMath tex={"|t| \\to \\infty"} />, but falls
              short of reaching <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            </p>
          </div>
          <div style={inset(TINT.terra)}>
            <p style={{ fontSize: 13, color: 'var(--terra)' }}>
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
        <div style={{ ...cardLeft('var(--terra-dk)'), marginTop: 32 }}>
          <h3 style={h3('var(--terra-dk)')}>The Functional Equation</h3>
          <p style={{ ...body, marginTop: 8 }}>
            The functional equation is the deepest symmetry of <InlineMath tex={"\\zeta(s)"} />, relating its
            values at <InlineMath tex={"s"} /> and <InlineMath tex={"1-s"} />. In its symmetric form, define the
            <strong style={{ color: 'var(--ink)' }}> completed zeta function</strong>:
          </p>
          <BlockMath tex={"\\xi(s) = \\tfrac{1}{2}s(s-1)\\,\\pi^{-s/2}\\,\\Gamma(s/2)\\,\\zeta(s)"} />
          <p style={{ ...body, marginTop: 12 }}>
            Then <InlineMath tex={"\\xi(s)"} /> is entire (no poles) and satisfies the reflection symmetry:
          </p>
          <BlockMath tex={"\\xi(s) = \\xi(1-s)"} />
          <p style={{ ...body, marginTop: 12 }}>
            The asymmetric form, which isolates the <strong style={{ color: 'var(--ink)' }}>bridge
            factor</strong> <InlineMath tex={"\\chi(s)"} />, is:
          </p>
          <BlockMath tex={"\\zeta(s) = \\chi(s)\\,\\zeta(1-s), \\qquad \\chi(s) = 2^s\\,\\pi^{s-1}\\sin\\!\\left(\\frac{\\pi s}{2}\\right)\\Gamma(1-s)"} />
          <div style={twoCol}>
            <div style={inset(TINT.terra)}>
              <p style={{ fontSize: 13, color: 'var(--terra-dk)' }}>
                <strong>Key property:</strong> On the critical
                line, <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> for all <InlineMath tex={"t"} />. This
                means <InlineMath tex={"\\chi"} /> is a pure phase rotation — it preserves magnitudes. In the ZPO
                model, this is the lossless bridge connecting direct and dual ladders: no energy is gained or
                lost when crossing from <InlineMath tex={"\\zeta(s)"} /> to <InlineMath tex={"\\zeta(1-s)"} />.
              </p>
            </div>
            <div style={inset(TINT.brass)}>
              <p style={{ fontSize: 13, color: 'var(--brass)' }}>
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
        <div style={{ ...cardLeft('var(--blue)'), marginTop: 32 }}>
          <h3 style={h3('var(--blue)')}>Hadamard Product: Factoring <InlineMath tex={"\\zeta"} /> Over Its Zeros</h3>
          <p style={{ ...body, marginTop: 8 }}>
            Just as a polynomial factors as a product over its roots, Hadamard (1893) showed that the
            completed zeta function <InlineMath tex={"\\xi(s)"} /> factors as an infinite product over the nontrivial zeros:
          </p>
          <BlockMath tex={"\\xi(s) = \\tfrac{1}{2} s(s-1) \\pi^{-s/2} \\Gamma(s/2)\\, \\zeta(s) = \\xi(0) \\prod_{\\rho} \\left(1 - \\frac{s}{\\rho}\\right)"} />
          <p style={{ ...body, marginTop: 12 }}>
            where the product runs over all nontrivial zeros <InlineMath tex={"\\rho"} /> (paired
            as <InlineMath tex={"\\rho"} /> and <InlineMath tex={"1-\\rho"} /> to ensure convergence).
            This is a <strong>spectral determinant</strong>: each zero contributes one factor, and
            the entire function is determined by its zero set — exactly as a quantum system's
            partition function is determined by its energy spectrum.
          </p>
          <div style={inset(TINT.blue)}>
            <p style={{ fontSize: 13, color: 'var(--blue)' }}>
              <strong>Twin-Ladder Bridge interpretation:</strong> The Hadamard product is the transfer function of the
              oscillator chain written as a cascade of resonance notches — one notch filter per zero. Each
              zero <InlineMath tex={"\\rho = \\tfrac{1}{2} + i\\gamma"} /> contributes a transmission null at
              frequency <InlineMath tex={"\\gamma"} />, and the complete chain response is the product of all notch filters.
            </p>
          </div>
        </div>

        {/* Related Pages */}
        <div style={{ ...cardLeft('var(--brass)'), marginTop: 24, background: 'var(--paper)' }}>
          <div style={eyebrow}>Related pages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Link to="/oscillators" style={{ color: 'var(--blue)', fontSize: 13 }}>Prime Oscillators</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/hamiltonian" style={{ color: 'var(--brass)', fontSize: 13 }}>Hamiltonian</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/waves" style={{ color: 'var(--blue)', fontSize: 13 }}>Waves</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/formal-proof" style={{ color: 'var(--green)', fontSize: 13 }}>Formal Proof</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/control" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Control Theory</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
