# Sparse valleys retain the all-degree subexponential norm comparison

2026-11-04. Continuation of the frozen sparse-entire countermodel. This sharpens its preservation boundary; it is not an actual-theta escaping-capacity estimate. No existing frozen payload or live 4CT file is edited.

## 1. Result

Let F_0 be the actual theta transform, c=π/2, and

    W(t)=|Gamma(4+it/2)|² ≍ (1+|t|)^7 exp(−c|t|).

Let H be the positive-on-real sparse entire multiplier in

    ../theta_escaping_capacity_20261104/SPARSE_ENTIRE_VALLEY_COUNTERMODEL.md,

with centers c_j≥exp(exp j), c_(j+1)≥c_j² and arbitrary parameters 0<ε_j≤min(1,δ_j/100). Put F_tilde=F_0 H and

    T_tilde p=F_tilde p'+2F_tilde' p,
    X_tilde[p]=∫ |T_tilde p|².

There is a fixed C, independent of n and p, such that for every polynomial of degree at most n,

    exp[−C log²(n+2)] ||p||_W²
       ≤ X_tilde[p]
       ≤ exp[C log²(n+2)] ||p||_W².                    (1)

The constants can be chosen uniformly over all the ε_j parameter choices for the fixed centers. Thus the parameters may simultaneously be chosen to make the escaping positive-capacity norms diverge, as in the frozen countermodel.

The lower half of the actual all-degree norm comparison therefore survives this deformation. Its quasi-polynomial condition-number scale also survives. The sharper polynomial upper bound C(n+1), the sharp pointwise gamma majorant, and exact theta arithmetic are not asserted here. In particular, the norm comparison (1), by itself or together with the unchanged real-zero geometry and the generic Green identities, cannot force a bounded escaping positive operator.

## 2. Uniform upper growth and source tail

The product proof gives, uniformly in its parameters,

    |H(t)|+|H'(t)| ≤ C exp[C log²(3+|t|)].              (2)

In fact log|H| has the smaller upper scale O(log|t| log log|t|); the coarse log² envelope suffices. Since the actual F_0 obeys F_0²+F_0'²≤CW,

    F_tilde²+F_tilde'²
       ≤ C (1+|t|)^7 exp(−c|t|+C log²(3+|t|)).         (3)

The logarithmic correction has derivative tending to zero. Integrating the right side on a half-line gives, after increasing C,

    ∫_t^∞ F_tilde(s)² ds
       ≤ C (1+t)^7 exp(−ct+C log²(t+3)), t≥0,          (4)

and the reflected left-tail estimate. For example, the derivative of 7log(1+t)+C log²(t+3) is at most c/2 for all sufficiently large t, which proves (4) by elementary exponential integration. Bounded t is absorbed in the constant.

## 3. Additional good-point exclusions for H

Fix A=16/c and R_n=An+1, with n≥1. Let δ_n=(n+2)^(-6). Remove real t in [−R_n,R_n] lying within complex distance δ_n of any added zero ±c_j±iε_j with c_j≤2R_n. There are O(log log(n+3)) such quadruplets, so the additional removed length is

    O(δ_n log log(n+3)).                              (5)

At a remaining point each nearby normalized factor satisfies

    H_j(t) ≥ δ_n^4/(c_j²+1)²,

and there are O(log log(n+3)) factors with c_j≤2R_n. Their product is therefore at least exp[−C log(n+2)log log(n+3)].

For c_j>2R_n, directly from the product formula,

    H_j(t) ≥ (1−R_n²/c_j²)²/(1+1/c_j²)².

Taking logarithms and using the squared-growth spacing of the centers gives a uniform lower bound for this tail product, because

    Σ_(c_j>2R_n) (R_n²+1)/c_j² ≤ C.

Consequently, outside the extra exceptional set,

    H(t) ≥ exp[−C log²(n+2)], |t|≤R_n.                (6)

This estimate is uniform in arbitrarily small ε_j. No lower bound on the distance of the added nonreal zeros from the real line is used.

## 4. Retained finite-degree source lower bound

The actual-theta minimum-modulus argument is supplied in

    ../theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md.

