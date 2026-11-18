# Round log

## Round 1 (planned 2026-11-18)

State at planning: engine has only `index/` (no IDEA_GRAPH.json, generate.py, nodes/, outcomes/), so no generator ranking was available; candidates were drawn from STRATEGY.md section 4 (standing leads) and OBSTRUCTION_MAP.md sections 5-6. Scoreboard: headline 0 of 4, no lanes recorded. No lead has a referee-confirmed score >= 3, so the three-lane rule does not apply. Allocation follows v1: 3 explore / 2 deepen-repair / 2 combine / 1 heavy.

| slug | kind | lead | targets | reason |
|---|---|---|---|---|
| c1-pd-log-strip | explore | 4.4 #21 | R4 direct | positive-definiteness of log zeta(sigma+iu) is a located Euler-product entry point that separates zeta from DH and cluster lifts; untested left of Re s = 1 |
| c1-shear-hecke-fricke | explore | #24, #9 | R1, R3 | bridge shear at tau -> 0 is the only position where Hecke operators act as scalars; base-side X_0(4) with Fricke w_4 (Klein seam) not tested; torus no-go covers translation-invariant properties only |
| c1-multidelay-bohr-section | explore | #20 | R1, R4 | all section no-go results are single-delay; joint inner sections use Kronecker structure of all primes at one torus point (largest-value form) |
| c1-leeyang-chain-closure | deepen | #11 + repairs | R1, R3 at stage | finite-dimensional decidable question in the only lane with a referee-confirmed structural control failure |
| c1-missing-controls | repair | #27, #12 | filter completeness | low-cost closures scheduled for round 1 by STRATEGY 4.5 |
| c1-leeyang-krein-limit | combine | #13 + square-root lane | R4 | stage theorem supplies R1/R3, Krein index identity supplies R2; question is what the unimodular twist U lacks in the limit |
| c1-spinor-hecke-primitive | combine | #19 + square-root lane | R1 into an R2 identity | joint Hecke defect on p-primitive tests inserted in H_c = A* M_c A; target is a finite one-sided bound Q_L(v) >= -C norm(v)^2 (sufficient by P10/T2) |
| c1-window-sdp-scaling | compute (heavy) | #23 | R2/R4 screen | decides whether joint semidefinite coupling of Pick positivity with the explicit formula in one window gives an exclusion radius that does not decay like 1/log T and that differs between zeta and controls; the answer sets whether lead 23 gets lanes in round 2 |

Not allocated this round: leads 1-3, 14-18 (inside the 7/8 architecture; frontier numbers only), lead 25 (Lambda only), leads 7, 10 (queued for round 2 explore).

## Round 1 results (recorded 2026-11-18)

Scoreboard after the round: headline 1 of 4 (`c1-leeyang-krein-limit`, R1 at stage level only; missing R2, R3, R4). Lanes run 8, refereed 8 (one referee each), hold rate 87.5%, one PROVED sub-step broken, one open lemma decided. Coverage: 4950 tag-pair families, 0 closed, 28 tried, 4922 untried. No lane is about zeros of zeta; no ALERT written. Records: `lanes.jsonl`, `engine/outcomes/<slug>.json`, `engine/outcomes.json` (verdicts updated), input copy `round1_records.json`, script `learn_r1.py`.

| slug | kind | verdict | referee | score | where it stops |
|---|---|---|---|---|---|
| c1-pd-log-strip | explore | precise-obstruction (restatement) | holds | 0 | compensated positivity CP(sigma) is equivalent to "no zeros right of sigma"; the implication uses only the prime-free half-line; no transport in sigma past the pole |
| c1-shear-hecke-fricke | explore | precise-obstruction | holds, 4 corrections | 0 | shear defect order is 0 or 1 and equals complete multiplicativity at p (an identity); all completely multiplicative controls have order 1; prime expansion converges only for tau < 0 |
| c1-multidelay-bohr-section | explore | precise-obstruction | holds, 6 corrections | 0 | joint defect is rank one and additive, so joint contractivity is the scalar largest-value inequality; no positive-real multi-delay summand of xi'/xi for finite P; tapered section is an RH-equivalent identity without multiplicativity |
| c1-leeyang-chain-closure | deepen | partial-result | holds, R1 flag removed | 0 | ferromagnet closure is a proper subclass of Lee-Yang (n >= 5, GHS), but GHS and the FK cone hold for Phi and for DH: no zero information |
| c1-missing-controls | repair | partial-result | holds, corrections E1, E2 | 0 | filter repair; every missing control gave the inferred outcome; Liouville twist is an exact twist with zeros off the line (at rho/2) |
| c1-leeyang-krein-limit | combine | precise-obstruction | holds, 4 defects | 1 (R1, stage level) | self-dual stage symbols tend to -1 for zeta and every unimodular twist; the limit step is Hurwitz plus local boundedness of pole-renormalised Euler stages, equivalent to the zero-free statement |
| c1-spinor-hecke-primitive | combine | precise-obstruction | does not hold as written (Lemma 3(a) domain); negative verdict survives corrected | 0 | jointly primitive tests are dense, so the primitive restriction changes no infimum; Gram matrix of dilations is function-independent |
| c1-window-sdp-scaling | compute | precise-obstruction | holds, E1 at (100,24) | 0 | real-node Pick LMI is linear in the zero measure and never contains the primes; joint SDP equals the explicit-formula LP |

### Lessons

1. Translation-invariant positivity on the critical-line side is prime-blind. Three lanes reached this from different sides: Pick LMI linear in the zero measure (window-sdp), Hecke/Moebius operators as translation multipliers acting by congruence (spinor-hecke-primitive), and rank-one additive defect of commuting prime sections (multidelay). Restricting, grouping or coupling such forms adds no constraint beyond the explicit formula.
2. Where a property does separate zeta from twists, it is an identity equivalent to the target: CP(sigma), the Fejer-tapered section, and local boundedness of pole-renormalised stages are each the zero-free statement, and the implication towards zeros does not use multiplicativity.
3. Multiplicativity entered only as an equality (Hecke eigen-identity, defect order 1) or at stage level (Lee-Yang stages). Completely multiplicative controls (sign twists, unimodular twist, Beurling, zeta(s+a)) pass every such step; they fail only at the functional-equation step. DH fails the complementary step. So an R3-valid mechanism needs an inequality that uses the Euler product and the functional equation in the same step.
4. Limit steps: the self-dual conductor normalisation erases the limit (symbol -> -1); the strip topology gives Hurwitz plus a boundedness statement equal to the PNT error term. Krein-index semicontinuity is closed as a limit step. Kernel-side positivity (GHS, FK cone, log-concavity, Csordas convexity) holds for the DH kernel and gives no zero information.
5. Filter: the Liouville twist zeta(2s)/zeta(s) is an exact completely multiplicative control with zeros off the line in the strip (Re s = 1/4); finite twists carry zeta's zeros and only test statements that use the archimedean side.
6. Reliability: negative verdicts held in 8 of 8 lanes in substance; the recurring referee corrections are domain statements (whole-line L^2 vs windowed, compact support under inverse Moebius, node-uniformity of grid certificates). Proof steps labelled PROVED need the function class stated.

### Open items carried forward (not closed by round 1)

- Multivariate (polydisc, per-prime weights) Lee-Yang property: does it give a one-sided upper bound on log|E_P(s) exp(E_1((s-1) log P))| in the strip better than exp(P^(1-sigma)/log P)? (from krein-limit; the single-variable consequence is weaker than trivial)
- Size of sum over zeros of |zeta_S(1/2+i gamma)|^2 |W(i gamma)|^2 against norm(Z_S w)^2 as S grows (partial Euler products sampled at zeros; largest-value type; from spinor-hecke-primitive). Reusable code: `push/c1-spinor-hecke-primitive/plib.py`.
- LMI with on-line terms that are not sign-definite (sector matrices P+-B of stack-feasibility section 6) in the window model (from window-sdp).
- J-inner linear-fractional section in several delays with Theta(0) = M(c0)U0, c0 > 0; infinite P; DH analogue (from multidelay).
- Window defect: the commutator of the cutoff with Hecke operators (the place where a multiplicative mechanism can act on H_c); its formula is kernel-independent, so the function must enter through the test vector.
- Referee passes owed: multidelay Theorem A step (iii); missing-controls Part D (Selberg CLT, Bohr-Jessen statements); spinor Lemmas 3-5; leeyang-chain step 2.1(c) and the GHS-with-hidden-spins input. Map bookkeeping owed: section 6 items 7, 8, 11; rows P29, Q12.
- Not done: Ritz run of K[t] for the heat family at tau = -2; a sign twist with a zero in 7/8 < Re s < 1 as a control for the 7/8 mechanism.

