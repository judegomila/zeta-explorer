import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';

/**
 * DiagramGalleryPage (/diagrams) — one place to see every section-geometry
 * diagram. Each is drawn from the real math (positions/curves/inertia computed,
 * not decorated); the caption states exactly what geometry it depicts and where
 * it is used on the site.
 */

const DIAGRAMS = [
  {
    kind: 'critical-strip',
    title: 'Critical strip',
    caption: 'The strip 0 < Re s < 1 with the line Re s = ½ and the first three zeros marked at their true relative heights (14.13, 21.02, 25.01). RH is the claim that every non-trivial zero sits on the dashed line.',
    used: '/lambda-bounds context',
  },
  {
    kind: 'zeta-zero-vortex',
    title: 'Zeta-zero vortex',
    caption: 'A phase portrait of arg(s − ρ) computed per cell with atan2: the hue wheel winds exactly once around a simple zero (winding number = 1). This is the phase-vortex the home page renders live on ζ itself.',
    used: 'Atlas · Original Ideas',
  },
  {
    kind: 'heat-flow',
    title: 'Heat flow (the sign that matters)',
    caption: 'The roots of p(x) = x² − a² under the heat semigroup. Backward e^{−tD²}: roots stay real and spread to ±√(a²+2t). Forward e^{+tD²}: they collide at t = ½ then split off-axis to ±i√(2t−a²). Λ ≤ 0 is exactly the statement that the real-root regime holds.',
    used: 'Atlas · Machinery',
  },
  {
    kind: 'gram-matrix',
    title: 'Gram matrix & inertia',
    caption: 'A Hermitian Gram matrix G = G⋆ with its inertia (n₊, n₋) computed live from LDLᵀ pivot signs → (4, 1). The weld / copositivity geometry: the certificate closes iff n₋ = 0.',
    used: 'Atlas · Permutation-Freeze · /permutation-architecture',
  },
  {
    kind: 'contour-winding',
    title: 'Contour winding',
    caption: 'The argument principle: N = (1/2πi) ∮ d arg f counts the interior zeros of a rectangular contour — here three. The Lean-verified general argument principle on rectangles is one of the theory pieces mathlib currently lacks.',
    used: 'Atlas · Direct-RH',
  },
  {
    kind: 'dirichlet-ladder',
    title: 'Dirichlet ladder',
    caption: 'The prime-power ladder: rungs at m · log p for p = 2, 3, 5, 7, plotted to scale. The arithmetic input the flow-blindness no-go says any RH proof must eventually use.',
    used: 'reference',
  },
  {
    kind: 'twistor-fiber',
    title: 'Twistor fiber',
    caption: 'A cross-section of the nested tori with two linked Hopf fibres S³ → S². Schematic (linked circles, not a projected Villarceau computation) — the geometry of the twistor / Robinson-congruence framework.',
    used: '/viz-twistor-dual-intertwiner',
  },
  {
    kind: 'pair-correlation',
    title: 'Pair correlation',
    caption: 'The real Montgomery pair-correlation kernel 1 − (sin πx / πx)² (GUE) against the flat Poisson line. The spectral-statistics geometry behind the PCC obstruction shared across the literature routes.',
    used: 'Atlas · Literature / PCC',
  },
  {
    kind: 'de-bruijn-track',
    title: 'de Bruijn–Newman track',
    caption: 'The Λ number line: 0 (Rodgers–Tao lower bound) to 0.2 (Platt–Trudgian peer-reviewed benchmark), corridor shaded, with 0.14 (the completion contract) and 0.1776 (the y-thaw candidate) placed to scale. RH ⇔ Λ ≤ 0; with Λ ≥ 0, RH ⇔ Λ = 0.',
    used: 'Atlas · /threads · /lambda-bounds',
  },
  {
    kind: 'no-go-wall',
    title: 'No-go wall',
    caption: 'Several routes funnelling into one barrier — the C_H / PCC wall where the soft-analysis approaches converge and stop. Mapping where a proof cannot come from is itself progress.',
    used: 'Atlas · /route-map · /what-we-know',
  },
];

export default function DiagramGalleryPage() {
  return (
    <PostLayout>
      <p className="ed-eyebrow">SECTION GEOMETRY</p>
      <h1>The diagrams</h1>
      <p className="ed-lede">
        Every section-geometry diagram used across the site, in one place. Each is
        drawn from the real mathematics — zero heights, phase winding, root
        positions, matrix inertia and the pair-correlation curve are computed, not
        decorated — so the picture is faithful to the object it names. Where each
        appears is noted under its caption.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          margin: '2rem 0',
        }}
      >
        {DIAGRAMS.map((d) => (
          <figure
            key={d.kind}
            style={{
              margin: 0,
              border: '1px solid var(--hairline, #d5c9b2)',
              borderRadius: 10,
              padding: '0.9rem 1rem 1.1rem',
              background: 'var(--paper, #fdfaf3)',
            }}
          >
            <figcaption
              className="ed-mono"
              style={{ fontSize: 12, color: 'var(--faint, #8a7f6d)', marginBottom: 6 }}
            >
              {d.kind}
            </figcaption>
            <WireframeAnim kind={d.kind} />
            <h3 style={{ margin: '0.7rem 0 0.35rem', fontSize: '1.05rem' }}>{d.title}</h3>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {d.caption}
            </p>
            <p
              className="ed-mono"
              style={{ margin: 0, fontSize: 11, color: 'var(--brass, #8c6a1d)' }}
            >
              used: {d.used}
            </p>
          </figure>
        ))}
      </div>

      <p style={{ fontSize: '0.92rem' }}>
        See these in context on the <Link to="/atlas">atlas</Link> (seven of them,
        one per area), or the <Link to="/route-map">route map</Link> and{' '}
        <Link to="/what-we-know">what we know</Link>.
      </p>
    </PostLayout>
  );
}
