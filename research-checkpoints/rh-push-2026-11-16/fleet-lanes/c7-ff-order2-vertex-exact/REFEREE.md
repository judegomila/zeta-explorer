# REFEREE (adversarial, lens: general) for c7-ff-order2-vertex-exact/RESULT.md

Date 2026-11-18. Only this file was written. No statement about zeta is made in the result or here.

## Verdict

The exact identities and Propositions 2, 3, 4 are confirmed (independent code, different cases). Proposition 1 is
confirmed as stated for the computed range. The verdict "precise obstruction" survives in a narrowed form. Four
statements in section 0 / the claim summary are stronger than what the files support (E1 to E4). Flags: R1 = R2 =
R3 = R4 = false (agree with the result).

## What was re-derived

* ||c_k||^2 = q^(d+2k)(1 - 1/q), 1 <= k <= d/2: re-derived (orthogonality over monic m of degree d of e(m theta),
  theta = x/c - x'/c' with denominator degree <= 2k <= d; count sum_{deg c = k} phi(c)). Checked against every block
  in `blocks_*.jsonl` with 1 <= k <= d/2: 0 failures.
* Cauchy-Schwarz |J|^2 <= ||c_k||^2 ||R||^2 on all 14077 blocks: 0 violations (so "no block exceeds 3" is a
  tautology of the definition of h_up, not evidence; see E5).
