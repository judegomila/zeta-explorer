# s4-native-span-pick-weil-real-nodes: screening of four Pick / Weil / ladder combinations on real nodes

Date: 2026-11-20 (server clock). Screening arm of the 7-day campaign. Single agent, no referee pass. No RH claim, no
change to any bound. Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (ball arithmetic on the stated finite
matrix or series: every reported sign is the sign of a ball that excludes 0), MEASURED (float64 or midpoint arithmetic),
ARGUED.

## 0. Verdict

Four combinations screened. Survivors: 0.

| # | combination | statistic | sizes reached | zeta | L(chi) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | Weil form on span{e^(-nu t)}, real nodes s = 1/2 + nu > 1 accumulating at s = 1 | sign of every LDL pivot of P = [(c_i + c_j)/(nu_i + nu_j)], c = xi'/xi(s); inertia of the arch, pole and prime parts | zeta: n = 2000 nodes at 44000 bits (Chebyshev-distributed), 992 nodes at 34000 bits (geometric towards s = 1), 500 nodes at 11000 bits (dense in (0.5, 2.5)); controls: 60 to 400 nodes, 2400 to 8500 bits; three node sets (geometric towards s = 1, Chebyshev-distributed on (1, 3), dense in (0.5, 2.5)) | all pivots positive at every n decided (CERTIFIED finite sections) | chi_-4: positive to n = 400 (two node sets); chi_5: positive to n = 400 | DH: first negative pivot at n = 149 on all three node sets (also 150, 218, 219), the round-3 number. Heat tau = -0.5: n = 124 on all three. Heat tau = -0.1: positive to n = 200 (first off-line zero at 415.3). E_a: n = 8. T-NR: n = 4. Sign twists and the real unimodular twist: n = 2 to 7 | CLOSED. The first failing order does not depend on the node set; it is a count of zeros below a multiple of the off-line height. Sign twists fail early because the functional equation is missing, not for an arithmetic reason |
| 2 | admissible box of the n prime scalars Z_i = -zeta'/zeta(s_i) on {4^k} | exact interval of each Z_i keeping the form PSD; position of each control's vector; joint region along rays | n = 8 .. 40 on {4^k} (800 to 1200 bits); 2^k, 2^(k/2), 2^(k/4), Chebyshev to n = 96 | inside by construction; box of Z(1.5) is [-6.43 %, +0.0130 %], of Z(4.5) [-1.66 %, +54.0 %], independent of n from n = 12 | chi_-4 and chi_5: OUTSIDE the box and outside the joint region, own form PSD | DH, E_a, T-NR: outside, own form PSD (same status as L(chi)). Sign twists: outside, own form not PSD. Heat tau = -0.5: inside the joint region | CLOSED. With the gamma factor and pole matched, "vector inside the region" is the statement "own form PSD" (identity); with zeta's gamma factor it rejects the positive comparison as well. The region on {4^k} has non-empty interior of fixed size: non-arithmetic vectors pass |
| 3 | next-node Schur defect Delta_N(x) and one-point jets J_a^(d)(z*) | sign of Delta_N(x) on 48 real probes x in (0.03, 40) for every N; LDL pivots of the jet matrix of K_a at a real z* (Schur parameters) | defects: N to 500 (zeta), 400 (L(chi)), 240 (DH); jets: d = 400 at 12000 bits, (z*, a) = (1, 1/4), (1, 1/20), (4, 1/4), (1/4, 1/8); nine planted heights | all defects and all jets positive | positive (d = 400; N = 400) | DH: first negative defect at N = 148 (order 149), jets at d = 149 (a = 1/20), 152 (a = 1/4). Heat tau = -0.5: d = 227 at a = 1/4 (its first zero has delta < a). E_a: d = 8, 9. T-NR: d = 4. Planted pairs: d_first = 12, 13, 21, 34, 65, 101, 154, 234, 384 for gamma = 15 .. 240 | CLOSED. d_first grows with gamma_off (0.73 gamma at gamma = 15 to 2.08 gamma at gamma = 800); not independent of it |
| 4 | positive-real ladder; Poisson measure criterion (NNLS) | first step j with p_j <= 0; relative residual of the non-negative least squares fit of q(t) = 2 Re c(1/2 + it) by Lorentzians of half-width 1/2 | ladder: 500 steps (zeta), 400 (L(chi)), 240 (DH), 200 (heat), nodes dense in (0, 2); NNLS: zeta t <= 10000 (500 windows), L(chi), DH t <= 2000, heat t <= 300 | every p_j > 0 (CERTIFIED, 500 steps); NNLS residual <= 2.7e-8 in every window (MEASURED) | every p_j > 0; residual <= 1.1e-8 | ladder: same step indices as the Pick pivots (149 DH, 124 heat, 8 E_a, 4 T-NR, 2 to 7 twists). NNLS: DH fails in 64 of 100 windows = the 61 windows that contain an off-line ordinate plus 3 with one within 0.4 of the edge; passes all others at <= 3.8e-7. Heat tau = -0.5: fails in exactly the 7 windows containing an off-line zero. E_a, T-NR, sign twists: fail in every window. Real unimodular twist: fails only in the window containing t = 0 | CLOSED. The ladder is the Pick pivot sequence. The NNLS residual is a local detector of the off-line zeros inside the window: verified height in another form |

