# RH zero Gaussian nodes and the square-free auxiliary limit

## 0. Exact outcome and claim boundary

Put

\[
 L=2\log\lambda,\qquad
 N=\lceil\lambda L^3\rceil,\qquad
 \Delta={2\pi\over L}.                              \tag{0.1}
\]

Assume RH and the finite checkpoint-1.37 hypotheses which make the shifted
odd moment Gram `M_mu` positive definite.  In particular
`M_0=M_mu+mu*S_N>0`.  At `mu=0` the functional of checkpoint 1.37 is the
positive transformed RH zero measure.  Order the distinct positive
critical ordinates, with multiplicity retained only in their weights, as

\[
 0<\gamma_1<\gamma_2<\cdots,
 \qquad r_{j,L}={\gamma_j\over\Delta},
 \qquad s_{j,L}=r_{j,L}^2.                          \tag{0.2}
\]

Let

\[
 0<t_{1,L}<\cdots<t_{N,L}                            \tag{0.3}
\]

be the `N` Gaussian nodes of `mathfrak L_0`, equivalently the generalized
eigenvalues of `H_0-tM_0`.  Then for every fixed `j` there is a finite
constant `C_j`, independent of `L`, such that

\[
 \boxed{
 s_{j,L}\leq t_{j,L}\leq s_{j,L}+C_j.}             \tag{0.4}
\]

Consequently, with the physical node

\[
 \tau_{j,L}=\Delta\sqrt{t_{j,L}},                   \tag{0.5}
\]

one has

\[
 \boxed{
 \gamma_j\leq\tau_{j,L},\qquad
 \tau_{j,L}^2=\gamma_j^2+O_j(L^{-2}),\qquad
 \tau_{j,L}-\gamma_j=O_j(L^{-2}).}                 \tag{0.6}
\]

In particular, for all sufficiently large `L`, exactly one `mu=0`
Gaussian radius `sqrt(t_(j,L))` lies in the checkpoint-1.36 radius window
`[n_j-1,n_j+1]`, where `n_j=nint(r_(j,L))`.  This is genuine local
uniqueness for the auxiliary positive functional.  It is one asymptotic
node for each fixed distinct support ordinate, not one node per algebraic
occurrence.

There is also a global auxiliary limit.  Put

\[
 G_0(r)={\displaystyle\prod_{j=1}^N
                 (1-r^2/t_{j,L})
          \over\displaystyle\prod_{n=1}^N(1-r^2/n^2)},
 \qquad
 K_L(z)={2\sin(zL/2)\over z\sqrt L}.                \tag{0.7}
\]

Then

\[
 \boxed{
 {K_L(z)\over\sqrt L}G_0\!\left({zL\over2\pi}\right)
 \longrightarrow
 P_{\rm sf}(z):=
 \prod_{\gamma\in\mathcal Z_+^\sharp}
       \left(1-{z^2\over\gamma^2}\right)}          \tag{0.8}
\]

locally uniformly on the complex plane.  Here
`mathcal Z_+^sharp` is the set of distinct positive ordinates.  Thus the
limit is the square-free zero product.  On RH,

\[
 P_{\rm sf}(z)={\Xi(z)\over\Xi(0)}
 \quad\Longleftrightarrow\quad
 \hbox{every positive critical zero is simple}.     \tag{0.9}
\]

Multiplicity is present in the Gaussian weights and in the local
Christoffel estimate below, but it cannot repeat a support eigenvalue.

The result uses moments only through degree `2N-1`.  It never assigns a
finite degree-`2N` norm to the orthogonal polynomial.  Carrier shells are
included before every min--max argument.

