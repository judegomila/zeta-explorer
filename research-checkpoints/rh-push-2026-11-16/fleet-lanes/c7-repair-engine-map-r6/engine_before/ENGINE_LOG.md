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
