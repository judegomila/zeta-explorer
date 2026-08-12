# Positive-sampling low-block forcing rate, conditional signed action, and full-metric barriers

## 0. Outcome and claim boundary

This note makes one positive conclusion and two exact no-go conclusions.
On the physical low range assembled from the singleton label-8 block and
the remaining plus-transition block, the existing defect-relative sampling
constants close the positive-sampling forcing factor at the scale required
by the determinant bridge.  An action estimate follows only under the
still-unproved uniform signed left-preconditioned hypothesis

\[
 \rho_L=\|\Delta_L^{-1}(B_L-\Delta_L)\|\leq\rho_0<1.       \tag{0.1}
\]

Nothing here proves (0.1).  In particular, this note does not prove an
actual residual-action estimate or equation (5.2) of `DIRECT_RH_ATTACK.md`.

Two rational one-parameter matrix families show why the conclusion cannot
be promoted.  First, the two block compressions of an exterior source Gram
do not control the quotient made from the full Gram.  Second, positive low
and high diagonal compressions of a signed operator do not control its
inverse action when their coupling is unknown.  Thus a full signed
comparison, including the physical high complement and all low/high
couplings in both parities, remains necessary.  No source lock, status,
replay, or integration file is changed.

## 1. Frozen dependencies

The deduction uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` | `b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` | `33f064c07a134986afa23efb91f7514e27828543b09cc358ebfff01e79c6f16e` |
| `notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` | `113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a` |
| `notes/PARITY_SHIFT_SCALE_AUDIT.md` | `dee08d1833047dea48a962d7b37738cc5eba0b48e9078ac90b103904b64091b0` |

## 2. Exact low-block forcing factor and conditional action

Retain the block-diagonal comparison metric and physical synthesis from the
split-block quotient theorem:

\[
 D_{\rm bd}=D_8\oplus D_R,
 \qquad W_L=[\,W_8\;W_R\,],
 \qquad K_L=\operatorname {ran}W_L.                         \tag{2.1}
\]

Put

\[
 A_i=W_iD_i^{-1/2},\qquad
 R_L=W_LD_{\rm bd}^{-1}W_L^*=A_8A_8^*+A_RA_R^*,            \tag{2.2}
\]

and define, only on `K_L`,

\[
 \Delta_L=R_L^\dagger|_{K_L},\qquad
 \Delta_L^{-1}=R_L.                                        \tag{2.3}
\]

Let `S` be the positive paired-zero sampling analysis and let

\[
 G_L=P_{K_L}S^*S|_{K_L}.                                  \tag{2.3a}
\]

The exact action constant is

\[
 \Gamma_L(\Delta_L)
 =\|\Delta_L^{-1}G_L\Delta_L^{-1}\|
 =\|S\Delta_L^{-1}\|^2.                                   \tag{2.4}
\]

**Theorem 2.1 (positive forcing; conditional action).**  With the metric
and sampling operator in (2.1)--(2.4), the locked positive-sampling and
remainder estimates imply the unconditional forcing bound (2.11).  The
signed inverse-action bound (2.12) follows only if the additional uniform
reserve (0.1) holds.  No inverse-action conclusion is asserted without
that signed comparison.

The growing-transition theorem gives

\[
 \|SA_8\|^2\leq C_8,
 \qquad \|SA_R\|^2\leq C_R,                               \tag{2.5}
\]

where

\[
 C_8=O(\lambda\operatorname {polylog}\lambda),\qquad
 C_R=O(\lambda^3\operatorname {polylog}\lambda).          \tag{2.6}
\]

With `M_i=||A_i||^2`, the split-block synthesis bounds and the pinned
fixed-index ratio give

\[
 M_8=O\!\left({\lambda^2\over d_8}\right),\qquad
 M_R=O\!\left({\lambda^{-2}\over d_8}\right).             \tag{2.6a}
\]

Consequently `C_8M_8=O(lambda^3 P(lambda)/d_8)` and
`C_RM_R=O(lambda P(lambda)/d_8)` after enlarging one fixed positive
polylogarithmic factor `P`.  The complete row-operator triangle inequality,
before squaring, retains the mixed sampling orientation and proves

\[
 \Gamma_L
 \leq\left(\sqrt{C_8M_8}+\sqrt{C_RM_R}\right)^2
 =O\!\left({\lambda^3P(\lambda)\over d_8}\right),         \tag{2.7}
\]

Thus there is no missing label-8/rest sampling cross term in this low-range
estimate.

Let `epsilon_lambda` be the complete radical sample-square remainder.  The
hybrid theorem proves

\[
 \epsilon_\lambda=o(d_6),                                  \tag{2.8}
\]

and the pinned fixed-index ratio is

\[
 {d_8\over d_6}\sim {32\pi^2\over7}\lambda^4.             \tag{2.9}
\]

If `c=ab` is the normalization-free residual forcing, then the positive
sequence Cauchy--Schwarz inequality gives
`cc^*<=epsilon_lambda S^*S`.  Thus, with `c_L=P_(K_L)c`, compression gives
`c_Lc_L^*<=epsilon_lambda G_L` and hence

\[
 \|\Delta_L^{-1}c_L\|^2
 \leq\epsilon_\lambda\Gamma_L
 =o\!\left(\lambda^{-1}P(\lambda)\right).                 \tag{2.10}
\]

Consequently

\[
 \boxed{
 \|\Delta_L^{-1}c_L\|
 =o\!\left(\lambda^{-1/2}P(\lambda)^{1/2}\right).}       \tag{2.11}
\]

This is the unconditional positive-sampling **forcing factor** on `K_L`.
If, in addition, (0.1) holds for an operator `B_L` on the same range, then
the exact left-close theorem gives only the conditional conclusion

\[
 \boxed{
 \|B_L^{-1}c_L\|
 \leq{\|\Delta_L^{-1}c_L\|\over1-\rho_0}
 =o\!\left(\lambda^{-1/2}P(\lambda)^{1/2}\right).}        \tag{2.12}
\]

The last little-`o` uses a uniform reserve `1-rho_0>0`.  If `K_L` does not
reduce the full signed operator, (2.12) is not a statement about the
low component of its full inverse.

## 3. Full exterior metric is not determined by its blocks

Fix a rational `0<delta<1`.  Take two one-dimensional source blocks, one
physical dimension, and

\[
 W=[\,1\;1\,],\qquad S=1,\qquad D_{\rm bd}=I_2.            \tag{3.1}
\]

Each block has `D_i=1`, sharp sampling constant `C_i=1`, and synthesis
constant `M_i=1`.  Hence

\[
 R_{\rm bd}=WD_{\rm bd}^{-1}W^*=2,
 \qquad\Delta_{\rm bd}={1\over2},
 \qquad\Gamma(\Delta_{\rm bd})=4.                         \tag{3.2}
\]

Now use the positive full source Gram

\[
 D_{\rm full}(\delta)
 =\delta I_2+(1-\delta)
 \begin{bmatrix}1\\-1\end{bmatrix}
 \begin{bmatrix}1&-1\end{bmatrix}
 =\begin{bmatrix}1&-(1-\delta)\\-(1-\delta)&1\end{bmatrix}.
                                                                    \tag{3.3}
\]

It has the same two diagonal compressions as `D_bd`, eigenvalues
`delta` and `2-delta`, and exactly the exterior form "positive diagonal
defects plus a shared anchor rank one."  But `[1,1]` is its `delta`
eigenvector, so

\[
 R_{\rm full}=WD_{\rm full}^{-1}W^*={2\over\delta},
 \qquad\Delta_{\rm full}={\delta\over2},
 \qquad\Gamma(\Delta_{\rm full})={4\over\delta^2}.        \tag{3.4}
\]

The full quotient action is unbounded as `delta` tends to zero although
every diagonal block and every one-block constant is unchanged.  Therefore
`C_8,C_R` and the two diagonal exterior compressions cannot assemble the
quotient associated with `D_full`.  The block theorem is valid precisely
because it uses `D_bd` consistently; a later signed theorem must compare
the signed operator with that same metric or prove a new full-metric bound.

## 4. Signed low/high coupling is an independent obstruction

On `K_L direct-sum K_H=R^2`, take the block metric `Delta=I_2` and, for the
same rational `0<delta<1`, put

\[
 B_\delta=
 \begin{bmatrix}1&1-\delta\\1-\delta&1\end{bmatrix},
 \qquad c=\begin{bmatrix}1\\-1\end{bmatrix}.             \tag{4.1}
\]

Both diagonal compressions of `B_delta` equal one.  The full eigenvalues
are `delta` and `2-delta`, so `B_delta>0`; nevertheless

\[
 B_\delta^{-1}c={1\over\delta}c.                          \tag{4.2}
\]

Thus the inverse action is unbounded while the low and high compression
floors remain fixed.  Equivalently,

\[
 \|\Delta^{-1}(B_\delta-\Delta)\|=1-\delta\longrightarrow1, \tag{4.3}
\]

so no uniform reserve in (0.1) follows from the two marginal floors.  If
the coupling `1-delta` is replaced by any number greater than one, both
diagonal compressions remain positive while the full matrix becomes
indefinite.

This family isolates the remaining logical gap after (2.11): a high
sampling scale and diagonal sector floors do not replace a full signed
left-close or Loewner comparison.  The physical high complement, its
sampling term, the odd negative pole, and every low/high signed coupling
remain outside the present positive-sampling theorem.

## 5. Final scope

The proved new statement is exactly (2.11), together with the conditional
implication (2.12).  The two counterfamilies prove that neither a full
exterior-metric quotient nor a full signed inverse action is determined by
the available block data.  No actual residual action, equation (5.2),
locally uniform determinant limit, RH statement, or Lambda bound follows.
