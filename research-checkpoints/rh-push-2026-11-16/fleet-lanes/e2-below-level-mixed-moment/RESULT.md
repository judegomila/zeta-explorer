# e2-below-level-mixed-moment: the 7/8 architecture x the below-level mixed moment x the critical-count saddle

Internal working note, 2026-11-18. Unrefereed. Nothing committed or pushed; writes only in this directory.
Everything is relative to four unrefereed texts: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`,
line numbers below refer to it), Liu arXiv:2610.12234, Xu-Sang arXiv:2610.15291, Liu arXiv:2610.26835 ("Liu II",
`../bypass-78/dl/2610.26835.txt`). RH is open. No zero-free abscissa below 0.874886647 is proved. 7/8 remains the
Lean-checked value.

**Verdict: partial result (MEASURED + MODEL + one corrected reading). The decisive test does not kill the
combination and does not prove anything.**

1. MEASURED. On the sextic residue-symbol family over Z[omega], the mixed moment has exponent
   E = 1.000 +- 0.002 at total length 1.164 (m = m*) and at 1.246 (m = 1/2), for U from 1e6 to 1e9, and it equals
   the random-multiplicative-row baseline (ratio 0.87-0.88, flat). The thresholds are 1.1366 and 1.1452.
2. MODEL. With the hypothesis H(lam) of section 3 as input, the scalar system returns: no change for
   lam >= 0.8334; 0.87409 at lam = 0.75; 0.87250 at lam = 0.6; 0.87170 at lam = 0.5; 0.86918 at lam = 0.25;
   13/15 = 0.866667 for lam <= 0.1 (optimistic conventions). With the gates of Liu II Remark 14.1 as written,
   the value stops at 0.8730210 for every lam <= 0.6. None of these is a bound.
3. First lemma, decided: the "+ z_0" charge is **not** a triangle-inequality loss. It is the term L in the
   quadratic-cubic norm bound (manuscript Lemma 14.2), used at short dual length; the triangle inequalities in
   Lemma 14.3 and in Liu II Theorem 11.2 are lossless. This corrects section 5.1 of `r3-critical-count`.
4. H(lam) for lam < 1 is a mean-square saving for a polynomial longer than the family. By Markov it is a
   density estimate for the twist family (for lam < delta it gives counts below the density-hypothesis value).
   It is expected under GRH for the twists; no method for it is known. The combination therefore exchanges one
   open density-type statement for a movement inside [13/15, 0.874887]. It does not approach 1/2.

Labels: PROVED / CLASSICAL / PROVED-rel (relative to the sources as written) / READ (reading of the source, not
re-derived) / MEASURED / MODEL (price of an unproved input; float LP) / ARGUED / OPEN.

---

## 0. Plan

Combination: (a) the 7/8 architecture, in which a mean value over the row family gives a statement at every
height; (b) the mixed moment sum_u |M_{r*} S_m|^2 << U^E found by the referees of `r3-critical-count` (R3) and
`r3-lemma181-b` (E1); (c) the exact saddle R_c = 0.5903324 at (r*, m*) = (0.745700, 0.418254).

New relative to the lanes read (r3-critical-count, r3-lemma181-a, r3-lemma181-b, r3-method-limit, SYNTHESIS_R3
sections 4.2, 4.3, 5): the moment had not been measured; it had not been priced in the full system; the "+ z_0"
attribution had not been checked against the text.

Order of work: decisive test (section 1), first lemma (section 2), price (section 3), controls (section 4).

## 1. Decisive test: the mixed moment on the sextic twist family. MEASURED

Code: `mixmom.c` (single thread, peak memory below 200 MB, run through `scripts/memcap.sh 8`), `analyse.py`;
outputs `out/U*.json`, `analyse.log`.

Setup.
* Rows: u = a + b omega with u = 1 mod 3, U < N(u) <= 2U (about 0.403 U rows). Rows with 64 | u or
  p^6 | N(u), p = 7, 13, are dropped (this removes all rows divisible by a sixth power in the range, and a
  negligible set of others). All rows for U <= 3e6 (1,208,866 rows at 3e6); random samples above
  (150,000 / 60,000 / 40,000 / 8,000 rows at 1e7 / 3e7 / 1e8 / 1e9).
* Columns: ideals n coprime to 6; chi_n(u) = product of chi_pi(u)^v, chi_pi(u) = the sixth root of unity
  congruent to u^{(N pi - 1)/6} mod pi (zeta_6 = 1 + omega), zero if pi | u.
* M_r(u) = sum mu(n) chi_n(u) W(N n / U^r) N(n)^{-1/2}, r = 0.7457; S_m(u) = sum chi_n(u) W(N n / U^m) N(n)^{-1/2},
  m = 0.418254, 0.5, 0.21; W(x) = sin^2(pi(x-1)) on [1,2]. At U = 1e9 M_r has 1,451,950 terms (norms up to 1.0e7).
* Coefficient variants of M: mu; random signs on the squarefree support; mu(n) tau(n) with tau completely
  multiplicative, random sixth roots at primes (twisted target).
* Baseline rows: independent uniform sixth roots at every prime, fresh for each row, same code path and weights.

Results for Moebius coefficients (mean over rows of |M S|^2; the family sum is 0.403 U times the mean, so
E = 1 + slope of log mean in log U):

| U | rows | mean, m = m* | true/baseline | mean, m = 1/2 | true/baseline | max/mean (m*) |
|---|---|---|---|---|---|---|
| 1e5 | 40,291 (all) | 4.912e-3 | 0.900 +- 0.012 | 5.110e-3 | 0.866 +- 0.012 | 42 |
| 1e6 | 402,942 (all) | 5.092e-3 | 0.869 +- 0.004 | 5.060e-3 | 0.875 +- 0.004 | 121 |
| 3e6 | 1,208,866 (all) | 5.081e-3 | 0.881 +- 0.002 | 5.071e-3 | 0.873 +- 0.002 | 84 |
| 1e7 | 150,000 | 5.060e-3 | 0.866 +- 0.007 | 5.095e-3 | 0.871 +- 0.007 | 113 |
| 3e7 | 60,000 | 5.073e-3 | 0.878 +- 0.010 | 5.070e-3 | 0.872 +- 0.011 | 68 |
| 1e8 | 40,000 | 5.139e-3 | 0.872 +- 0.013 | 5.108e-3 | 0.876 +- 0.013 | 62 |
| 1e9 | 8,000 | 5.258e-3 | 0.903 +- 0.031 | 5.195e-3 | 0.881 +- 0.031 | 60 |

Fits (weighted least squares, standard errors from the row variance):

| quantity | U >= 1e5 | U >= 1e6 |
|---|---|---|
| E - 1, m = m* (Y = 1.1640), true rows | +0.0038 +- 0.0012 | +0.0005 +- 0.0015 |
| E - 1, m = m*, baseline rows | +0.0052 +- 0.0012 | -0.0007 +- 0.0015 |
| slope of true/baseline, m = m* | -0.0013 +- 0.0017 | +0.0012 +- 0.0022 |
| E - 1, m = 1/2 (Y = 1.2457), true rows | +0.0002 +- 0.0012 | +0.0021 +- 0.0016 |
| slope of true/baseline, m = 1/2 | -0.0009 +- 0.0017 | -0.0005 +- 0.0022 |
| slope of true/baseline, twisted mu tau, m = m* | +0.0007 +- 0.0016 | +0.0007 +- 0.0021 |
| slope of true/baseline, random signs, m = m* | +0.0017 +- 0.0015 | +0.0020 +- 0.0019 |

Readings.
* E = 1.000 +- 0.002 at both lengths. Required: E < 1.1366 (m*), E < 1.1452 (1/2). The hypothetical perfect
  large sieve would give 1.1640 and 1.2457: a factor 9.6 to 30 above the measured mean at U = 1e6. Not seen.
* The ratio 0.87-0.88 to the baseline equals the product of the single-factor ratios (0.94 x 0.93,
  `analyse.log` last table): it is the coprimality loss chi_n(u) = 0, not a correlation of M and S.
* A detected class of the size the saddle allows (U^0.590 rows with |M S|^2 at U^0.546 times typical size)
  would raise the mean by U^0.137 (6.6 at 1e6; 17 at 1e9). In the complete families U <= 3e6 the largest
  single value is 121 times the mean (U^0.35 at most); the detector level U^0.546 is 1,900 to 3,450 times the
  mean. No row of the complete families is at the detector level.
* Moebius, random-sign and twisted-Moebius coefficients behave the same. The statistic does not see the
  Moebius function or the target.
* The at-level piece (b = 0.21, Y = 0.956): ratio to baseline 0.84-0.94, no trend (the absolute mean moves
  with the 2 to 23 terms of S_b, so only the ratio is meaningful).

What this does not show. It is a finite range (complete families only to 3e6), one twist (nu = 1, t = 0), one
weight. A power fit over six decades cannot exclude a slowly growing factor. The test could only have killed
the combination (by showing E near the large-sieve value); it did not.

## 2. First lemma: the "+ z_0" charge. READ; decision ARGUED

Source statements.
* Lemma 17.2 (l.6991-7012), hypotheses (17.2): q_{r_rho} <= Z^{F_0 - M - z_0 - c}, 3M + 6 z_0 + c <= 4 F_0.
  With D' = r + z, M = 2D' - m, F_0 = D', z_0 = z these are r + 2z <= m and 2r + 8z <= 3m (Lemma 17.1 /
  Liu II Theorem 11.2 / M1). PROVED-rel by substitution (same as `r3-critical-count` 5.1).
* Lemma 14.3, proof, first step (l.5901-5906): "remove the inactive slots by triangle inequality in the row
  Hilbert space. At such a slot the absolute coefficient mass is sum_{p in P_i} q_p^{-1} << Z^eps". This step
  costs Z^eps. It concerns inactive slots only (primes absent from the conductor; Corollary 14.1, l.5563-5610,
  gives them coefficient q_q^{-1}).
* Liu II Theorem 11.2, proof (l.3607 ff.): "The triangle inequality is taken in the row Hilbert space before
  squaring; the O(Z^{G+eps}) assigned tuples cancel Z^{-G}". Lossless; the margins improve by 2G.
* Where z enters: the active slots stay inside the row norm (14.16) and are bounded by Lemma 14.2 (l.5682),

    sum_k | sum_P a(P) q_P^{-1/2} sum_{n,b} beta(n,b) chi_k(nb)^3 chi_P(n)^{-2} |^2
        << (KNBL)^eps (K + NB) B { N + L + (NL)^{2/3} },

  which gives "+ z_a - u", u = min{v, z_a, (v + z_a)/3}, in E_ref (14.14). In the terminal step of Lemma 17.2
  (l.7443-7475): row branch E_ref <= M + z_a <= F - c (this is M + z_0 <= F, the first hypothesis); column
  branch with u = z_a uses the first hypothesis; the branch u != z_a uses the second, 4F - 3M - 6 z_0.

Decision. The "+ z_0" is the term L of Lemma 14.2 at dual length v below z_a (u < z_a), worst at v = 0. It is a
cubic large-sieve term, already smaller than the triangle bound NL. It is not removed by orthogonality for the
coefficients the lemma allows: by (14.3)-(14.4) each active mark carries the scalar -omega_{q,0} =
tau_{q,2} chi_q(eps_q)^{-2} (a normalised cubic Gauss sum, l.1531-1537) times chi_q(lambda^4 mu)^{-2}, and the
slot coefficients a(p) are arbitrary bounded numbers. At a fixed dual index mu the tuple sum
sum_P a(P) q_P^{-1/2} (scalar) has modulus up to L^{1/2} when a(p) is aligned with the conjugate scalar, which
is the row-branch value K L. ARGUED: this is alignment at one dual index; cancellation between dual indices
was not examined.

Consequences.
* Section 5.1 of `r3-critical-count` ("a triangle inequality over Z^{z_0} marked tuples costs Z^{z_0}") is a
  misreading. Its substitution check stands.
* (M1+) with c1 < 2 cannot be obtained for arbitrary bounded slot coefficients by the route of Lemma 14.2.
  For the coefficients of the application (a(p) = fixed finite-order character values on full annuli) the
  missing statement is cancellation in sum_p nu-bar(p) tau_{p,2} chi_p(lambda^4 mu)^{-2} q_p^{-1/2} W(q_p/L),
  a sum of cubic Gauss sums over primes, uniformly in mu. OPEN. For plain sums over all squarefree P with
  a = 1 the corresponding sum has the Kubota-Patterson polar size L^{5/6}, which would read u = z_a/3 at
  v = 0 and c1 = 5/3; this is a HEURISTIC remark, not derived.

First piece, stated with its hypotheses. OPEN.

  (FP) Let S be the excluded set and nu a fixed finite ray character with modulus supported in S (as in
  Lemma 17.2). Let W, W' be fixed smooth annular profiles. For u in O with 0 < q_u << Z^m put
    M_u = Z^{-r/2} sum_n mu(n) nu(n) chi_n(u) W(q_n/Z^r),   S_u = Z^{-b/2} sum_n nu(n) chi_n(u) W'(q_n/Z^b),
  n over primary ideals prime to S, the same sign convention eps_chi in both. If r, b >= 0, r + b <= m - c and
  b <= 0.21 m, then for every eps > 0
    sum_{0 < q_u << Z^m} |M_u S_u|^2 << Z^{m + eps},
  uniformly in bounded parameter ranges, with polynomial dependence on norm-twist heights.

  Known part (PROVED-rel, reduction not written out: SKETCH): if r + 2b <= m - c and 2r + 8b <= 3m - c, the
  part of S_u supported on n with a bounded number of prime factors, all of norm at least Z^eta, is a finite
  combination of products of prime sums and falls under Lemma 17.1. At r = 0.7457 m this is b <= 0.127 m.
  Not covered by any source: the Z^eta-smooth part of S_u (unbounded number of slots), and the range
  (1 - r)/2 < b <= min(0.21, 1 - r). The value 0.21 is the prime supply l/d of the probe.
  (FP) follows from GRH for the twists. By Lemma W of `r3-critical-count` (FP) alone does not move the saddle.

## 3. Price of the mixed moment in the exponent system. MODEL

Hypothesis H(lam), 0 <= lam <= 1: for every presentation used by the detector, all 1/2 <= r <= 1 and
0 <= m <= 1/2,

  sum_{q_u ~ U} |M_r(u) S_m(u)|^2 << U^{1 + lam (r + m - 1)_+ + eps}.

lam = 1 is a perfect large sieve (not known for r + m > 1 either); lam = 0 is Lindelof on average. At
(r*, m*): E = 1 + 0.163954 lam; E < 1.1366 iff lam < 0.8334. Section 1 measured lam = 0.00 +- 0.02.

Two PROVED (trivial) consequences, given H(lam). Prover fixes t = 1 in the detector (Liu II (13.14)): every
detected row has a pair (r, m_w) with 1/2 <= r <= 1, m_w <= 1/2, r + m_w >= 1, |M_r|^2 ~ U^{delta r},
|M_r S_{m_w}|^2 >= U^{delta (r + m_w)}.
* Chebyshev: the rows with pair (r, m_w) number at most U^{C3}, C3 = 1 + lam (r + m_w - 1) - delta (r + m_w).
* Cauchy-Schwarz (referee E1 of `r3-lemma181-b`): for every block length m,
  sum_B |S_m| <= U^{(R + 1 + lam (r + m - 1)_+ - delta r)/2}, R the count exponent of the sub-class.

System (`lp_mixed.py`; base system `../r3-lemma181-a/numerator_system.py`, float LP, bisection in B,
kappa = max(13/18, 2B - 1), free lengths, no gates, no prime-supply constraint). Each class (delta, x) is split
by r (26 values); the adversary chooses m_w:
  R_sub(r) = min(R_src, M1(r), max_{1-r <= m_w <= 1/2} min(M2(m_w), C3(r + m_w))),
  N(theta) = max_m min(P(m), F4(m), Fmix(m)), Fmix(m) = (R_sub + 1 + lam (r + m - 1)_+ - delta r)/2 - theta m.
Grid 61 x 13 x 26. Validation: source system 0.8748864 on this grid (exact 0.8748866); lam = 1 returns the same
value, as Lemma W requires.

| lam | E at (r*, m*) | B, count + numerator | count only | numerator only |
|---|---|---|---|---|
| 1 | 1.1640 | 0.8748864 | | |
| 0.9 | 1.1476 | 0.8748864 | | |
| 0.8333 | 1.1366 | 0.8747873 | | |
| 0.75 | 1.1230 | 0.8740912 | | |
| 0.6 | 1.0984 | 0.8725036 | | |
| 0.5 | 1.0820 | 0.8717019 | 0.8717019 | 0.8743114 |
| 0.4693 (= delta_c) | 1.0769 | 0.8714638 | | |
| 0.25 | 1.0410 | 0.8691838 | | |
| 0.1 | 1.0164 | 0.8666667 | | |
| 0 (measured value) | 1.0000 | 0.8666667 | 0.8666667 | 0.8727235 |

Second system with the gates (`lp_gates.py`; `../r3-critical-count/caps.py` balanced system, grid 141 x 21, count
lowered, numerator kept at K = (3R + 1)/4; reference 0.8748866 reproduced):

| lam | optimistic | with the gates of Remark 14.1 |
|---|---|---|
| 0.8333 | 0.8748360 | 0.8748360 |
| 0.75 | 0.8741425 | 0.8741425 |
| 0.6 | 0.8724894 | 0.8730210 |
| 0.5 | 0.8714146 | 0.8730210 |
| 0.25 | 0.8689237 | 0.8730210 |
| 0 | 0.8666667 | 0.8730210 |

Readings.
* The count carries the movement; the numerator line Fmix adds nothing once the count is lowered (columns
  "count + numerator" and "count only" agree at lam = 0.5 and 0).
* The model reaches the 13/15 floor of the current low side at lam <= 0.1 and stops there (SYNTHESIS_R3 2.2).
  With the written gates it stops at 0.8730210, the cap found in `r3-critical-count` for every stronger count.
* The full effect needs H(lam) on the whole range of pairs, not at (r*, m*) alone: with the hypothesis only
  near the saddle pair the adversary moves the pair and the gain is the local saddle slope times the width.
* For lam < delta the option C3 is below 1 - delta: H(lam) then gives counts below the density-hypothesis
  value. H(lam) with lam < 1 is not "at level" in the sense of Lemma E of `r3-critical-count`; by its
  Corollary W1' it is a density estimate for the twist family in another form.

Conditional statement (MODEL, not a theorem): if H(0.75) holds for all detector presentations, and the four
unrefereed texts and the unverified lemmas listed in OBSTRUCTION_MAP rows Z10-Z12 hold, the scalar system gives
0.87409 (free lengths) and 0.87414 (balanced, gated). The step from the scalar system to a zero-free half-plane
is the source's and was not rechecked here.

## 4. Controls and the three requirements

* Random unimodular rows (baseline): run. True rows and baseline rows give the same exponent and the same
  constant up to the coprimality factor. The mixed moment, as measured, is a property of any family of
  multiplicative unimodular rows of this size; it does not see the residue-symbol structure.
* Sign-twisted target: run on the moment (coefficients mu tau, tau completely multiplicative, random sixth
  roots): same exponent as mu. The LP has no target parameter, so "its own abscissa" cannot be produced by the
  LP. What separates targets in the architecture is unchanged: M1, M2 and the theta reflection are proved only
  for nu a finite ray character with modulus supported in S (Lemma 17.2 hypothesis), and the detector needs the
  target's continuation. A general sign twist fails there. The new input H(lam) is target-blind.
* DH, backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w: not run.
  No zero statement is made here. The combination inherits its behaviour on these controls from the 7/8
  architecture (OBSTRUCTION_MAP S1, Z18); the added input neither helps nor hurts, because it is control-blind.
* Requirement 1 (all primes together): M_r is a Moebius polynomial over all primes; satisfied by the input.
  Requirement 2 (uniform in height, every window): satisfied by the architecture; the input is a mean value over
  the row family, not over height. Requirement 3 (fails for the controls structurally): only through the
  architecture.
* End point. The input lives to the right of the method floors: best MODEL value 13/15. By
  `r3-method-limit` reaching 1/2 needs effective order 2 (h = r/2); a mean square over the sextic family does
  not supply it. Nothing here passes from the region right of 5/6 to the critical line.

## 5. Three weakest steps

1. The measurement is finite and coarse. Complete families only to U = 3e6; samples to 1e9 (8,000 rows there);
   one twist, t = 0, one weight; my reading of the row family (u = 1 mod 3, symbol chi_n(u), no reciprocity
   normalisation). The symbol code has internal checks (each power is verified to be a sixth root; single-factor
   means match the diagonal to 5-7%) but was not compared with `tmp/sextic/zomega.py`. A mean square cannot
   detect a set of rows thinner than about 1/(rows sampled). E = 1.000 +- 0.002 is a fit, not a bound.
2. The price is my formulation: the t = 1 split by r, the adversary restricted to one pair per sub-class, the
   Fmix line, the family H(lam) over all pairs. Float LPs, grids 61 x 13 x 26 and 141 x 21, optimistic
   conventions; the two systems differ by 3e-4 at lam = 0.5. No referee has checked that R_sub and Fmix are valid
   reductions inside Liu II sections 13-14 (in particular that the witness presentation of M_r and the
   numerator blocks S_m carry the same character, the nu != 1 issue of `r3-lemma181-a`).
3. The "+ z_0" decision is a reading of about 200 lines of a 170-page argument (Lemmas 14.2, 14.3, 17.2,
   Corollary 14.1, Liu II Theorem 11.2). The sharpness claim is alignment at one dual index only. The
   c1 = 5/3 remark is heuristic. The reduction of the rough part of S_b to prime slots is a sketch.

## 6. Next step if this lane is continued

Decide whether sum_p nu-bar(p) tau_{p,2} chi_p(lambda^4 mu)^{-2} q_p^{-1/2} W(q_p/L) has a power saving uniform in
mu (Heath-Brown-Patterson type). That is the exact form of (M1+) for the application's coefficients and is the
only place found here where the Moebius/Gauss-sum structure, rather than a control-blind mean value, could enter.
Price from `r3-critical-count`: c1 = 1.75 gives 6.3e-4, c1 = 1.5 gives 1.5e-3 (gated).

## Files

`mixmom.c`, `mixmom` (binary), `out/U*.json`, `analyse.py`, `analyse.log`, `lp_mixed.py`, `lp_mixed.log`,
`lp_gates.py`, `lp_gates.log`.
