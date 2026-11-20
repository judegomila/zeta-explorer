## 6. Controls

By Theorem 1 a band-u device sees a function only through its zero configuration (when the explicit formula holds for it with the same archimedean term) or not at all (when it does not). No control fails at a step of an argument, because the lane contains no argument beyond the frame.

| Control | Outcome for the complete device | Reason |
|---|---|---|
| Davenport-Heilbronn | fails at large height | its off-line pairs are isolated (bounded number per window): excluded by (W2), (W3); zero location only; the identity holds for it with its own gamma factor |
| T-NR (xi times q^z + c + q^(-z), abs(c) > 2) | its row is invisible for P <= q, for every offset (the control passes whenever the xi factor does); visible above | its off-line row has spacing 2 pi/log q: Theorem 6, exact for the complete device |
| zeta(s+a) zeta(s-a) | fails in a window (MEASURED on the window type: count-preserving and added pairs on zeta's ordinates, section 5.3 readings 1, 2) | pairs at zeta's own ordinates; the ordinates are not a lattice; excluded down to 0.03 to 0.04 at theta = 1/2 with 12 pairs and below 1e-3 with 40 to 60 pairs (M = 0) |
| ZQ (zeta times a rational symmetric multiplier) | passes in the window when the multiplier's quadruples form a tapered row of spacing below 2 pi/u (rows of section 5.3: at theta = 2 with u b_max = 0.44 n + 2); fails for quadruples on zeta's ordinates beyond the one-pair scale | density of off-line pairs, (W4); a fixed multiplier is tested at finitely many heights only |
| Sign-twisted primes, random multiplicative chains, unimodular twist | no zero-side identity with zeta's archimedean term; they have the truncated Euler product of Lemma E and violate the indicator-vector sub-device at theta >= 1 (c15, c16; not rerun) | the reserve log(t/2 pi) is the functional equation; multiplicativity is present and does not help |
| Backward heat (tau < 0) | passes or fails through its zero set only; not run | its off-line pairs enter T_Z like any others |
| Beurling systems, phase-rotated transfer operator, theta^w | not formulated in the frame beyond "a zero configuration"; not run | no step to test |

R3 is not met: T-NR and ZQ pass in a window, and the others fail through zero location only.

## 7. Requirement flags

- R1 (multiplicativity essential): no. Theorems 1 to 6 are about point configurations. Lemma E shows where multiplicativity sits (an exact factorisation at every band) and that every multiplicative chain has it; no step uses it to obtain an inequality.
- R2 (height-uniform, every window): no. The laws are uniform in u and in the density (all heights) in the lattice model, as statements about what a device excludes. No device inequality is established at any theta > 0 for zeta; the zeta-background numbers are at three heights.
- R3 (every control fails at a named structural step): no (section 6).
- R4 (reaches the critical line): no. The lane shows the limit of the device class: at band u the reach is a density condition; for one pair c/log t below P = t/2 pi and sqrt(M) (log t)^(-3/2) above; exact reach (M = 0 above the Nyquist band) is the target itself in a window.

## 8. Three weakest steps

1. The window. The proved exact statements are for a tight or lattice on-line background (Theorems 2 (d), 3, 4). For zeta the on-line zeros are not a lattice, the complete device without a window tests all heights at once, and the synthetic sets of section 5.3 model the exterior of the window by a lattice. The transfer to "a device that reads a window of length L" is the Landau-Pollak-Slepian count (ARGUED) plus the measurements; frame bounds of zeta's ordinates in a window were not computed, so prediction B1 was not evaluated in its registered form. The window half-lengths (45, 30, 22) were not varied.
2. The constant of the linear law. Upper bound 5.85 n relative to Turan's second main theorem (secondary source only; Corollary T' is written for one cluster near the height, with the other points entering through D'); lower bounds 0.445 n (one family, n up to 60) and 0.96 n to 1.7 n (local optimisation, n <= 8). The factor between them is open, and (W4) is two-sided in order only. Thresholds come from bisection, which assumes that the passing offsets form an interval; the families are not exhaustive, so every measured threshold for a mode is a statement about that mode only.
3. Lemma 0 (factorisation of non-negative entire functions of exponential type) and the explicit formula in the operator form of section 3 are recalled, not opened; the second is not re-derived in the normalisation used here (signs and the lower-order archimedean terms are taken from c15 Lemma 1). The ordinates at 1e12 are resolved to 1.2e-4 only. The count argument for count-preserving replacement (section 5.3, reading 2) is not a proof.

## 9. Files

`wil.py` (the criterion in ball arithmetic), `selftest.py`, `testA.py`, `testA2.py`, `testB.py`, `testC.py`, `zeros12.py` with `zeros_1e+12.json` (ordinates at 1e6 and 1e9 are read from the c16 directory), `aggregate.py`, `build_result.py`, `tables.txt` (all tables), `logs/` (unit logs, JSON lines: every threshold with its mode and timing), `PREDICTIONS.md`, `header.md`, `RESULT_theory.md`, `tests.md`, `tail.md` (the parts of this file), `lanes.jsonl`.

Proposed map text (one row for the reach of band-limited devices, in place of the reach sentences of S12b, Q30 and the P45 addendum): "A positivity statement with tests of band u = log P is the quadratic form of T_Z = sum_z |v_z><v_conj z| on L^2 of an interval of length u, tested on a set of vectors (C(theta): modulated indicators). Complete device, regular on-line background of density Lg/2 pi, tolerance M: a cluster of n pairs has n negative directions; one pair is invisible up to sinh(ub)/(ub) = 1 + (Lg + 2M)/u for u <= Lg (PROVED, lattice) and up to about sqrt(12M) u^(-3/2) for u > Lg (PROVED two-sided, lattice; zero at M = 0); n pairs hide up to u b_max between 0.445 n (MEASURED) and 5.85 n + logs (relative to Turan), and only with off-line pair density of order u/2 pi; rows of that density pass with any offset (PROVED). The truncated Euler product is exact in the truncated-shift algebra for every multiplicative chain; no step uses it. `c17-window-information-law-ctheta-u5`."
