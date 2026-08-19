import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WaveSimViz from '../components/WaveSimViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

// Wave Simulator — Finite Model.
// Editorial (warm) re-theme: full-width dashboard. The real WaveSimViz is kept
// EXACTLY as-is (multi-colored output preserved). No wireframe hero.
// Every InlineMath/BlockMath tex, every claim, number, and clarity caveat is
// preserved verbatim from the original page.

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

const body = {
  color: 'var(--ink-soft)',
  fontSize: 14,
  lineHeight: 1.75,
};

export default function WaveSimPage() {
  return (
    <div className="ed-root">
      <EditorialHeader
        ticker={<span>Wave simulator · finite model — a diagnostic, not a realization</span>}
      />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        {/* ── Title ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Wave Simulator — Finite Model</h1>
          <p style={{ ...body, maxWidth: 760 }}>
            Explore a finite oscillator visualization inspired by prime logarithms and the
            functional equation. The animation is a model diagnostic, not a physical realization
            of the analytically continued zeta function.
          </p>
        </div>

        {/* ── Interpretation boundary ───────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 28 }}>
          <div style={cardLabel}>Read this first</div>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 10, color: 'var(--brass-dk)' }}>
            Interpretation boundary
          </h2>
          <p style={{ ...body, fontSize: 13 }}>
            The exact statement is that the standard functional-equation factor satisfies
            <InlineMath tex="|\chi(\tfrac12+it)|=1" /> for every real <InlineMath tex="t" />.
            This makes the critical line a global unit-modulus symmetry line. A single point with
            <InlineMath tex="|\chi(\sigma+it)|=1" /> does not characterize
            <InlineMath tex="\sigma=\tfrac12" />, and scalar unit modulus does not establish
            impedance matching, zero reflection, passivity, or a causal two-port realization.
          </p>
          <BlockMath tex="\zeta(s)=\chi(s)\zeta(1-s),\qquad |\chi(\tfrac12+it)|=1\quad(t\in\mathbb R)" />
        </div>

        {/* ── The real visualization (kept EXACTLY as-is) ───────────────── */}
        <div style={{ marginBottom: 32 }}>
          <WaveSimViz />
        </div>

        {/* ── What the controls compute ─────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginBottom: 24 }}>
          <div style={cardLabel}>Under the hood</div>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 10, color: 'var(--blue)' }}>
            What the controls actually compute
          </h2>
          <ul style={{ marginLeft: 18, ...body, lineHeight: 2 }}>
            <li>
              Prime labels use the formal frequencies <InlineMath tex="\log p" /> and finite weights
              such as <InlineMath tex="p^{-k\sigma}" />.
            </li>
            <li>
              For each fixed prime, <InlineMath tex="\sum_{k\ge1}p^{-k\sigma}" /> converges when
              <InlineMath tex="\sigma>0" />. The sum/product over all primes is absolutely convergent
              only when <InlineMath tex="\sigma>1" />.
            </li>
            <li>
              Direct/dual colors visualize the reflection <InlineMath tex="s\mapsto1-s" />. They do
              not numerically evaluate two convergent Euler products inside the critical strip.
            </li>
            <li>
              Adding more displayed primes changes a finite truncation. On
              <InlineMath tex="\sigma=\tfrac12" /> it must not be described as convergence to the raw
              Euler product.
            </li>
          </ul>
          <BlockMath tex="\prod_p(1-p^{-s})^{-1}=\zeta(s)\quad\text{only as a convergent Euler product for }\operatorname{Re}s>1" />
        </div>

        {/* ── Two model-quantity caveats side by side ───────────────────── */}
        <div className="card-grid" style={{ marginBottom: 32 }}>
          <div className="card" style={cardBaseLeft('var(--green)')}>
            <div style={cardLabel}>Model quantity — not proven physical</div>
            <h3 style={{ marginTop: 0, marginBottom: 8, color: 'var(--green)', fontSize: 16 }}>
              Phase and delay
            </h3>
            <p style={{ ...body, fontSize: 13 }}>
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

          <div className="card" style={cardBaseLeft('var(--terra-dk)')}>
            <div style={cardLabel}>Unresolved realization</div>
            <h3 style={{ marginTop: 0, marginBottom: 8, color: 'var(--terra-dk)', fontSize: 16 }}>
              Scattering
            </h3>
            <p style={{ ...body, fontSize: 13 }}>
              A conjugate-match or maximum-power-transfer claim needs defined impedances with
              positivity, causality, and port normalization. The identity
              <InlineMath tex="|\chi|=1" /> on the line supplies none of those by itself.
              For the algebraic cascade used elsewhere in the app,
              <InlineMath tex="S_{21}(s)=\zeta(2s)/\zeta(s)" />, so generic nontrivial zeta zeros
              are poles rather than transmission zeros.
            </p>
          </div>
        </div>

        {/* ── First zero ────────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 24 }}>
          <div style={cardLabel}>What may and may not be inferred</div>
          <h2 className="ed-h2" style={{ marginTop: 0, marginBottom: 10, color: 'var(--brass-dk)' }}>
            First zero
          </h2>
          <p style={{ ...body, fontSize: 13, lineHeight: 1.8 }}>
            The analytic continuation satisfies
            <InlineMath tex="\zeta(\tfrac12+i\gamma_1)=0" /> at
            <InlineMath tex="\gamma_1\approx14.134725" />. Finite prime phasors can be displayed at
            that height, but their vector sum is not the zeta value and the divergent product
            <InlineMath tex="\prod_p(1-p^{-1/2-i\gamma_1})^{-1}" /> must not be set equal to zero.
            Any prime-side reconstruction on the critical line requires an explicit summation or
            regularization theorem.
          </p>
          <BlockMath tex="\zeta(\tfrac12+i\gamma_1)=0\qquad\not\Longrightarrow\qquad \prod_p(1-p^{-1/2-i\gamma_1})^{-1}=0" />
        </div>

        {/* ── Footer / continue ─────────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--hairline)')}>
          <div style={cardLabel}>Continue the audited path</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
            <Link to="/paper" style={{ fontSize: 13, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Model vs. theorem boundary
            </Link>
            <Link to="/control" style={{ fontSize: 13, color: 'var(--blue)', textDecoration: 'none' }}>
              → Corrected control-theory audit
            </Link>
            <Link to="/proof-overview" style={{ fontSize: 13, color: 'var(--green)', textDecoration: 'none' }}>
              → Evidence-graded proof overview
            </Link>
            <Link to="/closure-routes" style={{ fontSize: 13, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              → Open closure routes
            </Link>
            <Link to="/" style={{ fontSize: 13, color: 'var(--brass)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
