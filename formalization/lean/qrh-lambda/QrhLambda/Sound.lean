import QrhLambda.Barrier
import QrhLambda.Cap
import QrhLambda.ExpLog
import QrhLambda.Terminal11

/-!
# Soundness of the checker

From `C.frame = true` and the chunk replays (`C.chunkOK j = true` for all `j`), together with
`RaymondChainHyps`, `TableHyps C` and the start bound `StartBound qb`, we derive
`Lambda ≤ C.U` (`Cert.lambda_le`). The chain of facts:

* `rateOK_sound`: a passing guard gives a `PairRate` (with (J), (K) from `TableHyps`, the cap from
  `capOK` via `selfTerm_le_cap`);
* `expStep_sound`: the integer step gives `flow q c δ ≤ q_next` (via `exp(−x) ≤ T₁₈(x)` and the upward
  rounding) and `flow q c δ > q_e` (via `T₁₇(x) ≤ exp(−x)`);
* `stepOne_sound`: `barrier_step` moves the invariant `TailBelow (n δ) q_n` one substep;
* `first_sound`: the first substep from the start bound and the strict-entry check S1;
* `terminal_sound`: the terminal substep reaches `q_e` at `T ≤ t_K + lag`, then the head wall and
  de Bruijn's strip contraction (LeanCert `H_forward_strip`) make all zeros real at `T + q_e/2 ≤ U`,
  and `real_zeros_iff_Lambda_le` (LeanCert) gives `Lambda ≤ U`.
-/

open Complex

namespace QrhLambda

open LeanCert.Analysis.DBN

/-! ## Casts -/

lemma mkQ_cast (n d : ℕ) : ((mkQ n d : ℚ) : ℝ) = (n : ℝ) / d := by
  simp [mkQ, Rat.mkRat_eq_div]

lemma qE_cast : ((qE : ℚ) : ℝ) = qEr := by
  rw [qE, mkQ_cast]; norm_num [qEr]

lemma two96_pos : 0 < two96 := by decide

lemma rat_num_den {c : ℚ} (hc : 0 < c) : ((c.num.toNat : ℕ) : ℝ) / (c.den : ℝ) = (c : ℝ) := by
  have hnum : 0 < c.num := Rat.num_pos.mpr hc
  have h1 : ((c.num.toNat : ℕ) : ℤ) = c.num := Int.toNat_of_nonneg hnum.le
  rw [Rat.cast_def]
  congr 1
  exact_mod_cast h1

lemma ceilDiv_ge (n m : ℕ) (hm : 0 < m) : (n : ℝ) / m ≤ (((n + m - 1) / m : ℕ) : ℝ) := by
  have hmr : (0 : ℝ) < m := by exact_mod_cast hm
  rw [div_le_iff₀ hmr]
  have h1 := Nat.div_add_mod (n + m - 1) m
  have h2 := Nat.mod_lt (n + m - 1) hm
  have h3 : n ≤ (n + m - 1) / m * m := by
    have : m * ((n + m - 1) / m) + (n + m - 1) % m = n + m - 1 := h1
    rw [Nat.mul_comm] at this
    omega
  exact_mod_cast h3

lemma ceilDen_ge {x : ℚ} (hx : 0 ≤ x) {d : ℕ} (hd : 0 < d) : (x : ℝ) ≤ ((ceilDen x d : ℚ) : ℝ) := by
  unfold ceilDen
  rw [mkQ_cast]
  have hnum : 0 ≤ x.num := Rat.num_nonneg.mpr hx
  have hn : ((x.num.toNat : ℕ) : ℤ) = x.num := Int.toNat_of_nonneg hnum
  have hxr : (x : ℝ) = ((x.num.toNat : ℕ) : ℝ) / x.den := by
    rw [Rat.cast_def]; congr 1; exact_mod_cast hn.symm
  have hc := ceilDiv_ge (x.num.toNat * d) x.den x.den_pos
  rw [hxr]
  have hdr : (0 : ℝ) < d := by exact_mod_cast hd
  rw [le_div_iff₀ hdr]
  calc ((x.num.toNat : ℕ) : ℝ) / x.den * d = ((x.num.toNat * d : ℕ) : ℝ) / x.den := by push_cast; ring
    _ ≤ _ := hc

lemma log11_cast (z : ℚ) : ((log11 z : ℚ) : ℝ) = logSum 11 (z : ℝ) := by
  simp only [log11, logSum, Finset.sum_range_succ, Finset.sum_range_zero]
  push_cast
  ring

