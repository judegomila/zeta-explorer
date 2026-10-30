# Arithmetic curvature: exact dictionary, triangle cancellation, and no-go tests

30 October 2026. Focused local analytic audit of the mixed-curvature proposal in the user's other conversation (private history link omitted). No external files or earlier certificates are changed. This note gives exact identities and counterexamples to topology-only shortcuts, not an RH proof, a negative actual Weil mode, or a support extension beyond the accepted reflection-even range 1<lambda<=4. It assumes no closed semibounded global form in ordinary physical L2.

## 1. Source-normalized dictionary, including the poles

Use the actual normalization from `frequency_sensitive_bound/FREQUENCY_BLOCK_SUPPORT_BOUND.md` sections 1 and 3, checked against `rh_attack_cycle_20261028/signed_prime_gamma/CENTERED_PRIME_ERROR_AND_VARIATION_OBSTRUCTION.md` and `rh_paper_recovery_20261028/source/sections/03-landau.tex`.

Let W=2 log lambda, I_W=[-W/2,W/2], extend f by zero, and set

    R_f(r)=integral_R conjugate(f(x)) f(x+r) dx,
    A[f]=integral_R a(t)|fhat(t)|^2 dt,
    a(t)=Re digamma(5/4+it/2)-log pi,

with the unitary Fourier transform. Then the exact supported form is

    q_W[f]=A[f]-B_W[f],
    B_W[f]=2 Re integral_0^W R_f(r) dnu(r),
    dnu(r)=sum_(n>=2) Lambda(n)/sqrt(n) delta_(log n)(dr)
             -exp(r/2) dr.                                  (1)

On a fixed compact interval this nu is a finite signed measure. It is NOT the distribution called `nu` in `rh_attack_cycle_20261029/signed_transfer/ACTUAL_SIGNED_GENERATOR_AND_TAIL.md`, which has opposite arithmetic sign and also contains a singular gamma density.

There is no missing pole term in (1). If m(t)=Re digamma(1/4+it/2)-log pi, then the recurrence gives

    a(t)-m(t)=1/(t^2+1/4).

The convolution kernel for this multiplier is exp(-|r|/2), so A_5/4 plus the growing continuum exp(|r|/2) equals A_1/4 plus the original rank-two kernel 2 cosh(r/2). Pairing the raw 1/4 gamma with only the growing continuum would be wrong.

The canonical discrepancy primitive is

    D(r)=sum_(n>=2) Lambda(n)/sqrt(n) (r-log n)_+
              -4(exp(r/2)-1-r/2),        r>=0.

Thus D(0)=D'(0+)=0 and D''=nu distributionally on r>0. At a prime-power seam D' jumps upward. D is continuous and locally Lipschitz. Endpoint prime powers do not change D(W) or (1), since their weight and R_f(W) are zero. R_f(W)=0 holds for any L2 function supported in I_W; its support overlap at shift W has Lebesgue measure zero.

Give C_W=[0,W]x(R/2pi Z) the metric

    g_D=exp(-2D(r))(dr^2+dtheta^2).

The two-dimensional conformal identity is K_g dA_g=-Delta u dr dtheta for g=exp(2u)g_flat. Taking u=-D gives the exact curvature measure

    K_g dA_g=dnu(r) dtheta.                                (2)

