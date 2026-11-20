# Zeta sphere campaign — completed-results local snapshot v6

**Research results and audited obstructions, NOT a proof of the Riemann hypothesis.**

Snapshot date: 2 November 2026 (UTC). Exact freeze time, filenames, byte counts and SHA-256 checksums are in `MANIFEST.json`; `MANIFEST.sha256` provides a conventional checksum list. Prior v1 (`libfile_93b9dae0edc08191bd54546a151f05e6`) and v2 (`libfile_f56659169e508191bb4956b6a27f6911`) Library archives remain unchanged. This v3 snapshot includes the now-completed wedge, localization and endpoint work. Subsequent signed-head contour/saddle research is outside this freeze.

## New in local v6: signed finite heads and a necessary endpoint gap budget

This is a local immutable preservation snapshot. It has not been uploaded or used to change an account. Durable v5 remains unchanged (`libfile_80ae203d83b88191bf7845f9821db9e1`). Pending adaptive_head_v8 research and ongoing Suzuki enrichment probes are excluded.

- `bilinear_head_v7/CORRELATED_TWO_MODE_MARGIN.md` proves an independently reviewed constrained-phase positive margin for the entire-axis **square cutoff n,m<=2**: normalized density >=.5 t^3 exp(-pi t/2), t>=1000,0<a<=.5. This is not a full-kernel result.
- `ACTUAL_FINITE_HEAD_COUNTEREXAMPLE.md` proves that the different **product cutoff nm<=2** has negative values along an explicit unbounded sequence despite positive normalized period averages. Its missing (2,2) diagonal is essential. No adaptive-cutoff or full-kernel negativity is claimed.
- The other reviewed notes give exact signed bilinear/phase-collapse identities, actual coefficient-matrix indefiniteness, positive outer Bessel amplitudes with negative complete prime-product blocks, and the explicit extra derivative cost needed to turn an average into a pointwise certificate. They do not prove the all-height adaptive-head threshold.
- `hierarchy/suzuki_v10/EXACT_COMPRESSION_AND_GAP.md` gives quadrature-free weakly singular compression and exact-integer interval Rayleigh witnesses at A^2=3. The n8192 witness is approximately .99999995275148007045. It forces any contraction margin below4.724852e-8; **it does not prove contraction or invertibility**. An inverse lower bound greater than21million is expressly conditional on a separate contraction theorem. Independent differently accumulated integer/interval replays are in `bilinear_head_v7/suzuki_v10_review/`.
- Only frozen exact-compression files are included from v10; ongoing enrichment and exploratory probes are excluded. Earlier primary-source attribution and implementation assumptions remain as stated in the preserved notes.

Earlier index sections below retain their historical scope. No RH proof is claimed.

## New in v5: adaptive arithmetic tail and larger finite support

V4 remains unchanged: Library `libfile_6d3af81e6930819180ddae7f2a34a222`. Ongoing bilinear-head threshold research is excluded from this freeze.

- `relative_tail_v6/ADAPTIVE_CONTOUR_TAIL.md` gives an independently reviewed, exact product-paired Ewald head and explicit full Fourier-tail bound: for t>=1, 0<a<=1/2 and M+1>=t/(sqrt(2)pi), the normalized omitted tail is <=5 t^(3/2)exp[-(1+pi/4)t]. The finite head retains correlated divisor phases in O(t logt) arithmetic pairs. **Head greater than this threshold is a sufficient pointwise certificate, not a proved all-height inequality.** `CONTOUR_REVIEW_HIERARCHY.md` records the independent audit.
- `UNIVERSALITY_GAP_OBSTRUCTION.md` proves that full shear divided by the positive fixed N=1 head has every nonnegative real number as a subsequential limit and unbounded limsup, at each fixed interior shift. Thus no constant strict relative gap, nor finite uniform absolute relative-tail constant, can hold against that fixed head. This is a deduction from **established Voronin universality**, whose exact statement was read in the primary Lamzouri–Lester–Radziwill article; their entire proof is not claimed independently reverified. `REVIEW_HIERARCHY.md` records the deduction audit. `COMBINED_SCOPE.md` explicitly avoids inferring quantitative witnessing heights from universality.
- `hierarchy/suzuki_v9/SUPPORT_CONTINUATION.md` and its certificate extend the reviewed finite Hankel contraction to A<=2^(8/15), omega in [.39999999,.40000001], norm<=.99996 and inverse norm<=25000. Exact fractional interpolation and overlap allowances replace the coarser approximation. Endpoint candidates are checked against an elementary representation using the actual generator expressions; both finite Schur inequalities are interval-certified and independently replayed. Review/replay: `relative_tail_v6/suzuki_v9_review/`.
- This remains **finite-support inversion**, not global determinant nonvanishing or canonical-system continuation. `LITERATURE_SCOPE.md` identifies prior primary results and avoids a novelty claim. Downloaded primary PDFs/texts are inert source provenance, not acquired executable code.

