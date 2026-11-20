# Complete-theta orbit correlation and the modular-center cancellation

## Scope

This note tests an orbit-by-orbit route to the mismatch-corrected paid-Schur
inequality.  It gives two exact decompositions of

\[
 f(t)=\Xi'(t)^2-\Xi(t)\Xi''(t).
 \tag{1}
\]

The first is the raw double-orbit decomposition.  It has a rigorous
obstruction: every diagonal orbit block changes sign, and every finite
positive packet of theta orbits has a negative algebraic Turan tail.  For the
natural first-`N` packet the tail is exactly of order `-t^-6`, so its
polynomial moments cease to exist from degree three onward.  Thus finite
orbit truncation is not an all-degree approximation to the target form.

The second decomposition keeps one complete-theta leg assembled.  Its
individual terms are domain-safe at every polynomial degree and retain the
actual regression correction.  They give a surviving exact grouped identity,
but no sign for its terms or for their sum is proved here.  In particular,
this note does not prove a new paid border, the endpoint sign, or RH.

## Positive half-line theta orbits

For `h >= 0`, put

\[
 a_n=\pi n^2,\qquad z_n=a_ne^{2h},
\]

\[
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n}.                \tag{2}
\]

Every `phi_n` is strictly positive on the half-line, and the complete theta
profile is

\[
 \psi(h)=\sum_{n\geq1}\phi_n(h)\qquad(h\geq0).     \tag{3}
\]

Since `psi` is even, define the positive evenized orbit

\[
 \phi_n^{\rm e}(h)=\phi_n(|h|).
\]

The individual evenized orbit is continuous but generally has a cusp at the
modular center.  The infinite sum cancels all such cusps:

\[
 \psi(h)=\sum_{n\geq1}\phi_n^{\rm e}(h)
 \quad(h\in\mathbb R),                              \tag{4}
\]

and the right side is smooth and even only after the full sum is assembled.

Let

\[
 C_n(t)=\int_0^\infty\phi_n(h)\cos(th)\,dh.         \tag{5}
\]

Then

\[
 \Xi(t)=\sum_{n\geq1}C_n(t).                       \tag{6}
\]

Each orbit transform is explicit.  With `Gamma(s,a)` the upper incomplete
gamma function,

\[
 \boxed{
 C_n(t)=2a_n^{-1/4}\operatorname{Re}\!\left[
 a_n^{-it/2}
 \left\{2\Gamma\!\left(\frac94+\frac{it}{2},a_n\right)
       -3\Gamma\!\left(\frac54+\frac{it}{2},a_n\right)
 \right\}\right].}
 \tag{7}
\]

This follows from `z=a_n e^(2h)` in (5).  Formula (7) is useful for testing
an orbit claim, but the incomplete-gamma lower boundary at `a_n` is also
where the center cusp appears.

## Exact raw pair decomposition

For twice differentiable real functions define the symmetric bilinear Turan
operator

\[
 \mathcal B(A,B)
 =A'B'-\frac12(AB''+A''B).                          \tag{8}
\]

Equations (1) and (6) give the exact locally convergent expansion

\[
 \boxed{
 f(t)=\sum_{n,m\geq1} f_{nm}(t),\qquad
 f_{nm}=\mathcal B(C_n,C_m).}
 \tag{9}
\]

There is also a division-free positive-half-line formula:

\[
 \boxed{
 f_{nm}(t)=\frac14\int_0^\infty\!\int_0^\infty
 \phi_n(h)\phi_m(k)
 \left\{
 (h+k)^2\cos(t(h-k))+(h-k)^2\cos(t(h+k))
 \right\}\,dh\,dk.}
 \tag{10}
\]

To verify (10), use

\[
 \sin(th)\sin(tk)=\frac12\{\cos(t(h-k))-\cos(t(h+k))\}
\]

and the analogous cosine product identity.  All integrals in (10) are
absolutely convergent for fixed real `t`.

At the origin every pair contribution is positive.  Indeed, if

\[
 M_{j,n}=\int_0^\infty h^j\phi_n(h)\,dh>0,
\]

then

\[
 \boxed{
 f_{nm}(0)=\frac12(M_{0,n}M_{2,m}+M_{2,n}M_{0,m})>0.}
 \tag{11}
\]

The sign does not persist away from the origin.

## The exact modular-center cancellation

Differentiate (2) on the positive side.  At the center one obtains

\[
 \boxed{
 b_n:=\phi_n'(0+)
 =e^{-a_n}(-16a_n^3+60a_n^2-30a_n)
 =-2a_ne^{-a_n}(8a_n^2-30a_n+15).}
 \tag{12}
\]

