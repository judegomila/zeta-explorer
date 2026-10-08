# Raymond G0 deep review, part A: AF Part I §§2–5 and main-paper Lemma 2, Lemma 3, Theorem 4 / Theorem 4′

The time-zero strip and the zero-free start, uniformity in x ≥ X − 2, and RH below X.

Date: 2026-10-08 (work done 2026-10-07). Branch `editorial-redesign`, working files only (nothing committed).
Companion: `raymond-g0-review-b-2026-10-08.md` (part B: AF Part I §§6–12 and Part II under the 7/8 start).

This is an internal referee pass by the project. It is a fresh reading, not a non-project review. It moves no Λ value.
PT Λ ≤ 0.2 stands. RH is open. NO QED.

## Sources

| source | location used |
|---|---|
| D. J. Raymond, *Correlated translated probes and the bound Λ < 0.149396*, v1.0, 21 Sep 2026 (Zenodo 22867547), "main" | `tmp/raymond-22867547/Correlated_Translated_Probes.tex` |
| D. J. Raymond, *Analytic foundations for the time-zero upper-bound construction*, same deposit, "AF" | `tmp/raymond-22867547/Analytic_Foundations.txt` (line numbers below refer to this file) |
| Polymath15, arXiv 1904.12438v2, "P15" | `tmp/b145-C-refA/polymath.txt` |
| Platt–Trudgian, Bull. LMS 53 (2021), Theorem 1, "PT" | cited (no local copy; ordinate 3000175332800 as cited by Raymond and on the ledger) |
| wall producer (AF §3) | `tmp/s145-1-g1/base/code/certify_anchor.py`, certificate `tmp/s145-1-g1/out/WALL_X1_B.json` |
| Raymond's consumer and joint-floor producer | `tmp/s145-1-g1/code/assemble_joint.py`, `tmp/s145-1-g1/pipeline.py` (`joint_tables`, `integrate`) |
| 7/8 replays | `tmp/oai-lambda-raymond.py`, `tmp/oai-lambda-routeP.py` |
| project write-ups | `joint-pair-arbitrary-shift.md` (Theorem 4′), `cg-monotonicity.md` (Lemma CG), `lemma-B-two-band.md` (Lemma B.3, Theorem BB) |

sha256 of the files read (first and last 8 hex digits):

| file | sha256 |
|---|---|
| `Analytic_Foundations.txt` | `a0f9ad3f…5713e67f` (same file as part B) |
| `Correlated_Translated_Probes.tex` | `c6f9e1b6…52f4cfe3` (same file as part B) |
| `polymath.txt` | `bb59a511…b1096062` |
| `WALL_X1_B.json` | `5054fae8…d2e5418a` |
| `certify_anchor.py` | `d388bb1d…20928eca` |
| `assemble_joint.py` | `3c5638e7…5c1b9485` |

Theorem numbering in the main paper. Lemmas and theorems share one counter: Theorem 1 (main result), Lemma 2 (surplus
decomposition), Lemma 3 (paired-phase lower bound), Theorem 4 (uniform two-probe improvement, eq. (10)). "Lemmas 2–4" on the
ledger (G0-c) means Lemma 2, Lemma 3 and Theorem 4. Theorem 4′ is the project's version for arbitrary shift intervals with the
Track A label families (`joint-pair-arbitrary-shift.md` §8). Part B calls the two-probe theorem "main Theorem 3" (§§0, 8, 11);
it is Theorem 4.

Grades.
* **SOUND**: re-derived at this reading depth; no defect found.
* **GAP**: the statement is true, but the written argument omits a step or lives only in code. Each GAP has a fix.
* **ERROR**: false as written. A counterexample would be given.

Evidence labels: **PROVED** (written derivation, internal), **CERTIFIED** (interval or exact computation), **CONDITIONAL**,
**MEASURED** (floating point or sampling), **HEURISTIC**. All numerical checks run for this review are MEASURED spot checks
in a second library (mpmath) or a second formula path (Arb), listed in §10.

---

## 0. Outcome

1. **No ERROR** in AF Part I §§2–5, in main-paper §§2–6 (eq. (1), Lemma 2, eq. (3), Lemma 3, eq. (5), eqs. (6)–(9),
   Theorem 4, eqs. (11)–(13)), in the self-pair algebra of main §§7–8 (eqs. (14)–(15)), or in Theorem 4′ (including the
   Track A head, tail and reflected bins and Lemma R).
