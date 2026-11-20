# c18-tz-one-sided-bound-fe-reserve-bridge: N(theta) for 1/2 < theta <= 1 as positivity of a completed symbol

Internal working note, 2026-11-19, campaign round 18 (attack, kind: combine, R4 direct; paper lane, one small local check).
RH is open. No statement about zeros of zeta is made. NO QED.
Labels: PROVED (complete argument here) / PROVED-model (lattice model of c17) / CLASSICAL (recalled, not opened) / MEASURED / ARGUED / OPEN.

**Verdict: precise obstruction. The lane ends with a map row, on both stop conditions of the assignment: the statement is the Weil form on tests of band u, and a control (ZQ) passes.**

1. (PROVED; checked numerically at small P.) First lemma, with no error term from the approximate functional equation: for P an integer, u = log P, D_P(s) = sum_{n <= P} n^(-s),

       <h, (Arch - 2 Re A_P) h> = <h, (Arch - u) h> + sum over zeros beta of D_P of <h, kappa_beta h>,
       kappa_beta = convolution on L^2[0, u] with kernel e^((beta - 1/2) abs(xi)).

   A zero with Re beta < 1/2 gives a positive form (a Poisson kernel). A zero with Re beta > 1/2 gives an indefinite form. So N(theta) at height t is the inequality

       (Lg_t - u + 2M) Id + sum_beta kappa_beta >= 0   on vectors concentrated at height t,   Lg_t = log(t/2 pi),

   up to an explicit windowing term; the zero side differs from it by the pole term only, bounded by u P^(1/2) t^(-2k) norm(h_0^(k))^2. In symbol form the same identity is (1/2 pi) int sigma_P abs(g)^2 plus one rank-two form of signature (1, 1) per zero of D_P right of the line, with sigma_P(x) = 2 theta'(x) + 2 Re (D_P'/D_P)(1/2 + ix).
2. (PROVED.) The identity uses a_1 = 1 and nothing else. It holds verbatim for every Dirichlet series with a_1 = 1, with its own log-coefficients (Davenport-Heilbronn included). The consequence of Lemma E that the device uses is a property of the homomorphism n^(-s) -> n^(-s) C_(log n), not of multiplicativity. No step of the lane uses multiplicativity.
3. (PROVED.) The reflected half of the approximate functional equation with split P Q = t/2 pi has all its local frequencies at or above log(t/2 pi Q) = u. The band-u form does not see it. It decides which extension of the band data is taken, and nothing about the sign of the form inside the band.
4. Explicit completions (section 3). Each one found either is the zero measure itself (positive if and only if the zeros in the window are real), or is a phase symbol 2 (arg F)' of a splitting xi = F + F^#, which reproduces the band data only if F has no zero right of the line; that condition implies that all zeros are real (Hermite-Biehler; CLASSICAL) and is false for the partial sums: 34 to 41 percent of the zeros of D_P have Re beta > 1/2 at P <= 30, height <= 150 (MEASURED, small scale). The existence of some positive completion is N(theta) itself (Krein; c17 Remark K) and does not assume the zeros on the line.
5. Below the Nyquist band the statement is not the target. For theta' = u/Lg < 1 and M = 0, the control ZQ (zeta's own functional equation, one off-line quartet at offset eta) passes whenever u (sinh(u eta)/(u eta) - 1) <= Lg (1 - theta' - sin(pi theta')/pi) (PROVED-model). The right side is positive for every theta' < 1 and is 0 at theta' = 1. N(theta) with theta' < 1 is an open condition in each window: it is stable under small symmetric perturbations of the zero set, including small backward heat. A conclusion that holds for ZQ cannot be proved by an argument that fails for ZQ, so R3 is not attainable for this conclusion.
6. Flags: R1 false, R2 false, R3 false, R4 false. Score 0.

---

## 1. Plan, sources, what is new

