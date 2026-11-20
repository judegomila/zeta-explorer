# Proof map: hexagon:2611.00460v1 (Raymond), "A computer-assisted bound Lambda <= 0.107964910079"

Status of this file: a map made by reading the whole 63-page paper, the verification guide, the
source supplement and all 15 checker programs. It is NOT a verification of the theorem. What was
actually executed is listed in section 8. Nothing else was replayed or re-derived.

Section and equation numbers are those of the PDF (text in `paper.txt`).

## 0. Acquisition and integrity (done 2026-11-17)

| Object | Where | Result |
|---|---|---|
| Hexagon PDF | `packet/paper.pdf` (730,528 B, sha256 0d866380...) | 63 pages. Recompiled 14 Nov 2026 with a `hexagon:2611.00460v1` stamp; bytes differ from the Zenodo PDF. |
| Hexagon source | `packet/source.bin` -> `packet/hexsrc/` | zip with one file, `Unconditional_0107965.tex`, sha256 adbd147a..., byte-identical to the Zenodo TeX. |
| Zenodo record 23752103 | `packet/zenodo/` (16 files, 201 MB zip included) | all reachable. `SHA256SUMS.txt`: 15/15 OK. `Release_Manifest.json`: 14/14 sizes and digests OK. |
| GitHub repo | `packet/repo/` (3 commits) | `deposit/` = 15 files, each byte-identical to the Zenodo file of the same name. The 16th (Proof_and_Replay.zip) is only on Zenodo. |
| Proof_and_Replay.zip | `packet/replay/` | 3,579 entries, no absolute or `..` paths, no symlinks. `BUNDLE_MANIFEST.json`: 3,388/3,388 files match size and sha256, none unlisted, none missing. |
| Paper-named inputs | plan ec346b7c..., source ledger b59905d7..., flow a664e829..., direct-source checker a0e8cca8... | all four digests match the values printed in the paper / supplement. |

All hosts were reachable. Own check script: `scripts/check_manifests.py`, output `runs/check_manifests.json`.
The author's `Verify_Deposit.py` was not run (see section 8).

## 1. The claim

Theorem 1.1: 0 <= Lambda <= B* = 427693072077942473661578098491/3961408125713216879677197516800 < 0.107964910079
(Polymath normalisation, H_0(z) = xi((1+iz)/2)/8, d_t H = -d_zz H).

B* = T + Q_T/2 with T = 22101/204800 = 0.1079150390625 and Q_T = 7902377963830536747158643/2^96 ~ 9.974e-5.
(Exact identity re-checked here with Python fractions.)

The paper says it is not peer reviewed, that the internal "independent" checks were done in the same
AI session as the construction (sec 5.5), and that no end-to-end formalisation exists.

## 2. External results used (exact statements)