2. **GAPs**, all expository; none changes a number.
   * Known and still open in the deposit: 2a (head counting step; written as Lemma B.3, application 2), 3a (wall at t = 0),
     3b (wall error budget only in code).
   * New here: A1 (the wall's ideal model and its γ-phase θ0 + πtL/8 are not defined in the text; part of 3b; fix: Lemma W,
     §3), A2 (the passage from AF §§5, 8–9 to main eq. (1) is not written in either Raymond text; written in
     `joint-pair-arbitrary-shift.md` §2 and re-checked here), A3 (uniformity in x is asserted as "checked at X − 4,
     decreasing thereafter" without the per-term monotonicity; fix: the table in §8).
3. **The time-zero strip and the 7/8 start: VALID, CONDITIONAL on the 003 half-plane.** Reading AF §§2–5, main §§2–8 and the
   code, the strip enters in two roles only.
   * As a fact at every time t ∈ [0, 41/250], t = 0 included: the top edge |y| = 1 of the head cell (AF §2) and the
     boundedness used for compactness (AF §11, P15 Theorem 1.5). This is the classical strip with de Bruijn contraction.
     It is unconditional, stays true under the swap, and is not replaced.
   * As the time-zero bound under the barrier: q0 > 1 and the entry check on [0, 10⁻⁸] (AF §11, main §8, Part II §5;
     hard-coded as `> 1` in Raymond's `assemble_joint.integrate`). This role, and only this one, is replaced by
     q0 > (2θ − 1)² and the de Bruijn bound y² ≤ (2θ − 1)² − 2t. Part B §5 writes the replacement (Lemma S(θ), check S1);
     this review confirms it independently (§7).

   No step needs q0 ≥ 1, or the barrier to stay above the classical envelope 1 − 2t. AF §§3–5, Lemma 2, Lemma 3,
   Theorem 4 and Theorem 4′ read no zero location at all. AF §2 reads only the classical strip and PT, both unconditional
   and unchanged.
4. **Uniformity in x: SOUND** for every x ≥ X − 2, x → ∞ included.
   * Every x-dependent error term of AF §§4–5 is nonincreasing in x (per-term reasons in §8). Re-measured for all 608
     PLAN rows at x = X − 4, 10X, 10¹⁶ and 10²⁰: 0 violations.
   * The one-point masses are covered by six frequency rectangles, the last one infinite (AF §§6–9, G0-d). It needs
     k = t_L v0/2 − (1 − h)/2 > 0 (minimum 0.588 on PLAN) and h·v0 > 2 (minimum 9.28).
   * The joint floor is a minimum over all 11 pair classes, including the infinite row.
5. **RH below X: one use only.** PT Theorem 1 for 0 < γ ≤ (X + 1)/2 is the initial condition of the head cell at t = 0
   (clearance 175,239,886 in γ).
   * No other step uses RH or a zero location. The only other inputs about zeros are the start bound (classical strip, or
     003) and the P15 theorems on zero dynamics.
   * The route-P single-band 7/8 run reads floors built at X1 = 6000000185827 only (Track A `TABLES_NEW`, r2 certificates
     with N0 = 690988, route-3 tables with X = 6000000185827). Its head wall is therefore Raymond's X1, and PT suffices
     there as well.
6. **Not covered by part A**: AF §§6–12 and Part II (part B), the producer numerics, route-P certificates (r2 floors and
   their L-slope lemma, route-3 Theorem MP kernels, campaign floors), the 003 proof, PT's computation.

| step | grade | evidence |
|---|---|---|
| AF §2 classical framework, PT clearance | SOUND | §2; C1 |
| AF §2 head localisation (every nonreal zero has \|Re z\| > X) | SOUND; GAP 2a (fixed in Lemma B.3) | §2 |
| AF §3 prefix certificate (3.1), time radius | SOUND (finite certificate, regenerated) | §3; WALL_X1_B |
| AF §3 ideal model, dephasing, Abel transfer | SOUND; GAP A1/3b | §3; C7b |
| AF §3 error budget, P15 Thm 1.3, floor > 3/4 | SOUND; GAPs 3a, 3b | §3; C2, C7 |
| AF §4.1 remainder for σ ∈ [−1, 2], y ≤ 2.41 | SOUND | §4; P15 re-read |
| AF §4.2 (4.6), (4.7) | SOUND | §4; C2, C3 |
| AF §5 (5.1)–(5.6), Cauchy step, leading-source replacement | SOUND; GAP A3 (uniformity bookkeeping) | §5, §8; C4, C5 |
| main eq. (1) = (OP3) | SOUND; GAP A2 (fixed in Theorem 4′ doc §2) | §6 |
| main Lemma 2, eq. (3) | SOUND | §6 |
| main Lemma 3, eq. (5) | SOUND | §6 |
| main eqs. (6)–(9), Theorem 4 | SOUND | §6 |
| main eqs. (11)–(13) | SOUND (uses Lemma CG, G0-a) | §6; C1 |
| main eqs. (14)–(15) self-pair algebra | SOUND | §6 |
| Theorem 4′ (Track A bins, Lemma R) | SOUND | §6; C6 |
| time-zero strip, 7/8 start | VALID, CONDITIONAL on 003 | §7; C8 |
| uniformity in x ≥ X − 2 | SOUND | §8; C1–C4 |
| RH below X | PT only, once | §9 |

---

## 1. Normalisation and cited theorems

* **Dictionary.** H_0(z) = ξ((1 + iz)/2)/8. For z = x + iy, s = (1 − y + ix)/2, so a zeta zero ρ = β + iγ is
  z = 2γ + i(1 − 2β): Re z = 2γ and |Im z| = |2β − 1|. The zeros of H_0 are exactly the nontrivial zeros of ζ (the
  factor ½s(s − 1)π^{−s/2}Γ(s/2) has no zeros in 0 < Re s < 1 and removes the pole and the trivial zeros).
* **Raymond's parameters.** X = 6000000185827, N0 = 690988, v0 = log N0, q0 = (1.000001)², q_e = 10⁻⁸; 608 cells of width
  1/4000 on [0, 19/125]; plan heights in [0.69, 2.18] (`tmp/s145-1-g1/data/PLAN.json`).
* **P15 results used** (statements checked against `polymath.txt`):
  * Prop. 3.1(i): zero dynamics at a simple zero, with the primed sum.
  * Prop. 3.1(ii): near a zero of order m ≥ 2, the zeros are z* + √2 (t − t*)^{1/2} λ_j + O(|t − t*|), with λ_j the
    (real, simple) roots of He_m. Forward in time the displacements are horizontal; backward they are vertical.
  * Thm 3.2 (= de Bruijn 1950, Thm 13): no zeros with y > y0 at time t0 implies none with
    y > max(y0² − 2(t − t0), 0)^{1/2} for t > t0. Stated for any t0 ∈ ℝ and y0 > 0.
  * Thm 1.3 on region (5): 0 < t ≤ 1/2, 0 ≤ y ≤ 1, x ≥ 200, with the bounds (20)–(24).
  * Thm 1.5(i): for 0 < t ≤ 1/2, every zero with x ≥ exp(C/t) is real. Here C is an absolute constant, used
    qualitatively.
  * Prop. 6.1: valid for every real σ, T > 10, 0 < t ≤ 1/2.
  * Expansion (39) and the form (60) of R_{t,N} with ε, δ, δ1–δ3, before the restriction 0 ≤ σ ≤ 1.
* **PT Theorem 1** (as cited): every zero with 0 < γ ≤ 3000175332800 has β = 1/2.
* **003**: ζ(s) ≠ 0 for 7/8 < Re s (Lean-checked locally on 2026-10-07; not refereed). With ξ(s) = ξ(1 − s), every zero
  has 1/8 ≤ β ≤ 7/8, so |Im z| ≤ 3/4. The bound is closed, since zeros on Re s = 7/8 are not excluded.

## 2. AF Part I §2: classical framework and the initial finite head (lines 144–167)

| # | AF statement | grade | check |
|---|---|---|---|
| 2.1 | "The classical zero strip at time zero is \|Im z\| ≤ 1." | SOUND | ζ ≠ 0 on Re s = 1 and the functional equation give the strict form \|Im z\| < 1. |
| 2.2 | "De Bruijn contraction [P, Thm 3.2] preserves this enclosing strip for t ≥ 0." | SOUND | Thm 3.2 with t0 = 0, y0 = 1 gives y² ≤ 1 − 2t. |
| 2.3 | "real and even, and H_t(iy) > 0" | SOUND | H_t(iy) = ∫ e^{tu²}Φ(u) cosh(yu) du. Each term of Φ is πn²e^{5u}(2πn²e^{4u} − 3) > 0 for u ≥ 0. |
| 2.4 | "[PT, Thm 1] proves RH through ordinate 3000175332800. The required ordinate is X/2. Clearance 175239886." | SOUND | Re z = 2γ, so the head \|x\| ≤ X needs γ ≤ X/2. 3000175332800 − 3000000092914 = 175239886 (C1). |
| 2.5 | "(2.1) \|H_t(X + iy)/B_t(X + iy)\| > 3/4 (0 ≤ t ≤ 41/250, 0 ≤ y ≤ 1)" | SOUND, see §3 | B_t = M_t((1 + y − iX)/2), and M_0, M_t are holomorphic and nonzero on ℂ \ (−∞, 1] (P15 (6)–(10)), which contains (1 + y − iX)/2. So (2.1) excludes zeros on x = X, 0 ≤ y ≤ 1; conjugation covers −1 ≤ y < 0, and evenness covers x = −X. |
| 2.6 | "every nonreal zero in this time range has \|Re z\| > X" | SOUND; **GAP 2a** | See below. |

**2.6 in detail.** Let K = [−X, X] × [−1, 1]. Its boundary has no zero for t ∈ [0, 41/250]:
* the vertical sides by (2.1) and evenness;
* the horizontal sides by 2.1–2.2 (|y| < 1 at t = 0, and |y| ≤ (1 − 2t)^{1/2} < 1 for t > 0).

At t = 0 every zero in int K is real by PT. Real zeros cannot leave the real axis forward in time:
* a simple real zero has a unique nearby branch, which equals its own conjugate;
* a real zero of order m ≥ 2 splits forward into m branches with distinct real leading terms √2 (t − t*)^{1/2} λ_j and
  errors O(t − t*), and conjugation maps each branch to itself.

A counting argument on the compact cell K then shows that int K contains no nonreal zero at any t ∈ [0, 41/250]. AF
states this in two sentences ("no zero can enter … A nonreal pair cannot be born inside it …"). The closed/forward-open
argument is not written there (GAP 2a). Fix: Lemma B.3, application 2 in `lemma-B-two-band.md` §4. That proof was re-read
here: the set S of good times is closed by Hurwitz, forward-open by Prop. 3.1(i)–(ii) on disjoint symmetric disks, and
t = 0 ∈ S. It needs no hypothesis on zeros outside K.

**Role of the strip in §2.** The strip is the top edge of K at every t ∈ [0, 41/250], t = 0 included. This is the
classical strip, which stays true under the 7/8 start. It is not the barrier's starting value, and nothing in §2 needs
q0 ≥ 1.

## 3. AF §3: the finite-head wall and the Abel transfer (lines 170–193)

**3.1 Prefix certificate (3.1).** For J ≤ N0 and centres t_j = 41(2j + 1)/2000, r_t = 41/2000, the certificate checks

  Σ_{n≤J} n^{−1/2} cos(X v_n/2 − θ0/2 − π t_j (L − 2v_n)/16) − r_t Σ_{n≤J} π(L − 2v_n)/(16√n) > 79/100.

* The four intervals [t_j − r_t, t_j + r_t] cover [0, 41/250] exactly.
* The time radius is a Lipschitz bound. The t-derivative of the cosine argument is −π(L − 2v)/16, so
  |cos(φ − πt(L − 2v)/16) − cos(φ − πt_j(L − 2v)/16)| ≤ |t − t_j| π(L − 2v)/16 per term, and the bound holds prefix-wise.
  This matches the code: `rate = π k/4`, k = (L − 2v)/4, `floor = sums − radius·D`.
* Stored certificate (lane B, 256 bit): 2,763,952 prefix checks. In each of the four time cells the minimum is at J = 1
  (0.80060, 0.86899, 0.89175, 0.86784). At J = 1 the sum is the single term
  cos(−θ0/2 − πt_jL/16) − r_t πL/16 with θ0 = −1.077088.
* Grade: **SOUND** as a finite interval certificate (regenerated twice by the project; independent prefix minima in b145
  referee A).

**3.2 Ideal model and dephasing (GAP A1, part of 3b).** The text says that "the ideal paired model, after dephasing and
multiplication by e^{yL/4}, has real part equal to twice this cosine sum weighted by w_t(v)", but it never defines the model.

**Lemma W (fix; PROVED here).** Let τ = X/2 + πt/8 and θ_I(t) = θ0 + πtL/8, and put

  F_I(t, y) = Σ_{n≤N0} n^{−1/2} e^{−tv(L−v)/4} [e^{−yv/2} e^{iτv} + e^{iθ_I(t)} e^{−y(L−v)/2} e^{−iτv}],  v = log n.

* (W1) Re[e^{yL/4} e^{−iθ_I(t)/2} F_I(t, y)] = 2 Σ_{n≤N0} n^{−1/2} w_t(v_n) cos(Xv_n/2 − θ0/2 − πt(L − 2v_n)/16), with
  w_t(v) = e^{−tv(L−v)/4} cosh(y(L − 2v)/4).
* (W2) For t ∈ [0, 41/250] and y ∈ [0, 1]: |F_I(t, y)| ≥ 0.79 (1 + e^{−yL/2}) ≥ 0.79.
* (W3) |f_{t,N0}(X + iy) − F_I(t, y)| ≤ 2√N0 [expm1(ε_s) + expm1(ε_s + ε_g)], where
  ε_s = t(5/X) log N0 /2 and ε_g = t(5/X)(L/2 + 1 + 5/(2X)) + (5 + t(L/2 + 1))/X.

Here f_{t,N} is AF (4.1) = P15 (14).

*Proof.*
* (W1) Multiply the bracket by e^{yL/4}e^{−iθ_I/2}. With k = (L − 2v)/4, the first term is e^{yk}e^{iψ} and the second
  e^{−yk}e^{−iψ}, where ψ = τv − θ_I/2 = Xv/2 − θ0/2 − πt(L − 2v)/16. The real part is 2 cosh(yk) cos ψ.
* (W2) Both factors of w_t are nonnegative and nonincreasing in v on [0, log N0], because log N0 < L/2 (C1). Abel
  summation with all prefix sums > 0.79 (3.1) gives a weighted sum ≥ 0.79 w_t(0) = 0.79 cosh(yL/4). Then
  |F_I| ≥ e^{−yL/4}·2·0.79 cosh(yL/4).
* (W3)
  * First branch: |n^{−s_U} − n^{−s_U⁰}| ≤ |n^{−s_U⁰}| expm1(|s_U − s_U⁰| log n), and
    s_U − s_U⁰ = (t/2)(α(a) − (L/2 − iπ/4)).
  * For σ ∈ [0, 1], |α(σ ∓ iX/2) − (L/2 ∓ iπ/4)| ≤ (3 + σ)/X + O(X⁻²) ≤ 5/X: the terms 1/(2s) and 1/(s − 1) give
    3/X, and the argument of s gives σ/X. Measured sup 4.0/X (C2).
  * Second branch: log(γ/γ_I) has two parts.
    * The phase drift of γ(X, t, 0): θ(t) − θ0 − πtL/8 = −(t/2)·Im[2e(L/2 − iπ/4) + e²], with |e| ≤ 5/X.
    * The height shift: ∫_0^y |∂_y log γ + L/2| dy′ ≤ |α − lead| + (t/2)|α||α′| ≤ (5 + t(L/2 + 1))/X.
  * The ideal amplitudes are ≤ n^{−1/2}, and Σ_{n≤N0} n^{−1/2} ≤ 2√N0.

Then P15 Thm 1.3 (region (5)) gives |H_t/B_t − f| ≤ eA + eB + eC,0, with the code's majorants:
* (23) with (e^z − 1) ≤ 2z for z < 1/2, |γ| N^{|κ|} n^y ≤ e^{0.021} and b_n^t n^{−Re s*} ≤ 1.000001·n^{−1/2};
* (24) with y ≤ 1, 3^y + 3^{−y} ≤ 10/3 and 10.44 → 10.5.

So |H_t/B_t| ≥ 0.79 − model − eAB − eC,0. ∎

The stored values are model 8.38·10⁻⁹, eAB 2.06·10⁻⁹ and eC,0 = 1.2030·10⁻³, so the floor is 0.788797 > 3/4. C7 (9 grid
points) and C7b (20 grid points) check W1, W3 and the Abel consequence (§10).

**3.3 t = 0 (GAP 3a).** Region (5) requires t > 0. The bound at t = 0 follows by continuity in t of H_t, B_t and the
finite sum f (N(X, t) = N0 on [0, 41/250], C1). The floor margin 0.0388 makes the limit strict. Grade: SOUND with a
one-sentence fix.

**3.4 State.** "The actual state remains N0 for all 0 ≤ t ≤ 41/250": √(X/4π) ≥ N0 and √(X/4π + (41/250)/16) = 690988.3096
< N0 + 1 (C1). **SOUND.**

**Role of the strip in §3.** None. The y-range [0, 1] is the side of the head cell from §2.

## 4. AF §4: source conventions and the larger-height approximation (lines 196–289)

| # | AF statement | grade | check |
|---|---|---|---|
| 4.1 | domains: 0 ≤ t ≤ 19/125, x ≥ X − 2, heights 0.69–2.18; radius-0.01 disks in x ≥ X − 4, 0.54 ≤ y ≤ 2.41; Re a, Re b ∈ [−1, 2] | SOUND | Re a = (1 + y)/2 ∈ [0.77, 1.705], Re b = (1 − y)/2 ∈ [−0.705, 0.23]. |
| 4.2 | "[P, 1.3] by itself does not cover the whole height range" | SOUND | Region (5) has y ≤ 1. |
| 4.3 | (4.2): the all-σ form of P15 (60) | SOUND | See below. |
| 4.4 | (4.3): ε ≤ e^{(8 + t + 5/6)/(V − 6)} − 1 | SOUND | P15: ε ≤ exp((2σ² + t + 5/6)/(T − 6)) − 1 for all σ, and 2σ² ≤ 8. |
| 4.5 | (4.3): δ1 ≤ 0.2 G_2(log 9)/(N0 − 0.865), δ2 ≤ 0.029 G_{−1}(−log 2)/(N0 − 0.353) | SOUND | G_σ(c) re-derived as the exact Gaussian integral. Its exponent is a convex quadratic in σ, so the maximum over [−1, 2] is at an endpoint: σ = 2 for c = log 9, σ = −1 for c = −log 2. Also a = √(x/4π + t/16) ≥ N0. |
| 4.6 | (4.4): δ3 < 10⁻¹⁰⁰ for σ ≥ −1 | SOUND | Re-derived (below). |
| 4.7 | (4.5): \|R_{t,N}(σ + iV)\| < e^{tπ²/64}\|M0(iV′)\| | SOUND | \|C0\| ≤ 1/2 (P15 (58)) and ε/2 + δ1 + δ2 + 10⁻¹⁰⁰ < 10⁻³. Row maximum 2.83·10⁻⁵ (C4). |
| 4.8 | "At t = 0 … by the limit … or directly from the expansion" | SOUND | Not needed by the chain: source floors are used only at t ≥ 10⁻⁸ (§7). |
| 4.9 | (4.6): \|α(σ ± ix/2) − (L/2 ± iπ/4)\| < 10/x, \|α′\| < 2/x on −1 ≤ σ ≤ 2, x ≥ X − 4; \|α\| < L/2 + 1 | SOUND | Bound (3 + \|σ\|)/x + O(x⁻²). Measured sup x\|α − lead\| = 5.0 and x\|α′\| = 1.0 at x = X − 4, 10X, 10¹⁶, 10²⁰ (C2). |
| 4.10 | \|M0(iV)\| decreases in V | SOUND | d/dV log\|M0(iV)\| = −Im α(iV) = −(π/4 − 1/(2V) − V/(1 + V²)) < 0. |
| 4.11 | (4.7): e_C^broad < 4 exp[−(1 + y)L/4 − tL²/16 + 1/10] | SOUND | Re-derived (below). Measured ratio 0.4524 on a (x, y, t) grid incl. x = 10²⁰ (C3). |

**4.3 in detail (the σ-extension).** P15's proof of Prop. 6.3 (lines 1260–1700) uses 0 ≤ σ ≤ 1 only in simplifications
made after exact formulas valid for every real σ:
* the bound 2σ² + t + 5/6 ≤ 10/3 behind (61), for ε;
* the chain after (65) that turns the exact Gaussian forms of δ1 and δ2 into the constants 0.366·9^σ and 0.031·2^{−σ}
  (it uses (log 3 + σ/(T − 3))² ≤ … with 0 ≤ σ ≤ 1);
* the δ3 step "since σ ≥ 0, we may lower bound (u − σ)²/t by u²/t".

Every step before these holds for all real σ:
* the Taylor expansion of log M0 along a horizontal segment, using (43), which needs Im s > 3 on the segment;
* Lemma 5.1(v), since Im(s_v/2) ≥ 5;
* the bounds (62)–(63), which are proved for every real u with the choice of K̃_u;
* the definitions of ε and δ1–δ3 as Gaussian integrals.

AF handles each restricted step:
* it replaces the first by 2σ² ≤ 8;
* it avoids the second by keeping the exact Gaussian integrals G_σ(c) for δ1 and δ2 (with D = V − 3, the P15 integrand
  before (65));
* it redoes the third in (4.4).

Raymond's sentence "before the restriction 0 ≤ σ ≤ 1 is used to simplify constants" is therefore accurate. A reader has
to locate the three points; the list above does that.

**4.6 in detail.** The δ3 integrand is supported on u = −r with r ≥ V′/π − 4 (≈ 9.5·10¹¹ here, far above the 100 that
AF uses). With σ ≥ −1, (u − σ)² ≥ (r − 1)². For 0 < t ≤ 1/5 the function t^{−1/2}e^{−(r−1)²/t} increases in t (its
maximum is at t = 2(r − 1)² ≫ 1/5), so it is ≤ √5 e^{−5(r−1)²}. (The text file shows "5e"; the PDF has √5.) The other
factors are (1.1)^k Γ(k/2)/a^k ≤ (1.1e/a)^k ≪ 1 and at most r + 5 terms. The bound is very loose but correct.

**4.11 in detail.**
* |B_t(z)| = |M_0(a)| e^{(t/4) Re α(a)²}, with a = (1 + y − ix)/2.
* Integrating Re α ≥ L/2 − 10/x from Re = 0 to (1 + y)/2 gives |M_0(a)| ≥ |M_0(iV)| e^{(1+y)L/4 − O(1/x)}.
* Re α(a)² ≥ L²/4 − π²/16 − 2(10/x)(L/2 + 1).
* Both remainders are < e^{tπ²/64}|M_0(iV′)| ≤ e^{tπ²/64}|M_0(iV)|.

So e_C^broad ≤ 2e^{tπ²/32} e^{−(1+y)L/4 − tL²/16 + O(L/x)}. This is below the stated bound with a factor 2e^{0.1−0.05}.
The measured ratio, 0.4524 = ½e^{−0.1}, is smaller still: the factor e^{tπ²/32} is cancelled exactly by the decrease of
|M0(iV)| from V to V′ = V + πt/8, which AF does not use.

**Role of the strip in §4.** None. AF §4.1 ends with "No assumption about zero locations is used". Confirmed: (39) is an
identity for the heat-flowed ξ, and Props. 6.1–6.3 bound its terms.

## 5. AF §5: physical value and derivative errors (lines 296–352)

| # | AF statement | grade | check |
|---|---|---|---|
| 5.1 | (5.1) (1 + y_f)/2 + t_L L*/8 > 5/4 per row | SOUND | Minimum margin 0.0834 over 608 rows (C4). Nondecreasing in x. |
| 5.2 | first-branch amplitude ≤ 1.01·n^{−[(1+y_f)/2 + t_L L/8]} for log n ≤ L/2 + 10⁻¹² | SOUND | \|b_t(n)n^{−s_U}\| = n^{−(1+y)/2} e^{−tv(L−v)/4 + O(tv/x)}, and L − v ≥ L/2 − 10⁻¹². |
| 5.3 | reflected/first ratio ≤ n^y e^{−yL/2} × (source correction) | SOUND | \|γ\| ≈ e^{−yL/2} and \|n^{−s_V}\|/\|n^{−s_U}\| = n^y. The ratio is ≤ 1 for n ≤ e^{L/2}. |
| 5.4 | two-branch mass < 18; masses 6, 22, 180 | SOUND | ζ(5/4) = 4.5951, −ζ′(5/4) = 15.930, ζ″(5/4) = 127.99 (C5). Two branches: ≤ 2·1.01·4.60 = 9.3. |
| 5.5 | (5.2): e_AB < 18(e^d − 1) | SOUND | P15 Prop. 6.1 holds for all real σ, with \|α − log n\| ≤ L/2 + 1 for 0 ≤ log n ≤ L/2. The error per term times the mass. |
| 5.6 | "(log-powers)/x decrease beyond the anchor; (4.7) decreases in x, y, t" | SOUND; **GAP A3** | Per-term reasons in §8. 0 violations at x = 10X, 10¹⁶, 10²⁰ (C4). |
| 5.7 | frozen N on the radius-0.01 disk; at most one state boundary | SOUND | Boundaries are 8πN ≈ 1.74·10⁷ apart (C1). |
| 5.8 | (5.3): e_pair < 3 exp[−(1 + y_f)v0/2 − t_L v0²/4 + 10⁻⁵] | SOUND | The pair at index ≈ e^{L/2} has both branch amplitudes ≈ e^{−(1+y)v/2 − tv²/4}, decreasing in v ≥ v0. |
| 5.9 | (5.4): e_AB + e_C^broad + e_pair < 10⁻⁶ per row | SOUND | Row maximum 1.214·10⁻⁷ (row 480; C4). |
| 5.10 | Cauchy: derivative error < 10⁻⁴ | SOUND | H_t/B_t and the frozen-N model are holomorphic on the disk (B_t ≠ 0 there, no branch cut). A bound of 10⁻⁶ on the circle gives 10⁻⁶/0.01 at the centre. |
| 5.11 | (5.5): \|s_U − s_U⁰\|, \|s_V − s_V⁰\|, \|log(γ/γ0)\|, and their y-derivatives < ε_s = 100[1 + t_R(L + 1)]/x | SOUND | \|s_U − s_U⁰\| ≤ 5t/x. \|log(γ/γ0)\| ≤ 2.41(10 + t(L/2 + 1))/x. Generous. |
| 5.12 | (5.6) | SOUND | Row maxima 4.4·10⁻⁸ (value) and 9.1·10⁻⁶ (derivative) (C4). |
| 5.13 | totals 2·10⁻⁶ / 2·10⁻⁴; Re(β_t(a)/2) > L/4 − 10⁻⁶ | SOUND | ∂_h log\|B_t(x + ih)\| = Re β_t(a)/2 with β_t = (log M_t)′. |

**Role of the strip in §5.** None.

## 6. Main paper eq. (1), Lemma 2, Lemma 3, Theorem 4, and Theorem 4′

Theorem 4′ (`joint-pair-arbitrary-shift.md`) contains written proofs of Raymond's steps. Each step was re-derived here
from Raymond's text, without relying on that write-up, and compared with the code (`pipeline.joint_tables`, which mirrors
Raymond's `certify_joint`).

**6.1 Eq. (1) = (OP3) (GAP A2).** Main §2 says only that "the physical transfer in AF §§5 and 9 yields (1)". The derivation:
* E·H_t/B_t = Q + R with Q = E f⁰ and R = E e, where |R| ≤ R0 = 2·10⁻⁶ E_n and |∂_hR| ≤ R1 = 2·10⁻⁴E_n + 2·10⁻⁶E_y (AF (8.5)).
* Hence S = ∂_h log|B_t| + Re(∂_h(Q + R)/(Q + R)) − Re(∂_hE/E).
* Re(∂_hQ/Q) = H_C/(2|Q|²) − C/2, since ∂_hQ = −V/2.
* |∂_h(Q + R)/(Q + R) − ∂_hQ/Q| ≤ (R1 + B₊R0/(2g))/(g − R0), with g = 1 − A₊.

The result is (1) with ℓ = ⌊L_lower/4 − 10⁻⁶ − E_ℓ − C/2 − pert⌋. This matches `joint-pair-arbitrary-shift.md` §2 and
`validate_cells`. **SOUND.** The inputs A±, B₊, D₊, E_ℓ, E_n, E_y are AF §§6–9 (G0-d; part B §2).

**6.2 Lemma 2 (surplus identity).** Expand |Q|² = Σa_i² + 2Σ_{i<j}a_ia_j Re(z_iz̄_j) and
Re(VQ̄) = Σλ_ia_i² + Σ_{i<j}(λ_i + λ_j)a_ia_j Re(z_iz̄_j). Then
(1 + A)[C(1 + A) − B] = Σa_i²(C − λ_i) + Σ_{i<j}a_ia_j(2C − λ_i − λ_j).
The difference is H_C − (1 + A)[C(1 + A) − B] = Σ_{i<j} w_ij(1 − Re z_iz̄_j). For w < 0, w(1 − Re) = −2|w| + |w|(1 + Re).
**SOUND.**

**6.3 Eq. (3) and the selection.**
* If (1 + A)[C(1 + A) − B] − D_C ≥ 0, any subset of the surplus terms is ≤ H_C.
* 0 < 1 − A₊ ≤ |Q| ≤ 1 + A₊, so the quotient bound with 2(1 + A₊)² is valid pointwise.
* The cone premise at the actual point follows from the rectangle certificate: (1 + A)[C(1 + A) − B₊] increases in A
  on [A₋, ∞) once it is positive at A₋, and D_C ≤ D₊.

**SOUND.**

**6.4 Lemma 3 and eq. (5).**
* Re(zu) + Re(zū) = 2 Re z Re u, so the average is ≥ c0(1 − ε Re z Re u) ≥ c0(1 − |Re u|).
* Eq. (5): z_n(x ± a) = e^{i((x±a)/2 + πt/8) log n} = z_n(x) e^{±ia log n/2}. This is exact, and independent of the
  truncations N(x ± a), because n ≤ 1024 ≤ N0 ≤ N(x ± a).

**SOUND.**

**6.5 Eqs. (6)–(7).**
* g_{jk,n} > 0 forces the same sign of w_{0n} at both points, so the same ε.
* |w^∓_{0n}| = a_n(x∓)|log n − 2C_{j|k}| ≥ a̲_{j|k,n}·g_{jk,n}.
* Code: `gaps` uses `loglo` for log n − 2C_max and `loghi` for 2C_min − log n, both in the lower-bound direction.
* The attenuation returns 0 when the shift interval contains a multiple of π, and otherwise
  1 − max(|cos lo|, |cos hi|).

**SOUND.**

**6.6 Eqs. (8)–(9).**
* With ρ_p = b_t(p)p^{−σ_U} < 1 and ϑ_p = τ log p: log E = −Σ_pΣ_r ρ_p^r e^{irϑ_p}/r, ∂_hρ_p^r = −(r/2) log p ρ_p^r, and
  Re(E_h/E) = ½Σ_p log p Σ_r ρ_p^r cos rϑ_p.
* E_ℓ ≥ ½Σ log p ρ_p/(1 − ρ_p) (AF §9, evaluated where ρ_p is largest: t_L, L_lo).
* Dropping the harmonics r > 8 is valid, since each is ≥ 0.
* (T3) gives the shift e^{±ira log p/2}.

**SOUND.**

**6.7 Theorem 4 (eq. (10)).** At x∓ apply (1) with the constants of R_j and R_k. Average, and add the two retained
addends. They are separate addends of (1), so the gains come from disjoint resources. **SOUND.**

**6.8 Eqs. (11)–(13).**
* (11) uses c_n(t) ≥ c_n(t_L) ≥ 0 (Lemma CG, G0-a; `cg-monotonicity.md` re-read: the covering identity is a three-step
  Möbius computation, correct) and n^{−σ_U} ≥ n^{−σ_j}.
* (12): ρ_p decreases in t and in L > log p.
* (13): x₊ − x₋ < 4, against a smallest finite rectangle width of 6.31·10¹¹ (C1), and s(x₊) − s(x₋) ≤ a/x₋ < 2/(X − 2) <
  1/20. Only (j, j) and (j, j + 1) occur. The code takes the minimum over the 11 classes, and the infinite row (j = 5)
  gets zero gains and keeps its full one-point floor.

**SOUND.**

**6.9 Eqs. (14)–(15) (self pair).** K_h(a, y) = 2h(a² + h² − y²)/((a² + h² − y²)² + 4a²y²). Re-derived: the numerator is
2h(a² + h² − y²) and the denominator (a² + h² + y²)² − 4h²y². On the sharp law a² = (h² − q)/3 this equals 6/(h(4 − q/h²)).
The derivation of (15) from P15 Prop. 3.1(i):
* ẏ = −1/y − 2Σ_{pairs} K_y(d, b);
* sum (10.1) over the other pairs;
* use the probe identity S = Σ_{pairs} K_h, which is absolutely convergent since K ≲ 2h/d²;
* subtract the own pair, which is exactly K_h(a, y).

**SOUND.** Kernel certificates (10.1) and caps are part B §3.

**6.10 Theorem 4′.**
* Head bins n ∈ [n1, n2] ⊂ [1025, N0]: gap log n1 − 2C_max > 0, since 2C < 6.8 < log 1025. The per-label coefficient bound
  C_g(n1, t_L) (Lemma CG, CG5) times a factor common to the bin, so the minimum over (j, k) commutes with the sum over
  the bin.
* Tail bins: the sign μ(d) is common to both points (T2).
* Reflected bins:
  * phase z^c e^{±iφ} with φ = θ_R + (a/2)(log d − log n), θ_R = (Φ(x + a) − Φ(x − a))/2 on a continuous branch of
    Φ = arg γ(·, t, 0);
  * Lemma R: Φ′ = Re β_t((1 + iξ)/2) and |Re β_t − L/2| ≤ (10 + t(L/2 + 1))/ξ;
  * ε_R ≤ 4.29·10⁻¹² at X1 for every a < 2 (C6), against the code allowance 10⁻⁹;
  * the amplitude bound (L5) takes the minimum over the bin endpoints of n^{−(σ_j − h)}, which is correct for either sign
    of σ_j − h.

**SOUND.**

**Role of the strip in §6.** None. Lemma 2, Lemma 3, Theorem 4 and Theorem 4′ are statements about S(x ± a, h, t) for
x ≥ X − 2 + a. They contain no zero location, no q and no q0.

## 7. Focus 1: the time-zero strip and the start q0 = (2θ − 1)² + 2·10⁻⁶

**7.1 Inventory of every occurrence** (AF, main paper, Part II, Raymond's code, the replays).

| place | statement | strip role | under 7/8 |
|---|---|---|---|
| AF §1 l. 126, main §8 l. 520 | q0 = (1.000001)² > 1 | start | replaced: q0 = 9/16 + 2·10⁻⁶ |
| AF §2 l. 145–146, 164 | head cell K = [−X, X] × [−1, 1]; "outer classical strip" | top edge, every t ∈ [0, 41/250] | unchanged; unconditional |
| AF §3 | wall on 0 ≤ y ≤ 1 | side of K | unchanged |
| AF §§4–5 | approximation and errors | none ("no assumption about zero locations") | unchanged |
| AF §§6–9 | one-point cone | none (part B §2) | unchanged |
| AF §10, main §8 | kernels for 0 < y ≤ ρh, 0 ≤ b ≤ y; caps on [0, V] | none. Upper limits on the barrier height only | a lower barrier stays inside every domain |
| main §§3–6, Theorem 4/4′ | joint floor at x ± a | none | unchanged |
| AF §11 l. 703–704, main §8 l. 531–532, Part II §5 l. 1070–1071 | "starts at q0 > 1"; "keeps it above one for at least 10⁻⁸"; "initial separation from the classical strip" | time-zero bound under the barrier | **replaced** by Lemma S(θ) + S1 (part B §5) |
| AF §11 l. 706–707 | compactness via P15 Thm 1.5(i) for t ≥ 10⁻⁸; boundedness of y | strip at every t (\|y\| ≤ 1) | unchanged; unconditional |
| AF §12 | q_e/2 | de Bruijn at T*, not at 0 | unchanged (part B §6) |
| `assemble_joint.integrate` | `require(q-(2+rate*q)*F(1,10**8)>1, 'strict time-zero entry')` | entry guard hard-coded to 1 | replaced: S1 with qbound = 9/16 in `oai-lambda-raymond.py` (both integrators) and `oai-lambda-routeP.py` (0 failures) |
| `pipeline.integrate` | (no entry guard) | — | the 7/8 replay adds S1 and S2 |
| `pipeline.integrate`, sharp mode | `0 < v < 1 and 29v² − v − 1 ≤ 0` | Part II Thm 1 domain y < h | not the strip |
| route-P consumer E5 (`sharp-r2`) | q ∈ [q_lo, q_hi] | a lower limit on q | enforced per step by `pick`; unused on the 7/8 path; part B GAP B3 |
| route-P consumer E8 | q0 > q_MTY(x_L) | band-1 start | replaced by q0 > (2θ − 1)² |

**7.2 Why the replacement is valid.**
* Under 003, every zero of H_0 has y² ≤ 9/16 (§1).
* P15 Thm 3.2 with t0 = 0, y0 = 3/4 gives y² ≤ 9/16 − 2t for t > 0, uniformly in x.
* On the first substep the barrier is B(t) = (q0 + 2/c0)e^{−c0t} − 2/c0, which is convex, so B(t) ≥ q0 − (2 + c0q0)t.
* S1, q0 − (2 + c0q0)·10⁻⁸ > 9/16, therefore keeps every zero strictly below B on [0, 10⁻⁸], with no compactness
  argument.
* From t = 10⁻⁸ on, the first-contact argument (AF §11; written as Theorem BB Steps 2–5 and as part B Lemma FB(θ)) uses:
  * P15 Thm 1.5(i) for t ≥ 10⁻⁸ and |y| ≤ 1, for compactness;
  * Hurwitz, for closedness;
  * Prop. 3.1(ii) backward, for multiple contacts;
  * Prop. 3.1(i), (10.1), Theorem 4 and the self cap, for simple contacts;
  * the head localisation (§2), for x* > X and for b ≤ y* of the head zeros, which are real.

  None of these reads q0. The single unbounded cell x > X has no far class, so H2 and the window are not needed. Every
  zero outside the head is in the cell or is its mirror image.
* Theorem BB Remark 3 (`lemma-B-two-band.md`) notes that q0 > (bound) plus continuity of B on the first substep already
  suffices; S1 makes τ0 = 10⁻⁸ explicit.

**7.3 Numbers.** C8 (`tmp/g0a-review-entry.py`) recomputes the entry step through the regenerated consumer's own option
generator. The values are identical to part B's independently coded `entry.py`:

| start | qb | first-substep kernel | c0 | S1 margin | B > qb until |
|---|---|---|---|---|---|
| strip θ = 1 | 1 | r = 19/40, λ = 2, ρ = 23/50 | 10.073292 | 1.879268·10⁻⁶ | 1.657·10⁻⁷ |
| 11/12 | 25/36 | sharp | 10.152594 | 1.909496·10⁻⁶ | 2.210·10⁻⁷ |
| **7/8** | **9/16** | **r = 23/40, λ = 199/100, ρ = 7/20 (v0 = 0.11836 ≤ ρ² = 0.1225)** | **10.195272** | **1.922651·10⁻⁶** | **2.586·10⁻⁷** |

* For θ < 1 the barrier starts below 1 and falls faster than the classical envelope 1 − 2t (B′ = −2 − cB < −2). So
  B(t) < 1 − 2t on the whole run up to the terminal time 0.1185, and the classical strip never keeps zeros under the
  barrier. The chain relies on 003 for that, and it uses 003 only on [0, 10⁻⁸].
* After 10⁻⁸ the invariant "every zero is below B" is propagated by first contact.

**Verdict, focus 1: VALID, CONDITIONAL on 003.** The substitution touches exactly the start and its entry check. Nothing
else in the chain uses the strip as the barrier's starting value. The other uses of the strip are unconditional and
unchanged:
* the head cell's edge, at every t ∈ [0, 41/250] including t = 0;
* the boundedness used for compactness at t ≥ 10⁻⁸. Written-text GAP: part B B1 (AF/main/Part II say "> 1"); fix: part B
Lemma S(θ) and Lemma FB(θ), confirmed here.

## 8. Focus 2: uniformity in x ≥ X − 2 (GAP A3 fix)

The source theorem must hold for every x ≥ X − 2 (contact at any x > X, shift a < 2) and every t in the cell. The
producer evaluates each premise at one abscissa. The table lists every x-dependent quantity, the direction in which it
moves as x grows, and why.

| quantity | where | direction as x grows | reason |
|---|---|---|---|
| N(x, t) = ⌊√(x/4π + t/16)⌋ ≥ N0 | AF (4.1) | nondecreasing | X − 4 − 4πN0² = 5,377,389 > 0 (C1) |
| s(x) = L/2 − v0 in one of [0, 1/20], …, [2, ∞) | AF §7, main §5 | increasing, unbounded | the last rectangle is infinite; s(X − 2) = 4.48·10⁻⁷ > 0 |
| ε in (4.3) | AF §4.1 | ↓ | (8 + t + 5/6)/(V − 6) with V = x/2 |
| δ1, δ2 in (4.3) | AF §4.1 | ↓ | G_σ(c) decreases in D = V − 3 (each exponent term ∝ 1/D or 1/(1 − t/D), positive bracket); a − c ≥ N0 − c |
| δ3 | (4.4) | uniform | ≤ 10⁻¹⁰⁰ for every x ≥ X − 4 |
| (4.6) constants 10/x, 2/x | AF §4.2 | relative | the bound (3 + \|σ\|)/x holds for every x ≥ 100 |
| e_C^broad (4.7) | AF §4.2 | ↓ | exp(−(1 + y)L/4 − tL²/16), L = log(x/4π) |
| e_AB (5.2) | AF §5 | ↓ | d ∝ (L/2 + 1)²/(x/2 − 3.33), with derivative of sign (L/2 + 1)[(1/2 − 3.33/x) − (L/2 + 1)/2] < 0 for L > 0 |
| e_pair (5.3) | AF §5 | ↓ | uses v = log N(x) ≥ v0 in a decreasing exponential |
| masses 6/22/180 | (5.1) | ↓ | exponent (1 + y_f)/2 + t_L L/8 increases with L |
| ε_s (5.5)–(5.6) | AF §5 | ↓ | 100[1 + t(L + 1)]/x |
| A0, B0 masses; D_C | AF §7 | monotone in L | first-head amplitudes ↓; reflected λ·amplitude ↓ since h·v0 > 2 (min 9.28, C4); bounds at the rectangle's L-endpoints (G0-d) |
| activated labels N0 < n ≤ N(x) | AF §8 | count grows | envelopes (8.1)–(8.3); the infinite interval needs k > 0 (min 0.588 on PLAN, C4; G0-d minimum 0.458 over all 11 families) |
| E_ℓ, E_n, E_y | AF §9 | ↓ | ρ_p decreases in L; evaluated at (t_L, L_lo) |
| ∂_h log\|B_t\| ≥ L/4 − 10⁻⁶ | AF §5 | ↑ | the floor uses L_lo of the rectangle |
| pair-class coverage | main (13) | uniform | 2/(X − 2) = 3.3·10⁻¹³ < 1/20 |
| Lemma R ε_R | Theorem 4′ | ↓ | ≤ 4.29·10⁻¹² for x − a ≥ X − 2 (C6) |

* **Measured (C4).** All 608 PLAN rows were re-evaluated at x = X − 4, 10X, 10¹⁶ and 10²⁰. Row checks (5.1), (4.3),
  (5.4), (5.6), k > 0 and h·v0 > 2 hold at X − 4 with the margins in §5. Each term is nonincreasing along the four
  abscissas, with 0 violations.
* **Grade: SOUND.** GAP A3 (expository) is the absence of this table in AF.
* **Guard for re-planned heights.** The premises (5.1), (5.4) and k > 0 bind at small t:
  * at t_L = 0, (5.1) forces h > 1.51;
  * k > 0 forces h > 1 − t_L v0.

  Integration top action 3 (re-certify levers on the 7/8 path, heights at 0.9–0.94×) must re-run these checks on any new
  plan. The archive family `PROBE_kap_0_88` already has 2,847 rows with C = 17/5 and an open cone, which carry no valid
  floor (G0-d).
* **Route P (outside G0).**
  * Raymond's tables, the Track A tables (`make_tables`) and the route-3 tables (`routes-b2-r3-lib.py`) take the minimum
    over all 11 pair classes including the infinite row.
  * The r2 structured floors cover the frequency rows differently. They are certified on row 0 and extended to all
    s ≥ 0 by the "L-slope lemma with deficit" (`r2-floor-batch.py: slope_check`, a grid on s ∈ [0, 100] plus a bound for
    s ≥ 100 from the activation envelope on [100, ∞)).
  * That lemma is where route P's uniformity in x lives for the r2 floors. It is a route-P ledger item (r2-floors-base)
    and is not reviewed here.

## 9. Focus 3: use of RH below X

* **One use.** PT Theorem 1 at t = 0, as the initial condition of the head cell (Lemma B.3, application 2): every zero of
  H_0 with |Re z| < X is real.
  * The dictionary needs γ < X/2; Raymond uses (X + 1)/2 = 3000000092914.
  * Clearance to 3000175332800: 175,239,886 in γ, 350,479,773 in x.
* **No other use.**
  * The wall (AF §3) is a computation plus P15 Thm 1.3.
  * The source floors (AF §§4–9, main (1)–(13)) are RH-free estimates. The t = 0 ξ cross-check `check_timezero_xi.py`
    evaluates ξ′/ξ from ζ and digamma directly.
  * The first-contact argument uses the head reality (from PT through §2) only to place the contact at x* > X and to
    make every head zero have b = 0 ≤ y*.
  * The start uses a zero-free region (classical strip, or 003), not RH.
  * PT's range beyond X (up to x = 6.0003507·10¹²) is not used.
* **Under 003.** Nothing below X changes. 003 does not replace PT: it gives |Im z| ≤ 3/4 for head zeros, not reality, and
  the head cell needs reality at t = 0.
* **Route-P single band, 7/8.** All floor sources it reads are at floor height X1:
  * `/tmp/b145-A-archive/TABLES_NEW.json` (`b145-A-assemble.py`: S145_X = 6000000185827);
  * r2 certificates (`r2-floor-cert.py`: N0 = 690988);
  * route-3 tables `tab_A`, `tab_B`, `tab_cat8`, `tab_P`, `tab_X`, `tab_X2` (field X = 6000000185827).

  Its head wall is X1, so PT suffices and no RH beyond PT enters. A future single-band run on floors built at
  1.6X–2.6X would need RH up to that floor height's X/2 (the open RH-head item at 1.7X), or a band split with the window
  RH-win.
* **Outside this review.** PT's computation (Turing-step exposure "not determined" on the ledger) is used as a published
  theorem.

## 10. Adversarial attempts and numerical checks

**Attempted breaks (none succeeded).**
1. *Zeros at exactly y = 3/4 at t = 0 for x > X* (allowed by 003): q0 = 9/16 + 2·10⁻⁶ is strictly above. The window
   [0, 10⁻⁸] is handled by the uniform de Bruijn bound, not by compactness, so infinitely many zeros near y = 3/4 cause
   no attainment problem.
2. *A head zero off the line*: excluded at t = 0 by PT; it cannot appear later (2.6).
3. *A zero approaching the wall from the right while the barrier is low*: probes at x* − a ≥ X − 2 are in the source
   domain. The wall forbids crossing x = X for |y| ≤ 1.
4. *Contact at a knot, multiple contact, contact far out at small t*: left rate; Prop. 3.1(ii) backward; Thm 1.5(i) for
   t ≥ 10⁻⁸ and the uniform de Bruijn bound below 10⁻⁸.
5. *Another zero above the contact height when the kernel inequality is applied* (it would break (10.1), which needs
   b ≤ y): excluded by minimality of t*. Head zeros are real.
6. *Silent use of q ≤ 1*: every q-dependent guard is an upper limit on q, except the route-P windows (enforced, unused
   on the 7/8 path).
7. *x → ∞ in the source theorem*: every error term decreases (C4). The activated mass stays bounded only if k > 0. That
   holds on PLAN, but it is a real constraint on re-planned heights (§8).
8. *Wrong dephasing branch or sign of θ0 in the wall*: tested directly (C7b): the identity W1 and the model bound W3 hold
   at 20 grid points.

**Checks run for this review** (all MEASURED; outputs in `tmp/g0a-review-out/`):

| id | script | what | result |
|---|---|---|---|
| C1 | `tmp/g0a-review-checks.py` (mpmath, 50 digits) | PT clearance; N0; X − 4 − 4πN0²; N(X, t) = N0 on [0, 41/250]; rectangle widths; 2/(X − 2) | 175239886; 690988; 5,377,388.9; yes; min width 6.31·10¹¹; 3.3·10⁻¹³ |
| C2 | same | sup over σ of x\|α − lead\| and x\|α′\| at x = X − 4, 10X, 10¹⁶, 10²⁰ | 5.0 on [−1, 2] (claim < 10); 4.0 on [0, 1] (wall uses 5); 1.0 (claim < 2) |
| C3 | same | (4.7) normalised remainder ratio on 80 (x, y, t) points incl. x = 10²⁰ | max 0.4524 (≤ 1) |
| C4 | same | per-row premises, 608 rows, at four abscissas | 0 failures; 0 monotonicity violations; min (5.1) margin 0.0834; max (4.3) sum 2.83·10⁻⁵; max (5.4) 1.214·10⁻⁷; max (5.6) 4.4·10⁻⁸ / 9.1·10⁻⁶; min k 0.588; min h·v0 9.28 |
| C5 | same | ζ(5/4), −ζ′(5/4), ζ″(5/4) | 4.5951, 15.930, 127.99 (< 6, 22, 180) |
| C6 | same | Lemma R budget at X1, a < 2 | 4.29·10⁻¹² |
| C7 | `tmp/g0a-review-wall-direct.py` (Arb 128 bit) | \|f_{t,N0}(X + iy)\| and the P15 (23)–(24) budget at 9 (t, y) points | \|f\| − Abel bound ≥ 0.799; \|H_t/B_t\| ≥ 1.589 at the sampled points (\|f\| = 81.0 at t = y = 0: the wall abscissa sits where ζ is large) |
| C7b | `tmp/g0a-review-wall-ideal.py` (Arb 128 bit) | W1 identity, W3 model error vs bound, \|F_I\| vs Abel, 20 points (t ∈ {0, 0.03, 0.082, 0.12, 0.164}, y ∈ {0, 0.3, 0.75, 1}) | W1 holds to 3.9·10⁻²⁶ relative (rounding); \|f − F_I\| ≤ 4.12·10⁻¹² (at most 1.55·10⁻³ of the W3 bound; within the bound at all 20 points); \|F_I\| − Abel bound ≥ 0.799; min \|F_I\| = 1.589 (t = 0.164, y = 1) |
| C8 | `tmp/g0a-review-entry.py` (exact rationals through `pipeline.py`) | first-substep rate and S1 margin for θ = 1, 11/12, 7/8 | table in §7.3; identical to part B |

C7 is a weak test of conventions on its own: |f| is large at this X, so a wrong θ0 could pass it. C7b tests the
dephasing and the model error directly.

## 11. GAP list and fixes

| id | location | status | fix |
|---|---|---|---|
| 2a | AF §2 l. 163–167, counting step | known (b145); fixed in the project text | Lemma B.3, application 2 (`lemma-B-two-band.md` §4), re-read here |
| 3a | AF §3, t = 0 outside P15 region (5) | known; open in the deposit | one sentence: continuity of H_t, B_t, f at t = 0 and the margin 0.0388 (§3.3) |
| 3b | AF §3 error budget only in code | known; open in the deposit | Lemma W (W3) and the P15 (23)/(24) majorants (§3.2) |
| A1 | AF §3, ideal model undefined | new (part of 3b) | Lemma W: F_I and θ_I(t) = θ0 + πtL/8 (§3.2) |
| A2 | main §2, eq. (1) not derived in the deposit | new for the deposit; written in the project text | `joint-pair-arbitrary-shift.md` §2, re-checked (§6.1) |
| A3 | AF §5 l. 313–314, 349–350, uniformity in x | new | the table in §8 |
| B1 | AF §11 / main §8 / Part II §5, "q0 > 1" | part B | Lemma S(θ), S1 (part B §5), confirmed in §7 |

No ERROR. None of the GAPs changes a number.

## 12. What is established and what is not

**Established here (internal):**
* AF §§2–5, main eq. (1)–(15) as used, Lemma 2, Lemma 3, Theorem 4 and Theorem 4′ re-read line by line. No ERROR.
* The 7/8 start replaces only the time-zero bound under the barrier. No step in part A's sections needs q0 ≥ 1 or
  B(t) ≥ 1 − 2t. Their uses of the classical strip (the head cell, at every t including 0) and of PT are unconditional
  and unchanged.
* The source theorem is uniform in x ≥ X − 2 (and x → ∞) under per-row premises that hold on PLAN.
* RH is used below X once, through PT, at height (X + 1)/2.

**Not established here:**
* AF §§6–12 and Part II (part B; G0-d for §§6–9).
* The producer numerics and the floor tables (regenerated earlier; not re-run here).
* The route-P certificates: r2 floors and their L-slope lemma, the outer lemma, route-3 Theorem MP kernels, campaign
  floors.
* The 003 theorem beyond the local Lean build (no official comparator, no independent kernel replay, not peer-reviewed).
* PT's computation.
* Any non-project reading (G0-e).

**Values.**
* raymond78 = 0.118505710922701 and routeP78 = 0.117708313410954 remain CONDITIONAL values, not bounds. The
  conditions are 003, G0, PT, and for route P its ledger.
* G0 status:
  * AF §§2–5: b145 referee A, the r4 G0-d′ X-transfer and this pass;
  * G0-c: the s145 self-review, the Theorem 4′ write-up and this pass;
  * AF §§6–12 and Part II: G0-d and part B.

  All of these are internal; no non-project reader has checked any of them.
* PT Λ ≤ 0.2 stands. RH is open. NO QED.

## 13. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/g0a-review-checks.py tmp/g0a-review-out/checks.json            # C1-C6, ~1 s
.venv-arb/bin/python tmp/g0a-review-entry.py tmp/g0a-review-out/entry.json              # C8, <1 s
.venv-arb/bin/python tmp/g0a-review-wall-direct.py tmp/g0a-review-out/wall_direct.json  # C7, ~15 s
.venv-arb/bin/python tmp/g0a-review-wall-ideal.py tmp/g0a-review-out/wall_ideal.json   # C7b, ~1-2 min
# load-gated runners used during the session (they wait while the 1-min load average is >= 45):
tmp/g0a-review-run.sh ; tmp/g0a-review-run2.sh
```

Inputs:
* `tmp/s145-1-g1/data/PLAN.json` and `tmp/s145-1-g1/out/X1/TABLES.json`;
* `tmp/s145-1-g1/pipeline.py`, which reads `KERNELS.json` from `/tmp/raymond_pr/...`; if `/tmp` is cleared, use the
  identical copy `tmp/oai-lambda-out/KERNELS_raymond_backup.json`;
* the stored wall certificate `tmp/s145-1-g1/out/WALL_X1_B.json`.

All checks are single-process and light (< 0.3 GB). The route-1 campaign (`tmp/route1-campaign/`) was not touched.
