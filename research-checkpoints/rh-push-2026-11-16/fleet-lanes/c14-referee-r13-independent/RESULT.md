**No filter is BROKEN. Lemma P, control BLS, symmetric-multiplier covariance, Lemma H and the search record hold; five carry a restriction that round-14 lanes must apply (section 2, column "restriction for round 14").**

# c14-referee-r13-independent: independent referee for round-13 lanes 1 to 6

Date 2026-11-19. Round 14, kind: repair. Scope: this directory only; no file of a refereed lane, of the map or of the
engine was edited. No statement about zeros of zeta is made. No requirement flag is claimed.
All runs local through `scripts/memcap.sh 8` (python-flint balls, numpy); the compute server was not contacted.

## 1. Plan

1. Order of the assignment: filters first. For each statement: re-derive it from the lane's RESULT.md (PREREG.md and
   the opened source text where the lane names one), then a numeric instance in which the control object is verified
   not identically zero and the claimed sign or pole position is reproduced, at parameters the lane did not use where
   that was possible.
2. Lane 6: write the kernels and functionals from PREREG.md with separate code, validate them on their own, then
   recompute a sample of the stored signs and recount the grid table from the stored sign matrices.
3. The lanes' own REFEREE.md files were not read while the reports were written. After the six reports existed, four
   greps were run on them to see whether the corrections found here were already on file (section 5).

Exceptions to "RESULT.md only": one grep of lane 6's `funcs.py` for the ordering of column sets (not fixed by PREREG);
one read of lane 1's `lattice_check.py` lines 18 to 20 and `PREFILTER.md` for the node ranges of its lattice check.

## 2. Summary

| # | lane | statement | verdict | restriction for round 14 |
|---|---|---|---|---|
| 1 | c13-tnr-invariance-prefilter-noncone-census | Lemma P | HOLDS | type all hypotheses of a device in one normalisation (Laurent form or D form); a step using exact s <-> 1-s together with integer frequencies is X4, not passed |
| 1 | | Proposition S (S1 to S3) | HOLDS IN NARROWER FORM | as above: the items are stable in two different normalisations |
| 1 | | Lemma L | HOLDS | conditional on a constant sign of zeta's lattice-row minors (measured, not proved); "exactly when the zeros leave the line" is for c > 0 with c = 2 separated |
| 1 | | Lemma E | HOLDS | kernel of the product of two Riemann xi functions |
| 2 | c13-kacmoody-eisenstein-affine-weyl-shift | Theorem B (positivity iff Nevanlinna) | HOLDS | rank-one Levi kernel (I) only |
| 2 | | Theorem C (Blaschke closure), control BLS | HOLDS; "arbitrary pairs" IN NARROWER FORM | non-real conjugate pairs or real points with even multiplicity; BLS is a control for rank-one truncated-norm positivity, cocycle relation, unitarity, holomorphy in the chamber. Closure of the affine kernel (I_aff) is OPEN |
| 3 | c13-fourier-interpolation-zero-nodes | kernel = (F*(s)/F*(w)) x target-independent factor; one orbit under G(s)/G(w) | HOLDS IN NARROWER FORM | exact for H_-; H_+ carries the subtracted term alpha^+_(1,1/2)(s/2) of BRS (4.6), which the lane's display omits. "Target enters by division" (question Q-S) stands |
| 4 | c13-lrs-twist-amplification-zero-representation | pole at 2 - beta; gamma pole at 1 - beta; L(0, chi) = 0 | HOLDS | none |
| 4 | | inequality beta <= 7/4 | HOLDS IN NARROWER FORM | relative to the lane's reconstruction (3.1) of the LRS threshold; the vacuity is proved independently of it |
| 5 | c13-bilinear-reciprocity-height-antibridge | Lemma 1 | HOLDS as displayed (numerically, three fresh instances; not re-proved) | decay exponent of the E_J integrand is -J-3/2-c, not -J-1 |
| 5 | | sign statement (Proposition 3 (iv)), Lemma 5 | HOLDS | hypothesis L(1/2, chi) != 0 belongs in the map row |
| 6 | c13-noncone-kernel-separator-search | stored grid signs; table 3.1; grid tiers | HOLDS on the sample (0 disagreements in 10,123) and on the recount | random, adaptive and A3 stages not refereed |
| 6 | | Lemma H | HOLDS; consequence IN NARROWER FORM | relative to classical log-concavity of the Riemann-Polya kernel |