| # | Result | Statement used | Where it enters | Notes |
|---|---|---|---|---|
| E1 | OpenAI 7/8 theorem [24], Lean decl. `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` at openai/math fd4aeeb2 | zeta(s) != 0 for Re s > 7/8. **Ordinary Riemann zeta only**: no Dirichlet L-functions, no narrower abscissa (0.8748867 is explicitly not used). | eq (14)-(15), sec 4.4: initial strip abs(Im z) <= 3/4, seed Q_0 = 9/16 + 1e-12. | Cited, not rebuilt by the author (external build report [7]). Unrefereed. This project has a local Lean replay. |
| E2 | Platt-Trudgian [4], Theorem 1 | RH holds up to ordinate 3000175332800 (exact endpoint used). | Prop 2.4 (finite head): all zeros of H_0 with abs(Re z) <= X = 6000000185827 are real; clearance 3000175332800 - (X+1)/2 = 175239886. | **Used**, and essential: without it Prop 2.4 fails and the source theorem (valid only for x >= X) does not cover the contact. Refereed. |
| E3 | de Bruijn [1, Thm 13] = Polymath [3, Thm 3.2] | zeros in abs(Im) <= a at t0 => abs(Im)^2 <= max(a^2 - 2(t-t0), 0) later. | (a) startup on [0, tau], tau = 1e-14; (b) abs(Im z) <= 1 inside the rectangle of Prop 2.4; (c) terminal cleanup Lemma 2.11. | Classical. |
| E4 | Polymath [3] Prop 3.1(i),(ii) | zero ODE z' = 2 sum 1/(z - rho) (valid with complex/repeated other zeros); sqrt-splitting of an m-fold zero along Hermite roots. | Prop 2.4, Prop 2.7, eq (39), Lemma 2.9. | Refereed. Check the exact hypotheses (symmetric summation; (ii) forward and backward in time). |
| E5 | Polymath [3] Thm 1.5(i) | one absolute C: for 0 < t <= 1/2 all zeros with Re z >= exp(C/t) are real. | Lemma 2.8 (compactness on [tau, T]). | Only existence of C is used. |
| E6 | Polymath [3] Prop 6.1 and the sec 6.2 remainder calculation | effective approximation of H_t by the heated Riemann-Siegel sum, per-term error, Gaussian remainder. | Prop 2.3 (wall, sigma in [-1,2], t <= 1/5), Prop 3.2 (source, sigma in [-3,4], probe heights up to 6.01). | **Not a plain citation.** The published theorem is stated for 0 <= y <= 1. The paper re-derives it on wider ranges "before the narrower-height simplification", with the corrected Gaussian constant 11/12. That re-derivation is new mathematics by the author. |
| E7 | Rodgers-Tao [5] | Lambda >= 0 | lower bound only | not needed for the upper bound |
| E8 | FLINT/Arb (python-flint), CPython | correctness of ball arithmetic and exact rationals | every finite stage | software trust base |

**Earlier preprints by the same author** ([9],[11],[12],[13],[20]): no theorem of theirs is cited as a
premise and no number is imported (the flow is rebuilt from the literal 9/16 seed; the 0.116398 chain is
only compared against). But the paper is not self-contained in two places: the proof of Prop 3.2 says
"the complete finite scalar inequalities and their exact endpoints are in the physical-source supplement",
and eq (26) cites "the corrected broad-height transfer in the source supplement". Those are prose notes
inside the packet (`inputs/ANALYTIC_SOURCE_NOTES.json` lists them: `08_BROAD_HEIGHT_SOURCE_EXTENSION.txt`,
`06_SHARED_REMAINDER_PROOF.txt`, `POSITIVE_TIME_NATIVE_VALUE_TRANSFER.md`,
`HEIGHT_SPECIFIC_OLD_COMMON_PHYSICAL_SOURCE_V1.txt`; also `COMMON_MODEL_JOINT_JET_SOURCE_THEOREM_V1.txt`,
`RETAINED_MAIN_COMMON_CLOCK_SOURCE_LEMMA_V1.txt`). Note 08 states that it "extends the physical source
argument in the inherited analytic proof, Sections 4-5", i.e. the earlier Analytic Foundations paper [20],
and it still carries the wrong constant 5/6 that the paper replaces by 11/12. So the derivation of the
approximation errors does lean on the earlier chain's written proof, read with corrections. The 39
"retained" rows also reuse probe node lists from the earlier plan (data only).

Not used: RH, Lindelof, any zero-density or moment input, Xu-Sang / Liu refinements, Ki-Kim-Lee (context only).

## 3. Statements in the paper, in order

