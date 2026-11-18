# REFEREE (lens: general) for c3-rs-matched-halfsum-hb/RESULT.md

Referee verdict: **the obstruction holds; three statements in the write-up are wrong or overstated and must be corrected.** No statement about zeros of zeta is made, nothing assumes RH, nothing restates verified height. All counted zeros are zeros of finite Dirichlet polynomials.

Referee scripts (scratch, not part of the lane): `/tmp/ref_c3rs/ref.py`, `ref2.py`, `small.py`, `stein.py`; all run through `scripts/memcap.sh 8` with `.venv-arb/bin/python`. Nothing was run on the server.

## 1. Re-derivation of the labelled steps

| step | label in RESULT | referee |
|---|---|---|
| (E1) argument principle on the rectangle to Re s = 3 | CLASSICAL | Confirmed. On Re s = 3, sum_{n>=2} n^-3 = 0.202 < 1, so the right edge contributes O(1). Code matches the formula (`SMAX - 0.5` is an offset from 1/2). |
| (E2) Littlewood's lemma | CLASSICAL | Confirmed as an identity. The "iff" is loose: the edge term is O(log N / H), not O(1/H) uniformly in N, and a zero at distance d from the line contributes 2 pi d / H, so the log-mean detects zeros only down to d of order (log N)/2 pi. The exact criterion is the identity, not the "iff". |
| (E3) d/dt arg f = Re[sum log(N_t/n) a_n n^-s / F_N], lower bound for real zeros of Z_N | PROVED | Re-derived: d/dt arg F_N(1/2+it) = Re(F'/F), F' = -sum a_n log n n^-s, plus theta'. Correct. The error term is O(log N) (horizontal edges), not O(1); this does not affect anything used. The identity is the standard Siegel/Levinson counting step and is not new. |
| (E4) Gaussian model: P(D<0) = (1-r)/2, right density = sum a^2 log n/n / (2 pi sum a^2/n) | ARGUED | Both formulas re-derived for jointly circular Gaussian (F, H): H = (c_1/c_0) F + W, Re(W/F) has the two-degree Student law, giving (1 - c_1/sqrt(c_0 c_2))/2; E[G/F] = cov/var. Sharp cut-off limits sqrt(3)/2 and (log N)/(4 pi) confirmed; at N = 398942 the referee gets r = 0.86646, fraction 0.06677, density 0.98145, Z density 4.10511 (table: 0.0668, 0.9815, 4.1051). **But the model is the wrong model for these families and the conclusion drawn from it is false; see section 3.** |
| Plan: "Hermite-Biehler position holds iff F_N is zero-free right of the line and arg f is increasing" | unlabelled | Only the direction "HB inequality implies F_N zero-free in Re s > 1/2" is used, and it is trivial (abs F_N(s) > abs chi F_N(1-s) >= 0). The converse is not proved in the result and is not needed. It should be labelled, or cut to the direction used. Also N depends on t, so the statement is per constant-N segment; the code handles this by segments. |
| Certification (interval Newton, 128 bits) | CERTIFIED | `certify.py` read: centre is exact (integer T0 + float offsets), F'(D) is enclosed on the square, test is N(D) inside the interior of D and D inside Re s > 1/2. Sound. The certificate does not itself prove the listed zeros are pairwise distinct; the referee checked the stored lists: in all ten certified windows no two listed zeros lie within 1e-3 in height, the squares have half-side <= 1e-6, so they are disjoint. **The certified counts (5372, 7260, 8835 for zeta; all control rows) are rigorous lower bounds for the number of zeros of F_N with Re s > 1/2 in the window.** Upper bounds (no further zeros) rest on float64 windings, as RESULT states in weakest step 3. |
| Table versus files | - | All certified/attempted/winding/Newton totals in the tables match `server/cert_*.json`, `server/res_*.json`, `summary.json` and the unit logs. No failed certificate, no unresolved phase step. |

## 2. Independent rerun at a different case (height 3e7, not in RESULT)

Own evaluator (plain float64 phases, no shared code), own adaptive winding count on the rectangle [1/2, 4] x [T, T+H], own Newton search, own arb test (160 bits).

| family | N | H | winding count | ratio to Z density | frac D < 0 | mean log abs F | note |
|---|---|---|---|---|---|---|---|
| zeta | 2185 | 400 | 187 | 0.191 | 0.0880 | 0.2190 | between the RESULT values at 1e6 (0.187) and 1e8 (0.204) |
| zeta | 2185 | 100 | 51 | 0.208 | 0.0984 | 0.2295 | Newton list 51 = winding 51; Littlewood sum 0.2416 (edge term at H = 100); none right of 1/2 + 2/log N |
| DH | 4886 | 400 | 191 | 0.177 | 0.0746 | 0.2469 | RESULT: 0.164 at 1e8, 0.174 at 1e10; 11 zeros right of 1/2 + 2/log N, none right of 4.4/log N |

All winding counts are integers to 1e-13. Arb test on the referee's zeros: zeta H = 400 sample 11/11, DH 12/12, zeta H = 100: 46/51 (the 5 failures are the referee's float64 centres at height 3e7 with radius 1e-7, not a defect of the lane, which uses arb base phases). A chi_5 run at the same height was started and not finished in the time available; it is reported as not completed. The headline (about one right zero of F_N per five zeros of Z, DH not above zeta) is reproduced.

