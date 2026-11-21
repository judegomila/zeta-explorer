# REFEREE pass on the y-transfer-01758 verdict (2026-11-21)

Second, independent pass on the first reviewer's verdict for the candidate Lambda <= 0.1758354.
Files of this pass: `referee/` (termdefect.c, td_*.out, epsc0.py, ydini_p1000_referee.log).

## Outcome
The first verdict (partly-confirmed, minor-variation, arbitrariness 4, importance 2) stands.
I could not find a numerical or logical error in what is checkable in a session. Corrections are to the
literature section (incomplete) and to how much weight the y-transfer numbers carry.
The full certificate (5.3M-window lane, full y-Dini run, barrier, tail theorem, native-binding lemma)
remains un-replayed by either pass.

## What I ran (all under memcap 8 GB)
1. **Independent C implementation, different quantity** (`referee/termdefect.c`, no producer or first-reviewer
   code; double precision; 41-point y grid on [y0, sqrt(1-2 t0)]). For each n it evaluates the summand
   f_n(y) = (|B_n| + g(y)|A_n(y)|) n^{-sigma(y)} and accumulates the termwise defect
   D_N = sum_n (max_y f_n(y) - f_n(y0))_+ . Theorem C implies D_N <= B = 2.4958e-4 and that every
   non-monotone n lies in an excised box (log n >= 14.544).

   | N (mollifier) | L_N(y0) mine | logged L12 | D_N | non-monotone n | smallest (log n) |
   |---|---|---|---|---|---|
   | 690988 (P17-287) | 0.001872347261 | 0.001872347259 | 4.66e-12 | 32 | 6359445 (15.67) |
   | 760000 (P17-287) | 0.0287887589 | (not a logged minimum) | 6.69e-12 | 42 | 6983685 (15.76) |
   | 1300000 (P17-287) | 0.1638635353 | (not a logged minimum) | 1.31e-11 | 91 | 32140625 (17.29) |
   | 1300001 (Euler 2,3) | 0.01006638441 | 0.010066384413 | 0 | 0 | none |

   Aggregate mass: M_N(y) - M_N(y0) <= -0.074 at the first grid step (y0 + 0.016) in every window.
   Consequences: (a) the two binding lane minima are reproduced a third time by a third code base;
   (b) the proof note's claim that termwise monotonicity fails is true (non-monotone terms exist), and all of
   them sit above the certified "min excised L = 14.544"; (c) the realised defect is about 1e-11, i.e. the
   certified budget B is larger by a factor of about 2e7. B is interval slop, not a property of the problem.
   Caveat: a y grid gives a lower bound on sup_y; this is a consistency test of the conclusion, not of the certificate.
2. **Leading error term of Polymath15 Thm 1.3** recomputed with mpmath from the formula for e_{C,0}
   (`referee/epsc0.py`): 2.667958555e-7 at (x_690988, y0); 9.21023e-8 at (x_1300001, y0). Package values:
   e_C0 <= 2.66796645e-7 and eps_legD <= 9.21291e-8. Consistent. (First reviewer listed eps_cap as not replayed.)
3. **Rebuilt the y-Dini verifier** from the pinned source (sha 748aff57..., mollifier a05f16ef...) and ran the
   first 1000 of 20546 profiles on 4 threads (188 s wall): B_partial = 1.256243043e-05, min excised L 14.553.
   Earlier recorded partials: 1.256241384e-05 and 1.256241089e-05. Agreement to 6 significant figures;
   the difference depends on thread count. This is the same code path, so it shows reproducibility only.
4. **Assembly gate** without --rerun-tail: 22/22 PASS, 1.622504081e-3. Same code path as the first reviewer; it
   re-reads pinned logs and is not independent evidence.
5. Read the Lean statements (YTransferReduction: excision_budget, certificate_extends, floor_ge; DiniGate:
   summand_antitone). The first reviewer's description is accurate: abstract finite-sum and one-variable
   calculus lemmas; `hgate : forall t`; no numeric instantiation. I did not re-run Lean.
