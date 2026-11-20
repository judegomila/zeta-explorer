# Physical leverage and shorted-positive Schur reduction

## 1. Scope

This note makes three exact advances in the direct prolate--Weil program:

1. the existing projected-state norm theorem removes the *eventual*
   nonvanishing caveat for the matched quadratic comparison anchor;
2. the physical high trace is written as an exact leverage deficit, retaining
   the orientation of the physical columns relative to the negative
   multiplier; and
3. a Krein short of the positive part absorbs its low--high coupling and
   leaves an automatic cross estimate involving only the negative operator.

The third point replaces an unnecessarily strong attempt to estimate the raw
cross block of the whole shifted Weil form.  It is a finite-dimensional
operator theorem, not the missing analytic estimate.

This note does **not** prove a source-coordinate signed low floor, a physical
leverage bound smaller than `g`, a co-frame lower bound, either signed sector
floor on an unbounded schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, or
locally uniform determinant convergence.  The repository terminal state
remains `P0_INVALIDATED`.

No zeta-zero table, global Weil-positivity assumption, cached Weil matrix, or
diagnostic eigenspace is used.  Every prime sum below includes all prime
powers `n<=lambda^2`, and the minus sign in the source prime block is
retained.

## 2. Exact parity decomposition

Fix a finite Fourier parity sector `X` and a real source-reconstructed shift
`U`.  With the conventions of
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`, write

\[
 w(t)=m_\lambda(t)-U,
 \qquad v(t)=[g-w(t)]_+,
 \qquad a(t)=[w(t)-g]_+ .                                  \tag{2.1}
\]

Here

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                                      \cos(t\log n),       \tag{2.2}
\]

with the locked Fourier sign
`fhat(t)=integral f(x) exp(-itx) dx`.  Let `T_a,T_v>=0` be the exact finite
compressions of the two multiplier weights and let `p_+`, `p_-` be the pole
representers.  On the two parity sectors the shifted form is exactly

\[
 B_+=Q_\lambda-U I=gI+C_+-R_+,
 \quad C_+=T_a+2|p_+\rangle\langle p_+|,
 \quad R_+=T_v,                                           \tag{2.3}
\]

\[
 B_-=Q_\lambda-U I=gI+C_--R_-,
 \quad C_-=T_a,
 \quad R_-=T_v+2|p_-\rangle\langle p_-|.                 \tag{2.4}
\]

Thus both cases have the common form

\[
 \boxed{B=gI+C-R,\qquad C\succeq0,\quad R\succeq0.}       \tag{2.5}
\]

The positive and negative pieces in (2.5) are kept separate.  Replacing them
by separate absolute norms would discard the multiplier cancellation already
present in (2.1).

## 3. The matched comparison anchor is eventually nonzero

Let

\[
 a_4={\sqrt3\over2^{11/4}}>0,
 \qquad \rho_4=-{I_4\over I_0},
 \qquad c_4=e_4+\rho_4e_0.                                \tag{3.1}
\]

The locked source normalization gives the exact identity

\[
 h_\lambda=a_4c_4.                                        \tag{3.2}
\]

Let `T_(+,N)` mean arithmetic transform, exact inversion evenization, and
orthogonal projection into `E_N^+`, and put

\[
 p_4=T_{+,N}c_4.                                          \tag{3.3}
\]

If

\[
 a_{\lambda,N}=\|P_Nk_\lambda^+\|_2,                     \tag{3.4}
\]

then (3.2) and linearity give

\[
 \boxed{a_{\lambda,N}=a_4\|p_4\|_2.}                    \tag{3.5}
\]

On the matched schedule

\[
 \lambda={p\over2},\quad p\geq5\text{ odd},
 \qquad N=\lceil\lambda^2\rceil={p^2+3\over4},           \tag{3.6}
\]

one has `log(lambda)/(N+1)->0`.  The already-proved theorem (5.5) of
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` therefore gives

