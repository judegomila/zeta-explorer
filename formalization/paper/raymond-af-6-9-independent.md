# Raymond AF Part I §§6–9 (the one-point input OP): independent derivation and re-computation (G0-d)

Date: 2026-10-02. Branch `editorial-redesign`, working files only (nothing committed).

Source: D. J. Raymond, *Analytic foundations for the time-zero upper-bound construction*, Part I §§6–9 (Zenodo 22867547,
v1.0, 21 September 2026; `tmp/raymond-22867547/Analytic_Foundations.pdf`, sha256 `fe06339d…53a9`). The numbers compared
against are Raymond's deposited probe rows:
* `PROBE_192.json`: lane A, 192 bit, sha256 `da297d96…a950`;
* `PROBE_256.json`: lane B, 256 bit, sha256 `f227aecb…aabc`;
* both under `/tmp/raymond_pr/pr/Proof_and_Replay/Evidence/numerical/parent_numerical/`;
* plan `PLAN.json`, sha256 `9a9e860d…0545`.

Grades used below:
* **PROVED**: a complete derivation is written in this document, with symbolic checks where stated. It is internal, and
  no non-project reader has read it.
* **CERTIFIED**: own code, arb ball arithmetic with outward rounding.
* **MEASURED**: floating point, sampling, or a non-interval computation.
* **HEURISTIC**.

**Outcome.**

* Every step of AF Part I §§6–9 was re-derived from the text. No ERROR was found. Each item below is graded SOUND; the
  text has eight expository GAPs, each with a one-paragraph fix (section 10).
* Every number the parent assembler takes from Raymond's producer without recomputing it was recomputed by independent
  code (`tmp/r4-g0d-*`): the prefix and time-derivative enclosures, the time debits, E_n, E_y and E_ℓ, the activation
  envelopes, and the exceptional-pair count and debit. The derived A±, B₊, perturbation and floor were recomputed as
  well.
  * Coverage: all 3,648 rectangles in both lanes.
  * Method: direct summation over every integer n ≤ N0 in arb (FLINT 3.6, C), not integer blocks.
  * Result: 252,320 comparisons, 0 failures (CERTIFIED). Each of Raymond's stored values is a valid bound for the
    independent enclosure.
  * Floors: his stored density floor is 7.2·10⁻⁶ to 1.2·10⁻⁵ below the own floor computed with his C.
  * Own floor table, with own minimal C: it lies 2.1·10⁻⁴ to 9.5·10⁻⁴ above the floors the joint consumer actually uses,
    in every cell.
* Same check at 2.6X (the numerical half of G0-d′ for §§6–9), on Raymond's producer re-run by s145 at
  X = 15600000009475, N0 = 1114185: also 252,320 comparisons, 0 failures (section 9).
* What this does not cover:
  * the AF §§4–5 constants (2·10⁻⁶, 2·10⁻⁴, the 10⁻⁶ in Re β/2), which are taken as inputs (refereed SOUND in
    `b145-raymond-referee-2026-10-01`);
  * the main-paper consumption of (OP) (Lemmas 2–4 / Theorem 4′, G0-c);
  * any external review.
* PT Λ ≤ 0.2 stands. RH open. NO QED.

| item | verdict | main evidence |
|---|---|---|
| §6 identity (6.1) and the cone lemma | SOUND | §2.1 proof; I1 symbolic; I2 3,000 random cases |
| §6 nonnegative product head (graph argument) | SOUND (GAP g7, expository) | §2.2 full proof; I3; arb c_m(t_R) ≥ 0, m ≤ 1024, 608 t_R; = Lemma CG (G0-a) |
| §6 closed forms (6.3) | SOUND (GAP g1, expository) | §2.3–2.4; I4 exact at N0 = 2000; direct label sums at the real N0 (§8.4) |
| exceptional-pair enumeration | SOUND | §2.6, §8.2; exact integer enumeration equals Raymond's term count in 7,296/7,296 records; debit ratio 1 to 1 + 1.2·10⁻⁶ |
| §7 κ bounds, second-derivative cap, (7.1), label identities | SOUND | §3; I5, I6 symbolic |
| §7 L-monotonicity, frequency coverage | SOUND | §3.4, §3.6; 3,040 monotonicity checks; s(X − 2) = 4.48·10⁻⁷ > 0 |
| §7 block enclosures | SOUND (GAP g2, expository) | §3.5; 13,376 × 4 stored enclosures contain the exact sums; 1,200 interior-time checks |
| §8 closed forms (8.1)–(8.3) | SOUND (GAP g6, expository) | §4 derivation from scratch; I7, I8; 2,088 actual-integer sums (max ratio 0.947) |
| §8.1 (8.4)–(8.5) | SOUND (GAP g3, precision of wording) | §5 |
| §9 cone in A, (9.1) | SOUND | §6.1–6.2; I9 |
| §9 E_ℓ cap | SOUND (GAP g4, expository) | §6.3; I10; 7,296 records, stored/own 1.000032–1.000033 |
| §9 (9.2) and its consumed form (main paper eq. (1)) | SOUND | §6.4–6.5; 20 direct actual-point checks |
| §9 lane-selection and assembly sentences | expository (GAP g5, g8) | §10 |
| the same numerical premises at 2.6X (s145 rows) | CERTIFIED, 0 failures | §9 |

---

## 0. Independence and scope

* The derivations are from the AF text: `Analytic_Foundations.pdf` pp. 7–10 and the identical markdown in the parent
  `PROOF.md`.
