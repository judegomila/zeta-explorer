# REFEREE (independent, adversarial; lens: general)

Lane `c15-klein-transport-lemma-w-stage-a-and-e1`. Date 2026-11-19. Claimed verdict: precise-obstruction.
This file replaces the author's second pass as the referee record; the author's text is kept verbatim in the
appendix. Referee runs: local, through `scripts/memcap.sh 8`, mpmath, each under 100 MB; scripts in
`/tmp/c15ref/` (not in the lane). Server not used. No data module imported; PR 56 source read as text
(`git show refs/pr/56:rigorous/klein-annulus-coupling-2026-11-14/klein_phase_transport.md`).

## Verdict

**Holds, with six corrections (E1 to E6), none of which changes the verdict.** No statement about zeros of zeta
is made; nothing assumes RH in a step that the conclusion depends on (one wording slip, E1); verified height is
not restated (W1 removes it from the node); E1' is correctly labelled as the proof of an on-file statement.
Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

## 1. Steps re-derived

| step | label in RESULT | referee |
|---|---|---|
| W1: W(A,C,T0) implies d_rho <= 1/(2A) | PROVED | Confirmed. The node (`lemma-w-wide-support`) states W for all T >= T0, so a fixed zero is a term for every large T and 2A d <= 1 + log(C log T)/log T -> 1. kappa = 0.20 reproduces C = 10.9 at T = 3e12. |
| Lambda <= 1/(2A^2), A > 1.5811 for 0.2 | CLASSICAL | Confirmed: de Bruijn half-width Delta = 2 delta, Lambda <= Delta^2/2 = 2 delta^2; sqrt(2.5) = 1.5811; with kappa = 0.2 the node's threshold is 1.897. |
| W2: strictness and partial summation | PROVED | Confirmed. Sum = N(T) + int_0^{1/(2A)} 2A' log T T^(2A'u) #{d > u} du with #{d > u} <= 2 N(1/2+u, T); bound 2 C A' T log T/(A - A') reproduces. Multiset-level only, as the author's own pass says. |
| W3: stability under finitely many added points | PROVED | Confirmed (each added point contributes at most T). Lemma F exists as cited (c14 RESULT section 2.1). |
| Controls E_a0, T-NR against W | PROVED | Conclusion confirmed; E_a0 wording needs repair (E1). T-NR: zeros at Re = +-arccosh(c/2)/log q, ordinates pi(2k+1)/log q, count T log q/pi; b = 0.3238 for q = 2, c = 2.0506; c is inside (2, 2^(1/2) + 2^(-1/2)). Ratio 0.47 at T = 1e3 recomputed by hand. |
| Controls DH, backward heat against W | quoted | Not re-derived. DH: classical (Davenport-Heilbronn, Voronin). Heat: map row F1 exists and is marked PROVED (internal). Accepted as quoted, not as proved here. |
| K0 identity | MEASURED | Confirmed on new cases (section 2). It is the source's own identity (E3) and needs the reflection symmetry (E2). |
| Certificate inequality (source section 6) | quoted | Re-derived from K0: 2 mu r <= Delta <= pi/2 on r <= R, sin y >= 2y/pi; sin >= -1 beyond. Correct. |
| K1, a > 1/2 | PROVED (asymptotic) | Confirmed. Small-r kernel: 1 - q^2 ~ 2 pi r/a gives kappa as stated; core <= (2M/(pi a)) sup(AA) kappa R^3/3 <= sup(AA) kappa R^2/(6a) using M <= pi/(4R); M >= theta_a'(t) >= (1/2) log(t/2 pi) + zeta'/zeta(1/2 + a) - O(1/t); amplitude ratio between zeta(2 sigma)^2/zeta(sigma)^4 and its reciprocal, sigma = 1/2 + a; gamma factors: second t-derivative of Re log Gamma(s/2) is O(1/t^2). Tail bounded below by a constant times A_a(t)^2. core/tail = O(1/log^2 t). |
| K1, strip case (delta < a <= 1/2) | PROVED in section 3, "argued" in the claim | Confirmed as a conditional asymptotic argument: window count N(T+H) - N(T) >> log T for H >= H0 (not for every fixed length; H0 fixed suffices), sum 1/abs(s - rho)^2 <= theta_a'/(a - delta) <= C log t, r1 = c'/sqrt(log t) > R for large t, tail >= c''/log t, core <= C''/log^2 t. The hypothesis (all d_rho <= delta < a <= 1/2) is unproved, so this half is conditional (E5). |
| E1' (i) to (v) | PROVED | Confirmed. Pole order is direct. Reflection symmetry of the zero and pole multisets of f_gamma survives cancellation (the common part C of Z and P = -Z satisfies -C = C). Factors with p_j = 0 equal 1; p_j < 0 give modulus < 1 on Re v > 0. Evenness forces the linear exponential term to vanish, so the pair product is the Hadamard product. (v) uses finitely many zeros per horizontal segment (strip assumption, present). Statement matches nodes `wiener-hopf-phase-condition` and `thin-hankel-schur-equivalence`. |
| Second reader draw | reported | `random.seed(1519); random.sample(pop, 15)` on the 70 silent rows of SWEEP_TABLE.md plus node 30 reproduces the same 15 indices. The 15 typings were not re-read by the referee. |

