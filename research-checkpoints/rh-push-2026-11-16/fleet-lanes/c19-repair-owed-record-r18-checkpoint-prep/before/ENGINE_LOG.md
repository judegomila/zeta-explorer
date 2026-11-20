# Engine log

One section per batch: what was launched, where each lane stopped, what the generator must reject next. No statement about zeros of zeta is established in any section unless it says so.

## Batch 1

Date: 2026-11-17. Ten lanes, each refereed once. Records: `outcomes/<slug>.json`; `outcomes.json` updated (nine `closed`, one `partial`); `IDEA_GRAPH.json` and `CANDIDATES.json` rebuilt (1436 nodes, 922 live). Ingest script: `scratch/ingest_batch1.py`.

Result: no lane gives a statement about zeros of zeta. Nine precise obstructions, one partial result (an elementary two-sided eigenvalue bound that carries no zero information). In two lanes the referee found a step labelled PROVED that is false as written; in both the verdict stands. RH open.

| Lane | Verdict | Where it stops | Controls | Referee |
|---|---|---|---|---|
| e1-cofinal-legendre-dual | obstruction | Limit points of Legendre-LP dual-feasible points have density 0; optima at different x are not sections of one measure; a fixed cofinal b is controlled only in mean square | E_a passes every step; DH, Liouville, theta^3 fail only at Lambda_a >= 0 | holds; measured range corrected |
| e1-rs-torus-laguerre-orbit | obstruction | The zeta main sum itself enters the torus exclusion set; the sign is set by the Riemann-Siegel remainder; one-point statement without margin (S4, Q13) | DH satisfies theta' = log N; heat tilt c < 0 passes; five controls not run | one PROVED identity false with frozen Lag_N; corrected |
| e1-sparse-recurrence-amplifier | obstruction | Returns are bounded by the zero count, so sparse recurrence is equivalent to RH; an off-line zeta zero is Haar-null and sits in the tail beyond every finite prime set | sign twist not separated; DH and E_a only through the density estimate | holds; Lemma 1 is classical (Bagchi) |
| e1-selberg-twist-control | obstruction | Twisted Selberg zeta has real exceptional zeros only and reversed sign of the zero side; Selberg companion for Theorem PC has sigma* >= 1/2 | none of positive-list items 16-23 fails against SEL | holds |
| e1-nb-gram-period-transfer | partial | lam_min(G_N) = N^(-2+o(1)) proved; same law for DH and non-arithmetic sequences; bounds coefficient size, not d_N (P14/P15) | DH and periodic sequences give the same law | holds |
| e1-forcing-free-bilinear-split | obstruction | Vaughan forcing is removable (normalisation); kernel symbol is 1 at every zero; one-sided bound on K'[R] is equivalent to RH | E_a and structured TW+ not excluded | parity cap at restricted level is false; removed |
| e1-gl3-theta-order2-rows | obstruction | Theta rows on double covers are of symbol type (h = 0, abscissa 1); half-integral weight cusp rows carry the Moebius sign at shift 1/2, detection needs beta >= 1 | sign twist gives the same rows | holds |
| e1-euler-anchor-heat-certificate | obstruction | Pair compression deficit at the anchor is of order 1/L^2 with both signs; no fixed exponent c; reach returns the input half-plane | E_a passes the anchor step | holds; Lemma 3 not the leading order |
| e1-burgers-cascade-anticausal | obstruction | No unitarily invariant norm of Gamma_- is monotone; the monotone functionals decrease forward and bound t = 0 only from t < 0 | no proved step fails for DH or E_a | holds |
| e1-heegner-averaged-nb-span | obstruction | Every Heegner bracket is DH-type with distinct frequencies; NB ratio is a distance, smaller for a non-multiplicative control | permuted control beats the family | holds; horoball formula corrected |

### Statements added to the graph (proved, elementary; novelty unchecked)

- `vasyunin-lammin-two-sided`: 1/(64 * 2^Omega_N * N^2) <= lam_min(G_N) <= (3 + log N)/(N-1)^2. Settles `vasyunin-lammin-uniform-lower-bound` for p = 2 + eps; p = 2 open.
- `vaughan-forcing-is-gauge`: the X^(1/4) Vaughan forcing equals -(4 + 2 gamma) sqrt X M'(1) - zeta'(1/2) M'(1/2); two linear conditions on the mollifier remove it, residual at most (U + 32 sqrt U + 25)(6 + log X)/sqrt X.
- `legendre-dual-limit-density-zero`, `legendre-dual-restriction-rule`.
- `selberg-pc-abscissa-half`; control `ctrl-sel-twisted-selberg` (measured, not interval-certified).

These are recorded as `newNodes` in the outcome files. They are not yet node files under `nodes/`.

### Combination families closed (generator must reject)

1. Limits or compactness of optimal Legendre-LP duals.
2. Prime-torus exclusion sets for the Riemann-Siegel main sum with any Laguerre or Turan-type sign test.
3. Amplifiers of the form "one off-line zero forces many" through Bohr sets, Kronecker or universality.
4. Selberg or Ruelle zeta as a control with functional equation, and as a companion in Theorem PC.
5. Smallest eigenvalue of Nyman-Beurling Gram matrices; period-function recursion on Gram entries.
6. Any new Type-I/Type-II split or mollifier of Vaughan or Heath-Brown shape feeding the one-sided Landau target.
7. Quadratic (order-2) versions of the 7/8 mechanism through theta or half-integral weight forms on the double cover of GL(2), and theta-induced rows on GL(3).
8. Heat-time certificates anchored in the Euler region without S transport.
9. Heat-monotone functionals of the anticausal Hankel block or of zero configurations.
10. Nyman-Beurling spans chosen by an arithmetic family (Heegner brackets) with the ratio as the measured quantity.

### Recurring end points

