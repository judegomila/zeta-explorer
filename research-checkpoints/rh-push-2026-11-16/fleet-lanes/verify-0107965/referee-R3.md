# Referee report R3: zero dynamics and global first-contact comparison

Object: hexagon:2611.00460v1 (Raymond), sec 2.3-2.5 and 4.1-4.2 (with the parts of 4.4 and 4.8 that
feed them): Lemmas 2.5, 2.6, 2.8, 2.9, Prop 2.7, Thm 2.10, Lemmas 2.11, 4.1, 4.2.
Text read: `packet/hexsrc/Unconditional_0107965.tex` lines 287-375, 566-1007, 1023-1100, 1914-2013,
2058-2230, 2279-2335, 2517-2590. Date 2026-11-17.

## Verdict

**verified-with-corrections** for this part, as a conditional statement:

> IF (a) Prop 2.4 (finite head: zeros with |Re z| <= X real for 0 <= t <= 41/250), (b) Thm 3.1
> (J_i(t,x) >= S_i(t) for x >= X on each closed cell), (c) the finite part of Thm 3.4 (boundary kernel
> inequality R_i(d, sqrt q) <= 4/(d^2+4q) for all real d and 0 < q <= c_i, and O_pair,i nondecreasing
> on [0, c_i]), (d) Prop 4.3 (every arc satisfies (91)-(93), joins exactly, ends at (T, q_T)), and
> (e) the initial strip |Im z| <= 3/4 at t = 0, THEN every zero of H_T has |Im z| < sqrt(q_T) and
> Lambda <= T + q_T/2 = B*.

Every step of that implication was re-derived by hand and found correct. No gap and no error was found
in R3. The corrections are wording-level (section "Corrections"). R3 does not establish (a)-(e); those
are R1, R2, R4-R9. A "verified" here says nothing about the theorem as a whole.

## Step-by-step re-derivation

Normalisation: d_t H = -d_zz H, H_t even, real on the real axis, order one, H_t(iy) > 0.

**Zero ODE (Polymath Prop 3.1(i)).** Re-derived: at a simple zero z_k, z_k' = -d_tH/d_zH = H''/H'(z_k),
and with H = (z - z_k)G this is 2G'/G(z_k) = 2 sum_{j != k} 1/(z_k - z_j). No reality or simplicity of
the other zeros is needed. Polymath's primed sum pairs z_j with -z_j; each paired term is O(|z_j|^-2),
so the series is absolutely convergent after that pairing and may be regrouped into conjugate pairs.
Sign: the own conjugate gives 2/(2iy) = -i/y, i.e. y' = -1/y + ..., motion toward the real axis. Correct.

**Lemma 2.5 (paired sums).** Correct. Order one gives sum |rho|^-2 < infinity; Hadamard gives
H'/H = c + sum [1/(z-rho) + 1/rho] with absolutely convergent sum; c is real because the zero set is
conjugation-symmetric and H is real on R; 1/rho + 1/conj(rho) is real. So Im H'/H(z) = sum Im 1/(z-rho),
absolutely convergent, with -Im of a pair a +- ib equal to K_h(x-a, b) and h/(d^2+h^2) = K_h(d,0)/2 for a
real zero. Termwise h-derivatives are justified by locally uniform convergence for h above the zero
strip. Checked numerically on the actual H_0 (below): no extra constant.

**Pair kernel algebra.** K_h(d,b) is -Im[1/(d+i(h-b)) + 1/(d+i(h+b))]. Own-pair closed form (31)
re-derived: numerator (h-y)(a^2+(h+y)^2) + (h+y)(a^2+(h-y)^2) = 2h(h^2+a^2-q); denominator
(a^2+h^2+q)^2 - 4h^2 q = (h^2+a^2-q)^2 + 4a^2 q. Jet own pair uses K_p(0,y) = 2p/(p^2-q). Both correct.

