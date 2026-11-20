# Three-scale transverse-resolvent reduction

## 0. Claim boundary and outcome

The projective low-mode theorem does not need the component of the ground
line parallel to the projected comparison state.  Removing that one
direction has an additional structural benefit: the adjoint range of the
remaining observation is an exact, genuinely low-Fourier subspace.  The
source Cauchy form can therefore separate it from the honestly coercive far
tail with an explicit small norm.

This note proves three statements.

1. The transverse projective observation is the orthogonal projection onto
   a raw low-Fourier subspace contained in the even complement.
2. After a low/middle/far split, the honestly coercive far block can be
   eliminated exactly.  Its direct feedback into the transverse low row is
   bounded by

   \[
    2\sqrt2 B_b(\lambda)
       \sqrt{\frac{2M+1}{R-M}}.
   \]

   On the locked exponential outer schedule, taking `R` at the explicit
   high-coercivity cutoff makes these low-row feedback terms
   super-polynomially small.
3. What remains is an exact vector-specific middle-window Schur ratio.  A
   finite countermodel has a perfectly positive and completely decoupled far
   block, residual and Ritz lowering tending to zero, and nevertheless a
   fixed transverse projective error.  Thus far coercivity cannot replace
   the missing middle-window estimate.

The reduction uses no zeta-zero table, no global Weil positivity, and no
numerical matrix.  It does not prove either shifted sector sign, the required
middle-window ratio, equation (5.2), locally uniform determinant convergence,
or the Riemann hypothesis.  The formal project state remains
`P0_INVALIDATED`.

## 1. Exact transverse low space

Fix one finite pair `(lambda,N)`.  Let `H_+` be the inversion-even sector,
let `kappa in H_+` be the unit projected prolate state, and put

\[
 \mathcal K=H_+\cap\kappa^\perp,
 \qquad
 A=P_{\mathcal K}Q|_{\mathcal K},
 \qquad
 b=(Q-qI)\kappa.                                      \tag{1.1}
\]

Let `P_M` be the centered Fourier projection onto `|n|<=M`, where
`1<=M<N`, and set

\[
 x=P_M\kappa.                                           \tag{1.2}
\]

Assume `x!=0`.  Inside the even low-Fourier space define

\[
 \mathcal L_M=(P_MH_+)\cap x^\perp.                     \tag{1.3}
\]

Because a vector `ell in P_MH_+` satisfies
`<ell,kappa>=<ell,x>`, one has

\[
 \boxed{\mathcal L_M\subset\mathcal K.}                 \tag{1.4}
\]

Let `Pi_x` be the projection onto `C*x` in `P_MH_+`.  The transverse
observation from
`notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md` is

\[
 S_M=(I-\Pi_x)P_M|_{\mathcal K}.                          \tag{1.5}
\]

### Lemma 1.1 (raw-support identity)

As an operator from `mathcal K` to `mathcal L_M`,

\[
 \boxed{S_M=P_{\mathcal L_M}|_{\mathcal K}.}             \tag{1.6}
\]

In particular, `S_M^*` is the ordinary inclusion of the raw low-Fourier
space `mathcal L_M` into `mathcal K`.

**Proof.**  For `v in mathcal K`, `(I-Pi_x)P_Mv` lies in `P_MH_+` and is
orthogonal to `x`, hence lies in `mathcal L_M`.  Conversely, for
`ell in mathcal L_M`, both `P_M ell=ell` and `Pi_x ell=0`.  Thus (1.5) is
the orthogonal projection onto (1.3).  Equation (1.4) identifies its adjoint
with inclusion into `mathcal K`.  \(\square\)

This identity is special to the projectively transverse observation.  The
adjoint of the unmodified map `P_M|_(mathcal K)` is `P_mathcalK P_M` and
generally carries a high-frequency multiple of `kappa`.  Equation (1.6)
removes that contamination exactly.

## 2. Separated Cauchy coupling

Use the exact source representation

\[
 Q=D_a+D_bH-HD_b,                                      \tag{2.1}
\]

\[
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m),
 \qquad |b_n|\leq B_b(\lambda).                         \tag{2.2}
