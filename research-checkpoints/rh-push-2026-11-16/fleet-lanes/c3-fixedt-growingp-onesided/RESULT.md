# c3-fixedt-growingp-onesided: one-sided bounds in P for the renormalised prime sum at a fixed point of the strip

Date: 2026-11-18. Kind: deepen (R4 lane; follows `c2-polydisc-leeyang-bound` Thm. 3 and `c1-leeyang-krein-limit` Thm. D(b)).
Labels: PROVED (argument in this note; author only, unrefereed), CLASSICAL (recalled, source not opened), MEASURED (float64, not interval arithmetic), ARGUED, OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction. The fixed-s, all-P one-sided bound is the Landau target already recorded in map rows T2 and P10, in a twisted form. One point s suffices for the criterion, both signs suffice, and no input that holds at Re s >= 1 or at finite stages produces the bound.**

1. (PROVED, Lemma 1) For fixed s = sigma + it, 1/2 < sigma < 1, t != 0, the Laplace transform in u = log P of G(P; s) = sum_{p<=P} p^-s + E_1((s-1) log P) is
   Phi_s(w) = (1/w) [ log((s+w-1) zeta(s+w)) - log(s-1) - H(s+w) ], H(z) = sum_{k>=2} P(kz)/k (P the prime zeta function), analytic in Re z > 1/2.
   In Re w > 1/2 - sigma its singularities are w = 0 and the logarithmic branch points w = rho - s, one for every zero rho of zeta with Re rho > 1/2, at every height.
2. (PROVED, Thm. 1) If Re G(P; s) <= C P^alpha for all P >= P_0 (or Re G(P; s) >= -C P^alpha for all P >= P_0), alpha >= 0, at ONE point s, then every zero rho = beta + i gamma satisfies beta <= max(sigma + alpha, beta_t), where beta_t is the largest real part of a zero with ordinate exactly +-t (absent such a zero: beta <= sigma + alpha). For every t that is not the ordinate of a zero with beta > sigma + alpha, in particular for all but countably many t and for every |t| below the verified height, a one-sided bound at that single point gives the half-plane Re z > sigma + alpha free of zeros. Conversely (CLASSICAL) the half-plane gives the two-sided bound O(P^(alpha + eps)).
3. (PROVED) A window of t gives nothing beyond one generic t. The statement is global: at fixed s the behaviour as P -> infinity reads zeros at all heights, each with weight P^(beta - sigma)/(|s - rho| log P). A bound for all P at one height is not a window statement.
4. (PROVED, Prop. 2) Sign structure. A zero contributes + m E_1((s - rho) log P) to the raw sum, a pole - m E_1. At t = gamma, sigma < beta, the term is - m Ei((beta - sigma) log P): Re G goes to -infinity without oscillation. At that height an upper bound is not contradicted by that zero; this is the exceptional case beta_t of Thm. 1. For the Liouville twist Re G_lambda = - Re G_zeta identically, so every one-sided inequality in P that holds for both is two-sided.
5. (ARGUED + CLASSICAL) P coupled to height, P = T^theta on a window [T, 2T]: the one-sided inputs that exist unconditionally are (i) upper bounds for log abs zeta (convexity, Vinogradov-Korobov), which act at P = infinity, and (ii) nonnegative trigonometric polynomials (3-4-1) at every finite stage, which carry the pole term of exponent 1 - sigma and return the classical region (row P13). The difference G(P; s) - log zeta(s) is the zero sum, a two-sided object. Vinogradov-Korobov and the 7/8 half-plane bound its absolute value; neither gives a one-sided bound that is stronger than its two-sided form.
6. (MEASURED) 40 heights in [1e3, 1e6], P <= 1e7: zeta's Re G stays within 0.445 of its limit at sigma = 0.6 (0.141 at 0.75, 0.046 at 0.9). The controls with a zero at distance <= 3 show the predicted single-term growth (U: sup 4.51 at offset 0.25, inf -12.5 at offset 0; RZ_b: +33.3 and -51.9; DH near 0.8085 + 85.699i: +5.1 and -14.1). Controls whose zero is at distance >= 980 are not separated from zeta at P <= 1e7 (U with t0 = 20: oscillation <= 0.20 for P >= 1e5; RZ_b: predicted amplitude <= 0.013). One sampled height (t = 119377.664) fell 0.033 from a DH zero at 0.8316459 + 119377.631343i and was detected by the monotone descent to -14.9.

