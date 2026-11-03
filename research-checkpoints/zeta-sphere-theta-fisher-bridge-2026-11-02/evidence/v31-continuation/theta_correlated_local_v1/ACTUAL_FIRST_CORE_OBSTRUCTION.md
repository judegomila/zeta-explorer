# Actual-theta obstruction to termwise core positivity

Owned interval certificate independently replayed and analytically reviewed PASS. This tests a proposed mechanism; it is not a new next-pivot certificate.

For N=1, the actual prefix polynomial is P_1(x)=x-alpha, alpha=mu_1/mu_0. The previously certified OLD contacts give
 alpha in[47/4-11/200,47/4+11/200].
To verify this without borrowing the next pivot, the owned checker reads only G00 and G01 from the existing interval JSON in basis p0=1,p2=(k²-47)/66. It checks G00>3/100 and |G01|<1/10000. The known variable conversion gives alpha=(47+66G01/G00)/4. No G11, next norm, or determinant reserve is used.

The first arithmetic term has d(1)=1,ell_2(1)=0, so
 U_1=[D^4/16+(alpha/2)D²+alpha²]C_f(0).
The owned script certify_first_core_sign.py integrates its exact one-orbit kernel using Arb160-bit interval rectangles on0<=w<=3, with12000 cells, including both w signs. It uses the exact Q_j^beta polynomial recurrence and the whole alpha interval above. The remaining |w|>=3 tail is bounded using the reviewed global single-orbit derivative constants and positive-argument tail constants; the resulting error is less than8e-262.

The certified result is U_1<-19. The output upper endpoint is below -19.52. This is an actual-theta, actual-prefix negative arithmetic contribution. It rules out the claim that the finite core becomes termwise nonnegative merely because the prefix roots are positive or the differential coefficients are nonnegative. It also rules out monotonic increase of arithmetic partial sums starting from zero at k=0.

It does NOT contradict the proved eventual positive arithmetic tail, monotonicity after the explicit cutoff, or positivity of the full next pivot. The low-divisor terms must cancel favorably in aggregate; that is precisely the outstanding mechanism. Only existing old-contact evidence is reused, not the already-known next-pivot result. No acquired code was executed.

Artifacts: certify_first_core_sign.py and first_core_sign_12000.json. The displayed default Arb interval string is coarse; the separately recorded directed upper endpoint and the live inequality check are the actual certificate.
