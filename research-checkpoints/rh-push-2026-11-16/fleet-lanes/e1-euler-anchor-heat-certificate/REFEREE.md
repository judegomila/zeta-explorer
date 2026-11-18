# REFEREE: e1-euler-anchor-heat-certificate

Referee verdict: **the obstruction verdict stands, at the level ARGUED + MEASURED. The two PROVED steps (Lemma 1,
Lemma 2) are confirmed. Lemma 3 as written is wrong at the anchors tested; a corrected form is confirmed
numerically. Four statements need correction (items E1 to E4).** No zero-free statement is claimed and none follows.
Nothing assumes RH; nothing restates verified height; Lemmas 1 and 2 are credited to the source / Polymath15, not
presented as new.

All referee runs: local, `scripts/memcap.sh 8 .venv-arb/bin/python`, single process, float (mpmath 25 digits), not
interval-certified. Referee scripts were kept outside the repo (/tmp/ref_e1) and are described below in enough
detail to rerun.

## 1. PROVED steps re-derived

**Lemma 1 (confirmed, given constant S).** y' = 8 - 4 S0 y, y(Lambda) = 0 gives y(T) = (2/S0)(1 - e^{-4 S0 (T - Lambda)}),
q = S0 y/2 = 1 - e^{-4 S0 (T - Lambda)}. A pair with 1 - q(T) <= eps has T - Lambda >= log(1/eps)/(4 S0). With
S0 = L^2/(8 pi^2), eps = e^{-cL}: Delta = 2 pi^2 c / L. Requirement Delta >= C/L is c >= C/(2 pi^2): 0.101321 (C = 2),
0.075991 (C = 3/2), 0.248237 (C = 4.9). Arithmetic confirmed. The values C = 2, 3/2 themselves are the source's
saddle heuristic (Remark 2.3, labelled HEURISTIC there), so "PROVED" covers the map C -> c only, not the
identification of the anchor line with kappa = C (see E5).

**Lemma 2 (confirmed, exact).** y' = 2 d d' = 8 - 4 S d^2 gives S = 2/d^2 - d'/(2d), q = S d^2/2 = 1 - d d'/4, and
d' = v(b) - v(a) with x_k' = H''/H' (sign: d_t H = -H''). Independent numerical check (referee, different quadrature:
60-point Gauss-Hermite instead of the trapezoid rule): zeros of H_t re-solved at t +- 1e-5 and d' taken by central
difference. |q(Lemma 2) - q(flow)| <= 4.5e-9 over 5 pairs at L = 6 and <= 2.1e-9 over 41 pairs at L = 12. The L = 6
values reproduce the author's (min q = 0.568).

**Fejer step (confirmed as arithmetic).** mean[F (1 - cos((x/2) log 2))] = -a_2/2 for F = Re sum a_n n^{-ix/2}.
Note: this uses only a_2 > 0. Signs of the other coefficients are irrelevant (see E2).

**thresholds.json (confirmed).** a_sup = 3.16584, 14.4340, 97.4691, 396.954 and a_first = 0.084933, 0.101003,
0.112070, 0.116022 recomputed; L0 = 31.5, 68.38 are roots of 2 log L - log(2 pi^2 a) = C L/(2 pi^2); with a_sup the
left side minus right side is negative for all L (max -1.56 at C = 4, -5.19 at C = 2.2). Reach (i): stationary point
eta = pi^2/L, value 1 + pi^2 (1 - (1/2) log(pi^2/2))/L = 1 + 1.9921/L confirmed.

## 2. Numeric rerun with a different case

L = 12, C = 2 (gamma about 1.0226e6, not in the author's set), 41 adjacent pairs, 42 zeros found of 42 expected:

* q range 0.705 .. 1.680; a = (1-q) L^2/(2 pi^2) range -4.96 .. 2.15; 22 of 41 deficits positive.
* Condition with the pair's own S (the author's criterion): 1 failing pair, x = 2045282.9294, 1 - q = 0.23763 against
  threshold 0.22762.
* Condition with the lattice S (the criterion that defines "2 pi^2 c > C"): threshold e^{-CL/2pi^2} = 0.29646, largest
  deficit 0.2951, no failing pair; min c_eff = 0.10171 against required 0.10132.

This agrees with the author's picture (deficits of order 1/L^2, both signs; the condition is marginal at L = 12 to 14).

## 3. Errors and corrections

