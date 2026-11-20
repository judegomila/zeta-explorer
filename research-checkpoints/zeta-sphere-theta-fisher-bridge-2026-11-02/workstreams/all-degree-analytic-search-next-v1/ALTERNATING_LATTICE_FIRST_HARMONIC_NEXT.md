# The first harmonic: minimum modulus versus relative decay

## Scope and outcome

`ALTERNATING_LATTICE_SMALL_SCALE_NEXT.md` gives the sufficient absolute
lower bound

\[
 F(t)\geq C_\epsilon t^{4+\epsilon}e^{-3\pi t/2}               \tag{1}
\]

for the first Xi--Laguerre density

\[
 F(t)=\Xi'(t)^2-\Xi(t)\Xi''(t).                                \tag{2}
\]

This note tests whether (1) is accessible from the completed-zeta formula.
The result is a route classification, not a proof of (1).

1. After removing the completed gamma factor, (1) is a uniform
   minimum-modulus bound of size `exp(-pi t)` for a Hardy-`Z` Laguerre
   expression.  The gamma factor supplies no sign.
2. The bound would force every sufficiently high critical-line zero to be
   simple, give an individual lower bound for `abs(zeta'(rho))`, impose an
   exponentially small lower bound on consecutive critical-line gaps, and
   exclude zeros of `F` from an exponentially thin tube about the real axis.
   These are necessary consequences, not known inputs.
3. The functional equation, canonical product, convexity estimates, and
   averaged derivative moments do not provide this pointwise minimum.  Any
   fixed algebraic-order asymptotic has an error much larger than the required
   normalized margin.
4. Absolute lower control is not necessary for small-spacing dominance.  A
   one-sided **relative** logarithmic-decay estimate for the actual `F` implies
   the exact harmonic condition even when `F` is arbitrarily small.

The appropriate continuation is therefore a theta-specific reverse-doubling
or one-sided log-slope theorem for the assembled spectral density, not a claim
that the completed gamma envelope itself gives (1).  Positivity of `F` remains
part of that relative target and is still the open first Laguerre problem.

## 1. Exact Hardy normalization

Choose the standard Hardy phase so that `Z(t)` is real on the real axis and
absorb the harmless conventional sign into `Z`.  Then

\[
 \Xi(t)=A(t)Z(t),
 \qquad
 A(t)={1\over2}(t^2+1/4)\pi^{-1/4}
       \left|\Gamma\!\left({1\over4}+{it\over2}\right)\right|. \tag{3}
\]

Put `ell=log A`.  Direct differentiation, with no use of a zero hypothesis,
gives

