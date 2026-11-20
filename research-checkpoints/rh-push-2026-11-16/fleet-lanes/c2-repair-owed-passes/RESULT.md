# c2-repair-owed-passes: engine bookkeeping, four owed referee passes, pending map edits

Date: 2026-11-17. Kind: repair. No attack on RH; no bound moves; nothing here is a statement about zeros of zeta.
Labels: PROVED (argument written in the named file, this lane, one author), CONFIRMED (another lane's step
re-derived), SOURCE (read in the source in this lane), CLASSICAL (cited, not opened), MEASURED (float, non-interval).
All runs local through `scripts/memcap.sh 8`; largest run 100 s; allocations below 10 MB. The compute server was
not used.

## 0. Verdict and counts

Partial result (repair completed; one small lemma added; one scope error found).

| Item | Count |
|---|---|
| `e1-*` outcome records checked against RESULT.md and REFEREE.md | 10 of 10 agree (already rewritten by the engine workflow at 23:35, three minutes before this lane read them; this lane changed no field) |
| `e1-*` lines added to `campaign/lanes.jsonl` | 10 (all ten have a referee file; 8 hold, 2 do not hold as written with the negative verdict standing) |
| Node records updated | 1 (`vasyunin-lammin-uniform-lower-bound`: proved, unrefereed) |
| Generator rules added | 2 (five lines each) |
| Owed steps checked | 8: Theorem A step (iii); Lemmas 3, 4, 5; step 2.1(c); GHS input; (Sel); (BJ) |
| Steps that hold | 8, one of them only in corrected form (Lemma 3 -> Lemma 3') |
| Steps that fail as written | 1 lemma: Lemma 3 of `c1-spinor-hecke-primitive`, part (a) (known from the first referee) and part (d) for DH and for E_a with a >= 1/8 (new) |
| Lemma added | 1 (Lemma 4', PROVED, one author) |
| Negative verdicts that no longer stand | 0 |
| Pending map edits listed | 8 section-6 edits, 5 new section-6 items, 4 control-table edits, 4 row edits, 13 new rows, 5 kept results, 10 broken-claim rows |

## 1. Plan

Part 1: compare the ten `e1-*` records with the lane files; add lane lines; rebuild the graph and regenerate
candidates; test whether closed `e1` lanes are still reproduced; fix the node. Part 2: for each owed step, re-derive
it in full, compare cited theorems with the classical statement (open the source where a lookup succeeds), and run
one numeric case not in the lane or its first referee report. Part 3: write the owed map edits as exact text.
Decisive test for a repair lane: the step most likely to reverse a verdict, which was the domain of Lemma 3 in
`c1-spinor-hecke-primitive`; it was done first among the mathematical items and the verdict stands.

## 2. Part 1: engine and campaign bookkeeping

2.1 Records. `engine/outcomes/e1-*.json` and the `e1` entries of `engine/outcomes.json` were compared with
`push/e1-*/RESULT.md` and `REFEREE.md` (verdict line, closed node set, defeating controls, referee outcome). All ten
agree. Verdicts: 9 closed (precise obstruction), 1 partial (`e1-nb-gram-period-transfer`). Referee holds: 8; does not
hold as written, negative verdict stands: `e1-forcing-free-bilinear-split` (Theorem R(iii) false) and
`e1-rs-torus-laguerre-orbit` (frozen-speed identity false). No record reads "proposed" any more.

2.2 `campaign/lanes.jsonl`: ten lines appended in the METRIC.md format (r1..r4 false, `referees` 1, `brokenProved` 1
for the two lanes above, `restatement` true for `e1-forcing-free-bilinear-split` and
`e1-sparse-recurrence-amplifier`, `lemmasDecided` 1 for `e1-nb-gram-period-transfer`). `scoreboard.py` reads 18
lanes; headline unchanged (best score 1, `c1-leeyang-krein-limit`). Difference to note: the engine records of
`e1-burgers-cascade-anticausal` and `e1-euler-anchor-heat-certificate` carry `aboutZeros: true`; the lane lines carry
false, because neither lane states anything about zeros of zeta (polynomial heat solutions; an obstruction).

2.3 Generator. Before the change (graph rebuilt, `generate.py --top 60`, output of this lane's first run): 19 of the
top 60 contained a node of an `e1` lane; rank 6 was `resolvent-burgers-identity x discriminant-gradient-flow x h-desc-mirror-palm-surplus` (two
launched nodes of the closed Burgers lane), ranks 3, 14, 20, 45, 51, 52, 57 contained one node of a closed minimal
set, all with penalty 0. Cause: the hard rule rejects a candidate only if a closed node set is a subset of it, and
the "shares two nodes" penalty looks at `nodes` only, not `launchedNodes`; replacing one partner of a closed pair
passes untouched. Change applied in `engine/generate.py` (marked `c2-repair`): (1) reject when a candidate shares
two nodes with `nodes` or `launchedNodes` of a closed or refuted outcome; (2) penalty 3 and a note when it contains
exactly one node of a closed outcome's `nodes`. During this lane the engine workflow added closed-family rules
(`closed_families.json`) to the same file; both sets of rules are present. After: in the top 60, 0 candidates are
supersets of a closed set, 0 contain a node of a closed minimal set, 0 share two launched nodes; rule (1) rejects
505 raw candidates. 12 top-60 candidates still contain one node that was only in a `launchedNodes` list
(for example `discriminant-gradient-flow`, `frobenius-gcd-factorisation`); these are not reproductions by the
node-set test, and the family rules are the right place to judge them. Backups: `engine/scratch/generate.before-c2.py` (generator before the two rules) and
`engine/scratch/CANDIDATES.before-c2.json` (the engine workflow's candidate file of 23:35, one build earlier than the
"before" run quoted above; in it ranks 1, 4, 13, 19 contain a node of a closed `e1` set).

2.4 Node `vasyunin-lammin-uniform-lower-bound` (`engine/nodes/nodes-5.json`): type open-lemma -> identity; status
conjectural -> proved; `refereeStatus`: "proved, unrefereed" with the facts (author proof, one lane referee pass
without error, no second referee, novelty unchecked); statement replaced by the two-sided bound
`1/(64 * 2^(Omega_N) * N^2) <= lam_min(G_N) <= (3 + log N)/(N-1)^2`; `usesMultiplicativity` yes -> no (same law
measured for DH and non-multiplicative sequences). It no longer has the roles "open lemma" or "arithmetic" in the
graph and does not appear in the top 60.

2.5 The four `c1` outcome files received a `referee2` field (scope partial; the referee count is not raised).
`engine/ENGINE_LOG.md` has an entry for all of the above.

## 3. Part 2: owed referee passes (full reports in the lane directories)

| Lane, step | File | Outcome |
|---|---|---|
| `c1-multidelay-bohr-section`, Theorem A step (iii) | `push/c1-multidelay-bohr-section/REFEREE2.md` | Holds. Right side, left side (diagonal, off-diagonal in the ranges m far from n and n/2 < m < 2n including T < m < 2X), the `X^{1-s}/(1-s)` and `O(X^{-sigma})` terms and both horizontal sides re-derived. Error `O(T^{1/2+c} log T)` for every `0 < c < 1/2`. The asymptotic holds for every T ("suitable sequence" not needed). New case `b = w_1(w_2 - 0.4)/(1 - 0.4 w_2)`: prediction 2.3897, measured 2.2742, 2.2863, 2.3346, 2.3575 at T = 1e3, 3e3, 6e3, 2.4e4; difference times sqrt T between 3.7 and 5.7. |
| `c1-spinor-hecke-primitive`, Lemmas 3-5 | `push/c1-spinor-hecke-primitive/REFEREE2.md` | Lemma 3' (corrected, stated in full): `M_S(D)` is a proper subspace of infinite codimension; every test is a limit of jointly S-primitive tests in norm and in Q; infimum and negative index agree with those on all tests. Proof (first referee's repair) confirmed line by line; it needs all zeros in `|Re z| < 1/2` with a logarithmic zero-free region. Lemma 4 holds; Lemma 4' added (class `W(1/2) = 0` is dense in the same sense; uses only no zero on Re s = 1). Lemma 5 formulas hold. Scope error found: the repair does not apply to DH (zeros with Re s > 1 make `1 - t_N(J rho)` diverge; measured growth 30 to 2e8 at Re z = -0.6) nor unconditionally to E_a with a >= 1/8, so "holds verbatim for DH, E_a" is measured only. **Negative verdict stands.** |
| `c1-leeyang-chain-closure`, step 2.1(c) | `push/c1-leeyang-chain-closure/REFEREE2.md` | Holds by two routes. SOURCE: Craven-Csordas Lemma 3.2 has exactly the hypothesis `alpha_1 alpha_2 < 1/4`, i.e. `4 a lambda < 1`. Route 2 (finite products `(1 - (lambda/n) D^2)^n`, Hermite-Poulain, Hurwitz) re-derived. Closed form for `(z^2 - x_1^2) e^{-a z^2}` checked in 96 cases to 1.1e-15. |
| `c1-leeyang-chain-closure`, GHS with hidden spins | same file | Holds as a use of the classical theorem: the form needed is `u_3(i,j,k) <= 0` for site-dependent fields `h_i >= 0`, zero allowed; a hidden spin is a spin with field 0. Source not opened (CLASSICAL). Brute force on 1500 random ferromagnets with zero fields at about two thirds of the sites: maximum `u_3` = 4.4e-16; the test detects violations (+0.77 with negative fields or antiferromagnetic couplings). Certificate `Q_44` at `w = 108/55` reproduced exactly (+0.03791), new member m = 48 (+0.28502). |
| `c1-missing-controls`, Part D | `push/c1-missing-controls/REFEREE2.md` | (Sel): the moment constant `(2k)!/(k! (2 pi)^{2k})` equals the normal moment at variance `(log log T)/(2 pi^2)`; statement, normalisation, unconditionality and branch agree with Selberg 1946. (BJ): same branch convention as Bohr-Jessen; the statement as written is a weaker form (the limit law has a continuous density, so every rectangle is admissible); unconditional for `1/2 < sigma <= 1`. D1 follows. The `L^2` bound for `arg zeta(sigma_0 + it)` is a third input, used only in the quantitative remark. Sources not opened. |

## 4. Part 3: map edits

`campaign/MAP_PENDING.md` lists the owed edits with exact text: section 6 items 6, 7, 8, 10, 11, 12, 14 and five new
items; control-table edits (Liouville as an exact twist with off-line zeros, DH Arb certificate, heat zeros, SEL and
two auxiliary controls); rows P29, Q12, P14, Q4; new rows P35-P40, G22-G24, Q19-Q20, S11, Z21, F8; five results for
section 4; one sentence for section 5; ten rows for the broken-claims index. `push/OBSTRUCTION_MAP.md` was not edited.

## 5. Controls

This lane makes no claim that a control could fail. The control-relevant findings:
- DH and E_a (a >= 1/8) are outside the scope of the corrected Lemma 3: for them the equality "infimum on primitive
  tests = infimum on all tests" is measured, not proved. For zeta it is proved. The Gram-matrix statement (Lemma 1)
  is function-independent and exact for every control.
- Theorem A: the sign step uses complete multiplicativity (point evaluation of conj H); for DH the diagonal term is
  a two-point combination with complex weights and the DH analogue stays open. This is a use of multiplicativity in
  a no-go.
- GHS (kernel-side positivity) holds for Phi and, on the measured grid, for the DH kernel: it carries no zero
  information (unchanged).
- Generator: after the change no top-60 candidate reuses a closed `e1` minimal node set or two launched nodes.

## 6. Requirement flags (this lane)

| Flag | Value | Evidence |
|---|---|---|
| R1 (all primes, multiplicativity essential) | false | No attack. The only use of multiplicativity checked here is in the no-go Theorem A (step (iii)/(iv)). |
| R2 (height-uniform, every window) | false | Nothing height-uniform about zeta is established; Theorem A is a mean over poles, Part D a distributional statement. |
| R3 (fails for every control at a named step) | false | No mechanism is proposed. Lemma 3' and 4' are proved for zeta only; their status for DH is not established. |
| R4 (reaches the critical line) | false | Nothing passes from finite stages or from Re s > 1 to the line. |

## 7. Three weakest steps

1. Classical sources. Only Craven-Csordas was opened. Selberg 1946, Bohr-Jessen 1930/32 and
   Griffiths-Hurst-Sherman 1970 (or Lebowitz 1974) were compared from the standard statements; two fetch attempts
   for the GHS source failed. The GHS form with site-dependent fields rests on the citation plus a brute-force
   check on at most 7 spins.
2. Single-author additions. Lemma 4', the index statement in Lemma 3'(c') and the scope statements for DH and E_a
   are written in REFEREE2.md by one author and are unrefereed. The DH statement uses "DH has zeros with Re s > 1"
   from the map's control table (sup Re about 1.12), not re-derived here. The numeric cases are float or 20-digit
   mpmath, not interval-certified.
3. Generator change. The penalty value 3 for one reused closed-set node is a choice; it also penalises generic
   target nodes that sit in a closed set (`landau-one-sided-target`). 27 of the 40 distinct node sets in the 23:35 top 60 left the list,
   most of them through the closed-family rules added concurrently by the engine workflow, and no check was made that a
   useful candidate was not removed. `engine/` files were being edited by another workflow during this lane; the
   edits here were confined to marked lines, one node record, four `referee2` fields and one log entry.

## 8. Files

- This directory: `RESULT.md`; `checks.py` (cases `thmA [T...]`, `lemma3`, `ghs`, `q44`, `cc`); `thmA_check.json`,
  `thmA_check_24000.json`, `lemma3_check.json`, `ghs_check.json`.
- Referee passes: `push/c1-multidelay-bohr-section/REFEREE2.md`, `push/c1-spinor-hecke-primitive/REFEREE2.md`,
  `push/c1-leeyang-chain-closure/REFEREE2.md`, `push/c1-missing-controls/REFEREE2.md`.
- Campaign: `campaign/MAP_PENDING.md`; `campaign/lanes.jsonl` (ten lines appended).
- Engine: `generate.py` (two rules marked `c2-repair`), `nodes/nodes-5.json` (one node), `outcomes/c1-*.json`
  (field `referee2` in four files), `ENGINE_LOG.md` (one entry), `scratch/generate.before-c2.py`,
  `scratch/CANDIDATES.before-c2.json`; `IDEA_GRAPH.json` and `CANDIDATES.json` regenerated.
