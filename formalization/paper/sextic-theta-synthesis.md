# Sextic theta coefficients and the P_a^{1/6} term of Prop 15.2: synthesis

Internal working note, 2026-11-03. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the
machine. Data module: `src/data/sextic-theta-campaign-2026-11-03.js`.

**Verdict.** No θ < 7/8 is proved. The zero-independent inputs around the P_a^{1/6} term are now theorems (Theorem A),
and removing that term is shown to be the improved low bound for the probe itself (Theorem D). Two referees: neither
refuted anything; their corrections are applied. Raymond-chain values at conditional θ are recorded in §4 as conditional
values, not bounds. PT Λ ≤ 0.2 stands. RH is open. NO QED.

Stage notes: `sextic-theta-computation.md`, `sextic-theta-literature.md`, `sextic-theta-conjecture.md`,
`sextic-theta-proof.md` (§11 is the referee reconciliation).

Labels: PROVED / PROVED-rel X / CITED / COMPUTED (exact or numerical) / HEURISTIC / CONJECTURE / SKETCH.

---

## 1. The question

The exceptional term of Prop 15.2 of the 7/8 manuscript comes from the coset e₀t⁶a⁶, where e₀ is an S-unit and generally
not a sixth power. A sextic-residue filter multiplies it by one constant A(e₀), so the term can be evaluated but not
filtered out. In the cubic case, Patterson's evaluation of cubic theta coefficients at squarefree indices (used through
Heath-Brown–Patterson) is part of how the 7/8 proof works. The question was whether a sextic analogue, or an evaluation
of the needed mean of sextic theta coefficients, removes the P_a^{1/6} loss. Models in the brief: a 10% reduction gives
θ ≈ 0.87393, full removal gives θ ≈ 0.8635.

## 2. What is known

**COMPUTED** (`sextic-theta-computation.md`, `tmp/sextic/`):
* Exact sextic, cubic and quadratic symbols over Z[ω], and the γ₁, γ₂, γ₃ of the manuscript, at 664,616 primary primes
  and 2,822,619 squarefree moduli coprime to 6 with norm ≤ 10⁷. All §4.2 identities hold to ≤ 10⁻⁸ (with the bar in
  (4.7) restored).
* The cubic calibration works. Patterson's evaluation is reproduced with no free parameter (rms 0.5%), and the
  first-moment exponent is 0.8330 [0.829, 0.837] against the theoretical 5/6.
* Sextic first moments have exponent 0.683 [0.669, 0.697], consistent with 2/3. There is no Gauss-sum law at prime
  indices (alignment 0.50 against a 99% null of 0.37), and no twisted multiplicativity.
* The mean square that Prop 15.2 needs, M(Q) = Σ_{N(m)≤Q}|ρ_σ(−e₀m)|², has slope 0.868 [0.834, 0.899] for Q ≤ 796. It
  is dense and close to 5/6. The odd part carries 85.7% of it, and that share is rising.

**CITED** (`sextic-theta-literature.md`):
* Bröker–Hoffstein 2016 (via Eckhardt–Patterson) give continuation and an explicit functional equation.
* Kazhdan–Patterson: there is no Whittaker uniqueness for GL₂^{(6)}, so no Patterson-type evaluation at squarefree
  indices is expected.
* Chinta–Friedberg–Hoffstein reach only the even (square-index) part.
* Nothing in the literature evaluates or bounds the needed correlation.

## 3. Conjecture, proof attempt, referees

**CONJECTURE TRO6^♮(η)** (`sextic-theta-proof.md` §2). Power saving Z^{−ηb/12} over Cauchy–Schwarz for the theta–row
form Σ_m ρ^♮_σ(−e₀m)B^J_{m,σ}(Z), where ρ^♮ is the *complete* sextic theta coefficient (all moduli prime to S, including
nonsquarefree moduli and moduli sharing primes with the row). It is open for every η > 0.

Evidence (all HEURISTIC):
* the toy TRO with α-twisted cubic rows sits at noise level (r = 0.043 against a 99% null of 0.060, p = 0.73);
* the needed mean square is dense.

