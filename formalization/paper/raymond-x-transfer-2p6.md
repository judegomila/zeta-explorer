# X-transfer of Raymond's chain to the U2 floor height X′ = 15600000009475 (G0-d′)

Date: 2026-10-02 (r4). Branch `editorial-redesign`, working files only (nothing committed).
Grades used below: PROVED (complete argument written here; not yet refereed), CERTIFIED (computer-assisted,
outward-rounded ball arithmetic or exact rationals, in-session, by code written for this task), CONDITIONAL,
MEASURED (floating point, sampling), HEURISTIC.

**Outcome.**

* Raymond's Analytic Foundations (AF) Part I is written for the floor height X1 = 6000000185827 with N0 = 690988. The
  band-2 value U2 = 36063660805739/250000000000000 = 0.144254643222956 reads source floors at X′ = 15600000009475
  (N0′ = 1114185). Section 3 goes through every statement of AF Part I §§1–12, AF Part II, the main paper (Lemmas 2–4,
  Theorem 4, eqs. (11)–(13)) and Track A (Lemma R, the label bins) and records how each depends on X. Section 4 states
  and proves Theorem XT: the one-point theorem of AF §§4–9 holds verbatim at every integer X ≥ X1 with
  N0 = ⌊((X − 4)/(4π))^{1/2}⌋, given the domain condition (Dom_X) and a finite list of per-row and per-rectangle
  numerical premises (R1–R8, Q3–Q7). Every X-dependent step is either a statement on a smaller domain, or one of seven
  structural facts proved from (Dom_X) in one line each (S1–S7), or one of those premises. **PROVED as an implication
  (written here, unrefereed):** the AF §§4–9 argument, whose X-free content is the open item G0-d, carries over from X1
  to X′ under (Dom_X′), the premises and the producer-enclosure hypothesis (H_enc).
* Section 5 lists the modified constants at X′ next to their X1 values.
* Section 6 re-checks every premise at X′ with code written from the AF text, not from Raymond's producer:
  * (Dom_X′) and the generic constants G1–G24 (Arb, 256 bits);
  * R1–R9 on all 1,574 time cells of the three height sets U2 reads (608 + 508 + 458), both lanes;
  * P1–P3 and Q1–Q8 on all 18,888 rectangles: the Euler norms, the §8 activation envelopes and the exceptional-pair
    debit are recomputed, and the §9 floor is re-assembled with the larger of the stored and recomputed upper inputs;
  * the 646 joint-floor table entries on the U2 path, recomputed by an independent implementation of Theorem 4′ at X′
    (stored ≤ independent in every entry, margin 2.4·10⁻¹³ to 2.8·10⁻¹²);
  * the wall inequality AF (3.1) at x_L and x_R, by an independent C/Arb program at 256 and 384 bits (4,456,740 prefix
    checks per wall; PASS; minima and their indices equal to the stored certificates);
  * exact (unbinned) label-mass sums at sample points of 108 rectangles (section 6.4).

  All checks: 0 failures. **CERTIFIED (in-session; code not refereed).**
* Code audit (section 7): the only change to Raymond's producer and assembler is the environment override of X and N0
  (two lines). No literal derived from X1 or N0 = 690988 enters any program of the U2 chain.
* What this does not cover: the X-free analytic content of AF §§6–9 (closed forms (8.1)–(8.3), §7 block enclosures,
  E_ℓ cap, exceptional-pair enumeration; G0-d); the wall-budget formulas of AF §3 (GAP 3b; they are P15 Theorem 1.3
  bounds, X-uniform for x ≥ 200, evaluated at the walls here); an external referee. No Λ value moves.
* PT Λ ≤ 0.2 stands. RH open. NO QED.

---

## 0. What is transferred, and where U2 is used

U2 is the output of Theorem BB (`lemma-B-two-band.md` §6.1.5) for band 2, the half-infinite cell C(x_R, ∞) with
x_R = 390000000236886/25 = 15600000009475.44. Theorem B step 4 (band-2 persistence) uses it for every band value in
the ledger: route P 0.1448843462793, b145 PT 0.147273668782792, 1.7X 0.144867568901016, Route H. Its inputs at X′:

| input | content at X′ | used by |
|---|---|---|
| source floors (F) | one-point floors (AF §§4–9) and joint floors (main Theorem 4 / Theorem 4′ with the Track A families) at floor height X′ = 15600000009475 ≤ x_R, N0′ = 1114185 | Lemma C (e) |
| height sets | `XW26_P100` (PLAN heights, cells 0–607), `XW26_P0_97` (0.97·PLAN, cells 100–607), `XW26_P0_94` (0.94·PLAN, cells 150–607) | consumer |
| kernels | 7 catalogue kernels + the sharp law; no two-height kernel | (K), Lemma H2 |
| walls | x_L = 15600000002223.2344, x_R (both N = 1114185) | (W), B.1, B.3-win |
| path | 646 (cell, set, mode) entries in 578 cells (set 0: 208 cells, set 1: 233, set 2: 150), heights in [137/200, 109/50] (`tmp/r4-g0dp-out/u2_used.json`) | — |

G0-d′ (ledger `r3-synthesis-2026-10-03`) asks for the written transfer of AF §§4–9 to X′, the modified constants, and
re-checks at X′. The walls x_L, x_R and the joint-floor layer (main Theorem 4, Track A) also depend on X; they are
included below.

## 1. Notation

* X is an integer ≥ X1; N0 = N0(X) = ⌊((X − 4)/(4π))^{1/2}⌋; v0 = log N0.
* L(x) = log(x/(4π)); L* = L(X − 4); s(x) = L(x)/2 − v0 (the frequency variable of AF §7).
* N(x, t) = ⌊(x/(4π) + t/16)^{1/2}⌋ (the physical cutoff, AF (4.1)).
* Rectangles R_j = {s ∈ [s_j, s_{j+1}]}, (s_0, …, s_6) = (0, 1/20, 3/20, 2/5, 1, 2, ∞); L_j^± = 2(v0 + s_{j+1 or j}).
* A cell is a plan row: time interval [t_L, t_R] = [i/4000, (i + 1)/4000] ⊂ [0, 19/125] and height h.
* δ = 10⁻¹² (activation displacement), ε5 = 10⁻⁵ (the e^{10⁻⁵} factor of AF §§8–9).

**(Dom_X).** (i) X − 4 > 4πN0²; (ii) N0 ≥ 1025; (iii) 2/(X − 2) < 1/20; (iv) X ≥ 6·10¹² (the hypothesis of Lemma R).

## 2. How a statement can depend on X

Every statement of the chain falls in one of four classes.

