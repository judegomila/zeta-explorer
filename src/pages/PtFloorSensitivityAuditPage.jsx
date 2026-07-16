import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { PT_FLOOR_AUDIT } from '../data/pt-floor-sensitivity-audit-2026-07-08.js';
import { IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER } from '../data/imp-35711-postport-parity-no-beat-honest-status-banner.js';
import { IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY } from '../data/imp-35678-finite-height-beat-vs-parity-regime-boundary.js';

const {
  meta, marginTable, marginTableNote, documentedMinCorridorMargin,
  floorDecomposition, burgersCrossCheck, refutedAttackClass, theLever, fidelityCaveats,
} = PT_FLOOR_AUDIT;

export default function PtFloorSensitivityAuditPage() {
  return (
    <div className="page">
      <h1>What Binds the Λ ≤ 0.2 Floor? — Sensitivity Audit</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 800 }}>
        The single highest-leverage RH-free experiment from a 79-agent adversarial review of novel
        de Bruijn–Newman Λ attacks: at the barrier operating point, which of three candidates actually
        binds the rigorous Λ ≤ 0.2 floor — the <strong>verified zero height X</strong>, the{' '}
        <strong>barrier min-modulus / mesh slack</strong>, or the <strong>AFE tail e_C</strong>?
      </p>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="Diagnostic audit — produces no bound, beats nothing; Platt–Trudgian Λ ≤ 0.2 stays SOTA"
        body={
          'This audit only asks WHICH constraint binds the existing rigorous floor. It produces no ' +
          'new bound and no proof. The freshly-run margin table is the twin-ladder Rouché CORRIDOR ' +
          'ANALOG (E < m) of the Polymath15 criterion, and the literal P15 figures are documented ' +
          'constants pending a check against the arXiv:1904.12438 ancillary code — see the fidelity ' +
          'caveats at the bottom. NO QED.'
        }
      />

      <div style={{
        border: '1px solid #10b98155', background: 'rgba(16,185,129,0.06)',
        borderRadius: 10, padding: '16px 18px', margin: '18px 0',
      }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#10b981', marginBottom: 6 }}>
          VERDICT: {meta.verdict} · confidence {meta.confidence}
        </div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14.5, lineHeight: 1.7 }}>{meta.headline}</p>
      </div>

      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 800 }}>{meta.question}</p>
      <p style={{ color: '#64748b', fontSize: 12.5, fontFamily: 'ui-monospace, monospace' }}>
        backend: {meta.backend} · normalization: {meta.normalization} · t = {meta.config.t}, η = {meta.config.eta}
      </p>

      <h2>§1 · Margin-ratio table (interval-rigorous, run at t = 0.2)</h2>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, maxWidth: 800 }}>
        Twin-ladder Rouché corridor. ratio <code>m/E</code> = surrogate min-modulus ÷ certified error —
        the structural analog of the Polymath15 <code>|A_t+B_t| / (e_A+e_B+e_C)</code>.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 13, fontFamily: 'ui-monospace, monospace', width: '100%', maxWidth: 720 }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ padding: '4px 10px', textAlign: 'left' }}>cell</th>
              <th style={{ padding: '4px 10px' }}>x = 2γ</th>
              <th style={{ padding: '4px 10px' }}>E (error)</th>
              <th style={{ padding: '4px 10px' }}>m (min-mod)</th>
              <th style={{ padding: '4px 10px' }}>margin m/E</th>
              <th style={{ padding: '4px 10px', textAlign: 'left' }}>status</th>
            </tr>
          </thead>
          <tbody>
            {marginTable.map((r) => {
              const pin = r.status === 'PIN';
              return (
                <tr key={r.cell} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
                  <td style={{ padding: '4px 10px', textAlign: 'left' }}>{r.cell}</td>
                  <td style={{ padding: '4px 10px' }}>{r.x}</td>
                  <td style={{ padding: '4px 10px' }}>{r.E}</td>
                  <td style={{ padding: '4px 10px' }}>{r.m}</td>
                  <td style={{ padding: '4px 10px', color: r.margin >= 1 ? '#10b981' : '#f87171', fontWeight: 700 }}>
                    {r.margin >= 1000 ? r.margin.toLocaleString() : r.margin}
                  </td>
                  <td style={{ padding: '4px 10px', textAlign: 'left', color: pin ? '#10b981' : '#f59e0b' }}>{r.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 820, marginTop: 10 }}>{marginTableNote}</p>
      <p style={{ color: '#cbd5e1', fontSize: 13 }}>
        Documented min corridor margin (t = 0.18, production direct-E engine, 8/8 PIN):{' '}
        <strong style={{ color: '#10b981' }}>≈ {documentedMinCorridorMargin}</strong> — comfortably above 1.
      </p>

      <h2>§2 · Three-term floor decomposition</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {floorDecomposition.map((d) => (
          <div key={d.key} style={{
            border: `1px solid ${d.binds ? '#f59e0b' : '#334155'}`,
            background: d.binds ? 'rgba(245,158,11,0.07)' : 'rgba(15,23,42,0.5)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <strong style={{ color: '#e2e8f0', fontSize: 14 }}>{d.label}</strong>
              <span style={{
                fontSize: 10, fontFamily: 'ui-monospace, monospace', fontWeight: 700,
                padding: '2px 7px', borderRadius: 4,
                color: d.binds ? '#f59e0b' : '#64748b',
                background: d.binds ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.15)',
              }}>
                {d.binds ? 'BINDS' : 'non-binding'}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}>{d.what}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{d.value}</p>
          </div>
        ))}
      </div>

      <h2>§3 · Independent cross-check — the Burgers Λ(N) bridge</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 820 }}>
        <code>{burgersCrossCheck.decomposition}</code>. Gating constant:{' '}
        <code style={{ color: '#f59e0b' }}>{burgersCrossCheck.gatingConstant}</code>. {burgersCrossCheck.finding}
      </p>

      <h2>§4 · What this refutes, and the one real lever</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 820 }}>{refutedAttackClass.why}</p>
      <ul style={{ color: '#94a3b8', lineHeight: 1.7, maxWidth: 820 }}>
        {refutedAttackClass.members.map((m) => <li key={m}>{m}</li>)}
      </ul>
      <div style={{
        border: '1px solid #22d3ee55', background: 'rgba(34,211,238,0.06)',
        borderRadius: 10, padding: '14px 18px', marginTop: 8, maxWidth: 820,
      }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#22d3ee', marginBottom: 6 }}>
          THE ONE REAL LEVER
        </div>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{theLever.statement}</p>
        <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6 }}>
          {theLever.nature} {theLever.gap}
        </p>
      </div>

      <h2>§5 · No-beat banner vs. the recorded finite-height beat</h2>
      <div style={{
        border: '1px solid #f59e0b55', background: 'rgba(245,158,11,0.06)',
        borderRadius: 10, padding: '14px 18px', maxWidth: 820,
      }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#f59e0b', marginBottom: 6 }}>
          {IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.headline}
        </div>
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>
          {IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S1_still_only_parity.claim}
        </p>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, maxWidth: 820, marginTop: 10 }}>
        This is reconciled against the recorded finite-height beat (L_pt ≈{' '}
        {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.twoReadings.reading1_finiteHeightBeat.value}
        {' '}&lt; 0.2) on three orthogonal axes — the two readings are DIFFERENT OBJECTS in DIFFERENT REGIMES, not in tension:
      </p>
      <ul style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.7, maxWidth: 820 }}>
        <li><strong>regime</strong> — {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.reconciliation.axesOfDifference.regime}</li>
        <li><strong>object</strong> — {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.reconciliation.axesOfDifference.object}</li>
        <li><strong>conditionality</strong> — {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.reconciliation.axesOfDifference.conditionality}</li>
      </ul>

      <h2>Fidelity caveats</h2>
      <ol style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, maxWidth: 840 }}>
        {fidelityCaveats.map((c, i) => <li key={i} style={{ marginBottom: 6 }}>{c}</li>)}
      </ol>

      <p style={{ marginTop: 24 }}>
        <Link to="/ht-corridor-certificates" style={{ color: '#38bdf8' }}>→ H_t Corridor Certificates</Link>
        <Link to="/rigor-dashboard" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Rigor Dashboard</Link>
        <Link to="/full-story" style={{ color: '#38bdf8', marginLeft: 16 }}>→ Improving Bounds on Λ</Link>
      </p>
    </div>
  );
}
