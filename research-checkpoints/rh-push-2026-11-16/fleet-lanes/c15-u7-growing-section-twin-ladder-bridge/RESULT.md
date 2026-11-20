# c15-u7-growing-section-twin-ladder-bridge: sections of the prime chain with P = t^theta on the gamma one-port, and the windowed anticausal block

Date: 2026-11-19. Kind: deepen (R4 lane; class U7 of `campaign/CHECKPOINT_R14_DRAFT.md`).
Labels: PROVED (argument in this note; author only), CLASSICAL (recalled, source not opened), MEASURED (float64, not interval arithmetic), ARGUED, OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction. Class U7 closes as a row. With the Fejer taper the section built from the prime powers n <= P on the gamma one-port is J-contractive at every height and every P if and only if RH holds; the stage inequality is the Weil functional on translated Fejer tests (map row P45). With P tied to the height (P = t^theta) the stage statement is implied by RH, implies the band bounds of Proposition 4 (which random sign chains also satisfy), corresponds (argued, Proposition 5) to zeros within c_theta/log gamma of the line, and is proved unconditionally only for P up to about ((1/4) log t log log t)^2. The sharp (untapered) section is J-expansive for zeta itself. The separation from the controls that the test measured is the identity "each on-line zero contributes a non-negative term"; no step uses multiplicativity.**

