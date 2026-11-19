# REFEREE (independent adversarial referee, lens: general): c13-bilinear-reciprocity-height-antibridge

Date 2026-11-19. Independent pass by a separate agent. The lane author's own second pass, which previously occupied this file, is kept unchanged as the appendix at the end.

Verdict on the claimed "precise obstruction; device closed at the decisive test": **holds.** No statement about zeros of zeta or of any L-function is made. No step assumes RH or GRH (GRH appears once, in a remark after Lemma 6, not in a proof). Nothing restates verified height. Requirement flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false (same as claimed).

Errors found: four, none of which changes the verdict (section 3). One measured statement is strengthened (section 2, item 6).

## 1. Re-derivation of the PROVED steps

- **(T5).** Compared with the source text (Bettin, arXiv:1607.05595v1, Theorem `tff`, display `tffe2`, z = 0): M* and the identity are transcribed correctly, including the zeta weight q^s + q^(1-s) - 2. RELATIVE TO is the right label.
- **Kernel.** Re-derived independently: H(w, b) = Gamma(1/2 + w - b) Gamma(1/2 + w + b)/Gamma(1 + w) x (1 - cos(pi b)/sin(pi w)) (checked against the definition with X: 4.6e-31). By Gauss's formula the full series sum_j (-1)^j Q_2j(b) Gamma(w - j)/j! converges for Re w < 0 to the same Gamma quotient times (1 - cos^2(pi b)/sin^2(pi w)). So H minus the full series is exponentially small in abs(Im w), and H minus the first J + 1 terms is O(abs(w)^(-J-1)) relative to Gamma(w). This agrees with the source (`ffh`, `ffh2`). The Hankel-coefficient statement ((-1)^j Q_2j(b)/(j! 2^j) = a_j(b)) is correct by formula.
- **Lemma 1.** Matches Proposition `cfd` (`ecfd`) term by term for the upper sign, with the tail of the series and Z_+ replaced by E_J. The boundary limit eps -> 0 was not re-derived (taken from the source, as the result says). Supported numerically (section 2).
- **Proposition 3 (i), (ii).** Re-derived: eps(chi) eps(chi-bar) = 1; Lambda(s,chi) Lambda(s,chi-bar) is real on Re s = 1/2; R_0(t) = pi^(-1/2) (2 sqrt(q) cos(t log q) - 2) Z(t)^2; R_chi(t) = (q/pi)^(1/2) Z_chi(t) Z_chi(-t) under the normalisation abs(Z_chi) = abs(L). For real primitive chi the root number is 1, Z_chi is even, R_chi >= 0. Correct.
- **Proposition 3 (iv).** Correct: t -> Z_chi(t) Z_chi(-t) is real-analytic, even, positive at 0 when L(1/2, chi) != 0, and its zeros in (0, t) with multiplicity are the zeros of Z_chi in (-t, t) minus the origin. The Hadamard grouping (quadruple rho, 1 - rho-bar, rho-bar, 1 - rho of the pair function) is correct as an illustration.
- **Proposition 3 (v).** Correct (eigenvalues of a group matrix; R_chi = R_chi-bar gives a real symmetric matrix), under the unstated conditions L(1/2, chi) != 0 for the complex chi and no vanishing entry.
- **Lemma 5.** Expansion re-done: (u-bar/y + c + u y)(u/y + c + u-bar y) = (y^2 + y^-2 + c^2) + c (y + 1/y)(u + u-bar) + u^2 + u-bar^2 with u = chi(q0). On abs(y) = 1 the two factors are c + 2 Re(u y) and c + 2 Re(u-bar y), both real, both in [c - 2, c + 2]. The principal (zeta) entry is multiplied by (c + 2 cos(t log q0))^2 > 0 (case u = 1), so the full M* obeys the same five-term relation. Twin zeros at Re s = 1/2 +- arccosh(abs(c)/2)/log q0. Correct.
- **Lemma 6.** Re-derived: Lambda(s - a, chi) = eps(chi) conj(Lambda(s + a, chi)) and Lambda(s + a, chi-bar) = conj(eps(chi)) conj(Lambda(s - a, chi-bar)) on Re s = 1/2, so the pair entry is abs(Lambda(s + a, chi) Lambda(s - a, chi-bar))^2. Correct.
- **Theorem 4 (a), (b), (f).** Follow from the above. (f) is correctly limited to "this reciprocity": the source's Theorem 5 at (s = 1/2, z = it) gives D(1/2 + it, 0; a/q), and Proposition `cfd` treats only D(1/2 + b + j, 2b; .), j integer.