\[
 a_{\lambda,N}\longrightarrow
 a_\infty=\|E(h)(e^{\,\cdot})\|_2\geq K_*>0.              \tag{3.7}
\]

Combining (3.5)--(3.7),

\[
 \boxed{\|p_4\|_2\longrightarrow {a_\infty\over a_4}
        \geq {K_*\over a_4}>0.}                           \tag{3.8}
\]

Hence `p_4` is nonzero for every sufficiently large matched odd `p`.  This
removes the asymptotic anchor caveat in the matched count theorem.  The
threshold is non-effective: (3.8) does not certify anchor nonvanishing at
the finite pilot values `p=5` or `p=7`.

The conclusion is normalization-sensitive.  Replacing the source-fixed
state by a unit-norm state multiplies the limit in (3.7) by

\[
 {1\over\|h\|_2}={2^{17/4}\over\sqrt{33}}\ne1,            \tag{3.9}
\]

so that substitution remains a mandatory rejection.

## 4. Exact physical leverage deficit

Let `K=ran W` be a physical low range in `X`, let `H=K^perp`, and let

\[
 G=W^*W,
 \qquad P_K=WG^\dagger W^*,
 \qquad P_H=I-P_K.                                        \tag{4.1}
\]

Choose any orthonormal basis `(u_j)` of `X` and define its Fourier evaluation
density

\[
 \kappa_X(t)=\sum_j|\widehat u_j(t)|^2.                   \tag{4.2}
\]

If `mathcal W(t)` is the Fourier evaluation row whose entries are the
Fourier transforms of the columns of `W`, then the basis-free density of the
high complement is

\[
 \boxed{
 \kappa_H(t)=\kappa_X(t)-
             \mathcal W(t)G^\dagger\mathcal W(t)^*.}      \tag{4.3}
\]

Indeed, the second term is the diagonal of the Fourier kernel of `P_K`.
Since `T_v` is the integral of the Fourier evaluation rank-one forms against
`v(t)dt/(2pi)`, cyclicity of the finite trace gives

\[
\boxed{
 V_H:=\operatorname {tr}(P_HT_vP_H)
 =\int_{\mathbb R}v(t)\kappa_H(t){dt\over2\pi}
 =\operatorname {tr}T_v-
  \operatorname {tr}(G^\dagger W^*T_vW).}                 \tag{4.4}
\]

No dangerous eigenvector is needed.  Since the high compression is
positive,

\[
 \|P_HT_vP_H\|\leq V_H.                                  \tag{4.5}
\]

Thus `V_H<g` is an exact sufficient physical-high condition in the even
sector.  In the odd sector the corresponding trace majorant is

\[
 V_H+2\|P_Hp_-\|^2;                                       \tag{4.6}
\]

the second term vanishes if the pole representer is included in `K`.

Equations (4.3)--(4.4) identify the missing analytic target as a leverage
estimate: the physical columns must capture enough of the negative
multiplier trace that

\[
 \operatorname {tr}T_v-
 \operatorname {tr}(G^\dagger W^*T_vW)<g                 \tag{4.7}
\]

(with the surcharge (4.6) in the odd sector).  The existing total-trace
bound does not prove (4.7).

## 5. Prime second moment after leverage removal

The prime part of the leverage-weighted second moment also has an exact
finite expression.  Put

\[
 x=\lambda^2,
 \qquad c_n={\Lambda(n)\over\sqrt n},
 \qquad S_\lambda(t)=\sum_{1<n\leq x}c_n\cos(t\log n),     \tag{5.1}
\]

and define the high-complement translation trace

\[
 \Gamma_H(s)=\int_{\mathbb R}e^{its}\kappa_H(t){dt\over2\pi}
 =\Gamma_X(s)-\operatorname {tr}
       (G^\dagger W^*\mathsf T_sW).                       \tag{5.2}
\]

