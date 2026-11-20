# REFEREE: c20-referee-theorem-d-headline-and-r19 (lens: general)

Date: 2026-11-20. Target: `RESULT.md` of this directory and the seven `REFEREE2*` files it summarises.
Labels: PROVED (re-derived here), MEASURED (rerun here, local, through `scripts/memcap.sh 8`; scratch code in
`/tmp/c20-ref3/`, not kept in the repo), NOT RECHECKED. The compute server was not used.
Nothing here is a statement about a zero of zeta.

## Verdict

**Holds, with corrections E1 to E6 (wording and scope; no PROVED step is broken).**
Flags set by this referee for the lane: R1 false, R2 false, R3 false, R4 false. The lane is a referee lane and
makes no attack; its claim "partial-result" is accurate.

## 1. Steps re-derived (PROVED confirmed)

- Theorem D, chain (a) => (c) => (b) => (a). Normaliser: exp(E_1(w)) = e^-gamma w^-1 exp(Ein(w)), one simple pole,
  no zero. Identity right of 1: int_P^inf x^-s dx/log x = E_1((s-1) log P) by x = e^v. Bound abs(E_1(w)) <=
  e^(-Re w)/abs(w) for Re w >= 0. Partial summation with pi - li = O(x^(theta+eps)) (CLASSICAL) and the prime-power
  sum O(P^(1-2 sigma)). Vitali on the connected set Omega_theta, then Hurwitz. All confirmed. Corrections C1 to C3
  of the second referee are correct. The theorem assumes neither RH nor verified height; it is an equivalence
  with its target and is presented as not new.
- Lemma E. sum_{n>=2} abs(a_n) n^-2 <= zeta(2) - 1 = 0.645 < 1, so the log series converges absolutely on
  Re s >= 2 with sum abs(b_n) n^-sigma <= -log(2 - zeta(2)) = 1.035; the exponential stages are entire, zero-free
  and converge uniformly there. Confirmed.
- b_6 of Davenport-Heilbronn: coefficient of 6^-s in X - X^2/2 is a_6 - a_2 a_3 = 1 + kappa^2 = 1.0807009. Confirmed.
- Local zeros: T-NR, 1 + c u + u^2 = 0 at u = -e^(+-arccosh(c/2)), Re s = 1/2 +- arccosh(c/2)/log q, Im s = pi/log q.
  G_q: (1-u)^2 + (c_q+2) u = u^2 + c_q u + 1, roots u = -q^(+-1/4), Re s = 3/4 or 1/4. HQ2: (1-u)^2 = +- i sqrt(eps) u.
  Confirmed.
- Lemma N (one-line replacement): Phi has non-negative coefficients, radius r < 1 by the zero in abs u < 1,
  Pringsheim; a zero at r would give principal part k r/(x - r) -> -infinity from the left against Phi >= 0.
  Confirmed.
- Lemma P': abs(g(x)) <= sum abs(c_k) 2/abs(omega_k - x); Cauchy-Schwarz gives the factor m; norm(h)^2 = u norm(c)^2.
  rho(0) = (psi(1/4) - log pi)/(2 pi) = (-4.22745 - 1.14473)/6.28319 = -0.85501. Negative mass 2 abs(vartheta(x_0))/pi
  with the minimum of vartheta about -3.5309 gives 2.2479. Confirmed.

## 2. Numerical reruns with different cases (MEASURED)

- DH exponential stages, log coefficients computed by a different route (convolution powers of F - 1, 15 powers,
  N = 6e4): b_6 = 1.080700903149283 = 1 + kappa^2; b_10 = 0; b_12 = -0.3070. Relative error of the stage against
  DH (Hurwitz zeta) for N = 100, 1e3, 1e4, 6e4: at 2.5 + 30i: 6.1e-6, 2.0e-7, 1.7e-9, 1.5e-11; at 2 + 3i: 9.1e-5,
  1.5e-6, 1.0e-8, 7.6e-10; at 1.5 + 60i: 3.0e-3, 1.1e-4, 1.3e-5, 1.4e-6; at 4 - 7i: 1.1e-8, 2.1e-12, 5.3e-16, 2.7e-18.
  sum abs(b_n) n^-2 to 6e4 = 0.25956 (lane: 0.25956). Agrees with the lane.
- T-NR at a new case q = 3, c = 3: zero at 1.37604 + 2.85960i, abs = 1.2e-16.
- HQ2 at q = 7, eps = 0.2 from the closed form: 0.7472939592 + 0.2382677377i (lane's value reproduced by a
  quadratic, not a root finder). New case q = 5: 0.7989937 +- 0.2880805i.
