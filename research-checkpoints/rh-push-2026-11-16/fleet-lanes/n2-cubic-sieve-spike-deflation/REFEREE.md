# REFEREE: n2-cubic-sieve-spike-deflation

Adversarial referee (general), 2026-11-17. No ssh. Every run through `scripts/memcap.sh 8`, single process, longest 45 s.
Referee code is independent of `cubsvd.py` (own enumeration, factorisation, symbols, Gauss sums) and was kept outside
the repo (`/tmp/ref_n2/ref.py`, `/tmp/ref_n2/nullfit.py`); only this file was written here.

**Outcome: the verdict (precise obstruction, nothing proved, no abscissa moved) holds after three corrections.**
The measurements reproduce. One literature attribution is wrong in a way that matters for the phrase "conditionally
on GRH, false by a formula already in the literature". One measured claim (exponents for J = 20, 40) is overstated.

## 1. PROVED step (4.1): confirmed

||C a||^2 = sum_j s_j^2 |<a, v_j>|^2 is the spectral decomposition of C*C; splitting at s_j^2 > T and using
sum_j |<a, v_j>|^2 <= ||a||^2 gives the stated inequality. Confirmed.
Minor wording: "holds for exactly those a" is an equivalence up to a factor 2 in T (spike energy <= ||C a||^2 <=
T ||a||^2 + spike energy), not an exact one.

## 2. Literature re-read (arXiv:2109.07463v3, PDF fetched and read for this report)

Confirmed as quoted: (1.11); Theorem 1.4 with the GRH hypothesis and both ranges; Remark 1.1 (only lower bounds use
GRH); extremal sequence (9.3) beta_b = g~(b) W(N(b)/B) with lower bound A (B^{5/6}/A^{1/6})^2 = A^{2/3} B^{5/3} for
A <= (AB)^{1/2 - xi}; "This is far from the only obstruction"; display (1.13) and "the correction term alone is not
enough". The correction of the "reported sharp" wording in Z12 (sharpness is GRH-conditional) is right.

**Error E1 (status of (1.13)).** The RESULT treats (1.13) as a GRH asymptotic formula valid "for bounded w-rough
coefficients" and concludes "conditionally on GRH, false by a formula already in the literature" (verdict line) and
"on GRH this is the content of Dunn-Radziwill (1.13)" (section 7). In the source:
- (1.13) is an informal display in the introduction, written with "approximately equal"; the source says the precise
  versions are Propositions 9.1 and 9.2.
- Propositions 9.1 and 9.2 are **upper bounds only** (9.2: "<= 2 (...)"), for sequences in the class C_eta(B, w) of
  Definition 3.1 with w > (log X)^10. Axiom (4) of that class is square-root cancellation against **every**
  non-principal cubic character (3.2). The spike vectors beta = chi_{h_0} restricted to rough b are excluded by
  axiom (4), and for sequences in the class the h-sum is at the flat level. No proved statement in the source gives
  a lower bound of size (AB)^{2/3} N(h_0)^{-1/3} for a twisted vector, and "w bounded" (weakest step 2 of the RESULT)
  is not an allowed regime.
So the twisted-spike family is not a theorem of the source, with or without GRH. Section 2.1 is labelled ARGUED in
the RESULT, which is correct; the verdict line and section 7 are stronger than the label and must be weakened to
"suggested by the heuristic display (1.13)".

Referee remark (ARGUED, not checked in detail): a cleaner conditional route exists and gives the same law. In the
proof of Theorem 1.4 replace beta_b = g~(b) W by g~(b) (b/h_0)_3 W. By (2.2), (2.3) the inner sum becomes
sum_b W g~(a h_0 b) up to a unimodular factor when a h_0 is squarefree, and the Voronoi main term has size
B^{5/6} N(a h_0)^{-1/6}, so the Rayleigh quotient is >> (AB)^{2/3} N(h_0)^{-1/3} for fixed h_0 and A <= (AB)^{1/2-xi}
on GRH. This reproduces the measured N(r)^{-1/3} law and the one-sign rule (the other sign gives a h_0^2, not
squarefree). It would need uniformity of Proposition 8.1 in the level and near-orthogonality of the cross terms to
become a lower bound for s_J; neither is in the RESULT or the source. Until that is written, "bounded rank is false"
is MEASURED at K, D <= 18000 plus ARGUED on GRH, not PROVED-conditional.

## 3. Numeric rerun, different cases (independent code)

