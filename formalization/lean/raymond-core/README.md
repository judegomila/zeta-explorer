# raymond-core: Lean 4 formalisation of three inputs to Raymond's decreasing-barrier chain (Route 10)

Date: 2026-10-07. Lean 4.34.1, Mathlib `d13f23b7` (the same commit as the local openai/math build),
LeanCert `7f91b6eb`. PT Λ ≤ 0.2 is still the accepted benchmark. RH is open. This package proves
**no new bound on Λ**. It machine-checks three of the lemmas that the conditional QRH values
(`src/data/openai-math-integration-2026-10-08.js`) inherit from Raymond's chain. Everything else in
the chain is unformalised; see "Not formalised" below.

## What is proved in Lean (no `sorry`; axioms checked with `#print axioms`)

Every theorem listed here prints only `propext`, `Classical.choice` and `Quot.sound` under
`#print axioms` (`scripts/AxiomsCheck.lean`; output recorded in `axioms-output.txt`). In this table, "hypothesis" means an explicit argument of
the theorem. Nothing is declared as a global `axiom`.

| Paper item | Lean name | What is formalised | Hypotheses (not formalised) |
|---|---|---|---|
| Lemma CG, covering identity (`cg-monotonicity.md` §1–2) | `RaymondCore.CG.covering_identity` | The Möbius/covering identity for an arbitrary finite index set and real weights `a_p`: `Σ_{S⊆P} (−1)^{|P∖S|} exp(t/4((ℓ+Σ_S a)² + Σ_{P∖S} a²)) = exp(t/4(ℓ²+Σ_P a²)) · Σ_{covers} Π w` | none |
| Corollary CG1 (joint monotonicity) | `D_nonneg_mono`, `Cg_nonneg_mono` | `0 ≤ C_g(u′,t′) ≤ C_g(u,t)` for `g ≤ u′ ≤ u`, `0 ≤ t′ ≤ t`, for **every squarefree g** (the paper only needs `g ∣ 30`) | none |
| `C_g` = Raymond's divisor sum | `Cg_eq_D` | `Σ_{d∣g} μ(d) β_d(t) b_t(u/d)` equals the abstract sum with `a_p = log p`, `ℓ = log(u/g)` (`Nat.divisors`, `ArithmeticFunction.moebius`) | none |
| Corollary CG2 (Raymond's statement, G0-a) | `cn_nonneg_mono` | `0 ≤ c_n(t′) ≤ c_n(t)` for every `n ≥ 1`, `0 ≤ t′ ≤ t`, where `c_n(t) = Σ_{d∣(n,30)} μ(d) β_d(t) b_t(n/d)` | none |
| Lemma R, pointwise step | `RaymondCore.LemmaR.reBeta_bound` | `|Re(α + (t/2)αα′) − L/2| ≤ (10 + t(L/2+1))/ξ` | the three AF (4.6) estimates, as hypotheses |
| Lemma R, integration step | `lemmaR_sharp`, `lemmaR` | `|θ − aL(x)/2| ≤ a(10+t(L(x−a)/2+1))/(x−a) + a²/(8(x−a))`. This is sharper than the paper's `a²/(4(x−a))`. `lemmaR` gives the paper's `ε_R` | `Φ′(ξ) = Re β_t(ξ)` on `[x−a, x+a]`; AF (4.6) on `[x−a, x+a]`; `0 ≤ t ≤ 20`; `x − a > 0` |
| Lemma R, numerical claim | `epsR_lt`, `lemmaR_paper` | `ε_R < 10⁻¹⁰` for `X ≥ 6·10¹²`, `0 < a < 2`, `x ≥ X − 2 + a`, `0 ≤ t ≤ 41/250` (any `κ ≥ 0`; `lemmaR_paper` uses `L = log(ξ/4π)`) | as above |
| Substitution lemma | `RaymondCore.Substitution.substitution` | If `ζ(s) ≠ 0` for `Re s > θ` (`θ ≥ 1/2`), then every zero of `H_t` (`t ≥ 0`) has `Im(z)² ≤ max((2θ−1)² − 2t, 0)` | the zero-free half-plane `ZetaZeroFreeRight θ` |
| same, unclamped form | `substitution'` | `Im(z)² ≤ (2θ−1)² − 2t` for `0 ≤ 2t ≤ (2θ−1)²` | same |
| Conditional de Bruijn bound | `Lambda_le_of_zeroFree` | `Λ ≤ (2θ−1)²/2`, where `Λ` is LeanCert's de Bruijn–Newman constant of the concrete `H_t` | same |
| θ = 1 instance | `Lambda_le_half'` | `Λ ≤ 1/2`, unconditional (Mathlib `riemannZeta_ne_zero_of_one_lt_re`) | none |
| θ = 7/8 instance | `RaymondCore.Instance78.H_zero_strip_78`, `Lambda_le_nine_thirtyseconds` (file `RaymondCoreOAI/Instance78.lean`) | `Im(z)² ≤ max(9/16 − 2t, 0)` for zeros of `H_t`, and `Λ ≤ 9/32` | the openai/math theorem `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`. `#print axioms` on the two 7/8 theorems, run through the openai/math workspace, gives only the standard three, so the openai/math proof is included in that check. The result is claimed by an internal OpenAI model and has not been peer-reviewed |

### Where the substitution-lemma ingredients come from

The heavy analytic content comes from LeanCert's `LeanCert.Analysis.DBN` (Lean-checked, no `sorry`
in the modules used):

