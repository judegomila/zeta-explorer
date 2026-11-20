# CORRECTIONS: text corrections owed after round 21 (proposals; no other lane's file is edited)

Written 2026-11-20 by `c22-record-r21-controls-map-lean-queue-engine` (record lane; no attack). Paths are relative to `tmp/research-2026-11-16/`. Each item gives the file, the text as it stands (checked by search on 2026-11-20), the replacement, and the file that establishes the correction. Nothing here is a statement about zeros of zeta. A copy of this register for the campaign directory is `campaign/CORRECTIONS_R21.md`.

## 1. `push/c4-helson-discrepancy-zerofree/RESULT.md`, section 2, step (a), line 35

Text as it stands:

> A is an ordinary Dirichlet series with coefficients a_n >= 0 (supported on prime powers). This is the only place complete multiplicativity and |chi| = 1 are used, and it is essential: without an Euler product there is no A.

Replacement:

> A is an ordinary Dirichlet series with coefficients a_n >= 0 (supported on prime powers). This is the only place complete multiplicativity and |chi| = 1 are used. [Corrected in round 21: the series A exists for every F with f(1) = 1 and polynomially bounded coefficients (F = 1 + X with abs(X) < 1 for Re s large, and log F = sum (-1)^(k+1) X^k/k is a Dirichlet series); with l_f the coefficients of log F and kappa those of log zeta, a_n = kappa(n) - Re l_f(n). What the step uses is the sign condition H(a): a_n >= 0 for every n >= 2. Complete multiplicativity with |chi| = 1 is one way to verify H(a); it is not needed (f(n) = (-1)^(v_6(n)), F = zeta(s)(1 - 6^-s)/(1 + 6^-s), is not multiplicative, satisfies H(a) and every later step), and multiplicativity alone does not give it (HQ1 to HQ4 and E_a fail). Theorem 1 holds on the class H(a), with sigma_0 the largest real zero of F in (theta, inf).]

Established by: `push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md` sections 2 to 4 and its `REFEREE.md`, independent pass, step 1 ("The sentences quoted ... are in those files as quoted and are false as written") and section 4.

Consequence for that file's flags (its section on requirement flags): R1 = false. `campaign/lanes.jsonl` already carries r1 = false for the lane (learn step of round 21).

## 2. `push/c4-helson-discrepancy-zerofree/REFEREE.md`, line 55

Text as it stands:

> - R1 = true, in the restricted sense the RESULT states: step (a) needs the Euler product over all primes with unimodular local factors; without it A does not exist and the Landau step is unavailable (DH stops there). This is established for Theorem 1 as a statement about F relative to zeta. It is not an attack on zeta and uses nothing about the additive structure of the integers.

Replacement:

> - R1 = false [corrected in round 21; this bullet read "R1 = true, in the restricted sense the RESULT states"]. Step (a) is the sign condition H(a): kappa(n) - Re l_f(n) >= 0 for every n >= 2. The series A exists for every F with f(1) = 1; for Davenport-Heilbronn it exists and H(a) fails at n = 6, where a_6 = -(f(6) - f(2) f(3)) = -1.0807009 (the sign of one log coefficient, not the absence of A). The non-multiplicative unimodular series with f(n) = (-1)^(v_6(n)) satisfies H(a) and the whole proof, and the multiplicative controls HQ1 to HQ4 and E_a fail H(a). So the step does not have multiplicativity as an essential input. Theorem 1 is unaffected as a statement about F relative to zeta; it is not an attack on zeta.

Established by: the same two files as item 1.

## 3. `push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md`: corrections E1 to E4 of its independent referee

| # | place | text as it stands | replacement |
|---|---|---|---|
| E1 | section 2, Lemma 1 (ii) | "This fails for two unimodular parameters at one prime (...), for a pole of the local factor with a parameter of modulus > 1 (HQ1 to HQ4, G_q, E_a), and for a local zero at a negative parameter (T-NR with c > 2)" | read as a list of instances, not as a criterion: "This fails in the instances: two unimodular parameters at one prime (...); HQ1 to HQ4, G_q, E_a (a pole parameter of modulus > 1 that is not dominated by a zero parameter); T-NR with c > 2. A pole parameter of modulus > 1 does not by itself violate H(a): zeta(s)(1 - 3 * 2^-s)/(1 - 2 * 2^-s) is multiplicative and satisfies H(a), with a(2^k) = (3^k - 2^k)/k > 0." |
| E2 | section 0 item 2 and section 4, clause 2 | "Eight on file fail it: HQ1, HQ2, HQ3, HQ4, G_q, T-NR (c > 2), NR-q (c > 2, ...), E_a" / "eight multiplicative controls on file fail H(a)" | "Five distinct controls on file fail it unaltered: HQ1, HQ2, HQ3, HQ4, E_a (six counting G_q, which is HQ1 at one value of eps). For T-NR and NR-q as on file H(a) is not posable; the failing objects are this lane's u-normalised versions." Clause 2 fails with any of these counts. |
| E3 | section 2, heading of Theorem 1' and section 0 item 4 | "Theorem 1' (PROVED; the proof of c4 Theorem 1 with one change)" | add: "Status: Theorem 1 of the c4 lane with its hypothesis replaced by what the proof uses, H(a); not a new theorem. One line to add to the proof: theta >= 0 necessarily, so the real ray lies in (0, inf), where zeta is real and non-zero away from its pole." |
| E4 | section 0 item 4 | "which contains non-multiplicative members with real zeros in the strip" | add: "The member exhibited with a real zero in the strip is P3 (b = 0.1, zero at 0.8286472390), which is not unimodular. The unimodular member V6 has no extra zero in Re s > 0. A unimodular non-multiplicative member with a real zero in the strip is THIN x V6, whose zero is the THIN zero (measured in the c4 lane; not run here)." |
| minor | section 3 table, row DH | "461 negative a_n, n <= 3000" | add "(not reproduced at that N by the referee; 316 on n <= 2000)" |

