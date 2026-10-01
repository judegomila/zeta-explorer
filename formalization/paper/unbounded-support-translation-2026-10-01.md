# Unbounded support: a fixed test, sign flips, and a growth bound

**The unbounded-support estimate is not proved.** This note replaces the next
window enlargement by an explicit scalar target at all separations. It derives
an RH-equivalent growth criterion, checks its arithmetic normalization, and
identifies a limitation of the scalar baseline used in our local certificates.
These derivations require independent mathematical review; there is no novelty
claim or formal verification. The full-space certified width remains **2**.

## 1. A smaller target than a positive matrix at every width

Use the Fourier transform `hhat(t)=integral h(x)exp(-itx)dx` and the pole-free
Weil form from the [all-support note](weil-all-support-attempt-2026-09-30.md).
Let `tau_R h(x)=h(x-R)`, and extend W to its Hermitian sesquilinear form.

We construct one fixed real even compact test h, supported in [-1/2,1/2],
with both pole moments zero. Set

\[
 d=W(h),\qquad k(R)=W(h,\tau_Rh),\qquad
 q_\pm(R)=W(h\pm\tau_Rh)=2d\pm2k(R).
 \tag{1}
\]

The real-valued k contains the full interaction, not an absolute-value bound
on separate prime contributions. For R>1 the two copies have disjoint support
and squared norm `2||h||^2`; their combined support width is R+1.

For the particular h below, the following conditions are equivalent:

1. RH.
2. Both q_+(R) and q_-(R) are nonnegative for every R>1.
3. k(R) is bounded for R>1.
4. For every epsilon>0 there is a finite C_epsilon such that
   `|k(R)| <= C_epsilon exp(epsilon R)` for every R>1.
5. The negative parts of both q_+(R) and q_-(R) satisfy such a subexponential
   bound, with constants allowed to depend on epsilon.

Thus a polynomial growth bound, or even any subexponential growth bound in
this precise sense, would finish this route. **None is proved here.** This is
an equivalent reformulation with fewer test shapes, not a weakened version of RH.

A consequence for the original formulation is worth separating: a uniform
lower bound `W(f)>=-C||f||^2` on all smooth compact pole-free f would already
imply RH. More generally, it would suffice to prove

\[
 W(f)\ge-C_\epsilon e^{\epsilon B}\|f\|_2^2
 \quad\text{for every }\epsilon>0,\ B>0,
 \ \operatorname{supp}f\subset(-B/2,B/2).
 \tag{2}
\]

Indeed, apply it to both signs in (1), recentered by translation. It bounds
`|k(R)|` by `d+C_epsilon exp(epsilon(R+1))||h||^2`. There is no requirement
of a uniform positive gap, or even of a nonnegative lower bound in (2).
The quantifiers and the uniformity in support remain essential.

## 2. The fixed filter has no off-axis blind spots

Let `u(x)=8*1_[-1/16,1/16](x)`, let `g=u^{*8}`, and put

\[
 h=Qg,\qquad Q=-\frac{d^2}{dx^2}+\frac14.
\]

The eight-fold convolution g is a compact C6 spline and h is C4. Its bilateral
Laplace transform is explicit:

\[
 H(z)=\int h(x)e^{zx}\,dx
 =\left(\frac14-z^2\right)
 \left(\frac{\sinh(z/16)}{z/16}\right)^8.\tag{3}
\]

The quotient is interpreted as one at zero. Integration by parts gives the
factor `1/4-z^2`. Thus `H(1/2)=H(-1/2)=0`, and the only other zeros of H are
on the imaginary axis. In particular

\[
 H(z)\ne0\qquad(0<\Re z<1/2).\tag{4}
\]

The limited smoothness is not a loophole in the test space. Mollify g by
smooth compact approximate identities and apply Q. The resulting smooth
pole-free tests converge to h in H1 with supports in arbitrarily small
enlargements of its support. On a fixed compact support the archimedean form
is continuous in H1, since its symbol is O(log(2+|t|)), and each of the finitely
many prime correlations is continuous in L2. This also handles each fixed
translated pair. Consequently the classical smooth Weil criterion extends
to these particular spline tests, and a hypothesized estimate (2) passes to
them by the same approximation.