**E1. Lemma 3 as written is not the leading order at kappa = 2 or 3/2 (MEASURED by the referee).** The lemma
replaces v(b) - v(a) by d v'(midpoint) and states an O(L^{-3}) error. That needs log Z to vary slowly on the scale of
the spacing. It does not: terms with n near N = sqrt(x/4pi) have period 4pi/log n >= 8pi/L = 2s in x, and at
kappa = 2 their weight b_n^t n^{-sigma*} = n^{-(1/2 + kappa/8)} at the top is not small in aggregate. Test (referee):
for each measured pair in the author's JSON files, Z_N(s) = sum_{n <= N} exp(t log^2 n/4) n^{-s},
s* = 1/2 + kappa/4 + i(x/2 + t pi/8).

| data | pairs | corr(a_meas, -Re (log Z_N)''(s*) at midpoint) | rms residual / rms signal | corr(a_meas, pair-difference form) | rms residual / rms signal |
|---|---|---|---|---|---|
| L = 14, C = 2 | 246 | 0.187 | 2.51 | 0.981 | 0.43 |
| L = 10, C = 2 | 26 | 0.257 | 3.22 | 0.954 | 0.69 |
| L = 18, C = 2 | 10 | 0.874 | 0.59 | 0.996 | 0.30 |
| L = 10, C = 1.5 | 26 | 0.226 | 3.15 | 0.934 | 0.80 |
| L = 18, C = 1.5 | 10 | 0.382 | 1.50 | 0.996 | 0.28 |
| L = 6, C = 2 | 26 | -0.321 | 4.18 | 0.188 | 8.0 |

Pair-difference form: 1 - q = (d/2) [Im-part derivative of log Z_N at b minus at a], i.e. (d/4)(v(b) - v(a)) with
v = 2 (log|A|)' and the pair's own a, b. So the structure "deficit = variation of the log-derivative of the
Dirichlet polynomial across the pair" is supported for L >= 10; the displayed formula with (log Z)'' and coefficients
beta_n(t) log n, and the error term O(L^{-3}), are not. At L = 6 neither form matches (N = 20).
Consequence: the deficit is not a function a(x) of the height alone (it depends on d), so the passage "inf F <=
-a_2/2 on a relatively dense set of x, hence a pair with 1 - q >= (pi^2/L^2)(log 2)^2 2^{-sigma*} in every long window"
is not derived. It remains plausible (the n = 2 term is slowly varying and enters with factor close to 1), and the
measurements show positive deficits of that order in every sample, but the lower bound k/L^2 is MEASURED, not ARGUED
from a valid leading-order formula. The statement "fails for every fixed c > 0" rests on this bound.

**E2. Positivity of beta_n(t) is not what forces compressed pairs.** The Fejer step needs one nonzero coefficient
(weight 1 - cos if a_2 > 0, 1 + cos if a_2 < 0). Any mean-zero almost periodic modulation gives deficits of both
signs. So "nonnegative heat-evolved von Mangoldt coefficients force compressed pairs" and "the Euler product fixes
its size" overstate the role of the arithmetic: the same lower bound holds for sign-twisted coefficients and for a
Dirichlet polynomial without Euler product. For an obstruction this strengthens the conclusion, but the route-40
node (beta_n(t) >= Lambda(n) >= 0) is used only for the size of a_2, not structurally.

**E3. "4 of 246 pairs violate" depends on which S is used.** From the author's JSON: with the pair's own S,
4 pairs fail (confirmed: x = 15116951.6026, 15116952.3475, 15121485.0882, 15130545.7545). With the lattice
S = L^2/(8 pi^2), which is the S in Lemma 1 and in the test 2 pi^2 c > C, the threshold is 0.2421 and exactly 1 pair
fails (deficit 0.2528, the pair behind "min c_eff 0.0982"); it is not one of the four, and none of the four fails
the lattice criterion. The table row mixes the two criteria (min c_eff is lattice-based, the count is own-S based).
Both counts are float and marginal (0.2% to 10%). Correct statement: at L = 14, C = 2, 1 of 246 pairs fails the
lattice-S test and 4 other pairs fail the own-S test; at L = 12 (referee) 0 of 41 and 1 of 41.

