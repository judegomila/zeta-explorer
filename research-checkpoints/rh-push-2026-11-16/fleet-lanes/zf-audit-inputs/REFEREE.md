# REFEREE: zf-audit-inputs/RESULT.md

Date 2026-11-16. Adversarial pass. Every step labelled PROVED was re-run or re-derived with a different
method or test case. Verdict: **holds** (all PROVED claims confirmed). No new zero-free region or Lambda
bound is claimed, and none follows. Four imprecisions and two omissions are listed in section 3; none
changes a PROVED claim.

## 1. Lean claims (re-run today, workspace `~/lean-deps/qrh-verify/lean`, Lean 4.34.1)

| claim | referee check | result |
|---|---|---|
| `Nonvanishing.olean` sha256 `adeff7db...d499fdc` equals the 2026-10-07 record | `shasum -a 256`; compared with `papers/lambda-qrh-0.116091/PROVENANCE.md` and `formalization/external/openai-math-qrh-verification.md` | equal |
| no OAI source newer than the olean | `find OAI -newer` | 0 |
| Mathlib HEAD `d13f23b7`, clean | `git rev-parse`, `git status --porcelain` | confirmed, 0 changes |
| axioms of the zeta and Dirichlet theorems | fresh file, also printing `ProbeFinalAssemblyUnconditional.zeta_nonzero` and `detector_certified_bands` | `[propext, Classical.choice, Quot.sound]` for all four |
| statement is about Mathlib's objects | `Environment.getModuleIdxFor?`: `riemannZeta` in `Mathlib.NumberTheory.LSeries.RiemannZeta`, `DirichletCharacter.LFunction` in `Mathlib.NumberTheory.LSeries.DirichletContinuation` | not shadowed |
| closure = 2924 OAI modules; three non-OAI non-Mathlib imports | independent DFS over `import` lines (separate script) | 2924, set-equal to `closure-bfs.txt`; externals = `PrimeNumberTheoremAnd.Wiener`, `RellichKondrachov...Rellich`, `Lean.Elab.Tactic.Omega`; every closure module has an olean; the only two files of the directory outside the closure are `Hecke/ConditionalNonvanishing` and `Hecke/Nonvanishing` |
| source scan, 2926 files / 486,558 lines | re-grepped the listed patterns plus `set_option`, `+native`, `extern`, `opaque`, `csimp`, `sorryAx`, `trustCompiler`, `bv_decide`, `#eval`, `run_meta` | 0 files for each. `notation` occurs only as `local notation` abbreviations (`O`, `Eis`, `Id`, `λ₀`) and `open scoped LSeries.notation` |
| Hecke family statement | `hecke-src/` is byte-identical to the two OAI files; neither has an olean; re-elaborated `AxHecke.lean` plus `LFunction_ofResidue_...` | same three axioms |
| `leanchecker` | replayed two modules not in the RESULT's list: `Energy.CertifiedExistence`, `Hecke.ZeroSupremum` | exit 0 (120 s). Replay count is now 8 of 2924 |
| `Main78.lean` | `scripts/check-oai.sh` | five theorems, same three axioms |
| `terminal_certificate` hypotheses | read `Energy/CertifiedExistence.lean` | `(3/4 : ℝ) ≤ κ`, `51/100 ≤ beta`, `2*beta - 1 ≤ κ` as quoted; `kappaPlain = 3/4 + 2Δ` in `Moments/DetectorPlainMomentParameters.lean` |

## 2. Xu-Sang claims (independent sympy / exact-rational script, not the RESULT's scripts)

* (40): expanded `2 Λ_j J (-E_j - g_j)` symbolically with `E` built from (28) and (21). Degree (2,3) in
  `(δ, y)`; coefficients of `A_j, B_j, C_j` and of `4 A_j C_j - B_j^2` are integers, equal to the values in the
  RESULT's script, and each one appears in the arXiv HTML. All `A_j` and discriminant coefficients are
  positive. With `J > 0` this gives `E_j < -g_j` on the rectangle. Confirmed for j = 0, 1.
* Different numeric test: 40,000 random points plus a 2001-point line at `x = 1/2` near `δ = 0.4694`, 40 digits:
  max `E_0 = -2.2241e-6`, max `E_1 = -2.1947e-7`. Agrees with the RESULT.
* (12), `h = 1 - l_x + ℓ = l_y + 2ℓ`, (17), (23), (26), the full-capacity identity, `2D - 3P = 2x(2 + c - 3cx)`,
  the y-form of `J`: confirmed.
* Proposition 4.1: solved `A_I(r) = A_P(t - r)` for `r_*`, substituted to get `R_sh`, solved `R_sh = R_long`
  for `t_*`, substituted to get (21). All four identities hold symbolically. `A_I`, `A_P` follow from (4), (6) with
  witness sizes `U^{δr/2}`, `U^{δm/2}` and `2qz = δx(1 - r)`, `cδx(1 - 2m)`. Range `3/5 ≤ r_* ≤ 1`,
  `1/3 ≤ t - r_* ≤ 1/2` for `c ≤ 6/13`: 20,000 random samples, no violation (MEASURED, not proved here).
