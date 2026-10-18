# Uniform payment of the smooth prime-density tail

18 October 2026. New unconditional component of the Poisson tail-energy reduction. Independently checked in an internal mathematical review. The actual prime-discrepancy energy remains open.

Fix s0=417/500, h=1/8, s0<b<=7/8, x=b-s0>0, Q>=2 and T>0. For 1<=v<=Q define

D(v)=integral_(max(2,v))^Q [(1-y^(-h))y^(-b-iT)/log y] dy,

with zero if the integration interval is empty. Put

K=4/log 2+8/(log 2)^2.

Then, uniformly over the whole endpoint range,

|D(v)|<=K Q^(1-b)/T,                                      (1)

and its Poisson tail energy satisfies

x integral_1^Q v^(2x-1)|D(v)|^2 dv
 <=(K^2/2) Q^(2-2s0)/T^2.                                (2)

In particular Q<=sqrt(T) gives the upper bound (K^2/2)T^(-917/500). This is an upper bound on the smooth continuum component only, not on actual prime fluctuations.

## Proof with explicit constants

Write u=log y, a=1-b>=1/8 and l=log 2. The integral in (1) becomes
integral A(u)exp(-iTu)du, where A(u)=exp(au)(1-exp(-hu))/u.
On u>=l,
|A(u)|<=exp(au)/l,
|A'(u)|<=exp(au)[(a+h)/l+1/l^2].
Integration by parts over any subinterval ending at log Q therefore yields

|D(v)| <= Q^a/(T l) [2+(a+h+1/l)/a]
        = Q^a/(T l) [3+h/a+1/(a l)]
        <= K Q^a/T.

Here h/a<=1 and 1/a<=8. No prime theorem, height average, or cancellation hypothesis is used. Integrating the squared bound gives
x integral_1^Q v^(2x-1)dv=(Q^(2x)-1)/2<=Q^(2x)/2,
which proves (2), since 2x+2-2b=2-2s0. The exponent for Q<=sqrt T is (1-s0)-2=-1-s0=-917/500.

## Exact arithmetic remainder retained

Let
A_prime(v)=sum_(v<=p<=Q)(1-p^(-h))p^(-b-iT),
Delta(v)=A_prime(v)-D(v).
Equivalently Delta is the same weighted oscillatory Stieltjes tail against d(pi(y)-li(y)), with prime endpoint atoms included consistently. It has the actual fixed prime coefficients. No replacement by arbitrary weights or a PNT envelope is made.

Define E_Delta=x integral_1^Q v^(2x-1)|Delta(v)|^2 dv. The L2 triangle inequality and (2) give

sqrt(Var_Px S_prime)
 <=sqrt(E_Delta)+(K/sqrt(2)) Q^(1-s0)/T.                    (3)

The signed mean satisfies
integral S_prime dP_x=Re Delta(1)+Re D(1),
so the smooth part of the mean costs at most K Q^(1-b)/T. Together with the bounded higher-prime-power remainder C(s0), these are explicit deterministic payments in the previous clipping criterion.

This isolates a genuinely signed actual-prime problem: bound E_Delta and the appropriate one-sided Re Delta(1), uniformly at every target carrier, within the finite-rectangle margin. A pointwise PNT envelope substituted with absolute values is not such an estimate. Equation (2) pays the smooth density, but does not pay Delta, establish an effective onset for the full criterion, or complete the requested curve.
