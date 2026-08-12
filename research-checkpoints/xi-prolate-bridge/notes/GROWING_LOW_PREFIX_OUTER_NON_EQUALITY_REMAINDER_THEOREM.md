# Growing low-prefix outer non-equality remainder theorem

## 0. Result and exact scope

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

the same-phase labels

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\},                    \tag{0.2}
\]

and the standard finite Fejer weights

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+,
 \qquad H\geq1.                                     \tag{0.3}
\]

Let \(J_Q\) be the exact endpoint-sheared, full-exterior-white
isometry, so \(J_Q^*J_Q=I\).  With
\(\Phi=(2\sqrt2)^{-1}U\), define the complete compressed same-side
non-equality form

\[
\begin{split}
 {\cal S}^{\rm neq}_{H,Q}[z]
 ={}&-4\operatorname {Re}\sum_{q\geq2}{\Lambda(q)\over\sqrt q}
 \sum_{\substack{m,l\geq1\\m\ne ql}}
 \omega_H(m)\omega_H(l)\\
 &\hspace{18mm}\times
 \langle R_m\Phi J_Qz,V_qR_l\Phi J_Qz\rangle .
\end{split}                                          \tag{0.4}
\]

The coefficient in (0.4) is the Hermitian sum of both ordered
same-side orientations.  Equality means exactly \(m=ql\); it is not
part of this theorem.

Let \({\cal B}^{\rm prime}_{H,Q}\) be the sum of every same-side prime
self and cross term which contains the state-invisible origin bump.
It is extracted from the actual corrected same-side block before the
modal equality/non-equality split.  Thus the actual corrected
same-side prime block is exactly
\({\cal S}_{{\rm eq},H,Q}+{\cal S}^{\rm neq}_{H,Q}
+{\cal B}^{\rm prime}_{H,Q}\), with the first two terms modal.

