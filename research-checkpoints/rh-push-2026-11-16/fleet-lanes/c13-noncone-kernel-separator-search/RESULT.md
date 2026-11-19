# c13-noncone-kernel-separator-search: RESULT

Date 2026-11-19. Kind: compute (heavy lane), round 13, lane 6.
No statement about zeros of zeta is made. Requirement flags: R1 = R2 = R3 = R4 = false (section 7).
Labels: PROVED / CLASSICAL / MEASURED (float64, or "ball" where the python-flint ball excludes 0) / ARGUED / OPEN.

## 0. Verdict

**Outcome "none". In the registered dictionary D no functional takes one sign on the 24 positives and the opposite sign
on a battery member of each of the nine control classes; the held-out rule is therefore never reached. D is recorded
as a closed device class on the registered grid and draws (MEASURED), with the per-class table of section 3.**

| stage | functionals in the window | one-signed on all 24 positives (P2) | T-train (P2) | T-weak (P2) | full criterion (P2) | not excluded by float64, resolved in balls | left alive by the ball stage |
|---|---|---|---|---|---|---|---|
| registered grid (12 families) | 2,794,368 | 51,764 | 0 | 0 | 0 | 262,135 | 0 |
| registered random draws (1,600,000 draws) | 801,745 | 10,673 | 0 | 0 | 0 | 50,453 | 0 |
| adaptive stage (registered; 200 centres x 500 per family) | 1,177,053 | 459,547 | 0 | 0 | 0 | 2,633 | 0 |
| amendment A3 random draws (ten times the registered number) | 8,221,531 | 107,448 | 0 | 0 | 0 | 526,430 | 5 (zeta-only tier, below) |
| total | 12,994,697 | 629,432 | 0 | 0 | 0 | 841,651 | 5 |

Each functional was evaluated on 290 objects (24 + 24 positives, 26 battery control members, 9 x 24 held-out control
members). The favourable reading of PREREG section 5 gives 0 as well. With the real characters only (P1): 0 at every
tier in every stage.

What stands between D and a separator, in counts over all four stages (`tables/class_totals.json`):

1. **Positives = zeta and all primitive characters of conductor <= 13 (the registered set, P2).** Of the 629,432
   functionals with one strict sign on the 24 positives, **0 give the battery Davenport-Heilbronn function the
   opposite sign.** The backward-heat members are rejected by 400 (0.064%), and 17 functionals reject at least 23 of
   the 24 held-out heat members. The largest value, over all one-signed functionals, of the minimum over classes of
   the held-out opposite fraction is 2/24 = 0.083 (needed: 23/24).
2. **Positives = {zeta} alone (registered secondary tier P0).** 10,906,607 functionals have a strict sign on zeta;
   3,784 (0.035%) reject a battery heat member. Five functionals (all in the A3 draws: one D2-F2, four D2-F3) reject a
   battery member of every class and at least one held-out member of every class (T-train and T-weak, ball signs on
   all 290 objects). None meets the 95% rule (worst-class held-out fractions 0.042 to 0.167), and on each of them
   zeta's sign is shared by only 2 to 8 of the 24 training positives: they separate zeta from the L-functions as well
   as from the controls. Best min-over-classes held-out fraction with P0: 6/24 = 0.25.
3. **By family.** D1 (minors, kernel with polar terms): backward heat and theta^w are never rejected, for any of the
   three positive sets (0 of 1,523,842 with P0). D3a (minors, kernel without polar terms): E_a, backward heat and
   EIS-w are never rejected (0 of 2,305,985 with P0). On D3a zeta's sign depends on the order alone (order 2: -,
   order 3: -, order 4: +, on all 1,294,690 grid minors), and the three classes have the same signs.

Registered predictions (PREREG section 6):

| prediction | result |
|---|---|
| 1. No survivor | holds |
| 2a. T-NR passes D1 (pass fraction 1 on functionals one-signed on P2) | **false**: pass fraction 0.646 on the grid (0.654 and 0.657 on the two sets of draws); 30 of 30 sampled counterexamples confirmed in balls on the positives and T-NR |
| 2b. E_a passes D1 (same reading) | holds: 0 of 122,277 over all stages. With P0 instead of P2 it fails: 780,180 of 1,523,842 functionals one-signed on zeta reject E_a |

