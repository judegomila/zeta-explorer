# Weak outer lemma for the r2 structured floors (route P): exact statement, reduction, partial certificate, obstruction

Date: 2026-10-02. Branch `editorial-redesign`, working files only (nothing committed).
Grades used below: PROVED (complete argument written here), CERTIFIED (computer-assisted, outward-rounded interval /
Taylor-model arithmetic, in-session, not refereed), CONDITIONAL, MEASURED (floating point, sampling, or incomplete
enclosure), HEURISTIC.

**Outcome.**

* The weak outer lemma with margin 0.02 is NOT proved for the 630 band-path entries in the form route P consumes it
  (WOL-C, section 1.3). No uniform margin is certified for them. The route-P value
  Λ ≤ 1448843462793/10^13 = 0.1448843462793 stays conditional on this lemma.
* WOL-C is CERTIFIED for nine single entries (section 4.1), all with margin < 0.0223:
  * four early-cell route-P entries (P7, P11; cells 0–82), margins 0.0137–0.0190;
  * five S = {2,3,5} entries (cells 99–555; κ = 1, 0.94, 0.88; 'cat' and 'sharp'), margins 0.0220–0.0223. These used a
    full three-angle search at about 46 CPU-minutes per entry.
* The method fails for the larger prefixes the band path uses at late cells (P = 13…47; section 4.2).
* The exact consumer gives:
  * 147541824070553/10^15 = 0.147541824070553 with only the certified floors admitted. This is no improvement over the
    b145 PT value 0.147273668782792.
  * 0.145737084009444 if all 628 S = {2,3,5} floors on that consumer's path are certified at margin ≤ 0.0223. This is a
    finite computation of measured size, about 480 CPU-hours (section 6), and it would not depend on any outer lemma.
* RH open. NO QED.

---

## 1. What route P consumes

### 1.1 Objects

The notation follows `tmp/r2-floor-cert*.py`, `tmp/r2-floor-c/r2core_k.c` and `src/data/r2-structured-floor-2026-10-02.js`.

* N0 = 690988, L = 2 log N0, v = log n. Coefficients on n ≤ N0 at height h and time t:
  a_n(t) = exp(t v(v−L)/4 − (1+h) v/2). Reflected coefficients: P_n(t) = exp(−hL/2 + t v(v−L)/4 − (1−h) v/2).
* An **entry** E = (cell i, height multiplier κ ∈ {1, 0.94, 0.88}, mode) with:
  * time cell [t_lo, t_hi] (PLAN row i) and height h = κ·height_i;
  * displacement range [a_lo, a_hi]: the single point a = r·h for 'cat' modes (kernel r), and the interval obtained
    from the certified contact window [q_lo, q_hi] for 'sharp' modes;
  * small-prime prefix S = {p ≤ P}, P ∈ {5, 7, …, 47}. The base tables `batch_*.json` have S = {2,3,5}; the adaptive
    tables `adapt*/batch_P*.json` have P ≥ 7.
* Phases. θ_S = (θ_q)_{q∈S} ∈ T^S. The two probes ± have prime variables z_q^± = e^{i(θ_q ± a log q / 2)}, and label j
  carries the joint phase ph_j = e^{i a log j / 2}.
* c_1^±(θ) = Σ_{m ≤ N0, S-smooth} a_m z^m. c_j^±(θ) = Σ_{m ≤ N0/j} a_{mj} z^m for rough labels j (gcd(j, ∏S) = 1),
  and d_j is the same sum with ∂_y-coefficients −(v/2) a_n. Labels are w_j = c_j / c_1 and dw_j = d_j/c_1 + w_j K with
  K = −d_1/c_1. The rough-log labels l_j, dl_j come from the exact Dirichlet-log recursion l_j = w_j − acc_j / v_j.
