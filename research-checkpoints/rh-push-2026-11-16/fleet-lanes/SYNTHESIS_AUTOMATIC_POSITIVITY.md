# Synthesis: structures where positivity is automatic (2026-11-17)

Scope: seven lanes under `tmp/research-2026-11-16/push/ap-*`, each with a `RESULT.md` and a `REFEREE.md`. The lanes test five structures in which "zeros on a line" or "this quantity is >= 0" is a theorem (Lee-Yang, squares, Hodge index, a global object carrying all primes, an order-2 analogue of the 7/8 method), plus one compute job.

This file states only what the referee of each lane confirmed or left standing after correction. Labels: PROVED, CLASSICAL, MEASURED (floating point unless stated), ARGUED, NOT RUN.

Result in one paragraph: no lane gives information about any zero of zeta. Six lanes end in a precise obstruction; the seventh delivers a tested sweep that has not been run on the compute server. Five referees upheld the verdict with corrections; two (order 2, box experiment) found false or unproved statements and the verdict stands only in the repaired form given below. In no lane was a structural property found that holds for zeta and fails for every control. RH is open; no bound moves.

Controls referred to below: DH (Davenport-Heilbronn), HEAT (backward heat family), TW (sign twists), EA (E_a = zeta(s+a) zeta(s-a)), NR (T-NR twin), B (Beurling), U (unimodular twist, section 1.4).

---

## 1. The five structures

### 1.1 Lee-Yang

Two lanes: `ap-leeyang-structural` (is Xi a ferromagnet or a limit of ferromagnets) and `ap-leeyang-ladder` (finite truncations of the twin ladder).

**Established (structural lane).**
- PROVED: Phi = phi * (formal convolution over primes of one-sided geometric measures). There is no interaction term, and every factor is zero-free in the strip.
- PROVED relative to Lieb-Sokal, Newman 1976 and Rodgers-Tao (statements recalled, not opened): a ferromagnet with all pairs coupled, coupling at least m, and two-point or alpha > 0 Newman-class sites has de Bruijn-Newman constant <= -m/2. Equality holds for equal-coupling Ising at every N (the referee supplied the proof for all N; the lane had measured N = 2, 3). Hence Xi is neither such a system nor a limit of such systems with m bounded below.
- CLASSICAL: the only height-uniform output is de Bruijn's bound Lambda <= (2 theta - 1)^2 / 2.
- MEASURED: symmetrised sums over n have off-line zeros from N = 2.

**Established (ladder lane).**
- PROVED (Stirling constant numerical; Spira-type mechanism, no novelty): for a truncation whose rung set is the divisors of M and whose Bohr piece is polydisc-stable, Theta = chi * M^(s-1/2) * I_M with I_M inner, and all zeros with |t| >= 2 pi M (1 + O(t^-2)) lie on the line. Threshold consistent with sharpness for M = 4, 6, 30 (referee re-run; M = 36 lane only).
- PROVED: inserting a rung multiplies Theta by a factor with mean log-modulus 0 on each torus 0 < x < 1/2 that exceeds 1 somewhere, so it is not a contraction.
- PROVED: sharp theta-cut splits have no winding and fail dominance.
- CLASSICAL: heat deformation of the Bohr piece is a Lee-Yang system for c >= 0, with zeros on Re s = c log M.
- PROVED (phase statement): the truncation phase has no limit at fixed height. The whole-plane Lee-Yang regime M <= t/2pi is compatible with AFE-complete support only for t < 157.
- The finite-stage theorem holds equally for E_a (a < 1/2) and for sign twists.

**Referee corrections.**
- Structural: Proposition 1 is proved only for sites with e^{b x^2} integrable for every b, not for all of Newman's class (alpha = 0 excluded). The statement is Lambda >= 0 (Rodgers-Tao) in ferromagnet language; nothing is new relative to the literature. "Route closed" rests on five models and complete-graph couplings; "the only coupling on the total spin is the heat time" is true by definition, not an exhaustiveness theorem. Phi(u) is an exponential tilt of the law of U, not the law itself. The reason given for the DH Laplace transform not being a reciprocal of an entire function was invalid; the conclusion was checked directly (zero near L = -2.05). Newman-Wu 2020 was not cited and overlap is unchecked.
- Ladder: "full Euler factors have off-line zeros near Re s = 1 at every height" is ARGUED, not PROVED. "Zeros do not converge" is ARGUED (derivative lower bound missing). Under the measured strip formula the compatible range is t < 307.9 and 353.4 <= t < 402.1, not t < 157. E_a does not show what a limit step must use, because the truncations have no limit; what holds is that finite-stage stability says nothing about the zeros of the limit function. The Ising reading of the heat flow is a restatement of Lieb-Sokal/Newman. Gonek's 2012 model is a different construction; Spira is the antecedent.

