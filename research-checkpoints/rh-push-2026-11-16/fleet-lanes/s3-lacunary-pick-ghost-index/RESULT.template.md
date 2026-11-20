# s3-lacunary-pick-ghost-index: screening of four Pick / index / heat-fibre combinations

Date: 2026-11-19/20. Screening arm of the 7-day campaign. Single agent, no referee pass. No RH claim, no change to any bound.
Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (ball arithmetic on the stated finite matrix: every pivot ball
has a definite sign), MEASURED (floating point or midpoint arithmetic), ARGUED.

## 0. Verdict

Four combinations screened. Survivors: 0. All four are closed as "verified height in another form", and for (1)-(3) the
form is now quantitative (the counting law of section 2).

| # | combination | statistic | sizes reached | zeta | L(chi) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | lacunary Pick on 2^(k/m) | sign of LDL pivots of P = [(c_i + c_j)/(nu_i + nu_j)], c = F'/F; lambda_min of the normalised section | m = 1..64 full sections (n = 24m+1 up to 1537 nodes, nu <= 1.7e7, 460 to 21200 bits); first 260 to 520 nodes for m up to 256 | all pivots positive at every m (CERTIFIED finite sections); log2 lambda_min = -28 (m = 1) .. -5365 (m = 64) | chi_-4 and chi_5 (real, mod 5): all positive, m <= 18; chi_-4 also m = 28, 32 | T-NR: negative at m = 1 (zeros at height 2.86). E_a (a = 1/8, 1/4): negative at m = 2 (zeros from 14.13), positive at m = 1. DH: positive m <= 19, negative from m = 20 (law horizon 102..131 against the zero at 85.70). Heat tau = -0.5: positive at m = 4, 6, 8 (horizon below its zero at 111.69) | CLOSED. No control fails on a lattice whose law horizon is below its first off-line height |
| 2 | near-Muntz cones k^p | same pivots on nu_k = k^p | n = 1000 nodes at 11500 bits, p in {1, 1.05, 1.13, 1.25}; planted heights 30 .. 960 | positive to the last pivot decided (949 .. 996) | chi_-4: positive (300 nodes) | planted pairs: detected at n = 0.73 gamma .. 7.3 gamma, pivot bits 3.2 to 22 times pi gamma/(4 ln 2). DH: n = 235 (p = 1), 302 (p = 1.05), not within 400 (p = 1.13, 1.25). E_a: n = 9. T-NR: n = 4, 5 | CLOSED. No detection at n << gamma |
| 3 | negative index of K_{R_a} | number of negative LDL pivots of [(1 - R_i conj R_j)/(w_i + conj w_j)] on nested Halton nodes in a box; argument-principle count | boxes (0.05, 2] x [Y0 - Y, Y0 + Y], Y = 10, 20, 40, Y0 = 0, 1e3, 1e6; n up to 420, 1000 to 5000 bits | index 0 at every n decided (up to 420) | index 0 (n up to 319) | DH ghost at 85.70 appears from Y = 10 at n = 149 (pivot 2^-1164; 2000 bits suffice, 1000 do not), from Y = 20 at n = 148, from Y = 40 at n = 144 (2^-450). E_a: n = 7..9. T-NR: n = 4. Heat tau = -0.5 (zero at 111.69) from Y = 40: n = 121 (2^-711) | CLOSED. n equals the number of zeros within about 1.5 to 1.8 times the distance to the off-line zero |
| 4 | heat-fibre completion, anticausal energy | E_-(a; T) = norm^2 of P_-(chi_T R_a), FFT of boundary values | DH, E_a, T-NR, L(chi_-4): T <= 400; zeta: T <= 1e5 (1e7 samples, dt = 0.02), planted pairs gamma = 1e2 .. 4e5 | no reference value exists without the zeros | same | DH at T = gamma/4: excess 0.044 against a spread 0.28 (0.16 sigma); excess equals the step between two causal functions to 4 digits | CLOSED. First-order blind: the excess is odd under reflection of the pole |

## 1. Objects, code, validation

Objects (lib.py; definitions of DH, E_a, T-NR re-typed from the control battery, read as text). F(w) is the completed
function at s = 1/2 + w, even in w.

