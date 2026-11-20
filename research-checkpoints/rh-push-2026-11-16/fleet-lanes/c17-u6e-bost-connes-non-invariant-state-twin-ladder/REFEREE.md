# REFEREE (adversarial, lens: general): c17-u6e-bost-connes-non-invariant-state-twin-ladder

Date 2026-11-19. Read: RESULT.md in full, checks.py, checks.log. Not opened: c12 / c16 lane files (cross-references
to "c12 Lemma P", "c12 Lemma L", "c16 row U6 (e)" are taken as quoted), Bost-Connes 1995, HLS 1997, Titchmarsh.
Numerics: one local run, mpmath 30 digits + float64, through `scripts/memcap.sh 8` (script kept outside the lane
directory, /tmp/c17ref/ref.py; not a deliverable). Server not used.

## Verdict

**The claimed verdict (precise obstruction, no statement about zeros of zeta) holds.** Every step labelled PROVED
was re-derived and is correct, with one display error (E1) and three scope/label corrections (E2-E4). None changes
a conclusion. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.
No step assumes RH; nothing restates verified height; no claim about zeros in the strip is made.

## Errors and corrections

**E1 (display error, section 3.3 (b); confirmed numerically).** The adjoint is V_n* g(x) = n^-s g(n x), not
n^-conj(s) g(n x): <V_n f, g> = n^conj(s) n^-beta int conj(f(y)) g(n y) dnu(y) and conj(s) - beta = -s. Hence
V_m* 1 = m^-s 1, not m^-conj(s) 1. The next display, Omega_s(mu_n x mu_m*) = n^-conj(s) m^-s nu(x), is correct
and follows only from the corrected adjoint (with the adjoint as printed one would get n^-s m^-conj(s)).
Check D (atomic measure, beta = 2.4, n = 3, random f, g): abs(<V_n f, g> - <f, n^-s g(n .)>) = 3e-32;
with n^-conj(s) the difference is 0.32. checks.py uses the correct final formula, so N2 is unaffected.

**E2 (scope of the read-set sentences, Lemma E (c), statement 2 of section 0, section 6).** "No value of an
L-function at a point with non-zero ordinate" is true on the algebraic Hecke algebra (finite sums), which is how
Lemma E (c) is worded, but not on A. Example: X = sum_n n^-u mu_n* with Re u > 1 converges in norm, X is in A,
and Omega_s(X) = zeta(u + s), ordinate Im u + t. The argument still has real part > 1 + beta/2 > 1, so the
conclusion "nothing inside the strip" survives for every absolutely summable element (abs(lambda) <= 1 makes the
read absolutely convergent). For general elements of the norm closure the read set is not described; the
section 6 closure ("closed by the read set") is therefore established for algebraic X and absolutely summable X
only. For the sub-row D8 (vi) text: insert "on the algebraic Hecke algebra".

**E3 (labels: known facts listed as new).** Lemma G is the textbook statement that a state conjugated by an
invertible element is a state in the same GNS representation (Dixmier 2.4; Bratteli-Robinson 2.3); it should be
CLASSICAL, and only its application to the twins is the lane's content. Lemma T is Kakutani's dichotomy for
product vectors plus the norm distance of vector states; Lemma S (a) is Cauchy-Schwarz; the representation of
3.3 (b) is the quasi-regular (Koopman) representation on L^2(Z^, nu_beta) with the cocycle n^it. None of these
is presented as a statement about zeros, so this is a labelling correction, not an overclaim.

**E4 (the twist of the cell versus the twist of Lemma G).** The cell's control is phi -> phi(D .)/phi(D). For a
state whose centraliser does not contain D (every non-invariant state considered here) this differs from
omega(D^(1/2) . D^(1/2))/omega(D) and is in general not positive. Lemma G treats the second map. That is the
correct twin (its overlaps are sum a(k) k^-(conj(w)+s) = the T-NR function at conj(w) + s, re-derived), but the
sentence "no state has positivity not preserved under the D-twist" is true only for the conjugation form; for
the literal one-sided form positivity fails for trivial reasons (D x is not positive). The remark
"D xi_s is the vector with the T-NR coefficients" describes b = D, not b = D^(1/2); both are invertible, so
Lemma G applies either way. The conclusion "positivity of a state does not separate the twins" stands.

No other error found.

## Re-derivation of each PROVED step

