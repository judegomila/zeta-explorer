# Beating 7/8 through the mean square: range and strength

Internal analysis, 2026-10-08. Angle: the mean-square estimate behind the zero-free half-planes of openai/math
family 003 (Proposition 3.1 of the 11/12 paper, and the moment estimates that play the same role in the 7/8 paper).

Goal: find out whether a mean-square estimate over a longer or shorter range, a sharper large sieve (cubic, sextic,
Baier–Young type) or a hybrid bound lowers the exponent below 7/8, and if not, state exactly what stops it.

Result in one line: no. In the 11/12 architecture, 11/12 is the exact limit, and no large-sieve input can move it.
In the 7/8 architecture, 7/8 is exactly the range limit of one specific mean square, the marked completed-row
norm (7/8 paper, Lemma 15.1). Relaxing that range is possible: there is slack in the paper's own bookkeeping that it
does not use. After that, the row counts bind. The best this architecture can reach is 13/15 = 0.8667, and only
with density-hypothesis-strength counts. Nothing in this note proves a zero-free region beyond 7/8.

Status labels used below:
* **[P]** proved here: a complete argument about the papers' inequalities or about general large sieves, checkable
  line by line. These are statements about methods. None of them is a new theorem about L-functions.
* **[P-rel]** proved relative to a lemma of the 7/8 paper taken as stated (that paper is unrefereed; its Lean
  formalisation is described in `lambda-qrh-note-draft.md` §5).
* **[M]** exponent model: a reconstruction of the 7/8 paper's Part II bookkeeping, validated against the paper's
  own certificate (Lemma 20.2). Results for modified inputs are **heuristic**. They hold only if every lemma
  of the paper extends to the new parameters, and that has not been checked.

Sources: `/tmp/qrh-verify/paper2.txt` (the 11/12 paper, "The Quasi-Riemann Hypothesis", 5 Oct 2026) and
`/tmp/qrh-verify/paper.txt` (the 7/8 paper, "A Zero-Free Half-Plane Re s > 7/8", 30 Sep 2026). Equation and lemma
numbers refer to these texts. Scripts: `tmp/beat78-meansquare-*.py`, listed in §8.

---

## 1. Summary of findings

| # | finding | status |
|---|---|---|
| 1 | Prop 3.1 (11/12 paper) holds for every fixed θ > 0. The bound θ ≤ 1/10 is never used. A larger range is worse: the amplified exponent is 11/12 + 5θ/12. | [P] |
| 2 | In the range H ≥ D, Prop 3.1 has the size of the diagonal and of the optimal large sieve, (H + N)·N. A family-blind bound (one depending only on ‖a‖₂, e.g. any large sieve) has constant ≥ N, so for H ≤ D it cannot beat D². No sharper large sieve can improve the 11/12 architecture. | [P] |
| 3 | Exponent map: a mean square Σ_{N(u)≤D^η} \|A_u(D)\|² ≪ D^{α+ε} gives A_1 ≪ D^{max(α/2 − η/12, σ·(1−η/6))}. Beating 7/8 needs α < 7/4 + η/6 at some η < 9/10, i.e. square-root-type cancellation below the natural range. The rows u = p⁶ make such a bound already contain the zero-free statement. | [P] |
| 4 | 7/8 paper, low side: the provable boundary is σ_low = 1 − h/6 + b/12 = **5/6 + M/12 − ℓ/6** (M = lx + ly, ℓ = slot length). Lemma 15.1's range 2M ≥ 1 + 4ℓ then forces σ_low ≥ 7/8 for **every** geometry, with equality exactly on 2M = 1 + 4ℓ. So 7/8 is the range limit of the marked completed-row mean square. | [P-rel] (algebra from (10.3), Prop 15.3, Lemma 15.1) |
| 5 | The worst case of Lemma 14.3 (which feeds Lemma 15.1) is the same with Heath-Brown's cubic large sieve U + V + (UV)^{2/3} and with a hypothetical optimal U + V. The extremal configuration has a trivial dual squarefree column, so the 2/3 term never acts. The sextic large sieve (Lemma 9.1) is used only in Part I. The quadratic large sieve is already optimal. **No large-sieve improvement moves 7/8.** | [P-rel] + LP check |
| 6 | Slack the 7/8 paper does not use: in Prop 15.3 each rescaled tuple set has a factor Z^{−d}. Using it, Lemma 15.1 is needed only for J = ∅, and the range relaxes to 2M ≥ 1 + 3ℓ (with M + ℓ ≤ 1). A refined count of powerful row parts relaxes it further to 2M ≥ 1 + 2ℓ. | [P-rel] (first) / proof sketch (second) |
| 7 | With the paper's row counts, the high side then binds at ℓ = 1/6 + 1.1·10⁻⁴. The model's best boundary is **0.874966**, a gain of 3.4·10⁻⁵, which is negligible. | [M] |
| 8 | Natural-range moment estimates (marks costing z instead of 2z in Lemma 17.1, capacity 1 − 2m in Lemma 18.1, amplification slope 1/2) give 0.8731, 0.8738, 0.8731, 0.8727. All of them together give 0.8717, or 0.8701 with the floor lowered to 1/2. | [M] |
| 9 | **Ceiling of the architecture: 13/15**, whatever the row counts. Three constraints that do not depend on the moment inputs meet at (ℓ, M, b) = (1/5, 4/5, 0): the low-side identity, the column-branch range M + ℓ ≤ 1, and the trivial count R → 1 as δ → 0. Reaching 13/15 needs density-hypothesis counts R = 1 − δ (at amplitude x = 1/2) for every δ. | [P-rel] algebra + [M] check |
| 10 | Height restriction (zeros above 3·10¹²) gives nothing in either architecture. Both arguments run through a family-wide supremum over twists, and the detector uses zeros of twists at all heights. | [P] (structural) |

