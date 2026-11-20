# Fixed-tau obstruction to all-degree frozen-residue positivity

## Scope and conclusion

This note retires one overly strong route.  It proves that the frozen-residue
forms `M_(0,N)` cannot be positive semidefinite on every prefix of either
complete parity ladder, even on the conditional branch where the endpoint
Xi--Laguerre density is nonnegative.  It does **not** prove that the endpoint
density is negative, does not contradict the endpoint-equivalent bound
`n_-(M_(0,N))<=1`, and has no RH conclusion.

The proof has two parts.

1. The residue drift `d(p)=e(p')` has an exact undivided real-frequency
   kernel.  Its high-frequency size prevents every fixed combined functional
   `sqrt(tau)v-tau^(-1/2)d` from being bounded in the endpoint target metric.
2. On compatible nested positive prefixes, feasibility of the correlated
   gate at every prefix would force one fixed `tau>0` to work on the whole
   ladder.  This contradicts the first part.

Thus the dichotomy is precise: if the endpoint density is negative, the
original endpoint target already fails; if it is nonnegative, the stronger
all-degree assertion `M_0>=0` fails.  The second branch is a route obstruction,
not an endpoint counterexample.

## Target metric and the combined functional

Use the nonunitary Fourier convention

\[
 \widehat u(\nu)=\int_{\mathbb R}u(t)e^{-i\nu t}\,dt,
 \qquad \widehat\psi(\nu)=2\Xi(\nu).
 \tag{1}
\]

For a real polynomial `p` of fixed parity put `P(nu)=p(i nu)`.  The endpoint
target form from `SPECTRAL_DEFECT_CLOSURE.md` is

\[
 A[p]=\frac1\pi\int_{\mathbb R}f(\nu)|P(\nu)|^2\,d\nu,
 \qquad
 f=\Xi'^2-\Xi\Xi''.
 \tag{2}
\]

Let

\[
 g(h)={\bf1}_{h>0}\,h\chi(h).
\]

The retained-residue correlation is

\[
 v(p)=\frac1{2\pi}\int_{\mathbb R}
 P(\nu)\,2\Xi(\nu)\overline{\widehat g(\nu)}\,d\nu.
 \tag{3}
\]

For `tau>0` define

\[
 a_\tau(p)=\frac{\sqrt\tau\,v(p)-\tau^{-1/2}d(p)}{\sqrt2}.
 \tag{4}
\]

On a finite positive target prefix, `M_0=A+vd^*+dv^*` is positive
semidefinite exactly when `||a_tau||_(A*)<=1` for some `tau>0`, as proved in
`M0_CROSS_COMPENSATION.md`.

## Exact real-frequency kernel for the drift

The residue EGF and its drift EGF are

\[
 E(t)=3(1-e^{2t})
 \exp\!\left(\frac{5t}{2}-\frac32(e^{2t}-1)\right),
 \qquad D(t)=tE(t).
 \tag{5}
\]

Thus `D^(j)(0)=d_j`.  Both `E` and `D` are Schwartz functions: as `t` tends
to minus infinity they and all derivatives have exponential decay, and as
`t` tends to plus infinity they have super-exponential decay.  Fourier
inversion and differentiation at zero therefore give, for every polynomial,

\[
 \boxed{
 d(p)=\frac1{2\pi}\int_{\mathbb R}
 P(\nu)\widehat D(\nu)\,d\nu.}
 \tag{6}
\]

This is equivalent to the off-axis series in `M0_CROSS_COMPENSATION.md`, but
keeps the drift on the same real frequency line as (3).

The kernel is explicit.  Put

\[
 a=\frac32,
 \qquad s=\frac54-\frac{i\nu}{2}.
\]

In the Fourier transform of (5), substitute `x=a e^(2t)`.  Since
`dt=dx/(2x)`, one obtains

\[
\begin{aligned}
 \widehat E(\nu)
 &=\frac{3e^a}{2}a^{-s}
   \left\{\Gamma(s)-\frac23\Gamma(s+1)\right\}\\
 &=\frac{e^a}{4}a^{-5/4+i\nu/2}
   (1+2i\nu)\Gamma(s).
\end{aligned}
\tag{7}
\]

Multiplication by `t` is `i partial_nu` under (1), so