- **Lemma G.** b* b >= norm(b^-1)^-2, so omega(b* b) > 0; omega_b(a* a) = omega((ab)*(ab))/omega(b* b) >= 0;
  pi(A) pi(b) Omega = pi(A) Omega because A b = A. Confirmed. DEL: (1 - p^-s mu_p) xi_s = sum_{p not| n} n^-s e_n
  and 1 - p^-s mu_p is invertible (Neumann series, abs(p^-s) < 1). Confirmed. Finite S only, as stated.
- **Kernel formula 3.2 / Lemma K.** mu_n* mu_m = mu_m' mu_n'*, e(-r) mu_m' = mu_m' e(-m' r),
  mu_n'* e(r') = e(n' r') mu_n'*, mu_m'* xi_w = m'^-w xi_w: gives m'^-conj(w) n'^-s zeta(conj(w) + s; n' r' - m' r).
  Confirmed. (b): positive semidefinite kernel on a total set + boundedness of X gives X >= 0. Confirmed
  (faithfulness of the l^2(N) representation is CLASSICAL, not opened).
- **Lemma E.** (a) omega(mu_n* mu_m*) = lambda(m) lambda(n); omega(mu_n x) = conj(omega(x* mu_n*));
  nu(mu_n x mu_n*) = abs(lambda(n))^2 nu(x). Confirmed. "Classified" means: determined by (lambda, nu) with these
  necessary conditions; existence is shown for lambda(m) = m^-s and for the DEL / gauge variants, not for every
  admissible pair. (b) V_n isometric, relations of section 2 including mu_n e(r) mu_n* = e(r ./n) 1_{nZ^},
  identification with xi_s for the atomic measure: confirmed, with E1. (c) f_beta(p) = (p^(1-beta) - 1)/(p - 1)
  derived by hand from nu_p = (1 - p^-beta) sum_k p^-k beta Haar(p^k Z_p^*); general b checked numerically
  (check B). (d) Bohr mean: confirmed termwise. (e) b . 1 = 1_{x_p unit}, lambda(p) = 0: confirmed.
- **Lemma T.** (a) the restriction of an eigenstate to T_S is the vector state of sum lambda(n) e_n on l^2(N_S)
  (uses nu(1) = 1 only); F_p formula; norm distance 2 sqrt(1 - overlap^2) in an irreducible representation;
  restriction lowers the norm. Confirmed. (b) F_p^-2 = 1 + 2x(1 - cos theta)/(1 - x)^2 confirmed; the bound
  log F_p <= -(1/5) x (1 - cos theta) follows from log(1 + z) >= z log(5)/4 on [0, 4] (the RESULT omits this
  line; it is correct, and check C1 finds no violation on a 400 x 200 grid). Divergence for beta <= 1 needs
  only that abs(zeta(1 + i tau)) is finite, not that it is non-zero. Confirmed. T-NR twin for beta <= 1: D
  commutes with mu_n for (n, q) = 1, so the restriction to T_S, q not in S, equals that of Omega_s; distance 2.
  Confirmed.
- **Lemma S.** (a) trivial. (c) phi(mu_n* mu_m) = delta_nm and phi(mu_m mu_n*) = delta_nm n^-beta give
  zeta(2 Re w - iz) and zeta(2 Re w + beta - iz). Confirmed. (d) terms n a = m b, n = b k, m = a k give
  a^-(conj(w)+beta) b^-(w+beta) f_beta zeta(2 Re w + beta). Confirmed.
- **N4.** With z = sqrt(q) q^-u the local factor is 1 + c z + z^2; the root of modulus less than 1 gives
  Re u = 1/2 + arccosh(c/2)/log q, Im u = pi/log q; right of 1 iff c > q^(1/2) + q^(-1/2). Confirmed by hand
  and at q = 5, c = 3 (zero at 1.09799 + 1.95198 i, residual 3e-31).

## Numeric checks rerun with different cases (all mine, not the lane's parameters)

