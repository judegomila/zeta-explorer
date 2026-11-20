import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { CATALAN_SIGNED_LADDER as D } from '../data/catalan-signed-ladder.js';
import { ED } from '../styles/tokens.js';

/* Editorial presentation of the signed-ladder ↔ Catalan correspondence and the
   period-dimension obstruction. All mathematical content is sourced from
   src/data/catalan-signed-ladder.js (whose build tripwires re-verify the exact
   closed forms). This file only restyles it and makes no claim of its own. */

function DimTag({ n }) {
  const bad = String(n).startsWith('5') || String(n).startsWith('≥5') || n === '—';
  return (
    <span className="ed-mono" style={{
      fontSize: 11, fontWeight: 700, padding: '0 6px', borderRadius: 4,
      color: bad ? 'var(--accent)' : 'var(--series-3)',
      border: `1px solid ${bad ? ED.series2 : ED.series3}`,
    }}>dim {n}</span>
  );
}

export default function CatalanSignedLadderPage() {
  return (
    <PostLayout
      grade="VERIFIED CORRESPONDENCE · OBSTRUCTION"
      meta={[D.status]}
      title={D.title}
      dek={D.oneLine}
      byline={['signed twin ladder · explorezeta', 'G irrationality: open in refereed literature; external Lean-formalized claim (not peer-reviewed)']}
      ticker={<span>χ₄ = the signed flip · G = β(2) = L(2,χ₄) · irrationality OPEN in refereed literature · openai/math 005 claim, not peer-reviewed</span>}
      footer={<>
        Related: <Link to="/irrationality-pipeline">The irrationality pipeline</Link>
        {' · '}<Link to="/flow-blindness-no-go">Flow-blindness no-go</Link>
        {' · '}<Link to="/permutation-architecture">The freeze calculus &amp; the weld</Link>
        {' · '}<Link to="/diagrams">Section geometry</Link><br /><br />
        ← <Link to="/atlas">the atlas</Link>
      </>}
    >
      <div style={{ maxWidth: 360, margin: '0 auto 1.5rem' }}>
        <WireframeAnim kind="dirichlet-ladder" />
      </div>

      <h2>{D.correspondence.heading}</h2>
      <p className="lead">
        Catalan’s constant is not a new object here — it is the value of the twin
        ladder’s <em>signed</em> sibling. Twist every rung by the odd character
        χ₄ (the repo’s “sign flip at p=2”) and the ladder’s value at s=2 is G.
      </p>
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">Signed series</div>
        <p className="ed-mono" style={{ fontSize: 15 }}>{D.correspondence.signedSeries}</p>
        <div className="tlab" style={{ marginTop: 10 }}>Signed Euler product</div>
        <p className="ed-mono" style={{ fontSize: 15 }}>{D.correspondence.signedEuler}</p>
      </div>
      <p><strong>The mirror survives.</strong> {D.correspondence.mirror}</p>
      <p><strong>The parity mirror flips.</strong> {D.correspondence.parity}</p>

      <h2>{D.contrast.heading}</h2>
      <p>{D.contrast.device}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' }}>
        <div className="ed-thm" style={{ borderLeftColor: 'var(--series-3)' }}>
          <div className="tlab">ζ-world kernel — <DimTag n={D.contrast.zeta2.dim} /></div>
          <p className="ed-mono" style={{ fontSize: 14 }}>{D.contrast.zeta2.kernel}</p>
          <p className="ed-mono" style={{ fontSize: 15, fontWeight: 700 }}>{D.contrast.zeta2.value}</p>
          <p style={{ fontSize: 13, color: 'var(--faint)' }}>{D.contrast.zeta2.derivation}</p>
          <p style={{ fontSize: 13.5 }}>period space {D.contrast.zeta2.space} · {D.contrast.zeta2.verdict}</p>
        </div>
        <div className="ed-thm" style={{ borderLeftColor: 'var(--accent)' }}>
          <div className="tlab">signed kernel — <DimTag n={D.contrast.catalan.dim} /></div>
          <p className="ed-mono" style={{ fontSize: 14 }}>{D.contrast.catalan.kernel}</p>
          <p className="ed-mono" style={{ fontSize: 15, fontWeight: 700 }}>{D.contrast.catalan.value}</p>
          <p style={{ fontSize: 13, color: 'var(--faint)' }}>{D.contrast.catalan.derivation}</p>
          <p style={{ fontSize: 13.5 }}>period space {D.contrast.catalan.space} · {D.contrast.catalan.verdict}</p>
        </div>
      </div>
      <Pull>
        The same device isolates ζ(2)/ζ(3) into two dimensions and buries G in five.
        The three extra periods are forced by the χ₄ functional equation — that is the
        whole obstruction.
      </Pull>

      <h2>{D.target.heading}</h2>
      <TheoremBox label="The net-exponent test">
        <p>{D.target.form}</p>
        <p>{D.target.netTest}</p>
        <p className="ed-mono" style={{ fontSize: 13.5 }}>{D.target.apery}</p>
        <p className="ed-mono" style={{ fontSize: 13.5 }}>{D.target.catalan}</p>
      </TheoremBox>
      <p><strong>The frontier.</strong> {D.target.frontier}</p>

      <h2>{D.piColumn.heading}</h2>
      <p>{D.piColumn.intro}</p>
      <div style={{ margin: '1rem 0' }}>
        {D.piColumn.mechanisms.map((m) => (
          <div key={m.name} style={{ borderLeft: '3px solid var(--hairline)', paddingLeft: 12, marginBottom: 12 }}>
            <div className="ed-mono" style={{ fontWeight: 700, fontSize: 13.5 }}>{m.name}</div>
            <div style={{ fontSize: 13.5, color: 'var(--series-3)' }}>gets: {m.gets}</div>
            <div style={{ fontSize: 13.5, color: 'var(--accent)' }}>stalls: {m.stall}</div>
          </div>
        ))}
      </div>
      <Pull>{D.piColumn.upshot}</Pull>

      <h2>{D.triage.heading}</h2>
      <p>{D.triage.principle}</p>
      <table className="ed-table" style={{ width: '100%', fontSize: 14, margin: '1rem 0' }}>
        <thead><tr>
          <th style={{ textAlign: 'left' }}>target</th>
          <th style={{ textAlign: 'left' }}>period dim</th>
          <th style={{ textAlign: 'left' }}>status</th>
        </tr></thead>
        <tbody>
          {D.triage.rows.map((r) => (
            <tr key={r.target}>
              <td className="ed-mono">{r.target}</td>
              <td><DimTag n={r.dim} /></td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{D.verdict.heading}</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li style={{ marginBottom: 8 }}><strong>Correspondence.</strong> {D.verdict.correspondence}</li>
        <li style={{ marginBottom: 8 }}><strong>Obstruction.</strong> {D.verdict.obstruction}</li>
        <li style={{ marginBottom: 8 }}><strong>Lever.</strong> {D.verdict.lever}</li>
        <li style={{ marginBottom: 8 }}><strong>Open.</strong> {D.verdict.open}</li>
        <li style={{ marginBottom: 8 }}><strong>External claim.</strong> {D.verdict.externalClaim}</li>
      </ul>
      <p style={{ fontSize: 13.5, color: 'var(--faint)', borderTop: '1px solid var(--hairline)', paddingTop: 10 }}>
        {D.verdict.caveat}
      </p>
      <p style={{ fontSize: 13.5, color: 'var(--faint)', paddingTop: 4 }}>
        {D.verdict.secondAnchorCaveat}
      </p>

      <h2>References</h2>
      <ol className="ed-mono" style={{ paddingLeft: 20, fontSize: 13, color: 'var(--ink-soft)' }}>
        {D.references.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
      </ol>
    </PostLayout>
  );
}
