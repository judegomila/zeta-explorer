# c17-referee-r16-lemma-h-sources: RESULT

Round 17, kind: repair (independent referee lane). Date 2026-11-20. No attack; nothing in this file is a statement
about zeros of zeta; no bound moves; the headline is unchanged. Labels: PROVED (argument written in the file
named), CLASSICAL, MEASURED-ball (python-flint), MEASURED (mpmath or float64).

## 0. Verdict

**Lemma H HOLDS (second independent referee; `REFEREE2-lemma-H.md`, first line `HOLDS`). The five round-16 lanes
hold with corrections; second independent referee files `REFEREE2.md` are written in each lane directory. Four
new corrections (two constants, one table row, one status sentence). No requirement flag changes in any lane.**

| item | verdict | main lemma re-derived | check rerun or run | new corrections of this pass | flags |
|---|---|---|---|---|---|
| Lemma H (`c16-referee-r15-j1prime-u8-screening`) | **holds** (exact rule: all tau < 0 iff `lam S >= 0` or `M lam <= 0`; otherwise exactly `abs(tau) <= 4 abs(log(lam/M))/abs(S)`) | from `M_tau = exp(tau S/4) M`, six sub-cases | balls, 80 parameter points on zeta, a cubic character mod 7, an E_a member: 732 decisions, 0 disagree, 0 undecided; heat lift checked on the function side at one point | none; four hypotheses to carry in one-line quotations | none stated; unchanged |
| `c16-u6g-scattering-fe-rank2-bridge-stage-a` | holds | Lemma R (limit formula), Lemma S | lane's `ref_checks.py` reproduced exactly; own implementation of the 36-term form: Lemma R to 1e-12, form (*) to 2e-10 | E_a row: Lemma R (a) applies at the pole 1 + a only (residue at 1 - a is negative; limit positive at T = (0, 2)) | unchanged (all false) |
| `c16-ctheta-proposition5-power-sum` | holds (window form) | Theorem B, Lemma T steps 1 to 3, Lemma R | lane's `ref_checks.py` reproduced; Theorem B on five new rows (1e-7 to 3e-6, inside the truncation tail); Turan inequality 60,000 trials, smallest ratio 78.7 | coefficient of log log gamma: 2/(1 - kappa) and 4/(1 - kappa), not 1 and 3 (three sentences); Lemma R has the sharper bound 8 (cosh(ub) - 1)/(u y^2) | unchanged (all false) |
| `c16-qa-filter-silent-cells-geometric-nodes` | holds | density D, both bounds of Lemma QA (b), Proposition M | lane's `ref_check.py` reproduced (52 of 52 values); sup abs D on three new cases | none new. Proposition M's constant: e/(4 sqrt 2) = 0.4805, correct for the sup hypothesis and the exact leading constant of the family (sup abs D = 32 e^-2 eta^2 to leading order); first referee's E1 (0.166 in the norm p) confirmed | unchanged (all false) |
| `c16-dn-canonical-tier-ball-conversion` | holds (outcome "none") | code path of the A1 status (no lemma) | server: 500 random nodes of the 22,508, every training entry in balls: 500 of 500 T-train; hold-out reads on ball intervals equal to the lane's at 500 of 500; all 86 flagged nodes T-train and flagged | "Status in balls: 22,508 of 22,508" stays false as written; replacement sentence supplied | unchanged (all false) |
| `c16-amplifier-below-truncation-eisw-compute` | holds | Lemma U (a) to (d), formula (U2) | (U2) against two-dimensional quadrature, own code, 1e-26; lane's C3 on four new cells with T < N, server: Gram matrix against quadrature to 1.0e-14 | none new (first referee's 5.1 stands: closure for all N is measured, not proved) | unchanged (all false) |

Source check (generic search terms): Turan's second main theorem in the form used by the ctheta lane (nodes
ordered by decreasing modulus, abs z_1 = 1, bound 2 (n/(8e(m + n)))^n times the minimum modulus of the partial
sums of the coefficients) is stated in that form in the encyclopedia article "Turan's method" (Wikipedia), which
cites Montgomery, Ten Lectures (1994) and Turan's book (1984). Confirmed at secondary level; the primary sources
were not opened; the extracted text did not show the range of nu for the second theorem (it shows
M + 1 <= nu <= M + N for the first).

## 1. Plan

