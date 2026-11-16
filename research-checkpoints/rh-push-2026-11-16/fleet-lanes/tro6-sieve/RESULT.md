# tro6-sieve: TRO6^♮ by arithmetic / large-sieve methods

Campaign 2026-11-16, slug `tro6-sieve`. Internal note; nothing committed or pushed. Files: this note,
`tro6_rows.py`, `tro6_analyse.py`, `tro6_rows.{log,npz}`, `tro6_analyse.{log,json}` (all in this directory).

Labels: PROVED / PROVED-rel X (proved relative to the named inputs, taken as stated) / CLASSICAL / CITED /
MEASURED / HEURISTIC / OPEN.

**Verdict.** TRO6^♮(η) is not proved for any η > 0. The zero-free abscissa stays 7/8 (itself from the unrefereed
manuscript). What is established here:

1. **Lemma R (re-expansion, PROVED-rel Theorem A of `sextic-theta-proof.md`).** The theta–row form equals the
   trilinear low-side form at *any* s-length X, up to a remainder Q^{1/2}X^{−1/6}‖B‖. Consequence: TRO6^♮(η) at the
   paper geometry is equivalent to the *diagonal-quality* bound (no power saving) for the trilinear form with lengths
   (m, s, A) = (Z^{5/6}, Z^{5/12+η/16}, Z^{7/6}), i.e. s longer than the balanced length Q^{1/2} by Z^{ηb/2}.
2. **Proposition S (short rows, PROVED-rel Theorem A).** For *arbitrary* coefficients β and rows
   B_m = Σ_{N(A)≤D} β_A χ_A(m): |𝔅| ≪ Q^{1/3+δ}D^{1/6}‖B‖. This is a power saving over Cauchy–Schwarz exactly when
   D < Q^{1/2}. The manuscript rows have D = Z^{7/6} = Q^{7/5} (after cubic reflection: Z^{1/2} = Q^{3/5}), so the
   proposition does not reach them. The gap is the factor Z^{3/4} (direct) or Z^{1/12} (reflected, heuristic).
3. **Proposition L (large sieves cannot cover the range, PROVED-rel).** Of the three ways to group the trilinear
   form, two are operator-norm bounds whose sharp value is already Cauchy–Schwarz (extremal vectors: the Gauss-sum
   column, which is the sextic analogue of the Dunn–Radziwiłł extremal vector, and the row vector itself); the third
   is Poisson in m, which is the manuscript's high side. In the Gram exponent Σ|A_m|² ≪ (Q/Y′)(1 + P_a^{e}):
   Blomer–Goldmakher–Louvel / Heath-Brown give e = 1/3, Prop 15.2 gives e = 1/6 (sharp), TRO6^♮(η) needs effective
   e = (1−η)/6 *in the pairing with B only*, and no inequality valid for all coefficient vectors can give e < 1/6.
4. **Numerics (MEASURED).** Rows prime to 6 extended from N(m) ≤ 796 to N(m) ≤ 4000 (7236 rows). See §5.

No QED. PT Λ ≤ 0.2 stands. RH open.

---

## 0. Plan: what is new relative to the atlas and the walls

* Atlas §10 and `sextic-theta-{conjecture,proof,synthesis}.md` close the evaluation / subtraction / filter lever and
  show (Theorem D) that aggregated TRO6^♮ is the improved low bound, hence (given (H_{σ₀})) the improved zero-free
  half-plane. Proof-note §7.2 records that a large sieve applied in the (m | A) direction cannot beat
  Cauchy–Schwarz. Not done there: (i) the exact lengths of the trilinear form that a *bilinear* proof must handle;
  (ii) the (m | s) direction and the comparison with the known exponents; (iii) any range in which TRO6-type
  cancellation is actually proved; (iv) numerics beyond N(m) ≤ 796.
* Walls. DH: every proved statement below holds for arbitrary coefficients β (no Euler product), so it cannot and
  does not give zero information; §6 says where the Euler product would have to enter. MV-CAP: Prop S is a bilinear
  statement with one smooth variable, not a mean value; it is exactly the range where Poisson has no dual terms.
  Flow-blindness and verified height: not relevant (no heat-flow or finite-height input is used).

