# RH-conditional fixed-zero selector capture theorem

## 0. Exact outcome and claim boundary

Put `L=2 log(lambda)` and take the polynomial Gevrey diagonal

\[
 N=\lceil\lambda L^3\rceil.                              \tag{0.1}
\]

Assume RH.  Also assume, without proving, that the finite actual Weil
matrix has a simple inversion-even ground value `mu`, a boundary-normalized
ground, and the strict shifted odd sign required by the checkpoint-1.35
regular-plus-shell selector theorem.  Let `gamma_0>0` be one fixed critical
ordinate, counted with multiplicity `m_0`, and put

\[
 r_0={\gamma_0L\over2\pi},\qquad
 n_L=\operatorname {nint}(r_0),\qquad
 |r_0-n_L|\leq {1\over2}.                            \tag{0.2}
\]

Then, for all sufficiently large `L`, some quotient selector radius
`rho_L` satisfies

\[
 \boxed{|\rho_L-n_L|\leq1,\qquad
 \left|{2\pi\rho_L\over L}-\gamma_0\right|
 \leq {3\pi\over L}.}                              \tag{0.3}
\]

The assertion is simultaneous for every fixed finite set of distinct
positive critical ordinates; their selector windows are eventually
disjoint.  The rigorous signs `Xi(13)>0` and `Xi(15)<0` already frozen at
checkpoint 1.33 give, by continuity, at least one ordinate
`gamma_0 in (13,15)`.  Thus (0.3) gives at least one selector radius in the
corresponding moving physical band, under the hypotheses above.

The proof is a comparison of two different positive atomic descriptions.
The RH zero Gram determines the actual source-row secant and odd diagonal.
The strict selector theorem says that if the quotient-selector window were
empty, that diagonal could not exceed the same secant.  A fixed zero nearest
its carrier contributes a positive defect of order `L`; all other distinct
fixed zero atoms contribute only `O(L^(-3))`.  The true ground shift is
`o(L)` on (0.1), so the checkpoint-1.35 secant contrapositive applies.

An exact carrier collision is a zero-Gram shell of weight `m_0 L`.  It must
not be inserted as the derivative of a rational atom whose numerator is
zero.  This separate shell branch is essential.

This is an RH-conditional fixed-zero theorem, not a proof of RH.  It does
not prove the actual simple-even ground or strict shifted signs on an
unbounded schedule.  It gives no estimate uniform in a growing zero set,
no zero enumeration, isolation, or simplicity statement, no determinant
convergence, no actual response bound, no actual sign failure, and no
de Bruijn--Newman `Lambda` conclusion.  The checkpoint-1.35 standard eight
are unchanged and the project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Only the following frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/Q0_FREE_SELECTOR_SECANT_ROOT_PARITY_THEOREM.md` | `7d61da7b191fa7f6c00cf83ec139b2cfeac6981b46fa6d2059c5c842aaf9ba22` |
| `tests/test_q0_free_selector_secant_root_parity_theorem.py` | `04b9f67ca9db40a01ae2b89e759a59083d538dcc3c1dc4598105ed1830d8acf6` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `tests/test_centered_zero_gram_simultaneous_vertex_subsequence.py` | `39ee34b725a27873143e140a3e4ba71489e8deb406eb73bbefde63ecb68fdc0d` |
| `notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` | `0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3` |
| `tests/test_odd_zero_gram_lower_frame_audit.py` | `b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |
| `tests/test_anchored_central_degree_screw_barrier.py` | `bba275f3a12e7d11e11100362f0afc55d11206d85a7e4479fea26d044fa4d014` |
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `tests/test_gevrey_prolate_remainder.py` | `93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058` |
| `notes/ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md` | `0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f` |
| `tests/test_actual_global_twisted_cone_moving_grid_target_incompatibility.py` | `91bda99e6b0db886a7551501ae2343705e4a2cb4632a687fe0f0d72287f031d6` |

The secant pair supplies the cone-free regular-plus-shell contrapositive.
The centered-zero and odd-Gram pairs supply the RH cosine moments and the
complete odd value Gram.  The screw pair identifies the actual source row.
The Gevrey pair supplies the small positive sampling Rayleigh value on
(0.1).  The moving-grid pair supplies only the two rigorous finite signs
and their elementary intermediate-value consequence.  No zero list or new
numerical artifact is used.

## 2. Actual row and odd diagonal as zero moments

Assume RH and write the distinct positive ordinates as `gamma`, with
algebraic multiplicities `m_gamma`.  Set

\[
 \Delta={2\pi\over L},\qquad a_n=n\Delta,\qquad
 \theta_\gamma=1-\cos(\gamma L),\qquad
 r_\gamma={\gamma\over\Delta}.                       \tag{2.1}
\]

The centered-zero cosine moment and the exact screw/source-row identity are

\[
 A_n=2\sum_{\gamma>0}m_\gamma
 {\theta_\gamma\over a_n^2-\gamma^2},\qquad
 b_n=-{2n\over L}A_n.                                \tag{2.2}
\]

