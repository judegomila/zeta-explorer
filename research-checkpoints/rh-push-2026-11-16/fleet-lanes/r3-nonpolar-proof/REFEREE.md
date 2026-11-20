# REFEREE: r3-nonpolar-proof/RESULT.md

2026-11-16. Adversarial pass. Only this file was written. Claimed verdict: precise-obstruction (no eta > 0, theta = 7/8
unchanged). Referee scripts: `/tmp/ref-r3np/{split.py, ep.py}` (not kept in the repo).

**Outcome: holds = false as labelled; the verdict survives.** No eta > 0 is claimed and none follows. No false QED, no
RH assumption, no abscissa claimed. One step labelled PROVED (section 2.3) is not a consequence of the cited lemma as
written. Statement P' (section 4.2, SKETCH) gets no support from the one test the stored data allow. Every exponent
in sections 1-3 and 4.3 was re-derived and agrees.

## 1. Re-derivations (all in exact rationals, toy geometry D = Q^(7/5), Q = Z^(5/6))

| item | check | result |
|---|---|---|
| section 1 | Cauchy-Schwarz Q^(5/12) Q^(1/2); abs(P) = Q^(5/6 - 7/15) | 11/12; 11/30 = 0.3667. Agree. |
| 2.1 | Mellin in Q, split at Q0 = N(c)^(2+d); int_0^Q0 Q^(11/12-s-1) dQ; pole term P Q0^(5/6-w)/(w-5/6); tail Q0^(-A-s) | bound N(c)^((2+d)(11/12-s)) for s < 11/12, entire after removing the pole. Agrees. Needs only the upper bound of Theorem A (MS) and Theorem P uniform in c (it is, as stated). |
| 2.1 | meaning of "conductor exponent <= 2" | growth slope 2 log N(c) per unit of s. This equals the slope of a conductor-N(c)^2 functional equation only left of the strip; at s = 5/12 it gives N(c)^1, twice the convexity exponent. The label is loose, the bound is right. |
| 2.2 | convexity N(c)^(1/2); T << Q^(5/12 + 7/10 - 7d_s/5); below trivial iff d_s > 1/7; sum abs(beta) = D^(1/2) | 7/10 - 7d_s/5 + 7/10 + 5/12 - 11/12 = 9/10 - 7d_s/5; zero at d_s = 9/14. +7/10 and +1/5. Agree. |
| 2.3 | (QD)^(2/3) = Q^(8/5); sum abs(P)^2 = Q^(5/3) D^(1/3) = Q^(32/15) against Q^(67/30) | +3/10 and +1/5. Agree. |
| eta units | Z^(eta/96) = Q^(eta/80) | -16, -24; eta = 0.01 is eta_Q = 1.25e-4. Agree. |
| 2.4 | (QD)^(1/2)/Y' against target Q | Q^(6/5)/Y'. Matches `r2-tro6-type12-split` section 3.3. |
| Prop F | both forms | Correct, two lines. D^(1/2) Q^(5/12) = Q^(67/60) = Q^(11/12 + 1/5). |
| 4.1 | conductor N(n)N(delta), length X/N(delta e), N(n) <= X N(c)/(N(delta) Q) | ratio N(c) N(delta e)/Q. Agrees. Theorem P's own count (coprimality kept as Euler factors) gives N(c)^2/Q for every delta; the two agree on the worst pair. |
| 4.2 | pair (1, p), p not dividing n: chi_p(n) conj chi_p(n) = 1, period N(s'')N(p)^2 | a c = 1 sum of length Q/N(p)^2. Agrees. n = p n': length Q/N(p). Agrees. |
| 4.3 | X = D^2/Q = Q^(9/5); N(s~) <= Q^(2/5) = X^(2/9); progression length D = X^(7/9); target per progression D/Q^(2/5) = Q = D^(5/7) | saving 2/7 of the length. Agrees, provided rho~ is normalised to size 1 on average. With that normalisation the leading term has rms Q^(11/12 - 7/10 + 1/5) = Q^(5/12), consistent with (LB). |