Controls of the search (section 5): kernel-level planted separator recovered; value-level planted rows recovered
(230 of 230); label shuffles: no survivor of the full criterion or of T-weak in 5,000 permutation-family runs,
a T-train survivor in 2 of them; float64 against balls: 0 disagreements in 69,577 float64-decided entries after
amendment A1 (1 wrong sign among 1,151 random pairs before it, which is why A1 exists).

A run of a different kernel, normalisation, object set or functional type does not extend this verdict (NOT-RUN).

## 1. Plan and what is new relative to the map

Map rows nearest: G4 (TP orders are a property of the Mellin coordinate and do not separate DH from Euler-product
L-functions: TP_5 and PF_5 of the odd sector and of kappa), G21 (T-NR as a Tate integral; no invariant hypothesis),
G23 (GHS and FK-cone separators are kernel-side positivity that the DH kernel satisfies), P40 (Laguerre / Turan sign
test on the torus), L4 (sign-change functionals of the local test vector), control rows DH, NR, HEAT, EA, EIS-w, DEL.
New here: (i) one search over a registered dictionary of non-convex functionals (minors of orders 2 to 4 of dilation
matrices; Turan-type expressions, also on Hecke-compensated kernels) run against all nine control classes at once, with
held-out members, shuffles and planted controls; (ii) the per-class table, which says which class closes which family;
(iii) the kernel "with polar terms" as an object for every class, including a definition for the heat family;
(iv) the refutation of the registered prediction for T-NR.

Order of work. PREREG.md was written before any code of this lane ran. Decisive first test locally (through
`scripts/memcap.sh 8`): kernel sanity checks, the kernel-level planted run, then the registered grid in float64: no
functional at T-train for P0, P1 or P2. A ball cross-check then found one wrong float64 sign; amendments A1 to A5
(PREREG section 10) were written before the server run; the server run executed the whole pipeline once from scratch
and every number in this file comes from it. The local trial outputs were deleted before the server run and are not
part of the record.

The grid alone needs minutes, so the heavy allowance was used for the ball stage and for ten times the registered
number of random draws (A3), not for a larger machine-hour count.

## 2. Objects and dictionary (PREREG sections 2 to 4; code `kern.py`, `objects.py`, `funcs.py`)

Kernel convention: Lambda(1/2 + z) = int (K(u) - polar terms) e^(zu) du, so n^(-s) acts as the shift
K(u) -> n^(-1/2) K(u + log n). Kpol = kernel with polar terms (zeta: e^(u/2) theta(e^(2u))); K3 = P(D) Kpol with P the
even polynomial killing the polar exponentials (zeta: D^2 - 1/4, the Riemann-Polya kernel).

- Positives (24 training): zeta; the 9 real and 14 complex (one per conjugate pair) primitive characters of conductor
  <= 13. Held-out (24): drawn by seed from the 132 pairs of conductor 14 to 40.
- Control classes, battery (training) members and 24 held-out members each, by fixed seeds: DH (battery DH = real part
  of the complex character kernel mod 5, coefficients (1, kappa, -kappa, -1, 0) reproduced; held-out: real and
  imaginary parts for other complex pairs, conductor 7 to 40, and (5, Im)); T-NR ((3, 2.2); held-out p0 in
  {2, ..., 13}, 2 < c < p0^(1/2) + p0^(-1/2)); E_a (1/8, 1/4; held-out a in (0.03, 0.47)); HEAT (tau = -0.1, -0.5;
  held-out -2 < tau < -0.02); SGN (battery seeds 00 to 05 and Liouville; 24 new seeds); U (battery seeds 00 to 05; 24
  new seeds); DEL/THIN (DEL-0.75, DEL-0.9, THIN-0.9; 24 new b); EIS-w (a = 0.2 + 3i, 0.1 + 5i; 24 new); theta^w
  (w = 1/2, 3; 24 new w in (0.25, 6) away from 1, 2, 4). The SGN arrays and the three greedy sets agree with the c12
  battery files (`meta.json`, field `info`).
