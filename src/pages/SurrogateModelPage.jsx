import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function SurrogateModelPage() {
  return (
    <div className="page">
      <PageHeader title="Surrogate Model: imp-3220/imp-3406 Crossover Map">
        <p>
          A single explainer for the phrase that recurs across dozens of glossary entries and
          module verdicts: <em>"inherited imp-3220/imp-3406 extrapolation component model (NOT a
          rigorous asymptotic)"</em>. This page collects what that surrogate is, why it is a proxy
          rather than a proof, and how its three energy terms compose.
        </p>
      </PageHeader>

      <section className="docs-section">
        <h2>What the surrogate is</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The finite-N Lambda bound in this project is built from a composition of error terms
          — collision energy, truncation error, and heat-flow drift — evaluated at a given zero
          count <InlineMath tex="N" />. Getting closed-form, N-uniform bounds for every term is
          RH-hard (see the <Link to="/route-map">Route Map</Link>'s C_H wall). imp-3220 and
          imp-3406 introduced a <strong>double-precision numerical extrapolation</strong> that
          fits and extends each term's observed behaviour across a wide N range instead of proving
          it. Downstream modules call this the "crossover map": a fitted, code-level model of how
          the terms trade off, used to locate landmarks such as{' '}
          <InlineMath tex="N_{\text{cross}}" /> (where <InlineMath tex="E_{\text{coll}} = E_{\text{trunc}}" />)
          and <InlineMath tex="N_{\text{half}}" /> (where the post-peak decay ratio crosses one-half).
        </p>
      </section>

      <section className="docs-section">
        <h2>Why it is a proxy, not a proof</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The surrogate is an OLS/interpolation fit over measured or estimated values, not a
          derivation from first principles. Two consequences follow directly:
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginLeft: 20 }}>
          <li>
            It inherits whatever uncertainty sits in its inputs — most importantly the shock
            modulus <InlineMath tex="C_H" /> feeding <InlineMath tex="E_{\text{coll}}" />, which
            imp-2640 found undischargeable in closed form (N-uniform bounding reduces back to
            RH-hardness).
          </li>
          <li>
            Landmarks read off the surrogate (crossovers, knees, halving points) are measurements
            on that fitted curve, not certified bounds. Changing the fit window or extrapolation
            method can shift a landmark by the residual amounts documented per-module; the
            surrogate itself is never re-derived by those follow-on measurements.
          </li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          That is the entire content of the recurring caveat: results built on this surrogate
          establish no new operator positivity, discharge no wall, and carry no RH verdict.
          No bound on <InlineMath tex="\Lambda" /> changes because of anything the surrogate shows.
        </p>
      </section>

      <section className="docs-section">
        <h2>How E_coll / E_trunc / E_flow compose</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The three terms are added to bound the finite-N drift of the heat-evolved xi function,
          and their ratio defines the U-shaped sigma curve tracked throughout the glossary:
        </p>
        <BlockMath tex={"\\sigma(N) = \\frac{E_{\\text{coll}}(N)}{E_{\\text{coll}}(N) + E_{\\text{trunc}}(N) + E_{\\text{flow}}(N)}"} />
        <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginLeft: 20 }}>
          <li>
            <InlineMath tex="E_{\text{coll}}" /> — the collision-energy term from the Calogero-Moser
            zero-flow bound; carries the undischarged <InlineMath tex="C_H" /> shock modulus.
          </li>
          <li>
            <InlineMath tex="E_{\text{trunc}}" /> — the Ingham-style truncation error from cutting
            the explicit formula off at finite height <InlineMath tex="T" />.
          </li>
          <li>
            <InlineMath tex="E_{\text{flow}}" /> — the de Bruijn-Newman heat-flow drift term,
            vanishing asymptotically but non-negligible at finite N.
          </li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          <InlineMath tex="\sigma(N)" /> is widest (dominated by <InlineMath tex="E_{\text{coll}}" />)
          near a project-specific peak and decays on both sides across the tabulated N range; the
          landmarks named above (<InlineMath tex="N_{\text{cross}}" />, <InlineMath tex="N_{\text{half}}" />,{' '}
          <InlineMath tex="N_{\text{star}}" />) mark specific points on that decay, all read off the
          same inherited surrogate.
        </p>
      </section>

      <div className="card" style={{ marginTop: 8, borderColor: 'var(--accent-orange)' }}>
        <p style={{ color: 'var(--accent-orange)', fontSize: 13, fontWeight: 600 }}>
          Scope: this page is a navigational aid summarizing already-shipped verdicts
          (imp-2640, imp-33723, imp-33582, imp-33721, and the <Link to="/route-map">Route Map</Link>'s
          C_H wall entry). It introduces no new derivation, discharges no wall, and changes no
          bound. NO QED.
        </p>
      </div>
    </div>
  );
}
