# AUDIT 07 liouville-limit (independent audit of LiouvilleLimitProved.lean)

Date: 2026-11-20. Auditor did not write the proof. Nothing committed or pushed. Original statement file untouched.

## 1. Compilation

Command: `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <...>/07-liouville-limit/LiouvilleLimitProved.lean` (Lean v4.28.0, built Mathlib).
Result: exit 0, no errors, no warnings (no `sorry` warning), about 23 s wall time. The only output is the six `#print axioms` lines.

## 2. Forbidden constructs and vacuity

- grep for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `implemented_by`, `extern`, `macro`, `syntax`, `notation`, `instance`, `universe`, `set_option`, `attribute`, `elab`, `local`: no occurrence except the six `#print axioms` commands.
- Only import: `Mathlib`. 420 lines, one file.
- `liouvilleC n = (-1 : ℂ) ^ (ArithmeticFunction.cardFactors n)`: the real Liouville function (Ω counted with multiplicity), not a trivial stand-in. `riemannZeta`, `LSeries`, `LSeriesSummable` are Mathlib's definitions, not redefined.
- Hypotheses of the six theorems: `1 < s.re` (satisfiable), none for the two limit statements, `1/2 < σ`, `σ < 1` (satisfiable). No hypothesis restates a conclusion. No contradictory hypotheses.
- Junk-value check: `zeta_ratio_tendsto_zero` uses Lean's `x / 0 = 0`, but ζ has no zero near 1, so the statement has its usual meaning. `LSeries.term` sets the n = 0 term to 0, so `liouvilleC 0 = 1` does not enter. `zeta_ratio_neg` asserts `re < 0` and `im = 0` of ζ(2σ)/ζ(σ) with Mathlib's continued ζ; it would be false if ζ(σ) were 0, so it is not satisfied by a junk value.
- Auxiliary definitions (`liouvilleSummandHom`, `etaPair`, `etaG`, `slitHalfPlane`) appear only in proofs, not in the six statements.

## 3. Axioms

All six main theorems (`liouville_lseries_summable`, `liouville_lseries_mul_zeta`, `liouville_lseries_eq`, `zeta_ratio_tendsto_zero`, `liouville_lseries_tendsto_zero`, `zeta_ratio_neg`): `[propext, Classical.choice, Quot.sound]`. Standard axioms only; no `sorryAx`, no `Lean.ofReduceBool`.

## 4. Faithfulness

- Against the original `rh-push-liouville-limit/RequestProject/Main.lean`: header, `liouvilleC` and the six theorem signatures are identical after whitespace normalization (script comparison rerun by the auditor). Claimed "no statement changes" is confirmed.
- Against the lane (`push/box-riesz-order2/RESULT.md`, T2(a) and lines 21-22, 79): the lane states that at the Liouville torus point the limit function is ζ(2s)/ζ(s), negative on (1/2, 1) and vanishing at s = 1. The Lean file proves exactly these three facts: the Dirichlet-series identity on Re s > 1, the limit 0 at s = 1 (punctured neighbourhood in ℂ, and along σ ↓ 1 for the series), and real negativity on (1/2, 1).
- Scope: narrower than T2. Not formalized: the Riesz sections f_N and weights w_n, the Perron asymptotic L f_N(1 − ω/L) = ζ(2)(k − ω) + o(1), the Hurwitz step producing the real zero σ_N, the Kronecker transfer T3, and the certified finite-N thresholds (Arb certificates). The Lean result supports the description of the limit function only; it does not establish T2.
- The lane directory has RESULT.md but no REFEREE.md, so there is no referee report to compare with.

## 5. Proof route (for the record)

Euler product of the completely multiplicative summand λ(n) n^{-s} against Mathlib's ζ Euler product; residue of ζ at 1 for the limit; for the sign, the paired alternating series Σ ((2k+1)^{-s} − (2k+2)^{-s}) is shown holomorphic on Re s > 0, equal to (1 − 2^{1−s}) ζ(s) on Re s > 1, and the identity is continued to the star-shaped domain {Re s > 0} minus [1, ∞) by the identity theorem; positivity of the paired series and negativity of 1 − 2^{1−σ} give ζ(σ) < 0 on (0, 1).

## Verdict

Compiles: yes. Sorry-free: yes. Axioms: propext, Classical.choice, Quot.sound. Faithful to the statement file and to the lane's limit-function claim; narrower than the lane's theorem T2 (as already declared in FAITHFULNESS.md). No problems found.
