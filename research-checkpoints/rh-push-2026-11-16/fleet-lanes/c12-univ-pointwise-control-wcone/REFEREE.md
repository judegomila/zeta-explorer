# REFEREE.md for c12-univ-pointwise-control-wcone (author's own adversarial pass; not an independent referee)

Date 2026-11-19. Written by the lane itself after RESULT.md. `refereeHolds` should be recorded as null until an
independent pass exists. Checks rerun: `ref_checks.py` / `ref_checks.log` (through `scripts/memcap.sh 8`, 4 s).
Compute server not used.

## Checks made

1. **Lemma U1.** Needs only: positive lower density of the approximating set, upper density zero of the
   exceptional set, closedness of the condition. Holds. The hypothesis "at all heights" can be weakened to
   "outside upper density zero" and not further (the lower density of the approximating set is not known).
2. **Corollary U2.** The union of finitely many disjoint closed discs has connected complement; Theorem 7 allows a
   different K_j and f_j per character, and a function on a disjoint union is chosen disc by disc. Any jet with
   non-zero value is the jet of exp(polynomial). Cauchy's estimate passes from sup norm to jets. Holds. The
   extension to all jets uses continuity of Q on the whole jet space; for Q defined only off the zero locus the
   statement is the weaker one given in the text.
3. **Corollary U3.** The three classes are exhaustive by definition. The sentence "class N can fail only in a
   window containing a zero" is the inclusion H_0^c(K)^m in C and nothing more. The lane does not claim that a
   class-N condition implies a zero-free statement (example in the text: "at most k zeros").