Reports: `REFEREE_<lane>.md` for each of the six lanes. Machine-readable: `referee_updates.json`.

## 3. Work, by item

### 3.1 Lane 1: Lemmas P, L, E (`items124.py` block lane 1, `item1b.py`)

- Lemma P is an implication with an exhibited witness; Proposition S was checked item by item. The functional-equation
  item of S1 is true in the Laurent form (frequencies log(n/p0^N)), the coefficient items of S1 and S2 in the D form
  (conductor p0^(2N)). The lane records the mixture as X4.
- Lemma L: Cauchy-Binet factorisation and the Aissen-Schoenberg-Whitney-Edrei criterion for the three-term weight
  sequence re-derived. Decisive check with a kernel whose hypothesis is provable (K = exp(-x)): c = 2, 2.0506, 3:
  100 of 100 node sets with the hypothesis sign at orders 3 and 4, every minor of W non-negative; c = 1.4142 and 0.5:
  negative minors of W and wrong signs (1 to 19 of 100). With theta: zeta's lattice-row minors -, -, + at orders 3, 4,
  5 and twins with c >= 2 equal, 100 of 100 per order, in the lane's node range and in a wider one; tempered twins
  fail (up to 93 of 100).
- Lemma E: transform identity int K3 e^((a+it)u) du = 2 xi(1/2 + a + it) to 1e-20; product over 4 equals
  abs(xi(0.8 + 3.7i))^2 = 0.13091264136; convolution kernel positive, decreasing, log-concave on the grid (-10.23).
- T-NR object: non-zero, zero of m at 0.823846 + 4.532360i (c = 2.0506) with abs(zeta) = 0.7105 there.

### 3.2 Lane 2: Theorems B, C, control BLS (`items124.py` block lane 2)

- Theorem B identity: 80 random triples, 2.3e-55. The "iff" needs the real symmetry of N to pass from the cut plane to
  the upper half-plane (standard; not written in the lane).
- Theorem C: the Mobius map and its imaginary part re-derived. A single real factor is not covered.
- BLS (a = 0.9 + 14.5i; a = 0.25 + 3i; two pairs) and T-NR (q = 2, c = 2.1; q = 3, c = 2.2): Im N >= 0 on 960 points and
  Gram matrices positive at x = 0, 0.5, 1. Anti-control M/Theta, -M, and x = -0.5: fail (45 to 512 of 960 negative;
  Gram eigenvalue ratio down to -1.0).
- Supplied: m(z)/m(z+1) is a finite Blaschke product of degree 2 in 1/q^z (the convergence step the lane lists as
  weakest step 3).
- Argued only for the affine kernel: listed in the report, six items; the main one is that closure of (I_aff) under
  M -> M Theta is OPEN.

### 3.3 Lane 3: factorisation and multiplier orbit (`items35.py` block lane 3; source text)

- BRS (4.6) read in the lane's `sources/brs.txt`: H_- = (zeta*(s)/2) A^-_(1/2)(w/2, s/2)/zeta*(w);
  H_+ = (zeta*(s)/2)[A^+_(1/2)(w/2, s/2)/zeta*(w) - alpha^+_(1,1/2)(s/2)], with h^+_1 := 0. The lane displays both
  without the subtraction. alpha^+_(1,1/2)(0) = -2 by BRS (4.4).
