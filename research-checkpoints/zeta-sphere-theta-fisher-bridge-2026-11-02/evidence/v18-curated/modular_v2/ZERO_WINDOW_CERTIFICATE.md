# A normalized full-theta certificate near a simple real Xi zero

2 November 2026. **Finite-domain result; no RH assumption and no all-height claim.**

## Result
The interval data and elementary estimates below prove, for the COMPLETE modular theta profile,

    |t − 7237/512| <= 1/16,       0 < a <= 1/8,

that

    W_a(t)/a >= 19551771/50000000000000
              = 0.00000039103542 > 0.                       (T)

The bound is uniform as a decreases to zero. Moreover Xi has one simple real zero in

    [7237/512 − 1/8192, 7237/512].                           (Z)

The center is near the familiar first nontrivial critical-line zero, but this computation does NOT count all zeros below it and does not itself prove that the enclosed zero is the first. This result is a controlled neighborhood around one actual simple real zero, not new global RH progress.

The computer-assisted part is a 50-decimal-digit interval Simpson calculation, with analytic enclosures for both the infinite theta-index tail and infinite spatial integration tail. Code, interval outputs, and the exact elementary deduction are included. This is not a proof-assistant formalization. Independent review status is recorded in REVIEW.md when completed.

## 1. A normalized local jet criterion
Let Q(z)=Xi(z)=integral_0^infinity psi(u)cos(zu)du. For every a>0,

W_a(t)/a = integral_0^1 { |Q'(t+isa)|²
                    − Re[Q''(t+isa)overline(Q(t+isa))] } ds.  (1)

Indeed W_a=(1/2)∂_a|Q(t+ia)|², and the first a derivative of the squared modulus vanishes at a=0 by conjugation symmetry. Its second derivative is twice the integrand in (1). This is an exact identity, not a finite-difference approximation or a division of an uncontrolled error term by a.

Assume certified bounds at a real center t0:

|Q(t0)|<=b0,  m1<=|Q'(t0)|<=b1,  |Q''(t0)|<=b2,
M3(A):=integral_0^infinity u³psi(u)cosh(Au)du<=B3.

For |t−t0|<=delta and 0<=a<=A, choose r>=sqrt(delta²+A²). Then on each segment from t0 to t+isa,

