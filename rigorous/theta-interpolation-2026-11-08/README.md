# Build the exact xi response through positive interpolation

Research continuation, **8 November 2026**, following
[PR #46](https://github.com/judegomila/mathexplorer/pull/46).

**Proposed route:** construct finite passive ladders that match exact xi
data, prove their scalar coefficients stay positive at every stage, and
take an analytic limit. This avoids guessing an infinite Hamiltonian from
its leading asymptotic. The first two stages are proved positive for every
pair of positive real nodes. The all-stage induction remains open and is
RH-strength.

## The construction and the exact point where it remains open

Write `F(z)=xi(1/2+z)` and `L=F'/F`. A function is positive-real here if
it is analytic on `Re z>0` and has nonnegative real part there.

For positive `a,p`, define a ladder step by

\[
\boxed{\mathcal T_{a,p}[R](z)
=p\frac{zR(z)+a}{z+aR(z)}.}
\]

It maps every positive-real R to a positive-real function. The proof is
the explicit energy identity

\[
\boxed{
\Re\mathcal T_{a,p}[R](z)
=p\frac{(|z|^2+a^2)\Re R(z)
+a(1+|R(z)|^2)\Re z}{|z+aR(z)|^2}>0.
}
\]

The denominator is nonzero because its real part is positive. The step
also interpolates `T[a,p][R](a)=p`, independently of the terminal R.

Choose distinct real nodes `a_j` dense in `[1,2]`, beginning with 1. From
the exact xi target define

\[
L_0=L,\qquad p_j=L_{j-1}(a_j),\qquad
L_j(z)=\frac{zL_{j-1}(z)-a_jp_j}
{zp_j-a_jL_{j-1}(z)}.
\]

If the first N pivots are finite and positive, apply the inverse steps
backward from the terminal function `R(z)=z`. This constructs a finite
odd, real, lossless rational response matching the first N exact xi
values. Degenerate cases require the appropriate termination or
semidefinite treatment.

If positive interpolants exist for every N, their common value at 1
normalizes a bounded family of Cayley transforms. Montel compactness and
the dense exact interpolation data then identify the limit with L on
the entire right half-plane. Its analyticity excludes off-axis xi zeros.
This closure argument is proved in the
[interpolation note](theta_positive_interpolation_20261108.md).

**The missing theorem is positivity of every subsequent pivot.** The
recurrence preserves positivity when supplied positive coefficients; it
does not establish the signs of the exact xi coefficients by itself.

## An analytic base theorem for the actual theta kernel

The known strict concavity of `log kappa(sqrt(x))` makes

\[
q(u)=-\frac{\kappa'(u)}{u\kappa(u)}
\]

strictly increasing. A normalized theta integral gives the exact covariance
identity

\[
\frac d{dw}\frac{L(w)}w
=-\frac{\operatorname{Cov}_{\nu_{w/2}}
(q(u),u\coth(wu/2))}{8(\mathbb E_{\nu_{w/2}}q)^2}<0,
\]

where `d nu_theta` is proportional to `u kappa(u) sinh(theta u) du` on
the positive half-line. Together with the ordinary tilted variance
identity this proves

\[
\boxed{0<wL'(w)<L(w)\qquad(w>0).}
\]

Consequently every two-node real Pick matrix

\[
P_{ij}=\frac{L(a_i)+L(a_j)}{a_i+a_j}
\]

is strictly positive definite. This is a theorem over a continuum of
node choices, not a finite numerical certificate. It proves the first
two ladder pivots are positive.

For any `x>y>0`, `A=L(x)`, `B=L(y)`, an explicit positive oscillator fits
both exact values:

\[
L_{x,y}(z)=\frac{Cz}{z^2+\tau^2},\quad
\tau^2=\frac{xy(xA-yB)}{xB-yA}>0,\quad
C=\frac{AB(x^2-y^2)}{xB-yA}>0.
\]

Its frequency is an auxiliary model parameter, not a claimed xi zero.
The fitted oscillator alone does not have xi's full spectral response.

## The full arithmetic is already available

Suzuki's explicit screw function `Psi` is built from gamma terms and the
prime-power ramps `-Lambda(n)/sqrt(n) (t-log n)_+`. Its published transform
is exactly

\[
\int_0^\infty\Psi(t)e^{-pt}\,dt=\frac{L(p)}{p^2},
\qquad\Re p>1/2.
\]

For `K(t,u)=Psi(t)+Psi(u)-Psi(|t-u|)`, we derive

\[
\boxed{
\frac{L(p)+\overline{L(q)}}{p+\bar q}
=\iint K(t,u)[p e^{-pt}]\overline{[q e^{-qu}]}\,dt\,du.
}
\]

This is an unconditional exact identification with the desired Pick
kernel. It does not assume K is positive. The
[arithmetic-to-Pick note](theta_exact_pick_bridge_20261108.md) also shows
that the next Schur defect is exactly the K-energy of an explicit
residual exponential combination:

\[
\Delta_N(x)=\frac{L(x)}x-v(x)^*P_N^{-1}v(x)
=\mathfrak b(r_x,r_x).
\]

This fixes a concrete target for the next analytic work: derive a
nonnegative representation of these residual energies, using the actual
theta/prime structure, uniformly in N. No finite-block congruence with
the older theta derivative matrix is assumed.

## What the accompanying audits rule out

| Proposed shortcut | Exact finding |
|---|---|
| Add a small positive prime correction to a gamma model | The exact gamma part has a passive infinite-state realization, but the arithmetic part cancels all of its boundary dissipation. It is neither an additive passive response nor a bounded relative perturbation. |
| Add prime powers one at a time as positive updates | Each new prime hinge is indefinite. Its integrated kernel norm is O(delta squared), but its differentiated delay operator has nonvanishing norm immediately after activation. |
| Shift a known positive realization inward | The exact Pick-kernel multiplier for inward shifting is itself indefinite. |
| Repeat the same scalar concavity argument automatically | The first Schur reduction has signed transformed theta kernels. A certified auxiliary example passes the same two-node input but fails a four-node Pick test. |

Proofs: [gamma passivity](theta_archimedean_passivity_20261108.md),
[prime arrivals](theta_prime_accelerant_20261108.md), and
[interpolation](theta_positive_interpolation_20261108.md).

The latest Suzuki spectral-convergence preprint, arXiv:2610.32704, assumes
RH in its principal theorems. It does not supply the unconditional
positivity needed here. The older exact screw-function representation is
being used with explicit attribution, not presented as a new criterion.

## Certified limitation of the generic induction input

For the earlier auxiliary kernel `exp(-u^2)(3/2+cosh u)`, whose ordinary
and squared-variable log concavity were established in PR #45, the exact
logarithmic derivative is

\[
L_{\rm aux}(w)=\frac w8+
\frac{e^{1/4}\sinh(w/4)}{4(3/2+e^{1/4}\cosh(w/4))}.
\]

At nodes 1,2,3,4, a rational interval calculation proves that the first
three LDL pivots of its Pick matrix are positive and the fourth is
negative. Its determinant lies in

\[
[-5.47525270974382624931523,\,
 -5.47525270974382624931522]\,10^{-19}.
\]

The certificate bounds `exp(1/4)` by its degree-24 rational Taylor sum and
a geometric remainder, then uses exact Fraction interval arithmetic.
It demonstrates why the scalar concavity input does not establish an
all-orders interpolation theorem for general kernels. It is not a
negative direction for the actual theta kernel.

## Verification and remaining work

```bash
python -m pip install -r requirements.txt
python theta_interpolation_checks_20261108.py
```

The script checks the symbolic identities, certifies the auxiliary
four-node obstruction with exact rational intervals, and independently
checks ten normalizations against the completed xi definition. The latter
are ordinary high-precision diagnostics, separately labeled in the replay.

The new construction reduces the realization question to an exact
positivity induction. The completed work proves its first nontrivial
stage and supplies the arithmetic residual to attack. It does not prove
all pivot signs, global theta energy positivity, or RH.
