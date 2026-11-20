# c15-referee-r14-independent-checkpoint: RESULT

Round 15, kind repair (independent referee). Date 2026-11-19. No attack. R4 not addressed. Nothing here is a
statement about zeros of zeta. Requirement flags R1 = R2 = R3 = R4 = false. Cannot raise the headline.
Local only: five short runs through `scripts/memcap.sh 8` with `.venv-arb/bin/python` (numpy, mpmath); the server
was not contacted; nothing was written outside this directory except one line appended to `campaign/lanes.jsonl`.

## Verdict

**Partial result (referee record). Six round-14 lanes and the checkpoint draft were refereed independently. No
PROVED lemma among those assigned is broken. Each item holds with a scope line. Three sentences are false as
written (two in lanes, already found by the lanes' own passes and confirmed here; one in the campaign round log,
found here). The outcome "none" of the joint search does not depend on the lane-defined lifts on the grid stage.**

| item | verdict | exact sentence (short form; full text in the REFEREE2 file) |
|---|---|---|
| c14-joint-zeta-twist-noncone-search: lifts, FE tier, "none" | holds with scope line | T-NR, E_a, HEAT lifts canonical; DH canonical as a twist, FE kept iff chi_G^2(q_psi) = 1; BLS, theta^w, BEU lane-defined; BEU is not an off-line control. On the grid, full = 0 and T-train = 0 (PA) with the canonical lifts alone and with any one class dropped. Draws not recounted |
| c14-joint-pair-design: Lemma C, TW, Lemma A | holds with scope line | Lemma A exponent valid for sigma_0 <= 4/5 and relative to a theorem recalled, not opened; TW second display for chi even; Lemma C for a finite character set |
| c14-theta-orthogonal: Lemma E, coefficient formula, Lemma 1' | holds with scope line | "one linear condition b(1) = 0 ... by the Hecke relation" is false as written (even squares need Lemma 1'); Lemma E (iii) relative to an unopened source |
| c14-laxphillips: four norm families, mean-zero addition | holds with scope line | Theorem L is about the full solid space; on the mean-zero subspace the bound is implied by membership (derived independently, same as the lane's addition) |
| c14-x2-step-catalogue: Lemma T, Proposition E, sources | holds with scope line | Lemma T for chi even; T1 on the line Re w = P - 1; 1 of 7 recalled attributions opened in a primary-level text, 4 confirmed at abstract level, 1 citation only, 1 not searched; no wrong attribution found; three corrections of the lane's own pass were missed by me and confirmed afterwards |
| c14-prefilter-sweep: Lemma F | Lemma F holds with scope line; verdict item 5 broken as written | "for a < 1/2 ... the Schur condition is the zero-free statement itself" is false (zeros with Re lambda <= a give no pole; a pole is cancelled by a zero at lambda - 2a) |
| campaign/CHECKPOINT_R14_DRAFT.md | holds with scope lines | U1, U2 are cells of U3 and need INT in the read set; U4, U6 (a), (b), (g), U8 narrowed; U3, U5, U6 (c)-(f), U7 unchanged. "No control on file has zeta's own functional equation" (round log) is false as written |

Deliverables in this directory: `LIFT_RULING.md` (written first, for `c15-nonhomogeneous-pair-triple-kernel-search`),
`REFEREE2_<item>.md` (seven files), `LABEL_RESTRICTIONS.md` (30 items), `CHECKPOINT_R15_REFEREED.md`.

## 1. Plan

1. Decisive first item: the lift ruling, because a compute lane reads it. Rule each lift canonical or not; decide
   dependence of "none" by a leave-one-class-out recount on the mirrored sign matrices (the criterion is monotone
   in the control set, so dependence can only appear as survivors when a class is dropped).
2. For each PROVED statement assigned: re-derive on paper; one numerical check at two truncations.
3. Source-check the recalled attributions of the catalogue with generic search terms.
4. Checkpoint: each U class against the lines of Statement O version 3, the nearest map rows, the round-14
   outcomes; ask whether a control on file already lies in the class.
5. Only then open each lane's REFEREE.md and record agreement or disagreement.

## 2. Work (numbers; all files here)

- `lift_loo.py` / `.json`: grid stage, 1,487,558 functionals, 10 families. My totals equal the lane's (94,531
  one-signed on PA; 440,516 on PZ; PZ T-train 3). PA: T-train 0 and full 0 for nine classes, for each
  nine-minus-one, for the FE tier, and for {T-NR, E_a, HEAT}; FE tier minus HEAT: T-train 99, full 0. PZ: T-train
  3 (nine), 35 (FE tier), 40 (canonical three), 1,121 (nine minus HEAT); full 0 everywhere. Without controls:
  55,422 (PA) and 97,370 (PZ) functionals meet the positive part of the criterion.