For `C(v)=integral h(x+v)h(x)dx`, C is even, supported in [-1,1], and

\[
 \int C(v)e^{zv}\,dv=H(z)H(-z)=H(z)^2.\tag{5}
\]

This is an analytic square, **not** an absolute square at complex z. An
explicit rational piecewise-polynomial formula is

\[
 C(v)=8^{16}\sum_{j=0}^{16}(-1)^j\binom{16}{j}
 \left[\frac{(v+1-j/8)_+^{11}}{11!}
 -\frac{(v+1-j/8)_+^{13}}{2\,13!}
 +\frac{(v+1-j/8)_+^{15}}{16\,15!}\right].\tag{6}
\]

The exact normalization is
`||h||^2=C(0)=233983221755021/13621608000`.

## 3. The interaction computed from primes alone

Write `c_n=Lambda(n)/sqrt(n)` and `lambda_j=2j+1/2`. For R>1,

\[
 \boxed{k(R)=-\sum_{j\ge1}H(\lambda_j)^2e^{-\lambda_jR}
 -\sum_{e^{R-1}<n<e^{R+1}}\frac{\Lambda(n)}{\sqrt n}
 C(R-\log n).}\tag{7}
\]

The second sum includes every prime power, with `Lambda(p^m)=log p`.
The first series converges absolutely, and its size decays exponentially.
There is no zero list in this definition or its computation.