The pattern to beat stands: on all four statistics DH and the heat family fail exactly when the test has resolved their
first off-line zero (a zero count for the Pick-type tests, the window containing the zero for the Poisson test).

## 1. Objects, code, validation

Notation: F(w) = completed function at s = 1/2 + w; c(w) = F'/F(w); for zeta c = arch + pole + prime with
arch = psi(s/2)/2 - log(pi)/2, pole = 1/s + 1/(s-1), prime = zeta'/zeta(s) = -Z(s).

| code | object | off-line zeros (w-plane: delta + i gamma) |
|---|---|---|
| ZETA | xi(1/2 + w) | none below the verified height |
| LCHI4, LCHI5 | completed L(s, chi_-4); completed L(s, chi) for the real even character mod 5 | none known (positive comparison) |
| DH | Davenport-Heilbronn, conductor 5 | 0.3085 at 85.699; 0.1508 at 114.163; 0.0744 at 166.479; 0.2243 at 176.702; 84 pairs below 2000 (battery table) |
| EA-1/8, EA-1/4 | xi(s + a) xi(s - a) | delta = a at every zeta ordinate, first 14.135 |
| TNR | xi times 3^s (1 + 2.2 * 3^(1/2 - s) + 3^(1 - 2s)) | 0.4038 at (2k+1) pi/log 3: 2.860, 8.579, ... |
| HT:-0.5, HT:-0.1 (HEAT-0.5, HEAT-0.1 by quadrature) | backward heat: E[xi(1/2 + w + iY)], Y normal with variance abs(tau)/2 | tau = -0.5: 0.2430 at 111.694, 0.1981 at 150.692, 0.2610 at 169.612, 0.3377 at 185.507. tau = -0.1: first 0.0216 at 415.256 |
| SGNLIOU | xi(s) zeta(2s)/zeta(s)^2: Lambda(n) -> lambda(n) Lambda(n), zeta's gamma factor and pole term kept | no functional equation |
| SGNP:2, SGNP:2,3,5,7, SGNR:7:100, SGNR:8:10000 | xi(s) times prod (1 - p^-s)/(1 + p^-s) over p = 2; p <= 7; a random half of the primes <= 100 (python random seed 7); <= 10000 (seed 8) | no functional equation; every Euler factor changed is exact |
| WTRE | xi(s) sqrt(zeta(s + i alpha) zeta(s - i alpha))/zeta(s), alpha = 1.2393168126993495: Lambda(n) -> cos(alpha log n) Lambda(n) | no functional equation |
| PL:base:delta:gamma | base times (w^2 + lambda)(w^2 + conj lambda), lambda = (gamma - i delta)^2 | the planted quadruple |

Controls and their form. For DH, L(chi), E_a, T-NR, heat the form is the Pick matrix of the object's own c (own gamma
factor, own pole term). The sign twists and the unimodular twist exist only as a prime side: the form is zeta's arch +
pole with the twisted -L'/L, all exact for s > 1 (finite or closed-form Euler factor changes; the random twists of the
battery over all primes up to 1e7 are not used because their values are not available to the precision a Pick section
needs). The complex unimodular twist zeta(s + i alpha) with its own completion is zeta at the nodes nu + i alpha (a
translate; s3 covered complex nodes for zeta); the control used here is the real twist WTRE with zeta's completion.

Files (this directory): `lib.py` (copied from s3-lacunary-pick-ghost-index, one fix, see below), `lib2.py` (new objects,
node families, Schur recursion with probes, jets, ladder), `run1.py` (combinations 1, 3a, 4a), `run1_split.py`,
`run2_box.py`, `c2_extra.py`, `run3_jets.py`, `run4_nnls.py`, `zt.py` (Taylor evaluation with enclosed tail; tested, not
used for the reported numbers), `helper.py`, `validate.py`, `job*.sh`, `tab.py`, `tab2.py`; outputs in `server/*.jsonl`
(server runs), `local_split.jsonl`, `c2_extra.jsonl` (local, through `scripts/memcap.sh 8`).

