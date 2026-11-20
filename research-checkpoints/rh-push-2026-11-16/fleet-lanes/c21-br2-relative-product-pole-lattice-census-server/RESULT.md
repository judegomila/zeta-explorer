# c21-br2-relative-product-pole-lattice-census-server: RESULT

Lane kind: compute (heavy lane, server through rhrun). Date 2026-11-20. Labels: PROVED / CLASSICAL / MEASURED /
ARGUED / OPEN. Nothing here is a statement about zeros of zeta. No score is claimed.

## 1. Plan and what was asked

Object (regime (K) of `c20-euler-shape-rigidity-infinite-modified-primes`): R_S(s) = prod over p in S of
(1 - p^(1/2-s))/(1 - p^-s), G = zeta/R_S (local parameter alpha_p = p^(1/2) on a sparse infinite set S).
Question: does 1/R_S blow up radially at the local pole points (supporting a natural boundary, hence no twin)
or does it have bounded radial limits somewhere (naming where a twin could exist)? Statistic:
y(delta, t) = log abs(1/R_S(1/2 + delta + it)), beta = slope of y against log(1/delta), delta = 2^-j.
Pre-registration: `PREREG.md` (written before any run). Code: `census.py` (final, version 3),
`census_v1.py`, `census_v2.py` (earlier evaluation kernels, kept), `analyse.py`, `referee.py`.

What is new against the map: c20 left the existence of a twin in regime (K) OPEN and recorded
"natural boundary expected; not proved" for abs(alpha_p) = p^(1/2) on a super-sparse set. This lane (i) proves
that for alpha_p = +p^(1/2) no infinite S gives a twin (Lemma P0, three lines), (ii) proves the natural
boundary for lacunary ratio > 2 (Lemma P1), (iii) measures the radial exponent in ball arithmetic on five
sets and six control families.

## 2. Proved statements (written in PREREG before the run, tested by it)

**Lemma P0 (PROVED, elementary).** Let S be an infinite set of primes with sum over S of q^-delta finite for
every delta > 0 (so the product converges in Re s > 1/2). Then R_S is not meromorphic at s = 1/2; hence
G = zeta/R_S is not meromorphic on C and is not a twin.
Proof. For delta > 0, 0 < R_S(1/2 + delta) = prod (1 - q^-delta)/(1 - q^(-1/2-delta)). Every numerator is in
(0, 1); prod 1/(1 - q^(-1/2)) = C converges (sum q^(-1/2) finite). For any M primes q_1..q_M of S:
R_S(1/2 + delta) <= C prod_{i<=M} (1 - q_i^-delta) <= C prod (delta log q_i) = C_M delta^M.
A function meromorphic at 1/2 and not identically zero satisfies abs f(1/2 + delta) >= c delta^n for some
integer n and all small delta > 0. R_S has no zero in Re s > 1/2, so it is not identically zero; take
M = abs(n) + 1. zeta(1/2) != 0, so the same holds for G. QED.
Scope: alpha_p = +p^(1/2) exactly on S, 1 elsewhere. The proof reads positivity of all factors on the real
axis at the single point s = 1/2. It says nothing for alpha_p = p^(1/2) e^(i phi_p) with phases, nor for the
general analytic local factors n_p of c20 Theorem C. Remark (ARGUED, same proof, not written out): it extends
to real alpha_p = p^(1/2)(1 - eta_p) with 0 <= eta_p <= (log p)^-A for every A when
N_S(X) - N_S(X^(1/A)) -> infinity.
Measured check (t = 0 row of every set, section 4): y(delta, 0) grows faster than any multiple of
log(1/delta); S1: y = 8.797, 51.03, 128.06, 239.68, 385.89, 566.70, 782.10 at j = 4, 10, ..., 40
(the main term, sum over log q <= 1/delta of log(1/(delta log q)), is about 783 at j = 40).