* **(a) X-free.** No X, N0, v0 or L enters (e.g. AF (6.1), §10 kernels, §12 terminal enclosure, Lemmas 2–3).
* **(b) Domain statements.** A statement "for all x ≥ X − c" proved for X1. Since X′ > X1, the domain
  {x ≥ X′ − c} lies inside {x ≥ X1 − c}, so the statement holds at X′ with the same constants. Where AF evaluates
  such a bound at the domain endpoint (it decreases in x), the producer evaluates it at X′ − 4 instead; that needs only
  the monotonicity in x that AF states.
* **(c) Structural facts.** Statements that use (X, N0) only through (Dom_X): L ≥ 2v0, s ≥ 0, N ≥ N0, reflected
  frequencies ≥ v0, and similar. They are S1–S7 of section 4, each proved from (Dom_X) in one line.
* **(d) Numerical premises.** Finite inequalities that the producer checks per cell or per rectangle, with the actual
  (X, N0): R1–R8 (per cell) and P1–P3, Q1–Q8 (per rectangle). At X′ they are re-checked in section 6.

## 3. Statement-by-statement table

"X1 value / X′ value" gives the worst case over the rows the item concerns; for X′ the rows are those of the three height
sets used by U2. Item numbers G·, R·, P·, Q·, M· refer to the checks of section 6.

### 3.1 AF Part I §§1–3 (setting, finite head, wall)

| # | statement as used | dependence on X | class | X1 value | X′ value | check |
|---|---|---|---|---|---|---|
| T1 | fix X, N0, v0, q0 = (1000001/1000000)², q_e = 10⁻⁸; 608 cells; heights ≥ 0.69 | definitions | — | N0 = 690988, v0 = 13.4458777365 | N0′ = 1114185, v0′ = 13.9236337539; heights of the three sets in [0.645, 2.18] | G1, G23 |
| T2 | §2: RH to X/2; every non-real zero has \|Re z\| > X | the head wall | not used for band 2 | — | replaced by Lemma B (B.3-head, B.3-win); (BB2) does not use (RH-head) | Lemma B |
| T3 | (2.1) \|H_t/B_t\| > 3/4 on the wall line, t ≤ 41/250, 0 ≤ y ≤ 1 | wall abscissa | (d) | x = X1 | x_L, x_R | G21, wall program |
| T4 | the state N is constant on the wall for t ≤ 41/250 | x_w | (d) | N = 690988 | N(x_L) = N(x_R) = 1114185 | G21 |
| T5 | (3.1) prefix sums > 79/100 for all J ≤ N, four time centres | x_w, N | (d) | 2,763,952 checks | 4,456,740 checks per wall | G21, wall program |
| T6 | Abel transfer: weights nonincreasing for 0 ≤ v ≤ log N < L/2 | log N < L(x_w)/2 | (c) | holds | holds at x_L, x_R | G21 |
| T7 | source/gamma displacement + unrefined approximation error < 1/100; floor > 3/4 | P15 Thm 1.3 bounds (23)–(24) at x_w | (b)+(d) | floor 0.7888 | budget 9.4738·10⁻⁴, floor 0.789052617 | G21 |

T7: the producer's terms are e_{C,0} of P15 (24) with each factor at its maximum over 0 ≤ y ≤ 1, 0 ≤ t ≤ 41/250
((x/4π)^{−1/4}, 3^y + 3^{−y} ≤ 10/3, t = 0), e_A + e_B of P15 (23), and the leading-source shift (da = 5/x, the (4.6)-type bound for σ ∈ [1/2, 1], whose true size is 4/x + O(x⁻²)).
P15 Theorem 1.3 holds on its region (5) (0 < t ≤ 1/2, 0 ≤ y ≤ 1, x ≥ 200), so the formulas are X-uniform. Their written
derivation is AF-gaps GAP 3b (and GAP 3a for t = 0); the transfer adds nothing to that gap.

### 3.2 AF Part I §4 (larger-height approximation)

| # | statement as used | dependence on X | class | X1 value | X′ value | check |
|---|---|---|---|---|---|---|
| T8 | domain 0 ≤ t ≤ 19/125, x ≥ X − 2; radius-0.01 Cauchy disks in x ≥ X − 4, 0.54 ≤ y ≤ 2.41; Re a, Re b ∈ [−1, 2] | domain, heights | (b), (d) | y ∈ [0.68, 2.19] | y ∈ [0.635, 2.19] (0.94·PLAN reaches h = 0.645) | G23/G24 |
| T9 | (4.1) model f_{t,N} with the actual N | N ≥ N0 on x ≥ X − 4 | (c) | — | — | S1 |
| T10 | (4.2)–(4.3): ε ≤ e^{(8+t+5/6)/(V−6)} − 1, δ1 ≤ 0.2 G_2(log 9)/(N0 − 0.865), δ2 ≤ 0.029 G_{−1}(−log 2)/(N0 − 0.353), V = x/2, D = V − 3 | V, and N0 as a lower bound of N | (b)+(d) | ε/2 + δ1 + δ2 = 2.8251·10⁻⁵ | 1.7521·10⁻⁵ (< 1/1000) | R2, G11 |
| T11 | (4.4): δ3 < 10⁻¹⁰⁰ needs V′/π − 4 > 100, D ≥ 100, t ≤ 1/5 | V | (b) | V′/π − 4 ≥ 9.5·10¹¹ | ≥ 2.48·10¹² | G9 |
| T12 | (4.5) coarse bound \|R\| < e^{tπ²/64}\|M0(iV′)\| | from T10, T11 | (a) | — | — | — |
| T13 | (4.6) \|α − (L/2 ± iπ/4)\| < 10/x, \|α′\| < 2/x, \|α\| < L/2 + 1 on x ≥ X − 4, −1 ≤ σ ≤ 2 | domain | (b) | x\|α − lead\| ≤ 5.000 | ≤ 5.000 | G10; proof in §4.3 |
| T14 | \|M0(iV)\| decreasing (Im α(iV) > 0) | V ≥ 2 | (a) | — | — | — |
| T15 | (4.7) e_C^broad < 4 exp[−(1 + y)L/4 − tL²/16 + 1/10], heat correction tπ²/32 < 0.05 | L ≥ L* | (b)+(d) | — | per row | R3, R7 |

### 3.3 AF Part I §5 (physical value and derivative errors)

