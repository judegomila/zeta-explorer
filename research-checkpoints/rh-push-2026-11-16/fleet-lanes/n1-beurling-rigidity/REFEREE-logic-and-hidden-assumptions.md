# REFEREE (logic and hidden assumptions): n1-beurling-rigidity

Date 2026-11-17. Internal adversarial pass, independent of REFEREE.md. Claimed verdict: proved-new-result.

**Referee verdict.** Every PROVED step was re-derived and holds. Theorem B's dependence on Meyer's theorem (quoted from memory, still not verified from a source) can be removed: section 2 below gives a short self-contained proof of a stronger statement. The label "new" is not established. Three scope statements are wider than what is proved. Nothing assumes RH, nothing restates verified height, and the result has no bearing on zeros (RESULT.md says so itself).

## 1. Re-derivation of the PROVED steps

| Step | Outcome | What was checked |
|---|---|---|
| S1 | holds (classical) | Splitting the Mellin integral at x = 1 with Theta(x) = x^(-1/2) Theta(1/x) + (kappa/2)(x^(-1/2) - 1) gives polar part kappa/(s-1) - kappa/s; pi^(-1/2) Gamma(1/2) = 1, so residue of zeta_P at 1 = atom at 0. Converse direction needs convergence in a half-plane and finite order (Phragmen-Lindelof). |
| S2 | holds | k-th x-derivative at x = 1 pairs mu with t^(2k) e^(-pi t^2) on one side and its transform on the other; even Hermite span is dense in even Schwartz space in the Schwartz topology; mu is tempered because Theta(x) <= C x^(-1/2) gives N(R) <= e^pi Theta(R^-2) = O(R). |
| S3 | holds | Transform of psi(R(xi - t)) is R^-1 psi^(x/R) e^(-2 pi i t x); abs(psi) <= psi(0) = 1; limit uses only that mu is Radon. |
| A1-A4 | hold | A1: mu({t}) is real, so it is the limit of M_R(cos), and M_R(cos) <= M_R(1) for each R. A2: the atom set is closed because atoms have mass >= kappa and mu is Radon. A3: inequality verified. A4: correct. |
| Corollary A | holds | With multiplicity 1 the value map is injective, so N is isomorphic to (Z_{>0}, x) and the generators are the rational primes. |
| B1, B2 | hold | B2 covers repeated generators (exponent vectors are indexed by generator, not by value). |
| B3 | NOT confirmed from a source | The arXiv PDF 1502.06283 was fetched and text-extracted; it cites Meyer [4] but does not state the theorem. The statement used matches my recollection (Meyer 1970 for the coset ring; Rosenthal for "discrete element of the coset ring of R = finite union of arithmetic progressions up to a finite set"). It stays unverified; see section 2 for a proof that does not need it. |
| B4 | holds given B3 | Each link checked, including: unit masses of mu_C by periodicity; a_C(k)/L_C in {0,1} for k != 0; kappa = sum d_C >= r and kappa <= r; vanishing of a_C off hZ. |
| 2.4 second lemma | holds | Stated without proof in RESULT.md. Proof: nu = pushforward of mu under x -> a x satisfies nu <= mu (injection n -> a n of multisets); the transform of mu - nu is positive definite; its atom at 1/a is -1/a and at 0 is kappa(1 - 1/a). Uses m_1 = 1, i.e. no generator equal to 1. |
| Lemma T | holds as a statement about the formal variation | See 3.4 for the unstated differentiability assumption. |

## 2. Theorem B does not need Meyer, the semigroup, or integer masses (referee, PROVED here)

**Theorem C.** Let mu be a positive tempered measure on R with mu^ = mu and no mass on (-1,1) minus {0}. Then mu = kappa III_Z with kappa = mu({0}).

Proof. Take real eta in C_c^inf((-1/2, 1/2)) and psi = eta * eta~. Then psi is a Schwartz function supported inside (-1,1), psi(0) = ||eta||_2^2, psi^ = abs(eta^)^2 >= 0. Pairing mu^ = mu with psi:

  kappa ||eta||_2^2 = <mu, psi> = <mu, psi^> = kappa abs(integral eta)^2 + integral over t != 0 of abs(eta^(t))^2 dmu(t).

