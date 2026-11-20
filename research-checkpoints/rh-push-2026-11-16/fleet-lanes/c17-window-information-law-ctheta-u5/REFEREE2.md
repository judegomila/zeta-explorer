# REFEREE2 (second, independent): c17-window-information-law-ctheta-u5

Date 2026-11-20. Written by lane `c18-referee-r17-independent-sources`. Derived from `header.md`, `RESULT_theory.md`, `tail.md`, `wil.py`, `testB.py` before the first referee file was opened; compared afterwards (section 7). Gate note for the two c18 lanes that read N(theta): `push/c18-referee-r17-independent-sources/GATE.md`. Scripts, logs and outputs: `push/c18-referee-r17-independent-sources/` (`ref2_wil.py`, `ref2_ea.py`, `ref2_ea_prime.py`, `ref2_checks.py`, `logs/`).

No statement about zeros of zeta is made by the lane or here.

## Verdict: HOLDS WITH CORRECTIONS

Theorems 1 to 6, Lemma P, Lemma E and Corollary T' (relative to Turan) hold. Labels that break (none is a statement about zeros of zeta):

| Item | Label in the lane | Label after this pass |
|---|---|---|
| (W4) density form ("only with off-line pair density of order u/2 pi over a length of order b_max") | two-sided in order (PROVED/MEASURED) | ARGUED. Proved replacement: the count form W4c below |
| (W5) second bullet (sequences of isolated pairs; height-coupled band) | PROVED | ARGUED. Proved replacement: W5c below (one band, equal offsets) |
| Section 3, "N(theta) holds if and only if the truncated data extend to a function with positive real part (Remark K)" | stated as a consequence of Remark K | ARGUED for the windowed N(theta); holds for the unwindowed device |
| Control row zeta(s+a) zeta(s-a): "fails in a window (MEASURED on the window type ...)" | MEASURED | The cited measurement is of another configuration. Decided by a run on the control's own configuration (section 5): passes for a <= 0.22, fails for a >= 0.24 at T = 1e6, theta = 1/2, M = 0; passes for a <= 0.02, fails for a >= 0.05 at theta = 0.8, M = 0 (ball arithmetic, window model) |
| Control row Davenport-Heilbronn: "fails at large height; its off-line pairs are isolated (bounded number per window)" | asserted | Not established; not run. "Outcome through zero location only" stands |

## 1. Theorems, re-derived