\[
 \boxed{
 \widehat D(\nu)=i\partial_\nu\widehat E(\nu)
 =-\widehat E(\nu)
 \left[
  \frac12\log a+\frac{2}{1+2i\nu}
  -\frac12\psi_0(s)
 \right],}
 \tag{8}
\]

where `psi_0` is the digamma function.  No division by `Xi` or by the target
density has entered (6)--(8).

Combining (3) and (6) gives

\[
 a_\tau(p)=\frac1{2\pi\sqrt2}
 \int_{\mathbb R}P(\nu)B_\tau(\nu)\,d\nu,
 \tag{9}
\]

with the undivided numerator

\[
 \boxed{
 B_\tau(\nu)=
 2\sqrt\tau\,\Xi(\nu)\overline{\widehat g(\nu)}
 -\tau^{-1/2}\widehat D(\nu).}
 \tag{10}
\]

## High-frequency dominance of the drift

Stirling's formula and the digamma asymptotic, uniformly on the vertical line
in (8), give

\[
 |\Gamma(5/4-i\nu/2)|
 \asymp |\nu|^{3/4}e^{-\pi|\nu|/4},
 \tag{11}
\]

and

\[
 \left|
  \frac12\log a+\frac{2}{1+2i\nu}
  -\frac12\psi_0(5/4-i\nu/2)
 \right|
 \asymp\log|\nu|.
 \tag{12}
\]

Consequently

\[
 \boxed{
 |\widehat D(\nu)|
 \asymp |\nu|^{7/4}\log|\nu|
 e^{-\pi|\nu|/4}.}
 \tag{13}
\]

The half-line function `g` is smooth on the positive side, is
super-exponentially decreasing at infinity, and satisfies
`g(0)=0`, `g'(0+)=chi(0)`.  Two integrations by parts give

\[
 \widehat g(\nu)=\frac{\chi(0)}{(i\nu)^2}+O(|\nu|^{-3}).
 \tag{14}
\]

The displayed remainder also uses `g''' in L1(0,infinity)`, which follows
from the complete-theta orbit decay.  Two integrations alone already give
the `O(|nu|^(-2))` bound needed below.

For completeness, the classical convexity estimate for zeta, Cauchy estimates
for its first two derivatives, the defining formula

\[
 \Xi(\nu)=\xi(1/2+i\nu)
 =\frac12s_\nu(s_\nu-1)\pi^{-s_\nu/2}
   \Gamma(s_\nu/2)\zeta(s_\nu),
 \quad s_\nu=\frac12+i\nu,
\]

and Stirling imply, for `k=0,1,2` and every `epsilon>0`,

\[
 |\Xi^{(k)}(\nu)|
 \ll_\epsilon e^{-\pi|\nu|/4}|\nu|^{2+\epsilon}.
 \tag{15}
\]

Logarithmic factors from differentiating the gamma and power factors are
absorbed into `|nu|^epsilon`.  The same standard estimates underlie the
boundary bounds recorded in
`evidence/v18-curated/foundations/LOCALIZATION_V6_AUDIT.md`.

Equations (14)--(15) show

\[
 \Xi(\nu)\widehat g(\nu)
 =o(\widehat D(\nu))
 \quad\hbox{in absolute value}.
 \tag{16}
\]

Therefore, for every **fixed finite** `tau>0`,

\[
 B_\tau(\nu)
 =-\tau^{-1/2}\widehat D(\nu)(1+o(1)).
 \tag{17}
\]

The word fixed is essential; (17) is not a statement uniform in a
prefix-dependent `tau`.

## Both parity projections retain the obstruction

Because `D` and `g` are real,

\[
 B_\tau(-\nu)=\overline{B_\tau(\nu)}.
\]

Thus the even polynomial ladder sees `Re B_tau`, while the odd ladder sees
`Im B_tau`, up to the harmless constant imaginary phase of `P(nu)`.

It remains to exclude the possibility that one component is asymptotically
small.  Write

\[
 \widehat D(\nu)=R(\nu)e^{i\Phi(\nu)},\qquad \nu>0.
\]

Equations (7)--(8) and the Stirling expansion for the argument of Gamma give