Every resonant value is interpreted by continuity.  Define the regular
zero Stieltjes function by omitting exact carriers,

\[
 S_{Z,L}(x)={L\over2\pi^2}
 \sum_{\substack{\gamma>0\\r_\gamma\notin\mathbb Z}}
 {m_\gamma\theta_\gamma\over x-r_\gamma^2}.          \tag{2.3}
\]

An exact carrier has `theta_gamma=0` and contributes zero to every source
row value.  Consequently, at every positive lattice node,

\[
 \boxed{S_{Z,L}(n^2)=-{b_n\over2n}.}                 \tag{2.4}
\]

Let `e_n^-=(V_n-V_-n)/sqrt(2)`.  Source Cauchy displacement gives

\[
 \langle e_n^-,Qe_n^-\rangle=a_n^Q-{b_n\over n}.
                                                               \tag{2.5}
\]

On RH the complete odd compression is twice the positive-height zero
Gram.  Its diagonal is

\[
 a_n^Q-{b_n\over n}
 ={8a_n^2\over L}\sum_{\gamma>0}m_\gamma
 {\theta_\gamma\over(a_n^2-\gamma^2)^2},             \tag{2.6}
\]

again with carrier limits.  If `r_gamma=k` is an integer, its evaluation
row is supported only at `k`, and its contribution to (2.6) at `n=k` is
exactly `m_gamma L`.  Thus, with

\[
 \vartheta_{Z,n}=L\sum_{\substack{\gamma>0\\r_\gamma=n}}m_\gamma,
                                                               \tag{2.7}
\]

equations (2.3) and (2.6) give the shell-inclusive identity

