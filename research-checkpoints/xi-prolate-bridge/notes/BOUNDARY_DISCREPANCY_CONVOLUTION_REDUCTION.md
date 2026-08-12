# Boundary-discrepancy convolution reduction

## 0. Claim boundary and source pin

This note extracts an exact scalar boundary identity from the finite Weil
operator.  It converts the open mixed pole reserve into a one-sided,
shrinking-window statement for a signed convolution of the actual finite
even ground with a weighted-prime discrepancy.  The calculation is exact at
each finite `(lambda,N)`; it is not an asymptotic estimate.

No positivity of the ground, of the discrepancy, or of the Weil form is
assumed.  No list of zeta zeros is used.  The result does not prove the
required boundary localization, equation (5.2) of `DIRECT_RH_ATTACK.md`, a
complementary sector floor, locally uniform determinant convergence, or the
Riemann hypothesis.  The formal project state remains `P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The formulas used below are re-derived from source equations
(3.8)--(3.16), (3.19), and (4.1)--(4.4), with the mandatory minus sign on
the prime block and the inclusive endpoint `n<=lambda^2`.  As recorded in
`P0_SOURCE_LOCK.json`, the duplicated `c(L)` in printed (4.14) is removed
to agree with the defining formulas (3.15) and (4.4).  Nothing here repairs
or conceals the separate source-normalization inconsistency recorded in that
lock.

## 1. Locked interval and arithmetic functions

Fix `lambda>1` and write

\[
 a=\log\lambda,\qquad L=2a,\qquad I=[-a,a].       \tag{1.1}
\]

The interval carries Lebesgue measure, and every function on `I` is extended
by zero to the real line before a translation is applied.  Put

\[
 W(e^t)=\sum_{1<n\leq e^t}\frac{\Lambda(n)}{\sqrt n},
 \qquad t\geq0,                                  \tag{1.2}
\]

with the right-continuous, inclusive convention, and define

\[
 D(t)=W(e^t)-2(e^{t/2}-1).                       \tag{1.3}
\]

Thus, on `[0,L]`, `D` is exactly the weighted-PNT discrepancy
`D_lambda` of `notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md`.  Its
Stieltjes derivative is

\[
 dD(t)=\sum_{n\geq2}\frac{\Lambda(n)}{\sqrt n}
             \delta_{\log n}(dt)-e^{t/2}\,dt,    \tag{1.4}
\]

restricted to `[0,L]` when it is used in the finite operator.  In
particular, a prime power at `n=lambda^2` is retained.

The full one-sided archimedean Levy density and its boundary tail are

\[
 \rho(t)=\frac{e^{-t/2}}{1-e^{-2t}},\qquad
 H_0(t)=\int_t^\infty\rho(u)\,du,\qquad t>0.     \tag{1.5}
\]

This is the full archimedean density, including its first summand; it must
not be confused with the pole-cancelled tail density in the normal form.
Finally set

\[
 \boxed{F(t)=D(t)-H_0(t).}                       \tag{1.6}
\]

The function `F` is the single signed boundary discrepancy used below.

## 2. Exact archimedean tail and local structure of `F`

With `r=e^{-t/2}`, substitution in (1.5) gives

\[
\begin{aligned}
 H_0(t)
 &=2\int_0^r\frac{du}{1-u^4}\\
 &=\frac12\log\!\left(\frac{1+e^{-t/2}}
                            {1-e^{-t/2}}\right)
   +\arctan(e^{-t/2}).                            \tag{2.1}
\end{aligned}
\]

This closed form fixes every constant.  At the hard boundary,

\[
 H_0(t)=-\frac12\log t+\log2+\frac\pi4
         -\frac t4+\frac{t^2}{96}+O(t^3),
 \qquad t\downarrow0.                            \tag{2.2}
\]

For `0<t<log 2`, the weighted prime sum is empty, so (1.3) and (2.2)
give the sharper local expansion

\[
 \boxed{
 F(t)=\frac12\log t-\log2-\frac\pi4
      -\frac{3t}{4}-\frac{25t^2}{96}+O(t^3).}    \tag{2.3}
\]

In particular, `F(t)` tends to minus infinity at zero, but its logarithmic
singularity is Lebesgue integrable.  Between prime-power locations,

\[
 \boxed{F'(t)=\rho(t)-e^{t/2}.}                  \tag{2.4}
\]

At every integer `n>=2`, the right-continuous jump is

\[
 F(\log n)-F(\log n-)
   =\frac{\Lambda(n)}{\sqrt n};                  \tag{2.5}
\]

this is nonzero exactly at prime powers.  Equivalently, in distributions,

\[
 dF(t)=\bigl(\rho(t)-e^{t/2}\bigr)dt
       +\sum_{n\geq2}\frac{\Lambda(n)}{\sqrt n}
          \delta_{\log n}(dt).                  \tag{2.6}
\]

Equations (2.3)--(2.6) make the relevant geometry explicit: `F` is a
signed sawtooth with upward arithmetic jumps, not a positive kernel.

## 3. The exact boundary formula for `A1`

Let

\[
 \mathcal A=m_\lambda(D_{\rm op})-m_\lambda(0)I, \tag{3.1}
\]

where `D_op` denotes the Fourier differentiation operator and
`m_lambda` is the complete source multiplier with the minus-prime
convention.  Apply its translation/Dirichlet representation to the constant
function `1_I`.

For an interior point `y`, an archimedean translation is killed exactly
when its length exceeds `a-y` at the right boundary or `a+y` at the left
boundary.  A prime translation by `log n` survives on the two sides exactly
for `n<=lambda e^{-y}` and `n<=lambda e^y`, respectively.  Therefore, as
an equality of `L^2(I)` representatives and pointwise for almost every
`y in I`, one has

\[
\boxed{
\begin{aligned}
 (\mathcal A1_I)(y)
 &=H_0(a-y)+H_0(a+y)+2W(\lambda^2)\\
 &\quad-W(\lambda e^{-y})-W(\lambda e^y).
                                                        \tag{3.2}
\end{aligned}}
\]

The qualification "almost every" is essential: hard zero extension and
the right-continuous prime steps allow different point representatives on
the finite set where a translated endpoint lands exactly on a prime-power
jump.  Those representatives give the same weak pairing.

Using `D(L)=W(lambda^2)-2(lambda-1)`, (1.3), and (1.6), direct algebra
rewrites (3.2) as

\[
\boxed{
\begin{aligned}
 (\mathcal A1_I)(y)
 &=4\lambda+2D(L)-4\sqrt\lambda\cosh(y/2)\\
 &\quad-F(a-y)-F(a+y)
 \qquad\text{for a.e. }y\in I.                  \tag{3.3}
\end{aligned}}
\]

Formula (3.3), not a separately bounded prime/archimedean decomposition, is
the cancellation-preserving boundary identity.

## 4. Weak compressed-ground test

Let `E_N` be the locked finite Fourier space.  It contains `1_I`, since its
zero mode is `L^{-1/2}1_I`.  Let `x in E_N` be a real inversion-even
eigenvector of the compressed complete Weil operator,

\[
 P_NQ_\lambda P_Nx=\epsilon x,                  \tag{4.1}
\]

and define the signed moments

\[
 X=\int_Ix(y)\,dy,
 \qquad h=\int_I\cosh(y/2)x(y)\,dy.             \tag{4.2}
\]

No pointwise eigen-equation for the uncompressed operator is needed.  Test
(4.1) weakly against `1_I in E_N`.  On the even sector the pole operator is
`2|cosh(./2)><cosh(./2)|`, while

\[
 m_\lambda(0)+4\lambda+2D(L)=c_* ,
 \qquad c_*=\psi(1/4)-\log\pi+4.                \tag{4.3}
\]

Also

\[
 8\sinh(a/2)-4\sqrt\lambda=-\frac4{\sqrt\lambda}.
                                                               \tag{4.4}
\]

Inserting (3.3) into the weak test and using (4.3)--(4.4) gives

\[
 \epsilon X=c_*X-
 \int_I\bigl(F(a-y)+F(a+y)\bigr)x(y)\,dy
 -\frac4{\sqrt\lambda}h.                        \tag{4.5}
\]

This identity is exact for every finite compression.  It does not require
`x` to lie in the operator domain of the uncompressed singular generator.

## 5. The signed boundary quotient and exact reserve window

Assume `X!=0` and define

\[
\boxed{
 \mathcal C_\lambda(x)=\frac1X
  \int_I\bigl(F(a-y)+F(a+y)\bigr)x(y)\,dy.}      \tag{5.1}
\]

Because `x` is even, changing variables on the two boundary terms gives the
convolution form

\[
 \boxed{
 \mathcal C_\lambda(x)=\frac2X
       \int_0^L F(t)x(a-t)\,dt.}                 \tag{5.2}
\]

The integral is finite for a finite Fourier vector because the only hard
endpoint singularity of `F` is logarithmic.  Division of (4.5) by `X`
proves the central exact identity

\[
 \boxed{
 \mathcal C_\lambda(x)+\epsilon-c_*
   =-\frac4{\sqrt\lambda}\frac hX.}             \tag{5.3}
\]

The quotient (5.1) is signed.  It is not an expectation: `x/X` has not been
proved nonnegative, and `F` is neither nonnegative nor bounded at the hard
endpoint.  Consequently minimum/maximum, Jensen, Markov, and
probability-measure arguments do not follow from (5.1).

On any domain where `h/X>0`, (5.3) gives the strict side

\[
 \mathcal C_\lambda(x)<c_*-\epsilon.             \tag{5.4}
\]

More precisely, for every fixed `B>=0`, under the hypotheses `X!=0` and
`h/X>0`,

\[
\boxed{
 \frac hX\leq B
 \quad\Longleftrightarrow\quad
 c_*-\epsilon-\frac{4B}{\sqrt\lambda}
 \leq\mathcal C_\lambda(x)<c_*-\epsilon.}       \tag{5.5}
\]

Thus the desired uniform critical exponential-moment reserve is exactly a
one-sided localization of the signed convolution inside a window of width
`4B/sqrt(lambda)`.  A bound such as
`|C_lambda(x)|=O(1)` is far too weak: even if `epsilon=O(1)`, (5.3) would
only give `h/X=O(sqrt(lambda))`.  The needed statement is the signed
`lambda^{-1/2}` cancellation in (5.5).

## 6. Completed-xi Laplace transform

The arithmetic content of `F` can also be written exactly in a safe
right half-plane.  Let

\[
 \xi(z)=\frac12z(z-1)\pi^{-z/2}\Gamma(z/2)\zeta(z)              \tag{6.1}
\]

and use the same `c_*` as in (4.3).  For `Re(s)>1/2`, absolute convergence
of the Euler sum gives

\[
 \int_0^\infty W(e^t)e^{-st}\,dt
   =-\frac1s\frac{\zeta'}{\zeta}\!\left(s+\frac12\right),       \tag{6.2}
\]

whereas Fubini applied to (1.5) gives

\[
 \int_0^\infty H_0(t)e^{-st}\,dt
 =\frac1{2s}\left[
   \psi\!\left(\frac14+\frac s2\right)-\psi\!\left(\frac14\right)
                  \right].                       \tag{6.3}
\]

Combining (1.3), (1.6), (6.2), and (6.3), then using

\[
 \frac{\xi'}{\xi}(z)=\frac1z+\frac1{z-1}
 -\frac12\log\pi+\frac12\psi(z/2)
 +\frac{\zeta'}{\zeta}(z),                      \tag{6.4}
\]

proves

\[
\boxed{
 \int_0^\infty\left(F(t)-\frac{c_*}{2}\right)e^{-st}\,dt
 =\frac1s\left[
 -\frac{\xi'}{\xi}\!\left(\frac12+s\right)
 +\frac1{\frac12+s}-2\right],
 \qquad \Re s>\frac12.}                         \tag{6.5}
\]

The centering `c_*/2` is forced by the same exact scalar cancellation as
(4.3); it is not a fitted constant.

Equation (6.5) is an ordinary-Laplace identity proved here only in the
displayed half-plane.  Its right side has a meromorphic continuation, but
moving left is zero-sensitive: poles of `xi'/xi` encode precisely the zeros
under study.  The safe-half-plane calculation therefore supplies no
critical-line bound without a new, noncircular argument.  It would be wrong
to call meromorphic continuation impossible; what is absent is the uniform
estimate needed after that continuation.