\[
 \Phi'(\nu)=-\frac12\log(\nu/3)+O(1/\nu),
 \qquad
 \Phi''(\nu)=-\frac1{2\nu}+O(1/\nu^2).
 \tag{18}
\]

For every sufficiently large dyadic interval `[T,2T]`, change variables from
`nu` to the monotone phase `Phi`.  On that interval `|Phi'|` is comparable to
`log T` and varies by a relative `O(1/log T)`.  A fixed positive proportion
of every phase period satisfies `|cos Phi|>=1/2`, and another fixed positive
proportion satisfies `|sin Phi|>=1/2`.  It follows that there are sets
`S_(0,T),S_(1,T)` in `[T,2T]`, each of measure at least `cT` with an absolute
`c>0`, such that

\[
 |\operatorname{Re}\widehat D(\nu)|\geq\frac12R(\nu)
 \quad(\nu\in S_{0,T}),
\]

\[
 |\operatorname{Im}\widehat D(\nu)|\geq\frac12R(\nu)
 \quad(\nu\in S_{1,T}).
 \tag{19}
\]

By (16), after increasing `T` if necessary, the corresponding real or
imaginary component of `B_tau` is bounded below by a fixed positive multiple
of `tau^(-1/2)R` on these sets.  Hence the obstruction occurs separately in
both parity ladders; it is not merely a full-filtration cancellation issue.

## No fixed combined functional is target-bounded

Now take the conditional endpoint-positive branch