## 2. Numeric reruns (different cases)

Identity K0 (`/tmp/c15ref/ref.py`, 25 digits):

| F | a | h | t | lhs | rhs | rel |
|---|---|---|---|---|---|---|
| xi | 0.8 | 0.2 | 25.3 | 1.15524011147204e-12 | same | 2e-16 |
| xi | 0.45 | 0.4 | 33.0 | 1.72281549016285e-17 | same | 2e-16 |
| xi(s+0.2) xi(s-0.2) | 0.5 | 0.1 | 14.1347 | -2.2037840597036e-13 | same | 9e-17 |
| xi(s+0.2) xi(s-0.2) | 0.5 | 0.3 | 14.1347 | 3.73302474404468e-13 | same | 9e-16 |
| (s - 0.8 - 2i)(s - 0.2 - 2i) (reflection-symmetric, not real) | 1.0 | 0.4 | 0.5 | 4.64 | 4.64 | 3e-17 |
| (s - 0.2 - i)(s - 0.9 + 0.3i) (no reflection symmetry) | 1.0 | 0.4 | 0.5 | 0.868 | 1.12 | 0.225 |

The E_a0 rows are a control run: outer line a = 0.5 > a0 = 0.2; the value is negative at h = 0.1 (below the
zero at depth 0.2) and positive at h = 0.3. This agrees with the lane's statement that the certificate cannot
cross a zero and that the conclusion is false below it.

Certificate scan (`/tmp/c15ref/cert.py`; separate implementation, step 0.005, trapezoid, every R on the grid):

| a | h | t | referee core/tail (R, mu, M) | lane |
|---|---|---|---|---|
| 0.6 | 0.3 | 100 | 4.876 (0.62, 0.826, 1.253) | 4.876 fires |
| 1.0 | 0.5 | 400 | 0.505 (0.40, 1.825, 1.949) | 0.505 |
| 0.3 | 0.15 | 1000 | 0.600 (0.195, 1.81, 3.99) | 0.482 at R = 0.18 (even grid points only) |
| 0.3 | 0.15 | 30000 | 0.714 (0.155, 3.28, 5.01) | not run |
| 0.4 | 0.2 | 5000 | 0.548 | not run |
| 0.75 | 0.25 | 2500 | 0.184 | not run |

No new firing. The lane's scan under-reports the best ratio where the optimum falls on an odd grid index (0.48
against 0.60); the sign is the same. For a = 0.3 the ratio is not decreasing between t = 1e4 (0.41, lane) and
t = 3e4 (0.71, referee): the measured data give no support for the decay in the strip case; K1 there rests on
the argument alone (E5).