Node families: `acc:m` nu_k = 1/2 + 0.99 * 2^(-k/m) (geometric, accumulating at the left end nu = 1/2, s = 1);
`chebv:1/2:5/2` nu_k = 1/2 + (1 - cos(pi v_k)), v_k the van der Corput sequence (nested, Chebyshev-distributed on
(1/2, 5/2), accumulating at both ends); `lad` a_1 = 1, a_k = (2 - sqrt(2)/1000) v_k (dense in (0, 2), includes s < 1);
`geo:m` 2^(k/m); `four` 4^k.

Fix to the copied `lib.schur_real`: the pivot was normalised by P_kk = c_k/nu_k, which reverses the reported sign when
c_k < 0. It is now normalised by abs(P_kk). The s3 lane's objects have c > 0 on the positive axis, so its tables are not
affected (not re-run here). In this lane c < 0 occurs for the parts of the split (section 2) and the hybrid forms of
section 3; all numbers reported below were produced after the fix.

Validation (`validate.py`, prints ALL PASS on the Mac and on the server):
- arch + pole + prime = xi'/xi to 1e-100; the Dirichlet-series scalars Z of SGNLIOU, SGNP:2,5, WTRE and DH against
  direct sums over prime powers (1e-12).
- Heat by Taylor data (HT) against heat by quadrature (lib.Heat) at w = 0.3, 1.7, 2.4: relative difference < 1e-60.
- Probe defects Delta_N(x) against dense Schur complements (arb_mat solve), signs equal on T-NR (6 base + 3 probes).
- Ladder: first p_j <= 0 equals the first negative Pick pivot (T-NR: step 4, E_a: step 8, zeta: none in 40).
- Jets: signs of the Schur-algorithm pivots equal the LDL signs of the dense matrix I - T T^* (T lower-triangular
  Toeplitz of the Taylor coefficients of R_a in the disc variable) for zeta, T-NR and a planted quadruple, d = 10.
- Planted quadruple at gamma = 15 on zeta: first negative pivot at n = 11, the value in the s3 table.
- NNLS: a planted quadruple (delta = 0.3) gives residual 0.04 to 0.10 localised at t = gamma; delta = 0.03 gives 3.4e-5;
  delta = 0.003 is at the floor 5e-10 (section 5).

Precision. Pivots decay by 17 to 31 bits per node on these node sets (Chebyshev: 19.9 bits per node at n = 1000). Every
run raises the precision until every pivot ball has a definite sign. Heat by Taylor data: the truncation of the
derivative sum and of the Taylor polynomial is measured (last term below 2^-7700 relative at 7000 bits), not enclosed;
its results are MEASURED-with-ball-rounding, like the heat object of s3.

Compute. Server through `rhrun` only: units rh-s4np-{val,A,B,C,D,A2,A3,H,H2,H3}, at most 8 cores in total, largest
resident memory 0.5 GB; all units have exited (logs in `server/logs/`). The machine load was above 100 during the runs:
the 2000-node zeta values (44000 bits) took 58 minutes on 8 cores through a per-node cache shared by four units, the
Schur recursion 11 minutes. The geometric set was stopped at 34000 bits (992 of 1000 pivots decided) instead of being
recomputed at 41000 bits. No GPU stage was used: every statistic here is
either ball arithmetic or a 401 x 2698 float64 least squares per window.

## 2. Combination (1): Weil form on the native span, real nodes accumulating at s = 1

Nodes: np-pick-seam-pencil + pick-weil-native-span + arch-native-prime-jordan-product.

Finite consequence tested. If positivity of the Weil form on span{e^(-nu t)} carried content beyond zero counting, then
on node sets that accumulate at the left end of the admissible range (where the prime side is largest: Z ~ 1/(s-1)) a
control should produce a negative pivot at an order well below the order at which the same control fails on any other
node set (149 for DH in round 3). Survival: zeta positive at every n, every control negative at n much smaller than
its zero count explains.

Results (CERTIFIED unless marked).

| object | acc (geometric, to s = 1) | chebv on (1, 3) | lad, dense in (0.5, 2.5) in s |
|---|---|---|---|
| ZETA | positive for the leading 992 nodes of acc:60 (34000 bits; smallest normalised pivot 2^-34624; the ball of pivot 993 contains 0 at this precision; nodes down to s - 1 = 1.1e-5); n = 300 complete at 11000 bits | positive, n = 2000 (44000 bits; smallest normalised pivot 2^-42946.6, 21.5 bits per node; smallest node s - 1 = 1.2e-6); also n = 1000 at 21000 bits (2^-19941) | positive, n = 500 (11000 bits; smallest normalised pivot 2^-9595) |
| LCHI4 | positive, n = 300 (acc:25) | positive, n = 400 | positive, n = 400 |
| LCHI5 | - | positive, n = 400 | - |
| DH | first negative n = 149 at node nu = 0.5164; negatives 149, 150, 218, 219 (n = 240) | 149 at nu = 1.9822; 149, 150, 218, 219 | 149 at nu = 1.3194; 149, 150, 218, 219 |
| HT:-0.5 | 124; negatives 124, 125, 190, 191 (n = 200) | 124; same | 124; same |
| HT:-0.1 | positive, n = 200 | positive, n = 200 | positive, n = 200 |
| EA-1/8, EA-1/4 | 8 | 8 | 8 |
| TNR | 4 | 4 | 4 |
| SGNLIOU | 2 | 2 | 2 |
| SGNP:2 | 4 | 5 | 7 |
| SGNP:2,3,5,7 | 2 | 2 | 3 |
| SGNR:7:100, SGNR:8:10000 | 2 | 2 | 2 |
| WTRE | 2 | 2 | 2 |