**Control.**
- Structural lane: no structural failure for DH. DH passes the GHS-type and cumulant-sign inequalities while having off-line zeros (referee re-computed the zero 0.808517182457 + 85.699348485378i and six cumulant signs). No coupling turns antiferromagnetic for DH. DH differs from zeta by lacking a product (Lee-Yang content only in Re s > 1) and by signed weights; signed weights do not separate, since Dirichlet L-functions share them and Epstein h > 1 controls with off-line zeros lack them.
- Ladder lane: DH fails at a named step, stability of the Bohr piece. For primes {2,3,7}, depth 1, the DH piece has polydisc zeros (sup sigma between 0.652 and 0.654), so the reflection quotient is not inner; 190 strip off-line zeros in 2 < t < 5002 and 24 in [1e5, 1e5+500], against 0 for zeta (reproduced with independent code, float64/mpmath). This failure is at finite stage only. E_a and sign twists pass the same finite-stage theorem, so the step does not separate zeta from the controls with off-line zeros.

**Status: closed at this level.** The ladder route restates wall 5.4 (rows Q10-Q13). Not excluded: a sparse, hierarchical or vanishing-coupling ferromagnetic representation; non-product polydisc-stable polynomials with degree lattice M <= t/2pi approximating the smoothed AFE sum (ladder Prop E(d), undecided).

### 1.2 Squares (`ap-squares-rallis`)

**Established.**
- PROVED (uses refereed eq48; density step repaired by the referee): if Theta is linear on the shift-closed exponential class with ||Theta v||^2 = Q_L(v) and Theta S_a = U(a) Theta for a unitary group U, then RH holds and the cyclic span is l^2 on the zeros with U(a) = multiplication by e^{-i a gamma}. A covariant norm realisation is a Hilbert-Polya space.
- PROVED, unconditional: no such Theta exists when U is mixing. This covers scaling on L^2 of the idele class group (Tate theta vector), and right translation by a non-compact one-parameter subgroup of a connected semisimple G with finite centre on L^2(Gamma\G), off the vectors fixed by a non-compact factor (Howe-Moore).
- PROVED: a diagonal formula Q_L = int |V(it)|^2 d mu forces the symmetrised mu to be the zero-counting measure. Absolutely continuous Rallis-type measures are excluded.
- CLASSICAL: theta-vector matrix coefficients equal c <phi, omega(g) psi> and carry no arithmetic.

**Referee corrections.**
- The headline "no norm realisation of Rallis / Waldspurger / theta-lift type exists, independent of group, cover, level, test vector" is false as written; the no-go depends on U. Not covered: U a function of the Casimir/Laplacian (wave group) or of Hecke operators, which has pure point spectrum on the cuspidal and residual parts; compact one-parameter subgroups, including any subgroup when the target group is compact at infinity; reducible lattices and compact factors.
- The Rallis row applies only if the shift of v is omega(h_t) with h_t in the target group. If v enters on the source side, the corollary does not apply.
- The family-sum step (Kohnen-Zagier type) is not proved as stated: extension from E to its closure needs a stronger summability condition.
- Rallis, Lapid-Rallis and Kohnen-Zagier are paraphrased without their hypotheses and normalising factors; none is load-bearing.
- The one-sided Hardy statement (range closure = Nyman-Beurling = RH) and the two-sided L^2(C_Q) statement were conflated.
- Novelty: a consolidation of the known absorption-versus-point-spectrum remark (Connes 1999, Meyer 2005, Burnol), checked from memory only.

