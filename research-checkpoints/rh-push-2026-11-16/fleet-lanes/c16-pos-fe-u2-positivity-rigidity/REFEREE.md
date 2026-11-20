# Referee pass on c16-pos-fe-u2-positivity-rigidity

Status of this file: a second pass written inside the lane (the lane has no means to start a separate agent).
It re-derives each step by a route different from RESULT.md where one exists and re-checks the numbers with
separate code (`ref_check.py`, `ref_theta.py`: mpmath, other test function, other instances). It does not count
as an independent referee under the campaign's three-referee rule. **An independent referee of Theorem P is
owed** before the map row is final. Since the result is an identification with score 0 and no statement about
zeros of zeta, the three-referee rule for zero statements is not triggered.

## 1. Attempted refutations of the statement

Theorem P: N >= 0 on [1, inf), (s - 1) G entire of finite order, zeta's functional equation => G = r zeta.

| candidate counterexample | outcome |
|---|---|
| T-NR symmetric, zeta(s)(q^(s-1/2) + c + q^(1/2-s)), c > 0 | N >= 0, FE, pole at 1 only. Coefficient mass at n/q, lowest frequency 1/q < 1. Outside (H1). As q -> 1 the lowest frequency tends to 1, so the constant 1 cannot be lowered |
| ZQ, SG (c15) | support in [1, inf), FE, pole. N = sum delta_n + A(x) dx with A of both signs: measured min -2.70, max +2.78 on 1 <= x < 31 for the pair 2, 3, eta = 0.1. Outside (H1) |
| G_+ (c15 E1) | nu >= 0 and N >= 0 (measured: min A = -7e-14 at x = 1, where A = 0 exactly, max 6.6e5), support, FE. Double poles at 1/2 +- b. Outside (H2). So the pole clause is necessary for Theorem P as it is for Lemma L |
| zeta(s)^k, products of shifted zetas, zeta(s) zeta(2s) and the like | N >= 0 but a different functional equation (gamma factor or conductor) |
| Hecke's Dirichlet series for the groups G(lambda), lambda > 2, weight 1/2, in the variable s/2 | zeta's functional equation, pole at 1 only, finite order, frequencies sqrt(lambda n/2). If the series starts at n = 1 the support starts at sqrt(lambda/2) > 1. Theorem P then says the coefficients cannot all be >= 0. Cross-check by the scaled triangle f(x) = (1 - abs(x)/a)_+, a = sqrt(lambda/2): pairing gives (r/2)(1 - a) = integral of a sinc^2(a x) dN >= 0, impossible for a > 1, r > 0, N >= 0. Consistent; no counterexample. (Corollary: with support in [a, inf), a > 1, and N >= 0 one gets G = 0.) |
| 5^(s/2) L(s, chi_5) and the Davenport-Heilbronn combination at zeta's gamma factor (c15, F6) | frequencies n/sqrt 5 < 1 and signed coefficients. Outside (H1) twice |
| G with nu >= 0 having an atom at x = 1 (frequency shift x -> e^c x) | allowed by the hypothesis; Step 1 handles it (drift term); the theorem then gives c = 0 |
| exp(h) zeta, h(s) = h(1 - s) entire (heat type) | no representation (H1) (unbounded to the right); and not of finite order unless h is a polynomial, in which case m = exp(h) is unbounded on the real axis |

No counterexample found.

## 2. Step by step

