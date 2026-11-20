# Degree-adaptive rational residual: a quantified link to the original pivot

New companion awaiting independent review. The physical base remains b=2. The free parameter s>0 below is an AUXILIARY resolvent test of the same normalized theta density; increasing s does not change the arithmetic base, theta profile, or its zeros.

Use the audited notation Lambda=F'^2-FF'', mu[r]=integral r(t²)Lambda, P_N the known monic orthogonal polynomial built from the current positive two-parity prefix, and
 Delta_N(s)=J(s)-b^TC_N(s)^-1b
           =integral P_N(t²)²Lambda(t)/(t²+s)dt / P_N(-s)².
Here J(s)=integral Lambda/(t²+s), with the argument now s=d². The denominator is nonzero for every s>0 by the known positive even and odd blocks. No next norm is assumed.

## 1. Exact extraction with an explicit noncircular error

Let h_N=mu[P_N²], the ORIGINAL unpaid next even pivot. The exact identity is
 h_N-sP_N(-s)²Delta_N(s)
  =integral [t²/(t²+s)]P_N(t²)²Lambda(t)dt.
Consequently
 |h_N-sP_N(-s)²Delta_N(s)| <= B_N/s,                    (1)
 B_N=integral t²P_N(t²)²|Lambda(t)|dt<infinity.
B_N can be bounded without using the sign or size of h_N. Put T=D P_N(-D²) and use the full theta profile psi. Cauchy--Schwarz and Parseval give
 B_N <= 2pi[ ||T(u psi)||_2²
                  +||T psi||_2 ||T(u² psi)||_2 ].       (2)
These are explicit positive full-theta norms with known polynomial coefficients. They may be large and involve higher jets, but no unknown signed pivot occurs in a denominator or is assumed positive. The previously established full-theta jet and spatial moment bounds can bound these norms; no uniform smallness is claimed.

For an entirely explicit (conservative) bound, write P_N(x)=sum_j c_j x^j. The previously audited theta strip bound is ||psi^(k)||<=64 k! (8/3)^k. Let E(k,0)=1 and E(k,r)=[log(10(k+r+1))]^r+1 for r=1,2, from the audited positive-parent spatial bound. Set
 Q_r=64 sum_(j=0)^N |c_j| sum_(ell=0)^min(2j+1,r)
      binom(2j+1,ell) r!/(r-ell)!
      E(2j+1-ell,r-ell) (2j+1-ell)! (8/3)^(2j+1-ell).
Leibniz and those two established bounds give ||T(u^r psi)||<=Q_r, so B_N<=2pi(Q_1²+Q_0 Q_2). This upper envelope can be very large; its size is not suppressed or called a useful uniform reserve.

If a certified scalar lower estimate J_low(s)<=J(s) is available, the following is a genuine sufficient lower bound on the original pivot:
 h_N >= sP_N(-s)²[J_low(s)-rho_N(s)]-B_N/s,
 rho_N=b^TC_N(s)^-1b.                                 (3)
This retains the actual known inverse feedback. Thus this auxiliary route CAN imply a next-pivot sign, but only if the displayed complete right side is positive. Positivity of Delta_N alone at a fixed s is insufficient.

For each fixed N, (1) also proves
 lim_(s->infinity) sP_N(-s)²Delta_N(s)=h_N,
 Delta_N(s)=h_N s^(-2N-1)+O_N(s^(-2N-2)).              (4)
The coefficients and error constants are actual theta quantities; no uniform-in-N asymptotic is inferred.

## 2. Concrete obstruction to fixed-s positivity implying a next pivot

This finite signed-measure example illustrates the logical implication only; it is NOT the complete theta density. On x>=0 take weights1 at0,1 at1, and-1/100 at10. Then
 mu_0=199/100>0, mu_1=9/10>0, mu_2=0.
So the two required old parity blocks for N=1 are positive. But
 h_1=mu_2-mu_1²/mu_0=-81/199<0.
At s=1/4,
 J=4919/1025>4,
 rho_1=39601/13975<3,
 hence Delta_1>1 while the original next pivot is negative.
The missing correction in(1), or additional theta information excluding this behavior, is indispensable. The example does not invalidate(3).

## 3. What scalar accuracy the original pivot requires

An error epsilon in J becomes an error sP_N(-s)²epsilon in(3). For large s and fixed N this is of order s^(2N+1)epsilon. To certify a desired positive original reserve tau_N, scalar accuracy on the scale tau_N/[sP_N(-s)²] is needed, in addition to paying B_N/s. This is a degree-dependent cancellation requirement, not a new positive reserve. The earlier fixed positive floor cannot achieve it.

The actual positive theta representation identifies how to refine J without assuming its sign density. Set
 C(r)=integral_R v²psi(r+v)psi(r-v)dv>0.
A change of variables in the audited double integral gives
 J(s)=8pi/sqrt(s) integral_0^infinity C(r)exp(-2sqrt(s)r)dr. (5)
C is even and has the analyticity and domination inherited from the full theta profile. Its mass near r=0 produces the large-s cancellations. In particular C(0)=integral v²psi(v)² and the leading term is mu_0/s, with mu_0=4pi C(0).

A sufficiently accurate certified positive-kernel quadrature of(5) can supply J_low for a finite degree. However, a uniform proof needs an error estimate small relative to the rational residual in(3), not merely an absolute accurate evaluation of J. Taylor coefficients of C at high order recover the same signed moment hierarchy; assuming their favorable signs would reintroduce the unpaid pivot.

## Remaining inequality

No estimate presently proves
 sP_N(-s)²[J_low(s)-rho_N(s)] > B_N/s
for a degree-dependent choice s=s_N at every N. Equations(1)-(5) give the exact noncircular target and its error/precision cost. They neither hide the original top moment nor establish a uniform induction.
