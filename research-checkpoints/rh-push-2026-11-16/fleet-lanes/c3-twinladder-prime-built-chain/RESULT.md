# c3-twinladder-prime-built-chain: RESULT

Verdict: **precise obstruction**. The first lemma is decided in the negative and the idea stops there. No statement about zeros of zeta is claimed. Labels: PROVED (argument in this note), CLASSICAL (recalled, source not opened), MEASURED (mpmath, not interval arithmetic), ARGUED, OPEN. Unrefereed.

## 0. Summary

1. No stage E_X is Hermite-Biehler, in any normalisation by real symmetric factors. Theta_X = E_X^#/E_X has poles in the upper half-plane of three kinds: at s = 1 + 2 pi i k/log p (Euler factors), at s = 1 (the stage has no pole of zeta), and at s = 3, 5, 7, ... (the stage has no trivial zeros). The number of poles below height T is T theta(X)/pi + O(pi(X)), so the stage kernel has infinitely many negative squares: there is no Hilbert or Pontryagin space H(E_X), no ordering theorem, no Hamiltonian with indivisible intervals.
2. Adjoining one Euler factor is neither contractive nor expansive: |theta_p(s)|^2 - 1 has the sign of 2 cos(t log p) - p^(-sigma) - p^(sigma-1) for sigma > 1/2 (exact identity). K_X(w,w) is not monotone in X at any of the 20 test points in any of three normalisations (MEASURED: up/down steps close to 50/50 in the strip; sign changes at 14 of 20 points for zeta).
3. The limit that exists (Re s > 1) is the weighted Hardy space E_inf H^2, not H(E_inf): E_X^# -> 0 there while E_inf^# != 0. That limit is the same kind of object for zeta, for Liouville and for every unimodular twist U, and it holds no information about the strip. H(E_inf) itself is degenerate (Theta_inf is a Moebius factor: rank one), with or without RH.
4. Pivot (one): the Euler factor is lossless about exactly one vertical axis, Re s = 0, where theta_p = -p^(-s) and the prime chain is the Paley-Wiener chain of type theta(X); the gamma factor is Hermite-Biehler about no axis. Moving the axis from 0 to 1/2 turns the whole chain into negative squares, with the same density theta(X)/pi. This restates map rows G10 and Q10 in de Branges-space terms and is not an R4 mechanism.

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 6).

## 1. Plan and what is new

Assigned object: E_X(z) = (s-1) L(s) P_X(s), L(s) = pi^(-s/2) Gamma(s/2), P_X(s) = prod_{p<=X} (1 - p^(-s))^(-1), s = 1/2 - iz (Im z = Re s - 1/2). E^#(z) = conj E(conj z) corresponds to s -> 1 - s. First lemma: is the passage X -> X' an isometric or contractive inclusion of de Branges spaces, or monotone in the kernel diagonal.

