# c16-referee-r15-j1prime-u8-screening: RESULT

Round 16, kind: repair (lane A). Independent referee work; no attack; the headline cannot move and does not.
Nothing in this directory is a statement about zeros of zeta. Labels: PROVED (argument written in the named
file), CLASSICAL (recalled, not opened), MEASURED (floating point, no certificate).

## 0. Verdict

**Partial result (referee lane).** Twelve items were refereed by derivations and code written in this lane.
No statement labelled PROVED is broken. Eleven sentences are false as written (section 3); two of them are in
campaign files. Lemma J1' holds. The U8 heat-inheritance exclusion holds and is one case of an exact rule
(Lemma H, new, one referee): a monomial inequality on a kernel without polar terms is either inherited by every
backward-heat member or passed by all members with `abs(tau) <= tau* = 4 abs(log(lam/M))/abs(S)`. A U8 search
may run in round 17 in restricted form (section 2, item 3). The claim of the screening arm "every functional of
the on-line ordinates takes the same value on zeta and T-NR" holds with a scope line; its summary "every
separation was one of four kinds" does not hold as worded for the three lanes sampled: a fifth kind occurs.

Requirement flags of this lane: R1 false, R2 false, R3 false, R4 false (section 5). Score 0.

## 1. Plan and what was done

