# Near signed term: boundary-Hankel reduction

## 1. Claim boundary

This note gives an exact geometric reduction and a norm bound for the
**physical outer-leakage part** of the cancellation-preserving Chebyshev
integral.  It does not prove a signed prolate--Weil comparison, a sector
floor, a relative Fourier-Galerkin estimate, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or RH.

The useful new point is that the outer-leakage correlation is not an
arbitrary correlation.  In centered logarithmic coordinates it is a Hankel
convolution of an inward boundary profile with an outward boundary profile.
The combined normalized Chebyshev error, without splitting pole,
archimedean, and prime terms, defines a Hilbert--Schmidt Hankel kernel on
every finite near range.  A quantitative PNT makes the two kernel moments
uniform as the range grows.

This reduction by itself left both a defect-relative physical boundary
estimate and a relative Fourier projection estimate.  Subsequent notes now
prove the relative Fourier tail, the compact P--P pairing, and both mixed
O--P/P--O orientations on a locked exponential schedule.  The mixed theorem
uses the actual corrected, source-normalized combined `0/4` radical state; it
does not turn the individual prolate modes into global radicals and is not a
generic multiplier theorem.  The complete signed O--O pairing and the signed
sector floors remain open.

## 2. The source correlation in logarithmic coordinates

Put

\[
 L=2\log\lambda,\qquad \ell=L/2,
 \qquad I=[-\ell,\ell].
\]

For functions on the logarithmic line, zero-extending a finite-window
function when necessary, define for `x>=0`

\[
 \mathfrak q(v,w;x)=\int_{\mathbb R}
 \bigl(\overline{v(t)}w(t+x)+\overline{v(t+x)}w(t)\bigr)\,dt. \tag{2.1}
\]

This is the source correlation, not a new model.  Indeed, before recentering,
for

\[
 V_n(t)=L^{-1/2}e^{2\pi int/L}\mathbf 1_{[0,L]}(t),
\]

direct integration in (2.1) gives

\[
 \mathfrak q(V_n,V_m;x)=
 \begin{cases}
 2(1-x/L)\cos(2\pi nx/L),&n=m,\\[3pt]
 \dfrac{\sin(2\pi mx/L)-\sin(2\pi nx/L)}
       {\pi(n-m)},&n\ne m,
 \end{cases}                                      \tag{2.2}
\]

on `[0,L]`, exactly the locked matrix kernel.

Let `C` be multiplication by `1_I`.  Suppose `v=Cv` and
`R_out=(1-C)R`.  Assume both have definite inversion parity,

\[
 v(-t)=\varepsilon_vv(t),\qquad
 R_{\rm out}(-t)=\varepsilon_RR_{\rm out}(t),
 \qquad \varepsilon_v,\varepsilon_R\in\{+1,-1\}.
\]

Define the inward and outward right-boundary profiles

\[
 A_v(s)=v(\ell-s)\mathbf 1_{[0,L]}(s),\qquad
 B_R(t)=R_{\rm out}(\ell+t),\quad t\ge0.          \tag{2.3}
\]

Splitting the two integrals in (2.1) at the right and left boundaries and
using parity gives the exact identity

\[
 \boxed{
 \mathfrak q(v,R_{\rm out};x)
 =(1+\varepsilon_v\varepsilon_R)
       (\overline{A_v}*B_R)(x).}                  \tag{2.4}
\]

Here `A_v` is zero after `L`.  Thus opposite parities cancel identically,
while equal parities give twice one boundary convolution.  Sector splitting
therefore removes cross-parity forcing, but it supplies no additional sign
inside either parity sector.

## 3. Exact truncated Hankel formula

Retain the complete normalized Chebyshev-error kernel

\[
 \delta_*(x)=e^{-x}\left(
 e^x-\psi_C(e^x)-\frac12\log(1-e^{-2x})\right).   \tag{3.1}
\]

For equal parities, put

\[
 a(s)=e^{s/2}\overline{A_v(s)},\qquad
 b(t)=e^{t/2}B_R(t).                              \tag{3.2}
\]

