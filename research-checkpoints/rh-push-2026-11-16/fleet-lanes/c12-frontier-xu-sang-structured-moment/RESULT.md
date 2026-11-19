# c12-frontier-xu-sang-structured-moment: Xu-Sang 2610.17675 v2, Theorem 1.2, against slots Z11 and M2 of the 7/8 ledgers

Round 12, frontier slot (scoreboard part B only). Kind: deepen. Date: 2026-11-19. Not refereed by a second agent.
This lane makes no statement about zeros of zeta, cannot change the headline, and has **no answer for R4**. It is
exponent bookkeeping inside the 7/8 architecture, relative to unrefereed manuscripts. All four requirement flags
are false. Score 0 by construction. The compute server was not used.

Labels: PROVED (argument written here) / EXACT (rational or Q(sqrt 6) arithmetic, script named) / PROVED-rel X /
CITED (read in the named text, proof not checked) / MEASURED (float) / OPEN.

## Verdict

**Outcome (iii): the theorem fits neither slot, and a forced substitution changes no figure. The frontier slot is
withdrawn from round 13 under STRATEGY section 1** (second consecutive round without a changed figure; no other
candidate from this input family is on file).

- Part-B abscissa: **0.8748866470** (30 digits: 0.874886647039964130944614000530), unchanged, inside [5/6, 7/8].
  No new part-B number.
- Slot M2 (and M1): closed by the **range**. The theorem is a moment for a prime polynomial of length equal to the
  family size (z = 1 in U-units). M1 needs r + 2z < 1 (z < 1/2 even with no witness factor), M2 needs
  n1 + n2 + 6 kappa z < 1 (z < 3/13), and the probe supplies prime length about 0.21. The coefficient class is not
  the mismatch (the theorem's class is inside both slots' classes).
- Slot Z11 (count at the critical class): closed by the **exponent**, for a structural reason. The theorem's
  exponent is not at level (normalised 1.08418 against 1), and it is derived from the count that the system
  already uses: kappa_6 = max over a of R(a) + 2a. Chebyshev on the moment therefore returns at best that count
  (Lemma C, an exact identity), and that count is the x = 0 column, which is at least the count in use at every
  class (Lemma X). At the critical class the option is 0.614839 against R_c = 0.590332; the moment would have to
  be below Q^2.059677 to enter, and it is Q^2.084184.

The manuscript was opened (text of the public PDF fetched in round 11, `../c11-frontier-nth-order-sieve/dl/2610.17675.txt`,
1496 lines; sections 1, 6, 7 read in full for this lane; proofs not checked). Every use is still relative to it and
to its own sources.

## 1. Plan

1. First lemma: hypotheses of Theorem 1.2 (and of its extension Proposition 7.2) next to what M1, M2 and the
   Z11 count supply, line by line (section 2).
2. Decisive test: put the exponent into the one place where a second moment can act (a count option at a class,
   by Chebyshev), in the most favourable reading, with exact arithmetic; recompute the abscissa (section 3).
3. Controls paragraph (section 4).