## Round 2 (planned 2026-11-18)

State at planning: scoreboard headline 1 of 4 (`c1-leeyang-krein-limit`, R1 at stage level). No lead has a referee-confirmed score >= 3, so the three-lane rule does not apply; no round-1 lane reached score >= 2, so no explore lane shifts to deepen. Generator run (`build_graph.py`, `generate.py --top 60`): 60,821 generated, 57,311 scored. Reading of the ranking: candidates 1, 3, 4, 19 (Euler phases with the functional-equation phase on the torus) are the closed lane `e1-rs-torus-laguerre-orbit`; 34-37, 42, 45, 55, 60 (Nyman-Beurling Gram) are closed by `e1-nb-gram-period-transfer`; 7, 11-13, 17, 18 (flow functionals) by `e1-burgers-cascade-anticausal`. The generator did not exclude them because the ten `e1-*` records in `engine/outcomes.json` still read "proposed" although all ten lanes have RESULT.md with a verdict (all precise obstruction or partial). This is assigned to the repair lane. Server at planning: rh.slice 13 GB in use, three `rh-b7-*` units running (not ours to touch).

Design rule taken from round-1 lesson 3: every attack lane this round must use the Euler product and the functional equation in one step (completely multiplicative controls fail only at the functional equation, DH only at the Euler product).

| slug | kind | source | targets | reason |
|---|---|---|---|---|
| c2-euler-at-zeros | combine | round-1 open item (spinor-hecke-primitive) + `plib.py` + Krein square of g-spinor-square-root | R1 + R3 in one step | partial Euler products (Euler product) sampled at zeros (functional equation fixes the sampling set); the ratio to norm(Z_S w)^2 is not a translation-invariant form, so round-1 lesson 1 does not apply |
| c2-euler-at-zeros-scale | compute (heavy) | same question, independent code | screen for R2 | decides the growth law of the ratio in S and in height at a scale the local lane cannot reach; the answer decides whether this lead gets deepen lanes in round 3 |
| c2-polydisc-leeyang-bound | deepen | round-1 open item (krein-limit), lead 13 | R4 direct | only limit device not yet closed for the one lane with a stage-level score: a multi-affine (per-prime variable) stability bound against the trivial exp(P^(1-sigma)/log P) |
| c2-jinner-multidelay-lft | deepen | round-1 open item (multidelay), lead 20 | R4 direct | the round-1 no-go covers the unipotent family and finite P only; the J-inner linear-fractional family with Theta(0) = M(c0)U0 and infinite P is untested |
| c2-cutoff-hecke-defect | combine | round-1 open item (window defect) + g-spinor-square-root | R1 into an R2 identity | the commutator of the cutoff with Hecke dilations is the one place where a multiplicative operator is not a translation multiplier on the window; the function enters through the zero vectors y_gamma |
| c2-euler-cone-fe-rigidity | explore | nodes `rung-toeplitz-euler-detector`, `twisted-log-positivity-b-n`, `euler-fe-coupling-at-height` | R1 + R3, R2 screen | the Euler product written as a convex cone (local Toeplitz positivity at every prime, DH fails it) intersected with the affine functional-equation constraint in a window; asks whether the known exact uniqueness has a height-uniform stability constant. New tag pair (toeplitz, rigidity) |
| c2-projection-domination-gonek | explore | under-used nodes `telescoping-kernel-projection-domination`, `straddle-exclusion-window-completeness`, `m23-unconditional-window-positivity` | R2 identity + arithmetic partner | proved per-window, RH-free domination with no arithmetic partner so far; partner is the Landau-Gonek prime side at integer arguments |
| c2-repair-owed-passes | repair | round-1 owed items; engine bookkeeping | filter and generator correctness | owed referee passes from round 1; the ten `e1-*` outcome records; map rows |

Deviation from the 3 / 2 / 2 / 1 start point: 2 explore, 2 deepen, 2 combine, 1 heavy, 1 repair. Reason: the stale `e1-*` records make the generator re-propose closed lanes, which costs more than one explore lane per round until fixed.

Not allocated, with reason: sector LMI in the window model (round-1 item 3): `stack-feasibility` section 6 already measured that sectors P +- B on 12 nodes exclude nothing above ordinate 30 and that the joint problem decouples into the explicit-formula LP; it needs a new input before a lane. Elliptic double cover / twistor / annulus DtN nodes: no arithmetic coupling is specified in the corpus (`zv-spinor-arithmetic-coupling-missing`); the cutoff-Hecke lane is the candidate coupling and its result decides whether these get a lane in round 3. Leads 1-3, 14-18 (7/8 architecture): three `rh-b7-*` units on the server are already running that work.

What raises a score, per lane: stated in each assignment (R1 needs a named step that is false for a non-multiplicative coefficient sequence; R3 needs the failing step for each control including the Liouville twist and the unimodular twist; R2 needs a bound with constants independent of height; R4 needs an inequality that survives P -> infinity or sigma -> 1/2).

## Round 2 results (recorded 2026-11-18)

Scoreboard after the round: headline unchanged at 1 of 4 (`c1-leeyang-krein-limit`, R1 at stage level only; missing R2, R3, R4). Round 2: 8 lanes run, 8 refereed (one referee each), 7 hold, 1 does not hold as written (obstruction stands); all requirement flags false in all 8; no statement about zeros of zeta. Cumulative: 26 lanes, hold rate 84.6%, 3 PROVED sub-steps broken (none in round 2), 0 three-referee statements. Coverage: 7140 tag-pair families, 318 closed, 112 tried and not closed, 6710 untried. No ALERT.md written (no lane with score 4 and no confirmed statement about zeros). Records: `round2_records.json`, `learn_r2.py`, `engine/outcomes/c2-*.json`.

| slug | kind | verdict | referee | score | where it stops |
|---|---|---|---|---|---|
| c2-euler-at-zeros | combine | precise-obstruction | holds, 4 corrections | 0 | no one-sided inequality on R_S separates zeta from controls: the lower one is the target (P10), the upper one is the Landau-Gonek mean value, shared by E_a and backward heat; R_S -> 0 as P grows; exact S-periodised explicit formula (Lemma B) survives, uses only Re s = 1 data and holds for every control with the functional equation |
| c2-euler-at-zeros-scale | compute | dead | holds, corrections | 0 | suppression at zeros is 1 - 2 c_P/L, a function of log P / log T; not uniform in height or window length; DH (on-line and off-line zeros) and Liouville at rho/2 show the same suppression |
| c2-polydisc-leeyang-bound | deepen | precise-obstruction | holds, wording corrections | 0 | polydisc stability gives exactly the trivial bound E_P(sigma); any rotation-invariant class is bounded below by the torus maximum; limsup_t |G_P| = E_P(sigma) at fixed P, so height-uniform and sub-trivial cannot both hold |
| c2-jinner-multidelay-lft | deepen | precise-obstruction | holds, corrections | 0 | every J-contractive several-delay section on the full polydisc is M(H)V0 (rank-one additive defect); no nonconstant section splits off xi'/xi (first-moment bracket >= 1.17 Re a_1); same no-go for DH; convergence in the strip is the zero-free statement |
| c2-cutoff-hecke-defect | combine | precise-obstruction | holds, depths 1e-153/1e-390 not reproduced | 0 | [Q_c, V_p] carries the prime only as a length; the form is the Weil form restricted to a window; DH and heat tau = -2 positive definite at every size tried, Liouville fails |
| c2-euler-cone-fe-rigidity | explore | precise-obstruction | holds, 7 wording corrections | 0 | exact uniqueness is Hamburger (cone unused); in one window lattice translates of zeta pass the functional equation with defect about (|alpha|H + alpha^2)/(2T); about 30 conditions against sqrt(T)/log T free primes; prescribed off-line zero feasible (float64) |
| c2-projection-domination-gonek | explore | precise-obstruction | does not hold as written (3 wording errors; obstruction stands) | 0 | forced lower bound 2|W| sinh(delta log N) - M_on is below the trivial sqrt(N) bound for every H, N, delta < 1/2; the identity has a remainder about H(8H/T)^7 log T and needs H = o(T^(7/8)) |
| c2-repair-owed-passes | repair | partial-result | holds, 3 corrections | 0 | no attack; 8 owed steps hold (Lemma 3 in corrected form 3', Lemma 4' added); generator now rejects candidates sharing two nodes with a closed lane; map edits listed in MAP_PENDING.md, not yet applied |