- Not run: EA-1/2 (logarithmic polar term), WT, BEU.
- Conventions that enter the answer: for complex kernels the value is the real part of the functional on the complex
  kernel; for objects without a functional equation the n = 0 lattice term is kept untwisted in Kpol (K3 does not
  depend on it); character kernels are normalised to K(-u) = conj K(u) with Re omega > 0.
- D1: det[Kpol(u_i + log n_j)], orders 2 to 4, column sets in {1..13} (1079), nodes u_i = u_0 + ih + i^2 g.
  D2: F1 = k(u-h)k(u+h) - lam k(u)^2; F2 = k_mu'^2 - lam k_mu k_mu'' (k_mu = e^(mu u) k); F3 = 3x3 Hankel of
  k(u + jh); F4 = 3x3 Hankel of derivatives; F5 = the order-3 Turan expression of the Jensen cubic; each for k = K and
  k = (1 - p^(-1/2) D_p) K, p <= 13. D3a, D3b: the same with K3. All read points in [-2.6, 2.6].

## 3. Result tables

Full tables: `tables/per_class_tables.md` (per family, per positive set, per stage: counts, pass fractions, held-out
shares, ball stage, shuffles), `tables/class_totals.json`, `tables/closest_approaches.md`,
`tables/near_misses_and_confirmation.md`, `tables/summary.json`.

### 3.1 Registered grid, registered positives (P2), strict reading

Pass fraction = share of the one-signed functionals on which no battery member of the class has the opposite sign.

| family | functionals | one-signed on P2 | DH | T-NR | E_a | HEAT | SGN | U | DEL/THIN | EIS-w | theta^w | most classes rejected (battery / any member) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | 1,294,690 | 19,269 | 1.000 | 0.646 | 1.000 | 1.000 | 0.363 | 0.547 | 1.000 | 0.078 | 1.000 | 4 / 5 |
| D2-F1 | 48,069 | 1,352 | 1.000 | 0.964 | 0.925 | 0.996 | 0.604 | 0.716 | 1.000 | 0.695 | 0.927 | 4 / 6 |
| D2-F2 | 44,541 | 1,092 | 1.000 | 0.925 | 0.944 | 1.000 | 0.073 | 0.071 | 0.999 | 0.981 | 0.841 | 6 / 8 |
| D2-F3 | 4,228 | 0 | - | - | - | - | - | - | - | - | - | - |
| D2-F4 | 707 | 0 | - | - | - | - | - | - | - | - | - | - |
| D2-F5 | 4,949 | 0 | - | - | - | - | - | - | - | - | - | - |
| D3a | 1,294,690 | 27,421 | 1.000 | 0.355 | 1.000 | 1.000 | 0.145 | 0.146 | 0.402 | 1.000 | 1.000 | 4 / 5 |
| D3b-F1 | 48,069 | 1,747 | 1.000 | 0.981 | 0.998 | 1.000 | 0.514 | 0.259 | 0.787 | 0.999 | 1.000 | 5 / 7 |
| D3b-F2 | 44,541 | 877 | 1.000 | 0.999 | 0.999 | 0.999 | 0.260 | 0.015 | 0.382 | 0.999 | 0.978 | 5 / 7 |
| D3b-F3 | 4,228 | 5 | 1.000 | 0.000 | 1.000 | 1.000 | 0.000 | 0.000 | 1.000 | 1.000 | 1.000 | 3 / 5 |
| D3b-F4 | 707 | 1 | 1.000 | 0.000 | 1.000 | 1.000 | 0.000 | 0.000 | 1.000 | 1.000 | 1.000 | 3 / 4 |
| D3b-F5 | 4,949 | 0 | - | - | - | - | - | - | - | - | - | - |

The order-3 families F3, F4, F5 on the kernel with polar terms have no functional with one sign on the 24 positives.

### 3.2 Registered grid, positives = {zeta} (P0)

