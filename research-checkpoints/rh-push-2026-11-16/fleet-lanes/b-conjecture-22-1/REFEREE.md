# Referee report: b-conjecture-22-1/RESULT.md

Date: 2026-11-16. Adversarial pass, one referee. Scripts used: /tmp/ref22/{t1.py, r22_iv.py, r22_d1.py}
(numpy/mpmath/mpmath.iv, python3.14, single process, each < 10 min).

## Verdict

**Holds, with one overstatement to correct.** The verdict "dead as an RH lead" stands. Theorem HF is confirmed
(every step re-derived; no gap that changes the statement). The benchmark arithmetic is confirmed. The "exact
reduction" in section 4 and verdict items 3-4 is overstated: the bound D >= (M+1)/2 is a storage bound and refutes
reading S in class R only under the read-every-coefficient-per-evaluation cost model.

## Theorem HF: step-by-step re-derivation

- (Closure): confirmed. Hermite expansion, G_s = G_{s'} * G_{s-s'}, derivatives commute with convolution; exact
  degree is preserved (a_d != 0). Blockwise deconvolution is a semigroup, so f_{-delta} = G_tau * f_{-(delta+tau)}.
- (a) multiplicity lemma: confirmed. f_{-delta}(t0 + sqrt(delta) y) = sum_n f^{(n)}(t0) delta^{n/2} He_n(y)/n!;
  the series converges for delta < min s_j (terms ~ (delta/s)^{n/2}); leading term delta^{m/2} f^{(m)}(t0) He_m(y)/m!
  checked against He_m(y) = m! sum_k (-1)^k y^{m-2k}/(2^k k! (m-2k)!).
- (b): confirmed; VD is applied to g_eps, which is bounded, integrable, continuous and has finitely many sign
  changes by (c)+(d)+(e).
- (c): confirmed, including uniformity in eps (polynomial blow-up eps^{-d} of P_{c,eps} against e^{-(t-c)^2/2eps}).
- (d): confirmed.
- (e): confirmed. (h e^{-q})' = eps^{-1} e^{-q} (eps d/dt + (t-c)) h; phi_eps -> (t-c)^{d+1} h_0 in C^k(I);
  Rolle with multiplicity gives 2(d+1)+m. Requires I shrunk so that the (d+1+m)-th derivative of the limit is
  non-zero on all of I; this is available and should be said.
- (f) and the induction bookkeeping: confirmed. 2D_t - 2 follows since sum_W (d_j+1) >= 1.
- Gap, fixable, not stated: "f is not identically zero" is asserted but not argued. It follows from injectivity of
  Gaussian convolution plus (c) (g_eps != 0 for |t| >= R).
- d = 0 case equals Kalai-Moitra-Valiant (2N-2 zero crossings); their proof is the same heat-flow induction. The
  polynomial extension is a direct generalisation. Novelty against the total-positivity literature was not
  checked by the author or by me; "new" should read "not found in the repo record".
- (VD) theorem number in Karlin not verified (author says so).

## Numeric reruns (different cases)

- Interval-certified (mpmath.iv, 40 digits, sign decided only when the enclosure excludes 0): one wide Gaussian
  minus N-1 spikes with pairwise DISTINCT narrow widths s_k = (k+1)/100: >= 6 sign changes for N=4, >= 10 for N=6.
  Equals 2N-2. Sharpness for d=0 is certified on a case the author did not run.
- Narrow He_d block over one wide Gaussian, interval-certified lower counts: d=1..5 -> 2,4,4,6,6. All <= d+2, well
  below 2d+2.
- Float search (MEASURED), 4000 structured configurations, N <= 5, degrees <= 4, including all-centres-equal and
  integer-collision centres, polynomial roots placed inside the blocks, amplitude hill-climb: 0 violations. Cap
  attained with a positive-degree block: degrees [0,1], same centre, widths 0.31 / 12.05, 3 sign changes = cap 3.
  So the cap is sharp in at least one d>0 case (RESULT 3.5 says sharpness only for d=0; minor).
- D1 with complex b, 3 nodes, a = 0.1 and a = 0.75: direct Q_a = 0.1015876 / 0.3159001 (imaginary part 1e-28);
  zero-side partial sums 100/200/400 zeros approach from below; deficit * gamma_N / log gamma_N = 0.59-0.61 and
  1.84-1.90. Consistent with D1. Algebraic identity re-derived by hand: correct.

## Corollary 3.6 and benchmark