| step | check | verdict |
|---|---|---|
| 1 | Re-derived without the word "subordinator": for eps > 0 let Pi_eps be Pi restricted to u > eps (a finite measure). exp(-integral (1 - e^(-wu)) dPi_eps) = e^(-Pi_eps(R)) sum_k (transform of Pi_eps^{*k})/k!, a Laplace transform of a non-negative measure on [0, inf). As eps -> 0 these converge pointwise for w >= 0 to exp(-integral (1 - e^(-wu)) dPi), finite because integral of min(1, u) dPi is finite. A pointwise limit of completely monotone functions is completely monotone (Bernstein). Times e^(-cw), c >= 0: a shift of the measure to the right. | holds |
| 2 | Landau needs N >= 0: have it. The integral and G agree on a half-plane, G is analytic on the real segment (1, inf), so the abscissa is <= 1. | holds |
| 3 | gam(1 - s)/gam(s) on Re s = -1: Gamma(1 - it/2)/Gamma(-1/2 + it/2) has modulus of order abs(t)^(3/2). Finite order suffices for Phragmen-Lindelof in a strip. | holds |
| 4 | Residue bookkeeping re-done in the variable w = s/2: gam G = r/(2(w - 1/2)) + ... and -r/(2w) + ..., giving (r/2) y^(-1/2) and -r/2. For zeta: Theta = (theta - 1)/2, r = 1, relation theta(y) = y^(-1/2) theta(1/y). Numerical check on a member other than zeta (ZQ, pair 2, 3, eta = 0.1, r = m(1) = 1.0152042268912917): both sides agree to 1.3e-26 at y = 0.5, 0.7, 1.6, 3.1 (`ref_theta.json`); with r replaced by 1 the relation fails by 1.5e-3 to 3.3e-3, so the check is not vacuous and the constant r/2 is right. | holds |
| 5 | Equality on Gaussians for all y > 0 implies equality of all y-derivatives at y = 1, i.e. on x^(2k) e^(-pi x^2); (the transform of d^k/dy^k of a Gaussian is d^k/dy^k of its transform). Even Hermite functions span a dense subspace of even Schwartz space. Odd test functions pair to 0 with both even distributions. | holds; cited facts standard (weakest step 1 of RESULT) |
| 6 | f = phi correlated with phi has support in the open interval (-1, 1) when phi has support in the open interval (-1/2, 1/2); so no boundary term at abs x = 1 even if N has an atom at 1. Identity (T) checked on four objects in `checks.json` and on a second ZQ with another phi (phi = 1 - 4x^2, not smooth at the ends; (T) extends to L^2 by continuity when N >= 0 or abs N has a bounded density): defect -4.8e-10 with the integral cut at x = 60, where the neglected tail is of order 1e-9. Limit form: integral of sinc^2 A over [1, 60] = -1.28215e-5, tail (r - 1)/(2 pi^2 60) = +1.28376e-5, sum 1.6e-8: zero within the truncation. For G_+ (T) fails by -2.8e5 (pair 2, 3), as it must. Fatou direction: liminf of the left sides >= integral of sinc^2 dN; the right sides tend to 0; so the integral is <= 0. Correct direction. | holds |
| 7 | A tempered measure on Z has a 1-periodic transform; self-duality gives translation invariance. Alternative ending: N on the integers makes G an ordinary Dirichlet series with zeta's functional equation and Hamburger's theorem gives the same. | holds |

## 3. Corrections and limits (to be carried with the result)

- **C1 (scope of the word "proved").** Steps 4 and 5 rely on classical statements recalled, not opened in a
  source. The numerical check of Step 4 on ZQ covers the residue constants, not the contour argument.
- **C2 (novelty).** The measure statement behind Theorem P is the equality case of the one-dimensional
  linear-programming bound. RESULT.md says so. No literature search was made; the map row should say
  "identification, classical in content".
- **C3 (what the lemma does not need).** POS-FE was filed as the POS branch of an arithmetic read class. The
  proof shows the identification is carried by {FE, pole clause, N >= 0, no mass below 1}: no Euler product,
  no multiplicativity, no use of the sign of Lambda beyond the sign of the coefficients of G. A device that
  claims to use "positivity of Lambda with the functional equation" is, on this evidence, reading the
  coefficient side of Poisson summation. This strengthens the campaign's statement that positivity and
  support of Lambda with the functional equation cannot carry RH: here they carry exactly the
  identification of zeta and nothing about its zeros.
- **C4 (screen).** Section 3 of RESULT.md is float64 with finite candidate columns; "the integer optimum is
  ZQ" is a solver statement with the gaps printed in the table. The relaxed programs A and B have fractional
  multiplicities and are not families of functions; their minima are lower bounds only.
- **C5 (quantitative form).** "QF implies RH" is immediate and correct as stated; it does not show QF is
  false or true. The measured trade-off is at heights below 2516 and x <= 1e6.
- **C6 (reading of the hypothesis).** nu is taken locally finite on the closed half-line. A measure with
  infinite mass near x = 1 is not covered by Step 1 as written.

## 4. Verdict of this pass

Theorem P and the corollary POS-FE: every step re-derived; no error found; six limits recorded. Registered
outcome: proof, identification row in U3, score 0. Flags R1 to R4 all false, as in RESULT.md. Independent
referee owed.

---

# Independent referee pass (adversarial, lens: general), 2026-11-19

Separate agent, not the lane. The same-lane pass above is kept unchanged. Scope: RESULT.md as claimed
("proved-new-result"; Theorem P, corollary POS-FE, Proposition T, necessity of hypotheses, QF implies RH, server
screen). Method: every PROVED step re-derived on paper; identity (T) re-run with own code on cases not used by
the lane; the table of section 3.1 re-counted from `lp2_main.json`. Nothing was run on the compute server; the
MILP was not re-solved.

## Verdict

**Holds, with one error in a side remark and three label corrections.** Theorem P, the corollary POS-FE and
Proposition T are correct as written. Nothing assumes RH, nothing restates verified height, and nothing is a
statement about zeros of zeta. Flags: R1 = R2 = R3 = R4 = false (agree with RESULT.md).

## Re-derivation of the PROVED steps