| # | statement as used | dependence on X | class | X1 value | X′ value | check |
|---|---|---|---|---|---|---|
| T16 | (5.1) (1 + y_f)/2 + t_L L*/8 > 5/4 | L* | (d) | L* = 26.8917563692 | L*′ = 27.8472677838; min margin 0.0692 (0.94·PLAN, cell 361, h = 51/50) | R1 |
| T17 | first-branch amplitude ≤ 1.01 n^{−[(1+y_f)/2 + t_L L/8]}; two-branch mass < 18; mass bounds 6, 22, 180 | via (5.1) and ε_s | (a) given R1, R4 | — | — | — |
| T18 | (5.2) e_AB < 18(e^d − 1), d = [t_R²(L*/2 + 1)²/8 + t_R/4 + 1/6]/((X − 4)/2 − 3.33) | X, L* | (d) | 4.844·10⁻¹² | 1.957·10⁻¹² | R3, G12 |
| T19 | at most one state boundary per Cauchy disk | spacing ≥ 4π(2N0 + 1) | (c) | 1.74·10⁷ | 2.80·10⁷ | S6, G8 |
| T20 | (5.3) e_pair < 3 exp[−(1 + y_f)v0/2 − t_L v0²/4 + 10⁻⁵] | v0 | (d) | — | per row | R3 |
| T21 | δ = 10⁻¹² covers the heat correction in N and the disk displacement | πt/(8x), 0.01/(2x) | (c) | 9.9·10⁻¹⁵, 8.3·10⁻¹⁶ | 3.8·10⁻¹⁵, 3.2·10⁻¹⁶ | S3, G7 |
| T22 | (5.4) e_AB + e_C^broad + e_pair < 10⁻⁶ | per row | (d) | — | max 7.83·10⁻⁸ (0.94·PLAN, cell 361) | R3 |
| T23 | Cauchy: derivative error < 10⁻⁴ | — | (a) | — | — | — |
| T24 | (5.5) ε_s = 100[1 + t_R(L + 1)]/x bounds the source shifts | x, L; decreasing in x | (b)+(d) | 8.733·10⁻¹¹ | 3.452·10⁻¹¹ | R4, G12 |
| T25 | (5.6) 18ε_s·28 < 10⁻⁶, 18ε_s·208·(1 + L) < 10⁻⁴ | per row | (d) | 4.40·10⁻⁸, 9.12·10⁻⁶ | 1.74·10⁻⁸, 3.73·10⁻⁶ | R4, G12 |
| T26 | Re(β_t(a)/2) > L/4 − 10⁻⁶ | from (4.6) | (b) | — | — | — |

### 3.4 AF Part I §§6–9 (one-point theorem)

| # | statement as used | dependence on X | class | X1 value | X′ value | check |
|---|---|---|---|---|---|---|
| T27 | (6.1) moment identity; Q_y = −V/2 | — | (a) | — | — | — |
| T28 | product head through N0 has coefficients ≥ 0 | any N0 | (a) | — | — | Lemma CG |
| T29 | (6.3) masses A_U, B_U | N0, N0/d | (a) identity | — | — | P-, M-checks |
| T30 | reflected label frequency λ = L − log n + log d ≥ v0 (n ≤ N0) | L ≥ 2v0 | (c) | L* − 2v0 = 8.96·10⁻⁷ | 2.76·10⁻⁷ | S1, S4, G3 |
| T31 | C < 17/5 and 2C < v0; reflected and product-tail labels are never exceptional | v0 | (c)+(d) | v0 − 10⁻¹² − 6.8 = 6.646 | 7.124; max C = 1.711 | Q3, Q4, G16 |
| T32 | exceptional pairs have product < e^{2C} < e^{6.8} < 1024 ≤ N0 | N0 ≥ 1024 | (a)+(Dom) | — | — | G17 |
| T33 | κ_{d,n} ∈ [−K_L, 0], K_L = (L/4)(v0 + log 30) | L ≥ 2v0, v0 > log 30 | (c) | K_L ∈ [113.26, 130.11] | K_L ∈ [120.61, 137.94] | S5, G18, G19 |
| T34 | (7.1) Taylor bound on each time cell | K_L enters the second-derivative cap | (d) | — | per rectangle | Q1, M1 |
| T35 | A0 decreases in L; weighted reflected mass decreases since hv0 > 2 | v0 | (d) | — | min h v0′ = 8.98 | R5 |
| T36 | the six frequency intervals cover x ≥ X − 2 | s(X − 2) ≥ 0 | (c) | 4.48·10⁻⁷ | 1.38·10⁻⁷ | S2, G4 |
| T37 | §8 constants a0 = t_L v0/2, b, b+, c0 = a0 + h, k = a0 − b > 0, C0 = e^{−t_L v0²/4 + b v0} | v0 | (d) | — | min k = 0.5553 | R8 |
| T38 | an active future term has 0 < w ≤ s + δ | log N ≤ L/2 + πt/(8x) | (c) | — | — | S3 |
| T39 | (8.1)–(8.3) value and derivative envelopes | v0 in C0, a0, c0, k | (d) | — | per rectangle; recomputed | P2 |
| T40 | the reflected weighted exponential decreases in s since c0 v0 > 2 | v0 | (d) | — | min c0 v0′ = 22.95 | R8 |
| T41 | Riemann-sum factor e^{1/N0} and endpoint corrections absorbed by e^{10⁻⁵}: t_R δ²/4 + (t_R v0/2 + h)δ + 1/N0 < 10⁻⁵ | N0, v0 | (d) | 1/N0 = 1.447·10⁻⁶ | 1/N0′ = 8.975·10⁻⁷; max budget 8.975·10⁻⁷ | R6, G14 |
| T42 | §8.1 activated labels have frequency ≥ v0 − 10⁻¹² > 2C | L ≥ 2v0, S3 | (c)+(d) | — | — | S4, Q4 |
| T43 | (8.4) A_new ≤ E_n A_act, B_new ≤ 2(E_n D_act + E_y A_act); (8.5) remainders r0 = 2·10⁻⁶E_n, r1 = 2·10⁻⁴E_n + 2·10⁻⁶E_y | via (5.4)–(5.6) | (a) given R3, R4 | — | — | P1, Q6 |
| T44 | §9: 0 ≤ A− ≤ A ≤ A+ < 4/5, B ≤ B+, cone > 0, 0 < C < 17/5, g = 1 − A+ > r0 | per rectangle | (d) | — | max A+ = 0.3232, min (g − r0) = 0.677 | Q3, Q5, Q6 |
| T45 | E_ℓ = (1/2 + 10⁻⁵) Σ_p log p · a_p e^{10⁻⁵}/(1 − a_p e^{10⁻⁵}), sup at (t_L, L_j⁻) | L_j⁻ = 2(v0 + s_j) | (d) | — | recomputed | P1 |
| T46 | (9.2) S > L/4 − 10⁻⁶ − E_ℓ − C/2 − pert, with L/4 ≥ (v0 + s_j)/2 | v0 | (d) | — | floor re-assembled | Q7 |

### 3.5 AF §§10–12, AF Part II, main paper, Track A, consumer

