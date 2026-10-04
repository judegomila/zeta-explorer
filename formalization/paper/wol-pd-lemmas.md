# wol-pd lemmas L1–L5: Fourier form, log-positivity, cosine majorant, θ-uniform extra part with region ladder, tail bounds

Date: 2026-10-02 (r4 round; the module ids carry 2026-10-04). Branch `editorial-redesign`, working files only (nothing
committed). Source of the lemmas: `src/data/r4-wol-pd-2026-10-04.js` (lemma list L1–L5), the docstrings of
`tmp/r4-wolpd-cert.py`, `tmp/r4-wolpd-cert2.py`, `tmp/r4-wolpd-rig.c`, and the internal referee scripts
`tmp/r4-ref-wol-pd-*.py`. Before this note the lemmas existed only in those docstrings and in the r4 report
(`r4-synthesis-2026-10-04.js`, ledger item `wolpd-lemmas`).

Grades used below: PROVED (complete argument written here), CERTIFIED (computer-assisted, outward-rounded interval
arithmetic, in-session, single implementation), CONDITIONAL, MEASURED (floating point or sampling), HEURISTIC.

**Outcome.**

* L1–L5 are PROVED below (§§1–5) for every finite prime prefix S, every truncation N0, every real h and a, and every
  t ≥ 0 (L1 under its hypothesis (Z), zero-freeness of c_1 on the closed polydisc). This write-up has not been refereed. The internal r4 referee had re-derived L1–L5 from the code, including two
  steps that were not written anywhere; they are written here as Lemma 4.4 (region-B duality from the + probe alone) and
  Lemma 5.3(c) (the logarithmic far tail needs X ≥ e^{1/δ}).
* Theorem 6.1 combines L1–L5 into one implication: if the enclosures computed by the r4 engine for an entry are correct,
  then K^sup(E) ≤ U(E), so WOL-C holds with margin m(E) = U(E) − K0*(E). The proof of the implication is complete. The
  hypothesis (correctness of the engine output) is CERTIFIED only: one implementation, one internal referee pass with
  containment tests on 8 entries, the Mlab rounding defect covered by the 10^−9 padding (audited on 5 pieces plus an
  a-priori estimate), no line-by-line audit.
* Arb spot-check `formalization/paper/verify_wol_pd_lemmas.py`: PASS, 645,185 checks, 0 failures, 17 s (§8). It is
  not part of any proof. Five of six deliberately injected formula errors make it fail (§8).
* No Λ value changes. The certified-only route-P value 0.146808080767225 stays CONDITIONAL on the shared inputs and on two
  unaudited engines (149 of its 261 floors rest on r3core4.c, which these lemmas do not cover). Λ < 0.145 still needs WOL-C
  for 380 uncertified floors (372 of them P47); nothing in this note reaches P47.
* PT Λ ≤ 0.2 stands. RH open. NO QED.

Naming. "OW-Lemma 1" below is Lemma 1 (floor validity) of `outer-lemma-weak.md` §1.3. L1–L5 are the wol-pd lemmas:
L1 = Lemmas 1.1–1.2, L2 = Lemmas 2.1–2.3, L3 = Lemmas 3.1–3.3, L4 = Lemmas 4.1–4.4 and Corollary 4.5, L5 = Lemmas
5.1–5.4.

---

## 0. Setting

### 0.1 Coefficients

N0 = 690988, L = 2 log N0, v_n = log n. For 1 ≤ n ≤ N0, at height h and time t,

    a_n(t) = exp(t v_n (v_n − L)/4 − (1 + h) v_n/2),      P_n(t) = exp(−hL/2 + t v_n (v_n − L)/4 − (1 − h) v_n/2),

and a_n = P_n = 0 for n > N0. Then a_1 = 1. For n ≤ N0 one has v_n < L, so a_n(t) and P_n(t) are decreasing in t ≥ 0
(`outer-lemma-weak.md` §2.4).

### 0.2 The Dirichlet ring

𝒟 is the ring of functions ℕ → ℂ under Dirichlet convolution `*`, with unit δ (δ(1) = 1, δ(n) = 0 otherwise). The map
n ↦ x^{e(n)} = ∏_p x_p^{e_p(n)} identifies 𝒟 with the formal power series ring ℂ[[x_p : p prime]]; every coefficient
of every expression below involves finitely many terms. The derivation D, (Df)(n) = (log n) f(n), corresponds to
Σ_p (log p) x_p ∂/∂x_p. For f with f(1) = 1, f is invertible and log f = Σ_{k≥1} (−1)^{k+1} (f − δ)^{*k}/k (a finite sum
at each n). log turns products into sums, and D(log f) = Df * f^{−1}; both are the standard identities for the formal
logarithm and a continuous derivation of ℂ[[x]].

The **log-derivative coefficients** of the truncated Dirichlet polynomial f = Σ_{n≤N0} a_n n^{−s} are

    b := Da * a^{−1},   i.e.   Σ_{d|n} b_d a_{n/d} = a_n log n   for all n ≥ 1,   b_1 = 0.                     (0.1)

Equivalently −f′/f = Σ_n b_n n^{−s}, and b_n = (log n) λ_n with λ = log a. The b_n are defined for all n, including
n > N0, where in general they have no sign (Lemma 2.3(c)).

### 0.3 Prefix, labels, smooth series

S = {q prime : q ≤ P} with P ∈ {5, 7, …, 47}. Letters m, m1, m2 denote S-smooth integers, with exponent vectors e(m) ∈ ℕ^S;
r denotes a **rough** integer (coprime to ∏S), and so do d, e when they index labels (as in acc_r, T2 and (5.6)). In a
divisor sum Σ_{d|n}, d is an arbitrary divisor. Every n factors uniquely as n = m(n) r(n). A **label** is a rough r with
1 < r ≤ N0; v_r = log r > 0.

Restriction to S-smooth integers is a ring homomorphism from 𝒟 onto ℂ[[z_q : q ∈ S]] (all divisors of a smooth integer are
smooth); z^m = ∏_q z_q^{e_q(m)}, and D restricts to D_S = Σ_{q∈S} (log q) z_q ∂/∂z_q. Define

    c_1(z) = Σ_{m≤N0} a_m z^m,               d_1(z) = −½ Σ_{m≤N0} (log m) a_m z^m,
    c_r(z) = Σ_{m≤N0/r} a_{mr} z^m,           d_r(z) = −½ Σ_{m≤N0/r} log(mr) a_{mr} z^m          (labels r),
    F_q(ζ) = Σ_{k: q^k ≤ N0} a_{q^k} ζ^k    (q ∈ S, one complex variable),
    inv := coefficients of 1/c_1 in ℂ[[z]]:  inv_1 = 1,  Σ_{d|m} a_d inv_{m/d} = 0  (m > 1),
    ν := a * inv   (inv extended by 0 to non-smooth integers):  ν_n = Σ_{m | m(n)} inv_m a_{n/m}.

For a power series φ = Σ_m φ_m z^m: ‖φ‖_1 = Σ_m |φ_m|, T_X(φ) = Σ_{m>X} |φ_m|, T^log_X(φ) = Σ_{m>X} ½ (log m) |φ_m|, and
for δ ≥ 0, ‖φ‖_δ = Σ_m |φ_m| m^δ. Since m is an integer, "m > X" and "m > ⌊X⌋" are the same condition.

### 0.4 The r2 bound function

Notation of `outer-lemma-weak.md` §1.1, `tmp/r2-floor-c/r2core_k.c` and `tmp/r2-floor-cert*.py`. θ = (θ_q)_{q∈S} ∈ T^S.
The two probes s ∈ {+, −} evaluate every function of z at

    z^s(θ) = (e^{i(θ_q + s a log q/2)})_{q∈S},          so that  z^s(θ)^m = e^{i⟨e(m),θ⟩} e^{i s a (log m)/2}.

Label phases: ph_r = e^{i a (log r)/2} for probe +, its conjugate for probe −. At each probe, where c_1 ≠ 0:

* w_r = c_r/c_1 and dw_r = (d_r − w_r d_1)/c_1 (labels r);
* rough-log labels by the exact recursion over labels in increasing order:
  l_r = w_r − acc_r/v_r with acc_r = Σ_{(d,e): de=r} v_d l_d w_e, and dl_r = dw_r − dacc_r/v_r with
  dacc_r = Σ_{(d,e): de=r} v_d (dl_d w_e + l_d dw_e); the sums run over ordered pairs of labels;
* reflected branch: cp_r = Σ_{m≤N0/r} P_{mr} conj(z^m) for rough r ≥ 1 (r = 1 included), dp_r the same with
  coefficients −½(L − log(mr)) P_{mr}, wp_r = cp_r/c_1, dwp_r = (dp_r − wp_r d_1)/c_1;
* norms: Wn = Σ_{r>1} |w_r|, A2 = Σ_{r≥1} |wp_r|, B2a = Σ_{r≥1} |dwp_r|, KL = Σ_{r>1} |dl_r|;
* label tails above N0: bins b_r = ⌊v_r^up/Δ⌋ + 1 with v_r^up ≥ log r and Δ = 0.002, threshold thr = ⌊ℓ_0/Δ⌋ with
  ℓ_0 ≤ log N0, bin masses μ_b = Σ_{b_r=b} |w_r|, μ′_b = Σ_{b_r=b} |dw_r|; tl_full = 𝒯(μ, μ′) and tl = 𝒯_{>D}(μ, μ′)
  with the functional 𝒯 of Lemma 4.2 (KMAX = 10, D = 400);
* B2 = B2a + A2 (KL + tl_full), β = (1 + 10^{−12}) B2/(1 − Wn²), V = A2/(1 − Wn), dV = B2/(1 − Wn), hi = dV · V/(1 − V).