| step | what was re-derived | result |
|---|---|---|
| 1 | log G(s) - log G(sigma_1) = -c w - integral (1 - e^(-wu)) dPi, dPi = e^(-sigma_1 u) d nu~/u; integral of min(1, u) dPi finite (near 0: u dPi = e^(-sigma_1 u) d nu~, finite; at infinity: bounded by the transform at sigma_1, which converges absolutely because nu >= 0). exp(-Bernstein) is completely monotone. The half-plane lies in Re s > 1 because -G'/G is analytic there and G has a pole at 1. C = G(sigma_1) may be complex; harmless. | holds |
| 2 | Landau for N >= 0; the only real singularity is s = 1, so the abscissa is 1 or -inf. | holds |
| 3 | abs(gam(2 - it)/gam(-1 + it)) is of order abs(t)^(3/2); finite order gives Phragmen-Lindelof in the strip. | holds |
| 4 | Residues of gam(s) G(s) y^(-s/2)/2 between Re s = -1 and Re s = 2: at s = 1, (r/2) y^(-1/2) (gam(1) = 1); at s = 0, -r/2 (symmetry of gam G); Gamma(s/2) has no other pole in the strip. After s -> 1 - s: Theta(y) + r/2 = y^(-1/2)(Theta(1/y) + r/2). | holds |
| 5 | Pairing of mu with e^(-pi y x^2) is r/2 + Theta(y); with its transform, y^(-1/2)(r/2 + Theta(1/y)). Equal. N([1, X]) <= X^sigma G(sigma) makes mu a tempered measure, so y-derivatives pass under the pairing; finite combinations of x^(2k) e^(-pi x^2) are the even Hermite functions, dense in even Schwartz space. | holds (density cited, standard) |
| 6 | f = phi correlated with phi is in C_c^inf(-1, 1), so both pairings are legitimate and an atom of N at x = 1 does not contribute. (T) follows; abs(phihat)^2 is even for real phi, which gives the factor (1/2) * 2. Limit: phihat_k -> sinc uniformly (L^1 convergence on a bounded interval), Fatou in the correct direction. | holds |
| 7 | mu on Z, tempered, so muhat is 1-periodic; muhat = mu gives c_n = c_0 = r/2, N({n}) = r. | holds |
| Prop. T | abs(phihat_k) <= min(1, 1/(pi abs x)) for the stated phi_k (indicator of length < 1 times a transform of a unit-mass mollifier); integral of x^(-2) d abs(N) is finite by convergence at s = 2. Dominated convergence applies. | holds |
| scaled form | f = (1 - abs(x)/a)_+, fhat = a sinc^2(a x) >= 0; pairing gives a integral sinc^2(a x) dN = (r/2)(1 - a). For a > 1, r > 0 this is impossible; with r = 0, N sits on (1/a)Z, mu is a-periodic and has no mass in (-a, a), so mu = 0. | holds |
| sharpness of 1 | zeta(s)(q^(s-1/2) + c + q^(1/2-s)): multiplier symmetric under s -> 1 - s; N = q^(-1/2) sum delta_(n/q) + c sum delta_n + q^(1/2) sum delta_(nq) >= 0; pole at 1 only. | holds |
| G_+ | -m'/m density = x^(-1/2)(4 cosh(bL) - 4 cosh(eta L) cos(gL)) >= 0 for b >= eta; so nu >= 0 and N >= 0 by Step 1; (H2) fails. | holds |
| QF implies RH | zeta meets the hypotheses with nu = Lambda >= -eps mu for all eps > 0 (mu >= 0). | holds; trivial |

Necessity of N >= 0 is in fact a consequence of the theorem, not only a measurement: ZQ meets (H2), (H3) and
the support clause and is not r zeta, so its N cannot be >= 0.

## Numerical re-run with different cases (own code, local, 8 GB cap, float64 with mpmath residues)

Test function phi = cos(pi x) on [-1/2, 1/2] (the lane used cos^2 and 1 - 4x^2): phihat(t) =
(2/pi) cos(pi t)/(1 - 4t^2), norm^2 - mean^2 = 1/2 - 4/pi^2.

| case | left of (T) | right of (T) | defect |
|---|---|---|---|
| zeta | 0.04735763271532447 | 0.04735763271532445 | 2e-17 (closed form 1/4 - 2/pi^2 on both sides) |
| ZQ, zeros 3, 4, eta = 0.2 (r = 1.0194393121559777) | 0.04827823252026592 | 0.04827823252064578 | -3.8e-13 (integral cut at x = 600) |
| ZQ, zeros 3, 4, eta = 0.45 (r = 1.0198701606423481) | 0.04829863648463098 | 0.04829863648501927 | -3.9e-13 |
| G_+, zeros 3, 4, eta = 0.1, b = 0.25 (r = 1.68e7) | 59.77 | 795647.2 | fails, as it must; density A in [0.055, 5.07e6] at the quadrature nodes, so N >= 0 |
| T-NR symmetric, q = 2.5 (non-integer), c = 0.7 | sum fhat dN = 0.3003434441308865 | (r/2) var = 0.1379809316826179 | difference 0.16236251244826844 = mass term of f at 0.4, 0.8; general identity closes to -1.7e-16 |