| family | one-signed on zeta | DH | T-NR | E_a | HEAT | SGN | U | DEL/THIN | EIS-w | theta^w | most classes rejected (battery / any member) | T-train |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | 829,568 | 0.505 | 0.658 | 0.481 | 1.000 | 0.807 | 0.846 | 0.959 | 0.223 | 1.000 | 7 / 7 | 0 |
| D2-F1 | 33,183 | 0.855 | 0.935 | 0.812 | 1.000 | 0.839 | 0.810 | 0.986 | 0.641 | 0.810 | 8 / 8 | 0 |
| D2-F2 | 32,723 | 0.726 | 0.830 | 0.668 | 0.999 | 0.650 | 0.699 | 0.902 | 0.556 | 0.727 | 8 / 8 | 0 |
| D2-F3 | 1,919 | 0.677 | 0.801 | 0.405 | 1.000 | 0.733 | 0.691 | 0.791 | 0.541 | 0.704 | 7 / 9 | 0 |
| D2-F4 | 425 | 0.666 | 0.786 | 0.245 | 1.000 | 0.605 | 0.525 | 0.696 | 0.480 | 0.652 | 7 / 8 | 0 |
| D2-F5 | 2,976 | 0.593 | 0.650 | 0.379 | 1.000 | 0.534 | 0.529 | 0.655 | 0.355 | 0.400 | 7 / 8 | 0 |
| D3a | 1,294,690 | 0.958 | 0.659 | 1.000 | 1.000 | 0.770 | 0.775 | 0.863 | 1.000 | 0.999 | 5 / 6 | 0 |
| D3b-F1 | 48,069 | 0.951 | 0.863 | 0.957 | 1.000 | 0.866 | 0.683 | 0.923 | 0.955 | 0.998 | 8 / 8 | 0 |
| D3b-F2 | 44,496 | 0.849 | 0.765 | 0.942 | 0.999 | 0.747 | 0.609 | 0.785 | 0.925 | 0.978 | 8 / 8 | 0 |
| D3b-F3 | 4,228 | 0.855 | 0.898 | 0.962 | 1.000 | 0.615 | 0.590 | 0.807 | 0.955 | 0.968 | 8 / 8 | 0 |
| D3b-F4 | 702 | 0.832 | 0.932 | 0.942 | 0.999 | 0.564 | 0.517 | 0.842 | 0.937 | 0.943 | 7 / 8 | 0 |
| D3b-F5 | 4,944 | 0.963 | 0.861 | 0.975 | 1.000 | 0.691 | 0.570 | 0.697 | 0.973 | 1.000 | 6 / 7 | 0 |

The tables for P1, for the random draws, the adaptive stage and the A3 draws have the same pattern
(`tables/per_class_tables.md`).

### 3.3 Totals over all four stages: functionals that reject each class

| positives | one-signed | DH | T-NR | E_a | HEAT | SGN | U | DEL/THIN | EIS-w | theta^w |
|---|---|---|---|---|---|---|---|---|---|---|
| P2, a battery member opposite | 629,432 | 0 | 174,241 | 50,755 | 400 | 536,017 | 543,890 | 251,804 | 166,016 | 64,291 |
| P2, at least 23 of 24 held-out members opposite | | 1,265 | 5,109 | 26,524 | 17 | 20,567 | 109,404 | 67,656 | 258 | 3 |
| P1, a battery member opposite | 6,237,834 | 12,969 | 1,302,455 | 510,002 | 1,908 | 1,614,193 | 1,930,795 | 973,045 | 710,064 | 460,430 |
| P0, a battery member opposite | 10,906,607 | 2,071,112 | 2,651,703 | 2,314,432 | 3,784 | 3,458,902 | 3,785,744 | 2,049,137 | 2,935,388 | 1,138,603 |
| P0, at least 23 of 24 held-out members opposite | | 462,853 | 193,973 | 2,144,982 | 184 | 64,318 | 363,846 | 325,610 | 475,314 | 180,914 |

Zeros by family and positive set (all stages): D1: HEAT 0, theta^w 0 (P0, P1, P2); DEL/THIN 0 and E_a 0 with P1 and
P2. D3a: E_a 0, HEAT 0, EIS-w 0 (P0, P1, P2). Battery DH: 0 with P2 in every family.

Post-hoc diagnostic (not registered; `tables/dh_diagnostic.json`): with the complex character mod 5 removed from the
positives, the grid counts are unchanged in all 12 families (same one-signed sets, DH opposite on 0). The battery DH
kernel is its real part, so this checks that the zero is not produced by that one positive.

