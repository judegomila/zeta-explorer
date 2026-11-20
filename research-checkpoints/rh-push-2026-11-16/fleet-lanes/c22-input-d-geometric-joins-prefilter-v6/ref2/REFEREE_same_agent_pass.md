# REFEREE: c22-input-d-geometric-joins-prefilter-v6

Date 2026-11-20. **Status of this file: second pass by the same agent, with second-method checks. It is not
an independent referee file** (this lane had no means to start a separate agent). Under the campaign rule
(R1 or R3 is entered only on a referee file) this does not matter for the flags, since all four are false;
it does matter for the negative conclusions: the closure of TS section 6 row 4 should not be entered in the
map as refereed on the strength of this file.

Method: each PROVED statement was re-derived from the definitions without the first text; each numerical
sentence was traced to a line of `checks.log` or `referee_check.log`; the first draft was attacked at the
operator identities.

## Findings

**F1 (error in the first draft, corrected in RESULT.md 3.3).** The draft wrote the all-n relation as an
operator factorisation Gamma_sigma T_sigma = Gamma[q_sigma] with T_sigma = sum n^(-sigma) tau_(log n) and
deduced the norm bound for sigma > 1 from it. Direct computation: Gamma_sigma tau_c has kernel k(a + b + c),
which is L(xy n), not L(xy/n); with the adjoint shift the kernel is k(a + b - c) restricted to b >= c, which
is not the Hankel operator of the shifted kernel. For a causal multiplier h, Gamma_(hK) is not a product of
Gamma_K with a Toeplitz operator (that identity holds for anticausal h). The bound
norm(Gamma_sigma) <= zeta(sigma)/(zeta(2 sigma)(sigma - 1/2)) for sigma > 1 is still true, by L^1 norms:
k_sigma = nu_sigma * q_sigma, norm(q_sigma)_1 <= int e^(u/2 - sigma u) du = 1/(sigma - 1/2). The conclusion
of 3.3 (the relation gives a bound only on Re s > 1) is unchanged and is now stated without the false
identity.

**F2 (error in the first draft, corrected in Proposition 1 (iv) and Proposition 2 (a)).** The draft claimed
"Gamma_sigma[f'] is bounded whenever Gamma_sigma[f] is". A right shift of a Hankel kernel can destroy
boundedness (kernel 1/u against 1/(u - c)). What is proved: if S_f(x) << x^theta and sigma > theta both
kernels are in L^1; and by Theorem A (ii) boundedness for f' at sigma gives analytic continuation of F_f/s to
Re s > sigma, because the factor (1 - f(6) 6^-s)/(1 + f(6) 6^-s) and its inverse are analytic in Re s > 0.
For f = lambda this gives the same infimum Theta. The R1 outcome does not change: lambda V6 passes (s1) in
the form used (partial-sum bound with the same exponent), (s2) and (s3).

**F3 (holds).** Theorem A (ii). Checked: B is bilinear, the truncated exponentials have norm^2 <=
1/(2 Re w), m_R(u) <= u dominates, Vitali applies on Re w > 0 with convergence on Re w > w_0. The Laplace
transform of k_sigma is F(s)/s - c/(s - 1) at s = sigma + w. Hypothesis widened from abs(f) <= 1 to
polynomial growth, which the control rows (DH inverse, HQ, T-NR, E_a) need.

**F4 (holds, with a limit).** Theorem A (iii) uses L(x) << x^(Theta + eps) (CLASSICAL; not re-proved) and
zeta(1/2) != 0, zeta(2 rho) != 0 for Re rho > 1/2. At sigma = Theta itself nothing is claimed.

**F5 (holds).** Lemma B (i), (ii). (iii) is correctly labelled ARGUED. Toy case: the truncated inverse
transform over abs(t) <= 400 gives 4.2e-4 at u = +1 (predicted 0; truncation error of order 1/(400 pi) =
8e-4) and 0.30787 + 0.67363 i at u = -1 (predicted 0.30829 + 0.67362 i).

**F6 (holds).** Proposition 1 (i) to (iii): re-derived from n = 6^k m. Second method: direct sum of
lambda(n)(-1)^(v_6(n)) n^-3 to 2e5 minus the closed form = 3.3e-15 (tail bound 1.3e-11). EXACT: partial sums
and the all-n relation on 3,060 values of x.

**F7 (holds).** g * eps_S = lambda * 1 (uses eps_S(k^2) = 1). F_g = zeta(2s)/F_eps(s): local factors checked
in both cases eps(p) = +-1. The pole at b is imported from the THIN lane, not re-proved (weakest step 3).

**F8 (holds).** Proposition 2 (b): induction re-derived; rank-one equivalence needs f(1) = 1. EXACT: first
failure at n = 6 with values (0, -4) for V6 and lambda V6; ranks 1, 1, 5, 5.

**F9 (wording).** Shear row: "RH implies monotone on 1/4 < sigma < 1/2" is proved from the Hadamard sum with
the symmetric pairing; the converse is ARGUED only. The sentence is an implication from RH, not a statement
about zeros. Bridge row: non-cancellation of the poles sigma - rho/2 against zeros of the numerator was
checked (Re(rho + rho') < 2 <= 4 sigma).

**F10 (scope).** HQ1 to HQ4, T-NR and E_a are not members of the class of input D. The rows "criterion holds
verbatim" refer to the Liouville analogue G(2s)/G(s), an object this lane chose; the assignment's sentence
"HQ1-HQ4 and E_a must not fail" is satisfied for (s2) by HQ and T-NR and, for E_a, only with the exponent
(1 + a)/2 in place of 1/2.

**F11 (not checked).** CYC definition; the Omega-theorem for 1/zeta; Wintner and Helson almost-sure
statements; Kronecker's theorem for infinitely many poles. All are labelled as recalled.

## Verdict of the second pass

The verdict "precise obstruction; no object passes; flags all false" stands after F1 and F2. The two
corrected statements were the only operator-theoretic steps beyond Theorem A; no other step uses a Hankel
product identity. An independent referee should attack first: Theorem A (ii) (the Vitali step), Proposition 1
(iv) as now stated, and the choice of joins in section 4 (whether a different join for Klein, twistor or
vortex exists).
