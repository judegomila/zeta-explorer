import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

const PROPOSED_DICTIONARY = [
  ['Z-spider label', 'finite direct Euler factor', 'analogy only'],
  ['X-spider label', 'finite reflected factor', 'analogy only'],
  ['Hadamard box', 'functional-equation bridge', 'no functor constructed'],
  ['spider fusion', 'multiplication of finite factors', 'requires explicit scalar semantics'],
  ['color change', 'reflection s ↦ 1−s', 'not a standard ZX rewrite consequence'],
];

export default function ZXCalculusPage() {
  return (
    <div className="page">
      <PageHeader title="ZX-Calculus Analogy — Audited">
        <p>
          The colored-spider picture is a design language for the finite twin-ladder model.
          No categorical semantics from the zeta function to standard ZX-calculus has yet been
          constructed, so the diagrams are not proofs or exact zeta rewrite rules.
        </p>
      </PageHeader>

      <div className="card" style={{ borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#fca5a5', marginTop: 0 }}>Correction to the original page</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          Standard ZX spiders denote specified linear maps, with phases and scalar conventions in a
          chosen tensor category. Assigning an Euler factor to a spider does not by itself show that
          spider fusion is the Euler product, that Hadamard color change is the zeta functional
          equation, or that ZX completeness proves a zeta identity. Those claims require a
          well-defined, sound interpretation functor; the project does not currently have one.
        </p>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card" style={{ borderColor: '#10b981' }}>
          <h3 style={{ color: '#34d399' }}>Finite algebra that is valid</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            For a finite prime set and away from a factor pole, multiplication is ordinary scalar
            algebra:
          </p>
          <BlockMath tex="H_{P}(s)=\prod_{p\le P}(1-p^{-s})^{-1}" />
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            Its phase is the sum of factor phases modulo branch choices. This finite identity can be
            drawn as fused nodes, but equality with <InlineMath tex="\zeta(s)" /> in the limit uses
            the Euler product and is valid only for <InlineMath tex="\operatorname{Re}s>1" />.
          </p>
          <BlockMath tex="\arg H_P(s)=\sum_{p\le P}\arg(1-p^{-s})^{-1}\pmod{2\pi}" />
        </div>

        <div className="card" style={{ borderColor: '#f59e0b' }}>
          <h3 style={{ color: '#fbbf24' }}>Functional equation that is valid</h3>
          <BlockMath tex="\zeta(s)=\chi(s)\zeta(1-s)" />
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            With this convention, multiplying <InlineMath tex="\zeta(1-s)" /> by
            <InlineMath tex="\chi(s)" /> produces <InlineMath tex="\zeta(s)" />—not the reverse.
            A ZX color-change rule alone contains neither the meromorphic scalar
            <InlineMath tex="\chi" /> nor its gamma, sine, and power-of-
            <InlineMath tex="\pi" /> factors.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#a78bfa' }}>Proposed visual dictionary</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                <th style={{ padding: 10, textAlign: 'left' }}>Diagram label</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Finite-model reading</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Logical status</th>
              </tr>
            </thead>
            <tbody>
              {PROPOSED_DICTIONARY.map(([diagram, model, status]) => (
                <tr key={diagram} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: 10, color: '#a78bfa' }}>{diagram}</td>
                  <td style={{ padding: 10, color: '#cbd5e1' }}>{model}</td>
                  <td style={{ padding: 10, color: '#fbbf24' }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Critical-line phase reflection</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            For the real-valued phase
            <InlineMath tex="\alpha_p(s)=\arg(1-p^{-s})^{-1}" />, complex conjugation acts on the
            factor, not on the real scalar phase. On the critical line
            <InlineMath tex="1-s=\bar s" />, so a consistently chosen reflected phase is
            <InlineMath tex="-\alpha_p(s)" /> modulo <InlineMath tex="2\pi" />.
          </p>
          <BlockMath tex="H_p(\bar s)=\overline{H_p(s)},\qquad \alpha_p(\bar s)\equiv-\alpha_p(s)\pmod{2\pi}" />
        </div>

        <div className="card">
          <h3 style={{ color: '#10b981' }}>Unit modulus: global, not pointwise iff</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            The critical line satisfies <InlineMath tex="|\chi(\tfrac12+it)|=1" /> for all real
            <InlineMath tex="t" />. Isolated off-line points can also have unit modulus, so a
            pointwise <InlineMath tex="|\chi(s)|=1" /> test does not characterize the line.
            Nor does it make the proposed spider chain a lossless physical network.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#fbbf24', marginTop: 0 }}>What would make this rigorous?</h3>
        <ol style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Specify the source category, target category, objects, morphisms, and scalar convention.</li>
          <li>Define the image of every finite Euler factor and prove composition is preserved.</li>
          <li>Include the completed archimedean factor and prove the functional equation is represented.</li>
          <li>Control the infinite limit or state an explicit regularization in the critical strip.</li>
          <li>Prove that any resulting positivity or spectral statement has the required zeta divisor.</li>
        </ol>
        <p style={{ color: '#cbd5e1', fontSize: 13 }}>
          Until then, ZX diagrams remain useful finite-model notation—not a categorical proof framework for RH.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/paper">Corrected model derivation</Link>
          <Link to="/waves">Finite wave visualization</Link>
          <Link to="/proof-overview">Evidence-graded overview</Link>
        </div>
      </div>
    </div>
  );
}