/-- the invariant at a stored state: `n ≥ 1`, `Q > 0`, and the tail zeros of `H_{nδ}` are strictly
below `P/Q` -/
def Inv (s : St) : Prop := 1 ≤ s.n ∧ 0 < s.Q ∧ TailBelow ((s.n : ℝ) * dlt) ((s.P : ℝ) / s.Q)

lemma cell_bounds {i n : ℕ} (h : i = n / 128) :
    (i : ℝ) / 4000 ≤ (n : ℝ) * dlt ∧ (n : ℝ) * dlt + dlt ≤ ((i : ℝ) + 1) / 4000 := by
  have h1 : 128 * i ≤ n := by omega
  have h2 : n + 1 ≤ 128 * i + 128 := by omega
  have h1r : (128 : ℝ) * i ≤ n := by exact_mod_cast h1
  have h2r : (n : ℝ) + 1 ≤ 128 * i + 128 := by exact_mod_cast h2
  unfold dlt
  constructor <;> linarith

/-! ## Guards → `PairRate` -/

lemma sr_cast (a v : ℚ) : ((sr a v : ℚ) : ℝ) = selfTerm (a : ℝ) (v : ℝ) := by
  simp only [sr, selfTerm]
  push_cast
  ring

theorem capOK_sound {a v cap : ℚ} (h : capOK a v cap = true) :
    (1 ≤ 3 * (a : ℝ) ∧ 2 / (1 + (a : ℝ)) ≤ (cap : ℝ)) ∨
      (4 * (a : ℝ) * (1 + a) ≤ (1 + (a : ℝ) - v) ^ 2 ∧ (v : ℝ) ≤ 1 + a ∧
        selfTerm (a : ℝ) (v : ℝ) ≤ (cap : ℝ)) ∨
      (1 ≤ 2 * (cap : ℝ) ∧ (a : ℝ) + 1 ≤ a * (2 * cap - 1) ^ 2) := by
  simp only [capOK, Bool.or_eq_true, Bool.and_eq_true, decide_eq_true_eq] at h
  rcases h with (⟨h1, h2⟩ | ⟨⟨h1, h2⟩, h3⟩) | ⟨h1, h2⟩
  · left
    exact ⟨by exact_mod_cast h1, by exact_mod_cast h2⟩
  · right; left
    refine ⟨?_, by exact_mod_cast h2, ?_⟩
    · have : (4 * (a : ℝ) * (1 + a)) ≤ (1 + (a : ℝ) - v) * (1 + (a : ℝ) - v) := by exact_mod_cast h1
      rw [sq]; exact this
    · rw [← sr_cast]; exact_mod_cast h3
  · right; right
    refine ⟨by exact_mod_cast h1, ?_⟩
    have : (a : ℝ) + 1 ≤ a * ((2 * cap - 1) * (2 * cap - 1)) := by exact_mod_cast h2
    rw [sq]; exact this

