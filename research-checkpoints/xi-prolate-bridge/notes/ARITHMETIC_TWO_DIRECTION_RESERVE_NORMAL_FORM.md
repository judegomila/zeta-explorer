# Arithmetic normal form for the anchor two-direction reserve

## 0. Claim boundary and outcome

This note reconstructs the `2 by 2` reserve in
`notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md` directly from locked
source quantities.  It has five exact conclusions.

1. A nonorthogonal chart of the projected-anchor complement makes the
   derivative map diagonal.  Its Gram matrix and determinant are explicit in
   the anchor coefficients, including the zero coefficient `kappa_0`.
2. In that chart, the core `mathcal P_0` and the two columns of `W` are
   explicit finite matrices assembled from the complete residual, the source
   boundary vector, and the weighted-PNT discrepancy.  The pole,
   archimedean, and minus-prime cancellation is taken before any norm.
3. Conditional on `mathcal P_0>0`, positivity of the whole `2 by 2` reserve
   is equivalent to one scalar load-radius inequality.  This also gives an
   explicit finite odd-sector floor and an inverse-free sufficient bound.
4. A new exact `N=2` Cauchy model shows that positivity of the reserve
   determinant is not enough: the reserve can be negative definite while the
   even complement and the completed core are both positive.  Thus neither a
   determinant-only test nor an allegedly automatic principal minor is a
   valid generic shortcut.
5. The Green gate is exactly the transverse Schur short.  Its successful
   margin is necessarily `O(1/lambda)` on a source-selectable neutral
   diagonal, so no fixed Green reserve is available.

