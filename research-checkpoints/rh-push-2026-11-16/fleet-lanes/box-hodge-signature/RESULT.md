# box-hodge-signature: certified signature of the Weil form in intersection coordinates, zeta and controls

Date: 2026-11-17. Compute arm of the Hodge-index line (theory lane: `push/ap-hodge-index/RESULT.md`, refereed there).
Internal work, not refereed. RH is open. Nothing here gives information about any zero of zeta beyond low verified height.

Labels: PROVED / CLASSICAL / CERTIFIED (ball arithmetic with proved radii, inertia by the certificate of section 2.3) /
MEASURED (computed, error estimated but not enclosed) / ARGUED / OPEN.

## Verdict

**Finite-order statement; it is verified height in another form. No structural reason for the signature was found.**

1. Calibration (CERTIFIED, exact integers): for eight curves of genus 1 and 2 over F_5, F_7, F_11, F_13 the intersection
   form on H, V and the Frobenius graphs G_0..G_30 has exactly one positive eigenvalue and rank at most 2g+2. Five
   polynomials with the functional equation and roots off the circle give two positive eigenvalues, first seen at G_1
   (four cases) or G_3 (one case).
2. Zeta (CERTIFIED): the form on H, V and n Gaussian classes has inertia exactly (1, n+1) in every completed run:
   uniform families up to n = 4000 classes and cutoffs up to X = e^c = 1.3e+09, prime-power families up to all
   prime powers below 10^4 (1281 classes). Largest height that can influence any certified sign: about 2900
   (section 3.1), against verified height 3e12.
3. Controls (CERTIFIED, except backward heat which is MEASURED): every control acquires extra positive eigenvalues at a
   finite size, and the size is set by where the control differs from zeta, not by the dimension:
   - sign twist or deletion at a prime p: at cutoff c* = log p - delta, delta = 0.00 to 0.35 at h = 0.03
     (p from 2 to 100003);
   - zeta(s+a)zeta(s-a): at c* between 0.75 (a = 0.4) and 1.38 (a = 0.001) at h = 0.03;
   - Davenport-Heilbronn: at c* = 3.53 to 3.57 (X* about 35) on every grid with r = 0.75 that resolves height 85.7,
     at dimension n* = c*/h + 1 (120 at h = 0.03, 1427 at h = 0.0025); smallest dimension found on any grid:
     68 (h = 0.075, r = 0.4, c* = 5.02); Pick: order 149;
   - backward heat H_t: no failure up to cutoff 12.6 for t >= -0.1; first failure at c* = 11.8 (t = -0.15), 9.4 (-0.2),
     4.6 (-0.3), 4.1 (-0.5), 2.8 (-1), 1.4 (-2), 0.9 (-4).
4. Lorentzian test: the generating polynomial of a symmetric form is quadratic, and for degree 2 the Brändén-Huh
   definition is "non-negative coefficients, M-convex support, at most one positive eigenvalue". Checked with certified
   signs for 48 cases: zeta is Lorentzian as given at h = 0.1 and after a shift by 0.1(H+V) in the other bases; no
   control is, except at sizes below its first failure. The polynomial test contains no information beyond the inertia.
5. More than verified height? No. Each certified table is a finite set of strict inequalities in finitely many
   Gaussian-weighted zero sums; it is implied by RH up to height about 2900 and would be unchanged by any off-line
   zero above that height (estimate, section 8 item 2). The first-failure law for the controls is a bandwidth count (degrees of freedom of the test
   space against the number of zeros in front of the first off-line one), the same mechanism as the Pick horizon.
   The box was used for scale and for the controls, not for a new kind of statement.

## 1. What is new relative to the map and the sibling lane

Read before starting: `push/BRIEF.md` (all notices), `push/OBSTRUCTION_MAP.md` (controls; rows P1-P13, T1-T3, S1),
`eq48/RESULT.md`, `push/ap-hodge-index/` (code, then RESULT.md and REFEREE.md when they appeared), `ff-transplant/RESULT.md`.

| Existing item | What it has | What this lane adds |
|---|---|---|
| `ap-hodge-index` sections 2-4 | the form `I = Prime - A = P - Z`; Theorem 1 (i_+ <= 1 on every finite space iff RH); signature tables to dimension 200, window c <= 6, entry errors estimated | same form (definition taken from that lane; fibre classes made explicit, section 2.1); every entry enclosed with a proved radius; inertia by a certificate that does not depend on the elimination order; dimension up to 4000, window up to c = 21.0; prime-power class families; backward heat run; denser control sweeps |
| Row P5 (Pick order 149 for DH) | confluent real nodes | first-failure dimension as a function of grid spacing and width; it is not an invariant (section 3.2) |
| Row T3 (no object counted by Q_L) | argued | not addressed; the calibration shows the pipeline returns the Hodge index where it is a theorem |
| Rows P3, S1 (finite certificates restate verified height) | proved for Pick | the same conclusion for this form, with the height horizon of each table computed |

Controls run: DH, sign twists TW- and TW+ at single primes, Liouville twist (every prime), three pseudo-random
completely multiplicative sign twists, prime deletion, E_a for ten values of a, backward heat for thirteen values of t.
Not run: T-NR twin and Beurling primes (the sibling lane ran T-NR; Beurling needs a non-integer prime system).

## 2. Definitions and method

### 2.1 The form (definition of `ap-hodge-index`, with explicit fibre classes)

Classes: D_j for the Gaussian f_j(x) = exp(-(x - x_j)^2/(2 s^2)), all of one width s; one pair of fibre classes
(H, V) for each pole pair. With v = 2 s^2, c0 = 2 pi s^2, amp = s sqrt(pi), d = x_j - x_k:

    <D_j, D_k> = I(d) = Prime(d) - A(d),
    Prime(d) = amp * sum_n Lambda(n) n^{-1/2} [ e^{-(log n - d)^2/(2v)} + e^{-(log n + d)^2/(2v)} ],
    A(d)     = (1/2pi) int c0 e^{-v t^2/2} cos(t d) [Re psi(1/4 + i t/2) - log pi] dt,
    <H, D_j> = sqrt(c0) e^{v/16} e^{x_j/2},   <V, D_j> = sqrt(c0) e^{v/16} e^{-x_j/2},   <H,V> = 1,   <H,H> = <V,V> = 0.

H and V are the functionals f -> int f e^{x/2}, f -> int f e^{-x/2} (the two pole terms). The explicit formula gives
`I(d) = P(d) - Z(d)`, `P(d) = c0 e^{v/8} 2 cosh(d/2) = <H,D_j><V,D_k> + <V,D_j><H,D_k>`,
`Z(d) = sum over zeros 1/2 + i t of c0 e^{-v t^2/2} e^{i t d}`.

Elimination of the block {H, V} (determinant -1, inertia (1,1)) leaves the Schur complement `I - P = -Z` on the D_j
(PROVED, two lines of algebra; checked numerically in `lor.out`, where the full Gram matrix including H and V is
certified directly). Hence

    inertia(full form on H, V, D_1..D_n) = (1 + i_-(Z_n), 1 + i_+(Z_n), dim ker Z_n).

"Lorentzian" (exactly one positive eigenvalue; negative definite on the complement of the fibre classes) is `Z_n > 0`,
which is Weil positivity on the span of the f_j. For curves the same elimination turns the intersection matrix of
H, V, G_k into minus the Toeplitz matrix of `sum_j (alpha_j/sqrt q)^m` (section 4).

Controls in the same coordinates:

| Object | fibre classes | weights w_n in the prime sum | archimedean part |
|---|---|---|---|
| zeta | (H,V), tau = 1/2 | Lambda(n) | psi(1/4 + it/2), -log pi |
| tw-_p, tw+_p, drop p, liouville, rand k | same | eps(p)^k Lambda(p^k) with eps_p = -1, 1/2, 0 at one prime; -1 at all primes; pseudo-random +-1 | same |
| EA_a = zeta(s+a) zeta(s-a) | two pairs, tau = 1/2 +- a | Lambda(n)(n^a + n^-a) | psi(1/4 +- a/2 + it/2), -2 log pi |
| DH | none | Lambda_DH(n), all n, from a(n) log n = sum_{d\|n} Lambda_DH(d) a(n/d) | psi(3/4 + it/2), log(5/pi) |
| HEAT_t | (H,V) not separated; Z_t computed directly | none (no prime side) | none |

Baseline positive index: 1 (zeta, twists), 2 (EA), 0 (DH, and HEAT where Z_t itself is tested).

Two families of nodes:
- uniform: x_j = j h, j = 0..n-1, s = r h (r = 0.75 unless stated). The cutoff is c = (n-1) h, X = e^c. The matrix of
  -Z is symmetric Toeplitz; stage m is the span of the first m classes, so one run gives the inertia at every cutoff.
- prime powers: x = log q for q = 1 and every prime power q = p^k <= X with p <= P, ordered by q; common width s.
  The functional is zeta's full functional (all primes); P and X select the classes.

### 2.2 Enclosure of the entries (PROVED radii)

All arithmetic in Arb balls (python-flint 0.9). Code: `bh.py`.
- Prime sum. Terms with |log n -+ d| > R are dropped, R = sqrt(2 v (D + 40)), D = (digits + 12) ln 10; the dropped
  in-table terms are bounded by `2 e^{-R^2/2v} sum |w_n|` and the terms beyond the table limit e^L by
  `int_L^inf e^{(g+1)u - (u-d)^2/2v} du` with |w_n| <= n^g. g = 0 for zeta and the twists, g = a for EA.
  For DH, g = 2 is proved: |a(n)| <= 1 and a(5k) = 0 give u = sum_{n>=2} |a(n)| n^-2 <= (24/25) zeta(2) - 1 < 0.58, so the
  coefficients b(n) of log f satisfy sum |b(n)| n^-2 <= -log(1-u) < 0.87, and Lambda_DH(n) = b(n) log n.
- Archimedean term. psi(z + it/2) = psi(z + 24 + it/2) - sum_{m<24} 1/(z + m + it/2). The rational terms are closed
  forms, `int e^{-vt^2/2} cos(td)/(a + it/2) dt = pi [e^{2a^2v - 2ad} erfc((2av - d)/sqrt(2v)) + (d -> -d)]`. The
  shifted term is analytic in |Im t| < 2z + 48; trapezoidal rule with the strip bound
  `2 M /(e^{2 pi a'/dt} - 1)`, a' = 2(z+24) - 1, M from |psi(u)| <= log(1 + |u|) + 5 on Re u >= 1/2, and a Gaussian
  truncation bound. Both bounds are evaluated and added to the ball.
- Validation against zero sums (30 digits, first 11 zeros): zeta and EA_0.2 agree to the ball radius (1e-28 to 1e-31);
  zeta I(0) and DH I(0) at h = 0.03 agree with the sibling lane's values (-0.03807, -0.1038).

### 2.3 Certified inertia (CERTIFIED; no float eigenvalues)

