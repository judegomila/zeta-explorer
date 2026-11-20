# Independent audit: full atomic dual repair

2026-11-03. Analytic PASS as a conditional negative-witness test; no actual favorable repair cost is certified.

The mixture coefficients delta/(delta+||r||) and ||r||/(delta+||r||) are positive, sum to one, and cancel the full residual r against the reservoir mean -delta r/||r|| exactly. Bounding its reservoir objective by Fmax yields the stated objective upper bound, with no restriction on the sign of Fmax. Strict negativity of the numerator proves a negative feasible full-dual objective; it is not implied by scalar cancellation.

On the finite union of supports, the feasible probability-weight polytope is compact and nonempty. A linear minimum is attained at an extreme point, whose support has size at most the rank of the N cross equations plus normalization, hence at most N+1. This compression does not increase objective and does not introduce signed weights.

For the reservoir certificate, exact w0>0 with unit total and Zw0=0, plus 1^TR=0 and ZR=I, gives w(y)=w0+Ry. Cauchy on each row proves w_j(y)>=w0_j-||R_j||||y||>=0 for the stated delta; zero rows impose no restriction. Full row rank of the augmented matrix permits the displayed transpose/row-Gram right inverse. This auxiliary geometric inverse is not substituted for the actual moment inverse. Interval verification must enclose the quantities in these exact constructions; merely enclosing zero in an approximate residual would not prove an equality. The note's explicit exact-identity premises correctly avoid that shortcut.

Actual selection and the full-support spatial reference guarantee existence of some finite convex-ball reservoir, but no useful bound on Fmax/delta. In particular the known degree20 scalar witness has a nonzero full residual, and neither (2) nor any full negative witness has been established. Original and parity-weighted coordinates must be used consistently; invertible changes of cross coordinates preserve feasibility but not a free repair budget.

Accepted scope: an implementable exact finite geometric sufficient test and support compression, not an all-degree positive mechanism, theta target sign, new finite rung, or RH conclusion.
