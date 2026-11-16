# twist-rigidity: the Weil form summed over a family of Dirichlet twists (2026-11-16)

Labels: PROVED (complete argument here, author-checked only), CLASSICAL (literature), MEASURED (numerics here),
ARGUED (not written in full), OPEN.

**Verdict: precise obstruction. No statement about zeros of zeta is obtained. NO QED on RH.**
Summing the Weil form over a family of twists with non-negative weights and using orthogonality does remove prime
terms exactly (Theorems 1-3, PROVED, one identity MEASURED to 1e-11). The resulting family inequality is
unconditional and holds at supports of any length. It contains no information about any single member
(Theorem 4, PROVED): the prime mass of zeta is moved, exactly and linearly, into the zero sums of the non-principal
twists. Extracting a sign for W_zeta from it needs an upper bound with constant 1 on the twisted zero sums, which is
the same statement as W_zeta >= 0.

## 0. Plan; what is new against the atlas and earlier attempts

* Atlas (PR #27): no section treats a direct sum of Weil forms over characters. Sections 9-10 (arithmetic
  positivity, V7 floor) concern zeta alone.
* `rh-attempts/2026-11-01-contradiction.md`: one off-line zero, one L-function, a test concentrated at gamma_0;
  fails at the prime-side inequality (star_min). Not repeated. Here the object is the vector (W_chi(g))_chi and the
  question is whether orthogonality over chi gives a sign that the single form does not.
* Sibling `sym-power-positivity`: 3-4-1 type (pointwise) positivity with companions. Different positivity
  (pointwise squares, upper bounds on zero sums); here convolution squares (Weil direction).
* Walls. DH control: Section 5. Flow-blindness, MV-CAP, verified height: not engaged, the result is negative.

## 1. Setup

q prime, G = (Z/q)^*, chi_0 trivial. For chi != chi_0 take L(s, chi) (primitive, parity a_chi); for chi_0 take
zeta. f in L^2 with support in an interval of length T, g = f * f~ (g(x) = int f(y+x) conj f(y) dy), support
[-T, T], h(t) = |fhat(t)|^2 >= 0, g(0) = ||f||^2 = (1/2pi) int h.

Explicit formula (CLASSICAL), W_chi(g) := sum over nontrivial zeros 1/2 + i gamma of fhat(gamma) conj fhat(conj gamma):

    W_chi(g) = pole_chi(g) + arch_chi(g) - P_chi(g),
    arch_chi(g) = g(0) log(q_chi/pi) + (1/2pi) int h(t) Re psi(1/4 + a_chi/2 + it/2) dt     (q_chi = q, or 1 for zeta),
    pole_chi(g) = delta_{chi = chi_0} * 2 Re[ fhat(i/2) conj fhat(-i/2) ],
    P_chi(g) = sum_n Lambda(n) n^{-1/2} [ chi(n) g(log n) + conj chi(n) g(-log n) ].

GRH for L(s, chi) <=> W_chi(g) >= 0 for all such g (Weil; CLASSICAL).
For weights c : G^ -> R put W_c = sum_chi c_chi W_chi, c^(n) = sum_chi c_chi chi(n) for (n, q) = 1, and
c^(q^k) = c_{chi_0} (zeta is the only member with a term at powers of q).

## 2. Results

**Theorem 1 (prime annihilation; PROVED, elementary).**
P_c(g) = sum_n Lambda(n) n^{-1/2} [ c^(n) g(log n) + conj c^(n) g(-log n) ]. Hence if c^(n) = 0 for every prime
power n <= e^T, then for all g with support in [-T, T]

    W_c(g) = c_{chi_0} pole(g) + sum_chi c_chi arch_chi(g),        no prime term.

Special cases. (i) c = 1 on all of G^: c^ = phi(q) 1_{n = 1 mod q}, T < log q. This is the identity behind the
one-level density of Dirichlet L-functions (CLASSICAL). (ii) c = indicator of the characters trivial on a subgroup
H of index d: c^ = d 1_H, and the condition is "no prime power <= e^T lies in H". Then W_c is the Weil form of the
Dedekind zeta function of the cyclic field K of degree d and conductor q, in which every prime up to e^T is inert.
Proof: linearity and orthogonality; complete multiplicativity of chi puts the twist on the coefficients Lambda(n). []

MEASURED check (`check_identity.py`, `check_identity.json`): q = 7, d = 3 (cubic field of discriminant 49; 2, 3, 5
inert), f(x) = (x(L-x))^3 on [0, L], L = 1.9 < log 7. Zeros to height 120 from python-flint Hardy Z.
Zero side zeta + chi + chibar = 0.10423866061696; archimedean side with no prime term = 0.10423866062660;
residual -9.6e-12. Separately P_zeta = 0.137905883, P_chi = -0.068952942 = -P_zeta/2, and each single explicit
formula closes to 2e-11 and 6e-12.

