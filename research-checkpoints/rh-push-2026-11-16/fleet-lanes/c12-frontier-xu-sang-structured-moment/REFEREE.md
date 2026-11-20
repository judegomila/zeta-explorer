# REFEREE: c12-frontier-xu-sang-structured-moment (second pass by the lane's own agent; NOT an independent referee)

Date: 2026-11-19. Object: `RESULT.md` in this directory. This file is a self-check by a different method. It does
not count as a referee pass under the campaign rule; the lane makes no statement about zeros of zeta. The lane line
records referees = 0, refereeHolds = null.

## What was re-derived, and how

1. **Lemma C by hand.** (N - d)(15 - 6d) - (15 - 16d) expanded twice: 6d^2 - (6N + 15 - 16)d + 15N - 15 with
   N = kappa_6 - 1 gives 6d^2 - (6 kappa_6 - 7)d + 15(kappa_6 - 2). 6 kappa_6 = 37 - 10 sqrt 6, so the linear
   coefficient is 30 - 10 sqrt 6 and its square is 1500 - 600 sqrt 6; 360(kappa_6 - 2) = 60(25 - 10 sqrt 6) =
   1500 - 600 sqrt 6. Double root at (30 - 10 sqrt 6)/12 = delta*. Agrees with the script's exact check.
2. **kappa_6 from the text.** F(a) = (31 - 32a)/(21 - 12a) + 2a at a* = (21 - 5 sqrt 6)/12: 21 - 12a* = 5 sqrt 6,
   31 - 32a* = -25 + (40/3) sqrt 6, quotient 8/3 - (5/6) sqrt 6, plus 2a* = 7/2 - (5/6) sqrt 6: total
   37/6 - (10/6) sqrt 6. Matches lines 1190-1197 of the manuscript text.
3. **Count by the definition** (`recheck.py`, float min-max-min over (t, r), no closed form): R(delta_c, 1/2) =
   0.59050, R(delta_c, 0) = 0.61514, monotone in x at 450 classes. The least margin printed there is -1.5e-4: this
   is at x = 0 near delta*, where the exact margin is 6(delta - delta*)^2/(15 - 6 delta) (3e-5 at the nearest grid
   point) and the script's grid over-estimates R by about 3.5e-4. It is not a counterexample; the exact statement
   is the identity.
4. **Transcriptions against the texts.** Theorem 1.2 (lines 93-102), the comparison Q^(13/6) (110-113), Lemma 6.1,
   6.2, Prop 6.3 (1034-1125), Lemma 7.1 and the proof of the moment (1151-1201), Prop 7.2 with its error
   Y^(13/6 - c) (1205-1245); Liu II (13.2), (13.3) and the hypothesis list (5015-5047), Prop 2.6 (660-675), the
   capacities z_M, z_S in the count (5882-5900).
5. **Abscissa.** Rational bisection and mpmath Newton agree to 30 digits; value equals c11's.

## Points a referee should attack

- **P1. Normalisation.** The comparison of kappa_6 - 1 with the level value 1 assumes that "centrally normalised"
  in Liu II means division by the square root of the length, so that (1.4) at length Q carries the factor Q. If
  the prime sums of Liu II are normalised differently (for example with a logarithmic weight), the figures move by
  U^eps only; a different power normalisation would change section 2's exponent row. Lemma 7.1 (size Q^a per row,
  a >= 1/2 the square-root size) supports the reading used.
- **P2. Lemma X depends on the option formulas of `r3-critical-count` section 1** (M1, M2 nonincreasing in x).
  They were read there, not re-derived from Liu II (13.14)-(13.16).
- **P3. "Fits neither" versus "fits Z11 as an option that is never selected".** The lane files the outcome as
  (iii). A referee may prefer (ii) for Z11 (the shape of a Chebyshev count option exists once a spike is granted).
  The consequence is the same in both readings: no changed figure, slot withdrawn.
- **P4. Spike.** The forced substitution grants a lower bound for a prime sum of length Q on detected rows. No
  source gives it. The lane uses it only in the direction that favours the new input, so the negative result does
  not depend on it.
- **P5. Other slots.** Weakest step 1 of RESULT.md: Z10's numerator average and the preliminary stage were not
  searched for a place where a prime-only moment at length 1 could act.

## Disposition

No PROVED or EXACT step failed in the second pass. The verdict stands as: precise obstruction, part B only,
figure unchanged, slot withdrawn. Independent referee: owed if the record lane wants the map rows of section 7
entered as refereed.

