import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { FORMALIZATION_REVIEW } from '../data/formalization-review-2026-07-20.js';
import { ED, alpha } from '../styles/tokens.js';

const { meta, results, unlocks, significance, verify, openQuestions } = FORMALIZATION_REVIEW;

export default function FormalizationReviewPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>Formalization — Pre-Submission Review Dashboard</h1>
        <div
          style={{
            margin: '0 0 12px',
            padding: '8px 12px',
            border: '1px solid var(--brass-dk)',
            borderRadius: 6,
            maxWidth: 820,
            fontSize: 13,
            lineHeight: 1.55,
            color: 'var(--brass-dk)',
            fontFamily: 'var(--ed-mono)',
          }}
        >
          REVIEW SNAPSHOT 2026-07-20 — this dashboard's data is frozen at that date. The
          formalization effort has since grown (20+ Lean projects; the theorem behind the O1 obligation is Lean-checked with its gates as hypotheses; further Lean files were added in November 2026).
          Live status: <Link to="/formalization-status" style={{ color: 'var(--brass-dk)' }}>/formalization-status</Link>
          {' · '}the formalization thread on <Link to="/threads" style={{ color: 'var(--brass-dk)' }}>/threads</Link>.
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
          A shareable review page for the machine-checked <strong>backward-heat real-rootedness
          theorem</strong> (Hermite–Poulain; the polynomial mechanism behind de Bruijn 1950), packaged
          for external review before any mathlib submission. The result, why
          it matters, how to verify it independently, and the open questions for a maintainer.
        </p>

        <HonestCeilingBanner
          variant="ESTIMATE"
          title="A classical theorem, machine-checked — NOT the Riemann Hypothesis"
          body={
            'Every result here is classical (Hermite–Poulain; de Bruijn 1950). This is verified, reusable ' +
            'foundational infrastructure that fills a mathlib gap — it is NOT new mathematics and NOT progress ' +
            'on RH or on Λ ≥ 0. No QED.'
          }
        />

        <h2>The result</h2>
        <p style={{ color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.7, maxWidth: 820 }}>{meta.oneLiner}</p>
        <pre className="card" style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '12px 16px', overflowX: 'auto', fontSize: 12.5, color: 'var(--blue)', fontFamily: 'var(--ed-mono)' }}>
          {meta.statement}
        </pre>

        <h2>Links</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 820 }}>
          <div className="card" style={{ border: '1px solid var(--blue)', background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 3 }}>Shareable code (unlisted gist — no repo access needed)</div>
            <a href={meta.gist} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', fontFamily: 'var(--ed-mono)', fontSize: 13, wordBreak: 'break-all' }}>{meta.gist}</a>
          </div>
          {meta.paperPdf && (
            <div className="card" style={{ border: '1px solid var(--brass-dk)', background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 3 }}>Formalization note (PDF)</div>
              <a href={meta.paperPdf} target="_blank" rel="noreferrer" style={{ color: 'var(--brass-dk)', fontFamily: 'var(--ed-mono)', fontSize: 13 }}>{meta.paperPdf}</a>
            </div>
          )}
          <div className="card" style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 3 }}>In-repo review packet</div>
            <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 12.5, color: 'var(--ink-soft)' }}>{meta.repoPath}</div>
          </div>
        </div>

        <h2>What is proved (30 declarations, all sorry-free)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r) => (
            <div key={r.name} className="card" style={{ border: '1px solid var(--green)', background: 'color-mix(in srgb, var(--series-3) 6%, transparent)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 13, color: 'var(--green)' }}>{r.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <h2>What it unlocks (built on the theorem)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {unlocks.map((u) => {
            const proved = u.status === 'proved';
            const col = proved ? 'var(--green)' : 'var(--brass-dk)';
            const bg = proved ? alpha(ED.series3, 0.06) : alpha(ED.brassDeco, 0.06);
            return (
              <div key={u.name} className="card" style={{ border: `1px solid ${col}`, background: bg, borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: col }}>
                  {proved ? '✓ ' : '○ '}{u.name}
                  <span style={{ fontSize: 11, color: 'var(--faint)', marginLeft: 8, fontWeight: 400 }}>{proved ? 'proved, sorry-free' : 'statement + sorry'}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{u.desc}</div>
              </div>
            );
          })}
        </div>

        <h2>Significance for mathematics</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
          {significance.map((s) => (
            <div key={s.h} style={{ borderLeft: '3px solid var(--blue)', paddingLeft: 14 }}>
              <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.h}</div>
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.65 }}>{s.b}</p>
            </div>
          ))}
        </div>

        <h2>Verify it yourself</h2>
        <pre className="card" style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '12px 16px', overflowX: 'auto', fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono)', lineHeight: 1.7 }}>
          {verify.join('\n')}
        </pre>

        <h2>Open questions for a maintainer</h2>
        <ul style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.7, maxWidth: 840 }}>
          {openQuestions.map((q) => (
            <li key={q} style={{ marginBottom: 6 }}>{q}</li>
          ))}
        </ul>

        <div className="card" style={{
          marginTop: 28, borderRadius: 8, border: '1px solid var(--hairline)',
          borderLeft: '3px solid var(--brass)', background: 'var(--paper2)',
          padding: '16px 18px',
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{
            display: 'flex', gap: 16, flexWrap: 'wrap',
            fontSize: 12, fontFamily: 'var(--ed-mono)',
          }}>
            <Link to="/formalization-status" style={{ color: 'var(--brass)', textDecoration: 'none' }}>Full formalization status</Link>
            <Link to="/obstruction-seam" style={{ color: 'var(--brass)', textDecoration: 'none' }}>Why this isn't RH (the obstruction seam)</Link>
            <Link to="/" style={{ color: 'var(--faint)', textDecoration: 'none', marginLeft: 'auto' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
