# REFEREE 2: Lemma U of c5-target-fe-order2-ledger (second, independent pass)

2026-11-18. Written by lane `c6-repair-referee-debts-r5`. Scope: Lemma U only (RESULT section 2), re-derived from the
definition in Proposition 2.1 of the manuscript (`~/lean-deps/qrh-verify/paper.txt` lines 368-460, read as text), then
attacked with re-expressions of the probe (row Voronoi, target functional equation, change of slope). No numerics
(the lemma is an identity-theorem argument; nothing to compute). No statement about zeros of zeta. The manuscript is
unrefereed; everything is relative to its Proposition 2.1 format.

## Outcome

**Lemma U holds as stated (PROVED; two referees).** No step fails. Two additions (both PROVED here) and one scope
limit:
- U-stab: the signal constant is also unchanged under a change of the probe by an amount below the comparison error.
- U-slope: a signal Z^(lambda s + c) with a different slope lambda cannot be compared to the same probe either,
  except in one degenerate configuration (stated below). This closes scope remark (i) of the first referee outside
  that configuration.
- Scope limit (unchanged): a probe J' that differs from J by as much as the top size of the signal is a different
  probe; Lemma U says nothing about its constant. The sentence "no reflection changes h" is true for identities and
  for approximations within the comparison error, and for nothing else.

Family 3.1 item 11 (re-expression of the present probe) stays closed. No PROVED step is broken.

## 1. Re-derivation

Definitions used. beta* = sup of 1/2 and the real parts of zeros of L(s, eta) over primitive finite-order Hecke
characters eta (2.1). beta_eta = the same supremum for one eta. sigma_0 < beta*. For i = 1, 2:
A_i(s) = e^((s-5/6)^2) H_i(s)/L^(S_i)(s, eta), H_i holomorphic on Re s > sigma_0 with abs(H_i - 1) <= 1/2,
f_i(Z) = (1/2 pi i) int_(2) Z^(s+c_i) A_i(s) ds, and one J with abs(J - f_i) << Z^(c_i + beta* - sigma_i) as
Z -> infinity, sigma_i > 0 independent of eta. Claim: c_1 = c_2.

Steps, each checked.
1. f_i(Z) << _B Z^(B + c_i) for 0 < Z <= 1 and every B > 2 (contour to Re s = B; H_i bounded, 1/L^S bounded on
   Re s >= 2, Gaussian). [as in Proposition 2.1]
2. For Re s > 2: int_0^inf f_i(Z) Z^(-s-c_i) dZ/Z = A_i(s) (Fourier inversion on the line Re s = 3, where both
   endpoint bounds give integrability; then the identity theorem). With c_1 = c_2 + d:
   int f_2(Z) Z^(-s-c_1) dZ/Z = A_2(s + d).
3. g = f_1 - f_2 = (f_1 - J) + (J - f_2) << Z^E for large Z, E = max_i (c_i + beta* - sigma_i), and g decays faster
   than any power at 0. So G(s) = int g Z^(-s-c_1) dZ/Z is holomorphic on Re s > E - c_1
   = beta* - min(sigma_1, sigma_2 + d) =: a, and G(s) = A_1(s) - A_2(s + d) for Re s > 2.
4. A_2(s + d) is holomorphic on Re s > max(sigma_0, beta_eta) - d (H_2 holomorphic on Re s > sigma_0; 1/L^S
   holomorphic to the right of beta_eta; a pole of L only gives a zero of 1/L; deleted Euler factors are non-zero on
   Re s > 0). Hence A_1 = G + A_2(. + d) is holomorphic on Re s > max(a, max(sigma_0, beta_eta) - d).
5. abs(H_1) >= 1/2 on Re s > sigma_0, so every zero of L(s, eta) with real part > sigma_0 is a pole of A_1. Hence
   no zero has real part > max(sigma_0, a, max(sigma_0, beta_eta) - d). If beta_eta > sigma_0 the third entry is
   beta_eta - d < beta_eta (d > 0), and zeros approach beta_eta, so beta_eta <= max(sigma_0, a).
6. a < beta* and sigma_0 < beta*, with a independent of eta (sigma_i and d are). So sup_eta beta_eta < beta*:
   contradiction. d < 0: exchange the indices. QED

What is used: the definition of beta* as a supremum over the family; H_1 without zeros; H_2 holomorphic; sigma_i
independent of eta. What is not used: the low estimate (2.4), any Euler product property beyond "zeros of L are
poles of 1/L", any property of J. Consequence for the flags: R1 false, R3 false (the lemma holds for every family
admitted by the format), as the first referee set them.

Necessity of the hypothesis on H. With H allowed to vanish the lemma is false: f with constant c - delta and
H = 1 equals a signal with constant c and H(s) = L(s)/L(s + delta) after the shift s -> s + delta. The bound
abs(H - 1) <= 1/2 is what fixes c. This is the one place a "re-expression of the signal" could move c, and the
format excludes it.

## 2. Attempts to break it

**(a) Voronoi on the row (Proposition 5.1).** Read at paper.txt 1391-1440: Proposition 5.1 transforms the
completed smoothed sum (Mellin integral of T(s, Psi) against a Schwartz-type V) and is an identity. Replacing a row
by its dual expression leaves the number J_eta(Z) unchanged. Lemma U applies with the same J: same c.

**(b) Voronoi followed by truncation or re-weighting of the dual.** Now J' = J + R. 

