# c14-joint-zeta-twist-noncone-search: RESULT

Date 2026-11-19. Kind: compute (heavy lane), round 14.
No statement about zeros of zeta is made. Requirement flags: R1 = R2 = R3 = R4 = false (section 7).
Labels: PROVED / CLASSICAL / MEASURED (float64, or "ball" where a python-flint ball excludes 0) / ARGUED / OPEN.

## 0. Verdict

**Outcome "none" (the registered prediction). In the registered dictionary DJ of functionals of a pair of kernels
(K_A, K_B = kernel of A twisted by a Dirichlet character) no functional takes one sign on the 529 training positive
pairs and the opposite sign on a training pair of each of the nine control classes. The held-out rule is never
reached. DJ is recorded as a closed device class on the registered grid and draws (MEASURED).**

| stage | functionals in the window | sent to stage 2 | one-signed on the 23 pairs (zeta, chi) (PZ) | T-train, PZ | one-signed on all 529 positives (PA, registered) | T-train, PA | T-weak, PA | full criterion, PA | FE tier: T-train / full, PA | float64-undecided rows resolved in balls (PA) | alive after balls |
|---|---|---|---|---|---|---|---|---|---|---|---|
| registered grid (10 families) | 1,487,558 | 523,771 | 440,516 | 3 | 94,531 | 0 | 0 | 0 | 0 / 0 | 223 | 0 |
| registered draws | 3,299,608 | 1,865,621 | 1,777,753 | 14 | 376,714 | 0 | 0 | 0 | 2 / 0 | 1,364 | 0 (2 in the FE tier at T-train only) |
| adaptive stage (registered) | 316,193 | 186,483 | 179,543 | 81 | 30,084 | 0 | 0 | 0 | 35 / 0 | 46 | 0 (35 FE tier, T-train only) |
| amendment B2 draws (ten times) | 32,998,268 | 18,652,726 | 17,771,663 | 180 | 3,765,315 | 0 | 0 | 0 | 22 / 0 | 13,440 | 0 (22 FE tier, T-train only) |
| total | 38,101,627 | 21,228,601 | 20,169,475 | 278 | 4,266,644 | 0 | 0 | 0 | 59 / 0 | 15,073 | 0 |

Objects: 833 pairs (23 + 506 training positives, 24 held-out positives, 64 training control pairs, 9 x 24 held-out
control pairs). The favourable reading of PREREG section 6 gives the same counts as the strict one.

What stands between DJ and a separator (`tables/by_family.md`, `tables/by_family.json`):

1. **Registered positives (PA).** Of the 4,266,644 functionals with one strict sign on all 529 positive pairs, 975
   (0.023%) give a training backward-heat pair the opposite sign; none of the 975 does so for every other class. In
   the mixed minors (JA, both kernels) and the Hermitian minors (JB1) no functional one-signed on PA rejects a
   backward-heat pair (0 of 13,470). Largest value, over functionals one-signed on PA with at least 23 of 24 held-out
   positives of the same sign, of the minimum over classes of the held-out opposite fraction: 5/24 = 0.208 (needed:
   23/24).