It constructs a good set inside [−R_n,R_n] whose complement has length O(n^(-5)log(n+2)), and on which

    F_0(t)^4 ≥ C^(-1)(1+|t|)^7
                       exp(−2c|t|−C log²(n+2)).        (7)

Intersect with the good set from §3. Its excluded length remains O(n^(-5)log(n+2)), and (6)–(7) give the same form of lower bound for F_tilde(t)^4 after increasing C.

For a polynomial p, the exact source identity and decay give

    F_tilde(t)²p(t)=−∫_t^∞ F_tilde(s)T_tilde p(s)ds,
                                                       t≥0,

with the left-integral version for t≤0. Cauchy–Schwarz, (4), and the good-point lower bound imply

    X_tilde[p] ≥ exp[−C log²(n+2)] e^(−c|t|)|p(t)|²    (8)

at every remaining good point. The powers (1+|t|)^7 cancel, and |t|≤R_n absorbs the tail logarithmic correction into C log²(n+2).

Let M_c(p)=sup_R e^(−c|t|/2)|p(t)|. The elementary Chebyshev exterior argument in the supplied comparison proof places a maximum in [−An,An]. On an interval of length comparable to n^(-2) about a maximum, Markov's inequality gives

    e^(−c|t|)|p(t)|² ≥ C^(-1) M_c(p)².

The total excluded length is o(n^(-2)), so this interval contains a remaining good point. Therefore

    X_tilde[p] ≥ exp[−C log²(n+2)] M_c(p)².

Finally ||p||_W²≤C(n+1)^8 M_c(p)², as in the supplied elementary restricted-range proof. Absorb the polynomial factor to obtain the lower half of (1). Finitely many small degrees are also uniform in the ε parameters by the same good-point argument with a smaller fixed exclusion radius; alternatively the argument can be run with one sufficiently large fixed degree bound for every lower-degree p.

## 5. Upper weighted polynomial estimate

For completeness let

    W_*(t)=W(t) exp[C log²(3+|t|)].

For every polynomial p of degree at most n,

    ||p||_(W_*)² ≤ exp[C' log²(n+2)] ||p||_W².          (9)

One elementary proof uses the same maximum M_c. On [−An,An] the integral is at most a polynomial in n times exp[C'log²(n+2)]M_c². Beyond An, the Chebyshev estimate gives

    e^(−c|t|/2)|p(t)|/M_c
        ≤ exp(−κn−(7c/16)(|t|−An)),

for a fixed κ>0. The derivative of the additional logarithmic envelope is eventually smaller than c/4, so the squared exterior bound remains integrable with an exponentially decreasing tail and an exp[C'log²(n+2)] prefactor. Hence ||p||_(W_*)²≤exp[C'log²(n+2)]M_c².

Conversely, Markov's inequality in a length-two interval about a maximizing point supplies an interval of length comparable to n^(-2) where the weighted value remains a fixed fraction of M_c. Since W(t)≥c_0 exp(−c|t|) globally,

    ||p||_W² ≥ c_1(n+1)^(-2) M_c².

This proves (9), after absorbing powers of n. Constants handle n=0 directly.

Equation (3), the square inequality, and (9) applied to p and p' give

    X_tilde[p] ≤ C (||p'||_(W_*)²+||p||_(W_*)²)
       ≤ exp[C log²(n+2)] (||p'||_W²+||p||_W²).

The supplied Pollaczek derivative estimate ||p'||_W²≤C(n+1)||p||_W² proves the upper half of (1).

## 6. Scope

Together with the frozen ε_j^(-5) valley calculation, (1) supplies a single globally entire weight with unchanged actual real-zero geometry and unbounded escaping capacities, despite a two-sided all-degree exp[O(log²n)] source/reference comparison.

This is a sharper structural obstruction, not a theta counterexample. The actual F remains undeformed in the user's research problem. The model need not have the actual positive Fourier theta kernel, exact arithmetic coefficients, sharp pointwise envelope, or sharper polynomial upper norm bound. Nor does unboundedness of its positive operator establish failure of positive diagonal decay on its particular selected basis. No selected H/X counterexample is claimed.