Established by: `push/c21-c4-r1-flag-test-lemma-e-hq-beurling/REFEREE.md`, independent pass, section 3.

## 4. `push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md`: three corrections of wording of its second referee

| # | place | text as it stands | replacement |
|---|---|---|---|
| 1 | section 4, controls table, row E_a, line 266 | "no (sigma_rel = 1)" | "no (sigma_rel = 1 + a: c(p) = 1 - p^a - p^-a)". The conclusion of the row (outside the hypothesis; the functional equation fails) is unchanged. |
| 2 | section 2.1, item (i), line 108 | "In Re s > 1 where N != 0 the product of the L_p converges to zeta/N, so G = zeta/N as meromorphic functions on Re s > 1/2." | "G is the meromorphic function zeta/N on Re s > 1/2, equal to its Euler product for Re s >= sigma_0, with sigma_0 chosen so that 2^(1/2 - sigma_0) sup delta_p < 1/2 (when some abs(alpha_p) is large the local factor L_p has poles with Re s > 1)." |
| 3 | section 3, Theorem B, and section 0, verdict statement 5 ("iff") | no domain stated | add "for N a Dirichlet series convergent somewhere (alpha_p polynomially bounded)"; Bohr's inequality stays CLASSICAL, not opened. |

Established by: `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-euler-shape-rigidity-infinite-modified-primes/REFEREE2.md`, section 3. Checked by search: the string "sigma_rel = 1" for E_a does not occur in `campaign/STATEMENT_O.md`, `campaign/STRATEGY.md` or `engine/curated/`; line 326 of the same RESULT ("sigma_rel = 1 in general" for the Helson class) is a different statement and is not changed.

## 5. Set condition of BR-2 (correction E3 of the campaign referee of the c21 record lane)

Text as it stood in three places: "abs(alpha_p) = p^(1/2) on a set S of primes with sum over S of p^-sigma finite for every sigma > 1/2 and infinite at 1/2". Read literally this gives sigma_rel = 1, which is regime 3. Replacement: "sum over p of abs(1 - alpha_p) p^-sigma finite for every sigma > 1/2 and infinite at 1/2, that is S infinite with sum over S of p^-eps finite for every eps > 0".

Applied by this lane (these files are inside its write set): `engine/curated/mk_devices.py` (block R22-record; `devices.json` regenerated), `engine/nodes/nodes-23.json`, `campaign/STRATEGY.md` section 4.0 (bracketed correction in place). Established by: `push/c21-record-engine-states-statement-o-v5-br-nodes/REFEREE.md`, E3.

## 6. Other wording corrections of round-21 referee files, registered and not applied (lane files)

| lane file | correction | source |
|---|---|---|
| `push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin/RESULT.md`, Theorem W step 3 | d_(n,k) is the distance from n lambda_(k0) to {m lambda_k : m >= 1}, not to the lattice lambda_k Z (required erratum E1; with it the proof is complete) | its `REFEREE.md`, independent pass |
| same lane, `MAP_ROW.md`, row X3b | "the product is 1/(1 - w)" should read "prod (1 + w^(2^k)) = 1/(1 - w); the product of the local factors is 1 - w"; "author only" is out of date | this lane (comparison of the two files of that lane) |
| `push/c21-twin-screen-ts/RESULT.md` | "10 of 56" -> 7 device types in full and 5 in part of 56 typed rows; the device file has 58 entries (J1 to J3); one false sentence in TS-1 (iii) (J4); hypotheses of (iv) (J6) | its `REFEREE.md`, independent pass |
| `push/c21-statement-o-line11-control-table-40-digits-server/RESULT.md` | E1 to E6 (radius sentence; T-NR instance c = 17/8 outside the strip; what the label may say; "holds for" in place of "formulable only for"; one wording; scope of line 11) | its `REFEREE.md`, independent pass; entered in `campaign/STATEMENT_O.md` version 5.2, line 11 |
| `push/c21-br2-relative-product-pole-lattice-census-server/RESULT.md` | "57 of 57" -> the informative count is 56 of 56 (t = 0 is forced by P0); novelty wording of P0, P1; the remark after P0 is ARGUED and its hypothesis does not give the stated decay | its `REFEREE.md`, independent pass, section 4 |
| map section 2, row NR-q | sign of c; normalisation (two corrections of wording) | `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/nrq-line15/REFEREE2.md`; proposed text in `campaign/MAP_PENDING.md`, Part 3, block C |
| `engine/curated/mk_devices.py`, evidence of cells U6 (a), U6 (b) | stale first sentence "state unchanged (cell) ... Set the state here when that file holds" before "state set to CLOSED" (E5 of the campaign referee of the c21 record lane) | not applied by this lane (not in its assignment); the state fields are right |

## 7. Not corrected here

The far-zone repair of Lemma R (escape law F1, clause (ii)) and the T-NR clause of K3-M are corrections to round-20 lanes recorded in `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/RESULT.md`; they were not in this lane's assignment and are not copied here.
