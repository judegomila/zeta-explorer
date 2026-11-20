# Independent audit of sparse real-zero pair replacement

2026-11-04. New audit note only; no frozen files or 4CT edits. The proposed construction passes with the scope qualifications below.

## Setup

Let F_0 be the actual even theta transform. Choose distinct positive real-zero cells (a_j,b_j) with h_j=(b_j−a_j)/2≤1/4, c_j=(a_j+b_j)/2, c_1>4, and c_(j+1)≥c_j². Real zeros need not be simple. Choose 0<ε_j<min(h_j,1/4), write d_j=h_j²+ε_j²≤1/8, and put

    R_j(z)=[1+d_j/((z−c_j)²−h_j²)]
           [1+d_j/((z+c_j)²−h_j²)],
    F_hat=F_0 ∏_j R_j.

One unit of multiplicity is removed at each of ±a_j,±b_j; new zeros occur at ±c_j±iε_j. This construction does NOT preserve the complete real-zero geometry of F_0.

## 1. Existence input

The required small-gap pairs follow from N_distinct(T)/T→∞ for real zeros of F_0. Otherwise all sufficiently high consecutive real-zero gaps would exceed 1/2 and N_distinct(T)=O(T), a contradiction. Infinitely many small-gap cells can then be sparsified arbitrarily.

A positive-proportion theorem for simple critical-line zeros is sufficient for this distinct-zero counting input. It is unnecessary to assert that each chosen pair consists of two simple zeros, or that all real zeros are simple. Residual endpoint multiplicity does not affect any estimate below.

## 2. Entire convergence and exact order

On compact sets away from the prescribed poles, R_j−1=O_K(c_j^−2), uniformly in ε, so the product converges meromorphically. Multiplication by F_0 cancels every prescribed simple pole, giving an even real entire F_hat.

The disks D(±c_j,2) are disjoint and their centers have a fixed positive minimum separation. Outside their union,

    ∑_j |R_j(z)−1|≤C,

and the corresponding first-derivative series is bounded. These facts follow from the uniform sums of inverse squared and cubed distances to the centers. The same bounds hold for all other factors inside a single such disk. All constants are uniform in ε and h≤1/4.

Inside D(c_j,2), write

    q_j(z)=F_0(z)/[(z−a_j)(z−b_j)].

It is analytic, and its maximum on this disk is bounded by

    sup_|z−c_j|≤2 |q_j(z)|
       ≤ (2−h_j)^−2 max_|z−c_j|≤2 |F_0(z)|.

This is the maximum principle applied to q_j and the denominator bound on the radius-2 circle. The numerator (z−c_j)²+ε_j² is bounded, as are the remote half of R_j and all other factors. Reflection treats −c_j. Consequently

    M_(F_hat)(R)≤C M_(F_0)(R+4),

so F_hat has order at most one.

For exact order, on z=iy the perturbation of each linear quadratic factor is at most d_j/[(c_j−h_j)²+y²]. These quantities are uniformly small and summable. Therefore

    |∏_j R_j(iy)|≥c_*>0

uniformly in y and ε. The actual-theta order-one growth on the imaginary axis thus survives, establishing exact order one.

## 3. Uniform sharp real-axis Gamma envelope

The real divided-difference identity gives

    q_j(t)=F_0[a_j,b_j,t].

For |t−c_j|≤2, the Hermite–Genocchi integral over a two-simplex proves

    |q_j(t)|≤(1/2) sup_|s−c_j|≤2 |F_0″(s)|,
    |q_j′(t)|≤(1/6) sup_|s−c_j|≤2 |F_0‴(s)|.

These remain valid at t=a_j,b_j by continuity and are uniform as h_j→0. This is the essential cancellation estimate; separately bounding the rational poles would be invalid.

The needed fixed-derivative envelope follows elementarily from the supplied actual-theta factorization. Euler summation gives ζ(σ+it)=O((|t|+3)^(3/4)) uniformly on 1/4≤σ≤3/4. On complex t-disks of radius 1/4, the Gamma and polynomial prefactor is O((|t|+3)^(15/8)e^(−π|t|/4)). Cauchy's estimate gives, for every fixed k≤3,

    |F_0^(k)(t)|≤C_k(|t|+3)^(21/8)e^(−π|t|/4)
                 ≤C_k sqrt(W_4(t)),
    W_4(t)=|Gamma(4+it/2)|².

Indeed sqrt(W_4)≈(1+|t|)^(7/2)e^(−π|t|/4), leaving a 7/8-power margin. Bounded t are absorbed into the constants. Fixed real shifts of size at most four preserve comparability with sqrt(W_4).

Outside all real windows, use the uniform product and product-derivative bounds with F_0,F_0′. Inside one window, use the divided differences, bounded local numerator and its derivative, and bounded remaining factors and derivatives. This proves

    F_hat²+F_hat′²≤C W_4,                               (A)

uniformly in every ε_j. Constants may depend on the fixed baseline and sparse center choice, but do not deteriorate when any ε_j→0 or h_j becomes small.

## 4. Uniform all-degree lower and upper comparisons

