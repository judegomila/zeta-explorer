# REFEREE (independent, adversarial, lens: general): c11-ff-row-energy-four-part

Written 2026-11-19 by a referee agent that did not take part in the lane. The author's own pass is kept unchanged
below the line "Author's own pass". Everything here was run locally through `scripts/memcap.sh 8` (pure python,
own code in `/tmp/ref_c11ff/indep.py` and `/tmp/ref_c11ff/s0def.py`; the lane's `fourpart.py`, `ffpy.py`,
`assemble6.py`, `vecs.py` were read, not imported). The compute server was not used.

## Outcome

**Holds, in the narrowed form.** No arithmetic error and no broken PROVED step was found. The statement is a
finite model computation in F_7[T]; it says nothing about zeta. Flags: R1 = R2 = R3 = R4 = false.

Surviving claim: at q = 7, N = 6, d = 2 the squarefree-n part D = |Pi Tf|^2 of the cube term, in units of the
completed diagonal, is 0.568794 / 0.603007 (lam = 9), 3.885e-5 / 2.951e-5 (lam = 10), 0 (lam = 11) and
2.79816 / 2.97975 (lam = 12) for targets a / b, so the registered constant 1.5 is exceeded at (6, 12, 2). The mean
of |Tf|^2 over cube coefficients with E c(n) conj c(n') = delta is q^2 sum_m nu(m) |S_0(m)|^2 with nu in
{31, 36, 41}. Random multiplicative signs and free signs give D of the same size as the targets. "Unbounded" is
not established: two resonant lengths at one (q, N, d), and at lam = 12 only the cube parts, not the row.

## What I re-derived or recomputed

| item | what I did | result |
|---|---|---|
| Identity of section 2 | Algebra by hand: v_0 and w' are orthogonal, so E_c = \|P_v0 R\|^2 + \|P_w' R\|^2 + \|Pi R\|^2, and Pi R = Pi X + Pi Tq + Pi Tf gives three squares and three cross terms. The identity is Pythagoras; "53 of 53" tests the code, not a mathematical statement. I also re-summed the stored exact fractions in `parts_lam9.json`, `parts_lam10.json` | 53 of 53 at each size; E_c = E_c_int / D_c in all |
| Lemma M | Proof re-derived. \|Jbar^2\|^2 = q^2; chi_n(m)^3 is the quadratic symbol of Res(n, m), real, zero iff (n, m) != 1; S_0 has trivial cofactor so it does not contain the vector; expectation of \|sum_n c(n) chi_n(m)^3\|^2 is the number of non-zero terms. nu(m) by hand: m irreducible 41, m = l^2 36, m = l l' 31; (21*41 + 7*36 + 21*31)/49 = 36. For multiplicative signs the pair correlations E c(n) c(n') (n != n' squarefree of degree 2) vanish: each product leaves at least one free sign | correct |
| D, \|Tf\|^2, C, E_2, D_c at lam = 9, 10, 11, 12, vectors a, b, one | Own code: quadratic symbol of the degree-2 resultant by closed formula, targets by the norm of F mod n, exact projection in Z[zeta_6] with Fractions; D_c from my own brute-force counts over the 7^6 and 7^3 monic cofactors (support counts 4301689 / 4314240 for N = 6; 76566 / 76860 for the j = 1 part; 1764 + 1806 for the j = 2 part) | every figure of the first-test table reproduced to the printed digits: D = 0.568794, 0.603007; 3.88519e-5, 2.95055e-5; 0; 2.79816, 2.97975. D_c equal to the lane's integers (22474889379376 at lam = 9, 5781664310378600 at lam = 12). E_2 = 1.3771, 1.2780; 6.9155, 6.4015 |
| Different case 1: lam = 6 (not in the table) | same code on `ref/q7_N0_lam6_d2.txt` | companion energy / diagonal 6.02507 (RESULT: 6.03); D(a) = 0.0958, D(b) = 0.1011; Lemma M mean 0.1039 |
| Different case 2: the stored companion row itself | S_0 at lam = 6 from the definition (sum over all 19544 monic irreducibles P of degree 6 of zeta_6^g(P) chi_P(m)), own resultant and irreducibility code | 49 rows identical to the stored file; prime count 19544. The stored companion rows at lam = 9..12 were not recomputed (pure python cost); their prime counts equal the necklace counts 4483696, 28245840, 179756976, 1153430600 (checked by formula) |
| Different case 3: fresh seeds | 200 multiplicative-sign and 200 free-sign vectors with my own generator at each lam | mean \|Tf\|^2 / D_c: 0.654, 0.664 at lam = 9 (lemma 0.645); 3.35, 3.39 at lam = 12 (lemma 3.289). D: median 0.593 / 0.622 at lam = 9, 2.98 / 3.10 at lam = 12 |
| Seed-class ranges, ranks, counts above 1.429, advance statements | re-read from `parts_lam*.json` | as stated (24 of 24 and 19 of 24 above 1.429 at lam = 9; 0 of 48 at lam = 10; ranks as printed; 11 of 12, P-mu fails) |
| Pre-registration | `shasum -a 256 PREREG.md` against `logs/prereg_hashes.txt` | equal (3482b4ad...); stamp 09:42:43 UTC, unit name 094245. Evidence is the lane's own files |

Not reproduced by me: the rows S_6 and S_3 at (6, 10, 2) and at (6, 9, 2) for the 48 seeded vectors (they come
from the Y tables on the server; one production run each). The completed energies 0.593, 0.581 and the seed ranges
0.51 to 1.02 rest on that single run plus the lane's validation against stored rows. They are labelled EXACT in
the sense "exact integers output by one kernel run"; they are not PROVED steps and the verdict does not depend on
them.

## Errors, gaps, overstatements

**F1 (wording, claim line). Lemma M is about |Tf|^2, not about D.** The campaign line reads "D's mean ... is the
companion energy times a count". What is proved is E |Tf|^2 = q^2 sum_m nu(m) |S_0(m)|^2 and D <= |Tf|^2. The mean
of D itself is smaller (my 200 seeds: mean D about 0.62 at lam = 9 against 0.645). Also "energy times a count" is
exact only up to the weights nu(m) in {31, 36, 41}. RESULT.md section 4 states both correctly; the one-line claim
does not.

**F2 (understated range). The 24-seed ranges of D for the sign class are too narrow.** With 200 fresh
multiplicative-sign seeds the maximum of D is 2.34 at lam = 9 and 14.2 at lam = 12 (free signs: 1.37 and 7.81),
against the reported maxima 0.98 and 5.21. The distribution has a heavy upper tail (vectors whose cube
coefficients are close to those of `one`, which has D = 3.58 and 22.1). Consequence: some sign vectors already
exceed 1.5 at lam = 9. This strengthens "not separated" and does not change the verdict, but "0.39 to 0.98" must
not be read as the range of the class.

**F3 (scope of Lemma M). "The size is set by the companion, which does not contain the vector" holds only up to a
vector-dependent factor that ranges over 36 to 1.** D/|S_0|^2 is governed by mean_m Vsf(m)^2, which is 6 for mu,
33.8 and 39.3 for the targets, 36 on average, 216.9 for `one`. So at lam = 12 the Liouville-twisted vector has
D = 0.624, below the threshold, while the targets fail it. The statistic therefore orders the vectors against the
direction a proof would need (a control passes where the targets fail). RESULT.md lists the numbers but does not
draw this conclusion.

**F4 (the companion row is nearly constant in m; not stated).** In every stored companion file S_0(m) takes two
values only: one on the 7 rows m = l^2 and one on the other 42 (share along v_0 0.9996 and 0.9979 at lam = 9, 12).
Hence Tf(m) is, to within 0.1 to 0.2 percent of its energy, a fixed complex number times Vsf(m), and D is that
number's squared modulus times |Pi Vsf|^2, a character-sum quantity of degree-2 data. The "decomposition of the
row energy" at resonant lam is in this part a statement about one prime sum (the sum of cubic Gauss-sum phases
over primes of degree lam, non-zero mean when 3 | lam) and a 49-point table. This is consistent with Lemma M and
makes the non-separation unsurprising; it should be said, because it shows D carries no information about the
N = 6 row.

