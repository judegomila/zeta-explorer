# Eventual exterior control for the maximal positive Fourier head

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Derived analytic result, independently reviewed.** This concerns the actual prolate exterior amplitude, not a signed arithmetic edge estimate, evenized Gram, transition-head Weil reserve, or gamma-complement floor. The onset below is not effective. A separate receipt pins this note; the conditional ODE proof is independently recorded in `independent_review/extended_sonin_conditional/CONDITIONAL_SUPERCRITICAL_SONIN.md`.

## 1. Conventions and result

Let `c=2pi lambda²`, `k=2pi lambda`. The actual finite Fourier operator on `[-lambda,lambda]` has eigenfunctions `e_n`, eigenvalues `chi_n` and differential eigenvalues `nu_n`. Its concentration eigenvalues are `mu_n=|chi_n|²`; they decrease strictly with the full label n. Positive even modes have n divisible by 4.

For every fixed `rho>2log(3)/pi` with `rho<1`, there exists a finite, unspecified `lambda_0(rho)` such that every mode with `|chi_n|>=1/2` at `lambda>=lambda_0` satisfies

    (nu_n-c²)_+ <= 2c rho.                                      (1)

In particular, rho=3/4 is admissible. Consequently, on the positive signed threshold head, every constituent mode satisfies the exterior bound

    |e_n(t)| <= 4 |e_n(lambda)| / [pi |chi_n| sqrt(7) sqrt(t²-lambda²)]
                                                               (2)

for t>lambda and all sufficiently large lambda. This salvages a bounded-loss Sonin envelope even though the older premise `nu_n<c²` is false on some threshold modes.

## 2. Exact one-well Sonin lemma

The physical differential equation outside the endpoint is

    (P e')' +(k²t²-nu)e=0,  P=t²-lambda².

For `z=sqrt(P)e`, it becomes

    z''+Qz=0,
    Q=k²-Delta/P+lambda²/P²,  Delta=nu-c².                       (3)

If Delta<=0, Q is positive and decreasing, and the standard Sonin argument bounds `H=|z|²+|z'|²/Q` by its limit at infinity.

If `0<Delta<=2c rho`, Q has exactly one minimum, at `P=2lambda²/Delta`, with

    Q_min=k²-Delta²/(4lambda²)>=k²(1-rho²)>0.                    (4)

The exact identity is `H'=-Q'|z'|²/Q²`. Hence H increases up to that minimum and decreases afterwards. On the increasing-Q side,

    H'/H >= -Q'/Q.

Integration from any such t to infinity gives `H(t)<=H_infinity k²/Q(t)`, so everywhere

    H(t)<=H_infinity/(1-rho²).                                 (5)

The analytic Fourier extension obeys

    e_n(t)=chi_n^(-1) integral_(-lambda)^lambda e_n(s) exp(2pi i st) ds.

For even modes, endpoint integration by parts gives

    z(t)=e_n(lambda) sin(kt)/(pi chi_n)+O(1/t),
    z'(t)=k e_n(lambda) cos(kt)/(pi chi_n)+O(1/t).

Thus `H_infinity=|e_n(lambda)/(pi chi_n)|²`. Equations (4)-(5) prove

    |e_n(t)| <= |e_n(lambda)| / [pi |chi_n| sqrt(P) sqrt(1-rho²)]. (6)

The odd modes have a cosine endpoint phase and the same envelope; only even modes are needed here. Setting rho=3/4 gives (2). For the Fourier transform of the zero-extended input, `F(e_zero)=chi_n e_n`, the corresponding exterior bound has no chi denominator.

## 3. A width-only concentration argument

We deliberately do not use the incorrectly printed `O(log c)` absolute counting formula as if it were `o(log c)`.

[Karnik–Romberg–Davenport](https://arxiv.org/html/2006.00427), Lemma 2 and its Lemma 3 continuous limit, give

    mu_ceil(2c/pi) <= 1/2.                                     (7)

Their section 3.2 records the Landau–Widom fixed-epsilon transition-width theorem:

    #{n:epsilon<mu_n<1-epsilon}
       = [2/pi² log((1-epsilon)/epsilon)] log c +o(log c).       (8)

Let `m(c)=max{n:mu_n>=1/4}`. Every label from `ceil(2c/pi)` through m has concentration in `[1/4,1/2]`; at most one can equal 1/4. Therefore (7)-(8), at epsilon=1/4, imply

    m(c)<=2c/pi + [2log3/pi²+o(1)] log c.                      (9)

Alternatively take a fixed epsilon<1/4, then let epsilon tend to 1/4 after taking the limsup. This avoids relying on simplicity at the lower endpoint. Equation (9) counts all parity/sign classes, so it certainly bounds the positive even subset.

## 4. Exact elliptic action converts index width to differential width

[Bonami–Karoui](https://arxiv.org/html/1405.3676v2), Theorem 1, implies for n>=2 and nu_n>c²

    n < J(nu_n,c) < n+1,
    J(v,c)=(2/pi) integral_0^1 sqrt[(v-c²x²)/(1-x²)] dx.         (10)

The conversion is direct: write the elliptic modulus as `s=c/sqrt(v)` (the source's parameter q is s²). Their increasing function is `Psi(s)=s/E(s)`. Their bounds on its inverse give `pi n/2<sqrt(v)E(s)<pi(n+1)/2`.

For each FIXED delta>0,

    J(c²+delta c,c)-2c/pi
        =[delta/(2pi)] log c+O_delta(1).                       (11)

One elementary derivation is to put a=delta/c and

    I(a)=integral_0^1 sqrt[1+a/(1-x²)] dx.

Then `I'(a)=1/2 integral_0^1 [(1-x²)(1-x²+a)]^(-1/2) dx
           =1/4 log(1/a)+O(1)` as a decreases to zero. The latter follows by splitting near x=1, replacing `1-x²` by `2(1-x)` with bounded integral error, and integrating `1/sqrt[s(s+a)]`. Integrating from 0 to a yields `I(a)-1=(a/4)log(1/a)+O(a)`, which proves (11).

Write `A=2log3/pi²`. If some threshold mode had `nu_n>=c²+delta c` for infinitely many c with fixed `delta>2pi A`, monotonicity of J, (10), and (11) would force

    n+1 > 2c/pi+[delta/(2pi)]log c+O_delta(1),

contradicting (9). Hence

    limsup_(c->infinity) max_(|chi_n|>=1/2) (nu_n-c²)_+/(2c)
       <=pi A=2log3/pi<3/4.                                   (12)

This proves (1), including the uniformity over the whole moving threshold set. Fixed labels n<2 cause no issue: the constant trial function gives `nu_0<=c²/3`, while the odd trial function x gives `nu_1<=2+3c²/5<c²` for c²>5.

## 5. What this removes and what it does not

This removes the specific eventual obstruction that the maximal threshold head extends slightly above the old monotone-Sonin regime. In wave language, the exterior potential acquires one shallow well but stays uniformly above zero; its maximum envelope amplification remains bounded.

It does NOT bound signed sums of unequal dilations, supply cancellation in the complete Poisson–Mobius edge defect, control trace-to-bulk coupling, or turn per-mode bounds into a dimension-uniform operator estimate. The repo's collective low-prefix theorem assumes only O(log c) labels, whereas the maximal head has order c labels. That separate modal-count loss remains. No explicit lambda_0, small-lambda bridge, whole-Weil positivity, or RH assertion is made.
