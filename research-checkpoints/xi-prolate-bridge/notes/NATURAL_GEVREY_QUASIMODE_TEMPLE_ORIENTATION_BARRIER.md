# Natural Gevrey quasimode and Temple orientation barrier

## 0. Exact outcome and claim boundary

Let `p` tend to infinity through the odd positive integers and put

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad M_p=\lceil\lambda_p\rceil={p+1\over2},
 \qquad N_p=M_p+1={p+3\over2}.                    \tag{0.1}
\]

There is a fixed sufficiently small `delta>0` such that the formal Hermite
order

\[
 J_p=\left\lfloor{\delta\lambda_p\over L_p^2}\right\rfloor             \tag{0.2}
\]

can be inserted into the frozen Gevrey prolate construction.  The resulting
source-normalized arithmetic state satisfies, at both adjacent centered
Fourier cutoffs `M_p` and `N_p`,

\[
 \boxed{
 e_{\lambda_p,M_p}+e_{\lambda_p,N_p}
 =O\!\left(\exp\left[-c{\lambda_p\over L_p}\right]\right).}            \tag{0.3}
\]

Here `e_(lambda,R)=||(1-P_R)X_lambda||_2`.  The compact-BV theorem, the
complete physical-outer estimate, and the projected-state normalization
then give, after decreasing `c>0` finitely many times,

\[
 \boxed{
 \epsilon_{\lambda_p,N_p}+U_{Z,p}+|q_p|
 +\|(Q_{p,+}-q_pI)\kappa_p\|
 =O\!\left(\exp\left[-c{\lambda_p\over L_p}\right]\right).}            \tag{0.4}
\]

The same statement holds with `N_p` replaced by `M_p` wherever the finite
state is defined at that cutoff.  The constants and the starting odd `p`
are non-effective because the frozen prolate branch, concentration, and
Gevrey thresholds are non-effective.  The constants are nevertheless fixed
and independent of `p`; (0.3)--(0.4) are uniform asymptotic statements on
the odd halfgrid.

The exponential class in (0.3) is the strongest one obtained from the
frozen analytic-strip estimate at `N asymptotic to lambda`: its negative
Fourier exponent has size `Omega_N asymptotic to lambda/L`.  This note does
not claim an effective constant or an optimal exponential coefficient.

Small absolute residual is not projective alignment.  If `mu_1<mu_2` are
the first two even eigenvalues, `xi_1` is the unit simple ground, and
`q<mu_2`, the exact Temple/Davis--Kahan chain is

\[
 \boxed{
 {\|P_{{\cal L}_M}\xi_1\|^2\over
       |\langle\kappa,\xi_1\rangle|^2}
 \leq\tan^2\angle(\kappa,\xi_1)
 \leq{q-\mu_1\over\mu_2-q}
 \leq{r^2\over(\mu_2-q)^2},
 \qquad r=\|(Q_+-qI)\kappa\|.}                          \tag{0.5}
\]

Consequently the relative gap condition

\[
 \boxed{\mu_2-q\geq\sqrt\lambda\,r}                    \tag{0.6}
\]

would imply the required `O(lambda^(-1))` simple-ground alignment.  Neither
(0.6) nor an equivalent actual arithmetic orientation theorem is proved.

Section 7 gives an exact positive semidefinite, inversion-symmetric,
source-Cauchy diagonal family with the same exponential scalar scale.  It
has a simple visible ground, strict complement gate, bounded exact Ritz
ratio, and

\[
 \mathcal A={1\over2}                                   \tag{0.7}
\]

at every size.  It is synthetic: its freely chosen diagonal is not the
pinned pole--archimedean--minus-prime matrix.  It proves only that the
absolute conclusions (0.3)--(0.4), source-Cauchy displacement, positivity,
and the listed finite gates do not imply the missing relative gap or
orientation.

