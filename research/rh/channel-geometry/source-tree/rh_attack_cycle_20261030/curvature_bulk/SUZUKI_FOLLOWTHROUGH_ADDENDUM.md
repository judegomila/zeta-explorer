# Addendum: the new other-chat report is Suzuki's criterion and the constant-box test

30 October 2026. Read-only mathematical audit of all eight pages of `Mixed_Curvature_RH_Followthrough.pdf`, posted in the other conversation's new answer (private history link omitted). The report was read through Library; its exact IDs, metadata, and full text extract are retained in `suzuki_followthrough_review/`. Its floating scan was NOT rerun, its ZIP was NOT inspected, and no numerical certificate is asserted here. The earlier curvature audit is unchanged.

**Verdict:** the main scalar identification is correct and is explicitly a known RH-equivalent criterion, not a new all-scale estimate. There is a particularly useful exact connection to our existing normalization:

    Psi(W)=(W/2) q_W[e_0],
    e_0(x)=W^(-1/2) 1_(|x|<=W/2).                           (A)

Thus the circumference comparison is exactly the actual constant-box test energy, not a replacement for the whole-space spectral lower bound.

## 1. Primary-source check and the exact D relation

The source is Masatoshi Suzuki, *Aspects of the screw function corresponding to the Riemann zeta-function*, Journal of the London Mathematical Society 108 (2023), 1448–1487, [doi:10.1112/jlms.12785](https://londmathsoc.onlinelibrary.wiley.com/doi/10.1112/jlms.12785); [author preprint](https://arxiv.org/abs/2206.03682). The published equation (1.1) defines Psi using prime powers and explicit gamma/Lerch corrections. Theorem 1.7 states that its nonnegativity everywhere is equivalent to RH; under RH it is strictly positive away from zero. The actual screw function is -Psi. These source assertions were checked directly, not inferred from a search snippet or the other assistant's claim.

To compare that published normalization to ours, define

    a=(digamma(5/4)-log pi)/2,
    alpha_k=2k+1/2,  k>=1,
    T(W)=sum_(k>=1) (1-exp(-alpha_k W))/alpha_k^2.

The report's function is exactly

    Psi(W)=aW+T(W)-D(W),                                  (B)
    D(W)=sum_(n<=exp W) Lambda(n)/sqrt(n)(W-log n)
              -4(exp(W/2)-1)+2W.

Here T is continuous at zero and bounded by T(infinity)=trigamma(5/4)/4. Its differentiated series is used only at W>0.

Independent algebraic verification against Suzuki's formula: digamma(1/4)=digamma(5/4)-4, so the coefficient of W in that formula is a-2. Its Lerch difference equals

    sum_(k>=0) (1-exp(-(2k+1/2)W))/(2k+1/2)^2
      =4(1-exp(-W/2))+T(W).

This cancels the decaying exponential in the published pole term. What remains is

    4(exp(W/2)-1) - prime triangular sum +(a-2)W+T(W),

which is precisely (B). No pole correction, endpoint prime-power term, or constant has been dropped.

The reference metric in the report has conformal primitive aW+T(W). Both circumference functions use the same coordinate circle of period 2pi. Their ratio is therefore exactly exp(aW+T-D)=exp(Psi). The conclusion 'ratio at least one everywhere iff RH' is correct, but its hard hypothesis has not been proved by constructing the two metrics.

## 2. Independent derivation of the exact constant-test identity

Let A denote the actual shifted-5/4 gamma form and

    K(r)=2exp(-5r/2)/(1-exp(-2r))
        =2 sum_(k>=1) exp(-alpha_k r).

The normalized constant box has autocorrelation

    R_0(r)=(1-r/W)_+, r>=0.

Its actual gamma diagonal is exactly, for EVERY W>0,

    A_00(W)=2a+(1/W)integral_0^W rK(r)dr
                        +integral_W^infinity K(r)dr.        (C)

This follows directly from the positive translation-energy representation of the gamma multiplier. The kernels in (C) are integrable; termwise summation uses nonnegative terms. For each alpha>0,

    integral_0^W r exp(-alpha r)dr
       +W integral_W^infinity exp(-alpha r)dr
         =(1-exp(-alpha W))/alpha^2.

Multiplying (C) by W/2 therefore gives

    (W/2)A_00(W)=aW+T(W).

Meanwhile the actual signed arithmetic pairing is exactly 2D(W)/W because R_0(r)=1-r/W. Combining these equalities proves (A).

**Domain and endpoints:** e_0 is not a smooth interior test but is a legitimate vector in the actual zero-extension logarithmic form domain. Its Fourier transform is O(1/|t|) at infinity, so its squared transform is integrable against log(2+|t|). The established local form-core theorem also permits even smooth form approximation. The calculation above uses actual overlap correlation, not periodic wraparound or a formal second derivative. R_0(W)=0 kills a prime-power atom at the endpoint. No boundary contribution has been lost. Indeed, differentiating R_0 twice only on (0,W) and discarding its endpoint term would incorrectly erase the entire D(W)/W contribution.

**Consequence for interpreting evidence:** testing Psi at finite W is testing ONE even direction. It does not certify positivity for every direction or the entire Fourier tail at that support. The report's floating range x=exp W<=10^6 corresponds to lambda=exp(W/2)<=1000, but is not a whole-even-space certificate through lambda=1000. The accepted full even positivity endpoint remains lambda=4.

Conversely, the already accepted whole-even certificate for 1<lambda<=4 implies Psi(W)>0 for 0<W<=log16 by (A). This covers the separate initial interval 0<W<log2 which the report excludes from its prime-power-event reduction. This is a consequence of the existing theorem, not a new numerical result.

## 3. Audit of the exact prime-power reserve formulation

This is an algebraic check of the report's equations, not a certification of its numerical implementation. Put r_0=log2 and

    C(r)=(a-2)r+T(r)+4(exp(r/2)-1),
    F(r)=C'(r),
    h(r)=C''(r)=exp(r/2)-exp(-5r/2)/(1-exp(-2r)).

For r>=r_0, h>0 and h'>0, so C is strictly convex and superlinear. Enumerate the distinct prime powers q_n increasingly and set

    r_n=log q_n, w_n=Lambda(q_n)/sqrt(q_n),
    S_n=sum_(j<=n)w_j, J_n=sum_(j<=n)w_j r_j.

On the actual interval [r_n,r_(n+1)], Psi=C-S_n r+J_n. Consequently the interval minimum is obtained by clamping the solution of F(r)=S_n to that interval. Convexity removes grid-resolution error in the mathematical specification; a floating inverse solve is still not a rigorous numerical enclosure.

Define the one-sided convex conjugate and its minimizer by

    C*(s)=sup_(r>=r_0) [sr-C(r)],
    u(s)=r_0 when s<=F(r_0), and u(s)=F^(-1)(s) otherwise,
    M_n=J_n-C*(S_n).

The exact global equivalence claimed in the PDF is valid:

    Psi(r)>=0 for all r>=r_0  iff  M_n>=0 for every n.

For clarity, the affine continuation L_n(r)=C(r)-S_n r+J_n majorizes Psi(r) at EVERY r>=r_0, not just on its own interval. Before r_n, any prematurely included event contributes +w_j(r_j-r); after r_(n+1), any omitted past event makes the actual Psi smaller. If Psi>=0 then all L_n>=0, hence all M_n>=0. Conversely each actual interval agrees with one L_n, so nonnegative M_n imply nonnegative Psi there.

Since (C*)'=u, the update is exactly

    M_(n+1)-M_n
       =integral_(S_n)^(S_n+w_(n+1)) [r_(n+1)-u(s)]ds.

Nothing in strict convexity fixes the sign of this integral. Summing it simply restates the arithmetic deficit that needs control.

The PDF's additional sufficient reserve

    B(r)=Psi(r)-max(-Psi'(r),0)^2/(2h(r))

also has the stated derivative and jump identities: between events it increases, while a positive prime-power atom lowers the derivative and withdraws a nonnegative amount from B. Its nonnegativity at every post-event point is sufficient, not proved necessary and not established uniformly. No missing automatic sign invariant was found.

## 4. The shrinking-margin constraint is valid, conditional on RH

Under RH the zero expansion is the uniformly convergent nonnegative series

    Psi(r)=2 sum_(gamma>0) (1-cos(gamma r))/gamma^2,

with multiplicities. The summability of gamma^-2 makes its tails uniformly small. Simultaneous recurrence of any finite set of real phases gives arbitrarily large r where the retained terms are arbitrarily small. It follows that

    inf_(r>=R) Psi(r)=0  for every R>0.

This is compatible with strict positivity at every individual r>0. It rules out a fixed positive all-large-r scalar margin as a plausible target. It does not prove nonnegativity without RH.

The report's conditional upper bound Psi<=2C_xi, with C_xi=xi''(1/2)/xi(1/2), is normalized consistently: C_xi=2 sum_(gamma>0)gamma^-2 under RH. Its printed decimal constants are evaluations, not interval endpoints, and were not certified in this audit.

## 5. Scope of acceptance

Accepted analytically: (B)'s exact Suzuki normalization; circumference comparison identity; the published global criterion as correctly attributed; the reserve equivalence and signed recurrence; the sufficient local-reserve bookkeeping; and the conditional shrinking-margin argument. Independently added here: (A), identifying the whole scalar proposal with the actual constant-box test.

Not accepted as new certified evidence: the reported 78,734-event floating scan, the numerical minimum near x=3099.71, its Decimal spot-check accuracy, or any larger-support operator bound. Those computations remain the report's explicitly floating diagnostics; no replay was requested or performed. No claim in the other report's cited later preprints or checkpoint certificates is needed for this audit.

The useful addition is a normalized connection to an established scalar criterion and a precise event-by-event arithmetic target. It does not supply the uniform-M all-mode floor, improve a coercivity constant, remove the signed arithmetic obstruction, or prove RH.