**Lemma P1 (PROVED, elementary).** Let S = {q_1 < q_2 < ...} with log q_(k+1)/log q_k >= lambda > 2 for all
large k. Then at every pole point t_0 = 2 pi k/log p (p in S, k integer):
y(delta, t_0) >= (1 - log 2/log lambda) log(1/delta) - C(p), so R_S(1/2 + delta + i t_0) -> 0, and the line
Re s = 1/2 is a natural boundary of R_S (no meromorphic continuation across any arc).
Proof. The factor of p is 1/(1 - p^-delta) >= 1/(delta log p). Every other denominator factor has
abs(1 - q^-delta e^(-i theta)) <= 1 + q^-delta, and sum over q of log(1 + q^-delta) <=
log 2 #{q: log q <= 1/delta} + sum over log q > 1/delta of e^(-delta log q)
<= (log 2/log lambda) log(1/delta) + C. The numerators satisfy prod abs(1 - q^-s) >= prod (1 - q^(-1/2)) > 0.
Pole points are dense in t (spacing 2 pi/log p -> 0). If R_S continued meromorphically to a disc centred on
the line, it would be analytic at all but finitely many pole points of a smaller disc and equal to its
radial limit 0 at each of them; its zeros would accumulate inside the disc and R_S would vanish
identically. QED.
Applies to S0 (log q_k = e^k, lambda = e, exponent bound 0.307). It does not apply to S1
(lambda = e^(1/2), bound 1 - 1.386 < 0) or to S2, S3, S4; for those the natural boundary on the whole line is
MEASURED/ARGUED only. The no-twin conclusion does not need it (P0).

## 3. Runs

Server, through rhrun only, after rhstatus. Units: c21cz (zeros), c21cS2, c21cS3, c21cS4, c21csm (small rows
and RAND rows), c21cfx (version 2), c21cS3v2, c21cv3 (version 3), c21cref (referee), short analysis units.
At most 16 cores at any time. All units have exited; none was left running. Outputs on the server:
`~/rh-push/c21-br2-relative-product-pole-lattice-census-server/out` (v1), `out2` (v2), `out3` (v3); local
copies: `summary_out.json`, `summary_out2.json`, `summary_out3.json`, `an_out*.txt`, part of `out/`
(the full point files, 218 MB, were left on the server because the link was slow).

Sets (q_k = nearest prime to exp(f(k))), all enclosed with tail bound <= 2.7e-35 per y value:

| Row | f(k) | j range | primes multiplied (K) | exactly searched | precision (bits) |
|---|---|---|---|---|---|
| S0 | e^k | 4..40 | 33 | 8 | 192 |
| S1 | e^(k/2) | 4..40 | 65 | 15 | 192 |
| S2 | k^3 | 4..40 | 46253 | 11 | 192 |
| S3 | k^2 | 4..30 | 310864 | 38 | 128 |
| S4 | k^1.5 | 4..24 | 1316158 | 131 | 128 |

K is the full truncation needed for the 1e-30 tail bound at the smallest delta of the row; for S3 and S4
the j range (not K) is the feasibility limit, as pre-registered (S4: 3.6e6 factor pairs per point, 3377 s on
8 cores for 10^4 points). No duplicate primes occurred. No float64 or GPU number is used anywhere.

Deviations from PREREG, all in the evaluation kernel, none in the object, sets, points or statistic:
1. v1 (abs(1 - r e^(i th))^2 = (1 - r)^2 + 2r(1 - cos th) in balls, 1 - r from expm1; this form replaced
   1 - 2 r cos th + r^2 after a small test showed a dependency loss at t = 0, before the registered runs)
   gave valid enclosures but non-finite ones at near-resonant factors (the ball contained 0): S2 42 of 56
   pole points, and 1 to 19 generic points per row.
2. v2 writes 2(1 - cos th) = 4 sin^2(th/2) cut at 0. Still 12 + 2 non-finite cells at j = 40 in S1, S2 (an
   Arb ball has a 30-bit radius and cannot hold [tiny, large] with a positive lower end).