This is one post-checkpoint-1.58 theorem/barrier pair.  It changes none of
the standard eight, adds no zero table or numerical artifact, proves no
actual even-sector gap, projective alignment, determinant convergence,
zero statement, Riemann hypothesis, converse, or de Bruijn--Newman bound,
and leaves the formal state `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three note/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `tests/test_gevrey_prolate_remainder.py` | `93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `tests/test_all_order_prolate_flatness.py` | `f6a7925a8dd892183953e75ee24acc8bad9fd64226d7f578600736dda1c3fa03` |
| `notes/PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md` | `b6328de0744d867416ffa510be3bfa7cd5028c4e489f20a55639238f98bbd221` |
| `tests/test_prolate_endpoint_schur_singular_asymptotics.py` | `d754043dcb21033888958af11401918f0c2e9b183161ff3fa4e55b5890a4ecb6` |

The first pair supplies the Gevrey-one majorant, growing quasimode,
arithmetic-transfer estimate, analytic-strip projection estimate, and
moving-endpoint bounds.  The second supplies the monotone compact-BV
insertion, polynomial source variation, complete hybrid outer bound, and
eventual positive projected-state normalization.  The third supplies the
finite-window unit-vector sampling envelope and the exact radical-leakage
implications from `U_Z` to `q` and the residual.

All schedule algebra, the natural diagonal insertion, the spectral
inequalities, and the counterfamily below are proved directly.  No source
lock, external paper, zero list, cached matrix, numerical sample, or
additional repository theorem is imported.

## 2. Natural-order Gevrey truncation

Suppress `p` temporarily.  The frozen Gevrey construction has
`epsilon=lambda^(-2)` and, for every admissible `J`, gives a
Fourier-invariant Hermite approximation `G_(lambda,J)` satisfying

\[
 \|X_\lambda-G_{\lambda,J}\|_2
 \leq C\lambda e^{-c_0\lambda^2}
 +C\lambda\left({B(J+1)\over\lambda^2}\right)^{J+1}.     \tag{2.1}
\]

Its Hermite support and coefficient norm obey

\[
 K\leq4J+4,\qquad \|G_{\lambda,J}\|_{\rm coeff}\leq C. \tag{2.2}
\]

The constant in (2.2) is uniform here.  Indeed, for
`0<=j<=J`,

\[
 {B(j+1)\over\lambda^2}
 \leq {2B\delta\over\lambda L^2}=o(1),                  \tag{2.3}
\]

so the frozen Gevrey majorants decrease geometrically.  Also
`J=o(lambda^2)`, and hence `J` lies below the endpoint-safe least-term order
for all sufficiently large `lambda`.

Let

\[
 x={\delta\lambda\over L^2}.                              \tag{2.4a}
\]

Eventually `x>=2`, and therefore

\[
 {\delta\lambda\over2L^2}\leq J+1
 \leq {2\delta\lambda\over L^2}.                        \tag{2.4}
\]

Since `L=2 log(lambda)`, (2.4) gives

\[
 \log\left({B(J+1)\over\lambda^2}\right)
 \leq -{L\over3}                                        \tag{2.5}
\]

eventually.  Combining (2.4)--(2.5), and using
`L=o(lambda/L)`, proves

\[
 \boxed{
 \lambda\left({B(J+1)\over\lambda^2}\right)^{J+1}
 \leq\exp\left(-{\delta\lambda\over12L}\right)}        \tag{2.6}
\]

after enlarging the non-effective starting threshold.

The outside-source arithmetic sum and every moving-endpoint term in the
frozen theorem are a fixed polynomial times `exp(-c lambda^2)`.  The
support in (2.2) is `o(lambda^2)`, so all endpoint-range hypotheses remain
strictly inside their admitted bounds.  Thus no physical or exterior term
weakens (2.6).

## 3. Analytic-strip projection at adjacent natural cutoffs

Fix once and for all `0<sigma<pi/4`, and let `C_sigma` be the constant in
the frozen strip estimate.  For `R=M` or `R=N`, put

\[
 \Omega_R={2\pi(R+1)\over L}.                            \tag{3.1}
\]

The projection estimate is

