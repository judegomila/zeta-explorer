# REFEREE (lens: general) for c4-thin-twist-control-78/RESULT.md

Date 2026-11-18. Claimed verdict: precise-obstruction. Referee verdict: **holds, with the corrections E1-E5 below.**
No statement about zeros of zeta is made in the result, and none is made here. Flags: R1 = R2 = R3 = R4 = false.

## 1. PROVED steps re-derived

| step | outcome |
|---|---|
| Greedy rule: c_n non-decreasing, c_n = n + min(0, min_{k<=n}(floor L(p_k) - k)) | confirmed by induction |
| Lemma 1 upper bound D <= 0 | confirmed |
| Lemma 1 lower bound D >= -C x^(b-eta) | confirmed after repair E1 (the proof as written uses H(theta) outside its stated range) |
| Thm 1(i): P_S = (1/2) E_1((s-b) log 2) + A(s), A analytic on Re s > b - eta | confirmed (D(2) = 0; parts; boundary term vanishes) |
| Thm 1(ii): log G = -2 P_S + T; E_1(w) = -gamma - log w + Ein(w); G = (s-b) W, W non-vanishing on Re s > max(b-eta, b/3) | confirmed; T has terms O(p^(-3 Re s)), sum over S converges for 3 Re s > b |
| Thm 1(iii): one simple pole at 1, residue G(1) = (1-b) W(1) > 0; zeros = zeros of zeta plus a simple zero at b | confirmed (zeta(b) != 0 on (0,1)) |
| Thm 1(iv): eps = 1 * g, g(p^k) = 2(-1)^k on S; Rankin; sum eps = G(1) x + O(x^(b+epsilon)) | confirmed; sum g(d)/d = prod (1-1/p)/(1+1/p) |
| Thm 1(v): M_eps != O(x^(b-delta)) | confirmed (1/F has a pole at b; F is meromorphic on a connected half-plane) |
| Lemma N: eps is not a character, not periodic | confirmed. A completely multiplicative +-1 function periodic mod q restricts to a real character on units; non-principal contradicts density zero of S, principal contradicts S infinite |
| Inert variant identity F * L(s, eps chi_-3) = zeta_F, L(s, eps chi_-3) = L(s, chi_-3)/G | confirmed factor by factor |
| Proposition D | confirmed against the manuscript text of Proposition 2.1 (paper.txt lines 381-460): its proof uses only boundedness of 1/L^S on Re s >= 2, (2.2), (2.4), (2.5), a contour shift to the right and Fourier inversion on Re s = 2. Wording correction E3 |

Manuscript quotes checked against `~/lean-deps/qrh-verify/paper.txt` (read as text): Proposition 5.1 does state that
phi(x) = chi_x(lambda)^2 Psi_0(x) "is L-periodic" for Psi_0 in a fixed finite family of finite-ray characters
(lines 1390-1401); Lemma 5.8 requires "a fixed finite family of multiplicative finite-ray characters" nu, and Section 6
sets nu_sigma(a) = eta(a) Xi(a)^-1 R(a, s_sigma), so the target enters the low estimate as a ray character; (7.4)
contains the scalar eta(A); Lemma 7.1 has eta only through eta(p) in local factors. The reading in the step table is
consistent with these passages. The table itself remains ARGUED (not replayed), as the result says.

## 2. Numeric check rerun, different case (b = 0.8, N = 2e7, own code)

Script `/tmp/ref-c4-thin/chk.py` (not in the lane directory), run through `scripts/memcap.sh 8`, `.venv-arb` python.
Independent of `thinlib.py`: plain-loop greedy rule, smallest-prime-factor recursion for eps and mu, direct Euler
product. Planned memory printed first (0.22 GB).

* pi(2e7) = 1270607, pi_S = 28067, L(2e7) = 28067.252; D at primes in [-0.9999992, 0]. First S: 5, 11, 23, 37, 53, 67.
* Factorisation G = (s-b) W tested without the continuation formula: direct product over p in S, p <= 2e7, times the
  tail factor exp(-int_X^inf x^(b-1-s) dx/log x):
  s = 1.2: 0.56142303 against (s-b) W(s) = 0.56142303. s = 1.5: 0.75410280 against 0.75410280.
* W(b) = 2.138385, c = G(1) = 0.343170, zeta(0.8) = -4.437538, residue prediction 1/(b zeta(b) W(b)) = -0.131729.
* M_eps(x)/x^0.8: -0.133600 (1e5), -0.129264 (1e6), -0.131319 (1e7), -0.132453 (2e7); range on (1e7, 2e7]:
  [-0.13419, -0.12942]. Consistent with the prediction at the 2 percent level; the scatter is larger than at b = 0.9
  because the fluctuation of size x^(1/2) is larger relative to x^0.8.
* sum eps(n) - c x at 2e7: -76.2.

The measured statements of the result reproduce in a second case with separate code. Arithmetic checks of the
reported b = 0.9 numbers: 1/(0.9 * -9.430114 * 2.307070) = -0.05107; slope log(944/17.95)/log(1e8/2e3) = 0.366.

## 3. Controls

The result claims no zeta-only mechanism, so there is nothing that has to fail for DH, backward heat, sign twist,
unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer or theta^w. Sanity checks done: S empty
gives F = zeta and no extra zero; Proposition D with a target that has no zero right of sigma_0 is vacuous.

## 4. Errors and corrections