- Theorem 1. g(z) = <v_(conj z), h>, f = g g^#, f(z) = <h, v_z><v_(conj z), h>; int f = 2 pi norm(h)^2; (D) is <h, (T_Z + 2M) h> >= 0. (b) abs(int_0^u e^(-isz) ds)^2 = 4 sin^2(uz/2)/z^2, int = 2 pi u; (c) int B_delta = 1, the cosine term integrates to 0 for xi >= delta. Holds. Correction: T_Z is unbounded for a configuration with log density, so "on H" is "on C_c^infinity(I)", extended by dominated convergence to every h with g g^# in K_u (see GATE.md).
- Theorem 2. G_kl = u sinc(u (z_l - conj z_k)/2); non-zero spectrum of V J V* is that of J G; Sylvester gives (n, n). One pair: eigenvalues u (1 +- sinh(A)/A). Extremal function: checked numerically (g closed form against quadrature to 3e-41; minus the sum of f over the pair at u = 3, b = 0.7 equals mu = 2.74550963165333 to 15 digits). Roots for c = 2, 1, 0.1: 2.83844638, 2.177318985, 0.7634007976 (the lane's values). (d) holds. Holds.
- Lattice background. Poisson: T_Gamma h(s) = (2 pi/d) sum_m e^(2 pi i m x_0/d) h(s - 2 pi m/d); only m = 0 for 2 pi/d >= u. Holds.
- Theorem 3. T = c Id + V K V* with c = Lg + 2M. Holds (distinct points needed for all columns). An equivalent form used for the rerun: the inertia of [[c Id, V],[V*, -K]] computed in two ways gives neg(T) = pos(K + G/c) - pos(K).
- Theorem 4. s(z) = sin(pi (z - x_0)/d) has type Lg/2, is real on R, bounded by 1 on R, zeros real. (a) holds. (b): matrix [[c u_1, c N],[conj(c) N, conj(c) u_1]], eigenvalues u_1 Re c +- sqrt(abs(c)^2 N^2 - u_1^2 (Im c)^2); "lowest <= -abs(c)(N - u_1)" reduces to N >= u_1 (squared and simplified by this referee). Holds.
- Theorem 5. tr(J G) = 2nu, tr((J G)^2) = u^2 sum sinc^2; the bound; n = 1 sharp. The integral form is the Hilbert-Schmidt norm of the kernel sum_k e^(i z_k (s - s')). Holds.
- Theorem 6. Periodisation of f(. + ib) is a trigonometric polynomial with the single frequency 0 when 2 pi/d >= u (the transform is continuous, supported in [-u, u], so it vanishes at +-u). Holds.
- Lemma P. Pairing z with conj z gives sum_Z B cos = Re(e^(i phi) S); int w = 1; choose phi. Holds.
- Corollary T'. Reconstructed: Turan applied to the n points x_j - i b_j (modulus e^(h b_j) >= 1); the other points go into D'. For abs(zeta) <= 1/2, min Re sinc^2(zeta) = 0.91939539 (computed on the circle), so each coefficient has real part >= 0.1463 delta and, with the factor 2 of the theorem, the constant is 0.2927 delta (the lane's 0.29). (6/5) log(48 e) = 5.84544. Conditions delta <= xi <= u - delta give the stated restriction on lambda. Holds relative to the theorem.
- Lemma E. C_a C_b = C_(a+b) on L^2[0, u], C_a = 0 for a >= u; the Euler product and its logarithmic derivative are finite sums in a commutative nilpotent setting. Holds for every completely multiplicative eps. (The sum in A is over n < e^u.)

## 2. Sources

- Turan's second main theorem. Primary sources (Turan's book; Montgomery, Ten Lectures) are not available online and were not opened. Opened: A. J. van der Poorten, "Generalisations of Turan's main theorems on lower bounds for sums of powers", Bull. Austral. Math. Soc. (doi 10.1017/S0004972700041575; scanned text, formulas only partly legible): it records that the constant A in (m/(A(m+n)))^m satisfies e < A < 8e (Uchiyama; "contained in the Sos and Turan paper"), and that Makai gave 2e/log 2 < A and later 4e <= A. B. Kerr, slides "Power sums" (ANU, 2023): max over m+1 <= l <= m+n of abs(sum b_i z_i^l) >= (n/(8e(m+n)))^n min_k abs(b_1 + ... + b_k) with max abs(z_i) = 1; no factor 2 and no ordering are printed there. Wikipedia "Turan's method" prints the factor 2 and the ordering by decreasing modulus. Decision: "relative to" stays. The constant 8e is supported by a refereed secondary source. The factor 2 is not supported by two of the three sources; without it the constant 0.29 delta becomes 0.146 delta and the bound changes by (1.2 log 2)/u in b_1; 5.85 is unchanged. The ordering by decreasing modulus is needed for the minimum over partial sums and is what Corollary T' uses.
- Fejer-Riesz for exponential type (Lemma 0). Opened at secondary level: Wikipedia "Akhiezer's theorem" (f entire of exponential type tau, f >= 0 on R; f = F F^# with F of type tau/2 and zeros in the closed upper half-plane if and only if sum abs(Im 1/z_n) < infinity; cites Boas, Entire Functions, 1954, pp. 124-132, and Akhiezer 1948). For f in K_u the condition holds because f is bounded on R (Cartwright class). F is in L^2(R) because abs(F)^2 = f on R, and Paley-Wiener gives h in L^2(I). Primary sources not opened. Lemma 0 is needed only for "passes the complete device"; every exclusion statement is independent of it.
- Explicit formula in the operator normalisation. Re-derived: for f = abs(g)^2, g(x) = int h(s) e^(-isx) ds, the function (1/2 pi) int f(x) e^(ixy) dx is <C_y h, h> type, so the prime term of the Weil formula is -2 Re <h, A h> with A = sum Lambda(n) n^(-1/2) C_(log n); the archimedean term is (1/2 pi) int abs(g)^2 (Re psi(1/4 + ix/2) - log pi) dx = <h, Arch h> with Arch = log(abs(x)/2 pi) + O(x^-2); the pole terms are f(i/2) + f(-i/2). Signs as in the lane. Correction: the size e^(u/2)/t^2 of the pole terms is for the indicator vectors; for general h it depends on the smoothness of h.

## 3. Remark K

Holds for the unwindowed device (Krein extension for a positive-definite distribution on (-u, u), then Bochner-Schwartz; sigma has mass O(log t) on [t, t+1]). Recalled, not opened. It does not apply to N(theta) as defined in section 3, which restricts to h "concentrated at height t": that set is not a modulation-invariant linear space. See GATE.md.

## 4. The three items listed as not established

**(W4), density form: NOT ESTABLISHED; label ARGUED.** Corollary T' bounds a count: for one cluster with all off-line pairs within distance r of the deepest one, n >= (u b_1 - 1.2 log((M + 2 pi D')(r + 1/2)) - O(1))/5.85. The radius r enters through a logarithm, so the pairs are counted over the whole cluster, not over a length of order b_max. The localisation available from the tests of Lemma P is polynomial (abs(B_delta(x + iy)) is of order e^(delta y)/(delta x^2)), so a pair at horizontal distance x with offset within (2/u) log x of b_1 still enters the power sum. No argument in the lane excludes a passing configuration whose pairs near the deepest one are sparse and whose compensation comes from many pairs farther away. No such configuration was found either. Proved statement that can replace it:
(W4c) Count form (relative to Turan): if all off-line pairs lie within r of the deepest pair and the configuration passes the Fejer-modulated sub-device, then the number of pairs is at least (u b_max - 1.2 log((M + 2 pi D')(r + 1/2)) - O(1))/5.85. Rows of spacing <= 2 pi/u pass with any offset (Theorem 6).
The one-pair regime (u b below the one-pair root) needs no density; the sentence should exclude it.

**(W5), sequence form: NOT ESTABLISHED as written; label ARGUED for the second and fourth bullets.** Two gaps. (i) By Theorem 1 (a) the unwindowed complete device has no height, so "band u = theta log gamma at height gamma" is defined only for a windowed device, and no theorem of the lane is about a windowed device. (ii) Theorems 2 (d) and 4 (b) treat one pair; for infinitely many pairs the negative parts add. What can be proved at one band, by this referee:
(W5c) Let pairs x_j +- ib have equal offset b and separation abs(x_j - x_k) >= D. For h in C_c^infinity(I), -[f(z_j) + f(conj z_j)] = -2 Re(g(z_j) conj(g(conj z_j))) <= (1/2) abs(g(z_j) - g(conj z_j))^2 = 2 abs(G(x_j))^2, where G is the transform of h(s) sinh(bs), a function of exponential type u/2. By the Plancherel-Polya inequality sum_j abs(G(x_j))^2 <= C(u, D) int abs(G)^2 with C(u, D) = O(u + 1/D), and int abs(G)^2 <= 2 pi sinh^2(ub/2) norm(h)^2. So the family passes the complete band-u device with tolerance M, against any on-line set, when 4 pi C(u, D) sinh^2(ub/2) <= 2M, that is for b <= c sqrt(M) u^(-3/2) with c depending on uD only. (Plancherel-Polya: CLASSICAL, recalled.) This gives the passing side of the second bullet at each fixed band with a smaller constant than sqrt(12M); unequal offsets and the height-coupled band are not covered. W5c is new in this file (PROVED relative to Plancherel-Polya, with C(u, D) <= (2 e^2/pi) max(2/D, u/2) from the mean-value property on discs of radius min(D/2, 2/u)); it has no referee.
The first bullet (all configurations on the line pass) and the third (rows of density >= u/2 pi pass at that band; no set with O(log gamma) points per unit length has density above every multiple of log gamma) hold.

**Control rows as written.** DH: not established. Nothing bounds the number of off-line zeros of the Davenport-Heilbronn function per unit window near the line; its known off-line zeros to the right of 1 lie outside the strip abs(Im z) <= 1/2 used in the definition of a configuration; the one-pair law is a lattice-model statement. Entry: "not run; through zero location only". zeta(s+a) zeta(s-a): section 5.

## 5. The zeta(s+a) zeta(s-a) row, decided by a run (server)

The control's configuration, with all zeros of zeta in the window on the line (true at height 1e6): every ordinate gamma carries the pair gamma +- ia; there are no on-line zeros; the pair density is Lg/2 pi. The lane's measurement "count-preserving and added pairs on zeta's ordinates" keeps on-line zeros around a finite block and is a different configuration.

Lattice model: a row of spacing 2 pi/Lg, which by Theorem 6 is (2 Lg) Id for u <= Lg and passes with any a.

Zeta's ordinates (new run, `ref2_ea.py`, units rh-c18ref-ea-1120043540, rh-c18ref-ea2-1120044726 and rh-c18ref-ea3-1120045219, 4 cores each, below 1 GB; 512-bit balls, every pivot sign certified): pairs at the 172 stored ordinates with abs(gamma - 1e6) <= 45, pairs at lattice points outside, T = (2 Lg + 2M) Id - (171 lattice pairs) + (172 zeta pairs), neg(T) = pos(K + G/c) - pos(K) on a 686 x 686 real Gram matrix.

Number of negative directions of T (0 = the configuration passes the complete device; every sign certified):

| theta (theta' = u/Lg) | M | window half-length | a = 0.005 | 0.02 | 0.05 | 0.1 | 0.2 | 0.22 | 0.24 | 0.26 | 0.28 | 0.3 | 0.45 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.5 (0.577) | 0 | 45 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 5 | 8 | 18 |
| 0.5 (0.577) | 0 | 30 | - | - | - | - | 0 | 0 | 1 | - | - | 6 | - |
| 0.5 (0.577) | 1 | 45 | 0 | 0 | 0 | 0 | 0 | - | - | - | - | 6 | 16 |
| 0.8 (0.923) | 0 | 45 | 0 | 0 | 2 | 11 | 30 | - | - | - | - | 42 | 53 |
| 0.8 (0.923) | 1 | 45 | 0 | 0 | 0 | 6 | 26 | - | - | - | - | 38 | >= 51 (3 pivots undecided at 512 bits) |

Largest passing a: between 0.22 and 0.24 at theta = 1/2, M = 0 (the same bracket with window half-length 30 and 45); between 0.2 and 0.3 at theta = 1/2, M = 1; between 0.02 and 0.05 at theta = 0.8, M = 0; between 0.05 and 0.1 at theta = 0.8, M = 1. For comparison the one-pair threshold of the lane at theta = 1/2, M = 0 is 0.346 at this ordinate.

Prime side, without the lattice model (`ref2_ea_prime.py`, float64 screen, indicator vectors only, pole terms dropped: they are below 1e-7 here): the explicit formula of the control holds unconditionally, and for h = e^(ist) 1_[0,u]/sqrt(u) the device inequality is S_a(t) := 2 sum_(n < e^u) Lambda(n) n^(-1/2)(n^a + n^-a)(1 - log n/u) cos(t log n) <= 2 Lg + 2M. Over t in [1e6 - 45, 1e6 + 45], with 2 Lg = 23.955:

| theta | a | max S_a | rms S_a (predicted sqrt(sum w^2/2)) | fraction of t with S_a > 2 Lg |
|---|---|---|---|---|
| 0.5 | 0.2 | 18.56 | 6.39 (6.49) | 0 |
| 0.5 | 0.3 | 23.86 | 8.32 (8.41) | 0 |
| 0.5 | 0.45 | 40.35 | 14.57 (14.62) | 0.059 |
| 0.8 | 0.1 | 23.25 | 9.58 (9.89) | 0 |
| 0.8 | 0.2 | 33.92 | 14.07 (14.68) | 0.070 |
| 0.8 | 0.3 | 70.40 | 25.70 (27.08) | 0.192 |

Reading. On zeta's ordinates the control is not a lattice row. Operator form: if T_Gamma is the on-line form of the ordinates, the control has T_a = E_- T_Gamma E_+ + E_+ T_Gamma E_-, E_+- multiplication by e^(+-as); its kernel is 2 cosh(a (s - s')) k(s - s') with k the kernel of T_Gamma. The factor cosh is not positive definite, so T_Gamma >= 0 does not give T_a >= 0; for the lattice k is a multiple of the delta function and the factor is invisible. On the prime side the shift multiplies the coefficient at log n by n^a + n^-a. Two measured facts: (i) the complete device fails from a = 0.24 at theta' = 0.58 and from a = 0.05 at theta' = 0.92, so the threshold falls as the band approaches the Nyquist band, where the on-line form of zeta's ordinates has small eigenvalues; (ii) the indicator-vector sub-device needs larger a (0.3 to 0.45 at theta = 1/2; 0.1 to 0.2 at theta = 0.8), where the weighted prime sum, of root mean square sqrt(sum w_n^2/2), about P^a (log P/(4a))^(1/2) for large P^a, reaches the reserve 2 log(t/2 pi) + 2M. For fixed a > 0 and fixed theta > 0 the prime sum is a power of t and the reserve is a logarithm, so the control fails at a positive proportion of large heights already for the sub-device (ARGUED: second and fourth moments of a Dirichlet polynomial of length t^theta, theta < 1/4, by the mean value theorem; not written out).

Corrected entry: "zeta(s+a) zeta(s-a): lattice model, passes for every u <= Lg and every a (Theorem 6). On zeta's ordinates at 1e6 (MEASURED, ball arithmetic, window model): passes for a <= 0.22 and fails for a >= 0.24 at theta = 1/2, M = 0; passes for a <= 0.02 and fails for a >= 0.05 at theta = 0.8, M = 0. The failure is through the factor cosh(a (s - s')), that is the size of the coefficients n^a + n^-a; it is not a structural step, and for small a the control passes." R3 stays false.

## 6. Rerun of two table entries (server, independent code)

`ref2_wil.py`, units rh-c18ref-a-1120043109 (theta = 1/2, M = 0) and rh-c18ref-b-1120043109 (theta = 2, M = 1), 2 cores and 4 GB each, 1024-bit balls, finished. Own derivation of the criterion: neg(T) = pos(K + Q) - pos(K) with Q = V* T0'^-1 V, from the inertia of [[T0', V],[V*, -K]]; T0'^-1 computed fibrewise from 2M I_k + Lg 1 1^T by this referee; the on-line block (172 ordinates, 171 lattice points) has inertia (172, 171) in both cases, which certifies T0 >= 0; the pair enters through a 2 x 2 Schur complement whose determinant sign is certified. None of the lane's code is used; the lane's test is R K R + R >= 0 by LDL.

| Entry (T = 1e6, one pair at the ordinate x = -0.20658277545589954, bisection 11 steps from [1e-4, 0.4999]) | lane | this rerun |
|---|---|---|
| theta = 1/2, M = 0 | 0.34566484374999995 | 0.34566484374999995 (all 13 verdicts equal) |
| theta = 2, M = 1 | 0.0249923828125 | 0.0249923828125 (all 13 verdicts equal) |

Bracket width 2.4e-4. Both entries are reproduced.

## 7. Comparison with the first referee

Read after sections 1 to 6 were fixed. Same verdict. Its E1 (the control is a row and passes in the lattice model; "zeta's ordinates: not run"), E2, E4, E5 coincide with the decisions above; section 5 here supplies the run on zeta's ordinates that E1 names as missing, and changes the entry from "passes for theta' <= 1 (lattice)" to a threshold in a. Its E3 (the word "about" in the one-pair reach), E6 (the frame is Weil's functional on tests of bounded support; classical) and E7 are accepted and not re-derived here. Additional here: the domain correction of Theorem 1, the status of Remark K for the windowed N(theta), the source notes of section 2 (factor 2 in Turan's theorem), W4c, W5c.

## 8. Flags

R1 false (Lemma E holds for every multiplicative chain; no inequality uses it). R2 false. R3 false (T-NR, ZQ rows and, for small a, zeta(s+a) zeta(s-a) pass in a window). R4 false. Referee count for the lane: 2, both hold with corrections.
