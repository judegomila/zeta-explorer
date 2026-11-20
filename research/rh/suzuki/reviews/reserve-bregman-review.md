# Suzuki recurrence: exact Bregman debt and the remaining signed-credit bound

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## 1. Normalization and exact event debt

Use the normalized C, F=C', h=C'', a, b=a-2, and prime-power events r_n=log q_n, w_n=Lambda(q_n)/sqrt(q_n) from `../curvature_bulk/SUZUKI_FOLLOWTHROUGH_ADDENDUM.md`. Write

    S_n=sum_(j<=n)w_j, J_n=sum_(j<=n)w_j r_j,
    u(S)=argmin_(r>=log2){C(r)-Sr},
    M_n=J_n-C*(S_n), H_n=S_n-b.

The independent scalar check proves S_1>F(log2), by more than0.265, and the closed lower root bracket is already strictly above log2. Since S_n increases, every actual post-event conjugate minimizer is interior. Thus u'(S)=1/h(u(S)) on every relevant update, without a hidden clamp case.

For an update from S to S+w at event r,

    M_new-M_old=w(r-u(S))-Q(S,w),
    Q(S,w)=integral_0^w (w-t)/h(u(S+t)) dt.                 (1)

This follows by two integrations of (C*)''=1/h(u). Since h and u are increasing,

    w²/[2h(u(S+w))] <= Q(S,w) <= w²/[2h(u(S))].           (2)

Q is the nonnegative Bregman remainder of C*. It is not the arithmetic Weil energy and is not a signed credit.

## 2. A completely explicit summable bound, with no PNT hypothesis

The closed conjugate uses

    C0(r)=4exp(r/2)+br-4+T_infinity,
    C0*(S)=2H[log(H/2)-1]+4-T_infinity,
    R_n=J_n-C0*(S_n), x0=(H/2)².

Its exact recurrence is

    R_new-R_old=w log(q/x0)-d(H,w),
    d(H,w)=2H[(1+w/H)log(1+w/H)-w/H],
    w²/(H+w)<=d(H,w)<=w²/H.                              (3)

The last inequalities follow from the second derivative2/(H+t). The elementary accepted Chebyshev bound psi(x)<=3x gives S(x)<=6sqrt(x)-3. Since b>-3, the value H before a new event q satisfies H<6sqrt(q). Also w<=log(q)/sqrt(q)<=2/e<1.

Suppose H>=H0>=6e. Then q>(H/6)²>=e². Monotonicity of log(q)/sqrt(q) yields

    w<=12 log(H/6)/H,
    d(H,w)<=w g(H),  g(H)=12 log(H/6)/H².

For t in[H,H+w],

    g(H)/g(t)<= (t/H)² <=(1+1/H0)².

Therefore, summing disjoint consecutive H-intervals and extending the integral to infinity,

    sum_future d <= B0(H0),
    B0(H0)=12(1+1/H0)²[log(H0/6)+1]/H0.                 (4)

No prime number theorem, zero hypothesis or assumption that every credit is positive is used. The bound remains valid even without using divergence of S: integration to infinity only enlarges the upper bound.

This extends to the **exact** conjugate debt in(1). Put alpha_k=2k+1/2, U(r)=sum_(k>=1)exp(-alpha_k r)/alpha_k² and T=T_infinity-U. At u>=log2,

    T'(u)<=delta0=(8/15)2^(-5/2),
    B(u):=exp(-5u/2)/(1-exp(-2u))<=1/(3sqrt2).

Because F(u)=2exp(u/2)+b+T'(u)=S,

    2h(u)=H-T'(u)-2B(u)>=H-c0,
    c0=2sqrt2/5<1.

Equations(2)-(4) give

    sum_future Q <= [H0/(H0-c0)] B0(H0).                 (5)

The finite event sum through q<=10000 gives H0=200.1521444021784... . Independent400-bit evaluation therefore gives

    sum_(future closed debts) d <0.272941,
    sum_(future exact conjugate debts) Q <0.273715.       (6)

These are bounds on all future **positive convexity debts**, not on the signed credits or reserve itself. They do not prove RH. The onset condition H0>=6e and all scalar rounding premises are certified in `suzuki_recurrence_replay/INDEPENDENT_COMPARISON_AND_DEBT_CONSTANTS.json`.

## 3. The real remaining scalar barrier can be weaker than nonnegativity

Let P_N be the partial sum of the signed credits w log(q/x0) in(3), starting after any fixed event. Since the positive debts have a finite total, R_N is bounded below uniformly in N if and only if P_N is bounded below uniformly in N. An identical statement holds for the exact credits w(r-u(S)) and M_N using(1),(5).

The closed-conjugate enclosure proves

    0<=R_n-M_n<=U(log2)<infinity.

Moreover each actual interval agrees with C(r)-S_n r+J_n, whose global minimum on r>=log2 is M_n. Hence M_n>=-K for all sufficiently large n implies Psi(r)>=-K' for every sufficiently large real r, for some finite K'. Using the exact relation

    D(r)=a r+T(r)-Psi(r),

one obtains the eventual upper bound D(r)<=O(1+r). The existing one-sided Landau bridge at exponent0 then gives RH. Conversely RH implies Psi>=0, hence M_n>=0 by the exact affine-majorant argument, and the signed-credit partial sums are bounded below.

Thus **bounded-below cumulative signed credit**, not a positive reserve margin or positive individual updates, is an RH-equivalent remaining target. This is a reduction of what must be proved, not a proof of that target. The quantifier is all sufficiently large partial sums, not selected successful events or a finite scan.

## 4. Sensitivity to the Chebyshev error and the constant term

Let E(x)=psi(x)-x and use right-continuous prime sums at an event. Exact Stieltjes partial summation gives

    S(x)=psi(x)/sqrt(x)+(1/2)integral_1^x psi(t)t^(-3/2)dt,
    S(x)-2sqrt(x)=-1+E(x)/sqrt(x)
                         +(1/2)integral_1^x E(t)t^(-3/2)dt.

Consequently the right derivative at r=log x is

    Psi'(r+)=b+1+T'(r)
       -[E(x)/sqrt(x)+(1/2)integral_1^x E(t)t^(-3/2)dt].    (7)

The constant is **-1** in the S formula and b+1 in(7). For a pre-event slope replace psi(x) by psi(x-), changing the point term by exactly w; the ordinary integral does not change.

Known unconditional prime-error bounds may make the relative location mismatch u(S)-log x tend to zero while still allowing a growing absolute accumulated-credit bound. For example an error envelope E(x)=O(x exp(-c sqrt(log x))) leads to a weighted error of order O(sqrt(x)exp(-c' sqrt(log x))) and an allowable absolute credit accumulation of growing order. That envelope alone supplies neither the required one-sided bounded partial sums nor a proof that the actual absolute sum diverges. Signed cancellation remains the missing information.

## 5. Primary criterion and evidence scope

Suzuki's [author version, equation(1.1) and Theorem1.7](https://arxiv.org/html/2206.03682v4#S1) was checked directly: pointwise nonnegativity of the normalized Psi on the real line is equivalent to RH; the screw function has the opposite sign. Our use of a uniform negative scalar floor is justified separately by the project's existing Landau reduction, not by misquoting that theorem.

The finite lower certificate Psi>11/400 on log2<=r<=log10000 has independent same-source192/256-bit replays and a different exact prime-power enumeration. It is a scalar constant-box result, not full-even operator positivity through lambda100. The count626 concerns negative **R** updates; actual reserve nonmonotonicity is independently established by the enclosure M5-M4<-0.0097725. No global signed-credit bound has been obtained.
