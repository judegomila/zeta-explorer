# Derivative-radical odd split and endpoint obstruction

## 0. Scope and outcome

This note tests whether logarithmically differentiating the exact global
radical state can place the projected even state below the odd floor.  It
gives three exact identities.

1. The distributional logarithmic derivative of the global state still
   vanishes at every zero evaluation, and logarithmic differentiation
   commutes with the finite Fourier projection on the periodic window.
2. For `p=P_N C K` and `x=Dp`, the odd Rayleigh value is a
   zero-ordinate-weighted sampling energy of the **boundary-zero primitive**
   `p-(delta p)e_0`, not of `p` itself.
3. The desired odd comparison still requires the transverse floor and
   inverse-weighted coupling in the endpoint Schur gate.  A positive
   derivative Rayleigh split alone is insufficient.

If the projected endpoint were exactly zero, the derivative identity would
reduce the sign to a comparison between the least zero ordinate and one
explicit limiting Xi moment.  The actual semilocal projected state has a
small endpoint trace that is not forced to vanish exactly.  Its correction
cannot be
discarded or split after ordinate weighting: the two separated sequences
need not be square summable, and no such separate bound is currently
available.  Current source locks give neither the required relative endpoint
estimate nor the needed initial zero-free certificate.

No zero table, global Weil positivity, signed odd floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, or Riemann-hypothesis conclusion
is used or proved.  The formal project state remains `P0_INVALIDATED`.

## 1. Periodic derivative and the global zero-evaluation radical

Put

\[
 I=[-\ell,\ell],\qquad L=2\ell,
 \qquad
 \phi_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L}.
                                                               \tag{1.1}
\]

Thus both endpoint values of every mode equal `L^(-1/2)`.  Let

\[
 D\phi_n=n\phi_n,
 \qquad D={L\over2\pi i}\partial_t,\qquad
 e_0=\phi_0,\qquad
 \delta\!\left(\sum_nc_n\phi_n\right)=\sum_nc_n.       \tag{1.2}
\]

Physical endpoint evaluation is `L^(-1/2) delta`.  Let `K` be the corrected,
inversion-even global source state from
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.  Its two Mellin/Fourier
evaluations vanish at every nontrivial-zero parameter `s`:

\[
 \widehat K(s)=\widehat K(\bar s)=0.                    \tag{1.3}
\]

The state is BV and may have arithmetic jumps, so its derivative need not
be an `L2` vector.  Distributionally, however, decay at both infinite ends
gives, first on the real transform axis and then throughout the common
Fourier--Laplace strip of `K` and `DK`,

\[
 \widehat{DK}(z)={Lz\over2\pi}\widehat K(z).             \tag{1.4}
\]

The nontrivial-zero parameters lie in this strip.  Consequently `DK` is an
odd **zero-evaluation radical**.  Equation (1.4) is not asserted for
arbitrary complex `z`, and it does not by itself place `DK` in the source
Hilbert-space form domain; that stronger claim would ignore its atomic jump
derivative.

The restriction of the even state to `I` has equal one-sided endpoint
traces and is therefore a periodic BV distribution.  Fourier coefficient
multiplication gives the exact distributional commutation rule

\[
 D P_N(CK)=P_ND_{\rm circ}(CK).                           \tag{1.5}
\]

Endpoint atoms belonging to the derivative of the *global* state must be
kept in the exterior derivative remainder; they are not silently identified
with the circle derivative in (1.5).

Set

\[
 p=P_NCK,\qquad x=Dp,
 \qquad A=\|p\|^2,\qquad B=\|x\|^2.                     \tag{1.6}
\]

Then `p` is even and `x` is odd.  With zero extension of `x`, define

\[
 R_1=DK-x.                                               \tag{1.7}
\]

At every zero evaluation,

\[
 \widehat{R_1}(s)=-\widehat x(s),\qquad
 \widehat{R_1}(\bar s)=-\widehat x(\bar s).             \tag{1.8}
\]

Thus the same absolutely convergent compact--compact spectral series used
for the original radical leakage gives

\[
 \langle x,Q_-x\rangle={\cal W}_Z(R_1,R_1).             \tag{1.9}
\]

This is a cancellation identity, not a positivity statement.

## 2. Exact boundary-zero primitive

Write

\[
 d=\delta p,\qquad e={d\over\sqrt L}=p(-\ell)=p(\ell),
 \qquad f=R_0p:=p-de_0.                                  \tag{2.1}
\]

