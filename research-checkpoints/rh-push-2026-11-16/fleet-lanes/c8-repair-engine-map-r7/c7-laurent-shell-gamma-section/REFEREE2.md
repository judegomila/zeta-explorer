# REFEREE2 (second referee): Lemma 2 of `c7-laurent-shell-gamma-section`

2026-11-18, lane `c8-repair-engine-map-r7`. Written in this lane's directory; no file of
`push/c7-laurent-shell-gamma-section/` was edited. Script `ref2_lemma2.py` + `ref2_lemma2.log` (numpy + python-flint
64-bit zeta, interpreter `.venv-arb/bin/python`, one local run through `scripts/memcap.sh 8`, about 2 minutes,
arrays under 10 MB). No server use. No statement about zeros of zeta is made or checked.

## Outcome

Lemma 2 (normalised first moment of F over the poles of a gamma-coupled section -> 1 + conj(int F_P m dHaar)):

| class of m | first referee | this pass |
|---|---|---|
| m a monomial c w^kappa (these are all the unimodular trigonometric polynomials) | supported numerically (3 cases) | **PROVED for zeta** by the Gram-point method (section 2; written here, not refereed); 3 further numerical cases agree |
| m with infinitely many modes (m = -conj(F_P)/abs(F_P), the case with the negative mean) | ARGUED; uniformity in k not addressed | **stays ARGUED + MEASURED**; the missing estimate is stated in section 3 |
| DH | measured (author) | not treated |

Consequence for the lane's verdict: unchanged. The statement "no forced sign in the gamma-coupled class" rests on a
non-monomial m (for a monomial the mean is 1 + conj(c) n^(-1/2) or 1, real part at least 1 - 2^(-1/2) > 0), so it
rests on the ARGUED part and on the measurements. The closure of the class (Proposition 3) does not use the sign.

## 1. Re-derivation of the formula

