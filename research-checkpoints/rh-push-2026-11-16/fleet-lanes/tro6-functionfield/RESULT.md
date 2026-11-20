# tro6-functionfield: the function-field analogue of TRO6-natural

2026-11-16. Slug `tro6-functionfield`. Nothing outside this directory was written. NO QED for RH or for any theta < 7/8.

Labels: PROVED (complete argument here, classical inputs named) / CLASSICAL / CITED / MEASURED (exact-arithmetic
symbols, floating sums, stated tolerance) / SKETCH / HEURISTIC / OPEN.

## 0. Verdict

**precise-obstruction, with exact partial results.**

* The function-field analogue of TRO6-natural is **true**, not false. No counterexample; no warning for the
  number-field conjecture as stated.
* Its proof over F_q[T] has five steps. Four are orthogonality / functional-equation / Gauss-sum identities that hold
  exactly over F_q[T] and have number-field counterparts already present in the 7/8 manuscript. The fifth is Weil's
  Riemann hypothesis for L(u, nu) of the target, applied to the Moebius-target sum
  M_N(nu) = sum_{deg A = N} mu(A) nu(A) = [u^N] 1/L(u, nu). That step is the target's zero-free region itself.
  So the function-field proof is circular when transported: it confirms Theorem D of `sextic-theta-proof.md`
  (TRO6 <=> zero-free region) by an exact identity and does not bypass it.
