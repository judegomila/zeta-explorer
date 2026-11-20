# REFEREE (lens: general) for c5-repair-engine-map-r4/RESULT.md

Date: 2026-11-18. Referee wrote only this file. Runs: local, `scripts/memcap.sh 8 .venv-arb/bin/python`, scratch code in /tmp/ref_c5 (not kept in the repo). Server not used.

## Verdict

holds = true, with one statement to narrow (E1) and four minor corrections (E2-E5). The claimed verdict "partial-result" and the flags R1 = R2 = R3 = R4 = false are confirmed. Nothing in the lane assumes RH, restates verified height, or makes a statement about zeros of zeta.

## What was checked

### Theorem 1 (second derivation) and C6: confirmed
Re-derived line by line: log H = -2A on Re s > 1 with coefficients (1 - Re chi(p)^k)/k >= 0; H > 0 on (sigma_0, inf) including H(1) = abs(c)^2; Landau gives sigma_c(A) <= sigma_0; exp(-2A) = H on Re s > sigma_0, hence the order identity. C6: if A converged at some sigma < sigma_0 then H(sigma_0) != 0, against F(sigma_0) = 0 and zeta(sigma_0) finite, non-zero. Divergence at sigma_0 itself follows because A(sigma) -> +inf as sigma -> sigma_0+ and the coefficients are non-negative. No gap.

### Theorem 2: confirmed as stated
Re-derived every step.
- (i) count X/(dp) + O*(1), sum over d <= X prime to p: correct; a-independence of the main term correct.
- (ii) Euler factor of g at p is (1 - 1/p)/(1 - chi(p)/p) (computed: 1 + ((chi(p)-1)/p)/(1 - chi(p)/p)); main term c X (chi(p) - 1)/(p - 1) (algebra redone); tail of c_p(X) <= C X^(beta-1)/(1-beta) by partial summation; total error <= abs(E(X/p)) + C_1 p X^beta. Correct.
- (iii) integration by parts: correct, E(0) = 0. The term p/(pi abs(k)) in b_{p,k} bounds abs(c)(1 - e(.))/(2 pi xi) only because abs(c) <= 1; true (abs(S(x)) <= x) but not stated (E3).
- (iv) the constant pi X + 1/delta: re-derived from the Sobolev-Gallagher inequality with the interval centred (norm of the derivative of fhat <= 2 pi (X/2) norm f). Spacing of the points k/p >= Q^-2: correct.
- (v) (max(0, a-b))^2 >= a^2/2 - b^2; k-sums between p^2/(2 pi^2) and p^2/12; b^2 <= 4(2M^2 + C_1^2 p^2 X^(2 beta) + p^2/pi^2); (pi + 1 + 2/3) < 5 using sum_{p<=Q} p^2 <= Q^3 <= X^2; sum p^4 <= Q^5. The final inequality follows.

### Corollary: proved for the LARGEST real zero only (E1)
Chain checked: C1 + Cauchy-Schwarz + Rankin give B(y) << y^beta for beta > (1 + sigma_0)/2; Theorem 2 gives V(y) << y^(5 theta/(1-beta)); 1 - Re z^k <= k^2 (1 - Re z) and sum_k k p^(-k sigma) <= p^-sigma/(1 - 2^-sigma)^2 give convergence of A for sigma > 5 theta/(1-beta); C6 gives sigma_0 <= 5 theta/(1-beta), hence sigma_0 (1 - sigma_0) <= 10 theta.
The argument uses sigma_0 = largest real zero at two places (beta from sigma_0, C6 at sigma_0). It gives nothing for a smaller real zero b' < sigma_0: x(1 - x) is not monotone, so when sigma_0 lies in the upper branch [b_+, 1), a further real zero in (b_-, b_+) is not excluded. The sentences "a real zero b ... satisfies b(1 - b) <= 10 theta" (section 0, Corollary, map entry 49) and "real zeros lie in (theta, b_-] or [b_+, 1)" (Decision on r(0)) are proved only with "the largest real zero" in place of "a real zero" / "real zeros".
The exponent-zero conclusion is not affected: the largest real zero in (0, 1) exists if any real zero exists, and b(1 - b) <= 10 eps for every eps is impossible. The consequences (sum_{p<=y} abs(1 - chi(p))^2 << y^eps; zeros of F in Re s > 0 are those of zeta with the order identity) follow. Sanity case: one modified prime p_0, F = zeta (1 - p_0^-s)/(1 - chi(p_0) p_0^-s), no real zero in (0, 1): consistent.

