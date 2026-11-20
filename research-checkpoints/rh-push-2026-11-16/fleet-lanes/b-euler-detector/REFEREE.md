# REFEREE: b-euler-detector (adversarial pass, 2026-11-16)

Verdict under review: precise-obstruction. **Outcome: holds, with corrections.** Every PROVED step was re-derived and
confirmed; the exact computations were reproduced with independent code; the measured numbers reproduce. No step
assumes RH in a load-bearing way, no bound is moved, nothing restates verified height. Six defects, none fatal, are
listed in section 3. The obstruction is real but narrower and more classical than the headline wording suggests
(section 4).

Referee scripts are in `/tmp/ref-bed/` (scratch, not part of the deliverable). Python: the existing
`push/b-volterra-norm/venv` (python-flint 0.9, mpmath, numpy, scipy). All runs local, single process.

## 1. PROVED steps: re-derivation

**Lemma A. Confirmed.** E_p gives sum_i c_i (a_i(p^j) - A_j) a_i(m) = 0 on m prime to p; (LI_p) kills each coefficient;
converse is direct. (LI_p) holds for Dirichlet characters mod q (each class prime to q contains integers prime to p)
and for distinct eigenforms (strong multiplicity one gives distinct characters of the Hecke algebra away from p, and
the T_m with (m,p)=1 span that algebra). The equivalence of E_p with "c(n) = 0 on mixed n" and with F = F_p G_p is
correct.

**Corollary A1 / the (1/2,1) gap. Confirmed, with a scope gap that I closed.** The text proves it for prime q only
while the Gap bullet is stated for every degree-1 FE function. For general q, Kaczorowski-Perelli gives
F = sum_chi P_chi(s) L(s, chi*), and running Lemma A on the coefficients a_F(d n), d | q^infinity, (n, pq) = 1, gives
b_chi(d) (chi(p)^j - A_j) = 0 for every d, so the supported characters still share chi(p). Euler density is then 1
(one character) or at most 1/2. The statement is therefore true in general; the write-up should say the general-q
proof is not in the text. Also: for even parity V_q^+ must contain zeta(s)(1 + omega sqrt(q) q^{-s}), not
L(s, chi_0); the span as written omits it. No conclusion changes.

**Fibre count.** [G : <S,-1>] is right. "m - 2 free real parameters" and "DH is unique" are right only with the root
number fixed: FE forces c_chi onto a real line, and over all unit omega the q = 5 odd space has a circle of normalised
members. The text does say "with the root number fixed"; the phrase "unique function of its kind" should carry it.

