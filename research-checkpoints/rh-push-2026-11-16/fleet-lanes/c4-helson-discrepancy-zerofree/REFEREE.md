# REFEREE: c4-helson-discrepancy-zerofree (lens: general)

Date: 2026-11-18. Target: RESULT.md, claimed verdict precise-obstruction.
Outcome: **holds** (Theorem 1 and corollaries re-derived; measured part reproduced on new cases; errors found are minor and listed in section 4). No statement about zeros of zeta is made or supported.

## 1. Re-derivation of the PROVED steps

Set-up. E(x) = O(x^theta) gives F(s) = c s/(s-1) + s int_1^inf E(x) x^(-s-1) dx, analytic in Re s > theta apart from a simple pole at 1, residue c. Confirmed. (theta >= 0 is automatic since E jumps by 1 at integers, so the real segment (theta,1) lies in (0,1) where zeta is finite and non-zero.)

(a) For Re s > 1: log G = sum_p sum_k (chi(p)^k - 1) p^(-ks)/k and log G* is the same with conj chi; the sum is -2 sum_p sum_k (1 - Re chi(p)^k) p^(-ks)/k = -2A. Coefficients of A are >= 0 because |chi(p)^k| = 1. Confirmed. Complete multiplicativity and unimodularity are both used here and only here.

(b) H(1) = c conj(c) / 1 = |c|^2 != 0. On (sigma_0, 1): F*(sigma) = conj F(sigma), so H = |F|^2/zeta^2 > 0. On sigma > 1: H = exp(-2A) > 0. sigma_0 is well defined: real zeros of F in (theta,1) are isolated, cannot accumulate at the pole, so can accumulate only at theta. Confirmed.

(c) H is analytic and positive on the whole real ray (sigma_0, inf), so -(1/2) log H is an analytic continuation of A to a neighbourhood of that ray. Landau's theorem (non-negative coefficients: the real point of the abscissa of convergence is a singularity) gives abscissa <= sigma_0. Confirmed; this is the standard use of Landau's theorem and there is no gap at s = 1 (H is analytic and non-zero there by (b)).

(d) exp(-2A) is analytic and non-vanishing on Re s > sigma_0 and agrees with the meromorphic H on Re s > 1; identity theorem on the connected set Re s > sigma_0 (inside Re s > theta). Hence ord_F(s_0) + ord_F(conj s_0) = 2 ord_zeta(s_0). Confirmed. Sanity check done by hand: chi(2) = -1, chi(p) = 1 otherwise gives F = zeta (1-2^-s)/(1+2^-s), extra zeros only on Re s = 0, consistent with sigma_0 = theta = 0.

C1. Dropping k >= 2 terms is legitimate (all terms >= 0). sum_{p<=x} |1-chi(p)|^2 = 2 sum (1 - Re chi(p)) <= 2 x^sigma sum_p (1 - Re chi(p)) p^-sigma; Cauchy-Schwarz with pi(x) gives exponent (1+sigma_0)/2. Confirmed.
C2. Confirmed (partial summation; factors non-zero for Re s > 0).
C3. Confirmed. Note the precise content for complex chi: zeros of F in Re s > sigma_0 are a subset of zeta's zeros, and every zeta zero rho there is a zero of F at rho or at conj rho. "The zeros of F are the zeros of zeta" in verdict item 1 is exact only for real chi; the RESULT states the asymmetry in section 2, so this is wording, not an error.
C4. g = chi * mu, |g(p^k)| = |chi(p) - 1|; Rankin gives sum_{d<=y} |g(d)| << y^(beta+eps); S(x) = sum g(d)[x/d] = G(1) x + O(x^(beta+eps)). Confirmed (needs beta < 1; G(1) != 0 by absolute convergence).
C5. Upper bound f <= max(Theta, r) follows from Theorem 1; lower bound from chi = 1 and the definition of r. Confirmed with two conventions the RESULT leaves implicit: the Theta term is attained only when Theta > theta (zeros with Re s <= theta are outside the domain of F), and sigma_0 depends on the chosen theta, not only on chi.
Section 3 hyperbola implication (theta <= b/(b+1-a)): re-derived, error terms y^b + x y^(a-1), balanced at y = x^(1/(b+1-a)). Confirmed (needs a < 1).
Greedy construction: sum_{p in S} p^-s = E_1((s-b) log 2) + s int (count - T) x^(-s-1) dx, so G = (s-b)^2 e^h, h analytic where the tracking-error integral converges (Re s > b - 0.475 from the prime-gap bound; k = 3 terms converge for Re s > b/3). Confirmed as a CLASSICAL-input statement. Whether s = b lies in the domain Re s > theta of the hypothesis is the measured part.