**Lemma 2.6 (boundary => strip, with atom).** Correct.
- Each K_h(d+a, b), h > y, is a sum of a holomorphic and an antiholomorphic function of w = d+ib with
  poles at -a +- ih outside the closed strip: harmonic, bounded, continuous on |b| <= y, even in b,
  -> 0 as |d| -> infinity. Same after d/dh. So g = R/2 is the bounded harmonic extension of its
  boundary values, and bounded harmonic functions on a strip with given continuous bounded boundary
  data are unique.
- Fourier check: FT_d[(y-+b)/(d^2+(y-+b)^2)] = pi e^{-(y-+b)|xi|}, so FT[K_y(.,b)/y] =
  (2 pi/y) e^{-y|xi|} cosh(b xi). FT[2/(d^2+4y^2)] = (pi/y) e^{-2y|xi|}; adding the atom (pi/y) and
  multiplying by cosh(b xi)/cosh(y xi) gives (pi/y)(1+e^{-2y|xi|}) cosh(b xi)/cosh(y xi) =
  (2 pi/y) e^{-y|xi|} cosh(b xi). Identity holds.
- The two-edge strip Poisson kernel (inverse FT of cosh(b xi)/cosh(y xi)) is
  (1/y) cos(pi b/2y) cosh(pi d/2y) / (cosh(pi d/y) + cos(pi b/y)) > 0. Hence
  K_y/y = P[2/(d^2+4y^2)] + (pi/y) Pois >= P[2/(d^2+4y^2)] >= P[g(.,y)] = g = R/2 in the interior.