## 3. Errors

**Error 1 (substantive; sections 2 (E4), 5, 6, 8, and weakest step 2). "Only abs(a_n) enters", "the property does not see multiplicativity", "the measured statistics do not order the families by multiplicativity" are false.** The independent-phase model of (E4) is not the right limit object: the phases n^(-it) are multiplicative in n, and for fixed N the exact limit law is the Bohr torus (p^(-it) independent over primes, extended multiplicatively). Referee Monte Carlo, 120000 samples, columns (fraction D < 0, right-zero density, mean log abs F):

| family, N | multiplicative phases (Bohr) | independent phases (E4) | measured in RESULT |
|---|---|---|---|
| zeta, 398 | 0.0985, 0.397, 0.230 | 0.0677, 0.427, 0.657 | 0.0880, 0.357, 0.215 (1e6, H = 2000) |
| chi_5, 891 | 0.0898, 0.427, 0.207 | 0.0655, 0.463, 0.632 | 0.0865, 0.405, 0.196 (1e6, H = 200); 0.0895 at 1e8 |
| DH, 891 | 0.0614, 0.334, 0.205 | 0.0669, 0.410, 0.360 | 0.0656, 0.373, 0.195 (1e6, H = 300); 0.0663 at 1e8 |

The Bohr model reproduces the "zeta-specific excess" of the negative-phase fraction (0.09 to 0.10 against 0.067), puts DH below the Gaussian value, and gives mean log abs F near 0.2 where the independent model gives 0.66 (the independent model matches only the `rand` row, 0.81 measured). So:
- The excess that RESULT calls "not explained here" (section 3(b), weakest step 2) is a multiplicativity effect: it appears exactly for the completely multiplicative coefficient sequences (zeta 0.098, translate 0.108, chi_5 0.090 at 1e8) and not for DH (0.066) or random signs (0.065). RESULT's own control table shows this ordering.
- The statistics therefore do see multiplicativity, **with the wrong sign**: the multiplicative families are farther from Hermite-Biehler position on the phase-derivative statistic than the non-multiplicative ones. This strengthens the obstruction and is consistent with "DH is nearer to passing than zeta", but the stated reason (second moments of abs a_n only) is wrong, and section 8's "all controls fail alike, for the same second-moment reason (E4)" should read "for a reason not confined to second moments; multiplicativity changes the size of the failure and does not remove it".
- The Monte Carlo is a model at fixed N (the matched regime N = sqrt(t/2 pi) is outside the range where the Bohr limit is a theorem); it is MEASURED support, not a proof. Agreement with the lane's measured values is within 10% on the fraction and on mean log abs F, 5 to 10% on the density.