* `H` is the concrete heat integral `∫_0^∞ e^{tu²} Φ(u) cos(zu) du` with Riemann's kernel `Φ`.
* `H_zero_eq_riemannXi` gives `H_0(z) = ξ(1/2 + iz/2)/8`.
* `H_forward_strip` is de Bruijn's squared-strip contraction for the actual `H_t`.
* `riemannXi_one_sub` is the functional equation (from Mathlib `completedRiemannZeta₀_one_sub`).
* `real_zeros_iff_Lambda_le` gives the threshold characterisation of `Λ`.

`RaymondCore.Substitution` adds three things:

1. The passage from zeros of `ζ` to zeros of `ξ` on `Re s > θ`, including `s = 1`, via Mathlib's
   `riemannZeta_def_of_ne_zero`.
2. The reflection `1 − θ ≤ Re ρ ≤ θ`.
3. The change of variable `z = −2i(s − 1/2)`, with `Re s = (1 − Im z)/2`, and the assembly.

### Formalisation choices that differ from the paper

* **CG atoms.** The covering identity is stated with *ordered* pair atoms `(p,q) ∈ P.offDiag`,
  with weight `exp(t a_p a_q/4) − 1`. The paper uses unordered edges with weight
  `exp(t a_p a_q/2) − 1`. Since `1 + r_pq = (1 + r′_pq)(1 + r′_qp)`, the two expansions agree,
  and both have nonnegative, nondecreasing weights. CG1 and CG2 are proved exactly as stated.
* **CG hypotheses.** `C_g` is proved monotone in real `u ≥ g` for every squarefree `g`, not
  only `g ∣ 30`.
* **Lemma R's `L`.** The general theorems take `L(ξ) = log ξ − κ` for any real `κ`, and
  `epsR_lt` needs `κ ≥ 0`. `lemmaR_paper` specialises to `κ = log 4π`, i.e.
  `L = log(ξ/4π)` as in AF.
* **Lemma R's inequalities.** The paper's strict AF (4.6) inequalities are weakened to `≤`. The
  paper assumes "Φ continuous". The Lean statement instead takes `HasDerivAt Φ (Re β_t)` at every
  point of the closed interval, which is how the paper's proof uses `Φ`.
* **Substitution, large t.** The bound is stated with `max(·, 0)`. The unclamped form
  `Im(z)² ≤ (2θ−1)² − 2t` is false for `t > (2θ−1)²/2`, where the right side is negative; there
  all zeros are real (`H_real_zeros_of_le`).

## Not formalised (stays axiomatised, paper-only or unproved)

The following enter the conditional Λ values and are **not** in Lean:

* **AF (4.6).** The Stirling-type bounds `|α − (L/2 + iπ/4)| < 10/ξ`, `|α′| < 2/ξ`,
  `|α| < L/2 + 1` for the logarithmic derivative of `M_t`, on `ξ ≥ X − 4`.
* **The identity `Φ′ = Re β_t`.** This is the derivative of `2 Im log M_t((1+iξ)/2)`, taken along
  a continuous branch. Both enter Lemma R only as hypotheses.