For the de Bruijn–Newman start q₀ = (2θ − 1)²: 7/8 → 0.5625; 0.874966 → 0.56240; 0.8731 → 0.5570;
13/15 → 0.5378. Every one of these except 7/8 is conditional on unproved inputs or comes from the model.

---

## 2. Proposition 3.1 of the 11/12 paper

### 2.1 Statement and chain

A_u(D) = Σ_{(n,S)=1} μ(n)ν(n)χ_n(u)W(N(n)/D), with χ_n(u) = (u/n)₆ over Z[ω].
Prop 3.1: Σ_{0<N(u)≤D^{1+θ}} |A_u(D)|² ≪ D^{2+θ+ε}, that is, D^{1+ε}·H with H = D^{1+θ}.

Chain of the proof:
* Prop 4.5: expand the square and apply Poisson summation in u. The sextic Gauss sums combine with μ through
  (4.5), μ(n)γ₋₁(n) = χ_n(−1)G(n)⁻¹α(n)γ₂(n), into cubic Gauss sums. The result is the dual mean square
  E(H, X, F) of (4.9), on the dual ranges (4.11): dual row range H = CD²/(HB²) and column scale XF = D/B.
* Prop 5.1: E ≪ D^ε Σ (Σ = XF), under **H ≤ Σ·D^{−κ}** (5.1). The proof combines:
  * Lemma 5.3, cube inversion with cutoff H_c³ = min(X, X²/H²);
  * Prop 5.2, the completed mean square Σ_k |T(X;k,f)|² ≪ D^ε(H + H²N(f)/X). This uses the theta
    transformation (Prop 6.2) and the **quadratic** large sieve (Lemma 6.5, Goldmakher–Louvel);
  * Prop 5.4, the transfer: two Poisson steps with H′ ≤ HL/(ΣF) and H′/Σ′ ≤ H/Σ;
  * an induction on H ≤ D^{jκ}.
* §5.6: H/Σ ≪ D^{−θ}, so Prop 5.1 applies with κ = θ/2 and C₀ = 2.

### 2.2 The upper bound θ ≤ 1/10 is unused [P]

The constant 1/10 appears only in the statements: lines 210, 236, 651, 661, 681, 899 and 1353 of paper2.txt. The proof
in §5.6 uses only these facts:
* H ≤ CD^{1−θ}/B² ≤ CD;
* Σ = D/B ≤ D;
* H/Σ ≤ CD^{−θ}/B;
* X, F ≤ D.

So C₀ = 2 and κ = θ/2 work for every fixed θ ∈ (0, 1]. For θ > 1 the dual range is below 1, only the zero frequency
survives, and the bound is plain orthogonality.

The amplification (proof of Thm 1.1, eq. (3.2)) gives |A_1|² ≪ D^{2+θ+ε}/Y + D²/Y² with Y = H^{1/6}, hence the exponent
11/12 + 5θ/12. This increases with θ (`beat78-meansquare-amplify.py`, part (1)). **A longer range only makes the result
worse.** The limit 11/12 is approached as θ → 0⁺.

