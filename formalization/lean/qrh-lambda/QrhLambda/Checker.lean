/-!
# Kernel-evaluable checker for the decreasing-barrier iteration (core Lean only)

This file deliberately imports nothing beyond Lean core, so that the per-chunk `decide +kernel`
checks (files `QrhLambda/Chunks/*.lean`) load quickly and run with bounded memory.

What is computed, for every substep `n` (time `t_n = n/512000`, cell `i = ⌊n/128⌋`, width
`δ = 1/512000`), from the stored barrier `q = P/Q` and the option of that substep — a floor-table
entry `f = (cell, r, h, ℓ)` and a kernel-table entry `k = (r, λ, ρ, M)`:

* `v = q/h²`, the self-pair cap `cap = capOf M (r²) v` (Raymond's rule `self_cap`, AF §10:
  `min(M, 2/(1+a))` if `3a ≥ 1`; `min(M, s_r(v))` if `(1+a−v)² ≥ 4a(1+a)`; `M` otherwise), and the rate
  `c = (2λ/h)(ℓ − cap/h)` (AF (11.1)), all in exact rationals (`Rat`);
* the guards E1 (`v ≤ ρ²`, `h r < 2`), E2 (`capOK`: one of three sufficient conditions for
  `cap ≥ sup_{0 ≤ v' ≤ v} s_r(v')`), E3 (`c > 0`, `0 < cδ < 1`), E7 (`1/2 ≤ h ≤ 5/2`), cell match;
* E4: the degree-18 alternating Taylor sum `T₁₈(cδ)` of `e^{−cδ}` by an integer Horner scheme
  (`horner`), the enclosure `(q + 2/c)·T₁₈(cδ) − 2/c`, and its upward rounding to the grid `2^{−96}`
  (the next stored barrier);
* E6 (non-terminal substeps): no early crossing, `(q + 2/c)·T₁₇(cδ) − 2/c > q_e = 10⁻⁸`;
* terminal substep: `z = c(q − q_e)/(2 + c q_e) ∈ (0, 1)`, both log bounds (degree-11 alternating sum
  and `z − z²/(2(1+z))`) give a lag `≤ δ`, `U = ceil_{10⁻¹⁵}(t_K + lag₁₁ + q_e/2)`, the alternate bound
  `t_K + lag_B + q_e/2 ≤ U`, and the horizon `U < 41/250`.

Nothing in this file is trusted: `QrhLambda/Sound.lean` proves that a `true`/`some` result implies the
corresponding real-number statements.
-/

namespace QrhLambda

/-- Rational number `n/d` from two naturals (data constructor). -/
def mkQ (n d : Nat) : Rat := mkRat (Int.ofNat n) d

/-- A two-point kernel row `(r, λ, ρ, M)`: displacement ratio `r`, rate factor `λ`, admissibility
radius `ρ` (`y ≤ ρh`), stored self-pair cap `M`. -/
structure Ker where
  r : Rat
  lam : Rat
  rho : Rat
  M : Rat
  deriving Repr, DecidableEq

/-- A floor-table entry: cell `i`, displacement ratio `r`, probe height `h`, joint floor `ℓ`; `src` is a
provenance tag (see the data files). -/
structure Flr where
  cell : Nat
  r : Rat
  h : Rat
  ell : Rat
  src : Nat
  deriving Repr, DecidableEq

/-- Stored barrier state: substep index `n` and `q = P/Q`. -/
structure St where
  n : Nat
  P : Nat
  Q : Nat
  deriving Repr, DecidableEq

/-- terminal level `q_e = 10⁻⁸` -/
def qE : Rat := mkQ 1 100000000

/-- self-pair term `s_r(v) = 2u/(u² + 4av)`, `u = 1 + a − v`, `a = r²` -/
def sr (a v : Rat) : Rat := 2 * (1 + a - v) / ((1 + a - v) * (1 + a - v) + 4 * a * v)

