# REFEREE: r3-critical-count (adversarial, 2026-11-16)

Verdict under review: precise obstruction, no tau > 0, B_flat = 0.874886647 unchanged.
**Referee verdict: the obstruction verdict holds, with four corrections (R1-R4). No PROVED step is false; two are
stated more strongly than what is proved.** Nothing here is a new zero-free region. All of it is relative to the
unrefereed openai/math 7/8 manuscript, Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835v2.

## Checked against the source (Liu II text copy, bypass-78/dl/2610.26835.txt)

| item | source | result |
|---|---|---|
| M1 (13.2): r + 2z < 1 and 2r + 8z < 3 | l.5021 | matches; note there are TWO conditions (see R1) |
| M2 (13.3): n1 + n2 + 6 kappa z < 1, full annuli, beta_* <= (1+kappa)/2 | l.5024-5040 | matches |
| Detector (13.14), rowwise choice of pair, t in [1, 3/2] | Lemma 13.7 | matches |
| Long inverse e(r) = max(1, (1+5r)/6) via u -> u a^6 | Lemma 10.10, (10.15), (10.16) | matches |
| Prime factors are "exactly the original Q_i", supply > 1/5 | l.5861-5868, 5895-5903 | matches |
| (13.16) closed form | l.5910-5914 | matches |

## Independent recomputation (script /tmp/ref_r3cc/chk.py, exact rationals via sympy, then a reduced grid)

* Solved M1(r) = M2(m) = 1/6 + (5/6 - delta)(r + m) as a linear system in exact rationals at the stated
  (delta_c, kappa_flat): r* = 0.7456999, m* = 0.4182536, t* = 1.1639536, R_c = 0.5903323535; difference from
  (13.16) is exactly 0. Window (0.8728500, 1.1124595). CONFIRMED.
* Reduced-grid min-max (601 x 1201): c1 = 2 / 1.9 / 1.75 / 1.5 gives 0.590399 / 0.588737 / 0.585711 / 0.578277,
  agreeing with section 4 to grid error. Sensitivity 3.1e-4 per 1% of c1 (note says 3.05e-4). CONFIRMED.
* Lemma E arithmetic (5 alpha - 6 delta x alpha; 5 alpha - 2 delta x alpha/kappa): CONFIRMED.
* Lemma J: re-derived. (Sum |P_u|)^2 <= ||b||^2 Sum |h(u,u')|, Hoelder 2k, large sieve on h(u,.)^k, and
  N_B >= R gives second term >= R K^{1/2}. The displayed inequality is vacuous for theta <= 1/2. CONFIRMED.
* Lemma W1 admissibility of (r*, m*) for 1 <= t <= t* and of (t, 0) for t >= t*: CONFIRMED.
* 3(1-s)/(2-s) at s = 0.734672 = 0.629072: CONFIRMED.

## Corrections

**R1 (numerical, section 4; affects the MODEL rows c1 <= 1.5 and the saturation statement).** The model
`count()` in caps.py / checks.py drops the second M1 condition 2r + 8z < 3. With it kept, the count at the
critical class is

| c1 | note (first condition only) | with 2r + 8z < 3 kept |
|---|---|---|
| 2, 1.9, 1.75 | 0.59040, 0.58874, 0.58571 | unchanged |
| 1.5 | 0.578277 | 0.578580 |
| 1.25 | 0.564526 | 0.578580 |
| 1 | 0.530655 | 0.578580 |

So lowering c1 alone saturates at count 0.57858 (tau <= 0.0118) from c1 about 1.5 on, and this cap is reached
before the supply cap the note names (0.577003 at L = 0.2105). The rows c1 = 1.9 and 1.75 (2.2e-4, 6.5e-4)
stand. The row c1 = 1.5 is at the edge (critical-class tau 0.01205 -> 0.01175, about 2.5% less; the system gain
1.5e-3 to 1.7e-3 should be read as an upper estimate). The rows c1 = 1.25, 1 and the sentence "saturates near
0.8728-0.8730 because the probe supplies only prime length 0.21" describe a model in which BOTH M1 conditions
are replaced by r + c1 z < 1. (M1+) in section 5 is stated that way, so the text is self-consistent, but
section 5.1 attributes only the first condition to the "+ z_0" charge; removing that charge in the second
hypothesis 3M + 6 z_0 <= 4 F_0 as well gives 2r + 2z <= 3m, which does not bind. This should be said, and the
system rows c1 <= 1.5 rerun with the second condition. Not rerun here at system level.

**R2 (Lemma E, wording of what is PROVED).** The inequality "exponent >= max(1+q, Y) - omega - delta' Y" is
immediate from the definition of (L) and is correct. What it shows is that a hybrid family cannot beat the
q = 0 bound AT LEVEL for the same polynomial. It does not show that a hybrid mean value cannot beat the
available count 0.590332: the floor (1+q)(1-delta_c) is below R_c for all q < 0.1125, and for M_r* x primes
with z up to the supply (Y up to 0.956) the hybrid value 1 + q - delta Y is below R_c for q < 0.039. Route (a)
is closed only in combination with Lemma W's inventory (the polynomials whose q = 0 level value is below R_c
are exactly those needing (M1+)/(M2+)), plus the unproved premise that the hybrid moment is not easier than
the row-only one. For the t-aspect and general coefficients Lemma T supports that premise, but its sieve
shape T(U + K/T + (UK/T)^{2/3}) is quoted without a source; for a target/conductor-aspect hybrid no sieve
shape is given at all. Correct statement: "a hybrid second moment at level never beats the row-only second
moment at level; it lowers the count only if it proves, for some q < 0.039, an M_r Q moment with r + z > 1 - z
that is not known at q = 0." Also: the step "omega > 0 needs the same values chi_n(u) for all n" is stronger
than the definition used in the lemma (same polynomial values); (E1) covers only the former. The note
concedes this in weak step 2; the PROVED label on "the only multiplicity is u -> u a^6" should read
"the only multiplicity with identical character values".

