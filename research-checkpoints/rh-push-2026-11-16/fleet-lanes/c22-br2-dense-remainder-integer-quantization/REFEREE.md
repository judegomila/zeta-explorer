# REFEREE.md: c22-br2-dense-remainder-integer-quantization

**Status of this file: author's adversarial pass, not an independent referee.** The lane had no means to
start a separate referee process. An independent pass is owed; referees = 0 stands. Contents: re-derivations
by a second route, a second implementation of the numerics (`referee_check.py`, mpmath, no shared code),
corrections the pass forced on RESULT.md, and the points an independent referee should attack first.

## 1. Re-derivations

1. Lemma Q (d), identity. Checked on one lattice by direct computation: with phi = theta - lambda t,
   (lambda/X) sum over m of w(m lambda/X) e^(i m phi) is the Poisson dual of sum over j of w^(X (phi + 2 pi j)/lambda), and
   (phi + 2 pi j)/lambda = p_j - t. For a single factor the "meromorphic side" of (d) is the same sum (order 1 at
   each p in L_k): the two sides coincide for finite products, as they must; the content of (d) is only in
   the infinite tail (same remark as item 4 of the c21 referee file).
2. Lemma Q (d), pole term. (1/2 pi i) int over Re u = c of W_X(u)/(u - i s) du with W_X(u) = int w(x) e^(u X x) dx:
   insert the definition and integrate in u first: (1/2 pi i) int e^(u X x)/(u - i s) du = e^(i s X x) for x > 0
   (inverse Laplace transform of 1/(u - i s)). Result int w(x) e^(i s X x) dx = w^(X s). Agrees.
3. Theorem E (a), constant, by a second route without eta. At t = 2 pi a/b the factors with b | k give
   sum over m of log(1 - e^(-b m delta)) = -pi^2/(6 b delta) + O(log(1/delta)). The factors with k = r mod b, r != 0, give,
   with zeta_b = e^(-2 pi i a/b), a Riemann sum of spacing b: (1/(b delta)) int_0^inf log abs(1 - zeta_b^r e^(-u)) du + O(1)
   = -(1/(b delta)) Re Li_2(zeta_b^r) + O(1). By the distribution relation sum over all r mod b of Li_2(zeta_b^r) = Li_2(1)/b,
   the sum over r != 0 is -(1/(b delta)) (pi^2/6)(1/b - 1) = +(pi^2/(6 b delta))(1 - 1/b). Total:
   -pi^2/(6 b delta) + (pi^2/(6 b delta))(1 - 1/b) = -pi^2/(6 b^2 delta). Agrees with the modular computation. The
   resonant factors alone would give -pi^2/(6 b delta); the non-resonant ones return the fraction 1 - 1/b of
   it. Measured: -1.000000 in the normalised form at j = 40 and 60, 25 heights.
4. Theorem E (a), size of log abs rho. For b = 1 the proof bounds it by C log^2(1/delta); the leading term can
   be computed: the factors with eps_k abs z > k delta contribute about log(eps_k t/(k delta)) each, and with
   eps_k of order k e^(-k) this sums to about log^2(1/delta)/2. Measured at t = 2 pi: 96.6, 387.5, 860.6 at
   j = 20, 40, 60 against log^2(1/delta)/2 = 96, 384, 865; for b = 2 half of that (40.8, 176.1, 402.4). So the
   O(log^2) term of Theorem E (a) is of exact order log^2 and positive: the decay -pi^2/(6 b^2 delta) is not
   affected.
