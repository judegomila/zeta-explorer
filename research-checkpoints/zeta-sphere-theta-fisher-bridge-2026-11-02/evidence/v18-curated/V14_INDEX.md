# Sphere campaign v14 — certified limit of the blanket cumulative-tail route

All 423 v13 payloads remain byte-identical; its manifests are retained under provenance/v13. Baseline Library file libfile_1dd2d66840088191a856c4c47b5486e5.

## Actual stronger-premise counterexample, not an RH counterexample

At spatial cutoff H=1 and exact rational t=7005081715/1000000, the full theta cumulative-tail Fourier density satisfies

exp(pi*t/2) T_1_hat(2t) < -53766891745349 < 0.

An independently replayed Arb full-theta/2^21-point DFT calculation encloses the scaled core interpolant between integers56962777821815 and56962777822971. Independently checked analytic strip, Fourier alias, sample truncation and convolution-periodization errors total less than13000, giving actual scaled core>56962777800000. Independently replayed Euler–Maclaurin full-density enclosure gives full scaled density<3195886054651. The difference is strictly negative. Exact contour convolution factor1/8, origin phase, Fourier normalization and every stated analytic error have been reviewed. Arb evaluates the entire theta sum, not a finite-orbit surrogate. Dependency versions and install requirement are recorded; the third-party binary installation itself is not bundled.

Continuity and exponential-moment polynomial determinacy imply that some finite cumulative-tail moment block fails at H=1; this packet does not identify that degree. Thus the proposed positivity of every cumulative tail at every order is false. **This is not a counterexample to the full bridge kernel or RH, and does not refute the fixed H=1/16 certificates.** All earlier finite H5 and odd degree19 results remain valid. The correction is to the blanket propagation strategy, not to those established results. Further work must use an explicitly restricted cutoff, weighted tail condition, or direct full-kernel estimate rather than assuming all-H positivity.

## Reviewed guardrails

- First-orbit fixed-H tail has a positive complete-Mellin high-frequency leading term8sqrt(pi)(k/4)^(7/2)exp(-pi*k/4)log²(k/(4pi)); its oscillatory boundary is lower-order. That model cannot be transferred termwise to full theta because orbit coefficients are not absolutely summable and endpoint errors are nonuniform. The actual counterexample above uses the full theta, not that invalid transfer.
- Conditional on a nonnegative actual tail density, the nested relative-core costs increase to the clipped essential supremum of -core_hat/tail_hat. All-degree tail PSD is equivalent to spectral nonnegativity, separately in either parity. The exact full density is one quarter of Psi'^2-Psi*Psi'' at half frequency. Uniform epsilon<1 is stronger than finite positivity; finite costs can approach1.
- Sharper strip majorants and an independent contour-identity derivation support the actual certificate. Exploratory floating FFT grids and uncertified higher-order probes are excluded.

Independent audits and replays are in lehmer_tail_audit, cumulative_tail_asympt_audit and spectral_relative_limit_audit. No new all-order full-kernel positivity or RH proof is asserted.
