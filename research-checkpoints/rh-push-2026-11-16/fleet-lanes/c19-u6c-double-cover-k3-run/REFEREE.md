# REFEREE: c19-u6c-double-cover-k3-run (lens: general)

Date: 2026-11-19. Target: RESULT.md, claimed verdict precise-obstruction (registered outcome (i)); claimed flags
R1 = R2 = R3 = R4 = false. Referee scripts were kept outside the lane directory (/tmp/ref_c19/, not persistent; run locally through `scripts/memcap.sh 8`, python
from `.venv-arb`; no server use).

## Verdict

**The result holds as stated**, with the corrections listed in section 4 (none changes the verdict). No statement
about zeros of zeta is made, RH is not assumed, verified height is not used, and no known theorem is presented as
new (Siegel's formula is labelled CLASSICAL; non-Eulerian orthogonal periods are labelled RECALLED/expected).
Flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false (agree with the result).

## 1. PROVED steps, re-derived

**Lemma Q (interchange quadruple): confirmed.**
- v = 2: p, q, pq = 1 mod 8 are squares in Z_2; the four lattices are isometric. OK.
- v = p: (q/p) = 1 (reciprocity, p = 1 mod 4), so <1,1,q> = <1,1,1> and <1,1,pq> = <1,1,p> over Z_p. Same at q. OK.
- l odd, l not dividing d: d<1,1,d> = <d,d,d^2> = <d,d,1>; <d,d> is unimodular of determinant class 1, so = <1,1>. OK.
- Local class pairs: at p, (G_1, G_pq) = (U, R_p) and (G_p, G_q) = (R_p, U); at q, (U, R_q) and (U, R_q); equal
  elsewhere. A product of local functions of the similarity class therefore has Delta = 0. OK.
- "Globally similar": checked directly, not only through Hasse-Minkowski. Rank 3 forces the scaling factor c = d
  modulo squares, and d<1,1,d> = <d,d,1> = <1,1,1> over Q because d is a sum of two squares (p, q = 1 mod 4). OK.
- Referee addition (not in the result, closes a gap in why the test is the right one): if the period functional of
  SO_V on an irreducible pi were a pure tensor and phi is the spherical vector with trivial central character, the
  genus sum is prod_v P_v(pi_v(g_v) phi_v), with g_v determined by the SO_V(Q_v)-orbit of the local lattice. In odd
  rank a similarity factor of (V, q) with itself is a square lambda^2, the lattice changes by the scalar lambda
  (invisible to phi_v) and by an element of O = SO x {+-1} (-1 fixes every lattice). So the local factor depends only
  on the local similarity class and Lemma Q applies. The array-level definition used in the result is therefore
  the consequence of the pure-tensor property at the spherical vector, not an ad hoc proxy.

**Lemma T (theta splitting with radius): confirmed.** The splitting identity follows from the Mellin transform of
theta_Q(t) - 1 and theta_Q(t) = d^(-1/2) t^(-3/2) theta_{Q^-1}(1/t); both correction terms have the stated form.
|Gamma(w,u) u^(-w)| <= 2 e^(-u)/u for u >= 2(|Re w| + 2): for Re w <= 1 the bound is e^(-u)/u; for sigma = Re w > 1
it is e^(-u)/(u (1 - (sigma-1)/u)). The two tail expressions in the text equal the ones in `k3_eis.py`
(`tail1`, `tail2`) and both are larger than what partial summation with the stated point counts gives (the first
omits a helpful factor 1/(pi(T+1)), the second carries an extra factor d T). OK.

**Lemma E (closed form): confirmed as classical.** Residue argument for rho_E -> 0 at s = 3/2 checked: the pole
part of each K is M(G) times a constant independent of d after the factor d^(s/3), and
M(G_1) M(G_pq) = M(G_p) M(G_q). The limit rho_E -> R_1 - 1 at +infinity is immediate from the n = 1 term.

**Whittaker Mellin check (4.2):** the one-variable Mellin transform of K_nu and the Beta integral give the stated
Gamma quotient; consistent. The identification with the GL(3) Whittaker function is RECALLED in the result; the
referee's Hecke test below replaces that reliance for the purpose of the claim.

**Enumeration and genus code (read line by line):** reduced-form box (abc <= 2d, 2|f12|, 2|f13| <= a, 2|f23| <= b,
f12, f13 >= 0 by sign changes) is a superset of all classes; `canon` counts the bases of successive minima with the
lexicographically least Gram matrix, which equals |O(Q)|; `inv_odd` computes the determinant class of the form on
L/rad(L mod p); at 2, an integral lattice of odd determinant and rank 3 is odd, and for determinant 1 mod 8 the
classes <1,1,1> and <1,3,3> are separated by oddity 3 against 7. OK.

## 2. Numeric checks rerun by the referee (different cases)

New quadruple, not in the result: (p, q) = (17, 257) (both 1 mod 8, 257 = 2 mod 17 = 6^2).

1. **Masses against a theorem, not only against each other.** The result reports M(G_p) = (p+1)/96 and
   M(G_pq) = (p+1)(q+1)/192 "in all cases computed". These are Eichler's mass formula for the definite quaternion
   algebra of discriminant 2 with level d: (1/12) prod_{l | d}(l+1), divided by 2^(omega(2d)) (normaliser) and by 2
   (O against SO). For (17, 257): classes 1/2/10/61, masses 1/48, 3/16, 43/16, 387/16; all four equal the formula.
   This is an independent completeness check of the class lists that the result does not state as such.
2. **Exact part.** (17, 257): R_1 = 3/8 (W(1) = 1/8, 1/2, 2, 3); fixed-n ratios 3/8, 1, 7/9, 7 at n = 1, 2, 3, 5;
   mass Delta = 0. (17, 89): R_1 = 1/6 and ratios 1/6, 3/2, 5/3, 8 reproduced. The 11 listed R_1 values match the
   tabulated rho_E(10) + 1 row by row.
3. **Eisenstein values by a separate evaluator** (referee script: mpmath, per-class lattice sums,
   own theta splitting with T = 16, no use of `k3_eis.py`). (17, 89): rho_E = -0.490905 (s = 2), 0.143471
   (s = 0.75), -1.08482 + 0.07042i (0.75 + 10i), -1.09407 - 0.25339i (0.9 + 14.134725i): agree with the table to
   the digits printed. K_E(G_1) agrees to 12 digits at all four s. (17, 257), new case: rho_E = -0.32584 (s = 2),
   -0.53186 (s = 3), -12.510 (s = 0.75), -1.2059 + 0.1018i (0.75 + 10i), -0.8144 - 0.1407i (0.9 + 14.134725i), direct series -0.6245 at s = 10 against R_1 - 1 = -0.625. Non-zero, both
   signs relative to the other quadruples. Not ball arithmetic.
4. **Cusp evaluator: Hecke eigen-equation (new test).** With F from `gl3.py` and three random positive Gram
   matrices S: (1/p) sum over the p^2 + p + 1 Hermite matrices H of determinant p of F(H S H^T), divided by F(S),
   equals 0.14133657 / 0.14133658 / 0.14133657 for p = 2 (A(2,1) = a_2^2 - 1 = 0.14133658) and
   -0.79188397 / -0.79188398 / -0.79188397 for p = 3 (A(3,1) = -0.79188397). Invariance under a unimodular matrix
   with entries up to 7: 1.4e-9 to 2.1e-9. So the summed function is, to about 1e-8, an SL_3(Z)-invariant
   T_2- and T_3-eigenfunction with the symmetric-square eigenvalues. This removes most of weakest step 2 ("that it
   equals the normalised lift is not separately checked").
5. **Cusp Delta, new case.** (17, 257): K(G_17) = 0.1553548427 and K(G_257) = -0.0117021965 reproduce the table
   entries; K(G_4369) = -3.6501402584 (61 classes, spread between two basis orderings 5.5e-8);
   Delta_F = +0.2706119, rho = -148.85. Non-zero by more than 1e6 spreads.
6. Hejhal data: R and a_2, a_3, a_5, a_7 agree with the values the referee recalls for the first odd form
   (9.53369526135, -1.0683335512, -0.4561973545, -0.2906725550, -0.7449416121).

## 3. Controls

No mechanism specific to zeta is claimed, so there is no zeta control to run. phi = 1: Delta = 0 exactly (rerun for
(17, 257): 387/768 on both sides). The nine named controls are recorded in the result as not formulable on the
array and not counted as passes; that is the correct bookkeeping. The Eisenstein member and the cusp member both
give Delta != 0, so there is no separation; confirmed.

## 4. Errors and corrections (none changes the verdict)

1. Section 0 item 2 says "five complex s". The 12 decided values are 8 real and 4 complex (0.75 + 3i, 0.75 + 10i,
   0.75 + 25i, 0.9 + 14.134725i); the fifth complex point, 0.75 + 40i, is the undecided one. 132 = 11 x 12 is right.
2. "Radii of rho ... below 2e-4 at 0.75 + 25i": the printed balls at that point reach 5.1e-4 ((137, 193):
   [-0.869 +/- 4.12e-4] + [-0.207 +/- 5.05e-4]i). The exclusion of 0 is unaffected.
3. The label CERTIFIED covers the analytic step only. The inputs to the balls (completeness of the class lists,
   genus assignment) rest on the Minkowski bound and the completeness of the local invariants, which the result
   marks RECALLED. The referee re-derived the invariants (section 1) and adds the Eichler mass identity as an
   independent completeness check; with that, the label is acceptable, but the result should say that the masses
   were compared with the mass formula rather than "in all cases computed".
4. "EXACT for all large real s" is a limit statement: no explicit s_0 is given. It is true as stated
   ("for all sufficiently large s"); between s = 10 and that s_0 the claim rests on the 12 certified points only.
5. "No inequality" is established for the tested functional Delta (and rho) on the tested family: both signs occur
   for both inputs. It is not a proof that no other one-sided functional of the array exists; the verdict text
   should keep that scope (it does in section 5; item 4 of section 0 reads slightly more broadly).
6. The cusp row is one form and that form is a self-dual lift (symmetric square). "The cusp member" should read
   "one self-dual cusp form"; nothing is shown for a non-self-dual cusp form of SL_3(Z).
7. Verdict wording: "(K3) holds" means "the array is not a product" (Delta != 0); the campaign summary says "the
   identity fails". Both describe the same fact; the result should define the direction once at the start.
8. The cusp error bar's Hecke term (1e-8 sum |F|/|O|) is a heuristic, not a propagated bound: an error 2.2e-9 per
   a_p enters composite coefficients several times and the terms cancel. The margin (at least 2596 bars) and the
   Hecke eigen-equation test above make this immaterial for Delta != 0.
9. The server was used at 8 cores and 12 GB for 38 and 12 minutes; the referee reproduced one quadruple of each
   kind locally in seconds to minutes. No rule was broken (rhrun, units ended on their own).

## 5. Requirement flags (referee's own setting)

- R1 false. Multiplicativity enters only through the input's Hecke data and the mass; the finding is the absence of
  a product structure. No attack step in which multiplicativity is essential.
- R2 false. Finitely many (quadruple, s) cells; no height-uniform or every-window statement.
- R3 false. No control is run because none can be formulated; Eisenstein and cusp are not separated.
- R4 false. Values of period arrays at finitely many points; Re s = 0.75 is the centre of the Epstein functional
  equation, not a line for zeta.

## 6. Assessment

holds = true for the claim as scoped: Lemma Q is proved; the Eisenstein row has Delta != 0 (exact limit plus
balls, reproduced independently at four s for one listed quadruple and at real s for a new one); the cusp row has
Delta != 0 as a MEASURED statement (reproduced, with a new Hecke eigen-equation test of the evaluator and a new
quadruple); phi = 1 gives exactly 0; Delta has no fixed sign. The reading on the double cover remains RECALLED
(Jacquet's correspondence) and is not part of what is established. Score 0 and "cell closed as global period data
without a Hecke relation and without an inequality" are consistent with the evidence.
