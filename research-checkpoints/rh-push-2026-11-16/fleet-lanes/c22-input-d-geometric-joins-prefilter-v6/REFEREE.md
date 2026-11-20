# REFEREE (independent pass, lens: general): c22-input-d-geometric-joins-prefilter-v6

Date 2026-11-20. Separate agent from the lane. This file replaces the same-agent second pass as the main
text; that pass is kept unchanged in the appendix below (and in `ref2/REFEREE_same_agent_pass.md`). Its
findings F1 to F11 were re-checked and stand, except where noted in E2.

**Outcome: the verdict holds (precise obstruction; no object passes; nothing about zeros of zeta).
Flags set by this referee: R1 false, R2 false, R3 false, R4 false.** Five errors of statement were found
(E1 to E5). None is in a step that the verdict uses; each needs a wording correction before the row is
entered in the map.

Method: every PROVED statement was re-derived from the definitions; one numerical check per claim was rerun
with a different case (`ref2/ind_check.py`, `ref2/ind_check.log`; local, `scripts/memcap.sh 8`, planned
allocation < 40 MB, server not used); the controls were run on the step claimed zeta-specific (there is
none: the lane claims no zeta-only mechanism).

## Errors found

**E1 (false sentence, section 3.3 R2 paragraph and the "unimodular twist" row of 3.6).** "Gamma_sigma for
lambda(n) n^(-i tau) is unitarily equivalent to Gamma_sigma for lambda (modulation by e^(-i tau a))". False as
stated. Modulation maps the kernel L(e^u) e^(-sigma u) to L(e^u) e^(-(sigma + i tau) u), symbol
F_lambda(s + i tau)/(s + i tau). The partial sums of lambda(n) n^(-i tau) are a different function
(x^(-i tau) L(x) + i tau int_1^x L(t) t^(-i tau - 1) dt), with symbol F_lambda(s + i tau)/s. Check D:
max over x <= 2000 of the difference of the two moduli is 24.3 at tau = 3 (at x = 2: abs(1 - 2^(-i tau))
against 0). Correct statement: Gamma_sigma is unitarily equivalent to the Hankel operator with kernel
L(e^u) e^(-(sigma + i tau) u) for every real tau, so its norm is invariant under height translation of the
symbol D. The conclusion drawn (the norm is not localised to a window; R2 false) follows from the correct
statement. For the twist the two operators have the same infimum of sigma (Theorem A), not the same norm.

**E2 (false reason, section 3.3).** "There is no interpolation or convexity step: the family is not analytic
in sigma in operator norm." The family is analytic: for Re s > Theta the kernel L(e^u) e^(-su) is an
L^1-valued analytic function of s (derivative -u k_s, in L^1), so s -> Gamma_s is analytic in operator norm
on Re s > Theta, norm(Gamma_(sigma + i tau)) = norm(Gamma_sigma) by E1, and by the three-lines theorem
log norm(Gamma_sigma) is convex on (Theta, inf). (Check I: truncated L^1 norms at 0.8, 0.9, 1.0 are 1.656,
1.242, 0.998; log-convex. A sample, not a proof.) The correct reason for "no mechanism" is the lane's second
clause: convexity bounds an interior point from two ends, and the left end is the statement to be proved; a
bound on (1, inf) alone gives nothing on (Theta, 1]. R4 false is unchanged. The convexity statement is
standard and carries no information on Theta.

**E3 (errors in Lemma 0 (c), labelled PROVED).** (i) "zeros at -1, -2, ...": at s = -2, -4, ... the zero of
zeta(2s) is cancelled by the trivial zero of zeta(s); F_lambda(-2) = -0.5244, F_lambda(-4) = 2.0833 (check
E). The real zeros are at -1, -3, -5, ... and at s = 1. (ii) "Poles of F_lambda are at the zeros rho": the
pole at s = 1/2 (residue 1/(2 zeta(1/2)) = -0.3424) is omitted here; it is used correctly in Theorem A
(iii). (iii) "F_lambda is real on no vertical line" is stated without proof. It is true: reality on
Re s = c gives F(s) = F(2c - s); the pole set (zeros of zeta, and 1/2) is symmetric about 1/2 and bounded
in real part, so c = 1/2; then the zeros rho/2 (real part < 1/2) map to 1 - rho/2, where zeta(2s) != 0 and
zeta(s) has no pole. (iv) For n^(-i alpha) the partial sums are x^(1 - i alpha)/(1 - i alpha) + O(1) type,
not c x + E(x); "hypothesis trivially true" needs the main term changed. None of (i) to (iv) is used later.

