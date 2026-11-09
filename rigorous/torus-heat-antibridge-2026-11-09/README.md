# Twin-ladder heat flow: freezing, the opposite bridge, and a usable certificate

Research continuation, 9 November 2026. This package preserves the torus heat-flow
calculation and follows the proposed freezing argument through its next analytic
step. **No new numerical bound on the de Bruijn–Newman constant is established.**
The package contains mathematical derivations for review, exact algebraic
certificates, and separately labeled numerical diagnostics.

## Main findings

1. **The geometry gives an exact coordinate description of the heat flow.**
   The essential punctures explain apparent slowing at infinity. The opposite
   reciprocal fixed points lie over the positive value at spectral coordinate
   zero; they are not zero-collision sites. The distinct reflection zero has a
   useful negative contribution to the zero-height derivative, already used in
   Polymath's Proposition 3.3.
2. **Every fixed finite packet and unrestricted positivity have different
   quantifiers.** The same-end sech limit and the vanishing cross-end coupling
   imply eventual positivity for each fixed packet. They do not give a radius
   that works for every packet size and spacing.
3. **The leading finite-radius approximation actually fails that stronger
   requirement.** For
   $M(p,q)=(p+q)/(e^p+e^q)$, an explicit three-point packet above $p=1$
   has a negative quadratic form. An exact Taylor-coefficient calculation
   gives negative directions in every positive open interval, arbitrarily
   far into the tail. Entrywise small errors cannot be discarded in these
   nearly cancelling directions.
4. **For the actual theta kernel, local all-order positivity is the full
   threshold problem.** Applying Neeb–Ólafsson's analytic-kernel propagation
   theorem, with the hypotheses verified here, gives for every nonempty real
   open interval $I$:

   $$
   K_\tau|_{I\times I}\succeq0
   \iff K_\tau\succeq0
   \iff H_\tau\text{ has only real zeros}
   \iff\tau\ge\Lambda.
   $$

   At time zero, unrestricted tail positivity is already RH-equivalent.
   This is a reduction of the missing estimate, not a proof of it.
5. **A practical next certificate can use nearby zero clusters.** A contour
   integral measures their combined contribution without resolving each zero
   separately. Explicit approximation, derivative, and quadrature errors
   produce a conditional improved strip-contraction bound.

## What the numerical diagnostics say

With $L=5/4$, $d=\log(11/9)$, points
$(L-d,L,L+d)$, and coefficients $(50,-99,50)$, the leading-model value is
strictly negative by an exact rational certificate. For the actual kernel use
the positive diagonal rescaling
$F_\tau(u,v)=\pi K_\tau(u,v)/(\kappa_\tau(u)\kappa_\tau(v))$, with
$\alpha=1$.

| Same finite three-point packet | Quadratic form |
|---|---:|
| Leading model $c^TMc$ | approximately $-0.081205100735$, sign proved exactly |
| Actual scaled theta flux $c^TF_0c$ | approximately $+0.783982291587$, numerical |

The selected negative Taylor directions of orders 3, 6, 16, and 42 are also
positive in the actual-kernel diagnostics. These checks retain a finite theta
sum and use arbitrary-precision quadrature. Agreement under precision and
truncation changes is recorded, but no interval enclosure is claimed. A
positive selected quadratic form does not prove positivity of its whole matrix.

The result directs further work toward controlling the full theta correction
together with the leading term. The leading term alone cannot supply the
required unrestricted positivity theorem.

## How the collective certificate would improve a bound

For a globally highest zero $z=x+iy$, let $U=y^2$. Retain its conjugate
separately and measure a disjoint collection of nearby zero clusters by

$$
S_j(z)=\frac1{2\pi i}\oint_{C_j}
\frac{H_\tau'(w)}{H_\tau(w)}\frac{dw}{z-w},
\qquad \mathcal A(z)=-\Im\sum_jS_j(z).
$$

Then $U'\le-2-4y\mathcal A(z)$. If a certified initial strip has height
$\Delta$, a time-uniform tail exclusion contains the relevant global
envelope, and contour certificates prove $\mathcal A\ge\kappa y$ throughout
$\eta\le y\le\Delta$, then

$$
\Lambda\le\tau_0+
\frac1{4\kappa}\log\frac{1+2\kappa\Delta^2}{1+2\kappa\eta^2}
+\frac{\eta^2}{2}.
$$

The detailed note supplies an explicit error interface and a symmetric finite
theta backend. It also gives a cheaper zero-count-and-rectangle version.
The global strip, tail, and positive common margin have **not** been certified
in this package. Those are the inputs required before reporting a new number.

## Files and reading order

| File | Purpose |
|---|---|
| [torus_heat_flow.md](torus_heat_flow.md) | Exact torus flow, finite anchors, quartet term, time deformation |
| [analytic_continuation.md](analytic_continuation.md) | Local-to-global reduction, exact obstruction, fixed-packet limits, jet identity |
| [numerics.md](numerics.md) | Numerical method, selected theta corrections, evidence limits |
| [collective_certificate.md](collective_certificate.md) | Contour certificate, error bounds, slab theorem, implementable backend |
| [verify_freezing_obstruction.py](verify_freezing_obstruction.py) | Exact rational three-point and Taylor-coefficient certificates |
| [verify_collective_certificate.py](verify_collective_certificate.py) | Exact symbolic normalization, contraction, and error-identity checks |
| [numerics.py](numerics.py) | Reproducible finite-point and Taylor-functional diagnostics |
| [validation.json](validation.json) | Commands, outcomes, scope, and file hashes |

The `*_validation.json` files contain exact-check outputs. The
`numerics_*results.json`, `numerics_L2_N6.json`, and
`numerics_independent_replay.json` files preserve the diagnostic outputs.

## Reproduction

Python 3.12 was used. Install the two dependencies in an isolated environment:

```sh
python -m pip install -r requirements.txt
python verify_freezing_obstruction.py
python verify_collective_certificate.py
python numerics.py --L 2 --N 6 --dps 60 --theta-terms 5
python numerics.py --finite-packet --dps 60 --theta-terms 5
```

The obstruction verifier uses only the Python standard library. The symbolic
verifier uses SymPy. The diagnostic script uses mpmath; higher Taylor orders
cost more time. The recorded independent replay of the order-six direction
agreed with the earlier higher-precision run.

## Provenance and conventions

This is a self-contained lane based on `main`, related to the separate draft
[PR #43](https://github.com/judegomila/mathexplorer/pull/43). Its prior theta and
torus definitions are pinned to commit
[`69d4049f`](https://github.com/judegomila/mathexplorer/tree/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08).
It does not depend on importing code from that unmerged branch.

All bounds here use standard Newman time $\tau$, with
$\partial_\tau H=-H_{zz}$. The centered-xi heat convention
$\partial_\theta X=X_{ww}$ has $\tau=4\theta$. The theta coordinate
$u$ is Mellin-dual to the spectral coordinate; its tails must not be
identified with the torus punctures without an exact additional dictionary.

Rodgers–Tao establish $\Lambda\ge0$. A smaller positive **upper** bound
would move toward RH; a strictly positive **lower** bound would refute RH.
Literature sources and the scope of each use appear in the individual notes.
No novelty claim relative to the full literature is made.
