# REFEREE (controls and numerics): n1-beurling-rigidity

Date 2026-11-17. Adversarial pass, independent of REFEREE.md (read only after my own re-derivation). Claimed verdict: proved-new-result.

**Referee verdict.** Every step labelled PROVED was re-derived and holds. Theorem B stays conditional on the cited classical theorem (B3), as labelled. The label "new" is not established. Two scope statements are too wide. The measured singular value carries no arithmetic information (shown below with a non-arithmetic comparison family). Nothing assumes RH; nothing restates verified height; the statement has no height variable and gives no information about zeros.

## 1. Re-derivation of the PROVED steps

| Step | Outcome | What I checked |
|---|---|---|
| S1 | holds (classical) | pi^(-1/2) Gamma(1/2) = 1, so polar part kappa/s + kappa/(1-s) <=> atom kappa at 0. Hecke's equivalence needs absolute convergence in some half-plane and boundedness in vertical strips; finite order gives the latter by Phragmen-Lindelof (Gamma decay on Re s = c and, by FE, on Re s = 1-c). Both hypotheses are in the statement. |
| S2 | holds | Theta(x) ~ (kappa/2) x^(-1/2) as x -> 0 from the identity, so N(R) <= e^pi Theta(R^-2) = O(R): mu is tempered. x-derivatives at x = 1 give the pairing identity on t^(2k) e^(-pi t^2); finite combinations are the even Hermite functions, whose expansions converge in the Schwartz topology; mu and the Fourier transform are continuous there; odd tests pair to 0 on both sides. |
| S3 | holds | Test function phi(xi) = psi(R(xi - t)), phi^(x) = R^-1 psi^(x/R) e^(-2 pi i t x); abs(psi) <= psi(0) = 1 (psi positive definite), shrinking support, mu Radon => limit mu({t}). |
| A1 | holds | mu({t}) is real, equals lim M_R(cos 2 pi t x) <= lim M_R(1) = kappa. |
| A2-A3 | hold | abs(1 - e^(i(a+b))) <= abs(1 - e^(ia)) + abs(1 - e^(ib)), squared, gives the stated inequality with constant 2. |
| A4 | holds | Uses "purely atomic" (mu = kappa 1_S) and Radon (S locally finite). (kappa/c) III_{Z/c} = kappa III_{cZ} forces c = 1. |
| Corollary A | holds | 1 is in N with multiplicity >= 1, so the hypothesis "atoms >= kappa" is automatic at kappa = 1. Generators = primes by uniqueness of generalized Dirichlet series applied to log zeta_P = log zeta. |
| B1 | holds | Pair with g(x - t). |
| B2 | holds | The k+1 vectors k b + j(a - b) are distinct, value v^k. |
| B3 | NOT a PROVED step; not confirmed from a source | One fetch attempt (arXiv 1502.06283 abstract) does not contain the statement. Remark that weakens the dependence: after B2 the masses off 0 are 1, so sigma = mu - kappa delta_0 is the indicator comb of the set N u -N, with sigma^ = mu - kappa dx a measure of growth O(R). So only the unit-mass form of Meyer's theorem (as used by Kolountzakis-Lagarias for tilings of the line, with the one-dimensional reduction to arithmetic progressions up to a finite set) is needed, not the finite-set-of-masses form. Still quoted from memory. |
| B4 | holds given B3 | mu_fin^ analytic and atomic => 0. mu_C takes values in {0,1} off a finite set, hence everywhere by periodicity (weights w_j may be signed; the argument survives). a_C(k)/L_C in {0,1} for k != 0; L_C <= q_C; kappa = sum d_C >= r and kappa <= r; equality chain gives mu_C = III_Z; one class; kappa = 1. |
| 2.4, second lemma | holds | a^-1 <= kappa(1 - a^-1). |
| Lemma T | holds | Recomputed: 2 pi i omega^ = omega' - T_1 omega' = sum (w(n) - w(n-1)) delta'_n (index shifted by one relative to the text; immaterial); periodicity => constant b; xi delta'_n = n delta'_n - delta_n; delta_n terms force b = 0, then w = 0 directly. Scope: positions move, masses and the atom at 0 fixed, first order only. |

No PROVED step failed.

## 2. Errors and overstatements