\]

All signs in `B_b(lambda)` are those of
`notes/HIGH_FOURIER_COERCIVITY.md`, including the source minus sign on the
prime block.  For integers `M<R<N`, let `P_<=M=P_M` and let `P_>R` project
onto `R<|n|<=N`.

### Lemma 2.1 (low-to-far Cauchy norm)

One has

\[
 \boxed{
 \|P_{>R}QP_{\leq M}\|
 \leq d_{\lambda;M,R}:=
 2\sqrt2 B_b(\lambda)
 \sqrt{\frac{2M+1}{R-M}}.}                       \tag{2.3}
\]

The same bound holds after restriction to either inversion sector and to
arbitrary subspaces of the displayed low and far spaces.

**Proof.**  The diagonal `D_a` has no matrix entries between the two
disjoint mode sets.  For `|n|<=M` and `|m|>R`, (2.2) gives

\[
 |Q_{mn}|\leq\frac{2B_b(\lambda)}{|m-n|}.                 \tag{2.4}
\]

For each fixed `n`, the positive and negative far tails obey

\[
 \sum_{m=R+1}^{\infty}\frac1{(m-n)^2}
 \leq\frac1{R-n}\leq\frac1{R-M},                         \tag{2.5}
\]

\[
 \sum_{m=R+1}^{\infty}\frac1{(m+n)^2}
 \leq\frac1{R+n}\leq\frac1{R-M}.                         \tag{2.6}
\]

Hence the squared Hilbert--Schmidt norm of the cross block is at most

\[
 4B_b(\lambda)^2\,
 \frac{2(2M+1)}{R-M}.                                    \tag{2.7}
\]

The operator norm is no larger.  Orthogonal compression to a parity sector
or a smaller subspace cannot increase it.  \(\square\)

Unlike the adjacent low/high estimate `c_lambda`, (2.3) records the actual
mode separation.  It does not use cancellation between the source blocks;
its role is only to make an already distant far tail quantitatively
harmless.

## 3. Exact low/middle/far Feshbach split

Let `U` be a variational upper bound and assume for this section that

\[
 B:=A-U I\succ0.                                          \tag{3.1}
\]

This is the still-unproved shifted even-complement sign, used here only to
state a resolvent identity.  No quantitative floor for `B` is assumed.
For `R>M`, define the exact far and middle spaces

\[
 \mathcal F_R=\mathcal K\cap P_{>R}H_+,
 \qquad
 \mathcal C_{M,R}
 =\mathcal K\ominus(\mathcal L_M\oplus\mathcal F_R),      \tag{3.2}
\]

and put

\[
 \mathcal Y=\mathcal L_M\oplus\mathcal C_{M,R}.           \tag{3.3}
\]

The sum in (3.2) is orthogonal because its first summand is supported in
`|n|<=M` and its second in `|n|>R`.

For `s<=U`, write `h=U-s>=0`.  Relative to
`mathcal K=mathcal Y direct-sum mathcal F_R`, put

\[
 D_h=P_{\mathcal Y}(B+hI)|_{\mathcal Y},
 \qquad
 H_h=P_{\mathcal F_R}(B+hI)|_{\mathcal F_R},              \tag{3.4}
\]

\[
 \Gamma=P_{\mathcal F_R}B|_{\mathcal Y},
 \qquad
 \Gamma=[\,V\ \ W\,]                                   \tag{3.5}
\]

with `V:mathcal L_M->mathcal F_R` and
`W:mathcal C_(M,R)->mathcal F_R`.  Decompose the forcing as
`b=b_Y direct-sum b_F`.

The high-Fourier theorem gives the exact far floor

\[
 H_h\succeq(G_R+h)I,
 \qquad
 G_R=g_{\lambda,R}-U,                                    \tag{3.6}
\]

whenever `G_R>0`.

### Theorem 3.1 (exact far short)

Assume `G_R>0`.  Define

\[
 \Sigma_h=D_h-\Gamma^*H_h^{-1}\Gamma,
 \qquad
 f_h=b_Y-\Gamma^*H_h^{-1}b_F.                             \tag{3.7}
\]

