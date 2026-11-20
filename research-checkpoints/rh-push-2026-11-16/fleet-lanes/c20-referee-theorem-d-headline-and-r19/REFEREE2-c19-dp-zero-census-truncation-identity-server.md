# REFEREE 2: c19-dp-zero-census-truncation-identity-server (Run A certification; the statement of Theorem A)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. The constant of the identity was derived
before the lane's section 2.3 was read. Checks: `r19_checks2.py` / `.log` (local, float64, complete zero list by
slab winding numbers). The server runs were not repeated. Nothing here is a statement about a zero of zeta
(all zeros are zeros of partial sums).

**Verdict: holds with corrections** (the label, as in the first referee's E2; nothing in the mathematics).

## 1. Theorem A: the statement that is true

For a_1 = 1, a_P != 0, u = log P, h in H^1_0[0, u]:

    -2 Re <h, A_P h> = -u norm(h)^2 + lim over T of sum over abs(Im beta) < T of <h, kappa_beta h>.     (V0)

Independent derivation of the constant. The zeros of D_P lie in a vertical strip with density u/(2 pi) per unit
height (D_P is 1 + o(1) on the right and a_P P^-s (1 + o(1)) on the left). For a zero set of that kind the
symmetric sum S(s) = lim sum over abs(Im beta) < T of 1/(s - beta) has limits +u/2 and -u/2 as Re s -> +-infinity,
independent of the real parts of the zeros. D_P'/D_P has limits 0 and -u. So D_P'/D_P = -u/2 + S with **no
further constant, for every a_P != 0**; the term log abs(a_P) of the printed display (A) of c18 is spurious
(discrepancy D-A1 confirmed; the correction note already entered in c18's RESULT.md is right). The coefficient
abs(a_P) enters only through the mean real part of the zeros, log abs(a_P)/u (from abs(a_P) P^(-xbar) = 1), and
hence through the truncation tail: sum over abs(Im beta) > T of Re 1/(s - beta) = u (Re s - xbar)/(pi T)(1 + o(1)),
which at the level of the form gives (u - 2 log abs(a_P)) norm(h)^2/(pi T). PROVED relative to one classical input
(bounded D'/D on a sequence of horizontal lines).

Independent numerical case (not in the lane or in the first referee file): D = 1 + 2 * 2^-s - 4^-s + 0.25 * 5^-s
(P = 5, a_P = 0.25, non-multiplicative). Zeros in abs(Im) < 1500.123: 768, equal to the winding number in each of
the 30 slabs and in the slab around the real axis (0 deficient slabs); T u/pi = 768.45; mean
real part -0.8678 against log abs(a_P)/u = -0.8614. Residual of D'/D(s_0) + u/2 - S_T(s_0), real part, against the
predicted tail (u Re s_0 - log abs(a_P))/(pi T):

| s_0 | T = 375 | 750 | 1500 |
|---|---|---|---|
| 2 + 3i | 0.993 | 1.003 | 0.998 |
| 0.5 + 0.7i | 0.985 | 1.006 | 0.996 |
| -1 + 11i | 1.153 | 0.946 | 1.047 |

The residual tends to 0 like 1/T with the predicted coefficient. A constant shifted by log abs(a_P)/2 = -0.693
(or by log abs(a_P) at the level of the form) would leave a residual that does not tend to 0. MEASURED. (A first
version of this check used an incomplete zero list, 712 of 768, and gave ratios drifting from 1.02 to 1.78; it
is kept in `r19_checks.log` and superseded. A control of this identity needs a complete list.)

## 2. Run A: what is certified

Read in `runA.py` (code read, not re-executed):
- Strip. Both sums are monotone in sigma and are evaluated in balls; all zeros lie in sigma_L < Re < sigma_R. Correct.
- Change of argument on a segment (`seg_arg`). The enclosure D(mid) + D'(box)(box - mid) contains the image of
  the segment (the mean of D' along the segment lies in the convex hull of D'(box), and an acb rectangle is
  convex). If it excludes 0 the image lies in a convex set that excludes 0, hence in an open half-plane, and the
  change of argument is the principal argument of the ratio of the end values. Correct. Adjacent segments share
  end points exactly.
- Winding number. A ball containing exactly one integer (`unique_fmpz`). Correct.
- Zeros (`certify_zero`). N = s - D(s)/D'(B) contained in the interior of B gives exactly one zero in B (the
  same convex-hull form of the mean value statement makes the interval Newton test valid for analytic
  functions). Balls are kept only if pairwise non-overlapping and strictly inside a slab; a slab is accepted
  when their number equals its winding number. Correct: the zero lists are complete.

So the certified objects are: the complete zero lists to T = 6400 and the truncated sums, hence the residuals
R_V0(T) and R_reg(T) as balls. **Not certified: the limit T -> infinity** (no enclosed tail). The identity V0 is
PROVED (section 1) and the run is a check of it; the phrase "Theorem A is certified in a corrected form" should
read "PROVED in the corrected form V0; truncated sums certified to T = 6400, six series". Same as the first
referee's E2.

## 3. Scope of this file

Runs B and C (census of right zeros, joint prime-phase statistics, the relation zeta = chi/2 at theta' = 1) were
not re-examined; the first referee's findings on them stand as the only referee record.

## 4. Flags

R1 false (V0 holds for non-multiplicative series: three in the lane, one in the first referee file, one here).
R2, R3, R4 false.