* Raymond's producer (`certify_coupled_probe.py`) and assembler (`assemble_coupled.py`) were read for two purposes only:
  to learn the meaning of the JSON fields, and to identify which fields the assembler takes from the producer without
  recomputing them (section 10, g8). No Raymond code is imported, copied or re-run.
* Own code:
  * prefix-sum engine `tmp/r4-g0d-prefix.c`: C, FLINT 3.6 arb, direct summation;
  * assembly and comparison `tmp/r4-g0d-rows.py`: python-flint 0.9.0, a different build from Raymond's pinned 0.8.0;
  * identities `tmp/r4-g0d-identities.py`: sympy, mpmath;
  * activation sums `tmp/r4-g0d-actsum.py`: numpy;
  * direct actual points `tmp/r4-g0d-direct.py`: numpy with arb phases;
  * library cross-check `tmp/r4-g0d-mpcheck.py`: mpmath.
* Common-mode exposure:
  * Both the own engine and Raymond's producer use arb. Different builds and versions, and a different algorithm (no
    blocks).
  * mpmath reproduces three complete engine packs to ≤ 4.9·10⁻²³ relative, inside the arb balls.
* Inputs from AF §§4–5, taken as given:
  * H_t/B_t = f + R with |R| < 2·10⁻⁶ and |R_y| < 2·10⁻⁴ on each probe disk;
  * Re(β_t(a)/2) > L/4 − 10⁻⁶;
  * the leading-source conventions s_U^0, s_V^0, γ0 with |γ(x,t,0)| = 1.

## 1. Objects (from the AF text)

**Constants and variables.**
* X = 6000000185827, N0 = 690988, v0 = log N0, δ = 10⁻¹², b_t(n) = exp(t log²n/4).
* At a probe point x + ih and time t: L = log(x/4π) and s = L/2 − v0.
* σ_U = (1+h)/2 + tL/4, σ_V = σ_U − h, θ = x/2 + πt/8.

**Euler factor.**
* E_t(s) = Π_{p∈{2,3,5}} (1 − b_t(p)p^{−s}) = Σ_{d|30} m_d d^{−s}.
* m_d = μ(d)β_d, with β_d = Π_{p|d} b_t(p) = e^{t q_d/4} and q_d = Σ_{p|d} log²p.
* a_p := b_t(p)p^{−σ_U}. Then Σ_d |m_d|d^{−σ_U} = Π_p(1 + a_p) =: E_+ and Σ_d |m_d|d^{−σ_U} log d =: E_1.

**Target.** S(x,h,t) := −Im(H_t′/H_t)(x+ih) = ∂_y log|H_t(x+iy)| at y = h (since ∂_y = i∂_z on holomorphic functions).

**Core.** Q = E_t(s_U^0)·f with f = P_N(s_U^0) + γ0 P_N(s_V^0) and N = ⌊√(x/4π + t/16)⌋. Its labels, with phases of unit
modulus:

| label | amplitude a | frequency λ |
|---|---|---|
| head m ≤ N0 (m = 1 is the constant) | c_m(t) m^{−σ_U}, c_m = Σ_{d∣(m,30)} μ(d)β_d b_t(m/d) | log m |
| tail (d,n), d∣30, N0/d < n ≤ N0 | β_d b_t(n)(dn)^{−σ_U} | log(dn) > v0 |
| reflected (d,n), d∣30, n ≤ N0 | β_d d^{−σ_U} e^{−hL/2} b_t(n) n^{−σ_V} | L − log n + log d ≥ v0 |
| activated (d,n), N0 < n ≤ N, both branches | same formulas | log(dn) > v0; L − log n + log d ≥ v0 − δ |

Set A = Σ_{j>0} a_j, B = Σ λ_j a_j and V = Σ λ_j a_j z_j.

## 2. §6

**2.1 Identity (6.1). PROVED.** Write Q = Σ_{i≥0} a_i z_i (a_0 = 1, z_0 = 1, λ_0 = 0) and V = Σ λ_i a_i z_i.
1. C|Q|² − Re(VQ̄) = Σ_{i,j} a_i a_j (C − λ_i) Re(z_i z̄_j). Symmetrising,
   = Σ_i a_i²(C − λ_i) + Σ_{i<j} a_i a_j (2C − λ_i − λ_j) Re(z_i z̄_j).
2. (1+A)[C(1+A) − B] = Σ_{i,j} a_i a_j (C − λ_j) = Σ_i a_i²(C − λ_i) + Σ_{i<j} a_i a_j(2C − λ_i − λ_j).
3. Subtracting gives the AF identity. Since Re(z_i z̄_j) − 1 ∈ [−2, 0], every pair term is ≥ −2a_ia_j(2C − λ_i − λ_j)_+.
   This is (6.1).
4. If the right side is > 0, then Q ≠ 0 and Re(V/Q) = Re(VQ̄)/|Q|² < C.

Checks: symbolic for the constant plus 4 labels (I1); 3,000 random configurations (I2).

**2.2 Nonnegative product head. PROVED.**
1. Write m ≤ N0 as a product of labelled prime occurrences p_1⋯p_k, ℓ_i = log p_i. Then
   b_t(m) = Π_i b_t(p_i) Π_{i<j}(1 + r_ij), with r_ij = e^{tℓ_iℓ_j/2} − 1 ≥ 0. So
   b_t(m) = Π_i b_t(p_i) Σ_G w(G), summed over simple graphs G on {1,…,k}, with w(G) = Π_{ij∈G} r_ij.
2. For each p ∈ P := {p ∈ {2,3,5} : p | m}, fix a marked occurrence i_p. For D ⊆ P and d = Π_D p, m/d is the product of
   the unmarked-by-D occurrences. Hence β_d b_t(m/d) = Π_i b_t(p_i) Σ_{G : i_p isolated ∀p∈D} w(G).