* (28) = (27) at `d = h`, `ϑ = q/(6κ)`: symbolic difference is 0 (the `z_0` terms cancel).
* (36): `(1 + 3/4)/2 = 7/8`, `(1 + 29991/40000)/2 = 69991/80000`, `B(ℓ_1) = 8748867/10^7`; `B_0 - B_1 = 8e-7`.
* Appendix A at `κ ≥ 13/18`, against manuscript lines 9618-9658: `z < (M/6)/(6κ - 1) ≤ M/20` iff `κ ≥ 13/18`;
  `A - z > 47M/60 > M/2 = 2L`; `A_comp < 3M/2 - 5M/6 + M/10 = 23M/30`; `A_comp + (6κ - 1)z < 5M/2 - 5M/3 + M/10
  = 14M/15`. Both reserves are M/15. Manuscript Lemma 4.9 carries no lower bound on `s_κ` beyond `b ≥ β_*`,
  so (18.11)-(18.12) do not add a κ restriction. Confirmed relative to the displayed text.

## 3. Imprecisions and omissions (none breaks a PROVED claim)

1. Section 1.2: "the Lean library covers the plain moment at κ = 3/4 given β ≤ 7/8" omits the third
   hypothesis `51/100 ≤ HeckeZeroSupremum.beta`. `beta` is `sSup ({1/2} ∪ zero real parts)`, so this hypothesis
   is not provable unconditionally (it is false under GRH for the family). It holds inside any contradiction
   frame `β_* > B(ℓ) ≈ 0.8749`, which is how Xu-Sang uses the moment, so stage 0 keeps its Lean base. The
   correct statement is "given `51/100 ≤ β ≤ 7/8`".
2. Section 2.3 checks 5 scalar admissibility conditions. Xu-Sang's definition has more: `ℓ/h < 1/(6κ)`,
   `0 < 2ζ < 1/1000`, `g - 2ζ > g_*`, `A_sm > 0`, and the three inequalities (29). They are neither checked nor
   listed in 2.5. The referee checked all of them in exact arithmetic at both triples: all true.
3. "24 patches": the directory has 23 `.patch` files plus a README. Two of the patched packages
   (`PrimeNumberTheoremAnd`, `rellich-kondrachov`) are in the import cone, so "touch other packages only" means
   "not Mathlib", not "not the cone". The axiom check covers them.
4. Section 2.4 "mentions κ in exactly five places": the text also has uniformity remarks (l.9387, 9603, 10911)
   and the affine-defect lines 10487-10529 and 10921. These fall under the same five items; the count is of
   items, not of occurrences. The check relies on a PDF text extraction, which can drop symbols in displays.
5. Assumption list in section 1: for H2, `deBruijnNewmanLambda` and `H` are LeanCert definitions, not
   Mathlib ones. Their faithfulness is an unverified assumption of the same kind as item 3 of that list and
   should be listed. `check-oai.sh` puts raymond-core's LeanCert ahead of the openai/math copy on `LEAN_PATH`.
6. `leanchecker-top.out` records only timing, not the exit code.

## 4. Walls

* DH: correct. H1 is a statement per character; DH is a combination of `L(s, χ)`, `L(s, χ̄)` mod 5. The four
  Euler-product entry points (a)-(d) are in the cited texts.
* RH not assumed. The remark "under RH the three chain hypotheses hold" is a consistency remark; read against
  `Hyps.lean` it is right (all zeros real makes `head_wall` true, `first_contact` vacuous, `contact_exclusion`
  true since the barrier is positive).
* Verified height: used only inside H2 (`head_wall`, clearance 3000175332800 - 3000000092914 = 175,239,886,
  arithmetic confirmed) and labelled as such. Nothing restated as new.

## 5. Is the stage-1 gap real, and a way around

Real: the 14 Lean files in the plain-moment induction carry `(3/4 : ℝ) ≤ κ` as a hypothesis, so no Lean
statement applies at κ = 29991/40000. Way around: Xu-Sang's Appendix A claims only the centred comparison
needs `6κ - 1 ≥ 10/3`. In Lean that is the place where `hκ0` should be consumed; weakening `hκ0` to
`13/18 ≤ κ` in those 14 files and rebuilding the cone below `CertifiedExistence` would test this directly
(hours of build, no new mathematics). Not attempted here (brief: no rebuild).

Way around weakest step 3 (Hecke faithfulness): the library already has
`HeckeFamily.LFunction_eq_ideal_tsum` (`Hecke/IdealBridge.lean`, `1 < s.re`: `LFunction χ s = ∑' I : Ideal O,
idealTerm χ s I`) and `LFunction_differentiableAt` (`s ≠ 0`, off the pole). With the identity theorem this
reduces faithfulness to reading the definitions of `idealTerm` and `Character` (finite-order characters of
`(O/M)ˣ` trivial on units, any modulus, primitive or not).

## 6. Adjusted claim

As in the RESULT, with: stage 0 Lean base holds under `51/100 ≤ β ≤ 7/8`; all Xu-Sang numerical admissibility
conditions including (29) hold at both triples; kernel replay 8 of 2924. Still open: Xu-Sang low estimate for
ℓ > 1/6, Appendices B, C, E, F; Raymond W, FC, CE, tables J, K; LeanCert definition faithfulness; full replay.
