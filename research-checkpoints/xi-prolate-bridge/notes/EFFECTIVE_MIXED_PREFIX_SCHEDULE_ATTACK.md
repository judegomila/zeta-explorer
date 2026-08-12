# Effective mixed-prefix schedule attack

## 1. Claim boundary

This note makes the qualitative mixed all-even prefix theorem effective for
every **finite, source-specified physical target** whose orthonormal basis
and Mobius lifts are computable in `L^2`; the finite log-Fourier targets in
the checkpoint have this property.  There are two versions.

1. A fail-closed interval algorithm projects the explicit Mobius right
   inverse into the actual corrected prolate prefix and stops when a source
   residual trace is small.  The algorithm halts on every fixed finite
   target and therefore gives a total diagonal schedule on any computable
   sequence of finite targets.
2. A source-side `BV` smoothing argument gives an explicit, generally very
   large terminal-label majorant once a certified lower bound for the ground
   prolate integral and explicit finite `BV` data for the target basis have
   been supplied.

Both versions retain the full source Gram.  In residue-plus-bridge
coordinates this includes the bridge cross term.  They prove the simultaneous
source-normalized row floor

\[
 T P_{F_M}T^*\succeq {9\over128\lambda^4}I.             \tag{1.1}
\]

They do **not** prove a prescribed one-residue coframe, a useful
transition-sized terminal label, a signed physical floor, the
residual--gap limit in equation (5.2) of `DIRECT_RH_ATTACK.md`, or locally
uniform determinant convergence.  When the mixed range fills the physical
target, the complete signed source quotient has the same inertia as the
physical signed operator.  Thus capture still does not imply sign.  The
repository state remains `P0_INVALIDATED`.

The construction uses the source interval `[-lambda,lambda]`, Lebesgue
measure, zero extension, and both physical inversion parities.  No zeta-zero
table or global Weil-positivity hypothesis enters.

## 2. Simultaneous physical map and explicit right inverse

Put

\[
 I_\lambda=[\lambda^{-1},\lambda],\qquad
 (A_\lambda f)(u)=\sqrt u\sum_{n\leq\lambda/u}f(nu),
 \qquad S_\sigma={I+\sigma J\over2},                    \tag{2.1}
\]

where `(Jg)(u)=g(u^(-1))`.  Let `X_+` and `X_-` be finite-dimensional
source-specified subspaces of the two inversion sectors in
`L^2(I_lambda,du/u)`.  On

\[
 Y=X_+\oplus X_-
\]

define

\[
 Tf=\left(P_{X_+}S_+A_\lambda f,
          P_{X_-}S_-A_\lambda f\right).                \tag{2.2}
\]

The two parity pieces are orthogonal.  The locked arithmetic operator bound
therefore gives

\[
 \boxed{\|T\|\leq{\lambda\over\sqrt2}.}                \tag{2.3}
\]

For `y=(y_+,y_-) in Y`, set `g=y_++y_-`.  On the visible positive source
interval define

\[
 R_\lambda g(x)=
 \sum_{n\leq\lambda/x}\mu(n){g(nx)\over\sqrt{nx}},
 \qquad \lambda^{-1}\leq x\leq\lambda.                \tag{2.4}
\]

Extend this evenly and put the constant `-lambda J_g` on the central hole,
where

\[
 J_g=\int_{\lambda^{-1}}^\lambda R_\lambda g(x)\,dx.   \tag{2.5}
\]

Call the resulting even zero-integral source `By`.  Finite divisor
convolution and the invisibility of the central hole give

\[
 TB=I_Y.                                                \tag{2.6}
\]

With

\[
 M_\mu(\lambda)=
 \sum_{n\leq\lfloor\lambda^2\rfloor}{|\mu(n)|\over\sqrt n}
 \leq2\lambda,
\]

the source norm calculation gives

\[
 \boxed{
 \|B\|\leq A_\lambda:=\sqrt2\,\lambda M_\mu(\lambda)
 \leq2\sqrt2\,\lambda^2.}                             \tag{2.7}
\]

