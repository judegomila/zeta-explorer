# Paid source action with actual terminal conditioning

Status: exact deductions from the separately audited all-moments growth theorem; new deductions awaiting independent review. Numerical probes explicitly floating only. Frozen earlier packets untouched.

Use actual complete theta g=e^{au+lambda u²}psi, 0<a<=1/2, 0<=lambda<=1. Assume the actual old SAME-PARITY signed Gram is positive along the interval, so its monic degree-n Schur residual is well-defined. Strip common phase and put F=T(D)g, K=T'(D)g, L=T''(D)g. Write P=||F||² and s=<uF,F>; actual Schur S=(pi/2)s. No assumption that s>0 is used before the terminal point. The fixed-degree old physical span is V_lambda.

## 1. Explicit spatial hierarchy closure without raising degree

Let
 C(n,r)=[log(10(n+r+1))^(2r)+exp(-250(n+r+1)²)]^(1/2).
The accepted all-moments theorem gives ||u^r F||<=C(n,r)||F||. For any degree-k polynomial feature f,
 |integral u^(2r+1)|f|²| <= C(k,r+1) C(k,r) ||f||².
Thus every raised spatial moment in the exact hierarchy
 M'_(k,r)=2M_(k,r+1)-2k(k+2r+1)M_(k-1,r)+2r(2r+1)k(k-1)M_(k-2,r-1)
has an explicit positive-parent bound at the SAME jet degree. This is a hierarchy closure in spatial weights, not a signed Schur lower bound.

For rho=||K||/||F||, the gauged source X=u²F+2uK obeys
 ||X||/||F|| <= C(n,2)+2 C(n-1,1) rho.
All coefficients and lower-polynomial ratios remain actual quantities. No uncontrolled higher physical derivatives have been introduced.

## 2. Exact positive projection and free signed gauge

Let Pi_V be orthogonal projection onto V in ordinary positive L2(du). Actual signed stationarity says uF perpendicular V. Set
 R=(I-Pi_V)X, eta=||R||/||F||.
Then <uF,R>=<uF,X> exactly, and q=-Pi_V X is an allowed old-feature zero-integral gauge. Moreover R=(I-Pi_V)partial_lambda F: L and coefficient drift both lie in V.
Consequently
 s'=2<uF,R>,
 |s'| <=2 C(n,1) eta P,
 eta<=C(n,2)+2 C(n-1,1)rho.
These are actual derivative-ladder action bounds, not entropy analogies.

Every quantity is computable from finite positive Grams. If columns v_j span the full parity polynomial-feature space through degree n, x_j=u²v_j+2u k_j, and V contains old columns, define
 G=(<v_i,v_j>), H=(<x_i,x_j>)-(<x_i,V>) G_old^-1 (<V,x_j>).
For actual residual coefficients c, eta²=(c^T H c)/(c^T G c). H is PSD by positive projection. One may replace eta by sqrt(lambda_max(G^-1/2 H G^-1/2)), but that is an explicitly paid positive operator condition number, not automatic control of the signed Gram.

Let m_n(1)=s_1/P_1, b(lambda)=P_lambda/P_1. A sufficient return budget is
 2 integral_0^1 C(n,1) eta(lambda) b(lambda) dlambda < m_n(1).
This displays the actual terminal Schur conditioning factor 1/m_n(1); replacing it by 1 would be wrong. The simpler explicit sufficient envelope replaces eta by C(n,2)+2C(n-1,1)rho.

## 3. Terminal Newman real-zero reserve: what it really gives

At lambda=1 the known de Bruijn real-zero region applies: for the standard Phi and H_t conventions, psi(2u)=4Phi(u), hence F_lambda(z)=8H_(4lambda)(2z). The standard de Bruijn real-zero regime t>=1/2 safely covers lambda=1. The even order-one function has a real paired-zero product. For its positive real zeros r_j, with multiplicity,
 q_1(t,a)=W_1(t,a)/|F_1(t+ia)|²
 =a sum_j [1/((t-r_j)²+a²)+1/((t+r_j)²+a²)].
