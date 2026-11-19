# REFEREE (lens: general) for `c8-repair-engine-map-r7/RESULT.md`

2026-11-18. Written in this directory only (`REFEREE.md`, two check scripts under `referee_checks/`). No server use;
local runs through `scripts/memcap.sh 8`. No statement about zeros of zeta is made by the lane or by this report.

## Verdict

**The claimed verdict (partial result, repair lane, all four flags false) holds, with four corrections (E1 to E4).**
None of them changes the decisive check or a status label in RESULT.md. E1 is a false sentence in one of the lane's
own referee files; E2 is an unjustified error rate inside the proof labelled PROVED (the limit statement survives).

## What was re-derived or rerun

| item | what I did | outcome |
|---|---|---|
| Decisive check | Recounted from `engine/CANDIDATES.json` (60 entries) against `engine/curated/devices.json` (71 device nodes: 59 closed, 7 floored, 5 open), without the generator's counters | 0 closed; open counts 12, 12, 8, 6, 4; 42 with an open device, 18 floored only. Agrees |
| Cause table | Read `diag/watch_before.json`; sums 841 + 36 + 101 = 978 and 2,209 + 139 + 57 = 2,405 | Agrees |
| Generator edits | `diff engine_before/generate.py engine/generate.py`, `mk_devices.py`, `closed_families.json` | Two rules as described, both conditioned on open device nodes; `closed_families.json` unchanged |
| Theorem K | Both identities expanded by hand; weights non-negative for r >= 2, sum 1; source point (2/5, 2/5, 1/5), r = 6 gives 13/15 on all three inputs | Holds |
| K-branch = Hilbert-Schmidt | Read Liu II Lemma 2.4 (lines 629-634): squared norm Z^(m + k), branch m + l - 1 gives Z^(2m + l - 1) | Holds |
| Lemma HS | norm^2 >= HS^2/rank >= c QD/min(Q, D) | Holds |
| Proposition B | Proof re-derived. New run (`referee_checks/prop_b_rowdependent.py`): other moduli and columns, column partition chosen separately for each row block (not a product partition), random column order, flat and Gaussian beta, 6 x 60 trials | Holds; least ratio 1.88, no violation. The proof also covers row-dependent column partitions (the column blocks need only partition all columns for each row block) |
| Lemma H | Summand of (7.10), (7.8), lift formula, (7.11), (7.12) compared with the manuscript text lines 3100-3300; algebra from (7.11) to H_p and the two rewritings done by hand; Liouville factor at s = 1 recomputed (0.8798 at Q = 4, R = -1/64). Script rerun with another seed and Q in {16, 19, 25, 43} / {19, 25, 37} | Holds; 1.1e-15 and 1.2e-15 |
| Lemma 2, monomial m | Proof re-derived step by step (pole equation, value of X at a pole, ranges, Kusmin-Landau, sums over m). New run (`referee_checks/lemma2_monomial_cases.py`, poles in [500, 4e4], four cases not in the lane) | Limit statement holds; see E1, E2. Measured Cesaro / predicted: m = -1: 0.0000 / 0; m = -conj(w_2): 0.2928 / 0.2929; m = e^(2.5i) w_2: 1.0000 / 1; m = e^(2.5i) conj(w_3): 0.5374 - 0.3455i / 0.5375 - 0.3455i |
| c5 rows Y2, Y6 | `diff` of stored log and rerun log: identical; `tiers_fe2.py` contains no `G=` argument | Agrees: mislabelled, not stale |
| Referee counts | `c7-probe-format-h-cap` has one REFEREE file; `c6-marks-bc-manuscript-check` has two | "second" and "third" are correct as file counts |

## Errors

**E1 (false sentence; `c7-laurent-shell-gamma-section/REFEREE2.md`, Outcome).** "for a monomial the mean is
1 + conj(c) n^(-1/2) or 1, real part at least 1 - 2^(-1/2) > 0". The case n = 1 (constant m = c) is omitted. For
m = -1 the mean is 1 + conj(-1) = 0 (the poles are the points theta = pi(j + 1/2), where Re zeta = 0); measured 0.0000.
The correct statement: for monomial m the real part of the mean is >= 0, with infimum 0 attained at m = -1; it is
>= 1 - 2^(-1/2) only for non-constant monomials. The original lane states this correctly (RESULT section 2: "For
constant m = u: 1 + conj(u), real part >= 0 with equality at one phase"). The consequence drawn (a negative mean needs
a non-monomial m, so the sign conclusion rests on the ARGUED part) is unchanged. RESULT.md itself does not repeat the
false bound.

