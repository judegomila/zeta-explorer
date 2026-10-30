# Direct Suzuki recurrence: explicit reserve enclosure and summable convexity debt

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Results at a glance

1. The exact convex-conjugate reserve has an explicit elementary enclosure; no nonlinear inverse solve is required.
2. A closed reserve has an exact signed-credit/positive-debt update, and the entire infinite positive debt is unconditionally summable using only the project's elementary Chebyshev bound.
3. Consequently boundedness below of the accumulated signed credits is itself an exact RH-equivalent target. That arithmetic cancellation is still unproved.
4. All 1,280 prime-power events through x=10,000 pass a new 192-bit and 256-bit Arb certificate, proving

       Psi(r)>11/400  for log2<=r<=log10000.                 (0)

   This includes complete between-event intervals. It is a finite **scalar** certificate, not a full-form certificate and not a zero-height verification. No novelty or largest-known-range claim is made.
5. Actual reserves need not increase: the enclosure proves a strict decrease from the event q=4 to q=5.

## 1. Fixed notation

Use the actual centered physical box of width W=2log lambda. The previous addendum proves

    Psi(W)=aW+T(W)-D(W)=(W/2)q_W[e_0],
    a=(digamma(5/4)-log pi)/2,
    e_0=W^(-1/2)1_(|x|<=W/2),
    alpha_k=2k+1/2,  k>=1,
    T(r)=sum_(k>=1)(1-exp(-alpha_k r))/alpha_k^2.

This is exactly Suzuki's published Psi; its global nonnegativity is equivalent to RH. The actual screw function is -Psi. The constant box belongs to the logarithmic form domain and no periodic wraparound is used.

Put

    r_0=log2, b=a-2,
    T_inf=trigamma(5/4)/4=pi^2/4+2 Catalan-4,
    U(r)=T_inf-T(r)=sum_(k>=1)exp(-alpha_k r)/alpha_k^2,
    C(r)=4exp(r/2)+br-4+T_inf-U(r),
    F=C', h=C''>0  on r>=r_0.

Order the distinct prime powers q_n, and define

    r_n=log q_n, w_n=Lambda(q_n)/sqrt(q_n),
    S_n=sum_(j<=n)w_j, J_n=sum_(j<=n)w_j r_j,
    H_n=S_n-b,
    C*(s)=sup_(r>=r_0) [sr-C(r)],
    M_n=J_n-C*(S_n).

On [r_n,r_(n+1)], Psi=C-S_n r+J_n. The affine continuation of this expression majorizes Psi at all r>=r_0. Hence Psi>=0 globally on that half-line iff every M_n>=0. The reserve's exact recurrence is

    M_(n+1)-M_n=integral_(S_n)^(S_n+w_(n+1))[r_(n+1)-u(s)]ds,

where u(s) is the constrained maximizer for C*(s).

## 2. Closed conjugate enclosure

Define the explicit constants and functions

    delta_0=(8/15)2^(-5/2),
    x_-(H)=((H-delta_0)/2)^2,
    x_0(H)=(H/2)^2,
    epsilon(H)=(4/25)x_-(H)^(-5/2)/(1-x_-(H)^(-2)),
    epsilon_low(H)=(4/25)x_0(H)^(-5/2),
    R_n=J_n-2H_n[log(H_n/2)-1]-4+T_inf.

**Lemma 1.** At every actual prime-power event,

    R_n-epsilon(H_n) <= M_n <= R_n-epsilon_low(H_n).       (1)

In particular R_n>=epsilon(H_n) is a sufficient explicit event invariant. The error is O(H_n^-5); identifying this with a power of q_n is not required for the lemma.

**Proof.** For r>=log2, termwise bounds 1/alpha_k<=2/5 and exp(-2r)<=1/4 give

    0<T'(r)<=delta_0,
    0<U(r)<=(4/25)exp(-5r/2)/(1-exp(-2r)).                 (2)

The one-time scalar inequality

    S_1-b-delta_0-2sqrt2 > 0.2535

is outward-verified in the receipt. Since S_n increases, this holds for every n. It implies F(log2)<S_n, so every actual maximizer u(S_n) is interior; the clamp never activates for these event reserves. From F(u)=2exp(u/2)+b+T'(u)=S_n,

    2log((H_n-delta_0)/2)<=u(S_n)<=2log(H_n/2),             (3)

and the lower endpoint in (3) exceeds log2.