Joint quantities:

    K0 = −½ Σ_s Re(d_1/c_1)(z^s),          X_r = ½(dl_r^+ ph_r + dl_r^− conj(ph_r)),
    X̃_r = X_r + ½ β^+ w_r^+ ph_r + ½ β^− w_r^− conj(ph_r),
    T2 = Σ_{labels d ≤ D} Σ_{labels e > N0/d, e ≠ d} |X_{de}|,   X_{de} = −½ Σ_s (w_d^s dw_e^s + dw_d^s w_e^s) ph_d^s ph_e^s,
    Φ_E(θ; t, a) = K0 + Σ_r |X̃_r| + T2 + ½ Σ_s (β^s + hi^s + tl^s).                                             (0.2)

Φ_E is defined when c_1^s(θ) ≠ 0, Wn^s < 1 and V^s < 1 for s = ±. Input from r2, not re-proved here: for each fixed
(θ, t, a), Φ_E(θ; t, a) is an upper bound for the supremum over all other phases of the joint source cost J (the r2
combination inequality; ledger item `r2-floors-base`). That inequality uses the tail functional only through
b_r Δ > log r, which makes every product of labels above N0 land at bin sum > thr.

Remark on bins. The r4 engine bins with its own outward logarithm (`lab_vhi`), the r2 engine with its arb upper bound
of log r; both satisfy b_r Δ > log r. In this note Φ_E denotes (0.2) with the r4 bin assignment. OW-Lemma 1 holds for it
unchanged, because its proof uses only J ≤ Φ_E pointwise.

### 0.5 What is to be shown

For an entry E (cell [t_lo, t_hi], height h, displacement range [a_lo, a_hi], prefix S) put

    K^sup(E) = sup { Φ_E(θ; t, a) : θ ∈ T^S, t ∈ [t_lo, t_hi], a ∈ [a_lo, a_hi] }.

WOL-C is K^sup(E) ≤ K0*(E) + 0.0223/(1 + 10^{−12}), and OW-Lemma 1 admits floor_str(E) − m(1 + 10^{−12}) whenever
K^sup(E) ≤ K0*(E) + m is certified. The r4 engine outputs a number U(E) per entry; Theorem 6.1 states the conditions under
which K^sup(E) ≤ U(E).

---

## 1. L1: Fourier form

**Lemma 1.1 (formal identities).** In ℂ[[z]], with the formal inverse 1/c_1 = Σ_m inv_m z^m:

    (a)  d_1/c_1 = −½ Σ_m b_m z^m;
    (b)  for every label r:
         w_r = Σ_m ν_{mr} z^m,   dw_r = −½ Σ_m log(mr) ν_{mr} z^m,
         l_r = Σ_m (b_{mr}/log(mr)) z^m,   dl_r = −½ Σ_m b_{mr} z^m.

Here w_r, dw_r, l_r, dl_r are the formal power series given by the formulas of §0.4.

*Proof.* Work in ℂ[[x]] with the variables split into z (primes of S) and u (rough primes). Then
f := Σ_{n≤N0} a_n x^{e(n)} = Σ_r c_r(z) u^{e(r)} (r rough, c_1 as above, c_r = 0 for r > N0), and D = D_S + D_R with
D_R u^{e(r)} = (log r) u^{e(r)}.

(a) b = Df * f^{−1} restricts on smooth integers to Σ_m b_m z^m = (D_S c_1)/c_1 = −2 d_1/c_1.

(b) w_r = c_r · (1/c_1); its z^m-coefficient is Σ_{m1 m2 = m} a_{m1 r} inv_{m2} = ν_{mr}. Next, d_r = −½(D_S + v_r) c_r and
d_1 = −½ D_S c_1. The quotient rule for the derivation D_S gives

    dw_r = (d_r − w_r d_1)/c_1 = −½ [ (D_S c_r)/c_1 + v_r c_r/c_1 − c_r (D_S c_1)/c_1² ] = −½ (D_S + v_r) w_r,

whose z^m-coefficient is −½ log(mr) ν_{mr}.

For l_r put R := f/c_1 = 1 + Σ_{r>1} w_r u^{e(r)} and Λ := log R = Σ_{r>1} Λ_r(z) u^{e(r)} (formal logarithm in u).
From D_R Λ · R = D_R R, the coefficient of u^{e(r)} gives, with w_1 := 1,
Σ_{de = r} (log d) Λ_d w_e = (log r) w_r, that is

    (log r) Λ_r = (log r) w_r − Σ_{de = r, d,e > 1} (log d) Λ_d w_e.

This is the recursion defining l_r (v_r > 0), so l_r = Λ_r by induction on r. Since log f = log c_1 + Λ, the coefficient of
u^{e(r)} (r > 1) in D log f = Df * f^{−1} = Σ_n b_n x^{e(n)} is Σ_m b_{mr} z^m on one side and (D_S + v_r) Λ_r on the
other. Comparing z^m-coefficients gives b_{mr} = log(mr) [l_r]_m.

For dl_r we show dl_r = −½(D_S + v_r) l_r by induction on r. If r has no factorisation into two labels, acc_r = dacc_r = 0
and dl_r = dw_r = −½(D_S + v_r) w_r = −½(D_S + v_r) l_r. In general apply −½(D_S + v_r) to
v_r l_r = v_r w_r − Σ_{de=r} v_d l_d w_e. Since v_r = v_d + v_e and D_S is a derivation,

    −½ (D_S + v_d + v_e)(l_d w_e) = [−½(D_S + v_d) l_d] w_e + l_d [−½(D_S + v_e) w_e] = dl_d w_e + l_d dw_e,

by the induction hypothesis (d < r) and the formula for dw_e. So v_r · (−½(D_S + v_r) l_r) = v_r dw_r − dacc_r, which is
v_r dl_r. Hence [dl_r]_m = −½ log(mr) [l_r]_m = −½ b_{mr}. ∎

**Lemma 1.2 (L1, Fourier form).** Fix t, h, a, S and N0, and assume

    (Z)   c_1(z) ≠ 0 for every z in the closed polydisc D̄^S = { |z_q| ≤ 1, q ∈ S }.

Then:

(i) there is ρ > 1 such that 1/c_1 and every series of Lemma 1.1 converge absolutely on the closed polydisc of radius ρ.
In particular Σ_m |b_m|, Σ_m |inv_m|, and for every label r, Σ_m |ν_{mr}|, Σ_m log(mr)|ν_{mr}| and Σ_m |b_{mr}| are finite;

(ii) for every θ ∈ T^S and s = ±, the quantities c_1^{−1}, d_1/c_1, w_r, dw_r, l_r, dl_r of §0.4 at z = z^s(θ) are the
sums of these series. Consequently

    K0(θ) = Σ_m κ_m cos⟨e(m), θ⟩,                κ_m = (b_m/2) cos(a (log m)/2),                              (1.1)
    X_r(θ) = −Σ_m (b_{mr}/2) cos(a log(mr)/2) e^{i⟨e(m),θ⟩},                                                 (1.2)

and, with K := −d_1/c_1, for both probes and all θ,

    |K^s(θ)| ≤ ½ Σ_m |b_m|,   |w_r^s(θ)| ≤ ‖w_r‖_1,   |dw_r^s(θ)| ≤ ‖dw_r‖_1,   |dl_r^s(θ)| ≤ ‖dl_r‖_1 = ½ Σ_m |b_{mr}|.   (1.3)

*Proof.* The zero set of the polynomial c_1 is closed and disjoint from the compact set D̄^S, so it has positive
sup-norm distance ε from D̄^S, and c_1 has no zero on the open polydisc of radius ρ′ = 1 + ε. There 1/c_1, d_1/c_1, w_r,
dw_r and, through the finite recursions, l_r and dl_r are holomorphic. A function holomorphic on the polydisc of radius ρ′
equals its Taylor series at 0, which converges absolutely and uniformly on the closed polydisc of radius ρ = 1 + ε/2
(Cauchy estimates). Taking Taylor series at 0 is an injective ring homomorphism into ℂ[[z]] that commutes with
z_q ∂/∂z_q. The functions satisfy the defining equations of Lemma 1.1, and c_1 has constant term 1, so their Taylor series
are the formal series of Lemma 1.1. This proves (i) and the first part of (ii).

For (1.1): by Lemma 1.1(a), −Re(d_1/c_1)(z^s(θ)) = ½ Σ_m b_m cos(⟨e(m),θ⟩ + s a (log m)/2), since b_m is real and
Σ_q e_q(m) log q = log m. Averaging over s = ± and using cos(x + y) + cos(x − y) = 2 cos x cos y gives (1.1). For (1.2):
dl_r^s = −½ Σ_m b_{mr} e^{i⟨e(m),θ⟩} e^{i s a (log m)/2}. Multiplying by ph_r^s = e^{i s a (log r)/2} and averaging over
s gives −¼ Σ_m b_{mr} e^{i⟨e(m),θ⟩} (e^{i a log(mr)/2} + e^{−i a log(mr)/2}). (1.3) follows from |Σ φ_m ζ^m| ≤ Σ |φ_m|
for |ζ_q| = 1, together with Lemma 1.1. ∎

Remarks. (1) Zero-freeness on the torus alone is not enough: if c_1 had zeros inside D̄^S, d_1/c_1 on the torus would have
Laurent coefficients at negative frequencies and would not equal Σ_m b_m z^m. (2) (Z) is verified through Lemma 4.3(a)
(μ_0 > 0). (3) Lemma 1.1(b) means that the head coefficients of every label are read off one sieve for b; the label
recursion is needed only for tails (Lemma 5.2).

---

## 2. L2: log-positivity of the b_n

**Lemma 2.1 (twisting).** Let χ: ℕ → ℂ^× be completely multiplicative (here χ(n) = n^{−c}). Then f ↦ χf is a ring
automorphism of 𝒟 that commutes with D, with log, with inversion and with restriction to S-smooth integers. Hence every
object built from a by convolution, inversion, log and D transforms by χ. In particular b(χa) = χ b(a),
(χa)^{−1} = χ a^{−1} and ν(χa) = χ ν(a).