* What is new versus the atlas and the 2026-11-03 notes: (i) the informal claim of proof-note section 7.2 ("executing
  the m-sum by Poisson gives the high side, whose principal row carries 1/L") is an exact finite identity over
  F_q[T] (Theorems 1, 2 below, checked to 1e-12 relative); (ii) the exceptional term P_a^{1/6} appears as the count
  q^{r/6} of sixth-power dual frequencies, with r the dual length; (iii) TRO6 with general bounded row coefficients is
  false over F_q[T] (explicit rows, correlation 0.70-0.86 against a null of 0.02), so any proof must use the Moebius
  factor that comes from gamma_1 gamma_2 = mu * G, i.e. the Euler product.

## 1. Plan and relation to the walls

The atlas (PR 27) has no function-field route; the 2026-11-03 notes cite Hoffstein 1992 / Patterson 2007 / CFH only for
the even part. The plan was: build the exact F_q[T] objects (q = 7, the smallest q = 1 mod 6), state the analogue,
decide it, and mark which step uses the Euler product. Walls: DH control is section 7; verified height, MV-CAP and
flow-blindness do not enter (no zeros of zeta are used; step S5 is a pointwise bound, not a mean value).

## 2. Objects (all sums finite)

q = 1 mod 6, R = F_q[T], monic polynomials. chi_0: F_q^* -> mu_6 of order 6, psi_0 a nontrivial additive character.
* Sextic symbol (x/c)_6 := chi_0(Res(c, x)) for monic c (zero if gcd > 1); cubic symbol: chi_0^2.
* e(f) := psi_0(coefficient of T^{-1} of f). Gauss sums g_n(m, c) := sum_{x mod c} (x/c)_n e(mx/c), n = 6, 3.
* Kubota coefficient sums c_k(m) := sum_{c monic, deg c = k} g_6(m, c) (all moduli: the complete/natural version).
  psi(m, u) := sum_k c_k(m) u^k.
* Rows: R_N(m; nu) := sum_{A monic squarefree, deg A = N} g_3(1, A) nu(A) (m/A)_6, nu a Dirichlet character
  (the target). This is the F_q[T] form of the manuscript's row coefficient gamma_2(c) nu(c) chi_c(m).
* Block form: B(k, N; d; nu) := sum_{m monic, deg m = d} c_k(m) R_N(m; nu). Dual length r := k + N - 1 - d.

Code: `fflib.py` (symbols by batched resultants mod 7; Gauss sums by prime-power formulas). `t1_validate.py`: the
closed formulas for g_n(m, c) agree with the brute-force definition on 3956 cases for n = 6 and 3956 for n = 3
(0 mismatches, max error 4.6e-13), including non-squarefree c and gcd(m, c) > 1.

## 3. Structure of the theta coefficients over F_7[T]

**F1 [MEASURED exact; CITED in general: Hoffstein 1992, Patterson 2007].** P*_m(u) := psi(m, u)(1 - q^7 u^6)/(1 - q^6 u^6)
is a polynomial of degree <= d + 1, d = deg m. Checked for every monic m with d <= 3 and all k <= 6 (d <= 1: k <= 7), and
for the cubic analogue (1 - q^4u^3)/(1 - q^3u^3) with d <= 2, k <= 7 and d = 3, k <= 6: all coefficients beyond d + 1 vanish to <= 1e-15
relative (`t4_analyse.py`).

**Consequence [PROVED from F1].** The theta coefficient (residue at u_0 = q^{-7/6}) is the finite sum

    rho(m) = (1 - 1/q) P*_m(u_0) = (1 - 1/q) sum_{k=0}^{d+1} q^{-floor((d+1-k)/6)} q^{-7k/6} c_k(m).

The stable-window form rho_eps(m) = u_0^k c_k(m) (any k >= d + 2, k = eps mod 6) is confirmed to 1e-14.

**F2 [MEASURED exact, d <= 4].** Functional equation with m-independent constant: p*_{d+1-k}(m) = lambda(d,k) p*_k(m)
for all m of degree d, |lambda| = q^{d + 3/2 - 2k} (`t9_misc.py`, defect <= 1e-15). So rho(m) is a fixed linear
combination of the c_k(m) with k <= (d+1)/2: a theta coefficient is a sextic-Gauss-sum row of length |m|^{1/2}.

**F3 [MEASURED].** Calibration: the cubic coefficient has |rho_3(m)|^2 constant over squarefree m of each degree
(3.961, 2.071, 1.082, 0.566, 0.296 for d = 0..4; ratio q^{-1/3}), the F_q[T] form of Patterson's cubic evaluation. The
sextic coefficient does not: at d = 4, |rho_6(m)|^2 ranges over [0.122, 9.86] on squarefree m. No 6-fold Patterson law,
in agreement with `sextic-theta-computation.md`.

## 4. Theorems

**Lemma G [PROVED; classical inputs: Euler/Lagrange residue formula, Hasse-Davenport, Pellet-Stickelberger].**
For squarefree monic A of degree N, with D = Res(A, A'):
g_n-type sum for chi_0^s equals chi_0^3(disc A) G(chi_0^s)^N chi_0^s(D), hence

    g_6(1, A) g_3(1, A) = kappa_N q^N mu(A),   |kappa_N| = 1 depending only on N.

This is (4.7) of the manuscript, gamma_1 gamma_2 = mu alpha G, over F_q[T]. Checked: kappa constant to 1e-15.

**Theorem 1 (complete blocks) [PROVED].** Let A be squarefree monic of degree N >= 1 and c monic of degree k with
k + N <= d. Then sum_{deg m = d} g_6(m, c) (m/A)_6 = delta_{c=A} q^{d-N} phi(A) g_6(1, A). Hence for k + N <= d

    B(k, N; d; nu) = delta_{k=N} kappa_N q^d sum_{A sf, deg A = N} mu(A) nu(A) phi(A).

*Proof.* m -> g_6(m, c)(m/A)_6 is periodic mod lcm(c, A), of degree <= d, so the sum is q^{d - deg lcm} times the sum
over residues. Writing g_6(r, c) = sum_x (x/c)_6 e(rx/c) and summing r over classes mod A first forces the reduced
denominator of x/c to divide A; primitivity of chi_A (A squarefree, each local symbol nontrivial) forces it to equal A;
then (x/c)_6 != 0 forces c = A. For c = A the sum is phi(A) g_6(1, A). Lemma G gives the second line. QED.
Checked (`t6_check.py`): every (k, N) with k + N <= d, d = 2, 3, 4, four targets; |lhs - rhs| <= 5e-10 against |lhs| up to 7e5, and
exact zeros for k != N.

**Theorem 2 (incomplete blocks) [PROVED for squarefree coprime pairs with 6 not dividing N - k; CLASSICAL input: the
functional equation of L(u, chi) for a primitive odd character and the CRT factorisation of its Gauss sum].**
For squarefree coprime monic c, A of degrees k, N, r = k + N - 1 - d >= 0:

    sum_{deg m = d} (m/A)_6 conj (m/c)_6
       = eps q^{d-(k+N)+1/2} g_6(1, A) conj(g_6(1, c)) conj( sum_{deg m' = r} (m'/A)_6 conj (m'/c)_6 ),   |eps| = 1,

eps depending only on (k, N, d). Multiplying by g_6(1, c) g_3(1, A) nu(A) and using |g_6(1, c)|^2 = q^k and Lemma G:

    B_sfc(k, N; d; nu) = eps kappa_N q^{d+1/2} sum_{deg m' = r} sum_{(c, A) sf coprime} mu(A) nu(A) conj (m'/A)_6 (m'/c)_6.

The sextic Gauss sum of the theta side cancels against the root number; what is left is a plain character sum over c
times a Moebius-target sum over A. Checked pair by pair (`t8_fe.py`): 6 triples (d, k, N), up to 11928 pairs each,
|ratio| = 1 to 12 digits, phase spread <= 1.4e-14; block identity |lhs - rhs| <= 5e-10.

**Corollary (function-field TRO6) [main term PROVED-rel Theorem 2; the bound is SKETCH: decoupling of the condition
(c, A) = 1, non-squarefree c, and the even case 6 | N - k are not written out].**
* The c-sum is a character sum in c modulo m' of length k > r. It is complete, hence zero, unless m' is a sixth power
  (up to the squarefree/coprimality sieve). The surviving frequencies m' = a^6 number q^{r/6}.
* On them the A-sum is M_N^{(a)}(nu) = [u^N] of 1/L(u, nu) with the Euler factors at a removed.
* Size relative to Cauchy-Schwarz (q^{d+k+N}): q^{1/2 + r/6} |M_N(nu)| / q^N.
  - trivial |M_N| <= q^N: ratio q^{r/6}: the exceptional term, the F_q[T] form of P_a^{1/6} (count of sixth powers
    below the dual length).
  - CLASSICAL (Weil): L(u, nu) is a polynomial with inverse roots of modulus q^{1/2}, so
    |M_N(nu)| <= binom(N + f - 2, f - 2) q^{N/2}, f = deg cond(nu). Ratio <= q^{1/2 + r/6 - N/2} up to the binomial.
  - with only a zero-free radius q^{sigma}: ratio <= q^{1/2 + r/6 - (1 - sigma)N}.
* **Explicit eta.** In the normalisation |B| << q^{-eta r/12} * (Cauchy-Schwarz), Weil gives every
  eta <= 12 (N/2 - r/6 - 1/2)/r, which exceeds 1 whenever N >= r/2 + 1; since r <= N + k - 1 - d and k <= (d+1)/2 by
  F2, this always holds for d >= 3. So over F_q[T] the exceptional term is removed entirely (eta = 1 and beyond), for
  fixed q up to the binomial factor (i.e. with q^{o(d)} replaced by 2^{O(d)}; a clean power saving needs q large).

Measured at the first incomplete antidiagonal (r = 0), full c_k including non-squarefree moduli, d = 4, TRO pairing
(`t7_blocks.py`, `t9_misc.py`; null = 0.0204): block (k, N) = (2, 3): 5.4x null for nu trivial, 8.6x for the conductor
T^2+3 target, 0.00x and 0.37x for the two conductor-T targets (where 1/L = 1); (1, 4): 0.44x, 3.3x, 0.00x. These agree in order of magnitude with
q^{1/2}|M_N|/q^N from the Corollary (r = 0.110, 0.176, 0.000 measured against 0.05-0.13, 0.14, 0 predicted). All other incomplete blocks (classes k = 1, 2) are
<= 1.7x null.

## 5. Which step has a number-field counterpart

| step over F_q[T] | number-field counterpart | status there |
|---|---|---|
| S1 complete m-sum, only c = A survives (Thm 1) | Poisson in m, zero frequency | available (manuscript (7.1)) |
| S2 functional equation in m, root number = product of Gauss sums (Thm 2) | Poisson modulo s b* A | available |
| S3 sextic Gauss sum cancels; gamma_1 gamma_2 = mu G (Lemma G) | (4.7) | available |
| S4 c-sum orthogonality leaves sixth-power frequencies | exceptional coset e_0 a^6, Prop 15.2 | available; gives P_a^{1/6} |
| S5 Weil bound for M_N(nu) = [u^N] 1/L(u, nu) | zero-free region for L(s, target) | **not available below 7/8; it is the statement to be proved** |

S1-S4 are orthogonality statements (mean-value type). S5 is the only step that produces the saving, and it is a
pointwise bound on a Moebius sum. Rationality (F1, F2) has only the approximate functional equation as counterpart and
gives no saving by itself.

## 6. A statement that is false over F_q[T]

TRO6 for rows with general bounded coefficients fails. Rows with conj(g_3(1, A)) in place of g_3(1, A):
normalised correlation with c_k at d = 4 (2401 rows, null 0.0204) is 0.75 at (k, N) = (1, 4), 0.70 at (2, 3), 0.86 at
N = 6 against the constant class, all in the incomplete range [MEASURED]. Reason: g_6 conj(g_3) = const^N conj chi_0(D),
with no mu(A); the A-sum is then a Kubota-type sum with a pole instead of a 1/L coefficient. The decorrelation in TRO6
comes only from the Moebius factor.

## 7. Davenport-Heilbronn control

The argument fails for a DH-type target at S5, and before it at S3/S4 -> S5: the identity
sum_A mu(A) nu(A) u^{deg A} = 1/L(u, nu) uses complete multiplicativity of nu. For f = c_1 nu_1 + c_2 nu_2 the A-sum is
c_1/L_1 + c_2/L_2, which carries no information on the zeros of c_1 L_1 + c_2 L_2, and the Weil bound is a statement
about each Euler product separately. So the step that uses the Euler product is exactly: (Moebius from (4.7)) x
(multiplicativity of the target) = coefficient of 1/L, followed by RH for that L.

## 8. Three weakest steps

1. **The dictionary is a model.** The block form B(k, N; d; nu) is not the manuscript's probe: tuples J, smooth
   weights, the n^3 part of the completed rows, classes sigma and the S-unit e_0 are not ported. The identification
   q^{r/6} <-> P_a^{1/6} and the exchange rate between eta and the zero-free abscissa are HEURISTIC. Completed rows were
   only measured to be polynomials of degree 2(d + f - 1) for small d (`t5_corr.py`), not used.
2. **Proof coverage.** Theorem 2 is proved for squarefree coprime pairs with 6 not dividing N - k. Non-squarefree c,
   gcd(c, A) > 1, the even case, and the decoupling of (c, A) = 1 in the Corollary are SKETCH; the only support is the
   d = 4 block table on the full c_k. F1 and F2 are measured for d <= 4 and cited otherwise.
3. **Pre-asymptotic numerics.** With q = 7 the six classes of the sextic coefficient wrap only for d >= 5..11
   (7^11 rows). The growth exponent of sum |rho|^2 and the correlation with central-value rows are not testable at
   d <= 4; the central-value correlations printed by `t6_check.py` are dominated by constant terms and are not evidence
   either way.

## 9. Reproduction

Interpreter: /opt/homebrew/bin/python3.14 (numpy 2.4.6), single process, < 1 GB, each run < 15 min.
`t1_validate.py` -> `t2_stab.py 3 4 7 7 7 7 6 5` and `t2_stab.py 6 4 7 7 7 7 6 6` (writes ck_n3.pkl, ck_n6.pkl) ->
`t3_rows.py 4 6` (rows.pkl) -> `t4_analyse.py`, `t6_check.py`, `t7_blocks.py` (blocks.log), `t8_fe.py`, `t9_misc.py`.
