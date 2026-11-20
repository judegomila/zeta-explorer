# REFEREE2: second independent referee on the control tables of the three round-11 stage-A closures

Date 2026-11-19. Lane `c12-repair-sources-statement-o-v3`. Scope: the control tables only (the passing control's
pass, re-derived at every step), for
`c11-rs1-regular-rep-matrix-bridge`, `c11-rs1-twist-modulus-reciprocity`, `c11-rs3-debranges-positivity-family`.
Each lane already has one independent referee file; this is the second pass. Local numerics only
(`ref2_checks.py`, `scripts/memcap.sh 8`, mpmath 30 digits, 20 s; output `ref2_checks.json`, `ref2_checks.log`).
The compute server was not used. No statement about zeros of zeta is made or needed.

Labels: CONFIRMED (re-derived here) / CONFIRMED-rel X / MEASURED (mine) / OPENED (primary text read in this
lane, see RESULT.md section 1) / NOT ESTABLISHED.

**Outcome. All three closures stand. No PROVED step is broken.** Seven corrections, none changing a verdict or
a flag: R-1 to R-3 (regular representation), T-1 to T-3 (twist-modulus), B-1 (de Branges).

## 1. `c11-rs1-regular-rep-matrix-bridge` (decisive first test; lane `c12-univ-pointwise-control-wcone` builds on it)

Passing controls claimed: the matrix lifts of E_a and T-NR pass [P], [E], [FE], [PER]; only [PERM] separates.

### 1.1 E_a lift, step by step

M_q(s + a) M_q(s - a) with R(d)R(e) = R(de):

- Coefficients: sum over de = n of d^(-a) e^(a) R(n) = sigma_2a(n) n^(-a) R(n). CONFIRMED.
- [P] product level: a positive number times a permutation matrix. Log level: (p^(ka) + p^(-ka)) R(p^k)/k >= 0.
  Both CONFIRMED. So the E_a lift passes positivity at both levels.
- [E]: product of two commuting matrix Euler products; local factor of degree 2 with parameters p^(+a), p^(-a)
  times R(p). CONFIRMED.
- [FE]: with Lambda(1 - w, chi-bar) = eps(chi)^-1 Lambda(w, chi) applied at w = s - a and w = s + a,
  Lambda(1 - s + a, chi-bar) Lambda(1 - s - a, chi-bar) = eps(chi)^-2 Lambda(s + a, chi) Lambda(s - a, chi).
  CONFIRMED; MEASURED at p = 7, 11, three characters each, s = 0.37 + 2.9i, a = 0.2: relative defect below 3e-30.
  **Correction R-1.** The functional equation of the lift is not that of M_q: the root-number matrix is E^2 in
  place of E and the gamma factor has degree 2, Gamma((s + a + k)/2) Gamma((s - a + k)/2). The table entry
  "[FE] yes" is true as "a functional equation of Gauss-sum type under s <-> 1 - s", not as "the target's own".
- Bridge symbol: eps^-1 Lambda(1/2 + z + a, chi) Lambda(1/2 + z - a, chi) equals abs(Lambda(1/2 + a + it, chi))^2
  at z = it (the functional equation gives conj X = eps^-1 Y for the two factors). Real and non-negative on the
  axis; MEASURED imaginary part below 6e-32. So D, N, S = N/D are defined, S is unitary on the axis, and the
  zeros at z = a + i gamma (Perron direction) give Gamma_- != 0. CONFIRMED.
- [PER]: the coefficient matrix depends on n mod q through R(n). CONFIRMED.
- [PERM]: fails (coefficient sigma_2a(n) n^(-a) != 1). CONFIRMED.

### 1.2 T-NR lift, step by step

M_q(s) (R(p0)^-1 p0^(s-1/2) + c + R(p0) p0^(1/2-s)), p0 not dividing q, c > 2.

- Eigenvalue L(s, chi)(conj chi(p0) p0^(s-1/2) + c + chi(p0) p0^(1/2-s)); the bracket is invariant under
  (s, chi) -> (1 - s, chi-bar). CONFIRMED. So [FE] holds with the gamma factor and the matrix E of M_q itself.
