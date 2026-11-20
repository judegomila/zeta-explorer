# REFEREE: ap-leeyang-structural

Date: 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.

**Referee verdict: holds, with corrections.** The four PROVED/CLASSICAL items of the verdict were re-derived and stand after one hypothesis is narrowed (R1). No error changes the conclusion "no Lee-Yang theorem locates a zeta zero in the models examined". The Davenport-Heilbronn statements were reproduced numerically with an independent construction. The result contains no new information about zeros: Corollary 1(c) is the Rodgers-Tao theorem restated, and Proposition 1 is a one-line corollary of the Lieb-Sokal theorem. "Route closed" is supported only for the five models listed and for complete-graph couplings; the lane says so.

Labels: CONFIRMED (re-derived or recomputed by the referee), NOT CONFIRMED (depends on a source that was not opened), ERROR, GAP.

## 1. Re-derivation of the PROVED steps

**Claim 1, Phi = phi * mu (section 2.1). CONFIRMED.**
- n^{-1/2} phi(u + (log n)/2) = (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}): direct substitution.
- Transform of phi: with y = e^{4u}, iz = 2s - 1, the integral is (1/4)[2 pi^2 Gamma(s/2 + 2) pi^{-s/2-2} - 3 pi Gamma(s/2 + 1) pi^{-s/2-1}] = (1/4) pi^{-s/2} Gamma(s/2 + 1)(s - 1) = (1/4)(s(s-1)/2) pi^{-s/2} Gamma(s/2). Convergent for Re s > -2. Only zero: s = 1 (z = -i). Matches.
- Each translate contributes n^{-s}; the product over primes of (1 - p^{-s})^{-1} has no zeros and converges for Re s > 1. "Every factor zero-free in the strip, no interaction term" is correct as a statement about the form of the weight. The convolution over primes is formal, as the lane states.
- phi < 0 iff 2 pi e^{4u} < 3: correct.

**Claim 2, Proposition 1 and Corollary 1 (section 4.1). CONFIRMED for sites with super-Gaussian decay; statement needs a narrower hypothesis (R1).**
- Algebra: e^{-b S^2} = exp(-b sum lam_i^2 x_i^2 - 2b sum_{i<j} lam_i lam_j x_i x_j); residual couplings J_ij - 2b lam_i lam_j >= 0 iff b <= m/2. Correct.
- Site step: for nu in U with alpha > 0, e^{-b lam^2 x^2} nu is again in U (beta shifts), and U is contained in LY by K4 applied to exp(-alpha x^4 - beta x^2) (Polya, de Bruijn). Only this easy direction of Newman's 1976 classification is used; the classification itself is not needed.
- Sharpness. N = 2 and N = 3 formulas re-derived by hand: thresholds b = J/2 in both. The lane labels N >= 4 MEASURED; it is provable for every N in one line: the polynomial sum_k C(N,k) e^{c(N-2k)^2} w^k has sum of roots -N e^{-4c(N-1)}, of modulus > N when c < 0, so not all roots lie on abs(w) = 1. With Lee-Yang for c >= 0 this gives Lambda = -J/2 exactly for all N >= 2.
- Corollary 1(b): the Hurwitz step is correct given the uniform exponential-moment bound. m is scale-covariant in the same way as Lambda (both scale by c^{-2} under S -> cS), so the statement is consistent; standard Curie-Weiss scaling (J = beta/N, lam = N^{-1/2}) has m = beta, so the exclusion is not vacuous.
- "Two free Ising spins have Lambda = 0": confirmed from the N = 2 formula at J = 0.

**Claim 3, de Bruijn as the coupling theorem (section 5.3). CONFIRMED.** De Bruijn 1950 Theorem 13 in the lane's normalisation (zeros of Xi in abs(Im z) <= 2 theta - 1) gives Lambda <= (2 theta - 1)^2/2: 1/2 for theta = 1, 9/32 for theta = 7/8. "The only coupling on the total spin is the heat time" is true by definition: a pair interaction that is a function of U alone is t U^2. It is not a statement that no other ferromagnetic model exists.

**Claim 4, measured items. CONFIRMED (section 2 below).**

## 2. Numerical verification by the referee

Run through `scripts/memcap.sh 8`, mpmath at 30 digits, scalar memory (planned allocation: scalars only, under 50 MB). Scripts kept outside the repository (scratch directory); nothing written here except this file. Floating point, not interval-certified.