E1' (`/tmp/c15ref/e1.py`, seed 424242, different design: three ordinates including 0 (real zeros and a zero at
the origin), real parts on a 0.025 grid up to 0.6, multiplicities from 1 upward (sums of draws from 1 to 3), a from 0.025 to 0.3 so that ties
Re lambda = a occur; pole test by exact multiset cancellation, confirmed by scaling at 1e-10 and 1e-20): 600 of
600 agree, 10 predicted Schur, no case with sampled supremum above 1 without a pole, every surviving pole
confirmed.

## 3. Errors and narrowings

- **E1 (RH used in wording; repairable in one line).** "E_a0: all 2N(T) zeros at distance a0" is true only if
  the zeros of zeta are on the line. Unconditional form: a zeta zero at signed offset e gives zeros of E_a0 at
  offsets e + a0 and e - a0, and T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(A(abs(e+a0)+abs(e-a0))) >=
  2 T^(2A a0). The bound sum >= 2N(T) T^(2A a0) and the failure for every A > 0 stand.
- **E2 (false sentence).** Section 4: "the section-6 inequality uses no property of F beyond analyticity and a
  non-vanishing trace" and the DH row "theorem for any analytic F". The identity behind the inequality (K0)
  needs the reflection symmetry F(1 - conj s) = conj F(s) (the source derives it from "the critical reflection",
  section 5) and a growth condition; for a quadratic without the symmetry lhs = 0.868, rhs = 1.12 (section 2).
  Consequence for the table: none; DH, E_a0, T-NR and the heat family all have the symmetry. The correct
  sentence is "uses only the functional-equation symmetry, order one and a non-vanishing trace; no Euler
  product". The R3 reading is unchanged.
- **E3 (not new).** K0 is listed in section 1 as new against the record. The source defines
  W(1/2 + a + it) = abs(U_a)^2 theta_a' = Re(F' conj F) (line 189) and states W_h/h = int omega C dr as an
  identity (section 5). K0 is the source's statement; the lane's contribution is the numerical check for xi.
- **E4 (scope of K1).** K1 concerns the section-6 lower bound (sin >= 2y/pi on the core, sin >= -1 on the
  tail), not the identity and not the sharpened form the source mentions (integrating the actual positive phase
  windows). "The Klein certificate is negative at height" should read "the section-6 bound is negative at
  height". The sharpened form is not treated; no claim about it survives from this lane.
- **E5 (label).** K1 for a <= 1/2 is conditional on an unproved strip hypothesis and has unspecified constants.
  Section 3 labels the whole of K1 "PROVED"; the summary claim says "argued". The second is the correct label:
  PROVED for a > 1/2; conditional and asymptotic for 1/(2A) < a <= 1/2, with no measured support (section 2).
  For a > 1/2 and h > 1/2 the conclusion Re xi'/xi > 0 is classical, so the failure there is slack in the
  bound, not information.
- **E6 (traceability).** "Node 157, 142, 386, 358" are row numbers of the c14 SWEEP_TABLE.md, not graph indices
  (IDEA_GRAPH positions 539, 479, 1601, 1509). Cite the node ids.

Not errors, recorded: the reach statement "a - h <= about 1.1/M" is a constant-amplitude model (the author says
so); the density exponents of Selberg (1/4), Jutila (< 1), Conrey (< 8/7) agree with the referee's recollection
and were not re-read; the incident of section 9 (a relative-path write that replaced an untracked `checks.json`
in the repository root) is an out-of-lane write, disclosed; no file of that name is in the root now.

## 4. Walls

RH assumed: only in the wording of E1, removed by the repair. Verified height: not used (W1 shows the node does
not need it). Known theorem presented as new: E1' no (labelled); W1 is a one-line observation; K0 yes (E3).
Controls: no zeta-only mechanism is claimed, so there is no mechanism to run controls against; the two E_a0
rows of section 2 were run as a check of the "does not cross a zero" statement.

## 5. Requirement flags (referee)

- R1 false. No step uses multiplicativity; W1 to W3 are multiset statements; K1 uses a size bound on
  zeta'/zeta and the zero count.
