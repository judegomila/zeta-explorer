# REFEREE: zero-traps (second pass, 2026-11-20)

Verdict on the first reviewer's verdict: **"confirmed" stands**, with three corrections (importance context, literature for the lemma,
what "independent" means here). Scores unchanged: arbitrariness 2, importance 1.

Object reviewed: public repo commit cd2c9d564 (branch paper/zero-traps; the local clone has no remote-tracking ref for the branch, the
commit object is present). Record sha256 a559f6d3... equals the copy the first reviewer used; driver sha256 85bce7b4... equals
`generatorSha256` in the record.

## What I ran (referee/ref.py, all through scripts/memcap.sh 8, at most 3 processes)

| check | route | result |
|---|---|---|
| geom | own exact-rational recomputation | 1517 discs, all winding 1, 517,522 pieces, min separation 0.0195005, low 13.7847, high 1999.9013, max r 0.6, min r 0.0390010. Paper's radius rule fails for exactly 2 discs: k=1 (documented) and k=1517 (0.3555 recorded vs 0.5067 by the rule). |
| hardy | own Hardy Z = Re(exp(i theta) zeta(1/2+it)), theta from Arb lgamma, 128 bits | certified opposite signs of Z at t_k - 1e-6 and t_k + 1e-6 for 1517/1517 recorded centres, and certified equal sign between consecutive discs. Gives 1517 on-line zeros by the intermediate value theorem without the trap lemma or any disc winding. |
| arblib | Arb's own routines | zeta_nzeros(2000) = 1517 exactly, (1999) = 1516, (2001) = 1519; zeta_zeros(1..1518) in 3.3 s, real parts exactly 1/2, radii <= 6e-36, each inside its recorded disc, max distance to recorded centre 1.4e-14; zero 1517 = 1999.54576, zero 1518 = 2000.43452. |
| integ_rect | Arb rigorous quadrature (acb.integral) of zeta'/zeta, zeta' from acb_series, 64 bits | [-1,2]x[1/2,100]: 29.000 +/- 1.3e-4 (N(100)=29). Full height [-1,2]x[1/2,2000]: **did not finish** in 420 s (stopped on the sigma=2 side). Not reproduced by this route. |
| integ_discs | same quadrature on circles | discs 1, 926, 927, 954: 1.000 +/- 1e-4 each; 4 further discs not reached in 240 s. |
| mpscan | mpmath siegelz, no Arb, step 0.02 on [10,2000] | 1517 sign changes, each within 0.01 of a recorded centre; theta(2000)/pi + 1 = 1516.99307. Not rigorous. 479 s. |

Code reading of the driver (winding, disc box, rectangle parametrisation, closure, integer isolation) and of both lemmas in the tex:
no error found. The proof of the theorem from C1-C3 is correct.

## Is "confirmed" deserved?

Yes, for the statement as the reviewer worded it (conditional on Arb). Caveats on the word "independent":

1. The reviewer's replay.py is separate code but calls the same `acb.zeta`. So do my hardy and quadrature checks. Every rigorous route
   available here, theirs and mine, shares one trust point: Arb's enclosure of zeta. The only checks outside Arb (mpmath nzeros/zetazero
   by the reviewer, my siegelz scan) are floating point and not rigorous. The reviewer said this; it should be read as "confirmed
   modulo Arb", not as an Arb-independent proof.
2. The re-run of the original driver is a replay of the same code path and counts only as reproducibility.
3. My hardy check is logically independent of the paper's argument (no trap lemma, no disc windings): sign changes give 1517 zeros on
   the line; with the rectangle count 1517 for the upper half (reviewer's variant, no pole, no conjugation) all zeros are on the line
   and simple. Same conclusion by the classical route.

## Point the first reviewer under-weighted

Within the paper's own trust base the theorem is a two-call consequence of documented library routines:
`arb(2000).zeta_nzeros()` returns exactly 1517 (N(T) with multiplicity) and `acb.zeta_zeros` returns rigorously isolated zeros with
real part exactly 1/2 (FLINT docs: "All results are rigorous enclosures"; "The zeros are isolated rigorously"). Runtime 3.3 s against
about 250 s for the certificate. The driver itself calls both routines to obtain the count and the centres. The reviewer listed this as
slip (6) "the proof does not depend on them", which is true of the logic, but it bears on value: anyone who trusts Arb enough to
accept the certificate already has the result from Arb's Turing-method code. What the certificate adds is a second route with a
smaller set of trusted routines (zeta on boxes, division, exp, arg; no Gram/Turing bound code) and a per-zero record for the viewer.
The draft does not mention that the library already provides the result; it should.

## Literature (my searches: 5 web queries, 2 page fetches; no MathSciNet)

- Statement: known. Special case of Platt-Trudgian 2021; classical at this height (Backlund, Hutchinson, Titchmarsh, Turing).
- Method: argument principle with interval arithmetic is established (Ying-Katz 1988; Johnson-Tucker 2009; Johansson 2018). Agree.
- Trap lemma: the reviewer wrote that they did not find it used. Correction: the same step (a disc symmetric under the reflection,
  containing exactly one zero counted with multiplicity, hence the zero is on the axis of symmetry and simple) is used in the
  de Bruijn-Newman literature, in the H_t coordinate where the critical line is the real axis. I read it directly in
  Freire, Gonzalez-Riquelme, Munoz, Poblete, Salinas, arXiv:2610.27343, proof of the "all but finitely many zeros are real and simple"
  theorem (disc "which contains exactly one zero counted with multiplicity", plus conjugation symmetry). From memory, not re-read
  today: the same device is in Ki-Kim-Lee (Adv. Math. 2009) and in the Polymath15 paper for large-x zeros of H_t. There the count comes
  from Rouche's theorem, not from interval arithmetic.
- Not found: a published verification of zeta zeros organised as one certified symmetric disc per zero plus one rectangle. Shallow
  search; absence is weak evidence. The draft disclaims priority for theorem and lemma, which is appropriate.

## Scores

- Arbitrariness 2 (agree). Tried to move it both ways. Toward 1: the mathematical content (N(2000)=1517, all simple, on the line) is
  parameter-free and survived radius, precision, enclosure, contour and method changes (now also Hardy Z sign changes). Toward 3: the
  headline number 3034 is an artefact of counting conjugates in a box whose sigma-range and height are presentation choices; height
  2000 is set by the viewer. 2 is fair.
- Importance 1 (agree; if anything the library point above lowers it further). Known for about 90 years at this height, nine orders
  below the verified height, obtainable in seconds from the same library, no constraint on RH, on the de Bruijn-Newman constant, or
  on any method. Not a restatement of RH or of an equivalence: it is a finite-height verification. An expert would shrug at the result
  and accept it as an expository note or software test.

## One-line statement

The reviewer's line is accurate. I add the conditionality on Arb and drop nothing else.

## Remaining slips in the draft (none affects the theorem)

1. Section 4.1 radius rule is wrong for k=1517 (confirmed; only k=1 and k=1517 deviate).
2. Geometry script does not test r_k <= 0.6 (true on the record).
3. Draft should state that Arb's own routines already give N(2000)=1517 and isolate the zeros, and that the driver uses them to
   propose centres.
4. Bibliography: add prior argument-principle and interval work, and a source for the symmetric-disc step in the H_t literature.
5. Listed claim wording "3034 zeros in a box below height 2000" should read "1517 zeros with 0 < Im s < 2000 (3034 with conjugates
   in [-1,2]x[-2000,2000])".
