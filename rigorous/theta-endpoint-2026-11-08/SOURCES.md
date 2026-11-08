# Sources and provenance

## Primary mathematical sources

1. Yu. V. Brezhnev, S. L. Lyakhovich, A. A. Sharapov, *Dynamical systems
   defining Jacobi's theta-constants*, Journal of Mathematical Physics
   52 (2011), 112704; arXiv:1012.1429.
   https://arxiv.org/pdf/1012.1429
   Proposition 1, equation (8), provides the theta differential system.
   Our normalization uses their Weierstrass eta = pi^2 E2/12. The closed
   variables a,c,v, Volterra reduction, and derivative recurrence are
   derived in the modular note, not imported as a positivity theorem.

2. Jonathan Eckhardt, Aleksey Kostenko, Gerald Teschl, *Spectral asymptotics
   for canonical systems*, Journal fuer die reine und angewandte
   Mathematik 736 (2018), 285–315; arXiv:1412.0277.
   https://www.mat.univie.ac.at/~gerald/ftp/articles/AsymCS.pdf
   https://arxiv.org/abs/1412.0277
   Proposition 2.3 supplies continuity under convergence of cumulative
   trace-normalized Hamiltonians. Theorem 3.1 and Corollary 3.2 identify
   averaged endpoints with finite Weyl limits. Equations (2.21)–(2.23)
   fix the constant-Hamiltonian normalization. These precise statements
   were checked against the endpoint note's convention and assumptions.

3. Matthias Langer, Roman Pruckner, Harald Woracek, *Estimates for the Weyl
   coefficient of a two-dimensional canonical system*, arXiv:2106.07391.
   https://arxiv.org/abs/2106.07391
   Background for the positive canonical system, Weyl coefficient, and
   limit-point construction. The modular high-energy limit is also proved
   directly in the note by Riccati comparison.

4. NIST Digital Library of Mathematical Functions:
   - Quartic theta identity: https://dlmf.nist.gov/20.7.E5
   - Digamma expansion: https://dlmf.nist.gov/5.11.E2
   - Poisson summation: https://dlmf.nist.gov/1.8.iv
   - Critical-line zeros: https://dlmf.nist.gov/25.10.i
   The last section explicitly states that the real Hardy Z function has
   infinitely many sign changes and hence infinitely many critical-line
   zeros. Only existence is needed for the nonsectorial theorem; neither
   RH nor simplicity is used.

5. Rene L. Schilling, Renming Song, Zoran Vondracek, *Bernstein Functions:
   Theory and Applications*, second edition, Theorem 1.4.
   https://doi.org/10.1515/9783110269338
   Bernstein's theorem identifies complete monotonicity with a positive
   Laplace representation. The actual-theta rational-cusp obstruction to
   that representation is proved in full in the modular note.

## Fixed prior project checkpoints

These research PRs are separate work, not assumed merged into main. The
present checkpoint is based on main and adds only a new research directory
and decision record. The fixed references preserve its mathematical
dependencies without duplicating or changing those branches.

- [PR #43](https://github.com/judegomila/mathexplorer/pull/43), commit
  `69d4049f289217812051188378a0a9f3f061a169`: actual theta convolution,
  cutoff identity, weighted criterion, and geometric limitations.
- [PR #44](https://github.com/judegomila/mathexplorer/pull/44), commit
  `a89222f2d069f24690b2f62904d5049e9ff676ed`:
  [analytic localization](https://github.com/judegomila/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_flux_analytic_localization_20261108.md)
  supplies analytic feature density and the all-jet/global-kernel
  equivalence;
  [Hardy defect](https://github.com/judegomila/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_pulse_hardy_defect_20261108.md)
  supplies the coprime Blaschke quotient for S and the causal/weighted
  criteria used by the new Gaussian contour note.
- [PR #45](https://github.com/judegomila/mathexplorer/pull/45), commit
  `6afedec7fae03174b3c99ace99c2ae1453043cb2`:
  [all-order research index](https://github.com/judegomila/mathexplorer/blob/6afedec7fae03174b3c99ace99c2ae1453043cb2/rigorous/theta-all-order-2026-11-08/README.md),
  [commutator and derivative energy](https://github.com/judegomila/mathexplorer/blob/6afedec7fae03174b3c99ace99c2ae1453043cb2/rigorous/theta-all-order-2026-11-08/theta_jet_commutator_20261108.md),
  [boundary-trace obstruction](https://github.com/judegomila/mathexplorer/blob/6afedec7fae03174b3c99ace99c2ae1453043cb2/rigorous/theta-all-order-2026-11-08/theta_all_order_jet_structure_20261108.md), and
  [Gaussian preimage obstruction](https://github.com/judegomila/mathexplorer/blob/6afedec7fae03174b3c99ace99c2ae1453043cb2/rigorous/theta-all-order-2026-11-08/theta_gaussian_probe_obstruction_20261108.md).
  The last note and its interval certificate establish `D(-1)>0` for
  alpha=1; this is used only in the optional one-point mismatch of the
  endpoint note. The high-frequency mismatch does not depend on that
  numerical certificate.

## This continuation

The four proof notes derive the stated modular energy, cusp obstruction,
endpoint constraints and prototype, operator domains, and Gaussian contour
correction. The root synthesis and three independent mathematical work
streams were cross-checked before publication; this is an internal review,
not external peer review or proof-assistant verification.

The symbolic script and its numerical normalization checks have narrower
scope than the analytic notes. No new interval certificate, new verified
zero-free height, novelty claim, or proof of RH is asserted.