- Zeros of the bracket: chi(p0) p0^(1/2-s) = -exp(+-theta), cosh theta = c/2, that is
  Re s = 1/2 +- arccosh(c/2)/log p0, Im s = (arg chi(p0) - pi)/log p0 mod 2 pi/log p0. CONFIRMED; MEASURED at
  (q, p0, c) = (7, 5, 2.3), (7, 3, 2.2), (5, 2, 2.5), (5, 2, 2.1), three characters each: abs(bracket) < 6e-31.
  **Correction R-2.** RESULT section 4 says "for c in (2, 2.5) the same formula gives Re s inside the strip".
  The zero is inside the strip exactly for 2 < c < p0^(1/2) + p0^(-1/2): 2.1213 for p0 = 2, 2.3094 for p0 = 3,
  2.6833 for p0 = 5. At p0 = 2, c = 2.5 the zero is at Re s = 3/2 exactly (cosh(log 2) = 5/4). The lane's main
  check (p0 = 2, c = 3) has Re s = 1.8885, right of 1. The case c = 2.1 (Re s = 0.9543) is correct. A table
  that wants a zero in the open strip must take c below the bound; the first referee's case (p0 = 3, c = 2.1)
  does.
- [P]: product level only, as a generalised Dirichlet series with frequencies n and n/p0 (first referee, item
  6). CONFIRMED. After removing the monomial, the ordinary Dirichlet series
  L(s, chi)(1 + c chi(p0) p0^(1/2) p0^-s + chi(p0)^2 p0 p0^(-2s)) has periodic coefficients and conductor
  q p0^2, and local roots of modulus p0^(1/2) exp(+-theta) at p0.
- [E]: Euler product with one modified local factor. [PER]: twists by chi with chi(n/p0) = chi(n) conj chi(p0).
  CONFIRMED.

**Correction R-3 (reading of the table; for the lane that builds on it).** No single passing control keeps
both (i) non-negative log-level coefficients and (ii) M_q's own functional equation (degree-one gamma factor,
matrix E): the E_a lift loses (ii) (R-1), the T-NR lift loses (i) (first referee, item 6). By the degree-one
classification (Kaczorowski-Perelli Theorems 2 and 3, OPENED) no such control exists among ordinary Dirichlet
series with an Euler product whose logarithmic coefficients are O(n^theta), theta < 1/2: the function is then a
Dirichlet L-function. So "E_a and T-NR pass P, E, FE, PER" is correct entry by entry, and a device step that
reads log-level positivity together with the degree-one gamma factor is tested by neither control alone. On the
Perron slice, where Lemma P places the content, this is the identification "the chi_0 eigenvalue is zeta"
(first referee, correction 3), not an open slot. Recorded so that a W-adapted cone statement is screened
against both lifts and against the identification, not against the table line alone.

### 1.3 PROVED lemmas (re-derived, short)

Lemma S (idempotents e_chi commute with P_c, Q_c): CONFIRMED. Lemma P (v = 1 has v^(chi) = phi delta_{chi,chi_0};
sum_c h(c) = H^{chi_0}): CONFIRMED. Lemma Q (Parseval on G; norm(Gamma_-^zeta) <= phi max_c): CONFIRMED.
Lemma 1 (tr R(n) = phi 1_{n = 1 mod q}): CONFIRMED. The first referee's six corrections are consistent with
these re-derivations. Verdict "closed at stage A for forms (K), (E), (Q), (H)": stands. Flags false.

## 2. `c11-rs1-twist-modulus-reciprocity`

Passing controls claimed: T-NR (Lemma 5), E_a with real a (Lemma 3), window translate.

### 2.1 T-NR, step by step

- S0, S1, S2: hold for every ordinary Dirichlet series. CONFIRMED.
- Nine-term identity: abs(u_0 + u_1 chi(q0) + u_2 chi(q0)^2)^2 = sum u_i conj(u_j) chi(q0^(i-j)), so
  sum_chi abs(X(s, chi))^2 chi(h) = sum_{i,j} u_i conj(u_j) M_s(h q0^(i-j); p). Algebra, valid at every s.
  CONFIRMED; MEASURED over all characters at (p, q0, c, s) = (11, 2, 2.1, 1/2 + 3i), (13, 3, 2.2, 1/2 + 7.7i),
  (11, 2, 2.1, 0.8 + 1.3i): defect below 7e-28 against values up to 580. The lane measured it at s = 1 only.
- S3: the coefficients of 1/X(s, chi) are linear in chi(l), supported on l = d q0^j. CONFIRMED as a formal
  statement. Their size on powers of q0 is q0^(j(1/2 + theta/log q0)), and the expansion in q0^(-s) converges
  only to the right of the twin's zero. This is the one place where the twin differs from zeta inside S0 to
  S4, and it is a size, not an identity (the lane says the same in its closing sentence).