### 3.4 Closest approaches (`tables/closest_approaches.md`, rows re-evaluated on every object in balls)

| positives | functionals with an opposite member (battery or held-out) in every class | best min-over-classes held-out opposite fraction | where |
|---|---|---|---|
| P2 | 8 (all D2-F2: 1 registered draw, 3 adaptive, 4 A3 draws) | 0.083 | F2, p = 5, u = -1.316, lam = 3.596, mu = 1.825: battery reject vector 011111101 (DH and EIS-w not rejected), held-out fractions 0.46 1.00 1.00 0.96 0.75 1.00 0.08 0.08 0.17, 23 of 24 held-out positives with the sign |
| P1 | 618 | 0.25 | D2-F5 |
| P0 | 2,097 | 0.25 | D2-F5, D2-F3 |

The five T-train functionals of the zeta-only tier (ball signs on 290 objects, no ball zero):

| family | parameters | sign on zeta | training positives with that sign | held-out opposite fractions (DH .. theta^w) |
|---|---|---|---|---|
| D2-F2 | p = 0, u = -0.4574, lam = 0.26045, mu = 0.73021 | - | 2 of 24 | 0.958 1.000 1.000 0.500 0.750 1.000 0.083 1.000 0.792 |
| D2-F3 | p = 7, u = -1.16878, h = 0.57698 | - | 8 of 24 | 0.667 0.292 1.000 0.417 0.500 0.167 0.750 0.417 0.500 |
| D2-F3 | p = 7, u = -1.17966, h = 0.58413 | - | 7 of 24 | 0.667 0.292 1.000 0.583 0.625 0.167 0.750 0.417 0.500 |
| D2-F3 | p = 13, u = -1.32507, h = 0.41483 | - | 3 of 24 | 0.708 0.292 1.000 0.500 0.417 0.167 0.750 0.375 0.042 |
| D2-F3 | p = 7, u = -1.23508, h = 0.61639 | - | 8 of 24 | 0.667 0.292 1.000 0.458 0.625 0.208 0.750 0.458 0.458 |

### 3.5 Ball stage (amendment A2)

Float64 leaves a large set undecided in the families with polar terms (share of undecided entries: D1 0.197, D2 0.11
to 0.32; D3: below 0.011). Cause: for u + log n > about 1.2 the kernel with polar terms is e^(v/2)(1 + eps) with eps
below 1e-16, so the matrix is rank one in float64 and the sign of the minor is carried by eps. Every functional that
float64 could not exclude with positives = {zeta} was resolved in balls (precisions 300, 3000, 12000 bits):

| stage | rows resolved | zeta + / - | zeta ball zero | killed by T-NR | by theta^w | by DEL/THIN | by DH, E_a, HEAT | kills relying on a ball-zero member | alive |
|---|---|---|---|---|---|---|---|---|---|
| grid | 262,135 | 4,204 / 257,931 | 0 | 218,977 | 42,709 | 448 | 1, 0, 0 | 0 | 0 |
| registered draws | 50,453 | 4,435 / 46,018 | 0 | 47,524 | 2,806 | 122 | 1, 0, 0 | 0 | 0 |
| adaptive | 2,633 | 58 / 2,575 | 0 | 2,558 | 74 | 1 | 0, 0, 0 | 0 | 0 |
| A3 draws | 526,430 | 45,388 / 481,042 | 0 | 496,914 | 28,162 | 1,319 | 25, 4, 1 | 0 | 5 |

"Killed by T-NR" means: the battery T-NR member has zeta's sign as a ball (so no battery member of that class
rejects). Over the four stages the battery T-NR member has zeta's sign on 765,973 of the 841,651 functionals; on 73,751 of the rest neither theta^w member has the opposite sign; DEL/THIN, DH, E_a and HEAT stop 1,890, 27, 4 and 1; 5 are left.
D1 on the grid: 246,765 rows, 232,436 decided at 300 bits and 14,329 at 3000 bits, none needing 12000.

## 4. Structure behind the table