*Proof.* (χf) * (χg)(n) = Σ_{d|n} χ(d) f(d) χ(n/d) g(n/d) = χ(n) (f*g)(n), and D(χf) = χ Df. log is a polynomial in
f − δ at each n. ∎

**Lemma 2.2 (cluster expansion).** For real t let g_t(n) = exp(t log²n/4) and λ(t) = log g_t ∈ 𝒟. Let
𝒜 = {(p, k) : p prime, k ≥ 1}, and for α = (p, k) ∈ 𝒜 put c_α = k log p, w_α(t) = e^{t c_α²/4}, and
f_{αβ}(t) = e^{t c_α c_β/2} − 1. For n ≥ 2,

    λ_n(t) = Σ_{N≥1} (1/N!) Σ_{α ∈ 𝒜^N : ∏_i p_{α_i}^{k_{α_i}} = n} ( ∏_i 1/k_{α_i} ) ∏_i w_{α_i}(t) Σ_{H} ∏_{{i,j}∈H} f_{α_i α_j}(t),   (2.1)

where H runs over the connected graphs on the vertex set {1, …, N}. The sum is finite (N ≤ Ω(n)). Grouping sequences by
their multiset 𝐀 of elements of 𝒜 (with multiplicities m_𝐀(α)), equivalently

    λ_n(t) = Σ_{𝐀 : ∏ p^k = n} [ ∏_α (1/k_α)^{m_𝐀(α)} / m_𝐀(α)! ] · ∏_{α∈𝐀} w_α(t) · C_𝐀(t),                       (2.2)

with C_𝐀(t) the connected-graph sum on the |𝐀| vertices of 𝐀. Examples: λ_p = e^{tℓ²/4} (ℓ = log p);
λ_{p²} = ½ e^{tℓ²} + ½ e^{tℓ²/2}(e^{tℓ²/2} − 1) = e^{tℓ²} − ½ e^{tℓ²/2}; λ_{pq} = e^{t(ℓ_p² + ℓ_q²)/4}(e^{tℓ_pℓ_q/2} − 1).

*Proof.* Let G_t(x) = Σ_{n≥1} g_t(n) x^{e(n)}, so log G_t = Σ_n λ_n(t) x^{e(n)}. For α = (p, k) put s_α = x_p^k/k.

Step 1 (generating function). exp(Σ_{α∈𝒜} s_α) = exp(−Σ_p log(1 − x_p)) = ∏_p (1 − x_p)^{−1} = Σ_n x^{e(n)}, and also
exp(Σ_α s_α) = Σ_{N≥0} (1/N!) Σ_{α ∈ 𝒜^N} ∏_i s_{α_i}. The product ∏_i s_{α_i} is a multiple of x^{e(n)} exactly when
∏_i p_{α_i}^{k_{α_i}} = n. So for each n, Σ_N (1/N!) Σ_{α: ∏ p^k = n} ∏_i (1/k_{α_i}) = 1. Put
Φ_N(α) = exp((t/4)(Σ_i c_{α_i})²). Since Σ_i c_{α_i} = log ∏_i p_{α_i}^{k_{α_i}}, Φ_N(α) depends only on that product, and

    G_t = Σ_{N≥0} (1/N!) Σ_{α ∈ 𝒜^N} ∏_i s_{α_i} · Φ_N(α).

Step 2 (graphs). (Σ_i c_i)² = Σ_i c_i² + 2 Σ_{i<j} c_i c_j gives Φ_N(α) = ∏_i w_{α_i} ∏_{i<j} (1 + f_{α_iα_j}). Expanding
the product over edge sets H ⊆ binom([N], 2) and grouping each graph by its connected components,

    Φ_N(α) = Σ_{π ∈ Π([N])} ∏_{B∈π} C(B, α|_B),    C(B, α|_B) = ∏_{i∈B} w_{α_i} Σ_{H connected on B} ∏_{{i,j}∈H} f_{α_iα_j},

where Π([N]) is the set of set partitions of [N]. C(B, α|_B) is unchanged under order-preserving relabelling of B.

Step 3 (exponential formula). If F(B, α) = Σ_{π∈Π(B)} ∏_{β∈π} C(β, α|_β) with C invariant under order-preserving
relabelling, then in ℂ[[x]]

    Σ_{N≥0} (1/N!) Σ_{α ∈ 𝒜^N} s^α F([N], α) = exp( Σ_{N≥1} (1/N!) Σ_{α∈𝒜^N} s^α C([N], α) ),   s^α = ∏_i s_{α_i}.

Proof: write K for the sum inside exp. K^k/k! = (1/k!) Σ_{N_1,…,N_k≥1} ∏_j (1/N_j!) Σ_{α_j: [N_j]→𝒜} s^{α_j} C([N_j], α_j).
Fix N = N_1 + ⋯ + N_k. There are N!/(N_1!⋯N_k!) ordered set partitions (B_1, …, B_k) of [N] with |B_j| = N_j. Via the
order-preserving bijections B_j ≅ [N_j], a colouring α of [N] corresponds to the tuple (α_1, …, α_k), with
s^α = ∏_j s^{α_j} and C(B_j, α|_{B_j}) = C([N_j], α_j). Each unordered partition into k blocks arises from k! orderings.
So K^k/k! = Σ_N (1/N!) Σ_{α:[N]→𝒜} s^α Σ_{π ∈ Π([N]), |π| = k} ∏_{β∈π} C(β, α|_β). Summing over k ≥ 0 gives the claim. All
sums are coefficientwise finite, because each s_α has degree ≥ 1.

Steps 1–3 give log G_t = Σ_{N≥1} (1/N!) Σ_{α∈𝒜^N} s^α C([N], α). The coefficient of x^{e(n)} is (2.1), and grouping the
N!/∏ m_𝐀(α)! orderings of each multiset gives (2.2). ∎

**Lemma 2.3 (L2, log-positivity).**

(a) For n ≥ 2, λ_n(t) and β_n(t) := (log n) λ_n(t) are real-analytic, nonnegative and strictly increasing on t ∈ [0, ∞),
and positive for t > 0. Also λ_n(0) = 1/k if n = p^k, and λ_n(0) = 0 otherwise.

(b) For every real h, every t ≥ 0 and every 1 ≤ n ≤ N0, the log-derivative coefficients (0.1) of the truncated
coefficients a_n(t) satisfy

    b_n(t) = n^{−(1+h)/2 − tL/4} β_n(t).                                                                       (2.3)

So b_n(t) ≥ 0 (> 0 for n ≥ 2, t > 0), and b̃_n(t) := n^{tL/4} b_n(t) = n^{−(1+h)/2} β_n(t) is nondecreasing in t
(strictly for n ≥ 2). For 0 ≤ t1 ≤ t ≤ t2,

    n^{−t2 L/4} b̃_n(t1) ≤ b_n(t) ≤ n^{−t1 L/4} b̃_n(t2).                                                    (2.4)

(c) For n > N0 no sign statement holds. Example: n = 2p with p prime, N0/2 < p ≤ N0. Then a_{2p} = 0 and
b_{2p} = −(b_2 a_p + b_p a_2) < 0. At cell 141 (h = 1.73, t = 141/4000), p = 345511 gives b_{2p} = −2.50·10^{−8}.

*Proof.* (a) For t ≥ 0 and c, c′ > 0, w(t) = e^{tc²/4} ≥ 1 is increasing and f(t) = e^{tcc′/2} − 1 ≥ 0 is increasing
with f(0) = 0. Every term of (2.1) is a positive constant times a product of such functions, hence nonnegative and
nondecreasing; products and positive combinations of nonnegative nondecreasing functions are nonnegative and
nondecreasing. If n = p^k, the N = 1 term (1/k) w_{(p,k)}(t) is strictly increasing. If n has ω(n) ≥ 2 distinct prime
factors, every term has N ≥ 2. The term of the multiset {(p, e_p(n)) : p | n} with the complete graph contains a factor
f, so it is 0 at t = 0, strictly increasing, and positive for t > 0. At t = 0 every f vanishes and only N = 1 terms
survive: (1/k) for n = p^k, none otherwise. Real-analyticity holds because λ_n is a finite sum of exponentials.

(b) By (0.1) and induction, b_n depends only on a_d for d | n. For n ≤ N0 it therefore equals the n-th log-derivative
coefficient of the untruncated sequence â_n = χ(n) g_t(n), χ(n) = n^{−(1+h)/2 − tL/4}, which agrees with a(t) on all
divisors of n. By Lemma 2.1 that coefficient is χ(n) (D log g_t)(n) = χ(n) β_n(t). The rest of (b) follows from (a). For
(2.4) multiply b̃_n(t) ∈ [b̃_n(t1), b̃_n(t2)] by n^{−tL/4} ∈ [n^{−t2L/4}, n^{−t1L/4}]; all factors are nonnegative.

(c) The divisors of 2p are 1, 2, p and 2p, and a_{2p} = 0 because 2p > N0. All of b_2, a_p, b_p, a_2 are positive by (b)
and §0.1. ∎

Relation to Lemma CG (`cg-monotonicity.md`). The mechanism is the same: connected graphs with edge weights
e^{tℓℓ′/2} − 1 ≥ 0. Lemma CG is the covering (Möbius) form for the Euler-factor coefficients c_n(t); Lemma 2.2 is the
logarithmic (cumulant) form for the log-derivative. In both, the closed form has cancelling signs (here
λ_{p²} = e^{tℓ²} − ½e^{tℓ²/2}), while the graph form has none. Probabilistic reading, not used in the proof:
g_t(n) = E[n^X] with X ~ N(0, t/2), and (2.1) is the joint-cumulant expansion of the lognormal variables e^{c_α X}. The
cert docstring writes this as "E_X[ζ(s + (1+h)/2 − X)]". That series diverges for every s when t > 0, so it must be read
coefficientwise, which is what Steps 1–3 do.

---

## 3. L3: cosine majorant

