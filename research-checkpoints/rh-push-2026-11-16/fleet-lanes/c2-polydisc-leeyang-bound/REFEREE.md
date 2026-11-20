# REFEREE: c2-polydisc-leeyang-bound (adversarial, lens: general)

Date: 2026-11-17. Reviewed: `RESULT.md`, `bound_test.py`, `bound_test.log` in this directory.
Outcome: **the verdict "precise-obstruction" holds**, with the scope the result itself states (tools whose only input is membership in a torus-rotation-invariant class). Four statement-level defects and three wording overstatements are listed in section 3; none changes the verdict. No statement about zeros of zeta is made or supported. Nothing assumes RH; nothing restates verified height; the classical content (Bohr, Kronecker, Dirichlet) is labelled as such and no novelty is claimed.

## 1. Re-derivation of the PROVED steps

**Thm. 1 (polydisc bound). Confirmed.** For fixed z' in the smaller polydisc, f(u) = F(u, z') has no zero in |u| < R_q, and (0, z') lies in the polydisc so f(0) != 0. Then f(u) = f(0) prod_{k<=m} (1 - u/a_k), m <= d_q, |a_k| >= R_q, and each factor lies in [1 - |u|/R_q, 1 + |u|/R_q]; m < d_q only helps since 1 - |u|/R_q <= 1 <= 1 + |u|/R_q. z' -> F(0, z') is in the class in one variable fewer. Extremal prod (1 + z_p/R_p)^(d_p) has its zeros at z_p = -R_p, on the boundary, so it is in the class; both bounds are attained. For F = prod (1 - z_p): |E_P(s)| <= prod (1 - p^-sigma)^-1. Correct.

**Thm. 2 (rotation invariance). Proof correct; statement is weaker than the proof (defect D1).** As written, B depends on r only and bounds |F(z)| at every z of the torus, so B(r) >= max over the torus follows by definition and the closure hypothesis is not used. The content the proof actually delivers, and the one the no-go needs, is: if B(z) may depend on the point z (angles included) but must hold for every F in a rotation-closed class C, then B(z) >= sup_theta |F(e^(i theta) z)| for each F in C. With that statement the conclusion "class membership cannot see chi" follows. Re-derived in that form; holds.

**Thm. 3 (no height-uniform improvement). Confirmed.**
- E_1 bound: for w = (s-1) log P, |e^(-w)| = P^(1-sigma) and |u + w| >= |Im w| = |t| log P for u >= 0, so |E_1(w)| <= P^(1-sigma)/(|t| log P). Checked numerically: P = 13, sigma = 0.7, t = 132508.18: Re E_1 = -2.64e-6, bound 6.35e-6.
- Lower bound: |1 - r e^(-i phi)| <= (1 - r) + r |1 - e^(-i phi)| <= (1 - r) + 2 pi eps r. Correct.
- Dirichlet step: to get t > T_0, apply the theorem to the reals T_0 log p/(2 pi) and take t = q T_0 with integer q >= 1. The proof does not spell this out; it is standard and holds for arbitrary frequencies, as claimed.
- Remark: sup_t |E_P(sigma + it)| = E_P(sigma) is attained at t = 0 with no approximation theorem. Dirichlet is needed only for the limsup, i.e. for G_P (whose renormaliser is not small near t = 0) and for "arbitrarily large height".

**Prop. 4 (Bohr equivalence at fixed P). Confirmed.** log p linearly independent over Q, Kronecker gives density of tau -> (p^(-i tau))_{p<=P} in T^n, and E_P^chi(s) = E_P evaluated at the rotated point; uniform continuity on the compact image closes it. The statement is for E_P, not G_P (the renormalisers of zeta and U differ and are not translation covariant); the text states it for E_P, so no error.

## 2. Numeric checks (rerun, different case)

Script `/tmp/c2ref/chk.py`, run through `scripts/memcap.sh 8`, float64 grid plus mpmath at 30 digits for spot values. Planned allocation about 100 MB.

Case A (not in the result): P = 13 (5 primes), sigma = 0.7, t in [1, 2e5], step 0.01.

| object | Thm. 1 upper | Thm. 1 lower | sup log abs E | t of sup | fraction | inf log abs E | violations |
|---|---|---|---|---|---|---|---|
| zeta | 2.65442 | -1.69403 | 2.58414 | 132508.18 | 0.9735 | -1.68014 | 0 |
| Liouville | 2.65442 | -1.69403 | 2.60223 | 15387.46 | 0.9803 | -1.67657 | 0 |
| random unimodular twist (seed 7) | 2.65442 | -1.69403 | 2.58899 | 125570.22 | 0.9754 | -1.68536 | 0 |

Both bounds of Thm. 1 hold on the grid for all three; the sup approaches the torus maximum for zeta and for both twists alike (Thm. 2, Thm. 3, Prop. 4). mpmath value at the zeta maximiser: 2.584136274, agreeing with float64.

Case B (independent recomputation of three table entries with mpmath E_1, no asymptotic series): log abs G_P maximum near the tabulated height.

| P | sigma | table | recomputed | t |
|---|---|---|---|---|
| 10 | 0.60 | 2.625 | 2.625197 | 1549.932 |
| 100 | 0.60 | 2.763 | 2.763329 | 7378.236 |
| 1000 | 0.75 | 2.011 | 2.011032 | 9654.075 |

Bound columns recomputed for P = 10, 30, 1e4 at sigma = 0.6, 0.9: "poly R=1", "poly LY", "c1", "sum" all reproduce to the printed digits (16.570, 746.46, 2226.6, 15.502 at P = 1e4, sigma = 0.6). log zeta(1.05) = 3.024, zeta(0.9) = -9.430: as stated.

Controls. No zeta-only mechanism is claimed, so there is no step for a control to fail. The claim that twists satisfy the same bound and reach the same sup was rerun above (Liouville, random twist) and holds. DH and backward heat rows rest on citations to `ap-leeyang-ladder` and were not rerun here either. T-NR, phase-rotated transfer operator and theta^w are not run in the result.

## 3. Errors and overstatements

- **D1 (statement of Thm. 2).** The theorem as stated is true by definition and does not use rotation closure. Replace by the point-dependent form in section 1. The proof given already covers it.
- **D2 (reading under the table, false as tabulated).** "The c1 derivative form [is] weaker than trivial at every row with P >= 30": at sigma = 0.90, P = 30 the table has c1 = 1.7 against poly R=1 = 2.184 (recomputed 1.694 against 2.184). The sentence is true only after adding the omitted term log zeta(1.05) = 3.02, which the text invokes for P = 10 only. The Lee-Yang-radius column is weaker at every row, as claimed.
- **D3 (overreach in "Consequence for the scoring line").** "R2 and R4 cannot both be met by a bound on G_P" is proved only for P fixed and t unrestricted. A statement for P >= P_0(t), or on |t| <= T(P), is not excluded by Thm. 3 or Prop. 4; the result says so itself in weakest step 3. The sentence should be restricted to "at fixed P". R2 for a zero-free conclusion does not require a sup over all t at fixed P.
- **D4 (inconsistent form of the Lee-Yang-radius bound).** Verdict item 1 and the table use the reciprocal form prod (1 - p^(1/2 - sigma))^-1 (a bound for 1/D_M, valid only for sigma > 1/2); "Consequences" uses the direct form prod (1 + p^(1/2 - sigma)). Both follow from Thm. 1, but they are different bounds for different objects. "Weaker by a power of P" refers to the exponent (ratio of exponents of order P^(1/2)), not to the bound.
- **D5 (control row zeta(s+a)zeta(s-a)).** The bound quoted, prod (1 - p^(a - sigma))^-1 (1 - p^(-a - sigma))^-1, is the factorwise triangle bound, not Thm. 1 with d_p = 2 and radius p^(-a), which gives the weaker prod (1 - p^(a - sigma))^-2. The row's conclusion (true, weaker than zeta's, fails at no step) is unaffected.
- **D6 (measured wording).** "True sups within 1.4 of zeta's" for all four controls: Beurling at sigma = 0.6, P = 1e3 differs by 3.945 - 2.529 = 1.416. "Still rising with P ... which is the square-root rate of c1 Test 2" is read off three grid sups on one height range and one seed; it is not established here.
- **D7 (scope, already disclosed).** The no-go covers only bounds that hold for a whole rotation-invariant class. A tool using the specific polynomial prod (1 - z_p) at a specific torus point, or stability regions that are not rotation invariant, is outside Thm. 2. The obstruction-map row says "closed for rotation-invariant tools", which is the correct scope; the headline "everything obtained from these by Grace-Walsh-Szego, Asano contraction, Borcea-Branden closure, or a Ruelle radius" was argued through the invariance property and not by opening those theorems.

## 4. Requirement flags (set by the referee)

- R1 = false. The bound is the triangle inequality; multiplicativity is not essential in any step.
- R2 = false. No positive height-uniform conclusion; Thm. 3 is a negative statement at fixed P.
- R3 = false. Every control with product stages satisfies the derived statement; DH and backward heat by citation; three controls not run.
- R4 = false. No bound below the trivial one; the residual is c1 Thm. D(b), unchanged.

## 5. Verdict

holds = true for the claim "polydisc stability gives exactly the torus-maximum (trivial) bound, and no bound valid for a torus-rotation-invariant class can be smaller; for zeta at fixed P the sup over heights of abs G_P is at least E_P(sigma); at fixed P a unimodular twist stage is a limit of height translates of zeta's stage". All four are confirmed and all are classical in content. Corrections D1 to D6 should be applied to the text. The result closes a tool family and establishes nothing about zeros.