3. Therefore c_m = Π_i b_t(p_i) Σ_G w(G) Σ_{D ⊆ I(G)} (−1)^{|D|}, where I(G) = {p ∈ P : i_p isolated in G}. The inner
   sum is [I(G) = ∅]. So

   c_m(t) = Π_i b_t(p_i) · Σ_{G : every marked occurrence has degree ≥ 1} w(G) ≥ 0,

   and every factor is nondecreasing in t ≥ 0.
4. For m ≤ N0, every d | (m,30) has m/d ≤ N0, so this is the complete coefficient.
5. c_p = 0 for p ∈ {2,3,5}: there is one vertex, and it is isolated.

This is the content of Lemma CG (`cg-monotonicity.md`, G0-a). AF's sentence compresses steps 2–3 (g7).

Checks:
* I3: covering form = Dirichlet form for all 69 occurrence patterns over {2,3,5,7}, k ≤ 4 (sympy).
* CERTIFIED: c_m(t_R) ≥ 0 for m ≤ 1024 at all 608 t_R.

**2.3 Closed forms (6.3). PROVED.**
1. Σ_{m≤N0} c_m m^{−σ} = Σ_{d|30} m_d d^{−σ} P^{(0)}_{⌊N0/d⌋}.
2. Adding the tail labels Σ_d |m_d|d^{−σ}(P^{(0)}_{N0} − P^{(0)}_{⌊N0/d⌋}), removing the constant, and using
   m_d − |m_d| = −2|m_d|·[μ(d) < 0]:

   A_U = E_+P^{(0)}_{N0} − 1 − 2Σ_{μ(d)<0}|m_d|d^{−σ}P^{(0)}_{⌊N0/d⌋}.
3. With weight log(dn) = log d + log n, the same steps give B_U as in (6.3).

Check I4: both identities against direct label sums at N0 = 2000 for four (t, σ) pairs, |difference| ≤ 4.7·10⁻³⁸. At the
real N0, the masses A and B were computed straight from the label list (Dirichlet-convolution heads, tail, reflected and
activated labels) at 10 actual points. They lie in Raymond's [A₋, A₊], and B ≤ B₊ (section 8.4).

**2.4 Reflected masses (not displayed in AF; g1). PROVED.** Summing the reflected row of the table:

A_V = e^{−hL/2} E_+ P^{(0)}_{N0}(σ_V),  B_V = e^{−hL/2}[E_+(L P^{(0)}_{N0}(σ_V) − P^{(1)}_{N0}(σ_V)) + E_1 P^{(0)}_{N0}(σ_V)],

with E_+ and E_1 at σ_U.

**2.5 Q_y = −V/2. PROVED.**
* At fixed x, t and N, each label amplitude depends on y only through e^{−λ(y−h)/2}:
  * first branch: (dn)^{−(1+y)/2};
  * reflected: e^{−yL/2} d^{−(1+y)/2} n^{−(1−y)/2}.
* Its phase does not depend on y.

Check: I5b (symbolic).

**2.6 Exceptional set. PROVED.**
1. All λ ≥ 0. Tail, reflected and activated labels have λ ≥ v0 − δ.
2. If 2C < v0 − δ, every pair containing such a label has λ_i + λ_j > 2C, so it contributes 0 to D_C.
3. The remaining pairs are head pairs m < n (m = 1 allowed) with log(mn) < 2C. Equivalently mn ≤ ⌊e^{2C}⌋: for rational
   C ≠ 0, e^{2C} is irrational.
4. For C < 17/5, e^{2C} < e^{6.8} = 897.85 < 1024.
5. Labels p ∈ {2,3,5} have zero amplitude (2.2).
6. Since c_m is nondecreasing in t and m^{−σ_U} is nonincreasing in t and L,
   a_m a_n ≤ c_m(t_R)c_n(t_R)(mn)^{−σ_min} with σ_min = (1+h)/2 + t_L L_lo/4.
   This is AF's "upper time, lower abscissa".

## 3. §7

**3.1 κ. PROVED.**
* The label amplitude is c_{d,n}(h,L)e^{tκ_{d,n}} with κ = (q_d + v² − L(v + v_d))/4, for both branches (I5).
* Upper bound: v(v − L) ≤ 0 for 0 ≤ v ≤ v0 ≤ L/2, and q_d − Lv_d = Σ_{p|d} log p (log p − L) ≤ 0. So κ ≤ 0.
* Lower bound: κ ≥ −L(v + v_d)/4 ≥ −L(v0 + log 30)/4 = −K_L.

**3.2 Second derivative and (7.1). PROVED.**
* A_0 = Σ (sign)·c e^{tκ} + const, so A_0″ = Σ (sign)·c κ² e^{tκ}.
* For t ∈ [t_L, t_R]: |A_0″(t)| ≤ K_L² Σ |coefficient|·c e^{t_L κ} = K_L² A_abs(t_L), because κ ≤ 0. The same holds for B_0,
  whose frequencies do not depend on t.
* (7.1) is Taylor's formula at t_m with the Lagrange remainder.
* A_abs as written (coefficient 1 + 2 on each subtracted head label) is a valid cap. Using |net coefficient| = 1 would
  also be valid and slightly smaller; this is information only, not used.

**3.3 Derivative identities. PROVED.** Both expanded identities hold symbolically (I6). With the frequency weights v + v_d
and L − v + v_d they give B_0′ from the moments Σ e_n vᵏ, k ≤ 3.

