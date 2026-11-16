# r2-ff-tro6-complete: TRO6 in the F_q[T] block model, all moduli, all blocks

2026-11-16. Slug `r2-ff-tro6-complete`. Only this directory was written. NO QED for RH or for any theta < 7/8.
Follows `../tro6-functionfield/RESULT.md` and its `REFEREE.md`.

Labels: PROVED (complete argument here; classical inputs named) / CLASSICAL / CITED / MEASURED / HEURISTIC / OPEN.

## 0. Verdict

**partial-result: an exact theorem with its exact range, plus the blocks where the statement fails.**

1. **Theorem A [PROVED, MEASURED to 1e-13].** One identity replaces Theorems 1 and 2 of the predecessor. It holds for
   every monic modulus c (squarefree or not), every squarefree A, every parity of N - k, every range of (k, N, d), and
   it contains no Gauss sum of c. Lemma R reduces gcd(c, A) > 1 to the coprime case.
2. **Theorem B [PROVED, MEASURED].** The full block B(k, N; d; nu) (complete c_k, all moduli, the (c, A) = 1 coupling
   included) equals an explicit finite sum over dual frequencies of products
   (coefficient of L(u, xi)) x (coefficient of 1/L(v, nu conj xi)), xi sextic residue characters. Checked on 250 blocks
   at q = 7 (65 even) and 80 at q = 13, relative error <= 7e-14.
3. **Theorem C [PROVED; input: Weil].** With Q = q^(d+k+N) and r = k + N - 1 - d:
   |B| <= Lambda^2 Q [ 2.8 (N+1) q^((r-d)/2) + 8.4 q^(5/6 + r/6 - N/2) ] for r >= 0 (plus 1.61 q^(-N/2) if k = N),
   Lambda = q^(o(k+N+f)) explicit (Lemma E), uniform in the target.
   So the model statement "|B| <= q^(-eta r/12) Q" holds, up to Lambda^2, exactly on the blocks with
   r <= 6d/(6+eta) and N >= 5/3 + r(2+eta)/6.
4. **Theorem U [PROVED, no RH].** For N <= d the non-principal frequencies contribute at most C q^(d+N+2r-1/2)
   unconditionally. So for 2r < k the block equals its principal part: a sum of q^(r/6) coefficients of 1/L(v, nu)
   (Euler factors removed). For r = 0 this is an exact formula with no error term. TRO6 in this model is therefore
   *equivalent* to a square-root bound for the Moebius sums of the target; the function-field proof cannot be
   transported without the target's zero-free region. This is Theorem D of `sextic-theta-proof.md` as an identity.
5. **Where it fails [PROVED / MEASURED].** The statement is false without a range condition: for d = 0 the ratio
   |B| / (||c_k|| ||R_N||) is identically 1 (blocks (1, N, 0), r = N, measured N = 1..4). For bounded N no saving
   exists at any d (principal term q^(-N/2); measured 0.378-0.447 at N = 1, d = 3 and 4). The window
   6d/(6+eta) < r <= 6d/eta is OPEN.
6. **Not achieved.** F1 (rationality of psi(m, u)) is proved here only for d = 0 and on the functions of the top
   floor((d+1)/2) coefficients of m (Lemma H); for general m it stays CITED (Hoffstein 1992, Patterson 2007) and
   MEASURED (d <= 4). Theorems A, B, C, U do not use F1 or F2.

## 1. Plan; what is new; walls

New versus the predecessor and its referee: the pairwise identity without the hypotheses "c squarefree" and
"6 does not divide N - k"; the exact block formula with the coupling; the unconditional localisation; the uniform
coefficient bound; the exact range; the explicit failure blocks; Lemma H. New versus the atlas (PR 27): nothing in the
atlas treats a function-field model; no closed route is re-run.

Walls. DH: section 10. Flow-blindness, verified height: not involved (no zeros of zeta used). MV-CAP: Theorem C is a
pointwise bound per block; its number-field counterparts W1, W2 (section 9) are mean-value inputs, W3 is not.

## 2. Objects