**Lemma 3.1 (one label).** Let F be a finite set of S-smooth integers and (c_m)_{m∈F} **real** numbers. Put
H(θ) = Σ_{m∈F} c_m e^{i⟨e(m),θ⟩}, X0 = H(0) = Σ_m c_m and S1 = Σ_{m∈F, m>1} |c_m|. For every λ > 0 and θ ∈ T^S,

    |H(θ)| ≤ (λ² + X0²)/(2λ) + Σ_{m>1} [ (−X0 c_m + S1 |c_m|)/λ ] (1 − cos⟨e(m),θ⟩).                          (3.1)

*Proof.* Write φ_m = ⟨e(m), θ⟩ and dX = H(θ) − X0 = Σ_{m>1} c_m (e^{iφ_m} − 1).

* AM–GM: |H| ≤ (λ² + |H|²)/(2λ).
* First variation: |H|² = X0² + 2 X0 Re dX + |dX|², and Re dX = −Σ_{m>1} c_m (1 − cos φ_m) because c_m is real.
* Cauchy–Schwarz: |dX|² ≤ (Σ_{m>1} |c_m| |e^{iφ_m} − 1|)² ≤ S1 Σ_{m>1} |c_m| |e^{iφ_m} − 1|², and
  |e^{iφ} − 1|² = 2(1 − cos φ).

Together these give |H|² ≤ X0² + Σ_{m>1} (−2 X0 c_m + 2 S1 |c_m|)(1 − cos φ_m), and (3.1) follows. ∎

**Lemma 3.2 (assembly and separable split).** Let K(θ) = Σ_{m∈F_0} κ_m cos⟨e(m),θ⟩ with real κ_m and F_0 finite, and let
labels r ∈ J carry real data (c_{m,r}) and λ_r > 0 as in Lemma 3.1 (κ_m, c_{m,r} := 0 where undefined). Then for all θ,

    K(θ) + Σ_{r∈J} |H_r(θ)| ≤ C + Σ_{m>1} M_m (1 − cos⟨e(m),θ⟩),                                             (3.2)
    C = Σ_m κ_m + Σ_r (λ_r² + X0_r²)/(2λ_r),      M_m = −κ_m + Σ_r (−X0_r c_{m,r} + S1_r |c_{m,r}|)/λ_r.

For any reals M_m^up ≥ M_m (m > 1),

    sup_θ Σ_{m>1} M_m (1 − cos⟨e(m),θ⟩) ≤ Σ_{q∈S} max_{φ∈[0,π]} f_q(φ) + 2 Σ_{m mixed} max(0, M_m^up),
    f_q(φ) = Σ_{k≥1} M_{q^k}^up (1 − cos kφ),                                                                (3.3)

where "m mixed" means m has at least two distinct prime factors.

*Proof.* K(θ) = Σ_m κ_m − Σ_{m>1} κ_m (1 − cos⟨e(m),θ⟩), since the m = 1 term is constant. Adding (3.1) for each label
gives (3.2). Since 1 − cos ≥ 0, M_m may be replaced by M_m^up. A smooth m > 1 is either a prime power q^k, giving the
separable part Σ_q f_q(θ_q), or mixed, in which case M_m^up(1 − cos) ≤ 2 max(0, M_m^up). Each f_q is even and 2π-periodic,
so its maximum over T is its maximum over [0, π]. ∎

**Lemma 3.3 (grid maxima).** (a) Let f(φ) = Σ_{k=1}^{K} M_k (1 − cos kφ) and φ_i = iπ/(G − 1), 0 ≤ i ≤ G − 1, with
g = π/(G − 1). Then max_{[0,π]} f ≤ max_i f(φ_i) + (g²/8) Σ_k k² |M_k|. (b) If h is 2π-periodic and Λ-Lipschitz and
φ_i = −π + 2πi/G, then sup h ≤ max_i h(φ_i) + Λπ/G.

*Proof.* (a) If the maximum over [0, π] is attained at 0 or π, it is a grid value. Otherwise it is attained at an
interior φ* with f′(φ*) = 0. The nearest grid point satisfies |φ_i − φ*| ≤ g/2, and Taylor's theorem gives
f(φ_i) ≥ f(φ*) − sup|f″| g²/8, with sup|f″| ≤ Σ k²|M_k|. (b) Every point is within π/G of a grid point. ∎

The certificate applies Lemma 3.2 to K = the head of K0 (m ≤ NB = 16 N0) and H_r = the head of X_r (mr ≤ NB). The m = 1
coefficient of X_r, −½ b_r cos(a (log r)/2), carries no (1 − cos) factor and enters X0_r. The parts beyond NB are added as
θ-uniform tails (Theorem 6.1, using L5).

---

## 4. L4: θ-uniform extra part, region ladder, weak duality

**Lemma 4.1 (monotone assembly of the extra part).** Fix (t, a) and a set Ω ⊆ T^S. Suppose that for both probes and every
θ ∈ Ω,

    |w_r^s(θ)| ≤ W_r,  |dw_r^s(θ)| ≤ dW_r,  |dl_r^s(θ)| ≤ ΛL_r  (every label r),  |K^s(θ)| ≤ K̄,  |c_1^s(θ)| ≥ μ > 0,

and that P̄ ≥ Σ_{n≤N0} P_n and dP̄ ≥ ½ Σ_{n≤N0} (L − log n) P_n. Define

    W̄n = Σ_r W_r,  K̄L = Σ_r ΛL_r,  Ā2 = P̄/μ,  B̄2a = (dP̄ + P̄ K̄)/μ,
    t̄l_full = 𝒯(μ̄, μ̄′),  t̄l = 𝒯_{>D}(μ̄, μ̄′)  with  μ̄_b = Σ_{b_r=b} W_r,  μ̄′_b = Σ_{b_r=b} dW_r,
    B̄2 = B̄2a + Ā2 (K̄L + t̄l_full),  β̄ = (1 + 10^{−12}) B̄2/(1 − W̄n²),  V̄ = Ā2/(1 − W̄n),  dV̄ = B̄2/(1 − W̄n),
    h̄i = dV̄ V̄/(1 − V̄),  T̄2 = Σ_{d≤D} Σ_{e>N0/d, e≠d} (W_d dW_e + dW_d W_e),  ēxt = T̄2 + β̄ + h̄i + t̄l.

If W̄n < 1 and V̄ < 1, then for every θ ∈ Ω, Φ_E(θ; t, a) is defined and

    Φ_E(θ; t, a) ≤ K0(θ) + Σ_r |X_r(θ)| + β̄ W̄n + ēxt.                                                        (4.1)

*Proof.* Fix θ ∈ Ω and a probe s.

* Wn^s(θ) = Σ_r |w_r^s| ≤ W̄n < 1, and KL^s ≤ K̄L.
* |cp_r| ≤ Σ_m P_{mr}, so A2^s ≤ Σ_{n≤N0} P_n/|c_1^s| ≤ Ā2.
* dwp_r = dp_r/c_1 + wp_r K and |dp_r| ≤ ½ Σ_m (L − log(mr)) P_{mr} (L − log n > 0 for n ≤ N0), so B2a^s ≤ B̄2a.
* The bin masses at θ are dominated entrywise by μ̄, μ̄′, so tl_full^s ≤ t̄l_full and tl^s ≤ t̄l by Lemma 4.2.
* Hence B2^s ≤ B̄2 and V^s ≤ V̄ < 1, so Φ_E is defined at θ.
* β, V, dV, hi are nondecreasing in (B2, A2, Wn) on {Wn < 1, V < 1}: they are products and quotients of nonnegative
  increasing quantities by decreasing positive ones. So β^s ≤ β̄ and hi^s ≤ h̄i.

Finally, |X̃_r| ≤ |X_r| + ½(β^+ |w_r^+| + β^− |w_r^−|) gives Σ_r |X̃_r| ≤ Σ_r |X_r| + β̄ W̄n. Also |X_{de}| ≤ W_d dW_e +
dW_d W_e, and ½ Σ_s (β^s + hi^s + tl^s) ≤ β̄ + h̄i + t̄l. ∎

With Lemma 1.2, W_r, dW_r, ΛL_r and K̄ can be taken as coefficient ℓ¹ norms (any upper bounds of them). These hold on the
whole torus, for both probes, and do not depend on a. Only μ depends on the region Ω.

**Lemma 4.2 (label-tail functional).** For nonnegative bin vectors μ = (μ_b), μ′ = (μ′_b) with |μ|_1 < 1, an integer
thr ≥ 0 and KMAX ≥ 2, put

    𝒯(μ, μ′) = Σ_{k=2}^{KMAX} mass_{>thr}( μ′ * μ^{*(k−1)} ) + |μ′|_1 |μ|_1^{KMAX}/(1 − |μ|_1),

where * is convolution in the bin index and mass_{>thr}(ν) = Σ_{i>thr} ν_i. 𝒯_{>D} is the same expression with the
k = 2 term computed from the labels r > D only. Both are nondecreasing in every entry of μ and μ′ on {|μ|_1 < 1}.

*Proof.* Each mass term is a polynomial with nonnegative coefficients in the entries. The last term is a product of
|μ′|_1 and |μ|_1^{KMAX}/(1 − |μ|_1), both nondecreasing on [0, 1). Restricting to r > D is a fixed coordinate selection.
∎

This is the functional the r2 and r4 engines evaluate (the r2 code by FFT with a slack, the r4 code by direct
convolution). It bounds the labels above N0 of d_y log(1 + W): the k-th term is the mass beyond N0 of
|W|^{*(k−1)} * |dW|, and the last term bounds all k > KMAX.

**Lemma 4.3 (lower bounds for |c_1|).** Let δ_0 ≥ ‖c_1 − ∏_q F_q‖_1, the ℓ¹ norm of the coefficients of the polynomial
c_1(z) − ∏_q F_q(z_q).

