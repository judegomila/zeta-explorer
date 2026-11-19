# REFEREE: c6-probe61-thin-three-weights (lens: general)

Date 2026-11-18. Adversarial referee of `RESULT.md` (claimed verdict: partial-result; flags all false).
Referee work was done in a scratch copy (`/tmp/ref-c6p61/`, local, `scripts/memcap.sh 8`); nothing in the lane
directory was changed except this file. No server use.

## Verdict

**The partial result holds as a measurement, with the corrections E1 to E5 below.** No statement about zeros of
zeta is made, RH is not assumed, verified height is not used, and no known theorem is presented as new. The
conditional statement on the location of the periodicity input (verdict item 5) is correctly labelled conditional
and is not established. Flags: R1 = R2 = R3 = R4 = false (agree with the lane).

## What was re-derived or rerun

1. **Reading of (6.1) against the manuscript text** (`paper.txt` lines 2700 to 2800, 2960 to 3100). The prefactor
   (1/Y) W_1 chi_s(b*) / (tau xi(s) (q_b* q_s X)^(1/2)), the factor xi(m) q_s^(-1/2) g(s, -m) W_0(q_m/(q_b* q_s X)),
   Psi = eta Xi^(-1) R chi_a(m), the row weights q_c^(-1/2-t) q_n^(-1-3t), and the Mellin inversion of Phi(t) = e^(t^2)
   to V_G(y) = exp(-(log y)^2/4)/(2 sqrt pi) all match Lemma 1. The Cauchy-Schwarz size Q^(-1/2) (Q/Y)^(1/2) Z^(1/2)
   = Z^(1/4) of Proposition 6.3 matches the measured CS = 0.42 to 0.47 Z^(1/4). The bars on alpha and G are not in
   the text file. Supporting observation by the referee: the same file prints the Fourier coefficient
   a_theta = |T|^(-1) sum G(v) theta(v) with no bar on theta, so the text extraction drops overlines; the lane's
   reading is therefore plausible, but remains a reading (it is confirmed only by agreement with P_w, see E4).
2. **Lemma 1 (rearrangement), PROVED: confirmed.** Regrouping by the four square classes is a finite identity;
   reproduced numerically by item 5.
3. **"Relation to the manuscript's signal", PROVED: confirmed.** sum_a phi(a) q_a^(-z) has residue rho_S kappa_0 at
   z = 1, so sum_a phi(a) g(T q_a^6) = rho_S kappa_0 (M(1/6)/6) T^(-1/6) + lower order; with T = X/q_c and
   X^(1/3) = Z^(1/6) this gives P_w -> c_S kappa_0 Z^(1/6) sum mu w phi q_c^(-5/6) V = c_S f_w. (The text of Lemma 2
   omits kappa_0 in the leading term of the a-sum; it is carried inside f_w and in the code, so the result is
   right.) The closed form of M(1/6) used in `cS_value` follows from the Weber integral
   int_0^inf J_0(c sqrt t) t^(s-1) dt = (c/2)^(-2s) Gamma(s)/Gamma(1-s). Recomputed with adaptive quadrature:
   W_1^(1) = 0.6034502, M(1/6) = 1.7225584, rho_S = 0.3022999, c_S = 0.01583216 (lane: 0.0158322).
4. **Lemma 3 support statement, PROVED: confirmed.** 7^6/Z^(1/2) = 3676.5, 229.8, 3.59, 0.90 at Z = 2^10, 2^18,
   2^30, 2^34. Envelope of W_0~ recomputed: below 10 percent from argument 17.96, below 1 percent from 99.4
   (lane: 18, 99). Exponent arithmetic: b - 2/3 = 0.2833, b - 3/4 = 0.20, b - 11/12 = 1/30, 2b - 5/6 = 1.0667 at
   b = 0.95; the table's local exponents are consistent with its own entries (2^44 to 2^56: 0.342; 2^56 to 2^80:
   0.333). Counts: 0.3023 x 18 = 5.44 ideals per Z; squarefree density 0.3023 x 0.9337 x 54.6 = 15.4 per Z.