## 1. Setting (from `sextic-theta-proof.md` §1–2)

F = Q(√−3), rows m ∈ O with q_m = N(m) ≪ Q ≍ Z^{M′}; paper geometry b = 1/8, ℓ = 1/6, M = 5/6, l_x = 17/48,
l_y = 23/48, h = 13/16. For an unrescaled tuple (d = 0): Q = Z^{5/6}, Y′ = Z^{23/48}, P_a = Y′²/Q = Z^{1/8}.
Row weight w_m(v) := Ω(q_m/Q) ξ(m) (q_m/Q)^{−iv}, with ξ a character mod b* (b* the squarefree product of the primes
of S), nonprincipal at each prime factor (manuscript §6.1). Additive factor at s-length X and height v:

  A_m(X; v) := (κ_σ/τ)·X^{−1} Σ_{s∈σ} W₁(N(s)/X)(N(s)/X)^{−1/2+iv} g̃(−e₀m, s),   g̃(y, s) = N(s)^{−1/2}Σ_{d mod s}χ_s(d)e(yd/s).

Theta–row form: 𝔅 = 𝔅_{σ,v}(B) := Σ_{m≠0} w_m(v) ρ^♮_σ(−e₀m) B_m, for any row vector B supported on q_m ≤ CQ.
‖B‖² := Σ_{q_m≤CQ}|B_m|². TRO6^♮(η): |𝔅| ≪ (1+|v|)^{J₀} Z^{−ηb/12+ε} M^♮_σ(cQ)^{1/2}‖B‖ for the manuscript rows B = B^J.

Inputs used (all from Theorem A of the proof note, PROVED-rel BH16 Thm 2.4, (3.1), (3.10) and manuscript Lemmas 4.4,
6.2, 9.1; valid for all Q, X ≥ 1):

* (Id) Σ_{0<q_m≤CQ} |A_m(X; v) − (2κ_σ/3τ)Ŵ₁(1/6+iv)X^{−1/3}ρ^♮_σ(−e₀m)|² ≪ (1+|v|)^{B₀}(Q/X)(QX)^{O(ε)}.
* (MS) M^♮_σ(Q) ≪ Q^{5/6+O(ε)}; lower bound M^♮_σ(Q) ≫ Q^{5/6} (proof note §11 item 8: PROVED-rel at main-term
  level; subtract-note Prop 2.3).

Row shape (manuscript §6.1, §15.1, CITED): B^J_{m,σ}(Z) = Σ_A β_A χ_A(m) over completed indices A = cn³ (c squarefree,
prime to S), β_A = γ₂(c)α(A)ν_σθ(A)G(A)q_c^{−1/2}q_n^{−1}·V(q_A/Z^{1+ℓ′})·(slot data), V a log-Gaussian. So the row is
a sextic-character sum in m of A-length D_raw = Z^{1+ℓ′} (= Z^{7/6} at d = 0). Lemma 15.1 (cubic reflection + quadratic
large sieve) gives ‖B^J‖² ≪ Z^{M′+ε} = Q^{1+ε}; its reflected dual length is T_d = 2M′ − 1 − ℓ′ (= 1/2 at d = 0).

## 2. Lemma R: re-expansion at an arbitrary s-length

**Lemma R [PROVED-rel (Id)].** Let c₀ := 3τ/(2κ_σŴ₁(1/6)) (W₁ ≥ 0 is nonzero, so Ŵ₁(1/6) > 0). For every X ≥ 1, every
v and every row vector B supported on q_m ≤ CQ,

  𝔅_{σ,v}(B) = c₀X^{1/3}·T_X(B) + O((QX)^{O(ε)} Q^{1/2}X^{−1/6}‖B‖),   T_X(B) := Σ_m w_m(v) A_m(X; 0) B_m.

*Proof.* (Id) at height 0 gives ρ^♮_σ(−e₀m) = c₀X^{1/3}A_m(X; 0) + E_m with Σ_{q_m≤CQ}|E_m|² ≪ X^{2/3}(Q/X)(QX)^{O(ε)}.
Multiply by w_mB_m (|w_m| ≤ ‖Ω‖_∞), sum, and apply Cauchy–Schwarz to the E-part. ∎

