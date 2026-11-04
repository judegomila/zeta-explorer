# Actual selected relative-column delocalization

Frozen research package, 2026-11-04.

**Main result:** The actual selected inverse-Gram column in either natural Pollaczek parity hierarchy cannot have uniformly stretched-exponentially decaying entries after its own diagonal is normalized to one. This remains impossible even if the bound includes a quasi-polynomial prefactor exp[C log²(n+2)]. No separate assumption about bounded leverage or a uniform Riesz basis is needed.

The new actual-theta input is a fixed-row estimate:

    |X(t²e_j,q)| ≤ C_q exp(−c_q j^(1/3))

for each fixed polynomial q and the source-normalized natural basis e_j. It follows from the exact theta-convolution generating function and controlled complex sectors, yielding Gevrey-3 boundary regularity.

The actual selected coefficient column has total Euclidean norm at most exp[O(log²n)] by the existing all-polynomial source/reference comparison. Splitting its exact synthesis into low and high natural degrees then shows that a localized column would force a stretched-exponentially small selected multiplication row. The previously proved simple-real-zero resonance forbids that row estimate.

Consequences are genuinely about the selected column:

- Neither absolute nor relative coefficient heads through roughly n^δ/2, for any fixed δ>0, can have an eventual stretched-exponential bound in n.
- A head containing O(log^6 n) natural modes cannot be uniformly smaller than an appropriate exp[−B log²n] scale. This is a subsequence obstruction, not a lower bound at every degree.
- The diagonal-normalized inverse-Gram column cannot obey K exp[C log²(n+2)−γ(n−j)^α] for fixed positive γ,α.

Files:

- `FIXED_ROW_STRETCHED_EXPONENTIAL.md`: theta-convolution, complex-sector, and Gevrey coefficient proof.
- `DIRECT_HEAD_AND_RELATIVE_COLUMN_OBSTRUCTION.md`: exact selected synthesis split and relative-column/head consequences.
- `INDEPENDENT_ANALYTIC_AUDIT.md`: separate audit of the convolution, sectors, normalization, and selected transfer.
- `SHA256SUMS`: hashes of the four payload files.

Dependencies: the frozen actual-source comparisons in `theta_pollaczek_trial_20261104` (including `NATURAL_GAMMA_REFERENCE.md`) and the selected resonance proof in `theta_selected_column_locality_20261104/NO_FAST_SELECTED_MULTIPLICATION_TAIL.md`.

This strengthens the earlier absolute uniform-column obstruction and uses no matrix inverse-decay lemma. It does not imply a uniform two-index Gram bound. It rules out the stated strong localization mechanism, not weaker localization, relative near-optimality by itself, or other cancellation-sensitive mechanisms. Selected derivative coherence, all-degree bridge positivity, and RH remain unresolved. No scans or live 4CT edits are involved.