\[
 \|(1-P_R)G_{\lambda,J}\|_2
 \leq C\exp\{C_\sigma K\log(K+2)-\sigma\Omega_R\}
 +\operatorname {poly}(\lambda,K,R)e^{-c_1\lambda^2}.    \tag{3.2}
\]

On (0.1)--(0.2),

\[
 K\log(K+2)
 \leq(2\delta+o(1)){\lambda\over L},
 \qquad
 \Omega_M,\Omega_N=(2\pi+o(1)){\lambda\over L}.        \tag{3.3}
\]

Choose the fixed `delta` so small that

\[
 2C_\sigma\delta<\pi\sigma.                             \tag{3.4}
\]

Equations (3.2)--(3.4) then give

\[
 \|(1-P_R)G_{\lambda,J}\|_2
 =O\!\left(e^{-c_2\lambda/L}\right),
 \qquad R\in\{M,N\}.                                   \tag{3.5}
\]

Combining (2.1), (2.6), and (3.5) proves (0.3).  Notice
that increasing the cutoff by one is not used as an asymptotic
approximation: both adjacent integers separately satisfy (3.3).

The scale in (3.5) is also the ceiling of this frozen argument.  At a
natural cutoff the strip damping is only

\[
 \sigma\Omega_R=\Theta(\lambda/L).                     \tag{3.6}
\]

No faster class follows from (3.2) without a stronger transform estimate.

## 4. Compact-BV and complete-remainder transfer

Let `E_R=e_(lambda,R)` and let `V_R` be the full-line variation of the
actual zero-extended compact projection remainder.  The frozen source
variation bound is

\[
 V_R\leq3A_\lambda^{\rm src}V_*(\lambda)
              (1+\sqrt{2R}).                            \tag{4.1}
\]

Here `A_lambda^(src)=O(lambda)` and `V_*(lambda)=O(lambda^3)`.  Since
`R` is `M` or `N`,

\[
 \boxed{V_R=O(\lambda^{9/2}).}                           \tag{4.2}
\]

Take the directed upper bounds

\[
 \overline E_R=C e^{-c_2\lambda/L},\qquad
 \overline V_R=C'\lambda^{9/2},                         \tag{4.3}
\]

and put

\[
 \overline W_R=\overline V_R+{3\over4}\sqrt L\,
                    \overline E_R,
 \qquad
 \overline H_R=\max\left\{1,
 {\overline W_R^2\over\overline E_R^2}\right\}.        \tag{4.4}
\]

The monotonicity proved in the frozen compact-BV insertion is essential:
it permits (4.3)--(4.4) even if the unknown true error is smaller or zero.
It gives

\[
 \log\overline H_R=O(\lambda/L).                       \tag{4.5}
\]

The explicit compact-BV theorem therefore yields

\[
\begin{aligned}
 \|R_R^{\rm proj}\|_{\mathfrak Z}^2
 &\ll \lambda(1+\log\lambda)^2\overline E_R^2
 \left[1+\log(\overline H_R+2)\right]\\
 &\ll \lambda^2L\exp(-2c_2\lambda/L)
 =O(e^{-c_3\lambda/L}).
\end{aligned}                                               \tag{4.6}
\]

The complete physical-outer theorem is independent of the centered
Fourier dimension and gives

\[
 \|R_R^{\rm out}\|_{\mathfrak Z}^2
 \leq B_{\rm hyb}(\lambda)d_4,
 \qquad
 B_{\rm hyb}(\lambda)
 =O(\lambda^3\operatorname {polylog}\lambda).           \tag{4.7}
\]

The frozen fixed-index concentration asymptotic makes the right side

\[
 \exp\{-4\pi\lambda^2+O(\log\lambda)\}.                \tag{4.8}
\]

Thus the physical exterior is negligible relative to (4.6).  Ordinary
sequence-space triangle inequality, with all outer/projection cross terms
retained inside the complete remainder, gives

