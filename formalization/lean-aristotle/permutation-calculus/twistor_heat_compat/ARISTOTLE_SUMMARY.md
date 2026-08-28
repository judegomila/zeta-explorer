# Summary of changes for run 7407e671-68fc-4350-8d6c-160034fc0e87
Formalized `job14_twistor_heat_compat.tex` (Lemma 6.1, "Conditional heat compatibility") in the new file `RequestProject/TwistorHeatCompat.lean`. The project builds cleanly with no `sorry`, and the results use only the standard axioms.

Following the paper's own statement (and its transcription warning), the setting is four modules over a commutative ring `K` — analytic state spaces `Ap`, `Am` and twistor/dual-twistor spaces `Tp`, `Tm` (complex vector spaces are the special case `K = ℂ`; no topology, boundedness or continuity is used) — with all six maps `R, Fp, Fm, IK, Ahatp, Ahatm` plus the channel-wise heat generators `Aopp, Aopm` as `LinearMap`s. The paper's `±` subscripts are written as the suffixes `p`/`m`, since `₊`/`₋` are not legal identifier characters in Lean.

The three hypotheses are exactly the paper's intertwining relations, as equalities of compositions:
- (I1) `R ∘ₗ Aopp = Aopm ∘ₗ R` (R commutes with 𝒜; no inhomogeneous term),
- (I2) `IK ∘ₗ Fp = Fm ∘ₗ R` (paper eq. (12)),
- (I3) `Ahatp ∘ₗ Fp = Fp ∘ₗ Aopp` and `Ahatm ∘ₗ Fm = Fm ∘ₗ Aopm`.

Three proved theorems package the conclusion:
- `heat_compat_apply` — pointwise: `IK (Ahatp (Fp a)) = Ahatm (IK (Fp a))` for every `a : Ap`, proved by the paper's five-step diagram chase written as an explicit `calc`;
- `heat_compat_comp` — as an equality of compositions `IK ∘ₗ Ahatp ∘ₗ Fp = Ahatm ∘ₗ IK ∘ₗ Fp`;
- `heat_compat_on_range` — restricted to `ran(Fp)` exactly as in the paper: for `t ∈ LinearMap.range Fp`, `IK (Ahatp t) = Ahatm (IK t)`.

All work is committed and pushed.