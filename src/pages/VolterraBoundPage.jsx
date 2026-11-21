// VolterraBoundPage.jsx — imp-1269 sub-(b)
//
// Single hub surfacing the §15-27 program collapse: the whole paper-conjecture
// cluster reduces to the one Volterra norm statement  ||V_{a,Phi}|| <= 1.
// Links the supporting threads in one place:
//   imp-1258  two-way collapse (7+ conjectures => single norm bound)
//   imp-1240  empirical op-norm grid + Lambda bounds roadmap
//   imp-1262  extended (U, a) op-norm grid
//   imp-1266  Mellin-route failure note (why a > 2.3 escapes rigorous control)
//   imp-1267  Hilbert-Schmidt bound  ||V||_op <= sqrt(I_0 * J_a)
//
// Static content only (no heavy data import); KaTeX for the math, internal Links
// to the existing viz pages that carry the actual numerics.
//
// Editorial (warm) re-theme: full-width shell, identical structure/data/content.
// The RH-EQUIVALENT (not a reduction) framing carried by HonestCeilingBanner is
// preserved verbatim, as is every claim/number/caveat in the body copy below.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import StatusNote from '../components/StatusNote.jsx';

const THREADS = [
  {
    id: 'imp-1258',
    title: 'Two-way collapse',
    to: '/collapse-chain',
    blurb:
      'Shows the §15-27 program is a single statement: 7+ paper conjectures reduce ' +
      'two-ways to the norm bound below. (The once-quoted ~5000x margin was a ' +
      'homogeneity artifact, not evidence.)',
  },
  {
    id: 'imp-1267',
    title: 'Hilbert-Schmidt bound',
    to: '/viz-volterra-norm-curve',
    blurb:
      'Rigorous analytical upper bound ||V||_op <= ||V||_HS = sqrt(I_0 * J_a), tight ' +
      'against the empirical op-norm for small a. Diverges as J_a ~ e^{4a} once a > 2.3.',
  },
  {
    id: 'imp-1240',
    title: 'Empirical op-norm grid + Λ roadmap',
    to: '/lambda-bounds',
    blurb:
      'The measured operator-norm grid and the Lambda-bounds roadmap placing the ' +
      'collapse inside the broader RH-attack program.',
  },
  {
    id: 'imp-1262',
    title: 'Extended (U, a) grid',
    to: '/viz-volterra-kernel-heatmap',
    blurb:
      'Wider truncation-window / parameter sweep of the kernel, confirming the bound ' +
      'holds across the controllable regime.',
  },
  {
    id: 'imp-1266',
    title: 'Mellin-route failure note',
    to: '/closure-routes',
    blurb:
      'Why the Mellin route does not recover rigorous control for a > 2.3: the ' +
      'exponential growth of J_a outruns the available decay.',
  },
];

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '14px 16px',
  };
}

export default function VolterraBoundPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <StatusNote item="hidden-square" recordsFormulation>
          The inequality ‖V_{'{'}a,Φ{'}'}‖ ≤ 1 holds for a ≤ a* and fails for a ≥ 31.6214, with
          31.6213 &lt; a* &lt; 31.6214 (repository normalisation). It is not equivalent to K_a ≥ 0 in either direction,
          so the §15-27 conjectures do not reduce to it and it is not RH-equivalent. It holds for the
          Davenport-Heilbronn kernel where that kernel’s K_a is indefinite. Measured norms about 5000 times below 1
          reflect the size of Φ² and are not evidence.
        </StatusNote>
        <HonestCeilingBanner variant="RH-EQUIVALENT" />

        <h1 className="ed-h1" style={{ marginBottom: 10 }}>
          The Volterra Norm Bound: One Statement for §15-27
        </h1>
        <p className="ed-lbl">Related: <Link to="/collapse-chain">Collapse chain: ‖V‖ ≤ 1 ⇔ CDB-Exist</Link></p>

        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
          The §15-27 program collapses (imp-1258) to a single inequality on the operator
          norm of the Volterra operator <InlineMath math="V_{a,\Phi}" /> on{' '}
          <InlineMath math="L^2([0,\infty))" />:
        </p>

        <BlockMath math={String.raw`\|V_{a,\Phi}\| \le 1.`} />

        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
          Seven or more paper conjectures across §15-27 reduce, two-ways, to this one
          statement. The empirical evidence (60+ measured rows) clears the threshold —
          the oft-quoted factor of <InlineMath math="5000\times" /> from saturation, though
          that margin was later shown to be a <strong>homogeneity artifact</strong> (it measured a
          scale-miscalibrated bare operator, so it is <em>not</em> evidence for the conjecture;
          see the corrections ledger on <Link to="/what-we-know">What&nbsp;We&nbsp;Know</Link>).
          The Hilbert-Schmidt bound (imp-1267) supplies an <em>analytical</em> proof that{' '}
          <InlineMath math="\|V_{a,\Phi}\| \le 1" /> for <InlineMath math="a \lesssim 2" />.
          The open frontier is <InlineMath math="a \gtrsim 2.3" />, where the bound
          diverges as <InlineMath math="J_a \sim e^{4a}" /> and rigorous control is lost — and the
          statement itself is RH-equivalent, not a shortcut.
        </p>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Supporting threads</h2>
        <div className="card-grid" style={{ marginBottom: 24 }}>
          {THREADS.map((t) => (
            <Link
              key={t.id}
              to={t.to}
              className="card"
              style={{ ...cardBaseLeft('var(--brass)'), display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ fontWeight: 600, color: 'var(--brass-dk)', fontSize: 15 }}>{t.title}</div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--ed-mono, var(--font-mono))',
                  color: 'var(--faint)',
                  margin: '2px 0 8px',
                }}
              >
                {t.id}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {t.blurb}
              </div>
            </Link>
          ))}
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--ink)' }}>References:</strong>{' '}
            <Link to="/paper-audit-dashboard" style={{ color: 'var(--brass-dk)' }}>
              Paper Audit Dashboard
            </Link>{' '}
            (imp-1265) •{' '}
            <Link to="/viz-volterra-norm-curve" style={{ color: 'var(--brass-dk)' }}>
              Op-norm vs HS bound curve
            </Link>{' '}
            (imp-1292)
          </p>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-soft)', borderTop: '1px solid var(--hairline)', paddingTop: 20 }}>
          <p style={{ margin: '12px 0 0 0' }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>

        <RelatedLinks links={[
          { to: '/collapse-chain', label: 'Collapse Chain', color: 'var(--brass)' },
          { to: '/paper-audit-dashboard', label: 'Paper Audit Dashboard', color: 'var(--blue)' },
          { to: '/twin-ladder', label: 'Twin-Ladder Roadmap', color: 'var(--brass-dk)' },
          { to: '/viz-volterra-norm-curve', label: 'Volterra Norm Curve', color: 'var(--green)' },
        ]} />
      </div>
    </div>
  );
}
