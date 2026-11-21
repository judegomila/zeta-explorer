# REFEREE pass: pt-floor (2026-11-21)

Target: first reviewer's verdict "confirmed-weaker-statement, known, arbitrariness 4, importance 2".
Outcome: verdict category upheld; importance lowered to 1; three corrections to the reviewer's text.

## What I ran (all through scripts/memcap.sh 8, .venv-arb python, float64)
Own code in ref/ (ref_frontier.py, ref_lemma_phase.py), written from the Polymath15 text, not from the
reviewer's script. Different code path: sparse sort-and-reduce Dirichlet convolution instead of a dense D*N array;
finer y grid (0.16..0.24); one more prime (11). Output: ref/ref_out.txt.

Sanity against printed Polymath15 constants (not used by the reviewer):
- (94): t=y=0.2, N0=69098: Re s* = 1.71433 (paper 1.7143); prod_{p<=5}(1+b_p/p^sigma) = 1.6340 (paper <= 1.635);
  prod(1-..) = 0.5351 (paper >= 0.534).
- (88): N=1.5e6, t=y=0.2: sum_{n>=2}|beta_n| + gamma*sum|alpha_n| = 0.9487 (paper O<=(0.955)).
  This confirms the reviewer's reading that 0.955 is the N>=N1 triangle mass for the 0.22 theorem, not e_C.

Fixed-height frontier, N0 = 690988 (zeta-height 3e12), min of t + y^2/2 with corner lower bound >= target:

| tool            | mine .03 / 0     | reviewer .03 / 0 |
| plain triangle  | 0.2332 / 0.2309  | 0.2335 / 0.2312  |
| Euler 2         | 0.1974 / 0.1957  | 0.1974 / 0.1957  |
| Euler 2,3,5     | 0.1830 / 0.1814  | 0.1831 / 0.1815  |
| Euler 2,3,5,7   | 0.1812 / 0.1796  | 0.1813 / 0.1797  |
| Euler 2..11     | 0.1804 / 0.1788  | (not run)        |
N0 = 630783, Euler 2: 0.1990 / 0.1972 (reviewer 0.1990 / 0.1973).
Differences <= 3e-4, all from my finer y grid (optimum y = 0.19, not 0.20). The reviewer's numbers reproduce.
Gain per added prime is shrinking (0.0144, 0.0018, 0.0008): the Euler-product family saturates near 0.18 at this
height; the project's own module barrier-mollifier-length-ceiling-2026-09.js puts the limit for any mollifier in
this modulus-only class near 0.155 at X = 6e12 (not re-run by me).

Corner check at P={2,3,5}, t=0.1631, y=0.2: bound 0.031 at N0, 0.037 at 1.02 N0, 0.057 at 1.1 N0, 0.28 at 3 N0;
in y: 0.031 at 0.2, 0.23 at 0.278, 0.61 at 0.821 (= sqrt(1-2t)). Monotone on 8+9 sample points; corner binds.

Lemma 10.1 vs Table 1 column (rows 1-8):
- rigorous common-beta_2 mollifier:      0.0257 0.0284 0.0264 0.0284 0.0279 0.0406 0.0262 0.0230
- reviewer's quoted "v2":                 0.0357 0.0378 0.0356 0.0371 0.0363 0.0484 0.0335 0.0301
- separate mollifiers, common phase min:  0.0414 0.0442 0.0415 0.0429 0.0417 0.0534 0.0384 0.0347
- Table 1:                                0.0341 0.0376 0.0349 0.0377 0.0369 0.0532 0.0350 0.0307
- reviewer's "v1" (independent worst-case denominators): -0.20 .. -0.16 at every row.

## Faults in the first verdict
1. "Lemma 10.1 lower bounds reproduced within about 5%" overstates. The reviewer computed three variants and
   quoted the one closest to the table (v2). v2 divides an alpha_2-mollified A-sum by the B denominator, which is
   not a bound as derived. The rigorous common-mollifier reading gives 0.026-0.028 (below the 0.03 target at
   7 of 8 rows); the literal separate-mollifier reading with phase-correlated denominators gives 0.038-0.053.
   The table lies between. Correct wording: N0 reproduced exactly; the lower-bound column reproduced only to
   within +-25% depending on reading; exact Polymath15 bookkeeping not recovered. The effect on Lambda is small
   (0.03 -> 0 in the target moves Lambda by 0.0016), so the conclusion is unaffected.
