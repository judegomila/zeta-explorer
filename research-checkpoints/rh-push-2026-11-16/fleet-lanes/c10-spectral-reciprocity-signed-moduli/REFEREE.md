# REFEREE: c10-spectral-reciprocity-signed-moduli (lens: general)

Date 2026-11-18. Adversarial check of RESULT.md. One local numeric run (memcap 8 GB, under 1 minute); no server job.

## Verdict

**Holds, with corrections.** The three steps labelled PROVED (C1, Lemma R, P2-a) are confirmed by re-derivation; Lemma R is also confirmed numerically on two cases the author did not run, with independent code and a different weight shape. The verdict "precise obstruction" is exact only for the weight-1 (n4) sum: there the statement "l is a parameter of the identity, so the map on A is the identity" is a direct consequence of Lemma R. For the variants V2, V3, V4 the closure is a ledger over recalled formulas, as the author states; it is not a no-go theorem. No step assumes RH or GRH (GRH appears once as a conditional remark in V3 and is not used), nothing restates verified height, no statement about zeros is made. Lemma R is a standard computation and should carry the label CLASSICAL (C2 below).

## Re-derivation of the PROVED steps

**C1. CONFIRMED.** Even Maass form: Lambda(s) = pi^{-s} Gamma((s+it_j)/2) Gamma((s-it_j)/2) L(s) = Lambda(1-s). For real s and real t_j != 0 the gamma product is abs(Gamma((s+it_j)/2))^2, finite and positive for every real s (no pole, since t_j != 0), so L(1/2-a) = g L(1/2+a) with g > 0, for every real a, not only abs(a) < 1/2. Hecke eigenvalues are real, so L is real on the real axis. Odd forms: root number -1 with shifted gamma factors, product <= 0. Eisenstein member: the four-factor product equals abs(zeta(1/2+a+it))^2 abs(zeta(1/2-a+it))^2 = abs(E_a(1/2+it))^2. Numeric spot check (mpmath, 20 digits): gamma ratio at t = 13.7797513519 and t = 30, a = 0.1, 0.3, 0.45, 0.8: 1.1700, 1.3671, 1.6018, 2.5548, 2.0274, 4.0836, 3.5151, 12.1999, all positive with imaginary part below 1e-20; Eisenstein product positive in all eight cases (0.00643 to 3.51).

**Lemma R. CONFIRMED.**
- (R0) to (R1): sum_n f(n) e(nx/c) = sum_j fhat(x/c - j) (Poisson with fhat(y) = int f(u) e(uy) du). M = x - jc runs once over all integers coprime to c as x runs over reduced classes and j over Z; xbar = Mbar mod c. For c = 1, M = 0 is admitted (gcd(0,1) = 1) and gives fhat(0) w(1); for c > 1 it is excluded. Matches (R1).
- (R1) to (R2): mbar/c + cbar/m = 1/(mc) mod 1 for coprime positive m, c. For m = -m' < 0: e(l mbar/c) = e(-l/(m'c)) e(l cbar/m'), fhat(-m'/c). So G^{+-} as stated. Class r mod m (reduced), Poisson: sum_{c = r mod m} G(c) = (1/m) sum_k Ghat(k/m) e(-kr/m). Sum over r of e((-+l rbar - kr)/m) = S(-+l, -k; m) = S(l, +-k; m). Matches (R2), including the pairing of the sign of k with the sign of m.
- The term fhat(0) w(1) is carried unchanged. Correct.

**P2-a. CONFIRMED.** 1/2 + i t_rho = rho, 1/2 - i t_rho = 1 - rho; both are zeros; M_t is entire in t; B(t_rho) = -1. The region of absolute convergence (1/2 - Im t > 1 and 1/2 + Im t > 1) is empty. The conclusion "no comparison region in the t-variable" follows.

## Numeric rerun (different cases, independent code)

