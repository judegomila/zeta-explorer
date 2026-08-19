import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { ZERO_DENSITY_SCOPING } from '../data/zero-density-lambda-inert-2026-07-09.js';

const { meta, levers, topRecommendation } = ZERO_DENSITY_SCOPING;

const feedColor = (f) => f.startsWith('DIRECTLY') ? '#10b981' : f.startsWith('VIA') ? '#f59e0b' : '#f87171';

export default function ZeroDensityScopingPage() {
  return (
    <div className="page">
      <h1>Can Zero-Density Estimates Move Λ? — No (Λ-Inert)</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        A 7-lens, web-grounded, adversarially-verified scoping of whether zero-density / large-values
        estimates (Guth–Maynard, Halász–Montgomery, moments) can tighten the <em>rigorous</em> Λ ≤ 0.2
        bound. Verdict: <strong style={{ color: '#f87171' }}>no</strong> — genuine RH-adjacent progress,
        but Λ-inert.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="Density is Λ-inert — this corrects a natural intuition (and a prior in-project recommendation)"
        body={
          'The barrier is gated by the verified height X (a computation certifying N=0 off-line up to X). ' +
          'A density estimate is a POSITIVE upper bound on off-line zeros — it can never certify N=0, so it ' +
          'cannot replace or reduce X. Even the full Density Hypothesis moves rigorous Λ by exactly zero. ' +
          'Platt–Trudgian Λ ≤ 0.2 stays SOTA. NO QED.'
        }
      />

      <div style={{ border: '1px solid #f8717155', background: 'rgba(248,113,113,0.06)', borderRadius: 10, padding: '14px 18px', margin: '16px 0', maxWidth: 840 }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#f87171', marginBottom: 6 }}>VERDICT: {meta.verdict}</div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{meta.bottomLine}</p>
      </div>

      <h2>The levers, classified</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {levers.map((l) => (
          <div key={l.title} style={{ border: `1px solid ${feedColor(l.feedsLambda)}55`, background: 'rgba(15,23,42,0.5)', borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <strong style={{ color: '#e2e8f0', fontSize: 13.5 }}>{l.title}</strong>
              <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: feedColor(l.feedsLambda), background: `${feedColor(l.feedsLambda)}22` }}>
                {l.feedsLambda}
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>promise {l.promise}/5</span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{l.pitch}</p>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}><strong style={{ color: '#f59e0b' }}>Caveat:</strong> {l.caveat}</p>
          </div>
        ))}
      </div>

      <h2>Recommendation</h2>
      <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, maxWidth: 840 }}>{topRecommendation}</p>

      <h2>Source corrections (web-verified)</h2>
      <ul style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
        {meta.sourceCorrections.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
      </ul>

      <p style={{ marginTop: 24 }}>
        <Link to="/verified-height-lever" style={{ color: '#38bdf8' }}>→ The Verified-Height Lever (the only Λ mover)</Link>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8', marginLeft: 16 }}>→ What Binds the Λ≤0.2 Floor?</Link>
      </p>
    </div>
  );
}
