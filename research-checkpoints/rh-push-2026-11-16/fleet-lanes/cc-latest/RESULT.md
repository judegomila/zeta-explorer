# cc-latest: 2024-2026 Connes-Consani line vs. the Sonine wall and the eq48 one-sided cone

Date: 2026-11-16. Scope: tmp/research-2026-11-16/push/cc-latest/ only. No RH claim, no new zero-free region.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (mpmath, not interval-certified), OPEN,
UNVERIFIED (third-party claim, read only through abstracts / fetched summaries).

## Verdict

1. **Nothing published 2024-2026 changes the Sonine obstruction at 2a > ln 2.** The Connes-Consani(-Moscovici)
   line has moved away from proving positivity through the Sonine compression. Its current theorem is a
   structural real-zeros statement about the extremal eigenvector of a truncated Weil form. That theorem does not
   use the values of the prime sums and proves no positivity ("we cannot assert mu_lambda >= 0", CCM 2025).
2. **The eq48 one-sided exponential cone fits the real-zeros half of their framework exactly, and with weaker
   hypotheses.** Theorem A below is the one-sided counterpart of Connes-van Suijlekom Thm 6.1 / CCM Thm 5.10. It
   needs no evenness hypothesis, and the endpoint evaluation that CCM approximate by a Dirichlet kernel is exact.
   It does not fit the Sonine/semilocal half: nodes x > 1/2 involve all primes at once and there is no sharp
   support cut, so there is no pair (P_lambda, P-hat_lambda) and no Sonine space.
3. **New statements for this project (all Euler-blind):** Theorem A (extremal approximants lie exactly on the
   critical line, for any data), Theorem B (eps_N tends to 0 or to minus infinity; RH iff eps_N is bounded
   below), Theorem C (under RH the approximants converge to the zeros as measures). MEASURED: with 26 real nodes
   in [0.6, 6] the approximants reproduce gamma_1 to 1e-24, gamma_2 to 1e-14, gamma_3 to 3e-10. The same
   construction reproduces the Davenport-Heilbronn zeros equally well.
4. The content of Theorem A is the degenerate Nevanlinna-Pick theorem (CLASSICAL). What is new relative to the
   atlas and the Pick lane is the formulation: the extremal-eigenvector object, the two-type dichotomy, the
   operator realization, and the lower-bound criterion in Theorem B. It gives no handle on the missing estimate.

Verdict class: partial result (proved structural statements) plus "nothing new applies" for the Sonine wall.

## 0. Plan (what is new vs. atlas and walls)

- Atlas sections 9 and 11 and the project's Route I record (Sonine port obstructed at ln 2; ARB-LEGE to ln 3;
  DH twin Euler-blind; verified-height ceiling) are taken as given. No Sonine or rank-one repair is attempted.
- eq48 identified the residual target with Weil positivity on one-sided exponential tests, and the euler note
  measured that finite Pick orders are Euler-blind. Neither looked at the **extremal eigenvector** of the Pick
  form, which is the object the 2025-2026 Connes papers are built on. That is the gap this note fills.
- Walls: every statement proved here holds for arbitrary real data l_j, hence for DH. This is stated at each step.

## 1. Survey: what the 2024-2026 papers establish

