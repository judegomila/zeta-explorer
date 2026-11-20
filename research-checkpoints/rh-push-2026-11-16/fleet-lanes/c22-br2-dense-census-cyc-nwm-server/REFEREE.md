# REFEREE: c22-br2-dense-census-cyc-nwm-server

This file has two parts. Part I is the adversarial referee report of 2026-11-20 (lens: general), written by
an agent that did not author the lane. Part II is the lane author's own second-implementation rerun and
reading, kept unchanged from the earlier version of this file.

# Part I. Adversarial referee report (general lens)

## I.0 Outcome

- The lane contains no PROVED step. Everything is MEASURED, CLASSICAL or ARGUED, and is labelled so.
- The claimed verdict (partial-result; no twin candidate in the rows run; statistic 1 void as registered;
  two registered predictions failed; nothing about zeros of zeta) HOLDS, with the five corrections of I.3.
  None of the corrections changes a PASS/FAIL cell.
- Requirement flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.
- No use of RH, no restatement of verified height, no known theorem presented as new (Euler product /
  eta transformation are labelled CLASSICAL). The object is a relative product; no statement about zeta
  is derived, so the campaign controls (DH, backward heat, sign twist, ...) have nothing to be run against.

## I.1 Independent numeric rerun, different cases

Own code (numpy, local, through `scripts/memcap.sh 8`, `.venv-arb` python; script kept outside the lane at
`/tmp/c22ref/chk.py`; nothing imported from the lane). Differences from the lane on purpose: pure model
sequences without the searched prime head, numpy PCG phases with other seeds, the factor e^(i xi y_c) kept
in the kernel instead of demodulating the spikes, grid 1/64 for the sparse cases, other bases for CYC.

| Case | Result | Lane value it tests |
|---|---|---|
| lambda_k = k, random phases (seed 12345), V = 2^7..2^15 | local exponents 2.91, 2.95, 2.94, 3.00, 3.05 on 2^11..2^15; M/V over 9.0358 (7 zeta(3)/3) V^2 = 1.063, 1.030, 0.984, 0.986, 1.021 | e = 3.00, ratio about 1: reproduced |
| lambda_k = k^(1/2), phase +, V = 2^5..2^10 | local exponents 2.82, 2.15, 2.63, 2.49, 2.56; M/V at 2^10 = 2.87e5 = 3.6e-6 of the diagonal | e about 2.5; lane has 1.6e-7 at 2^13, and 3.6e-6 x 8^(-3/2) = 1.6e-7: reproduced |
| lambda_k = k^(1/2), random phases (seed 999), V = 2^5..2^10 | ratio to diagonal 1.10, 1.02, 0.93, 1.10 on 2^7..2^10; local exponents 3.9 to 4.2 | e = 4, ratio about 1: reproduced at lower accuracy (shorter range) |
| CYC with base 4 (lambda_k = 2^k log 4, theta = pi) | M/V = 0.56056 constant at V = 2^8, 2^12, 2^16; closed form (2 pi b(u_1))^2 with y_1 = 2 pi/log 4 gives 0.56103 | positive control mechanism: reproduced on a case the lane did not run |
| CYC with base 5 | M/V = 0 (no pole 2 pi m/log 5 lies in the window [4, 7]) | consistent |
| CYC base 3 | 55.593 against 55.667 | 0.13% low: the linear deposit of my variant attenuates by sinc^4(y_1/128); the lane's demodulated deposit is the more accurate one |

My D2 + values are 10% to 14% above the lane's at equal V (2.87e5 against 2.60e5 at 2^10). The difference is
the head: the lane replaces the first 900 frequencies by logarithms of nearest primes with duplicates
dropped. The exponent is not affected.

Checks done by hand:
- CYC telescoping on the spike side: at x = m log 3, m = 2^a (odd), the lattices k < a contribute
  + 2^k log 3 and k = a contributes - 2^a log 3; total - log 3 for every m. So I(omega) is the single
  lattice (log 3) Z, Poisson gives abs(I) = 2 pi T(y_1), and M/V = (2 pi b(0.1461))^2 = 55.667. Confirmed.
- int abs(K)^2 = 2 pi h int b^2 = 2 pi (1.5)(2)(151/315) = 9.0358. Confirmed.
- Variance of y for independent phases: (1/2) Li_2(e^(-2 delta lambda)) per factor; zeta(3)/(4 delta) and
  zeta(4)/(4 delta^2); standard deviations 280.7 and 532.7. Confirmed.
