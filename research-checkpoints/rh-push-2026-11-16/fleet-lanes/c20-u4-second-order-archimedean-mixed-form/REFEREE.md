# REFEREE (second pass, same session): c20-u4-second-order-archimedean-mixed-form

Date 2026-11-20. This pass was written in the session that wrote RESULT.md; no separate referee agent was
available. It does not count as an independent referee (referees = 0). It re-derives each PROVED step and
uses a second script with a different route: `referee_check.py` (forms by direct quadrature on the Fourier
side instead of the inverse transform; window sin^2 instead of sin^4; theta' defined as u/Lg; mpmath digamma
instead of the lane's asymptotic series; float64; local through `scripts/memcap.sh 8`). No server unit.

**Verdict of this pass: holds, with corrections E1 to E5 on wording and scope.** The verdict "precise
obstruction, stop at the first lemma, no statement about zeros of zeta" stands. Flags: R1 false, R2 false,
R3 false, R4 false.

## 1. Step by step

| step | finding |
|---|---|
| Lemma S, pointwise bound | Re-derived. Near t: d/dx G(1/2 + ix) = i psi'(1/4 + ix/2)/4, and sum_k abs(z + k)^-2 <= abs(z)^-2 + pi/(2 abs(Im z)) gives at most 16/t^2 + 2 pi/t for abs(Im z) >= t/4, so the derivative is below 1.7/t; the stated constant 2 (log t) holds. Far from t: the chain log(2 + abs(x)) <= log t + 3r, total <= (4 log t + 15) r <= 8 (log t) r needs log t >= 3.75, t >= 43, as stated. The bound abs(G(1/2 + ix)) <= (1/2) log(2 + abs(x)) + 3 is recalled; at x = 0 the value is abs(psi(1/4))/2 + 0.57 = 2.69. Constants are crude, as the lane says |
| Lemma S, values at t | Confirmed numerically: G(1/2 + 3000 i) = 3.0842452483 + 0.7854815 i against Lg/2 = 3.0842452506, pi/4 = 0.7853982; at 3e5: 5.386830343614 against 5.386830343614, imaginary part 0.7853990 |
| Corollary S' | Follows: the part of M_G h outside [0, u] is the part of (M_G - G_t) h there |
| Proposition M | Re-derived: left side = norm(Arch h)^2 - 2 Re <Arch h, A_P h>; Arch h = 2 theta'(t) h + P_u e. Correct. The identity is the polarisation of a real scalar mirror; it would hold with any self-adjoint operator close to a scalar in place of Arch |
| Proposition C | Re-derived for the eight words with one or two letters Gamma. Correct for window vectors. See E2 |
| collapse, second route | D_2 = abs(<h, Gamma_c A_P h> - G_t <h, A_P h>) by direct quadrature of (1/2 pi) int G a_P abs(g)^2: 4.7e-5 (t = 3e3, u/Lg = 0.60, P = 40), 2.8e-4 (3e3, 0.90, 257), 2.3e-6 (3e5, 0.60, 641), 4.8e-6 (3e5, 0.90, 16257), against the bound with constant 1: 0.035, 0.106, 0.0027, 0.0145. D_1 = 2 D_2 in all four. Agrees with the lane's table in order of magnitude and in the 1/t scaling |
| K3-M | Re-derived: log f(y) is a power series in y = q^(1/2) q^(-s) starting at y^j0. Recomputed log-derivative coefficients from the Dirichlet coefficients by the recursion a(n) log n = sum Lambda_F(d) a(n/d): first differing n is 7 for HQ3 and HQ4 at q = 7 (values 2.96115, 25.13409, equal to the c19 formula to 1e-13) and 25 for HQ2 at q = 5. T-NR: m'/m(1/2 + w) = 1.08872, 1.0986123 at w = 5, 20; log 3 = 1.0986123 |
| HQ2 zeros off the line | Re-derived: with y = e^(i phi), (1 - y)^2/y = 2 cos phi - 2 is real, so (1 - y)^4/y^2 >= 0 and cannot equal -eps. Correct for every eps > 0 |
| K1 for forms | Correct: a word in A_P, A_P* at height t is a polynomial in the z_p = p^(-it) and their conjugates with coefficients fixed by h_0. The exact example eps(n) = n^(it) is a valid unimodular completely multiplicative chain |
| Stage A, linearity | Correct: (M) contains Lambda only through <h, A_P h>; the atom 12 has coefficient 0. This also means the assigned Liouville test at p q^2 is empty for (M), which the lane states |
| P3 | Re-derived. With norm(h) = 1, abs(<h, A_P h>) <= kappa Lg; abs(g_0(y))^2 = (8u/pi^2) cos^2(uy/2)/(1 - (uy/pi)^2)^2 has the value (8u/pi^2)(pi/4)^2 = u/2 at uy = +-pi and is decreasing in abs(y) on the main lobe. Numerically: minimum 0.5000 u on abs(y) <= pi/u, 0.8106 u at the centre. The count bound 2 (1 + 2 kappa) Lg/u follows; it is conditional on real zeros, as stated |

## 2. Corrections

- **E1 (the stop criterion does not discriminate).** K3-M holds for every form that reads only
  {Lambda(n): n < P} and the gamma side. It stops this lane, and it would equally stop any band-u device at
  stage (t, P(t)), including the first-order form of c18 (which RH implies). So "invariant under K3" does
  not show that (M) is false or useless as an inequality; it shows that (M) at height t cannot be the step
  that locates zeros near height t. RESULT says this in 2.5 (a); the summary line "closed at the first lemma"
  in the device row should carry the same qualification: "closed as a route to zero location".
- **E2 (scope of Proposition C).** The statement is for vectors with norm(h_0') <= K norm(h_0) and the error
  is K-dependent. For all h in L^2[0, u] the operators Gamma_c and A_P do not reduce to a scalar and a
  first-order form; an inequality over all of L^2[0, u] is not covered. RESULT lists this in weakest step 2;
  item 3 of section 0 should say "on window vectors with bounded norm(h_0')/norm(h_0)".
- **E3 (rows not decided).** DEL and THIN with zeta's Arch imposed are not decided; four failure rows
  (E_a, HQ2, HQ3/HQ4, T-NR at fixed q) are ARGUED and each needs an upper bound for <h, T_Z h> that is not
  available unconditionally (norm(A_P) <= 2.1 P^(1/2) is larger than the claimed violation P^b, b < 1/2, so
  the unconditional argument does not close). The table marks them ARGUED. The stop does not depend on them.
- **E4 (novelty).** Lemma S is the standard fact that the gamma term of the explicit formula is
  log(t/2 pi) in a short window; Proposition M is a polarisation identity; K3-M is one line. Label: PROVED,
  CLASSICAL in content. What is recorded as new for the map is the consequence: at any polynomial order the
  gamma side pairs with A_P through words linear in Lambda.
- **E5 (pivot).** (D_kappa) is not refuted. "The conjectured maximal order of S(t) is against it" is a
  heuristic remark; the surviving content of the pivot is P1 (blindness) and P3 (what it would imply).

## 3. Controls, assumptions, restatement

- No step assumes RH except P3, which states the assumption. No zeta zero is used; nothing restates verified
  height.
- (M) is passed by ZQ (relative to c18 Proposition Z, lattice model) and, per stage, by HQ1 to HQ4 and T-NR.
  It is failed by E_a (size, ARGUED) and not formulable for DEL, THIN, sign chains, HEAT (missing functional
  equation or missing Dirichlet series). No failure is a relation between different primes.
- Stage B was not opened; the numerics lane holds the requests.

## 4. Flags (this pass)

R1 false (no multiplicative step; (M) linear in Lambda). R2 false (window statement, but not a statement on
zero location; blind at stage level). R3 false (ZQ passes; twins pass per stage). R4 false (reaches the line
by (EF), as the band form N(theta'), which is not the target).

## 5. Surviving claim

No statement about zeros of zeta. On window vectors h = e^(ist) h_0 with norm(h_0') <= K norm(h_0), at
P = t^theta': the gamma side acts as the scalar Lg/2 + i pi/4 up to 8 (log t/t) norm(h_0') (Lemma S); the
mirror inequality (M) equals Lg times the first-order band form up to O(K t^(theta'/2 - 1) log t)
(Proposition M); in every form of degree at most 2 the gamma side multiplies words linear in Lambda
(Proposition C); all such forms coincide for zeta and the twins HQ1, HQ3, HQ4 (q >= P), HQ2 (q^2 >= P)
(K3-M). Controls: ZQ passes; no control fails at a cross-prime relation. The norm form is blind in the same
way and, under RH, would bound the ordinates per interval 2 pi/u by 2 (1 + 2 kappa)/theta'.

---

# INDEPENDENT REFEREE (separate session, lens: general), 2026-11-20

This section was written by a referee agent that did not write RESULT.md or the pass above. The pass above is
kept unchanged. Own script (not stored in this directory, by assignment "write only REFEREE.md"):
`/tmp/c20ref/ref2.py`, run locally through `scripts/memcap.sh 8 python3.14`, float64, own digamma (shift 20
plus Stirling, agreement with mpmath 9e-16 at 8 points), FFT route with an asymmetric window
h_0 = x^2 (1 - x)^3 e^(i tau s), x = s/u, at heights and exponents not used by the lane. No server unit.

**Verdict: holds, with corrections F1 to F6.** "Precise obstruction, no statement about zeros of zeta" stands.
Every step labelled PROVED at the claimed scope (degree <= 2, window vectors with bounded
norm(h_0')/norm(h_0)) was re-derived. One sentence that goes beyond that scope (F1) is not proved by the
argument given. Flags: R1 false, R2 false, R3 false, R4 false. Independent referees after this pass: 1.

## A. Re-derivation of the PROVED steps

| step | finding |
|---|---|
| Lemma S, near range | abs(psi'(z)) <= abs(z)^-2 + pi/(2 Im z) (sum against integral); with Im z >= t/4: abs(dG/dx) <= 4/t^2 + pi/(2t) < 1.7/t. Confirmed |
| Lemma S, far range | With r = abs(x - t)/t >= 1/2: log(2 + abs(x)) <= log t + 3r, so the difference is at most 2 log t + 6 + 3r <= (4 log t + 15) r <= 8 (log t) r for log t >= 3.75. Confirmed. The recalled bound abs(G(1/2 + ix)) <= (1/2) log(2 + abs(x)) + 3 was checked on 24000 points, abs(x) from 1e-9 to 1e9: slack at least 0.66 |
| Lemma S, pointwise, numerically | max over x of abs(G(1/2+ix) - G(1/2+it)) t/(abs(x - t) log t): 1.0005 (t = 43), 0.91 (1e2), 0.77 (1e3), 0.62 (7.3e4), 0.39 (1e7). Bound 8 holds with a factor 8 or more to spare |
| Lemma S, values at t | 2 theta'(t) = Lg - 1/(24 t^2) + ..., Im G(1/2 + it) = pi/4 + 1/(4t) + ...: re-derived from psi(z) = log z - 1/(2z) + ... |
| Causality, product rule | g bounded and analytic in Im x < 0 for h on [0, u]; G(1/2 + ix) analytic there; right shifts map [u, inf) into itself, so compressions of causal factors multiply. Confirmed |
| Proposition M | norm(Arch h)^2 - 2 Re<Arch h, A_P h> with Arch h = 2 theta'(t) h + P_u e. Error terms 2 Lg eps norm(h) + eps^2 + 2 eps norm(A_P) norm(h). Confirmed. norm(A_P) <= psi(P) P^(-1/2) + (1/2) int psi(x) x^(-3/2) dx <= 2.08 P^(1/2). Confirmed |
| Proposition C, degree <= 2 | All eight words with a letter Gamma were written as a pairing with P_u M_G h or P_u M_(conj G) h on one side (the letter Gamma is always adjacent to h, or is moved there by the adjoint). Confirmed at degree <= 2 only: see F1 |
| K3-M | log f(y) starts at y^j0; frequencies k log q >= u for q^j0 >= P; C_a = 0 for a >= u. Confirmed. Palindromic local factors give f(y) = f(1/y). HQ3/HQ4: zeros of 1 +- 2 cosh(A) y + y^2 at abs(y) = e^(+-A), that is Re s = 1/2 -+ A/log q. HQ2: (1 - y)^2/y = 2 cos phi - 2 real on abs(y) = 1. HQ1: cos phi = 1 - eps/2 has no solution for eps > 4. T-NR: 2 cosh + c = y^-1 (1 + c y + y^2), the factor y^-1 adds log q to Gamma_c. Confirmed |
| K1 for forms | Words in A_P, A_P* are trigonometric polynomials in z_p = p^(-it); twisted orbit is a translate of the Kronecker line. Confirmed. See F3 for the sup formula |
| P3 | abs(g_0)^2 = (8u/pi^2) cos^2(w/2)/(1 - (w/pi)^2)^2, w = uy; value u/2 at w = +-pi. Count bound follows under the stated assumption (real zeros). Confirmed |

## B. Numeric rerun, different cases

Lemma S operator norms and Proposition M defect, own code, window x^2 (1 - x)^3 e^(i tau s):

| t | theta' | tau | P | u/Lg | norm((Gamma - G_t) h) / bound 8 (log t/t) norm(h_0') | D_1 | D_2 | defect of Prop. M | bound of Prop. M (full constants) |
|---|---|---|---|---|---|---|---|---|---|
| 7.3e4 | 0.6 | -2 | 827 | 0.72 | 7.7e-7 / 1.4e-4 | 5.2e-8 | 2.6e-8 | -1.6e-6 | 1.9e-3 |
| 7.3e4 | 0.9 | -2 | 23822 | 1.08 | 9.2e-7 / 1.7e-4 | 9.9e-8 | 4.9e-8 | -2.2e-6 | 1.4e-2 |
| 3e6 | 0.6 | 5 | 7696 | 0.68 | 5.2e-8 / 1.2e-5 | 8.3e-9 | 4.2e-9 | 1.5e-7 | 5.8e-4 |
| 3e6 | 0.9 | 5 | 675163 | 1.03 | 6.4e-8 / 1.5e-5 | 2.3e-8 | 1.1e-8 | 2.1e-7 | 7.7e-3 |
| 2.5e7 | 0.85 | 0 | 1941999 | 0.95 | 4.2e-10 / 1.1e-7 | 1.4e-10 | 7.0e-11 | -2.3e-10 | 1.0e-4 |

All below the bound; D_2 = D_1/2 in every row; 1/t scaling as claimed. The first-order form
(Lg - 2 Re<h, A_P h>)/norm^2 in these rows: 10.16, 8.89, 10.65, 8.54, 11.54 (one window each; no statement).

Degree-3 word (not run by the lane): W = A_P* Gamma_c A_P*, defect = abs(<A_P h, Gamma_c A_P* h> - G_t <A_P h, A_P* h>),
grid Nyquist frequency 9.5 to 11.8 times t:

| t | theta' | P | norm((Gamma_c - G_t) A_P* h) | norm(A_P* h) | form defect | abs(<A_P h, A_P* h>) |
|---|---|---|---|---|---|---|
| 3e3 | 0.9 | 1347 | 2.1e-3 | 0.161 | 2.2e-7 | 1.1e-3 |
| 3e4 | 0.9 | 10700 | 8.2e-4 | 0.186 | 5.5e-8 | 4.0e-3 |
| 3e5 | 0.6 | 1933 | 1.6e-4 | 0.111 | 1.1e-9 | 5.5e-4 |

## C. Corrections

- **F1 (extension beyond degree 2 is not proved).** Section 2.4 ends "The same argument applies to words of
  any fixed length", the device row says "do not pair the gamma side with A_P ... at any polynomial order;
  the pairing is first-order", and correction E4 above repeats "at any polynomial order". The argument of
  Proposition C needs the vector that Gamma acts on to satisfy the hypothesis of Lemma S (k_0 in H^1).
  At degree <= 2 that vector is h. At degree 3 two words cannot be reduced to that case by commuting causal
  factors: A_P* Gamma_c A_P* and its adjoint A_P Gamma_c* A_P. There Gamma_c acts on A_P* h, which has a jump
  at s = 0 (compressed left shifts cut h_0 inside its support), so norm(k_0') is infinite and Lemma S gives
  nothing. Measured (table B): the operator error norm((Gamma_c - G_t) A_P* h) is 2.1e-3 at t = 3e3 and
  8.2e-4 at t = 3e4 (theta' = 0.9), a decay close to t^(-1/2), not log t/t; relative to norm(A_P* h) it is
  1.3e-2 and 4.4e-3, four orders above the Lemma S scale for h itself. The form defect in the three cells
  is small (2.2e-7, 5.5e-8, 1.1e-9), which is consistent with the error being concentrated at s = 0 where
  A_P h vanishes, but that is a float64 observation on one word and one window, not a proof. Required
  change: Proposition C and the device row are PROVED at degree <= 2; "any fixed length / any polynomial
  order" is CHECKED (3 cells, one word) and otherwise OPEN. The stop of the lane does not use it (K3-M holds
  at every degree).
- **F2 (E_0 in the display of (M)).** E_0(t) norm(h_0') norm(h_0) as printed does not contain the eps^2 term
  of Proposition M for vectors with 16 (log t/t) norm(h_0') > Lg norm(h_0). The candidate (M) is therefore
  matched to Proposition M only on vectors with norm(h_0') <= K norm(h_0), K = o(t/log t). Same restriction
  as E2; it should be in the display.
- **F3 (sup over the torus).** Section 2.5 (b): "sup over the torus of 2 Re<h, A_P^z h> =
  2 sum Lambda(n) n^(-1/2) abs(<h_0, C_(log n) h_0>)" is an equality only when the phases of all prime
  powers can be aligned at once (z_(p^k) = z_p^k is forced); in general it is <=, and for real h_0 >= 0 it
  is an equality at z = 1. P2 uses the point z = 1 and is correct for h_0 >= 0; for complex h_0 the stated
  lower bound with absolute values is not what z = 1 gives. Also "of order P^(1/2)/u": for h_0 in H^1_0 the
  autocorrelation vanishes at lag u to third order, so the size is P^(1/2) times a negative power of u
  larger than 1. The conclusion (some unimodular chain violates (M) when P^(1/2) exceeds a power of u times
  Lg) is not affected.
- **F4 (HQ2 spacing).** "in each case in every interval of heights of length 2 pi/log q <= 2 pi/u" holds
  for q >= P. For HQ2 the hypothesis is q^2 >= P, which gives 2 pi/log q <= 4 pi/u.
- **F5 (T-NR "whenever").** "(M) holds for it whenever it holds for zeta" is true through Proposition M (the
  first-order form gains 2 log q > 0) and therefore up to the error E_M, not as an exact implication between
  the two second-order inequalities.
- **F6 (dependence on c18).** The ZQ pass, and with it one of the two supports of the stop, is c18
  Proposition Z in the lattice model (refereed there with the qualifier "in the lattice model", c18 referee
  E7). It was not rerun here and is not established on zeta's ordinates. The other support, K3-M, is proved
  in this file and is sufficient for the stop.

Corrections E1 to E5 of the pass above were checked and stand, except that E4 carries the phrase corrected
by F1.

## D. Controls, assumptions, novelty

- No zeta-only mechanism is claimed, so there is no zeta-only step to break. The claim that the forms do
  not separate zeta from the twins was checked by re-deriving K3-M for HQ1 to HQ4 and T-NR (section A); the
  linearity in Lambda (no cross-prime relation in (M)) is immediate from Proposition M.
- Failure rows of stage A (E_a, fixed-q twins, DH, HEAT) remain ARGUED; DEL and THIN remain undecided. Not
  run here. They are not used by the stop.
- RH is assumed only in P3, where it is stated. No zero of zeta and no verified height is used.
- Novelty: Lemma S is the classical statement that the gamma term in a short window is log(t/2 pi);
  Proposition M is a polarisation identity; K3-M is the support argument of c19 K3. Nothing is presented as
  a new theorem about zeta. The recordable content is the negative one, at degree <= 2.

## E. Flags (independent referee)

R1 false: no step uses multiplicativity; (M) is linear in Lambda. R2 false: an identity with an error uniform
in t on a restricted class of vectors, not a statement on zero location, and the inequality is not
established for zeta. R3 false: twins pass per stage (PROVED), ZQ passes (model). R4 false: what reaches the
line is the first-order band form.

## F. Surviving claim

No statement about zeros of zeta. On window vectors h = e^(ist) h_0 with norm(h_0') <= K norm(h_0),
P = t^theta', t >= 43: (1) the gamma side acts as the scalar G(1/2 + it) = Lg/2 + i pi/4 + O(1/t) up to
8 (log t/t) norm(h_0'); (2) norm((Arch - A_P) h)^2 - norm(A_P h)^2 = Lg <h, (Lg - 2 Re A_P) h> + O(K t^(theta'/2 - 1) log t) norm(h_0)^2;
(3) in Hermitian forms of degree at most 2 (not proved beyond degree 2) the gamma side multiplies only
words linear in Lambda; (4) all forms in Gamma_c, Gamma_c*, A_P, A_P* on L^2[0, u], at every degree, have
the same value for zeta and HQ1, HQ3, HQ4 (q >= P), HQ2 (q^2 >= P), and for T-NR (q >= P) with Gamma_c
shifted by log q. No control fails at a relation between different primes; ZQ passes in the lattice model
of c18; DEL and THIN are undecided. The norm form is blind in the same way and under RH would bound the
number of ordinates per interval 2 pi/u by 2 (1 + 2 kappa)/theta' + o(1).