/-- Raymond's self-cap rule (`self_cap` in `tmp/b145-B-lib.py` and `tmp/s145-1-g1/pipeline.py`). -/
def capOf (M a v : Rat) : Rat :=
  if 1 ≤ 3 * a then (if M ≤ 2 / (1 + a) then M else 2 / (1 + a))
  else if 4 * a * (1 + a) ≤ (1 + a - v) * (1 + a - v) then (if M ≤ sr a v then M else sr a v)
  else M

/-- Sufficient conditions for `cap ≥ sup_{0 ≤ w ≤ v} s_r(w)` (proved in `QrhLambda/Cap.lean`):
(a) `3a ≥ 1` and `cap ≥ 2/(1+a) = s_r(0)` (`s_r` decreasing); (b) `(1+a−v)² ≥ 4a(1+a)`, `v ≤ 1+a`,
`cap ≥ s_r(v)` (`s_r` increasing on `[0, v]`); (c) `a(2cap − 1)² ≥ a + 1`, `2cap ≥ 1` (`cap` at least the
global maximum `(1 + √(1 + 1/a))/2`). -/
def capOK (a v cap : Rat) : Bool :=
  (decide (1 ≤ 3 * a) && decide (2 / (1 + a) ≤ cap)) ||
  (decide (4 * a * (1 + a) ≤ (1 + a - v) * (1 + a - v)) && decide (v ≤ 1 + a) && decide (sr a v ≤ cap)) ||
  (decide (1 ≤ 2 * cap) && decide (a + 1 ≤ a * ((2 * cap - 1) * (2 * cap - 1))))

/-- `v = q/h²` -/
def vOf (f : Flr) (q : Rat) : Rat := q / (f.h * f.h)

/-- the cap used at level `q` -/
def capAt (k : Ker) (f : Flr) (q : Rat) : Rat := capOf k.M (k.r * k.r) (vOf f q)

/-- the rate `c = (2λ/h)(ℓ − cap/h)` -/
def rate (k : Ker) (f : Flr) (q : Rat) : Rat := 2 * k.lam / f.h * (f.ell - capAt k f q / f.h)

/-- guards E1, E2, E3 (sign), E7 for one option at level `q` -/
def rateOK (k : Ker) (f : Flr) (q : Rat) : Bool :=
  decide (f.r = k.r) && decide (0 < k.r) && decide (0 < k.lam) && decide (0 < k.rho) &&
  decide (k.rho < 1) && decide (mkQ 1 2 ≤ f.h) && decide (f.h ≤ mkQ 5 2) && decide (f.h * k.r < 2) &&
  decide (0 ≤ q) && decide (vOf f q ≤ k.rho * k.rho) && capOK (k.r * k.r) (vOf f q) (capAt k f q) &&
  decide (0 < rate k f q)