Let C_0(r)=4exp(r/2)+br-4+T_inf. Its maximizer for slope S_n is u_0=2log(H_n/2), and

    C_0*(S_n)=2H_n[log(H_n/2)-1]+4-T_inf.

Evaluate the actual supremum at u_0 for a lower bound, and its C_0 part at the actual maximizing u for an upper bound:

    C_0*+U(u_0) <= C* <= C_0*+U(u).

U decreases. Apply (3), the upper bound in (2), and U(u_0)>=(4/25)exp(-5u_0/2). Subtract from J_n to get (1). This is an inequality for the true conjugate, not an approximation pretending the gamma correction vanished. QED.

## 3. Exact elementary recurrence and its two-sided event debt

For the transition n to n+1 abbreviate H=H_n, w=w_(n+1), q=q_(n+1), and x_pred=(H/2)^2. Define

    credit_n=w log(q/x_pred),
    debt_n=2H[(1+w/H)log(1+w/H)-w/H].

**Lemma 2.** Exactly,

    R_(n+1)-R_n=credit_n-debt_n,                           (4)
    w^2/(H+w) <= debt_n <= w^2/H.                         (5)

To prove (4), subtract the explicit formula for R and use J_(n+1)-J_n=w logq. For (5), write phi(z)=(1+z)log(1+z)-z and use phi(0)=phi'(0)=0, phi''(z)=1/(1+z). Its integral remainder lies between z^2/[2(1+z)] and z^2/2.

The interpretation is precise: x_pred is a function of the *accumulated weighted prime count*, not a prediction of the next prime gap from local gap information alone. A short raw gap does not by itself determine the sign. Credit is negative exactly when q<x_pred.

The finite receipts find 626 negative R updates and 653 positive ones. This count concerns R, not M. A genuine M decrease follows independently from (1):

    M_at_q=4 >0.04241162,
    M_at_q=5 <0.03263904.                                  (6)

Thus neither the true reserve nor its closed surrogate has automatic monotone replenishment across every event.

## 4. Unconditional summability of the entire convexity debt

Only the elementary bound psi(x)<=3x is used. Its elementary binomial-coefficient proof is already included in `frequency_sensitive_bound/FREQUENCY_BLOCK_SUPPORT_BOUND.md` section 2. Partial summation gives

    S(x)=sum_(q<=x)Lambda(q)/sqrt(q)
        =psi(x)/sqrt(x)+(1/2)integral_1^x psi(t)t^(-3/2)dt
        <=6sqrt(x)-3.                                    (7)

The exact constant b lies in (-3,-2), outward-checked in the code through its stronger numerical enclosure. Before an event q,

    H=S_before-b<6sqrt(q).

Also w=Lambda(q)/sqrt(q)<=log(q)/sqrt(q)<=2/e<1. For H>=H_0>=6e, the function logq/sqrtq decreases on q>=e^2, so q>(H/6)^2 implies

    w<=12log(H/6)/H,
    debt<=w^2/H<=g(H)w,
    g(t)=12log(t/6)/t^2.                                  (8)

As H changes to H+w, for every t in that interval,

    g(H)/g(t)
       =(t/H)^2 log(H/6)/log(t/6)
       <=(1+1/H_0)^2.

The successive H intervals are adjacent. Summing their integrals and enlarging the upper endpoint to infinity proves the explicit bound

    sum_(all events after H_0) debt
      <= 12(1+1/H_0)^2 [log(H_0/6)+1]/H_0.                (9)

No prime number theorem, RH, or hypothetical density estimate is used. It is immaterial for the upper bound whether the H intervals exhaust the whole half-line. A finite initial segment with H_0>=6e is supplied by the event certificate. Thus the entire positive debt series is finite.

At the certified cutoff x=10000, H>200.15214 and the unconditional bound on all remaining debt is <0.272941. This bound is deliberately coarse and exceeds the local positive reserve; it does not certify continuation. Its important analytic feature is its decay to zero as the starting H increases. Taking absolute values of the signed credits is a separate and generally much larger loss.

## 5. An exact one-sided credit criterion, not an established credit bound

Let

    G_N=sum_(n=1)^(N-1) credit_n,
    D_N=sum_(n=1)^(N-1) debt_n.

Then R_N=R_1+G_N-D_N and D_N is uniformly bounded by section 4.

**Proposition.** The following are equivalent:

1. RH.
2. The sequence R_N is bounded below by some finite constant.
3. The sequence G_N is bounded below by some finite constant.

