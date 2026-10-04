# Lemma B: two-band comparison with a walled local RH window

Date: 2026-10-01; §6.1–§6.2 (proofs of the band barriers) added 2026-10-01 (r3). Context: b145 Track B
(`src/data/b145-stack-2026-10-01.js`), r2 structured floor (`src/data/r2-structured-floor-2026-10-02.js`),
band values Λ ≤ 0.1448843462793 (Route P: PT floor height, r2 floors with the weak outer lemma and the
time-box allowance), Λ ≤ 0.147273668782792 (PT height, b145), Λ ≤ 0.144867568901016 (floor height 1.7X,
needs RH to 5.10e12), Λ ≤ 0.144974387559643 / 0.144951726247781 (1.6X, two-band / three-band).

Status. This document gives written proofs of the three gluing steps that the band values use: the
strip-and-wall boundary lemma (B.1), real-stays-real in a walled cell (B.3), and local strip contraction
in a walled or half-infinite cell (B.2). It then derives Λ ≤ max(U1, U2) from those three lemmas and
explicit hypotheses (Theorem B). Section 6.1 proves the band barriers (BB1), (BB2): Raymond's AF §11
first-contact argument written for one cell, an analytic proof of the far-field kernel inequality
(Lemma H2), and exact-arithmetic checks of every comparison step of the seven band runs in use
(`tmp/r3-bb-*`). Section 6.2 writes the several-band (chained) form. None of these proofs has been
refereed, internally or externally. Theorem B remains conditional: on the source floors (F) (Raymond's
chain G0, Track A lemmas, multi-height consumer; for Route P also the weak outer lemma and the time-box
allowance), on the window premise (RH-win) (FLINT 3.6.0, audited once), and at 1.6X/1.7X on (RH-head),
which is open. Section 8 lists every step and its grade. No bound below 0.2 is proved.
PT Λ ≤ 0.2 stands. RH open. NO QED.

---

## 0. Setting and notation

Polymath normalisation (P15, eq. (1.3)–(1.5); Raymond AF §1):

    H_t(z) = ∫_0^∞ e^{t u²} Φ(u) cos(z u) du,   H_0(z) = ξ((1 + i z)/2)/8,   ∂_t H_t = −∂_z² H_t,
    Φ(u) = Σ_{n≥1} (2π² n⁴ e^{9u} − 3π n² e^{5u}) exp(−π n² e^{4u}).

Write z = x + i y. Zeros are counted with multiplicity. The following facts are used throughout.

* (F1) **Symmetry.** H_t is even and real on the real axis, so its zero set is invariant under z ↦ −z and
  z ↦ z̄, with multiplicities preserved. H_t(iy) > 0 for real y (Φ > 0), so no zero lies on the
  imaginary axis (P15 §3, first paragraph).
* (F2) **Joint continuity.** (t, z) ↦ H_t(z) is continuous on ℝ × ℂ and, for fixed t, entire and not
  identically zero (H_t(0) > 0). Reason: Φ(u) = O(exp(9u − π e^{4u})) as u → ∞, so the integrand is
  dominated by e^{T u²}|Φ(u)| e^{Ru} on |t| ≤ T, |z| ≤ R.
* (F3) **Finite order.** H_t has order 1, so Σ_k |z_k|^{-2} < ∞ over its zeros (P15 §3, via Jensen).
* (F4) **Hurwitz/Rouché in t.** If z* is a zero of H_{t*} of order m and D is a closed disk around z*
  containing no other zero of H_{t*}, then for all t close to t*, H_t has exactly m zeros in the interior
  of D. (Rouché on ∂D, using (F2): H_t → H_{t*} uniformly on ∂D and H_{t*} ≠ 0 on ∂D.)
* Dictionary. s = (1 + i z)/2 = (1 − y)/2 + i x/2. A zero ρ = β + iγ of ζ in the critical strip
  corresponds to z = 2γ + i(1 − 2β). So "z real" ⟺ "β = 1/2", and "x ∈ [x₁, x₂]" ⟺ "γ ∈ [x₁/2, x₂/2]".
* For real a < b ≤ ∞ the **cell** is C(a, b) = {z : a < Re z < b}. A zero "in band i" means a zero in
  the corresponding cell.
* t_max := 41/250 = 0.164 (the time range of every wall certificate). q_e := 10⁻⁸.

## 1. Cited results (exact statements used)

**[dB] de Bruijn's strip theorem.** N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Math.
J. 17 (1950), 197–226, Theorem 13. In the H_t normalisation it is P15 Theorem 3.2 (D. H. J. Polymath,
*Effective approximation of heat flow evolution of the Riemann ξ function, and a new upper bound for the
de Bruijn–Newman constant*, Res. Math. Sci. 6 (2019), paper 31; theorem numbers below follow
arXiv:1904.12438v2, the version Raymond cites):

> Suppose t₀ ∈ ℝ and y₀ > 0 are such that H_{t₀} has no zeros x + iy with y > y₀. Then for every
> t > t₀, H_t has no zeros x + iy with y > max(y₀² − 2(t − t₀), 0)^{1/2}.

By (F1) the same bound holds for −y. This is a **global** statement: its hypothesis is about every zero
of H_{t₀}. Lemma B.2 below is a local version restricted to a walled cell; it is proved here, not cited.

**[HVP] Zero-free boundary of the critical strip.** ζ(1 + iγ) ≠ 0 for real γ (Hadamard, de la Vallée
Poussin). With the functional equation, ξ(s) ≠ 0 for Re s ≤ 0 or Re s ≥ 1, so every zero of H_0 has
|y| < 1.

**[P15-3.1] Zero dynamics** (P15 Proposition 3.1). Let z* be a zero of H_{t*} of order m.
(i) If m = 1 there are neighbourhoods U ∋ z*, I ∋ t* and a smooth z : I → U with z(t) the unique zero
of H_t in U, and dz/dt(t*) = 2 Σ′_{k} 1/(z* − z_k), summed over the other zeros z_k of H_{t*}
(primed sum: k and −k grouped).
(ii) If m ≥ 2 there is a neighbourhood U ∋ z* such that for t close to t* (either side, t ≠ t*), H_t
has exactly m zeros in U, of the form z* + √2 (t − t*)^{1/2} λ_j + O(|t − t*|), j = 1..m, where
λ₁ < … < λ_m are the (real, simple, symmetric about 0) roots of the Hermite polynomial He_m and
(t − t*)^{1/2} uses the standard branch. Forward in time (t > t*) the leading terms are real;
backward (t < t*) they are z* + i √2 (t* − t)^{1/2} λ_j.

**[P15-1.5] Positive-time confinement** (P15 Theorem 1.5(i)). There is an absolute constant C such
that for 0 < t ≤ 1/2, every zero x + iy of H_t with x ≥ exp(C/t) has y = 0. Used only qualitatively
(no value of C is needed), only for t ≥ t₀ > 0, giving X_c(t₀) := exp(C/t₀) with: for all
t ∈ [t₀, 1/2], every non-real zero of H_t has |Re z| < X_c(t₀).

**[PT] Platt–Trudgian**, *The Riemann hypothesis is true up to 3·10¹²*, Bull. LMS 53 (2021),
Theorem 1: every zero of ζ with 0 < γ ≤ 3000175332800 has β = 1/2.

**[MTY]** Mossinghoff, Trudgian, Yang, *Explicit zero-free regions for the Riemann zeta-function*,
Res. Number Theory 10 (2024), art. 11: ζ(σ + iγ) ≠ 0 for σ ≥ 1 − 1/(5.558691 log|γ|), |γ| ≥ 2.
Used only for the band-1 start value (Theorem BB, Step 1).

## 2. Hypotheses, matched to the computed quantities

All quantities below are those of the 1.7X band value; the PT-height instances (Route P, b145) differ in
(RH-head), the head wall and the band-1 floors (F), see §7. `verify_lemma_B_hypotheses.py` checks every numerical entry (0 failures,
2026-10-01, including a FLINT recomputation of the two window-boundary zeros).

**(W) Walls.** For each x_w ∈ {x_f, x_L, x_R}:
H_t(x_w + iy) ≠ 0 for all 0 ≤ y ≤ 1 and 0 ≤ t ≤ t_max.

| wall | exact abscissa | certificate (lanes A 256 bit, B 384 bit) |
|---|---|---|
| x_f (head/band-1 boundary, 1.7X) | 51000000117731201/5000 = 10200000023546.2402 | `tmp/b145-B-out/walls/WALLQ_10200000023546.2402_{A,B}.json`, N = 900938 |
| x_L (band-1/window boundary) | 19500000002779043/1250 = 15600000002223.2344 | `tmp/b145-B-out/walls/WALLQ_15600000002223.2344_{A,B}.json`, N = 1114185 |
| x_R (window/band-2 boundary) | 390000000236886/25 = 15600000009475.44 | `tmp/s145-1-g1/out/WALLQ_15600000009475.44_{A,B}.json`, N = 1114185 |

Each certificate states |H_t(x_w + iy)/B_t(x_w + iy)| > 3/4 on t ∈ [0, 41/250], y ∈ [0, 1] (floor
expression lower end 0.7889–0.7891). B_t = M_t((1 + y − i x_w)/2) is finite and non-zero there
(M_0(s) vanishes only at s = 0, 1). The step from the certified prefix sums to the stated inequality is
Raymond's AF §3 Abel transfer plus AF §§4–5 error bounds (graded SOUND by internal referee A,
`b145-raymond-referee-2026-10-01`). By (F1) the wall also excludes zeros with −1 ≤ y ≤ 0 and on the
mirrored lines x = −x_w.