Read: BRIEF to the end; c17-window-information-law-ctheta-u5 (RESULT_theory, tail, REFEREE: Theorems 1 to 6, Remark K, Lemma E, input N(theta), referee corrections E1 to E8); c17-rank2-gram-symmetric-blaschke-closure (verdict items 1 to 6: the apex kernel reads the reflection symmetry of the inserted zero set and nothing else that was found); g-spinor-square-root (blocks Gamma_+, Gamma_-; negative index = rank Gamma_- = number of off-line pairs; S = N/D with D = xi + alpha xi'); the controls table and notes of OBSTRUCTION_MAP section 2 (DH, HEAT, TW, EA, NR, ZQ, SG, NR-q, WT), rows P45, Q30, S12b. The directory s4-weil-sector-split-pole-schur has code and outputs and no RESULT.md; its pole-term Schur complement is used here only in the form of section 2.4.

Plan as assigned: (i) one displayed inequality for N(theta) with truncated prime data, the reflected half and the pole term, error explicit in t; (ii) controls on paper before any proof attempt; (iii) the status of the band below P = t/2 pi; (iv) the place of multiplicativity.

Recorded before: N(theta) is the complete band-u device with a window (c17 Theorem 1; classical frame, referee E6). Done here and not recorded there: the exact form of the prime side in the zeros of the partial sum D_P (Theorem A); the reduction of Lemma E to a_1 = 1; the spectral position of the reflected half (Lemma R); the splitting identity that ties the phase symbol to the antibridge block (Lemma C); the proved margin for ZQ below the Nyquist band (Proposition Z); the answer to the Nyquist question.

Decisive first test (paper): does the inequality, once written, contain a step that fails for a control with zeros off the line and zeta's functional equation? Outcome: no (sections 2.2, 4). ZQ passes. The lane stops there; the pivot allowed by the brief was used for section 3 (which explicit completions exist and what each assumes).

## 2. The first lemma

Notation as in c17: z = (rho - 1/2)/i; h in L^2[0, u]; g(z) = int h(s) e^(-isz) ds; f(z) = g(z) conj(g(conj z)); v_z(s) = e^(isz); T_Z = sum_z |v_z><v_(conj z)|; C_a the compression of the shift by a; A_P = sum_{n < P} Lambda(n) n^(-1/2) C_(log n). Explicit formula (CLASSICAL; normalisation of c15 Lemma 1, not re-derived):

    <h, T_Z h> = <h, Arch h> - 2 Re <h, A_P h> + 2 Re[ g(i/2) conj(g(-i/2)) ],      <h, Arch h> = (1/2 pi) int 2 theta'(x) abs(g(x))^2 dx.      (EF)

### 2.1 Theorem A (truncated explicit formula in the zeros of the partial sum). PROVED.

Let a_1 = 1, F(s) = sum a_n n^(-s), -F'/F = sum Lambda_a(n) n^(-s), P >= 2 an integer with a_P != 0, D_P(s) = sum_{n <= P} a_n n^(-s), u = log P, A_P = sum_{n < P} Lambda_a(n) n^(-1/2) C_(log n). For h in H^1_0[0, u], with the sum over zeros taken over abs(Im beta) < T, T -> infinity:

    -2 Re <h, A_P h> = (-u + log abs(a_P)) norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>,
    <h, kappa_beta h> = int int conj(h(s)) h(s') e^((beta - 1/2) abs(s - s')) ds ds'      (real coefficients; zeros in conjugate pairs).      (A)

[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep, from REFEREE.md E1: the term log abs(a_P) in display (A) is spurious. Corrected display: -2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>, for every a_P != 0, with truncation tail (u - 2 log abs(a_P))/(pi T). Hand check: D = 1 + a 2^(-s), P = 2, has left side 0 and zero sum u norm(h)^2. With the printed constant the identity fails by exactly log abs(a_P) on series with a_P != 1 (referee table: 1.0986, 1.3863, 0.6931, 0.6931). The verdict item 1, the claim line and the proposed map row already carry the constant -u. For the Davenport-Heilbronn series a_n = 0 at multiples of 5, so P must not be a multiple of 5. Map row P58.]

