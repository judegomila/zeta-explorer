# REFEREE (adversarial, lens: general) for c8-liou-row-bound-theorem

Date 2026-11-18. Scope: `RESULT.md` in this directory. Only this file was written. Local run only
(`scripts/memcap.sh 8`, one process, 33 s); the compute server was not used. Two external pages were opened with a
generic client: arXiv:1112.1650v1 (PDF, read as text) and the abstract page of arXiv:2109.07463.

## Verdict

**Holds as a partial result with the labels it carries (PROVED-rel Lemma S and classical reciprocity), after the
corrections in "Errors" below.** No statement about zeros is made; none is licensed. Nothing assumes RH; verified
height is not used. Requirement flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## Steps re-derived

1. **Lemma 3' (same-class phase).** Re-derived. R(a, b) = chi_b(a) conj(chi_a(b)) is a product of local Hilbert
   symbols above 6; 1 + 8 O_2 consists of squares and cubes (2 unramified, 3 a unit); at lambda (e = 2, p = 3)
   U^(n) consists of cubes for n > e p/(p-1) = 3, so 1 + lambda^4 O_lambda suffices, and lambda^4 = 9 up to a unit.
   Modulus 72 is correct. Step (ii): the Kummer character c -> (delta/c)_6 has conductor dividing
   8 lambda^4 rad(delta), which divides delta because 72 | delta; gcd(c_1, delta) = gcd(c_1, c_1') = 1, so both values are
   defined. chi(-1) is real, so the two factors chi_c1'(-1) cancel. Correct. For l in U_S the conductor of
   (l/.)_6 divides 8 lambda^4, consistent with "72 is needed for chi_c(l)".
2. **Lemma 3.** hd = l b^6 with d squarefree forces v_p(h) = 5 mod 6 at p | d, so d | h, r_d(h) = phi(d), b = d a.
   Correct.
3. **Decomposition and prefactor (3.1).** x_c x_c' (q_c1 q_c1')^(1/2)/q_k = 1/(q_c q_c'). Correct. D is the h = 0 part.
4. **Lower bound for P.** exponent 4 pi 0.16/3 = 0.670, exp(-0.670) = 0.512 >= 1/2. s_2 < 0.125 (recomputed:
   0.0408 + 0.0118 + 0.0055 + 0.0016 + 0.0656). (1 - 0.13 - 0.5)^2 - 0.13 = 0.0069 >= 0.006. Markov step gives
   at least (3/4 - 2 s_2) rho_1 Y. P >= c M Y, Y = (0.16 u_1^2 X^2/M)^(1/6). Correct; the margin 0.0069 is thin but
   positive.
5. **Upper bound for P.** Sum over a and l, then over d with phi(d) <= q_d and pair mass C/q_d^2: C M (T_0^(1/6)
   sum_d q_d^(-2) + log^3). Needs T_0 bounded below, that is X^2 >= c M, which is in the hypothesis. Correct.
6. **Remainder, steps 1 to 5.** Every exponent recomputed. Mellin: (pi y)^(-z) with y = 4 M q_h/(3 q_d q_c1 q_c1')
   gives q_d^(-2+z), q_h^(-z), (q_c1 q_c1')^(-1+z), M^(1-z). Moebius over e gives q_e^(-2+2z). Line shift to
   Re s = 1/2 + 2 eps puts Re x = 1/2 + eps; factor X'^(1+4 eps) after squaring. Powers: q_d: -1 + eps - 1 - 4 eps
   + 2 eps = -2 - eps; q_e: -1. Change of variable g = hd: q_h^(-1-eps) = q_g^(-1-eps) q_d^(1+eps), so the weight left
   on d is q_d^(-1), and abs(r_d(g/d)) <= q_d gives the inner sum <= 2^(omega(g)). This is the line flagged in
   section 9.2; it is correct. Euler product (3.4): (1 + u) = (1 - u^2)/(1 - u). Correct. Non-principality for
   g not in U_S (F^x)^6: xi is ramified at the squarefree kernel of the sixth-power-free part of (g'), which is
   prime to S, while theta' is ramified only in S. Correct. A ray character mod 72 on primary elements extends
   to a Hecke character because (O/72)^x = (primary residues) x mu_6. Correct.
   Result abs(Rem) <= C_eps M^(-eps) X^(1+5 eps): confirmed relative to Lemma S.
7. **Lemma S and the source.** arXiv:1112.1650v1 was opened. Theorem 1.3, Corollary 1.4, (5.1) and Appendix II
   read as quoted in RESULT 3.3 (large sieve with M + N + (MN)^(2/3) over squarefree ideals prime to S;
   second moment << (N (1+abs(t))^(d/2))^(1+eps) over all a in I(S); chi_a(b) = (x m_E/b) with a = (x) E g^n,
   x = 1 mod c). The printed proof of Corollary 1.4 uses the character only through the approximate functional
   equation and through chi_a(b_1) inside the coefficients lambda_{b_1} of Theorem 1.3, whose coefficients are
   arbitrary. A fixed twist theta(b_1) is absorbed there. The twist insertion is routine; it is still not a
   printed statement, so "PROVED-rel" is the right label. Step (b) (from the line 1/2 to 1/2 + eps) is correct.
   The identification (g/c)_6 = theta_{lu}(c) chi_a((c)) follows from Appendix II as stated.
8. **Sharp-cut lemma 3.5.** sum_j exp(-pi 2^(j-1)) 2^(2j) = 0.173 + 0.030 + ... < 0.21; constant 1.4 is safe.
9. **Corollary B exponents.** 5m/6 + n/3 > max(m, 2m - n) iff n > 7m/8 (and n > m/2); > n iff n < 5m/4.
   Failure factors 4n/3 - 7m/6 and n/3 - m/6: correct. Depends on c7's reading of (4.7), (5.30), (5.36) (accepted
   by c7's referee; (4.7) was located in the manuscript text, G = chi_c(4) gamma_3(c), abs(G) = 1).
10. **Section 6 arithmetic.** beta' < b - 5/6 + 5 mu/12; optimum mu = (6/7)(2b - 2/3); 12b/7 - 15/14; value 9/14 at
    b = 1 and 1/2 at b = 11/12; comparison with b - 5/24 (b < 1.208) and b/2 (b > 15/17). All correct. The section
    is ARGUED and is labelled so.
11. **C_inf.** Recomputed 5.09e-3 from the listed factors.

## Numeric rerun (different case)

`dec1.py` at X = 2^11.6, M = X/3 (not in the lane's set; copy run in /tmp, python with numpy 2.5.3):
1322 squarefree c, 430 classes, 4426 ordered same-class pairs, 1,193,700 dual frequencies.

| weight | N | D | P (2.1) | P (closed) | Rem | N - D - P - Rem | Rem/P |
|---|---|---|---|---|---|---|---|
| liou | 222.142834 | 216.668018 | 13.249049 | 13.249049 | -7.774232 | -6e-13 | -0.587 |
| one | 215.530456 | | 0.046137 | 0.046137 | -1.183699 | -7e-13 | |
| rmult | 217.107120 | | -0.028723 | -0.028723 | 0.467825 | -7e-13 | |
| nm | 217.633440 | | 2.700453 | 2.700453 | -1.735031 | -7e-13 | -0.642 |
| nmph | 220.757937 | | 6.033672 | 6.033672 | -1.943753 | -7e-13 | -0.322 |

The identity N = D + P + Rem and the equality of the two evaluations of P are confirmed at this size. P > 0 for
Liouville. Controls: periodic and random multiplicative weights have abs(P_w)/P_liou = 0.003 and 0.002.

## Errors and corrections

1. **Section 7, "Observation: Rem_y/P_y is the same for liou, nm, nmph at each size (to 0.03)".** Not reproduced:
   at X = 2^11.6, M = X/3 the ratios are -0.587, -0.642, -0.322. The observation is a property of the three sizes
   listed, not a law. Remove it or state the spread.
2. **Section 7, periodic control "N - D within 0.31 percent of D".** At X = 2^11.6, M = X/3: (N - D)/D = -0.52
   percent (random multiplicative: +0.20 percent). The qualitative statement (no coherent term) stands; the
   number does not.
3. **Section 6, last paragraph ("exactly when w(p) = -1 for all p").** False as stated. For w = -chi with chi a
   fixed finite-order Hecke character, or w(p) = -q_p^(-i alpha), or w = -1 outside a finite set, the product
   prod (1 - w(p) psi(p) q_p^(-x)) is again L(x, chi psi)/L(2x, chi^2 psi^2) (times a finite product): L only in
   the numerator. The correct statement: the method closes for Liouville times a fixed Hecke character.
4. **Section 6, "(U_beta') implies L(x, xi) != 0 for Re x > beta'".** A bound for 1/L on one line does not imply
   this. What the contour shift needs is holomorphy of 1/L^S in Re x > beta' together with the bound; the
   zero-free half-plane is a hypothesis of the shift, not a consequence of (U). The conclusion "not known" is
   unaffected.
5. **Prior art not cited.** The mechanism (Gauss-sum coefficients, Poisson in the row variable, coherent dual
   frequencies at n-th powers, giving a lower bound for a large-sieve type second moment) is that of
   Dunn-Radziwill, arXiv:2109.07463, where Heath-Brown's cubic large sieve is shown sharp under GRH. The cubic
   count of the same kind is M (X^2/M)^(1/3) = (MX)^(2/3); the sextic count here is M (X^2/M)^(1/6). Theorem A
   should be described as a sextic, class-restricted, Gaussian-row analogue of that mechanism. Whether the
   unconditional status here (complete row sum, second moment from BGL) is new relative to that paper was not
   checked against its full text. The "Liouville weight" of the manuscript is the plain sequence
   conj(gamma_1(c)) on squarefree c (y = mu liou = 1); the result should say so.
6. **Corollary B, first bullet.** The cut is located in [Z, 4 Z log Z] with X = Z, which is outside the row range
   of (5.39) unless (5.39) allows row length up to 4 Z log Z. Apply Theorem A with M = Z/(4 log Z) instead: the
   cut then lies in [M, Z], S is monotone in the cut, and the failure at the cut Z is by Z^(1/6)/log^(5/6) Z.
   A repair, not an obstruction.
7. **Verdict item 1, "Decisive test passed".** The test certifies an algebraic identity and the size of P. It
   does not test the one analytic claim (abs(Rem) << X^(1+eps)): family Rem/X is 0.004 to 0.008 at 2^11 to 2^13
   and the bound's constant is not computed, so the bound is empty at every size run. RESULT says this in 1.1
   and 9.3; the headline should carry the same limit. Rem per class was not tabulated; the theorem is per class.
8. **Theorem C, "Hermitian form with non-negative kernel".** The kernel is entrywise non-negative; positive
   semidefiniteness is not claimed and not shown. Say "entrywise".

## What is not established

* Lemma S as a printed theorem (twisted form); the journal version of BGL was not read by the lane or by this
  referee.
* The asymptotic constant of P (measured). The law P_y = abs(mean)^2 P for non-constant y (measured).
* Single nu, single O-dyad, completed row, sharp cut at a prescribed point.
* Anything for THIN. Section 6 is a conditional reduction with an unknown hypothesis.

## Requirement flags (strict)

* R1 false: the coherent term is present for non-multiplicative weights; multiplicativity enters only in the
  bound for Rem.
* R2 false: no height aspect.
* R3 false: one control weight decided for a row bound of the 7/8 architecture; no control of the list is shown
  to fail for a statement about zeros, because there is none.
* R4 false: no passage to the critical line.

## Controls

The lane claims no zeta-only mechanism, so DH, backward heat and the other zero-level controls do not apply.
The weight controls of the lane were rerun at the new size (table above) and agree qualitatively.