**E4 (overstatement in the verdict and in the claim line).** "A completely multiplicative unimodular
function other than 1 has no reflection symmetry." Not what Lemma 0 proves, and false as worded:
n^(-i alpha) is completely multiplicative and unimodular, and zeta(s + i alpha) is carried to itself by
s -> 1 - conj(s) with the factor chi. What is proved: (b) with zeta's own functional equation the function
is 1 (Hamburger, recalled); (c), (d) F_lambda has no reflection symmetry. A general unimodular completely
multiplicative chi with a functional equation of another shape is not treated (inside the Selberg class it
would follow from the degree-1 classification, which the note does not cite). The three "no object" rows
(Klein, twistor, vortex) are established for the joins through lambda and lambda n^(-i alpha) only; weakest
step 1 of the note says this for the choice of joins, and the headline should say it too.

**E5 (wording, Lemma B and verdict item 1).** "The Nehari distance of the boundary function does not read
zeros right of sigma at all." Proved: for a bounded boundary function the Hankel operator Gamma[phi_sigma]
is bounded whatever the poles right of sigma, and the principal part at each such pole is in
H^inf(Re z < 0), so finitely many of them can be removed without changing the norm. Not proved: the
hypothesis "phi_sigma bounded" in the case of interest (a zero right of sigma; boundedness of
1/(s zeta(s)) on such a line is not known unconditionally), and the removal of infinitely many principal
parts (Lemma B (iii) is ARGUED, as labelled). "At all" should be "through the principal parts of finitely
many poles". The reading (the distance is not a detector of poles right of sigma; row S3) is unchanged.

## Remarks (not errors)

**N1.** Section 3.3: the bound obtained from the all-n relation on sigma > 1,
zeta(sigma)/(zeta(2 sigma)(sigma - 1/2)), is larger than the trivial bound 1/(sigma - 1) from abs(L(x)) <= x
for sigma <= 2 (check H: 121.2 against 100 at 1.01; 2.173 against 2 at 1.5; 0.473 against 0.5 at 3). Near
the edge sigma = 1 the relation gives less than no arithmetic at all. This strengthens the R4 line.