Poles: U(t) = X(1/2 + it) m(w(t)) = 1, w_p = p^(-it); phi = arg U decreasing for large t. Poisson summation in phi:
sum_j delta(t - gamma_j)/abs(phi') = (1/2 pi) sum_k U^k, so nu = sum_j r_j delta_{gamma_j} = (1/pi) sum_{k in Z} U^k dt
for r_j = 2/abs(phi'(gamma_j)). CONFIRMED. With the symmetric approximate functional equation the two terms without a
power of X are (k = 0, first sum, n = 1), mean 1, and (k = -1, second sum): conj(m) sum f_n n^(-1/2) n^(it), mean
sum_{n P-smooth} f_n n^(-1/2) conj(int m w^n) = conj(int F_P m) (f_n real; F_P in L^2 of the torus for finite P).
CONFIRMED. For holomorphic inner m the value is 1 + conj(m(0)) (first referee's correction; agreed).

Classical check: m = 1 gives the Gram points and mean 2 (Titchmarsh, Theorem 10.6: sum of Z(g_{2n}) ~ 2N,
sum of Z(g_{2n+1}) ~ -2N, and zeta(1/2 + i g_n) = (-1)^n Z(g_n)).

## 2. Proof for monomial m (zeta)

A trigonometric polynomial of modulus 1 on T^P is a monomial: if m = sum c_kappa w^kappa has two modes, the product
m conj(m) has the non-zero coefficient c_{kappa+} conj(c_{kappa-}) at the difference of the lexicographically largest
and smallest modes. So let m = c w^kappa, abs(c) = 1, c = e^(ia), and q = prod p^(kappa_p) > 0 rational;
m(w(t)) = c q^(-it). With X(1/2 + it) = e^(-2i theta(t)) the poles are the solutions g_j of

    2 theta(t) + t log q - a = 2 pi j,       d/dt = log(t/2 pi) + log q + O(t^-2) > 0 for t > t_1(q).

**Claim.** (1/N) sum_{j <= N} zeta(1/2 + i g_j) -> 1 + conj(c) n^(-1/2) if 1/q = n is an integer, and -> 1 otherwise;
the same for the weights r_j = 2/(log(g_j/2 pi) + log q + O(g_j^-2)) and for Abel weights r_j e^(-delta g_j), delta -> 0.
This is Lemma 2 for m: int F_P m dHaar = c [coefficient of w^(-kappa) in F_P] = c n^(-1/2) or 0.

Proof. Riemann-Siegel / approximate functional equation (Titchmarsh 4.17): with x = (t/2 pi)^(1/2),
zeta(1/2 + it) = sum_{m <= x} m^(-1/2 - it) + X(1/2 + it) sum_{m <= x} m^(-1/2 + it) + O(t^(-1/4)). At a pole,
X(1/2 + i g_j) = conj(c) q^(i g_j), so

    zeta(1/2 + i g_j) = sum_{m <= x_j} m^(-1/2) e^(-i g_j log m) + conj(c) sum_{m <= x_j} m^(-1/2) e^(i g_j log(qm)) + O(g_j^(-1/4)).

The term m = 1 of the first sum is 1. The term with qm = 1 of the second sum (present iff 1/q = n is an integer, for
all j with x_j >= n) is conj(c) n^(-1/2). Every other term is an exponential sum S = sum_j e(f(j)),
f(j) = lambda g_j/(2 pi), lambda = -log m (m >= 2) or lambda = log(qm) != 0, over an interval of j (those with
g_j >= 2 pi m^2). Regard g as a function of a real variable j: g' = 2 pi/(log(g/2 pi) + log q + O(g^-2)) is monotone,
so f' = lambda/(log(g/2 pi) + log q + ..) is monotone. On the range of summation abs(lambda) <= (1/2) log(g/2 pi)
+ abs(log q), hence abs(f') <= 3/4 once g > t_2(q); and abs(f') >= abs(lambda)/(2 log T) for g <= T. By the
Kusmin-Landau inequality (monotone derivative at distance >= theta from the integers gives abs(S) << 1/theta),
abs(S) << log T/abs(lambda). The set {log(qm) : m >= 1, qm != 1} is bounded away from 0, and abs(log(qm)) >= log 2
for all but finitely many m. Summing with the weights m^(-1/2) over m <= (T/2 pi)^(1/2): total O_q(T^(1/4) log T);
the error terms add O(N T_0^(-1/4)). With N ~ (T/2 pi) log T this is o(N). The weights r_j and r_j e^(-delta g_j) are
monotone in j; partial summation on dyadic blocks of g with the same bound for every sub-interval gives an error
O_q(delta^(-1/4 - eps)) against a main term of order 1/delta. QED

Inputs: the Riemann-Siegel formula with error O(t^(-1/4)) and the Kusmin-Landau inequality, both CLASSICAL (not
opened in a source in this pass). The argument is Titchmarsh's proof of Theorem 10.6 with the phase 2 theta replaced by
2 theta + t log q - a. For q = 1/n it is a mean value of zeta over a shifted family of Gram-type points; it may be in
the literature (not searched).

Numerical check (`ref2_lemma2.log`; zeta; t_0 = 4000, poles up to t = 1.04e5; phase by the Stirling series for theta,
residual below 1e-9; zeta by python-flint at 64 bits; float accumulation, MEASURED):

| m | q | predicted | measured at delta = 1e-3 | at delta = 3e-4 |
|---|---|---|---|---|
| e^(0.7i) conj(w_2 w_3) | 1/6 | 1.31225 - 0.26300 i | 1.30641 - 0.25745 i | 1.31049 - 0.26133 i (difference 0.0024) |
| e^(0.7i) w_3 conj(w_2) | 3/2 (1/q not an integer) | 1 | 0.99908 + 0.00267 i | 0.99972 + 0.00080 i (0.0009) |
| e^(0.7i) conj(w_2)^2 | 1/4 | 1.38242 - 0.32211 i | 1.37824 - 0.31662 i | 1.38116 - 0.32046 i (0.0021) |

The differences fall in proportion to delta. The twist formula (mean of zeta q0^(+i gamma) -> q0^(-1/2), q0 = 5 outside
P) was also run: 0.4436, 0.4455, 0.4457 against 0.4472. The second line of the log labels its case in a garbled way;
the case run is q = 3/2, that is m = e^(0.7i) w_3 conj(w_2).

## 3. What is missing for non-monomial m

For m with infinitely many modes the poles are not an explicit sequence and the proof above does not apply. In the
expansion nu = (1/pi) sum_k U^k, the term U^k = X^k m^k carries the Fourier modes of m^k; a mode of m^k at frequency
omega = kappa . log p is stationary against X^k near k log(t/2 pi) = -omega (and against the two sums of the
approximate functional equation within (1/2) log(t/2 pi) of that). The derivation needs

    sum over k != 0, -1 of [ mass of the modes of m^k with abs(omega) >= (abs(k) - 1/2) log(t/2 pi) - C ]  ->  0  as t -> infinity,

uniformly enough to sum against the weights n^(-1/2). For m real-analytic on a shell of width sigma, with
sup abs(log abs(m)) <= C_m sigma on the shell, the mode of m^k at frequency omega is at most
exp(abs(k) C_m sigma - sigma abs(omega)/log p_max), which is exp(-c abs(k) log t) once log(t/2 pi) > 2 C_m log p_max.
So the estimate is plausible for real-analytic m (this includes -conj(F_P)/abs(F_P) when F_P has no zero on the
torus) with a threshold height depending on m. ARGUED here, not proved: the stationary points inside the range of the
approximate functional equation and the boundary terms (sum_k U^k(t_0)/k, conditionally convergent) were not
written out. For DH with three or more primes m = -conj(D_P)/abs(D_P) is not continuous (D_P has zeros on the torus;
first referee, item 4) and the argument does not start.

## 4. Controls and flags

No statement in Lemma 2 separates zeta from a control: the monomial case is a mean value of a Dirichlet series with
an approximate functional equation and holds for any such function with the same proof (DH: periodic coefficients, a
Riemann-Siegel-type formula at modulus 5; not written). R1 false, R2 false (Abel and Cesaro means), R3 false, R4
false.

## 5. Weakest points of this pass

1. The proof in section 2 is written by the referee and has no referee of its own; the two classical inputs were
   quoted from memory of the standard statements.
2. Section 3 is an argument, and the sign conclusion of the lane depends on it.
3. Numerical agreement is at the 1e-3 level with float pole location, as in the earlier runs.