Davenport-Heilbronn, built independently from Hurwitz zeta values, f(s) = 5^{-s} sum_r a(r) zeta(s, r/5), a = (1, kappa, -kappa, -1), kappa = 0.284079043840412:
- cross-check against the direct sum at s = 3 (20,000 terms): agreement to 1e-13;
- functional equation defect of (5/pi)^{s/2} Gamma((s+1)/2) f(s): 1.3e-30 at 0.3 + 7.7i, 5.8e-30 at 0.8 + 40.1i;
- zero at 0.808517182456637 + 85.699348485378i, abs f = 2.1e-30, winding number 1 on a circle of radius 0.05, reflected point also a zero. Distance from the line 0.3085. The control has off-line zeros: confirmed;
- completed function on the real axis, sigma in (0.5, 40.4], step 0.1: minimum 1.1372 (positive); maximum of (log Lambda_DH)''' = -3.06e-4, at the end of the grid. GHS-type sign holds on this finer and longer grid;
- cumulant quantities (-1)^{n-1} n c_{2n}, n = 1..6: 0.0245174, 1.09282e-4, 9.32661e-7, 8.72055e-9, 8.3297e-11, 8.00374e-13. All positive; identical to the lane's values.
So DH passes both real-field inequalities while having off-line zeros. The control failure is as claimed.

Other items:
- g_2 zero at 1.47359593307626 + 4.25928388520206i, abs g = 1.9e-32, winding 1. g_3 zero at 0.811445852350513 + 168.039110712886i confirmed.
- Three-exponential control: zeros of 1 - 2^{1-s} + 3^{-s} at 1.339737508213 + 8.913724351151i and 0.550488507149 + 44.820042174728i confirmed (two different real parts suffice for the claim). Density and Mellin transform formulas re-derived.
- Epstein controls recomputed (the lane took them from `h-hecke-channels`): completed Epstein function by the incomplete-gamma expansion, functional-equation defect 3e-19. x^2 + 9y^2 vanishes at 0.865091 + 20.647342i (8e-20 against 1.4e-13 at distance 0.3); 2x^2 + 2xy + 5y^2 vanishes at 1.361834 + 10.405933i (7e-13 against 5e-7). Positive lattice weights with off-line zeros: confirmed. The lane does not say which zero belongs to which form; the assignment is the one just given.
- Memory planning of the lane's scripts: scalar mpmath; the largest object is a list of 41,400 complex contour points. Adequate. The lane's three scripts were read, not re-run in full; every number above was recomputed with separate code.

## 3. Errors and gaps

**R1 (ERROR in a hypothesis, repairable). Proposition 1 is stated for all of class U; it is proved only for sites with integrable e^{b x^2} for every b.** The Lee-Yang theorem of Newman 1974 and Lieb-Sokal 1981 for general single-spin measures assumes this decay. Members of U with alpha = 0 (Gaussian decay) violate it, and for them exp(sum J_ij x_i x_j) prod d nu_i need not be a finite measure, so rho_S and Lambda(rho_S) need not be defined. Correct statement: sites Ising (two-point) or in U with alpha > 0. The lane mentions the issue in "weakest steps" but leaves the proposition as stated. Corollary 1 is unaffected in substance (it is Rodgers-Tao; see R5).

**R2 (ERROR, minor). Section 2.2: "Phi(u) du is the law of U = (1/4) log(pi S_2/2) up to a constant" is false.** From 2 xi(s) = E[Y^s] and s = (1 + iz)/2, Y = e^{2U}: Xi(z) = (1/8) E[e^{U} e^{izU}], so Phi(u) = (1/8) e^{u} p_U(u). The law of U is not even; Phi is an exponential tilt of it. The Polya-frequency remark about S_2 is unaffected (Schoenberg's hypotheses hold: the Laplace transform is the reciprocal of prod (1 + 2L/(pi^2 n^2))^2).

**R3 (GAP in reasoning, conclusion correct). Section 4.2, M5: "residues of both signs, so not the reciprocal of an entire function".** The sign of residues is not the reason: a sum with positive residues such as sum 1/(L + pi n^2) also has zeros. The conclusion needs a zero of the Laplace transform. Referee check: sum a(n) n/(n^2 + w^2) = (A sinh 3x + B sinh x)/sinh 5x with x = pi w/5, A = 1.40491, B = 0.39934 (fitted at two points, checked at a third to 1e-5), which vanishes at sinh^2 x = -0.8211, i.e. L near -2.05 between the first two poles. So the DH kernel in y is not PF_infinity. The same computation with complex A, B applies to each L(s, chi) mod 5, as the lane says.

**R4 (ERROR, minor). Section 5.3: "E_a ... its true strip is D = 2a" is conditional on RH**; unconditionally it is between 2a and 2a + (the zeta strip). It does not affect the argument.

**R5 (novelty). Nothing here is new relative to the literature, and the lane's novelty claim must be read as "new relative to the obstruction map" only.** Corollary 1(c), "Phi is not e^{b u^2} Psi with b > 0 and Psi in LY", is the definition of Lambda >= 0. Proposition 1 is Lieb-Sokal applied after completing a square; the Curie-Weiss value Lambda = -J/2 is elementary. The lane's task named Newman-Wu (Bull. AMS 57, 2020, "Constants of de Bruijn-Newman type in analytic number theory and statistical physics"); the lane does not cite or use it. That survey treats de Bruijn-Newman constants of general measures including statistical-mechanics examples; the referee could not open the full text, so overlap with Proposition 1 is NOT CONFIRMED either way.

**R6 (scope). "Route closed" rests on a non-exhaustive model list.** Not excluded, as the lane states: sparse, hierarchical or vanishing-coupling pair ferromagnets; representations in which z couples to a spin other than through M2. The headline sentence "No Lee-Yang theorem locates a zeta zero" is a statement about K1-K8 and models M1-M5, not a theorem.

**R7 (unsourced numbers).** DH strip constant D = 1.2407 (section 5.3) is not derived in the lane. Referee estimate from the Bohr-type condition sum over p = 2, 3 mod 5 of 2 arctan(p^{-sigma}) = pi - 2 arctan(kappa) = 2.588 gives sigma near 1.12, i.e. D near 1.24: consistent, not verified. Zeros of DH with Re s > 1 are classical (Davenport-Heilbronn 1936; Titchmarsh 10.25) and were not located numerically by the lane or by the referee.

**R8 (citations not checked against sources).** Lieb-Sokal 1981 (exact decay class), Newman 1976 (exact parameter conditions of the class U; a search confirms only the abstract: even nonnegative finite measures for which the transform of exp(-b t^2) d rho has only real zeros for every b > 0), Knauf 1993, Kac 1974, Hejhal 1990, Biane-Pitman-Yor 2001, Newman 1991, Ellis-Monroe-Newman 1976. Statements as recalled agree with the referee's recollection; none was opened. The K_{iz} example belongs to Polya 1926, not 1927 (attribution only). The GHS-type inequality is a property of ferromagnets with suitable sites, not of the class LY (for one factor, the third derivative of log(1 + h^2/g^2) is positive when h^2 > 3 g^2); the lane's wording "necessary for a Griffiths-Simon representation" is the correct one and should not be read as "necessary for LY".

## 4. Control check

Required: the argument must not attribute to zeta a structure that the control also has, and must name where DH differs.
- The lane's conclusion is negative, so the test is whether the stated differences are real. (i) Product structure: DH is (e^{-i th} L(s, chi) + e^{i th} L(s, chi-bar))/(2 cos th), a sum of two Euler products; correct, and its Lee-Yang content is confined to Re s > 1. (ii) Signed weights: shared by Dirichlet L-functions; absent for the Epstein controls, whose off-line zeros were recomputed above. Correct.
- "No coupling turns antiferromagnetic for DH": correct within M1-M5. In M2 both zeta and DH sit at coupling t = 0; DH needs t >= Lambda_DH > 0 and zeta needs t >= Lambda in [0, 0.2]. The only named antiferromagnetic control is backward heat.
- Proposition 1 does not separate zeta from DH (both have Lambda >= 0) and is not claimed to.

## 5. Surviving claim

In the pair-interaction Lee-Yang framework (Newman, Lieb-Sokal) with the models M1-M5: Phi = phi * (formal convolution over primes of one-sided geometric measures) with no interaction term and every factor zero-free in the strip; a complete-graph ferromagnet with two-point or alpha > 0 Newman-class sites has de Bruijn-Newman constant <= -m/2, with equality for equal-coupling Ising at every N, so by Rodgers-Tao Xi is neither such a system nor a limit of such systems with m bounded below (a restatement of Lambda >= 0 in ferromagnet language); the only height-uniform output is de Bruijn's Lambda <= (2 theta - 1)^2/2; Davenport-Heilbronn passes the GHS-type and cumulant-sign inequalities and differs from zeta only by lacking a product structure (content in Re s > 1) and by signed weights (which do not separate). Not established: non-existence of a sparse or vanishing-coupling ferromagnetic representation. No new information about any zeta zero.
