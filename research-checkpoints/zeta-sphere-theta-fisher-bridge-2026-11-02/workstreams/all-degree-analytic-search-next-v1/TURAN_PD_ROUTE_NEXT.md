# The Turan profile: a signed autocorrelation and the local-square obstruction

## Scope

This note asks whether the actual complete-theta interaction profile

\[
 R(u)=\frac12(\psi*\psi)(u)
 \operatorname {Var}(\mathsf X\mid \mathsf X+\mathsf Y=u),
 \qquad
 \widehat R(\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu),       \tag{1}
\]

has a noncircular autocorrelation representation, and whether such a
representation proves the mismatch-corrected paid-Schur direction.  There is
an exact three-channel **signed** autocorrelation.  It turns the desired sign
into one correlated norm comparison and keeps the actual target residual
assembled.  On the other hand, no finite family of constant-coefficient
differential transforms of `psi` can turn (1) into positive local squares:
the orders of vanishing at the known real zeros of `Xi` are incompatible.

Thus the signed factorization is a useful coordinate system, but not a proof
of positive definiteness.  The remaining estimate must use genuinely
nonlocal arithmetic information or a theta-specific relation between the
three channels.  No endpoint sign, all-degree extension, or RH conclusion is
claimed.

Use throughout

\[
 \widehat a(\nu)=\int_{\mathbb R}a(h)e^{-i\nu h}\,dh,
 \qquad \widetilde a(h)=\overline{a(-h)},
 \qquad \widehat\psi=F=2\Xi.                        \tag{2}
\]

The complete-theta profile and all its polynomial multiples and derivatives
are Schwartz, so all Fourier transforms, correlations, derivatives, and
Plancherel identities below are ordinary absolutely controlled operations.

## An exact three-channel signed autocorrelation

Put

\[
 a_0(h)=\psi(h),\qquad a_1(h)=h\psi(h),\qquad
 a_2(h)=h^2\psi(h).                                 \tag{3}
\]

Then

\[
 \widehat a_0=F,\qquad \widehat a_1=iF',\qquad
 \widehat a_2=-F''.                                  \tag{4}
\]

Since `F`, `F'`, and `F''` are real on the real frequency line,

\[
 \begin{aligned}
 4\widehat R
 &=F'^2-FF''\\
 &=|\widehat a_1|^2+
   \frac12\{\widehat a_0\overline{\widehat a_2}
             +\widehat a_2\overline{\widehat a_0}\}.
 \end{aligned}                                      \tag{5}
\]

Fourier inversion therefore gives the division-free identity

\[
 \boxed{
 R=\frac14 a_1*\widetilde a_1
   +\frac18\{a_0*\widetilde a_2+a_2*\widetilde a_0\}.} \tag{6}
\]

Diagonalizing only the fixed two-by-two cross coefficient yields

\[
 \boxed{
 R=\frac14 a_1*\widetilde a_1
   +\frac1{16}(a_0+a_2)*\widetilde{(a_0+a_2)}
   -\frac1{16}(a_0-a_2)*\widetilde{(a_0-a_2)}.}       \tag{7}
\]

This is an actual complete-theta identity, not a first-orbit approximation.
It has two positive autocorrelation channels and one negative channel.
Pointwise positivity of the conditional variance in (1) does not change the
minus sign in (7).

## The exact mismatch-corrected norm target

For a real polynomial `p`, let

\[
 \mathfrak q(p)=\frac1\pi\int_{\mathbb R}
 \widehat R(\nu)|p(i\nu)|^2\,d\nu.                  \tag{8}
\]

Applying `p(D)` to (7) and using Plancherel gives

\[
 \boxed{
 \begin{aligned}
 \mathfrak q(p)
 ={}&\frac12\|p(D)(h\psi)\|_2^2
   +\frac18\|p(D)((1+h^2)\psi)\|_2^2\\
   &-\frac18\|p(D)((1-h^2)\psi)\|_2^2 .
 \end{aligned}}                                     \tag{9}
\]

All norms in (9) are whole-line `L2(dh)` norms.  For the actual old-target
residual

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A                         \tag{10}
\]

from `TURAN_PAID_BRIDGE.md`, the paid-Schur border is nonnegative exactly
when

\[
 \boxed{
 \|\pi(D)((1-h^2)\psi)\|_2^2
 \leq 4\|\pi(D)(h\psi)\|_2^2
     +\|\pi(D)((1+h^2)\psi)\|_2^2.}                \tag{11}
\]

