# Permutation-calculus / twistor Lean formalizations (Aristotle wave 1)

Five Aristotle-generated Lean 4 projects (2026-08-28) from the
permutation-architecture paper (P1, "Permuting the Zeta Twin Ladder",
revised) and the twistor framework paper (P2, "twistor-lift-zeta-twin-ladder").
Verification record, applied per project: `lake build` green (toolchain
v4.28.0, mathlib per pinned `lake-manifest.json`); zero
`sorry`/`axiom`/`native_decide`; every theorem's `#print axioms` shows only
`[propext, Classical.choice, Quot.sound]`; independent statement-faithfulness
review vs both PDFs: **all five FAITHFUL**, every hypothesis package checked
satisfiable (non-vacuous). Each directory keeps Aristotle's own
`ARISTOTLE_SUMMARY.md`.

| Directory | Source | Main verified results |
|---|---|---|
| `permutation_defect/` | P1 §3.2 Lemma 3.1, eq. (6) | `norm_permProd_sub_one_le_sum` : for contractions `T : Fin m → (H →L[ℂ] H)` and any permutation π, `‖permProd T π − permProd T 1‖ ≤ ∑ p ∈ invSet π, ‖T p.1 * T p.2 − T p.2 * T p.1‖`; weighted noncontractive form `norm_permProd_sub_one_le_sum_weighted` (factor `∏_{k∉{i,j}} ‖T k‖`); combinatorial core `exists_swapChain_permWord` (bubble chain hits each inversion exactly once). Conventions (`permWord`, `invSet`) are pinned by machine-checked examples; the bound is convention-independent. |
| `antihermitian_strip/` | P1 §2.3 eq. (4), Prop 2.1 | `im_eq_inner_antiHermPart` (Rayleigh identity `x.im·‖v‖² = re⟨v, K v⟩` for a kernel vector); `abs_im_le_of_represented` (`|Im x| ≤ η` for represented zeros, `η ≥ sup‖K(x)‖`); `deBruijnNewman_le_of_global_representation` (`Λ ≤ t + η²/2`) — the last is by design a thin conditional wrapper: (G) global representation and (S) the de Bruijn strip contraction enter as explicit named hypotheses, exactly as in the paper. |
| `five_shell_identity/` | P1 §4.3–4.4 eqs. (11)–(12) | `five_shell_identity` : **unconditional** — for all `N`, `A : ℂ`, `c`, `E97 N A c = (1−A)·L N (Y c 4) − A·∑_{g=1}^{4} L N (Z c g)`, with the 25 primes ≤ 97 in decreasing order (completeness proved), cuts (0,5,10,17,25), and the disjoint-Fourier-support orthogonality `ip_Z_Z`, `ip_Z_Y4` proved as lemmas. |
| `section47_chain/` | P1 §4.7 eqs. (21)–(23), Thm 4.1(ii) | `theorem4_chain` : from (H0)–(H6) — including (H3) `Rex ≤ m − ‖A‖·ε_tr` and the strict open weld (H4) `‖E‖ < Rex` — derives `HasWinding hb 0` (a real continuous-logarithm predicate, derived not assumed) and concludes `Theorem41ii Ht0` with the exact row constants (t₀ = 24727519/2·10⁸, y₀ = 1809/10⁴, X = 6000000185827). Unconditional pieces: `prop2_avoids`, `prop3_wind_quotient_zero`. Referee caveat: the `hb`↔`Ht0` link lives inside (H6), the paper's own argument-principle packaging. |
| `twistor_heat_compat/` | P2 §6.2 Lemma 6.1, Def 5.1 eq. (12) | `heat_compat_apply` / `heat_compat_on_range` / `heat_compat_comp` : from `R∘A₊ = A₋∘R`, `I_K∘F₊ = F₋∘R`, `Â_±∘F_± = F_±∘A_±`, conclude `I_K Â₊ = Â₋ I_K` on `range F₊`. NOTE: the original ticket's relations ("RA = AR + I_K", "F₊ = F₋R") were mis-transcriptions; these are the paper's actual relations. Stated over modules over a commutative ring (paper's ℂ case is an instance). |

Known assumed inputs across the wave (referee checklist): (S) the de Bruijn
strip contraction and (G) global zero representation (antihermitian_strip);
the §4.7 open weld `‖E₉₇‖ < R_ex` and the (H6) argument-principle packaging
(section47_chain) — the latter can now be discharged against
`ArgumentPrinciple.windingRect_eq_sum_analyticOrder` in the candidate-audit
repo's `lean/aristotle/argument_principle/` (PR #30). Everything else in
this wave is unconditional.

Exact verbatim theorem signatures for app-side quoting are in each
directory's `ARISTOTLE_SUMMARY.md` and the project source; the faithfulness
review's per-job signature extraction was delivered with the wave report.
