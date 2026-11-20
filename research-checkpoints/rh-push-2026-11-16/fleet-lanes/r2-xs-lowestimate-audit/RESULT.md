# r2-xs-lowestimate-audit: line audit of the unverified steps below 7/8

Status: internal working note, 2026-11-16. Unrefereed. No new zero-free region and no new Lambda bound is claimed.
RH open, no QED. Labels: PROVED (exact algebra or interval enclosure, script in this directory), READ (compared
line by line with the source text, no computation possible), MEASURED (random-point test), NOT VERIFIED.

Sources read in full for this audit: Xu-Sang 2610.15291v2 (`bypass-78/dl/2610.15291.txt`, all 33 pages);
manuscript `~/lean-deps/qrh-verify/paper.txt` sections 6, 7.2, 10.1-10.8, 12, 14.4, 15, 16, 19.2, 20.1;
Liu 2610.26835v2 section 14; Liu 2610.12234v2 sections 15-16.

## 0. Plan; what is new relative to the atlas and round 1

Round 1 (`zf-audit-inputs`) checked the endpoint certificate (40), the exponent algebra, the admissibility scalars
and Appendix A. It left open: Proposition 3.1 for l > 1/6, Appendices B, C, E, F, the r_* range (sampled only) and
Liu II Lemma 14.10. This note does those five items. New on record:

1. Proposition 3.1 re-derived from the proof text of manuscript Lemma 15.1 / Proposition 15.3 with l free; every
   place where l = 1/6 or the fixed geometry is used is listed (section 2.1).
2. A proof of 3/5 <= r_* <= 1 and 1/3 <= t - r_* <= 1/2 (section 2.2). It holds for all 0 <= c <= 1.
3. The exponent tables of Appendix C rebuilt from the manuscript's local table (7.16) and maximised exactly over
   the regions used (section 2.4).
4. Liu II Lemma 14.10 replayed with Arb balls on a cover of the whole range 13/18 <= kappa <= 1 (30001 boxes), with
   one statement the paper does not make: F_flat is increasing on all of [13/18, 1] (section 2.6).
5. Two facts about the Lean base that change how the chain should be labelled (section 3).

No wall is touched: this is verification of an existing chain, not a route to RH.

## 1. Step table

| # | step | what was done | verdict |
|---|---|---|---|
| 1 | XS Prop 3.1, completed-row norm `sum |B^J_m|^2 << Z^{M'+L_l(d)}`, `L_l(d) = (5l+d-1)_+/4` | re-derived from manuscript l.6131-6290 with l free; identity (15.3) symbolic; 109,970 random points of formula (14.14), 0 violations; bound attained at one corner | **verified** relative to manuscript Lemma 14.3 as stated |
| 2 | XS Prop 3.1, Gram step and tuple count, inequality (17) | Prop 15.2 is stated for general `Q, Y'` with `P_a >= 1`; the five numeric conditions of Prop 15.3 are replaced by (11); (17) proved | **verified** relative to manuscript Prop 15.2 as stated |
| 3 | XS Prop 3.1, Poisson representation (18), normalizer, `C_b` | (18) is manuscript (16.7) (coefficientwise in the scales); `C_b(s) = lx/2 + s - 1 + h/6` for every l; `A_T` as manuscript (20.1) | **verified** (READ + algebra) |
| 4 | XS Prop 4.1, `r_*` range and admissibility of both selections | proved, section 2.2; `A_I`, `A_P`, `R_sh`, `t_*`, (21), (22) symbolic | **verified**; the hypothesis `c <= 6/13` in the text is not needed for this step |
| 5 | XS Prop 5.1 and (23), (24), (26), full-capacity identity, (32) | symbolic / exact | **verified** given the plain moment (6) |
| 6 | XS Section 6: (27), (28), (33), `A_sm`, floor endpoint, Lemma 6.3 | (27) derived from the raw powers of (18); the rest symbolic | **verified** |
| 7 | Appendix B: (38), Lemma B.1, dual coefficient, S-part, Sobolev in `log Q`, tail | algebra checked; analytic statements READ | **verified** (algebra PROVED, uniformity READ) |
| 8 | Appendix C.2 = Lemma 6.2 | table rebuilt from (7.16); maxima on region (31) exact | **verified** given manuscript Lemma 7.1 |
| 9 | Appendix C.3, amplitude-dependent contours | compared with manuscript Lemma 10.3; holomorphy region checked | **verified by reading only**; weakest step, see section 6 |
| 10 | Appendix C.4 and Lemma C.1, principal region lowered to 87/100 | all nine printed exponents recomputed; remainders symbolic | **verified** given manuscript Lemmas 7.1, 10.5 |
| 11 | Appendix E: 14 printed rationals, supply, small rows, distant rows | exact | **verified** |
| 12 | Appendix F: order of choices | traced for circularity | **verified by reading**; `P_0` after `e` is left implicit |
| 13 | Liu II Lemma 14.10 (1)-(3) | sympy + Arb on 30001 boxes; fixed point and enclosures | **verified** (PROVED as a scalar statement) |
| 14 | Liu II Lemma 14.11, Theorem 14.12, cyclotomic inputs M1/M2 | not in the task | NOT VERIFIED |

