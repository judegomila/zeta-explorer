# REFEREE2: s1-scattering-one-line (screening lane; first independent referee)

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Own code: `code/loc_screen.py` (local), `code/srv.py`
stages B (server unit `rh-c16ref-1119212121`, 8 cores, 12 GB; the same seeds were also run locally at the same
size and give identical numbers) and `code/srv2.py` (server unit `rh-c16ref2-1119214854`).
Nothing here is a statement about the location of zeros of zeta.

## Ruling: holds with corrections. No recomputed number failed. Verdict "0 survivors" stands.

### Numeric claims recomputed

| claim of the lane | this pass | agrees |
|---|---|---|
| exact torus variance of `arg zeta(1 + it)`: 0.236847; of `arg L(1 + it, chi)`, chi mod 5: 0.216644 | `(1/2) sum_p Li_2(p^-2)` = 0.2368472; minus `(1/2) Li_2(1/25)`: 0.2166435 | yes |
| measured variance of `arg zeta(1 + 2iT)`: 0.23692 (T in [1e6, 2e6]), 0.23695 ([1e8, 2e8]); fourth central moment 0.13606, 0.13640 against 0.136164; maxima 1.54, 1.53 | 200,000 uniform t in [2e6, 4e6]: variance 0.23631 +- 0.00063, m4 0.13536, max 1.512; 100,000 in [2e8, 4e8]: 0.23658 +- 0.00089, m4 0.13575, max 1.476 (python-flint, 64 bits, no approximate functional equation) | yes (z = -0.9, -0.3 against the exact value) |
| Berry-Keating constant 0.875007 +- 5.3e-5 (first 1e5 zeros), 0.875000 (2,001,052 zeros); residual variance 0.0966, 0.1103 | 0.8750070, 0.8750000; 0.09663, 0.11033 (Riemann-Siegel theta by its asymptotic series) | yes |
| removing one pair at height 50,000: second-half mean 1.0000 -> -0.4592 | 1.00002 -> -0.45918 | yes |
| DH: first off-line pair at height 85.699; 1861 on-line zeros below 2000 (84 pairs); L(chi): 2028 zeros, all on the line | `abs DH(0.808517 + 85.699348 i)` = 6.5e-7 (zero to the six digits given) and `abs DH(1/2 + 85.699348 i)` = 0.357; sign changes on the line below 2000 (server, step 0.03 with hidden-pair detection): DH 1861, L(chi) 2028 (Riemann-von Mangoldt main term 2028.4); deficit 167 against the lane's 168 off-line zeros (84 pairs); the two counting functions share the main term and may differ by O(1) | yes |
| T-NR zeros on `Re s = 1/2 +- 0.404` at heights `(2k+1) pi/log 3` | 0.4037532; 2.8596009 | yes |

### Structural claims

- "T-NR: on-line zeros are exactly zeta's, the gamma factor is zeta's, so constant and residual are zeta's
  (PROVED)": holds, by the identity `m(1/2 + it) = c + 2 cos(t log q) >= 0.2`. Same scope line as in
  `REFEREE2_s1-zero-statistics-gram.md`: counted against its own total (extra term `T log q/pi`) T-NR fails,
  and that is the argument principle. The lane says so.
- "T-NR changes one Euler factor, so its tail for P > 3 is zeta's": holds.
- Row 2, raw cascade: the object that differs is zeta (pole at 1), not a control; it is not a separation of
  the kind a survivor needs, and the lane says so.

### Do the separations fall under the four causes of STRATEGY section 0b?

| test | separation found | cause |
|---|---|---|
| 1 law of `arg F(1 + it)` | DH: variance 0.0907 against 0.0652 for the Euler-type prediction | a property of the coefficients alone, `a(mn) != a(m) a(n)`: none of the four kinds as worded |
| 2 cascade rate | none after the pole correction | - |
| 3 counting residual | DH, HEAT, E_a | count of on-line zeros (kind 3) |
| 4 kappa_nJ | T-NR, E_a (DH weakly) | Littlewood's lemma: a count of the zeros of V in the window (kind 3, or kind 1 at the height of the window) |
| 4 kappa_J | DH; T-NR only with Dirichlet-polynomial mollifiers | mean value (kind 4) |

The lane's own three kinds (coefficients alone; argument principle; mean value) are confirmed. The summary
sentence of section 0b drops the first of them.

Weakest points of this pass: test 2 (primes to 1e10) and test 4 (Levinson numbers) were not recomputed; the
variance check is a sample of 3e5 points against the lane's 1.2e6.
