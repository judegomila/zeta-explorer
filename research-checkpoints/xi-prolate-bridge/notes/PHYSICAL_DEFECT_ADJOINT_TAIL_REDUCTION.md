# Physical defect, adjoint-tail, and shifted odd-floor reduction

## 0. Status and claim boundary

This note sharpens three unresolved estimates in the direct
Xi--prolate--Weil bridge.

1. The auxiliary even cap cancels from the leverage-excess symbol.  The
   remaining quantity is exactly a weighted Hilbert--Schmidt distance from
   the physical prolate range.
2. The normalized prolate coframe loss has an exact rank-one correction.
   This gives a strictly weaker sufficient condition than the earlier
   `2*lambda/s` Cauchy majorant.
3. The odd rank-one test can be shifted to a prescribed positive floor.  Its
   resolvent load has an exact chord correction, a monotone moment hierarchy,
   and an exact aligned-positive-excess formula.

All statements below are finite-dimensional identities or conditional
reductions.  No estimate proved here controls the actual physical defect,
the actual normalized prolate adjoint tail, or the actual odd directional
reserve on an unbounded common schedule.  In particular, this note proves no
signed sector floor, no instance of equation (5.2) of
`DIRECT_RH_ATTACK.md`, no locally uniform determinant convergence, and no
Riemann-hypothesis conclusion.  The repository state remains
`P0_INVALIDATED`.

## 1. Locked conventions

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,
 \qquad I_\lambda=[-\ell,\ell].                         \tag{1.1}
\]

The physical interval carries Lebesgue measure in logarithmic coordinates,
equivalently `du/u` on `[lambda^(-1),lambda]`, and physical functions are
extended by zero.  The Fourier convention is

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                          \tag{1.2}
\]

Inversion is reflection `Jf(x)=f(-x)`.  The complete signed multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                 \tag{1.3}
\]

Thus the minus sign on the prime block is retained and every prime power at
the inclusive endpoint `n<=lambda^2` is present.  For the exact reconstructed
scalar shift `U`, write

\[
 w(t)=m_\lambda(t)-U.                                   \tag{1.4}
\]

The even and odd pole terms are respectively

\[
 +2|p_+\rangle\langle p_+|,
 \qquad -2|p_-\rangle\langle p_-|.                     \tag{1.5}
\]

All prolate source functions live on `[-lambda,lambda]` with Lebesgue
measure and zero extension.  This source interval is not the physical
logarithmic interval (1.1).  The zero-integral source correction and the
actual source Gram `C^*C` are mandatory.  Unit-normalizing the combined
source state changes its limiting scalar and remains rejected.

The replay inputs are canonical positive decimal text.  The finite oracle
admits `3<=lambda_numerator<=999999` and `50<=dps<=1000`; the bounds are
checked before integer conversion or interval initialization.  The interval
runtime must identify itself as the source-pinned `mpmath==1.4.1`.  A version
mismatch is a hard failure, not an alternate numerical path.

## 2. The cap-free even defect

Fix

\[
 L>0,\qquad 0\leq\mu<\nu\leq c,\qquad g=cL.             \tag{2.1}
\]

The soft negative symbol used in the preceding checkpoint is

\[
 v_c(t)=(cL-w(t))_+.                                    \tag{2.2}
\]

The threshold in its leverage-excess estimate is
`tau=(c-nu)L>=0`.  The elementary scalar identity

\[
 ((x)_+-\tau)_+=(x-\tau)_+\qquad(\tau\geq0)             \tag{2.3}
\]

gives the exact cancellation

\[
 \boxed{
 ((cL-w(t))_+-(c-\nu)L)_+=(\nu L-w(t))_+.}              \tag{2.4}
\]

The positive parts in (2.4) are scalar pointwise positive parts.  Equation
(2.4) is not an operator identity involving the positive part of a
noncommuting compression.

Let `X` be a declared finite target parity space, let `W` synthesize the
physical prolate columns in `X`, and put

\[
 K=\operatorname {ran}W,\qquad H=K^\perp,
 \qquad P_H=I-P_K.                                      \tag{2.5}
\]

For the Fourier evaluation vector `e_t`, define

