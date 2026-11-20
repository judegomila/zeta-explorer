# n3-cm-taylor-central-values: zeta on the line as a linear form in square roots of central values

Verdict: **precise obstruction**. Lemma W is true (measured to 79 digits), the expansion of zeta in the
Taylor coefficients of theta_3 at i is true (Abel sense), and both statements hold in the same form for
Davenport-Heilbronn (measured to 30 digits). The mechanism does not separate zeta from DH, the expansion needs
about C(t)/(1-r) terms with C growing in t, and no sign rule or positivity was found. No statement about zeros.

All runs: local, single process, through `scripts/memcap.sh 8`, each under 30 s. Python: `.venv-arb/bin/python` (mpmath 1.3).
Scripts in this directory: `dn.py`, `lval.py`, `signs.py`, `cn_float.py`, `zcheck.py`, `controls.py`, `dh_firm.py`.

## 1. Plan and what is new against the map

Rows G14-G18 close Hecke actions on the twin ladder, lattice Hecke relations, Klein-Fricke and the metaplectic
cover; Q10 gives the l^1 / l^2 thresholds of the prime chain; L2 says Euler-at-p identifies the function.
None of them expands the theta vector in SO(2)-types at the CM point i. The plan was: (a) test lemma W;
(b) if true, tabulate signs, test the expansion at a zero and a non-zero, search for a sign rule or a Hankel/Jacobi
positivity; (c) run the controls.

Notation. theta(x) = sum_{m in Z} exp(-pi m^2 x). z = (1-x)/(1+x) (the disc coordinate centred at x = 1, i.e. tau = i).
G(z) = (1+z)^(-1/2) theta((1-z)/(1+z)) = sum_n G_2n z^(2n), G_2n = theta(1) d(n) Phi^n/(2n)!,
Phi = Gamma(1/4)^8/(128 pi^4), d(n) = 1, 1, -1, 51, 849, -26199, ... (Romik). Omega = Gamma(1/4)^2/(2 sqrt(2 pi)).
psi = Hecke character of Q(i) with psi((a)) = a for a = 1 mod (2+2i) (the curve y^2 = x^3 - x, conductor 32).

## 2. Work

### 2.1 Lemma W (MEASURED, 79 digits, n <= 10; index corrected)

The assignment's index psi^(4n+1) is off by a factor 2. theta_3 has only even Taylor coefficients at i, so the
derivative of order m = 2n pairs with psi^(4m+1) = psi^(8n+1).

**W.** L(psi^(8n+1), 4n+1) = (Omega/4) * 16^n * Phi^(2n) * d(n)^2 / (4n)!   for n = 0..10,
equivalently L(psi^(4m+1), 2m+1) = (pi/(4 sqrt 2)) * 4^m * (m!)^2/(2m)! * G_m^2 for even m.

- `lval.py`: central values by the approximate functional equation (80 digits, 900 terms; root number and conductor
  checked by the theta test F(1/y) = w y^(k+1) F(y)). max over n <= 10 of |ratio - 1| = 2.9e-79.
- L(psi^(8n+5), 4n+3) = 0: root number -1 (measured w = -1 for k = 5, 13, ..., 85). This matches the vanishing odd
  Taylor coefficients. Root numbers of psi^(8n+1) are all +1, so **sgn d(n) is not a root number**; it is the sign
  of the square root, which the L-value does not see.
- This is the Rodriguez-Villegas-Zagier type statement (CLASSICAL in kind; I did not locate the exact Q(i)
  statement with these constants, so it is recorded as MEASURED).

### 2.2 The expansion of zeta (PROVED in Abel sense; ordinary convergence not observed)

With h_n = G_2n - 2 binom(4n,2n)/16^n (the subtraction removes 1 + x^(-1/2), i.e. the two poles) and
J_m(t) = 2 * int e^{itu} sech^(1/2)(u) tanh^m(u) du, which satisfies J_0 = 2 |Gamma(1/4 + it/2)|^2/sqrt(2 pi),
(m + 1/2) J_{m+1} = m J_{m-1} + i t J_m, so J_m = J_0 * i^m (m!/(1/2)_m) P_m^{(1/4)}(t/2; pi/2) (Meixner-Pollaczek):

  2 pi^(-s/2) Gamma(s/2) zeta(s) = lim_{r -> 1-} sum_n h_n r^(2n) J_2n(t),   s = 1/2 + it.

