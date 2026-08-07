# Weighted-translation theorem artifacts

These files serialize the elementary constant in
`notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` at the deterministic
input `lambda=2.5`, with outward `mpmath.iv` intervals at 80 and 160 decimal
digits.

The producer reconstructs the degree-seven constant in its factored form.
The replay hashes the admitted sources, reconstructs the bump derivative
constant through the incomplete-gamma identity, expands the three prolate
terms independently, and requires interval overlap without a decimal
tolerance.  Both paths share `mpmath.iv`; that limitation is serialized in
every JSON file.

These artifacts check theorem constants only.  They are not an outer--outer
Weil-pairing certificate, a sector-floor certificate, or an asymptotic
determinant result.