New relative to the record: c11 section 7 left the exponent (37 - 10 sqrt 6)/6 unplaced ("no ledger with a named
slot was identified"); round-11 combinable 3 named Z11 and M2. `r3-critical-count` Lemma W2 gives the window for
moments at level; this lane extends the test to a moment above level and adds the domination identity.

## 2. First lemma: hypotheses line by line

Sources: Xu-Sang 2610.17675 v2 lines 80-121 (statement), 1020-1125 (section 6), 1145-1262 (section 7); Liu
2610.26835 v2 ("Liu II") lines 4995-5050 ((13.2), (13.3) and their hypothesis list), 660-675 (Prop 2.6), 5870-5905
(use in the count); `r3-critical-count` section 1 and Lemma W2 (the Z11 row). All CITED.

Normalisation. Liu II's polynomials are centrally normalised (mean square 1 at level). (1.4) of Xu-Sang is
unnormalised: P_6(Q; V) << Q^kappa_6 with rows Nu ~ Q and primes N pi ~ Q. Dividing by the length Q, the
normalised statement is Sum_u |Q_1(u)|^2 << U^(kappa_6 - 1) = U^1.084184 for one prime sum Q_1 of length z = 1.
The level value (what M1 and M2 give inside their ranges) is U^1.

| item | Xu-Sang Theorem 1.2 (prime moment) / Prop 7.2 | slot M1, Liu II (13.2) | slot M2, Liu II (13.3) | what the Z11 count needs (Lemma W2) | match |
|---|---|---|---|---|---|
| rows | u primary, sixth-power-free (then squarefree), Q <= Nu < 2Q, prime to S; psi_u = (u/.)_6, original zero extension; Prop 7.2: sixth-power-free, Nu ~ Y | q_k << U, sixth-power-free comparison rows, one common finite-order presentation psi_k = nu chi(k)^(+-1) | same, principal inducing rows excluded (Theta for z > 0) | rows q_u ~ U of one presentation | yes for the plain presentation; fixed twists nu and the inverse orientation are in the family X_u of section 6 but the moment (1.4) is stated for (u/pi)_6 only |
| polynomial | one smooth prime sum; Prop 7.2: mu^2-restricted product of k <= k0 prime sums, each prime >= Y^c | M_r x Q (inverse witness times prime sums) | S_n1 x S_n2 x Q (two plain polynomials times prime sums) | product built from the saddle pair (r*, m*) = (0.7457, 0.4183) and primes | **no**: the theorem has no witness factor (r = 0, n1 = n2 = 0) |
| prime coefficients | fixed smooth profile V (Prop 7.2: independent smooth annular weights), coefficient 1 on every primary prime | arbitrary prime lists inside the annuli, bounded row-independent coefficients | full annuli, fixed smooth profiles, coefficients in a fixed finite Theta-span | the probe's original Q_i: full annuli, fixed coefficient | yes: the theorem's class is contained in both slots' classes |
| prime length z (U-units) | total length exactly 1 (Prop 7.2: product of the F_j ~ Y = row size); individual lengths >= c > 13/6 - kappa_6 = 0.0825 for the error term to stay below, so at most 12 factors | r + 2z < 1 and 2r + 8z < 3: z < 1/2 at r = 0; z < 0.1272 at r* | n1 + n2 + 6 kappa z < 1: z < 3/13 at n = 0; z < 0.0363 at m*; fixed mesh z_i <= eta | total prime length the row carries: supply l/d about 0.2105 | **no**: z = 1 is outside both hypothesis ranges and about 4.75 times the supply; the mesh condition z_i <= eta contradicts z_i >= 0.0825 |
| exponent | normalised 1.084184 (unnormalised kappa_6 = 2.084184) | 1 (level) | 1 (level) | at Y = 1: N < R_c + delta_c = 1.059677 (window (0.8729, 1.1125) for moments at level) | **no**: above the threshold by 0.024507 |
| height | fixed smooth V, finite-height rectangle H_1 = Q^tau inside the proof; no height parameter in the statement | finite seminorm and polynomial height orders | same | detected zeros at height <= Z^tau | compatible |
| premise | relative to the 30 Sep 2026 manuscript: Lemma 17.6 (unmarked inverse moment), Prop 8.3 (buffered detector), Lemma 18.1 zero-slot case (plain fourth moment); row count from Sang 2610.15291 v1; no zero-free premise on the target | MS Theorem 11.2 | MS Theorem 12.16; for z > 0 the premise beta_* <= (1 + kappa)/2 | - | the theorem needs no premise on the target; it consumes the same count the system uses (section 3.1) |

Result of the first lemma (PROVED-rel the cited statements): **M2 and M1 are closed by the range** (and by the
shape: no witness factor). The theorem does not extend either hypothesis range; it speaks at one point z = 1 where
neither slot speaks, with an exponent above level. There is no statement for 1/2 <= z < 1, and no interpolation in
the length of a prime sum is available (the moment is not a convex function of the length in any theorem cited).
For Z11 the shape fits only as a count option of Chebyshev type for a prime-only polynomial of length Y = 1; that
is the one place tested in section 3.

## 3. Decisive test (EXACT; `slot_test.py` -> `slot_test.log`, 14 checks, all pass; `recheck.py` -> `recheck.log`)

Run locally: `scripts/memcap.sh 8 .venv-arb/bin/python -u slot_test.py` (under 2 s, under 50 MB; exact arithmetic
in Q and Q(sqrt 6); mpmath 34 digits for printing).

### 3.1 Lemma C (the moment is dominated by its source count). PROVED, EXACT

Write delta = 2a - 1, N = kappa_6 - 1, R0(delta) = (15 - 16 delta)/(15 - 6 delta) (Xu-Sang's R(a) on its first
branch; equal to R_kappa(delta, x = 0) of the system for every kappa, c11 and check 3 here). Then for
0 < delta <= 5/6

  N - delta - R0(delta) = 6 (delta - delta*)^2 / (15 - 6 delta) >= 0,   delta* = (15 - 5 sqrt 6)/6 = 0.458759,

and for 5/6 <= delta <= 1 (R = 1 - delta): N - delta - (1 - delta) = kappa_6 - 2 = 0.084184 > 0.

*Proof.* (N - delta)(15 - 6 delta) - (15 - 16 delta) = 6 delta^2 - (6 kappa_6 - 7) delta + 15 (kappa_6 - 2), with
6 kappa_6 - 7 = 30 - 10 sqrt 6 and discriminant (30 - 10 sqrt 6)^2 - 360 (kappa_6 - 2) = 0. QED. (Verified as an
identity in Q(sqrt 6) at 1000 rational delta.)

Meaning: a row with a normalised prime-sum spike U^delta is, by Chebyshev on Theorem 1.2, one of at most
U^(N - delta) rows. The count of rows with a zero at a = (1 + delta)/2, from which the theorem was proved
(its section 7.2: bins of size Q^R(a) times Q^(2a) per row, maximised over a), is U^R0(delta) and is never larger.
Equality holds only at delta*, the maximising bin. This is the general fact that a moment obtained as a supremum
of (count) x (size)^2 returns, by Chebyshev, at most the count at the maximising bin and less elsewhere.

### 3.2 Lemma X (the x = 0 column is the largest). PROVED-rel the transcription of Liu II (13.16)

R_kappa(delta, x) <= R_kappa(delta, 0) = R0(delta) for 0 <= x <= 1/2, 13/18 <= kappa <= 1.
*Proof.* In the definition R = min over t of max over admissible (r, m) of min(M1(r), M2(m)) (`r3-critical-count`
section 1), M1 and M2 are nonincreasing in x and the admissible set does not depend on x. QED. Checked on the
closed form at 34680 exact rational classes (0 violations) and on the min-max-min definition by float grid
(`recheck.py`, 450 classes, 0 violations).

### 3.3 Forced substitution

Most favourable reading: every row of class (delta, x) is granted a prime-only polynomial of length Y = 1 with
(a) the spike 2 delta x that the class amplitude g = delta x would give at z = 1, or (b) the largest spike
U^delta that Lemma 7.1 of Xu-Sang allows for any row with rightmost zero at a. Neither spike is supplied by the
detector (no lower bound for a prime sum of length Q follows from a zero; the probe's prime factors have total
length 0.21). Option value: N - spike.

By Lemmas C and X: N - 2 delta x >= N - delta' with delta' = 2 delta x <= delta, so
N - 2 delta x >= R0(delta') >= R0(delta) >= R_kappa(delta, x); and N - delta >= R0(delta) >= R_kappa(delta, x).
**The option is selected at no class.** Exact check: 0 of 34680 classes (kappa in {13/18, 0.749773, 3/4, 1},
171 values of delta, 51 values of x), signs decided exactly in Q(sqrt 6).

| quantity | value |
|---|---|
| kappa_6 | 2.08418376202803650300452654216 |
| a*, delta* | 0.729379273840342459084464968873, 0.458758547680684918168929937745 |
| least margin, reading (a) | 0.0231347 (kappa = 1, delta = 0.5166, x = 1/2) |
| least margin, reading (b) | 2.19e-7 at x = 0, delta = 0.45809 (the tangency of Lemma C: exactly 0 at delta*, where the option equals the count it was derived from) |
| critical class (delta_c = 0.469345, x = 1/2, kappa_flat) | option 0.614839; R0 = 0.614784; R_c = 0.590332; excess 0.024507 |
| unnormalised exponent that would enter at the critical class | below 2.059677 (theorem: 2.084184) |

`recheck.py` (definition-based, float): R(delta_c, 1/2) = 0.59050 (file 0.590332; grid error 2e-4),
R(delta_c, 0) = 0.61514 against 0.614784; least margin -1.5e-4, which is the tangency of Lemma C inside the grid
error of that script (the exact margin there is 0 or positive by the identity).

### 3.4 The figure and its dependency list

The count vector is unchanged at every class, so the scalar comparison system and its value are unchanged:

  **B_flat = 0.874886647039964130944614000530**, the root in [5/6, 7/8] of
  133488 B^4 - 376596 B^3 + 384534 B^2 - 167541 B + 26231

(exact rational bisection, 120 steps; one sign change on a 2000-point rational grid; mpmath Newton agrees to 30
digits). Equal to the scoreboard figure 0.8748866470.

Dependency list of the figure (all unrefereed): openai/math 7/8 manuscript (30 Sep 2026); Liu 2610.12234; Liu
2610.26835 v2 (Lemma 14.10 as a scalar statement); Xu-Sang 2610.15291 (same system, 0.8748866496 at
kappa = 29991/40000). **Xu-Sang 2610.17675 v2 enters the dependency list of no figure.** Its Theorem 1.2 itself
rests on the September manuscript (Lemmas 17.6, 18.1 zero-slot, Prop 8.3) and on Sang 2610.15291 v1.

## 4. Controls (one paragraph)

The substituted object is a second moment over the row family of a fixed prime vector; it contains no target.
Replacing the target's prime data by a sign twist, by the thin deletion THIN, or by any other control of the list
(DH, backward heat, unimodular twist, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator,
theta^w) leaves the moment, Lemma C, Lemma X and the option table identical: the substitution is blind to every
target-side control, as STRATEGY 3.1 item 14 predicts for slot and moment refinements of the 7/8 method. One
qualification, which is a hypothesis of the theorem and not a control: the theorem is not an arbitrary-coefficient
bound. Its proof uses the logarithmic derivative of the row L-functions, so it holds for the coefficient 1 on
primes and fails to apply to a sign-twisted prime column (there the general norm Q^(13/6), sharp by its Theorem
1.1, is what is known). That structure sits on the row side and the lane cannot raise R3 with it.

## 5. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | Exponent bookkeeping; no argument about the target is made. |
| R2 (height-uniform, every window) | false | No conclusion about zeros. |
| R3 (every control fails at a named step) | false | Every target-side control passes the substitution unchanged (section 4). |
| R4 (reaches the critical line) | false | No answer; figure unchanged; model floors 13/15 and 5/6 untouched. |

## 6. Three weakest steps

1. **The slot set.** "Fits neither" is decided for M1, M2 and the Chebyshev count option of Z11, the slots named
   in the assignment and in Liu II's own list ("the only moment inputs of the count"). A use of a prime moment at
   length 1 elsewhere in the chain (the numerator average of row Z10, Liu II Prop 14.3; the preliminary stage) was
   not searched line by line. For Z10 the record's open item is a mollified second moment of a different shape
   (exponent below 1.1366 to 1.1452 for witness products of length about 1.16); a prime-only polynomial is not of
   that shape, but this was read from the map row, not re-derived.
2. **Lemma X and the formula for R_kappa(delta, x)** rest on the transcription of Liu II (13.16) in
   `bypass-78/scalar_system.py` and on the option formulas of `r3-critical-count`. Two protections: the x = 0
   column agrees identically with Xu-Sang's printed R(sigma), and the closed form reproduces R_c = 0.590332352.
   The definition-based recheck is a float grid with error about 2e-4.
3. **No interpolation and no combination was attempted beyond a remark.** The statement "nothing between z = 1/2
   and z = 1" is the absence of a cited theorem, not an impossibility. A product M_r x (prime sum of length
   1 - r) with a structured exponent, obtained by redoing section 7 of Xu-Sang with a witness factor, is not in
   the manuscript; by Lemma C's mechanism a moment built from the count by bins cannot return less than the count,
   so it would not be expected to change the option table, but that expectation is argued, not proved.

## 7. Record updates proposed (for the repair lane; not applied here)

- Map row Z11: add "Xu-Sang 2610.17675 v2 Theorem 1.2 (prime moment at length 1, normalised exponent 1.0842):
  option 0.6148 > R_c = 0.5903; needs below 1.0597; dominated by the x = 0 count by the identity
  N - delta - R0 = 6 (delta - delta*)^2/(15 - 6 delta)."
- Map row Z12 / M-slots: "z = 1 is outside M1 (z < 1/2) and M2 (z < 3/13) and above the probe's supply 0.21."
- STRATEGY section 1: frontier slot withdrawn from round 13 (two rounds, c11 and c12, without a changed figure).
- c11 section 7 last bullet: closed by this lane.

## Files

`RESULT.md`, `REFEREE.md`, `slot_test.py`, `slot_test.log`, `recheck.py`, `recheck.log`, `lanes_line.json`.
Manuscript text read from `../c11-frontier-nth-order-sieve/dl/2610.17675.txt` and `../bypass-78/dl/2610.26835.txt`
(public PDFs converted to text; untrusted; read as text only).