- ETA check value at b = 1, j = 8: pi^2 256/6 - (1/2) log(512 pi) - 1/6144 = 417.411. Confirmed.
- The 123 failing CYC heights: pole-class heights are t = (2m + 1) pi/(2^k log 3), k = 0..19, m = 1..20;
  the condition t < 0.00489 is 2m + 1 < 0.001710 x 2^k, which gives 0, 1, 3, 6, 13, 20 heights for
  k = 10..15 and 20 each for k = 16..19: 123. So 0.9385 = 1 - 123/2000 follows from the registered height
  design alone, as the lane says.
- R-b stationary phase: phase y(omega - n x^(1/2)) - 2 pi m x has its stationary point at
  n^2 = 4 pi abs(m) omega/y, Hessian determinant n^2/(4x), amplitude 4 pi omega^2/n^3, i.e. of order
  omega^(1/2) abs(m)^(-3/2), with about (abs(m) omega)^(1/2) admissible n. Sum of squares
  omega^(3/2) abs(m)^(-5/2). The sketch is consistent; the step "the terms add in mean square" is not
  proved. Label ARGUED is correct.
- 27 exponents of the rows named D1*, INJ*, ETA in `out2`: minimum 2.9959, maximum 3.0071. Confirmed.

## I.2 Controls

No zeta-only mechanism is claimed, so no campaign control applies. The lane's own controls were read
against `out2/*.json`, `posthoc.txt`, `referee_out.json`: CYC, HQ1, CYCP, CYCeps, DEL, THIN, INJ cells of
section 5 agree with the files.

## I.3 Errors and overstatements found

1. **Diagonal constants are wrong by 1.0% and 0.6%.** `final.py` uses (1/2 + 7/3) = 17/6 for N = lambda
   and (2/3 + 15/2) = 49/6 for N = lambda^2. The diagonal sum is sum over n of the second moment of
   lambda over [V/n, 2V/n]: (7/3) zeta(3) V^3 = 2.8048 V^3 and (15/2) zeta(4) V^4 = 8.1174 V^4. Every
   entry of the column "ratio to diagonal" must be multiplied by 1.0102 (class log x) or 1.0061 (class
   (log x)^2): the random-phase rows of D1 become 1.001, 1.002, 1.000 instead of 0.991, 0.992, 0.990, and
   the D2 random rows 0.996, 0.980, 0.977. The statement "within 1% to 3.5%" survives (the largest
   deviation stays near 3%); the systematic 1% deficit reported for the random D1 rows was produced by
   the wrong constant, not by the data.
2. **The resolution law of R-d and section 6 is wrong in its V-dependence.** The text says the statistic
   resolves a relative frequency error "about 1/(V y_c) times a small constant". At V = 2^20 that is
   1.7e-7; the measured transition is at 1e-9 to 1e-10. The lane's own files give the law: the excess of
   M/V over 55.666 is 4.66 at eps = 1e-10 and 4.658e4 at eps = 1e-8 (V = 2^20), ratio 1.0e4 = eps^2, and
   it grows by about 8 per octave of V. Reason: a lattice with lambda_k of order V contributes
   (V/lambda_k) lambda_k^2 (eps V y_c)^2 int abs(K)^2 to M. So the excess of M/V is of order
   eps^2 V^3 y_c^2 and the resolved error is eps of order V^(-3/2)/y_c, not 1/(V y_c). The number quoted
   in the claim ("about 1e-9 at V = 1e6") is correct as a measured value; the formula is not. Consequence
   for section 6: resolution improves faster with V than stated; the conclusion that a finite run cannot
   reach e^(-lambda_k) is unaffected.
3. **"All 27 rows of class log x" counts 16 control rows.** By PREREG the dense rows of class log x are
   D1 (5 phase choices) and D1-RAND (6): 11 rows. The other 16 are ETA (a code check, identical to D1 +
   beyond 30 factors) and the 15 INJ-J rows (multiples of log p for J primes, i.e. prime powers, a
   registered transition control, not a set of primes). Correct wording: exponent 3.00 in the 11 dense
   rows of class log x and in 16 control rows with the same counting function. In class (log x)^2 there
   are 7 rows.
4. **"M(V)/V constant to 9 digits" is 7 digits.** `out2/CYC.json`: 55.66627327 at V = 2^7 and 55.66627163
   at V = 2^20.
