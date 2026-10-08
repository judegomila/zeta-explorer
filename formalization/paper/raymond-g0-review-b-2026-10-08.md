# Raymond G0 deep review, part B: AF Part I §§6–12 and Part II under the 7/8 start

Date: 2026-10-08 (work done 2026-10-07). Branch `editorial-redesign`, working files only (nothing committed).

Reviewed text: D. J. Raymond, *Analytic foundations for the time-zero upper-bound construction*, v1.0, 21 September 2026
(Zenodo 22867547), Part I §§6–12 and Part II §§0–8, with the consumer sections of the main paper (*Correlated translated
probes*, §§7–8, §11) where AF refers to them.

| file | sha256 |
|---|---|
| `tmp/raymond-22867547/Analytic_Foundations.pdf` | `fe06339d…ae53a9` |
| `tmp/raymond-22867547/Analytic_Foundations.txt` (text used for line references) | `a0f9ad3f…13e67f` |
| `tmp/raymond-22867547/Correlated_Translated_Probes.tex` | `c6f9e1b6…4cfe3` |
| `KERNELS.json` (Raymond parent; identical copy `tmp/oai-lambda-out/KERNELS_raymond_backup.json`) | `6c984a8d…77e1` |
| `tmp/s145-1-g1/data/PLAN.json` | `9a9e860d…0545` |
| `tmp/s145-1-g1/out/X1/TABLES.json` (joint floors at PT height) | `93906be0…5b7d` |
| Polymath15, arXiv 1904.12438v2 (`tmp/b145-C-refA/polymath.pdf`) | `60d0d2d3…5603` |

Grades:
* **SOUND**: the argument is complete as written for the use under the 7/8 start.
* **GAP**: the argument is correct in substance, but a step is missing, or is written only for the classical-strip start.
  Each GAP has a fix in section 9.
* **ERROR**: a false statement, or a step that fails.

Evidence labels:
* **PROVED**: written derivation in this document (internal; no non-project reader).
* **CERTIFIED**: own code in exact rational arithmetic.
* **MEASURED**: floating point or sampling.
* **CONDITIONAL**: an implication from named premises.

## 0. Outcome

1. **No ERROR found** in AF Part I §§6–12 or Part II, either as written for the strip start or as used with
   q0 = 9/16 + 2·10⁻⁶. Two items grade GAP (B1, B2; expository, fixes written here). One latent GAP concerns route P
   only (B3). All other items grade SOUND.
2. **What depends on q0.** One analytic step depends on the time-zero data: the start of the barrier and its strict
   entry (AF §11, lines 703–704; main §7; Part II §5). The time-zero input enters only through the bound (2θ − 1)² on
   Im(z)² at t = 0. Polymath Theorem 3.2, which is stated for a general y0 and any t0, propagates that bound.

   With θ = 7/8 the start is **sound in substance, CONDITIONAL on the 003 half-plane**. The exact strict-entry margin is
   q0 − (2 + c0·q0)·10⁻⁸ − 9/16 = **1.922651·10⁻⁶ > 0** (CERTIFIED). The AF text says "q0 > 1" and "above one", so as written
   it is **GAP B1** (expository). The fix, Lemma S(θ) plus S1, is written in §5 and §8.
