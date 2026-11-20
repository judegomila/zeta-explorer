# Möbius cancellation transfers to exact theta packets, but not yet to polynomial selection

2026-11-04. This continuation proves a positive growing-space transfer with an explicit error regime, and identifies concrete failures of two natural attempts to identify its selector with the monic-polynomial selector. The actual bound H[P_n]/X[P_n] -> 0 and the adjacent-determinant upper estimate remain open.

## Positive transfer with full arithmetic and reselection

The ordinary arithmetic-log correction is retained exactly. Its relative kernel is positive for L>log N+C, and its completely reselected endpoint stays close to the bare Möbius endpoint. Published uniform moment errors are converted to a source-relative arithmetic metric, rather than bounded entrywise. The actual ordinary zeta-moment result holds for N<=T^theta, theta<17/53.

More substantially, the complete cubic derivative correction, every arithmetic pair, and smooth-window derivative errors give the following theorem. Let eta be a fixed smooth real function supported in (1,2), with integral eta^2=1. Write F=sigma aZ with a>0 the exact gamma envelope. On the finite packet space

    p_c(t)=a(t)^(-1) eta(t/T) sum_(j<=N)c_j(j/N)^(-it),

extended by zero outside its support, minimize the exact global theta source

    X[p]=integral |Fp'+2F'p|^2

over every coefficient vector with c_N=1. For N<=T^(1/100), the completely changed minimizer satisfies

    H[p]/X[p] <= C_eta (1+loglog(N+3))^2/(log T)^2,
    H[p]=integral |Fp'|^2.

The proof includes the gamma derivative and cutoff derivative, controls the full residual selected column, and uses an independently proved source lower bound. It does not assume the desired conclusion. The conservative exponent 1/100 is explicit and is not claimed optimal.

These are smooth, compactly supported, generally complex packets. They are not algebraic polynomials, and fixing c_N is not fixing a polynomial leading coefficient. The theorem therefore transfers the arithmetic cancellation to exact theta forms on these spaces, not to the original P_n.

## A controlled approximation with the wrong affine selector

The natural common-degree Pollaczek approximation of the centered exponentials has a uniform source/derivative error bounded by

    C N^(5/2)sqrt(log(N+2)) exp(-c m/N^2) sqrt(K[c]).

Nevertheless its leading-coefficient functional approaches the first arithmetic coordinate, rather than the last Möbius endpoint. Their exact arithmetic-energy squared overlap is at most 1/phi(N), and is zero when N is not squarefree. Thus improving this map's approximation does not fix its affine constraint. Moving the carrier so the last coordinate instead dominates incurs a non-negligible derivative cost at polynomial label growth, even after reselection in the specified positive-sum GCD model.

This is an obstruction to the stated map, not to every possible transfer construction. It also does not assert that the exponential packets' actual Gram is the GCD kernel.

## Internal theta weights are a different map

Applying one differential polynomial to the theta kernel evaluates the same explicit polynomial R_p at every internal summand argument. Equality with an independently Möbius-weighted finite sum forces all label coefficients to be equal. The proof applies to the complete sum, so cross-label cancellation cannot avoid it.

Every fixed nonzero finite reflected-source target also has a positive distance from all actual polynomial sources, witnessed by a real zero cell and its nonzero reflection-boundary jump. This bound depends on the target and can vanish along growing cutoffs. It does not contradict the prior finite-theta approximation, and does not apply indiscriminately to the different Fourier-modulation interpretation of arithmetic labels.

## Remaining requirement

A full polynomial result still needs one controlled construction that matches the entire lower-degree space, the monic affine functional, all source and derivative forms, and the growing arithmetic scale. The proved packet theorem and the two precise map obstructions make these remaining requirements explicit; they do not supply the missing construction.

## Frozen allowlist

- README.md
- MOBIUS_TWIST_CORRECTION.md
- SHIFTED_MOMENT_AND_RESELECTION_AUDIT.md
- POLYNOMIAL_LEADING_CONSTRAINT_OBSTRUCTION.md
- INDEPENDENT_AUDIT_POLYNOMIAL_LEADING_CONSTRAINT.md
- THETA_SELECTION_INTERTWINER.md
- INDEPENDENT_AUDIT_THETA_SELECTION_INTERTWINER.md
- AUDIT.md
- SHA256SUMS

These nine files are the exact backup allowlist; working/ is excluded. SHA256SUMS covers the eight payload files. All arguments received separate AI-assisted analytical audits, not external peer review or machine formalization. No RH, selected polynomial sign, or coherence theorem is asserted. Earlier frozen sources and all 4CT work remain unchanged.
