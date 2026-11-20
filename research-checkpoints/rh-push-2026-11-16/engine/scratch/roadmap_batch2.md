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