theorem rateOK_sound {C : Cert} (hT : TableHyps C) {k : Ker} {f : Flr} (hk : k ∈ C.kers)
    (hf : f ∈ C.flrs) {q : ℚ} (h : rateOK k f q = true) :
    PairRate f.cell (q : ℝ) ((rate k f q : ℚ) : ℝ) ∧ 0 < ((rate k f q : ℚ) : ℝ) := by
  simp only [rateOK, Bool.and_eq_true, decide_eq_true_eq, and_assoc] at h
  obtain ⟨hr, hr0, hl0, hrho0, hrho1, hh1, hh2, hsp, hq0, hv, hcap, hc⟩ := h
  have hh1r : (1 / 2 : ℝ) ≤ (f.h : ℝ) := by
    have : ((mkQ 1 2 : ℚ) : ℝ) ≤ (f.h : ℝ) := by exact_mod_cast hh1
    rw [mkQ_cast] at this; norm_num at this ⊢; exact this
  have hh2r : (f.h : ℝ) ≤ 5 / 2 := by
    have : (f.h : ℝ) ≤ ((mkQ 5 2 : ℚ) : ℝ) := by exact_mod_cast hh2
    rw [mkQ_cast] at this; norm_num at this ⊢; exact this
  have hhpos : (0 : ℝ) < f.h := by linarith
  have hrhopos : (0 : ℝ) < k.rho := by exact_mod_cast hrho0
  have hrho1r : (k.rho : ℝ) < 1 := by exact_mod_cast hrho1
  have hvr : (q : ℝ) / ((f.h : ℝ) * f.h) ≤ (k.rho : ℝ) * k.rho := by
    have : ((vOf f q : ℚ) : ℝ) ≤ ((k.rho * k.rho : ℚ) : ℝ) := by exact_mod_cast hv
    simpa [vOf] using this
  have hhh : (0 : ℝ) < (f.h : ℝ) * f.h := by positivity
  refine ⟨⟨(k.r : ℝ), (k.lam : ℝ), (k.rho : ℝ), (f.h : ℝ), (f.ell : ℝ), ((capAt k f q : ℚ) : ℝ),
    ?_, hT.kernels_valid k hk, by exact_mod_cast hr0, by exact_mod_cast hl0, hrhopos, hrho1r,
    hh1r, hh2r, by exact_mod_cast hsp, by exact_mod_cast hq0, ?_, ?_, ?_⟩, by exact_mod_cast hc⟩
  · have := hT.floors_valid f hf
    rw [hr] at this
    exact this
  · rw [div_le_iff₀ hhh] at hvr
    nlinarith
  · intro w hw0 hw
    have ha : (0 : ℝ) < ((k.r * k.r : ℚ) : ℝ) := by
      have : (0 : ℚ) < k.r * k.r := mul_pos hr0 hr0
      exact_mod_cast this
    have hvle : ((vOf f q : ℚ) : ℝ) = (q : ℝ) / ((f.h : ℝ) * f.h) := by simp [vOf]
    have hv1 : ((vOf f q : ℚ) : ℝ) < 1 := by
      rw [hvle]
      have : (k.rho : ℝ) * k.rho < 1 := by nlinarith
      linarith
    have hwv : w ≤ ((vOf f q : ℚ) : ℝ) := by
      rw [hvle]; rw [sq] at hw; exact hw
    have hr2 : (k.r : ℝ) ^ 2 = ((k.r * k.r : ℚ) : ℝ) := by push_cast; ring
    rw [hr2]
    exact selfTerm_le_cap ha hw0 hwv hv1 (capOK_sound hcap)
  · simp only [rate]
    push_cast
    ring

/-! ## The integer exponential step -/

