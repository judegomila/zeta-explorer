# REFEREE: zf-hecke-all-fields/RESULT.md

Referee pass 2026-11-16. Source checked: local text of arXiv 2610.26835v2 (`../bypass-78/dl/2610.26835.txt`),
Sections 12.7, 13.7, 14.1, 14.6-14.8. Independent numerics: mpmath 30 digits and numpy grids, scripts in
`/tmp/ref-zfh/` (not kept in the repo). Nothing here is a zero-free region. RH open.

## Outcome

- PROVED proposition (section 3): CONFIRMED as a scalar statement relative to Lemma 14.10 of the unrefereed preprint.
- Verdict "precise obstruction, method not family": CONFIRMED, with the scope stated below.
- One MEASURED statement is wrong as worded (the GRH clause). Two wording overstatements. One inaccurate justification.

## 1. Re-derivation of the PROVED step

Statement: decoupled step (b, l, kappa), 13/18 <= kappa <= 1, kappa >= 2 beta_M - 1 if kappa < 1, E <= 0 on classes
with a <= beta_M. If 12/25 <= 2 beta_M - 1 and beta_M <= B_flat then B(l) >= beta_M.

Re-derived:
1. delta_c(kappa) < 12/25 <= 2 beta_M - 1 (Lemma 14.10(1)), so the critical class is among the controlled ones.
2. E(delta_c, 1/2) = lambda (l - l*), lambda >= 1 (Lemma 14.10(2)), so l <= l*(kappa), B(l) >= F_flat(kappa).
3. kappa <= kappa_flat: G(kappa) <= 0 gives F_flat >= (1+kappa)/2 >= beta_M. Uses only G increasing on [13/18,1],
   which the paper proves by interval arithmetic (G' >= 0.498).
4. kappa > kappa_flat: F_flat(kappa) > B_flat >= beta_M. Uses F_flat increasing on [0.7497, 1], which the paper proves.
   The measured monotonicity on [13/18, 0.7497] is not used. Correct.

The logic is valid. The proposition is a necessary-condition statement, so it does not need a decoupled step to be
realizable (the paper realizes only the coupled step, Lemma 14.8 / Prop. 14.6 with one beta_*(F)).

Independent numerics (different test cases from check.py):
- (14.8) recomputed from (14.7) at d = h with theta = g/(6 kappa), z0 = 17/50: agreement 2.5e-31 on 2000 random points.
- l* obtained by solving the affine equation from (14.7) directly, not from the paper's closed form:
  kappa_flat = 0.749773294079928262, B_flat = 0.874886647039964131, delta_c = 0.469344858698143, R_c = 0.590332353526356.
- b-independence at the critical class, kappa = 0.7223, 0.73, 0.7411, 0.76, 0.83, 0.97, 1: |E(b=.03) - E(b=.27)| <= 5e-32;
  lambda in [1.0690, 1.0920].
- 3572-point grid (different from the 2001-point grid): F_flat increasing, min slope 8.4e-4; G increasing, min G' 0.49837.
- Direct min-max without Lemma 14.10 (numpy, scan over b, bisection in l, max of E over the controlled rectangle),
  min of B(l) over kappa >= max(13/18, 2 beta_M - 1):
  beta_M = 0.74, 0.80, 0.86: 0.8748434; 0.87: 0.8748717; 0.8748: 0.8748864; B_flat: 0.8748867. B(l) - beta_M >= 0 in all
  cases, equal to 0 at B_flat. Matches the RESULT table.
- Count-saving slope, different test: uniform saving tau = 0.005 in R on all classes, full re-optimisation and
  fixed point kappa = 2B - 1: dB/dtau = -0.1378. The RESULT's fixed-class figure -0.137 is confirmed
  (the two agree to first order because only the critical class binds).

## 2. Errors and gaps

E1 (wrong as worded, MEASURED): "even GRH for the family as input moves the output by only 4.3e-5".
By the RESULT's own decoupled rule (classes with a <= beta_M; Lemma 13.7 puts an actual zero in every bin a > a_f),
the critical class is empty once beta_M < a_c(13/18) = 0.733986. Then the constraint that produces F_flat is absent.
Scalar necessary bound at kappa = 13/18 with classes delta <= 2 beta_M - 1 (referee run):
beta_M = 0.7339: 0.874842; 0.73: 0.874779; 0.72: 0.874597; 0.70: 0.874159; 0.60: 0.870910; GRH: no class with
delta >= 1/8, only l <= 1/5 (B >= 0.8667) and the non-class conditions remain.
Correct statement: the output is insensitive (at most 4.3e-5) to the family supremum on [0.734, B_flat]; the claim
does not extend to a family supremum below 0.734. The proposition itself carries the hypothesis 2 beta_M - 1 >= 12/25
and is unaffected. The 0.874843 figure with GRH holds only under the paper's formal rule (classes up to 2B(l) - 1
regardless of zeros), which is not the rule the RESULT defines.

