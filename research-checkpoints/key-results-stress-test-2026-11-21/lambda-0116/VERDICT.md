# Verdict: lambda-0116

Date 2026-11-21. Notes and scripts: this folder (NOTES.md, replay_f2.py, kernel_attack.py, k2.py, ht.py, validate*.py,
attack_floors.py, torus_t0.py, torus_all.py, torus_opt.py, sens.py, replay_0107965.py and their logs/JSON).

## Statement the material supports

Let Lambda be the de Bruijn-Newman constant (Polymath normalisation). Assume
- (H1) zeta(s) != 0 for Re s > 7/8 (openai/math family 003; Lean-formalised; unrefereed);
- (H2) the analytic statements of D. J. Raymond's decreasing-barrier chain (Zenodo 10.5281/zenodo.22867547 v1; unrefereed):
  head wall, first contact, contact exclusion, and his floor and kernel tables;
- (H3) RH up to height 3000175332800 (Platt-Trudgian, refereed).
Then Lambda <= 0.118505710922701. If in addition
- (H4) 468 project-produced joint-floor entries and 59 kernel rows are valid (internal; 89 of the floor entries rest on a measured,
  uncertified allowance and an unreviewed lemma, by the package's own DEPENDENCIES.md),
then Lambda <= 0.116091488672439. The figure 0.116060107834762 is the same run restarted from theta = 0.874886647 and needs a further
unrefereed half-plane claim that the project did not read.

The listed wording "0.116091 conditional on two unrefereed results" understates the hypotheses. With exactly the two external
unrefereed results (plus Platt-Trudgian) the supported value is 0.118506. 0.116091 needs a third, internal, partly uncertified block.

Third-party claim: Raymond, Lambda <= 427693072077942473661578098491/3961408125713216879677197516800 = 0.1079649100787... (Zenodo
10.5281/zenodo.23752103, unrefereed). The project replayed its finite computation; the analytic part (notably the approximation of
H_t/B_t at probe heights up to 6) was read once by AI referees and is not machine-checked. It also needs (H1) and (H3).

## What was re-run here

| check | result |
|---|---|
| Own replay of all 59,439 substeps of the 0.116091 run: exact rationals for admissibility, self-pair cap, rate; Arb 600-bit exp/log for the step and terminal conditions | 0 failures. T* + q_e/2 = 0.11609148867243846 <= 0.116091488672439. Start margin 1.8082e-8. Tightest admissibility margin 2.83e-7. 59 kernels, 468 floor entries, as stated. |
| Kernel inequality for the 59 rows, float grid attack | No violation. Minimum ratio 1.00010 (rows with lambda < 2); the two lambda = 2 rows approach 1 from above at large d. At 1.1 x the stated range 56 of 59 rows fail, so the test detects violations. |
| Joint floors: 156 of 468 entries evaluated on H_t (Polymath A+B model, exact phase reduction) at x = X, random x, and prime-phase-aligned x near X | No violation. Smallest margin 0.157. |
| Joint floors: all 468 entries against a worst-case prime-phase model | No entry above the model. Gap 0.20-0.39 for 379 entries; 0.042-0.135 for the 89 "r2" entries (the partly uncertified ones). |
| t = 0 floor of cell 0 against the Kronecker infimum computed from primes | floor 6.0012, infimum 6.2093. |
| Sensitivity (float) | all floors lowered by 0.0023 -> 0.116116; by 0.01 -> 0.116199; by 0.2 -> 0.118288. |
| Third replay of the 221,010 arcs of the 0.107965 flow, Arb 500 bits, formulas evaluated without rationalisation | 0 failures, 0 undecided; endpoint equals the claimed fraction exactly. |
| Lean sources read (not rebuilt) | Final theorems take the head wall, first contact, contact exclusion, and validity of all floor and kernel entries as hypotheses. No sorry, axiom or native_decide in the project library. |

The floor tests are numerical, in floating point, on a window of x near X and on a phase model. They can refute; they cannot prove.

## Weak points found

1. Hypothesis count. 0.116091 depends on (H4), which is internal and includes a measured, uncertified time-box allowance (0.0023), an
   unreviewed lemma and a heuristic FFT slack for 89 entries used on 11,304 substeps. Those 89 floors are the sharpest in the run (within
   0.7% of the worst-case model). No violation was found and the gap is 18 times the uncertified allowance, but this block is not a certificate.
2. The Lean result is an implication from named hypotheses that contain all of the analysis of H_t. It checks composition and arithmetic.
3. Source drift. Raymond issued an erratum (v1.1, 30 Oct 2026: remainder constant 5/6 -> 11/12, wall bound restated). The draft cites v1.
   The numerical effect is of relative size 1e-12 according to the project's own referee note; the F2 entries were not rechecked against it.
4. (H1) is unrefereed; public sources as of late October 2026 report no independent specialist verification.
5. Digits. The value is the output of a max-rate selection over tuned heights and kernels along one path; a different tuning gives a
   different number (the ladder ran 0.117708 -> 0.116091). Only "about 0.116" has meaning; the 15 digits are a replay checksum.
6. Superseded in value by the third-party 0.107965 under the same half-plane.

## Literature

Accepted bound: Lambda <= 0.2 (Platt-Trudgian 2021, after Polymath15's 0.22). Public, unrefereed 2026 neighbours using the same 7/8 hypothesis:
Hakimoglu-Brown arXiv:2610.12803 (0.13963, 8 Oct 2026); Raymond's "ceiling below 0.116398" recorded in Planat arXiv:2610.18214 (13 Oct 2026);
Raymond Zenodo 10.5281/zenodo.23752103 (0.107964910079, 29 Oct 2026). Related unconditional claims: Raymond 0.149395 (Zenodo 22867547 /
23781981), Planat 0.148612, Planat-Raymond arXiv:2611.06245 (0.156821). The values 0.116091 and 0.118506 were not found in public sources;
the draft is private. Search effort: 7 web queries and 5 page fetches; no database search beyond that.
Classification: a variation of a known unrefereed method (Raymond's barrier chain with the start lowered by a zero-free half-plane),
with the same idea present independently in at least three public preprints.

## Scores

Arbitrariness 4/5. The implication "half-plane theta enters the chain only through the start q0 > (2 theta - 1)^2" is choice-free.
The number is not: it depends on X, the cell and step sizes, the start offset, the tuned heights, the kernel catalogue and which
internal floors are admitted, and it sits between two other values obtained by the same idea with different tuning (0.116398, 0.107965).

Importance 2/5. No consequence for RH (Lambda >= 0 is known; an upper bound above 0 says nothing about zeros). It is an upper bound on
Lambda below the accepted 0.2 only if three unrefereed blocks hold, and a smaller value under the same half-plane is already public.
What survives being told to a specialist: (a) a zero-free half-plane converts into a Lambda bound through the start of a barrier
argument, with slope dLambda/dtheta about 0.28 near 7/8, and (b) an independent exact replay of two such computations. Neither rules out
a method.

## Status

Conditional. Arithmetic replay confirmed for 0.116091 and for 0.107964910079. Hypotheses (H1), (H2), (H4) not established here or elsewhere.
