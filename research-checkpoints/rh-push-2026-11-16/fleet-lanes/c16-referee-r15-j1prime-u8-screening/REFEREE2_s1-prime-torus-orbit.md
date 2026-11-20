# REFEREE2: s1-prime-torus-orbit (screening lane; first independent referee)

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Own code: `code/loc_screen.py`, the exact-variance run
(`loc_haarvar.json`), `code/srv.py` stage C (server unit `rh-c16ref-1119212121`; identical numbers locally).
Nothing here is a statement about the location of zeros of zeta.

## Ruling: holds with corrections. One numeric column does not reproduce within its stated tolerance; no classification depends on it. Verdict "0 survivors" stands.

### Numeric claims recomputed

| claim of the lane | this pass | agrees |
|---|---|---|
| T-NR zeros on `Re s = 0.90375`, lowest height 2.8596 | 0.9037532, 2.8596009 | yes |
| DH zero 0.808517 + 85.699348 i | `abs DH` = 6.5e-7 there (python-flint), 0.357 on the line at the same height | yes |
| Gram bad rate for zeta: 0.0912 at [5e3, 1e4], 0.1369 at [5e5, 1e6] (10,000 Gram points, standard error 0.003 to 0.004) | all 5,622 Gram points of [5e3, 1e4]: 517 bad, 0.0920; 10,000 random Gram points of [5e5, 1e6]: 0.1363 (mpmath `grampoint`, `siegelz`) | yes |
| Haar pointwise variance of `log abs F_P(1/2 + it)`: "0.97 ... 1.63 = (1/2) log log P + 0.21 to within 0.02" for P = 1e2 ... 1e7; sigma = 0.59045 "saturating at 0.86" | exact value `(1/2) sum_{p<=P} Li_2(p^(-2 sigma))`: sigma = 1/2: 0.9709, 1.1688, 1.3113, 1.4224, 1.5134, 1.5905; sigma = 0.59045: 0.7035 ... 0.8405, limit 0.8478; sigma = 0.75: 0.4343 ... 0.4502. The lane's column ("Haar var vs cut": 0.988 ... 1.630; 0.721 ... 0.863; 0.450 ... 0.467) is a sample estimate and is high by 0.016 to 0.039 at every cutoff | **no**, at the upper end (1.63 against 1.5905) |
| Haar variance at P = 1e6 in the replication: 1.520; orbit 1.516, 1.508 | exact 1.5134 | yes |

Corrected sentence for section 2.1: "the exact Haar variance at sigma = 1/2 is
`(1/2) sum_{p<=P} Li_2(1/p)` = 0.971, 1.169, 1.311, 1.422, 1.513, 1.590 for P = 1e2 ... 1e7, that is
`(1/2) log log P + 0.2005` for P >= 1e5 (0.2073 at P = 100); at sigma = 0.59045 the limit is 0.848. The sampled
column of the P = 1e7 run is high by 0.02 to 0.04 (one Haar sample of 60 windows)." The excess is the same at
every cutoff and at all three abscissae, so it comes from the smallest primes of that one sample. The
statements that use the column (log-correlated regime at 1/2, saturation at 0.59045) are unchanged.

### Structural claims

- Lemma R (rotation): holds. `(1 - u_p p^(-s))^(-1)` at torus point theta is the zeta factor at
  `theta_p - arg u_p`; Haar measure and the linear flow are rotation invariant.
- "T-NR: `Z_TNR(t) = Z(t)(2 cos(t log 3) + 2.2)` with a positive second factor: the same Gram points, the same
  signs (PROVED)": holds (minimum of the factor 0.2).
- "E_a: `Z = abs zeta(1/2 + a + it)^2 >= 0`, no sign changes": holds as an identity for the completed product on
  the line.

### Do the separations fall under the four causes of STRATEGY section 0b?

| test | separation found | cause |
|---|---|---|
| 1 window maxima | zeta, chi (and DH, T-NR, E_a) below Haar for T <= P; random twists not | the explicit-formula regime, cutoff above the height (kind 1; here it is the object's own prime number theorem, not a control's off-line zero) |
| 1, 4C Haar law | DH, T-NR differ from zeta at Haar level | a property of the torus function, i.e. of the coefficients: none of the four kinds as worded (the lane's own kind (d)) |
| 2 sup against rms | DH, T-NR by growth of the log-derivative coefficients | coefficient size readable right of 1 (kind 2) |
| 3 Gram statistics | DH by the deficit of sign changes; E_a trivially | count of on-line zeros (kind 3) |
| 4 recurrence | none | - |

The lane's own four kinds are confirmed for the rows sampled. The summary of section 0b replaces the lane's
kind (d) by "a mean value", which does not occur in this lane.

Weakest points of this pass: tests 1, 2 and 4 (orbit bands to 1e12, 1.1e11 lattice points) were not rerun; the
Gram rates were recomputed at the two lowest heights only.