E2 (overstatement): "the system returns 0.874843". F_flat(13/18) is a lower bound on what a step with kappa = 13/18
could yield, not an attained value. Admissibility (Remark 14.1) requires 7497/10000 <= kappa <= 3/4; Lemma 14.11
builds tangent triples only on [kappa_flat, 3/4]; the Prop. 14.6 check (6 kappa - 2g)L - R_kappa > 0 has margin
1279/750000 at kappa = 0.7497 and is negative at kappa = 13/18, delta = 1/8, L = 0.2105. So 4.3e-5 is an upper bound
on the sensitivity, possibly not attained.

E3 (inaccurate justification): "u = 1 gives the targets themselves". Lemma 13.7 removes rows inducing the principal
character; unit rows are bounded classes handled separately. beta_M >= beta_T is therefore an assumption of the
decoupled setting, not a consequence of the row structure. The proof of B(l) >= beta_M does not use it. If the truth
were beta_M < beta_T the decoupled rule would give beta_T <= F_flat(max(13/18, 2 beta_M - 1)); this is not provable
from anything in hand.

E4 (scope): beta_M in the proposition is the true supremum, used as in the paper's contradiction argument
(kappa = 2 beta - 1). With proved bounds B_prev >= B_flat in its place the conclusion B(l) >= B_flat follows directly
from the proof of Theorem 14.13, since the target enters no exponent ("All margins are independent of the target",
Prop. 14.6). The proposition adds the oracle case beta_M <= B_flat. It is a statement about this exponent system only.

Not errors: field independence is stated at l.1043-1044 and Theorem 3.3; the M2 hypothesis sits in Lemma 12.7 on row
twists by members of Theta, as cited; the price slope is first order and labelled so.

## 3. DH control

The scalar proposition makes no claim about zeros of any function and has no DH content; consistent.
For the underlying method the two cited Euler-product steps exist in the text: the Euler branch of log L anchored at
2 + iv (Lemma 12.7; Lemma 13.7 "analytic logarithm anchored by the absolutely convergent Euler logarithm") and the
Mobius identity for M1 (l.5694-5698). A linear combination of two L-functions has neither. Pass.

## 4. RH / verified height

No step assumes RH or GRH as a hypothesis of a proved claim. No verified-height input appears. The GRH clause of E1
is a sensitivity remark, and it is the one that is wrong.

## 5. Is the obstruction real

Real for the stated scalar system, and correctly attributed to the method: the binding class is formal (x = 1/2,
nonemptiness not asserted, paper l.6966), and the count R_c is a uniform bound. It is not an obstruction for the
family. Ways around, none supplied here or in the RESULT:
1. A smaller count at delta near 0.469 (zeros of sextic twists near real part 0.7347): a zero-density estimate for
   the family {nu chi(u)} better than U^{0.590} at that abscissa. Priced at -0.137 per unit of exponent (confirmed,
   -0.138). This is the item "a smaller count at the critical class" of Remark 14.14.
2. Emptiness of the critical class: any proof that the twist family is zero-free for Re s > 0.734 removes the binding
   constraint (E1). Stronger than the target statement, so not a practical route.
3. Class-by-class mixing of averaged and pointwise numerators, unequal lengths: outside Theorem 14.13 (Remark 14.14).
4. Hybrid target-row mean value (RESULT section 4): OPEN, not priced; agreed.

## 6. Surviving claim

No lower abscissa for zeta alone. Relative to Lemma 14.10 of the unrefereed preprint: in the decoupled scalar system,
for a twist-family supremum beta_M in [0.74, B_flat], every step yields B(l) >= beta_M; the target and the field enter
no exponent. The output varies by at most 4.3e-5 for family supremum in [0.734, B_flat]. A count saving U^{-tau} at
the critical class moves B by about -0.137 tau. The GRH clause is withdrawn.