The signs in (12) are completely explicit:

\[
 b_1>0,\qquad b_n<0\quad(n\geq2).                  \tag{13}
\]

For the first sign, the quadratic `8x^2-30x+15` is increasing at `x=pi`,
and

\[
 8(22/7)^2-30(22/7)+15=-13/49<0.
\]

For `n >= 2`, `a_n >= 4pi > 12` and the same quadratic is positive.  On the
other hand, smooth evenness of the complete profile and absolute convergence
of the differentiated orbit series give the exact cancellation

\[
 \boxed{\sum_{n\geq1}b_n=\psi'(0+)=0.}             \tag{14}
\]

Thus the positive first-orbit cusp is cancelled by the infinite negative
tail.  More generally, smooth evenness gives

\[
 \sum_{n\geq1}\phi_n^{(2j+1)}(0+)=0
 \qquad(j\geq0),                                   \tag{15}
\]

with absolute convergence at each fixed `j`.  The modular center is therefore
an all-orbit correlation, not an orbitwise property.

## Rigorous pairwise and finite-packet obstruction

Repeated integration by parts in (5) gives, on the real axis,

\[
\begin{aligned}
 C_n(t)&=-\frac{b_n}{t^2}+O(t^{-4}),\\
 C_n'(t)&=\frac{2b_n}{t^3}+O(t^{-5}),\\
 C_n''(t)&=-\frac{6b_n}{t^4}+O(t^{-6}).
\end{aligned}                                      \tag{16}
\]

Substitution in (8) yields the exact leading pair asymptotic

\[
 \boxed{
 f_{nm}(t)=-\frac{2b_nb_m}{t^6}+O(t^{-8}).}
 \tag{17}
\]

Consequences of (11), (13), and (17) are immediate:

- every diagonal block `f_nn` is positive at zero and negative for all
  sufficiently large `|t|`, so it changes sign;
- every pair with `n,m >= 2` also changes from positive at zero to negative
  at large height;
- the `1`--`m` leading cross tail is positive for `m >= 2`, and these cross
  terms are part of the cancellation required by (14).

This rules out a sum-of-nonnegative-pair-blocks proof for the actual theta
orbit expansion.  It is a source-specific obstruction, not a generic model.

The obstruction is even sharper for natural truncations.  Define

\[
 C^{(N)}=\sum_{n=1}^NC_n,\qquad
 B_N=\sum_{n=1}^Nb_n.
\]

Equations (13)--(14) imply

\[
 B_N=-\sum_{n>N}b_n>0                              \tag{18}
\]

for every finite `N`.  Hence the Turan density of the first `N` positive
orbits satisfies

\[
 \boxed{
 \mathcal B(C^{(N)},C^{(N)})(t)
 =-\frac{2B_N^2}{t^6}+O(t^{-8})<0}
 \tag{19}
\]

at sufficiently large height.

There is a domain failure in addition to the wrong sign.  If `p` is a
nonzero polynomial of degree `d >= 3`, then

\[
 \mathcal B(C^{(N)},C^{(N)})(t)|p(it)|^2
 \sim -2B_N^2|\operatorname{lc}(p)|^2t^{2d-6}.
 \tag{20}
\]

The corresponding real-line integral diverges to `-infinity`.  Thus a finite
positive orbit truncation does not even define the all-degree polynomial
quadratic form.  Taking `N -> infinity` before the high-frequency or
high-degree limit is essential.

This phenomenon is not special to prefixes.  Let `S` be any nonempty finite
set of orbit indices and put

\[
 A_S(h)=\sum_{n\in S}\phi_n(h)\qquad(h\geq0).
\]

Some odd right derivative of `A_S` at zero must be nonzero.  Otherwise its
analytic continuation would be even.  But as `h -> -infinity`,

\[
 A_S(h)=-12e^{5h/2}\sum_{n\in S}a_n+O(e^{9h/2}),   \tag{21}
\]

whereas `A_S(-h)` is super-exponentially small, a contradiction.  If the
first nonzero odd derivative has order `2r+1`, its cosine transform has a
nonzero leading term `c t^(-2r-2)`.  Therefore its self-Turan density has
leading term

\[
 -(2r+2)c^2t^{-4r-6}<0.                            \tag{22}
\]

No nonempty finite positive orbit packet can supply a nonnegative self block
at every height.  A viable modular packet must be infinite and must cancel
all odd center jets, not just (12).

## A domain-safe assembled-leg decomposition

The raw pair blocks lose the modular smoothness needed by high polynomial
degrees.  There is, however, an exact orbit decomposition which keeps that
smoothness.  Retain the full theta function in one leg and define

\[
 \boxed{
 g_n(t)=\mathcal B(\Xi,C_n)(t).}
 \tag{23}
\]

Linearity in the second argument gives

\[
 \boxed{f(t)=\sum_{n\geq1}g_n(t).}                 \tag{24}
\]

Unlike `f_nm`, every `g_n` is rapidly decreasing on the real line: `Xi` and
its derivatives have exponential real-axis decay, while `C_n` and its first
two derivatives have at worst algebraic tails.

The inverse Fourier profile of `g_n` is also exact and positive.  With the
evenized orbit from (4), put

\[
 \boxed{
 R_n(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \phi_n^{\rm e}\!\left(\frac{u-v}{2}\right)\,dv.}
 \tag{25}
\]

Then

\[
 R_n(u)>0,\qquad \widehat R_n(t)=g_n(t),
 \qquad R=\sum_{n\geq1}R_n.                        \tag{26}
\]

Although `phi_n^e` has a center cusp, convolution with the complete smooth
theta leg makes `R_n` smooth and rapidly decreasing.  Thus all derivative
jets used below exist.  Pointwise positivity of `R_n` does not imply that
`g_n` is nonnegative; asserting that would repeat the positive-definiteness
gap from `THETA_TURAN_NEXT.md` one orbit at a time.

## Exact mismatch-corrected orbit identity

Let `P` be a positive old target prefix and let `p` be the new representative.
Use the notation of `MISMATCH_THETA_FORMULA.md` and
`TURAN_PAID_BRIDGE.md`:

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A.                      \tag{27}
\]

This is the actual-target residual, including the complete regression
mismatch.  For polynomials `a,b`, define the assembled-leg orbit form

\[
 \mathfrak q_n(a,b)
 =\frac1\pi\int_{\mathbb R}g_n(t)
 P_a(t)\overline{P_b(t)}\,dt.                      \tag{28}
\]

Every integral in (28) is absolutely convergent at every finite polynomial
degree.  Fourier inversion gives

\[
 \boxed{
 \mathfrak q_n(a,b)
 =2[a(D)b(-D)R_n](0),
 \qquad
 \mathfrak q=\sum_{n\geq1}\mathfrak q_n.}
 \tag{29}
\]

For each fixed pair of polynomials the sum in (29) is absolutely convergent:
the orbit `L1` moments decay Gaussianly in `n`, and the full theta factor in
`g_n` supplies the uniform real-frequency decay.

Consequently the exact paid border is

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =2\mathfrak q(\pi)
 =2\sum_{n\geq1}\mathfrak q_n(\pi,\pi).}
 \tag{30}
