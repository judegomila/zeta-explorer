import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { ZERO_DENSITY_SCOPING } from '../data/zero-density-lambda-inert-2026-07-09.js';

const { meta, levers, topRecommendation } = ZERO_DENSITY_SCOPING;

const feedColor = (f) => f.startsWith('DIRECTLY') ? 'var(--green)' : f.startsWith('VIA') ? 'var(--brass-dk)' : 'var(--terra-dk)';

export default function ZeroDensityScopingPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1">Can Zero-Density Estimates Move Λ? — No (Λ-Inert)</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
          A 7-lens, web-grounded, independently-verified scoping of whether zero-density / large-values
          estimates (Guth–Maynard, Halász–Montgomery, moments) can tighten the <em>rigorous</em> Λ ≤ 0.2
          bound. Verdict: <strong style={{ color: 'var(--terra-dk)' }}>no</strong> — genuine RH-adjacent progress,
          but Λ-inert.
        </p>

        <HonestCeilingBanner
          variant="ESTIMATE"
          title="Density is Λ-inert — this corrects a natural intuition (and a prior in-project recommendation)"
          body={
            'The barrier is gated by the verified height X (a computation certifying N=0 off-line up to X). ' +
            'A density estimate is a POSITIVE upper bound on off-line zeros — it can never certify N=0, so it ' +
            'cannot replace or reduce X. Even the full Density Hypothesis moves rigorous Λ by exactly zero. ' +
            'No refereed bound is changed. NO QED.'
          }
        />

        <div className="card" style={{ border: '1px solid var(--hairline)', borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: 10, padding: '14px 18px', margin: '16px 0', maxWidth: 840 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--terra-dk)', marginBottom: 6 }}>VERDICT: {meta.verdict}</div>
          <p style={{ margin: 0, color: 'var(--ink)', fontSize: 14, lineHeight: 1.7 }}>{meta.bottomLine}</p>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>The candidate approaches, classified</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {levers.map((l) => (
            <div key={l.title} className="card" style={{ border: `1px solid ${feedColor(l.feedsLambda)}`, background: 'var(--paper2)', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <strong style={{ color: 'var(--ink)', fontSize: 13.5 }}>{l.title}</strong>
                <span style={{ fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: feedColor(l.feedsLambda), background: 'var(--paper3)' }}>
                  {l.feedsLambda}
                </span>
                <span style={{ fontSize: 11, color: 'var(--faint)' }}>promise {l.promise}/5</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{l.pitch}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}><strong style={{ color: 'var(--brass-dk)' }}>Caveat:</strong> {l.caveat}</p>
            </div>
          ))}
        </div>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Recommendation</h2>
        <p style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.7, maxWidth: 840 }}>{topRecommendation}</p>

        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Source corrections (web-verified)</h2>
        <ul style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
          {meta.sourceCorrections.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
        </ul>

        <p style={{ marginTop: 24 }}>
          <Link to="/verified-height-lever" style={{ color: 'var(--brass-dk)' }}>→ The Verified-Height Lever (the only Λ mover)</Link>
          <Link to="/pt-floor-audit" style={{ color: 'var(--brass-dk)', marginLeft: 16 }}>→ What Binds the Λ≤0.2 Floor?</Link>
        </p>

        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-soft)', borderTop: '1px solid var(--hairline)', paddingTop: 20 }}>
          <p style={{ margin: '12px 0 0 0' }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