5. Theorem E (b), exponent. abs(eta)^4 Im tau invariant gives log abs eta = -(1/4) log Im tau + (1/4) log(abs(eta(tau'))^4 Im tau')
   with tau' the reduced point. For the golden mean the reduced point moves on a closed geodesic and the
   second term is log-periodic in delta with small amplitude: measured 0.2275 to 0.2277 over 52 octaves.
   Agrees. The bound Im tau' <= 1/(2 kappa): for the row (q, -p), (q x - p)^2 + q^2 y^2 >= 2 abs(q x - p) q y >= 2 kappa y.
   Checked.
6. Lemma X, the count. mu_l delta < 1 and mu_l >= e^(l^2) give l^2 < log(1/delta). Quotient for a good l:
   2/((2/pi) l^-2) = pi l^2. Product over l <= n: pi^n (n!)^2, logarithm at most n log pi + 2 n log n
   <= sqrt(L)(log pi + log L). Checked. The event "finitely many bad l" is taken for each of countably many
   pairs (I, i) after conditioning on theta; Fubini gives a null set in the pair (theta, theta'). Checked.
7. Theorem R, the Fubini step without measurability of B_D: B_D x B_D inside Z, Z Borel null. If x in B_D has
   a null section Z_x then B_D is inside Z_x; otherwise B_D is inside {x: Z_x not null}, which is null.
   Checked. Note that this argument gives "B_D is contained in a null set", not "B_D is measurable".
8. Theorem T, the conformal factor. abs tan(a + ib)^2 = (cosh 2b - cos 2a)/(cosh 2b + cos 2a). At a = +-pi/4 it
   is 1; it is at least tan^2 a; 1 - abs tan^2 = 2 cos 2a/(cosh 2b + cos 2a) <= 4 e^(-2 abs b). With a = pi u/(4d),
   b = pi v/(4d). A first draft used tanh(pi w/(4d)), which is not unimodular on the edges; corrected (C2).
9. Theorem T, Kronecker step on a finite stage (`referee_check.log` item 3): four primes 3, 7, 19, 53,
   delta = 0.02, heights 1 to 20000 in steps of 0.01: scan maximum 14.434 against prod (1 + e^(-lambda delta)) = 14.505;
   scan minimum 1.86e-5 against prod (1 - e^(-lambda delta)) = 3.62e-6 (the infimum is approached slowly: four
   phases within delta lambda of 0 simultaneously).

10. Proposition PC. log f = -sum over k, n of eps_k^n w^(kn)/n, so w f'/f = -sum over m of w^m sum over k | m of k eps_k^(m/k).
    For a rational f = c prod (w - rho)^(m_rho) with f(0) = 1: w f'/f = -sum over rho of m_rho sum over m >= 1 of (w/rho)^m. So
    c_m = sum m_rho rho^-m, bounded when all abs rho >= 1. c_p = eps_1^p + p eps_p. Checked. CYC in this language:
    index set {2^j}, c_(2^j) = -2^j + sum over i < j of 2^i = -1, bounded, and the product is rational: consistent.
    The Polya-Carlson theorem is recalled, not opened.

11. Theorem E2. Known special cases: phases + (beta_2 = B_2(0) = 1/6: Theorem E (a)); all signs minus
    (beta_2 = B_2(1/2) = -1/12: log prod (1 + e^(-k delta)) = pi^2/(12 delta) + O(1), the classical asymptotic of the
    generating function of partitions into distinct parts); d-th roots of unity in turn (mean of B_2(j/d) over
    j = 1/(6 d^2) by the distribution relation: 1/54 for d = 3). Signs with mean m: ((1 + m)/2)(1/6) + ((1 - m)/2)(-1/12)
    = (1 + 3m)/24. All agree with `periodic_check.log` to 5 or 6 digits at j = 20 for b <= 13 (4 digits at
    b = 49, where the remainder O(log^2) is relatively larger). The condition b = 1 mod d is used only to
    replace c_r^(bl) by c_r^l; the condition gcd(b, M) = 1 only for the factorisation of the character sum.
12. Proposition E3. Hurwitz value zeta(0, x) = 1/2 - x. Pattern +,-,- with the + class at k = 1 mod 3: e_0 = 1/6.
    Measured y at t = 0: -1.65, -2.11, -2.57 at j = 12, 16, 20; differences -0.46 and -0.46 against
    (1/6) 4 log 2 = 0.462. The limit of log abs rho at t = 0: the map delta -> (1 - e^(-a delta))/(1 - e^(-b delta)) is monotone
    between a/b (delta -> 0) and 1; checked for a > b and a < b.
13. Lemma TR. The bound uses only abs c_k = 1 and 1 - e^(-x) >= min(x, 1)/2. For beta < 1 the number of indices
    with k^beta <= K_delta is K_delta^(1/beta), which gives the exponent 1 + 1/beta. Measured at beta = 1: log abs rho is
    of exact order log^2 at rational heights (item 4), so the lemma is sharp there up to the constant.

## 2. Numeric cross-checks (second implementation)

`referee_check.py` (mpmath; own Miller-Rabin; own nearest-prime search):
1. beta = 1, phases +: direct product with 60 * 2^j factors (no eta function) at j = 10 and 12, seven heights
   (two pole points, three rationals, two generic): agreement with `out/eta_b1_plus.json` to all 10 printed
   decimals in all 14 cells (values from -6697.4475889839 to 1.7557045353).
2. Lemma X: abs Xi(delta + i p_i) at zero points of factors 2, 3, 4 of a 7-factor super-sparse product
   (mu_i = log of the prime nearest e^(i^2)): log abs Xi = -43.08, -35.87, -29.98 at j = 60, exponents 1.04, 0.86,
   0.72 increasing towards 1. Consistent with the bound delta^(1 - o(1)).
3. Kronecker step: item 9 above.
4. CYC finite identity (1 - w) prod over k < 70 of (1 + w^(2^k)) = 1 - w^(2^70): differences below 1e-59 at three
   points.
Server-side cross-check of the float64 census: 72 cells recomputed as ball products
(`arb_census.py cross`, 128 bits): largest difference 3.5e-10 (in the 36 cells whose depths are in the
final float64 output).
`periodic_check.py` (server, float64 direct sums, 40 * 2^j factors, j = 12, 16, 20): seven periodic patterns at
up to six rationals each; the normalised leading coefficient equals -beta_2 to 5 or 6 digits (item 11).
`first_harmonic_check.py`: the expansion of sum e^(-k^beta z) used in Proposition H, beta = 1/2 and 3/4, three
points each: differences 1e-23 to 4e-42 (2e-11 at the real point z = 0.3, where the reference is the
summation routine's own accuracy).

## 3. Corrections made during the pass

C1. Theorem E (a): the first draft stated the lower bound for abs(1 - e^(-kz)) with b not dividing k as 2/b
without derivation; it is min(4/b, 1) from (*), and the statement now requires a/b in lowest terms.
C2. Theorem T: tanh replaced by tan in the strip Blaschke factor (item 8).
C3. Theorem T (i): the first draft bounded the infimum with K = 3m + 1 aligned factors and forgot the tail
product over k > K, which is e^(L) and not close to 1. The text now aligns K factors with K -> infinity.
C4. `referee_check.py` item 3 first scanned from y = 0, where phases + give the infimum trivially; the scan
now starts at y = 1.
C5. `analyse_eta.py` first printed y minus the eta prediction in float64 at j = 60 (cancellation of 1.9e18;
the printed multiples of 16 were rounding). It now prints the separately stored log abs rho.
C6. The first GPU launch (three sequential units, jmax 27, 19, 11) was stopped by the lane after 5 minutes
because the estimated time exceeded the job limit; relaunched as six units with jmax 25, 17, 10.

C7. A draft of Proposition PC added "almost every sign pattern on a super-sparse subfamily, by the argument
of Theorem R". That is not supported: with two-valued phases the bad event of Lemma X has probability up
to 1/2 for each l, and Borel-Cantelli does not apply. Removed; the text now says so.
C8. Section 0, item 6 first said that Theorem W "reads finitely many harmonics". It reads all multiples of
one lattice; the obstruction in the dense case is that these spikes are not isolated. Reworded.

## 4. Points for an independent referee

1. Theorem T. (a) Is "finite order" in the c20 setting the hypothesis used here, and does the finite-order
   bound for g = B G U/zeta inside the strip follow as quoted (lower bound for zeta on horizontal segments;
   Boutroux-Cartan for the denominator of G; B bounded)? (b) The claim that the functional equation makes
   N_1 analytic and zero-free in -1/2 < Re z < 0: it uses R_S(s) = R_S(1 - s) and U zero-free in Re s > 0.
   (c) The symmetric case (ii): L(delta) >= log(1 + 1/e) N(1/delta) and the passage from divergence of sum 1/lambda.
2. Theorem R. The statement is about fibres over a super-sparse A. Check that it is not read as "for all
   phases". Check the selection p_i (a Borel function of theta_i) and that the exceptional set of Lemma X is a
   null set of the pair, uniformly usable for every fixed assignment on the complement of A.
3. Theorem E. Input (i) (invariance of abs(eta)^4 Im tau) and input (ii) (prime gaps with an exponent below 1)
   are recalled. The remark that the theorem holds for lambda_k = k shows the result is not R1; check that the
   summary does not suggest otherwise.
4. Proposition H. The entire-function claim for sum zeta(-beta j)(-z)^j/j!, beta < 1 (growth of zeta(-beta j) from the
   functional equation), and the vanishing of the shifted Mellin-Barnes integral, are recalled, not proved;
   the numerical check covers five points.
5. Section 7, item 3: the factor N(X)/h^2 for the near-coincident pairs is a count, labelled ARGUED.
6. The measured exponent 3/4 at pole points of single primes (beta = 1) has no proof: those heights are not
   known to be of bounded type.
7. Theorem E2 and Proposition E3 were added late in the lane; their proofs are short but have been read only
   by the author. In E2 the error term O_L(log(1/delta)) of the model is not uniform in b; density of the
   admissible rationals is all that is used.
8. The float64 census at beta = 0.75 and 0.5 is shallow; no claim in RESULT.md depends on it beyond the
   stated spreads.

---

# Independent referee pass (lens: general), 2026-11-20

Separate process from the author; sections above are the author's pass and are left unchanged.
Method: every PROVED step re-derived by hand from RESULT.md; numerics rerun with a third implementation
(numpy float64 direct products, own Miller-Rabin and nearest-prime search, no shared code, local under
`scripts/memcap.sh 8`, cases not in the lane's lists); CYC control rerun in mpmath with a different base.
Scratch scripts kept outside the repo; outputs quoted below.

## Verdict

**holds = true as a partial-result, with two errors in written steps (both repairable, conclusions
unchanged) and three wording points.** No statement about zeros of zeta is made; nothing assumes RH;
nothing restates verified height. Flags: R1 = R2 = R3 = R4 = false (agree with the author). Score 0 stands.

## Errors

E-1 (Lemma X, proof; wrong implication). The step "since mu_(l+1)/mu_l >= e^3, the sum of e^(-mu_l delta)
over these l is at most ... < 0.4" does not follow from the definition of super-sparse (mu_i >= e^(i^2)
is a lower bound only; mu_i = 0.99 e^((i+1)^2), mu_(i+1) = e^((i+1)^2) for infinitely many i satisfies it
with ratio 1.01). Repair, under the stated definition: for x >= 1, log((1 + e^-x)/(1 - e^-x)) <= 2.2 e^-x;
the number of l with mu_l delta in [e^s, e^(s+1)) is at most sqrt(L + s + 1), L = log(1/delta); so the
product over l with mu_l delta >= 1 is at most exp(2.2 sum over s >= 0 of sqrt(L + s + 1) e^(-e^s))
<= exp(C sqrt L). The final bound becomes abs Xi <= C delta exp(sqrt(L)(log pi + log L + C)) -> 0.
Lemma X and Theorem R stand. Alternatively add mu_(i+1) >= e^3 mu_i to the definition (every infinite S
still contains such a subset). RESULT.md should be corrected either way.

E-2 (Proposition E3, constant). The quoted asymptotic of log (q^r; q^M)_infinity has the wrong sign on the
constant: it is -pi^2/(6 M delta) + (1/2 - r/M) log(M delta) - log Gamma(r/M) + (1/2) log 2 pi + o(1)
(check M = r = 1: log (q; q)_infinity = -pi^2/(6 delta) + (1/2) log(2 pi/delta) + o(1); the residue at w = 0
of Gamma(w) zeta(w+1) M^-w zeta(w, x) delta^-w is zeta'(0, x) - zeta(0, x) log(M delta), entering with a
minus sign). Only the constant c is affected; e_0 and the conclusion are unchanged (measured below).

## Wording points

W-1. Section 0 item 7 says the first harmonic continues "apart from z = 0". For beta = 1 the statement of
Proposition H itself gives poles at 2 pi i Z (P_1 - 1/(e^z - 1) analytic). The proposition is right; the
summary line is wrong for beta = 1.
W-2. Section 0 item 5 says "for every infinite S"; Theorem R as stated and proved needs convergence of the
product in Re z > 0 (sum q^-eps finite). Use the theorem's hypothesis in the summary.
W-3. Novelty. Theorem E for lambda_k = k is the classical boundary behaviour of the Dedekind eta function
(cusp expansion; bounded-type heights through invariance of abs(eta)^4 Im tau); the lane's content is the
perturbation to lambda_k = k + O(e^(-ck)). Theorem R is in the genre of almost-sure natural-boundary theorems
for random series and random Euler products (Steinhaus; Kahane; Queffelec); the lane did not open that
literature. "New here" in section 1 should read "not on file in the campaign record" for E and R.
Proposition PC is a direct corollary of Polya-Carlson and is presented as such.

## Re-derivation record (all confirmed unless marked)

- Lemma Q (a)-(c): factorisation of a meromorphic function on a neighbourhood of iJ. Confirmed.
- Lemma Q (d): Poisson identity with f^(xi) = (X/lambda) w^(X xi/lambda); Laplace representation
  w(mu/X)/X = (1/2 pi i) int W_X(u) e^(-mu u) du; pole term gives W_X(is) = w^(Xs) (W_X decays to the left
  because supp w is in x > 0); far part bounded by X^(C+2) against (X tau)^-A. Confirmed. The box
  half-width h must also be below dist(t, boundary of J) so that all poles in the box are among the t_i;
  implicit in "compact sub-interval of the interior". Hole condition: confirmed (the atom of L_k at p
  contributes w^(0) = int w; other points of L_k are at distance >= 2 pi/lambda_k and vanish in the limit).
- Theorem E (a): gamma with bottom row (b, a) sends -a/b + iy to imaginary part 1/(b^2 y);
  log abs E = -pi^2/(6 b^2 delta) + (1/2) log(2 pi/(b delta)) + O(delta). rho: b not dividing k: denominator
  >= min(4/b, 1); b | k: K_delta log(8/delta) plus a convergent tail. Confirmed.
- Theorem E (b): Im(gamma tau) <= 1/(2 kappa) for every bottom row (q, -p), q != 0, by
  (q x' - p)^2 + q^2 y^2 >= 2 kappa y; rho bounded through abs(1 - e^(-kz)) >= 4 kappa/k. Confirmed.
- Theorem E (c): confirmed from (a) alone (growth 1/delta on a dense set against Lemma Q (b)).
- Lemma TR: confirmed (uses only abs c_k = 1).
- Theorem E2: Riemann-sum step, CRT factorisation, c_r^(bl) = c_r^l for b = 1 mod d, Fourier series of
  B_2. Confirmed. beta_2 values of the table recomputed: 1/54 (cube roots), 5/192 (1, i, i, -i), (1 + 3m)/24.
- Proposition E3: confirmed apart from E-2.
- Proposition PC: c_m = sum over k | m of k eps_k^(m/k); c_p = eps_1^p + p eps_p unbounded; bounded for a
  rational function with all zeros and poles in abs w >= 1. Confirmed relative to Polya-Carlson.
- Lemma X: confirmed with the repair E-1. Borel-Cantelli is applied conditionally on theta for each of
  countably many (I, i); Fubini on a Borel set. Theorem R: B_D x B_D inside Z, section argument. Confirmed.
- Theorem T: edge bounds (U bounded above and below on abs(Re z) <= d because sum q^(-1/2+d) is finite);
  abs tan(a + ib)^2 >= tan^2 a and 1 - abs tan^2 <= 4 e^(-2 abs b); the factors at distance > 1 are bounded
  below since 4 e^(-pi/(2d)) < 0.18 for d < 1/2; Kronecker needs only Q-independence of the log q (continuous
  form); e^(-F(delta)) <= C delta^(3m+1); (ii) with L(delta) >= log(1 + 1/e) N(1/delta). Confirmed relative to
  the quoted inputs (lower bound for zeta on a sequence of horizontal segments, minimum modulus for the
  finite-order denominator, Phragmen-Lindelof in a strip with growth exp(abs y^A), far below the
  exp(exp(pi abs y/(2d))) threshold). The spacing Y_(n+1) - Y_n <= 1 is not needed; any unbounded sequence
  suffices. Not re-derived: the definition of "finite-order twin" against the c20 lane.
- Proposition H: P_1 - Sigma_beta converges locally uniformly in Re z > -0.475. Confirmed relative to the
  Mellin-Barnes expansion (not opened).
- Section 7 item 5 and item 3 are labelled ARGUED; not checked, not counted.

## Numeric reruns (third implementation; float64; 40 * 2^j factors; lambda_k = log of prime nearest e^k
for k <= 36, k above)

1. Theorem E (a), rationals outside the lane's list, y delta 6 b^2/pi^2 at j = 14, 18, 22 (prediction -1):
   3/11: -0.979152, -0.997965, -0.999801;  4/9: -0.983821, -0.998251, -0.999842;
   7/10: -0.985260, -0.998508, -0.999847.
   Same with lambda_k = k exactly (no primes), 3/11: -0.979473, -0.998328, -0.999871: the mechanism does
   not read the primes (R1 false, as the author states).
2. Theorem E (b), bounded-type heights outside the lane's list, y - (1/4) log(1/delta) at j = 8, 10, ..., 20:
   t/2 pi = sqrt 11 - 3: 0.527, 0.519, 0.260, 0.540, 0.522, 0.562, 0.298;
   t/2 pi = (sqrt 17 - 3)/2: -0.218, -0.144, -0.160, -0.221, -0.144, -0.158, -0.224. Bounded (log-periodic).
3. Theorem E2, signs of period 5 (+,+,-,+,-), beta_2 = 1/15, y delta b^2/pi^2 at j = 14, 18, 22
   (prediction -0.066667): 2/9: -0.065296, -0.066504, -0.066651;  1/7: -0.067316, -0.066681, -0.066665;
   4/11: -0.065996, -0.066569, -0.066653;  1/1: -0.066478, -0.066647, -0.066665.
4. Proposition E3, slope of y against log delta at t = 0 between j = 14, 18, 22: +,-,-: 0.1667, 0.1667;
   -,+,-: -0.1667, -0.1667;  -,-,+: -0.5000, -0.5000. Agrees with 1/6, -1/6, -1/2.
5. Control CYC, base 5 instead of 3 (mpmath, 60 digits): n_eff = -1.000000 at w = 1; 0.000000 at zero
   points of factors k = 0, 4, 7 and at a generic height (j = 31 and 61). Integers, as claimed.

## Observation beyond the lane (MEASURED; not part of the refereed claim)

The restriction b = 1 mod d, gcd(b, M) = 1 in Theorem E2 is only a convenience. The same Riemann-sum step
gives, for every a/b, the coefficient of 1/delta as -(pi^2/L) sum over r mod L of B_2({s_r/d - a r/b}),
L = M b. Checked for the period-5 pattern at inadmissible b: 1/2: predicted -0.166667 (times pi^2/(b^2 delta)),
measured -0.166661; 1/5: +0.333333, measured +0.333333; 1/10: -0.166667, measured -0.166648.
For the "first open case" named in section 7 (beta_2 = 0 and e_0 an integer): signs of period 6 with + at
r = 1, 5 have beta_2 = 0, e_0 = 0. At t = 0, y = -0.2517 constant from j = 12 to 22 (integer exponent 0:
the central point does not exclude it), and the coefficient vanishes at 1/5 and 1/7 as E2 predicts. At
inadmissible denominators it does not: coefficient of pi^2/delta 0.041667 at 1/2 (measured 0.041667),
0.037037 at 1/3 (0.037037), -0.010417 at 1/4 (-0.010416). So this case is likely closed by the general
formula on a dense set of rationals with even denominator; that needs a non-vanishing argument on a
dense set, which is not written here.

## Requirement flags (set by this referee)

- R1 false. Theorem E, E2, E3, TR hold for lambda_k = k (rerun 1); Theorem R uses free phases; Theorem T
  uses only Q-independence of the log q and passes for Beurling systems with independent norms.
- R2 false. Local statements at every point of the line and a height-uniform necessary condition, all
  about G/zeta for a relative product or a hypothetical twin; nothing about zeta in every window.
- R3 false. No zeta-only mechanism is claimed; the natural-boundary statements are base-blind; only CYC
  leaves at a named step (Kronecker), and only for Theorem T.
- R4 false. Nothing passes to the critical line for zeta; the general dense case stays OPEN.

## Surviving claim

For G = zeta/R_S with abs(alpha_q) = q^(1/2): Lemma Q; natural boundary on Re s = 1/2 for
S = {prime nearest e^k} with phases + (Theorem E, relative to eta-invariance and a prime-gap exponent
below 1) and with periodic root-of-unity phases of non-zero beta_2 (Lemma TR, Theorem E2); no meromorphy
at s = 1/2 for period-3 signs with beta_2 = 0 (E3); null exceptional set in every super-sparse phase fibre
(Theorem R, with repair E-1); unbounded local counts of zeros and poles of G/zeta for a finite-order twin
(Theorem T, relative to quoted classical inputs). Arbitrary phases on a dense S: OPEN. No statement
about zeros of zeta. This pass counts as one independent referee.