* **Bound function** Φ_E(θ_S; t, a) = K0 + Σ_j |X̃_j| + extra, where:
  * K0 = −½ Σ_± Re(d_1/c_1);
  * X̃_j = ½(dl_j^+ ph_j + dl_j^− ph̄_j) + (β^+/2) w_j^+ ph_j + (β^−/2) w_j^− ph̄_j, with β^± the secant coefficient of the
    reflected branch;
  * extra = T2 + ½ Σ_± (β^± + hi^± + tl^±), which covers labels above N0 (log-binned convolution tails) and the reflected
    branch (relaxed θ-uniformly).

  For each fixed (θ_S, t, a), Φ_E is an upper bound for the sup over all other phases of the joint source cost
  J = ½(κ(x+a) + κ(x−a)) (r2 construction).
* **Stored value** K0*(E): the maximum of the r2 enclosure of Φ_E at θ_S = 0 over the time sub-cells and a-pieces
  of the entry. The time box is handled by the coefficient balls [a(t_L), a(t_L) e^{(t_R−t_L) v²/4}] (radial-contraction
  step; see 1.3).
* **Floor**: fl(E) = v0/2 − 10^−6 − pert·(1+10^−12) − K0*(E)·(1+10^−12) − Dslope − 10^−12. The table entry is
  floor_str(E) = ⌊10^12 fl(E)⌋ / 10^12 (slope-fixed tables `tmp/r2-refF-out/corrected/`). The terms pert and Dslope come
  from Raymond's records and the L-slope lemma; both are independent of θ_S.

### 1.2 The consumed floors

Route P runs the exact rational consumer `tmp/r2-floor-consume-shift.py` with `--const -0.02` on
`tmp/r2-refF-out/corrected_m0023/batch_*.json,tmp/r2-refF-out/corrected_m0023/adapt*/batch_P*.json`. In those tables
every slope-fixed floor is already lowered by the time-box allowance 23/10000. Every r2 floor therefore enters as

  floor_used(E) = floor_str(E) − 23/10000 − 1/50.

The replay `tmp/r3-outer-used.py` uses the same arithmetic as the consumer and records the option chosen at every substep.
It reproduces U1_band = 1448843462793/10^13 exactly and lists the r2 floors the band path actually uses:
`tmp/r3-outer-out/used_w002.json`, **630 entries** (305 'cat', 325 'sharp' windows) in cells 0–579.

| prefix P | 7 | 11 | 13 | 17 | 19 | 23 | 29 | 31 | 47 |
|---|---|---|---|---|---|---|---|---|---|
| entries | 15 | 70 | 74 | 22 | 34 | 39 | 8 | 5 | 363 |
| cells | 0–41 | 8–82 | 52–141 | 139–166 | 161–199 | 192–237 | 226–246 | 248–254 | 232–579 |
| κ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1: 31, 0.94: 155, 0.88: 177 |

The value 0.1448843462793 needs the lemma for exactly these 630 floors. If any of them is removed, the consumer path
changes and other entries can be selected (section 5).

### 1.3 Lemma 1 (floor validity). PROVED.

Let K^sup(E) = sup { Φ_E(θ_S; t, a) : θ_S ∈ T^S, t ∈ [t_lo, t_hi], a ∈ [a_lo, a_hi] }. Then
fl^true(E) = v0/2 − 10^−6 − pert(1+10^−12) − K^sup(E)(1+10^−12) − Dslope − 10^−12 is a valid joint floor: the r2
construction applies, and the other terms are θ-independent and certified for the whole cell. Moreover
floor_used(E) ≤ fl^true(E) whenever

  **(WOL-C)  K^sup(E) ≤ K0*(E) + 0.0223 / (1 + 10^−12).**

*Proof.* floor_used = floor_str − 0.0223 ≤ fl − 0.0223, and fl − fl^true = (K^sup − K0*)(1 + 10^−12) ≤ 0.0223. ∎