**Control.** No structural failure. The two automatic norms (Tate theta norm, Schur isometry of theta vectors) hold verbatim for DH; the referee confirmed the Tate norm identity for DH numerically (1.23791 against 1.23293; 0.60630 against 0.60506, float level) and that Q_DH is indefinite (Re L / Re x = -35.39 at x = 0.2 + 85.699348i, against +1.755 for zeta). DH fails only where irreducibility or a product of local intertwiners is required, and those structures prove only Re s >= 1 or a real central value. "No Eisenstein series has the DH intertwiner" is ARGUED. HEAT and EA cells NOT RUN.

**Status: closed for mixing covariant realisations; open outside them.** The lane gives no mechanism. The uncovered cases are listed under corrections.

### 1.3 Hodge index (`ap-hodge-index`)

**Established.**
- PROVED (from the ordinary Weil criterion; the referee gave a derivation that does not need the Bombieri pole-free citation): with I = Prime - Arch = Pole - Z, RH iff I has at most one positive eigenvalue on every finite-dimensional test space iff I(h,g)^2 >= I(h,h) I(g,g) for one fixed h with I(h,h) > 0. Also i_-(Z) - 1 <= i_+(I) <= i_-(Z) + 1. This restates RH and overlaps arith-surface Cor 2.3.
- PROVED: for quadratics the Lorentzian property equals the signature statement; the normalised Euler polynomial is a power of a linear form; single-prime forms have index (inf, inf).
- MEASURED, reproduced with independent Arb code (entries not interval-enclosed): zeta has one positive eigenvalue on the nested Gaussian families checked (to dimension 200); truncated prime sets fail near the first missing prime power.

**Referee corrections.**
- DH first failure is at dimension 79-174 and cutoff 3.45-4.68 depending on the grid, not 116-174 and 3.45-3.57. The h = 0.06 row (dimension 79) is attributed to the same quartet by a removal test.
- "DH satisfies the Lorentzian signature at every stage below dimension 116" is specific to the nested Gaussian families: for DH a one-dimensional failing test space exists. Dimension is not the invariant; window and resolution are.
- Pivot sizes are basis-dependent. Basis-independent relative size at first failure: 5.5e-14 to 1.3e-6, about 0.5 by cutoff 3.99 at h = 0.03. For s/h = 1 a 1e-14 relative perturbation creates spurious positive pivots, so double precision cannot reproduce those rows.
- "E_a, T-NR, TW+ share every structural property tested" is false for T-NR (negative off-diagonal entries). Only E_a and TW+ pass all. The T-NR Euler-polynomial test was run on a factor of the same type, not the control's own.
- Backward heat (a mandatory control) and Beurling NOT RUN.

**Control.** No structural failure. On the nested families DH is negative definite until the test space resolves the off-line quartet at height 85.7; this is the zero itself, not a structure. Sign/support structure and the Lorentzian Euler polynomial fail for DH only through non-multiplicativity and a(3) < 0, properties that E_a and TW+ pass.

**Status: closed as a restatement of RH.** One item remains: a polynomial F of degree >= 3 with the Weil form as a derivative whose Lorentzian property has an independent source (stable, determinantal or volume-type). The cone and product constructions are circular.

### 1.4 Global bridge (`ap-global-bridge`)

**Established.**
- PROVED, and known (special case of Seip, J. Anal. Math. 141 (2020), arXiv:1812.11729): for any s0 with 1/2 < Re s0 < 1 there is a completely multiplicative unimodular chi with sum chi(n) n^{-s} = E(s) / zeta(s - s0 + 1), E analytic and zero-free in Re s > 1/2, with a simple zero at s0. This gives control U: ordinary Dirichlet series, Euler product, unimodular local parameters, correct size; lacks the functional equation and Lambda >= 0.
- U removes {INT, GEOM} from the minimal input sets of the obstruction map. {FE, SIZE} and {FE, GEOM} remain.
- PROVED for translation-invariant properties: translations of the Bohr torus T^P preserve Haar measure, the Kronecker flow, the Hardy space, rung isometries up to phase and the Toeplitz algebra. No translation-invariant property of the compact object implies a zero-free region.
- PROVED: on Zhat*-invariants prime ideles act as real dilations, so the global object restricted to xi is the half-line ladder. The heat flow is a non-decomposable test vector (for the stated representative).
- CLASSICAL: the Bohr-torus count is a real-valued mean motion, i.e. a zero density.

