# Weighted-PNT-discrepancy normal form

## 0. Claim boundary and outcome

This note gives an exact source-specific normal form for the complete finite
Weil operator.  The pole, the continuous main density of the finite prime
sum, and the first archimedean Levy summand cancel to a scalar.  After the
scalar is removed, every arithmetic dependence is carried by one signed
Stieltjes translation operator built from the weighted prime-number-theorem
discrepancy.

The result is a reformulation, not the missing asymptotic estimate.  It does
not prove a mixed-resolvent reserve, a complementary sector gap, equation
(5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or
the Riemann hypothesis.  It also does not assume a zero table or global Weil
positivity.  The formal project state remains `P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The formulas used here are source equations (3.5), (3.8)--(3.16), (3.19),
and (4.1)--(4.4), with the duplicated `c(L)` in printed (4.14) removed as
required by `P0_SOURCE_LOCK.json`.

## 1. Locked conventions

Fix `lambda>1` and put

\[
 a=\log\lambda,\qquad L=2a,\qquad I=[-a,a].        \tag{1.1}
\]

Functions on `I` use Lebesgue measure and are extended by zero to the real
line.  The Fourier--Mellin convention is

\[
 \widehat f(t)=\int_I f(x)e^{-itx}\,dx,\qquad
 \|f\|_2^2=\int_{\mathbb R}|\widehat f(t)|^2
                         \frac{dt}{2\pi}.           \tag{1.2}
\]

Inversion is `Jf(x)=f(-x)`.  The source modes are

\[
 V_n(x)=(-1)^nL^{-1/2}e^{2\pi inx/L},
 \qquad |n|\leq N.                                  \tag{1.3}
\]

The complete real-axis multiplier, with the mandatory minus sign on the
prime block, is

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left(\frac14+\frac{it}{2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}
       \frac{\Lambda(n)}{\sqrt n}\cos(t\log n).     \tag{1.4}
\]

The endpoint is inclusive.  The parameter in (1.4) is `lambda^2`, while the
half-length of the logarithmic interval is `log(lambda)`; they are not
interchangeable.

The pole form is

\[
 P(f,g)=
 \overline{\widehat f(-i/2)}\widehat g(i/2)
 +\overline{\widehat f(i/2)}\widehat g(-i/2).       \tag{1.5}
\]

Thus the complete source operator is

\[
 Q_\lambda=C_I^*m_\lambda(D)C_I+P,                 \tag{1.6}
\]

where `C_I` denotes zero extension.  Formula (1.6), rather than separately
estimated block norms, is the object transformed below.

## 2. Translation and Dirichlet forms

For `h>=0`, define the reflected two-sided translation

\[
 (K_hf)(x)=\widetilde f(x+h)+\widetilde f(x-h),
 \qquad x\in I.                                    \tag{2.1}
\]

For the locked modes,

\[
 \langle V_n,K_hV_m\rangle=q(V_n,V_m)(h),          \tag{2.2}
\]

where `q` is exactly the source correlation kernel used in the finite matrix
formulas.  In particular `K_L=0` on `I` up to null endpoints.

For a symmetric Levy measure `nu`, define its zero-extension Dirichlet form

\[
 \mathfrak a_\nu(f,g)
 =\frac12\int_{\mathbb R}\!\int_{\mathbb R}
  (\widetilde f(x+h)-\widetilde f(x))
  \overline{(\widetilde g(x+h)-\widetilde g(x))}
  \,dx\,\nu(dh).                                   \tag{2.3}
\]

Its real-axis multiplier is

\[
 a_\nu(t)=\int_{\mathbb R}(1-\cos(th))\,\nu(dh).  \tag{2.4}
\]

The full zero extension in (2.3) is essential.  Translations with
`|h|>L` contribute a boundary-killing scalar even though the translated
functions have disjoint support.

## 3. The archimedean split

The digamma expansion gives, with `u_j=j+1/4`,

\[
 \operatorname {Re}\psi\!\left(\frac14+\frac{it}{2}\right)
 -\psi\!\left(\frac14\right)
 =\sum_{j\geq0}\frac{t^2}{u_j(t^2+4u_j^2)}.        \tag{3.1}
\]

Equivalently, (3.1) is the Levy multiplier for

\[
 \nu_{\rm arch}(dh)=
 \sum_{j\geq0}e^{-(2j+1/2)|h|}\,dh.               \tag{3.2}
\]

Separate the first summand from the tail:

\[
 \nu_0(dh)=e^{-|h|/2}\,dh,\qquad
 \boxed{
 \nu_{\rm tail}(dh)=
 \frac{e^{-5|h|/2}}{1-e^{-2|h|}}\,dh.}            \tag{3.3}
\]

Let `A_tail` be the operator associated with (2.3) for
`nu_tail`.  Since `nu_tail(h)` is asymptotic to `1/(2|h|)` at zero,
`A_tail` is most naturally an unbounded quadratic-form operator.  Every
finite Fourier compression below is nevertheless finite and exact.

For the first summand, direct integration yields

\[
 A_0=4I-K_-,\qquad K_-(x,y)=e^{-|x-y|/2}.          \tag{3.4}
\]

No truncation of `nu_tail` at `|h|=L` is allowed.  Its omitted killing term
would be

\[
 2I\int_L^\infty
 \frac{e^{-5h/2}}{1-e^{-2h}}\,dh.                 \tag{3.5}
\]

## 4. Weighted PNT discrepancy

Define the weighted Chebyshev sum

\[
 W(X)=\sum_{1<n\leq X}\frac{\Lambda(n)}{\sqrt n}  \tag{4.1}
\]

and, for `0<=h<=L`,

\[
 \boxed{
 D_\lambda(h)=W(e^h)-2(e^{h/2}-1).}               \tag{4.2}
\]

As a signed Stieltjes measure on `[0,L]`,

\[
 dD_\lambda(h)=
 \sum_{1<n\leq\lambda^2}
   \frac{\Lambda(n)}{\sqrt n}\delta_{\log n}(dh)
 -e^{h/2}\,dh.                                    \tag{4.3}
\]

The source arithmetic is therefore retained with its signs and phases; it
has not been replaced by an absolute prime sum.

Define

\[
 \boxed{
 (T_Df)(x)=\int_{[0,L]}(K_hf)(x)\,dD_\lambda(h).} \tag{4.4}
\]

The continuous main measure

\[
 \nu_C(dh)=e^{|h|/2}{\bf1}_{0<|h|\leq L}\,dh     \tag{4.5}
\]

has total mass `4(lambda-1)`, and its Dirichlet operator is

\[
 A_C=4(\lambda-1)I-K_+,
 \qquad K_+(x,y)=e^{|x-y|/2}.                      \tag{4.6}
\]

The residual signed prime generator is

\[
 A_\delta=2D_\lambda(L)I-T_D.                     \tag{4.7}
\]

Although an endpoint atom at `h=L` is included in (4.3), it is annihilated
by `K_L`.  Consequently matrix agreement alone cannot detect omission of a
prime power exactly equal to `lambda^2`; the prime inventory must be checked
separately.

## 5. Exact pole--main--archimedean cancellation

Put

\[
 p_+(x)=\cosh(x/2),\qquad p_-(x)=\sinh(x/2).       \tag{5.1}
\]

On the inversion sectors, the pole is

\[
 P_+=2|p_+\rangle\langle p_+|,
 \qquad P_-=-2|p_-\rangle\langle p_-|.            \tag{5.2}
\]

Direct exponential algebra gives

\[
 \boxed{P_+-K_+=K_-\quad\hbox{on the even sector},}       \tag{5.3}
\]

\[
 \boxed{P_--K_+=K_-\quad\hbox{on the odd sector}.}        \tag{5.4}
\]

Equivalently, before parity restriction, the pole kernel is
`2*cosh((x-y)/2)=K_+(x,y)+K_-(x,y)`.  Combining (3.4), (4.6), and
(5.3)--(5.4) proves

\[
 P+A_0+A_C=4\lambda I.                             \tag{5.5}
\]

The scalar value of the complete multiplier at zero is

\[
 m_\lambda(0)=
 \psi\!\left(\frac14\right)-\log\pi-2W(\lambda^2),       \tag{5.6}
\]

while

\[
 D_\lambda(L)=W(\lambda^2)-2(\lambda-1).          \tag{5.7}
\]

Hence all lambda-dependent scalar mass cancels:

\[
\begin{aligned}
 m_\lambda(0)+4\lambda+2D_\lambda(L)
 &=\psi\!\left(\frac14\right)-\log\pi+4\\
 &=4-\gamma-\frac\pi2-3\log2-\log\pi.
                                                               \tag{5.8}
\end{aligned}
\]

Define the source-independent constant

\[
 \boxed{c_*=\psi(1/4)-\log\pi+4.}                 \tag{5.9}
\]

### Theorem 5.1 (weighted-PNT-discrepancy normal form)

As quadratic forms on the source interval,

\[
 \boxed{Q_\lambda=c_*I+A_{\rm tail}-T_D.}         \tag{5.10}
\]

Therefore, on both inversion parities and on every locked finite Fourier
compression,

\[
 \boxed{
 Q_{\lambda,N,\pm}
 =c_*I+(A_{\rm tail})_{N,\pm}-(T_D)_{N,\pm}.}      \tag{5.11}
\]

**Proof.**  Subtract (5.6) from (1.4), use (3.2) for the archimedean
difference and the atomic symmetric prime Levy measure for the prime
difference.  Split the archimedean measure by (3.3), and the prime measure by
(4.3)--(4.7).  Equations (5.5) and (5.8) then leave precisely (5.10).
Compression and parity restriction preserve an exact form identity, proving
(5.11).  \(\square\)

## 6. Exact relation to the mixed reserve

Let `x` be a real inversion-even simple ground vector of a finite compression
and put

\[
 X=\int_Ix(y)\,dy,
 \qquad h=\int_I\cosh(y/2)x(y)\,dy,
 \qquad x_0=X/\sqrt L.                             \tag{6.1}
\]

On the checkpoint-0.50 domain, `X` and `h` are nonzero and have the same
sign.  Its exact pole-deleted inverse identity becomes

\[
 \boxed{
 d_0=-\frac{X}{2\sqrt L\,h},\qquad
 \frac g{\sqrt L}=\frac hX,
 \qquad -\sqrt Ld_0=\frac X{2h}.}                 \tag{6.2}
\]

Thus the open reserve is exactly a critical exponential-moment estimate for
the actual finite ground:

\[
 \boxed{
 \frac{\int_I\cosh(y/2)x(y)\,dy}{\int_Ix(y)\,dy}
 \leq C}                                          \tag{6.3}
\]

with a constant independent of the chosen unbounded schedule.  Formula
(5.10) identifies the operator whose ground orientation must satisfy (6.3),
but does not prove it.

The scalar cancels from the prolate residual as well.  If `kappa` is the
normalized projected prolate state and `H_lambda=A_tail-T_D`, then

\[
 (Q-\langle\kappa,Q\kappa\rangle)\kappa
 =(H_\lambda-\langle\kappa,H_\lambda\kappa\rangle)\kappa.
                                                               \tag{6.4}
\]

Equation (6.4) retains the combined residual before absolute values.  It
does not control the complementary minimum or the shifted resolvent in
equation (5.2) of `DIRECT_RH_ATTACK.md`.

## 7. A direct killing identity

Let

\[
 \mathscr A=m_\lambda(D)-m_\lambda(0)I,
 \qquad z=\epsilon-m_\lambda(0),
 \qquad \kappa_{\mathscr A}=\mathscr A1_I.         \tag{7.1}
\]

The even ground equation is

\[
 (\mathscr A-zI)x=-2h\cosh(y/2).                  \tag{7.2}
\]

Pairing with `1_I` and using

\[
 \int_I\cosh(y/2)\,dy=4\sinh(a/2)                \tag{7.3}
\]

gives the exact signed identity

\[
 \boxed{
 \frac hX=
 \frac{z-\displaystyle
       \frac{\langle\kappa_{\mathscr A},x\rangle}{X}}
      {8\sinh(a/2)}.}                              \tag{7.4}
\]

Equivalently,

\[
 \boxed{
 -d_0=\frac{4\sinh(a/2)}
 {\sqrt L\left(z-
  \langle\kappa_{\mathscr A},x\rangle/X\right)}.} \tag{7.5}
\]

The numerator and the two terms in the denominator of (7.5) are large on
the relevant scale.  The desired estimate is their signed cancellation.
Replacing (7.4) by separate absolute norms discards precisely that effect.

## 8. Exact link to the ordinary PNT error

Let

\[
 E(X)=\psi_C(X)-X,
 \qquad \psi_C(X)=\sum_{n\leq X}\Lambda(n).        \tag{8.1}
\]

Partial summation gives the endpoint-compatible identity

\[
 \boxed{
 D_\lambda(\log X)=1+\frac{E(X)}{\sqrt X}
 +\frac12\int_1^X E(t)t^{-3/2}\,dt.}              \tag{8.2}
\]

The explicit Fiori--Kadiri--Swidinsky estimate pinned in `SOURCES.md` makes
the right side effective, but its absolute majorant still grows.  In
particular, a direct integration-by-parts entry formula is

\[
 (T_D)_{nm}=-\int_0^L D_\lambda(h)q'_{nm}(h)\,dh,  \tag{8.3}
\]

because `D_lambda(0)=0` and `q_nm(L)=0`.  Even

\[
 (T_D)_{00}=\frac2L\int_0^L D_\lambda(h)\,dh      \tag{8.4}
\]

is not uniformly controlled by inserting only the absolute PNT envelope.
The sign and translation geometry of the actual discrepancy are therefore
essential.

## 9. Continuous-main-density no-go model

Set `D_lambda=0` while retaining the same interval, zero extension,
archimedean tail, pole forms, and continuous prime main density.  The exact
cancellation above gives

\[
 Q_\lambda^{\rm cont}=c_*I+A_{\rm tail}.           \tag{9.1}
\]

This is a nonarithmetic comparison model.  It is not a substitute for the
discrete prime measure.  Its purpose is to test any proposed argument which
uses the discrepancy only through an absolute upper envelope: the zero
discrepancy satisfies every such upper envelope.

The tail measure has finite variance

\[
 \sigma^2=\int_{\mathbb R}h^2\nu_{\rm tail}(dh)
 =\frac12\zeta(3,5/4).                             \tag{9.2}
\]

Under `x=a*u`, the killed forms obey the finite-variance Dirichlet scaling

\[
 a^2A_{\rm tail}\longrightarrow
 -\frac{\sigma^2}{2}\frac{d^2}{du^2}
 \quad\hbox{on }[-1,1].                            \tag{9.3}
\]

The statement in (9.3) is form convergence: Taylor expansion proves the
limsup on smooth compactly supported functions, the finite second moment
gives domination, and the usual difference-quotient compactness proves the
liminf and the Dirichlet boundary condition.  Consequently the positive
even ground converges in the rescaled variable to a multiple of
`cos(pi*u/2)`.  A fixed amount of its mass remains on `u in [1/2,3/4]`, so

\[
 \frac{\int_I\cosh(y/2)x(y)\,dy}{\int_Ix(y)\,dy}
 \geq c e^{a/4}.                                   \tag{9.4}
\]

Thus the reserve in (6.2) fails in this continuous-main model.  This does
not say that the arithmetic discrepancy fails; it proves that the exact
signed `T_D`, rather than its absence or a magnitude-only upper bound, must
do the localization work.

## 10. Actual finite total-positivity route obstruction

There is also a source-specific obstruction to replacing the missing signed
estimate by a generic total-positivity theorem.  At the exact pilot

\[
 \lambda=2,\qquad L=2\log2,\qquad N=4,             \tag{10.1}
\]

use the normalized even basis

\[
 e_0^+=V_0,\qquad e_n^+=(V_n+V_{-n})/\sqrt2.       \tag{10.2}
\]

Define the entirely off-diagonal minor

\[
 \Delta_{1324}=
 \det\begin{pmatrix}
 (Q_+)_{12}&(Q_+)_{14}\\
 (Q_+)_{32}&(Q_+)_{34}
 \end{pmatrix}.                                    \tag{10.3}
\]

Because all four entries are off diagonal, (10.3) is invariant under every
scalar shift `Q_+-sI`, including the ground shift.  Independent 256- and
512-bit FLINT/Arb assemblies enclose

\[
 \boxed{-0.052886<\Delta_{1324}<-0.052885.}        \tag{10.4}
\]

All 81 raw source entries have positive lower endpoints, while the even
principal order-two minor on indices `{0,1}` has a positive enclosure near
`7.6913924*10^(-6)`.  Hence the natural even matrix is neither totally
nonnegative nor sign-regular of order two.  The negative minor persists
under scalar shifts and positive diagonal scalings.

This finite obstruction does not rule out a different ordering, a
non-diagonal transformation, an eventual large-`lambda` property, or a
different source-specific determinant inequality.  Both ball paths use the
same FLINT/Arb library; one uses the closed pole/corrected archimedean/source
prime formulas and the other uses direct pole integration, the independent
alpha--beta--gamma archimedean path, and independent prime-power
factorization.

## 11. Computational audit and remaining target

The producer reconstructs both sides of (5.11) from exact decimal source
parameters, finite prime-power enumeration, and arbitrary-precision
transcendentals.  It serializes the pole, critical archimedean, continuous
prime-main, tail, discrepancy, scalar, and combined matrices separately so
that the large pre-cancellation norms remain visible.

The verifier independently enumerates prime powers and reconstructs the
source and normal-form paths.  It does not trust producer matrices or pass
booleans.  Both point-valued paths use `mpmath`; this shared-library
limitation is explicit.  The separate total-positivity obstruction is
replayed from two outward FLINT/Arb paths.

The exact remaining theorem is not an estimate on the separate blocks.  It
is a source-specific localization or signed-correlation statement for the
ground of

\[
 H_\lambda=A_{\rm tail}-T_D                       \tag{11.1}
\]

strong enough to prove (6.3) on a common unbounded schedule, together with
the prolate residual and complementary-gap estimates required by equation
(5.2) of `DIRECT_RH_ATTACK.md`.