Then `Sigma_h` is positive definite and

\[
 \boxed{
 S_M(A-sI)^{-1}b
 =P_{\mathcal L_M}\Sigma_h^{-1}f_h.}                     \tag{3.8}
\]

For observations on `mathcal L_M`, the Green function likewise satisfies

\[
 \boxed{
 P_{\mathcal L_M}(A-sI)^{-1}P_{\mathcal L_M}
 =P_{\mathcal L_M}\Sigma_h^{-1}P_{\mathcal L_M}.}        \tag{3.9}
\]

**Proof.**  Equation (3.6) makes `H_h` invertible.  Since
`B+hI` is positive, its Schur complement `Sigma_h` is positive.  Solving the
far block gives

\[
 z_F=H_h^{-1}(b_F-\Gamma z_Y),                            \tag{3.10}
\]

and substitution in the retained block gives
`Sigma_h z_Y=f_h`.  Lemma 1.1 turns the low observation into
`P_(mathcal L_M)z_Y`, proving (3.8).  The same block inverse with forcing in
`mathcal L_M` proves (3.9).  \(\square\)

The far short has an explicit small low row.  Lemma 2.1 gives

\[
 \|V\|\leq d_{\lambda;M,R}.                              \tag{3.11}
\]

Consequently,

\[
 \left\|P_{\mathcal L_M}\Sigma_hP_{\mathcal L_M}
       -P_{\mathcal L_M}(B+hI)P_{\mathcal L_M}\right\|
 \leq\frac{d_{\lambda;M,R}^2}{G_R+h},                   \tag{3.12}
\]

\[
 \left\|P_{\mathcal L_M}\Sigma_hP_{\mathcal C_{M,R}}
       -P_{\mathcal L_M}BP_{\mathcal C_{M,R}}\right\|
 \leq\frac{d_{\lambda;M,R}\|W\|}{G_R+h},              \tag{3.13}
\]

\[
 \|P_{\mathcal L_M}f_h-P_{\mathcal L_M}b\|
 \leq\frac{d_{\lambda;M,R}\|b_F\|}{G_R+h}.             \tag{3.14}
\]

These inequalities are row estimates before inversion.  No inverse norm or
retained floor has been inserted.

There are fully explicit finite bounds for the two remaining factors.  Put

\[
 K_{\lambda,N}
 =\log(N+2)+C_{|a|}(\lambda)+c_\lambda.                   \tag{3.15}
\]

The diagonal upper bound and bounded commutator in
`notes/HIGH_FOURIER_COERCIVITY.md` give

\[
 \boxed{\|W\|\leq K_{\lambda,N},
 \qquad \|b_F\|\leq K_{\lambda,N}.}                      \tag{3.16}
\]

Indeed, projection onto `mathcal F_R` kills the scalar shift and the
`q*kappa` term.  The diagonal contribution sees only nonzero modes above
`R`, where its norm is at most
`log(N+2)+C_|a|(lambda)`, and the complete off-diagonal commutator has norm
at most `c_lambda`.  This argument never needs a separate bound for the
single entry `a_0`.

Combining (3.12)--(3.16), all direct far feedback into the transverse low
row is controlled by

\[
 \frac{d_{\lambda;M,R}^2}{G_R},
 \qquad
 \frac{d_{\lambda;M,R}K_{\lambda,N}}{G_R}.                 \tag{3.17}
\]

## 4. What the honest huge cutoff does prove

For a desired shifted far floor `G>0`, the explicit source theorem permits

\[
 R\geq M_*(\lambda,U,G)
 =\max\!\left\{0,
 \left\lceil
 2\exp\!\left(C_a(\lambda)+c_\lambda+U+G+
                         \frac1{2\pi}\right)
 \right\rceil-1\right\}.                                \tag{4.1}
\]

Then `G_R>=G` uniformly in the outer cutoff `N>R`.

Take `M=ceil(lambda)`, `G=1`, and the locked half-integer exponential
outer schedule

\[
 \lambda_j=j+\tfrac12,
 \qquad
 N_j=2^{2400(2j+1)^2}.                                   \tag{4.2}
\]

