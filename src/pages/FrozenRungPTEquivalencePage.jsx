import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { FROZEN_RUNG_PT_EQUIVALENCE } from '../data/frozen-rung-pt-equivalence-2026-07-31.js';

const { setup, proposition, whyItMatters, paperPdf } = FROZEN_RUNG_PT_EQUIVALENCE;

function Part({ tag, color, status, children }) {
  return (
    <div style={{ border: `1px solid ${color}55`, background: `${color}0e`, borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {tag} · {status}
      </div>
      <div style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.65, marginTop: 6 }}>{children}</div>
    </div>
  );
}

export default function FrozenRungPTEquivalencePage() {
  return (
    <div className="page">
      <h1>Freezing the Rungs = Platt–Trudgian in Operator Language</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        A proposition from the twin-ladder freeze investigation (2026-07-31): the Platt–Trudgian
        verified-height Λ bound <em>is</em> the winding-form frozen-rung index certificate of the
        kernel bridge — and by inertia-preservation it can never beat it.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="A reformulation, not a new bound — and not RH"
        body={
          'The "can never beat verified height" (inertia) half is a THEOREM. The full equivalence is ' +
          'CONJECTURAL, gated on two named lemmas (L1 plausible, L2 open). It yields NO Λ improvement — ' +
          'it reproduces exactly Λ ≤ 0.1787854 / 0.2. Platt–Trudgian Λ ≤ 0.2 remains the accepted SOTA. No QED.'
        }
      />

      {paperPdf && (
        <div style={{ border: '1px solid #a855f755', background: 'rgba(168,85,247,0.06)', borderRadius: 8, padding: '10px 14px', margin: '14px 0', maxWidth: 640 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 3 }}>Full rigorous write-up (13pp, math paper)</div>
          <a href={paperPdf} target="_blank" rel="noreferrer" style={{ color: '#c084fc', fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>{paperPdf}</a>
          <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>
            Proves the inertia half + winding-form identity rigorously; L1 conditional (gap named); L2 left OPEN with a
            7-attack adversarial self-check. No new bound, not RH.
          </div>
        </div>
      )}

      <h2>Setup</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 860 }}>
        {Object.entries(setup).map(([k, v]) => (
          <div key={k} style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.55 }}>
            <span style={{ color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>{k}: </span>{v}
          </div>
        ))}
      </div>

      <h2>The proposition</h2>
      <Part tag="A · inertia half" color="#10b981" status={proposition.provenInertiaHalf.status}>
        {proposition.provenInertiaHalf.statement}
        <div style={{ color: '#64748b', fontSize: 11.5, marginTop: 5 }}>cites: {proposition.provenInertiaHalf.cites.join(' · ')}</div>
      </Part>
      <Part tag="B · winding-form identity" color="#38bdf8" status={proposition.windingFormIdentity.status}>
        {proposition.windingFormIdentity.statement}
      </Part>
      <Part tag="C · equivalence" color="#f59e0b" status={proposition.conditionalEquivalence.status}>
        {proposition.conditionalEquivalence.statement}
        <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: '2px solid #f59e0b55' }}>
          <div style={{ marginBottom: 6 }}><strong style={{ color: '#fcd34d' }}>{proposition.conditionalEquivalence.L1.name}</strong> — {proposition.conditionalEquivalence.L1.claim} <em style={{ color: '#86efac' }}>[{proposition.conditionalEquivalence.L1.status}]</em></div>
          <div><strong style={{ color: '#fcd34d' }}>{proposition.conditionalEquivalence.L2.name}</strong> — {proposition.conditionalEquivalence.L2.claim} <em style={{ color: '#fca5a5' }}>[{proposition.conditionalEquivalence.L2.status}]</em></div>
        </div>
      </Part>
      <Part tag="D · consequence" color="#a855f7" status={proposition.consequence.status}>
        {proposition.consequence.statement}
        <div style={{ color: '#94a3b8', fontSize: 12.5, marginTop: 6 }}>{proposition.consequence.ptRemainsSOTA}</div>
      </Part>

      <h2>Why record a non-improving result</h2>
      <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.7, maxWidth: 860 }}>{whyItMatters}</p>

      <p style={{ marginTop: 24 }}>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8' }}>→ What binds the Λ≤0.2 floor</Link>
        <Link to="/obstruction-seam" style={{ color: '#38bdf8', marginLeft: 16 }}>→ The RH obstruction seam</Link>
        <Link to="/freezing-bridge" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Freezing Bridge (§23)</Link>
      </p>
    </div>
  );
}
