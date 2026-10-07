# OpenAI math family 003 (quasi-Riemann hypothesis, Re s > 7/8): local Lean verification

Written 2026-10-07 (build finished 13:26 PDT). Source: github.com/openai/math, release 2026-10-06, commit
`adc7f1241 Initial commit`. The `lean/` directory was copied to `/tmp/qrh-verify/lean` (APFS clone) before the shared
shallow clone `/tmp/openai-math/repo` was deleted by another process (~11:40). Paper text was extracted to
`/tmp/qrh-verify/paper.txt` (7/8 manuscript, 30 Sep 2026) and `/tmp/qrh-verify/paper2.txt` (11/12 writeup, 5 Oct 2026,
human-edited). Everything ran locally, at no cost. Nothing was committed.

## 1. Result

The released Lean proof of

```lean
theorem OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re
    {s : ℂ} (hs : (7 / 8 : ℝ) < s.re) : riemannZeta s ≠ 0
```

**compiles locally** (Lean 4.34.1, Mathlib `d13f23b7`, release-pinned dependencies). It depends only on
`[propext, Classical.choice, Quot.sound]`, so no `sorryAx` and no custom axioms. Its type is identical (as a raw `Expr`,
up to one hygienic binder name) to the comparator challenge statement elaborated against Mathlib alone. The same holds
for the Dirichlet companion
`OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re` (`L(s,χ) ≠ 0` for `7/8 < re s`, excluding only
`χ = 1 ∧ s = 1`). It is in the same solution module, so it was checked as well.

`riemannZeta` in the proved statement is Mathlib's root `riemannZeta := HurwitzZeta.hurwitzZetaEven 0`, checked with
`#print`. No OAI declaration shadows it: grep found no `def riemannZeta` in `OAI/`, and the Expr shows the root constant.

## 2. What was run (reproducible)

| step | command / check | outcome |
|---|---|---|
| toolchain | elan auto-install `leanprover/lean4:v4.34.1` (`lean-toolchain`) | Lean 4.34.1 commit 5045d005, Lake 5.0.0-src+5045d00 |
| deps | `lake update` (per `lean/ComparatorChallenges/README.md`) | all 24 `patches/*-lean4341.patch` applied + reverse-check verified by the lakefile hooks; resulting `lake-manifest.json` has the same revision for every package as the released manifest |
| Mathlib cache | run by `lake update` (`lake exe cache get`) | 8908/8908 files downloaded and decompressed |
| build | `LEAN_NUM_THREADS=4 nice lake build +OAI.NumberTheory.DirichletL.Nonvanishing` | `Build completed successfully (7061 jobs)`; 2924 distinct OAI modules built (equal to the static import closure), plus 19 PrimeNumberTheoremAnd / RellichKondrachov modules; 0 errors, 0 `sorry` warnings; a second `lake build` reports everything up to date |
| statement match | `check/ChallengeType.lean` (verbatim challenge, `import Mathlib` only) vs `check/SolutionType.lean` (`import OAI.NumberTheory.DirichletL.Nonvanishing`); both print `ConstantInfo.type` as a raw Expr | both are `theorem`s with no universe params; types are identical after normalising the hygienic instance-binder name `inst._@.<module>._hyg.5`. A verbatim re-elaboration of the challenge type also typechecks against the solution constant (`example : ∀ {s : ℂ}, (7/8:ℝ) < s.re → riemannZeta s ≠ 0 := @OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`) |
| axioms | `#print axioms` on both theorems | `[propext, Classical.choice, Quot.sound]`, the comparator's permitted set |
| source scan | the 2924-file closure (486,490 lines) | 0 occurrences of `sorry`, `admit`, `axiom`, `native_decide`, `unsafe`, `implemented_by`, `extern`, `set_option` (so no `maxHeartbeats` or `debug.skipKernelTC` overrides), and no `macro`/`syntax`/`elab`/`initialize`/`run_cmd`/`#eval` lines and no `addDecl`/`Environment` use. Only non-OAI, non-Mathlib imports: `PrimeNumberTheoremAnd.Wiener`, `RellichKondrachov.Analysis.FunctionalSpaces.Sobolev.Euclidean.Rellich`, `Lean.Elab.Tactic.Omega` |

Artifacts: `/tmp/qrh-verify/build.all.log`, `/tmp/qrh-verify/check/{challenge,solution}.out`, `.types`; final olean
`Nonvanishing.olean` sha256 `adeff7db7211767b3a3437958cecce7229185c998c8ac909a7013ec75d499fdc`.

Build note: for about one minute, two `lake build` processes ran at the same time in the same tree (a `pkill` pattern
missed the first one). Both were stopped. All build outputs written in that window (1056 files) were deleted and rebuilt
by a single process. The final up-to-date check passed.

## 3. What was NOT done (limits of this check)

- The official `comparator` tool was **not** run. It needs `landrun` (a Linux Landlock sandbox, unavailable on macOS) and
  `lean4export`. Its two checks, statement equality and permitted axioms, were reproduced by hand as above.
  `enable_nanoda` is `false` in the challenge JSON, so the official check does not use an independent kernel either.