More generally, if K^sup(E) ≤ K0*(E) + m is certified, then floor_str(E) − m(1 + 10^−12) ≤ fl^true(E) is a valid
floor. In terms of the m0023 tables, it is their entry plus 0.0023 − m(1 + 10^−12). `tmp/r3-outer-certfile.py` uses
exactly this, rounded down to the 10^−13 grid minus 10^−13.

WOL-C is the exact statement the route-P value needs, for each of the 630 entries in 1.2. It does not depend on the
time-box step, because t ranges over the whole cell directly; neither the radial-contraction step nor the 0.0023
allowance is used separately. The literal form in `r2-structured-floor` is WOL-Φ: sup_θ Φ^box(θ) ≤ Φ^box(0) + 0.02,
where Φ^box is the time-box enclosure. WOL-Φ implies WOL-C only together with one of:
* the time-box step (F* zero-freeness, uncertified);
* the 0.0023 allowance (measured at 4 entries: +0.00194 to +0.00225 at nsub = 2).

This document targets WOL-C.

---

## 2. Structural facts (all PROVED)

**2.1 Symmetry.** Φ_E(−θ_S; t, a) = Φ_E(θ_S; t, a).

*Proof.* z_q^±(−θ) is the complex conjugate of z_q^∓(θ). All coefficients are real, so every probe-+ quantity at −θ is
the conjugate of the probe-− quantity at θ. Hence X̃_j(−θ) = conj X̃_j(θ), and K0, the β-terms, the tails and T2 are
symmetric in the two probes. ∎

So a search over θ_2 ∈ [0, π], with the other coordinates over the full circle, covers the torus.

**2.2 Exact factorisation.** For each probe, c_1(θ) = ∏_{q∈S} F_q(z_q) · (1 + D(θ)), where
F_q(z) = Σ_{k: q^k ≤ N0} a_{q^k} z^k and
D(θ) = [Σ_{m ≤ N0} (a_m − ∏_q a_{q^{e_q}}) z^m − Σ_{m > N0, all q^{e_q} ≤ N0} ∏_q a_{q^{e_q}} z^m] / ∏_q F_q(z_q).
Consequently K0 = Σ_q sep_q(θ_q) + K0_def, with
* sep_q(θ) = ½ Σ_± −Re(∂_y F_q / F_q)(e^{i(θ ± a log q/2)}),
* K0_def = −½ Σ_± Re(∂_y D / (1 + D)).

The one-prime functions sep_q are evaluated exactly in arb (1-D).

**2.3 Time-tilt identity.** For m = ∏ q^{e_q} with x_q = e_q log q:
a_m(t) = ∏_q a_{q^{e_q}}(t) · exp((t/2) Σ_{q<q'} x_q x_{q'}), and a_{mj}(t) = a_m(t) a_j(t) exp(t v_m v_j / 2).
At t = 0 the coefficients are completely multiplicative, and D reduces to the beyond-N0 truncation term. For t > 0 the
defect a_m − ∏ a_{q^e} ≥ 0 is concentrated on monomials with many distinct primes and large exponents.

**2.4 Time monotonicity.** For n ≤ N0 we have v < L, so v(v−L) < 0, and both a_n(t) and P_n(t) decrease in t. Hence the
θ-uniform reflected numerators are bounded by their values at t_lo. No radial-contraction lemma is needed when t is kept
as a variable.

**2.5 Large-label lemma.** For a rough label j > N0/2, only m = 1 satisfies mj ≤ N0. So c_j^± = a_j(t) and
w_j^±(θ) = a_j(t) / c_1^±(θ) exactly. Hence sup_θ |w_j^±(θ)| = a_j / min_θ |c_1^±(θ)| ≥ |w_j^±(0)|, with strict
inequality as soon as θ_S = 0 does not minimise |c_1^±|.

Example, entry 0|1|r_49_100, prime-2 factor alone: |F_2| drops from 1.43 at θ_2 = 0 to 0.76 at θ_2 = π
(a_2 = 2^{−1.59}, phase a log 2/2 = 0.37). So the weights of the large labels roughly double there.

