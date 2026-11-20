# Nontrace criterion for escaping-cell positive excess

2026-11-04. Independent derivation. No RH claim, no actual-theta tail estimate, and no frozen-package or live 4CT edits.

## 1. Result

On a bounded real-zero cell I=(a,b), write

    w=F², v=w′/w, L(x)=∫_a^x w, R(x)=∫_x^b w, M=∫_a^b w,
    dν(x)=(v′(x))_+ dx/w(x).

Define the two-endpoint capacity test

    B_I = sup_{a<x≤y<b} ν([x,y]) / (1/L(x)+1/R(y)).             (1)

Let Λ_I=||sqrt((v′)_+) K_I* : Q_I→L²(w)||². Then

    B_I ≤ Λ_I ≤ 4 B_I.                                      (2)

The factors 1 and 4 are optimal universal constants for the corresponding weighted Dirichlet embedding with arbitrary nonnegative target measures. This optimality statement does NOT assert optimality within the narrower subclass dν=(log w)″_+ dx/w.

Each actual fixed-cell block is Hilbert–Schmidt by the audited local trace. Consequently the maximal block operator R_+=⊕_I R_{+,I} is bounded iff sup_I B_I<∞, and is compact iff

    lim_{T→∞} sup_{I outside [-T,T]} B_I=0.                  (3)

One may equivalently remove any increasing finite exhaustion of cells. This is an operator-norm criterion, not a trace condition. No estimate establishing (3) for the actual theta weight is supplied here.

## 2. Exact source/energy equivalence and domain

For q∈Q_I={q∈L²(w):∫_I wq=0}, set r(x)=∫_a^x wq. Then r is absolutely continuous, r(a)=r(b)=0, and

    K_I*q=−r/w,
    ||q||²_w=E(r):=∫_I |r′|²/w,
    ||R_{+,I}q||²_w=∫_I |r|² dν.

Conversely every absolutely continuous r with these endpoint conditions and finite E is obtained by q=r′/w∈Q_I. Indeed ∫|r′|≤sqrt(M E), so the endpoint traces and ordinary absolute continuity are legitimate. Hence

    Λ_I = sup_{0<E(r)<∞} (∫|r|²dν)/E(r).                    (4)

For actual analytic F, (v′)_+ vanishes near both cell endpoints because v′=−2m/(x−a)²+O(1), and similarly at b. Thus ν is a finite measure supported in a compact interior subinterval. The proof below also applies to more general nonnegative locally finite measures, allowing infinite constants.

## 3. Elementary capacity proof

For a compact nonempty set A⊂I, define

    cap(A)=inf{E(h): h(a)=h(b)=0, h≥1 on A}.

If x=min A and y=max A, Cauchy–Schwarz on (a,x) and (y,b) shows

    cap(A)=cap([x,y])=1/L(x)+1/R(y).                        (5)

The minimizer is L(t)/L(x) to the left of x, 1 on [x,y], and R(t)/R(y) to the right of y. The case x=y is included. Thus (1) implies ν(A)≤B_I cap(A) for every compact A, since ν(A)≤ν([x,y]). Conversely testing (4) with this plateau minimizer gives Λ_I≥B_I.

For the upper estimate replace r by |r|, which cannot increase energy. For t>0 let A_t={r≥t}; this is compact inside I. For α>1 the admissible capacity test

    h_t=min((r/t)^α,1)

gives

    cap(A_t) ≤ α² t^(−2α) ∫_{0<r<t} r^(2α−2)|r′|²/w.

Layer cake and Tonelli therefore give

    ∫ r²dν
      =∫_0^∞ 2t ν(A_t)dt
      ≤ B_I ∫_0^∞ 2t cap(A_t)dt
      ≤ [α²/(α−1)] B_I E(r).

The last identity follows by integrating t^(1−2α) from r(x) to infinity. Minimizing α²/(α−1) over α>1 gives 4 at α=2, proving (2). Level sets using ≥ rather than > change no layer-cake integral. Complex-valued r are handled by its modulus and the standard modulus derivative inequality.

This proof uses neither a spectral theorem nor an external Hardy inequality.

## 4. Constants and optional median test

The lower constant 1 is attained for a single point-mass target measure, and approached by smooth narrow target densities. For sharpness of the upper constant, take w=1 on (0,1) and dν_ε=1_[ε,1/2] dx/x². Then B_ε≤1 and B_ε→1. Choose r_ε=√x on [ε,1/2], interpolate linearly to zero on [0,ε] and [1/2,1]. Its numerator is log(1/ε)+O(1) and its energy is (1/4)log(1/ε)+O(1), so Λ_ε→4. These examples establish universal sharpness only; their target measures are not required to arise from w.

For an easily evaluated one-variable alternative, let m satisfy L(m)=R(m)=M/2 and set

    H_I=max{sup_{a<x<m} L(x)ν([x,m]),
            sup_{m<x<b} R(x)ν([m,x])}.

On the left half, use energy with only h(a)=0 imposed and a free value at m. The capacity of a nonempty compact set A is 1/L(min A), and ν(A)≤ν([min A,m])≤H_I/L(min A). The identical truncation/layer-cake proof gives the one-sided estimate with factor 4. Reflect for the right half and add the two energy estimates to obtain Λ_I≤4H_I. Plateau tests ending or beginning at m give Λ_I≥H_I/2. Thus H_I→0 is also equivalent to escaping-cell compactness. The two-variable capacity criterion (1) has the cleaner sharp universal comparison (2); the median formulation is optional and not needed for its proof.

## 5. Exact spectral constant and trace comparison

The Green kernel for E with Dirichlet endpoints is

    g(s,t)=L(min(s,t))R(max(s,t))/M.

The positive integral operator on L²(ν),

    (G_ν f)(s)=∫_I g(s,t)f(t)dν(t),

has norm exactly Λ_I. When ν≠0 this is its largest eigenvalue in the present compact-support setting. Equivalently 1/Λ_I is the least generalized Dirichlet eigenvalue for

    −(r′/w)′=λ[(v′)_+/w]r,

interpreted weakly. This is an exact constant formula; (1) is its readily tested two-sided estimate.

Its trace is exactly the previously audited quantity

    T_I^+=∫_I g(t,t)dν(t)=∫_I (v′)_+ LR/(Mw).

Accordingly B_I≤Λ_I≤T_I^+, but compactness needs only Λ_I→0 (equivalently B_I→0), not summability of traces, nor even a tail trace estimate. In general, a small norm and a large trace can coexist because trace counts all singular directions.

## 6. Direct-sum and selected consequences

Necessity of (3): unit sources on distinct escaping cells form an orthonormal sequence; if block norms stay bounded away from zero, approximate norm maximizers on those cells have images not tending to zero, contradicting compactness. Sufficiency: finite sums of the compact local blocks are compact, and the norm of the omitted tail equals the supremum of its block norms. Equation (2) proves equivalence with (3). The same reasoning gives the boundedness criterion.

If (3) were established, the audited orthonormal selected sources u_n=A p_n would satisfy

    e_n^+=||R_+u_n||²→0,
    H[P_n]/X[P_n]≤1+o(1).

This does not prove H/X→0. It also does not assert that selected diagonal decay e_n^+→0 forces operator compactness: decay along a particular orthonormal basis is weaker than compactness. No uniform derivative bound, uniform lower gap, or negative-excess coherence follows from (3) alone.
