# Even quotient-metric covariance and cyclic-enlargement audit

This note tests the two possible repairs left open by
`notes/PARITY_DANGEROUS_ALL_SHIFT_METRIC_ROTATION_AUDIT.md`:

1. whether the actual source quotient metric approximately commutes with the
   even operator; and
2. whether the zero-shift inverse on the complete cyclic enlargement of the
   dangerous space has a controllable metric norm.

The answer supplied by the currently proved estimates is **no in both
cases**.  There is, however, an exact signed commutator formula, an exact
description of the cyclic seed, and a finite-dimensional sufficient
covariance inequality which isolates a genuinely new source-specific
estimate.

All identities below use the source Fourier convention, the zero-extension
operator on

\[
 I=[-\log\lambda,\log\lambda],\qquad L=2\log\lambda,
\]

the inclusive prime-power inventory `n<=lambda^2`, and the minus sign on the
prime block.  No zero table, zero reality, global Weil positivity, or stored
diagnostic matrix is used.  No sign on the even source form and no
asymptotic theorem is proved.  The project state remains `P0_INVALIDATED`.

## 1. Operators and the actual quotient metric

Work on the normalized-anchor complement `K=K_+` and put

\[
 B=P_K(Q_\lambda-U I)P_K|_K.
\tag{1.1}
\]

The exact weighted-PNT normal form is

\[
 \boxed{B=(c_*-U)I+A_{\rm tail}^K-T_D^K.}
\tag{1.2}
\]

Here

\[
 \rho_{\rm tail}(h)={e^{-5h/2}\over1-e^{-2h}},
\qquad
 (K_hf)(x)=\widetilde f(x+h)+\widetilde f(x-h),
\tag{1.3}
\]

and, after compression to `K`,

\[
 A_{\rm tail}^K
 =\int_0^\infty(2I-K_h^K)\rho_{\rm tail}(h)\,dh,
\qquad
 T_D^K=\int_{[0,L]}K_h^K\,dD_\lambda(h),
\tag{1.4}
\]

with

\[
 D_\lambda(h)
 =\sum_{1<n\leq e^h}{\Lambda(n)\over\sqrt n}
  -2(e^{h/2}-1).
\tag{1.5}
\]

The physical low range and its source quotient metric are

\[
 K_L=\operatorname {ran}W_L,
 \qquad D_L=D_8\oplus D_R,
\tag{1.6}
\]

\[
 R_L=W_LD_L^{-1}W_L^*,
 \qquad
 \Delta_L=R_L^\dagger|_{K_L}=R_L^{-1}|_{K_L}.
\tag{1.7}
\]

On `K=K_L direct-sum K_H`, define

\[
 \Delta=\Delta_L\oplus I_{K_H},
 \qquad
 S=\Delta^{-1}=R_L\oplus I_{K_H}.
\tag{1.8}
\]

The proved quotient-action theorem controls maps with `S=Delta^(-1)` on
the right.  It gives neither an upper bound for `Delta` nor a commutator
estimate with `B`.

Indeed, relative to `K_L direct-sum K_H`, write

\[
 B=\begin{bmatrix}B_{LL}&B_{LH}\\B_{HL}&B_{HH}\end{bmatrix}.
\]

Direct multiplication gives

\[
 \boxed{
 [S,B]=
 \begin{bmatrix}
  [R_L,B_{LL}]&(R_L-I)B_{LH}\\
  B_{HL}(I-R_L)&0
 \end{bmatrix}.}
\tag{1.9}
\]

Thus even exact covariance of the low compression would not suffice: the
low--high coupling must also land in the unit-eigenspace of `R_L`.  The
corresponding metric commutator is

\[
 \boxed{[\Delta,B]=-\Delta[S,B]\Delta.}
\tag{1.10}
\]

No existing estimate bounds the right side of (1.10).

## 2. Exact signed source commutator

The scalar in (1.2) commutes with `S`.  For `h>=L`, zero extension gives
`K_h=0` up to null endpoints, so the part of `A_tail` beyond `L` is scalar
and also commutes.  Consequently

\[
 [S,A_{\rm tail}^K]
 =-\int_0^L[S,K_h^K]\rho_{\rm tail}(h)\,dh.
\tag{2.1}
\]

Moreover,

\[
 [S,T_D^K]=\int_{[0,L]}[S,K_h^K]\,dD_\lambda(h).
\tag{2.2}
\]

