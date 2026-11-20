# Existing repository crosswalk

This checkpoint is additive. It does not replace the following existing
modules, and no files from draft PRs 31-39 are copied into it.

| Topic | Existing authoritative path | Relationship |
|---|---|---|
| Overall status and twin-ladder caveats | `/README.md` | Preserve the “RH not proved” status and the distinction between a heuristic circuit picture and the rigorous shift/de Branges layer. |
| Shift/de Branges bridge | `/src/data/shift-bridge-positivity-section.js`, `/src/pages/ShiftBridgePositivityPage.jsx` | Upstream corrected bridge framework; the theta/Fisher work is downstream. |
| Shear-kernel measure correction | `/formalization/paper/shear_kernel_measure_audit_2026-08-28.md`, `/src/data/shear-kernel-repair-2026-08-28.js`, `/scripts/shear-kernel-audit.mjs` | Authoritative correction: the ordinary `u=v` diagonal has two-dimensional measure zero; use the paired `(r,s)` identity. |
| Finite Arb/ACB Gram backend | `/rigorous/shear_gram/` | Independent finite-Gram infrastructure with `finiteGramOnly: true`; it is not the v18 theta-moment/Fisher package. |
| Historical twin-ladder program | `/research-inputs/twin_ladder_consolidated_v52.pdf`, `/src/data/twin-ladder-paper-roadmap.js` | Historical companion; cross-reference rather than copy. |
| Existing Fisher/Pinsker UI modules | `/src/math/information-theory.js`, `/src/data/imp-35556-gtrue-ecoll-dimensional-comparability.js`, `/src/data/imp-35655-reverse-pinsker-bretagnolle-huber-gtrue-lower-bound.js` | These concern ladder/GUE-spacing information diagnostics, not the new theta-orbit `2/17`, `4/867`, or `I' <= -14 I` results. |
| Newman/heat-flow scaffolding | `/formalization/lean/DeBruijnNewman/`, `/formalization/lean-mathlib-probe/`, `/src/math/rodgers-tao-de-bruijn-newman.js` | Existing formalization is partial and contains stated analytic gaps; the new compensated evolution does not retroactively fill them. |
| Draft PR 38 | `research-checkpoints/vortex-blocker-reduction-2026-11-01/` on `origin/pr-38` | Related vortex reduction; no copied files. |
| Draft PR 39 | `research-checkpoints/zeta-riblet-phase-budget-2026-11-02/` on `origin/pr-39` | Adjacent undeformed phase budget; no copied files. |

## Stale historical wording warning

`src/data/hidden-square-program-section.js` still contains historical wording
that treats the strict `u=v` diagonal as a positive ordinary-integral channel.
That sentence is withdrawn. The formal measure audit above and the root README
are authoritative; this checkpoint never uses the stale diagonal argument.

