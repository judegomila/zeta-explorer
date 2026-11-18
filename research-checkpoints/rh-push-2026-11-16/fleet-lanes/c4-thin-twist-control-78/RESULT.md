# c4-thin-twist-control-78: a completely multiplicative unimodular twist with a zero in (7/8, 1), run against the 7/8 argument

Date 2026-11-18. Slug `c4-thin-twist-control-78`. Kind: deepen (control owed since round 1). Scope: this directory only.
Not refereed. Nothing committed or pushed. No statement about zeros of zeta is made. RH open. 7/8 (unrefereed manuscript,
`~/lean-deps/qrh-verify/paper.txt`; its section, lemma and equation numbers are used below) stands. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X (complete given the cited input X) / CLASSICAL / RECALLED (cited
from memory, not re-read) / MEASURED / ARGUED (read from the manuscript's displayed formulas and hypotheses, proofs not
replayed) / HEURISTIC / OPEN.

## Verdict

Precise obstruction, with one constructed control.

1. **The control exists (Theorem 1, PROVED-rel a Hoheisel-type theorem on primes in short intervals).** For every
   b in (1/2, 1) there is a set S of primes with pi_S(x) = L(x) + O(x^(b-eta)), L(x) = (1/2) int_2^x t^(b-1) dt/log t,
   such that for eps completely multiplicative, eps(p) = -1 on S and +1 elsewhere,
   F(s) = sum eps(n) n^-s = zeta(s) (s - b) W(s) with W analytic and non-vanishing on Re s > max(b - eta, b/3).
   F is meromorphic there with one simple pole (s = 1, residue c = prod_{p in S} (p-1)/(p+1) > 0); its zeros there are
   the zeros of zeta and one simple zero at s = b. Partial sums: sum_{n<=x} eps(n) = c x + O(x^(b+epsilon)) (PROVED,
   elementary); sum_{n<=x} mu(n) eps(n) is not O(x^(b-delta)) for any delta > 0 (PROVED). eta = 0.475 with
   Baker-Harman-Pintz (RECALLED), eta > 0 with any Hoheisel exponent.