**Referee corrections.**
- Theorem C is not new; U is new only as a row of this campaign's control table.
- "No invariant of the compact object" must read "no translation-invariant property". chi = 1 is the identity element of the group, the automorphic line is the unique flow orbit that is a subgroup, and translations are not group automorphisms. Properties that use the identity (example: unimodular Euler symbol with non-negative Fourier coefficients, true only at chi = 1) are not covered.
- "Nonzero Breuer index for DH in 1 < sigma < 1.12" is the wrong term. The DH symbol has a zero on the torus for sigma <= sigma* = 1.12036247, so the Toeplitz operator is not Breuer-Fredholm and the index is undefined; what is nonzero is the Jessen mean motion.
- The proof that DH zeros are not a dilation spectrum was incomplete; unconditional repair: DH has zeros in Re s > 1 and no Hecke L-function does.
- The Krein-form dictionary row is ARGUED and unverified.

**Control.** DH fails structurally: it is not an eigenvector of Zhat* (two-character test vector at 5) and its Bohr symbol is non-invertible for sigma <= sigma*. For zeta this exclusion gives only the classical zero-density statement. The lane is defeated by U, which passes every translation-invariant Bohr-torus statement and has a zero at a chosen point of the strip.

**Status: closed for translation-invariant statements on the compact object; open for properties tied to the identity element** and for the semilocal (Connes) form with the Krein index tracked in the place set S.

### 1.5 Order 2 (`ap-order-two`)

Referee verdict on the strict rule: does not hold as written. The statements below are the repaired form.

**Established.**
- Sketch level (exponents re-derived, main term checked numerically to 1e-3): for the order-2 probe over Q with odd squarefree s, c and |x_c| <= 1, I = f + N, where f (square rows) = c_0 Z^{-1/2} sum_c x_c h(c) w(c/Z) + O(Z^{1/2} Q^{-1/2} + Z^{1/2} Y^{-1/2+eps}), h multiplicative, and |N| << (QYZ)^eps (1 + X^{1/2} + Z^{1/2} Y^{-1/3}).
- For x = mu * eta with eta a fixed Dirichlet character, Y >= Z^{3/2}, X <= 1 <= Q/Z: the high estimate (2.5) is unconditional. The low estimate (2.4) at sigma_0 >= 1/2, required for all admissible weights w or for one weight with zero-free Mellin transform, is equivalent to L(s, eta) having no zero in Re s > sigma_0. So f(theta) = theta: the system returns its input. Its unconditional value is 1.
- PROVED (coprime terms): Poisson summation in m maps the probe to a probe of the same form.
- The quadratic Gauss sum is a root of unity times a character, so the step of the sextic method that absorbs mu into a Gauss sum of order >= 3 has no order-2 counterpart.
- Inside the estimate system (R), (P), (T), (L), relative to r2-zf-paired-rows with its referee's qualifiers: effective order 2 with h <= 1 forces a trivial Gauss class and is circular.

**Referee corrections.**
- Theorem B(ii) "only if" was not proved for a fixed weight: a zero of L at a zero of the Mellin transform of w is not excluded. Admissible weights with Mellin zeros in Re s > 1/2 exist (6 zeros on Re s = 3/4 with |Im s| <= 60 for an explicit two-bump weight).
- "No step uses multiplicativity" is false: Theorem A(a) uses the Euler product to factor h and to drop the prime 2 and non-squarefree c. For DH inverse coefficients, x_6 = -1.161 against x_2 x_3 = -0.081, max |x_c| reaches 2430, 73% of the l1 mass is on non-squarefree c.
- All five numerical runs have Y <= Z, outside the geometry Y >= Z^{3/2} of Theorem A(c); the exponent Z^{1/2} Y^{-1/3} is untested.
- Lemma W is a sketch for the genus average and ARGUED for a single form. Theorem E inherits a MODEL step from r2-zf-paired-rows and an unwritten extension of Lemma B(iii). Theorem B(iii) needs ly >= 1 - M/2.
- Novelty: Theorems A, B, C are classical. New: the written-out r = 2 instance of map row Z15 and Lemma R, as statements about the method family.

