# REFEREE2 (second referee) for `c8-ek-theta-second-moment-formula`: Lemma 1, Theorem 2 bookkeeping, the sixth-power form

2026-11-18, lane `c9-repair-referee-debts-r8`. Written in this lane's directory; no file of the original lane was
edited. Read: RESULT.md (sections 0 to 4, 8), REFEREE.md. Script `ref2_form.py`, log `ref2_form.log` (own code, exact
integer symbols; no lane code, no table of `tmp/sextic`; one local run through `scripts/memcap.sh 8`, 20 s, arrays
below 7 MB). No server use. No statement about zeros of zeta or of any L-function is made or checked.

Labels: PROVED (argument written here) / CONFIRMED (re-derived, agrees) / EXACT (integer arithmetic) / OUTLINE / OPEN.

## Outcome

| item | first referee | this pass |
|---|---|---|
| Lemma 1 (pair Poisson formula) | holds | **holds** (not re-derived line by line; its kernel structure re-derived, section 1) |
| the sixth-power form: signature (2, 2) (lane) or positive semidefinite (first referee) | positive semidefinite | **decided: positive semidefinite of rank 6**, EXACT (section 1). The lane's line "indefinite, signature (2, 2), sign +-" is **broken** (RESULT.md section 3, lines "The matrix R(x, y) = (-1)^{eh + fg + fh} ... So H is indefinite of signature (2, 2)" and verdict item 3) |
| Theorem 2, squarefree unmarked columns | outline, count correct | **holds narrowed**: OUTLINE, conditional; exponent count CONFIRMED |
| Theorem 2, one mark slot | "by analogy" | **holds narrowed**: the count is supplied here (section 2), OUTLINE |
| Theorem 2, cube parts n | not covered | **holds narrowed to the upper bound**: O(Z^eps (X + N)) by Cauchy-Schwarz over n (section 2), OUTLINE; the asymptotic X D + O(N^(1+eps)) is not established with cube parts |

No requirement flag changes: R1 = R2 = R3 = R4 = false.

## 1. The sixth-power form