**Proof.** RH gives M_n>=0 by Suzuki's criterion and the exact affine-envelope reduction, so (1) implies R_n>=0. Equivalence of 2 and 3 follows from the finite nonnegative total debt.

If R_n>=-B, (1) gives M_n>=-B-epsilon(H_1), since epsilon decreases. Every actual interval satisfies Psi>=M_n, so Psi has a finite lower bound on r>=log2. Consequently

    D(r)=ar+T(r)-Psi(r)<=ar+T_inf+B+epsilon(H_1).

This is a one-sided polynomial upper bound on the actual D. The established Landau theorem in `rh_paper_recovery_20261028/source/sections/03-landau.tex` yields RH. The bounded initial interval has no effect. No global ordinary-L2 closed form is being assumed. QED.

This proposition isolates the missing global arithmetic theorem in an explicit signed event sum. It does not prove that theorem. Bounded total convexity debt alone does not constrain G_N from below. No novelty claim is made for an equivalent criterion obtained by exact algebra from known ones.

## 6. Exact weighted-Chebyshev sensitivity and a circularity warning

Let E(x)=psi(x)-x and include the lower endpoint E(1)=-1. Equation (7) gives exactly

    S(x)-2sqrt(x)
       =-1+E(x)/sqrt(x)+(1/2)integral_1^x E(t)t^(-3/2)dt.  (10)

Before an event q, put

    eta_q=H_before-2sqrt(q)=S(q-)-b-2sqrt(q).

Then

    credit=-2w log(1+eta_q/(2sqrt(q))).                    (11)

Thus the event score responds to both the current weighted counting error and its entire accumulated memory; a local prime-gap upper bound does not remove that memory. Since z-log(1+z)>=0 for z>-1,

    credit>=-Lambda(q)eta_q/q.                            (12)

Equation (12) preserves the sign of eta_q. Replacing it by an absolute error sum removes precisely the cancellation still needed.

A proposed all-scale estimate S(exp r)-2exp(r/2)<=C(1+r)^m is already RH-strength, not harmless preliminary input: D'(r)=S(exp r)-2exp(r/2)+2 away from seams, so integration would give a one-sided polynomial upper bound on D and the same Landau conclusion. The audit does not assume such a bound, nor any pointwise RH-quality estimate for E. The constants and exact finite calculations above require no such assumption.

## 7. Finite certificate and reproducibility scope

`certify_closed_reserve.py` enumerates prime powers exactly by an integer sieve, uses Lambda(p^k)=logp, and accumulates S and J with python-flint Arb. It uses (1), not a floating nonlinear minimum search. It checks every lower reserve against the predetermined rational 11/400. The bounds are for every real r between events, not just event samples.

Both 192-bit and 256-bit runs pass. There are exactly 1,280 events at q<=10000; the last is 9973, and its affine envelope covers the remaining interval through log10000. The lowest certified lower reserve is at q=3089:

    M_3089 >0.0275205733523513068207243458691.

Its enclosure has upper endpoint less than 0.027520573353620815. The interval locates a reserve value; it does not certify that this event gives the exact global minimum across every event. The fixed rational floor is certified for all of them, which is sufficient for (0).

The code also checks the exact credit/debt telescoping identity by interval overlap and proves (6). The accumulated positive debt through this cutoff is approximately 1.6159358, the accumulated signed credit approximately 1.60970184; the actual certificate retains full interval enclosures, not these shortened decimals.

Commands:

    python certify_closed_reserve.py --bits 192 --output CLOSED_RESERVE_192BIT.json
    python certify_closed_reserve.py --bits 256 --output CLOSED_RESERVE_256BIT.json

The earlier historical floating scan through 10^6 is not reused as a premise. This is a new, smaller, outward-rounded test of the explicit lower barrier. Nothing here extends whole-even coercivity beyond lambda=4. The direct scalar range (0) corresponds to sqrt2<=lambda<=100 for the constant box direction only.

## 8. Status and next focused question

The closed barrier and summable-debt mechanism have independent analytic review; copied-source replay of the finite certificate is being recorded in the separate independent-review directory. There is no proved lower bound on accumulated signed credits. The next investigation should study (10)–(12), or an exact summation-by-parts/entropy identity for those credits, without replacing them by absolute errors or silently importing an RH-strength weighted prime bound. Merely enlarging the finite cutoff does not address that missing theorem.