Limit form of Proposition T on ZQ (zeros 3, 4): integral of sinc^2 A over [1, 600] = -1.6413e-6 (eta = 0.2) and
-1.6777e-6 (eta = 0.45); adding the tail (r - 1)/(2 pi^2 600) gives 2.9e-11 and 3.0e-11. The density of ZQ takes
both signs (min -4.10, max +4.10 on [1, 600) at eta = 0.2). Scaled triangle on zeta with a = 0.6:
a sum sinc^2(a n) = 0.1999996 against (1 - a)/2 = 0.2 (sum cut at n = 2e5). All consistent with RESULT.md.

Table 3.1 re-counted from `lp2_main.json`: 40 rows, `int_is_ZQ` true in 40; incumbent value equals the ZQ
fine-grid value exactly in all 40; LP/ZQ ratio between 0.7961 and 0.8753. Confirmed.

## Errors and corrections

- **E1 (error; side remark, not used in Theorem P).** The Hecke application of the scaled form is inverted. A
  form on G(lambda) has expansion sum a_n e^(2 pi i n tau/lambda); at tau = iy this is e^(-pi x^2 y) with
  x^2 = 2n/lambda. The frequencies in zeta's normalisation are sqrt(2n/lambda), not sqrt(lambda n/2) (the two
  agree only at lambda = 2). For lambda > 2 the first frequency is sqrt(2/lambda) < 1: the support clause
  fails, Theorem P and the scaled form say nothing, and the sentence "Hecke's series for the groups
  G(lambda), lambda > 2, in weight 1/2 therefore cannot have non-negative coefficients" is not established.
  (It is the regime of T-NR: mass below 1, no rigidity; consistent with Hecke's infinitely many solutions.)
  What the scaled form does give is the case lambda < 2: frequencies start at sqrt(2/lambda) > 1, so no
  non-zero solution with a_n >= 0 for n >= 1 and zeta's functional equation exists. The same wrong formula is
  in row 5 of the candidate table of the same-lane pass above. Strike both or replace lambda > 2 by lambda < 2
  and the frequency by sqrt(2n/lambda).
- **E2 (label).** "proved-new-result" overstates. The content of Theorem P is the uniqueness of the Dirac comb
  among non-negative even self-dual tempered measures with no mass in 0 < abs x < 1 (equality case of the
  one-dimensional linear-programming bound; Hamburger-type theorems with general frequencies are also on
  record, Bochner-Chandrasekharan and Chandrasekharan-Mandelbrojt, recalled, not opened). RESULT.md says this
  in its literature remark; the registered verdict should read "proved; identification; classical in
  content; new to the campaign record only".
- **E3 (wording, section 0 item 2).** (T) is proved for smooth phi supported in the open interval. "For every
  phi in L^2 supported in [-1/2, 1/2]" is true only after the conclusion (N = r comb) or, for signed N, under a
  domination hypothesis as in Proposition T. The proof uses only the smooth case and Fatou, so nothing breaks.
- **E4 (count).** "within 0.6 percent in 23 of the 24 cells with eta <= 0.1": the cell K = 50, eta = 0 has gap
  0.601 percent. Strictly 22 of 24; 9 of 16 at eta = 0.2, 0.3 is confirmed.
- **L1 (limit, as in RESULT 7.3).** The screen is float64, binary weights on 729 columns within 40 indices of
  the pair, window x <= 1e6, MILP stage capped at 4 cutting-plane rounds and a time limit (9 cells stopped 3 to
  15 percent above their bound). "No configuration on these columns below 0.79 of ZQ" is a grid statement for
  weights in [0, 1]. It is not used in the proof.

## Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no multiplicative hypothesis is used; the lane shows the identification needs none |
| R2 | false | no statement about zeros in any window |
| R3 | false | identification; the controls are outside the hypotheses, each by a named clause; no zeta-only mechanism about zeros is claimed |
| R4 | false | nothing passes to the critical line; QF, the only form that would, implies RH |

Surviving claim: Theorem P, corollary POS-FE, Proposition T, the scaled form, sharpness of the constant 1, the
necessity examples (ZQ, T-NR symmetric, G_+), "QF implies RH", and the 40/40 screen result as a float64
statement on the listed columns. Not surviving: the Hecke G(lambda), lambda > 2 corollary (E1) and the word
"new" beyond the campaign record (E2).