2. **Positives = the 23 pairs (zeta, chi) alone (secondary tier PZ).** 278 functionals (22 mixed minors with polar
   terms, 256 Turan cross expressions JC1) reject a training pair of every class. Each of them has at least 4 of the
   506 pairs (chi, chi') of the opposite sign (median 4, maximum 504), so none is one-signed on PA; none has at least
   23 held-out positives together with any held-out opposition in every class (the minimum over classes is 0 on those
   rows; over all 278 rows it is at most 8/24). Not resolved in balls (float64 only).
3. **FE tier (classes whose twisted member keeps a functional equation: T-NR, E_a, HEAT, BLS; Lemma T).** 59
   functionals, all Hermitian forms JB2 with polar terms (order 6: 20, order 8: 30, order 12: 9), are one-signed on all 529
   positives and reject a training pair of each of the four classes. None meets the held-out rule: 18 to 22 of the 24
   held-out positives keep the sign (23 needed) and the minimum over the nine classes of the held-out opposite count
   is at most 6 of 24. In the nine-class reading all 59 fail on THIN (58 on THIN alone; 1 on DH, U, THIN and BEU).
4. **By class.** HEAT is rejected least in every family (13,040 of 20,169,475 with PZ; 975 of 4,266,644 with PA).
   THIN is never rejected by a Hermitian form JB2 (0 of 3,766,915 with PZ). E_a is never rejected, with PA, by JA,
   JC1 and JC2 without polar terms or by JB1 (0 of 1,272,988 one-signed functionals in those families). JC2 without
   polar terms never rejects HEAT (0 of 2,475,769 with PZ): this is the identity of Lemma J1 (PROVED).
5. **The positives disagree among themselves.** Requiring one sign on the pairs (chi, chi') as well as on (zeta, chi)
   reduces the one-signed set from 20,169,475 to 4,266,644; in the mixed minors with polar terms from 521,731 to 477.

Controls of the search (section 5): kernel-level planted separator recovered (the registered functional JB1, m = 2,
t = 0, h = 0.1 is a full survivor of the synthetic run, 24/24 in every class); value-level planted rows recovered in
all 40 family runs; label shuffles: 0 survivors at any tier in 4,000 permutation-family runs; float64 against balls:
0 disagreements in 3,856 float64-decided entries (144 entries of the theta^w twist have no ball evaluation);
float64 against an independent mpmath path: 132 of 132 (28 sampled entries outside the reference).

A run of a different pair definition, normalisation, lift, object set or functional type does not extend this verdict
(NOT-RUN).

## 1. Plan and what is new relative to the map

Map rows nearest: G4, G21, G23, P40, L4 and the control rows (DH, NR, HEAT, EA, DEL); predecessor
c13-noncone-kernel-separator-search (functionals of one kernel: outcome "none"; its section 9 names "a functional
that reads two kernels at once" and "Hermitian forms for complex kernels" as questions not run). New here: (i) the
object is a pair (F, F twisted by chi), so that a functional can compare a kernel with its own twist; (ii) the
positives include all ordered pairs of L-functions of conductor <= 13, not only pairs with zeta; (iii) Hermitian
minors and Hermitian forms, which are real for complex kernels without a real-part convention; (iv) a lift of every
control class to a pair, with Lemma T on which lifts keep a functional equation and an FE tier that discounts
separation by a missing reflection symmetry; (v) two classes not in c13: BLS (polynomial form) and Beurling.

Order of work: PREREG.md before any code ran. Local first test (through `scripts/memcap.sh 8`, float64, class 7
absent because the THIN sets need scipy and python-flint): kernel checks, Lemma T residuals, planted kernel-level
run, three grid families: no T-train. Amendments B1 to B5 (PREREG section 11) were written before the server run.
The server run executed the whole pipeline once from scratch; every number in this file comes from it. Local trial
outputs were deleted.

## 2. Lemma T (registered exclusion, not a result): functional equation of the twisted control member

Convention: Lambda(1/2 + z) = int K(u) e^(zu) du; a functional equation with root number of modulus 1 reads
K(-u) = eps conj K(u). Residual = abs(K(-u) - eps conj K(u)) / (abs K(-u) + abs K(u)) at u = 0.9 with eps taken at
u = 0.3 (`fe_table_full.json`, all 268 control pairs).

| class | twisted member | status | evidence |
|---|---|---|---|
| T-NR | conj(chi(p0)) K_chi(u - l) + c K_chi(u) + chi(p0) K_chi(u + l), l = log p0 | kept, PROVED | T(-u) = conj(chi(p0)) conj K_chi(u + l) + c conj K_chi(u) + chi(p0) conj K_chi(u - l) = conj T(u), from K_chi(-u) = conj K_chi(u). Its zeros: those of L(chi) and of x + 1/x + c = 0 with x = chi(p0) p0^(1/2 - s), where x is real negative and not -1 for c > 2: off the line |
| HEAT | e^(tau u^2/4) K_chi(u) | kept, PROVED | even real multiplier |
| BLS | P_b(D) K_chi, P_b real and even | kept, PROVED | even real differential operator; four zeros +-b, +-conj(b) off the line by construction |
| E_a | kernel of Lambda(s + a, chi) Lambda(s - a, chi) | kept, CLASSICAL | root number eps(chi)^2; measured: eps from two points agrees to 9.4e-15, abs(eps) = 1 to 8.5e-15 (34 members) |
| DH | series with coefficients a_G(n) psi(n) | lost in general, MEASURED | residual below 1e-8 for 5 of 28 members (among them the training pair with psi = chi4.3), 0.12 to 1.72 for the other 23 |
| theta^w | sum_m r_w(m) chi(m) exp(-pi m e^(2u)/q) | lost, MEASURED | residual 0.022 to 1.5 on all 30 members. At w = 1 the twist is the kernel of L(chi^2) (checked: equal to the chi^2 series to 1e-15) |
| U, THIN, BEU | coefficientwise twist | none before, none after, MEASURED | residuals: U 0.07 to 0.96 (33), THIN 1.2e-4 to 0.90 (30), BEU 0.0097 to 1.5 (29) |

The residuals of T-NR, HEAT, BLS and E_a in the table file are below 3e-16, but for these classes the code evaluates
the kernel through the reflection, so those residuals test nothing; the statuses rest on the proofs and on the
two-point eps check. FE tier = classes {T-NR, E_a, HEAT, BLS}.

## 3. Objects and dictionary (PREREG sections 3 to 5; code `jk.py`, `jobj.py`, `jf.py`)

Positives: (zeta, chi) for the 23 primitive characters of conductor <= 13 (one per conjugate pair), all 506 ordered
pairs (chi, chi'), 24 held-out pairs with conductors 14 to 40. Kernels of zeta and chi are the c13 kernels.
Controls: nine classes, each lifted to (G, G twisted by chi) as in PREREG section 4: DH, T-NR, E_a, HEAT, theta^w, U,
THIN, BLS, BEU; 4 to 10 training pairs and 24 held-out pairs each. The THIN-0.9 set equals the battery file.

Dictionary DJ (38,101,627 functionals in the window over all stages):
- JA: mixed minors of orders 2 to 4, rows alternating between K_A and K_B, columns dilations by n <= 13.
- JB1: Hermitian minors of orders 2 to 4 of cos(t) K_B + sin(t) K_A read at u >= 0.
- JB2: Hermitian forms with phases e^(i phi i) on equally spaced nodes, orders 2, 3, 4, 6, 8, 12.
- JC1: K_A(u -+ h) K_B(u +- h) - lam K_A(u) K_B(u). JC2: Re[K_A(u-h) conj K_A(u+h)] abs(K_B(u))^2 - lam abs(K_A(u))^2
  Re[K_B(u-h) conj K_B(u+h)].
Each with the A-side kernel with polar terms and without.

Kernel checks (`validate.json`, 60 window points per type against 256-bit balls): largest relative error 8e-13 or
less for every new type except the DH twist (1.2e-11, at a cancellation point of a series without functional
equation, inside its noise estimate); the theta^w twist has no ball evaluation; the c13 E_a kernel without polar
terms differs from its ball by up to 12 in relative terms at cancellation points where the ball itself is wide
(2.7e-6), which is the case the noise rule marks undecided.

## 4. Result tables

Per family, positives PA (registered), strict reading, all four stages. Columns DH to BEU: number of one-signed
functionals for which a training pair of the class has the opposite sign. Last column: best minimum over classes of
the held-out opposite fraction among rows with at least 23 of 24 held-out positives.

| family | functionals | one-signed | DH | T-NR | E_a | HEAT | theta^w | U | THIN | BLS | BEU | T-train | best min |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| JA-with | 2,825,547 | 477 | 32 | 35 | 477 | 0 | 477 | 435 | 222 | 468 | 5 | 0 | 0.000 |
| JA-without | 2,821,842 | 4,401 | 1,174 | 2,795 | 0 | 0 | 2,856 | 2,236 | 97 | 3,384 | 1,224 | 0 | 0.083 |
| JB1-with | 4,579,682 | 4,369 | 2,120 | 1,226 | 0 | 0 | 1,631 | 0 | 0 | 2,073 | 0 | 0 | 0.000 |
| JB1-without | 4,589,918 | 4,223 | 2,200 | 1 | 0 | 0 | 7 | 0 | 0 | 1,931 | 0 | 0 | 0.000 |
| JB2-with | 3,433,603 | 830,153 | 73,637 | 10,367 | 730,711 | 123 | 147,187 | 66,303 | 0 | 483,134 | 25,319 | 0 | 0.208 |
| JB2-without | 3,437,428 | 894,082 | 95,852 | 916 | 402 | 40 | 77,749 | 51,482 | 0 | 91,996 | 14,354 | 0 | 0.208 |
| JC1-with | 4,110,897 | 158,125 | 5,925 | 29,647 | 158,125 | 0 | 74,189 | 29,040 | 7,087 | 118,361 | 7,571 | 0 | 0.083 |
| JC1-without | 4,103,458 | 154,404 | 6,051 | 13,097 | 0 | 4 | 49,558 | 31,113 | 5,224 | 145,864 | 7,627 | 0 | 0.042 |
| JC2-with | 4,102,054 | 1,110,819 | 172,997 | 218,208 | 303,354 | 808 | 23,526 | 102,849 | 237,162 | 333,123 | 314,812 | 0 | 0.042 |
| JC2-without | 4,097,198 | 1,105,591 | 187,187 | 382,587 | 0 | 0 | 57,027 | 260,330 | 295,704 | 656,707 | 382,144 | 0 | 0.042 |
| total | 38,101,627 | 4,266,644 | 547,175 | 658,879 | 1,193,069 | 975 | 434,207 | 543,788 | 545,496 | 1,837,041 | 753,056 | 0 | 0.208 |

The same with positives PZ (the 23 pairs (zeta, chi) only):

| family | one-signed | DH | T-NR | E_a | HEAT | theta^w | U | THIN | BLS | BEU | T-train | best min |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| JA-with | 521,731 | 390,257 | 310,212 | 310,879 | 2,985 | 221,206 | 190,346 | 70,011 | 418,597 | 49,357 | 22 | 0.083 |
| JA-without | 864,514 | 287,698 | 609,025 | 2,498 | 2,966 | 379,535 | 285,342 | 124,131 | 610,576 | 219,589 | 0 | 0.125 |
| JB1-with | 642,226 | 524,566 | 18,190 | 475,169 | 0 | 104,931 | 73,860 | 116 | 78,638 | 30,194 | 0 | 0.083 |
| JB1-without | 1,641,452 | 1,146,699 | 21,298 | 70,404 | 558 | 214,674 | 145,104 | 596 | 177,858 | 73,802 | 0 | 0.042 |
| JB2-with | 1,569,456 | 456,853 | 61,273 | 1,149,318 | 385 | 314,014 | 129,548 | 0 | 901,701 | 50,930 | 0 | 0.208 |
| JB2-without | 2,197,459 | 619,017 | 29,805 | 52,556 | 432 | 226,909 | 104,095 | 0 | 189,950 | 37,371 | 0 | 0.208 |
| JC1-with | 3,213,846 | 1,707,972 | 1,997,758 | 2,739,842 | 3,172 | 1,685,845 | 1,297,801 | 1,017,075 | 2,020,732 | 814,402 | 253 | 0.083 |
| JC1-without | 3,497,161 | 1,283,554 | 2,438,507 | 100,543 | 1,734 | 1,658,136 | 1,488,671 | 994,566 | 2,191,007 | 1,259,646 | 3 | 0.167 |
| JC2-with | 3,545,861 | 2,400,689 | 601,770 | 1,639,782 | 808 | 612,420 | 853,822 | 1,014,585 | 874,219 | 759,175 | 0 | 0.042 |
| JC2-without | 2,475,769 | 535,943 | 1,092,511 | 76,614 | 0 | 133,519 | 775,365 | 765,422 | 1,482,681 | 948,677 | 0 | 0.042 |
| total | 20,169,475 | 9,353,248 | 7,180,349 | 6,617,605 | 13,040 | 5,551,189 | 5,343,954 | 3,986,502 | 8,945,959 | 4,243,143 | 278 | 0.208 |

Tiers over all stages: PA strict, nine classes: T-train 0, T-weak 0, full 0. PA strict, FE tier: T-train 59, T-weak
0, full 0. PZ strict, nine classes: T-train 278, T-weak 0, full 0. PZ strict, FE tier: T-train 3,007, full 0.

Without the condition on held-out positives, rows exist on which all 24 held-out control pairs of every class have
the sign opposite to the 23 training pairs (JC2 with polar terms, tier PZ): on those rows the held-out positives have
that sign as well; the sign follows the conductor of the twisting character (training <= 13, held-out 14 to 40), not
the class. The criterion counts them as failures through the held-out positives.

Near-miss rows (`tables/pz_ttrain_rows.json`, 1,822 listed rows with parameters):
- PA, FE tier (59 rows, JB2 with polar terms): held-out positives of the same sign 18 to 22; held-out opposite
  counts per class at most (20, 9, 9, 7, 16, 16, 9, 11, 9) for (DH, T-NR, E_a, HEAT, theta^w, U, THIN, BLS, BEU);
  best row: order 6, h = 0.247, phi = 4.12, t = 0.456, held-out (19, 6, 9, 6, 13, 16, 9, 7, 8), 19 of 24 positives.
- PZ, nine classes (278 rows): best minimum over classes 8/24 (a mixed minor of order 4 with 152 of the 506 pairs
  (chi, chi') of the opposite sign and 16 of 24 held-out positives).

## 5. Structure behind the table

**Lemma J1 (PROVED).** Let g(u) = e^(tau u^2/4). For the HEAT pair without polar terms, K_A = g K3_zeta and
K_B = g K_chi. Since g(u - h) g(u + h) = g(u)^2 e^(tau h^2/2):
(i) JC2(u, h, lam) on the HEAT pair = g(u)^4 e^(tau h^2/2) times JC2(u, h, lam) on (zeta, chi) with K3: the same
sign for every tau, u, h, lam. A training HEAT pair is twisted by a character of the training list, so a JC2
functional without polar terms that is one-signed on PZ cannot reject it; a held-out HEAT pair can only be rejected
together with the positive pair (zeta, chi) of its own twisting character.
(ii) JC1(u, h, lam) on the HEAT pair = g(u)^2 e^(tau h^2/2) times JC1(u, h, lam e^(-tau h^2/2)) on (zeta, chi): a
rescaling of lam by e^(abs(tau) h^2/2) > 1.
Measured agreement: JC2 without polar terms, 0 HEAT rejections in 2,475,769 PZ-one-signed functionals; on the grid
the HEAT pair and the positive pair of the same character have equal signs in 80,484 of 80,484 entries
(`lemma_j1_check.json`); for JC1 without polar terms 178,310 equal, 22 different (the lam rescaling).
The identity fails for minors (the factor of a monomial depends on the permutation: exp((tau/2) sum u_i l_sigma(i))
for JA, exp(-(tau/2) sum u_i u_sigma(i)) for JB1) and for kernels with polar terms (the heat kernel with polar terms
is not g times Kpol). In those families HEAT is still the least rejected class; as tau -> 0 the HEAT pair tends to
the positive pair, and the class has members at tau = -0.02.

**THIN and Hermitian forms (ARGUED from the definition; MEASURED 0 of 3,766,915).** JB reads both kernels at u >= 0
only (the registered Hermitian completion). The THIN-0.9 set starts at the prime 5; for u >= 0 the A side differs
from zeta's kernel by relative e^(-24 pi) or less and the twisted side by relative e^(-24 pi/q), q <= 8 on the
training twists (8e-5 at q = 8). A Hermitian form that is not near cancellation therefore has the sign of the
positive pair of the same character. The Hermitian completion was chosen so that a missing functional equation
alone is not detected; the price is this blindness to coefficients at larger primes.

**E_a (MEASURED).** Without polar terms E_a is never rejected, with PA, in JA, JC1, JC2 (0 of 1,264,396) and never
in JB1 (0 of 8,592), as in c13 for the one-kernel minors. With polar terms it is rejected by every one-signed JA and
JC1 functional (477 of 477; 158,125 of 158,125): the polar exponents (1/2 +- a) differ from zeta's.

**Why no pair functional gains over the one-kernel search (ARGUED).** The twist acts on both members of a control
pair by the same operation that maps zeta's kernel to K_chi; for HEAT, BLS and T-NR that operation commutes with
the defining multiplier, so the pair (G, G twisted) is the image of (zeta, chi) under one map applied to both
members, and a functional that is homogeneous in each kernel sees only how that map distorts monomials (Lemma J1 is
the extreme case of no distortion).

## 6. Controls of the search itself

| control | result |
|---|---|
| planted separator, kernel level (synthetic pairs, 2,147,833 functionals) | 25,807 full survivors reported; the registered one (JB1, m = 2, t = 0, h = 0.1) is among them with 24/24 in every class (`planted_check.json`); 0 survivors in 400 shuffle runs of the synthetic set |
| planted separator, value level | recovered exactly in all 40 family runs (5 rows each) |
| label shuffles (200 permutations x 10 families x grid and registered draws, on the every-20th subsample) | 0 survivors at full, T-weak or T-train in 4,000 runs |
| ball recheck of the float64-undecided rows (PA, both tiers) | 15,073 rows, 150,513 ball evaluations: 15,014 have a positive pair of each sign (ball); the other 59 are the float64-decided FE-tier rows of section 0 item 3, which all fail on THIN in the nine-class reading (one of them also on DH, U, BEU) and on the held-out rule in the FE tier; 0 undecided at 4096 bits |
| float64 against balls, random decided entries of the grid families | 3,856 agree, 0 disagree, 144 without ball evaluation (theta^w twist) |
| float64 against mpmath (author check, REFEREE.md) | 132 agree, 0 disagree, 28 outside the reference |
| independent recount of the grid tiers from the sign matrices | equal to the summaries in all 10 families (`ref_recount.json`) |

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument about zeta; a measured search for a sign functional, with outcome "none" |
| R2 (height-uniform, every window) | false | no conclusion of that form; kernels are read on [-2.6, 2.6] |
| R3 (every control fails structurally) | false | the opposite was measured: with the registered positives no functional rejects all nine classes; HEAT passes 99.98% of the one-signed functionals, and all of them in JA and JB1 |
| R4 (reaches the critical line) | false | kernel-side sign conditions; no R4 content |

## 8. Compute record

Server, through `rhrun` only; `rhstatus` read before the launches (three b7 units of other lanes running; slice at 12
to 34 GB of 150). All units of this lane have ended; none was left running.

| unit | request | what | wall time |
|---|---|---|---|
| `rh-c14-float-1119155443` | 16 cores, 32 GB | first launch; stopped by this lane after 8 seconds (own unit, `systemctl --user stop`) to relaunch with one BLAS thread per worker; no output | 8 s |
| `rh-c14-float-1119155451` | 16 cores, 32 GB | `run_all.sh out`: Lemma T table, synthetic run, grid, registered draws, analysis with shuffles, adaptive stage, B2 draws | 96 min |
| `rh-c14-val-1119155810` | 2 cores, 8 GB | kernel validation against balls | about 1 min |
| `rh-c14-post-1119173038` | 16 cores, 32 GB | `run_post.sh out`: ball stage, cross-check, tables | 3 min |
| `rh-c14-planted-1119173647` | 1 core, 4 GB | check of the registered planted functional | seconds |

The validation unit (2 cores) ran for about one minute while the 16-core float unit was running: 18 cores for that
minute, above the 16 of the heavy allowance. GPU not used (determinants of order at most 4 and exp-sums with
per-point truncation). Largest allocations (printed in the log before allocation): sign matrices int8[functionals x
810], at most 2.6 GB per family in the B2 draws; exp-sum blocks of at most 4e6 float64. Peak memory was not
recorded. Local runs (trial, referee check) through `scripts/memcap.sh 8`; three short inspection scripts (seconds,
a few hundred MB: Lemma J1 check, recount, table regrouping) were run directly (REFEREE.md item 7). Server directory
`~/rh-push/c14-joint-zeta-twist-noncone-search/` (19 GB: sign matrices of all stages); mirrored here: the grid sign
matrices and parameters (`out/`), every summary, ball and cross-check JSON, `tables/`, `logs/`.

## 9. Three weakest steps

1. **"None" is a finite search with conventions.** 38.1 million functionals on a grid and on random draws; orders
   stop at 4 (minors) and 12 (forms); the window is [-2.6, 2.6]. The answer depends on definitions made in this lane:
   the lift of each class (the twist of theta^w acts on the index m; the Beurling character is transported from p to
   p + delta; BLS is the polynomial form, the quotient form is NOT-RUN; HEAT and BLS are "twisted" by applying the
   same operator to K_chi), the Hermitian completion that reads u >= 0 only, the real-part reading in JA and JC1,
   the five training twists, the 23/24 rule. With positives PZ instead of PA, 278 functionals reach T-train. No
   theorem says DJ contains no separator; only Lemma J1 is proved, for JC1 and JC2 without polar terms and one class.
2. **Most signs are float64.** About 1.8e10 entries were read in float64 with the c13 rounding-noise rule (a model,
   not an enclosure). Balls were used for the 15,073 rows float64 could not exclude under PA and for 4,000 random
   entries; the 128,814 rows that float64 could not exclude under PZ were not resolved, so the PZ counts are float64
   counts. The theta^w twist has no ball evaluation (its coefficients come from a recurrence that is unstable in
   float64 and is run in fixed point with a heuristic number of guard bits, checked only at w = 1, 2). The ball tail
   bounds of the new kernels (Bessel sum, Beurling sum) are stated in `jball.py` and not proved line by line. A wrong
   float64 sign on a positive pair could hide a survivor only on a row where all nine classes are also rejected.
3. **Class membership, Lemma T and the referee.** That each twisted member has zeros off the line is proved here only
   for T-NR and BLS and is classical for E_a; for HEAT twisted (backward heat of an L-function kernel), DH twisted
   and the classes without functional equation it is not checked. Beurling's zeros in Re s > 0 are zeta's, so it is
   in the question as a class but is not an off-line control. Lemma T is measured (not proved) for DH, theta^w, U,
   THIN, BEU, and the FE tier rests on it. REFEREE.md is written by the lane's own agent; an independent referee is
   owed, and the author's mpmath reference needed two repairs before it agreed.

## 10. For the orchestrator

- Outcome "none": no round-15 lead from this lane; no score flag. The prediction registered in PREREG holds.
- Proposed map row: device class "sign functionals of a kernel and its character twist: mixed dilation minors of
  orders 2 to 4, Hermitian minors and forms, Turan cross expressions, at most three real parameters": closed,
  MEASURED; passes: HEAT (all of JA and JB1, 99.98% overall with the registered positives; exactly, by Lemma J1, for
  JC2 without polar terms), THIN on Hermitian forms, E_a without polar terms.
- What would be a different question (not run): pairs (F, F twisted) read at the same point through a quotient or a
  logarithm (not homogeneous in each kernel, so Lemma J1 does not apply); a functional of three kernels (F, F x chi,
  F x chi^2) using the group law of the twists; the quotient form of BLS; Hermitian forms reading u < 0.

## 11. Files

`PREREG.md` (amendments in section 11), `RESULT.md`, `REFEREE.md`, `lanes.jsonl`; code: `jk.py` (twisted kernels),
`jobj.py` (pairs, Lemma T table), `jf.py` (dictionary and float64 signs), `jrun.py` (cascade), `jan.py` (criterion,
tiers, shuffles, planted rows), `jad.py` (adaptive stage), `jball.py` (ball kernels, ball stage, cross-check,
validation), `make_tables.py`, `tables_fix.py` (per-family totals by exact family name; supersedes the `by_family`
block of `tables/totals.json`, see REFEREE.md item 6), `ref_check.py`, `planted_check.py`, `run_all.sh`,
`run_post.sh`; copies of c13 code: `kern.py`, `ballk.py`, `funcs.py`; copy of c12 code: `sets.py`. Data:
`fe_table_full.json`, `validate.json`, `tables/` (`families.json`, `totals.json`, `by_family.json`, `by_family.md`,
`pz_ttrain_rows.json`, `summary.md`), `lemma_j1_check.json`, `ref_check.json`, `ref_recount.json`,
`planted_check.json`, `out/`, `out_synth/` (summaries), `logs/`.