| code | object | off-line zeros used here |
|---|---|---|
| ZETA | xi(1/2 + w) (no factor 1/2) | none below the verified height |
| LCHI4, LCHI5 | completed L(s, chi_-4); completed L(s, chi) for the real even character mod 5 | none known (positive comparison) |
| DH | Davenport-Heilbronn, conductor 5, gamma factor (5/pi)^(s/2) Gamma((s+1)/2) | delta = 0.3085 at 85.699; 0.1508 at 114.163; 0.0744 at 166.479; 0.2243 at 176.702; 84 pairs below 2000 (battery table) |
| EA-1/8, EA-1/4 | xi(1/2 + w + a) xi(1/2 + w - a) | delta = a at every zeta ordinate, first 14.135 |
| TNR | xi times 3^s (1 + 2.2 * 3^(1/2 - s) + 3^(1 - 2s)) | delta = 0.4038 at (2k+1) pi/log 3: 2.860, 8.579, ... |
| HEAT-0.5 | int xi(1/2 + w + iy) exp(-y^2/|tau|) dy / sqrt(pi |tau|), tau = -0.5 (trapezoid rule; error modelled, not enclosed) | delta = 0.2430 at 111.694 (battery table) |
| PL:base:delta:gamma | base times (w^2 + lambda)(w^2 + conj lambda), lambda = (gamma - i delta)^2 | the planted quadruple +-delta +- i gamma |

Sign twists and the unimodular twist have no continuation on file to Re s <= 1 (battery README, limit 1) and no even
completed function; the four statistics here need F on both sides of the critical line (R_a) or F'/F as a zero sum, so
those two controls are not applicable. This is stated, not tested.

Pivot method (lib.schur_real, lib.schur_cplx). A Pick matrix P_ij = (u_i J u_j^*)/(w_i + conj w_j), J = diag(1, -1), has
displacement rank 2, and its Schur complements keep that form with u_i <- u_i - (P_ik/P_kk) u_k (CLASSICAL, generalised
Schur algorithm). All LDL pivots follow in O(n^2) ball operations. A pivot ball strictly negative after strictly
positive earlier pivots is a certified negative leading minor ratio, hence a negative eigenvalue; the number of
negative pivots (all pivots with definite sign) is the negative index of the section. Nodes are nested, so one run gives
the result for every leading section. When a pivot ball contains 0 the precision is doubled (combinations 1, 2) or the
run reports the largest n decided (combination 3).

Validation (validate.py, validate_em.py; both print PASS).
- Functional equation F(w) = F(-w) to 1e-117 at 400 bits for ZETA, DH, LCHI4, LCHI5, EA, TNR, planted; 1.7e-36 at 128
  bits for HEAT. DH, T-NR and HEAT vanish at their tabulated off-line zeros.
- Known margins (route 13 and b-lacunary-threshold): lambda_min of the normalised matrix on {4^k, k<=7}, {2^k, k<=14},
  {2^(k/2), k<=24}: xi 6.72e-4, 3.90e-9, 1.097e-21; DH 1.09e-2, 4.82e-6, 5.99e-15. Reproduced. The detection thresholds
  delta* = 0.161 (m = 4, gamma = 30) and 0.0122 (m = 5) of b-lacunary-threshold are bracketed (0.2 detected, 0.12 not;
  0.02 detected, 0.008 not).
- Inertia: Schur-recursion negative counts equal dense mpmath eigenvalue counts on 40 random complex nodes for ZETA (0),
  planted (2), TNR (11), EA-1/4 (11), DH near height 85 (1), for both the R_a matrix and the L matrix.
- E_-: R = 1 gives T; R = e^{-ict} gives (2/pi)[sin^2(cT)/c + T(pi/2 - Si(2cT))] to 5e-6 (pad 16); a Blaschke factor and
  its inverse agree with the direct double sum T - (1/2pi) int int sin(theta(s) - theta(t))/(t - s).

## 2. The identity behind combinations (1)-(3), and the counting law

