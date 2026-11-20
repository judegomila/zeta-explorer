# RH push 2026-11-16/17: fleet lanes

Internal research checkpoint. Not peer reviewed. No claim about RH and no new bound on zeros.

**Start with OBSTRUCTION_MAP.md**: one row per closed route (118 rows) with where it stops, which control defeats it, the list of proved results worth keeping, the directions not covered, and an index of referee-broken claims. 19 lanes in it are unrefereed and marked so.

Ledgers: SYNTHESIS.md (fleet 1, rounds 1-2), SYNTHESIS_BASELINE.md (b-* lanes), SYNTHESIS_R3.md (r3-* lanes, 7/8 architecture and its limit), SYNTHESIS_GEOMETRIC_ARITHMETIC.md (h-* lanes), CRITIC_R1.md. The first geometric fleet (g-* lanes) is in PR 59; the first direct attacks are in PR 60; the equivalence and Pick results are in PR 58.

Slug prefixes: (none) fleet 1 round 1; r2- fleet 1 round 2; r3- round 3; b- baseline avenues; sq- square-root (Hankel/Krein) lane; stack- combination lanes; h- geometric-arithmetic lanes; lit- literature; mb- compute-server job (stopped incomplete).

Added 2026-11-17: SYNTHESIS_AUTOMATIC_POSITIVITY.md (ap-* lanes: Lee-Yang, squares, Hodge index, global bridge, order 2), SYNTHESIS_POSITIVITY_RESIDUALS.md (res-* lanes), SYNTHESIS_OVERNIGHT.md and OVERNIGHT_LOG.md (n1- to n4- lanes: four rounds of new ideas screened against the obstruction map), and the compute-server lanes (box-*: Lee-Yang truncation search, prime-variable stability, Hodge-index signatures, Riesz order-2 decision, cost of extending verified height). None gives a statement about zeros of zeta.

| Lane | Referee | First verdict line |
|---|---|---|
| ap-box-experiment | refereed | 1. The window verdicts are local: PASS means no off-axis zero with /Im z/ <= Y and /Re z/ <= T. `thalf` at |
| ap-global-bridge | refereed |  |
| ap-hodge-index | refereed | Verdict: precise obstruction. RH is open. No new information on any zeta zero. |
| ap-leeyang-ladder | refereed |  |
| ap-leeyang-structural | refereed | Verdict in one paragraph. No Lee-Yang theorem locates a zero of zeta. The route stops at three exact points, each proved or classical: (F1) the arithm |
| ap-order-two | refereed | Verdict: precise obstruction. The order-2 architecture exists, is explicit, and has model abscissa 1/2 at |
| ap-squares-rallis | refereed |  |
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
| box-bohr-stability | unrefereed | Status labels: PROVED (argument given here), CLASSICAL, CERTIFIED (python-flint/Arb interval arithmetic), SCREENED (float64, GPU or CPU; never a verdi |
| box-hodge-signature | unrefereed |  |
| box-ly-search | unrefereed |  |
| box-riesz-order2 | unrefereed |  |
| box-verified-height | unrefereed |  |
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
| n1-beurling-rigidity | refereed |  |
| n1-ff-mayer | refereed |  |
| n1-maass-selberg-norm | refereed | Verdict: precise obstruction for the proposed tool; partial result on the question. |
| n1-mayer-dirac | refereed |  |
| n1-tube-hull | refereed | Verdict: precise obstruction; the idea is closed. In every model the hull of the regions obtainable from |
| n2-cubic-sieve-spike-deflation | refereed | Verdict: precise obstruction. The bounded-rank deflation lemma is false at the scales reached and, conditionally on |
| n2-epstein-degree-nine-anchors | refereed | Verdict: precise obstruction; the idea is dead as a route. The first test kills it. The winding W(s) obeys no sign, monotonicity or boundedness law, i |
| n2-kloss-sdp-certificate | refereed | Verdict: partial result. The first test does not kill the idea and does not prove anything about exponents. |
| n2-landau-even-moment-family | refereed | Verdict: precise obstruction; lane closed at the first test. The transfer lemma is correct and trivial. The d-Poisson duality is an exact involution,  |
| n2-lee-yang-hyperelliptic | refereed | 1. Global real-cube stability for n = 3 is certified only on a 13^3 rational grid and measured by local search; only the first-order statement at z =  |
| n2-lee-yang-prime-gas | refereed |  |
| n2-rank2-eisenstein-kernel | refereed | Verdict: precise obstruction. Rank-2 positivity is strictly stronger than Lemma 1 and than rank-1 positivity, but the |
| n3-cm-taylor-central-values | refereed | Verdict: precise obstruction. Lemma W is true (measured to 79 digits), the expansion of zeta in the |
| n3-ff-cubic-sieve-rational-deflation | refereed | Verdict: precise obstruction; the kill criterion is met. Over F_7[T] the excess of the cubic large sieve over the flat |
| n3-green-two-sheet-heegner-gram | refereed | Verdict: precise obstruction; lane closed. The Gram-matrix coincidence at a zero is true, and it has no sign |
| n3-order2-dual-rank-classification | refereed | Verdict: precise obstruction; the first test triggers the kill criterion. The conic row ((m^2 - d)/c) does |
| n3-pellikaan-weil-interval | refereed | Verdict: precise obstruction, with a proved genus-2 lemma. RH is open. No statement about zeros of zeta. |
| n3-theta-power-departure-law | refereed |  |
| n3-twin-ladder-endpoint-bridging | refereed | Verdict: the endpoint-bridging induction is killed by its own first test. The generator identity is proved (constant c = -1/4), every FE pair does col |
| n4-char-one-stepanov | refereed | Verdict: precise obstruction; lane closed at the first test (a). Nothing about zeros of zeta is claimed. |
| n4-gl3-double-cover-absorption | refereed | Verdict: precise obstruction; the first test triggers the kill condition. The p-part of the quadratic A_2 series |
| n4-kunneth-multiple-euler | refereed | Verdict: precise obstruction; lane closed by the first test. The abscissa of absolute convergence of the k-fold Euler series is k (defect k/2, i.e. 1/ |
| n4-simpson-jump-locus | refereed | Verdict: precise obstruction; lane closed. No statement about zeros of zeta is obtained. |
| n4-spectral-window-moebius | refereed | Verdict: precise obstruction; lane closed at the first test. In all three ledgers the largest admissible A is <= 1 (unconditionally A = 1/2 in each),  |
| n4-spin-order-two-rows | refereed | Verdict: precise obstruction; the first test kills the lane. Spin has no absorption identity. Its cocycle is, |
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
| res-identity-solenoid | refereed |  |
| res-order-two-nonpoisson | refereed | Verdict: precise obstruction (a narrower no-go). For the four non-Poisson candidates (Siegel-Weil / Howe duality, |
| res-point-spectrum-square | refereed |  |
| res-sparse-ferromagnet | refereed |  |
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