Order as assigned. (1) Lemma H first: derivation from the definition of the heat family before opening the
author's proof; ball test; verdict file. (2) For each of the five lanes: re-derive the main lemma on paper, write
an independent numeric check where one is possible, rerun one of the lane's checks on a copy (outputs under this
directory, no lane file overwritten), list sentences false as written. (3) Source check for Turan's theorem.
The DN item (500 nodes in balls) and the amplifier check on new cells ran on the server through `rhrun`.

## 2. Work

### 2.1 Lemma H

`REFEREE2-lemma-H.md`. Derivation: section 1 there (six sub-cases; the complement of the inherited cases is
`lam S < 0`, `M lam > 0`, where `tau*` is defined). Test: `code/lemh.py`, outputs
`lemh_zeta_chi7_chi7flip.json`, `lemh_Ea_def.json`. The member's monomial is built factor by factor from member
values; decisions are ball comparisons. All six sub-cases occur; at every threshold point the bound holds at
0.999999 tau* and fails at 1.000001 tau*. The lift itself is checked at tau = -0.3, z = 3.7 for zeta: kernel
side and Gaussian average of xi agree to 1.5e-20 (ball integrals).

### 2.2 The five lanes

Per-lane files: `push/<lane>/REFEREE2.md`. Own checks: `code/indep.py` (`indep.json`), `code/indep2.py`
(`indep2.json`). Reruns of lane scripts on copies: `rerun/u6g`, `rerun/qa`, `rerun/ctheta`, `rerun/amp`.
Server: `code/ref2_feas.py`, `code/ref2_feas2.py`; outputs `dn_out_feas500.json`, `dn_out_feas500b.json`;
unit logs in `server_logs/`.

Specific items of the assignment:
- **DN lane, the 22,508 float64 T-train nodes.** Sample of 500 (seed 171700; 351 b2-with, 149 b5l-with): with all
  554 training entries in balls, 500 of 500 at T-train, no entry undecided (128 bits at 347 nodes, 256 at 153).
  The float64 feasible interval is contained in the ball interval at 500 of 500 nodes and is narrower by more
  than 0.1 per cent at 44; hold-out reads on the ball intervals: primary 0 hold out, exit classes and count
  statistics equal to the lane's at 500 of 500; secondary read flags the same 86 nodes. Sampling bound: below
  0.6 per cent of the 22,508 would change, at 95 per cent confidence.