q = 1 mod 6 prime, R = F_q[T]. chi_0: F_q^* -> mu_6 of order 6, psi a nontrivial additive character,
e(f) = psi(coefficient of T^-1 of f). For monic c and any x: chi_c(x) := chi_0(Res(c, x)) (zero if gcd > 1).
It is multiplicative in x and in c, periodic in x mod c, chi_c(a) = chi_0(a)^(deg c) for constants,
and chi_A(c) = chi_0(-1)^(deg A deg c) chi_c(A) for monic A, c (reciprocity of the resultant).
g_6(m, c) = sum_{x mod c} chi_c(x) e(mx/c); g_3(1, A) = sum_x chi_A(x)^2 e(x/A).
c_k(m) = sum_{c monic, deg c = k} g_6(m, c). R_N(m; nu) = sum_{A sf monic, deg A = N} g_3(1, A) nu(A) chi_A(m),
nu a Dirichlet character mod F, deg F = f. B(k, N; d; nu) = sum_{m monic, deg m = d} c_k(m) R_N(m; nu).
r := k + N - 1 - d. Q := q^(d+k+N). Lemma G (predecessor, referee-confirmed): for squarefree A of degree n,
g_6(1, A) g_3(1, A) = kappa_n q^n mu(A), |kappa_n| = 1, kappa_0 = 1.

Reference scale. sum_m |c_k(m)|^2 = q^d sum_{deg c = k} phi(c) for 2k <= d and sum_m |R_N(m)|^2 = q^d sum_{A sf, (A,F)=1} phi(A)
for 2N <= d [PROVED: complete orthogonality as in Theorem 1]. Outside these ranges ||c_k|| ||R_N|| / Q is MEASURED:
between 0.70 and 2.68 on the 100 blocks with nonzero norms at q = 7, d = 3, 4 (0.12 to 15.9 when d <= 2 is included). c_k vanishes identically for k = (d+1)/2, d odd
(d = 1, 3, measured), and ratios k <-> d + 1 - k coincide, as F2 predicts.

## 3. Theorem A (pairwise identity)

Put S(c, A; d) := sum_{m monic, deg m = d} g_6(m, c) chi_A(m), c monic of degree k, A squarefree monic of degree N, and

    Z_r(c, A) := sum_{z != 0, deg z <= r} psi(z_r) chi_c(z) conj chi_A(z)      (z_r = coefficient of T^r; empty for r < 0).

**Theorem A [PROVED].** If gcd(c, A) = 1 and (k, N) != (0, 0):

    S(c, A; d) = chi_0(-1)^(N(k+1)) q^(d-N) g_6(1, A) Z_r(c, A),   r = k + N - 1 - d.

Moreover, with a_j := sum_{z monic, deg z = j} chi_c(z) conj chi_A(z) and G(chi) the Gauss sum over F_q:

    6 does not divide N - k:   Z_r = G(chi_0^(k-N)) a_r                          (Theorem 2 of the predecessor)
    6 divides N - k:           Z_r = -a_r + (q - 1) sum_{j<r} a_j = -[u^r] (1 - qu) L(u, chi)/(1 - u).

S(1, 1; d) = q^d.

*Proof.* (i) sum_{m monic, deg d} e(m theta) = q^d psi(theta_{d+1}) if theta_1 = ... = theta_d = 0, else 0
(theta_i = coefficient of T^-i). (ii) chi_A is primitive mod A (A squarefree, every chi_P of exact order 6), so
chi_A(m) tau = sum_{y mod A} conj chi_A(y) e(my/A) for all m, with tau = chi_0(-1)^N conj g_6(1, A), |tau|^2 = q^N.
(iii) Insert the definition of g_6 and (ii): S = tau^-1 sum_{x mod c} sum_{y mod A} chi_c(x) conj chi_A(y)
sum_m e(m(x/c + y/A)). By CRT x/c + y/A = z/(cA) with z = xA + yc running once over residues mod cA, deg z < k + N.
By (i) the m-sum is q^d psi(z_r) if deg z <= r and 0 otherwise. (iv) x = z A^-1 mod c, y = z c^-1 mod A, so
chi_c(x) conj chi_A(y) = chi_c(z) conj chi_A(z) conj chi_c(A) chi_A(c), and conj chi_c(A) chi_A(c) = chi_0(-1)^(kN).
z = 0 contributes only if c = A = 1. (v) Write z = a z_1, z_1 monic of degree j: chi_c conj chi_A (a) = chi_0(a)^(k-N).
The sum over a of psi(a) chi_0(a)^(k-N) (j = r) is G or -1; the sum of chi_0(a)^(k-N) (j < r) is 0 or q - 1. QED.

