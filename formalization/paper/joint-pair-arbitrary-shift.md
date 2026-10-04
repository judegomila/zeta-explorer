# Theorem 4′: Raymond's two-probe joint floor at an arbitrary shift 0 < a < 2

Date: 2026-10-01 (r2 round). G0 item "Raymond's joint-pair lemma for arbitrary shifts r"
(`src/data/b145-raymond-referee-2026-10-01.js`, `openForG0` item 3); grade of the two-height coupling in
`src/data/r2-second-referee-2026-10-02.js`: "SOUND (conditional inputs: Raymond Theorem 4 at shifts outside
his catalogue, part of G0)". Companion: `cg-monotonicity.md` (Lemma CG).

Status. This document proves Theorem 4′ (§8): for every closed shift interval I ⊂ (0, 2), every cell
height in the source domain and every floor height X satisfying the domain conditions (Dom), the joint
floor that `tmp/b145-B-lib.py` computes (`joint_pairs`: Raymond's cone and Euler gains; `gains_cell`:
the Track A label families; `make_tables`: minimum over the eleven pair classes) is a lower bound for
(S(x+a,h,t) + S(x−a,h,t))/2, given the one-point input (OP) at both probe points, Lemma CG and Lemma R.
Theorem 4′ contains written proofs of Raymond's Lemma 2, Lemma 3 and Theorem 4; no step depends on the
shift beyond 0 < a < 2. The proofs have not been refereed. (OP) is Raymond's main eq. (1), derived in
§2 from Analytic Foundations (AF) Part I §§5, 8–9; AF §§6–9 have had one self-review and remain an open
G0 item, so Theorem 4′ reduces the arbitrary-shift item to that item and adds no new hypothesis.
`verify_joint_pair_shifts.py` checks (Dom) on every table used and reproduces stored table entries at
the six out-of-catalogue ratios with an independent implementation (§9; PASS). Nothing about Λ is
proved here. PT Λ ≤ 0.2 stands. RH open. NO QED.

---

## 0. Where the lemma is used

*Two-height coupling* (`b145-B-lib.mh_options`): the rate is
(2λ/h̄)[(1−w)ℓ_pair + wℓ_high − (1−w)s_pair − w s_high], where ℓ_pair is the joint floor of the low probe
pair at x ± rh (height h). The ten certified two-height kernels (`tmp/b145-B-out/kernels/MH1..MH10.json`)
use r ∈ {29/50, 3/5, 16/25, 17/25, 7/10, 37/50, 19/25}. Raymond's catalogue has the ten ratios
{9/20, 19/40, 49/100, 1/2, 51/100, 21/40, 107/200, 113/200, 23/40, 3/5}; the low tables were computed with
`--extra-r 29/50,16/25,17/25,7/10,37/50,19/25`.

*Multi-height consumer*: joint floors at catalogue ratios on heights 0.97·PLAN, 0.94·PLAN and
0.91·PLAN (clamped to h ≥ 127/200), and at floor heights 1.6X, 1.65X, 2.6X. These physical shifts
a = rh, heights and floor heights are not computed by Raymond's replay either. The same theorem covers
them.

| table (`/tmp/b145-B-archive/…`) | X | N0 | heights | out-of-catalogue r | max r·h | used by |
|---|---|---|---|---|---|---|
| X1_P100MH | 6000000185827 | 690988 | PLAN, [0.69, 2.18] | the six | 1.6568 | b145 PT stack 0.147273668782792 (superseded at PT by Route P) |
| X1_P0_97 | 6000000185827 | 690988 | 0.97·PLAN, [0.665, 1.80] | — | 1.0800 | b145 PT stack (grid set) |
| X160_P100MH | 9600000000863 | 874038 | PLAN | the six | 1.6568 | Route H, 1.6X band 1 (0.144974387559643; three-band 0.144951726247781) |
| X160_P0_97MH | 9600000000863 | 874038 | 0.97·PLAN | the six | 1.3680 | Route H |
| X160_P0_94MH | 9600000000863 | 874038 | 0.94·PLAN, [0.645, 1.595] | the six | 1.2122 | Route H |
| X160_P0_91 | 9600000000863 | 874038 | 0.91·PLAN clamped, [0.635, 1.545] | — | 0.9270 | Route H |
| X165_P100MH | 9900000003031 | 887590 | PLAN | the six | 1.6568 | Route H three-band (band 2 at 1.65X) |
| X165_P0_97, X165_P0_94 | 9900000003031 | 887590 | 0.97 / 0.94·PLAN | — | 1.0800 / 0.9570 | Route H three-band |
| XW26_P100, XW26_P0_97, XW26_P0_94 | 15600000009475 | 1114185 | PLAN / 0.97 / 0.94 | — | 1.3080 / 1.0800 / 0.9570 | U2 = 0.144254643222956 (Route P and Route H) |

