# The first actual odd residual has negative prime correction throughout the critical shift interval

Date: 2026-11-03. Status: independent analytic audit PASS. This is a complete-theta counterexample to a concrete proposed nonnegative arithmetic reserve. It is not a negative bridge pivot or a failure of RH. No finite numerical certificate is required.

## 1. Candidate and theorem

A possible shortcut after the exact half-sieve cancellation is:

> The divisor-variance term added back to the half-sieved source is nonnegative on every actual inverse-selected residual.

This candidate is false already for q(t)=t, the monic residual of the empty odd prefix. In fact, with the notation of TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md,

D_t(a)<0 for every 0≤a≤1/2.                                      (1)

At a=1/2, D means the integrated Abel correction, with every prime's comb-minus-Poisson bracket retained. No direct boundary Euler quotient is substituted.

There is a stronger individual-correlation statement. For every prime p and m≥1,

∫_R t²|F(t+ia)|²cos(mt log p)dt <0,
                         0≤a≤1/2.                              (2)

In contrast, the actual empty-prefix even residual q=1 satisfies D_1(a)>0 throughout the same interval, because its complete-theta physical autocorrelation is strictly positive. Thus the correction cannot be assigned one common sign over the two actual selected ladders. The same sign contrast holds for every nonempty finite prime set, because each individual prime-power correlation has the indicated sign; an infinite prime limit is not needed for that obstruction.

These are statements about q=1 and q=t only, not an asserted alternating-sign theorem for higher selected degrees. A candidate explicitly restricted to nonempty prefixes is not refuted by these two base residuals.

## 2. Exact single-orbit Bessel kernel

Write Z=πexp(2R). The full unreflected single-orbit kernel has the exact expression

A_{f,a}(R)=16exp(R)[P_0(Z,a)K_a(2Z)+Q_0(Z,a)K_{a+1}(2Z)],
P_0=Z²(4Z²+6a+9),    Q_0=−12Z³.                                 (3)

This is obtained by expanding f(R+v)f(R−v), using the full-line integral representation of K, and applying K_(a−1)=K_(a+1)−(a/Z)K_a. The signed orbit f and both spatial tails are retained.

If 16exp(R)[P K_a(2Z)+Q K_(a+1)(2Z)] is differentiated in R, the pair becomes

P_new=(1+2a)P+2Z∂_ZP−4ZQ,
Q_new=−(1+2a)Q+2Z∂_ZQ−4ZP.                                    (4)

Applying (4) twice gives

∂_R² A_{f,a}=16exp(R)[P_2K_a(2Z)+Q_2K_(a+1)(2Z)],
P_2=Z²[64Z⁴+(16a²+240a+1140)Z²+24a³+156a²+330a+225],
Q_2=−12Z³(40Z²+4a²+55)<0.                                      (5)

Equations (3)-(5) are exact. The accompanying symbolic script checks these polynomial identities, but the displayed recurrence proves them independently of finite numerical quadrature.

## 3. Elementary order comparison and a positive polynomial

For x>0, the full-line integral
K_ν(x)=(1/2)∫_R exp(−x cosh u+νu)du
implies that log K_ν(x) is convex in ν by Hölder. Therefore its unit increments are increasing, and for 0≤a≤1/2,

K_(a+1)(x)/K_a(x) ≤ K_(3/2)(x)/K_(1/2)(x)=1+1/x.                (6)

The half-integer evaluation follows from K_(1/2)(x)=sqrt(π/(2x))exp(−x) and the standard K recurrence. Since Q_2<0, (6) gives the lower bound

P_2K_a(2Z)+Q_2K_(a+1)(2Z)
 ≥K_a(2Z)Z² B_a(Z),                                            (7)

where, setting y=Z−6,

B_a(6+y)=64y⁴+1056y³+(16a²+240a+6084)y²
       +(144a²+2880a+13596)y
       +24a³+420a²+8970a+7599.                                 (8)

Every coefficient is nonnegative for a≥0 and the constant term is at least 7599. Thus

∂_R² A_{f,a}(R)>0 whenever Z≥6 and 0≤a≤1/2.                     (9)

No numerical Bessel inequality is used. Since π>3, all arithmetic centers j≥2 satisfy Z=πj>6.

## 4. Apply the result to the actual odd residual

For q=t, T_q=−D_R²/4. Consequently

a_j(a)=−(1/4)∂_R²A_{f,a}((log j)/2)<0, j≥2.                    (10)

For every j≥2, divisor pairing gives

d_a′(j)/a>0 for a>0,
lim_(a→0)d_a′(j)/a=ell₂(j)>0.                                  (11)

The exact all-prime identity therefore proves

D_t(a)=2πΣ_{j≥2}j^(−1/2)[d_a′(j)/a]a_j(a)<0.                  (12)

All terms are negative and the series is absolutely convergent. There is no unsigned remainder requiring payment.

More generally, for ω≥log 2, the complete shifted correlation satisfies

C_{t,a}(ω)=−(1/4)Σ_{j≥1}j^(−1/2)d_a(j)
                ∂_R²A_{f,a}((ω+log j)/2)<0,                    (13)

because every term now has Z=πjexp(ω)≥2π>6. This proves (2), and actually proves negativity for every real |ω|≥log 2, not only prime-power frequencies. The theta expansion and its fixed-order derivatives converge absolutely on this region, as established in the companion note.

## 5. A uniform strict debit with no numerical certification

Retaining only the negative j=2 term of (12), using (7)-(8), K_a(x)≥K_0(x), and sinh(a log 2)/a≥log 2, gives

D_t(a) ≤ −C_*,
C_*=16π(log 2)²(2π)²·7599·K_0(4π)>0,
                         0≤a≤1/2.                             (14)

The exact special-function constant is the theorem. An ordinary numerical evaluation gives C_* approximately 8.8476; this decimal is a diagnostic, not an interval-certified replacement. At a=0 a separate truncated diagnostic gives D_t(0) approximately −21.667, but that value is not needed or certified here.

## 6. Consequence for half-sieve comparison, and the remaining problem

Let S_half[q;a] denote the limit of the integrated normalized half-sieved source. The exact identity is

h_a[q]=S_half[q;a]+D_q(a)/2.                                  (15)

For the actual first odd residual,

S_half[t;a]≥h_a[t]+C_*/2.                                     (16)

Thus half-sieving creates a positive excess relative to the original target; it cannot be treated as a lower bound for that target. For q=1 the order is reversed because D_1>0. Neither universal ordering between h and S_half is valid across the two actual selected ladders.

A bound D_q≥−2S_half is exactly h_a[q]≥0, so presenting that bound without independent input merely restates the original sign requirement. A strictly stronger estimate with an independent paid margin could help, but none is supplied here. This result rules out D_q≥0 and source monotonicity, not every possible correlated estimate or a degree-uniform estimate allowing a genuine negative debit.

No unknown next pivot, old inverse bound, zero-location input, or RH assumption entered the proof. It uses the actual complete rank-one theta source rather than a generic positive-profile countermodel.

## Sources

- Exact complete-theta all-prime identity and convergence: companion TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md.
- Existing research baseline: https://github.com/judegomila/mathexplorer/pull/40 at head 6c6c81697fdc527d017dc592b55bea3efa5bb31b.
- Bessel integral representation: https://dlmf.nist.gov/10.32#E9.
- Bessel derivative/recurrence conventions: https://dlmf.nist.gov/10.29.
- Half-integer value: https://dlmf.nist.gov/10.39#E2.