\]

Equation (30) keeps the combined vector and its signed compensation intact.
In an old basis `q_i`, it also gives

\[
 Q_{ij}=2\sum_{n\geq1}\mathfrak q_n(q_i,q_j),
 \qquad
 r_i=-2\sum_{n\geq1}\mathfrak q_n(q_i,R_X).        \tag{31}
\]

The inverse in `Q^{-1}r` must be taken after the sums in (31).  Regressing
against an individual orbit block, or replacing `Q^{-1}r` by a sum of
blockwise inverses, changes `pi` and does not reproduce the paid-Schur
border.  The individual forms `q_n` are signed, so their matrices need not
even be invertible or positive.

## Resulting route status

The raw orbit-pair sum is not a sum of positive pieces.  Its algebraic cusp
tails cancel only through the complete modular identity, and finite positive
orbit truncations are invalid for the all-degree moment problem.  This
retires the following proposed shortcuts:

- prove every `n,m` pair in (9) nonnegative;
- prove the diagonal orbit blocks nonnegative and absorb cross terms by
  ordinary Cauchy;
- pass from positive first-`N` orbit sums to the all-degree target form;
- perform the target regression separately on orbit blocks.

The surviving orbit-level target is the fully correlated sum (30), or a
grouping of its assembled-leg terms which proves

\[
 \sum_{n\in G}\mathfrak q_n(\pi,\pi)\geq0          \tag{32}
\]

for modularly complete infinite groups `G`.  Such a grouping must use actual
theta arithmetic or Poisson/modular cancellation; pointwise positivity of
the profiles `R_n` alone is insufficient.  No such sign grouping is proved
here.

## Nonclaims

- The negative tails belong to finite orbit packets, not to the complete
  endpoint density `f`; they are not counterexamples to the theta target.
- The note does not show that any actual paid border is negative.
- The assembled-leg identity does not make the positive profiles `R_n`
  positive definite.
- No finite calculation here is presented as evidence proving RH.
