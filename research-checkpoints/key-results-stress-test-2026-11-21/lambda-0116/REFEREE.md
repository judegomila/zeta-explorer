# lambda-0116: second referee pass (2026-11-21)

Target: the first reviewer's verdict (NOTES.md, VERDICT.md), not the project.
Outcome: verdict `confirmed-weaker-statement` stands. Five corrections to its text, none to its arithmetic.

## 1. What I ran (all through scripts/memcap.sh 8; own scripts under 2 min in total; the two same-path floor workers ran roughly 10 min each in parallel; at most 2 processes at once)

Scripts and logs are in `referee/`.

| script | what it does | independent of reviewer 1? | result |
|---|---|---|---|
| `reint.py` | Re-integrates both runs from the tables and run schedule only (Lean exports `f2_export.json`, `r78_export.json`: kernels, floors, runs, q0). Reads no stored barrier state or `outq`. Arb 400-bit exp/log, exact rationals elsewhere, own derivation of sup s_r on [0,v] for the self cap. | Yes: different input file, no stored trajectory, different code. Same algorithm (it has to be). | (ii) terminal substep 59438, T*+q_e/2 = 0.11609148867243846, ceil = 116091488672439/10^15, equal to claim; 468 floors, 59 kernels, 0 flags, min rho^2-v = 2.83e-7, S1 margin 1.8082e-8. (i) terminal substep 60674, T*+q_e/2 = 0.11850571092270083, ceil = 118505710922701/10^15, equal to claim; 476 floors, 2 kernels, 0 flags. Without the 2^-96 rounding (ii) is unchanged to 22 digits. |
| `reint.py` (theta variant) | F2 schedule restarted at q0 = (2*0.874886647-1)^2 + 1e-7, caps recomputed | Yes | 0.116060080729592, below the lane's 0.116060107834762 by 2.7e-8 (the lane keeps the old rates; I recompute the caps at the lower v). Consistent in the right direction. R78 schedule: 0.118473654 against the lane's 0.118473588 (start offsets differ: I kept 2e-6). |
| `reint.py` (perturbations) | exact conditions with floors lowered, schedule fixed | Yes | all floors -1e-6: 0.116091499388547, no flag. All floors -0.0023: 661 admissibility failures. r2 floors only -0.0023: 62 admissibility failures. Start at theta = 0.8751: 1703 admissibility failures. |
| `kern.py` | random search (3e6 points per row, boundary-weighted) plus local refinement on (K) for the 60 distinct kernel rows of both exports | Yes (own code, different search) | 0 violations. Rows with lambda<2: min LHS/RHS = 1.0001004 (reviewer: 1.0001004). The two lambda=2 rows: ratio -> 1 as d -> infinity; expansion gives (ratio-1)d^2 -> 1 - y^2 - 3r^2 (0.0727 and 0.111 at y = rho), observed 0.0727 at d = 1e4. Control at y = 1.1 rho: 56 of 60 rows violated (reviewer: 56 of 59). |
| `floor0.py` | t = 0, cell 0 of both runs: pair average from xi'/xi with primes to 2e7, phases (X/2) log p from 160-bit Arb logs; value at X, 40,000-point scan on [X, X+2e6], Kronecker infimum | Yes (own derivation and code; same idea as torus_t0.py) | F2 cell 0 (h=1.88, r=0.6, ell=6.001204): J(X)=6.4170, scan min 6.3768, infimum 6.2097 (tail 7e-4); slack 0.2078 (reviewer: 0.208). Raymond X1 cell 0 (h=2.18, r=0.575, ell=6.273825): J(X)=6.4894, infimum 6.3749; slack 0.1010. |
| `samepath/attack_floors.py` (reviewer's code, workers 1 and 4 of 12) | 78 further floor entries not in the reviewer's sample | **No: same code path.** Extends coverage only. | 0 violations; min margin 0.160; median 0.3985 (reviewer: 0.157, 0.398). Coverage now 234 of 468. |
| Lean | read Hyps.lean, Defs.lean, Checker.lean, Main.lean, Main78.lean, axiom logs, build log (BUILD_RC=0, AX_RC=0, OAI_RC=0, NEG_RC=0 on 2026-10-09). Not rebuilt. | - | No sorry/axiom/native_decide in the library; 122-line axiom log has only propext, Classical.choice, Quot.sound. Final theorems take RaymondChainHyps and TableHyps as hypotheses, as the reviewer says. |
| dump hash | sha256 of the gunzipped F2 dump | - | 1c546f5c...fc0cfb, equal to the stored value. |

Not done by either pass: any check of (J) at t > 0 that does not go through the float A_eff+B_eff model; any check of the head wall (W), first contact (FC), contact exclusion (CE); a cross-read of the m091/m094/m097/W4/route-3/r2 floor values (33,455 substeps) against producer output. The reviewer's 25,984 look-ups cover the QA/QB/QC sets only; my re-integration reads the Lean export, which is the same lineage as the dump.

## 2. Is "confirmed" deserved?

What is confirmed, by three code paths now (consumer, reviewer's Arb replay of the dump, my re-integration from the tables): the arithmetic implication "tables + chain hypotheses => number", for both (i) and (ii). That is a finite computation and it is correct.

What is not confirmed by anyone: the hypotheses. `confirmed-weaker-statement` is the right label. The reviewer's replay was a real second implementation, not a re-run of the project's script. The floor and kernel attacks are refutation attempts with float models; they found nothing and prove nothing.

## 3. Corrections to the first verdict

1. **Value (i) was asserted but not replayed.** The reviewer's precise statement leads with 0.118505710922701, yet `replay_f2.py` covers F2 only. I re-integrated it: confirmed (see table). Note from the Lean negative controls: with the alternate log bound the same run gives ...702; the stored ...701 is the degree-11 log value and my Arb value 0.11850571092270083 agrees with it.
2. **0.116060 was not replayed either.** My variant gives 0.116060080729592 <= 0.116060107834762. The hypothesis issue the reviewer raises (a further unread half-plane preprint) stands.
3. **The sensitivity figures are estimates, not bounds.** `sens.py` is a float model with fixed rates and no admissibility test. Under the exact conditions the stored schedule fails (C1) as soon as floors drop by 0.0023 (62 substeps for the r2 floors alone). So the statement "floors lowered by 0.0023 gives 0.116116" should read "a re-run would be needed; a fixed-rate float model suggests about 0.11612". The certificate is tuned to an admissibility margin of 2.8e-7; it tolerates a 1e-6 loss in every floor and not a 2.3e-3 loss in the 89 partly uncertified ones. This matters because 0.0023 is the size of the allowance the package itself calls measured and uncertified.
4. **Literature: the nearest public result is closer than stated.** The reviewer cites "Raymond's ceiling below 0.116398" second-hand through Planat's supplement. It is a stand-alone deposit: D. J. Raymond, "Retuned translated probes and the conditional bound Lambda < 0.116398 for the de Bruijn-Newman constant", Zenodo record 23272725, v1, 10 October 2026, Lambda <= 116397726408291/10^15 under "every nontrivial zero has real part at most 7/8". Same method, same hypothesis, same re-tuning step, by the author of the method, one day after the draft's date (9 October; run dated 7 October; private). The project's (ii) is 3.06e-4 below it and uses extra internal tables; the project's (i) is 2.1e-3 above it. The draft, its bibliography and the site pages do not cite this deposit (grep for 116398 in papers/ and src/ finds nothing). Also: the 0.107965 deposit describes itself as unconditional (it treats the Lean 7/8 theorem as established); MathWorld lists it in its main table as unreviewed and lists Hakimoglu-Brown 0.13963 separately as conditional. MathWorld's table also has Mosaic 0.1875, Gordon < 0.158, and a 0.1787854 entry; arXiv:2610.18214 also mentions Kornaus 0.172422. None of these change the verdict.
5. **"Proved without hypotheses"** for Lambda <= (2 theta - 1)^2/2 should say "classical": it is de Bruijn 1950, Theorem 13 (Polymath15 Theorem 3.2) applied at t0 = 0 after the change of variable. The Lean proof is a formalisation of that corollary.

Items of the first verdict I checked and could not fault: hypothesis split (H1)-(H4) and the reading that "two unrefereed results" fits 0.118506 only (DEPENDENCIES.md says the same); 89 r2 entries = 70 + 19, 11,304 substeps (export src_counts and F2_final.json agree); Lean hypothesis structure; erratum v1.1 exists with the content stated (Zenodo 23781981, 30 Oct 2026, bound unchanged); the 0.107965 deposit (Zenodo 23752103, 29 Oct 2026, endpoint fraction as stated). I did not re-run `replay_0107965.py`.

## 4. Scores

**Arbitrariness 4 (unchanged).** Argument for 5: the 15 digits are the output of a max-rate tuning ladder on one path, the certificate sits 2.8e-7 from an admissibility edge, three different numbers (0.118506, 0.116398, 0.116091) come from the same chain under the same hypothesis depending on which tables are admitted, and a fourth (0.107965) from a re-engineered version. Argument for 3: the mechanism is choice-free (the half-plane enters only through q0 > (2 theta - 1)^2), the slope dLambda/dtheta = 0.277 near 7/8 is reproducible, and the value moves only in the 4th decimal under re-tuning within one table set. 4 fits: structure canonical, number tuned.

**Importance 2 (unchanged; the headline number alone would be 1).** An expert would shrug at 0.116091: it is conditional on an unrefereed claim that would itself be far bigger news than any Lambda bound; an upper bound on Lambda gives no zero information (Lambda >= 0, Rodgers-Tao); the method's author published 0.116398 by the same route within days and 0.107965 three weeks later; the project's value is unpublished. It is not a restatement of RH or of a classical equivalence, and it constrains nothing. What keeps it at 2: the exact, independently coded replays of two third-party-method computations (the 221,010-arc flow of the 0.107965 claim and Raymond's chain at the 7/8 start) are useful to the few people checking those deposits.

**Novelty: minor-variation.** Agreed, with the sharper neighbour in item 4.

## 5. One-line statement

The reviewer's line is accurate but can be shorter. Proposed: "Assuming zeta has no zeros with real part above 7/8, an unrefereed barrier construction of D. J. Raymond, and this project's own partly uncertified floor tables, the de Bruijn-Newman constant is at most 0.116091 (0.118506 without the project's tables); the arithmetic was re-derived independently, the assumptions were not checked, and a lower value 0.107965 under the same half-plane assumption is already public."

## 6. Literature search effort

4 web searches and 4 page fetches (MathWorld constant page; Zenodo records 23752103, 23272725, 23781981). Found and confirmed: arXiv:2610.12803, 2610.18214, 2611.06245, 2609.37164; the three Zenodo records; MathWorld table. The values 0.116091 and 0.118506 do not appear in any of these. Classical names (de Bruijn, Newman, Polymath 15, Platt-Trudgian, Rodgers-Tao) are the correct lineage; the Weil/Li/Nyman-Beurling/Connes/Toeplitz side is not relevant to this result.