\[
 \kappa_H(t)=\langle e_t,P_He_t\rangle.                 \tag{2.6}
\]

The cap-free excess is

\[
 \boxed{
 \mathcal E_H(\nu)=
 \int_{\mathbb R}(\nu L-w(t))_+\kappa_H(t)\,d\nu(t).} \tag{2.7}
\]

Combining (2.4) with the preceding soft-short comparison yields

\[
 \boxed{
 P_H(Q_{\lambda,+}-UI)P_H\succeq
 \{\nu L-\mathcal E_H(\nu)\}I_H.}                     \tag{2.8}
\]

Consequently the strict target floor `mu*L` follows from

\[
 \boxed{
 \mathcal E_H(\nu)<(\nu-\mu)L.}                       \tag{2.9}
\]

Equality in (2.9) supplies no strict reserve and is rejected.  The cap `c`
has disappeared from (2.7)--(2.9); increasing it cannot improve the actual
analytic obligation.

## 3. Weighted capture as an exact least-squares problem

Let

\[
 d_\nu(t)=(\nu L-w(t))_+,
 \qquad D_\nu=T_{d_\nu}\succeq0                         \tag{3.1}
\]

be the time-limited multiplier compression on `X`.  Then

\[
 \mathcal E_H(\nu)
 =\operatorname {tr}(P_HD_\nu P_H)
 =\|P_HD_\nu^{1/2}\|_{\rm HS}^2.                       \tag{3.2}
\]

Here `D_nu^(1/2)` is the matrix square root of the compressed multiplier.  It
is not generally the Toeplitz compression of `sqrt(d_nu)`.

Let `Y:X->source-coordinates` range over every compatible linear map.  Since
`WY` ranges over operators whose columns lie in `K`, orthogonal projection
of each column gives

\[
 \boxed{
 \mathcal E_H(\nu)=
 \inf_Y\|(I-WY)D_\nu^{1/2}\|_{\rm HS}^2.}              \tag{3.3}
\]

No full-column-rank hypothesis on `W` is needed.  The Moore--Penrose choice
`Y=W^dagger` attains the infimum and gives `WY=P_K`.  Equivalently, with
`G=W^*W`,

\[
 \mathcal E_H(\nu)=
 \operatorname {tr}D_\nu-
 \operatorname {tr}(G^\dagger W^*D_\nu W).             \tag{3.4}
\]

Thus the missing even estimate is a weighted capture theorem for the full
defect operator, not an approximation theorem for one distinguished state.

### 3.1 A full-source competitor

Let

\[
 T:\mathcal H_0^{\rm ev}\longrightarrow X              \tag{3.5}
\]

be the full source arithmetic/parity map.  Suppose `B_X:X->H_0^ev` is any
right inverse, `TB_X=I_X`.  If `F=ran(C)` is the corrected finite prolate
source space and `W=TC`, then `P_HTP_F=0`.  Therefore

\[
 P_H=P_HTB_X=P_HT(I-P_F)B_X.                            \tag{3.6}
\]

Using (3.2) and dropping the final contraction gives the certified
competitor bound

\[
 \boxed{
 \mathcal E_H(\nu)\leq
 \|T(I-P_F)B_XD_\nu^{1/2}\|_{\rm HS}^2.}              \tag{3.7}
\]

Equation (3.7) is useful only after proving a weighted adjoint/source-tail
estimate.  The existing norm bound on `B_X` alone is far too coarse.

## 4. The necessary central-band trace scale

Fix `0<delta<pi/2` and put

\[
 B_\delta=\{t:|t|\leq\delta/L\},\qquad
 A_{\lambda,\nu,\delta}
 =\operatorname*{ess\,inf}_{t\in B_\delta}d_\nu(t).    \tag{4.1}
\]

Since `d_nu>=A_(lambda,nu,delta)*1_(B_delta)`, equations
(3.1)--(3.2) give

\[
 \boxed{
 \mathcal E_H(\nu)\geq
 A_{\lambda,\nu,\delta}
 \operatorname {tr}(P_HT_{\mathbf1_{B_\delta}}P_H).}  \tag{4.2}
\]

