import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { VERIFIED_HEIGHT_LEVER } from '../data/verified-height-lever-2026-07-08.js';

const { meta, heightToLambda, methodology, costEstimate, honestVerdict, citations, uncertainties } = VERIFIED_HEIGHT_LEVER;

export default function VerifiedHeightLeverPage() {
  return (
    <div className="page">
      <h1>The One Lever Below Λ ≤ 0.2: Verified Zero Height</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        The <Link to="/pt-floor-audit" style={{ color: '#38bdf8' }}>sensitivity audit</Link> showed the rigorous
        Λ ≤ 0.2 floor is bound by the <strong>verified RH height X</strong>, not by any analytic barrier slack.
        So the only honest move below 0.2 is to extend that height — a computation. Here is exactly what that
        buys, and why it can never reach RH.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="RH-free HPC computation, not an analytic advance — and it asymptotes above 0"
        body={
          'Extending verified height only nudges the bound (0.20 → ~0.19 for a 3× height gain) because the ' +
          'improvement is inverse-logarithmic in height. It changes one input number; it does not touch the ' +
          'barrier method, the analytic gaps, or the Λ≥0 lower bound, and it can NEVER deliver Λ=0 (RH). ' +
          'Platt–Trudgian Λ ≤ 0.2 stays SOTA. NO QED.'
        }
      />

      <div style={{
        border: '1px solid #22d3ee55', background: 'rgba(34,211,238,0.06)',
        borderRadius: 10, padding: '14px 18px', margin: '16px 0', maxWidth: 820,
      }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#22d3ee', marginBottom: 6 }}>MECHANISM</div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{meta.mechanism}</p>
        <p style={{ margin: '8px 0 0', color: '#f59e0b', fontSize: 13, lineHeight: 1.6 }}>{meta.scalingLaw}</p>
      </div>

      <h2>Height → best rigorous Λ</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: 820 }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'left' }}>
              <th style={{ padding: '5px 10px' }}>verified height X</th>
              <th style={{ padding: '5px 10px' }}>best rigorous Λ</th>
              <th style={{ padding: '5px 10px' }}>source</th>
            </tr>
          </thead>
          <tbody>
            {heightToLambda.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid #1e293b', color: '#cbd5e1' }}>
                <td style={{ padding: '5px 10px', fontFamily: 'ui-monospace, monospace' }}>{r.X}</td>
                <td style={{ padding: '5px 10px', fontFamily: 'ui-monospace, monospace', color: r.pinned ? '#10b981' : '#f59e0b' }}>
                  {r.lambda}{!r.pinned && ' *'}
                </td>
                <td style={{ padding: '5px 10px', fontSize: 12, color: '#94a3b8' }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
        <span style={{ color: '#f59e0b' }}>*</span> not pinned to a primary source — see uncertainties. Current
        record: {meta.currentRecord}
      </p>

      <h2>How the height is verified rigorously</h2>
      <ol style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.7, maxWidth: 840 }}>
        {methodology.map((m, i) => <li key={i} style={{ marginBottom: 5 }}>{m}</li>)}
      </ol>

      <h2>What 3×10¹² → 10¹³ would take</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>{costEstimate.claim}</p>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}><strong>{costEstimate.magnitude}</strong></p>
      <p style={{ color: '#64748b', fontSize: 12.5, lineHeight: 1.6, maxWidth: 840 }}>{costEstimate.caveat}</p>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, maxWidth: 840 }}>{meta.midFlight}</p>

      <h2>Honest verdict</h2>
      <ul style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>
        {honestVerdict.map((v, i) => <li key={i} style={{ marginBottom: 4 }}>{v}</li>)}
      </ul>
      <p style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, maxWidth: 840 }}>{meta.verdict}</p>

      <h2>Uncertainties (honest)</h2>
      <ul style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 840 }}>
        {uncertainties.map((u, i) => <li key={i} style={{ marginBottom: 4 }}>{u}</li>)}
      </ul>

      <h2>Sources</h2>
      <ul style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
        {citations.map((c) => (
          <li key={c.key} style={{ marginBottom: 5 }}>
            {c.url ? <a href={c.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{c.text}</a> : c.text}
            <span style={{ color: '#475569' }}> — {c.status}</span>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 24 }}>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8' }}>← What Binds the Λ≤0.2 Floor?</Link>
        <Link to="/ht-corridor-certificates" style={{ color: '#38bdf8', marginLeft: 16 }}>→ H_t Corridor Certificates</Link>
      </p>
    </div>
  );
}
