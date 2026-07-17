# Formalization

Lean 4 formalization of parts of the de Bruijn–Newman / Riemann-Hypothesis circle.

**Headline result:** the polynomial de Bruijn / Pólya–Schur multiplier theorem is fully proved,
`sorry`-free and axiom-clean — see **[POLYNOMIAL_DE_BRUIJN.md](./POLYNOMIAL_DE_BRUIJN.md)**.

> Honest scope: this is a *polynomial* theorem and machine-checked scaffolding — **not** RH and
> **not** `Λ ≥ 0`. Platt–Trudgian `Λ ≤ 0.2` remains the rigorous SOTA. In-app summary: `/formalization-status`.

## Two projects (why)

| Dir | Toolchain | Role |
|---|---|---|
| **`lean-mathlib-probe/`** | Lean **v4.22.0** + mathlib | **Canonical / analytic.** Holds the proved polynomial theorem (`MathlibBridge.lean`) and the entire-function lift work (`EntireLP.lean`). All new work goes here. |
| `lean/` | Lean v4.9.0, core only | Historical. The original scaffold + the finite-dimensional order/real-rooted shadows, from before mathlib was usable on this host. Kept intact for provenance; superseded by the probe. |

**Why two:** the Lean v4.9.0 mathlib `cache` binary aborts on macOS 26.x with
`dyld: __DATA_CONST segment missing SG_READ_ONLY flag` — a *linker* incompatibility (not a
signature one, so `codesign` cannot fix it). Toolchain **v4.22.0** ships a macOS-26-compatible
cache binary (`lake exe cache get` downloads all oleans cleanly), so all analytic work uses it.
The core project's results (the DBN order-lemmas, finite real-rooted shadows) were re-proved in the
probe against genuine real predicates and generalized (e.g. general-degree derivative-real-rootedness,
true over ℝ though false over the old ℤ model).

## Build & verify

```
cd formalization/lean-mathlib-probe
lake build                       # exits 0
echo 'import MathlibBridge
#print axioms MathlibBridge.heat_preserves_LP' | lake env lean /dev/stdin
# → [propext, Classical.choice, Quot.sound]   (no sorryAx)
```

`.lake/` (multi-GB mathlib cache + build artifacts) is gitignored; only sources + the pinned
`lake-manifest.json` are tracked.

## Status of the main statements
- `heat_preserves_LP` (polynomial `e^{−tD²}` preserves real-rootedness) — **proved, sorry-free.**
- `hermitePoulain_shift` (`p ↦ p′+c·p` preserves real-rootedness, incl. root-at-infinity) — **proved.**
- `isLaguerrePolya_heat_of_flow` (`EntireLP.lean`) — the finite→entire **bridge**: any flow that
  restricts to `heatOp` on polynomials and is continuous for locally-uniform convergence preserves
  the Laguerre–Pólya class — **proved, sorry-free**, routing through the polynomial theorem.
- `heat_preserves_LP_entire` (`EntireLP.lean`) — **proved from the bridge**, modulo two precisely
  *named axioms* (not `sorry`s): `heatFlow_poly` (flow = `heatOp` on polynomials) and
  `heatFlow_continuous` (loc-unif continuity). `#print axioms` shows exactly these.
- `deBruijn_monotone`, `exists_dbn_constant`, `rodgers_tao` — **stated, with precise `sorry`s /
  named inputs**. The genuine remaining distance now lives in *building entire-function analysis
  mathlib does not have*: order/genus + Hadamard factorization, the complex Gaussian convolution
  discharging the two `heatFlow` axioms, the real `Ξ` as a loc-unif limit of real-rooted polynomials,
  and the de Bruijn differential inequality (→ Rodgers–Tao `Λ≥0`).