| Label | Content | Proof type | Depends on |
|---|---|---|---|
| Thm 1.1 | 0 <= Lambda <= B* | assembly | Cor 4.5, E7 |
| eq (12) | H_t(iy) > 0 (no zeros on the imaginary axis) | elementary | - |
| eq (15),(16) | abs(Im z) <= 3/4 at t = 0; y^2 <= 9/16 - 2t | E1 + functional equation + E3 | E1, E3 |
| Thm 2.1 | de Bruijn strip contraction | cited (E3) | - |
| Lemma 2.2 | Abel summation: 4N prefix inequalities (20) at 4 time centres => Re F_id > 79/100 on [0,T_w] x [0,1], T_w = 41/250, N = 690988 | analytic + hypothesis checked by `wall` stage (2,763,952 prefix tests, 512-bit Arb) | - |
| Prop 2.3 | wall: Re(H_t/B_t)(X+iy) > 697/900 for 0 <= t <= 41/250, 0 <= y <= 1 | analytic transfer (25)-(27): E_id < 1/100, E_AB < 1e-6, E_C < 2/369 | Lemma 2.2, E6 on sigma in [-1,2], `wall` stage |
| Prop 2.4 | zeros with abs(Re z) <= X are real for 0 <= t <= 41/250, simple for t > 0 | Rouche continuation in the rectangle, Hermite splitting | E2, E3, E4, Prop 2.3 |
| Lemma 2.5 | Im of H_t'/H_t is an absolutely convergent sum over conjugate pairs; commutes with the finite probe functional | analytic (order one, Jensen) | - |
| Lemma 2.6 | boundary inequality R(d,y)/2 <= 2/(d^2+4y^2) for all d => K_y(d,b) >= (y/2) R(d,b) for 0 <= b <= y | analytic (Poisson extension in the strip, boundary atom) | - |
| Prop 2.7 | at a simple highest zero: q' <= -2 - 2q (J(t,x) - O_pair(q)) | analytic | E4, Lemma 2.5, Lemma 2.6 |
| Lemma 2.8 | nonreal zeros for t in [tau,T] lie in one compact rectangle | cited | E5, E3 |
| eq (39),(40) | backward heat scaling of an m-fold zero, Hermite polynomial | analytic / E4 | - |
| Lemma 2.9 | a first contact with a left-Lipschitz barrier cannot be a repeated nonreal zero | analytic | (39), Rouche |
| Thm 2.10 | global comparison: piecewise barrier Q' = -2 - rQ with upward resets, J >= B_a, O_pair <= O_a, r < 2(B_a - O_a) => all zeros below Q on [tau,T] | analytic | Prop 2.4, 2.7, Lemma 2.8, 2.9, Thm 3.1, Thm 3.4 |
| Lemma 2.11 | Lambda <= T + q_e/2 | E3 | - |
| Thm 3.1 | source: J_i(t,x) >= M_i - N_i - (1-theta)A_i - theta B_i for every row i, t in its cell, **all x >= X** | analytic reductions (sec 3.2-3.9, App A-D) + stages native, activation, spectral, heads28, heads39, affine, overlays, interfaces, debit/credit maps, direct-source | Prop 3.2, Lemma 3.3, Thm B.1 |
| Prop 3.2 | common finite model f_x approximates H_t/B_t and its h-derivative at x+v+ih, abs(v) <= 39/20, h <= 6: E_0 = 8e^-S + 5e-10, E_1 = 800e^-S + 7e-9; baseline e_0 = 5e-7, e_1 = 5e-5 | analytic; scalar constants checked in `wall` stage | E6 extended, packet prose notes |
| Lemma 3.3 | heat-deformed Dirichlet-log coefficients d_t(n), d~_t(n), c_t(n) >= 0 and nondecreasing in t; recurrences (58)-(60) | analytic (induction) | d_0 = von Mangoldt >= 0 (this is where the Euler product enters) |
| eq (61),(62) | exact matching residual R* >= 0 after multiplying by the Euler factor over {2,3,5}, K = 4096 | analytic identity | Lemma 3.3 |
| eq (63)-(70) | activation (all future cutoffs N > N_0), convex near branch, global cap, affine bound N_actual(L) <= N(0) + beta M (L-L_0)/4 | analytic + stages activation, affine | App A |
| eq (71),(72) | one positive spectral measure; envelope abs(F_i(lambda)) <= sum c_l e^(-h_l lambda/2) for lambda >= log 4096 | analytic + `spectral` stage | - |
| eq (73) | finite head charge, chord in t by convexity | analytic + heads stages | Lemma 3.3 |
| sec 3.6, eq (74)-(76) | arithmetic credits for 39 retained rows: composite allocation, prime-relation phases with the physical clock, concave four-corner bound | analytic + heads39, overlays | App D.3 |
| sec 3.7, eq (77)-(81) | joint derivative ("jet") rows 0, 16, 44: one holomorphic log on a disk, Cauchy bound, Sturm isolation for row 44 | analytic + overlays, direct-source | Prop 3.2 |
| Thm 3.4 | kernel: R_i(d, sqrt q) <= 4/(d^2+4q) for all real d and all q in the row's cap; O_pair,i nondecreasing on the cap; hence (85) | exact rational Bernstein certificates (`kernel` stage) + Lemma 2.6 | Lemma 2.6 |
| Lemma 4.1 | ideal arc stays positive if l = q_0 - (2 + r q_0) delta > 0 | elementary | - |
| Lemma 4.2 | no simple first contact on an arc satisfying (91)-(93) | elementary given (89) | Prop 2.7, Thm 3.1, Thm 3.4 |
| eq (95),(96) | [6/6] Pade upper bound for e^-x | elementary identity | - |
| eq (98) | Newton recurrence for derivatives of 2p/(p^2-q) | elementary identity | - |
| eq (99)-(102) | startup separation at tau = 1e-14 | exact arithmetic | E3 |
| Prop 4.3 | the 221,010 arcs satisfy (91)-(93), join exactly, end at (T, q_T) | `arcs` stage | - |
| Prop 4.4 | every zero of H_T has abs(Im) <= sqrt(q_T) | assembly | E1, Thm 2.10, Prop 4.3 |
| Cor 4.5 | Lambda <= T + q_T/2 = B* | Lemma 2.11 | Prop 4.4 |
| Lemma A.1, Prop A.2, A.3 | three-exponential form of the activation integrals; unique maximum | analytic + `activation` stage (469 heights) | - |
| Thm B.1 | direct reconstruction of the 4 x 67 source fields from primitives; eq (116)-(127) | analytic steps 1-5 + `direct-source` stage (step 6) | Prop 3.2, Lemma 3.3, App A, C, D |
| App C, eq (128)-(130) | physical debit ledger; quotient bound P(g, B+b; r_0, r_1); refund scaling | analytic + `physical-debit-map` | Prop 3.2 |
| App D, eq (131),(132) | 28 "shared" rows: frustrated-triad SOS templates, coordinate reserve, Gram/LDL angle-energy bound; 39 "retained" rows: composite payment, polydisc extension past L = 27, clock payment | analytic + heads28, heads39, arithmetic-credit-map | Lemma 3.3 |