**(S) Strip.** From [HVP] and [dB] with t₀ = 0, y₀ = 1: every zero of H_t has |y| < 1 at t = 0 and
|y| ≤ (1 − 2t)^{1/2} < 1 for 0 < t ≤ t_max (2 t_max = 41/125 < 1). Proved (cited theorems).

**(RH-head) RH below the head wall.** Every zero of ζ with 0 < γ ≤ x_f/2 = 5100000011773.1201 has
β = 1/2. The stack records the requirement as T* = (x_f + 1)/2 = 5100000011773.62.
**Status at 1.7X: open** (PT covers 3.0001753e12). At PT height the head wall is Raymond's
X = 6000000185827 and the requirement (X + 1)/2 = 3000000092914 ≤ 3000175332800 is met by [PT].

**(RH-win) RH in the window.** Every zero of ζ with x_L/2 ≤ γ ≤ x_R/2, i.e.
7800000001111.6172 ≤ γ ≤ 7800000004737.72, has β = 1/2.
Computed: FLINT 3.6.0 Platt isolation with Turing anchors, three glued chunks
(`tmp/b145-B-out/walls/chain_window_rerun.jsonl`), zero indices 33328427938874..33328427960538
(21665 zeros, consecutive, all OK). By the gluing lemma (`formalization/rh-verification-campaign/PLAN.md`
§1) every zero with γ_{n_first} ≤ γ ≤ γ_{n_last} carries an index in that range, so lies on the line.
Separate FLINT entry point (`acb_dirichlet_zeta_zeros`, prec 128, this document):
γ_{33328427938874} = 7800000000999.91541557… (± 5e-26) < x_L/2 (margin 111.70),
γ_{33328427960538} = 7800000005887.92044395… (± 6e-26) > x_R/2 (margin 1150.20).
**Status: certified conditional on FLINT 3.6.0's Platt error lemmas and Turing bound** (code-and-paper
audit by one reader, `formalization/rh-verification-campaign/FLINT_AUDIT.md`: one printed-constant error,
harmless at the parameters used; wrap-around gap closed by a patch; this window rerun with the patch;
no independent referee).
Simplicity of these zeros is certified as well but is **not** needed by Lemma B.

**(H2) Far-field kernel inequality.** For every kernel the comparison selects,
2K_y(d, b) ≥ λ (y/h)[K_h(d + rh, b) + K_h(d − rh, b)]/2 for all |d| ≥ 7252, 0 ≤ b ≤ 1, 0 < y ≤ ρh,
over the height range used (two-height kernels: the form of §6.1.2 (K)). **Status: proved in §6.1.3
(Lemma H2, analytic) for all 13 catalogue kernels, the sharp law and the ten two-height kernels, for
h ∈ [1/2, 5/2]; the final inequality is checked in exact rational arithmetic (`tmp/r3-bb-h2.py`).**
Earlier exact Bernstein certificates `tmp/b145-B-out/H2.json` (b²/h² ≤ 9/4, h ∈ [2/3, 12/5]),
`tmp/b145-refB-out/H2_BMAX52.json` (h ≥ (2/5)^{1/2}, 24/24 PASS) and `tmp/b145-B-out/H2_MH.json` agree
with it and are no longer needed. Geometry: x_R − x_L = 9065257/1250 = 7252.2056 > 7252.
(H2) is used by (BB1)/(BB2) (Lemma C), not by Lemmas B.1–B.3.

**(F) Source floors.** Every floor value read by a band run is a valid lower bound for the probe
average (or one-point probe) it describes, on its whole time cell, whenever all its probe points lie in
the source domain [X − 2, ∞) (X the floor height of that band). Exact form in §6.1.2. **Status: conditional input, not proved here** (Raymond's
chain incl. G0, Track A Lemma R and C_g monotonicity, multi-height consumer, two-height coupling incl.
Raymond's joint-pair lemma at shifts outside his catalogue; Route P band 1 also the r2 structured floors,
which assume the weak outer lemma, margin 0.02, and carry the time-box allowance 0.0023; that allowance is
measured by direct-ball comparison at 4 cells, not certified at the other entries [r3 referee correction]).

**(K) Near-field kernel inequalities.** The catalogue inequality (AF (10.1)), AF Part II Theorem 1
(sharp law) and the ten two-height kernel inequalities, for every real d and 0 ≤ b ≤ y except
(d, b) = (0, y). Exact form in §6.1.2. **Status: certified** (exact Bernstein certificates, re-run
2026-10-01: catalogue PASS, 8,280 coefficients, 41 leaves; two-height PASS, polynomial hashes identical
to the stored certificates; sharp law: polynomial identity re-verified symbolically,
`tmp/r3-bb-sharp-identity.py`).

**(BB1) Band-1 barrier.** There are t_e1 ∈ (0, t_max) and a lower semicontinuous function B₁ on
[0, t_e1], piecewise C¹ with only upward jumps, with B₁(t_e1) = q_e, such that for every t ∈ [0, t_e1],
every zero of H_t in C(x_f, x_L) satisfies y² < B₁(t) (and hence y² < q_e at t = t_e1); and
t_e1 + q_e/2 ≤ U1.
Computed: the exact comparison of `tmp/b145-B-band.py` / `b145-B-lib.integrate_multi` with floors at
X_f = 10200000023546 (1.7X tables), start q₀ = 195181606067939/2·10¹⁴ = 0.975908030339695 (exceeds
q_MTY(x_L) = 0.975906030339695 by 2.0e-6), output U1 = ⌈t_e1 + q_e/2⌉_{10⁻¹⁵} = 18108446112627/125000000000000
= 0.144867568901016; Route P: r2 consumer, same start, U1 = 1448843462793/10¹³ = 0.1448843462793.
**Status: proved in §6.1 (Theorem BB) for each band-1 run of §6.1.7**, from (W), (S), (RH-head),
(RH-win), (F), (K), (H2) (Lemma H2), [MTY] and the consumer checks E1–E8 (certified, 0 failures).

**(BB2) Band-2 barrier.** There are t_e2 ∈ (0, t_max) and B₂ as in (BB1) with B₂(t_e2) = q_e such that
for every t ∈ [0, t_e2], every zero of H_t in C(x_R, ∞) satisfies y² < B₂(t); and t_e2 + q_e/2 ≤ U2.
Computed: 2.6X certified stack (floors at X_b = 15600000009475 ≤ x_R, start 1.000002000001),
U2 = ⌈t_e2 + q_e/2⌉ = 36063660805739/250000000000000 = 0.144254643222956; t_e2 ≥ 0.1442546 > 0.
**Status: proved in §6.1 (Theorem BB)**, from (W), (S), (RH-win), (F), (K), (H2),
[P15-1.5] ((RH-head) is not needed for (BB2): head zeros lie at distance > x_R − x_f and are covered by
Lemma H2 for any b ≤ 1 [r3 referee correction]) and the consumer checks E1–E8 (certified, 0 failures).

**(T) Horizon.** U1, U2 < t_max (checked for every run of §6.1.7: U1 ∈ {0.144884, 0.147274, 0.144868,
0.144975, 0.144952, 0.144913}, U2 = 0.144255, all < 0.164; also enforced by the code).

## 3. Lemma B.1 (boundary lemma)

**Lemma B.1.** Assume (W) for walls at a and (if b < ∞) at b, with 0 < a < b ≤ ∞, and (S). Then for
every t ∈ [0, t_max]: (a) H_t has no zero on the lines Re z = a, Re z = b; (b) if b < ∞, H_t has no
zero on the boundary of the rectangle K = [a, b] × [−1, 1], and every zero of H_t in C(a, b) lies in
the interior of K.

*Proof.* (a) A zero on Re z = a has |y| < 1 by (S); for 0 ≤ y ≤ 1 it is excluded by (W), for
−1 ≤ y < 0 its conjugate is excluded by (W) and (F1). (b) The vertical sides are (a); the horizontal
sides |y| = 1 carry no zeros by (S). A zero in C(a, b) has |y| < 1 by (S), so it is in the interior. ∎

Consequence used below: zeros never sit on a wall, so "the zeros of H_t in C(a, b)" is the set of zeros
in the open set int K, on which (F4) applies with no boundary leakage.

## 4. Lemma B.3 (real zeros stay real in a walled cell)

**Lemma B.3.** Let a < b be real and [t₀, t₁] ⊂ [0, t_max]. Assume H_t has no zero on the boundary of
K = [a, b] × [−1, 1] for t ∈ [t₀, t₁] (this holds under the hypotheses of Lemma B.1, and also for the
symmetric head cell, see below), and that every zero of H_{t₀} in int K is real. Then for every
t ∈ [t₀, t₁] every zero of H_t in int K is real.

No hypothesis on zeros outside K is needed. In particular non-real zeros of a neighbouring band may sit
arbitrarily close to the wall.

*Proof.* Let S = {t ∈ [t₀, t₁] : every zero of H_t in int K is real}.

