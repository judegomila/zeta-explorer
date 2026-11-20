# Roadmap: attack paths generated from the idea graph (batches 1 and 2, 2026-11-17; campaign state after round 5 in section 10, 2026-11-18)

Status of every statement below: RH is open. Nothing here is a result about zeros. The roadmap orders work; it does not rank likelihood of success. Row ids (P1, Q10, N25, ...) refer to `../push/OBSTRUCTION_MAP.md` and the syntheses in `../push/`; node ids refer to `IDEA_GRAPH.json`.

## 1. The wall

Every one of the 154 closed rows (118 in the map, 25 in the overnight synthesis, 7 automatic-positivity rows, 4 positivity-residual rows) stops at one requirement, which has three parts.

- **R1, all primes together.** The step must use a(mn) = a(m)a(n) with unimodular local parameters at every prime jointly. Positivity, size or support of Lambda(n) with the functional equation is not enough (rows P6, Q4, G11; three independent proofs).
- **R2, uniform in height, every window.** Mean values give densities (rows P27, P29, Q9, Q18, Z17). Finite stages restate verified height (P3, P5, G7, Q15, S5-S7).
- **R3, fails for each control for a structural reason.** Controls in the graph: `ctl-DH`, `ctl-HEAT`, `ctl-TW+`, `ctl-TW-`, `ctl-EA`, `ctl-NR`, `ctl-B`, `ctl-U`, `ctl-THW`, `ctl-PA`.

What must be crossed: the prime chain is absolutely summable on Re s > 1 and square-summable on Re s > 1/2 (row Q10). Statements pass from Re s > 1, or from finite stages, to the critical line only by three known devices: convexity or mean values (lossy), exact uniqueness (no inequality), the residue theorem (exact, no sign) (row S1). An attack needs a fourth device.

## 2. The DAG

```
            inputs                          crossing device                       target
 [A] arithmetic node (R1) --------+
 [R] rigid identity / object -----+--> [C] device that carries an inequality --> one-sided bound, every height
 [P] measured zeta-only fact -----+        from Re s > 1 or finite stages          (rows P10, T2: any finite
 [L] open lemma ------------------+        to Re s = 1/2                           one-sided bound suffices)
                                                   |
                                   [K] controls: each must fail at a named step
                                   [W] closed rows: candidate must not be a sub-combination
```

Edges in the graph: `uses`, `restates`, `special-case-of`, `obstructs` (row -> node), `control-defeats` (control -> row or node), `separates-from` (node -> control it is recorded to fail for), `composes-with` (shared object and complementary properties).

Crossing devices found in the corpus, by type, with the row that closes each or the candidate that tests it:

| Device | Nodes | State |
|---|---|---|
| convexity / mean value | large-sieve, mollifier, pair-correlation nodes | closed: MV-CAP rows |
| exact uniqueness | fe-plus-reality-rigidity, phase-retrieval-zeta | closed: identifies the function (L2, P6) |
| residue theorem / explicit formula | pick-weil-native-span, offline-zero-visibility-law | closed: P1, P8 |
| positive-kernel (Harnack) transport | harmonic-strip-transport, h5-euler-products-bounded | closed in the 2026-11-01 attempts; N7 |
| Landau one-sided lemma | landau-one-sided-target, landau-transport-lemma-l, v7-floor-theorem-c | target of 9 of 15 direct attempts; needs a positive object: candidates 1, 6, 8 |
| compactness of dual measures over the integers | cofinal-legendre-dual, rig-continuum-sawtooth | open: candidate 1 |
| recurrence / unique ergodicity plus density | bagchi-strong-recurrence, tinfty-flow-generator-spectrum | open: candidate 3 |
| Euler phases with the functional-equation phase at one height | dbn-prime-torus-phase-closure, euler-fe-coupling-at-height | open: candidate 2 |
| self-adjoint operator (Selberg) | selberg-control-pair, selberg-zeta-companion | open as control and companion: candidate 4 |
| monotone flow functional | discriminant-gradient-flow, resolvent-burgers-identity, heat-evolved-von-mangoldt-positivity | forward-only so far (F1); coupling to the prime cascade open: candidate 9 |
| coherent-set / large-sieve (7/8 type) | qrh-seven-eighths, seven-eighths-abscissa-formula, tro6-natural | only device that meets R1-R3; floors 5/6 with r = 6; order 2 open: candidate 7 |
| geometric positivity (Neron-Tate, Hodge index) | heegner-height-upper-bound-h4prime, spec-z-squared-hodge-index | T3, A4, N5, N6 closed neighbours; averaged span open: candidate 10 |