**Gram form (CLASSICAL, Hadamard).** For F even with F'/F = L(w) = sum over zeros of 1/(w - rho) (symmetric grouping),

    (L(z) + conj L(w))/(z + conj w) = sum_rho k_rho(z) conj k_rho(w) (1 - 2 Re rho/(z + conj w)),   k_rho(z) = 1/(z - rho).

A zero on the line (Re rho = 0) contributes a rank-one positive kernel. For an off-line pair rho, rho' = -conj rho the two
terms add up to k_rho(z) conj k_rho'(w) + k_rho'(z) conj k_rho(w): rank two, signature (1, 1), with negative direction
k_rho - k_rho' (of size proportional to Re rho). So every Pick matrix of L is a signed Gram matrix over the zeros; the
same holds for the Schur form with R_a (model space of the Blaschke product over the zeros). An n-node section has
rank at most n.

**Counting law (MEASURED).** Let n* be the first n at which a leading section has a negative pivot. For node sets that
are confluent relative to the off-line zero (all nodes far from it), n* does not depend on the node geometry:

| planted on zeta, delta = 0.3085, gamma = | 15 | 20 | 30 | 40 | 60 | 85.70 | 120 | 170 | 240 |
|---|---|---|---|---|---|---|---|---|---|
| box (0.05,2] x [-10,10], R_a Pick, a = 0.1 | 11 | 13 | 21 | 35 | 65 | 101 | 154 | 235 | (not reached at 359) |
| box (0.05,2] x [-20,20] | 8 (inside the box) | 9 (edge) | 19 | 33 | 64 | 100 | 154 | 234 | 384 |
| box (0.05,2] x [-40,40] | (inside) | (inside) | 15 (inside) | 26 (edge) | 60 | 97 | 151 | 232 | 383 |
| real lattice 2^(k/64) (L Pick), node at detection | - | - | 21 (nu = 1.24) | - | 65 (2.00) | 101 (2.95) | 154 (5.24) | 233 (12.3) | 385 (64) |
| 2 N(H) = n* at H/gamma = | 2.35 | 1.96 | 1.71 | 1.77 | 1.77 | 1.69 | 1.63 | 1.57 | 1.61 |
| log2 of the negative pivot, box Y = 10 | -45 | -70 | -125 | -211 | -530 | -898 | -1559 | -2549 | - |

(N(H) = number of zeta ordinates in (0, H].) Further checks, all MEASURED:
- Box [3,4] x [-0.5,0.5] on the real axis (local_c3b.jsonl): gamma = 40 gives n* = 35, the same number.
- Box centred at height 30 with half-height 3: the pole at +40 (distance 10) appears at n = 13 and the pole at -40
  (distance 70) at n = 64. The count follows the distance from the cluster to the pole.
- Dependence on delta at gamma = 40: n* = 38, 35, 32, 27 for delta = 0.2, 0.3085, 0.49, 1.5. Dependence on a: 34 at
  a = 0.02 against 35 at a = 0.1.
- Toy function with no gamma factor and no arithmetic (toy_count.py): F = prod_{gamma_j <= H} (w^2 + gamma_j^2) times the
  quadruple at 85.70. n* = 25, 42, 61, 79, 87, 93, 97, 100 for H = 60, 86, 100, 120, 150, 200, 300, 600 (2 x number of
  ordinates = 26, 46, 58, 76, 104, 158, 276, 682). With few zeros n* is the rank of the positive part; it saturates at
  the value 101 of the true xi once H passes about 2 gamma. The count is set by the on-line zeros alone.
- Planted on L(chi_-4) at 85.70 (lattice m = 64): n* = 157; 2 N_chi(H) = 157 at H about 141 = 1.65 x 85.70
  (N_chi(H) = (H/2 pi) log(4H/2 pi e)). Planted on L(chi_5): n* = 166, H about 140 = 1.64 x 85.70.
- HEAT-0.5 with its own zero (0.243 + 111.69 i), box Y = 40: n* = 121, 123 (same integers and pivot sizes on the
  server and on the Mac); the zeta count 2N(H), which is also the total count for the heat family, reaches 121 at H
  about 175 = 1.57 x 111.69. A quadruple planted on zeta
  at the same position: n* = 138.