|Q'''(z)|<=B3,
|Q''(z)|<=B2:=b2+B3r,
|Q'(z)|>=m:=m1−B2r,
|Q(z)|<=B0:=b0+b1r+(B2/2)r².                               (2)

The first estimate follows directly from the full theta integral, since |sin(zu)| and |cos(zu)| are at most cosh(Au) in the strip. The others follow from the fundamental theorem of calculus and the second-order integral Taylor formula along a complex segment. Thus, if m>0 and

    kappa:=m²−B2B0>0,                                      (3)

(1) proves W_a(t)/a>=kappa uniformly throughout the rectangle. No lower bound for |Q| is needed; the criterion remains well-conditioned at a zero of Q.

This is the useful distinction from the earlier phase-ratio certificate: Q'/Q becomes singular near a real zero, but the undivided jet form (1) remains regular and the positive |Q'|² channel can dominate the negative coupling.

## 2. Exact head–tail coupling retained
For Q=H+R, where H is a theta-index head and R the exact arithmetic tail, define
L[Q]=|Q'|²−Re(Q''overline Q).
Then exactly

L[H+R]=L[H]
 +2Re(H'overline R')−Re(H''overline R+R''overline H)
 +|R'|²−Re(R''overline R).                                 (4)

No tail spectral positivity is assumed. The interval calculation below encloses the signed head integrals together with the exact theta tail before applying (2)–(3). It does not replace psi by a finite cutoff as a global profile.

In jet coordinates x=(Q,Q',Q'') the integrand is x*Jx with

J = [[0,0,−1/2],[0,1,0],[−1/2,0,0]],

of inertia (2,1). This matches the first nontrivial indefinite output in the coupled hierarchy state. The local proof supplies an actual bound on the negative coupling; positivity of an enlarged matrix alone would not suffice.

## 3. Interval targets and exact rational deduction
Take

    t0=7237/512=14.134765625,   delta=1/16,   A=1/8,
    r=7/50=0.14 > sqrt(5)/16.

The validated calculation gives the following deliberately widened rational targets:

    |Q(t0)| < 1/10000000,
    −139/100000 < Q'(t0) < −138/100000,
    |Q''(t0)| < 161/100000,
    M3(1/8) < 1/125.

Hence

    B2=273/100000=0.00273,
    m=4989/5000000=0.0009978,
    B0=110727/500000000=0.000221454,
    kappa=m²−B2B0=19551771/50000000000000.

These are exact rational computations; no floating-point sign decision is used in the deduction. They prove (T).

## 4. Actual stored interval enclosures
The complete decimal endpoints are stored in zero_window_intervals.json. Outward-rounded short versions are

    −5.5985002180e−8 < Q(t0) < −5.5963650567e−8,
    −0.001382654204171 < Q'(t0) < −0.001382654189525,
     0.001602887468773 < Q''(t0) < 0.001602887480702,
     0.007673532144327 < M3(1/8) < 0.007673532151571.

All four coarse targets have ample margin. The run used 867 accepted dyadic Simpson intervals and completed in approximately 8.4 seconds in the recorded environment (Python 3.12.14, mpmath 1.3.0). Execution time is not mathematical evidence.

## 5. Validated theta-index tail, including derivatives
For u>=0 put r_n=pi n²exp(2u). The exact derivative formulas are

psi^(j)(u)=4exp(u/2)sum_(n>=1) p_j(r_n)exp(−r_n),
p_0(r)=2r²−3r,
p_(j+1)(r)=(1/2−2r)p_j(r)+2r p_j'(r).

The code uses the exact polynomial coefficients for j=0,...,4. Their degrees are at most six and each sum of absolute coefficients is below 10000. With r=pi exp(2u)>=pi, the n>=7 omitted part of ANY such derivative is bounded by

40000 exp(u/2−r)(1+r)^6 sum_(n>=7)n^12 exp[−pi(n²−1)]
 < 10^(−45) exp(u/2−r)(1+r)^6.                              (5)

The first term is 7^12exp(−48pi); each subsequent term has ratio at most (8/7)^12exp(−15pi)<10^(−19). This proves the very conservative final constant. The implementation adds the symmetric interval (5) to every theta derivative evaluation, so its infinite tail is never omitted.

## 6. Validated finite-interval integration
The four integrands are

F_j(u)=u^j psi(u)cos(t0u+j*pi/2), j=0,1,2,
F_3(u)=u³psi(u)cosh(u/8).

For each dyadic interval [l,r] with length d and midpoint m, Simpson's rule has the rigorous remainder bound

integral_l^r F(u)du in d[F(l)+4F(m)+F(r)]/6
                    +[-1,1]d^5 sup_[l,r]|F^(4)|/2880.       (6)

The code computes interval enclosures for the fourth derivative by the exact product rule. If P(u)=u^jpsi(u),

P^(k)(u)=sum_(ell=0)^min(k,j) binomial(k,ell)
                  j!/(j−ell)! u^(j−ell)psi^(k−ell)(u),

and F^(4) is the sum of binomial(4,k)P^(k) times the corresponding fourth-minus-k trigonometric/hyperbolic derivative. These formulas involve only the enclosed psi derivatives of (5).

All endpoints and bisection nodes are exact dyadic numbers. Interval precision is 50 decimal digits; auxiliary dyadic arithmetic and endpoint serialization use 60 digits. An absolute tolerance 10^(−10) distributes acceptable interval remainders; tolerance only chooses subdivisions and is not itself taken as a proof of error. The explicit sum of the enclosures (6) supplies the certificate. An additional symmetric 10^(−30) inflation is applied before endpoint serialization, far exceeding conversion roundoff and negligible for all target margins.

## 7. Infinite spatial tail
The elementary majorant

psi(u)<=100exp(9u/2−pi exp(2u)), u>=0,

follows by discarding the negative term in each theta summand and using
8pi²sum_(n>=1)n^4exp[−pi(n²−1)]<100.
For the four integrands above, u^j<=exp(ju) and cosh(u/8)<=exp(u/8), so on u>=4 every absolute integrand is at most

100exp(10u−pi exp(2u)).

The tangent bound exp(2u)>=exp(8)[1+2(u−4)] yields the integral bound

100exp(40−pi exp(8))/(2pi exp(8)−10) < 10^(−3000).             (7)

Very coarse elementary estimates pi>3 and exp(8)>2900 already suffice. The script adds the symmetric interval of radius 10^(−3000) to each integral, including the positive moment (using a symmetric enclosure is conservative).

## 8. Existence and simplicity of an actual enclosed real zero
The stored enclosure gives Q(t0)<0 and Q(t0)>−10^(−7). Put d=1/8192. Throughout [t0−d,t0], (2) gives

Q'(t)<=−0.00138+0.00273d < 0.

Therefore

Q(t0−d)>=−10^(−7)+d(0.00138−0.00273d)>0.

The last inequality is exact rational arithmetic. The intermediate value theorem gives a real zero in (Z), and the strictly negative derivative there proves uniqueness in that interval and simplicity. No zeta zero lookup or assumption that other zeros are real is used.

## 9. Scope and next obstruction
The theorem certifies a genuine finite-height neighborhood with shifts extending uniformly down to zero. This closes a weakness of scalar phase certificates near a zero and supplies a validated starting region for a coupled-tail method.

It does not prove positivity between all successive zero neighborhoods, provide a uniform radius/margin for all zeros, prove all zeros simple, exclude hypothetical nonreal zeros elsewhere, or extend the upper shift bound beyond 1/8 here. Any global continuation would require validated overlap/margin information at unbounded heights or a new analytic theorem. The present finite rectangle must not be described as a proof of RH.
