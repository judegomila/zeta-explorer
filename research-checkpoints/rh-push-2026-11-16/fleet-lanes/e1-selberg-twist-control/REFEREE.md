# REFEREE: e1-selberg-twist-control

Date 2026-11-17. Adversarial pass on RESULT.md. Scripts used for the reruns: /tmp/e1ref/ref1.py, /tmp/e1ref/ref2.py
(local, through `scripts/memcap.sh 8`, peak allocation 240 x 240 complex matrices). The compute server was not used.

## Outcome

The verdict "precise obstruction" stands. Every step labelled PROVED was re-derived and is correct. The numerics
reproduce on a character not used in the result. Three statements are wrong or overstated (E1-E3) and four are
weaker than their wording (W1-W4). None changes the verdict. Nothing assumes RH, restates verified height as a
result, or claims a zeta zero statement.

## PROVED steps re-derived

1. **Proposition B1: confirmed.** D = c Z'/Z + E has a pole at 1/2 + i r_1 (Z has a zero there, E is holomorphic
   there). A Dirichlet series is holomorphic in its half-plane of convergence and agrees with the continuation by
   the identity theorem, so sigma_c >= 1/2. Landau for general Dirichlet series with c_nu >= 0: the real point
   sigma_c is singular. With the r3 definition (sigma* = supremum of sigma_0 and of the real non-holomorphic
   points) this is sigma* >= 1/2 > beta/2, since beta < 1. c != 0 suffices; c > 0 is not needed. The statement is a
   two-line corollary of Landau's lemma, correctly not presented as new mathematics.
   Hypothesis check for the listed E: the points are 1/2 + a + 9.5337i (zeta(s + a)), 1 + a + 19.0674i
   (zeta(2s + a)), a + 19.0674i (zeta(2s - 1 + a)). The result justifies this by "r_1 is below the first zeta
   ordinate"; that covers only the first. The other two need "19.0674 is not a zeta ordinate" (true: 14.1347 and
   21.0220 are consecutive ordinates). Correct, justification incomplete.
2. **Disjoint supports: confirmed.** eps^{2j} + eps^{-2j} is an integer and 0 < eps^{-2j} < 1, so no N(gamma) is an
   integer; smallest norm ((3 + sqrt 5)/2)^2 = 6.854.
3. **Coupling 3: confirmed.** d/ds log(Z(s)/zeta(2s)) = Z'/Z - 2 zeta'/zeta(2s), and -2 zeta'/zeta(2s) =
   2 sum Lambda(n) n^{-2s} >= 0. ord_{1/2} Z = -1 agrees with the classical formula -(h - tr Phi(1/2))/2 with h = 1,
   phi(1/2) = -1. Cancellation at rho/2 is classical for every rho; it was measured at rho_1/2 only.
4. **Sign lemma: confirmed** (residue +ord for Z'/Z against -ord for -zeta'/zeta). It is the standard sign of the
   Selberg explicit formula; it is not new and should be labelled CLASSICAL.
5. **Structural statement (section 3): confirmed for Z and R only.** R(s) = Z(s+1)/Z(s) = prod (1 - chi N^{-s})^{-1},
   prod_k R(s+k)^{-1} = Z(s), R(s)R(-s) = Psi(1+s)/Psi(s). For R(s) = F(s)R(1-s):
   F = Psi(s)^{-1} Z(s+1)/Z(2-s); the poles on Re s = 1/2 cancel, and F has zeros at -1/2 +- i r_j and poles at
   3/2 +- i r_j, so F is not elementary. The text's reason ("poles on 1/2, zeros on -1/2") is the right one. Scope:
   the class "Selberg objects" is not defined; the proof covers Z and R, not products or shifts. Also R does satisfy
   a reciprocal equation R(s) R(-s) = elementary with a degree-one unimodular Euler product and real exceptional
   poles; "gap not filled" depends on requiring the non-reciprocal form R(s) = F R(1-s). This should be stated.
