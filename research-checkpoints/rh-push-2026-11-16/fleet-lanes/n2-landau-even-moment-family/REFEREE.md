# REFEREE: n2-landau-even-moment-family

Date 2026-11-17. Adversarial referee (general). Claimed verdict: precise-obstruction. No statement about zeros is claimed, and none is established.

Referee verdict: **the obstruction verdict holds.** L1, L2, L3 and Lemma P re-derive correctly. Five corrections are required (one false error term, one degenerate control, three overstatements). None changes the verdict. Lead strength: low (unchanged).

## 1. Re-derivation of the PROVED steps

**L1. Confirmed.** Non-negativity of each term gives E_d(x)^{2k} <= C x^{a+k+eta} for d <= x^a, so abs(E_d(x)) <= C^{1/2k} x^{theta}, theta = 1/2 + (a+eta)/(2k). The Mellin identity -L'/L = s int psi x^{-s-1} dx with the split at x_1 gives the displayed bound; I recomputed both integrals. The right side converges absolutely for sigma > theta, so it continues L'/L (+ s/(s-1) for d = 1) analytically there. Remarks, not errors: (a) for d = 1 the bounded object is the odd part, zeta'/zeta + log 2/(2^s - 1) + s/(s-1), not zeta'/zeta itself; the 2-factor has its poles on Re s = 0, so the zero-free conclusion is unaffected; (b) for d = 3 mod 4 the character (d/.) has conductor 4d; (c) the statement is vacuous unless a + eta < k.

**L2. Confirmed.** (i) Hoelder exponent recomputed: q(-sigma - 1 + (u+1)/2k) = -q(sigma - u/2k) - 1, giving the stated constant. (ii) uses the classical E_d(x) << x^{Theta_d} log^2(dx). (iii) c_d(u) bound and the abscissa 1 + (2k-u)/a recomputed; Landau's theorem applies as stated. The Heath-Brown input needs the usual reduction from squarefree n to general n for the coefficients Lambda^{*k}; not written, standard.

**L3. Confirmed.** Exponent arithmetic a + k + 2ke -> 1/2 + e + a/(2k) is right. The equivalence with GRH for the family holds with C depending on k and with the family as defined (positive odd squarefree d only).

**Lemma P. Confirmed.** Poisson on each residue class, tau_0, the squarefree Gauss-sum value, and the h/-h combination were recomputed for both residue classes of m mod 4 (m = 1: 2C (h/m); m = 3: 2S (h/m)).

**MV-CAP paragraph.** The lower bound Delta >= cN by the witness a_n = chi_{d0}(n) is correct. The last sentence ("the same witness exists exactly when a member has an off-line zero") is not proved in the text and should be labelled ARGUED.

## 2. Numerical re-run (different case)

Script /tmp/n2ref/chk.py, pure Python, run through `scripts/memcap.sh 8`, < 100 MB, seconds.

Gap found in the author's check: the weight was the even Gaussian. For an even weight S = 0 and every m = 3 mod 4 gives 0 = 0. Four of the seven Lemma-P cases (m = 15, 1155, 147, 143) are 0 = 0, and the sine branch, eps_m = i, and the chi_{-h} term were never exercised. The k = 1 check used the tau-form only, not the reciprocity (character) form that the argument uses.

Re-run with the non-even weight w(t) = exp(-pi (t - 0.37)^2):
- Lemma P, 10 moduli (both classes mod 4; squarefree and not; m up to 385): primal vs tau-dual error <= 1.8e-14; primal vs character form (h >= 1, chi_h(C+S) + chi_{-h}(C-S)) error <= 2.7e-15 on the 7 squarefree moduli. All values non-zero (0.088 to 7.31).
- D1 in the character form, (x, X) = (50, 4), (70, 9), (70, 40), three coefficient sets (log p; random signs times log p; Gaussian reals): abs(M - D - OD) <= 5.5e-12 in all nine runs. Coefficient-blindness (item 4) confirmed.

## 3. Errors and required corrections

**E1 (false error term, Proposition D1).** "D_1 = w^(0) X sum_p (1 - 1/p) log^2 p + O(X^{-A})" is wrong when primes p >~ X occur, which is the whole range of interest for k = 1 (a < 1). sum over p | d of w(d/X) equals (X/p) w^(0) + O((X/p)^{-A}) only when X/p is large; for p > X it is about w(0). Measured D_exact - D_asym: -58.8 of 418.9 at (x, X) = (50, 4); -70.4 of 1597 at (70, 9); +3.3 of 7414 at (70, 40). The correct statement keeps the exact inner sum, or an error O(x) when a <= 1. The author's 1e-11 check used the exact D, so the identity M = D + OD is not affected. The same caveat applies to D_2.