Planted quadruples on zeta (delta = 0.3085), first negative pivot n*:

| gamma | 15 | 30 | 60 | 85.70 | 170 | 240 | 480 | 800 |
|---|---|---|---|---|---|---|---|---|
| acc:16, acc:60 | 11 | 21 | 65 | 101 | 233 | 384 | 901 | - |
| chebv | 11 | 21 | 65 | 101 | 233 | 384 | 901 | 1667 (pivot 2^-35107) |
| lad | 11 | 21 | 65 | 101 | 233 | 384 | > 500 | - |
| s3 lattice 2^(k/64) (for comparison) | - | 21 | 65 | 101 | 233 | 385 | - | - |

(gamma = 15, 30, 60 from the local runs at n = 256.) The orders are the same on every node set, including the two that
accumulate at s = 1 and the one that enters the strip on the real axis. The node at which the negative pivot appears
has no preferred position (DH: 0.5164, 1.9822, 1.3194).

Split into parts (`run1_split.py`, CERTIFIED, n = 48). Inertia (positive, negative) of the Loewner matrix of each part:

| node set | arch | pole | prime | arch + prime | pole + prime | total |
|---|---|---|---|---|---|---|
| acc:4 | (3, 45) | rank 2, (1, 1) | (45, 3) | (47, 1) | (46, 2) | (48, 0) |
| chebv | (7, 41) | (1, 1) | (43, 5) | (47, 1) | (44, 4) | (48, 0) |
| 2^(k/2) | (42, 6) | (1, 1) | (24, 24) | (47, 1) | (24, 24) | (48, 0) |
| 4^k | (46, 2) | (1, 1) | undecided past rank 14 (Z below the working precision) | (47, 1) | - | (48, 0) |

On every node set and every n tried (12, 24, 48) the form without the pole term has exactly one negative square and the
rank-two pole term removes it. Near s = 1 the prime part is mostly positive and the arch part mostly negative; on sparse
sets the roles are exchanged. The pole part is 2w/(w^2 - 1/4): signature (1, 1) (PROVED, two-term kernel).

Why the twists fail at n = 2 to 7 (mechanism PROVED for the cases stated, orders CERTIFIED). SGNLIOU and WTRE: with
zeta's pole term kept and a prime side whose pole at s = 1 has another residue (-1 becomes +1 for lambda(n) Lambda(n),
0 for the cosine twist), c has a pole at w = 1/2 with positive residue inside the right half-plane; the kernel of
1/(w - a), a > 0, is (1 - 2a/(x + y))/((x - a)(y - a)), which has at most one positive square. Finite sets of flipped
primes: c = xi'/xi + sum over the flipped p of log p/sinh(s log p); on Re w = 0, where Re xi'/xi = 0 by the functional
equation, the term of p equals -log p/sinh((log p)/2) (= -1.96 for p = 2) at t = pi/log p, so Re c < 0 at boundary
points and c is not positive-real. Both are failures of the balance between the prime side and the gamma factor and
pole (the functional equation); neither uses multiplicativity, and both are visible at any node set. The probes of
section 4 show the same: for SGNLIOU and WTRE c(x) < 0 on the real points x < 1/2 already at N = 0.

Reading. For objects with the functional equation (DH, heat, E_a, T-NR) the first failing order is a property of the
zero set, not of the node set: 149 = the round-3 value for DH (map rows P3, P7, S9), 124 for heat tau = -0.5 (s3: 121
to 123 from complex boxes), 101 for a pair planted at the DH position on zeta. Moving the nodes to the left end of the
admissible range changes the pivot sizes (2^-2921 at detection on acc against 2^-2172 on chebv for DH) and nothing
else. Classification: CLOSED, verified height in another form (a zero count), as in s3 combinations (1)-(3); the node
families of this lane were not covered there.

## 3. Combination (2): admissible box of the prime scalars on {4^k}

