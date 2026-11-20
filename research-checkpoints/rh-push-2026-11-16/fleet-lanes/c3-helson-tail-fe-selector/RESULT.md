# c3-helson-tail-fe-selector: tail sets, the functional equation and the point chi = 1 on T^inf

Date: 2026-11-18. Kind: explore (STRATEGY lead 9). Nodes: multiplicative-twin-mt, bagchi-strong-recurrence, euler-fe-coupling-at-height, tinfty-flow-generator-spectrum, bohr-lift-symbol-carries-pole.
Labels: PROVED (argument in this note, same-agent check only), CLASSICAL (recalled, source not opened), MEASURED (float64, not interval arithmetic), OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction.** The three first lemmas hold (with one correction to the setup), the three candidate properties are classified, and none is new:

1. chi = 1 is itself in Helson's exceptional set E, because of the pole at s = 1. The set that matters is E_zero (continuation with a zero in Re s > 1/2). RH is the statement 1 not in E_zero.
2. E and E_zero are tail sets, flow invariant, invariant under a larger dense group H, Haar-null, dense, and **comeagre** (Prop. 1(e)): Helson's good set has full measure and is of first Baire category. No closed set, no G_delta, and no rotation-invariant class selects the good set or separates chi = 1.
3. The multiplicative twin lives on a product measure with prime drift a_p of size p^(beta_0 - 1). By Kakutani's dichotomy that measure is singular to Haar exactly when beta_0 > 1/2 (Lemma 3). Helson's abscissa 1/2 is the Kakutani threshold of the drift. zeta is the Dirac case a_p = 1.
4. The scoring line asks for a property that is tail-measurable and fails for finite modifications of zeta. These two demands exclude each other (Prop. 4). The zero set in Re s > 0 is a tail datum; the functional equation is a datum of one flow orbit (Hamburger). A proof that uses the functional equation must pass from a non-tail property to a tail conclusion.
5. Candidates. Bounded discrepancy sum chi(n) = cx + O(1): not tail (finite modification gives Omega(log x), proved), and by the Chudakov conjecture (Klurman, Klurman-Mangerel; recalled) it holds only at chi = 1: it names the point and carries no intermediate content. Cyclicity in H^2 of the Bohr lift: holds for every chi in T^inf (proved, elementary), so it is rotation invariant and blind. Genericity of the orbit for log|zeta_chi|: holds at chi = 1 unconditionally (Littlewood lemma plus a density estimate; Bohr-Jessen), and holds for Liouville and for the twin, which are in E_zero. The every-window forms of each (Mertens-type sum of mu chi; outer function in the half-plane; band-limited window mean) are each **equivalent** to the zero-free statement.
6. One exact identity came out of candidate 3 and was checked numerically to 7 digits (Prop. 6): for a window w whose Fourier transform is supported in (-log 2, log 2), the mean of log|F(sigma + it)| against w(t - T) equals an explicit sum over the zeros and poles to the right of sigma, with no prime term at all. It is height uniform and every-window, and it is an equivalence: Davenport-Heilbronn satisfies the same identity with its own zeros.

The decisive test did not find a statistic that separates E_zero from its complement and is not the zero-free statement. No pivot was made: the adjacent idea (use the drift a_p as the selector) is the prime number theorem with square-root error for the point chi = 1.

## 1. Plan and what is new against the sources

Sources read: BRIEF.md; OBSTRUCTION_MAP.md rows G14-G16, Q10, S4, Z17, F1 and the controls table; STRATEGY.md lead 9; c2-polydisc-leeyang-bound/RESULT.md (Thm. 2 rotation lemma, Prop. 4); formalization/rh-attempts/2026-11-01-r2-phase-alignment.md (Theorem MT statement); the five node records.

Recorded there: the rotation no-go for classes invariant under all torus rotations; Bohr equivalence at finite P; Theorem MT (existence of a twin with one planted zero); the l^1/l^2 thresholds of the prime chain.

