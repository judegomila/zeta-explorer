# obstruction-map: second referee pass (2026-11-20)

Scope: attack the first reviewer's verdict (VERDICT.md, NOTES.md). My scripts and logs: `referee/ref_stats.py`, `referee/ref_dh.py` (+ `ref_dh.log`), `referee/ref_misc.py` (+ `ref_misc.log`). All runs through `scripts/memcap.sh 8`, mpmath/numpy in `.venv-arb`, total compute under 3 minutes. One slip: a scratch extract of map section 3 was written to /tmp and deleted in the same command.

## 1. What I re-ran, independently of the first reviewer's code path

| item | first reviewer | mine (method) | agrees |
|---|---|---|---|
| DH off-line zeros | Newton started at the quoted zeros, Hurwitz-zeta form | DH written as c L(s,chi) + conj(c) L(s,chibar), chi mod 5, chi(2)=i (checked against the direct series to 1e-28). Winding number of DH on boxes Re in [0.55,1.5]: Im in [80,90] -> 1.0; Im in [110,118] -> 1.0; Im in [1,80] -> 1.7e-26 (none). Zero located from a grid minimum, no quoted input: 0.8085171824566 + 85.69934848538i; value at the reflected point 1.7e-24 | yes, 10 digits |
| DH sup of Re(zero), map value "about 1.1203625" | not replayed | Bohr/Kronecker condition: sum over p = 2,3 mod 5 of 2 atan(p^-sigma) = pi - 2 atan(kappa) = 2.5880182947; primes to 1e7 and 1e8 with tail E1((sigma-1) log X): sigma* = 1.12036246 and 1.12036247 | yes, 7-8 digits |
| DH theta kernel evenness | log prints 1.74e+76 (cancellation at 30 digits); note quotes 4e-61 for u <= 0.8 only | 700-digit working precision, kappa at 30 digits: relative defect 5e-32 at u = 0.5, 1.5, 2.5, 3 (the floor set by kappa's precision) | yes on [0,3]; their log line was a precision artefact |
| lane table | 220 lanes, all flags false | 220 lanes, 220 distinct slugs, flags (F,F,F,F) on 220; score 0 on 210, null on 10; referees 0/1/2/3 = 10/132/72/6; refereeHolds T/F/None = 196/14/10; brokenProved = 21; kinds explore 49, deepen 45, combine 42, repair 38, compute 36, screen 10 | yes |
| score history | "two lanes held R1 through round 20" | bak-r11..r20: both `c1-leeyang-krein-limit` and `c4-helson-discrepancy-zerofree` at score 1; bak-r21: only the second; bak-r22 onward: none | nearly: one flag survived through round 21 |
| map rows | 230 | 244 non-separator table lines in section 3, 10 header lines, 234 rows with 234 distinct ids | no: 234, not 230 |
| obstructionKind | 160 distinct | 162 distinct values including empty string and null, 160 non-empty | yes |
| section 6 | "25 directions listed as not covered" | 25 items; 6 headings state "closed" or "run" (items 6, 7, 8, 9, 11, 14) and at least 5 more carry a later closing note in the item (19, 20, 21, 23 partly, 25) | the 25 is the item count, not the number still open (about 14 to 19) |
| public tree | "OBSTRUCTION_MAP.md is not in the public tree" | origin/main (local ref 7ab2fcae, fetch timed out) contains 8 copies under `research-checkpoints/rh-push-2026-11-16/fleet-lanes/`, 89 kB (123 rows) up to the round-9 copy of 188 kB (171 rows). The current 581 kB file is not there | no: early versions are public |

Not re-run by me: the other 15 control facts of the first reviewer (I read their scripts: they are own code, not a rerun of lane code; the heat zeros use a different method from the lanes'), the 234 row verdicts, THIN/DEL, the hitting-set table, the 7/8 calibration row.

## 2. Is "confirmed-weaker-statement" deserved

Yes. What was confirmed is (i) the arithmetic of the control panel and (ii) the bookkeeping. Neither reviewer checked a single row verdict (the statement "route X stops at step Y, and control Z passes every step of X"). So the catalogue is confirmed as a record whose control facts are right; its 234 row-level claims rest on internal referees (132 lanes with one, 10 with none, 21 PROVED sub-claims later broken).

Untested dependency: part 6 of the wall and the calibration row (score 3) take as given a kernel-checked zero-free half-plane Re s > 7/8 from an external release, on a single build of 2026-10-07 (map section 1, lines 2-3). No such half-plane is in the refereed literature. Neither pass replayed it. "The 7/8 theorem is the only row violated by every control" is conditional on it.

## 3. Finding the first reviewer missed: the wall text predates half the rows

The public 123-row version of the map already contains section 5 with the sentence "Every route in section 3 ends at the same requirement, which can be stated in six parts", the same six headings and the same "Corollary used as a filter". The first reviewer calls the wall "a post-hoc grouping ... made afterwards". For the first 123 rows that is right. For the later 111 rows it is the other way round: the wall and its filter were fixed first, lanes were briefed with it, and the metric assigns 0 by rule to anything the filter classes as a restatement or control-passing.

Reading in both directions:
- Less arbitrary than stated: the six parts were not rewritten to fit 111 later rows; a fixed statement was not contradicted by them.
- More arbitrary than stated: the later rows are not independent tests. A lane that did not stop at the wall would be a proof step towards RH; short of that, the scoring rule returns 0. The agreement of 220 lanes is the agreement of one filter applied 220 times.

## 4. Literature (11 general queries; no MathSciNet/zbMATH)

Confirmed as standard: Davenport-Heilbronn 1936; Titchmarsh 10.25; Bombieri-Ghosh 2011 (Theorem 7 treats real parts of DH zeros right of 1); Righetti arXiv:1506.05716 and Booker-Thorne arXiv:1412.6331 (zeros of combinations of Euler products for sigma > 1, the abscissa sigma*); Bombieri-Hejhal 1995 (combinations with a common functional equation: almost all zeros on the line under hypotheses, not all); Rodgers-Tao 2020, Dobner 2020; Platt-Trudgian 2021.

Additions to the first reviewer's list, each a published instance of "the criterion is not specific to zeta":
- Bombieri-Lagarias, J. Number Theory 77 (1999): Li's criterion follows from inequalities for an arbitrary multiset; equivalent to Weil positivity.
- de Roton, Trans. AMS 359 (2007): Nyman-Beurling criterion for a class of Dirichlet series including the Selberg class; arXiv:1112.0166.
- Omar and others: Weil/Li positivity criteria for the Selberg class (arXiv:1410.4384, 1405.7354).
- Connes, "An essay on the Riemann Hypothesis" (arXiv:1509.05576) and arXiv:2602.04022: surveys of strategies and equivalents.
- Elizalde-Moretti-Zerbini, arXiv:math-ph/0109006: a published critique of specific proposed strategies.

Not found: a published table crossing a few hundred routes with a panel of explicit controls; a printed value 1.1203625 for sigma* of DH (the defining equation is in the cited papers' framework; I derived and evaluated it). The named twins (ZQ, SG, NR-q, HQ2-4, V6, CYC, NWM) not found as named objects; the search was too shallow to say they are absent.

## 5. Scores

- Verification: confirmed-weaker-statement (unchanged).
- Novelty: known-in-different-form (unchanged). The content of the wall is the classical list of counterexample classes; the table is a compilation.
- Arbitrariness: 4 (unchanged; reasons amended by section 3). The control facts alone would be 1.
- Importance: 2 (unchanged). The headline alone is 1: a specialist would accept it as folklore. The 2 is for the reusable control panel with reproduced numerics and the explicit rule "run every step on the controls".
- Status label: obstruction / negative result, in the sense of a record of failed routes; it is not a no-go theorem.

## 6. Corrections to the first verdict

1. Map rows: 234, not 230.
2. Early versions of the map (123 and 171 rows) are in the public tree; only the current version is private.
3. "Post-hoc grouping" holds for the first 123 rows only; the six-part wall is verbatim older than the remaining 111.
4. R1 flags: one removed between the round-20 and round-21 backups, the other between round-21 and round-22.
5. "25 directions not covered": 25 items, of which 6 are headed closed/run and several more closed inside the item.
6. Their own log contradicts the evenness sentence unless restricted to u <= 0.8; evenness on [0,3] holds (my run).
7. sup Re = 1.1203625 for DH is now replayed (was listed as not replayed).
8. The dependence of wall part 6 and of the calibration row on the unreplayed 7/8 half-plane was not stated.
