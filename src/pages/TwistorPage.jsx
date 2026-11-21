import React, { Suspense, lazy } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RigorousTwistorModel from '../components/RigorousTwistorModel.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

const TwistorViz = lazy(() => import('../components/TwistorViz.jsx'));
const TwistorDiagram3D = lazy(() => import('../components/TwistorDiagram3D.jsx'));

// Editorial (warm) re-theme: full-width column, identical structure/content.
// Interactive visualizations (TwistorDiagram3D, TwistorViz) kept exactly as-is.

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

export default function TwistorPage() {
  const [searchParams] = useSearchParams();
  const illustration = searchParams.get('model') === 'illustration';
  const viewLink = (model) => {
    const next = new URLSearchParams(searchParams);
    next.set('model', model);
    return { search: '?' + next.toString() };
  };
  return <div className="ed-root">
    <EditorialHeader />
    <div className="ed-full rt-page" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
      <h1 className="ed-h1">Twistor Duality</h1>
      <nav className="rt-view-nav" aria-label="Twistor model views">
        <Link to={viewLink('rigorous')} aria-current={!illustration ? 'page' : undefined}>Rigorous model</Link>
        <Link to={viewLink('illustration')} aria-current={illustration ? 'page' : undefined}>Geometric illustration</Link>
      </nav>
      {illustration ? <>
        <div className="rt-note"><strong>Illustration / analogy.</strong> The original visuals below use a Euclidean spinor encoding and a scalar functional-equation bridge. They are not the split-real representation-theoretic model. The toy incidence also vanishes when cos(t log 2) = 0 away from the critical line; neither its vector norm nor its weighted Euler product proves RH.</div>
        <Suspense fallback={<p role="status">Loading the original illustration…</p>}><TwistorIllustration /></Suspense>
      </> : <RigorousTwistorModel />}
    </div>
  </div>;
}