Then

\[
 \delta f=0,\qquad Df=Dp=x.                              \tag{2.2}
\]

Integration by parts has no finite-endpoint term for `f`, so for every
complex `z`,

\[
 \boxed{\widehat x(z)={Lz\over2\pi}\widehat f(z)
 ={Lz\over2\pi}\{\widehat p(z)-d\widehat e_0(z)\}.}     \tag{2.3}
\]

Equivalently, if one integrates `p` before subtracting its endpoint,

\[
 \boxed{\widehat x(z)={L\over2\pi}
   \{z\widehat p(z)-2e\sin(z\ell)\}.}                    \tag{2.4}
\]

The endpoint sign and the factor two in (2.4) are mandatory.  Formula
(2.3) is exactly the derivative transport in Section 5 of
`notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md`, applied to the oblique
boundary primitive `R_0p`.

There is a useful warning already at this exact level.  On real ordinates,

\[
 \widehat e_0(\gamma)={2\sin(\gamma\ell)\over\sqrt L\,\gamma}.
                                                               \tag{2.5}
\]

The unweighted samples of `e_0` are square summable against the classical
zero count.  After multiplication by `gamma`, the right side of (2.5) no
longer decays, so its sample squares are not summable in general.  Hence

\[
 \Gamma_L\{Z_+p-dZ_+e_0\}                               \tag{2.6}
\]

must remain combined.  Treating the endpoint trace as a separately small
weighted vector is not a valid triangle inequality.

## 3. Conditional sampling identity and endpoint-corrected lower bound

This section is only a target-branch audit.  Assume every zero parameter is
real and use the repository normalization

\[
 Q_\pm={1\over2}Z_\pm^*Z_\pm.                            \tag{3.1}
\]

Put

\[
 q={\langle p,Q_+p\rangle\over A},\qquad
 q_x={\langle x,Q_-x\rangle\over B},\qquad
 a=q_x-q.                                                \tag{3.2}
\]

Let `Gamma_L` multiply the paired samples at ordinate `gamma` by
`L gamma/(2 pi)`; the harmless fixed parity phase is unitary.  Equations
(1.8) and (2.3) give the exact identities

\[
 \boxed{
 \begin{aligned}
  q&={\|Z_+p\|^2\over2A}
    ={\|Z_+(K-p)\|^2\over2A},\\
  q_x&={\|Z_-x\|^2\over2B}
      ={\|\Gamma_LZ_+(p-de_0)\|^2\over2B}
      ={\|Z_-R_1\|^2\over2B},\\
  a&={\|\Gamma_LZ_+(p-de_0)\|^2\over2B}
       -{\|Z_+p\|^2\over2A}.
 \end{aligned}}                                         \tag{3.3}
\]

There is no zero-height coordinate here: for real `0<sigma<1`, the
alternating eta series is positive while `1-2^(1-sigma)<0`, so
`zeta(sigma)<0`.  Thus every paired sample has `|gamma|>=gamma_*`, where
`gamma_*` is the least positive ordinate on this conditional branch.  Put

\[
 C_0=\|Z_+e_0\|,
 \qquad C_0^2=2\langle e_0,Q_+e_0\rangle.                \tag{3.4}
\]

The last quantity is the exact source diagonal entry, not a zero-table
input.  Applying the lower ordinate weight before the ordinary triangle
inequality gives

\[
 \boxed{
 q_x\ge {L^2\gamma_*^2\over8\pi^2B}
 \left(\sqrt{2Aq}-|d|C_0\right)_+^2.}                   \tag{3.5}
\]

Unlike a split of (2.6), (3.5) is legitimate: `Z_+p` and `Z_+e_0` are
unweighted square-summable sequences.

If `d=0` exactly and `q>0`, (3.5) reduces to

\[
 \boxed{
 {q_x\over q}\ge
 \left({L\gamma_*\over2\pi}\right)^2{A\over B},
 \qquad
 a\ge q\left[
 \left({L\gamma_*\over2\pi}\right)^2{A\over B}-1
 \right].}                                              \tag{3.6}
\]

For the actual state, if `q>0`, a sufficient endpoint-relative condition is
instead

\[
 {L^2\gamma_*^2A\over4\pi^2B}
 \left(1-{|d|C_0\over\sqrt{2Aq}}\right)_+^2>1.           \tag{3.7}
\]

