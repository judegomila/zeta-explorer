import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { GM_ALPHA_HALF_SCOPING } from '../data/guth-maynard-alpha-half-scoping-2026-07-10.js';

const { meta, scales, currentState, lever, feasibility, payoffLadder, firewall, citations } = GM_ALPHA_HALF_SCOPING;

export default function GuthMaynardScopingPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>The α=1/2 Large-Value Bottleneck (RH-Adjacent Frontier)</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 820 }}>
          Scoping the sharpest live frontier in the Guth–Maynard program: the α=1/2 large-value case for
          Dirichlet polynomials — the named bottleneck to the Density Hypothesis <code>A(σ)≤2</code> near
          σ=3/4. Genuine, hard, unconditional number theory — and explicitly <em>not</em> a way to move Λ.
        </p>

        <HonestCeilingBanner
          variant="RH-EQUIVALENT"
          title="RH-adjacent, Λ-inert — frontier progress, not RH progress"
          body={
            'Zero-density estimates are positive upper bounds on off-line zeros; they can never certify N=0, ' +
            'so this cannot move the rigorous Λ≤0.2 bound and does not imply RH. It feeds prime gaps / ' +
            'short-interval PNT / L-function results. NO QED.'
          }
        />

        <p style={{ color: 'var(--faint)', fontSize: 12.5, fontFamily: 'var(--ed-mono)', lineHeight: 1.6, maxWidth: 840 }}>{meta.problem}</p>

        <h2 style={{ color: 'var(--ink)' }}>Four scales people conflate</h2>
        <div className="card" style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--hairline)', background: 'var(--paper2)', padding: '4px 8px' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%', maxWidth: 860 }}>
            <tbody>
              {scales.map((s, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--hairline)' }}>
                  <td style={{ padding: '6px 12px', color: 'var(--blue)', fontFamily: 'var(--ed-mono)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{s.scale}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ color: 'var(--ink)', marginTop: 24 }}>Where it stands</h2>
        <ul style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 840 }}>
          <li>{currentState.guthMaynard}</li>
          <li>{currentState.gmGainLocation}</li>
          <li>{currentState.montgomeryConjecture}</li>
        </ul>

        <h2 style={{ color: 'var(--ink)' }}>The inequality to improve — and why it's stuck</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 840 }}>
          <strong>Improve:</strong> {lever.inequalityToImprove}
        </p>
        <ul style={{ color: 'var(--faint)', lineHeight: 1.65, maxWidth: 840 }}>
          {lever.obstruction.map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
        </ul>

        <h2 style={{ color: 'var(--ink)' }}>Feasibility</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 840 }}>
          <div style={{ border: '1px solid color-mix(in srgb, var(--accent) 33%, transparent)', background: 'color-mix(in srgb, var(--series-2) 6%, transparent)', borderRadius: 8, padding: '10px 14px' }}>
            <strong style={{ color: 'var(--terra-dk)' }}>Core (α=1/2):</strong> <span style={{ color: 'var(--ink-soft)' }}>{feasibility.core}</span>
          </div>
          <div style={{ border: '1px solid color-mix(in srgb, var(--brass-deco) 33%, transparent)', background: 'color-mix(in srgb, var(--brass-deco) 7%, transparent)', borderRadius: 8, padding: '10px 14px' }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Periphery:</strong> <span style={{ color: 'var(--ink-soft)' }}>{feasibility.periphery}</span>
          </div>
        </div>

        <h2 style={{ color: 'var(--ink)' }}>Payoff ladder (downstream, RH-adjacent)</h2>
        <ul style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 840 }}>
          {payoffLadder.map((p, i) => <li key={i} style={{ marginBottom: 4 }}>{p}</li>)}
        </ul>

        <div className="card" style={{ border: '1px solid var(--hairline)', borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: 8, padding: '12px 16px', margin: '16px 0', maxWidth: 840 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono)', color: 'var(--brass)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Firewall</div>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.65 }}>{firewall}</p>
        </div>

        <h2 style={{ color: 'var(--ink)' }}>Sources</h2>
        <ul style={{ color: 'var(--faint)', fontSize: 12.5, lineHeight: 1.6, maxWidth: 880 }}>
          {citations.map((c, i) => (
            <li key={i} style={{ marginBottom: 5 }}>
              <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>{c.text}</a>
              <span style={{ color: 'var(--faint)' }}> — {c.status}</span>
            </li>
          ))}
        </ul>

        <div className="card" style={{
          marginTop: 28, borderRadius: 8, border: '1px solid var(--hairline)',
          borderLeft: '3px solid var(--brass)', background: 'var(--paper2)',
          padding: '16px 18px',
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{
            display: 'flex', gap: 16, flexWrap: 'wrap',
            fontSize: 12, fontFamily: 'var(--ed-mono)',
          }}>
            <Link to="/zero-density-scoping" style={{ color: 'var(--brass)', textDecoration: 'none' }}>← Why density is Λ-inert</Link>
            <Link to="/verified-height-lever" style={{ color: 'var(--brass)', textDecoration: 'none' }}>→ The Verified-Height Lever (the only Λ input)</Link>
            <Link to="/" style={{ color: 'var(--faint)', textDecoration: 'none', marginLeft: 'auto' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
