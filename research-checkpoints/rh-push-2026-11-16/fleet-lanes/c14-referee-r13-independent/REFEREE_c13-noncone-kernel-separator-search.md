# Independent referee: c13-noncone-kernel-separator-search (independent sample; Lemma H)

Referee lane `c14-referee-r13-independent`, 2026-11-19. Written from the lane's PREREG.md and RESULT.md; the lane's
REFEREE.md was not read. The lane's code (`kern.py`, `funcs.py`, `ballk.py`, `analyse.py`, ...) was not read, imported
or run, with one exception: one `grep` of `funcs.py` for the ordering of the column sets
(`itertools.combinations(range(1, 14), m)`), which PREREG does not fix. The lane's stored outputs
(`out/params_*.npz`, `out/signs_*.npy`, `out/meta.json`) were read as data.
Own code: `item6_kern.py` (kernels and functionals from PREREG sections 2 and 4, python-flint balls),
`item6_validate.py`, `item6_run.py`, `item6_analyse.py`, `item6_lemmaH.py`, `item6_recount.py`. All runs local through
`scripts/memcap.sh 8`; the server was not used. Nothing here is a statement about zeros of zeta.

## Verdicts

| statement | verdict | exact line / form |
|---|---|---|
| Stored float64 signs of the registered grid | **HOLDS on the sample** | 300 functionals x 35 objects = 10,500 entries recomputed: 10,123 decided by both, **0 disagreements**; 377 float64-undecided entries, all decided by the referee's balls; 0 entries undecided by the referee. |
| Table 3.1 (grid, P2, strict reading): counts, pass fractions, T-train = T-weak = full = 0 | **HOLDS** | Recounted from the stored sign matrices with selection code written from PREREG sections 1, 5, 6: 2,794,368 functionals, 51,764 one-signed on P2, every pass fraction of the table equal to three decimals, 0 at every tier in all 12 families; one-signed-on-zeta counts equal to table 3.2. |
| "0 functionals one-signed on P2 give the battery DH the opposite sign" | **HOLDS on the grid** (recount) and on the sample (63 of 63 recomputed one-signed functionals: DH has zeta's sign) | The four-stage total (629,432) includes the random and adaptive stages, whose sign matrices are on the server and were not recounted. |
| Prediction 2a refuted (T-NR rejects D1 functionals one-signed on P2) | **HOLDS** | 10 of 10 sampled stored counterexamples recomputed with T-NR opposite; 10 of 10 sampled non-counterexamples recomputed not opposite. |
| Lemma H (i), (ii), (iii) | **HOLDS** | Algebra re-derived: (u_1+v_1)^2 + (u_2+v_2)^2 - (u_1+v_2)^2 - (u_2+v_1)^2 = 2d; (u-h)^2 + (u+h)^2 = 2u^2 + 2h^2; (log(e^(mu u) K_tau))'' = (log K)'' + tau/2. In (iii) "F2[K]" on the right is the untilted K'^2 - K K''. |
| Lemma H, consequence ("no order-2 minor of D3a, no F1 with lam >= 1 and p = 0, no F2 with lam = 1 and p = 0 rejects any backward-heat member") | **HOLDS IN NARROWER FORM** | Relative to log-concavity and positivity of the Riemann-Polya kernel (CLASSICAL, cited from memory by the lane; not opened here either). Measured here on 240 grid rows of the three types at tau = -0.02, -0.1, -0.5, -1.66, -5: heat sign = zeta sign in 1,200 of 1,200. |
| Outcome "none" for the registered dictionary | **HOLDS for the grid** (recount); random, adaptive and A3 stages **not refereed** | Their sign matrices are not mirrored locally. The ball stage (A2) was not re-run. |

No statement is BROKEN.

## Referee kernels (written from PREREG section 2) and their validation

Objects implemented (35): ZETA; all 23 training characters (9 real, 14 complex; Conrey labels from the object names);
battery DH (real part of the kernel of chi_5(2, .)); TNR3_2.2; EA0.125, EA0.250; HEAT-0.10, HEAT-0.50; SGN-LIOU;
EIS0.20+3.00i, EIS0.10+5.00i; THW0.50, THW3.00. Not implemented: held-out members (their parameters are rounded in
the names) and the seeded SGN, U, DEL, THIN members (need the battery arrays).

Derivatives are exact Taylor jets (series arithmetic), not finite differences. Checks (`item6_validate.json`, 200 bits):
- zeta: Kpol(0.7) - Kpol(-0.7) = 2e-59; K3 even to 2e-58, K3' odd; closed form of K3 equals the jet form (8e-59).
- 17 characters: K(-u) = conj K(u) at u = 0.35, relative defect below 4e-58; parities as expected.
- DH coefficient ratios (1, 0.28407904384, -0.28407904384, -1): equal to the lane's `meta.json` field.
- E_a: E*(i, 0.7) = -2.3309938134148154 (lane and round-12 record: same); even to 4e-58; K3 even to 2e-57;
  EIS-w (a = 0.2 + 3i) even to 3e-60.
- jets: first and second derivative from the jet against central differences of values and of first derivatives:
  relative defects below 3e-23 (zeta, chi_7(2), E_a, theta^3, zeta K3).
- HEAT: with tau = 0 the definition returns zeta's Kpol and its first three derivatives to 4e-36 at u = 0, 0.5, 1.3, -0.8;
  c(0) = 1; (D^2 - 1/4) Kpol = K3 on the jets to 1.4e-36 at tau = -1/2.
Two points where the referee's code is not a line-by-line use of the definition: the heat kernel with polar terms at
u < 0 and the constant c use evenness of zeta's K3 (checked above); Bessel values are computed at raised precision
(Arb's routine loses about 2x/ln 2 bits at moderate argument) and K_(a+1) through the recurrence. Truncation tails are
cut below 2^-(prec+64) of the leading scale and are not enclosed: the signs are ball signs for the truncated sums.

## Sample

Seed 20261119 (numpy PCG64). Set A: 20 rows drawn uniformly from each of the 12 grid families (240). Set B: 60 rows
drawn from the rows that the stored matrix marks one-signed on the 24 training positives: D1 20 (10 with battery T-NR
opposite, 10 without), D3a 20, D2-F1 10, D2-F2 10. Every functional on all 35 objects. Precision ladder 256, 1024,
4096 (, 16384) bits until the ball of the real part excludes 0: 10,426 entries at 256 bits, 74 at 1024 bits.

| family | entries | agree | stored undecided, referee decided | disagree |
|---|---|---|---|---|
| D1 | 1,400 | 1,353 | 47 | 0 |
| D2-F1 | 1,050 | 1,014 | 36 | 0 |
| D2-F2 | 1,050 | 1,021 | 29 | 0 |
| D2-F3 | 700 | 544 | 156 | 0 |
| D2-F4 | 700 | 662 | 38 | 0 |
| D2-F5 | 700 | 662 | 38 | 0 |
| D3a | 1,400 | 1,399 | 1 | 0 |
| D3b-F1 | 700 | 700 | 0 | 0 |
| D3b-F2 | 700 | 700 | 0 | 0 |
| D3b-F3 | 700 | 668 | 32 | 0 |
| D3b-F4 | 700 | 700 | 0 | 0 |
| D3b-F5 | 700 | 700 | 0 | 0 |
| total | 10,500 | 10,123 | 377 | 0 |

Readings on the sample, from the referee's own signs:
- 63 functionals are one-signed on all 24 positives (the 60 of set B, all confirmed, and 3 of set A). On these: DH has
  zeta's sign on 63 of 63; HEAT-0.10 and HEAT-0.50 on 63 of 63; theta^3 on 63 of 63; T-NR (3, 2.2) is opposite on 25,
  SGN-LIOU on 31, EIS0.20+3i on 21, EIS0.10+5i on 8, E_a (1/8 and 1/4) on 2 each, theta^(1/2) on 2.
- D3a: zeta's sign is - at order 2 (2 of 2), - at order 3 (25 of 25), + at order 4 (13 of 13); E_a, EIS-w, HEAT and
  theta^w have zeta's sign on 40 of 40 D3a rows each (the lane's "never rejected on D3a").
- D1: zeta's sign is - at orders 3 and 4 (40 of 40; no order-2 row in the sample); HEAT and theta^w have zeta's sign on
  40 of 40; E_a is opposite on 10 of 40.

## Lemma H

Targeted rows (seed 20261120): 80 order-2 minors of D3a, 80 rows of D3b-F1 with p = 0 and lam >= 1, 80 rows of D3b-F2
with p = 0 and lam = 1. Hypothesis K > 0 at the points read: 80 of 80 minors (4 points each). zeta: -, -, + on all 240.
Backward heat tau = -0.02, -0.1, -0.5, -1.66, -5: the same sign on 1,200 of 1,200. Forward values as a test of power:
tau = +8: no change; tau = +60: the sign flips on 17 minors, 7 F1 rows and 13 F2 rows. Identity (i) on the 80 minors
at all seven tau: largest relative defect reported 0.0 (below double-precision underflow; balls at 4096 bits).

## Limits of this referee

- 300 functionals of 2.79 million; a wrong float64 sign at a rate below about 1 in 3,400 decided entries would not be
  seen with probability near 5%. The lane's own ball cross-checks are larger; they were not re-run.
- Only the grid stage has local sign matrices. "None" for the random draws, the adaptive stage and the A3 draws, the
  ball stage counts of section 3.5, and the five zeta-only T-train functionals are not refereed.
- The 35 objects contain no held-out member and none of the seeded SGN, U, DEL, THIN members.
- Kernel conventions (real part for complex kernels; untwisted n = 0 term; Re omega > 0) are taken from PREREG; the
  referee checks that the lane computed what it registered, not that another convention gives the same outcome.

## Labels to restrict

- RESULT section 4, Lemma H "Consequence": add "relative to the classical log-concavity of the Riemann-Polya kernel
  (source not opened)". The label PROVED applies to (i) to (iii).
- No other change. The registered status "closed, MEASURED, on the registered grid and draws" is the correct one.