- Consequence: the factorisation and "kernel of zeta G = orbit point" are exact for H_-; for H_+ the orbit kernel and
  the kernel built by the source's recipe differ by a multiple of 1/G(w). Both have the target entering by division.
- T-NR multiplier checked at three (q, c): series for 1/P, symmetry, coefficient identity in exact rationals.
- Not run (as in the lane): the modular integrals and the basis functions.

### 3.4 Lane 4: poles and the vacuous inequality (`items124.py` block lane 4)

- Residues by limits: first zero: 1.0598540200154647e-10 at 3/2 and at -1/2 (closed form equal), 1e-49 at the four
  complex points, no pole at 1/2. Control (beta = 0.3, not a zero): eight non-zero residues, rightmost pole at 1.7.
- L(0, chi) = 0 for two even characters; odd: 0.632. Twisted product at w = 1 - beta: 0 (even), 0.034 and 0.247 (odd).
- Principal-character sum constant: 0.405571 against 0.405570; 0.452089 against 0.452088.
- Lemma 3 algebra in exact rationals; w*(1, n^2) = 1 - 2/(n^2 + 1).

### 3.5 Lane 5: Lemma 1 and the sign rule (`items35.py`, `item5b.py` to `item5e.py`)

- (T5) at three fresh (a/q, s): below 4e-57; the lane's D values reproduced to the digits it prints.
- Lemma 1 coded from the display: a/q = 3/8, b = 1.9i, J = 8: defect 6.1e-19 (E_J of modulus 9.9); a/q = 4/9,
  b = 0.15 + 1.2i (off the line), J = 8: 5.4e-19; a/q = 5/7, b = 3.2i, J = 9: 6.5e-18 (terms of size 133).
- Decay exponent of the integrand: measured -1.750 (J = 1, c = -0.75), -3.75 (J = 3), -6.90, -6.75, -6.60 (J = 6,
  c = -0.6, -0.75, -0.9): equal to -J - 3/2 - c.
- Sign rule: five complex characters (q = 5, 7, 7, 11, 13), 61 heights each, zeros on the line located by bisection:
  305 of 305. R_chi(t) = (q/pi)^(1/2) Z_chi(t) Z_chi(-t) to 2e-34.
- T-NR (Lemma 5): ratio equals mu mu-bar to 6e-34, positive, inside the stated bounds.
- Not completed: the lane's own first row (2/5, b = 2.5i, J = 6) with V = 1500, stopped after about 30 minutes.

### 3.6 Lane 6: independent sample and Lemma H (`item6_*.py`)

- Kernels for 35 objects (zeta, 23 characters, DH, T-NR, two E_a, two HEAT, Liouville, two EIS-w, two theta^w) written
  from PREREG section 2; validated before any comparison (`item6_validate.json`).
- 300 functionals (240 random grid rows, 20 per family; 60 rows one-signed on P2) x 35 objects = 10,500 entries:
  10,123 decided by both and equal; 377 undecided in float64 and decided here; 0 disagreements.
- Recount of table 3.1 from the stored matrices with own selection code: identical (2,794,368; 51,764; all pass
  fractions; 0 at T-train, T-weak, full).
- On the 63 functionals one-signed on all 24 positives (own signs): DH never opposite; HEAT never opposite; T-NR
  opposite on 25 (the 10 stored counterexamples to prediction 2a among them, 10 of 10).
- Lemma H: algebra re-derived; 240 targeted rows x 5 backward-heat values: 1,200 of 1,200 keep zeta's sign; tau = +60
  flips 37 rows.

## 4. Labels to restrict or downgrade (for the repair lane; none is used by a closure in a way that changes it)