| Paper | What it establishes | Effect on the ln 2 picture |
|---|---|---|
| Connes-Consani-Moscovici, "Zeta zeros and prolate wave operators", arXiv:2310.18423v2 (Ann. Funct. Anal. 2024) | Semilocal prolate operator; Sonine space stable when S grows; UV spectrum matches zeros. | No positivity statement past the archimedean place. |
| Connes-van Suijlekom, "Quadratic forms, real zeros and echoes of the spectral action", CMP 406 (2025) | Thm 6.1 (as quoted in the Connes survey): for a real distribution D on [0,L], if the form with kernel D(x-y) on L^2(-L/2,L/2) has a simple isolated minimal eigenvalue with even eigenfunction eta, then all zeros of eta-hat are real. | Structural. Holds for any D. No arithmetic. |
| Connes-Consani-Moscovici, "Zeta spectral triples", arXiv:2511.22755 | Thm 1.1/5.10: Galerkin form QW_lambda^N has matrix tau_ij = (b_i-b_j)/(i-j); if the minimal eigenvalue is simple with even eigenvector xi then xi-hat has only real zeros, equal to the spectrum of D - |D xi><delta_N|. Cor. 3.8: RH if lim mu_lambda = 0. Section 8 lists two missing steps: (i) simple and even ground state, (ii) k_lambda (prolate guess) approximates xi_lambda. | Explicitly proves no positivity. Primes enter the proofs only as a bounded perturbation. |
| Connes, "The Riemann Hypothesis: past, present and a letter through time", arXiv:2602.04022 | Primes <= 13 give the first 50 zeros to 2.6e-55 .. 1e-3 by this method. Only positivity theorem stated: archimedean, support [2^{-1/2}, 2^{1/2}] (Thm 7.1). Convergence "not proved". | Confirms ln 2 is still the proved threshold in their line. |
| Connes-Consani, "On the Jacobian of Spec Z", arXiv:2602.15941; "Knots, primes and class field theory", arXiv:2501.06560 | Structural descriptions of the adele class space (Picard-type monoid). | No positivity statement. |
| Zhu, arXiv:2608.24827 (UNVERIFIED) | Computer-assisted lambda_min(0.8) in [8.9e-18, 2.27e-17] (half-width 0.8, i.e. 2a = 1.6); upper bounds down to 3.2e-283 at L = 2; argues the required frequency range grows doubly exponentially. | A finite-matrix certificate, not a Sonine argument. Consistent with the project's verified-height / pointwise wall. |
| Groskin, arXiv:2607.02828 (UNVERIFIED) | Finite Guinand-Weil dictionary and a positive archimedean tail increment for truncated forms. | Certification tooling only. |
| Desogus, "The Three Gates", arXiv:2609.20367 v3/v4 (UNVERIFIED, claims RH) | Claims non-negativity of the odd-channel Weil form at every support radius by Schur induction from a certified endpoint. Multiple repaired versions. | Not usable. Not audited here. Any audit should start from the DH control and the MV-CAP wall. |

Reading of the survey (my assessment):

- The CC archimedean theorem (W_infty >= Sonine trace on support ln 2) has not been extended to S = {infty, 2}
  by anyone. This matches the project's obstruction: the excess E_S o Q is unbounded along p = 2 resonances.
- The scaling-site Riemann-Roch program has produced no inequality.
- The active idea is: stop proving positivity, take the minimizer, show its transform has real zeros
  (structural), then show the minimizer converges (open). Section 2 transplants that idea to the eq48 cone.

## 2. One-sided analogue of the real-zeros theorem

Notation. Distinct nodes x_1..x_N > 0, X = diag(x_j), real data l_j, 1 = all-ones vector,

    P_ij = (l_i + l_j)/(x_i + x_j),   S_ij = 1/(x_i + x_j).