6. **Theorem PC inside the geodesic monoid: confirmed.** D_g = Z'/Z - (G'/G + G~'/G~)/2 has coefficients
   Lambda_Gamma (1 - Re g^j) >= 0; steps 1-4 of the r3 proof use only Landau and the sign. Residue bookkeeping gives
   r_G(w) + conj r_G(conj w) = 2 ord_w Z. Item (iii) of the r3 theorem (which uses "zeta has no zero in (0,1)") does
   not transfer and is not claimed.
7. **Hitting sets (4 attributes): confirmed by enumeration.** Base: {FE,SIZE}, {FE,GEOM}, {INT,GEOM}. With SEL
   lacking {INT}: {INT,GEOM}, {FE,SIZE,INT}. Strict reading: the three base sets stand.

## Errors

- **E1 (section 3, extended list).** "{FE, GEOM, X} with X in {INT, ORD, SIGN}" is wrong for X = INT:
  {FE, GEOM, INT} contains {INT, GEOM} and is not minimal. Enumeration gives six minimal sets: {INT,GEOM},
  {FE,SIZE,INT}, {FE,SIZE,ORD}, {FE,SIZE,SIGN}, {FE,GEOM,ORD}, {FE,GEOM,SIGN}. The list also assumes that the seven
  map controls all have ORD and SIGN; that was not checked (Beurling systems need not have order one).
- **E2 (verdict, Part B).** "The only positive combination that removes the real pole at 1/2 is
  Z'/Z - 2 zeta'/zeta(2s)" is false. Counterexample: Z'/Z + zeta(s + 1/2) = sum Lambda_Gamma N^{-s} +
  sum n^{-1/2} n^{-s} has non-negative coefficients, no pole at 1/2 (residues -1 and +1), and keeps the poles at
  rho/2. It does not help: residue +1 at s = 1 remains, so sigma* = 1, and Proposition B1 applies anyway. Replace
  "the only" by "one".
- **E3 (section 3, last sentence).** "the converse theorems leave only Dirichlet L-functions, which is why
  {INT, GEOM} hits every control" is a non sequitur. The converse theorems need the functional equation, which is
  not in {INT, GEOM}. That {INT, GEOM} is a hitting set is a property of the table of seven controls only.

## Weaker than worded