Caveat: the evidence is at small Q and was computed on the stripped coefficient ρ_σ. Transfer to ρ^♮ is expected up to
N^ε factors.

**PROVED** (relative to the cited sources and the unrefereed manuscript; both referees confirm):

| result | content | status |
|---|---|---|
| Theorem A (MV) | mean value of the complete class-σ sextic Kubota series on Re u = 1/2+ε over the rows −e₀m | PROVED-rel BH16 Thm 2.4, (3.1), (3.10); manuscript Lemmas 4.4, 9.1 |
| Theorem A (Id) | Σ\|A − A^θ\|² ≪ (Q/Y′)Z^ε for ρ^♮, with no exceptional term and no P_a²/Y′ term | PROVED-rel (MV) |
| Theorem A (MS) | M^♮_σ(Q) ≪ Q^{5/6+ε} | PROVED-rel (Id) + Lemma 6.2 |
| Cor A.8 | Prop 15.2 without its P_a²/Y′ term, for all Q, Y′ (that condition is not binding at the paper geometry) | PROVED-rel |
| Lemmas A.0–A.4 | Gauss sums at gcd moduli; large sieves; finite inversion over S′; approximate functional equation | PROVED / PROVED-rel; exact checks with 0 failures (note: 116 cases; referee 1: >2900; referee 2: >20000) |
| Lemma B | TRO6 is needed only for tuples with \|J\| < ηK/16 | PROVED-rel Prop 15.3, (15.8) |
| Theorem C | TRO6^♮(η) ⟹ low bound Z^{3/16−η/96}; with (H_{σ₀}), the zero-free half-plane Re s > max(7/8 − η/96, 7/8 − m_hi) | PROVED-rel; (H_{σ₀}) unproved below 7/8 |
| Theorem D(i), (ii) | probe = aggregated theta–row form + O(Z^{17/96+ε}); aggregated TRO6^♮ ⟺ improved low bound | PROVED-rel |
| Theorem D(iii) | in the window, ⟺ the improved zero-free half-plane | (a) PROVED-rel + (H_{σ₀}); (b) SKETCH |

**Killed or downgraded by the referees** (refuted = false for both; severity low / minor; `sextic-theta-proof.md` §11):
1. "(Id) fails for ρ_σ" was a conclusion. It is now HEURISTIC: it rests on heuristic sizes and on M^♮ ≫ Q^{5/6}.
2. The §3.9(a) size estimate compared the wrong exponents (2 vs 0). The correct comparison is 3 vs 1, which gives a share
   of 0.4–0.8% rather than 0.3%. Both referees found this.
3. The claim that the S′ correction is "of order one" is withdrawn. Its relative size is N(p)^{−2/3}|ρ(yp⁴)/ρ(y)|, with a
   measured ratio of about 0.07.
4. "Bounded" and "triangular" are withdrawn. The coefficient mass is ≪ N(y)^ε, and exponents 1 and 3 couple in both
   directions.
5. The §7.2 claim "arithmetic of ρ^♮ = Poisson in m = high side" was labelled CITED. It is now HEURISTIC.
6. Two conditions were added:
   * "TRO6 requires new zero-free input" needs (H_{σ₀});
   * "none of the named tools can supply it" is an assessment, not a theorem.
7. The claim that BH16 Algorithm 4.1 computes the complete coefficient is withdrawn as an over-read.
8. Theorem A's inputs gain manuscript Lemma 4.4 and a ray-group condition (2-adic level ≤ 4, exponent 6). The M^♮ lower
   bound was understated: it is PROVED-rel at main-term level.

What survived: the identification of ρ^♮ as the coefficient the rows see. Referee 2 confirmed it against manuscript §6.1
("This includes nonsquarefree s").

## 4. θ and Λ