The already-proved normalized scalar upper shift satisfies `U_j->0` on
this schedule.  The displayed source constants obey

\[
 B_b(\lambda)=O(\lambda\log\lambda),
 \qquad
 C_a(\lambda)+c_\lambda=O(\lambda\log\lambda).            \tag{4.3}
\]

Hence the cutoff in (4.1) has

\[
 \log R_j=O(\lambda_j\log\lambda_j),
 \qquad R_j<N_j                                          \tag{4.4}
\]

eventually, while

\[
 K_{\lambda_j,N_j}=O(\lambda_j^2).                        \tag{4.5}
\]

The positive summands in the exact constants also give, eventually,

\[
 R_j\geq
 \left\lceil2\lambda_j^{16(\lambda_j-1)}\right\rceil-1.
                                                                    \tag{4.6}
\]

Equations (2.3) and (4.6) therefore imply the explicit asymptotic upper
bound

\[
 d_{\lambda_j;M_j,R_j}
 \leq\lambda_j^{-8\lambda_j+O(1)}\log\lambda_j.           \tag{4.7}
\]

In particular, both quantities in (3.17) tend to zero faster than every
negative power of `lambda_j`.

Thus the existing theorem really does remove the direct far-tail feedback
from the transverse low row.  This is stronger than merely observing that
the far block is positive.  It still does not control the inverse of the
retained low-plus-middle short `Sigma_h`; a small row perturbation may be
amplified by a nearly singular retained direction.

## 5. The exact middle-window object left over

Write the far-shorted operator and forcing from (3.7) on
`mathcal Y=mathcal L_M direct-sum mathcal C_(M,R)` as

\[
 \Sigma_h=
 \begin{bmatrix}
  L_h&E_h^*\\
  E_h&C_h
 \end{bmatrix},
 \qquad
 f_h=f_{L,h}\oplus f_{C,h}.                              \tag{5.1}
\]

Positivity of `Sigma_h` makes `C_h` positive.  Define the exact middle
short and effective forcing

\[
 \Omega_h=L_h-E_h^*C_h^{-1}E_h,
 \qquad
 \eta_h=f_{L,h}-E_h^*C_h^{-1}f_{C,h}.                     \tag{5.2}
\]

A second block elimination in (3.8) gives

\[
 \boxed{
 S_M(A-sI)^{-1}b=\Omega_h^{-1}\eta_h,
 \qquad h=U-s.}                                           \tag{5.3}
\]

Therefore the exact transverse observable is

\[
 \boxed{
 \Lambda_{M,\perp}(U)
 =\sup_{h\geq0}\|\Omega_h^{-1}\eta_h\|.}                \tag{5.4}
\]

Equation (5.4), not the far cutoff, is the remaining lambda-scale object.
It is vector-specific: proving

\[
 \sup_{h\geq0}\|\Omega_h^{-1}\eta_h\|
 =\lambda^{-1/2+o(1)}                                    \tag{5.5}
\]

does not require a uniform quantitative lower bound for every eigenvalue of
`Omega_h`.  It does, however, require cancellation-preserving control of the
actual effective forcing relative to the actual middle short.  Neither the
source-triangle coefficient bounds nor far coercivity supplies that
orientation.

The compact projective-wedge route has the parallel conclusion: after the
far short, its anchor and wedge Green functions are the corresponding
quadratic forms of `Sigma_h^{-1}`.  The far row estimates above do not bound
those forms without a retained graph-stability estimate.

## 6. Sharp obstruction model

The missing middle estimate is not a technical artifact.  Let

\[
 H_+=\mathbb C\kappa\oplus
       \operatorname {span}\{\ell,m,f\},                  \tag{6.1}
\]

where `kappa,ell` are declared low, `m` is middle, and `f` is far.  Thus
`x=kappa` and `mathcal L_M=span{ell}`.  Fix `epsilon>0`, `G>0`, and a real
`U`.  On `mathcal K=span{ell,m,f}` put