### Lessons (round 2)

1. The round-2 design rule (Euler product and functional equation in one step) was met only as a mean value. Sampling the partial Euler product at the zeros gives the Landau-Gonek diagonal term: it needs the prime-power coefficients of -F'/F only, holds for DH at on-line and off-line zeros, and is a function of log P / log T. Two independent lanes (local and scale) agree. Partial Euler multipliers damp off-line pairs; they are not amplifiers.
2. Stage-level tools are closed for the Lee-Yang lead. Stability classes are invariant under torus rotations and a unimodular twist is a rotation; at fixed P the trivial bound is attained along heights. R2 (height-uniform) and R4 (bounded renormalised stages) conflict at fixed P. What remains is a bound at fixed t with P growing, or with P coupled to height: an upper bound for sum_{p<=P} p^(-sigma) cos(t log p) + Re E_1((s-1) log P).
3. Matrix (J-inner) freedom in the multi-delay family gives nothing: the normalisation S -> -1 plus a maximum principle forces the unipotent family. The first-moment no-go uses the functional equation and Schwarz-Pick only and holds for DH.
4. Window-local functional-equation input is not enough: zeta's lattice height translates and L(s, chi_5) at height T/5 pass any single-window test, and a window carries about 30 conditions independent of T. New control for the filter: "window translate". An attack must use the functional equation non-locally in height (Riemann-Siegel length or all heights).
5. Forms built on the cutoff (commutators with Hecke dilations included) are the Weil form on a window; they read the functional equation and the lowest off-line height, not the Euler product (DH passes, completely multiplicative Liouville fails).
6. Window-local explicit-formula identities have no error term to beat; the gap is off-line amplitude N^delta against the trivial sqrt(N) bound on short twisted prime sums, which is the zero-free statement. Only support and size of Lambda enter.
7. Reliability: verdicts held in substance in 8 of 8 lanes; the one "does not hold" is wording (an identity called exact that has a remainder). Recurring corrections: sample-size artifacts in maxima over unequal bands, error bounds attached to the wrong formula, depths of ball-arithmetic pivots not reproduced, quadrature error outside the balls.

### Results that can be combined

- Lemma B (S-periodised explicit formula, `c2-euler-at-zeros`): positivity range moves from support < log 2 to < log(2 N_S) at the price of residues of zeta'/zeta at 1 + 2 pi i k/log p. Partner: Vinogradov-Korobov gives R_S > 0 for |S| = 1 above a non-uniform threshold. Combination to test: the residue sum for |S| >= 2 bounded by o(log T) using the 7/8 architecture's input on Re s = 1 (the one mechanism with R1, R2, R3). Needs a referee pass on Lemma B and its DH form first.
- Theorem A' (`c2-jinner-multidelay-lft`, Abel-weighted first moment of zeta over poles of a positive-real Dirichlet series) with the Landau-Gonek calibration tables of `c2-euler-at-zeros-scale` (independent numerical check; DH tables need interval certification).
- Window-translate lemma (`c2-euler-cone-fe-rigidity`) plus the rotation lemma (`c2-polydisc-leeyang-bound`): together they state that a valid mechanism must read the angles t log p jointly and non-locally in height. Record both as controls in OBSTRUCTION_MAP section 2.

### Open items carried forward

- Referee Lemma B (contour shift, k = 0 residue, small divisors) and run its DH form; then the |S| >= 2 residue bound.
- Fixed-t, growing-P bound on the renormalised stage (residual of c1 Thm. D(b)); sector stability regions anchored at z_p = 1 (argued away in one line only).
- Second referee pass on Theorem A' (uniformity in k, Mellin shift, boundedness on D^inf ∩ c_0); DH conductor-5 moment formula line by line; then close STRATEGY lead 20 and map row Q12.
- Apply `MAP_PENDING.md` to `push/OBSTRUCTION_MAP.md`; add rows: rotation-invariant stage tools, window translate control, cutoff-commutator = Weil restriction.
- Engine: reconcile aboutZeros for `e1-burgers-cascade-anticausal` and `e1-euler-anchor-heat-certificate`.
- Still not done from round 1: Ritz run of K[t] for heat at tau = -2; a sign twist with a zero in 7/8 < Re s < 1 as a control for the 7/8 mechanism.

## Round 3 allocation (planner, 2026-11-18)

Inputs read: STRATEGY v1, SCOREBOARD (headline 1 of 4, 26 lanes, hold rate 84.6%), round-2 lessons, ROADMAP sections 1-8, ENGINE_LOG, `build_graph.py` + `generate.py --top 60` (61,200 generated, 14,662 rejected, 46,538 scored), `rhstatus` (rh.slice 17 GB in use; five units of other lanes running, not touched).

Reading of the generator top 60: none launched as generated. Ranks 1-2 (`sympow-conductor-normalised-shift`) share tags only; ranks 3, 4, 11, 19, 22 are bounded-support or one-window Weil/Pick positivity (finite stage, DH passes); ranks 5-9, 15, 25-27, 30, 45 are Lambda-only flow objects; ranks 16-18, 21, 23, 28, 42, 43, 60 are Route M mean values (MV-CAP); ranks 37, 50, 55 contain Selberg nodes (closed family). Used from the ranking: the nodes `cmv-truncation-from-taylor-data`, `dbn-prime-torus-phase-closure`, `zv-annulus-boundary-conditions`, `heat-fiber-completion-theorem` and the de Branges group (`twin-ladder-jacobi-reconstruction`, `canonical-system-indivisible-chain`, `cdb-exist-noncircularity`: 5 canonical-system nodes, 0 closed) as members of hand-built lanes.

Design rule for this round, from the round-2 filters (rotation lemma, window-translate lemma, Landau-Gonek): a lane must read the angles t log p jointly and non-locally in height, or act on a limit step directly. Inputs not yet used in the corpus and brought in here: de Branges ordering theorem with prime-built Hermite-Biehler stages; Helson's almost-everywhere theorem on T^inf and the tail-set structure of its exceptional set; the Riemann-Siegel length as the height-non-local form of the functional equation; the Lean-checked 7/8 half-plane as a bound for zeta'/zeta and its derivatives on Re s = sigma_0 > 7/8.

| # | slug | kind | heavy | targets | reason |
|---|---|---|---|---|---|
| 1 | c3-lemmab-referee-dh-poisson | deepen | no | reliability; R3 | Least-blocked lead. Lemma B is a sketch: referee it, write the DH form, and test by Poisson summation in k whether the residue sum is the Weil prime sum on the enlarged support (if yes the lead is a restatement and closes) |
| 2 | c3-lemmab-halfplane-growing-s | combine | no | R2, R4 | Lemma B (all-heights identity) x 7/8 half-plane (the one R1-R3 mechanism): poles moved to Re s = sigma_0 > 7/8, derivatives of zeta'/zeta bounded there, S growing with T; decides whether the admissible support reaches c log T |
| 3 | c3-fixedt-growingp-onesided | deepen | no | R4 | Residual of round 2 lesson 2: one-sided bound in P at fixed t for the renormalised stage, as a Landau problem in the P variable |
| 4 | c3-twinladder-prime-built-chain | explore | no | R1, R4 | Twin ladder / canonical systems with a prime-built (not zero-built) Hermite-Biehler chain; candidate fourth crossing device: monotone limits of reproducing kernels under de Branges ordering |
| 5 | c3-helson-tail-fe-selector | explore | no | R3, R4 | Torus program: the exceptional set of Helson's theorem is a flow-invariant tail set; lead 9 (properties tied to chi = 1) through the functional equation as selector |
| 6 | c3-rs-matched-halfsum-hb | compute | yes | R2, R3 | Torus/Klein nodes with the Riemann-Siegel length: Hermite-Biehler position and zero count of the half-sum at matched height, zeta against DH, at heights not sampled; answer decides whether the RS-length family gets lanes in round 4 |
| 7 | c3-multiwindow-converse-defect | combine | no | R1, R2 | Rotation lemma x window-translate lemma: adversary with unimodular Euler product passing the functional equation in m windows jointly; either a stronger control or a rigidity statement that needs all heights |
| 8 | c3-repair-map-theorem-a | repair | no | reliability | Owed: apply MAP_PENDING.md, add three rows, second referee pass on Theorem A', reconcile two engine records |

