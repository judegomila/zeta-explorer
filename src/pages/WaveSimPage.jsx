import React from 'react';
import { Link } from 'react-router-dom';
import WaveSimViz from '../components/WaveSimViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';

/* Editorial conversion (dashboard-style): keeps the interactive WaveSimViz and
   every claim/caveat verbatim; re-themes the chrome to the warm palette and adds
   an animated wireframe wave as the section hero. */

const card = {
  background: 'var(--paper2)', border: '1px solid var(--hairline)',
  borderRadius: 10, padding: '18px 20px', marginTop: 24,
};
const body = { color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.75 };

export default function WaveSimPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>simulators · wave</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">simulators · wave</div>
        <h1 className="ed-h1" style={{ fontSize: 'clamp(26px,3.6vw,38px)', marginTop: 6 }}>Wave Simulator — finite model</h1>
        <p style={{ ...body, fontSize: 17, maxWidth: '58ch', marginTop: 12 }}>
          A finite oscillator visualization inspired by prime logarithms and the functional equation.
          The animation is a model diagnostic, not a physical realization of the analytically continued
          zeta function.
        </p>

        <div className="ed-figure" style={{ margin: '26px 0 8px' }}>
          <div className="frame" style={{ padding: 18 }}><WireframeAnim kind="wave" /></div>
          <figcaption className="ed-figcap">
            A traveling wave (brass) and its reflection (terra) on a bounded string — the concept the
            interactive model below explores.
          </figcaption>
        </div>

        <div style={{ ...card, borderLeft: '3px solid var(--brass)' }}>
          <h3 style={{ color: 'var(--brass)', marginTop: 0, fontSize: 17 }}>Interpretation boundary</h3>
          <p style={body}>
            The exact statement is that the standard functional-equation factor satisfies
            {' '}<InlineMath tex="|\chi(\tfrac12+it)|=1" /> for every real <InlineMath tex="t" />.
            This makes the critical line a global unit-modulus symmetry line. A single point with
            {' '}<InlineMath tex="|\chi(\sigma+it)|=1" /> does not characterize
            {' '}<InlineMath tex="\sigma=\tfrac12" />, and scalar unit modulus does not establish
            impedance matching, zero reflection, passivity, or a causal two-port realization.
          </p>
          <BlockMath tex="\zeta(s)=\chi(s)\zeta(1-s),\qquad |\chi(\tfrac12+it)|=1\quad(t\in\mathbb R)" />
        </div>

        <div style={{ marginTop: 32 }}>
          <WaveSimViz />
        </div>

        <div style={{ ...card, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', marginTop: 0, fontSize: 17 }}>What the controls actually compute</h3>
          <ul style={{ marginLeft: 18, ...body, lineHeight: 2 }}>
            <li>Prime labels use the formal frequencies <InlineMath tex="\log p" /> and finite weights such as <InlineMath tex="p^{-k\sigma}" />.</li>
            <li>For each fixed prime, <InlineMath tex="\sum_{k\ge1}p^{-k\sigma}" /> converges when <InlineMath tex="\sigma>0" />. The sum/product over all primes is absolutely convergent only when <InlineMath tex="\sigma>1" />.</li>
            <li>Direct/dual colors visualize the reflection <InlineMath tex="s\mapsto1-s" />. They do not numerically evaluate two convergent Euler products inside the critical strip.</li>
            <li>Adding more displayed primes changes a finite truncation. On <InlineMath tex="\sigma=\tfrac12" /> it must not be described as convergence to the raw Euler product.</li>
          </ul>
          <BlockMath tex="\prod_p(1-p^{-s})^{-1}=\zeta(s)\quad\text{only as a convergent Euler product for }\operatorname{Re}s>1" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginTop: 24 }}>
          <div style={{ ...card, marginTop: 0 }}>
            <h3 style={{ color: 'var(--green)', marginTop: 0, fontSize: 17 }}>Phase and delay: model quantities</h3>
            <p style={body}>
              The interface can plot phases and derivatives of its finite proxy. In engineering,
              group delay <InlineMath tex="\tau_g=-d\arg H(i\omega)/d\omega" /> has a physical
              interpretation only after a causal transfer function and its realization are defined.
              This project has not proved that the finite proxy extends to such a zeta realization.
            </p>
            <p style={{ color: 'var(--terra-dk)', fontSize: 13, lineHeight: 1.7 }}>
              In particular, neither divergent group delay nor divergent Fisher information at zeta
              zeros has been established by the twin-ladder construction.
            </p>
          </div>

          <div style={{ ...card, marginTop: 0 }}>
            <h3 style={{ color: 'var(--brass)', marginTop: 0, fontSize: 17 }}>Scattering: unresolved realization</h3>
            <p style={body}>
              A conjugate-match or maximum-power-transfer claim needs defined impedances with
              positivity, causality, and port normalization. The identity
              {' '}<InlineMath tex="|\chi|=1" /> on the line supplies none of those by itself.
              For the algebraic cascade used elsewhere in the app,
              {' '}<InlineMath tex="S_{21}(s)=\zeta(2s)/\zeta(s)" />, so generic nontrivial zeta zeros
              are poles rather than transmission zeros.
            </p>
          </div>
        </div>

        <div style={{ ...card, borderLeft: '3px solid var(--brass)' }}>
          <h3 style={{ color: 'var(--brass)', marginTop: 0, fontSize: 17 }}>First zero: what may and may not be inferred</h3>
          <p style={body}>
            The analytic continuation satisfies <InlineMath tex="\zeta(\tfrac12+i\gamma_1)=0" /> at
            {' '}<InlineMath tex="\gamma_1\approx14.134725" />. Finite prime phasors can be displayed at
            that height, but their vector sum is not the zeta value and the divergent product
            {' '}<InlineMath tex="\prod_p(1-p^{-1/2-i\gamma_1})^{-1}" /> must not be set equal to zero.
            Any prime-side reconstruction on the critical line requires an explicit summation or
            regularization theorem.
          </p>
          <BlockMath tex="\zeta(\tfrac12+i\gamma_1)=0\qquad\not\Longrightarrow\qquad \prod_p(1-p^{-1/2-i\gamma_1})^{-1}=0" />
        </div>

        <div style={{ ...card, background: 'var(--paper3)' }}>
          <div className="ed-lbl" style={{ marginBottom: 10 }}>continue the audited path</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontFamily: 'var(--ed-mono)', fontSize: 13 }}>
            <Link to="/paper">Model vs. theorem boundary</Link>
            <Link to="/control">Corrected control-theory audit</Link>
            <Link to="/proof-overview">Evidence-graded proof overview</Link>
            <Link to="/closure-routes">Open closure routes</Link>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