Earlier index sections below describe their historical freezes. No RH proof or full all-height positivity is claimed anywhere in this snapshot.

## New in v4: signed finite heads and finite-support contraction

Earlier v1/v2/v3 Library archives are unchanged. V3 is `libfile_394943c8cf588191abc8d8e2a932c2b3`. This snapshot copies its frozen payload and adds the following independently reviewed work.

- **Signed-head theorem:** `signed_head_v5/COMPLETED_PARENT_MARGIN.md` proves that the corrected entire-axis N=1 Ewald head satisfies hat D_(a,1)(k)/a >= (|k|/2)^3 exp(-pi|k|/4) for every |k|>=200 and 0<a<=1/2. This is a high-frequency positive **finite head**, NOT positivity of the full theta shear. The exact phase-preserving Mellin decomposition and explicit low-integral correction are retained.
- `AXIS_CLOSURE_IDENTITY.md` identifies the exact collective axis block and boundary phase. `RESOLUTION_BARRIER.md` proves that the completed parent and its subtraction cancel with ratio tending to one as N grows at fixed frequency. The full omitted arithmetic **relative-tail estimate remains open**. Independent review is `REVIEW_HIERARCHY.md`; high-precision probes are expressly exploratory and are not proof inputs.
- **Suzuki finite-support theorem:** `hierarchy/suzuki_v8/BLOCK_CERTIFICATE.md` proves norm <=.99991 for omega in [.39999999,.40000001] and A<=2^(2000000/3999999), slightly beyond the first arithmetic threshold sqrt(2). Thus I±H have bounded finite-interval inverses, with resolvent norm <=100000/9. This is NOT global determinant nonvanishing, a small-shift canonical-system theorem, or an RH result. The audited implementation assumes standard basic floating arithmetic and mpmath interval arithmetic; that scope is explicit.
- The Suzuki certificate retains the signed kernel, handles singularities through exact primitives, bounds the infinite-dimensional complementary block analytically, and uses interval Cholesky for the finite Schur tests. Independent replay, analytic/code review and reviewed-file hashes are under `signed_head_v5/suzuki_review/`.
- Suzuki's downloaded primary PDF/text are inert provenance; no acquired code was executed. Kernel formulas are established source input, whereas the finite block certificate is authored campaign work. Exploratory scripts are preserved separately by filename and never treated as certificates.

The remainder below is the preserved v3 research index; its historical descriptions and prior-snapshot exclusions refer to that earlier freeze. Only the new items above change the completed-results inventory. No global proof claim is made.

## New in v3: collision stability and spectral/Green limitations

### Continuum of clustered-node tests, not just one triple

- `confluent_v4/CLUSTER_CERTIFICATE.md` proves a relative error bound **E≽−10⁻⁹D** for the corrected Ewald cutoff N=12, for **every configuration of at most three real nodes of diameter≤1/1000**, all complex coefficient vectors, uniformly **0<a≤1/2**. No minimum separation is required. Repeated evaluation nodes are treated as PSD limits; derivative observations use the positive confluent form.
- `confluent_v4/NEWTON_NATIVE_FRAMEWORK.md` gives the exact factorial-scaled divided-difference congruence and finite native-feature tail estimates. It quantifies the artificial raw-Gram collision loss and proves that all-order confluent positivity under the actual exponential spectral-moment hypothesis would already imply global PD. Thus the finite-cardinality result does not evade the global obligation.
- Interval code/data, rational verification and review are in `confluent_v4/`; independent reruns and audit are in `foundations/confluent_recheck/` and `CONFLUENT_V4_AUDIT.md`. Exploratory jet values are separately labeled.

### Completed Green, localization and endpoint analysis