### 2.3 What limits the range from below [P]

The lower end θ > 0 is essential. It appears in three places, and all three say the same thing:

1. (5.1) H ≤ ΣD^{−κ} at B = 1 reads D^{1−θ} ≤ D^{1−κ}. Without it, the recursion H′ < H(H/X)² does not contract.
2. The completed mean square (5.5) has the reflected term H²N(f)/X, the dual length after the theta transformation. It
   exceeds the target exactly when H > X.
3. The diagonal of the dual mean square has size ≈ H: each normalised column sum has mean square ≈ 1 over the
   rows. So E(H, X, F) ≪ Σ is not expected when H > Σ. For H ≥ X² it fails outright, because character
   orthogonality makes the diagonal the whole sum.

In the original variables, all three say H ≥ D. This is the natural range of a large sieve with D columns. Below it,
the paper's own chain returns Σ_u |A_u|² ≪ D^{1+ε}·max(H, D), which is the trivial large-sieve size D². The
amplification step then gets no gain.

### 2.4 Strength: already optimal, and no large-sieve input helps [P]

Let Δ(H, N) be the best constant in Σ_{N(u)≤H} |Σ_{n≍N} a_n χ_n(u)|² ≤ Δ‖a‖² over **all** coefficient vectors a. Then:
* Δ ≥ N: take a_n = 1 on the squarefree n ≍ N with (n, S) = 1. The single row u = 1 gives |Σ a_n|² ≍ N‖a‖².
* More strongly, the J ≍ H^{1/6}/log H rows u = p⁶ each give Σ_{(n,p)=1} a_n = Σ a_n + O(N/Y). So Δ ≫ J·N.

Prop 3.1 at H ≥ D gives D·H ≍ (H + N)·N with N ≍ D, i.e. the optimal family-blind size, without the extra term
(HN)^{2/3} of the general sextic large sieve (Blomer–Goldmakher–Louvel). It reaches this through the specific
Möbius/Gauss-sum identity and the theta transformation. Below H = D, any family-blind bound is ≥ N² = D² and gives
nothing.

The candidate "sharper" inputs are the Heath-Brown cubic large sieve, Baier–Young-type cubic estimates, and the BGL
sextic large sieve. All are family-blind, and none is better than (H + N). So **none can improve this architecture.**

The other inputs:
* The normalised Gauss sums have |γ_j(n)| = 1 exactly, so Weil/Deligne bounds play no role.
* The theta transformation is an exact identity.
* The quadratic large sieve (M + L) is already optimal.

### 2.5 The exponent map [P]

Suppose a mean square MS(η, α): Σ_{N(u)≤D^η} |A_u(D)|² ≪ D^{α+ε} holds. Take rows p⁶ with N(p) ≍ Y = D^{η/6}.
The difference A_{p⁶}(D) − A_1(D) = ν(p)·Σ_{(m,p)=1} μ(m)ν(m)W(N(pm)/D) is itself a twisted Möbius sum of length
D/Y. So with an a priori bound A ≪ D^{σ}, the paper's argument gives

  A_1(D) ≪ D^{max(α/2 − η/12, σ(1 − η/6)) + ε}.

With σ = 7/8 (the 7/8 theorem), this beats 7/8 iff **α < 7/4 + η/6**. A bound with α ≥ η + 1 is the most one can
expect, since |A_u|² ≈ D on average. The two conditions are compatible iff η < 9/10. Table (part (4) of the script):

| η | needed α | expected floor η + 1 | large sieve |
|---|---|---|---|
| 1/2 | < 11/6 = 1.8333 | 1.5 | 2 |
| 3/4 | < 15/8 = 1.875 | 1.75 | 2 |
| 4/5 | < 113/60 = 1.8833 | 1.8 | 2 |
| 9/10 | < 19/10 | 1.9 | 2 |

Square-root cancellation on average at every η would give 1/2 + 5η/12 (RH-strength as η → 0) once the error term is
bootstrapped. With the paper's trivial error term O(D/Y), the optimum is η = 6/7, giving the exponent 6/7.

Such a bound below the natural range is circular for this family. It must control J·|A_1|² ≤ Σ_{u=p⁶} |A_u|², and the
rows u = p⁶ reproduce A_1. A sub-natural-range mean square therefore contains the zero-free statement itself, and the
large-sieve chain (§2.3) gives exactly D² there.