**3.4 L-monotonicity. PROVED.** The L-dependence of each label, at fixed t:
* Head and tail amplitudes carry e^{−tL·log(dn)/4}, so they are nonincreasing in L.
* Reflected amplitudes have ∂_L log = −h/2 − t(v + v_d)/4 < 0.
* Reflected weighted terms have ∂_L log[(L − v + v_d)·amplitude] ≤ 1/(L − v + v_d) − h/2 < 0, since L − v + v_d ≥ v0 and
  h v0 ≥ 9.2777 > 2 (minimum over the plan).
* First-branch frequencies do not depend on L.

So at every t, A_0 and B_0 are nonincreasing in L. Their supremum over the rectangle is at s_lo; the infimum of A_0 is at
s_hi. CERTIFIED at the six stored frequencies of every cell: 3,040 checks, 0 failures.

**3.5 Block enclosures (g2). PROVED (validity) and CERTIFIED (numbers).**
* First branch: for v ≤ v0 ≤ L/2, d/dv(tv²/4 − σ_U v) = tv/2 − σ_U ≤ −(1+h)/2 < 0. So b_t(n)n^{−σ_U} decreases in n, and a
  block sum lies in cnt·[f(n_end), f(n_start)].
* Reflected: the exponent tv²/4 − σ_V v is convex. Its minimum on a block is at an endpoint or at v = 2σ_V/t, with value
  exp(−σ_V²/t).
* The log-weights enter as interval factors.

AF states only the reflected case.

Numerically:
* Every stored enclosure (midpoint A, midpoint B, ∂_tA, ∂_tB at both frequency endpoints) contains the exact
  direct-summation value. That is 13,376 records per field (both lanes, both endpoints).
* The exact values sit at relative position 0.4999–0.5001 of the stored intervals.
* The stored widths are 0.03–0.45 % of |value| (lane B) and 0.09–2.2 % (lane A).

**3.6 Frequency coverage. CERTIFIED.**
* s(X − 2) = log((X−2)/4π)/2 − v0 = 4.4812·10⁻⁷ > 0. So s ≥ 0 and N(x,t) ≥ N0 for every x ≥ X − 2.
* The six intervals [0, 1/20], …, [2, ∞) cover [0, ∞).

## 4. §8: the closed forms (8.1)–(8.3), derived from scratch

**Activated range.** log N ≤ ½log(x/4π + t/16) = L/2 + ½log(1 + πt/(4x)) ≤ v0 + s + δ, because πt/(8x) < 10⁻¹³. With
v = log n = v0 + w, the activated labels have 0 < w ≤ s + δ.

**Amplitudes.**
* First branch: e^{tv(v−L)/4 − (1+h)v/2}. Reflected: e^{−hL/2 + tv(v−L)/4 − (1−h)v/2}.
* Since 0 < v < L, v(v − L) < 0, so both decrease in t. They are bounded at t_L.
* With L = 2(v0 + s): tv(v − L)/4 = −tv0²/4 − tsv0/2 + t(w²/4 − sw/2).
* On 0 < w ≤ s + δ, t(w²/4 − sw/2) ≤ tδ²/4. The quadratic is convex, equal to 0 at w = 0 and to t(δ² − s²)/4 at w = s + δ.

**Sum to integral.**
1. Write g(u) for the summand at real u = e^v. Then Σ_{N0<n≤N} g(n) ≤ e^{β/N0} ∫_{N0}^N g(u) du, where β bounds
   d log g / d log u from above.
2. First branch: d log g/d log u = t(v − L/2)/2 − (1+h)/2 < 0, so β = 0.
3. Reflected: d log g/d log u ≤ (h−1)₊/2 + tδ/2 ≤ 0.59 + 10⁻¹³ < 1. The bound (n/(n−1))^β ≤ e^{1/N0} holds for n ≥ N0 + 1.
4. The weights v/2 (log-growth < 0.075 < (1+h)/2) and (L − v)/2 (decreasing) do not raise β.
5. With du = e^v dv, at t = t_L the integrands (Jacobian included) are at most:
   * first branch: C0 e^{−a0 s}e^{bw}·e^{t_Lδ²/4};
   * reflected: C0 e^{−c0 s}e^{b₊w}·e^{t_Lδ²/4}, using e^{−hL/2} = e^{−hv0 − hs}.
6. Here C0 = e^{−t_L v0²/4 + bv0}, a0 = t_Lv0/2, b = (1−h)/2, b₊ = (1+h)/2, c0 = a0 + h.
7. The weights λ/2 are (v0 + w)/2 (first branch) and (L − v)/2 = (v0 + 2s − w)/2 (reflected).

**Finite interval s ∈ [l, u]: (8.1) and (8.2).**
* Use e^{−a0s} ≤ e^{−a0l} and e^{−c0s} ≤ e^{−c0l}.
* Extend the w-range to [0, u + δ]; the integrands are positive.
* For the reflected weight, v0/2 + s − w/2 ≤ v0/2 + u + δ − w/2, which is positive on [0, u + δ].
* With J0(β,z) = ∫_0^z e^{βw}dw = (e^{βz} − 1)/β and J1(β,z) = ∫_0^z we^{βw}dw = (e^{βz}(βz − 1) + 1)/β², with the limits
  z and z²/2 at β = 0 (I7), this is exactly (8.1)–(8.2).