\[
 B_\epsilon=
 \begin{bmatrix}
  1&1&0\\
  1&1+\epsilon&0\\
  0&0&G
 \end{bmatrix},
 \qquad
 z_\epsilon=
 \begin{bmatrix}-1\\1\\0\end{bmatrix},
 \qquad
 b_\epsilon=B_\epsilon z_\epsilon
 =\begin{bmatrix}0\\\epsilon\\0\end{bmatrix}.          \tag{6.2}
\]

The matrix `B_epsilon` is positive definite: its low/middle determinant is
`epsilon` and its far block is `G`.  Set

\[
 A_\epsilon=U I+B_\epsilon,
 \qquad q_\epsilon=U+\epsilon,                            \tag{6.3}
\]

and define the even matrix relative to
`C*kappa direct-sum mathcal K` by

\[
 Q_{+,\epsilon}=
 \begin{bmatrix}
 q_\epsilon&b_\epsilon^*\\
 b_\epsilon&A_\epsilon
 \end{bmatrix}.                                           \tag{6.4}
\]

Because

\[
 \langle b_\epsilon,B_\epsilon^{-1}b_\epsilon\rangle
 =\langle b_\epsilon,z_\epsilon\rangle
 =\epsilon=q_\epsilon-U,                                 \tag{6.5}
\]

the Schur complement of `Q_(+,epsilon)-U I` is zero.  Thus `U` is its unique
lowest eigenvalue and the coefficient-normalized ground line is

\[
 w_\epsilon=\kappa-z_\epsilon=\kappa+\ell-m.              \tag{6.6}
\]

Take the odd block to be `(U+G)I`.  Then both strict finite sector signs
hold, the far block has floor `G`, and every far coupling vanishes.  At the
same time,

\[
 \|b_\epsilon\|=\epsilon\longrightarrow0,
 \qquad q_\epsilon-U=\epsilon\longrightarrow0,            \tag{6.7}
\]

but

\[
 S_Mz_\epsilon=-\ell,                                     \tag{6.8}
\]

and the exact low projective distance is

\[
 \inf_{t\in\mathbb C}
 \|P_M(tw_\epsilon-\kappa)\|
 =\inf_t\|t(\kappa+\ell)-\kappa\|
 ={1\over\sqrt2}.                                        \tag{6.9}
\]

In (5.2), this model has

\[
 \Omega_0={\epsilon\over1+\epsilon},
 \qquad
 \eta_0=-{\epsilon\over1+\epsilon},
 \qquad
 \Omega_0^{-1}\eta_0=-1.                                \tag{6.10}
\]

Thus even a vanishing residual, vanishing Ritz lowering, perfect far
coercivity, zero far feedback, and valid finite sector signs do not imply a
decaying transverse low correction.  The example is an abstract Hermitian
model, not the arithmetic Weil matrix.  The separate exact Cauchy-form
countermodels in `notes/SIGNED_SECTOR_MIDDLE_WINDOW_OBSTRUCTION.md` show why
the presently proved scalar source bounds also have no missing sign content.

## 7. Smallest new lemma required

The three-scale program has therefore reached the following exact boundary.

1. Use the projective transverse space `mathcal L_M`, with
   `M=ceil(lambda)`, rather than charging the scalar low direction `P_Mkappa`.
2. Place the far boundary at the honest cutoff (4.1).  On the locked outer
   schedule, the source Cauchy form makes its complete direct low-row
   feedback super-polynomially small.
3. Prove, for the actual pole--archimedean--minus-prime operator and its
   actual forcing, the middle-short estimate (5.5), or prove the corresponding
   compact anchor/wedge graph products.
4. Separately prove the strict shifted even and odd signs required to select
   the unique finite ground line.

The smallest unresolved analytic input in this route is therefore not
another far-tail floor.  It is a cancellation-preserving, vector-specific
bound for `Omega_h^(-1)eta_h` through the entire interval

\[
 \lceil\lambda\rceil<|n|\leq
 M_*(\lambda,U,1).                                       \tag{7.1}
\]

No currently admitted scalar coefficient estimate, positive additive Gram,
or absolute Chebyshev-envelope bound controls that middle-window
orientation.