## 2. Numerics rerun with different cases (own routines; `scripts/memcap.sh 8`, mpmath, one process, lists below 1e4 numbers; 240 s total)

Own Estermann routine (double Hurwitz sum written separately), own closed form of H, `mp.quad` on unit intervals.

1. Lemma 1, a/q = 4/9 (both composite), b = -0.15 + 2.2i (Re b < 0, off the line), J = 5, c = -0.8, V = 240: D_0 = -0.535817878628 - 1.38186399789i, abs(E_J) = 12.90, defect 1.3e-11 (integrand at V: 1.8e-10); without the dual terms the defect is 1.35.
2. Lemma 1, a/q = 7/3 (a > q), b = 1.3i, J = 5, c = -0.7: D_0 = -0.306600770816 + 0.395035879129i, abs(E_J) = 0.516, defect 7.8e-13; without the dual terms 1.00.
3. Sign rule (iv), q = 7 (k = 1) and q = 11 (k = 3), 8 heights each in (1, 20): 16 of 16 against a direct count of sign changes of Z_chi on (-t, t). R_chi/(Z_chi(t) Z_chi(-t)) is constant in t (equal to (q/pi)^(1/2) after normalising abs(Z_chi) = abs(L)).
4. T-NR with other parameters (q = 7, q0 = 3, c = -2.6, 60 heights x 5 characters): max abs(ratio - mu mu) = 8e-20; mu mu in [0.36246, 21.1515] against [0.36, 21.16]. Twin zeros at Re s = 1/2 +- 0.6885, outside the strip for this c; the invariance does not depend on that.
5. E_a (q = 7, a = 0.25, 25 heights x 3 characters): relative difference 4e-20. DH with other moduli: q = 31, 29 (= +-1 mod 5): abs(Im)/abs(value) = 2e-19, 3e-20; q = 17, 23 (= +-2 mod 5): 0.97, 0.99. Agrees with the DH row.
6. **Theorem 4 (d) strengthened for q = 5.** At the 16 zeros of the real-character entry on (0, 40) (6.648, 9.831, 11.959, ..., 39.561; each a sign change of the real Hardy function) the pair entry R_1 takes the values 2.03, 1.78, -2.66, 5.51, 0.91, -0.90, -1.22, 1.96, 2.08, 2.94, -0.046, 2.49, 2.30, -0.97, 2.58, -3.78: 10 positive, 6 negative. At such a point R_real + 2 lambda R_1 = 2 lambda R_1. So for q = 5 and every lambda != 0 the combination (real character: weight w >= 0; pair: weight lambda) is negative at some height. This replaces "eight weights measured" by "all weights of this two-entry cone, by a finite computation" (floating point at 20 digits, not interval arithmetic). Weights involving the zeta entry or several pairs remain MEASURED/OPEN as the result says.

## 3. Errors and imprecisions (none changes the verdict)