Let \({\cal R}_{H,Q}^\#\) be the exact endpoint-compressed reflected
Stieltjes form of the frozen reflected theorem, formed from the actual
corrected outer profile, including its state-invisible origin bump and
the even pole.  Then, uniformly in finite cutoff,

\[
\boxed{
 {\cal S}^{\rm neq}_{H,Q}+{\cal B}^{\rm prime}_{H,Q}
 +{\cal R}_{H,Q}^\#
 =P_{+,H,Q}^\#+P_{{\rm cont},H,Q}^\#
  +K_{{\rm rec},H,Q}^\#+K_{{\rm sym},H,Q}^\#
  +E_{{\rm OT},H,Q}^\#,}                            \tag{0.5}
\]

where

\[
 P_{+,H,Q}^\#\succeq0,\qquad
 P_{{\rm cont},H,Q}^\#\succeq0,                    \tag{0.6}
\]

\[
 \|K_{{\rm rec},H,Q}^\#\|\leq C\log^2(Q+2),\qquad
 \|K_{{\rm sym},H,Q}^\#\|
       \leq C\sqrt Q\log^2(Q+2),                  \tag{0.7}
\]

and, for fixed \(B_0\) and \(\eta_0>0\),

\[
 \sup_{H\geq1}\|E_{{\rm OT},H,Q}^\#\|
 \leq C Q^{B_0}L^{B_0}c^{-\eta_0}+\rho_{\rm bump}(c),
 \qquad \rho_{\rm bump}(c)=o(1).                    \tag{0.8}
\]

After decreasing the fixed power of \(c\), the first term on the
right is at most \(CQ^{B_1}c^{-\eta_1}\) for some fixed
\(B_1,\eta_1>0\).

Consequently

\[
\boxed{
 \sup_{H\geq1}
 \|({\cal S}^{\rm neq}_{H,Q}+{\cal B}^{\rm prime}_{H,Q}
       +{\cal R}_{H,Q}^\#)_-\|
 \leq C\{\sqrt Q\log^2(Q+2)+\log^2(Q+2)
              +Q^{B_1}c^{-\eta_1}\}
       +\rho_{\rm bump}(c)=o(L).}                   \tag{0.9}
\]

The finite Fejer forms have an ordered limit \(H\to\infty\) at fixed
\(c,Q\), and (0.5)--(0.9) survive that limit.

This is precisely OT-REM: the complete same-side non-equality prime
fold plus the reflected Stieltjes block.  The centered Archimedean
multiplier and the exact equality block are deliberately excluded.
Thus this note does not by itself prove the full outer-only lower bound
or the low-prefix floor.

It also proves no physical high-complement theorem, determinant or zero
theorem, equation (5.2) of DIRECT_RH_ATTACK.md, or Riemann-hypothesis
conclusion.  The formal state remains P0_INVALIDATED, and the standard eight are unchanged.

## 1. Frozen inputs

The proof is an exact assembly of the following frozen component
theorems.  Their foundational hashes are repeated to make the complete
symbol and tail provenance explicit; no part of either component proof
is reproduced here.

| Dependency | SHA-256 |
|---|---|
| notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md | e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe |
| tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py | a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md | 173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc |
| tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py | 5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b |
| notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md | 1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce |
| tests/test_growing_low_prefix_complete_profile_fio_reduction.py | ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d |
| notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md | b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44 |
| tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py | 16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_SAME_SIDE_PRIME_REMAINDER_THEOREM.md | a0a44e3d0030691ab987379b5f60366aade7430a37bc55850a5e76068d270c9f |
| tests/test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem.py | dc899033544d4bbac75d4fcee0cb1ba50c40e57993f07d5a1b28e972968cae65 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md | 621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502 |
| tests/test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem.py | f56565c253c2278fd3cbd0023317d5646059169e657b2225611a32a9867fa1fa |

The same-side theorem proves

\[
 \sup_H\|{\cal S}^{\rm neq}_{H,Q}\|
 \leq C Q^B(c^{-1}+c^{-1/2})
       +C Q^3c^{-1/4}\log c.                       \tag{1.1}
\]

It retains both Fejer slots, both ordered orientations, every shifted
integration-by-parts boundary, and the \(m=1\) hard transition.  The
reflected theorem proves the exact positive decomposition and the
operator estimates (0.6)--(0.8), including the complete endpoint hard
row, the regular Jost cells, the unique physical quartic coalescence,
all-l reciprocal tails, and the logarithmic reflected tail.

## 2. Endpoint and origin ledger

In pure defect-white coordinates put

\[
 \epsilon_Q=\left({e_{4j}\over\sqrt {d_{4j}}}\right)_{j=0}^Q.
                                                               \tag{2.1}
\]

Each component theorem first extracts every actual common physical
endpoint row into

\[
 {\mathfrak I}_{\epsilon,H}
 =\{\epsilon_Qu_H^*+u_H\epsilon_Q^*
                    +\alpha_H\epsilon_Q\epsilon_Q^*\}.          \tag{2.2}
\]

Only then is the exact congruence applied:

\[
 \epsilon_Q^*J_Q=0,\qquad
 J_Q^*EJ_Q=0\quad(E\in{\mathfrak I}_{\epsilon,H}). \tag{2.3}
\]

No endpoint row is called small in pure coordinates.  A shifted lower
boundary such as \(R_mU(0)\) with \(m\geq2\) is not proportional to
\(\epsilon_Q\); it remains in the component theorem's quantitative
majorant.  Endpoint nullity also does not kill the derivative jet, and
an isolated \(B_2\) row is not treated as an independent positive block:
the full jet hierarchy is recombined before compression and estimation.

The repaired FIO reduction supplies the exact full-metric dual estimate

\[
 |f(0)|^2\leq {CL\over\lambda}D^\#(f).               \tag{2.4}
\]

Its sampled transform is uniformly Schwartz.  The Hilbert-space
Cauchy--Schwarz and Chebyshev argument in that reduction proves

\[
 \sup_H\|{\cal B}^{\rm prime}_{H,Q}\|
 \leq\rho_{\rm bump}(c),\qquad \rho_{\rm bump}(c)=o(1).           \tag{2.5}
\]

The reflected component separately uses the actual corrected profile:
its bump prime and logarithmic self and cross terms enter the reflected
remainder, while its bump continuous and pole terms remain inside the
exact positive operators.  Thus every origin term occurs exactly once
in (0.5).

## 3. Exact assembly and ordered limit

The reflected component gives

\[
 {\cal R}_{H,Q}^\#=P_{+,H,Q}^\#+P_{{\rm cont},H,Q}^\#
       +K_{{\rm rec},H,Q}^\#+K_{{\rm sym},H,Q}^\#
       +E_{{\rm refl},H,Q}^\#.                     \tag{3.1}
\]

Define

\[
 E_{{\rm OT},H,Q}^\#
 =E_{{\rm refl},H,Q}^\#+{\cal S}^{\rm neq}_{H,Q}
       +{\cal B}^{\rm prime}_{H,Q}.                  \tag{3.2}
\]

Equations (1.1), (2.5), (3.1), and the reflected remainder bound prove
(0.5)--(0.8).  This addition is exact: no scalar divisor mask, midpoint
row, equality row, or extra endpoint correction is inserted.

Both component theorems have \(H\)-independent summable majorants and
prove their ordered limits at fixed \(c,Q\).  Hence their sum has the
same ordered limit.  Finally, for Hermitian matrices,

\[
 \|(P+K+E)_-\|\leq\|K\|+\|E\|,
 \qquad P\succeq0.                                  \tag{3.3}
\]

Using (0.6)--(0.8) in (3.3) proves (0.9).  For
\(Q\leq C_0L\), each term there is \(o(L)\).

## 4. Reproduction

Run:

    python3 -B -m unittest tests.test_growing_low_prefix_outer_non_equality_remainder_theorem -v

The regression checks the two frozen component hashes, exact equality
exclusion, endpoint and origin allocation, positive reflected pieces,
sublinear frame ledger, ordered limit, fail-closed scope, ASCII hygiene,
and displayed TeX.