| # | statement as used | dependence on X | class | X′ value | check |
|---|---|---|---|---|---|
| T47 | AF §10 kernel catalogue (10.1), self caps | — | (a) | — | (K) certified |
| T48 | AF §11: a contact with x > X has both probes in x ≥ X − 2 | X, shift < 2 | (c) | band 2: x* > x_R = X′ + 0.44; max r·h = 1.308, h/√3 ≤ 1.259 | G20, G23 |
| T49 | AF §11 confinement, Hermite splitting, simple contact; AF §12 terminal enclosure | — | (a) | U2 < 41/250 | E1–E8 (r3-bb) |
| T50 | AF Part II sharp law; Part II §5 "a < h/√3 < 2" | heights | (a)+(d) | h ≤ 2.18 | G23 |
| T51 | main §6: X − 4 > 4πN0²; finite frequency intervals have physical width > 10¹¹ > 4 | X, N0 | (c) | slack 4.31·10⁶; min width 1.64·10¹² | G1, G5 |
| T52 | main eq. (13): only the 11 pair classes occur | 2/(X − 2) < 1/20 | (c) | 1.28·10⁻¹³ | S7, G6 |
| T53 | main eqs. (11)–(12) lower coefficients with L_j⁺ = 2(v0 + s_{j+1}) | v0 | (d) | recomputed | joint check |
| T54 | main Lemma 2, eq. (3), Lemma 3, eq. (5) | — | (a) | — | — |
| T55 | main Theorem 4 / Theorem 4′ (joint floor) | (OP) + Lemma CG + Lemma R + (Dom) | implication | (OP) = Theorem XT | joint check |
| T56 | Track A Lemma R: X ≥ 6·10¹², ε_R = a(10 + t(L(x − a)/2 + 1))/(x − a) + a²/(4(x − a)) ≤ EPS_REFL = 10⁻⁹ | X | (d) | ε_R ≤ 1.6599·10⁻¹² (X1: 4.2897·10⁻¹²) | G15 |
| T57 | Track A bins: head [1025, N0], tail (N0/d, N0], reflected [1025, N0] | N0, L_j^± | (d) | 896 head bins, recomputed | joint check |
| T58 | consumer: q0 = 1.000002000001, q_e = 10⁻⁸, 128 substeps | — | (a) | E1–E8 certified for U2 | r3-bb |

## 4. Theorem XT (Raymond's one-point theorem at a general floor height)

### 4.1 Structural facts

Assume (Dom_X). Write y = x/(4π).

* **S1.** For x ≥ X − 4: y > N0², hence N(x, t) ≥ N0 for every t ≥ 0, and L(x) > 2v0.
  *Proof.* (Dom_X)(i). ∎
* **S2.** For x ≥ X − 2: s(x) ≥ s(X − 2) > 0, so x lies in one of R_0, …, R_5.
  *Proof.* S1 and monotonicity of L. ∎
* **S3.** log N(x, t) ≤ L(x)/2 + πt/(8x). For x ≥ X − 4, |x′ − x| ≤ 0.01 and t ≤ 19/125:
  πt/(8x) + 0.01/(2(x − 0.01)) < δ.
  *Proof.* N² ≤ y + t/16 = y(1 + πt/(4x)) and log(1 + u) ≤ u; the second part is 9.948·10⁻¹⁵ + 8.33·10⁻¹⁶ < 10⁻¹² at
  X1 and decreases in X (3.826·10⁻¹⁵ + 3.21·10⁻¹⁶ at X′). ∎
* **S4.** For d | 30 and n ≤ N0: L − log n + log d ≥ L − v0 ≥ v0. For N0 < n ≤ N(x, t):
  L − log n + log d ≥ L/2 − πt/(8x) ≥ v0 − δ. First-branch tail and activated labels have frequency log(dn) ≥ v0.
  *Proof.* S1, S3. ∎
* **S5.** For d | 30, n ≤ N0, v = log n, v_d = log d, q_d = Σ_{p|d} log² p and κ_{d,n} = (q_d + v² − L(v + v_d))/4:
  −K_L ≤ κ_{d,n} ≤ 0 with K_L = (L/4)(v0 + log 30).
  *Proof.* q_d ≤ v_d² ≤ L v_d (v_d ≤ log 30 < L) and v² ≤ L v (v ≤ v0 < L), so κ ≤ 0; and
  −κ ≤ L(v + v_d)/4 ≤ (L/4)(v0 + log 30). This needs only v0 > log 30 and L ≥ 2v0 (S1). ∎
* **S6.** Consecutive state boundaries {x : y + t/16 = n²} with n ≥ N0 are 4π(2n + 1) ≥ 4π(2N0 + 1) > 0.02 apart.
  *Proof.* Direct. ∎
* **S7.** For 0 < a < 2 and x ≥ X − 2 + a: s(x + a) − s(x − a) = ½ log((x + a)/(x − a)) ≤ a/(x − a) < 2/(X − 2) < 1/20,
  which is the smallest width of a finite rectangle in s. So a probe pair x ± a lies in rectangles (j, j) or (j, j + 1)
  (main eq. (13)).
  *Proof.* log(1 + u) ≤ u and (Dom_X)(iii). ∎

### 4.2 The premises

For a cell (t_L, t_R, h) with h ∈ [11/20, 12/5] and [t_L, t_R] ⊂ [0, 19/125], with y_f = h − 1/100, L* = L(X − 4),
V_0 = (X − 4)/2, D_0 = V_0 − 3, G_σ(c) = exp{5/(6D_0) + [σ²/D_0 + σc + t_R c²/4]/(1 − t_R/D_0)}/(1 − t_R/D_0)^{1/2}:

* **R1** (5.1): (1 + y_f)/2 + t_L L*/8 > 5/4.
* **R2** (4.3): ε/2 + δ1 + δ2 + 10⁻¹⁰⁰ < 1/1000, with ε = e^{(8 + t_R + 5/6)/(V_0 − 6)} − 1,
  δ1 = 0.2 G_2(log 9)/(N0 − 0.865), δ2 = 0.029 G_{−1}(−log 2)/(N0 − 0.353).
* **R3** (5.4): e_C + e_pair + e_AB < 10⁻⁶ with e_C = 4 exp(−(1 + y_f)L*/4 − t_L L*²/16 + 1/10),
  e_pair = 3 exp(−(1 + y_f)v0/2 − t_L v0²/4 + 10⁻⁵), e_AB = 18(e^d − 1),
  d = [t_R²(L*/2 + 1)²/8 + t_R/4 + 1/6]/(V_0 − 3.33).
* **R4** (5.5)–(5.6): ε_s = 100(1 + t_R(L* + 1))/(X − 4) < 10⁻⁹, 18ε_s·28 < 10⁻⁶, 18ε_s·208·(1 + L*) < 10⁻⁴.
* **R5** §7: h v0 > 2 and (1 + h)/2 > 1/v0.
* **R6** §8: t_R δ²/4 + (t_R v0/2 + h)δ + 1/N0 < 10⁻⁵.
* **R7** (4.7): t_R π²/32 + 10⁻⁶ < 1/10.
* **R8** §8: k = t_L v0/2 − (1 − h)/2 > 0 and (t_L v0/2 + h) v0 > 2.