Proof.
(a) The map n^(-s) -> n^(-s) C_(log n) is a homomorphism from Dirichlet series to operators on L^2[0, u] (C_a C_b = C_(a+b), C_a = 0 for a >= u). It kills every term with n >= P. Hence the images of F and of D_P are equal, and so are the images of their logarithmic derivatives: the coefficients of -D_P'/D_P agree with Lambda_a(n) for n < P. No multiplicativity is used.
(b) D_P is an exponential polynomial with extreme terms 1 and a_P P^(-s). CLASSICAL (Hadamard factorisation of an exponential polynomial; the constant is fixed by the limits 0 and -log P of D_P'/D_P at Re s = +infinity and -infinity and the mean real part of the zeros): D_P'/D_P(s) = -(log P)/2 + c_0 + lim sum_{abs(Im beta) < T} 1/(s - beta), where c_0 is absorbed in the term log abs(a_P) of (A) (c_0 = 0 for a_P = 1).

[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep, from REFEREE.md E1: there is no c_0. D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta) for every a_P != 0; the sentence 'c_0 is absorbed in the term log abs(a_P)' is deleted.]
(c) For Re w large, int_0^infinity e^(-w xi) [ -sum_n Lambda_a(n) n^(-1/2) delta(xi - log n) ] d xi = D_P'/D_P(1/2 + w). The inverse transform of 1/(w - w_beta) is e^(w_beta xi) on xi > 0, and that of the constant is a point mass at 0, of which the Hermitian form takes twice the half: -u delta. The Hermitian conjugate side is the same sum because the zero set is closed under conjugation. On 0 < abs(xi) < u only n < P occur. QED.

Check of (c) on D(s) = 1 + 2^(-s): zeros at i pi (2k+1)/log 2, and sum_k e^(w_k xi) = log 2 sum_m (-1)^m 2^(-m/2) delta(xi - m log 2) by Poisson summation; the term m = 0 cancels -u delta, and the terms m >= 1 are -Lambda_D(2^m) 2^(-m/2). Agreement.

Convergence. For abs(Im beta) large, <h, kappa_beta h> = -2 (Re beta - 1/2) norm(h)^2/(Im beta)^2 (1 + o(1)) for h in H^1_0, so the sum converges absolutely and the tail beyond T is u/(pi T) norm(h)^2 (1 + o(1)) for a_P = 1 (mean of Re beta is 0).

Numerical check (`check_theorem_a.py`, float64, local, through memcap; `check_theorem_a.json`). h = sin^4(pi s/u) e^(i tau s); zeros of D_P by Newton iteration from a grid, abs(Im beta) < T.

| P | tau | zeros found / expected | left side / norm^2 | (left - right)(T) at T = 150 | times T | predicted tail u/pi |
|---|---|---|---|---|---|---|
| 3 | 0 | 52 / 52.5 | -0.004179 | 0.002284 | 0.343 | 0.350 |
| 3 | 7 | 52 / 52.5 | -0.000582 | 0.002289 | 0.343 | 0.350 |
| 5 | 0 | 76 / 76.8 | -0.103510 | 0.003548 | 0.532 | 0.512 |
| 5 | 11.3 | 76 / 76.8 | -0.003750 | 0.003569 | 0.535 | 0.512 |
| 8 | 4 | 98 / 99.3 | 0.256545 | 0.004534 | 0.680 | 0.662 |

At T = 600 (first run, printed to the terminal, not kept in the JSON file) the residual for P = 3 was 0.000562 at both tau, times T = 0.337: the residual scales as 1/T and equals the predicted tail within 2 to 4 percent. For P = 12, 20, 30 and for the non-multiplicative series (1, 1, -1, 2, 0.5) the zero finder returned 3 to 8 zeros fewer than the count T u/pi and the residual is larger (0.007 to 0.012); these rows do not check the identity. Status of the check: three values of P, complete zero lists, agreement to the truncation law. Not ball arithmetic.

### 2.2 Symbol form and the displayed inequality

