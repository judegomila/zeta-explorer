import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { MOLLIFIER_CERTIFICATE } from '../data/mollified-barrier-certificate-2026-07-08.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

const { meta, provableCeiling, pilotNumbers, triangleChannelScan, triangleChannelNote, limitations } = MOLLIFIER_CERTIFICATE;

// Editorial (warm) re-theme: full-width shell, identical structure/data/math.
// No <svg>/viz on this page — tables only, kept exactly.

export default function MollifiedBarrierCertificatePage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1">Mollified Barrier Certificate — the Lone Survivor</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
          Of 22 novel Λ approach candidates put through a 79-agent skeptical review, exactly one survived —
          and only reframed as an RH-free tool that <em>matches</em> Platt–Trudgian. This is its built,
          interval-certified pilot. It is genuinely a cleaner barrier certificate; it is provably not a beat.
        </p>
      <AnimationEmbed id="mollified-barrier" />


        <HonestCeilingBanner
          variant="ESTIMATE"
          title="Formalization infrastructure, not a beat — a cleaner recertification of Platt–Trudgian"
          body={
            'This mollified certificate turns a phase-blind triangle bound that FAILS into an SOS-friendly ' +
            'one that PASSES, certified in acb ball arithmetic. But it provably cannot lower Λ below 0.2: ' +
            'min|Mf|/max|M| ≤ min|f| always, so the min-modulus channel yields zero gain. No refereed bound is changed' +
            '. NO QED.'
          }
        />

        <div className="card" style={{
          border: '1px solid var(--hairline)', borderLeft: '3px solid var(--green)',
          background: 'var(--paper2)', borderRadius: 8, padding: '14px 18px', margin: '16px 0', maxWidth: 840,
        }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--green)', marginBottom: 6 }}>
            VERDICT: {meta.verdict}
          </div>
          <p style={{ margin: 0, color: 'var(--ink)', fontSize: 14, lineHeight: 1.7 }}>{meta.headline}</p>
        </div>

        <h2>The provable ceiling</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 840 }}>
          The whole "co-designed mollifier + certificate" idea runs into a one-line theorem:
        </p>
        <div className="card" style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '12px 16px', maxWidth: 720 }}>
          <div style={{ color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 14 }}>{provableCeiling.statement}</div>
          <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.6 }}>
            <strong>Proof.</strong> {provableCeiling.proof}
          </p>
          <p style={{ margin: '6px 0 0', color: 'var(--brass-dk)', fontSize: 12.5, lineHeight: 1.6 }}>{provableCeiling.consequence}</p>
        </div>

        <h2>Pilot numbers (<InlineMath tex="N_b = 8" /> window, acb-certified)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: 860 }}>
            <tbody>
              {pilotNumbers.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '5px 12px', color: 'var(--ink-soft)' }}>{r.label}</td>
                  <td style={{ padding: '5px 12px', color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>{r.value}</td>
                  <td style={{ padding: '5px 12px', color: 'var(--faint)', fontSize: 12 }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>The one real win — the triangle channel (fail → pass), and why it shrinks</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))', width: '100%', maxWidth: 640 }}>
            <thead>
              <tr style={{ color: 'var(--faint)', textAlign: 'right' }}>
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
                  <tr key={r.Nb} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)', textAlign: 'right' }}>
                    <td style={{ padding: '4px 12px', textAlign: 'left' }}>{r.Nb}</td>
                    <td style={{ padding: '4px 12px', color: r.plain.trim().startsWith('+') ? 'var(--green)' : 'var(--terra-dk)' }}>{r.plain}</td>
                    <td style={{ padding: '4px 12px', color: passed ? 'var(--green)' : 'var(--terra-dk)', fontWeight: 700 }}>{r.mollified}</td>
                    <td style={{ padding: '4px 12px', textAlign: 'left', color: 'var(--faint)' }}>{r.outcome}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 840, marginTop: 10 }}>{triangleChannelNote}</p>

        <h2>Why it can't be pushed further</h2>
        <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, maxWidth: 860 }}>
          {limitations.map((l, i) => <li key={i} style={{ marginBottom: 5 }}>{l}</li>)}
        </ul>

        <p style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 860 }}>
          Setup: {meta.setup} Backend: {meta.backend}.
        </p>

        <div className="card" style={{ border: '1px solid var(--hairline)', borderLeft: '3px solid var(--brass)', borderRadius: 8, padding: '14px 18px', marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
            <Link to="/pt-floor-audit" style={{ color: 'var(--blue)' }}>← What Binds the Λ≤0.2 Floor?</Link>
            <Link to="/verified-height-lever" style={{ color: 'var(--blue)' }}>→ The Verified-Height Lever</Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
