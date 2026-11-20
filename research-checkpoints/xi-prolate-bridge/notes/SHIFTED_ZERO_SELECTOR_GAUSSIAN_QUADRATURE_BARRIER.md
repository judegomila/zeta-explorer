# Shifted zero-selector Gaussian quadrature and response barrier

## 0. Exact outcome and claim boundary

Assume the finite RH-conditional hypotheses of checkpoint 1.36: the actual
source-Cauchy matrix has a simple inversion-even ground value `mu`, its
ground is boundary normalized, and its shifted odd block is strictly
positive.  Put

\[
 x_n=n^2,\qquad
 \Pi_N(y)=\prod_{n=1}^N(y-x_n).                    \tag{0.1}
\]

The regular RH zero Stieltjes measure, its exact carrier shells, and the
scalar subtraction `mu` define one polynomial functional
`mathfrak L_mu` through degree `2N-1`.  The exact source samples provide the
simple-pole part of this functional, while the shifted odd diagonal and its
polarization provide the double-pole part.  Equivalently, the shifted odd
block is its moment Gram and the positive-index shifted even block is its
multiplication-by-`y` localizing Gram.  The result is the shell-aware identity

\[
 \boxed{
 \mathfrak L_\mu[f]
 =\sum_{j\in R}{\theta_j f(y_j)\over\Pi_N(y_j)^2}
  +\sum_{n\in H}{\vartheta_n f(x_n)
       \over4x_n\Pi_N'(x_n)^2},
 \qquad \deg f\leq2N-1,}                           \tag{0.2}
\]

where `y_j=r_j^2` are the regular quotient-selector squares and `H` is the
selector-shell set.  Thus the `N` distinct regular-plus-shell selector
squares are exactly the `N` Gaussian-quadrature nodes of
`mathfrak L_mu`.

Let

\[
 M_\mu=(\mathfrak L_\mu[y^{i+j}])_{0\leq i,j<N},
 \qquad
 H_\mu=(\mathfrak L_\mu[y^{i+j+1}])_{0\leq i,j<N}.
                                                               \tag{0.3}
\]

Then `M_mu>0`, and the selector squares are precisely the generalized
eigenvalues of the symmetric pencil `H_mu-y M_mu`.  In particular,

\[
 \boxed{
 {\det(H_\mu-yM_\mu)\over\det M_\mu}
   =\prod_{j=1}^N(y_j-y),\qquad
 p_\mu={\det H_\mu\over (N!)^2\det M_\mu}.}        \tag{0.4}
\]

The first formula turns the checkpoint-1.35 root-parity law into the sign
of a localizing determinant.  Capture of a root in a window is one
generalized-eigenvalue existence statement.  Uniqueness is an inertia
statement for the two endpoint pencils, and the normalization `p_mu` is a
global determinant ratio.  Neither follows from `M_mu>0`.

When `mu=0`, `mathfrak L_0` is represented by a positive transformed RH
zero measure, so ordinary Gaussian-node support localization applies.  For
the genuine positive shift,

\[
 \mathfrak L_\mu=\mathfrak L_0-\mu\sigma_N,
 \qquad
 \sigma_N=\sum_{n=1}^N
 {\delta_{x_n}\over4x_n\Pi_N'(x_n)^2}.             \tag{0.5}
\]

This is a signed finite-lattice, or multi-Uvarov, perturbation.  Strict
oddness says exactly that its degree-`N-1` moment Gram remains positive;
the absolute estimate `mu=o(L)` is not a relative conditioning or
localizing-matrix estimate.

There is also an exact structural obstruction.  Any prescribed finite set
of captured roots can be retained while two additional roots are placed at
`epsilon` and `C/epsilon`.  Choosing `C` fixes `p_mu` exactly, all retained
lattice root parities remain fixed, and a positive paired-Cauchy Gram gives a simple
even ground and a strict odd block.  Nevertheless, for every fixed `t>0`,

\[
 G_\epsilon(it)\asymp\epsilon^{-2}.                 \tag{0.6}
\]

The two extra atoms may be assigned positive weights whose matrix
contribution tends to zero.  Weighted source moments can therefore miss
roots which enter the ground divisor with unit multiplicity.  A second
construction has either one or three simple roots in the same captured
lattice gap, with the same complete lattice parity pattern and the same
`p_mu`.

The structural families are not the actual prime-power/archimedean matrix
and do not satisfy the actual RH zero functional.  They prove only that
capture, root parity, strictness, and even exact control of `p_mu` do not by
themselves yield a normalized response bound.  The actual route still needs
a quantitative zero-functional theorem controlling the localizing pencil,
the Gaussian weights, and the determinant ratio.  No actual local
uniqueness, zero multiplicity transfer, ground-response estimate,
determinant convergence, new zeta-zero statement, RH proof, converse from
RH, or de Bruijn--Newman `Lambda` bound is obtained.  The checkpoint-1.36
standard eight are unchanged and the project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

Only the following frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md` | `07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c` |
| `tests/test_rh_conditional_fixed_zero_selector_capture_theorem.py` | `9de65e4fd61a71736c4df484a6b3f7ce0dd54a659b681baab0e6dd2bd0c36730` |
| `notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` | `0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3` |
| `tests/test_odd_zero_gram_lower_frame_audit.py` | `b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467` |
| `notes/STRICT_ODD_SELECTOR_SHELL_LOCALIZATION_THEOREM.md` | `f84eb9ea08d7af397c201c645c7de5eb8957bc03ac6a5a7e55b653bc3d6321dc` |
| `tests/test_strict_odd_selector_shell_localization_theorem.py` | `5d0c8aa4a72177031f045bfd2318fdd66f40eb60ed8f541b3f6823e970d0ed81` |
| `notes/Q0_FREE_SELECTOR_SECANT_ROOT_PARITY_THEOREM.md` | `7d61da7b191fa7f6c00cf83ec139b2cfeac6981b46fa6d2059c5c842aaf9ba22` |
| `tests/test_q0_free_selector_secant_root_parity_theorem.py` | `04b9f67ca9db40a01ae2b89e759a59083d538dcc3c1dc4598105ed1830d8acf6` |
| `notes/NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md` | `a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2` |
| `tests/test_normalized_source_quotient_response_barrier.py` | `8bafeff220c3193e9dcd5b511db011e3df565fe1b773878f88f435be687f7026` |

Checkpoint 1.36 supplies the exact zero/source moments, carrier limits,
small ground shift, and fixed-zero capture.  The odd-Gram pair supplies the
complete polarized zero evaluation matrix.  The checkpoint-1.34 pair
supplies the cone-free regular-plus-shell selector decomposition and the
strict odd extension.  Checkpoint 1.35 supplies the secant and parity laws.
The normalized-response pair supplies the exact product formula and its
normalization warning.  No zero list, numerical artifact, or external
source is added.

## 2. The shell-aware shifted zero functional

Retain the checkpoint-1.36 notation

\[
 \Delta={2\pi\over L},\qquad
 r_\gamma={\gamma\over\Delta},\qquad
 y_\gamma=r_\gamma^2,\qquad
 \theta_\gamma=1-\cos(\gamma L).                  \tag{2.1}
\]

For noncarrier zeros define

\[
 c_\gamma={L\over2\pi^2}m_\gamma\theta_\gamma,
 \qquad
 \nu_Z=\sum_{r_\gamma\notin\mathbb Z}
             c_\gamma\delta_{y_\gamma}.          \tag{2.2}
\]

At a positive carrier put

\[
 \zeta_n=L\sum_{r_\gamma=n}m_\gamma.              \tag{2.3}
\]

Then

\[
 S_Z(x)=\int{d\nu_Z(y)\over x-y},\qquad
 D_{Z,n}=4x_n\{-S_Z'(x_n)\}+\zeta_n.              \tag{2.4}
\]

For the regular selector measure write

\[
 \nu_T=\sum_{j\in R}\theta_j\delta_{y_j},
 \qquad
 S_T(x)=\int{d\nu_T(y)\over x-y},                 \tag{2.5}
\]

and let `vartheta_n` be its shell weight at `x_n`, zero when no shell is
present.  The exact source row and shifted diagonal identities are

\[
 S_T(x_n)=S_Z(x_n),                                \tag{2.6}
\]

\[
 4x_n\{-S_T'(x_n)\}+\vartheta_n
 =4x_n\{-S_Z'(x_n)\}+\zeta_n-\mu.                \tag{2.7}
\]

Let `f` be a polynomial of degree at most `2N-1`.  Proper partial fractions
give

\[
 {f(y)\over\Pi_N(y)^2}
 =\sum_{n=1}^N\left\{{A_n(f)\over y-x_n}
              +{B_n(f)\over(y-x_n)^2}\right\},   \tag{2.8}
\]

with the exact double-pole coefficient

\[
 B_n(f)={f(x_n)\over\Pi_N'(x_n)^2}.               \tag{2.9}
\]

The degree bound in (2.8) is sharp for this argument: at degree `2N` a
polynomial part appears.  The simple-pole terms in (2.8) agree by (2.6).
The double-pole terms, including their carrier limits, agree by (2.7) after
subtracting

\[
 \mu\sum_{n=1}^N{f(x_n)\over4x_n\Pi_N'(x_n)^2}.
                                                               \tag{2.10}
\]

All zero sums here are absolutely convergent, including at the endpoint
degree.  Indeed,
`f(y_gamma)/Pi_N(y_gamma)^2=O(y_gamma^(-1))=O(gamma^(-2))`, and the frozen
zero measure has `sum_gamma m_gamma/gamma^2<infinity`.  Thus the partial
fractions may be integrated term by term.

Define

\[
\begin{aligned}
 \mathfrak L_\mu[f]
 :={}&\sum_{r_\gamma\notin\mathbb Z}
 {c_\gamma f(y_\gamma)\over\Pi_N(y_\gamma)^2}\\
 &+\sum_{n=1}^N{(\zeta_n-\mu)f(x_n)
        \over4x_n\Pi_N'(x_n)^2}.
\end{aligned}                                                   \tag{2.11}
\]

Equations (2.6)--(2.10) prove the exact quadrature identity

\[
 \boxed{
 \mathfrak L_\mu[f]
 =\sum_{j\in R}{\theta_j f(y_j)\over\Pi_N(y_j)^2}
  +\sum_{n=1}^N{\vartheta_n f(x_n)
       \over4x_n\Pi_N'(x_n)^2},
 \quad\deg f\leq2N-1.}                            \tag{2.12}
\]

This is where the extra moment enters.  The odd Gram alone tests products
of polynomials of degree at most `N-1` and therefore reaches degree
`2N-2`.  The simple-pole source identities (2.6), not odd positivity, supply
the final degree-`2N-1` moment.  Section 3 identifies the same extra data as
the exact positive-even localizing Gram.

## 3. Exact odd/even block congruences

For `1<=n<=N` put

\[
 e_n(y)={2n\Pi_N(y)\over x_n-y}.                   \tag{3.1}
\]

These are polynomials of degree `N-1`, and they form a basis because
evaluation at `x_k` isolates `e_k`.  For regular zero atoms,

\[
 {e_n(y)e_m(y)\over\Pi_N(y)^2}
 ={4nm\over(x_n-y)(x_m-y)}.                       \tag{3.2}
\]

At a carrier,

\[
 e_n(x_k)=0\quad(k\ne n),\qquad
 e_n(x_n)=-2n\Pi_N'(x_n).                         \tag{3.3}
\]

Consequently the carrier mass in (2.11) contributes exactly `zeta_n` to
the `n`th diagonal.  The regular zero Gram and (3.2) give the off-diagonal
entries as well, so

\[
 \mathfrak L_0[e_ne_m]=(Q_-^Z)_{nm}.              \tag{3.4}
\]

The lattice functional in (0.5) satisfies

\[
 \sigma_N[e_ne_m]=\delta_{nm}.                    \tag{3.5}
\]

It follows that

\[
 \boxed{
 \mathfrak L_\mu[e_ne_m]
 =(Q_-^Z-\mu I)_{nm}=(T_-)_{nm}.}                 \tag{3.6}
\]

Let `A_circ` be the positive-index `N by N` principal block of the normalized
even compression `Q_+^Z`, so the central even coordinate is deleted, and put

\[
 D=\operatorname {diag}(1,2,\ldots,N).             \tag{3.7}
\]

For a regular zero atom the even evaluation row replaces the odd numerator
`n` by `sqrt(y)`.  Therefore (3.2), after multiplication by `y`, gives

\[
 \mathfrak L_0[ye_ne_m]=(DA^\circ D)_{nm}.         \tag{3.8}
\]

The carrier limit has the same even and odd shell weight.  Indeed, (3.3)
gives `x_n*zeta_n` on both sides of (3.8).  The lattice functional satisfies

\[
 \sigma_N[ye_ne_m]=x_n\delta_{nm}=(D^2)_{nm}.      \tag{3.9}
\]

Consequently the exact shifted localizing congruence is

\[
 \boxed{
 \mathfrak L_\mu[ye_ne_m]
 =\{D(A^\circ-\mu I)D\}_{nm}.}                    \tag{3.10}
\]

The strict shifted odd sign is therefore exactly

\[
 \boxed{
 \mathfrak L_\mu[|g|^2]>0
 \quad\hbox{for every nonzero real }g,
 \quad\deg g\leq N-1.}                           \tag{3.11}
\]

This is truncated positivity.  It does not turn the signed measure in
(2.11) into a positive measure on all nonnegative functions.  Products
`e_ne_m` span all degrees through `2N-2`, while `y e_ne_m` span degrees one
through `2N-1`.  Thus (3.6) and (3.10) exhibit the full degree claimed in
(2.12).  The odd Gram alone stops at degree `2N-2`; either the Section 2
source samples or the even localizing congruence (3.10) supplies the last
moment.

## 4. Gaussian nodes, localizing inertia, and normalization

Checkpoint 1.34 gives exactly `N` distinct finite negative selector
parameters, hence `N` distinct positive regular-plus-shell squares
`y_1,...,y_N`.  Define their transformed weights by

\[
 \omega_j=
 \begin{cases}
  \theta_j/\Pi_N(y_j)^2,&y_j\notin\{x_1,\ldots,x_N\},\\
  \vartheta_n/(4x_n\Pi_N'(x_n)^2),&y_j=x_n.
 \end{cases}                                      \tag{4.1}
\]

Every `omega_j` is positive.  Equation (2.12) says precisely

\[
 \mathfrak L_\mu[f]=\sum_{j=1}^N\omega_jf(y_j),
 \qquad\deg f\leq2N-1.                            \tag{4.2}
\]

Thus this is the positive `N`-node Gaussian quadrature of the truncated
functional.  Let

\[
 V=(y_j^i)_{0\leq i<N,\,1\leq j\leq N},
 \quad W=\operatorname {diag}(\omega_1,\ldots,\omega_N),
 \quad Y=\operatorname {diag}(y_1,\ldots,y_N).     \tag{4.3}
\]

The moment matrices factor exactly as

\[
 M_\mu=VWV^T,\qquad H_\mu=VWYV^T.               \tag{4.4}
\]

The Vandermonde matrix is invertible, so `M_mu>0`, and

\[
 \boxed{
 {\det(H_\mu-yM_\mu)\over\det M_\mu}
 =\prod_{j=1}^N(y_j-y).}                          \tag{4.5}
\]

Equivalently, the selector squares are the simple eigenvalues of

\[
 J_\mu=M_\mu^{-1/2}H_\mu M_\mu^{-1/2}.           \tag{4.6}
\]

Let `p(y)=prod_j(y-y_j)` be the monic ground polynomial.  Equation (4.5)
and the checkpoint-1.35 ground formula give

\[
 \boxed{
 p_\mu=\xi_0={\prod_jy_j\over(N!)^2}
 ={\det H_\mu\over(N!)^2\det M_\mu}.}           \tag{4.7}
\]

They also give the exact determinant form of the twisted samples:

\[
 \boxed{
 w_n={\det(H_\mu-x_nM_\mu)\over
  \det M_\mu\,(N-n)!(N+n)!},\qquad0\leq n\leq N.}
                                                               \tag{4.8}
\]

Here `x_0=0`.  Away from endpoint eigenvalues,

\[
 n_-(H_\mu-tM_\mu)=\#\{j:y_j<t\}.                \tag{4.9}
\]

Hence the number of roots in `(a,b)` is the difference of the two negative
indices in (4.9).  Endpoint determinant signs determine only that difference
modulo two.  A capture theorem proves the difference is positive; it does
not prove that it is one.

At `mu=0`, (2.11) is a positive transformed zero measure.  Its Gaussian
nodes lie in the convex hull of its support.  At `mu>0`, the negative
lattice measure in (0.5) destroys that support argument even though
`M_mu>0`.  Exact local exclusion or uniqueness requires new localizing
information such as the inertia, or a quantitative sign margin, for

\[
 H_\mu-aM_\mu,\qquad bM_\mu-H_\mu.               \tag{4.10}
\]

Control of `M_mu` alone is insufficient.  Likewise, controlling `p_mu`
requires the global determinant ratio in (4.7), not only finitely many
captured nodes.

There is an exact conditioning form of this obstruction.  In the monomial
basis let `S_N` be the moment Gram of `sigma_N`, so

\[
 M_\mu=M_0-\mu S_N.                                \tag{4.11}
\]

If `K_0` is the degree-`N-1` reproducing kernel for `M_0` and
`a_n=1/(4x_n\Pi_N'(x_n)^2)`, the finite matrix

\[
 (C_\sigma)_{nm}=\sqrt{a_na_m}\,K_0(x_n,x_m)       \tag{4.12}
\]

has the same nonzero eigenvalues as
`M_0^(-1/2)S_NM_0^(-1/2)`.  Hence

\[
 \boxed{
 \delta_-:=\lambda_{\min}(I-\mu C_\sigma)
 =1-{\mu\over\lambda_{\min}(Q_-^Z)}>0.}          \tag{4.13}
\]

At a Gaussian node its quadrature weight is the Christoffel function
`lambda_mu(y_j)`.  The reserve (4.13) gives only

\[
 \omega_j=\lambda_\mu(y_j)
 \geq\delta_-\lambda_0(y_j).                      \tag{4.14}
\]

There is a parallel even localizing reserve.  If

\[
 S_N^{(1)}=(\sigma_N[y^{i+j+1}])_{0\leq i,j<N},
 \qquad H_\mu=H_0-\mu S_N^{(1)},                  \tag{4.15}
\]

then (3.10) gives

\[
 \boxed{
 \delta_+:=1-{\mu\over\lambda_{\min}(A^\circ)}>0.}
                                                               \tag{4.16}
\]

The strict inequality follows from the even ground hypothesis, rather than
from notation alone.  The shifted even block is positive semidefinite with
kernel `R Phi`, while (4.7) gives
`Phi_0=xi_0=p_mu=prod_j y_j/(N!)^2>0`.  A null vector of the principal block
`A_circ-mu I` would extend by a zero central coordinate to a null vector of
the full shifted even block and hence could not be proportional to `Phi`.
Therefore `A_circ-mu I>0` and `lambda_min(A_circ)>mu`.

This is the relative positivity margin for the multiplication-by-`y`
localizing Gram.  The two scalar reserves `delta_-` and `delta_+` still do
not control the inertia of `H_mu-aM_mu` at a moving positive `a`; that
requires a genuinely localized comparison.

An absolute lower envelope for `lambda_0(y_j)` is still required.  Tiny
positive Gaussian weights can occur even when `mu=0` and `delta_-=1`.
Thus neither absolute smallness of `mu` nor a relative odd reserve alone
converts weighted zero moments into unweighted divisor control.

## 5. Strict prescribed-capture counterfamilies

Fix `N>=3`.  Let `R_0` be any set of `N-2` distinct positive noninteger
radii.  It may contain one chosen radius in each member of any prescribed
collection of at most `N-2` disjoint capture windows.  Put

\[
 P_0=\prod_{s\in R_0}s,\qquad
 C_N={N!\sqrt{p_*}\over P_0},                     \tag{5.1}
\]

where `p_*>0` is fixed.  For

\[
 0<\epsilon<\min(1,C_N/N)                         \tag{5.2}
\]

away from the finitely many collision values, set

\[
 R_\epsilon=R_0\cup\{\epsilon,C_N/\epsilon\}.    \tag{5.3}
\]

The small root remains in `(0,1)`, the compensating root remains above
`N`, all prescribed captured roots remain fixed, and every retained lattice
root count modulo two is independent of `epsilon`.  Moreover

\[
 \boxed{
 {\prod_{r\in R_\epsilon}r^2\over(N!)^2}=p_* .}   \tag{5.4}
\]

For `r` outside the retained lattice define

\[
 v(r)_n={1\over n-r},\qquad -N\leq n\leq N.       \tag{5.5}
\]

Choose arbitrary positive weights `omega_r` and put

\[
 Q_\epsilon=\sum_{r\in R_\epsilon}\omega_r
 \{v(r)v(r)^T+v(-r)v(-r)^T\}.                    \tag{5.6}
\]

Each paired atom has entries

\[
 {2\omega_r(nm+r^2)\over(n^2-r^2)(m^2-r^2)}     \tag{5.7}
\]

and source row

\[
 b_n^{(r)}={-2n\omega_r\over n^2-r^2}.            \tag{5.8}
\]

Thus (5.6) is an exact real inversion-symmetric source-Cauchy matrix.  The
`2N` Cauchy columns at the distinct nodes `+/-r` are independent.  Their
common kernel is the boundary-normalized even vector obtained from

\[
 P_\epsilon(s)=-\prod_{r\in R_\epsilon}(s^2-r^2),
 \qquad
 \xi_n=-{P_\epsilon(n)\over
  \left.\dfrac{d}{ds}\prod_{k=-N}^N(s-k)\right|_{s=n}}.
                                                               \tag{5.9}
\]

Consequently `Q_epsilon` is positive semidefinite, has a simple even ground
value zero, and is strictly positive on the odd block and on the even
ground complement.  Multiplication by its reciprocal positive spectral
gap gives a uniform gap floor one without changing the ground, roots,
parities, `p_*`, or response.  This is a ground-shift spectral statement.
It neither computes the genuine two-vector lower Ritz value `u` nor claims
the corresponding `u`-shifted signs.

The normalized quotient is

\[
 \boxed{
 G_\epsilon(r)
 ={\displaystyle
   \prod_{s\in R_0}(1-r^2/s^2)
   (1-r^2/\epsilon^2)
   (1-r^2\epsilon^2/C_N^2)
  \over\displaystyle
   \prod_{n=1}^N(1-r^2/n^2)}.}                   \tag{5.10}
\]

For every fixed `t>0`, all factors are positive at `r=it`, and

\[
 \boxed{
 G_\epsilon(it)
 \sim {t^2\over\epsilon^2}
 {\displaystyle\prod_{s\in R_0}(1+t^2/s^2)
  \over\displaystyle\prod_{n=1}^N(1+t^2/n^2)}.} \tag{5.11}
\]

Thus even exact `p_mu=p_*`, exact retained root parity, prescribed capture,
and a uniform strict gap do not bound the normalized response.  At fixed
`N,L`, the physical factor
\(K_L(iy)G_\epsilon(iyL/(2\pi))\) also diverges as `epsilon` decreases to
zero for every `y>0`.

There is a complementary moment-invisibility normalization.  Set
`omega_epsilon=epsilon^4`, give the compensating root weight one, and keep
the other weights fixed.  The two extreme paired atoms then tend entrywise
to zero as `epsilon` decreases to zero.  The source matrix converges while
the unweighted ground divisor in (5.11) diverges.  The strict gaps collapse
in this normalization, but they remain positive for every finite
`epsilon`.

This normalization also meets the quadrature picture sharply.  The two
transformed Gaussian weights from (4.1) obey

\[
 {\epsilon^4\over\Pi_N(\epsilon^2)^2}
   =\Theta(\epsilon^4),\qquad
 {1\over\Pi_N(C_N^2/\epsilon^2)^2}
   =\Theta(\epsilon^{4N}).                        \tag{5.12}
\]

The far atom's contribution to moment `k` is therefore
`Theta(epsilon^(4N-2k))`: it vanishes through `k=2N-1` but is order one at
`k=2N`.  This is the exact obstruction immediately beyond the sharp degree
cutoff in (2.12).  These unscaled weights have collapsing spectral gaps;
the earlier uniform-gap construction is the separately rescaled family.

Finally, an explicit one-versus-three fixture removes any product ambiguity.
Take `N=6`, `p_*=1`, `epsilon=10^(-3)`, and

\[
\begin{aligned}
 R_{\rm one}={}&\left\{{5\over2},{7\over2},{13\over2},{15\over2},
 \epsilon,
 {720\over\epsilon(5/2)(7/2)(13/2)(15/2)}\right\},\\
 R_{\rm three}={}&\left\{{9\over4},{5\over2},{11\over4},{7\over2},
 \epsilon,
 {720\over\epsilon(9/4)(5/2)(11/4)(7/2)}\right\}.
\end{aligned}                                                   \tag{5.13}
\]

The last radius is retuned and is greater than six in each set.  Both radius
products are exactly `6!=720`, so both have `p_mu=1`.  The gap `(2,3)`
contains one root in the first set and three in the second.  At every
retained integer the two numbers of lower roots have the same parity.  Both
paired Grams have strict odd blocks and strict even ground complements.
Thus parity and normalization do not identify the number of simple roots
in a captured window.

## 6. Exact stopping line

The quadrature theorem identifies the missing actual-arithmetic statement;
it does not prove it.  A successful continuation needs enough control of
the signed functional (2.11) to establish all of the following at the
physical moving scale:

1. the required inertia and separation of the localizing pencil
   `H_mu-yM_mu`, not only positivity of `M_mu`;
2. a quantitative lower control of Gaussian weights, or an equivalent
   Christoffel-function bound, excluding moment-invisible selector roots;
3. the determinant ratio in (4.7), together with the reciprocal-root
   logarithmic potential entering `G_mu`; and
4. a cancellation-preserving bound after multiplication by the physical
   factor `K_L`.

Any downstream use must reject a claimed pass if it removes RH from the
zero-functional identity, treats the simple-ground or strict-sign
hypotheses as proved on an unbounded schedule, infers local uniqueness from
capture plus parity, infers response control from `p_mu` alone, identifies
the structural paired Gram with the actual source, or claims determinant
convergence, a new zero theorem, RH, a converse, an actual-arithmetic
failure, or a `Lambda` bound.