---

# INDEPENDENT REFEREE (adversarial, lens: general), 2026-11-19

Separate agent; the section above is the lane's self-check and is left unchanged. Object: `RESULT.md`.
Method: own algebra, own reading of the two manuscript texts, own script (python-flint ball arithmetic at 300 bits
and exact rationals; no code shared with `slot_test.py` or `recheck.py`; run through `scripts/memcap.sh 8`, under
10 s). Proofs inside the manuscripts were not checked (the lane does not claim them).

## Disposition

**HOLDS** as filed: precise obstruction, part B only, figure unchanged, no statement about zeros of zeta.
No PROVED or EXACT step failed. Four corrections below (E1 to E4); none changes the verdict or a figure.

## Steps re-derived

1. **Theorem 1.2 as transcribed.** Text lines 93-102: R(sigma) = (31 - 32 sigma)/(21 - 12 sigma) for
   51/100 < sigma <= 7/8, T <= (log Q)^C; P_6(Q; V) << Q^(kappa_6 + eps), kappa_6 = (37 - 10 sqrt 6)/6. Section 7.2:
   F'(a) = 2 - 300/(21 - 12a)^2 (re-derived: numerator -32(21 - 12a) + 12(31 - 32a) = -300), zero at
   21 - 12a = 5 sqrt 6. Ball check: F(a*) - kappa_6 and F'(a*) both contain 0. Comparison Q^(13/6) at lines
   110-113. Confirmed.
2. **Lemma C.** (N - d)(15 - 6d) - (15 - 16d) = 6d^2 + (1 - 6N)d + 15(N - 1) = 6d^2 - (6 kappa_6 - 7)d +
   15(kappa_6 - 2); (30 - 10 sqrt 6)^2 = 1500 - 600 sqrt 6 = 360(kappa_6 - 2). Double root (15 - 5 sqrt 6)/6.
   15 - 6d > 0 on the range. R0(d) = R((1 + d)/2) checked. Different case: identity and strict positivity at 830
   values d = i/997 (the lane used 5i/6000). Second branch: R(11/12) = 1/6 = 1 - 5/6, continuous. Confirmed.
3. **Normalisation and Chebyshev.** Rows about Q, prime sum of length about Q, per-row size Q^a from Lemma 7.1;
   dividing the square by Q gives per-row Q^delta with delta = 2a - 1 and total Q^(kappa_6 - 1). Rows with spike
   U^delta number at most U^(N - delta). Confirmed.
4. **Lemma X.** From the r3 definition: M1 = 1 - d r - 2 d x (1 - r)/c1 and M2 = 1 - 2 d m - 2 d x (1 - 2m)/c2 are
   nonincreasing in x on r <= 1, m <= 1/2; the long branch and the admissible set do not contain x. So the
   min-max-min is nonincreasing in x. Independently on the closed form (13.16), transcribed here from the Liu II
   text (lines 5909-5912, c = 2/(3 kappa)): R = 1 - d + (5/6 - d) d / (2((5/6 - d) D/P + d)), and
   d/dx log(D/P) = -(1 + c)/D + c/(2 - cx) + 1/(1 - x) >= 0.777 on [0, 1/2] for 2/3 <= c <= 12/13, so R decreases
   in x. At x = 0: 1 - d + (5 - 6d)d/(15 - 6d) = (15 - 16d)/(15 - 6d), by hand. Definition against closed form at
   three classes the lane did not use, grid 801 x 1601: (0.6, 0.3, 0.8) 0.465625 / 0.465625;
   (0.3, 0.5, 13/18) 0.746688 / 0.746693; (0.75, 0.1, 1) 0.285313 / 0.285283. Confirmed.
5. **Forced substitution, different case.** kappa in {13/18, 4/5, 9/10, 0.749773, 29991/40000}, delta = 5i/1266
   (i = 1..211), x = j/146 (j = 0..73): 78070 classes, 0 monotonicity violations, 0 x = 0 mismatches, option
   strictly above the count in both readings at all 78070 (ball arithmetic, signs certified). Least margins
   0.02333 (reading a; kappa = 0.9, delta = 0.5134, x = 1/2) and 1.9e-7 (reading b; x = 0, delta = 0.45814, the
   tangency). 20000 random rational classes with kappa in [13/18, 1]: 0 failures. The chain
   N - 2 d x >= R0(2 d x) >= R0(d) >= R(d, x) needs R0 decreasing (derivative numerator -150) and x <= 1/2. Confirmed.