**Infinite interval s ≥ l: (8.3).** Split ∫_0^{s+δ} = ∫_0^{l+δ} + ∫_{l+δ}^{s+δ}.
1. Monotonicity in s. The function e^{−c0s}(v0/2 + s − w/2) has s-derivative e^{−c0s}[1 − c0(v0/2 + s − w/2)]. For
   s ≥ max(l, w − δ), v0/2 + s − w/2 ≥ v0/2 − δ, so c0(v0/2 + s − w/2) ≥ c0(v0/2 − δ) > 1, because min c0v0 = 22.545
   over the plan. So the function is nonincreasing in s. This is AF's "c0v0 > 2".
2. On the first piece, take s = l.
3. On the second piece (w ≥ l + δ, so s ≥ w − δ):
   * e^{−a0s} ≤ e^{a0δ}e^{−a0w};
   * e^{−c0s}(v0/2 + s − w/2) ≤ e^{c0δ}e^{−c0w}(v0/2 + w/2 − δ).
4. With k = a0 − b = c0 − b₊ > 0 (minimum over the plan 0.5884), extend the lower limit from l + δ to l:
   ∫_l^∞ e^{−kw}dw = e^{−kl}/k and ∫_l^∞ we^{−kw}dw = e^{−kl}(l/k + 1/k²).
5. This gives exactly the AF replacements and (8.3). The stated reflected weights (v0/2 + l + δ − w/2 and
   (v0 + l + 2δ)/(2k)) dominate the derived ones.

**Factor.** The total extra factor is e^{1/N0 + t_Lδ²/4 + c0δ}, with e^{a0δ} ≤ e^{c0δ}. Its exponent is at most
1.4472·10⁻⁶ over all 608 cells, below AF's 10⁻⁵. Hence (8.1)–(8.3) with the factor C0e^{10⁻⁵} are valid. PROVED.

Checks:
* I8: the envelopes without the e^{10⁻⁵} factor dominate the exact w-integrals at 861 (h, t, s) points. Max ratio 0.951.
* Actual integer sums N0 < n ≤ N(x,t) at 2,088 (s, t) points in 24 cells, including s up to 3.2 on the infinite row
  (N ≤ 1.7·10⁷). The sums, times the Euler weights at the actual (t, L), stay below Raymond's stored values. Max ratio
  0.947 (MEASURED).
* The own closed forms are below the stored values in all 7,296 records. Ratio 1.000012–1.000014 (CERTIFIED).

## 5. §8.1: (8.4)–(8.5). PROVED (g3)

**(8.4).** The activated labels are kept separate, with absolute amplitudes:
* A_new = Σ_{d,n}|m_d|d^{−σ_U}·amp_n = E_+·Σ amp_n;
* B_new = Σ_{d,n}|m_d|d^{−σ_U}(λ_n + log d)·amp_n ≤ 2E_+D_act + E_1 A_act.

So (8.4) holds with E_n ≥ E_+ = Π_p(1 + a_p) and E_y ≥ E_1/2 = ½Σ_d|m_d|d^{−σ_U} log d. These are ℓ¹ coefficient norms.
A bound on |E| alone would not suffice. Raymond's E_n = Π(1 + a_pe^{ε}) and E_y = (½ + ε)E_nΣ log p·a_pe^ε/(1 + a_pe^ε)
are exactly these norms, inflated (stored/own 1.0000034–1.0000047 and 1.000032–1.000033).

**(8.5).**
* |E·R| ≤ E_+·2·10⁻⁶.
* |(E·R)_y| ≤ |E||R_y| + |E_y||R| ≤ 2·10⁻⁴E_n + 2·10⁻⁶E_y.

## 6. §9

**6.1 Cone in A. PROVED.** Let g(A) = (1+A)[C(1+A) − B₊] − D_C.
* If g(A₋) > 0, then C(1+A₋) > B₊.
* Then g′(A) = 2C(1+A) − B₊ > 0 on [A₋, ∞), so g(A) ≥ g(A₋) > 0 for every actual A ∈ [A₋, A₊].
* With B ≤ B₊ and actual D_C ≤ the stored D_C, (6.1) is positive at the actual masses.

**6.2 (9.1). PROVED.**
* (Q+R)_y/(Q+R) − Q_y/Q = [QR_y − Q_yR]/[Q(Q+R)].
* |Q| ≥ 1 − A ≥ g := 1 − A₊, |Q + R| ≥ g − R0, |Q_y| = |V|/2 ≤ B₊/2.
* This gives the bound (R1 + B₊R0/(2g))/(g − R0). Check I9: 20,000 random cases.

**6.3 E_ℓ cap (g4). PROVED.**
* ∂_y log(1 − b_t(p)p^{−s}) = (b_t(p)p^{−s} log p·s_y)/(1 − b_t(p)p^{−s}), with s_y = ½ for s = s_U^0.
* So |∂_y log E| ≤ ½Σ_p log p·a_p/(1 − a_p).
* Here a_p = exp(t(log²p − L log p)/4 − (1+h)log p/2). This decreases in t and in L, because log p < L. So the
  maximum over the rectangle is at (t_L, L_lo). This is where the producer evaluates it, but the text does not say so.
* AF's (½ + 10⁻⁵) and e^{10⁻⁵} are extra room.

Checks: I10 (random phases, ratio ≤ 0.9984); stored/own 1.000032–1.000033 in all 7,296 records.

**6.4 (9.2). PROVED.**
1. S = Re(β_t(a)/2) + Re ∂_y log(Q + E·R) − Re ∂_y log E.
2. Re(β_t(a)/2) > L/4 − 10⁻⁶.
3. Re(Q_y/Q) = −Re(V/Q)/2 > −C/2.
4. The difference (9.1) is at most pert, and Re ∂_y log E ≤ E_ℓ.
5. L/4 = (v0 + s)/2 ≥ (v0 + s_lo)/2.
6. Nonvanishing: |E| ≥ Π(1 − a_p) > 0 and |Q + ER| ≥ g − R0 > 0.