The scalar criterion is an exact reduction, not an estimate proving it on
the locked arithmetic schedule.  Existing source results do not lower-bound
the completed-core floor against the two explicit loads.  In particular,
the proved scalar energy estimate for the projected prolate state does not
control its residual column.  The formal project state remains
`P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The corrected source conventions are those of `P0_SOURCE_LOCK.json`,
`P0_MATRIX_FORMULAS.md`, and
`notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md`.  In particular, the prime
block retains the minus sign in source equation (3.19), and the prime-power
inventory is inclusive through `n<=lambda^2`.

## 1. Locked discrepancy form and projected anchor

Put

\[
 a=\log\lambda,\qquad L=2a,\qquad I=[-a,a],          \tag{1.1}
\]

use Lebesgue measure on `I`, and extend functions by zero.  The centered
source modes and inversion are

\[
 V_n(x)=(-1)^nL^{-1/2}e^{2\pi inx/L},
 \qquad JV_n=V_{-n}.                                  \tag{1.2}
\]

The current locked diagonal is `lambda=p/2`, with odd `p>=5`, and
`N=2^(2400*p^2)`.  The finite identities below hold for every source pair,
so no feasibility claim about explicitly storing that outer matrix is being
made.

Let

\[
 (K_hf)(x)=\widetilde f(x+h)+\widetilde f(x-h),
 \qquad h\geq0,                                      \tag{1.3}
\]

and retain the weighted discrepancy

\[
 D_\lambda(h)=
 \sum_{1<n\leq e^h}{\Lambda(n)\over\sqrt n}
 -2(e^{h/2}-1),\qquad 0\leq h\leq L.                \tag{1.4}
\]

Thus

\[
 dD_\lambda(h)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
       \delta_{\log n}(dh)-e^{h/2}\,dh.             \tag{1.5}
\]

Define

\[
 \omega_{\rm tail}(h)={e^{-5h/2}\over1-e^{-2h}},
 \qquad
 c_*=\psi(1/4)-\log\pi+4.                           \tag{1.6}
\]

The cancellation-preserving form

\[
\begin{aligned}
 \mathfrak h_\lambda(f,g)
 :={}&\int_0^\infty
 \{2\langle f,g\rangle-\langle f,K_hg\rangle\}
             \omega_{\rm tail}(h)\,dh\\
 &-\int_{[0,L]}\langle f,K_hg\rangle\,dD_\lambda(h)
                                                               \tag{1.7}
\end{aligned}
\]

is finite on every locked Fourier compression.  The integrand on the first
line is kept combined at `h=0`; splitting its two terms would create
divergent pieces.  The exact weighted-PNT normal form is

\[
 \boxed{\langle f,Q_\lambda g\rangle
 =c_*\langle f,g\rangle+\mathfrak h_\lambda(f,g).}   \tag{1.8}
\]

This includes the pole--continuous-main--first-archimedean cancellation.
It is not a magnitude estimate on `D_lambda`.

Let

\[
 f_\lambda(y)=k_\lambda^+(e^y),\qquad
 p_{\lambda,N}=P_Nf_\lambda,\qquad
 a_{\lambda,N}=\|p_{\lambda,N}\|,\qquad
 \kappa={p_{\lambda,N}\over a_{\lambda,N}}.         \tag{1.9}
\]

In the normalized even basis

\[
 e_0^+=V_0,\qquad e_n^+={V_n+V_{-n}\over\sqrt2},    \tag{1.10}
\]

write

\[
 \kappa=\kappa_0e_0^++\sum_{n=1}^N\kappa_ne_n^+,
 \qquad r=(\kappa_1,\ldots,\kappa_N)^T.             \tag{1.11}
\]

All these coefficients are real, and source projection gives them without
eigenvector data:

\[
 \boxed{
 \kappa_0={1\over a_{\lambda,N}\sqrt L}
             \int_I f_\lambda(y)\,dy
 ={X(\kappa)\over\sqrt L},}                         \tag{1.12}
\]

\[
 \boxed{
 \kappa_n={(-1)^n\sqrt{2/L}\over a_{\lambda,N}}
 \int_I f_\lambda(y)
       \cos\!\left({2\pi ny\over L}\right)dy,
 \qquad 1\leq n\leq N.}                            \tag{1.13}
\]

In particular,

\[
 \kappa_0^2+r^*r=1.                                  \tag{1.14}
\]

The projected-anchor origin theorem supplies `kappa_0!=0` eventually on the
locked schedule; it supplies no reserve sign.

## 2. Exact anchor-complement chart

Assume `kappa_0!=0`.  For `1<=n<=N`, put

\[
 \varphi_n=e_n^+-{\kappa_n\over\kappa_0}e_0^+,
 \qquad
 Fz=\sum_{n=1}^Nz_n\varphi_n.                       \tag{2.1}
\]

Then `F:C^N -> mathcal K=kappa^perp` is an isomorphism.  Its Gram matrix is

\[
 \boxed{
 C_\kappa=F^*F=I+{rr^*\over\kappa_0^2},\qquad
 C_\kappa^{-1}=I-rr^*,\qquad
 \det C_\kappa={1\over|\kappa_0|^2}.}              \tag{2.2}
\]

The inverse follows from (1.14), not from an asymptotic approximation.

Let

\[
 \mathsf N=\operatorname {diag}(1,2,\ldots,N),
 \qquad
 \mathcal D e_n^+=ne_n^- .                          \tag{2.3}
\]

For the anchor-complement derivative `T=mathcal D|_mathcal K`, one has

\[
 \boxed{TF=\mathsf N.}                               \tag{2.4}
\]

Using the orthonormal chart `FC_kappa^(-1/2)` therefore gives

\[
 \boxed{|\det T|^2=(N!)^2|\kappa_0|^2.}             \tag{2.5}
\]

Equation (2.5) is the exact determinant contribution of the projected
anchor.  It is lost if the nonorthogonal chart is treated as orthonormal.

The source endpoint vector and odd commutator vector have parity
coordinates

\[
 \eta_+=(1,\sqrt2,\ldots,\sqrt2)^T,
 \qquad
 \beta_-=(\sqrt2b_1,\ldots,\sqrt2b_N)^T.            \tag{2.6}
\]

Their anchor-chart quantities are

\[
 \boxed{
 \widehat\eta=F^*\eta
 =\sqrt2\,\boldsymbol1-{r\over\kappa_0},
 \qquad
 \widehat u=F^*T^*\beta_-=\mathsf N\beta_-.}       \tag{2.7}
\]

Since `d=mathcal D kappa=mathsf N r` in the odd basis,

\[
 \boxed{\widehat v=F^*T^*d=\mathsf N^2r.}           \tag{2.8}
\]

## 3. Complete arithmetic assembly of `A`, `c`, and `b_n`

Let `U=U_Z` be the admitted real Ritz upper shift and put

\[
 \mathcal B_+=Q_+-UI,
 \qquad
 \mathcal B_-=Q_--UI,
 \qquad
 A=P_{\mathcal K}\mathcal B_+|_{\mathcal K}.       \tag{3.1}
\]

Define the anchor-chart even complement and residual by

\[
 \widehat A=F^*\mathcal B_+F,
 \qquad
 \widehat c=F^*Q_+\kappa.                           \tag{3.2}
\]

Because `F^*kappa=0`, the scalar cancellation in (1.8) gives the exact
entries

\[
 \boxed{
 \widehat A_{ij}=(c_*-U)(C_\kappa)_{ij}
                  +\mathfrak h_\lambda(\varphi_i,\varphi_j),}
                                                               \tag{3.3}
\]

\[
 \boxed{
 \widehat c_i=\mathfrak h_\lambda(\varphi_i,\kappa).} \tag{3.4}
\]

Thus `widehat c` is the complete projected residual column.  Formula (3.4)
does not replace it by the sum of separate pole, archimedean, and prime
norms.  The odd block is reconstructed by the same signed form:

\[
 \boxed{
 (\mathcal B_-)_{ij}
 =(c_*-U)\delta_{ij}
   +\mathfrak h_\lambda(e_i^-,e_j^-).}              \tag{3.5}
\]

The source Cauchy coefficients also have a direct discrepancy formula.  For
`n>=1`, the exact translation correlation is

\[
 \langle V_n,K_hV_0\rangle
 =-{1\over\pi n}\sin\!\left({2\pi nh\over L}\right). \tag{3.6}
\]

Since the scalar in (1.8) has no off-diagonal entry,

\[
 \boxed{
 b_n={1\over\pi}\int_{[0,L]}
 \sin\!\left({2\pi nh\over L}\right)
 \{\omega_{\rm tail}(h)\,dh+dD_\lambda(h)\}.}     \tag{3.7}
\]

The sine removes the apparent singularity of `omega_tail` at zero.  A
prime-power atom exactly at `h=L` is annihilated by the sine, just as it is
by `K_L`; its inclusion must still be checked in the prime inventory.
Although the atomic prime term appears with a plus sign in (3.7), the source
minus-prime sign has not changed: (1.7) contains `-T_D`, while the
off-diagonal correlation (3.6) is negative.

Equations (3.3)--(3.7) are one independently reconstructible arithmetic
path for every ingredient of the reserve.  They use the actual signed
discrepancy, not an absolute PNT envelope.

## 4. Explicit matrices for `mathcal P_0` and `W`

The operator represented by the form matrix `widehat A` has chart matrix
`C_kappa^(-1)widehat A`.  Consequently

\[
 F^*GA F=\mathsf N^2C_\kappa^{-1}\widehat A,
 \qquad
 F^*AG F=\widehat A C_\kappa^{-1}\mathsf N^2.       \tag{4.1}
\]

Define

\[
\begin{aligned}
 \widehat{\mathcal P}_0
 :={}&{\mathsf N^2C_\kappa^{-1}\widehat A
       +\widehat A C_\kappa^{-1}\mathsf N^2\over2}\\
 &+{1\over4}|\mathsf N\beta_- -\widehat\eta\rangle
               \langle\mathsf N\beta_- -\widehat\eta|\\
 &+{1\over4}|\mathsf N^2r+\widehat c\rangle
               \langle\mathsf N^2r+\widehat c|,     \tag{4.2}
\end{aligned}
\]

and the two columns

\[
 \boxed{
 z_1={\mathsf N\beta_-+\widehat\eta\over2},
 \qquad
 z_2={\mathsf N^2r-\widehat c\over2},
 \qquad Z=[z_1\ z_2].}                              \tag{4.3}
\]

Then

\[
 \boxed{
 \widehat{\mathcal P}_0=F^*\mathcal P_0F,
 \qquad
 Z=F^*W.}                                           \tag{4.4}
\]

The signs in (4.2)--(4.3) are forced: the positive completions use
`N beta_- - widehat eta` and `N^2r+widehat c`, while the two subtracted
columns use the opposite combinations.  In particular, changing the sign of
the complete residual destroys the anchor displacement identity.

There is an independent checksum using the odd block:

\[
 \boxed{
 \widehat{\mathcal P}_0
 =\mathsf N\mathcal B_-\mathsf N+ZZ^*.}             \tag{4.5}
\]

Equation (4.5) is not proposed as a way to prove the odd sign; it verifies
the two separately assembled source paths entrywise.

If `widehat P_0>0`, coordinate inversion gives

\[
 \boxed{
 W^*\mathcal P_0^{-1}W
 =Z^*\widehat{\mathcal P}_0^{-1}Z.}                 \tag{4.6}
\]

No factor of `C_kappa` is missing from (4.6): the factors from the
nonorthogonal vector coordinates cancel those from the inverse form matrix.

## 5. Principal minors, determinant, and one scalar criterion

Assume `widehat P_0>0` and put

\[
 x=z_1^*\widehat{\mathcal P}_0^{-1}z_1,
 \quad
 y=z_2^*\widehat{\mathcal P}_0^{-1}z_2,
 \quad
 \zeta=z_1^*\widehat{\mathcal P}_0^{-1}z_2.         \tag{5.1}
\]

On the locked real source path, `x`, `y`, and `zeta` are real.  The
conjugates below keep the identity valid under a harmless complex change of
basis.

The exact reserve is

\[
 \boxed{
 \mathscr R_2
 =I_2-Z^*\widehat{\mathcal P}_0^{-1}Z
 =\begin{bmatrix}
     1-x&-\zeta\\
     -\overline\zeta&1-y
   \end{bmatrix}.}                                  \tag{5.2}
\]

Thus its ordered Sylvester minors are

\[
 1-x,
 \qquad
 \det\mathscr R_2=(1-x)(1-y)-|\zeta|^2.            \tag{5.3}
\]

With

\[
 \widehat H_0=\mathsf N\mathcal B_-\mathsf N
 =\widehat{\mathcal P}_0-z_1z_1^*-z_2z_2^*,
\]

the two diagonal minors also have exact determinant forms

\[
 \boxed{
 1-x={\det(\widehat H_0+z_2z_2^*)
             \over\det\widehat{\mathcal P}_0},
 \qquad
 1-y={\det(\widehat H_0+z_1z_1^*)
             \over\det\widehat{\mathcal P}_0}.}     \tag{5.3a}
\]

Because the load in (5.2) is positive semidefinite, define its scalar radius

\[
 \boxed{
 \rho_2={x+y+\sqrt{(x-y)^2+4|\zeta|^2}\over2}.}     \tag{5.4}
\]

Then the entire matrix inequality is exactly one scalar inequality:

\[
 \boxed{
 \mathscr R_2\succ0
 \quad\Longleftrightarrow\quad
 \rho_2<1,
 \qquad
 \lambda_{\min}(\mathscr R_2)=1-\rho_2.}           \tag{5.5}
\]

This is strictly smaller than checking two unspecified directions, but it
does not estimate the three Green scalars in (5.1).

The determinant has two exact source checks.  From (4.5) and the matrix
determinant lemma,

\[
 \boxed{
 \det\mathscr R_2
 ={(N!)^2\det\mathcal B_-\over
             \det\widehat{\mathcal P}_0}.}          \tag{5.6}
\]

Also, if `mathfrak D_U` is the relative characteristic scalar in
`notes/WEYL_COLLAPSE_SHIFTED_COEFFICIENT_RESERVE.md`, then

\[
 \det A=|\kappa_0|^2\det\widehat A,
 \qquad
 \mathfrak D_U=-{\det A\over\det\mathcal B_-},      \tag{5.7}
\]

and hence

\[
 \boxed{
 \det\mathscr R_2
 =-{(N!)^2|\kappa_0|^2\det\widehat A
       \over
       \mathfrak D_U\det\widehat{\mathcal P}_0}.} \tag{5.8}
\]

Formula (5.8) exposes the anchor coefficient and the existing relative
determinant cancellation.  Section 7 below shows why its sign alone cannot
replace (5.5).

## 6. Explicit finite lower bounds and the arithmetic frontier

Let the completed-core floor in the physical Hilbert norm be

\[
 p_0=\lambda_{\min}
 \left(C_\kappa^{-1/2}
       \widehat{\mathcal P}_0
       C_\kappa^{-1/2}\right).                     \tag{6.1}
\]

If `p_0>0` and `rho_2<1`, the exact pullback argument gives

\[
 \boxed{
 \mathcal B_-
 \succeq{(1-\rho_2)p_0\over N^2}I.}                \tag{6.2}
\]

There is also an inverse-free sufficient test.  Put

\[
 S_2=Z^*C_\kappa^{-1}Z=Z^*(I-rr^*)Z,
 \qquad s_2=\lambda_{\max}(S_2).                   \tag{6.3}
\]

Its entries and largest eigenvalue are explicit:

\[
 (S_2)_{ij}=z_i^*z_j-(z_i^*r)(r^*z_j),             \tag{6.4}
\]

\[
 s_2={{\rm tr}S_2+
 \sqrt{((S_2)_{11}-(S_2)_{22})^2+4|(S_2)_{12}|^2}
 \over2}.                                           \tag{6.5}
\]

Since `widehat P_0>=p_0 C_kappa`, inverse monotonicity gives

\[
 Z^*\widehat{\mathcal P}_0^{-1}Z
 \preceq p_0^{-1}S_2.                               \tag{6.6}
\]

Therefore

\[
 \boxed{
 p_0>s_2
 \quad\Longrightarrow\quad
 \rho_2\leq{s_2\over p_0}<1,
 \qquad
 \mathcal B_-\succeq{p_0-s_2\over N^2}I.}         \tag{6.7}
\]

Every quantity in (6.7) is reconstructed from (1.4), (1.7), and the anchor
coefficients (1.12)--(1.13).  Thus (6.7) is a valid finite arithmetic lower
bound, not a generic norm slogan.

It is not currently positive on a proved unbounded schedule.  The existing
locked results give `kappa_0!=0` eventually and `U_Z=o(d_6)`, but neither
result lower-bounds `p_0-s_2`.  More specifically:

- the source energy estimate controls one scalar expectation, not the
  residual vector `widehat c` in (3.4);
- an absolute PNT envelope does not orient the signed Stieltjes correlations
  in (3.3)--(3.7); and
- positivity of `widehat A` does not orient the Jordan product in (4.2).

The exact remaining arithmetic alternative is therefore either the sharp
one-scalar inequality `rho_2<1`, together with `p_0>0`, or the stronger but
inverse-free gap `p_0>s_2`.  No present theorem supplies either inequality.

## 7. Exact Cauchy obstruction to a determinant-only shortcut

The determinant in (5.6) cannot be the sole reserve test, even after the
even complement and completed core have both been proved positive.

Take `N=2`, `U=0`, `kappa=e_0^+`, and set

\[
 a_0=0,\qquad a_{\pm1}=a_{\pm2}={1\over4},
 \qquad b_0=0,\qquad
 b_1={1\over2},\quad b_2={3\over4},\quad b_{-n}=-b_n. \tag{7.1}
\]

Define the real inversion-symmetric Cauchy matrix by

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m).            \tag{7.2}
\]

Its parity blocks are

\[
 Q_+=
 \begin{bmatrix}
 0&\sqrt2/2&3\sqrt2/8\\
 \sqrt2/2&3/4&2/3\\
 3\sqrt2/8&2/3&5/8
 \end{bmatrix},
 \qquad
 Q_-=
 \begin{bmatrix}
 -1/4&-1/6\\
 -1/6&-1/8
 \end{bmatrix}.                                     \tag{7.3}
\]

On the anchor complement,

\[
 A=
 \begin{bmatrix}3/4&2/3\\2/3&5/8\end{bmatrix}
 \succ0,
 \qquad \det A={7\over288}.                         \tag{7.4}
\]

The odd block is negative definite, with

\[
 \det Q_-={1\over288}.                              \tag{7.5}
\]

Here `T=diag(1,2)`, `d=v=0`, and the two completed columns are

\[
 z_1=\begin{bmatrix}3\sqrt2/4\\5\sqrt2/4\end{bmatrix},
 \qquad
 z_2=\begin{bmatrix}-\sqrt2/4\\-3\sqrt2/16\end{bmatrix}. \tag{7.6}
\]

Direct exact substitution gives

\[
 T^*Q_-T=
 \begin{bmatrix}-1/4&-1/3\\-1/3&-1/2\end{bmatrix}, \tag{7.7}
\]

\[
 \widehat{\mathcal P}_0=
 \begin{bmatrix}
 1&157/96\\157/96&345/128
 \end{bmatrix}\succ0,
 \qquad
 \det\widehat{\mathcal P}_0={191\over9216}.        \tag{7.8}
\]

Nevertheless the load and reserve are

\[
 Z^*\widehat{\mathcal P}_0^{-1}Z
 ={1\over191}
 \begin{bmatrix}225&24\\24&927\end{bmatrix},       \tag{7.9}
\]

\[
 \boxed{
 \mathscr R_2
 ={1\over191}
 \begin{bmatrix}-34&-24\\-24&-736\end{bmatrix}
 \prec0.}                                           \tag{7.10}
\]

In particular,

\[
 \boxed{
 \det\mathscr R_2={128\over191}>0,
 \qquad
 {\rm tr}\mathscr R_2=-{770\over191}<0.}           \tag{7.11}
\]

This model has exact source Cauchy displacement, `q=U=0`, `kappa_0=1`,
`A>0`, and `mathcal P_0>0`.  It proves that a positive determinant in (5.6)
can correspond to two negative reserve eigenvalues.  Both diagonal reserve
entries are negative as well, so no principal minor is made automatic by
these generic hypotheses.

The model is not the arithmetic Weil matrix and does not use the projected
source-normalized prolate anchor.  Its role is precise: any successful proof
of (5.5) on the actual schedule must use the signed discrepancy and anchor
quantities exposed in Sections 1--4, rather than only Cauchy displacement,
even-complement positivity, completed-core positivity, or determinant sign.

## 8. Collapse to the pole-deleted Green gate

The two-direction reserve has an exact scalar interpretation that removes
the anchor chart.  Let `p=P_(E_N^-)p_-` be the finite odd pole vector and put

\[
 M=\mathcal B_-+2|p\rangle\langle p|
   =gI+T_a-T_v,
 \qquad K=T^*MT,
 \qquad w=T^*p.                                    \tag{8.1}
\]

The pulled odd block in Sections 3--5 is

\[
 H_0:=\mathcal P_0-WW^*=T^*\mathcal B_-T.         \tag{8.2}
\]

Consequently,

\[
 \boxed{K=H_0+2|w\rangle\langle w|.}              \tag{8.3}
\]

The Schur complement in (5.2), followed by the rank-one pole Schur
complement, now gives the exact chain

\[
 \boxed{
 \{\mathcal P_0\succ0,\ \rho_2<1\}
 \Longleftrightarrow H_0\succ0
 \Longleftrightarrow
 \left\{M\succ0,\
 \delta_p:=1-2\langle p,M^{-1}p\rangle>0\right\}.} \tag{8.4}
\]

Thus the completed-core and two-direction conditions together are not a new
anchor-specific sign theorem.  They are exactly the pole-deleted odd
Green-function gate in derivative coordinates.

There are three useful quantitative checks.  Congruence and the rank-one
minimum eigenvalue give

\[
 \boxed{
 \mathcal B_-\succeq\delta_pM,
 \qquad H_0\succeq\delta_pK}                       \tag{8.5}
\]

whenever `delta_p>0`.  The two determinant lemmas give

\[
 \boxed{
 \det\mathscr R_2
 ={\det H_0\over\det\mathcal P_0}
 ={\det K\over\det\mathcal P_0}\,\delta_p.}      \tag{8.6}
\]

Most importantly, the pulled pole forcing satisfies

\[
 \boxed{
 \langle w,K^{-1}w\rangle
 =\langle p,M^{-1}p\rangle.}                       \tag{8.7}
\]

The `sqrt(N)` endpoint size found in Section 12 of
`notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md` therefore cancels
exactly through the derivative-pullback inverse.  Its norm alone cannot
orient the reserve.

Cauchy--Schwarz supplies two necessary signed tests,

\[
 \boxed{
 \langle p,Mp\rangle>2\|p\|^4,
 \qquad
 \langle w,Kw\rangle>2\|w\|^4,}                   \tag{8.8}
\]

but neither is sufficient.  They retain the complete pole-deleted
multiplier and cannot be proved by separately bounding its archimedean and
prime blocks.

### 8.1 Exact one-mode counterfamily

An exact source-displacement model shows why the `v`-boundary data from
Sections 11--13 of the parity-pullback note do not settle (8.4).  Take
`N=1`, `U=0`, `kappa=e_0^+`, put

\[
 s=\sinh(L/4),\qquad \omega={2\pi\over L},
\]

and write the exact finite pole coefficients as

\[
 A_0={4s\over\sqrt L},\qquad
 A_1={\sqrt2s\over\sqrt L(\omega^2+1/4)},\qquad
 B={2\sqrt2\,\omega s\over\sqrt L(\omega^2+1/4)}. \tag{8.9}
\]

Thus `p_+=A_0e_0^++A_1e_1^+` and `p_-=iB e_1^-`.  Direct algebra gives

\[
 A_1^2+B^2=\sqrt2A_0A_1,                           \tag{8.10}
\]

which is exactly the rank-one parity displacement for the two opposite pole
signs.  Let the nonpole multiplier be the constant `c>g`, so `v=0` and
`T_a=(c-g)I`, and define

\[
 S=\left({2A_0A_1+\sqrt2\over2}\right)^2
      +(A_0A_1)^2>0.                               \tag{8.11}
\]

Choose `L` with `2B^2>g` and

\[
 0<\epsilon<\min\{S,2B^2-g\},
 \qquad c_\pm=2B^2\pm\epsilon.                    \tag{8.12}
\]

For both signs the even anchor complement is the positive scalar
`c_+ +2A_1^2` or `c_-+2A_1^2`, respectively, while

\[
 H_0=\pm\epsilon,
 \qquad \mathcal P_0=S\pm\epsilon>0,
 \qquad \rho_2={S\over S\pm\epsilon}.             \tag{8.13}
\]

Hence the plus model has `rho_2<1` and the minus model has `rho_2>1`, even
though both have identical `v=0` boundary vectors, projectors, oriented
loads, pole forcing, and maximal trace-selected gap.  Only the discarded
positive multiplier changes.

The same obstruction persists with nonzero boundary data.  Fix a sufficiently
small symmetric measurable set `S_0`, a number `0<v_0<g`, and define a
family of even multipliers by

\[
 m_C(t)-U=
 \begin{cases}
  g-v_0,&t\in S_0,\\
  g+C,&t\notin S_0.
 \end{cases}                                       \tag{8.14}
\]

Then `v=v_0 1_(S_0)` and all concentration projectors, boundary-leverage
quotients, `nu_i`, and pole-forcing data are independent of `C`.  If

\[
 \chi=\langle e_1^-,T_{1_(S_0)}e_1^-\rangle\in(0,1),
\]

the odd scalar is

\[
 g-v_0\chi+C(1-\chi)-2B^2.                        \tag{8.15}
\]

It crosses zero as `C` varies.  Taking parameters sufficiently close to the
crossing leaves the even complement and `mathcal P_0` positive on both
sides, while `rho_2` crosses one.  This is a structural multiplier family,
not the pinned arithmetic symbol.  It proves that a source-specific oriented
estimate for the complete pole-deleted operator `M`, especially its inverse
pole Green scalar in (8.4), is indispensable.

### 8.2 Transverse Schur short and unavoidable critical scaling

The Green scalar in (8.4) is exactly the transverse harmonic short already
isolated in `notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md`; it is not an
independent reserve mechanism.  To see this without coordinates, write

\[
 B_U=Q_--UI,
 \qquad M_U=B_U+2|p\rangle\langle p|,
 \qquad \mu=\|p\|^2,
 \qquad e={p\over\sqrt\mu},                        \tag{8.16}
\]

and let `G=e^perp`.  Define

\[
 D_U=P_GB_U|_G,
 \qquad c=P_GB_Ue=P_GQ_-e,
 \qquad \alpha_U=\langle e,B_Ue\rangle.           \tag{8.17}
\]

The cross vector `c` is independent of `U`.  Whenever `D_U>0`, put

\[
 \chi_U=\langle c,D_U^{-1}c\rangle,
 \qquad s_U=\alpha_U-\chi_U.                       \tag{8.18}
\]

The two scalar Schur complements give the exact equivalences and load
identity

\[
 \boxed{
 B_U\succ0
 \Longleftrightarrow\{D_U\succ0,\ s_U>0\},
 \qquad
 2\langle p,M_U^{-1}p\rangle={2\mu\over2\mu+s_U},
 \qquad
 \delta_p={s_U\over2\mu+s_U}.}                    \tag{8.19}
\]

In signed source-form coordinates, the missing short is equivalently

\[
 \boxed{
 \chi_U=\sup_{0\ne f\in G}
 { |\langle f,B_Ue\rangle|^2\over
       \langle f,B_Uf\rangle}
 <\langle e,B_Ue\rangle.}                         \tag{8.20}
\]

Thus the unresolved assertion is a transverse source correlation bound,
not merely a lower estimate on the pole-axis diagonal.

The dependence on the live subtraction is rigid.  On every interval on
which `D_U>0`, functional calculus gives

\[
 \boxed{
 {d s_U\over dU}
 =-1-\|D_U^{-1}c\|^2<0.}                           \tag{8.21}
\]

If `D_0>=kappa I` and `0<=U<kappa`, integration, or the resolvent identity,
gives the explicit lower transport

\[
 s_U\geq s_0-U\left\{1+{\|c\|^2\over
                    \kappa(\kappa-U)}\right\}.     \tag{8.22}
\]

The current source inputs prove neither a positive `s_0` nor a transverse
floor `kappa`, so (8.22) is a conditional stability formula, not a sign
proof.

There is also a source-specific ceiling that rules out a fixed successful
Green margin.  Cauchy gives `0<s_U<=alpha_U` whenever (8.19) passes.  With

\[
 G_U=\langle p,B_Up\rangle=\mu\alpha_U,
\]

one obtains

\[
 \boxed{
 0<\delta_p\leq{G_U\over G_U+2\mu^2}.}             \tag{8.23}
\]

On the neutral locked subsequence of
`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`, the unprojected source values
satisfy

\[
 {G_0\over\lambda}\longrightarrow c_0,
 \qquad {\mu\over\lambda}\longrightarrow{1\over2},
 \qquad
 c_0=1+{\gamma_E\over2}-\log(2\sqrt\pi).          \tag{8.24}
\]

Choosing the Fourier cutoff diagonally by the proved form-convergence lemma
preserves both limits.  Therefore every passing projected diagonal obeys

\[
 \boxed{
 \limsup\lambda\delta_p\leq2c_0.}                 \tag{8.25}
\]

For a fixed nonnegative resolvent shift `sigma`, the same calculation has
the upper coefficient `2c_0+sigma`.  The qualitative diagonal selection in
(8.25) is source-only and replayable; an effective transfer to the
preselected exponential cutoff still requires a uniform form-tail check.
The conclusion is nevertheless exact: a successful route must resolve an
`O(1/lambda)` Green gap.  No fixed positive reserve can be inferred from
the favorable pole-axis value.

### 8.3 Exact source replay of the Green moments

The moments occurring in the transported screen (14.34)--(14.37) of the
parity-pullback note can be reconstructed without an eigensystem.  Write the
finite odd pole coefficients as

\[
 \varpi_n=\langle e_n^-,p\rangle
 ={2\sqrt2\,i\omega_n\sinh(L/4)
       \over\sqrt L(\omega_n^2+1/4)},
 \qquad \omega_n={2\pi n\over L},                 \tag{8.26}
\]

put `varpi=(varpi_1,...,varpi_N)^T`, and define

\[
 (\mathbf M_\sigma)_{ij}
 =(c_*-U+\sigma)\delta_{ij}
  +\mathfrak h_\lambda(e_i^-,e_j^-)
  +2\varpi_i\overline{\varpi_j},
 \qquad
 \mathbf m_\sigma=\mathbf M_\sigma^{-1}\varpi.   \tag{8.27}
\]

Then `mathbf m_sigma` is the odd-coordinate vector of
`m_sigma=M_sigma^(-1)p`.  With `beta_-` from (2.6) and
`d=mathsf N r`,

\[
 \boxed{
 \langle\boldsymbol b,m_\sigma\rangle
 =\beta_-^*\mathbf m_\sigma,
 \qquad
 \langle d,m_\sigma\rangle
 =(\mathsf N r)^*\mathbf m_\sigma.}               \tag{8.28}
\]

For the first moment set

\[
 S_m(h)=\sum_{n=1}^N(\mathbf m_\sigma)_n
              \sin(\omega_nh).
\]

Equation (3.7) gives the two exact cancellation-preserving forms

\[
 \boxed{
 \begin{aligned}
 \langle\boldsymbol b,m_\sigma\rangle
 ={\sqrt2\over\pi}\int_{[0,L]}S_m(h)
       \{\omega_{\rm tail}(h)\,dh+dD_\lambda(h)\}\\
 ={\sqrt2\over\pi}\left\{
  \int_0^L S_m(h)\omega_{\rm tail}(h)\,dh
  -\int_0^L D_\lambda(h)S_m'(h)\,dh\right\}.
 \end{aligned}}                                    \tag{8.29}
\]

The integration-by-parts boundary terms vanish because
`S_m(0)=S_m(L)=0`.  The atomic part is explicitly

\[
 {\sqrt2\over\pi}
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
        S_m(\log n).                               \tag{8.30}
\]

The plus sign in (8.30) is induced by the negative translation correlation
in (3.6); the source minus-prime operator sign has not been reversed.  Every
prime power through the inclusive endpoint remains in the inventory.

The second moment is the direct prolate integral

\[
 \boxed{
 \langle d,m_\sigma\rangle
 ={\sqrt{2/L}\over a_{\lambda,N}}
 \int_I f_\lambda(y)
  \sum_{n=1}^N(-1)^n n(\mathbf m_\sigma)_n
       \cos(\omega_ny)\,dy.}                      \tag{8.31}
\]

All finite matrices are real in the parity bases, while `varpi` and
`mathbf m_sigma` are purely imaginary.  Thus (8.28), (8.31), and the
projected vector `P_+T^*m_sigma` share a fixed imaginary phase.  This removes
an arbitrary complex phase, but it supplies no real sign.

The common uncontrolled direction is explicit.  For a positive
`B_(-,sigma)`, define

\[
 z_\sigma=e-D_\sigma^{-1}c_\perp,
 \quad
 D_\sigma=P_{e^\perp}B_{-,\sigma}|_{e^\perp},
 \quad
 c_\perp=P_{e^\perp}B_{-,\sigma}e.                \tag{8.32}
\]

Then

\[
 \boxed{
 B_{-,\sigma}z_\sigma=s_\sigma e,
 \qquad
 m_\sigma={\sqrt\mu\over2\mu+s_\sigma}z_\sigma
 ={1-\delta_\sigma\over2\sqrt\mu}z_\sigma.}     \tag{8.33}
\]

For the positive resolvent shift,

\[
 \boxed{
 \|z_\sigma\|^2
 =1+\|D_\sigma^{-1}c_\perp\|^2
 ={d s_\sigma\over d\sigma}.}                    \tag{8.34}
\]

On the neutral subsequence, the scalar prefactor in (8.33) is asymptotic to
`1/sqrt(2*lambda)`, but no current input controls the norm in (8.34).  The
absolute weighted-PNT estimate obtained from (8.29) retains exactly this
unknown direction and loses its sign.

An exact two-dimensional family proves that the scalar data cannot recover
the orientation.  For `epsilon in {+1,-1}`, let

\[
 B_\epsilon=
 \begin{bmatrix}\alpha&\epsilon t\\
                 \epsilon t&\rho\end{bmatrix},
 \qquad 0<t^2<\alpha\rho,                          \tag{8.35}
\]

and take `p=sqrt(mu)e_1`.  Both signs have identical spectrum, transverse
floor, pole-axis value, cross norm, Schur short, Green scalar, and load, but

\[
 m_\epsilon={\sqrt\mu\over
  2\mu+\alpha-t^2/\rho}
 \begin{bmatrix}1\\-\epsilon t/\rho\end{bmatrix}. \tag{8.36}
\]

Every fixed transverse probe changes sign.  Taking `A_epsilon=B_epsilon`,
`T=I`, `boldsymbol b=d=e_2`, and
`eta_mathcalK=c=e_1` also satisfies the rank-two displacement, since its
two right-hand terms cancel.  This is a structural family, not the
arithmetic matrix.  It proves that the exact displacement and every scalar
Green diagnostic still leave the signed moments (8.28) unoriented.

## 9. Exact conclusion

The actual arithmetic reserve has now been reduced either to the three real
Green scalars in (5.1) or, after (8.4), to positivity of the pole-deleted
operator `M` together with its single Green scalar `delta_p`, all
reconstructed by signed source paths.  In the first coordinates its exact
margin is

\[
 1-\rho_2.
\]

The stronger inverse-free margin `p_0-s_2` gives the certified finite floor
(6.7) whenever it is positive.  Neither margin is presently controlled on
the locked unbounded schedule.  Section 8.2 identifies the same missing
quantity as the transverse short `s_U` and proves that its induced Green
margin is at best critical, of order `1/lambda`, on the neutral diagonal.
This is the source-specific stopping point: the remaining theorem is a
signed weighted-PNT/anchor correlation estimate, not a determinant identity
and not a magnitude-only PNT estimate.