Deviation from 3 / 2 / 2 / 1: 2 explore, 2 deepen, 2 combine, 1 heavy compute, 1 repair. Reason: two owed items (map edits, Theorem A') were carried for two rounds; Lemma B gets two lanes because lane 1 can close it and lane 2 is only worth its result if lane 1 holds, so lane 2 is told to start from the shifted identity and stop if lane 1's Poisson test shows a restatement.

R4 lanes: 3 and 4 (and 2 in its support-length question). No lead has a referee-confirmed score of 3, so the three-lane rule does not apply.

Not allocated, with reason: 7/8-architecture leads 1-3, 14-18 (server units `rh-b7-*` and `rh-e2-tro6s-*` are running that work); Selberg, Legendre-dual, Vasyunin-Gram, order-2 theta rows (closed families); partial Euler products at zeros, polydisc stage tools, J-inner sections, cutoff commutators, single-window rigidity (closed in round 2); scattering form of zeta(s-a)/zeta(s+a) with `heat-fiber-completion-theorem` (Lax-Phillips rows closed).

What raises a score: R1 needs a named step false for a non-multiplicative coefficient sequence; R2 a bound with constants independent of height; R3 the failing step for each control including the unimodular twist U, the Liouville twist, the window translate and RZ_b; R4 an inequality that survives P -> infinity, X -> infinity or sigma -> 1/2. Each assignment states its own condition.

## Round 3 results (2026-11-18)

Scoreboard after the round: headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4), unchanged. 34 lanes, hold rate 88.2%, lanes by score 33 / 1 / 0 / 0 / 0. Tag-pair families: 339 closed, 184 tried and not closed, 6617 untried. PROVED claims broken by referees: 4 (one new: constant in Candidate 1a of the Helson lane). Lemmas decided: 4 (new: Lemma B, Theorem A' with the DH conductor-5 formula). No statement about zeros of zeta; no ALERT.md written. Records: `round3_records.json`, `learn_r3.py`, `engine/outcomes/c3-*.json`.

| lane | kind | verdict | score | referee | one line |
|---|---|---|---|---|---|
| c3-lemmab-referee-dh-poisson | deepen | precise-obstruction (restatement) | 0 | holds, 7 corrections | Lemma B is proved (|S|=1 in full; |S|>=2 for C_c^inf tests with a Baker-type bound). Poisson in k: the residue sum is Weil's pole term minus the prime sum for the test Z_S w. DH satisfies it (14 cases, 5.4e-12). Closed as a restatement |
| c3-lemmab-halfplane-growing-s | combine | precise-obstruction | 0 | holds, corrections | Shifted Lemma B is a correct identity. With absolute-value bounds on the residues, positivity is certified only for support <= f(sigma_0) log log T, f(1) = 2 for every Theta including RH. The 7/8 input adds no range. Obstruction of the bounding method only |
| c3-fixedt-growingp-onesided | deepen | precise-obstruction | 0 | holds, corrections | A one-sided bound Re G(P;s) at one fixed strip point for all P is equivalent to Theta <= sigma + alpha (Landau; singular points rho - s at every height). Liouville is the exact mirror. Rows T2/P10 in twisted form |
| c3-twinladder-prime-built-chain | explore | precise-obstruction | 0 | holds, 4 non-fatal errors | No Euler stage is Hermite-Biehler about Re s = 1/2: Theta_X has about T theta(X)/pi poles in the upper half-plane below height T, infinitely many negative squares, no stage Hamiltonian. Kernel not monotone in X. Restates G10/Q10 |
| c3-helson-tail-fe-selector | explore | precise-obstruction | 0 | holds, 5 corrections (one PROVED constant wrong) | No selector. chi = 1 is in Helson's exceptional set; E and E_zero are tail, null, dense, comeagre. Strip zeros are a tail datum, the functional equation a one-orbit datum. Band-gap identity holds for DH and E_a |
| c3-rs-matched-halfsum-hb | compute (heavy) | precise-obstruction | 0 | holds, 3 corrections | The Riemann-Siegel half-sum has right zeros at about one per five zeros of Z at matched height (certified lower bounds at 1e8, 1e10, 1e12). Unmollified Levinson with loss equal to the right-zero count. Controls fail alike |
| c3-multiwindow-converse-defect | combine | precise-obstruction | 0 | holds, 7 statements weakened | For fixed m, H, eta a translate zeta(s + i alpha) passes all m windows above a height T_0: no fixed window count is rigid uniformly in T. Finite-model witnesses with an off-line zero exist below a crossover of order pi(N)/30 |
| c3-repair-map-theorem-a | repair | partial-result | 0 | holds, no error | MAP_PENDING applied (137 map rows). Theorem A' holds under a further pass; DH conductor-5 formula proved (bracket >= 1.0597 Re a_1), so the no-go holds for DH. Lead 20 closed. Engine: 1502 nodes, controls WT and FM added |

### Lessons (round 3)

1. Lemma B is closed. The pole lattice 1 + 2 pi i k/log p on the test side is the Fourier dual of the periodised prime measure; the identity is the explicit formula for a non-compactly supported test, regularised. Its enlarged support threshold log(2 N_S) is bookkeeping, not a gain. The lead rated least blocked after round 2 is a restatement.
2. Sup bounds of zeta'/zeta on a vertical line stop at the Littlewood scale: support 2 log log T for every Theta including RH. No zero-free half-plane used through absolute values reaches support c log T. What remains is a signed treatment of the lattice sum, which is row P10 (the target).
3. A fixed-point, all-P one-sided bound is a global Landau equivalence, not a window statement. It holds as a criterion for every control; the Liouville twist is its exact mirror. A fixed-height test with P <= Pmax cannot separate zeta from a control whose zero is farther than Pmax^(beta-sigma)/log Pmax.
4. No finite Euler stage carries the functional equation. About Re s = 1/2 the stage kernel has negative squares at density theta(X)/pi; the count goes to infinity along the stages and to zero in the limit, so monotone or semicontinuous limit devices (de Branges ordering, Krein-Langer counts) cannot follow it. A canonical-system stage would have to take the functional equation as an input.
5. On T^inf strip zeros are a tail datum and the functional equation a one-orbit datum. No tail-measurable, generic, almost-everywhere or rotation-invariant property reaches chi = 1. Every every-window statistic that sorts correctly is the zero-free statement.
6. A window functional-equation test reads conductor, one phase and about 30 reals per window, never the Euler product. Rigidity needs a window count of Riemann-Siegel size sqrt(T)/log T. Filter entry: any window argument with a T-independent number of windows fails against the unimodular twist (lattice translate).
7. The Riemann-Siegel half-sum splitting is unmollified Levinson. Multiplicativity enters only the size of the failure and in the adverse direction (referee correction to the lane's "only |a_n| enters").
8. First-moment no-go statements of Theorem A' type rest on Schwarz-Pick and hold for DH: they supply neither R1 nor R3.
9. Pattern across three rounds (34 lanes, 33 at score 0): every identity-type lane ends as the explicit formula on a larger test class, and every inequality step found is either the classical zero-free region or the target. All eight round-3 lanes have all four flags false.

### Families closed in round 3

- Pole-lattice test multipliers (Lemma B and its theta-family and shifted forms) as a route to an inequality.
- Lemma B times sup bounds on vertical lines, including the 7/8 half-plane as an input and S growing with T.
- One-sided bounds in P at a fixed strip point (twisted form of T2/P10).
- Truncated Euler products reflected about Re s = 1/2 as de Branges, Pontryagin or canonical-system stages.
- Tail, generic, almost-everywhere and rotation-invariant selectors on T^inf.
- Half-sum Hermite-Biehler variants at matched height (smooth cut-off, Gabcke terms, unequal lengths included); mollified pivot is row P27.
- Window functional-equation rigidity with a fixed number of windows.
- Jointly J-contractive several-delay sections (lead 20), except the three uncovered cases named in STRATEGY.

### Results that could be combined

- Helson follow-up with the multiwindow lesson: a quantitative non-tail property (sum chi(n) = c x + O(x^theta) for completely multiplicative unimodular chi) and whether it forces a zero-free region Re s > f(theta) with f(0) < 1. Finite modifications of zeta have discrepancy O(log x) and the property names chi = 1 (Klurman, recalled), so it is the one object found that is both non-tail and tied to chi = 1. Known risk: for zeta itself theta is the Dirichlet divisor-type exponent of the partial sums and the implication may run through zeta (circular); the lane must state where it does not.
- Twin-ladder follow-up with the multiwindow count: a stage whose Theta is a finite Blaschke product by construction (functional equation as input) with prime data entering at Riemann-Siegel length sqrt(T/2pi), the size at which the window test becomes rigid. This is the only form of the canonical-system gap not closed by lane 4; it must be checked against rows G10/Q10 and against Hamburger (rigidity past the crossover is not multiplicative).
- Lane 2's f(sigma_0) cap with lane 3's Landau equivalence: both say the signed lattice or P-sum is the target. No combination, one map entry (P10/T2).

### Open items carried forward

- Map: add to row T2 the twisted fixed-s form; add the fixed-window-count filter entry; record Lemma B as a restatement row; record the Euler-stage negative-square count under G10/Q10.
- Engine: closed-family patterns for rows P41, P42, G25, Q21, Q22 and for the eight round-3 families in `engine/merge_outcomes.py`; graph edges for controls WT and FM.
- Referee debts: Proposition P and the Baker-Wustholz constant (Lemma B, |S| >= 2); second reading of the DH derivation in `c3-repair-map-theorem-a/REFEREE2.md` section 3; Lemma 3 and Prop. 1(e) of the Helson lane; Klurman-Mangerel and Gonek 2012 not opened; certified infeasibility or witness at T=1e5 m=2 and T=1e6 m=8.
- Still not done from round 1: Ritz run of K[t] for heat at tau = -2; a sign twist with a zero in 7/8 < Re s < 1 as a control for the 7/8 mechanism.

## Round 4 allocation (2026-11-18, planner)

Inputs read: STRATEGY v1, SCOREBOARD (headline 1 of 4, 34 lanes, hold rate 88.2%), round-3 results, ROADMAP, ENGINE_LOG. Generator run: `build_graph.py` (1509 nodes, 939 live) and `generate.py --top 60` (62,055 generated, 16,486 rejected). Reading of the top 60: 27 of 60 are flow / Lambda-bridge combinations (DBN covering, fold modulus, W3 tail) with no route to R4, and most of the rest pair a kernel-only node with an arithmetic node that shares no object. None was taken verbatim. Nodes kept from the ranking or from the unused geometric list: `bridge-scattering-factorisation`, `antihermitian-strip-bound`, `af-rank-trace-inertia`, `collision-local-index`, `dbn-prime-torus-phase-closure`, `euler-fe-coupling-at-height`, `finite-support-euler-detector`.

Adaptation applied: two consecutive rounds added no referee-held partial result with score >= 2, so one deepen slot moves to explore-type work (STRATEGY section 2). No lead has a referee-confirmed score of 3 or more outside the 7/8 architecture, so the three-lane rule does not apply.

Planner pre-checks (ARGUED, not refereed; each lane must verify or correct):
- FE-symmetrised Euler stage zeta_X = P_X + chi conj(P_X) (Gonek 2012 type; the form of the canonical-system gap left open by `c3-twinladder-prime-built-chain`). Its zero measure on the line is the phase comb of phi = -2 vartheta - 2 arg P_X(1/2+it). The k = 0 term of the comb is the explicit-formula density with primes up to X. Positivity of that term on a window is the sup bound of the truncated prime sum against (1/2) log(t/2 pi), which is lesson 2 of round 3 (range X of order log^2 t). Anything new must come from the k != 0 terms or from a Rouche comparison with zeta through the approximate functional equation.
- Thin twist: for a set S of primes with counting function about x^b/log x and chi = -1 on S, 1 elsewhere, F = zeta * prod_{p in S}(1-p^-s)/(1+p^-s) has the local form (s-b)^2 near s = b if S is regular. This would be a completely multiplicative unimodular control with a zero at any chosen real b in (7/8, 1) and partial sums c x + O(x^(b+eps)). If it holds, the Helson implication can at best give zero-free Re s > theta, and the 7/8 mechanism must fail for it at a named step.

| # | slug | kind | heavy | source | targets |
|---|---|---|---|---|---|
| 1 | c4-helson-discrepancy-zerofree | deepen | no | round-3 least-blocked lead; `c3-helson-tail-fe-selector`, `n1-beurling-rigidity` | R1, R3; R4 from the left (data on Re s > theta < 1/2) |
| 2 | c4-thin-twist-control-78 | deepen | no | owed since round 1 (sign twist with a zero in 7/8 < Re s < 1); map row Z18 | R3 for the only R1-R3 mechanism; new control |
| 3 | c4-fe-stage-rouche-crossing | combine | no | `c3-twinladder-prime-built-chain` + `c1-leeyang-krein-limit` (lead 13) + `c3-multiwindow-converse-defect`; nodes `euler-fe-coupling-at-height`, `dbn-prime-torus-phase-closure` | R4 directly (Rouche / Hurwitz as crossing device) |
| 4 | c4-stage-collision-law | combine | no | lane 3 object + vortex node `collision-local-index` + `c2-euler-at-zeros-scale` tables; server, 4 cores | R4 measured: law of the stage-to-zeta defect |
| 5 | c4-laxphillips-hecke-compression | explore | no | unused nodes `bridge-scattering-factorisation`, `antihermitian-strip-bound` | R1 (commuting Hecke family), R2 (operator norm), R3 (non-arithmetic groups) |
| 6 | c4-ramare-factorisation-pointwise | explore | no | no map row mentions Matomaki-Radziwill; node `af-rank-trace-inertia` | R1; tests whether the factorisation gives anything outside mean values |
| 7 | c4-kloss-marks-scaleup | compute | yes | standing lead 1 (`n1-maass-selberg-norm`, `n2-kloss-sdp-certificate`) | frontier part B (model point 31/36), not the headline |
| 8 | c4-repair-map-engine-r3 | repair | no | open items of round 3 (map rows, closed-family patterns, edges WT/FM, generator noise) | filter and generator quality |

Reasons.
1. The Helson property is the one object found that is non-tail and names chi = 1. The lane must decide the converse lemma (discrepancy O(x^theta) forces a thin deviation set, hence F/zeta zero-free and pole-free on Re s > theta, which makes the implication circular) or exhibit a non-thin example.
2. The thin twist gives the 7/8 mechanism a control that keeps the Euler product and unimodularity. The step where the proof fails for it is the step that uses more than multiplicativity; it also bounds what lane 1 can give.
3. The only canonical-system form not closed in round 3: a stage that is a finite Blaschke product by construction with the functional equation as input. The crossing device is Rouche against the approximate functional equation. It also answers lead 13: the unimodular twist U passes the stage theorem and has no approximate functional equation.
4. Measures where lane 3's inequality fails: stage zeros leave the line only through collisions at stationary points of phi, a prime-only event. The run compares that event set with the actual zeros and the Rouche margin. Default server size.
5. Hecke operators compressed to the Lax-Phillips space: a norm bound p^theta + p^-theta with theta < 1/2 on resonance states would bound Re rho. Non-arithmetic groups are a structural control. Expected first obstacle: T_p does not preserve the incoming and outgoing subspaces.
6. Short-interval factorisation of Dirichlet polynomials is the main recent technique that uses multiplicativity essentially and has no map row. Decisive bookkeeping: the saving needed in averaged Hardy-Littlewood for F(alpha), alpha > 1, against what is proved.
7. One stated numerical question at a scale not sampled (more marks, larger Z). It moves part B only; the R4-directed numerical question of this round fits the default size (lane 4), so the heavy slot goes here.
8. Hold rate is above 50%, so this is the regular low-cost slot: without the pending closed-family patterns the generator keeps ranking closed combinations.

At least one lane on R4: lanes 3 and 4. Geometric program: lanes 3, 4 (twin ladder, torus, vortex), 5 (bridge, Klein surface), 6 (twin-ladder Gabor compression).

## Round 4 results (2026-11-18)

Scoreboard after the round: headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4), unchanged. A second lane has score 1 (`c4-helson-discrepancy-zerofree`, R1 for a theorem relative to zeta only). 42 lanes, hold rate 90.5%, lanes by score 40 / 2 / 0 / 0 / 0. Tag-pair families: 626 closed, 430 tried and not closed, 14520 untried (the count rises with tag vocabulary: 177 tags). PROVED claims broken by referees: 4 (none new). Lemmas decided: 5 (new: the converse lemma of the Helson lane, as a circularity). No statement about zeros of zeta; no lane with score 4; no ALERT.md written. Records: `round4_records.json`, `learn_r4.py`, `engine/outcomes/c4-*.json`. `merge_outcomes.py` and `build_graph.py` were run after the learn step (52 outcome entries, 43 closed; 1556 nodes, 952 live; 29 families: no family pattern was added for the round-4 closures).

| lane | kind | verdict | score | referee | one line |
|---|---|---|---|---|---|
| c4-helson-discrepancy-zerofree | deepen | precise-obstruction | 1 (R1, relative) | holds, 2 minor corrections | Landau argument on F F*/zeta^2: for sum chi(n) = cx + O(x^theta), zeros of F right of sigma_0 are zeta's zeros with matching orders. The implication to a zero-free region is circular; it transfers to Beurling. Thin twists measured at discrepancy exponent near b/2 with a real zero at b |
| c4-thin-twist-control-78 | deepen | precise-obstruction (control built) | 0 | holds | THIN: completely multiplicative eps = +-1, F = zeta(s)(s-b)W(s), simple zero at any b in (1/2,1), relative to a short-interval theorem cited from memory. Walk of the 7/8 proof: first unavailable step is periodicity of the target weight (Prop. 5.1 / Lemma 5.8). Proposition D: low estimate and high comparison cannot both hold; which fails is open |
| c4-fe-stage-rouche-crossing | combine | precise-obstruction (restatement) | 0 | holds, corrections | Gonek's stage has all zeros on the line for any non-vanishing P_X. The Rouche inequality on a box is implied only by zero-freeness of a slightly larger region. Fejer k = 0 comb term is the Weil functional on Fejer tests |
| c4-stage-collision-law | combine | precise-obstruction | 0 | holds, 2 wording errors | Stage zeros leave the line only through double zeros, a torus-invariant prime-only event with positive height-independent rate at fixed log X/log T. Rouche margin fails at a height-independent 0.1-1% of points near the line; DH passes at comparable rates |
| c4-laxphillips-hecke-compression | explore | precise-obstruction | 0 | holds, wording of Lemma 3 corrected | On the Eisenstein channel T_p = 2 cos(log p sqrt(-L)); compression norm at most 2 for every inner function; a norm bound on resonance states is implied by admissibility or equivalent to resonance location. Only Re rho <= 1 |
| c4-ramare-factorisation-pointwise | explore | precise-obstruction | 0 | holds, DH measurement weakened | Matomaki-Radziwill factorisation gives mean squares on Re s = 1 with log-power savings; bandwidth alpha > 1 needs a power saving 1-1/alpha in averaged Hardy-Littlewood. Conclusions hold for DH by linearity. MV-CAP and tail type |
| c4-kloss-marks-scaleup | compute (heavy) | partial-result | 0 | holds, 5 label errors | mu(G)/tr G flat in Z over a factor 64 (1.108-1.130; exponent -0.002 +- 0.004), equal to the common-column overlap term (Lemma O) to 0.7%. Random per-column coefficients behave identically. Weak support for WLS at 31/36; no abscissa moves |
| c4-repair-map-engine-r3 | repair | partial-result | 0 | holds, one count false (8 of 13 patterns match, not 2) | 16 map edits; engine merge run; generator rejections 16,486 -> 42,311. 54 of the top 60 candidates still rest on the keyword role 'crossing' |

### Lessons (round 4)

1. A power-saving discrepancy hypothesis on a completely multiplicative unimodular chi compares F with zeta and nothing else (ord_F + ord_F-bar = 2 ord_zeta right of sigma_0). The proof never uses the additive spacing of the integers and passes Beurling. The one object that was non-tail and named chi = 1 gives no zero-free region not already assumed for zeta.
2. The planner's pre-check on the thin twist was wrong in two places: the zero at b is simple for the regular (floor-rule) set and double for the greedy sign set, and the measured discrepancy exponent is near b/2, not b. So real zeros of F unrelated to zeta lie right of theta on the evidence (not proved).
3. Complete multiplicativity, unimodular local parameters, continuation, the pole and density-one agreement with zeta at primes are consistent with a zero at any b in (7/8,1). The extra input of the 7/8 mechanism is lattice-translation invariance of the coefficients (every sextic twist is periodic with a Poisson dual uniform in the modulus), used in the conductor aspect of a family and never as s <-> 1-s for the target. This names R3 for the 7/8 architecture more exactly than "Euler product".
4. A stage with zeros on the line by construction carries no information in that property (holds for any non-vanishing P, including U). All content is in the comparison zeta/stage, whose Rouche form is equivalent to zero-freeness of boxes and whose prime-side form is the Landau two-sided tail bound below abscissa 1.
5. The prime-only collision event of the Euler stage is torus-invariant with positive height-independent rate at fixed log X/log T; the Rouche margin does not use the Euler product (DH passes at comparable rates). Measured to T = 1e9, torus model to 1e20.
6. On the continuous spectrum Hecke operators are functions of the wave group. The Lax-Phillips framework is the same for every inner scattering function; all arithmetic is inside phi.
7. The Matomaki-Radziwill family proves statements whose conclusion class is closed under linear combination (DH passes) and whose savings are capped at log powers. Multiplicativity essential to a proof is not R1 unless it is essential to the conclusion class.
8. The mark Gram ratio is explained by the common-column overlap (Lemma O) and is not specific to the theta coefficients. The correct random control is one phase per column; n1/n2's per-(mark, cofactor) control understates the ratio, and n2's constant fails for wide slots.
9. Pattern across four rounds (42 lanes, 40 at score 0, two at score 1): no lane has R4; every R1 obtained is at stage level or relative to zeta. All four device nodes the planner named for crossing (Rouche stage, collision index, Hecke compression, Helson discrepancy) are closed.

### Families closed in round 4

- Discrepancy-of-partial-sums hypotheses on completely multiplicative unimodular chi as a source of zero-free regions (relative to zeta; Beurling passes).
- Functional-equation-symmetrised Euler stages (Gonek type) with Rouche or Hurwitz comparison, including Fejer weights and the approximate functional equation as re-expression.
- Stage collision / local-index events as carriers of zero information (torus-invariant, positive rate).
- Hecke operators compressed to the Lax-Phillips space, and Hecke norm bounds on resonance states in the weighted-L2 family.
- Ramare / Matomaki-Radziwill factorisation and pretentious-distance statements as every-window or one-sided inputs (MV-CAP, tail type).

Not closed: norms outside the one weight family in the Lax-Phillips lane; the non-locality step 4 of the Rouche lane; which of the two estimates of Proposition D fails for THIN.

### Results that could be combined

- THIN with the sextic tools (`tmp/sextic`): mean square over m of the completed cubic theta row with weight eps_K against weight 1 at two or three scales Z, b = 0.95. Growth like Z^(2(b-11/12)) puts the failure on the low estimate (row reflection). This decides which half of the 7/8 mechanism carries the lattice-periodicity input and is a default-size computation.
- Lesson 3 with the Helson lane: the Helson hypothesis (partial sums of chi) is additive-blind; the 7/8 input is periodicity of twists in the conductor aspect. A hypothesis on chi stated for all twisted sums sum chi(n) e(an/q), uniformly in q (a Poisson dual in the family), is the form not covered by lane 1's Landau argument or by Beurling. It must be checked against the multiwindow lesson (Hamburger: rigidity that is not multiplicative) and against THIN (non-periodic by construction).
- Kloss overlap (Lemma O, column-phase control) with the unexplained K4a term (regression 0.42-0.59 against 0.98 for its random control): a structured off-principal term of overlap size in a neighbouring system; frontier part B only.
- By-product (D3) of the Ramare lane (isolated off-line zeros bounded by T^(2-2 sigma) log T from one explicit formula at X = T) is a density statement; compare with the density literature before any use.

### Open items carried forward

- Engine: closed-family patterns for the five round-4 families in `engine/merge_outcomes.py` (not added by this learn step); remove the `unless` exemption for the Rouche device node (776 candidates); replace the keyword role 'crossing' by a curated device list; confirm ctl-THIN after the short-interval theorem is re-read.
- Map rows: Gonek stage on-line theorem is P-independent; Fejer-stage F' = Weil functional on Fejer tests (P10/eq48); Lax-Phillips Hecke compression; Ramare/MR family (three rows, sources 8/33, MR Lemma 8, averaged Elliott to be opened first); Helson relative theorem; THIN as a control with table row.
- Referee debts: Theorem 1 of the Helson lane has author check plus one referee (novelty unchecked; likely folklore); r(0) undecided; short-interval theorem behind THIN cited from memory; 7/8 walk argued by hypotheses, not replayed; non-locality step 4 of the Rouche lane; Montgomery fixed-X failure recalled, not opened; kloss float64 error model is measured, a worst-case bound (about 1.2e-10) exceeds EPS_W.
- Controls not run in the stage lanes: backward heat, sign twist, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w.
- Still not done from round 1: Ritz run of K[t] for heat at tau = -2.

## Round 5 allocation (2026-11-18, planner)

Inputs read: BRIEF (to the end), STRATEGY v1, SCOREBOARD (headline 1 of 4, 42 lanes, hold rate 90.5%), round-4 results and lessons, ROADMAP, ENGINE_LOG, MAP sections 5-6. Generator run: `build_graph.py` (1556 nodes, 952 live) and `generate.py --top 60` (63,111 generated, 42,418 rejected, 20,693 scored). Reading of the top 60: every candidate still passes rule 1 through the keyword role 'crossing'; ranks 8, 10, 11, 14, 29, 33 contain a device closed in round 4 (`hecke-compression-lax-phillips`, `helson-discrepancy-rigidity`, `rouche-fe-symmetrised-euler-stage`); the remainder pair a kernel-only or Lambda-side node with an arithmetic node that shares no object. None was taken verbatim. Server state at planning time: rh.slice 20 GB in use, units `rh-b7-e1-kloss`, `rh-b7-e2-ff`, `rh-b7-e3-tro6` of another workflow running (not to be touched; the Kloss / K4a combination is left to that workflow and gets no lane here).

Adaptation applied: three consecutive rounds with no referee-held partial result at score >= 2, so the allocation stays explore-weighted (STRATEGY section 2). No campaign lead has a referee-confirmed score of 3 or more, so the three-lane rule does not apply formally. The 7/8 architecture is the only mechanism with R1-R3 (calibration row, score 3, excluded from the headline); its missing requirement is R4, and row Z15 states what R4 means there: effective order r/h = 2. Three lanes (2, 3, 4) attack that statement by independent approaches.

Planner pre-checks (ARGUED, not refereed; each lane must verify or correct):
- Twisted Helson hypothesis, sum chi(n) e(an/q) = c delta_q x + O(q^A x^theta) for all q up to x: Parseval over the circle gives a sup error of at least (x(1-|c|^2))^(1/2), so theta < 1/2 forces chi = 1 (identification); for theta >= b the THIN control passes (eps = 1 * h, h supported on numbers built from the thin set). The range 1/2 <= theta < b with q <= x^delta is what lane 5 has to decide.
- Recorded inconsistency: round-4 lesson 2 reports a measured THIN discrepancy exponent near b/2 with a zero at b, while Theorem 1 of the Helson lane places all zeros right of sigma_0 among zeta's. One of the two (the fitted exponent, or the identification of sigma_0 with the discrepancy exponent) needs correction. Lane 5, test 1.
- Shift identity 1 = sum_{k>=1} (-1)^(k-1) C(s+k-1, k) zeta(s+k) (integers closed under n -> n+1) expresses zeta in the strip through values right of 3/2. It is the Mellin transform of (e^x - 1) * 1/(e^x - 1) = 1, linear, holds for DH with shift 5, and its terms cancel from size about e^|t|. Common wall part 2; no lane.
- Angular family lambda^(6k) over Q(sqrt -3): the family sum is supported on rays (rational integers, count Z^(1/2) among norms <= Z), i.e. coherent exponent 1/2. Its epsilon factor is i^(6k) times a Bessel kernel; if that is a character of k the ap-order-two obstruction (no absorption of mu) repeats. Lane 3, first test.
- Stage families with both zero-freeness and an integer-proved strip limit (smooth-number partial sums with x = y^u): zero-freeness holds only for u > y^(1-sigma) by a size argument valid for every twist, convergence only for u bounded. Same gap as `c1-leeyang-krein-limit` Theorem D; no lane.

| # | slug | kind | heavy | source | targets |
|---|---|---|---|---|---|
| 1 | c5-thin-propd-dichotomy | compute | yes | round-4 least-blocked lead; `c4-thin-twist-control-78` Prop. D; repo `tmp/sextic` tools | R3 of the 7/8 architecture: which half carries the lattice-periodicity input |
| 2 | c5-target-fe-order2-ledger | deepen | no | `r3-method-limit` (h <= 1), lesson 3 of round 4 (target functional equation unused), map 6.13 | R4: does target reflection relax h <= 1 |
| 3 | c5-angular-family-absorption | explore | no | row Z15, `ap-order-two`; geometric nodes: hexagonal torus, spinor weights, Klein involution, twin ladder on R x S^1 | R4: coherent exponent 1/2 from the angular / anticyclotomic family |
| 4 | c5-marks-circularity-order2 | explore | no | `r3-method-limit` Theorem 3(b) (heuristic), map 6.1, `e2-ms-slot-capacity` | R4: decide the l - lx = 2 circularity |
| 5 | c5-twisted-helson-arcs | combine | no | `c4-helson-discrepancy-zerofree` + THIN lesson; server default size for one sum to 1e10 | R1, R3; closes or keeps the Helson family |
| 6 | c5-thin-walk-replay | deepen | no | weakest steps 1-2 of `c4-thin-twist-control-78`; `r3-tnr-control` | R3 as a quantitative input g(kappa, e); foundations of the THIN control |
| 7 | c5-device-table-extension | explore | no | ROADMAP device table; `underused.json`; map 6.15 | R4: devices not in the table (Baker, sum-product, Carleson/corona, tensor power, p-adic tower, Turan, one geometric) |
| 8 | c5-repair-engine-map-r4 | repair | no | open items of rounds 3-4, MAP_PENDING | filter and generator quality; referee debts; owed Ritz run |

Reasons.
1. The one computation named least blocked by the round-4 learn step. Its answer says whether the periodicity input sits in the row reflection (low estimate) or in the high comparison, which decides whether lane 2's object (reflection) is the binding one. Heavy slot: four or more scales over a factor 64 and two values of b need more than the default size; no other stated question would change the next allocation.
2. The floor 1 - h/r with h <= 1 was derived for a system that never reflects the target. An exact LP with one more variable decides whether the functional equation of the target moves the floor. Expected outcome: h <= 1 stays, as a proved row; a vertex below 5/6 would be the first R4-directed gain inside an R1-R3 mechanism.
3. A coherent set of exponent 1/2 exists in a family the map does not list. The absorption identity is a finite check on the epsilon factor. If it fails, the result is a general row covering every family whose epsilon factor is a character of the family parameter.
4. Row Z15 is ARGUED and its order-2 branch is a heuristic. Either it becomes a proof (family closed properly) or the inconsistent region of the reduced system contains a vertex with a weaker needed input.
5. Named as combinable in round 4. The pre-check leaves one open range; the lane also resolves an inconsistency between two round-4 records, which lanes 1 and 6 depend on.
6. THIN now carries the R3 reading of the only R1-R3 mechanism while resting on a theorem cited from memory and a walk by hypotheses. The positive direction (abscissa as a function of the periodicity exponents) gives a consistency test that can falsify either THIN or the walk.
7. All four device nodes the planner named in round 4 are closed and 54 of the generator's top 60 rest on a keyword. The lane tests device types that never appeared in the table and returns nodes for the graph.
8. Engine debts were carried two rounds; closed devices still rank in the top 60. Hold rate is above 50%, so this is the regular repair slot.

At least one lane on R4: lanes 2, 3, 4 (effective order 2 by three approaches) and 7. Geometric program: lane 3 (torus, spinor, Klein, twin ladder), lane 7 item (c) (bridge symbol S) and item (g) (annulus, elliptic double cover, Klein phase transport). Heavy: lane 1 only. Server use: lanes 1 and 5; all others local.

## Round 5 results (2026-11-18)

Scoreboard after the round: headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4), unchanged. 50 lanes, hold rate 88.0% (6 of 8 this round), lanes by score 48 / 2 / 0 / 0 / 0. PROVED claims broken by referees: 5 (one this round: Proposition 5 of the angular lane, error term). Tag-pair families: 653 closed, 426 tried and not closed, 14321 untried. Lemmas decided: 9. No lane has R4; no statement about zeros of zeta; no ALERT written.

