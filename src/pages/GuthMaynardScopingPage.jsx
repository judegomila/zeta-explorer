import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { GM_ALPHA_HALF_SCOPING } from '../data/guth-maynard-alpha-half-scoping-2026-07-10.js';

const { meta, scales, currentState, lever, feasibility, payoffLadder, firewall, citations } = GM_ALPHA_HALF_SCOPING;

export default function GuthMaynardScopingPage() {
  return (
    <div className="page">
      <h1>The α=1/2 Large-Value Bottleneck (RH-Adjacent Frontier)</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
        Scoping the sharpest live frontier in the Guth–Maynard program: the α=1/2 large-value case for
        Dirichlet polynomials — the named bottleneck to the Density Hypothesis <code>A(σ)≤2</code> near
        σ=3/4. Genuine, hard, unconditional number theory — and explicitly <em>not</em> a Λ lever.
      </p>

      <HonestCeilingBanner
        variant="RH-EQUIVALENT"
        title="RH-adjacent, Λ-inert — frontier progress, not RH progress"
        body={
          'Zero-density estimates are positive upper bounds on off-line zeros; they can never certify N=0, ' +
          'so this cannot move the rigorous Λ≤0.2 bound and does not imply RH. It feeds prime gaps / ' +
          'short-interval PNT / L-function results. Platt–Trudgian Λ≤0.2 remains SOTA. NO QED.'
        }
      />

      <p style={{ color: '#64748b', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', lineHeight: 1.6, maxWidth: 840 }}>{meta.problem}</p>

      <h2>Four scales people conflate</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: 860 }}>
          <tbody>
            {scales.map((s, i) => (
              <tr key={i} style={{ borderTop: '1px solid #1e293b' }}>
                <td style={{ padding: '6px 12px', color: '#38bdf8', fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{s.scale}</td>
                <td style={{ padding: '6px 12px', color: '#cbd5e1', lineHeight: 1.55 }}>{s.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Where it stands</h2>
      <ul style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>
        <li>{currentState.guthMaynard}</li>
        <li>{currentState.gmGainLocation}</li>
        <li>{currentState.montgomeryConjecture}</li>
      </ul>

      <h2>The lever — and why it's stuck</h2>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>
        <strong>Improve:</strong> {lever.inequalityToImprove}
      </p>
      <ul style={{ color: '#94a3b8', lineHeight: 1.65, maxWidth: 840 }}>
        {lever.obstruction.map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
      </ul>

      <h2>Feasibility</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 840 }}>
        <div style={{ border: '1px solid #f8717155', background: 'rgba(248,113,113,0.06)', borderRadius: 8, padding: '10px 14px' }}>
          <strong style={{ color: '#f87171' }}>Core (α=1/2):</strong> <span style={{ color: '#cbd5e1' }}>{feasibility.core}</span>
        </div>
        <div style={{ border: '1px solid #f59e0b55', background: 'rgba(245,158,11,0.06)', borderRadius: 8, padding: '10px 14px' }}>
          <strong style={{ color: '#f59e0b' }}>Periphery:</strong> <span style={{ color: '#cbd5e1' }}>{feasibility.periphery}</span>
        </div>
      </div>

      <h2>Payoff ladder (downstream, RH-adjacent)</h2>
      <ul style={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 840 }}>
        {payoffLadder.map((p, i) => <li key={i} style={{ marginBottom: 4 }}>{p}</li>)}
      </ul>

      <div style={{ border: '1px solid #334155', background: 'rgba(15,23,42,0.5)', borderRadius: 8, padding: '12px 16px', margin: '16px 0', maxWidth: 840 }}>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#a78bfa', marginBottom: 6 }}>FIREWALL</div>
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: 13, lineHeight: 1.65 }}>{firewall}</p>
      </div>

      <h2>Sources</h2>
      <ul style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.6, maxWidth: 880 }}>
        {citations.map((c, i) => (
          <li key={i} style={{ marginBottom: 5 }}>
            <a href={c.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{c.text}</a>
            <span style={{ color: '#475569' }}> — {c.status}</span>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 24 }}>
        <Link to="/zero-density-scoping" style={{ color: '#38bdf8' }}>← Why density is Λ-inert</Link>
        <Link to="/verified-height-lever" style={{ color: '#38bdf8', marginLeft: 16 }}>→ The only Λ lever (verified height)</Link>
      </p>
    </div>
  );
}
