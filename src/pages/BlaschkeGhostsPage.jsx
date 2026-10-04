import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { BLASCHKE_GHOSTS_SECTION } from '../data/blaschke-ghosts-section.js';
import DownstreamVerdictCallout from '../components/DownstreamVerdictCallout.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

/**
 * BlaschkeGhostsPage — renders §17 "Approach on the Wall: Inverse Blaschke
 * Ghosts and the Pontryagin Decomposition" from the user's paper at
 * research-inputs/twin_ladder_consolidated_v52.pdf (pages 22-26).
 *
 * Includes an interactive demo: move a hypothetical off-critical zero
 * around in the right half-plane and inspect the candidate negative-square
 * witness, with the fixed-shift common-factor caveat stated explicitly.
 *
 * Editorial (warm) re-theme: full-width shell, identical structure/data.
 */

const S = BLASCHKE_GHOSTS_SECTION;

function Card({ children, accent = 'var(--hairline)' }) {
  return (
    <div style={{
      background: 'var(--paper2)',
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

  // The slider only locates a denominator zero. It cannot test whether the
  // numerator also vanishes at λ-2a, so a displayed ghost is conditional on
  // the denominator zero surviving common-factor cancellation.
  const ghostPresentUnderNoCancellation = delta > a;
  const negativeSquareWeight = ghostPresentUnderNoCancellation ? 2 * (delta - a) : 0;

  return (
    <Card accent={ED.brass}>
      <h3 style={{ color: 'var(--brass-dk)', fontSize: 18, margin: '0 0 12px 0' }}>
        Interactive: Candidate ghost negative-square witness
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px 0' }}>
        Place a hypothetical off-critical zero <InlineMath math="\rho = 1/2 + \delta + i\gamma" /> and
        choose a bridge thickness <InlineMath math="a > 0" />. The condition <InlineMath math="\delta > a" />{' '}
        places a denominator zero in the right half-plane. It becomes a ghost pole only if its multiplicity
        exceeds that of any numerator zero at <InlineMath math="\lambda-2a" />.
      </p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr', marginBottom: 16 }}>
        <label style={{ color: 'var(--faint)', fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
          δ (horizontal displacement): {delta.toFixed(3)}
          <input
            type="range" min="0" max="0.5" step="0.005"
            value={delta} onChange={(e) => setDelta(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
        </label>
        <label style={{ color: 'var(--faint)', fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
          γ (imaginary part): {gamma.toFixed(2)}
          <input
            type="range" min="0" max="50" step="0.5"
            value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
        </label>
        <label style={{ color: 'var(--faint)', fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
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
        background: ghostPresentUnderNoCancellation ? 'color-mix(in srgb, var(--series-2) 10%, transparent)' : 'color-mix(in srgb, var(--series-3) 10%, transparent)',
        border: `1px solid ${ghostPresentUnderNoCancellation ? TK_ALPHA(ED.series2, 0.4) : TK_ALPHA(ED.series3, 0.4)}`,
        borderRadius: 6,
      }}>
        <div style={{
          color: ghostPresentUnderNoCancellation ? 'var(--terra-dk)' : 'var(--green)',
          fontWeight: 700, fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))',
          letterSpacing: 0.5,
        }}>
          {ghostPresentUnderNoCancellation
            ? 'CANDIDATE GHOST — CHECK COMMON-FACTOR CANCELLATION'
            : 'NO RIGHT-HALF-PLANE DENOMINATOR ZERO FROM THIS λ'}
        </div>
        <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
          {ghostPresentUnderNoCancellation ? (
            <>
              Candidate pole location for <InlineMath math="R_a" />:{' '}
              <InlineMath math={`\\alpha = (${delta.toFixed(3)} - ${a.toFixed(3)}) + i \\cdot ${gamma.toFixed(2)} = ${(delta - a).toFixed(3)} + ${gamma.toFixed(2)} i`} />.
              If the zero survives reduction, its negative-square weight is{' '}
              <InlineMath math={`-2(\\delta - a) = -${negativeSquareWeight.toFixed(3)}`} />.
            </>
          ) : (
            <>The zero’s horizontal displacement δ = {delta.toFixed(3)} ≤ a = {a.toFixed(3)}, so it creates no right-half-plane denominator zero in <InlineMath math="R_a" />.</>
          )}
        </div>
      </div>
    </Card>
  );
}

function FourRouteDecomposition() {
  // Tiny SVG showing 4 routes converging to a "ghost-absence" shared bottleneck.
  return (
    <svg width="100%" viewBox="0 0 600 240" style={{ background: 'var(--paper)', borderRadius: 8 }}>
      {/* Routes */}
      {[
        { x: 80, y: 40,  label: 'Route A', sub: 'Schur', color: 'var(--blue)' },
        { x: 80, y: 100, label: 'Route B', sub: 'de Branges', color: 'var(--brass)' },
        { x: 80, y: 160, label: 'Route C', sub: 'Hidden-square', color: 'var(--terra-dk)' },
        { x: 80, y: 220, label: 'Route D', sub: 'Weil / TL', color: 'var(--green)' },
      ].map((r) => (
        <g key={r.label}>
          <rect x={r.x - 50} y={r.y - 16} width="100" height="32" rx="6" fill={r.color} fillOpacity="0.14" stroke={r.color} strokeWidth="1.5" />
          <text x={r.x} y={r.y - 2} fill={r.color} textAnchor="middle" fontSize="13" fontWeight="700">{r.label}</text>
          <text x={r.x} y={r.y + 12} fill={ED.inkSoft} textAnchor="middle" fontSize="10">{r.sub}</text>
          <line x1={r.x + 50} y1={r.y} x2={400} y2={130} stroke={ED.rule} strokeWidth="1" />
        </g>
      ))}
      {/* Shared bottleneck */}
      <rect x="400" y="110" width="160" height="40" rx="8" fill={ED.series2} fillOpacity="0.14" stroke={ED.accent} strokeWidth="2" />
      <text x="480" y="128" fill={ED.accent} textAnchor="middle" fontSize="13" fontWeight="700">Ghost-absence</text>
      <text x="480" y="142" fill={ED.inkSoft} textAnchor="middle" fontSize="10">B⁺_a ≡ 1 for every a &gt; 0 ⇔ RH</text>
    </svg>
  );
}

export default function BlaschkeGhostsPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', textTransform: 'uppercase', letterSpacing: 1 }}>
            /blaschke-ghosts · paper {S.paperSection} · pp. {S.paperPageRange}
          </div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>
            {S.title}
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
            {S.oneLine}
          </p>
        </header>

        <AnimationEmbed id="ghost-freeze" />

        <DownstreamVerdictCallout />

        {/* Shifted scattering ratio */}
        <Card>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>§17.1 The shifted scattering ratio</h3>
          <BlockMath math="R_a(w) := \frac{X(w-a)}{X(w+a)}, \quad \mathfrak{R}w > 0,\ a > 0,\quad X(w) := \xi(\tfrac{1}{2} + w)" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            On the boundary <InlineMath math="\mathfrak{R}w = 0" /> the functional equation gives <InlineMath math="|R_a(it)|=1" />.
            If <InlineMath math="X(\lambda)=0" /> with <InlineMath math="\lambda=\delta+i\gamma" /> and{' '}
            <InlineMath math="\delta>a" />, the denominator vanishes at <InlineMath math="\alpha=(\delta-a)+i\gamma" />.
            This is a pole of the reduced ratio only when its multiplicity exceeds that of the possible
            numerator zero <InlineMath math="X(\lambda-2a)=0" />.
          </p>
        </Card>

        {/* Blaschke ghost factor + pole-clearing */}
        <Card>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>§17.2 Right-half-plane Blaschke ghosts</h3>
          <BlockMath math="b_\alpha(w) := \frac{w-\alpha}{w+\bar{\alpha}} \quad (\mathfrak{R}\alpha > 0)" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            <InlineMath math="|b_\alpha(it)|=1" /> on the boundary; <InlineMath math="b_\alpha" /> has a zero at <InlineMath math="w=\alpha" />,
            so multiplying <InlineMath math="R_a" /> by <InlineMath math="b_\alpha" /> removes the pole there.
            The ghost Blaschke product runs over the residual poles after common-factor cancellation:
          </p>
          <BlockMath math="B_a^+(w) := \prod_{\alpha \in P_a} b_\alpha(w), \qquad P_a := \{\alpha\in\mathbb{C}_+ : \operatorname{ord}_\alpha X(w+a) > \operatorname{ord}_\alpha X(w-a)\}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Proposition 17.1 (pole-clearing decomposition):</strong>
            <InlineMath math=" R_a = \widetilde{R}_a / B_a^+" />, where <InlineMath math="\widetilde{R}_a" /> is pole-free in the right half-plane.
            This identity requires a finite residual-pole set or a convergent Blaschke product.
            The condition <InlineMath math="B_a^+ \equiv 1" /> removes residual right-half-plane poles,
            but Schur membership additionally requires analytic bounded-type contractivity. A nontrivial
            inverse-Blaschke factor supplies a local negative-square witness only inside a valid coprime
            generalized-Schur factorization.
          </p>
        </Card>

        {/* The headline §17.3 result */}
        <Card accent={ED.brassDeco}>
          <h3 style={{ color: 'var(--brass-dk)', fontSize: 18, margin: '0 0 12px 0' }}>
            §17.3 One ghost = one negative square
          </h3>
          <BlockMath math="K_S(z,w) = \frac{1 - S(z)\overline{S(w)}}{z+\bar{w}}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            For a single inverse Blaschke factor <InlineMath math="S(w) = 1/b_\alpha(w) = (w+\bar{\alpha})/(w-\alpha)" />:
          </p>
          <BlockMath math="K_S(z,w) = -\frac{2\,\mathfrak{R}\alpha}{(z-\alpha)(\bar{w}-\bar{\alpha})} = -k_\alpha(z)\,\overline{k_\alpha(w)},\quad k_\alpha(z) = \frac{\sqrt{2\,\mathfrak{R}\alpha}}{z-\alpha}" />
          <p style={{ color: 'var(--brass-dk)', fontSize: 15, fontWeight: 700, lineHeight: 1.6, marginTop: 12 }}>
            The kernel of ONE isolated inverse Blaschke factor has EXACTLY ONE rank-one negative square.
            Extending that local calculation to the full bridge requires the factorization hypotheses stated below.
          </p>
        </Card>

        {/* Interactive demo */}
        <GhostInteractiveDemo />

        {/* Generalized Schur */}
        <Card>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>§17.4 Negative-index identity (Krein-Langer)</h3>
          <BlockMath math="\mathrm{ind}_-\!\bigl(K_{R_a}\bigr) = \sum_{\alpha\in P_a}\operatorname{mult}(\alpha),\qquad P_a=\{\text{residual poles of }R_a\text{ in }\mathbb{C}_+\}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            This is the Krein-Langer identity only after one proves that the reduced quotient has a
            coprime generalized-Schur factorization with finite negative index (or a rigorously controlled
            finite-window analogue). It is not automatic for the analytically continued zeta quotient.
            Under a no-common-zero hypothesis the pole count then equals the number of off-critical denominator
            zeros beyond the shift. Without that hypothesis, the fixed-<InlineMath math="a" /> statement retains
            the cancellation caveat. Requiring an empty residual pole set for every <InlineMath math="a>0" />
            is the cancellation-aware RH-strength statement; it still does not establish Schur contractivity.
          </p>
        </Card>

        {/* Four-route consequences */}
        <Card>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>§17.5 Consequences for the four closure routes</h3>
          <FourRouteDecomposition />
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            {S.fourRouteConsequences.map((r) => (
              <div key={r.route} style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
                <div style={{ fontSize: 13, color: 'var(--brass-dk)', fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  Route {r.route}: {r.name}
                </div>
                <div style={{ marginTop: 6 }}>
                  <BlockMath math={r.consequence.replace(/⇔/g, '\\iff').replace(/⪰/g, '\\succeq').replace(/∅/g, '\\emptyset').replace(/Σ/g, '\\sum').replace(/‖/g, '\\|').replace(/⟨/g, '\\langle').replace(/⟩/g, '\\rangle')} />
                </div>
                <div style={{ color: 'var(--faint)', fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>{r.reading}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conjecture 17.3 */}
        <Card accent={ED.series2}>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 18, margin: '0 0 12px 0' }}>§17.6 The sharpened wall</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--terra-dk)' }}>Conjecture 17.3 (Ghost-absence theorem).</strong>{' '}
            For every <InlineMath math="a > 0" />, the right-half-plane ghost Blaschke product <InlineMath math="B_a^+(w)" /> is identically 1.
          </p>
          <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginTop: 10, paddingLeft: 22 }}>
            {S.sharpenedWall.equivalentReformulations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Card>

        {/* Three attempted closures */}
        <Card>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>§17.7 Attempted non-circular closures</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Three programs aim to prove ghost-absence without assuming RH:
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {S.attemptedClosures.map((a) => (
              <div key={a.id} style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6, borderLeft: '3px solid var(--brass)' }}>
                <div style={{ fontSize: 13, color: 'var(--brass-dk)', fontWeight: 700 }}>{a.name} <span style={{ color: 'var(--faint)', fontWeight: 400 }}>({a.paperSection})</span></div>
                <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 4 }}>{a.description}</div>
                <div style={{ color: 'var(--terra-dk)', fontSize: 11, marginTop: 6, fontFamily: 'var(--ed-mono, var(--font-mono))', textTransform: 'uppercase' }}>
                  status: {a.status}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/three-attacks" style={{ color: 'var(--blue)', textDecoration: 'none', fontSize: 13 }}>
              → See the dedicated /three-attacks page for §18 detail
            </Link>
          </div>
        </Card>

        {/* Related */}
        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Related pages:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/shift-bridge-positivity" style={{ color: 'var(--blue)', fontSize: 13 }}>/shift-bridge-positivity</Link>
            <Link to="/closure-routes" style={{ color: 'var(--blue)', fontSize: 13 }}>/closure-routes</Link>
            <Link to="/three-attacks" style={{ color: 'var(--blue)', fontSize: 13 }}>/three-attacks</Link>
            <Link to="/reciprocal-program" style={{ color: 'var(--blue)', fontSize: 13 }}>/reciprocal-program</Link>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Source: {S.paperSourcePath} {S.paperSection} (pp. {S.paperPageRange})
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/">← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