- S4: whatever identity holds for M_s(a; p) for every twist a prime to p transfers to the twin by the
  nine-term identity (first referee, E2). CONFIRMED. What is on file for zeta, after opening the source:
  **Correction T-1 (label "at the centre relative to Bettin").** Bettin, arXiv:1607.05595v1 (OPENED; TeX source
  read): Theorems 1 to 3 are stated for distinct primes a, q, at the central point s = 1/2, with integer
  shifts j (pairs L(1/2 - j, chi-bar) L(1/2 + j, chi)). Theorem 4 and Corollary 1 allow any positive integer a
  with q prime. Theorem 5 (moment = combination of Estermann functions D(s + z, 2s - 1; +-a/q)) is stated for q
  prime and complex s, z, as an identity of meromorphic functions; the text says the generalisation to
  non-prime moduli is easy and is not carried out. The reciprocity of the Estermann function (Lemma 8 and the
  corollary after it) is stated for coprime positive integers a, q, "valid also for composite a, q", with a
  complex parameter s, abs(Re s) < 1/2, which is the index of sigma_2s(n) and corresponds to the pair
  L(1/2 + s - j, chi-bar) L(1/2 + s + j, chi). Consequences:
  (a) At s = 1/2 (t = 0), S4 for zeta is available for every twist prime to p (Theorem 5 with Lemma 8 and Corollary 9): the
  T-NR pass at the centre holds relative to these two statements, with the dual side written as Estermann
  functions at p/a (the moment form to a composite modulus a = l q0^j is not in the text).
  (b) The lane's sentence "the formula is stated for general coprime h, k" is true of Lemma 8, Corollary 9 and of
  Corollary 2 (an asymptotic with error term), not of the exact reciprocity Theorems 2 and 3 (primes).
  (c) At s = 1/2 + it, t != 0, the text has no exact reciprocity for sum_chi abs(L(1/2 + it, chi))^2 chi(a):
  that moment is the case s = 1/2, z = it of Theorem 5, and the reciprocity lemma has the complex parameter in
  the other variable. With real parameter the lemma does cover abs(L(1/2 + a, chi))^2 (real shift, t = 0).
  So "S4 at s = 1/2 + it relative to Conrey, Young, Bettin" is NOT ESTABLISHED by the opened source; it is
  established at t = 0 and at real shifts. (d) The remainder is continuous in a/q (Theorem 1), C^N (Theorem 3),
  analytic in the upper half-plane variable (Lemma 8); "analytic in h/k" is not stated.
  The verdict does not depend on (c): a step that is not on file for zeta cannot separate zeta from the twin,
  and the twin passes every step that is.
- S5 false for the twin at a zero in the strip: X(s_0, chi_0) = 0, so J <= 0 for every a (Lemma 4 (b)).
  CONFIRMED.

### 2.2 E_a with real a

Re-derived: L(1/2 - a + it, chi) = eps(chi) g conj L(1/2 + a + it, chi) with g = gamma(1/2 + a - it)/gamma(1/2 - a + it),
the same for all chi of one parity, positive at t = 0 and of constant phase per parity class at t != 0.
CONFIRMED. **Correction T-2 = first referee E1, found again independently.** This is a statement about the form
linear in conj(eps) E_a(s, chi). Candidate (C) with target F = E_a reads abs(E_a(s, chi))^2, a twisted fourth
moment; S4 for it is not on file (the opened source treats second moments only), exactly as in the lane's own
interpolation-twin row. In the literal reading E_a stops at S4 ("not available"); in the linear reading the row
is the covariance of the device in sigma, which the window-translate row and section 3 already state. The E_a
row is not a control pass of (C). The closure rests on T-NR and the window translate.

### 2.3 Window translate

(C) for zeta(s + i alpha) at s is (C) for zeta at s + i alpha. CONFIRMED by substitution.
**Correction T-3 (sign).** A_chi(s) = sum a_l chi(l) l^-s = sum (a_l l^(i alpha)) chi(l) l^-(s + i alpha): the
transported weights are a_l l^(+i alpha), not a_l l^(-i alpha) as written in the table.

Verdict "closed at the decisive test on T-NR and the window translate": stands. Flags false.

## 3. `c11-rs3-debranges-positivity-family`

The closure does not rest on a control: the condition is false for zeta itself (Conrey-Li, opened by the lane and
by its first referee). Checked here: Re{xi(s)/xi(s + 1)} at s = 1 + 282i = -0.000131957293 (MEASURED; agrees
with the published value). Passing control claimed: LAT, E(z) = sin(L(z + i/2)).

### 3.1 LAT, step by step