### Numeric rerun, different case (MEASURED, referee code, float64)
The lane tested sign twists only. Rerun with a complex chi: chi(p) = i or exp(2 pi i/3) alternately on a thin set of 251 primes (count <= p^0.4, first members 3, 7, 17, 37, 59), X = 1e6, g built by enumeration of S-smooth d (not by the lane's formula).
- chi = 1 * g: S(x) from g against direct sum agree to 1e-10 relative at x = 1e3, 123456, 1e6. c = 0.348515 + 0.229507 i, B(X) = 7212, sup abs(E) = 98.0.
- Step (ii): p = 3 (in S): T = -288976.4 + 59485.5 i against main -289011.1 + 59503.7 i (difference 39; bound 14469); p = 7 (in S): differences 41 to 130 for k = 1, 2, 3 (bound 43317); p = 5, 11, 13, 101 (not in S): abs(T) between 28 and 263 against main 0. Identity c^(p) = c (1 - chi(p)/p)/(1 - 1/p): agreement to 1e-4 (truncation of c at X) for p in S, exact for p not in S.
- Step (iii): residual between 1e-8 and 7e-5 in 18 cases.
- Step (iv) directly, Q = 47, all 0 < abs(k) < p/2: sum abs(Ehat)^2 = 1.635e11 <= (pi X + Q^2) int abs(E)^2 = 5.46e15. Main-term side abs(c)^2 X^2 V/(4 pi^2) = 4.41e10 <= 1.635e11: consistent with (v).
All steps hold on the new case. As the lane says, this does not test sharpness or the final exponent.

### Section 2.4 (heat): numbers reproduced; non-existence is conditional as labelled
- Independent method (Nystrom, 1200 Gauss-Legendre nodes, numpy eigvalsh on the kernel r_Gamma(x+y), pole data from `heat_k_poles.json`): omega 0.1, Gamma 100, T 1.5: 1.13511 (lane 1.13511); omega 0.1, Gamma 230, T 1: 0.97417 (0.97417); omega 0.25, Gamma 230, T 1: 1.40909 (1.40909); single pole 0.24344 (0.24344). New cases not in the lane: omega 0.1, Gamma 145 (10 poles), T 1.3: 1.058; omega 0.25, Gamma 175 (13 poles), T 0.9: 0.952. Both lie between the neighbouring table rows; the dependence on Gamma is confirmed. Sum of 2 Re c_j = -7.414: confirmed.
- Unimodularity of Theta on Re z = 0 (F even and real on the real axis), norm(k_0-operator) <= 1, finite-rank reduction to C G, self-adjointness (r real): confirmed. norm(K_Gamma) >= norm(R_Gamma) - 1: confirmed.
- "No causal kernel for tau < 0" rests on (a) `b-escape-law` Theorem A (internal, refereed once; not re-derived here) and (b) non-cancellation of infinitely many high poles, measured on 24. On the 24 located poles the real part delta_j ranges over [0.25, 1.31] with correlation 0.52 against log gamma_j: the data alone do not show unboundedness. The label in the lane (PROVED relative to Theorem A, MEASURED, ARGUED) is accurate; the summary in section 0 item 4 ("has no object ... analytic in no half-plane") and the map text in section 6 item 14 state it without the condition in the first clause (E4).
- The "iff" sentence (causal kernel of exponential type iff Theta bounded analytic in a half-plane) is used only in the direction kernel => analyticity, which is correct; the converse as written ignores growth conditions (E5, wording).

### Engine and map: counts reproduced from the files (generator not re-run: it writes into `engine/`)
- `engine/CANDIDATES.json` meta: generated 38,112, scored 10,726; closed-device rejections 441 / 546 / 480 / 368 / 750 / 398 / 152 / 26 match; Lax-Phillips 35, Helson 13 match.
- `engine/curated/devices.json`: 21 types, 60 nodes, 51 closed / 6 floored / 3 open. `IDEA_GRAPH.json`: 1,572 nodes, device states 51 / 6 / 3. `closed_families.json`: 34.
- Top 60 classified by the referee against the curated list: 0 closed, 25 open, 35 floored only. Node counts 12, 12, 12, 12, 10, 3, 1: match.
- Map: 450 -> 471 lines; rows P44-P49 and G26 present; entry 49 and item 14 present.
- Not checked: the correctness of each of the 51 "closed" assignments (the lane names this as weakest step 2); the fetched-summary literature confirmations for P47-P49.

## Errors

- E1 (statement scope, medium). Corollary and Decision: "a real zero b satisfies b(1 - b) <= 10 theta" is proved only for the largest real zero sigma_0. Fix in RESULT section 0 item 3, the Corollary, the Decision bullet 2, and map section 4 entry 49: "the largest real zero b of F in (theta, 1) satisfies b(1 - b) <= 10 theta". The exponent-zero statement stands.
- E2 (reference, minor). Map entry 49 and the docstring of `check_thm2.py` cite "section 3, Theorem 2"; the theorem is in section 2.3. Map item 14 cites "section 4"; the heat text is section 2.4.
- E3 (unstated step, minor). Step (iii) uses abs(c) <= 1.
- E4 (wording, minor). Section 0 item 4 and map item 14 should carry "relative to the escape law and to non-cancellation beyond the 24 located poles" in the same clause as "has no object".
- E5 (wording, minor). The "iff" in section 2.4; keep only the direction used.
- Novelty (no error; note). The literature step did not open the nearest sources for Theorem 2: Elliott's dual of the Turan-Kubilius / large-sieve inequalities for multiplicative functions in residue classes, and the structure theorems for multiplicative functions with small partial sums (Koukoulopoulos; Koukoulopoulos-Soundararajan). The mechanism of steps (i)-(iv) is of that type. The lane claims no novelty; the word "new" for Theorem 2 and C6 should read "not found in the sources opened". C6 is a one-line remark.

## Controls

No zeta-only mechanism is claimed, so no control has to fail. Checked: Theorems 1 and 2 concern a class that contains the thin twists (inside the class by construction); Theorem 1 passes Beurling; Theorem 2 is not formulable for Beurling (residue classes) and has no object for DH (no completely multiplicative chi). Agreed with the lane's table.

## Requirement flags (set by the referee)

- R1 false: multiplicativity at all primes is used in Theorem 2, but for F relative to zeta; no attack on zeta.
- R2 false: no every-window statement about zeta.
- R3 false: no mechanism that fails on the controls; thin twists satisfy the hypotheses.
- R4 false: nothing passes to the critical line.

## Surviving claim

Engine and map repairs as counted (verified from the files). Theorem 1 with C6 and Theorem 2 hold (one author plus this referee; float64 checks on sign twists and on one complex chi). Corollary: the largest real zero b of F in (theta, 1) satisfies b(1 - b) <= 10 theta; a chi with E(x) << x^eps for every eps has no real zero of F in (0, 1). Not proved: the bound for non-largest real zeros; r(theta) -> 0. Heat: the truncated operator's failure time depends on the truncation height (reproduced); non-existence of the causal kernel is relative to the internal escape law and to measured non-cancellation. No statement about zeros of zeta.
