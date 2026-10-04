import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { FORMALIZATION_STATUS } from '../data/formalization-status-2026-07-09.js';

/**
 * FormalizationStatusPage — Editorial (warm) re-theme.
 * Full-width ed-root/ed-full shell; identical Lean formalization status
 * content (proved / stubbed lemma lists, mathlib gap notes, caveats) verbatim,
 * literal warm-palette hex in place of the dark slate palette.
 */

const { meta, proved, realRootedShadow, mathlibUnblock, stubbed, mathlibGap } = FORMALIZATION_STATUS;

export default function FormalizationStatusPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>
          Lean Formalization — Machine-Checked Rigor Pilot
        </h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: 15, lineHeight: 1.7, maxWidth: 800 }}>
          A Lean 4 scaffold of the de Bruijn–Newman lower-bound chain. The <em>definitional</em> layer
          (RH ⇔ Λ = 0) is machine-checked; the deep analytic theorems are <code>sorry</code>-stubs
          with their missing ingredients named. It proves nothing new — it hardens what's known and maps
          exactly what a full formalization would require.
        </p>

        <HonestCeilingBanner
          variant="ESTIMATE"
          title="A verifiable scaffold — not a proof of anything new"
          body={
            'Four order-lemmas are genuinely proved (axiom-audited); the three essential theorems ' +
            '(existence of Λ, de Bruijn monotonicity, Rodgers–Tao Λ≥0) are stated as `sorry`. Platt–Trudgian ' +
            'Λ ≤ 0.2 and Rodgers–Tao Λ ≥ 0 remain the cited rigorous results — neither is re-derived here. NO QED.'
          }
        />

        <p style={{ color: 'var(--ink-faint)', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', lineHeight: 1.6 }}>
          {meta.system} · {meta.location} · {meta.build} · commit d99a02f4
        </p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, maxWidth: 800 }}>{meta.headline}</p>

        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, maxWidth: 800, padding: '8px 12px', borderRadius: 7, background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', border: '1px solid var(--series-1)' }}>
          This page covers the de Bruijn–Newman scaffold only. A separate set of 20 kernel-verified
          Lean 4 projects (Harmonic Aristotle autoformalization, mathlib v4.28) lives at{' '}
          <code>formalization/lean-aristotle/</code>: the five permutation-calculus projects plus the
          waves-2–3 15-target ledger (closed 15/15), alongside the frozen-rung file set. Autoformalization
          caveat applies throughout: proofs are kernel-verified; statement faithfulness warrants referee review.
          Live Aristotle jobs (2026-09): the y-thaw package's O1 obligation is at Aristotle (job38,
          in progress) — status on the formalization thread at <code>/threads</code> and{' '}
          <code>/frontier-dag</code>.
        </p>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>✓ Proved (sorry-free, axiom-audited)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {proved.map((l) => (
            <div
              key={l.name}
              className="card"
              style={{ border: '1px solid color-mix(in srgb, var(--series-3) 33%, transparent)', background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', borderRadius: 8, padding: '10px 14px' }}
            >
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: 'var(--series-3)' }}>{l.name}</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: 'var(--ink-soft)', margin: '3px 0' }}>{l.statement}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{l.note} <span style={{ color: 'var(--ink-faint)' }}>· axioms: {l.axioms}</span></div>
            </div>
          ))}
        </div>

        {realRootedShadow && (
          <div
            className="card"
            style={{ border: '1px solid color-mix(in srgb, var(--series-3) 33%, transparent)', background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', borderRadius: 8, padding: '12px 16px', margin: '14px 0', maxWidth: 840 }}
          >
            <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--series-3)', marginBottom: 4 }}>2026-07-14 advance — RealRooted.lean (commit 91763a02)</div>
            <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.6 }}>{realRootedShadow.proved}</p>
            <p style={{ margin: '6px 0 0', color: 'var(--ink-faint)', fontSize: 12.5, lineHeight: 1.55 }}>{realRootedShadow.significance}</p>
          </div>
        )}

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>○ Stated but not proved (<code>sorry</code>-stubs)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stubbed.map((t) => (
            <div
              key={t.name}
              className="card"
              style={{ border: '1px solid color-mix(in srgb, var(--brass-deco) 33%, transparent)', background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', borderRadius: 8, padding: '10px 14px' }}
            >
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: 'var(--brass)' }}>{t.name} <span style={{ color: 'var(--ink-faint)' }}>:= sorry</span></div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: 'var(--ink-soft)', margin: '3px 0' }}>{t.statement}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}><strong style={{ color: 'var(--ink-soft)' }}>Needs:</strong> {t.needs}</div>
            </div>
          ))}
        </div>

        {mathlibUnblock && (
          <>
            <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>2026-07-16 — mathlib unblocked</h2>
            <div
              className="card"
              style={{ border: '1px solid color-mix(in srgb, var(--series-3) 33%, transparent)', background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', borderRadius: 8, padding: '12px 16px', maxWidth: 860 }}
            >
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--series-3)', marginBottom: 4 }}>{mathlibUnblock.status}</div>
              <p style={{ margin: '2px 0', fontSize: 12.5, color: 'var(--ink-faint)', lineHeight: 1.55 }}><strong>Cause:</strong> {mathlibUnblock.cause}</p>
              <p style={{ margin: '2px 0', fontSize: 12.5, color: 'var(--ink-faint)', lineHeight: 1.55 }}><strong>Fix:</strong> {mathlibUnblock.fix}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}><strong>New sorry-free lemmas:</strong> {mathlibUnblock.newLemmas}</p>
              {mathlibUnblock.reduction && <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--series-1)', lineHeight: 1.6 }}><strong>Reduction:</strong> {mathlibUnblock.reduction}</p>}
            </div>
          </>
        )}

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>How far is a full Λ ≥ 0 formalization?</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 820 }}>
          <strong style={{ color: 'var(--series-3)' }}>mathlib already has:</strong> {mathlibGap.present}
        </p>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 820 }}>
          <strong style={{ color: 'var(--brass)' }}>mathlib still lacks:</strong> {mathlibGap.absent}
        </p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, maxWidth: 820 }}>{mathlibGap.verdict}</p>

        {/* Related pages */}
        <div className="card" style={{ marginTop: 24, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--ink-faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/pt-floor-audit" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → What Binds the Λ≤0.2 Floor?
            </Link>
            <Link to="/debruijn-departure" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → Zero Departure (exact flow)
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