Nodes: ns-rigid-primes-enter-as-n-scalars + lacunary-cone-weil-positivity + odd-power-pick-signature.

Form: P(Z) = [(A_i + A_j - Z_i - Z_j)/(nu_i + nu_j)], A = arch + pole of zeta at s_i = 1/2 + 4^k, k < n.
Single-coordinate box (PROVED, rank-two perturbation): P(Z + t e_i) >= 0 iff 1/mu_- <= t <= 1/mu_+,
mu_+- = b +- sqrt(a d), a = e_i' P^-1 e_i, b = e_i' P^-1 g_i, d = g_i' P^-1 g_i, g_i = column i of the Cauchy matrix.
Joint region: the convex set {Z: P(Z) >= 0}; along a ray Z + theta dZ the exit point theta* is found by bisection on
certified LDL signs.

Finite consequence tested. If the n scalars carried arithmetic rigidity, the admissible region would shrink onto the
zeta vector as n grows, a control's vector would lie outside it while the control's own form (own gamma factor) is
still PSD, and the positive comparison L(chi) would not be rejected.

Box against n on {4^k} (CERTIFIED; relative to Z_i):

| n | Z(1.5) = 1.5052 | Z(4.5) = 0.0415 | Z(16.5) = 7.5e-6 | min over i of width/c_i |
|---|---|---|---|---|
| 8 | [-6.434 %, +0.01298 %] | [-1.660 %, +54.00 %] | [-9475, +2443] times Z | 0.1280 |
| 12, 16, 24, 32, 40 | [-6.431 %, +0.01297 %] | [-1.660 %, +53.98 %] | [-9467, +2441] times Z | 0.1280 |

For k >= 3 the box is larger than Z_k by factors 1e19, 1e77, ...: the form does not see the primes at s >= 64.5. The
box does not shrink with n: the region is fixed by the three nodes s = 1.5, 4.5, 16.5. On denser sets it stabilises in n
as well, at a width set by the density (relative half-widths at the first node): 2^k: [-8.8e-6, +7.4e-9] (n = 16 .. 40);
2^(k/2): [-9.8e-16, +3.9e-19] (n = 32, 48); 2^(k/4): [-2.0e-40, +3.4e-44] (n = 64, 96); Chebyshev on (1, 3):
1e-43, 1e-100, 1e-226 at n = 16, 32, 64 (no limit: the set is dense).

Position of the controls on {4^k}, n = 40 (identical from n = 12; CERTIFIED). "ratio" = (Z_c - Z)_i divided by the box
edge on that side, maximum over i; theta* = exit point on the segment from zeta's vector to the control's vector.

| control | Z_c/Z at s = 1.5, 4.5 | coordinates outside the box | max ratio | theta* | zeta's arch + pole with Z_c | own form |
|---|---|---|---|---|---|---|
| LCHI4 | -0.098, -0.168 | 0, 1 | 70 | 0.067 | 1 negative square | PSD |
| LCHI5 | -0.310, -0.901 | 0, 1 | 115 | 0.059 | 1 negative | PSD |
| DH | -0.049, 0.103 | 0, 1 | 54 | 0.068 | 1 negative | PSD |
| EA-1/8 | 2.18, 2.01 | 0, 1 | 9.1e3 | 1.1e-4 | 1 negative | PSD |
| EA-1/4 | 2.88, 2.05 | 0, 1 | 1.5e4 | 6.9e-5 | 1 negative | PSD |
| TNR | 1.38, 1.71 | 0, 1 | 2.9e3 | 3.5e-4 | 1 negative | PSD |
| SGNLIOU | -0.781, -0.932 | 0, 1 | 116 | 0.041 | 1 negative | the same matrix: 1 negative |
| SGNP:2 | 0.628, -0.480 | 0, 1 | 89 | 0.328 | 1 negative | the same matrix |
| SGNR:7:100 | -0.124, -0.874 | 0, 1 | 113 | 0.071 | 1 negative | the same matrix |
| WTRE | -0.110, 0.495 | 0, 1 | 30 | 0.061 | 1 negative | the same matrix |
| HEAT-0.5 (n = 8, 12; Z_c := A - c_own) | 1.0003, 1.042 | 0 | 2.4 | 17.1 | PSD | the same matrix: PSD |

Non-arithmetic directions from zeta's vector on {4^k}, n = 24 (`c2_extra.py`, CERTIFIED): the form stays PSD when the
prime 101 is removed entirely (theta* >= 1), when the prime 3 is moved to 3.1 (theta* >= 1), when 40 % of the prime 2
is removed (theta* = 0.402), when Lambda(n) is multiplied by 1 + 0.54 cos(log n), and when all of Z is scaled by
1 - 0.073. In the upward directions the margin is small (scaling by 1 + 1.3e-4; adding 6.4e-4 of a "prime" 2.5). On
2^k the same directions exit at 1.7e-5, 8.6e-9, 6.0e-4 (prime 2), 3.0e-3 (prime 101), 0.64 (3 -> 3.1).

