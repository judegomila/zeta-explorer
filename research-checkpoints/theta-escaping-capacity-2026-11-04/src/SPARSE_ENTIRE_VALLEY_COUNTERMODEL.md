# A single order-one entire countermodel with escaping positive excess

2026-11-04. This is a countermodel to a precise generic inference, not a deformation claimed to be the theta transform and not a counterexample to RH or selected coherence. The exact theta arithmetic is not preserved.

## 1. Precise claim falsified

The following data, even taken together, do not imply boundedness or compactness of the cell positive-excess operator:

- F is even, real entire, and of order one;
- F and each fixed derivative decay exponentially on the real line;
- F has infinitely many simple real zeros, all real-zero cells are bounded, and their complete locations and multiplicities are specified;
- the selected source closure, exact Green kernel, and finite local positive traces are available.

Starting with the supplied actual theta transform F_0, one can construct an even real entire F_tilde having exactly the same real zeros with the same multiplicities and the same broad properties, but with

    sup_(I escaping) ||sqrt((v_tilde')_+) K_tilde_I*|| = ∞.

In particular its global positive trace diverges. Thus even a complete real-zero geometry does not control the escaping positive excess under these broad analytic assumptions.

## 2. Sparse positive-on-real entire multiplier

Choose positive centers c_j in distinct zero-free cells of F_0, with c_j→∞ so fast that

    c_(j+1) ≥ c_j²,    c_j ≥ exp(exp(j)),    c_1 > 4.

Choose δ_j∈(0,1) so that [c_j−2δ_j,c_j+2δ_j] lies inside its real-zero cell. The widths may be arbitrarily small; no lower bound is assumed. Parameters ε_j∈(0,min(1,δ_j/100)) will be chosen later. Define

    H_j(z) = [((z−c_j)²+ε_j²)((z+c_j)²+ε_j²)]
                                      /(c_j²+ε_j²)²,
    H(z) = ∏_(j≥1) H_j(z),
    F_tilde(z) = F_0(z) H(z).

The product is locally uniformly convergent: for |z|≤R and c_j≥2R,

    H_j(z) = 1 + O(R²/c_j² + R⁴/c_j⁴),

uniformly in ε_j≤1. Each factor is strictly positive on the real line. The convergent product has no real zero and H(0)=1. Therefore all real zeros and multiplicities of F_0 remain exactly unchanged. New zeros are the nonreal quadruplets ±c_j±iε_j.

For |z|≤R,

    |H_j(z)| ≤ (1+R/c_j)^4.

There are O(log log(R+3)) indices with c_j≤2R, and the remaining geometric tail contributes O(1) to the logarithm. Consequently

    log max_(|z|≤R) |H(z)|
        = O(log(R+3) log log(R+3)) = o(R).

Thus H has order zero and is of exponential type zero. Multiplication preserves the at-most-order-one bound for F_0. In the actual-theta baseline, the order remains exactly one: for real y, H(iy)≥1, while the usual order-one growth of F_0 is already attained on the imaginary axis. More generally one may state the conclusion as order at most one if only an upper growth bound for F_0 is supplied.

Cauchy estimates on fixed-radius disks also give |H^(k)(t)|≤exp(o(|t|)) for each fixed k. If, for each β<β_0 and fixed k,

    |F_0^(k)(t)| ≤ C_(k,β) exp(−β|t|),

then the same estimate holds for F_tilde for every β<β_0, with new constants. Thus exponential moments, polynomial completeness, and the source-closure/Green-kernel arguments remain valid. The exact sharp envelope with its original polynomial prefactor is NOT claimed to remain valid.

## 3. Uniform local factorization near a selected valley

Write t=c_j+x. On |x|≤δ_j,

    F_tilde(c_j+x) = (x²+ε_j²) b_j(x).

Here b_j contains F_0, the factor ((2c_j+x)²+ε_j²)/(c_j²+ε_j²)², and all H_l with l≠j. On this fixed neighborhood there are constants 0<a_j<A_j<∞ and D_j<∞ such that

    a_j ≤ |b_j(x)| ≤ A_j,
    |(log|b_j|)''(x)| ≤ D_j,

uniformly over all choices ε_l∈[0,min(1,δ_l/100)]. The reason is elementary: the finitely many nearby factors stay away from their zeros on this neighborhood, while the distant factors and their first two derivatives converge uniformly, with a summable O(c_j²/c_l²) tail. Their nonzero product has a positive uniform lower bound. F_0 is fixed and nonzero there. Allowing ε_l=0 for this auxiliary bound causes no zero near c_j when l≠j.

With w_tilde=F_tilde² and v_tilde=(log w_tilde)',

    v_tilde'(c_j+x)
       = 4(ε_j²−x²)/(x²+ε_j²)² + 2(log|b_j|)''(x).

For sufficiently small ε_j and |x|≤ε_j/2 this is at least c ε_j^(-2), while w_tilde≤C_j ε_j^4. Hence, for

    dν_tilde=(v_tilde')_+dt/w_tilde,

    ν_tilde([c_j−ε_j/2,c_j+ε_j/2]) ≥ d_j ε_j^(-5)      (1)

with d_j>0 independent of ε_j and of the other ε_l.

The cumulative cell masses L_tilde(c_j−ε_j/2) and R_tilde(c_j+ε_j/2) are bounded below by positive constants independent of the parameters. Integrate w_tilde on the fixed windows x∈[−δ_j,−δ_j/2] and x∈[δ_j/2,δ_j], where (x²+ε_j²)²≥x^4 and |b_j|≥a_j. Therefore the capacity test from the preceding note yields

    B_tilde_(I_j) ≥ d'_j ε_j^(-5),                    (2)

where d'_j>0.

All bounds needed for a fixed j are uniform in the other parameters, so the ε_j may now be selected individually small enough that B_tilde_(I_j)≥j². The lower capacity inequality gives

    ||sqrt((v_tilde')_+) K_tilde_(I_j)*||² ≥ j².

The maximal direct-sum positive operator is therefore unbounded. Since each local positive trace is at least this squared norm, the sum of positive traces diverges as well.

## 4. Relation to the actual-theta inputs

The construction preserves the complete real-zero geometry of the selected baseline, entire order, real symmetry, and exponential decay with every smaller exponent. It also preserves the generic source closure and all exact cell Green/trace identities. Those data alone cannot establish a uniform escaping-cell estimate.

It does not preserve the theta series, the positivity or specific shape of the Fourier theta kernel, the sharp endpoint real-axis envelope, or the actual subexponential lower comparison with the fixed Pollaczek reference. An argument using these stronger specific inputs is not refuted.

A separate optional variant starts from F_0(t)=F_actual(2t), which has extra exponential decay. Then multiplication by H still permits the sharp upper majorant

    |F_tilde(t)|²+|F_tilde'(t)|² ≤ C |Gamma(4+it/2)|²,

because one can retain a real-axis decay exponent strictly larger than π/4. In that variant the real-zero set is the scaled baseline set, not the original actual set. This does not restore the lower comparison or exact theta arithmetic.

No conclusion about the actual capacities B_I, selected H/X limit, relative Schur excess, or RH follows from this countermodel. Its purpose is to close the generic real-zero/growth-only route and identify exactly which stronger input a successful escaping-cell proof must use.