To derive the archimedean term, the digamma integral
[DLMF 5.9.16](https://dlmf.nist.gov/5.9.E16) gives the inverse Fourier kernel,
away from the origin,

\[
 a^\vee(x)=-\frac{e^{-|x|/2}}{1-e^{-2|x|}}
 =-\sum_{j\ge0}e^{-(2j+1/2)|x|}.
\]

Because the two supports are separated, the contact term at the origin does
not contribute. Integrating against C gives the series in (7); the j=0 term
vanishes exactly by `H(1/2)=0`. The two signed translation terms from a prime
are `-c_n[C(R-log n)+C(R+log n)]`; the second is zero for R>1.

## 4. Why subexponential growth would prove RH

For Re z>1/2, take the Laplace transform of (7) on R>=1. Absolute convergence
justifies interchanging the prime sum and integral. The exact result is

\[
 \int_1^\infty k(R)e^{-zR}\,dR
 =H(z)^2\frac{\zeta'}{\zeta}(z+1/2)+E(z)+A(z),\tag{8}
\]

where

\[
 E(z)=\sum_{\log n<2}c_ne^{-z\log n}
       \int_{-1}^{1-\log n}C(v)e^{-zv}\,dv,\tag{9}
\]

\[
 A(z)=-\sum_{j\ge1}
 H(\lambda_j)^2\frac{e^{-(z+\lambda_j)}}{z+\lambda_j}.\tag{10}
\]

E is entire and includes n=2,3,4,5,7. It cannot be omitted: it accounts for
starting the R integral at 1. The logarithmic derivative identity used in
(8) is [DLMF 27.4.12](https://dlmf.nist.gov/27.4.E12), in its absolute-convergence
half-plane. A is holomorphic in Re z>0: from (3),
`H(lambda)^2 <= 8^16 exp(lambda)/lambda^12` for lambda>=5/2, so (10) converges
locally uniformly there.

If condition 4 holds, the left side of (8) is holomorphic throughout Re z>0.
The pole of zeta at s=1 gives a removable singularity on the right at z=1/2,
because H has a zero there. But a nontrivial zero rho with Re rho>1/2 would
give a pole at `z=rho-1/2`: the residue is its positive multiplicity times
`H(rho-1/2)^2`, which is nonzero by (4). Neither E nor A can cancel that pole.
The identity theorem and meromorphic continuation therefore exclude every
such rho. The functional equation then gives RH.

Conversely, RH implies positivity of the Weil form on smooth pole-free tests
by the classical criterion; the approximation above gives q_±(R)>=0, hence
`|k(R)|<=d`. Thus 1 implies 2, then 3, then 4. Equation (1) makes condition 5
equivalent to 4. This proves the stated equivalence. It does **not** prove
the required growth condition for the actual primes.

The classical criterion is described in
[Connes–Consani, Appendix C, Proposition C.1](https://arxiv.org/pdf/2006.13771).
The zeta zero symmetries are recorded in [DLMF 25.10](https://dlmf.nist.gov/25.10).

## 5. Attempts at the actual bound

### Exact centering succeeds; the remaining estimate does not

Put `Delta(x)=psi(exp x)-exp x` and `Z(x)=exp(-x/2)Delta(x)`. The continuum
part of the prime sum vanishes exactly:

\[
 \int_{R-1}^{R+1} e^{x/2}C(R-x)\,dx=e^{R/2}H(1/2)^2=0.
\]

Stieltjes integration by parts, with zero endpoint terms, therefore gives

\[
 \sum_n c_nC(R-\log n)
 =\int_{-1}^1Z(R-v)J(v)\,dv,\qquad J(v)=\tfrac12C(v)+C'(v).\tag{11}
\]

The missing bound is now a fixed signed convolution of the normalized prime
error, with no support-dependent test shape. Equations (7) and (11) reduce
the task to proving this convolution subexponential. They do not assign it
a sign. The exact checker finds `J(0)>0` and `J(1/8)<0`, ruling out a positive-
weight or monotonicity shortcut.

Three attempted estimates stop short:

| Attempt | What it gives | Why it does not finish |
|---|---|---|
| Take absolute values of individual prime terms | A bound of exponential rate 1/2 in R | Discards precisely the required cancellation |
| Insert an absolute PNT error majorant `x exp(-c sqrt(log x))` into (11) | `O(exp(R/2-c' sqrt R))` | Still has exponential rate 1/2, not rate zero |
| Use an RH-strength prime-error bound | Subexponential growth, as required | This imports an RH-equivalent hypothesis |

The first failure is structural for that bound: PNT and partial summation give

\[
 \sum_n c_n|C(R-\log n)|\sim
 e^{R/2}\int_{-1}^1e^{-v/2}|C(v)|\,dv,
\]

with a strictly positive constant. More accurate evaluation of this absolute
majorant cannot make it subexponential. The statement concerns that estimate,
not all possible methods. The standard prime-error equivalence is
[DLMF 25.16.4](https://dlmf.nist.gov/25.16.E4).

### Exact finite blocks still need a different global baseline

Let T_B retain all prime translations except a fixed finite set, on L2 of a
width-B interval. The scalar-baseline strategy requires `d_B I-T_B` positive.
The normalized constant function gives the explicit lower bound

\[
 \sup\operatorname{spec}T_B\ge r_B
 =2\sum_{\substack{\log n<B\\n\ \mathrm{retained}}}
 \frac{\Lambda(n)}{\sqrt n}\left(1-\frac{\log n}{B}\right)
 \sim\frac{8e^{B/2}}B.\tag{12}
\]

The asymptotic follows from PNT and the elementary integral
`integral_1^X x^(-1/2) log(X/x) dx = 4 sqrt(X)-2 log(X)-4`.
Deleting a fixed finite set changes r_B by O(1).

Crucially, imposing the two pole conditions does not remove this supremum
lower bound. Approximate the constant function in L2 by a smooth compact phi.
For arbitrarily large t with all the finitely many phases `exp(it log n)`
arbitrarily close to 1, put

\[
 f_t=t^{-2}Q(e^{itx}\phi)
 =e^{itx}\left(\phi-\frac{2i}{t}\phi'+\frac{Q\phi}{t^2}\right).
\]

Both pole moments vanish exactly, while `||f_t|| -> ||phi||` and its
translation Rayleigh quotient tends to that of phi. Such t exist by simultaneous
recurrence on a finite torus. Letting phi approach the normalized constant
proves the same lower bound on pole-free tests. Finite moment penalties vanish
on these tests and do not repair it.

Also, f_t tends weakly to zero by the Riemann–Lebesgue lemma. Every fixed
compact correction therefore has a quadratic form tending to zero on this
sequence. Thus adding a finite-rank correction, or retaining the exact
compact low-frequency operator, cannot make `d_B I-T_B` positive when
`d_B<r_B`. Merely increasing the finite basis dimension does not remove this
limitation of a constant tail floor.

For completeness, the recurrence follows by applying the pigeonhole principle
to integer multiples of the finite vector `(log n)/(2 pi)` in increasingly
fine partitions of the torus. The resulting return integers are unbounded,
unless a bounded subsequence yields an exact common period; in that case
arbitrarily large multiples of the period give exact returns instead.

In our current split, the old-symbol tail floor grows only as `log T+O(1)`.
Thus demanding a positive scalar baseline for all retained interactions still
requires, at least asymptotically,

\[
 \log T_B\ge(8+o(1))e^{B/2}/B.
\]

Exact four-node and eight-node inverses improve finite calculations, but this
particular global strategy still incurs a doubly exponential cutoff. This is
not a complexity lower bound for RH. It indicates why a successful global
argument must retain the relation between archimedean frequency cost and
arithmetic phase cancellation, or directly prove a bound such as (11).

## 6. What the computation certifies

The script `scripts/audit-unbounded-translation.py` uses 320-bit Arb arithmetic
and exact rational spline coefficients. Its receipt is
`research-inputs/rh-positivity-audit/unbounded-translation.json`.

It encloses `d/||h||^2` between 0.755870399797 and 0.755870399798. The diagonal
uses half-unit frequency panels through T=256, 48-point Gauss quadrature,
an analytic quadrature bound and the entire frequency tail. The latter is
less than `6.664e-13 ||h||^2`.

| Separation R | Pair support width | Contributing prime powers | Lower bound for the two-dimensional minimum Rayleigh quotient |
|---:|---:|---:|---:|
| 2 | 3 | 11 | >0.17995 |
| 4 | 5 | 35 | >0.30135 |
| 6 | 7 | 162 | >0.38556 |
| 8 | 9 | 859 | >0.16951 |
| 10 | 11 | 5,071 | >0.05453 |
| 12 | 13 | 31,169 | >0.10158 |
| 14 | 15 | 197,912 | >0.29364 |

These are **seven two-dimensional subspaces**, not positivity on all tests of
width 15, not all intermediate separations, and not evidence certifying the
growth condition at infinity. The full-space width-2 certificate is unchanged.

Independent checks compare the spline norm and a correlation with direct
polynomial integration, verify (5), compare the archimedean cross kernel with
frequency quadrature at R=2,4, and compare the prime part of (8) with an
independent Arb zeta logarithmic derivative. The latter includes a certified
Dirichlet-series tail. Omitting E is decisively rejected.
Equation (11) is also integrated independently at R=2, splitting at every
prime-power jump and spline knot; the residual encloses zero within 10^-50.

For an off-axis control, `k_delta(R)=cosh(delta R)cos(R)` has Laplace poles at
`+/-delta +/- i`; at R=2 pi m its magnitude grows exponentially and exceeds a
unit diagonal. The on-axis control `cos(R)` remains bounded. This checks the
distinction the proposed criterion must detect; it is not a model of actual
zeta zeros.

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-unbounded-translation.py --output research-inputs/rh-positivity-audit/unbounded-translation.json
npm run audit:rh
```

The next proof obligation is (11)'s subexponential bound, with constants
independent of R. A finite sample, a fitted oscillation, or bounds with a fixed
positive exponential rate do not satisfy it. No further window enlargement
has been substituted for that obligation in this follow-up.