\[
 \boxed{
 {F(t)\over A(t)^2}
 =Z'(t)^2-Z(t)Z''(t)+\kappa(t)Z(t)^2,}
 \qquad \kappa(t)=-\ell''(t).                                  \tag{4}
\]

In terms of the trigamma function `psi_1`,

\[
 \kappa(t)=
 {2(t^2-1/4)\over(t^2+1/4)^2}
 +{1\over4}\operatorname {Re}
   \psi_1\!\left({1\over4}+{it\over2}\right).                 \tag{5}
\]

Stirling's expansion yields

\[
 \begin{aligned}
 A(t)&=(\pi/2)^{1/4}t^{7/4}e^{-\pi t/4}
       \{1+O(t^{-2})\},\\
 \ell'(t)&=-{\pi\over4}+{7\over4t}+O(t^{-3}),\\
 \kappa(t)&={7\over4t^2}+O(t^{-4}).
 \end{aligned}                                                   \tag{6}
\]

Define the normalized oscillatory bracket

\[
 \mathcal L_Z(t)=Z'(t)^2-Z(t)Z''(t)+\kappa(t)Z(t)^2.             \tag{7}
\]

Equations (1), (4), and (6) show that (1) is equivalent, up to effective
positive constants and a change of the threshold, to

\[
 \boxed{
 \mathcal L_Z(t)
 \geq c_\epsilon t^{1/2+\epsilon}e^{-\pi t}
 \qquad(t\geq T_\epsilon).}                                    \tag{8}
\]

The eventually positive gamma-curvature term in (7) is only
`O(Z(t)^2/t^2)` and vanishes at every critical-line zero.  Thus the extra
exponential separation between the first and third harmonics does not become
a free positive margin after normalization; it becomes the minimum-modulus
requirement (8).

## 2. What the absolute lower bound would force at zeros

Suppose (1) holds for some fixed `epsilon>0` and all sufficiently large real
`t`.  Let `gamma` be a real zero of `Xi`, equivalently a critical-line zero of
zeta.  If its multiplicity is `m` and

\[
 \Xi(t)=(t-\gamma)^m h(t),\qquad h(\gamma)\ne0,
\]

then the exact local expansion is

\[
 F(t)=m h(\gamma)^2(t-\gamma)^{2m-2}
       +O((t-\gamma)^{2m-1}).                                  \tag{9}
\]

Consequently (1) forces every sufficiently high critical-line zero to be
simple.  At a simple zero,

\[
 F(\gamma)=\Xi'(\gamma)^2
           =A(\gamma)^2
             \left|\zeta'\!\left({1\over2}+i\gamma\right)\right|^2. \tag{10}
\]

Using (6), (1) therefore implies the individual derivative bound

\[
 \boxed{
 \left|\zeta'\!\left({1\over2}+i\gamma\right)\right|
 \geq c_\epsilon
 \gamma^{1/4+\epsilon/2}e^{-\pi\gamma/2}.}                      \tag{11}
\]

The exponential in (11) is extremely weak compared with probabilistic
predictions, but it is uniform over every high critical-line zero and in
particular excludes multiple zeros.  Known moment results do not supply such
an individual statement.

There is also a zero-spacing consequence.  Let `gamma_1<gamma_2` be
consecutive real zeros of `Xi`, put `d=gamma_2-gamma_1`, and suppose
`gamma_1` is large.  When `d<=1`, Rolle's theorem gives a `c` between them
with `Xi'(c)=0`.  The interpolation remainder for a function vanishing at
both endpoints gives

\[
 |\Xi(c)|\leq {d^2\over8}
   \sup_{\gamma_1\leq u\leq\gamma_2}|\Xi''(u)|.                 \tag{12}
\]

The real-axis completed-zeta bound, with any `eta>0`, is

\[
 \sup_{\gamma_1\leq u\leq\gamma_2}|\Xi''(u)|
 \leq C_\eta\gamma_1^{2+\eta}e^{-\pi\gamma_1/4}.               \tag{13}
\]

Since `F(c)=-Xi(c)Xi''(c)`, equations (1), (12), and (13), with
`eta=epsilon/4`, imply

\[
 \boxed{
 \gamma_2-\gamma_1
 \geq c_\epsilon\gamma_1^{\epsilon/4}
 e^{-\pi\gamma_1/2}}                                             \tag{14}
\]

after increasing the threshold.  If `d>1`, (14) is automatic there.  Thus the
absolute first-harmonic route contains a pointwise simplicity and separation
input that is not present in zero counting or pair-correlation averages.

Equation (14) is only a necessary consequence of (1).  It is far too weak to
match the expected average spacing, and it is not sufficient for (1): values
of `F` between zeros still require control.

## 3. A minimum-modulus tube for the Laguerre density

The same issue is visible without restricting to zeros of `Xi`.  Fix
`0<sigma<1/2`.  Standard fixed-strip convexity and Cauchy bounds give, for
some finite `M_sigma`,

\[
 \sup_{|v|\leq\sigma}|F'(x+iv)|
 \leq C_\sigma x^{M_\sigma}e^{-\pi x/2}
 \qquad(x\geq2).                                                   \tag{15}
\]

Here one uses the exact identity

\[
 F'(z)=\Xi'(z)\Xi''(z)-\Xi(z)\Xi'''(z)                         \tag{16}
\]

and the fixed-strip completed-zeta estimates.  If `F(x+iy)=0` with
`|y|<=sigma`, integration along the vertical segment gives

\[
 |F(x)|\leq C_\sigma |y|x^{M_\sigma}e^{-\pi x/2}.               \tag{17}
\]

Combining (17) with (1) yields

\[
 \boxed{
 |y|\geq c_{\epsilon,\sigma}
 x^{-M'_{\epsilon,\sigma}}e^{-\pi x}.}                          \tag{18}
\]

Thus (1) excludes not only real zeros of `F`; it excludes complex zeros of
the Laguerre density from an exponentially thin tube around the high real
axis, up to a polynomial factor.  Neither the functional equation nor an
upper convexity bound is a minimum-modulus theorem of this kind.

## 4. Why the canonical product and standard asymptotics do not fill the gap

Away from zeros, the genus-one Hadamard product gives the symmetric identity

\[
 \boxed{
 {F(t)\over\Xi(t)^2}
 =-\left({\Xi'\over\Xi}\right)'(t)
 =\sum_\rho{1\over(t-\rho)^2}.}                                  \tag{19}
\]

The linear exponential in the canonical product disappears after two
logarithmic derivatives.  The sum is real on the real axis after the usual
symmetrical grouping.  Off-real quartets contribute signed terms, so (19)
does not give a positive lower bound.  At a real zero it limits back to the
individual derivative problem (10)--(11).  Hence the canonical product
rephrases, rather than supplies, the missing minimum.

The normalized target (8) also explains the limitation of an ordinary
Riemann--Siegel truncation.  Any certified approximation to the bracket (7)
whose remainder is only `O(t^{-N})` for a fixed `N` has an error larger than
the `exp(-pi t)` margin in (8) for all sufficiently large `t`.  Such an
approximation may be a diagnostic or part of an exact sign-preserving
identity, but a finite algebraic-order error estimate cannot by itself certify
(8) uniformly.

The primary literature on zeta derivatives is consistent with this
distinction.  For example, Gao--Zhao's negative-moment bounds assume RH and
simplicity and average over zeros, while Gao's positive-moment lower bounds
also average over zeros under RH:

- <https://arxiv.org/abs/2208.06922>;
- <https://arxiv.org/abs/2106.03057>.

These results do not assert an individual lower bound such as (11).  Csordas'
global first Laguerre sign itself remains the open problem identified in
`LITERATURE_ALIGNMENT_NEXT.md`; a moment theorem cannot be substituted for
that pointwise sign.

## 5. An absolute lower bound is not the only small-spacing route

The exact harmonic condition from the preceding note is

\[
 E_1(a):=\sum_{m\geq1}(2m+1)|F((2m+1)a)|\leq F(a).               \tag{20}
\]

There is a relative sufficient condition that does not impose any absolute
minimum.

**Relative-decay lemma.**  Suppose that for some `A,c>0`,

\[
 F(t)>0,
 \qquad {d\over dt}\log F(t)\leq-c
 \qquad(t\geq A).                                                   \tag{21}
\]

Put `q=exp(-2ca)`.  Then, for `a>=A`,

\[
 \boxed{
 {E_1(a)\over F(a)}
 \leq\sum_{m\geq1}(2m+1)q^m
 ={q(3-q)\over(1-q)^2}.}                                         \tag{22}
\]

In particular (20), and hence the full half-cell lattice sign, holds whenever

\[
 e^{-2ca}\leq {5-\sqrt {17}\over4}.                              \tag{23}
\]

**Proof.**  Integrating (21) from `a` to `(2m+1)a` gives

\[
 0<F((2m+1)a)\leq F(a)e^{-2cma}=F(a)q^m.
\]

Summing the weighted geometric series proves (22).  Inequality (23) is the
smaller-root condition for `q(3-q)<=(1-q)^2`.  The harmonic-dominance theorem
of the preceding note then proves the half-cell sign.  \(\square\)

In the Hardy normalization, (21) becomes the one-sided correlated condition

\[
 \boxed{
 {d\over dt}\log\mathcal L_Z(t)
 \leq-c-2\ell'(t)
 ={\pi\over2}-c-{7\over2t}+O(t^{-3}).}                            \tag{24}
\]

For example, `c=pi/4` asks asymptotically only for the upper bound
`(log mathcal L_Z)'<=pi/4+o(1)`, together with `mathcal L_Z>0`.  It allows the
fundamental coefficient to be arbitrarily small; it requires only that the
later odd samples cannot recover too rapidly relative to it.  This is closer
to the actual lattice question than the absolute minimum (1), although its
positivity premise is still the open first Laguerre sign and the relative
derivative bound is also unproved.

There is a simple route-classification countermodel showing that an absolute
bound like (1) is not logically necessary for harmonic dominance.  For the
real even entire Schwartz function `f(t)=exp(-t^2)`, its first Laguerre density
is

\[
 f'(t)^2-f(t)f''(t)=2e^{-2t^2}.                                  \tag{25}
\]

The ratio in (22) tends to zero super-exponentially, so (20) holds for all
sufficiently large `a`.  But (25) is smaller than every
`a^M exp(-c a)` lower bound for large `a`.  This is not a theta/Xi model; it
proves only that the absolute third-harmonic envelope is a sufficient proof
device, not an invariant necessity of the odd-harmonic problem.

## 6. Resulting route status

The attempted completed-zeta lower-bound route separates into two very
different obligations.

- The absolute condition (1) is a uniform minimum-modulus theorem.  It implies
  high critical-line simplicity, the individual derivative estimate (11),
  the spacing estimate (14), and the zero-free tube (18).  Completed-zeta
  upper bounds, zero counts, moment estimates, and finite algebraic-order
  asymptotics do not provide those pointwise inputs.
- The exact lattice problem needs only relative odd-sample domination.  The
  relative-decay lemma gives a theorem-shaped alternative: prove the first
  Laguerre sign together with the one-sided normalized log-slope (24), or
  prove the discrete reverse-doubling estimate (20) directly from the
  complete-theta arithmetic.

The second route avoids an absolute lower bound and remains meaningful even
when `F(a)` lies far below its natural gamma envelope.  It does not avoid the
sign problem: `F>0` in (21) is precisely the missing high-frequency first
Laguerre input.  A source-specific proof would have to control the assembled
Hardy bracket `mathcal L_Z`, not `Z`, `Z'`, and `Z''` by separate absolute
estimates.

## Nonclaims

- No lower bound for the actual Xi--Laguerre density is proved.
- The simplicity, derivative, spacing, and tube statements are consequences
  of the proposed bound (1), not unconditional zeta theorems.
- The relative-decay lemma is sufficient, not asserted necessary, and its
  hypotheses are not established for Xi.
- The Gaussian example is not a complete-theta, zeta, or RH counterexample.
- No finite calculation, verified zero band, or averaged moment is promoted
  to an all-frequency statement or to RH.