Done here and not recorded there: the correction that chi = 1 is in E; the group H; the Baire-category statement; the Kakutani reading of Theorem MT and of the abscissa 1/2; the incompatibility of "tail" with "fails for finite modifications"; the classification of the three candidates; the band-limited window identity with its numerical check. All of it is elementary or classical. No novelty is claimed.

Notation. T^inf = completely multiplicative chi: N -> S^1 (a point is (chi(p))_p), Haar measure m. zeta_chi(s) = sum chi(n) n^-s = prod (1 - chi(p) p^-s)^-1 for Re s > 1. Flow: (T_tau chi)(n) = chi(n) n^(-i tau), so zeta_{T_tau chi}(s) = zeta_chi(s + i tau). G = {chi : sum_p chi(p) p^-s converges for Re s > 1/2}. E = {chi : zeta_chi has no zero-free holomorphic continuation to Re s > 1/2}. E_zero = {chi : zeta_chi continues meromorphically to Re s > 1/2 and has a zero there, or does not continue}. H_fin = chi supported on finitely many primes (chi(p) = 1 for all but finitely many p). H = {psi : sum_p |psi(p) - 1| p^-sigma < inf for every sigma > 1/2}.

Helson's theorem (CLASSICAL): m(G) = 1, and G is disjoint from E. (The proof is Kolmogorov's theorem for independent mean-zero variables with sum of variances sum p^(-2 sigma) < inf, plus log zeta_chi = sum chi(p) p^-s + a series absolutely convergent in Re s > 1/2.)

## 2. First lemmas

### Proposition 1 (structure of E). PROVED, with (b) CLASSICAL.
(a) E and E_zero are invariant under the flow and under multiplication by H; in particular under H_fin, so they are tail sets.
(b) m(E) = 0.
(c) E and E_zero are nonempty: chi = 1 is in E (pole at 1). Liouville is in E_zero unconditionally: zeta_lambda(s) = zeta(2s)/zeta(s) has a simple zero at s = 1. Every chi(n) = n^(-i tau) is in E.
(d) E, E_zero and their complements are dense.
(e) The complement of E is meagre. More: the set Z of chi for which zeta_chi continues holomorphically and zero-free to a neighbourhood of Re s >= 1 is meagre. So E is comeagre and null; G is of full measure and meagre.

Proof. (a) Flow: translation of s. For psi in H, zeta_{chi psi}(s)/zeta_chi(s) = prod_p (1 - chi(p) p^-s)/(1 - chi(p) psi(p) p^-s); the logarithm of the p-th factor is O(|psi(p) - 1| p^-sigma), so the product converges absolutely and locally uniformly in Re s > 1/2 to a holomorphic function without zeros. For psi in H_fin the ratio is a finite product, holomorphic without zeros in Re s > 0.
(b) Helson.
(c) Direct.
(d) A nonempty set invariant under H_fin meets every cylinder.
(e) Let chi be in Z. Then -zeta_chi'/zeta_chi = sum Lambda(n) chi(n) n^-s is holomorphic on a neighbourhood of Re s >= 1. For c = 1 and c = i the series sum Lambda(n)(1 + Re(c chi(n))) n^-s has nonnegative coefficients and is holomorphic on Re s >= 1 except for a simple pole at 1 with residue 1. Wiener-Ikehara (CLASSICAL) gives sum_{n<=x} Lambda(n) Re(c chi(n)) = o(x), hence sum_{p<=x} chi(p) = o(pi(x)). The set {chi : |sum_{p<=x} chi(p)| > pi(x)/2 for infinitely many x} is a countable intersection of open dense sets (given a cylinder fixing the primes below P, set chi(p) = 1 for P < p <= x with x large). So Z lies in the complement of a dense G_delta. QED.

Remark (tail invariance is a property of the unimodular family). A change at one prime moves no zero in Re s > 0 because |chi(p)| = 1 keeps every local factor zero-free there. The T-NR control changes one local factor to a non-unimodular one and leaves T^inf; that is the only way a one-prime change creates strip zeros.