If `A_(lambda,nu,delta)>0`, then (2.9) necessarily forces

\[
 \boxed{
 \operatorname {tr}(P_HT_{\mathbf1_{B_\delta}}P_H)
 <{(\nu-\mu)L\over A_{\lambda,\nu,\delta}}.}          \tag{4.3}
\]

The pinned central prime estimate from the preceding checkpoint makes
`A_(lambda,nu,delta)` of order `lambda` whenever the reconstructed shift has
the stated `O(L)` lower control.  Under that hypothesis, the necessary scale
in (4.3) is

\[
 \operatorname {tr}(P_HT_{\mathbf1_{B_\delta}}P_H)
 =O(L/\lambda).                                        \tag{4.4}
\]

This is an ambient trace over every uncaptured target direction.  A
projection estimate for the single Xi comparison state can control one
quadratic form, but it does not imply (4.4).  Promoting a one-state estimate
to this trace bound is rejected.

## 5. Exact normalized coframe loss

Let the constant source vector be `mathbf 1`, with

\[
 \|\mathbf1\|^2=2\lambda,\qquad
 \mathcal H_0=\mathbf1^\perp.                           \tag{5.1}
\]

Let `E` be a finite raw prolate space and set

\[
 u=P_E\mathbf1,\qquad e=(I-P_E)\mathbf1,
 \qquad s=\|u\|^2>0,
 \qquad F=E\cap\mathcal H_0.                           \tag{5.2}
\]

Let `Z:H_0->X` be the normalized full-source coisometry,

\[
 ZZ^*=I_X,qquad \operatorname {ran}Z^*\subseteq\mathcal H_0, \tag{5.3}
\]

and define the raw-space adjoint tail

\[
 A=(I-P_E)Z^*.                                         \tag{5.4}
\]

For `z=Z^*x`, the exact orthogonal split from the preceding checkpoint is

\[
 \|(I-P_F)z\|^2
 =\|(I-P_E)z\|^2+{|\langle e,(I-P_E)z\rangle|^2\over s}. \tag{5.5}
\]

The inclusion in (5.3) is essential: it gives
`<u,z>=-<e,z>`.  Polarizing (5.5) yields the exact operator identity

\[
 \boxed{
 Z(I-P_F)Z^*
 =A^*A+{(A^*e)(A^*e)^*\over s}.}                       \tag{5.6}
\]

Thus the exact coframe criterion is

\[
 \boxed{
 \left\|A^*A+{(A^*e)(A^*e)^*\over s}\right\|<1.}      \tag{5.7}
\]

When (5.7) holds, `ZP_FZ^*>0` and the normalized determinant volume is
positive.  If in addition `R=TT^*>0` and `Z=R^(-1/2)T`, this is equivalent
to `TP_FT^*>0`.  Equality of the norm to one is singular and is rejected.

Put

\[
 \rho=\|A\|^2,
 \qquad \beta_E={\|A^*e\|^2\over s}.                  \tag{5.8}
\]

Then the scalar condition

\[
 \boxed{\rho+\beta_E<1}                                \tag{5.9}
\]

is sufficient for (5.7).  It is not equivalent to (5.7).  Since

\[
 \beta_E\leq\rho{2\lambda-s\over s},
 \qquad
 \rho+\beta_E\leq{2\lambda\over s}\rho=:\Theta,     \tag{5.10}
\]

(5.9) is never stronger and can be strictly weaker than the old
`Theta<1` sufficient condition.  The boundary `rho+beta_E=1` is only
inconclusive unless the exact norm in (5.7) is also proved to be one.

### 5.1 What the full-source floor would require

With `R=TT^*` and `Z=R^(-1/2)T`, put

\[
 \epsilon_E=\|(I-P_E)T^*\|.                            \tag{5.11}
\]

The admitted full-source right inverse gives

\[
 R\succeq{1\over2\lambda^2M_\mu(\lambda)^2}I,
 \qquad M_\mu(\lambda)\leq2\lambda.                  \tag{5.12}
\]

Therefore

\[
 \rho\leq2\lambda^2M_\mu(\lambda)^2\epsilon_E^2      \tag{5.13}
\]

and the old majorant obeys

