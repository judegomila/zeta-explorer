# lee-yang: independent referee pass on the first reviewer's verdict (2026-11-20)

Claim as listed: "Finite Lee-Yang stage theorem, and the Lean formalisation of the Lee-Yang circle theorem (8 statements, 44 theorems, about 2576 lines)."

First verdict: confirmed-weaker-statement / formalisation-or-certificate-of-known-fact / arbitrariness 3 / importance 2 / Lean-checked.

Referee verdict: the same labels and scores. No mathematical error found in the first verdict. Four additions and two wording corrections, listed in section 4. Files of this pass: `referee/` (RefJoin.lean, RefJoin.compile.log, ref_check.py, ref_check.log, ref_check.json).

## 1. What was re-run, and how independent it is

### 1.1 Lean (same kernel, own file)
- Read the statements of `01-leeyang-circle/LeeYangCircleProved.lean` and `02-stage-selfdual/StageSelfdualProved.lean` in the public clone (after `git fetch`; files identical on origin/main). Definitions: `stageZ` is the full sum over `Finset (Fin n)` with weight exp of the upper-triangle pair sum; `rowSum` sums over `univ.erase p`; `LeeYangProp K` in file 02 is the conjunction of the two conclusions of file 01 for all z. No hypothesis restates a conclusion.
- Built my own file `referee/RefJoin.lean` (722 lines) from the public sources (01 lines 1-403, 02 lines 35-283, so one copy of each definition) and added five statements of my own:
  - `ref_leeYangProp`: K symmetric, K >= 0 implies `LeeYangProp K`;
  - `ref_strip`, `ref_line`: parts (i) and (ii) with no Lee-Yang hypothesis;
  - `ref_critical_line`: part (iii) with no Lee-Yang hypothesis and without the unused hypotheses `0 < n` and `Function.Injective P`;
  - `ref_nonvacuous`: for P = (2, 3, 5) there is a symmetric K >= 0 on Fin 3 with rowSum K p = log P p (K_pq = log P_p + log P_q - (log 30)/2 off the diagonal).
- `scripts/memcap.sh 8 lake env lean RefJoin.lean` in the existing built project (Lean v4.28.0, no download): exit 0, 0 errors, no `sorry`, all five `#print axioms` lines give `[propext, Classical.choice, Quot.sound]`. Wall time 39 s.
- Independence: this is the same proof checked by the same kernel, so it is a replay as far as the proofs of files 01 and 02 go. What is new is the non-vacuity theorem (the first reviewer argued satisfiability by hand) and the removal of the unused hypotheses in a compiled statement. Files 03 to 08 were not recompiled by me; they are not Lee-Yang statements and the first reviewer's log shows exit 0 for each.

### 1.2 Numerics (different code path: python-flint/Arb ball arithmetic, numpy; not the first reviewer's mpmath script)
`referee/ref_check.py`, 200-bit Arb, run under the 8 GB cap.

(A) Circle theorem tested directly in the activities, not through s. 40 000 random K >= 0, n = 2..6, all but one normalised activity strictly inside the unit disc, last one solved from the affine equation: 0 cases with normalised modulus < 1 (minimum 1.0000026 when the last site is coupled and the others have modulus <= 0.999; exactly 1 when the last site is decoupled). Others on the circle: last one on the circle to 7.3e-13. Control with K < 0: 4436 of 5000 samples give a root strictly inside, so the sign condition is used.

(B) Equal energies: F is a polynomial in x = e^{-s}; numpy roots, 200 random K >= 0, n = 2..9, random a in (-1, 2): all roots on |x| = e^{-a}, deviation 3e-15 (all K > 0) and 8e-6 (sparse K with decoupled sites, where -1 is a multiple root and the root finder loses digits).

(C) Certified counts. Winding number of F on the boundary of the box -3 < Re s < 4, 0 < t < 40, each contour segment enclosed in an Arb ball that excludes 0, so the count is rigorous for the Arb enclosures of K; sign changes of e^{itL/2} F(1/2 + it) with certified signs at step 0.004 (a lower bound for zeros on the line). The sum rule is imposed exactly (cycle edges solved by a ball linear system).

| case | min K | zeros in box (certified) | certified sign changes on the line | first reviewer |
|---|---|---|---|---|
| primes 2,3,5 (K unique) | 0.0912 | 21 | 21 | 21 / 21 |
| primes 2..11, near-rank-one K | 0.0901 | 49 | 49 | 49 / 49 |
| primes 101..113, 5-cycle graph only, 0 < t < 12 | 0 | 45 | 45 | not run |
| primes 2..11, 5-cycle graph only (sum rule forces a negative edge) | -0.135 | 49 | 43 | not run |
| primes 2..11, chords rescaled (0.2, 1.6, 0, 1.3, 0.5) | -0.880 | 49 | 41 | not run |

In the three K >= 0 rows, certified zeros in the box = certified sign changes, so every zero in the box is on the line and simple; this is interval-certified, which the first reviewer's 40-digit run was not. The numbers agree with theirs (21, 49).

(D) Primes (2, 3, 29), where the sum rule forces K_01 = -0.788: 33 zeros in the box, 31 certified sign changes, and certified winding 1 in Re s > 0.55 and 1 in Re s < 0.45. So there is a certified off-line pair. Agrees with the first reviewer's 31 of 33.

## 2. Is "confirmed" deserved

