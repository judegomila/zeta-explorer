import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import { FROZEN_RUNG_PT_EQUIVALENCE } from '../data/frozen-rung-pt-equivalence-2026-07-31.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

/* Editorial (post reading-view) presentation of the frozen-rung ⟺ Platt–Trudgian
   proposition. All mathematical text is sourced verbatim from
   src/data/frozen-rung-pt-equivalence-2026-07-31.js (and the clarity banner strings
   preserved from the prior page); this file only restyles it. */

const { setup, proposition, whyItMatters, paperPdf } = FROZEN_RUNG_PT_EQUIVALENCE;

function Part({ tag, status, accent, children }) {
  return (
    <div className="ed-thm" style={{ borderLeftColor: accent }}>
      <div className="tlab" style={{ color: accent }}>{tag} · {status}</div>
      <div style={{ fontSize: 15, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

export default function FrozenRungPTEquivalencePage() {
  return (
    <PostLayout
      grade="THEOREM"
      meta={['operator-language reformulation', '2026-07-31']}
      title="Freezing the Rungs = Platt–Trudgian in Operator Language"
      dek="A proposition from the twin-ladder freeze investigation (2026-07-31): the Platt–Trudgian verified-height Λ bound is the winding-form frozen-rung index certificate of the kernel bridge — and by inertia-preservation it can never beat it."
      byline={['twin-ladder freeze · explorezeta', 'inertia half unconditional']}
      ticker={<span>reformulation · not a new bound · not RH</span>}
      footer={<>
        <a href={paperPdf} target="_blank" rel="noreferrer">Full rigorous write-up (13pp, PDF)</a>
        {' · '}Related: <Link to="/pt-floor-audit">What binds the Λ≤0.2 floor</Link>
        {' · '}<Link to="/obstruction-seam">The RH obstruction seam</Link>
        {' · '}<Link to="/freezing-bridge">Freezing Bridge (§23)</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">A reformulation, not a new bound — and not RH</div>
        <p style={{ fontSize: 15 }}>
          The &ldquo;can never beat verified height&rdquo; (inertia) half is a THEOREM. The full
          equivalence is CONJECTURAL, gated on two named lemmas (L1 plausible, L2 open). It yields
          NO Λ improvement — it reproduces exactly Λ ≤ 0.1787854 / 0.2. Platt–Trudgian Λ ≤ 0.2
          remains the accepted SOTA. No QED.
        </p>
      <AnimationEmbed id="frozen-rung-pt" />

      </div>

      {paperPdf && (
        <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
          <strong>Full rigorous write-up (13pp, math paper).</strong>{' '}
          <a href={paperPdf} target="_blank" rel="noreferrer" className="ed-mono">{paperPdf}</a>
          {' — '}Proves the inertia half + winding-form identity rigorously; L1 conditional (gap
          named); L2 left OPEN with a 7-probe skeptical self-check. No new bound, not RH.
        </p>
      )}

      <h2>Setup</h2>
      <p className="lead">The twin-ladder objects the proposition is stated over.</p>
      <dl className="ed-mono" style={{ fontSize: 14, lineHeight: 1.6 }}>
        {Object.entries(setup).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 10 }}>
            <dt style={{ color: 'var(--faint)' }}>{k}</dt>
            <dd style={{ margin: '2px 0 0', color: 'var(--ink-soft)' }}>{v}</dd>
          </div>
        ))}
      </dl>

      <h2>The proposition</h2>

      <Part tag="A · inertia half" status={proposition.provenInertiaHalf.status} accent={ED.brass}>
        {proposition.provenInertiaHalf.statement}
        <div style={{ fontSize: 13, color: 'var(--faint)', marginTop: 6 }}>
          cites: {proposition.provenInertiaHalf.cites.join(' · ')}
        </div>
      </Part>

      <Part tag="B · winding-form identity" status={proposition.windingFormIdentity.status} accent={ED.inkSoft}>
        {proposition.windingFormIdentity.statement}
      </Part>

      <Part tag="C · equivalence" status={proposition.conditionalEquivalence.status} accent="var(--terra, var(--brass))">
        {proposition.conditionalEquivalence.statement}
        <div style={{ marginTop: 10, paddingLeft: 12, borderLeft: '2px solid var(--faint)' }}>
          <div style={{ marginBottom: 8 }}>
            <strong>{proposition.conditionalEquivalence.L1.name}</strong> — {proposition.conditionalEquivalence.L1.claim}{' '}
            <em style={{ color: 'var(--faint)' }}>[{proposition.conditionalEquivalence.L1.status}]</em>
          </div>
          <div>
            <strong>{proposition.conditionalEquivalence.L2.name}</strong> — {proposition.conditionalEquivalence.L2.claim}{' '}
            <em style={{ color: 'var(--faint)' }}>[{proposition.conditionalEquivalence.L2.status}]</em>
          </div>
        </div>
      </Part>

      <Part tag="D · consequence" status={proposition.consequence.status} accent={ED.brass}>
        {proposition.consequence.statement}
        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 8 }}>
          {proposition.consequence.ptRemainsSOTA}
        </div>
      </Part>

      <Pull>the Turing method is the efficient (winding-form) special case of the frozen-rung index certificate</Pull>

      <h2>Why record a non-improving result</h2>
      <p>{whyItMatters}</p>
    </PostLayout>
  );
}