This is the full Mobius right inverse.  It is not silently replaced by a
smooth or analytic lift.

## 3. Exact mixed source projection

Let `h_n` be the unit-normalized real prolate modes in the pinned convention
and put

\[
 I_n=\int_{-\lambda}^{\lambda}h_n(x)\,dx,
 \qquad
 c_{2j}=h_{2j}-{I_{2j}\over I_0}h_0.                   \tag{3.1}
\]

The ground mode is oriented positively, so `I_0>0`.  For `M>=1`, let

\[
 C_M=(c_2,c_4,\ldots,c_{2M}),\qquad F_M=\operatorname {ran}C_M.
\]

In the ordinary mixed coordinates, with

\[
 v_M=(I_2/I_0,I_4/I_0,\ldots,I_{2M}/I_0)^T,
\]

the complete source Gram and orthogonal projection are

\[
 D_M=C_M^*C_M=I+v_Mv_M^*,
 \qquad
 P_{F_M}=C_MD_M^{-1}C_M^*.                              \tag{3.2}
\]

For an orthonormal basis `(y_a)_(a=1)^d` of `Y`, regard `B` as the source
synthesis with columns `f_a=By_a`, and form

\[
 G=B^*B,qquad H_M=C_M^*B.                              \tag{3.3}
\]

The exact source residual Gram is

\[
 \boxed{
 E_M=B^*(I-P_{F_M})B
 =G-H_M^*D_M^{-1}H_M\succeq0.}                         \tag{3.4}
\]

Consequently

\[
 \eta_M^2:=\|(I-P_{F_M})B\|^2
 =\lambda_{\max}(E_M)\leq\operatorname {tr}E_M.       \tag{3.5}
\]

The subtraction in (3.4) is an identity in the complete source metric.  A
floating computation is not allowed to declare it positive merely because
rounded eigenvalues look positive.

### 3.1 Residue-plus-bridge invariance

When `I_2!=0` has been certified, split the same prefix into

\[
 p_j=c_{4j},\qquad b=c_2,
 \qquad m_j=-h_{4j+2}+{I_{4j+2}\over I_2}h_2.           \tag{3.6}
\]

Writing

\[
 u_j={I_{4j}\over I_0},\qquad
 \beta={I_2\over I_0},\qquad
 a_j={I_{4j+2}\over I_2},
\]

the separated source Gram is exactly

\[
 D_{\rm sep}=
 \begin{bmatrix}
 I+uu^*&\beta u&0\\
 \beta u^*&1+\beta^2&a^*\\
 0&a&I+aa^*
 \end{bmatrix}.                                        \tag{3.7}
\]

In particular the bridge cross block `beta*u` is not zero.  The identity

\[
 c_{4j+2}=-m_j+a_jb                                    \tag{3.8}
\]

defines an invertible triangular matrix `mathcal S` with

\[
 C_M=C_{\rm sep}{\cal S},\qquad
 D_M={\cal S}^*D_{\rm sep}{\cal S}.                    \tag{3.9}
\]

If `H_sep=C_sep^*B` and `W_sep=TC_sep`, then

\[
 \begin{aligned}
 H_M^*D_M^{-1}H_M
 &=H_{\rm sep}^*D_{\rm sep}^{-1}H_{\rm sep},\\
 (TC_M)D_M^{-1}(TC_M)^*
 &=W_{\rm sep}D_{\rm sep}^{-1}W_{\rm sep}^*.
 \end{aligned}                                         \tag{3.10}
\]

Thus both the stopping quantity and the final floor are coordinate
invariant.  Dropping the bridge cross term changes them.

## 4. A total fail-closed stopping schedule

The corrected prefixes are nested and dense in the even zero-integral
source space.  Since `B` has finite rank,

\[
 \operatorname {tr}E_M
 =\|(I-P_{F_M})B\|_{\rm HS}^2\longrightarrow0.          \tag{4.1}
\]

