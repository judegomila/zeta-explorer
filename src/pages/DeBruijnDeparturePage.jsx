import React from 'react';
import { Link } from 'react-router-dom';
import DeBruijnDepartureViz from '../components/DeBruijnDepartureViz.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

export default function DeBruijnDeparturePage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1">Zero Departure under the Exact de Bruijn Flow</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: 760 }}>
          A stable, closed-form imager of the real&nbsp;→&nbsp;complex-pair <em>zero departure</em> that the
          de Bruijn–Newman heat flow undergoes in negative time — the bifurcation at the heart of the
          de Bruijn–Newman constant <InlineMath tex="\Lambda" />.
        </p>

        <HonestCeilingBanner
          variant="ESTIMATE"
          title="Scope: this is an EXACT flow on a polynomial PROXY — it illustrates a mechanism and proves nothing about Λ"
          body={
            'The animation runs the genuine de Bruijn flow, but on a finite-degree real-rooted polynomial, ' +
            'not on ξ. Three caveats: (a) the proxy’s zeros are not the zeros of ξ; (b) there is no ' +
            'degree-uniform control (Jensen/Turán hyperbolicity is only asymptotic in the degree); and ' +
            '(c) at finite degree the flow is an exactly-integrable linear ODE with NO ill-posedness in ' +
            'either time direction. So this is a faithful picture of the departure mechanism — not a bound, ' +
            'not evidence, and it does not touch the Platt–Trudgian Λ ≤ 0.2 ceiling.'
          }
        />

        <DeBruijnDepartureViz />

        <h2 className="ed-h1" style={{ fontSize: 22, marginTop: 32 }}>The exact flow</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          The de Bruijn–Newman evolution is <InlineMath tex="H_t = e^{-t\,\partial_z^2} H_0" />, equivalently the
          coefficient ODE
        </p>
        <BlockMath tex="\dot c_k = -(k+1)(k+2)\,c_{k+2}." />
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          On a degree-<InlineMath tex="d" /> polynomial this is a finite, upper-triangular, exactly-integrable
          linear system — the top two coefficients are constant and every lower one is a polynomial in{' '}
          <InlineMath tex="t" />. Its closed form is
        </p>
        <BlockMath tex="c_k(t) = \sum_{j\ge 0} \frac{(-t)^j}{j!}\; a_{k+2j}\;\frac{(k+2j)!}{k!}," />
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          with <InlineMath tex="a_n" /> the coefficients of <InlineMath tex="H_0" /> (finite because{' '}
          <InlineMath tex="a_n = 0" /> for <InlineMath tex="n > d" />). There is <strong>no numerical PDE and no
          ill-posedness</strong>: the picture is exact and stable in both time directions.
        </p>

        <h2 className="ed-h1" style={{ fontSize: 22, marginTop: 32 }}>Which direction is departure?</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          Take the smallest nontrivial case, <InlineMath tex="H_0(z) = z^2 - 1" /> with real roots{' '}
          <InlineMath tex="\pm 1" />. The flow gives, in closed form,
        </p>
        <BlockMath tex="H_t(z) = z^2 - (1 + 2t), \qquad z = \pm\sqrt{1+2t}." />
        <ul style={{ color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: 760 }}>
          <li>
            <strong>Increasing <InlineMath tex="t" /></strong> spreads the two roots apart on the real axis —
            the anti-diffusive, reality-<em>improving</em> Newman direction (once real, they stay real).
          </li>
          <li>
            <strong>Decreasing <InlineMath tex="t" /></strong> past <InlineMath tex="t=-\tfrac12" /> collides
            them at the origin and splits them into a conjugate pair{' '}
            <InlineMath tex="\pm i\sqrt{|1+2t|}" /> — a real&nbsp;→&nbsp;complex <strong>zero departure</strong>{' '}
            in negative de Bruijn time.
          </li>
        </ul>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          This is the canonical Lehmer-pair bifurcation. Note the direction that <em>images</em> the departure
          (decreasing <InlineMath tex="t" />) is the well-posed, forward-heat / smoothing direction — so it needs
          no regularization to visualize stably. This is exactly why a Cattaneo / telegrapher "relativistic"
          regularization buys nothing here: the departure direction is already well-posed, and the{' '}
          <em>reality-improving</em> direction it would try to tame is the one this exact ODE already integrates
          without difficulty at finite degree.
        </p>

        <h2 className="ed-h1" style={{ fontSize: 22, marginTop: 32 }}>Why it can't move Λ</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          The departure you see is real, but it is the departure of a proxy. Bounding{' '}
          <InlineMath tex="\Lambda" /> requires a <em>quantitative, degree-uniform</em> statement about the zeros
          of the true <InlineMath tex="\xi" /> — control of the interacting zero gas, not a picture of one
          polynomial's roots. This page is a faithful diagnostic of the mechanism the winding analysis surfaced
          (genuine zeros in negative de Bruijn time), and nothing more.
        </p>

        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap', fontSize: 12 }}>
            <Link to="/viz-winding-dyson-flow" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              → Winding under Dyson/Newman Flow
            </Link>
            <Link to="/supercritical" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              → Supercritical phase
            </Link>
            <Link to="/full-story" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              → Improving Bounds on Λ
            </Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
