# REFEREE (lens: general) for c7-liou-high-row-bound/RESULT.md

Date 2026-11-18. Adversarial referee. Only this file was written in the lane directory. Referee scripts are in
`/tmp/ref_c7/` (`r1.py`, `r1b.py`, `r2.py`, `r2big.py`; they import the lane's `lib7.py`); all runs local through
`scripts/memcap.sh 8`, single process, longest 3 min 36 s. The compute server was not used.

## Verdict

**Holds as a partial result, with the corrections below.** Every step labelled PROVED was re-derived and
confirmed. The headline conclusion ("the Liouville analogue of (5.36) fails on average over characters mod f_0")
is conditional on the remainder bound of Theorem A, which is not a written proof (the result says so). No
statement about zeros of zeta is made; nothing assumes RH; nothing restates verified height.

Requirement flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false (same as claimed).

## What was re-derived (all confirmed)

1. **Lemma 1.** From (4.7): gamma_1 gamma_2 = mu alpha G and abs(gamma_1) = abs(alpha) = 1, mu^2 = 1 on squarefree
   c give mu gamma_2 conj(alpha) = G conj(gamma_1). The Gauss-sum statement (x -> m^(-1) x; vanishing of both sides
   when a prime divides (m, c)) is correct. The bar on alpha: the manuscript's D(s, Psi) (line 1417 of the text
   extraction) carries the bar and (5.31) expresses C_V through T(s, .) = L_0 D, so the bar is forced by (5.31);
   the unbarred print in (5.30) is an extraction or typographic matter. The reading is sound.