2. The verdict treats "0.20 at X = 5e12" as a proved Polymath15 fact. Section 10 says the parameters were
   selected from the N = N0 lower bound and that the authors "expect to be able to verify" the asymptotic
   hypothesis on [N0, N1]; the barrier runs were done. Platt-Trudgian (arXiv:2004.09765) take row 2 as given
   ("provided one has shown H > 2.51e12"). The published 0.2 therefore already rests on the corner heuristic that
   the reviewer replays. This strengthens, not weakens, the reviewer's point that the corner test is the binding
   object, but the precise statement should say so.
3. "Stronger mollifier at the same height" is presented as the reviewer's finding. Polymath15 section 8.5 uses the
   Euler-5 (primes 2,3,5) mollifier for the 0.22 theorem and calls Lemma 10.1 a "simplified Euler 2 version".
   The fixed-height lever is in the source paper; Table 1 simply did not use it.
4. The one-line says a stronger mollifier "does" change the bound. Established: only that the float64 main-term
   corner test passes at lower t0 (0.183 with Euler-5, 0.181 with Euler-7). Not done: error terms, the range
   N0 < N <= N1 beyond 8 sample points, the barrier run at the new (t0, y0). Wording must be "in a main-term
   calculation".
5. Not a fault but missing: the module's refuted list includes Fejer-Riesz/Toeplitz min-modulus and SOS
   certificates. Whether they are "barrier tightening" (compact check, cannot move t0) or lower-bound tools for
   the asymptotic region (can move t0) depends on where they are applied. The module's classification is by name,
   not by hypothesis.

## Not faulted
- Error list items 1-4 and 6 of the reviewer: checked against the module text and Polymath15; correct.
  (0.955 = eq. 88; "10x gap" mixes x and height, 3.3x in height; x <= 66 table irrelevant to X ~ 5e12 with 2 of 5
  cells failing; three decompositions not independent.)
- "Known": Polymath15 section 10 states Lambda = O(1/log T) and the heuristic reason; Platt-Trudgian apply row 2.

## Independence
Frontier and corner numbers: independent implementation, agree to 3e-4. The sister-repo corridor table and the
1.23 margin: not re-run by either reviewer. Project ceiling 0.155 and candidate 0.1758354: read, not re-run.

## Literature (own searches: 2 web searches, MathWorld page fetch, Polymath15 full text sections 1, 8.5, 10)
- Polymath15 arXiv:1904.12438: Thm 1.2, sec. 8.5 (Euler-5), sec. 10 (O(1/log T), Table 1, Lemma 10.1, "arbitrarily
  chose a target lower bound of 0.03").
- Platt-Trudgian arXiv:2004.09765, Bull. LMS 53 (2021): row 2 of Table 1 with H > 2.51e12.
- MathWorld de Bruijn-Newman page: unreviewed 2026 entries 0.1875, 0.1787854, <0.158, 0.149395, <0.107965, plus a
  conditional 0.13963. arXiv:2611.06245 claims <0.156821; arXiv:2610.18214, 2609.37164 related. None refereed.
  All operate at or near the published verified height, i.e. on the tool side.
Result: the weak statement is known; nothing in the item is absent from Polymath15.

## Scores
- verification: confirmed-weaker-statement (unchanged).
- novelty: known (unchanged).
- arbitrariness 4 (unchanged). Could be argued 5: "0.2 at 3e12" is a table row built on a simplified lemma and a
  target the authors call arbitrary. Could be argued 3: the qualitative O(1/log T) dependence on height is
  canonical. The item as worded is about the specific pairing, so 4.
- importance 1 (was 2). The true part is a remark printed in the source paper; the part that goes beyond it
  ("only lever is height") fails in a ten-second calculation and against the source paper's own section 8.5.
  No consequence outside the project; inside the project its strong form was later contradicted by the
  project's own work.