State of the table after campaign round 4 (lane `c5-repair-engine-map-r4`, 2026-11-18): the states are kept in `curated/devices.json` and override the column above. Closed: 17 device types (every row above except the coherent-set row, and the four devices named in round 4). Floored: the coherent-set / large-sieve type (floor 5/6 at r = 6). Open: effective order 2 in the 7/8 architecture, quadratic positivity with automorphic companions (untested), the additively twisted discrepancy hypothesis (lane running; closed in round 5, see section 10). Proposals without a node are listed under `pending` in that file.

## 3. Families the generator produces

`generate.py` builds five typed moves and assigns each candidate a theme from its tags. Counts from the run of 2026-11-17 (60,821 generated; 3,510 rejected by hard filters; 57,311 scored).

| Move | Meaning | Candidates |
|---|---|---|
| M1 | rigid structure x arithmetic input x crossing mechanism | 35,265 |
| M2 | measured phenomenon x explaining mechanism x control | 2,246 |
| M3 | open lemma x proved tool x arithmetic or crossing partner | 14,023 |
| M4 | flow functional x prime-side input x crossing or DH-separator | 5,304 |
| P2 | under-used node x arithmetic partner | 473 |

| Theme | Closed rows touching it | State after the campaign |
|---|---|---|
| positivity (Weil, Pick, de Branges, Toeplitz, bridge, shear, Lee-Yang) | 57 | closed as stated: every form is an identity that holds for a control, or RH restated (P1-P34, G1-G9, Q1-Q9, A1-A3). Open only with a new crossing device. |
| zero-free (7/8 method, sieve, theta, mollifier) | 68 | the one mechanism passing R1-R3; floors known (Z15, Z16). Open: effective order 2, non-symbol rows. |
| prime-chain (Euler product, Hecke, explicit formula, Landau) | 39 | closed for sections, coverage and local conditions (Q10-Q13, L1-L5, S4). Open: integer-side inputs (candidate 1, 6), one-height coupling (candidate 2). |
| geometry (torus, Klein, twistor, function field, trace formula) | 29 | closed for the tested structures (G10-G21, T1-T3, N1-N8, N22-N24). Open: Selberg control, Heegner span. |
| flow (heat flow, Lambda, collisions) | 27 | closed as a route to zeros (F1-F7: no converse from Lambda). Open only as a source of monotone functionals coupled to primes. |
| statistics (pair correlation, mean values) | 17 | closed by MV-CAP unless paired with a propagation step (candidate 3). |
| nyman (Nyman-Beurling, Vasyunin, cotangent sums) | 4 | P14, P15 close the rate law and first moment. Period-function structure untested (candidate 5). |

Hard filters applied by the generator: no member uses multiplicativity (2,914 rejected: DH passes); all members flow-stable and none arithmetic (578: backward heat passes); all members attached to one closed row (13); all members from one module (5). Soft penalties: member attached to a closed row; no member on the functional-equation side (sign twist, unimodular twist and Beurling pass); only mean-value objects; an RH-equivalent statement with no separate lever; overlap with a lane in progress.

## 4. Reading of the top of the ranking

The score follows reader labels and shared tags. It cannot tell a mechanism from a restatement. The top 40 of this run were read by hand; outcome:

- Ranks 1, 17 (`pick-weil-native-span` or `gauss-plancherel-alias-lemma` with `euler-fe-coupling-at-height`): the arithmetic member is an open lemma stating a need, and the rigid member is row P1 (holds for DH). Restatement with no lever. Discarded.
- Ranks 2, 4 (`star-min-pointwise-prime-bound` with `dbn-prime-torus-phase-closure` or `tinfty-flow-generator-spectrum`): the node itself records that the torus bound misses by 3.03 to 2966; anything torus-valid holds for every phase assignment. Discarded; the surviving idea (orbit, not torus, with the functional-equation phase) is candidate 2.
- Ranks 3, 5, 6, 8-10, 14, 16, 25, 26, 40 (flow lanes: `w3-tail-lemma`, `backward-flow-displacement-residual`, `h-desc-mirror-palm-surplus`, `joint-h3-h4-minimal-input`): outputs are bounds on Lambda; row F3 records no converse from Lambda to zeros. Kept for the Lambda lane, not for RH.
- Ranks 7, 11 (`capture-ratio-psd-slope`): kernel-only small-shear norm; the shear statement is false at large a (row P20). Discarded.
- Ranks 13, 32-35 (Route M first-moment and sign-law nodes): row P15; a first-moment bound rejects the turnover and does not give d_N -> 0. Discarded; the untested part is candidate 5.
- Rank 12 (`selberg-freeze-sandbox`): absorbed into candidate 4.
- Ranks 31, 36, 38 (K_a >= 0, Krein floor with function-field identities): rows P19, P20, T1-T3. Discarded.