3. v3 accumulates lower and upper products separately. No non-finite cell remains in any v3 row.
   Rows reported from v3: S0, S1, S2 (all parts), S3 parts (a), (c), MINUS, DEL/THIN on S1, RAND on S1.
   From v2: S3 part (b) (2 non-finite of 10^4, counted undecided), S4 parts (a), (c), DEL/THIN on S2, HQ1,
   RAND S2, RAND S3/S4 part (a). From v1: S4 part (b) (0 non-finite), RAND S3 part (b) (6 non-finite of
   2000, excluded from its statistics), RAND S4 part (b) (0 non-finite). Where a row exists in two versions
   the counts, means and extremes of the summaries agree.
4. The first launch command asked for unit memory limits summing to 42 GB and was refused by the permission
   layer; it was reissued at 32 GB. While the v2 batch overlapped the main runs the unit limits summed to
   34 GB for about 25 minutes (rh.slice resident use, all lanes together, was 14 to 26 GB at every reading).
5. No python-flint or mpmath on the Mac: the referee rerun also ran on the server (1 core, rhrun).

## 4. Results (MEASURED; every number is an Arb enclosure midpoint, radius stated where it matters)

beta_OLS over the row's j range. "pos"/"neg" = enclosure entirely > 0 / <= 0.

### (a) pole points (t = 0 once; 56 points t = 2 pi k/log p, k in {1,2,3,5,8,13,21}, 8 primes per set)

| Row | t = 0: beta_OLS, y at last j | t != 0: pos / neg | mean | sd | min | max | max radius |
|---|---|---|---|---|---|---|---|
| S0 | 15.75, 397.7 | 56 / 0 | 0.979 | 0.200 | 0.636 | 1.605 | 3.7e-6 |
| S1 | 31.00, 782.1 | 56 / 0 | 1.020 | 0.275 | 0.548 | 1.930 | 1.0e-4 |
| S2 | 778.5, 33171 | 48 / 8 | 107.4 | 91.2 | -3.31 | 375.4 | 0.086 |
| S3 | 2414.8, 75850 | 44 / 12 | 99.9 | 146.6 | -41.8 | 480.4 | 8.9e-4 |
| S4 | 5278.2, 125622 | 29 / 27 | 1.24 | 11.8 | -23.2 | 36.1 | 9.4e-5 |

Per prime, S2 (seven k each): prime 3: -1.63, 1.42, -3.31, 0.69, 0.13, -1.03, -0.91; prime 2971 (k = 2):
1.87, 3.66, 0.17, -0.63, -0.83, -1.39, -1.09; k = 3: 199 to 331; k = 4: 176 to 375; k = 5: 148 to 154;
k = 9: 77 to 112; k = 10: 70 to 154; k = 11: 69.7 to 70.1.

Finding N1 (MEASURED; mechanism ARGUED). For S2 and S3 the exponents f(k) are integers and log q_k is within
about f(k) e^(-f(k)) of f(k) (measured log q_3 = 27.000000000013536 in S2). A pole point of q_k is then a
near-pole of every q_m with f(m)/f(k) an integer (m a multiple of k), over the whole tested range of delta,
and y grows as at t = 0 on a subsequence: the slopes 70 to 480 are finite-range slopes of a
super-polynomial growth, not exponents. The primes whose logarithm is not near an integer (k = 1, 2 in S2;
k = 1, 2, 3 in S3) and those of S4 (k^1.5 is an integer only for square k) show mixed signs of size
sqrt(N_S(1/delta))/log(1/delta).

Assigned prediction (a) "beta > 0 at the pole points for the two sparsest sets":
- S1: HOLDS at all 57 tested points (upper-half-range slopes also all positive, 0.32 to 2.06).
- S2: FAILS as stated: 8 of 56 pole points with t != 0 have beta_OLS < 0 with enclosure (all at the primes 3
  and 2971; 8 of those 14). This is the outcome written in PREREG item P2 before the run (fluctuation
  about sqrt(N pi^2/12) against log(1/delta)). N1 was not predicted.

