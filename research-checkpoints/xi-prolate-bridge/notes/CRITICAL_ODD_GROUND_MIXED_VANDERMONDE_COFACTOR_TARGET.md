# Critical odd-ground mixed Vandermonde cofactor target

## 0. Exact outcome and claim boundary

Assume RH only when the actual zeta-zero functional is invoked.  Use the
critical schedule and the true-ground notation frozen through checkpoint
1.54.  Let `lambda` be a simple smallest eigenvalue of the actual odd block
`Q_-`, and put

\[
 M=Q_--\lambda I.                                  \tag{0.1}
\]

This note proves that the remaining primitive sign has four exactly
equivalent finite forms:

\[
 \boxed{
 a^T\operatorname {adj}(M)
       \{(a_0-\lambda)a-d\}<0,}                    \tag{0.2}
\]

\[
 \boxed{
 \det\begin{pmatrix}
  0&a^T\\ (a_0-\lambda)a-d&M
 \end{pmatrix}>0,}                                \tag{0.3}
\]

\[
 \boxed{\partial_tF(\lambda,0)<0,}                \tag{0.4}
\]

and

\[
 \boxed{R<\lambda s_0K.}                          \tag{0.5}
\]

Here `a_n=1/n`, `d_n=b_n/n^2`, `F` is the exact
Christoffel--Geronimus determinant pencil, `s_0` is the carrier atom at
zero, and `R,K` are the mixed positive-axis Vandermonde quantities defined
below.  The coefficient in (0.5) is exactly one.  No unspecified constant
or asymptotic comparison is hidden in it.

The note also gives Andreief integral formulas and expansions

\[
 R=\sum_{k=0}^N(-\lambda)^kR_k,
 \qquad
 K=\sum_{k=0}^{N-1}(-\lambda)^kK_k,               \tag{0.6}
\]

where every `R_k` and `K_k` is nonnegative.  Thus (0.5) becomes one strict
inequality between two sums of nonnegative mixed zero--carrier
Vandermonde volumes.

None of these identities proves (0.5).  The checkpoint-1.54 half-grid
theorem controls one exterior row, while (0.6) couples up to `N` rows.  The
large low-row nullspace supplies favorable constrained vectors but has the
wrong minimax direction for the true odd ground.  A growing positive
evaluation-Gram family below has a simple odd ground and either sign in
(0.4), according to one freely chosen boundary mass.  It is a structural
family, not the zeta divisor.

