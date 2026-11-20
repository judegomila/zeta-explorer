# REFEREE (lens: general) for c7-landau-siegel-device-read/RESULT.md

Date 2026-11-18. Claimed verdict: precise-obstruction. Referee verdict: **the obstruction holds; one measured claim and one explanatory paragraph are wrong as written (split primes), three smaller errors.** No statement about zeros of zeta is made; RH is not assumed; verified height is not used.

Method: Lean statements re-read as text in `~/lean-deps/qrh-verify/lean/` (nothing compiled; no file written there); arithmetic of Statement F and of the constants redone by hand; the toy rerun on eight new discriminants through `scripts/memcap.sh 8` (output summarised in section 3; scratch copies in /tmp/c7ls-ref, not kept in the lane); an independent check of the S5 congruence (10 values of d, 15 primes, 20 random theta each, modular exponentiation in Z[a,b]/p). No server job.

## 1. Steps confirmed

| item | check | outcome |
|---|---|---|
| Statement is a corollary of the Dirichlet 7/8 theorem | `ComparatorChallenges/SiegelZeros.lean` (real primitive chi != 1, q >= 3, 0 < beta < 1, conclusion c <= (1-beta) log q) against `DirichletSevenEighths.lean` (L(s,chi) != 0 for Re s > 7/8 unless chi = 1 and s = 1). beta > 7/8 is excluded, so (1-beta) log q >= (log 3)/8. The verification note records the Dirichlet theorem as compiled locally with axioms `[propext, Classical.choice, Quot.sound]` | confirmed (PROVED relative to the local build) |
| Tree size, independence | 306 files, 69,818 lines; no occurrence of `DirichletL` in the tree; scan words absent in all 306 files; local build directory holds `DirichletL` only | confirmed |
| S3 | `exists_prime_bias_for_actual_zeros`: mass of primes <= X with chi(p) = 1 is <= C log q + C (1-beta) log^2 X; `exists_good_mass_for_actual_zeros`: lower bound log X - C log q - C delta log^2 X / log q - C_H | statements match |
| S4, S5 | `source_character_global_greedy_determinant_master_bounds` first clauses; `theta_frobenius_dvd`, `theta_frobenius_two_conjugates` (proof read: Euler criterion in R/pR, both Legendre signs); `goodPrime_legendre_radicand` ties chi(p) = -1 to legendreSym p d = -1 | statements match; S5 re-derived; 2880 random cases, 0 failures |
| S6, S7 | clauses `hdiv` (Delta in (p)^{sum floor(alpha0/p)} for p > H, p not dividing 2q, chi(p) = -1), `harch` | statements match |
| S8 | `global_source_rectangle_pivot_bounds`: S1 >= M H^{2/3} U/(4*97^2), S2 <= 192 M H^{-1/3} U for N >= 18818 | statements match; proof not read (same as the author) |
| S9 | `normalized_master_bound` (proof is one `field_simp; ring; linarith` identity, re-derived by hand), `source_real_zero_uniform_master_bound` (1 <= 13/16 + (C + 13/24) log q/log U + C delta log U/log q + ...) | confirmed. 12*192*4*97^2 = 86713344; (3/4)(13/12) = 13/16 |
| Statement F | from `harch` and the third inequality of `hraw` (valid for every U >= 0): S1 Sigma - log 4 * M U <= (M/2) log M + (S1+S2)(log N + (1/2) log q + log 8); divide by S1 >= M D U, use S2/S1 <= 1/12, log N = (3/4) log U, (M/2) log M = (3/2) M log U | confirmed as arithmetic from released clauses (needs q != 8, H <= N). Threshold U > q^{26/9} confirmed |
| Floor of the device | the master bound with log U = A log q reads 1 <= 13/16 + (C + 13/24)/A + C delta A + o(1): a contradiction exists only for delta below a constant, so only 1 - beta < c/log q is reached. First step using Re s near 1 is S3 | confirmed |
| THIN at S4 | a Kronecker symbol is -1 on primes of density 1/2; THIN is +1 on relative density one (map, control THIN) | confirmed |
| Liouville twist against Statement F | sum_{H < p <= U} log p / p = log U - log H + O(1) exceeds (13/16) log U + O(1) | confirmed |

## 2. Errors

