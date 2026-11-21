# REFEREE pass on the anti-bridge-square verdict (2026-11-20)

Second, independent pass on VERDICT.md / NOTES.md in this folder. Scripts and logs: `referee/`.
All runs under `scripts/memcap.sh 8`, at most 2 processes at once, about 15 minutes of compute in total.

## Outcome

The first verdict stands in substance: verification "confirmed-weaker-statement", novelty
"known-in-different-form". I found no error in the identities or in the certified numbers. Changes:

- importance 2 -> 1;
- status label "proved in notes, unrefereed" -> "obstruction / negative result";
- the first reviewer's run (c) was not an independent replay (see 2); it is now backed by two independent routes;
- order 100 for xi, which the first reviewer did not replay, is replayed;
- literature: three closer classical/recent references added; one number in the first verdict not confirmed.

## 1. What I ran

| Run | Route | Result |
|---|---|---|
| `referee/ref_xi_mp.py` (variant A) | mpmath only, 280 digits. Taylor coefficients of F(x)=xi(1/2+x) from 440-point trapezoid Cauchy sums on abs(x)=4; mu_k from the series quotient Xi'/Xi; leading-minor determinants (mp.det). No Arb, no power-series arithmetic, no LDL. | mu_0 = 0.0231049931154189707889338104, mu_1 = 3.71725992852696861648662625e-5 (agree with the first reviewer to all 24 digits printed). mu_3 = 6.63031680e-10 vs 6.63031674e-10 from 80 zeros (mp.zetazero). H0, H1 positive through order 16. Planted quartets, first non-positive minor ratio H0/H1: g=14.134725 d=0.3: 4/4; g=30 d=0.05: 15/15; g=30 d=0.3: 11/11; g=30 d=0.49: 10/10 (all four equal the first reviewer's table). New points: g=22 d=0.2: 10/9; g=40 d=0.45: none/16. |
| `referee/ref_dh_fft.py 8000 1200 80 5` (variant B) | Arb pointwise values of the completed Davenport-Heilbronn function on abs(x)=5 (301 evaluations, 8000 bits), Cauchy sums, arb_series quotient, arb_mat.det of leading minors. Shares only Arb's pointwise Hurwitz zeta with the lane code. Aliasing error is not enclosed: numerical, not a certificate. 441 s. | mu_0 = 0.09806957695333636694019, mu_1 = 0.001748504939203854391033. H0: single negative minor ratio at order 75, -4.05685e-569. H1: single negative at 75, -2.30511e-572. All other ratios positive through 80. First reviewer: -4.06e-569, -2.31e-572 at 75/75. Agreement. |
| `replay_hankel.py xi 100 40000` (first reviewer's script, same code path as the lane) | Arb series + LDL | xi: H0, H1 certified positive definite through order 100 (last pivots 2.18367e-878, 2.25226e-883). Planted quartets at order 100: g=60 d=0.3: 33/33; g=100: 65/64 (d=0.05), 62/61 (d=0.3), 60/59 (d=0.49); g=150 d=0.3: 99/99; g=300 d=0.3 and g=1000 d=0.4: not detected through 100. |

Hand checks: Theorem A cross term (partial fractions), Theorem B algebra, the anchor identity, and the step
"all-order positivity of H0, H1 => RH" (the moments grow geometrically, so the Stieltjes problem is determinate and
the measure is compactly supported; M then equals a Stieltjes transform near s=0 and by continuation everywhere, so
its poles lie on the negative axis). All correct.

Not re-run by me: the square-kernel inertia (first reviewer re-ran the lane's inertia.py unchanged and added an own
planted test), DH orders 109/110, the node-family tables, the rule N* = min(2K0-1, 2K1) on the twins table.

## 2. Was "confirmed" earned?

- Run (c) of the first verdict is described as "own Arb code". `replay_hankel.py` builds the same acb_series
  expressions for log xi and for the DH function as the lane's `anchor_hankel.py`, and uses the same LDL loop.
  It is a re-implementation of the same code path, not an independent verification. The numbers nevertheless
  hold: variant A (different library) reproduces the xi moments and four planted failure orders, variant B
  (different coefficient route and linear algebra) reproduces DH 75/75 with the same pivot values.
- Run (d) is a re-execution of the lane's own script: replay, not verification. The first reviewer's planted
  quartet test (square_stress.py) is an own test and is the meaningful check of item (4).
- "confirmed-weaker-statement" is the right category. The claim as listed has three parts that do not survive:
  "square factorisation of the bridge energy" (a positive square exists iff RH; unconditionally the form is
  indefinite), "true square" (the phrase does not occur in the lane material), and "relation to arXiv 2611.06705"
  (I fetched the abstract: Baldwin-Sivek, 3-manifold decision problems, math.GT; grep of the private record and of
  all remote branches of the public clone finds the id only in lit-dedekind-qrh and
  topological-zero-certificates SOURCES.md, neither about this result).

## 3. Corrections to the first verdict

1. "symmetrised sum is 2(P+P)" should read 2(P (+) P) (direct sum).
2. "positivity through order 100 reflects roughly the first 50 zeros" was an extrapolation from order 60. The
   order-100 run supports it: a quartet at height 150 (about 53 zeros below) is first seen at order 99, height 300
   is not seen. Measured ratio order / zero index is about 2.5, 2.1 to 2.2, 1.9 at heights 60, 100, 150 (13, 29, about 53 zeros below). This is a measurement on planted
   quartets, not a theorem.
3. "detection order grows with 1/d": weak. At height 100 the order moves 60 -> 62 -> 65 for d = 0.49, 0.3, 0.05.
4. "no margin" (1 - norm T about 1e-15 to 1e-30 on 5 or 6 nodes): for fixed nodes both sector matrices of xi are
   positive definite, so the margin is positive; its smallness is the generic ill-conditioning of Loewner/Hankel
   matrices of an analytic function and occurs for any Stieltjes function. It carries no information on zeta.
5. Sra, arXiv:2611.02944: I fetched the abstract page. Confirmed: densities with Laplace transform tied to
   1/xi and 1/Xi, Polya frequency order k* from verified height about 3e12, and "PF_k implies every zero below
   the (k+2)-nd is on the line". The value k* = 1.81e12 quoted in the first verdict was not visible in what I
   retrieved; not confirmed.

## 4. Literature (6 searches, 2 abstract fetches; classical items from memory, not re-read)

The first verdict's attributions (Stieltjes class via Krein / Loewner; Grommer; de Branges / Lagarias) are right.
Missing and closer:

- Positivity of the Pick kernel P on the right half-plane is the statement Re xi'/xi(s) > 0 for Re s > 1/2,
  equivalent to RH: Hinkkanen (1997), Lagarias, Acta Arith. 89 (1999) "On a positivity property of the Riemann
  xi-function". Search confirmed both attributions (arXiv:1205.2773, arXiv:2509.18963).
- Power sums of the zeros of the genus-0 function Xi and a moment-problem criterion for RH: R. Zhang,
  "On Power Sums of Positive Numbers", arXiv:1510.03420, and arXiv:2303.09396 (Hausdorff moment form; the abstracts do not mention Hankel determinants).
  This is the anchor statement (3) in another normalisation.
- The moments mu_k = sum gamma^(-2k-2) are the values at integers of the secondary zeta function (Voros,
  "Zeta functions over zeros of zeta functions", Springer 2010; arXiv:math/0311029).
- Not found: the DH failure orders 75/109/110 or the rule N* = min(2K0-1, 2K1) (one search on DH with
  Hankel/Turan/Laguerre terms, no hit). These are bookkeeping facts about one function and one anchor.

Nothing in the result is new mathematics. I looked for about ten minutes; the absence of the DH numbers in the
literature is weak evidence only.

## 5. Scores

- Importance 1 (first verdict: 2). Every item is a classical equivalence restated in the lane's vocabulary, valid
  for any real even entire function of order at most 1. It constrains nothing: no bound on Lambda, no zero-free
  region, no information beyond roughly the first 50 zeros, which are far inside verified height. The finite
  table is superseded in kind by Sra's paper (order about verified zero count). The only use is internal: it
  closes the "bridge + antibridge cancels" and "first-order square root" lanes. A specialist would not need to
  be told.
- Arbitrariness 3 (unchanged). The mathematical core is canonical (it would score 1 or 2: Stieltjes class,
  anchor x=0 is the symmetry point, the DH order 75 is a property of the function). The framing is not: the
  "antibridge form" is the lane author's definition (the source defines two points and no form), the node
  families, planted parameters and the failure-order rule are choices, and the listed title attaches an unrelated
  arXiv paper.
- Status "obstruction / negative result": the lane's own verdict is "precise obstruction"; the proofs are short
  and in notes; the finite facts for xi are ball-arithmetic certified, the DH sign at 75 is certified by the lane
  code path and reproduced numerically by variant B.

## 6. One-line statement

First verdict's line is accurate but "a two-sided bound" is vague. Proposed:
"For xi, the bound -P <= B <= P between the one-sided Weil form and its reflection coupling holds at all orders
exactly when RH holds, and the cutoff bridge energy is a sum of squares exactly when RH holds; both restate
classical criteria (Stieltjes/Grommer, de Branges/Lagarias), and the finite checks (xi to order 100,
Davenport-Heilbronn failing at order 75) give no information on zeros beyond about the first 50."
