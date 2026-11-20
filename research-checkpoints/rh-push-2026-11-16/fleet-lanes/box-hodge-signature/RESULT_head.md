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
   uniform families up to n = __ZN__ classes and cutoffs up to X = e^c = __ZX__, prime-power families up to all
   prime powers below 10^4 (1281 classes). Largest height that can influence any certified sign: about __ZT__
   (section 3.1), against verified height 3e12.
3. Controls (CERTIFIED, except backward heat which is MEASURED): every control acquires extra positive eigenvalues at a
   finite size, and the size is set by where the control differs from zeta, not by the dimension:
   - sign twist or deletion at a prime p: at cutoff c* = log p - delta, delta = 0.00 to 0.35 at h = 0.03
     (p from 2 to 100003);
   - zeta(s+a)zeta(s-a): at c* between 0.75 (a = 0.4) and 1.38 (a = 0.001) at h = 0.03;
   - Davenport-Heilbronn: at c* = 3.53 to 3.57 (X* about 35) on every grid with r = 0.75 that resolves height 85.7,
     at dimension n* = c*/h + 1 (120 at h = 0.03, 1427 at h = 0.0025); smallest dimension found on any grid:
     __DHMIN__; Pick: order 149;
   - backward heat H_t: no failure up to cutoff 12.6 for t >= -0.1; first failure at c* = 11.8 (t = -0.15), 9.4 (-0.2),
     4.6 (-0.3), 4.1 (-0.5), 2.8 (-1), 1.4 (-2), 0.9 (-4).
4. Lorentzian test: the generating polynomial of a symmetric form is quadratic, and for degree 2 the Brändén-Huh
   definition is "non-negative coefficients, M-convex support, at most one positive eigenvalue". Checked with certified
   signs for 48 cases: zeta is Lorentzian as given at h = 0.1 and after a shift by 0.1(H+V) in the other bases; no
   control is, except at sizes below its first failure. The polynomial test contains no information beyond the inertia.
5. More than verified height? No. Each certified table is a finite set of strict inequalities in finitely many
   Gaussian-weighted zero sums; it is implied by RH up to height about __ZT__ and would be unchanged by any off-line
   zero above that height (estimate, section 8 item 2). The first-failure law for the controls is a bandwidth count (degrees of freedom of the test
   space against the number of zeros in front of the first off-line one), the same mechanism as the Pick horizon.
   The box was used for scale and for the controls, not for a new kind of statement.

## 1. What is new relative to the map and the sibling lane

Read before starting: `push/BRIEF.md` (all notices), `push/OBSTRUCTION_MAP.md` (controls; rows P1-P13, T1-T3, S1),
`eq48/RESULT.md`, `push/ap-hodge-index/` (code, then RESULT.md and REFEREE.md when they appeared), `ff-transplant/RESULT.md`.

| Existing item | What it has | What this lane adds |
|---|---|---|
| `ap-hodge-index` sections 2-4 | the form `I = Prime - A = P - Z`; Theorem 1 (i_+ <= 1 on every finite space iff RH); signature tables to dimension 200, window c <= 6, entry errors estimated | same form (definition taken from that lane; fibre classes made explicit, section 2.1); every entry enclosed with a proved radius; inertia by a certificate that does not depend on the elimination order; dimension up to __ZN__, window up to c = __ZC__; prime-power class families; backward heat run; denser control sweeps |
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
