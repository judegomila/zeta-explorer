# REFEREE: c11-repair-del-referee-record (independent adversarial referee; lens: general)

Date 2026-11-19. Written by an agent that is not the author of this lane, not the author of the DEL lane and not
its first referee. Target: `RESULT.md` and `REFEREE2.md` of this directory, read as text; the DEL lane's
construction (`c10-thin-deletion-zero-mode-control/RESULT.md` section 1) read for the definitions. One local
numeric run through `scripts/memcap.sh 8` (own code, new case b = 0.7, X = 5e6, about 10 s, under 100 MB; script
kept outside the repo, output quoted in section 2). The server was not used. No web page was opened: statements
about the literature below are RECALLED unless marked otherwise. The author's own check that previously occupied
this file is kept verbatim in the appendix.

## Verdict

**holds = true**, with one wording error (E1) and four label remarks (E2 to E5). No PROVED or CONFIRMED step
failed. The lane makes no statement about zeros of zeta, assumes no RH, restates no verified height, and does not
present the construction as new (C6 of `REFEREE2.md` says it is standard). Flags: R1 = R2 = R3 = R4 = false.

Surviving claim: DEL_b (primes deleted by the greedy rule with counting function L(x) = int_2^x t^(b-1) dt/log t)
has Lambda_F >= 0, F = zeta(s)(s - b)W(s) on Re s > max(b - eta, b/2) with W zero-free, hence a simple real zero
at b, for every b in (1/2, 1), **relative to a short-interval prime theorem** (Huxley 1972 asymptotic for
theta > 7/12, or any Hoheisel-type theorem; primary text not opened by anyone in the chain). At half density
the factor is (s - b)^(1/2) (branch point). The bookkeeping (Statement O version 3 as a separate file, map
180 -> 182 rows, engine and scoreboard counts) matches the files.

## 1. Re-derivation of the steps marked CONFIRMED

All re-derived by hand from the definitions, without using the text of `REFEREE2.md` as input.

- **Greedy rule.** floor L(p_n) is non-decreasing, c_{n-1} <= floor L(p_{n-1}), so the increments are 0 or 1 and
  c_n = min(n, min_{k<=n}(floor L(p_k) + n - k)). Also checked by machine: closed form equals the recursion at
  all 348,513 primes below 5e6 (section 2). L(2) = 0, so 2 is not in S. Holds.