| lane | kind | verdict | score | referee | one line |
|---|---|---|---|---|---|
| c5-thin-propd-dichotomy | compute (heavy) | partial-result | 0 | does not hold as written (control claim refuted) | MEASURED: every sign weight, multiplicative or not, carries a common row component with amplitude linear in its Mertens-type sum (energy exponent 0.13-0.20, staircase). For thin weights it is under 2% of the mean square in range. Which half of Proposition D fails for THIN stays OPEN; the probe (6.1) was not computed |
| c5-target-fe-order2-ledger | deepen | precise-obstruction | 0 | holds; errors in the free-geometry table corrected | Lemma U: the signal constant of a probe is an invariant of the probe, so re-expression (row functional equation, Voronoi, AFE) never changes h. Target reflection is already Prop. 5.1. Exact LP with height: infimum 13/15, 5/6 floor unchanged, height only loses. MODEL abscissae |
| c5-angular-family-absorption | explore | precise-obstruction | 0 | holds; one PROVED error term wrong (weight N(c*)^(-1/2)) | Angular lambda^(6k) and ring-class families: root number +1, no Gauss sum, mu is not absorbed; the ray coherent set couples s to conj(c), net gain 0; abscissa >= 1 unconditionally. Abstract-family row argued, not proved |
| c5-marks-circularity-order2 | explore | precise-obstruction (inside r3 model) | 0 | does not hold as written (one false sentence in claim A) | Marks outnumbering rows is infeasible. B = 1/2 is LP-feasible only at tall h = 3 points, where the low input is equivalent to GRH for the family; on the compensated ray the abscissa is 1 minus the TRO6 polar-correlation saving. Relative to a transcribed reduced system |
| c5-twisted-helson-arcs | combine | precise-obstruction | 0 | holds, all PROVED steps re-derived | Additive-twist discrepancy hypotheses: the strict form forces chi = n^(-i alpha) (identification); the general form is passed by THIN with a zero at b. No inconsistency with the round-4 Theorem 1 (sigma_0 is the top real zero) |
| c5-thin-walk-replay | deepen | partial-result | 0 | holds with six corrections | THIN regular in every ray class exists relative to a modulus-independent Hoheisel exponent not located as a stated theorem. Five manuscript steps replayed with eps hold; first failing hypothesis is Lemma 5.8. The (kappa, e) consistency test is vacuous (g > 1) |
| c5-device-table-extension | explore | precise-obstruction | 0 | holds, six wording corrections | Seven devices closed: Baker and Turan read frequencies only; p-adic data read non-positive integers only (new interpolation-twin control); tensor squeeze bounds sizes; Carleson/corona assume RH; strip Dirichlet-to-Neumann identity holds for DH; sum-product is Vinogradov-Korobov |
| c5-repair-engine-map-r4 | repair | partial-result | 0 | holds; corollary scope narrowed to the largest real zero | Curated device list replaces the keyword role (top 60: 0 closed devices, 25 open, 35 floored-only). Map rows P44-P49, G26. Helson Theorem 2: largest real zero b of F satisfies b(1-b) <= 10 theta. Heat Ritz run has no object |

