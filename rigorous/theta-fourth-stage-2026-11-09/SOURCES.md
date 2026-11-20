# Primary sources and fixed proof dependencies

Sources reviewed for the research continuation of 9 November 2026.
The proof notes give local derivations; the entries below identify
external inputs and the exact preceding repository checkpoints.

## Published mathematical inputs

1. Dave Platt and Tim Trudgian, *The Riemann hypothesis is true up to
   3 times 10^12*, arXiv:2004.09765; Bulletin of the London Mathematical
   Society, DOI 10.1112/blms.12460.
   <https://arxiv.org/abs/2004.09765>
   Role: rigorous finite-height zero verification used for the bounded
   interval. Imported as a theorem; not rerun or extended here.

2. FLINT documentation, *Zeros of the Riemann zeta function*.
   <https://flintlib.org/doc/acb_dirichlet/zeta-zeros.html>
   Role: rigorous isolation/counting documentation and the first-zero
   enclosures implying gamma_1 in (14,15), gamma_2 in (21,22).
   Andrew Odlyzko's primary zero tables independently corroborate the
   ordinates: <https://www-users.cse.umn.edu/~odlyzko/zeta_tables/>.

3. NIST Digital Library of Mathematical Functions, sections 5.7 and 5.15.
   <https://dlmf.nist.gov/5.7.E6>
   <https://dlmf.nist.gov/5.15>
   Role: digamma partial fractions and the polygamma series. The notes
   derive the specific series-integral bounds and rational constants.

4. NIST DLMF, section 25.10, *Zeros*.
   <https://dlmf.nist.gov/25.10>
   Role: classical zero strip and standard xi/zeta background; no RH
   location assumption is made for the unknown high zeros.

5. George Csordas, *Fourier transforms and the Riemann hypothesis*,
   arXiv:1309.0055v2, especially Theorem 4.2(b).
   <https://arxiv.org/html/1309.0055v2>
   Role: the actual theta kernel's squared-variable log-concavity used
   in the preceding first-pair theorem. Its scale convention is stated
   in those fixed proof files.

## Published context, not a replacement for the local proofs

6. O. Kozlovski and D. Sands, *Higher order Schwarzian derivatives in
   interval dynamics*, Fundamenta Mathematicae 206 (2009), 217--239,
   DOI 10.4064/fm206-1-12.
   <https://impan.pl/shop/publication/transaction/download/product/88562>
   <https://arxiv.org/abs/0812.2646>
   Role: fractional-linear invariance, higher Schwarzian derivatives,
   and finite-order matrix monotonicity, including Lemma 10. The order-two
   reciprocal-divided-difference lemma used here is proved explicitly.

7. Masatoshi Suzuki, *Aspects of the screw function corresponding to the
   Riemann zeta-function*, Journal of the London Mathematical Society
   108 (2023), 1448--1487, DOI 10.1112/jlms.12785, Theorems 1.1--1.3.
   <https://londmathsoc.onlinelibrary.wiley.com/doi/full/10.1112/jlms.12785>
   Role: screw-function and Weil-positivity context. The finite rational
   reflection identity and conditional witness are derived in full in
   this checkpoint. No new general RH equivalence is claimed.

## Repository proof dependencies

- PR #48: <https://github.com/judegomila/mathexplorer/pull/48>
  Fixed commit: `499528b487e3249c5a35602f83343aaa53cec848`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09).
  The strict three-node theorem and its xi moment bound are in
  `theta_three_node_curvature_20261109.md` and
  `theta_third_pick_large_x_20261109.md`.
  The Green normalization, positive first pair, and crossing lemma are
  in `theta_schur_positive_kernels_20261109.md`.
  The arithmetic energy and its convergence are in
  `theta_schur_residual_energy_20261109.md`.
  The auxiliary generic-kernel obstruction is in the same checkpoint.

- PR #47: <https://github.com/judegomila/mathexplorer/pull/47>
  Fixed commit: `7e6d01d9dae527a5785ed31d770cd4b8acd38e17`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08).
  Role: actual-theta two-node covariance theorem, passive inverse
  reduction, and the conditional all-orders normal-family route.

These fixed dependencies are available on their research branches even
when the new PR is based directly on main. No prior merge is presumed.