*S is closed.* Let t ∉ S: H_t has a zero z₀ ∈ int K with Im z₀ ≠ 0. Take a closed disk D ⊂ int K
around z₀ that misses the real axis and contains no other zero of H_t. By (F4), H_τ has a zero in D for
all τ close to t; these zeros are non-real and in int K. So the complement of S is open in [t₀, t₁].

*S is forward-open.* Let T ∈ S with T < t₁. The zeros of H_T in K are finitely many (F2, K compact),
all real, at distinct points r₁ < … < r_p in (a, b) (none on the boundary), with multiplicities
m₁, …, m_p. Choose closed disks D_i centred at r_i, pairwise disjoint, contained in int K, each
symmetric about the real axis, and for m_i ≥ 2 contained in the neighbourhood U_i of [P15-3.1(ii)].
 - Outside the disks: |H_T| ≥ μ > 0 on the compact set K′ = K \ ∪ int D_i; by uniform continuity (F2)
   there is δ₀ > 0 with H_t ≠ 0 on K′ for t ∈ [T, T + δ₀).
 - Simple zeros (m_i = 1): by (F4) H_t has exactly one zero in D_i for t ∈ [T, T + δ_i). If it were
   non-real, its conjugate would be a second zero in D_i (D_i is symmetric; (F1)). So it is real.
 - Multiple zeros (m_i ≥ 2): by (F4) and [P15-3.1(ii)], for t ∈ (T, T + δ_i) the zeros of H_t in D_i
   are exactly the m_i zeros w_j(t) = r_i + √2 (t − T)^{1/2} λ_j + E_j(t), |E_j(t)| ≤ A (t − T), with
   (t − T)^{1/2} > 0 real and λ₁ < … < λ_m real. Let g = min_{j≠k} |λ_j − λ_k| > 0. Since H_t is real
   on ℝ, w̄_j(t) is also a zero in D_i, so w̄_j(t) = w_k(t) for some k. Then
   √2 (t − T)^{1/2} |λ_j − λ_k| ≤ |E_j| + |E_k| ≤ 2A(t − T),
   which forces k = j once (t − T)^{1/2} < g/(√2 A). Then w_j(t) = w̄_j(t) is real. Shrink δ_i
   accordingly.
With δ = min(δ₀, δ₁, …, δ_p) > 0, [T, T + δ) ⊂ S.

*Conclusion.* t₀ ∈ S. Let T₁ = sup{τ ∈ [t₀, t₁] : [t₀, τ] ⊂ S}. Closedness gives [t₀, T₁] ⊂ S;
forward-openness gives T₁ = t₁. ∎

**Application 1 (window).** Cell C(x_L, x_R), [t₀, t₁] = [0, t_max]. Boundary: Lemma B.1 with (W) at
x_L, x_R and (S). Initial condition: by the dictionary, a zero of H_0 in C(x_L, x_R) is a ζ-zero with
γ ∈ (x_L/2, x_R/2), which is on the line by (RH-win), so it is real. **Conclusion (B.3-win): for every
t ∈ [0, t_max], every zero of H_t in C(x_L, x_R) is real.**