| check | case | outcome |
|---|---|---|
| A (kernel formula) | w = 1.3 - 2.1i, s = 1.7 + 5.3i; (n, r, m, r') = (10, 3/7, 15, 2/11), (8, 1/5, 12, 4/5); K = 4e4 | differences 6.5e-11, 3.5e-9; tail bounds 2.8e-7, 1.8e-7 |
| B (nu_beta(e(a/b)) by direct local integration vs f_beta) | beta = 0.3, 0.9, 1, 1.6; p^k in {2, 8, 9, 25, 27, 16} with non-reduced numerators | worst difference 1e-31 |
| B2 (Gram matrices, 100 words mu_n e(a/20), n in {1, 2, 4, 5, 10}, t = 2.7) | beta = 0.3, 0.9; zeta; DEL S = {2, 5}; T-NR q = 2, c = 2.1 | least eigenvalues between -7e-29 and -9e-31 (zero to working precision), largest 34.5 / 2.5 / 205.0 and 6.08 / 2.5 / 33.0; Omega(D) closed form to 8e-31 |
| B2 sensitivity | same Gram with nu_{beta + 0.4} in place of nu_beta | least eigenvalue -1.89 and -0.77: the test detects a wrong measure |
| D (adjoint exponent) | see E1 | n^-s correct, n^-conj(s) off by 0.32 |
| C2 (norm distance of vector states) | random unit vectors in C^7 | trace norm 1.92773733 = 2 sqrt(1 - overlap^2) |
| C3 (partial overlaps, float64, primes to 1e7) | tau = 3.3 and 21.0220; beta = 0.4: -1853, -1894; beta = 0.9: -6.33, -6.91 (still decreasing by about 1.3 per two decades); beta = 1: -3.793, -4.208 vs Mertens -3.797, -4.207; beta = 1.2: -2.099, -2.330 vs log(abs(zeta)/zeta(beta)) = -2.109, -2.340 (difference consistent with the tail sum over p > 1e7 of order P^-0.2/log P) | agrees with Lemma T (b) |

## Controls (run by this referee)

The only mechanism in the lane in which multiplicativity is essential is (J) for beta > 1, which is the
Euler-product non-vanishing right of 1. Controls against it and against the positivity statements:
- DEL (S = {2, 5}, different from the lane's S = {3}): eigenstate, Gram positive semidefinite, passes [M], S, (J).
- T-NR (q = 2, c = 2.1; strip range 2 < c < 2.1213): conjugated state positive semidefinite; fails [M] only at q;
  for beta <= 1 the same distance 2 (re-derived above).
- THIN / U / completely multiplicative sign twist: F_p depends on abs(lambda(p)) and on conj(lambda) lambda'
  only, both unchanged by a unimodular completely multiplicative factor common to the two states. Confirmed on paper.
- E_a: tensor product; product of two overlaps. Confirmed on paper.
- DH, backward heat: not mu*-eigenvectors; the lane correctly records "not formulable" rather than a pass.
- ZQ, NR-q, BLS, EIS-w: "no realisation" or ARGUED in the lane; not checked here and not needed for the verdict,
  since two controls (DEL, E_a) already pass every step.
So no step of the lane is zeta-only; the lane does not claim one. R3 = false is correct.

## Requirement flags (set strictly)

- R1 = false. Multiplicativity enters essentially only in non-vanishing of the overlap for beta > 1 (classical).
- R2 = false. No inequality at height t inside the strip is produced.
- R3 = false. DEL (finite S) and E_a pass every step; T-NR passes all positivity statements.
- R4 = false. Lemma T gives overlap 0 for beta <= 1; nothing crosses to the critical line.

## What survives

1. For every state omega on A and invertible b, omega(b* . b)/omega(b* b) is a state in the same GNS
   representation (classical); T-NR in the conjugation form b = D^(1/2), finite DEL and the gauge twins are of
   this form, so positivity of a state does not separate them from zeta.
2. mu*-eigenstates with lambda(m) = m^-s exist for every Re s > 0 (representation on L^2(Z^, nu_beta), adjoint
   corrected per E1); on the algebraic Hecke algebra they read n^-conj(s), m^-s and nu(e(r)); on absolutely
   summable elements they read absolutely convergent series with every zeta-argument of real part > 1.
3. Kernels <xi_w, X xi_s> read zeta(conj(w) + s; r), real part > 1, and are positive semidefinite iff X >= 0.
4. Norm distance of two eigenstates on Re s = beta/2: 2 sqrt(1 - abs(zeta(beta + i tau))^2/zeta(beta)^2) for the
   vector states at beta > 1; exactly 2 for beta <= 1, also for DEL, THIN, U, T-NR twin, E_a.
5. Open, as the lane states: states defined by other exact relations; normal states of the type III_1 factor
   beyond the three families; general elements of the norm closure (E2); the claim that Lemma T proves the
   relabelled sentence of c12 Lemma P was not checked against c12.