4. **Lemma Z by a second formula.** D_b(s) = 5^-s [(1 + sqrt5) zeta(s) + (1 + b)(zeta(s, 1/5) + zeta(s, 4/5)) +
   (1 - b)(zeta(s, 2/5) + zeta(s, 3/5))] in 200-bit ball arithmetic (python-flint): at the six printed points
   abs(D) <= 5.3e-12 with abs(D') between 0.30 and 2.95, consistent with the 14 printed digits. Winding number
   of D_1 around 0.7796 + 61.1685i on a square of half-side 0.05: 1.000000 (400 boundary points, least
   abs(D) on the boundary 0.121); of D_-1 around 0.8489 + 23.7042i: 1.000000 (least 0.0148). The winding
   numbers are sampled, not certified by interval enclosure of the boundary.
5. **Theorem 31 hypotheses for D_b.** P_1 = 1 + 5^(1/2 - s): abs(5^(1/2 - s)) < 1 for Re s > 1/2, so no zero; P_2 = b,
   non-zero constant; zeta and L(., chi_5) are non-equivalent. Holds as the survey prints the theorem.
6. **Lemma C.** (A cap B)^* = closure(A^* + B^*); polyhedral, so closed; F orthogonal on V because it is real
   symmetric with F^2 = 1. Holds.
7. **Lemma X.** F applied to the four rays returns (up to scale) 1, delta_0, v_+, v_- (log). cone(rays) has four
   facets; for 200000 random v >= 0 the tests "F v >= 0" and "v in cone(rays)" agree in every case (41436 inside).
8. **Lemma P'.** (ii): if v(c) > 0 then (R(n)v)(nc) = v(c) > 0 = chi(n) v(nc) with v(nc) >= 0, so chi(n) > 0, so
   chi(n) = 1. Holds.
9. **T-NR kernel.** F R(n) = R(n^-1) F gives the identity by hand; measured defect 1.6e-30.
10. **E_a kernel sign.** xi(2a) < 0 for 0 < 2a < 1 (zeta < 0 on (0, 1)); the closed form
    2 pi^-s Gamma(s) zeta(s) L(s, chi_-4) at s = 0.7 has sign of zeta(0.7) < 0. Two computations agree to 15 digits.

## Corrections applied to RESULT.md during this pass

- S1. A sentence claiming that translates of THIN and DEL approximate "targets times a fixed factor" was removed:
  the factor (s - b) W(s) is not translation-invariant and no universality statement for these twists was looked up.
- S2. The candidate inequality was first stated as "bridge energy non-negative, equivalently no zero right of the
  line" for every F-fixed v. The equivalence is refereed only for the zeta slice. The text now tests the
  consequence (no zero with Re s > 1/2) and says so.
- S3. Lemma X was labelled PROVED; it is an enumeration at 30 digits plus hand identities. Relabelled COMPUTED.
- S4. `univ_density.json` was first written to the repository root (the script used the working directory) and
  was moved into the lane directory. No other file outside the lane directory was created or changed.

## Reservations that stand

- R1. Code C for device 7 is the row's own finding obtained from Bagchi's theorem. Read strictly, UNIV closes no
  device that was not already closed for the same reason; the informative figure is "a value-side part of four
  devices, by an argument independent of the recorded control".
- R2. The device codes come from one-line readings. Device 4 (node part) and device 15 ("no row states an
  un-completed windowed form") were not checked against the lanes.
- R3. "T-NR passes every step" means: it has every input an inequality over the cone can consume. The candidate has
  no proof steps, so this is an input-level statement, as in the c11 lane.
- R4. The theta normalisation of the E_a kernel (constant terms kept) is the analogue of theta(x) for zeta. In the
  xi-normalisation E_a has a positive kernel. Whether "kernel with polar terms non-negative" is a usable input
  was not examined; the map already lists SIZE (poles at 1 +- a) as what E_a lacks.
- R5. Theorem 30 is used with a hypothesis ("connected complement") that the survey's printed statement omits.
- R6. The measured sample contradicts no part of UNIV and supports none of it.

## Outcome of this pass

No PROVED or PROVED-rel step was found broken. The flags R1 = R2 = R3 = R4 = false stand. Nothing here is a
statement about zeros of zeta.

---

# Independent referee pass (lens: general), 2026-11-19

Separate from the author's pass above. Scratch code and output: `/tmp/c12ref_general/chk.py`, `out.txt`
(run through `scripts/memcap.sh 8 .venv-arb/bin/python -I`, mpmath 30 digits, about 1 min; compute server not
used). The survey arXiv:1407.4216 was downloaded and Theorems 7, 10, 11, 20, 30, 31 and the definition (4.1)
were read against the lane's section 1.

**Outcome: holds, with corrections E1 to E5 (none load-bearing). Flags set by this referee:
R1 = R2 = R3 = R4 = false. No statement about zeros of zeta is made; RH is not assumed; verified height is not
used.**

## Source check

- Definition (4.1) allows a separate compact K_j (connected complement) and f_j in H_0^c(K_j) per function;
  Theorem 7 is joint universality in that sense for pairwise non-equivalent characters. As quoted.
- Theorem 30: one K, no "connected complement" printed, f_j in H_0^c(K), prime phases up to z. As quoted (the
  lane says it assumes connected complement).
- Theorem 31: P_j general Dirichlet series, not identically vanishing, absolutely convergent in Re s > 1/2, at
  least two non-vanishing in D(1/2, 1), L_j hybridly jointly universal; conclusion: strongly universal, hence
  N(T; sigma_1, sigma_2) >= CT by Theorem 11. As quoted.
- Theorem 20 (Bagchi): as quoted.

## Steps re-derived

| step | result |
|---|---|
| Lemma U1 | Confirmed. Uses lower density d > 0 of the approximating set, upper density 0 of E, closedness. |
| Corollary U2 | Confirmed. The condition {f in H^c(K)^m: Q(jet) >= 0} is closed in C(K)^m because H^c(K) is closed in sup norm and the jet map is continuous on it (Cauchy on the discs); this sentence is missing in the text. exp(polynomial) realises every jet with non-zero value; such jets are dense. |
| Corollary U3 | The trichotomy is a definition and is exhaustive. The closing sentence is too strong: see E2. |
| Corollary U4 | Confirmed relative to Theorem 30 (single K). |
| Corollary U5 | Confirmed relative to Theorem 31 for D_b (P_1 = 1 + 5^(1/2-s), abs(5^(1/2-s)) < 1 for Re s > 1/2; P_2 = b), for constant-coefficient DH-type sums, and for q^-s zeta(s, c/q) = phi(q)^-1 sum conj chi(c) L(s, chi) (q >= 3 prime, characters mod q pairwise non-equivalent). |
| D_b formula | v_b = 1 + sqrt5 delta_0 + b chi_5 gives zeta(s)(1 + 5^(1/2-s)) + b L(s, chi_5); F delta_0 = 5^(-1/2) 1, F 1 = sqrt5 delta_0, F chi_5 = chi_5 (Gauss sum sqrt5, even character). Confirmed by hand. F-fixed space has dimension 2; v_b >= 0 iff abs(b) <= 1. |
| Lemma C | Confirmed (Farkas for the six inequalities v >= 0, Fv >= 0; F Theta(x) = x^(-1/2) Theta(1/x)). Holds for any inner product; the text's "F orthogonal" needs the Z/q inner product (weights 1, 2, 2). |
| Lemma P' | (i) confirmed (pointedness gives a non-zero average). (ii) is proved in the text only for v >= 0; see E3. |
| T-NR lift | FE with the same F confirmed by hand from F R(n) = R(n^-1) F and Poisson. [P], [K], [END] follow for c > 0 from non-negative combinations of dilations of Theta: they are PROVED, not only MEASURED. Trivial-slice factor p_0^(s-1/2) + c + p_0^(1/2-s), zeros at Re s = 1/2 +- arccosh(c/2)/log p_0. Range statement wrong: see E1. |
| Birkhoff remark | delta_0 and 1 are both fixed by every R(n): two eigenvectors for the top eigenvalue. Confirmed. |

## Numerics rerun (different cases)

- Extreme rays of K_F by independent enumeration of facet intersections: q = 5 gives the four rays of Lemma X
  (two F-fixed, (1 + sqrt5, 2, 0) and (1 + sqrt5, 0, 2) after scaling). New cases: q = 7 gives 8 extreme rays,
  none of them F-fixed (no even real non-trivial character; delta_0 and 1 exchanged); q = 13
  gives 100 extreme rays, 8 of them F-fixed, two of which are (1 + sqrt13) delta_0 + 2 (indicator of +- quadratic
  residues or non-residues), the analogue of v_+-. So the q = 5 picture (F-fixed extreme rays are not the Euler
  vector) persists at q = 13; the other six F-fixed rays at q = 13 were not identified.
- D_b: completed function invariant under s -> 1 - s at s = 0.31 + 17.3i for b = 1, -1, 0.4 (relative defect
  1.6e-30). abs(D) at two printed zeros: 1.1e-12, 1.3e-13 (printed to 12 digits). New height range
  120 < t < 200 (not in the lane): zeros of D_1 at 0.614609315353 + 135.010582401i, 0.658370356368 +
  138.051450867i, 0.867888217378 + 170.319046573i, 0.874578172648 + 184.462557527i; of D_-1 at
  0.947839317149 + 189.242462558i (Newton, abs(D) < 1e-19; not interval-certified).
- T-NR factor: at c = 2.3, p_0 = 2 the factor vanishes at Re s = 1.2806 (abs 4.6e-31); c = 3: 1.8885; c = 2.5: 1.5;
  c = 2.1: 0.9543.
- E*(i, 0.7): closed form -2.33099381341482; Fourier expansion at y = 1: -2.33099381341; y = 6: -0.7523;
  y = 7: -0.3656; y = 8: +0.0228484533. Confirmed.
- `univ_density.py` (6.4 min) was not rerun. The count 58 of 256 is consistent with a rough estimate: at
  sigma = 0.75 the argument of each L-value has standard deviation about 0.66, so Re < 0 has frequency of
  order 2 percent per function and patterns with two or more negative real parts are rare in 4e4 samples.
  Nothing in the result depends on this table.

## Errors and corrections

- **E1 (wrong number, section 5 test 2).** "inside the strip for 2 < c < 2.5" is false for p_0 = 2. The zeros
  have Re s = 1/2 + arccosh(c/2)/log 2, which is below 1 only for 2 < c < 2^(1/2) + 2^(-1/2) = 2.1213 (map row
  G21 has the correct threshold). At c = 2.5 the abscissa is 1.5. With the lane's c = 3 the zeros lie at
  Re s = 1.888, right of 1; the conclusion "no zero with Re s > 1/2" is still false for the lift, so the table
  entry stands.
- **E2 (overstatement, Corollary U3 last sentence and the control entry's "equal in content to a zero
  statement").** "Every inequality of this type that holds at all heights is implied by non-vanishing in the
  window alone" is established only at heights whose window is zero-free. A class-N condition at a height whose
  window contains a zero (for example "at most k zeros in K") is a further statement about the function there
  and is not implied by anything in U1 to U3. Correct form: a class-N condition is automatic on zero-free
  windows and can fail only on windows containing a zero.
- **E3 (gap, Lemma P').** The sentence "this extends Lemma P to every invariant cone" needs: if K is pointed,
  R(n)-invariant, v in K real, R(n) v = chi(n) v, then chi(n) = +-1 and chi(n) = -1 gives -v in K, so v = 0.
  One line; the statement is true for pointed invariant cones. The part "a copositive form over such a cone
  contains the scalar zeta inequality with the cone inert" is ARGUED, not PROVED.
- **E4 (labels).** U2 is the inequality form of Voronin's functional independence (joint version) and U5 for
  Dirichlet-polynomial coefficients is the Kaczorowski-Kulas theorem; both are CLASSICAL consequences, and the
  lane's label PROVED-rel is acceptable provided the record does not list them as new. New in the lane: the
  scope list, the device reading, and part (b).
- **E5 (scope of "cell closed").** What is established: Lemma C and Lemma P' (general q), Lemma X and Lemma Z at
  q = 5, and one candidate (CW) defined by the lane. Other cones adapted to F (non-polyhedral, or not
  containing v_+-) are not covered; the lane says this in weakest step 3. The device row should read "candidate
  (CW) on K_F closed", not "every W-adapted cone".
- Counts in DEVICE_READ_UNIV.md add to 34 (1 + 4 + 2 + 27). The codes are ARGUED from one-line readings and
  were not checked against the device lanes by this referee either. Device 7 is a restatement (Bagchi), as the
  lane says; devices 1 and 14 rest on unboundedness of log zeta on a line in the strip, which is classical
  (Bohr) and in scope as a pointwise bound.

## Requirement flags (strict)

- R1 false: no inequality in the result uses multiplicativity; [AUT] is named as an input that no cone
  inequality consumes.
- R2 false: no height-uniform conclusion; part (a) is a no-content statement for one class of such inequalities.
- R3 false: T-NR has every input of (CW) (proved for c > 0); DH-type rays pass P, FE, K.
- R4 false: nothing passes from the region right of the line or from finite stages to the line.

## Surviving claim

Relative to joint and hybrid universality as printed in Matsumoto's survey (statements checked against the
PDF): a sup-norm-closed, height-independent condition on a fixed compact window (connected complement) in
1/2 < Re s < 1 for finitely many pairwise non-equivalent Dirichlet L-functions that holds outside a set of
heights of upper density zero contains every non-vanishing analytic tuple; a continuous inequality in finitely
many values and derivatives at fixed offsets then holds on the whole jet space. Class-N conditions are
automatic on zero-free windows only (E2). For K_F = {v >= 0, Fv >= 0}: linear functionals are the entrywise
ones at x and 1/x; at q = 5 the F-fixed extreme rays give zeta(s)(1 + 5^(1/2-s)) +- L(s, chi_5), which have at
least CT zeros in every sub-strip (relative to Theorem 31) and measured zeros off the line; the T-NR lift has
every input of candidate (CW) and zeros at Re s = 1/2 +- arccosh(c/2)/log p_0 (inside the strip only for
2 < c < 2.1213 at p_0 = 2). Candidate (CW) is closed; other F-adapted cones are not covered.
