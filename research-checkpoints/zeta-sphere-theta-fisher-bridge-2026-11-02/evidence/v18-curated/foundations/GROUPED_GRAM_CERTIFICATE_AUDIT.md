# Independent audit: specified three-node grouped Gram certificate

2 November 2026. Status: PASS at the mathematical/interval-implementation level; this is not a formal proof-assistant verification.

Reviewed `modular_epstein_v3/GROUPED_GRAM_CERTIFICATE.md`, both certificate scripts, their imported full-theta derivative enclosure, and stored interval data. This builds on the separately reviewed exact grouped Ewald construction, not on assumed positive definiteness.

## Checks and reconstruction

* Convention is exactly D(a)=[D_(a,3)(v_j-v_k)/a], G(a)=[C_a(v_j-v_k)/a], nodes (0,1/4,1/2). Thus off-diagonal lags are 1/4 and 1/2, with no autocorrelation factor-of-two substitution.
* Independently reconstructed the interior fourth derivative polynomial, axis recurrence p_next=(r-2y)p+2yp', and L_a coefficients. Axis prefactor 1/32 and interior prefactor 1/16 in the expanded normalized integrands are correct. Both direct/dual powers, including their logarithmic derivatives, are present.
* Falling-factorial differentiation in x, interval fourth-derivative enclosure and Simpson error d^5 sup|f''''|/2880 are correct. Rational exponents and dyadic subdivision avoid untracked node error. The 10^-30 serialization allowance is ample relative to precision.
* The axis 50-integral majorant is conservative: for y>=3, absolute-coefficient bounds give |p4|<88y^4, |p2|<.76y^4 for either r=0,1. With a=1/4 the L and differentiated-L terms and e^v<=e^.5 leave substantially less than the stated 50 after the factor 1/32. The n>=7 estimate 16000 sum n^6 e^(-3n^2)<10^-50 follows from its first term and the quoted ratio. For x>=32, monotonicity of y^4e^-y permits replacing y by 3x (axis) or 6x (interior). The displayed six-axis/nine-interior majorants integrate to less than 10^-24.
* Shift-moment Leibniz formula is correct through order four. Splitting at h=v resolves reflection parity. Full-theta derivative tails are retained. For h>=4, h^4 cosh(h) psi(h-v)psi(h+v) <=10^4 exp(14h-2pi e^(2h)), uniformly for the three nonnegative lags; its integral is far below 10^-3000.
* Independently reran both locally authored interval computations, without modifying their source results. Moment intervals and grouped intervals reproduce the recorded endpoints. Rerun files are in `foundations/grouped_gram_recheck/`.

## Uniform-shift deduction

Writing s=2ah gives s cosh(s)-sinh(s)=integral_0^s u sinh(u)du <=s^3 cosh(s)/3. Hence

0 <= partial_a(C_a(v)/a) <= (8a/3) M(v) < 1/625

for 0<a<=1/2 and these three lags. Distance from a=1/4 is at most 1/4, giving entry variation <1/2500. This normalized estimate remains valid as a decreases to zero; no absolute-error division by a is used.

The interval targets D0>.031, |D1|<.008, |D2|<.001 imply lambda_min(D(1/4))>.015 by Gershgorin (middle row is the limiting coarse bound). The previously audited epsilon_3<1/2500 gives ||E(a)||<3/2500. Three such norm allowances yield

lambda_min D(a)>57/5000,
||D(a)^(-1/2) E(a) D(a)^(-1/2)||<2/19.

Thus E(a) >= -(2/19)D(a), and independently lambda_min G(a)>63/5000. All constants and strict inequalities check.

## Scope

A constructive relative-remainder certificate for exactly one three-node family, uniform 0<a<=1/2, and all complex coefficient vectors on those nodes. It does not prove arbitrary-node positive definiteness, all Fourier-frequency positivity, or RH. The removable endpoint uses the already established exact closure and continuity, not separate divergent Epstein terms.