The idea does not fail the first test; it reduces at the first lemma to a recorded target. No pivot was made: the adjacent idea (a finite-range version in P, item 5) is the Gonek regime and has no unconditional one-sided input.

## 1. Plan and what is new against the sources

Sources read: `BRIEF.md`; `OBSTRUCTION_MAP.md` sections 2 and 5, rows P10, P13, T2; `c2-polydisc-leeyang-bound/RESULT.md` (Thm. 1-3, Prop. 4); `c1-leeyang-krein-limit/RESULT.md` (Thm. D and the remark after it); `e1-forcing-free-bilinear-split/RESULT.md` (verdict; closes `fam-vaughan-split-landau`); `e2-control-rz-defect-audit/RESULT.md` (definition of RZ_b). Gonek (2012) and Gonek-Hughes-Keating are recalled, not opened.

Recorded there: at fixed P the trivial bound is attained along heights (c2 Thm. 3); local boundedness of the renormalised stages on a domain is equivalent to zero-freeness on that domain (c1 Thm. D); RH iff a one-sided polynomial bound for the psi-type remainder (T2); any finite one-sided bound of the form Q_L(v) >= -C norm(v)^2 suffices (P10); the Vaughan-split route to the one-sided Landau target returns Theorem OS, equivalent to RH (e1).

Done here and not recorded there: the Laplace transform in log P at a fixed strip point with its singular set (Lemma 1); the single-point criterion with the exceptional ordinates (Thm. 1); the sign structure and the Liouville mirror (Prop. 2); the localisation law in P for a zero at distance Delta (section 4, MEASURED on U, RZ_b, DH); the tables. All of it is the classical Landau argument applied to a twisted prime sum; no novelty is claimed.

Notation. E_1 is the principal exponential integral. G(P; s) = sum_{p<=P} p^-s + E_1((s-1) log P). R(P; s) = log E_P(s) + E_1((s-1) log P), E_P the Euler stage; R - G = sum_{p<=P} sum_{k>=2} p^(-ks)/k converges for sigma > 1/2. Theta = sup of real parts of zeros.

## 2. First lemma: Laplace transform in log P

### Lemma 1. PROVED.
Fix s = sigma + it with 1/2 < sigma < 1 and t != 0. For Re w > 1 - sigma,
Phi_s(w) := int_0^inf G(e^u; s) e^(-wu) du = (1/w) [ P(s+w) + log(s+w-1) - log(s-1) ], principal logarithms.

Proof. Prime part: int_0^inf e^(-wu) sum_{log p <= u} p^-s du = (1/w) sum_p p^(-s-w), absolutely convergent for Re w > 1 - sigma. Renormaliser: for Re a > 0, E_1(au) = int_1^inf e^(-auy) dy/y gives int_0^inf E_1(au) e^(-wu) du = (1/w) log(1 + w/a). Both sides are analytic in a on {a not in (-inf, 0], Re(a + w) > 0}: the left side because abs(E_1(au)) <= e^(-u Re a)/(u abs(Im a)) for Im a != 0 (c2 Thm. 3 proof) and the singularity at u = 0 is logarithmic; the right side is log(a + w) - log a. The set is connected; put a = s - 1. QED.

With P(z) = log zeta(z) - H(z):
Phi_s(w) = (1/w) [ log((s+w-1) zeta(s+w)) - log(s-1) - H(s+w) ].
(z-1) zeta(z) is entire and nonzero at z = 1, so the pole of zeta produces no singularity. H(s+w) is analytic for Re w > 1/2 - sigma. In Re w > 1/2 - sigma the singular set of Phi_s is {0} together with {rho - s : zeta(rho) = 0, Re rho > 1/2}. At w = rho - s the singular part is (m_rho/w) log(w - (rho - s)), m_rho >= 1 the multiplicity. At w = 0 there is a simple pole with residue log zeta(s) - H(s) when zeta(s) != 0.