Use the actual-theta good set on |t|≤An+1 and exclude additionally δ_n=(n+2)^−6 neighborhoods of ±c_j with c_j≤2(An+1). There are O(log log(n+3)) relevant indices. At retained points each nearby rational factor has absolute value at least δ_n^4/[C(n+2)^4]; the baseline good set already excludes its real poles. Every remaining real factor is ≥1 because t lies outside its short root intervals. Therefore

    |∏R_j(t)|≥exp[−C log(n+2)log log(n+3)].

The extra excluded measure is o(n^−2). The source identity (F_hat²p)′=F_hat T_hat p, the sharp tail from (A), and the unchanged weighted-maximum capture now prove

    exp[−C log²(n+2)]||p||_W4²≤X_hat[p].                 (B)

The upper bound (A) and the audited reference derivative inequality give

    X_hat[p]≤C(n+1)||p||_W4².                           (C)

For the monic Pollaczek competitor M_n, the sharper individual derivative estimate gives X_hat[M_n]≤Cb_n. Thus all these original reference comparison scales survive, uniformly in ε. Fixed small degrees are covered by applying one already-proved sufficiently large-degree lower estimate and enlarging C, with no ε-dependent eigenvalue bound.

## 5. Uniform local valley and capacity explosion

Fix j and any δ_j∈(0,h_j/2). On |x|≤δ_j,

    F_hat(c_j+x)=(x²+ε_j²)b_j(x),

where b_j includes q_j and all remote factors. q_j has no zero on this compact interval, because a_j,b_j are consecutive and the interval avoids both endpoints. Every remote real factor is positive and at least one, while their values and first two logarithmic derivatives are uniformly bounded. The same applies to the remote half of R_j. Thus for fixed j there are positive a_j^*,A_j^*,D_j^*, independent of every ε_l, such that

    a_j^*≤|b_j|≤A_j^*,   |(log|b_j|)″|≤D_j^*.

Therefore, for sufficiently small ε_j and |x|≤ε_j/2,

    (log F_hat²)″≥c ε_j^−2,
    F_hat²≤C_j ε_j^4.

The target measure of this central interval is ≥c_j ε_j^−5. Fixed side windows within (−δ_j,δ_j) give uniformly positive left and right cell masses. They remain in the same real-zero cell after replacement whether the former endpoints disappear or retain positive multiplicity. Consequently

    B_(I_j)≥c_j′ ε_j^−5.

All constants for fixed j are uniform in all other ε_l. Choose the ε_j individually to force B_(I_j)≥j². This yields a single globally entire example with unbounded escaping positive-excess blocks while retaining (A)–(C) and the uniform Pollaczek competitor estimate.

## Scope

The construction strengthens the earlier growth/reference-comparison countermodel. It changes selected real-zero locations and multiplicities, and does not retain the actual theta series, positive Fourier-kernel structure, or actual arithmetic. It proves no statement about the actual theta escaping capacities, selected coherence, or RH.

## Full-draft audit, 2026-11-04 03:30 UTC

Reviewed the complete ZERO_SURGERY_PRESERVES_SHARP_REFERENCE_BOUNDS.md draft in this directory. Its refined 19/8 exponent is correct: the xi prefactor has power 3/2+σ/2 and Euler summation contributes 1−σ, totaling 5/2−σ/2≤19/8 on 1/4≤σ≤3/4. Its more conservative radius shift R+6 is valid.

The zero-count assertion passes when counts include multiplicities and use the usual positive-real-part height convention after converting from the zeta s-plane. Only O(log log(T+3)) zero copies below T+1 are moved, each by bounded horizontal distance, so the stated counting difference and preservation of the baseline O(log T) error follow. Added quartets obey |Im z|<1/4, and the unchanged baseline zeros obey |Im z|<1/2. No real-zero simplicity assumption has been introduced.

The selected competitor consequences also pass: the lower all-degree bound gives A_hat_n≥exp[−C log²(n+2)]b_n, while the uniform Pollaczek estimate gives A_hat_n≤X_hat[M_n]≤Cb_n. The asserted logarithmic monic asymptotics, subexponential overlap bound, and quasi-polynomial Gram conditioning follow exactly as in the baseline argument. They do not show failure or success of selected positive diagonal decay or H/X→0, and the draft expressly avoids both claims.

No substantive mathematical correction is needed. One minor exact-scope wording recommendation applies to the final paragraph's description of the earlier multiplier construction: replace “lost the sharp upper envelope” by “did not establish the sharp upper envelope,” unless a separate proof of actual envelope failure is available. The earlier comparison audit proved weaker upper control, not failure of the sharper one. This wording does not affect the new zero-surgery construction or its conclusions.

## Conditional actual-pair test audit

Also reviewed ACTUAL_THETA_PAIR_CAPACITY_TEST.md. Its hypotheses, arithmetic, and conclusions pass. On |x|≤δ/2, the pair curvature is at least 48/(25δ²), and the residual loss is at most 1/(2δ²), leaving 71/(50δ²)≥1/δ². The target mass is therefore at least (16/25)M^−2δ^−5. Each side mass is at least (31/160)m²h^5. The harmonic capacity factor is at least half this side lower bound, so the product constant is (16/25)(31/320)=31/500 exactly. The stated δ≤h/4 ensures the side windows are outside the central test interval. The draft explicitly makes the actual-zero existence and residual-factor hypotheses conditional, with no unsupported actual-theta or selected-coherence conclusion.