## 4. Dependency chain to the number

1. E1 + functional equation => abs(Im z) <= 3/4 at t = 0 (15). E3 => strict separation from Q at t = tau (101),(102).
2. E2 + wall (Lemma 2.2, Prop 2.3) + E3 + E4 => no nonreal zero with abs(Re z) <= X for t in [0, 41/250] (Prop 2.4).
3. E5 => a first contact with the barrier is attained (Lemma 2.8); Lemma 2.9 => it is simple; step 2 => it has abs(x) > X.
4. At that contact: Prop 2.7 (needs Lemma 2.5, 2.6, E4) gives q' <= -2 - 2q(J - O_pair).
5. Thm 3.1 gives J >= S_i(t) for all x >= X; Thm 3.4 gives the kernel hypothesis of Lemma 2.6 and monotone O_pair.
6. Prop 4.3 (arcs): r <= 2(s - o) - 1e-12 on each arc, so q' < Q' at contact: contradiction (Lemma 4.2, Thm 2.10).
7. Hence all zeros of H_T lie in abs(Im) <= sqrt(q_T) (Prop 4.4); Lemma 2.11 gives Lambda <= T + q_T/2 = B*.

## 5. The checker: 15 stages, what each verifies, what each takes as given

Language: Python 3.12, python-flint 0.8.0 / FLINT 3.3.1 (Arb balls at 320-512 bits, exact `fmpq`) plus
standard-library `Fraction`. Launcher `replay/run.py` -> `replay/launch.py` (path remapping of historical
`/workspace/...` strings by monkey-patching `open`/`os`; an audit hook blocks unmapped reads; not a sandbox).
No script uses the network, subprocess (other than run.py spawning launch.py), eval or file deletion.
Recorded author run: 15 stages, 348 s wall with 4 jobs on Linux x86_64; largest stages native (274 s),
kernel (289 s), arcs (169 s). Work output about 1 GB. Memory not stated; the arc stage holds a 123 MB JSON.

