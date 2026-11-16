# Referee report on eq48/RESULT.md

Date: 2026-11-16. Sources: refs/pr/47 (7e6d01d9), refs/pr/48 (499528b4), refs/pr/50 (146ce77a), and
Suzuki, arXiv:2206.03682v4 (JLMS 108, 2023), pp. 1-3, read from the PDF.
Independent numerics: `/tmp/eq48ref/ref_check.py` (kept outside the repo to respect the write-only-REFEREE.md rule) (mpmath at 30 digits, primes up to 2e6).
Nothing was pushed and RESULT.md was not edited.

## Summary

| Item | Verdict |
|---|---|
| (1) Thm 1 identity (constants, archimedean, pole) | HOLDS |
| (2) Thm 2 genericity induction (a)=>(b) | HOLDS. (a')=>(b_I) has a definitional GAP. |
| (3) PR #50 Prop. 5 (off-line zero gives a negative finite test) | HOLDS |
| (4) Suzuki normalization | HOLDS (checked against the paper) |
| (5) Thm 4 margin failure, unconditional | HOLDS (exponent typo). The Verdict section overstates its scope. |

No WRONG items. No counterexample found.

## (1) Theorem 1: HOLDS

Checks done by hand:
- The anchored split, PR #48 (4). Use 1/s + psi(s/2)/2 = psi(s/2+1)/2 with s = 1/2+p. Then
  (1/2)[psi(5/4+p/2) - psi(5/4)] = sum_k p/(lambda_k(lambda_k+p)) with lambda_k = 2k+5/2.
  The constant is psi(5/4)/2 - log(pi)/2 = -c_0. The term 1/(s-1) gives 1/(p-1/2).
  Then zeta'/zeta(s) = -sum Lambda(n) n^{-1/2} e^{-p log n}. All correct.
- (1.6), (1.7), the pole factorization (10)-(11), and the integration by parts (16):
  M(0)=0 and the boundary term vanishes since x_min > 1/2. All correct.
- The Laplace transform of g*g~ is G(z) conj G(-conj z). With g(u) = f(e^{-u}) e^{-u/2},
  G(rho_c) = f~(rho) and G(-conj rho_c) = f~(1-conj rho). This is Bombieri's form.

New numerical test: 4 nodes (2.1, 2.9, 3.3, 4.6), complex coefficients (1+.5i, -2+i, .7-1.3i, .4+.2i).
- Pick Q_L = 7.80762759e-3.
- Eq. (16), evaluated directly with M(l) (closed-form smooth part and primes to 2e6): differs by 8.4e-12.
- Zero sum over 600 zeros: differs by 3.5e-4. Here sum b = 0.1+0.4i is nonzero. The predicted tail is
  |sum b|^2 * 2 * sum_{gamma > gamma_600} gamma^{-2}, about 3.4e-4. Consistent.

So the archimedean, pole and constant terms are right. Caveat, cosmetic only: "W(g_v)" is defined as the
zero side. The prime/archimedean side is identified with it through PR #48 (13), not through a
standard-form explicit formula for a test with a corner at 0. That is legitimate, because both sides
are proved equal to Q_L directly.

## (2) Theorem 2: HOLDS, with one definitional GAP

(a)=>(b) is sound.
- L is real-analytic on (1/2, inf): xi(1) != 0 and there are no zeros with Re s >= 1.
- det P_T is real-analytic on the convex ordered cone.
- Not identically zero: Gershgorin at geometric nodes. Lemma B's bound assumes L_j >= L_i. The correct
  bound is 2 sqrt((max L / min L) * x_i/x_j) <= 2 sqrt(C (n-1) log R / (c R)) -> 0, so the conclusion
  stands. Numerically, the normalized minimum eigenvalue for n=5 is 4.8e-5 at R=3, 0.033 at R=10 and
  0.18 at R=30.
- Having a negative eigenvalue is an open condition. The zero set of det P_T has empty interior.
  Perturbing only T's coordinates keeps the nodes distinct.
- Induction gives P_T PSD and nonsingular, hence PD. The Schur step applies.
- Strict versus non-strict positivity is handled correctly: (b) is PSD, and (a) only needs P_T PD,
  which genericity supplies.

GAP in (a')=>(b_I). As literally stated, (a') only constrains steps where the prefix P_T is PD. If some
actual defect equals 0, the next prefix is singular. The residual (-P^{-1}p, 1) is then undefined, and
(a') is vacuous from that point on, so it does not force PSD on later prefixes. RESULT patches this
only in a parenthetical ("read with the generalized Schur complement"). The patch is correct, but
Thm 3 lists (a') without it.
Fix: define (a') as "every prefix matrix PSD (generalized Schur conditions v in ran P, d - v* P^+ v >= 0)".
Alternatively, add the hypothesis that all prefixes are PD.
This does not affect (a) <=> (b) <=> RH.

## (3) PR #50 Prop. 5: HOLDS

- The data +1, +1, -1, -1 on the quartet gives -4 mu: each of the four terms pairs rho with -conj rho
  and has the opposite sign.
- The data are conjugation-symmetric, so P_M is real.
- The Lagrange basis is fixed, which gives |P_M| <= C r_*^M |gamma|^{d-1} for |gamma| > H > 1.
- Since |a + rho| >= |gamma|, the tail is at most C^2 H^{2d} (r_*/H)^{2M} sum gamma^{-2}, which tends
  to 0 because r_* < H.
- Splitting the pole is uniform in eps. A degree check is needed for properness: d - 1 < M.
- The quartet points are distinct because beta_0 != 0 and gamma_0 > 0.

No gap.

## (4) Suzuki leg: HOLDS

Suzuki's Thm 1.1(1) states int_0^inf Psi(t) e^{izt} dt = -(1/z^2)(xi'/xi)(1/2 - iz) for Im z > 1/2.
Setting z = ip gives L(p)/p^2. This is exactly PR #47 (1).

Suzuki's Thm 1.1(2): Psi = sum over all gamma of (1 - cos(gamma t))/gamma^2, with gamma = i rho_c.
This equals RESULT's Psi_0 = sum_{Im>0} 2(cosh(rho t) - 1)/rho^2. Also Psi(0) = 0, and Psi is extended
evenly.

Suzuki's Thm 1.2: RH <=> g = -Psi is a screw function on R, with kernel
G_g = g(t-u) - g(t) - g(-u) + g(0) = Psi(t) + Psi(u) - Psi(t-u). This is (S) exactly.

I also checked Suzuki's explicit (1.1) against L/p^2 independently. The Laplace transform was computed
term by term in closed form, including the Lerch Phi(e^{-2t}, 2, 1/4) term and C = pi^2 + 8G. The
residuals are 1e-30 at p = 0.9, 1.7 and 4. There is no additive linear or constant discrepancy, so the
caveat at the end of RESULT §9 can be removed. Suzuki's Thm 1.1(3) also gives
Psi << exp(t/2 - c sqrt t) unconditionally.

The double-Laplace computation in PR #47 (3) is correct: the transform is
[x^2 H(x) + y^2 H(y)]/(xy(x+y)).

## (5) Theorem 4: HOLDS, with a typo and an overstatement

- E_gamma >= |J_{5/2}(0)|^2 = |V(5/2)|^2. This is correct (the k=0 term of (7)).
- W is real and kills every zero up to height H, including off-line quartets: the upper-half set is
  closed under rho -> -conj rho.
- W(5/2) != 0, since xi has no real zeros.
- Typo in the tail: deg W = d, not d - 1, so the bound is
  C^2 H^{2d+2} ((a+5/2)/H)^{2M} sum gamma^{-2}, with M > d+1. This is harmless.
- The proof is unconditional. It uses only the strip, sum |gamma|^{-2} < inf, and the absence of real
  zeros.

OVERSTATEMENT. The Verdict says the margin version is false "so the only consistent target is the
constant-1 statement". Thm 4 refutes the margin only on all of E. Eq. (21) is a statement about Schur
residuals, and RESULT §8 and §9 itself say the residual margin is NOT refuted. The LDL decomposition
does not transfer it either: Q_L(v) = sum |c_k|^2 Delta_k, but E_gamma has cross terms between
residuals.
Fix: the Verdict paragraph should carry the §9.3 qualification.

## Minor

- The Lemma B inequality is written as if L were monotone. Corrected bound in (2) above.
- In §2, "absorbed into A(p)" is accurate for the 1/s term only. The 1/(s-1) pole is kept as 1/(p-h)
  in (4)/(11). This is fine, but worth stating.