\[
 \boxed{
 \Theta\leq{4\lambda^3M_\mu(\lambda)^2\over s}
             \epsilon_E^2
 \leq{16\lambda^5\over s}\epsilon_E^2.}              \tag{5.14}
\]

No present theorem supplies the required growing-family estimate for
`epsilon_E`.  Equation (5.14) is a reduction, not a prolate adjoint-tail
bound.

## 6. The odd rank-one test at a prescribed floor

Let

\[
 c>a>\beta\geq0,qquad L>0,qquad
 0\preceq R\preceq(c-a)LI.                              \tag{6.1}
\]

The capped base is `M_0=cLI-R`.  To test the strict floor `beta*L`, define

\[
 q=(c-\beta)L,qquad h=(a-\beta)L,qquad
 M_\beta=qI-R.                                         \tag{6.2}
\]

Then `M_beta>=hI>0`.  The exact rank-one Schur criterion is

\[
 \boxed{
 M_0-2|p\rangle\langle p|\succ\beta LI
 \quad\Longleftrightarrow\quad
 2\langle p,M_\beta^{-1}p\rangle<1.}                  \tag{6.3}
\]

Load one is the singular boundary and is rejected.  Using the unshifted
inverse `M_0^(-1)` in (6.3) would test only positivity, not the requested
positive floor.

Put

\[
 \mu_0=\|p\|^2,
 \qquad \rho_j=\langle p,R^jp\rangle,                 \tag{6.4}
\]

and

\[
 \chi_\beta=
 \left\langle p,
 \{(c-a)LI-R\}R(qI-R)^{-1}p\right\rangle\geq0.        \tag{6.5}
\]

Every factor in (6.5) is a function of `R`.  The exact chord identity is

\[
 \boxed{
 2\langle p,M_\beta^{-1}p\rangle
 ={2(h\mu_0+\rho_1-\chi_\beta)\over hq}.}             \tag{6.6}
\]

The correction `chi_beta` cannot be dropped.  Omitting it gives only the
endpoint chord majorant and may substantially change the load.

Since `M_beta<=qI`,

\[
 2\langle p,M_\beta^{-1}p\rangle\geq{2\mu_0\over q}.  \tag{6.7}
\]

Thus even the shifted capped route necessarily requires

\[
 \boxed{\mu_0<{(c-\beta)L\over2}.}                     \tag{6.8}
\]

For the actual odd pole this is still a squared physical pole-leakage
requirement.  Capping the negative multiplier does not remove it.

## 7. A monotone directional-moment hierarchy

For every integer `k>=0`, define

\[
 \boxed{
 U_k=2\left(
 \sum_{j=0}^{k-1}{\rho_j\over q^{j+1}}
 +{\rho_k\over hq^k}\right),}                         \tag{7.1}
\]

where the empty sum is zero.  The finite resolvent expansion gives

\[
 U_k\geq2\langle p,M_\beta^{-1}p\rangle.              \tag{7.2}
\]

More precisely, since `q-h=(c-a)L`,

\[
 \boxed{
 U_k-U_{k+1}
 ={2\over hq^{k+1}}
 \langle p,R^k\{(q-h)I-R\}p\rangle\geq0,}             \tag{7.3}
\]

and

\[
 \boxed{
 U_k-2\langle p,M_\beta^{-1}p\rangle
 ={2\over hq^k}
 \langle p,R^k\{(q-h)I-R\}(qI-R)^{-1}p\rangle
 \geq0.}                                               \tag{7.4}
\]

Thus `U_k` is nonincreasing, but it need not decrease strictly.  The first
nontrivial bound `U_1` is exactly the chord expression obtained by omitting
`chi_beta`; equation (6.6) records its exact remainder.

A proof that some `U_k<1` gives the strict floor in (6.3).  No such moment
estimate for the physical odd pole is proved here.

## 8. Aligned positive excess

Let `A_+>=0` denote the retained positive multiplier excess in the odd high
space.  With

\[
 S=M_\beta^{-1/2}A_+M_\beta^{-1/2},
 \qquad z=M_\beta^{-1/2}p,                              \tag{8.1}
\]