E1. **Decay rate of the E_J integrand is misstated.** The result (Lemma 1, status paragraph) gives O(abs(v)^(-J-1)); the author's second pass derives it from "the two zeta factors contribute at most abs(v)^(1/2 - c)". Each factor zeta(1/2 + c + iv +- b) with 1/2 + c < 0 has exact order abs(v)^(-c), so the two contribute abs(v)^(-2c), and the integrand on the side v -> +infinity has order abs(v)^(-(J + 3/2 + c)). Measured (rms over short windows, v from 2000 to 32000): J = 2, c = -0.75: exponents -2.68, -2.68 (formula -2.75; the result's -3); J = 1, c = -0.95: -1.49, -1.53 (formula -1.55; the result's -2). Consequence: absolute convergence holds iff J > -1/2 - c, which is true for every J >= 1 and every admissible c, so the lemma stands; J = 0 fails as stated. The exponent in the text should be corrected.

E2. **The finite form is not new in kind.** The result says the finite-J form "is assembled here ... not in his text in this form". The source already contains a finite form with a remainder: Lemma `rtfs` (`mmmfao`) and Proposition `cfd` (`mmmfa`), with 2N terms and a remainder E_N bounded by (1 + abs(s)^(8N+4)) abs(z)^(2N+1). What is added here is only the expression of the remainder as one contour integral. The label RELATIVE TO is right; the sentence should cite `mmmfa`.

E3. **Proposition 3 (iii), index in free variables.** For real weights c_a, c-hat(chi-bar) = conj(c-hat(chi)) and the coefficient of the hyperbolic plane is 2 Re c-hat(chi). The count should read #{complex pairs: Re c-hat != 0}, not c-hat != 0; the zeta entry (sign of c-hat(chi_0) (2 sqrt(q) cos(t log q) - 2)) is omitted from that count. Proposition 3 (v) needs L(1/2, chi) != 0 and R_chi(t) != 0 stated.

E4. **Theorem 4 (c), citation.** "Selberg's method gives zeros of odd order of L(s,chi) on the line" does not by itself give a sign change of R_chi(t) = const Z_chi(t) Z_chi(-t): that needs an ordinate tau at which the total multiplicity of Z_chi at tau and at -tau is odd. The statement is the Hardy-type theorem for the degree-2 self-dual function L(s,chi) L(s,chi-bar), not opened here. For q = 5, 7 (and 11 in this pass) the two signs are established by direct evaluation, which is all the verdict needs. Theorem 4 (e) has the same imprecision ("no zero of odd order" should read "even total multiplicity at +-tau").

Smaller points. (a) Section 1, item 1: "PROVED as a reading of the proof" is ARGUED; the object is the period relation z -> -1/z of the Eichler-integral series of E(z, 1/2 + b) (the source's own description), with Whittaker index b; calling it Voronoi summation is a description, not a derived identity. (b) "Conductor q q0" in Lemma 5: the factor absorbed is y^2 = q0^(1-2s), conductor factor q0^2 for the pair; no effect. (c) T-NR at S2 "passes" means an exact formula exists as a five-term combination with five different dual moduli, not a single reciprocity; the result says so in weakest step 1.

## 4. Referee addition (supports the obstruction)

Off-line zeros of L(s,chi) come in pairs rho, 1 - rho-bar with the same ordinate. So n_chi(t) = N_chi(-t, t) mod 2, where N_chi counts all zeros in the strip with ordinate in (-t, t). The sign of R_chi(t) is therefore (-1)^(total zero count), a quantity fixed by the argument principle, the same for every function with this functional equation and real pair entry, whether or not its zeros are on the line. This is the content of "off-line zeros invisible", in a form that needs no case distinction.

## 5. Controls

Run by this referee: T-NR (new parameters), E_a, DH (four new moduli), window translate (covariance is immediate from "the law holds for all b"; not run). T-NR passes S1 and S3 with every sign unchanged; E_a satisfies positivity of every pair entry; DH pair entries are real exactly for q = +-1 mod 5. No zeta-only mechanism is claimed, and none exists in the result.

## 6. Requirement flags (strict)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Multiplicativity only names the entries; Lemma 5 shows a non-unimodular factor at one prime leaves all signs unchanged. |
| R2 | false | Identities at every height; no bound or one-sided conclusion. |
| R3 | false | T-NR and the window translate pass every step; E_a satisfies the one-sided statement; DH passes on half the moduli. |
| R4 | false | Two-sided identity; nothing passes from a finite stage or from Re s > 1 to the line. |

holds = true (verdict "precise-obstruction" confirmed; every PROVED step re-derived; corrections E1 to E4 are owed in RESULT.md).

Referee scripts and logs: `/tmp/c13-ref/ref2.py`, `lemma1.log`, `rest.log`, `dh.log` (outside the repository; not copied into the lane, which this referee may not write to beyond this file).

---

# Appendix: the lane author's second pass (unchanged text of the earlier REFEREE.md)

## REFEREE (second pass by the lane author; not an independent referee): c13-bilinear-reciprocity-height-antibridge

Date 2026-11-19. No second agent was available to this lane. This file is a second pass with routines written separately from `checks.py` (`ref_check.py`). An independent referee is owed; the points it should attack first are listed at the end.

Verdict on the claimed "precise obstruction": **holds on this pass, with the corrections below already applied to RESULT.md.** No statement about zeros of zeta is made. All four requirement flags are false.

## Re-derivations

- (T5), z = 0. Re-derived from orthogonality: for Re s > 1, sum over all chi of chi(a) L(s,chi) L(s,chi-bar) = phi(q) sum_{(mn,q)=1, n = am mod q} (mn)^-s; the principal character is replaced in M* by the weight q^s + q^(1-s) - 2 (Bettin's Lemma `ffs`: the sum over all m = an mod q, including q | m, n, equals q^-s M*). Confirmed numerically to 1e-33 (part A).
- Lemma 1. The split of H, the residues of Gamma(w - j) at w = 0..j (sign (-1)^(j-l)/(j-l)!), the two poles at w = 1/2 +- b, and the identification of the shifted integral with z^j S_j(-1/z) were re-derived. Convergence of E_J at real x: on Re w = c the factor Gamma(w)(2 pi i/x)^-w has modulus of order abs(v)^(c-1/2) for v -> +infinity and e^(-pi abs(v)) for v -> -infinity; the bracket is O(abs(w)^(-J-1)) relative to Gamma(w); the two zeta factors contribute at most abs(v)^(1/2 - c) by convexity; total abs(v)^(-J-1). Holds for J >= 1. The boundary limit of the j = 0 polar terms is taken from Bettin's proof and was not re-derived. Numerics: two cases with a different Estermann routine and adaptive quadrature, defects 2.0e-12 and 1.4e-11; the six cases of part B.
- Proposition 3 (i), (ii). Lambda(s,chi) = eps(chi) Lambda(1-s,chi-bar), eps(chi-bar) = conj(eps(chi)) (checked from tau(chi-bar) = chi(-1) conj(tau(chi))), so the product over the pair has root number 1 and Lambda(s,chi) Lambda(s,chi-bar) is real on Re s = 1/2. Z_chi-bar(t) = Z_chi(-t) with the conjugate choice of square root. Constant: R_chi = (q/pi)^(1/2) Z_chi(t) Z_chi(-t). Confirmed: ratio 1.0 to 1e-17 at 8 heights (`ref_check.log` (ii)).
- Proposition 3 (iv). Direct count of sign changes of Z_chi on (-t, t) against the sign of R_chi(t), q = 5, 8 heights: 8 of 8. The Hadamard grouping statement is not needed for the proof (the proof is the real-analyticity argument); it is an illustration and its convergence was not written.
- Proposition 3 (v). Eigenvalues of a group matrix are the character sums; checked with numpy at three heights for q = 5, 7; inertia equal to the predicted count in all six cases.
- Lemma 5. Expansion re-done by hand; five-term identity confirmed at one point on the line and one at Re s = 0.72 (`ref_check.log` (iii), 1e-17). Bounds on mu mu: mu_chi and mu_chi-bar both lie in [c - 2, c + 2] for c > 2 (or both in [c - 2, c + 2] negative for c < -2). Confirmed.
- Lemma 6. Re-derived; confirmed 8e-20.

## Corrections made during the pass

1. First build of part C took the principal character as L(s, chi_0)^2 = zeta(s)^2 (1 - q^-s)^2. That entry is not real after rotation (max abs(Im) = 3.3) and the "trace" was complex. The entry that belongs to the symmetric object is Bettin's weight q^s + q^(1-s) - 2. Consequence recorded in RESULT.md: the zeta entry is (2 sqrt(q) cos(t log q) - 2) Z(t)^2 pi^(-1/2), with an explicit sign that is not constant in t. So even the zeta entry of the J-form is not a square with a fixed sign; RESULT.md Theorem 4 (b) is stated for real primitive characters only.
2. First build of part B used 24 Gauss-Legendre nodes per interval of length 2 and left a defect of 4e-5 (2e-2 at b = 10i). Refinement to 40 nodes per unit interval gave 2e-13; a second contour and a second J agree. The table in RESULT.md is from the refined run.
3. Section 2 first said that c11 Theorem 2 "is the case b -> 1/2" of Lemma 1. The limit was not taken; the sentence now says ARGUED.
4. DH row: the reason for the failure at q = +-2 mod 5 was first written as "chi_5(q)^2 = +-1"; corrected to name the two cases.

## Points that stand unverified

- "Selberg's theorem for Dirichlet L-functions gives odd-order zeros on the line" is quoted from memory. The lane's evidence for Theorem 4 (c) is numeric (31 to 34 sign changes).
- Theorem 4 (d) is measured only.
- DH at S0 and S2: argued.
- T-NR at S2 in moment form for composite representatives a q0^j: the Estermann form holds (Proposition `cfd` is for all coprime positive integers), the moment form (Theorem 5 for composite modulus) is not in the source.
- The statement that the expansion coefficients are the Hankel coefficients of K_b was checked by formula ((4 nu^2 - 1)(4 nu^2 - 9).../(j! 8^j) = (-1)^j Q_2j(nu)/(j! 2^j)), not by computing the Voronoi kernel.

## What an independent referee should attack first

1. Is there a one-sided statement for weights that mix several complex pairs with the real characters (Theorem 4 (d))? A counterexample to the lane would be a weight with c-hat != 0 on a complex pair and a proof of a sign.
2. Does any exact law for D(u, w; a/q) off the central point exist (it would give the Hermitian pair at height t and reopen the c11 positivity in the height aspect)? The lane only shows that this proof does not give it.
3. The boundary limit behind Lemma 1 for J >= 1 with b on the imaginary axis (Bettin assumes abs(Re b) < 1/2, b != 0; b = it, t != 0 is inside his range).
