# Independent audit: reoptimized dual flow

2026-11-03. Analytic PASS, including the appended explicit uniform-coercivity paragraph. No smooth or unique optimizer is assumed, and no numerical continuation is certified.

## Compactness and domains

On the stated compact shift interval, actual old-prefix positivity gives a uniformly invertible smooth A and bounded smooth c=-A^-1b, including normalized analytic endpoint limits. Fixed-degree full-theta tails dominate all auxiliary moments uniformly. The positive-parent covariance of z remains positive definite by its distinct leading powers and full spatial support; compactness gives a positive minimum eigenvalue. These are dual-coercivity quantities only, not substitutes for the signed inverse.

The explicit delta_I,C_I,m_I formula gives ||v||<=(C_I-m_I)/(2delta_I) for every optimizer by comparing lambda(v) with lambda(0)>=m_I. The uniform positive leading term of f proves m_I finite. Enlarging this strategy ball slightly is valid. Actual rho feasibility gives L<=E_rho f<=sqrt(F2) without any target lower-bound premise. Uniform leading growth of Q outside a sufficiently large spatial interval then exceeds this common value upper bound. Every v in the enlarged ball has inf Q<=L, so its minimizing contacts cannot escape outside that interval. This justifies fixed compact strategy sets, not merely pointwise compactness at a single optimizer.

Both optimal sets are compact and convex. Any optimal dual measure has zero cross mean and objective L. For an optimal plane Q>=L everywhere; its integral equals L, so the measure is supported on that plane's contact set. Consequently every optimal plane/measure pair is a saddle pair, and all optimal measures have common compact support.

## Directional derivative

Differentiating at fixed v,u yields partial_a Q=2c'^T z_c-2v^T A_loc c'. The first term integrates to zero under every old optimal dual measure. For a fixed old optimal plane and a new optimal measure, the lower comparison inequality in the note is correct; for a fixed old optimal measure and a new optimal plane, the upper comparison inequality is also correct. Uniform compactness and continuity ensure cluster limits are old optimizers and allow uniform first-order expansion of Q.

Thus liminf is at least max_V min_D J and limsup at most min_D max_V J, with J=-2v^T(E_nu A_loc)c'. Compact convex bilinear minimax equates them, proving the right derivative even at changing contact sets. The negative-direction version uses -c', not an assumption that both derivatives coincide.

For each fixed v, the inner objective is linear over probabilities on one compact optimal contact set with N cross constraints plus normalization. An extreme minimizing measure has at most N+1 atoms. Equivalently, the moment/objective convex hull has an exposed minimizing face of dimension at most N, so Caratheodory yields N+1 points. This atom count applies to the inner linear minimization; it does not select a fixed support along the shift path or justify an arbitrary sampled objective as a continuum lower bound.

## Reoptimized loss bound and scope

On fixed compact strategies, the max-min value is locally Lipschitz. Compact interval coverage gives absolute continuity. The directional derivative formula bounds its almost-everywhere derivative by 2 V_I B_I D_I, where c'=-A^-1(A'c+b') uses only old and cross moments through n-1. Integrating yields the displayed transfer margin without target input. Local A_loc may be indefinite; neither the exact derivative game nor its bound asserts a favorable sign.

Accepted result: a conditional fixed-degree local continuation theorem permitting full reoptimization and nonsmooth changes of active contacts. No degree-uniform bounds, successful chain into critical shifts, new positive rung, or optimized-dual counterexample follows. The prior rigid-transport obstruction does not contradict this theorem because v is reoptimized independently rather than preserving v-c.