### (b) generic t (10^4 seeded) and (c) zeta zero ordinates below 1000 (649): record only

| Row | (b) pos / neg / undecided | mean beta | sd beta | min, max beta | sd of y at last j | y range over all j | (c) pos / neg | (c) sd beta |
|---|---|---|---|---|---|---|---|---|
| S0 | 4626 / 5374 / 0 | -0.001 | 0.194 | -0.52, 1.13 | 4.56 | -12.9, 21.2 | 293 / 356 | 0.189 |
| S1 | 4713 / 5287 / 0 | -0.003 | 0.273 | -0.90, 1.38 | 6.47 | -20.4, 30.3 | 292 / 357 | 0.277 |
| S2 | 4924 / 5075 / 1 | -0.002 | 2.30 | -8.09, 17.7 | 76.8 | -279, 512 | 313 / 336 | 2.32 |
| S3 | 4956 / 5042 / 2 | -0.039 | 5.73 | -37.5, 39.7 | 140.8 | -1188, 1249 | 326 / 323 | 5.34 |
| S4 | 4928 / 5072 / 0 | -0.133 | 8.58 | -31.9, 32.8 | 159.8 | -544, 627 | 317 / 332 | 8.36 |

Largest radius of beta_OLS among generic points: 0.14 (S1), 0.20 (S2); median radius of y at the last j
below 3e-3 in every row. Reading (MEASURED): at generic t the slope is centred at 0 with both signs in
nearly equal proportion, and y spreads with standard deviation of the order sqrt(N_S(1/delta) pi^2/12)
(6.8, 4.8, 92, 164, 232 for S1, S0, S2, S3, S4 against 6.5, 4.6, 77, 141, 160 measured). Zero ordinates are
not distinguished from generic t in any row.

### Threshold
No set has beta <= 0 at every tested point: t = 0 is a tested point with super-polynomial growth in every
row, and this is forced for every infinite S by Lemma P0. No twin candidate subclass is reported; within the
family alpha_p in {1, p^(1/2)} none exists.

## 5. Controls (same statistic on m = G/zeta, same points)

| Control | Expected | Measured |
|---|---|---|
| DEL on S1, S2 (m = prod (1 - p^-s)) | beta = 0 | abs(beta_OLS) <= 0.0030 (S1), 0.0011 (S2) at all 10^4 + 57 + 649 points; upper-half slope 0 to four decimals; radius 1.2e-36 (generic, pole), 4e-26 (zeros) |
| THIN on S1, S2 (alpha_p = -1) | beta = 0 | abs(beta_OLS) <= 0.0045 (S1), 0.0015 (S2); same radii |
| HQ1 as worded in the assignment (single prime, same local factor): q = 3 and q = 528491303 | 1 at its pole points, 0 elsewhere | pole points: 0.9986 and 0.9932 (upper-half slope 1.0000), all 8; generic: beta <= 0.14 and 0.25, upper-half slope <= 0 at 9999 and 9996 of 10^4 |
| HQ1 of the map (factor 1 + eps u/(1 - u)^2, q = 3, eps = 1; secant slope) | 2 at pole points | 1.9998 at all 8 pole points; -0.06 to 0.23 at 200 generic points |
| RAND on S1 (seeds 1, 2), same counting function | as S1 | pole points 56 / 0 and 56 / 0 positive (means 0.925, 1.012); generic sd 0.272, 0.278; t = 0: 30.4 |
| RAND on S2 (2000 generic) | as S2 without N1 | pole points 41 / 15, mean 1.19, sd 1.96, range -2.9 to 5.6 (no slope above 6: the near-integer resonance of S2 is absent); generic sd 2.17 |
| RAND on S3, S4 (2000 generic) | as S3, S4 without N1 | pole points 29 / 27 and 32 / 24, ranges -9.3 to 8.7 and -15.3 to 15.5; generic sd 4.95, 8.40 |
| MINUS on S1 (alpha_p = -p^(1/2), added row) | t = 0: slope -2 log 2 = -1.386 | t = 0: -1.3888 (y = -40.17 at j = 40); pole points 20 / 36, mean -0.10; generic sd 0.273 |