- E_a = zeta(s+a) zeta(s-a) was not excluded by any proved step in lanes 1, 6, 8, 9. It is the control that batch 1 separates least. What separates it from zeta is the size normalisation (exponent 1/2 against 1/2 + a), not positivity.
- Positivity of Lambda entered linearly in every lane (Landau's lemma or an LP constraint). The lane-6 lesson: a live route must use positivity non-linearly or use the size normalisation.
- Lane 4: the attributes that separate zeta from the Selberg family are the integers (additive structure), order one, and the sign of the zero side.
- Lanes 2, 3, 10: finite stages or finite prime sets carry no information about the limit (the known end point).

### Least blocked after batch 1

No lane left a margin. The items that stayed open and were not shown to be restatements:

1. Pointwise bound for sum_k mu(k) r_b(x/k) for one fixed cofinal r_b (lane 1, the source's Step 7). It uses the integers and all primes jointly, is uniform in x, and fails for DH, Liouville and theta^3 at Lambda_a >= 0. It is not separated from E_a at the level of exponents, and only a mean-square bound is argued.
2. Restricted-level Legendre plus positivity (half-weight Chebyshev/Legendre LP). The referee removed the claimed parity cap: 2.32 sqrt X from six levels, exact S(X) at D = X^0.7 for X = 1e5. Its polylog gap is an open quantity of RH strength, not a closed parity case.
3. Genuine cusp forms on the double cover of GL(3) and Whittaker coefficients of cusp-induced Eisenstein series (lane 7): not computed.
4. Exact exponent p = 2 for lam_min(G_N) (lane 5): open, no bearing on zeros.

### Graph repairs

- `euler-anchor-heat-certificate` -> `landau-transport-lemma-l` is a naming collision (theta-collision Proposition L against Lemma L of the contradiction file). The node `landau-transport-lemma-l` is left out of the closed set of lane 8.
- Closed node sets in `outcomes.json` were reduced to the members whose combination failed; the full launched sets are kept in `launchedNodes`.
- Add control rows for SEL (twisted Selberg zeta) and for the block-permuted non-multiplicative Nyman-Beurling family.

## 2026-11-17 c2-repair-owed-passes (repair lane; bookkeeping)

- Checked the ten `e1-*` records in `outcomes/` and `outcomes.json` against `push/e1-*/RESULT.md` and `REFEREE.md`: verdict, closed node set, defeating controls and referee outcome agree in all ten (8 referees hold, 2 do not hold as written with the negative verdict standing: forcing-free-bilinear-split, rs-torus-laguerre-orbit). The records had already been written by the engine workflow at 23:35; no field was changed by this lane.
- `campaign/lanes.jsonl`: ten `e1-*` lines added (all ten have a referee file).
- `generate.py`, two rules marked `c2-repair`: (1) hard reject when a candidate shares two nodes with `nodes` or `launchedNodes` of a closed or refuted outcome; (2) penalty 3 and a note when a candidate contains exactly one node of a closed outcome's `nodes`. Reason: the existing rule rejects only supersets of a closed node set, so replacing one partner of a closed pair passed with penalty 0 (before: rank 6 = `resolvent-burgers-identity` x `discriminant-gradient-flow` x one new node; ranks 3, 20, 51, 52, 57 reused one closed node with penalty 0). After the change and the concurrent closed-family rules, no top-60 candidate contains a node of a closed `e1` node set; 12 contain one node that was only in a `launchedNodes` list.
- Node `vasyunin-lammin-uniform-lower-bound` (`nodes/nodes-5.json`): type open-lemma -> identity, status conjectural -> proved, `refereeStatus` "proved, unrefereed", `usesMultiplicativity` yes -> no (the same law is measured for DH and non-multiplicative sequences). Copy of the previous generator: `scratch/generate.before-c2.py`; previous candidates: `scratch/CANDIDATES.before-c2.json`.

## Batch 2 (preparation, 2026-11-17)

Graph, generator and roadmap rebuilt after batch 1; ten candidates selected. No lane of batch 2 has run. Nothing in this section is a result about zeros.

Engine changes:

- `merge_outcomes.py` (new): builds `outcomes.json` from `outcomes/*.json` (verdict mapping precise-obstruction -> closed, partial-result -> partial; control codes extracted from the records' control lists; `launchedNodes` kept), writes `nodes/nodes-15.json` from the records' `newNodes` plus one engine-stated control, writes `closed_families.json`, and enters curated candidates without a record as `proposed`. Previous file: `scratch/outcomes.before-batch2.json`.
- `build_graph.py`: controls SEL and PERM; outcome nodes get `obstructs` edges to their closed members, `uses` edges to the other launched members and `control-defeats` edges (these were dropped before because controls were free text); family nodes `fam-*` with a `special-case-of` edge from the closing lane.
- `generate.py`: rejection by closed family (16 families; regex groups over the joint text of the members); three score parts (size normalisation, non-linear positivity, integers). The two `c2-repair` rules added by the repair lane on the same evening are kept.
- Round-1 lanes: `c1-shear-hecke-fricke`, `c1-multidelay-bohr-section`, `c1-pd-log-strip`, `c1-spinor-hecke-primitive`, `c1-window-sdp-scaling` now carry the map-open node they close (11, 7, 8, 6, 10). `c1-spinor-hecke-primitive` was listed as open in `outcomes.json`; its record says precise obstruction with the referee not holding the result as written. It is entered as closed for the generator (the family "restriction to primitive tests"); the referee pass on its Lemmas 3-5 is still owed.
- Counts: 1,246 reader records, 1,463 nodes, 8,258 edges, 927 live nodes, 12 controls. Generator: 61,200 generated, 14,562 rejected, 46,638 scored.

Family patterns were narrowed once after the first run (the patterns for "one zero forces many", "Euler anchor", "LMI" and "multi-delay section" matched unrelated nodes through the words kronecker, anchor, window and section). The Legendre, Vasyunin-Gram and Selberg patterns still reject about 2,000 to 2,600 candidates each; they match every candidate that contains two nodes of those topics, which is wider than the closed mechanism. Candidates 1 and 2 of batch 2 are on the Legendre topic and were selected by hand for that reason.

Stated by the engine, not refereed: control `ctrl-rz-reciprocal-shift`, RZ_b(s) = 1/zeta(s + 1 - b) with 7/8 < b < 1. Euler product prod_p (1 - p^(b-1) p^-s); log-derivative coefficients -n^(b-1) Lambda(n), a signed twist with modulus at most 1; meromorphic on C; real zero at s = b; symmetric about Re s = b - 1/2. It answers the item "construct a twist with a zero in 7/8 < Re s < 1" of `c1-missing-controls`. Candidate 10 checks it.

Selection: `curated/batch-2.json` (ten assignments, each at most 250 words), reading of the ranking and discarded ideas in `ROADMAP.md` sections 7 and 8.

Concurrent edits: the repair lane `c2-repair-owed-passes` edited `generate.py`, `nodes/nodes-5.json` and this log while batch 2 was prepared. All edits here were made as in-place replacements or appends; both sets of changes are present in the files.

## Batch 2 (results, 2026-11-18)

Ten lanes ran, each with one referee. No lane proved a statement about zeros, moved an abscissa or left a margin. Records: `outcomes/e2-*.json` (written by `scratch/mk_batch2_outcomes.py`; `outcomes.json` and the graph are not rebuilt by this step: run `merge_outcomes.py`, then `build_graph.py`).

| lane | verdict | referee | strength | where it stops |
|---|---|---|---|---|
| e2-legendre-riesz-level-phase | precise obstruction | holds | 0.12 | certificate value >= psi_k(X)/X^k, exponent never below Theta (Landau); from D ~ 2 sqrt X the exact LP is the hyperbola identity; RH reformulated as a bound for a prime-free LP as k -> infinity (Theorem U, upper half uses M(y) << y^(Theta+eps)) |
| e2-cofinal-moebius-pointwise | dead (restatement) | holds | 0.03 | sum_k mu(k) r_b(x/k) = -c x m(x) + O(log^2 x) at density 0: the pointwise bound on x m(x) |
| e2-below-level-mixed-moment | partial result | holds, 5 corrections | 0.20 | mixed moment has exponent 1.000 +- 0.004, equal to random rows and to twisted coefficients; H(lam < 1) is a density statement; model range [13/15, 0.8749] |
| e2-tro6-signed-csum-stratified | partial result | holds, 5 corrections | 0.25 | stratification by squarefull part changes no exponent; only the polar term is detected; correlation with theta estimators at index lambda*c (excess R^2 about 0.25) not separated from the shared Gauss-sum table |
| e2-gl3-cover-cuspidal-rows | precise obstruction | holds | 0.07 | Waldspurger product-index rows do not absorb Moebius (random-sign level); square classes carry it only at shift 1/2; transfer to the GL(3) cover by analogy only |
| e2-ms-slot-capacity | precise obstruction | holds, 5 corrections | 0.20 | extra z in Lemma 17.1 = reflected dual length T_d <= F; a coefficient-uniform slot lemma is sign-twist invariant and capped at m/2 at r = 0 (cubic Gauss vector) |
| e2-two-scale-detector-moment | precise obstruction | holds | 0.12 | (H) and two-scale detector both reduce to a count saving at the saddle pair (r*, m* = 0.4183); statistic not family-specific |
| e2-theta-dual-mseries-fe | precise obstruction | holds, narrower | 0.08 | m-reflection is target-blind; every chamber it adds lies in x >= 3/2; hull abscissa = input |
| e2-sixfold-period-z2 | dead | does NOT hold as worded | 0.03 | signal entries = Gram entries times a factor independent of the row variable; dead on step S3 only; the Z/6 character of the exceptional term is not established |
| e2-control-rz-defect-audit | precise obstruction (filter lane) | holds, 6 text defects | 0.08 | "offset <= local defect" is false literally and GRH-equivalent when repaired; RZ_b defeats every step covariant under shift and reciprocal |

### Combination families closed by batch 2

1. Legendre certificates, level x Riesz order (lane 1). The exact LP is pinned to the truth; the robust LP is a reformulation of RH whose upper half takes the Mertens bound as input. With `fam-legendre-dual-limits` from batch 1 this closes the Legendre topic except for the Type-II one-sided Moebius spline bound, which is at RH strength.
2. Pointwise Moebius sum of one fixed sawtooth remainder (lane 2). Item 1 of "Least blocked after batch 1" is withdrawn: it is x m(x).
3. Mean-value inputs inside the 7/8 method: below-level mixed moment, class-restricted fourth moment, two-scale detector (lanes 3, 7). They are one item, a count saving at (r*, m*), and are control-blind at every tested size. Finite-U numerics cannot test them (no zero-carrying rows in the sample).
4. Coefficient-uniform relaxation of the slot condition of Lemma 17.1 (lane 6). Sign-twist invariant; capped by an explicit configuration for cubic rows. Model price even if relaxed: abscissa stays above 13/15.
5. Stratification of TRO6-natural by squarefull part (lane 4, leg (b)).
6. Order-2 rows from GL(2) half-integral-weight forms at product indices (lane 5). With `fam-order2-theta-rows` from batch 1.
7. A second (modulus) reflection for the theta-dual m-series and the multiple-Dirichlet-series hull (lane 8).
8. Gradings on the row variable, modulus class or Hecke grade to separate the exceptional term; renderer spin sign x 7/8 probe (lane 9).
9. Local-defect bound as a statement shape (lane 10).

### Recurring end points

- E_a = zeta(s+a) zeta(s-a) again passed every step in both Legendre lanes and returned Theta + a. Batch 1 and batch 2 together: no integers-plus-positivity lane separates E_a. The method separates by the sign of Lambda_w (DH, Liouville, chi_4 fail there), not by zero location.
- In the 7/8 mechanism every tested statistic is equal for true rows and random multiplicative rows, and equal for Moebius, random-sign and twisted coefficients. The single place where the specific coefficients enter is (M1+): cancellation in sums of normalised cubic Gauss sums over primes, uniform in the dual index (new node `m1plus-cubic-gauss-prime-sum-uniform`). It is a GRH-type below-level estimate and is unproved.
- Target-blind algebra (Gauss-sum identities, reflections, gradings) is the same for every control and cannot be an attack by itself (lanes 8, 9).
- New standing filter from lane 10: RZ_b passes every prime-side identity and size inequality after s -> s+1-b, F -> 1/F. A candidate must contain a step that is not covariant under shift and reciprocal (sign of Lambda, or position of pole and symmetry line).

### Least blocked after batch 2

No lane left a margin. Items that stayed open and were not shown to be restatements, in order of how little blocks them:

1. TRO6-natural form (a), dual term (lane 4). The only positive measurement of the batch: correlation of the non-polar remainder with theta estimators at index lambda*c, excess R^2 about 0.25 over the permutation null, flat in Q. Owed before any further use: the random-coefficient control (theta coefficients against the shared Gauss-sum table) and the function-field control. It is not a Voronoi formula and gives no bound.
2. (M1+) for the fixed coefficients (lanes 3, 6, 7 all reduce to it). It uses the Gauss-sum structure, so it is not control-blind by construction; it is of GRH type and its best possible effect is inside [13/15, 0.8749].
3. Genuine cusp forms on the double cover of GL(3), and the exponential sum H for the (2,1) parabolic (lane 5): still not computed (carried over from batch 1).
4. Whether a relaxed slot must give up coefficient uniformity for the sextic rows or for r >= 1/2 (lane 6): undecided, low power at U <= 5e5.

Items 1 to 4 concern the zero-free abscissa near 7/8, not the critical line. No open item of batch 2 addresses the passage from the region right of 1, or from finite stages, to the critical line.

### Graph repairs to apply at the next rebuild

- `cofinal-pointwise-mobius-sum`: open-lemma -> restatement of the pointwise bound on x m(x) (density 0) or of e_b (density a > 0). Recorded in `outcomes/e2-cofinal-moebius-pointwise.json` under `nodeRepairs`; the node definition in `outcomes/e1-cofinal-legendre-dual.json` was not edited.
- `n1-tube-hull`: piece rule proved -> argued (the 8-piece set is not closed under symmetry transport; lane 8).
- `map-open-2`, `map-open-13`, `target-0874-restricted-moment`: merge into one item (count saving at the saddle pair), pointing to `m1plus-cubic-gauss-prime-sum-uniform`.
- r3-critical-count 5.1 is corrected twice (lanes 3 and 6): the "+z_0" / extra z charge is term L of Lemma 14.2 and the reflected dual length of Lemma 14.3, not a triangle-inequality loss.
- New controls: `ctrl-fake-genprime-unimodular-fe`; filter node `shift-reciprocal-covariance-filter`. New nodes are listed under `newNodes` in each record (13 in total).
- Generator rule to add: reject candidates whose only arithmetic step is target-blind (no factor depending on the target function), and candidates whose every step is covariant under shift and reciprocal.

### Corrections carried from the referees

- Lane 3: "no change for lam >= 0.8334" was false in the author's LP; corrected to lam >= 0.9 (0.8748595 at lam = 0.85).
- Lane 7: true rows in the sample are exact conjugate duplicates; 38,616 reported rows are 19,308 independent rows.
- Lane 9: the measured "index 0" concerns the diagonal k = 0 term, not the exceptional P_a^(1/6) term.
- Lane 10: the "trivial bound" of section 4, the rationale for convention D1 and the Landau sentence of 1.4(i) are withdrawn.

### Housekeeping

- Lane 4 left 15 GB in `~/rh-push/e2-tro6-signed-csum-stratified/out` on the compute server and 1.1 GB locally (gitignored). A local removal was refused by the safety check and not retried. Not removed by this step.

- `merge_outcomes.py`: verdict `dead` now maps to `closed` (it was passed through unmapped; three records use it: `c2-euler-at-zeros-scale`, `e2-cofinal-moebius-pointwise`, `e2-sixfold-period-z2`). Previous file: `scratch/merge_outcomes.before-batch2-results.py`. The merge was not run by this step.

## Campaign round 4 repair (lane c4-repair-map-engine-r3, 2026-11-18)

Repair lane, no attack, no statement about zeros of zeta. Record: `push/c4-repair-map-engine-r3/RESULT.md`. Previous files: `scratch/merge_outcomes.before-c4.py`, `scratch/generate.before-c4.py`, `scratch/build_graph.before-c4.py`, `scratch/closed_families.before-c4.json`, `scratch/outcomes.before-c4.json`, `scratch/nodes-15.before-c4.json`.

### What the merge had not done

`merge_outcomes.py` had not been run since batch 1: `outcomes.json` carried the ten batch-2 lanes as `proposed`, and `nodes/nodes-15.json` held 8 nodes. After this run: 44 entries, 37 closed (28 before), 7 partial, none proposed; `nodes-15.json` 24 nodes (the 13 batch-2 `newNodes` of the records, and 3 crossing-device nodes). The graph repairs listed at the end of the batch-2 section ("Graph repairs to apply at the next rebuild") other than the ingest of `newNodes` are still not applied.

### Closed families added (13; 29 in total)

Round 2: `fam-euler-product-at-zeros` (P41), `fam-projection-domination-gonek` (P42), `fam-cutoff-hecke-commutator` (G25), `fam-rotation-invariant-stage-bound` (Q21), `fam-jcontractive-multidelay-lft` (Q22). Round 3: `fam-pole-lattice-multiplier`, `fam-lemmab-sup-bound-halfplane` (P43), `fam-fixed-point-onesided-in-p` (T2), `fam-reflected-euler-stage-canonical` (G10), `fam-tail-generic-selector`, `fam-rs-halfsum-hermite-biehler`, `fam-fixed-window-count-rigidity` (S12), `fam-jcontractive-several-delay-joint` (lead 20). New optional keys: `unless` (regex exempting the forms a closing lane left open by name: functional-equation-symmetrised stages, discrepancy, Riemann-Siegel length, Reinhardt shell, gamma term) and `row`.

Effect on the 63,111 generated candidates with the old scoring rules: `fam-projection-domination-gonek` 415 (all contain the node `telescoping-kernel-projection-domination`, the node its lane was launched from), `fam-reflected-euler-stage-canonical` 49, the other eleven 0. The generator was not producing those combinations; the patterns guard against later nodes. `fam-linear-zero-measure-lmi`: its word boundaries were double-escaped, so only "semidefinite" could match; fixed, with a third group (explicit-formula coupling) so that a node naming an unrelated LMI does not trigger it (26 -> 58).

### Controls

`ctl-THIN` added to `build_graph.py` (status conjectural, proposed in the round-4 allocation; to be confirmed or removed when `c4-thin-twist-control-78` reports). Edges for WT and FM: 0 before, 11 after (5 from lane records through `CTRL_PATTERNS`, where "height translate" now maps to WT; 1 from the "Defeated by" column of map row S12; 5 from the new table `EXTRA_EDGES` in `build_graph.py`, each a statement of map section 2, row Q21 or a family closed by the control), plus `ctl-THIN -> ctl-U`.

### Generator rules added (`generate.py`; `--no-r4-rules` restores the previous behaviour)

1. R4-device (hard). At least one member must be a crossing device: curated tag `crossing-device` (role `device` in the graph), or role `crossing` on a node that is not a measured phenomenon, not on the flow / Lambda side (tags heat-flow, lambda, verified-height, collision, burgers, or role flow-stable), not a mean-value object (MV-CAP tags) and not a finite certificate, formal replay or visualisation. 55 of the 142 nodes with the keyword role `crossing` remain devices under this rule; 3 nodes carry the curated tag.
2. Target-blind (hard). Every arithmetic member is target-blind algebra (tag `target-blind`, or the keyword rule with no target-dependent factor). One node qualifies today (`theta-dual-mseries-is-twisted-kubota`, lane e2-theta-dual-mseries-fe).
3. Shift-reciprocal covariance (hard). Every declared tag of every member is a prime-side or size tag and no member text names the sign of Lambda, the pole, the symmetry line, the functional equation or the integers. Control RZ_b passes such a candidate.
4. Shared object (penalty -3, bonus +1). Two members share an object when they have a declared (not inferred) tag outside a list of generic tags, or a `uses` / `special-case-of` / `restates` edge. No such pair: -3. At least two such pairs (one for a pair candidate): +1.
5. Majority of members on the flow / Lambda side, or majority mean-value objects: -3 each, unless a member carries the curated tag.

Counts (same 1,550-node graph): rejected 17,006 of 63,111 without the rules, 42,311 with them (no crossing device 24,823 by order of checks, 25,105 counted independently; covariant 373; target-blind 109). Before this lane: 16,486 of 62,055. Top 60, on fixed definitions (`push/c4-repair-map-engine-r3/compare_top.py`): majority on the flow / Lambda side 14 -> 0; theme flow 12 -> 6; majority mean-value 12 -> 1; no shared object 16 -> 0; contains a device under rule 1: 23 -> 60; contains a curated device: 0 -> 6; matches a closed family of the new list: 2 -> 0.

### Limits of these rules (read before trusting the ranking)

- The role `crossing` is a keyword rule on node text. Rule 1 removes the classes known to be closed (flow, mean value, phenomenon, certificate); what remains is still a keyword match. Only 6 of the top 60 contain a device named by a planner.
- The three curated devices are conjectural nodes written before their lanes reported. When `c4-fe-stage-rouche-crossing`, `c4-laxphillips-hecke-compression` and `c4-helson-discrepancy-zerofree` report, a closed device must lose the tag or get a closed family; otherwise the generator will rank a closed device first.
- Rules 2 and 3 are keyword rules with small reach (109 and 373 candidates). They do not decide covariance; they remove the cases where no member even names a non-covariant ingredient.
- Selberg-named nodes still occur in 3 of the top 60 (`selberg-geodesic-ground-truth`, `selberg-theorem-u-geodesic-monoid`); `fam-selberg-control-companion` does not match them. Not changed here.

## Campaign round 5 repair (lane c5-repair-engine-map-r4, 2026-11-18)

Repair lane, no attack, no statement about zeros of zeta. Record: `push/c5-repair-engine-map-r4/RESULT.md`. Previous files: `scratch/merge_outcomes.before-c5.py`, `scratch/generate.before-c5.py`, `scratch/build_graph.before-c5.py`, `scratch/closed_families.before-c5.json`, `scratch/outcomes.before-c5.json`, `scratch/nodes-15.before-c5.json`, `scratch/CANDIDATES.before-c5.json`. All three scripts were run through `scripts/memcap.sh 8`.

### Edits

1. `merge_outcomes.py`, closed families: 29 -> 34. Added `fam-helson-discrepancy-zerofree` (row P46; exempts additively twisted sums, the form under test in `c5-twisted-helson-arcs`), `fam-fe-symmetrised-stage-rouche` (P44), `fam-stage-collision-index` (P44), `fam-laxphillips-hecke-compression` (G26), `fam-ramare-mr-pointwise` (P48).
2. `merge_outcomes.py`, exemptions: the `unless` key `functional-equation-symmetrised` is removed from `fam-euler-product-at-zeros`, `fam-rotation-invariant-stage-bound` and `fam-reflected-euler-stage-canonical` (the stage it exempted is closed by `c4-fe-stage-rouche-crossing`); the `unless` key `discrepancy` of `fam-tail-generic-selector` is replaced by the twisted-sum form. `unless` keys: 6 before, 4 after (twisted sums twice, one of them in the new Helson family; Riemann-Siegel length; Reinhardt shell / gamma term).
3. `merge_outcomes.py`, device nodes: `rouche-fe-symmetrised-euler-stage`, `hecke-compression-lax-phillips`, `helson-discrepancy-rigidity` lose the tag `crossing-device` and get status `closed` with the closing lane in the statement. `build_graph.py` gives them role `wall`: they are in no candidate (before: the round-4 log counted 776 candidates exempted through the Rouche node).
4. `curated/devices.json` (written by `curated/mk_devices.py`): 21 device types, 60 nodes: 17 types closed (51 nodes), 1 floored (6 nodes: the 7/8 coherent-set type), 3 open (3 nodes: `map-open-1` effective order 2, `map-open-9` quadratic positivity with companions, `map-open-21` additively twisted discrepancy); 15 target forms (RH-equivalent statements and Landau-type final steps, not devices); 6 pending proposals without a node. Each device carries the row or lane that fixes its state.
5. `build_graph.py`: role `device` and node field `device` come from that file. The keyword role `crossing` is no longer assigned (`CROSSING_RE` is kept to count matches: 262 nodes; 142 live nodes had the role before). Control `ctl-THIN` rewritten from the lane record (simple zero, floor-rule set; status conjectural until `c5-thin-walk-replay` re-reads the short-interval theorem); edge `ctl-THIN -> fam-helson-discrepancy-zerofree`.
6. `generate.py`: rule R4-device now reads the device state. Rejected: a candidate with a closed device node; a candidate with no open or floored device. Score part `crossing`: 3 open, 2 floored. New option `--per-device` (default 12): a device node may appear that often in the output (with 9 usable device nodes the cap `--per-node 2` would cut the list to 18).
7. `fam-order2-theta-rows`: second regex group narrowed (no longer `7/8|seven-eighths` alone). With the old group the pattern matched the open direction `map-open-1` itself and rejected every candidate containing it (1,080 in the first run of this lane, 668 after the change, all with a theta or half-integral member).

### Counts

| | before (graph 1,556 nodes, 952 live, 175 rows) | after (1,572 nodes, 953 live, 182 rows) |
|---|---|---|
| generated | 63,111 | 38,112 |
| rejected | 42,418 | 27,386 |
| scored | 20,693 | 10,726 |
| rejected: no device | 24,781 (keyword rule, four sub-reasons) | 14,298 (no open or floored device) |
| rejected: closed device | not a rule | 3,362 (11 device types; largest: monotone flow functional 750, positive-kernel transport 546, residue / explicit formula 480) |
| rejected: closed family | 29 families | 34 families, 6,155 (new five: Lax-Phillips 35, Helson 13, FE-stage 0, collision 0, Ramare 0 after the earlier checks) |
| top 60 with a closed device (list of item 4) | 24 | 0 |
| top 60 with an open device | 0 | 25 |
| top 60 with a floored device only | 1 | 35 |
| top 60 with a target form as member | 17 | 6 |
| top 60 with a keyword-only device | 54 | 0 (the role does not exist) |

The generated count falls because pool C (third member of moves M1, M3, M4) has 9 nodes instead of 142.

### Limits

- The curated list was written by one lane from the ROADMAP device table, the map rows and the round logs. 15 nodes of the old keyword list are filed as target forms and about 20 others are not listed at all (identities and tools with no crossing content); a planner should read `curated/mk_devices.py` once.
- A closed device node rejects every candidate that contains it. Nodes that are inputs as well as devices (`nyman-beurling-dx`, `heat-evolved-von-mangoldt-positivity`, `discriminant-gradient-flow`, `harmonic-strip-transport`) are therefore no longer available as partners; move a node out of the list if that is not intended.
- 35 of the top 60 rest on the floored 7/8 device, where the known floor is 5/6: they are candidates for frontier part B, not for the critical line. The 25 with an open device share three nodes; 12 each contain `map-open-9` and `map-open-21`, 1 contains `map-open-1`.
- Open devices under test in round 5 (`map-open-1`, `map-open-21`, and the six pending proposals) must be set to closed or given nodes by the learn step when their lanes report; otherwise the list will rank a closed device again.
- The partner choice is still the tag heuristic of the generator. A top candidate is a reading suggestion.

## Strategy review after campaign round 5 (2026-11-18)

No attack; no statement about zeros of zeta. `generate.py`: score weights moved to the dict `WEIGHTS` and changed (heightUniform 0-3 to 0-1; underused 0-4 to 0-2; floored device 2 to 1; separator 2 to 3; size and nonlinear keyword parts 1 to 0.5). Previous files: `scratch/generate.before-strategy-v2.py`, `scratch/CANDIDATES.before-strategy-v2.json`, `scratch/STRATEGY.v1.md`. `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60` rerun through `scripts/memcap.sh 8`: 60 outcome entries (48 closed), 1,577 nodes (953 live), 36,471 generated, 27,558 rejected, 8,913 scored; device nodes live: 2 open (`map-open-1`, `map-open-9`), 6 floored. Top 60: 0 closed devices, 12 with an open device, 48 floored only. Reasons and the comparison with outcomes: `ROADMAP.md` section 10.6 and `../campaign/STRATEGY.md` section 5.


## Referee-and-repair slot of campaign round 6 (2026-11-18, lane `c6-repair-referee-debts-r5`)

No attack; no statement about zeros of zeta. Previous files: `../push/c6-repair-referee-debts-r5/engine_before/` (IDEA_GRAPH.json, CANDIDATES.json, outcomes.json, closed_families.json, build_graph.py).

### Edits

1. `nodes/nodes-16.json` (new): the six device-lane nodes of `../push/c5-device-table-extension/nodes.json` (`ctrl-interpolation-twin`, `padic-interpolation-reads-nonpositive-integers`, `frequency-only-devices-coefficient-blind`, `strip-dtn-phase-identity`, `tensor-squeeze-supplies-size-only`, `additive-multiplicative-pairing-is-vinogradov`). One statement changed on the way in (referee correction 4 of that lane: rank one is proved on a rectangle, argued for forms with the cut mn <= x). Five of the six ids were already listed in `curated/devices.json` with state closed and now resolve to nodes; the control node has no device entry.
2. `build_graph.py`, control `THIN`: status `conjectural` -> `proved-relative`; text of the `has` field names the located short-interval statements (Huxley; ray-class variant relative to Coleman 1990 Theorem 2.1 as quoted in two later papers; primary texts not opened). Record: `../push/c5-thin-walk-replay/REFEREE2.md`.
3. No change to `merge_outcomes.py`, `generate.py`, `curated/`, `closed_families.json`.
4. Map (read by `build_graph.py`): `../push/OBSTRUCTION_MAP.md` gained rows D1 to D7 (section 3.9), Z15b, Z22; corrected P46, section 4 entry 49, control THIN (script `../push/c6-repair-referee-debts-r5/apply_map.py`).

### Counts (`merge_outcomes.py`, `build_graph.py`, `generate.py --top 60`, each through `scripts/memcap.sh 8`)

| | before | after |
|---|---|---|
| outcome entries (closed) | 60 (48) | 60 (48) |
| closed families | 34 | 34 |
| node files / raw records | 15 / 1,262 | 16 / 1,268 |
| nodes (live) | 1,577 (953) | 1,592 (954) |
| map rows parsed | 182 | 191 (D1-D7, Z15b, Z22) |
| edges | 8,567 | 8,621 (control-defeats 625 -> 666) |
| device nodes closed (live) / floored / open | 52 (49) / 6 / 2 | 57 (50) / 6 / 2 |
| generated | 36,471 | 36,447 |
| rejected | 27,558 | 27,557 |
| scored | 8,913 | 8,890 |
| rejected: closed device `strip-dtn-identity` | 0 (no node) | 28 |
| top 60: open device / floored only / closed device | 12 / 48 / 0 | 12 / 48 / 0 |
| top 60 containing one of the six new nodes | n/a | 0 |

Of the 15 added nodes, 6 are the device-lane nodes and 9 are the new map rows. One of the six is live (`strip-dtn-phase-identity`, roles uniform / rigid / device / explainer, device state closed, so every candidate containing it is rejected: 28); the other five have role `wall`. Open device nodes are unchanged: `map-open-1`, `map-open-9`. `ctl-THIN` now has status `proved-relative`.

### Limits

- The top-60 list is the same in composition by device state as before the rerun; this step changes bookkeeping, not ranking.
- `curated/mk_devices.py` was not rerun; the evidence text of `map-open-1` still says "Lemma U, referee holds" (now two referees) and "abelian families ... referee holds" (Theorem 7 (iv) is now labelled ARGUED for the abstract family; the two computed families stand).


## Repair slot of campaign round 7 (2026-11-18, lane `c7-repair-engine-map-r6`)

No attack; no statement about zeros of zeta. Previous files: `../push/c7-repair-engine-map-r6/engine_before/` (IDEA_GRAPH.json, CANDIDATES.json, outcomes.json, closed_families.json, mk_devices.py, devices.json, ENGINE_LOG.md).

### Edits

1. `curated/mk_devices.py` (rerun; `curated/devices.json` rewritten): 29 device types (24 closed, 1 floored, 4 open), 68 nodes, 6 pending.
   - `map-open-9` (device `quadratic-positivity-companions`): open -> closed for pointwise outputs (map row P50, `c6-quadratic-companion-positivity`). The density (family) half was not run; it is listed under `pending` and falls under MV-CAP (device `mean-value-convexity`, closed).
   - `map-open-1` (device `effective-order-two`): stays open; evidence narrowed to the derivation items of round-6 lesson 1 (uncompensated high side from manuscript (12.5)/(16.1) with the normaliser kept; compensated principal signal below Re s = 3/5; existence of a model vertex with 1 < h <= 3), with the requirement "normaliser has no zeros in Re s > 1/2" (map row Z24).
   - Three open devices added for round-7 proposals that had no node: `laurent-shell-gamma-section`, `function-field-order2-vertex` (node `ff-order2-vertex-probe`), `landau-siegel-mechanism` (node `landau-siegel-2026-mechanism`).
   - `pending` rewritten (four items of round 6 not closed; two older items kept).
2. `nodes/nodes-17.json` (new): the three device nodes (type open-direction, status conjectural, usesMultiplicativity yes). Their lanes had not reported when the nodes were written; the statements describe the proposal only.
3. Map (read by `build_graph.py`): `../push/OBSTRUCTION_MAP.md` gained rows P50, P51, G27 to G30, Z15c, Z23 to Z26 (script `../push/c7-repair-engine-map-r6/apply_map.py`).
4. No change to `merge_outcomes.py`, `build_graph.py`, `generate.py`, `closed_families.json` rules.

### Counts (`merge_outcomes.py`, `build_graph.py`, `generate.py --top 60`, each through `scripts/memcap.sh 8`; log `../push/c7-repair-engine-map-r6/engine_rerun.log`, table source `engine_counts.json`)

| | before (planner rerun of round 7) | after |
|---|---|---|
| outcome entries (closed) | 68 (52) | 68 (54) |
| closed families | 34 | 34 |
| node files / raw records | 16 / 1,268 | 17 / 1,271 |
| nodes (live) | 1,596 (954) | 1,612 (957) |
| map rows parsed | 191 | 202 (P50, P51, G27-G30, Z15c, Z23-Z26) |
| edges | 8,627 | 8,713 (control-defeats 666 -> 692) |
| device nodes closed (live) / floored / open | 57 (50) / 6 / 2 | 58 (51) / 6 / 4 |
| open device nodes, live | `map-open-1`, `map-open-9` | `map-open-1`, `laurent-shell-gamma-section`, `ff-order2-vertex-probe`, `landau-siegel-2026-mechanism` |
| generated | 36,447 | 41,507 |
| scored | 8,289 | 8,761 |
| rejected | 28,158 | 32,746 |
| top 60: listed / open device / floored only / closed device | 59 / 0 / 59 / 0 | 60 / 12 / 48 / 0 |

Controls after the rerun: no top-60 candidate contains a closed device node (`meta.r4Rules.topWithClosedDevice` = 0; recounted from the node list in `engine_counts.json`); `map-open-9` is in the closed list and in no candidate. `campaign/scoreboard.py` parses all 58 lines of `lanes.jsonl` (0 unparsed; `../push/c7-repair-engine-map-r6/scoreboard_check.log`; the scoreboard files were not rewritten).

### Limits

- The 12 top-60 candidates with an open device all contain `landau-siegel-2026-mechanism` (cap `--per-device 12`); its partners come from the tag heuristic (tags zero-free, sieve-parity, automorphic) and were not read. `laurent-shell-gamma-section` and `ff-order2-vertex-probe` are live and open but appear in no top-60 candidate (their scored candidates rank below the listed ones or fall under the family caps; not examined further). `generate.py --node <id>` lists candidates of one node; it rewrites CANDIDATES.json, so rerun `--top 60` afterwards.
- The three new nodes are proposals of lanes that have not reported. The learn step of round 7 must set each device to closed, floored or keep it open with the lane's evidence, and replace the node statements by the lanes' results.
- The outcome count 52 -> 54 closed: the round-6 learn step had written the entries of `c6-gl3-cover-epsilon-cocycle` and `c6-unreflected-marks-kd23` into `outcomes.json` with verdict open (referee does not hold as stated); their record files in `outcomes/` say precise-obstruction, and `merge_outcomes.py` maps that to closed without reading `refereeHolds` (same treatment as five earlier lanes with `refereeHolds` false). Both list `nodes = ['map-open-1']`. No record file was written by this lane. To decide in the learn step: either set the two record files to partial, or accept the mapping.
- `map-open-1` is an open device that the generator cannot use: seven closed outcome entries list `nodes = ['map-open-1']` alone (three of them from round 5), and the rule 'contains a combination closed in outcomes.json' rejects every candidate that contains all nodes of a closed entry. This was already the case before this rerun (top 60 before: 0 candidates with an open device). The derivation items left under the device are hand-built lanes of round 7, so no candidate is lost; if the device is to be offered again, the records need node sets with at least two members.
- The generated count rises by 5,060 because pool C (device members) has 10 live nodes instead of 8.

## Round 7 learn step (2026-11-18)

- Eight records written to `outcomes/c7-*.json` and entered in `outcomes.json` (76 entries). `merge_outcomes.py`, `build_graph.py`, `generate.py` not rerun.
- `merge_outcomes.py`: a record may carry `engineVerdict` (closed | partial | open), which overrides the verdict mapping. Set to open on `c6-gl3-cover-epsilon-cocycle` and `c6-unreflected-marks-kd23` (referee did not hold the claim as stated). The five earlier records with refereeHolds false and verdict closed were left as they are (not reviewed).
- Node sets: the six records whose only node was `map-open-1` now list `[map-open-1, out-<slug>]` (`launchedNodes` keeps the old value), in the record files and in `outcomes.json`. Round-7 records on `map-open-1` have two nodes.
- `curated/mk_devices.py` rerun (25 closed, 2 floored, 2 open): `laurent-shell-gamma-section` closed, `landau-siegel-mechanism` floored (width c/log q, real zeros, conductor aspect), `function-field-order2-vertex` open with the lane's evidence.


## Repair slot of campaign round 8 (2026-11-18, lane `c8-repair-engine-map-r7`)

No attack; no statement about zeros of zeta. Previous files: `../push/c8-repair-engine-map-r7/engine_before/` (IDEA_GRAPH.json, CANDIDATES.json, outcomes.json, closed_families.json, generate.py, build_graph.py, merge_outcomes.py, mk_devices.py, devices.json, ENGINE_LOG.md).

### Why `map-open-1` and `ff-order2-vertex-probe` were in no top-60 candidate

Traced with an instrumented copy of `generate.py` (`../push/c8-repair-engine-map-r7/diag/generate_diag.py`, counts in `diag/watch_before.json`; state of the round-8 planner rerun).

| node | candidates generated | rejected by `fam-order2-theta-rows` | other closed families | closed outcome sets | scored |
|---|---|---|---|---|---|
| `map-open-1` | 978 | 841 | 36 | 101 | 0 |
| `ff-order2-vertex-probe` | 2,405 | 2,209 | 139 | 57 | 0 |
| `landau-siegel-2026-mechanism` (floored) | 1,247 | 0 | 0 | 1,247 | 0 |

1. Rule responsible: the closed family `fam-order2-theta-rows` (groups `order[- ]2|order two|half-integral|double cover|h ?= ?r/2` and `theta|half-integral|kubota|double cover`) is matched by the text of each node alone. `map-open-1` has "h = r/2" in its name and "double covers" in its statement (rewritten in round 7); `ff-order2-vertex-probe` has "ORDER-2" in its name and the tag `theta`. The family is evaluated on the joint text of the members, so every candidate containing either node was rejected whatever its partners. The same defect was repaired once in round 5 for the words "7/8" and returned with the new node texts. The node-set repair of the round-7 learn step (two-member node sets in the records) was correct and not sufficient.
2. Second cause, which would have kept both nodes out after (1): the penalty "reuses a node of closed lane" takes 3 points for each closed outcome entry sharing exactly one node. `map-open-1` is shared by 8 closed entries (24 points).
3. No output cap is involved (`--per-device`, `--per-family`, `PER_ANCHOR`, `THIRD` were not binding: the scored count was 0).

### Edits

1. `generate.py`, closed families: a family rejects a candidate that contains an open device node only if a member that is not an open device matches at least one of its groups (the partner supplies part of the closed combination). Counted in `meta.r4Rules.firedIndependentlyOfOrder['closed family matched by the open device text alone (exempt)']`.
2. `generate.py`, reuse penalty: not taken when the single shared node is an open device; the closed lanes on that device are listed in one note on the candidate. Floored devices keep the penalty.
3. `nodes/nodes-18.json` (new): `ek-vector-specific-row-mean-square` ((E-K), in the form corrected by the first referee of `c7-probe-format-h-cap`), `eh-nonprincipal-row-cancellation` ((E-H), with the corrected model values), `single-row-bridge`. Type open-direction, status conjectural, usesMultiplicativity yes. Their lanes (`c8-ek-*`, `c8-eh-*`, `c8-single-row-bridge-crossing`) had not reported when the nodes were written.
4. `curated/mk_devices.py` (rerun): three open device types `vector-specific-row-mean-square`, `nonprincipal-row-cancellation`, `single-row-bridge`. 32 device types (25 closed, 2 floored, 5 open), 71 nodes.
5. No change to `merge_outcomes.py`, `build_graph.py`, `closed_families.json`.

### Counts (`curated/mk_devices.py`, `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60`, each through `scripts/memcap.sh 8`; log `../push/c8-repair-engine-map-r7/engine_rerun1.log`, table source `engine_counts.json`, per-node trace `diag/watch_after.json`)

| | before (planner rerun of round 8) | after |
|---|---|---|
| outcome entries (closed) | 76 (58) | 76 (58) |
| closed families | 34 | 34 |
| node files / raw records | 17 / 1,271 | 18 / 1,274 |
| nodes (live) | 1,616 (957) | 1,619 (960) |
| map rows parsed | 202 | 202 |
| edges | 8,728 | 8,797 |
| device nodes closed (live) / floored / open | 59 (52) / 7 / 2 | 59 (52) / 7 / 5 |
| generated | 39,193 | 42,801 |
| scored | 7,985 | 12,701 |
| rejected | 31,208 | 30,100 |
| exempted from a closed family (open device text alone) | n/a | 1,360 |
| top 60: listed / open device / floored only / closed device | 59 / 0 / 59 / 0 | 60 / 42 / 18 / 0 |

Open device nodes in the top 60 (recounted from `curated/devices.json`): `single-row-bridge` 12, `ek-vector-specific-row-mean-square` 12, `ff-order2-vertex-probe` 8, `eh-nonprincipal-row-cancellation` 6, `map-open-1` 4. Candidates with a closed device node: 0. Decisive check of the lane: met.

Per node after the rerun (generated / scored / best rank among all scored): `map-open-1` 820 / 272 / 968; `ff-order2-vertex-probe` 2,261 / 860 / 478; `ek-...` 2,648 / 2,169 / 8; `eh-...` 2,255 / 1,890 / 144; `single-row-bridge` 2,076 / 1,341 / 1.

### Limits

- `map-open-1` and `ff-order2-vertex-probe` enter the list through the diversity limits (`--per-device 12`, `--per-family 6`, one use of a pair), not by score: their best candidates rank 968 and 478 among 12,701. `fam-order2-theta-rows` still rejects 389 and 1,129 of their candidates, those whose partner mentions theta, Kubota, half-integral weight or double covers; that is the family as closed by `e1-gl3-theta-order2-rows`.
- The partners of the open devices come from the tag heuristic and were not read. No candidate was launched. The new device nodes carry the tag `theta`, shared with many measured-phenomenon nodes; ranks 1 to 23 of the list are of that kind.
- The three new nodes are proposals of lanes that have not reported. The learn step of round 8 must set each device to closed, floored or open with the lane's evidence and replace the node statements.
- Not fixed, recorded: `landau-siegel-2026-mechanism` (device state floored) cannot appear in any candidate because the closed outcome entry `c7-landau-siegel-device-read` lists it as its only node (1,060 candidates rejected by "contains a combination closed in outcomes.json"). The lane found no crossing mechanism outside width c/log q and no height-aspect form, so no candidate is lost in substance. To decide in the learn step: either give the record a second node (`out-c7-landau-siegel-device-read`) as was done for `map-open-1`, or set the device to closed for the height aspect.
- Not reviewed: the five earlier records with refereeHolds false and verdict closed (carried from the round-7 log).
- c5 `tiers_fe2.log` rows Y2, Y6 (round-7 lesson 7(e)): checked. The stored log reproduces line for line with the unchanged script (`../push/c8-repair-engine-map-r7/c5-target-fe-order2-ledger/tiers_fe2.rerun.log`). The rows are mislabelled: `tiers_fe2.py` passes no `G=`, so they ran with G = src under the label "G polar" (error E1 of the c5 referee). Values for the printed label: Y2 = 9/10, Y6 = 0.88095. No engine node cites either value. Entry F of `../campaign/MAP_PENDING.md` Part 2.

## 2026-11-18, lane c9-repair-referee-debts-r8: device node for the Hecke recurrence lane, control EIS-w, Landau-Siegel record

Scripts run in the order `curated/mk_devices.py`, `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60`, each through `scripts/memcap.sh 8` (log `../push/c9-repair-referee-debts-r8/engine_rerun.log`; counts `engine_counts.json` there; copies of the files before the edits in `engine_before/`).

### Edits

1. `nodes/nodes-19.json` (new, one record): `hecke-correspondence-recurrence`, type mechanism, status closed. Statement = the corrected form after two referees (`../push/c8-hecke-entropy-resonance-rigidity/REFEREE.md`, `../push/c9-repair-referee-debts-r8/c8-hecke-entropy-resonance-rigidity/REFEREE2.md`): Lemma G2 (i) and the Davenport-Heilbronn row withdrawn (the weight-0 object is identically 0; DH not run); multiplicity m of Lemma 3 counted with Gamma-multiplicity (with the count of pairs (p, j) the inequality is false high in the cusp: ratio 19.5 at height 2000, r = 1/2, p = 2); sign of the conformal exponent in Lemma 5 corrected to e^(-(2 sigma - 1) s).
2. `curated/controls.json` (new): auxiliary control `EISW` (EIS-w: Eisenstein series of PSL_2(Z) off resonance; keeps the group, the functional equation, the Euler product and the Hecke algebra; lacks phi(w') = 0). `build_graph.py` merges this file into `CONTROLS` at import; the code pattern `CONTROL_CODE_RE` and `controls_in` accept `EIS-w` and `EISW`; two curated edges (`ctl-EISW` defeats `hecke-correspondence-recurrence`; `ctl-WT` special case of `ctl-EISW` on the modular surface). `merge_outcomes.py`: pattern `EISW` in `CTRL_PATTERNS`.
3. `curated/mk_devices.py` (rerun): new closed device `hecke-correspondence-recurrence`; `landau-siegel-mechanism` floored -> closed.
4. No change to `generate.py`, `closed_families.json`, `outcomes/*.json`.

### Choice for the Landau-Siegel single-node record (item left open by the previous section)

Chosen: **device set to closed for the height aspect**; no second node was added to the outcome record. Reasons: (a) the engine's target is a height-aspect statement, and the refereed lane `c7-landau-siegel-device-read` found no height-aspect form (the twist n^(-it) is control U and fails at steps S4/S5 of the mechanism) and no crossing outside width c/log q; (b) the single-node closed record already rejected every candidate with the node, so state and behaviour now agree; (c) giving the record a second node would have returned about 1,060 candidates to scoring, none with an R4 mechanism by the lane's verdict. What is kept: the evidence text records the conductor-aspect floor 1 - c/log q. To reopen: set the device to floored and add `out-c7-landau-siegel-device-read` to the record's nodes, when a lane names a conductor-to-height transfer.

### Counts

| | before (round-8 learn step, files of 17:42) | after |
|---|---|---|
| outcome entries (closed) | 84 (60) | 84 (60) |
| closed families | 34 | 34 |
| node files / raw records | 18 / 1,274 | 19 / 1,275 |
| nodes (live) | 1,621 (960) | 1,623 (960) |
| control nodes (canonical controls) | 50 (15) | 51 (16) |
| map rows parsed | 202 | 202 |
| edges | 8,801 | 8,806 |
| device types closed / floored / open | 26 / 2 / 4 | 28 / 1 / 4 |
| device nodes closed (live) / floored / open | 60 (53) / 7 / 4 | 62 (54) / 6 / 4 |
| crossing pool | 11 | 10 |
| generated | 41,827 | 41,659 |
| scored | 11,561 | 12,165 |
| rejected | 30,266 | 29,494 |
| rejected by "contains a combination closed in outcomes.json" | 4,196 | 3,297 |
| top 60: open device / floored only / closed device | 33 / 27 / 0 | 33 / 27 / 0 |

Open device nodes in the top 60, before and after: `ek-vector-specific-row-mean-square` 12, `ff-order2-vertex-probe` 8, `eh-nonprincipal-row-cancellation` 7, `map-open-1` 6. 59 of the 60 listed keys are unchanged.

Why the scored count rose by 604 although nothing was opened: the Landau-Siegel node left the crossing pool (11 -> 10), so its generation slots (all of which ended in the outcome-record rejection, 4,196 -> 3,297) went to the other crossing nodes, whose candidates are rejected at a lower rate. None of the 60 listed candidates contains `landau-siegel-2026-mechanism`, `hecke-correspondence-recurrence` or `ctl-EISW`; the generator reports no rejection under the two new closed device names, so neither node was drawn as a member.

### Limits

- The outcome record `outcomes/c8-hecke-entropy-resonance-rigidity.json` still has `refereeHolds: false`, `referees: 1`, `engineVerdict: open` (it describes the result as first written). The device state is closed on the corrected statement. The learn step should set the record from the second referee file.
- `EISW` is a control on the modular surface only. It is not a Dirichlet-series control and is not added to the list of nine in the brief; `controls_in` produces it only where a text names `EIS-w` or `EISW`.
- The new node carries the tags hecke, automorphic, eisenstein-series, measure-rigidity, entropy, scattering; edges to it come from the tag heuristic and were not read.

## Round-10 planner step (2026-11-19)

`curated/mk_devices.py` (previous file: `scratch/mk_devices.pre-r10.py`): `vector-specific-row-mean-square` open -> closed; `nonprincipal-row-cancellation` open -> closed (model); new closed device `positive-term-sum-rule` (no node; proposal of `push/c9-szego-sum-rule-prime-cascade/DEVICE_NODE.json`). `function-field-order2-vertex` and `effective-order-two` unchanged (open). Rerun of `mk_devices.py`, `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60`: 34 device types (closed 31, floored 1, open 2); 92 outcome entries (63 closed); 1,626 nodes (960 live); 8,814 edges; generated 39,138; scored 9,333. No change to `generate.py` or `closed_families.json`.

## Repair slot of round 10 (2026-11-19, lane `c10-repair-record-referee-r9`)

Inputs changed since the planner step:
- `push/OBSTRUCTION_MAP.md`: 14 rows added (Q23 to Q27, G31, Z24b, Z27 to Z32, O1), control note EIS-w, edits to rows Z15, Z24, Q12, Q22, section 6 item 1, section 7. Rows 166 -> 180.
- `curated/mk_devices.py`: evidence text of three devices corrected against the referee files; states unchanged. `vector-specific-row-mean-square` (closed): "closed for absolute-value methods" narrowed to the two named techniques, ARGUED + MEASURED; the F_q[T] failure stated for active classes at N = 2 with sharp degree classes, in steps, no exponent; untested cases listed. `nonprincipal-row-cancellation` (closed): "no target excess" worded as "not detected at q = 7, r <= 5, resolution 0.05 to 0.07"; linearity does not imply norm type. `positive-term-sum-rule` (closed): closed for five named forms, not for every sum rule. `single-row-bridge`: "map row owed" -> "map row Q26". Previous file: `push/c10-repair-record-referee-r9/before/mk_devices.py`.
- `outcomes/c9-*.json` (7 of 8) and the matching lines of `campaign/lanes.jsonl`: field `correction` added from the referee files; one sentence of the `obstruction` field of `c9-eh-dual-r5-target-excess` and one phrase of the `lesson` field of `c9-tro6-interstratum-cancellation` reworded. Verdicts, scores, requirement flags, referee counts and `engineVerdict` unchanged (all eight agree with the referee files: holds, flags false, not about zeros). Previous files: `push/c10-repair-record-referee-r9/before/outcomes/`, `before/lanes.jsonl`.

Rerun, each through `scripts/memcap.sh 8` (log `push/c10-repair-record-referee-r9/engine_rerun.log`, counts `engine_counts.json`):

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 31 / 1 / 2 | 31 / 1 / 2 |
| outcome entries (closed) | 92 (63) | 92 (63) |
| closed families | 34 | 34 |
| map rows parsed | 202 | 216 |
| nodes (live) | 1,626 (960) | 1,640 (960) |
| nodes by origin: corpus / map / outcome | 1,239 / 290 / 97 | 1,239 / 304 / 97 |
| edges | 8,814 | 8,855 |
| control-defeats edges | 713 | 741 |
| device nodes closed (live) / floored / open | 64 (56) / 6 / 2 | 64 (56) / 6 / 2 |
| crossing pool | 8 | 8 |
| generated | 39,138 | 40,671 |
| scored | 9,333 | 10,311 |

The 14 new nodes are the 14 new map rows (type obstruction, not live). No device state changed, so the change in generated and scored counts comes from the new row nodes and their edges entering the pools' neighbourhoods; it was not traced candidate by candidate. Open device nodes remain `ff-order2-vertex-probe` and `map-open-1` (as left by the planner step; `ff-order2-vertex-probe` waits for lane `c10-ff-completed-rows-692`).

Limits: the generator still cannot propose a device type with no node (`positive-term-sum-rule` has none). The outcome record for `c9-obstruction-record-statement` keeps `referees: 1`; the second pass is a file in another lane's directory and will be counted by the learn step of round 10.

## Strategy review after round 10 (2026-11-19, STRATEGY v3)

- `curated/mk_devices.py` (previous file `scratch/mk_devices.before-strategy-v3.py`): `effective-order-two` open -> closed (as an attack lead; reopening inputs in the evidence text); `function-field-order2-vertex` open -> closed (as a crossing device; bounded model question kept); three pending proposals RS-1, RS-2, RS-3 (no node).
- `generate.py` (previous file `scratch/generate.before-strategy-v3.py`): `WEIGHTS` deviceOpen 3 -> 2, deviceFloored 1 -> 0, new key cohesionCap 1.0 (was the constant 2.0).
- Rerun through `scripts/memcap.sh 8`, log `scratch/rerun-strategy-v3.log`: 34 device types (33 closed, 1 floored, 0 open); 100 outcome entries (66 closed); 1,643 nodes (960 live); 8,864 edges; 36,569 generated; 8,438 scored. Top 60: all on the floored 7/8 device; none with an open or closed device. Previous list: `scratch/CANDIDATES.before-strategy-v3.json`.
- `ROADMAP.md` section 11 added (previous file `scratch/ROADMAP.before-strategy-v3.md`).

## Round 11 repair slot (2026-11-19, lane `c11-repair-del-referee-record`)

- `curated/mk_devices.py` (previous file `scratch/mk_devices.pre-c11-repair.py`, also `push/c11-repair-del-referee-record/before/mk_devices.py`): three device types added with state open, one node each: `twist-modulus-reciprocity`, `regular-rep-matrix-bridge`, `de-branges-positivity-family` (round-11 explore lanes). The three lanes reported while this entry was written (each "stage A stops", author checks only, no independent referee); the evidence text says so and the state stays open until the learn step has a referee file. Pending proposals RS-1 and RS-3 carry the lane names; RS-2 has no lane. No state of an existing device changed.
- `nodes/nodes-20.json` (new): the three device nodes (type mechanism, status conjectural). Tags are existing tags only.
- `curated/controls.json` (previous file `scratch/controls.pre-c11-repair.json`): control `DEL` (thin prime deletion; status proved-relative; two referee files; relative to Huxley 1972, primary text not opened).
- Map input changed by the same lane: `push/OBSTRUCTION_MAP.md` rows P52, Z33, control row DEL, addition to Z30 (180 -> 182 rows).
- Rerun, each through `scripts/memcap.sh 8` (log `push/c11-repair-del-referee-record/engine_rerun.log`; counts `engine_counts_before.json`, `engine_counts_after.json`):

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 33 / 1 / 0 | 33 / 1 / 3 |
| device nodes listed | 72 | 75 |
| pending proposals | 9 | 9 |
| outcome entries (closed) | 100 (66) | 100 (66) |
| closed families | 34 | 34 |
| map rows parsed | 216 | 218 |
| controls | 16 | 17 |
| nodes (live) | 1,643 (960) | 1,649 (963) |
| nodes by origin: corpus / map / outcome | 1,239 / 304 / 100 | 1,242 / 307 / 100 |
| edges | 8,864 | 8,900 |
| control-defeats edges | 745 | 751 |
| device nodes closed (live) / floored / open | 66 (58) / 6 / 0 | 66 (58) / 6 / 3 |
| crossing pool | 6 | 9 |
| generated | 36,569 | 44,860 |
| scored | 8,438 | 14,980 |

- Top 60 after the rerun: 12 candidates on each of the three open device nodes and 24 on the floored 7/8 device. The partners of the open devices are placed by tag overlap (for example rank 1: `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `regular-rep-matrix-bridge`); none was read as a lane proposal. Since all three lanes report a stop at stage A, these 36 candidates are expected to be rejected once the learn step closes the devices.
- Limits: the control node `ctl-DEL` has no edge (the keyword rule finds the code in no reader node, and no map row names DEL in its "defeated by" cell yet); outcome records for round 11 are not written (learn step); the first rerun of this lane (before the three lane reports were read) is kept as `push/c11-repair-del-referee-record/engine_rerun.first.log` and differs only in the evidence texts (scored 15,025 against 14,980).

## Round 12 repair slot (2026-11-19, lane `c12-repair-sources-statement-o-v3`)

- `curated/mk_devices.py` (previous file `scratch/mk_devices.pre-c12-repair.py`, also `push/c12-repair-sources-statement-o-v3/before/mk_devices.py`; patch script `push/c12-repair-sources-statement-o-v3/patch_devices.py`): `twist-modulus-reciprocity`, `regular-rep-matrix-bridge`, `de-branges-positivity-family` open -> closed. Each evidence text cites two referee files: the lane's `REFEREE.md` (independent) and `push/c12-repair-sources-statement-o-v3/REFEREE2.md` (control table re-derived), and the map row (Z34, Q28, P53). Open cells named by the lanes are kept in the evidence text (cone other than R_+^G; backward heat at the phase-balance step; tied conductor family). No other device state changed. The device `central-value-squares` proposed by `c11-del-device-read-confirm` was not added (not assigned; that lane has no independent referee).
- Map input changed by the same lane: `push/OBSTRUCTION_MAP.md` rows P53, G32, Q28, Z34 added; control row DEL, rows P36, Z29, O1 and section 7 edited (182 -> 186 rows).
- Not rerun: `merge_outcomes.py` (the learn step of round 11 had run; outcome records untouched by this lane).
- Rerun, each through `scripts/memcap.sh 8` (`curated/mk_devices.py`, `build_graph.py`, `generate.py --top 60`; log `push/c12-repair-sources-statement-o-v3/engine_rerun.log`; counts `engine_counts_before.json`, `engine_counts_after.json`; previous list `scratch/CANDIDATES.pre-c12-repair.json`). "Before" is the state left by the round-12 planner rerun.

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 33 / 1 / 3 | 36 / 1 / 0 |
| device nodes listed | 75 | 75 |
| pending proposals | 9 | 9 |
| outcome entries | 108 | 108 |
| closed families | 34 | 34 |
| map rows parsed | 218 | 222 |
| controls | 17 | 17 |
| nodes (live) | 1,655 (963) | 1,659 (963) |
| nodes by origin: corpus / map / outcome | 1,242 / 307 / 106 | 1,242 / 311 / 106 |
| edges | 8,903 | 8,922 |
| control-defeats edges | 751 | 770 |
| device nodes closed (live) / floored / open | 66 (58) / 6 / 3 | 69 (61) / 6 / 0 |
| crossing pool | 9 | 6 |
| generated | 44,860 | 36,558 |
| scored | 14,980 | 8,437 |
| rejected for "no open or floored crossing device" | 16,358 | 16,809 |
| rejected for "contains a closed device" (rule fired independently of order) | 4,261 | 3,521 |

- Top 60 after the rerun: 0 candidates on the three devices closed here (before: 36). By last member: `map-open-4` 12, `tro6-natural` 10, `qrh-seven-eighths` 10, `seven-eighths-abscissa-formula` 9, `map-open-2` 9, others 10. Rank 1: `zv-theta-kernel-phi` x `tro6-natural` x `euler-detection-depth-law` (11.5). The list was not read as lane proposals.
- The four new nodes are the four new map rows (type obstruction, not live). The 19 new control-defeats edges come from the defeated-by cells of the new and edited rows (keyword rule; not traced edge by edge). The fall in the "closed device" rejection count is the smaller generated set: the three nodes leave the crossing pool, so fewer triples are formed with them.
- Limits: unchanged from the round-11 entry (the generator cannot propose a device type with no node; `ctl-DEL` edges were not inspected). Generated and scored counts return to within 11 and 1 of the strategy-v3 rerun (36,569 / 8,438), which had the same crossing pool.
- `curated/controls.json` (previous file `scratch/controls.pre-c12-repair.json`): source field of control `DEL` reworded after Huxley 1972 was opened (relative to the counting statement S(theta); density estimate opened, Ingham's deduction not opened). Status `proved-relative` unchanged. Edited after the rerun above; `build_graph.py` and `generate.py --top 60` were run a second time (log `push/c12-repair-sources-statement-o-v3/engine_rerun.second.log`): all counts in the table and the top-60 list are unchanged.

## Round 13 repair slot (2026-11-19, lane `c13-repair-map-engine-battery-records`)

- `curated/controls.json` (previous file `scratch/controls.pre-c13-repair.json`, also `push/c13-repair-map-engine-battery-records/before/controls.json`): control `UNIV` added from `push/c12-univ-pointwise-control-wcone/controls_UNIV_proposed.json`. Status string `relative to joint universality` (not one of the ranked status values of `build_graph.py`; the node type is control, so the rank is not used). New field `scope`: filter for one step type, decides 1 device, part of 4, restates 2, out of scope for 27 of the 34 device rows read by the lane. The `kills` text carries the referee's narrowing of the class-N sentence (E2); the source field names the independent referee pass.
- `curated/mk_devices.py` (previous file `scratch/mk_devices.pre-c13-repair.py`; patch script `push/c13-repair-map-engine-battery-records/patch_devices.py`): three device types added, state closed, no node: `bost-connes-crossed-product-positivity` (open cell: states outside the three classes), `depth-aspect-height-transfer` (open cell: non-termwise transfer; bounded heights in a written proof; range between log q and q^delta), `x04-oval-hecke-fricke-loading` (open cell: a functional of the unsummed complex points that is neither linear nor a second moment). Each evidence text cites the independent referee pass in the lane's `REFEREE.md` and the map row (D8, Z35, G33). Evidence texts extended, state unchanged: `regular-rep-matrix-bridge` (candidate (CW) on K_F closed by `c12-univ-pointwise-control-wcone`; other F-adapted cones not covered; row Q29) and `de-branges-positivity-family` (both open cells run by `c12-heat-tied-family-open-cell`; numeric screen corrected). No entry for a round-13 lane. The device `w-adapted-cone` proposed by the UNIV lane was not added as a type (not in the assignment; recorded in the evidence of `regular-rep-matrix-bridge`); `central-value-squares` still not added.
- Map input changed by the same lane: `push/OBSTRUCTION_MAP.md` rows P54, G33, Q29, Z35, D8 added; rows Z11, Z12, P43, P53, three notes of section 2 and seven rows of section 7 edited (186 -> 191 rows).
- Not rerun: `merge_outcomes.py` (outcome records untouched by this lane).
- Rerun, each through `scripts/memcap.sh 8` (`curated/mk_devices.py`, `build_graph.py`, `generate.py --top 60`; log `push/c13-repair-map-engine-battery-records/engine_rerun.log`; counts `engine_counts_before.json`, `engine_counts_after.json`; previous list `scratch/CANDIDATES.pre-c13-repair.json`). A first run stopped at `mk_devices.py` with a syntax error made by this lane's patch (a quotation mark inside an evidence string); `build_graph.py` and `generate.py` of that run used the old `devices.json`; log kept as `engine_rerun.failed-syntax.log`; the table is from the second run. "Before" is the state left by the round-13 planner rerun (it already contains the six outcome nodes of the round-12 learn step).

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 36 / 1 / 0 | 39 / 1 / 0 |
| device nodes listed | 75 | 75 |
| pending proposals | 9 | 9 |
| map rows parsed | 222 | 227 |
| controls | 17 | 18 |
| nodes (live) | 1,665 (963) | 1,671 (963) |
| nodes by origin: corpus / map / outcome | 1,242 / 311 / 112 | 1,242 / 317 / 112 |
| nodes of type obstruction / control | 639 / 52 | 644 / 53 |
| edges | 8,922 | 8,937 |
| control-defeats edges | 770 | 783 |
| restates edges | 183 | 185 |
| device nodes closed (live) / floored / open | 69 (61) / 6 / 0 | 69 (61) / 6 / 0 |
| crossing pool | 6 | 6 |
| generated | 36,558 | 36,558 |
| scored | 8,437 | 8,437 |
| rejected | 28,121 | 28,121 |

- The six new nodes are the five new map rows (type obstruction, not live) and `ctl-UNIV`. `ctl-UNIV` has four edges: control-defeats to `signed-interferometer-dh` and `supercritical-phase-circular`, restates from `mem-signed-interferometer-dh` and `voronin-universality` (keyword rule on "joint universality" / "Voronin universality"; the two control-defeats edges were not checked against the nodes' statements and may be keyword matches only). The other eleven new control-defeats edges come from the defeated-by cells of the new rows (not traced edge by edge).
- Top 60: 59 of 60 candidates unchanged with unchanged scores; rank 57 changed one member (`semilocal-trace-side-positivity` -> `route-i-kato-temple`, same score 1.76; a tie resolved differently after the closed-row counts by theme moved). Rank 1 unchanged: `zv-theta-kernel-phi` x `tro6-natural` x `euler-detection-depth-law` (11.5). No open device node: the list was not read as lane proposals.
- The three new device types have no node, so they reject no candidate and the generated, scored and rejected counts are unchanged. They are a record for the planner (closed device list 36 -> 39), not a generator input. Limit unchanged from rounds 11 and 12: the generator cannot propose a device type with no node.
- `campaign/scoreboard.py` rerun through `scripts/memcap.sh 8` (log `push/c13-repair-map-engine-battery-records/scoreboard_rerun.log`; previous files in `before/`): headline unchanged, 1 of 4. Changes against the file of 12:45Z: lanes 106 -> 107 (one round-13 lane line written by another lane before this rerun), nodes 1,659 -> 1,671 (six from the planner rerun, six from this lane), tags 342 -> 360, families 58,311 -> 64,620, closed 2,702 -> 2,796, tried and not closed 519 -> 521, open lemmas decided 61 -> 65. These moves were not attributed between the two sources.

## Round 14 repair slot (2026-11-19, lane `c14-repair-map-engine-checkpoint-record`)

- `curated/controls.json` (previous file `scratch/controls.pre-c14-repair.json`, also `push/c14-repair-map-engine-checkpoint-record/before/controls.json`): control `BLS` (scattering-level Blaschke control) added from `push/c13-kacmoody-eisenstein-affine-weyl-shift/controls_BLS_proposed.json`. Status string `proved in rank one` (not one of the ranked status values; node type control, rank not used). New field `scope`: proved for the rank-one Maass-Selberg inequality, argued for the affine kernel, not a Dirichlet-series control. The `lacks` text carries the limits found by the lane's referee passes (single real factor not covered; sign not free). Source of control `UNIV` extended with the second referee of `c13-referee-r12-independent` (Corollary U4 argued).
- `curated/mk_devices.py` (previous file `scratch/mk_devices.pre-c14-repair.py`; patch script `push/c14-repair-map-engine-checkpoint-record/patch_engine.py`, entries written with `repr()`): six device types of round 13 added, state closed, no node: `kacmoody-loop-eisenstein-maass-selberg` (rank-one proved, affine kernel argued; open cells: proof for the affine kernel, the wall Re c -> 0), `fourier-interpolation-zero-nodes` (open cells: kernel for the gamma class of E_a; signs of DH basis functions; stage B not run), `lrs-amplification-eisenstein-at-zero` (open cell: non-Borel eigen-objects with Rankin-Selberg pole left of 2 - beta), `edrei-thoma-local-total-positivity` (with the census of twelve non-cone types and Lemma P; open cells: 23 device types without a T-NR record, functionals of two objects), `bilinear-reciprocity-height-jform` (open cell: an exact law for the Estermann function off its central point), `dictionary-d-kernel-sign-functionals` (closed as MEASURED, finite search, on the registered grid and draws only; open cells: Hermitian forms, orders above 4, two kernels at once). Each evidence text cites the independent referee pass in the lane's REFEREE.md. No pending proposal was changed: RS-1 to RS-3 stay in `pending` until the round-14 learn step decides the checkpoint (draft `campaign/CHECKPOINT_R14_DRAFT.md`).
- Map input changed by the same lane: `push/OBSTRUCTION_MAP.md` rows D9, G34, G35, G36, P55, L6, Z36 added; rows D8, Z35, G33, P54, P53, the UNIV note, three new notes of section 2 (BLS, NR on a scattering carrier, Lemma P) and eight rows of section 7 edited or added (191 -> 198 rows).
- Rerun, each after `python -m py_compile` and through `scripts/memcap.sh 8`, in the order `curated/mk_devices.py`, `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60` (log `push/c14-repair-map-engine-checkpoint-record/engine_rerun.log`; counts `engine_counts_before.json`, `engine_counts_after.json`; previous list `scratch/CANDIDATES.pre-c14-repair.json`; previous `outcomes.json` in `scratch/outcomes.pre-c14-repair.json`). "Before" is the state left by the round-14 planner rerun.

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 39 / 1 / 0 | 45 / 1 / 0 |
| device nodes listed | 75 | 75 |
| pending proposals | 9 | 9 |
| outcome entries (closed) | 124 | 124 (84) |
| closed families | 34 | 34 |
| map rows parsed | 227 | 234 |
| controls | 18 | 19 |
| nodes (live) | 1,677 (963) | 1,685 (963) |
| nodes by origin: corpus / map / outcome | 1,242 / 317 / 118 | 1,242 / 325 / 118 |
| nodes of type obstruction / control | 650 / 53 | 657 / 54 |
| edges | 8,937 | 9,002 |
| control-defeats edges | 783 | 848 |
| restates edges | 185 | 185 |
| device nodes closed (live) / floored / open | 69 (61) / 6 / 0 | 69 (61) / 6 / 0 |
| crossing pool | 6 | 6 |
| generated | 36,558 | 36,558 |
| scored | 8,437 | 8,437 |
| rejected | 28,121 | 28,121 |

- The eight new nodes are the seven new map rows (type obstruction, not live) and `ctl-BLS`. The parsed row count rises by 7, the number of rows added.
- `merge_outcomes.py` had not been run since the learn steps began writing `outcomes.json` entries directly. Its rerun rewrote 24 entries (rounds 11 to 13) from `outcomes/*.json`: fields `batch`, `defeatedBy`, `notSeparated`, `controlsText` filled; `note` regenerated without the learn-step prefix "round N, score 0, referee holds:"; no field lost, no verdict changed, entry count 124 unchanged; `closed_families.json` and `nodes/nodes-15.json` identical to before. The filled `defeatedBy` lists are keyword readings of the lanes' control text and include controls recorded as passing (the field name is the script's).
- The 65 new control-defeats edges: from the filled `defeatedBy` lists of those outcome entries and from the defeated-by cells of the seven new rows (by source: `ctl-NR` 18, `ctl-DH` 13, `ctl-EA` 11, `ctl-EISW` 5, `ctl-WT` 5, `ctl-THIN` 4, theta^w 3, `ctl-U` 3, others 3; not traced edge by edge). `ctl-BLS` has no edge: row cells are read with the fixed code list of `build_graph.py` (`CONTROL_CODE_RE`), which does not contain BLS (nor UNIV), and no reader node matches its keyword. `build_graph.py` is outside this lane's write set; adding the two codes to the list is a one-line change for the engine owner.
- Top 60: all 60 candidates unchanged with unchanged scores (rank 1 `zv-theta-kernel-phi` x `tro6-natural` x `euler-detection-depth-law`, 11.5). No open device node; the list was not read as lane proposals. The six new device types have no node, so they reject no candidate; they are a record for the planner (closed device list 39 -> 45). Limit unchanged from rounds 11 to 13: the generator cannot propose a device type with no node.
- `campaign/scoreboard.py` rerun through `scripts/memcap.sh 8` after a syntax check (log `push/c14-repair-map-engine-checkpoint-record/scoreboard_rerun.log`; previous files in `before/`): headline unchanged, 1 of 4 (`c1-leeyang-krein-limit`); lanes 114, hold rate 90.4%, three-referee statements 1 (0 about zeros), all unchanged. Part C against the file of 15:27Z: nodes 1,671 -> 1,685 (six from the round-14 planner rerun, eight from this lane), tags 360 -> 398, families 64,620 -> 79,003, closed 2,811 -> 3,019, tried and not closed 525 -> 538, open and untried 61,284 -> 75,446. These moves were not attributed between the planner rerun and this lane; the tag count rises because six round-13 outcome nodes and seven rows entered the graph since the previous scoreboard.
- Second run (same lane, same day; log `push/c14-repair-map-engine-checkpoint-record/engine_rerun.second.log`): one sentence of the new row G34 was reworded by the lane's own check (the direction of the Littlewood-type statement), the map was rebuilt from `before/OBSTRUCTION_MAP.md` with the corrected script, and `build_graph.py`, `generate.py --top 60` and `campaign/scoreboard.py` were run again: every count of the table and the top-60 list are identical. Between the two scoreboard runs another lane (`c14-joint-pair-design-ratio-vortex-cross-bridge`) appended its line to `campaign/lanes.jsonl`: lanes 114 -> 115, lanes at score 0 112 -> 113, open lemmas decided 75 -> 78, one history row for round 14; headline still 1 of 4 (`c1-leeyang-krein-limit`), hold rate 90%. That move is not this lane's. Third run (log `engine_rerun.third.log`): one sentence was added to the introduction of map section 3.9 (rows D8, D9 come from later lanes; not a table row), the map was rebuilt again from the copy, and `build_graph.py`, `generate.py --top 60`, `scoreboard.py` rerun: counts and top 60 identical; by then a second round-14 line had been appended to `campaign/lanes.jsonl` by another lane (lanes 116, one not yet refereed), headline unchanged.

## Round 15 repair slot (2026-11-19, lane `c15-repair-record-strategy-v4-report`)

- `build_graph.py`, one line: `CONTROL_CODE_RE` now starts `(NR-vec|BLS|UNIV|DH|...`. BLS and UNIV were owed since round 14; NR-vec is listed before NR so that the string "NR-vec" in a row cell is not read as T-NR. Syntax-checked with `python -m py_compile`; previous file `scratch/build_graph.pre-c15-repair.py`.
- `curated/controls.json`: control `NR-vec` (local-vector control on the double cover; definition as repaired by the referee of `c14-theta-orthogonal-metaplectic-eigenobject`). Controls 19 -> 20.
- `curated/mk_devices.py` (previous file `scratch/mk_devices.pre-c15-repair.py`): five device types of round 14, each closed on the independent referee pass of its lane and with no node: `laxphillips-hecke-norm-outside-l2` (four named norm families), `joint-pair-ratio-crossgram-twist-transfer`, `lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal`, `catalogued-x2-inequality-torus-parameter-eigenobject`, `dictionary-dj-joint-pair-sign-functionals` (MEASURED, finite search, lane-defined lifts; no map row). Evidence of `kacmoody-loop-eisenstein-maass-selberg`, `fourier-interpolation-zero-nodes`, `lrs-amplification-eisenstein-at-zero` carries restrictions 6, 7 to 9 and 10 of `c14-referee-r13-independent`. Pending: RS-1, RS-2, RS-3 removed; one entry per read class U1 to U8 with no lane (U3; U6 cells (e), (f), (g); U8); the Lax-Phillips proposal moved to devices. Pending 9 -> 8.
- `merge_outcomes.py` was NOT run (round-14 lesson 7). `outcomes.json`, every file of `outcomes/` and `closed_families.json` are byte-identical before and after (sha256; `push/c15-repair-record-strategy-v4-report/ref_checks.json`).
- Map input changed by the same lane: rows G37 to G40 added (198 -> 202 labelled rows), 11 existing lines edited (the 13 label restrictions; notes NR-vec and Lemma F added; five rows of section 7).
- Rerun through `scripts/memcap.sh 8`: a baseline run of `build_graph.py`, `generate.py --top 60`, `campaign/scoreboard.py` before any edit (log `push/c15-repair-record-strategy-v4-report/engine_rerun.baseline.log`), then `curated/mk_devices.py` and the same three after the edits (log `engine_rerun.log`).

| quantity | on file at start | baseline rerun (no edit) | after the edits | attributed to |
|---|---|---|---|---|
| device types closed / floored / open | 45 / 1 / 0 | 45 / 1 / 0 | 50 / 1 / 0 | five round-14 types |
| pending proposals | 9 | 9 | 8 | RS-1..3 out, U3 / U6 / U8 in, Lax-Phillips proposal to devices |
| controls | 19 | 19 | 20 | NR-vec |
| map rows parsed | 234 | 234 | 238 | G37 to G40 |
| nodes (live) | 1,690 (963) | 1,690 (963) | 1,695 (963) | four row nodes, `ctl-NR-vec` |
| nodes of type obstruction / control | 662 / 54 | 662 / 54 | 666 / 55 | same |
| edges | 9,002 | 9,002 | 9,020 | 18 control-defeats edges, below |
| control-defeats edges | 848 | 848 | 866 | below |
| outcome entries | 132 | 132 | 132 | not touched |
| generated / scored / rejected | 36,558 / 8,437 / 28,121 | same | same | - |
| top 60 (node keys, order, scores) | - | identical to on-file | identical | - |

- The 18 new edges, all of type control-defeats, traced edge by edge: 17 from the defeated-by cells of the four new rows (`ctl-NR` 4, `ctl-BLS` 4, `ctl-DH` 3, `ctl-EISW` 3, `ctl-THIN` 1, `ctl-WT` 1, `ctl-NR-vec` 1) and 1 from the regex change on an existing row (`ctl-BLS` -> `row-D9`). UNIV received no row edge: no defeated-by cell of the map names it (it is a filter described in a section 2 note and named in the route or "stops" cell of row P54 only). The edge type is the builder's name; a cell that says a control passes a device and a cell that says a control is not formulable both produce the edge when the code is printed.
- Top 60: keys, order and scores unchanged (rank 1 `zv-theta-kernel-phi` x `tro6-natural` x `euler-detection-depth-law`, 11.5). 16 of the 60 candidates have a changed `rowsChecked` list (rows entering: G40 in 8, G39 in 6, D9 in 5, G37 in 3, G38 in 2). The five new device types have no node and reject no candidate. The U-classes have no node: the generator cannot propose a device in a silent class.
- `campaign/scoreboard.py`: headline 1 of 4 (`c1-leeyang-krein-limit`), hold rate 90.2%, lanes 122, PROVED broken 11, three-referee statements 1: unchanged at the baseline run and after the edits. Part C: the file found at start (17:52Z) showed 1,685 nodes; the baseline run moved it to 1,690 nodes, 566 marked closed, 423 tags, 89,253 families (3,190 closed, 651 tried, 85,412 untried), which is the graph left by the round-15 planner rerun (five round-14 outcome nodes) and not an effect of this lane; the edits moved nodes to 1,695 and nodes marked closed to 570 (the four rows) and nothing else.

## 2026-11-19, strategy review after round 15 (STRATEGY version 5)

- Baseline rerun through `scripts/memcap.sh 8` with the old weights after the round-15 learn step: `build_graph.py` (1,701 nodes, 963 live, 238 rows, 9,025 edges; six round-15 outcome nodes added, obstructs edges 265 -> 270), `generate.py --top 60` (36,558 generated, 8,437 scored, 28,121 rejected): top 60 identical in keys and scores to the list on file.
- `generate.py`, dict `WEIGHTS`: separator 3 -> 1.5; new keys `cheapMeasured` 0.25 (the measured / certified / tool part of the cheap-test score, was 1) and `cheapNamed` 1 (the named open lemma or conjecture part, unchanged). Reason and evidence: `../campaign/STRATEGY.md` section 5, v5 entry. Previous file `scratch/generate.before-strategy-v5.py`.
- Rerun `generate.py --top 60` with the new weights: 44 of 60 keys in common with the baseline, 16 new; rank 1 `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural` at 10.25 (former rank 3); former rank 1 at rank 5 (9.25); topWithOpenDevice 0, topWithFlooredDeviceOnly 60, topWithClosedDevice 0.
- `merge_outcomes.py` not run. `outcomes.json` and `closed_families.json` byte-identical before and after (sha256 in `scratch/rerun-strategy-v5.sha.before`).
- `campaign/scoreboard.py` rerun: headline, lanes (130), hold rate and lemma count unchanged; part C moved with the graph rebuild (nodes 1,695 -> 1,701; tags 423 -> 462; tag-pair families 89,253 -> 106,491; closed 3,305 -> 3,618; tried 592 -> 610; untried 85,356 -> 102,263). Previous file `scratch/SCOREBOARD.before-strategy-v5.md`.
- Not done by this review: device states and pending proposals in `curated/` (round-15 rows and the silent cells of ROADMAP section 13.2 have no node); outcome records for the screening lanes `push/s1-*`.


## 2026-11-20, campaign round 17, repair lane B (`c17-repair-owed-record-r16-cell-nodes`): node type `cell`, round-16 rows

Record lane; no attack; nothing here is a statement about zeros of zeta. Full account, with the entry-by-entry top-60 table: `../push/c17-repair-owed-record-r16-cell-nodes/RESULT.md` and `top60_before_after.md` there. Also covers the two entries owed by `curated/CHANGELOG_c16-repair.md` (this log entry; the `CONTROL_CODE_RE` line).

What changed in the engine.
- `curated/mk_devices.py`, `curated/devices.json` (previous files `scratch/mk_devices.pre-c17-repair.py`, `scratch/devices.pre-c17-repair.json`): the eleven `silent-cell-*` entries left the device list. They are the new list `CELLS` (key `cells`, type `cell`, states `cell` / `tried-not-closed` / `closed`; key `cellStates` documents them). Planner decision of round 17 (`../campaign/ROUND_LOG.md`, "Round 17 allocation"): read classes, not crossing devices. States: U2-POS closed (identification, Theorem P of `c16-pos-fe-u2-positivity-rigidity`); U6 (g) tried-not-closed; the other nine `cell`. Evidence of `fejer-section-prime-chain-growing-p` (Proposition 5 decided) and `dictionary-dn-nonhomogeneous-pair-triple-sign-functionals` (canonical tier closed as MEASURED) carries the round-16 outcomes. Pending: Proposition 5 and the DN canonical tier removed; the rank-2 closure question added; the amplifier item `T < N` set to `tried-not-closed` with the disposition of the fired clause S2 (set aside; the clause had no control comparison; EIS-w shares the excess; no follow-up lane).
- `build_graph.py` (previous file `scratch/build_graph.pre-c17-repair.py`): `load_cells()`; a cell node gets the field `cell` and the role `cell`, never `device`; `meta.counts.cells`; `CONTROL_CODE_RE` gains the codes NR-q, ZQ, SG.
- `generate.py` (previous file `scratch/generate.pre-c17-repair.py`): rule `cell`. A cell node is scored as any tagged node: not in the device pool, no device weight, does not satisfy the R4-device rule, none of the open-device exemptions (family match by device text, reuse penalty, flow-side and mean-value majority penalties, per-device cap). A candidate with a closed cell node is rejected ("contains a closed cell"). Candidates list their cell members under `cells`; `meta.r4Rules` has `cellNodesLive` and `topWithCell`. Weights unchanged.
- Not changed: `merge_outcomes.py` (not run), `outcomes/` and `outcomes.json` by this lane, `closed_families.json`, `nodes/`. All eight round-16 lanes already had an outcome record. Ten files `outcomes/s2-*.json` were written by the screening arm while this lane ran (16:42 local).

Reruns, each through `scripts/memcap.sh 8`: baseline (`build_graph.py`, `generate.py --top 60`, `../campaign/scoreboard.py`) before any edit; stage 1 after the cell change; final after the map rows. Logs under `../push/c17-repair-owed-record-r16-cell-nodes/{baseline,after1,after}/`.

| quantity | on file at start | baseline rerun | stage 1 (cells) | final (cells + map rows) | cause |
|---|---|---|---|---|---|
| device types closed / floored / open | 53 / 1 / 11 | same | 53 / 1 / 0 | same | eleven silent-cell types moved to `cells` |
| cells (cell / tried-not-closed / closed) | none | none | 9 / 1 / 1 | same | new node type |
| pending proposals | 7 | 7 | 6 | 6 | two decided in round 16, one added |
| device nodes in graph closed / floored / open | 69 / 6 / 11 | same | 69 / 6 / 0 | same | as above |
| map rows parsed | 241 | 241 | 241 | 244 | rows D10, P56, G42 |
| nodes (live) | 1,724 (974) | same | same | 1,727 (974) | three row nodes |
| edges | 9,118 | 9,118 | 9,122 | 9,127 | next two lines |
| composes-with | 7,559 | 7,559 | 7,563 | 7,563 | 61 added, 57 removed; 40 and 56 of them touch a `silent-*` node; the rest are second-order changes of the per-node lists. Cause: the role `device` left the eleven nodes, so the pairing reason "limit mechanism + arithmetic input" no longer applies to them |
| control-defeats | 871 | 871 | 871 | 876 | `ctl-BLS`, `ctl-DH`, `ctl-EISW`, `ctl-ZQ` -> `row-D10`; `ctl-EISW` -> `row-G42` (the ZQ edge needs the new regex code) |
| generated / scored / rejected | 52,367 / 19,088 / 33,279 | same | 38,082 / 8,432 / 29,650 | same | device pool 17 -> 6 nodes |
| rejected "no open or floored crossing device" | 13,534 | same | 14,549 | same | cell nodes no longer satisfy the rule |
| rejected "contains a closed cell: silent-cell-u2-pos" | - | - | 49 | 49 | new rule |
| top 60 with an open device / floored only / closed device | 57 / 3 / 0 | same | 0 / 60 / 0 | same | all 57 open-device entries stood on a `silent-*` node |
| top 60 with a cell member | 57 (as devices) | same | 2 | 2 | rank 13 (U6 (a), 8.25) and rank 44 (U6 (e), 3.0), each as the open-lemma member of an M3 triple that also has a floored device |
| top 60 keys in common with the baseline | - | 60 | 1 | 1 | former rank 50 is rank 9 |
| rank 1 | `silent-u8-...` x `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` (12.03) | same | `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural` (10.25) | same | the rank 1 of the list before the silent cells were entered |

- Baseline: `IDEA_GRAPH.json` and `CANDIDATES.json` byte-identical to the files on file. `scoreboard.json` on file was older than the graph (part C: 1,718 nodes, 462 tags, 106,491 families); the baseline rerun moved it to 1,724 nodes, 585 marked closed, 485 tags, 117,370 families (3,797 closed, 861 tried, 112,712 untried). Cause: the graph rebuild of the round-16 repair lane and the round-17 planner, after which the scoreboard had not been rerun.
- Against the last list made before the silent cells existed (`../push/c16-repair-owed-record-r15/after1/CANDIDATES.json`; 8,437 scored): 45 of 60 keys in common, 39 with the same score, 6 differing by 0.01 in the cohesion part (tag weights shift because the eleven nodes are still live tagged nodes). 15 left the list: 4 are no longer enumerated, 11 have the same score and are displaced by the selection caps; 15 entered, 2 of them with a cell member. Detail: `top60_vs_presilent.json`.
- 23 of the 8,432 scored candidates have a cell member (best score 8.25). No cell member carries a device weight.
- Final against stage 1: keys, order and scores of the top 60 identical; 35 entries have a changed `rowsChecked` list (P45 enters 18, P56 enters 15, Q30 enters 3).
- `../campaign/scoreboard.py`: headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4), hold rate 91.3%, PROVED broken 11, three-referee statements 2 (about zeros: 0): unchanged. Changed numbers, attributed by rerunning the script on a copy with the lanes file and the outcome directory as they stood before this lane (`scoreboard_attribution.json`): by this lane, nodes 1,724 -> 1,727 and nodes marked closed 585 -> 588 (the three row nodes); by files of other lanes written meanwhile, lanes run 148 -> 149 and score-0 lanes 146 -> 147 (line of `c17-u6e-bost-connes-non-invariant-state-twin-ladder` in `lanes.jsonl`), outcome records 158 -> 168 (`outcomes/s2-*.json`), lemmas decided 125 -> 130, families tried-not-closed 861 -> 988, untried 112,712 -> 112,585.
- Limits. The keyword tagger gives the new row nodes tags by word match (`row-D10`: automorphic, heat-flow, hecke, pair-correlation; `row-P56`: euler-product, hecke, theta, zero-free); these are builder labels, not readings. With `--no-r4-rules` the closed-cell rejection is off together with the other device rules. The generator still cannot propose a device type that has no node, and after this change it has no open device node: every listed candidate stands on a node of the one floored device type `coherent-set-large-sieve` (`tro6-natural`, `qrh-seven-eighths`, `seven-eighths-abscissa-formula`, `map-open-2`, `map-open-4`; 12 entries each, the per-device cap), which is part-B work.

## 2026-11-19, campaign round 18, repair lane B (`c18-repair-owed-record-r17-open-device-nodes`): cell states after round 17, two proposed open device nodes, round-17 rows

Engine counts only; nothing here is a statement about zeros of zeta. Files of the lane: `../push/c18-repair-owed-record-r17-open-device-nodes/` (scripts `edit_engine.py`, `edit_engine2.py`, `compare_top60.py`, `attrib_counts.py`, `geo_best.py`; logs under `logs/`; previous files under `before/`).

- `curated/mk_devices.py` (previous file `scratch/mk_devices.pre-c18-repair.py`), `curated/devices.json`: block `R17_CELLS` sets the cell states after round 17: `silent-cell-u3` (read as an inequality), `silent-cell-u6e`, `silent-cell-u6f` closed, one referee each; `silent-cell-u6g` stays tried-not-closed; `silent-cell-u8` stays a cell (dictionary DU closed as MEASURED; the class beyond DU open); evidence lines for U4 and U6 (c). Cells: 9 / 1 / 1 -> 6 / 1 / 4 (cell / tried-not-closed / closed). Block `PROPOSED` and two entries of `D`: device types `tz-one-sided-completion-bound-band` and `exact-relation-rigidity`, state `open`, with the fields `status` ("proposed, untested ..."), `sources`, `entryConditions` (five each), `controlsThatMustFail`. Device types 54 -> 56 (closed 53, floored 1, open 0 -> 2). An assertion forbids a cell node among the device nodes. Two pending entries carry their round-17 state.
- `nodes/nodes-22.json` (new): one node per proposed type, type `open-direction`, status `conjectural`. Declared tags: `weil, toeplitz, hankel, explicit-formula, functional-equation, bridge, antibridge, turan` and `rigidity, identification, functional-equation, klein, spinor, twin-ladder, bost-connes, hecke`. The geometric-program tags are those of the carriers named in the round-18 allocation (lanes 2 and 6); they are one reader's choice and decide which partners the generator proposes.
- `build_graph.py` (previous file `scratch/build_graph.pre-c18-repair.py`): `load_devices()` carries the field `status` into `n['device']`. No other change.
- `generate.py` (previous file `scratch/generate.pre-c18-repair.py`): rule `proposed`. A device node whose type has a status beginning with "proposed" is an open device for the R4-device rule and for the weight `deviceOpen` (2) and keeps the rejection exemption "closed family matched by the device text alone". The three penalty waivers of an open device (reuse of a node of a closed lane; flow-side majority; mean-value majority) are not applied to it. Option `--proposed-waivers` applies them (comparison run). A note is added to each candidate with a proposed member; `r4Devices` entries carry `status`; `meta.r4Rules` has `proposedDeviceNodes`, `proposedWaivers`, `topWithProposedDevice`, `topPerProposedNode`.
- Not changed: `merge_outcomes.py` (not run), `outcomes/`, `outcomes.json`, `closed_families.json`, weights. All eight round-17 lanes already had an outcome record (checked: verdict, one referee, holds); none was written.

Reruns, each through `scripts/memcap.sh 8`: before any edit and after all edits (`build_graph.py`, `generate.py --top 60`, `../campaign/scoreboard.py`).

| quantity | before (rerun) | after | cause |
|---|---|---|---|
| nodes / live | 1,732 / 974 | 1,737 / 976 | two device nodes (live), three row nodes |
| map rows parsed | 244 | 247 | rows P57, G43, Q31 |
| edges | 9,129 | 9,189 | composes-with 7,563 -> 7,609; control-defeats 876 -> 889; restates 188 -> 189 |
| device nodes closed / floored / open | 69 / 6 / 0 | 69 / 6 / 2 | proposed types |
| candidates generated / scored | 38,082 / 8,432 | 44,431 / 12,315 | 1,827 scored candidates contain the first proposed node, 2,330 the second, 12 both; 277 rejections "closed cell" |
| top 60: open device / floored only / closed device / with a cell member | 0 / 60 / 0 / 2 | 24 / 36 / 0 / 2 | 12 entries per proposed node (the per-device cap) |
| rank 1 | `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural`, 10.25 | same partners x `tz-one-sided-completion-bound-band`, 11.25 | weight 2 against 0, cohesion |
| keys in common | | 23 of 60 (22 with the same score) | 37 left: 33 still scored (32 with the same score) and displaced, 4 not among the scored candidates of the new run (one contains the now closed cell `silent-u6e`; three contain `map-open-4`, cause not determined: the generator's partner lists are capped and shift when nodes enter) |

- With `--proposed-waivers`: the same counts (24 / 36 / 0), the same rank 1, 56 of 60 keys in common with the final list. The penalty waivers move four entries.
- Limits. The generator ranks by tags; rank 1 joins its partners to the proposed node by the tags `bridge` and `shear` only and is not usable (`../campaign/PLANNER_NOTE_R19.md`). The cap of 12 per device node fixes the split 12 / 12 / 36. The row tagger gives the new row nodes tags by word match (`row-P57`: euler-product, pair-correlation; `row-G43`: heat-flow). Lane `c18-exact-relation-rigidity-klein-spinor` (0 referees) reports the second type closed for the relation multiplicativity: its state is to be set by the next record lane on a referee file.