**6.5 The consumed form. PROVED.** Keep the two dropped nonnegative terms instead of bounding them by zero:

S > ℓ + (C|Q|² − Re(VQ̄))/(2|Q|²) + (E_ℓ − Re((E_t)_h/E_t)),

where ℓ is the rounded-down floor. This is main-paper eq. (1), the form of (OP) used by Lemmas 2–4 / Theorem 4′. Both
added terms are ≥ 0 by 6.1 and 6.3.

## 7. Independent computations (methods)

**Prefix engine** (`tmp/r4-g0d-prefix.c`, CERTIFIED).
* For every cell and the 12 packs (t ∈ {t_m, t_L}) × (s ∈ {0, 1/20, 3/20, 2/5, 1, 2}), with L = 2(v0 + s), it computes:
  * F_k(M) = Σ_{n≤M} e_n vᵏ (k ≤ 3) at M ∈ {N0/30, N0/5, N0/3, N0/2, N0}, where e_n = b_t(n)n^{−σ_U};
  * G_k = Σ_{n≤N0} r_n vᵏ, where r_n = e_n n^h.
* Every integer n ≤ N0 is summed in arb at 96 bit, with log n at 128 bit.
* Output: 7,296 packs × 24 balls, radius ≈ 10⁻²³ relative.
* Cost: 4 × 455 s.

**Assembly** (`tmp/r4-g0d-rows.py`, CERTIFIED). From those sums and §§2–6:
* A, B, ∂_tA, ∂_tB, A_abs, B_abs and the (7.1) debits;
* minimal valid E_+, E_1/2, E_ℓ at (t_L, L_lo);
* the activation envelopes, with the minimal factor of section 4;
* the exact enumeration {m < n ∉ {2,3,5}, mn ≤ ⌊e^{2C}⌋}, with c_m(t_R) at 320 bit and ⌊e^{2C}⌋ certified;
* the cone at Raymond's C, R0, R1, pert and the floor (9.2).
Every stored field is then compared with these values (section 8).

**Further checks.**
* `tmp/r4-g0d-interior.py`: exact A and B at 5 interior times of 20 cells, against the stored prefix bounds; and
  L-monotonicity.
* `tmp/r4-g0d-actsum.py`: actual activated integer sums.
* `tmp/r4-g0d-direct.py`: label masses from the label list and the core at 10 actual points. The phases are reduced
  mod 2π in arb. The unknown phase of γ(x,t,0) takes 16 values.
* `tmp/r4-g0d-mpcheck.py`: mpmath repeat of three packs.
* `tmp/r4-g0d-ownfloor.py`: own floor table with own minimal C (bisection on a 10⁻⁹ grid, each tested C rigorous).
* `tmp/r4-g0d-facts.py`: domain facts.

## 8. Results against Raymond's numbers (X, both lanes)

### 8.1 Stored fields

All 38 comparison types, 252,320 comparisons, 0 failures (`tmp/r4-g0d-out/rows_summary.json`; per-record detail in
`rows_detail.jsonl`). "Stored/own" is the ratio of Raymond's value to the own value.

| stored field | relation | records | failures | stored / own |
|---|---|---|---|---|
| midpoint A, midpoint B, ∂_tA, ∂_tB (both frequency endpoints) | contains exact value | 13,376 each | 0 | exact value at 0.4999–0.5001 of the interval |
| At_abs, Bt_abs, A_second, B_second, A_debit, B_debit | ≥ own | 13,376 each | 0 | — |
| Euler_norm_upper E_n | ≥ E_+ | 7,296 | 0 | 1.0000034–1.0000047 |
| Euler_derivative_norm_upper E_y | ≥ E_1/2 | 7,296 | 0 | 1.000032–1.000033 |
| Euler_log_derivative_upper E_ℓ | ≥ own | 7,296 | 0 | 1.000032–1.000033 |
| activation_amplitude_upper | ≥ own (8.1)/(8.3)·E_+ | 7,296 | 0 | 1.000012–1.000013 |
| activation_weighted_moment_upper | ≥ own (8.2)/(8.3), (8.4) | 7,296 | 0 | 1.0000126–1.0000142 |
| amplitude_upper A₊ | ≥ own | 7,296 | 0 | lane A 1.00039–1.00138, lane B 1.00014–1.00053 |
| amplitude_lower A₋ | ≤ own | 7,296 | 0 | own/stored: A 1.00044–1.00139, B 1.00016–1.00053 |
| weighted_moment_upper B₊ | ≥ own | 7,296 | 0 | A 1.00087–1.00298, B 1.00034–1.00117 |
| exception_terms | = own exact count | 7,296 | 0 | identical |
| exception_debit_upper D_C | ≥ own | 7,296 | 0 | 1 to 1 + 1.2·10⁻⁶ |
| cone at the stored C | > 0 with own bounds | 7,296 | 0 | own margin ≥ 1.74·10⁻⁴ (stored margins ≥ 10⁻⁷) |
| A₊ < 4/5, C < 17/5, 2C < v0 − 10⁻¹², ⌊e^{2C}⌋ < 1024, g > R0 | holds | 7,296 | 0 | — |
| log_derivative_perturbation_upper | ≥ own | 7,296 | 0 | A 1.000054–1.000614, B 1.000022–1.000240 |
| density_lower | ≤ own floor (9.2) at the stored C | 7,296 | 0 | own − stored ∈ [7.18·10⁻⁶, 1.21·10⁻⁵] |