1. Lane 1, verdict item 3 and section 2.3 last sentence: "exactly when the zeros leave the line" -> "for c > 0, exactly when c >= 2; zeros off the line for c > 2".
2. Lane 1, census N2 and PREFILTER.md row "T-NR, c >= 2, lattice rows": "PROVED from the zeta row" -> "PROVED relative to the measured zeta row".
3. Lane 1, use rule of Lemma P (RESULT 2.2 "Use", PREFILTER section 1): add "all hypotheses typed in one normalisation".
4. Lane 2, verdict item 2 and heading of 3.3: "arbitrary conjugate pairs" -> "non-real conjugate pairs, or real points with even multiplicity".
5. Lane 2, 3.3 (b) parenthesis (c = -2.1, single real factors): MEASURED only.
6. Lane 2, "the inequality carries no constraint on numerator zeros" (verdict item 2, 3.5, map row): proved for (I); OPEN for (I_aff). `controls_BLS_proposed.json` status "proved in rank one" stays.
7. Lane 3, section 2 display of BRS (4.6): add the term - alpha^+_(1,1/2)(s/2) in H_+ and h^+_1 := 0.
8. Lane 3, verdict item 2, map row (section 9), `engine_device_proposal.json`: "the kernel is (F*(s)/F*(w)) x A_k; the bases form one orbit" -> restrict to H_-; for H_+ state the additive term.
9. Lane 3, Lemma T: frequency set has one sign at m = q^2 in the H_+ family.
10. Lane 4, opening summary: "the one displayed inequality the device yields" -> add "relative to the reconstructed threshold (3.1)".
11. Lane 5, Lemma 1 status line: O(abs(v)^(-J-1)) -> O(abs(v)^(-J-3/2-c)), -1 < c < -1/2.
12. Lane 5, map row sentence on the sign of R_chi(t): add the hypothesis L(1/2, chi) != 0.
13. Lane 6, section 4 Lemma H "Consequence": add "relative to the classical log-concavity of the Riemann-Polya kernel (source not opened)".

## 5. Comparison with the lanes' own referee notes (four greps, after the reports were written)

- Lane 5: the lane's second pass lists the same correction of the decay exponent (its item E1); RESULT.md still
  carries the old exponent. Found independently here; agreement.
- Lane 2: the lane's second pass also notes that a single real factor is not covered, with the same formula. Agreement.
- Lane 3: no line of the lane's REFEREE.md mentions the subtracted term of H_+ or h^+_1. Item 7 to 9 of section 4 are
  new.
- Lane 1: the lane's second pass ran c = 2; the separation of c = 2 in the wording is new here.
Nothing else of the lanes' referee files was read.

## 6. Controls

This lane proposes no argument. The control question applies to the refereed statements, and each first check was run
on a control object verified not identically zero:

| control | where it was run here | outcome |
|---|---|---|
| T-NR (c > 2) | lane 1 (object, Lemma L, kernels), lane 2 (Maass-Selberg), lane 3 (multiplier), lane 5 (Lemma 5), lane 6 (35% of D1 one-signed rows rejected) | passes Lemma P types, rank-one Maass-Selberg, the interpolation kernel, the J-form; is rejected by non-cone minors |
| BLS | lane 2 | passes rank-one Maass-Selberg with a prescribed off-line zero; anti-control fails |
| E_a / EIS-w (generic parameter) | lane 4 (eight residues, same pole 2 - beta), lane 1 (Lemma E), lane 6 | passes the LRS device with the same output; never rejected on D3a in the sample |
| Davenport-Heilbronn | lane 6 (battery DH kernel) | never opposite on functionals one-signed on the 24 positives (63 of 63 sampled; 0 of 51,764 on the grid recount) |
| backward heat | lane 6, Lemma H | never opposite on the covered order-2 functionals (1,200 of 1,200); forward heat flips |
| tempered twin (abs(c) < 2) | lane 1 | fails lattice-row minors where T-NR passes |
| sign twist (Liouville), theta^w | lane 6 sample | signs agree with the stored record |
| unimodular twist, deletions, Beurling, phase-rotated transfer operator | not run here | - |

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument about zeta is made; the refereed lemmas say where multiplicativity is not consumed |
| R2 (height-uniform, every window) | false | no statement at height |
| R3 (every control fails structurally) | false | the refereed statements are the opposite: named controls pass (section 6) |
| R4 (reaches the critical line) | false | nothing crosses |

