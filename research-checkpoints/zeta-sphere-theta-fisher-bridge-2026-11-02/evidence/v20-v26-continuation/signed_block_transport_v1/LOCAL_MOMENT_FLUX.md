# Local mixed-moment hierarchy with exact telescoping boundary flux

Status: new exact identity awaiting independent review. No regional PSD assumption.

For a FIXED interval I=[l,r], let
 M^I_(k,q)=integral_I u^(2q+1)(g_lambda^(k))² du,
 m=2q+1, g_j=D^j g_lambda.
The exact parameter derivative is
 dot M^I_(k,q)=2M^I_(k,q+1)-2k(k+2q+1)M^I_(k-1,q)
              +2q(2q+1)k(k-1)M^I_(k-2,q-1)
              +[B_(k,q)(u)]_l^r,
where
 B_(k,q)(u)=2k u^(m+1)g_(k-1)²
          +2k(k-1)u^m g_(k-1)g_(k-2)
          -k(k-1)m u^(m-1)g_(k-2)².
Terms with zero prefactors are omitted before evaluating negative indices. In particular q=0 does NOT require M_(k-2,-1).

Proof: differentiate using dot g_k=u²g_k+2ku g_(k-1)+k(k-1)g_(k-2). The two integrations by parts are
 integral_I u^(m+1)g_k g_(k-1)
   =[u^(m+1)g_(k-1)²]/2 -(m+1)M^I_(k-1,q)/2,
 integral_I u^m g_k g_(k-2)
   =[u^m g_(k-1)g_(k-2)-(m/2)u^(m-1)g_(k-2)²]
     -M^I_(k-1,q)+m(m-1)M^I_(k-2,q-1)/2.
Combining coefficients gives the displayed recurrence.

For a paired radial block [-b,-a] union[a,b], define Phi_(k,q)(h)=B_(k,q)(h)-B_(k,q)(-h). The local boundary contribution is Phi(b)-Phi(a). Every interior boundary cancels EXACTLY when adjacent blocks are summed. Phi(0)=0 and the full-theta super-exponential tails make Phi(infinity)=0. Thus the full-line hierarchy is recovered without separate absolute-value payments.

This is degree-uniform algebra: it never raises k, and all boundary profiles involve only k-1,k-2. It is not a degree-uniform inequality for the block means. The theta-specific input is supplied through the actual full profile, its Poisson/reflection identity and complete-orbit evaluations; arbitrary local positivity is never asserted.

For moving boundaries a(lambda),b(lambda), retain the Reynolds correction [boundary_velocity * u^(2q+1)g_k²] with the appropriate oriented endpoints. One may not silently move blocks with the evolving saddle while dropping this signed flux.