| Stage | Script | Verifies | Takes as given |
|---|---|---|---|
| native | `source_primitives/check_native_primitives.py` | For 67 rows x 7 heights: recomputes b_t(n), d_t(n), d~_t(n), c_t(n) for n <= 4096 (positivity asserted), binned sums over all 1 <= n <= 690988, Euler norms P, P1, tail T; checks the stored A, B, D+-, Z, T bounds are on the safe side | That these sums are the right majorants of the model (62); N_0, K, the bin monotonicity guard |
| activation | `source_primitives/check_activation_primitives.py` | For 469 heights: (115), unique critical point by 110 bisections, C sup A <= A_act, C sup D <= D_act, density padding (109) | App A reduction; V-, V+, delta = 1e-12 |
| spectral | `referee/check_all_spectral_envelopes.py` | envelope (72) for all 67 rows on [start <= log 4096, tail] by second-order Taylor interval cover, plus tail | (71): that the analytic remainder is dominated by one positive measure |
| heads28 | `head_and_phase/verify_head_and_phase.py` | 28 shared rows: filter signs, upper/lower coefficient caps for 2 <= n <= 4096, triad packings, SOS templates, coordinate margin, relation logs and phase distance on X in [6e12, 6.6e12], exact Gram, LDL certificate, cosine polynomial, final head fields | App D.2 implications; kappa_0 = 1/5e6 |
| heads39 | `global_analytic/check_retained_39_heads.py` | 39 retained rows: raw head sums, 31 prime capacities at attenuation 27/4, composite allocations, relation parity and phase windows, dual with u asin u + sqrt(1-u^2) - 1 for all 2^(m-1) sign patterns, head fields | App D.3 (polydisc extension, concavity); beta from the affine lane |
| wall | `global_analytic/check_wall_and_physical.py` | cutoff guards (19), carrier phase, all 4N prefix inequalities (20) by direct cosine sums, (25)-(27), Gaussian brackets with 11/12, fixed fees of Prop 3.2, PT clearance, probe-domain guards (52) and E_0 <= e_0, E_1 <= e_1 for every node | Every formula being evaluated. Hard-coded prose constants: 5.5e-12 (per-term errors), moments 6/22/180 and 18/36, coefficients 0.2, 0.029, 229/1000, crossing-pair cost 3e^(1e-5), factor 100 from Cauchy |
| kernel | `kernel/verify_all67_independent.py` | For 67 rows: builds 4 den - (D+4q) num and the O_pair derivative numerator symbolically, converts to Bernstein form on the compactified (z,q) square, checks nonnegativity of every leaf of a supplied partition (coverage checked), far-field coefficient < 1 | That the plan's functional is the one in the source theorem (checked by `interfaces`); Lemma 2.6 |
| arcs | `arcs/verify_arcs_fresh.py` | plan/source/flow digests; row cells join and cover [0, 87/800]; A >= B > 0; poles above caps, abs(shift) <= 39/20; for each of 221,010 arcs: exact join, cell and cap, s <= S_i(t_0), o >= O_pair(q_0) (Newton), 2(s-o) - r >= 1e-12, l > 0, Pade outgoing bound, 96-bit dyadic q_1; terminal pair, startup (102), endpoint, arc counts | (89), i.e. Thm 3.1, Thm 3.4 and all of section 2 |
| affine | `referee/check_original_affine_native.py` | 67 rows: caps (124), gap g > r_0, near/far inequalities giving (70), exact equality with stored debits | native/activation tables (bound to the fresh runs by `interfaces`); e_0 = 5e-7, e_1 = 5e-5 hard-coded as r_0 = P/2e6, r_1 = P/2e4 + P1/4e6; coordinate allowance 1e-9 |
| overlays | `source_overlays/verify_source_overlays_independent.py` | refunds (126), jet circle bounds (78)-(81) incl. Sturm root isolation for row 44, common-clock relations at four corners for all sign branches, row 8 eighth relation, reconstruction of final fields | Prop 3.2, sec 3.6, 3.7 |
| compact-arcs | `arcs/compact_arc_witnesses.py` | repackages arc margins as 128-bit lower bounds | output of `arcs` |
| interfaces | `referee/check_mathematical_interfaces.py` | kernel plan == final plan; same nodes, cells, caps, four fields across source table, kernel, arcs; shared debits rebuilt | fresh outputs of earlier stages in the same work directory |
| physical-debit-map | `review/physical_debit/verify_physical_debit_map.py` | exact ledger of 469 caps and 67 refunds (stdlib only) | composition audit only |
| arithmetic-credit-map | `review/arithmetic_credit/build_credit_audit.py` | exact ledger of credits (stdlib only) | composition audit only |
| direct-source | `direct_source/verify_direct_source.py` | (116), adapters, jet binding, all 268 field identities (119)-(122) | the inequalities of the other stages |