The endpoint terms in Stieltjes integration by parts vanish because

\[
 D_\lambda(0)=0,
 \qquad K_{h=L}^K=0,
 \qquad [S,K_0^K]=[S,2I]=0.
\tag{2.3}
\]

Combining (1.2), (2.1), and (2.2) therefore gives the exact finite identity

\[
 \boxed{
 [S,B]
 =-\int_0^L[S,K_h^K]\rho_{\rm tail}(h)\,dh
  +\int_0^L D_\lambda(h)
       {d\over dh}[S,K_h^K]\,dh.}
\tag{2.4}
\]

The plus sign on the second integral is forced by the source minus sign in
`B=A_tail-T_D+(scalar)`.  Formula (2.4), not separate absolute majorants for
its two terms, is the relevant metric-covariance quantity.  It also shows
precisely why the existing magnitude-only PNT envelope does not prove
approximate commutation: it discards the signed cancellation in (2.4), and
the quotient-action theorem contains no translation-covariance estimate
for `R_L`.

## 3. A quantitative covariance theorem

The commutator question admits a useful exact sufficient criterion.  The
criterion is stated for a general finite-dimensional self-adjoint `B` and
positive `Delta`; it is then specialized to (1.2).

Put `S=Delta^(-1)` and define

\[
 \mu=\lambda_{\min}(S^{1/2}BS^{1/2}),
 \qquad
 \epsilon=\|[B,S^{1/2}]S^{1/2}\|.
\tag{3.1}
\]

### Theorem 3.1 (metric-covariance floor)

If `mu>epsilon`, then for every `sigma>=0`,

\[
 \boxed{
 \|(B+\sigma I)x\|
 \geq(\mu-\epsilon)\|\Delta x\|.}
\tag{3.2}
\]

In particular, `B>0` and the even all-shift coframe constant satisfies

\[
 \boxed{
 \sup_{\sigma\geq0}
 \|\Delta(B+\sigma I)^{-1}i_Y\|
 \leq{1\over\mu-\epsilon},
 \qquad
 \beta_+\geq\mu-\epsilon.}
\tag{3.3}
\]

**Proof.**  Set `z=Delta x`, so `x=Sz`.  The exact identity

\[
 BS=S^{1/2}BS^{1/2}+[B,S^{1/2}]S^{1/2}
\tag{3.4}
\]

and the triangle inequality give (3.2) at `sigma=0`.  Replacing `B` by
`B+sigma I` adds the positive term `sigma S` to the first operator in
(3.1) and leaves the commutator unchanged, so the same lower bound holds
for every nonnegative shift.  Inverting proves (3.3).  Positivity follows
from `mu>0` and congruence.  \(\square\)

There is also a direct conversion from (2.4).  If

\[
 s_-=\lambda_{\min}(S),\qquad s_+=\|S\|,
\tag{3.5}
\]

then `X=[B,S^(1/2)]` solves the Sylvester equation

\[
 S^{1/2}X+XS^{1/2}=[B,S].
\tag{3.6}
\]

The positive spectral separation of the two Sylvester blocks yields

\[
 \|X\|\leq{\|[B,S]\|\over2\sqrt{s_-}},
\]

and hence

\[
 \boxed{
 \epsilon
 \leq {1\over2}\sqrt{{s_+\over s_-}}\,\|[B,S]\|.}
\tag{3.7}
\]

For the source operator, a sufficient quantitative target is therefore

\[
\boxed{
\begin{aligned}
 &\lambda_{\min}\!\left(
 S^{1/2}\big((c_*-U)I+A_{\rm tail}^K-T_D^K\big)S^{1/2}
 \right)\\
 &\quad-
 \left\|
 \big[(c_*-U)I+A_{\rm tail}^K-T_D^K,S^{1/2}\big]S^{1/2}
 \right\|
 \gg {1\over\sqrt\lambda\,\operatorname {polylog}(\lambda)}.
\end{aligned}}
\tag{3.8}
\]

Every term in (3.8) is source-reconstructible and finite.  The commutator
can be retained in the combined signed form (2.4).  No current theorem
proves either the positive weighted floor or the required covariance
margin.  Thus (3.8) is a new sufficient arithmetic estimate, not a proved
replacement for the original `beta_+` target.

## 4. Exact complete-symbol cyclic seed