* Proposition 3 on the stored integers (r = 0, k != N', d >= 4, weights other than r1, r2, S_cop present):
  416 of 416 equal as integers.
* Proposition 4: is Cauchy-Schwarz plus Proposition 3 plus the norm formula. Correct.
* h <= 1 - M/2 - 1/(2N) and abscissa 5/6 + M/12 from r_i <= N - (d+1)/2: arithmetic correct.
* Consistency of the cited staircase with F1/F2: expanding c_N by the p* form recursively gives the coefficient of
  c_{N-6j} of size (q-1) q^(6j) q^(j-1), i.e. weight about (q-1) q^(j-1); this agrees in order with the
  sixth-power count q^(r/6). So the h = r/N law is not contradicted by the lane's own identities. It remains
  uncomputed beyond r <= 5.

## Independent numeric rerun (different cases)

Own code (float complex, definitions only: resultant, sum over x mod c; no use of `ffx` or closed forms), q = 7,
target F = T^3 + 3 (not used in the lane; a_1 = +-5), d = 3:

| case (N, lam, k), weight | Lemma G | Prop 2 (row = kappa conj twisted sextic row) | Prop 3: \|J\|^2 vs wt^2 q^(2d) S_cop^2 | row excess | Bessel share |
|---|---|---|---|---|---|
| (3, 0, 1), nu | kappa constant, modulus 1, 0 of 294 fail | 0 of 343 fail | 86986729375 = 86986729375 | 0.0595 | 0.200 |
| (3, 0, 1), mu | same | 0 of 343 | 2686097496348 = 2686097496348 | 5.277 | 6.163 |
| (1, 2, 1), nu (marked) | same | 0 of 343 | 326864216700 = 326864216700 | **1.158** | 1.562 |
| (2, 1, 1), random +-1 | same | 0 of 343 | 398594812 = 398594812 | -0.104 | 0.001 |

Proposition 2 is thereby also confirmed for nu != mu and for marked weights (the lane's `mucheck` covers only
w = mu, lam = 0). ||c_1||^2 = 14406 = q^5 (1 - 1/q) in all four.

## Errors and overstatements

**E1. "Outcome B against the pre-registered thresholds" is not met literally.** The rule is h <= 1.1 at all
degrees. The base probe has h_up = 1.24 (q = 7) and 1.489 (q = 13) at (N, d) = (2, 2) (recomputed from the block
files). The result excuses these as finite-size and adds two exclusion rules after the first test (disclosed).
Outcome B for the base probe therefore rests on Proposition 1 plus the cited law h = r/N, not on the threshold
test. Section 0 and the claim summary should say "outcome B by argument; threshold test not met at N = 2".

**E2. "F1 exact for all m, d <= 6" is wrong for F1.** `checks_q7_d6.json` has an empty F1 record (k <= 7 = d + 1
there; F1 starts at k = d + 2). F1 is checked for d <= 5 (q = 7) and d <= 4 (q = 13); at d = 5 only k = 7, 8. Only
F2 is checked at d = 6. Section 5.1 states this correctly; section 0 and the proposed map row ("F1, F2 exact to
d = 6") do not.

**E3. The headline comparison "excess up to 5.25 against at most 0.067" compares different regimes.**
(a) The 5.25 is the unmarked mu row (lam = 0, (N, d) = (4, 4)), where the format has h < 1 anyway. In the region
the vertex needs (h = 1 + l - M/2 > 1, i.e. 2 lam > d >= N + lam) the stored rows give: mu at most 1.97; target a
up to |0.33| and target b up to 0.17 (all at N = 1, 2). Ratio about 6 to 12, not 78.
(b) "at most 0.067 for Weil targets" holds only after the filter N >= 2, d >= 5. At N = 1, d >= 5 target a has
|excess| 0.28; my rerun with F = T^3 + 3, (N, lam, d) = (1, 2, 3) gives 1.158 for a Weil target. This is expected
(coherent share about wt^2 pi_lam M_N^2 / q^(2N + lam), which is O(1) at N = 1), but it means "the low estimate is
true for Weil targets" is a statement about decay in N, measured on N = 2, 3, 4 only.

**E4. "Fails for the control" is a bounded-factor statement at the computed sizes.** For w = mu the excess is
about wt^2 times a constant with wt in {1, sqrt(q), q - 1}; the largest stored value is 5.25 and no computed mu row
exceeds the diagonal by more than a factor 6.3. A row bound "diagonal times C" with C = q, or any bound with a
q^(eps N) loss (which the format tolerates at the exponent level), is not violated by any computed block.
Likewise Proposition 4 at r = 0 yields only |S_cop(k)| q^(-k) <= sqrt(C (1 - 1/q) D) / wt, which is the trivial
bound for the Moebius sum up to the constant wt <= sqrt(q). "The low estimate contains the conclusion at the
strength Proposition 2.1 would output" and "fails for mu at the exponent level" both require wt = q^(r/6 + O(1))
with r growing like N; that is the cited staircase (first step r = 7, d >= 17, not computed) and the "up to the
non-principal part" clause, which is ARGUED. Proposition 4 is PROVED only for r = 0.

**E5. Item 3 of section 0 (ledger's false input; "no vertex below 1/2 exists") is not established here.** h_up <= 3
is Cauchy-Schwarz by definition; saturation near 3 for mu shows the row is nearly parallel to c_k for that
weight. Whether the ledger's row input omitted this term was not checked by me and is not derived as an identity
in the result (the dual form of the row Gram matrix is marked "not derived").

**E6. Proposition 1 beyond the computed range.** The general form of F2 is not identified (the result says so);
"n_k <= 2 for d <= 17" has no supporting computation above d = 6; the orthogonality step needs all occurring
indices <= d/2, and c_{(d+1)/2} = 0 is exact only for d = 1, 3, 5. The recursion through the p* form can produce
more than two terms. "Capped independently of the truth" is established for d <= 6 (q = 7), d <= 4 (q = 13), and
is CITED (Hoffstein, Patterson) beyond.

**E7. Minor.** The 4383-of-4447 match is "to 9 digits", a float comparison of exact integers, not an identity.
`cmpbig.log` still contains the two pre-fix "False" lines. The dh weight nu_a + nu_b is a sum of two characters
and is not a Davenport-Heilbronn analogue with a functional equation; no conclusion depends on it. N = 1 rows of
n1 and b have identical excesses (0.166, 0.101, 0.097, 0.071), so n1 is not an independent control at N = 1.

## Checks requested by the assignment

* Assumes RH? No. Weil's theorem is used only as a named input for the two L-polynomials, verified exactly
  (discriminants -27, -19, -27).
* Restates verified height? Not applicable (function field).
* Known theorem presented as new? F1, F2 are attributed (Hoffstein, Patterson); Proposition 2 is Lemma G
  restated; Proposition 4 is Bessel. None is presented as a new theorem about zeros. The "correction" to the
  predecessor's F2 form at d = 6 is a finite exact observation (117,600 violations stored) and plausible (the
  functional equation is vector-valued in k mod 6); I did not recompute it.
* Zeta-only mechanism? None claimed; controls need not be run for a zero statement. The one control mechanism
  claimed (mu fails the row bound) I reran: confirmed at the constant level (5.277 at d = 3), subject to E3, E4.

## Surviving claim

In the F_q[T] block model (q = 7, 13; squarefree A, sharp degrees, uncompensated marks): (i) for d <= 6 (q = 7)
and d <= 4 (q = 13) every c_k computed with k > (d+1)/2 lies in the span of c_i, i <= (d+1)/2, with m-independent
coefficients, so the base probe at k > d is a re-expression of blocks with dual length <= N - (d+1)/2; the cap
h <= 1 - M/2 follows given the cited law h = r/N. (ii) At dual length 0 the probe equals wt q^d times the
Moebius-weighted sum of the row weight exactly, for any weight (confirmed independently, new target); the row is
kappa times the conjugate (mu w)-twisted sextic row exactly. (iii) By Cauchy-Schwarz a diagonal-level row bound
with constant C bounds the Moebius sum by the trivial bound divided by wt; at the computed sizes wt <= q - 1, and
the mu-weighted row exceeds the diagonal by a bounded factor (up to 6.3 unmarked, up to 3 in the h > 1 region)
while target rows approach the diagonal as N grows (N = 2 to 4). That the row bound is equivalent in strength to
the conclusion at the exponent level is argued through the uncomputed staircase r >= 7. Threshold test: not met
for outcome B at N = 2 (base probe), undecided for the marked probe.

## Flags

| flag | value | reason |
|---|---|---|
| R1 | false | identities hold for arbitrary weights; multiplicativity is not used |
| R2 | false | fixed q, bounded degree, no zero statement |
| R3 | false | no conclusion for controls to fail; mu separation is constant-level and measured |
| R4 | false | no passage to the critical line; the h > 1 vertex needs an input not supplied |
