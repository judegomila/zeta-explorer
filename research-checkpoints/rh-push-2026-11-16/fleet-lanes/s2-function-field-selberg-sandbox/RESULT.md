# s2-function-field-selberg-sandbox: screening of four combinations in the two sandboxes where the analogue of RH is a theorem

Date 2026-11-19. Lane type: screener (compute). Slug `s2-function-field-selberg-sandbox`.
Nothing here is a statement about the zeros of zeta. No bound on Lambda moves. Not refereed.
Labels: PROVED (short argument written here), CLASSICAL (quoted), EXACT (integer arithmetic, decision procedure),
MEASURED (float64 or 80-bit floating point, or float64 linear algebra on Arb-evaluated entries; nothing is interval-certified), ARGUED.

## 0. Verdict

**Four combinations tested. Survivors: 0.**

In both sandboxes the roles are: "zeta" = the objects for which the analogue of RH is a theorem (L-polynomials satisfying
the Weil bound; the discrete spectrum of PSL2(Z); twisted Gamma(2) without exceptional eigenvalue), "controls" = the objects
with the same formal structure and off-line zeros (fakes; twisted Gamma(2) with a real exceptional zero, called SEL). Zeta,
L(s, chi_4) and the Liouville sign twist were run where the statistic is formulable for them (combinations 3 and 4).

| # | combination (nodes) | statistic | sizes reached | RH-true objects ("zeta") | comparison | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | ff-ghost-index-toeplitz + ff-ghost-second-order | first order N_det at which the Toeplitz matrix T_N = [S_(j-k)] has a negative eigenvalue; ghost index nu; candidates built from delays <= g only: T_(g+1) >= 0, Hasse-Weil-Serre at d <= g, both; single-level Hasse | 72 cells (q, g): g = 1, 2 for the 27 prime powers q <= 64; g = 3 for q <= 17; g = 4 for q = 2, 3, 4, 5, 7; g = 5, 6 for q = 2; 9.28e9 polynomials tested, 5.33e8 census members (1.38e6 RH members); 50 cells also in exact integer arithmetic | 0 failures (theorem; EXACT in the 50 exact cells) | n/a | 5.31e8 fakes. T_2g rejects all of them (it is the exact RH decision). N_det = 2g occurs in every cell with fakes and g >= 2. T_(g+1) and Serre at d <= g together are passed by 8.29e6 fakes: between 0.8% (q = 17, g = 3) and 96% (q = 2, g = 3) of the fakes of a cell | CLOSED. The only rejecting statistic of (a_1..a_g) found is T_2g, which is the location of all 2g zeros (the complete form of verified height at finite genus); every statistic that uses delays <= g only passes a positive proportion of fakes |
| 2 | ff-lambda-of-elliptic-curve + hasse-weil-checks | min over fakes of the heat constant Lambda (first t at which the heat-evolved cosine polynomial has only real zeros) per cell (q, g); Serre test on the minimiser | same 72 cells; minimiser of each cell rechecked exactly and at 40 digits | Lambda <= 0 (0 exactly at repeated zeros) | n/a | min Lambda > 0 in each cell, and it tends to 0: least-squares slopes of log(min Lambda) in log q are -1.29 (g = 1), -2.25 (g = 2), -4.37 (g = 3); slope -8.5 over the three cells q = 4, 5, 7 at g = 4; smallest value 9.94e-8 (q = 7, g = 4). Serre at d <= g passes the minimiser in every cell with g >= 2 except q a square at g = 2 | CLOSED. Lambda > 0 is the statement "has an off-line zero"; the integrality gap is positive per cell and not bounded below; Serre at d <= g does not see the minimisers |
| 3 | selberg-zeta-freeze-sandbox + selberg-theorem-u-geodesic-monoid | (A) Weil form on test functions supported in [0, A], from the geometric side; (B) Schur/Hankel condition for R_a = X(w-a)/X(w+a) at real nodes; (C) Jensen count on the disc centred at 3/2 reaching Re s = 0.55 | length spectrum of PSL2(Z) and of 8 characters of Gamma(2) to norm 4.0e10 (trace <= 2e5, 8.43e9 closed words), of 17 more characters to norm 1.6e9; supports A <= 24 and 21 | (A) PSL2(Z) discrete form and 11 characters without exceptional zero: positive at every support (to A = 24 and 21). (B) fails for every one of them. (C) count 0 | zeta and L(chi_4): (A) positive to A = 17 | (A) all 14 SEL characters fail, first at A* between 7.01 and 11.7; A* = 4.64 + 1.80 log(1/kappa) for kappa <= 0.115 (kappa = distance of the real zero from the line). PSL2(Z) form without the zeta-prime (scattering) term fails from A = 1.52; Liouville sign twist fails at 0.75. (B) fails. (C) returns the real zero to 1e-12 | CLOSED. (A) is the Weil criterion and detects each exceptional zero at a support that grows as the zero approaches the line; (B) fails on RH-true objects, so it does not measure the line in this sandbox; (C) is a zero count |
| 4 | berry-saturation-scale + selberg-geodesic-ground-truth | half-saturation window D_50 of the number variance of smoothed counts, from the orbit side, against the Berry scale 1/l_0 | 15 objects at the 4.0e10 length spectrum, 14 family characters, zeta and L(chi_4) with prime powers to 1.1e7; smoothing 0.6 to 0.25; one direct band average of 8192 centres per object type | D_50 l_0 between 0.37 and 1.06 for every object | L(chi_4): 0.64 to 0.79; zeta: 0.53 to 0.67 | sign twist: identical to zeta (PROVED: the statistic depends on squared amplitudes). SEL and non-exceptional characters: same values, continuous across the threshold | CLOSED. A statistic of the list of on-line ordinates: blind to the exceptional zero and to sign and unimodular twists (round-1 pattern 2) |

Why none is a survivor, in one line each: (1) passes for the fakes at every size below the one that locates all zeros;
(2) is the zero location itself; (3A) fails the controls only at supports that resolve them, (3B) fails the RH-true objects;
(4) cannot fail any control.

## 1. Code, runs, sizes

All files are in this directory. Local runs went through `scripts/memcap.sh 8`. Server runs went through `rhrun` only
(units listed below; all stopped or finished). Raw server outputs are in `out_server/`, logs in `server_logs/`, local outputs in `out/`.