No score. Verdict of this lane: precise record of which round-13 statements hold and in what form; no new result.

## 8. Three weakest steps

1. **Lane 6 is refereed on the grid stage only.** 300 functionals of 2.79 million were recomputed; with 0 errors in
   10,123 entries a wrong-sign rate of about 1 in 3,400 is not excluded at the 95% level. The 10.2 million functionals
   of the random, adaptive and A3 stages, the ball stage, the held-out members and the seeded SGN, U, DEL, THIN members
   were not recomputed (their sign matrices are on the server; the server was not used). The referee's tails are
   truncated, not enclosed, and two kernel evaluations use evenness of zeta's K3.
2. **Lemma 1 of lane 5 and the factorisation of lane 3 are not re-proved.** Lemma 1 is confirmed at three fresh
   instances to 1e-17 and Bettin's paper was not opened; the boundary limit for E_J remains "assembled in the lane".
   The lane's first row at V = 1500 was not completed here. For lane 3 no kernel was computed: the narrower form rests
   on reading BRS (4.4), (4.6), (4.9) and section 4.3 in the lane's text extraction and on algebra; the claim that the
   H_+ coefficient at m = q^2 vanishes in the orbit kernel follows from h^+_1 := 0 and was not checked on computed
   alpha_n(s). Bochner's theorem and Kulikov's inequality were not opened.
3. **The hypothesis of Lemma L and the classical inputs.** Zeta's lattice-row minors have a constant sign on 100 node
   sets per order in two ranges (measured); no proof. Aissen-Schoenberg-Whitney-Edrei, the kernel criterion for
   Nevanlinna functions, the classical Maass-Selberg positivity for T >= 1 and the log-concavity of the Riemann-Polya
   kernel are used as classical statements without opening a source. Three first-pass errors of this referee's own
   code (40-term theta, 30-term K3 at negative arguments, midpoint zero locations) were found and are recorded in the
   reports with the superseding runs; the same kind of error may remain where no second check exists.

## 9. Files (all under `tmp/research-2026-11-16/push/c14-referee-r13-independent/`)

- `RESULT.md`, `referee_updates.json`, `lanes.jsonl`
- `REFEREE_c13-tnr-invariance-prefilter-noncone-census.md`, `REFEREE_c13-kacmoody-eisenstein-affine-weyl-shift.md`,
  `REFEREE_c13-fourier-interpolation-zero-nodes.md`, `REFEREE_c13-lrs-twist-amplification-zero-representation.md`,
  `REFEREE_c13-bilinear-reciprocity-height-antibridge.md`, `REFEREE_c13-noncone-kernel-separator-search.md`
- lanes 1, 2, 4: `items124.py/.json/.log`; lane 1 supplement: `item1b.py/.json/.log`
- lanes 3, 5: `items35.py/.log` (stopped before its JSON was written); lane 5: `item5b.py/.json/.log` (first pass of
  the sign rule, superseded), `item5c.py/.json/.log`, `item5d.py/.json/.log`, `item5e.py/.json/.log`
- lane 6: `item6_kern.py`, `item6_validate.py/.json/.log`, `item6_run.py/.log`, `item6_signs.jsonl` (300 rows, own and
  stored signs per object), `item6_analyse.py`, `item6_summary.json`, `item6_lemmaH.py/.json/.log`,
  `item6_recount.py/.json/.log`

Run record: every script as `scripts/memcap.sh 8 .venv-arb/bin/python -I <script> <absolute output path>`; longest
runs: Lemma 1 instances about 7 minutes each; lane-6 sample 33 s on 8 worker processes (a few hundred MB in total);
largest file read: the memory-mapped sign matrices of the refereed lane (375 MB each, not loaded).