5. **Section 0 item 4, "its first four primes differ from 3^(2^k)":** `cycp_primes.json` is
   3, 7, 79, 6563, 43046747, 1853020188851807. The first is exact; three of the first four differ; "11%"
   is the difference of lambda for 7 against 9 (the prime differs by 22%). Also, CYCP passing statistic 2
   is not informative: a finite number of non-telescoping lattices with fixed lambda gives a bounded
   I(omega) for any choice of frequencies, so e = 1 follows from the tail k >= 6 being exact CYC. The
   upward drift of its local exponent (0.97, 1.03, 1.06) is the k = 4 lattice (relative error about 1e-8)
   losing its cancellation, a transient that ends at a constant M/V.

## I.4 Limits of the claim (not errors; they bound what may be quoted)

- Statistic 2 uses one window, y in [4, 7]. PASS-2 (M = O(V)) is returned by a telescoping set whose
  poles miss the window (my base-5 case: M = 0) and by anything analytic there; a non-flag is the only
  informative outcome, as the lane states.
- The rows with phase + in class log x are Euler's product up to 30 factors: I(omega) is a smoothed sum
  of sigma(m), and M of order V^3 there is classical size of the divisor function, not evidence about
  cancellation between unrelated lattices. Only the random-phase and jittered rows test the lemma in the
  generic sense, and for class (log x)^2 with phase + there is no generic row (the author's point B.4).
- R-b rests on V <= 2^13 (my rerun: V <= 2^10) and local exponents between 2.15 and 2.82. "V^2.5" is a
  fit; "exact order V^(5/2)" is the stated follow-up, not a result.
- The prime head matters at the 10% level for M in class (log x)^2 (I.1), so "the searched primes do not
  matter at this resolution" is established only for class log x (ETA = D1 + = 0.869).
- Arb covers 14 values of I and a few heights per row. M, e and the fractions have no enclosure.
- Classes (log x)^4 and exp(sqrt(log x)) and all D4 integrals: no statement. The DE exponents (2.45 to
  8.3 on V <= 2^7, below the kernel pad of 100) carry no information and should not be tabulated as
  "no" under PASS-2; "not testable" is the correct entry.
- Part II of this file was written by the lane's author. Before this report the lane had no independent
  check.

## I.5 Requirement flags (strict)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | model sequences of doubles; no step uses multiplicativity or the full set of primes |
| R2 | false | one window, finite V, finite height sets |
| R3 | false | a census, no argument; no campaign control is run; its own positive control fails statistic 1 |
| R4 | false | nothing is derived for zeta or for the critical line |

## I.6 Surviving claim

MEASURED only, for model frequency sequences (float64 screen; Arb at selected points): on the window
y in [4, 7] the integral M(V) is not O(V) in any dense row run. Exponent 3.00 (2.996 to 3.007) in the 11
dense rows of class log x and in 16 control rows of the same density, V up to 2^20; exponent 4 with
random phases (ratio to the corrected diagonal value (15/2) zeta(4): 0.98 to 1.00) and about 2.5 for
lambda_k = k^(1/2) with phase + or alternating, V up to 2^13. The telescoping control CYC gives
M/V = 55.6663 constant to 7 digits (closed form 55.6667). The slope statistic is void as registered
(CYC 93.85% against the 99% cut; the 123 failures are the pole-class heights with t < 0.0049). Two
registered predictions failed. Resolution of statistic 2: measured 1e-10 to 1e-8 at V = 2^20, scaling
like V^(-3/2), not 1/(V y_c). Classes (log x)^4 and exp(sqrt(log x)): no statement. Nothing concerns zeros
of zeta.

# Part II. Author's rerun and reading (text of the earlier file; only the title line removed and heading levels lowered)



Status of this file: a second-implementation rerun and an adversarial reading, both by the lane's own
author. It is independent in code (pure-python set generation, mpmath arithmetic, closed forms; `referee.py`
imports nothing from the lane) and not independent in person. No external referee has read the lane.

### A. Reruns (`referee.py` -> `referee_out.json`, server unit c22dref, mpmath 34 digits)

| Cell | Second route | Census value against second route |
|---|---|---|
| A. CYC, statistic 1, three heights (telescoped pole t = 17.1576, pole-class t = 20.0172, generic t = 83.4262), all 15 delta | closed form log abs(1 - 3^(-z)) | max difference 2.4e-15, 1.4e-15, 7.7e-10 (the last is the 23-factor truncation of the product) |
| B. D1 random 1, first generic height t = 73.8350, j = 4..10 (32768 factors) | own prime search (Miller-Rabin), own splitmix64 in python integers, direct product | max difference 1.4e-10; y at j = 10: -12.2848 |
| C. D2 +, first generic height, j = 0..4 (262144 factors) | own head of 900 nearest primes, direct product | max difference 1.6e-13; y at j = 4: -2.7930 |
| D. CYC, statistic 2, two probes at V = 2^20 and M/V | Poisson summation: I e^(-i omega y_c) = -2 pi T(y_1) e^(i omega (y_1 - y_c)), y_1 = 2 pi/log 3; M/V = (2 pi b(u_1))^2 | probes differ by 2.9e-4 and 5.2e-5 (size 7.46); M/V 55.66627 against 55.66670 (kernel cut at 100 and grid deposit) |

All four cells agree at the accuracy claimed in RESULT.md. The random-phase and prime-head definitions are
therefore reproduced from the text of PREREG.md alone in cells B and C.

### B. Adversarial reading

1. **Positive control.** PREREG states: "If CYC is not flagged the statistic is void." CYC has frac = 0.9385
   under statistic 1. RESULT.md reports statistic 1 as void and does not use it for a flag. HOLDS as
   reported. The post hoc variant (heights t >= 0.5) is labelled post hoc; it must not be cited as a
   registered pass. The registered allowance (0.34% of heights near a pole) was computed for uniform heights
   and overlooked that the pole-class heights (2 pi m + pi)/(2^k log 3) with k >= 10 lie within 0.005 of the
   pole t = 0. This is a design error of the pre-registration, not of the code (cell A).
2. **"No twin candidate."** Rests on statistic 2 only, whose positive control is valid and whose negative
   rows are not marginal (exponents 2.5 to 4 against the cut 1.1). HOLDS for the rows and ranges run. It is a
   statement about model sequences of doubles on one window and V <= 2^20 (2^13 for class (log x)^2); it is not
   a statement about any set of primes and not a proof of the missing lemma. Classes (log x)^4 and
   exp(sqrt(log x)): no statement (the DE exponents come from five values of V below the kernel pad).
3. **Diagonal ratios.** The diagonal value uses continuous counting (N = lambda, lambda^2) and int abs(K)^2 = 4 h (151 pi/315);
   the 1% agreement for random phases is consistent with it, and ETA = D1 + = 0.8693 is an internal
   consistency check. The INJ rows drop duplicates, so their counting function is below lambda by up to 8%
   (7.72e6 of 8.39e6 for J = 1); their ratios carry that error. Minor.
4. **R-b (V^(5/2)).** Three local exponents (2.62, 2.54, 2.50) on V <= 2^13 and a stationary-phase sketch. The
   label ARGUED is right; "exact order V^(5/2)" is not established. D2-RAND(1) + behaving like the smooth row
   is explained in the text (jitter 1/(2 k^(1/2))); it means that row is not a generic member of its class, so
   class (log x)^2 with phase + has no generic representative in this census. The random-phase rows do.
5. **Model against primes.** The claim that "nearest prime to exp(f(k))" is indistinguishable from f(k)
   beyond lambda = 30 uses the expected size of prime gaps. With the proved bound (Dusart, as recalled in round
   21: relative 1/(25 log^2 x)) the difference in lambda could be up to 0.04/lambda^2, which times t = 100 is not
   negligible. So the dense rows must be read as Beurling-type model sequences. RESULT.md says so in
   sections 1 and 8; the wording in section 6 ("a prime set within e^(-lambda_k) of a telescoping sequence") is
   conditional on such a set existing and is fine.
6. **Arb stage.** It encloses the truncated sums for the sequences of doubles; it certifies the float64
   screen at 4 heights per large row and 14 values of I, not the summary statistics. Sufficient for a
   screen whose negative rows miss the cut by factors of 20 and more; it would not be sufficient to
   certify a flag.
7. **NWM.** Not an enclosure; 200 heights below t = 1.2; the row only confirms that an entire factor has
   slope 0. It adds nothing to the dense question.
8. **Units.** `systemctl --user list-units 'rh-c22d*'` after the last stop showed one active unit,
   rh-c22dq-e050, which belongs to another lane and was not touched. All units of this lane had exited
   or were stopped by it.

### C. Verdict of the reading

The reported verdict (partial-result; no candidate; statistic 1 void; R1 to R4 not established) is
supported. Nothing in the lane may be quoted as a proof, as a statement about zeros of zeta, or as a
registered pass of the slope statistic.