Proof: classical Mellin formula for theta(x) - 1 - x^(-1/2) on 0 < Re s < 1; substitution x = e^(2u), z = -tanh u;
H(z) = sum h_n z^(2n) is bounded on [-1,1] (H(+-1) = -1/sqrt 2), the weight sech^(1/2) is integrable, dominated
convergence. (PROVED; the Mellin formula is CLASSICAL.)

Measured (`zcheck.py`, coefficients to n = 1200 from `cn_float.py`; values divided by |2 pi^(-s/2) Gamma(s/2)|):

| t | target | Abel r=0.99 err | r=0.995 | r=0.998 | partial sums N = 300, 600, 900, 1200 (err) |
|---|---|---|---|---|---|
| 0 | -1.4603545 | -0.0029 | -0.0014 | +0.0003 | -0.070, -0.038, -0.112, +0.109 |
| 14.1347251 (zero) | 0 | 0.0273 | 0.0145 | 0.0052 | -0.072, -0.005, -0.039, -0.108 |
| 20 | 1.1478424 | -0.176 | -0.093 | -0.039 | +0.032, +0.035, -0.113, -0.110 |
| 40 | -1.3088824 | 0.598 | 0.352 | 0.156 | +0.059, +0.044, -0.010, -0.023 |

- Abel error is about C(t)(1-r) with C = 2.7, 18, 60 at t = 14.1, 20, 40 (MEASURED). The number of K-types needed
  grows with t. "No window" is not true in practice: the cut-off in n is a window in the K-type variable.
- Plain partial sums do not settle (error about 0.1 at N = 1200). rms of h_n n^(1/4) is 0.97, 1.03, 1.05, 1.05 on
  (1,50], (50,200], (200,600], (600,1200], and |J_2n| is of order n^(-1/4), so terms have size n^(-1/2) with
  irregular signs (MEASURED). Ordinary convergence is OPEN and not supported by the data.
- An earlier version of `zcheck.py` had the kernel constant sqrt 2 instead of 2; found by a t = 0 test and fixed.

### 2.3 Signs of d(n) (MEASURED, n <= 300, exact integers)

`dn.py 300 1650`: integrality error 1e-355; first ten values match Romik. `signs.py`:
180 positive, 121 negative, no zero; 153 runs, longest 9; sign autocorrelation at lags 1..12 between -0.052 and
+0.052. The residues are periodic or eventually 0 (mod 5: 1,1,4,1,4,...; mod 8 period 4; mod 16 period 8; mod 3 and
mod 7 eventually 0), as known; they do not determine the sign. No sign rule found. The positive bias matches the
positive pole part 2 binom(4n,2n)/16^n ~ n^(-1/2) inside G_2n.

### 2.4 Hankel / Jacobi positivity (MEASURED: absent)

Exact Hankel determinants of orders 1..8, shift 0 and 1, for d(k), d(k)/k!, d(k)/(2k)!, d(k)/(4k)!: every one of
the eight sign strings changes sign (for example d(k): +----++-). None of these is a Hamburger or Stieltjes moment
sequence. No total positivity. Nothing turns the identity into an inequality.

## 3. Controls

**DH (decisive; contradicts the expected outcome).** theta_chi(x) = sum n chi(n) exp(-pi n^2 x/5), chi mod 5 with
chi(2) = i, weight 3/2; G_chi(z) = (1+z)^(-3/2) theta_chi((1-z)/(1+z)) = sum u_m z^m.
- PROVED: theta_chi(1/x) = eps x^(3/2) theta_chibar(x) gives u_m = (-1)^m eps conj(u_m), so arg u_m = phi + (m mod 2) pi/2
  mod pi with eps = e^(2 i phi). The functional-equation-even combination (the DH kernel) has coefficients
  2 e^(i phi) * (+-|u_2n|). Measured: arg(u_m)/pi = 0.0881041 or 0.5881041 mod 1 for m = 0..12.
- MEASURED (`dh_firm.py`, 30 digits, n = 0..6): |u_2n|^2 = |L(eps_5 psi^(8n+3), 4n+2)| * (4n+1)! / (R_0 16^n ((2n)!)^2),
  R_0 = 4.99366872196230333..., where eps_5(alpha) = chi(alpha mod (2+i)) * chibar(alpha mod (2-i)), conductor norm 800,
  |root number| = 1. Of the 32 characters tested (16 characters of (Z[i]/5)^*, with and without the chi_8 twist) this is
  the only one with constant quotient; the quotient is 16, the same as for zeta.