## 2. Numeric rerun with different cases

Run locally in a scratch directory (copy of thin_twist.py, through scripts/memcap.sh 8, about 5 s each). Nothing written to the lane directory.

- greedy, b = 0.8, N = 6e7 (new b): c = 0.1265867, S(N)/N = 0.1265918. Block maxima: 2^16: 103.5; 2^20: 266.0; 2^24: 725.0 (x^0.8 at 2^24 is 6.0e5). Fitted exponents of max 0.335 to 0.393, of rms 0.270 to 0.359. F_series(0.8) = -4.2e-5; F_series / F_euler: 0.81: -0.0022475 / -0.0022121; 0.82: -0.0092323 / -0.0092027; 0.85: -0.0660221 / -0.0660047; 0.87: -0.1448833 / -0.1448711. Ratio F(0.82)/F(0.81) = 4.1, consistent with a double zero at 0.8. Exponent close to b/2 = 0.4 and well below b.
- random, b = 0.6, seed 7, N = 6e7 (new b and seed): F_series(0.6) = 8.0e-5; F_series/delta = -4.82, -4.91, -5.21 for delta = 0.01, 0.02, 0.05 (simple zero at 0.6); series and Euler values agree to about 1e-4 on the real points and to about 1e-3 at the complex points. Fitted exponents of max 0.362 to 0.454, of rms 0.343 to 0.513 (the k >= 20 fits are the high values).

Reading. The zero at s = b is reproduced in both new cases. The greedy exponent again sits near b/2. The random case at b = 0.6 does NOT follow b/2 = 0.3: its fits are 0.36 to 0.51, and the last-octave rms fit 0.51 leaves little margin below b = 0.6. The RESULT claims the b/2 pattern only for the greedy sets, so nothing is contradicted, but "sigma_0 > theta" has clear numerical margin only for greedy sets and for b near 0.8 to 0.9.

Check against a log-power masquerade: if E(x) were x^b/(log x)^k with fixed k, the local slope would rise by about k (1/8.3 - 1/17.3) = 0.06 k between 2^12 and 2^25; the b = 0.9 fits are flat (0.45, 0.45, 0.43 for k >= 12, 16, 20). Also G is analytic at s = b (integer-order zero), so Selberg-Delange contributes no x^b/(log x)^k term to sum g(d). Both support a true power saving; neither is a proof. The label MEASURED is correct and the RESULT's weak step 1 states this.

## 3. Controls, RH-independence, novelty