No error was found in the steps checked, so there is no counterexample to report. Scripts: `xs_audit.py` (88 checks, 0 fail),
`liu_1410_replay.py` (28 checks, 0 fail).

## 2. Work

### 2.1 Proposition 3.1 for 1/6 < l <= 1/5

Geometry: `lx + ly = 1 - l`, so the manuscript's `M = lx + ly` satisfies `M + l = 1` for every l. With
`M' = 1 - l - 2d`, `l' = l - d`: `M' + l' - 1 = -3d` (PROVED). This is the only structural relation the proof
of Lemma 15.1 uses.

Places where the manuscript uses l = 1/6 or the fixed geometry in the low estimate (complete list for l.6098-6512):

| line | text | status at general l |
|---|---|---|
| 6110 | `0 <= d <= l = 1/6` | replaced by `0 <= d <= l` |
| 6137, 6279-6289 | `((d - 1/6)/4)_+`, "At d = 1/6 one has l' = z_a = 0" | becomes `(5l + d - 1)_+/4`; the remark is not used |
| 6474 | `P_a = q_{b*}^{-1} Z^{1/8}` | `P_a = q_{b*}^{-1} Z^b >= 1` since `b > 0` |
| 6476-6478 | `M' >= 1/2`, `lx - d >= 3/16`, `ly - d >= 5/16`, `ly - d - 11b/6 >= 1/12` | need only positivity: `M' >= 1 - 3l >= 2/5`, `lx > l`, `ly - l > 11b/6` (XS (11)); at the two triples the margins are 8243/40000, 16079/120000 and 2060527/10^7, 669701/(5 10^6) |
| 6462, 6511 | `3/16 = lx/2 + b/12`, `C_II(7/8) = 3/16` | `C_b(B(l)) = lx/2 + b/12` (PROVED) |

Chain of the row-norm proof with l free (each line checked against l.6226-6290):

* `T_d - (H - 3d) = H - M' + 2A_0 + 2(z_a - l') - N_0 - 3B_0 - theta_N <= 2 eps_Z + |theta_N|` (identity PROVED;
  uses `H <= M' - O`, `2A_0 <= O`, `z_a <= l'`). Hence `max(H, v + l_b) = H + o(1)` on retained dyads.
* Branch `u = z_a`: `E_ref <= O/2 + H = M' - O/2 - Delta_H`.
* Other branch: `u + l_b + 2e/3 + (T_d - y)_+/2 >= T_d/4`; identity (15.3) holds in all variables (PROVED);
  with `N_0 <= A_0`, `z_a <= l'`: `E_ref <= M' + (1 + 3l' - 2M' - 2 Delta_H)/4`, and `1 + 3l' - 2M' = 5l + d - 1`.
* So `sum_m |B^J_m|^2 << Z^{M' + (5l+d-1)_+/4 + eps}`. MEASURED cross-check: formula (14.14) evaluated at 109,970
  random admissible points with 1/6 <= l <= 1/5 never exceeds this; PROVED sharpness inside the formula: at
  l = 1/5, d = 4/25, `O = Delta_H = 0`, `z_a = l'`, `v = 0` one has `T_d = 0` and `E_ref - M' = 1/25 = (5l+d-1)/4`.
* Per tuple: `Q^{-1/2} ((Q/Y') P_a^{1/6})^{1/2} Z^{(M'+L)/2} = Z^{(lx-d)/2 + b/12 + L/2}` (PROVED). Tuple count `Z^d`,
  coefficient `Z^{-3d/2}`: total relative exponent `-d + (5l+d-1)_+/8 <= -7d/8`, equivalent to `l <= 1/5` (PROVED).
  Beyond 1/5 the method's bound fails at d = 0: l = 201/1000 gives +1/1600.

At the certified lengths l_0 = 10027/60000, l_1 = 1253399/7500000 the extra term is nonzero only for
d > 1 - 5l = 0.1644, where the relative exponent is below -0.14. The low estimate is not the binding constraint.