- **Proposition M's constant 0.48.** e/(4 sqrt 2) = 0.480529; correct for the hypothesis
  `nu_G >= nu_zeta - eps dx` (sup condition), and exact to leading order for the family. Measured
  eta/sqrt(sup abs D) = 0.4799, 0.4805, 0.4797 at eta = 0.002, 0.01, 0.05. In the norm p of Lemma QA (b) the
  constant is 0.166 at sigma_0 = 1 (first referee's E1).
- **Amplifier lane, closed Gram formula at T < N.** (U2) re-derived by the substitution t = c^2 u y and checked
  to 1e-26; formula (G) against the lane's fundamental-domain quadrature on (T, N) = (1, 5), (1, 6), (2, 5),
  (2, 7), at a zero and at an off-line point: largest relative entry error 1.0e-14.

### 2.3 Sentences false as written (all lanes; N = new in this pass, others confirm the first referee)

1. N, u6g table row E_a: "S4 through Lemma R with p = 1 +- a". True at p = 1 + a; at p = 1 - a the residue is
   negative and Lemma R (a) does not apply (a = 0.2: limit +0.0346 at T = (0, 2)).
2. N, ctheta Remark (ii): "changes it to 3 log log t". The bracket of (T) has 2 log log t for M = C log^2 t.
3. N, ctheta Remark (iii) and section 3, first bullet: "b <= (c + log log t + log(M + 1))/(theta log t)". The
   coefficient of the logarithms is 2/(1 - kappa) > 2.
4. N, ctheta section 3, last paragraph: "(c_1 n + 3 log log gamma + c_2)/(theta log gamma)". Coefficient
   4/(1 - kappa) > 4.
5. DN RESULT section 5, section 0 (row A1) and section 11: "status in balls 22,508 of 22,508" / "ball
   certification of the 22,508 float64 T-train nodes". Supported statement: float64 status; all-entry ball
   confirmation at 50 + 500 sampled nodes and at the 86 flagged nodes.
6. u6g: "BLS-right (unpaired zeros, Re a > 1/2, including Re a > 1): none found" (false for an odd number of
   real zeros; reproduced: 8 and 16 of 150 diagonals negative for a single real zero at 0.75 and 0.55).
7. qa outcome item 2: "margin eps in the density norm ... 0.48 sqrt(eps)" (0.48 is for the sup hypothesis).
8. ctheta: "0.91" with "0.29 delta" (2 x 0.91/(2 pi) = 0.2897; the constant holds with the true minimum 0.9194).
9. amplifier verdict line: "the open item of family 31 closes" (measured on the grid; open for all N).

## 3. Controls

No argument about zeta is made in this lane, so no control is run against a step. What the refereed statements
say about controls is unchanged: Lemma H is a statement about the backward-heat control (a monomial bound with a
positive margin is passed by all members with `abs(tau) <= tau* > 0` or by all members); in the u6g lane E_a
fails through the pole at 1 + a, and BLS-sym, BLS-right with non-real zeros and EIS-w pass; in the ctheta lane
ZQ passes in the window and T-NR passes below q^(1/theta); in the qa lane ZQ passes every atom-read step; in
the DN lane HEAT is not rejectable at 37,634 nodes; in the amplifier lane EIS-w shares every measured effect.

## 4. Requirement flags (this lane)

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | referee work; Lemma H uses nothing arithmetic |
| R2 (height-uniform, every window) | false | no conclusion of that form |
| R3 (every control fails structurally) | false | the refereed lanes record controls that pass |
| R4 (reaches the critical line) | false | not addressed |

No requirement flag of any of the six refereed items changes.

## 5. Compute record

Local: all runs through `scripts/memcap.sh 8` with `.venv-arb/bin/python`, single process, each under 2 minutes.
One first version of the Lemma H script ran 5 minutes without finishing (an integrand that returned non-finite
balls) and was stopped by process id; the corrected script takes under 2 seconds.
Server, through `rhrun` only, `rhstatus` read before the first launch (slice at 9 GB):
`rh-c17ref-dnfeas-1120003942` (failed at start: code not copied, a zsh modifier in the rsync target; no
computation), `rh-c17ref-dnfeas-1120004039` (8 cores, 12 GB, 231 s), `rh-c17ref-dnfeas2-1120004816` (8 cores,
12 GB, 679 s), `rh-c17ref-ampC3a-1120005039`, `rh-c17ref-ampC3b-1120005039` (2 cores, 8 GB, under 2 minutes).
All units ended by themselves; none is running. Planned memory printed by the drivers (below 3 MB of float64
blocks per worker). GPU not used. The c15 lane's stored files on the server were read, not written.

## 6. Three weakest steps

1. **The DN confirmation is a sample and uses the lane's ball kernels.** 500 of 22,508 nodes; the enclosure of
   the HEAT kernel with polar terms omits a theta tail (lane's weakest step 2). The statement is "float64 status
   agrees with the lane's balls on a random sample", not an independent certificate.
2. **Turan's theorem is confirmed at secondary level only.** The form and the constant 8e match an encyclopedia
   article citing Montgomery and Turan; neither book was opened, and the range of nu for the second theorem was
   not visible in the extracted text. Random trials do not contradict it. Lemma T's constants depend on it.
3. **The Lemma H ball test cannot detect a wrong identification of the lift.** It tests the case analysis on
   kernel values of both signs. The identification "pointwise Gaussian multiplier = backward heat member" is
   checked at one (tau, z) for zeta; for the character and E_a kernels it is the registered definition. Also:
   the u6g and amplifier reruns use the lanes' own Gram and quadrature code (the independent parts are the
   derivations, the 36-term form and the crossing integral).

## 7. Files

`REFEREE2-lemma-H.md`, `RESULT.md`, `lanes.jsonl`; `code/` (`lemh.py`, `indep.py`, `indep2.py`, `ref2_feas.py`,
`ref2_feas2.py`, `post1.py` to `post3.py`, `t_ea.py`, `flagged86.json`); outputs `lemh_*.json`, `lemh_*.log`,
`indep.json`, `indep2.json`, `dn_out_feas500.json`, `dn_out_feas500b.json`; `rerun/` (copies of lane scripts
and their outputs); `server_logs/`. Written in other lane directories: one file `REFEREE2.md` in each of the
five round-16 lanes; no other file of another lane was changed.