- No step assumes RH, a zero-free region, or verified height. zeta enters only through zeta != 0 on (0,1) and the pole at 1.
- No zeta-only mechanism is claimed, so there is no control that is supposed to fail and must be rerun. I checked the table rows by hand: Liouville (c = 0, H(1) = 0, theorem empty), n^(-i alpha) (no pole of F at 1, H has a double zero at 1), DH (no Euler product, step (a) unavailable), Steinhaus (c = 0), finite modification (extra zeros on Re s = 0), thin sign twist (inside the class; the theorem holds for it). All consistent.
- Beurling transfer: steps (a) to (d) use only the two Euler products and analyticity on the real segment. It transfers provided zeta_B is itself meromorphic on Re s > theta with a simple pole at 1 (N_B(x) = A x + O(x^theta)) and sigma_0 is taken to the right of any real zeros of zeta_B. The RESULT says "wherever zeta_B is zero-free on the real segment"; that is the correct condition. So R3 fails as stated.
- Novelty: the RESULT does not claim novelty and says the Landau device may be folklore. I agree it should be treated as a routine application of Landau's theorem to F F*/zeta^2 (the same device as in non-vanishing proofs via products with non-negative log-coefficients) and not as a new theorem until the literature on multiplicative functions close to their mean / Beurling systems is checked. Not presented as new; acceptable.

## 4. Errors and imprecisions found (none changes the verdict)

1. Verdict item 3 quotes the b = 0.5 exponents as "0.27 to 0.31". The log gives max fits 0.195 to 0.309 and rms fits 0.253 to 0.273; section 4.2 has the right range (0.20 to 0.31). The verdict line is narrower than the data.
2. "Measured: r(theta) >= about 2 theta" (item 4) is supported only for theta in roughly [0.25, 0.45], on x <= 1e8, for greedy sets. It cannot hold for theta >= 1/2 (r < 1), and the random-set rerun at b = 0.6 gives a ratio b/theta of about 1.3 to 1.7, not 2. It should read: for the greedy sets tested, a real zero at b with measured exponent about b/2.
3. thin_twist.py crashes for b = 0.8 at the test point s = b + 0.2 = 1 (division by zero in F_trunc); the checks before that point are printed, the K_P and JSON outputs are lost. Script defect only.
4. C5 and the definition of sigma_0 depend on the chosen theta and need Theta > theta for the first term; conventions not stated (section 1 above).
5. Section 4.4 (two-set example): the value at s = 0.75 (0.021) is 1.7 times the truncation scale, as the RESULT says; the zero at 0.75 + 5i (0.0062 against 0.53 at the conjugate point) is consistent with a zero but its position left of sigma_0 = 0.9 relies on the measured, unresolved discrepancy exponent (about 0.51, flat in the last octaves). The sentence "the threshold sigma_0 cannot be lowered to theta" is MEASURED, and already follows from the b = 0.9 real double zero alone if theta < 0.9 there.
6. Verdict item 1 wording "the zeros of F are the zeros of zeta": exact for real chi; for complex chi it is inclusion plus conjugate-pair order matching.

## 5. Requirement flags (set by the referee)

- R1 = true, in the restricted sense the RESULT states: step (a) needs the Euler product over all primes with unimodular local factors; without it A does not exist and the Landau step is unavailable (DH stops there). This is established for Theorem 1 as a statement about F relative to zeta. It is not an attack on zeta and uses nothing about the additive structure of the integers.
- R2 = false. The order identity holds at every height, but it is not a zero-free or every-window conclusion about zeta.
- R3 = false. Beurling systems and thin sign twists pass every step.
- R4 = false. Nothing reaches the critical line; the content right of sigma_0 is zeta's own zero set.

## 6. Surviving claim

For completely multiplicative unimodular chi with sum_{n<=x} chi(n) = c x + O(x^theta), c != 0, theta < 1, and sigma_0 the largest real zero of F in (theta,1) (or theta): sum_p (1 - Re chi(p)) p^-sigma converges for sigma > sigma_0, and ord_F(s) + ord_F(conj s) = 2 ord_zeta(s) on Re s > sigma_0 (proved; two independent checks now; novelty unchecked, likely folklore). Consequently a zero-free statement for F right of sigma_0 is the same statement for zeta, and the hoped-for implication is circular. Measured, not proved: greedy thin sign twists with b = 0.5, 0.7, 0.8, 0.9 have a double real zero at s = b and discrepancy exponent well below b on x <= 1e8 (near b/2); random thin twists have a simple zero at b with smaller margin. No statement about zeta zeros.