*Lemma U-stab [PROVED].* If abs(J - f_1) << Z^(c_1 + beta* - sigma_1), abs(J' - f_2) << Z^(c_2 + beta* - sigma_2) and
abs(J' - J) << Z^(c_1 + beta* - sigma_3) with sigma_3 > 0 independent of eta, then c_1 = c_2.
Proof. abs(J' - f_1) << Z^(c_1 + beta* - min(sigma_1, sigma_3)); apply Lemma U to J'. QED

So a truncated or re-weighted dual has the same constant unless the discarded part R is at least Z^(c + beta* - o(1))
for targets with zeros near beta*, i.e. as large as the signal at its top exponent. In that case J' is a different
probe and the question "what is its h" is the open lemma ORDER-2 of STRATEGY 4.0, not a re-expression.

**(c) Target functional equation.** The target enters f only as 1/L^S(s, eta) on Re s = 2. Substituting
L(s, eta) = eps X(s) L(1 - s, conj eta) under the integral is an identity of the integrand: f is the same function
of Z, J is untouched, Lemma U applies verbatim. Moving the contour to Re s < 0 and expanding (Lemma V of the lane)
is again an identity when it is legitimate; it expresses f as a sum over zeros plus a reflected integral. A
"reflected signal" taken alone, phi(Z) = (1/2 pi i) int Z^(-s + c') B(s)/L(s, conj eta) ds on a line Re s = 2, is
O_B(Z^(c' - B)) for every B as Z -> infinity (contour to the right): it is negligible at infinity, so comparing J
to it is the statement that J is small, which is the low estimate, not a second signal. It lives at Z -> 0.

**(d) Different slope.** Signals f_i(Z) = (1/2 pi i) int_(2) Z^(lambda_i s + c_i) A_i(s) ds, lambda_i > 0, compared
to one J with errors Z^(e_i - sigma_i), e_i = lambda_i beta* + c_i.

*Lemma U-slope [PROVED].* (1) e_1 = e_2. (2) If some target has a zero rho != beta* with
Re rho > beta* - eps_0 (eps_0 > 0 explicit below), then lambda_1 = lambda_2 and c_1 = c_2.
Proof. int f_i(Z) Z^(-w) dZ/Z = lambda_i^-1 A_i((w - c_i)/lambda_i) for Re w large (substitute Y = Z^lambda_i).
The i-th term is meromorphic on Re w > lambda_i sigma_0 + c_i with poles exactly at w = lambda_i rho + c_i, rho a
zero of L(s, eta) with Re rho > sigma_0. Their difference G(w) is holomorphic on Re w > E = max_i (e_i - sigma_i).
Put m = max_i (lambda_i sigma_0 + c_i) = max_i (e_i - lambda_i (beta* - sigma_0)).
(1) Suppose e_1 > e_2. Then max(E, m, e_2) < e_1. Choose eps with e_1 - lambda_1 eps above that maximum and a
target with a zero rho, Re rho > beta* - eps. Term 1 has a pole at w_0 = lambda_1 rho + c_1; every pole of term 2
has real part <= lambda_2 beta_eta + c_2 <= e_2 < Re w_0. So G has a pole in Re w > E. Contradiction.
(2) Let e = e_1 = e_2, lambda_1 < lambda_2, kappa = lambda_1/lambda_2 < 1. max(E, m) < e; let eps_0 > 0 be such
that Re w > e - lambda_2 eps_0 implies Re w > max(E, m). In that region the pole sets of the two terms coincide.
Take a zero rho_0 != beta* of some L(s, eta) with Re rho_0 > beta* - eps_0. The pole of term 1 at
lambda_1 rho_0 + c_1 is in the region, so it is a pole of term 2: rho_1 = beta* + kappa (rho_0 - beta*) is a zero
of the same L (using c_1 - c_2 = (lambda_2 - lambda_1) beta*). rho_1 is closer to beta* and still in the region.
Iterating, beta* + kappa^k (rho_0 - beta*) are distinct zeros of L(s, eta) converging to beta*, a point where
L(s, eta) is meromorphic and not identically zero. Contradiction. QED
Degenerate configuration not excluded by (2): every zero with real part > beta* - eps_0, over all targets, is the
real point beta* itself. Then the top of each signal is a pure power Z^e and the slope is not determined by it.
Equal slopes (Lemma U proper) have no exception.

Reading for the ledger: in the abscissa formula the pair (slope, constant) is fixed by the probe; with slope
lambda the abscissa read off a low exponent L is (L - c)/lambda, and neither entry can be traded by a second
representation.

**(e) Two targets.** A signal written with conj eta instead of eta has poles at the conjugate points; real parts
are unchanged and the arguments of section 1 use real parts only. No change.

## 3. Checks against the uses made of Lemma U

- STRATEGY 4.0, first bullet ("needs a different probe, not a re-expression"): supported, with "re-expression"
  meaning an identity or an approximation within the comparison error (U, U-stab). Now two referees.
- RESULT consequence (b) (the frequency length hhat of a Poisson step is not a signal exponent): consistent with U;
  the lane's explanation of which step fails (the reflected summand is not periodic in m because of the root
  number of Lemma 5.7) is ARGUED there and was not re-derived here.
- h <= 1 is the geometry hypothesis lx >= l, not a consequence of Lemma U (first referee; agreed).
- Statement 3 of the lane's verdict and the proposed row Z15b were corrected by the first referee (E1-E3); the
  corrected wording is the one entered in the map as row Z15b by this lane. The LP values were not rerun here.

## 4. Flags (this referee)

R1 false, R2 false, R3 false, R4 false: an invariance lemma; no estimate, no control separated, nothing about zeros.