Define the certified stopping test

\[
 \boxed{
 U_M<{1\over8\lambda^2},}                              \tag{4.2}
\]

where `U_M` is an outward-rounded upper enclosure for the exact trace in
(3.4).  A total version of the algorithm is as follows.

At stage `s=1,2,...`, use `M=s` and reconstruct all quantities in
(2.4)--(3.4) at sufficient interval precision that the enclosure for
`tr(E_s)` has width at most `2^(-s)`.  Stop at the first stage satisfying
(4.2).  Equation (4.1) and the shrinking interval width prove termination.
No observed monotonicity of rounded values is used.  In particular, the
algorithm remains valid if successive interval upper endpoints are not
monotone.

This is an effective schedule rather than a complexity estimate.  For any
computable diagonal `(lambda_j,X_(+,j),X_(-,j))`, applying the same algorithm
at each `j` gives a total sequence `M_j`.  Nothing here bounds `M_j` by the
transition label, a polynomial in `lambda_j`, or any other useful cost
scale.

### 4.1 Why the trace is computable

For locked rational half-integer `lambda` and a source-specified finite
Fourier basis, every ingredient is computable from finite source data.

* `mu(n)` is factored exactly only for `n<=floor(lambda^2)`.
* Each column of `B` is a finite piecewise-analytic expression with the
  known breakpoints `lambda/n` and the explicitly retained central-hole
  constant.
* The prolate modes are reconstructed from the pinned simple
  Sturm--Liouville problem with `c=2*pi*lambda^2`, unit normalization, and
  the positive ground orientation.  Certified eigenvalue isolation and
  interval ODE integration give outward enclosures for `I_n`, `G`, and
  `H_M`.
* The inverse of `D_M=I+v_Mv_M^*` can be evaluated with the
  Sherman--Morrison denominator `1+v_M^*v_M>=1`.  In separated coordinates
  the verifier instead rebuilds (3.7) and (3.9).
* All piecewise quadratures are split at every arithmetic breakpoint.  A
  binary64 parse, a cached producer matrix, or a producer positivity flag is
  not a certificate.

The asserted computability of the Sturm data does not require a stored
prolate table.  In the normalized Legendre basis, the unperturbed part is
diagonal with entries `n(n+1)` and multiplication by `c^2*z^2` is a
computable bounded band matrix.  A finite Legendre section, the explicit
lower bound `n(n+1)` on its omitted diagonal block, and an interval Schur or
residual enclosure isolate any fixed finite set of simple prolate
eigenvalues.  Increasing the section gives convergent coefficient-tail and
ODE enclosures.  This supplies a reconstruction algorithm; a concrete run
must still output the actual intervals and may not cite computability as if
it were a completed numerical certificate.

At fixed `M`, interval Sturm isolation and interval quadrature converge.
Thus the upper enclosure in (4.2) converges to the exact trace.  The
eventual strict margin supplied by (4.1) makes the semidecision halt.  If a
chosen implementation cannot isolate a required prolate eigenvalue or
cannot shrink a quadrature enclosure, that run stays unresolved; it may not
replace the missing enclosure by numerical agreement.

## 5. Quantitative coframe floor at the stopping label

Let

\[
 A_M=TP_{F_M}B:Y\longrightarrow Y.
\]

Equations (2.3), (3.5), and (4.2) give

\[
 \|I_Y-A_M\|
 =\|T(I-P_{F_M})B\|
 \leq{\lambda\over\sqrt2}\eta_M
 <{1\over4}.                                           \tag{5.1}
\]

Hence `A_M` is invertible by the Neumann lemma, and

\[
 R_M=P_{F_M}B A_M^{-1}                                 \tag{5.2}
\]

is a right inverse for `T` restricted to `F_M`.  From (2.7) and (5.1),

\[
 \|R_M\|\leq{4\over3}A_\lambda.                       \tag{5.3}
\]

