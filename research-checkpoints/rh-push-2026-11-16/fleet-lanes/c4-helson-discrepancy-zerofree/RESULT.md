# c4-helson-discrepancy-zerofree: power-saving discrepancy of a unimodular completely multiplicative chi and the zeros of F = sum chi(n) n^-s

Date: 2026-11-18. Kind: deepen (follows c3-helson-tail-fe-selector section 9). Status: unrefereed.
Labels: PROVED (argument in this note, same-agent check only), CLASSICAL (recalled), MEASURED (float64, finite range), OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction, with an exact proof.** Let chi be completely multiplicative, |chi(n)| = 1, S(x) = sum_{n<=x} chi(n) = c x + E(x), c != 0, E(x) = O(x^theta), theta < 1. Let sigma_0 be the largest real zero of F in (theta, 1), or theta if there is none.

1. (Theorem 1, PROVED.) sum_p (1 - Re chi(p)) p^(-sigma) converges for every sigma > sigma_0, and for every s_0 with Re s_0 > sigma_0:
   ord_F(s_0) + ord_F(conj s_0) = 2 ord_zeta(s_0).
   So in Re s > sigma_0 the zeros of F are the zeros of zeta (a conjugate pair of zeta zeros of order m carries total order 2m for F). A zero-free region for F inside Re s > sigma_0 is the same statement for zeta. The implication asked for is circular there.
2. The planner's first lemma in its stated form (deviation set thin with exponent theta) is not what holds. What holds is the quadratic form: sum_{p<=x} |1 - chi(p)|^2 << x^(sigma_0 + eps), hence sum_{p<=x} |1 - chi(p)| << x^((1 + sigma_0)/2 + eps), and F = zeta G with G an absolutely convergent non-vanishing Euler product on Re s > (1 + sigma_0)/2. The zero statement in item 1 holds on the larger half-plane Re s > sigma_0, where G need not converge absolutely.
3. sigma_0 cannot be replaced by theta (MEASURED, not proved). The decisive test gave the opposite of the expected outcome: the thin twist with b = 0.9 has a real zero of F at s = 0.9 (double; verified two ways) and measured discrepancy exponent about 0.43 to 0.45 on x <= 1e8, not about 0.9. Measured exponents for b = 0.5, 0.7, 0.9: about 0.27 to 0.31, 0.35 to 0.42, 0.43 to 0.45 (close to b/2). So "F has no zero in Re s > theta" is false on the measured evidence: real zeros lie in (theta, 1), and left of the top real zero non-real zeros that are not zeta zeros also occur (two-set example, section 4.4).
4. Best possible f. With r(theta) = sup of real zeros of F over all chi with exponent <= theta, and Theta = sup Re rho for zeta: the best f is f(theta) = max(Theta, r(theta)) (PROVED from Theorem 1, as a formula). The first term is zeta's own; the second is produced by thin sign twists and has nothing to do with zeta's zeros. Measured: r(theta) >= about 2 theta. f(0) < 1 is the statement Theta < 1 together with r(0) < 1; the first is a zero-free strip for zeta.
5. No step of Theorem 1 uses the additive spacing of the integers. It is a comparison of F with zeta and transfers verbatim to a Beurling system (F_B against zeta_B). It does not fail for Beurling systems at any step, so it gives no R3.

Score line of the assignment: not met. No implication with f(theta) < 1 is proved; the only content right of sigma_0 is zeta's.

## 1. Plan; what is new relative to c3, the atlas and the map

c3 left open: "sum chi(n) = c x + O(x^theta) forces no zero of zeta_chi in Re s > f(theta), f(0) < 1, by a method that does not go through zeta". This note decides the structure of that question: (i) the exact relation between zeros of F and zeros of zeta under the hypothesis; (ii) which deviation-thinness the hypothesis forces; (iii) whether zeros unrelated to zeta can occur right of theta. OBSTRUCTION_MAP rows nearest: control B (Beurling), TW- (sign twist), P14 (rate equals zero-free region, loop map f(theta) = theta). The Landau-type argument below is short and may be folklore; novelty not checked.