**E2 (degenerate control, section 4 row 3 and section 3).** The measured twist eps = chi_21 is not a prime side without a functional equation. eps chi_d = chi_{21 d}: every member of the twisted family is again a quadratic Dirichlet character with Euler product and functional equation, and the member d = 21 is principal. The measured increase x^2/#d is the pole of that one member, which the definition of E_d subtracts only for d = 1. It is a normalisation artefact, the same phenomenon as omitting "- x" in E_1. It therefore does not support the row's inference "a proof of H(a,k) must use the functional equation of each member". What it does show (correctly) is that a single member with psi of size x moves the 2k-th moment by x^{k-a}, i.e. item 5's size count. The second variant in that row (eps with sum eps(p) log p of size x^{theta_0}) is the valid control and follows from L1 applied to d = 1; it was not measured, and should be labelled PROVED-by-L1 rather than MEASURED.

**E3 (overstatement in the headline).** "Exact involution mapping M(X) to (X/x^k) times a signed 2k-th power sum over the same family" is exact only in the tau-form, for the family of all integers d with a smooth weight, and was verified for k = 1 with distinct primes. The power-sum form is the ARGUED Mellin step. The dual family is all chi_{+-h}, h >= 1, including even h, negative discriminants and imprimitive characters; the primal family in L1-L3 is positive odd squarefree d. In the all-integers family the classes d = d_0 j^2 are present with multiplicity and the squares alone contribute x^{2k} sqrt X, which exceeds the target X x^k for every a < 2k; the squarefree sieve is therefore not a detail for any quantitative use. For the obstruction it is not needed.

**E4 (wording, item 5).** abs(OD) <= X H x^{eps} = x^{2k+eps} is not the trivial bound for M (that is X x^{2k}); it is the Heath-Brown large-sieve size at a <= k, which is trivial per member. The conclusion (output = input) is unchanged.

**E5 (L1 constant).** The explicit bound uses abs(E_d) <= 1.04 x, valid for Dirichlet characters only. The DH row's "transfer holds" is true for the implication but not with those constants (see section 4).

## 4. Controls run by the referee

**Davenport-Heilbronn** (/tmp/n2ref/dh.py, memcap 8, < 100 MB, N = 4e5; coefficients of -f'/f by the convolution recursion, period-5 coefficients 1, xi, -xi, -1, 0 with xi = 0.28408):
- Lambda_DH(n) != 0 at 5502 non-prime-power n <= 20000. Confirms "not supported on prime powers".
- sum over n <= x of abs(Lambda_DH(n)): local exponent 1.12 between 2e5 and 4e5, in agreement with the map value sigma* = 1.1203625.
- sum over n <= x of Lambda_DH(n)^2: local exponent 1.38, 1.46, 1.48, 1.51, 1.57, 1.59 on successive ranges up to 4e5, above 2 sigma* - 1 = 1.2407. Consistent with the row's failing step (coefficient size at the diagonal). The row's arithmetic a < k(2 sigma* - 1) = 1.2407 k is correct given L1.
- The partial sums sum Lambda_DH(n) stay below 0.01 x on this range, so the Omega-statement itself is not visible at x <= 4e5; the failure is seen in the second moment of the coefficients, not in E_1. Whether the d-twists of DH keep a functional equation was not examined by either party; the lane does not use it.

**Sign twist.** Random signs and arbitrary real coefficients pass Lemma P and D1 identically (section 2). The duality is coefficient-blind as claimed.

**Backward heat, T-NR.** Not run by the author and not run here: the lane has no kernel-side object, and it claims no zeta-only mechanism, so no claim depends on these controls. The control table should say "not applicable" rather than "not run".

## 5. Other checks

- RH assumed: no. GRH appears only as the stated converse in L3 and in the size count of item 5.
- Verified height: not used.
- Novelty: none claimed and none present. L1-L2 are Landau's method; Lemma P is the standard Poisson step for the quadratic family (Heath-Brown 1995, Soundararajan 2000 Lemma 2.6); sharpness of the large sieve at Delta >= cN is standard. The function-field paragraph is recalled, not checked; I did not check it either.
- "PROVED for the list of terms" (item 3): the list (h = 0; h a square) is right for squarefree m. For m with one repeated prime r the factor tau_h(r^2) is a Ramanujan sum supported on r | h; the text handles this on the primal side (r not dividing d), which is correct, but the k = 2 bookkeeping remains ARGUED as the author states.

## 6. Surviving claim

L1-L3 (transfer from an even-moment family bound to a zero-free half-plane for every member, with H(a,k) for all k equivalent to GRH for the positive odd squarefree quadratic family and zeta) and Lemma P are correct and classical. The Poisson duality in d is exact in the tau-form, holds for arbitrary coefficients (checked with a non-even weight, both classes mod 4, three coefficient sets), has fixed point a = k, and supplies no term specific to Lambda. For a < k the missing bound is the hypothesis itself. No route.