### Lessons (round 5)

1. The signal constant of a probe in the Prop. 2.1 format is an invariant of the probe (Lemma U). Re-expressing a probe can lower the proved low exponent only; h does not move. A route to h > 1 needs a different probe, and the only region where the ledger shows one (lx < l) is where the reduced system is inconsistent with an unidentified false input.
2. A coherent set of exponent 1/2 must be coherent for every (s, c) pair. In abelian families (characters injective in the row parameter) the only such row is the trivial character, i.e. the Moebius sum. mu is absorbed only through a nontrivial weight-1 cocycle of the epsilon factor (Jacobi sums, order >= 3).
3. A comparison system reaching abscissa 1/2 sits at a critical point (h = 3) where its low input is equivalent to GRH for the family; TRO6 at large b on the compensated ray is a restatement of the conclusion. This is inside r3's transcribed model and not refereed against the manuscript.
4. Modulus-uniform additive-twist hypotheses on chi are an identification (strict form) or are passed by THIN (general form). Periodicity of twists separates zeta from THIN and Beurling but supplies no inequality.
5. Ask what a device reads before work: frequencies only, discrete special values, sizes of local parameters, or the zero set itself. Each class has a named control that passes (any Dirichlet series; interpolation twin; unimodular twist; DH). The only pairing failing both DH and sign twists at non-identity steps is Vinogradov-Korobov, capped at (log t)^(-2/3).
6. A total mean-square exponent cannot detect a component that is 1% of the total; regression on a reference weight with a large Mertens sum does. The component found is linear in the Mertens-type sum and is not specific to multiplicative weights, so it is not an R1 signal. The measured rows do not decide Proposition D; only the probe (6.1) does.
7. The replayed steps of the 7/8 manuscript use the target only as a unimodular completely multiplicative scalar; the single target-specific hypothesis is Lemma 5.8 (finite-ray character). THIN still rests on a Hoheisel-type theorem that was not located.
8. Pattern across five rounds (50 lanes, 48 at score 0): R4 has not been obtained by any lane. Three independent approaches to effective order 2 inside the only R1-R3 mechanism returned the floor (5/6 at r = 6) or an input equivalent to the conclusion.