Real part. r(u) = Re G(e^u; s) has transform Phi_R(w) = (Phi_s(w) + Phi_sbar(w))/2. Its singular set in Re w > 1/2 - sigma is {0} and the points rho - s, rho - sbar. The singular parts at coinciding points carry coefficients of the same sign and cannot cancel. The points on the real axis are w = 0 and w = beta - sigma for zeros beta +- it.

### Theorem 1 (single-point Landau criterion). PROVED (Landau's theorem on Laplace transforms of functions of one sign CLASSICAL).
Let alpha >= 0 and suppose r(u) <= C e^(alpha u) for all u >= u_0. Put b_t = sup{beta - sigma : zeta(beta + it) = 0 or zeta(beta - it) = 0} (b_t = -infinity if there is none) and m = max(alpha, b_t). Then every zero of zeta satisfies beta - sigma <= m. The same holds if instead r(u) >= -C e^(alpha u).

Proof. h(u) = C e^(alpha u) - r(u) >= 0 for u >= u_0, with transform C/(w - alpha) - Phi_R(w), convergent for Re w > 1 - sigma. By Landau's theorem the abscissa of convergence is a singular point of the transform on the real axis. The real singular points are contained in {alpha, 0} and {beta - sigma : zeta(beta +- it) = 0}, all <= m. So the integral converges and the transform is analytic for Re w > m. Then Phi_R is analytic there, so no point rho - s lies in Re w > m. For the lower bound use h = r + C e^(alpha u). QED.

Consequences.
- (a) t not the ordinate of any zero with beta > sigma + alpha: the one-sided bound at s implies Theta <= sigma + alpha. Example of the form of the statement: "Re G(P; 0.6 + 5i) <= C for all P" would give no zeros in Re z > 0.6. The hypothesis is at a point where zeta is known to be zero-free nearby; the conclusion is global.
- (b) Converse, CLASSICAL: Theta <= sigma + alpha gives pi(x) - li(x) = O(x^(sigma + alpha + eps)) and by partial summation G(P; s) = c(s) + O_s(P^(alpha + eps)) (c1 Thm. D proof). So at a generic point: one-sided bound for all P <=> two-sided bound up to eps <=> Theta <= sigma + alpha.
- (c) A window of t adds nothing to (a): one non-exceptional t in the window already gives the half-plane.
- (d) The bound is a global statement in the height. At fixed s the zero rho contributes E_1((s - rho) log P), of modulus about P^(beta - sigma)/(abs(s - rho) log P) for large P. A zero at distance Delta is seen once P^(beta - sigma) exceeds Delta log P. Requirement R2 (every window, constants independent of height) is not addressed by this object: the constant C in the bound depends on all zeros.

### Comparison with T2, P10, P13 and `fam-vaughan-split-landau`

Recorded as **the same Landau target**. T2's criterion R_x(l) >= -C(1+l)^m is the case t = 0 with a different weight (the psi remainder); P10 is the same statement in the Q_L form; the Vaughan-split family tried to derive the bound and returned Theorem OS (equivalent to RH). Differences, none of which changes the status:
1. The twist p^(-it) moves the singular points off the real axis: for t != gamma the real axis carries only w = 0 and w = alpha. In the classical case the same is true because zeta has no real zeros in (1/2, 1). The mechanism is identical.
2. Either sign of the one-sided bound suffices, except at exceptional ordinates.
3. Exceptional ordinates t = gamma exist (Prop. 2): there one side of the bound holds without contradiction from that zero.
Row P13 (Lambda >= 0 upper bound) is the 3-4-1 inequality of section 3(ii): one-sided and valid at finite stages, with output the classical region.

