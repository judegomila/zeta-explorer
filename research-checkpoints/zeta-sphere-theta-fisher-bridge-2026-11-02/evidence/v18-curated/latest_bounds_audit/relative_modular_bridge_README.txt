RELATIVE BOUNDS FOR THE COMPLETE MODULAR BRIDGE
Research continuation, 2 November 2026

This source bundle accompanies the 15-page research note prepared for Jude
Gomila's bridge-shear investigation. It contains analytic partial positivity
results, an arithmetic obstruction, a controlled approximation scheme, and
the exact remaining all-order criterion. It is not a proof of RH and makes
no historical novelty claim.

FILES

relative_modular_bridge_bounds.tex
    Main LaTeX source, including the complete theta setup, curvature proof,
    separated and paired Gram theorems, arithmetic grouping, and rigorous
    midpoint approximation errors.

relative_modular_bridge_hierarchy.tex
    Included LaTeX section: exponential spectral decay, the exact all-order
    confluent criterion, the proved three-channel determinant, and the next
    unproved determinant condition.

bridge_gram_exact_checks.py
    Python 3 standard-library arithmetic checker. It uses fractions.Fraction
    and checks 71 finite identities/inequalities in the Gram proofs.

bridge_gram_exact_checks.json
    Results from the exact checker. No floating-point quadrature or sampled
    eigenvalues are used to certify the stated inequalities.

REPRODUCE THE ARITHMETIC CHECKS

    python3 bridge_gram_exact_checks.py

The checker verifies finite arithmetic. It does not automatically prove the
analytic arguments, modular identities, limit operations, operator claims,
or unrestricted positive definiteness.

BUILD THE PAPER

Keep the two .tex files together and run:

    pdflatex -interaction=nonstopmode -halt-on-error relative_modular_bridge_bounds.tex
    pdflatex -interaction=nonstopmode -halt-on-error relative_modular_bridge_bounds.tex

The document uses standard TeX Live packages, including amsmath, amssymb,
amsthm, mathtools, lmodern, microtype, geometry, fancyhdr, and hyperref.

ESTABLISHED SCOPE

1. Full-profile log-curvature below -17.
2. Complete Gram positivity for any number of quarter-separated test nodes,
   including countably infinite configurations and their Schur complements.
3. Arbitrarily close pairs with sufficiently separated centers, through the
   first-derivative limit, in a normalized divided-difference basis.
4. Strict positivity of three derivative channels at one node for every
   positive shift, with normalized 2-by-2 determinant at least 1334.
5. Negative zero-frequency shear for each raw finite rectangular group.
6. A smooth pole-correct midpoint approximation with global weighted errors.
7. Equivalence of all-order confluent Gram positivity to full positivity.

The full all-order hierarchy is not proved. The next unproved condition in
this calculation is C''(0) C^(6)(0) - [C^(4)(0)]^2 >= 0. Establishing just
that next finite order would not complete the hierarchy.
