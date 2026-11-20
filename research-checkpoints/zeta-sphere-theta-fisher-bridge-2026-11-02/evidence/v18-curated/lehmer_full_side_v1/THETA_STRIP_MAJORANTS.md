# Elementary full-theta strip majorants for the contour certificate

2026-11-02. Independently reviewed analytic bounds.

Let |y|<π/4 and c=cos(2y)>0. For every real x,

|ψ(x+iy)|≤16 c^(−5/2)e^(−|x|/2),
N(y):=∫_R|ψ(x+iy)|²dx≤512 c^(−5).                       (1)

## Proof

For every a>0,
Σ_(n≥1)n²e^(−an²)≤a^(−3/2),
Σ_(n≥1)n⁴e^(−an²)≤2a^(−5/2).                            (2)
For a≤1, the sum of a nonnegative unimodal function on the positive integers is at most its integral on [0,∞) plus its maximum. The two constants are respectively sqrtπ/4+1/e<1 and 3sqrtπ/8+4/e²<2. For a≥1, write the sum as at most e^(−a)Σn^q e^(−(n²−1)). Each latter sum is <2 for q=2,4: the n=2 term is at most 16e^(−3)<0.8, and subsequent term ratios are at most (3/2)^4e^(−5)<0.035. Finally sup_(a≥1)a^(3/2)e^(−a)<1/2 and sup_(a≥1)a^(5/2)e^(−a)<1, proving (2).

By evenness it suffices to take x≥0. Let Z=πe^(2x). Absolute values in the full theta series give
|ψ(x+iy)|≤4e^(x/2)[2Z²Σn⁴e^(−cZn²)+3ZΣn²e^(−cZn²)]
≤(28/sqrtπ)c^(−5/2)e^(−x/2)<16c^(−5/2)e^(−x/2).
Integration proves the norm bound (1). Full-theta evenness is valid throughout the strip, not just on the real axis.

## Superexponential real-tail bound

If x≥L≥0 and A=π c e^(2L)≥1, the same series bounds with Σn^q e^(−an²)≤2e^(−a) give

|ψ(x+iy)|≤240 e^(9x/2)e^(−πc e^(2x)).

For A>5/4 this implies

I_L(y):=∫_L∞|ψ(x+iy)|dx
≤120(πc)^(−9/4) A^(5/4)e^(−A)/[1−5/(4A)].               (3)

Use t=πc e^(2x), then bound Γ(9/4,A) by A^(5/4)e^(−A)/(1−5/(4A)); the latter follows from (1+u/A)^(5/4)≤e^(5u/(4A)).

For g(u)=ψ(u+iy)e^(itu), |g|=|ψ|. If g_L is zero outside [−L,L], then uniformly in real q,

|(g*conjugate g)(q)−(g_L*conjugate g_L)(q)|
≤4[16c^(−5/2)] I_L(y).                                (4)

This is the sum of the two removed-factor regions; overlap is harmless. Multiplication by the compact q² weight in the contour identity converts it immediately to a core-integral truncation allowance.

These bounds control analytic strip norms and real-window tails only. They do not, by themselves, certify a floating FFT or its interpolation/alias errors; those require the separate verifier.
