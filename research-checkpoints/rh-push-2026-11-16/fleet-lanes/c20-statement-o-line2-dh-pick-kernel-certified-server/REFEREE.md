# REFEREE.md: second pass on c20-statement-o-line2-dh-pick-kernel-certified-server

Status of this file: a second pass by the same agent that wrote the lane, using different formulas and code
paths where stated. It is **not an independent referee** and should be counted as 0 referees for Theorem C.
For Part 1 and for the order-149 sign the lane is itself the second (third) derivation of a source result;
those two items have independent agreement across lanes.

## 1. Recomputations

| item | first computation | second computation | agreement |
|---|---|---|---|
| Part 1, regions A, B, tail | mean-value form, 256 bits, M = 30, width 1/64 | direct enclosures, 400 bits, M = 50, width 1/100 (`ref_part1.py`) | both 0 uncertified; A 39 / 72 subintervals, B 201 / 555 |
| `L''''(0)` | -1.976200888371769607 (this lane) | -1.97620088837... (`c1-missing-controls`, read from its RESULT) | all printed source digits |
| `L_xi(1)` | 0.04613592806046257536 (`pick2.py`, deflated series) | 0.0461359280604625754 (`r2-pick-euler-entry`, quadrature check) | all printed source digits |
| DH order-149 sign at a = 1 | LDL^T pivot d_149 = -6.2332e-569 (real deflated Hurwitz, recurrence for jets, 12000 bits) | `det` of leading minors 147..151: +, +, -, +, + (complex non-deflated Hurwitz, binomial formula for jets, 16000 bits); minor_149/minor_148 = -6.233e-569 | sign and five digits |
| DH negative pivots to 256 at a = 1 | 149, 150, 218, 219 | predicted from the source's negative Richards parameters r_148, r_150, r_217, r_219 by sign d_k = prod_{j<k} sign r_j | exact; also confirms the source's list is complete to index 229 and adds: no negative r_j for 220 <= j <= 255 |
| DH first failure at a new anchor | a = 1/2: 149 | sources: 149 at a = 1/10, 1, 3 | same order |
| planted quartets | 21 and 101 at a = 1 | source: j* = 20 and 100, i.e. orders 21 and 101 | exact |
| DH zero | interval Newton, box 1e-20 | two referee files cited in line 2 (Newton; argument principle) | same point to 10 digits |
| zeros of B_c, c = 1/2 | proof (Moebius map) | 17 sign changes on the line and argument-principle count 17 on -3 <= Re s <= 4, 0 < t < 60.013 | consistent |
| nested-node runs C3-DH, C4-DH, X3-Q3 | server (`rhrun`) | Mac (`memcap`), same code | identical pivots and balls |
| monotonicity in the number of factors (Theorem C item 6) | proof | first failure 149, 210, 217, 219, 221 for m = 0, 1, 8, 64, 4096 | non-decreasing |

## 2. Proof steps re-read

- Lemma 2 (c). `1/((x-w)(y+w)) + 1/((x+w)(y-w))` is the kernel of the pair {w, -w}; with w = i gamma it is
  `2 Re[1/((x - i gamma)(y + i gamma))] = 2 Re[v(x) conj v(y)]`, v = 1/(x - i gamma). Holds. Hadamard for
  E_q: even, exponential type, E_q(0) = 2, so `E_q = 2 prod (1 + z^2/gamma^2)` with no exponential factor.
  Holds (also directly: `cosh` product).
- Lemma 2 (d). Divided differences of `x -> 1/(x - p)` at x_1..x_i are `(-1)^{i-1}/prod_{l<=i}(x_l - p)`.
  Checked for i = 1, 2 by hand: `[x_1, x_2] 1/(x - p) = -1/((x_1 - p)(x_2 - p))`. The bivariate divided
  difference of `v(x) conj v(y)` factorises. The degree argument holds for real nodes, repeated nodes
  included (the polynomials `prod_{l>i}(x_l - p)` have degrees N - i regardless of coincidences).
- Lemma 3. Convergence for 0 < s <= 1 uses bounded partial sums of a periodic mean-zero sequence. Holds. The
  ball sweep fails to certify four subintervals of width below 1.2e-12 at s = 1 (the deflated series of
  python-flint returns no finite enclosure there); the lemma is proved by hand and does not use the sweep.
- Theorem C item 3. `d = a * beta`, beta supported on 3-smooth integers, so d(7) = a(7) = a(2) = k0,
  d(13) = a(3) = -k0, d(91) = a(1) = 1. Holds for every Q of 3-smooth integers.
