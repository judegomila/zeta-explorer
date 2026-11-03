# Reserved prefixes: whole-interval forcing control and the signed-density gap

This note gives a noncircular whole-interval bound on the actual pivot forcing inside the known theta old metrics. It also states precisely what changes when local densities become indefinite. All finite bounds concern [1/8,1/2] and the three-dimensional old matrices for even6/odd7. They do not prove a new target sign or a degree-uniform bound.

## 1. A correlated endpoint bound when the appended local old density is positive

Use the exact pivot-relative block from PIVOT_RELATIVE_VARIATION.md:
 K=[[C,w],[w^T,d]], d=s'/s, ||w||^2=E/s,
 E=r^TA^-1r, and B is a KNOWN positive prefix.
If B'>=0 throughout an interval, then K>=0. Hence C>=0,d>=0 and
 ||w||^2 <= d ||C|| <= d tr(C).                       (1)
This holds also for d=0: positivity then forces w=0. One proof for d>0 is the Schur inequality ww^T<=d C. Therefore, defining
 beta_s=log(s(b)/s(a)), beta_A=log(det A(b)/det A(a)),
 integral_a^b sqrt(E/s) <= sqrt(beta_A beta_s).        (2)
Cauchy--Schwarz is applied only after the actual PSD block coupling(1). Both endpoint quantities are known prefix data. The same hypothesis gives s'>=0, so s(H)>=s(a)>0 and
 integral |s'/s|=beta_s.
Thus an explicit pivot reserve and the full-interval forcing budget follow from actual local old positivity; no target gain is reused. For scalar first prefix s0, its log variation is simply beta0. At later prefix j, beta_A=sum_(i<j) beta_i.

Unlike a raw inverse-eigenvalue estimate, (2) is invariant under constant polynomial-basis changes within the lower span and fixed rescaling of the appended polynomial. It retains the actual inverse-selected regression vector through E. It is not a bound for the forcing of a new target whose local augmented matrix has not been proved positive.

## 2. Actual theta applications across the entire recovery region

The reviewed even3x3 local theorem and odd3x3 tail theorem apply throughout [1/8,1/2]; exact sources and positive diagonal congruences are recorded in RELATIVE_FLOW_CONDITIONING.md Section4. Therefore every leading local prefix in the actual old matrix is positive. The actual integrated starting old blocks are independently certified positive.

The owned endpoint checker reads only old moments M0..M4 for even6 and M1..M5 for odd7. It reads neither the target cross moments nor the target integrated moments or any prior gain file. It computes the three ordinary LDL pivots and their logarithmic endpoint ratios. Conservative results are:

Odd7 old block on(t,t^3,t^5):
 beta0<2.373942, beta1<3.001503, beta2<5.451166;
 integral sqrt(E1/s1)<2.669344;
 integral sqrt(E2/s2)<5.413173.

Even6 old block on(1,t^2,t^4):
 beta0<2.187063, beta1<2.627871, beta2<3.633664;
 integral sqrt(E1/s1)<2.397357;
 integral sqrt(E2/s2)<4.182804.

Here index1 or2 is an append step INSIDE the old three-dimensional matrix. Each s_j(H) remains at least its independently certified positive initial pivot throughout the whole region. These are genuine correlated whole-interval bounds, not isolated-cutoff tests, quadrature-cell counts or signed target-payment estimates. They supplement the previous old logdet conditioning budget; they do not increase its mathematical scope to a new degree.

## 3. Explicit signed-density accounting with a reserve

For indefinite B', the same known-pivot identity still gives d=s'/s, but(1) need not hold. Suppose one separately verifies the reserve
 s(H)>=rho s(a)>0 throughout[a,b],
 and bounds D_minus=integral (-s')_+ and J=integral E.
Then exactly
 integral |s'/s|=log(s(b)/s(a))+2 integral (-s')_+/s
 <=log(s(b)/s(a))+2D_minus/(rho s(a)),                 (3)
 and
 integral sqrt(E/s)<=sqrt((b-a)J/(rho s(a))).         (4)
Together with the preceding actual-prefix recursion, these provide a sufficient signed variation budget. The signed negative-source debit D_minus and actual inverse action J cannot be dropped. Bounds can be improved by retaining the actual reciprocal pivot under the integrals instead of the uniform reserve.

For actual theta at any fixed degree on a compact interval with certified lower-old positivity and reserve, the complete-theta derivative bounds and actual inverse enclosures make D_minus,J finite and computable. This is finite-degree existence of a bound, not a proved degree-uniform estimate. In particular, supplying a reserve alone does not establish that the available derivative envelopes are small enough or that their degree growth is acceptable.

## 4. Why reserve plus endpoint data alone is insufficient in the signed case

For clarity, the following is a generic exact matrix obstruction, not a theta counterexample. On[0,1], let f(H)=sin(2pi kH), integer k>=1, and
 B(H)=[[1,-f],[-f,1+f^2]].
Every B is positive, both LDL pivots are identically1, determinant1, and B(0)=B(1)=I. Thus there is a perfect pivot reserve and zero pivot log variation. Nevertheless z=f, r=-f', E=(f')^2, and the relative block is
 K=[[0,-f'],[-f',0]].
Its exact norm is |f'|; consequently integral tau_B=4k, and integral sqrt(E/s)=4k. Except where f'=0, the local derivative is indefinite. Endpoint data, pivot reserve, and even uniformly bounded entries of B do not control the required signed cross forcing. The positive-local-density premise in(2) therefore carries essential mathematical content.

Actual theta already supplies local-indefiniteness examples in the archived higher/regional work. We do not assert that the sinusoidal family is realizable by theta, or that its growth rate predicts theta behavior. It isolates the additional type of theta-specific estimate that is needed: a bound on the actual signed regression forcing, not solely on pivot reserves or endpoint determinants.

## 5. Remaining degree-uniform question

A well-separated adaptive partition can avoid the known admissibility-boundary singularity, but it must also control the signed cross-forcing budget once local positivity fails. Equations(3)-(4) are valid bookkeeping for that debt; uniform control of their theta terms is not established. Neither the positive finite bounds in Section2 nor the generic obstruction in Section4 decides the correlated target source sign. The actual target may have signed local losses even when the entire old metric enjoys the controlled budgets above, as the independently certified even6 adverse shell already demonstrates.