Equation (11) is a correlated inequality for the combined, corrected
residual.  It does not split raw theta features, the retained residue, or its
drift.  Replacing `pi` by the positive `X`-regression residual drops the
`Q^{-1}r` correction and changes the statement.

For `p=1`, (11) follows even pointwise from

\[
 (1-h^2)^2\leq 4h^2+(1+h^2)^2.                     \tag{12}
\]

For nonconstant `p`, however, `p(D)` does not commute with multiplication by
`h` or `h^2`:

\[
 p(D)(h\psi)=h\,p(D)\psi+p'(D)\psi,
\]

\[
 p(D)(h^2\psi)=h^2p(D)\psi+2h\,p'(D)\psi+p''(D)\psi. \tag{13}
\]

The commutator terms in (13) are precisely where a pointwise proof of (12)
fails.  They are also the graded derivative terms retained in the spatial
`X/Y` factorization.  Thus (11) is a new whole-line correlation form of the
same source-specific obstruction, not a generic contraction theorem.

## The positive tilted parent and its missing Loewner curvature

There is a natural family of genuine theta autocorrelations.  For real `a`
put

\[
 g_a(h)=e^{ah}\psi(h),\qquad
 C_a(v)=\int_{\mathbb R}e^{2ah}
             \psi(h-v)\psi(h+v)\,dh.               \tag{14}
\]

Thus `C_a(v)=(g_a*widetilde g_a)(2v)`, so `C_a` is positive definite for
every real `a`.  A scaling of the correlation transform gives

\[
 \boxed{\widehat C_a(2t)=2|\Xi(t+ia)|^2.}           \tag{15}
\]

The theta product `psi(h-v)psi(h+v)` in (14) is even in `h`.
Consequently the associated-kernel
primitive from `THETA_TURAN_NEXT.md` satisfies

\[
 \boxed{
 R(2v)=\mathcal M_1(v)
      =\frac18\left.\partial_a^2C_a(v)\right|_{a=0}.} \tag{16}
\]

This identifies the exact missing order property:

\[
 R\text{ is positive definite}
 \quad\Longleftrightarrow\quad
 \left.\partial_a^2 C_a\right|_{a=0}
 \succeq_{\rm PD}0.                                \tag{17}
\]

In words, the positive-definite family `C_a` must be Loewner-convex at the
origin.  Membership of every `C_a` in the positive cone does not imply (17).
The pointwise identity

\[
 C_a(v)=2\int_0^\infty\cosh(2ah)
           \psi(h-v)\psi(h+v)\,dh\geq C_0(v)        \tag{18}
\]

also does not imply positive-definite order.  Fourier transforming shows
that `C_a-C_0` is positive definite exactly when

\[
 |\Xi(t+ia)|^2\geq\Xi(t)^2\quad(t\in\mathbb R),     \tag{19}
\]

whose second derivative at `a=0` is
`2{Xi'^2-Xi Xi''}`.  Hence (18) supplies no noncircular proof of (17).

There is nevertheless a particularly clean directional version.  Define

\[
 J_p(a)=\|p(D)(e^{ah}\psi)\|_2^2
       =\frac2\pi\int_{\mathbb R}|p(it)|^2
          |\Xi(t+ia)|^2\,dt.                       \tag{20}
\]

Then `J_p` is even and differentiation under the integral gives

\[
 \boxed{\mathfrak q(p)=\frac14J_p''(0).}            \tag{21}
\]

For the actual residual `pi` in (10),

\[
 \boxed{A_X-B_Y-C_{XY}=\frac12J_\pi''(0).}          \tag{22}
\]

Thus the paid border asks whether `a=0` is a local minimum of one tilted
derivative norm.  With the polarized functional

\[
 J_{q,p}(a)=\operatorname {Re}\langle
 q(D)(e^{ah}\psi),p(D)(e^{ah}\psi)\rangle,
\]

old-target orthogonality gives only the second-curvature relation
\(J_{q,\pi}''(0)=4\mathfrak q(q,\pi)=0\) for old `q`; it does not turn `pi` into
an ordinary `L2` regression residual at `a=0`.  Equations (20)--(22) are
zero-safe and keep the residual correction assembled, but the Loewner
curvature remains the target sign.

## No local differential square factorization

The most direct positive version of (6) would seek polynomials `P_j` with

\[
 R=\sum_j (P_j(D)\psi)*\widetilde{(P_j(D)\psi)}.     \tag{23}
\]

