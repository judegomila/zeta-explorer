# Actual-theta packets have uniformly exponentially small selected leverage

2026-11-04. This package gives an actual-theta all-degree obstruction to the proposed bounded inverse-Gram-column synthesis route for the existing exact-degree mesoscopic Fejer packet hierarchy. It does not prove or refute the desired actual-selected derivative-coherence estimate.

## Main finding

Let theta_n=A_n ell_n(p)^2/X[p] be the squared normalized selected overlap of the degree-n packet. For EVERY packet in the uniformly parameter-controlled exact-degree mesoscopic family, not just specially tuned ones,

    limsup (log theta_n)/n <= -(2 log 3-2).

This holds uniformly over the existing compact L range and in both parities. The achieved exponent is 2log3-2=0.197224577336219...; optimality is not claimed.

For a complete triangular hierarchy of these normalized packets, the exact identities therefore imply

- exponentially large inverse-Gram diagonal: (G^-1)_NN >= exp(rho n);
- exponentially large last selected coefficient: |c_N| >= exp(rho n/2);
- exponential Gram ill-conditioning: kappa_2(G) >= exp(rho n);
- divergent weighted absolute derivative synthesis: sum |c_j|sqrt(H[e_j]) >= C exp(rho n/2)/log n.

These hold eventually for every 0<rho<2log3-2. Therefore this family cannot satisfy either the uniform Riesz assumption or the uniformly bounded/localized absolute synthesis-column criterion proposed in the preceding selected bridge. The obstruction is at the diagonal itself, not merely uncontrolled long-range coefficients.

## Mechanism

An elementary scaled monic Chebyshev polynomial bounds the true selected monic norm exponentially below the monomial norm scale. The explicit mesoscopic packets devote all but o(n) degrees to their monomial carrier and retain that larger exponential scale after their leading coefficient is accounted for. The exact full-prefix selection identity then makes their overlap exponentially small.

Only actual-theta exponential moments, the already proved actual packet source-norm lower bound, and exact polynomial/Gram identities are used. There is no scalar-moment matrix replacement, RH assumption, Q-positivity hypothesis, inverse-gap estimate, or finite degree scan.

## Files

- CHEBYSHEV_MONIC_COMPARISON.md: main result with exponent 2log3-2 and a finite explicit monic bound. The exterior phase has an exact rational positivity certificate.
- SHARPER_CHEBYSHEV_AUDIT.md: independent audit of that main result.
- EXPONENTIAL_PACKET_LEVERAGE.md: the complete packet coefficient and selection derivation, originally using a weaker existing monic comparison. Its eta*/2 exponent is superseded by the Chebyshev result.
- AUDIT.md: independent audit of the coefficient calculation, uniformity, parity conversion, and exact triangular consequences. Its two editorial fixes are applied in the final note.
- SHA256SUMS: final payload hashes. The initial DRAFT file is a working snapshot, not part of the final payload.

## What remains open

Large signed derivative contributions may cancel, so divergence of the absolute synthesis sum is NOT a lower bound on H[P_n]/X[P_n]. This result does not rule out cancellation-sensitive synthesis, a different near-extremal packet hierarchy, nontriangular redundant representations, or a direct selected estimate. It proves neither Delta_n>0 nor U_n=o(Delta_n), and gives no RH conclusion.

This is AI-assisted analytical research with an independent AI-assisted audit, not a machine-formalized proof or external peer review. The actual packet arithmetic lower bound and its uniformity are inherited from the frozen supplied checkpoints; no new claim of literature novelty is made. No prior frozen package, live 4CT script, repository, or external service was modified.
