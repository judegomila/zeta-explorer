import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import { FLOW_BLINDNESS_NO_GO as D } from '../data/flow-blindness-no-go.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

/* Editorial (post reading-view) presentation of the flow-blindness no-go.
   All text is sourced verbatim from src/data/flow-blindness-no-go.js — this file
   only restyles it; it makes no mathematical claim of its own. */

export default function FlowBlindnessNoGoPage() {
  return (
    <PostLayout
      grade="NO-GO"
      meta={[D.status]}
      title={D.title}
      dek={D.oneLine}
      byline={['SL2 · mathexplorer', 'unconditional']}
      ticker={<span>no-go · rests on Rodgers–Tao Λ ≥ 0</span>}
      footer={<>
        <a href={D.paperSource} target="_blank" rel="noreferrer">Corrected note (source)</a>
        {' · '}<a href={D.paperPdf} target="_blank" rel="noreferrer">Historical PDF (superseded)</a>
        {' · '}Related: <Link to="/frozen-rung-pt-equivalence">Freezing rungs = Platt–Trudgian</Link>
        {' · '}<Link to="/route-map">The wall map</Link><br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <h2>{D.dictionary.heading}</h2>
      <p className="lead">The shifted-profile positivity program is one RH direction. The flow argument limits it only when the hypotheses also hold for the negative-time deformations.</p>
      <AnimationEmbed id="flow-blindness" />
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">Dictionary identity (†)</div>
        <p className="ed-mono" style={{ fontSize: 15 }}>{D.dictionary.identity}</p>
      </div>
      <p><strong>Verified.</strong> {D.dictionary.verified}</p>
      <p>{D.dictionary.consequence}</p>
      <p style={{ fontSize: 15, color: 'var(--faint)' }}>{D.dictionary.factorTwo}</p>

      <h2>{D.theorem.heading}</h2>
      <TheoremBox label="Theorem (flow-blindness)">
        <p>{D.theorem.statement}</p>
      </TheoremBox>
      <p><strong>Corollary.</strong> {D.theorem.corollary}</p>
      <p><strong>What a proof must add.</strong> {D.theorem.mustAdd}</p>

      <Pull>{D.ties[1]}</Pull>

      <h2>Where it sits</h2>
      <ul style={{ paddingLeft: 20 }}>
        {D.ties.map((t, i) => <li key={i} style={{ marginBottom: 10 }}>{t}</li>)}
      </ul>

      <h2>Scope</h2>
      <p>{D.scope}</p>

      <h2>References</h2>
      <ol className="ed-mono" style={{ paddingLeft: 20, fontSize: 13, color: 'var(--ink-soft)' }}>
        {D.references.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
      </ol>
    </PostLayout>
  );
}