| file | role |
|---|---|
| `ffcensus.c` | enumeration of the census with a file of kept polynomials (used for the exact Python pass) |
| `ffanalyze.py` | exact pass: counts a_d (Python integers), exact inertia of the Gram matrices (Descartes' rule on the exact characteristic polynomial, python-flint), Serre, Hasse; float: eps, lambda_min, Lambda |
| `ffstream.c` | enumeration and classification in one pass (80-bit long double), per-cell histograms and the Lambda-minimiser; `merge_st.py` merges residue-class chunks |
| `ff_recheck.py` | exact and 40-digit recheck of every reported minimiser |
| `summarize_ff.py` | tables of section 3 and 4 |
| `geod.c` | closed words of PSL2(Z) (trace <= tmax) with the 6-dimensional monomial representation induced from a character of Gamma(2): per trace, class count and twisted character sums |
| `sel.py` | copy of the transfer-operator library of `e1-selberg-twist-control` (Z of PSL2(Z) and of twisted Gamma(2)) |
| `tf.py`, `tf_validate.py` | trace formula as an explicit formula; validation |
| `weil_form.py`, `weil_zeta.py`, `astar_fine.py`, `psl_fine.py` | statistic 3A |
| `realaxis.py`, `hankel_canon.py` | statistics 3B and 3C |
| `s0scan.py`, `twzeros.py` | real zeros and critical-line zeros of the twisted Z (reference data) |
| `numvar.py` | combination 4 |
| `job_*.sh`, `run_ff.sh` | launch scripts |

| run | where | size | wall time |
|---|---|---|---|
| census, exact Python pass (`rh-s2ff-a`, `rh-s2ff-b`; stopped when the streaming version replaced them) | server, 3 + 5 cores | 50 cells, largest 123,133 members (q = 37, g = 2) and 96,086 (q = 3, g = 4) | about 9 min |
| census, streaming (`rh-s2st-a`, `rh-s2st-b`, `rh-s2ck0..2`) | server, 3 cores, then 3 units of 2 cores | 72 cells; largest cells q = 17, g = 3 (2.7e8 tested, 4.75e7 members), q = 5, g = 4 (2.8e8 tested, 1.48e7 members), q = 7, g = 4 (8.00e9 tested, 4.16e8 members, in three residue classes of c_1) | 248 s, 105 s, 3 x 15 min |
| length spectrum (`rh-s2geod`) | server, 2 cores | trace <= 20,000 (8.4e7 words) and <= 200,000 (8.43e9 words, norm <= 4.0e10), 10 characters | 23 min |
| character families (`rh-s2fam`, `rh-s2fam2`) | server, 3 + 1 cores | trace <= 40,000 (3.4e8 words), 14 + 7 characters; real zeros of 21 characters | 26 min, 22 min |
| Weil forms and number variance (`rh-s2weil`) | server, 2 cores | supports to 24 (step 0.05) and 12 (step 0.025); zeta side to 17 (prime powers to 2.4e7) | 4 min |
| real-axis statistics (`rh-s2real`) | server, 2 cores | 47 real nodes and 96 circle points for 8 characters and PSL2(Z); 19 zeros on the line with r < 5 for chi = (0.03, 0.05) | 100 min (stopped after the first zero list) |
| local | Mac, memcap 8 GB | validation cases, fine scans (matrices up to 999 x 999), rechecks, zero lists with r < 3.2 for two characters | seconds to 5 min each |

The server was heavily loaded (load average 150 to 200 on 48 cores); each unit obtained about 1.3 cores whatever its quota.
The largest scale asked for q = 7, g = 4 was reached; q = 8, 9 at g = 4, q >= 19 at g = 3 and q = 3 at g = 5 were not run
(3.6e10 and more polynomials each; they would add cells to the same tables). The length spectrum goes to norm 4.0e10
(the assignment asked for 1e7).

## 2. Definitions used (from the node sources)

Function field (source: `formalization/paper/function-field-twin-ladder.md`, sections 1, 3.4, 3.6; route 27).
P(T) = sum c_k T^k of degree 2g, integer coefficients, c_0 = 1, c_(2g-k) = q^(g-k) c_k (functional equation).
P(T) = prod (1 - alpha_i T), p_n = sum alpha_i^n, N_n = q^n + 1 - p_n, a_d = (1/d) sum_(e | d) mu(d/e) N_e
(closed-point counts; integers for every integer P), beta_i = alpha_i / sqrt q, S_n = q^(-n/2) p_n, S_0 = 2g.

- Census member: a_d >= 0 for all d <= 60, inside the box abs(p_k) <= g (q^k + 1), k <= g. RH member: all abs(beta_i) = 1.
  Fake: a census member that is not an RH member.
- T_N = [S_(j-k)], j, k < N. Proposition (PROVED in the source): for N >= 2g the number of negative eigenvalues of T_N is the
  number nu of off-circle pairs (ghost index). N_det = smallest N with a negative eigenvalue; T_N uses delays up to (N - 1) log q.
- Heat constant: H_t(theta) = b_0 + 2 sum_(k=1..g) b_k e^(t (k log q)^2/4) cos(k theta), b_k = c_(g+k) q^(-(g+k)/2);
  Lambda = inf of the t for which H_t has only real zeros. For g = 1: Lambda = 4 log(abs(a)/(2 sqrt q))/(log q)^2, P = 1 - aT + qT^2.
- Hasse-Weil-Serre at degree d: abs(N_d - q^d - 1) <= g floor(2 q^(d/2)).

Lemma 1 (PROVED; justifies the box). If a_d >= 0 for every d >= 1 then 1 <= abs(alpha_i) <= q for every i.
Proof. N_n = sum_(d | n) d a_d >= 0, so log Z(T) = sum N_n T^n / n has non-negative coefficients, Z = P/((1-T)(1-qT)).
If the radius of convergence R is infinite, Z is a rational function without zeros or poles, so Z = 1 and the alpha are {1, q}.
Otherwise T = R is a singular point of log Z (Pringsheim), so it is a zero or a pole of Z; log Z is non-negative and
increasing on (0, R), so it is not a zero; so R is 1/q or 1, and every zero 1/alpha_i of Z has modulus >= R >= 1/q
(a factor of P cancelled against the denominator has alpha in {1, q}).
The functional equation maps alpha to q/alpha, which gives abs(alpha) >= 1. Then abs(alpha^k + (q/alpha)^k) <= q^k + 1. QED.
The census uses d <= 60 inside this box; the minimiser of every cell was checked to d <= 200.

Selberg (sources: `src/data/route-28-selberg-zeta-freeze-sandbox-2026-10-12.js` read as text; `e1-selberg-twist-control/RESULT.md` and its `sel.py`).
Z(s, chi) = prod over primitive hyperbolic classes prod_(k>=0) (1 - chi(gamma) N(gamma)^(-s-k)).

- PSL2(Z): zeros at 1/2 +- i r_j (Maass forms, on the line), at s = 1, and at rho/2 (poles of the scattering coefficient
  phi(s) = Lambda(2s-1)/Lambda(2s); rho the zeros of zeta). Re-measured here: abs(Z) = 1.2e-13 at rho_1/2, 0.668 at the mirror point
  1 - conj(rho_1)/2, 8.6e-12 at 1/2 + 9.53369526135 i, 1.2e-16 at s = 1.
- Gamma(2) with chi(A) = e(a), chi(B) = e(b), singular at the three cusps (twists alpha = (a, b, a - b) mod 1): discrete spectrum only;
  functional equation Z(s) = Z(1-s) exp(2 pi int_0^(s-1/2) v tan(pi v) dv) c^(2s-1), c = prod 2 sin(pi alpha_j).
  SEL = a character with a real zero s_0 in (1/2, 1); kappa = s_0 - 1/2.
- Trace formula used as the explicit formula (h(r) = int g(u) e^(iru) du, g even):
  twisted: sum_j h(r_j) = I_(2 pi)[g] + Hyp_chi[g] - g(0) log c;
  PSL2(Z): sum_(j>=0) h(r_j) = I_(pi/3)[g] + Hyp[g] + Ell[g] + g(0) log(pi/2) - P1[g] - P2[g] + 2 sum_n Lambda(n) g(2 log n)/n,
  with I_A[g] = -(A/2pi) int_0^inf g'(u)/sinh(u/2) du, Hyp[g] = sum over classes of l_0 chi g(l)/(N^(1/2) - N^(-1/2)),
  Ell[g] = int_0^inf g(u) [(1/4)/cosh(u/2) + (2/3) cosh(u/2)/(cosh u + 1/2)] du, P1, P2 the digamma terms (formulas in `tf.py`).
  The last term is the continuous spectrum: its coefficients are the von Mangoldt function of zeta at lengths 2 log n.

## 3. Combination 1: Toeplitz order, ghost index, second-order law on the census

Finite consequence tested. If the ghost-index and Toeplitz statements had content beyond the location of the zeros, some
statistic of the counts a_d, d <= g, short of the complete matrix T_2g, would reject every fake in exact arithmetic.
Survival would be: such a statistic rejects all fakes in every cell.
Candidates: (i) T_(g+1) >= 0, which is the whole positivity information at delays <= g (CLASSICAL, Caratheodory-Fejer and
Fejer-Riesz: T_(g+1) >= 0 holds if and only if sum c_k S_k >= 0 for every non-negative trigonometric polynomial of degree <= g;
every Weil-explicit-formula bound with a test polynomial of degree <= g, in particular Oesterle-type bounds, is implied by it);
(ii) Hasse-Weil-Serre at all d <= g (uses integrality); (iii) both; (iv) the single-level Hasse bound abs(S_n) <= 2g for n <= 200.

Method. `ffstream.c` enumerates c_1..c_g inside the box (lower end of each range from a_k >= 0), screens a_d >= 0 for d <= 60
in long double with rejection threshold -1e-12 q^d, and classifies by the LDL^T pivots of T_2g (Jacobi eigenvalues when a pivot is
within 1e-9 of 0). `ffanalyze.py` repeats this in exact arithmetic for 50 cells.

Validation.
- Source values: 17 fakes at q = 3, g = 2 (same). At q = 5, g = 2 the census has 199 fakes; the source reports 198 (its search
  range is not stated; the difference of 1 was not traced). The mildest fake of the source, P = 1 - T - 6T^2 - 5T^3 + 25T^4, is
  the Lambda-minimiser found here with N_det = 4, first Hasse failure at n = 5, Lambda = 0.019947 (source: 0.020).
- Streaming classification against the exact pass: identical member, RH, fake, N_det-histogram and pass counts in all 50 cells
  (g = 1: 27 cells; g = 2: q <= 37; q = 2: g = 3, 4, 5; q = 3: g = 4), and min Lambda equal to 2e-8.
- In the exact cells every fake has Lambda > 0 and every RH member has Lambda <= 0, with one float exception:
  (1 - T + 3T^2)^4 (fourfold zeros) returned 5.6e-9; its true value is 0.
- Splitting a cell into residue classes of c_1 and merging reproduces the unsplit run (q = 3, g = 4).

Results (EXACT in the 50 cells named above, MEASURED in long double elsewhere; table from `summarize_ff.py`).
Columns: fakes passing T_(g+1) >= 0; passing Serre at every d <= g; passing both; N_det histogram.

g = 1 (27 cells): 995 fakes in total, all with N_det = 2 and all rejected by Serre at d = 1 (which is the Weil bound).

| g | q | polynomials tested | census members | RH members | fakes | N_det histogram (N: fakes) | pass T_(g+1) | pass Serre d <= g | pass both | exact pass |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 2 | 60 | 23 | 23 | 0 | - | 0 | 0 | 0 | yes |
| 2 | 3 | 166 | 74 | 57 | 17 | 3: 8, 4: 9 | 9 | 14 | 9 | yes |
| 2 | 4 | 360 | 172 | 93 | 79 | 3: 45, 4: 34 | 34 | 55 | 34 | yes |
| 2 | 5 | 670 | 326 | 127 | 199 | 3: 113, 4: 86 | 86 | 131 | 86 | yes |
| 2 | 7 | 1744 | 880 | 205 | 675 | 2: 12, 3: 471, 4: 192 | 192 | 312 | 192 | yes |
| 2 | 8 | 2562 | 1303 | 252 | 1051 | 2: 28, 3: 788, 4: 235 | 235 | 386 | 233 | yes |
| 2 | 9 | 3604 | 1843 | 309 | 1534 | 2: 51, 3: 1208, 4: 275 | 275 | 507 | 275 | yes |
| 2 | 11 | 6466 | 3336 | 401 | 2935 | 2: 184, 3: 2359, 4: 392 | 392 | 712 | 390 | yes |
| 2 | 13 | 10546 | 5474 | 513 | 4961 | 2: 427, 3: 4028, 4: 506 | 506 | 1010 | 506 | yes |
| 2 | 16 | 19422 | 10136 | 713 | 9423 | 2: 1189, 3: 7562, 4: 672 | 672 | 1416 | 672 | yes |
| 2 | 17 | 23224 | 12140 | 765 | 11375 | 2: 1843, 3: 8780, 4: 752 | 752 | 1496 | 752 | yes |
| 2 | 19 | 32254 | 16895 | 897 | 15998 | 2: 3038, 3: 12068, 4: 892 | 892 | 1628 | 884 | yes |
| 2 | 23 | 56776 | 29843 | 1193 | 28650 | 2: 6718, 3: 20748, 4: 1184 | 1184 | 2230 | 1180 | yes |
| 2 | 25 | 72700 | 38243 | 1371 | 36872 | 2: 9301, 3: 26251, 4: 1320 | 1320 | 2750 | 1320 | yes |
| 2 | 27 | 91354 | 48094 | 1515 | 46579 | 2: 13835, 3: 31240, 4: 1504 | 1504 | 2934 | 1504 | yes |
| 2 | 29 | 112954 | 59526 | 1683 | 57843 | 2: 17877, 3: 38290, 4: 1676 | 1676 | 3094 | 1664 | yes |
| 2 | 31 | 137716 | 72628 | 1861 | 70767 | 2: 22618, 3: 46299, 4: 1850 | 1850 | 3742 | 1850 | yes |
| 2 | 32 | 151350 | 79837 | 1951 | 77886 | 2: 26267, 3: 49679, 4: 1940 | 1940 | 3832 | 1940 | yes |
| 2 | 37 | 233134 | 123133 | 2425 | 120708 | 2: 44348, 3: 73952, 4: 2408 | 2408 | 4852 | 2408 | yes |
| 2 | 41 | 316516 | 167289 | 2821 | 164468 | 2: 65664, 3: 95992, 4: 2812 | 2812 | 5240 | 2796 | no |
| 2 | 43 | 364786 | 192872 | 3031 | 189841 | 2: 76531, 3: 110292, 4: 3018 | 3018 | 6112 | 3018 | no |
| 2 | 47 | 475564 | 251572 | 3461 | 248111 | 2: 106338, 3: 138325, 4: 3448 | 3448 | 6530 | 3436 | no |
| 2 | 49 | 538504 | 284949 | 3711 | 281238 | 2: 121193, 3: 156405, 4: 3640 | 3640 | 7490 | 3640 | no |
| 2 | 53 | 680566 | 360267 | 4139 | 356128 | 2: 160951, 3: 191049, 4: 4128 | 4128 | 7974 | 4124 | no |
| 2 | 59 | 937354 | 496428 | 4861 | 491567 | 2: 239211, 3: 247510, 4: 4846 | 4846 | 9566 | 4846 | no |
| 2 | 61 | 1035466 | 548505 | 5109 | 543396 | 2: 264455, 3: 273847, 4: 5094 | 5094 | 9806 | 5086 | no |
| 2 | 64 | 1195110 | 633193 | 5521 | 627672 | 2: 310114, 3: 312118, 4: 5440 | 5440 | 11152 | 5440 | no |
| 3 | 2 | 1110 | 172 | 147 | 25 | 4: 1, 5: 12, 6: 12 | 24 | 24 | 24 | yes |
| 3 | 3 | 10143 | 1759 | 609 | 1150 | 3: 24, 4: 389, 5: 568, 6: 169 | 737 | 983 | 733 | no |
| 3 | 4 | 52626 | 9366 | 1541 | 7825 | 3: 897, 4: 4134, 5: 2363, 6: 431 | 2794 | 4681 | 2794 | no |
| 3 | 5 | 192727 | 34475 | 2890 | 31585 | 3: 5929, 4: 18783, 5: 5771, 6: 1102 | 6873 | 12374 | 6867 | no |
| 3 | 7 | 1390189 | 248556 | 7905 | 240651 | 2: 227, 3: 73752, 4: 143054, 5: 20386, 6: 3232 | 23618 | 51836 | 23618 | no |
| 3 | 8 | 3058136 | 546416 | 11748 | 534668 | 2: 1657, 3: 201144, 4: 295163, 5: 31880, 6: 4824 | 36704 | 85185 | 36694 | no |
| 3 | 9 | 6138737 | 1095159 | 17021 | 1078138 | 2: 3348, 3: 481496, 4: 540295, 5: 46364, 6: 6635 | 52999 | 132623 | 52999 | no |
| 3 | 11 | 20173353 | 3588406 | 30473 | 3557933 | 2: 45813, 3: 1941692, 4: 1471106, 5: 86672, 6: 12650 | 99322 | 255892 | 99119 | no |
| 3 | 13 | 54424815 | 9659672 | 50308 | 9609364 | 2: 194403, 3: 5908002, 4: 3339971, 5: 146060, 6: 20928 | 166988 | 460304 | 166859 | no |
| 3 | 16 | 187253494 | 33142242 | 94309 | 33047933 | 2: 1031019, 3: 22571514, 4: 9128336, 5: 278658, 6: 38406 | 317064 | 932691 | 317064 | no |
| 3 | 17 | 268702715 | 47524350 | 112250 | 47412100 | 2: 1972302, 3: 32841517, 4: 12215624, 5: 335738, 6: 46919 | 382657 | 1119502 | 382657 | no |
| 4 | 2 | 37259 | 1845 | 1035 | 810 | 5: 135, 6: 232, 7: 344, 8: 99 | 675 | 787 | 675 | yes |
| 4 | 3 | 1850681 | 96086 | 9812 | 86274 | 3: 275, 4: 10350, 5: 40810, 6: 23604, 7: 9558, 8: 1677 | 34839 | 63910 | 34838 | yes |
| 4 | 4 | 31329113 | 1631347 | 43408 | 1587939 | 3: 65634, 4: 507613, 5: 790122, 6: 167312, 7: 49143, 8: 8115 | 224570 | 590190 | 224570 | no |
| 4 | 5 | 284540299 | 14823355 | 130144 | 14693211 | 3: 1421519, 4: 7136561, 5: 5310308, 6: 628564, 7: 165605, 8: 30654 | 824823 | 2410484 | 824807 | no |
| 4 | 7 | 7998590634 | 415926051 | 699572 | 415226479 | 3: 82282395, 4: 247580006, 5: 79870094, 6: 4344723, 7: 976729, 8: 172532 | 5493984 | 18952414 | 5493984 | no |
| 5 | 2 | 2889608 | 33354 | 9064 | 24290 | 5: 733, 6: 4305, 7: 9057, 8: 5045, 9: 4368, 10: 782 | 19252 | 23311 | 19251 | yes |
| 6 | 2 | 414346831 | 1061673 | 104557 | 957116 | 5: 4900, 6: 70810, 7: 330461, 8: 239045, 9: 178295, 10: 74023, 11: 52835, 12: 6747 | 550945 | 866114 | 550944 | no |

Reading.
1. T_2g rejects every fake and accepts every RH member; this is the Proposition of the source, and T_2g is a function of
   (a_1..a_g) because the functional equation determines P from them. It is the exact decision "all 2g zeros on the circle".
2. N_det = 2g (delay (2g - 1) log q, the scale named in the node) is attained in every cell with g >= 2 that has fakes.
   At g = 2 the count with N_det = 4 equals the count passing T_3.
3. Delays <= g do not suffice. Both T_(g+1) and Serre at d <= g are passed by 9 of 17 fakes (q = 3, g = 2), 86 of 199
   (q = 5, g = 2), 34,838 of 86,274 (q = 3, g = 4), 19,251 of 24,290 (q = 2, g = 5), 550,944 of 957,116 (q = 2, g = 6),
   382,657 of 4.74e7 (q = 17, g = 3), 5,493,984 of 4.15e8 (q = 7, g = 4); 8,286,782 of 5.31e8 over all cells with g >= 2.
   The proportion falls with q at fixed g (most fakes at large q have a zero far from the circle and fail at N = 2 or 3).
4. Single-level Hasse: the first n with abs(S_n) > 2g reaches 137 (q = 4, g = 4 minimiser) and does not occur for n <= 200 for
   the minimisers at (q, g) = (2, 5), (2, 6), (5, 4), (7, 4) (eps = 0.0063, 0.0034, 0.0015, 0.00043); in the exact cell q = 2, g = 5,
   55 fakes have no failure at n <= 60.
5. Second-order law. For the fakes with nu = 1 in the exact cells, -lambda_min(T_2g)/eps^2 (eps = max log abs(beta)) lies between
   0.006 and 267 (median 7 to 156 per cell); for the 44 Lambda-minimisers with g >= 2 it lies between 0.038 and 238 with eps
   down to 0.00043. The eigenvalue is of order eps^2 with a constant that depends on the position of the ghost among the on-circle
   zeros; no fake has a first-order signal.
6. q = 2, g = 2 has no fake: all 23 census members satisfy RH.

Classification: CLOSED. The statistic that rejects every fake is the complete Toeplitz matrix of rank 2g, that is, the position
of every zero; over F_q this is finite because the genus is finite, and it is the same object as row Q6 of the map. Every candidate
that stops at delay g is passed by a positive proportion of the fakes. Geometric realisability (Hodge index on C x C) is the
input that removes the fakes, and it is not a statistic of finitely many counts short of T_2g.

## 4. Combination 2: the heat constant over the census

Finite consequence tested. If integrality made RH rigid under the heat flow, min over fakes of Lambda would be bounded below
uniformly in (q, g), and the minimisers would be visible to Hasse-Weil-Serre at degree <= g. Survival would be a uniform gap.

Method. Lambda by bisection on real-rootedness of the degree-g polynomial in x = cos theta on [-1, 1] (Sturm count in long double
in `ffstream.c`; a fake is bisected only if it is real-rooted at the current minimum, so the minimum of the cell is found without
bisecting every fake). Each minimiser was then rechecked by `ff_recheck.py`: counts for d <= 200 and inertia in exact arithmetic,
Lambda at 40 digits with polynomial roots. All 71 minimisers pass the exact checks (counts to d = 200, nu, N_det, Serre as reported by the stream);
stream and 40-digit values of Lambda agree to 2e-5 relative in the worst cell (q = 11, g = 3) and to 1e-8 in most. The table gives the 40-digit values.

Validation: g = 1 closed form reproduced in all 27 cells (the minimiser is a = floor(2 sqrt q) + 1 in each, so
min Lambda = 4 log((floor(2 sqrt q) + 1)/(2 sqrt q))/(log q)^2); E/F_5 example of the source, 0.172292; source range
"+0.020 to +0.172" is the range of its listed examples, the census maximum at q = 5, g = 2 is 0.310.

Results (minimum over the fakes of each cell).

g = 1 (27 cells, q = 2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19, 23, 25, 27, 29, 31, 32, 37, 41, 43, 47, 49, 53, 59, 61, 64): min Lambda = 0.4903, 0.4767, 0.4644, 0.1723, 0.1327, 0.05448, 0.1277, 0.03744, 0.06312, 0.06129, 0.04359, 0.0147, 0.01696, 0.0368, 0.02093, 0.007444, 0.02536, 0.01961, 0.02035, 0.004355, 0.01847, 0.005622, 0.01822, 0.007551, 0.009785, 0.005682, 0.01402.

| g | q | min Lambda over fakes | minimiser (c_1..c_g) | nu | N_det | Serre d <= g | eps | -lambda_min(T_2g)/eps^2 | first n with abs(S_n) > 2g |
|---|---|---|---|---|---|---|---|---|---|
| 2 | 3 | 0.0713344 | [-1, -3] | 1 | 4 | pass | 0.2108 | 10.2 | 5 |
| 2 | 4 | 0.047289 | [-1, 9] | 2 | 3 | reject | 0.2164 | 11.5 | 2 |
| 2 | 5 | 0.0199475 | [-1, -6] | 1 | 4 | pass | 0.1622 | 9.78 | 5 |
| 2 | 7 | 0.00223419 | [-7, 23] | 1 | 4 | pass | 0.06526 | 0.507 | 5 |
| 2 | 8 | 0.00543331 | [-2, -5] | 1 | 4 | pass | 0.1089 | 10.1 | 8 |
| 2 | 9 | 0.00851178 | [-1, 19] | 2 | 3 | reject | 0.1443 | 10.2 | 2 |
| 2 | 11 | 0.00130375 | [-8, 31] | 1 | 4 | pass | 0.06139 | 0.86 | 9 |
| 2 | 13 | 0.000495623 | [-5, 10] | 1 | 4 | pass | 0.04041 | 5.98 | 10 |
| 2 | 16 | 0.00302518 | [-1, 33] | 2 | 3 | reject | 0.1083 | 9.63 | 2 |
| 2 | 17 | 0.000956504 | [-1, -26] | 1 | 4 | pass | 0.06204 | 8.98 | 7 |
| 2 | 19 | 0.000124581 | [-7, 23] | 1 | 4 | pass | 0.02325 | 4.2 | 25 |
| 2 | 23 | 0.000451464 | [-2, -27] | 1 | 4 | pass | 0.04715 | 9.59 | 5 |
| 2 | 25 | 0.0014405 | [-1, 51] | 2 | 3 | reject | 0.0866 | 9.28 | 2 |
| 2 | 27 | 0.000351723 | [-3, -23] | 1 | 4 | pass | 0.04374 | 9.95 | 8 |
| 2 | 29 | 5.4748e-05 | [-13, 82] | 1 | 4 | pass | 0.01762 | 0.84 | 14 |
| 2 | 31 | 0.000137677 | [-15, 105] | 1 | 4 | pass | 0.02851 | 0.443 | 21 |
| 2 | 32 | 8.57546e-05 | [-16, 117] | 1 | 4 | pass | 0.0227 | 0.317 | 11 |
| 2 | 37 | 0.00017869 | [-1, -62] | 1 | 4 | pass | 0.03415 | 8.67 | 16 |
| 2 | 41 | 3.43199e-05 | [-5, -18] | 1 | 4 | pass | 0.01538 | 9.89 | 17 |
| 2 | 43 | 4.23934e-05 | [-9, 32] | 1 | 4 | pass | 0.01732 | 6.07 | 10 |
| 2 | 47 | 0.000107826 | [-3, -53] | 1 | 4 | pass | 0.02828 | 9.64 | 18 |
| 2 | 49 | 0.00050399 | [-1, 99] | 2 | 3 | reject | 0.06186 | 8.9 | 2 |
| 2 | 53 | 2.3216e-05 | [-25, 258] | 1 | 4 | pass | 0.01353 | 0.0464 | 33 |
| 2 | 59 | 4.90505e-05 | [-3, -72] | 1 | 4 | pass | 0.0202 | 9.5 | 5 |
| 2 | 61 | 4.50651e-05 | [-21, 206] | 1 | 4 | pass | 0.01952 | 0.447 | 26 |
| 2 | 64 | 0.000338104 | [-1, 129] | 2 | 3 | reject | 0.05413 | 8.78 | 2 |
| 3 | 2 | 0.0168912 | [-3, 4, -5] | 1 | 6 | pass | 0.06412 | 2.18 | 20 |
| 3 | 3 | 0.00263212 | [0, -1, 7] | 1 | 6 | pass | 0.0399 | 30.8 | 28 |
| 3 | 4 | 0.000675728 | [-3, -2, 19] | 2 | 5 | pass | 0.0255 | 31.9 | 17 |
| 3 | 5 | 0.000240577 | [8, 31, 81] | 1 | 6 | pass | 0.01767 | 0.0383 | 56 |
| 3 | 7 | 2.90134e-05 | [-5, 17, -57] | 1 | 6 | pass | 0.007412 | 3.6 | 63 |
| 3 | 8 | 5.22997e-05 | [0, 7, -27] | 2 | 5 | pass | 0.01063 | 44.5 | 22 |
| 3 | 9 | 3.61819e-05 | [-3, 13, -65] | 2 | 5 | pass | 0.009346 | 49.7 | 33 |
| 3 | 11 | 5.09983e-06 | [-5, 19, -89] | 1 | 6 | pass | 0.003829 | 8.04 | 135 |
| 3 | 13 | 3.10285e-06 | [-12, 77, -337] | 1 | 6 | pass | 0.003195 | 0.134 | 113 |
| 3 | 16 | 1.52196e-06 | [-3, -4, 115] | 2 | 5 | pass | 0.002419 | 44.5 | 122 |
| 3 | 17 | 1.31215e-06 | [-3, -1, 109] | 2 | 5 | pass | 0.002295 | 43.5 | 61 |
| 4 | 2 | 0.00361548 | [-1, 2, 1, -2] | 2 | 7 | pass | 0.02952 | 81.8 | 23 |
| 4 | 3 | 7.36125e-05 | [-4, 4, 5, -17] | 2 | 7 | pass | 0.006666 | 51.1 | 55 |
| 4 | 4 | 1.1681e-05 | [-4, 8, -7, 9] | 2 | 7 | pass | 0.00335 | 100 | 137 |
| 4 | 5 | 1.8476e-06 | [1, -6, -6, 32] | 2 | 7 | pass | 0.001547 | 96.4 | none <= 200 |
| 4 | 7 | 9.93612e-08 | [1, 3, -4, 57] | 2 | 7 | pass | 0.0004337 | 84.2 | none <= 200 |
| 5 | 2 | 0.000164367 | [-1, -1, 5, 2, -9] | 2 | 9 | pass | 0.006285 | 45.3 | none <= 200 |
| 6 | 2 | 4.70102e-05 | [-1, 1, 2, 2, -4, 17] | 2 | 11 | pass | 0.003361 | 238 | none <= 200 |

Reading.
1. The gap is positive in each cell (finite set) and tends to 0 in both directions. Least-squares slopes of log(min Lambda)
   against log q over q >= 4: -1.29 (g = 1, 25 cells), -2.25 (g = 2, 25 cells), -4.37 (g = 3, 9 cells), -8.5 (g = 4, 3 cells:
   1.17e-5, 1.85e-6, 9.94e-8 at q = 4, 5, 7). At fixed q = 2: 0.490, none, 0.0169,
   0.00362, 1.64e-4, 4.70e-5 for g = 1..6; at q = 3: 0.477, 0.0713, 0.00263, 7.36e-5 for g = 1..4.
2. Serre at d <= g: passes the minimiser in every cell with g >= 3 and in every cell with g = 2 except q = 4, 9, 16, 25, 49, 64,
   where the minimiser is P = 1 - T + (2q+1)T^2 - qT^3 + q^2T^4 (nu = 2, N_det = 3), rejected at d = 2 because abs(p_2) = 4q + 1.
   At g = 1 Serre at d = 1 is the Weil bound and rejects every fake.
3. The minimisers have N_det = 2g or 2g - 1 and eps between 0.00043 and 0.22: they are the fakes closest to a repeated zero on the line.
4. RH members: Lambda <= 0, and Lambda = 0 exactly when a zero is repeated. So the supremum over RH members is 0 in most cells
   and the infimum over fakes is positive and small: a gap around 0 that closes as q or g grows.

Classification: CLOSED. Lambda > 0 is by definition the presence of an off-line zero, so the statistic is the zero location.
The integrality gap exists per cell and is not bounded below. For zeta the constant is >= 0 (Rodgers-Tao), so there is no gap to transfer.

## 5. Combination 3: ladder statistics on Selberg zeta functions

Objects. PSL2(Z); Gamma(2) with 25 characters: (0.005, 0.01), (0.01, 0.02), (0.02, 0.03), (0.03, 0.05), (0.05, 0.12),
(0.10, 0.25), (0.25, 0.60), (1/3, 2/3), and the line chi_s = (0.6 s, s) for s = 0.055(0.005)0.09, 0.10, 0.11 and
s = 0.081, 0.082, 0.083, 0.0835, 0.0838, 0.0842, 0.0845. Real zeros (`s0scan.py`, MEASURED; the two values of the e1 lane are
reproduced to 10 digits): 14 characters have one real zero in (0.505, 1), with kappa from 0.477 to 0.020; 11 have none
(the threshold on the line chi_s is between s = 0.0835 and 0.0838; kappa^2 decreases nearly linearly in s and extrapolates to 0 at s = 0.0836).
The four characters (0.05, 0.12), (0.10, 0.25), (0.25, 0.60), (1/3, 2/3) were not scanned here: the e1 lane found no real zero for them and the Jensen count of 5C is 0.

Length spectrum (`geod.c`). Closed words (n_1, m_1, ..., n_k, m_k) with trace <= tmax; per trace the sum over words of 1/k
(equals the sum over classes of 1/power index) and of (1/k) tr rho(M_w) for the induced representation.
Validation: class counts against the certified list of route 28 (`tmp/routes-b7-r28-geodesics-t8000.txt`) for every trace <= 3000:
maximum difference 2.4e-11; 34,075 words at trace <= 400 (e1 lane: same); Z(3, chi_(0.03,0.05)) = 0.99984070538178 from the words
(e1 determinant: 0.9998407053817947); Z_PSL2(Z)(2) = 0.95379960 (route 28: 0.9537995978); imaginary parts of the twisted sums below 2.2e-10.

Trace formula (`tf.py`). Validation for PSL2(Z): with h(r) = exp(-tau r^2), tau = 0.25, 0.1, 0.08, the geometric side equals
exp(tau/4) + sum over the first 10 Maass parameters to 1.3e-15, 6.7e-16, 6.0e-15 (the Maass part is 1.4e-10, 1.1e-4, 7.0e-4, so
the Maass parameters and every constant are tested; the overall factor of the elliptic term was fixed by this test, the other
terms were not adjusted). Zeta and L(chi_4) explicit formulas: equal to the sums over the first 10 zeros to 7 digits.
Twisted formula (`twzeros.py`, `twz_local.py`: zeros of Z(1/2 + ir, chi) by sign changes of the Hardy form; imaginary part of the
Hardy form below 1.2e-5 of its modulus, which checks the functional equation): for the SEL character (0.03, 0.05), with
h(r) = exp(-tau r^2), the geometric side equals exp(tau kappa^2) + sum over the 19 zeros with r < 5 to 2.9e-11, 3.9e-11, 5.7e-11,
7.8e-11 at tau = 1, 1.5, 2, 2.5 (values 1.90, 1.58, 1.47, 1.45); for (0.10, 0.25) (no exceptional zero) it equals the sum over the
5 zeros with r < 3.2 to 1.2e-12 at tau = 2.5, and the differences at tau = 1, 1.5, 2 (2.2e-5, 8.1e-8, 3.1e-10) are positive and
below the first omitted term. No constant of the twisted formula was adjusted.

### 5A. Weil form at bounded support

Statistic. f in the span of hat functions of step d on [0, A], g = f * f~, W(f) = sum over the spectrum of h = abs(F)^2 on the real
axis; M = matrix of W from the geometric side (a Toeplitz matrix; entries by Gauss-Legendre quadrature of the archimedean terms
and cubic-spline deposition of the lengths); statistic = smallest generalised eigenvalue of (M, Gram). A negative value at a
finite d is a negative value of the form (compression). Forms:

- W_chi (twisted Gamma(2)) = sum_j abs(F(r_j))^2 + F(i kappa) F(-i kappa); the last term is present only for SEL and can be negative.
- W_disc (PSL2(Z), discrete spectrum, j >= 1): needs the scattering term 2 sum Lambda(n) g(2 log n)/n.
- W_el: W_disc without that term (Euler product over geodesics and elementary factors only).
- Zeta side with the same basis: zeta, L(chi_4), the Liouville sign twist of the prime side, and chi_4 primes with zeta's archimedean terms.

Finite consequence: the support A* at which the smallest eigenvalue becomes negative, for each SEL, against kappa; survival would be
a failure of every control at a support not tied to kappa, with every RH-true object passing.

Results (MEASURED; step 0.05 to A = 24 on the norm-4.0e10 spectrum; A* on step 0.0125 or 0.025, unchanged under halving the step).

| object | first failing support | smallest eigenvalue at A = 4, 8, 12, 16, 24 |
|---|---|---|
| PSL2(Z), W_disc | none to 24 | 1.2e-6, 7.0e-8, 1.5e-8, 4.3e-9, 7.7e-10 |
| PSL2(Z), W_el (no zeta primes) | 1.52 (2 log 2 = 1.386; shortest geodesic 1.925) | -0.99, -2.9, -4.9, -6.9, -10.9 |
| PSL2(Z), W_disc without the geodesics | 2.04 | |
| PSL2(Z), constant eigenfunction kept (the analogue of the pole) | 1.5 | -1.5, -23, -193, -1.5e3, -8.0e4 |
| chi = (0.05, 0.12), (0.10, 0.25), (0.25, 0.60), (1/3, 2/3) (no exceptional zero) | none to 24 | 4.0, 1.9, 0.18, 0.11; 3.0, 0.088, 1.5e-4, 9.4e-7; at 24: 2.5e-8, 7.5e-9, 6.8e-9, 6.6e-9 |
| chi_s, s = 0.085, 0.09, 0.10, 0.11, 0.0838, 0.0842, 0.0845 (no exceptional zero) | none to 21 | at 21: 5.3e-7, 6.0e-7, 5.9e-7, 2.7e-7, 6.4e-8, 6.4e-8, 6.5e-8 |
| SEL (0.005, 0.01), (0.01, 0.02), (0.02, 0.03), (0.03, 0.05): kappa = 0.477, 0.450, 0.419, 0.340 | 7.26, 7.08, 7.01, 7.05 | at 24: -4.9e4, -2.7e4, -1.4e4, -2.5e3 |
| SEL chi_s, s = 0.055, 0.06, 0.065, 0.07, 0.075, 0.08: kappa = 0.315, 0.288, 0.257, 0.221, 0.177, 0.115 | 7.13, 7.21, 7.35, 7.55, 7.88, 8.55 | |
| SEL chi_s, s = 0.081, 0.082, 0.083, 0.0835: kappa = 0.0978, 0.0769, 0.0473, 0.0200 | 8.81, 9.25, 10.08, 11.68 | at 21: -8.3, -4.7, -1.6, -0.26 |
| zeta (pole terms on the arithmetic side) | none to 17 | 6.8e-8, 5.8e-10, 5.0e-11, 2.7e-11 (at 4, 8, 12, 16) |
| L(s, chi_4) | none to 17 | 6.8e-8, 3.3e-9, 5.6e-10, 5.2e-11 |
| Liouville sign twist of the primes, zeta's archimedean terms | 0.75 (log 2 = 0.69) | -8.6, -95, -776, -5.9e3 |
| chi_4 primes with zeta's archimedean terms | 1.0 | -4.8, -48, -388, -2.9e3 |

Facts.
1. Pass/fail of W_chi agrees with the presence of a real zero for all 25 characters where both were computed, including the four
   characters within 0.0003 of the threshold in s. This is an independent check of the twisted formula and of the classification.
2. PROVED: for A below the shortest length (3.525 for Gamma(2)) W_chi = I_(2 pi) + (-log c) norm(f)^2, which is >= 0 whenever c <= 1;
   so no SEL can fail below A = 3.525. MEASURED: the first failure is at 1.99 to 3.31 times the shortest length.
3. The detecting support grows as the zero approaches the line: A* = 4.64 + 1.80 log(1/kappa) for the five characters with
   kappa <= 0.115 (residuals at most 0.05); A* kappa falls from 3.5 to 0.23. In terms of the norm bound X = e^(A*) of the geodesics
   used: kappa is about 13 X^(-0.56).
4. The RH-true objects have a positive smallest eigenvalue that decays with the support (PSL2(Z): 1e-6 at 4, 8e-10 at 24;
   zeta: 7e-8 at 4, 3e-11 at 16). Fact 3 is the statement that an exceptional term of size kappa^2 becomes visible when this
   margin falls below it; the exceptional term enters at second order in kappa, as the ghost does in the function-field
   Toeplitz form (combination 1, item 5). The small values depend on the step d (PSL2(Z) at A = 12: 1.5e-8 at d = 0.05, 1.8e-9 at d = 0.025);
   their sign does not.
5. W_el fails on PSL2(Z), where the half-plane analogue of RH is a theorem: without the zeta primes the form is not the sum over
   the discrete spectrum. The continuous spectrum enters the geometric side through phi, that is through zeta on the 1-line
   (lengths 2 log n). In the task's wording: W_el does not measure the line; W_disc does, and it is positive for the reason that
   the Laplacian is self-adjoint, not through a property of the geodesic Euler product alone.

Classification: CLOSED. W is the Weil criterion: it fails exactly the objects with an off-line zero, and the support at which it
fails is tied to the distance of that zero from the line (fact 3). The off-line zeros of SEL are at height 0, so the comparison
"smaller than the height would explain" does not apply; the analogue of the round-1 pattern is the growth of A* as kappa tends to 0.

### 5B. Thin Hankel norm, in the form of the Schur condition at real nodes

Round-1 definition: the Hankel operator with symbol R_a(w) = X(w-a)/X(w+a) has norm <= 1 on every window if and only if R_a is
bounded by 1 in Re w > 0. Necessary condition used here: abs(X(x-a)) <= abs(X(x+a)) at every real x > 0 (one node; no window).
Completion: X_c(w) = Z(1/2+w, chi) G_c(w), G_c'/G_c = -log c - 2w psi(1/2+w) (no zeros or poles of G_c in Re w > -1/2; X_c is even:
the evenness defect of the computed values is between 3e-15 and 6e-8 over 8 characters and 23 node pairs).

