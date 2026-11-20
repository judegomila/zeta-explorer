# REFEREE: h-metaplectic-spin

Date 2026-11-16. Adversarial referee pass on RESULT.md. Claimed verdict: precise-obstruction, no new zero
inequality, no bound moves.

## Outcome

The verdict holds. All three PROVED steps (A, B, E) were re-derived and confirmed. The Davenport-Heilbronn (DH)
failure was reproduced with an independent script. Four corrections are required; one of them (Theorem C, n = 6
row) changes a headline phrase. None of them changes the verdict.

## Re-derivations

**Theorem A.** (i) Setwise stabiliser of {i e^b} in PSL2(Z): diagonal integer matrices of determinant 1 are +-1,
antidiagonal are +-S. Confirmed; the same holds inside the theta group <S, T^2>. (ii) theta(-1/tau) =
(-i tau)^{1/2} theta(tau), and -i tau = e^b on the geodesic. Confirmed. The lift S~ = (S, sqrt tau) has order 8
and acts on theta by e^{-i pi/4}. Confirmed. (iii) is definitional. kappa = (d_b^2 - 1/16) H checked:
(z^2/4 - 1/16) = s(s-1)/4 with s = 1/2 + z.

**Theorem B.** Coefficient actions re-derived: U: c(n) -> c(pn); N: c(n) -> [p does not divide n] c(n);
V: c(n) -> c(n/p). With index N = n^2 this is Shimura's T(p^2) in weight nu + 1/2:
b(N) = a(p^2 N) + chi*(p) (N/p) p^{nu-1} a(N) + chi(p^2) p^{2nu-1} a(N/p^2). Normalisation matches. theta has
eigenvalue 1 + 1/p in weight 1/2, the standard value. The count p^2 + (p-1) + 1 = p^2 + p cosets is correct. The
local series (1 - (eps/p)x)/(1 - lambda' x + (eps^2/p) x^2) was re-derived; for completely multiplicative a it
reduces to 1/(1 - a(p) x). The lane used T_{p^2} only and never a T_p in weight 1/2. Handled correctly.

**Theorem E.** mu chi is the Dirichlet inverse of chi for completely multiplicative chi; linearity gives
M(s) = alpha/L(s,chi) + conj(alpha)/L(s,chi-bar). Confirmed.

## Independent numerics (mpmath, 30 digits, own script, not checks.py)

- k = 0.2840790438; a(1..6) = 1, k, -k, -1, 0, 1. a(6) - a(2)a(3) = 1 + k^2 = 1.08070090314928. Confirmed.
- DH functional equation: completed ratio at s = 0.3 + 7.1i equals 1 to 1e-30.
- DH zero: 0.808517182456637 + 85.699348485377592 i, |f| = 2e-30. M(rho) = 0.758550 - 0.174303 i (finite).
- T_{p,1} theta = (1 + 1/p) theta at p = 2, 3, 5 to 3e-31 (different base point tau = 0.17 + 0.9i).
- DH ladder: p = 11 residual 3e-28; p = 3 residuals 3.22, 2.77; p = 7 residuals 7.58, 6.43.
- Inert primes 3, 7, 13, 17, 23, 37, 43, 47: a(2p) - a(p)a(2) = +-(1 + k^2), never 0.
- Split primes 11, 19, 29, 31, 41: a(pm) = chi(p) a(m) exactly for m < 200.
- Cusp asymptotic at 2c/d: reproduced; the 1.7e-6 is 2 exp(-pi/(d^2 y)) at d = 15, y = 1e-3, as stated.

## Errors and required corrections

1. **Theorem C, n = 6 row (error against the lane's own cited source).** RESULT says "grade 2 self-related,
   grade 5 vanishes, so grades 0 and 1 are undetermined" and the summary says "n = 6 leaves grade 0 free
   (exceptional term)". `sextic-theta-literature.md` lines 33-34 and 246-248 say the free local coefficients are
   tau(pi) (grade 1, equivalently grade 3) and tau(pi^2) (grade 2, constrained only in support by a quadratic
   Gauss sum). Grade 0 is the base value tau(m), which is equally "free" at n = 3. The real n = 3 / n = 6
   difference is that at n = 6 nothing links grade 1 to grade 0. Correct orbit statement: free grades at n = 6
   are {1, 2}; the count is n/2 - 1 = 2.
2. **"Exceptional term sits in the grade-0 class" is an analogy, not an identity.** Two different gradings are
   merged: (a) v_p(index) mod 6 of a sextic theta coefficient (Theorem C); (b) the class of the Poisson frequency
   H = u a^6 modulo sixth powers (section 8 item 5). The probe sum rho^nat(-e_0 m) B_m runs over general m, so it
   contains the undetermined grade-1 (squarefree) coefficients of grading (a). The exceptional coset is "grade 0"
   only in grading (b). No map between (a) and (b) is given. Downgrade to ARGUED.
3. **Theorem B(i) "iff" is under-stated.** The listed conditions (a(pm) = a(p)a(m) for m prime to p, plus the
   recursion on pure prime powers) do not imply the n = p m coefficient equation for m = p^{k-1} m' with m' > 1.
   The correct condition is a(p^k m') = a(p^k) a(m') for all k and all m' prime to p, with a(p^k) from the
   recursion. This follows from the proof (linearity of the recursion in the starting value). The "Equivalently
   the local series" form is right once this is added.
4. **Corollary B1 statement.** (a) "exactly for p = +-1 mod 5" omits p = 5: there a(5m) = 0 and the ladder is an
   eigen-section with eps = 0, lambda = 0 (verified, residual 2e-29). (b) The proof text shows failure only at
   p = 2, 3 via a(6). For every inert p != 2 use m = 2: a(2p) - a(p)a(2) = -+(1 + k^2) != 0, for all (eps, lambda).
   Verified above. With this line the corollary is PROVED for all inert p.

## Further limits (not errors in the verdict)

5. **Theorem A is a statement about definitions, not about information.** theta is holomorphic, so its restriction
   to the geodesic determines theta on the whole upper half-plane, including every cusp coefficient and the
   multiplier system. "No bridge object depends on v_theta(gamma)" means only that the defining formulas do not
   invoke it. The sentence "this is the structural reason the 14 lanes found only the functional equation" is
   ARGUED, not PROVED. "The cocycle is real and positive on the geodesic" should read: the automorphy factor
   (multiplier e^{-i pi/4} times sqrt tau) is real and positive there; the multiplier itself is not.
6. **p = 2.** The operator T_{2,eps} is an identity on q-series, but p = 2 divides the level (theta group; 100 for
   the conductor-5 ladders), so it is not Shimura's T(4). The DH failure does not depend on it (p = 3 suffices).
7. **DH ladder and nebentypus.** theta_chi and theta_chi-bar have different characters, so the DH ladder lies in
   no single space M_{3/2}(100, psi). "Eigen-section of T_{p^2}" is meaningful only for the two-parameter family
   T_{p,eps} defined on q-series, as the lane does. This should be stated.
8. **Theorem E is an identity; "the detector applied to DH" is a model.** The manuscript's twist eta is a Hecke
   character; replacing eta by a non-multiplicative sequence is the lane's choice. Manuscript sections 8-20 were
   not read (admitted). The identification of the failing step with manuscript 7.2 and 8 is ARGUED.
9. **Dictionary.** Exact identities: the +-i of PR 43 section 2 (text confirmed at line 52 of
   geometry_and_twistors.md) = lifts (-1, +-i) of the centre, square (1, -1); e^{b/4} = square root of the modulus
   of the weight-1/2 factor on the geodesic; H^4 = (4/pi^2) K K'. Section 7 rows are a translation table
   (same-shape statements), not identities; RESULT says so in weakest step 1.
10. Control-table cells outside the DH column were not computed (admitted). Theorem D and C rest on repo notes of
    the literature, not primary sources (admitted). Theorem D content (complex Hilbert symbol trivial, SL2(C)
    simply connected, mu_n in Q forces n <= 2) is standard and correct.

## Surviving claim

Precise obstruction; no zero inequality; no bound moves. (A) Bridge objects are defined from theta on the geodesic
i e^b with stabiliser {1, S} and positive automorphy factor; the Jacobi symbol enters only as the cusp coefficient
at 2c/d (measured). (B) A ladder is a T_{p,eps} eigen-section iff a(p^k m) = a(p^k) a(m) with the stated local
factor; DH is eigen at p = +-1 mod 5 and (degenerately, eps = 0) at p = 5, and at no inert prime. (E) sum mu a
n^{-s} for DH is alpha/L(chi) + conj(alpha)/L(chi-bar), finite at the DH off-line zero. (D) holds as stated.
(C) holds for n = 2, 3; for n = 6 the free grades are 1 and 2, and the link to the exceptional term is ARGUED.
Both DH-failing steps are the Euler product restated.