**Application 2 (head).** Cell C(−x_f, x_f), i.e. a = −x_f, b = x_f (the proof above uses only
compactness of K and the boundary condition, not a > 0). Boundary: the line Re z = x_f by (W); the line
Re z = −x_f by (W) and evenness (F1); |y| = 1 by (S). Initial condition: zeros of H_0 with
|Re z| < x_f are ζ-zeros with 0 < |γ| < x_f/2, on the line by (RH-head) (no zero has γ = 0).
**Conclusion (B.3-head): for every t ∈ [0, t_max], every zero of H_t with |Re z| < x_f is real.**
At PT height this is Raymond's AF §2 statement "every non-real zero has |Re z| > X", with the
counting step written out (internal referee A's GAP 2a).

## 5. Lemma B.2 (local strip contraction in a walled or half-infinite cell)

**Lemma B.2.** Let 0 < a < b ≤ ∞, [t₀, t₁] ⊂ [0, t_max], 0 ≤ y₀ < 1. Assume:
 - (W_ab) H_t has no zero on Re z = a, nor on Re z = b if b < ∞, for t ∈ [t₀, t₁] (Lemma B.1);
 - (S);
 - (Conf) if b = ∞: t₀ > 0 (so [P15-1.5] gives X_c = X_c(t₀));
 - (Sep) for every t ∈ [t₀, t₁], every **non-real** zero z_k of H_t with Re z_k ∉ (a, b) satisfies
   dist(Re z_k, [a, b]) ≥ 1 (dist to [a, ∞) if b = ∞);
 - (Init) every zero of H_{t₀} in C(a, b) satisfies |y| ≤ y₀.

Then for every t ∈ [t₀, t₁], every zero of H_t in C(a, b) satisfies
|y| ≤ Ȳ(t) := max(y₀² − 2(t − t₀), 0)^{1/2}. In particular they are all real for
t ∈ [t₀ + y₀²/2, t₁].

*Proof.* Fix η with 0 < η < 1 − y₀² and put Y(t) = (max(y₀² − 2(t − t₀), 0) + η)^{1/2}. Y is
continuous, nonincreasing, √η ≤ Y ≤ Y(t₀) < 1, Lipschitz with constant η^{−1/2}, and its left
derivative satisfies D⁻Y(t) ≥ −1/Y(t) for t > t₀ (it is −1/Y(t) for t ≤ t₀ + y₀²/2 and 0 after).
Let

    F = {t ∈ [t₀, t₁] : H_t has a zero z ∈ C(a, b) with |Im z| ≥ Y(t)}.

*Step 1: F is closed and t₀ ∉ F.* t₀ ∉ F since Y(t₀) > y₀. Let t_n ∈ F, t_n → t, with zeros
z_n ∈ C(a, b), |Im z_n| ≥ Y(t_n) ≥ √η. The z_n lie in a compact set: |Im z_n| < 1 by (S), and
a < Re z_n < b if b < ∞; if b = ∞, z_n is non-real and t_n ≥ t₀ > 0, so Re z_n < X_c by (Conf).
A subsequence converges to z with H_t(z) = 0 (F2), |Im z| ≥ Y(t) (continuity of Y), and
a ≤ Re z ≤ b. By (W_ab), Re z ≠ a, b; so z ∈ C(a, b) and t ∈ F.

*Step 2: the first contact.* Suppose F ≠ ∅ and let t* = min F > t₀. Let z* ∈ C(a, b) be a zero of
H_{t*} with |Im z*| ≥ Y(t*); by (F1) take Im z* > 0. If Im z* > Y(t*), (F4) on a small disk around
z* inside C(a, b) ∩ {Im z > Y(t*)} gives zeros of H_t in C(a, b) with Im z > Y(t) for t < t* close to
t* (Y is continuous), contradicting minimality. Hence z* = x* + iY*, Y* := Y(t*), x* ∈ (a, b), and
the same argument shows: **every zero of H_{t*} in C(a, b) has |Im z| ≤ Y*.** Let m be the order
of z*.

*Step 3: m ≥ 2 is impossible.* By [P15-3.1(ii)] backward, for t < t* close to t*, H_t has the zero
z* + i√2 (t* − t)^{1/2} λ_m + O(t* − t) with λ_m > 0 (the roots of He_m are symmetric and simple,
m ≥ 2). Its imaginary part is Y* + √2 λ_m (t* − t)^{1/2} − O(t* − t), which exceeds
Y(t) ≤ Y* + η^{−1/2}(t* − t) for t close to t*; its real part is near x* ∈ (a, b). So t ∈ F with
t < t*: contradiction.

*Step 4: m = 1 is impossible.* By [P15-3.1(i)] there is a smooth branch z(t), z(t*) = z*. For t < t*
close to t*, z(t) ∈ C(a, b) and t ∉ F, so Im z(t) < Y(t), while Im z(t*) = Y(t*). Dividing
Im z(t*) − Im z(t) > Y(t*) − Y(t) by t* − t and letting t ↑ t* gives

    Im ż(t*) ≥ D⁻Y(t*) ≥ −1/Y*.                                                     (5.1)

On the other hand, Im 1/(z* − z_k) = −(Y* − y_k)/|z* − z_k|², each term is bounded by
2/|z* − z_k|², and Σ|z* − z_k|^{−2} < ∞ by (F3). So the imaginary part of the primed sum in
[P15-3.1(i)] is the absolutely convergent series

    Im ż(t*) = −2 Σ_{k} (Y* − y_k)/|z* − z_k|²,                                       (5.2)

which may be regrouped freely. Split the zeros z_k ≠ z* of H_{t*} (all simple at the four points below,
by (F1), since z* is simple):
 - z̄* = x* − iY*: term −2·2Y*/(2Y*)² = −1/Y*.
 - −x* − iY* (a zero by (F1); distinct from z*, z̄* since x* > a > 0): term
   −4Y*/(4x*² + 4Y*²) < 0.
 - −x* + iY*: term 0.
 - every other zero with y_k ≤ Y*: term ≤ 0. This class contains every real zero, every zero in
   C(a, b) (Step 2), and every zero with y_k < −Y* that is not the conjugate of a zero handled next.
 - every zero with y_k > Y*, grouped with its conjugate z̄_k (a different zero with imaginary part
   −y_k < −Y*). Such z_k is non-real and not in C(a, b) (Step 2), and Re z_k ≠ a, b by (W_ab); so by
   (Sep) D := (x* − x_k)² ≥ 1. The pair contributes
   −2[(Y* − y_k)/(D + (Y* − y_k)²) + (Y* + y_k)/(D + (Y* + y_k)²)]
   = −4Y* (D + Y*² − y_k²) / [(D + (Y* − y_k)²)(D + (Y* + y_k)²)] ≤ 0,
   since y_k² < 1 ≤ D by (S). (Algebra: the numerator identity
   (Y + y)(D + (Y − y)²) + (Y − y)(D + (Y + y)²) = 2Y(D + Y² − y²); this is the computation in
   P15's proof of Proposition 3.3.)
Hence Im ż(t*) ≤ −1/Y* − 4Y*/(4x*² + 4Y*²) < −1/Y*, contradicting (5.1).

*Step 5.* So F = ∅ for every η ∈ (0, 1 − y₀²): every zero of H_t in C(a, b) has
|Im z| < (Ȳ(t)² + η)^{1/2}. Let η → 0. ∎

Remarks. (i) With y₀ = 0, Lemma B.2 also gives real-stays-real, but only under (Sep). Lemma B.3 needs no
(Sep), and the window requires that: a non-real band-1 zero can lie within distance < 1 of x_L, so (Sep)
can fail for the window cell. (ii) The parameter η keeps every contact height ≥ √η > 0, so contacts are
non-real; that is what makes (Conf) sufficient for compactness when b = ∞. (iii) At a kink of Y the left
derivative is used, as in Raymond AF §11 ("at a knot the left-hand rate is used").

## 6. Theorem B (two-band gluing)

**Theorem B.** Assume (W), (RH-head), (RH-win), (F), (K), (T), and that the two band runs pass the
consumer checks E1–E8 of §6.1.2. ((S) is proved from cited theorems; (H2) is Lemma H2; (BB1) and
(BB2) are then Theorem BB of §6.1.5.) Let T = max(U1, U2). Then every zero of H_T is real, hence
Λ ≤ max(U1, U2).

*Proof.* Order of the argument: B.3 (head, window) does not use the bands; (BB1)/(BB2) use B.1, B.3
and (S), but not each other; the persistence steps use B.3 and (BB1)/(BB2). There is no circularity.

1. *Head and window, all times.* (B.3-head) and (B.3-win): for every t ∈ [0, t_max], all zeros with
   |Re z| < x_f, and all zeros with x_L < |Re z| < x_R (by (F1) for the mirrored window), are real.
2. *No zero on a wall.* Lemma B.1: for t ∈ [0, t_max], no zero has |Re z| ∈ {x_f, x_L, x_R}.
3. *Band 1 persists from t_e1 (used in every case: step 5 needs band 1 real at T = U1) [r3 referee correction].* Apply Lemma B.2 with
   (a, b) = (x_f, x_L), [t₀, t₁] = [t_e1, t_max], y₀ = q_e^{1/2} = 10⁻⁴.
   (W_ab): Lemma B.1 with (W) at x_f, x_L. (Init): (BB1) at t = t_e1 gives y² < B₁(t_e1) = q_e.
   (Sep): let z_k be a non-real zero of H_t, t ∈ [t_e1, t_max], with Re z_k ∉ (x_f, x_L). By steps 1–2,
   Re z_k ∈ (x_R, ∞) ∪ (−x_L, −x_f) ∪ (−∞, −x_R). Its distance to [x_f, x_L] is ≥ x_R − x_L = 7252.2,
   ≥ 2x_f, or ≥ x_R + x_f respectively; all ≥ 1.
   Conclusion: every zero in C(x_f, x_L) is real for t ∈ [t_e1 + q_e/2, t_max] ⊇ [U1, t_max].
4. *Band 2 persists from t_e2 (needed when U1 > U2: every band value in use, §9 item 1).* Apply
   Lemma B.2 with (a, b) = (x_R, ∞), [t₀, t₁] = [t_e2, t_max], y₀ = 10⁻⁴.
   (W_ab): (W) at x_R. (Conf): t_e2 > 0; in fact t_e2 lies in the terminal substep of run `U2` (check E6),
   so t_e2 > t_K = 0.144254 (cell 577, substep 2). (Init): (BB2) at t_e2 gives y² < q_e. (Sep): a non-real zero with Re z_k ≤ x_R has, by steps 1–2,
   Re z_k ∈ (x_f, x_L) ∪ (−x_L, −x_f) ∪ (−∞, −x_R); its distance to [x_R, ∞) is ≥ 7252.2,
   ≥ x_R + x_f, or ≥ 2x_R; all ≥ 1.
   Conclusion: every zero in C(x_R, ∞) is real for t ∈ [U2, t_max].
5. *At T.* T ≤ t_max by (T). By steps 1–4 and (F1), every zero of H_T with Re z in
   (−x_f, x_f), (x_f, x_L), (x_L, x_R), (x_R, ∞) or their mirrors is real (T ≥ U1 and T ≥ U2), and no
   zero lies on Re z ∈ {0, ±x_f, ±x_L, ±x_R} ((F1) and step 2). So all zeros of H_T are real and, by
   the definition Λ = inf{t : H_t has only real zeros}, Λ ≤ T. ∎

Equivalent ending. Instead of steps 3–5 one can stop the persistence at level q_e: at
τ = max(t_e1, t_e2) every zero has y² ≤ q_e (Lemma B.2 applied to the earlier band, B.3 elsewhere),
and the global [dB] with t₀ = τ, y₀ = 10⁻⁴ gives Λ ≤ τ + q_e/2 ≤ max(U1, U2). This uses the same
Lemma B.2 hypotheses. In both versions the q_e/2 allowance that Raymond takes from the **global** [dB]
must, in the two-band setting, come from the **local** Lemma B.2, because at t_e1 (resp. t_e2) the
other band is not yet within y² ≤ q_e.

### 6.1 The band barriers (BB1), (BB2): proof

This section proves (BB1) and (BB2) for each band run listed in §6.1.7. The argument is Raymond's AF §11
first contact (q′ < −2 − c q at a simple contact zero, backward Hermite splitting at a multiple one),
written for one cell. Three things differ from AF §11: (i) the cell is walled (band 1, any middle band)
or half-infinite (band 2); (ii) zeros of the other band may lie higher than the contact zero, and their
pair terms are handled by the far-field Lemma H2 instead of the catalogue inequality; (iii) the barrier is
defined from the stored upward enclosures, so the admissibility conditions of each comparison step are
exactly the ones checked, with one extra lower-end check for the windowed r2 sharp floors.

#### 6.1.1 Comparison data and the barrier

A band run is the output of an exact consumer (`b145-B-lib.integrate_multi`, `r2-floor-consume.integrate`,
`r2-height-consume2`). It consists of the substep length δ = 1/512000 (128 substeps per time cell
[i/4000, (i+1)/4000]), knots t_k = kδ, and for k = 0, …, K: a rational q_k (q_0 the start value), a
selected option o_k (height set, kernel, height h_k, floor value(s) ℓ_k of cell i_k = ⌊k/128⌋, self cap
cap_k) and a rational rate c_k with 0 < c_kδ < 1. Write A_m(x) = Σ_{j≤m} (−x)^j/j!. For k < K,
q_{k+1} = ⌈(q_k + 2/c_k) A₁₈(c_kδ) − 2/c_k⌉ on the grid 2⁻⁹⁶, and K is the first index with
(q_K + 2/c_K) A₁₈(c_Kδ) − 2/c_K ≤ q_e. Define

    B(0) = q_0,   B(t) = (q_k + 2/c_k) e^{−c_k (t − t_k)} − 2/c_k   for t_k < t ≤ t_{k+1}, 0 ≤ k ≤ K,

and t_e := min{t : B(t) = q_e}. For 0 ≤ x < 1 the terms of the exponential series decrease, so
A₁₇(x) ≤ e^{−x} ≤ A₁₈(x) (Leibniz). Hence:

* (B-i) On each (t_k, t_{k+1}], B is C¹ and decreasing with B′ = −2 − c_k B; B is left-continuous at
  every knot.
* (B-ii) B(t_{k+1}) ≤ (q_k + 2/c_k)A₁₈(c_kδ) − 2/c_k ≤ q_{k+1} = B(t_{k+1}+): B jumps only upward at
  knots, so B is lower semicontinuous.
* (B-iii) B ≥ q_e on [0, t_e]. On every non-terminal substep the end value B(t_{k+1}) ≥ L_k (below) is
  > q_e (check E6), so t_e lies in the terminal substep: t_e = t_K + log(1 + z)/c_K,
  z = c_K(q_K − q_e)/(2 + c_K q_e). The consumer's lag (degree-11 alternating sum, an upper bound for
  log(1 + z) on (0, 1)) and U = ⌈t_K + lag + q_e/2⌉_{10⁻¹⁵} give t_K < t_e and t_e + q_e/2 ≤ U.
* (B-iv) For t ∈ (t_k, t_{k+1}] ∩ (0, t_e]: B(t) ∈ [L_k, q_k] with
  L_k := (q_k + 2/c_k)A₁₇(c_kδ) − 2/c_k ≤ B(t_{k+1}); on the terminal substep B(t) ∈ [q_e, q_K].

In AF §11 the barrier is the continuous ("ideal") solution and the q_k are its upper enclosures. Both
versions are valid; the one used here is the one whose step conditions the consumers actually test.

#### 6.1.2 Inputs

Cells: C_1 = C(x_f, x_L) (band 1), C_2 = C(x_R, ∞) (band 2). Floor heights: X_1 ≤ x_f (X_1 = X at PT
height, X_f at 1.7X), X_2 = 15600000009475 ≤ x_R. S(x, h, t) = −Im(H_t′/H_t)(x + ih).

**(F) Source floors.** For every k and every t in the closed cell i_k, H_t does not vanish at the probe
points below and
 - catalogue or sharp option, height h = h_k, displacement set A_k: for every a ∈ A_k and every x with
   x − a ≥ X_i − 2, [S(x + a, h, t) + S(x − a, h, t)]/2 > ℓ_k, where A_k = {r h} (catalogue shift r),
   [h((1 − 51/250)/3)^{1/2}, h/3^{1/2}] (Raymond's sharp floor), [a_lo, a_hi] (r2 sharp window);
 - two-height option (κ, r, w): for every x with x − rh ≥ X_i − 2,
   [S(x + rh, h, t) + S(x − rh, h, t)]/2 > ℓ_pair and S(x, κh, t) > ℓ_high.
(F) is what the source certificates assert. It is an input here (see §2).

**(K) Near-field kernel inequalities.** With K_c(d, b) = (c − b)/(d² + (c − b)²) + (c + b)/(d² + (c + b)²),
for every real d and 0 ≤ b ≤ y with (d, b) ≠ (0, y):
 - catalogue (λ, r, ρ), 0 < y ≤ ρh: 2K_y(d, b) ≥ λ (y/h)[K_h(d + rh, b) + K_h(d − rh, b)]/2 (AF (10.1));
 - sharp law, λ = 2, a = ((h² − y²)/3)^{1/2}, y²/h² ≤ v* = (1 + 117^{1/2})/58: the same form with a
   (AF Part II Theorem 1);
 - two-height (κ, r, w, λ = 2, ρ), 0 < y ≤ ρh, h̄ = h(1 − w + wκ):
   2K_y(d, b) ≥ λ (y/h̄)[(1 − w)(K_h(d + rh, b) + K_h(d − rh, b))/2 + w K_{κh}(d, b)].
Status in §2 (certified; re-run 2026-10-01).

**(E) Consumer checks** (certified for each run by `tmp/r3-bb-replay.py`, exact rational arithmetic):
 - E1 admissibility at q_k. Catalogue: q_k ≤ ρ²h_k², r h_k < 2. Sharp: v = q_k/h_k² satisfies
   0 < v < 1, 29v² − v − 1 ≤ 0 (so v ≤ v*), v < 51/250, and h_k² < 12. Two-height: q_k ≤ ρ²h_k²,
   q_k < κ²h_k², 3r² ≥ 1, r h_k < 2, high-probe height = κ h_k.
 - E2 self-pair caps. Catalogue: cap_k ≥ sup_{0≤v≤q_k/h_k²} s_r(v), s_r(v) = 2(1 + r² − v)/((1 + r² − v)²
   + 4r²v) = h K_h(rh, v^{1/2} h); s_r′ has the sign of (1 + r² − v)² − 4r²(1 + r²), so the supremum is
   taken at an endpoint or at v_m = 1 + r² − 2(r²(1 + r²))^{1/2}, whose value is enclosed with arb.
   Sharp: cap_k = 6/(4 − q_k/h_k²); h K_h(a(y), y) = 6/(4 − y²/h²) exactly (Part II eq. (3)), increasing
   in y. Two-height: s_pair = 2/(h(1 + r²)) = sup of K_h(rh, y) (s_r decreasing for 3r² ≥ 1),
   s_high = 2κ/(h(κ² − q_k/h²)) = sup of K_{κh}(0, y) = 2κh/(κ²h² − y²) over y² ≤ q_k.
 - E3 rate identity: c_k = (2λ/h_k)(ℓ_k − cap_k/h_k) (sharp: λ = 2; two-height:
   c_k = (2λ/h̄)((1 − w)ℓ_pair + wℓ_high − (1 − w)s_pair − w s_high)), and 0 < c_kδ < 1.
 - E4 the stored q_{k+1} is the 2⁻⁹⁶ ceiling of (q_k + 2/c_k)A₁₈(c_kδ) − 2/c_k (B-ii).
 - E5 r2 sharp windows [q_lo, q_hi]: q_k ≤ q_hi and L_k ≥ q_lo (terminal substep: q_e ≥ q_lo); and, from
   the raw certificates, a_lo² ≤ (h² − q_hi)/3, a_hi² ≥ (h² − q_lo)/3, a_hi < 2, so
   [a_lo, a_hi] ∋ a(y) for y² ∈ [q_lo, q_hi] (`tmp/r3-bb-windows.py`: 1,332 sharp and 3,142 fixed-shift
   entries, 0 failures, smallest slack 1.3·10⁻²⁰). The consumer itself tests the window on an upper
   enclosure of the step end value; L_k is a lower bound.
 - E6 terminal: L_k > q_e for every k < K (no crossing of q_e before the terminal substep); z ∈ (0, 1),
   lag ≤ δ, U reproduced exactly, U ≥ t_K + (z − z²/(2(1 + z)))/c_K + q_e/2 (an independent upper bound
   for log(1 + z)), U < 41/250.
 - E7 every height h_k used lies in [1/2, 5/2] (the range of Lemma H2).
 - E8 start: band 1, q_0 > q_MTY(x_L) with q_MTY(x_L) enclosed by arb at 256 bits; band 2, q_0 > 1.

#### 6.1.3 Lemma H2 (far field, analytic)

**Lemma H2.** Let D_W = 7252. For each of the 13 catalogue kernels (λ, r, ρ), the sharp law (λ = 2,
a² = (h² − y²)/3, y² ≤ (51/250)h²) and the ten two-height kernels (κ, r, w, λ = 2, ρ) of
`tmp/b145-B-out/kernels/`, and all h ∈ [1/2, 5/2], 0 ≤ b ≤ 1, 0 < y ≤ ρh, |d| ≥ D_W:

    G(d) := 2K_y(d, b) − λ (y/h)[K_h(d + a, b) + K_h(d − a, b)]/2 > 0      (a = rh, or the sharp a),

and for the two-height kernels
G(d) := 2K_y(d, b) − λ (y/h̄)[(1 − w)(K_h(d + rh, b) + K_h(d − rh, b))/2 + w K_{κh}(d, b)] > 0.
The height b of the far zero may exceed y. The same holds for |d| ≥ 1639 (every kernel).

*Proof.* Since Im 1/(d − iε) = ε/(d² + ε²), K_c(d, b) = Im[1/(d − i(c − b)) + 1/(d − i(c + b))] and
K_h(d ± a, b) = Im[1/(d − (i(h − b) ∓ a)) + 1/(d − (i(h + b) ∓ a))]. Every point u in these denominators
has |u| ≤ max(R_y, R_h, R_κ) ≤ 9 < |d|, with R_y = y + b, R_h = ((h + b)² + a²)^{1/2}, R_κ = κh + b.
Expanding 1/(d − u) = Σ_{n≥0} uⁿ d^{−n−1},

    G(d) = Σ_{n≥0} Im(M_n) d^{−n−1},
    M_n = 2(i(y − b))ⁿ + 2(i(y + b))ⁿ − (λy/2h) Σ_{s=±1} [(i(h − b) − sa)ⁿ + (i(h + b) − sa)ⁿ]

(two heights: the last term becomes (λy/h̄)[(1 − w)·½Σ_s((i(h − b) − srh)ⁿ + (i(h + b) − srh)ⁿ)
+ w((i(κh − b))ⁿ + (i(κh + b))ⁿ)]). Each power sum is real for even n, so Im M_n = 0 for even n. For odd n,
|Im[2(i(y − b))ⁿ + 2(i(y + b))ⁿ]| = 2|(y + b)ⁿ + (y − b)ⁿ| ≤ 4n y R_y^{n−1}, because
f(t) = (t + b)ⁿ + (t − b)ⁿ has f(0) = 0 and 0 ≤ f′(t) ≤ 2n(t + b)^{n−1} on [0, y]; the probe part is at
most (λy/2h)·4R_hⁿ (two heights: (λy/h̄)[2(1 − w)R_hⁿ + 2wR_κⁿ]). With Σ_{n≥N} n x^{n−1} ≤ N x^{N−1}/(1 − x)²,
for N odd and |d| ≥ D,

    G(d)/y ≥ Σ_{odd n < N} μ_n d^{−n−1} − E_N(D) |d|^{−N−1},       μ_n := Im(M_n)/y,
    E_N(D) = 4N R_y^{N−1}(1 − R_y/D)^{−2} + (2λ/h) R_h^N (1 − R_h/D)^{−1}
             [two heights: (2λ/h̄)((1 − w)R_h^N(1 − R_h/D)^{−1} + w R_κ^N (1 − R_κ/D)^{−1})].

The leading coefficients (obtained symbolically, `tmp/r3-bb-h2-sym.py`, and checked for exact equality
with Im(M_n)/y at random rational points, `tmp/r3-bb-h2.py`, 0 mismatches) are

    μ₁ = 4 − 2λ;
    λ = 2, a = rh:   μ₁ = 0,  μ₃ = 4h²(1 − 3r² − y²/h²);
    sharp law:       μ₁ = μ₃ = 0,  μ₅ = (16/9)(h² − y²)(4h² − y²);
    two heights:     μ₁ = 0,  μ₃ = 4h²[((1 − w)(1 − 3r²) + wκ³)/(1 − w + wκ) − y²/h²]   (no b-dependence).

Take N = 3 for λ < 2 (7 catalogue kernels), N = 5 for λ = 2 with a fixed shift (6 catalogue, 10
two-height kernels) [r3 referee correction; tmp/r3-bb-h2.py chooses N per kernel from λ, certificate unaffected], N = 7 for the sharp law. On the parameter box the leading coefficient μ_lead is
bounded below by its value at h = 1/2, y² = ρ²h² (resp. (51/250)h²), which is positive for every kernel:
4 − 2λ ≥ 1/50 (λ < 2); 1 − 3r² − ρ² ≥ 93/40000 (λ = 2 catalogue, minimum at r = 113/200, ρ = 1/5);
c_ker − ρ² ≥ 0.0406 (two heights, c_ker = ((1 − w)(1 − 3r²) + wκ³)/(1 − w + wκ), minimum at MH4);
μ₅ ≥ (16/9)(1/2)⁴(1 − 51/250)(4 − 51/250) = 0.3357 (sharp law). E_N(D) is bounded above using
R_y ≤ ρ·5/2 + 1, R_h ≤ ((7/2)² + r²(5/2)²)^{1/2} (sharp: a² ≤ (5/2)²/3), R_κ ≤ (5/2)κ + 1, 1/h ≤ 2,
1/h̄ ≤ 2/(1 − w + wκ); E_N is decreasing in D. Then for |d| ≥ D,
G(d)/y ≥ (μ_lead d² − E_N(|d|))/|d|^{N+1} ≥ (μ_lead D² − E_N(D))/|d|^{N+1}, and the exact rational check
of μ_lead D_W² > E_N(D_W) passes for all 24 kernels (smallest ratio 19.6, catalogue r = 113/200, λ = 2,
ρ = 1/5; the same check passes at D = 1639 for every kernel). As a check of the algebra, the remainder
|G/y − Σ_{n<N} μ_n d^{−n−1}| was compared with E_N(|d|)|d|^{−N−1} at 600 random rational points with
20 ≤ |d| < 400 (exact arithmetic): ratio ≤ 0.85. G is even in d, so both signs of d are covered. ∎

#### 6.1.4 Lemma C (rate at a contact)

**Lemma C.** Let i ∈ {1, 2}, k ≤ K and t ∈ [t_k, t_{k+1}] ∩ [0, t_e]. Let z* = x* + iY* be a simple zero
of H_t in C_i with Y* > 0 and Y*² ∈ [L_k, q_k] (terminal substep: [q_e, q_K]), such that every zero of
H_t in C_i has |Im| ≤ Y*. Let z(τ) be the smooth zero branch through z* ([P15-3.1(i)]) and
Q(τ) = (Im z(τ))². Assume (W), (S), (RH-head), (RH-win), (F), (K), (T) and E1–E7. Then
Q′(t) < −2 − c_k Y*².

*Proof.* (a) *Velocity.* By [P15-3.1(i)], Im ż(t) = −2 Σ_w (Y* − Im w)/|z* − w|², summed over the zeros
w ≠ z* of H_t with multiplicity; the series converges absolutely by (F3) (each term is at most
2/|z* − w|²). The term w = z̄* equals −1/Y*. Group the remaining zeros into conjugate pairs {w, w̄},
w = x_w + ib_w with b_w > 0, and real zeros (b_w = 0, weight ½); a pair contributes
−2K_{Y*}(d_w, b_w), d_w = x* − x_w. Hence

    Q′(t) = 2Y* Im ż(t) = −2 − 4Y* Σ′ K_{Y*}(d_w, b_w),

Σ′ over the pairs other than {z*, z̄*}, real zeros with weight ½.

(b) *Partition.* Each such zero lies in exactly one class:
 (N) b_w ≤ Y*: zeros in C_i and their images under z ↦ −z̄ (heights ≤ Y* by hypothesis and (F1)); zeros
     with |x_w| < x_f or x_L < |x_w| < x_R, which are real by B.3-head and B.3-win (t ≤ t_e < t_max);
 (Far) |d_w| > x_R − x_L = 7252.2056 and b_w < 1: for i = 1 the zeros with |x_w| > x_R, for i = 2 those
     with x_f < |x_w| < x_L (b_w < 1 by (S); a point of C_1 and a point with x_w > x_R are more than
     x_R − x_L apart, mirror images are farther, and likewise for i = 2).
 No zero has |x_w| ∈ {x_f, x_L, x_R} (B.1) or x_w = 0 (F1).

(c) *Pairwise inequality.* Let a be the option's displacement (a = r h_k; sharp a = ((h_k² − Y*²)/3)^{1/2}).
For w in (N), (K) applies: Y* ≤ ρh_k because Y*² ≤ q_k ≤ ρ²h_k² (E1) (sharp: Y*²/h_k² ≤ q_k/h_k² ≤ v*),
b_w ≤ Y*, and (d_w, b_w) ≠ (0, Y*) because z* is simple and z̄* is excluded. For w in (Far), Lemma H2
applies (h_k ∈ [1/2, 5/2] by E7). So for every pair in Σ′,

    2K_{Y*}(d_w, b_w) ≥ λ (Y*/h_k)·½[K_{h_k}(d_w + a, b_w) + K_{h_k}(d_w − a, b_w)].

(d) *Probe identity.* H_t is even, of order 1, with H_t(0) > 0, so H_t(z) = H_t(0) Π_j (1 − z²/z_j²)
(Hadamard; one z_j from each pair ±z_j). Where H_t(x + ih) ≠ 0,
S(x, h, t) = Σ_w (h − Im w)/|x + ih − w|² = Σ′_{all pairs} K_h(x − x_w, b_w), absolutely convergent;
now {z*, z̄*} is included and contributes K_h(x − x*, Y*). Summing (c) over Σ′:

    Σ′ 2K_{Y*}(d_w, b_w) ≥ λ (Y*/h_k)[½(S(x* + a, h_k, t) + S(x* − a, h_k, t)) − K_{h_k}(a, Y*)].

(e) *Floors and self pair.* x* − a > X_i − 2 (x* > x_f ≥ X_1, resp. x* > x_R ≥ X_2, and a < 2 by E1),
so both probe points lie in the source domain, and t lies in the closed cell i_k. The displacement lies in A_k: trivially for a catalogue shift; for
Raymond's sharp floor because Y*²/h_k² ≤ 51/250; for an r2 window because Y*² ∈ [L_k, q_k] ⊂ [q_lo, q_hi]
(terminal: [q_e, q_K] ⊂ [q_lo, q_hi]) and [a_lo, a_hi] ∋ a(Y*) (E5). So (F) gives
½(S(x* + a) + S(x* − a)) > ℓ_k, and K_{h_k}(a, Y*) ≤ cap_k/h_k (E2). By (a), (d), (E3):

    Q′(t) ≤ −2 − (2λ Y*²/h_k)[½(S(x* + a) + S(x* − a)) − K_{h_k}(a, Y*)] < −2 − (2λ/h_k)(ℓ_k − cap_k/h_k) Y*²
          = −2 − c_k Y*².

Two-height option: in (c) use the two-height forms of (K) and Lemma H2; in (d) add the high probe
S(x*, κh_k, t), whose own term is K_{κh_k}(0, Y*) ≤ s_high (E2), and the low-pair own term
K_{h_k}(rh_k, Y*) ≤ s_pair; with h̄ in place of h_k the same computation gives Q′(t) < −2 − c_k Y*². ∎

#### 6.1.5 Theorem BB

**Theorem BB.** Assume (W), (S), (RH-win), (F), (K), (T), E1–E8 for a band run of band
i ∈ {1, 2}, and for i = 1 also (RH-head) [r3 referee correction: (BB2) does not use (RH-head)]; for i = 1 use [MTY], for i = 2 use [P15-1.5]. Then for every t ∈ [0, t_e], every zero z of
H_t in C_i satisfies (Im z)² < B(t). Consequently (BB1) (i = 1) and (BB2) (i = 2) hold with B_i = B and
t_ei = t_e, and t_ei + q_e/2 ≤ U_i (B-iii).

*Proof.* Put τ₀ = 0 if i = 1. If i = 2, B is continuous on [0, t_1] and B(0) = q_0 > 1 (E8), so there is
τ₀ ∈ (0, t_1] with B > 1 on [0, τ₀]; by (S) every zero then satisfies (Im z)² < 1 < B(t) for
t ∈ [0, τ₀]. Let

    F = {t ∈ [τ₀, t_e] : H_t has a zero z ∈ C_i with (Im z)² ≥ B(t)}.

*Step 1: τ₀ ∉ F.* For i = 2 this was just shown. For i = 1, a zero of H_0 in C_1 is z = 2γ + i(1 − 2β)
for a zero β + iγ of ζ with x_f/2 < γ < x_L/2. [MTY] and the functional equation give
1/(R log γ) < β < 1 − 1/(R log γ), R = 5.558691, so (Im z)² < (1 − 2/(R log(x_L/2)))² = q_MTY(x_L) < q_0
= B(0) (E8).

*Step 2: F is closed.* Let t_n ∈ F, t_n → t, with zeros z_n ∈ C_i, (Im z_n)² ≥ B(t_n) ≥ q_e (B-iii).
The z_n lie in a compact set: |Im z_n| ≤ 1 by (S), and Re z_n ∈ [x_f, x_L] if i = 1 (the cell is walled,
the second referee's step 2); if i = 2, z_n is non-real and t_n ≥ τ₀ > 0, so Re z_n ∈ [x_R, X_c(τ₀)] by
[P15-1.5]. A subsequence converges to a zero z of H_t (F2) with (Im z)² ≥ limsup B(t_n) ≥ B(t) (lower
semicontinuity, B-ii). Since (Im z)² ≥ q_e > 0 and |Im z| ≤ 1, Re z is not a wall abscissa (B.1), so
z ∈ C_i and t ∈ F.

*Step 3: first contact.* Suppose F ≠ ∅ and let t* = min F > τ₀. Let z* ∈ C_i be a zero of H_{t*} with
(Im z*)² ≥ B(t*). If (Im z*)² > B(t*), Hurwitz (F4) on a small disk around z* inside
C_i ∩ {(Im z)² > B(t*) + ε} gives zeros of H_t in that disk for t < t* close to t*; since B(t) → B(t*)
as t ↑ t* (left continuity, B-i), these t belong to F, contradicting minimality. Hence every zero of
H_{t*} in C_i has (Im z)² ≤ B(t*), with equality at z*; by (F1) take Im z* = Y* := B(t*)^{1/2} > 0.
Let k be such that t* ∈ (t_k, t_{k+1}] (k ≤ K); by (B-iv), Y*² ∈ [L_k, q_k] (terminal: [q_e, q_K]).

*Step 4: z* is not multiple.* If z* has order m ≥ 2, [P15-3.1(ii)] (backward) gives for t < t* close to
t* a zero z* + i√2 λ_m (t* − t)^{1/2} + O(t* − t) of H_t, with λ_m > 0 the largest root of He_m; it lies
in C_i and its imaginary part is Y* + √2 λ_m (t* − t)^{1/2} − O(t* − t). On (t_k, t*] the function B is
C¹ and B ≥ q_e, so B(t)^{1/2} ≤ Y* + O(t* − t). Hence t ∈ F for t < t* close to t*: contradiction.

*Step 5: z* is not simple.* Let z(t) be the branch through z* and Q(t) = (Im z(t))². For t < t* close
to t*, z(t) ∈ C_i and t ∉ F, so Q(t) < B(t), while Q(t*) = B(t*). Dividing by t* − t and letting
t ↑ t*: Q′(t*) ≥ D⁻B(t*) = −2 − c_k B(t*) (B-i). Lemma C (its hypotheses hold by Step 3) gives
Q′(t*) < −2 − c_k Y*² = −2 − c_k B(t*): contradiction.

So F = ∅; with the case t < τ₀ handled before, (Im z)² < B(t) for every zero z ∈ C_i and every
t ∈ [0, t_e]. ∎

#### 6.1.6 Remarks

1. *No joint first contact.* The proof of (BB1) uses, about zeros outside C_1, only B.1, B.3 and (S)
   (class (Far) needs b_w < 1 and the distance); it does not use (BB2). The proof of (BB2) does not use
   (BB1). The two barriers are proved separately; the joint first-contact argument asked for in the
   second referee's step 3 is not needed.
2. *Both directions.* In (BB1) the far band-2 zeros lie to the right of the contact (d_w < 0) and their
   mirror images (x_w < −x_R) to the left; in (BB2) the far zeros lie to the left (d_w > 0) [r3 referee correction]. G is even in d, and Lemma H2 allows any far height b_w ≤ 1, also b_w > Y*.
3. *Entry checks.* The consumers' numerical entry checks (band 2: q_0 − (2 + c_0 q_0)·10⁻⁸ > 1; band 1:
   the same against q_MTY) are not used. Step 1 needs only q_0 > q_MTY(x_L) (band 1), and q_0 > 1 with
   continuity of B on the first substep (band 2).
4. *Windowed floors.* The Route P run selects r2 sharp windows on 39,661 of its 74,181 steps. E5 holds on
   every one of them with the lower bound L_k; the smallest margin L_k − q_lo is 2.25·10⁻³.
5. *Heights.* Lemma H2 covers h ∈ [1/2, 5/2]; the runs use heights in [0.6336, 2.18]. The earlier
   Bernstein H2 certificates needed h ≥ (2/5)^{1/2} = 0.63246 (because b²/h² ≤ 5/2), only 0.0011 below the
   smallest Route P height.

#### 6.1.7 Certified runs

`tmp/r3-bb-replay.py RUN OUT` re-implements the selection rule of each consumer, reproduces its exact
output, and checks E1–E8 on every step (`tmp/r3-bb-out/replay_RUN.json`). All seven runs: U reproduced
exactly, 0 failures, start margin q_0 − q_MTY(x_L) = 2.0·10⁻⁶ (band 1) or q_0 − 1 = 2.0·10⁻⁶ (band 2),
max c_kδ ≤ 4.7·10⁻⁵.

| run | band | output U | steps | heights | kernels selected |
|---|---|---|---|---|---|
| `routeP` (r2 floors, κ ∈ {1, 0.94, 0.88}, −0.02 shift) | 1 | 1448843462793/10¹³ = 0.1448843462793 | 74,181 | [0.6336, 2.18] | 5 catalogue, r2 sharp windows |
| `U2` (2.6X stack, κ ∈ {1, 0.97, 0.94}) | 2 | 36063660805739/(2.5·10¹⁴) = 0.144254643222956 | 73,859 | [0.685, 2.18] | 7 catalogue, sharp |
| `X170` (1.7X, κ ∈ {1, 0.97}) | 1 | 18108446112627/(1.25·10¹⁴) = 0.144867568901016 | 74,173 | [0.695, 2.18] | 7 catalogue, sharp |
| `PTMH` (PT, b145 grid + two-height) | 1 | 18409208597849/(1.25·10¹⁴) = 0.147273668782792 | 75,405 | [0.71, 2.18] | 7 catalogue, sharp, 6 two-height |
| `H160` (1.6X two-band) | 1 | 144974387559643/10¹⁵ = 0.144974387559643 | 74,227 | [0.675, 2.18] | 6 catalogue, sharp, 7 two-height |
| `H160b165` (1.6X, band 1 of the three-band form) | 1 | 144951726247781/10¹⁵ = 0.144951726247781 | 74,216 | [0.675, 2.18] | 6 catalogue, sharp, 7 two-height |
| `X165mid` (middle band, floors at 1.65X) | 1* | 144912451862679/10¹⁵ = 0.144912451862679 | 74,196 | [0.72, 2.18] | 7 catalogue, sharp, 6 two-height |

(*) bounded walled cell C(x_R(1.65X window), x_L), treated as band 1 (start q_MTY(x_L) + 2·10⁻⁶), §6.2.

The replays read the floor tables in `/tmp/b145-A-archive`, `/tmp/b145-B-archive` and
`/tmp/raymond_pr` (volatile) and in `tmp/r2-refF-out/corrected_m0023`.

### 6.2 Several bands (chained form)

**Theorem B′.** Let x_f = x_{R,0} < x_{L,1} < x_{R,1} < … < x_{L,m} < x_{R,m}. Assume (W) at every listed
abscissa, (RH-head), RH in each window C(x_{L,j}, x_{R,j}) (as (RH-win)), x_{R,j} − x_{L,j} > 7252 for
every j, (F), (K), and band runs satisfying E1–E8 for the bands C(x_{R,j−1}, x_{L,j}) (1 ≤ j ≤ m; start
q_0 > q_MTY(x_{L,j}), floor height ≤ x_{R,j−1}) and C(x_{R,m}, ∞) (start q_0 > 1, floor height ≤ x_{R,m}),
with outputs U_1, …, U_{m+1} < t_max. Then Λ ≤ max_j U_j.

*Proof.* B.1 and B.3 apply to every wall and every window. Theorem BB applies to each band: a bounded
band as band 1 (Step 1 with [MTY] at its right wall; compactness in Step 2), the last band as band 2. In
Lemma C the class (Far) now consists of the zeros of all other bands and their mirror images; each is
separated from the contact by at least one window, so |d_w| > min_j (x_{R,j} − x_{L,j}) > 7252 and
Lemma H2 applies. Persistence of each band from its t_e to max_j U_j is Lemma B.2, whose (Sep) holds for
the same reason. The ending is that of Theorem B. ∎

Instance: the 1.6X three-band value uses the windows (x_{L,1}, x_{R,1}) = (9900000003031.5801,
9900000018622.2559) (width 15590.68; walls and 42,383-zero FLINT window of `r2-height-reduction`) and
(x_L, x_R) (width 7252.21), with U_1 = 0.144951726247781 (`H160b165`), U_2 = 0.144912451862679
(`X165mid`), U_3 = U2 = 0.144254643222956, so max = 0.144951726247781. It is conditional on (RH-head) to
4.80e12 (not verified), on both FLINT windows, and on (F).

## 7. Matching table

| hypothesis | Route P 0.1448843462793 (PT floor height) | PT-height b145 0.147273668782792 | 1.7X 0.144867568901016 |
|---|---|---|---|
| head wall x_f | X = 6000000185827 (Raymond, both lanes) | same | 10200000023546.2402 (both lanes) |
| (RH-head) | γ ≤ 3000000092913.5: [PT], met | same | γ ≤ 5100000011773.12: **open** |
| (W) x_L, x_R | both lanes, t ≤ 41/250 | same | same |
| (RH-win) | indices 33328427938874..33328427960538; margins 111.70 / 1150.20; FLINT 3.6.0, audited once | same | same |
| (H2) | Lemma H2 (analytic), D_W = 7252 < 7252.2056, h ∈ [1/2, 5/2] | same | same |
| (K) | 5 catalogue kernels + sharp law | 7 catalogue + sharp + 6 two-height | 7 catalogue + sharp |
| (F) band 1 | r2 structured floors (corrected_m0023, −0.02), κ ∈ {1, 0.94, 0.88}: needs weak outer lemma | Track A + grid + two-height floors | Track A floors 1.7X, κ ∈ {1, 0.97} |
| (BB1) | Theorem BB, run `routeP`, U1 = 1448843462793/10¹³ | Theorem BB, run `PTMH`, U1 = 0.147273668782792 | Theorem BB, run `X170`, U1 = 0.144867568901016 |
| (BB2) | Theorem BB, run `U2`, U2 = 0.144254643222956 | same | same |
| max(U1, U2) | U1 → band-2 persistence (step 4) | same | same |
| (T) | < 0.164 | < 0.164 | < 0.164 |

The 1.6X values (Route H) are covered in the same way: two-band `H160` (0.144974387559643) with `U2`;
three-band by Theorem B′ (§6.2) with `H160b165`, `X165mid`, `U2` (0.144951726247781). Both need RH to
4.80e12 (not verified).

## 8. Grades of every step

* **Proved here (written proof, unrefereed):** Lemma B.1; Lemma B.3 and its two applications; Lemma B.2
  (bounded and half-infinite cells); Lemma H2 (analytic; its final inequality checked in exact rational
  arithmetic for all 24 kernels); Lemma C; Theorem BB, hence (BB1) and (BB2) for the seven runs of
  §6.1.7; Theorem B and Theorem B′ as implications from their hypotheses.
* **Cited (published):** [dB] (de Bruijn 1950 Thm 13 = P15 Thm 3.2), [P15-3.1], [P15-1.5] (ineffective
  constant, used qualitatively), [HVP], [PT], [MTY]; Hadamard factorisation of the order-1 function H_t.
* **Certified numerics (exact/interval), with an analytic transfer that is internal-referee SOUND:** (W)
  at all walls (AF §3 Abel transfer + AF §§4–5).
* **Certified numerics (exact), this revision:** (K) — 13 catalogue certificates (re-run: PASS, 8,280
  Bernstein coefficients, 41 leaves) and 10 two-height certificates (re-run: PASS, identical polynomial
  hashes); the sharp-law identity of AF Part II Theorem 1 (symbolic, and exact at 200 rational points);
  the consumer checks E1–E8 on every step of the seven band runs (U reproduced exactly, 0 failures);
  the r2 window containment (1,332 entries); q_MTY(x_L) (arb, 256 bits).
* **Certified conditional on a library audited once:** (RH-win) (FLINT 3.6.0 Platt lemmas 3.2, A5, A7,
  A9, A11, B1, B2, interpolation bound and Turing bound; wrap-around patch).
* **Conditional inputs, not proved here:** (F) — the source floors: Raymond's chain (G0: AF §§6–9 and
  main Lemmas 2–4 self-reviewed only, joint-pair lemma at shifts outside the catalogue), Track A Lemma R
  and C_g monotonicity, the multi-height consumer, two-height coupling (PT b145 and 1.6X runs); for
  Route P band 1 also the r2 structured floors, which need the weak outer lemma (margin 0.02, unproved)
  and carry the time-box allowance 0.0023 (measured at 4 cells, not certified). The validity of the one-point floors at heights κh (two-height
  runs) is part of (F); those floors exist only at κh ≤ 12/5, inside the source height domain of
  `b145-B-lib.validate_cells` (checked for every K-table used: max κh = 2.4).
* **Open:** (RH-head) at 1.6X and 1.7X (RH to 4.80e12 / 5.10e12 not verified).
* **Not used:** simplicity of window zeros; any count of zeros in the window; H1 (2-D zero-free box) of
  the old band lemma, which Lemma B replaces; the consumers' numerical entry checks (§6.1.6 item 3); the
  Bernstein H2 certificates (replaced by Lemma H2).

## 9. Corrections to the record

1. The Track B referee note asks for "band-1 zeros stay real from U1 to max(U1, U2)". That case occurs
   only where U2 > U1, i.e. at floor heights ≥ 2X (band value = U2 = 0.144255). For the band values in
   use (Route P 0.144884, PT height 0.147274, 1.7X 0.144868, 1.6X 0.144974 / 0.144952)
   max(U1, U2) = U1 > U2, so the step that is needed is **band-2 persistence on the half-infinite cell
   C(x_R, ∞) from t_e2 to U1**. It is proved here as Theorem B step 4 and needs [P15-1.5] for
   compactness. Both cases are covered.
2. The band outputs U_i include Raymond's terminal allowance q_e/2, which in Raymond's single-band
   setting comes from the global [dB]. In the two-band setting the global theorem does not apply at
   t_ei; the allowance comes from the local Lemma B.2, whose separation hypothesis (Sep) needs the head
   and the window to be real at all times (B.3). This dependency was not stated before.
3. The window step (B.3) uses no separation and no information about neighbouring bands; a version
   based on Lemma B.2 with y₀ = 0 would need (Sep) and would fail near the walls. The "cross-band
   neighbours have b ≤ 1" fact is used in (BB1)/(BB2) via (H2) and in (Sep) via (S), not in B.3.
4. For band 1 the walled cell is compact, so positivity of the first-contact time follows from
   q_MTY(x_L) < q₀ without the 1e-8 entry check (Theorem BB, Steps 1–2).
5. (BB1) and (BB2) were listed as not proved. They are proved in §6.1 from (W), (S), (RH-head),
   (RH-win), (F), (K) and the certified consumer checks. The second referee's steps 2 (band-1 compactness)
   and 3 (joint first contact; H2 for b ≤ 1 in both directions) are Theorem BB Step 2, Remark 6.1.6.1
   (no joint contact is needed) and Lemma H2 (even in d, any b ≤ 1).
6. The r2 consumer tests the lower end q_lo of a sharp window against an upper enclosure of the step's end
   value. The proof needs a lower bound; with L_k (A₁₇) all 39,661 window steps of Route P pass, smallest
   margin 2.25·10⁻³. No value changes.
7. (H2) holds for |d| ≥ 1639 for every kernel (Lemma H2), so the window width 7252.2 is not the binding
   constraint of the far field; the earlier statement "D_W = 7252 < x_R − x_L" is sufficient, not sharp.

## 10. Reproduction

`python3 formalization/paper/verify_lemma_B_hypotheses.py --flint` (about 25 s; without `--flint` the
recorded FLINT intervals are used). It checks: both wall lanes at x_f(1.7X), X, x_L, x_R (PASS, time and
height ranges, floor lower ends); window chunk continuity and index count; the two boundary zeros
against x_L/2 and x_R/2; (H2) files and D_W < x_R − x_L; U1, U2 < 41/250 and which band is the
maximum; t_e2 > 0; q₀ − q_MTY(x_L) > 1.99e-6 (60-digit decimal); the (RH-head) ordinates against
PT. Result on 2026-10-01: 0 failures. It does not check the FLINT error lemmas or the AF §3 transfer.

Band barriers (§6.1), with `PY=/tmp/s145venv/bin/python` (python-flint 0.8, sympy), from `tmp/`:

    $PY -B r3-bb-h2.py r3-bb-out/H2_analytic.json 1/2 5/2      # Lemma H2: 24 kernels, ALL_PASS (< 1 s)
    $PY -B r3-bb-h2-sym.py                                      # symbolic leading coefficients mu_n
    $PY -B r3-bb-replay.py RUN r3-bb-out/replay_RUN.json        # RUN in routeP U2 X170 PTMH H160 H160b165 X165mid (40-60 s each)
    $PY -B r3-bb-windows.py                                     # r2 sharp windows: 1,332 + 3,142 entries, 0 failures
    $PY -B r3-bb-sharp-identity.py                              # AF Part II Thm 1 identity and self term
    ./r3-bb-mhk-rerun.sh                                        # ten two-height certificates (exact Bernstein)
    (cd /tmp/b145-C-refB-kroot && $PY -B code/check_kernels.py --out $REPO/tmp/r3-bb-out/KERNELS_recheck.json)   # 13 catalogue certificates
    $PY -B r3-bb-collect.py                                     # gathers everything into r3-bb-out/SUMMARY.json

Results of 2026-10-01: `SUMMARY.json` ALL_PASS, 0 failures (`tmp/r3-bb-out/`). The replays depend on the volatile
archives `/tmp/b145-A-archive`, `/tmp/b145-B-archive`, `/tmp/raymond_pr`.

PT Λ ≤ 0.2 stands. RH open. NO QED.
