// VizTwistorDualIntertwinerPage.jsx
//
// Route /viz-twistor-dual-intertwiner — full 3D explorer of projective
// twistor space PT (Robinson congruence), its dual PT*, and the incidence
// correspondence / intertwiner between them, with the Riemann zeta function
// mapped onto the fibration.  Shell-wrapped viz-legacy page (the AppShell
// injects the cream EditorialHeader chrome); the heavy three.js component is
// lazy-loaded so this page chunk stays light.
//
// Honest ceiling: the twistor geometry is the paper's auxiliary O-status
// layer; the intertwiner equation I_K F+ = F- ∘ R is a design requirement,
// not a known theorem.  The rendering proves nothing about zeta — no Lambda
// bound, no RH claim.

import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

const TwistorDualIntertwinerViz = React.lazy(
  () => import('../components/TwistorDualIntertwinerViz.jsx'),
);

const mono = 'var(--ed-mono, "IBM Plex Mono", monospace)';

export default function VizTwistorDualIntertwinerPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 1160, margin: '0 auto' }}>
      <PageHeader title="Twistor Space, its Dual, and the Intertwiner" />

      <p style={{ color: 'var(--ink-soft, #4a4238)', fontSize: 14, lineHeight: 1.7, maxWidth: 860, margin: '0 0 6px 0' }}>
        Left: the Robinson congruence — the Hopf fibration S³ → S² stereographically projected
        to ℝ³, the true Penrose picture of a single twistor. Right: the dual congruence with
        opposite helicity. Between them: the incidence correspondence Q = {'{'}([Z],[W]) : W·Z = 0{'}'}.
        The height t of the slice s = σ + it wraps around each axis, and the Riemann–Siegel Z(t)
        paints sign and magnitude onto the fibers — each zeta zero is a color-family flip and a
        fiber neck-down. Drag to orbit; scroll to zoom.
      </p>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/twistor" style={{ color: 'var(--brass-dk, #9a7b3f)', fontFamily: mono, fontSize: 12 }}>
          &larr; Twistor Duality (context + paper mapping)
        </Link>
        <Link to="/visualizations" style={{ color: 'var(--ink-soft, #4a4238)', fontFamily: mono, fontSize: 12 }}>
          All Visualizations
        </Link>
      </div>

      <Suspense
        fallback={
          <div style={{ height: 580, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint, #8a7f6d)', fontFamily: mono, fontSize: 13, border: '1px solid var(--hairline, #d5c9b2)', borderRadius: 12, background: 'var(--paper)' }}>
            Loading 3D congruence…
          </div>
        }
      >
        <TwistorDualIntertwinerViz />
      </Suspense>
    </div>
  );
}
