# Referee report R5: finite model algebra and native debit

Object: hexagon:2611.00460v1 (Raymond), sec 3.3-3.5, App A, C.3-C.4; Lemma 3.3, eqs (58)-(72), (124)-(130),
Lemma A.1, Props A.2, A.3. Stages audited: `native`, `activation`, `spectral`, `affine` (and, because C.4 is in
scope, the ledger script `physical-debit-map` was read but not run).

Date 2026-11-17. All runs local, through `scripts/memcap.sh 8`, Python 3.15.2 `-I`, python-flint 0.9.0 / mpmath
1.4.1 / numpy from a sibling venv (not the packet's pinned Linux runtime).

## Verdict

**verified-with-corrections** for the part in scope, with the scope limits listed in section 5.

No error and no missing argument was found in the algebra of sec 3.3-3.5, App A, C.3, C.4. Every displayed
statement in scope was re-derived by hand; the four checker stages were read in full and replayed (all pass, with
the same check counts as the author's log); the inequalities were tested against the actual finite model (51) with
independent code. The corrections are expository (section 4): none changes a number.

The part is conditional on inputs that belong to other referees: the physical errors e_0, e_1 of Prop 3.2 (R4),
and the binding of these tables to the final plan and source (R7, R9). Nothing here verifies those.

## 1. Re-derivation, statement by statement

Notation as in the paper. "OK" means I derived the statement from the stated hypotheses and it agrees.

| Statement | Result | Notes |
|---|---|---|
| Heat ODE for d_t = D log* b_t | OK | From d_t b = D^2 b / 4 and b = exp*(l): d_t l = (D^2 l + Dl * Dl)/4, hence d_t d(n) = (log^2 n /4) d(n) + (log n /4) sum_{ab=n, a,b>=2} d(a)d(b). d_t(1) = 0, so the convolution only involves smaller indices. |
| Lemma 3.3, d_t(n) >= 0, nondecreasing | OK | Integrating factor and induction on n; d_0 = von Mangoldt >= 0. This is the only place the Euler product enters this part. |
| (60) | OK | D log*(1 - b_t(p) p^-s) has coefficient -(log p) b_t(p)^j at p^j, and b_t(p)^j = exp(j t log^2 p /4). |
| Lemma 3.3, d~_t >= 0, nondecreasing | OK, proof in paper is one line | d~ = d except at powers of 2, 3, 5. At n = p^j: d_t d~ = (j^2 log^2 p /4) d~ + j(j-1)(log^2 p /4)(log p) e^{j t log^2 p/4} + (nonnegative convolution), d~_0 = 0. So d~ >= 0 and nondecreasing. d~_t(p) = 0 identically. |
| Lemma 3.3, c_t >= 0, nondecreasing; (58), (59) | OK | (59) with c(1) = 1 and induction. c_t(p) = 0 for p in {2,3,5}. |
| (61) | OK | For n <= N_0 every divisor pair is inside the collected head, phases n^{i tau} e^{-zeta log n/2} are completely multiplicative, so the coefficient of V - Q T_K at n is sum_{k divides n, k>K} d~(k) c(n/k) >= 0. |
| (62) R* = B - (1-A) D_K - 2 Z_K | OK, exact | head residual = B_head - D_K - Z_K; overflow products (k m > N_0) = D_K A_head - Z_K; exterior and reflected labels B_ext + A_ext D_K. Sum is the stated expression. It is a sum of nonnegative terms, so replacing A, B by upper bounds and D_K, Z_K by lower bounds (with A < 1) is in the right direction. |
| Comparison point (thermal t+, abscissa (1+h)/2 + t- L_0/4) | OK | Each residual term is (coefficient nondecreasing in t) x n^{-sigma}; for reflected labels b_t(n) n^{-tL/4} <= b_{t+}(n) n^{-t- L_0/4} because log n <= L_0/2. The identity (62) is then applied at the comparison point itself, where it is exact. |
| Frequency uniformity for L >= L_0 | OK | First-branch frequencies are fixed and weights decrease in L. Reflected: d/dL (lambda w) = w (1 - lambda (h/2 + (t/4) log(dn))) <= 0 because lambda >= log N_0 and h > 1. Needs L >= L_0 for every x >= X: 4 pi N_0^2 = 5999994808434.1 < X - 4, checked. |
| Activation densities, sec 3.4 / App A | OK | Exponents re-derived for both branches. w^2 - 2sw <= delta^2 on 0 < w <= s + delta. log N <= v_0 + s + t/(32 e^L), far below delta. Sum-to-integral: first branch is decreasing in n; the reflected branch is quasi-convex in log n (it can decrease then increase when s > 2d/t), and term(n)/term(x) <= exp((d + t delta/2)/N_0) on [n-1, n], which is the last two terms of (108). |
| (110) one constant C | OK | t >= t-, v_0 > V-, a = t- V-/2 <= t v_0/2; A(s), D(s) are decreasing in a. |
| (111), (112) -> Lemma A.1 (113), (114) | OK | Closed forms agree with quadrature to 1e-28 (section 3). |
| Prop A.2 | OK | e^{as} A' = -a/d + kU e^{-ds} + (c/p) e^{-hs}; value 2 at s = 0; strictly decreasing; one sign change if a > 0. For a = 0 the supremum 1/d is a limit, not attained; it is used only as an upper bound, which is valid. |
| Prop A.3 | OK | (115) makes both nonconstant terms strictly decreasing for all s >= 0; value V+ at 0. |
| (63) near bounds | OK | I_0(-d,s) <= s; e^{-cs} I_0(p,s) <= s because c >= h > p. D <= V+ s + 5 s^2/4 <= (V+ + 2s) s. |
| (64), (68), (130) E_an | OK | f'/f = Q'/Q - E'/E, Q'/Q = -V/(2Q), V/Q - T_K = (V - Q T_K)/Q, modulus <= (R* + b + a D+)/g. -E'/E restores the prime powers p^j <= K to d_t and leaves the tail T/2. Result: f'/f = -(1/2) sum_{n<=4096} d_t(n) n^{-1/2 - tL/4 + i tau} e^{-zeta log n /2} + remainder, modulus of remainder <= E_an. |
| a = P A_act, b = 2 P D_act + P_1 A_act | OK | Label d*n has frequency log d + (frequency of n); D_act is the half-frequency moment. |
| (65), (69), (128), (129) | OK | Delta = E(G - f), Delta' = E'(G - f) + E(G' - f'), modulus E' <= P_1/2. Difference of quotients as displayed; decreasing in modulus Q >= g. |
| Convexity of the near branch | OK | Numerators are polynomials in u = s + delta with nonnegative coefficients, 1/g and 1/(g - r_0) have nonnegative power series while g - r_0 > 0. The checker verifies g - r_0 > 0 at s = R, and the gap is decreasing in s. |
| (70) | OK | Convexity on [0, R] with N(R) <= N(0) + beta M R/2; G <= N(0) + beta M R/2 for s >= R; s = (L - L_0)/2. |
| (71), (72) | OK | (V - Q T_K)/Q + Euler tail is the Laplace transform, in zeta, of a complex measure dominated by rho * sum nu^{*m} + epsilon; one measure for all translations because the model is frozen at the centre. Support is in lambda >= log 4097 (residual indices have a divisor > K; overflow, exterior, reflected and activated labels have frequency >= log N_0; convolution adds nonnegative frequencies). The functional becomes Re of the integral of F_i against that measure. |
| Taylor cover and tail in the spectral checker | OK | Second-derivative bound abs(coef)(alpha^2 + beta^2) e^{-alpha a} is correct; tail uses h >= h_0 for every node, which is checked. |
| Refund scaling (sec 3.4, C.4) | OK | g - kappa r_0 >= g - r_0 > 0. |
| Refund valid on both affine branches | OK | Near: P(s; r) - P(s; kappa r) >= (1 - kappa) P(s; r) >= (1 - kappa) P(0; r), since P increases in s. Far: same with the global cap, and global cap >= anchor cap (checked for all 469 heights). |
| (125) | OK | alpha, alpha' bounds and 6.5982/(X-2) = 32991/(5000(X-2)) = 1.1e-12 re-derived by hand. |

Failure modes looked for specifically:

- Open range used at an endpoint: s = 0 (x = X, empty activation set), t = 0 (row 0, a = 0), h > 1 strict (smallest
  native height is 1.21), abs(v) = 39/20 (row 0 has a node exactly there; the range in (52) is closed). None fails.
- Supremum at infinity: only the a = 0 case; used as a bound, not as an attained value.
- Limit and maximum: the bisection bracket is evaluated as an interval, so no limit is exchanged with a maximum.
- Bound valid only for large argument: the monotonicity in L starts at L_0 and x >= X gives L > L_0 (margin 9e-7).
- Appeal to an earlier preprint: none in this part. The tables come from the earlier plan but each consumed
  field is recomputed by the `native` and `activation` stages.

## 2. Checker stages: code read and replayed

| Stage | Read | Replay | Agreement with author's log |
|---|---|---|---|
| native | full | PASS, 67 rows, 469 heights, 843,026 checks, 121 s | same check count |
| activation | full | PASS, 6,829 checks | same |
| spectral | full | PASS, 14,727 leaves, 19,416 interval evaluations | same |
| affine | full | PASS, 67 rows | same |
| physical-debit-map | full | not run (own recomputation instead, section 3) | - |

Points confirmed by reading:

- `native` recomputes A, B, P, P_1, D (upper and lower), Z (lower), T at the comparison point. Bin enclosures are
  valid: the first-branch summand is monotone on each bin (guard `tr*v/2 < su`), the reflected summand is convex
  in log n and the stationary value is added to the hull. All cutoffs N_0/(k d) are bin endpoints.
- The fields consumed by `affine` are exactly the fields `native` and `activation` check, read from the same two
  files (paths compared in the access logs).
- `affine` implements (64), (65), (63), (68), (69) and the two inequalities behind (70) as written; r_0 = P/2e6 and
  r_1 = P/2e4 + P_1/4e6 are e_0 P and e_1 P + e_0 P_1/2. The values e_0, e_1 are literals.
- No stage accepts a stored PASS flag or a stored root bracket.

## 3. Own numerical tests (scripts in `scripts/R5/`, logs in `runs/R5_*.log`)

| Test | Content | Result |
|---|---|---|
| `t123_algebra.py` T1 | d, d~, c for n <= 4096 from the definitions at t = 0, 1/400, 1/50, 1/16, 87/800, 19/125, 1/5 (40 digits) | all >= 0; increments between successive t all >= 0; (60) holds to 1e-38; heat ODE to 2e-21 by finite difference; d_0 = Lambda |
| T2 | (61), (62) on three small models, every label enumerated | R* equals the sum of nonnegative pieces to 1e-40; max of abs(V - Q T_K)/R* over 200 random phases: 0.18, 0.35, 0.28 |
| T3 | Lemma A.1 against quadrature; A.2, A.3; (63); refund scaling | relative error 1e-28; (115) true on all 40 parameter pairs; one sign change of A', D' for a > 0, none for a = 0; A'(0) = 2, D'(0) = V+; no violation |
| `t5_model.py` | actual model (51) for rows 0, 9, 30, 46, 66; t = t-, t+; six centres (x = X and s up to 1.6, N up to 3.4e6); 2 phase draws; 7 native heights; 2 translations; float64 | 0 violations in every inequality. Worst ratios: activation amplitude / C A(u) 0.99936; half-frequency / C D(u) 0.99935; g / abs Q 0.9997; abs(V - Q T_K) / (R* + b + a D+) 0.67; abs(f'/f - head) / E_an 0.65; signed functional of the remainder / envelope bound 0.20 |
| `t6_zcheck.py`, `t6b` | A, B, D, Z, P, P_1 term by term (no bins) in Arb at 200 bits for 5 (row, height) pairs | every stored bound on the safe side; stored A, B within 3e-11 to 2e-4 of the exact value |
| `t7_refund.py` | exact Fractions for all 67 rows: caps (124), near/far inequalities, kappa from (55), guard (52), refund (126), refunded debit on both branches | 0 failures; refund and debit identities exact for 67 rows; kappa in [0.0010, 0.0603]; min gap g - r_0 = 0.7456; min slack of the refunded affine bound 5.8e-9; final-plan nodes equal the nodes used by `spectral` (67 rows) and by `affine` (39 retained rows) |
| `t8_shared.py` | shared-row debit from (124) and the hybrid envelope | exact equality with the parent source for all 28 rows |
| `t9_edge.py` | activation at the exact threshold where N_0 + m first becomes active (m = 1, 2, 3, 10, 100) and at s = 3 (N = 1.39e7) | worst ratio 0.99936 |
| `t10_env.py` | envelope (72), 2.4e6 sample points per row, 67 rows | max abs(F_i)/envelope = 0.99833 (row 40) |

The float64 "wrong side" readings of 3e-10 for Z in `t5_model.py` are rounding in that script; the Arb
recomputation of the same entries shows the stored values are below the exact ones.

## 4. Corrections (expository; no number changes)

1. Lemma 3.3, proof for d~: "the same induction applies" omits that d~ differs from d only at powers of 2, 3, 5 and
   that the equation there is d_t d~ = (j^2 log^2 p/4) d~ + nonnegative forcing with d~_0 = 0. The claim is correct.
2. (108) does not list the change of the first-branch frequency factor (v_0 + w)/2 between an integer and the
   adjacent real point (relative size 1/(N_0 v_0), about 1e-7). It is covered by the replacement of v_0 by V+
   (V+ - v_0 = 1.22e-4 > 1/N_0 = 1.45e-6), but the text and the checker do not state or test that inequality.
3. (108) and (109) charge (t+ v_0/2 + h) delta twice. Harmless (total 4e-6 against the reserve 2e-4).
4. Sec 3.4: the convexity series are in u = s + delta, not s. Same conclusion.
5. Sec 3.4 and App A: "sup A = 2" at t- = 0, h = 2 is a limit as s tends to infinity. The stored bound equals 2C
   exactly and is valid because A(s) < 2 for every finite s.
6. The sum-to-integral step for the reflected branch should say that the summand need not be monotone in n for
   large s; the stated correction (h-1)/(2N_0) + t+ delta/(2N_0) is still sufficient because the summand is
   quasi-convex in log n.

## 5. Not checked

- Prop 3.2: that abs(G - f_x) <= e_0 and abs(d_h(G - f_x)) <= e_1, and the refined E_0, E_1 of (55). Here they
  are inputs. If they fail, r_0, r_1, kappa and every physical cap fail with them.
- That H_t/B_t, the main term M L/4 and the coordinate allowance are as stated, apart from (125).
- Arithmetic credits, finite-head chord beyond the absolute bound (73), joint-derivative rows, Theorem B.1 assembly.
- The `interfaces`, `overlays`, `direct-source` stages. Node and table identity was checked only as far as
  `t7_refund.py` and `t8_shared.py` go.
- The direct model test covers 5 of 67 rows, s <= 1.6, and synthetic phases (tau in [0, 3000], random unit Gamma)
  instead of the physical tau near 3e12. The inequalities of this part do not depend on the phases, so this is a
  test of the algebra, not of the physical orbit. It is float64 and is evidence, not proof.
- Term-by-term Arb recomputation of the native primitives was done for 5 of 469 heights; the other 464 rest on
  the replayed `native` stage.
- Correctness of FLINT/Arb, and the pinned runtime (python-flint 0.8.0 on Linux) was not used.
- Nothing was run on the compute server.

## 6. Files

- Report: `tmp/research-2026-11-16/push/verify-0107965/referee-R5.md`
- Own scripts: `tmp/research-2026-11-16/push/verify-0107965/scripts/R5/` (`t123_algebra.py`, `t5_model.py`,
  `t6_zcheck.py`, `t6b_zcheck.py`, `t7_refund.py`, `t8_shared.py`, `t9_edge.py`, `t10_env.py`)
- Logs: `tmp/research-2026-11-16/push/verify-0107965/runs/R5_t123.log`, `R5_t5_row0.log`, `R5_t5_rows.log`,
  `R5_t6.log`, `R5_t6b.log`, `R5_t7.log`, `R5_t8.log`, `R5_t9.log`, `R5_t10.log`
- Stage replay: `tmp/research-2026-11-16/push/verify-0107965/runs/R5-work/` (logs in `logs/`, receipts in
  `verification/`)