Consequence: Φ is not a sum of terms that are each maximised at θ_S = 0. K0 decreases away from 0, while the
large-label weights increase. Any proof has to quantify this trade-off; a monotonicity argument for each term separately
cannot work.

---

## 3. Computer-assisted method (implemented)

Code:
* Engine: `tmp/r3-outer-c/r3core4.c` (C; round-to-nearest with all rounding errors folded outward; compiled with
  `-ffp-contract=off`; compile flags NL = number of box primes, NH = number of η-relaxed primes).
* Rigorous inputs and driver: `tmp/r3-outer-lib4.py` (python-flint arb, 128 bit).
* Box searches: `tmp/r3-outer-cert.py` (NL = 2) and `tmp/r3-outer-cert3.py` (NL = 3, S = {2,3,5}).
* Interpreter: `/tmp/refCvenv/bin/python` (python-flint 0.9.0). `/tmp/rhvenv` has no python-flint at present and is used
  only for the pure-rational consumer scripts.

For one entry and one box B in the box primes' angles, the engine encloses
sup { Φ_E(θ_S; t, a) : θ_p ∈ B for the box primes, θ_q on the whole circle for the other primes of S,
t ∈ [t_lo, t_hi], a ∈ [a_lo, a_hi] }. It does this as follows.

* **Taylor models.** They are second order in u_p = θ_p − c_p for the box primes p, and in η_q = e^{iθ_q} − 1
  (|η_q| ≤ 2) for the remaining primes of S, with coherent pair terms for the first 5 of those. They are first order in
  τ = t − t_mid and α = a − a_mid. The remainder envelope is e0 + Σ_q (e1_q |η_q| + e2_q |η_q|² + e3_q |η_q|³), with
  mixed monomials folded by weighted AM–GM.
* **Time.** a_n(t) is carried exactly in τ: value, first derivative, and the Lagrange bound
  a_n(t_mid)(|κ_n|DT)² e^{|κ_n|DT}/2. By 2.4 no time-box lemma is used.
* **One-prime functions.** 1/F_q and ∂_yF_q/F_q come from arb.
  * η-primes: second-order Taylor coefficients at η = 0, plus a bound on the third derivative over the closed unit
    disc. F_q is zero-free there; the code asserts Σ_{k≥1} a_{q^k} < 0.9.
  * Box primes: third-order data in u on the box.
* **Defect.** D from 2.2 is built from arb values of a_m − ∏ a_{q^e} at t_mid, plus ∂_τ and a sup bound of ∂_τ². The
  beyond-N0 product tail is evaluated at t_lo. 1/(1 + D) is computed as 1 − D + D² plus a remainder based on a global
  bound |D| ≤ Dglob over the torus, cell and range.