This is impossible even if the sum is countable, provided

\[
 H(\nu)=\sum_j|P_j(i\nu)|^2                         \tag{24}
\]

is locally bounded near every real zero of `F`.  Indeed, (23) would imply

\[
 \widehat R(\nu)=|F(\nu)|^2H(\nu).                 \tag{25}
\]

Let `t0` be a real zero of `F` of arbitrary finite multiplicity `m>=1` and
write

\[
 F(t_0+x)=c x^m+O(x^{m+1}),\qquad c\ne0.
\]

Then the actual Turan density has the expansion

\[
 \widehat R(t_0+x)
 =\frac14\{F'^2-FF''\}(t_0+x)
 =\frac{m c^2}{4}x^{2m-2}+O(x^{2m-1}),             \tag{26}
\]

whereas the right side of (25) is `O(x^(2m))`.  This contradiction applies
at any real Xi zero; the classical theorem that Xi has infinitely many real
zeros supplies infinitely many such obstructions.  No simplicity assumption
is used.

The same proof rules out any positive factorization through filters of `psi`
whose Fourier multipliers remain locally bounded at the real zeros.  A
successful positive square must instead use frequency derivatives (hence
coordinate multiplication as in (7)), a multiplier singular at every real
zero, or a genuinely nonlocal construction.  An unspecified square root
`sqrt(widehat R)` is nonlocal and exists exactly after the missing sign is
known, so it is circular.

This no-go does **not** rule out a theta-specific contraction proving (11),
a vector-valued nonlocal factorization built from independent arithmetic
data, or a factorization on a certified frequency interval.

## Every raw finite theta-orbit prefix fails the sign

The infinite modular seam cancellation is essential even before the
all-degree question.  For `h>=0`, write the positive raw theta orbits as

\[
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},
 \qquad z_n=\pi n^2e^{2h},                          \tag{27}
\]

and evenly extend the finite prefix
`psi_N(h)=sum_(n=1)^N phi_n(|h|)`.  Direct differentiation at the seam gives

\[
 \phi_n'(0+)=2z_ne^{-z_n}(-8z_n^2+30z_n-15),
 \qquad z_n=\pi n^2.                               \tag{28}
\]

The `n=1` term in (28) is positive and every `n>=2` term is negative.  The
complete modular sum is smooth and even, so absolute convergence at the seam
gives `sum_(n>=1) phi_n'(0+)=0`.  It follows that every finite prefix has a
strict cusp

\[
 c_N:=\psi_N'(0+)>0.                                \tag{29}
\]

Let `F_N=widehat psi_N`.  Repeated integration by parts on the positive
half-line, retaining the seam term and applying the same argument separately
to the transforms defining `F_N`, `F_N'`, and `F_N''`, gives

\[
 \begin{aligned}
 F_N(t)&=-\frac{2c_N}{t^2}+O(t^{-4}),\\
 F_N'(t)&=\frac{4c_N}{t^3}+O(t^{-5}),\\
 F_N''(t)&=-\frac{12c_N}{t^4}+O(t^{-6}).
 \end{aligned}                                      \tag{30}
\]

Substitution of these three independently controlled expansions yields

\[
 F_N'(t)^2-F_N(t)F_N''(t)
 =-\frac{8c_N^2}{t^6}+O(t^{-8}).                   \tag{31}
\]

Therefore, for `Xi_N=F_N/2`,

\[
 L_1[\Xi_N](t)
 =-\frac{2c_N^2}{t^6}+O(t^{-8})<0                  \tag{32}
\]

for all sufficiently large `|t|`.  Each `psi_N` is positive and even, so its
conditional-variance interaction profile is pointwise positive just as in
(1), but that profile is not positive definite.

This is an actual-theta obstruction to proving the sign orbit by orbit or by
a raw finite prefix followed by a positive limit.  It does not cover an
Ewald/modular grouping that cancels the seam at every stage, and it does not
imply failure for the complete profile.

## Canonical-product compensation: an exact nonlocal target

There is a second exact description of what a nonlocal proof must control.
Away from real zeros of `F`, using a local branch for the logarithmic
derivative of a grouped canonical product gives

\[
 \frac{4\widehat R(x)}{F(x)^2}
 =-\{\log F\}''(x)
 =2\alpha_0+\frac d{x^2}+\sum_{\zeta}\frac1{(x-\zeta)^2}, \tag{33}
\]

