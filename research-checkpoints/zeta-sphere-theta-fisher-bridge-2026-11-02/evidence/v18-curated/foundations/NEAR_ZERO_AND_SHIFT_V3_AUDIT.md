# Independent near-zero and shift-hierarchy audit

2 November 2026. This audits the modular_v2 finite-window certificate and hierarchy/shift_v3 identities. It does not assume RH, and a verified real zero in this window is not identified as the first zero by these computations.

## 1. Near-zero interval computation: PASS

Reviewed modular_v2/certify_zero_window.py and zero_window_intervals.json. Center t0=7237/512 is exactly dyadic; A=1/8. The four integrands are psi*cos(t0 u), -u psi*sin(t0 u), -u²psi*cos(t0 u), and u³psi*cosh(u/8). The code's phase cycling and all fourth-derivative product terms match these integrands exactly.

The interval Simpson error per panel is sup|f''''|d^5/2880. Cached endpoint values do not alter the enclosure. The theta derivative polynomials through order four match the previously independently reproduced recurrence. The full omitted n>=7 theta derivative tails are enclosed by 10^-45 exp(u/2-r)(1+r)^6; the elementary bound established in CROSS_REVIEW.md §H applies unchanged.

The spatial integrands for u>=4 are dominated by 100u³ exp((37/8)u-pi exp(2u)). Its logarithmic derivative is at most -exp(8) there. With pi>3 and exp(8)>2500, its value at 4 divided by exp(8) is far below 10^-3000. Thus the code's symmetric 10^-3000 spatial-tail inflation is valid for all four integrals. The 10^-30 serialization inflation is conservative relative to 50-digit interval/60-digit endpoint arithmetic.

The saved intervals imply the deliberately widened rational inequalities

|Xi(t0)|<10^-7,
-0.00139<Xi'(t0)<-0.00138,
|Xi''(t0)|<0.00161,
M3:=integral_0^infinity u³psi(u)cosh(u/8)du<0.008.

The Xi(t0) interval is strictly negative, approximately [-5.598500218e-8,-5.596365056e-8]. This last sign is retained separately from the absolute bound.

Classification: reviewed interval computational certificate relying on the installed interval-arithmetic implementation, not proof-assistant formalization. The interval results concern the full theta profile because both index and spatial tails are included.

## 2. Independent exact reconstruction of the rectangle bound

Let |t-t0|<=1/16 and 0<=b<=1/8. The distance from t0 to z=t+ib is at most sqrt(5)/16<r=7/50=0.14. Throughout the relevant line segments, |Im z|<=1/8, so |Xi'''(z)|<=M3<0.008 by the theta integral. Consequently

|Xi''(z)|<=0.00161+0.008r=273/100000=0.00273,
|Xi'(z)|>=0.00138-(273/100000)r=4989/5000000=0.0009978,
|Xi(z)|<=10^-7+0.00139r+(273/100000)r²/2
        =110727/500000000=0.000221454.

These constants were reconstructed using exact rational arithmetic. For every 0<a<=1/8, the exact identity