### 8.2 Exceptional pairs

The stored C ranges over 0.5093–1.4153, so ⌊e^{2C}⌋ ∈ [2, 16]. Consequences:
* Every exceptional pair in the run is a constant–head pair (1, n), with n ∈ {4, 6, 7, …, 16}. Any pair with m ≥ 4 has
  mn ≥ 24.
* Records with ≥ 1 term: 2,797 (lane A) and 2,792 (lane B). At most 12 terms per record.
* The largest own D_C is 0.1193 (cell 350, row 3). So the debit matters numerically.
* The bounds C < 17/5 and e^{2C} < 1024 hold with large room.

### 8.3 Time and frequency sampling (CERTIFIED values at sampled points)

* Exact A and B at 100 interior times (5 in each of 20 cells), × 6 rows × 2 lanes = 1,200 checks, all inside the stored
  prefix bounds. Minimum slack 6.19·10⁻⁴ (A) and 1.25·10⁻³ (B).
* L-monotonicity: 3,040 checks, 0 failures.

### 8.4 Direct actual points (MEASURED)

10 points × 2 lanes:
* cells 0–607, all six frequency rows;
* N between 703,890 and 5,314,118;
* 16 values of the γ phase at each point.

Results, 0 failures:
* The label-list masses lie in the stored [A₋, A₊], and B ≤ B₊.
* min_γ(C − Re(V/Q)) ≥ 0.46.
* L/4 − 10⁻⁶ + Re(f_y/f) − pert − ℓ ≥ 0.536.

The actual phases are far from the worst case that (6.1) covers.

### 8.5 Activated sums and the library cross-check

* Activated integer sums: 2,088 points, 0 violations, max actual/stored 0.947 (MEASURED).
* mpmath repeat of the packs (cell 0, t_L, s = 0), (400, t_m, 2/5) and (607, t_m, 2): max relative difference
  2.8·10⁻²³, 4.9·10⁻²³ and 2.1·10⁻²³, inside the arb balls.

### 8.6 Own floor table (CERTIFIED given AF §§4–5; `tmp/r4-g0d-out/ownfloor.json`)

With own bounds and the own minimal admissible C (range 0.5089–1.4112):

| comparison | per-cell floor difference (own − compared) |
|---|---|
| parent common floor (min of lanes) | [5.94·10⁻⁴, 2.34·10⁻³] |
| joint consumer's floors (stronger lane per rectangle, `joint_common.parent_rows`) | [2.12·10⁻⁴, 9.52·10⁻⁴] |
| best lane, per rectangle | [9.43·10⁻⁵, 9.55·10⁻⁴] |

* No cell or rectangle has an own floor below Raymond's.
* The lowest own cell floor is cell 325: 5.767418688044. Compare the common floor 5.765076125707 and the joint selection
  5.766467174533.
* Possible gain, HEURISTIC: the b145 lever sweep gives dΛ/d(floor) ≈ −0.015. So an exact-sum producer would move Λ by
  ≈ 10⁻⁵. This is not pursued.

## 9. 2.6X (numerical part of G0-d′ for §§6–9)

**Rows compared.**
* `/tmp/s145-1-archive/XW2.6/PROBE_192.json`: lane A, sha256 `78412899…c53b`.
* `/tmp/s145-1-archive/XW2.6/PROBE_256.json`: lane B, sha256 `4ecedc94…4202`.
* These are Raymond's producer, re-run by the s145 task at X = 15600000009475, N0 = 1114185, with the same PLAN.
* The same scripts were run with `R4G0D_N0=1114185`. The engine passes N0 as its 4th argument; the cut points are 37139,
  222837, 371395, 557092 and 1114185. Cost 4 × 858 s. Outputs are in `tmp/r4-g0d-out/xw26/`.

**Domain facts (CERTIFIED).**
* s(X − 2) = 1.3801·10⁻⁷ > 0.
* min hv0 = 9.607, min k = 0.5885.
* Budget 1/N0 + tδ²/4 + c0δ ≤ 8.98·10⁻⁷ < 10⁻⁵.
* Sections 2–6 use only N0, v0 = log N0, s ≥ 0 (so L ≥ 2v0), hv0 > 2, c0v0 > 2, k > 0, 2C < v0 − δ and this budget, all
  verified at 2.6X. So the §§6–9 derivations transfer verbatim.

**Results (CERTIFIED).** 38 comparison types, 252,320 comparisons, 0 failures (`xw26/rows_summary.json`).
* Stored C ranges over 0.3952–1.1785. So ⌊e^{2C}⌋ ≤ 10 and there are ≤ 6 exceptional terms: pairs (1, n),
  n ∈ {4, 6, 7, 8, 9, 10}. 2,498 (lane A) and 2,491 (lane B) records have ≥ 1 term. All counts equal the own
  enumeration.
* The stored density floors (6.0861–7.5508) lie 6.87·10⁻⁶ to 1.19·10⁻⁵ below the own floor at the stored C.
* Stored A₊ / own A₊: 1.00034–1.00131 (lane A), 1.00012–1.00051 (lane B).

**Own floor table (`xw26/ownfloor.json`).**

| comparison | per-cell floor difference (own − compared) |
|---|---|
| common floor | [6.00·10⁻⁴, 1.92·10⁻³] |
| joint selection | [2.16·10⁻⁴, 7.82·10⁻⁴] |
| best lane, per rectangle | [7.12·10⁻⁵, 7.82·10⁻⁴] |

The lowest own cell floor is cell 325: 6.088047451177 (common 6.086131609454, joint selection 6.087265795689).

