RELATIVE BOUNDS FOR THE COMPLETE MODULAR BRIDGE
Research continuation, 2 November 2026

This source bundle accompanies the 23-page research paper prepared for Jude
Gomila's bridge-shear investigation. It contains analytic partial positivity
results, exact interval certificates, an obstruction to slice-by-slice positivity,
and the remaining all-order bridge criterion. It is not a proof of RH and makes
no historical novelty claim. External mathematical review remains appropriate.

FILES

relative_modular_bridge_bounds.tex
    Main LaTeX source: complete theta setup, curvature proof, separated and
    paired Gram theorems, arithmetic grouping, and modular approximation errors.

relative_modular_bridge_hierarchy.tex
    Included source: exponential spectral decay, the exact all-order confluent
    criterion, and the proved three-channel determinant.

relative_modular_bridge_continuation.tex
    Included source: new four-channel theorem H3, full-theta rational interval
    proof, explicit negative H5 slice direction, parity Hankel criterion,
    averaged Schur identity, and the precise remaining conditions.

bridge_gram_exact_checks.py / bridge_gram_exact_checks.json
    Original standard-library checker and output: 71 finite exact rational
    identities and inequalities in the separated, paired, and H2 Gram proofs.

sixth_pointwise_certificate.py / sixth_pointwise_certificate.json
    Complete H3 certificate on all 700 closed intervals partitioning 3 <= z <= 10,
    with every theta-tail term bounded. The checker also verifies the rational
    constants in the separate analytic proof for all z >= 10.

slice_h5_exact_certificate.py / slice_h5_exact_certificate.json
    Exact rational interval witness for a negative direction of the individual
    h=0 midpoint slice. Includes all transcendental and n>=5 theta remainders.
    This does NOT assert a negative direction of the integrated bridge.

REPRODUCE THE CERTIFICATES

Use Python 3 without optimization (-O would disable assertions):

    python3 bridge_gram_exact_checks.py
    python3 sixth_pointwise_certificate.py
    python3 slice_h5_exact_certificate.py

All three use Python's standard library only and regenerate their companion
JSON files. The certificates use exact rational interval arithmetic for sign
decisions. Printed decimal values are previews, not proof inputs.

The scripts verify finite arithmetic and interval enclosures. The accompanying
analytic arguments justify theta modularity, full-tail majorants, derivatives,
continuum coverage, the unbounded parameter range, and transfer through the
bridge integral. The scripts alone do not establish unrestricted positivity.

BUILD THE PAPER

Keep all three .tex files together and run:

    pdflatex -interaction=nonstopmode -halt-on-error relative_modular_bridge_bounds.tex
    pdflatex -interaction=nonstopmode -halt-on-error relative_modular_bridge_bounds.tex

The document uses standard TeX Live packages, including amsmath, amssymb,
amsthm, mathtools, lmodern, microtype, geometry, fancyhdr, and hyperref.

ESTABLISHED SCOPE

1. Full-profile log-curvature below -17.
2. Complete Gram positivity for any number of quarter-separated test nodes,
   including countably infinite configurations and coordinate Schur complements.
3. Arbitrarily close pairs with sufficiently separated centers, through the
   first-derivative limit, in a normalized divided-difference basis.
4. Four derivative channels at one node for every positive shift: H3 is positive
   definite. The normalized even 2-by-2 determinant is at least 1334; the new
   normalized odd determinant is at least 4,000,000.
5. An explicit negative H5 direction for the h=0 midpoint slice, certified below
   -1,400,000,000, excluding an all-order proof by positivity of every slice.
6. Exact decomposition of an averaged Schur complement into its average local
   residual and a nonnegative coupling-variation term.
7. Negative zero-frequency shear for each raw finite rectangular group.
8. A smooth pole-correct midpoint approximation with global weighted errors.
9. Equivalence of all-order confluent Gram positivity to full bridge positivity.

REMAINING CONDITIONS

Write m_n = (-1)^n C_a^(2n)(0) / C_a(0). The next unproved integrated condition
is the even H4 determinant:

    (m_2 - m_1^2) m_4 - m_3^2 + 2 m_1 m_2 m_3 - m_2^3 >= 0.

The following odd H5 block requires a separate inequality. At every finite order,
the exact Schur identity retains the bridge averaging. Its covariance contribution
may compensate for negative local residuals, but that theta-specific dominance
has not been established at all orders. Finite-order positivity does not finish RH.