- `hierarchy/wedge_v5/GREEN_ARITHMETIC_BRIDGE.md` connects the derivative forcing to exact grouped arithmetic and quantifies its total mass. A small total mass is explicitly NOT treated as a relative operator bound.
- `hierarchy/localization_v6/RELATIVE_LOCALIZATION.md` identifies stationary Loewner bounds with pointwise spectral domination, gives a local-average/derivative sufficient criterion and the correct signed-cost Schur conditions, and proves a boundary-energy gap obstruction. Its interrupted exploratory probe produced no evidence and is transparently recorded as such.
- `hierarchy/endpoint_v7/ENDPOINT_PLAN.md` extends the endpoint/adaptive-flat-boundary obstruction, supplies a very conservative explicit positive boundary-energy denominator, and compares explicit theta-tail error with the sharper full-function cross-error envelope. The denominator is not a lower bound for the desired signed residual.
- The endpoint note also proves positivity in a logarithmically thin near-boundary layer, **|t|≥46 and a≥1/2−1/[8log(|t|+1/2)]**, using an established classical zero-free region and the paired canonical product. **This is an elementary consequence of existing zero-free input, not a new RH result or a new zero-free bound.** Its input-reading/audit scope is stated in the note.
- Corresponding final audits are `foundations/LOCALIZATION_V6_AUDIT.md`, `ENDPOINT_V7_AUDIT.md`, and the wedge review files listed in the manifest.

## 1. Earlier completed, scoped results

### Direct/dual Epstein grouping and a relative finite Gram certificate

- `modular_epstein_v3/GROUPED_EWALD_CANDIDATE.md` constructs arithmetic direct/dual orbits with an essential exact axis-plus-pole closure. Naively truncating the axes creates a nondecaying constant and eventually violates a necessary PD condition; keeping the whole closure avoids that defect. An explicit normalized remainder bound controls both supnorm and L1, including arbitrarily small positive shifts.
- `modular_epstein_v3/GROUPED_GRAM_CERTIFICATE.md` closes an actual relative remainder inequality for **exactly three real nodes (0,1/4,1/2), all complex coefficient vectors, uniformly 0<a≤1/2**. For its normalized candidate D and exact remainder E, `lambda_min(D)>57/5000`, `||E||<3/2500`, and `E≽−(2/19)D`. This is NOT arbitrary-node positive definiteness or an all-frequency sign theorem.
- Interval implementations/data are `certify_grouped_gram.py`, `grouped_gram_intervals.json`, `certify_shift_moments.py`, and `shift_moment_intervals.json`. `verify_grouped_certificate.py` reconstructs the final rational deductions without a floating-point eigenvalue test. The exploratory script/output are explicitly non-certifying.
- Review evidence is under `foundations/GROUPED_EWALD_AUDIT.md` and `foundations/GROUPED_GRAM_CERTIFICATE_AUDIT.md`; isolated reruns are preserved in `foundations/grouped_gram_recheck/`.

### A certified neighborhood of an actual simple real zero

- `modular_v2/ZERO_WINDOW_CERTIFICATE.md` proves
  `W_a(t)/a ≥ 3.9103542×10⁻⁷`
  for **|t−7237/512|≤1/16 and 0<a≤1/8**, uniformly as a→0.
- It also certifies one unique simple real zero in `[115791/8192,7237/512]`. It does not count all earlier zeros or prove that this is the first zero.
- Full-theta interval code, data, exact-rational verification and review are in `modular_v2/`. The independent rerun/audit is under `foundations/zero_window_recheck/` and `NEAR_ZERO_AND_SHIFT_V3_AUDIT.md`.
- This is a finite-height rectangle, not all-height RH progress.

### Coupled hierarchy and shift continuation

- `hierarchy/coupled_v2/` supplies an automatically positive matrix-valued state with an **indefinite scalar output**, inertia `(n+1,n)`. It quantifies unavoidable negative-channel mass rather than mistaking enlarged positivity for the needed scalar sign. The n=1 mass fraction is interval-enclosed near `0.173266803`.
- `hierarchy/shift_v3/shift_continuation.md` derives the exact derivative tower, strip Green representation and a computable boundary-versus-coupling cost. A polynomial counterexample excludes an unwarranted inward maximum principle. The zero-strip barrier is an equivalence, not a new proof of strip improvement.

### Self-contained large-order spatial approximation

- `hierarchy/large_order_v4/L1_GAUSSIAN_THEOREM.md` proves an explicit normalized L1 Gaussian-shape estimate with stated constants/onsets and a corresponding sufficient positive frequency band. This does not exclude negative frequencies outside the band.
- The files distinguish analytic proofs from exploratory numbers, and explicitly make no novelty or state-of-the-art claim. See the separate external-literature discussion below.

## 2. Preserved v1 results and interval-certified obstruction