**Scope.**
* This re-certifies the §§6–9 numerical premises of the 2.6X rows, given the AF §§4–5 constants at 2.6X.
* The X-transfer of §§4–5 (R0, R1, the 10⁻⁶ in Re β/2, the wall at 2.6X) is the written part of G0-d′. It is not
  addressed here.
* The interior-time, activation-sum, direct-point and mpmath checks were run at X only.

## 10. GAP list (all expository; each with a fix)

* **g1 (§6, reflected masses).** The masses are described in words only. Fix: display A_V and B_V as in 2.4.
* **g2 (§7, blocks).** The text states only the reflected convexity. Fix: add the first-branch monotonicity
  tv/2 − σ_U ≤ −(1+h)/2 (L ≥ 2v0), the reflected minimum exp(−σ_V²/t) at v = 2σ_V/t, and "log-weights as interval
  factors".
* **g3 (§8.1, wording of (8.4)).** "E_n, E_y bound the Euler value and height derivative" should read: E_n ≥ Σ_{d|30}
  |m_d|d^{−σ_U} = Π_p(1 + b_t(p)p^{−σ_U}) and E_y ≥ ½Σ_{d|30}|m_d|d^{−σ_U} log d, the ℓ¹ norms. They then also bound
  |E| and |∂_yE| as (8.5) needs. The implementation uses these norms, so no number changes.
* **g4 (§9, evaluation point).** State that E_ℓ, E_n and E_y are evaluated at (t_L, left frequency endpoint), and why:
  a_p decreases in t and L because log p < L.
* **g5 (§9, lanes).** "then the weaker of the two lanes" describes the parent assembly. The main paper's joint consumer
  takes the stronger lane per rectangle (`joint_common.parent_rows`). Fix: state that each lane is a complete
  certificate on its own. Both lanes are re-certified here, so either selection is valid.
* **g6 (§8, constants).** The reflected log-growth is (h−1)₊/2 + tδ/2. The tail split costs e^{a0δ} and e^{c0δ}; "the
  overlap is included twice" is only part of the reason. Fix: display the per-row budget
  1/N0 + tδ²/4 + c0δ < 10⁻⁵ (max 1.4472·10⁻⁶), which the producer asserts.
* **g7 (§6, head).** The graph argument is compressed. Fix: the four-line proof of 2.2, or cite Lemma CG.
* **g8 (§9, "the exact assembly independently reconstructs (7.1), (8.4)–(8.5), the moment cone, and (9.1)–(9.2)").**
  The parent assembler re-does only the scalar arithmetic on stored producer fields. E_ℓ, E_n, E_y, D_C, the activation
  envelopes and the prefix and derivative enclosures are producer outputs (two arb lanes, same library). Fix: say so.
  This document is the first recomputation of those fields by independent code.

## 11. What is established, what is not

**Established.**
* AF Part I §§6–9 re-derived (PROVED in the internal sense above). No ERROR.
* All producer-trusted numerical inputs of (OP), at X, in both lanes: independently recomputed and found valid
  (CERTIFIED).

**Not established here.**
* The AF §§4–5 constants (inputs).
* Main-paper Lemmas 2–4 / Theorem 4′ (G0-c). This includes the first-head amplitude lower bounds a_{j,n} and the
  Euler-harmonic gains computed in `certify_joint.py`.
* The written X-transfer of §§4–5 to 2.6X (G0-d′, written part).
* Any non-project reading.
* This document has not had an adversarial referee pass.

**Ledger suggestion.**
* G0-d: open → "independently re-derived and re-computed (internal); write-up unrefereed".
* G0-d′: the §§6–9 numerical premises at 2.6X are re-certified (section 9). The written §§4–5 X-transfer remains open.
* After one adversarial internal pass, G0-d can be graded like G0-a: proved and internally refereed for the written part,
  certified for the numbers.

**Next steps.**
1. An adversarial internal referee of this document and of `r4-g0d-prefix.c` / `r4-g0d-rows.py`.
2. Write the g1–g8 fixes into the project's chain write-up.
3. The written part of G0-d′.

PT Λ ≤ 0.2 stands. RH open. NO QED.

## 12. Files

* Scripts:
  * `tmp/r4-g0d-identities.py` (I1–I10; sympy + mpmath, `/tmp/s145venv`);
  * `tmp/r4-g0d-prefix.c` (engine; binary `tmp/r4-g0d-out/r4-g0d-prefix`);
  * `tmp/r4-g0d-rows.py`, `tmp/r4-g0d-interior.py`, `tmp/r4-g0d-ownfloor.py`, `tmp/r4-g0d-facts.py`, `tmp/r4-g0d-direct.py`
    (`/tmp/refCvenv`);
  * `tmp/r4-g0d-actsum.py`, `tmp/r4-g0d-mpcheck.py` (`/tmp/rhvenv`).
* Outputs in `tmp/r4-g0d-out/`:
  * `prefix_part{0..3}.txt` (7,296 packs);
  * `rows_summary.json`, `rows_detail.jsonl`, `rows.log`;
  * `interior.json`, `actsum.json`, `direct.json`, `mpcheck.json`, `ownfloor.json`, `facts.json`;
  * `cells.txt`, `cells_interior*.{txt,json}`;
  * `xw26/` (2.6X run).
* Re-run:
  * `cc -O2 -I/opt/homebrew/include -L/opt/homebrew/lib tmp/r4-g0d-prefix.c -lflint -lgmp -lmpfr`;
  * the engine over cells 0–607 (4 processes, ≈ 8 min);
  * `/tmp/refCvenv/bin/python tmp/r4-g0d-rows.py` (≈ 5 s).