(a) If Σ_{k≥1} a_{q^k} < 1 for every q ∈ S and μ_0 := ∏_q min_{|ζ|=1} |F_q(ζ)| − δ_0 > 0, then |c_1(z)| ≥ μ_0 on D̄^S. In
particular (Z) holds, and |c_1^s(θ)| ≥ μ_0 for all θ and s.

(b) Assume Σ_{k≥1} a_{q^k} < 1 for every q ∈ S, so that F_q has no zero on the unit circle. Put
w_q^s = e^{i s a (log q)/2}, g_q^s(φ) = |F_q(w_q^s)| / |F_q(e^{iφ} w_q^s)|, and P(θ) = max_{s=±} Σ_q log g_q^s(θ_q). Then
for all θ and both probes, |c_1^s(θ)| ≥ ∏_q |F_q(w_q^+)| · e^{−P(θ)} − δ_0.

(c) |F_q(w_q^−)| = |F_q(w_q^+)| and g_q^−(φ) = g_q^+(−φ).

*Proof.* (a) |F_q(ζ)| ≥ 1 − Σ_{k≥1} a_{q^k} |ζ|^k > 0 for |ζ| ≤ 1, so F_q has no zero on the closed disc, and by the
minimum modulus principle min_{|ζ|≤1} |F_q| = min_{|ζ|=1} |F_q|. For z ∈ D̄^S,
|c_1(z)| ≥ ∏_q |F_q(z_q)| − |c_1(z) − ∏_q F_q(z_q)| ≥ ∏_q min |F_q| − δ_0, because |Σ φ_m z^m| ≤ Σ |φ_m| for |z_q| ≤ 1.
(c) The coefficients are real, so F_q(conj ζ) = conj F_q(ζ). Hence |F_q(w̄)| = |F_q(w)| and
g_q^−(φ) = |F_q(w)|/|F_q(e^{−iφ} w)| = g_q^+(−φ). (b) As in (a) at z = z^s(θ):
|F_q(z_q^s)| = |F_q(e^{iθ_q} w_q^s)| = |F_q(w_q^s)| / g_q^s(θ_q). Use (c) and Σ_q log g_q^s(θ_q) ≤ P(θ). ∎

**Lemma 4.4 (weak duality, + probe only).** Let f_q : T → ℝ be even, ℓ_q ≥ log g_q^+ pointwise (q ∈ S), and G ∈ ℝ. For
every λ ≥ 0,

    sup { Σ_q f_q(θ_q) : θ ∈ T^S, P(θ) > G }  ≤  Σ_q sup_φ [ f_q(φ) + λ ℓ_q(φ) ] − λ G.                          (4.2)

*Proof.* If P(θ) > G then Σ_q log g_q^s(θ_q) > G for some s. If s = +, then
Σ_q f_q(θ_q) ≤ Σ_q f_q(θ_q) + λ(Σ_q ℓ_q(θ_q) − G) ≤ the right side. If s = −, put θ′ = −θ. By Lemma 4.3(c),
Σ_q log g_q^+(θ′_q) = Σ_q log g_q^−(θ_q) > G, and Σ_q f_q(θ_q) = Σ_q f_q(θ′_q) because the f_q are even, so the case
s = + applies to θ′. ∎

This is the first of the two steps the referee re-derived without a written source. The engine computes only the
+-probe functions log g_q^+ (`region_data()`), and evenness of the one-prime functions covers the − probe.

**Corollary 4.5 (region ladder).** Let −∞ = G_0 < G_1 < ⋯ < G_K < G_{K+1} = +∞ and B_k = {θ : G_{k−1} < P(θ) ≤ G_k},
k = 1, …, K+1; the bands partition T^S. Put μ_k = max(μ_0, ∏_q |F_q(w_q^+)| e^{−G_k} − δ_0) for k ≤ K, and
μ_{K+1} = μ_0. Suppose:

* the hypotheses of Lemma 4.3(a) hold;
* W_r, dW_r, ΛL_r, K̄ bound the ℓ¹ norms of (1.3);
* W̄n < 1 and V̄(μ_0) < 1;
* K0(θ) + Σ_r |X_r(θ)| ≤ F1c + Σ_q f_q(θ_q) for all θ, with even f_q;
* Ξ_1 ≥ Σ_q max f_q, and for k ≥ 2, Ξ_k ≥ Σ_q sup_φ[f_q + λ_k log g_q^+] − λ_k G_{k−1} for some λ_k ≥ 0.

Then for every θ,

    Φ_E(θ; t, a) ≤ max_{1≤k≤K+1} [ F1c + Ξ_k + β̄(μ_k) W̄n + ēxt(μ_k) ].                                       (4.3)

*Proof.* θ lies in exactly one band B_k. On B_k, P(θ) ≤ G_k, so |c_1^s(θ)| ≥ μ_k for both probes by Lemma 4.3(a),(b). Apply
Lemma 4.1 with Ω = B_k and μ = μ_k; V̄(μ_k) ≤ V̄(μ_0) < 1 because μ_k ≥ μ_0. On B_k, Σ_q f_q(θ_q) ≤ Ξ_k: trivially for
k = 1, and by Lemma 4.4 (P(θ) > G_{k−1}) for k ≥ 2. ∎

`tmp/r4-wolpd-cert.py` uses the two-band ladder K = 1 with G_1 ∈ {0.05, 0.1, 0.15, 0.2, 0.3, 0.45, 0.7} and keeps the best
choice. `tmp/r4-wolpd-cert2.py` uses four ladders (up to K = 9 levels). The ladder-free bound (all θ with μ_0) is always
kept as a candidate. A minimum over valid partitions is valid.

---

## 5. L5: tail identities and far-tail bound

**Lemma 5.1 (coefficient identities).** For all n ≥ 1, S-smooth m and labels r:

    (5.1) Σ_{d|n} b_d a_{n/d} = a_n log n (b_1 = 0); for n > N0: b_n = −Σ_{d|n, d<n, n/d≤N0} b_d a_{n/d}.
    (5.2) inv_1 = 1,  inv_m = −Σ_{d|m, 1<d≤N0} a_d inv_{m/d}.
    (5.3) [w_r]_m = ν_{mr} = Σ_{m1 m2 = m, m1 r ≤ N0} a_{m1 r} inv_{m2},   [dw_r]_m = −½ log(mr) ν_{mr}.
    (5.4) b_m = Σ_{m1 m2 = m, m1 ≤ N0} log(m1) a_{m1} inv_{m2}.
    (5.5) [l_r]_m = b_{mr}/log(mr),   [dl_r]_m = −½ b_{mr}.
    (5.6) l_r = w_r − v_r^{−1} Σ_{de=r} v_d l_d w_e,   dl_r = dw_r − v_r^{−1} Σ_{de=r} v_d (dl_d w_e + l_d dw_e)   in ℂ[[z]].

*Proof.* (5.1) and (5.2) are the definitions. (5.4) is b = Da * a^{−1} restricted to smooth integers. (5.3), (5.5) and
(5.6) are Lemma 1.1 and the definitions of §0.4. ∎

**Lemma 5.2 (tail bounds).** For X ≥ 0 and labels r:

    (a) T_X(w_r) ≤ Σ_{m1 ≤ N0/r} a_{m1 r} T_{X/m1}(1/c_1);
    (b) T_X(dw_r) ≤ Σ_{m1 ≤ N0/r} [ ½ log(m1 r) a_{m1 r} T_{X/m1}(1/c_1) + a_{m1 r} T^log_{X/m1}(1/c_1) ];
    (c) for power series f, g and any Y ≥ 0: T_X(fg) ≤ Σ_{m1 ≤ Y} |f_{m1}| T_{X/m1}(g) + T_Y(f) ‖g‖_1;
    (d) T_X(l_r) ≤ T_X(w_r) + v_r^{−1} Σ_{de=r} v_d T_X(l_d w_e),
        T_X(dl_r) ≤ T_X(dw_r) + v_r^{−1} Σ_{de=r} v_d [ T_X(dl_d w_e) + T_X(l_d dw_e) ];
    (e) Σ_{m>X} ½ |b_m| ≤ Σ_{1<m1≤N0} ½ log(m1) a_{m1} T_{X/m1}(1/c_1);
    (f) T_X(φ) ≤ T_Y(φ) + Σ_{X<m≤Y} |φ_m| for X ≤ Y.

Under (Z) every series involved converges absolutely (Lemma 1.2), so all these quantities are finite.

*Proof.* (a) By (5.3), Σ_{m>X} |Σ_{m1m2=m} a_{m1r} inv_{m2}| ≤ Σ_{m1} a_{m1r} Σ_{m2 : m1m2 > X} |inv_{m2}|, and
m1 m2 > X iff m2 > X/m1 (a ≥ 0). (b) The same with log(m1 m2 r) = log(m1 r) + log m2. (c) A pair (m1, m2) with m1 m2 > X
has either m1 ≤ Y (then m2 > X/m1) or m1 > Y. (d) Coefficientwise triangle inequality in (5.6), with v_d > 0. (e) From
(5.4), as in (a); the m1 = 1 term vanishes because log 1 = 0. (f) Immediate. ∎

In the engine: T^log(1/c_1) is the "D_0 inv²" series of the code (∂_y(1/c_1) has coefficients −½(log m) inv_m). Tails of
w_r and dw_r come from (a), (b) at X = M_r = ⌊NB/r⌋. Tails of l_r and dl_r come from (d) evaluated label by label in
increasing order (`rig_tails`). The products use (c) with Y = M_d (the head of l_d, whose coefficients are |b|/log n and
|b|/2 by (5.5)), T_{X/m1}(w_e) is split by (f) into a head suffix plus tw_e, and ‖w_e‖_1 ≤ Hw_e + tw_e.

**Lemma 5.3 (weighted norms and far tails).** Fix δ > 0.

