import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import TwinLadderViz from '../components/TwinLadderViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import FreshnessStamp from '../components/FreshnessStamp.jsx';
import ConceptTerm from '../components/ConceptTerm.jsx';

// Twin Ladder Explorer — editorial (warm) re-theme.
// Full-width dashboard. TwinLadderViz (the interactive 5-tab dashboard)
// is preserved exactly; only surrounding chrome is re-themed.

// ── Style helpers ──────────────────────────────────────────────────────────

// Warm editorial card: paper background, hairline border, colored left rule.
function cardLeft(color, extra = {}) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
    ...extra,
  };
}

const h3Style = (color, extra = {}) => ({ color, fontSize: 15, marginBottom: 8, ...extra });

const bodyText = {
  color: 'var(--ink-soft)',
  fontSize: 14,
  lineHeight: 1.8,
};

const sectionLead = {
  color: 'var(--ink-soft)',
  fontSize: 15,
  lineHeight: 1.6,
  maxWidth: 760,
};

const vizTitle = {
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--ink)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 6,
};

const twoCol = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 16,
};

// Palette map: legacy dark-theme hex accents → warm editorial tokens.
const AMBER = 'var(--brass-dk)';  // was #f59e0b
const PURPLE = 'var(--terra)';    // was #8b5cf6
const CYAN = 'var(--blue)';       // was #06b6d4
const GREEN = 'var(--green)';     // was #10b981
const RED = 'var(--terra-dk)';    // was #ef4444
const BLUE = 'var(--blue)';       // was #3b82f6
const VIOLET = 'var(--brass)';    // was #a855f7

// ── The page ───────────────────────────────────────────────────────────────