Here
`Gamma_X(s)=integral exp(its) kappa_X(t) dt/(2pi)` and `mathsf T_s` is the zero-extended translation
`(mathsf T_s f)(x)=f(x+s)` on the logarithmic interval.  Expanding the
cosine product before taking absolute values gives

\[
\boxed{
 M_H:=\int_{\mathbb R}S_\lambda(t)^2\kappa_H(t){dt\over2\pi}
 ={1\over2}\sum_{1<n,m\leq x}c_nc_m
 \left\{
  \operatorname {Re}\Gamma_H(\log(n/m))
 +\operatorname {Re}\Gamma_H(\log(nm))
 \right\}.}                                              \tag{5.3}
\]

The second translation has zero overlap when `nm>=x`.  Formula (5.3)
retains all prime-prime phases and every prime power at the inclusive
endpoint.  It is an exact finite target for sharpening the physical trace
bound; it is not itself an upper bound smaller than `g`.

## 6. Shorting the positive part

Decompose `X=K` direct-sum `H` and write block matrices relative to this
orthogonal split.  Positivity of `C` implies

\[
 \operatorname {ran}C_{HK}\subseteq
 \operatorname {ran}C_{HH}.                               \tag{6.1}
\]

The finite Krein short of `C` to `K` is therefore

\[
 \boxed{
 C_{/K}=C_{KK}-C_{KH}C_{HH}^\dagger C_{HK}\succeq0.}     \tag{6.2}
\]

The generalized Schur-complement factorization gives

\[
 C\succeq
 \begin{bmatrix}C_{/K}&0\\0&0\end{bmatrix}.              \tag{6.3}
\]

Substituting (6.3) into (2.5) yields the exact lower comparison

\[
\boxed{
 B\succeq\mathcal M:=
 \begin{bmatrix}
  gI-R_{KK}+C_{/K}&-R_{KH}\\
  -R_{HK}&gI-R_{HH}
 \end{bmatrix}.}                                         \tag{6.4}
\]

All low--high coupling created by the positive operator `C` has been
absorbed into its short.  This is why capture of `R` can be useful here even
though it cannot control the raw cross block of `B`.

## 7. Automatic negative cross bound and gluing

Let `Delta>0` be the quotient metric on `K`.  Suppose source estimates give

\[
 \|R_{HH}\|\leq\rho<g,
 \qquad gI-R_{KK}+C_{/K}\succeq\mu\Delta,
 \qquad \mu>0.                                            \tag{7.1}
\]

Put

\[
 \eta=g-\rho,
 \qquad
 \beta=\|\Delta^{-1/2}R_{KK}\Delta^{-1/2}\|.             \tag{7.2}
\]

Positivity of the block matrix `R` implies

\[
 R_{KH}R_{HK}\preceq\|R_{HH}\|R_{KK}.                    \tag{7.3}
\]

Consequently

\[
\boxed{
 \|R_{HK}\Delta^{-1/2}\|^2\leq\rho\beta.}              \tag{7.4}
\]

Normalize (6.4) by the block metric `Delta` direct-sum `eta I`, and set

\[
 \chi^2={\rho\beta\over\eta}.                            \tag{7.5}
\]

If

\[
 \boxed{\rho\beta<\eta\mu,}                             \tag{7.6}
\]

then the two-block scalar estimate proves

\[
\boxed{
 B\succeq\mathcal M\succeq
 \nu(\Delta\mathbin{\oplus}\eta I),
 \qquad
 \nu={\mu+1-\sqrt{(\mu-1)^2+4\chi^2}\over2}>0.}         \tag{7.7}
\]

This is a sufficient scalar reserve.  A sharper finite target retains the
full high compression.  If `gI-R_HH` is positive definite, the exact
anisotropic condition is

\[
\boxed{
 gI-R_{KK}+C_{/K}
 -R_{KH}(gI-R_{HH})^{-1}R_{HK}\succ0.}                    \tag{7.8}
\]