S is the Gram matrix of e^{-x_j t} in L^2(0, inf). For v = sum c_j e^{-x_j t}: c^T S c = ||v||^2,
c^T P c = Q_L(v) (the eq48 form when l_j = L(x_j) = xi'/xi(1/2 + x_j)), 1^T c = v(0), and
V(z) = sum c_j/(z + x_j) is the Laplace transform of v. Let eps = eps_N be the smallest generalized eigenvalue of
(P, S), i.e. eps = min Q_L(v)/||v||^2 over the N-dimensional span, with eigenvector c.

Set l' = l - eps/2 and P' = P - eps S. Then P' has the same shape with data l', P' >= 0, P' c = 0, and

    X P' + P' X = l' 1^T + 1 l'^T.                                   (D)

**Theorem A (PROVED; any real data; N >= 2).** Suppose eps is a simple generalized eigenvalue. Then

1. every zero of V is purely imaginary;
2. (two types) 2 (1^T c)(l'^T c) = 0. So either v(0) != 0 and eps = 2 (sum c_j l_j)/(sum c_j) (type I), or
   v(0) = 0 (type II);
3. (operator form, type II with w = Xc, 1^T w != 0) on H = {u : 1^T u = 0} the operator
   X_H = (I - w 1^T/(1^T w)) X is skew-adjoint for the form P', X_H c = 0, and its other eigenvalues are the
   negatives of the zeros of V. In function terms X = -d/dt, H = {v(0) = 0}, and X_H is a rank-one
   perturbation of the generator of translations. This is the counterpart of CCM's D - |D xi><delta_N|, with
   delta_N replaced by exact evaluation at the endpoint t = 0.

Proof of 1. Let V(z0) = 0 and u = (z0 + X)^{-1} c, so 1^T u = 0 and X u = c - z0 u. By (D),
u^*(X P' + P' X)u = 2 Re( conj(1^T u) (l'^T u) ) = 0. Also u^* P' X u = u^* P' c - z0 u^* P' u = -z0 u^* P' u,
and u^* X P' u is its conjugate. Hence 2 Re(z0) u^* P' u = 0. If u^* P' u = 0 then u is in ker P' = span(c), so
alpha (z0 + x_j) c_j = c_j for all j, which forces c = e_j for one j. Then column j of P' vanishes, so l' = 0 and
P' = 0, contradicting simplicity for N >= 2. So Re z0 = 0.

Proof of 2. Apply c^T ... c to (D): the left side is 0 because P' c = 0.

Proof of 3. (D) and P' c = 0 give P' w = l'(1^T c) + 1 (l'^T c) = 1 (l'^T c). For u, u' in H:
u'^T P' X_H u = u'^T P' X u - (u'^T P' w)(1^T X u)/(1^T w) = u'^T P' X u, since u'^T 1 = 0. By (D),
u'^T (P' X + X P') u = 0 on H. The determinant identity det(z + X - w y^T) = det(z + X)(1 - y^T (z+X)^{-1} w)
with y a large multiple of 1 identifies the spectrum with the zeros of 1^T (z+X)^{-1} w = -z V(z).

Remarks.

- The same proof works for the largest eigenvalue. It fails for interior eigenvalues (P' indefinite).
- Unlike the two-sided case, the shift by eps must be taken against S (the L^2(0,inf) norm), not the identity.
  With the Euclidean norm on coefficients the zeros of V lie in the open half-plane Re z > 0 when eps > 0 and
  Re z < 0 when eps < 0 (same computation; the defect matrix is X - w1^T - 1w^T + kappa 11^T >= 0 by
  Cauchy-Schwarz). PROVED, not needed below.
- CLASSICAL content: P' is a singular positive Pick matrix, so the Nevanlinna-Pick problem for l' has a unique
  solution, a lossless rational function R(z) = m_inf z + m_0/z + sum_k m_k 2z/(z^2 + tau_k^2) with m > 0,
  whose poles are the zeros of V. So eps_N/2 is the largest constant that can be subtracted from L on the
  node set with a positive-real interpolant remaining, and the approximants +- i tau_k are the poles of that
  extremal interpolant. Compare with L(z) = sum_{gamma>0} 2z/(z^2 + gamma^2) under RH.
- DH: Theorem A uses no property of l. Approximants on the critical line carry no RH content.

**Theorem B (PROVED, given classical Pick-Nevanlinna).** Let (x_k) be a sequence of distinct nodes in (0, inf)
with an accumulation point in (0, inf), none a zero of F(z) = xi(1/2 + z), and eps_N the minimum for the first
N nodes with l_j = L(x_j). Then eps_N is non-increasing, and

    RH holds  <=>  eps_N >= 0 for all N  <=>  inf_N eps_N > -infinity  <=>  lim eps_N = 0.

Otherwise eps_N -> -infinity.

Proof. Monotone: nested Rayleigh quotients. Suppose eps_N >= -2C for all N. Then all prefix Pick matrices of
L + C are PSD, so there is a positive-real G on Re z > 0 with G = L + C on the nodes (Pick-Nevanlinna on an
infinite set, by normal families). L is meromorphic on Re z > 0, so L + C = G there and L has no pole in
Re z > 0. That is RH. Under RH, P >= 0, so eps_N >= 0. Also L(x) -> 0 as x -> 0+ (L is odd and regular at 0)
gives inf Re L = 0, and applying the first step to L - t for t > 0 shows lim eps_N <= 0.

Consequence: in this cone the full missing input is any finite L^2 lower bound,
Q_L(v) >= -C ||v||^2_{L^2(0,inf)} for all finite exponential sums with rates in one interval. The constant 0
(eq48) is not needed, and no positive margin is possible (eq48 Thm 4). This is the one-sided form of CCM
Cor. 3.8, with "lim mu_lambda = 0" weakened to "bounded below". For DH the same proof gives eps_N -> -infinity.

**Theorem C (PROVED under RH; standard Herglotz continuity, sketched).** Under RH and the hypotheses of
Theorem B, the extremal interpolants R_N are positive-real, agree with L - eps_N/2 on the first N nodes, and
are bounded at a point, so they form a normal family whose only limit is L. Hence their Herglotz measures
sum_k m_k^{(N)} delta_{tau_k^{(N)}} converge vaguely on R to sum_gamma delta_gamma (with multiplicity). So each
ordinate gamma attracts approximants of total mass tending to its multiplicity, and zero-free intervals carry
vanishing mass. Convergence of individual tau_k (no low-mass stray poles) is not proved.

So CCM's missing step (ii) has a clean conditional answer in this cone, and their missing step (i) loses its
evenness half. The unconditional content is entirely in the lower bound of Theorem B.

## 3. Measurements (MEASURED)

Scripts: `extremal.py`, `lossless.py`; logs `run1.log`, `run2.log`. mpmath 1.3.0, 60 + 10N digits, Chebyshev
nodes on the stated interval, l_j = xi'/xi(1/2 + x_j) from digamma and zeta'/zeta at real points.

zeta, nodes in [0.6, 6] (absolutely convergent prime sums only):

| N | eps_N | gap to 2nd eigenvalue | error of tau_1..tau_4 vs gamma_1..gamma_4 |
|---|---|---|---|
| 10 | 2.0e-20 | 2.3e-16 | 8.2e-5, 0.25, 4.6, 28 |
| 14 | 8.7e-31 | 3.0e-26 | 5.8e-9, 1.2e-3, 0.096, 1.9 |
| 18 | 1.2e-41 | 5.9e-37 | 1.2e-13, 1.1e-6, 6.8e-4, 0.28 |
| 22 | 5.9e-53 | 5.1e-48 | 7.3e-19, 2.4e-10, 9.9e-7, 6.6e-3 |
| 26 | 8.4e-65 | 1.1e-59 | 1.3e-24, 1.3e-14, 2.8e-10, 1.8e-5 |

- All computed zeros of V are imaginary to working precision (|Re|/|z| < 1e-110), as Theorem A requires.
- The minimizer is type II (v(0) = 0 to 1e-115 or better) in every zeta and DH run; 2K + 2 = N with K pole pairs.
- eps_N is simple in every run (gap/eps between 1e3 and 1e5). Simplicity in general is OPEN.
- Lossless interpolant check (N = 18): residual 7.5e-226 on all 18 nodes with 9 linear unknowns; masses
  1.0, 1.0000023, 1.00081, 1.358, 1.655, 4.34, 12.4, 69.3 and m_inf = 0.0056. Converged poles have mass 1.
- Other node intervals: [1, 20] at N = 26 gives errors 2.6e-20, 2.1e-12, 9.6e-9; [0.05, 3] at N = 18 gives
  5.2e-14, 7.9e-7.
- Structural control with arbitrary data (sin 3x + x^2/7 - 1/(1+x)): zeros imaginary to 1e-108; both types
  occur (N = 5, 11 type I; N = 8 type II).

## 4. DH control

Same script with the Davenport-Heilbronn completion (L from ../../euler/dh.py), nodes in [0.6, 6]:

| N | eps_N | approximants |
|---|---|---|
| 14 | 2.8e-21 | 5.0941598447, 8.93995, 12.177, 15.25 |
| 18 | 5.6e-30 | 5.094159844571, 8.9399144129, 12.13367, 14.419, 17.59 |
| 22 | 3.2e-39 | 5.094159844571095, 8.939914408097, 12.1335455, 14.40405, 17.1435, 19.54 |

These are the low on-line DH zeros. eps_N > 0 and all approximants are on the line, although DH has off-line
zeros (first quadruple near height 85.7). By Theorem B, eps_N(DH) must eventually go to minus infinity on dense
nodes; the euler note measured that the sign change needs order above 100 on these node families.

Where the Euler product is used in this note: nowhere. Theorems A, B, C use only that F is even, real, entire of
order 1, with L meromorphic in Re z > 0. An argument that separates zeta from DH has to bound eps_N from below,
and by section 1.5 of the euler note the prime measure enters Q_L with the unfavourable sign.

## 5. Answers to the assigned questions

- **Does any 2025-2026 result change the ln 2 Sonine picture?** No. Positivity proved by the Sonine route is
  still archimedean with support ln 2 (Connes survey Thm 7.1). Results past ln 2 are finite-matrix certificates
  (project ARB-LEGE to ln 3; Zhu to 1.6, UNVERIFIED), which restate verified-height information.
- **Does the eq48 cone fit their framework better than general tests?** For the real-zeros mechanism, yes:
  exact endpoint functional, no parity hypothesis, convergence under RH is classical, and the positivity
  requirement weakens to boundedness below (Theorem B). For the Sonine/semilocal mechanism, no: the cone has
  no finite set of places and no sharp cutoffs.
- **Concrete provable statement:** Theorems A and B above.

## 6. Three weakest steps

1. **Novelty and sourcing.** Theorem A is the degenerate Nevanlinna-Pick theorem in different clothing. I did
   not search the interpolation literature for the exact formulation, and the CvS / CCM statements were read
   through fetched summaries, not the full papers. Theorem numbers quoted from them may be off.
2. **Theorem C.** The Herglotz-continuity step is sketched, not written out (behaviour of the m_inf z term and
   of mass escaping to infinity is not treated). It gives vague convergence only. Individual approximant
   convergence and any rate are OPEN; the measured rates in section 3 have no proof.
3. **Theorem B hypotheses and DH transfer.** The proof uses the classical extension of Pick positivity from an
   infinite node set with an interior accumulation point. Simplicity of eps_N (needed for Theorem A, not B) is
   only MEASURED. For DH I did not check that the nodes avoid real zeros of the completed function, and the DH
   values of L are limited to about 18 digits by dh.py (residual 2e-18 in the interpolant check).

## Sources

- https://arxiv.org/abs/2511.22755 (Connes, Consani, Moscovici, Zeta spectral triples)
- https://arxiv.org/abs/2602.04022 (Connes, RH past, present and a letter through time)
- https://arxiv.org/abs/2310.18423 (Connes, Consani, Moscovici, Zeta zeros and prolate wave operators)
- https://arxiv.org/abs/2006.13771 (Connes, Consani, Weil positivity and trace formula, the archimedean place)
- https://arxiv.org/abs/2602.15941 (Connes, Consani, On the Jacobian of Spec Z)
- https://arxiv.org/abs/2608.24827 (Zhu, Weil positivity in compact windows)
- https://arxiv.org/abs/2607.02828 (Groskin, finite Guinand-Weil dictionary)
- https://arxiv.org/abs/2609.20367 (Desogus, The Three Gates)