5. **Numeric rerun with different cases.** Two scales outside the lane's grid, Z = 724 and Z = 1500, from the
   round-5 table `sf_120k.npz`, with `probe.c` recompiled by the referee:
   * Ball arithmetic (`arb_probe.py`, 120 bits) at Z = 724 on six weights, four of them never enclosed by the lane
     (t95c, g95, d75, iid) plus liou and nm50: all float64 values of `probe` lie inside the balls (radii at most
     5.6e-8), e.g. I_liou = 0.0656657 +- 3.2e-8 (float64 0.06566568), I_g95 = -0.0089084 + 0.0102258 i.
   * Independent evaluation of the principal term by the referee, not using the ideal table: coefficients by norm
     from the splitting law (p = 1 mod 3: two primes of norm p; p = 2 mod 3: one of norm p^2), a = 1, squarefree
     indices only. P_liou = 0.0564412 (lane 0.0564429) at Z = 724 and 0.0841171 (lane 0.0841168) at Z = 1500;
     P_one = -0.003043 (lane -0.003040) and -0.003874 (lane -0.003876). This also confirms "only a = 1
     contributes" at these scales to 3e-5.
   * I against P at the new scales: liou 0.0657 against 0.0564 (1.06 RP) and 0.0818 against 0.0841 (0.39 RP);
     nm50 1.50 and 0.79 RP; d75 0.05 and 1.32 RP; THIN b = 0.95 seeds 0.87, 1.33, 0.55 and 0.35, 1.26, 0.09 RP.
     Two of 28 pairs exceed 2 RP (one at Z = 724: 2.35; t90 at Z = 724: 2.45). Consistent with the stated law.
6. **Statistics recomputed from `fits.json`** with other estimators. Pooled coefficient, weighted / unweighted /
   lower 14 scales / upper 15 scales / octaves only: liou 1.000 / 1.001 / 1.006 / 1.000 / 1.000; t95a 1.002 /
   1.014 / 1.011 / 1.002 / 0.995; t95b 0.986 / 1.001 / 0.967 / 0.987 / 0.982; t95c 0.994 / 0.996 / 1.000 / 0.994 /
   1.013; nm50 1.001 / 1.003 / 1.004 / 1.001 / 1.001. RP exponent -0.242 to -0.248 for all 14 weights. Row-norm
   exponent (upper half) 1.020 to 1.021 for weight 1 and all THIN weights. max abs(I)/CS over the grid: 0.0057,
   0.0055, 0.0067 for the three b = 0.95 seeds. All agree with the lane's tables.

## Errors and overstatements

* **E1 (verdict item 3, wrong as worded).** "abs(I_w - c_S f_w) equals 1.1 to 1.3 times abs(c_S f_w) at every scale
  for every weight with a signal" is false. From `fits.json`: over all 29 scales the ratio ranges 0.56 to 1.44
  (liou), 0.53 to 1.47 (nm50), 0.77 to 1.93 (t95a), 0.12 to 1.73 (t95b), 0.61 to 1.75 (t95c); on the upper 15
  scales 1.18 to 1.44 (liou) and 0.88 to 1.73 (THIN). The range 1.1 to 1.3 is correct only at Z = 2^18 (1.08 to
  1.21) and roughly for liou, nm50, d75 on the upper scales. The qualitative conclusion (the literal comparison
  (2.5) is not in its asymptotic regime, since P is about 2.2 c_S f) stands.
* **E2 (standard errors of the coefficient).** The quoted errors come from the model "remainder = RP per scale".
  Jackknife over scales gives 0.003 (liou), 0.003 (nm50), 0.005 (d75), against the quoted 0.001, 0.002, 0.003;
  for THIN the two agree (0.011 to 0.016). The lane's disclosed inflation factor 1.6 is too small for the three
  strong-signal weights (factor 2 to 3). "Liouville 1.000 +- 0.001" should read +- 0.003.
* **E3 (chi-square bookkeeping; Liouville remainder).** For the real weights `one` and `liou`, Im I vanishes
  identically (1e-16 in the data), so the remainder has one real component per scale, not two; "58 degrees of
  freedom" is 29 for these weights. With that, the Liouville remainder has sum (R/RP)^2 = 56 on 29 (rms 1.39, one
  value 4.27, probability about 0.002 under the incoherent model). The remainders are correlated across weights
  sharing indices (liou with nm50: 0.66; with d75: 0.44), as linearity predicts. The statement "remainder of the
  size RP for every weight" is therefore accurate to a factor 1.4 and not as a distributional statement for
  Liouville; the excess is unexplained (disclosed by the lane) and is the one place where a coherent secondary
  term (a row u != 1) may already be visible. It does not change the coefficient of P.