**Control.** No zero statement is made, so there is nothing for a control to break. For Euler-product controls (sign twists, NR) the probe returns the control's own abscissa. For DH and E_a only the coefficient-blind decomposition is established; the relation of the returned abscissa to their zeros is not derived, and the referee's DH runs showed no failure of the low estimate (|I| <= 0.011, smoothed inverse sums below 0.02 Z up to Z = 5.12e5).

**Status: closed inside Poisson-based probe systems.** Two cases are outside Theorem E: (1) a second representation of quadratic rows that is not Poisson summation (half-integral-weight Kuznetsov, Salie sums); (2) r3-method-limit Theorem 3(b), h = r/2 by long prime marks, circular only heuristically.

---

## 2. The compute job (`ap-box-experiment`)

**What it tests.** Whether some truncation or regularisation scheme has all zeros real (the Lee-Yang property) for the zeta input at every finite size while each control fails at some finite size. Schemes: Jensen polynomials, FE-symmetrised Dirichlet / Riesz / Euler truncations, half-line and Polya theta truncations, de Bruijn kernels, Bohr lifts. Tests: certified Sturm chains and argument-principle counts (Arb); the Bohr-lift test is float64. The sweep is resumable (JSON-lines checkpoint, one process per task, per-task memory plan and supervision).

**State.** Tested locally: 435 tasks, single process, 8 GB cap; selftest 16/16 re-run by the referee. NOT RUN on the compute server (975 tasks planned).

**Local findings that stand.**
- CERTIFIED locally: on full windows no scheme has zeta passing every size with every control failing.
- The Euler scheme on the window 10 <= |Re z| <= 30, |Im z| <= 0.35 does show that pattern among formulable controls for P <= 47 (zeta passes; tw2m, tw2h, liou, ea:0.25 fail by P <= 17). The window holds three zeros, control verdicts are non-monotone in P, and DH is not formulable in this scheme. The referee treats it as no evidence of separation.
- Polya rows at N <= 3, T = 40 do not distinguish zeta from its sign twists (same count for all three).
- Prop 1 (PROVED, elementary, applies equally to controls): the half-line N-term theta truncation has finitely many real zeros and infinitely many non-real zeros for every N >= 1.
- Prop 2 (corrected form): for real eps_p with |eps_p| <= 1 and 1/2 < sigma < 1, the first term of the Bohr-lifted symmetrised Euler product dominates the second on the whole torus iff R(sigma,t) prod (1 - |eps_p| p^{sigma-1}) / (1 - |eps_p| p^{-sigma}) > 1. This is sufficient, not necessary, for non-vanishing. Near sigma = 1/2 it holds iff t > t_line(P), log t_line ~ 4 sqrt P (row Q11 on the torus); near sigma = 1 it fails at every height. Sign twists +-1 are exact torus translates of zeta.
- Refuted by the referee: "Lee-Yang fails below t_line for every P >= 2" (false at P = 2) and "holds above t_line" (false on the open strip; interior torus zeros found at P = 2, t = 200, sigma = 0.85193).
- DH: fails sharp truncation at N = 4 and half-line truncation at N = 1; passes Jensen d <= 256, Polya N <= 3, Riesz N <= 20 (its off-line zeros start at height 85.7, above the local windows).

**Command as written in the lane README** (`tmp/research-2026-11-16/push/ap-box-experiment/README.md`):

```
systemd-run --user --slice=rh.slice --unit=ap-box --collect --working-directory="$PWD" \
  taskset -c 32-39 \
  env RH_WORKERS=8 RH_TASK_GB=24 RH_TOTAL_GB=48 RH_TASK_SECONDS=21600 \
  python3 -u sweep.py --tier box --out results/box.jsonl
```

Before it: `python3 -u selftest.py` (must print `SELFTEST PASSED`) and `python3 sweep.py --tier box --list | tail -5`. After it: `python3 summary.py results/box.jsonl --md results/box-summary.md`.