\[
 \boxed{
 D_n^Q:=a_n^Q-{b_n\over n}
 =4n^2\{-S_{Z,L}'(n^2)\}+\vartheta_{Z,n}.}           \tag{2.8}
\]

The zero atoms in (2.3) are an infinite interpolation device for the
actual row and diagonal.  They are not the `N` quotient-selector atoms.
Only their common lattice data will be compared.

## 3. The exact one-zero secant defect

Put

\[
 C_n=n\{S_{Z,L}((n-1)^2)-S_{Z,L}((n+1)^2)\},
 \qquad E_n^Q=D_n^Q-C_n.                              \tag{3.1}
\]

For one regular ordinate `beta`, set `d=a_n^2-beta^2`.  Direct subtraction
of its derivative and endpoint secant contributions gives

\[
 E_{n,\beta}={8m_\beta a_n^2\theta_\beta\over L}
 \left\{{1\over d^2}
 -{1\over((a_n-\Delta)^2-\beta^2)
             ((a_n+\Delta)^2-\beta^2)}\right\}.      \tag{3.2}
\]

The denominator product in the second term is negative exactly when
`beta` lies strictly between `a_n-Delta` and `a_n+Delta`.  Such an atom has
`E_(n,beta)>0`.  An exterior regular atom has `E_(n,beta)<0`, because

\[
 d^2-\{((a_n-\Delta)^2-\beta^2)
          ((a_n+\Delta)^2-\beta^2)\}
 =\Delta^2\{2(a_n^2+\beta^2)-\Delta^2\}>0.          \tag{3.3}
\]

Now take `n=n_L` from (0.2) and write `delta=r_0-n`.  If `delta!=0`, the
`gamma_0` atom is regular and lies strictly inside the two-gap window.  Its
positive secant term may be discarded, while its diagonal term is

\[
 D_{n,\gamma_0}^Q
 ={4m_0L n^2\sin^2(\pi\delta)
   \over\pi^2\delta^2(2n+\delta)^2}.                 \tag{3.4}
\]

For `|delta|<=1/2`, concavity gives
`sin(pi*|delta|)>=2|delta|`.  Also, for `n>=1`,
`n^2/(2n+delta)^2>=4/25`.  Therefore

\[
 \boxed{E_{n,\gamma_0}\geq D_{n,\gamma_0}^Q
 \geq {64m_0\over25\pi^2}L.}                       \tag{3.5}
\]

If `delta=0`, the rational numerator and denominator in (3.4) both vanish.
The continuous zero-evaluation row instead gives the exact shell value

\[
 \boxed{E_{n,\gamma_0}=\vartheta_{Z,n}=m_0L.}        \tag{3.6}
\]

Equations (3.5)--(3.6) are uniform in the carrier phase.  No anti-carrier
subsequence is needed for one fixed ordinate.

## 4. All other zeros cost only `O(L^(-3))`

Fix `gamma_0`.  Discreteness of the centered zero set gives

\[
 g_0=\inf_{\substack{\beta>0\\\beta\ne\gamma_0}}
       |\beta^2-\gamma_0^2|>0.                       \tag{4.1}
\]

Repeated copies at `gamma_0` have already been included in `m_0`.  Since
`a_(n_L)->gamma_0` and `Delta->0`, every other distinct ordinate is outside
the closed carrier window for all sufficiently large `L`.  From
(3.2)--(3.3), its negative defect is bounded by a constant depending only
on `gamma_0` times

\[
 {\Delta^2\over L}\,m_\beta
 {1+\beta^2\over|\gamma_0^2-\beta^2|^4}.             \tag{4.2}
\]

The sum of (4.2) converges.  There are only finitely many nearby distinct
ordinates, while the tail is `O(m_beta*beta^(-6))`; the centered Hadamard
product gives `sum m_beta*beta^(-2)<infinity`.  Exact carrier shells away
from `n_L` contribute zero to both terms in (3.1).  Hence

\[
 \boxed{
 \sum_{\substack{\beta>0\\\beta\ne\gamma_0}}
 E_{n_L,\beta}\geq-{C_{\gamma_0}\over L^3}}
                                                               \tag{4.3}
\]

for one finite constant `C_(gamma_0)`.  Combining (3.5)--(3.6) and (4.3)
gives

\[
 \boxed{E_{n_L}^Q\geq c_0m_0L-{C_{\gamma_0}\over L^3},
 \qquad c_0={64\over25\pi^2}.}                      \tag{4.4}
\]

This estimate is fixed-zero, not uniform-zero.  Its constant depends on the
distance from `gamma_0` to the other distinct ordinates and on the convergent
weighted tail in (4.2).

## 5. The genuine ground shift is negligible

Under RH the finite Weil compression is positive semidefinite.  If
`kappa_N` is the normalized projected prolate state and
`q_N=<kappa_N,Qkappa_N>`, min--max and the exact paired-sampling identity
give

\[
 0\leq\mu\leq q_N={U_Z\over2}.                       \tag{5.1}
\]

On the polynomial diagonal (0.1), the frozen Gevrey theorem gives

\[
 U_Z=O\{\exp(-c\lambda L^2)\}=o(L)                  \tag{5.2}
\]

for some fixed `c>0`.  The shifted odd diagonal is

\[
 D_n=D_n^Q-\mu,                                      \tag{5.3}
\]

while the source row and its secant are unchanged.  Thus (4.4)--(5.2)
imply

\[
 \boxed{D_{n_L}-C_{n_L}=E_{n_L}^Q-\mu>0}            \tag{5.4}
\]

for all sufficiently large `L`.

Let `S_T` be the finite regular quotient-selector Stieltjes function.
The actual moment identity and (2.4) give

\[
 S_T(k^2)=S_{Z,L}(k^2)=-{b_k\over2k}                \tag{5.5}
\]

at every positive retained index.  If the quotient-selector window
`[(n_L-1)^2,(n_L+1)^2]` contained neither a regular root nor a shell, the
checkpoint-1.35 sharp secant theorem would give `D_(n_L)<=C_(n_L)`,
contradicting (5.4).  Therefore a quotient selector radius lies in
`[n_L-1,n_L+1]`.  Equation (0.3) follows from (0.2).

## 6. Finite simultaneous capture and the certified band

Let `Gamma={gamma_1,...,gamma_K}` be any fixed finite set of distinct
positive ordinates.  The constants in Section 4 may be maximized over this
finite set.  Moreover

\[
 |r_{\gamma_i}-r_{\gamma_j}|
 ={L\over2\pi}|\gamma_i-\gamma_j|\longrightarrow\infty
 \qquad(i\ne j).                                    \tag{6.1}
\]

Thus their radius windows are eventually disjoint, and Sections 3--5 give
`K` distinct quotient selector roots, one in each window.

The checkpoint-1.33 interval certificate proves only

\[
 \Xi(13)>0,\qquad\Xi(15)<0.                           \tag{6.2}
\]

Continuity supplies at least one fixed `gamma_0 in (13,15)`.  It does not
enumerate, isolate, or prove simplicity of that zero.  Applying the theorem
to this one ordinate and then taking `L` large enough in (0.3) puts the
captured selector frequency itself in `(13,15)`.

## 7. Exact stopping line

The fixed-zero proof does not extend uniformly to all ordinates below a
growing height.  Such an extension would require a quantitative lower
bound on distinct-zero spacing at the carrier scale and a uniform bound for
the weighted exterior sum in (4.2).  The pinned global zero count supplies
neither; carrier-compatible multisets with the same count are already known
to destroy uniform odd frames.

Any downstream use must reject a claimed pass if it

1. removes the RH hypothesis;
2. treats the actual simple-even ground or shifted strict signs as proved;
3. differentiates a zero-numerator rational atom at an exact carrier instead
   of using the shell value `m_gamma L`;
4. promotes fixed finite simultaneous capture to a growing-zero-uniform
   count or one-root-per-gap theorem;
5. substitutes the exponentially larger checkpoint locked cutoff for the
   polynomial Gevrey diagonal without a new sampling theorem;
6. turns (6.2) into zero enumeration, isolation, or simplicity; or
7. infers determinant convergence, an actual response estimate, RH, a
   converse, an actual-arithmetic sign failure, or a `Lambda` bound.

The surviving unconditional low-band problem is still a signed arithmetic
secant-defect estimate.  The present result only proves that the exact RH
zero Gram would supply that estimate around each fixed critical ordinate.