- Boundary points b = y, d != 0: K_y(d,y) = 2y/(d^2+4y^2), and the claim is exactly hypothesis (32).
- Units: (32) is R/2 <= 2/(d^2+4y^2), Thm 3.4 states R <= 4/(d^2+4q). Same inequality. The inequality is
  used in the direction proved (lower bound on K_y, entering q' with a negative coefficient).
- Signed weights are harmless: positivity is applied to the defect 2/(d^2+4y^2) - g(.,y) >= 0 of the
  whole signed sum.

**Prop 2.7 (current inequality).** Correct. Im of the ODE: y' = -1/y - 2 sum_other K_y(d,b) (real zeros
half weight), q' = 2yy' = -2 - 4y sum_other K_y. Lemma 2.5 gives J = O_pair(q) + sum_other R(d,b) with the
same pairs and weights. Lemma 2.6 pairwise (all other zeros have |b| <= y; the only excluded point
d = 0, b = y is the contact itself, which is simple) and absolute convergence give
q' <= -2 - 4y (y/2) sum_other R = -2 - 2q (J - O_pair). Mirror zeros at -x +- iy (evenness) are ordinary
"other pairs" with d = 2x, b = y, covered by the boundary case. Multiple real or nonreal other zeros are
covered (multiplicity in both sums). The J of Prop 2.7 is the same object as in Thm 3.1
(S_t = -Im H_t'/H_t = d_h log|H_t|; tex line 1026).

**Lemma 2.8 (compactness).** Correct as a citation. Polymath Thm 1.5(i) as rendered on ar5iv
(arXiv:1904.12438): for 0 < t <= 1/2 and C a large absolute constant, "if x >= exp(C/t) and
H_t(x+iy) = 0 then y = 0". For t in [tau, T], exp(C/t) <= exp(C/tau), so nonreal zeros have
|Re z| <= exp(C/tau), and |Im z| <= 1 by de Bruijn from t = 0. The bound degenerates as t -> 0; the
paper avoids this by starting the contact argument at tau = 1e-14 > 0 and covering [0, tau] by de Bruijn.
The supremum-at-infinity failure mode is handled. C is not effective and need not be.

**Eq (39)-(40) and Lemma 2.9 (no repeated nonreal contact).** Correct. H_{t0-eps} = exp(eps d_zz) H_{t0}
(the well-posed direction); exp(eps d^2) w^m at w -> sqrt(eps) w equals eps^{m/2} p_m(w) with p_m as in
(39); terms of order > m are O(eps^{(m+1)/2}) locally uniformly. Identity (40) checked algebraically
((i sqrt2)^{2k} (-1)^k / 2^k = 1). He_m has simple real roots, a positive one for m >= 2, so p_m has the
simple root i sqrt2 lambda; Hurwitz/Rouche gives a zero of H_{t0-eps} at z0 + i sqrt(2 eps) lambda +
O(eps). Its height exceeds Y(t0) + c sqrt(eps) while Y(t0-eps) = Y(t0) + O(eps): contradiction with a
strict earlier barrier. Nothing requires z0 real. In the application the barrier to the left of a
contact is one smooth arc with Q >= l > 0 (Lemma 4.1), so sqrt Q is Lipschitz; a contact cannot sit at
the first instant after a reset (see below).

**Thm 2.10 (global comparison).** Correct. Details checked:
- Attainment. Let t* = inf of violation times in [tau, T]. Violating zeros are nonreal, lie in the compact
  rectangle of Lemma 2.8, so a subsequence converges to a zero of H_{t*} (joint continuity) with
  Im^2 >= lim Q(t_n). A strict overshoot at t* (relative to the closed incoming arc) would persist to
  slightly earlier times by Hurwitz, contradicting minimality; t* = tau is excluded by strict startup
  separation. So at t* some zero has Im^2 = Q_incoming(t*), every zero has Im^2 <= Q_incoming(t*), and
  all zeros are strictly below Q on [tau, t*). No maximum is differentiated and no limit is interchanged
  with a maximum.
- Resets. If t* is a join, the limit from the right gives Im^2 >= q_1 >= Q_prev(delta), which is a
  contact or overshoot of the closed incoming arc at its right endpoint; so every contact is on a closed
  incoming arc at a time strictly after that arc's start, and the left barrier is smooth.
- Location. The contact is nonreal (Q > 0), not on the imaginary axis (eq (12)); by evenness take x > 0;
  Prop 2.4 (valid since T < 41/250) gives x > X.
- Contradiction. Simple by Lemma 2.9; the branch z(t) is analytic near t*; q(t) < Q(t) before and
  q(t*) = Q(t*) give q'(t*) >= Q'(t*-). Prop 2.7 with J >= B_a, O_pair(q) <= O_a, q > 0, r < 2(B_a - O_a)
  gives q'(t*) < -2 - r q = Q'. The closed-cell and closed-cap statements of Thm 3.1/3.4 are what make the
  right endpoint of an arc and a row knot legitimate; they are stated closed, and the packet checkers
  (read, not run) require q_interval[0] = 0, h^2 > cap, |shift| <= 39/20.
- Well-posedness of J at the contact: all zeros have height <= y = sqrt q <= sqrt c_i < every probe height.

**Lemma 4.1.** e^{-ru} >= 1 - ru gives Q(u) >= q_0 - (2 + r q_0)u >= l > 0; then Q' = -2 - rQ < 0 and
Q <= q_0. Correct.

**Lemma 4.2.** For a contact at t_0 + u, 0 < u <= delta: t in [a_i, b_i], q = Q(u) in [l, q_0] subset of
(0, c_i]; S_i nondecreasing (A_i >= B_i) gives S_i(t) >= S_i(t_0) >= s; O_pair,i nondecreasing gives
O(q) <= O(q_0) <= o; so 2(S - O) >= r + eta and q' <= -2 - (r+eta) q < Q'. Correct, monotonicities used
in the right directions.

**Startup (4.4).** For t <= tau: zeros have q <= 9/16 - 2t (de Bruijn from t = 0), Q(t) >= q_init -
(2 + r_0 q_init) t, gap >= 1e-12 - r_0 q_init tau. Recomputed exactly with fractions: equals the printed
rational, 9.3036e-13 > 5e-13; tau < 1/2048000. So the barrier is strict on all of [0, tau].

**Lemma 2.11 / Cor 4.5.** de Bruijn (Polymath Thm 3.2: no zeros above y_0 at t_0 implies none above
sqrt(max(y_0^2 - 2(t - t_0), 0)) later, and Lambda <= t_0 + y_0^2/2), applied at t_0 = T, y_0 = sqrt(q_T).
T + q_T/2 = B* exactly (recomputed). Consistent with the own-conjugate term q' <= -2 of the ODE. Correct.

## Failure modes looked for

| Failure mode | Finding |
|---|---|
| Bound proved on an open range, used at an endpoint | Not found. Interior strip inequality is extended to b = y, d != 0 by the hypothesis itself; kernel and monotonicity are certified on closed [0, c_i] while contacts have q >= l > 0; cells and arcs are closed on the incoming side; Thm 1.5(i) is used only for t >= tau > 0. |
| Supremum attained at infinity | Handled by Lemma 2.8 (non-effective constant is enough). |
| Real-zero collision / multiple zero not covered | Other zeros may be real, repeated or nonreal: the ODE and both sums carry multiplicity. A repeated contact zero is excluded by Lemma 2.9. Real collisions inside |x| <= X belong to Prop 2.4 (R2). Outside, forward flow cannot create a nonreal zero at height >= sqrt Q > 0 without a continuous approach, which is the contact case. |
| Interchange of limit and maximum | Not made; the argument works with a convergent sequence of zeros. |
| Remainder bound valid only for large argument | None in R3 (Lemma 2.5 uses only order one). |
| Appeal to an earlier preprint | None in R3. External inputs: Polymath Prop 3.1(i),(ii), Thm 1.5(i), Thm 3.2; (i) and the backward part of (ii) were re-derived here, Thm 1.5(i) and Thm 3.2 are cited. |
| Inequality used in the wrong direction | Not found (K_y lower bound, J lower bound, O_pair upper bound, S_i and O_i monotone in the directions used). |
| Units / factor 2 | (32), (33), (36), (38), Thm 3.4 agree: q' = -2 - 4y sum K, K >= (y/2)R, R <= 4/(d^2+4q). |

## Corrections (none changes the result)

1. Eq (28) defines K_h(d,b) for h > b, but Lemma 2.6 and Prop 2.7 use K_y(d,b) at b = y. State that for
   b = y, d != 0 the first term is 0 and K_y(d,y) = 2y/(d^2+4y^2).
2. Lemma 2.6: the claim "K_y/y is the Poisson extension of the density plus atom" is justified only by a
   Fourier-multiplier line. A complete proof should state the kernel
   (1/y) cos(pi b/2y) cosh(pi d/2y)/(cosh(pi d/y) + cos(pi b/y)) (positivity is then visible) and cite
   uniqueness of bounded harmonic functions on a strip. The identity is true (checked to 1e-27).
3. Prop 2.7 should list among its hypotheses that all probe heights exceed y and that (32) holds at this y
   (it says only "satisfies (33)"), and should say that the excluded point d = 0, b = y cannot occur among
   the other zeros because the contact is simple.
4. Lemma 2.9 / Thm 2.10: say explicitly that a contact cannot occur at the first instant of an arc (strict
   separation survives an upward reset), which is what makes the left-Lipschitz hypothesis of Lemma 2.9
   hold with a single smooth arc. The argument is present but split between sec 2.4 and sec 4.2.
5. Thm 2.10 quotes Polymath Prop 3.1(i) "with the symmetric summation prescribed there"; add the one line
   that after pairing +-z_j the series is absolutely convergent, so regrouping into conjugate pairs is
   legitimate (Lemma 2.5 proves this only for H'/H at non-zeros; the same proof applies).
6. "Theorem 2.1 is used twice": it is used four times (startup, the rectangle of Prop 2.4, Lemma 2.8,
   cleanup). Polymath Thm 3.2 is one-sided (y > y_0); the two-sided form follows by conjugation.

## Numerical tests run (own code, local, `scripts/memcap.sh 8`, python -I, mpmath 1.4.1)

`scripts/R3/r3_checks.py` -> `runs/R3/r3_checks.log`; `scripts/R3/r3_xi.py` -> `runs/R3/r3_xi.log`.
Nothing from the packet was executed.

- A. K_y/y = P[2/(d^2+4y^2)] + (pi/y) Pois at 5 points (y from 0.01 to 0.75, b up to 0.98 y): relative
  error <= 1.4e-31; closed-form Poisson kernel against the inverse Fourier integral: <= 8.2e-28.
- B. Lemma 2.6 on 40 random signed functionals (1-6 nodes, value and d/dh nodes, mixed signs, shifts up
  to 1.95, y in {0.01, 0.05, 0.2, 0.5, 0.75}), weights rescaled so that the boundary inequality is tight
  on a d-grid: 42,504 interior points, max of (y/2)R/K_y = 0.99999 <= 1 (attained at b = 0.999 y).
- C. Polynomial model of the same heat equation (even real polynomial of degree 28 with a double real
  zero, three nonreal quadruples, one at the same height as the contact, mirror zeros): numerical zero
  velocity against 2 sum 1/(z - rho): difference 5e-17; q' against -2 - 4y sum K_y: 5e-17;
  J against O_pair + sum_other R: 4e-15; current inequality holds (q' = -6.275 <= -3.335); per-pair defect
  K_y - (y/2)R >= 3.9e-3 including the equal-height pairs.
- D. Repeated nonreal zero (m = 2, 3, 4) of an even real polynomial, backward times eps = 1e-4, 1e-6, 1e-8:
  exactly m zeros near z_0; the highest is at z_0 + i sqrt(2 eps) lambda_max with error/eps bounded
  (5.6, 8.2, 10.8); forward in time the split is horizontal with height change O(eps). Identity (40)
  checked for m = 2..7.
- E. Closed forms (31) and 2p/(p^2 - q) against the pair kernel: agree to 1e-25.
- F. Actual H_0 = xi((1+iz)/2)/8: -Im H_0'/H_0(x+ih) against the paired sum over the first 200 zeta zeros
  plus a smooth-density tail, at (x,h) = (20,1), (33.3,3), (57,6), (100,0.8): differences 6.5e-7 to
  4.7e-6 (tail sizes 8e-4 to 6e-3; the residual is the accuracy of the smooth tail). No constant term.
- G. Exact fractions: startup gap equals the printed rational; T + q_T/2 = B*; T < 41/250; Lemma 4.1 spot
  checks.

## Not checked

- Prop 2.4 (wall, Platt-Trudgian, continuation of reality), Thm 3.1 (source), the Bernstein certificates
  of Thm 3.4, Prop 4.3 (the 221,010 arcs), the 7/8 input: other referees' parts. R3's conclusion is
  conditional on all of them.
- Polymath Thm 1.5(i), Prop 3.1 and Thm 3.2 were read through an automated summary of the ar5iv rendering
  of arXiv:1904.12438, not from the published journal PDF; Thm 1.5(i) itself was not re-proved (its proof
  rests on Polymath's effective approximation for 0 < t <= 1/2).
- Uniform convergence in (39) for the actual H_t was argued (Gaussian convolution of an entire function,
  Cauchy estimates) and tested on polynomials, not tested numerically on H_t.
- The zero ODE and Lemma 2.6 were not tested on H_t with t > 0 (only on polynomials and, for Lemma 2.5,
  on H_0).
- The kernel and arc checkers were read only for the lines fixing the contact interval, pole and shift
  guards and the startup test; they were not run for this report.