- Theorem C item 7. Uses: (i) M_DH continuous on [0, beta]^N, which needs K_DH analytic on a neighbourhood
  of [0, beta]^2 (Lemma 3 and oddness of L at the corner); (ii) lambda_min(M_E) continuous and positive on a
  compact set. Holds as written. The step "M_F and the Pick matrix are congruent for distinct nodes" is
  standard (Newton basis); the continuity at confluent configurations is quoted (Hermite-Genocchi), not
  written out.
- Theorem B. Pick-Nevanlinna on a set with an accumulation point is quoted from the refereed step of
  `r2-pick-euler-entry` 1.2. The interval Newton step uses `f(s) - f(s_0) = (s - s_0) int_0^1 f'(s_0 +
  t(s - s_0)) dt` with the integral in the (convex) rectangular enclosure of f' on the box; valid for
  holomorphic f.

## 3. Objections that stand

E1. Theorem C is restricted to bounded node ranges and to "positive even kernel"; with log-concavity in the
    read class it is not established (RESULT 3.4 (a), (b)). The sentence proposed for line 2 must keep both
    restrictions.
E2. Two registered guesses failed (Addendum 1: m = 64 and m = 4096 at order 256). The family was changed
    after reading those results (Addendum 2). The second family's predictions were registered before its
    runs and held, but the choice of family is post hoc. This affects only the size of the example, not the
    proof.
E3. Precision: the assignment's target of 600 to 1200 digits was replaced by 10000 to 12000 bits (3010 to
    3612 digits) because the pivots reach 1e-1846; registered in `GATE.md` before the runs.
E4. Distinct-node runs use node balls (enclosures of `exp` of rational multiples of logarithms). The result
    holds for every node set inside those balls, which includes the stated nodes.
E5. The assignment's phrase "DH Pick matrices at orders above 148 ... positivity decided" is answered by
    "indefinite" at confluent anchors; the lane does not show DH positive at any order above 148 on any node
    set it ran: on all four DH configurations the first 149 nodes (or jets) are indefinite.
E6. No part of the lane was checked by a different agent. The three server builds share `pick2.py`
    (`L_series`, `ldl`); `ref_check.py` shares only python-flint with it.

## 4. Verdict of this pass

Part 1: holds. Part 2 at confluent anchors: holds, all registered signs matched. Part 3: Theorems A, B, C
hold as stated, with E1; independent referee owed. Nothing in the lane is a statement about zeros of zeta.

---

# Independent referee pass (lens: general), 2026-11-20

Written by a different agent from the lane author. The file above this line is the lane's own second pass and
is left unchanged. Scratch code and logs for this pass: `/tmp/c20ref-general/` (`indep.py`, `small.py`,
`rerun.py`, `R-*.log`); local runs under `scripts/memcap.sh 8` with `.venv-arb` (python-flint 0.9.0,
mpmath 1.3.0). The server was not used.

## Verdict

**Holds as stated (partial-result, control statement, nothing about zeros of zeta).** No PROVED step failed
re-derivation. No numeric claim that was re-run with a different case disagreed. Flags: R1 = R2 = R3 = R4 =
false (agree with the lane). Theorem C now has one independent referee (this pass).

## 1. PROVED steps re-derived by hand

