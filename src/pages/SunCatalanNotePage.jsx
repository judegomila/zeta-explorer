import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import { SUN_CATALAN_NOTE as D } from '../data/sun-catalan-note.js';

/* Public presentation of the note to Zhi-Wei Sun. Content sourced from
   src/data/sun-catalan-note.js (build tripwires enforce the honesty framing:
   unrefereed preprint, does not certify the proof, G irrationality open). */

export default function SunCatalanNotePage() {
  return (
    <PostLayout
      grade="NOTE TO AUTHOR"
      meta={[D.status]}
      title={D.title}
      dek={D.oneLine}
      byline={['irrationality workstream · mathexplorer', D.preprint]}
      ticker={<span>hardens Sun’s margin ~4× · does not certify the proof · G open</span>}
      footer={<>
        Related: <Link to="/catalan-signed-ladder">The signed ladder &amp; Catalan</Link>
        {' · '}<Link to="/irrationality-pipeline">The irrationality pipeline</Link><br /><br />
        ← <Link to="/atlas">the atlas</Link>
      </>}
    >
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">Scope</div>
        <p style={{ margin: 0, fontSize: 14 }}>{D.scope}</p>
      </div>

      <h2>The remark</h2>
      <p className="lead">
        Sun fixes the ratio ρ = S/B = 1/20 and proves the decisive coefficient
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
