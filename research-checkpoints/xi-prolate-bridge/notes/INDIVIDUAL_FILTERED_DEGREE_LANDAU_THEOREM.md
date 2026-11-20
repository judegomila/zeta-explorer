# Individual filtered-degree Landau theorem

## 0. Exact outcome and claim boundary

For a fixed vertex `k>=1`, put `kappa=2*pi*k` and define the exact
fourth-order filtered screw

\[
 Y_k(L)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha L)-1\}\over\alpha^2}
 {\alpha^4\over\{\alpha^2+(\kappa/L)^2\}^2}.       \tag{0.1}
\]

Suppose the centered-zero right edge is

\[
 0<B=\sup_{\alpha\in Z_+}\Re\alpha\leq1/2.        \tag{0.2}
\]

The edge need not be attained.  For every fixed `k>=1` and every fixed
`0<b<B`, the filtered signal satisfies

\[
 \boxed{\limsup_{L\to\infty}e^{-bL}Y_k(L)=+\infty.} \tag{0.3}
\]

The divergent positive values transfer to the strict-half-integer natural
grid.  On a sequence which may depend on `k` and `b`, the exact degree then
obeys

\[
 \boxed{d_k(L)>0}                                  \tag{0.4}
\]

eventually, without an absolute `A_4` hypothesis.

The scope is deliberately scalar.  Equation (0.3) gives no sign for
`Psi(L)` or `d_0(L)` on the same sequence, and the sequences obtained for
two different vertices need not agree.  In particular this note proves
neither `{d_0,d_k}>0` on one sequence nor simultaneous positivity of a
fixed prefix.  The independently frozen high-edge record theorem gives a
simultaneous prefix only under its explicit lower bound on `B`; the general
arbitrary-edge synchronization problem remains open.

No RH statement, graph routing, degree-ratio limit, Lambda bound, or
equation (5.2) of `DIRECT_RH_ATTACK.md` is proved.  The formal project state
remains `P0_INVALIDATED`.

## 1. Frozen dependencies and the exact filter

The proof is bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md` | `ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c` |
| `notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` | `baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |

Write

\[
 \Psi(L)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha L)-1\}\over\alpha^2}.           \tag{1.1}
\]

There is a qualitative `gamma_0>0` such that every centered zero has
`|Im(alpha)|>=gamma_0`, and

\[
 \sum_{\alpha\in Z_+}|\alpha|^{-2}<\infty.         \tag{1.2}
\]

For fixed `L` put `q=(kappa/L)^2`.  If `T_q` denotes the causal zero-data
inverse of `D^2+q`, then the exact signed calculation in the frozen
fourth-moment note gives

\[
 \Phi_q=(I-qT_q)^2,
 \qquad Y_k(L)=\Phi_q\Psi(L),                      \tag{1.3}
\]

because its per-zero multiplier is

\[
 1-q{2\alpha^2+q\over(\alpha^2+q)^2}
 ={\alpha^4\over(\alpha^2+q)^2}.                  \tag{1.4}
\]

The dependence `q=kappa^2/L^2` is retained throughout.  The Laplace
argument below is applied directly to the one-variable function (0.1),
not to a fixed-`q` surrogate.

## 2. Uniform large-`L` expansion

Choose `T` so large that

\[
 {\kappa^2\over T^2\gamma_0^2}< {1\over4}.        \tag{2.1}
\]

For `m>=0`, define the higher screws

\[
 F_m(L)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha L)-1\}\over\alpha^{2m+2}}.      \tag{2.2}
\]

The binomial expansion is then uniform in every zero and every `L>=T`:

\[
 \boxed{
 Y_k(L)=\sum_{m=0}^{\infty}(-1)^m(m+1)\kappa^{2m}
 L^{-2m}F_m(L).}                                  \tag{2.3}
\]

Indeed, (2.3) is just
`(1+kappa^2/(L^2*alpha^2))^(-2)`, and (1.2) supplies an
absolute common majorant after the fixed exponential `e^(B*L)` is removed.

Let

\[
 X(s)=\xi_R(1/2+s),
 \qquad \mu_j=\sum_{\alpha\in Z_+}\alpha^{-2j}\quad(j\geq1). \tag{2.4}
\]

For `Re(s)>1/2`, termwise Laplace integration gives