Sources read: manuscript text (`~/lean-deps/qrh-verify/paper.txt`) Lemma 9.1 (line 3693), Lemma 15.1 (line 6131) and the
Cauchy-Schwarz step after (15.7); `r2-tro6-polar-theorem` RESULT + REFEREE (Theorem P confirmed there);
`r2-tro6-type12-split` sections 3.3, 3.4, 6.5; `r2-tro6-nonpolar-scale` section 4.1; `tro6-shifted-conv/REFEREE.md`
rows U1, U2 (-24, -16-48d: the same exponents).

## 2. Errors and gaps

### E1. Section 2.3 is labelled PROVED; Lemma 9.1 does not give it as written

Lemma 9.1 is stated for squarefree rows and squarefree columns: both sums carry "sf". In 2.3 the columns are all m
with N(m) <= Q, weighted by rho(m)W. rho is not supported on squarefree m, and its mass on m with a large squarefull
part is not small (rho(mp^4) is proportional to a Gauss sum times rho(m)). So
sum_c abs(T(c))^2 <= (Q + D + (QD)^(2/3)) norm(rho W)^2 is not a consequence of the cited lemma. Splitting
m = m1 m2 (m1 squarefree, m2 squarefull) and applying Cauchy-Schwarz over m2 loses a power of N(m2) on each stratum.
The sibling ledger row U1 carries the caveat "(squarefree part of A)"; this note dropped it.

Effect: "+3/10 with the sextic large sieve that exists" is the exponent for the squarefree part of the m-sum only. For
the full sum the available bound is the same or worse. The direction of the obstruction is unchanged.
Correct label: PROVED-rel Lemma 9.1 for squarefree m; for all m the deficit is at least +3/10.

### E2. "Exact exponents" in the headline

The three numbers are upper-bound exponents from named tools, in a toy geometry, and two of the three rows are
hypothetical: convexity and Lindelof assume the open functional equation (V), and the optimal sieve Q + D is not
known. Unconditional content: +7/10 from the trivial bound, and (E1) at least +3/10 on squarefree m. The statement
"deficit at least (D/Q)^(1/2) for every such input" is Proposition F and rests on the measured (LB).

### E3. Proposition F is a restatement of (LB)

Given (LB) the proof is two lines and correct. It covers only bounds that take absolute values or an l2 norm in c.
(LB) is measured on a sharp-cutoff stripped estimator at Q <= 30000 with a random level of 2 in the normalisation of
the sibling notes (z^2 = 1.7-1.9 against 2), not on R = T - P with a smooth W. The remark "(LB) is a theorem for
D >= Q^(2+eps)" has no proof in the note (diagonal with sixth-power pairs m m'^5, squarefree sieve in c, polar term);
it is plausible and unused.

### E4. Statement P' (section 4.2): no support from the data, and one internal mismatch

Test run here (`split.py`, the comparison of `r2-tro6-polar-theorem/finiteX_c.py` split by prime and composite c;
all rows; residual = rms(data - finite-cutoff polar form) per class; control = rms of the k = 5 twist):

| Q, j (null) | N(c) | prime: #, residual, k=5 | composite: #, residual, k=5 |
|---|---|---|---|
| 3199, 2 (1.01) | 2-30 | 7, 0.324, 0.367 | - |
| | 31-56 | 6, 0.242, 0.584 | 1, 0.286, 0.627 |
| | 57-100 | 10, 0.363, 0.631 | 4, 0.506, 0.646 |
| | 101-200 | 21, 0.492, 0.815 | 7, 0.536, 0.816 |
| | 201-400 | 33, 0.754, 0.891 | 19, 0.618, 0.816 |
| 1600, 2 (0.74) | 201-400 | 33, 0.566, 0.688 | 19, 0.481, 0.642 |
| 3199, 3 (0.87) | 201-400 | 33, 0.657, 0.787 | 19, 0.543, 0.718 |