the exact load after positive compensation is

\[
 \boxed{
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 =2\|z\|^2-2\langle z,S(I+S)^{-1}z\rangle.}            \tag{8.2}
\]

Only the component of the positive excess aligned with `z` lowers the
rank-one load.  A large operator norm in a transverse direction gives no
automatic reserve.

For a rank-one excess `A_+=alpha|u><u|`, put
`y=M_beta^(-1/2)u`.  Sherman--Morrison gives

\[
 \boxed{
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 =2\|z\|^2-
 {2\alpha|\langle y,z\rangle|^2\over1+\alpha\|y\|^2}.} \tag{8.3}
\]

As `alpha->infinity`, the surviving obstruction is
`2*||P_(y^perp)z||^2<1`.

## 9. Shifted one-direction Schur form

For any actual positive base `M`, let `p!=0`,
`e_p=p/||p||`, and `G=e_p^perp`.  Relative to
`span(e_p) direct-sum G`, define

\[
 \alpha_\beta=\langle e_p,(M-\beta LI)e_p\rangle,
 \quad b=P_G(M-\beta LI)e_p,
 \quad C_\beta=P_G(M-\beta LI)P_G.                    \tag{9.1}
\]

Then

\[
 \boxed{
 M-2|p\rangle\langle p|\succ\beta LI
 \Longleftrightarrow
 C_\beta\succ0,
 \quad
 \alpha_\beta-2\|p\|^2-
 \langle b,C_\beta^{-1}b\rangle>0.}                  \tag{9.2}
\]

For example, the sufficient estimates

\[
 C_\beta\succeq\eta I,
 \qquad
 \alpha_\beta-2\|p\|^2-{\|b\|^2\over\eta}>0         \tag{9.3}
\]

certify the strict floor.  The unshifted one-direction test cannot be
substituted for (9.2).

## 10. Exact regression oracles

The producer and independent replay use exact reduced rationals.  Their
fixtures are theorem regressions, not physical Xi--prolate matrices.

### 10.1 Weighted capture

Take

\[
 D=\operatorname {diag}(9,1,4),\qquad
 W=\begin{pmatrix}1&0\\1&1\\0&1\end{pmatrix}.          \tag{10.1}
\]

Then

\[
 W^*W=\begin{pmatrix}2&1\\1&2\end{pmatrix},
 \qquad
 \operatorname {tr}(P_HD)={14\over3},
 \qquad
 \operatorname {tr}(P_KD)={28\over3}.                 \tag{10.2}
\]

This checks both the least-squares optimum and the exact split
`tr(D)=14=14/3+28/3`.

For a separate central-band domination oracle, retain the same `W`, put

\[
 T_B=\operatorname {diag}(1,1/2,0),\qquad
 A=6,\qquad D_{\rm central}=6T_B=\operatorname {diag}(6,3,0). \tag{10.3}
\]

If `h=(-1,1,-1)` spans `H`, then

\[
 \operatorname {tr}(P_HD_{\rm central})=3,
 \qquad \operatorname {tr}(P_HT_BP_H)=1/2.             \tag{10.4}
\]

Thus the domination premise is an exact equality and a strict defect budget
`3<4` forces the certified trace conclusion `1/2<4/6=2/3`.  The matrix
`D` in (10.1) is not used for this premise.

For the source-tail competitor in (3.7), take

\[
 T=\begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&1&0\end{pmatrix},
 \quad B_X=T^*,
 \quad
 C=\begin{pmatrix}1&0\\1&1\\0&1\\1&0\end{pmatrix}.   \tag{10.5}
\]

Then `TC=W`, `TB_X=I`, and the exact competitor cost is

\[
 \|T(I-P_F)B_XD^{1/2}\|_{\rm HS}^2={144\over25}
 ={14\over3}+{82\over75}.                              \tag{10.6}
\]

It is a valid upper bound but not the least-squares optimum.

### 10.2 Exact coframe correction

Take an exact finite model with `2*lambda=5`, raw space `E`, and normalized
coisometry `Z` such that