\[
 \begin{aligned}
 G_m(s):={\cal L}F_m(s)
 &= {2\over s}\sum_{\alpha\in Z_+}
 {\alpha^{-2m}\over s^2-\alpha^2}\\
 &=s^{-2m-2}{X'(s)\over X(s)}
 +{2\over s}\sum_{j=1}^m
       \mu_j s^{-2(m-j+1)}.                       \tag{2.5}
 \end{aligned}
\]

The second line follows from

\[
 {\alpha^{-2m}\over s^2-\alpha^2}
 ={s^{-2m}\over s^2-\alpha^2}
 +\sum_{j=1}^m s^{-2(m-j+1)}\alpha^{-2j}.         \tag{2.6}
\]

Formula (2.5) is meromorphic away from zero, with poles only at the actual
centered zeros.

## 3. Tail cutoff and holomorphy on the positive real axis

The factors `L^(-2m)` in (2.3) are used only on `[T,infinity)`.  Put

\[
 G_{m,T}(s)=G_m(s)-\int_0^Te^{-sL}F_m(L)\,dL.      \tag{3.1}
\]

The subtracted compact integral is entire.  For `m>=1`, repeated Tonelli
integration in the initial half-plane gives the exact identity

\[
 \boxed{
 Q_{m,T}(s):=\int_T^\infty e^{-sL}L^{-2m}F_m(L)\,dL
 ={1\over(2m-1)!}\int_0^\infty
 v^{2m-1}G_{m,T}(s+v)\,dv.}                       \tag{3.2}
\]

The elementary kernel behind (3.2) is

\[
 {1\over(2m-1)!}\int_0^\infty v^{2m-1}e^{-vL}\,dv
 =L^{-2m}.                                        \tag{3.3}
\]

Fix a positive real `sigma`.  In a sufficiently small complex
neighborhood of `sigma`, every ray `s+[0,infinity)` stays in the strip
`|Im(s)|<gamma_0/2`, and therefore meets no centered zero.  Equations
(3.1)--(3.2) continue `Q_(m,T)` holomorphically to that neighborhood.

The infinite sum over `m` is locally normal there.  On compact initial
pieces of the ray, the first line of (2.5) gives directly

\[
 |G_m(s)|\leq C_\sigma\sum_\alpha|\alpha|^{-2m-2}
 \leq C_\sigma\gamma_0^{-2m}\sum_\alpha|\alpha|^{-2}. \tag{3.4}
\]

On the remaining ray, the tail integral defining `G_(m,T)` contributes an
additional `e^(-Tv)`.  The `v` integral in (3.2) then contributes
`T^(-2m)`.  Together with (2.1), these bounds make

\[
 \sum_{m\geq1}(-1)^m(m+1)\kappa^{2m}Q_{m,T}(s)    \tag{3.5}
\]

normally convergent.  Consequently the tail Laplace transform of `Y_k` is

\[
 G_{0,T}(s)+\sum_{m\geq1}(-1)^m(m+1)\kappa^{2m}Q_{m,T}(s), \tag{3.6}
\]

and is holomorphic at every positive real `s`.

## 4. Every right-zero pole survives the filter

The horizontal-ray formula (3.2) was used only to establish holomorphy near
the positive real axis.  Near a nonreal zero, continue `Q_(m,T)` along any
path which bypasses the discrete set consisting of zero and the centered
zeros.  Such paths exist because that set is discrete.  On every resulting
local branch, ordinary Laplace differentiation continued from the initial
half-plane gives

\[
 Q_{m,T}^{(2m)}(s)=G_{m,T}(s).                    \tag{4.0}
\]

Thus no claim is made that a literal horizontal ray through a zero avoids
all other zeros at the same ordinate.

Let `alpha_*` be an actual centered zero, counted with multiplicity `r`.
The `m=0` term in (3.6) has principal part

\[
 {r\over\alpha_*^2(s-\alpha_*)}.                  \tag{4.1}
\]

No divided higher-screw term can cancel it.  The residue of the right side
of (4.0) at `alpha_*` is
`r*alpha_*^(-2m-2)`.  Hence the only nonholomorphic local term introduced
by `Q_(m,T)`, for `m>=1`, has the form

\[
 c_m(s-\alpha_*)^{2m-1}\log(s-\alpha_*),          \tag{4.3}
\]

plus a holomorphic function.  It is bounded at `alpha_*`.  The same normal
convergence estimate as in Section 3, now on a small slit neighborhood,
shows that the complete `m>=1` correction stays bounded.  Thus the simple
pole (4.1) is nonremovable.

This is the key point: division by `L^2` integrates a zero pole twice and
softens it to a bounded logarithmic branch, whereas the undivided `m=0`
term retains the pole.

## 5. Direct Landau theorem and grid transfer

### Theorem 5.1 (scalar filtered Landau peak)

For every fixed `k>=1` and `0<b<B`, equation (0.3) holds.

**Proof.**  For `L>=T`, the multiplier in (0.1) is uniformly bounded.
Equations (0.1)--(0.2) and (1.2) therefore give

\[
 |Y_k(L)|\leq C_ke^{BL}.                           \tag{5.1}
\]

Suppose instead that the limsup in (0.3) were finite.  For suitable `C`
and a larger `T`, the function

\[
 h(L)=Ce^{bL}-Y_k(L)\geq0\qquad(L\geq T)           \tag{5.2}
\]

would be nonnegative.  Its tail Laplace transform has a finite abscissa
`sigma_c<=B`.  Choose a centered zero with real part greater than `b`, and
then choose `alpha_*=beta_*+i*gamma_*` rightmost among the finitely many
zeros at that same ordinate.  This preserves `beta_*>b` and ensures that
the horizontal continuation immediately to the right of `alpha_*` meets
no second zero at the same ordinate.  Section 4 forces
`sigma_c>=beta_*`; otherwise the defining transform would be holomorphic
at `alpha_*` and remove the pole (4.1).  Hence

\[
 b<\beta_*\leq\sigma_c\leq B.                     \tag{5.3}
\]

At the positive real point `sigma_c`, the comparator pole at `b` is absent,
and Section 3 makes the filtered transform holomorphic.  Equivalently,
`X(sigma_c)` is nonzero because `xi_R` has no positive real centered zero.
This contradicts the Landau singularity theorem for an eventually
nonnegative Laplace transform.  \(\square\)

The peaks transfer to the natural grid.  Write `D_k=Y_k-Psi`.  From the
exact multiplier difference in (1.4), termwise absolute differentiation is
now permitted and gives

\[
 |D_k'(L)|\leq C_kL^{-2}e^{BL}
 \sum_\alpha|\alpha|^{-3}
 +C_kL^{-3}e^{BL}\sum_\alpha|\alpha|^{-4}.         \tag{5.4}
\]

The undifferenced `Psi` derivative has the pinned PNT bound.  A nearest
strict-half-integer natural-grid point satisfies

\[
 |L_{\rm grid}-L|=O(e^{-L/2}).                     \tag{5.5}
\]

If `B<1/2`, the first term in (5.4), multiplied by (5.5), decays
exponentially.  At the endpoint `B=1/2` it is still `O_k(L^(-2))`; the
second term is smaller, and the pinned PNT bound handles `Psi`.  Thus the
grid displacement changes `Y_k` by `o(1)` throughout `0<B<=1/2`.
Rounding a sequence of divergent normalized peaks from (0.3) therefore
preserves

\[
 e^{-bL_{\rm grid}}Y_k(L_{\rm grid})\longrightarrow+\infty. \tag{5.6}
\]

## 6. Individual degree positivity

Fix one `0<b_0<b`.  Split the centered zeros at `Re(alpha)=b_0`.  The
exact high-zero identity in the frozen fourth-moment note, together with
the Gaussian-small finite-anchor residual, gives

\[
 {\cal M}_k
 =-p_kq(2T_q-qT_q^2)\Psi_>(L)
  +{\cal H}_{k,>}(L)+{\cal M}_{k,<}(L),            \tag{6.1}
\]

where

\[
 {\cal H}_{k,>}=O_{k,b_0}(e^{-cL^2}),
 \qquad
 {\cal M}_{k,<}=O_{k,b_0}(L^{-3/2}e^{b_0L}).       \tag{6.2}
\]

The low screw obeys

\[
 q(2T_q-qT_q^2)\Psi_<(L)
 =O_{k,b_0}(L^{-1}e^{b_0L}).                       \tag{6.3}
\]

Using `|p_k|` asymptotic to a positive constant times `L^(-1/2)`, the
all-order bound for `J_L`, and `Y_k=Phi_q*Psi`, the exact degree identity
becomes

\[
 \boxed{
 d_k(L)={2p_k^2\over L}\left\{
 Y_k(L)+O_{k,b_0}(L^{-1}e^{b_0L})
 +O_{k,b_0}(\sqrt L e^{-cL^2})
 +O_{A,k}(L\lambda^{-A})\right\}.}                \tag{6.4}
\]

On the grid sequence in (5.6), every error in (6.4) is `o(Y_k(L))`.
This proves (0.4).

The conclusion is only `d_k>0` for the selected fixed `k`.  In particular,
the main screw `Psi` may be negative there, so (6.4) cannot be used to add
`d_0>0` to the conclusion.

## 7. Exact non-vectorization obstruction

Applying Theorem 5.1 separately to finitely many filtered signals does not
synchronize their peak times.  Even applying the same Landau argument to
every nonzero nonnegative linear combination does not repair this logical
gap.

For a concrete finite-dimensional obstruction, let a smooth real
two-vector follow successively longer plateaus

\[
 A_n(2,-1),\qquad A_n(-1,2),\qquad A_n\to\infty,   \tag{7.1}
\]

and connect them through the negative quadrant.  The path never enters the
strict positive quadrant.  Nevertheless, for every
`c_1,c_2>=0`, not both zero,

\[
 \max\{2c_1-c_2,-c_1+2c_2\}>0,                   \tag{7.2}
\]

so the scalar product with `(c_1,c_2)` is unbounded above on the plateaus.
This shows exactly why scalar Landau alternatives, even for all positive
dual directions, do not imply a simultaneous vector excursion.

In the actual filtered family the unresolved difference is not arbitrary:

\[
 Y_k(L)-Y_\ell(L)
 =\sum_\alpha {2\{\cosh(\alpha L)-1\}\over\alpha^2}
 \left[
 {\alpha^4\over\{\alpha^2+(2\pi k/L)^2\}^2}
 -{\alpha^4\over\{\alpha^2+(2\pi\ell/L)^2\}^2}
 \right].                                         \tag{7.3}
\]

Its leading size is an `L^(-2)` signed fourth-moment sum.  At cancellation
times, controlling (7.3) relatively is precisely the information discarded
by the absolute `A_4` gate.  The direct scalar continuation supplies no such
comparison.

Thus the surviving fail-closed task is a common-sequence theorem for
`Psi,Y_1,...,Y_K`, or a zeta-specific signed estimate for (7.3).  Neither is
proved here.