**E2 (unjustified rate inside the PROVED step; same file, section 2).** The Abel-weight error is stated as
O_q(delta^(-1/4 - eps)). The proof bounds the exponential sums by O_q(T^(1/4) log T), but the remainder O(t^(-1/4)) of
the approximate functional equation is summed in absolute value: sum over j <= N of g_j^(-1/4) is of order
T^(3/4) log T (the text writes "N T_0^(-1/4)", which is not a bound in T), and with Abel weights of order
delta^(-3/4). What is proved is error O_q(delta^(-3/4)) against the main term 1/(pi delta), relative error
O(delta^(1/4)). The limit claimed (Cesaro, weights r_j, Abel weights) follows; the stated rate does not. The observed
error proportional to delta comes from the lower cut-off of the pole range and is not evidence for the stated rate.

**E3 (omission; RESULT section 1).** After the edit the same family still rejects 389 of 820 candidates of
`map-open-1` and 1,129 of 2,261 of `ff-order2-vertex-probe` (`diag/watch_after.json`). The retained rule applies the
family when a partner matches one of its groups, and the second group contains the bare word "theta", which is common
in partner text. So the stated cause is removed only in part; about half of the candidates of the two nodes are still
rejected by a single generic word in a partner. RESULT reports the scored counts indirectly (ranks 968 and 478) but
not this residue.

**E4 (wording).** "holds for every blockwise operator-norm estimate" (REFEREE2 Outcome table) is wider than
Proposition B: it needs a proportion c of unimodular entries in each block and no large entry of beta', it loses the
factor c^(1/2)/b1 (b1 grows like (2 log D)^(1/2) for Gaussian-size coefficients), and it concerns sums of the form
sum norm(A_i) norm(T_ij) norm(beta'_j). RESULT item 3 and section 4 of REFEREE2 state the hypotheses; the table line
does not.

## Notes on the decisive check (not errors; disclosed in RESULT)

- Three of the five open devices were created by this lane (nodes-18, `mk_devices.py`). The check "each open device
  appears" is therefore in part a check of the lane's own additions; the 30 entries they supply are tag matches that
  nobody read.
- `map-open-1` and `ff-order2-vertex-probe` enter the top 60 through the diversity limits (best ranks 968 and 478 of
  12,701), not by score.
- The exemption trusts `curated/devices.json`. It is applied to every closed family, not only to
  `fam-order2-theta-rows`.

## Checks required by the assignment

- RH assumed anywhere: no. Verified height restated: no. Known theorem presented as new: no; Theorem 10.6 of
  Titchmarsh is cited as the m = 1 case, and the monomial extension is described as possibly in the literature.
  Classical inputs (Riemann-Siegel with O(t^(-1/4)), Kusmin-Landau) are used in their standard form; I confirm the
  forms used are the standard ones, without opening a source.
- Controls: no zeta-only mechanism is claimed. Theorem K, Lemma HS and Proposition B contain no target data. Lemma H
  uses complete multiplicativity only (confirmed from the summand of (7.10)). The monomial case of Lemma 2 uses only
  an approximate functional equation; the DH version is not written, as the lane says.
- Not checked here: the map text and the outline line by line; Lemma A item (a) (reading of (7.1)-(7.5)); the
  derivation of (7.8) from (7.1)-(7.7); the hypotheses of Proposition B in the sources.

## Requirement flags (set by this referee)

R1 false. R2 false. R3 false. R4 false. No statement of the lane uses multiplicativity in an essential step, concludes
anything about zeros, separates a control, or reaches the critical line.

## Surviving claim

Repair lane, partial result. After the engine rerun 0 of the top 60 contain a closed device and the five open devices
appear 12, 12, 8, 6, 4 times (two of them through diversity limits; three of them added by this lane; the closed
family still rejects about half of the candidates of the two original nodes through the partner word "theta").
Theorem K, Lemma HS and Proposition B (with its hypotheses and constant) hold. Lemma H holds from (7.10) with (7.8).
Lemma 2 holds for monomial m and zeta as a limit statement with relative error O(delta^(1/4)); for monomials the real
part of the mean is >= 0, with 0 attained at m = -1. Lemma A and the non-monomial case of Lemma 2 stay ARGUED.
Rows Y2, Y6 are mislabelled, not stale.
