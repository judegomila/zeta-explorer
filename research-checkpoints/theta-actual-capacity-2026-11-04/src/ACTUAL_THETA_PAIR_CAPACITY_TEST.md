# A quantitative conditional test for an actual off-line pair

2026-11-04. This is a local theorem applicable to the actual theta transform if its explicit hypotheses hold. It does not assert that any off-line Xi zero exists or that the hypotheses occur at large heights.

Let a nonreal conjugate Xi zero pair be c±iδ, 0<δ<1/2. Suppose its real projection c lies inside a real-zero cell I and choose h>0 with [c−h,c+h]⊂I. Factor one pair on this real interval:

    F(c+x)=(x²+δ²)g(x),   |x|≤h.

Assume

    0<m≤|g(x)|≤M,
    |(log|g|)''(x)|≤D,
    δ≤h/4,   Dδ²≤1/4.                                (1)

All quantities in (1) concern the actual residual factor; no comparison model is substituted. Then the positive-excess capacity of this actual cell satisfies

    B_I ≥ (31/500)(m/M)² (h/δ)^5.                    (2)

## Proof

For w=F² and v=(log w)',

    v'(c+x)=4(δ²−x²)/(x²+δ²)²+2(log|g|)''(x).

On |x|≤δ/2 the first term is at least 48/(25δ²). Condition (1) makes the negative residual at most 1/(2δ²), so v'≥1/δ². Also w≤(25/16)M²δ⁴ there. Therefore

    ∫_(c−δ/2)^(c+δ/2) (v')_+/w
        ≥ (16/25) M^(-2) δ^(-5).                    (3)

The left and right cumulative cell masses at the ends of this central interval are each bounded below by a side-window integral, because δ/2<h/2:

    ∫_(h/2)^h (x²+δ²)² g(±x)² dx
        ≥ m² ∫_(h/2)^h x⁴ dx
        = (31/160)m² h⁵.                             (4)

Use [c−δ/2,c+δ/2] in the capacity supremum. Its denominator 1/L+1/R is at most twice the reciprocal of (4). Combining (3)–(4) proves (2).

## Consequences and boundary

If actual off-line pairs at escaping heights admitted windows with m/M bounded below, h/δ→∞, and Dδ²≤1/4, then the actual positive capacities would be unbounded. This is a conditional obstruction, not a statement that those pairs or windows exist.

More generally, any proposed actual bound B_I≤b on such a cell would force

    (m/M)²(h/δ)^5 ≤ (500/31)b.

Thus a genuine tail estimate must either control the width of such a residual-factor valley, permit compensating variation in g, or avoid a uniform cell-operator bound altogether and use selected-only cancellations. Known critical-strip containment gives only δ<1/2; it supplies none of the needed lower separation or residual-factor control. Real-zero locations alone do not determine these quantities.

This test addresses positive capacity. It does not give the negative-excess lower bound e_n^-→1+e_n^+ needed for H/X→0.
