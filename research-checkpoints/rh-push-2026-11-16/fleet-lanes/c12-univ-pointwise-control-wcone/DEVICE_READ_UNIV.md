# DEVICE_READ_UNIV: the 34 device rows of `push/c11-del-device-read-confirm/DEVICE_READ_V2.md` against control UNIV

Lane `c12-univ-pointwise-control-wcone`, 2026-11-19. Basis: the V2 table (device, rows that decide, reading, recorded control), `engine/curated/devices.json` (names and evidence strings), and map rows P14, P15, P25, P29, P36, P39, P40, P50, Q19, Q21, Q27, S12, D4, D7, G20 read in `push/OBSTRUCTION_MAP.md`. No device lane was reopened. Every cell is ARGUED from those texts.

UNIV (RESULT.md section 2) applies to a step only if the step is a closed condition on the values (and finitely many derivatives) of finitely many Dirichlet L-functions, on a fixed compact window inside 1/2 < Re s < 1, with constants independent of height, required at all heights. For such a step it returns one of: T (true for every analytic tuple: no content), N (true for every non-vanishing tuple: can fail only in a window that contains a zero), F (false for some non-vanishing tuple: false for the L-functions at a set of heights of positive lower density).

Codes.
- C: the separating step of the device is in scope; UNIV decides it without the recorded control.
- Cp: a named value-side part is in scope and decided; the rest of the device is out of scope.
- R: UNIV, or its Kronecker part, is the mechanism the row already uses; nothing independent is added.
- N-x: out of scope. x = FE (reads the completed function, or s with 1 - conj s), KER (kernel side), COEF (coefficients, primes, frequencies, local parameters), AVG (mean value or other statement non-local in height), CL (critical line), HT (height-dependent constant or region), COND (conductor aspect, family growing), OBJ (another object: surface, group, function field, special values), ID (identity or identification, no inequality).