**E4. The summary line "reach >= 1 + 1.99/L from the Euler anchor" is not what section 5 proves.** For
eta < sqrt(2) pi/L the certified depth is 0 and the reach is 1 + eta, which takes every value in (1, 1 + 4.44/L),
including values below 1 + 1.99/L. 1 + 1.992/L is the minimum over eta >= sqrt(2) pi/L only. Correct statement (as
in the body and in thresholds.json): reach > 1 for every eta, infimum 1, not attained. f(theta) = theta is
unaffected. In (ii) the bound |(zeta'/zeta)'| <= L/(2 eta) + O(L) should read O(L/eta): Re zeta'/zeta at
Re s = 7/8 + eta is not O(1) under ZF(7/8) alone; the constant pi^2/L changes, the conclusion reach > 7/8 does not.

**E5. Scope of the anchor.** As the author notes in weakest step 1, the truncated series is absolutely convergent
only for kappa > 4; at kappa = 2 the Gaussian average defining H_t has spread sqrt(kappa/2L) in sigma, which is
large against 1/L and reaches Re s < 1. So "anchor (i) = Euler product on Re s = 1 + eta at kappa = 2 + 4 eta" is a
heuristic identification, and the bound a <= g(1 + eta) used for the reach in section 5 is not a bound on the true
deficit (measured |a| reaches 10.6 at L = 14 where g would be evaluated on its abscissa). Section 5 is correctly
labelled ARGUED; its numbers should not be quoted without that label.

## 4. Control E_a run by the referee

Claim in section 6: for E_a all pairs collided below the anchor, a(x) has both signs, so pairs with q >= 1 exist and
the constant-S certificate would certify them.

Run: E_a = xi(s + a) xi(s - a), a = 0.1, L = 6 (x near 5071 .. 5096), anchor kappa = 2 + 4a, T = 0.4; 24 real zeros at
the anchor (24 expected); zeros followed backward through t = 0.3, 0.2, 0.12, 0.07, 0.04, 0.027, 0.021, 0.0185. All
real zeros are still present at t = 0.021 and arranged in 12 close pairs (gaps 0.11 .. 0.15 against 1.05 mean
spacing); they are gone or merging at 0.0185 (isolated-pair law 2 a^2 = 0.02). The collision pairs are the anchor
pairs (0,1), (2,3), ..., (22,23); the 11 pairs between them did not collide.

| | collided pairs (12) | non-collided pairs (11) |
|---|---|---|
| 1 - q at the anchor | 0.0517 .. 0.0883, all positive | -0.501 .. 0.082; 6 negative |
| q >= 1 | 0 | 6 |
| own-S certificate says "no collision in (0, T]" | 4 of 12 (pairs 4, 16, 18, 20: 0.0561 < 0.0973, 0.0517 < 0.0635, 0.0608 < 0.0758, 0.0594 < 0.0699) | not applicable |

Findings.
* The conclusion "the constant-S certificate is unsound without transport" is confirmed in this sample: 4 of 12
  collided pairs are certified as not collided (own S). With the lattice S (threshold 0.0540) 2 of 12 are, by
  margins below 5%.
* The stated mechanism is not confirmed: no collided pair has q >= 1. Every pair with q >= 1 is a non-collided
  pair. "All pairs collided" is also inexact: about half of the adjacent pairs are collision pairs.
* At this height the anchor does carry the collision: constant lattice S predicts 1 - q = e^{-4S(T - Lambda)} = 0.063
  for a collision at 0.02, and all 12 collided pairs have 0.052 .. 0.088. The false certifications come from
  variation of S by about 20%, i.e. from Claim 5, as the author says. Whether the collision memory
  x^{-C/2pi^2} drops below the modulation 1/L^2 at larger L (the zeta_W row) was not tested by either party.
* One height, one a, float, 12 pairs. DH, zeta_W, backward heat and sign twist rows were not run by the author or
  the referee; they stay ARGUED. The DH figure 1.1203625 was not checked.

## 5. What survives

1. PROVED: Lemma 1 (constant S; map C -> C/(2 pi^2)) and Lemma 2 (exact deficit identity). Both are rearrangements
   of the source and Polymath15.
2. MEASURED (author; referee at L = 12 and with independent quadrature): at kappa = 2 and 3/2 the deficit 1 - q is of
   order 1/L^2 with both signs at L = 6 .. 18; the certificate condition is marginal at L = 12 .. 14 and fails for
   1 to 4 pairs depending on the S used.
3. MEASURED (referee): 1 - q follows the variation of 2 (log|A|)' of the truncated Polymath15 polynomial across the
   pair (correlation 0.93 .. 0.996 for L >= 10); the midpoint formula of Lemma 3 does not.
4. ARGUED: no height-independent c > 0; c_eff of order log L / L. This needs a lower bound k/L^2 for some pair in
   every window, which is supported by 2 and 3 but not derived (E1).
5. ARGUED: f(theta) = theta at 1 and 7/8, with the reach stated as "> input", not ">= 1 + 1.99/L" (E4).
6. MEASURED (referee, E_a, a = 0.1, L = 6): the constant-S certificate certifies 4 of 12 collided pairs; the reason
   is variation of S, not pairs with q >= 1.

No zero-free region, no Lambda bound, nothing below 0.874886647. The precise-obstruction verdict holds with items
E1 to E4 corrected.