Every control behaves as registered. DEL and THIN on these sparse sets have a relative product that converges
absolutely on the line (beta = 0, y bounded); this separates "product convergent on the line" from "local
parameter of modulus p^(1/2) on infinitely many primes" (y unbounded in both directions). The RAND rows
show that the S1 behaviour depends on the counting function only, and that the large slopes of S2, S3
depend on the arithmetic of the exponents.

## 6. Verdict

partial-result.
- PROVED: no twin G = zeta/R_S exists with alpha_p = +p^(1/2) on an infinite S (Lemma P0); for lacunary ratio
  > 2 the critical line is a natural boundary of R_S (Lemma P1). This settles the existence question of
  c20 regime (K) for the exact family the assignment names. It does not close regime (K): phases
  alpha_p = p^(1/2) e^(i phi_p), abs(alpha_p) < p^(1/2), and non-geometric n_p are untouched.
- MEASURED (ball arithmetic, tail enclosed to 2.7e-35): S1 has beta > 0 at all 57 pole points; S2 does not
  (8 certified negative of 56); at generic t and at zeta zero ordinates beta is centred at 0 and y spreads
  like a sum of N_S(1/delta) independent phases. A bounded radial limit was found at no tested point of any
  non-control row.
- The natural-boundary lemma of `c21-br2-sparse-pole-lattice-natural-boundary-or-twin` is supported in the
  form "dense set of radial zeros of R_S" for S0 (proved) and S1 (measured); for S2, S3, S4 a proof through
  pole points alone would fail at the non-resonant ones (mixed signs), and an argument has to use the
  size of y (unbounded in either direction), not its sign.

## 7. Requirement flags

- R1 (all primes, multiplicativity essential): NOT established. The object is a deformation of zeta at a
  sparse set of primes; P0 uses the local factor shape at infinitely many primes and positivity on the real
  axis. Nothing about zeta is derived.
- R2 (height-uniform, every window): NOT established. P0 is a statement at s = 1/2; P1 is at a dense set of
  heights for one class of sets.
- R3 (every control fails at a named step): NOT established as a property of an attack; the lane is a
  census. The control rows of section 5 behaved as registered.
- R4 (reaches the critical line): NOT established for zeta. The lane describes how a relative product that
  converges only in the open half-plane behaves at the line (it does not continue).

## 8. Three weakest steps

1. Scope of P0. It excludes one sign pattern (alpha_p = +p^(1/2)). With phases there is no common pole point
   and the proof has no input; the measured generic behaviour (y not convergent) suggests non-continuability
   but is not a proof. Regime (K) remains OPEN in general.
2. Inputs to the enclosures that were not certified here: the interval log q in f(k) +- 0.08/f(k)^2 for
   f(k) > 1500 rests on Dusart's 2010 short-interval bound as recalled (not opened); primes above 400 bits
   are BPSW probable primes; the zero ordinates are mpmath values with an assumed radius 1e-25. P0 and P1 do
   not depend on any of these.
3. beta is a finite-range slope (j <= 40, 30, 24). At resonant points it is not an exponent, and for S3, S4
   the range is the feasibility limit. The proofs of P0 and P1 and the reading of N1 have had no independent
   referee; REFEREE.md is a second-implementation rerun of three numerical cells by the same author, not an
   adversarial pass on the proofs.

## 9. Follow-up (one item)

Necessary condition for any twin in regime (K): at every t, log abs(zeta/G)(1/2 + delta + it) =
n_t log(delta) + c_t + o(1) with n_t an integer. For alpha_p = p^(1/2) e^(i phi_p) on a sparse S, decide
whether a height t exists where this fails provably (a nested-interval choice of t resonant with a
subsequence of S, against the loss 2^(-N_S(1/delta)) from the other primes; for S1 the loss exponent is
1.386, so the subsequence must gain more than that). The census code evaluates exactly this quantity.