6. Read Theorems B/C and Lemmas B1-B4 line by line. I found no gap: the derivative bound (B3) follows from
   gamma = e^{g y} exactly and sigma' >= 1/2; B4 monotonicity in g is correct for both gate branches and for
   the sup-mass; the count of multiples of m_v is uniform in N. The argument needs every excision to span the
   full y-height; the verifier source says it does; I did not audit the 1400 lines.

## Was "partly-confirmed" deserved?
Yes, and not more. The first reviewer's replay_mass.py is a genuine independent implementation (I read it: no
producer code), not a re-run. What it and my runs confirm is: the three binding lane numbers, the direction and
size of the y-dependence, and the error-term size. What neither pass confirms: positivity at the other
~5.3M windows, the Arb y-Dini run in full, the barrier (inherited), the tail lemma at this row, and the
native-binding lemma (never tested against a direct evaluation of f_t). The statement that is supported is
therefore the conditional one in `precise_statement`, not "Lambda <= 0.1758354".

## Corrections to the first verdict
- **Literature was incomplete.** A public table (MathWorld, de Bruijn-Newman Constant) now lists six unreviewed 2026
  claims: Mosaic Intelligence <= 0.1875 (Zenodo, 3 Jul 2026), the parent 0.1787854 (20 Aug 2026), Gordon < 0.158
  (GitHub, 12 Sep 2026, partial Lean), Raymond <= 0.149395 (Zenodo), Raymond < 0.107965 and Hakimoglu-Brown
  <= 0.13963 (arXiv:2610.12803), the last two conditional on an unreviewed zero-free region Re s > 7/8.
  Also Planat arXiv:2609.37164 (0.17795, relative to the 0.1787854 certificate) and Planat-Raymond
  arXiv:2611.06245 (< 0.156821). The first reviewer missed Mosaic, Gordon, Hakimoglu-Brown, Raymond 2026b and 2609.37164.
  0.1758354 appears in none of them; it does appear in the project's public repository README, labelled unrefereed.
- **Polymath15 table.** Not re-read in full by either pass (ar5iv text truncates before Section 10). Platt-Trudgian
  state that the second row of that table gives 0.2 once RH is verified past 2.51e12. So at this height the
  published method gives 0.2 and the candidate's gain comes from the mollifier and lane design, as the verdict says.
- **Weight of the y-transfer numbers.** "B <= 2.4958e-4" and "gate 1.622504e-3" are stated to 4-7 digits but B
  over-counts the realised defect by ~1e7 and varies in the 6th digit with thread count. The meaningful margin is
  L12_min - eps_cap, about 1.872e-3, and it is set by the choice of X, t0, y0.
- "Reproduces to all printed digits": my C sum gives ...7261 against the logged ...7259 (2e-12, double rounding
  over 6.1e7 terms). Immaterial.

## Scores
- Arbitrariness 4 (unchanged). Towards 5: every quoted number (0.1758354, B, gate, eps_cap) is an output of
  tuned parameters and interval slop. Towards 3: the project's own LP study puts the ceiling of this mollifier
  family at this height near 0.1744, so the value is within about 0.0015 of a method ceiling; that ceiling is
  measured, depends on the support class, and other (unreviewed) methods claim lower values. 4 stays.
- Importance 2 (unchanged). An expert would not attach meaning to the number. If refereed it is a valid
  improvement on 0.2 at unchanged height, no consequence for RH, not a restatement of RH or of a classical
  equivalence, constrains nothing else. It is unpublished outside a repository README and sits above four other
  unreviewed 2026 claims.
- Novelty: minor-variation. Excision-budget device not found in three further searches; it is bookkeeping.

## One-line (corrected)
A computer-assisted, unrefereed candidate upper bound Lambda <= 0.1758354 for the de Bruijn-Newman constant from the
Polymath15 criterion at the Platt-Trudgian height with an optimised 287-term mollifier; it depends on inherited
unrefereed certificates and prose lemmas, and Lean checks only abstract reduction lemmas.