2. **Lemma 1'.** prod (1 - psi(p) q^(-x)) = 1/L^S and prod (1 + psi(p) q^(-x)) = L^S(x, psi)/L^S(2x, psi^2). Correct.
3. **Lemma 2 (pair Poisson formula) and (2.1).** Re-derived: dual lattice of kO, covolume A q_k, CRT factorisation,
   Ramanujan sum q_p 1_{p | h} - 1 at p | d, Gauss sums at c_1 and c_1' with the stated arguments; the product of
   a(c) conj(a(c')) with psihat(h) reduces to (2.1) term by term. Correct.
4. **Lemma 3 (class phases).** Re-derived from chi_b(a) = R(a, b) chi_a(b), chi_n(-1) = R(n, n), R a sign-valued
   function of classes, and h d = l b^6. Correct, given that chi_.(l) is a class function for l in U_S
   (supplementary laws; CLASSICAL, and measured).
5. **Theorem A, D and P.** h = 0 contributes only c = c' (the Gauss sum at h = 0 vanishes unless c_1 = c_1' = 1);
   the normalisation of P follows from (2.1) with x_c = q_c^(-1/2) V 1_sigma; each term is >= 0. Lower bound
   (d = 1, l = 1, h = a^6, q_a^6 <= c X^2/M) and upper bound (count of a; sum over S-units l converges) are correct.
   Exponent arithmetic: P > max(M, 2M - N) iff N > 7M/8; P > max(M, N, 2N - M) iff M/2 < N < 11M/10. Correct.
6. **Corollary B.** Parseval over the group of classes of primary c mod f_0 is valid (each ideal prime to 3 has one
   primary generator; the only primary unit is 1, so every character of that group is a ray-class character).
   Since w <= 1 on q_m <= C M, the sharp-cut sum of (5.36) dominates the smoothed sum. Correct relative to Theorem A.

## Numerical checks rerun with different cases

* **Lemma 2 with d != 1** (the lane's `check1.py` skips every pair sharing a prime). 40 random triples
  (d, c_1, c_1') with q <= 60 each, shifted Gaussian, M in {3, 10, 40}: worst abs(lhs - rhs) = 4.9e-15.
* **Lemma 3 with d != 1 and a != 1** (the lane's `check4.py` tests d = 1 and h in U_S only). 3466 triples with
  c_1, c_1' in one class mod 72, q_d <= 100, h = unit lambda^i 2^j d^5 a^6 (a = 1, five primes, one product of two
  primes): 1,081,322 non-vanishing phases, all equal to 1; 183,026 vanish exactly when a meets c_1 c_1'. With
  classes mod 36: 381,916 of 1,102,096 differ from 1. Modulus 72 confirmed, 36 refuted, as stated.
* **The object of Theorem A itself** (not computed in the lane: `check2.py` uses rows over all classes, that is a
  single nu). Rows restricted to one class mod 72, summed over the classes (the family average of Corollary B),
  M = X = Z, Gaussian row weight, V = bump; P_fam summed over same-class coprime pairs and h = unit lambda^i 2^j a^6:

  | Z | classes | D | N_fam - D (liou) | P_fam | Rem_fam | Rem/P | P_fam/Z^(7/6) | N_fam - D (weight 1) | N_fam - D (iid signs) |
  |---|---|---|---|---|---|---|---|---|---|
  | 2^10 | 270 | 213.57 | +3.05 | 5.15 | -2.10 | -0.41 | 0.0016 | -0.70 | +0.02 |
  | 2^11 | 409 | 427.95 | +12.89 | 21.87 | -8.99 | -0.41 | 0.0030 | +0.01 | -0.49 |
  | 2^12 | 430 | 856.22 | +27.13 | 59.47 | -32.34 | -0.54 | 0.0036 | +0.58 | +0.68 |
  | 2^13 | 432 | 1711.75 | +94.24 | 136.81 | -42.57 | -0.31 | 0.0037 | -5.27 | +7.36 |
  | 2^14 | 432 | 3420.96 | +219.73 | 346.78 | -127.05 | -0.37 | 0.0042 | -7.99 | +3.82 |

  Every same-class term has phase exactly 1 (max abs(phase - 1) = 7e-16 over all non-vanishing terms at 2^10 to
  2^12, including the frequencies with a of norm 7). The unrestricted N reproduces the lane's table to all printed
  digits (245.119, 1035.476, 2147.677, 4477.120). Controls: weight 1 and iid signs show no excess
  (abs(N_fam - D)/D <= 0.0043).

## Errors and corrections

1. **The measured numbers in the claim are not for the object of the theorem.** "P = 0.019 Z^(7/6),
   R about -0.0033 Z ln Z" refer to unrestricted rows (one character, G nu = 1), for which termwise positivity is
   not proved and for which Theorem A makes no statement. For the family average of Corollary B the referee
   measures P_fam = 0.0042 Z^(7/6) at 2^14 (coefficient still rising) and Rem_fam = -0.31 to -0.54 times P_fam,
   with no downward trend over 2^10 .. 2^14. The excess over the diagonal is 6.4 percent at 2^14. The same-class
   pairs are 0.2 percent of the pairs and carry 22 percent of the unrestricted P, so the unrestricted P is not
   a multiple of the class-restricted one. Section 5 should state which object each number belongs to.
2. **The data do not test Rem << Z^(1+eps).** On 2^12 .. 2^14 abs(Rem_fam) grows by a factor 3.9 (exponent 0.99)
   and P_fam by 5.8 (exponent 1.27), compatible with the theorem; on 2^10 .. 2^14 abs(Rem_fam) has fitted exponent
   1.48, a pre-asymptotic effect of class filling. A remainder proportional to P is not excluded numerically
   (the lane says this for its own data; it is equally true for the family object). The 7/6 conclusion therefore
   rests entirely on the unwritten contour argument and on (H2).
3. **"In the notation of Lemma 5.8 (O = 0)" is not established.** Theorem A sums over all rows m. Summing (5.36)
   over the O-dyads gives Z^(max(M, 2M - N) + eps) (the exponent is max(M, 2M - N) - O/2), so the comparison with
   the full row sum is valid and some O-dyad of the Liouville analogue is violated; that it is the dyad O = 0 is
   not shown.
4. **The remainder of Theorem A is ARGUED, and (H2) is RECALLED in a form stronger than the cited source.**
   Referee's replay of the contour step: with V and Wt in Mellin form, Re z = 1 + eps for the h-sum and
   Re(t - z) = -1/2 + eps, the bound comes out as X^(1+4 eps) M^(-eps), consistent with the stated
   M + X + X^2/M. Not confirmed line by line: (a) (H2) for all non-sixth-power h, which includes quadratic and
   cubic twists and non-squarefree h; the reduction "the factor from h_2 .. h_5 is put into the coefficients" is a
   sketch (the character depends jointly on n and h_j; it works for frozen h_2 .. h_5 with a sum over them, and
   the count closes by the referee's estimate, but this is not written); (b) the dependence of psi on d jointly
   with h (the second moment is over g = h d with multiplicity); (c) polynomial growth in the vertical variable
   against the decay of the Mellin transforms. No obstruction was found; none of this is a proof. Label
   "PROVED-rel (H2)" in the verdict line of item 2 should read "ARGUED-rel (H2)".
5. **Unlabelled statement in the control table.** "A zero of zeta_F at real part beta would give P_one of order
   Z^(2 beta - 5/6): ... the same statement as beta <= 11/12 in this quadratic form" has no proof here: P_one is a
   Hermitian form of indefinite sign, a complex zero gives an oscillating class Mertens sum, and the remainder for
   weight 1 needs bounds for 1/L (input T1). It must carry the label HEURISTIC. It is not used anywhere.
6. **"(N) is sharp", "exactly the amount Proposition D requires"** are equalities of exponents between a
   conditional upper and lower bound here and condition (N) of `c5-thin-walk-replay` (stated there for THIN class
   rows relative to the high comparison). Correct as arithmetic (2b - 5/6 = 7/6 at b = 1); "sharp" holds only
   relative to (H2) and the argued remainder.
7. **Full completed row.** The Minkowski step is valid in outline (the n-th piece has norm <= q_n^(-3/2) P(Z)^(1/2)
   plus a diagonal part whose sum over n is Z^(1/2) log Z), but the constant C_0 is not computed and
   sum_{n != 1} q_n^(-3/2) is about 0.3 for S = {2, lambda}; the statement is established only for P_0 large,
   relative to Theorem A. The result says this.
8. Lemma 1' for the probe ((7.13), Lemma 2 of c6), the Kubota-Patterson reading, and all of section 6 after
   Theorem C (THIN, T1, T2) were not verified and carry no weight in the verdict. The Kubota-Patterson pole gives
   X^(1/6) per row and X^(1/3) in mean square, consistent with P; the mean square of sextic theta residues is
   classical theory, and the result does not present it as new.

## Controls

The result claims no zeta-only mechanism, so no control has to fail. The referee ran weight 1 and iid signs on the
family object: no excess (table above). The lane's own non-multiplicative control (nm50) shows the principal term
is present without multiplicativity; the referee agrees that R1 is not carried by this object.

## Surviving claim

PROVED: Lemma 1, Lemma 1', the pair formula (Lemma 2, all d), the class-phase lemma (modulus 72 in the
conventions of `lib7.py`), and for Liouville rows restricted to one class mod f_0 the decomposition
N = D + P + Rem with D >= 0 and P a sum of non-negative terms, M^(5/6) X^(1/3)/log << P << M^(5/6) X^(1/3).
ARGUED relative to a recalled second-moment bound for sextic Hecke L-functions: Rem << (MX)^eps (M + X + X^2/M),
hence the family-average Liouville analogue of the row bound (5.36), summed over all rows, fails by Z^(1/6) at
M = X = Z for the squarefree part of the row. MEASURED to Z = 2^14 on the family object: excess 6.4 percent of the
diagonal, P_fam = 0.0042 Z^(7/6), Rem_fam = -0.37 P_fam; the data do not decide the exponent. THIN: open. No
statement about zeros of zeta or of any L-function.
