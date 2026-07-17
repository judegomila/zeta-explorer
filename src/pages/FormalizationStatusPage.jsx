import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { FORMALIZATION_STATUS } from '../data/formalization-status-2026-07-09.js';

const { meta, proved, realRootedShadow, mathlibUnblock, stubbed, mathlibGap } = FORMALIZATION_STATUS;

export default function FormalizationStatusPage() {
  return (
    <div className="page">
      <h1>Lean Formalization — Machine-Checked Rigor Pilot</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 800 }}>
        A Lean 4 scaffold of the de Bruijn–Newman lower-bound chain. The <em>definitional</em> layer
        (RH ⇔ Λ = 0) is machine-checked; the deep analytic theorems are honest <code>sorry</code>-stubs
        with their missing ingredients named. It proves nothing new — it hardens what's known and maps
        exactly what a full formalization would require.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="A verifiable scaffold — not a proof of anything new"
        body={
          'Four order-lemmas are genuinely proved (axiom-audited); the three load-bearing theorems ' +
          '(existence of Λ, de Bruijn monotonicity, Rodgers–Tao Λ≥0) are stated as `sorry`. Platt–Trudgian ' +
          'Λ ≤ 0.2 and Rodgers–Tao Λ ≥ 0 remain the cited rigorous results — neither is re-derived here. NO QED.'
        }
      />

      <p style={{ color: '#64748b', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', lineHeight: 1.6 }}>
        {meta.system} · {meta.location} · {meta.build} · commit d99a02f4
      </p>
      <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, maxWidth: 800 }}>{meta.headline}</p>

      <h2>✓ Proved (sorry-free, axiom-audited)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {proved.map((l) => (
          <div key={l.name} style={{ border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#10b981' }}>{l.name}</div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: '#cbd5e1', margin: '3px 0' }}>{l.statement}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{l.note} <span style={{ color: '#475569' }}>· axioms: {l.axioms}</span></div>
          </div>
        ))}
      </div>

      {realRootedShadow && (
        <div style={{ border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: '12px 16px', margin: '14px 0', maxWidth: 840 }}>
          <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#10b981', marginBottom: 4 }}>2026-07-14 advance — RealRooted.lean (commit 91763a02)</div>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: 13.5, lineHeight: 1.6 }}>{realRootedShadow.proved}</p>
          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 12.5, lineHeight: 1.55 }}>{realRootedShadow.significance}</p>
        </div>
      )}

      <h2>○ Stated but not proved (honest <code>sorry</code>-stubs)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stubbed.map((t) => (
          <div key={t.name} style={{ border: '1px solid #f59e0b55', background: 'rgba(245,158,11,0.06)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#f59e0b' }}>{t.name} <span style={{ color: '#64748b' }}>:= sorry</span></div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: '#cbd5e1', margin: '3px 0' }}>{t.statement}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}><strong style={{ color: '#cbd5e1' }}>Needs:</strong> {t.needs}</div>
          </div>
        ))}
      </div>

      {mathlibUnblock && (
        <>
          <h2>2026-07-16 — mathlib unblocked</h2>
          <div style={{ border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: '12px 16px', maxWidth: 860 }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#10b981', marginBottom: 4 }}>{mathlibUnblock.status}</div>
            <p style={{ margin: '2px 0', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}><strong>Cause:</strong> {mathlibUnblock.cause}</p>
            <p style={{ margin: '2px 0', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}><strong>Fix:</strong> {mathlibUnblock.fix}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}><strong>New sorry-free lemmas:</strong> {mathlibUnblock.newLemmas}</p>
            {mathlibUnblock.reduction && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#22d3ee', lineHeight: 1.6 }}><strong>Reduction:</strong> {mathlibUnblock.reduction}</p>}
          </div>
        </>
      )}

      <h2>How far is a full Λ ≥ 0 formalization?</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 820 }}>
        <strong style={{ color: '#10b981' }}>mathlib already has:</strong> {mathlibGap.present}
      </p>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 820 }}>
        <strong style={{ color: '#f59e0b' }}>mathlib still lacks:</strong> {mathlibGap.absent}
      </p>
      <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, maxWidth: 820 }}>{mathlibGap.verdict}</p>

      <p style={{ marginTop: 24 }}>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8' }}>→ What Binds the Λ≤0.2 Floor?</Link>
        <Link to="/debruijn-departure" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Zero Departure (exact flow)</Link>
      </p>
    </div>
  );
}
