import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { RH_OBSTRUCTION_SEAM } from '../data/rh-obstruction-seam-2026-07-16.js';

const { meta, bracket, principle, literatureLandsInert, caughtFabrications, conclusion } = RH_OBSTRUCTION_SEAM;

export default function ObstructionSeamPage() {
  return (
    <div className="page">
      <h1>The RH Obstruction Seam</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        The sharpest honest result of the whole attack: a deep, adversarially-verified assault on the two
        load-bearing walls (C_H shock modulus + Montgomery pair-correlation) — 16 novel angles, each killed
        by ≥2 skeptics at ≥0.82 confidence — reveals not just that the walls stand, but the precise
        <em> structural reason</em> they must.
      </p>

      <HonestCeilingBanner
        variant="OPEN-HARD"
        title="Clean negative, over-determined — the gap between provable and sufficient IS the Riemann Hypothesis"
        body={
          'No route breaches. Every one splits at one seam: the provable half is inert, the sufficient half ' +
          'is RH-hard, and they never overlap. This is a precise anatomy of the obstruction, not a proof of ' +
          'anything — PT Λ≤0.2 stays SOTA. NO QED.'
        }
      />

      <div style={{ border: '1px solid #22d3ee55', background: 'rgba(34,211,238,0.06)', borderRadius: 10, padding: '16px 18px', margin: '18px 0', maxWidth: 840 }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#22d3ee', marginBottom: 6 }}>{meta.verdict}</div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14.5, lineHeight: 1.7 }}>{meta.headline}</p>
      </div>

      <h2>The seam, bracketed exactly</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>
        Two attacks isolate the two sides of the gap — each half conceded by <em>both</em> adversarial referees:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bracket.map((b) => {
          const inert = b.side.includes('INERT');
          return (
            <div key={b.side} style={{ border: `1px solid ${inert ? '#10b98155' : '#f8717155'}`, background: inert ? 'rgba(16,185,129,0.06)' : 'rgba(248,113,113,0.06)', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: inert ? '#10b981' : '#f87171', fontWeight: 700 }}>{b.side}</div>
              <div style={{ color: '#e2e8f0', fontSize: 13.5, margin: '4px 0' }}>{b.attack}</div>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.55 }}><strong>Conceded:</strong> {b.conceded}</p>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}><strong>{inert ? 'Why inert' : 'Why hard'}:</strong> {inert ? b.whyInert : b.whyHard}</p>
            </div>
          );
        })}
      </div>

      <div style={{ border: '1px solid #334155', background: 'rgba(15,23,42,0.6)', borderRadius: 8, padding: '14px 18px', margin: '16px 0', maxWidth: 840 }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#a78bfa', marginBottom: 6 }}>THE PRINCIPLE</div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{principle}</p>
      </div>

      <h2>Every 2024–2026 result lands on the inert side</h2>
      <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, maxWidth: 860 }}>
        {literatureLandsInert.map((l) => (
          <li key={l.ref} style={{ marginBottom: 5 }}><strong style={{ fontFamily: 'ui-monospace, monospace', color: '#38bdf8' }}>{l.ref}</strong> — {l.fact}</li>
        ))}
      </ul>

      <h2>What the adversarial pass caught (why it's trustworthy)</h2>
      <ul style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
        {caughtFabrications.map((c, i) => <li key={i} style={{ marginBottom: 4 }}>{c}</li>)}
      </ul>

      <h2>Honest conclusion</h2>
      <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.75, maxWidth: 860 }}>{conclusion}</p>

      <p style={{ marginTop: 24 }}>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8' }}>→ What Binds the Λ≤0.2 Floor?</Link>
        <Link to="/zero-density-scoping" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Density is Λ-inert</Link>
        <Link to="/formalization-status" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Lean formalization</Link>
      </p>
    </div>
  );
}
