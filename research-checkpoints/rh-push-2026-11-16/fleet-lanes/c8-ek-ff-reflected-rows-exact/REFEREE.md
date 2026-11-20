# REFEREE (independent, lens: general): c8-ek-ff-reflected-rows-exact

2026-11-18. Independent adversarial referee; not the author of the lane. The author's same-agent check that was in
this file before is kept unchanged as the appendix at the end. Only this file was written. All runs local, through
`scripts/memcap.sh 8`; the compute server was not used.

## Outcome

**holds = true, in a reduced form.** Every PROVED step was re-derived and confirmed numerically with code that
shares nothing with the lane's code. The exact integers reproduce. One headline sentence of the verdict is
stronger than the data ("(E-K) fails for the target beyond h = 3"); it is ARGUED, not established, and the
blanket wording "4 to 15 times the diagonal once the dual length exceeds 3N" is false on the lane's own table.
No statement about zeta is made; nothing assumes RH; verified height is not used; no classical fact is presented
as a new theorem (Lemma R is orthogonality of independent phases, Proposition C is Bessel's inequality; both are
labelled as such).

Requirement flags set by this referee: **R1 = false, R2 = false, R3 = false, R4 = false** (agree with the lane).

## 1. PROVED steps, re-derived

| step | re-derivation | numeric confirmation (referee's own) |
|---|---|---|
| Lemma R (mean over random phases = diagonal) | E u_A conj(u_B) = 0 for A != B needs only E u = 0 and independence; holds for sixth roots of unity. The column norm is #{m : (m, A) = 1} because \|g_3(1, A)\|^2 = \|A\| for squarefree A and \|chi_A(m)\| = 1 iff (m, A) = 1. In `ffx.c` the phase of mode 1 is a hash of A = P A' (not of the pair), so beta_A = W(A) u_A with fixed modulus: the lemma applies to what was run. Correct. | 30 new seeds (101..130) at configurations the lane did not use: q = 7, (N, lam, d) = (2, 3, 3): mean e = 1.010, standard error 0.008; q = 13, (2, 2, 2): 1.016, standard error 0.011 |
| Lemma AL (aligned vector) | \|\|T beta\|\|^2 >= \|B_{m_0}\|^2 is trivial; with the g_3 phase also removed (as the code does) B_{m_0} = sum of the multiplicities. "About q^(N+lam-d)" is a size statement, not an identity. Correct. | all 264 aligned rows in the result files: sumnorm >= maxnorm >= nsupp^2, 0 exceptions (equality maxnorm = nsupp^2 in 143) |
| Lemma Q (counting) | c prime to A' and divisible by P (P not dividing A') iff c = P c' with (c', A') = 1; mu(P A') = -mu(A'). Correct, including the sign of corr. | new cases with lam > N (corr = 0): q = 7, N = 2, lam = 3, weights a, b, mu, th, k = 0..5 and q = 13, N = 1, lam = 2, weights a, mu, k = 0..4: S^marked(k) = -pi(lam)[S^base(k) - S^base(k - lam)] in all 34 values (pi(3) = 112, pi(2) = 78). One case with corr: q = 7, N = lam = 1, k = 1, target a: -7(6 - 1) + 5 = -30, as stored |
| Proposition C (Bessel at dual length 0) | Needs (i) pairwise orthogonality of c_k, k <= d/2, (ii) the norms, (iii) \|J_k\|^2 = wt_k^2 q^(2d) S_cop(k)^2 at r = 0, in the same normalisation as the energy. All three are inputs from c7 (EXACT there, i.e. checked, not proved here). The inequality given them is correct. | referee's script from the definitions (Euclidean resultant, complex floats, c_k(m) summed from g_6(m, c) directly; no code or cache of the lane used), 5 cases: q = 7 (2,1,3) a; (2,1,4) b; (1,2,4) mu; (1,1,2) a; q = 13 (1,1,2) a. Norms \|\|c_0\|\|^2 = q^d and \|\|c_k\|\|^2 = q^(d+2k)(1 - 1/q): equal to 4 decimals. Inner products < 1e-10. \|J_k\|^2 at r = 0 equals q q^(2d) S_cop(k)^2 to the last digit (e.g. 28491293628; 7883642077948; 161735230800). J_k = 0 for r < 0. Over the whole data set: e >= B_0 in 692 of 692 (configuration, weight) pairs having an r = 0 probe, minimum of e - B_0 equal to 0 (mu at (1,1,1), q = 7) |

Proposition C is PROVED only relative to c7's three inputs. Those inputs are confirmed here only in the
non-principal class (wt^2 = q); the principal class 6 | k - N - lam at r = 0 is outside brute-force range and was
not independently checked by this referee.

## 2. Numeric check with a different case

The same script recomputes energy and diagonal from the definition. Sum of |B_m|^2 / q^(N+lam) and the diagonal,
referee / result file:

| case | sumnorm | diagsum | sumW2 |
|---|---|---|---|
| q = 7, (2,1,3), target a | 65010 / 65010 | 58536 / 58536 | 222 / 222 |
| q = 7, (2,1,4), target b | 427532 / 427532 | 470232 / 470232 | 262 / 262 |
| q = 7, (1,2,4), mu | 1030029 / 1030029 | 296352 / 296352 | 147 / 147 |
| q = 13, (1,1,2), target a | 39624 / 39624 | 24192 / 24192 | 168 / 168 |

The lane's own brute force had no q = 13 case and no target b case. Counts recomputed from `results_q*.txt` with a
separate parser: 2452 energies, 189 + 75 configurations; bulk (K-region, N >= 2, 1 <= lam <= 6, d >= 3): target a
65 at q = 7 (largest a = 1.0099 at (3,4,3)) and 18 at q = 13 (largest 1.0014), target b 50 (largest 0.9946), all
<= 1.05. These agree with the write-up.

## 3. Errors and overstatements

1. **"(E-K) fails for the target beyond h = 3" is not established.** It is the ARGUED consequence of the measured
   law plus |M_N| about q^(N/2). The data do not locate a line r = 3N:
   - Configurations of table T9 with rmax > 3N and energy at or below the diagonal for a Weil target: (1,5,2)
     a = 0.378; (1,6,2) a = 0.625; (1,7,3) a = 0.579, b = 0.533; (1,9,2) 0.020, 0.017; (1,10,2) 0.0020, 0.0017;
     (2,7,2) a = 1.19, b = 0.629 (exponent 1.01, a pass by the lane's own threshold). Over all configurations with
     rmax > 3N the target energies range from 0.0017 to 14.6 times the diagonal. The phrase "4 to 15 times the
     diagonal once dual length exceeds 3N" holds for 5 of them, taking the larger of the two targets each time:
     target b at (1,7,2), (1,8,2), (1,8,3), (1,8,4) and target a at (2,10,2).
   - At N = 1 the "Weil target" carries no cancellation information. The Moebius sums are M_1(a) = 1, M_1(b) = -3
     (`ffx sc 7 2 1 0 ...`), against the trivial bound 7 and q^(1/2) = 2.65; the random non-multiplicative sign
     vector n1 has M_1 = -3 and gives the same integers as target b in every N = 1 run. The N = 1 excesses are
     therefore the statement "a +-1 vector on seven linear polynomials with |M_1| = 3", not a statement about a
     target obeying a square-root bound. At N = 1 the jump also coincides with the first staircase step r >= 6 of
     the sixth-power count, so "r > 3N" and "r >= 6" cannot be told apart there.
   - That leaves one informative point: (2,10,2), target a, 49 rows, e = 4.13, and its pre-registered interval
     [4.4, 5.7] was missed. Target b at the same configuration is 1.55 (exponent 1.07: "undecided" by the rule).
   - For target a the long-mark exponents at N = 1 are 1.06 to 1.15, i.e. "undecided" by the pre-registered rule;
     the exponents 1.49 and 1.32 quoted in the verdict are target b (= n1).
   Corrected wording: at 6 small configurations (N <= 2, d <= 4, q = 7 only) a +-1 weight whose Moebius sum is
   not small against the sixth-power count shows energy 4 to 15 times the diagonal, in line with the coherent
   term; the threshold h = 3 and any growth in the degree are ARGUED.
2. **"(E-K) is the conclusion restated" has one proved direction only**, at dual length 0. The converse (no other
   term above the diagonal) is the measured bound n <= about 1.1, with exceptions the write-up reports (n up to
   2.07 for target b unstarred; -1.7 to 6.7 with starred probes). For mu the measured law gives n < 0 (to -0.35 at
   q = 13), so B_coh as defined over-counts for 1 <= r <= 5 in some configurations; it is an approximation, not a
   lower bound, outside r = 0.
3. **Compensated probe, selective range.** "rho is 0.18 to 0.23 at lam = 1 in the blocks that obey the signal law"
   is the range for a, b, mu in the region lx >= l. `q2_summary.txt` shows rho = 0 in some signal-law blocks of the
   region lx < l and rho up to 0.4495 for n1. "About q^(-lam)" is within a factor 1.2 to 1.6 for the targets and
   3.1 for n1. The conclusion "a signal of the same order survives" does not depend on this, but it rests on one
   slot, lam <= 2, d <= 5, r <= 5, and the sign of the subtraction is undetermined in the model. I checked the
   first stored block by hand: |J_m|^2 = 7 * 7^4 * 30^2 = 15126300 and |rescaled|^2 = (7 * 7^2)^2 * 7 = 823543;
   both match, and the referee's script gives |J_1|^2 = 15126300 independently.
4. **Title object not computed.** Reflected completed rows are NOT-RUN (stated by the lane). "The energy does not
   depend on the representation" is true for a reflection that is an identity for each B_m, but no such identity
   was derived for the rows computed, and the completion (cube part) is a different vector. Nothing in this lane
   tests a prediction that is specific to the reflected representation.
5. **Threshold rule is weak at these sizes.** a <= 1 at e = 1 by construction, and at d = 3 the rule a <= 1.05
   admits e up to about 1.3 (target a passes with e = 1.21 at (3,4,3)). The bulk verdict rests on e being within a
   few percent of 1 for N >= 4, as the lane says in its section 9.
6. **Controls.** The DH-type control dh cannot fail in a model where every member satisfies Weil's theorem; th is
   not a prescribed-zero construction; tb is not the THIN control of the obstruction map. Stated by the lane.
   Backward heat, unimodular twist as a family, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer
   operator, theta^w: not run. No zeta-only mechanism is claimed, so there was no such mechanism for this referee
   to test against controls; the control runs that exist (r1 new seeds) were repeated above.
7. **Process.** Five compilations were run directly over ssh and one unit's quota was changed with
   `systemctl --user set-property`; both are outside the rhrun rule of the BRIEF (disclosed by the lane). The
   same-agent file was dated 2026-11-19 on 2026-11-18 (server clock).

## 4. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | The statistic is a quadratic form in the coefficient vector. Lemma R, Lemma AL and Proposition C hold for arbitrary weights; n1 (not multiplicative) gives the same integers as target b at N = 1 and the same outcome elsewhere |
| R2 | false | Fixed q, degrees <= 12, F_q[T]; no statement about zeros or heights |
| R3 | false | r1, n1, th, dh, mn behave as the targets; r1 passes where the targets do not |
| R4 | false | No abscissa is changed; the hypothesis tested is, where proved, a consequence-equivalent of the bound it was meant to supply |

## 5. Surviving claim

F_q[T] model, exact integers, q = 7 and 13, 2452 row energies of squarefree unreflected marked rows (reflected
completed rows NOT-RUN). PROVED: mean energy over random phases equals the diagonal (Lemma R); the aligned vector
reaches the Hilbert-Schmidt size (Lemma AL); the counting identity for marked Moebius sums (Lemma Q); energy /
diagonal >= B_0 at dual length 0 relative to c7's norms, orthogonality and Proposition 3 (Proposition C), so a
bound on the energy implies a bound on the Moebius sum of the weight. MEASURED: in the bulk (N >= 2, lam <= 6,
d >= 3) the targets and the vectors r1, n1, th, dh, mn are all at the diagonal level (exponent <= 1.05; target a
largest 1.010), so the row energy does not separate the targets from generic vectors; mu and tb exceed the
diagonal by about the coherent term. At 6 small long-mark configurations (N <= 2, q = 7) +-1 weights exceed the
diagonal by factors up to 15; that this is a failure of (E-K) for Weil targets beyond h = 3 is ARGUED only.
Compensated probe: modulus identity exact in 40 blocks at dual length 0; the rescaled term is a fraction of order
q^(-lam) of the marked one in the target blocks; one slot, lam <= 2. No statement about zeta.

Referee files (not kept in this directory): `/tmp/ref_c8ek/ind.py` (definitions-only check), `/tmp/ref_c8ek/an.py`
(recount from the result files).

---

# Appendix: the author's same-agent check (unchanged; counts as zero independent passes)

# REFEREE (same-agent check): c8-ek-ff-reflected-rows-exact

2026-11-19. This is a check by the author of the lane, not an independent referee. It counts as zero independent
referee passes. It lists what was re-derived or re-computed by a path different from the one that produced the
claim, what was corrected, and what does not hold as first written.

## 1. Re-computed by an independent path

| claim | check | result |
|---|---|---|
| definition of B_m and the energy kernel | `referee_bf.py`: python, complex floats, resultant as the norm of multiplication by x on F_q[T]/(c) (no code shared with `ffx.c`), 6 configurations including d < N + lam and w = mu | energies and diagonals agree (`referee_bf.log`); the energy 0 of mu at (2,1,1), (1,2,1) is reproduced |
| kernel against the c7 data | `verify_c7.py` on the stored exact integers | 725 row vectors, 304 excess values, 0 mismatches |
| five kernel rewrites | identical output lines between consecutive versions | 728 lines, 0 differences (`v1v2.log`) |
| generator tables, irreducibility test | `ptcheck`, `irrcheck` | 0 differing tables; 0 disagreements on 505,749 polynomials |
| Moebius sums S_cop(k) | `referee_sc.py` against the S_cop fields of the c7 block files | 2286 values, 0 mismatches |
| Lemma R | forty seeds of the random unimodular vector at (N, lam, d) = (3,3,3) and (3,4,2), q = 7 | mean 0.991 (standard error 0.009) and 0.985 (0.025) |
| coherent term at a new dual length | prediction file written before the run of (2,10,2), (1,10,2) | 4 of 6 statements inside the stated interval; see section 2 |

## 2. Statements that did not hold as first written (corrected in RESULT.md)

1. **Pre-registered control.** "A random unimodular vector must show the K-loss size" is false (Lemma R). The control
   that shows the operator-norm size is the aligned vector, which was added.
2. **First draft of the verdict.** The first draft said "(E-K) holds in the model for the targets" and "energy =
   diagonal + coherent part + small". Both were too strong. The long-mark runs, made after the draft, show Weil
   targets 4 to 15 times above the diagonal when the dual length exceeds 3N, and show energies far below the
   diagonal (0.0003 to 0.02) where no probe has a principal class. The law was restated as "energy = n + B_coh with
   n between 0 and about 1.1".
3. **Prediction file.** Target a at (2,10,2): predicted [4.4, 5.7], measured 4.13. r1: predicted "1 within a few
   percent", measured 0.888 (49 rows; the seed spread of section 1 at 49 rows is 0.155, so the stated tolerance was
   wrong, not the lemma). (1,10,2): "no excess" held, "within 0.5 of the diagonal" did not.
4. **Count for r >= 6.** The principal count without coprimality conditions is high by about (1 - 1/q)^(-2) on most
   starred configurations and low by a factor 1.6 at (1,8,4). The write-up marks these as starred and does not use
   them for an identity.

## 3. Points a reader should not take further than stated

- The object is the squarefree unreflected row. "Reflected, completed" in the title of the assignment is NOT-RUN.
  The invariance of the energy under reflection is a remark about an identity, not a computation; the completion
  (cube part) is a different vector and its energy was not computed.
- "(E-K) is the conclusion restated" has one proved direction (Proposition C, and only at dual length 0, relative
  to c7 Proposition 3, which itself rests on the predecessors' Theorem A and Lemmas G, R). The other direction is
  the measured bound n <= about 1.1; it is not a theorem.
- "False for a Weil target beyond r = 3N" is a constant-factor excess at d = 2 to 4 and N = 1, 2, explained by the
  coherent term. The power law in the degree is ARGUED. q = 13 has no long-mark run.
- The thresholds 1.05 / 1.15 were applied to a = log_q(Enorm)/d at single configurations and to slopes over three
  sizes. At d <= 7 they are coarse; the bulk verdict rests on e within a few percent of 1 for N >= 4, not on the
  exponent arithmetic.
- The compensated probe: the modulus law is exact at dual length 0 (40 blocks). The sign of the subtraction is not
  determined in the model (relative unit with cosine +-sqrt(3/7) at lam = 1). "h > 1 survives" uses only that the
  rescaled term is about q^(-lam) of the marked one, which holds for either sign. One slot, lam <= 2, d <= 5.
- At N = 1 several weights give identical integers (a = th = mn; b = n1). This is expected (seven linear
  polynomials, the energy depends on the weight through its Moebius sums there) but it means the N = 1 rows of the
  tables are fewer independent cases than the counts suggest.
- At q = 13 targets a and b are the same case.
- The control tb is not the THIN control of the obstruction map (no set of density x^(b-1) can be thin at degrees
  <= 6); it is a sign twist with a large Moebius sum. th is a random multiplicative sign vector, not a construction
  with a prescribed zero.

## 4. Process faults (also in the compute record)

One unit of this lane was killed by its own memory limit (announced 19.5 GB against a 16 GB limit; my guard was set
at 30 GB). The job was dropped and the guard lowered; the limit was not raised. Two production units were stopped
by me three minutes after launch because the job list contained far slower jobs than planned. Five compilations were
run directly over ssh. Three small local runs were not started through `memcap.sh`.

## 5. Outcome of this check

The exact integers stand (five independent comparisons, no mismatch). The verdict stands in its corrected form
(section 2, item 2). No statement about zeta is made. Independent referee passes: 0.