**Lemma H (backward heat; PROVED, elementary).** Let K > 0 on the points read and K_tau(u) = e^(tau u^2/4) K(u),
tau < 0 (the heat member's K3 when K is zeta's K3).
(i) For u_1 < u_2, v_1 < v_2: det[K_tau(u_i + v_j)] = e^(tau A/4) (e^(tau d/2) K_11 K_22 - K_12 K_21), with
A = (u_1+v_2)^2 + (u_2+v_1)^2 and d = (u_2-u_1)(v_2-v_1) > 0. Since e^(tau d/2) < 1: a negative 2x2 minor of K gives
a negative 2x2 minor of K_tau.
(ii) F1[K_tau](u, h, lam) = e^(tau u^2/2)(e^(tau h^2/2) K(u-h)K(u+h) - lam K(u)^2): F1[K] < 0 gives F1[K_tau] < 0.
(iii) (log(e^(mu u) K_tau))'' = (log K)'' + tau/2, so F2 at lam = 1 satisfies
F2[K_tau] = e^(tau u^2/2 + 2 mu u)(F2[K] - (tau/2) K^2): F2[K] > 0 gives F2[K_tau] > 0.
Consequence (with CLASSICAL log-concavity of the Riemann-Polya kernel, cited from memory; MEASURED here: all 45,520
order-2 minors of D3a negative for zeta; F2 at lam = 1, p = 0 positive at 706 of the 707 grid pairs (u, mu) and
undecided at one):
no order-2 minor of D3a, no F1 with lam >= 1 and p = 0, and no F2 with lam = 1 and p = 0 rejects any backward-heat
member. Backward heat moves these expressions further in the direction log-concavity already gives. This is the
kernel form of flow-blindness for the order-2 part of D3. For orders 3 and 4, for the Hecke-compensated kernels and
for the kernel with polar terms the same behaviour is MEASURED (table 3.3), not proved.

**Sign pattern on D3a (MEASURED).** Share of minors with sign (-1)^(m(m-1)/2) (the pattern of K(x + y) for a Polya
frequency function K), grid, every 7th minor: zeta 1.0000 at orders 2, 3, 4 (all 1,294,690); E_a battery and held-out
1.0000; HEAT 1.0000; EIS-w 1.0000 (held-out 0.9998 at order 4); theta^w 0.9993 to 1.0000 (held-out 0.990 to 0.9995);
battery DH 1.000, 0.987, 0.934; T-NR 0.787, 0.642, 0.657; SGN, U, DEL/THIN 0.83 to 0.94; the 24 training positives as
a group 0.917, 0.782, 0.650; the held-out positives 0.689, 0.504, 0.484. The character kernels break the pattern more
often than E_a, HEAT, EIS-w and theta^w do. A functional that keeps one sign on the characters is therefore a minor on
which those four classes agree with zeta. This agrees with map row G4 and extends it to nine classes and to orders
2 to 4 of dilation matrices.

**Polar terms (MEASURED).** On D1 zeta's decided minors are + at order 2 (37,324 of 37,324) and - at orders 3 and 4
(792,244 of 792,244); HEAT and theta^w have the same signs everywhere; E_a has the opposite sign at order 2 (its polar
part has rank 2 with constants of opposite sign, xi*(1+2a) > 0 > xi*(2a): the kernel condition of
`c12-univ-pointwise-control-wcone`). So with zeta alone as the positive, polar terms reject E_a (half of the
functionals) and never reject backward heat or theta^w; the characters, which have no polar term, remove the E_a
rejection when they are added (2b).

**Why prediction 2a was wrong (ARGUED, then MEASURED in balls).** T-NR's kernel is the positive combination
K(u + l) + cK(u) + K(u - l). A minor of its dilation matrix is multilinear in the rows and expands into 3^m minors of
zeta's kernel whose rows carry different shifts, so the nodes of those minors are not ordered and their signs are not
those of zeta's ordered minors. The registered reason (total positivity of the local coefficient sequence) concerns a
different matrix. Measured: T-NR has the opposite sign on 35% of the D1 functionals one-signed on P2; 30 of 30 sampled
cases hold in balls.

## 5. Controls of the search itself

