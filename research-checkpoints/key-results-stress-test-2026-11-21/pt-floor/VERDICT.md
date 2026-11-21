# VERDICT: pt-floor

## Claim as listed
The verified zero height X ~ 3e12, not barrier slack, is what binds Lambda <= 0.2 in the Platt-Trudgian architecture;
barrier-tightening methods cannot lower it.

## What the material supports
Within Polymath15 Theorem 1.2 (RH to height X/2; no zeros of H_{t0} in x >= X, y >= y0; barrier at x ~ X  =>
Lambda <= t0 + y0^2/2), with the asymptotic region handled by Lemma 10.1 (Euler-2 mollified triangle inequality) and a
0.03 safety target, the admissible Lambda is a function of X: 0.20 at X = 5e12 (zeta-height 2.5e12), 0.19 at X = 2e13.
The barrier hypothesis is a pass/fail compact check, so a sharper certificate for it does not change (t0, y0).
This is Polymath15 section 10 and Table 1. The repository adds no proof, certificate or Lean statement.

## What it does not support
"The only lever below 0.2 is more verified height." At fixed height the value depends on the lower-bound tool used at
the corner N = N0, y = y0 of the asymptotic region.

## Replay
- N0 = floor(sqrt(X/4pi)) reproduced for 8 table rows; Lemma 10.1 lower bounds reproduced within about 5%
  (0.0378 vs 0.0376 at the 0.20 row).
- Fixed N0 = 690988 (height 3e12), minimum Lambda with target 0.03: plain triangle 0.2335; Euler-2 0.1974;
  Euler-2,3 0.1866; Euler-2,3,5 0.1831; Euler-2,3,5,7 0.1813. At N0 = 630783: 0.2355 / 0.1990 / 0.1880 / 0.1845 / 0.1827.
- Height 2.5e12 -> 3e12 at fixed tool moves Lambda by 0.0016; tool change at fixed height moves it by 0.016 below
  Lemma 10.1 (Table 1 prices 0.02 at a factor 12 in X).
- The bound increases in N and in y from the corner, so the corner is the binding point.
- Float64, P15 main term only, error terms about 1e-3 dropped, barrier not run at new parameters: not bounds on Lambda.

## Errors found in the module
1. "e_C = 0.955, margin 1.047, tightest link" mislabels eq. (88) of P15 (triangle bound for N >= N1 = 1.5e6 at
   t = y = 0.2, for the 0.22 theorem). e_C,0 <= 1.249e-3. The 1.047 depends on the free choice of N1.
2. "10x gap" to the 0.19 row mixes x and zeta-height; the gap is 3.3x in height.
3. The interval-arithmetic table is at x <= 66, with 2 of 5 cells failing; the 1.23 margin was not re-run. It is not
   evidence about the barrier at X ~ 5e12.
4. The three "convergent decompositions" are not independent: one different object, one transcription, one internal model.
5. The conclusion "no analytic shortcut" conflicts with the project's later candidate 0.1758354 at the same height and
   with several unrefereed 2026 preprints below 0.2 at the published height.

## Literature
Known. Polymath15 (arXiv:1904.12438) section 10 states the Lambda = O(1/log T) relation, the parameter selection via
Lemma 10.1 with an "arbitrarily chosen" 0.03 target, and Table 1. Platt-Trudgian (arXiv:2004.09765) apply row 2.

## Scores
- Arbitrariness 4: the number 0.2 at this height is set by the Euler-2 lemma, the 0.03 target and a table row; the
  "barrier vs height" framing depends on which hypothesis is called the barrier.
- Importance 2: restates a published remark; the strong form is false; the weak form is useful only as project guidance
  (do not spend effort on re-certifying the compact barrier check).

## Statement suitable for the public page
In the Polymath15 criterion the bound Lambda <= 0.2 is fixed by the verified height together with the lower-bound method
used just above that height; re-certifying the barrier check does not change it, while a stronger mollifier at the same
height does (replay: 0.197 to 0.181 before error terms).