* **Modulus.** |x| is bounded by |x_0| + Re(σ̄Δ) + |Δ|²/(2|x_0|), or by |x_0| + |Δ| when |x_0| is small.
* **Separable part.** Σ_q sep_q is added in arb on the Python side: centred forms on 0.005-wide sub-intervals for the box
  primes, and a 512-interval grid with centred forms for the η-primes (jointly with each prime's own TM terms).
* **Box search.** θ_2 ∈ [0, π] (by 2.1) and the other box angles in [−π, π]. A box is bisected along its widest
  coordinate while its bound exceeds K0*(E) + tol. The certified margin is m(E) = max over leaves of (bound − K0*(E)).

What this is and is not. It is an independent re-implementation of the r2 bound function in different arithmetic.
* At the point θ_S = 0 its bound exceeds the stored K0* by +0.000015 to +0.00195 over the six entries tested by the referee (0, 40, 41, 82, 99, 555)
[r3 referee correction; originally quoted as +0.0003 to +0.002] (P7 cell 0: +0.00030; P11 cell 82:
  +0.00050; S = {2,3,5} cell 0: +0.00045; cell 555: +0.00195). This is the time-cell width plus the Taylor-model width.
* It has not been refereed. Its outputs are graded CERTIFIED (in-session), not PROVED.

**Consistency check** (`tmp/r3-outer-xcheck.py`, MEASURED). At 43 phase points (random and near 0) for three entries
(S = {2,3,5} cell 555; P7 cell 0; P11 cell 82), the r3 bound on a 10^−7 box over the whole cell and a-range was compared
with the original r2 engine's enclosure of Φ_E(θ; t_mid, a_mid) (Instance.box at a point).
* r3 ≥ r2 at every point. The difference is +0.0015 to +0.017 for |θ_q| ≤ 0.4 and +0.012 to +0.17 at random points
  of the torus.
* Far from 0 the gap comes from the θ-uniform reflected relaxation and the η-relaxation. It is harmless there, because Φ
  is far below K0*.
* No violation was found. This is evidence, not a proof, of correctness in the dangerous direction.

---

## 4. Results

### 4.1 CERTIFIED: WOL-C for single entries

| entry (table) | S | cell, κ | search | evaluations | CPU s | K0* | K^sup ≤ | margin m(E) ≤ |
|---|---|---|---|---|---|---|---|---|
| 0\|1\|r_49_100 (adapt/batch_P7) | P7 | 0, 1 | θ_2, θ_3 (5, 7 η) | 160 | 269 | 0.378037 | 0.393377 | 0.015340 |
| 41\|1\|sharp (adapt/batch_P7) | P7 | 41, 1 | θ_2, θ_3 (5, 7 η) | 176 | 294 | 0.388435 | 0.406796 | 0.018361 |
| 40\|1\|r_49_100 (adapt/batch_P11) | P11 | 40, 1 | θ_2, θ_3 (5, 7, 11 η) | 176 | 358 | 0.395509 | 0.409251 | 0.013742 |
| 82\|1\|sharp (adapt2/batch_P11) | P11 | 82, 1 | θ_2, θ_3 (5, 7, 11 η) | 240 | 477 | 0.406553 | 0.425537 | 0.018984 |
| 286\|0.94\|r_19_40 (batch_2) | {2,3,5} | 286, 0.94 | θ_2, θ_3, θ_5 | 2258 | 2738 | 0.708943 | 0.731134 | 0.022191 |
| 437\|0.88\|sharp (batch_2) | {2,3,5} | 437, 0.88 | θ_2, θ_3, θ_5 | 2326 | 2833 | 0.705620 | 0.727579 | 0.021959 |
| 517\|0.88\|r_23_40 (batch_3) | {2,3,5} | 517, 0.88 | θ_2, θ_3, θ_5 | 2366 | 2932 | 0.754010 | 0.776298 | 0.022288 |
| 555\|0.88\|r_3_5 (batch_1) | {2,3,5} | 555, 0.88 | θ_2, θ_3, θ_5 | 2296 | 2812 | 0.707567 | 0.729775 | 0.022208 |
| 99\|1\|sharp (batch_1) | {2,3,5} | 99, 1 | θ_2, θ_3, θ_5 | 2072 | 2464 | 0.429158 | 0.451293 | 0.022135 |

(K^sup and the margins are rounded up in the last digit shown. Every listed entry satisfies WOL-C: m(E) < 0.0223.)

The first four are on the route-P path (`used_w002.json`). The S = {2,3,5} entries are on the path of the S = {2,3,5}
consumer (`used_p5_w002.json`, section 5). Leaf lists: `tmp/r3-outer-out/cert_demo_*.json(.log)` and
`cert3_*_p*.json(.log)`. The tolerance is tol = 0.022299, so boxes are accepted up to that excess, and margins close to
0.0223 reflect the stopping rule, not the function. At the point θ_S = 0 the excess is only +0.00195 for entry 555.

### 4.2 MEASURED: where the method fails

**Route-P prefixes, (θ_2, θ_3) search.** Central box θ_2, θ_3 ∈ [0, 0.1], with the other primes of S η-relaxed, over the
whole time cell and a-range; the table gives the box bound minus K0*(E). The η-relaxation part does not shrink with the
box, so these values are close to the smallest excess this design reaches near θ = 0:

| entry (cell, structure) | excess over K0* |
|---|---|
| P7, cells 0 and 41 | 0.00079, 0.00078 |
| P11, cell 82 | 0.0016 |
| P13, cell 141 | 0.033 |
| P17, cell 166 | 0.097 |
| P19, cell 199 | 0.195 |
| P23, cell 237 | 0.39 |
| P47, cell 235 | 1.29 |

The same runs with the time-tilt defect switched off are DIAGNOSTIC ONLY (not valid bounds); they locate the loss:
* P17 0.004, P19 0.0058, P23 0.011, P47 (cell 235) 0.042;
* roughly 0.0022 per large η-prime, and 0.0177 for q = 5;
* at cells 450 and 550 in P19/P23 structures, the box bound minus the box-centre value is 0.53–0.60 even without the
  defect.

**S = {2,3,5} with θ_5 η-relaxed** (`tmp/r3-outer-p5probe.py`):

| entry | point box θ = 0 | box [0.02 ± 0.02]² | coarse 4 × 8 grid (half-width π/8) |
|---|---|---|---|
| 0\|1\|r_49_100 (h = 2.18) | +0.000446 | +0.000623 | +0.06 … +0.34 |
| 437\|0.88\|sharp (h = 0.906) | +0.104 (η-cost of q = 5: 0.097) | +0.133 | +4.1 … +7.4 |
| 555\|0.88\|r_3_5 (h = 0.669) | +0.111 (η-cost 0.101) | +0.138 | +3.3 … +5.6 |

**S = {2,3,5}, all three phases as box variables**, entry 555 (`tmp/r3-outer-p5nl3.py`; bound − K0*):

| box | excess |
|---|---|
| point θ = 0 | +0.00195 |
| [0 ± 0.025]³ | +0.0048 |
| [0 ± 0.05]³ | +0.0089 |
| [0 ± 0.1]³ | +0.0241 |
| (π/2, 0, 0) ± 0.1 | −0.144 |
| (π/2, 0, 0) ± 0.2 | −0.068 |
| (π/2, π/2, π/2) ± 0.2 | −0.177 |
| (π/2, π/2, π/2) ± 0.4 | +0.589 |
| (3π/4, π, π) ± (π/4, 0.4, 0.4) | +89.5 |

So the boxes that pass have half-width about 0.2 away from 0 and 0.05–0.1 near 0. The certificates of 4.1 therefore
start from an 8 × 16 × 16 grid (half-width 0.196). In the five runs, 95.6–99.4% (1957–2036 of 2048; r3 referee correction) of the start boxes pass without being
split (split nodes: 12, 105, 124, 139 and 159).

### 4.3 Diagnosis

1. *Steep defect.* For t ≳ 0.03 and many primes, the multiplicativity defect of 2.3 is large on monomials with many
   distinct primes. Its Taylor remainders pass through K = −d_1/c_1 and 1/c_1 into every label. The excess grows from
   0.033 (P13, cell 141) to 1.29 (P47, cell 235) as the prime count and t increase together.
2. *η-relaxation cost.* Relaxing a prime over its full circle (|η| up to 2) costs 0.002–0.02 per prime at early cells,
   and about 0.1 for q = 5 at h < 1. With margin 0.0223, late cells allow essentially no relaxed prime. All of S has to
   be searched, which is affordable only for |S| = 3.
3. *Dependency blow-up.* w_j = c_j · (1/c_1) is formed as a product of separate expansions. By 2.3 the exact ratio has a
   product structure, a_j ∏_q F_q(ρ_{qj} z_q)/F_q(z_q) × (truncation and tilt corrections) with ρ_{qj} = q^{t v_j/2}.
   The arithmetic does not see this, and the third-order remainders add up over 10^5–2·10^5 labels. This is why boxes of
   half-width 0.4 fail even far from 0 (+0.59, and +89 near θ = (π, π, π), where |c_1| is smallest).
4. *Large labels* (2.5) grow away from θ = 0, so no region of the torus can be skipped without evaluation.

---

## 5. Largest provable margin and the route-P value

**Uniform margin over the 630 route-P entries.** None is certified. At late cells (prefixes P = 13…47, cells ≳ 140) the
method gives no bound in the needed range, not even on the single central box (4.2). The route-P value
1448843462793/10^13 = 0.1448843462793 stays CONDITIONAL on WOL-C for those entries.

**Exact consumer with only the floors certified here** (`tmp/r3-outer-certfile.py` → `certfile_now.json`,
`tmp/r3-outer-mixed.py --cert`): 147541824070553/10^15 = 0.147541824070553. Nine certified floors are admitted and the
path uses seven of them; the replay `tmp/r3-outer-used2.py --cert` agrees. Floors not admitted fall back to the Track A
κ = 1 tables.
Without any r2 floor the same consumer gives 29511133454807/(2·10^14) = 0.147555667274035. Neither value is below the
b145 PT value 0.147273668782792. That value uses ingredients (grid re-optimisation, two-height kernels) that this
consumer does not include, and it does not depend on the outer lemma.

**Exact-consumer values under weaker or partial versions** (MEASURED dependence; same arithmetic as
`tmp/r2-floor-consume.py`). Here "combined margin m" means that every admitted r2 floor is floor_str − m, with m including
the 0.0023 time-box part.

| admitted r2 floors | m = 0.0023 | 0.0123 | 0.0223 | 0.0423 | 0.0623 | 0.1023 | 0.1523 | 0.2023 |
|---|---|---|---|---|---|---|---|---|
| all structures (P ≤ 47) | 0.144544975039788 | — | **0.1448843462793** | — | 0.145566399715088 | 0.146203867808489 | 0.146941197032611 | 0.147264127210863 |
| S = {2,3,5} only | 0.145416234753928 | 0.145577730942050 | **0.145737084009444** | 0.146055102819095 | 0.146369867334082 | 0.147017996683292 | 0.147406978521691 | 0.147550593279498 |

At m = 0.0223:
* Prefix restricted to P ≤ 7: 0.145735483836527. P ≤ 11: 0.145722746237441. P ≤ 13: 0.145699478876260.
* All structures, only cells ≤ C admitted: C = 50 → 0.147471928683690; 100 → 0.147358833487454;
  150 → 0.147222450981207; 200 → 0.147056041434642; 300 → 0.146513051844740; 400 → 0.145724375807697.
* S = {2,3,5} only, only cells ≥ C admitted: C = 500 → 0.147364644122451; 400 → 0.147074904937842;
  300 → 0.146535093605714; 200 → 0.146199441311337; 100 → 0.145927370410483.

Reading these values:
* The gain comes from cells ≳ 200. The early cells, where the route-P entries are certifiable, move the value by less
  than 2·10^−4.
* The S = {2,3,5} floors carry most of the gain: 0.145737084009444 on a path of 628 base-table entries
  (`tmp/r3-outer-out/used_p5_w002.json`, cells 0–582).
* 0.147074904937842 (S = {2,3,5} floors admitted only in cells ≥ 400) is reached on a different consumer path that uses 191
  r2 floors (146 shared with the 185 late entries of the full S = {2,3,5} path, plus 45 others); WOL-C is needed for those
  191, not for the 185 [r3 referee correction].

---

## 6. What a proof (or the S = {2,3,5} replacement) still needs

1. **S = {2,3,5} campaign (finite, of known size).**
   * Task: run `tmp/r3-outer-cert3.py` on the 628 entries of `used_p5_w002.json`.
   * Cost, measured on the five entries of 4.1: 2072–2366 box evaluations and 2464–2932 CPU-s each (mean 46
     CPU-minutes). For 628 entries that is about 480 CPU-hours: 5 days on 4 cores, or about 15 hours on 32 cores. All
     five entries passed at the first attempt.
   * Then rebuild the admission file with `tmp/r3-outer-certfile.py` and rerun `tmp/r3-outer-used2.py --cert` until the
     consumer path uses only certified entries. Entries with margin m < 0.0223 enter with their own shift, so the value
     can be slightly better than 0.145737.
   * If every entry passes, the result is Λ ≤ 0.145737084009444 (or better), conditional on the shared inputs only:
     Lemma B with BB1/BB2, the FLINT window, Raymond's chain G0, the multi-height consumer, MTY, H2, U2. It does not
     depend on any outer lemma. A failing entry falls back to Track A and costs value, not validity.
2. **Speed (optional, 10×).** Label factorisation: w_j = a_j ∏_q G_{q,j}(z_q)(1 + E_j) with exact one-prime ratios
   G_{q,j}(z) = F_q^{(≤N0/j)}(ρ_{qj} z)/F_q(z), binned in v_j. Exact τ-expansion of the time-tilt defect to order 3. Both
   target 4.3(1) and 4.3(3) and would allow half-width ≥ 0.4 boxes.
3. **Larger prefixes** (the 0.1448843 value itself). WOL-C at late cells for P = 13…47 needs 2 together with
   arc-restricted, re-centred η expansions for every prime of S. With |S| up to 15, a box search over all phases is out
   of reach. A route-P proof at margin 0.02 needs a different, structural argument for the primes above 5.
4. **Referee.** An independent check of r3core4.c (the cross-check above covers only the dangerous direction, at 43
   points), and an independent check of Lemma 1's arithmetic in the admission file.

---

## 7. Files

* Statement and replay: `tmp/r3-outer-used.py` and `tmp/r3-outer-used2.py` (filtered: `--pmax`, `--cert`),
  `tmp/r3-outer-consume.py`. Outputs: `tmp/r3-outer-out/used_w002.json` (630 entries), `used_p5_w002.json` (628 entries,
  S = {2,3,5} path), `replay_m0023_all.json`, `replay_m0023_w002.json`.
* Mixed consumer: `tmp/r3-outer-mixed.py` (`--pmax`, `--cert`, `--cellmin`, `--cellmax`, `--shift`).
  Admission file: `tmp/r3-outer-certfile.py` → `tmp/r3-outer-out/certfile_now.json` (9 entries with their shifts).
  Certified-only consumer output: `tmp/r3-outer-out/consumer_certified_only.txt`; its path: `used_certified_only.json`.
* Engine: `tmp/r3-outer-c/r3core4.c` (v4; earlier versions r3core_v1.c, r3core.c and r3core3.c are kept for provenance),
  `tmp/r3-outer-lib4.py` (base tables are read as S = {2,3,5}; NH = 0 is allowed for the three-angle search).
* Box searches: `tmp/r3-outer-cert.py`, `tmp/r3-outer-cert3.py`, `tmp/r3-outer-cert3-chain.sh`.
* Probes: `tmp/r3-outer-p5probe.py`, `tmp/r3-outer-p5nl3.py`, `tmp/r3-outer-test*.py` (the `*nd.py` scripts switch the
  defect off and are diagnostics only). Cross-check: `tmp/r3-outer-xcheck.py`.
* Certificates and logs: `tmp/r3-outer-out/cert_demo_*.json` (+ `.log` leaf lists, `.stdout`),
  `tmp/r3-outer-out/cert3_*_p*.json` (+ `.log`, `.stdout`), `xcheck_*.log`, `p5nl3_555.log`, `p5probe_*.log`.
