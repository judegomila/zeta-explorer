# REFEREE: c4-kloss-marks-scaleup

Adversarial referee, lens: general. 2026-11-18. Only this file was written. All reruns were local, under
`scripts/memcap.sh 8`, with independent code (python-flint exact rationals, numpy, mpmath); the compute server was
not used. The stored `.npz` matrices were read as data; the build (`klib.c`) was not rerun.

**Verdict: the claimed verdict (partial result) holds.** Lemma O is correct. The certificates are arithmetically
correct for the stored matrices under the stated error model. The overlap decomposition is reproduced on cases the
lane did not report. No statement about zeros of zeta is made, RH is not assumed, verified height is not used.
Five label or presentation errors (E1 to E5) follow; none changes the verdict or an exponent.

Flags set by me: R1 false, R2 false, R3 false, R4 false (same as claimed).

## Errors

**E1 (label: "a priori" coefficient bound; section 3.3).** The Gauss sum bound "error at most 2.2e-15 sqrt(p)
<= 6.3e-12" is not an a priori bound for the code as written. `gauss_split` accumulates p/6 cosines sequentially
into each of three doubles. The worst-case bound for sequential summation is N u max|partial sum|; with partial
sums of size up to sqrt(p) (I measured max|partial| = 600 to 1340 at p = 8191969, 8191867) this is about
1.1e-10 to 1.3e-10 after normalisation, above the 1e-11 used for EPS_W, and it needs a bound on incomplete sums
that is not stated. The figure 2.2e-15 sqrt(p) is a random-rounding estimate. Also `max||g| - 1|` tests the
modulus only, not the phase.
What I measured (sequential float64 sum against a 40-digit mpmath sum, three accumulators, p = 8191969, 8191867,
2047993): normalised error 5.5e-14, 2.4e-13, 5.8e-14. So EPS_W = 1e-11 holds with a factor about 40 in these
samples, and the brackets are correct in practice. The label should read "measured error model", not "a priori".
Effect if a worst-case value (about 1.3e-10 per Gauss sum) were used: eta at Z = 8.192e6 is dominated by
(Cn + 16) u = 2.3e-10, so eta grows by a factor of about 1.5 to 3 and the headline width goes from 5e-5 to about
1e-4. No digit quoted in the table of section 4.1 (four decimals) changes.

**E2 (precision of the residual statement; claim line and section 5.2).** "After subtracting On the largest
eigenvalue is 0.990 to 1.002 times (1 + sqrt(n/R))^2" is numerically right but has little resolution: a residual
with no noise at all (identity matrix) gives 1/MP = 0.867 to 0.996 on the same 40 cases, which overlaps the
quoted band. The discriminating quantity is the excess (lambda_max(Gn - On + I) - 1)/(MP - 1). Recomputed from the
stored `overlap_*.json`: A' 0.71 to 1.07 (mean 0.92); Rc 0.65 to 1.00 (mean 0.83); K4a 0.82 to 1.44; Q 0.75 to
1.28; QRc 0.71 to 1.85; for comparison (lambda_max(Gn) - 1)/(MP - 1) without subtraction is 3.1 to 12.8 for A'.
So the supported statement is: the residual excess is at or below the independent-vector excess, within 30%,
and the overlap term removes 70% to 92% of the total excess. "Explained to within 1%" (section 5.3) refers to
lambda_max, not to the excess, and should say so.

**E3 (ARGUED asymptotic used outside its range; section 5.1 and item 2).** "On[p, p'] = (N(p) N(p'))^{-1/2}
(1 + o(1))" holds in the natural slots (my recomputation of On sqrt(N N') over all off-diagonal pairs: 0.887 to
1.070 at Z = 128000, 0.945 to 1.017 at 512000, 0.990 to 1.002 at 2.048e6, 0.995 to 0.998 at 8.192e6). In the
widened slot at Z = 128000 (160 marks, norms to 1039) it fails: 143 pairs have On = 0 exactly (for example norms
907 and 1021: N(p) N(p') = 9.3e5, X = 6.45e6, the remaining cofactor would need norm in (1.39, 6.96), where there
is no admissible ideal and the weight vanishes at norm 1), and 3416 of 12720 pairs lie outside [0.8, 1.25]
(maximum 1.465). The regression in section 5.2 uses the true On, so the measured kappa is not affected; what is
affected is the reading "1 + sum 1/N(p)" for the widened slots, and the widened slots at Z = 128000 test a regime
where the third cofactor has norm below 10. The elementary upper bound On[p, p'] <= C (N(p) N(p'))^{-1/2} (sum
over m in (0.2 Y, Y] of (number of ideals of norm m)/m is bounded for every Y >= 1) is what "bounded in a dyadic
slot" needs; it is true but is not written in Lemma O. The claim line attributes the boundedness to Lemma O; it
follows from Lemma O (ii) plus this bound plus the prime ideal theorem (CLASSICAL).