| # | device | UNIV code | class | what UNIV decides, or why it does not apply | recorded control (V2) |
|---|---|---|---|---|---|
| 1 | mean-value-convexity | Cp | F | Part of row P29: raw positive-definiteness of u -> log zeta(sigma + iu) on a line in the strip needs abs(log zeta(sigma + iu)) bounded in u; false (log zeta takes values near any target, Bohr 1915 / Theorem 1 with f = e^M). The lane used an Omega-theorem. Mean values and the convexity bound: N-AVG, N-FE. | E_a, DH, cluster lifts |
| 2 | exact-uniqueness | N-ID | - | identification through FE; no inequality | DH (P6) |
| 3 | residue-explicit-formula | N-FE | - | completed function, pairs rho with 1 - conj rho; identity | DH, E_a |
| 4 | positive-kernel-transport | Cp | F | Value-side part (nodes harmonic-strip-transport, h5-euler-products-bounded, read from one line each): a Harnack or positive-real transport with a constant independent of height needs a one-sided bound for log abs zeta on a line or window in the strip; none exists (targets e^M and e^-M). Map rows P3, P7, G13, G17: N-FE. | DH, HEAT, Epstein |
| 5 | maximum-principle | N-FE | (N) | Schur ratio of the completed function; the condition Re xi'/xi >= 0 is Re zeta'/zeta >= -(1/2) log(t/2 pi) + o(1): height-dependent (N-HT). For a fixed non-vanishing target it holds at large height, so it is of class N in the limit, as the device record says (circular). | DH |
| 6 | dual-measure-compactness | N-COEF | - | dual measures over the integers | E_a |
| 7 | recurrence-ergodicity | C | N | The hypothesis of row P39 is self-recurrence of zeta near a zero. Recurrence towards non-vanishing targets is unconditional (Theorem 1); recurrence of zeta towards itself on every window is equivalent to RH (Bagchi, survey Theorem 20: one direction is Rouche plus N(sigma_1, sigma_2, T) = o(T)). The amplifier hypothesis is the conclusion. Same finding as the row, by the classical theorem instead of the row's Lemma 1. | DH, E_a separated only at the density estimate |
| 8 | euler-fe-phase-at-height | N-FE | - | The gamma phase theta(t) is not a function of finitely many prime phases. The Euler half alone is in scope of the hybrid form (Theorem 30): any condition on values in the window together with (p^-it), p <= z, is of class T, N or F. P40 is on the critical line (N-CL). | DH, HEAT, WT, U |
| 9 | selberg-operator | N-OBJ | - | | none |
| 10 | monotone-flow-functional | N-KER | - | | HEAT, DH, E_a |
| 11 | geometric-positivity | N-OBJ | - | | function-field fakes |
| 12 | stage-limit | R | - | Row Q21 at fixed P is Kronecker-Weyl on the prime torus, which is the second coordinate of Theorem 30. The limit P -> infinity is a family growing with height: not covered. | (PF in V2) |
| 13 | section-extraction | N-FE | - | first moment over poles of the completed function | DH, E_a, T-NR |
| 14 | test-restriction-commutator | Cp | F | Same part as device 1 (P29, positive-definiteness of log F on lines in the strip). Weil form, commutators, window SDP: N-FE, N-KER. | all controls (P35) |
| 15 | finite-support-positivity | N-FE | - | Pick and screw forms of the completed function. An un-completed windowed finite-order form in the strip would be in scope; no row states one. | DH, HEAT |
| 16 | hecke-compression-lax-phillips | N-OBJ | - | | inner functions |
| 17 | hecke-correspondence-recurrence | N-OBJ | - | recurrence on the modular surface, not of values in height | EIS-w |
| 18 | helson-discrepancy | N-COEF | - | partial sums | B, THIN |
| 19 | twisted-discrepancy | N-COEF | - | | THIN, WT |
| 20 | frequency-only | N-COEF | - | reads log n only | (PF) |
| 21 | padic-special-values | N-OBJ | - | values at s <= 0 | interpolation twin |
| 22 | tensor-squeeze | N-COEF | - | local parameters | (PF) |
| 23 | strip-dtn-identity | N-FE | - | identity for the phase of S built from xi | DH |
| 24 | sum-product-vinogradov | N-HT | - | region 1 - sigma << (log t)^(-2/3): leaves every fixed compact window | (PF; closed by its floor) |
| 25 | quadratic-positivity-companions | Cp | F | For Dirichlet-character companions at one height in the open strip: any inequality sum_j c_j Re (L'/L)(s, chi_j) >= -C with fixed C and some c_j != 0 is false (targets exp(lambda_j s)). Not covered: Re s >= 1 (where row P50 lives), heights t and 2t together (3-4-1), Sym^m companions (joint universality known only in part: survey Theorem 9). | (PF) |
| 26 | coherent-set-large-sieve | N-COND | - | family in the conductor aspect, mean values over the family. UNIV does not conflict with a zero-free half-plane: that statement is of class N. | none (floored) |
| 27 | effective-order-two | N-COND | - | | per part |
| 28 | laurent-shell-gamma-section | N-FE | - | first moment at sigma = 1/2 with the gamma term | DH, WT |
| 29 | function-field-order2-vertex | N-OBJ | - | F_q[T] | genus-1 fakes |
| 30 | vector-specific-row-mean-square | N-AVG | - | | random vectors |
| 31 | nonprincipal-row-cancellation | N-AVG | - | | control-blind |
| 32 | positive-term-sum-rule | R | N | Form (i) of row Q27 (window integral of log abs F = Jensen count) is the standard class-N functional; form (iii) is Kronecker-Weyl. Both are the row's own mechanism. | (PF) |
| 33 | single-row-bridge | N-FE | - | completed theta row | DH, theta^w, HEAT |
| 34 | landau-siegel-mechanism | N-COND | - | real zeros in the conductor aspect | none |

## Counts

| code | number | devices |
|---|---|---|
| C | 1 | 7 |
| Cp | 4 | 1, 4, 14, 25 |
| R | 2 | 12, 32 |
| N | 27 | FE: 3, 5, 8, 13, 15, 23, 28, 33; COEF: 6, 18, 19, 20, 22; OBJ: 9, 11, 16, 17, 21, 29; COND: 26, 27, 34; AVG: 30, 31; KER: 10; HT: 24; ID: 2 |

Reading. UNIV closes one device in full (7, where it is the classical form of the row's own finding) and a value-side part of four. It does not touch the 27 devices that read the completed function, kernels, coefficients, families or other objects. The three devices for which V2 records no passing control (26, 34, 9) are all out of scope. UNIV is a filter for one step type, not a control that replaces any recorded one.

Devices added to devices.json after V2 (not part of the 34): `regular-rep-matrix-bridge`: form (H) of its lane (cone functionals without zeros) is decided by UNIV in the strip (survey Theorems 10, 11: zeta(s, a/q) has at least CT zeros in every sub-strip of 1/2 < Re s < 1; eight zeros of Z_1 = 5^-s zeta(s, 1/5) with 1/2 < Re s < 1 below height 120 are in `wcone_checks.json`); forms (K), (E), (Q): N-FE. `twist-modulus-reciprocity`: N-AVG. `de-branges-positivity-family`: variant V3b already cites joint universality (R).
