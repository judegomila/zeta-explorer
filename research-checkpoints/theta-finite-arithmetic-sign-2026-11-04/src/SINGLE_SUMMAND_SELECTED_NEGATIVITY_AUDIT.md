# Independent audit: one arithmetic summand has negative selected degree-two defect

2026-11-04. Analytic verification of a candidate supplied by the parent researcher. This concerns one summand φ_m, not the complete prefix Σ_(m≤M)φ_m. All within-summand terms and the complete degree-two X-selection are retained. It does not establish failure of the full theta sign claim.

## Result

Construct X_m and H_m by the exact piecewise-derivative prescription of the finite-arithmetic audit, but use only the actual arithmetic summand φ_m. If P_(2,m) is the monic degree-two X_m minimizer and A_(2,m)=X_m[P_(2,m)], then

    H_m[P_(2,m)]/A_(2,m) → 2           as m→∞.          (1)

Consequently Q_m[P_(2,m)]=X_m[P_(2,m)]−H_m[P_(2,m)]<0 for all sufficiently large m. This rules out proving the desired full-prefix sign by asserting an individually positive selected sign for every arithmetic summand. It does not allow cross terms between different arithmetic summands to be dropped.

## 1. Exact exponential reference computation

Let r(u)=e^(−αu) on u≥0, with derivative parity on u<0 as in the audited finite model, and let p(t)=t²+c. On u>0,

    f=(c−α²)r,
    h=2iαr,
    g=−2i[u(c−α²)+α]r.

Using ∫_0^∞u^j e^(−2αu)du=j!/(2α)^(j+1), including reflection and Plancherel,

    X[p]/(4π)=α+c²/α³,
    H[p]/(4π)=2α.                                      (2)

The unique optimum is c=0 and its ratio is two. A general real monic quadratic is t²+bt+c. The odd part is X-orthogonal to the even part and X[t]>0, so its full-space optimum has b=0. Complex coefficients do not improve the minimum because the real and imaginary coefficient energies split and the monic constraint is real.

The Gram for {1,t²} at α=1 is diagonal with entries 1 and 1 after dividing X by 4π. Thus the relevant limit is nondegenerate, not a singular perturbation selection argument.

## 2. Exact rescaling of a theta summand

Put λ=πm², α=2λ, a=φ_m(0)>0, y=αu, and

    R_λ(y)=φ_m(y/α)/a.

Direct substitution into the supplied theta summand gives

    R_λ(y)=e^(5y/(4λ))
       [(2λe^(y/λ)−3)/(2λ−3)]
       exp[−λ(e^(y/λ)−1)].                             (3)

For each fixed y≥0,

    R_λ^(k)(y) → (−1)^k e^(−y),       k=0,1,2.          (4)

This also follows by differentiating (3) explicitly. For completeness, write z=e^(y/λ)≥1. For k≤2, the derivatives are finite sums of bounded-coefficient terms of the form

    z^β exp[−λ(z−1)],        β≤k+9/4,

where boundedness holds for all sufficiently large λ. Since z−1≥log z=y/λ, for λ≥2(k+9/4),

    z^β exp[−λ(z−1)]≤exp(−y/2).

Thus a fixed C bounds |R_λ^(k)(y)| by Ce^(−y/2), uniformly for k≤2 and large λ. In particular, dominated convergence is valid for every integral of the products of these derivatives multiplied by y^j, j≤2, that occurs in the finite degree-two source and target Grams.

## 3. Reselection, not only a trial limit

For q(s)=s²+d, use the monic polynomial

    p(t)=α²q(t/α)=t²+α²d.

The source and target transforms scale exactly as

    f_p(u)=aα² f_q^λ(y),
    h_p(u)=aα h_q^λ(y),
    g_p(u)=aα g_q^λ(y),

where f_q^λ,h_q^λ,g_q^λ are formed from R_λ using the same derivative-parity prescription in y. Hence

    X_m[p]=2πa²α ||g_q^λ||²_(L²(dy)),
    H_m[p]=2πa²α ||h_q^λ||²_(L²(dy)).                  (5)

The constant multiplier is the same for source and target. By the dominated Gram convergence proved above, the X_m minimizing scaled constant d_λ tends to the unique limiting minimizing constant d=0. Explicitly,

    d_λ=−G^λ_(2,0)/G^λ_(0,0)→0,

and the denominator converges to a strictly positive value. The target is independent of d, because constants have zero derivative form. Both the selected source and target energies converge to their values in (2) at α=1, giving (1). Parity handles the complete odd lower direction exactly, not approximately.

This is a selected asymptotic for genuine arithmetic summands. It is not numerical evidence and does not assert that a single summand reproduces the selection for the complete finite theta prefix.

## 4. Stronger obstruction at any fixed quadratic, including the actual selected one

The same limit holds for every fixed monic quadratic p(t)=t²+bt+c, not only the separately selected P_(2,m). Indeed, under the exact scaling above,

    q_m(s)=alpha^(−2)p(alpha s)
          =s²+(b/alpha)s+c/alpha² → s².

The complete degree-two source and derivative Gram matrices converge under the same dominated-convergence argument, and q_m converges coefficientwise. The limiting source energy at s² is strictly positive. Consequently

    H_m[p]/X_m[p] → 2,
    Q_m[p]<0 for all sufficiently large m.              (6)

The convergence is uniform when b,c range over any fixed bounded set, since all forms have fixed finite dimension and their matrix entries converge.

In particular (6) applies to the fixed actual-theta fully X-selected quadratic P_2, and to the selected quadratic for any one fixed complete finite prefix. Thus distant individual diagonal arithmetic pieces have negative signed contribution even when tested on these fixed fully selected polynomials. This is stronger than merely finding a different minimizer for each summand. It still does not determine the sign of the full arithmetic double sum: its off-diagonal m,l terms are not addressed by (6), and the full source norm cannot be replaced by the sum of diagonal source norms.
