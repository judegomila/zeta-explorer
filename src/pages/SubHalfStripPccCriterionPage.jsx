import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { SUBHALF_STRIP_PCC_CRITERION } from '../data/subhalf-strip-pcc-criterion-2026-07-31.js';

const { lemmaW, reduction, seamMonitorMatch, honestScope } = SUBHALF_STRIP_PCC_CRITERION;

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

export default function SubHalfStripPccCriterionPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz · sub-½ strip PCC criterion</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>
            Seam-Escape Criterion: the minimal PCC lemma for a sub-½ strip
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 840 }}>
            The exact minimal <em>unconditional</em> input ("Lemma W") that would crack the Λ upper bound, and the
            rigorous reduction <code>uniform-PCC ⇒ sub-½ zero-free strip ⇒ Λ ≤ 2δ²</code>. This is a precise map of
            the wall and a recorded tripwire — <strong>not</strong> a passage through it.
          </p>
        </div>

        <HonestCeilingBanner
          variant="ESTIMATE"
          title="A map of the wall, not a way through it"
          body={
            'Lemma W is OPEN and RH-adjacent — strictly stronger than the Density Hypothesis, not implied by Lindelöf. ' +
            'The reduction is rigorous GIVEN W (strip⇒Λ is de Bruijn 1950). Nothing here improves Λ≤0.2 (PT) or the ' +
            '0.1787854 candidate; the lemma’s unconditional appearance in the literature is the only event ' +
            'this criterion certifies as a genuine crack. No false QED.'
          }
        />

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Lemma W — the minimal unconditional input</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), maxWidth: 860 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--brass-dk)', marginBottom: 4 }}>
            {lemmaW.name} · {lemmaW.status}
          </div>
          <div style={{ color: 'var(--ink)', fontSize: 13.5, lineHeight: 1.65 }}>{lemmaW.statement}</div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.55, marginTop: 8 }}>
            <strong style={{ color: 'var(--ink)' }}>Why it’s hard:</strong> {lemmaW.whyHard}
          </div>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>The reduction</h2>
        <p style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13, color: 'var(--blue)' }}>{reduction.chain}</p>
        <p style={{ fontSize: 12, color: 'var(--faint)' }}>{reduction.kappa}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {reduction.steps.map((s) => (
            <div key={s.id} style={{ borderLeft: '3px solid var(--blue)', paddingLeft: 14 }}>
              <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13, color: 'var(--blue)' }}>
                {s.id} <span style={{ color: 'var(--faint)', fontSize: 11 }}>· {s.status}</span>
              </div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.55, marginTop: 2 }}>{s.detail}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginTop: 12, maxWidth: 860 }}>
          <div style={cardLabel}>circularity correction</div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.6 }}>{reduction.circularityCorrection}</div>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Seam-monitor trigger</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), maxWidth: 860 }}>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.65 }}>{seamMonitorMatch}</div>
        </div>

        <p style={{ color: 'var(--faint)', fontSize: 12, lineHeight: 1.6, maxWidth: 860, marginTop: 14 }}>{honestScope}</p>

        {/* ── Cross links ─────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link
              to="/frozen-rung-pt-equivalence"
              style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}
            >
              → Freezing rungs = PT (operator language)
            </Link>
            <Link
              to="/obstruction-seam"
              style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}
            >
              → The RH obstruction seam
            </Link>
            <Link
              to="/pt-floor-audit"
              style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}
            >
              → What binds the Λ≤0.2 floor
            </Link>
            <Link
              to="/"
              style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}
            >
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