The ten candidates of section 5 were selected by hand from the graph, with the generator used to enumerate partners (`--node`). Their heuristic ranks are low (best-matching generated triples rank from 662 to 39,988); this is a defect of the scoring, recorded here and in README.

## 5. Order of attack (batch 1)

Order: cheapest decisive first test first; candidates that change the filter (controls) early.

| # | Slug | Family | Node ids | First decisive test | Closed rows checked |
|---|---|---|---|---|---|
| 1 | e1-cofinal-legendre-dual | integers + compactness of dual measures | cofinal-legendre-dual, rig-continuum-sawtooth, plant-suppressed-by-zeta-rho0, legendre-lcm-identity, legendre-lp-nu1 | do rescaled optimal LP duals converge (x = 1e4..3e6) | T2, P10, P13, N7 |
| 2 | e1-rs-torus-laguerre-orbit | Euler phases + functional-equation phase at one height | dbn-prime-torus-phase-closure, euler-fe-coupling-at-height, euler-product-torus-parametrisation, bridge-winding-equals-NT, laguerre-hierarchy | measure of the Laguerre-negative set on the torus against the true orbit segment, zeta and DH, N = 10..300 | S4, Q13, Q11, A5, OBS-IDENTITY-SOLENOID |
| 3 | e1-sparse-recurrence-amplifier | propagation + density | bagchi-strong-recurrence, euler-product-torus-parametrisation, tinfty-flow-generator-spectrum, large-sieve-density-selector | prove the sparse criterion; count returns for a DH off-line zero and for zeta near-zeros | P27, P29, Q9, Q10, Z17 |
| 4 | e1-selberg-twist-control | control with Euler product and functional equation | selberg-control-pair, selberg-freeze-sandbox, selberg-zeta-companion, pole-coupling-theorem-pc, selberg-phase-gate-vs-zeta | Has/Lacks row; one exceptional zero located; sigma* of the companion | S1, N1, N2, L1, G10 |
| 5 | e1-nb-gram-period-transfer | Nyman-Beurling Gram x period function x transfer operator | vasyunin-gram, cotangent-reciprocity-period-function, vasyunin-lammin-uniform-lower-bound, frobenius-gcd-factorisation, rm-kappa-smooth-open | lam_min and d_N laws for zeta, L(s, chi), DH, N <= 2000 | P14, P15, N1, N2 |
| 6 | e1-forcing-free-bilinear-split | one-sided Landau target through an exact bilinear identity | vaughan-sqrt-type1-exact, vaughan-forcing-law, landau-one-sided-target, legendre-lcm-identity | is the residual forcing polylogarithmic to X = 1e32 | T2, P10, P13, S4 |
| 7 | e1-gl3-theta-order2-rows | 7/8-type mechanism, effective order 2 | map-open-1, separating-probe, mem-new-probe-non-sextic, seven-eighths-abscissa-formula | symbol-type or not; h/r in the method-limit model | Z14, Z15, N19-N21, A6, OBS-ORDER-TWO-NONPOISSON |
| 8 | e1-euler-anchor-heat-certificate | one-height Landau transport with an Euler anchor | euler-anchor-heat-certificate, landau-transport-lemma-l, offline-zero-visibility-law, heat-evolved-von-mangoldt-positivity | is 2 pi^2 c > C attainable for an explicit anchor | Z16, P14, P29, F1, F2 |
| 9 | e1-burgers-cascade-anticausal | flow functional x square-root lane x prime cascade | resolvent-burgers-identity, cole-hopf-viscous-burgers, discriminant-gradient-flow, map-pos-16, map-pos-11, map-pos-12 | monotonicity of the anticausal Hankel norm on planted-pair polynomials | F1, F2, G6, G10, Q4, Q10 |
| 10 | e1-heegner-averaged-nb-span | Neron-Tate positivity x Nyman-Beurling span | heegner-nb-ratio, heegner-height-upper-bound-h4prime, cm-eta-heights-lambda1, nyman-beurling-dx | averaged bracket zero-free in 1/2 < Re s < 1, abs(Im s) <= 50 | N5, N6, P14, G16, T3 |

Full assignments: `curated/batch-1.json`. Expected stop of each is written in its assignment; in eight of ten the expected outcome is a new obstruction row or a control row, not a theorem about zeros.