- DH with its own coefficients: n* = 149 (box Y = 10), 148 (Y = 20), 144 (Y = 40), 149..152 (real lattices
  m = 28..256). The number of DH zeros (both signs, battery table) reaches 149 at height 128 = 1.49 x 85.70. The second DH ghost (114.16,
  delta = 0.1508) appears at n = 220 = number of DH zeros below 175 = 1.54 x 114.16.

**Reading.** A section of order n can register the negative direction of an off-line pair at distance d from the nodes
only after n exceeds the number of zeros within about 1.5 d to 1.8 d (both signs of the ordinate). In the Gram form the
vectors k_rho restricted to a confluent node set are, to precision (r/d)^k in the k-th direction, in a common flag; the
positive rank-one terms of the nearer zeros fill the first directions and the negative direction of the far pair
becomes visible in the Schur complement only after them (ARGUED; the table is the evidence). The pivot at detection is
2^-B with B between 3 and 17 bits per node depending on the geometry (at gamma = 85.70: 8.9 for the box Y = 10, 5.3 for
Y = 40, 13.5 for the lattice m = 64).

Consequence for all three Pick-type combinations: a finite section that detects (or excludes) an off-line zero at height
gamma carries n >= 2 N(1.5 gamma) conditions at a precision of several bits per condition (3 n to 17 n measured).
Excluding a pair at height gamma this way costs as many conditions as there are zeros to height about 1.6 gamma
(ARGUED from the measured law): verified height at higher cost. Nodes at low height or to the right of Re s = 1 do
not change the count: DH at m = 256 is detected with 149 nodes in s in [1.5, 1.993] at pivot size 2^-2564.

## 3. Combination (1): lacunary Pick operator on 2^(k/m)

Finite consequence tested: for a control with first off-line zero at height gamma_1, a negative pivot on a lattice whose
law horizon T(h), T log(T/2 pi) = 2 pi^2 r_c/h (b-lacunary-threshold, r_c in [0.5, 0.7]), is below gamma_1. Survival
would need such a case together with positivity for zeta and L(chi) at every m.

Sections: nodes nu_k = 2^(k/m), k = 0..24m (nu up to 1.68e7), n = 24m + 1. Columns: sign of all pivots; for positive
cases log2 of lambda_min of the unit-diagonal section (inverse iteration on the LDL factors, MEASURED) or log2 of the
smallest normalised pivot ("piv"); for negative cases the index and node of the first negative pivot and its log2 size.

C1TABLE

