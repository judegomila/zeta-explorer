# zf-large-values: Guth-Maynard large values in the critical bin of the 7/8 proof

Date 2026-11-16. Internal working note, not refereed. Verdict: **precise obstruction, no new abscissa.**
7/8 stays the unconditional abscissa (openai/math family 003, Lean-checked by its authors, unrefereed).
RH open, no QED. Labels: PROVED (here, elementary) / CLASSICAL / IMPORTED / RECALLED / OPEN.
Checks: `checks.py`, output `checks.out` (sympy, exact where stated).

## 1. Plan and what is new relative to the atlas and prior notes

Atlas (PR #27) section 10 records the 7/8 boundary, PR #14 and Xu-Sang; it has no large-values route.
`formalization/paper/zf-campaign-high-side.md` (2026-11-01) already priced a hypothetical family
Guth-Maynard estimate (H-GM_fam): zero gain in the paper system (Prop G), B ~ 0.87441 heuristic in the
Xu-Sang system. It left two items open: the literature was "not checked", and whether H-GM_fam is
attainable for the sextic family was not analysed. This note closes both:

* a literature check (2025-2026) for large-value results and family versions;
* three elementary statements (P1-P3) fixing where a Guth-Maynard-shape bound can act;
* a structural statement (S1) on why the Guth-Maynard method does not transfer to the sextic row family,
  and its link to the TRO6 / P_a^{1/6} wall.

## 2. Setup (from the 7/8 manuscript, `~/lean-deps/qrh-verify/paper.txt`)

* Rows: sextic residue characters chi_u over Q(sqrt(-3)), norm of u ~ U (family size U), plus bounded twist height.
* Witnesses (Prop 8.3): normalised polynomials D^{-1/2} sum mu(a) psi(a) W(Na/D) and D^{-1/2} sum psi(a) W(Na/D),
  with |.|^2 >= U^{delta r}, length D = U^r. So the unnormalised size is D^{sigma_eff}, sigma_eff = (1+delta)/2.
  Slot polynomials have amplitude q = x*delta <= delta/2, so the same ratio bound holds for witness x slots and
  for integer powers: **spike/length S/n <= delta for every polynomial the proof counts with** (PROVED, by inspection
  of C1-C4 in high-side section 5.1).
* Lemma 20.2 certifies the high-side exponent on 0 <= delta <= 5/6, 0 <= x <= 1/2.
* Lemma 15.1 is the low-side row norm (mean square of the reflected rows), used through Cauchy-Schwarz with
  Prop 15.2 (the P_a^{1/6} term).
* Guth-Maynard (Annals 203 (2026); arXiv:2405.20552) Theorem 1.1, CLASSICAL:
  R <= T^{o(1)} (N^{2-2s} + N^{18/5-4s} + T N^{12/5-4s}) for values >= N^s.
  Mean value: R <= N^{2-2s} + T N^{1-2s}.

## 3. Results

**P1 (PROVED, one line; checks V2).** The third Guth-Maynard term minus the mean-value term is
(12/5 - 4s) - (1 - 2s) = 7/5 - 2s, which is >= 0 exactly when s <= 7/10; the second term only adds.
So for s <= 7/10 the Guth-Maynard bound is >= the mean-value bound for every N, T. In family units
(T -> U, n = length exponent, S = spike exponent): a gain over the count max(n,1) - S needs S > 2n/5.
With S/n <= delta this needs **delta > 2/5**.

**P2 (PROVED relative to the paper's formulas; checks V1, V3). The critical bin is outside the range.**
* Lemma 20.2: the identity (20.9) re-verified symbolically. The minimum of -E* on the box is
  2.281473e-4 at x = 1/2, delta* = 185/138 - 35 sqrt(16354)/4692 = 0.386638 (a* = 0.693319).
  delta* < 2/5. R*(delta*,1/2) = 0.66846 against 1 - delta* = 0.61336.
* By P1, on delta <= 2/5 no Guth-Maynard-shape estimate (even at the most optimistic strength, family size U,
  arbitrary coefficients, any witness, slot product or power) changes any count, so R* and min(-E*) are unchanged.
* 7/8 itself is not set by Lemma 20.2 (it has positive margin). It is set by the low side
  sigma_0 = 11/12 - l/4 at l = 1/6, the stated range of Lemma 15.1. With the wider zero-loss range
  2M >= 1 + 3l (relative to the paper's proof, not Lean-checked) the ceiling is (1507 - 2 sqrt(921))/1653
  = 0.874957070, binding at delta* = (49 - sqrt(921))/48 = 0.388584 < 2/5. Unchanged again.
* **Recomputed abscissa with Guth-Maynard inserted: 7/8 (paper as proved); 0.874957070 (retuned, P-rel).
  Gain exactly 0 in both.**

**P3 (PROVED, elementary; Lemma 15.1).** A large-values estimate cannot improve the low side. The low side
is |sum_m A_m B_m| <= ||A|| ||B||. A level-set bound #{m: |B_m| >= V} <= R(V) improves ||B||^2 only if it holds
below the mean-square level; at V^2 = ||B||^2/#rows every row is in the level set, and large-values estimates
equal the mean value bound there. The flat configuration (|B_m| constant) saturates Lemma 15.1 and is not
excluded by any large-values statement. The loss in Lemma 15.1 past l = 1/6, ((1+3l-2M+d)/4)_+, comes from the
length of the reflected dual sum, not from a count.

**P4 (PROVED arithmetic on IMPORTED system; checks V4). Xu-Sang system (PR #14, unverified import).**
The binding bin is delta* = 0.469345 (a* = 0.73467 > 7/10), count 0.590332, B* = 0.8748866496. Here the range is
entered, but:
* an intrinsic bound (T -> U) lowers the count only with polynomial length n > (1 - 0.590332)/(2 delta* - 2/5)
  = **0.7605**;
* with n <= 1/2 the best Guth-Maynard-shape count is 0.7307 > 0.5903 (no gain);
* embedding the rows in a family closed under quotients (difference conductor U^2, so T_eff = U^2) gives count
  >= 1.102 at any length or power (no gain).

**S1 (structural obstruction; CLASSICAL + RECALLED inputs).** The Guth-Maynard argument is coefficient-free:
it bounds the matrix M = (n^{it}) for arbitrary |b_n| <= 1, starting from the sharp norm ||M||^2 <= N + T and
using that the family is closed under differences (t - t' in [-T, T]). Both fail for sextic rows:
* chi_u chi_u'^{-1} has conductor ~ U^2, not U;
* the available norm bound is Lemma 9.1, K + D + (KD)^{2/3}. At K = U, D = U^n it is mean-value-optimal only for
  n <= 1/2; at n = 0.7605 it is U^{1.174}, at n = 5/6 it is U^{1.222}.
* For the cubic analogue Dunn-Radziwill (Annals 200 (2024), arXiv:2109.07463) prove, under GRH, that
  Heath-Brown's (KD)^{2/3} term is sharp. If the sextic term is sharp in the same way, a coefficient-free family
  count of size max(n,1) - S is false for n in (1/2, 2), and so is any coefficient-free Guth-Maynard refinement
  of it. (OPEN for order 6; the extremal vectors would be sextic theta coefficients.)
* So a gain at n > 0.76 needs a coefficient-specific estimate (mu or 1 against the sextic kernel), i.e. an
  extension of Lemmas 17.1 / 18.1. Their capacities are limited by the same reflected-dual / theta-coefficient
  term that produces P_a^{1/6} in Prop 15.2. The large-values route in the Xu-Sang system therefore reduces to
  the TRO6-type input, not to Guth-Maynard.

Even granted in full, H-GM_fam was priced at B ~ 0.87441 and the envelope at 0.8742841 (high-side sections
13-14): at most 7.2e-4 below 7/8.

## 4. Literature check (web, 2026-11-16)

| item | content | applies here? |
|---|---|---|
| Guth-Maynard, arXiv:2405.20552, Annals 203(2) 2026 | N(s,T) <= T^{30(1-s)/13}; gain over Ingham only for s > 7/10 | t-aspect only |
| ANTEDB table 11.1 (Tao-Trudgian-Yang, arXiv:2501.16779) | best A(s): Ingham 3/(2-s) on [1/2, 7/10]; Guth-Maynard 15/(3+5s) on [7/10, 19/25) | confirms no known large-values gain at s <= 7/10 |
| Chen-Gupta-Li, arXiv:2507.08296 (2025) | Guth-Maynard for all chi mod q: sum_chi N(s,T,chi) <= (qT)^{7(1-s)/3} | full character group mod one q (closed under quotients); not thin fixed-order rows over varying moduli |
| Cossaboom, arXiv:2609.27715 (2026) | Guth-Maynard for GL2, T^{5(1-s)/2}; l^q-bounded coefficients | t-aspect only; abstract only read |
| Xu-Sang 2610.15291v2, Liu 2610.26835v2 | abstracts name amplified moments / averaged numerator; no large-values input | none |

No 2025-2026 result was found that (a) lowers the 7/10 threshold, or (b) gives a Guth-Maynard-type bound for
fixed-order (cubic, quartic, sextic) character families. Search coverage is abstracts and one database table,
not full texts.

## 5. DH control

Large-values and zero-density estimates use no Euler product: they hold for arbitrary coefficients and for the
Davenport-Heilbronn function (a combination of two Dirichlet L-functions). They can only change the row count R
in the high-side exponent. In the 7/8 proof the Euler product enters elsewhere: the Mellin signal contains
1/L(s, eta) (Moebius coefficients, deletion of Euler factors, the local Euler identity for the principal row).
This note's conclusions are about counts only, so they are consistent with DH; no step here would distinguish
zeta from DH, and none claims to.

## 6. Verdict

Precise obstruction. Guth-Maynard does not act on the critical bin of Lemma 20.2 (delta* = 0.3866 < 2/5,
sigma_eff = 0.6933 < 7/10), and cannot act on Lemma 15.1 (a mean square, not a count). The abscissa after
insertion is unchanged: 7/8. In the imported Xu-Sang system the binding bin is in the range, but the needed
estimate is intrinsic to a thin non-closed family at lengths where the coefficient-free mean value bound is
itself unavailable; the known extensions (2507.08296, 2609.27715) do not cover it.

No pivot was run: the strongest adjacent idea (coefficient-specific extension of Lemma 17.1 capacity) is the
TRO6 input already assigned to sibling slugs.

## 7. Three weakest steps

1. S1 uses Dunn-Radziwill sharpness for the cubic sieve (GRH-conditional, recalled from the abstract) and
   assumes without proof that the sextic (KD)^{2/3} term behaves the same way.
2. "S/n <= delta for every counted polynomial" was read off the certificate list C1-C4 of the prior note, not
   re-derived line by line from Sections 17-19 of the manuscript.
3. P4 rests on the Xu-Sang endpoint as imported by PR #14; the source was not audited here. The literature
   check read abstracts, not full papers.