**Derivation (PROVED).** In Lemma 1 the frequency k enters the pair (c_1, c_1') through
gt_1(k, c_1) conj(gt_1(-k, c_1')) = conj(chi_c1(k)) chi_c1'(-k) gamma_1(c_1) conj(gamma_1(c_1')), with the factor
R(c_1, c_1') in front and a Gaussian that depends on k through q_k only. The six associates u k (u a unit) have the same
norm, so they can be summed first:

    sum_u conj(chi_c(uk)) chi_c'(-uk) = conj(chi_c(k)) chi_c'(k) * U(c, c'),   U(c, c') = sum_u conj(chi_c(u)) chi_c'(-u).

c -> chi_c(zeta_6) =: eps(c) is a character of the unit group, so U(c, c') = 6 chi_c'(-1) if eps(c) = eps(c') and 0
otherwise, and chi_c'(-1) = eps(c')^3 =: s(c'). The kernel of the unit orbit of k is therefore

    K_k(c, c') = conj(chi_c(k)) chi_c'(k) * 6 R(c, c') s(c) 1_{eps(c) = eps(c')}.

On square classes mod 4 with coordinates (e, f): R = (-1)^(eh + fg + fh), R(x, x) = (-1)^f = s(x) (so s is the diagonal
of R). eps(c) = eps(c') forces f = h, and then s R = (-1)^(f(e + g)) = phi(x) phi(y) with phi(x) = (-1)^(ef). The cubic
part eps^2 (a function of c mod 9) splits each f-class into three. Hence

    K_1 = 6 sum over the 6 values of eps of phi_eps phi_eps^T,     K_k = D_k K_1 D_k^*,  D_k = diag(conj(chi_c(k))),

positive semidefinite of rank 6 for every k, not only for sixth powers. For k = u a^6 the diagonal factor is the
coprimality indicator. The lane's signature (2, 2) is the signature of R alone, that is of the form without the
factor chi_c'(-1) and without the unit sum; pairing k with -k only gives R(x, y)(s(x) + s(y)), eigenvalues 0, 0, 4, 4
(the first referee's intermediate statement), still positive semidefinite.

**Exact check (`ref2_form.log`).** 422 primary primes prime to 6 of norm < 3000 (both conjugates of each split prime,
inert primes); sextic symbols by exponentiation modulo the prime, as integers mod 6.
- R(c, c') = chi_c(c') conj(chi_c'(c)) is +-1 on all 177,662 ordered pairs and depends only on the classes mod 4
  (all 144 pairs of the 12 odd classes seen); on the 4 square classes it is the matrix [[1,1,1,1],[1,1,-1,-1],
  [1,-1,-1,1],[1,-1,1,-1]], eigenvalues -2, -2, 2, 2: the lane's matrix. CONFIRMED.
- chi_c(-1) is a function of the class mod 4 and equals R(x, x). EXACT.
- K = R * U takes the values -6, 0, 6 (29,288 non-zero entries: the object is not zero), depends only on the classes
  mod 36 (107 of the 108 classes occur; all 11,449 pairs seen), and the class matrix equals 6 sum of phi phi^T over
  6 blocks of sizes 18, 18, 17, 18, 18, 18 with phi = +-1: **EXACT integer identity**. Float spectrum: least
  eigenvalue -3.7e-14, six positive eigenvalues, largest 108.
- On the 422 primes: least eigenvalue -1.7e-13, rank 6, largest 444. For k = 2 + omega, 5 + 3 omega, 7 - 4 omega (not
  units times sixth powers): least eigenvalue -2e-13, rank 6.
- R alone on the primes: 2 positive and 2 negative eigenvalues (-216.0, 217.3).

**Scope of "positive semidefinite".** The statement is for the leading term (g = d = e = 1) with the Gaussian factor
treated as a function of q_k alone. The Gaussian exp(-kappa X q_k/(q_d q_c1 q_c1')) couples c_1 and c_1' through the
product q_c1 q_c1'; the coprimality condition (c_1, c_1') = 1 and the terms d != 1 carry Moebius signs. The exact
statement that survives is the trivial one, Sum_m g |B_m|^2 >= 0; the non-trivial one is that each unit orbit is a
sum of six squares before those corrections.

**Consequences for the lane's text.**
1. Verdict item 3 and section 3: replace "indefinite Hermitian form of signature (2, 2)" by "positive semidefinite form
   of rank 6 in the 108 class components mod 36 of the dual vector"; replace "+- X K^(1/6) Z^(2 beta - 2), sign depending
   on the class character" by "a non-negative term of that size, zero if the class components are orthogonal to the six
   vectors phi_eps".
2. "LIOU takes values on both sides of 1: the form is indefinite" is not supported; values below 1 need the
   corrections named above or the normalisation DIAG. (First referee, E1; agreed.)
3. New remark: positivity holds for every frequency orbit, so at leading order the off-diagonal is a sum of squares
   of the six class-twisted Moebius sums per orbit; (E-K) is an upper bound for a non-negative quantity. This does not
   change any exponent.
4. LANE_LINE.json and the device text in `engine/curated/mk_devices.py` say "indefinite form" / nothing about the sign;
   the claim line should carry "positive semidefinite".

## 2. Theorem 2 bookkeeping

**Squarefree unmarked columns. CONFIRMED (OUTLINE).** abs(M_y(s)) << Z'^(-1/2 + Re s + eps) q_y^eps with
Z' = Z/(q_g q_e); frequencies up to K_g = q_d q_e^2 Z'^2/X at Re s = eps, tail at Re s = A:
(X q_k/(q_d q_e^2))^(-A) Z'^(2A - 1) = (q_k/K_g)^(-A)/Z'. Sum over k: K_g/Z' = q_d q_e Z/(q_g X). Weights 1/(q_g q_d q_e^2):
sum over g, d | g, e of 1/(q_g^2 q_e) times tau(g) is O(log Z). Times X: Z^(1+eps). Under a zero-free half-plane
Re s > beta*: abs(M_y) << Z'^(beta* - 1 + Re s + eps), total Z^(2 beta* + eps). Agrees with the lane and the first referee.
Inputs not replayed: G and R as finite combinations of ray characters uniformly (MS Lemma 4.4); 1/L << q^eps on
Re = 1/2 + eps under GRH and on Re >= beta* + eps under the zero-free hypothesis (classical).

**One mark slot (count supplied here; OUTLINE).** The marked columns are squarefree, so Lemma 1 applies with
w(c) = sum over slot primes pi | c of W(q_pi/P) V(q_c/(Z q_pi)). Writing c = pi c'', mu(c) = -mu(c''),
G(pi c'') = G(pi) G(c'') R(pi, c'') (finitely many class characters), chi_c(y) = chi_pi(y) chi_c''(y):

    M_y = - sum_pi W(q_pi/P) (eta theta)(pi) conj(chi_pi(y)) q_pi^(-1+s) * sum_{c'' prime to pi} mu(c'') (eta theta)(c'') conj(chi_c''(y)) V(q_c''/Z) q_c''^(-1+s).

Under GRH for the family the prime sum is << P^(-1/2 + Re s + eps) q_y^eps whenever the character eta theta conj(chi_.(y)) is
not principal, and the Moebius sum is << Z^(-1/2 + Re s + eps) always; when that character is principal (y in finitely
many classes modulo sixth powers: O(K^(1/6)) unit orbits up to norm K) the prime sum is of size P^(Re s). Removing the condition (c'', pi) = 1 costs a relative factor 1/P. So abs(M_y) << N^(-1/2 + Re s + eps)
in the first case and Z^(-1/2 + Re s) P^(Re s) on the O(K^(1/6)) orbits of the second; with K = N^2/X the total is
X (K/N + K^(1/6)/Z) N^eps << N^(1+eps) + X K^(1/6) Z^(-1+eps). The second term is below X for K <= Z^6. So the bound
N^(1+eps) + X Z^eps holds for the marked rows in the range K <= Z^6. Not written: two slot primes shared between c
and c' (the diagonal in the slot variable), which changes D by a bounded factor.

**Cube parts (upper bound; OUTLINE).** B_m = sum_n q_n^(-1) chi_n(m)^3 B_{m,n}, with B_{m,n} the squarefree-column row
at scale Z/q_n^3 (constants alpha(n^3), psi(n^3) of modulus 1). Cauchy-Schwarz:
abs(B_m)^2 <= (sum_n 1/q_n)(sum_n abs(B_{m,n})^2/q_n), and sum over q_n^3 <= 12 Z of 1/q_n is O(log Z). The squarefree
statement at each n gives Sum_m g_X(m) abs(B_m)^2 << Z^eps (X + N). This is (E-K) as an upper bound for X >= N. The
first referee's remark (columns (c, n a^2) and (c, n) carry the same character; coherent diagonal terms) concerns
the constant D of the asymptotic, which this argument does not give.

**Label.** Theorem 2 is OUTLINE, conditional on GRH for a family that contains the target (circular as an input, as
the lane says). In the lane's verdict line 2 and LANE_LINE.json, "holds for X >= N" should read "holds for X >= N
under family GRH, outline; asymptotic for squarefree unmarked columns, upper bound Z^eps (X + N) with cube parts and
one mark slot (K <= Z^6)".

## 3. What lanes of this round may use

- Lemma 1 and Corollary 1: two referees. PROVED-rel MS (4.7).
- The dual form is a sum of squares per unit orbit at leading order (this file, EXACT for the class kernel).
- Theorem 2: conditional outline only. Not an input to any statement about the target (circular).
- The window Z/P < X < Z P and (MV6): open, unchanged.

## 4. Weakest points of this pass

1. Lemma 1 itself was not re-derived a third time; this pass re-derived only the k-dependence it produces.
2. The mark-slot count and the cube-part bound are written here in a few lines and have no referee.
3. The exact check is on primes (422); the extension to squarefree c uses that R is a bicharacter and eps a
   character (both multiplicative in c), which is how the lane defines them.