**Corollary R1 [PROVED-rel (Id), (MS)].** Put X_η := Q^{1/2}Z^{ηb/2}. Then, up to Z^{O(ε)},

  TRO6^♮(η) for the vector B  ⟺  |T_{X_η}(B)| ≪ (Q/X_η)^{1/2}‖B‖.

*Proof.* (⇐) |𝔅| ≪ X^{1/3}(Q/X)^{1/2}‖B‖ + Q^{1/2}X^{−1/6}‖B‖ = 2Q^{1/2}X^{−1/6}‖B‖ = 2Q^{5/12}Z^{−ηb/12}‖B‖, and
M^♮ ≍ Q^{5/6}. (⇒) |T_X| ≪ X^{−1/3}(|𝔅| + Q^{1/2}X^{−1/6}‖B‖) ≪ X^{−1/3}Q^{5/12}Z^{−ηb/12}‖B‖ = (Q/X)^{1/2}‖B‖ at
X = X_η. ∎

Reading.
* (Q/X)^{1/2}‖B‖ is the *diagonal* size of T_X (Σ_m|A_m(X)|² ≍ (Q/X)(1 + (X²/Q)^{1/6}), manuscript Prop 15.2 / Cor A.8).
  So TRO6^♮(η) asks for no power saving at all; it asks that the diagonal bound for the trilinear form persist when
  the s-length exceeds the balanced length Q^{1/2} by the factor Z^{ηb/2}. Cauchy–Schwarz loses (X²/Q)^{1/12} =
  Z^{ηb/12} there.
* At X = Q^{1/2} the Lemma reproduces Cauchy–Schwarz (η = 0) without using (MS).
* Self-similarity: TRO6^♮(η) at geometry b is the exceptional-free low bound at geometry b′ = ηb (same Q, same rows).
  This is the reason b cancels in σ_low at η = 0 (conjecture note B1).

**The exact range.** With d = 0 and the paper geometry, a bilinear proof of TRO6^♮(η) must bound

  T_X = X^{−1}Σ_m Σ_s Σ_A w_m · W₁(N(s)/X)(N(s)/X)^{−1/2} g̃(−e₀m, s) · β_A χ_A(m)

at the diagonal level with

| variable | length | in terms of Q | structure |
|---|---|---|---|
| m | Z^{5/6} | Q | smooth weight × ξ(m) |
| s | Z^{5/12 + ηb/2} = Z^{5/12+η/16} | Q^{1/2 + 3η/40} | sextic Gauss sum γ₁(s), ray class σ |
| A = cn³ | Z^{7/6} (reflected dual: Z^{1/2}) | Q^{7/5} (Q^{3/5}) | cubic Gauss sum γ₂(c) × target ϑ(A) × slot primes |

For the whole fixed-geometry prize η* = 0.0219: s-length Q^{1/2}·Z^{0.00137}. The modulus of the m-sum is
N(b*sA) ≍ Z^{19/12+η/16}, so Poisson in m has dual length Z^{3/4+η/16} (the manuscript's Y′ gives Z^{h} = Z^{13/16};
the two agree at η = 1).

## 3. Proposition S: TRO6-type cancellation is true for short rows, for every coefficient vector

**Proposition S [PROVED-rel (Id)].** Fix δ > 0. Let D ≥ 1 and let β be any complex coefficients on primary A prime to
S with N(A) ≤ D (A need not be squarefree; χ_A = Πχ_p^{v_p(A)} with zero extension). Put B_m := Σ_A β_Aχ_A(m). If
D ≤ Q^{1−2δ}, then for every v and every K > 0,

  |𝔅_{σ,v}(B)| ≪_{δ,ε,K} (1+|v|)^{B₁} ( Q^{1/3+δ/6+ε} D^{1/6} ‖B‖ + Q^{−K}‖β‖₁ ).

Relative to the Cauchy–Schwarz bound Q^{5/12}‖B‖ this is the factor (D²/Q)^{1/12}Q^{δ/6}: a power saving for
D ≤ Q^{1/2−3δ}. It gives Z^{−ηb/12} as soon as D ≤ Q^{1/2}Z^{−ηb/2−o(1)}.

