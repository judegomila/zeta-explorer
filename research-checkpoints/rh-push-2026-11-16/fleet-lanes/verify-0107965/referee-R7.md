# Referee report R7: jet rows 0, 16, 44 and the source assembly (Thm B.1)

Object: hexagon:2611.00460v1 (Raymond), sec 3.7, 3.9, App B, App C.5; Thm 3.1 (assembly part), Thm B.1,
eqs (77)-(81), (116)-(127). Packet scripts audited: `verification/source_overlays/verify_source_overlays_independent.py`
(416 lines) and `verification/direct_source/verify_direct_source.py` (554 lines), both read in full before running.

**Verdict: verified-with-corrections**, for the part assigned, and conditional on the inputs listed in section 5
(Prop 3.2, the positive-measure representation (71), the native/activation/head/clock primitives, the kernel side).
No error and no gap was found in the jet argument or in the assembly identity. The corrections are documentary
and checker-hardening items (section 4); none changes a number.

All runs were local, through `scripts/memcap.sh 8`, Python 3.15.2 `-I`, python-flint 0.9.0 / mpmath 1.4.1 from a
sibling venv (not the packet's pinned Linux runtime). Own scripts are in `scripts/r7/`, logs in `runs/`.

## 1. What was re-derived by hand

Notation: S_t(x,h) = d/dh log|H_t(x+ih)| = Re d/dzeta log H_t(x+i zeta) at zeta = h; G = H_t/B_t; f_x the frozen
common model; T_b S = (1/p) sum_m b_m p^m/m! d_p^m S.

1. **Derivative identity.** Along real zeta, d_p^m S = Re (d/dzeta)^(m+1) log H_t(x+i zeta). So T_b acts on one
   holomorphic function, and log H = log B + log f_x + log(1+W), W = (G-f_x)/f_x. Correct.
2. **One-logarithm Cauchy bound (78).** If |W| <= delta < 1 on the closed disk |zeta-p| <= r then
   |log(1+W)| <= -log(1-delta) <= delta/(1-delta) = eta, and |l^(m+1)(p)| <= (m+1)! eta / r^(m+1). Term m of T_b is then
   at most |b_m| p^m (m+1) eta / (p r^(m+1)); the sum is exactly the right side of (78). The bound is termwise sharp
   (l = eta ((zeta-p)/r)^(m+1)), so there is no hidden slack being assumed. The Parseval variant mentioned in the
   text is also valid (sum |a_k r^k|^2 <= eta^2) but is not used by any of the three final certificates.
3. **delta (79).** r_1 = P e_1 + P_1 e_0/2 >= 100 P e_0 and g - r_0 < g give E_ph >= 100 e_0 P/g, hence
   E_0 P/g <= min(1, E_0/e_0) E_ph/100 (the case E_0 > e_0 uses the baseline e_0, which Prop 3.2 also asserts).
   The checker uses the **global** cap E_ph (valid for every activation state, i.e. all x >= X), not the anchor cap.
   This was the main thing to look for (an anchor bound used for all x); it is not present.
4. **Lower bound |f_x| >= g/P on the whole disk.** g and P are evaluated at the floor height h_0. All label
   frequencies are >= 0 (reflected labels have frequency L - log n + log d >= L/2), so every amplitude and the Euler
   norm are nonincreasing in Re zeta and independent of Im zeta. So the bound at h_0 holds on Re zeta >= h_0, which
   contains the disk because p - r >= h_0 (checked; equality for row 16, where the closed bound applies).
5. **Domain of Prop 3.2 on the disk.** zeta = h - iv, so the disk needs |v| <= r <= 39/20 and h in [p-r, p+r] within
   [1/100, 6]. Rows: 0: p = 61/20, r = 1, heights [2.05, 4.05]; 16: p = 61/20, r = 1/2, [2.55, 3.55];
   44: p = 4, r = 39/20, [2.05, 5.95], |v| <= 39/20 (closed hypothesis, equality allowed). E_0(h, t_-) is decreasing
   in h, so its value at h_0 bounds the disk. Thermal guard holds (row 0: 1.495 > 1.25 at t_- = 0).
6. **Analytic remainder (80).** Applying T_b to exp(-zeta lambda/2) at zeta = p gives
   (1/p) P_b(-p lambda/2) exp(-p lambda/2) = (1/p) [P_b(-p lambda/2) e^(-a lambda)] e^(-h lambda/2), a = (p-h)/2.
   With the remainder dominated by the positive measure mu supported on lambda >= log 4097 and
   int e^(-h lambda/2) dmu <= E_an(h), the charge is (E_an(h)/p) sup_{lambda >= log 4097} |P_b(-p lambda/2)| e^(-a lambda).
   Correct, given (71). Support claim re-derived: residual coefficients have a divisor k > 4096, exterior labels
   exceed N_0, reflected frequencies are >= log N_0, omitted Euler powers exceed 4096.
7. **Supremum on the half-line.** g(lambda) = |P(lambda)| e^(-a lambda) is continuous, tends to 0 at infinity, so its
   supremum on [left, inf) is attained at `left` or at a zero of P' - aP (or where P = 0, value 0). This is not a
   supremum-at-infinity case. Rows 0 and 16 use the weaker monomial bound: sup of lambda^m e^(-a lambda) on the
   half-line is at max(log 4097, m/a); correct.
8. **Head (81).** -(1/2) d/ds log sum b_t(n) n^(-s) gives (1/2) sum d_t(n) n^(-s); m zeta-derivatives multiply the
   n-th term by (-log n/2)^m; T_b gives (1/(2p)) d_t(n) n^(-1/2 - tL/4 - p/2) P_b(-p log n/2) times a unimodular phase.
   With d_t <= d_(t+), L/4 >= c_0 and convexity of t -> n^(-t c_0), the two endpoint sums bound the cell as a chord.
   The full d_t (not the deflated d~_t) is the right coefficient because -E'/E restores the powers of 2, 3, 5.
9. **Main and normaliser.** d/dzeta log B_t(x+i zeta) = alpha(s)/2 + t alpha alpha'/4 with s = (1+zeta)/2 - ix/2;
   leading value L/4 - i pi/8, constant in zeta, so only m = 0 contributes: b_0 c/p >= b_0 c_0/p needs b_0 >= 0 and
   L >= L_0. The deviation d(zeta) with |d| < 1e-10 on the disk gives by Cauchy (1e-10/p) sum |b_m| (p/r)^m. The
   estimate (117) was re-derived line by line: 3/x' + 4/(x'-8) < 10/x', |alpha'| < 2/x', total
   (5 + t(L'/2+1)/2)/x' + |L'-L|/4 <= 6.5982/(X-2) = 1.0997e-12 < 2e-12 for t <= 19/125, L' < 26.90.
10. **Assembly (119)-(122).** J_i = alpha_i L^sc S + 2 T_b S, alpha_i >= 0; multiplying the scalar bound by alpha_i and
    the jet bound by 2 and adding gives the four fields. Refund scaling (C.4): g - kappa r_0 >= g - r_0 gives
    P(kappa r_0, kappa r_1) <= kappa P(r_0, r_1); the anchor refund is valid on the far branch because the global
    physical cap dominates the anchor cap (the checker asserts A_act >= anchor value at each height).
11. **Near/far clock step in the overlays script** (script audit only): tau = 2 pi N_0^2 (1+v+q) with v = e^(4 Delta) - 1,
    q = t/(16 N_0^2); relation phase = pi a (1+v+q), affine in (v,q); log(1+v) concave, so four corners suffice;
    near region v <= e^omega - 1 <= omega/(1-omega); far region paid by A_rem Delta >= d. Directed rounding of the
    relation logs is on the correct side for each sign. The Lagrangian step itself belongs to R6.

## 2. What was executed

| Run | Result |
|---|---|
| Packet stage `overlays` via `replay/launch.py` (`runs/r7-work/overlays.log`) | exit 0, PASS, 6.5 s. Check counts 5267 / 4175 / 4108 / 4173 / 4257 / 32403 / 268, identical to the author's stored result; 67 x 4 operational fields and the jet reports identical to the stored evidence. |
| Packet stage `direct-source` (`runs/r7-work/direct.log`) | exit 0, PASS, 67 rows, 268 fields; counts and fields identical to the stored evidence; fields equal `MAIN_CLOCK_SOURCE.json` (sha b59905d7...), plan sha ec346b7c.... |
| `scripts/r7/jet_recheck.py` (own code, exact Fractions + mpmath 60 digits; `runs/r7_jet_recheck.log`) | For rows 0, 16, 44, from the raw native and activation tables: global caps rebuilt; e_0 P/g <= E_ph/100 exact; jet `native_debit` equal to the stored rational exactly (all three); heads recomputed with an independent Dirichlet-convolution recurrence, stored upper bounds exceed them by 5e-40 to 3e-39; main b_0 c_0/p >= stored; envelope sup recomputed from polynomial roots and from 60,000-point sampling; final fields == alpha (refined scalar - clock gain) + 2 jet exactly. |
| `scripts/r7/cauchy_normaliser_test.py` (`runs/r7_cauchy_normaliser.log`) | (78) tested on 400 random W per row (Blaschke, monomial, exponential): max LHS/RHS 0.49 / 0.57 / 0.36. Normaliser deviation on the three disks, x in {X, X+12345, 1e14}, t in {0, 19/125}: max 6.2e-13 (< 2e-12 claimed, 1e-10 charged). Closed form of d/dzeta log B_t agrees with a numerical derivative to 4e-47. X - 4 - 4 pi N_0^2 = 5,377,388.9 > 0. |
| `scripts/r7/row0_t0_test.py` (`runs/r7_row0_t0_small.log`) | Row 0 contains t = 0, where H_0 = xi/8. J_0(0,x) computed from the prime sum (148,933 primes, 160-bit phase reduction) at six x in [X, 3e14]: J - floor = 0.176, 0.132, 0.800, 0.780, 1.259, 2.050 (floor 7.640056). Jet alone: T_b S - b_0 L/(4p) - head(n <= 4096, actual phases) = remainder of size 2e-10 to 1e-9, certified debit 4.64e-6; \|head\| up to 2.16e-5, certified 2.376e-5. This confirms the factor conventions (1/p, p^m/m!, 1/(2p), factor 2, alpha) on the real function. |
| `scripts/r7/row0_t0_scan.py` (`runs/r7_row0_t0_scan.log`) | 60,000 points x in [X, X+780], step 0.013 (float64, prime powers <= 1e6): minimum J - floor = 0.1307 at x = X + 0.43. No violation. |

Row-44 Sturm step, checked independently: the critical polynomial (degree 8) has 4 real roots,
0.01373, 4.46661, 8.73039, 14.85353; exactly 2 lie above `left` = 8.318010277 (stored count 2); each stored box
contains exactly one; the polynomial is nonzero at `left`, at the Cauchy bound and at all box endpoints; all 8 complex
roots are distinct (minimum separation 0.35), so the Sturm count is not affected by multiplicity. The stored envelope
weight 0.0348421622838788 equals the recomputed supremum to all printed digits and is not below it at 60 digits.
For rows 0 and 16 the monomial envelope is 9.7 and 6.3 times the true supremum (safe direction).

Sizes: the three jets are small terms. 2 x jet floor is 6.5e-4 (row 0), 4.2e-4 (row 16), -1.45e-3 (row 44, b_0 = 0)
against scalar floors 7.64, 10.17, 14.30; alpha_i - 1 is 2.1e-6, 4.3e-5, 6.1e-4.

## 3. Does any stored bound enter the 268 fields untested?

Read of both scripts, stored quantity by stored quantity:

- Jet: p, b, alpha are taken from the proposal and bound to the final plan and to the certificate by `direct-source`;
  E_an, E_ph are rebuilt from raw primitives in both scripts; analytic/physical/normaliser debits are recomputed and
  compared by equality; envelope weight, both heads, main, `new_E0_upper` are stored upper bounds that `overlays`
  recomputes in 512-bit Arb and compares in the safe direction. No PASS flag is read.
- Scalar part: `direct-source` recomputes main <= mass c_0 (exact atanh series), native caps, refunds, shared-row
  fixed credit and coordinate margin; it takes as stored inputs the raw retained heads, composite credit, old angular
  credit, spectral duals, beta, orbit distances, clock gains. Each of these files is also opened by a stage that
  recomputes it (heads39, heads28, spectral, affine, overlays; confirmed by grep of file names, and for heads39 by
  reading the comparison lines). The old angular credit needs no separate proof: `overlays` proves the total
  replacement payment d = d^(0) + gamma at four corners for all 2^m sign branches.
- Consequence already stated by the paper: `direct-source` proves identities, not inequalities. A run of
  `direct-source` and `overlays` alone (what was done here) does not establish the scalar primitives.

## 4. Corrections and remarks (none changes a number)

1. Sec 3.7 gives gate counts 4128 / 8363 / 4215. The packet consumer reports 4175 / 8281 (4108 + 4173) / 4257, in
   the author's stored result and in this replay. The text counts do not describe the shipped consumer.
2. `overlays` does not compare the jet (alpha, p, b) with the final plan, and iterates the row-44 value list with
   `zip` without a length check. Both are covered only by `direct-source`. The two stages must be run together; the
   overlays stage alone does not prove the row-44 envelope is complete.
3. The Sturm routine skips zero values and does not test that the polynomial is nonzero at the evaluation points or
   squarefree. Both hold for the actual data (section 2), but the checker should assert them.
4. Row 0: analytic height 2 and radius 1 are constants in both scripts, not read from the certificate. They agree
   with the certificate fields (`monomial_envelope_height` 2, `physical_circle_radius` 1).
5. (80) is written with one h_0 for both the analytic height and the circle floor; the code allows them to differ.
   They coincide in all three rows (2, 51/20, 51/25).
6. The normaliser is charged 1e-10 per unit while (117) proves 2e-12; safe, a factor 50 unused.
7. Thm B.1 holds as an implication: "if the primitive inequalities and Prop 3.2 hold, the four fields are a valid
   chord". Its Step 6 is a data identity and was reproduced.

## 5. Not checked

- Prop 3.2 (physical approximation at heights up to 6, baseline e_0, e_1; R4) and the measure domination (71), the
  residual identity and activation bounds behind E_an, E_ph, g, P (R5). The jet argument uses them as hypotheses.
- Arithmetic credits and the Lagrangian/phase step behind the clock payments (R6); only the script logic was read.
- The kernel side of the jet rows (own-pair and continuous kernel for alpha L^old + 2 T_b; R8). The factor 2 and the
  flag `effective_old_kernel_units` were confirmed only on the source side.
- The other 13 stages were not run here, so the scalar primitives feeding rows 0-66 are not established by this report.
- Interval rigour: own recomputations use 60-digit mpmath and float64 sums, not outward rounding. The row-0 test at
  t = 0 is a numerical test at sampled x and only for t = 0; rows 16 and 44 (t > 0) have no such end-to-end test.
- The review-stage ledger `physical_debit/verify_physical_debit_map.py` (App C.5 machine-readable map) was not run.
- Packet prose notes (`COMMON_MODEL_JOINT_JET_SOURCE_THEOREM_V1.txt`, `REFINED_LOG_PROOF_CLARIFICATION_V1.txt`) were
  not compared with the paper text.

## 6. Failure-mode checklist

| Failure mode | Finding |
|---|---|
| Bound on an open range used at an endpoint | p - r = h_0 (row 16) and r = 39/20 (row 44) are equalities; the hypotheses are closed there. `left` is rounded below log 4097. X - 4 > 4 pi N_0^2 strictly. None found. |
| Supremum at infinity treated as attained | Envelope tends to 0; all critical points counted. Row 0 uses the t_- = 0, h = 2 activation constant, a limiting supremum used only as an upper bound. None found. |
| Multiple or colliding roots | Critical polynomial squarefree, boxes disjoint, one root each (checked independently). |
| Limit/maximum interchange | Not used in this part. |
| Remainder valid only for large argument | Normaliser bound is explicit for x' >= X - 2 and was confirmed numerically. |
| Anchor bound used for all x | Jets use global caps; the retained scalar refund uses the anchor cap, with the stated domination argument. |
| Earlier preprint used for an unproved step | Not in sec 3.7 / App B / C.5 themselves; they rest on Prop 3.2 and (71), whose own dependence is for R4/R5. |
| Inequality used in the wrong direction | Checked for each stored bound: heads and envelope upper, main lower, E_0 upper, relation logs sided by sign. None found. |
