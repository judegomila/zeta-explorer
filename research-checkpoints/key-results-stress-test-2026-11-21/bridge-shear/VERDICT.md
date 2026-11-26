# VERDICT: bridge-shear

Date 2026-11-20. Replay scripts and logs: `replay/`. Working notes: `NOTES.md`.

## What the entry actually contains
The entry bundles four things. None is a statement about the location of zeta zeros.

1. **Shear-kernel measure audit (2026-08-28).** A correction. An earlier reduction split the de Branges kernel
   K_a(w,z) of E_a(z) = Xi(z+ia) into a positive "diagonal channel" plus a remainder. The diagonal u=v has measure zero in
   the double integral, so that channel is not a part of K_a. The audit replaces it by an exact paired-coordinate formula,
   records that the raw shear psi(u)psi(v)sinh(a(v-u)) is a rank-2 skew kernel (so it cannot be positive), gives an exact
   product formula for theta-term pairs with divisor phase D_N, and notes that no single N-block is positive.
2. **Finite shear-Gram certifier.** An Arb program that decides the sign of one finite Gram matrix of K_a at rational nodes.
   One artifact exists: a 2x2 matrix at a = 1/8, nodes i/4 and 1/2 + i/3, certified positive.
3. **Rank-two norm identity (Lean).** For G = p q^T - q p^T in R^N: ||G||_op = sqrt(|p|^2|q|^2 - <p,q>^2) = Hilbert-Schmidt
   norm of the strict lower triangle. No sorry or added axioms in the file.
4. **Sign switching / boundary energy.** (a) For F = w^2 + 2 eps the region Re(F' conj F) < 0, x > 0 is an open half-disk.
   (b) For Xi, W_h(t)/h = int_0^inf omega_{a,h}(r) P_a(t-r,t+r) dr with an explicit strip-Poisson weight, hence
   W_h/h = E_+ - E_- with E_+-, both >= 0 when a >= 1/2. RH is equivalent to E_- <= E_+ for all t and 0 < h < 1/2.

## Replay results
| item | what was run | outcome |
|---|---|---|
| pairing identity for C_a | 200 random complex points, 40 digits | worst rel err 8.7e-39 |
| paired-coordinate K_a vs direct xi | 4 node pairs, a = 1/8, 0.3, 0.5, 1.7, 18 digits | rel diff <= 7.5e-18 |
| retracted diagonal channel K_cmp vs K_a | same pairs | ratio 1.38, 1.63, 1.38 and 14029+4095i at height 14-15 |
| theta block product, D_N forms | 200 random + 27 cases, 40 digits | 3.2e-37, 1.8e-39 |
| N=1 block sign change | quadrature vs K-Bessel closed form | negative at x = 50 (r = 0), x = 40 (r = -0.1), x = 60 (r = 0.1) |
| rank-2 norm identity | N = 7, 40 random, 20 digits; rank-4 control | holds; fails for the control, as it should |
| Arb certificate | re-certified from source | same verdict, same balls; `verify` reports invalid here because the hash includes the Python version (3.14 vs 3.12) |
| omega moments | 4 (a,h) pairs, 40 digits | <= 1.5e-39 |
| Poisson reconstruction, zeta | t = 14.13, 20, 31.4, 5, 60; a from 0.2 to 3 | 1e-41 (adaptive quad), 1.5e-44 at t = 60 with fixed-order Gauss-Legendre |
| original scripts | verify-sign-switching.mjs; observatory tests | 920 checks pass; 15/15 pass |
| Lean | statements read, grep for sorry/axiom | none; not rebuilt (no local build, toolchain 4.28) |

## Stress tests
- **Davenport-Heilbronn control** (functional equation, zero at 0.808517 + 85.699348 i). The reconstruction identity holds for it
  too. At h = 0.25 below the zero, E_- / E_+ = 1.795 / 1.628: the inequality fails, as it must. A 7-node Gram of P_a around the
  zero is positive for a = 0.5, 0.35, 0.31 and negative for a = 0.30, 0.2, 0.05; for zeta it stays positive for all these a.
  The sign change sits exactly at a = beta - 1/2. This is detection of a zero the nodes sit on, nothing more.
- **The shipped certificate on the control.** The same nodes and a = 1/8 give a positive 2x2 Gram for Davenport-Heilbronn
  (eigenvalues 2.3e-5, 2.0e-2). The certificate does not distinguish zeta from a function that violates RH.
- **Non-symmetric control** f(z) = Xi(z + 0.3i): the Poisson reconstruction of the analytic kernel still holds to 18 digits.
  The identity is harmonicity of g(d-ih) - g(d+ih) plus decay; it uses nothing arithmetic.
- **Parameter changes.** The identity holds for every a > h (tested a = 0.2 .. 3). The rank-2 identity holds for any p, q.
  The paired-coordinate formula holds for a up to 1.7 and nodes at height 15.
- **Numerical trap found.** mpmath's adaptive quadrature stalls at 1e-12..1e-15 for the t = 60 reconstruction; the identity is
  exact (fixed-order rule converges to 1e-44). The project's own residual 7e-17 is at float64 node precision and is consistent.
- **Selection.** The seven-point "negative layer / positive integrated direction" example uses a hand-picked vector and tilt;
  the source labels it as establishing nothing.

## Literature
- W_h >= 0 for all h is the modulus-monotonicity form of RH: Sondow-Dumitrescu arXiv:1005.1104; Matiyasevich-Saidak-Zvengrowski
  arXiv:1205.2773; arXiv:2201.08599. The source note cites the first and says so.
- Positivity of the de Branges kernel of xi(s+a): unconditional for a >= 1/2, equivalent to RH for all a > 0; Lagarias,
  arXiv:math/0601653 (Acta Arith. 120, 2005), de Branges 1986.
- Strip Poisson kernel, divisor-sum sine product, singular values of p q^T - q p^T: textbook.
- Not found written down (light search, 4 queries): the half-line weight omega_{a,h} with its moments applied to Xi, and the
  paired-coordinate double integral for K_a. Each follows in a few lines from the known objects.

## Scores
- **Arbitrariness 3/5.** The identities are parameter-free and exact. The packaging is a choice: the name "shear", the even/odd
  split of a known criterion, the rejected "diagonal channel" that the audit exists to retract, and the node set of the only
  certificate. The entry is a bundle assembled by the project, not one statement.
- **Importance 2/5.** No consequence for RH or for bounds on the de Bruijn-Newman constant. Every positivity statement in it is
  either unconditional and classical (a >= 1/2) or RH-equivalent (a < 1/2). The parts with content for a reader are negative:
  the earlier reduction was wrong by a measure-zero argument, the raw shear is rank-2 skew, and no theta block is positive alone.
  The certifier is tooling whose single output does not separate zeta from Davenport-Heilbronn. An expert would accept the
  identities and classify them as reformulations.

## Statement that survives
For Xi(z) = xi(1/2+iz) and real a > h > 0: (i) the de Branges kernel of Xi(z+ia) has the exact paired-coordinate double-integral
form above, and is not the sum of a positive one-dimensional diagonal term and an off-diagonal region; (ii) W_h(t)/h equals the
strip-Poisson average of P_a(t-r,t+r) with weight omega_{a,h}, for any real entire function with the same decay, including
functions with off-line zeros; (iii) one 2x2 Gram at a = 1/8 is positive by ball arithmetic; (iv) the rank-two skew norm identity
is checked in Lean. Global positivity is open and equivalent to RH. Label for the page: exact identities and a retraction,
proved in notes and replayed numerically; one small interval certificate; no new information about zeros.