If `Omega=e^(x/2) mathfrak q(v,R_out;x)`, then (2.4) says

\[
 \Omega(x)=2(a*b)(x).                             \tag{3.3}
\]

Fix `0<X<=L`.  Suppose `a in H^1(0,X)` and `b in L^2(0,X)`; the same
identity follows by approximation for the locally BV outer profiles arising
from a hard endpoint.  Define

\[
 (H_{\delta,X}b)(s)
 =\int_0^{X-s}\delta_*(s+t)b(t)\,dt,
 \qquad 0\le s\le X.                             \tag{3.4}
\]

Since

\[
 (a*b)'(x)=a(0)b(x)+(a'*b)(x)
\]

almost everywhere on `(0,X)`, Fubini gives the exact combined formula

\[
\boxed{
\begin{aligned}
 I_X(v,R_{\rm out})
 &:=\int_0^X\delta_*(x)(\Omega'(x)-\Omega(x))\,dx\\
 &=2a(0)\int_0^X\delta_*(t)b(t)\,dt
   +2\int_0^X(a'(s)-a(s))(H_{\delta,X}b)(s)\,ds.
\end{aligned}}                                   \tag{3.5}
\]

No pole, archimedean, or prime absolute value has been taken in (3.5).
Moreover,

\[
 \|H_{\delta,X}\|_{\rm HS}^2
 =\int_0^X x|\delta_*(x)|^2\,dx.                 \tag{3.6}
\]

Consequently

\[
\boxed{
 |I_X(v,R_{\rm out})|
 \le 2\left(
 |a(0)|C_0(X)+\|a'-a\|_{L^2(0,X)}C_1(X)
 \right)\|b\|_{L^2(0,X)},}                     \tag{3.7}
\]

where the constants are specified, not hidden `O(1)` terms:

\[
 C_0(X)^2=\int_0^X|\delta_*(x)|^2\,dx,
 \qquad
 C_1(X)^2=\int_0^Xx|\delta_*(x)|^2\,dx.          \tag{3.8}
\]

This is a signed boundedness statement, not positivity and not a lower
bound.  It is a bilinear product bound, but only `b` is an outer-leakage
profile; the full inward profile `a` is not defect-sized.

### 3.1 The complementary projection term is Toeplitz, not Hankel

The exact radical remainder is

\[
 R=R_{\rm out}+R_{\rm proj},\qquad
 R_{\rm proj}=(C-P_NC)K.
\]

The second summand is supported inside `I`.  For equal parities define

\[
 C_R(s)=R_{\rm proj}(\ell-s),\qquad
 c(s)=e^{-s/2}C_R(s),\qquad 0\le s\le L,         \tag{3.9}
\]

and retain `a(s)=e^(s/2) conjugate(A_v(s))`.  Directly from (2.1), for
`0<=x<=L`,

\[
 \mathfrak q(v,R_{\rm proj};x)
 =2\int_x^L\overline{A_v(s)}C_R(s-x)\,ds,        \tag{3.10}
\]

so that

\[
 \Omega_{\rm proj}(x)
 =2\int_0^{L-x}a(y+x)c(y)\,dy.                  \tag{3.11}
\]

This is a truncated Toeplitz correlation.  If

\[
 (T_{\delta,X}c)(s)
 =\int_0^{\min(X,s)}\delta_*(x)c(s-x)\,dx,       \tag{3.12}
\]

assume here that `a in H^1(0,L)` and `c in L^2(0,L)`.  Differentiating
(3.11) and applying Fubini then gives

\[
\boxed{
\begin{aligned}
 I_X(v,R_{\rm proj})
 &:=\int_0^X\delta_*(x)
       (\Omega_{\rm proj}'(x)-\Omega_{\rm proj}(x))\,dx\\
 &=-2a(L)\int_0^X\delta_*(x)c(L-x)\,dx\\
 &\quad+2\int_0^L(a'(s)-a(s))(T_{\delta,X}c)(s)\,ds.
\end{aligned}}                                   \tag{3.13}
\]

Young's inequality and zero extension give the explicit bound

\[
\boxed{
 |I_X(v,R_{\rm proj})|
 \le2\left(|a(L)|C_0(X)
 +\|a'-a\|_{L^2(0,L)}C_{-1}(X)\right)
 \|c\|_{L^2(0,L)},}                              \tag{3.14}
\]

where

\[
 C_{-1}(X)=\int_0^X|\delta_*(x)|\,dx.            \tag{3.15}
\]

The PNT also makes `C_(-1)(infinity)` finite.  Formula (3.13) handles the
hard-endpoint jumps without differentiating `R_proj`.  It also exposes why
ordinary projection error is insufficient: (3.14) does not use the exact
low/high Fourier separation and therefore measures the full inward Sobolev
profile of `v`, not its exponentially small prolate defect.  A useful
projection theorem must improve (3.14) in the source-window-relative norm.

Finally, `q(v,R_proj;x)=0` for `x>L`.  Thus the total residual integral
splits exactly into

1. the two near terms (3.5) and (3.13) on `[0,L]`; and
2. an outer-leakage term only on `(L,infinity)`.

The second item is precisely the term to combine with a separately proved
far-tail envelope.

## 4. Why the PNT constants are uniform

Near zero, `psi_C(e^x)=0` for `0<x<log 2`, and

\[
 \delta_*(x)=1-\frac12e^{-x}\log(1-e^{-2x})
 =1-\frac12\log(2x)+O(x|\log x|).                \tag{4.1}
\]

Thus both integrands in (3.8) are integrable at zero.  A classical
quantitative PNT bound

\[
 |\psi_C(e^x)-e^x|/e^x
 \le A x^{3/2}e^{-\alpha\sqrt{x}}                \tag{4.2}
\]

for all sufficiently large `x`, together with a finite initial interval,
shows

\[
 C_0(\infty)<\infty,\qquad C_1(\infty)<\infty.   \tag{4.3}
\]

The pinned v3 PDF of Fiori--Kadiri--Swidinsky, Corollary 1.4, gives the
unconditional all-`X>2` constants

\[
 A=9.22022,\qquad \alpha=0.8476836               \tag{4.4}
\]

in the notation of (4.2).  The exact source version and PDF hash are locked
in `P3_SOURCE_LOCK.json`.  The arXiv abstract page retains the older decimal
`9.22106`; the vendored v3 PDF is binding here.  The result is unconditional
although its proof uses a finite verified-height computation; this project
does not ingest or assume a zero table.  With
`x_0=log 2` and the upper incomplete gamma function,

\[
\begin{aligned}
 C_0(\infty)^2
 &\le x_0\left(\frac52-\frac32\log x_0
                   +\frac14\log^2x_0\right)\\
 &\quad+\frac{4A^2}{(2\alpha)^8}
       \Gamma(8,2\alpha\sqrt{x_0})+\frac1{432},  \tag{4.5}\\
 C_1(\infty)^2
 &\le x_0^2\left(\frac52-\frac32\log x_0
                   +\frac14\log^2x_0\right)\\
 &\quad+\frac{4A^2}{(2\alpha)^{10}}
       \Gamma(10,2\alpha\sqrt{x_0})\\
 &\quad+\frac89e^{-6x_0}
        \left(\frac{x_0}{6}+\frac1{36}\right).  \tag{4.6}
\end{aligned}
\]

The Toeplitz constant in (3.15) is likewise completely explicit:

\[
\boxed{
 C_{-1}(\infty)
 \le x_0\left(\frac32-\frac12\log x_0\right)
 +\frac{2A}{\alpha^5}\Gamma(5,\alpha\sqrt{x_0})
 +\frac1{36}.}                                  \tag{4.7}
\]

For (4.5)--(4.7), use `1-e^(-2x)>=x` on `(0,log 2]` and

\[
 -\tfrac12e^{-x}\log(1-e^{-2x})
 \le\tfrac23e^{-3x},\qquad x\ge\log2.            \tag{4.8}
\]

The bounds are intentionally crude; their role is uniformity, not numerical
optimization.

## 5. Exact Laplace transform and the Mellin obstruction

The combined kernel has a useful exact transform.  For `Re z>0`, set

\[
 D(z)=\int_0^\infty\delta_*(x)e^{-zx}\,dx.        \tag{5.1}
\]

Stieltjes summation of the right-continuous Chebyshev function and the
absolutely convergent expansion of the logarithm give

\[
\boxed{
 D(z)=\frac1z+\frac1{z+1}\frac{\zeta'}\zeta(z+1)
 +\frac{\psi((z+3)/2)+\gamma}{2(z+1)}.}          \tag{5.2}
\]

If

\[
 \xi_R(s)=\frac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),
\]

then the digamma recurrence reduces (5.2) to

\[
\boxed{
 (z+1)D(z)=\frac{\xi_R'}{\xi_R}(z+1)
 +1+\frac\gamma2+\frac12\log\pi.}               \tag{5.3}
\]

This identity explains both the value and the limitation of a Mellin route.
For decaying exponentials, the signed functional in (3.5) is a divided
difference of the logarithmic derivative in (5.3).  But the finite Fourier
modes in the Weil matrix introduce `e^(x/2)exp(+-itx)`, corresponding
formally to `Re z=-1/2`; continuing (5.3) there reaches
`xi_R'/xi_R(1/2+it)`.  Its poles are the zeta zeros.  Therefore the
absolutely convergent half-plane `Re z>0` does not by itself give the desired
uniform critical-line estimate.  A contour shift that ignores this loss is
not a proof of the bridge.

Similarly, integrating (3.5) by parts against `delta_*` replaces the
integrable combined kernel by its distributional derivative.  That
derivative separates the continuous main term and the prime atoms, whose
total variations are individually nonintegrable.  The Hilbert--Schmidt
bound (3.7) is precisely what is lost by that extra integration by parts.

## 6. The raw Hankel norm is not yet defect-relative

Let

\[
 c=2\pi\lambda^2,\qquad d_n=1-\chi_n^2.
\]

It is tempting, but wrong, to insert a defect-sized bound for the complete
inward profile `a` in (3.7).  A source prolate arithmetic state has an
`O(1)` bulk near the center of the logarithmic interval.  Since `a(s)` also
contains the weight `e^(s/2)`, its full `H^1(0,L)` norm is not controlled by
`sqrt(d_n)`.  Therefore (3.7) by itself gives only an absolute
outer-leakage bound.  It does **not** produce the desired
`sqrt(d_n d_m)` coupling between two low prolate windows.

There is a sharper outer--outer candidate which does have two leakage-sized
factors, but it is only one part of the complete remainder.  In the formulas
below, `K_n,K_m` denote complete corrected states already known to lie in the
global radical; they must not be identified with the raw individual prolate
labels.  For the actual source construction both slots are the same corrected
combined `0/4` state `K`.  With `j in {n,m}`, set

\[
 p_j=P_NCK_j,\qquad O_j=(1-C)K_j,\qquad
 P_j=(C-P_NC)K_j,\qquad R_j=K_j-p_j=O_j+P_j.
\]

The two-sided radical identity gives the spectral bookkeeping equality

\[
 \mathcal W_Z(p_n,p_m)=\mathcal W_Z(R_n,R_m).     \tag{6.1}
\]

It is not permissible to estimate the right side through a list of zeros or
Weil positivity.  One would instead need to extend the **combined explicit
distribution** directly to the complete remainders, retaining

\[
 \mathfrak q(R_n,R_m;x)
 =\mathfrak q(O_n,O_m;x)+\mathfrak q(O_n,P_m;x)
  +\mathfrak q(P_n,O_m;x)+\mathfrak q(P_n,P_m;x). \tag{6.2}
\]

The first of these four correlations has another exact elementary
structure.  Put

\[
 B_n(t)=O_n(\ell+t),\qquad t\ge0.
\]

For `0<=x<L`, the right and left outer tails do not cross.  Splitting (2.1)
over those tails gives, for equal parities,

\[
\boxed{
 \mathfrak q(O_n,O_m;x)
 =2\int_0^\infty\left(
 \overline{B_n(t)}B_m(t+x)
 +\overline{B_n(t+x)}B_m(t)
 \right)dt.}                                    \tag{6.3}
\]

Opposite parities cancel.  Formula (6.3) is a same-side outer Toeplitz
correlation; both profiles are genuine leakage profiles.  The positive
time/frequency identity in `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` controls
their unweighted `L2` norms by the source concentration defects, subject to
the locked bump.  It does not remove the other three terms in (6.2), and at
`x=0` the `P_n,P_m` term is generally nonzero.

The later compact and mixed-projection theorems discharge all three
projection-containing terms in (6.2) for that actual corrected combined
state.  A noncircular route for what remains is therefore:

1. justify (6.1) through the combined pole--archimedean--prime distribution
   on `R_n,R_m`, rather than through the zero sum;
2. bound the weighted derivative of (6.3), retaining its oscillatory
   Toeplitz structure, by

   \[
    Cc^\theta\sqrt{d_nd_m};                       \tag{6.4}
   \]

3. prove the signed shifted floor is at least `g d_8` in the first even
   complementary window and supply the fixed-index ratio

   \[
    d_4/d_8\le C_dc^{-4}.                         \tag{6.5}
   \]

If `theta<7/4`, then (6.4) divided by the first even floor is

\[
 O\!\left(c^{\theta}\sqrt{d_4/d_8}\right)
 =O(c^{\theta-2})=o(\lambda^{-1/2}),             \tag{6.6}
\]

which has the rate required by equation (5.2) for that fixed window.  For
example, an ODE/Sobolev loss no larger than `c^(3/2)` would leave
`O(lambda^(-1))`.  The primary-source audit in
`notes/PROLATE_DEFECT_SOURCE_AUDIT.md` now proves (6.5) qualitatively, with
limit constant `105/256`, along every schedule with `c -> infinity`.  It
does not provide an effective starting threshold.  The exponent calculation
remains conditional because (6.4) and the signed floor comparison are not
proved.  The projection-containing estimates are supplied separately by
`notes/COMPACT_PROJECTION_WEIL_BOUND.md` and
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` for the actual combined state.

The residual is inversion even, so the analogous fixed odd ratio is not a
forcing term; the odd sector still requires an independent strict floor.
The growing transition window also cannot be inferred from the fixed
`4-to-8` ratio.

The projection obligation is now discharged on the exact half-integer
exponential schedule by a source-window-relative Galerkin theorem and the
two signed successor theorems.  This does not create a comparable theorem on
the polynomial diagnostic schedules and cannot be generalized to arbitrary
individual-mode outer states.

## 7. Result of the route audit

- **Combined PNT/Hankel bound:** viable for outer-leakage upper couplings;
  (3.5)--(3.8) are exact and retain cancellation.
- **Further integration by parts:** not viable as an absolute estimate; it
  restores separately infinite main and prime variations.
- **Mellin/Laplace diagonalization:** exact in `Re z>0`, but direct
  continuation of the finite-mode weight reaches `xi_R'/xi_R` on the
  critical line and supplies no noncircular uniform bound.
- **Inversion sectors:** eliminate cross-parity forcing exactly, but do not
  create a sign within the even or odd block.
- **Route to equation (5.2):** a direct explicit-distribution extension of
  (6.1) for the complete remainder, the outer--outer estimate (6.4), and a
  signed floor comparison would make the fixed first-even-window scale
  sufficient.  All three projection-containing correlations in (6.2) are
  now controlled on the locked exponential schedule for the actual corrected
  combined state.  The growing transition window and physical conditioning
  remain central unresolved parts.