6. **Critical class.** R_c = 0.5903323524 from the text's formula; N - delta_c = 0.6148389; threshold
   N < 1.0596772; shortfall 0.0245065. Window (0.87285, 1.11246) arithmetic confirmed; Lemma W2 itself not re-derived.
7. **Abscissa.** Quartic as printed in Liu II (text lines 22, 97, 981). Arb root isolation: four real roots
   0.40926, 0.56402, 0.874886647039964130944614000530, 0.97303; exactly one in [5/6, 7/8]. Equal to the
   scoreboard figure. Confirmed.
8. **Slot hypotheses.** (13.2), (13.3) and the hypothesis list read at lines 5013-5033; capacities z_M, z_S at
   5886-5900. z = 1 lies outside both ranges. Confirmed, with E1.

## Errors and gaps

- **E1 (wrong number, harmless).** Section 2 and the verdict state that M1 allows z < 1/2 at r = 0. M1 has two
  conditions; 2r + 8z < 3 gives z < 3/8 at r = 0. The correct M1 range without a witness factor is z < 3/8. The
  conclusion (z = 1 outside) is unchanged. `slot_test.py` check 6 tests only 1 > 1/2.
- **E2 (gap in "selected at no class", closable in one line).** Readings (a) and (b) cap the granted spike at
  delta. The r3 class is "a zero at a", not "rightmost zero at a", so a row of class (delta, x) may carry a
  zero further right and a larger prime sum. At the critical class a granted spike s > 0.493851 would give
  N - s < R_c. This does not reopen the slot: by Lemma 7.1 a row with spike U^s lies in a bin a' >= (1 + s)/2,
  so such rows number at most U^R0(s) already, and N - s >= R0(s) by Lemma C. The option then returns at most the
  count the theorem was proved from, at the row's own higher class. RESULT should state this case; as written the
  claim covers spikes up to delta only.
- **E3 (record inconsistency).** `recheck.log` prints least margin -0.000150 and "grid error about 2e-3";
  RESULT weakest step 2 says "about 2e-4" and RESULT does not mention the negative float margin (only the
  self-check does). The exact statement is not affected (item 5 above), but RESULT should carry the caveat.
- **E4 (range and wording).** (i) The printed count R(sigma) in Theorem 1.2 is for sigma <= 7/8 (delta <= 3/4);
  the branch up to a = 11/12 and R = 2 - 2a beyond is taken from the proof in section 7.2, not from the theorem
  statement. (ii) Section 4 says the general norm Q^(13/6) is "sharp by its Theorem 1.1" for a sign-twisted
  prime column; Theorem 1.1 gives sharpness of the operator norm for some vector, not for sign-twisted prime
  vectors. Correct wording: Q^(13/6) is the only bound available there. (iii) "z < 3/13" for M2 is the value at
  kappa = 13/18; at kappa_flat it is 0.2223.
- **Outcome label.** For Z11 the accurate description is "admits a Chebyshev count option only under a granted
  spike that no source supplies, and that option is dominated". Filing it as (iii) is acceptable; consequence
  identical.

## Checks on the campaign rules

- RH is not assumed. The M2 premise beta_* <= (1 + kappa)/2 is listed as a hypothesis of the slot, not used.
- No verified-height statement. No known theorem presented as new: Lemma C is elementary algebra on a cited
  exponent and is labelled so; Lemma X is relative to the Liu II transcription.
- No zeta-only mechanism is claimed, so there is no control to run. The statement that the substitution is the
  same under every target-side control is correct by construction (the moment contains no target).
- Withdrawal of the frontier slot matches STRATEGY section 3 table row "frontier (part B)" (withdrawn after two
  rounds without a changed figure).
- Still open and disclosed (weakest step 1): rows Z10 and the preliminary stage were not searched; "fits neither"
  is established for M1, M2 and the Z11 Chebyshev option only.

## Requirement flags (set by this referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No argument about the target; exponent bookkeeping. |
| R2 | false | No conclusion about zeros. |
| R3 | false | Every target-side control leaves the result unchanged. |
| R4 | false | No passage to the critical line; abscissa unchanged at 0.8748866470 (unrefereed inputs). |

Surviving claim: Xu-Sang 2610.17675 v2 Theorem 1.2, as stated in the text, changes no count in the Liu II scalar
system through M1, M2 or a Chebyshev option at Z11 (spike up to delta checked exactly; larger spikes by E2);
part-B figure 0.8748866470 unchanged; all relative to unrefereed manuscripts.
