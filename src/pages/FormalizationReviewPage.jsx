import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { FORMALIZATION_REVIEW } from '../data/formalization-review-2026-07-20.js';

const { meta, results, unlocks, significance, verify, openQuestions } = FORMALIZATION_REVIEW;

export default function FormalizationReviewPage() {
  return (
    <div className="page">
      <h1>Formalization — Pre-Submission Review Dashboard</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        A shareable review page for the machine-checked <strong>polynomial de Bruijn / Pólya–Schur
        theorem</strong>, packaged for external review before any mathlib submission. The result, why
        it matters, how to verify it independently, and the open questions for a maintainer.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="A classical theorem, machine-checked — NOT the Riemann Hypothesis"
        body={
          'Every result here is classical (Pólya–Schur 1914 / de Bruijn 1950). This is verified, reusable ' +
          'foundational infrastructure that fills a mathlib gap — it is NOT new mathematics and NOT progress ' +
          'on RH or on Λ ≥ 0. Platt–Trudgian Λ ≤ 0.2 remains the rigorous SOTA. No QED.'
        }
      />

      <h2>The result</h2>
      <p style={{ color: '#e2e8f0', fontSize: 14.5, lineHeight: 1.7, maxWidth: 820 }}>{meta.oneLiner}</p>
      <pre style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #334155', borderRadius: 8, padding: '12px 16px', overflowX: 'auto', fontSize: 12.5, color: '#a5f3fc' }}>
        {meta.statement}
      </pre>

      <h2>Links</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 820 }}>
        <div style={{ border: '1px solid #38bdf855', background: 'rgba(56,189,248,0.06)', borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 3 }}>Shareable code (unlisted gist — no repo access needed)</div>
          <a href={meta.gist} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontFamily: 'ui-monospace, monospace', fontSize: 13, wordBreak: 'break-all' }}>{meta.gist}</a>
        </div>
        <div style={{ border: '1px solid #33415555', borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 3 }}>In-repo review packet</div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: '#cbd5e1' }}>{meta.repoPath}</div>
        </div>
      </div>

      <h2>What is proved (30 declarations, all sorry-free)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {results.map((r) => (
          <div key={r.name} style={{ border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#10b981' }}>{r.name}</div>
            <div style={{ fontSize: 12.5, color: '#cbd5e1', marginTop: 3 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <h2>What it unlocks (built on the theorem)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {unlocks.map((u) => {
          const proved = u.status === 'proved';
          const col = proved ? '#10b981' : '#f59e0b';
          return (
            <div key={u.name} style={{ border: `1px solid ${col}55`, background: `${proved ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)'}`, borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: col }}>
                {proved ? '✓ ' : '○ '}{u.name}
                <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8, fontWeight: 400 }}>{proved ? 'proved, sorry-free' : 'statement + honest sorry'}</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#cbd5e1', marginTop: 3 }}>{u.desc}</div>
            </div>
          );
        })}
      </div>

      <h2>Significance for mathematics</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
        {significance.map((s) => (
          <div key={s.h} style={{ borderLeft: '3px solid #38bdf8', paddingLeft: 14 }}>
            <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.h}</div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.65 }}>{s.b}</p>
          </div>
        ))}
      </div>

      <h2>Verify it yourself</h2>
      <pre style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #334155', borderRadius: 8, padding: '12px 16px', overflowX: 'auto', fontSize: 12, color: '#cbd5e1', lineHeight: 1.7 }}>
        {verify.join('\n')}
      </pre>

      <h2>Open questions for a maintainer</h2>
      <ul style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.7, maxWidth: 840 }}>
        {openQuestions.map((q) => (
          <li key={q} style={{ marginBottom: 6 }}>{q}</li>
        ))}
      </ul>

      <p style={{ marginTop: 24 }}>
        <Link to="/formalization-status" style={{ color: '#38bdf8' }}>→ Full formalization status</Link>
        <Link to="/obstruction-seam" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Why this isn't RH (the obstruction seam)</Link>
      </p>
    </div>
  );
}
