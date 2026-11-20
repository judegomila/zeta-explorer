# AUDIT: 05 cascade-composition (independent audit, 2026-11-20)

File audited: `CascadeCompositionProved.lean` (157 lines). The auditor did not write the proof.

## 1. Compilation

Command: `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <abs path>/CascadeCompositionProved.lean`
(Lean v4.28.0, built Mathlib, single process). Exit code 0, about 17 s wall time.
0 errors. 2 linter warnings, no `sorry` warning:
- line 44: `<;>` where `;` would suffice (style only);
- line 61: unused variable `h` in `mob_short` (see section 4).

## 2. Forbidden constructs and vacuity

- grep for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `instance`, `universe`,
  `set_option`, `macro`, `notation`, `attribute`, `local`: no occurrence outside the `#print axioms` lines.
- The five definitions (`Nm`, `Jm`, `Em`, `Msec`, `mob`) are the concrete 2x2 objects of the lane; none is a
  constant or empty placeholder.
- Hypotheses: only non-vanishing of denominators (`mob_series`, `mob_short`, `scattering_defect`,
  `power_wave_contractive_iff`) and `0 < W.re`. All are satisfiable together (e.g. Z = L = W = 1); none
  restates the conclusion.
- `power_wave_contractive_iff`: the hypothesis `conj W + L ≠ 0` is necessary in Lean, because division by
  zero gives 0 and the left side would hold with `Re L = -Re W < 0`. It is automatic when `Re L ≥ 0`.
- `PosSemidef` is Mathlib's notion for complex matrices (Hermitian with nonnegative quadratic form) under
  `ComplexOrder`; this is the usual meaning of `J - M* J M ≥ 0`.

## 3. Axioms

`#print axioms` for all 11 theorems (`Nm_sq`, `Msec_mul`, `Msec_list_prod`, `mob_series`, `mob_short`,
`J_defect`, `J_contractive_iff`, `J_unitary_iff`, `scattering_defect`, `reference_change`,
`power_wave_contractive_iff`): `[propext, Classical.choice, Quot.sound]` in every case. No `sorryAx`,
no `Lean.ofReduceBool`, no added axiom.

## 4. Faithfulness

Against the original statement file `rh-push-cascade-composition/RequestProject/Main.lean`: a scripted diff
(original with the `sorry` lines removed, against the proved file) shows no line of the original missing
from the proved file. The 5 definitions and 11 theorem statements are textually identical. The original
file is untouched. Added: two helper lemmas `Msec_entries` and `Em_posSemidef` (declared `lemma`, not
`private lemma` as the claim says; no effect on the result) and 11 `#print axioms` lines.

Against the lane (`push/sq-causal-cascade/RESULT.md`, Theorem 1; the lane has no REFEREE.md, it is
unrefereed):

| Lane Theorem 1 | Lean | Status |
|---|---|---|
| (a) `N^2 = 0`, `M(Z1)M(Z2) = M(Z1+Z2)` | `Nm_sq`, `Msec_mul`, `Msec_list_prod` | stated and proved |
| (a) sections commute | follows from `Msec_mul` and `add_comm` | not stated separately |
| (a) `M(Z) = exp(ZN/2)` | none | not covered |
| (b) Moebius series law; short circuit `e_2 = 1` | `mob_series`, `mob_short` | stated and proved |
| (b) (1.1): `S = T_{M(alpha G) prod_p M(-alpha u_p)}[1]` for `Re s > 1` | none | not covered (needs `xi'/xi = G - sum_p u_p`) |
| (c) `J - M* J M = (Re Z) E` | `J_defect` | stated and proved |
| (c) J-contractive iff `Re Z >= 0`; J-unitary iff `Re Z = 0` | `J_contractive_iff`, `J_unitary_iff` | stated and proved |
| (c) J-expansive iff `Re Z <= 0` | none | not stated (same proof as the contractive case) |
| (c) `1 - |S|^2 = 4 alpha Re L/|1 + alpha L|^2` | `scattering_defect` (alpha real) | stated and proved |
| (d) `|L-W|^2 - |L+conj W|^2 = -4 Re L Re W`; `|(W-L)/(conj W+L)| <= 1` iff `Re L >= 0` | `reference_change`, `power_wave_contractive_iff` | stated and proved |

Notes:
- `mob_short` holds without its hypothesis `1 + Z ≠ 0` (when `1 + Z = 0` both sides are `x/0 = 0` in Lean).
  The hypothesis is harmless; the statement in the intended range is the lane's.
- `mob_series` assumes `1 + Z2 ≠ 0` and `1 + Z1 + Z2 ≠ 0`, the conditions under which the lane's formula
  is meaningful.

Verdict: the Lean file proves the 2x2 algebra of Theorem 1 (a)-(d) as the lane states it. It is narrower
than the full theorem in three places: no matrix exponential, no J-expansive clause, and no formula (1.1)
for the prime chain (the only part that involves zeta). Nothing in the file concerns zeta, xi or RH.

## 5. Result

- compiles: yes
- sorry-free: yes
- axioms: propext, Classical.choice, Quot.sound only
- statement changes against the original statement file: none
- faithfulness: faithful, narrower scope than lane Theorem 1 (exp, J-expansive and (1.1) omitted, as the
  FAITHFULNESS.md note already records for exp and (1.1))