2. **Numerics (MEASURED, b = 0.9, primes to 1e9; float64 + mpmath).** The discrepancy pi_S(p) - L(p) stays in
   [-1, 0] for all 50,847,534 primes below 1e9. The regularised sum A_X(s) is stable to 1e-8 at s = 0.9 and to 2e-6 at
   s = 0.6. G'(b) = 2.30706993, c = 0.204018005. Independent sieve to 1e8: sum_{n<=x} mu(n) eps(n) / x^0.9 = -0.051038
   at x = 1e8 against the residue prediction 1/(b zeta(b) G'(b)) = -0.051072; sum eps(n) - c x has block suprema
   growing with exponent about 0.37 to 0.45 (944 at x = 1e8).
3. **Where the 7/8 argument stops for the control (ARGUED from the manuscript's hypotheses; Proposition D PROVED).**
   Every step that uses the target only through complete multiplicativity and abs(eta(p)) = 1 holds for eps: deletion
   of Euler factors (Section 2), Proposition 2.1, the probe (6.1), the identity (6.2), the exact Poisson series (7.5),
   the local identity Lemma 7.1 / (7.13), the sextic large sieve Lemma 9.1 (arbitrary coefficients).
   The first step that is unavailable is one line of **Proposition 5.1**: "the function phi(x) = chi_x(lambda)^2
   Psi_0(x) on O is L-periodic", i.e. the target weight is a function on a finite ray class group. It is used through
   Lemma 5.2 and Lemma 5.8 in the low estimate (Proposition 6.3, Proposition 15.3). The same property is the only
   thing missing at the high-side steps that fail later (Lemma 4.8 Hecke strip growth, Lemma 8.1 reflected-line
   bound, Lemma 17.5 masked primitive Poisson). eps is not periodic modulo any ideal (Lemma N, PROVED).
4. **Dichotomy (Proposition D, PROVED; independent of the rest of the manuscript).** Proposition 2.1 holds verbatim
   for eps with beta* replaced by b. So for every admissible H and every J, the low bound (2.4) at sigma_0 < b and the
   high comparison (2.5) at C(b) cannot both hold. For the manuscript's own probe I_eps at least one of the low
   estimate and the high comparison is false, not just unproved. Which one is OPEN (heuristic in section 3.4: the low
   estimate).
5. **Comparison with Z18.** The one-prime twin fails at a local size condition and passes every global step; the thin
   twist passes every local step and fails at the global additive step. The two controls test complementary axioms.

What this says about R4: complete multiplicativity, unimodular local parameters at every prime, continuation past the
abscissa, one simple pole at 1, agreement with zeta at a set of primes of relative density one, and partial sums
c x + O(x^(b+epsilon)) are all consistent with a zero at any prescribed b in (7/8, 1). The additional input of the 7/8
mechanism is a single one: **the coefficient sequence is invariant under translation by a lattice (for zeta: a(n) = 1
on Z), so that for every modulus q and every multiplicative chi mod q the sequence a(n) chi(n) is q-periodic and
every sum of length N has a Poisson dual of length q^k/N, uniformly in q.** It is used in the conductor aspect of a
family (theta rows and L-functions twisted by sextic symbols of varying modulus), not as the functional equation
s <-> 1-s of the target at one height: the target's own reciprocal 1/L(x, eta) (row u = 1) is never reflected.

---

## 0. Plan

Read: BRIEF; OBSTRUCTION_MAP rows Z15, Z18 and section 2 (controls, three questions); `r3-method-limit/RESULT.md`;
`r3-tnr-control/RESULT.md` (step list S0-S6); `c1-missing-controls/RESULT.md` (headings and flags);
`formalization/paper/zf-campaign-synthesis.md`; `stack-combinator/TABLE.md`; manuscript Sections 2, 4.4, 5.1, 5.5,
6.1, 6.2, 7.1, 7.2, Lemmas 8.1, 9.1, 17.5 (statements and the passages quoted below).

Decisive first test: does a completely multiplicative +-1 twist with an exact simple zero at a prescribed
b in (7/8, 1) and continuation to the left of b exist? Yes (section 1), so the lane continues to the walk.

New relative to the map: controls U, TW- and the Liouville twist lack the functional equation but have no known zero
in 7/8 < Re s < 1 with continuation (Liouville's zeros have Re s <= 1/2); FM and NR change finitely many local
factors; B is not an ordinary Dirichlet series over the integers. None is a unimodular completely multiplicative
ordinary Dirichlet series with a zero at a prescribed point of (7/8, 1) and continuation across it.

---

## 1. Construction

Fix b in (1/2, 1). Let p_1 < p_2 < ... be the primes and
L(x) = (1/2) int_2^x t^(b-1) dt / log t = (1/2)(Ei(b log x) - Ei(b log 2)).
Define c_0 = 0, c_n = min(c_{n-1} + 1, floor(L(p_n))), and S = { p_n : c_n = c_{n-1} + 1 }. Then pi_S(p_n) = c_n.
(The integrand t^(b-1)/log t is decreasing on t > 1, and floor(L(p_n)) is non-decreasing, so c_n is non-decreasing
and c_n = n + min(0, min_{k<=n}(floor(L(p_k)) - k)).)

Put D(x) = pi_S(x) - L(x), eps(p) = -1 for p in S and +1 otherwise, extended completely multiplicatively,
G(s) = prod_{p in S} (1 - p^-s)/(1 + p^-s), F(s) = sum_n eps(n) n^-s = zeta(s) G(s) for Re s > 1.

**Input H(theta) [CLASSICAL; exponent RECALLED].** There are theta < 1, c_theta > 0, x_theta with
pi(x + h) - pi(x) >= c_theta h / log x for x >= x_theta and x^theta <= h <= x. Hoheisel (1930) for some theta < 1;
Baker-Harman-Pintz (2001) for theta = 0.525. Put eta = 1 - theta.

**Lemma 1 (discrepancy) [PROVED-rel H(theta)].** -C x^(b-eta) <= D(x) <= 0 for x >= 2.

Proof. Upper bound: c_n <= floor(L(p_n)) <= L(p_n), and L increases between primes. Lower bound at x = p_n: if the
minimum in c_n = n + min(0, min_k(...)) is 0 then every prime up to p_n is in S, which holds for finitely many n since
L(p_n) < n eventually. Otherwise c_n = floor(L(p_k)) + (n - k) for some k <= n, so
D(p_n) >= -1 - [ (L(p_n) - L(p_k)) - (pi(p_n) - pi(p_k)) ].
For 2 < x < y, L(y) - L(x) <= (y - x) x^(b-1) / (2 log x). If y - x >= x^theta and x >= x_1 (where x_1 >= x_theta and
x_1^(b-1) <= 2 c_theta), then pi(y) - pi(x) >= c_theta (y - x)/log x >= L(y) - L(x) and the bracket is <= 0. If
y - x < x^theta the bracket is at most x^(theta+b-1). If p_k < x_1, split at x_1; the part below x_1 is O(1).
Between primes, p_n <= x < p_{n+1}: D(x) = D(p_n) - (L(x) - L(p_n)) >= D(p_n) - p_n^(theta+b-1), since H(theta) gives
p_{n+1} - p_n <= p_n^theta for large n. QED

**Theorem 1 [PROVED-rel H(theta); (iv) and Lemma N PROVED outright].** Let sigma_1 = max(b - eta, b/3).

(i) P_S(s) = sum_{p in S} p^-s converges absolutely for Re s > b, and there
    P_S(s) = (1/2) E_1((s - b) log 2) + A(s),  A(s) = s int_2^inf D(x) x^(-s-1) dx,
    with A analytic on Re s > b - eta and abs(A(s)) <= C abs(s)/(Re s - b + eta).
(ii) G(s) = (s - b) W(s) for Re s > b, where
    W(s) = log 2 * e^gamma * exp( -Ein((s - b) log 2) - 2 A(s) + T(s) ),
    Ein(w) = int_0^w (1 - e^-t) dt/t (entire), T(s) = sum_{p in S} [ log((1 - p^-s)/(1 + p^-s)) + 2 p^-s ] (terms
    O(p^(-3 Re s)), analytic on Re s > b/3). W is analytic and has no zero on Re s > sigma_1.
(iii) F(s) = zeta(s)(s - b) W(s) is meromorphic on Re s > sigma_1. Its only pole is simple, at s = 1, with residue
    c = G(1) = prod_{p in S} (p - 1)/(p + 1) > 0. Its zeros on Re s > sigma_1 are the zeros of zeta and a simple zero at
    s = b (zeta(b) < 0 for 0 < b < 1). Relative to the 7/8 manuscript, s = b is the only zero of F in Re s > 7/8 when
    b > 7/8.
(iv) sum_{n<=x} eps(n) = c x + O_epsilon(x^(b+epsilon)).
(v) M_eps(x) = sum_{n<=x} mu(n) eps(n) is not O(x^(b-delta)) for any delta > 0.

Proof. (i) D(2) = 0 (2 is not in S because L(2) = 0). Stieltjes integration:
P_S(s) = int_2^inf x^-s dL(x) + int_2^inf x^-s dD(x). The first integral is
(1/2) int_{log 2}^inf e^(-(s-b)u) du/u = (1/2) E_1((s - b) log 2) for Re s > b. The second is
s int_2^inf D(x) x^(-s-1) dx by parts, absolutely convergent for Re s > b - eta by Lemma 1.
(ii) log G(s) = -2 sum_{j>=0} P_S((2j+1)s)/(2j+1) = -2 P_S(s) + T(s), and E_1(w) = -gamma - log w + Ein(w), so
exp(-E_1((s-b) log 2)) = (s - b) log 2 * e^gamma * exp(-Ein((s-b) log 2)).
(iii) follows from (ii) and F = zeta G; the right side is single-valued, so no branch at s = b.
(iv) eps = 1 * g with g multiplicative, g(p^k) = 2(-1)^k for p in S and 0 for p not in S, k >= 1. So
sum_d abs(g(d)) d^-sigma = prod_{p in S} (1 + p^-sigma)/(1 - p^-sigma) < infinity for sigma > b, hence
sum_{d<=x} abs(g(d)) <= C_epsilon x^(b+epsilon) and sum_{d>x} abs(g(d))/d <= C_epsilon x^(b-1+epsilon). Then
sum_{n<=x} eps(n) = sum_{d<=x} g(d) floor(x/d) = x G(1) + O(x^(b+epsilon)).
(v) 1/F(s) = sum mu(n) eps(n) n^-s = s int_1^inf M_eps(x) x^(-s-1) dx for Re s > 1. If M_eps(x) = O(x^(b-delta)) the
integral is analytic on Re s > b - delta, contradicting the pole of 1/F at s = b. QED

**Lemma N (no periodicity) [PROVED].** eps is not a Dirichlet character to any modulus, and the function on ideals of
O = Z[omega] built from it below is not a ray class character to any modulus.
Proof. A character of a finite ray class group that differs from 1 takes a value != 1 on some class, and every ray
class contains primes of positive relative density (Dirichlet, Hecke). The set where eps = -1 on primes is S, of
relative density zero. So such a character would be principal, giving eps(p) = 1 for all p prime to the modulus,
while S is infinite. QED

Remarks.
* eps(p) = 1 on a set of primes of relative density one: pi_S(x)/pi(x) ~ x^(b-1)/(2b).
* A zero at b + i tau: replace eps(n) by eps(n) n^(-i tau) (still completely multiplicative and unimodular).
* A zero of order m: use L(x) = (m/2) int_2^x t^(b-1) dt/log t (m a positive integer); then G = (s - b)^m W.
  A non-integer multiple gives a branch point; that is why the density constant is 1/2.
* **Version over F = Q(sqrt(-3)) (split variant) [PROVED-rel H(theta) in the progression 1 mod 3, RECALLED].** Run
  the same greedy rule on the primes p = 1 (mod 3); for p in S choose one of the two prime ideals above p; let
  eps_K be completely multiplicative on ideals, -1 on the chosen primes and +1 on all others. Then
  L_F(s, eps_K) = zeta_F(s) G(s): a completely multiplicative unimodular function on ideals of O, simple zero at b.
  This is the object fed to the manuscript in section 3.
* **Inert variant [PROVED-rel H(theta) in the progression 2 mod 3].** If S consists of primes p = 2 (mod 3), then
  eps o N = 1 on ideals of O and F(s) L(s, eps chi_-3) = zeta_F(s) exactly, with L(s, eps chi_-3) = L(s, chi_-3)/G(s).
  The zero of F at b is cancelled by a pole of the cofactor. The statement over F sees nothing; the step that fails is
  the quadratic transfer (Proposition 11.3), which uses that both factors of zeta_F are entire L-functions of
  characters.
* Growth: the bound in (i) allows abs(W(s)) up to exp(C abs(s)). No polynomial bound on vertical lines is proved, and
  none is needed here.

Closest-variant label: exact regularity (D bounded) is not proved; it would follow from prime gaps of size
o(x^(1-b) log x). What is proved is D = O(x^(b-eta)), which is enough for every claim above. Measured: D in [-1, 0]
up to 1e9.

---

## 2. Numerical check (b = 0.9)

Files: `thinlib.py` (segmented sieve and greedy rule), `step1.py`, `step1_1e9.log`, `step1_1e+09.json`,
`step2.py`, `step2_1e8.log`, `step2_1e+08.json`. Runs through `scripts/memcap.sh 8`, python from `.venv-arb`
(numpy 2.5.3, scipy 1.18.1, mpmath 1.3.0). Planned memory printed first: step1 < 0.5 GB, step2 < 1.5 GB. Run times
8 s and under 1 minute. Arithmetic: float64 sums; mpmath (30 digits) for the integrals. In the computation S is
defined by the float64 value of floor(L(p_n)) (scipy `expi`); a different rounding at a boundary would shift single
memberships and change nothing below at the stated accuracy. Nothing here is an interval certificate.

**Discrepancy (MEASURED).**

| X | pi(X) | pi_S(X) | L(X) | range of D at primes <= X |
|---|---|---|---|---|
| 1e6 | 78498 | 11094 | 11094.394 | [-1.0000, 0] |
| 1e7 | 664579 | 74363 | 74363.711 | [-1.0000, 0] |
| 1e8 | 5761455 | 511162 | 511162.400 | [-1.0000, 0] |
| 1e9 | 50847534 | 3579393 | 3579393.369 | [-1.0000, 0] |

Just before a prime the deficit L(p_n) - c_(n-1) reaches at most 1.9665 over the whole range to 1e9 (the script records
this only as a running maximum over full segments).

First members of S: 5, 11, 17, 29, 37, 43, 59, 67, 83, 97, 109, 127.

**Continuation (MEASURED).** A_X(s) = sum_{p in S, p<=X} p^-s - (1/2) int_2^X x^(b-1-s) dx/log x converges as X grows
for Re s on both sides of b; W(s) = G(s)/(s - b) from Theorem 1(ii).

| s | A_X, X = 1e7 | X = 1e8 | X = 1e9 | W(s) at X = 1e9 |
|---|---|---|---|---|
| 0.9 (= b) | -0.317873578 | -0.317873501 | -0.317873510 | 2.307069927 (= G'(b)) |
| 0.901 | -0.317563592 | -0.317563516 | -0.317563525 | 2.304172140 |
| 0.8 | -0.350398221 | -0.350397817 | -0.350397870 | 2.621969855 |
| 0.6 | -0.424718338 | -0.424707121 | -0.424708932 | 3.387532406 |
| 0.8 + 10i | -0.289614184 + 0.313713683i | -0.289614395 + 0.313713882i | -0.289614356 + 0.313713945i | -0.096273153 - 0.168344511i |
| 1.0 | -0.288314878 | -0.288314863 | -0.288314865 | 2.040180046 (c = 0.1 W(1) = 0.204018005) |

**The zero at b seen in the inverse sums (MEASURED, independent sieve of mu(n) eps(n) to 1e8).** Prediction from the
residue of 1/F at b: M_eps(x)/x^b -> 1/(b zeta(b) G'(b)) = 1/(0.9 * (-9.430114019) * 2.307069927) = -0.051071638.

| x | sum eps(n) | sum eps(n) - c x | M_eps(x) | M_eps(x)/x^0.9 |
|---|---|---|---|---|
| 1e5 | 20356 | -45.8 | -1606 | -0.050786 |
| 1e6 | 203910 | -108.0 | -12758 | -0.050791 |
| 1e7 | 2040288 | 108.0 | -101859 | -0.051050 |
| 5e7 | 10200894 | -6.2 | -433376 | -0.051026 |
| 1e8 | 20402314 | 513.5 | -808898 | -0.051038 |

On the last dyadic block (6.55e7, 1e8] the ratio M_eps(x)/x^0.9 stays in [-0.051237, -0.050943]. The block suprema of
abs(sum eps(n) - c x) are 164 (x = 1.02e6), 412 (8.2e6), 944 (1e8): exponent about 0.37 over the range 2e3 to 1e8,
far below the proved x^(b+epsilon). For comparison the Mertens function has M(x)/x^0.9 -> 0. The thin twist gives the
inverse sums the same x^b main term that a zero of zeta at real part b would give.

---

## 3. The 7/8 proof against the control

Target fed to the manuscript: eta := eps_K (split variant), a completely multiplicative function on ideals of O with
values +-1. How the target enters is read from the displayed definitions: (6.1) and the corrected row use
Psi_{m,s,eta}(a) = eta(a) Xi(a)^-1 R(a, s) chi_a(m); the coefficient (7.4) contains the scalar eta(A), A = c n^3.

### 3.1 Step table

| step | what it uses about the target eta | thin twist eps_K | status |
|---|---|---|---|
| Section 2, deletion of S | each factor 1 - eta(p) Np^-s non-zero in Re s > 0 | holds (abs(eps(p)) = 1) | PROVED |
| Proposition 2.1 | 1/L^S(s, eta) is a Dirichlet series bounded on Re s >= 2; a zero of L at rho is a pole of the reciprocal | holds verbatim with beta* replaced by b (Proposition D) | PROVED |
| (6.1), Theta = <eta, T^> | eta is a weight on indices; Theta finite | defined; Theta finite because eps^2 = 1 | ARGUED |
| (6.2) | Mellin inversion in the m-profile; eta only inside B_{m,sigma} | holds | ARGUED |
| **Proposition 5.1 -> Lemma 5.2 -> Lemma 5.8 -> Propositions 6.3, 15.3 (low estimate)** | "a fixed finite family of multiplicative finite-ray characters with conductors supported on S"; first line of 5.1: phi(x) = chi_x(lambda)^2 Psi_0(x) "is L-periodic", with finite Fourier transform sum_{x mod L} phi(x) e(-hx/L) | **hypothesis false (Lemma N). No L exists. First unavailable step.** | PROVED (the hypothesis fails); truth of the conclusion OPEN |
| (7.1)-(7.5) exact Poisson series | Poisson summation in m with modulus s b* A; the correction G(A) and eta(A) are independent of m | holds: the summed variable is m, and m -> xi(m) chi_A(m) g(s, -m) is periodic whatever eta is | ARGUED |
| Lemma 7.1, (7.13) | eta(c n^3) = eta(p)^(e_0 + 3l) prime by prime; abs(eta(p)) = 1 | holds: F_{eps,u} = zeta^S(6z) L^S(w, chi_u) / L^S(x, eps chi_u) * H_{eps,u}, same regions | ARGUED |
| Lemma 4.8, 4.9 (growth, logarithmic control of L(s, psi), psi = eta theta chi_u) | psi primitive finite-order Hecke character: functional equation with conductor Q, bound Q^(3/5)(3 + abs(t))^2 uniform in Q | unavailable: L(s, eps chi_u) = L(s, chi_u) G_{chi_u}(s) with G_{chi_u} = prod_{p in S_K} (1 - chi_u(p) Np^-s)/(1 + chi_u(p) Np^-s), absolutely convergent only for Re s > b; no functional equation; continuation to the left of b not given by the construction for u != 1 | PROVED (hypothesis fails) |
| Lemma 8.1 (buffered bins) | bound on the reflected line 1 - a - 6e for L(s, psi) | unavailable: no reflected line | same |
| Lemma 9.1 (sextic large sieve) | none ("any sequence") | holds | ARGUED |
| Sections 17-18, Lemma 17.5 (masked primitive Poisson) | psi "a primitive finite character modulo an ideal m" | unavailable for psi containing eps | PROVED (hypothesis fails) |
| Proposition 11.3 (quadratic transfer) | both factors of zeta_F entire Dirichlet L-functions | false for the inert variant: zeta_F = F * (L(chi_-3)/G), zero against pole | PROVED |

Order: in the logical chain of Part I the low estimate (Proposition 6.3) is the first place where the target has to be
more than a unimodular completely multiplicative weight, and inside it the first line is the periodicity statement of
Proposition 5.1. Lemma 4.8 appears earlier on the page but is used later (Section 8). Both fail for the same reason.

### 3.2 The single use of additive structure

Every failing step uses one property: **eta is constant on cosets a + L O** (a function on a finite ray class group).
It is used in exactly one way, finite Fourier analysis on O/L O followed by Poisson summation over the lattice O:
* Proposition 5.1: eta(n) chi_n(m) on the indices of the cubic theta row becomes a finite combination of additive
  twists e(hx/L); automorphy of the Kubota theta function under the corresponding translations gives the reflected row
  (dual length governed by the conductor of the row).
* Lemma 4.8, 8.1, 17.5: the same for L(s, eta chi_u) and for sums of eta chi_u against a Schwartz profile, with dual
  length q_m / K.
For zeta the weight is eta = 1, invariant under all translations of O (of Z), and this holds independently of sigma:
it is the statement that the coefficients of zeta are the indicator of a lattice. Multiplicativity enters at different
places (Lemma 7.1; Moebius coefficients of the inverse; absorption identity), and those places hold for eps_K.

What the 7/8 mechanism uses beyond multiplicativity, stated so that an R4 mechanism can be tested against it:

  (A) For every row modulus q (norm up to Z^h) and every sextic symbol chi mod q, the sequence n -> a(n) chi(n) is
      periodic with period dividing q L, so that sums of a(n) chi(n) of length N (and theta rows twisted by it) have a
      Poisson dual of length q^k/N with unimodular coefficients, uniformly in q.

The thin twist has: complete multiplicativity; abs(a(p)) = 1 at every prime; a(p) = 1 on primes of relative density
one; ordinary Dirichlet series over the integers (INT); continuation to Re s > b - eta; a single simple pole at 1;
partial sums c x + O(x^(b+epsilon)) (measured exponent below 1/2); Lambda_F = eps Lambda of size log n. It lacks (A).
It has a zero at b. So no argument using only the listed properties can give a zero-free half-plane Re s > theta for
any theta < 1, and (A) is in use in the 7/8 argument in the q-aspect of a family, not as the reflection s <-> 1 - s
of the target at a height: the reciprocal 1/L(x, eta) in row u = 1 is used only as a Dirichlet series and through
Proposition 2.1.

### 3.3 Proposition D (dichotomy)

**Proposition D [PROVED].** Let eta be a completely multiplicative function on ideals of O with abs(eta(p)) <= 1,
S a finite set of primes, and suppose L(s, eta) is meromorphic near a point rho with L(rho, eta) = 0,
Re rho = beta in (1/2, 1]. Fix sigma_0 < beta, C(s) = s + c, 0 < omega < beta - sigma_0, sigma > 0, H holomorphic on
Re s > sigma_0 with sup abs(H - 1) <= 1/2, and f(Z) as in (2.3). Then no function J(Z) satisfies both
abs(J(Z)) << Z^(C(sigma_0)+omega) and abs(J(Z) - f(Z)) << Z^(C(beta)-sigma).

Proof. The proof of Proposition 2.1 uses only: 1/L^S(s, eta) is absolutely and uniformly bounded on Re s >= 2 (true
for abs(eta(p)) <= 1); f(Z) << Z^(C(beta)-epsilon*) with epsilon* = min(beta - sigma_0 - omega, sigma) (triangle
inequality); rapid decay of f at 0 (contour shift to the right); Fourier inversion on Re s = 2. It concludes that
e^(-(s-5/6)^2) F_eta(s)/H(s) is a holomorphic continuation of 1/L^S(s, eta) to Re s > beta - epsilon*. That half-plane
is connected and contains rho, where L^S is meromorphic with a zero: (1/L^S) L^S = 1 fails at rho. No functional
equation, periodicity or family is used. QED

Consequences for the control (beta = b, eta = eps_K).
* f_eps(Z) is not O(Z^(C(b)-delta)) for any delta > 0: the signal of the control is as large as that of a hypothetical
  zero of a Hecke L-function at real part b [PROVED].
* With J = I_eps (the manuscript's probe with weight eps_K, a finite sum) and H = H_eps (Lemma 7.1; its bound uses
  abs(eta(p)) = 1 only, ARGUED following `r3-tnr-control` step S3): the low estimate at sigma_0 = 7/8 and the high
  comparison at C(b) are not both true [PROVED-rel that reading of (2.2)]. Either the eps-twisted completed cubic
  theta rows have mean square above the reflected bound (5.36) by a power, or the comparison of the probe with its
  row-u = 1 signal fails by a power.
* With b = 0.9 there is no conflict with Part I: its low exponent 1/4 exceeds C(0.9) = 0.9 - 2/3. A control for
  Part I needs b in (11/12, 1); the construction covers it.

### 3.4 Which side is false [HEURISTIC, OPEN]

eps = 1 * g with g supported on integers composed of primes in S and sum abs(g(d)) d^-kappa convergent exactly for
kappa > b. A row twisted by eps is sum_d g(d) (row restricted to indices divisible by d). Each restricted row is
again automorphic (level raised by d) and can be reflected, at a cost that grows with d. If the restricted row has
norm about d^(-kappa) times the full row with kappa <= 1/2 (index density 1/d against the normalisation q_A^(-1/2)),
the triangle inequality over d <= Z loses Z^(b-kappa), and only cancellation between different d could restore the
bound (5.36). This points to the low estimate as the false side. The high side is plausibly true on average over u:
sum_{p in S_K} chi_u(p) Np^-x has bounded variance over u for Re x > b/2, and Lemma 9.1 applies to arbitrary
coefficients. Not decided here.

### 3.5 Comparison with Z18 (one-prime twin) and the other controls

| control | Euler product | abs(local parameter) = 1 | periodicity (A) | first failing step of the 7/8 argument |
|---|---|---|---|---|
| DH | no | n/a | yes (combination of two characters mod 5) | scalar Euler identity (7.13) (`r3-tnr-control`) |
| NR / Z18 twin, zeta D_q | yes | fails at the one prime q | yes for every twist (functional equation, conductor q^2) | Section 2 deletion and Lemma 7.1 size bound: abs(eta(p)) = 1 |
| FM, zeta(s)(1 - q^(b-s)) | yes | fails at q | no | same local size step |
| THIN (this note) | yes, completely multiplicative | holds at every prime | **fails** | Proposition 5.1, L-periodicity of the target weight |

The twin is zeta times one local factor: every global step passes, and the argument returns the true statement "no
zeros in Re s > max(7/8, beta_twin)". The thin twist changes infinitely many local factors, each by an admissible
amount (a unimodular parameter), and no finite set S of excluded primes removes it; every local step passes and the
global additive step fails. With DH this gives three controls, each violating exactly one of: multiplicativity,
local size, additive periodicity.

---

## 4. Node proposal and outcomes per mechanism

Node proposal (not written to the engine): `ctl-THIN.json` in this directory.

Outcome of THIN for each row of `stack-combinator/TABLE.md` (P passes, F violates, N not formulable; * = inference from
the inputs the row uses; no star = proved or measured in this note). THIN is an instance of TW- and of U with three
additional properties: unimodular parameters, continuation across the zero, and a located zero at b.

| rows | statement type | THIN | reason |
|---|---|---|---|
| 1-6, 9-16 | identities and inequalities built on the functional equation (zero-side forms, Krein index, Pick/Jensen/Li from verified height) | N | no functional equation, no completed function |
| 7, 8 | windowed residue bound; Theta(t) > 0 | N* | same |
| 17, 19, 20 | Pick positivity and rigidity with zeta's bridge | F* | as TW-: the prime weights differ from zeta's on S |
| 18, 21-24, 26, 39, 42-46, 48, 49 | no-go rows, heat rows, FE-only rows | N | not about this object |
| 25 | N(sigma, T) = o(T) for sigma > 1/2 | P (for sigma > max(b - eta, b/3)) | zeros of F there are zeros of zeta plus one point (Theorem 1(iii)); a density statement does not see the zero |
| 27, 31, 32 | inequalities using Lambda >= 0 | F* | Lambda_F(p) = -log p on S |
| 28 | positivity on the classical zero-free region | P* | F has no zero on Re s = 1; the 3-4-1 argument applies to real eps with zeta |
| 29, 30 | Lambda >= 0 iff Hankel positivity; log zeta positive definite on Re s > 1 | F | Lambda_F takes negative values |
| 33 | coefficients multiplicative | P | completely multiplicative |
| 34 | local temperedness (rung Toeplitz) | P | parameters +-1 at every prime; differs from the TW- cell (F*) |
| 35 | prime term as local resolvents | P* | geometric local factors with parameter -1 on S |
| 36 | cascade identity for xi'/xi | N* | needs xi |
| 37, 38, 40, 41 | statements using only stub size or abs(Lambda(n)) <= log n | P | sign-blind |
| 47 | class radius over tempered local data | ? | THIN is in the class; not computed |
| **50** | **no zero in Re s > 7/8** | **F** | **F(b) = 0, b in (7/8, 1) (Theorem 1)** |
| 51 | damped Weil positivity iff ZF(1/2 + theta) | N (as a positivity); F as the half-plane statement for theta < b - 1/2 | no Weil form without the functional equation |
| 52 | polar expansion of the theta-row form | N* | the row twist must be a ray class character (Proposition 5.1) |
| 53 | large sieves and Cauchy-Schwarz with arbitrary coefficients | P | arbitrary coefficients |
| 54 | Lambda bound from the half-plane | N | no heat flow without the functional equation |
| 55, 56 | proportion on the line; pair statistics | ? | not examined |
| 57-61 | RH-equivalent targets | N | need the functional equation |

Effect on the minimal-set bookkeeping: row 50 remains the only row violated by every control including THIN; row 34
(local temperedness) no longer separates, since THIN passes it. Among input-level sets (map section 2), THIN has
INT, GEOM (unimodular parameters), SIZE and multiplicativity and lacks FE; it shows that {INT, GEOM, SIZE,
multiplicativity, continuation, pole} is not a hitting set for the conclusion ZF(theta), theta < 1.

---

## 5. Controls for this lane's own statements

No statement about zeros of zeta is made, so nothing here has to fail for DH, HEAT, TW+-, EA, NR, B, WT.
Theorem 1 and Proposition D are statements about the control and about an implication. Checks on them:
* Theorem 1 applied with S empty gives F = zeta and no zero (the factor (s - b) comes only from the density of S).
* Proposition D applied to a Hecke character with no zero to the right of sigma_0 gives nothing, as it should.
* The residue prediction for M_eps was tested by a sieve that does not use the continuation formula (section 2).

## 6. Requirement flags

This lane is a control construction and an obstruction, not an attack on a zero statement. All four flags are set
false in the structured result.
* R1 (multiplicativity essential): not established for any mechanism. What is established is the opposite boundary:
  complete multiplicativity with unimodular parameters, continuation and a pole do not exclude a zero at b
  (Theorem 1).
* R2 (height-uniform, every window): not applicable. The control's zero is at one real point; row 25 shows density
  statements pass it.
* R3 (every control fails at a named step): the new control is run against the 7/8 argument and fails at a named
  line (Proposition 5.1). The other controls were not re-run here.
* R4 (reaches the critical line): no. The note states the additive input (A) that the only R1-R3 mechanism uses.

## 7. Three weakest steps

1. **The short-interval input and the K-variants.** Lemma 1 rests on a Hoheisel-type lower bound, cited from memory
   (exponent 0.525 not re-read); the split and inert variants need the same in the progressions 1 and 2 mod 3, also
   not re-read. The numerics (D in [-1, 0] to 1e9) support but do not replace it, and were run only for the version
   over Q with all primes. The twisted members L(s, eps_K psi), psi != 1, are not continued past Re s = b by this
   construction; a variant regular in every ray class (stagewise greedy rule per class) is not written out.
2. **The walk is by hypotheses, not by replay.** "Holds for eps" at (6.2), (7.5), Lemma 7.1, Lemma 9.1 and the bound
   (2.2) for H_eps is read from the displayed formulas and from `r3-tnr-control`; no proof in the manuscript was
   re-derived with eps in place of eta. "First unavailable" is a statement about hypotheses; it is not shown that the
   conclusion of Lemma 5.8 is false for eps.
3. **The dichotomy is not resolved.** Proposition D proves that the low estimate and the high comparison cannot both
   hold for the eps-probe, but not which fails; section 3.4 is heuristic. Until that is decided, "the additive input
   is needed on the low side" is not established, only "it is needed on at least one side".

## 8. Follow-up

Decide the dichotomy numerically: compute sum over m of abs(B_m)^2 for the completed cubic theta row with weight
eps_K against the same sum with weight 1 at two or three scales Z (tools: `tmp/sextic/`), with b = 0.95 so that Part I
(balanced geometry, exponent 1/4) already applies. Growth of the ratio like Z^(2(b - 11/12)) or more says the
low estimate is the false side and the reflection of the rows is the binding additive input; a bounded ratio says the
high side is.

## Files

`RESULT.md`, `ctl-THIN.json`, `thinlib.py`, `step1.py`, `step1_1e9.log`, `step1_1e+09.json`, `step1_1e+07.json`,
`step2.py`, `step2_1e8.log`, `step2_1e+08.json`, `step2_1e+07.json`.