**F5 ("unbounded").** Agreed with the author's E3. The growth law q^((lam - N)/3)/lam is labelled ARGUED; the
companion ratios are 6.23 (lam 6 to 9) and 5.10 (9 to 12) against the predicted 4.67 and 5.25, i.e. the first
ratio is off by a third. Nothing is proved about lam -> infinity. At lam = 12 the total e_c is unknown and D is
not a lower bound for it (cross term x_DG and the bulk are not computed). The established statement is only
"D > 1.5 at (6, 12, 2) for both targets".

**F6 (decision before registration).** Agreed with the author's E1: the outcome was fixed by stored data before
PREREG was hashed, and the registered size is off resonance, so P-D is vacuous there. The pre-registered run
tests P-E and the seed classes, nothing about the threshold.

**F7 (closing item 23).** "Closed against the device" is a rule outcome of the campaign applied to one q, one N,
one d. It is a bookkeeping decision on model evidence, not a theorem that the order-2 vertex device cannot work.

**F8 (minor).** (i) `lemmaM.py` docstring says nu = "42 for m irreducible, 36 or 40 otherwise"; the correct
values are 41, 36, 31 (the code and RESULT.md have them right). (ii) The quoted lemma means 0.6452 and 3.2886 use
the diagonal of the full-support vectors; with the targets' D_c they are 0.6471 and 3.2982. (iii) For `one` at
lam = 10, Tq = -Tf exactly on the complement (x_CD = -2 C), so E_2 = 0 there; the table's "7e-5" is for a and b
only. (iv) The class ru is a formal object (author's E4); for it "completed row" has no functional-equation
meaning.

## Controls (R3)

No mechanism specific to zeta, to an Euler product, or to the targets is claimed, so there is no step that a
control is supposed to break. I ran the two classes that are relevant to the claim with fresh seeds (F2) and the
Liouville and trivial vectors (F3): the targets are inside the sign classes in D; mu is below, `one` above. The
nine campaign controls (Davenport-Heilbronn, backward heat, sign-twisted primes, unimodular twist,
zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w) have no counterpart for this
finite model statistic and were not run. R3 is false.

## Other checks

- RH is not assumed. In the model the family RH is Weil's theorem and it is not used in any step here.
- No verified-height restatement; no statement about zeros of any kind.
- No known theorem is presented as new. Lemma M is a second-moment identity (orthogonality of independent
  coefficients); the resonance of the companion at 3 | lam is the known non-zero mean of cubic Gauss sums over
  primes in F_q[T] and is used as data, not claimed.

## Flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | D depends on the vector through 42 cube coefficients; non-multiplicative sign vectors give the same values |
| R2 | false | one q, degrees up to 18, no height parameter, no every-window statement |
| R3 | false | no control fails for a structural reason; a control (mu) passes where the targets fail |
| R4 | false | finite model computation; nothing passes to a critical line |

holds = true (narrowed claim above). Referee count for this lane: one independent pass (this one) plus the
author's pass.

---

# Author's own pass (unchanged)

# REFEREE: c11-ff-row-energy-four-part (author's own adversarial pass; NOT an independent referee)

Written 2026-11-19 by the lane itself after RESULT.md. No second agent read the work; `lanes.jsonl` therefore
carries `refereeHolds: null`. The pass re-derives what can be re-derived cheaply and lists where the note says
more than the numbers. All runs local through `scripts/memcap.sh 8`, except one 4-core server unit (brute force).

## Outcome

The claim holds in the narrowed form below. No arithmetic error was found. Flags: R1 = R2 = R3 = R4 = false.

Narrowed claim: in the F_q[T] model at q = 7, N = 6, d = 2, the squarefree-n part of the cube term, with the
principal and own-character directions removed, is 0.569 / 0.603 of the completed diagonal at lam = 9 and
2.798 / 2.980 at lam = 12 for the two targets (exact integers from stored rows), it vanishes off resonance
(lam = 10, 11), and its mean over unimodular cube coefficients is an explicit multiple of the companion energy.
"Not bounded by a constant" is an extrapolation from two resonant lengths; what is established is "exceeds the
registered constant 1.5 at (6, 12, 2)".

## What was re-derived or rerun

| item | what was done | result |
|---|---|---|
| Identity of section 2 | Algebra: A and B are squared components along two orthonormal directions; the complement component is Pi X + Pi Tq + Pi Tf, whose squared norm is three squares and three cross terms. `fourpart.py` asserts it with Fractions | exact for 106 of 106 vector-sizes |
| First lemma | `lemma1.py`: E_c, D_c, \|Tq\|^2, \|Tf\|^2 against `results6.json` | equal, 5 of 5 |
| Lemma M | Proof reread: needs only \|Jbar\|^2 = q, chi_n(m)^3 real, S_0 free of the vector, and E c(n) conj(c(n')) = delta. For the class cm the coefficients are not independent on composite n (c(l l') = c(l) c(l')), so the lemma gives its mean only if the pair correlations vanish; they do for distinct squarefree n of degree 2 (the products involve different primes or a different pair), so E c(n) c(n') = delta holds for cm as well. Numbers: exact mean 0.6452 / 3.2886; ru means 0.665 / 3.391 (0.8 and 0.6 standard errors away); cm 0.651 / 3.296 | consistent |
| Cube parts by a second code path | `check_indep12.py` (c10's `assemble6.completed`) at lam = 9, 12 | D_c and E_2 equal, 8 of 8 |
| Kernel against the definition | `check_brute.py` on the server: pure python double sum for ru1, ru2, cm3, a, mu | identical at (2, 3, 2), (3, 4, 1); (2, 3, 1) is vacuous (all rows 0) and so is mu at (2, 3, 2), (3, 4, 1) (rows 0) |
| Production rows S_6 at lam = 10 (no stored counterpart) | `check_sym.py`: translation invariance (one, mu), scaling by cube roots of unity (a, one, mu), negative controls (b, cm1, ru1) | pass (294 of 294; 98 of 98; controls fail as they must). These test the output table, not each term |
| Pre-registration order | `logs/prereg_hashes.txt` stamp 09:42:43 UTC; unit name `rh-c11ff-p10-1119094245`; hashes of PREREG.md and code recomputed | equal. The evidence is the lane's own file stamps |
| Advance statements | re-evaluated from `parts_lam10.json` | 11 of 12 hold; P-mu fails, as stated |

## Errors and overstatements

**E1. The decision was not made by the registered run.** The first test (stored rows, local) fixed the outcome
before PREREG was hashed, and PREREG says so. The run at (6, 10, 2) tests an off-resonance size; its content is
P-E (no excess without the companion) and the seed classes. A reader should not count "pre-registered run decided
the question"; the count is "stored exact data decided it; one registered off-resonance check passed".

**E2. "Not separated from multiplicative signs" in D is close to a tautology.** By Lemma M, D depends on the
vector through 42 signs; any vector with unimodular cube coefficients and small pair correlations gives the same
value up to fluctuation. The 24-seed ranks add nothing to the lemma for D. The informative part of the seed runs is
the total and the bulk at the two full sizes, where the result is mixed: at (6, 9, 2) target a is below all 24
sign seeds in e_c and below all 48 seeds in G. RESULT.md reports this; its sentence "the targets are at the low
end of the classes" is supported for e_c (ranks 0, 6, 4, 2 of 24) but four ranks from two vectors are weak evidence
and are not a separation result in either direction.

**E3. "Unbounded".** Two resonant lengths (three for the companion). The growth factor 4.9 per three steps is
consistent with q^((lam - N)/3)/lam and is not fitted. At (6, 12, 2) only C and D are exact; the total is not
computed, and D, being a part, does not bound the energy from below unless the cross term x_DG is controlled
(at lam = 9 it was -0.05). The verdict wording "closed against the device" is the registered consequence of the
assignment's rule, a campaign decision on model evidence.

**E4. The class ru is a formal object.** For a non-multiplicative vector the completed row is the formula applied
without the functional equation that motivates it; its diagonal uses the same grouping rule. Its role is as a
control for "does the part need multiplicativity", which it answers (no) for D and for the excess at resonance.

**E5. One prediction rule was wrong (P-mu) and one large value is unexplained (`one` at (6, 10, 2): 212).** Both
concern the squarefree row S_6 of vectors outside the question. They do not affect C or D (which do not use S_6),
but they show that the bulk G is not understood for those vectors; RESULT.md lists this as OPEN.

**E6. Inherited.** Completion formula verified by polynomiality only for conductors of degree <= 2 (c10 referee);
the object is the c10 transcription (alpha = 1, sharp degree classes, no smooth weights); one q.

**E7. Process.** Two units failed at start because an unquoted `$R:rh-push` was expanded by zsh and rsync wrote
into a local subdirectory of this lane (removed; nothing outside the lane directory was written). No unit was
stopped by hand; no PID was signalled. The local python has no numpy, so every step that reads a Y table ran on
the server through `rhrun`.

## Controls (R3)

No mechanism specific to zeta or to the targets is claimed, so there is nothing for a control to fail. The classes
that were run (multiplicative signs, unimodular, Liouville-twisted, aligned, trivial) behave as the bookkeeping
says. The R3 list of the campaign (Davenport-Heilbronn and the others) was not run, and RESULT.md says so.

## Flags

R1 false, R2 false, R3 false, R4 false. No statement about zeros. RH is not assumed (in the model the family RH is
Weil's theorem). No known theorem is presented as new; Lemma M is a two-line second-moment computation.