function TwistorIllustration() {
  return (
    <div className="ed-root">
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 className="ed-h2" style={{ marginBottom: 10 }}>Original geometric illustration</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.65, maxWidth: 760 }}>
            Map the Twin-Ladder Bridge twin-ladder model into Penrose twistor geometry. The twistor
            correspondence reframes the direct/dual ladder pair as a twistor/dual-twistor pair
            coupled by an intertwiner — the bridge <InlineMath tex={"\\chi(s)"} />. The critical line
            condition <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> becomes the twistor incidence relation
            <InlineMath tex={"Z^{\\alpha} W_{\\alpha} = 0"} />.
          </p>
        </div>

        <AnimationEmbed id="twistor-lift2" />
          <AnimationEmbed id="wave-collar" />
        <AnimationEmbed id="twistor-lift" />

        <BlockMath tex={"Z^{\\alpha} = (\\omega^A, \\pi_{A'}) \\quad \\longleftrightarrow \\quad \\text{Direct ladder } \\zeta(s)"} />

        <div style={{ marginTop: 8 }}>
          <BlockMath tex={"W_{\\alpha} = (\\tilde{\\omega}^{A'}, \\tilde{\\pi}_A) \\quad \\longleftrightarrow \\quad \\text{Dual ladder } \\zeta(1-s)"} />
        </div>

        <div style={{ marginTop: 8 }}>
          <BlockMath tex={"I: Z \\mapsto W \\text{ via } \\chi(s) \\quad \\longleftrightarrow \\quad \\text{Bridge (intertwiner)}"} />
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>3D Penrose Twistor Diagram</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 16 }}>
            Interactive 3D visualization of the twistor/dual-twistor pair in projective twistor space.
            Drag to orbit. The blue sphere is <InlineMath tex={"Z^{\\alpha}"} /> (direct ladder), gold is{' '}
            <InlineMath tex={"W_{\\alpha}"} /> (dual ladder). Arrows show spinor components. The green arc is the
            intertwiner bridge. Red dots along the <InlineMath tex="t" />-axis mark known zeta zeros.
          </p>
          <Suspense fallback={<div style={{ height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)' }}>Loading 3D...</div>}>
            <TwistorDiagram3D />
          </Suspense>
          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13 }}>
            <Link to="/viz-twistor-dual-intertwiner" style={{ color: 'var(--brass-dk)', fontWeight: 600 }}>
              Full 3D twistor–dual–intertwiner explorer (Robinson congruence + zeta mapping) &rarr;
            </Link>
          </p>
        </div>

        <div style={{ marginTop: 32 }}>
          <h2 className="ed-h2" style={{ marginBottom: 16 }}>2D Analysis Tabs</h2>
          <TwistorViz />
        </div>

        <div className="card" style={{ ...cardBaseLeft(ED.series4), marginTop: 32 }}>
          <h3 style={{ color: 'var(--brass)' }}>What to Explore in Each Tab</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--blue)' }}>Correspondence</strong> — the s-plane (left) maps to twistor space
            (right). Drag <InlineMath tex={"\\sigma"} /> across the critical line and watch the twistor <InlineMath tex="Z" /> (blue)
            and dual twistor <InlineMath tex="W" /> (gold) respond. The intertwiner arc turns green when{' '}
            <InlineMath tex={"|Z \\cdot W| \\approx 0"} /> (incidence satisfied). At <InlineMath tex={"\\sigma = 0.5"} /> the two
            spinors are related by the lossless bridge — move away to see them decouple.
            <strong style={{ color: 'var(--green)' }}> Penrose Transform</strong> — compares the twistor-weighted Euler
            product (top, cyan) with the raw <InlineMath tex={"|\\zeta(s)|"} /> (bottom, purple) across <InlineMath tex={"\\sigma"} />.
            The Pearson correlation in the corner measures how faithfully the twistor weighting captures zeta
            behavior. Increase primes to sharpen both curves and watch the correlation change.
            <strong style={{ color: 'var(--terra-dk)' }}> Incidence Relation</strong> — a 2D heatmap of{' '}
            <InlineMath tex={"|Z \\cdot W|"} /> over the <InlineMath tex={"(\\sigma, t)"} /> plane. Look for the dark band
            along <InlineMath tex={"\\sigma = 0.5"} /> where incidence is satisfied. Green dots mark known zeta zeros —
            they should sit on the dark locus. Widen the t-range to see more zeros and confirm the band persists.
            <strong style={{ color: 'var(--series-5)' }}> Dual Pair</strong> — animated spinor rotation showing twistor{' '}
            <InlineMath tex="Z" /> (blue) and dual <InlineMath tex="W" /> (gold) evolving as t sweeps forward. The
            central intertwiner shows coupling strength. At <InlineMath tex={"\\sigma = 0.5"} /> the pair is phase-locked
            with matched helicities; off the critical line, the rotation rates diverge.
          </p>
        </div>

        <div className="card" style={{ ...cardBaseLeft(ED.series5), marginTop: 32 }}>
          <h3 style={{ color: 'var(--series-5)' }}>Twin-Ladder Bridge / Twistor Correspondence Table</h3>
          <table style={{ width: '100%', marginTop: 12, fontSize: 13, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--blue)' }}>Twin-Ladder Bridge Model</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--brass)' }}>Twistor Theory</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--faint)' }}>Connection</th>
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
                <tr key={i} style={{ borderBottom: '1px solid var(--hair2)' }}>
                  <td style={{ padding: '8px 12px', color: 'var(--blue)' }}>{zpo}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--brass)' }}>{twistor}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--faint)', fontSize: 12 }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Why Twistors? The Geometric Origin of σ = 1/2 ─── */}
        <div className="card" style={{ ...cardBaseLeft(ED.series7), marginTop: 32 }}>
          <h3 style={{ color: 'var(--series-7)', fontSize: 16, marginBottom: 16 }}>
            Why Twistors? The Geometric Origin of <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />
          </h3>

          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            The deepest insight of the twistor reformulation is that the critical line is not merely an
            arithmetic accident — it is a <strong style={{ color: 'var(--ink)' }}>geometric inevitability</strong> arising
            from the incidence structure of twistor space. Here is why.
          </p>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--brass)', fontSize: 13, marginBottom: 8 }}>
              Points become lines
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              In Penrose twistor theory, a point in spacetime does not correspond to a point in twistor
              space — it corresponds to an entire <em>line</em> (a <InlineMath tex={"\\mathbb{CP}^1"} />).
              Conversely, a single twistor <InlineMath tex={"Z^{\\alpha}"} /> represents a light ray in spacetime.
              This "points to lines" duality is the engine that converts analytic conditions into geometry.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              The incidence relation <InlineMath tex={"Z^{\\alpha} W_{\\alpha} = 0"} />
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              A twistor <InlineMath tex={"Z"} /> and a dual twistor <InlineMath tex={"W"} /> are called
              <em> incident</em> when they satisfy the relation:
            </p>
            <BlockMath tex={"Z^{\\alpha} \\Omega_{\\alpha\\beta} W^\\beta = \\omega^A \\tilde{\\pi}_A - \\pi_{A'} \\tilde{\\omega}^{A'} = 0"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
              Geometrically, this means they share a common spacetime point — the light rays they represent
              intersect. The incidence locus is a real hypersurface in the product space
              <InlineMath tex={"\\mathbb{PT} \\times \\mathbb{PT}^*"} />.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--green)', fontSize: 13, marginBottom: 8 }}>
              Twin-Ladder Bridge interpretation: direct and dual ladders share a common zero
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              In the Twin-Ladder Bridge mapping, <InlineMath tex={"Z"} /> encodes the direct ladder{' '}
              <InlineMath tex={"\\zeta(s)"} /> and <InlineMath tex={"W"} /> encodes the dual ladder{' '}
              <InlineMath tex={"\\zeta(1-s)"} />. The incidence condition <InlineMath tex={"Z \\cdot W = 0"} />{' '}
              then translates to a precise statement: the direct and dual ladders share a common zero.
              This is exactly the content of the functional equation at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />:
            </p>
            <BlockMath tex={"Z \\cdot W = 0 \\;\\Longleftrightarrow\\; \\zeta(s) \\text{ and } \\zeta(1-s) \\text{ share a zero} \\;\\Longleftrightarrow\\; \\sigma = \\tfrac{1}{2}"} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--series-5)', fontSize: 13, marginBottom: 8 }}>
              The critical line as a geometric locus
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              The key realization: the critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is{' '}
              <strong style={{ color: 'var(--ink)' }}>not</strong> just an arithmetic condition on the real part
              of <InlineMath tex={"s"} />. It is the <strong style={{ color: 'var(--series-7)' }}>incidence locus</strong>{' '}
              in twistor space — the geometric surface where the twistor and its dual meet. The Riemann
              Hypothesis, in this language, asserts that all nontrivial zeros of{' '}
              <InlineMath tex={"\\zeta"} /> live on this incidence locus.
            </p>
          </div>

          <div style={{ padding: '16px 20px', background: 'color-mix(in srgb, var(--series-7) 8%, transparent)', borderRadius: 8 }}>
            <h4 style={{ color: 'var(--series-7)', fontSize: 13, marginBottom: 10 }}>
              Rank drop and geometric degeneracy
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The incidence matrix of the map <InlineMath tex={"Z \\to W"} /> (via the bridge{' '}
              <InlineMath tex={"\\chi(s)"} />) can be written as a{' '}
              <InlineMath tex={"4 \\times 4"} /> matrix <InlineMath tex={"M(s)"} />. At{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, this matrix suffers a{' '}
              <strong style={{ color: 'var(--ink)' }}>rank drop</strong>:
            </p>
            <BlockMath tex={"\\text{rank}\\, M(s) < 4 \\quad \\text{when } \\sigma = \\tfrac{1}{2}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
              The rank deficiency means the map <InlineMath tex={"Z \\to W"} /> becomes singular — its kernel is
              nontrivial. Zeros of <InlineMath tex={"\\zeta"} /> emerge precisely where the geometry degenerates,
              i.e., where the intertwiner <InlineMath tex={"\\chi(s)"} /> fails to be an isomorphism. The
              determinant condition captures this:
            </p>
            <BlockMath tex={"\\det M(s) = 0 \\;\\Longleftrightarrow\\; Z \\cdot W = 0 \\;\\Longleftrightarrow\\; \\sigma = \\tfrac{1}{2}"} />
            <p style={{ color: 'var(--series-7)', fontSize: 12, marginTop: 10, fontStyle: 'italic' }}>
              The beauty of the twistor picture: the "critical line" transforms from an opaque analytic
              condition into a transparent geometric one — it is where the twistor correspondence degenerates.
            </p>
          </div>
        </div>

        {/* ─── Step-by-Step Mathematical Derivation ─── */}
        <div className="card" style={{ ...cardBaseLeft(ED.series6), marginTop: 32 }}>
          <h3 style={{ color: 'var(--series-6)', fontSize: 16, marginBottom: 16 }}>
            Step-by-Step: From s-Plane to Twistor Space
          </h3>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              Step 1: The Starting Point — Complex Frequency
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              We begin with a point in the complex s-plane: <InlineMath tex={"s = \\sigma + it"} /> where
              <InlineMath tex={"\\sigma = \\text{Re}(s)"} /> is the real part and <InlineMath tex={"t = \\text{Im}(s)"} />
              is the imaginary part. The critical strip is <InlineMath tex={"0 < \\sigma < 1"} /> and the
              critical line is <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            </p>
            <BlockMath tex={"s = \\sigma + it \\in \\mathbb{C}, \\quad \\text{with dual point } 1-s = (1-\\sigma) - it"} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              Step 2: Constructing the Twistor
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              In Penrose's twistor theory, a twistor <InlineMath tex={"Z^{\\alpha}"} /> is a pair of spinors
              <InlineMath tex={"(\\omega^A, \\pi_{A'})"} /> in <InlineMath tex={"\\mathbb{C}^4"} />. We map our
              s-plane point to twistor space by encoding the displacement from the critical line in
              <InlineMath tex={"\\omega"} /> and the prime-phase oscillation in <InlineMath tex={"\\pi"} />:
            </p>
            <BlockMath tex={"Z^{\\alpha} = (\\omega^A, \\pi_{A'}) = \\left(\\sigma - \\tfrac{1}{2},\\; \\frac{t}{2\\pi},\\; \\cos(t\\log 2),\\; \\sin(t\\log 2)\\right)"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Why this encoding?</strong> The first component
              <InlineMath tex={"\\omega_0 = \\sigma - \\frac{1}{2}"} /> measures displacement from the critical line —
              it's zero exactly when <InlineMath tex={"\\sigma = \\frac{1}{2}"} />. The spinor
              <InlineMath tex={"\\pi_{A'}"} /> captures the oscillatory behavior through the smallest prime (2),
              encoding the phase <InlineMath tex={"t \\log 2"} /> that drives the Euler product.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: 'var(--brass)', fontSize: 13, marginBottom: 8 }}>
              Step 3: The Dual Twistor (Functional Equation Mirror)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The functional equation <InlineMath tex={"\\zeta(s) = \\chi(s)\\zeta(1-s)"} /> maps
              <InlineMath tex={"s \\mapsto 1-s"} />. We construct the dual twistor
              <InlineMath tex={"W_{\\alpha}"} /> from this reflected point:
            </p>
            <BlockMath tex={"W_{\\alpha} = \\left(\\tfrac{1}{2} - \\sigma,\\; -\\frac{t}{2\\pi},\\; \\cos(-t\\log 2),\\; \\sin(-t\\log 2)\\right)"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              Note that <InlineMath tex={"W"} /> is the "mirror image" of <InlineMath tex={"Z"} />:
              the displacement <InlineMath tex={"\\omega"} /> flips sign, and the spinor phase conjugates.
              On the critical line (<InlineMath tex={"\\sigma = \\frac{1}{2}"} />), both displacements are zero,
              so <InlineMath tex={"Z"} /> and <InlineMath tex={"W"} /> become incident.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: 'var(--green)', fontSize: 13, marginBottom: 8 }}>
              Step 4: The Incidence Relation (Why {'σ'} = 1/2 is Special)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              Two twistors are <em>incident</em> when their inner product vanishes. We compute:
            </p>
            <BlockMath tex={"Z^{\\alpha} \\Omega_{\\alpha\\beta} W^\\beta = \\omega^A \\tilde{\\pi}_A - \\pi_{A'} \\tilde{\\omega}^{A'}"} />
            <BlockMath tex={"= \\bigl[(\\sigma - \\tfrac{1}{2}) \\cos(-t\\log 2) + \\tfrac{t}{2\\pi} \\sin(-t\\log 2)\\bigr]"} />
            <BlockMath tex={"\\quad - \\bigl[\\cos(t\\log 2)(\\tfrac{1}{2} - \\sigma) + \\sin(t\\log 2)(-\\tfrac{t}{2\\pi})\\bigr]"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              Using <InlineMath tex={"\\cos(-x) = \\cos(x)"} /> and <InlineMath tex={"\\sin(-x) = -\\sin(x)"} />,
              the sine terms cancel (they appear with opposite signs due to the symplectic minus)
              and the cosine terms combine, giving:
            </p>
            <BlockMath tex={"Z \\cdot W = (\\sigma - \\tfrac{1}{2})\\cos(t\\log 2) - (\\tfrac{1}{2} - \\sigma)\\cos(t\\log 2) = 2(\\sigma - \\tfrac{1}{2})\\cos(t\\log 2)"} />
            <p style={{ color: 'var(--green)', fontSize: 13, lineHeight: 1.8, marginTop: 8, fontWeight: 600 }}>
              Therefore <InlineMath tex={"Z \\cdot W = 0"} /> when
              <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (for all <InlineMath tex={"t"} />).
              The critical line is the incidence locus.
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 6 }}>
              <strong style={{ color: 'var(--brass)' }}>Caveat:</strong> the factor <InlineMath tex={"\\cos(t\\log 2)"} /> also
              vanishes at isolated values <InlineMath tex={"t = (2k+1)\\pi/(2\\log 2)"} />, making{' '}
              <InlineMath tex={"Z \\cdot W = 0"} /> for <em>any</em> <InlineMath tex={"\\sigma"} /> at those heights.
              These are artifacts of using only prime <InlineMath tex={"p = 2"} /> in the spinor encoding — a
              richer encoding using all primes would eliminate the spurious incidence locus, leaving only{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: 'var(--series-5)', fontSize: 13, marginBottom: 8 }}>
              Step 5: The Intertwiner (Bridge as Twistor Map)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The bridge <InlineMath tex={"\\chi(s)"} /> from the functional equation acts as the intertwiner
              <InlineMath tex={"I: Z \\mapsto W"} />. It maps the twistor to its dual by multiplying each
              component by <InlineMath tex={"\\chi(s)"} />:
            </p>
            <BlockMath tex={"W = I(Z) = \\chi(s) \\cdot Z, \\quad |I| = |\\chi(s)|"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              When <InlineMath tex={"|\\chi(s)| = 1"} /> (which holds on
              <InlineMath tex={"\\sigma = \\frac{1}{2}"} />, and also at points off the line, for example
              s = 0.75 + 6.288173i and s = −16.406145), the intertwiner is <strong>unitary</strong> —
              it preserves the twistor norm. This means the map between direct and dual ladders is
              lossless, and the twistor pair is in perfect balance. Off the critical line,
              <InlineMath tex={"|\\chi(s)| \\neq 1"} /> and the intertwiner stretches or compresses,
              breaking the symmetry.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--series-2)', fontSize: 13, marginBottom: 8 }}>
              Step 6: The Penrose Transform (Euler Product as Contour Integral)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              In classical twistor theory, the Penrose transform reconstructs spacetime fields from
              twistor data via a contour integral. In our setting, the Euler product provides the analog:
            </p>
            <BlockMath tex={"\\zeta(s) = \\prod_p \\frac{1}{1 - p^{-s}} \\;\\longleftrightarrow\\; \\phi(x) = \\frac{1}{2\\pi i} \\oint f(Z^{\\alpha}) \\pi_{A'} d\\pi^{A'}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              Each Euler factor corresponds to a "twistor function" for prime <InlineMath tex={"p"} />,
              and the product/integral reconstructs the full zeta function. The Penrose transform
              tab in the visualization compares this twistor-weighted reconstruction against the
              actual <InlineMath tex={"|\\zeta(s)|"} />.
            </p>
          </div>
        </div>

        {/* ─── Why This Framework Matters for RH ─── */}
        <div className="card" style={{ ...cardBaseLeft(ED.series2), marginTop: 24 }}>
          <h3 style={{ color: 'var(--series-2)', fontSize: 14, marginBottom: 12 }}>
            What the Twistor Framework Does and Does Not Prove
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h4 style={{ color: 'var(--green)', fontSize: 12, marginBottom: 8 }}>What It Establishes</h4>
              <ul style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
                <li>The critical line <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> is geometrically distinguished as the incidence locus <InlineMath tex={"Z \\cdot W = 0"} /></li>
                <li>The functional equation symmetry <InlineMath tex={"s \\leftrightarrow 1-s"} /> is naturally encoded as twistor-dual twistor duality</li>
                <li>On <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> the bridge has <InlineMath tex={"|\\chi| = 1"} />. This is not a norm-preserving intertwiner between the twistor and its dual (<InlineMath tex={"\\chi Z"} /> is not the dual twistor of the same encoding), and <InlineMath tex={"|\\chi| = 1"} /> also holds off the line</li>
                <li>The Euler product has a natural interpretation as a Penrose transform</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--series-2)', fontSize: 12, marginBottom: 8 }}>What Remains Unproven</h4>
              <ul style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
                <li>That zeta zeros <em>must</em> lie on the incidence locus (we show incidence is special, not that zeros are confined to it)</li>
                <li>That the Penrose transform is <em>exact</em> (not just an analogy)</li>
                <li>The connection between the twistor null condition and the analytic condition <InlineMath tex={"\\zeta(s) = 0"} /></li>
                <li>Whether the twistor encoding captures ALL the structure of <InlineMath tex={"\\zeta"} />, or just the functional equation</li>
              </ul>
            </div>
          </div>
          <p style={{ color: 'var(--brass)', fontSize: 12, marginTop: 12, fontStyle: 'italic' }}>
            The Davenport-Heilbronn function (see Proof Checker) also has a functional equation and
            therefore a similar twistor structure, but its zeros are NOT all on the critical line.
            This means the twistor framework alone cannot prove RH — it must be combined with the
            Euler product structure (Darlington synthesis).
          </p>
        </div>

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card" style={cardBaseLeft(ED.series6)}>
            <h3 style={{ color: 'var(--series-6)' }}>Incidence & the Critical Line</h3>
            <p style={{ marginBottom: 12, color: 'var(--ink-soft)' }}>
              In Penrose twistor theory, two twistors <InlineMath tex="Z" /> and <InlineMath tex="W" /> are
              <em> incident</em> when <InlineMath tex={"Z^{\\alpha} W_{\\alpha} = 0"} />. This null condition defines
              the geometry of light rays in spacetime.
            </p>
            <p style={{ marginBottom: 12, color: 'var(--ink-soft)' }}>
              In our Twin-Ladder Bridge mapping, the incidence relation corresponds to the conjugate impedance match
              condition at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (where <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> via Schwarz reflection). When the twistor and dual twistor are
              incident, the bridge is lossless and the system is in equilibrium:
            </p>
            <BlockMath tex={"|\\chi(s)| = 1 \\iff \\sigma = \\tfrac{1}{2} \\implies Z \\cdot W = 0"} />
            <p style={{ color: 'var(--faint)', fontSize: 13 }}>
              The incidence heatmap tab visualizes this: the dark band along <InlineMath tex={"\\sigma = 0.5"} />
              is where the twistor pair satisfies the null condition, and known zeta zeros sit
              precisely on this locus.
            </p>
          </div>
          <div className="card" style={cardBaseLeft(ED.series7)}>
            <h3 style={{ color: 'var(--series-7)' }}>Key Insights</h3>
            <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2 }}>
              <li>
                <strong style={{ color: 'var(--blue)' }}>Twistor norm</strong> <InlineMath tex={"\\|Z\\|"} /> measures
                displacement from the critical line — it vanishes when the direct ladder is "on-shell."
              </li>
              <li>
                <strong style={{ color: 'var(--brass)' }}>Helicity</strong> <InlineMath tex={"h = \\text{Im}(\\omega \\cdot \\bar\\pi)"} />
                encodes the angular momentum of each ladder's oscillation pattern.
              </li>
              <li>
                <strong style={{ color: 'var(--green)' }}>Phase locking</strong> occurs when the helicities of Z and W
                match — the dual pair rotates in sync, analogous to the standing-wave equilibrium.
              </li>
              <li>
                <strong style={{ color: 'var(--series-5)' }}>Penrose transform</strong> reconstructs the zeta field from
                twistor data, analogous to recovering ζ(s) from its Euler product factors.
              </li>
            </ul>
          </div>
        </div>

        {/* Related Pages */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/waves" style={{ color: 'var(--blue)', fontSize: 13 }}>Waves</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/hamiltonian" style={{ color: 'var(--series-5)', fontSize: 13 }}>Hamiltonian</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/oscillators" style={{ color: 'var(--green)', fontSize: 13 }}>Oscillators</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/zx-calculus" style={{ color: 'var(--brass)', fontSize: 13 }}>ZX-Calculus</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/spectral-attack" style={{ color: 'var(--series-6)', fontSize: 13 }}>Spectral Approach</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/">&larr; the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