(a) (One prime.) Let F(ζ) = 1 + Σ_{i=1}^{K_q} α_i ζ^i with α_i ≥ 0, and let ρ = q^δ γ with γ > 1 and
s := Σ_{i≥1} α_i ρ^i < 1. Write 1/F = Σ_k φ_k ζ^k and ψ_k = φ_k ρ^k. Then for every K ≥ K_q, |ψ_k| ≤ C_K := max_{K−K_q<j≤K} |ψ_j|
for all k > K, and

    ‖1/F‖_δ = Σ_k |φ_k| q^{kδ} ≤ Σ_{k≤K} |ψ_k| γ^{−k} + C_K γ^{−K}/(γ − 1).

(b) (Product.) ‖·‖_δ is submultiplicative on ℂ[[z]] because m ↦ m^δ is completely multiplicative. If
D_δ := ‖c_1 − ∏_q F_q‖_δ · ∏_q ‖1/F_q‖_δ < 1, then 1/c_1 has finite δ-norm and
‖1/c_1‖_δ ≤ ∏_q ‖1/F_q‖_δ / (1 − D_δ).

(c) (Head-subtracted far tail.) For X ≥ 1 and any N_δ ≥ ‖1/c_1‖_δ,

    T_X(1/c_1) ≤ X^{−δ} ( N_δ − Σ_{m≤X} |inv_m| m^δ ),

and if moreover X ≥ e^{1/δ},

    T^log_X(1/c_1) ≤ ½ (log X) X^{−δ} ( N_δ − Σ_{m≤X} |inv_m| m^δ ).

(d) ‖c_1 − ∏_q F_q‖_δ = Σ_{m≤N0} |a_m − ∏_q a_{q^{e_q(m)}}| m^δ + Σ′ ∏_q a_{q^{e_q(m)}} m^δ, where Σ′ runs over smooth
m > N0 with every q^{e_q(m)} ≤ N0. The second sum equals ∏_q (Σ_k a_{q^k} q^{kδ}) − Σ_{m≤N0} ∏_q a_{q^{e_q(m)}} m^δ.

*Proof.* (a) F · (1/F) = 1 gives ψ_k = −Σ_{i=1}^{min(k,K_q)} α_i ρ^i ψ_{k−i} for k ≥ 1. Then
|ψ_k| ≤ s · max_{1≤i≤K_q} |ψ_{k−i}| ≤ max_{1≤i≤K_q} |ψ_{k−i}|, and induction on k > K gives |ψ_k| ≤ C_K. Finally
Σ_k |φ_k| q^{kδ} = Σ_k |ψ_k| γ^{−k} ≤ Σ_{k≤K} |ψ_k| γ^{−k} + C_K Σ_{k>K} γ^{−k}.

(b) A_δ = {φ : ‖φ‖_δ < ∞} is a Banach algebra (weighted ℓ¹ on the monoid of smooth integers with a multiplicative weight).
c_1 = (∏_q F_q)(1 + 𝔇) with 𝔇 = (c_1 − ∏_q F_q) · ∏_q (1/F_q) ∈ A_δ and ‖𝔇‖_δ ≤ D_δ < 1. So (1 + 𝔇)^{−1} = Σ_k (−𝔇)^k
lies in A_δ with norm ≤ 1/(1 − D_δ), and ∏_q (1/F_q) · (1 + 𝔇)^{−1} ∈ A_δ ⊂ ℂ[[z]] is an inverse of c_1. Inverses in
ℂ[[z]] are unique, so it is 1/c_1.

(c) Σ_{m>X} |inv_m| ≤ X^{−δ} Σ_{m>X} |inv_m| m^δ = X^{−δ} (‖1/c_1‖_δ − Σ_{m≤X} |inv_m| m^δ). For the logarithmic version,
(log m) m^{−δ} has derivative m^{−1−δ}(1 − δ log m), which is ≤ 0 for m ≥ e^{1/δ}. So (log m) m^{−δ} ≤ (log X) X^{−δ} for
all m > X ≥ e^{1/δ}.

(d) ∏_q F_q(z_q) = Σ_{e : q^{e_q} ≤ N0 ∀q} ∏_q a_{q^{e_q}} z^e has nonnegative coefficients. Its part with m ≤ N0 is
compared termwise with a_m; the part with m > N0 appears only in the product. ∎

The engine takes the first admissible δ in (0.5, 0.4, 0.3, 0.2): for every q some γ ∈ {1.3, 1.2, 1.1, 1.05, 1.02, 1.01}
must satisfy (a), and D_δ < 0.9. It applies (c) at X = NB = 16 N0 (cert) or X = Ms = 10^{12} (cert2). Both exceed
e^{1/0.2} = e^5 ≈ 148.4, which is the condition of (c). This is the second step the referee re-derived without a written
source. Then (e) of Lemma 5.2 gives the far tail of K0 and of K, `far_D0inv`.

**Lemma 5.4 (time enclosures).** Fix a time piece [t1, t2] ⊂ [0, ∞) and h, and put ã_n(t) = n^{tL/4} a_n(t) =
n^{−(1+h)/2} e^{t log²n/4} (n ≤ N0), which is increasing in t.

(a) For X ∈ {b, inv, ν}: X(a(t))_n = n^{−tL/4} X(ã(t))_n (Lemma 2.1 with χ(n) = n^{−tL/4}).

(b) For t ∈ [t1, t2], ã_n(t) ∈ [ã_n(t1), ã_n(t2)]. An interval evaluation of (5.1)–(5.3) with these coefficient intervals
therefore encloses X(ã(t)) for every t in the piece, and multiplying by [n^{−t2L/4}, n^{−t1L/4}] encloses X(a(t)). For
n ≤ N0, Lemma 2.3(b) gives the sharper enclosure (2.4) of b.

(c) (Mean value, cert2.) Let ĩnv(t) be the coefficient sequence of 1/c̃_1(t), where c̃_1(t) = Σ_{m≤N0} ã_m(t) z^m. Let
|ĩnv_m|^max ≥ sup_{t∈[t1,t2]} |ĩnv_m(t)| and I2_m ≥ (|ĩnv|^max * |ĩnv|^max)_m. Then for t, t_c ∈ [t1, t2],

    |ĩnv_m(t) − ĩnv_m(t_c)| ≤ |t − t_c| · Σ_{m1 m2 = m, 1 < m1 ≤ N0} (log² m1/4) ã_{m1}(t2) I2_{m2}.

*Proof.* (a), (b): Lemma 2.1, monotonicity of ã_n, and inclusion-isotonicity of interval arithmetic. (c) ĩnv_m(t) is a
polynomial in finitely many ã_d(t), hence C¹. Coefficientwise in ℂ[[z]], ∂_t (1/c̃_1) = −(∂_t c̃_1)(1/c̃_1)² with
∂_t c̃_1 = Σ_m (log² m/4) ã_m z^m. Also |[ĩnv²]_{m2}| ≤ (|ĩnv| * |ĩnv|)_{m2} ≤ I2_{m2} and ã_{m1}(τ) ≤ ã_{m1}(t2) for
τ ∈ [t1, t2]. Apply the mean value theorem. ∎

---

## 6. Assembly: the certificate inequality

**Theorem 6.1.** Fix an entry E, a time piece [t1, t2] ⊆ [t_lo, t_hi] and an a-piece [a1, a2]. Suppose the following
numbers are given, valid simultaneously for every t ∈ [t1, t2] and a ∈ [a1, a2]:

* (H1) Σ_{k≥1} a_{q^k}(t) < 1 for every q ∈ S; δ_0 ≥ ‖c_1 − ∏_q F_q‖_1; μ_0 ≤ ∏_q min_{|ζ|=1} |F_q(ζ)| − δ_0 with μ_0 > 0.
* (H2) κ_m^hi ≥ κ_m(t, a) for smooth m ≤ NB, and T_K ≥ Σ_{m>NB} ½ |b_m|.
* (H3) For each label r: intervals containing c_{m,r}(t, a) = −½ b_{mr} cos(a log(mr)/2) for mr ≤ NB, hence an interval
  for X0_r and an upper bound for S1_r; λ_r > 0; and T_r ≥ T_{M_r}(dl_r) with M_r = ⌊NB/r⌋.
* (H4) W_r ≥ ‖w_r‖_1, dW_r ≥ ‖dw_r‖_1, ΛL_r ≥ ‖dl_r‖_1, K̄ ≥ ½ Σ_m |b_m|, and P̄, dP̄ as in Lemma 4.1; W̄n < 1 and
  V̄(μ_0) < 1.
* (H5) prodF ≤ ∏_q |F_q(w_q^+)|, and for each λ in a finite set, upper bounds of Σ_q sup_φ [f_q(φ) + λ log g_q^+(φ)].

Let M_m^up be the upper bounds of M_m obtained from (H2), (H3) as in Lemma 3.2 (with κ_m^hi and the interval corners of
−X0_r c_{m,r}), f_q the one-prime functions of (3.3), and

    F1c = Σ_{m≤NB} κ_m^hi + T_K + Σ_r (λ_r² + max X0_r²)/(2λ_r) + 2 Σ_{m mixed} max(0, M_m^up) + Σ_r T_r.

Let Ξ_k be as in Corollary 4.5, with μ_k computed from prodF. Then

    sup { Φ_E(θ; t, a) : θ ∈ T^S, t ∈ [t1, t2], a ∈ [a1, a2] } ≤ U := min over ladders of max_k [ F1c + Ξ_k + β̄(μ_k) W̄n + ēxt(μ_k) ].

Consequently K^sup(E) ≤ U(E) := max over pieces of U, provided the pieces cover [t_lo, t_hi] × [a_lo, a_hi]. The engine
uses nt equal time pieces and equal a-pieces, which do. If U(E) − K0*(E) ≤ 0.0223/(1 + 10^{−12}), WOL-C holds for E, and
OW-Lemma 1 admits floor_str(E) − m(E)(1 + 10^{−12}) with m(E) = U(E) − K0*(E). No time-box or radial-contraction step
enters: t ranges over the cell directly, and the t-dependence is handled by Lemma 2.3(b) and Lemma 5.4.

