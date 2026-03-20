import React from 'react';
import { Link } from 'react-router-dom';
import GUEStatisticsViz from '../components/GUEStatisticsViz.jsx';
import LiCriterionViz from '../components/LiCriterionViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function StatisticsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Zero Statistics & Spectral Criteria</h1>
        <p>
          The statistical distribution of zeta zeros matches the GUE universality class
          from random matrix theory. The Li criterion and de Bruijn-Newman constant provide
          equivalent formulations of RH as passivity/stability conditions.
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
          <h3 style={{ color: '#ef4444' }}>GUE Universality</h3>
          <BlockMath tex={"R_2(x) = 1 - \\left(\\frac{\\sin\\pi x}{\\pi x}\\right)^2"} />
          <p style={{ marginTop: 8 }}>
            Montgomery (1973) conjectured and Odlyzko (1987) numerically verified that zeta zeros
            follow GUE statistics. In our model, GUE emerges because the oscillator coupling
            matrix (determined by prime gaps) breaks time-reversal symmetry through the PT-structure,
            selecting GUE over GOE.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#8b5cf6' }}>CUE Model</h3>
          <BlockMath tex={"\\zeta(1/2+it) \\sim \\det(I - U_N e^{i\\theta})"} />
          <p style={{ marginTop: 8 }}>
            Keating-Snaith (2000): <InlineMath tex={"\\zeta"} /> on the critical line behaves like the characteristic
            polynomial of a random unitary matrix from the CUE. In our model, the bridge scattering matrix
            truncated to N primes plays the role of this random unitary matrix.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>What to Explore in Each Tab</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#ef4444' }}>Spacing Distribution</strong> compares the nearest-neighbor gaps between
          consecutive zeta zeros to the GUE Wigner surmise <InlineMath tex={"P(s) \\propto s^2 e^{-4s^2/\\pi}"} />.
          Increase the zero count and watch the histogram lock onto the GUE curve while diverging from Poisson — this
          is the hallmark of level repulsion (zeros "avoid" each other like eigenvalues of random Hermitian matrices).
          <strong style={{ color: '#8b5cf6' }}> Pair Correlation</strong> tests Montgomery's conjecture: the two-point
          correlation <InlineMath tex={"R_2(x) = 1 - (\\sin\\pi x/\\pi x)^2"} />. Look for the characteristic dip near
          <InlineMath tex="x = 0" /> (zeros repel) and the approach to 1 at large <InlineMath tex="x" /> (independence at
          long range).
          <strong style={{ color: '#06b6d4' }}> Number Variance</strong> plots <InlineMath tex={"\\Sigma^2(L)"} />, the variance of zero
          counts in intervals of length <InlineMath tex="L" />. GUE predicts logarithmic growth (<InlineMath tex={"\\sim \\frac{1}{\\pi^2}\\log L"} />),
          far below Poisson's linear growth — this spectral rigidity means zeta zeros are much more regularly spaced
          than random points.
        </p>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#10b981' }}>Li Coefficients</strong> plots <InlineMath tex={"\\lambda_n"} /> as a bar chart — RH
          is equivalent to all bars being non-negative. Watch for bars dipping below zero (they shouldn't with our
          tabulated zeros).
          <strong style={{ color: '#f59e0b' }}> Keiper-Li Asymptotic</strong> shows <InlineMath tex={"\\lambda_n / n"} /> against
          the predicted growth (Coffey 2005):
        </p>
        <BlockMath tex={"\\frac{\\lambda_n}{n} \\to \\frac{1}{2}\\bigl(\\log(n/2\\pi) + \\gamma - 1\\bigr)"} />
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          The scatter of data points around the asymptotic line shrinks as you increase zero count.
          <strong style={{ color: '#8b5cf6' }}> de Bruijn-Newman</strong> visualizes zero trajectories under the heat
          equation. Drag the <InlineMath tex={"\\tau"} /> slider: at <InlineMath tex={"\\tau = 0"} /> zeros sit on the real axis
          (assuming RH); negative <InlineMath tex={"\\tau"} /> (backward heat) scatters them into the complex plane,
          while positive <InlineMath tex={"\\tau"} /> preserves real zeros.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>Montgomery's Pair Correlation Conjecture</h3>
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
        <div style={{ marginTop: 16, padding: 16, background: 'rgba(139,92,246,0.08)', borderRadius: 8, borderLeft: '3px solid #8b5cf6' }}>
          <p style={{ fontSize: 14, color: '#8b5cf6' }}>
            <strong>The Hilbert-Polya Dream:</strong> This striking match suggests that there exists
            a self-adjoint (Hermitian) operator whose eigenvalues are the imaginary parts of the
            zeta zeros. If such an operator can be constructed and shown to be self-adjoint, RH follows
            automatically — eigenvalues of self-adjoint operators are real.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#ef4444' }}>
        <h3 style={{ color: '#ef4444' }}>Odlyzko's Computations</h3>
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
        <div style={{ marginTop: 16, padding: 16, background: 'rgba(239,68,68,0.08)', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
          <p style={{ fontSize: 14, color: '#ef4444', fontStyle: 'italic' }}>
            "The agreement is to within the accuracy of the data."
          </p>
        </div>
        <p style={{ marginTop: 12 }}>
          These computations provided overwhelming empirical confirmation of Montgomery's
          conjecture and transformed the connection between zeta zeros and random matrix theory
          from a curiosity into a central pillar of modern analytic number theory.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>Beyond Pair Correlation</h3>
        <p style={{ marginTop: 12 }}>
          The GUE connection extends far beyond the two-point pair correlation. The <strong>n-point
          correlation functions</strong> of zeta zeros also match the GUE prediction, as shown by
          Rudnick and Sarnak (1996) for the <InlineMath tex="n" />-point correlations of
          <InlineMath tex="L" />-functions in the function field setting, and numerically for
          <InlineMath tex={"\\zeta(s)"} /> by Odlyzko.
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
        <div className="viz-title">Li Criterion & de Bruijn-Newman</div>
        <div className="viz-subtitle">
          Li's criterion: RH ⟺ all <InlineMath tex={"\\lambda_n \\geq 0"} />. The Keiper-Li asymptotic shows <InlineMath tex={"\\lambda_n/n"} /> approaching
          <InlineMath tex={"\\tfrac{1}{2}(\\log(n/2\\pi) + \\gamma - 1)"} /> where <InlineMath tex={"\\gamma \\approx 0.577"} /> is the Euler-Mascheroni constant. The de Bruijn-Newman view shows how zeros drift under heat flow,
          with <InlineMath tex={"\\Lambda \\geq 0"} /> (Rodgers-Tao). RH is equivalent to <InlineMath tex={"\\Lambda = 0"} /> (unproven).
        </div>
        <LiCriterionViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Circuit Interpretation of Li's Criterion</h3>
        <BlockMath tex={"\\lambda_n \\geq 0 \\iff S^{\\dagger} S \\leq I \\iff \\text{bridge is passive (contractive)}"} />
        <p style={{ marginTop: 12 }}>
          The Li coefficients are the Schur-Cohn coefficients of the bridge transfer function.
          Their non-negativity is equivalent to the bridge scattering matrix being contractive
          (passive) — it never amplifies. Each <InlineMath tex={"\\lambda_n"} /> tests passivity at the n-th angular momentum
          mode. The Keiper-Li asymptotic shows logarithmic growth, matching the zero density.
        </p>
        <div style={{ marginTop: 16, padding: 16, background: 'rgba(245,158,11,0.08)', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
          <p style={{ fontSize: 14, color: '#f59e0b' }}>
            <strong>de Bruijn-Newman (Rodgers-Tao 2020):</strong> <InlineMath tex={"\\Lambda \\geq 0"} /> means the zeros cannot be pushed
            further onto the critical line by backward heat flow. RH is equivalent to the stronger statement
            <InlineMath tex={"\\Lambda \\leq 0"} />, which combined with Rodgers-Tao would give <InlineMath tex={"\\Lambda = 0"} /> —
            but this remains unproven. If true, it would mean the oscillator chain is tuned to exact
            losslessness with no margin to spare.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#64748b' }}>
        <h3 style={{ color: '#94a3b8' }}>Related Pages</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          See also:{' '}
          <Link to="/rh-attack" style={{ color: '#ef4444' }}>RH Attack</Link>{' '}
          (overall proof strategy),{' '}
          <Link to="/spectral-attack" style={{ color: '#8b5cf6' }}>Spectral Attack</Link>{' '}
          (GUE connection to confinement potential),{' '}
          <Link to="/hamiltonian" style={{ color: '#06b6d4' }}>Hamiltonian</Link>{' '}
          (constructing the operator whose eigenvalues are zeros),{' '}
          <Link to="/formal-proof" style={{ color: '#10b981' }}>Formal Proof</Link>{' '}
          (S8: spectral confinement),{' '}
          <Link to="/history" style={{ color: '#f59e0b' }}>History</Link>{' '}
          (Montgomery pair correlation).
        </p>
      </div>
    </div>
  );
}