**Theorem 2 (mass bound; PROVED, sharp).** Let c >= 0 and c^(p^j) = 0 for 1 <= j <= k for one prime p not dividing
q. Then sum_chi c_chi >= (k+1) c_{chi_0}. So annihilating all prime powers up to e^T with non-negative weights
needs total weight at least 1 + floor(T / log 2) per unit weight on zeta (q odd).
Proof. mu = sum_chi c_chi delta_{chi(p)} is a positive measure on the unit circle with int z^j dmu = 0 for
1 <= |j| <= k. The Fejer kernel F_k >= 0 has F_k(1) = k+1 and int F_k dmu = mu(circle). So
sum c_chi = int F_k dmu >= (k+1) mu({1}) >= (k+1) c_{chi_0}. Equality: case (ii) with d = k+1 and p inert. []
Consequence: non-negative weights cannot isolate zeta. Signed weights isolate anything (c = delta_{chi_0} minus the
Fourier expansion of the prime terms) but that is the explicit formula of zeta again, with no sign.

**Theorem 3 (unconditional family positivity at prescribed support; PROVED, elementary).** In case (ii), with K
totally real of degree d and discriminant D_K = q^{d-1}, for every g = f * f~ with support in [-T, T], T below the
least prime power in H:

    W_zeta(g) + sum_{chi != chi_0, chi|H = 1} W_chi(g)  >=  g(0) [ log D_K - d log(8 pi e^{gamma + pi/2}) - 4 sinh(T/2) ].

Proof. Theorem 1; Re psi(1/4 + it/2) >= psi(1/4) = -gamma - pi/2 - 3 log 2 (Re psi(sigma + it) increases in |t|);
(1/2pi) int h = g(0); |pole(g)| <= 2 |fhat(i/2)| |fhat(-i/2)| <= 4 sinh(T/2) g(0) by Cauchy-Schwarz on the support. []
For every T such fields exist with positive right side: choose a prime d > T / log 2 and, by Chebotarev in
Q(zeta_d, p^{1/d} : p <= e^T), a prime q = 1 mod d with every p <= e^T a d-th power non-residue, q large (CLASSICAL
existence, not effective here). Explicit instance (MEASURED search, `inert_search.py`): d = 7, q = 87403, least
prime in H is 271, T = 7 log 2 = 4.852, right side >= 8.21 g(0). d = 5, q = 91841: T = 5 log 2, margin 7.89.
The constant 8 pi e^{gamma + pi/2} = 215.33 is Odlyzko's GRH root-discriminant constant; Theorem 3 is that bound
read in the other direction. Status against the task's requirement: the inequality is unconditional, is not a
consequence of any finite zero verification (T is arbitrary) and is not the classical statement for strip-positive
tests (g here is any convolution square, so the test does see off-line zeros). It is nevertheless elementary, and by
Theorem 4 it has no content for zeta. I have not searched the literature for it; novelty is not claimed.

**Theorem 4 (obstruction: the family identity is independent of the prime data; PROVED).**
Let c >= 0 satisfy the annihilation condition of Theorem 1 at T. Let lambda be an arbitrary real function on the
prime powers n <= e^T and put P^lambda_chi(g) = sum lambda(n) n^{-1/2} [chi(n) g(log n) + conj chi(n) g(-log n)].
Then sum_chi c_chi P^lambda_chi(g) = 0 for all g supported in [-T, T]. Therefore:

1. The family identity W_c(g) = Arch_c(g) holds with Lambda replaced by any lambda (10 Lambda, -Lambda, a single
   prime). It does not constrain P_zeta(g), hence not W_zeta(g).
2. Exact transfer: sum_{chi != chi_0} c_chi [W_chi(g) - arch_chi(g)] = c_{chi_0} P_zeta(g). In words: the excess of
   the twisted zero sums over their archimedean mean equals the prime sum of zeta.
3. W_zeta(g) >= 0 is equivalent to
   sum_{chi != chi_0} c_chi [W_chi(g) - arch_chi(g)] <= c_{chi_0} [pole(g) + arch_zeta(g)].
   The right side is an upper bound on zero sums of the twists with constant exactly 1 (no margin; compare the
   refereed eq48 result that every margin theta < 1 is false). Known upper bounds on zero sums come from pointwise
   positivity Lambda(n)|sum b_chi chi(n)|^2 >= 0 and give only |P_chi(g)| <= P_zeta(|g|), which item 2 saturates.
Proof: orthogonality again; items 2-3 are item 1 with lambda = Lambda and the definition of W. []

Corollary (conditional on a hypothetical zero; PROVED). If zeta has an off-line zero and g_0 is a detecting test
with W_zeta(g_0) = -N < 0 and support T, then for every cyclic field K as in case (ii) with inert range beyond e^T,
sum_{chi != chi_0} W_chi(g_0) = Arch_K(g_0) + N. The twists carry a surplus of weighted zeros near gamma_0. This is
not a contradiction: the surplus N is at most P_zeta(|g_0|) <= about 4 e^{T/2} g(0), and no available bound caps
the twisted zero sums below arch + P_zeta(|g_0|).