(Here F_1 is the SPECTRAL theta transform, not the physical residual F above.) There is no quadratic Gaussian exponential term: order one and evenness exclude it. This identity is used only at the known real-zero terminal, not at lambda=0.

The actual conditioning m_n(1) equals the positive spectral average of q_1 under density proportional to |p_n(t) F_1(t+ia)|². In particular a single known terminal zero pair +/-r_* yields
 m_n(1)>= 2a/(tau_n+r_*²+a²),
 tau_n=integral t²|p_n F_1|² / integral |p_n F_1|²
       =||D[p_n(-iD)g_1]||²/P_1.
Proof: writing A=t²+r_*²+a², the pair contributes 2aA/(A²-4t²r_*²)>=2a/A; apply Jensen to 1/x. This is a genuine lower reserve, but it involves the actual terminal spectral second moment. The spatial-multiplier theorem does NOT bound tau_n: it bounds u multiplication, not D.
A corresponding explicit sufficient test is
 (tau_n+r_*²+a²)/a * integral C(n,1) eta b <1.
Additional real-zero density/spacing estimates could improve this; qualitative real-rootedness alone supplies no such improvement here.

## 4. Precise degree mismatch of this envelope

Always |m_n(1)|<=C(n,1)=O(log n). The unprojected all-moments sufficient envelope, even discarding its nonnegative rho term, divided by m_n(1)>0, is at least
 2 C(n,2) integral_0^1 b(lambda) dlambda.
Thus whenever the parent path mass ratio has a positive degree-independent lower bound, this PARTICULAR sufficient envelope diverges at least as log² n. It cannot prove a degree-uniform return on the fixed interval. This is a mathematical statement about loss in the chosen upper estimate, NOT a lower bound on the true signed source or a counterexample to RH. Shrinking the lambda interval would dodge, not resolve, the requested fixed-interval comparison.

With the exact projected eta, the missing condition is explicitly
 weighted average eta < m_n(1)/(2 C(n,1) integral b).
Even granting the maximum allowed terminal m_n=O(log n), eta must be controlled at O(1), not the O(log² n)+O(rho log n) delivered by multiplier growth. For terminal one-zero lower bounds and tau_n of polynomial size, the sufficient condition is still more stringent. This separates spatial confinement from the still-missing signed cancellation/conditioning estimate.

## 5. Actual-theta floating test (not certificates)

Own-source probe_conditioning.py uses 1200 GL nodes, ten orbits, |u|<=3,48 lambda GL nodes, a=.25. The positive projection and signed residual solves are rescaled; no interval or full-tail acceptance is claimed. Representative values:
 n     terminal m       Cauchy action / terminal      reflected positive-part / terminal
 2       .019510                5.618912                         .273220
 5       .034392               11.762084                         .589663
 9       .050065               14.669008                        1.015083
 15      .071737               12.709567                        1.245588
The probe uses the valid relaxed constants C(n,r)<log(10(n+r+1))^r+1 when reporting growth envelopes. Its unprojected envelope ratio is thousands at these small degrees. Actual parent path integral/P_terminal is about .958 to1.145. These finite computations expose the mismatch already on actual theta; they are not asymptotic claims. The independently certified degree5 optimized signed gauge remains valid and is substantially sharper than this positive-L2 Cauchy route.

A separate floating terminal-zero scan finds the first positive root near12.9936910570. Substituting that diagnostic root and actual floating tau into the one-pair bound yields approximately .0024223,.0022278,.0019522,.0014035 at n2,5,9,15 respectively—smaller than the actual m by factors8.05,15.44,25.65,51.11. These are comparisons of floating quantities, NOT certified lower bounds. They quantify how much the most elementary real-zero reserve loses on the actual terminal theta function; using real-rootedness without zero-distribution information is substantially weaker than retaining the actual terminal conditioning matrix.