**Error 2 (minor; weakest step 1).** "positive once it has a zero in the polydisc, e.g. N >= 4": the threshold is N >= 3. 1 + 2^-s + 3^-s has zeros with Re s > 1/2 (2^-1/2 + 3^-1/2 = 1.284 > 1); the referee found zeros at 0.600166 + 1010.017757 i, 0.597555 + 1763.791502 i and three more (mpmath, residual 1e-28). The sentence is not false as an example but states the wrong onset.

**Error 3 (labelling; headline and claim line).** "Positive density ... in every matched window tested" is one window per height (six heights for zeta). "Height-uniform failure" is MEASURED at six heights and is stated with that label in sections 8 and 9; the headline sentence "the family is closed for zeta" should carry the same qualifier: closed on the evidence of certified windows at t <= 1e12 plus the fixed-N limit theorem, not by a proof at matched height. The trend of the ratio (0.169, 0.177, 0.187, 0.204, 0.215, 0.215) is increasing or flat, so nothing in the data points to the count vanishing.

**Not errors, but to be stated:**
- Prior literature is not cited. The object F_N(s) + chi(s) F_N(1-s) and the role of the zeros of F_N right of the line in a Levinson-type count were studied before (Spira's computations of zeros of the approximate functional equation in the 1960s; Gonek and Montgomery on zeros of this family of approximations; Montgomery, Montgomery-Vaughan, Gonek-Ledoan on zeros of partial sums). The referee cites these from memory and did not check the exact statements; RESULT's "new relative to the map" is a statement about the campaign's internal map only and should say so. Nothing in RESULT presents a classical theorem as its own.
- The "translate" control (coefficients n^(-3 i T0), length from T0) is the zeta half-sum at height 4 T0 with half the matched length. It is a unimodular-twist/unequal-length row, not a control with different arithmetic. Its ratio 0.221 is computed against the Z density at T0, not at 4 T0.
- DH/zeta ordering: at H = 1e4 the difference (4743 against 5372 after normalising, 0.164 against 0.204) is well outside counting noise; in the referee's H = 400 window (0.177 against 0.191) it is inside noise. "Slightly closer" is the right strength.
- Controls not run in RESULT (backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, theta^w): the justification given ("by (E4) the failure depends on abs(a_n) only") falls with Error 1. The correct justification is the one RESULT also gives: these controls matter only for a family that passes for zeta, and zeta fails by certified count.
- Sections 4 (Gabcke terms, close pairs, x >> t argument) are MEASURED/ARGUED and were not rerun; they are not load-bearing for the verdict.

## 4. Checks requested by the assignment

- Assumes RH: no. Restates verified height: no. Known theorem presented as new: no (missing citations, see above).
- Zeta-only mechanism claimed: none is claimed. The referee ran DH and the random-multiplicative model anyway; the outcome is Error 1 (there is a multiplicativity dependence, adverse in sign).
- Statement about zeros of zeta: none.

## 5. Requirement flags (referee's own setting)

- R1 (all primes together, multiplicativity essential): **false.** Multiplicativity changes the statistics (Error 1) but in the adverse direction and without producing the property; no step uses it to obtain a conclusion.
- R2 (uniform in height, every window): **false.** No positive conclusion exists; the failure is measured in one window at each of six heights.
- R3 (fails for every control for a structural reason): **false.** The property fails for zeta itself.
- R4 (passes from finite stages to the critical line): **false.**

## 6. Outcome

holds = true for the claimed verdict (precise obstruction: F_N is not in Hermite-Biehler position in the certified windows; certified right-zero counts 5372 / 7260 / 8835 are rigorous lower bounds; the family gives nothing for zeta), **with corrections required**: replace (E4)'s "only abs(a_n) enters" and the section 5/6/8 sentences built on it by the Bohr-model statement of Error 1; fix the N >= 3 onset; qualify "closed" as measured/certified at t <= 1e12; add the literature note.