Nothing in the proof uses that c is squarefree: for non-squarefree c the character chi_c is imprimitive and the same
formula holds. The even case differs from the odd one only in step (v); this is why the predecessor's identity failed
numerically for 6 | N - k.

**Lemma R (common factors) [PROVED].** For any monic c and squarefree A, write c = c_1 c_2 with c_2 supported on the
primes of A and gcd(c_1, A) = 1. Then S(c, A; d) = 0 unless c_2 =: g is squarefree; in that case, with A = g A',

    S(c, A; d) = chi_{c_1}(g) chi_g(c_1) g_6(1, g) sum_{e | g, deg e <= d} mu(e) conj chi_{c_1}(e) chi_{A'}(e) S(c_1, A'; d - deg e).

*Proof.* chi_A(m) != 0 forces gcd(m, c_2) = 1. Twisted multiplicativity g_6(m, c_1 c_2) =
chi_{c_1}(c_2) chi_{c_2}(c_1) g_6(m, c_1) g_6(m, c_2); for gcd(m, c_2) = 1, g_6(m, c_2) = conj chi_{c_2}(m) g_6(1, c_2),
which vanishes unless c_2 is squarefree. Then conj chi_g chi_A = chi_{A'} 1_{gcd(m,g)=1}; remove the coprimality by
Moebius over e | g and use g_6(e m', c_1) = conj chi_{c_1}(e) g_6(m', c_1). QED. (c = A gives Theorem 1.)

MEASURED (`v1_pairs.py`, `v1.log`; Gauss sums from the definition by DFT, symbols by resultants; own code):
q = 7: 20 triples (k, N, d), up to 600 pairs each, classes coprime-squarefree / coprime-non-squarefree / non-coprime,
including k = N (even) and (k, N) = (0, 6) (even, N - k = 6); q = 13: 12 triples. Max absolute error 1.4e-11 on
values up to 2.8e4 (relative <= 1e-13).

## 4. Theorem B (exact block formula)

For y != 0 put I_nu(y; k', N') := sum over monic c of degree k', squarefree monic A of degree N', gcd(c, A) = 1, of
mu(A) nu(A) chi_c(y) conj chi_A(y).

**Theorem B [PROVED-rel Lemma G; MEASURED].** For N >= 1 and all k, d >= 0:

    B(k, N; d; nu) = q^d sum_{gamma=0}^{min(k,N)} sigma_gamma sum_{g sf, deg g = gamma} sum_{e | g, deg e <= d}
                     mu(g) mu(e) nu(g) q^(gamma - deg e) W(g, e),

    W(g, e) = 1                                                            if k = N = gamma   (the diagonal term),
    W(g, e) = sum_{z != 0, deg z <= r'} psi(z_{r'}) I_nu(z g^2 e^5; k - gamma, N - gamma)     otherwise,

r' = r - 2 gamma + deg e, sigma_gamma = kappa_gamma kappa_{N-gamma} chi_0(-1)^((N-gamma)(k-gamma+1) + gamma(k-gamma)).