### Families closed in round 5

- Re-expression of the same probe in the 7/8 ledger (target functional equation, Voronoi, AFE, height aspect): Lemma U plus exact LP.
- Abelian coherent families at effective order 2 (angular lambda^(6k), ring-class, anticyclotomic, quadratic): no weight-1 epsilon cocycle, no absorption of mu.
- Additive-twist (major-arc) discrepancy hypotheses on completely multiplicative chi: identification or passed by THIN. Closes the Helson family with round 4.
- Devices: Baker linear forms, finite Turan power sums, p-adic/Iwasawa interpolation, tensor-power squeeze, Carleson/corona on the bridge symbol, strip Dirichlet-to-Neumann phase identity, sum-product (by argument).
- Heat family as an object for Suzuki's determinant criterion (no causal kernel for tau < 0).

Closed inside a model only (not a closed family): long prime marks to h = r/2 (`c5-marks-circularity-order2`).

### Results that could be combined

- `c5-thin-propd-dichotomy` (rows.c, Liouville regression) + `c5-thin-walk-replay` (EXCHANGE.md, condition (N): eps-row energy exponent >= 2b - 5/6) + `c5-twisted-helson-arcs` (use a class-balanced or random THIN set; the greedy set is biased mod 3): compute the probe I_w of (6.1) for w = eps (b = 0.95), Liouville and 1 at Z = 2^10..2^18 with ||A||, ||B||. This measures both sides of Proposition D.
- `c5-target-fe-order2-ledger` (inconsistent region lx < l) + `c5-marks-circularity-order2` (uncompensated high side guessed by r3): test with the `tmp/sextic` tools whether unreflected marked theta rows obey a K + D mean square for 1 + l <= M < 2 + 2l or carry the (KD)^(2/3) term. Identifies the false input and settles referee item E3 of `r3-method-limit`.
- `c5-angular-family-absorption` (cocycle criterion) + map 6.18 (genuine cusp forms on the double cover of GL(3)): the criterion says what a nonabelian family must supply; a finite check of its epsilon factor is the first test.
- Interpolation twin (`c5-device-table-extension`) joins the control list; apply it to any future device using special values.

### Open items carried forward

- Engine: `curated/mk_devices.py` updated by this learn step (26 device types: 23 closed, 1 floored, 2 open; `map-open-21` closed; `map-open-1` open and narrowed). `build_graph.py`, `merge_outcomes.py` and `generate.py` were not rerun; the six device-lane nodes in `push/c5-device-table-extension/nodes.json` are not yet in the graph. Only `map-open-1` and `map-open-9` remain as open device nodes.
- Map: seven device rows with the referee's six wording corrections; row Z15b (corrected free-geometry statement); angular-family row after Theorem 7 is refereed; update of row Z15 and section 6 item 1 after Theorems B, C are checked against the manuscript; correct section 4 entry 49 and row P46 to "largest real zero".
- Referee debts: Lemma U (one referee); Lemma A step (c) of the twisted lane; Theorem 7(iv) of the angular lane and Froehlich-Queyrut (recalled); Theorems B and C of the marks lane; Hoheisel exponent in ray classes (not located); Lemma 7.1 discrepancy against the PDF or Lean; Turan's equivalence (cited from memory); Theorem 2 of the repair lane (one referee).
- Controls not run in the 7/8-ledger lanes: all (they are floor statements inside the estimate system).
