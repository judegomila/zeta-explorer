# Good-height moment control and the cost of bridging exceptional corridors

18 October 2026. New bounded follow-up. Independently checked in an internal mathematical review. This proves an elementary density-one arithmetic statement and identifies a missing local bridge; it proves no all-height curve.

## 1. An explicit translated mean-square estimate for the actual coefficients

Fix U>=16, 2<=Q<=sqrt(U), s0=417/500, h=1/8, and real
S(t)=sum_(p<=Q) a_p cos(t log p), a_p=(1-p^(-h))p^(-s0).
Write A2=sum a_p^2 and Z=2^(-2s0)+2^(1-2s0)/(2s0-1), so A2<=Z by the integral test. For any real starting point V and any length L>0, the complex polynomial D(t)=sum a_p p^(-it) satisfies

integral_V^(V+L) S(t)^2 dt <= integral_V^(V+L)|D(t)|^2dt
 <= [L+4Q(1+log Q)] A2.                                  (1)

Proof: the diagonal is L A2. For m<n<=Q, integration of the exponential gives an absolute bound 2/log(n/m). Pairing the two conjugate off-diagonal terms gives at most 4|a_m a_n|/log(n/m), where coefficients at nonprimes are zero. Since log(n/m)>=(n-m)/n, the sum is bounded by 4Q sum_(d<Q) d^(-1) sum_m |a_m a_(m+d)|. Cauchy bounds each inner sum by A2, and the harmonic sum is at most 1+log Q. This argument is uniform in the starting height; it is an ordinary interval average, not a pointwise estimate.

For L=U and Q<=sqrt U, 4Q(1+log Q)<=3U when U>=16. Indeed 4(1+log U/2)/sqrt U decreases for U>1 and is less than3 at16. Thus (1)<=4U Z.

## 2. Full Poisson average preserves this density-one bound

For a fixed x>0 define
J_x(T)=integral_R S(u)^2 x/[pi(x^2+(u-T)^2)] du.
Tonelli and the translation-uniform estimate (1) give

integral_U^(2U) J_x(T)dT <=4U Z.                           (2)

No carrier tail is truncated. If x=x(T) belongs to [x_minus,x_plus] with x_minus>0, the kernel is at most (x_plus/x_minus) times the kernel at x_minus. Hence the right side of (2) becomes 4U Z x_plus/x_minus.

For any epsilon>0, outside a measurable subset of [U,2U] of measure at most

4U Z (x_plus/x_minus)/(epsilon^2 log^2 U),                 (3)

we have J_(x(T))(T)<=epsilon^2 log^2 U. At each such carrier,
|E_P S|<=epsilon log U and Var_P S<=epsilon^2 log^2 U.
More directly, since L_Q=-S+R and |R|<=C(s0),

E_P(c+L_Q)_+ <= max(c+C(s0),0)+epsilon log U.              (4)

This follows from the 1-Lipschitz property of positive part and Cauchy. Thus a positive finite-rectangle margin greater than the last error gives a certificate at these good carriers, PROVIDED all the original boundary and analyticity inputs are verified there. This is an arithmetic density-one implication, not an unconditional zero-free theorem: the boundary inputs and a quantitative margin have not been newly proved in this note. Q is fixed within each dyadic slab; this is permitted when choosing a slabwise cutoff. A variable-cutoff supremum is not supplied by (2).

## 3. Why sparse exceptional heights do not automatically form a bridge

For the same Poisson measure, a centered exceptional interval of length M has exact mass

P_x([T-M/2,T+M/2])=(2/pi) arctan(M/(2x)).                   (5)

Among measurable sets of a fixed finite length M, this is the largest possible mass, because the kernel decreases with distance from T. Consequently, even a set of vanishing relative density M/U may carry almost all the relevant harmonic mass when M>>x. In particular a unit-length exceptional interval is consistent with (3) for large U, while x in the original curve geometry is bounded and small. A global measure bound cannot rule out such a cluster.

Suppose a valid clipped-integrand majorant is K_good outside an exceptional set E and K_bad>=K_good on E. The only direct two-level bound is
E_P integrand <= K_good+(K_bad-K_good)P_x(E).
To fit an additional margin delta>0 one needs
P_x(E)<delta/(K_bad-K_good),                              (6)
with the zero-cost case handled separately. A total-length bound guarantees this through (5) only if
M<2x tan[pi delta/(2(K_bad-K_good))]
when 0<delta/(K_bad-K_good)<1. The estimate (3) is much larger than this fixed-width scale. Alternatively one needs an actual local anti-clustering or amplitude-weighted estimate at every carrier; that is additional arithmetic information.

Analytic continuation alone does not preserve nonvanishing across a missing corridor. To see the precise logical limitation, on any bounded real strip |Re(s-z0)|<=W the entire function
f(s)=1-exp((s-z0)^2)
has a zero at z0, while |f(s)-1|<=exp(W^2-R^2) whenever |Im(s-z0)|>=R. Thus it can be arbitrarily close to1 on both distant horizontal corridors and still have a zero between them. This is an analytic counterexample to the continuation shortcut only, not a model of zeta or the actual prime sum. A valid bridge needs a closed-contour bound or a controlled zero count in the intervening region. Good strips whose union actually covers a target do certify it; disconnected good strips do not certify their gaps.

## 4. Primary-source large-values comparison

Guth and Maynard, New large value estimates for Dirichlet polynomials, arXiv:2405.20552v2, Theorem1.1, bounds the number of1-separated large values by
T^(o(1))[N^2 V^(-2)+N^(18/5)V^(-4)+T N^(12/5)V^(-4)].
Theorem1.2 gives N(sigma,T)<=T^[15(1-sigma)/(3+5sigma)+o(1)].
Source: https://arxiv.org/pdf/2405.20552 (printed pages1--2, inspected18October2026).
These are frequency/counting estimates, with asymptotic constants. They do not state that the exceptional set is empty, provide the local harmonic condition (6), or supply an effective onset for this certificate. At sigma=7/8 the displayed zero-density exponent is15/59>0, so this bound still permits isolated offending zeros. No claim is made that this is the strongest density estimate at that sigma.

The ordinary mean-square calculation already supplies usable good-height control for this exact fixed polynomial. Stronger large-values information may improve the size of its exceptional set, but an all-height completion still needs a valid local bridge or a separate certificate for every exceptional corridor. That is the precise remaining cost of this route.