| step | result |
|---|---|
| Part 1, tail radius: `y^k e^{-y/2} <= (2k/e)^k`, `sum_{n>M} n e^{-bn^2} <= e^{-bM^2}/(2b)` (summand decreasing for n >= 1/sqrt(2b) = 1.26), value 2.6e-123 at M = 30, j = 0 | confirmed |
| Part 1, region A to h: `h' = u L'''`, `h(0) = -L'(0) = 0`, `L'''(0) = 0`, `L'''' < 0` gives h < 0 on (0, 0.6] | confirmed |
| Part 1, tail u >= 3: `L = 3u/4 - C e^u + R`; `h = -(u-1)Cx - 3/4 + uR'' - R'`; bounds e1, e2 (the e2 bound is valid, slightly generous); `-2 C e^3 - 3/4 = -25.99`, `-C e^3 = -12.62` | confirmed |
| Evenness of kappa from `theta(1/x) = x^{3/2} theta(x)` | algebra confirmed; inversion checked at x = 0.37 (defect 1e-41 at 40 digits); F_DH(z) = F_DH(-z) checked at z = 0.37 and 0.2 + 3.1i (1e-61) |
| Confluent recurrence `2a P[i][j] + P[i-1][j] + P[i][j-1] = l_i[j=0] + l_j[i=0]`; pivots = minor ratios; negative-pivot count = negative inertia when no pivot vanishes | confirmed |
| Lemma 1 | confirmed |
| Lemma 2 (a), (b), (c) | confirmed (`tanh w = sum 2w/(w^2 + pi^2(k+1/2)^2)`, gamma = pi(2k+1)/log q) |
| Lemma 2 (d): divided differences of 1/(x-p); `c^t M c = 2 sum_gamma |c . v_gamma|^2`; degree argument | confirmed; convergence of the gamma-sum holds (terms O(gamma^-2)) |
| Lemma 2 for B_c: `|Y|^2 - 1 = (1-c^2)(1-|X|^2)/|X+c|^2`; X + c = 0 is impossible at a zero for c < 1; functional equation of `6^{s/2} B_c` | confirmed. One sentence is missing in the lane: the Hadamard form `L_E = sum 2z/(z^2+gamma^2)` for the B_c factor needs E even, of exponential type, E(0) = 2 + 2c > 0, hence genus 0 in z^2; this holds |
| Lemma 3 (blocks of five) | confirmed; gives f_DH > 0 for s > 0, i.e. F_DH > 0 for z > -1/2 |
| Analyticity of K_DH near [0, beta]^2 and continuity of M_DH(x) | confirmed. On U x U with U a thin neighbourhood of [0, beta], x + y = 0 forces x, y near 0, where `(L(x) - L(-y))/(x - (-y))` is analytic; continuity of the divided-difference matrix then follows from the double Cauchy integral, so the quoted Hermite-Genocchi step is sound |
| Theorem B (Pick-Nevanlinna on an interval + identity theorem; orders are nested so the passing set is finite) | confirmed as CLASSICAL |
| Theorem C items 1 to 6 | confirmed; `d(91) - d(7)d(13) = 1 + k0^2 = 1.0807009031...`; kernel shift is log q in the lane's normalisation (`F(z) = int kappa(u) e^{zu/2} du`) |
| Theorem C item 7 (compactness, `M >= (m mu - A) I`) | confirmed. It is an existence statement; mu is very small (see 2, item L2d) |
| Theorem A | confirmed; it is a one-line consequence of Lemma 1 and conditional on what holds for zeta |

## 2. Numeric checks run in this pass (different cases from the lane)