3. **Terminal allowance.** q_e/2 does not depend on q0. It is Theorem 3.2 applied at t0 = T*, y0 = √q_e, together with
   the AF §§2–3 localisation at T*. **SOUND.** On the 7/8 path:
   * the terminal step sits in cell 474, substep 2;
   * the upper remaining time is 0.9214 of a substep (inside the cell);
   * z = 3.42·10⁻⁵ ∈ (0, 1);
   * U = 0.118505710922701 (primary), U_alt = 0.118505710922702 (Raymond's alternate log bound).

   Both constructions are valid upper bounds (§6).
4. **Shorter path** (cell 474 for Raymond's chain, 470 for route P, against 597 for the strip and about 580 for the
   route-P band path). **Nothing in §§6–12 or Part II refers to the last cell.**
   * Every path-dependent condition is an upper-bound condition on q: kernel admissibility v ≤ ρ², sharp-law v ≤ v*,
     and self-pair caps that are nondecreasing in V. A lower path can only satisfy them more easily.
   * All of them were re-checked substep by substep on the 7/8 path (§7 table): 0 failures. The tightest margin is
     ρ² − v = 3.79·10⁻⁶, at the first selection of kernel 5 (exact rational check).
5. **§§6–9 (one-point input, block enclosures, E_ℓ cap, exceptional pairs)** contain no zero-location input, no q and no
   path. They are statements per time cell and frequency row. **SOUND.** Nothing beyond G0-d's eight expository gaps
   g1–g8 was found. The 7/8 path reads cells 0–474 of tables that G0-d certified for all 608 cells.
6. **Dependency reduction under 7/8.**
   * Raymond's 7/8 chain uses only catalogue kernels 4 (r = 23/40, ρ = 7/20, λ = 199/100; 51,614 substeps) and 5
     (r = 3/5, ρ = 1/5, λ = 199/100; 9,061 substeps).
   * Kernel 4 always uses its global cap M_r. Kernel 5 uses the cap 25/17 = s_r(0).
   * The sharp continuum law (Part II) is used on **0** substeps, in both 7/8 values (Raymond and route P). The
     V-dependent ("attained-height") caps of AF §10 are also not used on the Raymond 7/8 path.
   * So Part II is **not a premise** of the 7/8 values. It remains a premise of the strip and 11/12 values.
7. **New certificates (CERTIFIED, own code):**
   * the kernel inequality (10.1) for all 13 catalogue kernels, and for the 5 route-3 rows on the route-P 7/8 path. Own
     derivation of the cleared numerator, own exact Bernstein/de Casteljau checker; the polynomial equals the kernel
     formula exactly at 400 random rational points per kernel;
   * every global self cap M_r, against the exact interior supremum (1 + √(1 + 1/r²))/2. Kernel 4's cap lies
     9.95·10⁻¹⁰ above it;
   * the Part II Theorem 1 identity and the self-pair closed form (sympy, exact);
   * a third independent replay of the 7/8, 11/12 and strip chains, bit-identical to the two existing implementations.
8. **Latent GAP (route P, not exercised by any current value; GAP B3).** AF §11 runs the first-contact argument on the
   *continuous ideal* barrier, which lies below the stored enclosures. That is valid because every rate-validity
   condition in Raymond's chain is an upper bound on q. The route-P `sharp-r2` floors are valid only on a window
   q ∈ [q_lo, q_hi], so they also need a *lower* bound, and the E5 check tests the *stored* trajectory.
   * If windows are re-placed on the 7/8 path (integration top action 3), the barrier lemma must be stated for the
     stored barrier: it jumps upward at knots, and the argument takes it left-continuous. This is written in §4.2 and §8.
   * Today 0 window substeps are used: route-P 7/8, 11/12 and strip all record `window_min_margin = null`.
9. Scope: this review moves no Λ value.
   * Every value remains CONDITIONAL on the 003 half-plane (Lean-checked locally, not peer-reviewed), on the rest of G0
     (AF §§2–5 in part A, main-paper Lemmas 2–4 / Theorem 3 = G0-c) and on PT.
   * This is an internal pass. No non-project reader has checked it.
   * PT Λ ≤ 0.2 stands. RH open. NO QED.

| item | q0-dependent? | path / end-cell dependent? | grade | main evidence |
|---|---|---|---|---|
| §6 identity (6.1), cone lemma | no | no | SOUND | §2.1; re-derived |
| §6 product head ≥ 0, (6.3), Q_y = −V/2 | no | no | SOUND | §2.2; = Lemma CG (G0-a) |
| §6/§9 exceptional pairs | no | no | SOUND | §2.3 |
| §7 time variation, block enclosures | no | no | SOUND | §2.4 |
| §8 activation (incl. t = 0) | no | uses cell 0 (h = 2.18): k = 0.59 > 0 | SOUND | §2.5 |
| §9 assembly, (9.1), E_ℓ cap, (9.2) | no | no | SOUND | §2.6 |
| §10 kernels (10.1) | no | which kernels are admissible | SOUND | §3; 13/13 certified (own code) |
| §10 self caps M_r, M_{r,V} | no | V = q_upper/h², monotone | SOUND | §3.2; caps exact |
| §11 zero dynamics, (11.1), selection | no | v ≤ ρ², V; monotone | SOUND | §4.1 |
| §11 ideal barrier, knots | no | upper-bound conditions only | SOUND (route-P windows: latent GAP B3) | §4.2 |
| §11 start, strict entry | **yes** | first substep | **GAP B1** (text says "> 1"); fixed by Lemma S(θ); substance sound, CONDITIONAL on 003 | §5 |
| §11 compactness, Hermite splitting, contact | no | no | **GAP B2** (b145 GAP-1/2/4 unwritten); written in Lemma FB; substance sound | §4.3 |
| §12 exponential and log enclosures, terminal, q_e/2 | no (q_e/2) | terminal cell 474 | SOUND | §6 |
| final barrier lemma (main §7 + §11 + AF §12) | via start only | yes | **GAP B2** (not written in AF); written here as Lemma FB(θ) | §8 |
| Part II Thm 1, self pair, §4 coupling | no | admissibility v ≤ v* | SOUND; **unused** on the 7/8 paths | §3.3 |
| Part II Thm 2, §7 | no | no | SOUND as stated; not premises | §3.3 |

---

## 1. Method and independence

* The AF text was read line by line, with Polymath15 (Prop. 3.1, Thms 1.5 and 3.2, Prop. 3.3, from the local copy).
  Each displayed claim was graded for (a) correctness and (b) dependence on q0 and on the path.
* Own code, in `tmp/g0-review-b-2026-10-08/`:
  * `replay.py`: the AF §§10–12 and Part II consumer, rewritten from the text in exact rationals. It imports none of
    `pipeline.py`, `oai-lambda-*.py` or `oai-lambda-ref-*.py`. Inputs are only PLAN, KERNELS and TABLES. It logs the
    margin of every path-dependent guard.
  * `entry.py`: first-substep rate, strict-entry margins and crossing times for the three starts. It reuses the s145
    pipeline's table loader and cap rule, so it is not independent. The 7/8 S1 margin it prints
    (1.922651·10⁻⁶) is reproduced exactly by `replay.py`, which is independent. `pipeline.py` reads `KERNELS.json`
    from `/tmp/raymond_pr`, which is not persistent.
  * `instr.py`: kernel switch points and the tightest guard on the 7/8 path.
  * `kerncert.py`, `kerncert2.py`: independent certificate of (10.1). Cleared numerator derived with sympy; exact
    Bernstein expansion and de Casteljau subdivision in `fractions.Fraction`; exact identity check against the kernel
    formula at 400 random rational points per kernel.
  * `capcheck.py`: exact check of the global self caps.
  * `part2.py`: Part II Theorem 1 identity, self-pair formula, v*, the out-of-range counterexample.
  * Output: `kerncert_out.json`.
* Common-mode exposure:
  * The floor tables (TABLES.json) are inputs. They are G0-c/G0-d content (main Theorem 3 on AF §§4–9 one-point rows)
    and are not re-derived here.
  * The Bernstein method class is the same as Raymond's (natural compactification D = z/(1 − z)). The derivation and
    the code are separate.
* Cost: every run is single-threaded, under 1 min and under 0.5 GB. The load average was 25 when the computations
  started and 174 when they ended; no further computation was started after that.

## 2. AF Part I §§6–9: the one-point input

These sections certify, for each time cell i (608 cells of width 1/4000, height h_i) and each frequency row j
(s = L/2 − v0 ∈ [0, 1/20], …, [2, ∞)), a lower bound S(x, h_i, t) > ℓ_ij for all x ≥ X − 2 in row j and all t in the
closed cell. No step uses where the zeros of H_t are, q, or the barrier. AF §4.1 says so explicitly ("No assumption about
zero locations is used"). The 7/8 start changes only which cells are read: cells 0–474, a subset of the 608 cells
G0-d certified in both lanes (252,320 comparisons, 0 failures).

### 2.1 §6 moment inequality (lines 360–378). SOUND, independent of q0 and path.

* Re-derived:
  * Σ_{i,j} a_i a_j (C − λ_i) Re(z_i z̄_j) − Σ_{i,j} a_i a_j (C − λ_j) = Σ_{i<j} a_i a_j (2C − λ_i − λ_j)(Re z_i z̄_j − 1);
  * each pair term is ≥ −2 a_i a_j (2C − λ_i − λ_j)₊;
  * if A < 1, then |Q| ≥ 1 − A > 0, so Re(V/Q) < C.
* "No independence ... of the phases is assumed": correct; the bound holds for every phase configuration.

### 2.2 §6 product head, (6.3), Q_y = −V/2 (lines 379–418). SOUND.

* Head nonnegativity (c_m ≥ 0 for m ≤ N0, nondecreasing in t) is Lemma CG (G0-a, internally refereed).
* (6.3) re-derived:
  * head Σ_{d|30} m_d d^{−σ} P_{⌊N0/d⌋} plus tail Σ_d |m_d| d^{−σ}(P_{N0} − P_{⌊N0/d⌋});
  * then m_d − |m_d| = −2|m_d|·[μ(d) < 0], and the constant is removed.
* Reflected frequencies λ = L − log n + log d ≥ v0 need L ≥ 2v0, that is s ≥ 0. G0-d certifies s(X − 2) = 4.48·10⁻⁷ > 0.
* Q_y = −V/2: every amplitude depends on y only through e^{−λ(y − h)/2}, and no phase depends on y.

### 2.3 §6/§9 exceptional pairs (lines 419–422, 585–588). SOUND.

* 2C < v0 puts every tail, reflected and activated label outside the exceptional set, since λ_i + λ_j ≥ v0 − 10⁻¹² > 2C.
* The remaining exceptions are head pairs (m, n) with mn < e^{2C} < e^{6.8} < 1024.
* With the stored C ∈ [0.509, 1.415] (G0-d), only constant–head pairs (1, n), n ≤ 16, occur.
* "Regenerated at the upper time endpoint, then weighted at the lower source abscissa": both directions follow from
  c_m nondecreasing in t (Lemma CG) and m^{−σ} nonincreasing in t and L.
* No q0 or path content.

### 2.4 §7 time variation and block enclosures (lines 425–481). SOUND.

* Amplitudes are c·e^{tκ} with −K_L ≤ κ ≤ 0, using L ≥ 2v0 and v_d ≤ log 30 < v0. So |A0″| ≤ K_L² A_abs(t_L, L) on the
  cell, and (7.1) is Taylor's formula at the midpoint.
* The time-Taylor bound is applied at the frequency endpoint that L-monotonicity selects:
  * upper bounds at L_lo, lower bounds at L_hi;
  * A0 and the weighted reflected mass decrease in L, using h·v0 > 2 (minimum over Raymond's plan 9.28; G0-d).

  So no bound on |A0′| is needed at interior L. The AF sentence "These facts license upper bounds at the left frequency
  endpoint and lower A0 bounds at the right endpoint" covers this.
* Block enclosures: per integer block, first-branch monotone, reflected convex (G0-d g2, expository).
* Cell-local; no q0 or path content.

### 2.5 §8 activation, including time zero (lines 484–571). SOUND.

* The only "time-zero" content is k = a0 − b > 0 at t_L = 0, which needs h > 1. Cell 0 has h = 109/50, so k = 0.59.
* Every path, including the 7/8 path, reads cell 0. The 7/8 start does not change this; the condition is on the plan.
* (8.4)–(8.5) use ℓ¹ coefficient norms (G0-d g3).

### 2.6 §9 assembly, (9.1), E_ℓ cap, (9.2) (lines 579–613). SOUND.

* Cone in A: g(A) = (1 + A)[C(1 + A) − B₊] − D_C is increasing on [A₋, ∞) once g(A₋) > 0.
* (9.1): (Q + R)_y/(Q + R) − Q_y/Q = (QR_y − Q_yR)/(Q(Q + R)), with |Q| ≥ g = 1 − A₊ and |Q + R| ≥ g − R0.
* E_ℓ: |∂_y log E| ≤ ½Σ_p log p·a_p/(1 − a_p), where a_p decreases in t and L (log p < L). So it is evaluated at
  (t_L, L_lo) (G0-d g4).
* (9.2) follows from Re ∂_y log B_t = Re β_t(a)/2 > L/4 − 10⁻⁶ (AF §5 input).
* Per cell and row; no q0 or path content.

**Conclusion for §§6–9.** The 7/8 substitution leaves §§6–9 unchanged. Their grade stays with G0-d: written part
re-derived, numbers certified in both lanes, one internal referee pass, no non-project reader.

## 3. AF §10 and Part II: kernels and self-pair caps

### 3.1 (10.1), all 13 catalogue kernels. SOUND; independently CERTIFIED here.

* Scale h = 1, D = d², V = y², w = b²/y², B = Vw. Then K_c(d, b) = 2c(D + c² − B)/(D² + 2D(c² + B) + (c² − B)²).
* The inequality 2K_y ≥ λ y [K_1(d + r, b) + K_1(d − r, b)]/2 is equivalent to

  P := 4(D + V(1 − w))·Den − (λ/2)·Num·P_y ≥ 0,

  where:
  * P_y = D² + 2DV(1 + w) + V²(1 − w)²;
  * Den = E(d + r)E(d − r), with E(x) = x⁴ + 2x²(1 + B) + (1 − B)²;
  * Num = 2(d₊² + 1 − B)E(d₋) + 2(d₋² + 1 − B)E(d₊), with d± = d ± r.
* Den > 0 because B ≤ ρ² < 1. P_y > 0 except at D = 0 with w = 1 (the excluded singular location) or V = 0.
* Odd powers of d cancel, and P has degree (5, 5, 5) in (D, V, w); (4, 5, 4) when λ = 2.
* Compactification: D = z/(1 − z), V = ρ²p. The (1 − z)^deg factor makes the z-Bernstein coefficients the
  D-coefficients divided by binomials.

| kernel (r, ρ, λ) | leaves | zero coeffs in leaves | leading D-coefficient | PASS |
|---|---|---|---|---|
| 0 (1/2, 9/20, 2) | 3 | 10 | 1 | yes |
| 1 (21/40, 9/20, 199/100) | 4 | 11 | 1/50 | yes |
| 2 (1/2, 23/50, 197/100) | 4 | 11 | 3/50 | yes |
| 3 (9/20, 19/40, 19/10) | 3 | 11 | 1/5 | yes |
| **4 (23/40, 7/20, 199/100)** | 4 | 11 | 1/50 = 4 − 2λ | yes |
| **5 (3/5, 1/5, 199/100)** | 4 | 11 | 1/50 | yes |
| 6 (1/2, 9/20, 199/100) | 3 | 11 | 1/50 | yes |
| 7 (3/5, 7/20, 197/100) | 3 | 11 | 3/50 | yes |
| 8 (19/40, 23/50, 2) | 5 | 10 | 517/400 | yes |
| 9 (51/100, 9/20, 2) | 4 | 10 | 2197/2500 | yes |
| 10 (49/100, 91/200, 2) | 4 | 10 | 2797/2500 | yes |
| 11 (107/200, 7/20, 2) | 2 | 10 | 5653/10000 | yes |
| 12 (113/200, 1/5, 2) | 1 | 10 | 1693/10000 | yes |

* For λ < 2 the D⁵ coefficient is 4 − 2λ > 0; this is AF's far-spacing remark "λ ≤ 2". For λ = 2 it vanishes and the
  table lists the D⁴ coefficient at (V, w) = (0, 0).
* Zero Bernstein coefficients occur only where P vanishes on the box: the singular corner D = 0, w = 1, and the
  degenerate face V = 0 at D = 0. These are allowed (P ≥ 0, not P > 0).
* Sampled minima of the unscaled gap 2K_y − λy(…)/2 range from 2.8·10⁻¹³ (λ = 2 kernels, tight at infinity) to
  1.2·10⁻⁷ (MEASURED, information only).
* (10.1) is a universal inequality; it does not depend on q0 or the path. What depends on the path is which kernel is
  admissible (v ≤ ρ²). On the 7/8 path kernels 4 and 5 carry 100 % of the substeps, against 19 % on the strip path
  (9,472 + 5,161 of 76,491). This is why both were certified independently here. b145 had replayed Raymond's own checker
  only.

### 3.2 Self-pair caps (lines 650–664). SOUND; caps CERTIFIED exact.

* s_r(v) = 2(1 + a − v)/((1 + a − v)² + 4av), a = r². sign s_r′(v) = sign[(1 + a − v)² − 4a(1 + a)].
  * If 3a ≥ 1, s_r decreases, with cap s_r(0) = 2/(1 + a).
  * Otherwise, if the sign changes on [0, ρ²], the interior maximum is at v_m = 1 + a − 2√(a(1 + a)), with value
    (1 + √(1 + 1/a))/2 (PROVED: at v_m, w² = 4a(1 + a), so s = 1/(w − 2a)).
* Exact check (2M − 1)² ≥ 1 + 1/a for every catalogue M_r: all 13 hold.
  * M − sup lies between 2.5·10⁻¹⁰ and 2.9·10⁻⁹.
  * **Kernel 4: M = 1503067131/10⁹, sup = (1 + √2129/23)/2, M − sup = 9.95·10⁻¹⁰**, tight but valid.
  * Kernel 5: 3a = 27/25 ≥ 1, cap 25/17 = s(0), exact.
* The "attained-range" rule M_{r,V} = min(M_r, s_r(V)) when (1 + a − V)² ≥ 4a(1 + a) needs 1 + a − V > 0, which holds
  because V ≤ ρ² < 1. Then s_r is increasing on [0, V], and s_r(V) is nondecreasing in V. So a cap chosen at the stored
  (upper) V is valid at every lower contact height (needed in §4.2).
* On the 7/8 path the cap branches are: global 51,614, decreasing (s(0)) 9,061, V-dependent 0.

### 3.3 Part II. SOUND; not used on the 7/8 paths.

* **Theorem 1** (sharp law, λ = 2, a² = (h² − y²)/3, v ≤ v*). Independently verified (sympy, exact):
  * the cleared numerator equals (8/81)(V − 4)(V − 1)·Q(D, u, V), with Q as printed. The middle term is
    12(1 + V − 29V²), unsquared; the PDF text extraction garbles it;
  * every term of Q is ≥ 0 for 0 < V ≤ v* = (1 + √117)/58 = 0.2037354, because 72 − 180V > 0 and 1 + V − 29V² ≥ 0;
  * the prefactor is > 0 for 0 < V < 1;
  * the unsafe point (V, D, u) = (21/100, 4/5, 0) gives Q = −1967/3125 < 0.
* **§2 self pair**: K_h(a, y) = 6/(h(4 − v)) exactly (sympy).
* **§4 (7)**: q′ < −2 − (4q/h)(ℓ − 6/(h(4 − q/h²))). For q̄ with 29(q̄/h²)² − q̄/h² − 1 ≤ 0, every q ≤ q̄ is licensed and
  6/(h(4 − q/h²)) is increasing in q, so the cap at q̄ is valid at lower q. Monotone in the safe direction.
  * Main paper (14) uses one displacement interval [h√((1 − 51/250)/3), h/√3] ⊇ {a(y, h) : v ≤ v*}. So the sharp-mode
    joint floor is path-independent.
* **Theorem 2** (optimality) and **§7** (joint source) are not premises of any value. Theorem 2's proof (d⁻² and d⁻⁴
  matching, then Jensen with f_v decreasing and convex) is correct as stated.
* **Use under 7/8**: 0 substeps in Raymond's 7/8 chain and 0 in route-P 7/8 (no `sharp`, `sharp-r2` or `centre` modes).
  * In Raymond's chain the sharp mode is admissible at every substep (max v = 0.1186 < v*), but a catalogue kernel has
    the larger rate every time. At the first substep the rates are 10.1953 (kernel 4) and 10.1620 (sharp). There the
    sharp self term 6/(4 − v) ≈ 1.546 exceeds kernel 4's cap 1.503, and the sharp joint floor uses the wider
    conservative interval (14). This is an explanation from one substep (MEASURED), not a proof that sharp never wins.
  * So Part II drops out of both 7/8 values. It is still used by the 11/12 chain (31,955 substeps) and the strip chain
    (29,444).

## 4. AF §11: coupling and first contact

### 4.1 Zero dynamics and the rate (lines 667–692). SOUND; path-dependent only through monotone checks.

* Prop. 3.1(i): dz_j/dt = 2Σ′_{k≠j} 1/(z_j − z_k).
  * The own conjugate gives −1/y in y′, that is −2 in q′ = 2yy′.
  * A conjugate pair (x_k ± ib_k) gives −2K_y(d, b_k) in y′. A real zero gives −K_y(d, 0) (half-pair weight).
  * Regrouping from Polymath's ±k pairing to conjugate pairs is legitimate: the imaginary parts converge absolutely,
    with terms ~ 2y/d².
* S(x, h, t) = Σ_pairs K_h(d_j, b_j), own pair included. The own pair at displacement ±rh contributes K_h(rh, y) = s_r(v)/h
  (PROVED: numerator 2(r² + 1 − v), denominator (1 + r² − v)² + 4r²v).
* Summing (10.1) over the other pairs: 4yΣK_y ≥ (2λq/h)[avg S(x ± rh) − s_r(v)/h], hence (11.1).
* The inequality needs:
  * b_j ≤ y for every other zero. This holds because the contact zero is highest at first contact;
  * y ≤ ρh;
  * the source floor at x ± rh, which needs rh < 2 (7/8 path maximum h·r = 1.2535);
  * the joint average floor of main Theorem 3 (G0-c).
* Only "y ≤ ρh" and "V" depend on the path. Both are upper-bound conditions on q.

### 4.2 Ideal barrier, upper ceilings, knots (lines 700–704, 718). SOUND for Raymond's chain.

* The ideal barrier β solves β′ = −2 − c_k β on substep k, from β(0) = q0. The stored values q_k are upward enclosures.
  By induction β(t_k) ≤ q_k: the flow map q ↦ (q + 2/c)e^{−cδ} − 2/c is increasing, and e^{−cδ} is bounded above.
* Every validity condition of the rate c_k is an upper-bound condition: v ≤ ρ², v ≤ v*, cap ≥ sup_{[0,V]} s. So it holds
  at every contact height β(t) ≤ q_k.
* At a knot the left substep's rate applies, and the left cell's floor is valid on the closed cell (cells are closed and
  adjoining; checked in `replay.py`).
* The ideal barrier reaches q_e no later than the stored computation says.
* **Latent GAP B3 (route P only).** A floor valid only for q ∈ [q_lo, q_hi] (`sharp-r2`) needs a lower bound on the
  contact height. The continuous ideal barrier can lie below the stored trajectory that E5 checks. With windows, the
  argument must use the stored barrier:
  * piecewise exact solutions restarted at the rounded-up q_k, which jump upward at knots;
  * taken left-continuous, this barrier is lower semicontinuous, so the first-contact set is closed and a first contact
    at a knot uses the left substep. Lemma FB in §8 is written this way.

  No current value uses windows (`window_min_margin = null` in the route-P 7/8, 11/12 and strip runs). The ideal-versus-
  stored gap is at most (number of substeps)·2⁻⁹⁶ < 10⁻²⁴, so the gap is logical, not numerical.

### 4.3 Global first contact (lines 705–720). GAP B2 (expository); substance sound. The q0 content is in §5.

* Compactness after positive time: Polymath Theorem 1.5(i). For 0 < t ≤ 1/2 and an absolute constant C, x ≥ exp(C/t)
  and H_t(x + iy) = 0 imply y = 0.
  * On [10⁻⁸, T] the nonreal zeros lie in {|x| ≤ exp(10⁸C), |y| ≤ 1}, a compact set uniform in t.
  * By Hurwitz the set {t : some zero has y² ≥ β(t)} is closed. So the first contact t* is attained and t* > 10⁻⁸.
  * No numerical value of C is needed: the source floors hold for all x ≥ X − 2, the last frequency row being infinite.
* Contact location: AF §§2–3 localisation (nonreal zeros have |Re z| > X for t ≤ 41/250) and the symmetries
  z ↦ −z, z ↦ z̄ give WLOG x* > X, y* > 0. Then x* ± a ≥ X − 2, since a < 2.
* Multiple contact: Prop. 3.1(ii). For t = t* − ε, the branches are z* + i√(2ε)λ_j + O(ε), with real Hermite roots λ_j
  and λ_m > 0. One branch is above y* + c√ε, while β is Lipschitz near t* (√q is Lipschitz on q ≥ q_e). That
  contradicts first contact.
* Simple contact: the zero's left difference quotient gives q′(t*) ≥ β′(t*−) = −2 − c_k β(t*), contradicting (11.1).
* No zero is born off the real axis: forward in time a real multiple zero splits into real zeros (Prop. 3.1(ii) with
  (t − t0)^{1/2} real). So nonreal zeros at time t exist only by continuation from earlier times.
* The AF prose compresses these steps (b145 GAP-1, GAP-2, GAP-4; still unwritten in the deposit). They are written in
  Lemma FB (§8). **GAP B2** (expository).

## 5. The strict-entry argument with q0 = 9/16 + 2·10⁻⁶

**AF text (lines 703–704):** "The barrier starts at q0 > 1; an explicit first-cell check keeps it above one for at least
10⁻⁸ units of time." Main §7: "The initial strict margin is checked numerically, so compactness is used only after
positive time." Part II §5: "initial separation from the classical strip."

**Lemma S(θ) (PROVED here; CONDITIONAL on its hypothesis).** Let 1/2 ≤ θ ≤ 1 and suppose ζ(s) ≠ 0 for Re s > θ. Then every
zero of H_t, t ≥ 0, satisfies (Im z)² ≤ max((2θ − 1)² − 2t, 0).

*Proof.*
1. H_0(z) = ξ((1 + iz)/2)/8, so z = x + iy corresponds to s = (1 − y + ix)/2 and Re s = (1 − y)/2.
2. For Re s > θ ≥ 1/2, the factors ½s(s − 1)π^{−s/2}Γ(s/2) of ξ do not vanish, except s(s − 1) at s = 1, where
   ξ(1) = 1/2. So ξ(s) = 0 there only if ζ(s) = 0, which the hypothesis excludes.
3. ξ(s) = ξ(1 − s) gives no zeros with Re s < 1 − θ. Hence |y| ≤ 2θ − 1 at t = 0.
4. Polymath Theorem 3.2 is stated for any t0 ∈ ℝ and y0 > 0: no zeros with y > y0 at t0 implies none with
   y > max(y0² − 2(t − t0), 0)^{1/2} for t > t0. Apply it with t0 = 0, y0 = 2θ − 1 (de Bruijn 1950, Thm 13). ∎

For θ = 7/8 the hypothesis is the 003 theorem, Lean-checked locally (`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`,
standard axioms; official comparator and independent kernel replay not run; not peer-reviewed). The bound is closed:
zeros on Re s = 7/8 are not excluded, so y = 3/4 is possible. The offset 2·10⁻⁶ makes q0 > 9/16 strict.

**Strict entry (CERTIFIED, exact rationals).**
* On the first substep [0, δ], δ = 1/512000 > 10⁻⁸, the barrier satisfies β ≤ q0 and β′ = −2 − c0β ≥ −2 − c0q0. So
  β(t) ≥ q0 − (2 + c0q0)t.
* The check S1 is q0 − (2 + c0q0)·10⁻⁸ > (2θ − 1)². With Lemma S(θ), it gives β(t) > (2θ − 1)² ≥ y² for every zero and
  every t ∈ [0, 10⁻⁸]. So no contact occurs before 10⁻⁸, and compactness (Thm 1.5(i)) is used only for t ≥ 10⁻⁸.

| start | q0 | bound | first-substep mode | c0 | S1 margin | β above bound until | β above de Bruijn line until |
|---|---|---|---|---|---|---|---|
| strip | (1.000001)² | 1 | kernel 8 | 10.073292 | 1.879268·10⁻⁶ | 1.657·10⁻⁷ | 1.985·10⁻⁷ |
| 11/12 | 25/36 + 2·10⁻⁶ | 25/36 | sharp | 10.152594 | 1.909496·10⁻⁶ | 2.210·10⁻⁷ | 2.837·10⁻⁷ |
| **7/8** | **281251/500000** | **9/16** | **kernel 4** (v0 = 0.118362 ≤ ρ² = 0.1225) | **10.195272** | **1.922651·10⁻⁶** | **2.586·10⁻⁷** | **3.487·10⁻⁷** |

* The S1 margins are exact rationals (7/8: 114215105972865586110341/59405·10²⁴). The two crossing times are MEASURED
  (float); only S1 is used.
* The margins equal the integration module's `strictEntry78 = 1.92e-6` and `strictEntry1112 = 1.91e-6`.
* S1 would fail only if c0 > 352 (7/8). The selected c0 is 10.2.
* Both 7/8 scripts implement S1 with qbound = 9/16 and S2 (q0 > qbound): `oai-lambda-raymond.py` (both integrators) and
  `oai-lambda-routeP.py` (`fails['S1-strict-entry']`, 0 recorded). The referee replay and `replay.py` also implement it.

**Adversarial checks of the start (none succeeded).**
* (a) Closed bound: zeta zeros with Re s = 7/8 exactly (y = 3/4) are allowed; covered by the strict offset.
* (b) Infinitely many zeros near y = 3/4 at t = 0: the window [0, 10⁻⁸] is handled statically, without compactness.
* (c) Zeros born off the axis during [0, 10⁻⁸]: excluded by Prop. 3.1(ii), and statically anyway.
* (d) Head zeros: AF §§2–3 hold unconditionally with the classical strip y ≤ 1 for t ≤ 41/250. The 7/8 start neither
  needs nor changes them.
* (e) Thm 3.2 restricted to the classical strip: no, it is stated for general y0 and t0 (polymath.txt lines 648–652).
* (f) The kernel inequality during [0, 10⁻⁸], where contact heights could be up to 3/4: not needed; (10.1) is used only
  at t* ≥ 10⁻⁸.

**Grade: GAP B1 (expository); substance sound, CONDITIONAL on 003.** The AF and main-paper text hard-code "q0 > 1",
"above one" and "the classical strip". Fix: state Lemma S(θ) and S1 with (2θ − 1)², as above.

## 6. AF §12: terminal enclosure and the q_e/2 allowance

* q_next = (q + 2/c)e^{−cd} − 2/c is the exact solution of q′ = −2 − cq.
* Exponential upper bounds, both valid for 0 ≤ x < 1:
  * primary: the even alternating partial sum through degree 18, with terms decreasing for x < 1;
  * alternate: 1/Σ_{j≤12} x^j/j!.
* Terminal: solving (q + 2/c)e^{−cτ} − 2/c = q_e gives τ = log(1 + z)/c with z = c(q − q_e)/(2 + cq_e). Log upper
  bounds, valid for 0 < z < 1:
  * primary: the alternating sum through degree 11;
  * alternate: log(1 + z) ≤ z − z²/(2(1 + z)). PROVED: f(z) = z − z²/(2(1 + z)) − log(1 + z) has f(0) = 0 and
    f′ = z²/(2(1 + z)²) ≥ 0.
* **q_e/2 is independent of q0.** At T* (when β = q_e) every zero has y² ≤ q_e: nonreal zeros by the barrier, head zeros
  are real by AF §§2–3 since T* < 41/250. Thm 3.2 with t0 = T*, y0 = √q_e makes all zeros real by T* + q_e/2.
  Hence Λ ≤ T* + q_e/2. The start enters only through T*.

7/8 terminal data (CERTIFIED, `replay.py`):

| quantity | value |
|---|---|
| terminal cell / substep | 474 / 2 (t_K = 30337/256000 = 0.11850390625), h = 89/100 |
| q at the start of the terminal substep, c | 3.6094·10⁻⁶, 18.9957 |
| z | 3.4187·10⁻⁵ ∈ (0, 1) |
| τ (primary log) / δ | 1.79967·10⁻⁶ / 1.95313·10⁻⁶ = 0.9214 (inside the substep and the cell) |
| U primary | 118505710922701/10¹⁵ = **0.118505710922701** |
| U with the alternate log | 59252855461351/(5·10¹⁴) = **0.118505710922702** |
| horizon | U < 41/250 = 0.164 and U ≤ 19/125 |

* Both log bounds are valid inequalities, so each U is a valid conditional bound.
* Raymond's protocol (both constructions below the stated ceiling) is redundancy, not a validity condition. The
  integration module's primary 0.118505710922701, with the alternate recorded (referee P1), is correct.
* A statement "as Raymond's two-lane protocol" should quote 0.118505710922702.
* **Grade: SOUND.**
* Code remark (not a math issue): `oai-lambda-raymond.py`'s primary `integrate` lacks the U < 41/250 guard; only
  `integrate_alt` has it. The referee replay and `replay.py` check it. No effect at 0.1185.

## 7. Path audit: what the shorter 7/8 path touches

Own replay (`replay.py`, exact rationals; reproduces both existing implementations bit for bit):

| start | U | end cell / sub | substeps | kernels used (substeps) |
|---|---|---|---|---|
| strip | 0.149395073827688 | 597 / 74 | 76,491 | sharp 29,444; 8: 22,935; 4: 9,472; 7: 7,074; 5: 5,161; 10: 2,405 (referee replay) |
| 11/12 | 0.129826438865344 | 519 / 39 | 66,472 | sharp 31,955; 4: 26,790; 5: 7,727 |
| **7/8** | **0.118505710922701** | **474 / 2** | **60,675** | **4: 51,614; 5: 9,061** |

Guard margins on the 7/8 path, all exact rational checks:

| guard (path-dependent) | 7/8 extreme | strip extreme |
|---|---|---|
| admissibility ρ² − v (chosen kernel) | min 3.793·10⁻⁶ (cell 403, sub 30, first selection of kernel 5, v = 0.0399962) | min 6.41·10⁻⁷ |
| max v on path (kernel 4 needs ≤ 0.1225) | 0.118636 (v rises where h_i drops) | – |
| h·r < 2 | max 1.2535 | max 1.0355 |
| 0 < c·δ < 1 | max 3.710·10⁻⁵ | max 4.32·10⁻⁵ |
| rate margin ℓ − cap/h > 0 | min 4.2206 (rates ≥ 10.195) | – |
| cap branch | global 51,614 / s(0) 9,061 / V-dependent 0 | mixed |
| terminal τ/δ ≤ 1 | 0.9214 | 0.2752 |
| probe heights used | [0.89, 2.18] | [0.70, 2.18] |

Items that could depend on the last cell, each checked:
* **Schedule.** The 608 closed cells adjoin (asserted). The 7/8 path reads cells 0–474. Cells 475–607 are produced but
  unused; no AF statement requires the barrier to traverse the schedule.
* **Wall horizon** 41/250 and probe range 19/125: both above U.
* **Source facts.** (5.1), (4.3), (5.4), the AF §8 constants k > 0 and c₀v₀ > 2 (AF §8 notation, not the rate c0) and
  the activation budget are per-cell plan facts (G0-d, b145 refA), not path facts.
* **Floors placed on the band path** (route P: campaign floors and the r2 sharp windows). These are levers, not
  validity: a per-cell floor is valid on its cell whatever the path. The only path-conditional floors are the windows
  (GAP B3), and none is used.

**Grade: SOUND.** Nothing in §§6–12 or Part II depends on the path ending at cell 474 rather than about 580–597.

## 8. Written fix: final barrier lemma for a general start (closes b145 GAP-3 and GAP B1–B3 in text)

**Lemma FB(θ).** Hypotheses:
* (Z_θ) ζ(s) ≠ 0 for Re s > θ (θ = 1 is classical; θ = 7/8 is the 003 theorem).
* (W) AF §§2–3 localisation: for 0 ≤ t ≤ 41/250, every nonreal zero of H_t has |Re z| > X.
* (J) Joint floors (main Theorem 3 on AF §§4–9 one-point rows; G0-c, G0-d). For cell i (closed, [i/4000, (i+1)/4000],
  height h_i), mode m (catalogue ratio r, or sharp), every x ≥ X, t in cell i and a ∈ A_m(h_i):
  ½[S(x + a, h_i, t) + S(x − a, h_i, t)] > ℓ_i(m). Here A_r = {r·h_i} and A_sharp = [h_i√((1 − 51/250)/3), h_i/√3].
* (K) (10.1) for the catalogue kernels, and Part II Theorem 1 for the sharp mode.
* (C) A consumer record (q_k, c_k, m_k), k = 0..K, δ = 1/512000, t_k = kδ, cell i(k) = ⌊k/128⌋, v_k = q_k/h_{i(k)}²:
  1. m_k is admissible at v_k: v_k ≤ ρ², or 29v_k² − v_k − 1 ≤ 0 for sharp;
  2. c_k = (2λ/h)(ℓ_{i(k)}(m_k) − cap_k/h) > 0, with cap_k ≥ sup_{0≤v≤v_k} (self term), where the self term is s_r(v),
     or 6/(4 − v) for sharp;
  3. 0 < c_kδ < 1 and q_{k+1} ≥ (q_k + 2/c_k)e^{−c_kδ} − 2/c_k for k < K;
  4. **S1**: q_0 > (2θ − 1)² and q_0 − (2 + c_0q_0)·10⁻⁸ > (2θ − 1)²;
  5. (q_K + 2/c_K)e^{−c_Kδ} − 2/c_K ≤ q_e, and τ := log(1 + c_K(q_K − q_e)/(2 + c_Kq_e))/c_K ≤ δ;
  6. T* := t_K + τ satisfies T* + q_e/2 < 41/250.
* If any mode carries a window [q_lo, q_hi], add: q_k ≤ q_hi, and the stored trajectory on substep k stays ≥ q_lo. In
  that case use the stored barrier below.

Conclusion: Λ ≤ T* + q_e/2.

*Proof.*
1. **Barrier.** Without windows, let β be the continuous solution of β′ = −2 − c_kβ on [t_k, t_{k+1}], β(0) = q_0. With
   windows, let β be the stored barrier (exact solution from q_k on each substep, left-continuous at knots).
   * In both cases β(t) ≤ q_k on substep k (§4.2), and C1–C2 hold at every v ≤ β(t)/h² (the conditions are monotone,
     §3.2).
   * Let T_β ≤ T* be the first time with β = q_e (C5 and monotonicity of the flow).
2. **[0, 10⁻⁸].** By Lemma S(θ), y² ≤ (2θ − 1)² − 2t for every zero. By S1 and β ≥ q_0 − (2 + c_0q_0)t on the first
   substep, β(t) > (2θ − 1)². No zero touches β.
3. **[10⁻⁸, T_β].**
   * Let t* be the infimum of the times at which some zero has y² ≥ β(t). By Thm 1.5(i) and |y| ≤ 1, the nonreal zeros
     for t ∈ [10⁻⁸, 1/2] lie in a fixed compact set. Hurwitz and the lower semicontinuity of β make the set closed. So
     t* is attained, t* > 10⁻⁸, and the contact y*² = β(t*) is highest.
   * By (W) and symmetry, x* > X.
   * If the contact zero is multiple, Prop. 3.1(ii) gives a branch above β just before t* (β ≥ q_e, so √β is
     Lipschitz). Contradiction.
   * If it is simple, Prop. 3.1(i), (K) at v = y*²/h² ≤ v_k (k = the substep ending at or containing t*, i.e. the left
     substep at a knot), (J) at x* ± a (a < 2, so x* ± a ≥ X − 2) and C2 give q′(t*) < −2 − c_kβ(t*) = β′(t*−). First
     contact gives q′(t*) ≥ β′(t*−). Contradiction.
4. **Terminal.** At T_β every zero has y² ≤ q_e (head zeros are real by (W)). Thm 3.2 with t0 = T_β, y0 = √q_e gives
   Λ ≤ T_β + q_e/2 ≤ T* + q_e/2. ∎

Instance θ = 7/8 at PT height:
* q_0 = 281251/500000, K + 1 = 60,675 substeps;
* terminal in cell 474, substep 2, T* + q_e/2 ≤ U = 0.118505710922701;
* (K) used only for kernels 4 and 5; (J) used only for the modes r = 23/40 and r = 3/5;
* no window and no sharp mode.

The lemma is a written internal re-derivation (PROVED in the internal sense). Its premises (Z_7/8), (W), (J) and (K) carry
the grades listed in §11.

## 9. GAP list (all expository or latent; none changes a number)

* **B1 (start, AF §11 l. 703–704, main §7, Part II §5).** The text is written for q0 > 1 and "above one". Fix: state
  Lemma S(θ) and S1 with the bound (2θ − 1)², and cite Polymath Thm 3.2 in its general (t0, y0) form plus the half-plane
  theorem. Implemented correctly in all three code paths (S1 margins in §5).
* **B2 (first contact, AF §11 l. 700–720).** b145 GAP-1, GAP-2 and GAP-4 are still unwritten in the deposit: compactness
  via Thm 1.5(i) on [10⁻⁸, 1/2] plus Hurwitz closedness; part (i) cited; backward branches z* + i√(2ε)λ_j. Also, the AF
  §§10–12 text describes the 0.1511 parent rather than the final consumer (joint floors, sharp mode, 128 substeps;
  b145 GAP-3). Fix: Lemma FB(θ) (§8).
* **B3 (latent, route P).** Window floors (`sharp-r2`) require the stored-barrier form of the first-contact argument, not
  AF's continuous ideal barrier. No current value is affected (0 window substeps in the route-P 7/8, 11/12 and strip
  runs). Fix: Lemma FB(θ) with the stored barrier. It becomes necessary as soon as sharp windows are re-certified on the
  7/8 path (integration top action 3).
* **B4 (dependency statement).** The integration record lists G0 as a whole. Under 7/8, Part II (sharp law) and the
  V-dependent caps of AF §10 are not used by either 7/8 value. Fix: record the reduced dependency for raymond78
  (kernels 4 and 5 with global caps; joint modes r = 23/40 and 3/5) and for routeP78 (catalogue kernels 4, 8 and 10 plus
  five route-3 rows; no sharp, no centre, no window).
* **B5 (code).** The primary integrator of `oai-lambda-raymond.py` lacks the U < 41/250 horizon guard. Add it; no effect
  on any value.

## 10. Route P remarks (outside AF, path-relevant only)

* The route-P 7/8 run (`tmp/oai-lambda-out/routeP_t78.json`, not re-run here) records:
  * U = 0.117708313410954, cell 470 substep 106, 60,267 substeps, `fails = {}`, `window_min_margin = null`;
  * modes: catalogue kernel 4 (23,040), kernel 10 (11,679), kernel 8 (7,680), and route-3 rows (17,868).
* The five route-3 rows used are (r, λ, ρ) = (27/40, 49/25, 1/5), (49/80, 1987/1000, 3/10), (5/8, 3963/2000, 3/10),
  (13/20, 197/100, 1/4) and (51/80, 3951/2000, 3/10). These are κ = 1, w = 0 instances of the same two-point inequality,
  and all five certify under `kerncert2.py`:
  * 4–5 leaves each;
  * caps 2/(1 + r²) exact, since 3r² ≥ 1 for each;
  * the λ = min rule of Theorem MP is linear in the probe measure.
* The other route-P premises (Track A, Lemma R, r2/route-1 floors, the multi-height consumer, the single-band claim that
  every floor is a min over all 11 pair classes including the infinite row) are outside part B.
  * The only path-conditional element among them is the window floors (B3, unused).
  * Kernel admissibility (E1/E2) is monotone and was recorded with 0 failures by the referee's step verifier.

## 11. What is established and what is not

**Established here (internal):**
* AF Part I §§6–12 and Part II re-read line by line for the 7/8 use. No ERROR.
* The only q0-dependent step (start and strict entry) is sound in substance given 003, via Lemma S(θ) and Polymath
  Thm 3.2. As written in AF ("q0 > 1") it grades GAP B1; Lemma S(θ) is the fix.
* The terminal allowance q_e/2 is q0-independent and SOUND.
* No statement depends on the end cell.
* Independent certificates (CERTIFIED, own code): (10.1) for 13 + 5 kernels; all global caps exact; the Part II Theorem 1
  identity; a third replay of the 7/8, 11/12 and strip chains with guard margins.

**Not established here:**
* AF §§2–5 (part A; b145 internal SOUND).
* Main-paper Lemmas 2–4 / Theorem 3 (G0-c): the joint floors in TABLES.json are inputs here.
* The route-P ledger (Track A, r2, route-1 and route-3 producers).
* The 003 theorem beyond the local Lean build (no official comparator, no independent kernel replay, not peer-reviewed).
* PT's computation.
* Any non-project reading of this review.

**Values.** No Λ value moves:
* raymond78 = 0.118505710922701 (two-lane protocol 0.118505710922702) and routeP78 = 0.117708313410954 remain
  CONDITIONAL values, not bounds;
* PT Λ ≤ 0.2 stands. RH open. NO QED.

## 12. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer/tmp/g0-review-b-2026-10-08
python3 replay.py 7/8,11/12,1          # exact consumer replay + guard margins (≈ 30–60 s per start)
python3 entry.py                        # first-substep rates, S1 margins, crossing times
python3 instr.py                        # kernel-5 switch point, tightest admissibility margin (7/8)
python3 capcheck.py                     # exact global self-cap check, 13 kernels
../../.venv-arb/bin/python kerncert.py  # (10.1) certificates, 13 catalogue kernels -> kerncert_out.json
../../.venv-arb/bin/python kerncert2.py # (10.1) certificates + caps, 5 route-3 rows on the route-P 7/8 path
../../.venv-arb/bin/python part2.py     # Part II Thm 1 identity, self pair, v*, counterexample
```

Inputs: `tmp/s145-1-g1/data/PLAN.json`, `tmp/s145-1-g1/out/X1/TABLES.json`, `tmp/oai-lambda-out/KERNELS_raymond_backup.json`
(sha256 identical to Raymond's parent `KERNELS.json`), `tmp/oai-lambda-out/routeP_t78.json` (kernel list for
`kerncert2.py`). The route-1 campaign (`tmp/route1-campaign/`) was not touched.