\[
 A^*A={1\over4}\begin{pmatrix}1&1\\1&1\end{pmatrix},
 \qquad
 {(A^*e)(A^*e)^*\over s}
 ={1\over12}\begin{pmatrix}1&1\\1&1\end{pmatrix}.    \tag{10.7}
\]

The exact loss is

\[
 {1\over3}\begin{pmatrix}1&1\\1&1\end{pmatrix},
 \qquad \|L_F\|={2\over3},
 \qquad \det(I-L_F)={1\over3}.                        \tag{10.8}
\]

The scalar exact-correction bound is `rho+beta_E=2/3`, while the old
Cauchy majorant is `Theta=5/6`.  Replacing the source Gram by the identity is
not part of this model and remains rejected.

### 10.3 Nonzero chord correction

Take

\[
 c=5,\quad a=2,\quad L=1,\quad
 R=\operatorname {diag}(1,2),\quad
 p=(1/2,1/3).                                           \tag{10.9}
\]

At the serialized unshifted floor `beta=0`,

\[
 \mu_0={13\over36},\qquad
 \rho_1={17\over36},\qquad
 \chi_0={43\over216},                                 \tag{10.10}
\]

and

\[
 2\langle p,(5I-R)^{-1}p\rangle={43\over216}.          \tag{10.11}
\]

Dropping `chi_0` incorrectly gives `43/180`.  At the genuinely shifted
floor `beta=1`,

\[
 q=4,\qquad h=1,
 \qquad \chi_1={5\over18},
 \qquad
 2\langle p,(4I-R)^{-1}p\rangle={5\over18}.            \tag{10.12}
\]

Omitting `chi_1` gives the incorrect chord value `5/12`.

At the shifted floor `beta=1`, the equality oracle

\[
 M_\beta=\operatorname {diag}(3,2),\qquad p=(0,1)       \tag{10.13}
\]

has

\[
 2\langle p,M_\beta^{-1}p\rangle=1,\qquad
 M_\beta-2|p\rangle\langle p|=\operatorname {diag}(3,0). \tag{10.14}
\]

It is singular and is rejected.  Replacing the required negative rank-one
term by a positive pole is also explicitly rejected by the exact regression.

### 10.4 Shifted one-direction reserve

Take

\[
 M=\begin{pmatrix}5&1\\1&4\end{pmatrix},
 \qquad p=(1,0).                                       \tag{10.15}
\]

At target floor `beta*L=2`, the transverse block is `C_beta=2`, the
off-diagonal block is `b=1`, and the Schur reserve in (9.2) is

\[
 (5-2)-2-{1\over2}={1\over2}>0.                        \tag{10.16}
\]

Keeping the unshifted transverse block `C=4` while shifting only the pole
direction would instead report the wrong reserve

\[
 (5-2)-2-{1\over4}={3\over4}.                          \tag{10.17}
\]

That mixed-floor substitution is rejected even though it happens to retain
the sign in this fixture.

At target floor `5/2`, the corresponding reserve is

\[
 (5-5/2)-2-{1\over4-5/2}=-{1\over6}<0.                \tag{10.18}
\]

The latter target must be rejected even though the unshifted odd block is
positive.

The fixtures explicitly reject a nonpositive reserve, a rank-one load at
one, a missing chord correction, a positive odd pole, a source Gram replaced
by the identity, and a promoted finite-model claim.

## 11. Exact next obligations

On one common unbounded schedule, a completion still requires all of the
following.

1. Prove the cap-free weighted capture estimate (2.9), equivalently the
   Hilbert--Schmidt distance estimate (3.3), for the actual physical prolate
   range.
2. Prove the `O(L/lambda)` central-band trace capture forced by (4.3), not
   merely a one-state projection estimate.
3. Prove the exact coframe loss in (5.7) is below one in both inversion
   sectors, or provide an alternative complete signed low/high comparison.
4. Prove the shifted odd load in (6.3) is below one, using either directional
   moments, aligned positive excess, or the shifted one-direction Schur
   form.
5. Combine those estimates with the residual-action rate in equation (5.2)
   and then prove locally uniform convergence of the correctly normalized
   regularized characteristic functions.

No finite fixture, numerical exponent, determinant sample, or real-axis
eigenvalue agreement is an asymptotic theorem.