- `ref2_checks.py` / `.json` / `.log` (about 2 minutes): Lemma J1 defect <= 1e-14 at 12 and 40 terms; T-NR lift
  functional equation residual 5.3e-5 (30 terms) and 5.3e-14 (60 terms); Lemma C 1.7e-7 / 1.7e-9 at a split
  prime, 0.309 at an inert prime; TW defect 0.0 at two grids and two ranges for an even real and an odd complex
  character; weight-1/2 coefficients A(1), A(4), A(9), A(36), A(0) from the definition against the closed forms,
  5e-8 (c <= 800) and 1.3e-8 (c <= 1600); Hecke rule 1e-29; H2 supremum 1.000 (k <= 30) and 1.154 (k <= 60) at
  p = 2; Theorem L ratio minimum 1 - 6e-16 on 300 and 1,500 points; Lemma T product identity 3.7e-9 / 3.0e-12;
  Proposition E values stable between 20 and 40 digits; Pick identity 2e-16 with eigenvalue signs equal at orders
  6 and 10; T-NR quotient modulus 1 on the axis, supremum 0.972 / 0.993.
- `ref2_checks_b.py`: HEAT-blindness of scaling-invariant pair and triple functionals (6e-16), non-instance 0.43.
- `ref2_checks_c.py`: the bridge-ratio counter-example (supremum 0.9980 / 0.9995 with cancelling zeros; 3.8 / 92
  without).
- Two-truncation rule (round-14 lesson 7) mattered three times: the T-NR residual at 30 terms would have read as
  a failed functional equation; the H2 supremum at k <= 30 shows no divergence; the pole case of the bridge ratio
  reads 3.8 on the coarse grid.
- First launch of `ref2_checks.py` contained a loop over the divisors of 2^60 and did not terminate; it was
  stopped after 10 minutes (memory flat), repaired, and rerun. No output of the first launch is used.
- Additions derived in this pass (PROVED, elementary, unrefereed): Lemma J1' (LIFT_RULING section 5); the
  backward-heat inheritance of monomial upper bounds (checkpoint, U8); the proof that the T-NR quotient
  D(z)/D(z+1) is Schur; the rule chi_G^2(q_psi) = 1 for the twisted DH member (derived from the root number of a
  product of characters, matched against the lane's 5 of 28; not written out as a proof).

## 3. Controls

No device is proposed, so there is no control table of this lane. What the pass says about controls:
- HEAT is the binding class of the joint search and is canonical; Lemma J1' extends its exact blindness to all
  functionals invariant under a common pointwise scaling.
- BEU is not an off-line control. theta^w lifted on the index m is not a lift of (zeta, chi).
- T-NR in the Laurent form and every symmetric multiplier keep zeta's own functional equation exactly; this
  corrects one sentence of the record and fixes the reading of U1, U2, U3.
- BLS passes Schur and Pick conditions of every order (re-derived).
- DH, backward heat, sign twists, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer
  operator, theta^w: none was run against anything new here; the phase-rotated transfer operator appears in no
  item refereed.

## 4. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | referee lane; no argument about zeta. The multiplicativity-consuming steps refereed (TW, Hecke rule in H1, Lemma 2, Lemma T (i)) are identities valid for controls |
| R2 height-uniform, every window | false | no conclusion of that form is made |
| R3 every control fails structurally | false | nothing proposed; the refereed lanes each have a passing control (HEAT; T-NR, BLS, DH; generic parameter; EIS-w; BLS) |
| R4 reaches the critical line | false | not addressed |

## 5. Three weakest steps

1. **The lift ruling's independence claim is for the grid stage only.** 1.49 of 38.1 million functionals; the
   draw and adaptive sign matrices are on the server and were not recounted. For them the statement rests on the
   lane's summaries (FE tier, read per class: T-train 59, full 0). "Canonical" is my definition (forced by the
   twist rule n^(-s) -> chi(n) n^(-s) in the FE-centred variable); another referee could call the same-b BLS lift
   canonical by analogy with HEAT. The float64 sign rule and the ball stage were not audited.
2. **Sources.** Montgomery's Theorem 12.1 (Lemma A) was not opened; the regularised Rankin-Selberg method for
   half-integral weight and several cusps (Lemma E (iii), Lemma 3) was not opened; of the seven recalled
   attributions one was read in a primary-level text. On the catalogue lane I missed three of the five
   corrections its own pass had found; the 443-node sweep and the catalogue table were not re-read row by row.
3. **Checkpoint coverage and unrefereed additions.** The U classes were compared with every line of Statement O
   but with about ten map rows of 198 (now 202). Lemma J1', the heat-inheritance exclusion in U8 and the DH
   twist rule are one derivation each with no referee. The rulings on U1, U2 do not use the pending round-15
   control ZQ; if it holds, those two entries change.

## 6. For the orchestrator

- Apply `LABEL_RESTRICTIONS.md` (30 items; 11 marked (A) were already found by the lanes' own passes).
- Replace the draft by `CHECKPOINT_R15_REFEREED.md` in STRATEGY section 4.0 if the planner accepts it.
- `c15-nonhomogeneous-pair-triple-kernel-search`: LIFT_RULING.md sections 4 and 5 (report tiers three ways; DH
  members with chi_G^2(q_psi) = 1 in the FE tier; BEU outside requirement (b); exclude or pre-close the
  scaling-invariant functionals).
- Referee counts: round-14 lanes 1 to 6 now have two passes each (author and independent).
