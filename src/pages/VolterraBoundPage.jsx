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

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';

const THREADS = [
  {
    id: 'imp-1258',
    title: 'Two-way collapse',
    to: '/collapse-chain',
    blurb:
      'Shows the §15-27 program is a single statement: 7+ paper conjectures reduce ' +
      'two-ways to the norm bound below. 60+ rows of empirical support sit ~5000x ' +
      'from saturation.',
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

export default function VolterraBoundPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>The Volterra Norm Bound: One Statement for §15-27</h1>

      <p>
        The §15-27 program collapses (imp-1258) to a single inequality on the operator
        norm of the Volterra operator <InlineMath math="V_{a,\Phi}" /> on{' '}
        <InlineMath math="L^2([0,\infty))" />:
      </p>

      <BlockMath math={String.raw`\|V_{a,\Phi}\| \le 1.`} />

      <p>
        Seven or more paper conjectures across §15-27 reduce, two-ways, to this one
        statement. The empirical evidence (60+ measured rows) clears the threshold by a
        wide margin — roughly a factor of <InlineMath math="5000\times" /> from
        saturation in the controllable regime — while the Hilbert-Schmidt bound
        (imp-1267) supplies an <em>analytical</em> proof that{' '}
        <InlineMath math="\|V_{a,\Phi}\| \le 1" /> for <InlineMath math="a \lesssim 2" />.
        The open frontier is <InlineMath math="a \gtrsim 2.3" />, where the bound
        diverges as <InlineMath math="J_a \sim e^{4a}" /> and rigorous control is lost.
      </p>

      <div
        style={{
          marginTop: 28,
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {THREADS.map((t) => (
          <Link
            key={t.id}
            to={t.to}
            style={{
              display: 'block',
              padding: '14px 16px',
              border: '1px solid #ccc',
              borderRadius: 6,
              textDecoration: 'none',
              color: 'inherit',
              background: '#fafafa',
            }}
          >
            <div style={{ fontWeight: 600, color: '#0066cc' }}>{t.title}</div>
            <div style={{ fontSize: 12, color: '#888', margin: '2px 0 8px' }}>
              {t.id}
            </div>
            <div style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>
              {t.blurb}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 30, fontSize: 13, color: '#555' }}>
        <p>
          <strong>References:</strong>{' '}
          <Link to="/paper-audit-dashboard" style={{ color: '#0066cc' }}>
            Paper Audit Dashboard
          </Link>{' '}
          (imp-1265) •{' '}
          <Link to="/viz-volterra-norm-curve" style={{ color: '#0066cc' }}>
            Op-norm vs HS bound curve
          </Link>{' '}
          (imp-1292)
        </p>
      </div>
    </div>
  );
}
