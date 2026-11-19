# REFEREE2: c12-univ-pointwise-control-wcone, part (a): control UNIV (independent second referee)

Date 2026-11-19. Written from the lane's RESULT.md (sections 1 to 3) and DEVICE_READ_UNIV.md; the lane's REFEREE.md was not read before this report was complete. Part (b) (the W-adapted cone) is outside this assignment and was not checked. Source opened by this referee: Matsumoto, arXiv:1407.4216 (PDF text extracted; Theorems 1, 2, 7, 10, 11, 20, 30, 31 read as printed). Script: `supp.py` (reproduction of the lane's measured illustration to height 1000), local, `scripts/memcap.sh 8`.

## Verdict

**The UNIV statement holds, relative to one source theorem, in the form below.** It is a three-line deduction from the joint universality theorem for Dirichlet L-functions (survey Theorem 7). Nothing in it is proved independently of that theorem. The branch "false on a set of heights of positive lower density" is **relative to the source** (Theorem 7 as printed in the survey; the primary texts of Voronin, Gonek and Bagchi were opened neither by the lane nor by this referee). The label PROVED-rel is the correct label and should not be read as PROVED.

One wording is narrowed: class N is "implied by non-vanishing in the window; can fail only in a window that contains a zero", which is weaker than "equal in content to a zero statement" (see section 3).

## 1. The statement, with exactly the hypotheses it uses

Let chi_1..chi_m be pairwise non-equivalent Dirichlet characters (the character mod 1 allowed: zeta), K a compact subset of the open strip 1/2 < Re s < 1 with connected complement, L_tau = (L(. + i tau, chi_j))_j restricted to K, and C a subset of C(K)^m that is closed in the sup norm.

**UNIV.** If L_tau is in C for all real tau outside a set of upper density zero, then C contains every m-tuple of functions continuous and non-vanishing on K and holomorphic in its interior. Equivalently, a closed condition C is of exactly one of three kinds:
- T: C contains all of H^c(K)^m (no content);
- N: C contains H_0^c(K)^m but not all of H^c(K)^m; then C holds at every height whose window contains no zero of any L(., chi_j);
- F: C misses some non-vanishing tuple; then L_tau is outside C for a set of tau of positive lower density.

Hypotheses of joint universality that are used, all of them:
1. pairwise non-equivalent characters (Theorem 7; needed, since equal L-functions cannot approximate different targets);
2. K compact in the open strip 1/2 < Re s < 1 (not the line, not Re s >= 1);
3. connected complement of K;
4. targets continuous on K, holomorphic in the interior, **without zeros on K**;
5. the conclusion "positive lower density" of the set of good tau. Lemma U1 uses only that this set is not contained in a set of upper density zero; branch F uses the positive lower density itself.
Not used: effectivity, any size of the density, the hybrid Theorem 30 (used only in U4), strong universality (used only in U5).

Survey text against the lane's quotations: Theorems 1, 7, 10, 11, 20, 31 are quoted accurately. Theorem 30 as printed does not state "connected complement" (the lane notes this and assumes it); Theorem 7 is stated through the definition (4.1), which has the K_j with connected complements, f_j in H_0^c(K_j) and lim inf > 0.

## 2. Re-derivation

- **Lemma U1.** For f in H_0^c(K)^m and eps > 0 the set A of good tau has lower density d > 0; lower density of A minus E is at least d minus the upper density of E = d; so it is non-empty; L_tau in C tends to f; C is closed. Holds.
- **Corollary U2 (pointwise inequalities in values and derivatives).** K = disjoint closed discs around the points (connected complement: yes). The set {g in H^c(K)^m : Q(jet of g at the centres) >= 0} is closed in sup norm: H^c(K) is closed in C(K) and the jet map is continuous on it by Cauchy's estimate (the centres are interior points). L_tau lies in H^c(K)^m. Jets with non-zero values are jets of exp(polynomial); they are dense; Q is continuous. Holds. The lane's proof leaves the closedness of the jet condition implicit; it is as just stated.
- **Corollary U3 (three classes).** T, N, F are exclusive and exhaustive by definition. Branch F: C closed and f outside C give eps with the eps-ball around f disjoint from C; Theorem 7 gives positive lower density of tau with L_tau in that ball. Holds, relative to Theorem 7.
- **Corollary U4.** Same argument with Theorem 30. Relative to Theorem 30 with "connected complement" added by assumption. For K a finite union of disjoint closed discs this assumption is harmless only if the primary statement (Kaczorowski-Kulas) covers such K; not verified. Label: PROVED-rel with an unverified hypothesis; ARGUED is the safer label for U4.
- **Corollary U5.** Hurwitz entries with (c, q) = 1 and c/q not 1/2, 1: Theorem 10 directly. Linear combinations: Theorem 31 requires at least two coefficient series **without zeros in the open strip**, not merely non-zero. For D_+- = zeta(s)(1 + 5^(1/2 - s)) +- L(s, chi_5) the coefficient 1 + 5^(1/2 - s) vanishes only on Re s = 1/2, so the hypothesis is met; for DH the coefficients are constants. Holds relative to Theorems 10, 11, 31.

## 3. Narrowing of class N

RESULT.md, end of section 2: a class-N step is "equal in content to a zero statement in the same window: circular unless proved by another route". What is proved is one implication: non-vanishing in the window implies C. C may be strictly weaker than non-vanishing (example from the lane's own list: "at most k zeros in the interior"), and such a C is a statement about zeros in the window that is not equivalent to the absence of zeros. The correct sentence: "a class-N condition is implied by non-vanishing in the window and can fail only in windows that contain a zero; proving it at all heights is proving a statement whose only content concerns windows with zeros". The round-log wording ("a zero statement in the same window") is acceptable in that reading. The inference "no part of it can be an inequality stronger than non-vanishing" holds.

## 4. Scope table

Counts in DEVICE_READ_UNIV.md: C 1, Cp 4, R 2, N 27; 1 + 4 + 2 + 27 = 34 and the N sub-counts 8 + 5 + 6 + 3 + 2 + 1 + 1 + 1 = 27. Arithmetic correct. The codes are ARGUED from one-line readings of the device table, as the lane says; this referee checked the logic of the five in-scope cells only:
- Device 7 (code C): self-recurrence of zeta on every window is equivalent to RH (Theorem 20, as printed). This is the device row's own finding; "decides" means "restates by a classical theorem". Correct, and the lane says so.
- Devices 1, 14 (Cp, class F): a positive-definite function is bounded by its value at 0; positive-definiteness itself is non-local in height and out of scope (item 3 of the lane's own exclusion list). What UNIV decides is the necessary pointwise bound, which is class F (target e^M). Correct in that form; the table cell says this.
- Device 4 (Cp, class F): a height-uniform one-sided bound for log|zeta| on a window is class F (targets e^M, e^(-M)). Correct.
- Device 25 (Cp, class F): sum_j c_j Re (L'/L)(s, chi_j) >= -C at one point of the open strip, fixed C, some c_j != 0: target f_j = exp(lambda_j s) gives the value sum c_j Re lambda_j, unbounded below. Correct.
The 27 out-of-scope codes and the 2 R codes were not re-read against the device lanes.

So the scope sentence "decides 1 device, part of 4, 27 of 34 out of scope" holds with the reading: the one decided device is a restatement, and the four parts are necessary pointwise consequences, each of class F.

## 5. What UNIV can and cannot be used for in round 13

- As a filter it applies only to a step that is a closed condition in sup norm on a fixed compact window with connected complement inside 1/2 < Re s < 1, for finitely many L(s, chi_j) with pairwise non-equivalent characters, with height-independent constants, asserted at all heights (or outside upper density zero). The lane's exclusion list (10 items) is accurate; items 1 (the critical line), 3 (non-local in height), 5 (completed functions, s with 1 - conj s) and 6 (height-dependent constants) exclude most device steps.
- A class-F verdict is a statement about a set of heights of positive lower density that the theorem does not locate. It cannot be confirmed or refuted by computation: the lane's sample is reproduced here to height 1000 (4951 samples at s = 0.75 + it, step 0.2: 46 of 256 sign patterns; |L(real chi mod 5)|/|zeta| between 0.0427 at t = 617.0 and 25.26 at t = 992.8; same numbers as the lane's row T = 1000).
- UNIV is not a function with off-line zeros and does not replace any recorded control (the lane says this).

## 6. Labels

| statement | lane label | this referee |
|---|---|---|
| Lemma U1, Corollary U2, Corollary U3 | PROVED-rel Theorem 7 | hold; relative to the survey's Theorem 7 (survey opened; primary texts not) |
| branch F ("false on positive lower density") | PROVED-rel | relative to the source; not proved here or in the lane |
| Corollary U4 | PROVED-rel Theorem 30 | downgrade to ARGUED until the connected-complement hypothesis is read in Kaczorowski-Kulas |
| Corollary U5 | PROVED-rel Theorems 10, 11, 31 | holds; "non-vanishing" means zero-free in the open strip |
| "class N = equal in content to a zero statement" | stated | narrower: implied by non-vanishing; fails only in windows with a zero |
| device codes (34 rows) | ARGUED | five in-scope cells hold; 29 others not re-read |
| measured illustration | MEASURED | reproduced to T = 1000 |