The usual right-inverse singular-value estimate now gives

\[
 \begin{aligned}
 TP_{F_M}T^*
 &\succeq {1\over\|R_M\|^2}I_Y\\
 &\succeq {9\over32\lambda^2M_\mu(\lambda)^2}I_Y\\
 &\succeq \boxed{{9\over128\lambda^4}I_Y}.            \tag{5.4}
\end{aligned}

This proves (1.1).  It also proves `ran(TP_(F_M))=Y` exactly.  Thus if `Y`
is the full finite Fourier target containing a closed annular concentration
space, the annular angle inside that target is exactly zero.  If one wants a
smaller annular-only target, its spectral projector must be reconstructed
with a certified gap at the declared threshold.  In the absence of that
gap, using the whole finite Fourier target is the fail-closed alternative.

## 6. An explicit source-side `BV` terminal-label majorant

The stopping algorithm above supplies no advance label bound.  This section
gives a deliberately coarse one.  It is a source approximation estimate,
not the periodic physical-shell `BV` estimate rejected in
`notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md`.

Rescale a source unitarily to `[-1,1]`:

\[
 ({\cal U}f)(z)=\sqrt\lambda f(\lambda z).              \tag{6.1}
\]

Let `Phi_0=mathcal U h_0` and choose a certified rational number

\[
 0<\iota_\lambda\leq I_0.
\]

Define

\[
 \kappa_\lambda
 =1+{\sqrt{2\lambda}\over\iota_\lambda}.              \tag{6.2}
\]

The number `iota_lambda` is not an unspecified constant: it is an explicit
interval lower endpoint obtained from the pinned positive normalized ground
mode.  Failure to certify it leaves this majorant unavailable.

### 6.1 Explicit variation data for the Mobius lift

Let `(y_a)_(a=1)^d` be the chosen orthonormal basis of `Y`, and write the
associated physical function as `g_a`.  Put

\[
 K=\lfloor\lambda^2\rfloor,
 \qquad q_a(u)={g_a(u)\over\sqrt u},                    \tag{6.3}
\]

and

\[
 J_a=\sum_{n\leq K}{\mu(n)\over n}
       \int_{n/\lambda}^{\lambda}q_a(u)\,du.            \tag{6.4}
\]

This equals (2.5) after interchanging a finite sum and integral.  Define the
fully explicit upper variation number

\[
\begin{aligned}
 V_a=2\sqrt\lambda\Bigg\{&
 \sum_{n\leq K}|\mu(n)|
       \int_{n/\lambda}^{\lambda}|q_a'(u)|\,du\\
 &+\left(\sum_{n\leq K}|\mu(n)|\right)|q_a(\lambda)|\\
 &+\left|\sum_{n\leq K}\mu(n)q_a(n/\lambda)
              +\lambda J_a\right|\Bigg\}.             \tag{6.5}
\end{aligned}
\]

The first line bounds the absolutely continuous variation on all arithmetic
cells.  The second is the sum of the outer endpoint and all threshold
jumps.  The third is the jump from the central-hole constant to the visible
source.  Even reflection supplies the factor two, and the unitary rescaling
supplies `sqrt(lambda)`.  Therefore

\[
 \operatorname {TV}\left((\mathcal UBy_a)^{\rm ext}\right)
 \leq V_a.                                              \tag{6.6}
\]

Set

\[
 V_{\lambda,Y}=\left(\sum_{a=1}^dV_a^2\right)^{1/2}.   \tag{6.7}
\]

Total-variation subadditivity and Cauchy--Schwarz give, for every `y in Y`,

\[
 \operatorname {TV}\left((\mathcal UBy)^{\rm ext}\right)
 \leq V_{\lambda,Y}\|y\|.                             \tag{6.8}
\]

All sums and integration intervals in (6.4)--(6.5) are finite.  For the
standard log-Fourier basis the functions `q_a` and `q_a'` are elementary,
and outward interval quadrature or elementary sup bounds give certified
upper endpoints.

### 6.2 Box smoothing and the prolate spectral tail

Let `F` be the zero extension to the real line of `mathcal UBy`, and let
`V=V_(lambda,Y)||y||`.  Convolve `F` with the uniform probability kernel on
`[-rho,rho]`, where `0<rho<=1`, and call the result `F_rho`.  The standard
translation inequalities for a `BV` function give

\[
 \|F-F_\rho\|_2\leq V\sqrt\rho,
 \qquad
 \|F_\rho'\|_2^2\leq {V^2\over2\rho},
 \qquad
 \|F_\rho\|_2\leq\|F\|_2.                             \tag{6.9}
\]

For clarity, the first two constants follow directly from

\[
 \|F(\cdot+h)-F\|_1\leq |h|V,
 \quad
 \|F(\cdot+h)-F\|_\infty\leq V,
\]

and

\[
 F_\rho'(z)={F(z+\rho)-F(z-\rho)\over2\rho}.
\]

No asymptotic approximation theorem is being invoked.

On `[-1,1]`, the dimensionless prolate operator is

\[
 L_c=-{d\over dz}\left((1-z^2){d\over dz}\right)+c^2z^2,
 \qquad c=2\pi\lambda^2.                               \tag{6.10}
\]

Its ordered eigenvalues satisfy, by the min--max principle and the
nonnegative potential,

\[
 \mu_n(c)\geq n(n+1).                                  \tag{6.11}
\]

Let `mathcal E_M=span(Phi_0,Phi_2,...,Phi_(2M))`.  Since `F_rho` is even,
the form estimate and (6.9)--(6.11) give

\[
 \operatorname {dist}(F_\rho,\mathcal E_M)^2
 \leq
 {V^2/(2\rho)+c^2\|F\|_2^2
  \over(2M+2)(2M+3)}.                                  \tag{6.12}
\]

If `F` has zero integral and `e in mathcal E_M`, subtracting
`(integral e/integral Phi_0)Phi_0` puts `e` in the corrected subspace
`mathcal U F_M`.  The integral functional has norm `sqrt(2)`, so

\[
 \operatorname {dist}(F,\mathcal U F_M)
 \leq\kappa_\lambda
 \left[
 V\sqrt\rho+
 \sqrt{{V^2/(2\rho)+c^2\|F\|_2^2
  \over(2M+2)(2M+3)}}
 \right].                                              \tag{6.13}
\]

Applying (6.13) to `F=mathcal UBy`, and using (2.7) and (6.8), proves the
operator source-tail bound

\[
\boxed{
 \|(I-P_{F_M})B\|
 \leq\kappa_\lambda
 \left[
 V_{\lambda,Y}\sqrt\rho+
 \sqrt{{V_{\lambda,Y}^2/(2\rho)+c^2A_\lambda^2
  \over(2M+2)(2M+3)}}
 \right].}                                             \tag{6.14}
\]

### 6.3 A closed stopping majorant

Assume `d=dim(Y)>=1` and put

\[
 \delta_{\lambda,d}={1\over4\sqrt d\,\lambda}.         \tag{6.15}
\]

With `V=V_(lambda,Y)`, choose

\[
 \rho=
 \begin{cases}
 1,&V=0,\\
 \min\left\{1,{\delta_{\lambda,d}^2
                    \over4\kappa_\lambda^2V^2}\right\},&V>0,
 \end{cases}                                           \tag{6.16}
\]

and define

\[
 R_{\lambda,Y}
 ={4\kappa_\lambda^2\over\delta_{\lambda,d}^2}
 \left({V^2\over2\rho}+c^2A_\lambda^2\right).         \tag{6.17}
\]

Then the explicit terminal count

\[
 \boxed{
 M_{\rm BV}=
 \max\left\{1,
 \left\lceil{\sqrt{R_{\lambda,Y}}\over2}\right\rceil
 \right\}}                                            \tag{6.18}
\]

makes each of the two terms in brackets in (6.14) at most
`delta_(lambda,d)/(2*kappa_lambda)`.  Hence

\[
 \|(I-P_{F_{M_{\rm BV}}})B\|
 \leq\delta_{\lambda,d}.                              \tag{6.19}
\]

It follows that

\[
 \operatorname {tr}E_{M_{\rm BV}}
 \leq d\,\delta_{\lambda,d}^2
 ={1\over16\lambda^2}
 <{1\over8\lambda^2}.                                \tag{6.20}
\]

Thus (6.18), with outward-rounded upper inputs and a certified lower
`iota_lambda`, is an advance terminal-label majorant for the trace schedule.
It is likely far larger than the first successful trace label.  It is not a
uniform elementary function of `lambda` alone: the finite target dimension,
the explicit target variation data, and the certified ground-integral lower
bound remain visible.  This is precisely where the cost is paid rather than
hidden in an unspecified constant.

## 7. Annular targets and the analytic-intersection theorem

For a finite Fourier parity target `X_N`, applying the schedule to
`Y=X_(N,+) direct-sum X_(N,-)` gives one mixed prefix which fills both
compressed sectors and therefore every closed annular subspace inside them.
This avoids any need to decide an annular eigenvalue exactly at its threshold.
If a smaller annular basis is used instead, its threshold separation and
basis enclosures become part of the source-specified input.

There is no contradiction with the unmatched-breakpoint theorem in
`notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md`.  That theorem says a finite
analytic source image cannot equal a nonzero analytic physical feature as an
unprojected function across the unmatched breakpoint.  Here the statement is

\[
 P_Y S_\sigma A_\lambda F_M=Y,                          \tag{7.1}
\]

after finite physical projection.  The unprojected arithmetic images retain
their jumps.

The jump also explains why a naive first-order prolate graph-norm estimate
cannot be applied directly to the Mobius lift: its distributional derivative
has interior atoms.  The box smoothing in Section 6 explicitly pays for
those atoms through `V_(lambda,Y)^2/rho`; it does not pretend the lift is in
the prolate form domain.

## 8. The signed coupled problem is unchanged

Let `B_oplus` now denote the complete shifted signed physical operator; this
notation is separate from the right inverse `B` above.  In separated source
coordinates its pullback is

\[
 {\cal Q}_{\rm sep}=W_{\rm sep}^*B_\oplus W_{\rm sep}. \tag{8.1}
\]

The schedule proves a lower bound for
`W_sep D_sep^(-1) W_sep^*`, but it proves no lower bound for (8.1).  The
off-diagonal signed block `Q_(02)` and the metric cross term
`-mu*D_(02)` must both remain in the quotient-aware Schur complement.  Once
`W_sep` is full row, restriction to the source quotient is congruent to the
physical signed operator, so Sylvester inertia is preserved.

Thus the effective mixed schedule closes only the **finite projected
spanning** question.  It may be useful for removing an annular exterior
angle or for constructing a fully coupled finite quotient, but it moves all
remaining difficulty into the actual signed physical form.  No positivity,
residual--gap asymptotic, or determinant limit follows from the coframe
floor.

## 9. Exact remaining target

The new result permits two honest next computations.

1. Implement the trace schedule (3.4), with producer and verifier rebuilding
   the Mobius lift, prolate Sturm data, and full bridge Gram independently.
   Compare the first certified trace label with the coarse bound (6.18).
2. At that same label, assemble the complete coupled signed quotient with
   every pole, archimedean, prime, bridge-metric, and cross-family term.  A
   diagonal-family sign test is insufficient.

For the asymptotic bridge, one still needs either a useful common-schedule
bound on the actual first trace label together with a complete signed floor,
or a direct quotient/high-complement argument which avoids full capture.
The existence of the total schedule and the large explicit majorant do not
establish equation (5.2) of `DIRECT_RH_ATTACK.md`.
