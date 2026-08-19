import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

const PROPOSED_DICTIONARY = [
  ['Z-spider label', 'finite direct Euler factor', 'analogy only'],
  ['X-spider label', 'finite reflected factor', 'analogy only'],
  ['Hadamard box', 'functional-equation bridge', 'no functor constructed'],
  ['spider fusion', 'multiplication of finite factors', 'requires explicit scalar semantics'],
  ['color change', 'reflection s ↦ 1−s', 'not a standard ZX rewrite consequence'],
];

export default function ZXCalculusPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>attack · ZX-calculus</span>} />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>ZX-Calculus Analogy — Audited</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            The colored-spider picture is a design language for the finite twin-ladder model.
            No categorical semantics from the zeta function to standard ZX-calculus has yet been
            constructed, so the diagrams are not proofs or exact zeta rewrite rules.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--terra-dk)' }}>
          <h3 style={{ color: 'var(--terra-dk)', marginTop: 0 }}>Correction to the original page</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            Standard ZX spiders denote specified linear maps, with phases and scalar conventions in a
            chosen tensor category. Assigning an Euler factor to a spider does not by itself show that
            spider fusion is the Euler product, that Hadamard color change is the zeta functional
            equation, or that ZX completeness proves a zeta identity. Those claims require a
            well-defined, sound interpretation functor; the project does not currently have one.
          </p>
        </div>

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card" style={{ borderColor: 'var(--green)' }}>
            <h3 style={{ color: 'var(--green)' }}>Finite algebra that is valid</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              For a finite prime set and away from a factor pole, multiplication is ordinary scalar
              algebra:
            </p>
            <BlockMath tex="H_{P}(s)=\prod_{p\le P}(1-p^{-s})^{-1}" />
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              Its phase is the sum of factor phases modulo branch choices. This finite identity can be
              drawn as fused nodes, but equality with <InlineMath tex="\zeta(s)" /> in the limit uses
              the Euler product and is valid only for <InlineMath tex="\operatorname{Re}s>1" />.
            </p>
            <BlockMath tex="\arg H_P(s)=\sum_{p\le P}\arg(1-p^{-s})^{-1}\pmod{2\pi}" />
          </div>

          <div className="card" style={{ borderColor: 'var(--brass-dk)' }}>
            <h3 style={{ color: 'var(--brass-dk)' }}>Functional equation that is valid</h3>
            <BlockMath tex="\zeta(s)=\chi(s)\zeta(1-s)" />
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              With this convention, multiplying <InlineMath tex="\zeta(1-s)" /> by
              <InlineMath tex="\chi(s)" /> produces <InlineMath tex="\zeta(s)" />—not the reverse.
              A ZX color-change rule alone contains neither the meromorphic scalar
              <InlineMath tex="\chi" /> nor its gamma, sine, and power-of-
              <InlineMath tex="\pi" /> factors.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--brass)' }}>Proposed visual dictionary</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <th style={{ padding: 10, textAlign: 'left' }}>Diagram label</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Finite-model reading</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Logical status</th>
                </tr>
              </thead>
              <tbody>
                {PROPOSED_DICTIONARY.map(([diagram, model, status]) => (
                  <tr key={diagram} style={{ borderBottom: '1px solid var(--hair2)' }}>
                    <td style={{ padding: 10, color: 'var(--brass)' }}>{diagram}</td>
                    <td style={{ padding: 10, color: 'var(--ink-soft)' }}>{model}</td>
                    <td style={{ padding: 10, color: 'var(--brass-dk)' }}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card">
            <h3 style={{ color: 'var(--blue)' }}>Critical-line phase reflection</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              For the real-valued phase
              <InlineMath tex="\alpha_p(s)=\arg(1-p^{-s})^{-1}" />, complex conjugation acts on the
              factor, not on the real scalar phase. On the critical line
              <InlineMath tex="1-s=\bar s" />, so a consistently chosen reflected phase is
              <InlineMath tex="-\alpha_p(s)" /> modulo <InlineMath tex="2\pi" />.
            </p>
            <BlockMath tex="H_p(\bar s)=\overline{H_p(s)},\qquad \alpha_p(\bar s)\equiv-\alpha_p(s)\pmod{2\pi}" />
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--green)' }}>Unit modulus: global, not pointwise iff</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              The critical line satisfies <InlineMath tex="|\chi(\tfrac12+it)|=1" /> for all real
              <InlineMath tex="t" />. Isolated off-line points can also have unit modulus, so a
              pointwise <InlineMath tex="|\chi(s)|=1" /> test does not characterize the line.
              Nor does it make the proposed spider chain a lossless physical network.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass-dk)' }}>
          <h3 style={{ color: 'var(--brass-dk)', marginTop: 0 }}>What would make this rigorous?</h3>
          <ol style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Specify the source category, target category, objects, morphisms, and scalar convention.</li>
            <li>Define the image of every finite Euler factor and prove composition is preserved.</li>
            <li>Include the completed archimedean factor and prove the functional equation is represented.</li>
            <li>Control the infinite limit or state an explicit regularization in the critical strip.</li>
            <li>Prove that any resulting positivity or spectral statement has the required zeta divisor.</li>
          </ol>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
            Until then, ZX diagrams remain useful finite-model notation—not a categorical proof framework for RH.
          </p>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/paper" style={{ fontSize: 12, color: 'var(--brass-dk)' }}>
              → Corrected model derivation
            </Link>
            <Link to="/waves" style={{ fontSize: 12, color: 'var(--brass)' }}>
              → Finite wave visualization
            </Link>
            <Link to="/proof-overview" style={{ fontSize: 12, color: 'var(--blue)' }}>
              → Evidence-graded overview
            </Link>
          </div>
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ fontSize: 12, color: 'var(--terra-dk)' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
