import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { VERIFIED_HEIGHT_LEVER } from '../data/verified-height-lever-2026-07-08.js';

const { meta, heightToLambda, methodology, costEstimate, honestVerdict, citations, uncertainties } = VERIFIED_HEIGHT_LEVER;

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 20px',
  };
}

export default function VerifiedHeightLeverPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>The One Lever Below Λ ≤ 0.2: Verified Zero Height</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 820, marginBottom: 18 }}>
          The <Link to="/pt-floor-audit" style={{ color: 'var(--blue)' }}>sensitivity audit</Link> showed the rigorous
          Λ ≤ 0.2 floor is bound by the <strong>verified RH height X</strong>, not by any analytic barrier slack.
          So the only move below 0.2 is to extend that height — a computation. Here is exactly what that
          buys, and why it can never reach RH.
        </p>

        <div style={{ marginBottom: 20 }}>
          <HonestCeilingBanner
            variant="ESTIMATE"
            title="RH-free HPC computation, not an analytic advance — and it asymptotes above 0"
            body={
              'Extending verified height only nudges the bound (0.20 → ~0.19 for a 3× height gain) because the ' +
              'improvement is inverse-logarithmic in height. It changes one input number; it does not touch the ' +
              'barrier method, the analytic gaps, or the Λ≥0 lower bound, and it can NEVER deliver Λ=0 (RH). ' +
              'No refereed bound is changed. NO QED.'
            }
          />
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--blue)', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>Mechanism</div>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>{meta.mechanism}</p>
          <p style={{ margin: '8px 0 0', color: 'var(--brass-dk)', fontSize: 13, lineHeight: 1.6 }}>{meta.scalingLaw}</p>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Height → best rigorous Λ</h2>
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 8 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '7px 10px', textAlign: 'left', background: 'var(--paper3)', color: 'var(--faint)', fontWeight: 600, fontSize: 12, borderBottom: '1px solid var(--hairline)' }}>verified height X</th>
                <th style={{ padding: '7px 10px', textAlign: 'left', background: 'var(--paper3)', color: 'var(--faint)', fontWeight: 600, fontSize: 12, borderBottom: '1px solid var(--hairline)' }}>best rigorous Λ</th>
                <th style={{ padding: '7px 10px', textAlign: 'left', background: 'var(--paper3)', color: 'var(--faint)', fontWeight: 600, fontSize: 12, borderBottom: '1px solid var(--hairline)' }}>source</th>
              </tr>
            </thead>
            <tbody>
              {heightToLambda.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper2)' }}>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)', borderBottom: '1px solid var(--hairline)' }}>{r.X}</td>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--ed-mono, var(--font-mono))', color: r.pinned ? 'var(--green)' : 'var(--brass-dk)', borderBottom: '1px solid var(--hairline)' }}>
                    {r.lambda}{!r.pinned && ' *'}
                  </td>
                  <td style={{ padding: '6px 10px', fontSize: 12, color: 'var(--faint)', borderBottom: '1px solid var(--hairline)' }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--faint)', fontSize: 12, marginTop: 4, marginBottom: 24 }}>
          <span style={{ color: 'var(--brass-dk)' }}>*</span> not pinned to a primary source — see uncertainties. Current
          record: {meta.currentRecord}
        </p>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>How the height is verified rigorously</h2>
        <ol style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.7, maxWidth: 840, marginBottom: 24 }}>
          {methodology.map((m, i) => <li key={i} style={{ marginBottom: 5 }}>{m}</li>)}
        </ol>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>What 3×10¹² → 10¹³ would take</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 24 }}>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>{costEstimate.claim}</p>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, margin: '8px 0 0' }}><strong>{costEstimate.magnitude}</strong></p>
          <p style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, margin: '8px 0 0' }}>{costEstimate.caveat}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: '8px 0 0' }}>{meta.midFlight}</p>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Verdict</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginBottom: 24 }}>
          <ul style={{ color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0, paddingLeft: 20 }}>
            {honestVerdict.map((v, i) => <li key={i} style={{ marginBottom: 4 }}>{v}</li>)}
          </ul>
          <p style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 600, margin: '10px 0 0' }}>{meta.verdict}</p>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Uncertainties</h2>
        <ul style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 840, marginBottom: 24 }}>
          {uncertainties.map((u, i) => <li key={i} style={{ marginBottom: 4 }}>{u}</li>)}
        </ul>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Sources</h2>
        <ul style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860, marginBottom: 32 }}>
          {citations.map((c) => (
            <li key={c.key} style={{ marginBottom: 5 }}>
              {c.url ? <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>{c.text}</a> : c.text}
              <span style={{ color: 'var(--faint)' }}> — {c.status}</span>
            </li>
          ))}
        </ul>

        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/pt-floor-audit" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              ← What Binds the Λ≤0.2 Floor?
            </Link>
            <Link to="/ht-corridor-certificates" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → H_t Corridor Certificates
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