### Gaps in what the checker establishes

1. **No stage checks the analytic approximation itself.** Prop 2.3 and Prop 3.2 (H_t/B_t versus the finite
   model, at heights up to 6.01 and for every x >= X) are prose. The `wall` stage only evaluates the final
   scalar inequalities with constants typed in from the prose (list in the table). If one of those constants
   is wrong, every stage still passes.
2. **Baseline errors e_0 = 5e-7, e_1 = 5e-5 are literals** in `affine`, `interfaces`, `overlays`, debit map.
3. **Identification of the checked sums with the function.** That A, B, D, Z, R*, the activation integrals
   and the spectral measure bound the actual model for all x >= X (monotonicity beyond L_0, counting-measure
   comparison, moving cutoff) is argued in sec 3.3-3.5 and App A, not computed.
4. **All certificate data are outputs of unverified numerics, used as untrusted candidates**: node lists and
   caps (plan), the four source fields, native/activation tables, envelope duals and covers, capacity tables,
   triad allocations, relation vectors and multipliers, LDL factors, kernel partitions, the arc list. For
   each I found a consumer that re-derives or bounds it; I did not find a table that is accepted on a saved
   PASS flag. This is a reading of the code, not a test. A referee should confirm it per stage, in particular
   that `overlays` and `direct-source` (the two longest scripts, read here only at the level of inputs and
   check labels) do not consume a stored bound without recomputing it.
5. **Cross-stage binding** relies on `interfaces` and `direct-source` reading the fresh outputs in one work
   directory; a partial run proves nothing about the chain.
6. **Section 2 is not touched by any stage** (Lemmas 2.5-2.9, Prop 2.4, 2.7, Thm 2.10).
7. **E1 is not rebuilt** in the packet; E2 is a literature citation.
8. Same arithmetic library everywhere; "independent consumers" were written in the same AI session as the producers.

## 6. Points noted while reading (questions for referees, not findings)

- Polymath's effective approximation is published for 0 <= y <= 1 and t > 0. Here it is used at probe
  heights up to 6.01 (Re s in [-3,4]) and on closed cells that include t = 0. The comparison itself only
  needs t >= tau > 0; the wall and Prop 2.4 are stated on the closed interval from t = 0.
- The wall requires H_t(X+iy) != 0 for all t in [0, 0.164] including y = 0, i.e. no real zero crosses x = X
  in that time. X is chosen for this; the four-cell Lipschitz argument in Lemma 2.2 carries it.
- Lemma 2.6: the target kernel has a boundary singularity at (0, y); the argument uses a boundary measure
  with an atom. Units: (34) is R/2 <= 2/(d^2+4y^2), Thm 3.4 states R <= 4/(d^2+4q); these agree.