- Transform of class R: real polynomials, degree <= d_j, centres +-tau_j, variance 2 alpha_j. Confirmed (A even, B
  odd give real blocks; tau_j = 0 merges the pair). 2M <= 4D-2 gives D >= (M+1)/2. Confirmed.
- M = 12,363,153,437,138 -> ceil((M+1)/2) = 6,181,576,718,570. floor(sqrt(T0/2pi)) = 691,008. Ratio 8.9e6.
  Confirmed. No interval issue: integers only.
- M is the Platt-Trudgian count; it is used as data, not presented as new. No RH assumption anywhere.

## Errors and overstatements

1. **Section 4 / verdict items 3-4 (material).** "Class R: reading S is refuted" and "the only escape is complex
   widths" do not follow. D >= (M+1)/2 bounds storage. Class R contains multi-centre ladders (Gabor-type:
   blocks a_k e^{-(t-t_k)^2/4 alpha}); for these, a certified evaluation at one t reads only the O(polylog) blocks
   near t, because Gaussian decay beats the e^{pi(t-t_k)/4} growth of the coefficients. The comparison "6.18e12
   coefficients vs a 691,008-term main sum" sets total storage for all M sign changes against the cost of ONE
   Riemann-Siegel evaluation; the Riemann-Siegel cost of the same deliverable is about M * 691,008 = 8.5e18
   operations, which is larger than D. Section 3.6 carries the qualifier "under any evaluation model that reads
   each stored coefficient once"; the verdict and section 4 drop it. Correct statement: in class R the residual
   is (i) local evaluation, whose cost is the preprocessing that produces the coefficients (Odlyzko-Schonhage
   territory, as imp-33233 and the 2026-09-22 memory correction already say), plus (ii) the items listed in
   section 4. Theorem HF makes the storage floor rigorous; it does not turn regime (B) into a runtime refutation.
2. **D3 sign.** With zeta'/zeta = -sum Lambda(n) n^{-s}, the prime term of Q_a is
   -sum Lambda(n) n^{-1/2-a} 2 Re C_v(log n). The minus sign is missing, and "the prime term decreases as a grows"
   is ambiguous (its magnitude decreases; the term itself increases on tests with C_v >= 0). The conclusion
   "no lever" is unaffected.
3. **Section 2 label.** "PROVED (by inspection)" covers the true statement that each recorded argument uses only M.
   "22.1 does not imply RH and RH does not imply 22.1" is a statement about content, not a proved logical
   independence; the author's weak-step 3 says this, the verdict line does not. Keep the weaker wording.
4. **D2 (=>).** Positivity is assumed only at real nodes. The step "extends to a positive-real function on
   Re z > 0" needs: Pick interpolation on a set of uniqueness plus analytic continuation. Standard and correct,
   but one line is missing.
5. Section 2.2: Selberg's proportion is for zeros of odd order on the line, which is what M counts. Fine.
   The same storage-vs-single-evaluation caveat as item 1 applies to "reading S fails at every large height".

## DH control

Theorem HF, L1-L4 and D1-D3 make no use of the Euler product; confirmed by reading. Davenport-Heilbronn has zeros
with Re s > 1, so Delta_DH > 1/2 and damped positivity fails for DH at a = 3/8 and a = 1/2 by D2; the only
Euler-product input in section 6 is Delta <= 3/8. The content test in section 5 is valid: the sign-change-count
arguments apply identically to DH. Karatsuba's bound for DH is quoted without the exp(-c sqrt(log log T)) factor,
which the (log T)^{1/2-eps} form absorbs.

## Not checked

- The definition of E_a in the paper (22.4 <=> a >= Delta is taken from the atlas and imp-1210).
- Literature novelty of Theorem HF beyond KMV.
- Upper-bound side of the cap is float-only; only the lower (sharpness) side is interval-certified.

## Surviving claim

Conjecture 22.1 is a cost claim for certified numerics with no zero-location content; every recorded argument
uses only M and holds for DH; the memory-index "untapped lead" line is stale. Theorem HF (at most
2 sum_{non-widest}(d_j+1) + sum_{widest}(d_j+1) - 1 real zeros; sharp for d=0) is correct as written, with one
classical input, and gives the rigorous STORAGE floor D >= (M+1)/2 = 6,181,576,718,570 for real-width,
real-frequency ladders. It refutes reading S only in the read-every-coefficient model. Local evaluation in class R
and complex widths both reduce to known fast-zeta technology. Pivot: classical dictionary, numerically consistent,
no lever.