This is a post-checkpoint-1.54 target pair.  The standard eight files are
unchanged.  It proves no finite gate, determinant convergence, unconditional
zero statement, RH, converse from RH, or de Bruijn--Newman bound.  The
formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Exactly the following three note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CRITICAL_SCALAR_FLOOR_TO_TRUE_GROUND_ROW_DELETION_BARRIER.md` | `3cf82e60d684f738e331ba5b4378ee7d0528bd47dd71c73bd551777750938ba4` |
| `tests/test_critical_scalar_floor_to_true_ground_row_deletion_barrier.py` | `0f4ca4642d750876a2216df0cec4f60704bc9cd977223d08b6796f89783437ba` |
| `notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md` | `29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157` |
| `tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py` | `c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6` |
| `notes/RH_ACTUAL_GROUND_CHRISTOFFEL_COMMUTATOR_RESPONSE_BARRIER.md` | `aa1186ccef2d81c6428973b6a9757846f00758ad14eb6607854beab5fcded272` |
| `tests/test_rh_actual_ground_christoffel_commutator_response_barrier.py` | `a86e9751e2fd2d3fb4076a72438dda37d3e6cde7e04a8a36075af2ef8f0c2c67` |

The checkpoint-1.54 pair supplies the actual low-row nullity, the wrong
minimax direction, and the sharp true-ground row-deletion target.  The
primitive pair supplies the exact carrier and zero measures and the odd
endpoint-zero primitive.  The response pair supplies the Geronimus
derivative and boundary-mass identity.  No external source, zero table,
numerical ordinate, source lock, artifact, or new source convention is
introduced.

## 2. The exact source cofactor and bordered determinant

Use normalized odd coordinates indexed by `1<=n<=N`.  Let

\[
 a=\begin{pmatrix}1&1/2&\cdots&1/N\end{pmatrix}^T,
 \qquad
 d=\begin{pmatrix}b_1&b_2/2^2&\cdots&b_N/N^2\end{pmatrix}^T.
                                                               \tag{2.1}
\]

Thus the first entry of `d` is `b_1`, and generally

\[
 a_n={1\over n},\qquad d_n={b_n\over n^2}.          \tag{2.2}
\]

Let `u` be a real unit odd ground.  Simplicity gives

\[
 M u=0,\qquad M\succeq0,\qquad
 \operatorname {rank}M=N-1.                       \tag{2.3}
\]

If the remaining odd eigenvalues are
`lambda_2,...,lambda_N`, then

\[
 \operatorname {adj}(M)
 =c_Mu u^T,\qquad
 c_M=\prod_{j=2}^N(\lambda_j-\lambda)>0.           \tag{2.4}
\]

Put

\[
 r=(a_0-\lambda)a-d.                              \tag{2.5}
\]

Let `f` be the dimensionless source primitive from the frozen response
calculation:

\[
 f=\sqrt2(a^Tu)e_0^+-\sum_{n=1}^N{u_n\over n}e_n^+.
                                                               \tag{2.6}
\]

Its exact endpoint-zero quadratic-form difference is

\[
 \langle f,(Q_+-\lambda I)f\rangle
 =2(a^Tu)(r^Tu).                                  \tag{2.7}
\]

The physical clamped primitive is `L/(2*pi)` times `f`, up to the frozen
fixed parity phase.  Its quadratic-form difference is therefore
`(L/(2*pi))^2` times (2.7), so the sign is identical.

Consequently

\[
 a^T\operatorname {adj}(M)r
 =c_M(a^Tu)(r^Tu),                                \tag{2.8}
\]

so (0.2) is exactly the strict favorable primitive sign.  The elementary
bordered determinant identity gives

\[
 \det\begin{pmatrix}0&a^T\\r&M\end{pmatrix}
 =-a^T\operatorname {adj}(M)r.                   \tag{2.9}
\]

This proves the equivalence of (0.2) and (0.3), including their
orientation.  Positivity of `adj(M)` does not sign a pairing of the two
different vectors `a` and `r`.

## 3. Christoffel--Geronimus determinant pencil

Put

\[
 x_n=\left({2\pi n\over L}\right)^2,\qquad
 D_N(y)=\prod_{n=1}^N(y-x_n).                     \tag{3.1}
\]

The even carrier functional is the positive atomic measure

\[
 d\sigma_e=s_0\delta_0+\sum_{n=1}^Ns_n\delta_{x_n},
                                                               \tag{3.2}
\]

with

\[
 \boxed{
 s_0={1\over D_N(0)^2},\qquad
 s_n={1\over2x_n^2D_N'(x_n)^2}.}                  \tag{3.3}
\]

Under RH the actual zero functional is

\[
 d\nu_e=\sum_{\gamma>0}v_\gamma\delta_{y_\gamma},
 \qquad y_\gamma=\gamma^2,                       \tag{3.4}
\]

\[
 \boxed{
 v_\gamma={8m_\gamma\sin^2(L\gamma/2)
  \over L\gamma^2D_N(\gamma^2)^2}.}              \tag{3.5}
\]

At a carrier collision (3.5) means its continuous limit.  All weights in
(3.2)--(3.5) are nonnegative.  There is no actual nontrivial-zero atom at
`y=0`.

For a real parameter `z`, define

\[
 \omega_z=\nu_e-z\sigma_e,                       \tag{3.6}
\]

and the `N by N` Hankel matrices

\[
 H_1(z)=\bigl(\omega_z(y^{i+j+1})\bigr)_{0\leq i,j<N},
 \qquad
 H_0(z)=\bigl(\omega_z(y^{i+j})\bigr)_{0\leq i,j<N}.
                                                               \tag{3.7}
\]

The Christoffel--Geronimus determinant is

\[
 \boxed{F(z,t)=\det\{H_1(z)+tH_0(z)\}.}           \tag{3.8}
\]

Its smallest real zero in `z` is the generalized ground

\[
 \lambda(t)=\min_{0\ne q\in\mathcal P_{N-1}}
 {\nu_e((y+t)q^2)\over\sigma_e((y+t)q^2)}.        \tag{3.9}
\]

At `t=0`, let the generalized eigenvalues be
`lambda=lambda_1<lambda_2<=...<=lambda_N`.  Since the carrier odd moment
matrix is positive definite,

\[
 F(z,0)=\det H_{\sigma,1}
         \prod_{j=1}^N(\lambda_j-z),              \tag{3.10}
\]

and hence

\[
 \boxed{
 F_z(\lambda,0)
 =-\det H_{\sigma,1}
   \prod_{j=2}^N(\lambda_j-\lambda)<0.}           \tag{3.11}
\]

Jacobi's formula, valid here without invertibility by the adjugate, gives

\[
 F_t(\lambda,0)
 =\operatorname {tr}\{
   \operatorname {adj}(H_1(\lambda))H_0(\lambda)\}. \tag{3.12}
\]

Implicit differentiation of `F(lambda(t),t)=0` gives

\[
 \lambda'(0)=-{F_t(\lambda,0)\over F_z(\lambda,0)}.
                                                               \tag{3.13}
\]

Because (3.11) is negative,

\[
 \boxed{
 \operatorname {sgn}\lambda'(0)
 =\operatorname {sgn}F_t(\lambda,0).}             \tag{3.14}
\]

If `p` spans the kernel of `H_1(lambda)`, the generalized
Hellmann--Feynman identity is

\[
 \lambda'(0)
 ={\omega_\lambda(p^2)\over\sigma_e(yp^2)}.       \tag{3.15}
\]

The monomial-to-source change of basis is invertible.  Equations
(2.7), (2.8), (3.12), and (3.15) therefore give the sign identity

\[
 \operatorname {sgn}F_t(\lambda,0)
 =\operatorname {sgn}\{a^T\operatorname {adj}(M)r\}.
                                                               \tag{3.16}
\]

This proves the equivalence of (0.2)--(0.4).  It is a derivative identity,
not a monotonicity theorem.

## 4. Exact separation of the carrier atom at zero

Remove only the carrier atom at zero and put

\[
 \omega_+=\nu_e-\lambda\sum_{n=1}^Ns_n\delta_{x_n}.
                                                               \tag{4.1}
\]

The factor `y` kills the zero atom, so

\[
 H_1(\lambda)
 =\bigl(\omega_+(y^{i+j+1})\bigr)_{0\leq i,j<N}.  \tag{4.2}
\]

For the unweighted matrix, however,

\[
 H_0(\lambda)=H_{0,+}-\lambda s_0e_0e_0^T,
 \qquad
 H_{0,+}=\bigl(\omega_+(y^{i+j})\bigr)_{0\leq i,j<N}.
                                                               \tag{4.3}
\]

Define

\[
 R=\operatorname {tr}\{
   \operatorname {adj}(H_1(\lambda))H_{0,+}\},
 \qquad
 K=\{\operatorname {adj}(H_1(\lambda))\}_{00}.    \tag{4.4}
\]

Substitution in (3.12) proves the exact constant-one identity

\[
 \boxed{F_t(\lambda,0)=R-\lambda s_0K.}           \tag{4.5}
\]

Therefore

\[
 \boxed{
 F_t(\lambda,0)<0
 \quad\Longleftrightarrow\quad
 R<\lambda s_0K.}                                 \tag{4.6}
\]

This is (0.5).  A quantitative sufficient form is

\[
 \lambda>0,\qquad K>0,\qquad
 R\leq(1-\varepsilon)\lambda s_0K
 \quad(0<\varepsilon<1).                          \tag{4.7}
\]

At a simple ground,

\[
 \operatorname {adj}(H_1(\lambda))=c_ppp^T,
 \qquad c_p>0,                                    \tag{4.8}
\]

where `p` is its coefficient vector.  Hence

\[
 K=c_pp(0)^2.                                     \tag{4.9}
\]

If `p(0)=0`, the frozen odd Euler equation gives
`omega_lambda(p^2)=0`; then `K=R=F_t(lambda,0)=0`.  Thus no strict sign can
be obtained by silently discarding the nonvanishing issue.

## 5. Andreief formulas

For `m>=1`, write

\[
 \Delta_m(y_1,\ldots,y_m)
 =\prod_{1\leq i<j\leq m}(y_j-y_i),               \tag{5.1}
\]

and let `e_j` be the elementary symmetric polynomial of degree `j`.
Andreief's determinant identity applied to (3.8) gives

\[
 F(\lambda,t)
 ={1\over N!}\int
   \Delta_N(y)^2\prod_{j=1}^N(y_j+t)
   \prod_{j=1}^Nd\omega_\lambda(y_j).             \tag{5.2}
\]

Differentiating this polynomial identity at zero and separating the atom
at zero reproduces (4.5).  The positive-axis term is

\[
 \boxed{
 R={1\over N!}\int_{(0,\infty)^N}
   \Delta_N(y)^2e_{N-1}(y)
   \prod_{j=1}^Nd\omega_+(y_j).}                  \tag{5.3}
\]

Exactly one zero coordinate survives in the origin-atom term.  Since

\[
 \Delta_N(0,y_1,\ldots,y_{N-1})^2
 =\Delta_{N-1}(y)^2\prod_{j=1}^{N-1}y_j^2,        \tag{5.4}
\]

and

\[
 e_{N-1}(0,y_1,\ldots,y_{N-1})
 =\prod_{j=1}^{N-1}y_j,                           \tag{5.5}
\]

one obtains

\[
 \boxed{
 K={1\over(N-1)!}\int_{(0,\infty)^{N-1}}
   \Delta_{N-1}(y)^2\prod_{j=1}^{N-1}y_j^3
   \prod_{j=1}^{N-1}d\omega_+(y_j).}             \tag{5.6}
\]

The convention for `N=1` is that the empty integral in (5.6) equals one.
Equations (5.3) and (5.6) are signed integrals because `omega_+` is signed.
The fact that `K>=0` comes from the positive-semidefinite rank-`N-1`
matrix in (4.2), not from termwise positivity of (5.6).

For the discrete measures here, (5.2)--(5.6) follow first for finite zero
truncations.  The frozen moment convergence then passes to the full
functional.  Repeated atoms cause no ambiguity because the Vandermonde
vanishes; carrier collisions may equivalently be combined before applying
the formulas.

## 6. Positive alternating expansions

Let

\[
 \nu=\nu_e\big|_{(0,\infty)},
 \qquad
 \sigma_+=\sum_{n=1}^Ns_n\delta_{x_n}.            \tag{6.1}
\]

The relevant strict-parity branch has `lambda>0` by the frozen primitive
record; if `lambda=0`, strict even-below-odd parity is already impossible.
Thus every unsigned factor `lambda^k` used below is nonnegative.

For `0<=k<=N`, define

\[
\begin{aligned}
 R_k={1\over k!(N-k)!}
 \int &\Delta_N(z)^2e_{N-1}(z)\\
 &\mathrel{}\times
 \prod_{i=1}^kd\sigma_+(z_i)
 \prod_{i=k+1}^Nd\nu(z_i).
\end{aligned}                                     \tag{6.2}
\]

For `0<=k<=N-1`, define

\[
\begin{aligned}
 K_k={1\over k!(N-1-k)!}
 \int &\Delta_{N-1}(z)^2\prod_{j=1}^{N-1}z_j^3\\
 &\mathrel{}\times
 \prod_{i=1}^kd\sigma_+(z_i)
 \prod_{i=k+1}^{N-1}d\nu(z_i).
\end{aligned}                                     \tag{6.3}
\]

The integrands and both measures in (6.2)--(6.3) are nonnegative, so

\[
 \boxed{R_k\geq0,\qquad K_k\geq0.}                \tag{6.4}
\]

Expanding every factor `d omega_+=d nu-lambda d sigma_+` gives the exact
identities

\[
 \boxed{
 R=\sum_{k=0}^N(-\lambda)^kR_k,
 \qquad
 K=\sum_{k=0}^{N-1}(-\lambda)^kK_k.}              \tag{6.5}
\]

Put

\[
 R_{\rm ev}=\sum_{\substack{0\leq k\leq N\\k\ \mathrm{even}}}
                 \lambda^kR_k,
 \qquad
 R_{\rm odd}=\sum_{\substack{0\leq k\leq N\\k\ \mathrm{odd}}}
                 \lambda^kR_k,                   \tag{6.6}
\]

and define `K_ev,K_odd` in the same way through `N-1`.  Then the target
(4.6) is the all-positive comparison

\[
 \boxed{
 R_{\rm ev}+\lambda s_0K_{\rm odd}
 <R_{\rm odd}+\lambda s_0K_{\rm ev}.}             \tag{6.7}
\]

Thus separate positivity of the zero and carrier measures is not enough:
the missing assertion compares the two parities of the number of carrier
atoms in a global Vandermonde expansion.

## 7. Why the half-grid and low-row nullspace do not sign (6.7)

At the exact checkpoint-1.54 half-grid schedule, write `h'=2*pi/L'` and
`N'=m-1`.  The selected same zero satisfies