\[
 \boxed{
 \epsilon_{\lambda,R}:=\|R_R\|_{\mathfrak Z}^2
 =O(e^{-c_4\lambda/L}),
 \qquad R\in\{M,N\}.}                                  \tag{4.9}
\]

## 5. Normalization, scalar, and residual

Let

\[
 a_{\lambda,R}=\|P_RX_\lambda\|_2,
 \qquad \kappa_R={P_RX_\lambda\over a_{\lambda,R}}.    \tag{5.1}
\]

The frozen source comparison and projected-state theorem require only

\[
 {\log\lambda\over R+1}\longrightarrow0.               \tag{5.2}
\]

Both natural adjacent cutoffs satisfy (5.2), so

\[
 a_{\lambda,R}\longrightarrow a_\infty>0.              \tag{5.3}
\]

In particular, for a fixed `a_->0`, eventually
`a_(lambda,R)>=a_-`.  Hence

\[
 \boxed{
 U_{Z,R}:={\epsilon_{\lambda,R}\over a_{\lambda,R}^2}
 =O(e^{-c_4\lambda/L}).}                                \tag{5.4}
\]

The exact radical leakage identity gives

\[
 |q_R|\leq U_{Z,R}.                                     \tag{5.5}
\]

It remains to audit the finite-space Bessel envelope.  For a unit vector
in the centered window, Bernstein and the two endpoint traces give

\[
 \operatorname {TV}_{\mathbb R}(v)
 \leq {2\pi R+2\sqrt{2R+1}\over\sqrt L}.               \tag{5.6}
\]

The frozen compact-BV unit-vector insertion therefore gives

\[
 \boxed{
 \sup_{\|v\|=1}\|v\|_{\mathfrak Z}^2
 \leq B_{\rm abs}(\lambda,R)=O(\lambda L^3),
 \qquad R\in\{M,N\}.}                                  \tag{5.7}
\]

Indeed, the variation height in (5.6) has logarithm `O(L)`, and the
explicit sampling formula is `lambda*(1+log(lambda))^2` times one more
linear logarithmic factor.  The huge finite zero-count constant is fixed
and changes no asymptotic class.

For the Riesz vector of the radical cross-pairing, ordinary sequence
Cauchy--Schwarz and (5.7) give the exact finite-dimensional estimate used
in the frozen endpoint theorem:

\[
 \|(Q_{R,+}-q_RI)\kappa_R\|
 \ll \sqrt{B_{\rm abs}(\lambda,R)U_{Z,R}}+U_{Z,R}.       \tag{5.8}
\]

Equations (5.4), (5.7), and (5.8) prove

\[
 \boxed{
 |q_R|+\|(Q_{R,+}-q_RI)\kappa_R\|
 =O(e^{-c_5\lambda/L}),
 \qquad R\in\{M,N\}.}                                  \tag{5.9}
\]

The square root in (5.8) decreases the available exponential coefficient,
but not the class.  Taking the minimum of the finitely many positive
constants proves (0.4) with one common `c>0`.

## 6. Temple/Davis--Kahan projective reduction

Let `A=Q_+` be a finite Hermitian matrix with ordered eigenvalues

\[
 \mu_1<\mu_2\leq\cdots,                                 \tag{6.1}
\]

let `xi_1` be a unit `mu_1` eigenvector, and let `kappa` be unit.  Put

\[
 q=\langle\kappa,A\kappa\rangle<\mu_2,
 \qquad r=\|(A-qI)\kappa\|,
 \qquad \alpha=|\langle\kappa,\xi_1\rangle|^2.         \tag{6.2}
\]

The variational decomposition gives

\[
 q\geq\alpha\mu_1+(1-\alpha)\mu_2.                    \tag{6.3}
\]

Therefore

\[
 {1-\alpha\over\alpha}
 \leq{q-\mu_1\over\mu_2-q}.                            \tag{6.4}
\]

Temple's inequality in this notation is

\[
 (q-\mu_1)(\mu_2-q)\leq r^2.                           \tag{6.5}
\]