## 7. Narrow route exclusions

The exact reduction rules out only the following shortcuts.

1. **Positive-kernel averaging.**  The effective Stieltjes measure (2.6)
   is signed, `F` tends to minus infinity at zero and has upward prime-power
   jumps, and `x/X` is not known to be positive.  No Markov or maximum
   principle is available from the displayed formulas.

2. **Magnitude-only control.**  Separate absolute bounds on `D`, `H_0`, or
   their convolution discard the `lambda^{-1/2}` signed cancellation in
   (5.5).  Uniform boundedness of the quotient itself would still miss the
   target by a factor of order `sqrt(lambda)`.

3. **Unjustified Laplace continuation.**  Formula (6.5) is exact for
   `Re(s)>1/2`; its continuation does not provide a bound when zero-sensitive
   poles are approached.  Assuming such a bound would reinsert the spectral
   information the bridge is meant to prove.

These observations are deliberately narrow.  They do not rule out a proof
that exploits the actual signed prime-power jumps, the exact boundary
profile of the finite ground, or a new zero-insensitive transform estimate.

## 8. The remaining boundary theorem

For the actual deterministic schedule `N=N(lambda)`, let
`x_(lambda,N)` be the inversion-even finite ground and let
`epsilon_(lambda,N)`, `X_(lambda,N)`, and `h_(lambda,N)` be defined by
(4.1)--(4.2).  The missing result exposed by this note is:

> **Boundary-discrepancy localization target.**  Prove, without assuming
> global Weil positivity or a list of real zeta zeros, that there are finite
> constants `B` and `lambda_0` such that for every scheduled
> `lambda>=lambda_0`, one has `X_(lambda,N)!=0`,
> `h_(lambda,N)/X_(lambda,N)>0`, and
> \[
> c_*-\epsilon_{\lambda,N}-\frac{4B}{\sqrt\lambda}
> \leq\mathcal C_\lambda(x_{\lambda,N})
> <c_*-\epsilon_{\lambda,N}.                    \tag{8.1}
> \]

By (5.5), (8.1) is exactly the uniform bound
`0<h_(lambda,N)/X_(lambda,N)<=B`.  It would close the mixed scalar reserve
identified at checkpoint 0.50, but it would not by itself prove the
residual/complementary-gap estimate in equation (5.2), either sector floor,
or the determinant limit.  Those remain separate obligations.

The contribution of this reduction is therefore a precise target: control
the signed boundary convolution to one side and to order
`lambda^{-1/2}`.  No asymptotic theorem establishing that control is claimed
here.