### Lemma 2 (no closed or rotation-invariant selector). PROVED (Kronecker CLASSICAL).
(a) The orbit of chi = 1 is dense in T^inf (the log p are independent over Q; the product topology tests finitely many coordinates). The only closed flow-invariant set containing 1 is T^inf.
(b) A class invariant under all rotations and containing 1 is T^inf (this is c2-polydisc-leeyang-bound Thm. 2 at P = inf).
(c) By Prop. 1(d),(e): no open set, closed set or G_delta separates G from E or E_zero from its complement; a dense G_delta containing 1 exists (E is one) but it is on the wrong side.
(d) The flow on T^inf is uniquely ergodic (rotation of a compact group with a dense orbit), so every point, chi = 1 included, is generic for every continuous observable. Continuous observables do not see E.
Consequence: a selector must be a non-closed, non-rotation-invariant set. Measure-theoretically, by Kolmogorov's zero-one law every tail set has measure 0 or 1 under every product measure on T^inf, so tail selectors are exactly families of product measures that are mutually singular on the tail.

### Lemma 3 (which measure carries the twin; Kakutani). PROVED for 1/2 < beta_0 < 0.975 (Kakutani, Baker-Harman-Pintz prime gaps CLASSICAL).
Let A(x) = -int_2^x t^(beta_0 - 1) dt/log t. Choose real a_p in [-1/2, 1/2] adaptively (a_p = clip(A(p) - sum_{q<p} a_q)) and let nu_p be the measure on the circle with density 1 + 2 a_p cos(theta), mean a_p. Let mu = product of nu_p.
(i) mu-almost every chi has zeta_chi holomorphic in Re s > 1/2 with exactly one zero there, simple, at beta_0.
(ii) mu is singular to Haar measure. For any product measure with smooth marginals of mean a_p (densities 1 + 2 Re(conj(a_p) z)), the measure is equivalent to Haar iff sum |a_p|^2 < inf and singular otherwise.
(iii) A drift that creates a zero or pole at abscissa beta needs |sum_{p<=x} a_p| of order x^beta/log x, hence sum_{p<=x} |a_p|^2 >= x^(2 beta - 1)/log x by Cauchy-Schwarz. This diverges iff beta > 1/2. So zeros and poles in Re s > 1/2 can be planted only by measures singular to Haar, and the abscissa 1/2 in Helson's theorem is the threshold of Kakutani's dichotomy.

Proof. (i) The variables chi(p) - a_p are independent, bounded, mean zero, so sum (chi(p) - a_p) p^-s converges almost surely, locally uniformly in Re s > 1/2. The tracking error e(x) = sum_{p<=x} a_p - A(x) is bounded by the largest increment of A across a prime gap near x, which is at most x^(beta_0 - 1 + 0.525) for large x; partial summation gives sum a_p p^-s = int_2^inf t^-s dA(t) + (holomorphic in Re s > max(0, beta_0 - 0.475)), and int_2^inf t^-s dA = -E_1((s - beta_0) log 2) = log(s - beta_0) + entire. Hence log zeta_chi(s) = log(s - beta_0) + holomorphic in Re s > 1/2.
(ii) Hellinger affinity of nu_p with the uniform measure is int sqrt(1 + 2a cos) = 1 - a^2/4 + O(a^4); Kakutani: equivalence iff sum (1 - affinity) < inf. Here sum_{p<=x} a_p^2 >= A(x)^2/pi(x) -> inf. QED.

Measured (disc_test.py): tracking error 2.18 (beta_0 = 0.75) and 9.07 (beta_0 = 0.875) over p <= 1e6; sum a_p^2 = 281 and 4946.

Reconciliation with multiplicative-twin-mt. "Almost every realisation" in Theorem MT refers to a measure of this kind (a prescribed drift on the primes plus free residual randomness), not to Haar measure. Under Haar measure the twin has probability zero, in agreement with Helson. The family of drifts is the right coordinate: Haar is a = 0; the twin is a_p about -p^(beta_0 - 1); a pole at beta is a_p about +p^(beta - 1); chi = 1 is the degenerate case a_p = 1 with no residual randomness. For chi = 1 the question "is there a second singularity" is the question whether the deterministic sum sum_{p<=x} 1 - li(x) is O(x^(1/2 + eps)). The measure picture gives no handle on a Dirac mass.