\[
 f(\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\geq0
 \quad(\nu\in\mathbb R).
 \tag{20}
\]

The function is real analytic and not identically zero, so it is positive
almost everywhere.  From (15), with an independent small parameter `eta>0`,

\[
 0\leq f(\nu)
 \leq |\Xi'(\nu)|^2+|\Xi(\nu)\Xi''(\nu)|
 \ll_\eta e^{-\pi|\nu|/2}|\nu|^{4+\eta}.
 \tag{21}
\]

Let `b_(0,tau)=Re B_tau` and `b_(1,tau)=Im B_tau`.  For
`j in {0,1}`, on the corresponding sets in (19), equations (13), (17), and
(21) give

\[
 \frac{|b_{j,\tau}(\nu)|^2}{f(\nu)}
 \gg_{j,\eta,\tau}
 |\nu|^{-1/2-\eta}\log^2|\nu|.
 \tag{22}
\]

Choose `eta<1/2`.  Since the relevant subset of each `[T,2T]` has measure
at least `cT`, the integral in (22) diverges along dyadic intervals.  Thus

\[
 \boxed{
 \int_{\mathbb R}
 \frac{|b_{0,\tau}(\nu)|^2}{f(\nu)}\,d\nu
 =\int_{\mathbb R}
 \frac{|b_{1,\tau}(\nu)|^2}{f(\nu)}\,d\nu
 =\infty}
 \tag{23}
\]

for every fixed `tau>0`.  At a zero of `f`, the quotient is interpreted as
infinite unless the numerator also vanishes; such zeros can only strengthen
the conclusion.

Equation (23) really rules out bounded polynomial functionals, rather than
only one guessed representer.  The measure `f(nu)dnu` has an absolute
exponential moment.  Even polynomials are dense in its even `L2` sector and
odd polynomials in its odd sector by the analytic-annihilator argument in
`evidence/v18-curated/spectral_relative_limit_v1/RELATIVE_LIMIT.md` and
`M0_INERTIA_EQUIVALENCE_AUDIT.md`.

If `a_tau` were bounded in one parity target norm, Riesz representation would
supply an element `r` of that parity sector.  The difference between the
frequency kernel in (9) and `f overline(r)` would annihilate every polynomial
of that parity.  Both terms have a smaller exponential moment: for `f r` this
follows from Cauchy--Schwarz.  Its Fourier--Laplace transform would therefore
be analytic in a strip with all derivatives at zero equal to zero.  The
identity theorem and Fourier uniqueness force the difference to vanish.
Hence the Riesz representer would have to be the appropriate constant
multiple of `b_(j,tau)/f`, contradicting (23).

We conclude that, under (20), for each parity and every fixed `tau>0`,

\[
 \sup_{0\ne p\ \mathrm{in\ that\ parity}}
 \frac{|a_\tau(p)|^2}{A[p]}=\infty.
 \tag{24}
\]

## Nested prefixes force a fixed tau

Let `P_N` be compatible nested prefixes of one parity and suppose their
target restrictions `A_N` are positive definite.  Put

\[
 F_N(\tau)=\|a_\tau|_{P_N}\|_{A_N^*}^2
 =\frac12\left(\tau V_N+\frac{D_N}{\tau}-2C_N\right),
 \tag{25}
\]

where

\[
 V_N=v_N^TA_N^{-1}v_N,
 \quad D_N=d_N^TA_N^{-1}d_N,
 \quad C_N=v_N^TA_N^{-1}d_N.
\]

The variational formula

\[
 F_N(\tau)=
 \sup_{0\ne p\in P_N}\frac{|a_\tau(p)|^2}{A[p]}
 \tag{26}
\]

shows that `F_N(tau)` is pointwise nondecreasing in `N`.  Therefore the
feasible sets

\[
 S_N=\{\tau>0:F_N(\tau)\leq1\}
\]

are nested.  Once `V_N,D_N>0`, a nonempty `S_N` is the compact interval

\[
 S_N=[\tau_{-,N},\tau_{+,N}],
 \qquad
 \tau_{\pm,N}=
 \frac{1+C_N\pm\sqrt{(1+C_N)^2-V_ND_N}}{V_N}.
 \tag{27}
\]

The two functionals become nonzero on each complete parity ladder.  For `d`
this is already explicit in the residue coefficients: `d_2=-12` in the even
ladder and `d_3=-18` in the odd ladder.  For `v`, if all moments in one parity
vanished, exponential-moment uniqueness applied to (3) would force the
corresponding parity component of
`2 Xi overline(widehat g)` to vanish.  Since `Xi` is even and nonzero almost
everywhere, the associated cosine or sine transform of the nonzero one-sided
function `g=1_(h>0)h chi` would vanish identically, contradicting Fourier
injectivity.  Hence some finite prefix in each parity has `V_N,D_N>0`.

If every prefix gate were feasible, the later nonempty compact intervals
would all lie inside the first such compact `S_N`.  The nested compact-set
theorem would give

\[
 \tau_\infty\in\bigcap_NS_N.
 \tag{28}
\]

That fixed `tau_infinity` would make the left side of (24) at most one,
contradicting the target-metric obstruction.

## Route-retirement theorem

For either complete parity ladder:

- if `f` is negative somewhere, the established parity-polynomial density
  argument gives target prefixes with arbitrarily large negative inertia;
  the rank-two correction `vd^T+dv^T` cannot make all of those `M_0`
  prefixes positive semidefinite;
- if `f>=0` everywhere, then (24)--(28) imply that there is a finite prefix
  for which

  \[
  M_{0,N}=A_N+v_Nd_N^T+d_Nv_N^T
  \not\succeq0.
  \]

Therefore an all-degree proof cannot use `M_(0,N)>=0` at every rung as its
intermediate lemma.  The conclusion is compatible with
`n_-(M_(0,N))<=1`, which is the endpoint-equivalent inertia statement in
`M0_INERTIA_EQUIVALENCE_AUDIT.md`.  A successful route would have to retain
one controlled negative direction or bypass the frozen-residue positivity
gate entirely.

## Separate corrected-feature `L2` obstruction

There is a simpler, weaker warning for ordinary corrected-feature `L2`.
Representing (9) as an inner product against `p(D)psi` would require division
of `B_tau` by `2Xi`.  The bracket in (8) has real part
`-log|nu|/2+O(1)`, so `widehat D` has only finitely many real zeros.  The
function `Xi` has infinitely many real zeros by the classical Hardy theorem.
At all but finitely many of them the drift term in `B_tau` is nonzero, so the
quotient has non-`L2` poles.  Thus no ordinary full-filtration Hardy/Riesz
representer exists.  The target-metric argument above is stronger because it
remains regular at simple Xi zeros and still rules out every fixed `tau`.

## Nonclaims

- This note does not locate the first failing prefix.
- It does not turn the floating degree-19 diagnostic into a certificate; the
  observed positive prefixes are compatible with an eventual failure.
- It does not prove endpoint negativity or disprove RH.
- It does not refute a route based on the exact one-negative-direction
  inertia or a different signed compensation that does not demand `M_0>=0`.
