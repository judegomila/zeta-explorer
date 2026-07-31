import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { SUBHALF_STRIP_PCC_CRITERION } from '../data/subhalf-strip-pcc-criterion-2026-07-31.js';

const { lemmaW, reduction, seamMonitorMatch, honestScope } = SUBHALF_STRIP_PCC_CRITERION;

export default function SubHalfStripPccCriterionPage() {
  return (
    <div className="page">
      <h1>Seam-Escape Criterion: the minimal PCC lemma for a sub-½ strip</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 840 }}>
        The exact minimal <em>unconditional</em> input ("Lemma W") that would crack the Λ upper bound, and the
        rigorous reduction <code>uniform-PCC ⇒ sub-½ zero-free strip ⇒ Λ ≤ 2δ²</code>. This is a precise map of
        the wall and a recorded tripwire — <strong>not</strong> a passage through it.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="A map of the wall, not a way through it"
        body={
          'Lemma W is OPEN and RH-adjacent — strictly stronger than the Density Hypothesis, not implied by Lindelöf. ' +
          'The reduction is rigorous GIVEN W (strip⇒Λ is de Bruijn 1950). Nothing here improves Λ≤0.2 (PT) or the ' +
          'unreviewed 0.1787854 candidate; the lemma’s unconditional appearance in the literature is the only event ' +
          'this criterion certifies as a genuine crack. No false QED.'
        }
      />

      <h2>Lemma W — the minimal unconditional input</h2>
      <div style={{ border: '1px solid #f59e0b55', background: 'rgba(245,158,11,0.06)', borderRadius: 8, padding: '12px 16px', maxWidth: 860 }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#fcd34d', marginBottom: 4 }}>{lemmaW.name} · {lemmaW.status}</div>
        <div style={{ color: '#e2e8f0', fontSize: 13.5, lineHeight: 1.65 }}>{lemmaW.statement}</div>
        <div style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.55, marginTop: 8 }}><strong style={{ color: '#cbd5e1' }}>Why it’s hard:</strong> {lemmaW.whyHard}</div>
      </div>

      <h2>The reduction</h2>
      <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#a5f3fc' }}>{reduction.chain}</p>
      <p style={{ fontSize: 12, color: '#64748b' }}>{reduction.kappa}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reduction.steps.map((s) => (
          <div key={s.id} style={{ borderLeft: '3px solid #38bdf8', paddingLeft: 14 }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#38bdf8' }}>{s.id} <span style={{ color: '#64748b', fontSize: 11 }}>· {s.status}</span></div>
            <div style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.55, marginTop: 2 }}>{s.detail}</div>
          </div>
        ))}
      </div>
      <div style={{ border: '1px solid #ef444455', background: 'rgba(239,68,68,0.06)', borderRadius: 8, padding: '10px 14px', marginTop: 12, maxWidth: 860 }}>
        <div style={{ fontSize: 11, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>circularity correction</div>
        <div style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.6 }}>{reduction.circularityCorrection}</div>
      </div>

      <h2>Seam-monitor trigger</h2>
      <div style={{ border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: '12px 16px', maxWidth: 860 }}>
        <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65 }}>{seamMonitorMatch}</div>
      </div>

      <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6, maxWidth: 860, marginTop: 14 }}>{honestScope}</p>

      <p style={{ marginTop: 20 }}>
        <Link to="/frozen-rung-pt-equivalence" style={{ color: '#38bdf8' }}>→ Freezing rungs = PT (operator language)</Link>
        <Link to="/obstruction-seam" style={{ color: '#38bdf8', marginLeft: 16 }}>→ The RH obstruction seam</Link>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8', marginLeft: 16 }}>→ What binds the Λ≤0.2 floor</Link>
      </p>
    </div>
  );
}
