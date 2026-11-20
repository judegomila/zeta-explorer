# REFEREE (adversarial, lens: general): c3-helson-tail-fe-selector

Date: 2026-11-18. Reviewed: RESULT.md, disc_test.py/.log, window_test.py/.log. Independent check script run locally through scripts/memcap.sh 8 (263 s; server not used); it was written to a temporary directory and is not retained (this task writes only REFEREE.md). Its method is described in the numerics section.

## Verdict

**The claimed verdict (precise obstruction, no selector, all four flags false) holds, with five corrections.** None of the corrections changes the verdict. Nothing in the result assumes RH, restates verified height, moves a bound, or presents a known theorem as new (the result claims no novelty; that is accurate: Prop. 6 is the Littlewood/Green identity with a band-limited test function, and the rest is Helson, Kakutani, Kronecker, Hamburger, Bohr-Jessen and Klurman / Klurman-Mangerel recalled).

## Errors and gaps found

1. **Wrong constant in the binary-digit formula (Candidate 1a, labelled PROVED).** The result states S(n) - n/3 = (1/2) sum_k (-1)^k b_k(n) + O(1), hence J/2 + O(1) at n = sum_{j<J} 4^j. Re-derivation: S(n) = sum_j (-1)^j ceil(floor(n/2^j)/2) = (1/2) sum_j (-1)^j (n/2^j - {n/2^j} + b_j), and sum_j (-1)^j {n/2^j} = -(1/3) sum_i (-1)^i b_i, which is not O(1). The correct statement is S(n) - n/3 = (2/3) sum_k (-1)^k b_k(n) exactly for the full alternating sum (measured: residual 0.000 over n <= 2^22 with coefficient 2/3; residual range [-1.83, 1.83] and growing with coefficient 1/2). At n = sum_{j<J} 4^j the discrepancy is 2J/3 exactly (measured 1.333, 2.0, ..., 7.333 for J = 2..11). The result's own log (0.67 per factor 4) agrees with 2/3, not 1/2. The conclusion Omega(log x) stands.