- No independent kernel replay was run (lean4checker / nanoda). Trust rests on the Lean 4.34.1 kernel, which checks every
  declaration during compilation (no kernel-skip options appear in the closure), on Mathlib's definitions, and on the
  build toolchain.
- The other 003 comparator statements were not checked: `HeckeSevenEighths` (Hecke L over Q(√−3)) and `SiegelZeros`
  (uniform `1−β ≥ c/log q`). Only the zeta and Dirichlet 7/8 theorems were checked.
- The papers were not refereed. Only the abstracts, introductions, proof overview and TOC were read.

## 4. Method of the paper (7/8 manuscript), in 10 lines

1. Work over F = Q(√−3) and prove the zero-free half-plane for all finite-order Hecke L-functions over F. Dirichlet L
   (and ζ) follow because L_F(s, χ∘N) = L(s,χ)L(s,χχ₋₃) up to finitely many nonvanishing Euler factors.
2. Analytic core (§2): a "continuation from a common signal" criterion. If a character sum has a power-saving direct
   bound and also equals a Mellin integral of Z^{C(s)}·H(s)/L_F^S(s,η) (with |H−1| ≤ 1/2), then 1/L continues past the
   rightmost zeros. This is applied to β* = sup of real parts of zeros over the whole primitive family.
3. The sum ("probe") averages Fourier coefficients of Kubota's cubic metaplectic theta function (Patterson's
   coefficients, cubic Gauss sums), completed with full cube factors cn³, against sextic residue characters and the
   target η.
4. Two exact representations: (a) theta reflection, a variant of the Dunn–Radziwiłł transformation that keeps the
   character zeros on non-units, and (b) Poisson summation in the averaging variable. The u = 1 Poisson row contains
   1/L_F(s,η).
5. Inputs: the quadratic, cubic and sextic large sieves (Heath-Brown; Goldmakher–Louvel; Blomer–Goldmakher–Louvel
   recursion; a sextic version proved in the paper), a planar additive large sieve, Hecke functional equation, prime
   counting in a fixed ray class (Thorner–Zaman), smooth Mellin/contour estimates.
6. Zero detector (truncated-inverse mechanism). A row with a zero above a fixed real-part floor yields a large inverse
   (Möbius-twisted) Dirichlet polynomial and a large plain polynomial. Their moments bound the number of such rows.
7. Stage I (balanced scales Z^{1/2}) closes with C_I(s) = s − 2/3 and gives 11/12. Stage II adds prime compensation,
   asymmetric scales and two recursive moment inductions (inverse with prime marks, product of two plain polynomials).
   It gives C_II(s) = s − 11/16 and closes at 7/8.
8. The whole family must be handled even for ζ, because the Poisson rows introduce finite-order Hecke twists of the
   target. The bound is a single σ₀ that is uniform in character, conductor and height.
9. Possible gaps (paper level): none identified at this reading depth. The prose cites Dunn–Radziwiłł cusp expansions,
   Patterson's coefficient formula and Thorner–Zaman as inputs. In the Lean proof none of these can be black-boxed: the
   axiom set is standard, so every input is proved in Lean or Mathlib (the tree contains `Eisenstein/`, `Cusp/`,
   `Reflection/` and `Poisson/` developments).
10. The 11/12 writeup (paper2, human-edited) is the stage-I argument alone. It claims Landau–Siegel exclusion and
    corollaries (Vinogradov least-nonresidue, idoneal numbers); those corollaries are paper-level only and not checked here.

## 5. Bearing on this project (pointer only; no new Λ computation here)

The sibling survey (`formalization/external/openai-math-survey.md`) gives two results conditional on family 003:
Λ ≤ 9/32 from de Bruijn's Theorem 13 with |Im z| ≤ 3/4, and the barrier band start q0 = 9/16 + 2·10⁻⁶. For the
ζ-statement, that condition now reduces to trust in the Lean 4.34.1 kernel, Mathlib's `riemannZeta`, and the toolchain.
The official comparator run and an independent kernel replay are still outstanding (§3). The survey's header line
"solution module was not compiled and `#print axioms` was not run" is superseded by this note for the two theorems listed
in §1.

## 6. Resume / re-check instructions

```
cd /tmp/qrh-verify/lean                       # lake update already done; outputs in .lake/build
LEAN_NUM_THREADS=4 lake build +OAI.NumberTheory.DirichletL.Nonvanishing   # should report up to date
lake env lean /tmp/qrh-verify/check/SolutionType.lean   # statement dump + #print axioms
lake env lean /tmp/qrh-verify/check/ChallengeType.lean  # challenge statement dump (Mathlib only)
# Next steps: on Linux, install comparator + landrun + lean4export and run
#   lake env comparator ComparatorChallenges/QuasiRiemannHypothesis.json
# and optionally lean4checker on OAI.NumberTheory.DirichletL.Nonvanishing for an independent kernel replay.
```

/tmp is not persistent. If `/tmp/qrh-verify` is gone, re-clone github.com/openai/math and repeat §2. Cold timings:
about 10 min for `lake update` plus the cache download, and about 1.9 h for the build under load average 40–150 on 18 cores.