### Proposition 4 (tail data against functional-equation data). PROVED (Hamburger CLASSICAL).
(a) If P is a tail property (H_fin-invariant) and P holds for chi = 1, then P holds for every finite modification of zeta. A property that fails for a finite modification is not a tail property.
(b) Within T^inf the functional equation of zeta type holds only on the flow orbit of 1 (Hamburger: a Dirichlet series with zeta's functional equation is a multiple of zeta). For chi = psi with psi in H_fin, psi not 1, zeta_psi = zeta R with R a finite ratio of Euler factors; R(s)/R(1 - s) has poles on Re s = 0 and Re s = 1 and the functional equation is lost, while every zero in Re s > 0 is kept.
(c) So the zero set in 0 < Re s < 1 is a function of the coset chi H (for Re s > 1/2) and the functional equation is a property of one orbit inside the coset 1 H. Every H-invariant, flow-invariant property containing 1 is implied by the functional equation only through the point; the smallest one is the coset Gamma 1 = {n^(-i tau) psi}, which is null, dense, and not rotation invariant. "Gamma 1 is disjoint from E_zero" is RH.
Consequence for the scoring line: "tail-measurable" and "provably fails for finite modifications" cannot both hold. Any use of the functional equation is a use of a non-tail property; the step from it to a tail conclusion is where a proof has to do its work. The finite-modification control is therefore a test of which kind of property an argument uses, not a control an argument must reject at the level of its conclusion.

## 3. The candidates

### Candidate 1: bounded discrepancy.
(1a) Exact form D: sum_{n<=x} chi(n) = c x + O(1), c != 0.
- Not a tail property. PROVED: for chi(2) = -1, chi(p) = 1 otherwise, chi(n) = (-1)^(v_2(n)), S(x) = #{odd n <= x} - S(x/2), so S(n) - n/3 = (1/2) sum_k (-1)^k b_k(n) + O(1) with b_k the binary digits of n; at n = sum_{j<J} 4^j this is J/2 + O(1). The discrepancy is Omega(log x). Measured: max |D| = 6.67 at x = 1e6, growing by about 0.67 per factor 3 to 10.
- Characterises the point (CLASSICAL, recalled, not opened: Chudakov's conjecture, proved by Klurman for c != 0 and Klurman-Mangerel in general; Tao's solution of the Erdos discrepancy problem for c = 0): a completely multiplicative unimodular chi with sum chi(n) = cx + O(1) is chi = 1. With main term c x^(1 - i tau) the same holds for the orbit.
- Content toward zeros: none on its own. D is equivalent to zeta_chi(s) - c s/(s - 1) = s int D(x) x^(-s-1) dx being holomorphic in Re s > 0 with bound |s|/sigma: continuation and convexity-type growth. Non-multiplicative control (PROVED): coefficients 1 + c (-1)^n have partial sums x + O(1) and Dirichlet series zeta(s)(1 - c(1 - 2^(1-s))), with zeros on Re s = 1 - log_2 |1 - 1/c|; for |1 - 1/c| = 2^(1/4) they lie on Re s = 3/4. DH has periodic coefficients of mean zero and bounded partial sums. So D excludes zeros only together with multiplicativity, and D plus multiplicativity is the single point chi = 1: the implication "D and multiplicative implies zero-free" is RH with no intermediate statement.
(1b) Weak form: discrepancy exponent theta(chi) = inf{theta : sum chi(n) = main + O(x^theta)}. This is tail and flow invariant. It measures the continuation of zeta_chi, not its zeros. Measured: zeta 0, finite modifications 0 (log growth), Liouville 0.54, twin 0.47 and 0.34, 200 Haar-random chi 0.49 +- 0.07. It does not separate the twin and Liouville (in E_zero) from random chi (not in E).
(1c) Mertens form: exponent of sum mu(n) chi(n). Equivalent to the zero-free statement (Littlewood's criterion, CLASSICAL). Measured: it is the one column that sorts the rows correctly (section 4).
Classification: (1a) names the point; (1b) continuation only; (1c) equivalent.

### Candidate 2: cyclicity and the outer property.
(2a) Cyclicity of the Bohr lift in H^2(T^inf). PROVED: for sigma > 1/2 and every chi, f = prod_p (1 - chi(p) p^-sigma z_p)^-1 is cyclic. With P_N = prod_{p<=N} (1 - chi(p) p^-sigma z_p) (a polynomial), ||P_N f - 1||^2 = prod_{p>N} (1 - p^(-2 sigma))^-1 - 1 -> 0. The rotation z_p -> chi(p) z_p is unitary and preserves polynomials. So cyclicity holds on all of T^inf, E_zero included: it is rotation invariant (Lemma 2(b)) and is the mean-value statement behind Helson's theorem.
(2b) Outer property of the single function (s - 1) zeta_chi(s)/s^2 (or without the pole factor) in the Hardy class of Re s > 1/2. This is tail invariant (finite Euler factors and their inverses are bounded in Re s >= 1/2, hence outer), flow invariant, not rotation invariant. It is equivalent to: no zeros and no singular inner factor, i.e. to the zero-free statement (for zeta this is the Balazard-Saias-Yor form, CLASSICAL).
Classification: (2a) mean value, blind; (2b) equivalent.

### Candidate 3: genericity of the orbit for log|zeta_chi|.
(3a) Long averages: (1/T) int_0^T log|zeta_chi(sigma + it)| dt -> int log|zeta_chi'(sigma)| dm = 0. By Littlewood's lemma the left side is (2 pi/T) sum_{beta > sigma, 0 < gamma < T} (beta - sigma) + O(log T/T). For chi = 1 it tends to 0 unconditionally (N(sigma, T) = O(T^(1 - c(sigma))), CLASSICAL). It also tends to 0 for Liouville (zeros of zeta(2s), poles at zeta's zeros: same density bound) and for the twin (one zero). Bohr-Jessen (CLASSICAL): the distribution of log zeta(sigma + it) equals the Haar distribution of log zeta_chi(sigma), unconditionally. So chi = 1 is generic for this observable whether or not RH holds. Density statement (MV-CAP).
(3b) Uniform window averages with a sharp or positive window: false for every chi at fixed window length (the finite stages come within any eps of the torus maximum, c2 Thm. 3), so it is not a candidate.
(3c) Band-limited windows. This is the exact every-window form.

### Proposition 6 (band-gap identity). PROVED for F of finite order in vertical strips with a Dirichlet series log F = sum_{n>=2} c_n n^-s in some half-plane; constants MEASURED to 7 digits.
Let w be real, even, with Fourier transform supported in [-delta, delta], delta < log 2, and decaying fast enough on horizontal lines (here w^(xi) = (1 - (xi/delta)^2)^8). Let F be meromorphic in Re s > sigma_0. For sigma > sigma_0 with no zero or pole on Re s = sigma and every real T:

  J_sigma(T) := int w(t - T) log|F(sigma + it)| dt = pi sum_rho m_rho int_{-(beta_rho - sigma)}^{beta_rho - sigma} w(gamma_rho - T + iy) dy,

the sum over zeros (m_rho > 0) and poles (m_rho < 0) rho = beta_rho + i gamma_rho with beta_rho > sigma. There is no prime term.

Proof. V(s) = int w^(xi) e^(-i xi (t - T)) sinh(xi(Re s - sigma))/xi d xi is harmonic, vanishes on Re s = sigma, has normal derivative 2 pi w(t - T) there, and its t-spectrum lies in [-delta, delta]. Green's second identity for u = log|F| and V on [sigma, sigma_2] x [-R, R]: the horizontal sides vanish as R -> inf along a suitable sequence (finite order, decay of V); on Re s = sigma_2 in the half-plane of absolute convergence u has t-spectrum in {+-log n, n >= 2}, disjoint from [-delta, delta], so that side contributes 0; the interior term is 2 pi sum m_rho V(rho) since Delta u = 2 pi sum m_rho delta_rho. Writing sinh(xi a)/xi = (1/2) int_{-a}^{a} e^(xi y) dy gives the stated form. QED.

Corollary (criterion). F has no zero in Re s > sigma iff J_sigma'(T) equals the pole term for all sigma' > sigma, all T and all such w. (If: the positive measure sum delta_rho on Re s > sigma has vanishing t-Fourier transform on (-delta, delta); test with phi(beta) |w(gamma - T)|^2, phi >= 0, w of band delta/2.) Equivalently: RH iff for every sigma > 1/2 the function t -> log|zeta(sigma + it)| minus its pole term has no spectrum in (-log 2, log 2).

Reading against the requirements. The criterion is uniform in height and holds in every window (the weight of a zero at distance d from T is w(d), not an average). It is an equivalence, not a conclusion. The Euler product enters only through "log F is a Dirichlet series over n >= 2", which holds for any Dirichlet series with a_1 = 1 in its zero-free half-plane; DH satisfies the identity with its own off-line zeros (measured below). So multiplicativity is not used and the identity cannot separate. With multiplicativity the spectrum of log|zeta_chi(sigma + i t)| on a zero-free half-plane lies in {+-k log p}; that statement holds for every chi in G and is rotation invariant.

## 4. Decisive test. MEASURED.

All runs local through scripts/memcap.sh 8 with .venv-arb/bin/python; the server was not used. Files: disc_test.py, disc_test.log, disc_test.json (12 s); window_test.py, window_test.log, window_test.json (77 s).

### Test A: partial sums to N = 1e6 (all primes P <= 1e6), 206 points of T^inf.
D(x) = sum_{n<=x} chi(n) - c x with c the residue; M(x) = sum_{n<=x} mu(n) chi(n). "exp" = log ratio of the rms over (5e5, 1e6] to the rms over (500, 1000], divided by log 1000 (a crude two-point exponent).

| chi | in E_zero | max abs D, x <= 1e6 | exp D | max abs M, x <= 1e6 | exp M |
|---|---|---|---|---|---|
| 1 (zeta) | open | 0 at integers (fractional part) | 0 | 368 | 0.52 |
| chi(2) = -1 (finite modification) | same as zeta | 6.67 (log growth) | 0.05 | 390 | 0.22 |
| chi(2) = i, chi(3) = -1 (finite modification) | same as zeta | 13.7 (log growth) | 0.08 | 652 | 0.26 |
| Liouville | yes (zero at 1) | 1250 | 0.54 | 6.08e5 | 1.00 |
| twin, beta_0 = 0.75 | yes | 1030 | 0.47 | 2.63e4 | 0.75 |
| twin, beta_0 = 0.875 | yes | 533 | 0.34 | 1.01e5 | 0.88 |
| 200 Haar-random | no (a.e.) | mean 965, range 397 to 6267 | 0.49 +- 0.07 (0.25 to 0.68) | mean 821, range 270 to 3060 | 0.49 +- 0.08 (0.25 to 0.72) |

Readings.
- Bounded discrepancy separates chi = 1 from everything, including its own finite modifications (6.67, 13.7 with logarithmic growth), which have the same strip zeros. It tracks the pole and the exact point, not the zeros.
- The exponent of D does not separate the twins and Liouville (in E_zero) from the random chi (not in E): 0.34 to 0.54 against 0.49 +- 0.07.
- The exponent of M sorts all rows by the largest real part of a zero (1.00, 0.88, 0.75, then about 1/2). It is the zero-free statement. At N = 1e6 the two-point exponent of the finite modifications (0.22, 0.26) is depressed by a large early value; their max abs M (390, 652) is of the size sqrt(N).
- No statistic in the table is both correct on E_zero and different from the zero-free statement.

### Test B: band-limited window mean (Prop. 6), delta = 0.6, window grid half-length 120, step 0.01.
Evaluators checked against mpmath (zeta at 0.6 + 1e5 i: difference 3e-11; DH at 0.7 + 50i: 3e-15).

zeta and the finite modification zeta(s)(1 - 2^-s)/(1 + 2^-s):

| sigma | T | J (zeta) | J (finite modification) | predicted (pole term only) |
|---|---|---|---|---|
| 0.60 | 10 | -5.310e-2 | -5.310e-2 | -5.310e-2 |
| 0.75 | 10 | -3.320e-2 | -3.320e-2 | -3.320e-2 |
| 0.60 | 20 | -6.129e-4 | -6.129e-4 | -6.129e-4 |
| 0.75 | 20 | -3.872e-4 | -3.872e-4 | -3.872e-4 |
| 0.60, 0.75, 1.20 | 1e3 | abs < 6e-11 | abs < 9e-11 | abs < 1e-15 |
| 0.60, 0.75, 1.20 | 1e4 | abs < 8e-11 | abs < 8e-11 | (see note) |
| 0.60, 0.75, 1.20 | 1e5 | abs < 6e-11 | abs < 1e-11 | (see note) |

Note: at T >= 1e4 the log prints a "pred" of order 1e-2; that is aliasing in the 240-node quadrature for w(T + iy) at large T (not used in J, where the argument of w is at most 120). The true pole term there is below 1e-20 by the decay of w. The mean of abs log|zeta| over the same windows is 0.54 to 0.72, so the cancellation to 1e-10 is 10 digits; the residual 1e-10 is the truncation of the window at +-120.

Davenport-Heilbronn (zeros with Re s > 1/2 found in 0 < t < 215, Re s < 3: 0.808517 + 85.699348i, 0.650830 + 114.163343i, 0.574356 + 166.479306i, 0.724258 + 176.702461i, and conjugates):

| sigma | T | J (measured) | predicted from the zero list |
|---|---|---|---|
| 0.60 | 85.699 | +7.496299e-2 | +7.496299e-2 |
| 0.75 | 85.699 | +2.103400e-2 | +2.103400e-2 |
| 0.85 | 85.699 | +4.4e-11 | 0 |
| 0.60 | 100 | +1.069111e-2 | +1.069111e-2 |
| 0.75 | 100 | +2.390447e-3 | +2.390447e-3 |
| 0.60 | 114.163 | +1.827917e-2 | +1.827917e-2 |
| 0.75 | 114.163 | +2.325084e-6 | +2.325042e-6 |
| 0.60 | 60 | -4.929665e-5 | -4.929668e-5 |
| 0.60 | 140 | -1.221834e-5 | -1.221807e-5 |

Readings. The identity holds to 7 digits where the value is not small. The window mean at sigma detects exactly the zeros to the right of sigma (0.85 > 0.8085 gives 0). The finite modification of zeta gives the same J as zeta at every row: the band gap is a tail property, as Prop. 1(a) requires. The statistic costs the same as locating the zeros.

## 5. Controls

| Control | Position in this picture | Outcome |
|---|---|---|
| U / multiplicative twin | point of T^inf in E_zero, typical for a drifted product measure singular to Haar (Lemma 3) | passes candidates 1b, 2a, 3a (they are blind); detected only by 1c, 2b, 3c, which are the zero-free statement |
| Liouville (stands in for RZ_b = 1/zeta in its own coordinate, which is mu and not completely multiplicative unimodular) | in E_zero unconditionally (zero at 1) | same as U |
| Finite modification of zeta (new control) | same coset 1 H_fin, same strip zeros, no functional equation | passes every tail property that zeta passes (Prop. 4(a)); fails exact bounded discrepancy with Omega(log x) (proved; measured 6.67, 13.7) |
| DH | not in T^inf | has bounded partial sums; satisfies the band-gap identity with its own zeros; H^2 cyclicity of the lift is not defined for it as a product |
| Window translate | the flow | every property considered is flow invariant; chi = n^(-i tau) has main term c x^(1 - i tau) |
| Unimodular twist | a rotation of T^inf | all rotation-invariant properties (2a, prime-power spectrum) are blind by Lemma 2(b) |
| T-NR | leaves T^inf (one non-unimodular local factor) | shows tail invariance of the zero set needs unimodular local factors (Remark after Prop. 1) |
| Beurling, backward heat, zeta(s+a)zeta(s-a), phase-rotated transfer operator, theta^w | not run | zeta(s+a)zeta(s-a) would enter Prop. 6 through its poles at 1 +- a and zeros at 1/2 +- a + i gamma |

R3 as posed ("a candidate provably fails for U and for finite modifications"): the only candidate that fails for finite modifications is exact bounded discrepancy; it also fails for U; but it holds only at chi = 1 and is not a tail property, and no implication from it to zero-freeness is available other than RH itself. Not scored.

## 6. Requirement flags

- R1 (all primes together, multiplicativity essential): **false** as a property of an attack. The structural lemmas use complete multiplicativity and unimodularity (tail invariance of the zero set, Kakutani threshold), but the one every-window criterion (Prop. 6) holds for any Dirichlet series with a_1 = 1 and is satisfied by DH.
- R2 (height uniform, every window): **false** as a conclusion. Prop. 6 has that form (verified at T up to 1e5) but is an equivalence with the zero-free statement; nothing is concluded.
- R3 (fails for every control for a structural reason): **false**. Candidates 1b, 2a, 3a pass U; candidate 1a is the point itself; the "tail and fails for finite modifications" target is contradictory (Prop. 4).
- R4 (passage to the critical line / from almost every chi to chi = 1): **false**. chi = 1 lies in E; E is comeagre; the good set is selected by no closed or G_delta condition; the measure that carries chi = 1 is a Dirac mass, singular to Haar at the maximal rate sum_{p<=x} |a_p|^2 = pi(x).

## 7. Three weakest steps

1. Candidate 1a rests on a recalled theorem (Chudakov's conjecture: Klurman for c != 0, Klurman-Mangerel in general) whose exact hypotheses were not opened. Only the special case chi(2) = -1 is proved here. If the theorem needs more than stated, the claim "D holds only at chi = 1" weakens to "D is not a tail property", which is enough for Prop. 4 but not for the sentence "it names the point".
2. Lemma 3(i) and Prop. 1(e) are same-agent proofs. Lemma 3 uses an adaptive drift, the gap bound p^0.525 and almost-sure locally uniform convergence of a random Dirichlet series; the range is restricted to beta_0 < 0.975 and the corpus Theorem MT (stated for beta_0 <= 7/8) was read only in summary, so the identification of its measure with this one is by construction type, not by a line-by-line comparison. Prop. 1(e) uses Wiener-Ikehara for a series with a pole of residue 1 and assumes continuation to a neighbourhood of the closed half-plane.
3. Prop. 6 is proved under finite order in strips and for the specific window class; the horizontal-side limit is the standard Littlewood-lemma step and is not written out. For a general chi in T^inf the growth of zeta_chi in the strip is not known, so the identity is established for zeta, finite modifications, DH and similar functions, not for almost every chi. The numerical check is float64 with window truncation at +-120 (residual 1e-10) and a zero list for DH found by grid search in a bounded box (zeros with Re s >= 3 or t > 215 are not included; their weight at T <= 140 is below 1e-10 by the decay of w).

## 8. What a continuation would need

The picture isolates one statement that is not a restatement: chi = 1 is the unique point of T^inf with bounded discrepancy, and bounded discrepancy is a non-tail consequence of the functional equation's source (the lattice Z). A useful next lemma would be an implication from a quantitative non-tail property to a tail property that is strictly weaker than zero-freeness, for example: "sum_{n<=x} chi(n) = cx + O(x^theta) for a completely multiplicative unimodular chi forces zeta_chi to have no zero in Re s > f(theta)" with f(0) < 1. For theta = 0 this is a statement about zeta alone; the test of whether it has content is whether it can be proved for the finite modifications (discrepancy O(log x)) by a method that does not go through zeta. No such method was found here; the finite modification is the cheapest control for any proposal of this kind.