| check | case (not in the lane) | outcome |
|---|---|---|
| DH confluent LDL^T (lane's `pick2.py`) | anchor a = 2, order 160, 12000 bits | negative pivots 149, 150; d_148 = 4.51e-564 > 0; d_149 = [-2.7797022965874030638e-569 +/- 2.25e-589]; all 160 decided |
| zeta confluent | anchor a = 2, order 160 | all pivots positive |
| DH * B_2 B_3 B_4 B_9 confluent | anchors a = 1/2 and a = 2, order 256, 12000 bits | all 256 pivots positive at both anchors |
| DH distinct nested nodes | van der Corput in [0.05, 2], 160 nodes, 10000 bits | positive on the first 148 nodes; negative pivots 149, 150 |
| jet matrix of `pick2.build` against an independent build | mpmath: P[i][j] = d_x^i d_y^j K/(i! j!) at (1, 1), i, j <= 2, own formula for L_DH (non-deflated Hurwitz) | agreement to 4e-31; `L_DH(1) = 0.1927572239684354733178...` |
| kernel signs (mpmath, non-rigorous, 40 digits) | u = 0, 0.013, 0.31, 0.59, 0.77, 1.9, 2.95, 3.4 | kappa > 0, L'' < 0, h < 0 at every point (h = -1.4e-6 at 0.013, -0.0200 at 0.31, -24.16 at 2.95); `L''(0) = -0.638409737222`, `L''''(0) = -1.97620088837176961` |
| DH zero | `f_DH(0.80851718245663738555 + 85.69934848537759217193 i)` | modulus 4.3e-21, |f'| = 1.26: consistent with a simple zero within 1e-20 of the centre |
| Lemma 3 | s = 0.01, 0.2, 0.5, 0.99, 1.0001, 3 | f_DH = 0.661, 0.735, 0.825, 0.921, 0.923, 1.014 |
| Lemma 2 (d) (item L2d) | q = 2, nodes 0.3, 1.1, 2.4, 0.05 | divided differences of the tanh kernel equal the gamma-sum formula to 1.6e-33; eigenvalues 1.25e-7, 2.28e-5, 4.38e-3, 0.120, all positive |
| B_c zeros, c = 1/2 | Newton from off-line starts | zeros 1/2 + 8.6636398 i, 1/2 + 19.6644966 i; functional equation defect 4e-61 |
| 3.4 (b) kernel of D_Q | second derivative of log kernel (not a finite difference) | Q = {3} at u = 0.81: +0.1253 (not log-concave); {4} at 0: +0.6188; {6} at 0: +5.345; {2} at 1.08: -0.3168. Signs agree with the lane's grid |

Not re-run: the 256-node sequences, the `det` cross-check, the Part 1 interval sweep itself (only its
derivation and sample points were checked), the m = 1, 8, 64, 4096 powers, the 12- and 21-factor products,
and the B_c argument-principle count.

## 3. Findings

No error that changes a claim. Points that should accompany the result:

G1. **Theorem C is a domination statement, and elementary.** `M_{D_Q} = M_DH + sum_q M_{E_q}` with each
    `M_{E_q}` strictly positive; on a compact node cube enough on-line factors dominate the fixed bounded
    matrix M_DH. The function depends on N and beta, its conductor 5 prod q grows with N, and the proof gives
    no usable bound on m (mu is of size 1e-7 already at N = 4 on [0.05, 2.4]). It is correctly labelled as an
    existence statement. It should be recorded as "PROVED, elementary", not as a structural result on DH.
G2. **Read class.** The class in Theorem C is {functional equation, ordinary Dirichlet series, positive even
    kernel, Pick orders <= N on [0, beta]}. It does not include log-concavity of the kernel or (CS); this pass
    confirms the sign of the failure for Q = {3}, {4}, {6}. Any use of Theorem C against a device that reads
    (LC) is not covered. The lane says this (3.4 (b)); the one-line claim summary in `lanes.jsonl` also says
    it. Keep both restrictions (bounded range, no (LC)) wherever Theorem C is cited.
G3. **"Positive definite to order 148" is per configuration.** Now seven configurations (confluent a = 1/10,
    1/2, 1, 2, 3; nested sequences in [0.01, 0.5], [0.05, 2], [0.1, 10]) give first failure 149 with negative
    pivots 149, 150. This remains an observation; no certificate covers a continuum of node sets, and the
    lane cites later failures at anchors a >= 10 from another lane (not checked here).
G4. **Unverified numbers in an OPEN paragraph.** In 3.4 (a) the figures "Re z > 0.6204" and "zeros of DH with
    Re s up to 1.1203625" are not derived or sourced in this lane and were not checked here. They are not
    used in any PROVED or CERTIFIED step.
G5. **Shared code.** All ball Pick runs (the lane's and this pass's a = 2, a = 1/2 and [0.05, 2] cases) use
    `pick2.L_series` and `pick2.ldl`. Independent evidence for the build is the lane's `ref_check.py` (orders
    147 to 151, a = 1) and this pass's mpmath comparison of the first six jet entries. The LDL^T routine is
    15 lines and was read; it is a standard right-looking Schur complement on the lower triangle.
G6. **Process.** The second and third server launches were made without a fresh `rhstatus` reading (stated in
    section 7). No effect on results.

Checks requested by the assignment: no step assumes RH; nothing restates verified zero height (the zeta runs
are comparisons at real nodes, and no claim about zeta zeros is drawn); Theorem B is labelled CLASSICAL;
Theorems A and C are elementary and are presented as proved here, without a claim of depth. No zeta-only
mechanism is claimed, so there is no control battery to run; the planted comparisons (quartets, real pair)
were not re-run in this pass.

## 4. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no step uses multiplicativity; Theorems A and C exhibit non-multiplicative functions passing the same finite tests |
| R2 | false | finite orders, bounded node ranges |
| R3 | false | control statement; no attack |
| R4 | false | finite stages only |

Surviving claim: Part 1 (DH kernel positive, strictly log-concave, `u L'' - L' < 0`; certified, two
derivations in the lane plus sample-point agreement here). Part 2 (DH first failure at 149 with negative
pivots 149, 150, 218, 219 to order 256 on the stated configurations; zeta positive there; planted comparisons
at 21, 101, 2). Part 3 (Theorems A, B, C as stated, C on bounded node ranges with class "positive even
kernel"; certified instance Q = {2, 3, 4, 9} to order 256 at a = 1, and at a = 1/2 and a = 2 in this pass).
