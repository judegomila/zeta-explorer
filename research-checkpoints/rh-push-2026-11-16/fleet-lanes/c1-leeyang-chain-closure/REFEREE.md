# REFEREE: c1-leeyang-chain-closure (adversarial, lens: general)

Date: 2026-11-17. Target: RESULT.md in this directory. Claimed verdict: partial-result.
Referee verdict: **the PROVED steps hold; verdict partial-result stands, with the corrections in section 3.** Nothing in the result is a statement about zeros of zeta, nothing assumes RH, no verified-height input is used. Referee flags: R1 false, R2 false, R3 false, R4 false (the result claimed R1 true at stage level; see section 4).

Referee checks were run through `scripts/memcap.sh 8` with the `.venv-arb` Python, local, under 100 MB; the scripts were kept outside the lane directory (scratch, not archived) because the referee writes only this file; outputs are quoted below.

## 1. Re-derivation of the PROVED steps

| Step | Result of the re-derivation |
|---|---|
| 2.1 (a) Hurwitz on the strip | Confirmed. Integrand bound C e^(-d\|u\|) uniform in t <= 0; limit H_0 not identically 0. |
| 2.1 (b) Lemma M | Confirmed. y^2 = (\|w\| - Re w)/2 for z = sqrt w; type <= tau; Lindelof + positive zeros gives sum 1/w_k < infinity; genus-0 product has minimal type; h(theta)+h(theta+pi) >= 0 forces h_pi = 0; hence 0 <= a <= tau. The lower bound a >= 0 uses boundedness of G on the real axis (y = 0), which holds. |
| 2.1 (c) monotonicity for t < 0 | Confirmed, and by a second route that does not need the condition 4 a lambda < 1: multiplication of the kernel by (1 + lambda u^2/n)^n is the operator (1 - (lambda/n) D^2)^n = prod (1 -+ c D), each factor preserves the Laguerre-Polya class (Hermite-Poulain: f - c f' = -c e^(z/c) (e^(-z/c) f)'), and (1 + lambda u^2/n)^n <= e^(lambda u^2) gives dominated convergence for lambda < \|t0\|; Hurwitz closes. So weakest step 1 of the result is not a gap: 6(d') holds for all t < 0 as stated. |
| 2.1 zero certificates | Method (minimum modulus on a circle covered by boxes) is valid; box padding covers the arc. Independent check in section 2. |
| 2.2 Prop 7(b) restricted | Confirmed: H_t[T rho] = H_(t+beta/2)[Psi]; de Bruijn applies to Psi (b > 2). (iii) is conditional on RH and labelled so. |
| 2.3 Curie-Weiss | Confirmed by hand: a_p = (l_p^2/(2L) + l_p/2 - l_p^2/(2L))/l_p = 1/2. |
| 3.2 Lemma 1, n = 2, 3, 4 | Confirmed by hand. n = 3: c = a1 + a2 + a1 a2 from the three single-flip configurations; inverse (c/3, 2c/(3+c)) reproduces c. n = 4: c_1 = (a+c)(1+b), c_2 = 2(b + ac(1+b)) recounted from the 4 + 6 configurations; both inverse branches checked; LY_4 inequalities re-derived from x^2 + c_1 x + c_2 - 2 on [-2,2]. The Szego identity for n = 3 was expanded by hand and agrees. For general n it is only an exact check (n <= 7), not a proof; it is not used beyond that. |
| 3.3 Theorem B | Confirmed (multi-affine function on a cube = mixture of vertex values; vertex value = product over rigid clusters). Corollary (i): integrality of Lambda_C follows because all terms are positive and the law sits on n + 2Z; confirmed. The top atom is at sum lambda_i with positive mass, so "degree n" fixes the total weight. |
| 3.4 n = 5 | Confirmed by hand: all seven partition products recomputed; LY_5 inequalities re-derived (d_1 = c_1 - 1, d_2 = c_2 - c_1 + 1); P_0 and P_1 expanded by hand; separator values on the generators: (5c_2 - 9c_1 - 5c_0) = -5, -14, 0, -18, -4, -12, 0; (c_2 - c_1 + c_0) = 1, 0, 2, 0, 2, 2, 6. |
| 4.1 (a),(b) | GHS along a nonnegative direction: third derivative = sum lambda_i lambda_j lambda_k u_3(i,j,k) <= 0; Vitali step correct. |
| 4.1 (c) centre coefficient | binom(44,21) = (22/23) binom(44,22) gives equality at k = 23; confirmed. |
| 4.1 (d) | (log(1+h^2) + h^2/2)''' = 4h(h^2 - 3)/(1+h^2)^3 re-derived by hand. |

## 2. Numeric checks rerun with different cases

1. Cone separators, own code (Fractions, own partition enumeration): n = 5 (both), 6, 7, 8, 9: generator counts 7, 11, 15, 22, 30; max y.g = 0 in every case; y.P = 5/4, -2/3 (sign convention reversed), 4/3, 5, 16/9, 3; all listed polynomials have nonnegative coefficients (minimum 0, 0, 0, 0, 2/9, 1/6). Agrees with the table.
2. GHS certificate, different cases (exact rationals): m = 44, w = 108/55: +0.03791 (agrees). New: m = 60 (c = 30/31), w = 9/5: +1.1885; w = 7/4: +1.1170; m = 52, w = 19/10: +0.5433; m = 46, w = 15/8: +0.0931; minimum coefficient 0 in each. m = 43 at w = 108/55: -0.0225. Exact maximum over the rational grid w = 1.01..4.97 (step 0.04): negative for m = 38..43, positive for m = 44, 45, 46. Sanity: 300 random 6-spin ferromagnets with weights in {0, 1/2, 1, 2}: max third cumulant -0.029 (GHS sign).
3. Zero certificates, different zeros and a different method (winding number of g_N on a square, python-flint balls, 1600 boxes, half-plane tracking): N = 3 at 2.56172 + 8.02089i and at 1.40317 + 31.80034i; N = 4 (not in the result) at 1.73631 + 6.69877i; N = 10 at 1.56866 + 9.95813i; N = 2 at the lane's zero with half-side 0.01: winding number 1 in all five. So N = 4 can be added to the table.
4. Controls rerun (float64, the lane's `stage_lib.zeros_box`, different cases):
   - T-NR coupled, q = 29, c = 2.5: 165/165 on the line for T = 40 (agrees); 495/495 for T = 120; q = 31, c = 2.5, T = 60: 249/249 on the line; q = 29, c = 2.5 with the prime 31 added to the stage, T = 60: 281/281 on the line. So the pass is not a window or parameter accident at this stage size.
   - T-NR coupled, q = 29, c = 3.0, T = 60: 4 of 248 off (max dev 0.0818); q = 5, c = 2.5: 16 of 199 off (max dev 0.1255).
   - DH with 7 primes {2,3,7,11,13,17,19}: 91 of 91 off the line; single character: 92 of 92 on it.
   The claim "T-NR fails uncoupled, passes heat-coupled at q = 29, c = 2.5" is confirmed, and R3 false is confirmed. The parameter check D^2 = 0.090, 1/L_q = 0.0385 and the predicted abscissae arccosh(1.25)/log q (= 1 for q = 2, 0.205847 for q = 29) are correct.

## 3. Errors and corrections

1. (Wording, section 0 item 4 and section 7 item 4.) "The target 'Phi is in cl(L)' is strictly stronger than RH" is not established as a statement about Phi. What is proved is a strict inclusion of classes: cl(L) is a proper subset of the Lee-Yang class. For the single law Phi the implication "Phi in cl(L) => RH" is proved; that the converse fails is not (the one separating condition found, GHS, holds for Phi). Correct wording: "membership in cl(L) implies RH and is a priori a stronger property; the known extra necessary condition holds for Phi".
2. (Flag.) R1 = true is not supported by this result. The new statements (Lemma 1, Theorem B, n = 5..9 separators, Theorem C) contain no primes, as section 6 says itself. The stage-level evidence is inherited from the parent Thm 3, and Beurling systems pass the same theorem, so ordinary multiplicativity is not shown essential. Referee flag: false.
3. (Scope of the limit statement.) Theorem C is stated for the closure with uniformly bounded exponential moments. This restriction can be removed: Lee-Yang laws satisfy E S^4 <= 3 (E S^2)^2 and the Gaussian bound E e^(hS) <= e^(h^2 E S^2/2) (Newman, CLASSICAL), so a weakly convergent sequence in L has bounded variance (Paley-Zygmund) and then uniform exponential moments. Not an error; the result is slightly stronger than stated. Not written in the result.
4. (Label.) "GHS holds for DH" rests on a one-variable third-derivative scan of the completed DH function on sigma in (0.5, 30.5] plus two points in the parent lane (`ap-leeyang-structural` section 4.3). It is MEASURED on that grid only and should carry that range wherever quoted. The consequence drawn (no separation of zeta from DH by GHS) is therefore measured, not proved.
5. (Novelty.) Theorem B is the Fortuin-Kasteleyn / Edwards-Sokal representation (stated). The continuous example x^2 e^(-x^2/2) has V' = x - 2/x concave on x > 0; failure of GHS for such single-site laws is the content of the Ellis-Newman necessary-and-sufficient condition, so "Lee-Yang does not imply GHS" is very likely in the literature and must not be presented as new. The exact lattice member (degree 46) and the fixed-degree separators n = 5..9 were not found by the referee in a source, but no literature search was run; treat as "not known to be new".
6. (Minor.) "In the family used here the first violation is at m = 44" is a scan statement (float in the lane; exact on a rational grid here), not a proof that no h > 0 gives a violation for m <= 43.
7. (Minor.) All stage counts are float64 Newton searches compared with a frequency-span estimate, not argument-principle counts (stated in weakest step 3). The 2.1 table can add N = 4.
8. The MEASURED items (description of F_5, C_5 = F_5, P_0 in or out of cl(L)) are labelled correctly and are not used in any PROVED step.

No PROVED step failed. No step assumes RH; 2.2(iii) is explicitly conditional. No verified-height input. No bound on Lambda or on zeros is claimed.

## 4. Requirement flags (referee)

- R1: false. The decided lemma is prime-free; the stage theorem is the parent's, and Beurling/U pass it.
- R2: false. Stage statements model one window; nothing height-uniform about zeta.
- R3: false. U, sign twists, Beurling pass every stage; T-NR passes heat-coupled at q = 29 and 31, c = 2.5 (rerun, T up to 120); GHS and K_n do not separate DH (measured) or backward heat.
- R4: false. Not attempted.

## 5. What survives

(1) For n = 2, 3, 4 the chain set, the complete-graph set and the Lee-Yang set coincide (proved). (2) For n = 5..9 explicit Lee-Yang polynomials with nonnegative coefficients lie outside the Fortuin-Kasteleyn cone K_n, hence are not laws of any zero-field pair ferromagnet of total weight n, hidden spins allowed (proved, exact). (3) GHS holds on the weak closure of pair-ferromagnet laws and fails for (w^2 - (44/23)w + 1)(w+1)^44 at w = 108/55 (exact), so that closure is a proper subclass of the Lee-Yang class. (4) Thm 6(d') holds for all t <= 0 for Dirichlet stages N = 2, 3, 4, 5, 10 (certified off-line zeros in the strip). (5) Prop 7(b) restricted and the Curie-Weiss correction hold. (6) T-NR passes the heat-coupled stage at q = 29, c = 2.5. None of this gives information on zeros of zeta.