Independent source: Liu 2610.12234v2 Lemma 16.1 / Proposition 16.2 (dated before Xu-Sang) derives the same
`Z^{M' + (d_I + 5l - 1)_+/4}` by the same chain. The two texts agree line for line.

Not checked: the proof of manuscript Lemma 14.3 itself and of Proposition 15.2. Both statements carry no
restriction on l (Lemma 14.3: "log-lengths range over fixed bounded sets"; Prop 15.2: "general polynomially
bounded Q, Y' with P_a >= 1").

### 2.2 The r_* range (PROVED)

`D = 3 - (1+2c)x`, `r_*(t) = ((2-2cx)t + (c-1)x)/D`, for 0 <= x <= 1/2, 0 <= c <= 1, 1 <= t <= 3/2.
`D >= 3 - (1+2c)/2 >= 3/2` and `2 - 2cx >= 1`, so `r_*` is increasing in t. Exact identities:

    r_*(3/2) = 1,     r_*(1) - 3/5 = (1 - (2-c)x) / (5D) >= 0   because (2-c)x <= 1,
    t - r_* = ((1-x)t + (1-c)x)/D  (increasing in t),   (t - r_*)(3/2) = 1/2,
    (t - r_*)(1) - 1/3 = (1-c)x / (3D) >= 0.

Hence `3/5 <= r_* <= 1` and `1/3 <= t - r_* <= 1/2`. The value 3/5 is attained only at (t, x, c) = (1, 1/2, 0); at
c = 1/(3 kappa) in [1/3, 6/13] the minimum is (3-c)/(5-2c) >= 8/13. Consequences used by Xu-Sang: inverse selection
`z_M = (1-r)/2 <= 1/5` (this is why the supply condition is `l/(h+zeta) > 21/100`), second inverse margin
`3 - 2r - 8z_M = 2r - 1 >= 1/5`, plain selection `<= 1/(18 kappa) <= 1/13`. 200,000 random points: no violation.

### 2.3 Proposition 5.1, Section 6, Appendix B

PROVED (symbolic): (23); Hoelder exponent (26); the full-capacity identity `(R - (6k - 2q)L)/4`; (32) equals
10799/6000000 at delta = 1/8, kappa = 29991/40000 and increases with delta; `theta <= 5/52`; (27) equals the raw
power of (18) on `Re s = a`, `Re w = 1/2 - theta`, `Re z = z_0` minus `C_b(B(l))`, for every `z_0`; (28) and (33)
are (27) at d = h with `theta = q/(6k)` and `theta = ql/h`; `E_small <= C_0 + A_sm delta`; floor endpoint
`C_0 + delta(1/2 + 3l/2)` (pointwise cost `U^{1+theta}`, i.e. `K + theta/2 = 1 + theta`); Lemma 6.3 slopes
in [7/200, 991/1350].

Appendix B. (38) follows from `Lambda(w) = I(w, chi) + eps I(1-w, chi-bar)` and `Q^{(1-w)/2 - w/2} = Q^{1/2-w}`
(checked by hand); `Q = 3 N f/(4 pi^2)` is `|d_F| N f/(2 pi)^2`; the shift to `Re v = -1/4` crosses no gamma pole on
2/5 <= sigma <= 3/5; `|Gamma(1-w)/Gamma(w)| << (1+|t|)^{-2 theta}`; dual coefficient identity PROVED; tail exponent
149/100 PROVED. READ: the conductor Sobolev step uses `|d_Q (S^2 Q_sel)|^2 = 4|S|^2 |d_Q S|^2 |Q_sel|^2`, an
instance of the moment with two different plain profiles of equal length, which manuscript Lemma 18.1 permits
(`W_1`, `W_2` independent). The slot character of a physical prime relative to the numerator `chi_.(u)` is
`1_{p in 1_T}`, a combination of characters of T-hat inside Theta, as Lemma 18.1 requires.

### 2.4 Appendix C

From manuscript (7.11)/(7.16), with `X, W, Z` the real parts of `s, w, z` (PROVED by `xs_audit.py`, block E):

* p | u, after separating `Q^z`: boundary exponents `(X - 1) + J_j` equal Xu-Sang's table
  (`-1-W; 1/2-2X; 1-2X-W, 1-3X; 3/2-3X-W; 2-5X`). On region (31) (`X >= a >= 51/100`, `W >= max(1-a, 2/5)`,
  `Z = 17/50`) all are non-increasing in X and W; the maximum over the region is -51/100 < -1/2. Common R term
  -159/100, rescaling term -7/5.
* Strict term (j >= 2): exponent `-W = theta - 1/2`; with the conductor deficit `-(j-1) theta` it is
  `-1/2 - (j-2) theta <= -1/2`.
* p not | u: `-X, -6Z, 4-5X-6Z, 1-W-6Z`, maximum -51/100 on (31).
* (31) lies in the first Euler region: `Re(s+w) - 1 = a - 1/2 - theta + 16e >= 16e` because `theta <= a - 1/2`.
* C.4 on `D_2' = {X >= 87/100, W >= 19/20, Z >= 33/200}`: `|R| <= Q^{-221/100}`, `|V| = Q^{-99/100}`,
  `|D| <= Q^{-87/100}`, `H_p - 1 = O(Q^{-181/100})` (p not | u), `O(Q^{-41/50})` (p | u), principal error exponents
  -87/100, -99/100, -134/100, -94/100. All nine equal the printed values.
* Lemma C.1 remainders `(1+h)e - ly/20` and `e - h/600` (PROVED from the outside power).

### 2.5 Appendices E, F

All printed rationals reproduced exactly at both triples: low-scale margins, `C_0 + A_sm/8`
(-191530333/45730080000, -47785783297087/11432841120000000), floor (-5837/500000, -8748053/750000000), small rows
(-433393/6000000, -108354377/1500000000), `ly/20`, `h/600`. Slack below the thresholds: small delta 1.9e-4 and
1.8e-4, floor 1.7e-3, small rows 2.2e-2; `2 zeta` is 2e-7 and 2e-9. Small-row row power `1 + 3/5 + 1/2 - 17/50 = 44/25
<= 2`. Appendix F: mesh (depends on real ranges and loss only) -> K -> mu, gamma -> e and small losses -> target
data (including `P_0`, which must follow e; manuscript Prop 16.1 says so, Appendix F leaves it implicit) -> tau ->
tail order. No circular dependence found.

### 2.6 Liu II Lemma 14.10, replayed on the full domain (PROVED)

`liu_1410_replay.py`, python-flint 0.9.0, 160-bit balls, cover of [13/18, 1] by 30001 closed boxes with exact
rational endpoints (each ball checked to contain both endpoints).

* Symbolic: `E(delta, 1/2)` is affine in (b, l); `d_b E = cr/(24 kappa (54 delta kappa - 6 delta - 75 kappa + 10))`;
  the bracket equals `-36 kappa J(delta, 1/2)`; the printed `l_*(delta, kappa)` equals `-E|_{b=l=0} / d_l E`
  identically (not only on cr = 0).
* (1): `cr(1/8, .)`, `cr(23/50, .)` negative and `cr(12/25, .)`, `cr(5/6, .)` positive on [13/18, 1] by exact root
  counting; on every box 23/50 < delta_c < 12/25 and the other root exceeds 5/6 (enclosure [0.46790, 0.47851]).
* (2): lambda >= 1.06867 on every box; `d_delta cr >= 194.93`.
* (3): `d l_*/d kappa` in [-0.006579, -0.003353] on every box of [13/18, 1]; G' >= 0.49835;
  G(13/18) = -0.013732..., G(1) = 0.124831...; G changes sign on [0.749773294079928, 0.749773294079929]; the
  delta-resultant is `-1200 k^2 (6k-1)^2 (15k-2)(42k+5)` times the printed quartic; the quartic has one root in
  [7/10, 8/10]; kappa = 2B - 1 gives twice the printed B-quartic.
* Enclosures:
  `B_flat = 0.87488664703996413094461400053018...` (exact bisection of the quartic, 40 digits);
  `F_flat(kappa_flat) = [0.874886647039964130944614000530 +/- 1.9e-31]`, `delta_c = 0.469344858698143...`;
  `F_flat(13/18) = [0.874843412008167274607864609464 +/- 2.3e-31]`;
  `F_flat(3/4) = 0.874886989357901500...`, `F_flat(29991/40000) = 0.874886649616631419...` (Liu's B_lim).
* New relative to the paper and to `zf-hecke-all-fields` (which had it MEASURED on a 2001-point grid): `F_flat` is
  increasing on all of [13/18, 1], so `F_flat(13/18)` is the minimum of the scalar system over the whole moment range.
* Consistency: Xu-Sang's `l_0`, `l_1` lie below `l_*(3/4) = 0.1671187092...`, `l_*(kappa_1) = 0.1671200682...`.

Scope: this is the scalar fixed-point statement. `B_flat` as a zero-free boundary also needs Lemma 14.11 and
Liu II's cyclotomic inputs; neither was replayed.

## 3. Abscissa supported

| level of support | abscissa |
|---|---|
| Lean kernel on this machine | 7/8 |
| plus every Xu-Sang step, checked here and in round 1, given the manuscript's numbered statements (Lemmas 7.1, 14.3, 17.1, 17.6, 18.1 at kappa = 3/4, Props 8.3, 15.2, Lemmas 10.3-10.6) as written | B_0 = 69991/80000 = 0.8748875 |
| plus Appendix A (kappa >= 13/18, hand check, round 1) | B_1 = 0.8748867 |
| plus Liu II Lemma 14.11 and its own framework (not audited) | B_flat = 0.874886647039964 |

What survives if one step is rejected:

* Prop 3.1 for l > 1/6 rejected: l = 1/6 gives B = 7/8. Nothing below 7/8 survives (Liu I's B_new also uses l > 1/6: l_new = 0.1668).
* Appendix C.4 rejected: the principal contour needs `beta_* + e` inside the Euler region, and `beta_* <= 7/8`; nothing
  below 7/8 survives.
* Averaged numerator (Prop 5.1, Appendix B, C.2-C.3) rejected: Liu I's pointwise system, 0.874957019.
* Appendix A rejected: kappa = 3/4 only, B_0 = 0.8748875 (infimum at that kappa: 0.8748869894).

Fully checked steps only (kernel-checked): 7/8. Two facts about the Lean base:

1. READ: the local Lean library records the compensated geometry only at the manuscript's values
   (`SevenEighths.Parameters.compensated_geometry`, `d <= 1/6`, lengths 17/48, 23/48, b = 1/8). The low estimate for
   l > 1/6 therefore has no local Lean base, in the same way that the plain moment has none for kappa < 3/4. Lean
   statements were not matched to manuscript lemmas beyond this.
2. READ: Liu 2610.12234v2 states that its conclusions B_r, B_alg, B_new (which use l > 1/6 and kappa >= 13/18) have
   Lean 4 formalizations (`combine_v2-2_lean/PartsI_III.lean`, `PartIV.lean`). That repository is not on this
   machine and was not checked. Liu II states its own Lean work is in progress.

## 4. DH control

The direct estimate of Proposition 3.1 uses cubic theta reflection, the quadratic and cubic large sieves and
the additive Gram bound; it contains no L-function and would hold for any target coefficients of this shape. The
Euler product enters at the Poisson side: (a) the scalar factorization (7.13) with `1/L^S(s, eta chi_.(u))` and the
local factors `H_p` (Lemma 7.1, Appendix C); (b) Moebius coefficients of the inverse witness (Prop 8.3, Prop 4.1);
(c) prime polynomials bounded through `L'/L` (Lemma 18.1, Appendix A); (d) multiplicativity of `chi_.(u)` in the
approximate functional equation and the primitive/natural comparison (Appendix B). For Davenport-Heilbronn the
reciprocal is not a Dirichlet series with multiplicative coefficients and (a)-(d) fail. Nothing audited here
applies to DH.

## 5. Verdict

Every step named in the task was checked and none failed: Proposition 3.1 for 1/6 < l <= 1/5, the r_* range,
Appendices B, C, E, F at the level of every displayed exponent and inequality, and Liu II Lemma 14.10 on its full
domain with enclosures of B_flat and F_flat(13/18). The chain below 7/8 still rests on manuscript statements whose
proofs are kernel-checked only in the fixed geometry (l = 1/6, kappa >= 3/4), and on analytic uniformity claims
that were read, not replayed. Kernel-checked abscissa: 7/8. Hand-checked abscissa given the manuscript's statements
as written: 0.8748867.

## 6. Three weakest steps

1. Manuscript Lemma 14.3 and Proposition 15.2 are used at a geometry the Lean build does not cover. Their printed
   statements are parameter-free, but only the statements were used; a hidden use of l = 1/6 inside their proofs
   (l.5862-6096, 6297-6455) would not have been seen from Lemma 15.1's proof alone. Lemma 14.3's proof was read and
   shows none; Proposition 15.2's proof has no slot parameter at all.
2. Appendix C.3 (w-line depending on the row's amplitude class, which depends on z) and the Sobolev step for
   row-dependent conductors in Appendix B are verified by reading. The holomorphy region and the moment's profile
   class were checked; the join and trace estimates were not replayed.
3. The audit works from PDF text extractions; table (7.16) and several displays were transcribed by hand. The
   Liu II replay proves the scalar lemma only; Lemma 14.11 and Liu's Lean claims are unchecked.

## 7. Files

`xs_audit.py`, `xs_audit.log` (88 checks); `liu_1410_replay.py`, `liu_1410_replay.log` (28 checks);
`.venv/` (python-flint 0.9.0, sympy 1.14.0). Run: `.venv/bin/python xs_audit.py`, `.venv/bin/python liu_1410_replay.py`.