For each rectangle R_j of the cell, with the producer's stored enclosures (midpoint values, signed time derivatives and
the K_L² second-derivative caps at L_j⁻ and L_j⁺) and stored E_n, E_y, E_ℓ, C, D, and with r0 = 2·10⁻⁶E_n,
r1 = 2·10⁻⁴E_n + 2·10⁻⁶E_y the AF (8.5) remainders (written r0, r1 to avoid a clash with the premise labels):

* **Q3**: 0 ≤ A− < A+ < 4/5, B+ > 0, 0 < C < 17/5 (A± and B+ assembled by (7.1), (8.4));
* **Q4**: 2C < v0 − 10⁻¹²;
* **Q5**: (1 + A−)[C(1 + A−) − B+] − D_C > 0;
* **Q6**: g = 1 − A+ > r0;
* **Q7**: the floor ℓ_j = (v0 + s_j)/2 − 10⁻⁶ − E_ℓ − C/2 − (r1 + B+r0/(2g))/(g − r0) is at least the stored floor.

### 4.3 Proof of (4.6) for every x ≥ 100

This is class (b) (domain inclusion); the short proof shows that the constant 10/x has slack at every height. Let
s = σ + iV, V = x/2 ≥ 50, σ ∈ [−1, 2]. Then |1/(2s)| ≤ 1/(2V) = 1/x and |1/(s − 1)| ≤ 1/V = 2/x. With principal
logarithms, ½ log(s/(2π)) = ½ log(iV/(2π)) + ½ log(1 − iσ/V), where ½ log(iV/(2π)) = L/2 + iπ/4 and
|log(1 + w)| ≤ |w|/(1 − |w|) with |w| = |σ|/V ≤ 4/x. Hence |α(s) − (L/2 + iπ/4)| ≤ 1/x + 2/x + 2/(x − 4) < 10/x. Next,
α′(s) = −1/(2s²) − 1/(s − 1)² + 1/(2s), so |α′(s)| ≤ 1/(2V²) + 1/V² + 1/(2V) = 6/x² + 1/x < 2/x, and
|α| ≤ L/2 + π/4 + 10/x < L/2 + 1. The lower sign follows by conjugation. On the grid σ ∈ {−1, −3/4, …, 2} at
x = X′ − 4, x|α − (L/2 + iπ/4)| = 5.0000 (attained near σ = 2) and x|α′| = 1.0000 (G10). ∎

### 4.4 Theorem XT

**Theorem XT.** Let X ≥ X1 be an integer, N0 = ⌊((X − 4)/(4π))^{1/2}⌋, and assume (Dom_X). Let a cell
(t_L, t_R, h) satisfy R1–R8, and let a rectangle R_j of it satisfy Q3–Q7, where (H_enc) the stored §7 enclosures
(midpoint masses, signed time derivatives, absolute masses behind the K_L² caps) are valid enclosures of the quantities
they name, and E_n, E_y, E_ℓ, D_C and the activation bounds are at least the AF formulas (§§6, 8, 9) evaluated at
(X, N0). Then for every x ≥ X − 2 with s(x) ∈ [s_j, s_{j+1}] and every t ∈ [t_L, t_R]:

1. H_t(x + ih) ≠ 0 and S(x, h, t) = −Im(H_t′/H_t)(x + ih) > ℓ_j (AF (9.2));
2. the one-point input (OP1)–(OP4) of `joint-pair-arbitrary-shift.md` §1 holds on R_j with the constants (ℓ_j, C, A+,
   E_ℓ).

Consequently, with Lemma CG and Lemma R (X ≥ 6·10¹², ε_R ≤ 10⁻⁹), Theorem 4′ gives the joint floor at X for every shift
interval I ⊂ (0, 2), and the table entries computed from these records by `b145-B-lib` (joint_pairs, gains_cell,
make_tables) are valid joint floors at X whenever all probe points satisfy x − a ≥ X − 2.

*Proof.* AF Part I §§4–9 with (X, N0, v0, L*) in place of (X1, 690988, log 690988, L(X1 − 4)). The tables of section 3
list every step. Each step is of one of four kinds. Class (a) steps carry over unchanged. Class (b) steps hold on the
smaller domain x ≥ X − 2 (resp. X − 4); this includes (4.2)–(4.7), where N0 enters only as a lower bound of the actual
cutoff N (S1) and the bounds decrease in N. Where AF evaluates a bound decreasing in x at the domain endpoint, it is
evaluated at X − 4 here (R2–R4). Class (c) steps follow from S1–S7. Class (d) steps are the premises R1–R8 and Q3–Q7,
with (H_enc). Every occurrence of X, N0, v0, L* or L in AF §§4–9 is one of the rows T8–T46 of section 3, so no step
uses any other property of X1 or of 690988. Outside §§4–9, X1 enters AF only as the head wall (§§2–3; for band 2 replaced
by Lemma B with the walls x_L, x_R, T2–T7) and as the contact domain of §11 (T48). Item 2 is the passage from (9.1)–(9.2) to main eq. (1) written in
`joint-pair-arbitrary-shift.md` §2, which uses only these quantities. The consequence is Theorem 4′ (proved there for
general X under (Dom)), with (OP) supplied by item 2. ∎

The theorem is conditional on the X-free content of AF §§6–9 (G0-d), on (H_enc) (Raymond's interval code; tested at
points in §6.4) and on AF §4 (internally graded SOUND), exactly as at X1; it adds no hypothesis.

*Remark (robustness of the class (b) items).* Suppose a reader doubts that N0 enters (4.3) only as a lower bound of N
(for instance, if a simplification in the derivation of the constants 0.2, 0.865, 0.029, 0.353 used N ≥ 690988
numerically). Then the X1 values themselves apply on the smaller domain x ≥ X′ − 4, because N ≥ N0′ > 690988 there. With
the X1 values, ε/2 + δ1 + δ2 ≤ 2.8251·10⁻⁵ < 1/1000 for every t_R ≤ 19/125 (G11 at X1), so R2 holds either way. The
same applies to (5.2), (5.5) and (5.6): their X1 values (section 5) are below the AF thresholds.

## 5. Modified constants at X′

All values are Arb balls at 256 bits (`tmp/r4-g0dp-out/constants.json`), shown rounded.

