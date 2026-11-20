# Reflected Sobolev reduction audit

2 November2026. PASS with the requested codomain clarification: R_a maps the polynomial T_+ range, and subsequently its closure, INTO ambient L2(0,infinity); invariance of that range closure under T_- is not assumed.

Reviewed all_order_closure_v1/REFLECTED_SOBLEV_COST.md. Independently derived the parent Gram normalization: K=.5 integral g(u-v)g(u+v)du, and its jet form=.5||p(D)g||² for p(z)=sum c_j(-2z)^j. Therefore the bridge form is .25 d_a||p(D)g||². Differentiating uses [p(D),u]=p'(D). For each parity subspace the integrated commutator term vanishes, since real full-line derivative products of odd total order have zero integral. Evenness of psi then yields the stated reflected norm difference.

Expansion E±O and completion of the square give exactly the sinh-weighted positive square minus the csch-weighted O cost. The small-a normalized limit and endpoint integrability are correct. The operator injectivity argument via constant-coefficient ODE/exponential-polynomial contradiction is valid; the extension criterion is precisely a contraction inequality, not a proof of it.

For the degree-two local obstruction, the chosen real constant r annihilates p(D+a)psi at u0, while the other expression is -4a psi'(u0). The local integrand is therefore -8a²u0 exp(-2au0)psi'(u0)^2. This is a valid local-strategy obstruction, not an integrated negative witness and not a counterexample to H2 or H3. It concerns an integration-by-parts transformed representation different from the logarithmic Bell polynomial P=XD-B² used in H3.

The all-order scalar identity follows by expanding (partial_y-partial_x)^2=(partial_x+partial_y)^2-4partial_x partial_y, then integrating even diagonal derivatives by parts. At zero, every boundary product has odd total parity, so it vanishes; infinity is controlled by theta decay. The explicit w^(2j) formula and its binomial reindexing give the two displayed signed moment sums and their examples correctly.

This establishes an exact reformulation with a fully retained integrated cost and a pointwise no-go. The required all-degree integrated Hardy/contraction inequality remains open.

## Auxiliary finite-jet nonclosure example

Also PASS: FINITE_JETS_NOT_CLOSURE.md. For phi=exp(-16u²)(1+epsilon cos16u),0<epsilon<=1/33, the logarithmic curvature bound<=-24 follows by differentiating log(1+epsilon cos16u). Its transform is the stated Gaussian times1+q cosh(z/2),q=epsilon exp(-4). At epsilon0 the normalized bridge is a strictly positive Gaussian kernel and every fixed finite jet matrix is positive definite uniformly on the compact shift interval. Continuity and compactness therefore justify the existence of a sufficiently small epsilon for each prescribed finite order.

At q cosh(t/2)=1 and a=.25, the exact norm factor is2(1+cos(1/8))-q²sin²(1/8). Differentiation reproduces the stated shear expression. Dropping its additional negative terms and using sinx>=x-x³/6 yields the exact upper bound-191/6144. Thus the counterexample is valid for the claimed generic analytic/Gaussian class. It does not preserve theta modularity or superexponential decay and is not a theta/RH counterexample. Its bad height escapes as epsilon decreases.
