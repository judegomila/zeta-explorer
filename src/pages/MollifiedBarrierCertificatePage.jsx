import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath } from '../components/KaTeXMath.jsx';
import { MOLLIFIER_CERTIFICATE } from '../data/mollified-barrier-certificate-2026-07-08.js';

const { meta, provableCeiling, pilotNumbers, triangleChannelScan, triangleChannelNote, limitations } = MOLLIFIER_CERTIFICATE;

export default function MollifiedBarrierCertificatePage() {
  return (
    <div className="page">
      <h1>Mollified Barrier Certificate — the Lone Survivor</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        Of 22 novel Λ attack candidates put through a 79-agent adversarial review, exactly one survived —
        and only reframed as an RH-free tool that <em>matches</em> Platt–Trudgian. This is its built,
        interval-certified pilot. It is genuinely a cleaner barrier certificate; it is provably not a beat.
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="Formalization infrastructure, not a beat — a cleaner recertification of Platt–Trudgian"
        body={
          'This mollified certificate turns a phase-blind triangle bound that FAILS into an SOS-friendly ' +
          'one that PASSES, certified in acb ball arithmetic. But it provably cannot lower Λ below 0.2: ' +
          'min|Mf|/max|M| ≤ min|f| always, so the min-modulus channel yields zero gain. Platt–Trudgian ' +
          'Λ ≤ 0.2 stays SOTA. NO QED.'
        }
      />

      <div style={{
        border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)',
        borderRadius: 10, padding: '14px 18px', margin: '16px 0', maxWidth: 840,
      }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#10b981', marginBottom: 6 }}>
          VERDICT: {meta.verdict}
        </div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{meta.headline}</p>
      </div>

      <h2>The provable ceiling</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>
        The whole "co-designed mollifier + certificate" idea runs into a one-line theorem:
      </p>
      <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #334155', borderRadius: 8, padding: '12px 16px', maxWidth: 720 }}>
        <div style={{ color: '#e2e8f0', fontFamily: 'ui-monospace, monospace', fontSize: 14 }}>{provableCeiling.statement}</div>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6 }}>
          <strong>Proof.</strong> {provableCeiling.proof}
        </p>
        <p style={{ margin: '6px 0 0', color: '#f59e0b', fontSize: 12.5, lineHeight: 1.6 }}>{provableCeiling.consequence}</p>
      </div>

      <h2>Pilot numbers (<InlineMath tex="N_b = 8" /> window, acb-certified)</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: 860 }}>
          <tbody>
            {pilotNumbers.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid #1e293b' }}>
                <td style={{ padding: '5px 12px', color: '#cbd5e1' }}>{r.label}</td>
                <td style={{ padding: '5px 12px', color: '#e2e8f0', fontFamily: 'ui-monospace, monospace', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>{r.value}</td>
                <td style={{ padding: '5px 12px', color: '#64748b', fontSize: 12 }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The one real win — the triangle channel (fail → pass), and why it shrinks</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 13, fontFamily: 'ui-monospace, monospace', width: '100%', maxWidth: 640 }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ padding: '4px 12px', textAlign: 'left' }}>N_b</th>
              <th style={{ padding: '4px 12px' }}>plain</th>
              <th style={{ padding: '4px 12px' }}>mollified</th>
              <th style={{ padding: '4px 12px', textAlign: 'left' }}>outcome</th>
            </tr>
          </thead>
          <tbody>
            {triangleChannelScan.map((r) => {
              const passed = r.mollified.trim().startsWith('+');
              return (
                <tr key={r.Nb} style={{ borderTop: '1px solid #1e293b', color: '#cbd5e1', textAlign: 'right' }}>
                  <td style={{ padding: '4px 12px', textAlign: 'left' }}>{r.Nb}</td>
                  <td style={{ padding: '4px 12px', color: r.plain.trim().startsWith('+') ? '#10b981' : '#f87171' }}>{r.plain}</td>
                  <td style={{ padding: '4px 12px', color: passed ? '#10b981' : '#f87171', fontWeight: 700 }}>{r.mollified}</td>
                  <td style={{ padding: '4px 12px', textAlign: 'left', color: '#94a3b8' }}>{r.outcome}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 840, marginTop: 10 }}>{triangleChannelNote}</p>

      <h2>Why it can't be pushed further</h2>
      <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, maxWidth: 860 }}>
        {limitations.map((l, i) => <li key={i} style={{ marginBottom: 5 }}>{l}</li>)}
      </ul>

      <p style={{ color: '#64748b', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
        Setup: {meta.setup} Backend: {meta.backend}.
      </p>

      <p style={{ marginTop: 24 }}>
        <Link to="/pt-floor-audit" style={{ color: '#38bdf8' }}>← What Binds the Λ≤0.2 Floor?</Link>
        <Link to="/verified-height-lever" style={{ color: '#38bdf8', marginLeft: 16 }}>→ The Verified-Height Lever</Link>
      </p>
    </div>
  );
}