### 2.6 Hybrid bounds [P]

Adding a height average, Σ_u ∫_{|t|≤T} |A_u(D, t)|² dt, enlarges the family to size HT. The set where A ≈ A_1 at a
zero of height γ is still only {u = p⁶} × {|t − γ| ≲ 1}, of size J·O(1). So the hybrid large sieve (HT + D)·D gives at
best D²/J at HT ≥ D, which is no better. The height aspect adds no amplifier rows.

---

## 3. What the 7/8 paper proves instead

The 7/8 paper is a different argument: a zero detector applied to a probe with two exact representations. It proves 11/12
again in its Part I, by the probe (§§3–11), not by Prop 3.1. Its mean-square inputs are:

| result | content | range / strength | used in |
|---|---|---|---|
| Lemma 5.8 | unmarked completed-row moment Σ_{q_m≤Z^M} \|C_V(Z^N; m, ν)\|² | ≪ Z^{O/2+max(M−O, 2M−O−N)}: square-root size for M ≤ N, no lower restriction | Part I low side (Prop 6.3, M = N = 1) |
| Lemma 6.1/6.2, Prop 15.2 | planar additive large sieve; additive Gram bound | Σ\|A_m\|² ≪ (Q/Y′)(1 + P_a^{1/6} + P_a²/Y′); P_a^{1/6} comes from sixth-power exceptional frequencies | low side |
| Lemma 9.1, Prop 9.2 | sextic large sieve (BGL recursion) | K + D + (KD)^{2/3}; envelope R(δ) = min{1, max(1 − δ/2, 4/3 − δ)} | **Part I only** |
| (14.6), Lemma 14.2 | Heath-Brown cubic large sieve inside a quadratic–cubic norm | (K + NB)B{N + L + (NL)^{2/3}} | marked reflected energy |
| Lemma 14.3 | marked reflected energy E_ref (14.14) | see §4 | Lemma 15.1, Lemma 17.2 |
| **Lemma 15.1** | marked completed-row norm Σ\|B^J_m(Z)\|² ≪ Z^{M′+((d−1/6)/4)₊} | needs 2M′ ≥ 1 + 3ℓ′ in the branch u ≠ z_a; with M + ℓ = 1 this is ℓ ≤ 1/6 | Part II low side (Prop 15.3) |
| **Lemma 17.1** | marked inverse moment Σ_{q_u≪Z^m} \|M_u(Z^r)Q_u\|² ≪ Z^{m+ε} | **r + 2z ≤ m − c₁**, 2r + 8z ≤ 3m − c₂ | inverse capacity z_M(r) = (1 − r)/2 |
| (17.87) | unmarked case | Σ_{q_u≤H} \|D^{−1/2}A_u(D)\|² ≪ H^{1+ε}, H ≥ D^{1+c}: **this is Prop 3.1** | Lemma 17.6 |
| **Lemma 17.6** | sixth-power amplification over sixth-power-free rows u ≍ U | e(r) = max{1, (1 + 5r)/6}, D = U^r; at U = 1 this is **the 11/12 theorem** | slope α = 5/6 in L(t) |
| **Lemma 18.1** | fourth moment of two plain polynomials × prime slots | no length restriction at z = 0; **n₁ + n₂ + 6κz ≤ M** for z > 0 | plain capacity z_P(m) = (1 − 2m)/(6κ) |
| Prop 19.2 | row counts from witnesses | R* = 1 − δ + (α − δ)δP_x/(2J) at the balance | Part II high side |

So the 7/8 paper keeps Prop 3.1 as a special case, as (17.87) inside Lemma 17.6. It gets past 11/12 through a
different probe, not through a better mean square of the A_u.

### 3.1 The low-side identity [P-rel]

Definition 10.1 gives h = 1 − lx + ℓ and C(s) = s + lx/2 − 1 + h/6 = s − 5/6 + lx/3 + ℓ/6, eq. (10.3). Prop 15.3 gives
the low bound |I| ≪ Z^{lx/2 + b/12} with b = ly − lx ≥ 0. Prop 2.1 needs low ≤ C(σ₀), so

  **σ₀ ≥ σ_low := 1 − h/6 + b/12 = 5/6 + M/12 − ℓ/6**,  M = lx + ly.