1. **"new" is unsupported.** RESULT.md itself says novelty is unchecked. Three searches by me: (a) Kahane-Mandelbrojt 1958 already read the functional equation of a general Dirichlet series as a Fourier-pair (Poisson-type) identity, and Meyer's 2024 lecture poses exactly "mu^ = mu <=> zeta-type functional equation; which mu?" with that reference; (b) Baake-Spindeler-Strungaru classify Fourier eigenmeasures that are periodic or have uniformly discrete support; Lev-Olevskii cover positive measures with uniformly discrete support and discrete spectrum; (c) Hilberdink-Lapidus (math/0410270, section 3.2) discuss functional equations for Beurling zeta functions and do not state a rigidity theorem. I found no statement of Theorem A or Corollary A, and no evidence they are new beyond a short corollary: step A1-A3 is the equality case of abs(phi(t)) <= phi(0) for positive-definite phi. Correct label: **proved; novelty unverified; likely folklore-level.**
2. **Scope of "no Beurling control with FE" / "Row B cannot be upgraded to carry FE" / "no eighth control".** Proved only for zeta's exact data: gamma factor pi^(-s/2) Gamma(s/2), s -> 1-s, one simple pole, finite order, discrete system. Discrete Beurling systems with other functional equations exist (Dedekind zeta: norms of prime ideals with multiplicity; zeta(2s); zeta(s)^2). Whether a Beurling system with a degree >= 2 functional equation and off-line zeros exists is not addressed. Non-discrete (measure-valued) Beurling systems are outside the theorem: "purely atomic" is essential (item 3).
3. **"Purely atomic" is a necessary hypothesis and deserves a line.** mu = III_Z + c e^(-pi x^2) dx, c > 0, is positive, tempered, self-dual, has atom 1 at 0 and every atom equal to 1, and is not III_Z (checked: pairing defect 0.0 at x = 0.4, 1.9 with c = 0.7). So Theorem A fails without it. This is the correct reading of the HEAT row: the hypothesis that excludes non-Dirichlet objects is pure atomicity, not A2.
4. **MEASURED singular value is not evidence of anything arithmetic.** See 3.2: a family of pure dilates of one smooth function, sampled the same way, gives the same numbers to within a factor 1.4. RESULT.md says "conditioning"; that reading is confirmed, and the stronger statement is that the tangent-matrix test cannot distinguish the primes from any other 30 frequencies in the same range. The number 1.96e-12 depends on the window (3.42e-12 with lower end 1/(64 p_max^2)).
5. **DH row wording.** "(S3) holds" should read: DH gives an odd measure on Z/sqrt5 with psi(x) = x^(-3/2) psi(1/x); a Bohr formula holds for that eigen-relation. The failing hypothesis (positivity, atom at 0) is correctly named.
6. **B3 attribution**: the one-dimensional reduction (locally finite member of the coset ring = finite union of arithmetic progressions up to a finite set) is not Meyer's part. Not re-read.

## 3. Numerical reruns

All through `scripts/memcap.sh 8 python3.14 ...`, mpmath 1.4.1, 30 digits, planned allocation printed (largest: 35 x 400 mpf, about 3 MB), each run under one minute. Scripts kept outside the result directory (/tmp/n1ref), written independently of the author's (own truncation rule).

### 3.1 Tangent matrix, different cases