For smooth conformal metrics this is the classical formula; see Kazdan–Warner, *Curvature functions for compact 2-manifolds*, Annals of Mathematics (1974), equation (1.3), [author-hosted primary source](https://www2.math.upenn.edu/~kazdan/642S16/KW-Gauss1-Annals1974.pdf). For this locally Lipschitz D, (2) means the distributional curvature measure. Mollifying D on a slightly larger compact interval yields the same identity in the weak limit. No claim of a globally smooth, complete, or uniformly nondegenerate surface is needed.

In particular

    B_W[f]=(1/pi) Re integral_(C_W) R_f(r) K_g dA_g.          (3)

The factor 1/pi includes the circle's length 2pi and the factor 2 in (1).

### Even extension is harmless only with its seam counted

Let D_e(r)=D(|r|). In general an even extension contributes 2D'(0+)delta_0 to its second derivative. Here that atom is exactly zero. On the doubled cylinder [-W,W]xS1, nu_e is nu reflected to negative r, and

    B_W[f]=(1/(2pi)) integral R_f(r) K_g dA_g.

Here R_f(-r)=conjugate(R_f(r)); if f is reflection-even, R_f is real and even. Adding ar+b to D on r>=0 leaves the interior curvature measure unchanged but, after even extension, adds 2a delta_0. One may not silently change that gauge. The canonical two initial conditions fix it.

## 2. What Gauss–Bonnet actually says, and the exact triangle link

First choose W away from a prime-power logarithm. The full cylinder has Euler characteristic zero, and

    integral_(C_W) K_g dA_g =2pi[D'(W)-D'(0)],
    integral_(boundary C_W) k_g ds_g=-2pi[D'(W)-D'(0)].       (4)

The second line exactly cancels the first. A seam exactly at r=W must be allocated consistently: interior curvature uses D'(W-); counting a boundary atom while using the opposite one-sided derivative manufactures a spurious term. The Weil pairing (1) is insensitive to this ambiguity because R_f(W)=0.

There is an especially direct connection to the user's triangle idea. Lift theta to the real line and take the coordinate right triangle

    T_W={(r,theta): 0<=r<=W, 0<=theta<=W-r}.

By (2),

    integral_(T_W) K_g dA_g
      =integral_0^W (W-r)dnu(r)=D(W).                       (5)

But these are coordinate edges, NOT three geodesic edges. Conformality preserves their corner angles pi/2, pi/4, pi/4, so their angle sum is exactly pi for every D. The two coordinate-axis edges have zero geodesic curvature: theta=0 is a geodesic and D'(0)=0 makes r=0 geodesic. The sloping edge has

    integral_(sloping edge) k_g ds_g
       =-integral_0^W D'(r)dr=-D(W).                       (6)

For example, use outward Euclidean normal (1,1)/sqrt(2), u=-D, and the conformal relation k_g ds_g=(k_flat+partial_n u)ds_flat. Its normal term is -D'(r)dr. Thus Gauss–Bonnet on this triangle is exactly D(W)-D(W)=0 after the exterior corner angles have supplied 2pi. Its angle sum gives no bound on D(W).

Replacing the sloping edge by a geodesic changes the region and its weighted arithmetic content. A controlled comparison between those regions/edges would itself be a new estimate; it is not supplied by Gauss–Bonnet. A finite cylinder also cannot simply be declared an arithmetic torus: periodic gluing requires compatible conformal factor and derivative, or introduces new seams/counterterms.

## 3. Explicit smooth counterexamples to topology-only weighted control

These are deliberately NONARITHMETIC models. They refute a deduction based only on zero total curvature, mixed signs, or torus topology. They do not refute a theorem using the actual locations and weights of prime powers.

### 3.1 The weight can be an actual even zero-extension autocorrelation

Fix W>0, put k=2pi/W and, for a>0, let

    D_a(r)=a(1-cos(kr))/k^2,
    D_a''(r)=a cos(kr).

D_a and all its derivatives match at 0,W. In particular D_a=D_a'=0 at both ends. This is a smooth periodic conformal factor; total curvature and cylinder boundary geodesic curvature both vanish. It can be glued to a smooth torus.

Use the unit reflection-even physical box mode, with zero extension rather than periodic extension,

    f(x)=sqrt(2/W) cos(2pi x/W) 1_(|x|<=W/2).

For 0<=r<=W a direct overlap integration gives

    R_f(r)=(1-r/W)cos(kr)-sin(kr)/(kW),
    integral_0^W R_f(r)cos(kr)dr=W/4.

Consequently its exact weighted curvature charge is

    2 integral_0^W R_f(r)D_a''(r)dr=aW/2.                  (7)

This is arbitrarily large despite exactly zero total curvature and zero boundary curvature. For the same fixed logarithmic gamma form A, the artificial quadratic form A[f]-aW/2 tends to minus infinity. A[f] is finite: the zero-extended box mode has Fourier decay O(1/|t|), sufficient for the logarithmic weight. If a smooth compact test is preferred, approximate this f by smooth even compact functions in L2. The smooth-kernel curvature charge is L2-continuous and remains strictly positive for one sufficiently close fixed approximation; its finite A then stays fixed as a grows.

The metric can be glued to a torus, but the original autocorrelation is a zero-extension weight on the chosen cylinder/fundamental domain. No periodic wraparound has been substituted for the actual physical test. For a completely smooth periodic weight on a torus one may instead take D_a=-a cos r and the normalized periodic mode f(x)=cos x/sqrt(pi), whose periodic autocorrelation is cos r. Its weighted curvature mass is also positive and linear in a while the total curvature is zero.

### 3.2 Even a natural local curvature Schrödinger energy can be negative

On the smooth torus r,theta modulo 2pi take D_a=a(1-cos r), so K_g dA_g=a cos r dr dtheta and integral K_g dA_g=0. For the smooth scalar field u=1+epsilon cos r,

    integral |grad_g u|^2 dA_g =2pi^2 epsilon^2,
    integral K_g |u|^2 dA_g =4pi^2 a epsilon.

Thus for any nonzero real c and a>0,

    integral |grad_g u|^2 dA_g-c integral K_g|u|^2 dA_g
       =2pi^2 epsilon^2-4pi^2 ca epsilon
       =-2pi^2 c^2 a^2 <0     when epsilon=ca.             (8)

The smooth surface L2 norm is finite and positive, so normalization cannot change this sign. Therefore zero total curvature does not imply positivity even for this much simpler curvature-coupled local operator. This is not an identification of that operator with the Weil form.

## 4. The sufficient curvature bound, with the correct norm

The sought uniform-M floor on cofinal supports is exactly the one-sided inequality

    (1/pi) Re integral_(C_W) R_f K_g dA_g
       <= A[f]+M ||f||_(L2(dx))^2                          (9)

for every admissible reflection-even f, with a single finite M independent of those W. This is equivalent to q_W>=-M||.||^2, not an easier geometric consequence of (2).

One stronger sufficient target is, for constants 0<=theta<=1 and C independent of W,

    B_W[f] <= theta[A[f]-a(0)||f||^2]+C||f||^2.             (10)

Since a(t)>=a(0), this gives q_W[f]>=[a(0)-C]||f||^2. It must control the SIGNED charge; bounding total absolute curvature or absolute derivatives can lose the cancellation. The existing centered-prime source proves an actual high-carrier obstruction to absorbing its absolute derivative budget into logarithmic gamma, even at one fixed support.

A floor with the same M on cofinal supports extends to every finite smaller support by exact norm-preserving zero extension. The unit constant physical box mode already makes the target strong:

    R_0(r)=1-r/W,
    B_W[f_0]=2D(W)/W,
    q_W[f_0]=A_00(W)-2D(W)/W.                              (11)

The audited source bounds A_00(W) above uniformly for W>=1. Hence (9) would force a linear upper bound on D(W), not merely small total curvature D'(W). The paper's Landau argument already identifies polynomial one-sided upper control of this D as RH-strength. This observation diagnoses where the arithmetic difficulty reappears; it supplies no such estimate.

### Endpoint terms cannot be removed by a second integration by parts

For compact smooth tests strictly inside I_W,

    integral_0^W R_f dnu = integral_0^W D(r)R_f''(r)dr,

because R_f,R_f' vanish near W and D(0)=D'(0)=0. For a smooth correlation on [0,W] with only R_f(W)=0, the correct formula is

    integral_0^W R_f dnu
       =-R_f'(W-)D(W)+integral_0^W D(r)R_f''(r)dr.          (12)

For the constant box mode the entire charge D(W)/W is this boundary term. Dropping it falsely makes the arithmetic contribution zero. General logarithmic-form vectors need not possess these derivative traces; (12) is not asserted for that whole domain.

## 5. A metric is not yet an isometric operator realization

There are three separate issues.

**Autocorrelation is not a linear state map.** In (3), r is a separation coordinate, while f lives in the physical x coordinate. The map f->R_f is quadratic, R_f is positive-definite but not pointwise nonnegative, and R_f(0)=||f||^2. A Dirichlet energy of R_f would be quartic in f. No linear Hilbert-space identification has been built merely by recognizing the curvature measure.

**The obvious surface L2 norm is not physical L2.** On an auxiliary cylinder with physical coordinate x and factor D_e(x), lifting f(x)/sqrt(2pi) gives

    ||f/sqrt(2pi)||_(L2(dA_g))^2
       =integral exp(-2D_e(x))|f(x)|^2 dx,

not the actual norm. At fixed W these norms are comparable, but the comparison constants depend on the extrema of D_e and need not be uniform as W grows. Moreover D->D+b leaves KdA unchanged while rescaling the surface L2 norm by exp(-2b). Curvature measure alone therefore cannot select the norm required in (9).

An isometry CAN be explicitly supplied at fixed support:

    (U_D f)(x,theta)=exp(D_e(x))f(x)/sqrt(2pi).

It maps physical L2(dx) onto the theta-independent surface sector. But it does not turn the actual nonlocal convolution into multiplication by curvature. On that sector a translation term becomes

    (U_D B U_D^-1 F)(x)
       =integral exp(D_e(x)-D_e(x+r))F(x+r)dnu_e(r),

with zero extension and all arithmetic translation locations retained. The gamma multiplier must likewise be conjugated. In contrast, local curvature multiplication has charge integral exp(2D_e(x))D_e''(x)|f(x)|^2 dx. These are different operators. The fixed-support isometry is legitimate but does not establish the useful geometric coercivity theorem.

**Ordinary two-dimensional Dirichlet energy ignores this conformal factor.** Directly,

    integral |grad_g F|^2 dA_g
       =integral (|partial_r F|^2+|partial_theta F|^2) dr dtheta.

Thus changing D while holding the scalar field fixed does not place the prime imbalance into its Dirichlet energy. If the norm-preserving lift U_D is used instead, its theta-independent energy becomes

    integral exp(2D_e(x))|f'(x)+D_e'(x)f(x)|^2 dx.

On smooth fixed patches this has quadratic high-frequency growth, whereas the actual gamma energy has logarithmic growth. It is neither the actual A nor A plus a bounded correction. A bound by this larger stabilizing energy would not automatically imply (9). On a fixed conformal chart the harmonic equation is likewise unchanged up to the conformal scalar factor; merely changing this metric does not create the missing signed Dirichlet-to-Neumann mechanism.

Finally, the project's audited global ordinary-L2 nonclosability result rules out positing a closed semibounded global scalar form with unchanged compact-core Weil values as harmless infrastructure. The present finite-cylinder construction never makes that assumption.

## 6. Independent check: no direct scalar Markovian trace realization

This independently checks the companion worker's claim, using the already recorded kernel in `rh_attack_cycle_20261029/fluid_criticality/LOCALIZED_SIGN_GAUGE_OBSTRUCTION.md`.

Away from prime-power shifts the actual off-diagonal smooth kernel is

    k(r)=exp(r/2)-exp(-5r/2)/(1-exp(-2r)),  r>0.

It is positive precisely when exp(3r)-exp(r)>1. The latter function is strictly increasing for r>0 and is positive above the required threshold already at r=.38. A cubic lower Taylor bound on exp(1.14), minus the upper bound exp(.38)<1/(1-.38), proves this with a strictly positive rational margin.

At lambda=4 choose nonzero nonnegative smooth even bump pairs u,v centered at +/-.4 and +/-.8, with support radius .005. They are disjoint and lie strictly within [-log4,log4]. Every cross-support distance lies in [.39,.41] or [1.19,1.21]. These avoid all prime-power logarithms: the first is below log2, and the second is strictly between log3 and log4 (elementary bounds log2>2/3, log3<11/10, log4>4/3 suffice). Thus all prime cross entries vanish and

    q_W(u,v)=double-integral k(|x-y|)u(x)v(y)dxdy >0.        (13)

A scalar Markovian trace form must satisfy E(|f|)<=E(f). For disjoint nonnegative u,v, apply this to f=u-v, whose absolute value is u+v; polarization forces E(u,v)<=0. Trace minimization of a scalar diffusion energy preserves the same inequality: absolute value does not increase bulk energy and commutes with the boundary trace. Equation (13) contradicts such an identification. Adding any diagonal M||.||^2 or local scalar boundary potential does not change (13).

**Scope:** this excludes a direct scalar Markovian trace model under a positivity/disjointness-preserving boundary identification, including the positive multiplicative isometry U_D above. It does NOT exclude an arbitrary nonlocal unitary change of state variables, coupled fields, non-Markovian bulks, or signed/nonlocal boundary terms. Such models still need exact measures, norms, domains, and a new lower bound. The contradiction is not a negative Weil direction; it is compatible with the already certified even positivity at lambda=4.

## 7. Established result and remaining blocker

Established here: the chat's curvature dictionary with correct gamma/pole normalization; origin and outer-seam bookkeeping; an exact discrepancy-as-triangle-curvature identity whose missing edge term is explicit; smooth zero-total-curvature counterexamples including actual zero-extension autocorrelation weights; the precise norm-preserving lift and why it does not localize the operator; and an independently checked scalar Markovian-trace obstruction.

Still missing: an arithmetic, support-uniform signed weighted estimate such as (9) or (10), or an exact alternative bulk realization that proves it without assuming a forbidden global closure. No new lower constant, support endpoint, or RH conclusion follows. The model remains a faithful geometric encoding, not a new coercive mechanism.

`check_curvature_identities.py` supplies exact symbolic and rational regression checks. It checks the displayed identities, not the absent uniform arithmetic theorem. Source hashes are recorded separately.
