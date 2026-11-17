# RH push 2026-11-16/17: fleet lanes

Internal research checkpoint. Not peer reviewed. No claim about RH and no new bound on zeros.

**Start with OBSTRUCTION_MAP.md**: one row per closed route (118 rows) with where it stops, which control defeats it, the list of proved results worth keeping, the directions not covered, and an index of referee-broken claims. 19 lanes in it are unrefereed and marked so.

Ledgers: SYNTHESIS.md (fleet 1, rounds 1-2), SYNTHESIS_BASELINE.md (b-* lanes), SYNTHESIS_R3.md (r3-* lanes, 7/8 architecture and its limit), SYNTHESIS_GEOMETRIC_ARITHMETIC.md (h-* lanes), CRITIC_R1.md. The first geometric fleet (g-* lanes) is in PR 59; the first direct attacks are in PR 60; the equivalence and Pick results are in PR 58.

Slug prefixes: (none) fleet 1 round 1; r2- fleet 1 round 2; r3- round 3; b- baseline avenues; sq- square-root (Hankel/Krein) lane; stack- combination lanes; h- geometric-arithmetic lanes; lit- literature; mb- compute-server job (stopped incomplete).

| Lane | Referee | First verdict line |
|---|---|---|
| b-alpoge-furman | refereed |  |
| b-codex-energy-lanes | refereed |  |
| b-codex-zero-channels | refereed |  |
| b-conjecture-22-1 | refereed |  |
| b-dyson-defect | refereed |  |
| b-escape-law | refereed |  |
| b-euler-detector | refereed |  |
| b-lacunary-threshold | refereed |  |
| b-lean-eq48 | refereed |  |
| b-lehmer-lower | refereed |  |
| b-mvcap-function-side | refereed |  |
| b-route-m-first-moment | refereed |  |
| b-route-p-motherbox | refereed |  |
| b-route-p-recert | unrefereed |  |
| b-sg1c-r1-transfer | refereed |  |
| b-toeplitz-beyond | refereed |  |
| b-volterra-norm | refereed | Slug: b-volterra-norm. Date: 2026-11-16. Verdict: precise obstruction (the avenue is closed; the statement is decided unconditionally and carries no z |
| cc-latest | refereed | Verdict class: partial result (proved structural statements) plus "nothing new applies" for the Sonine wall. |
| dh-separator | refereed |  |
| flow-euler-defect | refereed | Verdict: precise obstruction. The Euler defect of H_t exists, is exact and explicit (Prop. 1-2), and it does |
| h-hecke-channels | refereed | 7. Verdict by question |
| h-hecke-torus-symmetry | refereed |  |
| h-klein-fricke | refereed |  |
| h-local-sign-change | unrefereed |  |
| h-metaplectic-spin | refereed | 11. Verdict by task item |
| h-seven-eighths-in-bridge | refereed | (cubic-r2-conductor-verdict). So among covers of the three tori with extra automorphisms only the hexagonal one |
| h-tnr-geometric | refereed |  |
| h-twistor-penrose | refereed |  |
| ideation-panel | refereed | Verdict. Twelve angles are listed and ranked. None is in the atlas (PR #27), the three 2026-11-01 syntheses, the |
| jensen-hyperbolicity | refereed |  |
| lambda-from-halfplane | refereed |  |
| li-coefficients | refereed |  |
| lit-dedekind-qrh | unrefereed |  |
| mb-lean-replay | unrefereed | Verdict: the definition is faithful by reading, conditional on those four lemmas being kernel-checked |
| mollifier-halfplane | refereed | Verdict: precise obstruction. The 7/8 half-plane and its cubic-row inputs do not lengthen the Levinson mollifier |
| nyman-baez-duarte | refereed | Verdict: precise obstruction, with one proved theorem. The decay exponent of the weighted distance is exactly |
| r2-classgroup-homotopy | refereed |  |
| r2-ff-tro6-complete | refereed |  |
| r2-lambda-reopt-run | refereed |  |
| r2-lambda-tpos-floors | refereed |  |
| r2-lean-kappa-1318 | refereed | Verdict: both definitions match the standard ones. The identification at `t = 0` and the threshold property are |
| r2-lowpass-cone | refereed | 7. Verdict and the three weakest steps |
| r2-pick-euler-entry | refereed | Verdict (precise obstruction) |
| r2-tro6-nonpolar-scale | refereed | Verdict: partial result. One exact identity (PROVED-rel manuscript (4.7)) and measurements. TRO6^♮(η) is not |
| r2-tro6-polar-theorem | refereed | Verdict: partial result. The polar law of `tro6-spectral` §3 / `tro6-numerics` item 2 is now a statement with a |
| r2-tro6-type12-split | refereed | Verdict: precise obstruction. TRO6^♮(η) is not proved for any η > 0. θ = 7/8 unchanged. RH open. NO QED. |
| r2-xs-lowestimate-audit | refereed | / # / step / what was done / verdict / |
| r2-zf-critical-density | refereed | Verdict: precise obstruction. No count saving tau > 0 is obtained. B_flat = 0.874886647 stands as the infimum of |
| r2-zf-gm-inverse-witness | refereed | Verdict: precise obstruction. No new count, no new abscissa. 7/8 stays the unconditional abscissa (openai/math |
| r2-zf-paired-rows | refereed | Verdict: precise obstruction. Conjugate-paired product rows give no abscissa below 7/8: the paired abscissa is |
| r3-critical-count | refereed | Verdict: precise obstruction. No count saving tau > 0 is proved. B_flat = 0.874886647 (unrefereed) is unchanged; |
| r3-higher-rows-dual | refereed | Verdict: precise obstruction. No abscissa is claimed. The individual dual exponent is a = 3 (r = 4, over Q(i)) and |
| r3-lemma181-a | refereed | Verdict: precise obstruction, with one new proved statement (Theorem R). |
| r3-lemma181-b | refereed | Verdict: precise obstruction. No new abscissa. B_flat = 0.874886647 (unrefereed) is unchanged; 7/8 remains the |
| r3-method-limit | refereed | Verdict: precise obstruction. The infimum is not 1/2. For the sextic architecture with every ingredient at its |
| r3-nonpolar-numerics | refereed | Verdict: partial result (measurements only). TRO6^♮(η) is not proved for any η > 0. No abscissa is claimed; |
| r3-nonpolar-proof | refereed | Verdict: precise obstruction. The proposed route (bound each twisted first moment in the c-aspect, then sum |
| r3-tnr-control | refereed |  |
| screw-canonical | refereed | 6. Verdict and the three weakest steps |
| sq-canonical-det | refereed | 8. Verdict, DH statement, weakest steps |
| sq-causal-cascade | unrefereed |  |
| sq-hankel-traces | unrefereed | 7. Verdict and what the identities give |
| sq-krein-index | unrefereed |  |
| stack-antibridge | unrefereed | / 8 / PR 49 `README.md`:1, 12-16; `thinking/decisions/2026-11-09-torus-heat-antibridge.md`:17-18, 24, 56-57 / Title "the opposite bridge"; question "u |
| stack-combinator | unrefereed | verdicts of twist-rigidity, support-rigidity, flow-euler-defect and pick-induction directly, merged the 236 rows |
| stack-feasibility | unrefereed |  |
| stack-quantum-gap | unrefereed |  |
| support-rigidity | refereed | Verdict: precise obstruction. The support constraints imply zero information in exactly one direction, and it is |
| sym-power-positivity | refereed | Verdict: precise obstruction. No improvement of any zero-free region. NO QED on RH. |
| tro6-functionfield | refereed |  |
| tro6-numerics | refereed | Verdict: partial result (measurements only). TRO6^♮(η) is not proved for any η > 0. θ = 7/8 unchanged. RH open. |
| tro6-period | refereed | Verdict: precise obstruction. No η > 0 is proved. One exact identity is new (Lemma L, PROVED and checked). |
| tro6-shifted-conv | refereed | Verdict: precise obstruction. No eta > 0 is proved. NO QED. The method's exponent is eta = 0 at best (it |
| tro6-sieve | unrefereed | Verdict. TRO6^♮(η) is not proved for any η > 0. The zero-free abscissa stays 7/8 (itself from the unrefereed |
| twist-rigidity | refereed | Verdict: precise obstruction. No statement about zeros of zeta is obtained. NO QED on RH. |
| vertical-statistics | refereed | Verdict: precise obstruction, with two small conditional by-products. No density estimate becomes N(σ,T) = 0 for |
| zf-audit-inputs | refereed | modules did not finish one batch in 600 s and was stopped; it produced no verdict. The full closure was not replayed. |
| zf-hecke-all-fields | refereed |  |
| zf-higher-rows | refereed | Verdict: precise obstruction. No row order and no mixture of orders gives an abscissa below |
| zf-large-values | refereed | Date 2026-11-16. Internal working note, not refereed. Verdict: precise obstruction, no new abscissa. |