- D10 odd d, new symmetric sets (the lane's Fraction primitives, new point seed, more sample points):
  {1/3, 2/3, 1/2}, {1/5, 4/5, 1/2}, {2/5, 3/5, 1/2}: N (1, 2), N^+ (6, 1) in all three; {1/7, 6/7, 2/7, 5/7, 1/2}:
  N (6, 4), N^+ (15, 1). Even controls: {1/3, 2/3, 1/5, 4/5}: N (6, 0), N^+ (7, 4); {1/3, 2/3, 1/4, 3/4, 1/2, 1/2}
  (d = 6, double zero at 1/2): N (15, 0), N^+ (16, 6). The odd-d finding is confirmed at four further sets; the
  failure is tied to a simple zero at 1/2, not to oddness by itself in any other way tested.

## 3. Corrections

- **E1 (T-NR location).** Verdict item 2 says of T-NR, HQ2, G_q "a local factor vanishes inside the strip". For
  T-NR (q = 2, c = 2.5) the zero is at 1.5 + 4.532i, right of Re s = 1, in the half-plane of absolute convergence.
  It lies in Re s > theta, which is what the stage hypothesis needs; "inside the strip" is true for HQ2 and G_q
  only.
- **E2 (two sentences that contradict each other).** Verdict item 2: "the equivalence holds for every control
  run". Table row T-NR of `REFEREE2_c1-leeyang-krein-limit.md`: "the equivalence itself breaks at S1". The second
  is the correct one for Euler stages, and it can be made unconditional: the T-NR stage is E_P times an entire
  factor m, so local boundedness of R_P m is equivalent to local boundedness of R_P (divide by m off its zeros,
  maximum principle on small discs around them). Hence (b) for T-NR is equivalent to (a) for zeta, while (a) for
  T-NR is false for theta below the local zero. The equivalence of Theorem D with fixed normaliser therefore
  fails for T-NR exactly when zeta has no zero in Re s > theta. "Holds for every control run" is true only for
  the abstract form with exponential stages and an existential normaliser, and that form is true for every F by
  the choice c_N = f_N/F: it carries no information and is weaker than Theorem D, whose normaliser is explicit
  with divisor supported at s = 1. The restatement classification does not need that sentence: Theorem D is an
  equivalence with its target, which is the first clause of the METRIC A rule.
- **E3 (scope of "every control").** Seven controls are in the table (DH, T-NR, HQ2, G_q, sign chains, E_a, DEL;
  DEL not run). Backward heat, Beurling, the phase-rotated transfer operator, theta^w and the unimodular twist
  were not run in this lane. "With exponential stages every control passes the stage hypothesis" should read
  "every control in the table".
- **E4 (hypothesis of Lemma E).** Lemma E assumes abs(a_n) <= 1. The normalised T-NR, HQ2 and G_q series have
  coefficients larger than 1 at powers of q. The cells "exponential stages: holds right of the zero / for Re s
  large" are true by the general fact (a_1 = 1 and absolute convergence somewhere), not by Lemma E as stated.
- **E5 ("new relative to the first referees", D10).** The D10 lane restricts to even d in its text (lines 14, 51,
  239 of its RESULT.md) and its first referee already lists a symmetric odd-degree set with a negative index
  (1/2 with multiplicity 3: (1, 2)). What is new here is the missing words "d even" in the two displayed
  statements X(d) and NL(d), and exact counterexamples with simple zeros. The checks behind it use points with
  real zeros and d <= 5 (stated by the lane as weakest step 3).
- **E6 (headline sentence).** "The headline is 1 of 4 through c4-helson-discrepancy-zerofree alone" is a
  conditional on a lane not refereed here and on the learn step adopting the R1 reading. It is correctly marked
  as such in RESULT.md; the one-line claim record should keep "if adopted" and "not refereed here". The R1
  disagreement on `c1-leeyang-krein-limit` is a classification, with the mathematics agreed by both referee
  files; this referee agrees that S1 (zero-free stages) is not a multiplicative property (Lemma E), and that
  the three multiplicative controls fail S1 by a local zero.

## 4. Not rechecked

- u4 lane (Lemma Q2 domain, Liouville atom n = 12), u6c lane (Lemma Q), the census Run A certification and the
  constant -u at a_P = 0.25 (log read, consistent: ratios 0.993, 1.003, 0.998; not rerun), Lemmas S, F, C of the
  hq2 lane (read; no fault found), the DEL cell.
- Literature items: all from search summaries; arXiv:2411.19259 and the Kodai 2017 paper were not opened by
  the lane or here. The attribution and the displayed formula are "relative to" and should not enter the record
  as checked citations.

## 5. Checks required by the assignment

- Assumes RH: no. The T-NR cell "(b) holds under RH" is labelled conditional; E2 gives the unconditional form.
- Restates verified height: no.
- Known theorem presented as new: no. Theorem D is attributed (relative to); Lemma E is labelled elementary.
- Zeta-only mechanism claimed: none. Lemma E holds for zeta and for the controls; the lane says so.

## 6. Requirement flags (this referee)

- R1 false: nothing in the lane uses multiplicativity.
- R2 false: no height-uniform conclusion.
- R3 false: no statement of the lane fails for a control; its statements are about controls.
- R4 false: no passage to the critical line.