*Proof.*
1. Take X := Q^{1−δ}/(C₁N(b*)D) with C₁ the upper end of supp W₁; X ≥ Q^{δ}/(C₁N(b*)) ≥ 1 for large Q. Lemma R:
   𝔅 = c₀X^{1/3}T_X(B) + O(Q^{1/2+ε}X^{−1/6}‖B‖), and Q^{1/2}X^{−1/6} ≪ Q^{1/3+δ/6}D^{1/6}.
2. T_X(B) = (κ_σ/τ)X^{−1}Σ_{s∈σ}W₁(N(s)/X)(N(s)/X)^{−1/2}Σ_Aβ_A·U(s, A), with
   U(s, A) := Σ_m F(m)ξ(m)χ_A(m)g̃(−e₀m, s), F(m) := Ω(N(m)/Q)(N(m)/Q)^{−iv}.
3. Periodicity. Open g̃: U = N(s)^{−1/2}Σ_{d mod s}χ_s(d)Σ_m F(m)ξ(m)χ_A(m)e(−e₀md/s). The function m ↦ e(−e₀md/s) has
   period s: e(z) = exp(2πi Tr(z/λ)), and for n ∈ O, e₀nd/λ ∈ O because λ | e₀ (e₀ = u₀(−2)^{2t−1}λ⁵), so its trace
   is an integer. ξ has period b*, χ_A has period A. Put L := b*·A·s.
4. Poisson. Σ_m F(m)f(m) for f of period L equals Σ_{r mod L}f(r)Σ_{n∈O}F(r + Ln). F is smooth on C, supported on
   |m| ≍ Q^{1/2}, with ∂^jF ≪_j (1+|v|)^jQ^{−j/2}. Poisson summation on the lattice LO gives
   Σ_nF(r + Ln) = (c_F/N(L))∫F + Σ_{k≠0}(…), and each nonzero frequency k/L̄ has |k/L| ≥ c/N(L)^{1/2} ≥ cQ^{−1/2+δ/2},
   since N(L) ≤ N(b*)·D·C₁X = Q^{1−δ}. Repeated integration by parts bounds the nonzero-frequency part by
   O_K((1+|v|)^{K′}Q^{−K}) for every K, uniformly in r.
5. The zero frequency vanishes. Its coefficient is (∫F)·N(L)^{−1}Σ_{r mod L}ξ(r)χ_A(r)e(−e₀rd/s). b* is supported on S
   and As is prime to S, so by the Chinese remainder theorem r ↔ (r₁ mod b*, r₂ mod As), ξ depends on r₁ only and
   χ_A(r)e(−e₀rd/s) on r₂ only. The sum factors and Σ_{r₁ mod b*}ξ(r₁) = 0 (ξ is nonprincipal). This is the
   manuscript's own device ("the finite transform should exclude frequencies meeting S, including zero", §6.1).
6. So |U(s, A)| ≪ N(s)^{1/2}·N(L)·(1+|v|)^{K′}Q^{−K}, and T_X(B) ≪ (1+|v|)^{K′}Q^{−K+3}‖β‖₁. Rename K. ∎

Remarks.
* The proof never uses any property of β. It holds for Davenport–Heilbronn-type coefficients as well.
* It is sharp in the following sense [PROVED-rel (Id), (MS) lower bound]: for D ≥ Q^{1/2+δ} it fails for some β.
  Take β_A = conj(coefficient of A_m(D; 0)) (the Gauss-sum column of length D); then B_m ∝ conj(A_m(D;0))·D and
  𝔅 ≍ D^{2/3}M^♮(Q) up to the w-weight, which is the Cauchy–Schwarz size. (With the ξ-twisted weight w_m the same
  example needs β to carry ξ̄; stated here without the twist, HEURISTIC for the twisted form.)