*Proof.* Fix (t, a) in the pieces.

1. (H1) and Lemma 4.3(a) give (Z) and |c_1^s| ≥ μ_0 everywhere.
2. Lemma 1.2 gives (1.1), (1.2) and (1.3).
3. From (1.1), K0(θ) ≤ Σ_{m≤NB} κ_m cos⟨e(m),θ⟩ + T_K. From (1.2) and (5.5), |X_r(θ)| ≤ |H_r(θ)| + T_{M_r}(dl_r), where
   H_r is the head (m ≤ M_r).
4. Lemma 3.2 applied to the heads, with M_m^up ≥ M_m, gives K0 + Σ_r |X_r| ≤ F1c + Σ_q f_q(θ_q).
5. Corollary 4.5, with (H4), (H5) and Lemma 3.3(b) for the suprema, gives Φ_E(θ; t, a) ≤ max_k [⋯] for every ladder.

All bounds are uniform over the pieces, so the supremum is ≤ U. The last statement is OW-Lemma 1. ∎

**What the engine computes, and what is graded how.** The engine supplies (H1)–(H5) through L2 and L5:

* (H2), (H3): b enclosures by Lemma 2.3(b) (n ≤ N0) and Lemma 5.4(b) with (5.1) (N0 < n ≤ NB); cos balls over the
  a-piece; T_K by Lemma 5.2(e) and T_r by Lemma 5.2(d), (c), both with the far tails of Lemma 5.3.
* (H4): heads Σ|ν|, Σ ½ log n |ν|, Σ ½|b| by (5.3), (5.5); tails by Lemmas 5.2 and 5.3.
* (H1), (H5): coefficient intervals over the piece, grids of Lemma 3.3 for min|F_q|, |F_q(w_q)| and log g_q^+.

Assertions in the code stop the entry (status `fail`, no certificate) if a hypothesis fails: `zf < 1`, `mq > 0`,
`mu0 > 0`, admissible δ, `Wn < 1`, `V < 1`, `totw < 1`, `Flo > 0`, `Fw_lo > 0`, `lmin > 0`, `alo > 0`. Theorem 6.1 is PROVED
as an implication. Whether the engine's numbers satisfy (H1)–(H5) is CERTIFIED (single implementation). Known limits of
that grading:

* Mlab rounding. `Mlab = bincount(..)·(1 + 10^{−9})` rounds mixed-sign float sums the wrong way. The referee measured an
  understatement of U up to 1.65·10^{−11} per piece (`tmp/r4-ref-wol-pd-round.py`, 5 pieces). Every r4 shift is lowered
  by 10^{−9} (`tmp/r4-ref-wol-pd-out/adm_r4_all_pad1e-9.json`). Coverage: the 5 audited pieces and an a-priori estimate,
  not a full audit.
  **r6 (2026-10-06): fixed at source.** The r6 engines (`tmp/r6-suffix-mkengines.py` → `tmp/r6-suffix-cert.py`,
  `cert2.py`, `cone.py`, `p47mix.py` and the referee engine copies) replace the relative-factor-only sums by explicit
  absolute slacks: F1 block suffix (cs[i] − cs[next])(1 + 10^{−9}) + 1.01·N·UU·S_0 with UU = 2.3·10^{−16} ≥ 2u (the r5
  p29-43 referee found that the r4 form undercuts the exact block suffix, up to 1.03·10^{−7} in U); F2 Mlab per bin
  bincount(w) + 10^{−9}·bincount(|w|); F3 bracket; F4 sign-robust Σκ^hi; A1 an asserted N·UU < 1.9·10^{−9} for the
  remaining relative-factor sums (not asserted in `r6-suffix-p47mix.py`, where it holds with nsp·UU ≤ 5.3·10^{−10}).
  All 425 affected certificates on the certified route-P path were re-run (0 failures); one internal referee pass
  (exact-rational and big-integer tests: the r6 forms are never below the exact value). The 10^{−9} admission pad is kept
  and remains part of the rigour budget: it also absorbs the float allowances below and the unaudited C accumulation in
  `rig_tails`.
* Float allowances. Constant slacks in the grid maximisations (1e-13·Σ|M| in `oneprime_max`, 1e-12 and 1e-13 in
  `region_data` and `regionB_bound`) are outward allowances for float evaluation of a few dozen terms. They are not
  derived error bounds.
* Coefficient enclosures. These come from the FLINT/arb program `tmp/r2-floor-c/coef` (shared with r2) and the
  error-folded C sieves of `tmp/r4-wolpd-rig.c`. Neither is audited line by line, and there is no second implementation
  of the assembly.

---

## 7. Where each lemma is used

### 7.1 In the certificate code

| lemma | statement used | code (`tmp/r4-wolpd-cert.py`; cert2 has the same names) | quantity |
|---|---|---|---|
| 1.1, 1.2 (L1) | (1.1), (1.2): K0 and X_r as absolutely convergent series in θ; (1.3): ℓ¹ bounds | `majorant()` (κ_m on smooth m, label heads over `lab_n`); `norms_tails()`, `extra()` | K0_up, const_lab, Mup, W, dW, KL, Kup |
| 2.1 | twisting | `tpiece()` (`tw_up`, `tw_dn`, `twist()`); cert2 sparse inverse | every coefficient enclosure |
| 2.3 (L2) | b_n ≥ 0 and n^{tL/4} b_n nondecreasing (n ≤ N0); (2.4) | `tpiece()`: point sieves `rig_b_point` at t1, t2 on twisted coefficients, `btlo[:N0] = max(b1lo, 0)`, `bthi[:N0] = max(b2hi, b1hi, 0)`, then `twist()` | b for n ≤ N0, the input of `rig_b_ext` (N0 < n ≤ NB) |
| 3.1, 3.2 (L3) | (3.1)–(3.3) | `majorant()`: `const_lab`, `br`, `Mlab`, `Mup`, `exc`, `exc_mixed`; `choose_lambda()` (λ_r = max(\|X0_r\|, 0.5·Σ\|c\|), fixed per entry) | F1 |
| 3.3 | grid maxima | `oneprime_max()` (a, G = 20001); `regionB_bound()` (b); `far_tails()` and `region_data()` grids | exc, Ξ_k, min\|F_q\|, prodF_lo, logg |
| 4.1, 4.2 (L4) | (4.1), monotone 𝒯 | `extra()`, `tail_fn()` | ext, betaterm |
| 4.3 | μ_0, μ_k, (Z) | `far_tails()` (`zf`, `mq`, `defect0`, `mu0`); `run()` (`muA`, `muk`) | μ_0, μ_k |
| 4.4 | duality from the + probe | `regionB_bound()` with `region_data()` (+ probe only) | Ξ_k |
| 4.5 | region ladder | `run()`: two bands (cert), ladders (cert2) | U per piece |
| 5.1 (L5) | (5.1)–(5.5) | `rig_b_point`, `rig_b_ext`, `rig_sminv` / `sp_inv_iv`, `rig_nu`; `norms_tails()` (`absl = \|b\|/log n`, `absdl = \|b\|/2`) | heads |
| 5.2 | tail bounds | `norms_tails()` (`tw`, `tdw`), `rig_tails` (l, dl), `tpiece()` (`far_D0inv`) | tw, tdw, tl, tdl, T_K, Kup |
| 5.3 | far tails | `far_tails()` (δ ladder, γ ladder, ψ recursion, `defect(δ)`, `inv_delta`); `tpiece()` (`head_lo`, `tail_d`, `far_inv`, `far_D0inv2`) | far_inv, far_D0inv, far_D0inv2 |
| 5.4 | time enclosures | `tpiece()`; cert2 `sp_inv_iv` + mean value (`Dt`, `I2`, `der`, `mv_up`, `mv_lo`) | all per-piece interval data |

`tmp/r4-wolpd-cert.py` produced the certificates for P7, P11 and P13 (`cert_p13_{0,1,2}.json`, `cert_extra_p13.json`).
`tmp/r4-wolpd-cert2.py` produced those for P17–P31 (`cert2_p31_*.json`). Both use nt = 2 time pieces, a-pieces of width
≤ 1.1·10^{−3}, and NB = 16 N0.

### 7.2 Downstream

Theorem 6.1 gives U(E) (`U`, `margin` in the certificate JSON). From there:

1. `tmp/r4-wolpd-certfile.py` applies OW-Lemma 1: shift = 0.0023 − m(1 + 10^{−12}), rounded down to the 10^{−13} grid,
   minus 10^{−13}.
2. The referee padding lowers every shift by 10^{−9}.
3. `tmp/r4-synth-merge.py` (source `pd`) takes, per entry, the largest refereed shift among pd, ad, r3 and adref.
4. `tmp/r3-outer-mixed.py` is the exact consumer.

| use | entries resting on L1–L5 | value (exact consumer) |
|---|---|---|
| wol-pd certificates | 263 (257 of the 630 band-path entries: all P7–P23 and 3 of 8 P29; plus 6 off-list P11) | margins 0.0025–0.0220 |
| route P, wol-pd floors only (padded) | all admitted floors | 29368619557091/(2·10^{14}) = 0.146843097785455 |
| route P, merged certified floors (P-cert) | 112 of the 261 floors on the path (source pd); the other 149 rest on r3core4.c | 5872323230689/(4·10^{13}) = 0.146808080767225 |
| route P with WOL-C assumed for 380 floors (P-cond) | the certified part of the path | 0.14477683171425, CONDITIONAL on WOL-C for 380 floors |

All these values are also CONDITIONAL on the shared inputs (G0-c, AF expository gaps, Lemma B.1–B.3 as written, the RH
window trust base, RH-head, the producer layer; `r4-synthesis-2026-10-04.js`).

### 7.3 Where the margin goes (MEASURED: fields of two certificates)

Entry 0|1|r_49_100 (P7, cell 0, t-piece [0, 1/8000]; `tmp/r4-wolpd-out/cert_p13_0.json`). For comparison, the r2 values at
θ = 0 are K0 0.286514, labels 0.087626, extra 0.002765, and K0* = 0.378037.