**θ.** No rigorous improvement survived, so nothing propagates. θ = 7/8, which itself comes from the unrefereed manuscript
(Lean-checked by its authors). The fixed-geometry bookkeeping (EXACT, conjecture note §5.2) is as follows. TRO6^♮(η) with
(H_{σ₀}) gives σ₀ = 7/8 − η/96, capped by the high side at:
* 7/8 − m_hi = 0.8747719, with m_hi = 35√16354/12696 − 1491/4232 = 2.2815·10⁻⁴, reached at η* = 0.0219;
* 0.8748888 with the certified margin;
* 0.8747704 if Lemma 18.1 is extended below κ = 3/4.

Correction: the earlier "≈ 2.9·10⁻⁴" cap is 2.28·10⁻⁴. Values below 0.87477 need a new geometry with Part II re-proved
(HEURISTIC model).

**Λ, conditional** (`tmp/oai-lambda-raymond.py X1 --alt`, PT height, q0 = (2θ − 1)² + 2·10⁻⁶; runs and logs in
`tmp/sextic/lambda/`). The kernel inputs are vendored at `~/lean-deps/raymond_pr` (same sha1 as
`formalization/lean/qrh-lambda/inputs/KERNELS.json`); a `/tmp/raymond_pr` symlink was made for the hard-coded path. In
every run the two endpoints agree.

| θ | status | U (Raymond, X1) | ΔU vs 7/8 |
|---|---|---|---|
| 7/8 | baseline: unrefereed 7/8 manuscript; reproduces parent value | 0.118505710922701 | 0 |
| 0.8748888 | CONDITIONAL: TRO6^♮(0.0107) + (H_{σ₀}) + manuscript, certified margin | 0.118474196948564 | −3.15·10⁻⁵ |
| 0.8747719 | CONDITIONAL: TRO6^♮(0.0219) + (H_{σ₀}) + manuscript, fixed-geometry cap | 0.118441060927681 | −6.46·10⁻⁵ |
| 0.8747704 | CONDITIONAL + Lemma 18.1 extended (unproved) | 0.118440636527869 | −6.51·10⁻⁵ |
| 0.874766 | MODEL: η = 0.0219, re-optimised geometry | 0.118439387709101 | −6.63·10⁻⁵ |
| 0.873944 | MODEL: η = 0.1, re-optimised geometry | 0.118206089186636 | −3.00·10⁻⁴ |
| 0.864094 | MODEL: η = 1 (full removal), re-optimised geometry | 0.115369082069973 | −3.14·10⁻³ |

The slope is 0.28–0.29 of Λ per unit of θ, consistent with the price of 0.003 per 0.01. Every row is a conditional value
of the Raymond chain (which is itself unrefereed). None of them is a Newman-Λ bound. The best route-P value at 7/8 stays
0.116091 (conditional).

## 5. Obstruction and next step

**Obstruction.** With Theorem A, nothing unproved stands on the low side between the probe and the complete sextic theta
coefficients: I_mod(Z) = Θ(Z) + O(Z^{17/96+ε}) (Theorem D(i)). The P_a^{1/6} loss is exactly the Cauchy–Schwarz norm of
the theta–row form. Removing a power of it is the improved low bound. Given (H_{σ₀}), in the window that is the improved
zero-free half-plane.

So an evaluation of ρ^♮ evaluates the probe, whose Mellin transform has poles at the target's zeros (SKETCH). That holds
for a 6-fold Patterson identity, a CFH identity, a Voronoi formula or a mean value alike. Such an evaluation does not on
its own remove the loss. The numerics also give no sign of a sextic Patterson law at prime indices.

**Next step.**
* Close the Prop 15.2 evaluation / subtraction / filter lever.
* What remains is (a) new zero information for the family, which would be a quasi-Riemann improvement in its own right,
  or (b) a probe in which the exceptional coset and the principal signal separate. The 2026-11-01 campaign found no such
  probe.
* Bookkeeping: state TRO6 with ρ^♮ wherever it is quoted, and correct the 2.9·10⁻⁴ cap to 2.28·10⁻⁴ in older modules.

PT Λ ≤ 0.2 stands. RH is open. NO QED.