*Route P.* Its band-1 value (`tmp/r2-floor-consume.py`, the consumer behind 0.1448843462793) uses
Raymond's catalogue kernels and the sharp law at κ ∈ {1, 0.94, 0.88}; at κ = 1 a mode's floor is the
larger of the Track A table entry (Raymond's own (h, r) instances plus the Track A families) and the r2
structured floor, at κ ∈ {0.94, 0.88} only the structured floor. The structured floors are a separate
certificate (`tmp/r2-floor-cert.py`) that handles its displacement itself. Band 2 is U2 (2.6X tables
above, catalogue only, `b145-B-stack.py` without `extra_kernels`). **No two-height kernel enters Route
P's value.** Route P needs Theorem 4′ in its generic-height form (U2; the Track A families at κ = 1),
not at out-of-catalogue ratios. (Correction to the ledger of `r2-second-referee-2026-10-02.js`, which
lists the two-height coupling as "needs: both routes".)

## 1. Setting and inputs

Raymond main paper §2 and AF Part I §§4–6. Fix a floor height X with N0 = ⌊((X − 4)/(4π))^{1/2}⌋ (the
value used by every table). For a probe point (x, h, t) with x ≥ X − 2 put

    L = log(x/(4π)),  τ = x/2 + πt/8,  σ_U = (1+h)/2 + tL/4,  σ_V = (1−h)/2 + tL/4,
    s_U⁰ = σ_U − iτ,  s_V⁰ = σ_V + iτ,  γ0 = γ(x,t,0)e^{−hL/2},  |γ(x,t,0)| = 1,
    N = N(x,t) = ⌊(x/(4π) + t/16)^{1/2}⌋ ≥ N0.

The core is Q = E_t(s_U⁰)(P_N(s_U⁰) + γ0 P_N(s_V⁰)), written as a finite sum of labels Σ_j a_j z_j with
a_j ≥ 0, |z_j| = 1, the constant label a_0 = 1, z_0 = 1, and height frequencies λ_j ≥ 0:

| label | amplitude a | phase z | frequency λ |
|---|---|---|---|
| head n, 2 ≤ n ≤ N0 | c_n(t) n^{−σ_U} | e^{iτ log n} | log n |
| tail (d, m), d \| 30, d > 1, m ≤ N0 < dm | β_d(t) b_t(m)(dm)^{−σ_U} | μ(d) e^{iτ log(dm)} | log(dm) |
| activated (d, m), d \| 30, N0 < m ≤ N (AF §8.1) | β_d(t) b_t(m)(dm)^{−σ_U} | μ(d) e^{iτ log(dm)} | log(dm) |
| reflected (d, n), d \| 30, n ≤ N | β_d(t) b_t(n) d^{−σ_U} n^{−σ_V} e^{−hL/2} | μ(d) e^{i(Φ(x) + τ(log d − log n))} | L − log n + log d |

with b_t(x) = e^{t log²x/4}, β_d(t) = Π_{p|d} b_t(p), Φ(x) = arg γ(x, t, 0), and c_n(t) ≥ 0 by Lemma CG (so
the head phase carries no sign). Coincident frequencies are separate labels. Every amplitude is
∝ e^{−λh/2} at fixed (x, t), so with V = Σ_j λ_j a_j z_j

    ∂_h Q = −V/2,     A := Σ_{j≥1} a_j,     B := Σ_j λ_j a_j,     H_C := C|Q|² − Re(V Q̄)   (C real).

The probe value is S(x, h, t) = −Im(H_t′/H_t)(x + ih) = ∂_h log|H_t(x + ih)|.

*Rectangles.* Each plan cell has a time interval [t_L, t_R] ⊂ [0, 41/250] and a height h. Its six
frequency rectangles are R_j = {s := L/2 − log N0 ∈ [s_j, s_{j+1}]}, (s_0, …, s_6) = (0, 1/20, 3/20, 2/5,
1, 2, ∞), with L_j^+ = 2(log N0 + s_{j+1}) and L_j^− = 2(log N0 + s_j) for j ≤ 4.

**(Dom)** X − 4 > 4πN0²; N0 ≥ 1025; 2/(X − 2) < 1/20; every cell height in [11/20, 12/5].

**(OP) One-point input on R_j** (Raymond main eq. (1)). There are rationals ℓ_j, C_j ∈ (0, 17/5) with
2C_j < log N0, A_{+,j} < 4/5 and E_{ℓ,j} such that for every x ≥ X − 2 with s(x) ∈ [s_j, s_{j+1}] and every
t ∈ [t_L, t_R]:

* (OP1) H_t(x + ih) ≠ 0 and A(x, t) ≤ A_{+,j};
* (OP2) (1 + A)[C_j(1 + A) − B] − D_{C_j} > 0, where D_C = 2Σ_{i<k, w_ik<0} |w_ik|, w_ik = a_i a_k(λ_i + λ_k − 2C);
* (OP3) S(x, h, t) > ℓ_j + H_{C_j}/(2|Q|²) + (E_{ℓ,j} − Re(∂_hE/E)), E = E_t(s_U⁰);
* (OP4) E_{ℓ,j} ≥ ½ Σ_{p∈{2,3,5}} log p · ρ_p/(1 − ρ_p), ρ_p = b_t(p) p^{−σ_U} < 1.

The rationals are the stored records: Raymond's exact reassembly of each rectangle
(`b145-B-lib.validate_cells`, a per-cell copy of `assemble_coupled.validate`), both lanes, the lane with
the larger floor chosen per rectangle (`records`). On the infinite rectangle R_5 the same holds.

**Lemma CG** (`cg-monotonicity.md`). For t ≥ t′ ≥ 0 and u ≥ u′ ≥ g: 0 ≤ C_g(u′, t′) ≤ C_g(u, t); in
particular 0 ≤ c_n(t_L) ≤ c_n(t) ≤ c_n(t_R).

**Lemma R** (Track A; graded SOUND on two internal passes). Let X ≥ 6·10¹², 0 < a < 2, x ≥ X − 2 + a
(so x − a ≥ X − 2, inside the AF (4.6) domain; r3 referee correction, previously stated for x ≥ X only),
0 ≤ t ≤ 41/250 and θ := (Φ(x+a) − Φ(x−a))/2 with Φ continuous on [x − a, x + a]. Then

    |θ − aL(x)/2| ≤ ε_R := a(10 + t(L(x−a)/2 + 1))/(x − a) + a²/(4(x − a)) < 10⁻¹⁰.

*Proof* (the sketch is complete; re-derived by the r3 referee). |γ(ξ,t,0)| = 1 and Φ(ξ) = 2 Im log M_t((1 + iξ)/2), so Φ′(ξ) = Re β_t((1 + iξ)/2) with
β_t = α + (t/2)αα′. AF (4.6) (x ≥ X − 4, −1 ≤ σ ≤ 2) gives |α − (L/2 + iπ/4)| < 10/ξ, |α′| < 2/ξ and
|α| < L/2 + 1, hence |Re β_t − L(ξ)/2| ≤ (10 + t(L(ξ)/2 + 1))/ξ, which decreases in ξ. Then
θ − aL(x)/2 = ½∫_{x−a}^{x+a}(Re β_t − L(ξ)/2)dξ + ¼∫_{x−a}^{x+a} log(ξ/x)dξ, and |log(ξ/x)| ≤ |ξ − x|/(x − a).
At X = 6·10¹² the bound is below 5·10⁻¹² for every a < 2 and every x ≥ X − 2 + a (ε_R ≤ 4.2897e-12 at X_PT, 2.689e-12 at 1.6X,
2.608e-12 at 1.65X, 1.660e-12 at 2.6X); the code allowance is
EPS_REFL = 10⁻⁹. ∎ (Measured: max |θ − aL/2| = 1.99e-14, `tmp/r2-ref2-out/lemmaR.log`.)

## 2. The one-point input (OP) and where it comes from

At a probe point of R_j, AF §§4–5 and §8.1 give H_t/B_t = f^0 + e with the leading source f^0 and the
complete physical error e, and Q = E·f^0 including every activated label with the frozen central N. So
E·H_t/B_t = Q + R with R = E·e, |R| ≤ R0, |∂_hR| ≤ R1 (AF (8.5)), and

    S = ∂_h log|B_t| + Re(∂_h(Q + R)/(Q + R)) − Re(∂_hE/E).

1. ∂_h log|B_t(x + ih)| = Re β_t(s_B)/2 > L/4 − 10⁻⁶ ≥ L_j^−/4 − 10⁻⁶, where s_B = (1 + h − ix)/2 is AF's
   variable "a" (B_t = M_t(s_B)) (end of AF §5, via (4.6)).
2. Re(∂_hQ/Q) = −Re(VQ̄)/(2|Q|²) = H_C/(2|Q|²) − C/2 for every real C (∂_hQ = −V/2).
3. |∂_h(Q+R)/(Q+R) − ∂_hQ/Q| ≤ (R1 + B_+R0/(2g))/(g − R0) =: pert, g = 1 − A_+ (AF (9.1); uses |Q| ≥ 1 − A ≥ g,
   |∂_hQ| = |V|/2 ≤ B_+/2 and |Q + R| ≥ g − R0 > 0, which is also (OP1)).
4. −Re(∂_hE/E) = −E_ℓ + (E_ℓ − Re(∂_hE/E)).

Together: S > [L_j^−/4 − 10⁻⁶ − E_ℓ − C/2 − pert] + H_C/(2|Q|²) + (E_ℓ − Re(∂_hE/E)), and ℓ_j is the bracket
rounded down (`validate_cells`: ell = floorq(v0/2 + s_j/2 − 10⁻⁶ − E_ℓ − C/2 − pert − 10⁻⁷)). That is (OP3).
(OP2) follows from the AF §9 cone certificate (1 + A_−)[C(1 + A_−) − B_+] − D_+ > 0 with A_− ≤ A ≤ A_+,
B ≤ B_+, D_C ≤ D_+: positivity forces C(1 + A_−) > B_+, and (1 + A)[C(1 + A) − B_+] increases in A on
[A_−, ∞). (OP4) is the definition of E_ℓ in AF §9 ("the certified Euler cap is at least this full
phase-free cap at every source", main §5). Raymond's one-point floor (AF (9.2)) is (OP3) with the two
retained terms dropped (H_C ≥ 0 by (OP2) and Lemma 2; E_ℓ ≥ Re(∂_hE/E) by (OP4)).

Dependencies of (OP): step 1 on AF §4.2 and §5 (internal referee SOUND); steps 2–4, R0, R1, A_±, B_+,
D_+ on AF §§5–9 and Lemma CG (G0-a, now proved). AF §§6–9 have had one self-review: (OP) is an open
G0 item (G0-d), and at floor heights other than X_PT it also carries the X-transfer note G0-d′
(`cg-monotonicity.md` §8).

## 3. Lemma 2 (surplus identity)

**Lemma 2** (Raymond main §3; AF (6.1)). For labels (a_j, λ_j, z_j), 0 ≤ j ≤ J, with a_0 = 1, λ_0 = 0,
z_0 = 1, A = Σ_{j≥1} a_j, B = Σ_j λ_j a_j and real C,

    H_C = (1 + A)[C(1 + A) − B] − D_C + Σ_{i<k, w_ik ≥ 0} w_ik [1 − Re(z_i z̄_k)] + Σ_{i<k, w_ik < 0} |w_ik| [1 + Re(z_i z̄_k)].

*Proof.* |Q|² = Σ_i a_i² + 2Σ_{i<k} a_ia_k Re(z_iz̄_k) and Re(VQ̄) = Σ_i λ_ia_i² + Σ_{i<k}(λ_i + λ_k)a_ia_k Re(z_iz̄_k).
Also (1 + A)[C(1 + A) − B] = C(Σ_i a_i)² − (Σ_i a_i)(Σ_k λ_ka_k) = Σ_i a_i²(C − λ_i) + Σ_{i<k} a_ia_k(2C − λ_i − λ_k).
Subtracting, H_C − (1 + A)[C(1 + A) − B] = Σ_{i<k} w_ik[1 − Re(z_iz̄_k)]. For w_ik < 0,
w_ik[1 − Re] = −2|w_ik| + |w_ik|[1 + Re], and the −2|w_ik| sum to −D_C. ∎

Each term of the last two sums is ≥ 0 since |Re(z_iz̄_k)| ≤ 1. **Selection.** If (1 + A)[C(1 + A) − B] − D_C
≥ 0, then for every set 𝒮 of labels ν ≥ 1,

    H_C ≥ Σ_{ν∈𝒮} |w_{0ν}| [1 − ε_ν Re z_ν],      ε_ν = +1 if w_{0ν} ≥ 0, −1 otherwise,          (3.1)

(z_0 = 1, so Re(z_0z̄_ν) = Re z_ν). **Denominator** (main eq. (3)). Since 0 < |Q| ≤ 1 + A ≤ 1 + A_+,

    H_C/(2|Q|²) ≥ Σ_{ν∈𝒮} |w_{0ν}| [1 − ε_ν Re z_ν] / (2(1 + A_+)²).                             (3.2)

Averaging two such quotients and then replacing them by a quotient of averages is not used.

## 4. Lemma 3 (paired phases)

**Lemma 3** (Raymond main §4). For |z| = |u| = 1, ε ∈ {−1, 1} and c_+, c_− ≥ c_0 ≥ 0,

    (c_+[1 − ε Re(zu)] + c_−[1 − ε Re(zū)])/2 ≥ c_0 (1 − |Re u|).

*Proof.* Both brackets are ≥ 0, so the left side is ≥ c_0(2 − ε(Re(zu) + Re(zū)))/2 = c_0(1 − ε Re z Re u),
since Re(zu) + Re(zū) = 2 Re z Re u. As |Re z| ≤ 1, this is ≥ c_0(1 − |Re u|). ∎

For u = e^{iφ} with φ in an interval [φ_−, φ_+], the bound holds with
θ(φ_−, φ_+) := inf_{φ∈[φ_−,φ_+]} (1 − |cos φ|) in place of 1 − |Re u|; θ = 0 if the interval contains a
multiple of π, and otherwise θ = 1 − max(|cos φ_−|, |cos φ_+|), because |cos| has no interior maximum
between consecutive multiples of π.

## 5. Translation identities at x ± a

Fix x, t and a real a; put x_± = x ± a. Then τ(x_±) = τ(x) ± a/2, and:

* (T1) head n: z_n(x_±) = z_n(x) e^{±ia log n/2};
* (T2) tail and activated (d, m): z(x_±) = z(x) e^{±ia log(dm)/2} (the sign μ(d) is common to both points);
* (T3) Euler harmonics: with ϑ_p = τ log p, e^{irϑ_p(x_±)} = e^{irϑ_p(x)} e^{±ira log p/2};
* (T4) reflected (d, n): z(x_±) = z^c e^{±iφ} with z^c = μ(d) e^{i[(Φ(x+a) + Φ(x−a))/2 + τ(x)(log d − log n)]} and
  φ = θ + (a/2)(log d − log n); by Lemma R, |φ − aλ_c/2| ≤ ε_R with λ_c = L(x) + log d − log n.

(T1)–(T3) are exact for every real a (the phases are linear in x); (T4) is exact with φ defined as the
half phase difference, and Lemma R places φ. Amplitudes at x_+ and x_− differ (L enters σ_U and e^{−hL/2});
§6 bounds them below on each rectangle. These identities hold whether or not the physical truncations
N(x_+) and N(x_−) differ: every label used below has index ≤ N0 ≤ N(x_±).

## 6. Lower bounds valid on a whole rectangle

For x with s(x) ∈ [s_j, s_{j+1}] (j ≤ 4) and t ∈ [t_L, t_R], put σ_j = (1 + h)/2 + t_R L_j^+/4 ≥ σ_U.

* (L1) head n ≤ 1024: a_n ≥ a̲_{j,n} := c_n(t_L) n^{−σ_j} (Lemma CG; n^{−σ_U} ≥ n^{−σ_j}) (main eq. (11)).
* (L2) Euler: ρ_p = exp(−((1+h)/2) log p + (t/4) log p(log p − L)) decreases in t and L (L > log p), so
  ρ_p ≥ ρ̲_{j,p} := exp(−((1+h)/2) log p + (t_R/4) log p(log p − L_j^+)) (main eq. (12)).
* (L3) head bins B = [n_1, n_2] ⊂ [1025, N0]: a_n ≥ C_{g(n)}(n_1, t_L) n_2^{−σ_j} for n ∈ B, g(n) = gcd(n, 30)
  (Lemma CG, CG5), so the bin's amplitudes sum to at least M_B n_2^{−σ_j},
  M_B = Σ_g #{n ∈ B : gcd(n, 30) = g} C_g(n_1, t_L).
* (L4) tail bins (d, B), B = [m_1, m_2] ⊂ (N0/d, N0]: a_{(d,m)} ≥ β_d(t_L) b_{t_L}(m_1)(dm_2)^{−σ_j}
  (b_t(m) increases in t ≥ 0 and in m ≥ 1).
* (L5) reflected bins (d, B), B = [n_1, n_2] ⊂ [1025, N0]:
  a_{(d,n)} ≥ β_d(t_L) b_{t_L}(n_1) d^{−σ_j} e^{−hL_j^+/2} min(n_1^{−(σ_j − h)}, n_2^{−(σ_j − h)}),
  since σ_V = σ_U − h ≤ σ_j − h, n ↦ n^{−(σ_j−h)} is monotone, and e^{−hL/2} ≥ e^{−hL_j^+/2}.

Frequencies on R_j: head log n; tail log(dm) ∈ [log(dm_1), log(dm_2)]; reflected
λ ∈ [L_j^− − log n_2 + log d, L_j^+ − log n_1 + log d]. On R_5 all lower amplitude bounds are 0.

## 7. Pair-class coverage

Let 0 < a < 2 and x ≥ X − 2 + a. Then x_− ≥ X − 2 > 4πN0² by (Dom), so s(x_−) ≥ 0 and both probes are in
the source domain x ≥ X − 2, with N(x_±) ≥ N0 ≥ 1025. Moreover
s(x_+) − s(x_−) = ½ log(x_+/x_−) ≤ a/x_− < 2/(X − 2) < 1/20 ≤ s_{j+1} − s_j for every finite rectangle. So if
R_j contains x_− and R_k contains x_+ (choosing the lower index at a seam), then

    (j, k) ∈ 𝒫 := {(j, j) : 0 ≤ j ≤ 5} ∪ {(j, j+1) : 0 ≤ j ≤ 4}     (main eq. (13)).

## 8. Theorem 4′

For (j, k) ∈ 𝒫 with k ≤ 4 and I = [a_−, a_+] ⊂ (0, 2) define, with C_max = max(C_j, C_k),
C_min = min(C_j, C_k), D_j = 2(1 + A_{+,j})²:

    g_{jk,n} = max{0, log n − 2C_max, 2C_min − log n},
    G^cone_{jk}(I) = Σ_{n=2}^{1024} g_{jk,n} min(a̲_{j,n}/D_j, a̲_{k,n}/D_k) θ(a_− log n/2, a_+ log n/2),
    G^Eul_{jk}(I)  = ½ Σ_{p∈{2,3,5}} log p Σ_{r=1}^{8} min(ρ̲_{j,p}^r, ρ̲_{k,p}^r) θ(r a_− log p/2, r a_+ log p/2),

and the Track A families (any subset may be used; the tables use all three, the reflected one only for
k ≤ 2): for each bin with lower amplitude bounds α_j, α_k from (L3)–(L5) and frequency range
[λ_lo, λ_hi] over R_j ∪ R_k, gap γ = λ_lo − 2C_max > 0 (required),

    G^bin = γ · min(α_j/D_j, α_k/D_k) · θ(a_− λ_lo/2 − ε, a_+ λ_hi/2 + ε),

with ε = 0 for head and tail bins and ε = ε_R (≤ 10⁻⁹ in the code) for reflected bins; G^H, G^T, G^R are
the sums over the bins. For k = 5 all gains are 0. Put

    J_{jk}(I) = (ℓ_j + ℓ_k)/2 + G^cone_{jk}(I) + G^Eul_{jk}(I) + G^H_{jk}(I) + G^T_{jk}(I) + G^R_{jk}(I).

**Theorem 4′.** Assume (Dom) and (OP) on the six rectangles of a cell with height h and time interval
[t_L, t_R] ⊂ [0, 41/250]. Let I = [a_−, a_+] ⊂ (0, 2). Then for every x ≥ X − 2 + a_+ (in particular every
x > X), every a ∈ I and every t ∈ [t_L, t_R],

    (S(x + a, h, t) + S(x − a, h, t))/2 > min_{(j,k)∈𝒫} J_{jk}(I).

Raymond's Theorem 4 is the case I = {rh} (r in his catalogue, h a PLAN height, X = 6000000185827) without
the Track A families; his sharp-law interval (14) is I = [h((1 − 51/250)/3)^{1/2}, h/√3].

*Proof.* Fix x, a, t and let x_± = x ± a; let R_j ∋ x_−, R_k ∋ x_+, so (j, k) ∈ 𝒫 by §7. By (OP3) at x_−
(constants of R_j) and at x_+ (constants of R_k),

    S(x_∓) > ℓ_{j|k} + H^∓/(2|Q^∓|²) + Eu^∓,

with H^− = H_{C_j} at x_−, H^+ = H_{C_k} at x_+, and Eu^∓ = E_ℓ − Re(∂_hE/E) at x_∓. If k = 5, drop the two
retained terms (both ≥ 0) and the claim is (S(x_+) + S(x_−))/2 > (ℓ_j + ℓ_5)/2 = J_{j5}. Let k ≤ 4.

*Surplus.* Let 𝒮 consist of the head labels n ≤ 1024 with g_{jk,n} > 0 and the labels of the selected
bins. For a head label with g_{jk,n} > 0 either log n > 2C_max, so w_{0n} > 0 at both points, or
log n < 2C_min, so w_{0n} < 0 at both points: ε_n is the same at x_− and x_+, and
|w^∓_{0n}| = a_n(x_∓)|log n − 2C_{j|k}| ≥ a̲_{j|k,n} g_{jk,n}. For a bin label λ − 2C_max ≥ γ > 0 at both
points, so ε = +1 and |w^∓| ≥ (lower amplitude)·γ. By (OP2), (3.1) and (3.2) at each point,

    H^∓/(2|Q^∓|²) ≥ Σ_{ν∈𝒮} c_ν^∓ [1 − ε_ν Re z_ν(x_∓)],      c_ν^∓ = |w^∓_{0ν}|/D_{j|k},

and c_ν^∓ ≥ c_ν^0, where c_ν^0 is the per-label factor in G^cone or G^bin (gap × min over the two rectangles
of lower amplitude / D). By (T1), (T2), (T4), z_ν(x_∓) = z_ν^c e^{∓iφ_ν} with φ_ν = a log n/2 (head),
a log(dm)/2 (tail), or φ_ν within ε_R of aλ_c/2 (reflected); in every case φ_ν lies in the interval whose
θ enters the definition, for every a ∈ I. Lemma 3 per label gives

    (c_ν^+[1 − ε_ν Re z_ν(x_+)] + c_ν^−[1 − ε_ν Re z_ν(x_−)])/2 ≥ c_ν^0 θ_ν.

For a bin, the per-label lower amplitudes are (per-label coefficient bound) × (a factor common to the bin
that depends only on the rectangle), so Σ_{ν∈bin} min_{j,k}(…) = min_{j,k} Σ_{ν∈bin}(…), and summing over the
bin gives G^bin. Hence (H^+/(2|Q^+|²) + H^−/(2|Q^−|²))/2 ≥ G^cone + G^H + G^T + G^R.

*Euler.* E = Π_p (1 − ρ_p e^{iϑ_p}) (p^{−s_U⁰} = p^{−σ_U}e^{iτ log p}) with ρ_p < 1, so
log E = −Σ_p Σ_{r≥1} ρ_p^r e^{irϑ_p}/r converges absolutely; ∂_hρ_p^r = −(r/2) log p · ρ_p^r at fixed (x, t)
gives Re(∂_hE/E) = ½Σ_p log p Σ_r ρ_p^r cos(rϑ_p). With (OP4),
Eu ≥ ½Σ_p log p Σ_{r≥1} ρ_p^r[1 − cos(rϑ_p)] ≥ ½Σ_p log p Σ_{r=1}^{8} ρ_p^r[1 − cos(rϑ_p)] (the dropped terms are
≥ 0; main eq. (8)). By (T3) and Lemma 3 with ε = +1, z = e^{irϑ_p(x)}, u = e^{ira log p/2},
c_± = ½ log p · ρ_p(x_±)^r ≥ c_0 = ½ log p · min(ρ̲_{j,p}^r, ρ̲_{k,p}^r) (by (L2)): (Eu^+ + Eu^−)/2 ≥ G^Eul.

Averaging the two (OP3) inequalities,
(S(x_+) + S(x_−))/2 > (ℓ_j + ℓ_k)/2 + G^cone + G^Eul + G^H + G^T + G^R = J_{jk}(I) ≥ min_𝒫 J. ∎

The two gains come from different addends of (OP3) and use disjoint pairs (0, ν); no coefficient is
used twice, and no independence of phases is assumed.

*From the theorem to the stored tables.* `joint_pairs` evaluates (ℓ_j + ℓ_k)/2 + G^cone + G^Eul with every
coefficient, reciprocal and attenuation rounded down on the 2⁻⁸⁰ grid, in two lanes (192 and 256 bit,
two constructions of c_n), and keeps the smaller; `gains_cell` evaluates G^H, G^T, G^R rounded down with
the bins of `GainCtx` (multiplicative width 1/128) and ε = EPS_REFL = 10⁻⁹; `make_tables` takes, per mode,
min over 𝒫 of [min-lane base + floor_{10⁻¹²}(H + T + R)]. Every stored entry is therefore ≤ min_𝒫 J_{jk}(I)
for its I (I = {rh} for fixed modes, Raymond's interval for the sharp mode), hence a lower bound for the
probe average whenever (OP) and (Dom) hold. `joint_pairs` and `gains_cell` refuse a mode unless
h·r < 2 (`require(right < 2 …)`, `require(ahi.upper() < 2 …)`) and stop on a nonpositive Track A gap.

## 9. Checks (`verify_joint_pair_shifts.py`)

`/tmp/s145venv/bin/python formalization/paper/verify_joint_pair_shifts.py` (python-flint 0.8.0; 17 s).
Result on 2026-10-01: PASS, 0 failures.

* **A, domain.** For all twelve tables of §0: X − 4 > 4πN0² (Arb), N0 ≥ 1025, 2/(X − 2) < 1/20, Lemma R
  budget 50/(X − 4) + 4/(X − 6) < 10⁻¹⁰, every height in [11/20, 12/5], every time cell in [0, 4/25],
  r·h < 2 for every fixed-ratio mode on every cell present (exact rationals; maximum 1.6568 at r = 19/25,
  h = 109/50), h/√3 < 2 for the sharp interval. The two-height kernels use r ∈ {29/50, 3/5, 16/25, 17/25,
  7/10, 37/50, 19/25}, all with 3r² ≥ 1.
* **B, base joint floor.** For X1_P100MH, X160_P100MH, X160_P0_97MH, X160_P0_94MH and X165_P100MH, at
  eight cells (or the cells present) and r ∈ {six out-of-catalogue ratios, 3/5}: G^cone + G^Eul and the
  minimum over 𝒫 recomputed from the archived one-point records with c_n(t_L) from the covering identity
  (a third construction, independent of both lanes) and Arb attenuations; 238 entries, every stored value
  ≤ the independent value, max difference 1.87e-12 (stored values are floored to the 10⁻¹² grid).
* **C, Track A head gain.** G^H for X1_P100MH (829 bins) and X160_P100MH (860 bins), six cells, the six
  out-of-catalogue ratios and all 11 pair classes, with bin bounds C_g(n_1, t_L) from the covering form:
  648 entries, stored ≤ independent in every case, max relative difference 2.6e-19.
* **D, algebra.** 4000 synthetic label sets with phases evaluated at x − a and x + a directly: Lemma 2
  identity; (3.2) (min margin 0.42); Lemma 3 per label, a quarter of the trials at the equality case
  Re z^c = ±1 (min margin −4.9e-17, i.e. 0 at double precision). Float; this proves nothing and guards
  against sign and convention errors.

Not checked here: (OP) itself, Lemma R (beyond the budget), the kernel inequalities (10.1) and of the
two-height kernels, the self-pair terms, the consumers.

## 10. Status and consequences

* **Proved here (written proof, unrefereed):** Theorem 4′, including written proofs of Raymond's Lemma 2,
  eq. (3), Lemma 3, the translation identities (5), the coefficient bounds (11)–(12), the coverage (13),
  Theorem 4 and the sharp-interval case (14); the Track A extension (head, tail and reflected bins) at
  every shift interval I ⊂ (0, 2).
* **Inputs:** (OP) = AF Part I §§5–9 / main eq. (1) — open G0 item G0-d (self-review only), with the
  X-transfer note G0-d′ for floor heights other than X_PT; Lemma CG (proved, `cg-monotonicity.md`);
  Lemma R (SOUND on two internal passes); (Dom) (checked).
* **Certified/measured:** the checks of §9.
* **G0 consequence:** the item "joint-pair lemma at arbitrary shifts" carries no hypothesis beyond the
  one-point input that Raymond's own catalogue already needs. Every table entry at r ∈ {29/50, 16/25,
  17/25, 7/10, 37/50, 19/25} used by the two-height coupling, and every catalogue entry at the grid heights
  and at 1.6X, 1.65X, 2.6X, is a valid joint floor under the same conditions as Raymond's published
  entries. The open G0 items are G0-c (independent reading of Lemmas 2–4 / this document), G0-d (AF §§6–9),
  G0-d′ and G0-e (external referee); see `cg-monotonicity.md` §8.
* **Correction to the ledger:** the two-height coupling is used by Route H (and by the superseded b145 PT
  value), not by Route P's 0.1448843462793.
* **Not claimed:** any statement about Λ; the kernel inequalities, the coupling and the consumers are
  outside this document.

PT Λ ≤ 0.2 stands. RH open. NO QED.