**This command must not be used as written.** The referee found:
1. It calls `systemd-run` directly with a 72 GB resident bound. BRIEF.md requires the `rhrun` wrapper, at most 64 GB per job and about 45 GB per lane.
2. The heat-input memory plan is low by a factor 1.3 to 1.5 (1445 MB measured against 1098 MB planned). The three `heat:-0.25` d = 128 tasks would likely end `KILLED_MEM`. Raise that plan by about 1.6 in `sweep.py` first.
3. Wall time is underestimated: the fifteen d = 2048 Jensen tasks are planned at 18 to 19 GB each, so at most two run at once (15 to 20 h tail); the DH d = 2048 tasks may exceed the 6 h task limit.

Wrapper form consistent with BRIEF.md (template written for this synthesis; not tested, not reviewed by the referee; to be launched by the main session, not by an agent). The README bound is 1.25 x RH_TOTAL_GB + RH_WORKERS x 1.5 GB, which with the values below is 44 GB:

```
ssh -o BatchMode=yes [compute-server] 'cd ~/rh-push/ap-box-experiment && \
  ~/rh-push/bin/rhrun ap-box 45 6 -- env RH_WORKERS=6 RH_TASK_GB=24 RH_TOTAL_GB=28 RH_TASK_SECONDS=21600 \
  python3 -u sweep.py --tier box --out results/box.jsonl'
```

With RH_TOTAL_GB=28 the d = 2048 Jensen tasks run one at a time, which lengthens the tail beyond the referee's 15 to 20 h figure.

**What to read first in the output.** Whether the Euler scheme still passes for zeta in the high window at T = 200 for P up to 997. Compare each PASS zero count n_tot with the Riemann-von Mangoldt count before reading a pass as a Lee-Yang property. Expected outcome given Prop 2 and row Q11: zeta fails once the window extends below t_line(P).

---

## 3. Single most promising next step

Selection made in this synthesis from the residuals the referees left open; no referee ranked them.

**Step: decide whether a square realisation of Q_L exists with a point-spectrum intertwiner, i.e. the cases the squares no-go does not cover: U a function of Hecke operators or of the Casimir on the cuspidal part of a (metaplectic) quotient, or a group compact at infinity (definite orthogonal target).**

Reasons.
1. It is the only residual with a necessary-and-sufficient target. Theorem 1 of the squares lane (refereed, density step repaired) states what any covariant square must be: l^2 on the zeros, U(a) = multiplication by e^{-i a gamma}. A candidate can be accepted or rejected by its spectrum, without estimating anything.
2. The no-go that closed the lane is a mixing argument, and the referee identified by name the classes where mixing fails. These are not edge cases: Hecke operators and the Casimir have pure point spectrum on cuspidal spaces, and weight-1/2 theta functions (where the rung shift is a Hecke operator) are in that setting.
3. Two other lanes point to the same place. The global-bridge referee showed the torus no-go covers only translation-invariant properties and leaves those tied to the identity element chi = 1, which is where Hecke structure lives. The order-2 lane leaves open a non-Poisson representation of quadratic rows through half-integral-weight Kuznetsov or Salie sums, the same weight-1/2 spectral setting.
4. It has a control requirement that can be checked early. The automatic norms are identical for DH, so the construction must use irreducibility or Hecke eigen-structure at a named step, and must fail for U (no functional equation) and for E_a (non-unimodular local parameters).

Limits. No mechanism is known; the lane and its referee both state this. Theorem 1 says a success would be a Hilbert-Polya space, so the step is as hard as RH and the expected outcome is a second, narrower no-go (for example: the spectral parameter of the candidate U is a Laplace eigenvalue, whose counting function does not match N(T)). The first deliverable should be that comparison: Weyl law of the candidate spectrum against (T/2pi) log(T/2pi e), for each uncovered class.

Not selected: the box run (expected to reproduce row Q11; the one apparent separation is on a three-zero window without DH); the degree >= 3 Lorentzian polynomial (no candidate with an independent source); sparse ferromagnets (no candidate); ladder Prop E(d) (restates wall 5.4 if negative).

---

## 4. Rows to add to the obstruction map

Target file: `tmp/research-2026-11-16/push/OBSTRUCTION_MAP.md` (not edited here).

### Section 2, control table: one new row