2. **"E_zero is comeagre" is asserted (verdict item 2, and the task claim) but not proved.** Prop. 1(e) proves that Z (holomorphic zero-free continuation to a neighbourhood of Re s >= 1) is meagre, which gives E comeagre. The complement of E_zero is {meromorphic continuation to Re s > 1/2 without zeros}, which allows poles and is not contained in Z (chi = 1 is in it if RH holds). Wiener-Ikehara as used does not handle unknown poles on Re s = 1. The statement is true by a simpler argument, supplied here: for fixed real sigma > 1 the map chi -> (sigma - 1) sum Lambda(n) chi(n) n^-sigma is continuous on T^inf; the sets U_N^+- = {chi : there is sigma in (1, 1 + 1/N) with |(sigma - 1)(-zeta_chi'/zeta_chi)(sigma) -+ 1| < 1/N} are open and dense (in a cylinder fixing primes below P, set chi(p) = +-1 on P < p <= x with x large and take sigma - 1 between 1/log x and 1/log P on a logarithmic scale). On the dense G_delta intersection, (sigma - 1)(-zeta_chi'/zeta_chi)(sigma) has limit points +1 and -1 as sigma -> 1+, so zeta_chi is not meromorphic at s = 1 and chi is in E_zero through the "does not continue" clause. This also re-proves Prop. 1(e) without Wiener-Ikehara. Reading: generic membership in E_zero is by failure of continuation at s = 1, not by a zero; the Baire statement says nothing about zeros.

3. **"Singular to Haar exactly when beta_0 > 1/2" is wrong at the endpoint and one-directional as a zero statement.** Lemma 3(iii) uses the Cauchy-Schwarz lower bound x^(2 beta - 1)/log x, which diverges iff beta > 1/2; the sum itself also diverges at beta = 1/2 (a_p about -p^(-1/2), sum a_p^2 about sum 1/p; on dyadic blocks Cauchy-Schwarz gives 1/log x per block, which sums to infinity). So the drifted measure is singular iff beta_0 >= 1/2, and at beta_0 = 1/2 it is singular without placing anything in Re s > 1/2. Correct form: equivalence to Haar excludes zeros and poles in Re s > 1/2 (immediate from m(E) = 0); singularity is necessary, not sufficient. Also, Lemma 3 as proved covers 1/2 < beta_0 < 0.975 only; the "exactly when" sentence extends it without proof to beta_0 <= 1/2 (true for beta_0 < 1/2 by the same tracking argument). "Needs |sum a_p| of order x^beta/log x" is established only in the form "sum_{p<=x} a_p is not O(x^theta) for any theta < beta", which suffices.

4. **Lemma 3(i), tracking error: the stated reason is incomplete.** "Bounded by the largest increment of A across a prime gap near x" ignores accumulation over consecutive long gaps while the clip |a_p| <= 1/2 is active (for beta_0 > 0.475 a single increment can exceed 1/2). Repair: the error at x is at most sup over y < x of |A(x) - A(y)| - (1/2) #{primes in (y, x]}; for x - y >= x^0.525 Baker-Harman-Pintz gives at least c (x - y)/log x primes while |A(x) - A(y)| <= (x - y) y^(beta_0 - 1)/log y, which is smaller for large x. So e(x) = O(x^(beta_0 - 0.475)/log x) and the stated bound holds. The rest of (i) (Kolmogorov, E_1 expansion, log(s - beta_0) + holomorphic) re-derives correctly. Hellinger expansion 1 - a^2/4 confirmed.

5. **Lemma 2(c), smaller overstatements.** (i) "a dense G_delta containing 1 exists (E is one)": E is comeagre, but E being a G_delta is not proved; the dense G_delta of Prop. 1(e) (or of item 2 above) contains 1 and lies inside E, which is what is needed. (ii) "no G_delta separates" is proved in one direction only: no G_delta contains the good set and misses E. A G_delta containing E (or E_zero) and missing G is not excluded by the argument. The headline "no closed or G_delta class selects the good set" is the proved direction. (iii) Candidate 1a: "D is equivalent to ... holomorphic in Re s > 0 with bound |s|/sigma" is an implication, not an equivalence. (iv) The extension of Chudakov to main term c x^(1 - i tau) is asserted without source. (v) Prop. 4(b): "functional equation of zeta type" is not defined; with Hamburger (exact equation) or the degree-1 Selberg-class classification the statement is correct for T^inf.

## Steps re-derived and confirmed

- Prop. 1(a) H-invariance (factor logarithm O(|psi(p) - 1| p^-sigma), H is a group); (c) Liouville zero at s = 1; (d) density; (e) for Z and E (Wiener-Ikehara applied to Lambda(n)(1 + Re(c chi(n))) with the conjugate series; the limsup set is a dense G_delta).
- Lemma 2(a), (b), (d).
- Lemma 3(ii) (Kakutani with affinity 1 - a^2/4), with corrections 3 and 4.
- Prop. 4(a) is a tautology once stated; (b), (c) correct as recalled. The consequence "tail-measurable and fails for finite modifications exclude each other" is correct and elementary.
- Candidate 1a non-multiplicative control: sum (1 + c(-1)^n) n^-s = zeta(s)(1 - c(1 - 2^(1-s))), zeros on Re s = 1 - log_2 |1 - 1/c|. Confirmed.
- Candidate 2a: ||P_N f - 1||^2 = prod_{p>N} (1 - p^(-2 sigma))^-1 - 1. Confirmed.
- Prop. 6: Green's identity re-derived with signs; J = sum m_rho V(rho), V(rho) = pi int_{-a}^{a} w(gamma - T + iy) dy. Confirmed. The Corollary's "if" direction is only sketched; a complete argument: in the distribution sense in sigma, d^2/d sigma^2 J_sigma[w] + J_sigma[w''] = 2 pi sum_rho m_rho w(gamma_rho - T) delta(sigma - beta_rho); if J equals the pole term for all band-limited w, the zero part of the right side vanishes; take w = |w_1|^2 >= 0 on the real line with w_1 of band delta/2. The corollary holds.

## Independent numerics (different cases from the result)

Window changed to delta = 0.5, w^ = (1 - (xi/delta)^2)^6, mpmath evaluators (not the result's numpy evaluators), grid half-length 80, step 0.02.

| F | sigma | T | J measured | predicted from zeros and poles |
|---|---|---|---|---|
| zeta(s+0.2) zeta(s-0.2) (control not run in the result) | 0.55 | 14.1347 | +6.0883997e-2 | +6.0884175e-2 |
| same | 0.65 | 14.1347 | -3.9875629e-4 | -3.9861634e-4 |
| same | 0.75 | 14.1347 | -2.5866751e-2 | -2.5866634e-2 |
| same | 0.55 | 30 | +2.3005900e-1 | +2.3005908e-1 |
| same | 0.65 | 30 | +7.6611114e-2 | +7.6611161e-2 |
| same | 0.75 | 30 | -9.3736505e-5 | -9.3708477e-5 |
| DH (zeros re-found by mpmath findroot) | 0.55 | 90 | +7.5334075e-2 | +7.5334062e-2 |
| DH | 0.70 | 90 | +3.1673466e-2 | +3.1673452e-2 |
| zeta, band delta = 0.65 < log 2 | 1.20 | 40 | -1.6e-8 | 0 |
| zeta, band delta = 0.90 > log 2 | 1.20 | 40 | -1.68e-3 | 0 (identity must fail; it does) |

Absolute agreement 1e-7 to 2e-7 (limited by this referee's truncation at +-80 with t^-7 decay and a 39-zero list), i.e. 6 to 7 digits where the value is not small. The identity is confirmed on a case not in the result, including the control zeta(s+a)zeta(s-a): it satisfies the identity with its off-line zeros at 1/2 + a, as DH does. The band-violation row confirms that the gap below log 2 is what removes the prime term. The identity therefore separates no control; it is an equivalent form of zero-freeness, as the result says.

The result's note on the bad "pred" values at T >= 1e4 (quadrature aliasing in w at large real argument) is a correct diagnosis; those printed values are wrong and are not used.

## Controls

No zeta-only mechanism is claimed, so there is no positive claim to break. Checked here: DH and zeta(s+a)zeta(s-a) both satisfy Prop. 6 with their own zeros (measured above). The finite-modification control behaves as stated (same J as zeta in the result's log; Omega(log x) discrepancy with corrected constant 2/3). Beurling, backward heat, phase-rotated transfer operator and theta^w were not run in the result; this is stated there and nothing depends on them.

## Requirement flags (set by this referee)

- R1 false. No attack is given; the one every-window criterion uses only a_1 = 1.
- R2 false. Prop. 6 is height-uniform and every-window in form but is an equivalence; no conclusion is drawn.
- R3 false. DH and zeta(s+a)zeta(s-a) satisfy the identity; the blind candidates pass the twin.
- R4 false. No passage to the line.

## Surviving claim

No selector found. chi = 1 is in E (pole); RH is 1 not in E_zero. E and E_zero are tail, flow-invariant, H-invariant, null and dense; E is comeagre (proved in the result), E_zero is comeagre (proved in this report, by non-continuation at s = 1 for generic chi). No closed set or G_delta contains the good set and misses E; no rotation-invariant class separates. The drifted product measure of the twin is singular to Haar for 1/2 <= beta_0 < 0.975 and plants a zero for beta_0 > 1/2; equivalence to Haar excludes strip zeros and poles; zeta is the Dirac case. A property holding at chi = 1 cannot be both tail and fail for finite modifications. Exact bounded discrepancy is not tail (Omega(log x) with S(n) - n/3 = (2/3) sum (-1)^k b_k(n)); it names chi = 1 by Klurman / Klurman-Mangerel (recalled, not opened). H^2 cyclicity holds for every chi. Orbit genericity for log|zeta| is a density statement. The Mertens, outer and band-limited forms are equivalent to zero-freeness. The band-gap identity (Prop. 6) is correct, confirmed on three functions by two independent codes, and holds for DH and zeta(s+a)zeta(s-a) as well.