*Proof.* Sum Lemma R over (c, A), insert Theorem A, g_3(1, gA') = chi_{A'}(g^4) g_3(1, g) g_3(1, A') and Lemma G twice.
The phases collect into chi_{c_1}(g^2 e^5) conj chi_{A'}(g^2 e^5) chi_0(-1)^(gamma(k-gamma)). QED.

**Euler form.** Detecting gcd(c, A) = 1 by Moebius,

    I_nu(y; k', N') = sum_{h sf, gcd(h, y) = 1, deg h = j} nu(h) a_{k'-j}(y) M_{N'-j}(y, h),
    a_n(y) = [u^n] L(u, xi_y),   xi_y(c) := chi_c(y),
    M_n(y, h) = [v^n] 1 / L(v, nu conj xi_y 1_h).

xi_y is a Dirichlet character modulo rad(y) (times chi_0(lc y)^deg), principal iff the monic part of y is a sixth
power. This is the place where the Euler product enters: mu(A) from Lemma G and complete multiplicativity of nu give
1/L. The frequencies with y = a t^6 are the **principal** ones: z = a e^5 h^4 s^6 with g = e h, so 6(gamma + deg s) <= r
(and = r in the odd case). Their number is about q^(r/6).

MEASURED (`v2_blocks.py`, logs `v2_q7.log`, `v2_q13.log`, summary `v6.log`): brute-force B against the formula,
I_nu by brute force. q = 7: all (k, N, d), k <= 3, N <= 4, d <= 4, r <= 3, five targets (trivial; two mod T;
two of conductor degree 2): 250 blocks, 65 even, max |B| 9.4e7, max relative error 6.8e-14. q = 13: k <= 2, N <= 3,
d <= 3, r <= 2, four targets: 80 blocks, 6.6e-14.

**r = 0 (k + N = d + 1): exact.** B = q^d chi_0(-1)^(N(k+1)) kappa_N G* [u^k v^N] (1 - qu)^-1 prod_P (1 - nu(P) v^p (1 - u^p))
(+ diagonal if k = N), G* = G(chi_0^(k-N)) or -1. For nu trivial, (k, N) = (2, 3): [u^2 v^3] = -q(q-1)(2q-1), so
|B(2, 3; 4; 1)| = q^(4+1/2) q (q-1)(2q-1) = 3.468437e6 at q = 7; measured 3.468437e6, ratio 0.1102 = 5.40 x null.
This is the block the predecessor measured at 5.4 x null. Its value comes only from the coupling (h != 1 terms):
M_3(1) = 0. The conductor-2 targets give 8.63 x and 7.56 x, the conductor-T targets 0 (reproduced).

## 5. Lemma E (coefficient bounds, uniform in the conductor)

**Lemma E [PROVED; input: Weil].** Let xi be a nonprincipal Dirichlet character mod M, D := deg M. Then for all n,
|[u^n] L(u, xi)| and |[u^n] 1/L(u, xi)| are at most

    E(n, D) := [u^n] exp( sum_{j>=1} min(D q^(j/2), q^j) u^j / j ),

and with J := floor(2 log_q D) >= 3:  log( E(n, D) q^(-n/2) ) <= n log J / J + (D/J)(1/log J + 1/J) + 1.6 D/(J - 1).
Also E(n, D) <= binom(n + D - 1, n) q^(n/2).

*Proof.* log L = - sum_j c_j u^j / j with c_j = sum_i alpha_i^j = - sum_{deg f = j} Lambda(f) xi(f). Weil: at most D - 1
inverse roots, each of modulus q^(1/2) or 1, so |c_j| <= D q^(j/2); trivially |c_j| <= q^j. Coefficients of exp of a
series are monotone in the absolute values of its coefficients. For the estimate use E <= rho^-n exp(...) at
rho = q^(-1/2) e^(-tau/J), tau = log J, split the sum at J. QED.

Define Lambda(n, D) := max_{m<=n} E(m, D) q^(-m/2). Then Lambda = q^(o(n + D)) as n + D -> infinity. MEASURED
(`v3_lemmaE.py`): the closed bound holds on all tested (n, D); log_q Lambda / (n + D) is 0.10-0.17 at D = 50..400
(q = 7) and decays like log log D / log D. At q = 7 and d <= 4 the loss is not small: the power saving below is
asymptotic (d -> infinity, or q -> infinity at fixed degrees, where the binomial bound applies).

Uniformity in the target (task item 4): the target enters Theorem C only through D <= f + r + N in Lambda. The bound is
uniform for all nu mod F; it gives a power saving as long as (N + f) log log f / log f = o(d). For f beyond that the
Weil bound for a Moebius sum of length N degenerates to the trivial one (E(n, D) = q^n once D >= q^(n/2)).

## 6. Theorem C, Theorem U, range

**Theorem C [PROVED; inputs: Theorem B, Lemma E].** Let N >= 1, nu nonprincipal mod F, Lambda := Lambda(max(k, N), f + r + N).

    |B(k, N; d; nu)| <= Lambda^2 Q [ 2.8 (N + 1) q^((r-d)/2) 1_{r>=0} + 8.4 q^(5/6 + r/6 - N/2) 1_{r>=0} + 1.61 q^(-N/2) 1_{k=N} ].

For nu principal the second and third terms become 8.4 (N+1)(q+1) q^(5/6 + r/6 - N) and (N+1)(q+1) q^(-N) (with the
loss E_0 of smooth-polynomial counts in place of Lambda; |M_n| <= (q+1) E_0 there). Constants are not optimised; the exponents are the content.

*Proof.* Non-principal y: a_n(y) = 0 for n >= deg rad(y), and |a_n| <= Lambda q^(n/2), |M_n| <= Lambda q^(n/2), at most
q^j values of h: |I_nu| <= (N + 1) Lambda^2 q^((k'+N')/2). The z-weights sum to at most 2 q^(r'+1/2). Summing over
(gamma, g, e) with sum_{deg g = gamma} 2^omega(g) <= (gamma + 1) q^gamma gives 2.8 (N+1) Lambda^2 q^(d + r + 1/2 + (k+N)/2)
= 2.8 (N+1) Lambda^2 Q q^((r-d)/2). Principal y: |a_n| <= q^n, so |I_nu| <= 1.61 Lambda q^(k'+N'/2); the weights of
the principal z sum to at most 2 q^(5/6 + r/6 - gamma) (odd case q^(1/2 + r/6 - gamma)). Diagonal:
q^(d+N) |sum_e nu(e) q^(-deg e) M_{N-deg e}| <= 1.61 Lambda q^(d + 3N/2). If nu conj xi_y is principal for a non-principal
y, then |M_n| <= 2 Lambda q^((n+1)/2) and there are at most q^(r/6) such y; this is absorbed for r >= 1. QED.

**Corollary (range of the model TRO6) [PROVED].** |B| <= C_N Lambda^2 q^(-eta r/12) Q for every block with

    0 <= r <= 6d/(6 + eta)    and    N >= 5/3 + r (2 + eta)/6.

In the range k <= (d+1)/2 that F2 makes sufficient for the theta coefficient, r <= N - (d+1)/2 and the second
condition is automatic for eta <= 4, d >= 3; the first reads k + N <= d + 1 + 6d/(6+eta). For N <= d, k <= (d+1)/2,
d >= 3 both conditions hold with eta = 6.
With only a zero-free radius q^sigma for the L-functions in W3 (section 9), N/2 becomes (1 - sigma) N.

**Theorem U (unconditional localisation) [PROVED, no RH].** For N <= d (r <= k - 1):

    | B - Diag - Princ | <= C q^(d + N + 2r - 1/2) = C Q q^(2r - k - 1/2),      C absolute,

Princ := the terms of Theorem B with z g^2 e^5 = a t^6. *Proof.* For non-principal y, a_{k'-j}(y) != 0 forces
j >= k - r - deg e + 1; bound a, M trivially. QED. MEASURED: the left side is at most 0.33 q^(d+N+2r-1/2) on the 98
blocks with N <= d (`v7.log`).

Consequence. For 2r < k the block is, unconditionally, a sum of about q^(r/6) coefficients [v^(N-j)] 1/L(v, nu 1_t)
with weights q^(d+1/2+k-j). Its leading part is eps q^(d+1/2+k) q^(r/6) M_N(nu). A saving for these blocks is the same
statement as a bound for M_N(nu) = [v^N] 1/L(v, nu). TRO6 in this model <=> square-root (or q^sigma) bound for the
Moebius sums of the target.

**Limits [PROVED for (a); MEASURED for (b), (c); (d) OPEN].**
(a) d = 0: one row, so |B| = ||c_k|| ||R_N||. Blocks (1, N, 0) have r = N and ratio 1 whenever R_N(1; nu) != 0
    (measured N = 1..4 for both conductor-2 targets, N = 1, 3, 4 for the trivial one, `v5_q7.log`). First failing
    block: (k, N, d) = (1, 1, 0), nu trivial, r = 1, B = 343 = ||c_1|| ||R_1||. So no saving in r alone exists.
(b) Bounded N: the principal term q^(-N/2) does not decay with d. N = 1: ratio 0.447 and 0.378 (conductor-2 targets)
    at d = 3 and d = 4, both for r < 0 and for r = 0.
(c) Trivial target at small d: ratio 1.000 on (1, 2, 2), (2, 2, 2), (1, 4, 2), (3, 1, 3). c_k and R_N are both
    affine-equivariant and the equivariant space is one-dimensional there; this is a small-degree artifact.
(d) 6d/(6+eta) < r <= 6d/eta: the termwise Weil bound exceeds Q for r >= d; nothing is proved and the data (d <= 3
    there) decide nothing. Beyond r = 6d/eta the required saving is below the null level q^(-d/2).

## 7. Squarefree moduli (referee item 1)

With c restricted to squarefree moduli, Theorems A, B hold with I_nu restricted to squarefree c_1 (checked: 135 blocks,
q = 7, relative error 2.5e-14, `v2_q7_sfc.log`). The c-sum becomes [u^n] L(u, xi_y)/L(u^2, xi_y^2); it does not vanish
for n > deg y, as the referee found. Two statements:
* Theorem C holds unchanged. |[w^i] 1/L(w, xi_y^2)| <= q^i trivially, and q^i = q^((2i)/2) is already square-root size
  in u, so |a^sf_n| <= (n/2 + 1) Lambda q^(n/2). **No Weil bound for xi^2 is needed for the bound.**
* Theorem U changes. Unconditionally |a^sf_n(y)| <= q^((n + deg y)/2), so the localisation to principal frequencies holds
  only for 3r + 1 < k. Weil for L(w, xi_y^2) (input W4) improves this to q^((n + 3 deg y)/4). For squarefree moduli the
  predecessor's step S4 is therefore not pure orthogonality outside 3r + 1 < k.

## 8. Sign convention against the manuscript (task item 5)

`~/lean-deps/qrh-verify/paper.txt`: (5.30) defines the row coefficient gamma_2(c) alpha(cn^3) nu(cn^3) chi_{cn^3}(m):
unconjugated cubic Gauss sum, unconjugated symbol in m. (4.7): gamma_1(c) gamma_2(c) = mu(c) alpha(c) G(c).
`formalization/paper/sextic-theta-proof.md` line 111: theta side g~(y, c) = conj(chi_c(y)) gamma_1(c); the form
sum_m rho(-e_0 m) B_m is bilinear. The model has g_6(m, c) = conj chi_c(m) g_6(1, c) and rows g_3(1, A) nu(A) chi_A(m),
paired bilinearly, and Lemma G is (4.7). The conventions agree: on the diagonal c = A the product is gamma_1 gamma_2,
which carries mu. The conjugated row pairs gamma_1 conj(gamma_2), with no mu; it measures 0.697 (34 x null) at
(2, 3, 4), nu trivial, against 0.110 for the correct row. Not ported: alpha, G on the fixed ray group, the n^3 part,
the classes sigma, e_0; in F_q[T] with monic moduli these are constants depending on degrees only.

## 9. Every use of Weil's theorem, and its number-field counterpart

| # | where | L-function, statement used | number-field counterpart | uniformity needed |
|---|---|---|---|---|
| W1 | Thm C, non-principal y | L(u, xi_y), xi_y sextic residue character of conductor degree <= r: \|sum_{deg c = n} xi_y(c)\| <= Lambda q^(n/2) (upper bound for L) | GRH-size bound for short sextic character sums; enters summed over y, so a mean square suffices: sextic large sieve in sharp form | all y up to the dual length |
| W2 | Thm C, non-principal y | 1/L(v, nu conj xi_y 1_h): Moebius sums twisted by target x sextic character, <= Lambda q^(n/2) | zero-free region for L(s, target x chi_y); in mean square over y a zero-density estimate for the family | conductor up to f + r + N |
| W3 | Thm C, principal y and diagonal | 1/L(v, nu 1_t): Moebius sums of the target itself | zero-free region Re s > sigma for L(s, target): the statement TRO6 is meant to prove (Theorem D) | pointwise in the target; no average available |
| W4 | section 7 only (squarefree moduli, localisation) | 1/L(w, xi_y^2), cubic characters | zero-free region for cubic Hecke L(2s, chi_y^2) at Re s = 1/2 + eps, i.e. only the classical region near Re = 1 | not needed for Theorem C |

Not used: Weil for the coupling sums over h (trivial bound suffices); any RH in Lemma G, Theorems A, B, U, Lemma R,
Lemma H (Gauss sums over F_q, Hasse-Davenport, Stickelberger, reciprocity). W1 and W2 are replaceable by averages over
the dual frequency; W3 is not, and Theorem U shows it cannot be avoided: for 2r < k the block *is* the W3 quantity.

## 10. Davenport-Heilbronn control

Theorem B is linear in nu. For f = c_1 nu_1 + c_2 nu_2 the block is c_1 B(nu_1) + c_2 B(nu_2), and its principal part
is a combination of coefficients of 1/L(v, nu_1) and 1/L(v, nu_2). The zeros of c_1 L_1 + c_2 L_2 never appear. The
step that uses the Euler product is the identity sum_{A sf} mu(A) nu(A) conj xi_y(A) v^(deg A) = 1/L(v, nu conj xi_y)
(mu from Lemma G, complete multiplicativity of nu), followed by W3 for each Euler product separately. The argument
gives nothing for a DH-type target, as required.

## 11. F1 (task item 6): partial

**d = 0 [PROVED from Theorem A with N = 0].** c_k(1) = sum_{deg z <= k-1} psi(z_{k-1}) sum_{deg c = k} chi_c(z); the
inner sum is complete, so only z = a w^6 survive, and #{(w, c) coprime, degrees j, k} = q^(j+k)(1 - 1/q) (j >= 1).
Result: c_1 = qG, c_{6j} = (1 - 1/q) q^(7j), c_{6j+1} = G (1 - 1/q) q^(7j+1) (j >= 1), all others 0, G = G(chi_0).
Hence psi(1, u)(1 - q^7 u^6)/(1 - q^6 u^6) = 1 + qGu, degree d + 1 = 1. Checked against the predecessor's table,
k <= 7, relative error 3e-15 (`v4.log`).

**Lemma H [PROVED].** For every k and d, the sum of c_k(m) over monic m of degree d with prescribed coefficients of
T^(d-1), ..., T^(d-J) does not depend on the prescription when J <= (d+1)/2. *Proof.* Let lambda be a character of
the top-coefficient group U_j = (1 + sF_q[s])/(s^(j+1)), s = 1/T, nontrivial on 1 + s^j F_q, 1 <= j <= J. The Gauss sum
at infinity gives sum_m g_6(m, c) lambda(m) = q^(d-j) tau(lambda) lambda(c) sum_{x monic, deg x = k-1-d+j}
chi_c(x) conj lambda(x) (times a root of unity). The sum over c of lambda(c) chi_c(x) over degree k vanishes when
k >= deg x + j, i.e. 2j <= d + 1 (split c = x b + rho; lambda sees only b). QED.
MEASURED: class sums constant to 1e-16 for J <= (d+1)/2 and not constant for J = floor((d+1)/2) + 1
for some k (q = 7, d = 2, 3, 4, k <= 7; q = 13, d <= 2).

So F1 holds on the q^floor((d+1)/2)-dimensional space of functions of the top half of m. For lambda of larger conductor
the same computation gives a recursion (d, k) -> (2j - d - 2, k - 1 - d + j) through the functional equation of
L(u, lambda xi_x); completing it (non-squarefree x, imprimitive characters) would prove F1 by induction on d. Not done.
F1 for general m: CITED, MEASURED d <= 4. Only the passage from blocks to the theta coefficient rho(m) depends on it.

## 12. Three weakest steps

1. **Range and loss.** Theorem C beats Q only for r < d and only after Lambda^2 = q^(o(d)) is absorbed. At q = 7,
   d <= 4 Lambda is not small; no numerical test of a power saving is possible at these sizes. The data test
   the identities (to 1e-13), not the asymptotics.
2. **Model, not the probe.** The block form is the predecessor's dictionary: tuples J, smooth weights, n^3 part, classes
   and e_0 are not ported, and the link c_k -> rho uses F1, F2 (CITED/MEASURED). The exchange rate between the model eta
   and the manuscript's eta is HEURISTIC. Section 8 checks only the conjugation pattern.
3. **Constants and the principal-target case.** The constants 2.8, 8.4, 1.61 come from crude geometric sums and were
   not machine-checked; for nu principal the loss E_0 was argued, not tabulated. The Theorem U constant is unspecified
   (measured 0.33).

## 13. Reproduction

/opt/homebrew/bin/python3.14 (numpy 2.4, mpmath), single process, < 1 GB, each run < 10 min.
`ff.py` (library, any prime q = 1 mod 6). `v1_pairs.py q "[(k,N,d,cap),...]"` -> `v1.log`.
`v2_blocks.py q cases targets all|sfc out.pkl` -> `v2_q7.log`, `v2_q13.log`, `v2_q7_sfc.log`; `v6_summary.py` -> `v6.log`;
`v7.log` (bounds of Theorems C, U against the split). `v3_lemmaE.py` -> `v3.log`. `v4_F1.py` -> `v4.log`.
`v5_ratio.py 7 targets 4 4 "[0,1,2,3]"` -> `v5_q7.log`. Not run: blocks with N >= 5 or r >= 4 (cost).
