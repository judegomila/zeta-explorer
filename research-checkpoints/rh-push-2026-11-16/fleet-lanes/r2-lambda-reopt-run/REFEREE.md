# REFEREE: r2-lambda-reopt-run/RESULT.md

Date 2026-11-16. Adversarial check of the steps labelled PROVED, with my own exact-rational checker (scripts in
`/tmp/ref_r2lam/`: `ref.py`, `one.py`, `ent.py`, `kk.py`; none shares code with the author's `check_dump.py`).

Verdict: **holds = true** for the two PROVED claims of the summary (the conditional value and the two-height cell).
One sentence inside the proof of Lemma G is false as written (counterexample below); the lemma's conclusion is
repairable and no certified value depends on it. One framing gap on the hypothesis: the abscissa 0.874886647 is
below the abscissa the repository documents, and the run is not valid at the documented one.

## 1. Confirmed

**Headline value. CONFIRMED.** Own checker on `dump-t874886647.steps.jsonl.gz`, exact rationals, 59423 substeps:
q chain recomputed from q0 = (2 theta - 1)^2 + 10^-7 equals the dumped q at every k; rate recomputed from
(r, lambda, rho, h, ell, cap) equals the dumped rate at every k; v <= rho^2; r h < 2; 0 < c delta < 1; S1; terminal;
horizon. U = 29014954274317/(2.5*10^14) = 0.116059817097268. S1 margin 1.8120e-8, min rho^2 - v = 3.0018e-10,
terminal k = 59422. 0 failures.

Cap rule: I did not reuse the author's case split. Mine: cap >= sup of s_r on [0, v] iff the convex quadratic
g(u) = cap (u^2 + 4a(1+a-u)) - 2u is >= 0 at both ends of u in [1+a-v, 1+a] and at its vertex when the vertex is
inside. Same verdict on every substep. I also re-derived the author's rule (ds/du has the sign of 4a(1+a) - u^2;
peak 1/(u* - 2a)); it is correct.

**Other runs.** 7/8: 0.116091488672439 (k = 59438). 87/100: 0.114686652134445 (k = 58719). 4/5: 0.093069284680992
(k = 47651). All 0 failures, all equal to the table.

**New test cases (not in RESULT.md).**
- theta = 0.8748, modes of the 0.874886647 dump, every condition rechecked at the new q: 0 failures,
  U = 0.116035823245075.
- Negative control: same modes at theta = 7/8: admissibility fails on 1928 substeps (first at k = 605). The checker
  detects an invalid run.

**Floor and kernel sets. CONFIRMED** (own extraction): 468 floor entries, identical to F2's 468; 60 kernel rows =
F2's 59 plus (3/5, 4987/2500, 93/400). So the hypothesis is (H4) plus (K) for that one row, as stated.

**New kernel row.** Float grid test of (K) (h = 1, d in [0, 10^4], y in (0, rho], b in [0, y]): min ratio 1.99516 against
lambda = 1.9948, margin 3.6e-4, attained at b = y, y = rho, d = 5.19. Control: the same lambda at rho = 109/400 fails
(min ratio 1.99351). Sibling rows (4983/2500, 109/400), (9967/5000, 107/400), (9913/5000, 161/400) pass with margins
2.3e-4 to 3.5e-4. Not a proof; consistent with the two certificates.

**Lemma H (two-height cell). CONFIRMED by re-derivation.** The proof of Lemma 3.1 uses (K) (valid for every h > 0),
the probe identity at x* +- rh at the entry's own h, and (J) for that entry on the closed cell. It never uses
h = h_i. In Theorem 4.2, Step 1 and Step 3 are per substep; at a knot the left substep is used and its closed cell
contains t*. The two entries at cell 322 are both among F2's 468. One-height variant recomputed with my code:
0.116059822328895, 0 failures (1816 catalogue caps recomputed at the higher v).

**Raymond chain.** Re-ran a copy of `raymond_recompute.py` at 874886647/10^9: 0.118473587983093, 60659 substeps,
0 violations. This agrees with round 1's separate script. I did not write a third implementation.

**Shell behaviour.** zsh passes `$EX` as one argument, bash as four (tested). Note: the driver
`tmp/qrh-theta-curve-routeP.sh` has `#!/bin/bash`, so it fuses nothing when executed as a script; the fault needs the
command line pasted into zsh. RESULT.md says this and labels the attribution as inferred. 0.117674 not reproduced
(disclosed).