Readings.
1. ZETA, LCHI4, LCHI5: every pivot positive at every m run (CERTIFIED for these finite sections, subject to the
   correctness of this lane's unrefereed code; not a statement about the infinite operator). log2 lambda_min for zeta:
   -28, -70, -169, -403, -957, -2269, -3755, -5365 at m = 1, 2, 4, 8, 16, 32, 48, 64 (about -28 m^1.27). Ball arithmetic needed
   about 330 m bits.
2. T-NR fails at m = 1, E_a at m = 2: their zeros (2.86 and 14.13) are below the horizons (15.6..18.5 and 22.4..27.2).
   E_a passes at m = 1.
3. Planted quadruple on zeta at the DH position: first failure at m = 14 (horizon 78.8..100.6), inside the law's
   window m in [11.2, 15.7].
4. DH with its own coefficients: positive for every m <= 19 (m = 19 on the first 400 nodes, nu <= 2^21), negative from
   m = 20 on (m = 20, 21, 24, 28, 32, 40, 48, 64, 96, 128, 256 run). Law horizon at m = 19: 98..126; at m = 20: 102..131.
   DH needs a finer lattice than the law predicts for a planted zero on zeta (its positive part is larger: conductor 5).
   The law is conservative for DH; there is no m with a DH failure and horizon below 85.70 (that would need m <= 11 at
   r_c = 0.7 or m <= 15 at r_c = 0.5).
5. For m >= 28 the first negative index k is 148..151 for DH and 100 for the planted quadruple (n* = k + 1),
   independent of m:
   the counting law of section 2. The node at detection moves down (42, 25, 13, 8.6, 5.0, 2.9, 2.2, 1.49 for
   m = 28..256) while the pivot shrinks (2^-587 .. 2^-2564).
6. HEAT-0.5 (first off-line zero 0.243 + 111.69 i): every pivot positive at m = 4, 6, 8 (97, 145, 193 nodes; 1900,
   2600, 3400 bits; smallest normalised pivot 2^-75.7, 2^-123.8, 2^-176.0, against 2^-75.5, 2^-123, 2^-176 for zeta).
   The horizons 34..42, 44..55, 53..67 are below 111.69, so the law predicts positivity and it holds. m >= 12 not run:
   one node value is a quadrature of 500 to 1000 values of xi at full precision (about 13 core-hours for m = 12).

Classification: CLOSED. The source law holds for m > 6 and with the controls' own coefficients. Detection is a zero
count (section 2), i.e. verified height.

## 4. Combination (2): near-Muntz cones nu_k = k^p

Finite consequence tested: first negative pivot at n nodes with n << gamma for a control or planted pair; precision at
detection against pi gamma/(4 ln 2) (the size of log2 |xi| decay at height gamma).

C2TABLE

Readings.
1. Zeta and L(chi_-4): every pivot positive up to the last index decided at the stated precision (949 to 996 of 1000
   for zeta, 300 of 300 for L(chi_-4)). The pivots decay by 3.3 to 4.1 bits per node.
2. A planted quadruple at height gamma is detected at n = 0.73 gamma .. 7.3 gamma nodes; n/gamma grows with gamma and
   with p (p = 1: 0.73, 1.30, 1.45, 1.67, 1.83, 2.35, 2.61 at gamma = 30 .. 340; p = 1.25: 0.90, 3.55, 7.28 at
   gamma = 30, 60, 85.70). There is no case with n << gamma. The node at detection is above gamma in every case
   except gamma = 30 (p = 1, 1.05).
3. With n = 1000 the largest planted height detected is 340 (p = 1), 240 (p = 1.05), 170 (p = 1.13), 85.70
   (p = 1.25). The heuristic horizon T_p of the source (which passes 3e12 near p = 1.13) is a statement about the
   infinite cone; a finite section sees less than n/1.5, and a sparser cone sees less at equal n. The complete set
   p = 1 (where all sections together are equivalent to RH, Theorem M of b-lacunary-threshold) is the most
   efficient of the family and still needs more nodes than the confluent count 2N(1.6 gamma) of section 2
   (124 against 101 at gamma = 85.70).
4. DH with its own coefficients: detected at n = 235 (p = 1, node 235 = 2.7 gamma, pivot 2^-960) and n = 302
   (p = 1.05, node 402, 2^-1184); not detected within 400 nodes for p = 1.13 and 1.25. E_a (zeros from 14.13) is
   detected at n = 9, T-NR (2.86) at n = 4 or 5.
5. Precision: log2 of the pivot at detection is 3.2 to 22 times pi gamma/(4 ln 2); the ratio grows with gamma and p.
   Precision does substitute for height, at a worse rate than the height itself.

Classification: CLOSED.

## 5. Combination (3): negative index of K_{R_a}

Finite consequence tested: index > 0 for a control with all nodes at |Im w| <= Y far below gamma_1, at n and precision
that do not grow like the zero count.

C3TABLE

Second detector (winding.py, argument principle on the box boundary, 128-bit Arb, sampled phase): DH, a = 0.1: count 0
for Y = 10, 20, 40, 80; 2 for Y = 100; 6 for Y = 200. Zeta: 0 for Y = 10, 40, 100. Planted on zeta at 85.70: 0 at Y = 40,
2 at Y = 100. This detector (and the Birman-Krein shift on the same window, which is the same winding) counts poles
inside the box only: it sees nothing below gamma_1 by construction.

Readings.
1. Zeta and both L(chi): index 0 at every n decided, including boxes centred at 1e3 and 1e6.
2. DH from the box Y = 10 (all nodes at height <= 10, 76 below the zero): the pair at +-85.70 appears at n = 149, 150
   with normalised pivots 2^-1164, 2^-1261. A run at 1000 bits decides only 97 pivots and shows nothing; 2000 bits
   decides 175 and shows it. The next pair (114.16) appears at n = 220, 221. With a = 0.25 only the 85.70 pair is
   counted (n = 152, 153); with a = 0.4 the index is 0 through n = 324, as kappa(a) predicts.
3. The smallest n is the zero count of section 2 (149 = number of DH zeros below 128), not a function of the box. The
   box height changes the pivot size (2^-1164, 2^-992, 2^-450 at Y = 10, 20, 40) and the count by at most 5.
4. Comparison with the modulus 2.914 delta^2/gamma^3 = 4.4e-7 = 2^-21 (size of the perturbation of F'/F at real
   nodes): the detection happens at pivot size 2^-1164, in a direction where the positive part has decayed by 1140
   more bits. Precision, not node count alone, pays for the distance: about 13.6 bits per unit of gamma here against
   pi/(4 ln 2) = 1.13.

Classification: CLOSED. Index > 0 at Y << gamma_1 is real, but its price is n = number of zeros within about 1.5 gamma_1
and 3 to 11 bits per node; that is verified height at higher cost.

## 6. Combination (4): heat-fibre completion, anticausal energy

Definitions. R_a(it) = conj F(a + it)/F(a + it) is unimodular. P_+ = projection on boundary values of H^2(Re w > 0)
(Fourier support e^{-itx}, x > 0), P_- = 1 - P_+, E_-(a; T) = || P_-(chi_T R_a) ||^2 = T - (1/2 pi) int int_{[-T,T]^2}
sin(theta(s) - theta(t))/(t - s) ds dt for R_a = e^{i theta} (CLASSICAL). Boundary values from Arb at 96 bits on
t_j = (j + 1/2) dt; zero-padded FFT.

Two facts decide the test before any large run.
1. There is no closed-form "edge term". For causal R (RH case) E_- = || P_-(R chi_T^-) ||^2 with chi_T^- = P_- chi_T
   (norm^2 = T), and E_- = T - || P_+(R chi_T^-) ||^2 depends on the zeros through the model space of R. MEASURED:
   E_-/T = 0.74, 0.20, 0.15 for zeta at T = 25, 2.5e4, 1e5 (a = 0.1); 0.60 for L(chi_-4) and 0.61 for DH at T = 21.4. The
   value is not small and not universal.
2. Mirror identity (MEASURED to 3 or 4 digits, expected from first-order perturbation). Let beta be the Blaschke
   product that reflects the poles of R_a in Re w > 0 to zeros. g = R_a (poles), g beta (causal), g beta^2 (causal,
   reflected zeros doubled). For T below the first off-line height the three values of E_- are in arithmetic
   progression:

C4MIRROR

   The "excess over the causalised function" equals the step between two causal functions. The pole-specific part is
   the second difference: 2.9e-5 at T = gamma_1/4 for DH (a = 0.1), 2.5e-4 at gamma_1/2, order 1 only for T > gamma_1.

Sizes reached and the 5 sigma criterion (sigma = rms residual of E_-(a; T') about a line, T' in [0.8T, T], 33 windows,
computed on the causalised function; a proxy for what cannot be predicted without the zeros near the window edge):

C4TABLE

E_-(a; T) is smooth in a across a = delta (DH, T = 42.8: 5.828, 5.079, 4.129 at a = 0.30, 0.32, 0.35; the pole of R_a at
85.70 exists only for a < 0.3085). The residue X(rho - 2a)/X'(rho) indeed has no gamma-factor decay, but the windowed
function only sees its tail res/(it - w_0), which is smooth and of size 1/gamma on the window.

E_a and T-NR: the excess is large relative to the spread proxy already at T = gamma_1/2 (E_a: 0.43 against 0.0046)
only because the proxy is near 0 on a window that contains no zero of the causalised function; the mirror identity
holds there too (E_a at T = gamma_1/4: 0.1030 against 0.1027), so there is no separation from a causal function.

Classification: CLOSED. Fail criterion not met for DH or for planted pairs at any gamma (ratio 0.002 to 0.16 at
T = gamma/4, falling with gamma; for gamma >= 1e4 the ratio stays below 1 even at T = 1.5 gamma); where the proxy ratio is large (E_a, T-NR) the mirror identity shows that the excess is not specific to
a pole.

## 7. Not run, limits, weakest steps

- Combination (4): zeta with a = 0.2, 0.3 and the window T = 2.5e5 were queued on the server and stopped for time; the
  zeta windows T = 2.5e4 and 1e5 (a = 0.1) were computed on the Mac under the memory cap (2 and 15 minutes).
- The planned 2^30-point FFT at T = 1e8 on GPU 1 was not run. The limit is the boundary values, not the FFT: one value
  of xi(1/2 + a + it) costs 0.55 ms at t = 2.5e4 and more at larger t (Arb, 96 bits); 2^29 values at t up to 1e8 are
  outside the lane budget. The largest window is T = 1e5 (1e7 samples); its FFT (2^26 points) runs on CPU. No GPU job
  was started.
- Combination (2) asked for up to 2e4 nodes and planted heights to 1e6. The pivots decay by about 4 bits per node and
  ball arithmetic needs about 12 bits per node, so n nodes need about 12 n bits and one xi'/xi value at that
  precision costs seconds on the server; n = 1000 at 11500 bits was run (planted heights to 960, detected to 340).
  By the measured n/gamma > 1.4 for gamma >= 85, a planted pair at 1e6 would need more than 1e6 nodes.
- Combination (1): full sections to m = 64 for zeta (m = 64: 1537 nodes, 21200 bits); m = 128 (3073 nodes, about
  42000 bits) was started and stopped for time. L(chi_-4) full sections to m = 32, L(chi_5) to m = 18. DH on the first
  260 to 400 nodes for m >= 19 (it stops at its first negative pivot). Heat only at small m (cost of one node value).
- Combination (3): the planned 800-node runs at 10000 bits (third DH ghost, planted heights 340 and 480) were not run
  (DH values at that precision cost about 8 s each on the server).
- Sign twists and the unimodular twist: not applicable (section 1).
- Weakest steps. (i) The counting law n* = 2N(c d), c in [1.5, 1.8], is measured on nine heights and two base
  functions plus a toy; the flag argument is a sketch. (ii) HEAT values use a modelled, not enclosed, quadrature error.
  (iii) The sigma proxy of section 6 is ad hoc; the conclusion there rests on the mirror identity, not on sigma.

## 8. Files

Code: lib.py, run_pick.py (combinations 1, 2), run_index.py, winding.py (3), run_em.py, analyze_em.py (4),
toy_count.py, validate.py, validate_em.py, tabulate.py, jobs_*.sh (server units). Server data copied to server/:
c1.jsonl, c1c.jsonl, c1d.jsonl, c1h.jsonl, c2.jsonl, c3.jsonl, c4.jsonl, c4b.jsonl. Local: local_c1_heat.jsonl,
local_c3_heat.jsonl, local_c1.jsonl, local_c2.jsonl,
local_c3.jsonl, local_c3b.jsonl, winding.jsonl, toy_count.jsonl, local_c4_planted_T25000.jsonl,
local_c4_planted_T1e5.jsonl. Server lane directory: ~/rh-push/s3-lacunary-pick-ghost-index/ (units rh-s3lp-*, all
stopped at the end of the run; no unit and no process of this lane remains). Units stopped before completion:
jobs_c1a.sh (after m = 18; DH at m = 19, 20, 21, 24 came from jobs_c1d.sh and jobs_c1e.sh), jobs_c1b.sh (after m = 32), jobs_c1c.sh (before
m = 128), jobs_c2a.sh (replaced by jobs_c2c.sh at fixed precision), jobs_c3.sh (before the 800-node runs), jobs_c4.sh
(before zeta; zeta windows computed locally), jobs_c1e.sh / jobs_heat.sh (heat at m >= 12). jobs_c2b.sh was not started.
RESULT.md is generated from RESULT.template.md by gen_tables.py. Server use: 8 cores in total across the
units by CPU quota (11 cores for about 6 minutes when combination (3) started, before the quotas were lowered), peak
unit memory below 2 GB, no GPU.