theorem expStep_sound {P Q a b P' : ℕ} (h : expStep P Q a b = some P') :
    0 < a ∧ 0 < b ∧ 0 < Q ∧
      flow ((P : ℝ) / Q) ((a : ℝ) / b) dlt ≤ (P' : ℝ) / (two96 : ℝ) ∧
      qEr < flow ((P : ℝ) / Q) ((a : ℝ) / b) dlt := by
  unfold expStep at h
  dsimp only at h
  rcases hh : horner a (512000 * b) 18 1 1 true with ⟨F, C, ok⟩
  rw [hh] at h
  dsimp only at h
  split_ifs at h with hc
  simp only [Option.some.injEq] at h
  simp only [Bool.and_eq_true, decide_eq_true_eq, and_assoc] at hc
  obtain ⟨hok, ha, hb, hQ, haD, hN18, hlow⟩ := hc
  subst hok
  have hD : 0 < 512000 * b := by positivity
  obtain ⟨_, hCeq, hFC⟩ := horner_spec a (512000 * b) hD 18 1 1 true F C hh (by norm_num)
  refine ⟨ha, hb, hQ, ?_⟩
  -- real variables
  set x : ℝ := (a : ℝ) / ((512000 * b : ℕ) : ℝ) with hx
  have hxpos : 0 ≤ x := by positivity
  have hT19 : taylorNeg 19 x = (F : ℝ) / C := by
    rw [← hornerR_eq_taylor, hFC]; norm_num
  have hCpos : (0 : ℝ) < C := by
    rw [hCeq]; positivity
  have hCr : (C : ℝ) = ((512000 * b : ℕ) : ℝ) ^ 18 * (Nat.factorial 18 : ℝ) := by
    rw [hCeq]; push_cast; ring
  have hT18 : taylorNeg 18 x = ((F : ℝ) - (a : ℝ) ^ 18) / C := by
    have h1 := taylor19_sub_taylor18 x
    have h2 : x ^ 18 / (Nat.factorial 18 : ℝ) = (a : ℝ) ^ 18 / C := by
      rw [hCr, hx, div_pow]
      push_cast
      have : ((512000 : ℝ) * b) ^ 18 ≠ 0 := by positivity
      field_simp
    rw [h2, hT19] at h1
    rw [sub_div]
    linarith
  have har : (0 : ℝ) < a := by exact_mod_cast ha
  have hbr : (0 : ℝ) < b := by exact_mod_cast hb
  have hQr : (0 : ℝ) < Q := by exact_mod_cast hQ
  have hcx : (a : ℝ) / b * dlt = x := by
    rw [hx, dlt]; push_cast; field_simp
  have hq2 : 0 ≤ (P : ℝ) / Q + 2 / ((a : ℝ) / b) := by positivity
  -- key identities
  set A : ℕ := P * a + 2 * b * Q with hA
  set tbc : ℕ := 2 * b * Q * C with htbc
  set den : ℕ := Q * a * C with hden
  have hdenpos : 0 < den := by
    rw [hden]
    have : 0 < C := by exact_mod_cast hCpos
    positivity
  have hdenr : (0 : ℝ) < den := by exact_mod_cast hdenpos
  have hlowR : (100000000 : ℝ) * tbc + den < 100000000 * ((A : ℝ) * ((F : ℝ) - (a : ℝ) ^ 18)) := by
    have : ((100000000 * tbc + den : ℕ) : ℝ) < ((100000000 * (A * (F - a ^ 18)) : ℕ) : ℝ) := by
      exact_mod_cast hlow
    push_cast [Nat.cast_sub hN18] at this
    linarith
  have htbcAF : tbc ≤ A * F := by
    have h1 : A * (F - a ^ 18) ≤ A * F := Nat.mul_le_mul_left _ (Nat.sub_le _ _)
    omega
  have hup_eq : ((P : ℝ) / Q + 2 / ((a : ℝ) / b)) * ((F : ℝ) / C) - 2 / ((a : ℝ) / b) =
      ((A : ℝ) * F - tbc) / den := by
    rw [hA, htbc, hden]
    push_cast
    field_simp
  have hlow_eq : ((P : ℝ) / Q + 2 / ((a : ℝ) / b)) * (((F : ℝ) - (a : ℝ) ^ 18) / C) -
      2 / ((a : ℝ) / b) = ((A : ℝ) * ((F : ℝ) - (a : ℝ) ^ 18) - tbc) / den := by
    rw [hA, htbc, hden]
    push_cast
    field_simp
  constructor
  · -- upper: flow ≤ (q + 2/c)T₁₉ − 2/c = (AF − tbc)/den ≤ P'/2^96
    have h1 : flow ((P : ℝ) / Q) ((a : ℝ) / b) dlt ≤ ((A : ℝ) * F - tbc) / den := by
      unfold flow
      rw [hcx, ← hup_eq, ← hT19]
      have := exp_neg_le_taylor19 hxpos
      nlinarith [mul_le_mul_of_nonneg_left this hq2]
    have h2 : ((A : ℝ) * F - tbc) / den ≤ (P' : ℝ) / (two96 : ℝ) := by
      have hc := ceilDiv_ge (two96 * (A * F - tbc)) den hdenpos
      rw [h] at hc
      have h96 : (0 : ℝ) < two96 := by exact_mod_cast two96_pos
      rw [le_div_iff₀ h96]
      have e : (((two96 * (A * F - tbc)) : ℕ) : ℝ) / den = ((A : ℝ) * F - tbc) / den * two96 := by
        push_cast [Nat.cast_sub htbcAF]
        ring
      rw [e] at hc
      exact hc
    exact h1.trans h2
  · -- lower: flow ≥ (q + 2/c)T₁₈ − 2/c > 10⁻⁸
    have h1 : ((A : ℝ) * ((F : ℝ) - (a : ℝ) ^ 18) - tbc) / den ≤ flow ((P : ℝ) / Q) ((a : ℝ) / b) dlt := by
      unfold flow
      rw [hcx, ← hlow_eq, ← hT18]
      have := taylor18_le_exp_neg hxpos
      nlinarith [mul_le_mul_of_nonneg_left this hq2]
    have h2 : qEr < ((A : ℝ) * ((F : ℝ) - (a : ℝ) ^ 18) - tbc) / den := by
      rw [qEr, lt_div_iff₀ hdenr]
      linarith
    exact lt_of_lt_of_le h2 h1

/-! ## One substep -/

theorem stepOne_sound {C : Cert} (hR : RaymondChainHyps) (hT : TableHyps C) {k : Ker} {f : Flr}
    (hk : k ∈ C.kers) (hf : f ∈ C.flrs) {n P Q P' : ℕ} (h : stepOne k f n P Q = some P')
    (hn : 1 ≤ n) (hinv : TailBelow ((n : ℝ) * dlt) ((P : ℝ) / Q)) :
    TailBelow (((n + 1 : ℕ) : ℝ) * dlt) ((P' : ℝ) / (two96 : ℝ)) := by
  unfold stepOne at h
  split_ifs at h with hc
  simp only [Bool.and_eq_true, decide_eq_true_eq, and_assoc] at hc
  obtain ⟨hcell, hhor, hP, hQ, hrate⟩ := hc
  obtain ⟨hPR, hcpos⟩ := rateOK_sound hT hk hf hrate
  obtain ⟨_, _, _, hup, hlow⟩ := expStep_sound h
  rw [rat_num_den (by exact_mod_cast hcpos)] at hup hlow
  rw [mkQ_cast] at hPR
  obtain ⟨hc1, hc2⟩ := cell_bounds hcell
  have hPr : (0 : ℝ) < P := by exact_mod_cast hP
  have hQr : (0 : ℝ) < Q := by exact_mod_cast hQ
  have hnr : (1 : ℝ) ≤ n := by exact_mod_cast hn
  have hhorr : (n : ℝ) + 1 ≤ 83968 := by exact_mod_cast hhor
  have hstep := barrier_step hR (i := f.cell) (t₀ := (n : ℝ) * dlt) (τ := dlt) (b := (P : ℝ) / Q)
    (Q := (P : ℝ) / Q) (c := ((rate k f (mkQ P Q) : ℚ) : ℝ))
    (by unfold dlt; positivity) hc1 (by unfold dlt; norm_num) hc2
    (by unfold dlt; linarith) (by positivity) le_rfl hPR hcpos hlow.le hinv
  have e : (((n + 1 : ℕ) : ℝ) * dlt) = (n : ℝ) * dlt + dlt := by push_cast; ring
  rw [e]
  exact hstep.mono hup

theorem runSteps_sound {C : Cert} (hR : RaymondChainHyps) (hT : TableHyps C) {k : Ker} {f : Flr}
    (hk : k ∈ C.kers) (hf : f ∈ C.flrs) :
    ∀ (m : ℕ) (s s' : St), runSteps k f m s = some s' → Inv s → Inv s' := by
  intro m
  induction m with
  | zero =>
    intro s s' h hs
    simp only [runSteps, Option.some.injEq] at h
    subst h; exact hs
  | succ m ih =>
    intro s s' h hs
    simp only [runSteps] at h
    split at h
    · rename_i P' hP'
      apply ih _ _ h
      refine ⟨by simp, two96_pos, ?_⟩
      exact stepOne_sound hR hT hk hf hP' hs.1 hs.2.2
    · simp at h

theorem runAll_sound {C : Cert} (hR : RaymondChainHyps) (hT : TableHyps C) :
    ∀ (rs : List (ℕ × ℕ × ℕ)) (s s' : St), runAll C.kers C.flrs rs s = some s' → Inv s → Inv s' := by
  intro rs
  induction rs with
  | nil =>
    intro s s' h hs
    simp only [runAll, Option.some.injEq] at h
    subst h; exact hs
  | cons r rs ih =>
    obtain ⟨fi, ki, len⟩ := r
    intro s s' h hs
    simp only [runAll] at h
    cases hk : C.kers[ki]? with
    | none => simp [hk] at h
    | some k =>
      cases hf : C.flrs[fi]? with
      | none => simp [hk, hf] at h
      | some f =>
        simp only [hk, hf] at h
        cases hr : runSteps k f len s with
        | none => simp [hr] at h
        | some s'' =>
          simp only [hr] at h
          exact ih s'' s' h (runSteps_sound hR hT (List.mem_of_getElem? hk) (List.mem_of_getElem? hf)
            len s s'' hr hs)

/-! ## Chunks -/

theorem chunks_sound {C : Cert} (hchunks : ∀ j < C.chunks.length, C.chunkOK j = true) :
    ∀ ch ∈ C.chunks, runAll C.kers C.flrs ch.runs ch.start = some ch.stop := by
  intro ch hch
  obtain ⟨j, hj, hjeq⟩ := List.mem_iff_getElem.mp hch
  have h := hchunks j hj
  simp only [Cert.chunkOK, List.getElem?_eq_getElem hj, hjeq] at h
  simpa using h

theorem linked_sound {C : Cert} (hR : RaymondChainHyps) (hT : TableHyps C) :
    ∀ (l : List Chunk), Cert.linked l = true →
      (∀ ch ∈ l, runAll C.kers C.flrs ch.runs ch.start = some ch.stop) →
      ∀ c0 cL : Chunk, l.head? = some c0 → l.getLast? = some cL → Inv c0.start → Inv cL.stop := by
  intro l
  induction l with
  | nil => intro _ _ c0 _ h; simp at h
  | cons a t ih =>
    intro hlink hall c0 cL h0 hL hinv
    simp only [List.head?_cons, Option.some.injEq] at h0
    subst h0
    have ha := runAll_sound hR hT a.runs a.start a.stop (hall a List.mem_cons_self) hinv
    cases t with
    | nil =>
      simp only [List.getLast?_singleton, Option.some.injEq] at hL
      subst hL; exact ha
    | cons b rest =>
      simp only [Cert.linked, Bool.and_eq_true, beq_iff_eq] at hlink
      obtain ⟨hab, hlink'⟩ := hlink
      apply ih hlink' (fun ch hch => hall ch (List.mem_cons_of_mem _ hch)) b cL rfl
      · rw [List.getLast?_cons_cons] at hL; exact hL
      · rw [← hab]; exact ha

/-! ## First substep (start bound + strict entry S1) -/

theorem first_sound {C : Cert} (hR : RaymondChainHyps) (hT : TableHyps C) {k0 : Ker} {f0 : Flr}
    (hk0 : k0 ∈ C.kers) (hf0 : f0 ∈ C.flrs) {P0 Q0 P1 : ℕ} (hqb0 : (0 : ℚ) ≤ C.qb)
    (hS1 : C.qb < mkQ P0 Q0 - (2 + rate k0 f0 (mkQ P0 Q0) * mkQ P0 Q0) * qE)
    (h : stepOne k0 f0 0 P0 Q0 = some P1) (hstart : StartBound (C.qb : ℝ)) :
    Inv ⟨1, P1, two96⟩ := by
  unfold stepOne at h
  split_ifs at h with hc
  simp only [Bool.and_eq_true, decide_eq_true_eq, and_assoc] at hc
  obtain ⟨hcell, _, hP, hQ, hrate⟩ := hc
  obtain ⟨hPR, hcpos⟩ := rateOK_sound hT hk0 hf0 hrate
  obtain ⟨_, _, _, hup, hlow⟩ := expStep_sound h
  rw [rat_num_den (by exact_mod_cast hcpos)] at hup hlow
  rw [mkQ_cast] at hPR
  have hcell0 : f0.cell = 0 := by simpa using hcell
  rw [hcell0] at hPR
  set q0 : ℝ := (P0 : ℝ) / Q0 with hq0
  set c0 : ℝ := ((rate k0 f0 (mkQ P0 Q0) : ℚ) : ℝ) with hc0
  have hq0pos : 0 < q0 := by
    have : (0 : ℝ) < P0 := by exact_mod_cast hP
    have : (0 : ℝ) < Q0 := by exact_mod_cast hQ
    positivity
  have hS1r : (C.qb : ℝ) < q0 - (2 + c0 * q0) * tS := by
    have : ((C.qb : ℚ) : ℝ) < ((mkQ P0 Q0 - (2 + rate k0 f0 (mkQ P0 Q0) * mkQ P0 Q0) * qE : ℚ) : ℝ) := by
      exact_mod_cast hS1
    push_cast at this
    rw [mkQ_cast, qE_cast] at this
    simpa [hq0, hc0, qEr, tS] using this
  have hqbr : (0 : ℝ) ≤ C.qb := by exact_mod_cast hqb0
  have hq2 : 0 ≤ q0 + 2 / c0 := by positivity
  set b := flow q0 c0 tS with hbdef
  have hb_lb : q0 - (2 + c0 * q0) * tS ≤ b := flow_ge_lin hcpos hq2
  have hbpos : 0 < b := by linarith
  have hbq0 : b ≤ q0 := by
    have := flow_antitone hcpos hq2 (by norm_num [tS] : (0 : ℝ) ≤ tS)
    rw [flow_zero] at this; exact this
  have hTS : TailBelow tS b := by
    intro z hz _
    have := hstart z hz
    linarith
  have hflow : flow b c0 (dlt - tS) = flow q0 c0 dlt := by
    rw [hbdef, flow_add]; ring_nf
  have hstep := barrier_step hR (i := 0) (t₀ := tS) (τ := dlt - tS) (b := b) (Q := q0) (c := c0)
    (by norm_num [tS]) (by norm_num [tS]) (by norm_num [tS, dlt]) (by norm_num [tS, dlt])
    (by norm_num [tS, dlt]) hbpos hbq0 hPR hcpos (by rw [hflow]; exact hlow.le) hTS
  rw [hflow, show tS + (dlt - tS) = dlt by ring] at hstep
  refine ⟨le_rfl, two96_pos, ?_⟩
  have e : (((1 : ℕ) : ℝ) * dlt) = dlt := by simp
  simp only [e]
  exact hstep.mono hup

/-! ## Terminal substep -/

theorem terminal_sound {C : Cert} (hR : RaymondChainHyps) (hT : TableHyps C) {kK : Ker} {fK : Flr}
    (hk : kK ∈ C.kers) (hf : fK ∈ C.flrs) {s : St} {U : ℚ}
    (h : terminalU11 kK fK s.n s.P s.Q = some U) (hs : Inv s) : Lambda ≤ (U : ℝ) := by
  unfold terminalU11 at h
  split_ifs at h with hc
  simp only [Option.some.injEq] at h
  subst h
  simp only [Bool.and_eq_true, decide_eq_true_eq, and_assoc] at hc
  obtain ⟨hcell, hQ, hrate, hqE, hz0, hz1, hl11, hnonneg, hhor, _⟩ := hc
  obtain ⟨hPR, hcpos⟩ := rateOK_sound hT hk hf hrate
  set qQ : ℚ := mkQ s.P s.Q with hqQ
  set cQ : ℚ := rate kK fK qQ with hcQ
  set zQ : ℚ := zOf cQ qQ with hzQ
  have hqR : ((qQ : ℚ) : ℝ) = (s.P : ℝ) / s.Q := mkQ_cast _ _
  set q : ℝ := ((qQ : ℚ) : ℝ) with hq
  set c : ℝ := ((cQ : ℚ) : ℝ) with hc
  set z : ℝ := ((zQ : ℚ) : ℝ) with hz
  have hzexp : z = c * (q - qEr) / (2 + c * qEr) := by
    rw [hz, hzQ, zOf]; push_cast; rw [qE_cast]
  have hqEq : qEr < q := by
    have : ((qE : ℚ) : ℝ) < ((qQ : ℚ) : ℝ) := by exact_mod_cast hqE
    rw [qE_cast] at this; exact this
  have hzpos : 0 < z := by rw [hz]; exact_mod_cast hz0
  set lag : ℝ := Real.log (1 + z) / c with hlag
  have hlag0 : 0 ≤ lag := by
    apply div_nonneg _ hcpos.le
    exact Real.log_nonneg (by linarith)
  have hlag11 : lag ≤ logSum 11 z / c :=
    div_le_div_of_nonneg_right (log_one_add_le_logSum11 hzpos.le) hcpos.le
  have hl11r : logSum 11 z / c ≤ dlt := by
    have : ((log11 zQ / cQ : ℚ) : ℝ) ≤ ((mkQ 1 512000 : ℚ) : ℝ) := by exact_mod_cast hl11
    push_cast at this
    rw [log11_cast, mkQ_cast] at this
    simpa [dlt] using this
  have hUr : (s.n : ℝ) / 512000 + logSum 11 z / c + qEr / 2 ≤ ((Uval cQ qQ s.n : ℚ) : ℝ) := by
    have hx0 : (0 : ℚ) ≤ mkQ s.n 512000 + log11 zQ / cQ + qE / 2 := hnonneg
    have h1 := ceilDen_ge hx0 (by norm_num : 0 < 1000000000000000)
    have e : ((mkQ s.n 512000 + log11 zQ / cQ + qE / 2 : ℚ) : ℝ) =
        (s.n : ℝ) / 512000 + logSum 11 z / c + qEr / 2 := by
      rw [hz, hc]
      push_cast
      rw [mkQ_cast, log11_cast, qE_cast]
      norm_num
    rw [e] at h1
    exact h1
  have hhorr : ((Uval cQ qQ s.n : ℚ) : ℝ) < 41 / 250 := by
    have : ((Uval cQ qQ s.n : ℚ) : ℝ) < ((mkQ 41 250 : ℚ) : ℝ) := by exact_mod_cast hhor
    rw [mkQ_cast] at this; norm_num at this ⊢; exact this
  have hflow : flow q c lag = qEr := by
    rw [hlag, hzexp]
    exact flow_lag hcpos qEr_pos.le hqEq
  obtain ⟨hc1, hc2⟩ := cell_bounds hcell
  have hn1 : (1 : ℝ) ≤ s.n := by exact_mod_cast hs.1
  have htn : (s.n : ℝ) * dlt = (s.n : ℝ) / 512000 := by unfold dlt; ring
  have hqE2 : 0 < qEr / 2 := by have := qEr_pos; linarith
  have hT0 : TailBelow ((s.n : ℝ) * dlt) q := by
    have := hs.2.2
    rw [← hqR] at this
    exact this
  have hstep := barrier_step hR (i := fK.cell) (t₀ := (s.n : ℝ) * dlt) (τ := lag) (b := q) (Q := q)
    (c := c) (by unfold dlt; positivity) hc1 hlag0 (by linarith) (by linarith)
    (lt_trans qEr_pos hqEq) le_rfl hPR hcpos (by rw [hflow]) hT0
  rw [hflow] at hstep
  set T : ℝ := (s.n : ℝ) * dlt + lag with hTdef
  have hT0' : 0 ≤ T := by
    have : 0 ≤ (s.n : ℝ) * dlt := by unfold dlt; positivity
    rw [hTdef]; linarith
  have hTh : T ≤ 41 / 250 := by linarith
  -- all zeros of H_T satisfy Im² ≤ q_e
  have hall : ∀ w : ℂ, H T w = 0 → w.im ^ 2 ≤ (Real.sqrt qEr) ^ 2 := by
    intro w hw
    rw [Real.sq_sqrt qEr_pos.le]
    by_cases hx : |w.re| ≤ XPT
    · rw [hR.head_wall T hT0' hTh w hw hx]; simp [qEr_pos.le]
    · exact (hstep w hw (lt_of_not_ge hx)).le
  have hreal : ∀ w : ℂ, H (T + qEr / 2) w = 0 → w.im = 0 := by
    intro w hw
    have h1 := H_forward_strip T (Real.sqrt qEr) (qEr / 2) hqE2.le hall hw
    rw [Real.sq_sqrt qEr_pos.le, show qEr - 2 * (qEr / 2) = 0 by ring, max_self] at h1
    have h2 : w.im ^ 2 = 0 := le_antisymm h1 (sq_nonneg _)
    simpa using h2
  have hL := (real_zeros_iff_Lambda_le (T + qEr / 2)).1 hreal
  have : T + qEr / 2 ≤ ((Uval cQ qQ s.n : ℚ) : ℝ) := by
    rw [hTdef, htn]; linarith
  exact hL.trans this

/-! ## The run theorem -/

theorem Cert.lambda_le (C : Cert) (hframe : C.frame11 = true)
    (hchunks : ∀ j < C.chunks.length, C.chunkOK j = true)
    (hR : RaymondChainHyps) (hT : TableHyps C) (hstart : StartBound (C.qb : ℝ)) :
    Lambda ≤ (C.U : ℝ) := by
  unfold Cert.frame11 at hframe
  rcases hk0 : C.kers[C.first.2]? with _ | k0 <;> rcases hf0 : C.flrs[C.first.1]? with _ | f0 <;>
    rcases hkK : C.kers[C.term.2]? with _ | kK <;> rcases hfK : C.flrs[C.term.1]? with _ | fK <;>
    rcases hc0 : C.chunks.head? with _ | c0 <;> rcases hcL : C.chunks.getLast? with _ | cL <;>
    simp only [hk0, hf0, hkK, hfK, hc0, hcL, Bool.false_eq_true] at hframe
  simp only [Bool.and_eq_true, decide_eq_true_eq, beq_iff_eq, and_assoc] at hframe
  obtain ⟨_, _, hqb0, _, hS1, hfirst, hn1, hQ1, hlink, hterm⟩ := hframe
  have hk0m := List.mem_of_getElem? hk0
  have hf0m := List.mem_of_getElem? hf0
  have hkKm := List.mem_of_getElem? hkK
  have hfKm := List.mem_of_getElem? hfK
  have hinv0 : Inv c0.start := by
    have h := first_sound hR hT hk0m hf0m hqb0 hS1 hfirst hstart
    unfold Inv at h ⊢
    rw [hn1, hQ1]
    exact h
  have hinvL := linked_sound hR hT C.chunks hlink (chunks_sound hchunks) c0 cL hc0 hcL hinv0
  exact terminal_sound hR hT hkKm hfKm hterm hinvL

end QrhLambda