**E4 (fit presentation; item 1 and section 4.1).** (a) The standard error +- 0.004 on four points is not a
statistical error: the four values alternate (1.127, 1.108, 1.130, 1.108) because they follow the deterministic
quantity lambda_max(On) of each slot (1.1201, 1.1129, 1.1287, 1.1085). The informative numbers are the ratios
(certified mu/tr)/lambda_max(On) = 1.0064, 0.9956, 1.0010, 0.9996. (b) The comparator "+0.24 for the mark count"
is fitted on 10 points from Z = 1000, the headline exponent on 4 points from Z = 128000; on the same 4 points the
mark count exponent is +0.29 (n = 10, 15, 24, 33; my least squares). The comparison stands either way.
(c) The flatness of mu/tr in Z is in large part the regime n << R: the trivial bound is n, the noise term is
sqrt(n/R) <= 0.02, and a generic n-dimensional family of column combinations has Rayleigh quotient close to the
mean. The K and Q0 controls show that alignment with a pole is detected; nothing else is tested. This is stated
in weakest step 3 and section 6.3, and should be read with the headline.

**E5 (certificate code: unaccounted float rounding, harmless).** `cert.py` forms `np.diag(Dd + delta) - G` and
`D2 = Dd + delta + nrm_eta` in float64, then runs the LDL test on the first and reports the second. The docstring
says "exact midpoints"; the diagonal subtraction and the two additions are rounded (relative 1e-16). The slack
1e-6 ||eta||_F covers this in every case I checked (below), so no certificate is invalid. The RESULT count "305"
is confirmed (305 runs in `cert_*.json`, all `certified = true`). In 21 runs of Q0 the stored sign-vector lower
bound exceeds the stored unimodular lower bound by 1e-9 to 3e-7 relative; both are valid lower bounds, the larger
should have been reported as the lower end.

## Confirmed