**E1 (main). "Split primes fail the divisibility; the divisibility is a property of the sign chi(p)" is wrong as stated.** The divisibility holds for every prime whose Frobenius in Gal(B/Q) lies in {1, sigma, sigma tau}, i.e. also for primes with chi(p) = +1 and (2/p) = +1. Proof (elementary, same row operation as S6): for such p, theta^p = theta mod p for all theta in Z[a,b]; the row alpha0 = kp + r may be replaced by theta^r (theta^p - theta)^k (...), which differs from it by rows with alpha0 lowered by multiples of p - 1 and equal alpha1, alpha2, hence of smaller weight; the new row is divisible by p^k. Only Frobenius = tau (chi(p) = +1, (2/p) = -1) lacks a congruence among the three conjugates used.
Measured: all failures in the author's logs and in the rerun have (2/p) = -1 (p = 5, 11, 13). All totally split cases with E_p > 0 satisfy v_p >= 4E: d = -19 (author's own log, p = 7: 132 >= 96, not reported in section 3), and in the rerun d = -3, 11, -5, -31 (H = 4, p = 7: 132 >= 96 each) and d = 29 (H = 3, p = 7: 64 >= 40). Six of six.
Consequences: (a) section 3, sentence "the inequality fails where E_p is not small" for split primes, and the sentence "a split prime has Frobenius in {1, tau}, and covering it needs the fourth variable" (section 2) need the correction "only Frobenius = tau". (b) The balance is sharper than written: for a generic chi the three covered classes carry (3/4) log U of logarithmic mass, equal to the archimedean cost (3/4) log U per unit of alpha0, so the product formula is tight to leading order and the constant 3/4 cannot be lowered inside this construction; the contradiction needs the inert classes alone to exceed 13/16. (c) The control statements are not affected (THIN, Liouville, U have no field at all), and Statement F is not affected (the Lean clause uses inert primes only).

**E2.** Section 2, S8: "count of monomials of weight <= W is about W^3/(2 H^2)". The count is sum_k (k+1)(W - Hk + 1), about W^3/(6 H^2). Explanatory only; the constants used are the Lean ones.

**E3.** Section 4: "the 26 device ids" and "type with no node". `engine/curated/devices.json` (modified 12:03, before the result) has 29 ids and already contains the open placeholder `landau-siegel-mechanism` (node `landau-siegel-2026-mechanism`) for this lane. Correct wording: no typed node; the placeholder should be replaced, not a second node added.

**E4.** Section 0 source scan covers the 306 OAI files only. 104 of them import `PrimeNumberTheoremAnd.SiegelZeros.HadamardSupport`, which sits in the patched dependency (13 files, 6,754 lines, touched by `patches/PrimeNumberTheoremAnd-lean4341.patch`). Referee scan of those 13 files: no `sorry`, `admit`, `axiom`, `native_decide`. They are also not compiled here.

**E5.** Control table: the unimodular twist U is labelled "PROVED (structure)". What is shown is that S4/S5 have no object for p^{-it}; that is ARGUED (no statement is proved that no congruence device exists in the height aspect). Same for "sign-twisted primes, general: PROVED / MEASURED": proved for the members named (THIN, Liouville), argued for the class.

## 3. Rerun (different cases)

Inert primes, prediction v_p(Norm) >= 4 E_p: d = -3, 17, 6, -23, 11, -5, 29, -31 (N = 3, H = 3 or 4): 0 violations in 8 runs; equality at d = -3, p = 5 (180 = 180), d = 17, p = 7 (96 = 96), d = 6, p = 13 (12 = 12), d = -23, p = 7 (40 = 40). Frobenius = tau primes fail (d = 6, 11, -31 at p = 5: 52, 52, 44 against 180; d = -3, 17 at p = 13: 0 against 12; d = 29, p = 5: 68 against 96). Totally split primes hold (E1).

## 4. Requirement flags (strict)

- **R1: false.** At the level of Lean statements the device does combine all inert primes in (H, U] through one norm, and S3 uses the Euler product. It is not established here: the tree is not compiled, S8 is unread, no non-multiplicative control was run (DH is "not formulable", argued), and the essential property shown by the controls is reciprocity, which complete multiplicativity alone does not give. The lane is a reading of an external proof about real zeros of real characters, not an attack that meets R1 for zeta. The author's "true for the device in its own class" is a fair description, not a flag.
- **R2: false.** Height 0, conductor aspect.
- **R3: false.** Two controls proved, two argued, five not run.
- **R4: false.** Floor 1 - c/log q, real zeros only.

## 5. Checks on framing

No RH assumption; no verified-height restatement; the corollary observation and Statement F are presented with their dependence (local 7/8 build; released, uncompiled clauses). The 7/8 theorem itself is Lean-compiled locally but its papers are unrefereed (verification note section 3); "implied by" is relative to that build.

## 6. Verdict

Holds as precise obstruction, with E1 to E5 applied. Surviving claim: the lead-28 statement follows from the locally compiled Dirichlet 7/8 theorem; the released independent tree (text reading, not compiled) refutes the prime bias forced by a real zero within c/log q of 1 by an interpolation determinant over a box in Z[sqrt d, sqrt 2], divisible at every prime with Frobenius in {1, sigma, sigma tau} (the tree uses the inert ones), with constant 13/16 against a tight generic balance 3/4; the input is reciprocity, not lattice-translation invariance; THIN and the Liouville twist fail at S4/S5; the device gives nothing for 1 - beta > c/log q and has no height-aspect form.