The variable b cancels. Checks:
* Part I, M = 1, ℓ = 0: 11/12.
* Part II, M = 5/6, ℓ = 1/6: 7/8. With b = 1/8 this matches (15.9): C(7/8) = 3/16 = lx/2 + b/12.

In σ_low:
* the 1/6 in h/6 comes from the pole of ζ(6z) at z = 1/6 (sixth-power Poisson frequencies);
* the ℓ in h = 1 − l_x + ℓ enters through the slot normalisation A_T(Z) of (20.1);
* the b/12 comes from the sixth-power exceptional frequencies of the additive Gram bound (P_a^{1/6}).

### 3.2 Lemma 15.1's range forces 7/8 [P-rel]

Lemma 15.1 bounds Σ_{q_m≪Q′} |B^J_m(Z)|² ≪ Z^{M′}, where M′ = M − 2d, ℓ′ = ℓ − d and d is the rescaled slot length.
In the branch u ≠ z_a its proof gives the exponent M′ + (2z_a + 1 + ℓ′ − 2M′)/4 ≤ M′ + (1 + 3ℓ − 2M + d)/4. Asking
for zero loss at every d < ℓ, i.e. for every proper subset of slots with a fine mesh, gives

  2M ≥ 1 + 4ℓ.

(Lean: `OAI.SevenEighths.Parameters.compensated_geometry` records M′ = 5/6 − 2d ≥ 1/2.) Then

  σ_low = 5/6 + M/12 − ℓ/6 ≥ 5/6 + (1 + 4ℓ)/24 − ℓ/6 = **7/8**,

for every ℓ, with equality exactly on 2M = 1 + 4ℓ (script `beat78-meansquare-endpoint.py`, Part B). The paper sits at
the corner of this line with the column-branch constraint M + ℓ ≤ 1 (§4.1), namely (ℓ, M) = (1/6, 5/6).

**So the 7/8 is set by the range of one mean square: the marked completed-row norm.**

### 3.3 The high side, reproduced [M]

(10.15) gives E(d) = a − σ₀ + h(z₀ − 1/6) − a·l_y − ℓ/2 + qℓ + d(R + δ/2 − z₀), with z₀ = 17/50, a = (1 + δ)/2 and
q = xδ. At d = h, with R* from Prop 19.2, the model reproduces the paper's second line of (20.4) exactly in rationals.
It verifies the identity (20.9) of Lemma 20.2 on 561 rational points.

The minimum of −E* on [0, 5/6] × [0, 1/2] is **2.282·10⁻⁴**, at δ = 79/204, x = 1/2. The paper certifies
49/440640 = 1.112·10⁻⁴, using J ≤ 5/2. At this point R* = 0.6679, and along M = 1 − ℓ, ∂E/∂ℓ = 1.333. With the
paper's inputs, the geometry optimiser (`beat78-meansquare-scan.py paper`) returns exactly σ₀ = 7/8 at ℓ = 1/6,
M = 5/6. The low side binds there, and the high side has margin 2.1·10⁻⁴.

---

## 4. Where the range of the marked mean square comes from

### 4.1 Lemma 14.3, worst case [P-rel + LP]

Specialise (14.11)–(14.14) to Lemma 15.1's situation (f = 1, ρ = 1, completed length N* = 1 + ℓ′):

  T_d = 2H + 2A₀ + 2z_a − N* − N₀ − 3B₀,  y = v + 3ℓ_b + e_λ ≤ T_d,
  E_ref = O/2 + max(H, v + ℓ_b) − S₀ − B₀ + z_a − u − ℓ_b − 2e_λ/3 − (T_d − y)/2,
  u = min{v, z_a, (v + z_a)/3},

with H ≤ M′ − O and 2A₀ ≤ O. Maximising E_ref − M′ is a union of linear programs, solved in
`beat78-meansquare-lemma143-lp.py`. The worst-case loss is exactly

* row branch: min(ℓ′, (1 + 3ℓ′ − 2M′)/4)₊ ("paper-min-form");
* column branch: M′ + ℓ′ − 1. This is the reflected dual diagonal, the analogue of H²/X, and gives the natural
  range M + ℓ ≤ 1.

The extremal configuration is v = ℓ_b = e_λ = 0, z_a = ℓ′, A₀ = 0, a large powerful row part
O = (2z_a − 1 − ℓ′ + 2M′)/2 and T_d = 0. In words: rows with a large sixth-power-type powerful part, every slot
active, and a reflected dual sum of bounded length. The slot prime sum Σ_P a(P)/√q_P then has no character left to
cancel against.