Let

\[
 v=[g+U-m_\lambda]_+,
 \qquad a=[m_\lambda-(g+U)]_+,
\tag{4.1}
\]

so `a(t)v(t)=0` pointwise.  On `K`, put

\[
 R=T_v^K,
 \qquad
 Y=\operatorname {Ran}1_{[g-\delta,\infty)}(R),
 \qquad F=Y^\perp,
\tag{4.2}
\]

and write

\[
 B=\begin{bmatrix}D&\Gamma^*\\\Gamma&H\end{bmatrix}
 \quad\hbox{on }Y\oplus F.
\tag{4.3}
\]

Since `Y` and `F` reduce `R`, both source normal forms give

\[
 \boxed{
 \Gamma=P_F(A_{\rm tail}^K-T_D^K)P_Y
       =P_F(T_a^K+2|p\rangle\langle p|)P_Y,}
\tag{4.4}
\]

where `p=P_Kp_+`.  The second expression has an additional exact boundary
factorization.  Let `C_K` denote zero extension followed by the inclusion
of `K` in `L^2(R)`, let

\[
 \mathscr P_K=\mathscr C_K\mathscr C_K^*,
 \qquad
 \mathscr H_w=(I-\mathscr P_K)
   \mathcal F^*M_w\mathcal F\mathscr C_K.
\tag{4.5}
\]

The pointwise identity `av=0` implies, as a finite compressed-form
identity,

\[
 0=(T_{av})^K=T_a^KT_v^K+\mathscr H_a^*\mathscr H_v,
\tag{4.6}
\]

so

\[
 \boxed{T_a^KR=-\mathscr H_a^*\mathscr H_v.}
\tag{4.7}
\]

The restriction `R_Y=R|_Y` is invertible and
`R_Y>= (g-delta)I_Y`.  Therefore (4.4)--(4.7) give

\[
 \boxed{
 \Gamma
 =-P_F\mathscr H_a^*\mathscr H_vP_YR_Y^{-1}
  +2|P_Fp\rangle\langle P_Yp|.}
\tag{4.8}
\]

This is the exact combined boundary-Hankel/pole seed.  Estimating the two
terms separately would again erase a possible cancellation.

Define the `H`-cyclic seed space

\[
 \mathcal C_H
 =\operatorname {span}\{H^j\Gamma y:
       y\in Y,\ j\geq0\}\subseteq F.
\tag{4.9}
\]

Finite dimensionality and self-adjointness make `C_H` a reducing subspace
for `H`.  Block multiplication now proves the exact identity

\[
 \boxed{\mathcal M_B(Y)=Y\oplus\mathcal C_H,}
\tag{4.10}
\]

where `M_B(Y)` is the smallest reducing subspace of `B` containing `Y`.
Indeed, the right side is `B`-invariant because `Gamma^* C_H` lies in `Y`;
conversely, every reducing subspace containing `Y` contains `Gamma Y` and
then every `H^j Gamma Y`.

Formula (4.8) does not make (4.10) small.  An arbitrarily small nonzero seed
can be cyclic for all of `H`; exact cyclic dimension is discontinuous under
small-norm perturbations.  No current source estimate controls the spectral
support of (4.8) relative to `H`.

## 5. What would control the cyclic inverse

Assume in this section that `B>0`.  Let `M=M_B(Y)`, let `i_M:M->K` be
inclusion, and put `B_M=B|_M`.  The cyclic-enlargement estimate is

\[
 \beta_+^{-1}
 \leq C_{\rm cyc}:=\|\Delta i_MB_M^{-1}\|.
\tag{5.1}
\]

This norm has an intrinsic metric on `M`.  Define

\[
 D_M=(i_M^*\Delta^2i_M)^{1/2},
 \qquad S_M=D_M^{-1}.
\tag{5.2}
\]

Then

\[
 C_{\rm cyc}=\|D_MB_M^{-1}\|.
\tag{5.3}
\]

Applying Theorem 3.1 inside `M`, with

\[
 \mu_M=\lambda_{\min}(S_M^{1/2}B_MS_M^{1/2}),
 \qquad
 \epsilon_M=\|[B_M,S_M^{1/2}]S_M^{1/2}\|,
\tag{5.4}
\]

gives the valid sufficient bound

