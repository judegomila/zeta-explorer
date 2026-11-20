import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { Pull } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { IRRATIONALITY_PIPELINE as D } from '../data/irrationality-pipeline.js';

/* Editorial presentation of the 6-stage irrationality pipeline. All content is
   sourced from src/data/irrationality-pipeline.js (whose tripwires enforce the
   6-stage shape and the honesty discipline). This file only restyles it. */

export default function IrrationalityPipelinePage() {
  return (
    <PostLayout
      grade="METHOD"
      meta={[D.status]}
      title={D.title}
      dek={D.oneLine}
      byline={['irrationality workstream · explorezeta', 'method, not a theorem']}
      ticker={<span>encode → predict → generate → measure → cancel → test</span>}
      footer={<>
        Related: <Link to="/catalan-signed-ladder">The signed ladder &amp; Catalan</Link>
        {' · '}<Link to="/diagrams">Section geometry</Link>
        {' · '}<Link to="/lambda-timeline">Roadmap</Link><br /><br />
        ← <Link to="/atlas">the atlas</Link>
      </>}
    >
      <div style={{ maxWidth: 360, margin: '0 auto 1.5rem' }}>
        <WireframeAnim kind="dirichlet-ladder" />
      </div>

      <p className="lead">
        The signed-ladder ↔ Catalan work generalizes into a reusable attack template.
        It turns “is this constant irrational?” into six concrete, checkable stages —
        each with a definite output — and ends in a verdict: proven, one-of-a-block,
        or open with the exact net-exponent gap β − α.
      </p>

      <h2>The six stages</h2>
      {D.stages.map((s) => (
        <div key={s.n} style={{ display: 'flex', gap: 16, margin: '1.1rem 0', alignItems: 'flex-start' }}>
          <div className="ed-mono" style={{
            flex: '0 0 auto', width: 34, height: 34, borderRadius: '50%',
            border: '2px solid var(--brass, #8c6a1d)', color: 'var(--brass, #8c6a1d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15,
          }}>{s.n}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '2px 0 4px', fontSize: '1.08rem' }}>{s.name}</h3>
            <p style={{ margin: '0 0 5px', fontSize: '0.95rem', lineHeight: 1.55 }}>{s.what}</p>
            <p className="ed-mono" style={{ margin: '0 0 2px', fontSize: 12.5, color: 'var(--brass, #8c6a1d)' }}>
              output: {s.output}
            </p>
            <p className="ed-mono" style={{ margin: 0, fontSize: 12, color: 'var(--faint, #8a7f6d)' }}>
              e.g. {s.examples}
            </p>
          </div>
        </div>
      ))}

      <Pull>
        Stage 2 is the elegant core: the functional equation alone — conductor,
        parity, Gauss sum, Tate twist — predicts the parasitic periods before a single
        integral is computed.
      </Pull>

      <h2>What the pipeline outputs, per target</h2>
      <table style={{ width: '100%', fontSize: 14, margin: '1rem 0', borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '1px solid var(--hairline, #d5c9b2)' }}>
          <th style={{ textAlign: 'left', padding: '6px 8px' }}>target</th>
          <th style={{ textAlign: 'left', padding: '6px 8px' }}>encoding (χ, k)</th>
          <th style={{ textAlign: 'left', padding: '6px 8px' }}>pred. dim</th>
          <th style={{ textAlign: 'left', padding: '6px 8px' }}>verdict</th>
        </tr></thead>
        <tbody>
          {D.targets.map((t) => (
            <tr key={t.target} style={{ borderBottom: '1px solid var(--hairline, #ece3d0)' }}>
              <td className="ed-mono" style={{ padding: '6px 8px' }}>{t.target}</td>
              <td className="ed-mono" style={{ padding: '6px 8px', fontSize: 12.5 }}>{t.enc}</td>
              <td className="ed-mono" style={{ padding: '6px 8px' }}>{t.predDim}</td>
              <td style={{ padding: '6px 8px', color: /PROVEN|closed/.test(t.verdict) ? 'var(--series-3)' : 'var(--brass)' }}>{t.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{D.sunCase.heading}</h2>
      <p>{D.sunCase.body}</p>
      <p className="ed-mono" style={{ fontSize: 12.5, color: 'var(--brass, #8c6a1d)' }}>
        status: {D.sunCase.status}
      </p>

      <h2>{D.openaiCase.heading}</h2>
      <p>{D.openaiCase.body}</p>
      <p className="ed-mono" style={{ fontSize: 12.5, color: 'var(--brass, #8c6a1d)' }}>
        status: {D.openaiCase.status}
      </p>

      <p style={{ fontSize: 13.5, color: 'var(--faint)', borderTop: '1px solid var(--hairline)', paddingTop: 10 }}>
        {D.caveat}
      </p>

      <h2>References</h2>
      <ol className="ed-mono" style={{ paddingLeft: 20, fontSize: 13, color: 'var(--ink-soft)' }}>
        {D.references.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
      </ol>
    </PostLayout>
  );
}