W_a(t)/a=integral_0^1 [|Xi'(t+isa)|²-Re(Xi''(t+isa)overline(Xi(t+isa)))] ds

therefore gives

W_a(t)/a >= (4989/5000000)²
             -(273/100000)(110727/500000000)
          =19551771/50000000000000
          =3.9103542*10^-7 >0.

This bound is uniform as a decreases to zero and applies to the entire stated finite rectangle, not just its center or a finite collection of nodes. It does not extend to arbitrary heights or to a>1/8.

## 3. Exactly what is proved about a real zero

On the real interval |t-t0|<=1/16, Xi' remains strictly negative by the same bound (its center value is negative and its variation is smaller than 0.00138). Since Xi(t0)<0 and

Xi(t0-1/4096)>=Xi(t0)+(0.0009978)/4096>0,

the intermediate value theorem gives a real zero in (t0-1/4096,t0). Strict negativity of Xi' proves that it is simple and the only real zero in the larger certified real interval. This is a local occurrence and uniqueness result; proving that no earlier positive real zero exists is a separate task not performed here.

The positive shear also excludes nonreal zeros inside the open shifted rectangle, since W vanishes at any zero of Xi. This local exclusion is not RH.

## 4. Derivative tower: PASS

For any real entire f, let H_j=|f^(j)(t+ia)|² and W_j=(1/2)partial_a H_j. Holomorphy gives

(partial_a²+partial_t²)H_j=4H_(j+1),
(partial_a²+partial_t²)W_j=4W_(j+1).

For f(z)=z²+b², direct multiplication gives W_0=2a(a²+t²-b²), W_1=4a. Thus a positive forcing term at the next derivative level does not by itself preserve inward positivity. This polynomial example illustrates the differential sign issue; it is not being asserted to satisfy the theta profile's rapid-decay hypotheses for the infinite-strip representation below.

## 5. Strip Green representation and normalizations: PASS

On the strip 0<a<A, take the positive Dirichlet Green function for -Delta:

G_A(a,t;b,s)=(1/(4pi)) log[(cosh(pi(t-s)/A)-cos(pi(a+b)/A))
                          /(cosh(pi(t-s)/A)-cos(pi(a-b)/A))].

Its logarithmic singularity is -(1/(2pi))log distance, so -Delta G=delta. It vanishes on both boundaries. The upper-boundary Poisson kernel is

P_upper(a,t)=sin(pi a/A)/[2A(cosh(pi t/A)+cos(pi a/A))].

For the theta profile W_0 and all derivatives decay rapidly in t uniformly over closed bounded a intervals, and W_0(0,t)=0. Hence

W_0(a,t)=P_upper(a,.)*W_0(A,.)(t)
         -4 integral_0^A integral_R G_A(a,t;b,s)W_1(b,s)ds db.

The minus sign before the forcing integral is essential: Delta W_0=4W_1 whereas G inverts -Delta.

At the lower boundary,

lim_(a->0) P_upper(a,t)/a=K_A(t)
 =pi/(4A²) sech²(pi t/(2A)),
partial_a G_A(0,t;b,s)=P_lower(b,t-s)
 =sin(pi b/A)/[2A(cosh(pi(t-s)/A)-cos(pi b/A))].

Therefore

L_1[f](t)=K_A*W_0(A,.)(t)
          -4 integral_0^A P_lower(b,.)*W_1(b,.)(t)db.

The boundary limit is legitimate for the theta data: W_1(b,t)=O(b) uniformly locally as b decreases to zero; its t decay is uniform, and P_lower has L1 mass (A-b)/A<=1. Standard Green identities or a truncation followed by these bounds justify the limiting integral. This is an exact signed relation, not a positivity-preserving propagation formula.

## 6. Resummed two-state autocorrelation: factors PASS

Let g_a(u)=exp(au)psi(u), with full even psi. The autocorrelation must be evaluated at shift TWO v:

D_a(v)=(1/2) integral_R g_a(u)g_a(u+2v)du.

After u=h-v, evenness gives D_a(v)=integral_0^infinity cosh(2ah)psi(h-v)psi(h+v)dh, and C_a(v)=(1/2)partial_a D_a(v). The matrix autocorrelation of g_a and u g_a contracts against the constant matrix with zero diagonal and off-diagonal 1/4. Using an ordinary shift v instead would change the argument and be a normalization error.

Put
A0=integral_R exp(2au)psi(u)²du,
B0=integral_R u²exp(2au)psi(u)²du,
J0=integral_R u exp(2au)psi(u)²du.

The exact optimal negative mass in the specified constant signed two-feature decomposition is delta=(sqrt(A0 B0)-J0)/4, while C_a(0)=J0/2. Writing m_k=integral_0^infinity u^(2k)psi(u)²du, one has

A0=2m0+O(a²), B0=2m1+O(a²), J0=4a m1+O(a³),
delta/C_a(0)=sqrt(m0/m1)/(4a)-1/2+O(a).

This quantifies cancellation in this explicit two-feature representation. It is not a lower bound over all conceivable representations or feature maps.