With w_beta = beta - 1/2 = b_beta + i x_beta: e^(w abs(xi)) = -e^(-b abs(xi)) e^(i x abs(xi)) + 2 cosh(b xi) e^(i x abs(xi)) for b > 0. Summed over a conjugate pair the first part is the transform of a negative Poisson kernel and the second is the kernel of the pair form 2 Re[ g(z_beta) conj(g(conj z_beta)) ] of c17 Theorem 2. Hence, with

    sigma_P(x) = 2 theta'(x) + 2 Re (D_P'/D_P)(1/2 + ix) = (2 theta'(x) - log P) + 2 sum_beta (1/2 - Re beta)/abs(1/2 + ix - beta)^2,

**Lemma 1 (completed symbol; PROVED from Theorem A and (EF)).** For zeta, P an integer, u = log P, h in H^1_0[0, u]:

    <h, (T_Z + 2M) h> = (1/2 pi) int [ sigma_P(x) + 2M ] abs(g(x))^2 dx
                        + sum over zeros beta of D_P with Re beta > 1/2 of 2 Re[ g(z_beta) conj(g(conj z_beta)) ]
                        + 2 Re[ g(i/2) conj(g(-i/2)) ].                                                              (L1)

N(theta) at height t is: the first two lines are >= 0 for h = e^(ist) h_0. Error terms, for h_0 in H^k_0[0, u], norm(h_0) = 1:
- pole term: abs(2 Re[g(i/2) conj(g(-i/2))]) <= 2 u P^(1/2) abs(1/2 + it)^(-2k) norm(h_0^(k))^2 (PROVED: k integrations by parts; one factor carries e^(s/2) <= P^(1/2), the other e^(-s/2) <= 1). For theta' <= 1 and k = 1 this is at most 2 u t^(-3/2) norm(h_0')^2.
- window term: abs(<h, (Arch - Lg_t) h>) <= C (norm(h_0')/t + norm(h_0')^2 log t/t^2) with an absolute constant C (ARGUED: 2 theta'(x) = log(abs(x)/2 pi) + O(x^(-2)), and int (x - t)^2 abs(g)^2 dx = 2 pi norm(h_0')^2; the constant was not computed).
- approximate functional equation: no term. The comparison is made on logarithmic coefficients, where truncation is exact (Theorem A (a)), and not on values of zeta.

