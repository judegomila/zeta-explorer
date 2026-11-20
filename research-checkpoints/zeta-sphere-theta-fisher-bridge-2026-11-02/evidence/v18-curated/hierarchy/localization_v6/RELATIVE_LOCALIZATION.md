# Relative localization: obstruction and a finite-resolution bridge

Scope: self-contained deductions from the strip Green identity in shift_v3/wedge_v5. No global theta sign is assumed or proved. Spectral variable is t (the kernel transform uses exp(2itv)). Write

    W_a(t) = B_a(t) - K_a(t),
    B_a = P_A^upper(a,.) * W_A,
    K_a = 4 integral_0^A G_A(a,b,.) * W_1(b,.) db.

Here A≥1/2, 0<a<A, W_a=Re(F'(a+it) conjugate(F(a+it))), F(w)=xi(1/2+w), and W_1 denotes the shear of the derivative profile. The boundary W_A is nonnegative unconditionally. B_a is strictly positive: its Poisson kernel is positive and W_A is not identically zero. All spectra are continuous and integrable.

## 1. What weaker testing can and cannot mean

For all finite translation-node tests, B−K being positive definite is equivalent to nonnegativity of its spectral measure. In this setting this is precisely K_a(t)≤B_a(t) for every t. Indeed the quadratic forms integrate |sum c_j exp(2itv_j)|² against the signed measure. Positivity for every such test is the defining positive-definiteness condition; uniqueness of the Fourier measure gives the equivalence. Thus a global Carleson/embedding inequality on *all* these tests is not weaker than pointwise spectral domination. A genuinely weaker hypothesis must add structure (regularity, restricted bandwidth, bounded cardinality, or a quantitative localization error).

There is a useful distinction between signed and positive costs at finite Gram level. On R=range(B) and N=ker(B), write B=diag(B_R,0), B_R>0. For Hermitian K and q real, set D=−K_NN. Then

    qB−K≥0

is equivalent to D≥0, range(K_NR)⊂range(D), and

    qB_R−K_RR−K_RN D^dagger K_NR≥0.

This follows by completing the block quadratic form, including the nullspace condition. If K≥0, then K_NN must vanish and positivity forces K_NR=0; only in that special case is ker(B)⊂ker(K) necessary and sufficient together with the usual relative norm bound. The Green cost is signed, so the more general Schur condition is the appropriate one. For the full theta spectral problem B_a(t)>0 at finite t, but its inverse is unbounded at infinity; absence of a literal nullspace is not uniform coercivity.

## 2. A strict constant relative contraction is impossible for A>1/2

**Proposition.** Fix A>1/2 and 0<a≤1/2. Then

    W_a(t)/B_a(t) -> 0, and K_a(t)/B_a(t) -> 1

as |t|→infinity. Consequently no q<1 can satisfy K_a≤q B_a globally, even if the desired nonnegative sign of W_a happens to hold.

Proof. Put sigma_A=1/2+A>1. Stirling in xi(s)=s(s−1)pi^(−s/2)Gamma(s/2)zeta(s)/2 gives

    |xi(sigma_A+it)|² asymp exp(−pi|t|/2)|t|^(sigma_A+3).

Absolute Euler convergence bounds |zeta| above and below by positive constants, and bounds zeta'/zeta. Therefore

    Re(xi'/xi)(sigma_A+it) = (1/2)log|t|+O_A(1),
    W_A(t) asymp exp(−pi|t|/2)|t|^(7/2+A)log|t|.

Integrating the positive Poisson convolution over |s−t|≤1 yields

    B_a(t) >= c_(a,A) exp(−pi|t|/2)|t|^(7/2+A)log|t|

for sufficiently large |t|. On the fixed interior line sigma=1/2+a≤1, classical convexity and Cauchy's derivative estimate in a small fixed disk yield, for every epsilon>0,

    |xi(sigma+it) xi'(sigma+it)|
       <<_(a,epsilon) exp(−pi|t|/2)|t|^(4+epsilon).

For completeness, Stirling contributes |t|^(sigma+3) to the product of the two gamma-polynomial factors; the zeta product is bounded by |t|^(1−sigma+epsilon), with logarithmic derivative-factor losses absorbed in epsilon. To bound zeta' use a disk radius smaller than the desired epsilon loss; at sigma=1 the same bound follows with epsilon loss. No reciprocal of interior zeta is used, so zeros cause no division issue. Choosing epsilon<A−1/2 proves the claim. Evenness handles negative height.

**Uniform strengthening, including a down to zero.** For fixed A>1/2 and every 0<epsilon<A−1/2,

    sup_(0<a≤1/2) |W_a(t)/B_a(t)|
       <<_(A,epsilon) |t|^(−(A−1/2−epsilon))/log|t|.

Indeed W_0(t)=0 by the functional symmetry and

    W_a(t)/a = integral_0^1 (|F′(sa+it)|²
                   + Re(F″(sa+it) conjugate(F(sa+it)))) ds.

Uniform convexity/Cauchy bounds through derivative order two on sigma∈[1/2,1] give |W_a|/a << exp(−pi|t|/2)|t|^(4+epsilon). For |u|≤1, the positive P_A^upper(a,u)/a has a continuous positive extension at a=0; its infimum over [0,1/2]×[−1,1] is positive because A>1/2. The preceding lower convolution bound therefore holds for B_a/a uniformly. This also shows that an a-dependent strict factor cannot stay bounded away from one uniformly in height. The strengthening was identified and independently checked by the foundations lane.

This proposition deliberately excludes A=1/2: the excess polynomial boundary exponent is lost there. It also does not exclude a height-dependent gap, a different boundary construction, or a non-strict q=1 estimate. It shows that a uniform strict gap is the wrong target for this specific A>1/2 transfer.

## 3. A genuinely usable averaged test with its missing derivative cost

For 0<a≤A/2,

    P(t)= sin(pi a/A)/(2A[cosh(pi t/A)+cos(pi a/A)])

satisfies |P'|≤(pi/A)P. Positivity of W_A gives

    |B_a'|≤(pi/A) B_a.

Let I=[t0−h,t0+h], r=K_a/B_a. Suppose |r'|≤L on I and

    integral_I K_a <= (1−delta) integral_I B_a.

Then

    r(t0) <= 1−delta + L d_B,
    d_B = integral_I |t−t0| B_a(t)dt / integral_I B_a(t)dt <= h.

The boundary log-Lipschitz bound improves the universal displacement bound to

    d_B <= h/(1−exp(−c h)) − 1/c,  c=pi/A,

which equals h/2+c h²/12+O(c³h⁴) for small c h. To prove it, set w(r)=B_a(t0+r)+B_a(t0−r) on [0,h]. Since w′≤c w, w(r)/exp(c r) is nonincreasing. The normalized density w is therefore stochastically dominated by the normalized exp(c r) density, whose first moment is the displayed quantity. The stochastic comparison follows directly by writing the covariance of an increasing function r and the decreasing function w(r)exp(−c r) as a double integral with nonpositive integrand.

Thus delta≥L d_B suffices for W_a(t0)≥0, and delta>L d_B gives a positive quantitative margin. Proof: r(t0)≤r(t)+L|t−t0|, multiply by B_a and integrate. This criterion is not simply the unknown pointwise sign: it separates an averaged cancellation estimate and a derivative/localization cost. Neither needed arithmetic bound is claimed globally.

One sufficient way to estimate the cost, without dividing by a potentially zero W, is

    |r'| <= |K_a'|/B_a + (pi/A)|K_a|/B_a.

On each fixed compact height window the construction extends continuously to a=0 after normalizing B and K by a: P_A^upper(a,t)/a tends to pi/(4A²) sech²(pi t/(2A)), and the exact Green limit in shift_v3 supplies K/a. The limiting normalized B is strictly positive. Dominated differentiation therefore gives a finite local bound for r and r′ uniformly on 0≤a≤a0<A/2. This is an existence statement on a fixed compact window, not an effective all-height arithmetic bound.

The second term is controlled only by a relative, not absolute, estimate. Small absolute Epstein tails or total mass do not supply it at high height. Direct/dual cancellation should be retained when estimating K and K' jointly. Taking absolute values before grouping loses the very relative gain required here.

## 4. Fixed-resolution averages miss explicit off-line zeros

For f(z)=z²+b² (b>0), the shear is

    W_a(t)=2a(a²+t²−b²).

At any 0<a<b it is negative at t=0. Yet every radius-R interval average is

    (1/(2R)) integral_(t−R)^(t+R) W_a(s)ds
       =2a(a²+t²−b²+R²/3),

which is nonnegative for every center t whenever R²≥3(b²−a²). Hence positivity of all averages at a fixed resolution, or at all coarser resolutions, cannot propagate the desired sign. The boundary A>b is positive and the exact Green pieces are

    B_a(t)=2a(A²+t²−b²)+(2/3)a(A²−a²),
    K_a(t)=(8/3)a(A²−a²).

These formulas follow either by integrating the Poisson second moment or by checking the strip PDE and boundary data. They show the failure in a genuine analytic entire-function shear, not just an arbitrary signed spectrum.

## 5. Actual-theta evidence and remaining target

The previously validated theta total-mass ratio at A=1/2 is

    lim_(a down to 0) integral K_a / integral B_a
      in (0.0116716759, 0.0116716768).

This is a useful integrated cancellation but neither a local mean certificate nor a relative operator bound. The full-theta low-height rectangle and near-real-zero certificates in foundations/EXPLICIT_COHERENT_RECTANGLE.md and modular_v2/ZERO_WINDOW_CERTIFICATE.md establish local sign independently; they do not bound the unbounded-height derivative cost above. No new numerical interval certificate is asserted in this note.

A concrete next arithmetic target is a family of window inequalities

    integral_I K_a <= (1−delta_I) integral_I B_a,
    sup_I |(K_a/B_a)'| * d_B <= delta_I,

with admissible windows covering the unresolved heights and with endpoint a→0 controlled after division by a. The A>1/2 proposition forces admissible gaps to shrink with height. The A=1/2 endpoint may avoid that particular polynomial mismatch, but still requires an estimate of grouped third-shift forcing relative to boundary energy. No such global estimate has been proved here.

## Primary reference for the classical analytic input

Daodao Yang, *Extreme values of derivatives of the Riemann zeta function*, Mathematika 68 (2022), 486–510, Lemma 2, https://pmc.ncbi.nlm.nih.gov/articles/PMC10234456/ (DOI 10.1112/mtk.12130), explicitly records the uniform derivative convexity bound used in §2 and its Cauchy-formula proof. Only this classical lemma is used; none of the paper's extreme-value results is imported. The conclusion of §2 is our deduction from that bound, Stirling, absolute Euler convergence, and the exact previously checked Green identity.
