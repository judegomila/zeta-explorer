# Independent audit: positive primitive and exact cancellation

Status: PASS, analytical review of Sections 1–6 on 2026-11-03. No acquired code executed. This adds exact identities and a positive base primitive, not an arbitrary-degree Schur sign theorem.

## Normalization and positivity

Writing x=e^(2u), chi=-2x^(5/4)Theta3'(x). The even-orbit subseries in chi is exactly half of sqrt(2)chi(u+log 2). Therefore the difference is the alternating positive/negative orbit series 2x^(5/4)Theta4'(x). DLMF 20.5.4 at argument zero gives product (1-q^(2n))(1-q^(2n-1))²; each factor increases strictly with x, and the locally uniformly differentiable product is positive. Thus Theta4'(x)>0. The primary product was independently checked at https://dlmf.nist.gov/20.5.E4 . The modular Theta4/Theta2 formula shows exponential smallness in 1/x, with polynomial factors harmless after any fixed derivative. Both tails of chi_2 are rapid.

The theta modular leading term Theta3(x)=x^(-1/2)+rapid correction implies chi=e^(-u/2)+rapid correction as u tends to minus infinity, with coefficient exactly ONE. Since (D+1/2)chi=-psi, K=e^(-u/2)-chi solves (D+1/2)K=psi and has the vanishing incoming homogeneous coefficient. This gives the stated causal convolution, strictly positive because psi>0. Positive-end coefficient is also one. K_a and all fixed derivatives and position weights belong to L² exactly in the stated range a<1/2. The arithmetic bounded inverse on L² and the graph domain therefore gives R chi_(a,2)=-K_a, not +K_a. No endpoint inverse at a=1/2 is asserted.

## Polynomial extraction and global energy

With d=1/2-a, a²-d²=a-1/4=eta. Polynomial division and d²-D²=-(D-d)(D+d), with commuting constant-coefficient operators, prove w=p(eta)K_a-(D-d)q(A_a)f_a. All identities hold for complex coefficients as well. Only p(eta)e^(-du) remains as the slow positive tail; the rest is actual complete-theta rapidly decaying data, not a finite-orbit approximation.

For g=w'+dw, expand |g|² and integrate the cross term d u (|w|²)'. Exponential/rapid tails remove the global boundary. Hence integral u|g|²=integral u(|w'|²+d²|w|²)-d||w||², which is 2Q in the adopted convention. Signed position weights cannot be replaced by positive weights.

## Endpoint and block cancellation

At a=0, G(t)=p(t²)hat(psi)(t) is even, even for complex p. W=G/(d+it). In the real part of conjugate(W)iW', the numerator phase term -Im(conjugate(G)G')/(d²+t²) is odd and integrates to zero. The denominator phase supplies d|G|²/(d²+t²)². The same argument for the Fourier transform itW of w' supplies the t² factor. Thus the two claimed position integrals are nonnegative and their weighted sum equals d||w||² exactly. Raw Q_0=0; this says nothing by itself about the derivative defining normalized Q_a/a.

On [l,r] the missing boundary is +d[u|w|²]_l^r. For w=C exp(-du), bulk on [H,infinity) is dH|C|²exp(-2dH), boundary is its negative, and g=0. This cancellation is exact for every polynomial degree. There is no available scalar-tail reserve. Cross terms with the rapid remainder must still be retained.

## One crossing and limits

For r=log psi(u)-log psi(u+L), the existing complete-theta curvature bound gives r'>=17L. Evenness gives r(-L/2)=0, while the root of psi-sqrt(2)psi(.+L) solves r=L/2. Integrating the derivative bound gives -L/2<u_*<=-L/2+1/34<0. The derivative bound already yields unbounded range in both directions. Positive tilt preserves this one crossing, but differential polynomials and smoothing need not.

Accepted scope: exact complete-theta primitive, domain-valid inverse and scalar residue extraction, one base-profile crossing, global/local signed energy formulas and exact endpoint/tail cancellation. No all-order positivity, no free reserve, no Schur conditioning estimate, and no a=1/2 domain claim.