* Where the manuscript rows sit: D_raw = Z^{1+ℓ′} ≥ Z > Q for every tuple, so Prop S never applies directly, and the
  part of B^J with q_A ≤ Q^{1/2} is negligible (log-Gaussian V). After the cubic reflection of Prop 5.1 the dual
  length is Z^{2M′−1−ℓ′} = Z^{1/2} = Q^{3/5} at d = 0; this is below Q^{1/2} only for M < 4/5, while Lemma 15.1 needs
  2M ≥ 1 + 4ℓ, i.e. M ≥ 5/6 on M + ℓ = 1. Also the reflected row is not of the form Σβ_Aχ_A(m) with β independent of
  m (the dual terms of (5.1) carry local factors at the primes of m). So no geometry of the present architecture is
  inside Prop S. [exponent count PROVED from the stated formulas; "reflected rows are not short rows" HEURISTIC]

**Missing exponent, stated exactly.** Prop S covers X·D ≤ Q^{1−δ}. TRO6^♮(η) needs X = Q^{1/2}Z^{ηb/2} and D = Z^{1+ℓ′}:
X·D/Q = Z^{1+ℓ′−M′/2+ηb/2} = Z^{3/4+η/16} at d = 0. This is exactly the dual length of Poisson in m. A proof along
these lines therefore has to control Z^{3/4+η/16} dual frequencies; none is available for free. Equivalently, the
row length would have to drop from Q^{7/5} to Q^{1/2}: a factor Q^{9/10} = Z^{3/4}.

## 4. Proposition L: what the large sieves give in this range

The trilinear form T_X has three two-against-one groupings.

**(s | m, A): Cauchy–Schwarz over s, large sieve in (s, m).** Write a_s := W₁(N(s)/X)(N(s)/X)^{−1/2} (so ‖a‖² ≍ X),
c_m := w_mB_m, and 𝒢 := (g̃(−e₀m, s))_{q_m≤CQ; s∈σ, N(s)≤C₁X}. Then T_X = (κ_σ/τ)X^{−1}⟨a, 𝒢ᵀc⟩ and
|T_X| ≤ X^{−1}‖a‖·‖𝒢‖·‖c‖ ≪ X^{−1/2}‖𝒢‖‖B‖.

* CITED (manuscript Lemma 9.1 = Blomer–Goldmakher–Louvel Thm 1.3 + Heath-Brown, squarefree rows and columns):
  operator norm² ≪ (QX)^ε(Q + X + (QX)^{2/3}). For the complete matrix 𝒢 with all rows, Lemma A.3 of the proof note
  gives ‖𝒢‖² ≪ (QX)^ε(Q + Q^{1/2}X + (QX)^{2/3}); its middle term (from powerful row parts) is larger for X > Q^{1/2}.
* PROVED-rel (MS lower bound): ‖𝒢‖² ≫ Q + X^{1/3}Q^{5/6}. (Apply 𝒢 to the column vector a_s = W₁(N(s)/X)(N(s)/X)^{−1/2}:
  ‖𝒢a‖² = X²Σ_m|A_m(X;0)|² ≍ X²·(Q/X)(1 + (X²/Q)^{1/6}), ‖a‖² ≍ X.)
