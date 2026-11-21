import React from 'react';
import { Link } from 'react-router-dom';
import { SnapshotBanner } from '../components/ProgramStatus.jsx';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import { PT_FLOOR_AUDIT } from '../data/pt-floor-sensitivity-audit-2026-07-08.js';
import { IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER } from '../data/imp-35711-postport-parity-no-beat-honest-status-banner.js';
import { IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY } from '../data/imp-35678-finite-height-beat-vs-parity-regime-boundary.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

/* Editorial (post reading-view) presentation of the PT Λ≤0.2 floor sensitivity
   audit. All text is sourced verbatim from src/data/pt-floor-sensitivity-audit-
   2026-07-08.js (plus the two status-banner data files) — this file only
   restyles it; it makes no mathematical claim of its own. */

const {
  meta, marginTable, marginTableNote, documentedMinCorridorMargin,
  floorDecomposition, burgersCrossCheck, refutedAttackClass, theLever, fidelityCaveats,
} = PT_FLOOR_AUDIT;

export default function PtFloorSensitivityAuditPage() {
  return (
    <PostLayout
      grade="AUDIT"
      meta={[`VERDICT ${meta.verdict} · confidence ${meta.confidence}`, meta.date]}
      title="What Binds the Λ ≤ 0.2 Floor? — Sensitivity Audit"
      dek={<>
        The single highest-leverage RH-free experiment from a 79-agent skeptical review of novel
        de Bruijn–Newman Λ approaches: at the barrier operating point, which of three candidates actually
        binds the rigorous Λ ≤ 0.2 floor — the <strong>verified zero height X</strong>, the{' '}
        <strong>barrier min-modulus / mesh slack</strong>, or the <strong>AFE tail e_C</strong>?
      </>}
      byline={['exploreriemann', 'diagnostic audit · no bound']}
      ticker={<span>audit · Platt–Trudgian Λ ≤ 0.2 stays SOTA</span>}
      footer={<>
        Related: <Link to="/ht-corridor-certificates">H_t Corridor Certificates</Link>
        {' · '}<Link to="/rigor-dashboard">Rigor Dashboard</Link>
        {' · '}<Link to="/full-story">Improving Bounds on Λ</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <SnapshotBanner date="2026-07-08">This audit concerns the accepted bound Λ ≤ 0.2 and the barrier-tightening class; it is kept as written. Values below 0.2 recorded since then are conditional or unrefereed.</SnapshotBanner>
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab">Diagnostic audit — produces no bound, beats nothing; Platt–Trudgian Λ ≤ 0.2 stays SOTA</div>
        <p style={{ margin: 0 }}>
          This audit only asks WHICH constraint binds the existing rigorous floor. It produces no
          new bound and no proof. The freshly-run margin table is the twin-ladder Rouché CORRIDOR
          ANALOG (E &lt; m) of the Polymath15 criterion, and the literal P15 figures are documented
          constants pending a check against the arXiv:1904.12438 ancillary code — see the fidelity
          caveats at the bottom. NO QED.
        </p>
      <AnimationEmbed id="pt-floor" />

      </div>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">Verdict: {meta.verdict} · confidence {meta.confidence}</div>
        <p style={{ margin: 0 }}>{meta.headline}</p>
      </div>

      <p className="lead">{meta.question}</p>
      <p className="ed-mono" style={{ fontSize: 12.5, color: 'var(--faint)' }}>
        backend: {meta.backend} · normalization: {meta.normalization} · t = {meta.config.t}, η = {meta.config.eta}
      </p>

      <h2>§1 · Margin-ratio table (interval-rigorous, run at t = 0.2)</h2>
      <p>
        Twin-ladder Rouché corridor. ratio <code>m/E</code> = surrogate min-modulus ÷ certified error —
        the structural analog of the Polymath15 <code>|A_t+B_t| / (e_A+e_B+e_C)</code>.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="ed-mono" style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: 720 }}>
          <thead>
            <tr style={{ color: 'var(--faint)', textAlign: 'right' }}>
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
                <tr key={r.cell} style={{ color: 'var(--ink-soft)', textAlign: 'right', borderTop: '1px solid var(--hair2, #d8cfbe)' }}>
                  <td style={{ padding: '4px 10px', textAlign: 'left' }}>{r.cell}</td>
                  <td style={{ padding: '4px 10px' }}>{r.x}</td>
                  <td style={{ padding: '4px 10px' }}>{r.E}</td>
                  <td style={{ padding: '4px 10px' }}>{r.m}</td>
                  <td style={{ padding: '4px 10px', color: r.margin >= 1 ? 'var(--brass-dk)' : 'var(--terra-dk)', fontWeight: 700 }}>
                    {r.margin >= 1000 ? r.margin.toLocaleString() : r.margin}
                  </td>
                  <td style={{ padding: '4px 10px', textAlign: 'left', color: pin ? 'var(--brass-dk)' : 'var(--terra-dk)' }}>{r.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 14, color: 'var(--faint)' }}>{marginTableNote}</p>
      <p>
        Documented min corridor margin (t = 0.18, production direct-E engine, 8/8 PIN):{' '}
        <strong className="ed-terra">≈ {documentedMinCorridorMargin}</strong> — comfortably above 1.
      </p>

      <h2>§2 · Three-term floor decomposition</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {floorDecomposition.map((d) => (
          <div key={d.key} className="ed-thm" style={{ borderLeftColor: d.binds ? 'var(--terra-dk)' : 'var(--faint)', margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <strong>{d.label}</strong>
              <span className="ed-mono" style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                color: d.binds ? 'var(--terra-dk)' : 'var(--faint)',
              }}>
                {d.binds ? 'BINDS' : 'non-binding'}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--faint)' }}>{d.what}</p>
            <p style={{ margin: '4px 0 0', fontSize: 14 }}>{d.value}</p>
          </div>
        ))}
      </div>

      <h2>§3 · Independent cross-check — the Burgers Λ(N) bridge</h2>
      <p>
        <code>{burgersCrossCheck.decomposition}</code>. Gating constant:{' '}
        <code className="ed-terra">{burgersCrossCheck.gatingConstant}</code>. {burgersCrossCheck.finding}
      </p>

      <h2>§4 · What this refutes, and the one remaining input</h2>
      <p>{refutedAttackClass.why}</p>
      <ul style={{ paddingLeft: 20 }}>
        {refutedAttackClass.members.map((m) => <li key={m} style={{ marginBottom: 6 }}>{m}</li>)}
      </ul>
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">The one remaining input</div>
        <p style={{ margin: 0 }}>{theLever.statement}</p>
        <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--faint)' }}>
          {theLever.nature} {theLever.gap}
        </p>
      </div>

      <h2>§5 · No-beat banner vs. the recorded finite-height beat</h2>
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab">{IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.headline}</div>
        <p style={{ margin: 0 }}>
          {IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S1_still_only_parity.claim}
        </p>
      </div>
      <p>
        This is reconciled against the recorded finite-height beat (L_pt ≈{' '}
        {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.twoReadings.reading1_finiteHeightBeat.value}
        {' '}&lt; 0.2) on three orthogonal axes — the two readings are DIFFERENT OBJECTS in DIFFERENT REGIMES, not in tension:
      </p>
      <ul style={{ paddingLeft: 20 }}>
        <li style={{ marginBottom: 6 }}><strong>regime</strong> — {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.reconciliation.axesOfDifference.regime}</li>
        <li style={{ marginBottom: 6 }}><strong>object</strong> — {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.reconciliation.axesOfDifference.object}</li>
        <li style={{ marginBottom: 6 }}><strong>conditionality</strong> — {IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.reconciliation.axesOfDifference.conditionality}</li>
      </ul>

      <Pull>{theLever.statement}</Pull>

      <h2>Fidelity caveats</h2>
      <ol className="ed-mono" style={{ paddingLeft: 20, fontSize: 13, color: 'var(--ink-soft)' }}>
        {fidelityCaveats.map((c, i) => <li key={i} style={{ marginBottom: 6 }}>{c}</li>)}
      </ol>
    </PostLayout>
  );
}