- **W1. Lacks-sets are reverse-engineered.** The map does not list lacks-sets in the four attributes; the result
  chose sets "consistent with the map's three minimal sets". The weak reading of GEOM/SIZE/FE is applied to SEL
  only; the other six controls keep the original reading. The weak-reading conclusion ("every hitting set contains
  INT") therefore rests on a mixed reading and should be marked as such. Under the weak reading the measured
  (twisted) SEL has no pole at 1 and complex coefficients; the row merges it with the compact form, which is cited
  and not computed.
- **W2. The Euler-product comparison is not independent of the word/class correspondence.** `euler_logZ` sums the
  formal trace expansion of the same operator K_X K_Y. The 1.9e-13 agreement tests the Taylor truncation, not that
  closed words are the primitive classes of Gamma(2) with the character chi. Independent evidence for the
  identification is: the functional equation with the non-fitted cusp constant, and in the scalar case the zeros
  at rho_1/2 and at 1/2 + 9.5337i (t3). That is sufficient for MEASURED, and should be said.
- **W3. Prime-geodesic ratio.** The claim quotes 0.999 for (0.01, 0.02). For (0.03, 0.05) the ratio drifts
  monotonically 0.929, 0.996, 1.013, 1.032 over x = 1e4 to 9.9e5. This is within the stated noise x^{1/2 - s0} times
  the number of line zeros but shows no convergence yet. It supports the zero only at the 3% level.
- **W4. Item 22 remark.** The measured characters are rational (order 100), not generic. That their kernels are
  non-congruence follows from the measured zero and Selberg's 3/16, not from genericity. Items 16-18 and 20 were
  not checked against the lanes' formalisms (the result stars them; this pass did not verify them either).

## Reruns (different cases)

All at K = 24 to 32, 800-bit entries, float64 determinant; MEASURED, not interval-certified.

| Check | Case | Outcome |
|---|---|---|
| Functional equation, predicted constant | chi_{0.02,0.07} (not in the result), K = 32 | relative error 6.3e-12, 1.1e-11, 2.9e-12 at s = 0.62, 0.80, 0.93; 8.1e-12 at 0.7 + 0.5i; 2.1e-10 at 0.85 + 1.5i |
| Real zero | chi_{0.02,0.07}, grid 0.505(0.015)1.0, K = 24 | one zero, s0 = 0.7266148700, lambda_0 = 0.19865; at K = 32 Z(s0) = 1.7e-10, Z' = 3.87 (shift 4e-11) |
| Real zero | chi_{0.01,0.02}, same grid | s0 = 0.9503290736 (K = 24), reproduces the result |
| No zero | chi_{0.05,0.12}, grid down to 0.505 | Z > 0 on the grid (1.091 at 0.505, 0.902 at 1.0): no sign change; extends the result's floor 0.52 to 0.505 |
| No zero | chi_{0.04,0.09} (new) | Z > 0 on the grid (0.312 at 0.505, 0.784 at 1.0) |
| Determinant vs word expansion | chi_{0.02,0.07}, 19,187 words (trace <= 300) | 2.1e-13 at s = 3; 8.4e-11 at s = 2.5 (tail) |
| rho(T) eigenphases | chi_{0.02,0.07} | -0.49, -0.475, -0.035, 0.01, 0.025, 0.465: none is 0, so no zeta-type pole in the entries, consistent with "entire" |
| Hitting sets | brute-force enumeration | as in item 7 and E1 |

lambda_0 / sum abs(alpha_j): 1.18, 1.34, 1.42 at sums 0.04, 0.10, 0.14; no zero at sums 0.18 and 0.24. Consistent
with lambda_0 crossing 1/4 between 0.14 and 0.18.

## Controls

Part A is itself a control; Part B is a silence statement. No zeta-only mechanism is claimed, so there is no
mechanism to run against DH, HEAT, TW, EA, NR, B. The Part B control paragraph (DH, Beurling) is cited or inferred
and labelled so. The statement that SEL tests nothing at height > 0 is correct (finitely many real off-line zeros).

## Checks requested by the assignment

- Assumes RH: no. Uses of zeta zero locations are at height below 22 (classical).
- Restates verified height: no.
- Known theorem presented as new: the sign lemma and Proposition B1 are classical or immediate; they are labelled
  PROVED rather than CLASSICAL but no novelty is claimed. Existence of small eigenvalues near chi = 1 is cited as
  classical.

## Required corrections to RESULT.md

1. Section 3 extended list: X in {ORD, SIGN} for {FE, GEOM, X}; state that ORD and SIGN were not checked for the
   seven map controls.
2. Verdict and section 4: delete "the only".
3. Section 3: delete the "which is why" clause.
4. Section 3: state that the lacks-sets are inferred and that the weak reading is applied to SEL only; state the
   reciprocal equation of R.
5. Section 4: replace the justification for E by "9.5337 and 19.0674 are not zeta ordinates".
6. Section 1.3: state that the word expansion and the determinant share the word/class identification.

## Surviving claim

Measured: Z_{Gamma(2)}(s, chi_{a,b}) has a real zero at 0.95033 for (0.01, 0.02), 0.83990 for (0.03, 0.05) and
0.72661 for (0.02, 0.07); none on [0.505, 1] for (0.05, 0.12). It has an Euler product over geodesics, an
s <-> 1-s equation with elementary factor, and lacks the integers, order one, finite degree and the zeta sign of
the zero side. Under a weak reading applied to SEL alone, the minimal input sets become {INT, GEOM} and
{FE, SIZE, INT}; under the strict reading the map is unchanged. Proved: any non-negative-coefficient coupling
c Z'/Z + E with E holomorphic at 1/2 + 9.5337i has sigma* >= 1/2, so Theorem PC is silent at rho/2. No information
about a zeta zero.