Let eta_k -> indicator of [-1/2, 1/2] in L^2 (hence in L^1). The left side minus the first term on the right tends to kappa(1 - 1) = 0, and eta_k^ -> sin(pi t)/(pi t) uniformly. By Fatou, integral over t != 0 of (sin(pi t)/(pi t))^2 dmu = 0, so mu is carried by Z. Then mu = sum a_n delta_n, mu^ is 1-periodic, mu^ = mu makes mu 1-periodic, a_n = a_0 = kappa. QED

This is the one-dimensional linear-programming (Cohn-Elkies / Selberg triangle function) duality; positivity of mu is used once, to pass from a vanishing integral to the support.

Consequences.
- Every Beurling system has its generalized integers in [1, inf), so mu has no mass on (-1,1) minus {0}. Theorem C gives Theorem B for every residue kappa, with no use of B1-B4, of Meyer, or of unique factorisation. Theorem B is therefore PROVED outright, not "relative to Meyer".
- The statement also covers weighted systems (arbitrary nonnegative real coefficients, some below the residue), which neither Theorem A nor Theorem B covers.
- The hypothesis that separates zeta from the NR-type fakes can be stated as "no frequency below 1" instead of "every atom >= the atom at 0". Both hold for zeta and each fails for every fake checked (author's fake: atom at 1/4; mine: atom at 3/5). Theorem A (masses >= kappa, positions free) and Theorem C (positions >= 1, masses free) are logically independent.
- Positivity cannot be dropped in Theorem C: signed Fourier eigenmeasures with locally finite support and an arbitrarily large gap around 0 exist (Baake, Spindeler, Strungaru, arXiv 2104.06812, Theorem 7.5 and Corollary 7.6; text extracted and read).

Novelty of Theorem C: not claimed. It is the sharp case of a standard duality argument; one search did not find it stated in this form.

## 3. Errors, hidden assumptions, overstatements

1. **Verdict label.** "proved-new-result" should read "proved; novelty unverified". Theorem A is the equality case of abs(a(t)) <= a(0) for the positive-definite atom function a(t) = mu({t}) of a measure with positive transform; the equality set of a positive-definite function is always a subgroup. That is textbook material in diffraction theory. One web search and two source reads (1502.06283, 2104.06812) found neither Theorem A nor Corollary A stated in this form and nothing indicating it is more than a short corollary.
2. **"Completeness; no eighth control of this kind" and "Row B cannot be upgraded to carry FE" (sections 0, 4).** Proved only for zeta's exact functional equation: gamma factor pi^(-s/2) Gamma(s/2), symmetry s -> 1-s, conductor 1, polar part exactly kappa/s + kappa/(1-s), finite order, self-dual (the same series on both sides). Not covered: other gamma factors or conductors (Dedekind zeta functions and zeta(s)^2 are Beurling systems with functional equations), additional poles (Bochner residual functions), and functional equations relating two different series. With Theorem C the excluded class is larger than RESULT.md states (weighted systems included), but the restriction to zeta's own functional equation stays.
3. **"INT is not an independent input once FE is present together with coefficients >= residue".** The hypothesis "coefficients >= residue" is not one of the map's inputs and does not follow from Lambda(n) >= 0 (an Euler factor (1 - p^(-s)/2)^(-1) has positive Lambda and a coefficient 1/2). The correct bookkeeping statement, from Theorem C: zeta's exact FE + nonnegative coefficients + least frequency >= 1 forces the integers with constant coefficients. Since Lambda_P >= 0 gives nonnegative coefficients, "FE + Lambda >= 0 + frequencies >= 1" implies INT.
4. **Lemma T: unstated differentiability.** The lemma treats -omega' as the first-order variation. For the linear path n -> n(1 + eps l(n)) with unbounded negative l this is not the derivative in the space of tempered distributions (points can return to a bounded region for eps along a sequence tending to 0, giving difference quotients of size 1/eps). For a true generator deformation p -> p + eps c_p with abs(c_p) <= C p the deformed integers satisfy n_eps >= n^(1 - O(eps)) and dominated convergence applies, so the lemma is correct where it is used. The statement should restrict to that case or to bounded l. Masses are held fixed; that scope is stated.
5. **Lemma T and Theorem A are not in the relation "exactly and to first order" suggested in section 4.** Lemma T covers deformations of positions only, with all masses 1; Theorem A covers all positions with masses >= kappa. Neither implies the other; both are correct.
6. **Control table, NR row.** D(s) = 8w^2 + 4 sqrt2 w - 4 with w = cosh((s - 1/2) ln 2) is a product of two NR factors at q = 2, not a single factor 2 cosh + c. Still inside the NR row. Zero re-derived: u = 2^s solves u^4 + 2u^3 + 4u + 4 = 0, real root u = -2.4042, s = 1.26555 + i pi/ln 2.
7. **B3 attribution and status**: as in section 1; moot after Theorem C.
8. No use of RH, of verified zero height, or of any zero-location input was found. No PROVED step fails.

## 4. Numerical reruns (all via scripts/memcap.sh 8, .venv-arb python, mpmath 30 digits, scalars or a 18 x 400 matrix, under 5 s each)

- Tangent matrix, new size: 18 primes (p <= 61), adapted window, 400 points: smallest row-normalised singular value 4.68e-7; antisymmetry check 6.9e-32. Against the author's 1.82e-5 at 15 primes the factor is 0.295 per prime. "About 0.3 per prime" confirmed.
- Lemma T with a true generator deformation 3 -> 3 + eps (not the linearisation): defect/eps = -9.6964e-7, -9.70174e-7, -9.70175e-7 at x = 0.6 and -8.02286e-3, -8.02462e-3, -8.02462e-3 at x = 0.25 for eps = 1e-4, 1e-7, 1e-10. Nonzero and convergent first-order defect.
- New fake: 5 III_{(5/3)Z} + 3 III_{(3/5)Z}; theta defect 1.6e-30 and 0 at x = 0.31, 2.3; atom 8 at 0, least atom 3 at 3/5; atoms equal to 8 at 15 (and 0), lying on the group 15 Z as A2-A3 require.
- Theorem C identity (triangle against sinc^2): author's fake 16.0 = 16.0 with excess 5 over the atom at 0; new fake 10.4 = 10.4 with excess 2.4. The excess is the mass seen inside (-1,1), nonzero for every fake and zero for III_Z.

## 5. Controls (run by this referee)

| Control | Outcome |
|---|---|
| DH | a(n) = (1, 0.28407904, -0.28407904, -1, 0) mod 5; odd theta relation psi(x) = x^(-3/2) psi(1/x) holds to 2e-31 at x = 0.45 and 1.3. Measure is signed, odd, with no atom at 0: positivity fails, so A1 and Theorem C do not apply. |
| Backward heat | No atomic measure. The positive self-dual non-atomic model e^(-pi x^2) dx satisfies the pairing identity (0.683256649036 on both sides) and has mass in (-1,1): excluded by "purely atomic" in Theorem A and by the support hypothesis in Theorem C. |
| Sign twist | eps completely multiplicative with eps(2) = -1: theta defect -0.0262 and -1.7e-4 at x = 0.4, 0.8 (constant term 1); 0.361 and 0.0785 with constant term 1/3 (the value that would match the residue). No functional equation; S1 fails. |
| Signed measures | Signed eigenmeasures with large gaps exist (2104.06812): positivity of the Dirichlet coefficients is the essential input. |

The result is an identification theorem. "Fails for the controls" means each control violates a hypothesis; it is not a zeta-only mechanism for zeros.

## 6. Surviving claim

Positive tempered self-dual measures are kappa III_Z under either of two hypotheses: all atoms >= the atom at 0 and purely atomic (Theorem A), or no mass on (-1,1) minus {0} (Theorem C, referee). Hence a generalized Dirichlet series with nonnegative coefficients, frequencies >= 1 and zeta's exact functional equation (finite order, polar part kappa/s + kappa/(1-s)) is kappa zeta(s); a Beurling system with that functional equation is the primes, for any residue, without Meyer's theorem. Lemma T holds for generator deformations with abs(c_p) <= C p. Numerical statements confirmed. Novelty unverified; elementary. No zero-free bound, no statement about any zero.