### Proposition 2 (sign structure and the Liouville mirror). PROVED for U, RZ_b and the mirror; for zeta the displayed asymptotic is CLASSICAL in form (explicit formula) and is not used elsewhere.
(i) For any Euler stage family whose logarithm has singular part m log(z - rho) at rho (m > 0 zero, m < 0 pole), the raw sum contains + m E_1((s - rho) log P). For s = sigma + i gamma with sigma < beta this is - m Ei((beta - sigma) log P) - i pi m: real part negative, monotone, of size P^(beta - sigma)/((beta - sigma) log P). For s = sigma + i(gamma + u): modulus P^(beta - sigma)/(abs(beta - sigma - iu) log P) with phase rotating as e^(-iu log P).
(ii) chi(p) = -1 (Liouville; function zeta(2s)/zeta(s)): sum_{p<=P} chi(p) p^-s - E_1((s-1) log P) = - G(P; s). The class {zeta, zeta(2s)/zeta(s)} is closed under G -> -G. An upper bound for one member is a lower bound for the other. Any derivation of a one-sided bound in P from hypotheses shared by both members (completely multiplicative coefficients, unimodular real local parameters, meromorphic continuation, a functional equation of the same type, integer frequencies) proves the two-sided bound.
(iii) What separates the two members is the sign of m in the strip: zeta is holomorphic there, so m >= 1 at every singular point. By (i) that sign is visible in Re G only at the ordinates t = gamma themselves, where it makes the upper bound hold. At every other height the term changes sign as P grows.

## 3. P coupled to the height

Setting: window t in [T, 2T], P = T^theta, L = log P. ARGUED unless marked.

Formula (CLASSICAL in form; Gonek 2012 and Gonek-Hughes-Keating use a smoothed cutoff, recalled): G(P; s) = log zeta(s) - H(s) + sum_rho E_1((s - rho) L) + O(P^(1/2 - sigma)) with the zero sum taken symmetrically. Gonek's theorems (recalled): under RH the finite Euler product approximates zeta for sigma >= 1/2 + C loglog t/log P and P <= t^2; unconditionally the same holds at distance from zeros.

What an upper bound gives. Suppose Re G(T^theta; sigma + it) <= M(T) for all t in the window. A zero rho_0 = beta_0 + i gamma_0 in the window with beta_0 - sigma = eta contributes at s = sigma + i(gamma_0 +- pi/L) the amount + P^eta eta L/((eta L)^2 + pi^2) to Re G. If the other zeros and log abs zeta do not cancel it: P^eta <= about M eta L, that is beta_0 <= sigma + (log M + loglog T + O(1))/(theta log T). With M = O(log T) this is a region sigma + O(loglog T/log T) in the window. The non-cancellation is not proved: at fixed P all zeros have the same frequency L in t and differ only by the local factor 1/(s - rho). For a single P the Borel-Caratheodory theorem turns Re G <= M on a disc (anchored at Re s = 2 where G = O(1)) into abs(G) <= c M on a smaller disc (PROVED, standard), so at one P the one-sided and two-sided bounds are equivalent up to constants. A rigorous implication to zero-freeness needs the bound for all P >= T^theta on the window, which is c1 Thm. D(b).

Unconditional inputs, by type.
- (i) One-sided, at P = infinity: log abs zeta(sigma + it) <= c(sigma) log t (convexity; Vinogradov-Korobov-Richert with c(sigma) = C(1 - sigma)^(3/2), recalled). No unconditional lower bound exists. Passing from zeta to the stage adds Re sum_rho E_1((s - rho) L), which takes both signs in every interval of length 2 pi/L around each ordinate (Prop. 2(i)). The one-sided input does not pass to finite P.
- (ii) One-sided, at every finite stage and every sigma > 0: sum_{p<=P} p^-sigma (3 + 4 cos(t log p) + cos(2t log p)) >= 0. In the present variables: 3 S_P(sigma) + 4 Re S_P(sigma + it) + Re S_P(sigma + 2it) >= 0. The first term is 3 Ei((1 - sigma) L) + O(1). A zero at beta + it contributes - 4 Ei((beta - sigma) L). The inequality is consistent for every beta < 1 because the exponent 1 - sigma of the pole term exceeds beta - sigma. Every nonnegative trigonometric polynomial has a positive constant term, so the pole term cannot be removed. Output: beta < 1 and, quantitatively, the classical region. This is row P13. It holds for U as well: with chi(p) p^(-it0) = e^(i phi_p), cos phi_p = -p^(sigma0 - 1), the 3-4-1 sum over the characters 1, chi, chi^2 is 2 sum p^-sigma (1 - p^(sigma0 - 1))^2 >= 0 (PROVED, direct computation), so the inequality is compatible with a zero at any sigma0 < 1.
- (iii) Two-sided: Vinogradov-Korobov gives, through the zero-free region, abs(G(P; s) - c(s)) <= P^(1 - sigma) exp(-c theta (log T)^(1/3) (loglog T)^(-1/3)) for P = T^theta (CLASSICAL form, constants not checked). The power saving N^(-c theta^2) that the method gives for sum_{n<=N} n^(-it) does not transfer to primes: a zero at 1 - delta + it contributes P^(1 - delta)/delta to sum_{n<=P} Lambda(n) n^(-it), so a power saving at P = T^theta is a zero-free strip.
- (iv) Two-sided: the 7/8 half-plane (unrefereed input of the campaign) gives abs(G(P; s) - c(s)) = O(P^(7/8 - sigma + eps)) for all P when sigma < 7/8 and convergence when sigma > 7/8. By Thm. 1 this is the same information as the half-plane; the one-sided form holds exactly when the two-sided form holds.

