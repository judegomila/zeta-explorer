# Summary of changes for run e1899e60-18c0-43a1-bbdf-6424a1af4626
Formalized `job10_permutation_defect.tex` in Lean 4 / Mathlib. The whole development builds cleanly with no `sorry`, no added axioms, and no linter warnings; the main theorems depend only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

**Files added** (all under `RequestProject/`, imported by `Main.lean`):

- `Inversions.lean` — inversion pairs of a list relative to the descending order (`PermDefect.invs`), with the membership characterisation via two-element sublists, the key bubble-sort step (`invs_swap`: transposing an adjacent out-of-order pair removes exactly one inversion), duplicate-freeness, and the extraction of an adjacent out-of-order pair from an unsorted list.
- `ListDefect.lean` — the analytic core in an arbitrary normed ring `A` with `‖1‖ ≤ 1`: submultiplicativity for ordered products, Lemma 1 in list form (`norm_swap_sub_le`), the main telescoping bound `norm_prod_sub_prod_le`, and the inductive relation `SwapChain` with Lemma 2 in list form (`exists_swapChain`).
- `PermDefect.lean` — the permutation-level packaging: `permProd T π = T (π (m-1)) ⋯ T (π 0)` (so `permProd T 1 = T (m-1) ⋯ T 0`), the inversion set `invSet π = {(i,j) : i < j ∧ π⁻¹ j < π⁻¹ i}`, the bridge between list inversions and `invSet`, Lemma 2 for permutations (`exists_swapChain_permWord`), and Theorems 3 and 4 for normed rings.
- `HilbertDefect.lean` — the requested packaging for bounded operators on a complex Hilbert space `H`:
  * Lemma 1: `‖P (XY) Q − P (YX) Q‖ ≤ ‖P‖ ‖[X,Y]‖ ‖Q‖`, plus the contraction corollary `≤ ‖[X,Y]‖`;
  * Theorem 3 (the target, eq. (6)): for contractions, `‖T_π − T_id‖ ≤ Σ_{(i,j) ∈ Inv(π)} ‖[T i, T j]‖`, with `m` and `π` universally quantified and the norm the operator norm;
  * Theorem 4: without the contraction hypothesis, `‖T_π − T_id‖ ≤ Σ_{(i,j) ∈ Inv(π)} ‖[T i, T j]‖ · Π_{k ≠ i,j} ‖T k‖`;
  * machine-checked sanity checks of the conventions (e.g. `permProd T 1 = T 2 * T 1 * T 0` and `invSet (swap 0 1) = {(0,1)}` for `m = 3`).

Faithfulness notes: indices are 0-based (`Fin m`), with `T_{π(0)}` rightmost, matching the source's convention; Lemma 2's "indexed bijectively by Inv(π)" is rendered as "the list of swapped pairs is duplicate-free, its underlying finite set is `invSet π`, and its length is `#Inv(π)`". Completeness of `H` is assumed in Theorems 3 and 4 because the source speaks of a Hilbert space, though the proofs only use submultiplicativity of the operator norm together with `‖1‖ ≤ 1` — this is recorded in the docstrings, and the general normed-ring versions are provided as well.