* **E4 (independence claims in section 3.2).** `arb_probe.py` imports from `prep6.py` the symbol routines
  (`chi_primes`, `prime_chi_scalar`, `inert_chi`), the square-class table, the R sign table, the residue systems,
  xi_2 and the weight definitions, and takes the branch of gamma_2 from the float table. It certifies the
  floating-point evaluation and the enumeration (depth-first rows, unit orbits, the factorisation of G(cn^3)); it
  does not test conventions. Likewise "tests every normalisation in (6.1) at once" is too strong: the agreement
  I = P tests the normalisation of I relative to the lane's own derivation of P (Lemma 2, ARGUED, same reading),
  so a convention error common to both would not be seen. The referee's independent enumeration (item 5) covers
  the arithmetic sum in P, not the passage from (7.5) to P. The link from the measured I to the manuscript's
  signal c_S f_w rests on Lemma 2 plus the density model; it is not observed in the range.
* **E5 (onset wording).** "Equality P = c_S f reached for Z >= 2^44": the table gives P/(c_S f) = 0.79 at 2^36,
  0.93 at 2^44, 1.00 at 2^56. The onset of the exponent beta - 2/3 is 2^36 to 2^56 in the model, for the
  Liouville weight only; no model was run for a THIN weight.

Minor: `one` is the only periodic weight in the set and its principal term is at or below RP (coefficient
1.27 +- 0.15), so the comparison "THIN exactly as weight 1" compares remainders only; no periodic weight with a
visible signal was run (none exists by construction, since 1/L is then regular). S = {2, lambda} with P_0 = 4 does
not satisfy the manuscript's hypothesis (2.2) (disclosed). The random THIN sets have a zero at b only almost
surely and no continuation statement (disclosed).

## Status of the claims

| claim | status |
|---|---|
| (6.1) evaluated for 14 weights at 29 scales, float64, with ball confirmation | confirmed (plus two further scales and four further weights by the referee) |
| I_w = P_w + remainder, coefficient of P equal to 1 within about 1.5 percent (THIN), 0.3 percent (liou, nm50) | confirmed as MEASURED, Z <= 2^18; errors per E2 |
| remainder of size RP ~ Z^(-0.24) | confirmed to a factor 1.4; Liouville excess per E3 |
| pre-asymptotic range (only a = 1; exponent beta - 3/4) | support statement PROVED and confirmed; onset 2^36 to 2^56 is MODEL (E5) |
| thresholds undecided; abs(I_eps) <= 0.007 CS; condition (N) not seen | confirmed |
| high half shows no dependence on periodicity | confirmed only for the measured surrogate I = P + O(RP), which is linear in the weight and holds for non-multiplicative and null weights; it is not the manuscript's comparison (2.5) |
| low half carries the periodicity input | NOT established; conditional on an unproved remainder bound for Z -> infinity (lane says so) |

## Requirement flags (set by the referee)

* R1 false. Nothing here uses multiplicativity essentially; the measured principal term is linear in the weight
  and present for a non-multiplicative weight.
* R2 false. No height-uniform statement.
* R3 false. One control (THIN) examined; the failing step is located only conditionally. No zeta-only mechanism is
  claimed, so there was no control to rerun.
* R4 false. No passage to the critical line; the range is pre-asymptotic for the mechanism itself.

## Three weakest steps (referee's ordering)

1. Lemma 2 (principal row from (7.1) to (7.5), (7.16)) is not derived line by line by the lane or by the referee;
   it is supported by a parameter-free numerical agreement only, under a reading shared by both sides (E4).
2. Extrapolation of the remainder from Z <= 2^18 to the regime Z >= 2^36 where the conclusion is needed; the
   Liouville excess (E3) shows the incoherent model is already imperfect in the range.
3. The identification of the measured surrogate with the manuscript's high comparison (E1, E5): in the range the
   comparison quantity is of the size of the signal for every weight.