1. (PROVED, Lemma 1, 2; Theorem 1) L_F(s) = sum over zeros of K_u(s - rho), u = log P, and Re K_u(w) >= 0 for Re w >= 0. If zeta has no zero in Re s > 1/2 + eta_0 then for every P >= 2 the Fejer section is positive-real on Re s > 1/2 + eta_0, its symbol S_P is Schur there, and Gamma_-(S_P) = 0 on every line Re s = 1/2 + eta, eta >= eta_0. Conversely a lower bound Re L_F >= -M on that half-plane along any sequence P_j -> infinity excludes zeros in it (Harnack and Vitali). In this class the limit step is valid; the whole content is the stage inequality at unbounded P.
2. (PROVED, Lemma 3) First lemma of the assignment. The windowed anticausal block obeys norm(Gamma_-^W(S_P)) <= norm(Gamma_-^W(S)) + 2 alpha sup_W abs(L_P - L)/abs(1 + alpha L_P) when Re L >= 0 on the line. On Re s = 1/2 + eta the difference L_P - L is a prime tail only for eta > 1/2 (absolute summability). For 0 < eta <= 1/2 it is a sum over zeros, bounded by C/(theta (eta - eta')) under a zero-free hypothesis at 1/2 + eta'. Square-summability (row Q10) gives a mean-square bound over heights for the segment P < n <= t only (theta < 1), which is a statement about most windows and not every window.
3. (PROVED, Proposition 4) If Re L_F(1/2 + i tau) >= -M for abs(tau - t) <= t/2 with P <= t^2, then for every x in [2 e^delta, P]: abs(sum_n Lambda(n) (1 - log n/log P)_+ (1 - abs(log(n/x))/delta)_+ n^(-1/2-it)) <= log(t/2 pi) + 2M + O(1/(delta log P)). So the stage statement at P = t^theta contains square-root cancellation, up to a factor log P log t/delta, in smoothed sums of Lambda(n) n^(-it) over (x e^(-delta), x e^delta), x <= P/e, at every height. The proof uses no property of Lambda(n); it holds for any coefficient sequence on the same gamma one-port. It is necessary and far from sufficient: measured, random sign chains that violate the stage statement satisfy this bound with a factor 10 to spare (section 4.5).
4. (PROVED, elementary) Unconditional range: Re L_F(1/2 + it) > 0 whenever sum_{n<=P} Lambda(n)(1 - log n/log P) n^(-1/2) < (1/2) log(t/2 pi) - 1/t, asymptotically P up to ((1/4 + o(1)) log t log log t)^2 (CLASSICAL prime number theorem for the sum; at t = 1e3, 1e4, 1e5 the measured sums put the end of the range between P = 5.6 and 31.6, 10 and 100, 17.8 and 316). This is theta = 0. It holds for every sign twist as well.
5. (MEASURED) 14 cells, t in {1e3, 1e4, 1e5}, theta from 1/4 to 2 (P up to 1e8), window of 200 units of height. Zeta, Fejer: min Re L_F > 0 in every cell (0.065 to 3.2), N_- at the floor of the gamma one-port for P <= 1e6 (3e-11 to 7e-11 at step 0.01) and falling with the step, not yet at the floor, for P = 1e8 (section 4.3). Zeta, sharp: Re L_S < 0 on 5 to 41 percent of the window for theta >= 1/2. Random completely multiplicative signs (24 seeds): 24 of 24 violate for theta >= 1, with the fraction of the window within 20 percent of the Gaussian value; 0 of 24 in the 200-unit windows for theta <= 1/2; in a scan of 1e5 units of height at theta = 1/2 all 24 violate (zeta: none, min 0.475). Liouville: violates for theta >= 1 and in the long scan. DH: violates for theta >= 1 at all three heights, not for theta <= 1/2 in these windows.
6. Requirement flags: R1 no, R2 no (the uniform statement is conditional; the unconditional one is theta = 0), R3 no (the controls fail because the statement is equivalent to the location of their zeros, or for sign twists because the gamma reserve does not match their prime side; no step of an argument fails), R4 no.

The idea is not killed by the test (the test agrees with every registered prediction except one numerical item); it reduces at the first lemma to rows P45 and P10. No pivot was made.

## 1. Plan and what is new against the sources

Sources read: `BRIEF.md`; `OBSTRUCTION_MAP.md` rows Q10, Q12, Q22, Q23, Q24, P45, the controls notes BLS, NR and Lemma P; `g-spinor-square-root/RESULT.md` (H_c, Gamma_+, Gamma_-); `g-passive-cascade/RESULT.md` (Theorem 1, reserve Q*(t)); `c1-leeyang-krein-limit/RESULT.md` (Theorems A to D); `c3-fixedt-growingp-onesided/RESULT.md` (verdict items 1 to 6); `campaign/CHECKPOINT_R14_DRAFT.md` class U7. `c2-jinner-multidelay-lft` and `c2-projection-domination-gonek` were read through their map rows (Q12, Q22) only.

Recorded there: fixed finite P (Q12), the polydisc (Q22), the Reinhardt shell (Q23), the gamma-coupled section with monomial m (Q24), growing P at fixed t (c3: Landau target), the Fejer identity on the critical line and "RH implies positivity for Y up to a power of t" (P45), "tapered sections converge locally uniformly iff no zeros" (Q22, limit step), the height-coupled reserve Q*(t) (g-passive-cascade section 5).

Done here, not recorded there:
- the Fejer section as a section of the gamma one-port in the spinor normalisation, positivity in the closed half-plane (Lemma 2 for Re w > 0, not only on the line), so that Gamma_- vanishes exactly at each stage (Theorem 1 (a));
- the converse with a fixed lower bound along a sequence of stages (Theorem 1 (b));
- the bound of the windowed anticausal block by the tail, with the l^1 and l^2 thresholds stated per theta (Lemma 3);
- what the stage statement with P = t^theta implies on the prime side (Proposition 4) and, argued, on the zero side (Proposition 5);
- the measurement of the windowed anticausal block for zeta, 24 random sign chains, Liouville and DH at P = t^theta, with predictions registered first (`PREDICTIONS.md`).

Notation. s = 1/2 + z. g(s) = psi(s/2)/2 - (log pi)/2, so xi'/xi = 1/s + 1/(s-1) + g + zeta'/zeta =: L. u = log P.
K_u(w) = int_0^u (1 - v/u) e^(-wv) dv = 1/w - (1 - e^(-uw))/(u w^2), entire in w.
Fejer section: L_F(s) = K_u(s) + K_u(s-1) + g(s) + g'(s)/u - sum_{n<=P} Lambda(n)(1 - log n/u) n^(-s) - P^(-s)/(u s^2) - T_P(s), T_P(s) = sum_{k>=1} P^(-2k-s)/(u (2k+s)^2).
Sharp section: L_S(s) = 1/s + 1/(s-1) + g(s) - sum_{n<=P} Lambda(n) n^(-s) + P^(1-s)/(1-s) (+ sum_k P^(-2k-s)/(2k+s)).
Symbol S_P = (1 - alpha L_P)/(1 + alpha L_P); Gamma_-(S) = Q S P the anticausal Hankel block on the line considered. A section is J-contractive at a point iff Re L_P >= 0 there (abs(S_P) <= 1), J-expansive iff Re L_P < 0.
Sign class: Lambda(n) replaced by eps(n) Lambda(n), eps completely multiplicative with values +-1, same gamma one-port. DH: its own coefficients Lambda_D (from D'/D), gamma term g_5(s) = psi((s+1)/2)/2 + (1/2) log(5/pi), no pole terms.

## 2. Pre-filter on paper (Q-P, Q-B, Q-S)

- Q-P (Lemma P, control T-NR). The hypothesis "Re L_F >= 0 on Re s >= 1/2" is a log-level Weil form (step type X1), outside S1 to S3, so T-NR is not forced to pass. It does pass for 0 < c <= 2: the factor m(s) = p0^(s-1/2) + c + p0^(1/2-s) then has all zeros on the line, and each adds a term K_u(s - rho') with non-negative real part. T-NR has no Euler product. [Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes (register campaign/CORRECTIONS_R16.md row 5; second referee push/c16-referee-r15-j1prime-u8-screening): the preceding statement is false as written. Corrected: "For 0 < c <= 2 the symmetric factor has its zeros on the line and adds non-negative terms; this is not the control T-NR (abs c > 2), for which the statement fails through the off-line zeros of the factor." (Map row Q30.)] So the stage statement holds for a function without multiplicativity: the statement does not contain R1. For c > 2 it fails, through the off-line zeros of m.
- Q-B (control BLS). Every step of section 3 (explicit formula, sign of K_u) holds for any function with a zero set and a gamma factor. BLS, with prescribed zeros in the open right half-plane, fails only the conclusion. No step separates.
- Q-S. The target enters linearly: L_F is L filtered by K_u. A symmetric multiplier with zeros in the strip adds sum K_u(s - rho_m). It passes when those zeros are on the line and fails, at P large, when they are not.

Outcome of the pre-filter: the stage property is "zeros on the line", read through a positive kernel. The run was made because the assignment asks for the measured law at P = t^theta and for the first lemma; the pre-filter already fixed that no outcome could set R1 or R4 (recorded in `PREDICTIONS.md` before the run).

## 3. Work

### Lemma 1 (identity). CLASSICAL explicit formula; checked numerically.
For every P >= 2 and every s with Re s > 0: L_F(s) = sum over nontrivial zeros rho of K_u(s - rho) (zeros paired rho, conj rho), and L_S(s) = sum_rho (1 - P^(rho-s))/(s - rho) for s not a zero and P not a prime power.

Proof. For Re s > 1, sum_n Lambda(n)(1 - log n/u)_+ n^(-s) = (1/2 pi i) int_(c) (-zeta'/zeta)(s+w) e^(uw)/(u w^2) dw. Moving the line to the left: the double pole at w = 0 gives -zeta'/zeta(s) - (1/u)(zeta'/zeta)'(s); the pole of zeta gives P^(1-s)/(u(1-s)^2); each zero gives -P^(rho-s)/(u(rho-s)^2); trivial zeros give -P^(-2k-s)/(u(2k+s)^2). Insert (zeta'/zeta)'(s) = -sum_rho (s-rho)^(-2) + s^(-2) + (s-1)^(-2) - g'(s) and xi'/xi = sum_rho 1/(s - rho). Collecting terms gives the definition of L_F. Both sides are holomorphic in Re s > 0, so the identity continues. The sharp case is the truncated explicit formula. QED.
Check (`validate.py`, `logs/out_validate.log`): prime side against 400 zeros at (t, P) = (30.3, 50), (47, 300), (60.5, 2000): differences 6.8e-4, 4.7e-4, 4.2e-4, below the tail bounds 1.4e-3, 9.3e-4, 7.0e-4 (after adding the imaginary part 2t sum_{gamma > G} gamma^(-2) of the omitted pairs).

### Lemma 2 (sign of the kernel). PROVED.
For w = x + iy with x >= 0: Re K_u(w) >= 0, with Re K_u(iy) = (1 - cos uy)/(u y^2) and strict inequality for x > 0.

Proof. Re K_u(w) = int_0^u phi(v) cos(yv) dv, phi(v) = (1 - v/u) e^(-xv). phi >= 0, phi(u) = 0, phi' <= 0 and phi'' = (2x/u) e^(-xv) + x^2 (1 - v/u) e^(-xv) >= 0. For y > 0 integrate by parts: the integral is (1/y) int_0^u (-phi'(v)) sin(yv) dv, and -phi' is non-negative and non-increasing, so the integral over successive half-periods of sin is an alternating sum with non-increasing terms and positive first term. QED.

For x < 0 the last term of K_u is e^(u abs(x)) e^(-iuy)/(u w^2): size P^(abs x)/(u abs(w)^2), no sign.

### Theorem 1 (stage statement and limit step in the tapered class). PROVED.
(a) Suppose zeta has no zero in Re s > 1/2 + eta_0, 0 <= eta_0 <= 1/2. Then for every P >= 2, Re L_F(s) >= 0 on Re s >= 1/2 + eta_0. Hence for every alpha > 0 the symbol S_P is holomorphic with abs(S_P) <= 1 on Re s > 1/2 + eta_0 and Gamma_-(S_P) = 0 on each line Re s = 1/2 + eta, eta >= eta_0. Unconditional for eta_0 = 1/2.
(b) Suppose there are P_j -> infinity and M with Re L_{F,P_j}(s) >= -M on Re s > 1/2 + eta_0. Then zeta has no zero in Re s > 1/2 + eta_0.

Proof. (a) Lemma 1 and Lemma 2: every zero has Re(s - rho) >= 0. (b) h_j = L_{F,P_j} + M are holomorphic with non-negative real part on the half-plane Omega. For Re s > 1 the Fejer means converge: L_{F,P}(s) -> xi'/xi(s) as P -> infinity (K_u(s) -> 1/s, K_u(s-1) -> 1/(s-1), the other terms -> 0). A family of functions with non-negative real part and bounded value at one point is locally bounded (Harnack), hence normal; by Vitali h_j converges locally uniformly on Omega to a holomorphic function equal to xi'/xi + M on Re s > 1. So xi'/xi is holomorphic on Omega. QED.

Remarks. (i) With eta_0 = 0, (a) and (b) say: RH iff the Fejer sections are J-contractive on Re s > 1/2 for all P iff this holds along one sequence P_j -> infinity with a fixed deficit M. The hypothesis of (b) is equivalent to the conclusion; the proof does not assume it. (ii) This is where the tapered class differs from the J-inner sharp sections of row Q22: positive-real functions are closed under locally uniform limits and Harnack supplies compactness, so nothing is lost in the limit. What is lost is that the stage inequality at unbounded P is the target. (iii) On the line the stage inequality is the Weil functional on the tests g * g~, g = e^(itx) 1_[0, log P] (row P45); the half-plane form adds the damping e^(-xv).

### Lemma 3 (windowed anticausal block against the tail). PROVED; the consequences for theta are CLASSICAL or ARGUED as marked.
Fix a line Re s = 1/2 + eta and a window function W with 0 <= W <= 1. Write Gamma_-^W(S) = Q M_{WS} P. Then
norm(Gamma_-^W(S_1) - Gamma_-^W(S_2)) <= sup abs(W (S_1 - S_2)), and S_1 - S_2 = -2 alpha (L_1 - L_2)/((1 + alpha L_1)(1 + alpha L_2)).
If Re L >= 0 on the line (so abs(1 + alpha L) >= 1):

    norm(Gamma_-^W(S_P)) <= norm(Gamma_-^W(S)) + 2 alpha sup over supp W of abs(L_P - L)/abs(1 + alpha L_P).      (3.1)

Proof. Q and P are projections and M_f has norm sup abs(f). QED.

The difference on Re s = 1/2 + eta:
- Sharp: L_S - L = sum_{n>P} Lambda(n) n^(-s) - P^(1-s)/(s-1) for eta > 1/2 (absolutely convergent tail; any P, any theta, sup norm at most about P^(1/2-eta)/(eta - 1/2)). For eta <= 1/2 the series does not converge absolutely and L_S - L = -sum_rho P^(rho-s)/(s - rho), a sum over zeros.
- Fejer: L_F - L = -(1/u) sum_rho (1 - P^(rho-s))/(s - rho)^2. If no zero has real part above 1/2 + eta', eta' < eta, then abs(L_F - L) <= (2/u) sum_rho ((eta - eta')^2 + (t - gamma)^2)^(-1) <= C log t/(u (eta - eta')) (CLASSICAL count of zeros in unit intervals), that is C/(theta (eta - eta')) at P = t^theta: bounded uniformly in t, small only when theta (eta - eta') is large.
- l^2 control (row Q10: sum (log p)^2 p^(-1-2 eta) < infinity for eta > 0). CLASSICAL (Montgomery-Vaughan): int_T^2T abs(sum_{P<n<=Y} Lambda(n) n^(-1/2-eta-it))^2 dt = sum Lambda(n)^2 n^(-1-2 eta) (T + O(n)). The diagonal dominates only for Y <= T. So for theta < 1 the segment t^theta < n <= t of the tail is small in mean square, about P^(-2 eta) log P/(2 eta): a bound for all heights outside a set of small measure. For theta >= 1 no segment of the tail is in the mean-value range; the remainder is the zero sum and its mean square is a zero-density statement. In neither case does l^2 give a bound in every window (the MV-CAP wall).
- l^1 control (every window). Available for eta > 1/2, or on the line for the stage itself in the range of item 4 of the verdict.

So: square-summability controls the tail for theta < 1 in measure; every-window control needs absolute summability (eta > 1/2 or P <= about (log t)^2), or a zero-free hypothesis. No theta > 0 has an unconditional every-window bound on Re s = 1/2 + eta with eta <= 1/2 other than through eta_0 of Theorem 1 (a).

### Proposition 4 (what the stage statement at P = t^theta gives on the prime side). PROVED (constants not optimised; author only).
Let 0 < delta < log 2, B(y) = (delta/2 pi)(sin(delta y/2)/(delta y/2))^2, so B >= 0, int B = 1, and b(v) = int B(y) e^(-iyv) dy = (1 - abs(v)/delta)_+. Let t >= 100, 4 <= P <= t^2, and suppose Re L_F(1/2 + i tau) >= -M for abs(tau - t) <= t/2. Then for every x with 2 e^delta <= x <= P:

    abs( sum_n Lambda(n) (1 - log n/log P)_+ (1 - abs(log(n/x))/delta)_+ n^(-1/2-it) ) <= log(t/2 pi) + 2M + C/(delta log P).

Proof. Put v_0 = log x and, for real phi, w(y) = B(y)(1 + cos(v_0 y + phi)) >= 0; int w = 1 because v_0 > delta. Integrate Re L_F(1/2 + i(t+y)) against w. Prime side: the term n contributes Re[c_n (b(log n) + (1/2) e^(i phi) b(log n - v_0) + (1/2) e^(-i phi) b(log n + v_0))], c_n the coefficient; b(log n) = b(log n + v_0) = 0 since log n >= log 2 > delta. Gamma side: int Re(gamma terms) w = (1/2) log(t/2 pi) + O(1/u) + O(log t/(delta t)) + O(sqrt P/(u t^2)); the part against cos(v_0 y + phi) is small because g is analytic and slowly varying on abs(y) <= t/2, and the only oscillating term, in K_u(s-1), has frequency u and size sqrt P/(u t^2). Tail abs(y) > t/2: at most 2 (sum abs(c_n) + log t)(4/(pi delta t)) <= C/(delta u) for P <= t^2. So (1/2) log(t/2 pi) - (1/2) Re[e^(i phi) Sigma] + O(1/(delta u)) >= -M; choose phi with e^(i phi) Sigma = abs(Sigma). QED.

Reading. For x <= P/e the weight (1 - log n/u) is at least about 1/u on the range, and the trivial bound of the sum is about sqrt(x) delta (1 - log x/u). So the stage statement C(theta) (Re L_F(1/2 + it) >= -M for all t >= t_0 and all P <= t^theta) contains square-root cancellation, up to log P log t/delta, in smoothed sums of Lambda(n) n^(-it) over every interval (x e^(-delta), x e^delta), x <= P/e, P <= t^theta, at every height. At the heights of the test the bound is below the trivial one from about x = 1e5 on (section 4.5). CLASSICAL (recalled): unconditional bounds for sum_{n ~ P} Lambda(n) n^(-it) at P = t^theta save a power P^(c theta^2) at best (Vinogradov), not a square root. The proof of Proposition 4 does not use Lambda(n) >= 0, the support on prime powers, or multiplicativity: it holds verbatim for the sign classes and for DH coefficients with their gamma terms.

### Proposition 5 (zero side of the coupled statement). ARGUED.
C(theta) follows from RH (Theorem 1 (a)) and from the unconditional range only for P <= P_1(t) = ((1/4 + o(1)) log t log log t)^2. In the other direction, a single pair rho_0 = 1/2 + b + i gamma_0, b > 0, contributes at s = 1/2 + i(gamma_0 + y) the term -P^b cos(uy)/(u y^2)(1 + O(b/y)); at y = 2 pi/u this is -P^b u/(4 pi^2), against a positive sum from the other zeros of typical size (1/2) log t. So C(theta) fails near gamma_0 once gamma_0^(theta b) > 2 pi^2/theta, and C(theta) corresponds to the region beta - 1/2 <= c_theta/log gamma, c_theta about log(20/theta)/theta. Not proved: other off-line zeros near the same height could cancel the term at a given P; excluding this needs a power-sum argument (Turan) whose loss was not computed. If the correspondence holds, the statements C(theta) increase in strength with theta and reach RH only as theta -> infinity; none is known for any theta > 0.

### Sharp sections (J-expansive). PROVED formula, MEASURED sign.
Under RH, Re L_S(1/2 + it) = sum_gamma sin(u(t - gamma))/(t - gamma) + O(P^(-5/2)/t) (Lemma 1; the pole term is part of the definition of L_S): the kernel is the Dirichlet kernel, without a sign. Measured (section 4): zeta's own sharp section has Re L_S < 0 on 4.7 to 6.7 percent of the window at theta = 1/2 and on 25 to 41 percent for theta >= 1; abs(S_S) reaches 22 to 149 on the line and the windowed N_- is 0.7 to 2.5. At theta = 1/4 (P <= 18, inside the l^1 range) it is contractive. So for P = t^theta, theta >= 1/2, contractive or expansive is decided by the taper, for zeta itself, and a J-expansive stage statement of the form "N_- of the sharp section is small" is false at the stage level for zeta on the critical line.

## 4. Decisive test

### 4.1 Set-up
`stage.py` (server, through rhrun; units rh-c15u7-1119180553, rh-c15u7b-1119181813, rh-c15u7c-1119182157, rh-c15u7d-1119183306, rh-c15u7e-1119183423, rh-c15u7f-1119183817, rh-c15u7g-1119183940; at most 4 cores and 8 GB in total; all stopped or finished). Window: 200 units of height centred at t, step 0.02 (0.01 and 0.005 in the rechecks). Line Re s = 1/2, alpha = 1. N_-: largest singular value of the 600 x 600 Hankel matrix of the Fourier transform of W S on r in [-38, -0.4], W Gaussian of width 15; N_+ the same on r > 0.4. Floor: the gamma one-port alone. T_P is dropped (below 1e-9). Cell (1e5, 2) needs P = 1e10 and was not run; (1e5, 1.6) and, for DH (coefficients to 1e6 only), (1e4, 1.5) and (1e5, 1.2) were added. DH was not run at P = 1e8. Predictions P1 to P6 were written to `PREDICTIONS.md` before the run, P7 before the long scan.

### 4.2 Results (full tables: `tables.txt`; raw: `out/`, `out_dt/`, `logs/`)

Zeta (Fejer), zeta (sharp), Liouville, DH; "frac" = fraction of the window with Re L < 0.

| t | theta | P | zeta F: min Re L | zeta F: N_- | zeta sharp: min, frac | Liouville: min, frac, N_- | DH: min, frac, N_- |
|---|---|---|---|---|---|---|---|
| 1e3 | 1/4 | 5.6 | 1.88 | 3.1e-11 | 0.39, 0 | 1.90, 0, floor | 3.09, 0, floor |
| 1e3 | 1/2 | 31.6 | 0.73 | 3.1e-11 | -2.33, 0.067 | 0.22, 0, floor | 1.68, 0, floor |
| 1e3 | 1 | 1e3 | 0.093 | 3.1e-11 | -5.37, 0.285 | -2.62, 0.024, 3.3 | -0.84, 0.006, 2.4e-4 |
| 1e3 | 2 | 1e6 | 0.065 | 3.5e-11 (step 0.01) | -7.67, 0.409 | -6.02, 0.220, 1.3 | -41.8, 0.032, 0.47 |
| 1e4 | 1/4 | 10 | 2.53 | 3.8e-11 | 0.27, 0 | 2.57, 0, floor | 3.95, 0, floor |
| 1e4 | 1/2 | 100 | 0.96 | 3.8e-11 | -2.33, 0.058 | 1.12, 0, floor | 1.83, 0, floor |
| 1e4 | 1 | 1e4 | 0.150 | 3.8e-10 | -6.58, 0.270 | -1.22, 0.018, 0.23 | -5.27, 0.010, 0.47 |
| 1e4 | 1.5 | 1e6 | 0.099 | 3.8e-11 (step 0.01) | -8.15, 0.354 | -3.64, 0.085, 1.0 | -38.5, 0.032, 0.42 |
| 1e4 | 2 | 1e8 | 0.067 | 3.7e-7 (step 0.01; 6.1e-4 at 0.02) | -10.2, 0.397 | -6.04, 0.219, 0.75 | not run |
| 1e5 | 1/4 | 17.8 | 3.20 | 4.3e-11 | 0.34, 0 | 3.25, 0, floor | 4.64, 0, floor |
| 1e5 | 1/2 | 316 | 1.03 | 4.3e-11 | -3.22, 0.047 | 1.95, 0, floor | 1.60, 0, floor |
| 1e5 | 1 | 1e5 | 0.152 | 4.3e-11 (step 0.01) | -8.65, 0.249 | -2.42, 0.015, 0.31 | -8.13, 0.011, 0.021 |
| 1e5 | 1.2 | 1e6 | 0.132 | 7.5e-11 (step 0.01) | -9.47, 0.300 | -4.28, 0.029, 0.71 | -18.1, 0.021, 0.31 |
| 1e5 | 1.6 | 1e8 | 0.151 | 3.6e-8 (step 0.01; 1.7e-4 at 0.02) | -10.9, 0.357 | -8.13, 0.096, 1.2 | not run |

Random completely multiplicative signs, 24 seeds, Fejer section. "Gauss" = Phi(-z), z = 2.449 log(t/2 pi)/(theta log t) (variance u^2/24 of the real part of the Fejer-weighted prime sum against the reserve (1/2) log(t/2 pi)).

| t | theta | seeds with Re L < 0 | frac: median [min, max] | Gauss | min Re L: median [min, max] | N_-: median [min, max] |
|---|---|---|---|---|---|---|
| 1e3 | 1/4 | 0/24 | 0 | 3e-13 | 1.89 [1.86, 1.91] | floor |
| 1e3 | 1/2 | 0/24 | 0 | 1.6e-4 | 0.56 [0.18, 0.81] | floor |
| 1e3 | 1 | 24/24 | 0.030 [0.023, 0.039] | 0.036 | -2.11 [-3.48, -1.35] | 0.61 [8.8e-5, 3.7] |
| 1e3 | 2 | 24/24 | 0.177 [0.163, 0.197] | 0.184 | -7.18 [-10.0, -5.30] | 1.5 [0.97, 7.7] |
| 1e4 | 1/4 | 0/24 | 0 | 2e-15 | 2.59 [2.51, 2.65] | floor |
| 1e4 | 1/2 | 0/24 | 0 | 4.4e-5 | 0.79 [0.25, 1.24] | floor |
| 1e4 | 1 | 24/24 | 0.022 [0.012, 0.028] | 0.025 | -2.21 [-4.19, -1.45] | 1.1 [0.14, 2.2] |
| 1e4 | 1.5 | 24/24 | 0.091 [0.081, 0.104] | 0.096 | -5.62 [-8.29, -3.79] | 1.3 [0.48, 2.2] |
| 1e4 | 2 | 24/24 | 0.158 [0.149, 0.169] | 0.163 | -9.20 [-11.5, -6.92] | 1.0 [0.63, 5.1] |
| 1e5 | 1/4 | 0/24 | 0 | 9e-17 | 3.27 [3.08, 3.48] | floor |
| 1e5 | 1/2 | 0/24 | 0 | 1.9e-5 | 1.27 [0.54, 1.83] | floor |
| 1e5 | 1 | 24/24 | 0.017 [0.013, 0.023] | 0.020 | -2.73 [-4.49, -1.89] | 0.42 [0.018, 5.5] |
| 1e5 | 1.2 | 24/24 | 0.040 [0.029, 0.048] | 0.043 | -4.64 [-5.86, -3.36] | 0.78 [0.36, 1.9] |
| 1e5 | 1.6 | 24/24 | 0.095 [0.088, 0.107] | 0.099 | -8.03 [-10.5, -6.65] | 0.71 [0.51, 8.2] |

Long scan (`scan_half.py`), P = t^theta recomputed per block of 200, 5e6 samples per range:

| heights | theta | zeta: min Re L_F, negative samples | Liouville: min, negative samples | random: seeds with a negative sample, total negative samples, lowest min |
|---|---|---|---|---|
| [1e4, 1.1e5] | 1/2 | 0.530, 0 | -0.137, 13 | 24/24, 820, -0.888 |
| [1e5, 2e5] | 1/2 | 0.475, 0 | -0.566, 26 | 24/24, 829, -1.169 |
| [1e4, 1.1e5] | 0.7 | 0.214, 0 | -2.58, 6331 | 24/24, 171611, -3.28 |

### 4.3 Predictions against outcomes
- P1 (zeta, Fejer: min Re L >= -1e-3; N_- within a factor 10 of the floor). First part holds in all 14 cells (lowest 0.0615 at (1e3, 2), step 0.005). Second part: at step 0.02 the cells with P >= 1e5 gave N_- between 1e-7 and 6e-4, above the stated factor. This is aliasing of the causal part (abs(S) reaches 0.99 and the causal transform extends past the Nyquist frequency 157): at step 0.01 the same cells give 3.5e-11, 3.8e-11, 4.3e-11, 7.5e-11 against floors 3.1e-11, 3.8e-11, 4.3e-11, 4.3e-11, and step 0.005 at (1e3, 2) gives 3.6e-11. The two cells at P = 1e8 fall from 6.1e-4 and 1.7e-4 at step 0.02 to 3.7e-7 and 3.6e-8 at step 0.01 (floors 3.8e-11, 4.3e-11): a decrease by more than 1e3 per halving, not yet at the floor; step 0.005 was not run for them (about 3 hours each). For these two cells the prediction is not confirmed numerically; abs(S) <= 0.99 and Re L_F >= 0.067 on the whole window in both. Under RH the exact value is 0 (Theorem 1 (a)); with RH verified only to height 3e12, a zero off the line above that height would change Re L_F in these cells by less than sqrt(P)/(u (3e12)^2), below 1e-21.
- P2 (zeta, sharp: negative for theta >= 1/2, not for 1/4). Holds in all cells.
- P3 (random signs). theta >= 1: 24/24 violate in every cell; measured fraction is 0.83 to 0.97 of the Gaussian value. theta = 1/2: 0/24 in the 200-unit windows (predicted 0 to 2). theta = 1/4: 0/24, and these three cells lie in the l^1 range (sum of absolute coefficients 0.64, 1.18, 1.87 against reserves 2.48, 3.68, 4.84), so no sign class can violate there. Holds.
- P4 (Liouville). theta >= 1.5: 0.085 to 0.220; theta = 1: 0.015 to 0.024; theta <= 1/2: none in the windows. Holds. (theta = 1.2: 0.029; theta = 1.6: 0.096.)
- P5 (DH: negative for theta >= 1 at each t, not at 1/4). Holds. theta = 1/2 (not predicted): no violation in these windows. The DH sums are well conditioned (sum of absolute coefficients at most 1014).
- P6 (N_- above 100 times the floor where min Re L < -1; near the floor where min Re L >= 0). First part holds in every row. Second part holds after the step correction of P1. Classes with -1 < min Re L < 0 also show N_- above the floor (DH at (1e3, 1): 2.4e-4), so a pole of S_P in the right half-plane is present before Re L reaches -1. N_- of the violating classes changes by up to 40 percent between steps 0.02, 0.01 and 0.005 (spikes of S on the line); the values are orders of magnitude, not constants.
- P7 (long scan at theta = 1/2). Zeta: no negative sample. All 24 seeds violate; the rate is 6.8e-6 per sample against the Gaussian 2e-5 to 4.4e-5 (tail thinner than Gaussian by a factor 3 to 6, as allowed for in the prediction). Liouville violates as well. At theta = 0.7: zeta none; all 24 seeds violate at 1.4e-3 per sample (Gaussian 2.6e-3).

### 4.4 What the measurement shows and what it does not
- At the stage level the Fejer section separates zeta from both sign classes and from DH for theta >= 1 in windows of 200, and from the sign classes at theta = 1/2 in windows of 1e5. At theta = 1/4 nothing is separated, by the l^1 bound.
- There is no decay law to compare: zeta's N_- is zero at every stage and the controls' N_- is of order 1 where they violate. The quantity that moves with theta for the controls is the fraction of heights with Re L < 0, and for the random class it follows the Gaussian count of how often a sum with variance u^2/24 exceeds the reserve.
- The separation is the identity of Lemma 1 and the sign of Lemma 2. For zeta all zeros below the verified height are on the line, so every term from them is non-negative, and terms from higher zeros are below 1e-21 in these cells. For a random sign chain there is no completed function with these gamma terms; its prime side is a generic Dirichlet polynomial and exceeds the reserve at the Gaussian rate. For DH the off-line zeros give the terms P^b cos(uy)/(u y^2). None of this is a use of multiplicativity in an argument: the T-NR control with c <= 2 (no Euler product, zeros on the line) passes by the same identity (section 2), and Proposition 4 holds for any coefficients.
- The run does not test R4. It confirms a stage identity at heights where RH is verified.

### 4.5 Check of Proposition 4 (`ref_checks.py`, `ref_checks2.py`, `logs/ref_checks.log`, `logs/ref_checks2.log`)
- The integral identity in the proof, by quadrature on abs(y) <= 400 at t = 1e4, P = 1e2 and 1e4, phi = 0 and 1.3 (frequency v_0 = u): integral 3.6663, 3.6702, 3.6717, 3.6666 against the formula 3.6780, 3.6819, 3.6833, 3.6783; the constant difference 0.0117 is the omitted tail mass 2/(pi delta Y) = 0.0032 times the mean 3.68.
- The bound, delta = 1/2, sup over 10001 heights in t +- 100, P = 1e6, x = P/e and P/e^2: the trivial bound is 21.6 and 26.5, the bound log(t/2 pi) is 5.07, 7.37, 9.68 at t = 1e3, 1e4, 1e5; zeta's sup is 0.22 to 0.45; six random sign chains give 0.21 to 0.83. With the edge weight of the first draft (x = P only) the trivial bound (0.08 to 2.7) was below the bound at these heights, so that form was empty here; the statement was changed to general x.
- So the conclusion of Proposition 4 holds for the sign chains too, although they violate its hypothesis on 4 to 18 percent of the same windows. The band-by-band square-root bound is not what separates zeta; the stage statement is the one-sided bound for the sum over all bands at once.

## 5. Controls

| Control | Outcome | Step |
|---|---|---|
| DH | stage statement false for theta >= 1 at t = 1e3, 1e4, 1e5 (MEASURED; min Re L down to -41.8); passes at theta <= 1/2 in 200-unit windows | fails through its off-line zeros in Lemma 1 (terms with Re(s - rho) < 0); Lemma 1, Lemma 3 and Proposition 4 hold for it with its own data |
| sign-twisted primes (completely multiplicative, random) | false for theta >= 1 (24/24), and at theta = 1/2 in long windows (24/24); passes for P in the l^1 range | no functional equation matching the gamma one-port: Lemma 1 is not available; the failure rate is the Gaussian rate of a generic polynomial |
| Liouville | false for theta >= 1 and in long windows at 1/2 | Re L = log(t/2 pi) - (Fejer count of zeta zeros) + (even prime-power terms, O(1)): fails where the smoothed zero count exceeds about twice its mean |
| unimodular twist (Dirichlet character) | not run; Theorem 1 holds for L(s, chi) with its gamma term under GRH | same identity |
| backward heat | not run; the family has zeros off the line for tau < 0, so Theorem 1 (a) hypothesis fails; Lemma 3 and Proposition 4 hold | conclusion only |
| zeta(s+a) zeta(s-a) | not run; zeros at real part 1/2 +- a, terms P^a without sign: fails for P^a large, i.e. theta log t > c/a | conclusion only |
| T-NR | passes for 0 < c <= 2 at every P and t (PROVED, section 2); fails for c > 2 | shows the statement does not need an Euler product |
| Beurling, BLS, phase-rotated transfer operator, theta^w | not run; Lemma 2 and Proposition 4 apply to any zero set and gamma factor | no separating step |

## 6. Requirement flags

- R1 (multiplicativity essential): **no**. Lemma 1 is the explicit formula, Lemma 2 a kernel inequality, Proposition 4 holds for arbitrary coefficients, and T-NR with c <= 2 passes the stage statement.
- R2 (uniform in height, every window): **no** as an established result. Theorem 1 (a) is uniform and every-window but conditional on its hypothesis; the unconditional every-window range is P <= about ((1/4) log t log log t)^2 (theta = 0), which is the reserve bound Q*(t) of `g-passive-cascade` with the Fejer weight.
- R3 (fails for every control at a named structural step): **no**. DH, sign twists and Liouville fail the statement (MEASURED), but because the statement is equivalent to zero location or because Lemma 1 is not available to them; unimodular twists and T-NR (c <= 2) pass. [Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes (register campaign/CORRECTIONS_R16.md row 6; second referee push/c16-referee-r15-j1prime-u8-screening): the preceding statement is false as written. Corrected: "Dirichlet characters pass under GRH; the campaign's unimodular control violates the stage statement at theta >= 1" (MEASURED: first referee 4 of 4 random unimodular twists violate; second referee 6 of 6 at t near 2000, P = 2000). The factor with c <= 2 is not the control T-NR (row 5 of the register). Map row Q30.]
- R4 (reaches the critical line from finite stages): **no**. Theorem 1 (b) shows the limit step is sound in the tapered class and that its hypothesis is RH. With P = t^theta the hypothesis is Proposition 4's bound, unproved for every theta > 0.

## 7. Three weakest steps

1. Proposition 5 is argued for a single off-line pair. The claimed correspondence between C(theta) and the region beta - 1/2 <= c_theta/log gamma is not proved in either direction beyond "RH implies C(theta)". If several off-line zeros at nearly the same height cancel, C(theta) could hold with zeros further from the line than stated.
2. Proposition 4's error terms (gamma side against cos(uy + phi), tail abs(y) > t/2) are bounded by inspection, not written with explicit constants; the range P <= t^2 comes from the term K_u(s-1) and the tail. It has had no independent referee. The Vinogradov comparison is recalled, not opened.
3. The measurement is float64 on a grid: min Re L is a grid minimum (step 0.02 against features of width about 1/u >= 0.05); N_- depends on the step for the violating classes (up to 40 percent) and showed an aliasing artefact for zeta at step 0.02 that was removed only where the step was halved; the DH cells stop at P = 1e6 and the cell (1e5, 2) was not run. The Gaussian comparison for the random class is empirical: moments justify it only to order 1/theta.

## 8. Proposed map row (for the record lane; not written to the map here)

Q25 | Sections of the prime chain with P = t^theta on the gamma one-port; J-expansive (sharp) sections (left open by Q22 to Q24; class U7) | Fejer section L_F = sum_rho K_u(s - rho), Re K_u >= 0 on Re w >= 0: J-contractive on Re s > 1/2 + eta_0 for every P iff no zeros there (limit step by Harnack and Vitali; stage inequality = row P45). Coupled to height, the stage statement implies square-root cancellation up to log P log t for smoothed sums of Lambda(n) n^(-it) over (x/e^delta, x e^delta), x <= P/e, P <= t^theta, in every window, for arbitrary coefficients (a necessary condition that random sign chains also meet); unconditional only for P <= about ((1/4) log t log log t)^2. Windowed anticausal block bounded by the tail in sup norm: absolute summability (eta > 1/2) or a zero-free hypothesis; square-summability gives most windows for theta < 1 only. Sharp sections are J-expansive for zeta at theta >= 1/2 (MEASURED). | PROVED (Lemma 2, Theorem 1, Lemma 3, Proposition 4; author only); ARGUED (Proposition 5); MEASURED (14 cells, 24 seeds, long scan) | DH, TW+-, Liouville fail the statement, not a step; T-NR (c <= 2) and unimodular twists pass | `c15-u7-growing-section-twin-ladder-bridge`
