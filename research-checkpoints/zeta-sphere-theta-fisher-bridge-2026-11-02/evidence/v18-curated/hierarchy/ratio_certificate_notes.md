# Validated interval certificate for a failed multiplicative hierarchy route

## Statement being tested

Let M_n(v)=integral_0^infinity h^(2n)psi(h-v)psi(h+v)dh for the **complete** Riemann theta profile, and define g_n=M_{n+1}/M_n. If every g_n were positive definite, M_0 PD and the Schur product theorem would give an all-orders induction. This sufficient claim is stronger than RH and must be independently tested.

The certificate targets g_4=M_5/M_4, not M_4, M_5, or the shear. Nodes are j/8, j=0,...,11. The exact integer vector is

    c=(91,-308,347,39,-445,277,277,-445,39,347,-308,91).

The original local script `certify_ratio.py` encloses the twelve g_4(k/8) values by interval arithmetic and forms the corresponding quadratic form. `ratio_intervals.json` stores the results. Status and final enclosure will be appended after the run.

## Exact profile derivatives

For u>=0 and r_m=pi m²exp(2u),

    psi^(j)(u)=4exp(u/2) sum_{m>=1}p_j(r_m)exp(-r_m),
    p_0(r)=2r²-3r,
    p_{j+1}=(1/2-2r)p_j+2r p_j'.

For j=1,...,4 the coefficient lists in descending order are

    p1: -4,15,-15/2,0
    p2: 8,-56,165/2,-75/4,0
    p3: -16,180,-529,1635/4,-375/8,0
    p4: 32,-528,2588,-4256,15465/8,-1875/16,0.

Evenness gives psi^(j)(-u)=(-1)^j psi^(j)(u). All coefficient sums in absolute value are less than 10000, and degrees are at most six.

## Theta-index tail bound (uniform, derivatives 0 through 4)

Write r=pi exp(2u)>=pi. The omitted m>=7 part of any derivative satisfies

    |tail_j(u)|
    <=40000 exp(u/2-r)(1+r)^6 sum_{m>=7}m^12 exp(-pi(m²-1))
    <10^-45 exp(u/2-r)(1+r)^6.                              (T)

For the elementary final inequality, the first series term is 7^12 exp(-48pi). The ratio of successive terms is at most (8/7)^12 exp(-15pi)<10^-19, so multiplying by 40000 still leaves a bound below 10^-50, much smaller than 10^-45. The factors follow from (1+m²r)^6<=m^12(1+r)^6. The script adds the symmetric interval given by (T), rather than silently dropping theta tails.

## Integration tail

For every u>=0,

    psi(u)<=100 exp(9u/2-pi exp(2u)).

Indeed divide the positive theta sum by exp(9u/2-pi exp(2u)), discard its negative linear contribution, and use

    8pi² sum_{m>=1}m^4 exp(-pi(m²-1))<100.

For h>=4, 0<=v<=11/8, and k in {8,10}, both h±v are positive. Hence

    h^k psi(h-v)psi(h+v)
    <=10^4 exp(19h-2pi exp(2h)).

Here h^k<=exp(10h). The tangent inequality exp(2h)>=exp(8)(1+2(h-4)) gives the explicit integral bound

    integral_4^infinity ... dh
    <=10^4 exp(76-2pi exp(8))/(4pi exp(8)-19)
    <10^-400.                                             (I)

The script adds [0,10^-400] to each integrated moment.

## Finite-interval quadrature

Use interval arithmetic at 40 decimal digits. On each dyadic interval [l,r], length d, midpoint m, Simpson's rule has a rigorous remainder enclosure

    integral_l^r F(h)dh in
      d(F(l)+4F(m)+F(r))/6 + [-1,1] d^5 sup|F''''|/2880.

All function values are intervals including (T). Derivatives are enclosed by the explicit Leibniz formulas

    P^(m)(h)=sum_{l=0}^m binomial(m,l)psi^(l)(h-v)psi^(m-l)(h+v),
    (h^kP)''''=sum_{j=0}^4 binomial(4,j) k!/(k-j)! h^(k-j)P^(4-j).

Initial splitting at h=v means each profile argument stays on one side of zero, with parity applied exactly. All nodes, split points and interval midpoints are dyadic. The nominal unvalidated mp.quad estimates only choose a requested error tolerance; correctness comes from summing the explicit interval remainders regardless of that choice. The code uses no eigenvalue computation in its final test: the witness vector is fixed and the quadratic form is enclosed directly.

Serialization of interval endpoints is conservatively widened by 10^-30 per ratio before the final quadratic form, vastly larger than 40-digit endpoint-rounding uncertainty and negligible compared with the resulting negative margin.

## Reproducibility and limits

Only original local Python code was executed, using already installed mpmath. No acquired code, package install, account change or repository write was used. The script is a computer-assisted interval certificate with elementary analytic tails, not a formal proof in a proof assistant. The foundations lane reviewed both the original midpoint design and the Simpson replacement.

A negative outcome rejects **this multiplicative sufficient condition**. It does not refute RH or positive definiteness of any M_n itself.

## Completed result

The run completed successfully in approximately 50 seconds. Its final rigorous interval (rounded outward here) is

    -48.494670 < sum_{j,k=0}^{11} c_j c_k g_4((j-k)/8) < -48.473700.

The foundations lane independently reconstructed the stored intervals at 50-digit interval precision, including the 10^-30 inflation, obtaining

    [-48.49466993383626546035997384877806474008930189360008684,
     -48.47370041951539087331123432591041677305682448750326696].

Thus g_4 is not positive definite. The full-theta multiplicative ratio-propagation sufficient condition is false. This conclusion includes the complete theta tail via (T) and the complete integration tail via (I); it is not a statement about a naive finite theta truncation.