Answer to the assignment question: no unconditional input gives a one-sided bound without the two-sided one. The inputs of type (i) and (ii) are one-sided but do not bound Re G in the strip below the size of the pole term or at finite P.

## 4. Decisive test. MEASURED.

Code: `onesided_test.py` (main, 328 s), `dh_near.py`, `dh_zero.py`, `tables.py`; output `onesided_test.json`, `onesided_test.log`, `tables.txt`, `dh_near.log`, `dh_near.json`, `dh_zero.log`. Run locally through `scripts/memcap.sh 8`; peak planned memory below 1.5 GB. The compute server was not used.

Setup: primes up to 1e7 (664579); 40 heights t_j = 1e3 * 10^(3j/39); sigma in {0.6, 0.75, 0.9}; sup and inf over P taken at every prime P in [1e3, 1e7]. zeta values from mpmath; E_1 from scipy (checked against mpmath to 1e-15 relative at 12 points). D(P) = Re R(P; s) - log abs zeta(s). Target for G: log abs zeta(s) - Re H(s) with H summed to 1e7.

### zeta (Liouville: the same table with all signs reversed, by Prop. 2(ii))

| sigma | trivial sum_{p<=1e7} p^-sigma | range of log abs zeta over heights | sup_P raw sum, max over heights | inf_P raw sum, min | max over heights of sup_P D | min of inf_P D | D range for P >= 1e5 | max abs D at P = 1e7 | max of abs(D) P^(sigma-1/2) log P |
|---|---|---|---|---|---|---|---|---|---|
| 0.60 | 122.1 | [-1.661, 1.962] | 1.927 | -1.709 | 0.445 | -0.396 | [-0.209, 0.191] | 9.2e-2 | 9.90 |
| 0.75 | 20.7 | [-1.239, 1.615] | 1.490 | -1.313 | 0.141 | -0.129 | [-0.031, 0.026] | 5.9e-3 | 8.91 |
| 0.90 | 5.5 | [-0.982, 1.334] | 1.201 | -1.076 | 0.046 | -0.044 | [-0.0045, 0.0044] | 4.5e-4 | 7.80 |

Sample rows (sigma = 0.6; all 120 rows in `tables.txt` and the json):

| t | log abs zeta | sup_P Re G | inf_P Re G | target | sup_P D | inf_P D | D at P = t | D at 1e7 |
|---|---|---|---|---|---|---|---|---|
| 1000 | -0.1414 | 0.0807 | -0.1281 | 0.0841 | -0.0034 | -0.2129 | -0.1570 | -3.2e-2 |
| 2031 | 1.9621 | 1.9264 | 1.5561 | 1.7321 | 0.1942 | -0.1759 | 0.0443 | 5.8e-4 |
| 17013 | -0.7782 | -0.1171 | -0.5116 | -0.4864 | 0.3693 | -0.0251 | 0.3002 | 3.2e-2 |
| 34551 | -1.2733 | -0.8966 | -1.2299 | -1.2315 | 0.3339 | 0.0015 | 0.0684 | 2.8e-2 |
| 142510 | -0.0670 | -0.0796 | -0.2890 | -0.1778 | 0.0982 | -0.1112 | -0.0634 | -9.2e-2 |
| 587802 | 1.0478 | 1.1877 | 0.6446 | 0.7809 | 0.4072 | -0.1363 | -0.0166 | -3.2e-2 |

