# X = 161/10: a targeted eighth-power denominator repair

## Producer result and status boundary

The complete repaired producer gate is **PASS**: all 2,049 head/core pivots, all 72 coefficient-factor pivots, and all 72 whitened Schur pivots are rigorously positive at 1,000-bit working precision. Runtime was 200.3052704334259 seconds. Minimum remaining accuracies are 264, 954 and 263 bits, respectively. The smallest whitened pivot is approximately 0.2199241298; it is a diagnostic, **not** an eigenvalue lower bound or a claimed whole-space coercivity constant.

At this producer freeze, independent complete replay is requested. No new endpoint is accepted by this producer note alone. The independent acceptance receipt, if issued, must be separate from the historical X16.001 acceptance and X16.1 seventh-power failure. All of those artifacts remain unchanged.

## The failed route is preserved

At the same exact support X=161/10, the preceding seventh-power sufficient lower surrogate had a rigorously negative first whitened pivot, approximately −0.6746647533. Its actual core and coefficient H were positive. This was a failure of an overcharged sufficient Schur lower bound, **not** a negative vector of the actual supported Weil form.

The repair changes no support geometry, actual head entry, actual head–tail coupling, prime list, retained phase channel, moment value or far coefficient. It strengthens a proved whole-tail comparison. The finite sufficient test then passes. It does not reinterpret the earlier failed receipt as a successful one.

## Exact scalar improvement

The weighted positive-kernel Schur enumeration now applies to the eighth power of the entire supported prime-translation operator. It enumerates 2,409,206 exact rational path states at depth eight and 26,978 exact support breakpoints. Its interval norm bound is below 3.790592596, giving the rational envelope

    P_new = 3790593/1000000 = 3.790593.

The frozen seventh-power envelope was

    P_old = 3805113/1000000 = 3.805113.

Therefore the improvement is exactly

    Delta = P_old - P_new = 363/25000 = 0.014520.

The independent scalar/analytic clearance reproduced the entire eighth-power enumeration and verified its operator-norm implication. A scalar prime bound alone is still not whole-even positivity.

## Why the old far majorant remains valid

Use the already audited actual decomposition into the head k=0,...,2048 and its entire infinite even tail. At energy anchor zero the old tail comparison was

    D_actual >= diag(d_old,j) > 0.

Only the whole-prime norm allowance changes, so the stronger comparison is

    D_actual >= diag(d_new,j),
    d_new,j = d_old,j + Delta > 0

for every tail index, not merely sampled indices. The new uniform tail floor exceeds 0.7425026529.

In the near range 2049 <= j <= 16384, the repaired certificate uses the exact new inverse weights 1/d_new,j. The actual coupling row is unchanged. Every near self-energy charge is therefore smaller.

For all far indices j > 16384,

    1/d_new,j <= 1/d_old,j <= omega_old,j.

The final inequality is the already audited monotone step-profile bound, including its infinite plateau. Hence the **old all-head far majorant and old isotropic remainder are still conservative**. The implementation preserves the old 72-by-72 H object and old remainder unchanged. No unproved Loewner comparison between two newly assembled signed H matrices is used; no far phase is deleted; no moment cache is reused across incompatible supports.

The new far diagonal floor exceeds 2.8215170218; the old reference floor used when constructing the retained far H is approximately 2.8069970219. These are deliberately reported separately. A new larger floor must not be represented as if the old far coefficients had been recomputed with it.

Thus the lower head form is the same actual head minus the strengthened complete near inverse charge minus the unchanged complete far majorant. The structured exact-interval core/H/whitened test certifies this lower form strictly positive. Together with the entire tail comparison, the Schur argument yields actual whole-even coercivity at lambda=sqrt(161/10), **provided the complete analytic/source chain and independent full replay are accepted**. The constant is existential; no numerical floor is extracted here. Restriction then gives the same positivity statement for smaller supported even spaces.

## Sources and exact dependency on the existing package

New executable sources only:

- `support_endpoint_X161/diagnosis/X161_power8_targeted.py`: standalone exact rational eighth-power enumeration.
- `support_endpoint_X161_power8_repair/repaired_inputs.py`: minimal wrapper around the frozen X161 builder.
- `support_endpoint_X161_power8_repair/certify_repaired_support.py`: same structured and dense interval algorithms, with explicit `--small` or `--full` and repair-specific provenance.

The wrapper depends on the unchanged X161 exact-support builder, support configuration, actual-entry source, and 10,437-row support-specific cache generated by the source versions already in the first portable spectral package. The finite-package manifest SHA is `1b5cc0afddecf88f23074f7b60cc3aa7de707d07d217223d632e745224737303`; its metadata-only relation to the completed clean X16.001 replay is independently disclosed there. No first-package file is modified by this repair.

The original X161 raw cache SHA is `b40a1c4befce69b27d61afd3f81bddd4725accfdfa54f7741d63fe4f4a8b2998`. All its 10,437 balls were independently recomputed in the prior support-parameterization audit, with minimum 945-bit accuracy. A fresh regenerated JSONL may differ in line order and timing bytes; compatibility is checked by the first package's exact X/phase/precision/source metadata and canonical key-indexed nontiming digest, not by pretending nondeterministic file bytes must match.

Required old runtime sources are exactly the `failed` case source dependencies in that package, together with its shared structured algorithms and actual-entry helper. Required old prime receipt is generated by the frozen seventh-power enumerator because the wrapper first rebuilds the unchanged old far majorant. The new eighth-power receipt is additional, not a replacement for that input.

The earlier frozen-direction diagnosis motivated this choice but is **not** a runtime or proof prerequisite for the repaired complete sign certificate. No discovery factors or large diagnostic arrays need to be shipped to reproduce this repaired certificate.

## Reproduction order

In an isolated root-relative copy containing the first package sources plus the three new sources:

1. Regenerate the old X161 seventh-power receipt.
2. Regenerate the complete X161 moment cache (the initial 64-row checkpoint followed by completion preserves the original bookkeeping split).
3. Run the X161 literal-entry/scalar preflight and complete cache-isolation check.
4. Regenerate the new eighth-power receipt.
5. Run `repaired_inputs.py`, then `certify_repaired_support.py --small`.
6. Run `certify_repaired_support.py --full` and verify unchanged source pins, the whole-tail floor and all three complete sign gates.

Keep original reference receipts separate: the producer scripts write their conventional output filenames. An independently accepted endpoint requires the separate complete-replay receipt, not just step6's local producer status.

## Exclusions

No odd-space conclusion, cofinal or all-support floor, global ordinary-L2 operator closure, ground-state identification or RH theorem is claimed. The failed seventh-power surrogate remains a genuine recorded failure. A successful sharper sufficient bound explains its failure without proving that the old bound was numerically wrong or that the actual operator changed.