Nearest map rows: G10 (passive cascade: each prime stub lossless relative to Re s = 0, valid for Re s > 1), Q10/Q11 (sections J-contractive iff Re Z >= 0; coverage of about (log t)^2/16 primes), P7 and node `de-branges-hamiltonian-xi` (HB of Xi + i Xi' is RH), c1-leeyang-krein-limit (limit symbol is a constant; the topology that reaches the strip is RH). New here: the Hermite-Biehler question for the Euler stage about Re s = 1/2 itself (pole list, exact per-factor identity, negative-square count, identification of the limit space, axis lemma). The route atlas of PR 27 was not re-read in this lane.

## 2. Work

Notation: Theta_arch(s) = L(1-s)/L(s), theta_p(s) = (1 - p^(-s))/(1 - p^(s-1)), Theta_X = Theta_arch prod_{p<=X} theta_p. For a real symmetric factor r(s) = r(1-s) (for example s(s-1)), E = r L P_X has E^#/E = Theta_X. The assigned factor (s-1) gives E^#/E = -(s/(s-1)) Theta_X; the factor s gives -((1-s)/s) Theta_X.

**Lemma 1 (PROVED; checked numerically, max relative error 1.5e-29 over 200 random points).** For s = sigma + it,

    |theta_p(s)|^2 - 1 = (p^(sigma-1) - p^(-sigma)) (2 cos(t log p) - p^(-sigma) - p^(sigma-1)) / |1 - p^(s-1)|^2.

Proof: expand |1 - p^(-s)|^2 - |1 - p^(s-1)|^2 = (p^(-2 sigma) - p^(2 sigma - 2)) - 2 cos(t log p)(p^(-sigma) - p^(sigma-1)) and factor.

Consequences for sigma > 1/2 (first factor positive): theta_p is expansive exactly where cos(t log p) > cosh((sigma - 1/2) log p)/sqrt p. On a vertical line with 1/2 < sigma < 1 this is a fraction (1/pi) arccos(cosh((sigma-1/2) log p)/sqrt p) of every period, tending to (1/pi) arccos(p^(-1/2)) at the line (1/4 for p = 2, -> 1/2 for large p). theta_p is contractive for all t only when p^(sigma-1) + p^(-sigma) >= 2, about sigma >= 1 + log 2/log p. theta_p has simple poles at s = 1 + 2 pi i k/log p. With a unimodular coefficient u (factor (1 - u p^(-s))^(-1), E^# formed with conj u) the identity holds with cos(t log p - arg u): Liouville and every twist U behave identically up to a phase shift.

So multiplication by theta_p is not a contraction and not an expansion on any half-plane Re s > c with c < 1 + log 2/log p: **no isometric or contractive inclusion H(E_X) -> H(E_X') and no monotone relation between kernels follows from the factor.** First lemma: negative.

**Lemma 2 (PROVED; residues MEASURED).** In Re s > 1/2, Theta_X has poles at
- (a) s = 1 + 2 pi i k/log p, k != 0, p <= X: simple (log p/log q is irrational, the other factors are finite and nonzero on Re s = 1, t != 0);
- (b) s = 1, order pi(X) + 1 (Gamma((1-s)/2) and each theta_p);
- (c) s = 2k+1, k >= 1: simple pole of Gamma((1-s)/2), and prod theta_p(2k+1) = prod (1 - p^(-2k-1))/(1 - p^(2k)) != 0.

Measured eps * Theta_X(s0 + eps), eps = 1e-8: at s0 = 3: -11.5 (X = 2), -1.4e-34 (X = 47), -3.5e-411 (X = 499); at s0 = 1 + 9.0647i: modulus 0.60, 0.024, 4.6e-4. Poles (b), (c) are archimedean: zeta cancels them with its pole at 1 and its trivial zeros, which come from the functional equation, not from any finite Euler product. Poles (a) are the Euler poles of P_X(1-s). Count: #{poles of kind (a) with |Im s| <= T} = sum_{p<=X} 2 floor(T log p/(2 pi)) = T theta(X)/pi + O(pi(X)), theta(X) = sum_{p<=X} log p.

Hence E_X is not Hermite-Biehler, and (CLASSICAL, Krein-Langer: a generalised Schur function with kappa negative squares has exactly kappa poles in the half-plane) the kernel K_X has infinitely many negative squares. The assigned "generalised de Branges theory" needs finite kappa; it does not apply. "A factor that clears the poles" does not exist among real symmetric factors, because Theta_X does not depend on them; a non-symmetric factor (1 - p^(-s)) removes the Euler factor itself.

**Lemma 3 (PROVED from Lemma 2 and CLASSICAL Pick-Nevanlinna on infinite sets).** For every nonempty open U in the upper half-plane, the kernel (1 - Theta_X(w) conj Theta_X(w'))/(s + conj s' - 1) is not positive semidefinite on U, even where its diagonal is positive. Proof: positivity on U gives a Schur function on the half-plane agreeing with Theta_X on U; by the identity theorem Theta_X would be bounded by 1, contradicting the poles.

MEASURED (dps 120, `zeros_pick.py`, table in `zeros_pick_partial.log`): Pick matrices on grids where max |Theta_X| < 1:

| X | box (sigma; t) | N | max abs Theta | lowest eigenvalue | negative eigenvalues |
|---|---|---|---|---|---|
| 2 | [0.6,0.9] x [13,15] | 9 / 20 / 40 | 0.878 | -9.0e-7 / -1.3e-6 / -2.2e-6 | 2 / 7 / 13 |
| 5 | [0.6,0.9] x [13.5,15] | 9 / 20 / 40 | 0.820 | -0.111 / -0.178 / -0.259 | 3 / 7 / 13 |
| 2 | [0.55,0.95] x [200,203] | 9 / 20 / 40 | 0.887 | -0.072 / -0.133 / -0.204 | 1 / 2 / 4 |

(For X = 47 on [0.6,0.9] x [14.2,14.8] the diagonal is already negative: max |Theta| = 1.98.) The largest eigenvalues are 8 to 55; negative eigenvalues below 1e-15 in modulus are at the level where only the count, not the value, is meaningful.

**Decisive test (MEASURED; `stage.py`, `stage_T123.json`, `stage_T123.log`).** K_X(w,w) = (|E_X|^2 - |E_X^#|^2)/(4 pi Im w) at the 20 points s = sigma + it, sigma in {0.55, 0.75, 0.95, 1.05, 1.5}, t in {3, 14.5, 40, 200}, over the 95 stages X = 2..499, in three normalisations: A = assigned factor (s-1); S = factor s; N = (1 - |Theta_X|^2)/(4 pi Im w).
- Monotone in X: **no**, at every point and in every normalisation. Up/down step counts in the strip are between 47/47 and 64/30; for sigma = 1.5 normalisation N is mostly decreasing (20-22 up, 72-74 down) and converges to 1/(4 pi) = 0.0795775 (Theta_X -> 0).
- Sign: for zeta, K_X(w,w) < 0 for some stage at 14 of the 20 points; at s = 0.55 + 40i, 0.75 + 40i, 0.95 + 40i it is negative for 88, 90, 93 of the 95 stages. For Liouville the same happens at t = 3 and t = 14.5 (76 to 94 stages); for a random unimodular twist at t = 3 and t = 40. The pattern differs by control only through which heights are affected.
- Share of the grid 1/2 < sigma < 1, 0 < t < 60 with |Theta_X| > 1 (`strip.py`): 0.154 (X = 2), 0.211, 0.261, 0.288, 0.329, 0.335, 0.368, 0.415 (X = 47): increasing with X, consistent with Lemma 1.

**Hamiltonian of the stage for X <= 50: not defined.** A Hamiltonian with indivisible intervals requires a Nevanlinna (or finite-index) Weyl function; by Lemma 2 the stage has infinite negative index for every X >= 2.

**xi_X = E_X + E_X^# (Gonek-type statement).** Zeros of xi_X are zeros of 1 + Theta_X. The statement "all zeros on the line" is false for the analytic stage (MEASURED, float64 grid plus mpmath refinement to residual < 1e-12, not certified; `strip.py`, `strip.json`, `zeros_pick_partial.log`):

| X | off-line zeros with 1/2 < sigma < 1, 0 < t < 60 | off-line zeros with 1/2 < sigma <= 1.6, 0 < t < 60 | crossings of Theta = -1 on the line |
|---|---|---|---|
| 2 | 0 | 6 | 14 |
| 3 | 0 | 16 | 14 |
| 5 | 1 (0.956887 + 42.835336i) | 31 | 14 |
| 7 | 1 (0.967172 + 44.965505i) | 44 | 14 |
| 11 | 8 | 55 | 14 |
| 13 | 7 | not run | 14 |
| 23 | 22 (lowest sigma: 0.600963 + 0.697644i) | not run | 14 |
| 47 | 34 | not run | 16 |

What is true (ARGUED from Lemma 1 plus the CLASSICAL Stirling bound log|Theta_arch(s)| <= -(sigma - 1/2)(log(|t|/2 pi) - O(t^-2)); constants not checked): on 1/2 < sigma <= 3/4, |Theta_X| < 1 once log(|t|/2 pi) > 2 sum_{p<=X} log p/(p^(1/4) - 1), so zeros of xi_X there lie on the line above a height that grows like exp(c X^(3/4)). This is the coverage theorem Q11 in the map. Gonek's 2012 theorem is recalled (source not opened) as a statement about P_X(s) + chi(s) P_X(conj s), which is not analytic in s and agrees with E_X + E_X^# only on the line; if that recollection is right, his statement does not transfer to the analytic stage, in agreement with the table.

**Limit space (PROVED for Re s > 1; MEASURED check).** On compact subsets of Re s > 1: E_X -> E_inf := (s-1) L(s) zeta(s) = 2 xi(s)/s, while |theta_p| <= (1 + p^(-sigma))/(p^(sigma-1) - 1) < 1/2 for large p, so Theta_X -> 0 and E_X^# -> 0. Therefore

    K_X(w,w') -> E_inf(w) conj E_inf(w') / (2 pi i (conj w' - w)),

the kernel of the weighted Hardy space E_inf H^2(Re s > 1/2). Measured at s = 2 + 10i: K_499 = 3.70481e-6, Hardy value 3.70495e-6, kernel of the limit function K_{E_inf} = -1.10e-7; |Theta_499| = 4.6e-207. Similar at 1.5 + 40i and 3.5 + 7i.
- The limit of the spaces is not the space of the limit: E_inf^# = 2 xi(s)/(1-s) != 0, and Theta_inf = -s/(s-1) (assigned normalisation, modulus > 1: K_{E_inf} is negative of rank one) or -(1-s)/s (factor s: positive of rank one, spanned by xi(s)/(s(s-1))). Both hold with or without RH.
- The limit kernel continues analytically to the whole half-plane and is positive there whatever the zeros of xi are; zeros of E_inf only force functions of the space to vanish. Membership is a computation with rational functions: xi/E_inf = s/2 is not in H^2; (E_inf + E_inf^#)/E_inf = 1/(1-s) has a pole at s = 1. Neither uses or gives information on zeros.
- In the strip 1/2 < sigma < 1 there is no limit: Theta_X hovers around modulus 1 (target value: a Moebius factor of modulus within O(1/t) of 1) and K_X changes sign with X. The kernel needs the stage at the reflected point 1 - s, i.e. the Euler product at Re < 1/2. The functional equation is not an input of any stage, so the reflected stage carries no approximation to the reflected function.

**Smoothed stages (PROVED estimate).** Replacing P_X by exp(sum_{n<=X} Lambda(n) n^(-s)/log n) removes poles (a) but gives, for real s -> +infinity, log|Theta| >= 2^(s-1) - O(s log s) -> +infinity: Theta is unbounded in the half-plane, and poles (b), (c) remain. The genuine Euler factor decays at the far right and has poles on Re s = 1; the exponential-polynomial factor has no poles and blows up at the far right.

## 3. Pivot: the axis on which the prime chain is lossless

**Lemma 4 (PROVED).** For real c let theta_p^(c)(s) = (1 - p^(-s))/(1 - p^(s-2c)) (reflection s -> 2c - conj s). It is analytic and bounded by 1 in Re s > c if and only if c <= 0; the factor (1 - p^(-s))^(-1) is analytic in Re s > c if and only if c >= 0. Both hold only at c = 0, where theta_p^(0)(s) = -p^(-s). The archimedean ratio L(2c - s)/L(s) has poles at s = 2c + 2k for every integer k > -c/2, so L is Hermite-Biehler about no axis.

Proof: put y = p^(c-s) (|y| < 1 exactly on Re s > c) and a = p^c. Then p^(-s) = y/a, p^(s-2c) = 1/(a y), and theta^(c) = y (y - a)/(1 - a y). For c < 0 (a < 1) this is y times a Blaschke factor with zero y = a in the disc: inner. For c = 0 it is -y. For c > 0 (a > 1) it has a pole at y = 1/a in the disc.

Consequences.
- About Re s = 0: Theta_X^(0) = (-1)^(pi(X)) exp(-s theta(X)). The model spaces are the Paley-Wiener spaces of type theta(X), nested isometrically; the canonical system is the free one (H = identity) and the prime p adds an interval of length proportional to log p. No indivisible intervals, no arithmetic beyond the list of lengths log p; a unimodular twist changes only a constant, and any Beurling prime system gives a chain of the same form.
- About Re s = 1/2: the same chain has T theta(X)/pi + O(pi(X)) poles below height T (Lemma 2), the sampling density of that Paley-Wiener space. The half-unit shift of axis converts the positive chain into negative squares one for one.
- Zeta's Theta about 1/2 is a constant (Moebius factor after normalisation): all those negative squares, the pole at 1 and the gamma poles cancel in the limit. A monotone or semicontinuous device cannot follow a count that goes to infinity and then to zero. This is the same wall as G10/Q10 (l^1 threshold at Re s = 1) and c1-leeyang-krein-limit (limit symbol constant). The pivot ends here.

## 4. Controls

| Control | Outcome | Step |
|---|---|---|
| U (unimodular twist), Liouville | Every lemma holds verbatim with cos(t log p - arg u). T2 measured for Liouville and a random U: same non-monotonicity and sign changes. Limit in Re s > 1 is E^U_inf H^2, of the same form; a zero of U's limit in the strip is not seen. | No step fails for U that does not fail for zeta: no separation. The requested "name what fails in the limit for U" has the answer: nothing specific to U; the limit step fails for zeta in the same way (E_X^# does not converge). |
| DH | No stage: a(6) != a(2)a(3), no Euler product; DH is a combination of two Euler products with different root-number phases, and a sum of stages is not a product of sections. | Not formulable (not a quantitative handle). |
| E_a | Stage P_X(s+a) P_X(s-a): factors lossless about Re s = -a and Re s = +a (Lemma 4), about 1/2 the same pole structure shifted to Re s = 1 +- a. | Same failure as zeta. |
| RZ_b | Reciprocal factors: Lemma 1 with the sign reversed (expansive where zeta's factor is contractive), poles replaced by zeros, shifted by 1 - b. | Same failure, mirrored. |
| Window translate | Lemmas 1-3 are covariant under t-translation except for Theta_arch; Pick negativity measured at t near 14 and near 200. | No window statement obtained. |
| Backward heat | No fixed Dirichlet series or Euler stage (coefficient cocycle 2t log m log n). | Not formulable. |
| TW (|eps| < 1 on primes), T-NR, Beurling | Factor (1 - u p^(-s))^(-1) with |u| != 1 or with Beurling primes: Lemma 2 poles move to Re s = 1 + log|u|/log p or to Beurling logs; Lemma 4 chain unchanged in form. | Same failure. |
| theta^w, phase-rotated transfer operator | No Euler-product stage for w != 1, 2; transfer operator not in this setting. | Not formulable / not run. |

## 5. Verdict

Precise obstruction. A chain of de Branges spaces built from Euler stages about Re s = 1/2 does not exist: each stage has infinitely many negative squares (density theta(X)/pi per unit height), adjoining a prime is neither contractive nor expansive, the kernel diagonal is not monotone, the stage's real part has off-line zeros in the strip from X = 5 on (measured), and the only limit that exists is a weighted Hardy space on Re s > 1 that is identical in form for zeta and for the twisted controls. The recorded gap "no Hamiltonian built from data other than the zeros" stays open; this lane shows the direct prime-built candidate is not a Hamiltonian at any finite stage.

## 6. Requirement flags

- **R1 (multiplicativity essential): false.** No positive conclusion was reached. The negative lemmas hold identically for unimodular twists, Liouville and Beurling systems; the axis-0 chain depends only on the lengths log p.
- **R2 (height-uniform, every window): false.** No conclusion about zeros. The negative statements (Lemmas 1-3) are window-independent, which is not what R2 asks.
- **R3 (fails for every control at a named step): false.** U, Liouville, E_a, RZ_b, T-NR, Beurling fail at the same step as zeta (Lemma 2); DH, backward heat, theta^w are not formulable.
- **R4 (reaches the critical line): false.** The monotone-limit statement fails on Re s = 1/2 (no monotonicity, no convergence of E_X^#); the limit exists only right of 1.

## 7. Three weakest steps

1. Off-line zeros of xi_X and the strip shares are float64-grid searches with mpmath refinement, not interval-certified, and the grid search can miss zeros (counts are lower bounds on what was found, not exact counts). Gonek's 2012 statement was recalled, not opened; the remark on its non-analytic form rests on that recollection.
2. "No limit in the strip" is MEASURED on X <= 499 at 12 strip points plus the structural remark about the reflected Euler product; it is not a proved non-convergence statement, and other renormalisations (pole-renormalised stages R_P of c1-leeyang-krein-limit, stages carrying the trivial zeros by hand) were not tested here. Removing poles (b) and (c) by such devices leaves poles (a), which Lemma 2 shows are intrinsic to P_X(1-s).
3. The infinite negative index uses the Krein-Langer pole count and Lemma 3 uses the Pick-Nevanlinna theorem on infinite sets, both recalled, not re-derived; the Pick eigenvalues below 1e-15 in modulus support only a sign count. The height threshold for on-line zeros is argued with unchecked constants.

## 8. Files

`stage.py` (stage functions; tests T1-T3), `stage_T123.json`, `stage_T123.log`; `zeros_pick.py` (Pick matrices T4; zero search to sigma <= 1.6, stopped after X = 11 because an unguarded root refinement hung), `zeros_pick_partial.log`; `strip.py` (guarded zero search inside the strip), `strip.json`, `strip.log`. All runs local through `scripts/memcap.sh 8`, single process, under 2 minutes each except the stopped one. The compute server was not used.