Absolute decay of `d` and `q` supplies no bound for their ratio in (3.7).

## 4. The limiting derivative moment

Restore the parameter subscript on the multiplicative global state and,
in centered logarithmic coordinates, write

\[
 F_\lambda(t)=(C_\lambda K_\lambda)(e^t),\quad t\in I,
 \qquad p=P_NF_\lambda,
 \qquad
 H_{\lambda,M}=\sum_{j=0}^M\lambda^{-2j}G_j.             \tag{4.1}
\]

The codimension-two correction defining `K_lambda` is invisible on the
source window, so `F_lambda` is exactly the finite source-normalized state
used by the producer, not a replacement state.

On the polynomial schedule

\[
 N=\lceil\lambda L^3\rceil,                              \tag{4.2}
\]

the all-order expansion in
`notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` also controls one projected
logarithmic derivative.  Indeed, for each fixed truncation order `M`,

\[
 \|F_\lambda-H_{\lambda,M}\|_2
 =O(\lambda^{-2M-1}).                                    \tag{4.3}
\]

Here and below the finite-window functions are periodically identified only
when `P_N` is applied.  Decompose

\[
 p'-K_\infty'
 =\{P_N(F_\lambda-H_{\lambda,M})\}'
  +\{P_NH_{\lambda,M}-H_{\lambda,M}\}'
  +\{H_{\lambda,M}'-K_\infty'\}.                         \tag{4.4}
\]

Bernstein's inequality and (4.3) bound the first term by

\[
 {2\pi N\over L}\|F_\lambda-H_{\lambda,M}\|_2
 =O(\lambda^{-2M}L^2).                                  \tag{4.5}
\]

For a fixed smooth `G_j`, the `r`-fold integration-by-parts estimate used in
the all-order projection lemma, now with one Fourier frequency inserted,
gives

\[
 \|\{(I-P_N)G_j\}'\|_2
 =O_r(L^{r-3/2}N^{-r+3/2})+O_{r,B}(\lambda^{-B}).        \tag{4.6}
\]

The endpoint-derivative differences in the second term of (4.6) are flat
because every derivative of `G_j` decays faster than every exponential in
`|t|`.  On (4.2), the first term in (4.6) is
`O_r(lambda^(-r+3/2)L^(-2r+3))`, hence tends to zero for `r>=2`.
Finally,

\[
 \|H_{\lambda,M}'-K_\infty'\|_{L^2(I)}
 \leq\sum_{j=1}^M\lambda^{-2j}\|G_j'\|_2
       +\|K_\infty'\|_{L^2(\mathbb R\setminus I)}
 \longrightarrow0.                                     \tag{4.7}
\]

First choose any fixed `M>=1` and `r>=2`, then let `lambda` grow.  The same
decomposition without derivatives proves ordinary norm convergence.  Thus

\[
 A\longrightarrow A_\infty:=\|K_\infty\|_2^2,
 \qquad
 {B\over(L/(2\pi))^2}\longrightarrow
 B_\infty:=\|K_\infty'\|_2^2.                          \tag{4.8}
\]

For completeness, the endpoint statement uses more than `L2` convergence.
The finite-space evaluation norm and (4.3) give

\[
 |P_N(F_\lambda-H_{\lambda,M})(\ell)|
 \leq\sqrt{(2N+1)/L}\,O(\lambda^{-2M-1}).                \tag{4.9}
\]

After multiplication by `sqrt(L)`, its contribution to `d` is
`O(sqrt(N)*lambda^(-2M-1))`.

For each fixed `G_j`, summing the `r`-fold coefficient bound in `l1` gives

\[
 |(I-P_N)G_j(\ell)|
 =O_r(L^{r-1}N^{-r+1})+O_{r,B}(\lambda^{-B}),            \tag{4.10}
\]

so the corresponding coefficient-endpoint contribution to `d` is
`O_r(L^(r-1/2)N^(-r+1))`, plus a flat term.  Also
`G_j(ell)=O_B(lambda^(-B))`.  Since
`d=sqrt(L)*p(ell)`, choosing `M`, `r`, and `B` after any desired fixed power
shows

\[
 d=O_A(\lambda^{-A})\qquad\hbox{for every fixed }A>0.    \tag{4.11}
\]

No source identity forces the exact finite trace to be zero, and
(4.8)--(4.11) give no relative comparison with `q`.