Under (7.8), `mathcal M` and hence `B` are positive definite.  Neither
(7.6) nor (7.8) is presently proved uniformly for the prolate--Weil
operators.

For the source synthesis `A=WD^{-1/2}` and
`Delta=(AA^*)^dagger` on `K`, the singular-value decomposition gives the
exact quotient identity

\[
 \boxed{
 \beta=\|A^*RA\|.}                                       \tag{7.9}
\]

Thus the low factor in (7.6) can be reconstructed without forming a smallest
physical Gram eigenvalue.

## 8. Why raw capture was insufficient

The distinction between (6.4) and a raw-cross claim is necessary.  Take
`K=span(e1,e2)`, `H=span(e3)`,

\[
 R=3|e_1\rangle\langle e_1|,
 \qquad C=|v\rangle\langle v|,
 \qquad v=(2,0,3)^T,
 \qquad g=2.                                               \tag{8.1}
\]

Then the range of `R` is contained in `K`, so every high leakage statistic
of `R` is zero.  Nevertheless, for `B=gI+C-R`,

\[
 B_{KK}\succeq2I,
 \qquad B_{HH}=11,
 \qquad \|B_{HK}\|^2=36>22.                              \tag{8.2}
\]

Thus capture of the negative part alone cannot imply a strict inequality for
the raw cross of `B`.  In this model `C_/K=0`, so (7.1) correctly fails: its
low block in (7.1) is `diag(-1,2)`.  The shorted theorem does not make the false
inference.

## 9. A co-frame target that remains open

Let the plus ambient space have dimension `N+1`, let `p_4` be its anchor,
and let `(p_t)` be the buffered plus columns.  Let the odd ambient space have
dimension `N` and use its buffered columns with the same notation.  Define

\[
 D_+=\sum_{|I|=N}|\det[p_4,(p_t)_{t\in I}]|^2,
 \qquad
 D_-=\sum_{|I|=N}|\det[(p_t)_{t\in I}]|^2.                \tag{9.1}
\]

The determinants use orthonormal ambient coordinates, and `I` ranges over
raw buffered target columns, excluding the separately displayed anchor.
Cauchy--Binet gives, for the anchor-deflated plus synthesis `W_+` on
`p_4^perp` and the odd synthesis `W_-`,

\[
 \det_{p_4^\perp}(W_+W_+^*)={D_+\over\|p_4\|^2},
 \qquad
 \det(W_-W_-^*)=D_-.                                     \tag{9.2}
\]

Therefore, if `U_+>=||W_+W_+^*||` and
`U_->=||W_-W_-^*||`, then

\[
 \gamma_+={D_+\over\|p_4\|^2U_+^{N-1}},
 \qquad
 \gamma_-={D_-\over U_-^{N-1}}                           \tag{9.3}
\]

are valid co-frame floors whenever the respective determinants are
positive.  Equation (3.8) removes only the eventual anchor denominator
caveat.  No present theorem supplies a positive quantitative lower bound for
`D_+` or `D_-` through the growing transition family.

## 10. Replay boundary and next obligation

The producer artifacts at `p=5,7` and doubled precision contain exact
rational regression models for (4.4), (6.2)--(6.4), and (7.1)--(7.8).  The
independent replay reconstructs those matrices and values rather than
trusting producer booleans.  These are theorem-regression models, not finite
prolate--Weil sector certificates.  The `p,dps` labels record deterministic
schedule metadata and doubled replay settings; they do not turn exact
rational examples into physical pilots.

The next analytic work is now sharply separated:

1. prove a signed source low estimate for
   `gI-R_KK+C_/K` in the quotient metric, allowing an explicit
   `lambda`-dependent reserve if necessary;
2. prove the leverage deficit (4.7), including the odd pole leakage, on the
   same unbounded schedule; and
3. compare the resulting reserves in (7.6) or prove the anisotropic
   condition (7.8) directly.

Until those estimates and the later determinant-convergence obligation are
closed, this reduction supplies no theorem about the zero set of zeta.