**E1 (Lemma 1, repairable gap).** H(theta) is stated for x^theta <= h <= x. The proof applies it to y - x >= x^theta
with no upper limit (p_k and p_n may differ by more than a factor 2). Repair: split [x, y] at the points 2^j x; on each
full dyadic piece H(theta) with h = 2^j x gives pi-increment >= c_theta h/log(2^j x) >= L-increment (same condition
x_1^(b-1) <= 2 c_theta); the last partial piece either has length >= (its left end)^theta, same argument, or
contributes at most y^(theta+b-1). The conclusion D >= -C x^(b-eta) is unchanged (uses theta + b - 1 >= 0, true for
b > 1/2 and theta >= 1/2).

**E2 (unproved statement presented as fact; relies on a zero-free region).** Section 2: "For comparison the Mertens
function has M(x)/x^0.9 -> 0." This is not known. M(x) = o(x^0.9) would exclude zeros of zeta with real part above
0.9; it is available only from the unrefereed 7/8 manuscript. The same applies to the "prediction"
M_eps(x)/x^b -> 1/(b zeta(b) G'(b)): M_eps = h * mu with 1/G = sum h(d) d^-s, so the limit exists if
M(x) = O(x^(b-delta)), i.e. given a zero-free half-plane for zeta beyond b, and is false if zeta has a zero to the
right of b. The table is a finite-range measurement of agreement with the residue term; the limit statement must be
labelled conditional on no zeta zero in Re s > b - delta. Only Theorem 1(v) (the Omega statement) is unconditional.
This does not affect Theorem 1 or Proposition D.

**E3 (Proposition D, hypothesis wording).** "L(s, eta) is meromorphic near a point rho" is not enough: the argument
needs L to be continued meromorphically from Re s > 1 to rho along a connected open set inside Re s > beta - epsilon*
(so that 1/g, g the holomorphic continuation of 1/L^S, equals L^S there and cannot vanish). True for the control
(F meromorphic on Re s > sigma_1). Also Proposition D is the contrapositive of the manuscript's Proposition 2.1 read
for one function; it is a corollary of that proof, not a new theorem, and should be labelled so.

**E4 (verdict item 4 overstates the label).** "For the manuscript's own probe I_eps at least one of the low estimate
and the high comparison is false" is headed PROVED. It depends on (a) the split variant over Q(sqrt(-3)), which is
PROVED-rel a short-interval theorem in the progression 1 mod 3 that is RECALLED; (b) H_eps satisfying (2.2), which is
ARGUED; (c) identifying the manuscript's (2.4), (2.5) for Part II with the probe of (12.5), not walked. The body
(section 3.3) carries the right label "PROVED-rel that reading of (2.2)"; the verdict list and the node file should
use it. Proposition D as an abstract implication is proved.

**E5 (scope of "only", "single", "exactly one way").** "The same property is the only thing missing" at Lemmas 4.8,
8.1, 17.5, "the additional input ... is a single one", and "the target's own reciprocal (row u = 1) is never
reflected" are readings of a 12000-line manuscript by hypotheses. They are ARGUED and not checked here beyond the
passages listed in section 1. In addition the control does not belong to a twist-closed family: L(s, eps chi_u) for
u != 1 has no continuation past Re s = b from this construction (the result says so in weakest step 1), so the
manuscript's quantity beta* (a supremum over a twist-closed family) has no analogue. "First unavailable step" is a
statement about hypotheses; no step's conclusion is shown false for eps.

Minor.
* H(theta) with theta = 0.525 for all h in [x^theta, x] follows from the Baker-Harman-Pintz lower bound by
  subdivision; cited from memory in the result, exponent agrees with my recollection, not re-read here either.
* Constructions of multiplicative functions with a prescribed zero by altering primes on a thin set are of a known
  type (Beurling-type prime systems, modified Euler products). The result does not claim novelty beyond the campaign's
  control list; it should not be cited as a new theorem.
* S is defined in the code by float64 floor(L(p_n)); in my run no prime other than p = 2 had L within 1e-9 of an
  integer. No interval certificate, as the result states.

## 5. Checks on framing

* RH assumed: no. Verified height restated: no. Known theorem presented as new: see E3 and the second minor point.
* Unproved zero-free statement used: yes in one remark (E2), not in any proved step.
* No claim about zeros of zeta.

## 6. Flags (set by the referee)

* R1 false: no mechanism with essential multiplicativity is established; the result shows complete multiplicativity
  with unimodular parameters is compatible with a zero at b.
* R2 false: no height-uniform statement.
* R3 false: no attack is made; only this one control is walked against the 7/8 argument, by hypotheses.
* R4 false: nothing reaches the critical line.

## 7. What survives

For every b in (1/2, 1), relative to a Hoheisel-type short-interval theorem (after repair E1), there is a completely
multiplicative eps with values +-1, equal to 1 on primes of relative density one, such that
sum eps(n) n^-s = zeta(s)(s-b)W(s) with W analytic and non-vanishing on Re s > max(b-eta, b/3): one simple pole at 1,
a simple zero at b, partial sums c x + O(x^(b+epsilon)), M_eps not O(x^(b-delta)). eps is not periodic. Numerics at
b = 0.9 (result) and b = 0.8 (referee) agree with the construction. Proposition D holds as a corollary of the proof
of Proposition 2.1 (with the hypothesis of E3). The localisation "first unavailable hypothesis = ray-class
periodicity of the target weight in Proposition 5.1 / Lemma 5.8" is consistent with the manuscript text and remains
ARGUED; which of low estimate and high comparison is false for the eps-probe is open.
