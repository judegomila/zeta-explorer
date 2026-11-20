# Sources, normalization, and provenance

Checked 16 November 2026. Repository references below are pinned to the commits read for this attempt; branch names may subsequently move.

## Existing research checkpoints

### PR #56: odd Taylor hierarchy and exact operator

Commit `29d8f6f88250d976d4a45f6e0df0b6698bf46a16`, [PR #56](https://github.com/judegomila/mathexplorer/pull/56).

- [Local-to-global odd-sector criterion](https://github.com/judegomila/mathexplorer/blob/29d8f6f88250d976d4a45f6e0df0b6698bf46a16/rigorous/klein-annulus-coupling-2026-11-14/odd-sector-extension/local-global/local-to-global.md). Defines the exact cutoff kernel, holomorphic strip, the Taylor blocks, propagation, and the all-degree differential-polynomial inequality. Frozen copy: [pr56-local-to-global.md](reference/pr56-local-to-global.md).
- [Fourier operator duality](https://github.com/judegomila/mathexplorer/blob/29d8f6f88250d976d4a45f6e0df0b6698bf46a16/rigorous/klein-annulus-coupling-2026-11-14/odd-sector-followup/operator-duality.md). Fixes the Fourier convention and odd/even spectral kernels. Frozen copy: [pr56-operator-duality.md](reference/pr56-operator-duality.md).
- [Odd-sector extension status](https://github.com/judegomila/mathexplorer/blob/29d8f6f88250d976d4a45f6e0df0b6698bf46a16/rigorous/klein-annulus-coupling-2026-11-14/odd-sector-extension/README.md). Records finite strict certificates and their limitations.

The source states the all-order equivalence and cites the analytic positivity propagation theorem. This package does not claim a new proof of that external propagation theorem. The auxiliary quartet already has explicit off-real zeros independently of it; the direct negative odd diagonal also uses only the audited Fourier identity.

### PR #50: finite head and residual sign

Commit `146ce77aa8407e912ed54c73e30664d86936c253`, [PR #50](https://github.com/judegomila/mathexplorer/pull/50).

- [Theta rational residual](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md). Explains finite-head rank, the nullspace, and why an absolute tail norm alone does not prove the full Schur condition.

### PR #49: heat normalization and contour transfer

Commit `1de63e68375adb60b39ea7fdbe7d7b048b30ceea`, [PR #49](https://github.com/judegomila/mathexplorer/pull/49).

- [Collective certificate](https://github.com/judegomila/mathexplorer/blob/1de63e68375adb60b39ea7fdbe7d7b048b30ceea/rigorous/torus-heat-antibridge-2026-11-09/collective_certificate.md). Supplies the exact heat-flow normalization, theta envelope, and contour-transfer criteria, with global conditions still open. Frozen copy: [pr49-collective-certificate.md](reference/pr49-collective-certificate.md).

The three reproduced source notes are unmodified snapshots. Their internal relative links refer to their original repository directories. Use the immutable links above for their companion files. The manifest records their exact bytes.

## Normalization map

| Object | Definition | Coordinate for a zeta zero at ordinate gamma |
|---|---|---|
| `F(t)` in the operator and deformation proofs | `xi(1/2+i*t)` | `t=gamma` |
| Numerical `G(t)` | `exp(pi*t/4)*xi(1/2+i*t)` | `t=gamma` |
| Heat-flow `H_0(z)` | `xi(1/2+i*z/2)/8` | `z=2*gamma` |
| Operator kernel | `kappa(u)=Phi(u/4)` | Fourier factor `exp(i*t*u/2)` |

This scale factor is important: differentiation of kappa corresponds to `-t^2/4` and `t^4/16` for its second and fourth derivatives. The positive-kernel deformation checker verifies these exact coefficients.

## Public mathematical sources

1. Greg Kuperberg, *Knottedness is in NP, modulo GRH*, Advances in Mathematics 256 (2014), 493–506. [arXiv:1112.0845](https://arxiv.org/abs/1112.0845). Source of the finite, independently verifiable witness analogy. It does not supply an RH proof.
2. John A. Baldwin and Steven Sivek, *3-manifold decision problems and Riemann hypotheses*, 4 November 2026. [arXiv:2611.06705v1](https://arxiv.org/html/2611.06705v1). Hypothesis 1.2 is a universal positive epsilon for Dedekind zeta functions of every number field. Theorem 1.3 gives the recognition consequences under that hypothesis. Their discussion separately addresses the status of announced formalized proofs.
3. NIST DLMF, [Section 1.10](https://dlmf.nist.gov/1.10), especially [the argument principle](https://dlmf.nist.gov/1.10.E9). Used for total zero counts once entire boundary nonvanishing is certified.
4. Yum-Tong Siu, [Argument Principle and Rouché's Theorem](https://people.math.harvard.edu/~siu/math113/11_argument_principle_and_rouche_theorem.pdf). Standard local comparison theorem for the single-zero cages.
5. NIST DLMF, [Section 25.4](https://dlmf.nist.gov/25.4), xi completion and functional equation; [Section 25.10](https://dlmf.nist.gov/25.10), zero-counting context; [Section 5.11](https://dlmf.nist.gov/5.11), especially 5.11.9, vertical gamma asymptotics.
6. Dave Platt and Tim Trudgian, *The Riemann hypothesis is true up to 3·10^12*. [arXiv:2004.09765](https://arxiv.org/abs/2004.09765). Established interval-arithmetic finite verification; shows why the small bands in this package are validation examples, not a new record.
7. [Python-FLINT documentation](https://python-flint.readthedocs.io/) and [FLINT complex integration/calculus documentation](https://flintlib.org/doc/acb_calc/integrate.html). Numerical trust base: python-flint 0.9.0 / FLINT 3.6.0 / Arb, 160-bit precision. The implementation uses direct analytic evaluation and analytic series, not numerical quadrature for the finite certificates.
8. D.H.J. Polymath, *Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn–Newman constant*. [arXiv:1904.12438](https://arxiv.org/abs/1904.12438). Related normalized heat-flow and contour context; no new Polymath computation is reproduced here.
9. Cetin Hakimoglu-Brown, *A conditional bound Lambda ≤ 0.13963 for the de Bruijn–Newman constant*, 8 October 2026. [arXiv:2610.12803](https://arxiv.org/abs/2610.12803). Literature checkpoint only. Assumes the ordinary-zeta seven-eighths strip and retains a published Polymath boundary input. This package does not certify that paper's result or the assumed strip theorem.

## Execution records

- [Numerical verifier report](certificates/verification_report.json): original separate verifier process.
- [Independent rerun](certificates/root_verification_report.json): same certificate hash and all expected counts; elapsed time approximately 4.12 seconds.
- [Exact rational certificate](obstruction/positive_quartet_certificate.json): reproduced by the SymPy checker; all identities and sign certificates passed.
- [Diagnostic table](analysis/theta_cage_diagnostics.json): explicitly nonrigorous floating-point illustration of a separately proved analytic obstruction.

The global compactness, tail, and contour-shift arguments are proved in the accompanying notes. Numerical diagnostics are not used to justify those analytic claims. No all-height enclosure, every-order theta sign inequality, or RH proof was produced.