export default function TwinLadderPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>

        {/* ── Intro ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>
            Twin Ladder Explorer <FreshnessStamp date="2026-07-23" note="twin-ladder review" />
          </h1>
          <p style={sectionLead}>
            Each <ConceptTerm slug="prime-number">prime</ConceptTerm> <InlineMath tex="p" /> generates a <strong>ladder</strong> of rungs{' '}
            <InlineMath tex={"m = 0, 1, 2, \\ldots"} /> with amplitude <InlineMath tex="p^{-m/2}" /> and
            oscillating phase <InlineMath tex={"m \\cdot T \\cdot \\log p"} />. By introducing thermodynamic
            weights controlled by inverse temperature <InlineMath tex={"\\beta"} /> and pressure{' '}
            <InlineMath tex="P" />, we can deform the ladder, freeze individual rungs via Gaussian proxies,
            and watch ground-state collapse as <InlineMath tex={"\\beta \\to \\infty"} />.
          </p>
          <p style={{ ...bodyText, fontSize: 14, marginTop: 8 }}>
            This explorer is a teaching model. The project's analytic objects of the same name are described on
            the concept pages: <ConceptTerm slug="twin-ladder">twin ladder</ConceptTerm>,{' '}
            <ConceptTerm slug="euler-factor">Euler factor (one rung)</ConceptTerm>,{' '}
            <ConceptTerm slug="bridge-chi">bridge χ(s)</ConceptTerm>,{' '}
            <ConceptTerm slug="frozen-rung">frozen rung</ConceptTerm> and{' '}
            <ConceptTerm slug="volterra-bound">Volterra bound</ConceptTerm>.
          </p>
        </div>

        {/* ── Caveat ─────────────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(AMBER), marginTop: 24 }}>
          <h3 style={h3Style(AMBER)}>Important Caveat</h3>
          <p style={{ ...bodyText, fontSize: 14, marginTop: 8 }}>
            <InlineMath tex="Z_{TL}" /> is an <em>engineered</em> deformation of a <strong>finite</strong> prime
            sum — capped at <InlineMath tex="M" /> rungs over a finite set of <InlineMath tex="N" /> primes — not
            a genuine <ConceptTerm slug="analytic-continuation">analytic continuation</ConceptTerm> of <InlineMath tex={"\\zeta"} />. Its zero structure is a{' '}
            <strong>model artifact</strong> of the chosen weights and truncation; it does <strong>not</strong> track
            the <ConceptTerm slug="nontrivial-zeros">nontrivial zeros</ConceptTerm> of the Riemann zeta function, and nothing on this page constrains where those zeros lie.
            The page is a pedagogical tool for visualizing how thermodynamic weighting reshapes a prime-ladder phasor sum.
          </p>
          <p style={{ ...bodyText, fontSize: 14, marginTop: 8 }}>
            The <InlineMath tex={"\\lVert V_{a,\\Phi}\\rVert \\le 1"} /> collapse this construction gestures toward
            is <strong><ConceptTerm slug="rh-equivalent-statement">RH-equivalent</ConceptTerm></strong>, not a reduction: proving it would be exactly as hard as proving the
            Riemann Hypothesis, so the deformation reformulates the problem rather than making progress on it.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <BlockMath tex={"Z_{TL}\\bigl(\\tfrac{1}{2}+iT;\\,\\beta,P\\bigr) = \\sum_p \\sum_{m=0}^{M} p^{-m/2}\\, e^{-imT\\log p}\\, e^{-\\beta\\, m\\log p \\;-\\; P\\,\\psi(m\\log p)}"} />
        </div>

        <div style={{ marginTop: 8 }}>
          <BlockMath tex={"\\psi(x) = x^2 \\quad\\text{(convex penalty)}, \\qquad \\Pi_{\\text{slack}} = (\\alpha - t - \\varepsilon)\\,U^2"} />
        </div>

        {/* ── The explorer itself — kept exactly as-is ─────────────────────── */}
        <div style={{ marginTop: 32 }}>
          <div style={vizTitle}>Interactive Ladder Explorer</div>
          <TwinLadderViz />
        </div>

        {/* ── What to explore in each tab ───────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(PURPLE), marginTop: 32 }}>
          <h3 style={h3Style(PURPLE)}>What to Explore in Each Tab</h3>
          <p style={{ ...bodyText, marginTop: 12 }}>
            <strong style={{ color: CYAN }}>Ladder Anatomy</strong> shows the raw phasor structure
            for a single prime: each rung is a vector in the complex plane, and the total is their sum.
            Watch how increasing <InlineMath tex="T" /> spins the phasors faster (higher rungs rotate more).
            <strong style={{ color: GREEN }}> Pressure &amp; Temperature</strong> compares unweighted vs
            thermodynamically weighted rungs side-by-side, and plots{' '}
            <InlineMath tex="|Z_{TL}|" /> along the critical line as you change <InlineMath tex={"\\beta"} /> and{' '}
            <InlineMath tex="P" />.
            <strong style={{ color: AMBER }}> Ladder Freezing</strong> compares the exact rung sum
            to a smooth Gaussian proxy <InlineMath tex={"\\Phi_{\\text{fr}}"} /> and shows the slack index
            that measures approximation quality.
            <strong style={{ color: RED }}> Ground-State Collapse</strong> animates how cranking{' '}
            <InlineMath tex={"\\beta"} /> eliminates every rung except <InlineMath tex="m = 0" />.
            <strong style={{ color: VIOLET }}> Phase Diagram</strong> renders a 2D heatmap of{' '}
            <InlineMath tex="|Z_{TL}|" /> over the <InlineMath tex={"(\\beta, P)"} /> plane.
          </p>
        </div>

        {/* ── Rungs & weights ────────────────────────────────────────────── */}
        <div style={{ ...twoCol, marginTop: 32 }}>
          <div className="card" style={cardLeft(CYAN)}>
            <h3 style={h3Style(CYAN)}>Ladder Rungs &amp; Phasors</h3>
            <BlockMath tex={"\\text{Rung } m: \\quad a_m = p^{-m/2},\\quad \\phi_m = m\\,T\\,\\log p"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              Each rung of the ladder for prime <InlineMath tex="p" /> contributes a phasor{' '}
              <InlineMath tex={"a_m e^{-i\\phi_m}"} /> to the complex plane. The amplitudes decay
              geometrically as <InlineMath tex="p^{-m/2}" />, while phases increase linearly with
              the rung index <InlineMath tex="m" />. The total ladder sum determines the prime's
              contribution to the deformed zeta function.
            </p>
          </div>
          <div className="card" style={cardLeft(GREEN)}>
            <h3 style={h3Style(GREEN)}>Thermodynamic Weights</h3>
            <BlockMath tex={"w(p,m) = \\exp\\bigl(-\\beta\\,m\\log p \\;-\\; P\\cdot(m\\log p)^2\\bigr)"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              The weight combines two suppression mechanisms.{' '}
              <strong style={{ color: BLUE }}>Temperature</strong> (<InlineMath tex={"\\beta"} />)
              gives exponential decay in rung energy <InlineMath tex={"m\\log p"} />.{' '}
              <strong style={{ color: AMBER }}>Pressure</strong> (<InlineMath tex="P" />) adds a
              quadratic penalty that further suppresses high-energy rungs. Together they control
              which rungs contribute to the deformed <InlineMath tex="Z_{TL}" />.
            </p>
          </div>
        </div>

        {/* ── Freezing & collapse ───────────────────────────────────────── */}
        <div style={{ ...twoCol, marginTop: 32 }}>
          <div className="card" style={cardLeft(AMBER)}>
            <h3 style={h3Style(AMBER)}>Gaussian Freezing &amp; Slack</h3>
            <BlockMath tex={"\\Phi_{\\text{fr}}(u) = e^{-\\alpha u^2}\\sum_{k} c_{2k}\\,u^{2k}"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              Freezing replaces the discrete rung sum with a smooth Gaussian envelope.
              The <strong style={{ color: GREEN }}>slack index</strong>{' '}
              <InlineMath tex={"\\Pi_{\\text{slack}} = (\\alpha - t - \\varepsilon)U^2"} /> quantifies
              how much margin remains. When slack is positive and large, the proxy is reliable;
              as it approaches zero, the approximation tightens and may fail.
            </p>
          </div>
          <div className="card" style={cardLeft(RED)}>
            <h3 style={h3Style(RED)}>Ground-State Collapse</h3>
            <BlockMath tex={"\\lim_{\\beta\\to\\infty} w(p,m) = \\begin{cases} 1 & m = 0 \\\\ 0 & m \\geq 1 \\end{cases}"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              In the zero-temperature limit, only the <InlineMath tex="m = 0" /> rung survives.
              The entire prime ladder collapses to its ground state: the identity contribution{' '}
              <InlineMath tex="p^0 = 1" />. The product over primes becomes trivial, and{' '}
              <InlineMath tex="Z_{TL}" /> loses all spectral information. This collapse is the
              thermodynamic dual of the Bost-Connes condensation.
            </p>
          </div>
        </div>

        {/* ── Phase diagram interpretation ──────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(VIOLET), marginTop: 24 }}>
          <h3 style={h3Style(VIOLET, { fontSize: 14, marginBottom: 12 })}>
            Phase Diagram Interpretation
          </h3>
          <p style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.8 }}>
            The <InlineMath tex={"(\\beta, P)"} /> phase diagram reveals the structure of the deformed
            zeta function. At <InlineMath tex={"\\beta = 0, P = 0"} /> (origin), we recover the undeformed
            ladder sum. Moving right (increasing <InlineMath tex={"\\beta"} />) suppresses higher rungs
            via Boltzmann-type weighting. Moving up (increasing <InlineMath tex="P" />) adds quadratic
            penalty. The zero loci of <InlineMath tex="|Z_{TL}|" /> trace curves in this plane,
            showing how the zeros of the deformed function depend on the thermodynamic parameters.
            At large <InlineMath tex={"\\beta"} />, ground-state collapse makes{' '}
            <InlineMath tex="|Z_{TL}|" /> uniformly non-zero.
          </p>
        </div>

        {/* ── Related pages ──────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft('var(--brass)'), marginTop: 24 }}>
          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'var(--faint)',
            marginBottom: 10,
          }}>
            Related Pages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/oscillators" style={{ color: CYAN, fontSize: 13, textDecoration: 'none' }}>→ Oscillators (LC ladder model)</Link>
            <Link to="/supercritical" style={{ color: PURPLE, fontSize: 13, textDecoration: 'none' }}>→ Supercritical (thermodynamics)</Link>
            <Link to="/hamiltonian" style={{ color: GREEN, fontSize: 13, textDecoration: 'none' }}>→ Hamiltonian (energy landscape)</Link>
            <Link to="/spectral-attack" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>→ Spectral Approach</Link>
            <Link to="/zeta" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>→ Zeta Function</Link>
            <Link to="/collapse-chain" style={{ color: RED, fontSize: 13, textDecoration: 'none' }}>→ Collapse Chain</Link>
            <Link to="/schatten-trace-norm" style={{ color: VIOLET, fontSize: 13, textDecoration: 'none' }}>→ Schatten Trace Norm</Link>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