Checks inside the referee code: C = C^T exactly; composite Gauss sums by brute-force summation over residues for 20
composite moduli agree with twisted multiplicativity to 5e-14; prime Gauss sums of modulus 1 to 1e-14.

| case (not in the RESULT) | rows | s_1^2/(KD)^{2/3} | s_2^2/edge | counts > 1, 1.1, 1.25, 1.5 edge | ov(v_1, conj g N^{-1/6}) | excess(w_1)/(KD)^{2/3} | tail slope j in [2,40] |
|---|---|---|---|---|---|---|---|
| K = D = 1500 | 527 | 0.218 | 1.157 | 7, 3, 1, 1 | 0.9325 | 0.1669 | -0.228 |
| K = D = 9000 | 3166 | 0.1915 | 1.751 | 32, 22, 13, 5 | 0.9615 | 0.1633 | -0.229 |

K = D = 9000 lies between the RESULT's 6000 and 12000 rows on every column (s_1^2 = 35857 against 36400 from the
fitted exponent 1.283; s_2^2 = 20141 against 20040). Overlap with g (not conjugated): 0.005. Among the 18 unit
twists of g and conj g the untwisted conj g is the top one (0.961; next 0.066), so the Gauss-sum normalisation is
not hiding a choice. Twisted spikes, K = D = 9000, Rayleigh excess relative to r = 1: N = 4: 0.419; 7: 0.385;
13: 0.339; 19: 0.307; 31: 0.267; composite 28: 0.151. Matches 3.5 to 0.01. Opposite sign: 0.21 (N = 4) falling to
0.00 by N = 25 at K = 1500, as stated. Quadratic-twisted rows (m = rows 2..120): mean Rayleigh 1.034x bulk, max
1.082x, top-40 energy 0.0124 against random 0.0126; cubic-only 2.47x. Matches 4.3.

**Null control (new).** Independent cube-root-of-unity phases with the same zero pattern: top s^2 = 0.99 to 1.01 x
the edge formula at every size. The edge reference of the RESULT is sound and the counts above the edge are not an
artefact of the reference (counts against the measured null top: 9, 12, 23, 48, 70; exponents 0.95, 0.98, 1.08, 1.24
for the four thresholds, same as the RESULT).

**Error E2 (exponents for fixed J >= 20).** The RESULT states s_J^2 ~ K^{1.21 to 1.23} "for every fixed J in
{2, 5, 10, 20, 40}" as evidence that each is a growing spike. For a matrix with no spikes s_J^2 at fixed J also
grows faster than the edge at these sizes, because the J-th value approaches the edge from below (deficit about
(J/n)^{2/3}). Dividing the RESULT's saved singular values by the null spectrum of the same size and density
(K = D = 2000 to 18000):

| J | raw exponent | exponent after dividing by the null |
|---|---|---|
| 2 | 1.231 | 1.222 |
| 5 | 1.231 | 1.209 |
| 10 | 1.226 | 1.191 |
| 20 | 1.208 | 1.150 |
| 40 | 1.213 | 1.116 |
| 80 | 1.246 | 1.081 |
| 160 | 1.317 | 1.024 |

The raw fit gives 1.25 and 1.32 at J = 80, 160, where the ratio to the null is 0.90 to 1.07 (no spike). So the raw
exponent is not evidence by itself. Corrected statement: J = 2, 5, 10 grow like K^{1.19 to 1.22} relative to an
exact bulk reference; J = 20, 40 exceed the null by factors 1.35, 1.19 at K = 18000 with corrected exponents 1.15,
1.12; s_40 was below the null (0.93) at K = 2000. The qualitative conclusion (number of outliers grows; no bounded
J leaves a flat remainder at these sizes) survives, on the counts and on J <= 10.

**Variant: dyadic blocks (the object of Theorem 1.4).** N(c), N(d) in (K/2, K]:

| K = D (dyadic) | rows | s_1^2/null | s_2^2/null | s_5^2/null | s_10^2/null | ov(v_1, conj g) | counts > 1, 1.1, 1.25, 1.5 edge |
|---|---|---|---|---|---|---|---|
| 4000 | 700 | 1.31 | 1.03 | 1.03 | 1.02 | 0.741 | 3, 1, 1, 0 |
| 16000 | 2813 | 1.55 | 1.17 | 1.10 | 1.04 | 0.834 | 13, 4, 1, 1 |