Decisive test first (assignment): three numeric claims per screening lane recomputed with own code, on the
server where the scale asked for it. Then, in this order: Lemma J1' and the U8 exclusion (they gate a round-17
compute item); control ZQ; the PROVED statements of round-15 lanes 1 to 6. All six round-15 lanes
already had one independent report by the time of this pass (contrary to the assignment's note). For lanes 1,
3 and 6 my derivations were made before that report was read; for lanes 2, 4 and 5 the first report was read
together with the lane, so "independent" there means own derivation and own code on different cases, not
blindness to the first report. Agreement and differences are recorded per file.

Runs. Local (`scripts/memcap.sh 8`, `.venv-arb`, each below 0.5 GB): `code/loc_screen.py` (zeros table read as
text), `code/loc_zq.py`, `code/loc_lemmas.py`, `code/loc_unimodular.py`, and two inline runs kept only as output (`loc_reflection.json`,
`loc_haarvar.json`). Server, through `rhrun` only, 8 cores and 12 GB each, `rhstatus` checked before each launch:
`rh-c16ref-1119212121` (`code/srv.py`: stages B and C finished and are used; stage A was stopped by me after
27 minutes for two reasons: its projected run time was above four hours, and a local comparison showed that
its root refinement could return a bracket midpoint, error 0.008 in one zero of the test; no number of stage A
is used) and `rh-c16ref2-1119214854` (`code/srv2.py`, corrected and six
times cheaper: zeros of L(s, chi mod 5) and of Davenport-Heilbronn on the line by sign changes on a grid of
step 0.03 with hidden-pair detection, staged at T = 1e4, 2e4, 3e4). Stage T <= 1e4 finished (719 s) and is used below. The unit was stopped by me 57 minutes after launch, during stage T <= 2e4, because the load average of the server had risen to about 200 and the unit was receiving about 1.2 cores; stages 2 and 3 produced no output. Both units are inactive.
The zeros found by `srv2.py` were checked against a direct evaluation (`abs DH <= 1.2e-10`,
`abs L <= 1.4e-10` at all 418 zeros below 300).

## 2. Table of items

"Referees" = number of independent derivations on file after this lane (the author's own passes not counted).

| # | item | ruling | exact corrected sentence (or scope line) | referees | file |
|---|---|---|---|---|---|
| 1.1 | `c15-edge-argument-strip-width-hecke-amplified`: Lemma 1, (2), (I), Lemma 2, Proposition A (a) to (d), Proposition C | holds with corrections | "For the unimodular parameters `alpha_p = i` one has `tau(p) = 0`; for `alpha_p = i p^(-delta/2)` it is `-i (p^(delta/2) - p^(-delta/2))`." Verdict: "closed for `T >= N`; `T < N` open." | 2 | `REFEREE2_c15-edge-argument-strip-width-hecke-amplified.md` |
| 1.2 | `c15-control-with-zeta-fe-classes-u1-u2`: Lemma A, D, L, forced exponent, section 6 statement | holds with corrections | see item 2 | 2 | `REFEREE2_control-zq.md` |
| 1.3 | `c15-u5-window-count-threshold-translate-control`: translate identity, Lemma 1, Lemma 2 (existence), combination identity, Lemma 4 | holds with corrections | "Among translates with `abs(alpha) <= T/2` no other does better; the reflected translate `alpha = -2c` has defect `L^2/(8T)` and is better on spans shorter than `8 pi/log(T/2 pi)`, so `K_tr = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + o(1))`." | 2 | `REFEREE2_c15-u5-window-count-threshold-translate-control.md` |
| 1.4 | `c15-u7-growing-section-twin-ladder-bridge`: Lemma 2, Theorem 1, Lemma 3, Proposition 4, unconditional range | holds with corrections | "For `0 < c <= 2` the symmetric factor has its zeros on the line and adds non-negative terms; this is not the control T-NR (`abs c > 2`), for which the statement fails through the off-line zeros of the factor." | 2 | `REFEREE2_c15-u7-growing-section-twin-ladder-bridge.md` |
| 1.5 | `c15-nonhomogeneous-pair-triple-kernel-search`: Lemmas J1-Q, J1-L, reflection nodes | holds (the three PROVED statements); counts corrected | "Nine-class tier: 752 = 360 identity + 392 in balls; six-class tier: 2,774 = 360 identity + 2,414 in balls." | 2 for the lemmas; the measured outcome was not rerun | `REFEREE2_c15-nonhomogeneous-pair-triple-kernel-search.md` |
| 1.6 | `c15-klein-transport-lemma-w-stage-a-and-e1`: W1, W2, W3, Theorem E1' | holds with corrections | "Each zeta zero at signed offset e gives zeros of E_a0 at offsets `e + a0`, `e - a0`, and `T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(2A a0)`; so the sum is at least `2N(T) T^(2A a0)`." K1 not re-derived here | 2 (W1 to W3, E1'); 1 (K1) | `REFEREE2_c15-klein-transport-lemma-w-stage-a-and-e1.md` |
| 2a | ZQ: zeta's functional equation | holds | - | 2 | `REFEREE2_control-zq.md` |
| 2b | ZQ: every prime-power atom of log zeta | holds, in the reading "on the atoms" | "ZQ is not an Euler product; its coefficient measure is Lambda plus an absolutely continuous density." | 2 | same |
| 2c | ZQ: defect bound | holds | "`sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2`, and `abs D <= 8` for all parameters" (the form "O(eta^2 + d^2)" needs eta bounded away from 1/2) | 2 | same |
| 2d | Lemma L with the pole clause | holds | the clause "no pole other than s = 1" is necessary (control G_+); "infimum 0" needs "a positive proportion of zeros simple and on the line", not the mean gap of all zeros | 2 | same |
| 3a | Lemma J1' (LIFT_RULING section 5) | **holds as stated** | hypotheses to write: kernel values divided by are non-zero at the nodes; invariance is needed only for `c_i = exp(tau u_i^2/4)` | 2 | `REFEREE2_lemma-j1prime-u8-heat-inheritance.md` |
| 3b | U8 heat-inheritance exclusion | **holds**; extended to Lemma H | "`M <= lam` is inherited by every tau < 0 iff `lam S >= 0` or `M lam <= 0`; otherwise it holds exactly for `abs(tau) <= 4 abs(log(lam/M))/abs(S)`." | 2 for the filed case; 1 for Lemma H | same |
| 3c | may a U8 search run in round 17 | yes, restricted | conditions 1 to 5 of section 3 of that file: monomial, two-term and equal-S functionals leave the dictionary; HEAT column from zeta's values alone with `tau*(F)` recorded; tau ladder below 0.02; balls for the margin; polar-term readings registered separately | - | same |
| 4a | `s1-zero-statistics-gram` | holds with corrections | scope lines 1 to 3 on the "=" cells; separations: kinds 1, 3 and a fifth kind | 1 (first referee of a screening lane) | `REFEREE2_s1-zero-statistics-gram.md` |
| 4b | `s1-scattering-one-line` | holds with corrections | separations: kinds 3, 4 and the fifth kind | 1 | `REFEREE2_s1-scattering-one-line.md` |
| 4c | `s1-prime-torus-orbit` | holds with corrections | "The exact Haar variance at sigma = 1/2 is `(1/2) sum_{p<=P} Li_2(1/p)` = 0.971 ... 1.590 for P = 1e2 ... 1e7; the sampled column 0.988 ... 1.630 is high by 0.02 to 0.04." Separations: kinds 1, 2, 3 and the fifth kind | 1 | `REFEREE2_s1-prime-torus-orbit.md` |
| 4d | "every functional of the list of on-line ordinates takes the same value on zeta and on T-NR" | holds, with a scope line | "... for `abs c > 2`, where the functional reads the list alone; a statistic that also uses the object's own counting function or conductor separates T-NR through its `T log q/pi` further zeros, which is a zero count." | 1 | the three screening files |
| 4e | "every separation found was one of four kinds" (STRATEGY section 0b) | **false as worded** for the sample | see section 3, sentence 1 | 1 | this file |

## 3. Sentences false as written

State of the files at 13:40 PST, 2026-11-19 (lane 2 had been corrected by `c16-repair-owed-record-r15` at 13:31).

1. `campaign/STRATEGY.md` section 0b: "Every separation found was one of four kinds: the control's own off-line
   zeros read at the explicit-formula scale (cutoff at or above the height); coefficient size readable right of
   1; a count of on-line zeros; a mean value." In the three lanes sampled there are separations of a fifth
   kind (Davenport-Heilbronn and T-NR at Haar level in `s1-prime-torus-orbit` tests 1 and 4C; the variance of
   `arg DH(1 + it)` in `s1-scattering-one-line` test 1; `c(6) != 0` in `s1-zero-statistics-gram` row 3b), and
   the small-gap exponent (row 1b) is a proportion of close on-line pairs, not a count against N(T).
   Corrected sentence: "Every separation found in the lanes refereed so far was one of five kinds: (1) the
   explicit-formula regime, i.e. zeros at the height of the test read with a cutoff or certificate order at or
   above what that height requires; (2) coefficient size readable right of 1; (3) a statistic of the list of
   on-line ordinates over a long range (count against the counting function, deficit of sign changes,
   proportion of close pairs); (4) a mean value; (5) a property of the coefficients alone (a broken
   multiplicative relation, the Haar law of the torus function), which restates the input 'not zeta's Euler
   product'."
2. `campaign/STRATEGY.md` section 0b: "defect an absolutely continuous density of sup size O(eta^2 + d^2)".
   Corrected: "of sup size at most `8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2`".
3. `c15-u5-...` verdict item 1: "and no translate other than the near-identity ones does better." Corrected in
   row 1.3.
4. `c15-edge-...` section 3, S4: "`alpha_p = i p^(-delta/2)` one has `tau(p) = 0`". Corrected in row 1.1.
5. `c15-u7-...` section 2: "T-NR has no Euler product." Corrected in row 1.4.
6. `c15-u7-...` section 6, R3: "unimodular twists pass" (first referee: 4 of 4 random unimodular twists
   violate; rerun here: 6 of 6 at t near 2000, P = 2000, `loc_unimodular.json`). Corrected: "Dirichlet characters pass under GRH; the campaign's unimodular
   control violates the stage statement at theta >= 1."
7. `c15-klein-...` section 2: "E_a0: all 2N(T) zeros at distance a0". Corrected in row 1.6.
8. `c15-klein-...` section 4: "uses no property of F beyond analyticity and a non-vanishing trace" (first
   referee; not rechecked here). Corrected: "uses the functional-equation symmetry, order one and a
   non-vanishing trace; no Euler product."
9. `c15-nonhomogeneous-...` sections 0, 2, 6: "280 by reflection identity, 472 in balls" and "280 identity,
   2,494 read". Corrected in row 1.5.
10. `s1-prime-torus-orbit` section 2.1: "pointwise variance 0.97 ... 1.63 = (1/2) log log P + 0.21 to within
    0.02". Corrected in row 4c.
11. `s1-zero-statistics-gram` table, rows 1a to 2, cells "LIOU =" and (row 1a) "T-NR =": corrected by scope
    lines 1 and 3 of its referee file.

Already corrected in place by another lane and confirmed here: the three sentences of `c15-control-...` that
dropped the pole clause of Lemma L.

## 4. Controls

This lane has no device, so the control battery is not run against an argument. What the rules ask of a
referee lane was done: every PROVED lemma about a control object carries a numeric non-vanishing check.

| control object | lemma refereed | non-vanishing check (MEASURED) |
|---|---|---|
| ZQ | functional equation, atoms, defect bound | `abs zeta` at the quartet point 0.0595 and 0.323; `abs ZQ` at the removed zero 0.0812 and 0.517; `ZQ(2)` = 1.64493410581, 1.64500677; `m(1), m(-2), m(-4)` non-zero |
| G_+ (Lemma L without the pole clause) | `D_+ >= 0` with off-line zeros | functional-equation defect 7e-29; poles at `1/2 +- b` (4.9e33 at distance 1e-10) |
| HEAT pair (J1', Lemma H) | common positive multiplier; `M_tau = exp(tau S/4) M` | `Phi_zeta >= 1.1e-241 > 0` on [-2.6, 2.6]; `abs K_chi`, `abs K_(chi^2)` at least 0.25, 0.11 of their maxima on [-1, 1]; function-side operator series against the transform of `g Phi`: 1.6e-41 |
| T-NR | on-line zeros are zeta's | `min (c + 2 cos(t log 3))` = 0.2 for c = 2.2; off-line zero 0.9037532 + 2.8596009 i |
| translate combination `(zeta(s) - zeta(s + i alpha))/2` | zero off the line in the span | root 0.894706598618937 + 10084.7783526514 i with `abs zeta` = 0.456 there (the parts do not vanish) |
| Davenport-Heilbronn | first off-line zero; on-line count | `abs DH` = 6.5e-7 at 0.808517 + 85.699348 i, 0.357 on the line at that height; on-line zeros below 2000: 1861 (L(chi): 2028) |
| E_a0, T-NR against Lemma W | sum at least `2N(T) T^(2A a0)`; `T log q/pi` zeros at distance b | b = 0.32385 (q = 2, c = 2.0506) |
| bridge ratio (Theorem E1') | Schur iff companions | sup 0.99999 with the companion, 38.9 without |

Davenport-Heilbronn, backward heat, T-NR, E_a enter only as objects of the lemmas above; sign twists,
unimodular twists, Beurling systems, the phase-rotated transfer operator and theta^w do not occur in any
statement refereed here.

## 5. Requirement flags (this lane)

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument about zeta; Lemma H and J1' are statements about a multiplier and use nothing arithmetic |
| R2 (height-uniform, every window) | false | no statement at height |
| R3 (every control fails structurally) | false | the lane confirms controls that pass (ZQ, HEAT on the J1' and Lemma H classes, T-NR on functionals of the on-line list) |
| R4 (reaches the critical line) | false | nothing crosses |

## 6. Three weakest steps

1. **Lemma H and its corollaries have one derivation (this lane).** The decision "a U8 search may run,
   restricted" rests on it and on the continuity remark (C1); the claim that three-term and higher functionals
   are not closed is a statement of what was not proved, not a theorem.
2. **Screening recomputations are samples.** Three to six numbers per lane; Davenport-Heilbronn to
   T = 10000 against the lane's 1e6; the HEAT lists, the high zeta blocks, the 1e10 sieve and the lattice
   search to 1e12 were not rerun. The fifth-kind finding is a reading of the lanes' own tables.
3. **Parts not re-derived:** K1 of the Klein lane (source not opened), the paper runs of the ZQ lane against
   rows Z34, Z36, P53, and the measured outcome "none" of the kernel search. Classical inputs (Maass-Selberg,
   Iwaniec's covering bound, Landau's theorem, the proportion of simple on-line zeros, Laguerre's rule) are
   recalled, not opened. All numerics are floating point without certificates.

## 7. Files

`REFEREE2_*.md` (eleven files: six round-15 lanes, control ZQ, Lemma J1' and U8, three screening lanes);
`code/` (`loc_screen.py`, `loc_zq.py`, `loc_lemmas.py`, `loc_unimodular.py`, `srv.py`, `srv2.py`, `t0.py`); `loc_screen.json`,
`loc_zq.json`, `loc_lemmas.json`, `loc_lemmas.log`, `loc_reflection.json`, `loc_haarvar.json`, `loc_unimodular.json`;
`srv_job1_BC.json` (server, stages B and C), `srv_smoke_local_T60.json` (same stages run locally),
`srv2_out.json` and the two zero lists (server); `lanes.jsonl` (one line; not appended to the campaign file).
No file outside this directory was edited.