Own script (not the author's): f(u) = exp(-pi((u-u0)/s)^2), w(c) = (c/c0)^2 exp(-pi((c-c0)/sig)^2) (non-Gaussian in c), c <= 40, abs(n) <= 70, abs(m) <= 3c in (R1), m <= 120 and abs(k) <= 6m + 10 in (R2), trapezoid grid h = 1/400 on (0, 60) (24000 points, under 2 MB).

| l | u0 | s | c0 | sig | (R0) | abs((R0)-(R1)) | abs((R1)-(R2)) | k != 0 part of (R2) |
|---|---|---|---|---|---|---|---|---|
| -7 | -2.7 | 4 | 9 | 1.5 | 4.756028396229 | 7.8e-15 | 1.1e-14 | -0.15862 |
| 10 | 1.9 | 5 | 6 | 0.9 | 1.100297920907 | 7.1e-15 | 5.4e-15 | 0.32219 |

The three sides agree to 1e-14; the Kloosterman (k != 0) part is 3 and 29 percent of the total, so the test is not carried by the Ramanujan terms. The author's table (four cases, 1e-13) is consistent with this. Like the author's check, this tests the identity at small size only, not the asymptotic length table.

## Corrections

**C1. Hypotheses of Lemma R are incomplete as written.** "A weight w on c >= 1" is not enough for (R2): G^{+-}_m(c) must be a function of a real variable, so w must be given as a smooth function on (0, infinity) with rapid decay at infinity (as c grows fhat(m/c) tends to fhat(0), so decay of G comes from w alone). Each term Ghat^{+-}_m(k/m) depends on the chosen extension of w between integers; only the total is extension-independent. The rearrangement from sum over c to sum over m needs sum_c abs(w(c)) c < infinity. The clause "when fhat decays faster than any power" is automatic for Schwartz f. With these hypotheses the proof is complete. In the numeric checks they hold.

**C2. Lemma R is classical.** Poisson in n, additive reciprocity, Poisson in the modulus is the standard opening of reciprocity arguments (Conrey-Iwaniec, Young, Blomer-Khan, Petrow use the same three steps on sums of Kloosterman sums). The result does not claim novelty, but the label should read CLASSICAL (re-derived), and the map row should not suggest a new identity.

**C3. "The composite is the functional equation of L(s, phi_j)" is not proved.** It is supported by matching of ranges only (n k of size T^2; Kuznetsov range for the pair (k, l)); the transform of the test function under (R0) -> (R2) was not computed and not compared with the Bessel transform of the dual half of the approximate functional equation. The author lists this as weak step 2; the summary line and the map row state it without the qualifier in one place ("the composite is the functional equation in the n-variable"). What is proved is weaker and sufficient for the verdict: l is not moved by either step.

**C4. Length table.** Row (R2) at N = T gives k in [T, T^2] and m up to X; the count of (k, m) per l is up to T^{A+2} over the full n-range, larger than the T^{A+1/2} of (R0); "same shape" is correct only per dyadic block n of size N, k of size T^2/N. The correction to the n4 range (m <= sqrt(l) for A > 1) depends on the stationary relation m = sqrt(l/n), which is argued and not computed; it contradicts a range the n4 referee confirmed at exponent level and neither version was tested. It does not change the count l/T per l, so the test "(R1) has T^{2A-1} terms per l against T" is unaffected: equal at A = 1, longer for A > 1. Exponent arithmetic rechecked: c <= sqrt(N l)/T = T^{A-1/2}, n c = T^{A+1/2}, m c <= l/T = T^{2A-1}.

**C5. Section 4 is recalled, and one sentence in section 1 is unsupported.** "Weight 3 is the lowest weight for which a reciprocity formula with an L-function family on the dual side exists" is asserted without proof or reference. V3 (twisted Motohashi with a unit spectral window, the form of P_l, the kernel k_T), V4 (Blomer-Khan with q = 1) and the classification of Humphries-Khan and Kwan were not derived and were not checked here against the sources either. One consistency check done here: in Motohashi's correspondence the cubic shifts are s_1 = (z_1+z_2+z_3+z_4-1)/2, s_2 = (z_1+z_4-z_2-z_3+1)/2, s_3 = (z_1+z_3-z_2-z_4+1)/2 (from memory); z = 1/2 + (0, 0, a, -a) gives (1/2, 1/2-a, 1/2+a), which agrees with the table entry "zeta^2 times conj(E_a)" for shifts (a, -a, 0). The quoted range "twist length T^{1/2-eps} in ab, A <= 1/4" matches the Watt-based and Bettin-Bui-Li-Radziwill results (mollifier length T^{1/4}) as recalled; Hughes-Young alone gives a shorter range. Status of "no variant gives A > 1/2": ARGUED over a finite list, as the author says in weak step 3.

**C6. Control rates are not computed.** "False for E_a at rate X^{2a}" and "false for T-NR at rate X^{2(sigma_q - 1/2)}" rest on the unproved detector P2 and on no computation. The screen establishes only: E_a (real a) passes C1 (proved here), and T-NR passes the weight-1 positivity because 2 cosh(it log q) + c = lambda_t(q) + c and (lambda(q) + c)^2 = lambda(q^2) + 2c lambda(q) + 1 + c^2 (Hecke relation at a prime; checked). "Passes K0 with the coefficients of 1/(L(s+a) L(s-a))" and "passes the identity" are plausible and not derived. Since nothing zeta-only is claimed, no further control run was needed; the flag R3 = false does not depend on these rates.

**C7. P2-b.** The two-constants or Cartan-type argument gives measure of {abs(zeta(1/2+it)) < T^{-K}} in the window at most exp(-cK) uniformly in T; the result says "tending to 0 as K grows" without the uniformity and without a constant. Label ARGUED is appropriate; the threshold "A > 1 + 2K_0" is a sketch and not a result.

**C8. Inherited, not checked here.** The n4 mollifier M_j = sum_{d m^2 <= X} mu(d) lambda_j(d) (d m^2)^{-1/2} is not the partial sum of 1/L(1/2, phi_j) (the Euler factor of 1/L is 1 - lambda(p) p^{-s} + p^{-2s}; the unrestricted m-sum gives (1 - lambda(p) p^{-s})/(1 - p^{-2s})). P2-a speaks of "the Dirichlet series of 1/(zeta(s+it) zeta(s-it))"; the anchor B(t_rho) = -1 holds for any finite M_t, so P2-a is unaffected, but any later detector statement must use the actual M.

## Requirement flags (set by this referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No result is derived that uses multiplicativity; in the degree >= 4 variants positivity follows from the functional equation alone (C1). |
| R2 | false | No bound for any A > 1/2; nothing uniform in height is obtained. |
| R3 | false | E_a (real a) passes positivity in the variants with a dual family; T-NR passes positivity and linearisation; several controls are not formulable. |
| R4 | false | No passage to the critical line; unconditional range remains A = 1/2; detector P2 open. |

## Summary

- PROVED and confirmed: C1; Lemma R (with the hypotheses of correction C1; classical); P2-a; "l is not moved, A -> A" for the weight-1 dual.
- MEASURED and reproduced: Lemma R to 1e-14 on two new cases.
- ARGUED, not confirmed by computation: length table, identification of the composite with the functional equation, P2-b.
- RECALLED, not checked: V2, V3, V4, Humphries-Khan, Kwan, quoted ranges.
- The verdict (no A > 1/2 from the listed reciprocity formulas; P2 open; lead 4 closed as a ledger entry, not as a theorem) stands.
