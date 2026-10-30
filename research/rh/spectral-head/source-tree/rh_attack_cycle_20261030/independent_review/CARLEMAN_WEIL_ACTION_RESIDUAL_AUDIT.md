# Carleman tail-to-window actual Weil action — PASS

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

Independent analytic review, 30 October 2026. This is stronger than the separate quadratic head-energy estimate, and its extra operator-domain and tail-to-window steps were checked independently. It concerns the fixed-support actual Weil operator only.

## Operator domain and identification

For the accepted finite-regularity source, f=SE(g) is H¹ with integrable derivative. Its central sharp restriction F is compact BV. Therefore its full angular transform is O((1+|xi|)^-1), and a(xi)Fhat is L² because a grows only logarithmically. The zero-extension gamma form is represented on every supported form-domain test by the restriction of this full multiplier. Adding the fixed-support bounded arithmetic perturbation proves F is in the actual supported selfadjoint operator domain. This is not merely a distributional residual assertion or an assumption that energy control implies action control.

Radicality gives q(h,F)=-q(h,t) for smooth h compactly inside the window. Each tail-to-window expression below is bounded into physical L²(I). Once represented there, density identifies its sum with the already-defined H_lambda F. Equivalently, the full gamma-multiplier argument verifies the form representation directly. Reflection preserves evenness, but arbitrary physical tests are allowed; no direction of the residual is omitted.

## Full touching-boundary cross operators

The 5/4 off-diagonal gamma kernel K(r)=exp(-3r/2)/(2sinh r) is at most 1/(2r). For the right tail the central distance is u+s, u=ell-x>0. The Carleman Schur integral against s^-1/2 is pi/sqrt(u); each tail thus costs at most pi/2 on L². Both tails cost at most pi||a||. The touching boundary is included. No a(0)=0 condition or discarded trace is used.

The right continuum map is exp((ell-x)/2) integral exp(s/2)a(s)ds. Its central norm factor is sqrt(lambda²-1)<=lambda; its moment is bounded by ||exp(s)a||. Both tails cost at most 2lambda times that weighted norm. The normalization already contains the pole contribution and no extra old pole term is added.

For r=log n, exactly one right-tail translation is visible in the window. Its norm is the L² norm of a on [max(0,r-2ell),r], bounded by min(1,exp(-(r-2ell)))||exp(s)a||. Therefore the complete prime operator, including all labels above lambda², has norm at most

    2 [sum_(n<=lambda²) Lambda(n)/sqrt(n)
       +lambda² sum_(n>lambda²) Lambda(n)n^-3/2] ||exp(s)a||.

Both sums are truly retained; the second is absolutely summable in the central L² norm. Using the already admitted elementary psi(x)<=3x, partial summation bounds the first by 6lambda and the second by 9lambda. Hence the two-tail prime charge is at most 30lambda. Together with continuum and gamma this gives the useful explicit, conservative interface

    ||B_I(t_-+t_+)|| <= (32+pi) lambda ||exp(s)a||,
    lambda>1.

This is an absolute operator bound, not a claim of arithmetic cancellation.

## Actual residual and scope

The separately accepted restricted weighted-tail estimate is ||exp(s)a||²<=C_A lambda^-A[log(10lambda^A)]³||g||². Applying the full cross-operator bound, then the independent actual coordinate Gram ||F||>=kappa lambda^-1||g||, yields for every fixed A>4

    ||H_lambda F|| <= C_A lambda^(2-A/2)(1+loglambda)^(3/2)||F||.

In particular A=6 gives O(lambda^-1 log^(3/2)lambda), on an explicit image of dimension lambda²-(6/pi²)log²lambda+O(loglambda), after at most three source constraints. The statement is uniform on that entire finite-dimensional image, including complex combinations. It bounds full actual action, not only Ritz values or the head compression. Onset and constants inherited from the frame estimates remain unspecified.

This licenses the new exponent-six trace-null family as an additional near-null actual-action family, with a smaller rank loss than the previously accepted exponent-eight construction. It does NOT identify the same historical vectors, replace their certificates, prove a complementary floor, bound a complement inverse, select an actual ground, or prove RH. More near-null vectors can instead crowd the complementary critical spectrum.

Twelve independent exact algebra/integral checks accompany these three audits. They verify factors and a negative fixed-sum convolution example, not the whole analytic theorem by computation. No numerical spectral sweep or external publication was performed.
