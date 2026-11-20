# Fivefold wider triple clusters with unbounded cluster count

2 November 2026. This strengthens TRIPLE_CLUSTER_THEOREM.md. Same definitions, normalization, shift range, no global-PD/RH conclusion.

## Theorem

Each cluster may contain at most three nodes of diameter **1/200 = .005**, lying in [x_j−1/400,x_j+1/400]. Centers remain at least5/2 apart. For the complete K_a=C_a/a, continuously extended at zero, and 0≤a≤1/2, let B be the factorial-scaled Newton Gram and D its exact block diagonal. Then

    D > (3/500)I,
    ||D^(−1/2)(B−D)D^(−1/2)|| < 1/5000,
    B >= (4999/5000)D > (599/100000)I.

Every coordinate Schur complement obeys the same last lower bound. Finite or countable cluster collections and arbitrary internal collisions/confluent limits are covered. Original distinct-node evaluations inherit positivity by congruence; raw repeated evaluations may have null directions.

## 1. Sharper algebraic confluent margin

From the existing certified full-theta jet bounds, the factorial-scaled confluent block has odd diagonal greater than.01477. Its even block has diagonal lower bounds.0314,.0205 and absolute off-diagonal upper bound.01536.

Subtract m0=19/2000=.0095. Both resulting diagonals are positive and

    (.0314−.0095)(.0205−.0095)−.01536²
      =.0219×.011−.01536²
      =.0000049704 >0.

Thus H>m0 I by the 2×2 positive-definiteness criterion. This improves the former Gershgorin lower bound without any new numerical assumption.

## 2. Newly enclosed larger interval

The new script certify_wider_derivatives.py uses our prior campaign's interval theta routine (confluent_v4/certify_confluent_jets.py), not the downloaded external checker. It integrates upper enclosures over2048 h-cells of width1/512 on[0,4]. Every cell includes simultaneously all |v|≤.005 and all0≤a≤.5 through the weight bound2h²cosh(h). Exact Leibniz coefficients through order6 and the complete infinite theta/spatial tails are retained.

Recorded output:

    sup |K_a^(4)(v)| <507.1727576776599 <508,
    sup |K_a^(6)(v)| <222501.8925432711 <223000.

These are interval upper Riemann sums, not point samples. The theta remainder is the previously justified10^(−80)e^(u/2−r)(1+r)^12 for r=πe^(2u), and the recurrence handles every derivative through6. Smooth full-profile parity, not the finite-head reflection, is used across zero.

For the spatial tail h≥4, |v|≤.005 still leaves h±v≥3. The earlier majorant10^100 exp(60h−5e^(2h)) remains valid: the product exponential uses e^(2(h−v))+e^(2(h+v))≥2e^(2h), and the linear prefactors sum to49h independently of v. The Gaussian-index bound and polynomial coefficients are unchanged. Integrating this majorant contributes less than10^(−2500); the new run allows the larger10^(−2400), plus10^(−30) serialization slack.

All interval calculations use50decimal digits with60digit auxiliary endpoints. Results and runtime are in wider_derivative_bounds.json/wider_run.txt.

Evenness gives, throughout this larger interval,

    |K_a''(v)| ≤1.536+(508/2)(.005)² <1.543.

## 3. Collision-stable local perturbation

Set delta=.005, alpha=(1,.1,.01). By the Hermite–Genocchi average formula, each transformed entry is an average of alpha_r alpha_s (−1)^s K^(r+s)(u), |u|≤delta. Taylor's theorem and evenness bound its difference from H entrywise by

    [[.0000192875, .0007715, .0000635],
     [.0007715,    .0000635, .00254],
     [.0000635,    .00254,   .00027875]].

The largest row sum is.003375. Thus

    D_j >(.0095−.003375)I=.006125 I >(3/500)I.

No inverse node gap enters, so distinct nodes and arbitrary collision limits share the same margin.

## 4. Inter-cluster coupling and infinite operator

The global derivative estimate through order4 in TRIPLE_CLUSTER_THEOREM.md remains unchanged:

    |K_a^(r)(v)| <2×10^19 e^(−10v²), r≤4.

Between centers distance d, convex combinations of within-cluster nodes differ by at least d−.005. The nth neighboring center has distance at least2.5n, and

    2.5n−.005 ≥2.495n,
    10(2.495)²>60.

Hence the same exact bound holds:

    ||B−D|| <epsilon=6(2×10^19)20^(−20)/(1−20^(−60))
                      <1.2×10^(−6).

Dividing by3/500 gives epsilon/(3/500)<1/5000; subtracting it gives3/500−epsilon>599/100000. The countable block Schur proof, bounded diagonal/inverse, and completion-of-square Schur complement argument are exactly as in the narrower theorem. These estimates also give uniformly controlled countable confluent limits.

## Scope

This is a **fivefold increase in cluster diameter**, supports three-node rather than just two-node local clusters, and permits unbounded total cardinality. It still imposes maximum cluster occupancy3 and center separation2.5. It neither proves H3 nor supplies all-order cluster closure. The new source's analytic H2 lemma is consistent with this result but the quantitative margin here uses already validated actual full-theta jets, which are stronger for this compact shift interval.