Where the two masses meet (CLASSICAL inputs). Arch_K >= about (d-1) log q g(0). Unconditionally the least prime in
H is only known to be << q^{(d-1)/4 + eps} (Vinogradov-Linnik, Elliott), so log q >> T/(d-1) and Arch_K >> T g(0).
Under GRH the least prime in H is << (d log q)^2, so (d-1) log q >> e^{T/2}, the same order as the largest
possible prime mass 4 e^{T/2} g(0). The only regime where the conductor mass is smaller than the prime mass is a
field with small conductor and very long inert range. For d = 2 that is the Landau-Siegel scenario, where the
identity is the Deuring-Heilbronn phenomenon (zeta L(chi) has few low zeros) and is CLASSICAL.

Remark (different tests per character; ARGUED). With f_chi = sum_a chi(a) H(a, .) the direct sum is the Weil form on
functions on G x R, prime powers acting by (a, u) -> (na, u + log n). It is block-diagonal in chi, and
prime-avoiding supports S (nS disjoint from S) give the same kind of prime-free identity. Theorem 4 applies verbatim.

## 3. Selberg-class structure (Bombieri-Hejhal, converse theorems, Kaczorowski-Perelli)

* Bombieri-Hejhal (CLASSICAL, conditional): zeros of distinct primitive L-functions are statistically independent
  at the scale of the mean spacing. Item 2 of Theorem 4 is an exact dependence at the coarse scale 1/T >= 1/log q:
  the smoothed zero-count fluctuation of zeta_K / zeta equals minus that of zeta. Both hold; neither gives a sign.
* Kaczorowski-Perelli (CLASSICAL): degree-1 elements of the extended class S# are Dirichlet-polynomial combinations
  of shifted Dirichlet L-functions. DH lies in S#. Structure theorems valid on S# are Euler-blind.
* Converse theorems: functional equations of twists do separate DH, but only for some moduli (Section 5).
No route from these to a constraint on a zero of zeta was found.

## 4. Pivot (once)

After the positive-weight direct sum failed (Theorem 2 + 4), the adjacent idea was to bound the twisted zero sums
from above by a large-sieve average over the conductors q with a given inert range. Item 2 forces
sum_j |P_{chi^j}(g)|^2 >= P_zeta(g)^2/(d-1) for each such q; the large sieve gives sum over q <= Q of that
<= (e^T + Q^2) T^2 g(0)^2-type bounds. With P_zeta <= 4 e^{T/2} g(0) and Q >= d > T/log 2 this is satisfied
trivially (ARGUED, order-of-magnitude). It is the MV-CAP wall: a mean over moduli against a single height. Closed.

## 5. DH control

DH: f = alpha L(s, chi_5) + conj(alpha) L(s, conj chi_5), chi_5 odd of order 4, a_1 = 1, real coefficients.
For psi mod r, r prime != 5: twisting by a completely multiplicative psi commutes with the logarithmic derivative,
so -(f x psi)'/(f x psi) has coefficients c_f(n) psi(n), c_f supported on all n coprime to 5 (not only prime powers).
* Gauss-sum factorisation gives eps(chi_5 psi)/eps(conj chi_5 psi) = chi_5(r)^2 eps(chi_5)/eps(conj chi_5)
  (CLASSICAL). So f x psi satisfies a functional equation of the required shape iff chi_5(r) = +-1 iff
  r = +-1 mod 5 (PROVED from that formula; not checked numerically).
* For r = +-1 mod 5 and T < log r, case (i) of Theorem 1 holds verbatim for the family {f} u {f x psi : psi != psi_0}:
  the family zero sum is purely archimedean and positive, while the member f has off-line zeros. So the
  full-group family inequality is true for DH and is Euler-blind. This confirms Theorem 4 on a genuine example.
* Case (ii) (subgroup weights) fails for DH: it needs c^(n) = 0 on the support of c_f, and H contains small
  composite n with c_f(n) != 0. Here the Euler product is used, in the form "the logarithmic derivative is supported
  on prime powers". That use shortens the family (weight d instead of q-1). It does not add information about zeta.

## 6. Verdict and three weakest steps

Precise obstruction. Proved: Theorems 1-4 and the Corollary. Measured: the q = 7 identity and the two explicit
fields. Open: everything about zeros of zeta.

1. Theorem 4 is an obstruction for arguments that use the family only through non-negative weights, orthogonality
   and the explicit formulas. An argument that brings independent sign information on twisted zero sums is not
   covered; none is known at constant 1.
2. Section 5: the twisted functional equation of DH for r = +-1 mod 5 and the resulting family identity were derived
   by hand and not verified numerically.
3. Theorem 3 is stated for prime q and totally real cyclic K; the explicit-formula normalisation was checked only at
   q = 7, d = 3. Novelty of Theorem 3 was not checked against the literature. Section 4 is order-of-magnitude only.

Files: `check_identity.py`, `check_identity.json`, `inert_search.py`, `inert_search.json` (this directory).
