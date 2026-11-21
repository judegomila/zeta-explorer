# VERDICT: lee-yang

## What is established

1. (Lean-checked.) Multivariate Lee-Yang circle theorem for pair models with occupation 0/1 on Fin n: for symmetric K >= 0, Z(z) = sum_S exp(sum_{p<q in S} K_pq) prod_{p in S} z_p does not vanish when all |z_p| e^{r_p/2} < 1, nor when all are > 1 (r_p = sum_{q != p} K_pq). Two theorems, 407 lines, proved by Asano contraction, standard axioms only.
2. (Lean-checked.) Stage theorem, parts (i)-(iii): for l_p > 0, kappa_p real, F(s) = Z(e^{kappa_p - s l_p}) has no zeros outside min a_p <= Re s <= max a_p, a_p = (kappa_p + r_p/2)/l_p; if all a_p = a the zeros lie on Re s = a and F(2a - s) = e^{(s-a) sum l} F(s); with l_p = log P_p, kappa = 0 and the sum rule r_p = log P_p, the Dirichlet polynomial over divisors of M = prod P_p has all zeros on Re s = 1/2 and F(1-s) = M^{s-1/2} F(s). Six theorems, 292 lines. In the repository file these take Lee-Yang as a hypothesis; I compiled a joined file in which item 1 discharges it (exit 0, standard axioms).
3. Lane parts (iv)-(vi) (Curie-Weiss member at all depths, unimodular twists, zero count) are proved in notes and refereed once, not in Lean.

## Correction to the listed wording

"Lean formalisation of the Lee-Yang circle theorem (8 statements, 44 theorems, about 2576 lines)" is wrong as a description. The figures are those of the whole Lean batch of eight unrelated statement files. Lee-Yang is 1 file, 2 main theorems, 407 lines; the stage theorem is 1 file, 6 main theorems, 292 lines. The other six files (36 theorems, 1877 lines) are finite or single-step cores of other lanes (anchor Hankel, Krein inertia, cascade algebra, a sign lemma, Liouville limit, Beurling atoms). The figures themselves are correct: I recompiled all eight files (8 x exit 0; 44 theorems; axioms propext, Classical.choice, Quot.sound; no sorry).

## Replay

- All eight Lean files recompiled locally under an 8 GB cap. No error.
- Joined file 01 + 02 with the Lee-Yang hypothesis discharged: compiles.
- 40-digit numerics on 18 configurations: with K >= 0 and equal abscissae, winding count = sign changes on the line = 21, 34, 49, 79 (n = 3..6); max distance from the line 2e-39.

## Stress results

- K >= 0 cannot be dropped from the circle theorem (explicit n = 2 counterexample) and is used in the stage theorem: with the duality kept exact and couplings down to -0.375, zeros leave the line (max distance 0.18; at -0.94, 16 of 48 off). It is sufficient, not necessary: at min K = -0.094 and for primes (2,3,7) (forced K_01 < 0) all zeros stayed on the line.
- Breaking the sum rule by 30% in one coupling moves zeros off the line by 0.0099, inside the predicted strip.
- Controls: random unimodular twist, chi(p) = -1, arbitrary positive energies (0.7, 1.1, 1.3, 1.9), equal energies, and multiplicatively dependent generators log(4, 6, 9, 10) all give zeros on the line. The theorem reads only |activity| and K >= 0. It does not distinguish zeta from twisted or Beurling-type controls; the lane says this itself (its Thm. 4).
- The abscissa 1/2 is the result of imposing n linear conditions on K; any real a is obtained by the same device.
- No circularity, no native_decide, no vacuous definition found.

## Literature

Circle theorem: Lee-Yang 1952, Asano 1970, Ruelle 1971, Newman 1974, Lieb-Sokal 1981, Borcea-Branden 2009. Stage theorem: an instance of restricting a Lee-Yang polynomial to a positive line of the torus (Kurasov-Sarnak 2020, arXiv 2004.05678; converse by Alon-Cohen-Vinzant, arXiv 2303.03201). The specific sum-rule form for divisor Dirichlet polynomials was not found stated; it is a direct corollary. No existing Lean/Mathlib proof of the circle theorem was found in six web searches (Zulip and GitHub code search not consulted).

## Scores

- Arbitrariness 3. The circle theorem is canonical (would be 1). The stage theorem has free energies, free fields and a tuned linear condition that places the line; the "critical line" reading is a choice of normalisation. The headline count mixes in unrelated files.
- Importance 2. A machine-checked proof of a classical theorem absent from Mathlib is of use to formalisers. For RH and the de Bruijn-Newman constant it has no consequence: stages have constant zero density (log M)/2 pi, converge only on Re s > 1, diverge on (1/2, 1], and pass every twisted control. Its role in the project is as input to a no-go statement.

## Status

Lean-checked (items 1, 2); proved in notes, refereed once (lane parts iv-vi). Verification: confirmed for the mathematics, with the listed wording replaced by the weaker accurate description above.