The symbol sigma_P contains the truncated prime data (its coefficients at n < P), the truncation completion (the coefficients of -D_P'/D_P at n >= P) and the reserve 2 theta'. If D_P had no zero right of the line near height t, then sigma_P >= (1 - theta') Lg_t - o(1) there and (L1) would give N(theta) with margin (1 - theta') Lg_t; the margin closes at theta' = 1, the Nyquist band.

### 2.3 Lemma R (position of the reflected half). PROVED.

In a window at height t, chi(1/2 + ix) m^(-1/2 + ix) has phase -2 theta(x) + x log m, of local frequency -(Lg_t - log m) + O(abs(x - t)/t). For m <= Q = t/(2 pi P) the frequency has absolute value at least Lg_t - log Q = log P = u. In the form (L1) only frequencies of absolute value below u are paired with abs(g)^2. So the reflected half enters (L1) nowhere. On the zero side: writing e^(i theta) zeta = E_P + F_2, with E_P = e^(i theta) D_P and F_2 the rest, the logarithm log(1 + F_2/E_P) carries the reflected half; Theorem A and (EF) together show that its total contribution to the band-u form is the pole term of (L1) and nothing else.

Consequence: the reflected half is a candidate for the frequencies above u (which extension), and cannot supply positivity inside the band. The positivity inside the band is a statement about the zeros of D_P alone (Theorem A), or about the zeros of zeta alone (EF).

### 2.4 Lemma C (splittings, phase symbol, antibridge block). PROVED for finite sums of exponentials; ARGUED in general.

Let G be real on the real line, G = F_1 + F_2, with F_2/F_1 -> 0 in the lower half plane (Re s -> +infinity) at exponential rate at least u. Then for band-u tests

    sum over zeros z of G of f(z) = (1/2 pi) int 2 (arg F_1)'(x) f(x) dx + sum over zeros z_0 of F_1 with Im z_0 < 0 of 2 Re f(z_0).

Proof: argument principle on a tall rectangle; on the lower side G'/G = F_1'/F_1 + (decaying faster than f grows); move the line back to the real axis and collect the residues of F_1'/F_1. Mass check for polynomials: (1/pi) Delta arg F_1 = n_good - n_bad, and the correction adds 2 n_bad. QED (finite sums).

Readings.
- F_1 = E_P: this is (L1).
- F_1 = D = (xi + alpha xi')/2, F_2 = N = (xi - alpha xi')/2 (square-root lane): the phase symbol is 2 (arg D)' = 2 alpha (Xi'^2 - Xi Xi'')/(Xi^2 + alpha^2 Xi'^2) on the line, non-negative exactly where the Laguerre expression is. The correction is one pair form of signature (1, 1) per zero of D in the half plane, that is, per pole of S = N/D there: it is the anticausal block Gamma_- of g-spinor-square-root in the band (negative index = number of such zeros). The band data are those of the phase symbol if and only if Gamma_- contributes nothing, which for the full form is RH (CLASSICAL: Lagarias; recorded in the square-root lane).
- Pole term: the pair at z = +-i/2 enters (EF) as a pair form with the opposite sign. Restricting h to the complement of v_(i/2), v_(-i/2) (two linear conditions; the Schur complement of the pole) removes it exactly; on windowed vectors it is already below 2 u t^(-3/2) norm(h_0')^2. It is not a source of positivity. This agrees with c17-rank2: reading the pole at 1 and the reflection separates nothing symmetric.

## 3. Completions and what each assumes

By c17 Remark K, N(theta) (unwindowed form) holds if and only if the band data extend to a positive measure. Candidates written explicitly:

| Completion | Band data correct | Positive | Assumes |
|---|---|---|---|
| C0: zero measure of zeta (all primes above P kept) | always (EF) | iff the zeros that the window sees are real | the target in the window |
| C1: sigma_P dx/2 pi (truncation completion) | iff D_P has no zero with Re beta > 1/2 that the window sees (L1) | then yes, with margin (1 - theta') Lg | false in the range checked: 18 of 52, 24 of 76, 30 of 98 zeros of D_P (P = 3, 5, 8; height <= 150) lie right of the line (MEASURED). ARGUED in general by Littlewood's lemma: 2 pi sum_(Re beta > 1/2) (Re beta - 1/2) = int log abs(D_P(1/2 + it)) dt + O(1), and the mean of log abs(D_P) on the line is positive for large P |
| C2: 2 (arg F)' for the exact Riemann-Siegel splitting xi-type = F + F^# (F = gamma factor times the Riemann-Siegel integral) | iff F has no zero right of the line | then yes | Hermite-Biehler for F, which implies all zeros real (CLASSICAL) and is more than RH. Whether the Riemann-Siegel integral has zeros right of the line: literature recalled (Siegel 1932; Arias de Reyna), not opened, not computed here |
| C3: 2 (arg D)' for D = xi + alpha xi' | iff Gamma_- = 0 | iff Laguerre inequality on the line | RH (Lagarias; square-root lane) |
| C4: any positive measure matching the band (Krein) | by definition | by definition | nothing; its existence is N(theta). Non-unique for theta' < 1 |

Answer to the question of the assignment. "Does the completion already assume the zeros on the line?" The completion supplied by the functional equation is C0 (the reflected half is the Poisson dual of the primes between P and t/2 pi, Lemma R), and C0 is positive if and only if the zeros seen by the window are real: yes, it assumes them. The phase completions C1 to C3 assume more than that, and C1 is false. Only C4 assumes nothing, and no construction of a C4 was found that is not one of C0 to C3.

## 4. Controls, run on paper against Lemma 1 and the inequality

The lemma is an identity. Step names: (S-id) the identity (L1)/(A); (S-res) the reserve: Arch equals zeta's 2 theta'; (S-pos) the inequality itself.

| Control | (S-id) | First step that fails, or pass | Status |
|---|---|---|---|
| Davenport-Heilbronn | holds verbatim (a_1 = 1; its own Lambda_a, not supported on prime powers; its own Arch, conductor 5) | (S-pos), through zero location only: off-line pairs with b >= b_0 have O(1) per unit height against the row density u/2 pi needed to hide (c17 W4). At its first off-line zero (b = 0.3085, t = 85.7) u b <= 1.3 for theta' <= 1: that pair is invisible | ARGUED (W4 is ARGUED, referee E4); not run. No structural step |
| E_a = zeta(s+a) zeta(s-a) | holds (coefficients Lambda(n)(n^a + n^(-a)), reserve 2 Lg) | (S-pos) by size: the Fejer vector gives 2 Lg + 2M - 2 Re sum_{n<P} Lambda(n)(n^a + n^(-a)) n^(-1/2 - i(t + tau))(1 - log n/u), whose mean square over tau is about P^(2a)/(4 a^3 u); on the zero side each ordinate contributes a term of size P^a/(u (x^2 + a^2)). Fails for every theta > 0 at large height | ARGUED (mean square by unique factorisation; a negative value of that order needs diagonal dominance of the zero sum, which is Montgomery's theorem for abs(alpha) < 1 under RH). The lattice-model pass of c17 referee E1 is a property of the model: on a lattice the transform of the ordinates vanishes on 0 < abs(xi) < Lg, for zeta it is Lambda(n) n^(-1/2) at log n and the factor 2 cosh(a xi) amplifies it |
| T-NR, fixed q | holds | passes for P <= q (c17 Theorem 6). For P > q the row has kernel 2 log q [1 + sum_m T_m(c/2)(e^(i m phi) C_(m log q) + h.c.)] with T_m(c/2) = cosh(m b log q): fails at large height by the size of the local parameter at q. For each t the member with q >= t^theta passes | PROVED-model for the pass; ARGUED for the failure. Reads non-temperedness at q, not multiplicativity |
| NR-q (q = 1 + sqrt 2) | holds as a generalised Dirichlet series | as T-NR: passes only for u <= log q = 0.88; fails when P^b exceeds a power of log t, b = arccosh(abs(c)/2)/log q | ARGUED. Size at the added generalised prime |
| ZQ | holds (coefficient measure Lambda plus a density; truncation in the Laplace sense) | **passes** for theta' < 1, M >= 0 (Proposition Z) | PROVED-model |
| Random completely multiplicative sign chains; Liouville | (A) holds for D_P^eps (a_1 = 1) | (S-res): zeta's reserve is not tied to the chain. For fixed t and a random chain the Fejer value 2 Re sum eps(p) log p p^(-1/2 - it)(1 - log p/u) is a sum of independent bounded terms with standard deviation about 0.41 u, against the ceiling Lg + 2M = u/theta' + 2M, that is 2.45/theta' standard deviations: positive probability of violation at every theta > 0 (lower exponential bound; ARGUED), observed 24 of 24 at theta >= 1 (c15, c16). For zeta the same ceiling is never crossed if its zeros are real. Liouville: needs T_Z <= 2 Lg + 2M on the band, false where k ordinates lie within 1/u and k theta' > 2 | ARGUED. This is the coefficient-reserve pairing: the ceiling is one-sided and belongs to the functional equation; nothing in the failure reads multiplicativity (the chain is multiplicative) |
| Backward heat (tau < 0) | prime side not formulable (no fixed Dirichlet series); zero side (EF)-type identity through its zero set | passes each window while its pairs there have u b below the one-pair threshold (tau = -0.1: b = 0.0216 at height 415, u b <= 0.09); fails where its pairs have left that range | ARGUED from the located zeros of the controls table; not run |
| Sign twist with 0 <= eps <= 1 (TW+) | (A) holds | (S-res) as for chains | ARGUED |

Outcome. ZQ passes; T-NR passes at each height for a suitable q; backward heat passes single windows. DH, E_a, fixed-q T-NR and the chains fail at (S-pos) or (S-res) through zero location, size or the missing reserve. No control fails at a step that reads multiplicativity. Sign chains do fail through the coefficient-reserve pairing, and that failure is not structural: it is the absence of zeta's functional equation.

**Proposition Z (ZQ below the Nyquist band; PROVED-model).** Lattice model of c17 (on-line ordinates on a lattice of density Lg/2 pi, u = theta' Lg, theta' < 1). Remove two adjacent ordinates g_1, g_2 and add the pair gbar +- i eta. Then

    T >= Lg - u (1 + abs(sinc(pi theta'))) - u (sinh(u eta)/(u eta) - 1) = Lg (1 - theta' - sin(pi theta')/pi) - mu(eta, u),

so the configuration passes the complete device with M = 0 whenever mu(eta, u) <= Lg (1 - theta' - sin(pi theta')/pi), and the right side is positive on 0 < theta' < 1 (the function theta + sin(pi theta)/pi has derivative 1 + cos(pi theta) >= 0 and value 1 at theta = 1) and equals 0 at theta' = 1.
Proof. T = Lg Id - |v_1><v_1| - |v_2><v_2| + T_pair on L^2 of an interval of length u <= Lg (c17 lattice identity). The sum of the two rank-one forms has norm u (1 + abs(sinc(u (g_2 - g_1)/2))) with u (g_2 - g_1)/2 = pi theta'. T_pair >= -mu(eta, u) (c17 Theorem 2 (c)). QED.
Near theta' = 1 the margin is Lg (pi^2/6)(1 - theta')^3 (1 + o(1)): it closes cubically. On zeta's own ordinates the exchange form was not run; c17 measured positive one-pair thresholds on the ordinates at 1e6, 1e9, 1e12 (0.90 to 0.99 of the lattice law at theta' = 1/2).

## 5. The Nyquist question

Round 17, lane 5: for u > Lg and M = 0 the complete device excludes every finite cluster in the lattice model, so the exact inequality is the target restricted to a window (c17 Theorem 4 (a)).

Band below (1/2 < theta' < 1), stated precisely.
- It is not the target. N(theta) holds for ZQ with small eta (Proposition Z), for rows of spacing at most 2 pi/u with any offset (c17 Theorem 6), and for small backward heat in a window. The form has a positive margin in the model (Lg (1 - theta' - sin(pi theta')/pi) against the exchange of two ordinates; Lg against an added pair), so the inequality is an open condition on the zero set.
- It is not known and not near known results. It excludes an added isolated pair beyond u b = A_1, sinh(A_1)/A_1 = 1 + 1/theta' + 2M/u (c17 Theorem 2 (d), PROVED-model): at theta' = 1, M = 0 this is b > 2.18/log(t/2 pi) measured from the line. The unconditional range of N(theta) is P <= ((1/4) log t log log t)^2 (c15).
- The completion does not have to assume the zeros on the line (C4), but each explicit one does (C0) or assumes more (C1 to C3), and the reflected half of the approximate functional equation is C0 (Lemma R).
- At theta' = 1 the margin of Proposition Z is 0 and above it the model excludes every finite cluster: the passage from "open condition" to "target in a window" happens at the band where the reflected half has length Q = 1, that is, where it is exhausted.

So for 1/2 < theta' < 1 the lane has a conclusion that would be a new theorem about zeros and is not RH in any window, a first lemma that is exact, and no step that uses multiplicativity or that fails for ZQ.

## 6. Where multiplicativity enters

Nowhere. Theorem A (a) replaces the use made of Lemma E: the logarithmic coefficients of the truncated series agree with those of the full series below P for every series with a_1 = 1. The product form of Lemma E needs complete multiplicativity and is not used by the device. The zeros of D_P for zeta and for a multiplicative chain differ in position, not in any identity; the inequality separates them through the reserve (section 4).

One item for a later lane, not pursued: (A) turns N(theta) into a statement about the zeros of the partial sums D_P at height t = 2 pi P^(1/theta'): the forms e^((beta - 1/2) abs(xi)) of the right zeros are compensated by the Poisson forms of the left zeros up to the margin Lg - u. For P >= t/2 pi this is the classical comparison of D_P with zeta and its pole term P^(1-s)/(1-s). For P = t^theta' with theta' < 1 no relation between the zeros of D_P and the functional equation was found here.

## 7. Requirement flags

- R1 false. The first lemma is an identity valid for every Dirichlet series with a_1 = 1. No failure of a control reads multiplicativity: T-NR and NR-q fail by the size of one local parameter, chains by the missing reserve.
- R2 false. Nothing is proved for zeta at any theta. Lemma 1 is exact and uniform in t; the inequality is not established.
- R3 false. ZQ passes (PROVED-model); T-NR passes at each height for suitable q; DH, E_a, backward heat are decided through zero location or size. Since N(theta) with theta' < 1 holds for ZQ whenever it holds for zeta (model), R3 cannot be met by any argument with this conclusion.
- R4 false. For theta' < 1 the conclusion does not reach the critical line: it leaves pairs with u b below the one-pair threshold. At theta' >= 1 it is the target in a window (c17).

## 8. Three weakest steps

1. Proposition Z and the pass or fail entries for T-NR, DH and backward heat are in the lattice model or ARGUED from it. On zeta's ordinates the lower frame bound of the on-line zeros is smaller near long gaps (a gap longer than 2 pi/u is common for theta' < 1), so the margin for ZQ depends on the place of the quartet; the exchange form was not run on the ordinates. The E_a row rests on RH for zeta and on diagonal dominance of a sum over zeros that was not written out.
2. Theorem A step (b): the Hadamard constant of an exponential polynomial is recalled, not opened. The check supports it for a_P = 1 at P = 3, 5, 8 only, in float64, through a truncation law (2 to 4 percent of a term of size 1e-3 to 5e-3); the rows with incomplete zero lists and the non-multiplicative series do not check it. The window term of Lemma 1 has an uncomputed constant, and (EF) is taken in the normalisation of c15 Lemma 1 without re-derivation.
3. Section 3 is a list of the completions found, not a classification. "No C4 other than C0 to C3 was found" is a statement about this lane. The claim that the Riemann-Siegel integral has zeros right of the line is recalled and not verified; the abundance of right zeros of D_P is measured at P <= 30 and height <= 150 and ARGUED beyond.

## 9. Proposed map row and hand-off

Proposed row (P-series, next to P45 and the c17 window row): "N(theta) for 1/2 < theta' = u/log(t/2 pi) <= 1, completed by the reflected half of the approximate functional equation. Exact first lemma: <h, (Arch - 2 Re A_P) h> = <h, (Arch - u) h> + sum over zeros beta of D_P of the convolution forms e^((beta - 1/2) abs(xi)) (left zeros positive, right zeros indefinite); valid for every Dirichlet series with a_1 = 1; no approximate-functional-equation error; pole term at most 2 u P^(1/2) t^(-2k) norm(h_0^(k))^2. The reflected half has frequencies >= u and is not seen by the band. Explicit completions: the zero measure (positive iff the zeros in the window are real) or a phase symbol of a splitting (needs Hermite-Biehler; false for D_P, about 35 to 40 percent of its zeros right of the line at small P). ZQ passes for theta' < 1 at M = 0 with margin Lg (1 - theta' - sin(pi theta')/pi) (lattice model); the margin is 0 at theta' = 1. Below the Nyquist band the statement is an open condition, not the target; above it, the target in a window. No step uses multiplicativity. PROVED (identity), PROVED-model (ZQ), ARGUED (other controls). `c18-tz-one-sided-bound-fe-reserve-bridge`."

Requests to the numerics lane c18-tz-band-completion-controls-server are in `FOR_NUMERICS_LANE.md` (five runs; none was run here). That lane's directory did not exist when this file was written.

Files: `RESULT.md`, `check_theorem_a.py`, `check_theorem_a.json`, `FOR_NUMERICS_LANE.md`, `lanes.jsonl`. No server unit was started by this lane.