For the genuine shifted functional the fixed-index upper Ritz bound
survives, but the support lower bound does not.  A quantitative even
localizing reserve, stronger than the presently known strict inequality,
would recover uniqueness together with checkpoint-1.36 capture.  No such
reserve is proved here.  No actual shifted-node convergence, shifted
local uniqueness, zero-multiplicity transfer, determinant convergence,
prolate-anchor normalized-response estimate, new zeta-zero statement, RH
proof or converse, actual-arithmetic sign failure, or de Bruijn--Newman
`Lambda` bound is obtained.  The checkpoint-1.37 standard eight are
unchanged and the project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Only the following frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SHIFTED_ZERO_SELECTOR_GAUSSIAN_QUADRATURE_BARRIER.md` | `1a2c95f9cf352a89b5eda544ac7158124761b1afe49ead464ca881ca08d6acd1` |
| `tests/test_shifted_zero_selector_gaussian_quadrature_barrier.py` | `2da21833bf1d79977c7b1b656be3f40d9bfbe9e2483ecb5c65941fabb6dde2d0` |
| `notes/RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md` | `07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c` |
| `tests/test_rh_conditional_fixed_zero_selector_capture_theorem.py` | `9de65e4fd61a71736c4df484a6b3f7ce0dd54a659b681baab0e6dd2bd0c36730` |

Checkpoint 1.37 supplies the degree-`2N-1` functional, its carrier-shell
convention, the moment and localizing Grams, the Gaussian determinant
formula, and the shifted reserves.  Checkpoint 1.36 supplies the actual RH
zero moments, the convergence of
`sum_(gamma>0)m_gamma/gamma^2`, the polynomial Gevrey bound on `mu`, and
the conditional captured carrier windows.  No zero table, numerical
artifact, external paper, or additional zero-count estimate is used.

RH alone is not being used to assert `M_0>0`.  Count-compatible
out-of-band carrier locking can make the odd Gram singular.  Positivity of
`M_0` follows here from the explicitly assumed checkpoint-1.37 finite
strictness, and is indispensable for the `N` Gaussian nodes.

## 2. The transformed measure and its exact fixed atom

For a noncarrier ordinate put

\[
 r={\gamma\over\Delta},\qquad
 c_\gamma={L\over2\pi^2}m_\gamma
                  \{1-\cos(\gamma L)\}.             \tag{2.1}
\]

The positive `mu=0` measure is

\[
 d\nu_{0,L}(y)=
 \sum_{r_\gamma\notin\mathbb Z}
 {c_\gamma\over\Pi_N(r_\gamma^2)^2}
       \delta_{r_\gamma^2}
 +\sum_{1\leq n\leq N}
 {m_{n,L}L\over4n^2\Pi_N'(n^2)^2}\delta_{n^2},     \tag{2.2}
\]

where `m_(n,L)` is the total multiplicity of the zeros on the in-band
carrier `gamma=Delta*n`.  Exact out-of-band carriers have zero transformed
weight.  They can only delete support points and hence can only increase
the ordered effective support locations.

The finite sine product gives

\[
 \Pi_N(r^2)=(-1)^N{\sin(\pi r)\over\pi r}
       \Gamma(N+1-r)\Gamma(N+1+r).                  \tag{2.3}
\]

Since `1-cos(2*pi*r)=2*sin(pi*r)^2`, the regular atom weight is exactly

\[
 \boxed{
 \alpha_{\gamma,N,L}
 ={m_\gamma Lr^2\over
   \Gamma(N+1-r)^2\Gamma(N+1+r)^2}.}                \tag{2.4}
\]

At an in-band carrier `r=n`,

\[
 a_n:={1\over4n^2\Pi_N'(n^2)^2}
 ={n^2\over (N-n)!^2(N+n)!^2},qquad
 \alpha_{\gamma,N,L}=m_\gamma L a_n.              \tag{2.5}
\]

Thus (2.4) extends continuously through the carrier after its shell is
inserted.  For a fixed ordinate, `r=O(L)` and `L^2/N` tends to zero, so

\[
 \alpha_{\gamma,N,L}
 ={m_\gamma Lr^2\over\Gamma(N+1)^4}
   \left\{1+O_\gamma\!\left({L^2\over N}\right)\right\}.
                                                               \tag{2.6}
\]

The absolute atom is superfactorially small in the monomial basis.  Its
relative leverage is nevertheless asymptotically one.

Let `lambda_0(x)` be the degree-`N-1` Christoffel function of `M_0`.  For
the fixed support point `s_(j,L)`, every polynomial normalized to one there
pays at least its atom weight.  The cardinal polynomial

\[
 e_n(y)={2n\Pi_N(y)\over n^2-y}                    \tag{2.7}
\]

at `n=n_j` gives the reverse estimate.  Its target zero contributes
`Omega_j(L)` to `mathfrak L_0[e_n^2]`, while all other distinct zeros
together contribute `O_j(L^(-1))`; the tail uses only
`sum m_gamma/gamma^2<infinity`.  Dividing by `e_n(s_(j,L))^2` gives

\[
 \boxed{
 \alpha_{\gamma_j,N,L}
 \leq\lambda_0(s_{j,L})
 \leq\alpha_{\gamma_j,N,L}\{1+O_j(L^{-2})\}.}       \tag{2.8}
\]

This is a source-specific Christoffel saturation at the actual support
atom.  It is not a lower bound for the Christoffel function at a moving
shifted Gaussian node.

## 3. Fixed-node lower and upper Ritz bounds

### 3.1 The lower bound uses only the form domain

Let the positive-weight support of (2.2), in increasing order, be

\[
 0<\sigma_{1,L}<\sigma_{2,L}<\cdots.                \tag{3.1}
\]

Positive definiteness of `M_0` implies that there are at least `N`
support points.  Multiplication by `y` on `L2(nu_(0,L))` has quadratic-form
eigenvalues `sigma_(j,L)`, one for each distinct atom.  The polynomial
space of degree at most `N-1` lies in its form domain because
`mathfrak L_0[y|q|^2]` has degree at most `2N-1`.  Restricting the min--max
principle to this polynomial space can only raise the Ritz values:

\[
 t_{j,L}\geq\sigma_{j,L},qquad 1\leq j\leq N.      \tag{3.2}
\]

For fixed `j`, all of `gamma_1,...,gamma_j` are eventually in band.  If
one is a carrier, (2.5) restores its positive shell.  Hence
`sigma_(i,L)=s_(i,L)` for `i<=j` and all sufficiently large `L`, proving
the lower half of (0.4).

This argument does not use the degree-`N` polynomial norm.  Equivalently,
one may prove (3.2) by the sign-change argument using orthogonality only
against degrees below `N`; every gap between consecutive Gaussian nodes
must contain a positive support point.

### 3.2 A fixed cardinal trial space gives the upper bound

Fix `k`, put `n_i=nint(r_(i,L))`, and define

\[
 E_{k,L}=\operatorname {span}
       \{e_{n_1},\ldots,e_{n_k}\}.                  \tag{3.3}
\]

The `n_i` are distinct and at most `N` for large `L`.  For
`q_a=sum_(i<=k)a_i e_(n_i)`, the first `k` zero atoms give an evaluation
matrix `U`.  If `delta_j=r_(j,L)-n_j` is nonzero, its diagonal entry obeys

\[
 |U_{jj}|^2
 ={4m_jLn_j^2\sin^2(\pi\delta_j)
   \over\pi^2\delta_j^2(2n_j+\delta_j)^2}
 \geq {64m_jL\over25\pi^2}.                        \tag{3.4}
\]

At a carrier the exact value is `m_j*L`.  For `i!=j`, fixed-ordinate
separation gives

\[
 {U_{ji}\over U_{jj}}
 ={n_i(n_j^2-r_{j,L}^2)
   \over n_j(n_i^2-r_{j,L}^2)}=O_k(L^{-1}),          \tag{3.5}
\]

with value zero in the carrier branch.  Therefore, for one `c_k>0`,

\[
 \mathfrak L_0[|q_a|^2]\geq c_kL\|a\|_2^2.         \tag{3.6}
\]

Put `b_i=Delta*n_i`.  At a regular ordinate `beta`,

\[
 {q_a(r_\beta^2)\over\Pi_N(r_\beta^2)}
 =\Delta\sum_{i=1}^k{2a_ib_i\over b_i^2-\beta^2}.  \tag{3.7}
\]

For `beta>=gamma_(k+1)`, fixed separation and Cauchy--Schwarz give

\[
 \left|\sum_{i=1}^k{2a_ib_i\over b_i^2-\beta^2}
 \right|^2
 \leq {C_k\|a\|_2^2\over(1+\beta^2)^2}.            \tag{3.8}
\]

After multiplication by the atom weight and by
`r_beta^2-s_(k,L)`, the powers of `Delta` cancel.  Hence

\[
 \int_{(s_{k,L},\infty)}(y-s_{k,L})|q_a(y)|^2
             \,d\nu_{0,L}(y)
 \leq C_k'L\|a\|_2^2
       \sum_{\beta>\gamma_k}{m_\beta\over1+\beta^2}
 \leq C_k''L\|a\|_2^2.                             \tag{3.9}
\]

Tail carriers not among the selected `n_i` contribute zero because of the
cardinal values of `e_n`; exact out-of-band carriers have zero transformed
weight.  The first `k` support atoms make nonpositive contributions to
`mathfrak L_0[(y-s_(k,L))|q_a|^2]`.  Combining (3.6) and (3.9), then using
Courant--Fischer on the `k`-dimensional space (3.3), proves

\[
 t_{k,L}\leq s_{k,L}+{C_k''\over c_k}.              \tag{3.10}
\]

Equations (3.2) and (3.10) prove (0.4).  Applying them also at `k-1` and
`k+1`, and using the fixed positive gaps between distinct ordinates,
proves that exactly one Gaussian radius lies in the stated radius window.

## 4. Reciprocal control and the square-free product

For all `j<=N`, (3.2) compares the `j`th Gaussian node with the `j`th
effective support point.  The latter is a subsequence of the actual
distinct zero ordinates; omitted out-of-band carriers only move it upward.
Therefore

\[
 \boxed{
 \sum_{j=1}^N{1\over\tau_{j,L}^2}
 \leq
 C_Z^\sharp:=
 \sum_{\gamma\in\mathcal Z_+^\sharp}{1\over\gamma^2}
 \leq\sum_{\gamma>0}{m_\gamma\over\gamma^2}<\infty.}
                                                               \tag{4.1}
\]

The fixed-index convergence (0.6), the uniform reciprocal tail (4.1), and
the standard split into finitely many factors plus a small logarithmic tail
give

\[
 \prod_{j=1}^N\left(1-{z^2\over\tau_{j,L}^2}\right)
 \longrightarrow P_{\rm sf}(z)                    \tag{4.2}
\]

locally uniformly.  This uses only the absolutely convergent paired
canonical product.

To identify the exact auxiliary response, put `r=zL/(2*pi)`.  The sine
product and the checkpoint-1.37 determinant formula give

\[
\begin{aligned}
 F_{0,L}(z)
 &:={K_L(z)\over\sqrt L}G_0(r)\\
 &=\prod_{j=1}^N\left(1-{z^2\over\tau_{j,L}^2}\right)
   \prod_{n>N}\left(1-{z^2L^2\over4\pi^2n^2}\right).
\end{aligned}                                                    \tag{4.3}
\]

Uniformly on `|z|<=R`, the logarithmic size of the second tail is

\[
 O_R\!\left(L^2\sum_{n>N}{1\over n^2}\right)
 =O_R\!\left({L^2\over N}\right)=o(1).             \tag{4.4}
\]

Equations (4.2)--(4.4) prove (0.8).

At a fixed imaginary point `z=iy`, `y>0`, every factor of the limit is
positive.  Thus

\[
 \boxed{
 K_L(iy)G_0\!\left({iyL\over2\pi}\right)
 =\sqrt L\{P_{\rm sf}(iy)+o(1)\}.}                 \tag{4.5}
\]

This is an asymptotic for the auxiliary central normalization
`p_0=xi_0` of checkpoint 1.37.  The capture-free dangerous response uses
the different overlap `<kappa_prolate,Phi>`.  No equality or quantitative
comparison between those two normalizations is asserted.

## 5. What survives the positive shift

In the cardinal basis, the two shifted Grams are

\[
 M_\mu=M_0-\mu I,qquad
 H_\mu=H_0-\mu D^2,qquad
 H_0=DA^\circ D.                                    \tag{5.1}
\]

Define

\[
 \epsilon_-={\mu\over\lambda_{\min}(M_0)},\qquad
 \epsilon_+={\mu\over\lambda_{\min}(A^\circ)},
 \qquad
 \delta_-=1-\epsilon_-,\quad
 \delta_+=1-\epsilon_+.                            \tag{5.2}
\]

The strict shifted signs give only `delta_->0` and `delta_+>0`.  Loewner
comparison and generalized min--max give, for the ordered shifted nodes,

\[
 \boxed{
 \delta_+t_{j,L}(0)
 \leq t_{j,L}(\mu)
 \leq\delta_-^{-1}t_{j,L}(0).}                     \tag{5.3}
\]

On the fixed trial space (3.3), however, the actual frozen Gevrey estimate
is already enough for the upper side.  In particular, it gives
`mu*L=o(1)`.  Equations (3.6) and (3.9) therefore give

\[
 \boxed{
 t_{j,L}(\mu)\leq s_{j,L}+O_j(1+\mu L)
                  =s_{j,L}+O_j(1).}                \tag{5.4}
\]

The lower support comparison (3.2) is unavailable for the signed
multi-Uvarov functional.  Near-null directions supported on the other
lattice sites are controlled by the global Woodbury factor
`(I-mu*C_sigma)^(-1)`, whose norm can be `delta_-^(-1)`.

There is a precise sufficient uniqueness gate.  Fix `j` and suppose, for
some `eta>0`,

\[
 \boxed{
 \delta_+>\left({\gamma_j\over\gamma_{j+1}}\right)^2
                 +\eta.}                            \tag{5.5}
\]

Then (3.2) and (5.3) put `t_(j+1,L)(mu)` above the squared upper endpoint
`(n_j+1)^2`, while (5.4) puts every squared node through index `j-1` below
the squared lower endpoint `(n_j-1)^2`.  The checkpoint-1.36 captured
Gaussian radius must therefore be `sqrt(t_(j,L)(mu))` and is unique in the
radius window.  For direct perturbative
preservation of the `mu=0` node without invoking capture, the stronger
conditions

\[
 \epsilon_-=o(L^{-1}),\qquad\epsilon_+=o(L^{-1})    \tag{5.6}
\]

are sufficient by (0.4) and (5.3).

Neither (5.5) nor (5.6) follows from strictness.  The best frozen
source-specific odd determinants live far below the Gevrey upper scale,
and no even or endpoint-localizing lower theorem supplies (5.5).  The
pointwise fact that the nearest negative lattice atom is only

\[
 {\mu a_{n_j}\over\alpha_{\gamma_j,N,L}}
 ={\mu\over m_jL}\{1+o(1)\}                        \tag{5.7}
\]

of the fixed positive atom does not dominate the other `N-1` Uvarov
sites and is not a matrix reserve.

## 6. Exact stopping line

The positive actual zero functional at `mu=0` has fixed-node uniqueness,
fixed-atom Christoffel saturation, and the square-free locally uniform
limit (0.8).  These statements are auxiliary.  Passing to the genuine
positive ground shift still requires at least one of:

1. the quantitative even reserve (5.5) for local uniqueness;
2. direct inertia control of the endpoint pencil `H_mu-tM_mu` at the two
   carrier-window endpoints; or
3. a localized multi-Uvarov theorem which excludes extra low nodes without
   replacing the actual signed functional by its positive `mu=0` measure.

Any downstream use must reject a claimed pass if it treats RH alone as
positivity of `M_0`, uses a degree-`2N` moment, drops carrier shells, repeats
a Gaussian node according to zero multiplicity, promotes (0.8) to the
multiplicity-retaining Xi product, identifies `xi_0` with the prolate-anchor
overlap, or infers actual shifted-node convergence, shifted local
uniqueness, an actual normalized-response estimate, RH, a converse, or a
`Lambda` bound.
