import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import { RAYMOND_LAMBDA_NOTE as D } from '../data/raymond-lambda-note.js';

/* Public presentation of the note to Dale James Raymond on his de Bruijn–Newman
   bound Λ < 0.149396 (Zenodo 22867547). Content sourced from
   src/data/raymond-lambda-note.js (build tripwires enforce the honesty framing:
   unrefereed preprint, not peer review, does not lower the accepted bound, PT Λ≤0.2
   stands). NOTE: this is NOT Sun's Catalan-irrationality paper — different author,
   different problem; the χ₄ Catalan work is at /catalan-signed-ladder. */

export default function RaymondLambdaNotePage() {
  return (
    <PostLayout
      grade="NOTE TO AUTHOR"
      meta={[D.status]}
      title={D.title}
      dek={D.oneLine}
      byline={['Λ workstream · mathexplorer', D.preprint]}
      ticker={<span>hardens Raymond’s Λ&lt;0.149396 margin ~4× · not peer review · PT Λ≤0.2 stands</span>}
      footer={<>
        Related: <Link to="/lambda-bounds">The Λ ladder</Link>
        {' · '}<Link to="/frontier-dag">Route VII floor (external corroboration)</Link>
        {' · '}<Link to="/catalan-signed-ladder">Catalan (separate: χ₄)</Link><br /><br />
        ← <Link to="/atlas">the atlas</Link>
      </>}
    >
      {D.reviewHold && (
        <div className="ed-thm" style={{ borderLeftColor: '#c23a1c', background: 'rgba(194,58,28,0.05)' }}>
          <div className="tlab" style={{ color: '#c23a1c' }}>Under review — hold</div>
          <p style={{ margin: 0, fontSize: 14 }}>{D.reviewHold}</p>
        </div>
      )}
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">Scope</div>
        <p style={{ margin: 0, fontSize: 14 }}>{D.scope}</p>
      </div>

      <h2>The remark</h2>
      <p className="lead">
        Raymond fixes the ratio ρ = S/B = 1/20 and proves the decisive coefficient
        δ₀ &gt; 0.00966. Re-optimizing ρ alone — with no change to the construction —
        raises it ~4×.
      </p>
      <TheoremBox label="Decisive coefficient as a function of ρ">
        <p className="ed-mono" style={{ fontSize: 15 }}>{D.identity}</p>
        <p style={{ fontSize: 13.5, color: 'var(--faint)' }}>{D.identityNote}</p>
      </TheoremBox>

      <table style={{ width: '100%', maxWidth: 360, fontSize: 14, margin: '1rem 0', borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '1px solid var(--hairline, #d5c9b2)' }}>
          <th style={{ textAlign: 'left', padding: '5px 8px' }}>ρ = S/B</th>
          <th style={{ textAlign: 'left', padding: '5px 8px' }}>δ₀(ρ)</th>
        </tr></thead>
        <tbody>
          {D.table.map((r) => {
            const opt = /optimum/.test(r.rho);
            return (
              <tr key={r.rho} style={{ borderBottom: '1px solid var(--hairline, #ece3d0)', fontWeight: opt ? 700 : 400 }}>
                <td className="ed-mono" style={{ padding: '5px 8px', color: opt ? 'var(--brass)' : 'inherit' }}>{r.rho}</td>
                <td className="ed-mono" style={{ padding: '5px 8px', color: opt ? 'var(--brass)' : 'inherit' }}>{r.d0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>The validation gate</h2>
      <p>{D.gate}</p>

      <h2>Findings</h2>
      <ul style={{ paddingLeft: 20 }}>
        {D.findings.map((f, i) => <li key={i} style={{ marginBottom: 9, lineHeight: 1.55 }}>{f}</li>)}
      </ul>

      <Pull>{D.verdict}</Pull>

      <p style={{ fontSize: 13.5, color: 'var(--faint)' }}>
        Full note (as sent to the author): <code>{D.noteFile}</code>. Scripts and exact-rational
        reconstructions available on request.
      </p>

      <h2>References</h2>
      <ol className="ed-mono" style={{ paddingLeft: 20, fontSize: 13, color: 'var(--ink-soft)' }}>
        {D.references.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
      </ol>
    </PostLayout>
  );
}