* Hence, with P = X²/Q ≥ 1: the bound obtained for T_X is (Q/X)^{1/2}‖B‖ × P^{1/6} from the cited sieve, and at best
  (Q/X)^{1/2}‖B‖ × P^{1/12} from any inequality valid for all c. Corollary R1 needs × P^{0}.

  | source | Gram exponent e in Σ\|A_m\|² ≪ (Q/X)(1 + P^{e}) | loss in T_X at X = X_η |
  |---|---|---|
  | sextic large sieve, exponent 2/3 (BGL12, HB00; manuscript Lemma 9.1; squarefree rows) | 1/3 | Z^{ηb/6} |
  | the same for complete rows as proved (Lemma A.3) | 1/2 | Z^{ηb/4} |
  | Prop 15.2 / Cor A.8 (Gauss-sum column evaluated; sharp) | 1/6 | Z^{ηb/12} |
  | any operator-norm inequality in (s, m), even the unknown sharp one | ≥ 1/6 | ≥ Z^{ηb/12} |
  | needed (Cor R1) | 0 for the pairing with B^J | 1 |

  The cited exponent 2/3 is not attained by the Gauss-sum column for X > Q^{1/2} (X^{1/3}Q^{5/6} < (QX)^{2/3} there);
  the two agree exactly at the balanced point X = Q^{1/2}, where every term equals Q. In the cubic case the
  corresponding column attains Heath-Brown's (QX)^{2/3} in the whole range X > Q^{1/2} (|ρ₃(m)|² ≍ N(m)^{−1/3} on
  squarefree m gives X^{5/3}Q^{2/3}); this is the Dunn–Radziwiłł sharpness of the cubic large sieve [CITED from
  memory of the paper's statement, not re-read]. Whether the sextic exponent 2/3 can be lowered for X > Q^{1/2} is
  OPEN, and it is irrelevant to TRO6: the Gauss-sum column already forces e ≥ 1/6.

**(A | m, s): Cauchy–Schwarz over A.** |𝔅| ≤ ‖β‖₂·(Σ_A|Σ_m w_mρ^♮(−e₀m)χ_A(m)|²)^{1/2} ≤ ‖β‖₂(Q + D + (QD)^{2/3})^{1/2}‖ρ‖.
With D = Z^{7/6}, ‖β‖₂ ≍ 1, ‖B‖ ≍ Q^{1/2}: this is worse than Cauchy–Schwarz in m by (QD)^{1/3}/Q^{1/2} = Z^{1/4}. The
operator-norm version with the true row norm cannot beat ‖B‖ (proof note §7.2, PROVED). The gap Z^{1/4} is what
Lemma 15.1 already recovers from the cubic Gauss-sum structure of β.

**(m | s, A): execute the m-sum.** m carries a smooth weight, so this is a Type I sum and Poisson is lossless. For
X·D ≤ Q^{1−δ} it gives Prop S. For the true lengths it produces Z^{3/4+η/16} dual frequencies k; the complete sums
factor (twisted multiplicativity) into γ₁(A)conj χ_A(k)·|γ₁(s)|²χ_s(k)·(reciprocity phases), and on A = cn³ the product
γ₁(c)γ₂(c) = μ(c)α(c)G(c) (manuscript (4.7)) appears. The rows with k·A⁴ a sixth power up to S-units (k = c²j⁶) are the
principal row and carry Σ_c μ(c)ϑ(c)… = 1/L^S_F(s, ϑ); the others are bounded by Lemma 9.1 with the margin m_hi of
Lemma 20.2. This is the manuscript's high side [CITED; the sketch of the factorisation is HEURISTIC here].

**Proposition L [PROVED-rel, for the first two groupings; assessment for the third].** No bound for T_{X_η}(B^J)
obtained from an inequality that is uniform in one of the three coefficient vectors is smaller than the
Cauchy–Schwarz bound (Q/X_η)^{1/2}Z^{ηb/12}‖B‖. Uniform in the s-vector or in c = wB: extremal vectors above. Uniform
in the A-vector β: Prop S shows the bound is true for D ≤ Q^{1/2−}, and the Gauss-sum β shows it is false for
D ≥ Q^{1/2+}.

So a proof of TRO6^♮ has to use, simultaneously, that the s-vector is γ₁ and that the A-vector is γ₂·ϑ. Their only
known interaction is γ₁γ₂ = μαG on the diagonal s ∼ c after Poisson in m, which is the high side and returns the
Möbius sum of the target.

**Dunn–Radziwiłł Type I / Type II.** Their conditional step converts smooth sums of cubic Gauss sums into sums over
primes; the bilinear (Type II) input is Heath-Brown's cubic large sieve, used at its sharp exponent, and the Type I
input is the Voronoi formula. In 𝔅 there is no prime variable to decompose except the slot primes p_i of the row
(total length Z^{ℓ}); for those, χ_{pA′}(m) = χ_p(m)χ_{A′}(m) and the large sieve in (p, m) is lossless (Z^{ℓ} < Q^{1/2})
but leaves the A′-sum of length Z untouched. The Type I information (Voronoi for the cubic sum over c) is already
spent in Lemma 15.1. So the method reproduces Lemma 15.1 and Prop 15.2 and adds nothing to their pairing. [assessment]

**Bröker–Hoffstein coefficients as Gauss-sum data.** BH16 give the functional equation and (conjecturally) the
square-index coefficients. Lemma R is the form in which that information enters a bilinear argument: ρ^♮ may be
replaced by a Gauss-sum polynomial of any length X ≥ Q^{1/2}, at cost Q^{1/2}X^{−1/6}‖B‖. Nothing finer about ρ^♮ is
used or, by Theorem D, usable without zero information.

## 5. Numerics at larger Q [MEASURED]

NUMERICS_PLACEHOLDER

## 6. Davenport–Heilbronn control

* Lemma R, Prop S, Prop L are Euler-blind: β is arbitrary. They hold verbatim if the target coefficients ϑ(A) are
  replaced by the coefficients of a Davenport–Heilbronn combination. They give no zero information for either, which
  is consistent.
* The step that would have to fail for DH is the one not proved here: the diagonal-quality bound for T_{X_η}(B^J) at
  D = Z^{1+ℓ′}. After Poisson in m its principal row is Σ_c μ(c)ϑ(c)(…): the identity γ₁(c)γ₂(c) = μ(c)α(c)G(c) turns
  the pairing of the two Gauss-sum vectors into the Dirichlet inverse of the target, and the bound is then the
  statement that 1/L^S_F(s, ϑ) is holomorphic in Re s > 7/8 − η/96. For a DH combination the row coefficients are
  not completely multiplicative, the slot factors Πϑ(p_i) do not separate, and Σμ(c)a(c)N(c)^{−s} is not 1/L_DH; the
  probe does not see the DH zeros at all. So the Euler product enters through multiplicativity of ϑ on A = c·n³·Πp_i
  and through μ = γ₁γ₂/(αG), exactly once, in the principal row.

## 7. Verdict

* **TRO6^♮(η > 0): OPEN.** Not proved, not refuted. No averaged substitute that would lower θ was found: averaging
  over v, σ, tuples or Z leaves the principal row intact, and averaging over targets ϑ gives density statements, not
  a half-plane.
* **Proved weaker form:** Prop S (arbitrary coefficients, row conductor D ≤ Q^{1/2−}). Zero-free abscissa it gives:
  **7/8, unchanged** (the manuscript rows are outside its range by Z^{3/4}). Conditional bookkeeping is unchanged from
  the conjecture note: TRO6^♮(η) + (H_{σ₀}) ⟹ Re s > max(7/8 − η/96, 0.8747719).
* **Precise obstruction:** the bilinear range is (m, s, A) = (Q, Q^{1/2}Z^{ηb/2}, Q^{7/5}); the bound needed there is
  the diagonal one; the large-sieve exponent available (2/3) gives Gram exponent 1/3, the sharp value for the
  Gauss-sum column is 1/6, and the needed 0 is not an operator-norm statement. The only grouping that is not an
  operator-norm bound is Poisson in m, with Z^{3/4+η/16} dual frequencies, and that is the high side.
* **Pivot taken once:** from "prove TRO6 by large sieve" to "prove it in the range where Poisson is empty" (Prop S).
  No further cycling.

## 8. Three weakest steps

1. **Inputs are relative.** Lemma R and Prop S rest on (Id) of Theorem A for *all* X ≥ 1, including X < Q^{1/2} and
   X close to Q; Theorem A is PROVED-rel BH16 and the unrefereed manuscript's Lemmas 4.4, 9.1 and was refereed only
   internally. The lower bounds in Prop L and Cor R1 (⇒) use M^♮ ≫ Q^{5/6}, which is PROVED-rel at main-term level only.
2. **Row lengths after reflection.** The statement that the reflected rows (dual length Z^{1/2}) are not "short rows"
   in the sense of Prop S is read off the shape of (5.1), not proved. If the reflected rows could be written as
   Σ_{N(μ)≤Z^{1/2}}β̃_μχ_μ(m) × (m-only factor of Gauss-sum type), the m-sum would be a twisted cubic Kubota sum of
   length Q and conductor Z^{11/12}, not a Poisson sum; that case was not analysed.
3. **Numerics measure a toy.** The rows in §5 are toy rows (no n³ part, no target, no slots), the coefficients are the
   stripped ρ_σ rather than ρ^♮, and at these sizes the statistic can only detect an aligned fraction of a few
   percent; it cannot measure η.