### 4.2 Large-sieve inputs do not act on the worst case [P-rel + LP]

Replace Heath-Brown's term by an optimal cubic large sieve U + V, i.e. u′ = min{v, z_a}. The LP returns identical
losses at every tested (M′, ℓ′) (script output, first block). The reason is that the extremal configuration has v = 0,
where (UV)^{2/3} ≤ U + V. So Baier–Young-type improvements of the cubic large sieve, or a hypothetical optimal one,
change nothing here.

In Lemma 17.2, the branch u ≠ z_a is where the cubic large sieve's extra terms (V and (UV)^{2/3}) live. Its proof
bounds that branch through u ≥ v/2, and that bound needs the second canonical invariant 4F − 3M − 6z₀ ≥ c. In
Lemma 17.1 this invariant becomes 3m − 2r − 8z > 0, and it is **not binding**: Prop 19.2 records a margin ≥ 9/37.

The binding first invariant F − M − Q − z₀ ≥ c comes from the trivial row-branch bound E_ref ≤ M + z_a in the
terminal step. That is the same configuration as in §4.1: no cancellation in the slot sum, whatever the large sieve.

The sextic large sieve (Lemma 9.1, with the (KD)^{2/3} term) is not used anywhere in Part II (grep: no reference after
line 5150). The quadratic large sieve used in Part II is already optimal.

### 4.3 Slack the paper leaves unused [P-rel]

Prop 15.3, (15.8): a rescaled subset J of length d carries a factor Z^{d−3d/2−d/2} = Z^{−d}. Lemma 15.1 is only needed
in the form Σ|B^J|² ≪ Z^{M′+λ(d)} with λ(d) ≤ 2d. From §4.1, λ(d) ≤ ((1 + 3ℓ − 2M + d)/4)₊ when M + ℓ ≤ 1:
* d = 0 (J = ∅, every slot marked) needs 2M ≥ 1 + 3ℓ;
* d > 0 then holds automatically, since λ(d) ≤ d/4 ≤ 2d.

So **Prop 15.3 holds under 2M ≥ 1 + 3ℓ, M + ℓ ≤ 1, l_y − ℓ ≥ 11b/6 and b ≥ 0**, instead of 2M ≥ 1 + 4ℓ. The
argument uses only Lemma 14.3 as stated, the row-branch reduction of Lemma 15.1 (valid for M + ℓ ≤ 1, since then
T_d ≤ H − 3d − (1 − M − ℓ)), and the tuple count of Prop 15.3.

### 4.4 A refined count of powerful row parts (proof sketch)

Lemma 14.3 sums its fixed-part bound over O(Z^{O/2}) powerful ideals. Write the powerful part as
w = Π p^{e_p} with j_p = e_p mod 6. Primes with j_p ∈ {1, 2, 3, 5} are forced active (e_p ≥ 2). Primes with j_p = 4
are active and lie in exactly one of S₀, N₀, B₀ (e_p ≥ 4). Primes with j_p = 0 have e_p ≥ 6 and are active (in S₀) or
inactive. Put T = S₀ + N₀ + B₀. Then O ≥ 2A₀ + 2T, and

  #{w : N(w) ≍ Z^O with local data (A₀, T)} ≪ Z^{O/6 + 2A₀/3 − T/3 + ε}.

Choosing radicals costs Z^{A_f + A_4 + A_0}; the inactive sixth-power part costs at most a sixth root of its norm.
With this count in place of Z^{O/2}, the LP gives zero row-branch loss iff 2M′ ≥ 1 + 2ℓ′. Together with §4.3, the
range becomes 2M ≥ 1 + 2ℓ. Status: a short counting argument, checked by the LP, not refereed.

### 4.5 Low-side frontier

| Lemma 15.1 range | σ_low on the frontier | corner with M + ℓ ≤ 1 | best σ_low |
|---|---|---|---|
| 2M ≥ 1 + 4ℓ (paper) | 7/8 (constant) | (1/6, 5/6) | **7/8** |
| 2M ≥ 1 + 3ℓ (§4.3) | 7/8 − ℓ/24 | (1/5, 4/5) | **13/15 = 0.86667** |
| 2M ≥ 1 + 2ℓ (§4.4) | 7/8 − ℓ/12 | (1/4, 3/4) | **41/48 = 0.85417** |