- So the DH Taylor coefficients **are** single signed square roots of central values. Lemma W holds for DH. The
  expansion in 2.2 uses only the functional equation (evenness of G) and so also holds for DH. The idea does not
  separate zeta from DH at any step. The only difference is which sequence of signs and central values appears,
  and no property of that sequence is available. DH sign string for n = 0..13: +---+++--+-+--.

**Backward heat.** The kernel is multiplied by e^(tau u^2/16) with u = -artanh z. This is multiplication of H(z) by
an even power series in z, so the new coefficients are h^tau_n = sum_j a_j(tau) h_{n-j}: a lower-triangular
mixing of K-types (the multiplier does not commute with SO(2)). The expansion still holds for every tau (PROVED,
same argument); the coefficients are finite combinations of square roots, so W fails in the single-term form.
Since DH satisfies W and has off-line zeros, W in single-term form is not a usable hypothesis either way.

**Sign twist.** Not formulable. There is no functional equation, hence no fixed point, no evenness and no CM value;
the coefficients of the Mellin kernel in z are not theta derivatives at a CM point.

**T-NR.** For q = 2 the kernel is sqrt2 theta(4x) + theta(x/4)/sqrt2 + c theta(x) = (c + sqrt2) theta_3 + (theta_2 + theta_4)/sqrt2
(CLASSICAL theta identities). MEASURED (`controls.py` A, m = 0..10, 20 digits): the Taylor coefficients e_m of
(1+z)^(-1/2) theta_4 satisfy L((psi chi_8)^(4m+1), 2m+1) = (pi/(2 sqrt 2)) 4^m (m!)^2/(2m)! e_m^2, conductor 64, for all m.
So W holds with a ramified character, and the T-NR coefficient is (c + sqrt2) G_2n + sqrt2 e_2n: a fixed linear form in
two signed square roots. The idea separates T-NR only by "one term versus two", which no step uses.

**MV-CAP flag.** The Plancherel form is sum_n h_n^2 ||J_2n||^2 = const * int |zeta(1/2+it)|^2 dt-type mean value
(||J_2n||^2 ~ n^(1/2), h_n^2 ~ n^(-1/2), divergent linearly, as the second moment must). It is a mean value and
certifies no window. The measured rms constant of G_2n n^(1/4) is 1.063.

## 4. Verdict

Precise obstruction, with three measured identities as by-products.
1. W is true with index 8n+1: L(psi^(8n+1), 4n+1) = (Omega/4) 16^n Phi^(2n) d(n)^2/(4n)!  (MEASURED, 79 digits).
2. zeta(1/2+it) is the Abel sum of h_n J_2n(t) (PROVED); it is a linear form in sgn d(n) sqrt(L(psi^(8n+1), 4n+1))
   plus an explicit pole part.
3. The same two statements hold for Davenport-Heilbronn with the family eps_5 psi^(8n+3) (MEASURED, 30 digits),
   and for T-NR (q = 2) with two families. The arithmetic of zeta enters only through the sign sequence sgn d(n)
   and the sizes of the central values; the signs show no rule to n = 300 and no Hankel positivity exists.
No pivot taken: the adjacent line (Hecke T(p^2) relating the coefficients at i to those at CM points of conductor p)
is rows G14 and G16.

## 5. Three weakest steps

1. W and the DH identity are numerical (79 and 30 digits, n <= 10 and n <= 6). They are not proved here, and the DH
   character eps_5 was found by search over 32 candidates, not derived. A Waldspurger/seesaw derivation is OPEN in this lane.
2. "No sign rule" is absence of evidence: tested are autocorrelation to lag 12, run statistics and Hankel signs in four
   normalisations to order 8. A Rademacher-type formula for G_2n as a sum over cusps probably exists and was not
   derived; it would describe the signs but is a sum over all cusps, not a positivity.
3. Non-convergence of the plain series and the growth of C(t) in the Abel error are measured at four values of t and
   n <= 1200 only; the size law h_n ~ n^(-1/4) is measured, not proved.