**N2.** Theorem A (ii) is the standard half-line statement "bounded Hankel form implies a Bloch-type bound
on the derivative of the symbol" (Nehari / BMOA side). The note labels it PROVED and does not present it as
new; the map row should say "standard". Sharpness sample: Carleman kernel 1/u, N = pi, -K'(w) = 1/w,
abs(K'(w)) Re w <= 1 <= pi/2.

**N3.** DH row of 3.6, "bounded iff sigma is right of every zero": the "if" direction needs the partial sums
of the Dirichlet inverse to have exponent equal to the supremum of the zeros' real parts. This holds
(Bohr: zero-free in a half-plane of absolute convergence gives a lower bound for the modulus in every
smaller closed half-plane, so the inverse is bounded there) but is not written; the value 1.1204 is taken
from the map and was not re-derived. The HQ, T-NR, E_a, CYC rows were not re-derived either (they are
outside the class of input D, as the note says).

**N4.** The pole of F_g at b for g = lambda eps_S is imported from the THIN row of the map (F_eps =
zeta (s - b) W, one referee). The map records that the greedy rule "count + 1 <= li" gives a double zero
at b; `checks.py` uses that rule with density 1/2. Either order gives a real pole of F_g at b; the note's
"k = 1 or 2" covers it.

## Re-derivations (all confirmed)

- **Theorem A (i).** Schur test gives norm <= norm(k)_1; Hilbert-Schmidt norm^2 = int u abs(k(u))^2 du.
- **Theorem A (ii).** B(phi_R, phi_R) = int_0^(2R) k(u) e^(-wu) m_R(u) du with m_R the tent; bilinear form,
  norm(phi_R)^2 <= 1/(2 Re w); for Re w large dominated convergence gives int u k e^(-wu) du = -K'(sigma + w);
  K(s) = int_1^inf E(x) x^(-s-1) dx = F_f(s)/s - c/(s - 1); Vitali on Re w > 0. Holds for f(n) = O(n^C).
- **Theorem A (iii).** sigma > Theta: L^1 kernel (recalled bound L(x) << x^(Theta + eps)). sigma < Theta:
  a pole of D right of sigma (a zero rho with Re rho > 1/2, zeta(2 rho) != 0; or 1/2 with zeta(1/2) != 0).
  Nothing is claimed at sigma = Theta. This is "RH iff bounded for all sigma > 1/2" by Landau continuation:
  a restatement, labelled as such. RH is not assumed anywhere; the shear row is an implication from RH and
  is labelled so.
- **Lemma B (i), (ii), toy.** Confirmed; toy rerun with p = 0.15 - 5i, u = +-0.7: -4.2e-4 (predicted 0,
  truncation at abs(t) = 600) and 0.84354 + 0.31581 i (predicted 0.84312 + 0.31582 i). Size near the line:
  with eta = sigma - 1/2, s = rho + 2 eta, abs(K') = abs(r)/(4 eta^2) + O(1) <= N/(2 eta). Confirmed.
- **3.3.** zeta_sigma * k_sigma = q_sigma and the total variations: confirmed. Carleman example: confirmed.
  1/zeta unbounded on 1/2 <= sigma < 1: Titchmarsh Theorem 8.12 (recalled).
- **Proposition 1.** n = 6^k m gives F_f' = F_f (1 - f(6) 6^-s)/(1 + f(6) 6^-s), w(6^k) = 2 (-f(6))^k;
  L^1 constant 1 + 2 sum_(k>=1) 6^(-k sigma) = (1 + 6^-sigma)/(1 - 6^-sigma); the factor has no zero or pole
  in Re s > 0. Rerun with a different case (check B): base 10 in place of 6 and a complex f (f(2) = e^(0.7i),
  f(p) = i for p = 1 mod 4, -1 for p = 3 mod 4), N = 3e5: partial-sum identity to 3.2e-10 (float), closed
  form at s = 2.5 to 2.9e-11 (tail 6e-9), f'(10) = -f'(2) f'(5). Check C: the lambda V6 all-n relation at 67
  fresh x up to 3e5, exact; max abs(S)/sqrt x on [100, 3e5] = 0.9331 (same value as the lane's at 2e5).
- **Sign chain g = lambda eps_S.** g * eps_S = eps_S (lambda * 1) = indicator of squares (eps_S(k^2) = 1);
  F_g = prod (1 + eps(p) p^-s)^-1 = zeta(2s)/F_eps(s). Rerun with a different THIN set (check A): b = 0.75,
  primes 2 and 3 admitted, 774 primes below 3e5: relation exact at 67 values of x; G(3e5) = -19060,
  log abs(G)/log x = 0.781, local slope 0.785 on [1e5, 3e5]. MEASURED growth agrees with a pole near b.
- **Twin ladder.** chi_P = 1 * w_P, abs(w_P) <= 2^(pi(P)), c_P = prod (p - 1)/(p + 1), L = S_P on x <= P;
  the limit argument is correct.
- **Bridge.** S_sigma unimodular on Re z = 0 (D real on the real axis); poles at sigma - rho/2 not cancelled
  (Re(rho + rho') < 2 <= 4 sigma; rho = 4 sigma - 2 is not a zero). Also poles at z = sigma + 1, sigma + 3, ...
  from the real zeros of D (not listed in the note; it only adds poles).
- **Shear.** Termwise signs give Theta/2 < sigma < 1 - Theta. Check G at 24 fresh points: minimum 0.01169 at
  sigma = 0.251, t = 0. This is a Hadamard-product statement, known in kind; not presented as new.
- **Torus relation, Beurling product** prod_k (1 + y^(2^k)) = 1/(1 - y): confirmed.
- **Proposition 2 (b).** Induction on N with d(N) >= 3 for composite N; rank one with f(1) = 1 gives
  f(mn) = f(m) f(n). V6 at n = 6: 2 V6(1) V6(6) + 2 V6(2) V6(3) = 0 against -4. Confirmed. (a), (c) follow
  from Proposition 1; (c) covers only step types (a) and (b), as the note says.
- **Section 6.** Hyperbola identity and the exponent (1 + theta)/2: confirmed.

## Checks against the campaign rules

- No statement about zeros of zeta is made. RH is not assumed. Verified height is not used. No known
  theorem is presented as new (N2: say "standard" for Theorem A (ii)).
- No zeta-only mechanism is claimed, so there is no control that should fail and does not. The two twins
  (lambda V6 for R1, lambda THIN for R3) pass the named steps, which is the lane's negative finding;
  both were rerun here with different parameters.
- Scope of the closure: "no object passes" covers the joins written (one or two per object) and step types
  (a), (b) of Proposition 2. It is not a proof that TS section 6 row 4 has no join. The map entry should read
  "closed for joins through lambda with steps of types (a), (b)".

## Flags

| flag | value | reason |
|---|---|---|
| R1 | false | lambda V6 (not multiplicative) passes every named step; the pivot step fails the second clause |
| R2 | false | no every-window statement; norm invariant under height translation (E1, corrected form) |
| R3 | false | lambda THIN and Beurling members pass the relation; DH, HQ, T-NR, E_a fail only the hypothesis |
| R4 | false | relation bounded only on sigma > 1 and weaker than trivial there (N1); convexity needs the left end (E2) |

## Corrections owed in RESULT.md (not made by this referee)

1. 3.3 and 3.6: replace the unitary-equivalence sentence by the statement on the modulated kernel (E1).
2. 3.3: delete "the family is not analytic in sigma in operator norm"; keep "the left end is the target" (E2).
3. Lemma 0 (c): real zeros at -1, -3, ... and 1; pole at 1/2; add the three-line proof of "real on no
   vertical line" (E3).
4. Verdict and `lanes.jsonl` claim: "F_lambda (and lambda n^(-i alpha) up to translation) has no reflection
   symmetry", not "every completely multiplicative unimodular function other than 1" (E4).
5. Lemma B headline: drop "at all" (E5). 3.3: add N1.

---

# Appendix: the lane's same-agent second pass (unchanged text)

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
