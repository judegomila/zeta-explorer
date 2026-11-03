# Exact graded spatial-moment transport without raising jet order

For g_lambda(u)=e^{au+lambda u²}psi(u), define unnormalized signed mixed moments
 M_{k,r}(lambda)=integral_R u^{2r+1}[g_lambda^(k)(u)]²du,
 k,r nonnegative integers. These are finite for the full theta profile at any finite lambda; no sign is presumed. The Fourier bridge even moment2k is pi/2 times M_{k,0}.

Leibniz gives
 partial_lambda g^(k)=u²g^(k)+2ku g^(k-1)+k(k-1)g^(k-2).
With m=2r+1, integrate by parts:
 integral u^(m+1)g^(k)g^(k-1)=-(m+1)/2 M_{k-1,r},
 integral u^m g^(k)g^(k-2)=-M_{k-1,r}+m(m-1)/2 M_{k-2,r-1}.
Boundary terms vanish by full-theta super-exponential decay. Therefore
 partial_lambda M_{k,r}=2M_{k,r+1}
 -2k(k+2r+1)M_{k-1,r}
 +2r(2r+1)k(k-1)M_{k-2,r-1}.
Terms with zero prefactors are omitted; no negative-index moment is needed.

In particular M_{k,0}'=2M_{k,1}-2k(k+1)M_{k-1,0}. This exposes the exact signed lower-rung compensation rather than throwing it away.

Repeated lambda differentiation NEVER increases k. A midpoint lambda Taylor model at finite degree requires higher SPATIAL powers r, not arbitrarily higher differentiated theta jets. This is useful for rigorous parameter transport and separates a concrete theta-tail moment problem from the derivative-order bottleneck. It does not close the all-degree hierarchy: uniform comparison of the raised spatial moments against the actual residual/lower-rung reserve remains unproved.
