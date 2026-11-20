# Fixed-cell coercivity and the necessary source escape

2026-11-04. Independent continuation of the selected Green-kernel audit. No RH, signed-form positivity, selected asymptotic, or numerical evidence is assumed. Existing files and live 4CT are unchanged.

## 1. Audited setting

Use

    T p = F p' + 2F' p,   A p = p' + v p,
    w = F²,   v = w'/w,   X_I[p] = ∫_I w |Ap|²,
    H_I[p] = ∫_I w |p'|², W_I[p] = ∫_I w |p|².

The complete X-normalized selected sequence is p_n=P_n/sqrt(A_n), with X[p_n]=1 and u_n=Ap_n an orthonormal basis of the cell-mean-zero source space. On a real-zero cell I=(a,b), write L(t)=∫_a^t w, R(t)=∫_t^b w, M=L(b).

The following identities in the preceding notes pass an independent audit:

    Σ_n p_n(s)p_n(t) = L(min(s,t))R(max(s,t))/(M w(s)w(t))

within one cell, and zero across distinct cells. The evaluation source representer is [1_(s<t)−L(t)/M]/w(t), which lies in the zero-mean source space. Completeness and Parseval prove the identity; diagonal finiteness proves absolute convergence for each pair. Consequently

    Σ_n W_I[p_n] = ∫_I LR/(Mw) < ∞,
    Σ_n e^+_(n,I) = ∫_I (v')_+ LR/(Mw) < ∞,

where e^±_(n,I)=∫_I w(±v')_+ p_n². The positive multiplier vanishes near both endpoints. The negative trace diverges logarithmically at either endpoint and cannot be subtracted from another infinite trace.

## 2. A local coercivity theorem with a universal asymptotic coefficient

Suppose the endpoint multiplicities of F on I are m_a,m_b≥1. Define

    d_I = min{ ((2m_a−1)/(2m_a+1))²,
               ((2m_b−1)/(2m_b+1))² } ≥ 1/9.

For every ε>0 there is a finite C_(I,ε) such that every polynomial p satisfies

    H_I[p] ≥ (d_I−ε) X_I[p] − C_(I,ε) W_I[p].       (1)

The same statement holds for the natural local form domain. No control on the interior shape of F is required; that shape affects C_(I,ε), not d_I.

### Endpoint proof

Near a set x=t−a and write F=x^m g(x), with g smooth and nonzero. Put f=Fp and b=g'/g, so F'/F=m/x+b. For a localized p vanishing near the outer boundary of this neighborhood, integration by parts yields

    H[p] = ∫ ( |f'|² + [(m/x+b)²−m/x²+b'] |f|² ),
    X[p] = ∫ ( |f'|² + [(m/x+b)²+m/x²−b'] |f|² ).

The endpoint boundary terms vanish, initially for compact tests and then by form closure. The elementary Hardy inequality is

    ∫ |f'|² ≥ (1/4) ∫ |f|²/x².

It follows either by integrating the square |f'−f/(2x)|² or by completion from compact tests. For d_m=((2m−1)/(2m+1))²,

    (1−d_m)/4 + m(m−1) − d_m m(m+1) = 0.

Replacing d_m by d_m−ε gives a strictly positive x^(-2) coefficient in H−(d_m−ε)X after applying Hardy. Since b,b' remain bounded, the O(x^(-1)) and O(1) terms are absorbed by taking the neighborhood sufficiently small. Thus the localized endpoint inequality holds with no lower-order remainder. Reflect at b for the other endpoint.

### Interior and gluing

On a compact interior interval v is bounded. For every small δ>0,

    |p'+vp|² ≤ (1+δ)|p'|² + C_δ |p|²,

so H≥(1−δ)X−C W there. Choose a smooth quadratic partition χ_a²+χ_0²+χ_b²=1 subordinate to the endpoint neighborhoods and the compact interior. Both first-order forms have the exact localization identities

    Σ_j H[χ_jp] = H[p] + ∫ w Σ_j |χ_j'|² |p|²,
    Σ_j X[χ_jp] = X[p] + ∫ w Σ_j |χ_j'|² |p|².

The cross terms vanish because Σ_j χ_jχ_j'=0. Combine the endpoint and interior estimates and absorb the bounded localization term into C W. This proves (1). For ε≥d_I the claim follows trivially from H≥0 after increasing C, so only small ε is relevant.

The coefficient d_m is sharp for local endpoint sources: the logarithmic-coordinate cutoffs already constructed in the prior Hardy-zero note have H/X→d_m and W/X→0. This sharpness assertion is about the local domain, not about the one-dimensional selected sequence.

## 3. Consequences for actual selected polynomials

For a fixed finite union J of cells, let d_J=min_(I⊂J) d_I≥1/9. Summability of W_J[p_n] from the exact selected trace and (1) give

    liminf_(n→∞) ( H_J[p_n] − d_J X_J[p_n] ) ≥ 0.       (2)

Indeed (1) first gives a lower limit at least −ε because X_J[p_n]≤1; then let ε↓0. In particular, the desired stronger selected coherence

    H[p_n] → 0

would necessarily force

    X_J[p_n] → 0                                      (3)

for every fixed finite union of cells. Hence the entire selected source energy, not merely positive signed excess, must escape every fixed compact set. This is a necessary condition, not a proof that such escape occurs.

The signed identity H_J=X_J+e_J^+−e_J^- and the summable local positive trace also give

    limsup_(n→∞) ( e^-_(n,J) − (1−d_J)X_J[p_n] ) ≤ 0.  (4)

Thus on fixed cells the negative contribution can asymptotically cancel at most 8/9 of the local source mass, unless that source mass itself tends to zero. If both endpoints have higher multiplicity, the limit is stricter. Equivalently, for each fixed ε>0 one can bound the left side of (4) by εX_J plus a nonnegative sequence summable over n (a fixed multiple of W_J[p_n]+e_J^+).

For example, if the selected source mass were asymptotically tight in a fixed exhaustion, (2) would force liminf H[p_n]≥1/9. Therefore compact positive-excess control combined with source tightness cannot prove H/X→0; the coherence route requires source escape.

## 4. Conditional degree-uniform tail and negative bounds

The independently derived capacitary criterion is recorded in

    CELL_POSITIVE_EXCESS_CAPACITY_CRITERION.md.

For a cell define dν=(v')_+dt/w and

    B_I = sup_(a<x≤y<b) ν([x,y]) / (1/L(x)+1/R(y)).

Its proof gives B_I≤Λ_I≤4B_I, where Λ_I is the squared norm of sqrt((v')_+)K_I* on the zero-mean source space. For any collection E of cells put b_E=sup_(I∈E)B_I. If b_E<∞, every polynomial, regardless of degree, obeys

    e_E^+[p] ≤ 4 b_E X_E[p],
    e_E^−[p] ≤ (1+4b_E) X_E[p],
    e_E^+[p]+e_E^−[p] ≤ (1+8b_E) X_E[p].              (5)

The first inequality is the operator bound. The second follows cellwise from H_E=X_E+e_E^+−e_E^-≥0. There is no separate negative-shape hypothesis. The third adds the first two. Infinite collections follow by monotone convergence for the nonnegative terms.

If b_E→0 for escaping tails, the positive operator is compact, so e_n^+→0 for the selected source basis and H/X≤1+o(1). This is weaker than the desired H/X→0. Equation (5) bounds the negative contribution but does not give the needed lower bound e_n^-→1+e_n^+.

No estimate of the actual theta capacities B_I at infinity is established here. The new result is an exact nontrace target plus a rigorous local necessary condition on selected source escape, not a resolution of the all-degree blocker.