with the zeros grouped into real zeros and conjugate pairs.  For Xi the
origin is not a zero, and the quadratic exponential coefficient vanishes by
its order, but the general terms in (33) make the sign mechanism explicit.
A real zero `r` contributes

\[
 \frac1{(x-r)^2}>0,                                 \tag{34}
\]

whereas a conjugate nonreal pair `a+ib,a-ib` contributes

\[
 \frac1{(x-a-ib)^2}+\frac1{(x-a+ib)^2}
 =\frac{2\{(x-a)^2-b^2\}}
        {\{(x-a)^2+b^2\}^2}.                       \tag{35}
\]

The pair term is negative only in its obstruction interval
`|x-a|<|b|`.  Formula (33) is not used at a real zero; the undivided expansion
(26), or the original formula (5), gives the removable limiting value there.

Thus a noncircular canonical-product route would have to show that the
positive real-zero terms and the other grouped factors compensate every
hypothetical off-line obstruction interval.  Merely bounding the terms in
(35) separately is not uniform: `b` may be arbitrarily small, and its
negative value at the center is `-2/b^2`.  Zero counting and the critical
strip alone do not provide the missing separation or correlated
compensation.

For a directional residual, (33) gives the exact, combined formula

\[
 \mathfrak q(\pi)
 =\frac1{4\pi}\int_{\mathbb R}
 |F(x)\pi(ix)|^2\{-\log F\}''(x)\,dx,              \tag{36}
\]

understood via the undivided integrand at real zeros.  This is the same sign
as (11), expressed as zero compensation rather than theta-channel
contraction.

## What verified zeros do and do not buy

A current independent zero-exclusion theorem gives a strong but bounded
positive piece.  Sra, *On some positivity properties of the Riemann Xi
function*, arXiv:2611.02944v1 (2026), Theorem 1.3, proves that verification of
RH through height `T>1/2` implies every generalized Laguerre density is
nonnegative on `|x|<=T-1/2`.  With the published verified height, this gives

\[
 \widehat R(x)\geq0
 \quad\text{for}\quad |x|\leq 3\cdot10^{12}-\frac12. \tag{37}
\]

This has an honest, noncircular band-limited autocorrelation consequence.
If

\[
 \widehat R_T=\mathbf1_{[-T+1/2,T-1/2]}\widehat R,
\]

then `R_T=A_T*widetilde A_T` with
`widehat A_T=sqrt(widehat R_T)`.  Unlike a global square root, this uses an
independently proved sign on the indicated band.

It does not prove (11): a polynomial multiplier `pi(ix)` is not band-limited,
and the complementary integral remains signed.  More decisively, an
all-degree polynomial ladder can concentrate against any negative open set
of the complementary density.  Therefore a fixed verified frequency window,
however large, cannot establish the uniform all-degree moment statement.
This is a rigorous partial factorization, not an analytic closure.

Reference: <https://arxiv.org/abs/2611.02944>.

## Resulting proof target

For each fixed mismatch-corrected residual `pi`, the positive-definiteness
route now has three equivalent, noncircular forms:

1. prove the actual complete-theta channel contraction (11) for every
   mismatch-corrected target residual `pi`; or
2. prove the tilted-norm curvature `J_pi''(0)>=0` in (22), using more than
   membership of each `C_a` in the positive-definite cone; or
3. prove correlated canonical-product compensation in (36), controlling the
   possible negative intervals (35) by independently established arithmetic
   information.

The first form is division-free and keeps modular/residue cancellation in
the residual.  The second packages the missing sign as Loewner curvature of
an honest positive autocorrelation family.  The third identifies why finite
zero verification gives only a bounded window and why absolute tail
estimates cannot be uniform when a hypothetical off-line displacement can
approach zero.  A useful next lemma must relate these forms: it should convert
complete-theta modular arithmetic into a bound on the **combined** negative
channel of (11), rather than bound the three norms or the zero-pair
contributions separately.

## Nonclaims

- The signed autocorrelation (7) is not a positive autocorrelation.
- The norm identity (9) does not prove (11) for a new rung.
- The local-square obstruction rules out a natural class of factorizations,
  not all possible theta-specific or nonlocal factorizations.
- The verified band (37) is finite evidence with a rigorous analytic
  implication; it does not prove the full endpoint sign or any all-degree
  extension.
- Nothing here proves RH or claims that the first Laguerre inequality alone
  is equivalent to RH.