For completeness, expand `kappa=sum_j c_j xi_j`.  The high spectral part
obeys

\[
 \sum_{j\geq2}|c_j|^2(\mu_j-q)^2
 \geq(\mu_2-q)
       \sum_{j\geq2}|c_j|^2(\mu_j-q),                  \tag{6.6}
\]

and the vanishing first moment of `A-qI`, together with the nonnegative
ground contribution to `r^2`, give

\[
 \sum_{j\geq2}|c_j|^2(\mu_j-q)
 =\alpha(q-\mu_1),
 \qquad
 \alpha(\mu_2-\mu_1)\geq\mu_2-q.                       \tag{6.6a}
\]

Writing `d=q-mu_1` and `g=mu_2-q`, equations (6.6)--(6.6a) imply

\[
 r^2\geq\alpha d^2+g\alpha d
 =\alpha d(\mu_2-\mu_1)\geq dg,                         \tag{6.6b}
\]

which is (6.5).

Let `p=P_Mkappa` and

\[
 {\cal L}_M=\operatorname {Ran}P_M\cap p^\perp.          \tag{6.7}
\]

Every vector in `cal L_M` is orthogonal to `kappa`, because
`<v,kappa>=<v,p>`.  Consequently

\[
 {\|P_{{\cal L}_M}\xi_1\|^2\over
       |\langle\kappa,\xi_1\rangle|^2}
 \leq{1-\alpha\over\alpha}.                            \tag{6.8}
\]

Equations (6.4)--(6.5) prove (0.5).  Under (0.6), its last term is at most
`lambda^(-1)`.  This reduction is scale-relative: (5.9) alone says nothing
about the ratio `r/(mu_2-q)`.

## 7. Exact PSD source-Cauchy saturation family

Fix an odd `p`, use (0.1), and choose any fixed `c_*>0`.  Put

\[
 \varepsilon_p=\exp\left(-c_*{\lambda_p\over L_p}\right).             \tag{7.1}
\]

On raw indices `-N_p,...,N_p`, take source-Cauchy displacement data and
diagonal entries

\[
 b_n=0,\qquad
 a_0=0,\qquad a_{\pm1}=\varepsilon_p,
 \qquad a_{\pm n}=1\quad(2\leq n\leq N_p).              \tag{7.2}
\]

Thus

\[
 Q_{nm}={b_n-b_m\over n-m}=0\quad(n\ne m),              \tag{7.3}
\]

while the raw diagonal is inversion symmetric and nonnegative.  The even
block in its natural basis is

\[
 A_p=\operatorname {diag}(0,\varepsilon_p,1,\ldots,1)\succeq0.         \tag{7.4}
\]

The odd block and the exact boundary determinant identity are

\[
 Q_{p,-}=\operatorname {diag}(\varepsilon_p,1,\ldots,1)\succ0,
 \qquad
 \det(Q_{p,-}-zI)
 =\langle e_0,\operatorname {adj}(A_p-zI)e_0\rangle
 =(\varepsilon_p-z)(1-z)^{N_p-1}.                       \tag{7.4a}
\]

This family is source-Cauchy in the exact displacement sense, but the free
diagonal (7.2) is not asserted to arise from the complete arithmetic
source.

Let

\[
 \kappa_p=-\sqrt{2\over3}\,e_0+{1\over\sqrt3}e_1,
 \qquad
 w_p={1\over\sqrt3}e_0+\sqrt{2\over3}\,e_1.             \tag{7.5}
\]

Then `(kappa_p,w_p)` is orthonormal, the simple ground is `xi_1=e_0`, and

\[
 \mu_1=0,\qquad\mu_2=\varepsilon_p,
 \qquad q_p={\varepsilon_p\over3},
 \qquad r_p={\sqrt2\over3}\varepsilon_p.               \tag{7.6}
\]

The ground-shifted complement compression is diagonal in the basis
`(w_p,e_2,...)` and has floor

