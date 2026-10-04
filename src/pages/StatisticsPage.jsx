import React from 'react';
import { Link } from 'react-router-dom';
import GUEStatisticsViz from '../components/GUEStatisticsViz.jsx';
import LiCriterionViz from '../components/LiCriterionViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

export default function StatisticsPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Zero Statistics &amp; Spectral Criteria</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Computed zeta zeros display striking GUE-like statistics. Li's criterion and the
            de Bruijn-Newman constant give rigorous formulations related to RH; the circuit
            passivity language on this page is an analogy unless an exact realization is supplied.
          </p>
        </div>

        <div className="card" style={{ marginTop: 24, borderColor: 'var(--brass)', background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)' }}>
          <h3 style={{ color: 'var(--brass-dk)' }}>Proven vs. Conditional vs. Conjectural — read this first</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
            This page blends results of very different logical status. To keep the framing:
          </p>
          <ul style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>
              <strong style={{ color: 'var(--green)' }}>PROVEN (unconditional):</strong> Rodgers-Tao proved
              <InlineMath tex={"\\Lambda \\ge 0"} />. This item should not be conflated with pair correlation.
            </li>
            <li>
              <strong style={{ color: 'var(--brass-dk)' }}>CONDITIONAL on RH:</strong> Montgomery established the restricted-support
              pair-correlation asymptotic <InlineMath tex={"R_2(x) = 1 - (\\sin\\pi x/\\pi x)^2"} /> under RH.
              The full pair-correlation conjecture and GUE universality remain open.
            </li>
            <li>
              <strong style={{ color: 'var(--terra-dk)' }}>CONJECTURAL / NUMERICAL only:</strong> full GUE universality for <em>all</em> test functions is the
              Montgomery-Odlyzko conjecture — Odlyzko's millions-of-zeros computations near the <InlineMath tex={"10^{20}"} />-th zero
              are overwhelming numerical evidence, not a proof.
            </li>
            <li>
              <strong style={{ color: 'var(--blue)' }}>OPEN:</strong> RH itself is equivalent to <InlineMath tex={"\\Lambda \\le 0"} /> (hence
              <InlineMath tex={"\\Lambda = 0"} />) and to all Li coefficients <InlineMath tex={"\\lambda_n \\ge 0"} />.
              The peer-reviewed upper-bound benchmark is Platt-Trudgian
              <InlineMath tex={"\\Lambda\\le0.2"} />. This repository's own computer-assisted
              candidates go lower — <Link to="/newman-lambda-01787854-candidate" style={{ color: 'var(--blue)' }}><InlineMath tex={"\\Lambda\\le0.1787854"} /></Link>{' '}
              (reviewed by Dan Romik) and a sharper <InlineMath tex={"\\Lambda\\le0.1758354"} /> — but their bounds
              are not established, so they remain candidates, still far from <InlineMath tex={"0"} />.
            </li>
          </ul>
          <p style={{ marginTop: 8, color: 'var(--faint)', fontSize: 13, fontStyle: 'italic' }}>
            The model-side "GUE emerges from the PT-structure" claims below are heuristic/illustrative, not theorems.
          </p>
        </div>

        <BlockMath tex={"P_{\\text{GUE}}(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi} \\quad \\text{(Wigner surmise for nearest-neighbor spacing)}"} />

        <div style={{ marginTop: 24 }}>
          <div className="viz-title">Random Matrix Theory: GUE Statistics</div>
          <div className="viz-subtitle">
            Compare the spacing distribution of zeta zeros with GUE, GOE, and Poisson predictions.
            The pair correlation <InlineMath tex={"R_2(x) = 1 - (\\sin\\pi x / \\pi x)^2"} /> matches Montgomery's conjecture.
            The number variance <InlineMath tex={"\\Sigma^2(L)"} /> shows the characteristic logarithmic suppression of GUE.
          </div>
          <GUEStatisticsViz />
        </div>

        <div className="two-col" style={{ marginTop: 32 }}>
          <div className="card">
            <h3 style={{ color: 'var(--terra-dk)' }}>GUE Universality</h3>
            <BlockMath tex={"R_2(x) = 1 - \\left(\\frac{\\sin\\pi x}{\\pi x}\\right)^2"} />
            <p style={{ marginTop: 8 }}>
              Montgomery (1973) conjectured and Odlyzko (1987) numerically verified that zeta zeros
              follow GUE statistics. The visualization explores whether a finite oscillator coupling
              can mimic that behavior; it does not derive GUE from the twin-ladder model.
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--blue)' }}>CUE Model</h3>
            <BlockMath tex={"\\zeta(1/2+it) \\sim \\det(I - U_N e^{i\\theta})"} />
            <p style={{ marginTop: 8 }}>
              Keating-Snaith (2000): <InlineMath tex={"\\zeta"} /> on the critical line behaves like the characteristic
              polynomial of a random unitary matrix from the CUE. In our model, the bridge scattering matrix
              truncated to N primes plays the role of this random unitary matrix.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)' }}>What to Explore in Each Tab</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--terra-dk)' }}>Spacing Distribution</strong> compares the nearest-neighbor gaps between
            consecutive zeta zeros to the GUE Wigner surmise <InlineMath tex={"P(s) \\propto s^2 e^{-4s^2/\\pi}"} />.
            Increase the zero count and watch the histogram lock onto the GUE curve while diverging from Poisson — this
            is the hallmark of level repulsion (zeros "avoid" each other like eigenvalues of random Hermitian matrices).
            <strong style={{ color: 'var(--blue)' }}> Pair Correlation</strong> tests Montgomery's conjecture: the two-point
            correlation <InlineMath tex={"R_2(x) = 1 - (\\sin\\pi x/\\pi x)^2"} />. Look for the characteristic dip near
            <InlineMath tex="x = 0" /> (zeros repel) and the approach to 1 at large <InlineMath tex="x" /> (independence at
            long range).
            <strong style={{ color: 'var(--blue)' }}> Number Variance</strong> plots <InlineMath tex={"\\Sigma^2(L)"} />, the variance of zero
            counts in intervals of length <InlineMath tex="L" />. GUE predicts logarithmic growth (<InlineMath tex={"\\sim \\frac{1}{\\pi^2}\\ln(2\\pi L)"} />),
            far below Poisson's linear growth — this spectral rigidity means zeta zeros are much more regularly spaced
            than random points.
          </p>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--green)' }}>Li Coefficients</strong> plots <InlineMath tex={"\\lambda_n"} /> as a bar chart — RH
            is equivalent to all bars being non-negative. Watch for bars dipping below zero (they shouldn't with our
            tabulated zeros).
            <strong style={{ color: 'var(--brass-dk)' }}> Keiper-Li Asymptotic</strong> shows <InlineMath tex={"\\lambda_n / n"} /> against
            the predicted growth (Coffey 2005):
          </p>
          <BlockMath tex={"\\frac{\\lambda_n}{n} \\to \\frac{1}{2}\\bigl(\\log(n/2\\pi) + \\gamma - 1\\bigr)"} />
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            The scatter of data points around the asymptotic line shrinks as you increase zero count.
            <strong style={{ color: 'var(--blue)' }}> de Bruijn-Newman</strong> visualizes zero trajectories under the heat
            equation. Drag the <InlineMath tex={"\\tau"} /> slider: at <InlineMath tex={"\\tau = 0"} /> zeros sit on the real axis
            (assuming RH); negative <InlineMath tex={"\\tau"} /> (backward heat) scatters them into the complex plane,
            while positive <InlineMath tex={"\\tau"} /> preserves real zeros.
          </p>
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--brass)' }}>
          <h3 style={{ color: 'var(--brass-dk)' }}>Montgomery's Pair Correlation Conjecture</h3>
          <BlockMath tex={"R_2(x) = 1 - \\left(\\frac{\\sin(\\pi x)}{\\pi x}\\right)^2"} />
          <p style={{ marginTop: 12 }}>
            In 1973, Hugh Montgomery studied the pair correlation of the nontrivial zeros of the
            Riemann zeta function. He showed that, assuming RH, the pair correlation function of
            the zeros matches the prediction from the <strong>Gaussian Unitary Ensemble (GUE)</strong> of
            random matrix theory:
          </p>
          <BlockMath tex={"1 - \\left(\\frac{\\sin(\\pi x)}{\\pi x}\\right)^2 \\quad \\text{(the GUE kernel)}"} />
          <p style={{ marginTop: 12 }}>
            The connection to random matrix theory was cemented at a now-famous tea party at the
            Institute for Advanced Study, where Freeman Dyson recognized Montgomery's formula as
            identical to the pair correlation of eigenvalues of large random Hermitian matrices.
            This was a stunning surprise — why should the zeros of a number-theoretic function
            behave like eigenvalues of random matrices?
          </p>
          <div style={{ marginTop: 16, padding: 16, background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', borderRadius: 8, borderLeft: '3px solid var(--blue)' }}>
            <p style={{ fontSize: 14, color: 'var(--blue)' }}>
              <strong>The Hilbert-Polya Dream:</strong> This striking match suggests that there exists
              a self-adjoint (Hermitian) operator whose eigenvalues are the imaginary parts of the
              zeta zeros. If such an operator can be constructed and shown to be self-adjoint, RH follows
              automatically — eigenvalues of self-adjoint operators are real.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--terra-dk)' }}>
          <h3 style={{ color: 'var(--terra-dk)' }}>Odlyzko's Computations</h3>
          <BlockMath tex={"\\gamma_n \\approx \\frac{2\\pi n}{\\log n} \\quad \\text{for the } n\\text{-th zero near } n \\sim 10^{20}"} />
          <p style={{ marginTop: 12 }}>
            Andrew Odlyzko computed millions of consecutive zeros of <InlineMath tex={"\\zeta(s)"} /> near
            the <InlineMath tex="10^{20}" />-th zero, far beyond the reach of earlier computations. The
            spacing statistics of these zeros match the GUE predictions with extraordinary precision —
            this is widely considered the <strong>strongest numerical evidence for the Riemann Hypothesis</strong>.
          </p>
          <p style={{ marginTop: 12 }}>
            The nearest-neighbor spacings, pair correlations, number variance, and higher-order
            statistics all align with GUE to many decimal places. As Odlyzko himself noted:
          </p>
          <div style={{ marginTop: 16, padding: 16, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', borderRadius: 8, borderLeft: '3px solid var(--terra-dk)' }}>
            <p style={{ fontSize: 14, color: 'var(--terra-dk)', fontStyle: 'italic' }}>
              "The agreement is to within the accuracy of the data."
            </p>
          </div>
          <p style={{ marginTop: 12 }}>
            These computations provided overwhelming empirical confirmation of Montgomery's
            conjecture and transformed the connection between zeta zeros and random matrix theory
            from a curiosity into a central pillar of modern analytic number theory.
          </p>
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)' }}>Beyond Pair Correlation</h3>
          <p style={{ marginTop: 12 }}>
            The GUE connection extends far beyond the two-point pair correlation. The <strong>n-point
            correlation functions</strong> of zeta zeros also match the GUE prediction, as shown by
            restricted-support <InlineMath tex="n" />-level correlation results of Rudnick and Sarnak,
            together with numerical experiments for <InlineMath tex={"\\zeta(s)"} />. Full zeta GUE
            universality is still conjectural.
          </p>
          <BlockMath tex={"p_0(s) = \\frac{d^2}{ds^2} E_2(s) \\quad \\text{(Gaudin distribution for nearest-neighbor spacing)}"} />
          <p style={{ marginTop: 12 }}>
            The <strong>nearest-neighbor spacing distribution</strong> follows the Gaudin distribution
            derived from the Fredholm determinant of the GUE sine kernel, rather than the simpler
            Wigner surmise (which is already an excellent approximation).
          </p>
          <BlockMath tex={"\\Sigma^2(L) \\sim \\frac{1}{\\pi^2} \\ln(2\\pi L) \\quad \\text{(GUE number variance / spectral rigidity)}"} />
          <p style={{ marginTop: 12 }}>
            The <strong>number variance</strong> (spectral rigidity) grows only logarithmically —
            far below the linear growth expected for uncorrelated random points. This means
            the zeros are remarkably regularly spaced: they <em>repel</em> each other like
            eigenvalues of a Hermitian matrix. This repulsion constrains where zeros can be
            and is intimately connected to the deep arithmetic structure encoded in the zeta function.
          </p>
        </div>

        <div style={{ marginTop: 48 }}>
          <div className="viz-title">Li Criterion &amp; de Bruijn-Newman</div>
          <div className="viz-subtitle">
            Li's criterion: RH ⟺ all <InlineMath tex={"\\lambda_n \\geq 0"} />. The Keiper-Li asymptotic shows <InlineMath tex={"\\lambda_n/n"} /> approaching
            <InlineMath tex={"\\tfrac{1}{2}(\\log(n/2\\pi) + \\gamma - 1)"} /> where <InlineMath tex={"\\gamma \\approx 0.577"} /> is the Euler-Mascheroni constant. The de Bruijn-Newman view shows how zeros drift under heat flow,
            with <InlineMath tex={"\\Lambda \\geq 0"} /> (Rodgers-Tao). RH is equivalent to <InlineMath tex={"\\Lambda = 0"} /> (unproven).
          </div>
          <LiCriterionViz />
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--green)' }}>
          <h3 style={{ color: 'var(--green)' }}>Circuit Analogy for Li's Criterion</h3>
          <BlockMath tex={"\\lambda_n \\geq 0\\ \\forall n \\iff \\mathrm{RH}\\qquad\\text{(Li's theorem)}"} />
          <p style={{ marginTop: 12 }}>
            One may compare non-negative Li coefficients with a hierarchy of passivity tests, but the
            project has not constructed a transfer realization whose Schur-Cohn data are the Li
            coefficients. Therefore <InlineMath tex={"S^\\dagger S\\le I"} /> is an open model target,
            not an equivalent step in Li's theorem. The Keiper-Li growth shown here is a separate
            zero-density diagnostic.
          </p>
          <div style={{ marginTop: 16, padding: 16, background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', borderRadius: 8, borderLeft: '3px solid var(--brass-dk)' }}>
            <p style={{ fontSize: 14, color: 'var(--brass-dk)' }}>
              <strong>de Bruijn-Newman (Rodgers-Tao 2020):</strong> <InlineMath tex={"\\Lambda \\geq 0"} /> means the zeros cannot be pushed
              further onto the critical line by backward heat flow. RH is equivalent to the stronger statement
              <InlineMath tex={"\\Lambda \\leq 0"} />, which combined with Rodgers-Tao would give <InlineMath tex={"\\Lambda = 0"} /> —
              but this remains unproven. If true, it would mean the oscillator chain is tuned to exact
              losslessness with no margin to spare.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--hairline)' }}>
          <h3 style={{ color: 'var(--faint)' }}>Related Pages</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            See also:{' '}
            <Link to="/rh-attack" style={{ color: 'var(--terra-dk)' }}>RH Approach</Link>{' '}
            (overall proof strategy),{' '}
            <Link to="/spectral-attack" style={{ color: 'var(--blue)' }}>Spectral Approach</Link>{' '}
            (GUE connection to confinement potential),{' '}
            <Link to="/hamiltonian" style={{ color: 'var(--blue)' }}>Hamiltonian</Link>{' '}
            (constructing the operator whose eigenvalues are zeros),{' '}
            <Link to="/formal-proof" style={{ color: 'var(--green)' }}>Formal Proof</Link>{' '}
            (S8: spectral confinement),{' '}
            <Link to="/history" style={{ color: 'var(--brass-dk)' }}>History</Link>{' '}
            (Montgomery pair correlation).
            {' '}
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