Reading. Over P in [1e3, 1e7] the renormalised sum stays within 0.45 of log abs zeta at sigma = 0.6, and the scaled deviation abs(D) P^(sigma - 1/2) log P stays below 10 at all three sigma. This is the behaviour forced by the zeros being on the line at every height that P <= 1e7 can resolve from these points (section 2(d)); it restates verified height and is not evidence beyond it.

### U (unimodular twist with a zero at s0 = 0.8 + i t0; chi(p) = p^(i t0) e^(i eps_p phi_p), cos phi_p = -p^(-0.2), eps_p alternating)

The family is closed under height translation: G_U(P; sigma + it) depends on t - t0 only. "Renorm." is Re log E_P^chi - Re E_1((s - s0) log P).

| sigma | t - t0 | sup_P Re G | at P | inf_P Re G | at P | predicted amplitude at 1e7 | renorm. range, P >= 1e5 |
|---|---|---|---|---|---|---|---|
| 0.60 | 0 | -3.939 | 1.0e3 | -12.507 | 1e7 | 7.79 | [-0.9539, -0.9452] |
| 0.60 | 0.25 | 4.513 | 1e7 | -2.352 | 1.0e3 | 4.87 | [-0.4576, -0.4447] |
| 0.60 | -0.25 | 4.475 | 1e7 | -2.390 | 1.0e3 | 4.87 | [-0.4766, -0.4637] |
| 0.60 | 3 | 1.224 | 1e7 | 0.272 | 3.9e6 | 0.52 | [0.7920, 0.7953] |
| 0.75 | 0 | -2.509 | 1.0e3 | -3.974 | 1e7 | 2.78 | [-2.5232, -2.5227] |
| 0.75 | 0.25 | -0.649 | 1e7 | -1.744 | 1.0e3 | 0.55 | [-0.9423, -0.9414] |
| 0.90 | 0 | -1.731 | 1.0e3 | -2.024 | 1e7 | 0.12 | [-2.0254, -2.0253] |
| 0.90 | 0.25 | -1.141 | 1e7 | -1.339 | 1.0e3 | 0.046 | [-1.0769, -1.0768] |

U with t0 = 20 at the 40 heights (distance >= 980): sup_P Re G in [-1.77, 1.73] and inf_P in [-1.96, 1.42] at sigma = 0.6; oscillation of Re log E over P >= 1e5 at most 0.199 (0.029 at 0.75, 0.0047 at 0.9); predicted zero-term amplitude at most 0.0016. At these heights and P <= 1e7 this U is not separated from zeta.

### RZ_b = 1/zeta(s + 1 - b), b = 0.93 (zero at s = b)

Target -log abs zeta(s + 1 - b). D_raw = Re log(stage) - target; D_renorm removes Re E_1((s - b) log P).

| sigma | t | sup_P Re log stage | inf_P | predicted amplitude at 1e7 | D_raw range | D_renorm range |
|---|---|---|---|---|---|---|
| 0.60 | 0 | -7.058 | -51.893 | 38.4 | [-50.99, -6.15] | [-0.099, -0.007] |
| 0.60 | 0.25 | 33.330 | -3.623 | 30.6 | [-2.94, 34.02] | [-0.002, 0.055] |
| 0.60 | 3 | 4.628 | -2.708 | 4.20 | [-3.27, 4.07] | [-0.020, 0.028] |
| 0.75 | 0 | -4.193 | -10.902 | 6.27 | [-9.29, -2.59] | [-0.027, -0.000] |
| 0.75 | 0.25 | 2.706 | -2.625 | 3.67 | [-1.55, 3.78] | [-0.000, 0.013] |
| 0.90 | 0.25 | -1.097 | -1.959 | 0.40 | [-0.59, 0.27] | [-0.000, 0.003] |