For M′ < (1 + ℓ′)/2 Lemma 14.3 retains no dual dyad. The LP then reports no loss, but the high side fails in that
region. These are low-side bounds only. §5 shows the high side binds first.

---

## 5. The high side: do better mean squares help?

### 5.1 Model [M]

`beat78-meansquare-scan.py` minimises max(σ_low, σ_high) over the geometry (ℓ, M, b), with l_x = (M − b)/2,
l_y = (M + b)/2 and h = 1 − l_x + ℓ.

Inputs:
* witness lengths from Prop 8.3: r ∈ [t − 1/2, t], m = t − r ≤ 1/2, t ∈ [1, 3/2];
* counts:
  * 1 − δr − 2xδ·min(z_M(r), ℓ/h) (Lemma 17.1);
  * e(r) − δr (Lemma 17.6);
  * 1 − 2δm − 2xδ·min(z_P(m), ℓ/h) (Lemma 18.1);
* the paper's floor bin (δ₀ = 1/50, R = 1), the d = 1/2 range (R = 1 − 2δ/3), and small rows;
* κ = 3/4 fixed. This is valid given the 7/8 theorem, and Lemma 18.1 is stated only for κ ≥ 3/4.

Validation: R* agrees with the paper's closed form to 10⁻¹¹, and the paper's geometry returns σ_low = 7/8,
σ_high = 0.874772.

### 5.2 Scenarios (δ ≤ 3/4; values rounded to 10⁻⁶; grid-plus-zoom optimum)

| scenario | inputs changed | best σ₀ | ℓ, M, b at optimum |
|---|---|---|---|
| paper | none | **0.875000** | 1/6, 5/6, 0.131 |
| slack | Lemma 15.1 → 2M ≥ 1 + 3ℓ | 0.874966 | 0.16678, 0.83314, 0.131 |
| refined | → 2M ≥ 1 + 2ℓ | 0.874966 | same (high side binds) |
| nat_inv | + Lemma 17.1 natural range r + z < 1 | 0.873162 | 0.174, 0.826, 0.048 |
| nat_plain | + Lemma 18.1 capacity z ≤ 1 − 2m | 0.873784 | 0.170, 0.825, 0.078 |
| nat_both | both capacities | 0.873071 | 0.174, 0.826, 0.052 |
| alpha_half | amplification slope α = 1/2 (needs a sub-natural-range mean square, §2.5) | 0.872673 | 0.176, 0.824, 0.059 |
| all | capacities + α = 1/2 | 0.871715 | 0.180, 0.820, 0.059 (floor bin binds) |
| all_floor | + floor 1/2 + 1/1000, slots at d ≤ 1/2 | 0.870142 | 0.186, 0.814, 0 |
| DH | density-hypothesis counts R = 1 − δ, floor 1/2 + 1/1000 | 0.866989 | 0.1987, 0.8013, 0 |
| DH, floor → 1/2 | δ₀ = 10⁻⁵ | 0.866669 → **13/15** | → 1/5, 4/5, 0 |

### 5.3 The ceiling 13/15 [P-rel algebra; M check]

For δ → 0 every count is R → 1 (all rows lie in the lowest bin; the density hypothesis also gives 1 − δ → 1). (10.15)
at d = h, δ = 0 then gives

  σ₀ > σ_triv := 4/3 − 5l_x/6 − l_y/2 + ℓ/3  (= 4/3 − 2M/3 + ℓ/3 at b = 0; b > 0 only raises it).

This does not depend on any moment input. Combine it with σ_low = 5/6 + M/12 − ℓ/6 and the column-branch range
M + ℓ ≤ 1. Equality σ_low = σ_triv gives M = (2 + 2ℓ)/3, so σ = 8/9 − ℓ/9, and M + ℓ ≤ 1 gives ℓ ≤ 1/5. Hence

  **σ₀ ≥ 13/15**, attained only at (ℓ, M, b) = (1/5, 4/5, 0).

There, E(h) < 0 requires R < 1 − 7δ/8 − xδ/4, which is exactly the density hypothesis at x = 1/2. So 13/15 needs
density-hypothesis counts in the whole intermediate range. The paper's counts are far from that: R* = 0.668 against
1 − δ = 0.613 at δ = 0.387.

The same algebra with ℓ = 0 gives 8/9 as the ceiling of the Part I probe. Part I uses M = 1 and stops at 11/12,
because its counts (sextic large sieve with the 2/3 term) are weak.