**Theorem B. Confirmed as CLASSICAL.** Saias-Weingartner applies: a combination of two or more distinct characters mod
prime q is not P(s) L(s, chi') (compare prime coefficients and use independence of characters on residue classes).

**Theorem C (right edge). Confirmed.**
* Geometry: real u is exactly the preimage of |w| = 1, so the image of |u| = r is orthogonal to the unit circle; centre
  and radius as stated. Checked numerically on 5 random (phi, r): circle deviation < 2e-14, extreme arguments equal
  beta +- gamma to 1e-15, modulus at the extremes 1.000000.
* Necessity, existence of the max (T != 0 mod 2 pi because c + conj c = 1; Gamma -> infinity as sigma -> 1+ for
  complex chi), equality at the max, the extremal twist z*_p = -sgn(sin phi_p), Kronecker + Hurwitz: all correct.
* DH non-attainment: needs (2^{-it}, 3^{-it}) = (-1, 1) or (1, -1); both force log 2 / log 3 rational. Correct.
* New cases (B != 0, not in the author's checks): four truncated models with generic phases, formula against a
  brute-force constrained maximisation over the torus:
  0.955179094 / 0.955179095; 1.354965094 / 1.354965097; 0.216090765 / 0.216090767; 0.322225722 / 0.322225723.
* Real twin, new case: q = 13, Conrey 2, omega = -1 (order 12, B != 0), predicted edge 1.6173. Argument principle to
  height 2000.3: 9 zeros right of 1.45, 0 right of 1.63, min |F| on Re s = 1.63 is 0.158.

**Proposition D.** Sketch is sound (B = O(sum_{p>P} p^{-2 sigma}) -> 0; the PNT-in-APs error is uniform at
(sigma - 1) log P fixed). E_1(0.0441) = 2.588 and E_1(0.505) = 0.554 check.

## 2. Reruns

| Item | Author | Referee (independent code) |
|---|---|---|
| Prime conductors 5..4e6 | 283,144 | 283,144 |
| Not collapsed after r = 1,2,3,4,5,6,8,10,12 primes | 0.4387 ... 0.00001 | identical to 4 digits |
| Mean (m_r - 1), r = 1..3 | 7.53, 0.501, 0.134 | 7.5319, 0.5015, 0.1341 |
| Worst conductor | q = 3,818,929, prime 47, 15 primes | same |
| Max P_0 / log^2 q | 0.233 at q = 241 | 0.23269 at q = 241 (P_0 = 7) |
| Max collapse prime by decade | 5, 7, 17, 29, 37, 47 | same |
| T_2 charpoly on S_k, even k <= 600 | 294 weights irreducible | 294 irreducible, different basis (Delta^j E_4^a E_6^b with maximal b), k = 24 gives x^2 - 1080x - 20468736 |
| Census q = 11, m = 2, T = 600.3 (finer grid, own contour) | N = 569; on-line 561 / 319; N(>0.75) 0 / 118; N(>1) 0 / 100 | identical |
| Weil form, asymmetric complex step function, a = 0.6, primes 2 and 3 active | (author validated only on the indicator) | form 4.264354; 1500 zeros + tail 4.264310 |
| Class radius, n = 450 | 0.7228 | lambda_min +1.2e-3 at 0.7215, -3.3e-3 at 0.7240 |
| Radius with primes deleted, n = 450 | 0.7434 | +1.1e-3 at 0.7425, -1.7e-3 at 0.7445 |
| c(2) window at ln 3 | [0.99905, 1.00100] (n = 400) | [0.99934, 1.00081] (n = 500), [0.99792, 1.00147] (n = 250) |
| kappa, T(DH) | 0.2840790438, 2.5880182947 | same, from the Gauss sum |

Interval rigor: the two EXACT items are integer/rational arithmetic with flint's proved factorisation, so they are
sound. Nothing else is claimed as certified, and no float comparison decides a sign in a PROVED step. The Weil
negativity statements are Rayleigh-Ritz in float with margins 1e-3, far above rounding.

## 3. Errors and defects

1. **"corr +0.06 with Euler density" is a design artifact, not evidence of no dependence.** The two root numbers of a
   pair have |T| summing to pi and equal density, so corr(|T|, density) = 0 by construction and T carries 93% of the
   variance. The controlled statistic is the pair mean: corr(pair-mean off-line share, Euler density) = **+0.34**
   (47 pairs, p = 0.019; Spearman +0.28, p = 0.055); partial correlation after removing T is +0.23 (p = 0.027). The
   qualitative conclusion survives and is slightly stronger than stated: more Euler density goes with *more* off-line
   zeros. The headline should quote +0.34 on pairs, not +0.06. The same remark applies to "sigma* vs density -0.04".
2. **sigma*(DH) digits.** "1.12036247" and "moves by 7e-9 between 1e7 and 1e8" understate the truncation error. My
   run at X = 4e7 gives 1.12036258; X = 4e6 gives 1.12036192; the author's own X = 2e6 gives 1.12036267. The spread is
   the expected prime-race fluctuation X^{1/2 - sigma} / log X divided by the slope 7.74, about 1e-7 at 1e8. Supported
   value: 1.1203625 +- 1e-7. The sixth decimal (..62 vs ..63) is not secured; 1.12036 is.
3. **Count slip.** "converged 1008 times; all 1008" should be 1208 (200+200+157+200+171+113+100+19+48, from
   `lab_dirichlet.json`). Also the q = 5, p = 11 configuration has a single fibre, so "generic members violate it by
   O(1)" is false there (residual 2e-16); 8 of 9 configurations show the violation.
4. **Zeta eigenvalues in section 7 are not converged and "as it must be" is not a theorem here.** lambda_min at
   2a = ln 3 is 1.2e-4 (n = 250), 5.3e-5 (n = 400), 3.6e-5 (n = 500): it scales like 8/n^2, so the data only show the
   true value is below 3.6e-5 and cannot separate it from 0. Positivity of the full form (pole included) for
   ln 2 < 2a <= ln 3 is not cited to any proof; the remark presumes it. The table should say "upper bounds, unresolved".
   The window claim is unaffected in direction (outer bound; the true window is narrower).
5. **RH-implicit cell.** Row 2 of the twin table says the zeros of zeta(s-d) zeta(s+d) lie on Re s = 1/2 +- d. That
   is RH. What is established is that zeros lie there (the checked one at 0.7 + 14.1347i). Not load-bearing.
6. **Route 30 nextStep only partly answered.** The nextStep asks for conductor 5 and conductor 1; only conductor 1
   was run, on extreme points with one active prime (valid: lambda_min is concave in the coefficients, so the minimum
   over the convex class is at |alpha| = 1). The comparison radius 0.9385 belongs to a different form, as the text
   admits. Corollary A2 also needs the converse theorem's analytic hypotheses (entire, bounded in vertical strips)
   stated.

## 4. Walls and scope

* DH control: correct throughout. DH is in the q = 5 odd space, index-2 fibre for S = {p = +-1 mod 5}, fails E_2/E_3
  with Q = 1 + kappa^2 and T_{2,2} (m_2 = -2 - kappa^2), and has zeros right of 1. Nothing here would prove a zero
  statement for DH or for an L-function.
* RH: not assumed in any PROVED or CLASSICAL step (item 5 is cosmetic). Bach's bound is quoted as conditional.
* Verified height: not used. No certificate, no bound.
* Scope of the obstruction: it is proved for finite-dimensional FE-spaces with a multiplicative eigenbasis (degree 1
  by Kaczorowski-Perelli; level 1 by Hecke; finite spans of newforms by Ramakrishnan). It says that *imposing E_p as
  constraints on a member of such a space* only selects fibres. It does not rule out arguments that use
  multiplicativity other than as membership constraints (for example through Lambda(n) >= 0 in a positivity
  argument); the text's item 4 addresses that only for degree-1 rung unitarity at one prime and support below ln 3.
  "At any stage" in the verdict should read "at any stage, in the FE-spaces examined".
* Novelty: Lemma A is elementary; Theorem B is classical; Theorem C is very likely in Bombieri-Ghosh / Righetti and
  is correctly not claimed as new. The new content is the exact collapse table, the T_2 computation to k = 600 (both
  consistent with Bach and Maeda), and the measured section 7 numbers.

## 5. Surviving claim

In a finite-dimensional FE-space with a multiplicative eigenbasis, Euler at p holds iff the supported eigenfunctions
share the local factor at p (PROVED). Hence, given Kaczorowski-Perelli, a degree-1 FE function has Euler density 1 or
at most 1/2 (any conductor), and given Ramakrishnan a finite combination of GL(2) newforms has density 1 or at most
7/8; every non-collapsed member has zeros in Re s > 1 (Saias-Weingartner, Booker-Thorne). Right-edge formula PROVED and
confirmed on new cases; sigma*(DH) = 1.1203625 +- 1e-7 (MEASURED). EXACT: all 283,144 prime conductors up to 4e6
collapse by the prime 47; T_2 is irreducible on S_k for all even k <= 600. MEASURED: on 94 twins the off-line share is
governed by the mixing phase (corr -0.97) and does not fall with Euler density (pair-level corr +0.34, p = 0.02).
MEASURED: class-uniform Weil radius 0.7228 at conductor 1 (upper bound by Rayleigh-Ritz; positivity below it not
certified); Weil positivity on tests of support below ln 3 confines c(2) to within 0.1% of ln 2 (outer bound). No RH
claim, no bound moved.
