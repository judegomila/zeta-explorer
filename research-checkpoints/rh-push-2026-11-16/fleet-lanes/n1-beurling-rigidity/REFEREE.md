# REFEREE: n1-beurling-rigidity

Referee pass of 2026-11-17 (internal, adversarial). Claimed verdict: proved-new-result.
Referee verdict: **the PROVED steps hold; "new" is not established; two scope statements are too wide.** No step assumes RH or uses verified height. The result identifies zeta and says nothing about zeros, as RESULT.md itself states.

## 1. Re-derivation of each PROVED step

| Step | Outcome | Notes |
|---|---|---|
| S1 (FE <=> theta identity) | confirmed, classical | Normalisation checked: pi^(-1/2) Gamma(1/2) = 1, so the polar part kappa/s + kappa/(1-s) corresponds to atom kappa at 0. Needs zeta_P convergent in some half-plane and finite order (both stated or implicit). |
| S2 (theta identity => mu^ = mu) | confirmed | x-derivatives at x = 1 give <mu, h> = <mu, h^> for h = t^(2k) e^(-pi t^2), i.e. all even Hermite functions; these are dense in even Schwartz space; odd test functions pair to 0 with the even mu on both sides. Temperedness from Theta(x) = x^(-1/2)(kappa/2 + Theta(1/x)) - kappa/2. |
| S3 (Bohr coefficient formula) | confirmed | abs(psi) <= psi(0) = 1 because psi = eta * eta~ is positive definite; dominated convergence needs only that mu is Radon. |
| A1 | confirmed | M_R(cos) <= M_R(1) for each R; both limits exist by S3. |
| A2, A3 | confirmed | 1 - cos(a+b) <= 2(1 - cos a) + 2(1 - cos b) follows from the triangle inequality for abs(1 - e^(ia)) and (x+y)^2 <= 2x^2 + 2y^2. |
| A4 | confirmed | Locally finite subgroup of R is cZ; FT of kappa III_{cZ} is (kappa/c) III_{Z/c}; c = 1. |
| Corollary A | confirmed | Also for real m_n >= kappa and arbitrary lambda_n. |
| B1 | confirmed | |
| B2 | confirmed | j a + (k-j) b = k b + j(a-b) are k+1 distinct vectors of value v^k. Covers a repeated generator. |
| B3 | not re-read by the referee either | The referee's independent recollection of Meyer's theorem (finite set of masses, locally finite support, abs(mu^)(B_R) = O(R^n) => each level set is in the coset ring of the discrete group) agrees with the statement used. The one-dimensional reduction "locally finite element of the coset ring = finite union of arithmetic progressions up to a finite set" is, to my recollection, due to Rosenthal (1966) and is how Kolountzakis-Lagarias use it; RESULT.md attributes both parts to Meyer. Neither source was opened. Theorem B stays "PROVED relative to B3". |
| B4 | confirmed | Checked each link: mu_fin = 0; unit masses on each coset of a class by periodicity; a_C(k)/L_C in {0,1} for k != 0 because the dual lattices of incommensurable classes meet only at 0; L_C <= q_C; kappa = sum d_C >= r and kappa <= r; a_C vanishes off hZ; mu_C = III_Z; r = 1. |
| Section 2.4, second lemma | confirmed | rho = FT of (mu - D_a mu) >= 0 is positive definite; abs(rho({1/a})) = 1/a <= kappa(1 - 1/a) gives a >= 1 + 1/kappa. |
| Lemma T | confirmed, with one small gap closed | The lemma fixes the atom at 0. If kappa is also varied (extra term c delta_0, transform c dx), subtracting the unit translate leaves c(delta_{-1} - delta_0) on the right, which is not 1-periodic, so c = 0 and the lemma is unchanged. Masses are held fixed; that is the stated scope. |

## 2. Errors and overstatements