**Lemma O (PROVED): re-derived, correct.**
(i) sum_p a_p x_p(m) = sum_c b_c chi_c(m) sum_{p | c} a_p, so a* G a = Q(b d_a). (ii) The terms c = c' of
G[p, p'] = sum_{c, c'} b_c conj(b_c') 1_{p | c} 1_{p' | c'} sum_m chi_c(m) conj(chi_c'(m)) are
sum_{c : p, p' | c} |b_c|^2 r(c) since |chi_c(m)|^2 = 1_{(m, c) = 1}. This is the Gram matrix of the vectors
(b_c 1_{p | c} 1_{(m, c) = 1}) indexed by (m, c); it is positive semidefinite with non-negative entries, so for
|a_p| <= 1 the form is at most 1^T G^d 1, attained at a = 1; the two sums follow from sum_{p, p'} 1_{p | c}
1_{p' | c} = omega_P(c)^2. (iii) from (i) and |d_a(c)| <= omega_P(c). Remark: the lemma is the standard
opening of the square with divisor-type coefficients; the result labels it elementary and does not claim more.
The matrix On in the measurements is built without the factor r(c) and is normalised by the diagonal of G, not
of G^d; the difference is of relative size 1/N(p) and does not affect the stated comparisons.

**Certificates: independent recheck, four cases (two not in the headline).** With my own eta from the stored
`Wabs1`, R, Cn, and exact rational LDL (fmpq, real 2n x 2n embedding) of diag(D) - G - ||eta||_F I using the
stored D, and a 300-bit evaluation of a* G a minus sum(eta) for the stored angles:

| file | n | variant | exact positive definite | my bracket for mu/tr | stored bracket |
|---|---|---|---|---|---|
| g_Z8192000 | 33 | A' | yes | [1.1080957, 1.1081293] | [1.1080804, 1.1081293] |
| g_Z2048000 | 49 | A' | yes | [1.2066280, 1.2066345] | [1.2066273, 1.2066345] |
| g_Z512000 | 40 | K | yes | [22.2337394, 22.2337403] | [22.2337393, 22.2337403] |
| x_Z2048000 | 24 | Rc | yes | [1.1251715, 1.1251751] | [1.1251706, 1.1251751] |

||eta||_F / lambda_max = 1.17e-5, 1.78e-6, 1.12e-8, 1.25e-6, as stated. The stored lower ends are slightly more
conservative than mine. Headline widths recomputed from the JSON: 1.0e-7, 5.5e-7, 4.9e-6, 4.9e-5.

**Build consistency (not reported by the lane).** The 41 (40) common marks of the independent runs
`g_Z128000`/`w_Z128000` and `g_Z512000`/`w_Z512000` agree to 3e-16 to 7e-16 relative (A', K4a, Q). The AVX-512
kernel test `t_Z512000_lean4` agrees with `g_Z512000` on the 15 natural marks to 1.1e-15. `t_Z32000` agrees with
n2's stored `gram_Z32000_M1.0_l0.333.npz` to 1.1e-15 (A'), 3.7e-15 (K), 2.7e-15 (R). The Z = 8.192e6 run has no
second run at its own size; its support is the kernel test at 512000 and the overlap prediction below.

**Overlap matrix: independent recomputation.** From the definition alone (count of squarefree ideals coprime to
6 and to the marks, by norm, weight bump^2/norm; no use of `scale.py` data structures), Z = 128000:
Dp[0] = 3.159080147882e-03, Dp[2] = 2.880506723686e-03, Ov[0,1] = 5.047723235659e-05 (two conjugate primes of
norm 61), Ov[0,2] = 4.614286723769e-05 (norms 61, 67). All four equal the stored values to 13 digits.

**Overlap regression on different cases.** Mark subsets the lane did not use (upper half of the built marks;
odd-index marks), Z = 512000, 2.048e6, 8.192e6: kappa = 0.950 to 1.028 for A' (6 cases), 0.975 to 1.026 for Rc,
0.427 to 0.563 for K4a. Slope of the imaginary part on On: |slope| <= 0.06 in all cases. For A' and Rc the
real residual and the imaginary part have the same size (rms sqrt(R) = 0.62 to 0.76 each), as for isotropic
noise of independent-vector size; for K4a the real residual is larger than the imaginary part (1.0 to 2.2
against 0.67 to 0.89), which confirms a structured real term there (section 6.4, unexplained, as stated).
1^T G 1 / tr G is within 0.002 of lambda_max(Gn) in all A' and Rc cases.

**Arithmetic of the tables.** (lambda_max(On) - 1)/sum 1/N(p) = 0.883, 0.919, 0.951, 0.966: matches. 1 +
log(log 2P / log P) at Z = 128000: 1.1628: matches. Natural slot at Z = 8.192e6 has 33 marks (16 split rational
primes in [202, 403] and the inert prime 17): matches. Exponent of A' on the 4 new points, my least squares:
-0.0023: matches. sum over prime ideals of norm in [P, 2P] of 1/N = log(log 2P / log P) + o(1) is the prime
ideal theorem for Q(omega) (CLASSICAL).

## Controls

No zeta-only mechanism is claimed, so the campaign controls (Davenport-Heilbronn, backward heat, sign twist,
unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w) have nothing to
act on; section 6.1 says this correctly. The relevant control is the lane's own: random unimodular coefficient
per column (Rc) behaves as the manuscript row. I confirmed this on the stored matrices (kappa and residual
above; certified bracket for Rc at Z = 2.048e6, n = 24). The measured property is therefore not specific to the
theta coefficients, and the result says so (sections 6.2, 6.3, 8).

## What stands

- Certified values of mu(G)/tr G for the stored matrices, to the stated widths, under a float64 error model
  that is measured rather than a priori (E1).
- mu/tr at the natural slot equals lambda_max(On) to within 0.7% at the four sizes; exponent in Z consistent
  with 0 over a factor 64 in Z, against growth for the two pole controls.
- Lemma O. The principal part has ratio 1 + (weighted pair overlap), bounded in a dyadic slot and of size
  log log over all primes (Lemma O (ii) plus an elementary bound not written in the lemma plus the prime ideal
  theorem).
- The off-principal part is of independent-vector size or below at the sizes tested (excess ratio 0.71 to 1.07
  for A'). This is MEASURED and is the content of Conjecture WLS; it is not proved, and random column
  coefficients satisfy it equally.
- Support for the conditional model value 31/36 is of the kind "not contradicted at 10 to 33 marks with n << R".
  13/15 remains the value relative to proved inputs. No abscissa moves. No statement about zeros.

## Requirement flags (set strictly)

- R1 false. Multiplicativity enters the construction of G only; the measured property holds for random column
  coefficients and for a quadratic character.
- R2 false. No height-aspect statement.
- R3 false. No control is failed for a structural reason; the generic coefficient system passes as the
  manuscript row does.
- R4 false. Ceiling of the informed system is the model floor 31/36.

## Three weakest points after this review

1. The test regime is n << R with one slot and no cube completion. In it a generic family passes; only a pole
   in the marked direction fails. Losses carried by the omitted structure, or by many slots (products of the
   factors of Lemma O), are not visible.
2. The certificates enclose mu of the computed matrices under a measured float64 model (E1). The Z = 8.192e6
   matrix comes from a single run.
3. The absence of a structured off-principal term for A' is established to about 5% of On (kappa 0.92 to 1.05),
   while the neighbouring systems K4a (0.43 to 0.59) and A (1.07 to 1.30) do carry one. The mechanism is not
   derived, so there is no argument that the A' value is exactly 1.