- **Lemma 0, upper bound.** pi_S(x) = c_n <= L(p_n) <= L(x) on [p_n, p_{n+1}). Holds, unconditional.
- **Lemma 0, lower bound.** D(y) >= -1 - B(p_k, y) at the minimising k; B additive; (a) L(y) - L(x) <=
  (y - x) x^(b-1)/log x because t^(b-1)/log t decreases on t > 1; long case B <= 0 once x^(b-1) <= c'; short case
  B <= x^(theta'+b-1); dyadic pieces [z, 2z] have h = z (allowed, h <= x) and the last piece is one of the two
  cases. Holds relative to H(theta'). The dyadic split is needed (H is only stated for h <= x).
- **H(theta') from S(theta).** Tiles (y_j, y_j + y_j^theta] with y_j <= 2x; uncovered length < (2x)^theta <= h/2;
  count >= c h/(2 log 2x). Holds.
- **Lemma 1.** int_2^inf x^(b-1-s) dx/log x = E_1((s - b) log 2) (u = log x). Boundary terms of the D-integral
  vanish. T converges absolutely on Re s > b/2 because pi_S(x) <= L(x) = O(x^b/log x). E_1(w) = -gamma - log w +
  Ein(w), so exp(-E_1(w)) = e^gamma w exp(-Ein(w)). G = (s - b) W, W an exponential. zeta(b) < 0 on (0, 1)
  (eta(b) > 0, 1 - 2^(1-b) < 0). Simple zero at b; simple pole at 1 with residue G(1) > 0. 1/F = prod over p not
  in S of (1 - p^-s) has a pole at b. Holds relative to Lemma 0.
- **Landau.** log F has non-negative coefficients; first real singularity at 1. No conflict with a zero at b < 1.
- **Tail bounds.** sum_{p in S, p > X} p^-u = m E_1((u - b) log X) - D(X) X^-u + u int_X^inf D x^(-u-1) dx; the
  last term is <= 0. 0 >= log(1 - t) + t >= -t^2/(2(1 - t)). Holds from D <= 0 only.
- **Tier E.** The convex combination: with a = x^(b-1), (1 - a)(aM) + a(aM - M + 2e) = 2ea. Exact. Near case
  constant 2^(2-b). Far case M >= y/(2 log y). J_1 = ((log X + 2)/sqrt X - (log Y + 2)/sqrt Y)/(4 pi) (antiderivative
  of y^(-3/2) log y checked). J_2 = 0.2795 * 2 * 6.455^(1/4) * Gamma(1/2, v_0), v = sqrt(u/6.455) (substitution
  checked). The form 0.2795 x (log x)^(-3/4) exp(-sqrt(log x/6.455)), x >= 229, is Trudgian 2016 Theorem 2 as I
  recall it (RECALLED; so the lane's "not confirmed" is a statement about sourcing, not about a misquote).
  Junction 1.4e25 agrees with 4.92 sqrt(x/log x) <= 2.445e12 (computed here: x about 1.42e25).
- **C4 (classical-PNT fallback), labelled ARGUED by the lane.** Checked: with h_0 = x exp(-c sqrt(log x)) the
  short case gives abs(D) <= C x^b exp(-c' sqrt(log x)); int exp(-c' sqrt u) du converges, so A is continuous on
  Re s >= b and G(s)/(s - b) -> W(b) != 0. The four lines are a complete argument; ARGUED is a cautious label.
- **Residue remark (RESULT section 2, line 5).** For real s > 1 each factor abs((1 - p^-s)/(1 - a(p) p^-s)) <= 1
  when abs(a(p)) <= 1, with strict inequality at s = 1 unless a(p) = 1; so residue 1 forces a = 1. Holds.

## 2. Numeric check with a different case (MEASURED, float64; not a certificate)

b = 0.7, X = 5e6, own code (numpy sieve, `scipy.special.expi`, floors within 1e-7 of an integer would be
re-decided with mpmath at 40 digits; none occurred).

| quantity | density 1 | density 1/2 |
|---|---|---|
| size of S against L(X) | 5,064 against 5,064.06 | 2,532 against 2,532.03 |
| first elements | 5, 7, 11, 17, 23, 29 | 7, 17, 29, 53, 83, 127 |
| max D, inf D on [2, 5e6] | 0, -1.835 | 0, -1.264 |
| exponent of G_X(b) against log X, 1e6 to 5e6 | 0.99995 | 0.49988 |
| local exponent in s - b at 0.0125 | 0.9940 (rising: 0.907, 0.964, 0.986, 0.994) | 0.4935 |
| G(s)/(s - b) at 0.1, 0.05, 0.025, 0.0125 | 1.707, 1.751, 1.768, 1.776 (converging) | 4.52, 6.53, 9.33, 13.25 (ratio about sqrt 2 per halving) |
| G(1) (truncated product, upper end) | 0.44648 | 0.71215 |
| G(2) | 0.924948 | 0.974385 |

Agrees with the lane's cases b = 0.6 and 0.85: G(1) at b = 0.7 lies between 0.5275 and 0.28; the object is not
zero and not zeta; exponent 1 at density one, 1/2 at half density with G/(s - b) growing like (s - b)^(-1/2).
G_X(b) log X is 1.00139, 1.00047, 1.00043, 1.00044 at 1e4, 1e5, 1e6, 5e6 (stabilises).

Controls: the lane claims no zeta-only mechanism, so there is no device to run against DH, backward heat or the
sign twist. The controls on the control were checked: S empty gives zeta (trivial); half density gives exponent
1/2 (table); every finite truncation is positive at b (each factor 1 - p^-b > 0).

## 3. Errors and remarks

- **E1 (wording error in `REFEREE2.md`, "Orientation remark"; repairable; does not change the result).** The
  remark says S(theta) in the lane's form "follows with any theta_1 in (7/12, theta)" by placing
  (x - x^theta_1, x] inside (y, y + y^theta]. That gives pi(y + y^theta) - pi(y) >= c y^theta_1/log y, a count of
  order y^theta_1 in an interval of length y^theta. This is not S(theta) as stated (count c y^theta/log y), and it
  is not S(theta_1) either. Two repairs, either suffices: (i) take x = y + y^theta and the same exponent theta:
  (x - x^theta, x] contains (y, x] and exceeds it by a piece of length x^theta - y^theta = O(y^(2 theta - 1)),
  which holds at most O(y^(2 theta - 1)) primes = o(y^theta/log y); so the ending-at-x asymptotic gives S(theta)
  with any c < 1. (ii) Keep the weak count and use the lane's own remark that Lemma 0 needs only a proportion
  x^(b-1): the tiling then gives proportion about x^(theta_1 - theta), sufficient when theta - theta_1 < 1 - b.
  The sentence "with a slightly smaller exponent" in RESULT section 1 (C2) should be replaced by (i).
- **E2 (label).** "Two referee files on the closing step" for line 5 of Statement O version 3 counts the first
  referee, who wrote the dyadic repair, and this lane, which then raised the label. The lane states this (weakest
  step 2, R-1). With the present file the re-derivation of Lemma 0, Lemma 1 and the tail bounds has a reader who
  did not write any of them; E1 is the only correction. The label "PROVED relative to Huxley 1972" may stand.
- **E3 (sourcing).** The whole chain still has no reader of a primary text for the short-interval theorem. I did
  not open one either. RECALLED: Huxley 1972 (Invent. Math. 15) gives pi(x + h) - pi(x) ~ h/log x for
  x^theta <= h <= x, theta > 7/12; Hoheisel 1930 gives the same with theta = 1 - 1/33000. Both are standard
  textbook statements; the "relative to" label is the correct one and must stay.
- **E4 (engine state).** Three device types are left "open" while their lanes report stage-A stops, so 36 of the
  top 60 candidates sit on devices expected to close. Disclosed (R-5) and as assigned; it is a staleness of the
  ranking, not an error of this lane. The learn step should close them before the next allocation reads the top 60.
- **E5 (unreplayed rows).** Map rows P52, Z33 and the Z30 addition are transcriptions of lane and referee text;
  nothing was replayed, and I did not replay them. The row DEL quotes a device count 14 / 20 that a sibling lane
  changed to 11 / 23. Disclosed (weakest step 3). These rows carry the status of their own referees, not of
  this lane.

## 4. Bookkeeping checked against the files

| claim | check | result |
|---|---|---|
| c9 Statement O unchanged | `cmp` of `before/STATEMENT_O.c9-2026-11-18.md` with `c9-obstruction-record-statement/STATEMENT_O.md` | identical |
| map 551 -> 561 lines, 180 -> 182 rows, 10 hunks | line counts, row-id count by pattern, `diff` hunks | 551 / 561, 180 / 182, 10 |
| engine 1,643 -> 1,649 nodes, 8,864 -> 8,900 edges | `engine_counts_before.json`, `engine_counts_after.json` | as claimed |
| 44,860 generated, 14,980 scored | `engine_rerun.log` lines 8 and 13 | as claimed |
| Statement O version 3 count 4 + 1 + 1 + 6 = 12 | header of `STATEMENT_O_v3.md` | as claimed |
| lane line has score 0, aboutZeros false, empty node list | `lanes_line.json` | as claimed |

Not checked: the content of Statement O version 3 beyond lines 1, 3, 5 headers and labels; the scoreboard
rerun (FRONTIER text); the texts of rows P52, Z33, Z30.

## 5. Checks required of every referee

- RH assumed anywhere: no. zeta(b) != 0 on (0, 1) is classical and unconditional.
- Verified height restated as a result: no. The height 2.445e12 / 3e12 enters only the width of one numerical
  enclosure (Tier E), which is labelled relative to the explicit bounds.
- Known theorem presented as new: no. The construction is called standard (C6).
- Statement about zeros of zeta: none. The zero at b is a zero of F = zeta G produced by G.

## 6. Flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta; a control and record work |
| R2 | false | no conclusion in windows or uniform in height |
| R3 | false | no device; nothing that is claimed to fail for controls |
| R4 | false | no step toward the critical line |

holds = true. aboutZeros = false.

---

## Appendix. Previous content of this file (author's own check, verbatim; not an independent referee)

### (author) REFEREE: c11-repair-del-referee-record (author's own check; not an independent referee)

Date 2026-11-19. Written by the lane's own agent after the work, as an adversarial re-read. It does not count as
a referee file under the two-file rule of Statement O and should be replaced by an independent pass. The file
`REFEREE2.md` in this directory is a different thing: it is this lane's referee report on the lane
`c10-thin-deletion-zero-mode-control`.

#### What was re-checked, and how

| item | check | result |
|---|---|---|
| Decisive statement (DEL has Lambda >= 0 and a simple real zero at b) | Lemma 0, Lemma 1 and the tail bounds re-derived in `REFEREE2.md` section 1; Landau consistency | holds relative to a short-interval theorem (Huxley 1972), primary text not opened |
| Numbers quoted in `REFEREE2.md` and `RESULT.md` | read back from `ref2_del.json` after writing | agree (sizes 2,690 / 1,345 / 121,731 / 60,865; exponents; G(1), G(2); J_2 = 0.0227218 in closed form and by quadrature; ratios 72.6 and 164.6 for the alternative bound) |
| Lane value J_1 = 4.559e-4 at X = 1e7 | by hand: (log 1e7 + 2)/sqrt(1e7)/(4 pi) | 4.559e-4 |
| Map edits | diff against `before/OBSTRUCTION_MAP.md`: 10 hunks; 182 row ids, none duplicated; cell counts of the new rows (DEL 5 cells, P52 and Z33 6 cells) | as intended |
| Statement O version 3 | c9 file byte-identical to the copy; previous line 1 and line 5 blocks found verbatim in the appendix; "not a joint clause" sentence present | as intended |
| Engine | counts read from `IDEA_GRAPH.json` and `CANDIDATES.json` before and after (`engine_counts_*.json`); all four scripts exit 0 | 1,643 -> 1,649 nodes; 8,864 -> 8,900 edges; 36,569 -> 44,860 generated; 8,438 -> 14,980 scored |
| Scoreboard | diff of `SCOREBOARD.md` against the previous file | part C and the lane counts changed; `scoreboard.py` not edited |
| Processes | none started except the short local runs through `scripts/memcap.sh 8`; none signalled | no action on the `euler` waiters |

#### Reservations

- R-1. The second referee pass and the relabelling of Statement O line 5 were done by the same agent. The label
  "PROVED relative to Huxley 1972" should be read as provisional until another reader has seen `REFEREE2.md`.
- R-2. The numeric run is float64 with mpmath re-decision of floors near integers; it is a check, not a
  certificate. The lane's own ball-arithmetic runs (b = 0.75, 0.9) were not rerun here.
- R-3. C4 of `REFEREE2.md` (one-sided statement from the classical prime number theorem) is argued in four lines
  and not written out as a proof.
- R-4. Rows P52, Z33 and the Z30 addition were composed from the lanes' proposed texts and their referee files;
  no computation of those lanes was rerun. Sentences that the referees marked as recalled or argued carry those
  words in the rows.
- R-5. The device states were left "open" as assigned although the three explore lanes had reported a stop at
  stage A by the time of the last engine rerun; the top-60 list therefore contains 36 candidates on devices that
  are expected to close.
- R-6. Trudgian 2016 Theorem 2 and the Platt-Trudgian height were not confirmed; only the width of one numerical
  enclosure in the DEL lane depends on them.
- R-7. Part C of the scoreboard moved mainly because of tags that entered the graph before this lane (267 -> 287);
  the family counts are not comparable with the round-10 line of the history table without that note.

#### Flags (author's setting)

R1 = false, R2 = false, R3 = false, R4 = false. aboutZeros = false. No claim beyond the record.