| Code | Control | Has | Lacks | Use |
|---|---|---|---|---|
| U | unimodular twist sum chi(n) n^{-s} = E(s)/zeta(s - s0 + 1), chi completely multiplicative, abs(chi) = 1 (Seip 2020; ap-global-bridge Thm C, refereed) | ordinary Dirichlet series, Euler product, unimodular local parameters, size; simple zero at any chosen s0 with 1/2 < Re s0 < 1 | functional equation; Lambda >= 0 | kills any argument using only translation-invariant structure of the Bohr torus, or only {INT, GEOM} |

Edit to the "Input level" note: the minimal input sets hit by all controls become {FE, SIZE} and {FE, GEOM}; {INT, GEOM} is removed by U.

### Section 3, new subsection "3.9 Automatic positivity (Lee-Yang, squares, Hodge index, global object, order 2)"

| Row | Mechanism | Obstruction (refereed form) | Control outcome | Source |
|---|---|---|---|---|
| A1 | Xi as a ferromagnet or limit of ferromagnets (pair interactions, Newman / Lieb-Sokal) | Phi = phi * (convolution over primes of one-sided geometric measures), no interaction term. Complete-graph ferromagnet with coupling >= m and two-point or alpha > 0 sites has de Bruijn-Newman constant <= -m/2 (sharp for Ising, every N); Xi is not one, nor a limit with m bounded below (Lambda >= 0 restated). Height-uniform output: Lambda <= (2 theta - 1)^2/2. Not excluded: sparse, hierarchical or vanishing-coupling representations. | DH passes GHS-type and cumulant-sign inequalities (measured); no coupling turns antiferromagnetic. Signed weights do not separate (Dirichlet L share them, Epstein h > 1 lack them). | ap-leeyang-structural |
| A2 | Lee-Yang at finite stages of the ladder (rung set = divisors of M) | Theta = chi M^(s-1/2) I_M, I_M inner; zeros on the line for abs(t) >= 2 pi M. Rung insertion is not a contraction (mean log-modulus 0, exceeds 1 somewhere). Truncation phase has no limit; whole-plane regime compatible with AFE-complete support only for t < 157 (t < 402 under the measured strip formula). Restates wall 5.4 (Q10-Q13). | DH fails Bohr-piece stability at primes {2,3,7}, depth 1 (sup sigma 0.653; 190 strip off-line zeros in 2 < t < 5002, 0 for zeta; float64). E_a and sign twists pass the finite-stage theorem. | ap-leeyang-ladder |
| A3 | Q_L as a covariant square: Theta S_a = U(a) Theta, norm(Theta v)^2 = Q_L(v) (Tate, theta lift, Rallis, Waldspurger, Kohnen-Zagier) | Such a Theta exists iff the space is l^2 on the zeros with U(a) = e^{-i a gamma} (then RH). None exists for mixing U: scaling on L^2(C_Q); right translation by a non-compact one-parameter subgroup on L^2(Gamma\G). Diagonal formula forces mu = zero-counting measure. Not covered: U a function of Casimir or Hecke operators; compact one-parameter groups and groups compact at infinity; source-side test vectors; non-covariant or truncated realisations; family sums without the stronger summability condition. | Identical for DH: Tate norm and Schur isometry hold verbatim (float level); Q_DH indefinite. HEAT, EA not run. | ap-squares-rallis |
| A4 | Hodge index / Lorentzian signature for I = Prime - Arch | RH iff I has at most one positive eigenvalue on every finite-dimensional test space iff reverse Cauchy-Schwarz for one fixed h (restates RH; overlaps arith-surface Cor 2.3). Lorentzian = signature for quadratics; normalised Euler polynomial is a power of a linear form. Open: degree >= 3 polynomial with an independent Lorentzian source. | DH fails only when the test space resolves the quartet at 85.7 (dimension 79-174, cutoff 3.45-4.68 on nested Gaussians; a one-dimensional failing space also exists). E_a and TW+ pass every structural property tested; T-NR fails sign structure. HEAT, B not run. | ap-hodge-index |
| A5 | Global compact object (Bohr torus T^P, idele class group) with translation-invariant structure | Translations preserve Haar measure, Kronecker flow, Hardy space, rung isometries up to phase, Toeplitz algebra; control U has a zero at any s0 in the strip. On Zhat*-invariants the object is the half-line ladder. Bohr-torus count is a mean motion (density). Not covered: properties using the identity element chi = 1; semilocal Krein index uniform in S. | DH fails (two-character vector at 5; Bohr symbol non-invertible for sigma <= 1.12036247; nonzero Jessen mean motion). U passes every translation-invariant statement. | ap-global-bridge |
| A6 | Order-2 probe (quadratic characters, square rows) as an analogue of the sextic method | I = f + N, f = weighted coefficient sum, N bounded by Heath-Brown's large sieve for arbitrary coefficients (sketch). With Y >= Z^{3/2}, X <= 1: low estimate at sigma_0, for all admissible w, iff no zeros in Re s > sigma_0; f(theta) = theta; unconditional value 1. Poisson maps the probe to itself. Quadratic Gauss sum = root of unity times character: no absorption step. Circular inside (R),(P),(T),(L) relative to r2-zf-paired-rows. Outside: non-Poisson representations (half-integral-weight Kuznetsov, Salie); r3-method-limit Thm 3(b). | Euler-product controls (sign twists, NR): returns the control's abscissa. DH, E_a: only the decomposition is established. No zero statement. | ap-order-two |
| A7 | Finite-stage Lee-Yang sweep across truncation schemes | Locally (435 tasks, certified Sturm / argument counts): on full windows no scheme has zeta passing every size with every control failing. Half-line theta truncation has infinitely many non-real zeros for every N. Bohr-lift dominance iff R prod (1 - abs(eps_p) p^{sigma-1})/(1 - abs(eps_p) p^{-sigma}) > 1 (sufficient only; = Q11 on the torus; fails near sigma = 1 at every height). Box tier not run. | Euler scheme, window 10 <= abs(Re z) <= 30: zeta passes P <= 47, formulable controls fail by P <= 17 (three-zero window, non-monotone, no DH). DH passes Jensen d <= 256, Polya N <= 3, Riesz N <= 20. | ap-box-experiment |