Yes for the weaker statement, and the label "confirmed-weaker-statement" is the right one.
- Confirmed: the two Lee-Yang theorems and the six stage theorems compile with standard axioms; with the join they are unconditional for symmetric K >= 0.
- Not confirmed as worded: "the Lean formalisation of the Lee-Yang circle theorem (8 statements, 44 theorems, about 2576 lines)". Counted again here: 8 files, 2576 lines, 44 `#print axioms` lines, of which file 01 (Lee-Yang) has 407 lines and 2, file 02 (stage) 292 lines and 6. The other 36 statements and 1877 lines are other topics (Hankel/Pick, Krein inertia, cascade composition, a sign lemma, a Liouville limit, a Beurling core).
- Not in Lean: parts (iv)-(vi) of the lane theorem (Curie-Weiss member at every depth, twists, zero count). These rest on the lane notes and one internal referee.
- In the public repository the stage theorems still carry `LeeYangProp K` as a hypothesis. The join exists only in the two check folders (the first reviewer's Joined.lean and referee/RefJoin.lean).

## 3. Scores, challenged in both directions

Arbitrariness (first: 3; referee: 3).
- Towards 1: the circle theorem is canonical, and parts (i)-(ii) are the natural statement for a multi-affine Lee-Yang polynomial restricted to a line z_p = e^{kappa_p - s l_p}.
- Towards 4-5: part (iii) is produced by imposing n linear conditions on K so that the common abscissa is 1/2; any real a is obtained the same way. The Lean proof uses primality only for log P_p > 0 and to rewrite d^{-s}; `ref_critical_line` compiles without injectivity, so the statement holds for repeated "primes". Admissible K >= 0 exist exactly when no log P_p exceeds the sum of the others (necessity: K_pq <= r_q, so r_p <= sum of the other r_q; sufficiency is the standard weighted-degree criterion, not re-proved here): P_max^2 <= M. So (2,3,5) is admissible (Lean: `ref_nonvacuous`), (2,3,7) and (2,3,29) are not. The headline count is an artefact of batching.
- Net 3.

Importance (first: 2; referee: 2).
- For analytic number theory alone this is 1: a specialist would recognise a corollary of Lee-Yang/Ruelle and of the Kurasov-Sarnak mechanism. It is not a restatement of RH and not a classical equivalence; it constrains no zeta zero and no bound on the de Bruijn-Newman constant. The same theorem holds for unimodular twists, non-prime energies and Beurling-type generators (first reviewer's controls; consistent with (A), which never uses s).
- The extra point is for the 407-line self-contained Lean proof of the multivariate circle theorem by Asano contraction, which I did not find elsewhere (section 5) and which is reusable outside the project.

Novelty: formalisation-or-certificate-of-known-fact. Unchanged.

## 4. Changes to the first verdict

1. Added: interval-certified zero counts (C, D); the first verdict had fixed-precision numerics only. Numbers agree.
2. Added: Lean non-vacuity instance for (2,3,5) and compiled unconditional forms of (i), (ii), (iii). The first reviewer's join compiled `leeYangProp_of_ferro` and the unconditional zero-line statement of (iii) only; "(B) ... discharged in a joined file" is accurate for (iii) and one application away for (i), (ii). Now all three are compiled.
3. Corrected: "Instances of (iii) exist only for n >= 3" holds for distinct primes. The Lean statement does not use injectivity, so formally n = 2 with P_0 = P_1 is an instance. More precise: for distinct primes, instances with K >= 0 exist iff n >= 3 and P_max^2 <= M.
4. Added to robustness: negative couplings with the sum rule kept do not have a clean threshold in min K. The first reviewer found all zeros on the line at min K = -0.094 and 47 of 49 at -0.375; the 5-cycle graph on primes 2..11 has min K = -0.135 and only 43 certified sign changes for 49 zeros. (Sign changes are a lower bound for on-line zeros; the off-line zeros in that row were not separately certified. In row D they were.)
5. Wording: "44 theorems" means 44 headline statements with an axiom printout; file 01 alone has 17 `theorem` declarations.
6. The first reviewer's one-line statement says no more than is established. I shortened it.

## 5. Literature (own searches, 8 queries, general terms only)

- Circle theorem: Lee-Yang 1952; Asano 1970; Ruelle 1971 and arXiv 0811.1327; Newman 1974; Lieb-Sokal 1981; Borcea-Branden arXiv 0809.3087. Expository proofs of the multivariate form by induction/Asano: Harcos's note after Ruelle; Srivastava-Szegedy arXiv 1407.5991 (proof without Asano contraction). Known.
- Stage mechanism: Kurasov-Sarnak arXiv 2004.05678 (the abstract speaks of pairs of stable polynomials; the restriction to a line is in the body, which I did not open); Alon-Cohen-Vinzant arXiv 2303.03201, J. Funct. Anal. 286 (2024): every real-rooted exponential polynomial is the restriction of a Lee-Yang polynomial to a positive line in the torus (abstract confirmed by search). So zero sets of this type are exactly the Kurasov-Sarnak ones. The sum-rule form for divisor sums over a squarefree M was not found stated (two searches); it is a direct corollary.
- Zeta and Lee-Yang: Newman's programme (1976, 1991; 2015 lecture notes; 2024 seminar abstract saying RH would follow from Lee-Yang if xi were suitably related to an Ising model). The lane result gives no such relation and says so.
- Lean or other proof assistants: four searches (Lean/Mathlib, PhysLean/HepLean, Isabelle/Coq) returned no formalisation of the Lee-Yang circle theorem or of Asano contraction. Adjacent: the RealRooted Lean project (Borcea-Branden stability infrastructure, in progress, from GitHub issues); a 2026 Lean 4 Heilmann-Lieb formalisation (Zenodo 20561832; record confirmed to exist, code not inspected). Lean Zulip, Mathlib source and GitHub code search were not searched directly. "Not found" is limited to this.
