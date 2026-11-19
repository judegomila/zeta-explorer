# Devices of engine/curated/devices.json read against control DEL_b (thin prime deletion)

Lane `c10-thin-deletion-zero-mode-control`, 2026-11-18. 34 devices; every id of the file is covered (checked by `mk_device_read.py`).
Basis: the read set of each device as recorded in devices.json and the map rows it cites. No device lane was re-run against DEL; every cell is ARGUED.
DEL_b has: EP, POS, SIZE0, SUPP, INT (coefficients 0 or 1, completely multiplicative), simple pole at 1, continuation to Re s > max(b - eta, b/2), a simple real zero at b; right of b its zeros are those of zeta.
DEL_b lacks: FE, PER (periodic twists), GEOM at the primes of S, values at s <= 0, a kernel or geometric object.
Codes: P = every step the device reads holds for DEL (its zero at b then bounds the output, or the output is a density or identity that is true for DEL). NF = not formulable: the first input read that DEL lacks is named. FAIL = formulable and false.

| # | device | state in file | DEL | step passed or first step not available | input DEL lacks |
|---|---|---|---|---|---|
| 1 | `mean-value-convexity` | closed | P (Re s > b) | Right of b, F = zeta G with G and 1/G bounded and analytic on Re s >= b + delta, so every mean value over heights transfers from zeta. The output is a density statement, and it is true for DEL (one zero added). Left of b the growth of W is not known: NF there. | no |
| 2 | `exact-uniqueness` | closed | NF | First step reads FE (with INT: Hamburger). DEL has INT and no FE. The device is an identification (mode I), so this is not a lever. | FE |
| 3 | `residue-explicit-formula` | closed | NF / P | The completed (Weil) form reads FE: NF. The one-sided residue identities (Perron in Re s > max(b - eta, b/2)) hold for DEL as identities; the sign of the zero side reads the zero at b. | FE |
| 4 | `positive-kernel-transport` | closed | P / NF | Stage bounds right of 1 hold (DEL stages are sub-products of zeta's). Harnack transport of log abs F to the left holds up to b and stops at the zero: with POS and EP as the only inputs the transport cannot pass b (mode Z). The ladder on the completed function with Montel closure reads FE: NF. | FE (ladder part) |
| 5 | `maximum-principle` | closed | NF | The Schur ratio is built from the completed function: reads FE. | FE |
| 6 | `dual-measure-compactness` | closed | P | Row P36 reads Lambda_a >= 0 over the integers. DEL has POS and INT, so the dual inputs hold; the conclusion is false below b (mode Z). The P36 cell for B was a literature control without INT; DEL has INT. | no |
| 7 | `recurrence-ergodicity` | closed | P (Re s > b) | Right of b the inputs (Euler product with independent log p, mean squares) transfer from zeta; the output is a density of translates, true for DEL. Left of b: growth of W not known, NF. | no |
| 8 | `euler-fe-phase-at-height` | closed | NF | Couples Euler phases to the FE phase at one height: reads FE. | FE |
| 9 | `selberg-operator` | closed | NF | Reads a discrete group and its Laplacian; DEL is not attached to one. | group / operator |
| 10 | `monotone-flow-functional` | closed | NF / P | The flow acts on the kernel of the completed function: reads KER and FE, NF. The step 'Lambda >= 0 at the anchor right of 1' holds for DEL (POS). | KER, FE |
| 11 | `geometric-positivity` | closed | NF | Reads a geometric object (heights, intersection form); none is attached to DEL. | geometry |
| 12 | `stage-limit` | closed | P | A stage of DEL is zeta's stage with the variables z_p, p in S, set to 0 inside the polydisc: every stage property (non-vanishing in Re s > 0, polydisc stability, inner stage symbol) is inherited. The limit has a zero at b: a written example for row Q19 (stages locally bounded on Re s > b and not on any Re s > b - delta). Mode Z for the limit step. | no |
| 13 | `section-extraction` | closed | P / NF | Prime-chain part: DEL is the chain with the stubs at S removed; each remaining stub is lossless as for zeta, so the section statements proved for Re s > 1 hold. The gamma one-port reads FE: NF. | FE (gamma port) |
| 14 | `test-restriction-commutator` | closed | P / NF | Positive-definiteness of log F (row P29) reads non-negative coefficients of log F: holds for DEL. Weil form on Hecke-primitive tests, Hecke commutators and the window SDP read FE and the Hecke algebra: NF. | FE, Hecke |
| 15 | `finite-support-positivity` | closed | FAIL (S mode, by Theorem R; not computed here) | With zeta's archimedean side kept, DEL is Lambda + eta with eta = -Lambda on prime powers of S, real and not zero. Row P6 (Theorem R) then gives a finite Pick matrix that is not positive semidefinite on every interval. DEL does not pass; the read set is finite-order positivity with zeta's archimedean side, which DH passes (orders 2 to 148) and verified height implies at low order, so no new read set. | positivity with zeta's gamma side |
| 16 | `hecke-compression-lax-phillips` | closed | NF | Reads the modular surface and its Hecke operators. | modular surface |
| 17 | `hecke-correspondence-recurrence` | closed | NF | Reads the modular surface, all T_p and Eisenstein resonance states. | modular surface |
| 18 | `helson-discrepancy` | closed | NF as stated / P in transferred form | Row P46 reads a completely multiplicative unimodular chi; DEL's coefficients are completely multiplicative with values in {0, 1}, not unimodular on S. The transferred statement holds with the same proof: F/zeta = exp(-A), A with non-negative coefficients, Landau gives abscissa b, and right of b the zeros of F are those of zeta. | GEOM over Z |
| 19 | `twisted-discrepancy` | closed | P (general form) | a = 1 * g with g = mu on integers composed of primes of S, sum abs(g(d)) d^-sigma finite for sigma > b; additive twists have a main term at q and error O(q x^(b+eps)), as for THIN in row P51. The strict form (no main term for q > 1) fails for DEL and is an identification. | no |
| 20 | `frequency-only` | closed | P | Ordinary Dirichlet series with frequencies log n; coefficients are not read. | no |
| 21 | `padic-special-values` | closed | NF | Reads values at non-positive integers; DEL is continued only to Re s > max(b - eta, b/2). | values at s <= 0 |
| 22 | `tensor-squeeze` | closed | P | Reads bounds on local parameters; DEL has local parameters in {0, 1}. | no |
| 23 | `strip-dtn-identity` | closed | NF | Strip identity with FE phases on both edges: reads FE. | FE |
| 24 | `sum-product-vinogradov` | closed | P | F = zeta G with G bounded and non-vanishing right of b, so the region of Vinogradov-Korobov type near Re s = 1 is the same as for zeta; the device gives nothing further left for either. | no |
| 25 | `quadratic-positivity-companions` | closed | P | Reads POS for F and for products of translates (3-4-1 type forms, coefficient squares); all hold for DEL. Landau reaches Re s = 1 only; DEL has its zero at b < 1. | no |
| 26 | `coherent-set-large-sieve` | floored | NF (not replayed) | The 7/8 architecture uses a target weight that is completely multiplicative with abs = 1 at every prime and whose sextic twists are periodic (manuscript Prop. 5.1; row THIN). DEL has abs(a(p)) = 0 on S and is not periodic modulo any ideal (Lemma N below). Which of the two is met first in the manuscript was not replayed. | GEOM over Z, PER |
| 27 | `effective-order-two` | open | NF (not replayed) | Same architecture and same two inputs as coherent-set-large-sieve. | GEOM over Z, PER |
| 28 | `laurent-shell-gamma-section` | closed | P / NF | Prime-chain section on the shell: as section-extraction. Gamma one-port: reads FE. | FE |
| 29 | `function-field-order2-vertex` | open | NF | Model in F_q[T]; DEL is not built there (a thin deletion of a rational zeta function is not rational). | model |
| 30 | `vector-specific-row-mean-square` | closed | NF (not replayed) | Reflected theta rows for the probe vector: 7/8 architecture, reads PER through the reflection. | PER |
| 31 | `nonprincipal-row-cancellation` | closed | NF (not replayed) | As vector-specific-row-mean-square. | PER |
| 32 | `positive-term-sum-rule` | closed | P | The coefficient side is a sum over the stubs present, sum over p not in S of p^(-2 sigma), smaller than zeta's; the lane found THIN passes with a zero at b, and the same computation applies with coefficients 0 at S. The output is a density in mean form, true for DEL. Not re-run. | no |
| 33 | `single-row-bridge` | closed | NF | Bridge of one completed theta row: reads FE of the row and the 7/8 target weight. | FE, PER |
| 34 | `landau-siegel-mechanism` | closed | NF | Reads Frobenius congruences for a family of real characters (periodicity); THIN and the Liouville twist fail at S4/S5 for the same reason. DEL is not a character family. | PER |

## Counts

- DEL passes (in full or on the part that does not read FE): 14 devices: `mean-value-convexity`, `positive-kernel-transport`, `dual-measure-compactness`, `recurrence-ergodicity`, `stage-limit`, `section-extraction`, `test-restriction-commutator`, `twisted-discrepancy`, `frequency-only`, `tensor-squeeze`, `sum-product-vinogradov`, `quadratic-positivity-companions`, `laurent-shell-gamma-section`, `positive-term-sum-rule`.
- DEL does not pass (NF or FAIL at the first step): 20 devices: `exact-uniqueness`, `residue-explicit-formula`, `maximum-principle`, `euler-fe-phase-at-height`, `selberg-operator`, `monotone-flow-functional`, `geometric-positivity`, `finite-support-positivity`, `hecke-compression-lax-phillips`, `hecke-correspondence-recurrence`, `helson-discrepancy`, `padic-special-values`, `strip-dtn-identity`, `coherent-set-large-sieve`, `effective-order-two`, `function-field-order2-vertex`, `vector-specific-row-mean-square`, `nonprincipal-row-cancellation`, `single-row-bridge`, `landau-siegel-mechanism`.

## Read sets of the devices DEL does not pass (reported to the planner as candidate read sets)

1. FE at all heights (with or without KER): exact-uniqueness, residue-explicit-formula (Weil form), maximum-principle, euler-fe-phase-at-height, strip-dtn-identity, single-row-bridge, and the FE halves of positive-kernel-transport, monotone-flow-functional, section-extraction, test-restriction-commutator, laurent-shell-gamma-section. Each is closed in the file by DH, HEAT, E_a or as an identity; DEL adds nothing to these.
2. PER with unimodular local parameters at every rational prime (lattice-translation invariance in the conductor aspect): coherent-set-large-sieve, effective-order-two, vector-specific-row-mean-square, nonprincipal-row-cancellation, landau-siegel-mechanism. THIN fails these at PER; DEL fails at PER and at GEOM over Z. This is the read set of the one floored mechanism; no new member.
3. An attached object that DEL does not have (group, surface, geometry, model, special values at s <= 0): selberg-operator, hecke-compression-lax-phillips, hecke-correspondence-recurrence, geometric-positivity, function-field-order2-vertex, padic-special-values. 'Not formulable' is not a quantitative handle (map section 2, Q1).
4. Finite-order positivity with zeta's archimedean side: finite-support-positivity (DEL fails by Theorem R; DH passes).

No closed device is reopened by DEL. Two cells that rested on the unopened Beurling source (dual-measure-compactness, row P36; quadratic-positivity-companions, row P25/P50) now have a control on file, relative to the short-interval statement S(theta) of RESULT.md.