### Section 7, referee-broken claims index: entries to add

| Lane | Claim as first written | Status |
|---|---|---|
| ap-squares-rallis | No norm realisation of Rallis / Waldspurger / theta-lift type exists, independent of group, cover, level, test vector | False as written; holds for mixing U only |
| ap-global-bridge | Theorem C is a new control; no invariant of the compact object implies a zero-free region; DH has nonzero Breuer index for 1 < sigma < 1.12 | Known (Seip 2020); translation-invariant properties only; index undefined, Jessen mean motion nonzero |
| ap-hodge-index | DH first fails at dimension 116-174, window 3.45-3.57; E_a, T-NR, TW+ share every structural property | 79-174 and 3.45-4.68; false for T-NR |
| ap-order-two | Theorem B(ii) for a fixed weight; "no step uses multiplicativity"; DH returns its true supremum | Needs all admissible w or a zero-free Mellin transform; A(a) uses the Euler product; DH row not derived |
| ap-box-experiment | Lee-Yang fails for zeta below t_line(P) for every P >= 2 and holds above it; no scheme has the target pattern | False at P = 2; false on the open strip; the high-window Euler row has the pattern (uninformative window) |
| ap-leeyang-ladder | Full Euler factors have off-line zeros near Re s = 1 at every height (PROVED); compatible only for t < 157; E_a shows what a limit step must use | ARGUED; t < 402 under the strip formula; withdrawn |
| ap-leeyang-structural | Proposition 1 for all of Newman's class; "route closed" | Proved for two-point or alpha > 0 sites; closed for the five models and complete-graph couplings examined |

---

## Files

- `tmp/research-2026-11-16/push/ap-leeyang-structural/RESULT.md`, `REFEREE.md`
- `tmp/research-2026-11-16/push/ap-leeyang-ladder/RESULT.md`, `REFEREE.md`
- `tmp/research-2026-11-16/push/ap-squares-rallis/RESULT.md`, `REFEREE.md`
- `tmp/research-2026-11-16/push/ap-hodge-index/RESULT.md`, `REFEREE.md`
- `tmp/research-2026-11-16/push/ap-global-bridge/RESULT.md`, `REFEREE.md`
- `tmp/research-2026-11-16/push/ap-order-two/RESULT.md`, `REFEREE.md`
- `tmp/research-2026-11-16/push/ap-box-experiment/RESULT.md`, `REFEREE.md`, `README.md`