**R3 (Lemma W2 and the "equivalence" sentence).** W2 is stated for q = 0. With the source's own multiplicity
(Lemma 10.10 route, which Lemma E allows) the value of a length-Y product is (1+5Y)/6 - delta Y for Y >= 1,
and the window becomes (0.87285, t*) = (0.87285, 1.16395): its upper end is t* itself, so the detector's
own product M_r* S_m* sits exactly on the boundary (value 0.590332 = R_c, checked). This is a tie and gives
no saving, so the conclusion stands, but the table entry "M_r* S_m*: 0.6177, above by 0.052" is the q = 0
value only. Consequence worth recording: any mixed moment Sum_u |M_r* S_m*|^2 << U^{N} with N < 1.13663
(the trivial level is 1.16395, so an exponent saving of 0.0274) lowers the count; equivalently any mixed
moment over k <= H valid for total length slightly above H. This is the cheapest stated way around the
saddle that the note does not price. It is a below-level (long-polynomial) mean square, true under GRH,
and falls under the note's own caveat in weak step 2; the headline "only via c1 < 2 or c2 < 6 kappa" must
carry the qualifier "among second moments at level" every time it is quoted (the claim line given to this
referee drops it).

**R4 (Lemma J scope).** The lemma is about one inequality chain (Hoelder + restricted large sieve). For
K >= U^{2+eps} the off-diagonal h(u,u') is negligible by Poisson and classical Halasz-Montgomery does give
a bound, R <= K^{1-theta} >= U^{2(1-delta)} > U, which is worse than trivial. So "gives no bound for every
K" should read "gives no bound below the trivial one". The conclusion at the critical class is unaffected
and agrees with the classical 3/4 barrier (square-root size of the pair sums). The constant in
N_B >= c max(R, K^k) for thin row sets is already flagged by the author.

## A way around (requested)

1. The below-level mixed moment of R3 (saving 0.0274 in the exponent of Sum |M_r S_m|^2 at r + m = 1.164
   over rows of size U; or its amplified form). Not excluded by any lemma here; it is the same kind of
   statement as (M1+) (expected under GRH, no known method).
2. Two detector scales at once (author's weak step 2): for t1 < t2 the row supplies two pairs; a product
   such as M_{r1} conj(M_{r2}) or S_{m1} S_{m2} with n1 != n2 in M2 is not in the inventory. M2 already
   allows n1 != n2, and the adversary's best reply was not computed. Unpriced.
3. Relaxing only the first M1 condition is worth at most tau = 0.0118 (R1); to go further both must move.

## Dependence on unrefereed inputs

Every number (delta_c, kappa_flat, R_c, the window, the price table) depends on Liu II Lemma 13.7,
(13.2), (13.3), Lemma 10.10 and through kappa_flat on B_flat, hence on all four unrefereed texts. Lemmas E
and J as inequalities are input-free; their application ("critical class has 0.4693") is not. Section 5.1
is READ, not derived, as the author states; I checked only that the substitution F_0 = r + z,
M = 2(r+z) - m, z_0 = z reproduces r + 2z <= m and 2r + 8z <= 3m (it does).

## Bottom line

* Holds: no tau > 0; B_flat unchanged; (b) and (c) closed at the critical class; (a) closed for second
  moments at level given the saddle inventory; the saddle (0.7457, 0.4183) and window are exact.
* Weakened: Lemma E's headline (R2); "only via prime cost" (R3 qualifier); c1-only saturation is set by
  the second M1 condition at count 0.57858, and model rows c1 <= 1.5 need a rerun (R1).
* MODEL rows c1 = 1.9, 1.75 confirmed at the critical class; system-level B gains not rerun by the referee.