* **G0-c: the main paper's lemmas.** Lemma 2 (surplus identity), Lemma 3 (paired phases),
  Theorem 4 / 4′ (two-probe joint floor).
* **G0-d / G0-d′: AF Part I §§2–12.** This covers the wall/Abel steps, the one-point input
  (OP1)–(OP4), the moment identity, the time-Taylor bound, the activation envelopes, the
  assembly, the strict-entry check of §11 and the X-transfer.
* **The decreasing-barrier ODE/iteration.** This includes its 60,675-substep numerical
  certificate (ball arithmetic in Python), the barrier floors and all Λ values (0.1177…, 0.1288…,
  0.1493…).
* **The zero-free half-plane for θ < 1.** It is taken from openai/math as an external Lean result,
  not re-proved here.

So in the conditional QRH bound, this package machine-checks three inputs:

* G0-a (Lemma CG);
* the analytic core of Lemma R, conditional on AF (4.6) and Φ' = Re β_t (both explicit hypotheses;
  the paper assumes only that Φ is continuous);
* the start substitution, from the half-plane to the squared strip `q0 = (2θ−1)²` at time 0 and
  forward in t.

It does not check the barrier chain that turns `q0` into a Λ value.

**Referee notes (internal referee pass, recorded 2026-10-14).** (1) The referee's independent runner
`tmp/routes-b9-ref10-lean/run.sh` completed on 2026-10-07 23:28 once load fell below 40: `lake build RaymondCore`,
from-scratch re-elaboration of CG.lean, LemmaR.lean, Substitution.lean, the independent statement file
`Stmt.lean` (rfl unfoldings of Phi, H, Lambda, riemannXi, cn) and `check-instance78.sh` all exit 0; all 18
`#print axioms` lines (13 RaymondCore, 3 LeanCert DBN, 2 Instance78) read [propext, Classical.choice, Quot.sound]
(`tmp/routes-b9-ref10-lean/run.log`). (2) The substitution lemma is fully proved as a statement about the standard
(Polymath) H_t; whether it is exactly the input Raymond's chain uses (q0 = (2θ−1)² + 2e-6 and the AF §11
strict-entry check) is still an open referee item (src/data/openai-math-integration-2026-10-08.js). (3) Name trap:
`/tmp/qrh-verify/lean/ComparatorChallenges/QuasiRiemannHypothesis.lean` declares the same name
`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` with a `sorry` proof; Instance78.lean imports the proved
`OAI.NumberTheory.DirichletL.Nonvanishing`. Any file importing the ComparatorChallenges module would pick up
`sorryAx`; always run `#print axioms`. (4) Fragility: most `.lake/packages` are symlinks into
`/tmp/qrh-verify/lean`, which is not a git repository, so no commit pins the OAI source the 7/8 check ran against.

## Build

```sh
cd formalization/lean/raymond-core
# Reuse an existing Mathlib d13f23b7 build (e.g. the openai/math workspace) by symlinking packages:
Q=/tmp/qrh-verify/lean/.lake/packages
mkdir -p .lake/packages
for p in mathlib plausible LeanSearchClient importGraph proofwidgets aesop Qq batteries Cli; do
  ln -sfn $Q/$p .lake/packages/$p; done
rsync -a --exclude .lake $Q/leancert/ .lake/packages/leancert/   # LeanCert DBN is built locally
lake build                                  # builds the LeanCert DBN modules + RaymondCore
lake env lean scripts/AxiomsCheck.lean      # prints axioms of every main theorem
scripts/check-instance78.sh                 # θ = 7/8 instance against the openai/math workspace
```

Without a local Mathlib build, delete the symlinks and run `lake exe cache get && lake build`.
`lake-manifest.json` pins the same revisions.

The build logs and axiom outputs for this run are in `tmp/routes-b9-r10-lean/`:

* `build-deps.log`: the sequential build of the 40 LeanCert modules, with no failures.
* `build-main.log`: the `lake build RaymondCore` run, exit 0, with no warnings or errors.
* `axioms.log`: the 14 main theorems, each `[propext, Classical.choice, Quot.sound]`.
* `inst78.log`: the two θ = 7/8 theorems, with the same three axioms.
