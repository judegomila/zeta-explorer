# Close the third theta interpolation stage

Research continuation, **9 November 2026**, following
[PR #47](https://github.com/judegomila/mathexplorer/pull/47).

**Main result:** every three-node positive-real Pick matrix for the actual
xi logarithmic derivative is positive definite, for every choice of three
distinct positive real nodes. The proof covers the whole positive axis.
It uses the published finite-height RH verification on the bounded part
of that axis, and elementary gamma and prime estimates on the remaining
half-line. This advances the exact ladder from two stages to three.

We also derive positive integral kernels after the first exact Schur
cancellation, an exact residual energy as gamma squares plus compensated
prime forcing, and a strict mixed-moment inequality for the actual theta
kernel. Positivity at arbitrary order remains open; this checkpoint does
not prove RH or claim novelty for the finite-order result.

## Overall strategy and its current boundary

Let

\[
F(z)=\xi(1/2+z),\qquad L(z)=F'(z)/F(z).
\]

The previous checkpoint constructs finite passive ladders from exact
values of L through the inverse Schur map

\[
\mathcal T_{a,p}[R](z)=p\frac{zR(z)+a}{z+aR(z)},\qquad a,p>0.
\]

An exact identity proves that this map preserves positive-realness.
Positive interpolants at every nested node set dense in [1,2], normalized
at one fixed node, would have a normal-family limit equal to L. The
resulting global analytic positive-real response would exclude off-axis
zeros of xi. The all-order positivity needed for that implication is
still the missing theorem. The construction and conditional limit are
recorded at the fixed
[PR #47 commit](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_positive_interpolation_20261108.md).

The present result proves the next finite stage and records the exact
energy inequality that would have to survive every subsequent step.

## 1. The third stage is positive for all real node choices

For distinct positive nodes define

\[
P_{ij}=\frac{L(x_i)+L(x_j)}{x_i+x_j}.
\]

The [curvature note](theta_three_node_curvature_20261109.md) proves

\[
\boxed{P\succ0\qquad\text{for every three distinct }x_1,x_2,x_3>0.}
\]

This is a continuum theorem, not a finite grid of tested matrices.
Set \(h(u)=L(\sqrt u)/\sqrt u\). Given the already established strict
two-node inequalities, the exact three-node criterion is

\[
hh''-2(h')^2\ge0,\qquad uh''+2h'\le0.
\]

Equivalently, both \(1/h(u)\) and \(h(1/u)\) must be concave. We prove
both inequalities strictly for the actual xi response.

The second sign follows from the classical zero strip: the squared
spectral parameters \(\lambda=\gamma^2-\beta^2-2i\beta\gamma\) lie in
a sector that gives
\(\Re[\lambda/(u+\lambda)^3]>0\). The possible low-height issue is
covered by published finite verification.

For the first sign on \(0\le u\le10^4\), split h into the verified real
head through \(T=3\cdot10^{12}\) and the unknown tail. The exact anchor

\[
h(1/4)=2+\gamma_E-\log(4\pi)<1
\]

bounds the total reciprocal moment of the zero ordinates. Two coarse
first-zero intervals supply a positive head margin, while the entire
unknown tail has a uniform bound:

\[
hh''-2h'^2
\ge\frac{8\cdot216^2}{10484^6}-\frac6{T^2}-\frac{18}{T^4}>0.
\]

The head exceeds \(2.4\cdot10^{-19}\); the subtracted bound is below
\(7\cdot10^{-25}\). These are exact rational comparisons. The inputs
are the [Platt--Trudgian finite-height theorem](https://arxiv.org/abs/2004.09765)
and published coarse first-zero enclosures. Their computations are not
rerun in this checkpoint.

For \(x=\sqrt u\ge100\), the
[large-argument proof](theta_third_pick_large_x_20261109.md) establishes

\[
L(x)^2+xL(x)L'(x)+x^2L(x)L''(x)-2x^2L'(x)^2
>\frac{58}{225}.
\]

It follows from explicit gamma-series bounds and an absolutely convergent
prime sum. This half-line proof requires no zero-location input.

The finite-height input is substantive: this argument converts known
finite zero information into a global third-order interpolation theorem.
It does not extend the verified zero height or make the all-order step
automatic.

## 2. The signed first reduction has positive canceled kernels

For an anchor a and p=L(a), the exact reduced response is

\[
R_a(z)=\frac{zL(z)-ap}{zp-aL(z)}.
\]

Cancel its common factors before assessing the transformed sources:

\[
A_a(z)=\frac{zF'(z)-apF(z)}{z^2-a^2},\qquad
B_a(z)=\frac{pzF(z)-aF'(z)}{z(z^2-a^2)}.
\]

The [positive-kernel note](theta_schur_positive_kernels_20261109.md)
proves that both are transforms of strictly positive even kernels,
\(A_a=\mathcal L n_a\), \(B_a=\mathcal L b_a\), with

\[
\boxed{n_a+a b_a=C,\qquad
C(u)=\frac14\int_{|u|}^{\infty}v\kappa(v)\,dv,\qquad b_a'(u)<0\ (u>0).}
\]

Here \(\mathcal L f(z)=\int_{\mathbb R}f(u)e^{zu/2}du\). The proof
uses exact Green-function cancellation and a single-crossing sign
argument, with all constants displayed. Consequently

\[
R_a(z)=\frac{A_a(z)}{zB_a(z)}.
\]

Positive integral kernels alone do not make this complex-domain ratio
positive-real. Their role is to supply a concrete pair of kernels for
the next reduction.

## 3. An exact theta inequality follows

Let \(q(v)=-\kappa'(v)/(v\kappa(v))\), and let \(\nu_\theta\) be the
probability measure proportional to
\(v\kappa(v)\sinh(\theta v)dv\) on the positive half-line. Define

\[
m(\theta)=E_{\nu_\theta}q.
\]

The theta integration-by-parts identity is
\(1/h(u)=4m(\sqrt u/2)\). The newly proved curvature therefore gives

\[
\boxed{\theta m''(\theta)<m'(\theta)\qquad(\theta>0).}
\]

Section 5 of the curvature note expands this into a strict covariance
and mixed third-central-moment inequality for the actual theta kernel.
Its present proof uses the finite-zero argument above. A direct
kernel property preserved at every ladder step has not been obtained.

## 4. The arithmetic energy now has an explicit square part

For \(v(t)=\sum_j b_j e^{-x_jt}\), with \(x_j>1/2\), define

\[
Q_L(v)=\sum_{i,j}b_i\overline{b_j}
\frac{L(x_i)+L(x_j)}{x_i+x_j}.
\]

Choosing the coefficients by the existing Schur projection makes this
exactly the next defect \(\Delta_N\). Put \(\lambda_k=2k+5/2\),

\[
J_\lambda(t)=\int_0^\infty e^{-\lambda s}v(t+s)\,ds,
\qquad H_\lambda=v-\lambda J_\lambda.
\]

The [energy note](theta_schur_residual_energy_20261109.md) proves the
convergent nonnegative gamma energy

\[
E_\gamma(v)=\sum_{k\ge0}
\left[|J_{\lambda_k}(0)|^2+
\frac2{\lambda_k}\|H_{\lambda_k}\|_2^2\right].
\]

Write \(C_v(\ell)=\int_0^\infty v(t+\ell)\overline{v(t)}dt\), and

\[
M(\ell)=2(e^{\ell/2}-1)
-\sum_{n\le e^\ell}\frac{\Lambda(n)}{\sqrt n},\qquad
c_0=\frac{\log\pi-\psi(5/4)}2.
\]

Keeping the pole and prime cancellation together gives the exact identity

\[
\boxed{Q_L(v)=E_\gamma(v)-2c_0\|v\|_2^2
-2\Re\int_0^\infty M(\ell)C_v'(\ell)\,d\ell.}
\]

All boundary terms and convergence conditions are proved. The three-node
theorem now shows \(Q_L(v)>0\) for every nonzero combination with at most
three distinct rates. The arbitrary-order residual target is

\[
\boxed{2c_0\|v\|_2^2+
2\Re\int_0^\infty M(\ell)C_v'(\ell)\,d\ell
\le E_\gamma(v).}
\]

Its uniform validity on all successive residuals remains open. The
compensated count is not pointwise positive: an exact integer certificate
proves \(M(\log24137)<-35889296433/10^{12}<0\). The residual constraints
must therefore do real work in any domination proof.

## 5. The next kernel pair and the remaining induction

For a second anchor b, put \(q=R_a(b)>0\). After canceling its removable
factors, the second reduction is

\[
R_{a,b}(z)=z\frac{U_{a,b}(z)}{V_{a,b}(z)},
\quad
U_{a,b}=\frac{A_a-bqB_a}{z^2-b^2},
\quad
V_{a,b}=\frac{qz^2B_a-bA_a}{z^2-b^2}.
\]

Its exact time-domain sources before the Green inversion are
\(n_a-bq b_a\) and \(4q b_a''-b n_a\). The entire quotients satisfy
\(qB_a=V_{a,b}+bU_{a,b}\) and \(A_a=z^2U_{a,b}+bV_{a,b}\).
The three-node theorem supplies the positive real-axis pivots at this
stage; it does not establish positive kernels or a preserved class for
these next sources. Proving a property of this pair that controls the
fourth stage and repeats is the direct continuation target.

The [auxiliary obstruction](theta_third_order_obstruction_20261109.md)
shows why a generic scalar-concavity induction cannot suffice:
\(e^{-u^2}(2+\cosh u)\) has the initial concavity and positive Green
properties, but fails a three-node Pick test. The failure is proved
analytically by Taylor coefficients and a confluent determinant; a small
quartic damping preserves it with stronger decay. It concerns an
auxiliary kernel only.

## Reading and verification

- [Curvature theorem](theta_three_node_curvature_20261109.md): exact
  three-node criterion, sector sign, bounded-interval estimate, and theta
  covariance consequence.
- [Large-argument proof](theta_third_pick_large_x_20261109.md): explicit
  half-line estimates completing the theorem.
- [Positive kernels](theta_schur_positive_kernels_20261109.md): first
  cancellation and exact kernel identities.
- [Residual energy](theta_schur_residual_energy_20261109.md): square
  factorization, compensated count, and remaining all-order inequality.
- [Audit](AUDIT.md) and [sources](SOURCES.md): scope, external inputs,
  cross-review, and reproducibility.

```bash
python -m pip install -r requirements.txt
python theta_schur_checks_20261109.py
```

The script checks exact symbolic identities and rational proof margins,
and runs the integer compensated-count certificate. It does not rerun
the published finite-height zero verification. Repository CI checks
compatibility; the mathematical proof and its limits are in the notes.