### 5.4 What each input would have to become

* Lemma 17.1: marks cost 2z because the terminal step of Lemma 17.2 bounds the row branch trivially by M + z_a (first
  canonical invariant). A kernel-saving bound of the Lemma 15.1 type would relax this in the terminal step. Whether
  the two-Poisson recursion preserves a relaxed invariant is not checked. Even the full natural range gives only
  0.8732.
* Lemma 18.1: the 6κ comes from the transformed rows whose inducing characters lie in Θ (sixth-power counting) and
  from the zero-free feedback κ = 2β* − 1. It is structural, not a large-sieve loss.
* Lemma 17.6: the slope 5/6 is the sextic density. Lowering it needs a sub-natural-range mean square (§2.5).

---

## 6. Height restriction to T ≥ 3·10¹²

Both arguments prove a contradiction from the family-wide supremum β* over all finite-order Hecke characters of
Q(√−3).
* In the 11/12 proof, the family {A_u} is the whole sextic twist family.
* In the 7/8 proof, Poisson rows bring in twists ηχ_•(u), and the detector (Prop 8.3) uses zeros of these twists in
  rectangles of height up to T₁ = Z^τ, at all heights.

RH verified for ζ up to 3·10¹² says nothing about the twists. So a height-dependent θ(T) does not come out of either
architecture.

---

## 7. Conclusions

1. **11/12 architecture.** The exponent 11/12 = 1 − (1/2)(1/6) is exact. Prop 3.1 is optimal in its range (H ≥ D).
   Its only possible extension, below H = D, carries the zero-free statement itself. No large sieve, longer range or
   hybrid bound helps.
2. **7/8 architecture.** 7/8 = 5/6 + 1/24 is exactly the range limit of the marked completed-row mean square
   (Lemma 15.1): σ_low = 5/6 + M/12 − ℓ/6 with 2M ≥ 1 + 4ℓ. A sharper cubic large sieve does not change that range,
   and the sextic large sieve is not used in Part II. The range can be relaxed with the paper's own unused slack, to
   2M ≥ 1 + 3ℓ, or 1 + 2ℓ with a refined count. The row counts then bind. The paper's counts allow 0.874966. Natural-range
   moment estimates allow about 0.873. Density-hypothesis counts allow 13/15, which is the ceiling of the architecture.
3. Precise obstruction for this angle. Any improvement below 13/15 needs a new probe or a treatment of the row sum
   with cancellation between rows, i.e. not by absolute values: the trivial count at δ → 0 is the binding term.
   Getting below 7/8 at all needs both of:
   * (a) the relaxed Lemma 15.1. This is rigorous relative to Lemma 14.3, but the slack gain alone is 3.4·10⁻⁵;
   * (b) row counts strictly better than Prop 19.2 at δ ≈ 0.39 and amplitude x = 1/2. No known large-sieve or
     mean-square input provides that.

Next step, if pursued: in the 7/8 paper, write the kernel-saving version of the terminal step of Lemma 17.2 and check
whether the two-Poisson recursion preserves the relaxed first invariant (F − M − z₀/2 type). If it does, Lemma 17.1's
inverse capacity improves toward 1 − r, and the model predicts σ₀ ≈ 0.8732. That would be a real but small gain:
q₀ = 0.5570 instead of 0.5625.

---

## 8. Reproduction

All in `tmp/`, run with `.venv-arb/bin/python`. Each run takes under 2 minutes single-threaded.

* `beat78-meansquare-amplify.py`: §2.2 and §2.5, exact rationals.
* `beat78-meansquare-endpoint.py`: Part A reproduces Lemma 20.2 of the 7/8 paper; it verifies identity (20.9) and
  min −E* = 2.2822·10⁻⁴. Part B gives the low-side identity and frontier (§3.2, §4.5).
* `beat78-meansquare-lemma143-lp.py`: worst case of Lemma 14.3 under Heath-Brown versus an optimal cubic large sieve,
  and paper versus refined powerful count (§4).
* `beat78-meansquare-scan.py <scenario>`: geometry optimiser of §5. Scenarios: paper, paper_slack, refined, nat_inv,
  nat_plain, nat_both, alpha_half, all, all_floor, DH, DH_refined. Logs are in `beat78-meansquare-scan.log` and
  `beat78-meansquare-scan2.log`.