\[
 \boxed{C_{\rm cyc}\leq(\mu_M-\epsilon_M)^{-1}}
 \quad\hbox{if }\mu_M>\epsilon_M.
\tag{5.5}
\]

This does not yet reduce the arithmetic.  The exact space `M` may equal
all of `K`, and the compressed metric `D_M` is not inherited from the
source block quotient in a way controlled by the existing action theorem.

There is a second limitation: (5.1) is only a sufficient zero-shift upper
bound for the all-shift inverse.  It need not have the correct size.

## 6. Exact cyclic-loss audit of the three-dimensional model

Use the positive family from Section 4 of
`notes/PARITY_DANGEROUS_ALL_SHIFT_METRIC_ROTATION_AUDIT.md`:

\[
 B_M=\begin{bmatrix}M+3&1&2\\1&1&0\\2&0&2\end{bmatrix},
 \qquad Y=\operatorname {span}\{e_0\},
\tag{6.1}
\]

and

\[
 \Delta_M=|e_0\rangle\langle e_0|
 +|\ell\rangle\langle\ell|+M^2|w\rangle\langle w|,
\quad
 \ell={e_1+e_2\over\sqrt2},\quad
 w={e_1-e_2\over\sqrt2}.
\tag{6.2}
\]

The exact Krylov determinant is

\[
 \boxed{\det[e_0,B_Me_0,B_M^2e_0]=2,}
\tag{6.3}
\]

so the cyclic enlargement is the whole three-dimensional space.  Solving
`B_Mx=e_1` gives

\[
 B_M^{-1}e_1=
 \left(-{1\over M},1+{1\over M},{1\over M}\right),
\tag{6.4}
\]

and hence

\[
 \boxed{
 \|\Delta_MB_M^{-1}e_1\|^2
 ={M^4\over2}+{(1+2/M)^2\over2}+{1\over M^2}.}
\tag{6.5}
\]

Thus `C_cyc=Theta(M^2)`.

By contrast, the actual all-shift inverse from `Y` is only `Theta(M)`.  For
`sigma>=0`, put

\[
 a_\sigma={1\over1+\sigma},\qquad
 b_\sigma={2\over2+\sigma},
\tag{6.6}
\]

\[
 S_\sigma=M+3+\sigma-a_\sigma-2b_\sigma.
\tag{6.7}
\]

Direct solution and rotation into the `ell,w` basis give

\[
\boxed{
 \|\Delta_M(B_M+\sigma I)^{-1}e_0\|^2
 ={1+\tfrac12(a_\sigma+b_\sigma)^2
       +\tfrac12M^4(b_\sigma-a_\sigma)^2
   \over S_\sigma^2},}
\tag{6.8}
\]

where

\[
 b_\sigma-a_\sigma
 ={\sigma\over(\sigma+1)(\sigma+2)},
 \qquad S_\sigma\geq M+\sigma.
\tag{6.9}
\]

The value `sigma=1` is bounded below by a constant times `M`, while (6.8)
and (6.9) give an `O(M)` upper bound uniformly in `sigma`.  Therefore

\[
 \boxed{
 \sup_{\sigma\geq0}
 \|\Delta_M(B_M+\sigma I)^{-1}i_Y\|=\Theta(M),
 \qquad C_{\rm cyc}=\Theta(M^2).}
\tag{6.10}
\]

The cyclic enlargement is exact, but its complete zero-shift operator norm
can lose an additional unbounded factor because it tests metric directions
which are never reached with the same strength by the shifted input from
`Y`.

## 7. Exact conclusion

The actual quotient metric is not proved to commute, even approximately,
with the source even operator.  Its commutator consists of two independent
geometric requirements in (1.9) and of the signed arithmetic cancellation
in (2.4).  Existing sampling-action estimates imply neither.

The complete-symbol projector does identify the exact cyclic seed through
(4.8), and the full cyclic space through (4.10), but supplies no bound on
its `H`-spectral spread or on the inverse metric (5.3).  Even abstractly,
the cyclic bound can be parametrically larger than the true all-shift norm,
as (6.10) shows.

The smallest source-compatible sufficient repair isolated here is the
combined weighted covariance margin (3.8), or its exact cyclic version
(5.4)--(5.5).  It must be proved for the actual signed discrepancy without
splitting the archimedean and prime contributions into absolute norms.
That estimate is presently open.  It is not an RH proof, a positivity
certificate, or an asymptotic determinant theorem.