Source opened (abstracts only, arXiv API): the bounded-discrepancy theorem c3 attributed to "Klurman / Klurman-Mangerel" is Klurman-Mangerel-Pohoata-Teravainen, "Multiplicative functions that are close to their mean", Trans. AMS 374 (2021), arXiv:1911.06265: a completely multiplicative f: N -> C has sum f(n) = c x + O(1) with c != 0 iff f(p) = 1 for all but finitely many primes and |f(p)| < 1 at the remaining primes. For unimodular f this gives f = 1. This confirms c3 candidate 1a with the corrected citation (the "Rigidity theorems" paper, arXiv:1707.07817, proves Chudakov's conjecture under a finitely-many-values hypothesis). The abstract contains no power-saving (O(x^theta)) statement; the full text was not opened.

## 2. Theorem 1 and its proof

Set-up (CLASSICAL, partial summation). F(s) = c s/(s-1) + s int_1^inf E(x) x^(-s-1) dx is analytic in Re s > theta except for a simple pole at 1 with residue c, and |F(s)| << |s|/(sigma - theta) away from 1. Let F*(s) = conj F(conj s) = sum conj(chi(n)) n^-s (same properties), G = F/zeta, G* = F*/zeta, H = F F*/zeta^2 = G G*, all meromorphic in Re s > theta.

(a) PROVED. For Re s > 1, from the Euler products,
  log G(s) = sum_p sum_{k>=1} (chi(p)^k - 1) p^(-ks)/k,
  H(s) = exp(-2 A(s)),  A(s) = sum_p sum_{k>=1} (1 - Re chi(p)^k) p^(-ks)/k.
A is an ordinary Dirichlet series with coefficients a_n >= 0 (supported on prime powers). This is the only place complete multiplicativity and |chi| = 1 are used, and it is essential: without an Euler product there is no A.

(b) PROVED. H is analytic and non-zero at every real point of (sigma_0, inf): at s = 1, F and F* have simple poles and zeta^2 a double pole, H(1) = |c|^2 != 0 (uses c != 0); on (sigma_0, 1), H(sigma) = |F(sigma)|^2/zeta(sigma)^2 with F(sigma) != 0 by the definition of sigma_0 and zeta(sigma) finite and non-zero (zeta < 0 on (0,1)). sigma_0 is well defined: real zeros of F in (theta, 1) are isolated and cannot accumulate at the pole 1, so there is a largest one or none.

(c) PROVED (Landau's theorem). H has no zeros or poles in some simply connected open neighbourhood U of the ray (sigma_0, inf); -(1/2) log H (branch real on sigma > 1) continues A analytically to U. A Dirichlet series with non-negative coefficients has a singularity at the real point of its abscissa of convergence. Hence the abscissa of A is <= sigma_0: A converges absolutely in Re s > sigma_0.

(d) PROVED. exp(-2A) is analytic and non-vanishing in Re s > sigma_0 and equals the meromorphic function H on Re s > 1, hence on Re s > sigma_0. So ord_H(s_0) = 0 there: ord_F(s_0) + ord_F*(s_0) - 2 ord_zeta(s_0) = 0, and ord_F*(s_0) = ord_F(conj s_0). QED

Corollaries (PROVED).
- C1. Keeping only k = 1 in A: sum_p (1 - Re chi(p)) p^(-sigma) < inf for sigma > sigma_0. Since |1 - chi(p)|^2 = 2(1 - Re chi(p)): sum_{p<=x} |1 - chi(p)|^2 << x^(sigma_0 + eps), and by Cauchy-Schwarz sum_{p<=x} |1 - chi(p)| << x^((1 + sigma_0)/2 + eps).
- C2. G(s) = prod_p (1 - p^-s)/(1 - chi(p) p^-s) converges absolutely and is non-zero where sum_p |1 - chi(p)| p^(-sigma) < inf, in particular on Re s > (1 + sigma_0)/2.
- C3. F has a zero in Re s > sigma_0 iff zeta has one there. For real chi, F* = F and ord_F = ord_zeta at every point of Re s > sigma_0.
- C4. Converse direction (trivial): if sum_{p<=x} |1 - chi(p)| << x^beta, then with g = chi * mu, sum_{d<=y} |g(d)| << y^(beta + eps) and S(x) = sum_d g(d) [x/d] = G(1) x + O(x^(beta + eps)). So deviation exponent beta gives theta <= beta; the measured examples show theta can be about beta/2.
- C5. Best f: zeros of F with Re s > sigma_0(chi) are zeta zeros (Re <= Theta); zeros with Re s <= sigma_0(chi) have Re s <= r(theta). Both bounds are attained in the sup sense (chi = 1; the chi realising r). So the least admissible f(theta) is max(Theta, r(theta)).

Why the hypothesis c != 0 is needed: for c = 0, H(1) = 0, A diverges at 1, sigma_0 = 1 and the theorem is empty (Liouville: F = zeta(2s)/zeta(s), zeros at rho/2 which are not zeta zeros).

Asymmetry allowed by Theorem 1: for complex chi, a zeta zero rho of order m may carry order 2m at rho and 0 at conj rho for F. Not excluded, not exhibited.

## 3. What Theorem 1 does not give

- Left of sigma_0 (theta < Re s <= sigma_0) nothing is controlled. Section 4.4 exhibits (MEASURED) a non-real zero of F there that is not a zeta zero and whose conjugate is not a zero.
- Whether sigma_0 > theta can happen is not PROVED. The measured examples say yes. A proof needs a power saving for M_g(y) = sum_{d<=y} g(d): if M_g(y) << y^a and sum_{d<=y}|g(d)| << y^b, the hyperbola method gives theta <= b/(b + 1 - a) < b when a < b (PROVED as an implication). For the greedy set S below, G(s) = (s - b)^2 e^(h(s)) with h analytic in Re s > b - 0.475 (CLASSICAL input: prime gaps << x^0.525), but the growth of G in t left of b is controlled only through sums sum_{p in S, p ~ P} p^(-it) with P a power of t. For a set built from primes q via p_q ~ q^(1/b), G is zeta(s/b)^(-2) times a correction with the same problem, and the needed saving is zero-free-strip information on zeta. Deciding the first lemma unconditionally in the sharp form therefore runs into prime exponential sums; it does not avoid zeta.
- r(0): whether an exponent-0 chi (E << x^eps) can have a real zero in (0,1) is OPEN. Finite modifications have none in Re s > 0 (their G is a finite product, zeros of the factors lie on Re s = 0).

## 4. Decisive test and numerics (MEASURED)

All runs local, through scripts/memcap.sh 8, numpy float64/complex128, .venv-arb python; peak planned memory 2.5 GB; 2 to 10 s each. Server not used.

Construction (thin twist). T(x) = li(x^b) - li(2^b) (density t^(b-1)/log t, so pi_S(x) ~ x^b/(b log x)). S = greedy subset of the primes: p enters S iff count + 1 <= T(p). Tracking error max(T - count) = 2.41 on p <= 1e8 for b = 0.9; |S below 1e8| = 1,022,324. chi(p) = -1 on S, 1 elsewhere. Then sum_{p in S} p^-s = -log(s - b) + analytic, G(s) = (s - b)^2 e^h, F = zeta G has a double zero at s = b. c = G(1) = prod_{p in S} (1 - 1/p)/(1 + 1/p), tail beyond N by exp(-2 E_1((1-b) log N)).

Checks: F_series(s) = sum_{n<=N} chi(n) n^-s + c N^(1-s)/(s-1) - E(N) N^-s (the remaining term s int_N^inf E x^(-s-1) dx is dropped); F_euler(s) = zeta(s) prod_{p in S, p<=N} (1 - p^-s)/(1 + p^-s) exp(-2 E_1((s-b) log N)).

### 4.1 Greedy S, b = 0.9, N = 1e8 (`thin_twist.py greedy 0.9 1e8`)
- c = 0.0258404255; S(N)/N = 0.02584198.
- max |E| on [2^k, 2^(k+1)): k = 12: 34.1; 16: 122.8; 20: 437.5; 24: 1440; 25: 2209 (x^0.9 at 2^25 is 5.9e6). Fitted exponents of max: 0.41 to 0.45; of rms: 0.36 to 0.44.
- F_series(0.9) = -6.6e-6. F_series / F_euler: s = 0.91: -0.0032512 / -0.0032457; 0.92: -0.0144103 / -0.0144057; 0.95: -0.1382557 / -0.1382531; 0.97: -0.4395005 / -0.4394987; 1.1: 0.9063576 / 0.9063578; 0.9 + 3i: 0.73394 - 0.57307i / 0.73394 - 0.57307i; 0.95 + 14.134725i: 1.18374 + 0.47052i / 1.18383 + 0.47061i; 2: agreement to 1e-11.
- Order 2: K_P = e^(2 gamma) (log P)^2 prod_{p in S, p<=P} (1 - p^-b)/(1 + p^-b) = 3.14417, 3.14141, 3.14075, 3.14069, 3.14069, 3.14069 for P = 1e3..1e8 (converges; G(b + d)/d^2 -> K). K zeta(0.9) = -29.6; F_series(b + d)/d^2 = -32.5 (d = 0.01), -36.0 (0.02), -55.3 (0.05), decreasing towards the limit.

### 4.2 Other b, greedy, N = 1e8
- b = 0.5: c = 0.410747; exponents of max 0.20 to 0.31, rms 0.25 to 0.27; F_series(0.5) = -2.2e-4; K_P -> 3.772.
- b = 0.7: c = 0.214751; exponents of max 0.35 to 0.42, rms 0.32 to 0.39; F_series(0.7) = -6.2e-5; K_P -> 4.1998.

### 4.3 Random S and phase twist, b = 0.9
- Random S, P(p in S) = p^(b-1)/2 independently (`random`, seeds 1 and 2): G ~ zeta(s + 1 - b)^(-1) times a random factor; simple zero at b. Seed 1: c = 0.2289503, exponents of max 0.41 to 0.43; F_series(0.9) = -2.2e-5; F_series(b + d)/d = -27.9, -31.0, -48.1 against K zeta(b) = -25.4; series and Euler values agree to 1e-4 or better at the 8 test points. Seed 2: exponents 0.45 to 0.48.
- Phase twist (`phase 0.9 2e7`): chi(p) = exp(+- i phi_p), 1 - cos phi_p = p^(b-1), sign alternating with the prime index. Deviation sums: sum |1 - chi(p)| has exponent (1 + b)/2 = 0.95, sum (1 - Re chi(p)) has exponent 0.9. Measured discrepancy exponent 0.33 to 0.40 on x <= 2e7; F_series(0.9) = 1.3e-5 + 1.7e-6i, F_series(0.91) = -0.0714 - 0.0188i, F_series(0.92) = -0.162 - 0.043i (simple zero at 0.9). This is the extremal shape for C1: sigma_0 = 0.9, linear deviation exponent (1 + sigma_0)/2.

### 4.4 Two-set example: a non-real zero left of sigma_0 (`two_set.py 3e7`)
chi = -1 on S_1 (greedy, b_1 = 0.9), chi(p) = -p^(5i) on S_2 (greedy on the remaining primes, b_2 = 0.75), 1 elsewhere. Predicted G ~ (s - 0.9)^2 (s - 0.75)(s - 0.75 - 5i) e^h. Measured at N = 3e7: |F_series| = 0.0062 at 0.75 + 5i against 0.528 at 0.75 - 5i, 1.17 at 0.75 + 2.5i, 1.46 at 0.75 - 2.5i; 0.021 at 0.75; 0.0012 at 0.9. Truncation scale |E(N)| N^(-0.75) is about 0.012, so the values at 0.75 + 5i and 0.9 are consistent with zeros and the value at 0.75 is marginal (1.7 times the scale). max |E| is about 5000 near x = 1.6e7 (about x^0.51) and flat over the last three octaves; the exponent is not resolved, but it is below 0.75 on this range. Reading: at 0.75 + 5i, ord_F(s_0) + ord_F(conj s_0) = 1 != 2 ord_zeta = 0; this is allowed because Re s_0 < sigma_0 = 0.9, and shows the threshold sigma_0 in Theorem 1 cannot be lowered to theta.

### 4.5 Outcome of the decisive test
Expected by the planner: exponent about b and a zero at s = b, hence f(theta) >= theta. Found: zero at s = b (confirmed), exponent about b/2. The conclusion is stronger than expected: on the measured evidence f(theta) >= about 2 theta, so no implication "discrepancy theta gives zero-free Re s > theta" holds, and by Theorem 1 the zeros right of the top real zero are exactly zeta's. The test does not kill a positive idea; it removes the hoped-for intermediate statement.

## 5. Controls: which hypothesis each lacks, and where Theorem 1 stops

| Control | Hypothesis lacked | Step of Theorem 1 that fails / outcome |
|---|---|---|
| Beurling system with N(x) = c x + O(x^beta), beta < 1/2 (CLASSICAL, recalled, not opened: Hilberdink; Diamond-Montgomery-Vorhauer, zeros off the line with such N) | not an ordinary Dirichlet series over the integers | No step fails: Theorem 1 holds with zeta replaced by zeta_B wherever zeta_B is zero-free on the real segment. The comparison is relative, so it says nothing about zeta_B itself. This is why the hypothesis "power-saving discrepancy plus Euler product" alone cannot give a zero-free region, and why Theorem 1 gives no R3. |
| n^(-i alpha) | main term is c x^(1 - i alpha), not c x | (b): G G* = zeta(s + i alpha) zeta(s - i alpha)/zeta(s)^2 has a double zero at s = 1; sigma_0 = 1; empty. Zeros are translates of zeta's. |
| Liouville | c = 0 | (b): H(1) = 0, sigma_0 = 1. Zeros at rho/2 are not zeta zeros. |
| Davenport-Heilbronn | not multiplicative; no pole | (a): no Euler product, the logarithm of F/zeta has no sign-definite coefficients; Landau step unavailable. |
| Random Steinhaus chi | c = 0, exponent 1/2 only | (b): sum (1 - Re chi(p))/p diverges almost surely, sigma_0 = 1. (Helson: F zero-free in Re s > 1/2 almost surely; unrelated to Theorem 1.) |
| Finite modification of zeta | none (theta = 0 up to logs, c != 0) | Theorem 1 applies with sigma_0 = 0: zeros in Re s > 0 are zeta's. The statement is proved for this control only relative to zeta, which is the answer to c3's test: no method independent of zeta was found, and Theorem 1 says none is needed to describe the class. |
| Sign twist TW- (thin) | none when S is thin and regular | Theorem 1 applies; this is the family that produces the real zeros (section 4). |

Backward heat, T-NR, zeta(s+a)zeta(s-a), phase-rotated transfer operator, theta^w: not completely multiplicative unimodular ordinary Dirichlet series with a simple pole of non-zero residue at 1 and power-saving discrepancy; outside the hypothesis class. Not run.

## 6. Requirement flags

- R1 (multiplicativity essential): **true for Theorem 1 as a statement about F relative to zeta**: step (a) needs the Euler product with unimodular local parameters to make A a non-negative Dirichlet series; DH fails there. It is not R1 for an attack on zeta: the additive structure of the integers is not used, and nothing about zeta is concluded.
- R2 (height-uniform, every window): false. The zero matching holds at every height, but it is an identification of zero sets, not a zero-free conclusion.
- R3 (every control fails at a named step): false. The Beurling control passes every step.
- R4 (reaches the critical line): false. Nothing is carried from Re s > theta to a statement about zeta in the strip.

## 7. Three weakest steps

1. sigma_0 > theta is MEASURED, not PROVED. The exponents are two-point or least-squares slopes of block maxima on x <= 1e8 (2e7, 3e7 for the complex examples), ranging from 0.20 to 0.48 between fits; they establish "well below b" on that range, not an asymptotic exponent. A proof needs polynomial growth of G left of b, which was reduced here to prime exponential sums over S and not obtained. If the true exponent equalled b asymptotically, Theorem 1 would stand unchanged with sigma_0 = theta for these examples, and items 3 and 4 of the verdict would fall back to f(theta) >= theta.
2. Theorem 1 was checked by the author only. Points a referee should test: the Landau step (continuation of A along the real axis through a neighbourhood where H is zero- and pole-free, including s = 1), the definition of sigma_0 when real zeros accumulate at theta, and the claim that C1 follows from A (the k >= 2 terms are non-negative, so dropping them is legitimate). Novelty unchecked; the argument is a standard Landau device and may be known in the pretentious-multiplicative-functions literature.
3. Literature: Diamond-Montgomery-Vorhauer and Hilberdink are recalled, not opened; Klurman-Mangerel-Pohoata-Teravainen was read at abstract level only, so whether that paper already contains a power-saving converse (which would overlap C1) is not known. The two-set example's zero at s = 0.75 is marginal against its truncation scale, and its discrepancy exponent is unresolved.

## 8. Files

- `thin_twist.py` (modes greedy, random, phase); logs `greedy_1e8.log`, `greedy_b0.5_1e8.log`, `greedy_b0.7_1e8.log`, `random_1e8.log`, `random_s2_1e8.log`, `phase_2e7.log`; JSON `thin_twist_*.json`.
- `two_set.py`; `two_set_3e7.log`, `two_set_N30000000.json`.

## 9. Most valuable next step

Referee Theorem 1 (it is short), then decide r(0): does a chi with E << x^eps and c != 0 exist whose F has a real zero in (0,1)? By C1 with sigma_0 the top real zero this is a question about sets of primes with sum_{p in S} p^(-sigma) divergent at some sigma > 0 and partial sums of chi still O(x^eps); it does not involve zeta's zeros and is the only part of f(0) that is not Theta < 1.