Reading.
1. (PROVED, identity) When the gamma factor and pole term are those of the control, "the control's vector lies in the
   admissible region" is the statement "the control's own form is PSD". The box adds no test beyond combination (1).
2. With zeta's gamma factor and pole, the region rejects DH, and it rejects the positive comparisons L(chi_-4) and
   L(chi_5) in the same way (same coordinates, same number of negative squares, theta* within 15 % of DH's). What it
   detects is the mismatch between the prime side and the gamma factor and pole at s = 1.5 and 4.5 (the explicit
   formula balance), not zeros and not multiplicativity. The outcome "outside the box while the own form is PSD" occurs
   for DH and for genuine L-functions alike, so it is not a separation.
3. The heat control at tau = -0.5 (off-line zeros from height 111.7) lies inside the joint region on {4^k}.
4. On {4^k} the region contains an open set of vectors that are not Euler sums (a deleted prime, a non-integer
   prime). Consistent with the node statement "multiplicativity is not visible to any finite node set" (A1) and map
   row P18. On dense sets the region contracts at the rate of lambda_min, and membership to that accuracy is again
   the own-form test.
Classification: CLOSED (no separation; the lacunary region is open and not arithmetic).

## 4. Combination (3): next-node Schur defects and one-point jets

Nodes: schur-defect-screw-form + one-point-all-jets + eventual-psd-is-global.

(3a) Defects. Delta_N(x) = d(x) - v' P_N^-1 v is the pivot the point x would have as node N + 1. The Schur recursion
carries the probe data along, so one run gives the sign of Delta_N(x) for every N and all 48 probes
(x = 0.03 .. 40, including 19 probes inside the strip, x < 1/2). CERTIFIED (0 undecided probe balls in every run).

| object | base nodes | first N with a negative defect | probe | comparison: first negative pivot of the base set |
|---|---|---|---|---|
| ZETA | lad, N <= 500 | none | - | none |
| LCHI4 | chebv, lad, N <= 400 | none | - | none |
| DH | acc, chebv, lad, N <= 240 | 148 on all three | x = 0.030 first; | 149 |
| PL:ZETA at 85.70, 170, 240 | lad | 100, 232, 383 | x = 0.030 | 101, 233, 384 |
| EA-1/8, EA-1/4 | acc, chebv, lad | 7 | x = 0.030 | 8 |
| TNR | all three | 3 | x = 0.030 | 4 |
| SGNP:2 | all three | 2 or 3 | x = 4.7, 1.4, 4.0 | 4, 5, 7 |
| SGNLIOU, WTRE | all three | 0 (c(x) < 0 for the 19 probes x < 1/2) | - | 2 |

A free choice of the next point does not detect an off-line zero before the order at which the nested set detects it:
N + 1 = n* in every case with a functional equation. For the twists the probes gain one to four orders.

(3b) Jets. J_a^(d)(z*) is the d x d Taylor (jet) matrix of K_a(z, w) = (1 - R_a(z) conj R_a(w))/(z + conj w),
R_a(w) = F(w - a)/F(w + a), at z*. In the disc variable zeta (w = z*(1 + zeta)/(1 - zeta)) it is congruent to the
Taylor section of (D conj D - N conj N)/(1 - zeta conj eta); its LDL pivots are products of 1 - gamma_k^2 over the Schur
parameters gamma_k of N/D (CLASSICAL, Schur). All d <= 400 at 12000 bits, every pivot ball of definite sign (CERTIFIED;
heat MEASURED-with-ball-rounding, d <= 260 at 6000 bits).

| object | (z*, a) = (1, 1/4) | (1, 1/20) | (4, 1/4) | (1/4, 1/8) |
|---|---|---|---|---|
| ZETA | all 400 positive; max abs gamma_k = 0.999993 | all positive | all positive | all positive |
| LCHI4, LCHI5 | all 400 positive | all positive | - | - |
| DH | 152, 153 | 149, 150, 219, 220, 353, 354, 374, 375 | - | - |
| HT:-0.5 | 227, 228, 251, 252 | - | - | - |
| HT:-0.1 | positive to 260 | - | - | - |
| EA-1/8 | positive to 80 (delta = 1/8 < a: K_a is blind to it, as the divisor criterion says) | 9 | - | - |
| EA-1/4 | not defined (pole of F(w - a) data at the centre) | 8 | - | - |
| TNR | 4 | 4 | - | - |
| SGNLIOU, SGNR:7:100, WTRE | 2 | - | - | - |
| SGNP:2 | 6 | - | - | - |

Planted quadruples on zeta, first order d with a negative jet pivot (each planted pair gives exactly two consecutive
negative pivots):

| gamma (delta = 0.3085) | 15 | 20 | 30 | 40 | 60 | 85.70 | 120 | 170 | 240 |
|---|---|---|---|---|---|---|---|---|---|
| (1, 1/20) | 12 | 13 | 21 | 34 | 65 | 101 | 154 | 234 | 384 |
| (1/4, 1/8) | 12 | 14 | 22 | 36 | 66 | 101 | 155 | 236 | 385 |
| (1, 1/4) | 12 | 16 | 27 | 38 | 67 | 103 | 158 | 252 | 388 |
| (4, 1/4) | 13 | 16 | 28 | 38 | 67 | 103 | 158 | 252 | 388 |
| real-node Pick (section 2) | 11 | 13 | 21 | 35 | 65 | 101 | 154 | 233 | 384 |
| log2 of the negative jet pivot, (1, 1/20) | -59 | -72 | -147 | -286 | -644 | -1099 | -1820 | -2977 | -5295 |

Dependence on delta at gamma = 60: (1, 1/20): 63, 65, 68 for delta = 0.45, 0.3085, 0.1 and none in 400 for
delta = 0.03 < a; (1, 1/4): 65, 67 for delta = 0.45, 0.3085 and none for delta = 0.1, 0.03 (below a).

Fit of d_first against the off-line height. Own-function controls: T-NR (gamma_off = 2.86): 4; E_a (14.13): 8 to 9;
DH (85.70): 149 to 152; heat tau = -0.5 (111.69, delta = 0.243; at a = 1/4 the first visible zero is 169.6 or 185.5):
124 by the real-node Pick form, 227 by the jets at a = 1/4. Planted on zeta: d_first/gamma = 0.73, 0.65, 0.70, 0.88,
1.08, 1.18, 1.28, 1.37, 1.60 at gamma = 15 .. 240, 1.88 at 480 and 2.08 at 800 (Pick): d_first = 2 N(H) with H/gamma between 1.53
and 1.81 for gamma >= 30 (N = zeta zero count), the s3 counting law. DH at the same height needs 149 instead of 101
because DH has more zeros below 1.5 gamma (conductor 5). A survivor needed d_first independent of gamma_off; d_first
is an increasing function of it, superlinear, and the pivot to be resolved is 2^-(11 to 14 bits per order).

One point with all jets is the confluent limit of the node sets of section 2, and it follows the same law (map row S9
states the rule 2n + 1 for clustered nodes with node independence open: the three node sets of section 2 and the four
centres here give the same orders for DH). Classification: CLOSED.

## 5. Combination (4): ladder and Poisson measure criterion

Nodes: positive-real-ladder-step + poisson-measure-criterion + cayley-schur-trajectory.

(4a) Ladder (PR 47): L_0 = F'/F, p_j = L_(j-1)(a_j), L_j(z) = (z L_(j-1)(z) - a_j p_j)/(z p_j - a_j L_(j-1)(z)), run on the
values at the remaining nodes (ball arithmetic). The Cayley transform (1 - p_j)/(1 + p_j) is in the disc iff p_j > 0.
PROVED (Richards; checked in every run): the first j with p_j <= 0 is the first negative pivot of the Pick matrix of
L on (a_1, .., a_j). Nodes `lad`: a_1 = 1, then dense in (0, 1.9986).

| object | steps | first p_j <= 0 | remark |
|---|---|---|---|
| ZETA | 500 | none (CERTIFIED) | p_j in [2.8e-8, 1.7e7] |
| LCHI4 | 400 | none | |
| DH | 240 | j = 149 | off-line height 85.70 |
| HT:-0.5 | 200 | j = 124 | 111.69 |
| HT:-0.1 | 200 | none | 415.26 |
| PL:ZETA at 85.70, 170, 240, 480 | 500 | 101, 233, 384, none in 500 | |
| EA-1/8, EA-1/4 | 60 | 8 | 14.13 |
| TNR | 60 | 4 | 2.86 |
| SGNLIOU, SGNR, WTRE | 60 | 2 | no functional equation |
| SGNP:2; SGNP:2,3,5,7 | 60 | 7; 3 | no functional equation |

The ladder is the pivot sequence of combination (1) in another normalisation; it has the same step indices.

(4b) Poisson criterion. For an even F, c = sum over zeros of 1/(w - rho), and q(t) := 2 Re c(1/2 + it) =
sum of 2 b/((t - gamma)^2 + b^2), b = 1/2 - Re rho (w-plane). All zeros on the line gives
q(t) = int dmu(u)/((t - u)^2 + 1/4), mu = counting measure of the ordinates; an off-line pair contributes one
Lorentzian of half-width 1/2 + delta (representable) and one of half-width 1/2 - delta (not representable: its Fourier
transform exceeds e^(-abs(xi)/2)). Test: q on windows [t0, t0 + 20], step 0.05 (401 rows), fitted by non-negative
least squares with Lorentzians of half-width 1/2 at u in [t0 - 6, t0 + 26], step 0.0125, 136 far-field Lorentzians out
to 1.4e7 on both sides, and a non-negative constant (2698 columns). q from Arb at 128 bits (heat: quadrature at 160
bits); the least squares is float64 (scipy nnls): a SCREEN. Every reported failure below coincides with a tabulated
off-line zero of the control (battery tables, Newton-refined to 1e-47) or is a structural failure in every window; no
pass or fail rests on the float64 residual alone.

| object | range of t | windows | relative residual | failing windows (> 1e-6) |
|---|---|---|---|---|
| ZETA | 0.5 .. 10000.5 | 500 | median 8.5e-11, max 2.7e-8 | 0 |
| LCHI4 | 0.5 .. 2000.5 | 100 | median 9.4e-11, max 1.1e-8 | 0 |
| LCHI5 | 0.5 .. 2000.5 | 100 | median 8.1e-11, max 6.9e-9 | 0 |
| DH | 0.5 .. 2000.5 | 100 | clean windows <= 3.8e-7; failing 6.9e-4 .. 0.10 | 64: all 61 windows containing an off-line ordinate, and 3 with one within 0.4 of the window edge. First failing window [80.5, 100.5], residual maximal at t = 85.70. Smallest delta detected: 0.0159 (at 520.9) |
| HEAT-0.5 | 0.5 .. 300.5 | 15 | clean <= 9.9e-8; failing 0.027 .. 0.30 | 7: exactly the windows containing an off-line zero; first [100.5, 120.5], maximal at t = 111.70 |
| HEAT-0.1 | 0.5 .. 300.5 | 15 | max 3.2e-8 | 0 (first off-line zero at 415.3) |
| EA-1/8; EA-1/4 | 0.5 .. 200.5 | 10 | 0.020 .. 0.028; 0.11 .. 0.14 | all (an off-line pair at every zeta ordinate) |
| TNR | 0.5 .. 200.5 | 10 | 0.26 .. 0.44 | all (off-line zeros every 5.72) |
| SGNLIOU, SGNP:2, SGNR:7:100 | 0.5 .. 200.5 | 10 | 0.05 .. 0.70 | all (negative mass at the zeta zeros, resp. at the poles on Re s = 0) |
| WTRE | 0.5 .. 200.5 | 10 | 1.8e-2 in [0.5, 20.5], maximal at the edge t = 0.5; 2.7e-11 .. 9.7e-10 in the other nine | 1 |
| PL:ZETA at 5010.3, delta = 0.3, 0.03, 0.003, 0.0003 | the six windows around it | 6 each | 0.038, 3.4e-5, 5e-10, 5e-10 in the window containing it; floor in the other five | detected for delta >= 0.03 |

Reading. The residual is zero to the floor in every window that contains no off-line zero, for DH and heat as for zeta;
it is of order delta^2 in the window that contains one, and maximal at its ordinate. The fit is a local detector of the
half-width of each zero: it finds an off-line zero when and only when the window has reached its height (verified
height). It does not use primes. The real unimodular twist passes every window away from t = 0 (its singular set is
zeta's zero set translated by +-alpha with half masses, on the line), so this statistic does not even register the
missing functional equation except at the pole.
Classification: CLOSED.

## 6. What would have counted as survival, and what was found

| requirement | (1) | (2) | (3) | (4) |
|---|---|---|---|---|
| zeta passes at every size reached | yes | yes (by construction) | yes | yes |
| L(chi) behaves like zeta | yes | NO (rejected like DH) | yes | yes |
| DH fails well below its zero count / off-line height | no: n = 149 on every node set | no (own form PSD; rejection is the gamma-factor mismatch) | no: N = 148, d = 149 | no: step 149; first failing window contains 85.70 |
| heat fails early | no: 124; tau = -0.1 passes everything reached | no (inside) | no | no |
| uses all primes together | n scalars zeta'/zeta(s_i) | n scalars | all (through F) | all (through F) |

No survivor. The three weakest points of this record: (i) heat values come from Taylor data or quadrature with
measured, not enclosed, truncation; (ii) the NNLS stage is float64; its failures are tied to tabulated zeros, its
passes are residuals at a floor of 1e-8 and are not certificates; (iii) the random sign twists are finite modifications
of zeta (primes up to 100 or 10000), not the battery's twists over all primes up to 1e7.