| control | result |
|---|---|
| Kernel-level planted separator (synthetic set: positives exp(-alpha u^2), nine classes exp(-alpha u^2)(1 + c u^2), c > 2.5 alpha; whole float64 pipeline; `out_synth/`) | F2 at u = 0, lam = 1, p = 0 is a survivor of the full criterion at 6 of the 7 tilts; at mu = 0 the entry k'(0) is exactly 0 and rule A1 calls the value undecided (the kind of row the ball stage takes over in the real run; the synthetic run has no ball stage). Survivors in the synthetic run: D2-F1 655, D2-F2 1,811, D2-F5 307, D1 4,454; shuffled labels: 0 of 20 |
| Value-level planted rows (5 per family and stage, ideal sign pattern written into a copy) | recovered 230 of 230 |
| Label shuffles, full criterion on permuted labels (200 permutations per family for the grid and the registered draws, 50 for A3; every 5th functional for the large minor families) | with a full survivor: 0; with a T-weak survivor: 0; with a T-train survivor: 1 of 200 for D3a and 1 of 200 for D3a-rnd, 0 elsewhere |
| Kernel validation against mpmath, values and derivatives (`tables/validation.json`, 17 objects) | largest relative error 7.0e-13 (Kpol, a complex character), 4.3e-14 (K3); E*(i, 0.7) = -2.330993813414815 against the closed form -2.3309938134148154 and the c12 record |
| Identification with the battery interface: int K e^(zu) du divided by `core.completed` at three z | constant to 3e-14 (ZETA, ratio 1), 2e-13 (DH, ratio 1.21355), 3e-13 (T-NR, ratio 3^(-1/2)), 2e-11 (EA-1/4, ratio 1) |
| Float64 against balls, random (functional, object) pairs, grid families (`tables/ball_vs_float_grid.json`) | 17,257 pairs: 15,788 float64-decided, all equal to the ball sign; 1,469 float64-undecided |
| Ball confirmation (`out/confirm_*.json`): 10 best near-misses per family on all objects, 60 random one-signed functionals on the 50 training objects | 53,850 entries: 53,789 float64-decided, all equal; 61 float64-undecided |
| Third implementation in mpmath written from the definitions without the reflection u -> -u (`ref_check.py`) | 1,107 float64-decided pairs, all equal; 93 float64-undecided; 307 pairs not run (K3 of theta^w and E_a, HEAT with polar terms) |
| Selection re-implemented row by row from the PREREG text (`ref_select.py`) | counts identical on the 10 small families (every row) and consistent on a 1-in-7 subsample of D1 and D3a |
| Ball recheck of survivors | no survivor of the registered criterion to recheck; the five zeta-only T-train functionals were completed in balls on all 290 objects |

Battery control classes run against this lane's device: all nine, each with its battery members and 24 held-out
members; the passing classes are named in sections 0 and 3.

## 6. Compute record

Server, through `rhrun` only; `rhstatus` read before each launch (three b7 units of other lanes were running; slice at
8 to 16 GB of 150). Units, both finished, none left running:

| unit | request | what | wall time | peak memory |
|---|---|---|---|---|
| `rh-c13-sep-1119133758` | 16 cores, 32 GB | `run_all.sh out all`: synthetic run; grid, analysis, ball stage, confirmation, cross-check; registered draws; adaptive stage; A3 draws | 83 min (13:38 to 15:01 UTC) | 16.6 GB (as reported by systemd at 54 min; 8 h 55 min CPU by then) |
| `rh-c13-post-1119150134` | 16 cores, 16 GB | `run_post.sh out`: ball stage of the grid again with the kill audit (identical counts), closest approaches with ball rows | 5 min | not recorded |

GPU not used (determinants of order at most 4; no large dense algebra). Largest allocations (printed in the logs
before allocation): sign matrices int8[functionals x 290], at most 375 MB per family, memory-mapped. Local runs
(sanity, trial grid, validation, referee checks) through `scripts/memcap.sh 8`. Server directory:
`~/rh-push/c13-noncone-kernel-separator-search/` (4.8 GB; the sign matrices of the random and adaptive stages stay
there; the grid sign matrices, all parameter tables of the grid, all JSON results and both logs are mirrored here
under `out/`, `out_synth/`, `logs/`).