## 2. Errors and gaps

**E1. Lemma G, proof sentence false.** "The one-step map (q + 2/c) e^{-c delta} - 2/c is ... for q >= 0, decreasing
in c." False for 0 <= q < about delta = 1.95e-6. The derivative in c is -int_0^delta beta(s) e^{-c(delta-s)} ds, negative
only while the trajectory stays positive on average. Exact check with the degree-18 enclosure: map(q, 19) > map(q, 11)
at q = 0, 10^-8, 10^-6; the inequality reverses at q = 3*10^-6. Terminal substeps have q in (q_e, about 3.9e-6), so the
false range occurs.
Repair: on a non-terminal substep the output exceeds q_e > 0, so beta > 0 on the substep and the ODE comparison
(beta_A - beta_B)' = -c_A (beta_A - beta_B) + (c_B - c_A) beta_B >= -c_A (beta_A - beta_B) gives the ordering; the
terminal time to reach q_e is handled by the same comparison (beta >= q_e > 0). With that restriction the induction
goes through for the exact flow. For the enclosed map (Taylor polynomial, degree-11 log bound) monotonicity in c is
not shown; the defect is of size 1e-100 against a derivative of size 1e-12 on non-terminal substeps, so it holds,
but it is not written. Lemma G stays "PROVED under (G-mono)" only after this correction. (G-mono) itself is OPEN,
as stated. No certified value uses Lemma G.

**E2. The hypothesis abscissa is not the documented one, and the run is tuned to it.**
`formalization/paper/zf-campaign-synthesis.md` records B = 17497733/20000000 = 0.87488665 (PR #14, conditional) and
the optimum of the imported Xu-Sang system B* = 0.8748866496166314. The run uses 0.874886647, which is 2.6e-9
below B*. No in-repo source gives 0.874886647; it is the brief's rounded figure. Test: the modes of this dump at
theta = 0.87488665 fail admissibility at substep 605 (rho^2 - v = -2.24e-9); at theta = B* rounded up, the same
(-1.91e-9). So 0.116059817097268 is not established under the half-plane the repository documents. Under
B = 0.87488665 the established value is round 1's fixed-mode replay 0.116060108665412; a re-optimised run at
0.87488665 has not been made (expected near 0.1160598). The claim is logically correct as a conditional on
"Re s > 874886647/10^9" exactly; the table row should carry B = 0.87488665 as well, and the text should say that the
3.0e-10 margin is smaller than the uncertainty in the abscissa.

**E3. Section 10, "the re-optimised run is the greedy optimum of the F2 menu".** That a per-substep largest-rate
choice is optimal over mode sequences needs (G-mono), which is OPEN. State it as conditional. The start offset is
also a free parameter (S1 margin 1.8e-8 of 1e-7); effect about 2e-9, immaterial.

**E4. Scope of layer (c).** Floors of (M2) and catalogue rows are checked against the dump only (disclosed). My
checker does the same. The only independent floor re-derivation is the project verifier, a single implementation.

**E5. Rule breaches** (disclosed): one run of 1300 s and the 20-minute mis-configuration run on the local machine.

## 3. Controls

- Davenport-Heilbronn: the chain fails at (H1) (DH has zeros with Re s > 1), at (J) (term-by-term bound of the
  log-derivative Dirichlet series with Lambda(n) >= 0), and at (W) through (H3) (a verification of zeta zeros).
  Lemma H, Lemma G and the run arithmetic are Euler-blind and give no zero statement. Correct.
- Sign twist and backward heat: the output is an upper bound on Lambda at positive time, conditional on a zero-free
  half-plane; nothing is concluded about RH. Not applicable beyond that.
- RH is not assumed. Verified height enters only through (W) and is not restated as new. Accepted bound stays
  Lambda <= 0.2.

## 4. Surviving claim

Conditional on zeta(s) != 0 for Re s > 874886647/10^9 exactly (unrefereed, and below the abscissa 0.87488665
documented in this repository), on (H2), (H3), (H4) and on (K) for (3/5, 4987/2500, 93/400):
Lambda <= 29014954274317/(2.5*10^14) = 0.116059817097268 (two-height cell covered by Lemma H; one-height variant
0.116059822328895). Under B = 0.87488665 only 0.116060108665412 (round 1) stands. Lemma G needs the corrected
monotonicity statement and remains conditional on the unaudited (G-mono). Mis-configuration value 0.117674 not
reproduced.