- `foundations/FOUNDATIONAL_AUDIT.md`, `CROSS_REVIEW.md`, and `FREQUENCY_RELATIVE_LIMITS.md` audit normalization, endpoint cancellation, scope, and failures of inference from finite smooth norms to global relative accuracy.
- `modular_approximants/results.md` gives an exact signed Euler–Maclaurin tail and proves the head/tail/cross asymptotics. Both self shears can be negative; the mixed term supplies the cancellation.
- `modular_approximants/adaptive_results.md` treats height and cutoff simultaneously. Below the approximation threshold an adaptive head can be either negative or misleadingly positive. Accuracy at an exponential decay envelope is not accuracy relative to the actual full shear.
- `modular_approximants/signed_pair_certificate.md` gives phase-defect and correlated-tail Schur sufficient conditions with the correct outward derivative convention. `foundations/EXPLICIT_COHERENT_RECTANGLE.md` verifies an actual N=3 instance on **1/10≤a≤1/4, |t|≤1** using elementary bounds.
- `hierarchy/ratio_certificate_notes.md`, `ratio_certificate_result.txt`, `ratio_intervals.json`, and `certify_ratio.py` rigorously reject one **stronger-than-RH multiplicative sufficient condition**: positive definiteness of every ratio `g_n=M_(n+1)/M_n`.

For `g_4=M_5/M_4`, nodes j/8 (j=0,...,11), and integer vector
`(91,−308,347,39,−445,277,277,−445,39,347,−308,91)`,
the exact quadratic form lies between **−48.494670 and −48.473700**. Complete theta and integration tails are included. This disproves the ratio-propagation condition, **not RH or positive definiteness of M_4/M_5**. `certify_ratio_midpoint.py` is an archived slower prototype; `test_ratio.py` and `ratio_n*.npz` are exploratory.

## 3. External primary preprint: separate provenance and bounded audit

`hierarchy/large_order_v4/LITERATURE_COMPARISON.md` and `PRIMARY_CORE_AUDIT.md` record a targeted comparison with prior literature. In particular, an **externally authored** rStation preprint by **bramble_trace**, *Generalized Laguerre positivity at growing orders*, states a stronger eventual order–height sign range than this campaign's self-contained explicit theta L1 result.

The campaign independently audited a bounded baseline core of version 3 (with versioned source hashes and dependency graph preserved), finding no gap in that checked core. This is **not** formal verification, comprehensive peer review, a statement of community acceptance, or adoption of the entire preprint. No explicit onset comes from that source. The version-4 improvement importing an additional zero-free theorem and other unreviewed claims are excluded.

The captured Markdown/HTML files are inert evidence, not campaign-authored theorems or executable research code. The self-contained L1 theorem does not depend on them. Consult `PRIMARY_CORE_AUDIT.md` for exact URLs, hashes, included sections and exclusions; consult `foundations/PRIMARY_GROWING_ORDER_REVIEW.md` for the independent scope statement.

## 4. Source provenance and original-thread factorization

The original bridge draft is `bridge_shear_vortex_positivity.tex`, read from Library item **libfile_45bd1fbffcf481918939d4c18afd8b43**, underlying file **file_0000000043fc822fb5c3fefdc33809bd**, reported 54,429 bytes, modified 2026-11-02T15:14:25.764960Z. Identical copies remain in `foundations/` and `modular_approximants/source.tex`, SHA-256 `88d3e49127e311b681213cb559d11eb1a54a41d9d41c1e0b9422de07a404a65f`.

The original thread's later factorization source bundle is **libfile_3d7f9dd7c9bc81919c227563091a4ba7**. Its editable mathematical addendum and poster TeX are preserved in `foundations/original_factorization/`; the nested ZIP, derived PDF, and private originating message are omitted from the repository derivative and remain recoverable from the hash-identified private archive. `foundations/ORIGINAL_FACTORIZATION_AUDIT.md` audits the primitive, operator constants and renormalization. These source materials explicitly leave global positivity open.

Original local campaign code is preserved. No acquired research code was executed. No Git publication or repository modification was used to create the source archive; it is a user-authorized durable Library deliverable. Third-party and source PDFs are omitted from this repository derivative.

## 5. Evidence standards and global open obligation

Interval runs use mpmath interval arithmetic with explicit analytic tails and conservative serialization slack. Their proofs, parameters and actual outputs are preserved. Independent AI-assisted audits/reruns are documented, but are not external peer review or proof-assistant formalizations. Ordinary high-precision checks and exploratory spectra are clearly labeled non-certifying.

**Still open:** positive definiteness of the complete C_a for every required shift and every finite real-node test, equivalently the required all-height full-shear sign. A successful fixed-node relative certificate, a finite zero neighborhood, an expanding large-order band, or an audited external asymptotic theorem does not establish those universal quantifiers. No RH proof is claimed in this archive.
