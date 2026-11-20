# Independent scalar recurrence audit

PASS, 2026-11-03. Separately reviewed after v28; not part of that immutable snapshot.

For real eta, the zero-tail Gram has entries L[(x-eta)^2 x^(i+j)]. Expanding gives the stated three moments. Its highest entry has coefficient one on m_(2N), so knowing only the lower original Gram does not justify positivity or inversion of this new block.

With the convention F(t)=integral psi(u)e^(-itu), F'^2 contributes -uv and -FF'' contributes v². Symmetrizing yields exactly (u-v)²/2. Finite positive-profile moments and integral dt/(t²+d²)=pi/d justify absolute Fubini. The Fourier kernel is pi exp(-d|u+v|)/d. Thus the stated J identity, strict positivity, and square-restriction lower bound pi exp(-2dR) M0 M2/d follow. This argument needs only positive even nondegenerate psi with suitable moments, not a sign assertion for Lambda itself.

The recurrence nu_(k+1)=mu_k-d²nu_k and its finite alternating expansion are exact. Recovery of mu_(2N) still uses nu_(2N+1), whose leading polynomial-division contribution is precisely mu_(2N). Higher rational-moment positivity does not follow from J>0. Inserting powers of t differentiates the absolute-value exponential kernel and creates signed/distributional terms; the positive scalar integral is not an arbitrary polynomial positive Gram representation.

Accepted: one actual positive scalar rational form and exact algebra exposing the unchanged top-moment debt. No all-order target positivity, degree-reducing signed induction, or RH conclusion.