/-- Integer Horner scheme for `T₁₈(N/D) = Σ_{k ≤ 18} (−N/D)^k/k!`: called as `horner N D 18 1 1 true`,
returns `(F, C, ok)` with `T₁₈(N/D) = F/C`, `C = 18!·D¹⁸`; `ok = false` if a subtraction would go
below zero. Step: `C' = C·D·(j+1)`, `F' = C' − N·F` (i.e. `G_j = 1 − (x/(j+1))·G_{j+1}`). -/
def horner (N D : Nat) : Nat → Nat → Nat → Bool → Nat × Nat × Bool
  | 0, F, C, ok => (F, C, ok)
  | j + 1, F, C, ok =>
    let C' := C * D * (j + 1)
    let NF := N * F
    horner N D j (C' - NF) C' (ok && decide (NF ≤ C'))

/-- `2^96` -/
def two96 : Nat := 79228162514264337593543950336

/-- One non-terminal substep in integers: barrier `q = P/Q`, rate `c = a/b`, `x = cδ = a/(512000 b)`.
With `T₁₈(x) = F/C`, `A = Pa + 2bQ` (so `q + 2/c = A/(Qa)`): the enclosure is
`(q + 2/c)T₁₈(x) − 2/c = (AF − 2bQC)/(QaC)`; returns its upward rounding to `2^{−96}` (numerator), provided
`0 < x < 1` and the E6 no-early-crossing test `(q + 2/c)T₁₇(x) − 2/c > 10⁻⁸` (`T₁₇ = T₁₈ − x¹⁸/18!`). -/
def expStep (P Q a b : Nat) : Option Nat :=
  let D := 512000 * b
  match horner a D 18 1 1 true with
  | (F, C, ok) =>
    let A := P * a + 2 * b * Q
    let tbc := 2 * b * Q * C
    let den := Q * a * C
    let N18 := a ^ 18
    if ok && decide (0 < a) && decide (0 < b) && decide (0 < Q) && decide (a < D) && decide (N18 ≤ F) &&
        decide (100000000 * tbc + den < 100000000 * (A * (F - N18))) then
      some ((two96 * (A * F - tbc) + den - 1) / den)
    else none

/-- One non-terminal substep `n` with option `(k, f)` from the stored barrier `P/Q`; returns the next
stored numerator (over `2^96`). Also checks the cell, `0 < q`, and the horizon `t_{n+1} ≤ 41/250`. -/
def stepOne (k : Ker) (f : Flr) (n P Q : Nat) : Option Nat :=
  if decide (f.cell = n / 128) && decide (n + 1 ≤ 83968) && decide (0 < P) && decide (0 < Q) &&
      rateOK k f (mkQ P Q) then
    expStep P Q (rate k f (mkQ P Q)).num.toNat (rate k f (mkQ P Q)).den
  else none

/-- `len` consecutive substeps with the same option. -/
def runSteps (k : Ker) (f : Flr) : Nat → St → Option St
  | 0, s => some s
  | m + 1, s =>
    match stepOne k f s.n s.P s.Q with
    | some P' => runSteps k f m ⟨s.n + 1, P', two96⟩
    | none => none

/-- A list of runs `(floor index, kernel index, length)`. -/
def runAll (ks : List Ker) (fs : List Flr) : List (Nat × Nat × Nat) → St → Option St
  | [], s => some s
  | (fi, ki, len) :: rs, s =>
    match ks[ki]?, fs[fi]? with
    | some k, some f =>
      match runSteps k f len s with
      | some s' => runAll ks fs rs s'
      | none => none
    | _, _ => none

/-- degree-11 alternating partial sum of `log(1+z)` (an upper bound for `0 ≤ z`) -/
def log11 (z : Rat) : Rat :=
  z - z ^ 2 / 2 + z ^ 3 / 3 - z ^ 4 / 4 + z ^ 5 / 5 - z ^ 6 / 6 + z ^ 7 / 7 - z ^ 8 / 8 + z ^ 9 / 9 -
    z ^ 10 / 10 + z ^ 11 / 11

/-- the alternate log bound `log(1+z) ≤ z − z²/(2(1+z))` (`z ≥ 0`) -/
def logB (z : Rat) : Rat := z - z * z / (2 * (1 + z))

/-- `ceil_{1/d}(x)` for `x ≥ 0`. -/
def ceilDen (x : Rat) (d : Nat) : Rat := mkQ ((x.num.toNat * d + x.den - 1) / x.den) d

/-- the terminal crossing time `z` -/
def zOf (c q : Rat) : Rat := c * (q - qE) / (2 + c * qE)

/-- The value `U = ceil_{10⁻¹⁵}(t_K + log11(z)/c + q_e/2)` at terminal substep `n`. -/
def Uval (c q : Rat) (n : Nat) : Rat :=
  ceilDen (mkQ n 512000 + log11 (zOf c q) / c + qE / 2) 1000000000000000

/-- the terminal enclosure test of the consumer: `(q + 2/c)·T₁₈(cδ) − 2/c ≤ q_e` (in integers) -/
def termCond (P Q a b : Nat) : Bool :=
  let D := 512000 * b
  match horner a D 18 1 1 true with
  | (F, C, _) => decide (100000000 * ((P * a + 2 * b * Q) * F) ≤ 100000000 * (2 * b * Q * C) + Q * a * C)

/-- Terminal substep `n` with option `(k, f)` from `P/Q`: returns `U` if all terminal checks pass. -/
def terminalU (k : Ker) (f : Flr) (n P Q : Nat) : Option Rat :=
  if decide (f.cell = n / 128) && decide (0 < Q) && rateOK k f (mkQ P Q) &&
      decide (qE < mkQ P Q) &&
      decide (0 < zOf (rate k f (mkQ P Q)) (mkQ P Q)) && decide (zOf (rate k f (mkQ P Q)) (mkQ P Q) < 1) &&
      decide (log11 (zOf (rate k f (mkQ P Q)) (mkQ P Q)) / rate k f (mkQ P Q) ≤ mkQ 1 512000) &&
      decide (logB (zOf (rate k f (mkQ P Q)) (mkQ P Q)) / rate k f (mkQ P Q) ≤ mkQ 1 512000) &&
      decide (mkQ n 512000 + logB (zOf (rate k f (mkQ P Q)) (mkQ P Q)) / rate k f (mkQ P Q) + qE / 2 ≤
        Uval (rate k f (mkQ P Q)) (mkQ P Q) n) &&
      decide (Uval (rate k f (mkQ P Q)) (mkQ P Q) n < mkQ 41 250) &&
      termCond P Q (rate k f (mkQ P Q)).num.toNat (rate k f (mkQ P Q)).den then
    some (Uval (rate k f (mkQ P Q)) (mkQ P Q) n)
  else none

/-- A chunk of consecutive non-terminal substeps. -/
structure Chunk where
  runs : List (Nat × Nat × Nat)
  start : St
  stop : St
  deriving Repr

/-- A complete run certificate: tables, the first substep, chunks of substeps `1 … K−1`, the terminal
substep `K`, the claimed value `U` and the zero-free bound `qb = (2θ − 1)²` of the start. -/
structure Cert where
  kers : List Ker
  flrs : List Flr
  q0 : St
  first : Nat × Nat
  chunks : List Chunk
  term : Nat × Nat
  U : Rat
  qb : Rat

namespace Cert

/-- one chunk is replayed exactly -/
def chunkOK (C : Cert) (j : Nat) : Bool :=
  match C.chunks[j]? with
  | some ch => runAll C.kers C.flrs ch.runs ch.start == some ch.stop
  | none => false

/-- chunk boundaries line up: chunk `j` stops where chunk `j+1` starts -/
def linked : List Chunk → Bool
  | [] => true
  | [_] => true
  | a :: b :: rest => (a.stop == b.start) && linked (b :: rest)

/-- the start state, the first substep (with the strict-entry check S1 and `q0 > qb`), the chunk
links, and the terminal substep; everything except the chunk replays. -/
def frame (C : Cert) : Bool :=
  match C.kers[C.first.2]?, C.flrs[C.first.1]?, C.kers[C.term.2]?, C.flrs[C.term.1]?,
      C.chunks.head?, C.chunks.getLast? with
  | some k0, some f0, some kK, some fK, some c0, some cL =>
    decide (C.q0.n = 0) && decide (0 < C.q0.Q) && decide (0 ≤ C.qb) &&
    decide (C.qb < mkQ C.q0.P C.q0.Q) &&
    -- S1: q0 − (2 + c0 q0)·10⁻⁸ > qb
    decide (C.qb < mkQ C.q0.P C.q0.Q - (2 + rate k0 f0 (mkQ C.q0.P C.q0.Q) * mkQ C.q0.P C.q0.Q) * qE) &&
    (stepOne k0 f0 0 C.q0.P C.q0.Q == some c0.start.P) && decide (c0.start.n = 1) &&
    decide (c0.start.Q = two96) && linked C.chunks &&
    (terminalU kK fK cL.stop.n cL.stop.P cL.stop.Q == some C.U)
  | _, _, _, _, _, _ => false

end Cert

end QrhLambda