| quantity | X1 = 6000000185827 | X′ = 15600000009475 |
|---|---|---|
| N0 = ⌊((X − 4)/4π)^{1/2}⌋ | 690988 | 1114185 |
| (Dom)(i) slack X − 4 − 4πN0² | 5377388.879 | 4305809.863 |
| v0 = log N0 | 13.4458777365 | 13.9236337539 |
| L* = log((X − 4)/(4π)) | 26.8917563692 | 27.8472677838 |
| L* − 2v0 (S1) | 8.962·10⁻⁷ | 2.760·10⁻⁷ |
| s(X − 2) (S2) | 4.481·10⁻⁷ | 1.380·10⁻⁷ |
| smallest physical width of a finite rectangle | 6.310·10¹¹ | 1.641·10¹² |
| 2/(X − 2) (S7) | 3.33·10⁻¹³ | 1.28·10⁻¹³ |
| πt/(8x) at t = 19/125 (S3) | 9.948·10⁻¹⁵ | 3.826·10⁻¹⁵ |
| state spacing 4π(2N0 + 1) (S6) | 1.737·10⁷ | 2.800·10⁷ |
| V′/π − 4 at x = X − 4 ((4.4)) | 9.549·10¹¹ | 2.483·10¹² |
| x\|α − (L/2 + iπ/4)\| at X − 4, max on the σ-grid; analytic bound 1 + 2 + 2x/(x − 4) ((4.6), needs < 10) | 5.0000; 5.0000 | 5.0000; 5.0000 |
| δ1, δ2, ε at t_R = 19/125 ((4.3)) | 2.8166·10⁻⁵, 8.548·10⁻⁸, 2.995·10⁻¹² | 1.7468·10⁻⁵, 5.302·10⁻⁸, 1.152·10⁻¹² |
| ε/2 + δ1 + δ2 (bound 10⁻³) | 2.8251·10⁻⁵ | 1.7521·10⁻⁵ |
| e_AB at t_R = 19/125 ((5.2)) | 4.844·10⁻¹² | 1.957·10⁻¹² |
| ε_s at t_R = 19/125 ((5.5)) | 8.733·10⁻¹¹ | 3.452·10⁻¹¹ |
| (5.6) value / derivative errors | 4.401·10⁻⁸ / 9.119·10⁻⁶ | 1.740·10⁻⁸ / 3.728·10⁻⁶ |
| 1/N0 (§8 Riemann-sum factor) | 1.4472·10⁻⁶ | 8.9752·10⁻⁷ |
| v0 − 10⁻¹² − 2·(17/5) (§6, §8.1) | 6.6459 | 7.1236 |
| K_L on finite rectangles (§7) | [113.262, 130.109] | [120.612, 137.937] |
| ε_R(a = 2, t = 41/250) (Lemma R) | 4.2897·10⁻¹² | 1.6599·10⁻¹² |
| Lemma R budget 50/(X − 4) + 4/(X − 6) | 9.00·10⁻¹² | 3.46·10⁻¹² |

Walls (AF §3; both lanes stored, recomputed in G21):

| wall | x_L = 15600000002223.2344 | x_R = 15600000009475.44 |
|---|---|---|
| N (constant for t ≤ 41/250) | 1114185 | 1114185 |
| θ0 | −0.882513797146 | −0.897903055852 |
| e_{C,0} / leading-source shift / e_A + e_B | 9.47377·10⁻⁴ / 4.209·10⁻⁹ / 1.056·10⁻⁹ | same |
| physical floor 79/100 − budget (needs > 3/4) | 0.7890526175 | 0.7890526175 |
| prefix minima (four time centres) | 0.834222, 0.882404, 0.880815, 0.816445 | 0.831707, 0.881568, 0.881701, 0.832097 |

At X1 the wall budget was ≈ 1.2·10⁻³ (floor 0.7888); every term decreases with x.

Per-row extremes over the three height sets at X′ (both lanes; `tmp/r4-g0dp-out/rows_*.json`):

| premise | PLAN | 0.97·PLAN | 0.94·PLAN |
|---|---|---|---|
| R1 (5.1) min margin | 0.0977 (cell 480) | 0.0827 (cell 480) | 0.0692 (cell 361) |
| R2 max ε/2 + δ1 + δ2 | 1.752·10⁻⁵ | 1.752·10⁻⁵ | 1.752·10⁻⁵ |
| R3 max e_C + e_pair + e_AB | 5.26·10⁻⁸ | 6.48·10⁻⁸ | 7.83·10⁻⁸ |
| R8 min k / min c0 v0 | 0.5885 / 23.75 | 0.5708 / 23.33 | 0.5553 / 22.95 |
| R6 max endpoint budget | 8.98·10⁻⁷ | 8.98·10⁻⁷ | 8.98·10⁻⁷ |
| Q3 max A+ / max C | 0.2680 / 1.178 | 0.2943 / 1.406 | 0.3232 / 1.711 |
| Q6 min g − r0 | 0.732 | 0.706 | 0.677 |

## 6. Certified re-checks at X′

All scripts are in `tmp/` (prefix `r4-g0dp-`), outputs in `tmp/r4-g0dp-out/`. Python scripts run with
`/tmp/s145venv/bin/python` (python-flint 0.8.0, Arb); C programs link FLINT 3.6 (`/opt/homebrew`). Every check is
fail-closed.

### 6.1 Generic constants (`r4-g0dp-constants.py`; G1–G24; 0 failures)

G1 N0′ = ⌊((X′ − 4)/4π)^{1/2}⌋ by Arb, and (Dom)(i); G2 (Dom)(ii)–(iv); G3 L*′ > 2v0′; G4 s(X′ − 2) > 0; G5 rectangle
widths > 10¹¹; G6 pair coverage; G7 activation displacement; G8 state spacing; G9 (4.4) premises; G10 (4.6) on a
σ-grid with the analytic bound; G11 (4.3) at the worst time; G12 (5.2), (5.5), (5.6) at the worst time; G14 1/N0′;
G15 Lemma R; G16 2C < v0′ − 10⁻¹² for every C < 17/5; G17 e^{34/5} < 1024 ≤ N0′; G18 v0′ > log 30; G19 K_L range;
G20 0 < x_R − X′ < 2; G21 walls x_L and x_R: state constancy, log N < L/2, budget, floor, θ0, and agreement with the stored
lane-A (256 bit) and lane-B (384 bit) certificates (PASS flags, 4N prefix checks, floors equal to the recomputed value);
G23/G24 heights, Cauchy ranges, real parts of a and b, time range, max r·h < 2, h/√3 < 2 for all three height sets.
(G13, the worst e_pair, and G14, 1/N0′, are per-row quantities checked in R3 and R6; G19 is informational; G22 is G1.)
The same script evaluates every constant at X1 for comparison (section 5).

### 6.2 Per-row and per-rectangle premises (`r4-g0dp-rows.py`; 0 failures, 13 s on 4 processes)

Inputs: the producer files of the three height sets, both lanes (192-bit lane A, 256-bit lane B):
`/tmp/s145-1-archive/XW2.6/PROBE_{192,256}.json` (PLAN), `/tmp/b145-B-archive/XW26_P0_97/…`,
`/tmp/b145-B-archive/XW26_P0_94/…`. Written from the AF formulas:

* **F1** per file: schema; x_domain_lower = X′ − 2, xmin = X′ − 4; the stored balls for log N0 and L* contain the true
  values and their lower ends are ≤ the 256-bit lower ends.
