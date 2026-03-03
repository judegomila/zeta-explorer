import React from 'react';
import TwistorViz from '../components/TwistorViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function TwistorPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Twistor Duality</h1>
        <p>
          Map the ZPO twin-ladder model into Penrose twistor geometry. The twistor
          correspondence reframes the direct/dual ladder pair as a twistor/dual-twistor pair
          coupled by an intertwiner — the bridge <InlineMath tex="\chi(s)" />. The critical line
          condition <InlineMath tex="\sigma = \frac{1}{2}" /> becomes the twistor incidence relation
          <InlineMath tex="Z^\alpha W_\alpha = 0" />.
        </p>
      </div>

      <BlockMath tex="Z^\alpha = (\omega^A, \pi_{A'}) \quad \longleftrightarrow \quad \text{Direct ladder } \zeta(s)" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="W_\alpha = (\tilde\omega^{A'}, \tilde\pi_A) \quad \longleftrightarrow \quad \text{Dual ladder } \zeta(1-s)" />
      </div>

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="I: Z \mapsto W \text{ via } \chi(s) \quad \longleftrightarrow \quad \text{Bridge (intertwiner)}" />
      </div>

      <div style={{ marginTop: 32 }}>
        <TwistorViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>ZPO / Twistor Correspondence Table</h3>
        <table style={{ width: '100%', marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#3b82f6' }}>ZPO Model</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#f59e0b' }}>Twistor Theory</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b' }}>Connection</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Direct ladder ζ(s)', 'Twistor Z^α', 'Spinor encoding of s-plane point'],
              ['Dual ladder ζ(1−s)', 'Dual twistor W_α', 'Reflected point under s → 1−s'],
              ['Bridge χ(s)', 'Intertwiner I', 'Maps Z to W, unitary at σ = ½'],
              ['Critical line σ = ½', 'Incidence: Z·W = 0', 'Null separation in twistor space'],
              ['Euler product', 'Penrose transform', 'Contour integral reconstruction'],
              ['Functional equation', 'Twistor correspondence', 'Bidirectional s ↔ 1−s symmetry'],
            ].map(([zpo, twistor, note], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', color: '#3b82f6' }}>{zpo}</td>
                <td style={{ padding: '8px 12px', color: '#f59e0b' }}>{twistor}</td>
                <td style={{ padding: '8px 12px', color: '#64748b', fontSize: 12 }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Incidence & the Critical Line</h3>
          <p style={{ marginBottom: 12 }}>
            In Penrose twistor theory, two twistors <InlineMath tex="Z" /> and <InlineMath tex="W" /> are
            <em> incident</em> when <InlineMath tex="Z^\alpha W_\alpha = 0" />. This null condition defines
            the geometry of light rays in spacetime.
          </p>
          <p style={{ marginBottom: 12 }}>
            In our ZPO mapping, the incidence relation corresponds to the conjugate impedance match
            condition at <InlineMath tex="\sigma = \frac{1}{2}" /> (where <InlineMath tex="Z_{\text{dual}} = \overline{Z_{\text{dir}}}" /> via Schwarz reflection). When the twistor and dual twistor are
            incident, the bridge is lossless and the system is in equilibrium:
          </p>
          <BlockMath tex="Z \cdot W = 0 \iff |\chi(s)| = 1 \iff \sigma = \tfrac{1}{2}" />
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            The incidence heatmap tab visualizes this: the dark band along <InlineMath tex="\sigma = 0.5" />
            is where the twistor pair satisfies the null condition, and known zeta zeros sit
            precisely on this locus.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#ec4899' }}>Key Insights</h3>
          <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: '#3b82f6' }}>Twistor norm</strong> <InlineMath tex="\|Z\|" /> measures
              displacement from the critical line — it vanishes when the direct ladder is "on-shell."
            </li>
            <li>
              <strong style={{ color: '#f59e0b' }}>Helicity</strong> <InlineMath tex="h = \text{Im}(\omega \cdot \bar\pi)" />
              encodes the angular momentum of each ladder's oscillation pattern.
            </li>
            <li>
              <strong style={{ color: '#10b981' }}>Phase locking</strong> occurs when the helicities of Z and W
              match — the dual pair rotates in sync, analogous to the standing-wave equilibrium.
            </li>
            <li>
              <strong style={{ color: '#8b5cf6' }}>Penrose transform</strong> reconstructs the zeta field from
              twistor data, analogous to recovering ζ(s) from its Euler product factors.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