\[
 \gamma=\left(N'+{1\over2}\right)h'+O((L')^{-2}). \tag{7.1}
\]

It is therefore above the last carrier `N'h'` for all sufficiently large
heights.  Its single Cauchy row is exterior and has no carrier small
divisor.  This is exactly what the frozen scalar transfer needs.

The quantities in (6.2)--(6.3), however, use `N`- and `(N-1)`-tuples from
the complete zero and carrier measures.  One exterior row does not orient
the parity balance in (6.7).  In particular, no continuity of the finite
ground follows from stability of the one tangent row.

The checkpoint-1.54 Riemann--von Mangoldt calculation gives

\[
 \dim\ker\mathcal E^-_{\leq\Omega_N}
 \geq(1-\log D){N\over L}+O_D(L)=\Theta_D(e^L).    \tag{7.2}
\]

Every nonzero vector in this nullspace has a favorable high-row primitive
comparison.  But its constrained minimum is at least the unrestricted odd
ground:

\[
 \lambda_-^{>T}\geq\lambda_-.                    \tag{7.3}
\]

Thus nullspace localization proves comparison with the wrong floor.  The
correct sufficient route remains the frozen relative row-deletion estimate,
or equivalently the ground-dependent scalar (4.6).  Riemann--von Mangoldt
does not estimate either side of (6.7).

## 8. A growing positive evaluation-Gram sign family

The free Geronimus mass is not a finite-dimensional accident.  Fix any
`N>=2`, distinct positive carrier nodes `x_1,...,x_N`, and positive weights
`s_0,s_1,...,s_N`.  Put

\[
 \sigma=s_0\delta_0+\sum_{n=1}^Ns_n\delta_{x_n}.  \tag{8.1}
\]

Choose distinct positive nodes `r_1,...,r_(N-1)` and positive `w_j`, and
let

\[
 \rho=\sum_{j=1}^{N-1}w_j\delta_{r_j},
 \qquad
 p(y)=\prod_{j=1}^{N-1}(y-r_j).                   \tag{8.2}
\]

For any real `xi>-s_0`, define the positive measure

\[
 \nu_\xi=\sigma+\xi\delta_0
          +\sum_{j=1}^{N-1}{w_j\over r_j}\delta_{r_j}.
                                                               \tag{8.3}
\]

The coefficient of `delta_0` in (8.3) is `s_0+xi>0`, so both `sigma` and
`nu_xi` are positive.  At `lambda=1`,

\[
 \omega_\xi=\nu_\xi-\sigma
 =\xi\delta_0+\sum_{j=1}^{N-1}{w_j\over r_j}\delta_{r_j},
                                                               \tag{8.4}
\]

and hence

\[
 y\,d\omega_\xi=d\rho.                           \tag{8.5}
\]

The carrier matrix `H_(sigma,1)` is positive definite because its
`N by N` Vandermonde matrix on the `x_n` is invertible.  The difference
matrix at `lambda=1` is the positive rank-`N-1` moment matrix of `rho`.
Its kernel is exactly `p`.  Therefore `lambda=1` is a simple smallest
generalized odd eigenvalue for every `xi>-s_0`.

On this ground,

\[
 \omega_\xi(p^2)=\xi p(0)^2,                     \tag{8.6}
\]

and consequently

\[
 \boxed{
 \operatorname {sgn}F_t(1,0)=\operatorname {sgn}\xi.} \tag{8.7}
\]

The family grows with `N` and consists of positive polynomial evaluation
Grams.  After the standard rational basis change, its positive atoms give
paired real evaluation rows and the usual source-Cauchy displacement.  It
shows that positivity, simplicity, reflection, and the Christoffel relation
do not determine the sign.

This family is not the zeta divisor.  It includes a freely adjustable atom
at zero, arbitrary positive weights, and no Euler-product or
Riemann--von Mangoldt constraint.  It proves a structural nonimplication,
not failure of (6.7) for the actual arithmetic matrix.

## 9. Minimal new arithmetic statement and stopping line

The weakest exact target isolated here is any one of the equivalent strict
statements

\[
 a^T\operatorname {adj}(M)\{(a_0-\lambda)a-d\}<0,
 \qquad
 F_t(\lambda,0)<0,
 \qquad
 R<\lambda s_0K.                                  \tag{9.1}
\]

For a proof with a stable margin, (4.7) is sufficient.  Formula (6.7)
makes clear what a direct arithmetic proof must control: an alternating
mixed determinant of actual zero atoms and exact carrier atoms.  An
unweighted zero count, one selected row, separate Hankel positivity, or a
Sturm theorem for `H_1` alone cannot supply the missing Geronimus mass.

Any downstream use must reject an argument which

1. changes the strict coefficient one in (4.6);
2. treats the signed integrals (5.3) or (5.6) as termwise positive;
3. drops the alternating carrier parity in (6.5)--(6.7);
4. infers the true-ground sign from the one half-grid exterior row;
5. reverses the minimax inequality (7.3);
6. identifies the family in Section 8 with the actual zeta divisor; or
7. infers a finite gate, determinant limit, unconditional zero statement,
   RH, converse from RH, or de Bruijn--Newman bound.

The terminal conclusion is an exact target and a structural no-go, not the
target estimate itself.  All unresolved checkpoint-1.54 finite gates remain
open, and the formal state remains `P0_INVALIDATED`.