- Thm 2.10 needs every contact to satisfy abs(x) > X and the source to hold at translated points >= X - 2;
  Prop 3.2 anchors at X* = X - 4.
- Row 0 node weights are large and of mixed sign (e.g. +16.85, -14.28 at height 3), so the source bound
  depends on cancellation in the signed filter; the physical-error charge uses absolute weights.
- The arithmetic credits (sec 3.6, App D) use the actual prime phases through "relations" among primes and
  the clock tau = x/2 + pi t/8, split into a near band in L and a far region paid by unspent main slope.
  This is the least standard part of the argument.
- The paper's own referee file (`review/referee/REFEREE_SCOPE_AND_OPEN_ISSUES.txt`) records two errors
  found and corrected late (activation constant 4C vs 2C; Gaussian 5/6 vs 11/12).

## 7. Parts that need independent refereeing

| Id | Part | Sections |
|---|---|---|
| R1 | Initial strip and normalisation: E1 statement, map to H_0, seed, startup | 2.1, 4.4, 5.1 |
| R2 | Finite head: wall (Abel transfer, error budget), use of Platt-Trudgian, continuation of reality | 2.2 |
| R3 | Zero dynamics and global comparison: paired sums, Poisson extension, current inequality, compactness, repeated contacts, Thm 2.10 | 2.3-2.5, 4.1-4.2 |
| R4 | Physical approximation at heights up to 6 with the 11/12 remainder; common model, cutoff changes, Cauchy derivative | 3.2, C.1-C.2, packet notes |
| R5 | Finite model algebra: coefficient positivity, Euler matching, residual, activation for all future cutoffs, spectral measure, affine bound, refunds | 3.3-3.5, A, C.3-C.4 |
| R6 | Arithmetic credits: 28 shared rows (triads, Gram) and 39 retained rows (composites, clock relations, near/far) | 3.6, D |
| R7 | Jet rows 0, 16, 44 and the assembly Thm B.1 (268 fields) | 3.7, 3.9, B, C.5 |
| R8 | Kernel certificates: algebra of the cleared polynomial, compactification, Bernstein cover, own-pair monotonicity | 3.8, kernel stage |
| R9 | Exact flow: full replay of 221,010 arcs, joins, terminal arithmetic; and a full 15-stage replay with code audit of each consumer | 4.3-4.8, 5 |

## 8. What was executed here

All runs local, through `scripts/memcap.sh 8`, Python started with `-I`.

1. `scripts/check_manifests.py` (own code, stdlib): all digests above; T + Q_T/2 = B*; B* < 0.107964910079 <
   B* + 1e-12; PT clearance 175239886. Output `runs/check_manifests.json`.
2. Packet stage `activation` (script and launcher read in full first), run through `replay/launch.py` with
   Python 3.15.2 and python-flint 0.9.0 from a sibling venv (not the pinned 3.12 / 0.8.0 runtime, which is a
   Linux binary): exit 0, PASS, 67 rows, 469 heights, 6,829 checks (same count as the author's log), 0.7 s.
   Log `runs/slice_activation.log`.
3. `scripts/arc_slice.py` (own code, stdlib fractions, different formulas from the packet: binomial closed
   form for the jet own-pair, Taylor upper bound for e^-x): 820 of 221,010 arcs (0-599, the row 15/16 and
   43/44 joins, the last 100) satisfy (91)-(93) with eta = 1e-12 and join exactly; terminal pair, endpoint
   identity, startup gap 9.30e-13 and per-row arc counts confirmed. Log `runs/arc_slice.log`.

Not run: the other 14 stages, the full arc replay, the author's `Verify_Deposit.py` and
`verify_bundle.py` (a first attempt to run `Verify_Deposit.py` was blocked by the session's permission
layer; it had not yet been read in full, so it was left unrun and its digest checks were redone with own
code), any Lean build. No analytic statement was re-derived. Nothing was run on the compute server.