| Case | Smallest row-normalised singular value |
|---|---|
| 30 primes, 400 points, x in [1/(4*113^2), 1] (author's case, my code) | 1.95742e-12 (author: 1.9574208e-12) |
| 30 primes, 800 points, same window | 1.96164e-12 |
| 30 primes, 400 points, x in [1/(64*113^2), 1] | 3.4193e-12 |
| 35 primes (p <= 149), 400 points | 4.77233e-15 |
| 15 primes 53..113 only | 2.2208e-11 |

Ratio per added prime from 30 to 35: (4.77e-15 / 1.96e-12)^(1/5) = 0.30. "About 0.3 per prime" confirmed. The near-null direction lives on the large primes (last row), as stated. The 60-digit repeat was not rerun by me; agreement of two independent codes at 30 digits and the gap to 1e-30 make rounding an unlikely source.

### 3.2 Non-arithmetic comparison (new)

Same sampling, rows g_p(x) = G(p^2 x) - x^(-1/2) G(p^2/x), G(y) = y e^(-pi y) (one term, no valuation, no sum over multiples):

| Family | sigma_min |
|---|---|
| primes <= 113, single-term dilates | 2.65589e-12 (tangent matrix: 1.957e-12) |
| primes <= 71, single-term dilates | 1.20337e-7 (tangent matrix, REFEREE.md: 1.37e-7) |
| same tangent formula applied to the 30 consecutive integers 84..113 (not a Beurling system; frequencies more closely spaced) | 1.9e-32 (at the 30-digit rounding level; no conclusion beyond "closer spacing, worse conditioning") |

The decay is that of sampled dilates of one function; the arithmetic of v_p(n) contributes nothing visible.

### 3.3 Lemma T finite difference, different case

l(n) = v_3(n)/3 - 0.6 v_5(n)/5: defect/eps at x = 0.45: -5.05408e-5, -5.05614e-5, -5.05614e-5 (eps = 1e-4, 1e-7, 1e-10); at x = 1.3: 9.1081e-9, 9.1145e-9, 9.1145e-9. Nonzero stable first-order defect, as Lemma T requires.

### 3.4 Bohr means (Gaussian weight, R = 20, 60)

III_Z: 1.0 at t = 0, 1, 7; below 4e-32 at t = 0.5, 0.3183. Author's fake (atom 11 at 0): 11, 1, 3, 7, 11, 11 at t = 0, 1/4, 1/2, 2, 4, 8; 5e-13 at t = 0.3 (R = 60). Atoms equal to the atom at 0 lie on the group 4Z; all others are smaller. Consistent with A1-A3. Fake's algebra checked by hand: transforms of the four combs permute; D = 0 <=> 8w^2 + 4 sqrt2 w - 4 = 0, w = cosh((s - 1/2) ln 2); root w = -1.1441 gives Re s = 1/2 + acosh(1.1441)/ln 2 = 1.2655.

## 4. Controls run by the referee

The result claims an identification of zeta, not a zero mechanism, so a control "fails" by violating a hypothesis.

- **Davenport-Heilbronn.** a(n) mod 5 = (1, 0.28407904, -0.28407904, -1, 0). Odd theta sum a(n) n e^(-pi n^2 x/5): psi(x) - x^(-3/2) psi(1/x) = -3.0e-31, 9.9e-32, 2.5e-32 at x = 0.4, 1.7, 2.9. The even theta with these coefficients has defect 1.0096 and -0.4443 at x = 0.4, 1.7 (no even self-duality). Coefficients are signed (minimum -1) and there is no atom at 0: positivity of M_R (A1) and the hypothesis kappa > 0 both fail. Theorem does not apply. Consistent.
- **Backward heat.** Not a Dirichlet series with fixed frequencies; the measure is not purely atomic. The positive self-dual non-atomic example of item 2.3 shows this hypothesis is doing the excluding.
- **Sign twist.** Liouville twist: theta defect with constant term 1 is -0.0262947 (x = 0.4), -1.71536e-4 (x = 0.8); the constant that would cancel the defect is 0.954753 at x = 0.4 and 0.998547 at x = 0.8, so no kappa works. Completely multiplicative twist eps(2) = -1 only: -0.0262457, -1.71535e-4; same conclusion. No functional equation; S1 fails.
- **NR-type fake.** Verified in 3.4. It violates "every atom >= atom at 0", the hypothesis Theorem A needs.

No control satisfies the hypotheses and escapes the conclusion. No step is a zeta-only mechanism for zeros.

## 5. RH / verified height / known-theorem checks

- RH is not assumed anywhere. No finite certificate or height appears.
- Hamburger's theorem and the Kahane-Mandelbrojt Fourier-pair reading are presented as classical, correctly. Theorem A is not presented as a known theorem; it may be one.
- Bearing on zeros of zeta: none (RESULT.md says so).

## 6. Surviving claim

Theorem A, Corollary A and Lemma T are proved. Theorem B is proved relative to Meyer's theorem in its unit-mass form plus the one-dimensional arithmetic-progression reduction, neither re-read. The numerical statements are reproduced; the singular-value decay is a property of sampled dilates and carries no arithmetic content. Scope: discrete systems with zeta's exact functional equation, polar part and finite order. Verdict label should be "proved; novelty unverified; identification only".

Sources: [Kahane-Mandelbrojt 1958](https://www.numdam.org/item/ASENS_1958_3_75_1_57_0/); [Meyer, Crystalline measures and zeta functions (2024 lecture)](https://www.carmin.tv/en/video/crystalline-measures-and-zeta-functions); [Hilberdink-Lapidus, Beurling zeta functions, generalised primes, and fractal membranes](https://arxiv.org/abs/math/0410270); [Kurasov-Sarnak, Stable polynomials and crystalline measures](https://ar5iv.labs.arxiv.org/html/2004.05678); [Lenz-Strungaru, Note on the set of Bragg peaks with high intensity](https://roam.macewan.ca/items/e29f617c-9415-4cc2-ba81-648ca4f112ae/full); [Kolountzakis, Fourier pairs of discrete support with little structure](https://arxiv.org/abs/1502.06283).