Results (MEASURED on 0 < x < 0.46 from the transfer operator, shifts a = 0.02, 0.06, 0.1, 0.2; x >= 1 from the Euler product,
D(x) = d/dx log X_c = Z'/Z(1/2+x) - log c - 2x psi(1/2+x)).

| object | 0 < x < 0.46 | x >= 1 |
|---|---|---|
| SEL (0.005, 0.01), (0.01, 0.02), (0.02, 0.03), (0.03, 0.05) | fails at every shift; first failing node 0.02 to 0.30; max abs(R_a) = 3.9, 8.9, 151, 1202 | D < 0 from x = 3.75, 3.25, 3.0, 2.75 |
| (0.05, 0.12), (0.10, 0.25) (no exceptional zero) | holds: max abs(R_a) = 0.988 and 0.998 | D < 0 from x = 2.0 and 1.25: fails |
| (0.25, 0.60), (1/3, 2/3) (no exceptional zero) | fails from x = 0.02 (max 1.14 and 1.15) | D < 0 from x = 1.0 |

PROVED: Z'/Z(1/2+x) tends to 0 and 2x psi(1/2+x) tends to infinity, so D(x) < 0 for all large x for every character, and the same
holds after multiplying X_c by exp(beta w^2) for any real beta. So R_a is not a Schur function for any Selberg zeta of this family,
with or without exceptional zeros: X_c has order 2 and decays along the real axis (the Weyl term), while xi(1/2 + x) increases.
For PSL2(Z) the same Weyl term is present (area pi/3) and in addition the even completion must contain Lambda(1 - 2w), whose
zeros are at Re w = 1/4 (ARGUED from Z(s) phi(s) = Psi(s) Z(1-s); the zeros of Z at rho/2 and their absence at the mirror points
are measured above); it was not computed numerically.

Classification: CLOSED. The statistic fails on objects for which the analogue of RH is a theorem; in this sandbox it measures the
order of the completed function, not the line. It gives no information on why zeta passes it.

### 5C. Jensen count

Statistic: J = mean of log abs(Z) on the circle abs(s - 3/2) = 0.95 minus log abs(Z(3/2)) = sum over zeros in the disc of
log(0.95/abs(z - 3/2)) (Jensen's formula; the disc reaches Re s = 0.55). 96-point trapezoid rule, transfer operator.

| object | J | zero implied by J | reference |
|---|---|---|---|
| PSL2(Z) | 0.641778 | 0.999962 | s = 1 (constant eigenfunction) |
| SEL (0.005, 0.01), (0.01, 0.02), (0.02, 0.03), (0.03, 0.05) | 0.597490, 0.547142, 0.492199, 0.364065 | 0.97731866282864, 0.95032907389026, 0.91928327790035, 0.83989609003556 | s_0 from bisection: 0.97731866282851, 0.95032907389021, 0.91928327790043, 0.83989609003558 |
| (0.05, 0.12), (0.10, 0.25), (0.25, 0.60), (1/3, 2/3) | -2.3e-7, -2e-17, -1e-15, -7e-16 | none | no zero right of 0.55 |

Classification: CLOSED. A zero count on the region examined (round-1 item: the no-Jensen number is Littlewood's lemma on the window).
It separates SEL from the others by locating the zero. The mollified Jensen gap of round 1 (Levinson device) was not transplanted.

## 6. Combination 4: number-variance saturation from the orbit side

Statistic. Fluctuating part of the count of spectral parameters in a window of width D centred at E, smoothed by a Gaussian of
width eps in r: n(E, D) = (2/pi) sum over lengths of A_l exp(-eps^2 l^2/2) cos(lE) sin(lD/2)/l, A_l = l (sum of chi over the
classes of length l)/(N^(1/2) - N^(-1/2)); for PSL2(Z) the scattering lengths 2 log n with amplitude 2 Lambda(n)/n are added;
for zeta l = log n, A = Lambda(n)/sqrt n. Long-band variance: Var(D) = (2/pi^2) sum A_l^2 exp(-eps^2 l^2) sin^2(lD/2)/l^2,
plateau P = (1/pi^2) sum A_l^2 exp(-eps^2 l^2)/l^2. D_50 = first D with Var >= P/2. The node's saturation scale
L_sat = log(T/2pi)/(2pi log 2) is D l_0 = 1 in these units (l_0 = shortest length).
Public lists of Maass parameters to r = 1e4 are not in the repository; the trace-formula route of the assignment was used.
Smoothing eps removes lengths above about 5.5/eps, so this is the variance of the smoothed counting function, not of the raw list.

Finite consequence: D_50 l_0 of order 1 for every object (pass), and no dependence of the statistic on the presence of an
exceptional zero (calibration).

Validation: direct average of n(E, 1)^2 over 8192 centres E in [200, 1200] against the formula, eps = 0.4: 0.05909 against 0.05905
(PSL2(Z) geodesics), 0.03055 against 0.03052 (chi = (0.03, 0.05)), 0.08302 against 0.08310 (zeta).

Results (MEASURED; eps = 0.6, 0.4, 0.3, 0.25; zeta and L(chi_4) at 0.6 and 0.4 only, prime powers to 1.1e7).

| object | l_0 | D_50 l_0 | plateau P | share of the shortest length in P |
|---|---|---|---|---|
| zeta | 0.693 | 0.669, 0.534 | 0.0830, 0.117 | 0.51, 0.40 |
| L(s, chi_4) | 1.099 | 0.791, 0.643 | 0.0369, 0.0644 | 0.59, 0.43 |
| zeta with completely multiplicative random signs | 0.693 | identical to zeta | identical | identical |
| PSL2(Z), geodesics only | 1.925 | 0.866, 0.693, 0.558, 0.472 | 0.0092, 0.036, 0.080, 0.128 | 0.58, 0.31, 0.18, 0.13 |
| PSL2(Z), discrete count (geodesics and scattering primes) | 1.386 | 0.783, 0.589, 0.457, 0.374 | 0.024, 0.062, 0.112, 0.163 | 0.53, 0.30, 0.19, 0.14 |
| Gamma(2), trivial character, geodesic part | 3.525 | 1.04, 0.92, 0.78, 0.69 | 0.0014, 0.024, 0.095, 0.200 | 0.94, 0.65, 0.39, 0.26 |
| SEL (0.01, 0.02); (0.03, 0.05) | 3.525 | 1.04, 0.92, 0.79, 0.72; 1.04, 0.95, 0.86, 0.81 | 0.0014, 0.023, 0.087, 0.175; 0.0012, 0.019, 0.062, 0.109 | 0.94 to 0.29; 0.95 to 0.41 |
| (0.05, 0.12); (0.10, 0.25); (1/3, 2/3) (no exceptional zero) | 3.525 | 1.06 to 0.93; 0.99 to 0.71; 1.06 to 0.76 | 0.0005 to 0.024; 3.8e-5 to 0.0095; 0.0013 to 0.107 | 0.99 to 0.82; 0.76 to 0.12; 0.98 to 0.49 |
| line chi_s across the threshold, eps = 0.3: s = 0.075, 0.08 (SEL), 0.085, 0.09 (none) | 3.525 | 0.917, 0.934, 0.952, 0.952 | 0.0406, 0.0369, 0.0335, 0.0303 | 0.64, 0.67, 0.70, 0.73 |

Reading.
1. Pass in the sense of the node: D_50 l_0 is between 0.37 and 1.06 for all 29 objects and all smoothings; the scale is set by the
   shortest length, with a slow decrease as longer lengths are admitted (the plateau is then carried by longer orbits).
2. The scattering primes shorten l_0 of the PSL2(Z) discrete count from 1.925 to 2 log 2 = 1.386: the list statistic of Maass
   parameters contains the zeta primes.
3. Twisting changes the statistic only through the squared character sums over classes of equal length (plateau at eps = 0.25:
   0.200 untwisted, 0.175, 0.109, 0.024, 0.0095 for increasing twists). It varies smoothly across the threshold where the exceptional
   zero appears (last row). PROVED: the exceptional parameter i kappa contributes a non-oscillating term to the trace formula, so it
   does not enter n(E, D) for real E.
4. PROVED: Var depends on A_l^2 only, so every sign twist and unimodular twist of the prime amplitudes gives the same values as zeta.

Classification: CLOSED (round-1 pattern 2). A statistic of the on-line ordinate list, computed here from squared orbit amplitudes;
it cannot fail the sign twist, the unimodular twist or SEL, and by the round-1 result it is equal for zeta and T-NR.

## 7. Not done, and weakest steps

1. Nothing is interval-certified. Exactness is limited to the 50 census cells of the Python pass and to the 71 minimisers; the other
   22 cells are classified in 80-bit floating point with thresholds 1e-9 (pivots, eigenvalues) and 1e-12 q^d (counts). The agreement
   in the 50 exact cells is the evidence for the thresholds.
2. The census is "a_d >= 0 for d <= 60". Members that would fail at some d > 60 are counted as fakes; the minimisers were checked to
   d <= 200. Lemma 1 covers the box only for the condition at all d.
3. Monotonicity of real-rootedness in t (Polya) is used by the bisection as stated in the source; it was not re-proved for cosine polynomials.
4. The elliptic factor of the PSL2(Z) trace formula was fixed by the validation itself (three values of tau then agree to 1e-15).
5. Statistic 5B uses a necessary condition at real nodes, not the windowed Hankel norm of round 1; a failure at a node implies norm > 1
   on windows that resolve the node, which was not quantified. The PSL2(Z) case of 5B is argued, not computed.
6. Statistic 5C is the plain Jensen count; the mollified Jensen gap of round 1 has no transplant here.
7. Combination 4 uses the smoothed count from the orbit side, not a list of eigenvalues; the diagonal formula was checked on one band.
8. A* is an upper bound for the true threshold of the form (Galerkin compression); it was stable to 0.03 under halving the step.
9. Untwisted Gamma(2) (three cusps, 3 x 3 scattering matrix) was not run in 5A; its geodesic part appears in combination 4 only.