| item (lemma) | value |
|---|---|
| Σ κ^hi + T_K, i.e. K0_up (L1, L3, L5) | 0.286987 |
| Σ_r (λ_r² + X0_r²)/(2λ_r), i.e. const_lab (L3) | 0.087978 |
| Σ_q max f_q, i.e. exc (L3) | 1.5·10^{−9} |
| 2 Σ_mixed max(0, M^up), i.e. exc_mixed (L3) | 0.000256 |
| Σ_r T_r, label tails beyond NB (L5) | 0.001355 |
| F1 | 0.376576 |
| ēxt(μ_0) and β̄(μ_0)W̄n, with μ_0 = 0.5658 (L4) | 0.005885 and 0.000385 |
| U without ladder | 0.382846 |
| two-band ladder at G_1 = 0.1 (μ_1 = 1.6100): U_A, U_B (L4) | 0.380587, 0.377024 |
| U (piece) / entry margin (max over 2 pieces) | 0.380587 / 0.002550 |

Entry 243|1|sharp (P29, `tmp/r4-wolpd-out/cert2_p31_rev1.json`, piece with the largest U; margin 0.021988):
exc_mixed = 0.009488, label tails 0.004691, ēxt(μ_0) = 0.055329 at μ_0 = 0.5017, δ = 0.4. The mixed-frequency term
contributes 0.0095 to U, against a margin U − K0* = 0.0220. The new angle suggested for P47 ("mixed-frequency bad mass of
the label part") targets this term. The engine bounds it by 2 max(0, M_m^up) per mixed frequency, the crudest step of
Lemma 3.2.

---

## 8. Arb spot-check

`/tmp/s145venv/bin/python formalization/paper/verify_wol_pd_lemmas.py` (python-flint 0.8.0; 128-bit balls, 256 for check
A; `--quick` for a 6-second subset). The script imports no r4 file. Result on 2026-10-02: **PASS, 645,185 checks,
0 failures, about 17 s, 98 MB, exit code 0.**

* **A (L2, Lemma 2.2).** For 2 ≤ n ≤ 600 and t ∈ {0, 1/4000, 123/2000, 29/200}, λ_n(t) is computed by the Dirichlet-log
  recursion and by the cluster form (2.2), with connected-graph sums by the subset recursion. All 2396 pairs overlap. All
  4948 cluster terms are certified > 0 for t > 0 (exactly 0 or positive at t = 0), and λ_n(0) = [n = p^k]/k.
* **B (L2, Lemma 2.3).** Six cells: (h, [t1, t2]) at PLAN rows 0, 141, 243, 437, 555, 579, i.e. t up to 0.145 and h down
  to 0.72, covering the P47 range. For 2 ≤ n ≤ 20000 (119,994 pairs):
  * b_n(t_i) certified > 0, or exactly 0 at t = 0 for ω(n) ≥ 2;
  * n^{t2L/4} b_n(t2) − n^{t1L/4} b_n(t1) certified > 0;
  * the midpoint enclosure (2.4) holds;
  * the factorisation (2.3) holds for n ≤ 1500 (8994 checks).

  Also 62 sampled n up to N0 with many divisors.
* **C (L1, L5).** Three configurations at the real N0: S = {2,3,5} at entries 0|1|r_49_100 and 141|1|r_19_40 of
  `batch_1`, and S = {2,3,5,7} at the P7 entry 0|1|r_49_100 that wol-pd certified. Labels: the two smallest rough primes
  and their product, which exercises the rough-log recursion. At 8 phase points per configuration and both probes:
  * K0(θ) from the rational function −½Σ Re(d_1/c_1) differs from the series (1.1) truncated at M (10^{15}; 10^{13} for
    P7) by at most the rigorous tail bound of Lemma 5.2(e) with 5.3(c);
  * X_r, w_r^s, l_r^s and dl_r^s from the r2 recursion differ from (1.2) and Lemma 1.1 truncated at M_lab (10^{12};
    10^{10}) by at most the tails of Lemma 5.2(a), (b), (c), (d);
  * the ℓ¹ bounds (1.3) hold.

  The observed differences are ≤ 3·10^{−14}; the tail bounds are 5·10^{−12} to 1.4·10^{−8}. Further checks:
  * 13,095 formal identities [l_r]_m = b_{mr}/log(mr) and [dl_r]_m = −½b_{mr} (dl via the r2 recursion with products);
  * 32,606 identities (5.4);
  * far-tail bounds 5.3(c) ≥ direct partial tails at X = 10^6, 10^9, 10^{12};
  * one-prime norms 5.3(a) ≥ direct coefficient sums.
* **D (L3).** At 141|1|r_19_40 with three labels, (3.2) is certified at 53 phase points. The scalar bound
  C + Σ_q max f_q + 2Σ_mixed(M^up)^+ = 0.348765 dominates every sample, and the grid lemma 3.3(a) holds against a 10×
  finer grid.
* **E (L4).** Lemma 4.3(b) and μ_0 = 0.58770 hold at 240 (θ, probe) samples. The probe symmetry 4.3(c) holds at 150
  points. Weak duality (4.2) shows 0 violations over 5801 sampled θ with P(θ) > G for G ∈ {0.05, 0.15, 0.3}. The tail
  functional 𝒯 and the maps β, hi are monotone in 60 random trials.
* **F (L5, Lemma 5.4).** 5052 twisting identities (b and inv). The mean-value enclosure 5.4(c) holds at 4106 points over
  the piece [141/4000, 71/2000] (smooth m ≤ 10^{10}).

Mutation tests (scratch copies of the script, `--quick`). Six formula errors were injected one at a time. Five make the
script fail:

* cos(a log m) in place of cos(a (log m)/2) in κ_m (check C);
* the factor 1/m_𝐀(α)! dropped from (2.2) (check A);
* the (p2, p1) term dropped from acc_{p1p2} (check C, l_r);
* the (p2, p1) term dropped from dacc_{p1p2} (check C, X_r and dl_r);
* the S1 term dropped from M_m (check D).

The sixth, shifting every f_q by 0.6 so that it is no longer even, is not detected. For the shifted functions the best
dual bound is the trivial λ = 0 value Σ_q max f_q, which needs no evenness. So check E tests the evenness clause of
Lemma 4.4 only through the probe-symmetry identity 4.3(c) and the cosine form of f_q.

The spot-check evaluates the lemma statements at sample parameters, with S = {2,3,5} or {2,3,5,7} so that every smooth
series is handled exactly. It does not re-run the certificates and does not test the engine. The referee's independent
tests of the engine are listed in `src/data/r4-wol-pd-2026-10-04.js` and `tmp/r4-ref-wol-pd-out/`: Fourier checks against
the original r2 engine, arb containment on 6 dumps, tail and region checks on 8 dumps, pointwise r2 comparisons on 4
pieces, and the rounding audit.

---

## 9. Status and corrections to the record

**Grades.**
* PROVED here (written, unrefereed): Lemmas 1.1, 1.2, 2.1–2.3, 3.1–3.3, 4.1–4.4, Corollary 4.5, Lemmas 5.1–5.4, and
  Theorem 6.1 as an implication.
* Inputs, not re-proved: the r2 combination inequality J ≤ Φ_E (`r2-floors-base`); OW-Lemma 1.
* CERTIFIED: the 263 wol-pd certificates. These are engine outputs; the caveats are in §6.
* CONDITIONAL: every Λ value below 0.2.
* Ball-arithmetic spot-check (§8): certified numerics at sample parameters, not part of any proof.
* MEASURED (descriptive): §7.3, and the P47 bad-mass survey quoted below.
* HEURISTIC: that this angle cannot reach P47 in general (module wording).

**Corrections and precisions.**
1. Ledger `wolpd-lemmas`: "exist only in docstrings and the report" is now superseded by this note (written,
   unrefereed). The open item is a non-author referee of this note.
2. L2 holds for every n ≤ N0, every real h and every t ≥ 0. It fails for n > N0, where the truncated b_n can be negative
   (Lemma 2.3(c)). The engine treats n > N0 with general sign (`rig_b_ext`), as it should.
3. The cert docstring writes the Cauchy–Schwarz step of L3 with ‖c‖_1. The code, and Lemma 3.1, use S1 = Σ_{m>1}|c_m|,
   which is smaller and suffices.
4. The cert docstring's "E_X[ζ(s + (1+h)/2 − X)]" is a divergent series for t > 0. L2 holds coefficientwise, and its
   proof (Lemma 2.2) uses no probability.
5. "θ-uniform extra part" (module L4) is precise only relative to a lower bound μ of |c_1|. W_r, dW_r, ΛL_r and K̄ are
   θ-uniform on the whole torus (Lemma 1.2); μ is band-dependent through the region ladder (Corollary 4.5).
6. The two unwritten steps the referee re-derived are Lemma 4.4 (only the + probe is needed: evenness of f_q and
   log g_q^−(φ) = log g_q^+(−φ)) and Lemma 5.3(c) (X ≥ e^{1/δ}, satisfied by X = NB and X = 10^{12}).
7. The r4 engine bins labels with its own outward logarithm. Φ_E in WOL-C is read with that binning (§0.4, remark), and
   OW-Lemma 1 applies unchanged.

**Still needed.**
* A non-author referee of this note.
* A line-by-line audit or a second implementation of the wol-pd engine (rig.c sieves, `majorant()`, `extra()`,
  `rig_tails`).
* A full rounding audit replacing the 10^{−9} padding estimate.
* For sub-0.145: WOL-C for the 380 uncertified hybrid-path floors. The implemented majorants leave a measured bad mass of
  0.0166–0.19 at P47 (float survey, 363 entries; 9 below 0.0223). That this angle cannot reach P47 in general is
  HEURISTIC.

PT Λ ≤ 0.2 stands. RH open. NO QED.