The locked transform is

\[
 \widehat K_\infty(t)={\Xi(t)\over4}.                    \tag{4.12}
\]

Plancherel therefore identifies the exact limiting moment

\[
 \boxed{
 m_2:={B_\infty\over A_\infty}
 ={\displaystyle\int_{\mathbb R}t^2|\Xi(t)|^2dt
   \over
   \displaystyle\int_{\mathbb R}|\Xi(t)|^2dt}.}        \tag{4.13}
\]

In the fictitious exact-endpoint-zero case, the multiplier in (3.6) tends
to

\[
 {\gamma_*^2\over m_2}.                                  \tag{4.14}
\]

The symbolic ratio (4.13) is the only admitted datum here; no numerical
quadrature or zero table is used.  The present source locks do not certify
that every nontrivial zero has ordinate larger than the threshold in
(4.14).  More importantly, the actual endpoint-relative factor in (3.7) is
still missing.

## 5. Why Fourier-tail weighting does not force the sign

If the periodic restriction has Fourier coefficients `c_n`, then the
compact projection tails obey the exact coefficient identities

\[
 \|(I-P_N)CK\|_2^2=\sum_{|n|>N}|c_n|^2,
 \qquad
 \|(I-P_N)D_{\rm circ}(CK)\|_2^2
   =\sum_{|n|>N}n^2|c_n|^2.                              \tag{5.1}
\]

Thus differentiation gives the lower bound

\[
 \|(I-P_N)D_{\rm circ}(CK)\|_2
 \ge (N+1)\|(I-P_N)CK\|_2.                              \tag{5.2}
\]

This is the wrong direction for an absolute leakage estimate, and the zero
evaluation map is not diagonal in these circle modes.  It yields no sign
for (3.3).

Even with `d=0`, derivative weighting alone has no abstract sign.  On a
circle of length `2 pi`, take the boundary-zero even vector

\[
 p=e_2^+-\sqrt2e_0.                                      \tag{5.3}
\]

Then `A=3`, `B=4`, and at a single paired real sample
`gamma=1/2`, equation (2.3) gives

\[
 {q_x\over q}={\gamma^2A\over B}={3\over16}<1.           \tag{5.4}
\]

This is a Fourier-sampling countermodel to a structure-only sign argument,
not a model of the zeta-zero multiset.

## 6. The exact transverse obstruction remains

Return to the unconditional finite source matrix and let

\[
 r=(Q_+-qI)p,\qquad
 s=(Q_--qI)x=Dr-d\beta,
 \qquad y={x\over\|x\|}.                                \tag{6.1}
\]

The combined vector `Dr-d beta` is the matrix-side form of the same
endpoint cancellation as (2.3).  Define

\[
 c={P_ys\over\|x\|},
 \qquad
 B_\perp=P_y(Q_--qI)P_y|_{y^\perp}.                     \tag{6.2}
\]

Then the scalar in (3.2) is exactly

\[
 a={\langle x,s\rangle\over\|x\|^2},                   \tag{6.3}
\]

and the endpoint Schur theorem gives

\[
 \boxed{
 q<\lambda_{\min}(Q_-)
 \quad\Longleftrightarrow\quad
 B_\perp>0
 \quad\hbox{and}\quad
 a-\langle c,B_\perp^{-1}c\rangle>0.}                 \tag{6.4}
\]

Positive `a` is only a positive Rayleigh value along one derivative
direction.  It supplies neither the transverse floor nor control of the
round trip in (6.4).  For example, with `q=1`, each of

\[
 Q_-^{(1)}=\begin{pmatrix}2&0\\0&1/2\end{pmatrix},
 \qquad
 Q_-^{(2)}=\begin{pmatrix}2&1\\1&3/2\end{pmatrix}        \tag{6.5}
\]

is positive definite and has `a=1` along the first coordinate.  The first
fails the transverse floor; the second has `B_perp=1/2` but Schur scalar
`1-1/(1/2)=-1`.  Hence no derivative-moment argument can replace the two
remaining conditions in (6.4).

The surviving source-specific obligations are therefore:

1. a relative endpoint estimate strong enough for (3.7), together with a
   source-certified low-ordinate exclusion if the conditional route is
   used; and
2. a positive transverse compression `B_perp` plus an inverse-weighted
   bound for the combined coupling `Dr-d beta`.