- R2 false. The only every-window statement is an inequality whose right side is negative at height.
- R3 false. Four controls fail only because the hypothesis W is false on their zero sets; BLS passes.
- R4 false. Nothing passes to the critical line.

## 6. Surviving claim

Lemma W(A) (for all T >= T0) implies the strip abs(beta - 1/2) <= 1/(2A) with kappa = 0 and no verified
height, is strictly stronger than that strip at multiset level, and is violated by E_a0 and T-NR for every
A > 0 on their zero sets; it is a target-level hypothesis. The section-6 Klein lower bound, for fixed
0 < h < a with a > 1/2, has a negative right side for t >= t0(a, h) (proved, asymptotic); for a <= 1/2 the same
holds conditionally on a strip of half-width below a. Theorem E1' is proved and coincides with the on-file
node statements. The pair adds nothing to its parts and stops at stage A.

---

## Appendix: the author's second pass (verbatim, not independent)

# REFEREE (second pass by the lane author; not independent)

Lane `c15-klein-transport-lemma-w-stage-a-and-e1`, 2026-11-19. The assignment asks for one referee. This
session has no means to start an independent reader, so this file is the author's second pass with separate
checks (`second_pass.py`, different seed and instances). Under METRIC.md the lane is unrefereed
(`refereeHolds: null`). An independent referee is owed.

## 1. Steps re-derived

- W1: one line; holds. The only input is that a fixed zero is a term of the sum for every T >= gamma.
- W2: counter-multiset and partial summation re-done; the constant 2 C A'/(A - A') reproduces. The multiset
  statement is not a statement about zeta: whether W(A) for zeta is stronger than the strip for zeta is OPEN
  (both are open; RH implies both).
- W3: holds; conditional on W(A) for the base multiset.
- K0: confirmed numerically at 6 instances; the general identity is quoted from the source (its "existing
  even/odd energy identity") and identified with Re(F' conj F)/h through the polynomial control and the checks.
  Not re-proved here.
- K1, a > 1/2: steps (i) to (iv) re-read; holds as an asymptotic statement. Step (ii) needs R small against
  a - h, which holds for t large at fixed h.
- K1, strip case: holds with unspecified constants; the weakest part of the lane (RESULT section 8, item 1).
- E1': proof re-read. Two repairs made during this pass: the setting now assumes zeros in a vertical strip (so
  each ordinate carries finitely many zeros); the remark on T-NR at a = b was wrong (it is case (iii), not
  (iv)) and is corrected. Random test: first version of the pole detector reported 397 of 400; the 3 failures
  were detector misses (poles with residue of order 1e-7), verified by hand on one instance; with the scaling
  detector 400 of 400.

## 2. Statements narrowed in this pass

1. "The certificate fires only for a - h <= about 1.1/M" is a constant-amplitude model statement. The scan
   shows firing at M (a - h) up to 0.75 at (a, h, t) = (0.6, 0.3, 100) and 0.2 at (1, 0.95, 1e4), inside the
   model bound; at (0.3, 0.15, 100) M (a - h) = 0.16. No measured firing violates the model bound, and no proof
   of the bound at actual amplitudes is given.
2. mu and M in `cert_scan.json` are extrema over 0.01-spaced samples, not certified bounds; the table is an
   illustration of K1, not a certificate.
3. "Lemma W fails for backward heat" is quoted from map row F1; "fails for DH" from classical counts.
4. Second reading: not blind (stated in RESULT section 6).

## 3. Checks against the walls

RH assumed: no. Verified height restated: no. Known theorem presented as new: E1' is labelled as the proof of
nodes 386, 358; W1 is elementary and may be on file elsewhere under another name (not searched beyond the node
and its source page). Controls: 5 on paper, none run except the polynomial control in K0.

## 4. Flags

R1 false, R2 false, R3 false, R4 false. Not about zeros. Verdict of this pass: the obstruction holds as
written after the two repairs above; independent referee owed.
