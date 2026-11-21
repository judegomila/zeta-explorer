import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { RH_OBSTRUCTION_SEAM } from '../data/rh-obstruction-seam-2026-07-16.js';

const { meta, bracket, principle, literatureLandsInert, caughtFabrications, outOfFramework, conclusion } = RH_OBSTRUCTION_SEAM;

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 20px',
  };
}

export default function ObstructionSeamPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1">The RH Obstruction Seam</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 820, marginTop: 14 }}>
          The sharpest result of the whole program: a deep, independently-verified push on the two
          essential walls (C_H shock modulus + Montgomery pair-correlation) — 16 novel angles, each ruled out
          by ≥2 skeptics at ≥0.82 confidence — reveals not just that the walls stand, but the precise
          <em> structural reason</em> they must.
        </p>

        <AnimationEmbed id="obstruction-seam" />

        <HonestCeilingBanner
          variant="OPEN-HARD"
          title="Clean negative, over-determined — the gap between provable and sufficient IS the Riemann Hypothesis"
          body={
            'No route gets through. Every one splits at one seam: the provable half is inert, the sufficient half ' +
            'is RH-hard, and they never overlap. This is a precise anatomy of the obstruction, not a proof of ' +
            'anything — no refereed bound is changed. NO QED.'
          }
        />

        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), margin: '18px 0', maxWidth: 840 }}>
          <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: 'var(--blue)', marginBottom: 6 }}>{meta.verdict}</div>
          <p style={{ margin: 0, color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.7 }}>{meta.headline}</p>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 28 }}>The seam, bracketed exactly</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 840 }}>
          Two approaches isolate the two sides of the gap — each half conceded by <em>both</em> skeptical referees:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bracket.map((b) => {
            const inert = b.side.includes('INERT');
            const color = inert ? 'var(--green)' : 'var(--terra-dk)';
            return (
              <div key={b.side} className="card" style={cardBaseLeft(color)}>
                <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color, fontWeight: 700 }}>{b.side}</div>
                <div style={{ color: 'var(--ink)', fontSize: 13.5, margin: '4px 0' }}>{b.attack}</div>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}><strong>Conceded:</strong> {b.conceded}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--faint)', lineHeight: 1.55 }}><strong>{inert ? 'Why inert' : 'Why hard'}:</strong> {inert ? b.whyInert : b.whyHard}</p>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), margin: '18px 0', maxWidth: 840 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--brass-dk)', marginBottom: 6 }}>THE PRINCIPLE</div>
          <p style={{ margin: 0, color: 'var(--ink)', fontSize: 14, lineHeight: 1.7 }}>{principle}</p>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 28 }}>Every 2024–2026 result lands on the inert side</h2>
        <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, maxWidth: 860 }}>
          {literatureLandsInert.map((l) => (
            <li key={l.ref} style={{ marginBottom: 5 }}><strong style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--blue)' }}>{l.ref}</strong> — {l.fact}</li>
          ))}
        </ul>

        <h2 className="ed-h2" style={{ marginTop: 28 }}>What the skeptical pass caught (why it's trustworthy)</h2>
        <ul style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
          {caughtFabrications.map((c, i) => <li key={i} style={{ marginBottom: 4 }}>{c}</li>)}
        </ul>

        {outOfFramework && (
          <>
            <h2 className="ed-h2" style={{ marginTop: 28 }}>Out-of-framework follow-up — the overlap is provably empty</h2>
            <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), maxWidth: 860 }}>
              <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: 'var(--terra-dk)', marginBottom: 6 }}>{outOfFramework.verdict}</div>
              <ul style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.6, margin: '4px 0' }}>
                {outOfFramework.failureModes.map((f, i) => <li key={i} style={{ marginBottom: 3 }}>{f}</li>)}
              </ul>
              <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6 }}><strong>Sharpest case:</strong> {outOfFramework.sharpestCase}</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--faint)', lineHeight: 1.55 }}>{outOfFramework.conj221Note}</p>
            </div>
          </>
        )}

        <h2 className="ed-h2" style={{ marginTop: 28 }}>conclusion</h2>
        <p style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.75, maxWidth: 860 }}>{conclusion}</p>

        <div className="ed-postfoot" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/pt-floor-audit">→ What Binds the Λ≤0.2 Floor?</Link>
          <Link to="/zero-density-scoping">→ Density is Λ-inert</Link>
          <Link to="/formalization-status">→ Lean formalization</Link>
          <Link to="/">← the atlas</Link>
        </div>
      </div>
    </div>
  );
}