\[
 \boxed{
 \lambda_{\min}\left(
 P_{\kappa_p^\perp}(A_p-\mu_1I)P_{\kappa_p^\perp}
 \big|_{\kappa_p^\perp}\right)
 =\min\left\{{2\varepsilon_p\over3},1\right\}>0.}       \tag{7.7}
\]

The two-vector Ritz space generated by `kappa_p` and its nonzero residual
is exactly `span(e_0,e_1)`.  Its lower Ritz value is `u_p=0=mu_1`, and

\[
 \boxed{{q_p-u_p\over r_p}={1\over\sqrt2}.}             \tag{7.8}
\]

Take the boundary vector `eta=e_0`.  The bottom projector is
`P_E=|e_0><e_0|`, and the canonical visibility is

\[
 \boxed{|\langle\kappa_p,P_E\eta\rangle|
 =\sqrt{2\over3}.}                                      \tag{7.9}
\]

Because `N_p=M_p+1` and both coordinates in (7.5) lie below `M_p`, one has
`P_(M_p)kappa_p=kappa_p`.  The `M_p` compression is the same displayed
diagonal with only the outer unit coordinate removed, so there is no
outer-coordinate escape.  Hence

\[
\begin{aligned}
 \mathcal A_p
 &:={\|P_{{\cal L}_{M_p}}P_E\eta\|^2\over
       |\langle\kappa_p,P_E\eta\rangle|^2}\\
 &={1/3\over2/3}={1\over2}.
\end{aligned}                                               \tag{7.10}
\]

Every inequality in (0.5) is saturated:

\[
 \boxed{
 \mathcal A_p=\tan^2\angle(\kappa_p,e_0)
 ={q_p-\mu_1\over\mu_2-q_p}
 ={r_p^2\over(\mu_2-q_p)^2}={1\over2}.}                 \tag{7.11}
\]

In particular,

\[
 {\mu_2-q_p\over r_p}=\sqrt2,                            \tag{7.12}
\]

not `sqrt(lambda_p)`.  Absolute exponential smallness cancels between the
gap and residual.

This cancellation is stable under adjacent schedule motion.  Direct
differentiation of `lambda/L` gives

\[
 {\varepsilon_{p+2}\over\varepsilon_p}
 =1+O(L_p^{-1}).                                         \tag{7.13}
\]

Likewise an adjacent rank-one perturbation

\[
 \mathscr J_p^\pm=\pm\varepsilon_p
 |e_0\rangle\langle e_0|                                \tag{7.14}
\]

has

\[
 {\|\mathscr J_p^\pm\|\over\mu_2-\mu_1}=1.            \tag{7.15}
\]

Thus an absolute `O(e^(-c lambda/L))` adjacent-jump estimate is not a
relative perturbation theorem; the common scale cancels.

There is also a multiplicity-safe variant.  Replacing (7.4) by

\[
 A_p^{\rm mult}=\operatorname {diag}(0,0,1,\ldots,1)     \tag{7.16}
\]

makes `q_p=r_p=0`, while the bottom projector contains `e_0` and (7.10)
remains `1/2` for `eta=e_0`.  Zero scalar and zero residual therefore do
not determine the orientation of a multiple bottom projector.

## 8. Exact limitation

The actual theorem is (0.3)--(0.4): on the genuine source-normalized
prolate/arithmetic state, the projection error, complete sampled remainder,
normalized sampling shift, Rayleigh scalar, and undifferentiated residual
all have the natural exponential class `exp(-c lambda/L)`.

The synthetic theorem is only the nonimplication (7.11)--(7.15).  It does
not say that the actual arithmetic matrix has a closing gap, lacks one, or
resembles the diagonal family.  It shows that the already-proved absolute
data cannot decide that question.

The next sharp simple-ground target is therefore (0.6), or a stronger
arithmetic theorem that directly implies the first term of (0.5).  On the
multiplicity-safe branch the corresponding target remains the canonical
bottom-projector orientation estimate.  Neither target follows from the
natural Gevrey theorem alone, so the formal state remains `P0_INVALIDATED`.
