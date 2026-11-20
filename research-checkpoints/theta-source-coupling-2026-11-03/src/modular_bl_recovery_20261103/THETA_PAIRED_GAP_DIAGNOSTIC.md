# Actual-theta paired innovation gap: finite numerical diagnostic

Status: unvalidated numerical quadrature; independent numerical replication PASS. Not an interval certificate and not an all-degree result.

For the endpoint paired identity of PAID_SCHUR_NEXT, use the actual complete theta profile and P of same-parity polynomials through degree n−2. Choose the new representative p=D^n in coefficient notation (monic polynomial p(x)=x^n). The quotient invariance of the exact Schur identity means this gives the same A_X,B_Y,C_XY and S as the selected monic polynomial. Define

 D_n=(n+1)·(2S/A_X).

When A_X>0, the quantitative candidate B_Y+C_XY≤[1−δ/(n+1)]A_X is equivalent at this one rung to δ≤D_n. In particular D_n>0 alone follows from a separately certified positive next signed pivot; D_n≥1 is a stronger quantitative claim and is NOT supplied by such a sign certificate.

The owned `paired_gap_theta_probe.py` constructs the full X/Y Gram matrices directly from eight theta orbits and adaptive floating quadrature on h∈[0,2.5], keeping the correct old target inverse. It gives

 n:     1        2        3        4        5        6        7
 D_n: 1.071872 1.181547 1.355298 1.646108 2.116695 2.714040 3.099135

This finite diagnostic does not falsify δ=1. Its truncation, quadrature, and linear solves have not been interval-certified; the absolute scalar error reported by `quad_vec` is controlled by the largest high-order matrix entries and does not directly enclose any displayed D_n. Existing finite positive-pivot certificates independently establish signs at their stated degrees, but not these margins. No conclusion about larger n or any fixed δ follows from the list.

An independently audited exact source-specific route to compare with Gaussian is to choose c=v'(0)>0 and define the complete-theta oscillator defect η=(D+ch)ψ=(ch−v)ψ. For any polynomial p, the commutator [p(D),h]=p'(D) gives

 Xp=−(2/c)D p(D)ψ−p'(D)ψ+(2/c)p(D)η.                             (1)

The defect vanishes identically for the Gaussian and yields its exact 1/(n+1) relative gap. For theta η(h)=O(h³) at the even midpoint, but its high derivatives and the actual old inverse occur together; no uniform bound transferring the Gaussian gap is established by this identity. Any such estimate must retain the full signed correlation and selected regression rather than bound the defect pointwise or assume a uniform conditioning gap.