* **R1–R9** per cell: as in section 4.2, recomputed in Arb at 256 bits; R9 also checks the time grid, the Cauchy range,
  and that each stored error string is a valid one-sided bound of the recomputed ball.
* **P1** E_n, E_ℓ, E_y recomputed at (t_L, L_j⁻) (their supremum over the rectangle); stored ≥ recomputed.
* **P2** activation envelopes (8.1)–(8.3) recomputed with v0′, then (8.4); stored ≥ recomputed.
* **P3** exceptional debit D_C recomputed with c_n(t_R) from the covering identity of Lemma CG (a third construction,
  different from both of Raymond's lanes), weights at σ_U(t_L, L_j⁻); stored ≥ recomputed.
* **Q1–Q8** exact rational re-assembly of (7.1), (8.4)–(8.5), the cone, (9.1)–(9.2). The larger of stored and recomputed
  upper inputs is used, the smaller lower input, and v0′ from the 256-bit ball. Q7 checks that the stored density, the
  validate-style floor and the floor in the b145 record are all ≤ the re-assembled floor ℓ_j′. Q8 checks the two-lane
  overlap of all temporal enclosures.

Counts: 1,574 cells × 2 lanes; 9,444 rectangles per lane, 18,888 in all; every cell used by U2 has a record in its height
set. Margins: re-assembled floor − stored density ≥ 9.999·10⁻⁹ (the producer subtracts 10⁻⁸); re-assembled floor −
record floor ≥ 1.000·10⁻⁷ (the assembler subtracts 10⁻⁷); stored/recomputed activation and debit ratios ≥ 1.000000.
The min cone margin is 1.0·10⁻⁷, because the producer bisects C to the smallest value with cone > 10⁻⁷.

Fail-closed test (`r4-g0dp-selftest.py`): on a three-cell copy of the PLAN lane-A file the unmodified copy passes, and
each of 12 single corruptions is rejected. The corruptions are: a stored error string set to 0 (two cases), an error-row
height changed, a density raised by 10⁻⁶, the debit set to 0, an activation bound set to 0, E_ℓ set to 0, a derivative
cap below its enclosure, C = 7/2, a shifted frequency endpoint, a log N0 ball moved up by 10⁻³⁰, and xmin = X1 − 4.

### 6.3 Joint-floor entries on the U2 path (`r4-g0dp-joint.py`; 0 failures, 71 s)

For each of the 646 (cell, set, mode) entries U2 consumes, the entry is recomputed by an independent implementation of
Theorem 4′ at X′. It takes min over the 11 pair classes of
(ℓ_j + ℓ_k)/2 + G^cone + G^Eul + G^H + G^T + G^R. The cone and Euler gains use main eqs. (6), (7), (9), (11), (12) with
c_n(t_L) from the covering identity. The Track A gains use head bins [1025, N0′] (bin lower bounds C_g(n_1, t_L) from
the covering identity), tail bins (N0′/d, N0′] and reflected bins with ε = 10⁻⁹. Every bound is an Arb lower endpoint at
192 bits. Result: stored ≤ independent in every entry, with independent − stored ∈ [2.43·10⁻¹³, 2.85·10⁻¹²] (the stored
values are floored to the 10⁻¹² grid twice). Shift intervals inside (0, 2); every credited bin has a positive gap. The
per-rectangle inputs (ℓ_j, C_j, A+_j) are the records re-certified in 6.2.

### 6.4 Exact-mass point checks (`r4-g0dp-masses.c` + `r4-g0dp-masses.py`)

`r4-g0dp-masses.c` sums the AF §6–8 label masses exactly (no bins) in Arb at 128 bits: A, B, the absolute masses, dA/dt,
dB/dt over n ≤ N0′ with the breakpoints N0′/d, and the activated labels N0′ < n ≤ N. For sample rectangles (six cells per
height set spread over the cells U2 uses, all six frequency rows; 108 rectangles):

* **M1**: the exact A, B, A′, B′ at the time midpoint, at L_j⁻ and at L_j⁺, lie inside the stored enclosures of both lanes;
  K_L²·(absolute masses at t_L) are below the stored second-derivative caps.
* **M2**: at t ∈ {t_L, t_m, t_R} × s ∈ {s_j, s_mid, s_{j+1}} (s ∈ {2, 23/10} on the infinite row), with the actual cutoff
  N = ⌊(e^L + t/16)^{1/2}⌋: exact prefix + activated masses ≤ the stored A+, B+; exact prefix A ≥ the stored A−;
  activated masses ≤ the stored activation bounds.

Result: 108 rectangles (cells PLAN 0, 41, 83, 124, 166, 536; 0.97·PLAN 166, 239, 286, 332, 379, 538; 0.94·PLAN 250, 454,
484, 513, 547, 577), 882 grid points, 0 failures (`tmp/r4-g0dp-out/masses.json`, 683 s on 4 processes). Smallest
margins: stored A+ − exact A = 8.28·10⁻⁴, stored B+ − exact B = 2.32·10⁻³, exact prefix A − stored A− = 6.20·10⁻⁴,
stored activation bound − exact activated mass = 2.45·10⁻⁶ (PLAN cell 0, row s ∈ [0, 1/20], t = 0: exact
4.375·10⁻⁵ against the bound 4.620·10⁻⁵, a 5.6% margin). The widest binned enclosures in the sample are the lane-A ones
(midpoint A 8·10⁻⁴, midpoint B 8.7·10⁻³, dA/dt 0.082, dB/dt 0.93; lane B 3·10⁻⁴, 3.6·10⁻³, 0.017, 0.20), and every exact
value lies inside them.

These are certified statements at the sampled points. They test the instantiation of AF §§6–8 at X′. They do not
replace the rectangle argument (§7 Taylor bound with the block enclosures, §8 envelopes), which is part of G0-d.

### 6.5 Walls (`r4-g0dp-wall.c`; PASS at 256 and 384 bits)

An independent C/Arb program, written from AF §3, checks (3.1) for every prefix J ≤ N and the four time centres. θ0 is
computed from log M0 by principal acb logarithms and reduced to (−π, π]; a different branch flips the sign of every
cosine sum and the check then fails. Validation at X1 (N = 690988): PASS, minima 0.800596748, 0.868985228, 0.891752650,
0.867836139, θ0 = −1.07708815407, equal to the stored X1 certificate. At x_R = 390000000236886/25 and
x_L = 19500000002779043/1250 (N = 1114185 each; state constant for t ≤ 41/250): PASS, 4,456,740 checks each, minima and
indices as in section 5, equal to the stored certificates to all digits shown. Output: `tmp/r4-g0dp-out/wall_x{L,R}_{256,384}.txt`.

## 7. Code audit (`r4-g0dp-audit.py`; 0 failures)

* **A0.** The comparison copy `/tmp/s145src/…/BCLD_COUPLED_PROBE_MOTION_SOURCE_20260921` equals `Parent_Source.zip` inside
  the Zenodo `Proof_and_Replay/Sources/Scientific_Source.zip` (sha256 of the producer, assembler, `common.py`,
  `assemble.py`, `PLAN.json`).
* **A.** Against the pinned deposit, the producer `code/certify_coupled_probe.py`, `base/code/assemble.py`,
  `certify_anchor.py`, `kernel_algebra.py`, `check_kernels.py` and `data/PLAN.json` are identical. `base/code/common.py`
  and `code/assemble_coupled.py` differ only in the override
  `X=int(os.environ.get('S145_X','6000000185827'));N0=int(os.environ.get('S145_N0','690988'))`.
* **B.** `b145-B-ccp.py` (producer for the 0.97/0.94 sets) differs from Raymond's producer only in a per-cell try/except,
  a `failed` list, an optional stricter stop (C > 13/4) and its import path. No arithmetic line changed.
* **C.** A scan of the numeric literals of 10 programs (producer, assembler, b145 library, run, consumer, stack, replay,
  wall producer) finds 45 distinct long literals. None encodes an X1- or N0-derived quantity, apart from the two
  overridden defaults.
* **D.** The producer defines v0 = log N0, xmin = X − 4 and L* = log(xmin/4π) in one line from the overridden X, N0.
  `validate_cells`, `joint_pairs` and `GainCtx` take X, N0 as arguments (`b145-B-run` passes 15600000009475, 1114185).
  The b145 library does not import Raymond's `joint_common.py`, which hard-codes X1 and 690988.
* **E.** sha256 of the 17 data files (probe files, tables, wall certificates, plans, kernels) and the 10 programs:
  `tmp/r4-g0dp-out/audit.json`.

F1 (section 6.2) closes the remaining gap of the assembler: `validate` reads v0 from the probe file and does not itself
check it against X. F1 checks that every probe file records log N0′ and L(X′ − 4).

## 8. What this does not cover

1. **G0-d.** The X-free analytic content of AF §§6–9 is not re-derived here: the closed forms (8.1)–(8.3) including the
   infinite interval and the e^{10⁻⁵} absorption, the §7 block enclosures, the Euler cap E_ℓ ≥ phase-free cap, and the
   exceptional-pair enumeration. Theorem XT carries that dependence unchanged. Sections 6.2 and 6.4 re-evaluate those
   formulas at X′ and test the producer's enclosures at points; they do not prove the formulas.
2. **Binned enclosures.** The producer's §7 prefix enclosures (bins of relative width 1/400 and 1/800) are tested at
   sample points only (6.4); their correctness on whole rectangles rests on Raymond's interval code, as at X1.
3. **Shared library.** Raymond's two lanes and the code written here all use Arb/FLINT. The checks here are a separate
   implementation of the formulas, not a separate arithmetic library.
4. **Walls.** The wall-budget formulas (P15 Theorem 1.3 (23)–(24) and the source shift) are evaluated at x_L, x_R; their
   written derivation is AF-gaps GAP 3b (t = 0: GAP 3a).
5. **Referee.** This document and the scripts have had no internal adversarial pass and no external reader.
6. **Inputs outside the transfer.** The hypotheses of Lemma B at X′ are not part of G0-d′: (RH-win) is certified by
   Route 2; (K) and (H2) are certified; (BB2) is Theorem BB with E1–E8 certified for U2.

## 9. Grades and ledger effect

* **PROVED (written here, unrefereed):** S1–S7; (4.6) for every x ≥ 100; Theorem XT as an implication (the X-transfer
  of AF Part I §§4–9, with the AF §3 wall, AF §11 domain, main Theorem 4/4′ and Track A Lemma R at general X under
  (Dom_X), R1–R8, Q3–Q7 and (H_enc); the X-free content of AF §§6–9 stays the open item G0-d).
* **CERTIFIED (in-session, code written for this task, unrefereed):** (Dom_X′); G1–G24; R1–R9 on 1,574 cells × 2 lanes;
  P1–P3 and Q1–Q8 on 18,888 rectangles; the 646 joint-floor entries of the U2 path; the walls at x_L and x_R (independent
  program, 256 and 384 bits); the exact-mass point checks of 6.4.
* **CONDITIONAL:** U2 and every band value through it remain conditional on G0-c, G0-d, the AF expository gaps, Lemma
  B.1–B.3 as written, and the other open ledger inputs. Theorem XT removes the X-transfer as a separate open item, subject
  to one adversarial referee pass of this document.
* **Ledger.** G0-d′ moves from "open (numerical premises regenerated; written argument not refereed)" to "written +
  certified at X′ (Theorem XT, sections 4 and 6); internal referee pending". No Λ value moves:
  U2 = 0.144254643222956, route P certified-only 0.147541569979886, b145 PT 0.147273668782792, route P conditional
  0.1448843462793.

PT Λ ≤ 0.2 stands. RH open. NO QED.

## 10. Reproduction

From `tmp/`, with `PY=/tmp/s145venv/bin/python`:

    $PY -B r4-g0dp-path.py                      # U2 replay (r3-bb-replay), used entries -> r4-g0dp-out/u2_used.json (46 s)
    $PY -B r4-g0dp-constants.py                 # G1-G24 at X1 and X' -> constants.json (< 1 s)
    $PY -B r4-g0dp-rows.py --procs 4            # R1-R9, P1-P3, Q1-Q8, both lanes, three height sets -> rows_*.json (13 s)
    $PY -B r4-g0dp-selftest.py                  # 12 corruptions of a three-cell copy, each must be rejected
    $PY -B r4-g0dp-joint.py --procs 3           # the 646 joint-floor entries of the U2 path -> joint.json (71 s)
    cc -O2 -I/opt/homebrew/include -L/opt/homebrew/lib -o r4-g0dp-masses r4-g0dp-masses.c -lflint -lgmp -lmpfr
    $PY -B r4-g0dp-masses.py --procs 4          # exact-mass point checks, 108 rectangles -> masses.json
    cc -O2 -I/opt/homebrew/include -L/opt/homebrew/lib -o r4-g0dp-wall r4-g0dp-wall.c -lflint -lgmp -lmpfr
    ./r4-g0dp-wall 390000000236886 25 1114185 256      # x_R (also 384; x_L = 19500000002779043/1250; X1 = 6000000185827/1)
    $PY -B r4-g0dp-audit.py                     # code audit + sha256 -> audit.json
    python3 r4-g0dp-collect.py                  # -> r4-g0dp-out/SUMMARY.json (total_failures = 0 on 2026-10-02)

The scripts read the volatile archives `/tmp/s145-1-archive`, `/tmp/b145-B-archive` and `/tmp/raymond_pr` (kernels),
as the r3 replays do. Copying them into a persistent hashed store is the ledger item "archives"; `audit.json` records
their sha256.