Two process incidents: a first version of the mpmath validation was too slow and was stopped and restarted lighter
(own processes, by process id); the first pass of the mpmath referee check reported 14 disagreements that were
defects of the reference (section 5 of REFEREE.md), not of the run.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument about zeta is made; the lane tests whether a sign functional separates Euler products from controls and finds none |
| R2 (height-uniform, every window) | false | no conclusion of that form; the functionals read the kernel on [-2.6, 2.6] |
| R3 (every control fails structurally) | false | the opposite was measured: in every family at least one class passes every functional (battery DH with P2; HEAT with P0 up to 0.035%; E_a, HEAT, EIS-w on D3a; HEAT, theta^w on D1) |
| R4 (reaches the critical line) | false | no R4 answer; kernel-side sign conditions |

## 8. Three weakest steps

1. **"None" is a finite search.** 12,994,697 functionals on a grid, on random draws and around near-misses; the
   parameter space is continuous, the window is [-2.6, 2.6], columns are integers up to 13, orders stop at 4. The
   answer depends on three conventions (real part for complex kernels; untwisted n = 0 term for objects without a
   functional equation; the normalisation and sign of omega) and on the choice of battery members: T-NR and DH have
   one battery member each, and with "any member" in place of "battery member" eight functionals (P2) have an
   opposite member in every class, still with worst-class held-out fraction 0.083. No theorem says D contains no
   separator; only Lemma H is proved, for the order-2 part of D3 and one class.
2. **Most signs are float64.** About 3.7e9 entries were read in float64 with a rounding-noise rule (A1) that is a
   model, not an enclosure; it was introduced after a wrong sign was found. Checks after A1: 0 disagreements in
   69,577 float64-decided entries against balls and 1,107 against mpmath. The ball tails use a geometric bound that is
   stated in the code and not proved line by line; HEAT with polar terms and the Bessel kernels were evaluated in
   balls only up to 1200 bits in the confirmation runs. A float64 sign that is wrong and also decisive would have to
   occur on a row where every other class also fails to stop the functional.
3. **Class membership and the referee.** That the held-out DH-type functions (real and imaginary parts of complex
   character kernels) have zeros off the line is CLASSICAL for linear combinations of two L-functions (cited from
   memory, not checked per member); the imaginary parts have root number -1. theta^w and EIS-w are not objects of
   the c12 battery; their kernels are defined in this lane. The kernel with polar terms of the heat family is this
   lane's definition (the even solution of (D^2 - 1/4)K = K3 with the same decay rule as zeta); another definition
   would be a different D1 and D2 column for HEAT. REFEREE.md is written by the lane's own agent with independent
   code; an independent referee is owed.

## 9. For the orchestrator

- Outcome "none": no round-14 lead from this lane; no score flag.
- Proposed map row (device class "sign functionals of dilation minors and Turan expressions of the theta-normalised
  kernel, orders 2 to 4, at most three real parameters"): closed, MEASURED; controls that pass: battery DH (every
  functional one-signed on zeta and the characters), HEAT (99.94% with P2, 99.97% with P0), E_a and EIS-w on the
  kernel without polar terms, theta^w on minors with polar terms. Prediction "T-NR passes D1" refuted.
- What would be a different question (not run): Hermitian forms for complex kernels; orders above 4; functionals with
  more than three real parameters or with nodes outside [-2.6, 2.6]; a functional that reads two kernels at once
  (zeta and a twist); positives restricted to self-dual objects with polar terms.

## 10. Files

`PREREG.md` (with amendments, section 10), `RESULT.md`, `REFEREE.md`, `lanes.jsonl`; code: `kern.py`, `objects.py`,
`funcs.py`, `run.py`, `analyse.py`, `hp.py`, `ballk.py`, `confirm.py`, `adapt.py`, `closest.py`, `t2.py`,
`validate.py`, `ref_check.py`, `ref_select.py`, `make_tables.py`, `run_all.sh`, `run_post.sh`, `t0.py`; `tables/`;
`out/` (JSON results of every family and stage, parameter tables and sign matrices of the grid, `meta.json` with the
290 object names and groups), `out_synth/`, `logs/`.