At the 40 heights (distance >= 1e3 from the zero): D_raw in [-0.253, 0.223] at sigma = 0.6, [-0.084, 0.078] at 0.75, [-0.028, 0.026] at 0.9; predicted zero-term amplitude at most 0.013. Not separated from zeta at P <= 1e7. The one-sided bound for RZ_b fails only for P above about (t log P)^(1/(b - sigma)), about 1e13 at t = 1e3, sigma = 0.6.

### DH (coefficients b(n) of log f, f the Davenport-Heilbronn function; G_DH(P; s) = sum_{n<=P} b(n) n^-s; no renormaliser)

b(n) computed to n = 1e7 by the recursion a(n) log n = sum_{d|n} Lambda_f(d) a(n/d); check exp(sum b(n) n^-3) = f(3) to 1e-14; b(6) = 1.0807009 (the multiplicativity defect of the map's DH row). max abs b(n) = 871.2; sum abs b(n) n^-0.6 = 628.0, n^-0.75: 85.7, n^-0.9: 15.1. f(s) from the direct sum with an Euler-Maclaurin tail, checked against mpmath Hurwitz values to 2e-13.

At the 40 heights: 39 of 40 show sup_P and inf_P within [-2.2, 1.5] at sigma = 0.6 (median sup 0.5, median inf -0.3). One height is an outlier:

| t | sigma | G at 1e3 | 1e4 | 1e5 | 1e6 | 1e7 |
|---|---|---|---|---|---|---|
| 119377.664 | 0.60 | -3.460 | -5.297 | -7.666 | -10.883 | -14.930 |
| 119377.664 | 0.75 | -2.012 | -2.559 | -3.063 | -3.540 | -3.968 |
| 119377.664 | 0.90 | -1.277 | -1.441 | -1.550 | -1.621 | -1.667 |

Newton iteration on f from 0.85 + 119377.664i converges to a zero at 0.8316459305 + 119377.6313432i (abs f = 1.7e-12; float64, not interval-certified), at distance 0.033 from the sampled height. The monotone descent is the case t = gamma of Prop. 2(i).

Near the two off-line zeros listed in the map (`dh_near.log`), sigma = 0.6:

| zero | t - gamma | G at 1e3 | 1e5 | 1e7 | sup_P | inf_P | predicted amplitude at 1e7 |
|---|---|---|---|---|---|---|---|
| 0.8085 + 85.6993i | 0 | -4.459 | -7.900 | -13.986 | -4.459 | -14.067 | 8.57 |
| 0.8085 + 85.6993i | 0.25 | -2.596 | -0.356 | 5.014 | 5.081 | -2.627 | 5.49 |
| 0.8085 + 85.6993i | -0.25 | -2.539 | -0.263 | 5.118 | 5.155 | -2.565 | 5.49 |
| 0.8085 + 85.6993i | 3 | 0.674 | 0.831 | 1.436 | 1.488 | 0.296 | 0.59 |
| 0.6508 + 114.1633i | 0 | -2.955 | -3.891 | -4.523 | -2.900 | -4.660 | 2.77 |
| 0.6508 + 114.1633i | 0.25 | -1.890 | -1.352 | -0.721 | -0.624 | -1.963 | 0.55 |

DH's zeros to the right of Re s = 1 (sup about 1.12) were not seen at the 40 heights with P <= 1e7: none of the 39 regular heights shows growth. By Thm. 1 they force Omega_+- (P^(1.12 - sigma - eps)) at every non-exceptional height; the range P <= 1e7 does not reach it from these heights.

## 5. Controls

The criterion (Lemma 1 + Thm. 1) is a statement about any Dirichlet series with a logarithm; it holds verbatim for every control. The inequality "Re G(P; s) <= C for all P" at a generic point with sigma = 0.6:

| Control | Inequality | Reason | Status |
|---|---|---|---|
| zeta | equivalent to no zeros in Re z > 0.6 | Thm. 1 | PROVED equivalence; truth OPEN |
| U (zero at 0.8 + i t0) | false for every t != t0; true at t = t0 | singular point s0 - s; real only at t = t0 | PROVED; MEASURED (4.51 and growing at offset 0.25; -12.5 at offset 0) |
| Liouville | upper bound for it = lower bound for zeta | Prop. 2(ii) | PROVED |
| RZ_b | false for sigma < b at every t != 0; true at t = 0 | singular point b - s | PROVED; MEASURED near t = 0; not visible at t >= 1e3 for P <= 1e7 |
| DH | false at every non-exceptional height for sigma < 1.12 | zeros of f to the right of sigma; no stage structure used | PROVED-rel recalled zero locations; MEASURED near three zeros |
| HEAT, TW+-, EA, NR, B | not run | the same criterion applies to each: the bound holds iff the function has no zeros (and no poles other than the renormalised one) to the right of sigma | not tested |

What U lacks. In this object, nothing at the level of hypotheses. The criterion is function-agnostic; U fails the inequality because U has the zero, and zeta's inequality is equivalent to the absence of zeros. No property that zeta has and U lacks enters before the conclusion. The two facts that can be named: (1) U's failure is located at a real singular point of the transform only when t = t0, and elsewhere it appears as a sign-changing term, exactly as a hypothetical zero of zeta would; (2) the test at heights far from s0 with P <= 1e7 does not separate U from zeta at all (amplitude P^(sigma0 - sigma)/(abs(s - s0) log P) <= 0.0016). The second point is c2 Prop. 4 seen from the other variable: at fixed P the U stage is a height translate of zeta's stage; at fixed t the difference appears only for P above (abs(s - s0) log P)^(1/(sigma0 - sigma)).

## 6. Requirement flags

- R1 (multiplicativity essential): **false**. Lemma 1 and Thm. 1 use the Dirichlet series of the logarithm and Landau's theorem. They hold for DH's log-coefficients, which are not supported on prime powers. Multiplicativity enters only in writing the logarithm as a prime sum.
- R2 (height-uniform, every window): **false**. The conclusion of Thm. 1 is a global half-plane, but it is the conclusion of an equivalence with no unconditional hypothesis. The bound at one height depends on zeros at all heights (2(d)); the coupled version of section 3 is ARGUED and has no unconditional input.
- R3 (fails for every control at a structural step): **false**. The inequality is false for U, RZ_b and DH (PROVED from their zeros, MEASURED), and for Liouville it is the mirror statement. The failure is the presence of the zero, not a step of a derivation; there is no derivation for zeta.
- R4 (reaches the critical line): **false**. No one-sided inequality in P was derived from inputs at Re s >= 1 or at finite stages. The finite-stage one-sided inequality that exists (3-4-1) returns the classical region (P13).

## 7. Three weakest steps

1. Thm. 1 is the author's argument only. It rests on the Laplace transform of E_1 at Re a < 0 by continuation in a, on the non-cancellation of logarithmic singular parts between Phi_s and Phi_sbar, and on Landau's theorem applied with branch points rather than poles. The exceptional case t = gamma is stated as "not excluded"; the asymptotic Re G -> -infinity at such t for zeta is not proved (other zeros on the same vertical line Re z = beta are not controlled) and is illustrated only on U, RZ_b and DH.
2. Section 3 is ARGUED. The zero-sum formula with sharp cutoff, Gonek's and Gonek-Hughes-Keating's statements and the Vinogradov-Korobov forms are recalled, not opened. The implication from a bound at the single scale P = T^theta to a zero-free region ignores interference among zeros. The claim "no unconditional one-sided input" is a survey of four input types, not a theorem.
3. Numerics are float64 with no interval control. U has no independent value to compare with; its renormalised stage is checked only for convergence. The DH zero at height 119377.63 is a float Newton limit. The zeta table samples 40 heights and P <= 1e7 and can only see zeros within P^(beta - sigma)/log P of the sampled points; it restates verified height. DH zeros in Re s > 1 were not exhibited.

## 8. Next step, if any

None on this object. A finite-range Landau statement (one-sided bound for P in [X, X^A] at one point implies a zero-free box, by Turan's power-sum method) would make section 3 rigorous, but it would still be an equivalence with no unconditional hypothesis. For the map: add under T2 that the twisted fixed-s form is the same target and that a single point and either sign suffice.
