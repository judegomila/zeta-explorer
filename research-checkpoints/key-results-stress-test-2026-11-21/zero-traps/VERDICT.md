# VERDICT: zero-traps

**Status:** interval-arithmetic certificate of a known fact. Confirmed on replay. Not Lean-checked. Not new mathematics.

**Statement supported.** Assuming Arb (python-flint 0.9.0) returns correct enclosures of zeta on complex boxes and the driver logic is
as read: zeta has exactly 3034 zeros, counted with multiplicity, in [-1,2] x [-2000,2000]; all are simple and have real part 1/2.
Equivalently N(2000) = 1517 and the first 1517 zeros are simple and on the critical line. The listed wording "3034 zeros in a box below
height 2000" counts both conjugates; the number of zeros with 0 < Im s < 2000 is 1517.

**Where.** Public repo branch `paper/zero-traps` (commit cd2c9d564): `observatory/paper/zero-traps.tex`,
`observatory/scripts/experiments/check-certificate-geometry.py`, `observatory/docs/ZERO-LINE-CERTIFICATE.md`; on main:
`observatory/scripts/experiments/zero-line-certificate.py`, `observatory/dist/experiments/zero-line-certificate.json`,
`observatory/dist/zero-traps.js`.

**Replay.**
- Geometry script: 8/8 checks pass; separation 0.0195005, lowest point 13.7847, highest 1999.9013.
- Original driver re-run in a private copy: 251.7 s, output discs and rectangle identical to the committed record; script hash matches the record.
- Independent verifier (own code, different arc enclosure, 192 bits): 1517/1517 discs winding 1 for zeta and for xi; rectangle winding 3033 (zeta), 3034 (xi).
- mpmath (no Arb): nzeros(2000)=1517; theta(2000)/pi+1=1516.993; sampled zero heights agree with centres to 1.4e-14.

**Stress.**
- Radii halved (64 bits) and radii set to 1e-9 (192 bits): all 1517 windings still 1.
- Rectangles: upper half only -> 1517; top at 1999 -> 1516; top at 2001 -> 1519; left edge at -3 -> one more (trivial zero at -2); strip [1/4,3/4] -> 1517.
- Davenport-Heilbronn control (same reflection symmetry, has off-line zeros): symmetric discs around the off-line pair at height 85.699 give winding 0 (r<=0.3) or 2 (r>=0.35), never 1; rectangle count 7 vs 5 in the strip [0.4,0.6]. The procedure does not certify the control.
- Arb box-enclosure sampling: 0 violations in 9000 points.
- No circularity, tuned constant, or off-by-one found.

**Slips (do not affect the theorem).**
1. Radius formula in sec. 4.1 is wrong for the last disc: recorded r_1517 = 0.3555 uses the gap to zero 1518 (outside the list); the stated formula gives 0.5067, which would put the disc above height 2000.
2. C3 lists r_k <= 0.6; the geometry script does not test it (true on the record).
3. No citation of earlier argument-principle/interval-arithmetic zero counting (Backlund; Ying-Katz 1988; Johnson-Tucker 2009).

**Literature.** Statement is a special case of Platt-Trudgian (2021) and of classical computations (Backlund, Hutchinson, Titchmarsh, Lehmer, Turing).
Rigorous argument-principle counting with interval arithmetic is established (Ying-Katz 1988 and later). The reflection-pair observation
behind the trap lemma is standard. A zeta verification organised as per-zero symmetric discs plus one rectangle was not found in a
six-query web search; the draft does not claim priority and a referee would treat it as an expository note.

**Scores.** Arbitrariness 2 (facts are choice-independent; height 2000, box [-1,2], radius rule and the doubled count 3034 are presentation choices).
Importance 1 (no consequence for RH, for the de Bruijn-Newman constant, or for ruling out methods; height is 9 orders below the verified one).

**One line.** An Arb interval-arithmetic computation certifies that the 1517 zeros of zeta with 0 < Im s < 2000 are simple and on the critical line, a fact known for decades.