Dependencies between candidates:
- 4 before any later geometric or transfer-operator candidate: it may reduce the minimal hitting sets of map section 2 to those containing INT.
- 1 and 6 share the Landau target and the Legendre cut; run 1 first (one LP sweep decides it).
- 2 and 3 share the prime torus; if 3 ends at the l^1 / l^2 threshold, 2 must show where the functional-equation phase changes that, or it closes with the same row.
- 7 is independent of the others and is the only candidate on the mechanism that already satisfies R1-R3.

## 6. Batch 1 outcomes (2026-11-17)

Ten lanes, each refereed once. No lane gives a statement about zeros of zeta. Nine precise obstructions and one partial result with no zero information. Records: `outcomes/e1-*.json`; table and referee notes: `ENGINE_LOG.md`.

| # | Slug | Verdict | Where it stops | Control that is not separated |
|---|---|---|---|---|
| 1 | e1-cofinal-legendre-dual | closed | limit points of dual-feasible points have density 0; optima at different x are not sections of one measure | E_a passes every step |
| 2 | e1-rs-torus-laguerre-orbit | closed | the zeta main sum enters the torus exclusion set; the sign is set by the Riemann-Siegel remainder (no margin) | DH satisfies the coupling; heat tilt passes |
| 3 | e1-sparse-recurrence-amplifier | closed | returns are bounded by the zero count: sparse recurrence is equivalent to RH | sign twist |
| 4 | e1-selberg-twist-control | closed | twisted Selberg zeta has real exceptional zeros and reversed sign of the zero side; companion has sigma* >= 1/2 | positive-list items 16-23 do not fail against SEL |
| 5 | e1-nb-gram-period-transfer | partial | lam_min(G_N) = N^(-2+o(1)) proved; same law for DH and non-arithmetic sequences | DH, periodic sequences |
| 6 | e1-forcing-free-bilinear-split | closed | Vaughan forcing is a normalisation; one-sided bound on K'[R] is equivalent to RH | E_a, structured TW+ |
| 7 | e1-gl3-theta-order2-rows | closed | theta rows are of symbol type (h = 0); half-integral weight rows need beta >= 1 | sign twist gives the same rows |
| 8 | e1-euler-anchor-heat-certificate | closed | pair compression deficit of order 1/L^2 with both signs; reach returns the input half-plane | E_a passes the anchor step |
| 9 | e1-burgers-cascade-anticausal | closed | no unitarily invariant norm of Gamma_- is monotone; monotone functionals bound t = 0 only from t < 0 | DH, E_a |
| 10 | e1-heegner-averaged-nb-span | closed | every Heegner bracket is DH-type; the ratio is a distance, smaller for a permuted control | block-permuted family |

What changed in the graph and the generator after the merge (`merge_outcomes.py`, then `build_graph.py`, `generate.py`):

- `outcomes.json` is now generated from `outcomes/*.json`. Each closed lane is an obstruction node `out-<slug>` with `obstructs` edges to the members of its minimal closed set, `uses` edges to the other launched members, and `control-defeats` edges from the controls named in its record (453 control edges in total; before the merge the lane edges were dropped because controls were stored as free text).
- 16 closed combination families (`closed_families.json`; nodes `fam-*`): the ten of batch 1 and six from the round-1 lanes c1-*. The generator rejects a candidate when every pattern of a family matches the joint text of its members. Run of 2026-11-17: 61,200 generated, 14,562 rejected (9,654 by families, 867 by closed node sets, 505 by overlap with a closed lane, 2,944 no multiplicativity, 574 flow-stable), 46,638 scored.
- Round-1 lanes c1-shear-hecke-fricke, c1-multidelay-bohr-section, c1-pd-log-strip, c1-spinor-hecke-primitive and c1-window-sdp-scaling close the map's open items 11, 7, 8, 6 and 10 (`map-open-*` nodes are now rejected as members).
- New nodes (`nodes/nodes-15.json`): `legendre-dual-limit-density-zero`, `legendre-dual-restriction-rule`, `cofinal-pointwise-mobius-sum`, `vaughan-forcing-is-gauge`, `vasyunin-lammin-two-sided`, `selberg-pc-abscissa-half`, controls `ctrl-sel-twisted-selberg` and `ctrl-rz-reciprocal-shift`. Two control codes added to the builder: SEL, PERM.
- Three score parts from the batch-1 lessons: size normalisation named (0-1), non-linear use of positivity named (0-1), integers named (0-1). They are keyword matches.

Lessons used as filters for batch 2:

1. E_a = zeta(s+a) zeta(s-a) is not a counterexample to an argument whose output scales with a; it is one only for arguments whose output does not depend on the size normalisation. A candidate must say which of the two it is.
2. Positivity of Lambda entered linearly in every lane (Landau's lemma or an LP constraint).
3. The attributes that separate zeta from the Selberg family are the integers, order one and the sign of the zero side.
4. Finite stages and finite prime sets carry no information about the limit (lanes 2, 3, 10).

## 7. Reading of the top of the ranking (batch 2)

The top 80 of `CANDIDATES.json` were read by hand against the three requirements. None was launched as generated.

- Rank 1, 2 (`sympow-conductor-normalised-shift` with alias or cotangent partners): the members share tags only. The sym^m node concerns a contraction margin for other L-functions; row P25 closes linear positivity with Sym^m companions and N9 closes even-moment families. No statement about zeta zeros is formed. Discarded.
- Ranks 3, 4, 12, 20 (`lean-weil-small-support`, `pick-weil-native-span`, `m23-*` window positivity): Weil or Pick positivity at bounded support or in one window. Bounded support contains finitely many primes (finite stage); the native-span form is row P1 and holds for DH. Discarded.
- Ranks 5-9, 16, 23, 27-29 (flow lanes: `w3-tail-lemma`, `joint-h3-h4-minimal-input`, `discriminant-gradient-flow`, `field-channel-transfer-modulus`, `backward-flow-displacement-residual`): outputs are bounds on Lambda. Row F3: no converse from Lambda to zeros; lane 9 of batch 1 closed heat-monotone functionals. Kept for the Lambda lane only.
- Ranks 10, 11, 14 (`capture-ratio-psd-slope`, `autocorrelation-moment-ladder`): kernel-only shear statements; they hold for DH and the shear statement is false at large a (P20). Discarded.
- Ranks 13, 30 (tent criteria, `staged-strip-triangular-inequality`): equivalences with a zero-free strip. The staged strip is the 7/8 theorem restated; the tents are the Landau target with a constant margin. No lever by themselves; the usable part (Riesz order) is in candidate 1.
- Ranks 17, 21 (`star-min-pointwise-prime-bound`): the torus bound misses by 3.03 to 2966, and lane 2 of batch 1 closed torus exclusion sets. Discarded.
- Ranks 18, 22, 25 (Route M first moments and sign laws): row P15, mean values of the Gram matrix; lane 5 of batch 1. Discarded.
- Ranks 15, 19, 24, 26 (`sep-opt-lattice-extremal`, alias packets, variance of S(T)): Lambda-certificate objects or pair-level statistics (MV-CAP). Discarded for RH.
- Lower ranks containing `selberg-geodesic-ground-truth`, `ramanujan-cube-satake-point`, Krein floors, function-field identities: closed by lane 4 of batch 1, rows P19, P20, T1-T3, or restatements argued only.

Ideas examined for batch 2 and discarded before launch, with the reason:

- Heat-evolved von Mangoldt positivity with a Landau lemma in t: the property holds for all t >= 0 whatever Lambda is, and E_a has Lambda_a >= 0 with the functional equation and off-line zeros.
- Commuting Hecke dilations on the Krein space of the bridge energy (joint invariant non-positive subspace): the joint eigencharacters of the dilation semigroup are n^-w, which is "zeros are eigenvalues of the dilation generator". Restatement.
- Renewal inequality from lower-bound sieve weights (sum_{d|k} lambda_d <= 0 for k > 1 with sum lambda_d/d = 0): impossible at finite level, since the divisor sum equals 1 on every k coprime to the level. Parity in its classical form.
- Short-interval mean values of zeta at sigma = 2 as a single-window detector (`mv-cap-function-side-gap`): they identify the function (coefficients equal to 1), and say nothing about zeta's own zeros; the error term (H + N) exceeds the footprint of one off-line quartet.
- Rankin-Selberg squares against Eisenstein series at a zero (integral of |f|^2 E*(z, rho) vanishes for every cusp form f): the vanishing is the factor zeta*(s) in the unfolding; rows A3, N3 cover covariant squares and Maass-Selberg kernels.
- Block energy of the Moebius packet in the scale variable (`mobius-packet-energy-target`): by Plancherel it is a mollified second moment with unbounded mollifier length; the rate law (P14) makes each exponent equivalent to a half-plane.

Observation recorded as a control, not as a result: for E_a and for the T-NR twin the largest offset of a zero from the symmetry line equals the largest local defect sup_p log|alpha_p|/log p; for zeta the defect is 0. The statement "offset <= largest local defect" is GRH with defects (row L4) and has no lever attached. The control `ctrl-rz-reciprocal-shift` (1/zeta(s + 1 - b)) is a signed twist with Euler product, continuation and a real zero at b in (7/8, 1); it lacks the integers and the symmetry line 1/2.

## 8. Order of attack (batch 2)

Selection by hand; assignments in `curated/batch-2.json` (written by `mk_batch2.py`), entered in `outcomes.json` as `proposed`. Seven of the ten sit on the two families that batch 1 left least blocked: the integer side with a one-sided Landau target (1, 2), and the 7/8 architecture, which is the only mechanism in the map that fails for every control and in which a mean value over the row family gives a statement at every height (3-9). Candidates 3, 4, 6, 7, 8 can lower the proved abscissa only inside [5/6, 7/8]; candidates 5 and 9 address the order-2 requirement and the exceptional term. Candidate 10 is a filter lane.

| # | Slug | Family | Node ids | First decisive test | Expected stop |
|---|---|---|---|---|---|
| 1 | e2-legendre-riesz-level-phase | integers + positivity | legendre-lcm-identity, legendre-dual-restriction-rule, landau-one-sided-d-bound, one-sided-excess-target, zero-complete-rational-tents, vaughan-forcing-is-gauge | exponent alpha_k(theta) of the certified one-sided excess, Riesz order k = 0, 1, 2, level X^theta, X to 1e6 | alpha = 1/2 at every unconditional level, with a dual certificate proving the floor |
| 2 | e2-cofinal-moebius-pointwise | integers + all primes | cofinal-pointwise-mobius-sum, rig-continuum-sawtooth, legendre-dual-limit-density-zero, spectral-head-mobius-poisson, mobius-interval-sign-reversal | one-sided against two-sided growth exponent of sum_k mu(k) r_b(x/k), x to 1e8, three fixed b | tail is a Mertens-type sum with no one-sided information |
| 3 | e2-below-level-mixed-moment | 7/8 method | map-open-2, map-pos-34, target-0874-restricted-moment, mem-abscissa-formula, sextic-theta-mean-square | measured exponent E of the mixed moment against thresholds 1.1366 / 1.1452 | E above threshold, or the first piece only |
| 4 | e2-tro6-signed-csum-stratified | 7/8 method | map-open-4, tro6-natural, map-pos-30, map-pos-31, probe-equals-theta-row-form, sextic-theta-numerics | row-sensitive statistic per squarefull stratum on the exact Gauss-sum tables | no saving, or saving on strata of density zero |
| 5 | e2-gl3-cover-cuspidal-rows | 7/8 method, order 2 | map-pos-35, map-pos-33, separating-probe, mem-sextic-theta-squarefree | symbol type or not; correlation of the row with mu(d) chi_d(m), d to 1e4 | symbol type or no absorption of Moebius |
| 6 | e2-ms-slot-capacity | 7/8 method | map-open-3, map-pos-34, mem-abscissa-formula, binding-row-bin | extremal configuration for r + 2z < 1 or measured slack in 1 - 2z < r < 1 - z | factor 2 forced, or relaxed slot with abscissa above 5/6 |
| 7 | e2-two-scale-detector-moment | 7/8 method | map-open-13, target-0874-restricted-moment, map-pos-34, mobius-packet-energy-target | saving omega of the class-restricted fourth moment at central length | omega = 0 within error |
| 8 | e2-theta-dual-mseries-fe | 7/8 method | probe-equals-theta-row-form, cubic-r2-conductor-a4, sextic-theta-mean-square, map-pos-31, tro6-natural | dual-length test of a second reflection on tables to norm 1e7 | no second reflection: N14 stands |
| 9 | e2-sixfold-period-z2 | renderer spin sign x 7/8 probe | map-open-5, probe-equals-theta-row-form, zv-spinor-arithmetic-coupling-missing, map-pos-33, qrh-seven-eighths-input | Z/2 character of the exceptional term against the principal signal over 1e3 prime moduli | same character: no separation |
| 10 | e2-control-rz-defect-audit | filter lane | ctrl-rz-reciprocal-shift, rung-toeplitz-euler-detector, map-pos-23, map-pos-22, pole-coupling-theorem-pc | counterexample search for "offset <= largest local defect" among degree <= 2 Euler products | a table and one control row |

Dependencies: 1 before 2 (the LP phase diagram says at which level the Moebius tail matters). 3, 6, 7 share the exact exponent LP of `r3-critical-count`: run one LP harness and reuse it. 4, 8, 9 share the tables in `tmp/sextic/`; they must not extend the tables concurrently (memory). 10 is independent and cheap; its control row should be available before the batch is refereed.

Lanes in progress outside this batch (launched by the main session, not to be duplicated): `c2-cutoff-hecke-defect`, `c2-euler-at-zeros`, `c2-euler-at-zeros-scale`, `c2-euler-cone-fe-rigidity`, `c2-polydisc-leeyang-bound`, `c2-projection-domination-gonek`, `c2-repair-owed-passes`.

## 9. After batch 2

1. Add each lane record to `outcomes/` and run `python3 merge_outcomes.py && python3 build_graph.py && python3 generate.py`.
2. Scoring defects still open: `separator` is detected in 8 live nodes; `heightUniform` is a reader label; the three new score parts are keyword matches. A per-node field `controlsFailed` with the failing step remains the fix.
3. Families with no candidate and no closed row after two batches: arithmetic statistics beyond pair level (every examined form is a mean value; an amplifier is closed by lane 3 of batch 1); adelic constructions beyond the GL(1) test vector (Maass-Selberg rank 1 and 2 are rows N1, N3; semilocal Sonine identities are few-prime stages).
4. The Lambda lane (flow nodes flagged as under-used: `discriminant-gradient-flow`, `field-channel-transfer-modulus`, `joint-h3-h4-minimal-input`, `w3-tail-lemma`) is ranked high by the heuristic and gives bounds on Lambda only. It should be scheduled separately from RH lanes.

## 10. State after campaign round 5 (2026-11-18; matches `../campaign/STRATEGY.md` version 2)

Sections 1 to 9 are the record of batches 1 and 2. This section overrides them where they differ. RH is open; no lane has produced a statement about zeros of zeta. Scoreboard: headline 1 of 4 (`c1-leeyang-krein-limit`, R1 at stage level), 50 campaign lanes refereed once, no lane with R2, R3 or R4.

### 10.1 Batch 2 outcomes (records `outcomes/e2-*.json`)

| # | Slug | Verdict | Where it stops |
|---|---|---|---|
| 1 | e2-legendre-riesz-level-phase | precise obstruction | certified exponent never below Theta (Landau); from level about 2 sqrt X the LP is Dirichlet's hyperbola identity |
| 2 | e2-cofinal-moebius-pointwise | dead | the tail is a Mertens-type sum; the pointwise bound is of RH strength |
| 3 | e2-below-level-mixed-moment | partial | the mixed moment is control-blind; below level the hypothesis is a density-type statement for the twist family |
| 4 | e2-tro6-signed-csum-stratified | partial | squarefull stratification cannot change an exponent; inter-stratum cancellation not excluded |
| 5 | e2-gl3-cover-cuspidal-rows | precise obstruction | order-2 rows need Moebius from the row, shift 0 and a coherent set of relative size 1/2 together; none of the tested rows gives all three |
| 6 | e2-ms-slot-capacity | precise obstruction | a slot lemma uniform in bounded prime coefficients is sign-twist invariant and cannot exceed capacity m/2 |
| 7 | e2-two-scale-detector-moment | precise obstruction | not an independent input; reduces to the below-level mixed moment |
| 8 | e2-theta-dual-mseries-fe | precise obstruction | the m-reflection is target-blind Gauss-sum algebra; hull abscissa equals the input |
| 9 | e2-sixfold-period-z2 | dead (referee does not hold as written) | signal form and Gram form share matrix entries; no grading separates the exceptional term |
| 10 | e2-control-rz-defect-audit | precise obstruction | "offset <= local defect" is GRH with defects |

### 10.2 Device table (source of truth: `curated/devices.json`, written by `curated/mk_devices.py`)

26 device types: 23 closed, 1 floored (coherent-set / large-sieve, the 7/8 type, floor 5/6 at r = 6), 2 open:

- `map-open-1`, effective order 2 in the 7/8 architecture. Narrowed in round 5: re-expression of the same probe is closed (Lemma U), abelian and symbol-type row families are closed (no weight-1 epsilon cocycle), long prime marks are closed inside a transcribed model only.
- `map-open-9`, quadratic or mean-value positivity with automorphic companions. Never tested.

Closed since the table of section 2 was written: Euler phases with the functional-equation phase at one height, Selberg control and companion, monotone flow functionals, geometric positivity (Heegner span), dual-measure compactness, recurrence, FE-symmetrised Euler stage with Rouche, collision index, Hecke compression on the Lax-Phillips space, Helson discrepancy (plain and additively twisted), Baker linear forms, Turan power sums, p-adic interpolation, tensor-power squeeze, Carleson/corona on the bridge symbol, strip Dirichlet-to-Neumann, sum-product. A fourth crossing device (section 1) has not been found.

Pending proposals without a graph node (from `mk_devices.py`): a probe with lx < l in the order-2 ledger; a nonabelian family with a nontrivial weight-1 epsilon cocycle; prime marks with l - lx = 2 checked against the manuscript; Lax-Phillips Hecke norms outside the weighted-L2 family; the non-locality step 4 of the Rouche lane. The six nodes of `push/c5-device-table-extension/nodes.json` are not yet in the graph.

### 10.3 Themes after round 5 (replaces the last column of the table in section 3)

| Theme | State |
|---|---|
| positivity | closed in every tested form, including window forms, cutoff commutators, Lee-Yang stages and their limits, several-delay sections. Open only through `map-open-9`. |
| zero-free (7/8 method) | still the one mechanism with R1, R2, R3. Its R3 input is now read as periodicity of every twist in the conductor aspect (manuscript Lemma 5.8); THIN is the control that keeps complete multiplicativity and has a zero at any b in (1/2, 1). Open: the lemma ORDER-2 below. Refinements inside [5/6, 7/8] move frontier numbers only. |
| prime-chain | closed for sections, stages, stage limits, one-sided bounds in P, partial Euler products at zeros, pole-lattice test multipliers, integer-side dual limits. |
| geometry | closed for the tested structures, including Selberg, Heegner span, torus selectors, canonical-system stages, Lax-Phillips. Not run: square realisation with a point-spectrum intertwiner (lead 7). |
| flow | closed as a route to zeros; Lambda only. |
| statistics | closed (MV-CAP; Landau-Gonek; Matomaki-Radziwill conclusions hold for DH by linearity). |
| nyman | closed (rate law; lam_min law holds for DH). |

### 10.4 Current lead and missing lemma

Effective order 2 in the 7/8 architecture. Abscissa 1 - h/r; proved systems have h <= 1; the critical line is h = r/2.

**ORDER-2 (open).** A probe in the Proposition 2.1 format, for a row family of order r, with signal constant h > 1, whose low estimate is proved from an input not equivalent to GRH for the family and failing for THIN.

Known constraints on a proof: a new probe, not a re-expression (Lemma U); a nonabelian row family with a nontrivial weight-1 cocycle of the epsilon factor; the ledger shows h > 1 only where the reduced system is inconsistent (lx < l), with the false input not identified; at the model point reaching 1/2 (h = 3) the low input is equivalent to GRH for the family (model statement, not checked against the manuscript). All of this is relative to the unrefereed manuscript and preprints.

### 10.5 Order of attack for round 6 (allocation 1 explore / 3 deepen / 2 combine / 1 compute / 1 referee-and-repair)

| # | Kind | Item | First decisive test |
|---|---|---|---|
| 1 | compute | probe I_w of manuscript (6.1) for w = THIN (b = 0.95, class-balanced or random set), Liouville, 1 | both norms of Proposition D at Z = 2^10 .. 2^18: which half fails for THIN |
| 2 | deepen | nonabelian order >= 3 family (double cover of GL(3), map 6.18) | finite check of the weight-1 cocycle of its epsilon factor |
| 3 | deepen | false input in the region lx < l | unreflected marked theta rows: K + D mean square or a (KD)^(2/3) term for 1 + l <= M < 2 + 2l |
| 4 | deepen | h = 3 / GRH equivalence | Theorems B, C of `c5-marks-circularity-order2` against the manuscript text |
| 5 | referee | Lemma U; abstract-family row of the angular lane; Hoheisel exponent in ray classes behind THIN | second referee; sources opened, not recalled |
| 6, 7 | combine | pairs from ROUND_LOG round 5, "Results that could be combined" | each side names the requirement it supplies |
| 8 | explore | `map-open-9`, or a device type absent from `curated/devices.json` | plan names what the device reads and the control of that class; not launched if the control passes every step |

Dependencies: 1 before any further lane on Proposition D; 3 and 4 share the reduced system of `r3-method-limit` (one LP harness); 2 is independent.

### 10.6 Generator after the review

`generate.py` weights are now in the dict `WEIGHTS` (previous file: `scratch/generate.before-strategy-v2.py`): heightUniform 0-3 to 0-1, underused 0-4 to 0-2, floored device 2 to 1, separator 2 to 3, size and nonlinear keyword parts 1 to 0.5. Run of 2026-11-18 after `merge_outcomes.py` and `build_graph.py`: 1,577 nodes (953 live), 60 outcome entries (48 closed), 34 closed families; 36,471 generated, 27,558 rejected, 8,913 scored. Top 60: no closed device, 12 with an open device (all `map-open-9`), 48 with the floored 7/8 device only. Comparison of ranks with outcomes: none of the 240 top-60 candidates of rounds 2 to 5 was launched as generated, and the hand-selected candidates of batch 1 ranked between 662 and 39,988, so the ranking has not predicted an outcome. With two open device nodes the composition of the list is fixed by the per-device cap; a new device type enters only as a new node in `curated/mk_devices.py`. Scoring defects of section 9 item 2 remain (reader labels and keyword matches).