P' predicts that for prime p with Q^(1/2) < N(p) < Q, outside the window N(p)^2 ~ Q, the residual stays at the floor
(0.24-0.32 here). For primes it grows to 0.75, and in the top band (N(p)^2/Q = 13 to 50) it is larger than for
composites in all three runs. The k = 5 control grows in the same way, so the growth may be estimator noise (cutoff
10^7, weight (1-x)^j not in C_c^infinity). The test does not refute P'. It shows no prime/composite difference and
gives P' no support. The note says P' is untested; the sentence "this agrees with the non-monotone profile measured
on prime moduli" should not be read as evidence.

Mismatch: under (V) the delta = 1 dual term for prime c has length N(p)^2/Q (non-empty exactly when N(p)^2 > Q),
while 4.2 identifies the same term with a primal c = 1 sum of length Q/N(p)^2 (empty exactly when N(p)^2 > Q). The
two are compatible only if the dual sum with the kernel w~ equals its polar term up to O(Q^(-A)), i.e. the level-one
functional equation applied to an empty sum. The note does not carry this out, and the relative size
"1 + O(N(p)^(-1))" in P' is not derived for Q^(1/2) < N(p) < Q. The term n = p n' is set to zero by
Kazhdan-Patterson relations cited in a setting that ignores bad primes; without the vanishing its trivial size is
N(p)^(-2/3) (Q/N(p))^(11/12), below abs(P)/N(p) only for N(p) > Q^(1/3) and never O(Q^(-A)).

Correct label for P': HEURISTIC (exponent bookkeeping), untested, not SKETCH of a proof.

### E5. Section 5 (MODEL)

`ep.py` reran `price_list.py`: B(0) = 0.8748865, B(0.01) = 0.8748284, gain 5.81e-5; B(1) = 0.8586290. Matches the
table. This is a float LP, not an exact-rational solve, on inputs from the unrefereed 7/8 manuscript and the three
unrefereed follow-ups, with the optimistic gates of `bypass-78`. No abscissa is claimed, so no rational re-solve was
needed. The row length D = Q^(7/5) = (1 + l)/M is the LP's own optimum (M = 0.833, l = 0.167), not read from the
manuscript (same caveat as the polar referee E1). In the manuscript the A-sum has length Y' with P_a = Y'^2/Q.

## 3. A way around the obstruction

Proposition F blocks only c-side bounds that drop the sign of beta_c. Two exits it does not cover:

1. Keep Cauchy-Schwarz in m (the efficient side) and stratify m by its squarefull part. rho has extra mass on
   m = m1 m2 with m2 squarefull, and on m2 a cube or a square the symbol chi_c(m2) is a quadratic or cubic character
   of c. On those strata the reflected energy sum_m abs(B_m)^2 is governed by the quadratic or cubic large sieve
   (Goldmakher-Louvel, Heath-Brown), which is stronger than Lemma 9.1. A gain needs (i) a proved lower bound for the
   share of norm(rho)^2 on such strata and (ii) Lemma 15.1 redone per stratum. Neither is in any sibling note. This is
   also where E1 bites, so it has to be done in any case.
2. The dual form of 4.3 has two free variables (s~ up to X^(2/9), n in a progression). The note sums s~ trivially.
   The saving 2/7 per progression is needed only in that case; with square-root cancellation in s~ the requirement
   per progression drops to 2/7 - 1/7 = 1/7 of the length. That is a bilinear form in (s~, c) with the kernel
   mu(c) rho~(c s~), not the Type I/II form closed in round 2 (there the kernel was split inside c). It depends on
   4.3, which is a sketch.

Neither is a proof of anything.

## 4. Controls

DH, sign twist, backward heat: no positive statement is made, so nothing to test. The remark that the route uses no
Euler product and so cannot succeed is consistent with Theorem D of the sibling notes.

## 5. Verdict

* Survives: no eta > 0; theta = 7/8 unchanged; 2.1 (PROVED-rel Theorem P); the exponents +7/10 (trivial bound,
  unconditional), +3/10 (Lemma 9.1, squarefree m only), +1/5 (hypothetical inputs); Proposition F relative to the
  measured (LB); the arithmetic 9/14, 2/9, 2/7; the MODEL price table.
* Does not survive as labelled: 2.3 "PROVED" for all m (E1); "exact exponents" (E2); P' as a sketch of a theorem (E4).