- Hypotheses of Theorem 1. No real zeros: zeros at n pi/L - i/2. E*(z) = sin(L(z - i/2)) = E(z - i), eps = 1.
  abs(sin(x + iy))^2 = sin^2 x + sinh^2 y gives abs(E)^2 - abs(E*)^2 = sinh^2(L(y + 1/2)) - sinh^2(L(y - 1/2)) > 0
  for y > 0, and abs(E(x + iy)) strictly increasing in y > 0. CONFIRMED.
- (N1): zeros on Im z = -1/2. CONFIRMED.
- (P): with u = L(z + i/2), Im u > 0: sin(u + iL)/sin u = cosh L + i sinh L cot u and i cot u = (1 + q)/(1 - q),
  q = exp(2iu), abs(q) < 1, so the real part is at least cosh L > 0, and the reciprocal has positive real part.
  CONFIRMED; MEASURED minimum of Re{sin u/sin(u + iL)} over 4000 random (L, u): 1.3e-7 > 0.
- (N2) and the boundary condition of Lemma 2: at the zero u_0 = n pi, xi'(rho)/xi(rho + 1) corresponds to
  i E'(w)/E(w + i) = L/sinh L > 0 (real and positive, independent of n). CONFIRMED; MEASURED at L = 1.7, n = 5:
  0.64256859704 against L/sinh L = 0.64256859704, imaginary part 6e-31.
- Full condition (C) for LAT: not derived here either. It follows in the weight form only through Lemma 3 of
  the lane (ARGUED). First referee E4 stands: "passes every step" means the hypotheses and the necessary
  conditions (N1), (N2), (P).

### 3.2 The step relative to Bohr (variant V1c, 1/2 < sigma_0 <= 1)

**B-1 (source opened; match).** Bohr, Acta Math. 40 (1916) 67-100, Satz A (OPENED, scan read): for fixed
sigma_0 with 1/2 < sigma_0 <= 1 the values of log zeta(s) at the points of the half-line sigma = sigma_0, t > 0
that belong to G are dense in the plane, where G is the half-plane sigma > 1/2 with the real segment (1/2, 1]
and the horizontal segments from the line 1/2 to each zero removed, and log zeta is the branch that is real for
real s > 1. This is the branch "continued from the right" that the lane's argument needs: under the Theorem-2
conclusion (zero-free in Re s > sigma_0) the line sigma in (max(sigma_0, 1 - h), 1) lies in G; Im log f is in
[-pi/2, pi/2] for f = xi(s)/xi(s + h); Im log zeta(sigma + h + it) is bounded since sigma + h > 1; the gamma
phase difference tends to h pi/4 and the factors pi^(-s/2) cancel; so Im log zeta(sigma + it) would be bounded,
against Satz A. CONFIRMED-rel Bohr 1916 Satz A; the label "RECALLED" of the lane becomes "OPENED".
The case sigma_0 = 1 (limit sigma -> 1+) needs only that sup_t abs(Im log zeta(sigma + it)) is unbounded as
sigma -> 1+ (Kronecker; classical, not opened), or Satz A at sigma_0 = 1 itself.

Verdict "closed at stage A; false for zeta at (N2) and (P); lattice passes the hypotheses and necessary
conditions": stands. Flags false. V3b (tied conductor family) remains ARGUED and was not examined here.

## 4. Summary of corrections by lane

| id | lane | correction | changes verdict or flag |
|---|---|---|---|
| R-1 | c11-rs1-regular-rep-matrix-bridge | E_a lift: functional equation with E^2 and a degree-two gamma factor, not M_q's own | no |
| R-2 | c11-rs1-regular-rep-matrix-bridge | T-NR lift: zero in the strip only for c < p0^(1/2) + p0^(-1/2) (2.1213 at p0 = 2), not for c in (2, 2.5) | no |
| R-3 | c11-rs1-regular-rep-matrix-bridge | no single control keeps log-level positivity and M_q's own functional equation; that pair is an identification in degree one (rel. Kaczorowski-Perelli, opened) | no |
| T-1 | c11-rs1-twist-modulus-reciprocity | Bettin opened: exact reciprocity at s = 1/2 only (primes in Theorems 1 to 3; composite in the Estermann lemma); no exact reciprocity for abs(L(1/2 + it, chi))^2, t != 0 | no |
| T-2 | c11-rs1-twist-modulus-reciprocity | E_a row is not a pass of candidate (C) (same as first referee E1) | no |
| T-3 | c11-rs1-twist-modulus-reciprocity | window translate: weights a_l l^(+i alpha) | no |
| B-1 | c11-rs3-debranges-positivity-family | Bohr 1916 Satz A opened: statement and branch match; label RECALLED -> OPENED | no |

Referee count after this file: two independent files for each of the three control tables (the lane's
`REFEREE.md` and this one). A broken PROVED step: none found.