1. **Verdict label.** "proved-new-result" is not supported. RESULT.md itself says novelty is unchecked. Theorem A is the equality case of abs(phi(t)) <= phi(0) for positive-definite phi, applied to atoms: the set of atoms of maximal mass of a positive measure with positive transform is a group. That fact is standard (it is the "Bragg peaks of full intensity form a group" statement of diffraction theory). Two literature searches by the referee found the Meyer / Lev-Olevskii / Kurasov-Sarnak classification results and the Hamburger / Bochner-Chandrasekharan / Knopp converse theorems, and no statement of Theorem A or Corollary A in this form; they also found nothing that would make it new beyond a short corollary. Correct label: **proved; novelty unverified; elementary corollary of standard facts.**
2. **Scope of "no Beurling control with FE" (sections 0 and 4).** Proved only for zeta's own functional equation: gamma factor pi^(-s/2) Gamma(s/2), s -> 1-s, conductor 1, one simple pole, finite order. Beurling systems with other functional equations exist: Dedekind zeta functions (generators = norms of prime ideals, with multiplicity), zeta(s)^2 (each prime twice; double pole), zeta(2s) (generators p^2). None of these is a known counterexample to a Riemann hypothesis, so they are not controls, but the sentences "Row B cannot be upgraded to carry FE" and "there is no eighth control of this kind" must carry the qualifier "with zeta's exact gamma factor, conductor and polar part". Whether a Beurling system with a degree >= 2 functional equation and off-line zeros exists is not addressed.
3. **Control table, DH row.** "(S3) holds" is loose: for DH the measure is odd, supported on Z/sqrt 5, with mu^ = (unimodular constant) mu, so S3 holds in a modified form. The conclusion of the row (no positivity, no atom at 0) is correct.
4. **B3 attribution** as in the table above.
5. No other error found.

## 3. Numerical reruns (all through scripts/memcap.sh 8, mpmath 30 digits, each a few seconds, a few MB)

Different cases from the author's:

- Tangent matrix at other sizes (author's `rigidity_svd.py`, adapted window): smallest row-normalised singular value 1.37e-7 at 20 primes (p <= 71) and 5.61e-10 at 25 primes (p <= 97). With the author's 1.82e-5 (15) and 1.96e-12 (30) the ratio per added prime is 0.375, 0.33, 0.32. The "about 0.3 per prime" statement is confirmed.
- Lemma T finite difference, l(n) = v_2(n)/2, x = 0.6: defect/eps = -0.0080118, -0.0080146, -0.0080147 at eps = 1e-4, 1e-6, 1e-8. Nonzero first-order defect, as the lemma requires.
- Bohr means (Fejer weight) on III_Z: 0.9975 (truncation of the weight at 40R) at t = 0, 1, 3; 5e-11 to 7e-16 at t = 1/2; 3e-8 to 9e-12 at t = 0.3183. On the author's fake the means reproduce the masses 11, 1, 3, 7, 11 at t = 0, 1/4, 1/2, 2, 4 in the same proportion, and the atoms equal to the atom at 0 lie on the group 4Z, consistent with A2-A3.
- Two further fakes: 9 III_{3Z} + 3 III_{Z/3} (atom 12 at 0, least atom 3) and 2 III_{sqrt2 Z} + sqrt2 III_{Z/sqrt2} (atom 2 + sqrt 2 at 0, least atom sqrt 2): theta defects <= 3.2e-30. Both have atoms below the atom at 0, as Theorem A requires of any fake.
- The author's fake was also checked by hand: transforms of the four combs permute correctly, D(1) = 11, and D = 0 reduces to 8w^2 + 4 sqrt2 w - 4 = 0 with w = cosh((s - 1/2) ln 2); the root w = -1.1441 gives the stated zero.

## 4. Controls run by the referee

- DH: a(n) = (1, 0.284079, -0.284079, -1, 0) mod 5; odd theta sum a(n) n e^(-pi n^2 x/5) satisfies psi(x) = x^(-3/2) psi(1/x) to 3e-31 at x = 0.4 and 1.7. The measure is signed and has no atom at 0, so A1 (positivity of M_R) is the failing step, and with kappa = 0 the hypothesis "every atom >= kappa > 0" is void. The theorem does not apply to DH; consistent.
- Backward heat: no fixed-frequency Dirichlet series, so the measure is not purely atomic. The simplest analogue, e^(-pi x^2) dx, is positive and self-dual with no atoms; "purely atomic" is the hypothesis that excludes it.
- Sign twist (Liouville): theta defect -0.0263 at x = 0.4 and -1.7e-4 at x = 0.8 with constant term 1 (0.555 and 0.118 with constant term 0). No functional equation; S1 fails.

The statement is an identification theorem, so "fails for the controls" means only that the controls violate a hypothesis. It is not a zeta-only mechanism for zeros.

## 5. Surviving claim

Theorem A, Corollary A, Lemma T: proved. Theorem B: proved relative to Meyer's theorem plus the one-dimensional coset-ring reduction, both quoted from memory by author and referee. Numerical statements: confirmed. Scope: zeta's exact functional equation only. Novelty: unverified. Bearing on zeros of zeta: none.