The top spike and the twisted family are present (twist ratios 0.45, 0.38, 0.33, 0.29 at N = 4, 7, 13, 19), and the
sub-leading values rise with size, but the effect is much smaller than with the sharp cutoff from norm 1: at 2813
rows the second value is 1.17 x null against about 1.7 x for the sharp matrix of similar dimension. The RESULT's
exponents and counts are for the sharp-cutoff matrix only; in dyadic form the evidence against bounded rank is
two sizes and a second value 17% above the bulk. This should be stated as a limitation (weakest step 1 mentions
the sharp cutoff but not its size).

## 4. Other checks

- 2.1 arithmetic: theta(h_0) = (A/B) B (B^2/(A N(h_0)))^{1/3} = (AB)^{2/3} N(h_0)^{-1/3}; count above T is
  (AB)^2/T^3; K/8 at A = B = K, T = 2K. Confirmed as arithmetic on the heuristic.
- 4.2: the condition sum_{N(h_0) <= R} |corr|^2 << (R/K)^{1/3} D ||a||^2 follows from 4.1 with the 2.1 strengths
  (recomputed). The prime-indicator remark agrees with the Patterson bias X^{5/6}/log X up to a power of log X
  (||a|| = (X/log X)^{1/2} gives X^{5/6} (log X)^{-1/2}); "at the threshold with no room" is correct at the level
  of exponents only.
- 4.4: with third entry 2(1 + Y)/3 - rho/3 the minimum of max(1, .) - delta Y is at Y = (1 + rho)/2 (slopes -delta
  and 2/3 - delta > 0) and equals 1 - delta (1 + rho)/2: 0.765328, 0.706660, 0.647991, 0.530655 at rho = 0, 1/4,
  1/2, 1; break-even 2(1 - 0.590332)/0.469345 - 1 = 0.74570. Recomputed; correct as MODEL arithmetic. The match
  with the Z11 saddle abscissa 0.7457 is unexplained, as the RESULT says.
- Constant 0.196 in 3.2: arithmetic confirmed ((0.8376)^2 x (0.528)^2); the 16% gap remains unexplained.

## 5. Controls and hygiene

- Davenport-Heilbronn, backward heat, sign twist: the RESULT makes no statement about zeros and claims no
  zeta-only mechanism; its object is a character matrix. The three controls have nothing to act on. The relevant
  control here is the independent-phase null, run in section 3.
- RH is not assumed. GRH enters only through the cited Theorem 1.4 and is labelled. Verified height is not used.
- Novelty: "first full SVD of the cubic-symbol matrix" cannot be confirmed; a web search found no such numerical
  study, and none excluding one. The mathematical content (extremal vector, weight N^{-1/6}, existence of further
  obstructions) is in Dunn-Radziwill and is credited. The twisted-spike law N(r)^{-1/3} is a measurement plus a
  heuristic; it is not in the source as a statement (E1).
- Memory rule: followed in the RESULT's logs (one run killed by the cap and reduced, not raised).

## 6. Required corrections

1. Verdict line and section 7: replace "conditionally on GRH, false by a formula already in the literature" by
   "false at the scales measured; suggested on GRH by the heuristic display (1.13); the source's proved versions
   (Propositions 9.1, 9.2) are upper bounds for sequences with cancellation against all cubic characters and do
   not contain the twisted spikes". Correct weakest step 2 (w > (log X)^10 and axiom (3.2), not "w bounded").
2. Section 3.2 and summary item 2: restrict the exponent claim to J <= 10 or report null-normalised exponents.
3. State that the dyadic form shows the same family at much smaller amplitude.

## 7. Surviving claim

MEASURED (reproduced independently at K = D = 1500 and 9000, plus dyadic blocks): the top singular pair of
C = (c/d)_3 on squarefree primary elements is conj g(d) N(d)^{-1/6} (overlap 0.93 to 0.96) with Rayleigh excess
0.163 to 0.167 (KD)^{2/3}; cubic twists of it by small r carry excess proportional to about N(r)^{-1/3} for one sign
only; the number of singular values above an independent-phase null grows like K^{0.95 to 1.24} for K = D up to
18000, and s_J^2 for J <= 10 grows like K^{1.19 to 1.22} against K^{1.00}; no bounded-rank deflation leaves a flat
remainder at these sizes. Quadratic-twisted rows sit at the random level (restates n1 (L*), OPEN). MODEL: bounded
rank leaves the Z12 exponent at 0.7653; break-even rho = 0.7457. PROVED: only the SVD identity. The GRH link is
heuristic. No abscissa moves; nothing about zeros; RH open.