`bh.certify`. Given the ball matrix T (n x n, symmetric) and any unit lower triangular X with exact entries, compute
B = X T X^T in ball arithmetic. For every symmetric T' in the ball, T'_m and B'_m have the same inertia for every
leading block m (Sylvester; X is unit triangular). If the diagonal balls d_i exclude 0 and, after scaling by
|d_i|^{-1/2}, the absolute off-diagonal row sums of the leading m x m block are < 1, then Gershgorin discs exclude 0
and a homotopy gives inertia(B'_m) = signs(d_1..d_m). X is the midpoint Levinson recursion (Toeplitz) or the inverse
of the midpoint LDL factor (general); X only needs to be approximately right. The certificate fails safe: a stage
that is not covered is reported as not determined, and precision is raised (x1.6) until all stages are covered.
Plain interval elimination (as in the sibling lane) loses about 4.7 digits per stage on these matrices by the wrapping
effect; the certificate has no such loss. Cross-check: at n = 134 direct ball LDL, ball Levinson and the certificate
give the same signs.

Two defects were found and fixed during the night; both are recorded because the first produced a wrong "certified"
line before the fix.
1. Prime-power runner: entries were passed between processes as rounded decimal strings without adding the rounding
   to the radius. One run then reported three positive eigenvalues for zeta at 60 digits (P = X = 1000, s = 0.05,
   pivots near 1e-64). After the fix the same run reports "not determined" at 60 digits and inertia (1,195) at 96.
   All prime-power results below are from the fixed code (directory `out_pp2`); the earlier directory is discarded.
2. Powers of e^{i t h} by repeated complex multiplication lose about 0.1 digit per step (rectangular complex balls).
   Radii were honest but large; the n = 3000 runs could not finish. Fixed by restarting from exp every 8 steps.

Float64/GPU pre-pass: not used. The exact stage at the sizes of interest costs seconds to minutes, and where it does
not (pivots below 1e-16) float64 cannot screen. No GPU job was launched.

Backward heat (MEASURED): `heat.py`. H_t has no prime side. Z_t(d) is computed as
`(c0/pi) Re int L_t(c + iy) e^{v(c+iy)^2/2} cosh((c+iy)d) dy`, L_t = F_t'/F_t, F_t(z) = int e^{t u^2} Phi(u) cosh(2zu) du
(de Bruijn-Newman normalisation, F_0 = xi(1/2+z)/8), valid when the zeros that matter lie in |Re z| < c. Quadrature
errors are not enclosed. Two contours (c and c+1) are compared and 100 times their difference plus 10^-digits is
used as the entry radius; at t = 0 the table agrees with the certified prime side to 1.6e-40 (30-digit run, n = 300) and
1.1e-55 (45-digit run, n = 420, re-run after the fix of item 2 above). Given the radius the inertia certificate is exact.

## 3. Signature tables

Reading of the columns. "certified a/b": the certificate of section 2.3 covers the first a of b stages. "inertia of
full form (+,-)": for the form on the fibre classes and the classes D_1..D_a. "min log10 abs pivot": smallest
certified |d_i|. "digits": decimal working precision of the run that completed. Stage m of a uniform run is the cutoff
c = (m-1)h, so every row certifies all smaller cutoffs on the same grid as well.

### 3.1 Zeta, uniform family (CERTIFIED)

| h | r | n | cutoff c=(n-1)h | X=e^c | Nyquist pi/h | digits | certified stages | inertia of full form (+,-) | min log10 abs pivot | max entry radius | height horizon T | table s | certificate s | peak RSS MB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.02 | 0.3 | 750 | 14.98 | 3.2e+06 | 157 | 200 | 750/750 | (1,751) | -7.6 | 6.6e-221 | 912 | 42.7 | 26.3 | 840 |
| 0.02 | 0.5 | 750 | 14.98 | 3.2e+06 | 157 | 200 | 750/750 | (1,751) | -19.1 | 8.9e-221 | 751 | 50.8 | 34.2 | 840 |
| 0.01 | 0.5 | 1000 | 9.99 | 2.18e+04 | 314 | 160 | 1000/1000 | (1,1001) | -8.3 | 6.3e-41 | 1078 | 13.5 | 50.5 | 1375 |
| 0.1 | 0.75 | 80 | 7.90 | 2.7e+03 | 31 | 150 | 80/80 | (1,81) | -33.2 | 6.7e-168 | 123 | 0.3 | 0.0 | 34 |
| 0.1 | 0.75 | 130 | 12.90 | 4e+05 | 31 | 300 | 130/130 | (1,131) | -73.0 | 1.1e-322 | 179 | 85.4 | 0.8 | 62 |
| 0.05 | 0.75 | 240 | 11.95 | 1.55e+05 | 63 | 200 | 240/240 | (1,241) | -48.6 | 2.6e-194 | 296 | 4.9 | 0.9 | 110 |
| 0.05 | 0.75 | 360 | 17.95 | 6.25e+07 | 63 | 220 | 360/360 | (1,361) | -75.5 | 1.8e-241 | 365 | 780.9 | 3.7 | 225 |
| 0.03 | 0.75 | 500 | 14.97 | 3.17e+06 | 105 | 200 | 500/500 | (1,501) | -49.5 | 1.4e-155 | 500 | 68.6 | 7.1 | 418 |
| 0.03 | 0.75 | 692 | 20.73 | 1.01e+09 | 105 | 130 | 692/692 | (1,693) | -74.0 | 3.4e-151 | 606 | 1492.9 | 19.8 | 561 |
| 0.02 | 0.75 | 750 | 14.98 | 3.2e+06 | 157 | 200 | 750/750 | (1,751) | -43.2 | 3.9e-118 | 706 | 75.4 | 37.5 | 818 |
| 0.02 | 0.75 | 900 | 17.98 | 6.44e+07 | 157 | 120 | 900/900 | (1,901) | -52.0 | 1.1e-142 | 771 | 362.4 | 43.5 | 907 |
| 0.02 | 0.75 | 1050 | 20.98 | 1.29e+09 | 157 | 130 | 1050/1050 | (1,1051) | -72.8 | 1.9e-151 | 902 | 898.6 | 40.6 | 1255 |
| 0.01 | 0.75 | 1500 | 14.99 | 3.24e+06 | 314 | 240 | 1500/1500 | (1,1501) | -30.6 | 9.4e-46 | 1214 | 126.5 | 415.1 | 3708 |
| 0.01 | 0.75 | 1800 | 17.99 | 6.5e+07 | 314 | 120 | 1800/1800 | (1,1801) | -48.0 | 3.2e-143 | 1488 | 370.3 | 267.6 | 3544 |
| 0.01 | 0.75 | 2100 | 20.99 | 1.31e+09 | 314 | 130 | 2100/2100 | (1,2101) | -51.8 | 6.2e-152 | 1548 | 1402.8 | 313.3 | 4803 |
| 0.005 | 0.75 | 3000 | 15.00 | 3.25e+06 | 628 | 190 | 3000/3000 | (1,3001) | -29.6 | 5.7e-212 | 2396 | 165.5 | 832.6 | 7236 |
| 0.005 | 0.75 | 3600 | 18.00 | 6.53e+07 | 628 | 140 | 3600/3600 | (1,3601) | -31.2 | 1.1e-163 | 2471 | 469.9 | 808.6 | 8476 |
| 0.0025 | 0.75 | 3000 | 7.50 | 1.8e+03 | 1257 | 160 | 3000/3000 | (1,3001) | -7.0 | 1.1e-184 | 2660 | 135.1 | 941.8 | 7859 |
| 0.0025 | 0.75 | 4000 | 10.00 | 2.2e+04 | 1257 | 100 | 4000/4000 | (1,4001) | -8.6 | 1.0e-126 | 2915 | 63.9 | 844.6 | 9578 |
| 0.02 | 1.0 | 750 | 14.98 | 3.2e+06 | 157 | 200 | 750/750 | (1,751) | -76.8 | 2.4e-221 | 688 | 89.5 | 29.4 | 839 |
| 0.01 | 1.0 | 1000 | 9.99 | 2.18e+04 | 314 | 240 | 1000/1000 | (1,1001) | -28.2 | 7.6e-121 | 866 | 15.6 | 101.8 | 1745 |
| 0.02 | 1.5 | 750 | 14.98 | 3.2e+06 | 157 | 200 | 750/750 | (1,751) | -170.5 | 2.3e-222 | 671 | 161.4 | 36.5 | 852 |

Every completed zeta run has inertia exactly (1, n+1): one positive eigenvalue, negative definite on the complement
of the fibre classes, no kernel. The run with X = e^20.73 = 1.0e9 used 120,896,183 primes (prime sum split into 125
segments on 6 workers, 1493 s). "height horizon T" = sqrt(2(ln(1/pivot_min) + c/2 + 5)/v): a zero above T changes every
entry by less than the smallest certified pivot times e^-5 (estimate, see section 8 item 2).

Runs with r other than 0.75 show the dependence of the conditioning on the width: at h = 0.02, n = 750 the smallest
pivot is 1e-7.6 (r = 0.3), 1e-19 (0.5), 1e-43 (0.75), 1e-77 (1.0), 1e-170 (1.5); the inertia is the same.

### 3.2 Davenport-Heilbronn, uniform family (CERTIFIED)

Rows marked "g=2 (proved)" use the proved tail bound of section 2.2; rows marked "g=1 (hypothesis)" were computed
earlier with the tail exponent 1 assumed (the entry radii are then conditional on |Lambda_DH(n)| <= n^1.5 beyond the
table); where both exist the stages agree.

| h | r | n | cutoff | Nyquist | certified | first stage n* with a positive eigenvalue | cutoff c* = (n*-1)h | X* = e^c* | positive eigenvalues at stages | i_+ at full size | min log10 abs pivot | digits | tail bound |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.03 | 0.3 | 250 | 7.47 | 105 | 250/250 | 182 | 5.43 | 228.1 | [182, 184, 222, 226, 250] | 5 | -3.2 | 100 | g=2 (proved) |
| 0.02 | 0.3 | 300 | 5.98 | 157 | 300/300 | 210 | 4.18 | 65.4 | [210, 211] | 2 | -2.5 | 100 | g=2 (proved) |
| 0.15 | 0.5 | 60 | 8.85 | 21 | 60/60 | none | - | - | [] | 0 | -12.5 | 100 | g=1 (hypothesis) |
| 0.12 | 0.5 | 75 | 8.88 | 26 | 75/75 | none | - | - | [] | 0 | -9.4 | 100 | g=1 (hypothesis) |
| 0.1 | 0.5 | 90 | 8.90 | 31 | 90/90 | 89 | 8.80 | 6634.2 | [89, 90] | 2 | -8.4 | 100 | g=1 (hypothesis) |
| 0.08 | 0.5 | 112 | 8.88 | 39 | 112/112 | 83 | 6.56 | 706.3 | [83, 84] | 2 | -7.5 | 100 | g=1 (hypothesis) |
| 0.07 | 0.5 | 130 | 9.03 | 45 | 130/130 | 77 | 5.32 | 204.4 | [77, 80] | 2 | -6.9 | 100 | g=1 (hypothesis) |
| 0.06 | 0.5 | 150 | 8.94 | 52 | 150/150 | 78 | 4.62 | 101.5 | [78, 80, 137, 140] | 4 | -7.3 | 100 | g=1 (hypothesis) |
| 0.03 | 0.5 | 250 | 7.47 | 105 | 250/250 | 130 | 3.87 | 47.9 | [130, 133, 224, 229, 239, 241] | 6 | -4.5 | 100 | g=2 (proved) |
| 0.02 | 0.5 | 300 | 5.98 | 157 | 300/300 | 184 | 3.66 | 38.9 | [184, 185, 237, 239] | 4 | -4.5 | 100 | g=2 (proved) |
| 0.2 | 0.75 | 45 | 8.80 | 16 | 45/45 | none | - | - | [] | 0 | -29.6 | 100 | g=1 (hypothesis) |
| 0.15 | 0.75 | 60 | 8.85 | 21 | 60/60 | none | - | - | [] | 0 | -25.5 | 100 | g=1 (hypothesis) |
| 0.13 | 0.75 | 70 | 8.97 | 24 | 70/70 | none | - | - | [] | 0 | -21.2 | 100 | g=1 (hypothesis) |
| 0.12 | 0.75 | 75 | 8.88 | 26 | 75/75 | none | - | - | [] | 0 | -18.8 | 100 | g=1 (hypothesis) |
| 0.11 | 0.75 | 82 | 8.91 | 29 | 82/82 | none | - | - | [] | 0 | -18.8 | 100 | g=1 (hypothesis) |
| 0.1 | 0.75 | 80 | 7.90 | 31 | 80/80 | none | - | - | [] | 0 | -15.3 | 100 | g=2 (proved) |
| 0.1 | 0.75 | 110 | 10.90 | 31 | 110/110 | 89 | 8.80 | 6634.2 | [89, 90] | 2 | -28.9 | 100 | g=1 (hypothesis) |
| 0.095 | 0.75 | 95 | 8.93 | 33 | 95/95 | none | - | - | [] | 0 | -17.4 | 100 | g=1 (hypothesis) |
| 0.09 | 0.75 | 100 | 8.91 | 35 | 100/100 | 91 | 8.10 | 3294.5 | [91, 92] | 2 | -16.2 | 100 | g=1 (hypothesis) |
| 0.085 | 0.75 | 106 | 8.93 | 37 | 106/106 | 84 | 7.06 | 1158.6 | [84, 85] | 2 | -15.8 | 100 | g=1 (hypothesis) |
| 0.08 | 0.75 | 150 | 11.92 | 39 | 150/150 | 84 | 6.64 | 765.1 | [84, 85, 131, 132] | 4 | -29.0 | 100 | g=2 (proved) |
| 0.075 | 0.75 | 120 | 8.92 | 42 | 120/120 | 75 | 5.55 | 257.2 | [75, 84] | 2 | -15.4 | 100 | g=1 (hypothesis) |
| 0.07 | 0.75 | 170 | 11.83 | 45 | 170/170 | 76 | 5.25 | 190.6 | [76, 81, 136, 137] | 4 | -28.6 | 100 | g=2 (proved) |
| 0.065 | 0.75 | 140 | 9.04 | 48 | 140/140 | 75 | 4.81 | 122.7 | [75, 77] | 2 | -15.0 | 100 | g=1 (hypothesis) |
| 0.06 | 0.75 | 200 | 11.94 | 52 | 200/200 | 79 | 4.68 | 107.8 | [79, 81, 135, 138] | 4 | -28.8 | 100 | g=2 (proved) |
| 0.055 | 0.75 | 165 | 9.02 | 57 | 165/165 | 96 | 5.22 | 185.9 | [96, 110, 111, 133] | 4 | -15.2 | 100 | g=1 (hypothesis) |
| 0.05 | 0.75 | 240 | 11.95 | 63 | 240/240 | 107 | 5.30 | 200.3 | [107, 108, 118, 120, 209, 212, 232, 233] | 8 | -26.0 | 100 | g=2 (proved) |
| 0.045 | 0.75 | 250 | 11.21 | 70 | 250/250 | 146 | 6.52 | 682.0 | [146, 148, 150, 152, 247, 248, 250] | 7 | -17.0 | 100 | g=2 (proved) |
| 0.04 | 0.75 | 250 | 9.96 | 79 | 250/250 | 122 | 4.84 | 126.5 | [122, 126, 157, 159, 227, 230] | 6 | -15.5 | 100 | g=2 (proved) |
| 0.035 | 0.75 | 280 | 9.77 | 90 | 280/280 | 109 | 3.78 | 43.8 | [109, 123, 156, 170, 202, 205, 206, 207] | 8 | -15.0 | 100 | g=2 (proved) |
| 0.03 | 0.75 | 434 | 12.99 | 105 | 434/434 | 120 | 3.57 | 35.5 | [120, 123, 222, 227, 240, 241, 260, 261]... | 10 | -20.3 | 100 | g=2 (proved) |
| 0.025 | 0.75 | 320 | 7.98 | 126 | 320/320 | 142 | 3.53 | 34.0 | [142, 144, 192, 198, 212, 214, 305, 307] | 8 | -7.2 | 100 | g=2 (proved) |
| 0.02 | 0.75 | 500 | 9.98 | 157 | 500/500 | 178 | 3.54 | 34.5 | [178, 179, 206, 207, 347, 349, 366, 372]... | 12 | -14.9 | 100 | g=2 (proved) |
| 0.015 | 0.75 | 500 | 7.48 | 209 | 500/500 | 237 | 3.54 | 34.5 | [237, 239, 273, 274, 293, 295, 313, 315]... | 17 | -8.8 | 100 | g=2 (proved) |
| 0.01 | 0.75 | 800 | 7.99 | 314 | 800/800 | 357 | 3.56 | 35.2 | [357, 358, 409, 410, 428, 429, 438, 439]... | 18 | -7.2 | 100 | g=2 (proved) |
| 0.005 | 0.75 | 1400 | 7.00 | 628 | 1400/1400 | 713 | 3.56 | 35.2 | [713, 715, 819, 822, 849, 851, 875, 876]... | 28 | -7.2 | 100 | g=2 (proved) |
| 0.0025 | 0.75 | 1800 | 4.50 | 1257 | 1800/1800 | 1427 | 3.56 | 35.3 | [1427, 1432, 1640, 1644, 1700, 1702, 1750, 1754]... | 10 | -4.1 | 100 | g=2 (proved) |
| 0.15 | 1.0 | 60 | 8.85 | 21 | 60/60 | none | - | - | [] | 0 | -41.8 | 100 | g=1 (hypothesis) |
| 0.12 | 1.0 | 75 | 8.88 | 26 | 75/75 | none | - | - | [] | 0 | -33.9 | 100 | g=1 (hypothesis) |
| 0.1 | 1.0 | 90 | 8.90 | 31 | 90/90 | 88 | 8.70 | 6002.9 | [88, 89] | 2 | -31.6 | 100 | g=1 (hypothesis) |
| 0.08 | 1.0 | 112 | 8.88 | 39 | 112/112 | 84 | 6.64 | 765.1 | [84, 86] | 2 | -28.5 | 100 | g=1 (hypothesis) |
| 0.07 | 1.0 | 130 | 9.03 | 45 | 130/130 | 82 | 5.67 | 290.0 | [82, 86] | 2 | -27.6 | 100 | g=1 (hypothesis) |
| 0.06 | 1.0 | 150 | 8.94 | 52 | 150/150 | 80 | 4.74 | 114.4 | [80, 82, 133, 135] | 4 | -27.2 | 100 | g=1 (hypothesis) |
| 0.03 | 1.0 | 250 | 7.47 | 105 | 250/250 | 116 | 3.45 | 31.5 | [116, 117, 216, 222, 239, 241] | 6 | -11.6 | 100 | g=2 (proved) |
| 0.02 | 1.0 | 300 | 5.98 | 157 | 300/300 | 174 | 3.46 | 31.8 | [174, 176, 198, 199] | 4 | -10.0 | 100 | g=2 (proved) |
| 0.03 | 1.5 | 250 | 7.47 | 105 | 250/250 | 108 | 3.21 | 24.8 | [108, 109, 203, 207, 242, 244] | 6 | -23.8 | 100 | g=2 (proved) |
| 0.02 | 1.5 | 300 | 5.98 | 157 | 300/300 | 165 | 3.28 | 26.6 | [165, 166, 183, 185] | 4 | -22.1 | 100 | g=2 (proved) |

Positive eigenvalues arrive in pairs of stages (120 and 123; 222 and 227; ...): each off-line quartet contributes
two negative directions to Z (sibling lane, zero-side attribution: removing the quartet at height 85.70 removes the
first pair).

For r = 0.75 and pi/h > 85.7 the first failure is at c* = 3.53 to 3.57, X* = e^c* about 35, at every spacing from
0.03 to 0.0025, while the dimension n* runs from 120 to 1427. The window length depends on the width: c* = 3.21 to
3.28 (r = 1.5), 3.45 (r = 1.0), 3.66 to 3.87 (r = 0.5), 4.18 to 5.43 (r = 0.3).

Grid scan, 33 spacings x 7 width ratios (CERTIFIED; cutoff up to 9; proved tail bound). Cells "n/a" were not run (the
dense weight table exceeded the cap, section 7).

| h | Nyquist | n run | r=0.4 | r=0.5 | r=0.6 | r=0.75 | r=0.9 | r=1.0 | r=1.25 |
|---|---|---|---|---|---|---|---|---|---|
| 0.04 | 79 | 200 | 121 (4.80) | 123 (4.88) | 124 (4.92) | 122 (4.84) | 119 (4.72) | 117 (4.64) | 111 (4.40) |
| 0.045 | 70 | 200 | 137 (6.12) | 145 (6.48) | 146 (6.52) | 146 (6.52) | 146 (6.52) | 144 (6.43) | 141 (6.30) |
| 0.05 | 63 | 181 | 108 (5.35) | 107 (5.30) | 107 (5.30) | 107 (5.30) | 106 (5.25) | 106 (5.25) | 104 (5.15) |
| 0.055 | 57 | 164 | 94 (5.12) | 93 (5.06) | 93 (5.06) | 96 (5.22) | 99 (5.39) | 103 (5.61) | 109 (5.94) |
| 0.06 | 52 | 151 | 78 (4.62) | 78 (4.62) | 79 (4.68) | 79 (4.68) | 79 (4.68) | 80 (4.74) | 81 (4.80) |
| 0.065 | 48 | 139 | 77 (4.94) | 75 (4.81) | 75 (4.81) | 75 (4.81) | 77 (4.94) | 79 (5.07) | 82 (5.27) |
| 0.07 | 45 | 129 | 76 (5.25) | 77 (5.32) | 74 (5.11) | 76 (5.25) | 80 (5.53) | 82 (5.67) | 86 (5.95) |
| 0.075 | 42 | 121 | 68 (5.02) | 69 (5.10) | 71 (5.25) | 75 (5.55) | 79 (5.85) | 85 (6.30) | 87 (6.45) |
| 0.08 | 39 | 113 | 80 (6.32) | 83 (6.56) | 83 (6.56) | 84 (6.64) | 84 (6.64) | 84 (6.64) | 85 (6.72) |
| 0.085 | 37 | 106 | 84 (7.06) | 83 (6.97) | 83 (6.97) | 84 (7.06) | 83 (6.97) | 83 (6.97) | 83 (6.97) |
| 0.09 | 35 | 101 | 94 (8.37) | 94 (8.37) | 93 (8.28) | 91 (8.10) | 89 (7.92) | 87 (7.74) | 87 (7.74) |
| 0.095 | 33 | 95 | 95 (8.93) | 94 (8.84) | 95 (8.93) | - | - | 95 (8.93) | 93 (8.74) |
| 0.1 | 31 | 91 | 88 (8.70) | 89 (8.80) | 88 (8.70) | 89 (8.80) | 89 (8.80) | 88 (8.70) | 89 (8.80) |
| 0.105 | 30 | 86 | 69 (7.14) | 69 (7.14) | 71 (7.35) | 74 (7.67) | 77 (7.98) | 79 (8.19) | 83 (8.61) |
| 0.11 | 29 | 82 | 80 (8.69) | 80 (8.69) | 82 (8.91) | - | - | - | - |
| 0.115 | 27 | 79 | - | - | - | - | - | - | - |
| 0.12 | 26 | 76 | - | - | - | - | - | - | - |
| 0.125 | 25 | 73 | 73 (9.00) | 72 (8.88) | - | - | - | - | - |
| 0.13 | 24 | 70 | - | - | - | - | - | - | - |
| 0.135 | 23 | 67 | - | - | - | - | - | - | - |
| 0.14 | 22 | 65 | - | - | - | - | - | - | - |
| 0.145 | 22 | 63 | - | - | - | - | - | - | - |
| 0.15 | 21 | 61 | - | - | - | - | - | - | n/a |
| 0.155 | 20 | 59 | - | - | - | - | - | - | n/a |
| 0.16 | 20 | 57 | - | - | - | - | - | - | n/a |
| 0.165 | 19 | 55 | - | - | - | - | - | - | n/a |
| 0.17 | 18 | 53 | - | - | - | - | - | - | n/a |
| 0.175 | 18 | 52 | - | - | - | - | - | - | n/a |
| 0.18 | 17 | 51 | - | - | - | - | - | - | n/a |
| 0.185 | 17 | 49 | - | - | - | - | - | - | n/a |
| 0.19 | 17 | 48 | - | - | - | - | - | - | n/a |
| 0.195 | 16 | 47 | - | - | - | - | - | - | n/a |
| 0.2 | 16 | 46 | - | - | - | - | - | - | n/a |

Smallest first-failure dimension in the scan: n* = 68 at h = 0.075, r = 0.4, cutoff c* = 5.02.

Comparison with Pick order 149 (row P5): on grids that resolve height 85.7 the dimension at first failure is
c*/h + 1 and can be made as large as wanted (1427 at h = 0.0025). On coarser grids the off-line pair is seen through
aliasing at smaller dimension and longer window; the smallest dimension in the scan is the value printed above.
For h >= 0.13 no failure occurs within cutoff 9 for any width.

### 3.3 Other controls, uniform family (CERTIFIED)

"first failing stage" = first stage with more positive eigenvalues than the pole count (1 for the twists, 2 for EA).

h = 0.1, r = 0.75, n = 80 (cutoff 7.90)

| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |
|---|---|---|---|---|---|---|
| EA_0.2 | 80/80 | 7 | 0.60 | 1.8 | 40 | -15.4 |
| EA_0.05 | 80/80 | 8 | 0.70 | 2.0 | 36 | -17.4 |
| EA_0.01 | 80/80 | 10 | 0.90 | 2.5 | 36 | -17.4 |
| tw-_2 | 80/80 | 6 | 0.50 | 1.6 | 32 | -3.6 |
| tw-_101 | 80/80 | 39 | 3.80 | 44.7 | 33 | -14.3 |
| tw-_1009 | 80/80 | 59 | 5.80 | 330.3 | 14 | -27.9 |
| tw+_2 | 80/80 | 6 | 0.50 | 1.6 | 56 | -2.8 |
| drop2 | 80/80 | 6 | 0.50 | 1.6 | 49 | -4.0 |
| liouville | 80/80 | 6 | 0.50 | 1.6 | 34 | -3.2 |
| rand1 | 80/80 | 9 | 0.80 | 2.2 | 40 | -3.7 |

h = 0.1, r = 0.75, n = 120 (cutoff 11.90)

| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |
|---|---|---|---|---|---|---|
| EA_0.4 | 120/120 | 7 | 0.60 | 1.8 | 61 | -27.1 |
| EA_0.3 | 120/120 | 7 | 0.60 | 1.8 | 61 | -27.4 |
| EA_0.2 | 120/120 | 7 | 0.60 | 1.8 | 60 | -29.0 |
| EA_0.1 | 120/120 | 8 | 0.70 | 2.0 | 58 | -28.6 |
| EA_0.05 | 120/120 | 8 | 0.70 | 2.0 | 58 | -29.2 |
| EA_0.02 | 120/120 | 9 | 0.80 | 2.2 | 56 | -29.7 |
| EA_0.01 | 120/120 | 10 | 0.90 | 2.5 | 56 | -30.8 |
| EA_0.005 | 120/120 | 14 | 1.30 | 3.7 | 56 | -30.7 |
| EA_0.002 | 120/120 | 29 | 2.80 | 16.4 | 52 | -30.8 |
| EA_0.001 | 120/120 | 29 | 2.80 | 16.4 | 51 | -31.4 |
| tw-_2 | 120/120 | 6 | 0.50 | 1.6 | 51 | -3.9 |
| tw-_3 | 120/120 | 9 | 0.80 | 2.2 | 54 | -5.6 |
| tw-_5 | 120/120 | 12 | 1.10 | 3.0 | 53 | -6.6 |
| tw-_7 | 120/120 | 16 | 1.50 | 4.5 | 54 | -6.2 |
| tw-_11 | 120/120 | 20 | 1.90 | 6.7 | 49 | -6.1 |
| tw-_13 | 120/120 | 22 | 2.10 | 8.2 | 50 | -6.7 |
| tw-_29 | 120/120 | 30 | 2.90 | 18.2 | 53 | -7.3 |
| tw-_53 | 120/120 | 34 | 3.30 | 27.1 | 46 | -12.2 |
| tw-_101 | 120/120 | 39 | 3.80 | 44.7 | 46 | -14.3 |
| tw-_307 | 120/120 | 49 | 4.80 | 121.5 | 55 | -18.8 |
| tw-_1009 | 120/120 | 59 | 5.80 | 330.3 | 50 | -27.9 |
| tw-_10007 | 120/120 | 81 | 8.00 | 2981.0 | 30 | -33.2 |
| tw-_100003 | 120/120 | 101 | 10.00 | 22026.5 | 12 | -50.5 |
| tw+_2 | 120/120 | 6 | 0.50 | 1.6 | 87 | -4.0 |
| tw+_3 | 120/120 | 9 | 0.80 | 2.2 | 77 | -4.1 |
| tw+_7 | 120/120 | 16 | 1.50 | 4.5 | 72 | -5.9 |
| tw+_101 | 120/120 | 40 | 3.90 | 49.4 | 66 | -14.3 |
| tw+_1009 | 120/120 | 59 | 5.80 | 330.3 | 50 | -27.9 |
| drop2 | 120/120 | 6 | 0.50 | 1.6 | 78 | -4.8 |
| drop3 | 120/120 | 9 | 0.80 | 2.2 | 68 | -3.9 |
| drop7 | 120/120 | 16 | 1.50 | 4.5 | 68 | -5.9 |
| drop101 | 120/120 | 40 | 3.90 | 49.4 | 66 | -14.9 |
| drop1009 | 120/120 | 59 | 5.80 | 330.3 | 50 | -27.9 |
| liouville | 120/120 | 6 | 0.50 | 1.6 | 48 | -3.2 |
| rand1 | 120/120 | 9 | 0.80 | 2.2 | 62 | -3.7 |
| rand2 | 120/120 | 9 | 0.80 | 2.2 | 57 | -3.7 |
| rand3 | 120/120 | 6 | 0.50 | 1.6 | 54 | -2.9 |

h = 0.03, r = 0.75, n = 300 (cutoff 8.97)

| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |
|---|---|---|---|---|---|---|
| EA_0.2 | 300/300 | 28 | 0.81 | 2.2 | 141 | -7.7 |
| EA_0.05 | 300/300 | 32 | 0.93 | 2.5 | 128 | -8.4 |
| EA_0.01 | 300/300 | 36 | 1.05 | 2.9 | 112 | -9.8 |
| tw-_2 | 300/300 | 23 | 0.66 | 1.9 | 107 | -5.6 |
| tw-_101 | 300/300 | 150 | 4.47 | 87.4 | 112 | -6.6 |
| tw-_1009 | 300/300 | 224 | 6.69 | 804.3 | 69 | -15.5 |
| tw+_2 | 300/300 | 24 | 0.69 | 2.0 | 161 | -4.9 |
| drop2 | 300/300 | 24 | 0.69 | 2.0 | 158 | -4.2 |
| liouville | 300/300 | 23 | 0.66 | 1.9 | 90 | -4.3 |
| rand1 | 300/300 | 35 | 1.02 | 2.8 | 115 | -3.1 |

h = 0.03, r = 0.75, n = 450 (cutoff 13.47)

| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |
|---|---|---|---|---|---|---|
| EA_0.4 | 450/450 | 26 | 0.75 | 2.1 | 223 | -16.4 |
| EA_0.3 | 450/450 | 27 | 0.78 | 2.2 | 222 | -15.5 |
| EA_0.2 | 450/450 | 28 | 0.81 | 2.2 | 220 | -16.2 |
| EA_0.1 | 450/450 | 30 | 0.87 | 2.4 | 212 | -17.4 |
| EA_0.05 | 450/450 | 32 | 0.93 | 2.5 | 201 | -18.0 |
| EA_0.02 | 450/450 | 35 | 1.02 | 2.8 | 194 | -18.3 |
| EA_0.01 | 450/450 | 36 | 1.05 | 2.9 | 188 | -18.6 |
| EA_0.005 | 450/450 | 38 | 1.11 | 3.0 | 187 | -18.0 |
| EA_0.002 | 450/450 | 43 | 1.26 | 3.5 | 185 | -18.4 |
| EA_0.001 | 450/450 | 47 | 1.38 | 4.0 | 184 | -18.1 |
| tw-_2 | 450/450 | 23 | 0.66 | 1.9 | 180 | -5.6 |
| tw-_3 | 450/450 | 35 | 1.02 | 2.8 | 178 | -5.2 |
| tw-_5 | 450/450 | 51 | 1.50 | 4.5 | 177 | -5.1 |
| tw-_7 | 450/450 | 62 | 1.83 | 6.2 | 182 | -7.3 |
| tw-_11 | 450/450 | 77 | 2.28 | 9.8 | 182 | -6.6 |
| tw-_13 | 450/450 | 82 | 2.43 | 11.4 | 179 | -6.3 |
| tw-_29 | 450/450 | 109 | 3.24 | 25.5 | 178 | -6.6 |
| tw-_53 | 450/450 | 129 | 3.84 | 46.5 | 174 | -7.5 |
| tw-_101 | 450/450 | 150 | 4.47 | 87.4 | 149 | -7.8 |
| tw-_307 | 450/450 | 185 | 5.52 | 249.6 | 181 | -12.0 |
| tw-_1009 | 450/450 | 224 | 6.69 | 804.3 | 181 | -15.5 |
| tw-_10007 | 450/450 | 297 | 8.88 | 7186.8 | 141 | -26.7 |
| tw-_100003 | 450/450 | 373 | 11.16 | 70263.0 | 67 | -30.1 |
| tw+_2 | 450/450 | 24 | 0.69 | 2.0 | 282 | -4.9 |
| tw+_3 | 450/450 | 36 | 1.05 | 2.9 | 263 | -4.5 |
| tw+_7 | 450/450 | 62 | 1.83 | 6.2 | 243 | -4.9 |
| tw+_101 | 450/450 | 150 | 4.47 | 87.4 | 222 | -6.9 |
| tw+_1009 | 450/450 | 224 | 6.69 | 804.3 | 181 | -15.6 |
| drop2 | 450/450 | 24 | 0.69 | 2.0 | 265 | -4.2 |
| drop3 | 450/450 | 36 | 1.05 | 2.9 | 240 | -3.8 |
| drop7 | 450/450 | 62 | 1.83 | 6.2 | 202 | -4.5 |
| drop101 | 450/450 | 150 | 4.47 | 87.4 | 222 | -6.6 |
| drop1009 | 450/450 | 224 | 6.69 | 804.3 | 181 | -15.5 |
| liouville | 450/450 | 23 | 0.66 | 1.9 | 109 | -4.3 |
| rand1 | 450/450 | 35 | 1.02 | 2.8 | 180 | -3.1 |
| rand2 | 450/450 | 35 | 1.02 | 2.8 | 175 | -3.2 |
| rand3 | 450/450 | 23 | 0.66 | 1.9 | 183 | -3.9 |

h = 0.01, r = 0.75, n = 700 (cutoff 6.99)

| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |
|---|---|---|---|---|---|---|
| EA_0.2 | 700/700 | 88 | 0.87 | 2.4 | 270 | -6.7 |
| EA_0.05 | 700/700 | 100 | 0.99 | 2.7 | 212 | -7.7 |
| EA_0.01 | 700/700 | 112 | 1.11 | 3.0 | 167 | -8.1 |
| tw-_2 | 700/700 | 71 | 0.70 | 2.0 | 168 | -4.6 |
| tw-_101 | 700/700 | 458 | 4.57 | 96.5 | 180 | -6.2 |
| tw-_1009 | 700/700 | 688 | 6.87 | 962.9 | 9 | -7.2 |
| tw+_2 | 700/700 | 76 | 0.75 | 2.1 | 259 | -4.6 |
| drop2 | 700/700 | 73 | 0.72 | 2.1 | 239 | -5.2 |
| liouville | 700/700 | 71 | 0.70 | 2.0 | 171 | -4.3 |
| rand1 | 700/700 | 110 | 1.09 | 3.0 | 175 | -4.0 |

h = 0.01, r = 0.75, n = 900 (cutoff 8.99)

| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |
|---|---|---|---|---|---|---|
| EA_0.2 | 900/900 | 88 | 0.87 | 2.4 | 368 | -7.9 |
| EA_0.01 | 900/900 | 112 | 1.11 | 3.0 | 234 | -10.5 |
| EA_0.001 | 900/900 | 144 | 1.43 | 4.2 | 185 | -8.8 |
| tw-_2 | 900/900 | 71 | 0.70 | 2.0 | 264 | -4.6 |
| tw-_101 | 900/900 | 458 | 4.57 | 96.5 | 282 | -6.2 |
| tw-_1009 | 900/900 | 688 | 6.87 | 962.9 | 190 | -7.2 |
| tw+_2 | 900/900 | 76 | 0.75 | 2.1 | 401 | -4.6 |
| drop2 | 900/900 | 73 | 0.72 | 2.1 | 384 | -5.2 |
| liouville | 900/900 | 71 | 0.70 | 2.0 | 258 | -4.3 |
| rand1 | 900/900 | 110 | 1.09 | 3.0 | 267 | -4.0 |

Twists and deletions at a single prime p (h = 0.03): c* = log p - delta with delta = 0.00 to 0.35 for p = 2 .. 100003;
at h = 0.01 (narrower bumps) delta = -0.06 to 0.05; at h = 0.1 delta = 0.19 to 1.51. The offset is the reach of a
Gaussian of width s = 0.75 h, so the failure occurs when the classes first reach log p. The sign of the change
(TW-, TW+, deletion) does not matter for the location. The Liouville twist and the random twists fail at the first
prime where they differ from zeta (c* = 0.50 to 1.09).

E_a: c* = 0.75 (a = 0.4) rising to 1.38 (a = 0.001) at h = 0.03; at h = 0.1, c* = 0.6 rising to 2.8. The first failure
moves out slowly as a -> 0 (roughly like log(1/a)); at a = 0 the object is zeta^2 and the baseline changes.

### 3.4 Prime-power family (CERTIFIED; fixed code only)

Classes D_q at log q, q = 1 and prime powers p^k <= X with p <= P, in increasing q; "first q" is the class at which
the first extra positive eigenvalue appears.

| object | P | X | s | classes n | certified | inertia of full form (+,-) | first q with an extra positive eigenvalue | number of extra positive | min log10 abs pivot | digits | entries s | cert s |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 2 | 1000000 | 0.1 | 20 | 20/20 | (1,21) | none | 0 | -11.7 | 60 | 13.5 | 0.0 |
| EA_0.2 | 2 | 1000000 | 0.1 | 20 | 20/20 | (12,12) | 32 | 10 | -5.7 | 60 | 14.9 | 0.0 |
| EA_0.05 | 2 | 1000000 | 0.1 | 20 | 20/20 | (12,12) | 64 | 10 | -8.2 | 60 | 12.7 | 0.0 |
| EA_0.01 | 2 | 1000000 | 0.1 | 20 | 20/20 | (10,14) | 256 | 8 | -7.7 | 60 | 17.1 | 0.0 |
| tw-_2 | 2 | 1000000 | 0.1 | 20 | 20/20 | (11,11) | 2 | 10 | -1.8 | 60 | 13.3 | 0.0 |
| tw-_101 | 2 | 1000000 | 0.1 | 20 | 20/20 | (8,14) | 128 | 7 | -4.0 | 60 | 10.9 | 0.0 |
| tw+_2 | 2 | 1000000 | 0.1 | 20 | 20/20 | (15,7) | 2 | 14 | -2.9 | 60 | 12.7 | 0.0 |
| drop2 | 2 | 1000000 | 0.1 | 20 | 20/20 | (14,8) | 2 | 13 | -2.7 | 60 | 12.8 | 0.0 |
| liouville | 2 | 1000000 | 0.1 | 20 | 20/20 | (16,6) | 2 | 15 | -1.7 | 60 | 11.7 | 0.0 |
| rand1 | 2 | 1000000 | 0.1 | 20 | 20/20 | (12,10) | 4 | 11 | -2.0 | 60 | 13.2 | 0.0 |
| zeta | 3 | 1000000 | 0.1 | 32 | 32/32 | (1,33) | none | 0 | -19.3 | 60 | 19.7 | 0.0 |
| EA_0.2 | 3 | 1000000 | 0.1 | 32 | 32/32 | (18,18) | 3 | 16 | -8.8 | 60 | 22.1 | 0.0 |
| EA_0.05 | 3 | 1000000 | 0.1 | 32 | 32/32 | (17,19) | 27 | 15 | -9.7 | 60 | 18.5 | 0.0 |
| EA_0.01 | 3 | 1000000 | 0.1 | 32 | 32/32 | (17,19) | 32 | 15 | -10.3 | 60 | 22.5 | 0.0 |
| tw-_2 | 3 | 1000000 | 0.1 | 32 | 32/32 | (17,17) | 2 | 16 | -3.4 | 60 | 18.0 | 0.0 |
| tw-_101 | 3 | 1000000 | 0.1 | 32 | 32/32 | (13,21) | 64 | 12 | -5.5 | 60 | 19.4 | 0.0 |
| tw+_2 | 3 | 1000000 | 0.1 | 32 | 32/32 | (22,12) | 2 | 21 | -2.9 | 60 | 15.7 | 0.0 |
| drop2 | 3 | 1000000 | 0.1 | 32 | 32/32 | (21,13) | 2 | 20 | -4.3 | 60 | 14.9 | 0.0 |
| liouville | 3 | 1000000 | 0.1 | 32 | 32/32 | (23,11) | 2 | 22 | -2.8 | 60 | 18.7 | 0.0 |
| rand1 | 3 | 1000000 | 0.1 | 32 | 32/32 | (16,18) | 3 | 15 | -2.0 | 60 | 17.2 | 0.0 |
| zeta | 7 | 10000 | 0.05 | 31 | 31/31 | (1,32) | none | 0 | -5.5 | 60 | 1.8 | 0.0 |
| DH | 7 | 10000 | 0.05 | 31 | 31/31 | (0,31) | none | 0 | -2.2 | 60 | 3.1 | 0.0 |
| EA_0.2 | 7 | 10000 | 0.05 | 31 | 31/31 | (16,19) | 7 | 14 | -3.3 | 60 | 1.7 | 0.0 |
| EA_0.05 | 7 | 10000 | 0.05 | 31 | 31/31 | (12,23) | 128 | 10 | -4.4 | 60 | 2.4 | 0.0 |
| EA_0.01 | 7 | 10000 | 0.05 | 31 | 31/31 | (6,29) | 2048 | 4 | -5.1 | 60 | 2.6 | 0.0 |
| tw-_2 | 7 | 10000 | 0.05 | 31 | 31/31 | (12,21) | 2 | 11 | -2.4 | 60 | 1.3 | 0.0 |
| tw-_101 | 7 | 10000 | 0.05 | 31 | 31/31 | (10,23) | 128 | 9 | -3.0 | 60 | 1.0 | 0.0 |
| tw+_2 | 7 | 10000 | 0.05 | 31 | 31/31 | (15,18) | 7 | 14 | -3.0 | 60 | 1.4 | 0.0 |
| drop2 | 7 | 10000 | 0.05 | 31 | 31/31 | (15,18) | 4 | 14 | -2.4 | 60 | 1.5 | 0.0 |
| liouville | 7 | 10000 | 0.05 | 31 | 31/31 | (15,18) | 2 | 14 | -2.7 | 60 | 1.1 | 0.0 |
| rand1 | 7 | 10000 | 0.05 | 31 | 31/31 | (15,18) | 3 | 14 | -2.3 | 60 | 1.6 | 0.0 |
| zeta | 7 | 1000000 | 0.05 | 47 | 47/47 | (1,48) | none | 0 | -8.9 | 60 | 9.1 | 0.0 |
| EA_0.2 | 7 | 1000000 | 0.05 | 47 | 47/47 | (24,27) | 7 | 22 | -3.8 | 60 | 11.8 | 0.0 |
| EA_0.05 | 7 | 1000000 | 0.05 | 47 | 47/47 | (20,31) | 128 | 18 | -4.7 | 60 | 12.0 | 0.0 |
| EA_0.01 | 7 | 1000000 | 0.05 | 47 | 47/47 | (17,34) | 2048 | 15 | -5.4 | 60 | 10.9 | 0.0 |
| tw-_2 | 7 | 1000000 | 0.05 | 47 | 47/47 | (19,30) | 2 | 18 | -4.8 | 60 | 8.1 | 0.0 |
| tw-_101 | 7 | 1000000 | 0.05 | 47 | 47/47 | (16,33) | 128 | 15 | -3.9 | 60 | 7.9 | 0.0 |
| tw+_2 | 7 | 1000000 | 0.05 | 47 | 47/47 | (25,24) | 7 | 24 | -3.0 | 60 | 7.2 | 0.0 |
| drop2 | 7 | 1000000 | 0.05 | 47 | 47/47 | (25,24) | 4 | 24 | -2.7 | 60 | 6.7 | 0.0 |
| liouville | 7 | 1000000 | 0.05 | 47 | 47/47 | (21,28) | 2 | 20 | -2.7 | 60 | 9.0 | 0.0 |
| rand1 | 7 | 1000000 | 0.05 | 47 | 47/47 | (22,27) | 3 | 21 | -2.3 | 60 | 7.4 | 0.0 |
| zeta | 31 | 10000 | 0.05 | 49 | 49/49 | (1,50) | none | 0 | -8.8 | 60 | 3.4 | 0.0 |
| DH | 31 | 10000 | 0.05 | 49 | 49/49 | (0,49) | none | 0 | -4.3 | 60 | 4.1 | 0.0 |
| EA_0.2 | 31 | 10000 | 0.05 | 49 | 49/49 | (24,29) | 7 | 22 | -4.6 | 60 | 4.6 | 0.0 |
| EA_0.05 | 31 | 10000 | 0.05 | 49 | 49/49 | (21,32) | 13 | 19 | -6.0 | 60 | 3.6 | 0.0 |
| EA_0.01 | 31 | 10000 | 0.05 | 49 | 49/49 | (17,36) | 125 | 15 | -5.9 | 60 | 4.1 | 0.0 |
| tw-_2 | 31 | 10000 | 0.05 | 49 | 49/49 | (19,32) | 2 | 18 | -3.4 | 60 | 2.2 | 0.0 |
| tw-_101 | 31 | 10000 | 0.05 | 49 | 49/49 | (18,33) | 81 | 17 | -4.2 | 60 | 2.5 | 0.0 |
| tw+_2 | 31 | 10000 | 0.05 | 49 | 49/49 | (25,26) | 7 | 24 | -4.0 | 60 | 3.1 | 0.0 |
| drop2 | 31 | 10000 | 0.05 | 49 | 49/49 | (25,26) | 4 | 24 | -3.5 | 60 | 2.1 | 0.0 |
| liouville | 31 | 10000 | 0.05 | 49 | 49/49 | (22,29) | 2 | 21 | -4.6 | 60 | 3.0 | 0.0 |
| rand1 | 31 | 10000 | 0.05 | 49 | 49/49 | (23,28) | 3 | 22 | -3.6 | 60 | 2.1 | 0.1 |
| zeta | 31 | 1000000 | 0.05 | 77 | 77/77 | (1,78) | none | 0 | -15.7 | 60 | 15.0 | 0.1 |
| EA_0.2 | 31 | 1000000 | 0.05 | 77 | 77/77 | (39,42) | 7 | 37 | -5.9 | 60 | 22.8 | 0.1 |
| EA_0.05 | 31 | 1000000 | 0.05 | 77 | 77/77 | (36,45) | 13 | 34 | -8.2 | 60 | 20.5 | 0.1 |
| EA_0.01 | 31 | 1000000 | 0.05 | 77 | 77/77 | (34,47) | 125 | 32 | -8.1 | 60 | 22.6 | 0.1 |
| tw-_2 | 31 | 1000000 | 0.05 | 77 | 77/77 | (31,48) | 2 | 30 | -4.2 | 60 | 18.8 | 0.1 |
| tw-_101 | 31 | 1000000 | 0.05 | 77 | 77/77 | (29,50) | 81 | 28 | -4.8 | 60 | 13.8 | 0.1 |
| tw+_2 | 31 | 1000000 | 0.05 | 77 | 77/77 | (45,34) | 7 | 44 | -4.9 | 60 | 13.6 | 0.2 |
| drop2 | 31 | 1000000 | 0.05 | 77 | 77/77 | (43,36) | 4 | 42 | -3.5 | 60 | 17.9 | 0.1 |
| liouville | 31 | 1000000 | 0.05 | 77 | 77/77 | (33,46) | 2 | 32 | -4.6 | 60 | 18.5 | 0.1 |
| rand1 | 31 | 1000000 | 0.05 | 77 | 77/77 | (37,42) | 3 | 36 | -3.6 | 60 | 15.6 | 0.1 |
| zeta | 101 | 10000 | 0.03 | 78 | 78/78 | (1,79) | none | 0 | -6.8 | 60 | 7.5 | 0.1 |
| DH | 101 | 10000 | 0.03 | 78 | 78/78 | (1,77) | 8192 | 1 | -4.9 | 60 | 8.4 | 0.1 |
| EA_0.2 | 101 | 10000 | 0.03 | 78 | 78/78 | (36,46) | 11 | 34 | -4.5 | 60 | 13.7 | 0.1 |
| EA_0.05 | 101 | 10000 | 0.03 | 78 | 78/78 | (29,53) | 37 | 27 | -5.1 | 60 | 11.6 | 0.1 |
| EA_0.01 | 101 | 10000 | 0.03 | 78 | 78/78 | (19,63) | 89 | 17 | -6.1 | 60 | 13.4 | 0.1 |
| tw-_2 | 101 | 10000 | 0.03 | 78 | 78/78 | (25,55) | 4 | 24 | -4.1 | 60 | 6.2 | 0.1 |
| tw-_101 | 101 | 10000 | 0.03 | 78 | 78/78 | (25,55) | 89 | 24 | -4.9 | 60 | 5.5 | 0.1 |
| tw+_2 | 101 | 10000 | 0.03 | 78 | 78/78 | (32,48) | 11 | 31 | -5.2 | 60 | 7.8 | 0.1 |
| drop2 | 101 | 10000 | 0.03 | 78 | 78/78 | (33,47) | 9 | 32 | -4.8 | 60 | 7.5 | 0.1 |
| liouville | 101 | 10000 | 0.03 | 78 | 78/78 | (26,54) | 3 | 25 | -4.9 | 60 | 6.7 | 0.1 |
| rand1 | 101 | 10000 | 0.03 | 78 | 78/78 | (31,49) | 3 | 30 | -4.5 | 60 | 6.5 | 0.1 |
| zeta | 101 | 100000 | 0.03 | 96 | 96/96 | (1,97) | none | 0 | -8.1 | 60 | 9.7 | 0.2 |
| EA_0.2 | 101 | 100000 | 0.03 | 96 | 96/96 | (45,55) | 11 | 43 | -4.5 | 60 | 16.9 | 0.2 |
| EA_0.05 | 101 | 100000 | 0.03 | 96 | 96/96 | (39,61) | 37 | 37 | -5.1 | 60 | 22.3 | 0.2 |
| EA_0.01 | 101 | 100000 | 0.03 | 96 | 96/96 | (30,70) | 89 | 28 | -6.1 | 60 | 19.7 | 0.2 |
| tw-_2 | 101 | 100000 | 0.03 | 96 | 96/96 | (33,65) | 4 | 32 | -4.1 | 60 | 11.3 | 0.1 |
| tw-_101 | 101 | 100000 | 0.03 | 96 | 96/96 | (33,65) | 89 | 32 | -4.9 | 60 | 8.1 | 0.2 |
| tw+_2 | 101 | 100000 | 0.03 | 96 | 96/96 | (46,52) | 11 | 45 | -5.2 | 60 | 11.6 | 0.2 |
| drop2 | 101 | 100000 | 0.03 | 96 | 96/96 | (45,53) | 9 | 44 | -4.8 | 60 | 9.4 | 0.2 |
| liouville | 101 | 100000 | 0.03 | 96 | 96/96 | (32,66) | 3 | 31 | -4.9 | 60 | 7.7 | 0.2 |
| rand1 | 101 | 100000 | 0.03 | 96 | 96/96 | (40,58) | 3 | 39 | -4.5 | 60 | 8.6 | 0.2 |
| zeta | 1000 | 1000 | 0.05 | 194 | 194/194 | (1,195) | none | 0 | -67.8 | 96 | 47.4 | 1.7 |
| DH | 1000 | 1000 | 0.05 | 194 | 194/194 | (2,192) | 563 | 2 | -51.3 | 96 | 68.7 | 1.6 |
| EA_0.2 | 1000 | 1000 | 0.05 | 194 | 194/194 | (57,141) | 7 | 55 | -51.0 | 96 | 94.7 | 1.6 |
| EA_0.05 | 1000 | 1000 | 0.05 | 194 | 194/194 | (57,141) | 13 | 55 | -50.7 | 96 | 98.2 | 1.8 |
| EA_0.01 | 1000 | 1000 | 0.05 | 194 | 194/194 | (55,143) | 37 | 53 | -51.8 | 96 | 102.1 | 1.7 |
| tw-_2 | 1000 | 1000 | 0.05 | 194 | 194/194 | (31,165) | 2 | 30 | -47.9 | 96 | 57.6 | 1.6 |
| tw-_101 | 1000 | 1000 | 0.05 | 194 | 194/194 | (15,181) | 79 | 14 | -54.7 | 96 | 46.6 | 1.8 |
| tw+_2 | 1000 | 1000 | 0.05 | 194 | 194/194 | (44,152) | 7 | 43 | -48.9 | 96 | 48.5 | 1.6 |
| drop2 | 1000 | 1000 | 0.05 | 194 | 194/194 | (42,154) | 4 | 41 | -48.1 | 96 | 44.2 | 1.8 |
| liouville | 1000 | 1000 | 0.05 | 194 | 194/194 | (34,162) | 2 | 33 | -48.1 | 96 | 60.2 | 1.9 |
| rand1 | 1000 | 1000 | 0.05 | 194 | 194/194 | (33,163) | 3 | 32 | -48.1 | 96 | 47.8 | 1.7 |
| zeta | 1000 | 1000 | 0.02 | 194 | 194/194 | (1,195) | none | 0 | -14.7 | 60 | 53.4 | 1.3 |
| DH | 1000 | 1000 | 0.02 | 194 | 194/194 | (2,192) | 647 | 2 | -12.8 | 60 | 51.1 | 1.2 |
| EA_0.2 | 1000 | 1000 | 0.02 | 194 | 194/194 | (43,155) | 17 | 41 | -12.6 | 60 | 92.6 | 1.3 |
| EA_0.05 | 1000 | 1000 | 0.02 | 194 | 194/194 | (36,162) | 61 | 34 | -13.9 | 60 | 91.6 | 1.2 |
| EA_0.01 | 1000 | 1000 | 0.02 | 194 | 194/194 | (28,170) | 223 | 26 | -13.6 | 60 | 92.5 | 1.2 |
| tw-_2 | 1000 | 1000 | 0.02 | 194 | 194/194 | (28,168) | 7 | 27 | -12.7 | 60 | 53.6 | 1.4 |
| tw-_101 | 1000 | 1000 | 0.02 | 194 | 194/194 | (10,186) | 97 | 9 | -13.8 | 60 | 47.6 | 1.4 |
| tw+_2 | 1000 | 1000 | 0.02 | 194 | 194/194 | (39,157) | 29 | 38 | -12.7 | 60 | 50.4 | 1.3 |
| drop2 | 1000 | 1000 | 0.02 | 194 | 194/194 | (34,162) | 17 | 33 | -12.9 | 60 | 47.7 | 1.3 |
| liouville | 1000 | 1000 | 0.02 | 194 | 194/194 | (28,168) | 5 | 27 | -12.7 | 60 | 46.9 | 1.3 |
| rand1 | 1000 | 1000 | 0.02 | 194 | 194/194 | (27,169) | 5 | 26 | -13.0 | 60 | 44.9 | 1.4 |
| zeta | 3000 | 3000 | 0.02 | 467 | 467/467 | (1,468) | none | 0 | -72.4 | 153 | 926.3 | 23.4 |
| DH | 3000 | 3000 | 0.02 | 467 | 467/467 | (4,463) | 647 | 4 | -68.7 | 153 | 876.8 | 27.2 |
| EA_0.2 | 3000 | 3000 | 0.02 | 467 | 467/467 | (82,389) | 17 | 80 | -68.5 | 153 | 1872.1 | 37.0 |
| EA_0.05 | 3000 | 3000 | 0.02 | 467 | 467/467 | (79,392) | 61 | 77 | -68.7 | 153 | 1840.1 | 30.9 |
| EA_0.01 | 3000 | 3000 | 0.02 | 467 | 467/467 | (76,395) | 223 | 74 | -68.6 | 153 | 1775.2 | 23.5 |
| tw-_2 | 3000 | 3000 | 0.02 | 467 | 467/467 | (43,426) | 7 | 42 | -68.5 | 153 | 894.2 | 20.3 |
| tw-_101 | 3000 | 3000 | 0.02 | 467 | 467/467 | (21,448) | 97 | 20 | -70.0 | 153 | 890.4 | 21.8 |
| tw+_2 | 3000 | 3000 | 0.02 | 467 | 467/467 | (62,407) | 29 | 61 | -68.3 | 153 | 895.7 | 28.7 |
| drop2 | 3000 | 3000 | 0.02 | 467 | 467/467 | (58,411) | 17 | 57 | -68.6 | 153 | 858.8 | 22.6 |
| liouville | 3000 | 3000 | 0.02 | 467 | 467/467 | (45,424) | 5 | 44 | -68.2 | 153 | 831.0 | 20.9 |
| rand1 | 3000 | 3000 | 0.02 | 467 | 467/467 | (44,425) | 5 | 43 | -68.3 | 153 | 869.6 | 25.1 |
| zeta | 3000 | 3000 | 0.01 | 467 | 467/467 | (1,468) | none | 0 | -25.2 | 110 | 820.0 | 15.8 |
| DH | 3000 | 3000 | 0.01 | 467 | 467/467 | (3,464) | 641 | 3 | -24.3 | 110 | 844.0 | 22.5 |
| EA_0.2 | 3000 | 3000 | 0.01 | 467 | 467/467 | (66,405) | 29 | 64 | -24.3 | 110 | 1990.1 | 23.2 |
| EA_0.05 | 3000 | 3000 | 0.01 | 467 | 467/467 | (49,422) | 179 | 47 | -26.4 | 110 | 1878.0 | 15.5 |
| EA_0.01 | 3000 | 3000 | 0.01 | 467 | 467/467 | (26,445) | 823 | 24 | -24.4 | 110 | 1847.1 | 15.8 |
| tw-_2 | 3000 | 3000 | 0.01 | 467 | 467/467 | (38,431) | 17 | 37 | -24.4 | 110 | 817.9 | 17.3 |
| tw-_101 | 3000 | 3000 | 0.01 | 467 | 467/467 | (19,450) | 101 | 18 | -24.7 | 110 | 806.4 | 16.8 |
| tw+_2 | 3000 | 3000 | 0.01 | 467 | 467/467 | (48,421) | 243 | 47 | -24.5 | 110 | 826.2 | 17.0 |
| drop2 | 3000 | 3000 | 0.01 | 467 | 467/467 | (46,423) | 163 | 45 | -23.8 | 110 | 947.3 | 25.2 |
| liouville | 3000 | 3000 | 0.01 | 467 | 467/467 | (42,427) | 13 | 41 | -24.4 | 110 | 879.7 | 24.0 |
| rand1 | 3000 | 3000 | 0.01 | 467 | 467/467 | (41,428) | 16 | 40 | -24.9 | 110 | 817.1 | 25.4 |
| zeta | 10000 | 10000 | 0.005 | 1281 | 1281/1281 | (1,1282) | none | 0 | -51.4 | 128 | 2873.9 | 309.4 |
| DH | 10000 | 10000 | 0.005 | 1281 | 1281/1281 | (9,1272) | 1087 | 9 | -50.9 | 128 | 2795.1 | 304.7 |
| tw-_101 | 10000 | 10000 | 0.005 | 1281 | 1281/1281 | (38,1245) | 179 | 37 | -51.0 | 128 | 3323.8 | 324.7 |

Zeta: inertia (1, n+1) in every row, up to all prime powers below 10^4 (1281 classes, width 0.005, 128 digits;
821,121 entries, 2874 s on 6 workers) and below 3000 at widths 0.02 and 0.01. DH: with all prime powers as classes the first positive
eigenvalue appears at q = 563 to 647 (cutoff log q = 6.3 to 6.5), later than on the uniform grid (3.56) because the
prime-power nodes are sparse at small q; with only the powers of primes up to 7 or 31 as classes DH does not fail up to
X = 10^4, and with primes up to 101 it gains one positive eigenvalue at q = 8192.
A single-prime twist at p fails at or shortly after q = p when the class at log p exists (p = 101: q = 79 to 101 for
s >= 0.01), and at a later class when it does not (P = 7: q = 128). With all prime powers below 10^4 and s = 0.005
(128 digits): zeta (1,1282); DH nine positive eigenvalues, the first at q = 1087; tw-_101 thirty-seven extra, the
first at q = 179. With narrower bumps the first failing class moves out (DH: q = 563, 647, 641, 1087 for
s = 0.05, 0.02, 0.01, 0.005), because narrow bumps at sparse nodes give a diagonally dominant matrix: the diagonal of Z
grows like log(1/s) times the norm (sibling lane, section 3).

### 3.5 Backward heat (MEASURED entries; exact certificate given the stated radius)

Here the matrix is Z_t itself (zero side by contour integral), and the Lorentzian statement is "no positive pivot of
-Z_t". t is the de Bruijn-Newman time; t = 0 is zeta.

| t | h | n | contour difference | radius used | certified | first stage with a positive eigenvalue | cutoff c* | positive eigenvalues (certified part) | min log10 abs pivot |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.05 | 240 | 3.7e-55 | 1.0e-45 | 220/240 | none | - | 0 | -35.2 |
| -0.1 | 0.05 | 240 | 2.1e-55 | 1.0e-45 | 220/240 | none | - | 0 | -36.2 |
| -0.2 | 0.05 | 240 | 1.3e-55 | 1.0e-45 | 220/240 | none | - | 0 | -35.9 |
| -0.3 | 0.05 | 240 | 2.1e-55 | 1.0e-45 | 220/240 | 189 | 9.40 | 4 | -34.9 |
| -0.5 | 0.05 | 240 | 2.8e-55 | 1.0e-45 | 220/240 | 72 | 3.55 | 12 | -35.0 |
| 0 | 0.03 | 300 | 2.7e-40 | 1.0e-30 | 273/300 | none | - | 0 | -19.8 |
| 0 | 0.03 | 420 | 1.7e-55 | 1.0e-45 | 420/420 | none | - | 0 | -32.3 |
| -0.02 | 0.03 | 300 | 2.1e-40 | 1.0e-30 | 273/300 | none | - | 0 | -19.9 |
| -0.02 | 0.03 | 420 | 1.8e-55 | 1.0e-45 | 420/420 | none | - | 0 | -32.3 |
| -0.05 | 0.03 | 300 | 2.6e-40 | 1.0e-30 | 273/300 | none | - | 0 | -19.9 |
| -0.05 | 0.03 | 420 | 1.0e-55 | 1.0e-45 | 420/420 | none | - | 0 | -32.1 |
| -0.1 | 0.03 | 300 | 1.9e-40 | 1.0e-30 | 273/300 | none | - | 0 | -20.1 |
| -0.1 | 0.03 | 420 | 2.2e-55 | 1.0e-45 | 420/420 | none | - | 0 | -32.0 |
| -0.15 | 0.03 | 420 | 9.6e-56 | 1.0e-45 | 399/420 | 393 | 11.76 | 3 | -31.3 |
| -0.2 | 0.03 | 300 | 2.0e-40 | 1.0e-30 | 272/300 | none | - | 0 | -20.2 |
| -0.2 | 0.03 | 420 | 1.4e-55 | 1.0e-45 | 416/420 | 314 | 9.39 | 4 | -31.6 |
| -0.22 | 0.03 | 420 | 1.1e-55 | 1.0e-45 | 420/420 | 293 | 8.76 | 6 | -32.0 |
| -0.24 | 0.03 | 420 | 1.4e-55 | 1.0e-45 | 420/420 | 292 | 8.73 | 6 | -31.7 |
| -0.26 | 0.03 | 420 | 1.7e-55 | 1.0e-45 | 420/420 | 290 | 8.67 | 8 | -32.8 |
| -0.28 | 0.03 | 420 | 1.6e-55 | 1.0e-45 | 387/420 | 287 | 8.58 | 5 | -31.2 |
| -0.3 | 0.03 | 300 | 2.6e-40 | 1.0e-30 | 271/300 | 153 | 4.56 | 4 | -20.0 |
| -0.3 | 0.03 | 420 | 1.6e-55 | 1.0e-45 | 420/420 | 153 | 4.56 | 12 | -31.7 |
| -0.5 | 0.03 | 300 | 2.4e-40 | 1.0e-30 | 271/300 | 137 | 4.08 | 15 | -20.1 |
| -0.5 | 0.03 | 420 | 1.4e-55 | 1.0e-45 | 420/420 | 137 | 4.08 | 36 | -31.4 |
| -1 | 0.03 | 300 | 1.4e-40 | 1.0e-30 | 272/300 | 94 | 2.79 | 40 | -19.2 |
| -1 | 0.03 | 420 | 9.3e-56 | 1.0e-45 | 395/420 | 94 | 2.79 | 74 | -30.0 |
| -2 | 0.03 | 300 | 1.6e-40 | 1.0e-30 | 269/300 | 48 | 1.41 | 72 | -18.4 |
| -4 | 0.03 | 300 | 1.8e-40 | 1.0e-30 | 274/300 | 31 | 0.90 | 100 | -14.8 |
| 0 | 0.02 | 400 | 1.7e-40 | 1.0e-30 | 400/400 | none | - | 0 | -15.8 |
| -0.1 | 0.02 | 400 | 1.9e-40 | 1.0e-30 | 400/400 | none | - | 0 | -15.7 |
| -0.2 | 0.02 | 400 | 1.8e-40 | 1.0e-30 | 400/400 | 387 | 7.72 | 2 | -16.2 |
| -0.3 | 0.02 | 400 | 1.4e-40 | 1.0e-30 | 400/400 | 205 | 4.08 | 9 | -16.7 |
| -0.5 | 0.02 | 400 | 1.5e-40 | 1.0e-30 | 400/400 | 124 | 2.46 | 30 | -17.8 |

For t >= -0.1 there is no failure up to the largest cutoff run (12.6 at h = 0.03). The first failure moves in as t
decreases; at h = 0.03: c* = 11.8 (t = -0.15), 9.4 (-0.2), 8.6 to 8.8 (-0.22 to -0.28), 4.6 (-0.3), 4.1 (-0.5), 2.8 (-1),
1.4 (-2), 0.9 (-4). On the finer grid h = 0.02 (band to height 157): 7.7 (t = -0.2), 4.1 (-0.3), 2.5 (-0.5), none to
cutoff 8 at t = -0.1. On the coarser grid h = 0.05: 9.4 (-0.3), 3.6 (-0.5), none to cutoff 11 at t = -0.2. As for DH,
the size of first failure depends on the grid, and for every grid and size some t < 0 passes. The jump between t = -0.28 and -0.3 is not attributed (a second off-line pair entering the band is the
likely cause; not checked). Rows with "certified" below n stop where the pivots reach the assumed radius.

## 4. Function-field calibration (CERTIFIED, exact)

`ff.py`. Classes H, V, G_0..G_30 on C x C with the intersection numbers of section 2.1's dictionary:
H.H = V.V = 0, H.V = 1, G_k.H = q^k, G_k.V = 1, G_j.G_k = q^min(j,k) N_|j-k| for j != k, G_k.G_k = q^k(2 - 2g).
Point counts by enumeration over F_q and F_{q^2}. The Gram matrix (33 x 33, integers) is exact; the inertia is read
from the characteristic polynomial (all roots real, so the number of sign changes of the coefficients is the number of
positive roots, and the multiplicity of the root 0 is the nullity). Second route: the normalised Toeplitz lags
`-sum_j (alpha_j/sqrt q)^m` through the same Arb pipeline as zeta (midpoint Levinson + certificate) for the 2g
nonsingular stages.

| object | q | g | N_1, N_2, N_3 | inertia (+,-,0) on H, V, G_0..G_30 | 2g+2 | first k with a second positive eigenvalue | signs of the first Toeplitz pivots of -Z (Arb pipeline) |
|---|---|---|---|---|---|---|---|
| y^2=x^3+x+1 / F_5 | 5 | 1 | 9, 27, 108 | (1,3,29) | 4 | none | -- (2 of 2 nonsingular stages) |
| y^2=x^3+3 / F_7 | 7 | 1 | 13, 39, 364 | (1,3,29) | 4 | none | -- (2 of 2 nonsingular stages) |
| y^2=x^3+x+6 / F_11 | 11 | 1 | 13, 143, 1300 | (1,3,29) | 4 | none | -- (2 of 2 nonsingular stages) |
| y^2=x^3+2x+1 / F_13 | 13 | 1 | 8, 160, 2216 | (1,3,29) | 4 | none | -- (2 of 2 nonsingular stages) |
| y^2=x^5+x+1 / F_5 | 5 | 2 | 6, 46, 126 | (1,3,29) | 6 | none | -- (2 of 4 nonsingular stages) |
| y^2=x^5+x+1 / F_7 | 7 | 2 | 9, 63, 345 | (1,5,27) | 6 | none | ---- (4 of 4 nonsingular stages) |
| y^2=x^5+x^2+2 / F_11 | 11 | 2 | 9, 127, 1269 | (1,5,27) | 6 | none | ---- (4 of 4 nonsingular stages) |
| y^2=x^5+3x+1 / F_13 | 13 | 2 | 10, 178, 2122 | (1,5,27) | 6 | none | ---- (4 of 4 nonsingular stages) |
| fake g=1: 1 - 5T + 5T^2 (a=5 > 2 sqrt 5) | 5 | 1 | 1, 11, 76 | (2,2,29) | 4 | 1 | -+ (2 of 2 nonsingular stages) |
| fake g=1: 1 - 6T + 7T^2 | 7 | 1 | 2, 28, 254 | (2,2,29) | 4 | 1 | -+ (2 of 2 nonsingular stages) |
| fake g=1: 1 + 5T + 5T^2 | 5 | 1 | 11, 11, 176 | (2,2,29) | 4 | 1 | -+ (2 of 2 nonsingular stages) |
| fake g=2: (1-5T+5T^2)(1-T+5T^2) | 5 | 2 | 0, 20, 90 | (2,4,27) | 6 | 3 | ---+ (4 of 4 nonsingular stages) |
| fake g=2: (1-5T+5T^2)^2 | 5 | 2 | -4, -4, 26 | (2,2,29) | 6 | 1 | -+ (2 of 4 nonsingular stages) |
| Weil polynomial 1 - 9T^2 + 25T^4 (roots on the circle) | 5 | 2 | 6, 8, 126 | (1,5,27) | 6 | none | ---- (4 of 4 nonsingular stages) |
| Weil polynomial 1 - T - 4T^2 - 5T^3 + 25T^4 (roots on the circle) | 5 | 2 | 5, 17, 98 | (1,5,27) | 6 | none | ---- (4 of 4 nonsingular stages) |

Outcome: every genuine curve gives exactly one positive eigenvalue and rank at most 2g+2 (rank 4 for
y^2 = x^5 + x + 1 over F_5, whose L-polynomial is (1 + 5T^2)^2). The five polynomials with real roots off the circle
give two positive eigenvalues, first seen at k = 1 (g = 1 and the squared factor) or k = 3 (one off-circle factor
times one genuine factor). Two reciprocal polynomials that I had listed as fakes have all roots on the circle and
give (1,5,27): the test cannot distinguish a Weil polynomial that comes from a curve from one that does not, as
expected. The Arb pipeline reproduces the signs: all pivots of -Z negative for genuine curves, a positive pivot at
stage 2 or 4 for the fakes.


## 5. Lorentzian test (CERTIFIED signs; `lor.py`, `lor.out`)

The generating polynomial of the form on classes C_1..C_N is `f(x) = sum_{a,b} <C_a,C_b> x_a x_b`, of degree 2. The
Brändén-Huh definition for degree d asks for non-negative coefficients, M-convex support, and at most one positive
eigenvalue for the Hessian of every partial derivative of order d-2. For d = 2 the only such derivative is f itself, so
the test is: (i) all entries >= 0, (ii) M-convex support, (iii) at most one positive eigenvalue. (iii) is the inertia
already certified; (i) and (ii) depend on the basis. A higher-degree polynomial attached to the form (powers or products
of f with linear forms) is Lorentzian whenever f is, by closure under products, so it tests nothing more. The sibling
lane tested the Euler-product polynomials in variables z_p (Lorentzian for zeta and equally for E_a, T-NR, TW+).

48 cases, full Gram matrix including the fibre classes, entry signs and inertia certified at 50 digits: uniform
h = 0.1 (n = 8, 14) and h = 0.03 (n = 10, 40); prime powers <= 16 and <= 50 with s = 0.05; objects zeta, DH, tw-_2,
tw+_2, liouville, drop2, EA_0.2, EA_0.01.

| Case | (i) coefficients | (ii) support | (iii) positive eigenvalues | Lorentzian |
|---|---|---|---|---|
| zeta, h = 0.1, n = 8 and 14 | all >= 0 (two exact zeros: H.H, V.V) | M-convex | 1 | yes, as given |
| zeta, h = 0.03 (n = 10, 40); prime powers <= 16, <= 50 | negative: the diagonal D_j.D_j and near neighbours (19, 79, 11, 25 entries) | M-convex | 1 | not as given; yes after D_j -> D_j + 0.1(H+V) |
| tw-_2, tw+_2, liouville, drop2 at h = 0.03, n = 10 (cutoff 0.27, below their first failure at 0.66) | as zeta | M-convex | 1 | yes after the same shift |
| the same controls at every larger size tested | as zeta or with more negative entries | M-convex | 3 to 10 | no |
| EA_0.2, EA_0.01 | >= 0 at h = 0.1 | not M-convex (8 exact zeros among the four fibre classes) | 2 to 9 (baseline 2) | no |
| DH | negative entries, no fibre class to shift by | M-convex | 0 (below its first failure) | no (the statement for DH is "no positive eigenvalue") |

Outcome. The shift D_j -> D_j + a(H+V) is a change of basis, so it does not change (iii); it always repairs (i) for
large a. Hence "Lorentzian in some nef-shifted basis" is equivalent to the inertia statement, for zeta and for every
control. The Lorentzian property of the quadratic polynomial carries no information beyond the certified inertia.
Function field: the same holds; the self-intersections G_k.G_k = q^k(2-2g) are negative for g = 2 and the shift
G_k + a(H+V) repairs the signs.

## 6. Is this more than verified height in another form?

No. Reasons, each tied to a table.

1. **Each table is a finite set of strict inequalities in Gaussian-weighted zero sums.** `Z(d) = sum c0 e^{-v t^2/2} e^{itd}`;
   a zero at height gamma enters every entry with weight at most `c0 e^{-v(gamma^2 - 1/4)/2} e^{c/2}`. With the smallest
   certified pivot of a table this gives a height T beyond which no zero, on or off the line, can change any certified
   sign (column "height horizon" of section 3.1; ARGUED from the weight bound, not enclosed as a perturbation theorem).
   The largest value is about 2900 (h = 0.0025, n = 4000). Verified height is 3e12. The tables are implied by RH below
   that height and say nothing above it.
2. **Finite stages are open conditions.** Backward heat with -0.1 <= t < 0 passes every stage up to cutoff 12.6
   (MEASURED, section 3.4); at t = -0.15, -0.2 the first failure moves in to 11.8 and 9.4. For every size there is a
   t < 0 that passes, and the conclusion is false for every t < 0. So no statement of the form "inertia (1, n+1) at
   size n" for any fixed n, or any family of sizes reached here, is specific to zeta.
3. **The first-failure law is a bandwidth count.** DH fails at window length c* = 3.53 to 3.57 on every grid with
   pi/h > 85.7 and r = 0.75, at dimension n* = c*/h + 1 from 120 (h = 0.03) to 1427 (h = 0.0025). The dimension is not an
   invariant; the window is. A window of length c and band [-T, T] has about cT/pi degrees of freedom; at c* and
   T = 85.7 that is 97, against 86 real points (43 on-line ordinates and their negatives; count from the sibling lane)
   in front of the first off-line zero. On under-resolving grids (pi/h < 85.7) failures still occur through aliasing,
   at smaller dimension and longer window: the smallest dimension found is 68 (h = 0.075, r = 0.4, c* = 5.02), against
   Pick order 149. So "order of first failure" depends on the test family by more than a factor of 20 (68 to 1427),
   and the comparison with 149 has no intrinsic content. ARGUED for the count, CERTIFIED for the table.
4. **Arithmetic changes are seen exactly where they are, and nowhere earlier.** A change of Lambda at the prime p is
   detected at cutoff log p up to the width of the bumps (section 3.3), for p from 2 to 100003. A finite table with
   cutoff c is blind to every prime above e^{c+R}. This is the locality of the explicit formula, not a constraint on
   the primes.
5. **No structural reason appeared.** In the function-field calibration the signature is forced by a finite rank
   (2g+2) and by Riemann-Roch on the surface; the zeta matrices have full rank at every size, their smallest pivots
   decay without a visible floor (1e-7 to 1e-170 in section 3.1; the sibling lane's margin table and row P2 give the
   infimum 0), and nothing in the computation distinguishes the zeta table from the heat tables with small |t|
   except the sign pattern itself.

What would count as structural, and was not found: a rank bound, a recursion that terminates, or a lower bound on
pivots uniform in the cutoff. None is present in the data; the pivot sequences are stored in the JSON files
(`log10_abs_pivot`) for anyone who wants to look for a law.

## 7. What ran on the box

All launches through `~/rh-push/bin/rhrun`, in `~/rh-push/box-hodge-signature/`, CPU only (no GPU job). Stops only with
`systemctl --user stop <own unit>`. No pkill/kill by name, no process outside these units touched.

| unit | what | cores / memory limit | start - end (UTC) | peak memory of the unit | outcome |
|---|---|---|---|---|---|
| rh-bhs-u1-1117083212 | first uniform batch, 47 tasks, pool of 10 | 10 / 45 GB | 08:32:12 - 08:41:55 | 24.76 GB | stopped by me to move to one memory-aware queue; 43 finished results kept |
| rh-bhs-q-1117084156 | queue (`runq.py queue.txt`): uniform, DH, controls, heat, prime powers | 10 / 45 GB | 08:41:56 - 09:25:09 | 19.81 GB | stopped by me to deploy the fix of 2.3 item 2 |
| rh-bhs-q2-1117092509 | same queue, resumed | 10 / 45 GB | 09:25:09 - 10:42:19 | 19.10 GB | stopped by me to reorder (long streamed prime sums were blocking short tasks) |
| rh-bhs-big-1117100248 | `run_big.py` zeta h = 0.03, n = 692, X = 1.0e9 | 6 / 14 GB | 10:02:48 - 10:28:01 | not read before exit; parent RSS 0.56 GB | completed |
| rh-bhs-big2-1117102857 | `run_big.py` zeta h = 0.03, n = 738, X = 4.0e9 | 6 / 14 GB | 10:28:57 - 10:54:00 | 0.56 GB | stopped by me (projected 3.7 h); no result |
| rh-bhs-q3-1117104219 | reordered queue | 10 / 45 GB | 10:42:19 - 10:51:58 | 45 GB (limit) | killed by its own memory limit; see incident below |
| rh-bhs-pp4-1117105411 | `run_pp.py`, all prime powers <= 10^4, zeta then DH, 6 row workers | 6 / 14 GB | 10:54:11 - 13:29:52 | 2.84 GB | zeta and DH completed; stopped by me after DH |
| rh-bhs-q4-1117105906 | remaining queue with real estimates and a table cap | 10 / 40 GB | 10:59:06 - 13:29:52 | 10.69 GB | 19 of 20 tasks completed; stopped by me (EA_0.01 at X = 10^4 unfinished) |

Total: 8 units, 08:32 to 13:30 UTC (4 h 58 min wall), at most 16 cores and 59 GB of limits at any time, measured peak
of any one unit 24.76 GB apart from the incident. All units are inactive (checked with `systemctl --user show` after
the last stop). Output volume: 590 result files (JSON), copied to `box/`.

Incident (own unit only). `rh-bhs-q3` was terminated by its own cgroup memory limit (45 GB) at 10:51:58 UTC, 9 min 39 s
after launch. Cause: I had set the scheduler's memory estimates of the DH grid-scan tasks to 0.01 GB to unblock the
queue; ten scan tasks with width ratio 1.25 and h >= 0.145 then each built a dense DH weight table of 1e7 or more
entries (the proved tail exponent g = 2 with wide bumps makes the table limit large). The limit contained it: slice
memory after the kill was 4 GB, machine available memory 211 GB, no other unit affected. Response, following rule 5:
the problem was reduced, not the limit raised. `bh.py` now computes the planned table size before allocating and
refuses above 3e6 entries; the affected scan cells (r = 1.25, h >= 0.145) are reported as not run; the relaunched
queue carried real estimates and a 40 GB cap.

Local runs (Mac): development and validation only, all through `scripts/memcap.sh` with caps 2 to 7 GB, each under
2 minutes: `test_validate.py`, `test_cert.py`, `ff.py 12`, `lor.py`, small `run_u.py`, `run_pp.py`, `heat.py`,
`run_big.py` checks.

## 8. Three weakest steps

1. **Backward heat entries are not enclosed.** The contour quadrature has no proved error bound; the radius is 100
   times the difference of two contours plus 10^-digits. The t = 0 table agrees with the certified prime side
   (max difference 1.1e-55 over 420 lags at h = 0.03, 45-digit run, after the fix of section 2.3 item 2), which tests the code, not the t < 0 tables. A zero of H_t to the right of both contours with
   non-negligible Gaussian weight would be missed; the two-contour agreement at the 1e-55 level makes that unlikely
   for the listed t, but it is not excluded by proof.
2. **The height horizon is an estimate.** It bounds the size of a single zero's contribution to the entries and
   compares it with the smallest pivot. The Gram matrices are ill-conditioned, so a perturbation of that size is not
   proved to leave the signs unchanged. The qualitative statement (tables see only heights of order 1e3) does not
   depend on the constant.
3. **Coverage of the claim "every control fails at a size set by where it differs".** It is a summary of the tables,
   for the controls and grids run. E_a with a <= 0.002 at h = 0.1 fails only at cutoff 2.8, and DH on grids with
   h >= 0.13 did not fail within cutoff 9; for those cells the first failure lies beyond what was computed or does
   not exist on that grid. T-NR and Beurling were not run here.

Also: one wrong "certified" line was produced before the rounding defect of section 2.3 was fixed. It was caught
because zeta appeared to fail at low height, which contradicts verified height. A defect of the same kind that
produced a plausible answer would not have been caught that way. Mitigation: the uniform family passes no data
through strings; `run_big.py` adds the rounding to the radius; at n = 134 three independent routes (ball LDL, ball
Levinson, the certificate) agree; the calibration returns the known signature.

## 9. Files

- `bh.py` library (entries with radii, Levinson/LDL midpoints, `certify`); `run_u.py` uniform family; `run_big.py`
  uniform family with parallel prime sum and segment checkpoints; `run_pp.py` prime-power family; `heat.py`
  backward heat; `ff.py` function-field calibration; `lor.py` Lorentzian test; `runq.py` memory-aware queue;
  `genq.py`, `queue*.txt`, `tasks_*.txt` task lists; `tables.py` table builder.
- `box/out_u`, `box/out_big`, `box/out_dh`, `box/out_scan`, `box/out_pp2`, `box/out_heat`, `box/out_heat_chk`:
  one JSON per run (inertia, positive stages, log10 of every pivot, entry radius, timings, peak RSS).
  `box/ff_box.out`, `ff.out`, `lor.out`: calibration and Lorentzian outputs.
